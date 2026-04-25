"""API para la matriz MEL de socios con autenticacion simple por organizacion."""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import base64
import hashlib
import hmac
import json
import os
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.mel_socios import MelSocioIndicador

router = APIRouter()

SECRET = os.environ.get("MEL_SOCIOS_SECRET", "mel-pares-local-secret")

DEFAULT_ACCOUNTS = {
    "admin": {"password": "AdminPARES2026!", "organizacion": "Todas"},
    "biocomercio": {"password": "BioPARES2026!", "sheet": "Biocomercio"},
    "cecropia": {"password": "CecropiaPARES2026!", "sheet": "CECROPIA"},
    "asoverde": {"password": "AsoverdePARES2026!", "sheet": "ASOVERDE"},
    "foncet": {"password": "FoncetPARES2026!", "sheet": "FONCET"},
    "adel": {"password": "AdelPARES2026!", "sheet": "ADEL"},
    "coddeffagolf": {"password": "CoddeffaPARES2026!", "sheet": "CODDEFFAGOLF"},
    "eco": {"password": "EcoPARES2026!", "sheet": "ECO"},
    "fenaprocacaho": {"password": "FenaprocacahoPARES2026!", "sheet": "FENAPROCACAHO"},
    "defensores": {"password": "DefensoresPARES2026!", "sheet": "Defensores"},
    "toisan": {"password": "ToisanPARES2026!", "sheet": "Toisan"},
    "tierraviva": {"password": "TierraVivaPARES2026!", "sheet": "Tierra Viva"},
    "puca": {"password": "PucaPARES2026!", "sheet": "PUCA"},
}


def _to_text(value):
    if value is None:
        return None
    return str(value)


def _to_float(value):
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return float(value)
    try:
        return float(str(value).replace(",", "."))
    except ValueError:
        return None


def _num(value):
    parsed = _to_float(value)
    return parsed if parsed is not None else 0.0


def _calc_total(row):
    return _num(row.monitoreo_1) + _num(row.monitoreo_2) + _num(row.monitoreo_3) + _num(row.monitoreo_4)


def _calc_progress(total, target):
    if not target:
        return 0.0
    return total / target


def _slug(value):
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "", ascii_value.lower())


def _sign(payload):
    return hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()


def _make_token(username, organizacion):
    payload = f"{username}|{organizacion}"
    raw = f"{payload}|{_sign(payload)}"
    return base64.urlsafe_b64encode(raw.encode()).decode()


def _read_token(authorization):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Credenciales requeridas")
    try:
        raw = base64.urlsafe_b64decode(authorization.split(" ", 1)[1].encode()).decode()
        username, organizacion, signature = raw.rsplit("|", 2)
    except Exception as exc:
        raise HTTPException(401, "Token invalido") from exc
    payload = f"{username}|{organizacion}"
    if not hmac.compare_digest(signature, _sign(payload)):
        raise HTTPException(401, "Token invalido")
    return {"username": username, "organizacion": organizacion}


def _credentials(db):
    sheet_orgs = {
        sheet: org
        for sheet, org in db.query(MelSocioIndicador.sheet, MelSocioIndicador.organizacion).distinct().all()
    }
    users = {}
    for username, account in DEFAULT_ACCOUNTS.items():
        password = os.environ.get(f"MEL_SOCIOS_PASSWORD_{username.upper()}", account["password"])
        organizacion = account.get("organizacion") or sheet_orgs.get(account.get("sheet"))
        if organizacion:
            users[username] = {"password": password, "organizacion": organizacion}
    extra = os.environ.get("MEL_SOCIOS_USERS")
    if extra:
        users.update(json.loads(extra))
    return users


def seed_mel_socios(db):
    if db.query(MelSocioIndicador).count() > 0:
        return
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    prototype = os.path.join(root, "PARES_MEL_Dashboard_Prototype (1).html")
    if not os.path.exists(prototype):
        return
    with open(prototype, "r", encoding="utf-8") as fh:
        html = fh.read()
    match = re.search(r'<script id="seed-data" type="application/json">(.*?)</script>', html, re.S)
    if not match:
        return
    data = json.loads(match.group(1))
    rows = []
    for rec in data.get("records", []):
        monitoring = rec.get("monitoring") or []
        notes = rec.get("notes") or []
        rows.append(MelSocioIndicador(
            source_id=rec.get("id"),
            organizacion=rec.get("organization") or rec.get("sheet") or "Sin organizacion",
            sheet=rec.get("sheet") or "",
            excel_row=rec.get("row"),
            tipo=rec.get("type") or "outcome",
            descripcion_esperada=rec.get("expected"),
            indicador=rec.get("indicator") or "",
            linea_base=_to_text(rec.get("baseline")),
            monitoreo_1=_to_text(monitoring[0] if len(monitoring) > 0 else None),
            monitoreo_2=_to_text(monitoring[1] if len(monitoring) > 1 else None),
            monitoreo_3=_to_text(monitoring[2] if len(monitoring) > 2 else None),
            monitoreo_4=_to_text(monitoring[3] if len(monitoring) > 3 else None),
            total_acumulado=_to_float(rec.get("total")) or 0,
            meta_numerica=_to_float(rec.get("target_numeric")),
            porcentaje_avance=_to_float(rec.get("progress")) or 0,
            meta_descriptiva=rec.get("target_description"),
            observacion_1=notes[0] if len(notes) > 0 else None,
            observacion_2=notes[1] if len(notes) > 1 else None,
            observacion_3=notes[2] if len(notes) > 2 else None,
            observacion_4=notes[3] if len(notes) > 3 else None,
            estado_validacion="importado",
            updated_by="seed:excel",
        ))
    db.add_all(rows)
    db.commit()


class LoginIn(BaseModel):
    username: str
    password: str


class MelSocioPatch(BaseModel):
    linea_base: Optional[str] = None
    monitoreo_1: Optional[str] = None
    monitoreo_2: Optional[str] = None
    monitoreo_3: Optional[str] = None
    monitoreo_4: Optional[str] = None
    meta_numerica: Optional[float] = None
    meta_descriptiva: Optional[str] = None
    observacion_1: Optional[str] = None
    observacion_2: Optional[str] = None
    observacion_3: Optional[str] = None
    observacion_4: Optional[str] = None
    responsable: Optional[str] = None
    evidencia_url: Optional[str] = None


def _out(row):
    return {
        "id": row.id,
        "source_id": row.source_id,
        "organizacion": row.organizacion,
        "sheet": row.sheet,
        "row": row.excel_row,
        "tipo": row.tipo,
        "descripcion_esperada": row.descripcion_esperada,
        "indicador": row.indicador,
        "linea_base": row.linea_base,
        "monitoring": [row.monitoreo_1, row.monitoreo_2, row.monitoreo_3, row.monitoreo_4],
        "total_acumulado": row.total_acumulado or 0,
        "meta_numerica": row.meta_numerica,
        "porcentaje_avance": row.porcentaje_avance or 0,
        "meta_descriptiva": row.meta_descriptiva,
        "notes": [row.observacion_1, row.observacion_2, row.observacion_3, row.observacion_4],
        "responsable": row.responsable,
        "evidencia_url": row.evidencia_url,
        "estado_validacion": row.estado_validacion,
        "updated_by": row.updated_by,
        "updated_at": row.updated_at.isoformat() if row.updated_at else None,
    }


@router.post("/mel-socios/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    seed_mel_socios(db)
    user = _credentials(db).get(data.username.strip().lower())
    if not user or not hmac.compare_digest(user["password"], data.password):
        raise HTTPException(401, "Usuario o contrasena invalida")
    return {
        "token": _make_token(data.username.strip().lower(), user["organizacion"]),
        "username": data.username.strip().lower(),
        "organizacion": user["organizacion"],
    }


@router.get("/mel-socios/organizaciones")
def organizaciones(db: Session = Depends(get_db)):
    seed_mel_socios(db)
    return [r[0] for r in db.query(MelSocioIndicador.organizacion).distinct().order_by(MelSocioIndicador.organizacion).all()]


@router.get("/mel-socios")
def listar(organizacion: Optional[str] = None, tipo: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    seed_mel_socios(db)
    q = db.query(MelSocioIndicador)
    if organizacion and organizacion != "Todas":
        q = q.filter(MelSocioIndicador.organizacion == organizacion)
    if tipo and tipo != "all":
        q = q.filter(MelSocioIndicador.tipo == tipo)
    if search:
        like = f"%{search}%"
        q = q.filter((MelSocioIndicador.indicador.ilike(like)) | (MelSocioIndicador.descripcion_esperada.ilike(like)))
    rows = q.order_by(MelSocioIndicador.organizacion, MelSocioIndicador.tipo, MelSocioIndicador.excel_row).all()
    return [_out(row) for row in rows]


@router.get("/mel-socios/resumen")
def resumen(organizacion: Optional[str] = None, db: Session = Depends(get_db)):
    seed_mel_socios(db)
    q = db.query(MelSocioIndicador)
    if organizacion and organizacion != "Todas":
        q = q.filter(MelSocioIndicador.organizacion == organizacion)
    rows = q.all()
    by_org = {}
    by_type = {"outcome": [], "output": []}
    for row in rows:
        by_org.setdefault(row.organizacion, []).append(row)
        by_type.setdefault(row.tipo, []).append(row)
    orgs = []
    for org, values in sorted(by_org.items()):
        avg = sum((v.porcentaje_avance or 0) for v in values) / len(values) if values else 0
        orgs.append({
            "organizacion": org,
            "indicadores": len(values),
            "outcomes": sum(1 for v in values if v.tipo == "outcome"),
            "outputs": sum(1 for v in values if v.tipo == "output"),
            "avance_promedio": avg,
        })
    balance = []
    for key, values in by_type.items():
        avg = sum((v.porcentaje_avance or 0) for v in values) / len(values) if values else 0
        balance.append({
            "tipo": key,
            "indicadores": len(values),
            "cumplidos": sum(1 for v in values if (v.porcentaje_avance or 0) >= 1),
            "avance_promedio": avg,
        })
    return {
        "total_indicadores": len(rows),
        "organizaciones": orgs,
        "balance": balance,
        "avance_promedio": sum((r.porcentaje_avance or 0) for r in rows) / len(rows) if rows else 0,
    }


@router.patch("/mel-socios/{id}")
def actualizar(id: int, data: MelSocioPatch, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    seed_mel_socios(db)
    auth = _read_token(authorization)
    row = db.query(MelSocioIndicador).get(id)
    if not row:
        raise HTTPException(404, "Indicador no encontrado")
    if auth["organizacion"] != "Todas" and auth["organizacion"] != row.organizacion:
        raise HTTPException(403, "Este usuario solo puede editar su organizacion")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    row.total_acumulado = _calc_total(row)
    row.porcentaje_avance = _calc_progress(row.total_acumulado, row.meta_numerica)
    row.updated_by = auth["username"]
    row.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(row)
    return _out(row)
