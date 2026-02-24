"""Endpoint de exportación PDF (placeholder — requiere weasyprint instalado)."""
from fastapi import APIRouter, Depends, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.medicion import Medicion
from models.mel import Indicador
from models.entidades import Organizacion, Paisaje


router = APIRouter()


@router.get("/exportar/pdf", response_class=HTMLResponse)
def exportar_pdf(
    indicador_id: Optional[int] = None,
    organizacion_id: Optional[int] = None,
    paisaje_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """
    Genera un reporte HTML descargable (para convertir a PDF con weasyprint o imprimir desde el navegador).
    """
    # Filtrar mediciones
    q = db.query(Medicion)
    if indicador_id:
        q = q.filter(Medicion.indicador_id == indicador_id)
    if organizacion_id:
        q = q.filter(Medicion.organizacion_id == organizacion_id)
    if paisaje_id:
        q = q.filter(Medicion.paisaje_id == paisaje_id)
    mediciones = q.order_by(Medicion.fecha).all()

    indicadores = {i.id: i for i in db.query(Indicador).all()}

    # Determinar título
    titulo = "Reporte MEL-PARES"
    if organizacion_id:
        org = db.query(Organizacion).get(organizacion_id)
        if org:
            titulo += f" — {org.nombre}"
    if paisaje_id:
        pai = db.query(Paisaje).get(paisaje_id)
        if pai:
            titulo += f" — {pai.nombre}"

    rows = ""
    for m in mediciones:
        ind = indicadores.get(m.indicador_id)
        rows += f"""<tr>
            <td>{ind.codigo if ind else m.indicador_id}</td>
            <td>{ind.nombre if ind else '—'}</td>
            <td>{m.fecha}</td>
            <td>{m.valor}</td>
            <td>{m.responsable or '—'}</td>
            <td>{m.notas or '—'}</td>
        </tr>"""

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{titulo}</title>
    <style>
        body {{ font-family: 'Noto Sans', sans-serif; margin: 2rem; color: #1e293b; }}
        h1 {{ font-family: 'Oswald', sans-serif; color: #001F89; border-bottom: 3px solid #B71373; padding-bottom: 0.5rem; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 1rem; }}
        th {{ background: #001F89; color: white; padding: 0.5rem; text-align: left; font-size: 0.85rem; }}
        td {{ padding: 0.4rem 0.5rem; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; }}
        tr:nth-child(even) td {{ background: #f8f9fc; }}
        .footer {{ margin-top: 2rem; font-size: 0.75rem; color: #64748b; text-align: center; }}
        @media print {{ body {{ margin: 0.5cm; }} }}
    </style>
</head>
<body>
    <h1>{titulo}</h1>
    <p>Total de mediciones: {len(mediciones)}</p>
    <table>
        <thead><tr><th>Código</th><th>Indicador</th><th>Fecha</th><th>Valor</th><th>Responsable</th><th>Notas</th></tr></thead>
        <tbody>{rows if rows else '<tr><td colspan="6" style="text-align:center;color:#94a3b8">Sin datos</td></tr>'}</tbody>
    </table>
    <div class="footer">
        MEL-PARES Dashboard — EU-UNEP Partnership / Proyecto PARES
    </div>
</body>
</html>"""

    return HTMLResponse(content=html)
