"""
Importador de datos desde el Excel de monitoreo PARES.

Reads: 20260424_Monitoreo-Cumplimiento-Proyectos-PARES.xlsx
Each sheet = one organization (socio implementador).
Row 4 = headers. Data rows have:
  A: Descripción esperada (outcome/output description)
  B: Indicador (indicator text)
  C: Línea base
  D-G: Monitoreo 1-4 values
  H: Total acumulado (formula)
  I: Meta numérica
  J: Porcentaje de avance (formula)
  K: Meta descriptiva
  L-O: Observaciones per monitoring period

Section markers:
  "RESULTADOS (OUTCOMES)" -> tipo = outcome
  "PRODUCTOS (OUTPUTS)"   -> tipo = output

Usage:
  python import_xlsx.py                          # local DB
  python import_xlsx.py --db sqlite:////data/mel_pares.db  # deployed DB
  python import_xlsx.py --xlsx path/to/file.xlsx  # custom xlsx path
"""
import sys
import os
import argparse
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# ── Parse args ──
parser = argparse.ArgumentParser(description="Import PARES monitoring xlsx into MEL-PARES database")
parser.add_argument("--xlsx", default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    "20260424_Monitoreo-Cumplimiento-Proyectos-PARES.xlsx"),
                    help="Path to the xlsx file")
parser.add_argument("--db", default=None, help="Database URL override (e.g. sqlite:////data/mel_pares.db)")
parser.add_argument("--reset", action="store_true", help="Drop all tables before importing")
args = parser.parse_args()

if args.db:
    os.environ["DATABASE_URL"] = args.db

# ── Imports after DB config ──
try:
    import openpyxl
except ImportError:
    print("ERROR: openpyxl is required. Install it with: pip install openpyxl")
    sys.exit(1)

from database import engine, Base, SessionLocal
from models import *
from models.entidades import Organizacion, Paisaje, Comunidad, Piloto
from models.mel import Indicador, PreguntaDeAprendizaje, Instrumento, Hito
from models.medicion import Medicion
from models.evidencia import Evidencia, EvidenciaIndicador, EvidenciaLQ
from models.changelog import ChangelogMedicion
from models.mel_socios import MelSocioIndicador

# Monitoring period dates
MONITOREO_DATES = {
    1: date(2025, 12, 15),  # Monitoreo 1 - DIC 25
    2: date(2026, 3, 15),   # Monitoreo 2 - MAR 26
    3: date(2026, 6, 15),   # Monitoreo 3 - JUN 26
    4: date(2026, 9, 15),   # Monitoreo 4 - SEPT 26
}


def safe_float(val):
    """Try to parse a float from a cell value, return None if not possible."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    try:
        return float(str(val).strip().replace(",", ""))
    except (ValueError, TypeError):
        return None


def safe_str(val, max_len=None):
    """Convert cell value to string, cleaning up None and trimming."""
    if val is None:
        return ""
    s = str(val).strip()
    if max_len:
        s = s[:max_len]
    return s


def import_xlsx(xlsx_path):
    """Main import function."""
    print(f"Loading: {xlsx_path}")
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    print(f"Found {len(wb.sheetnames)} sheets: {', '.join(wb.sheetnames)}")

    # ── Setup database ──
    if args.reset:
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if already has data
        existing_count = db.query(Indicador).count()
        if existing_count > 0 and not args.reset:
            print(f"\n[!] Database already has {existing_count} indicators.")
            print("   Use --reset flag to drop and reimport, or the data will be ADDED to existing data.")
            response = input("   Continue adding? [y/N]: ").strip().lower()
            if response != 'y':
                print("Aborted.")
                return

        # ── Create a default instrument for xlsx imports ──
        inst = db.query(Instrumento).filter(Instrumento.nombre == "Importación XLSX").first()
        if not inst:
            inst = Instrumento(nombre="Importación XLSX", tipo="importación",
                               descripcion="Datos importados desde el archivo Excel de monitoreo")
            db.add(inst)
            db.flush()
        instrumento_id = inst.id

        # ── Create a default paisaje if none exists ──
        paisaje = db.query(Paisaje).first()
        if not paisaje:
            paisaje = Paisaje(nombre="Proyecto PARES", pais="Centroamérica", region="Regional")
            db.add(paisaje)
            db.flush()

        # ── Track stats ──
        stats = {"orgs": 0, "indicadores": 0, "mediciones": 0, "mel_socios": 0, "skipped": 0}
        indicator_counter = 0

        # ── Process each sheet (= one organization) ──
        for sheet_name in wb.sheetnames:
            ws = wb[sheet_name]
            org_name = safe_str(ws.cell(1, 1).value) or sheet_name
            print(f"\n{'='*60}")
            print(f"Processing: {org_name} ({sheet_name})")
            print(f"{'='*60}")

            # Create or find organization
            org = db.query(Organizacion).filter(Organizacion.nombre == org_name).first()
            if not org:
                org = Organizacion(nombre=org_name, siglas=sheet_name, tipo="socio implementador")
                db.add(org)
                db.flush()
                stats["orgs"] += 1

            # ── Scan rows ──
            current_tipo = "outcome"  # Default section

            for row_num in range(3, ws.max_row + 1):
                cell_a = safe_str(ws.cell(row_num, 1).value)
                cell_b = safe_str(ws.cell(row_num, 2).value)

                # Detect section markers
                if "RESULTADOS" in cell_a.upper() and "OUTCOME" in cell_a.upper():
                    current_tipo = "outcome"
                    continue
                if "PRODUCTOS" in cell_a.upper() and "OUTPUT" in cell_a.upper():
                    current_tipo = "output"
                    continue

                # Skip header rows and empty rows
                if cell_a.upper().startswith("DESCRIPCI") or not cell_b or cell_b.upper().startswith("INDICADOR"):
                    continue

                # This is a data row
                descripcion = cell_a
                indicador_texto = cell_b
                linea_base_text = safe_str(ws.cell(row_num, 3).value)
                linea_base = safe_float(ws.cell(row_num, 3).value)
                m1 = safe_float(ws.cell(row_num, 4).value)
                m2 = safe_float(ws.cell(row_num, 5).value)
                m3 = safe_float(ws.cell(row_num, 6).value)
                m4 = safe_float(ws.cell(row_num, 7).value)
                meta = safe_float(ws.cell(row_num, 9).value)
                meta_desc = safe_str(ws.cell(row_num, 11).value)
                obs1 = safe_str(ws.cell(row_num, 12).value)
                obs2 = safe_str(ws.cell(row_num, 13).value)
                obs3 = safe_str(ws.cell(row_num, 14).value)
                obs4 = safe_str(ws.cell(row_num, 15).value)

                if not indicador_texto:
                    continue

                # ── Create or find indicator ──
                indicator_counter += 1
                codigo = f"{sheet_name[:4].upper()}-{current_tipo[0].upper()}{indicator_counter:02d}"

                ind = Indicador(
                    codigo=codigo,
                    nombre=indicador_texto[:300],
                    tipo=current_tipo,
                    unidad="",
                    baseline=str(linea_base) if linea_base is not None else linea_base_text[:100],
                    meta=str(meta) if meta is not None else "",
                    descripcion=f"{descripcion}\n\nMeta descriptiva: {meta_desc}" if meta_desc else descripcion,
                )
                db.add(ind)
                db.flush()
                stats["indicadores"] += 1
                print(f"  [{codigo}] {indicador_texto[:60]}...")

                # ── Create measurements for each monitoring period with data ──
                for period, val, obs in [(1, m1, obs1), (2, m2, obs2), (3, m3, obs3), (4, m4, obs4)]:
                    if val is not None:
                        med = Medicion(
                            indicador_id=ind.id,
                            fecha=MONITOREO_DATES[period],
                            valor=val,
                            instrumento_id=instrumento_id,
                            organizacion_id=org.id,
                            paisaje_id=paisaje.id,
                            responsable=org_name,
                            notas=f"Monitoreo {period}" + (f" - {obs[:200]}" if obs else ""),
                        )
                        db.add(med)
                        db.flush()

                        # Changelog
                        db.add(ChangelogMedicion(
                            medicion_id=med.id,
                            valor_anterior=None,
                            valor_nuevo=val,
                            responsable="Importación XLSX",
                            notas=f"Importado desde {sheet_name}",
                        ))
                        stats["mediciones"] += 1

                # ── Also populate mel_socios_indicadores table ──
                total_acum = sum(v for v in [m1, m2, m3, m4] if v is not None)
                pct_avance = (total_acum / meta) if meta and meta > 0 else 0.0
                source_id = f"{sheet_name}_{row_num}"

                mel_row = MelSocioIndicador(
                    source_id=source_id,
                    organizacion=org_name,
                    sheet=sheet_name,
                    excel_row=row_num,
                    tipo=current_tipo,
                    descripcion_esperada=descripcion,
                    indicador=indicador_texto,
                    linea_base=linea_base_text if linea_base_text else None,
                    monitoreo_1=safe_str(ws.cell(row_num, 4).value) or None,
                    monitoreo_2=safe_str(ws.cell(row_num, 5).value) or None,
                    monitoreo_3=safe_str(ws.cell(row_num, 6).value) or None,
                    monitoreo_4=safe_str(ws.cell(row_num, 7).value) or None,
                    total_acumulado=total_acum,
                    meta_numerica=meta,
                    porcentaje_avance=pct_avance,
                    meta_descriptiva=meta_desc or None,
                    observacion_1=obs1 or None,
                    observacion_2=obs2 or None,
                    observacion_3=obs3 or None,
                    observacion_4=obs4 or None,
                    estado_validacion="importado",
                    updated_by="import:xlsx",
                )
                db.add(mel_row)
                stats["mel_socios"] += 1

        db.commit()
        print(f"\n{'='*60}")
        print(f"[OK] Import complete!")
        print(f"   Organizations: {stats['orgs']}")
        print(f"   Indicators:    {stats['indicadores']}")
        print(f"   Measurements:  {stats['mediciones']}")
        print(f"   MEL socios:    {stats['mel_socios']}")
        print(f"{'='*60}")
        print(f"\nTo run the dashboard: uvicorn main:app --host 0.0.0.0 --port 8000")

    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] Error during import: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import_xlsx(args.xlsx)
