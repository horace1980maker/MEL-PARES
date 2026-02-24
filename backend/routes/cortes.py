"""Endpoints para gestión de cortes (snapshots)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.corte import Corte, CorteDetalle
from models.medicion import Medicion

router = APIRouter()


class CorteCreate(BaseModel):
    nombre: str
    fecha: date
    descripcion: Optional[str] = None


class CorteOut(BaseModel):
    id: int; nombre: str; fecha: date; descripcion: Optional[str] = None
    creado_en: Optional[datetime] = None
    class Config:
        from_attributes = True


@router.get("/cortes", response_model=list[CorteOut])
def listar_cortes(db: Session = Depends(get_db)):
    return db.query(Corte).order_by(Corte.fecha.desc()).all()


@router.post("/cortes", response_model=CorteOut, status_code=201)
def crear_corte(data: CorteCreate, db: Session = Depends(get_db)):
    """Crea un corte y captura snapshot de todas las mediciones actuales."""
    corte = Corte(**data.model_dump())
    db.add(corte)
    db.flush()

    mediciones = db.query(Medicion).all()
    for m in mediciones:
        detalle = CorteDetalle(
            corte_id=corte.id,
            medicion_id=m.id,
            valor_snapshot=m.valor,
        )
        db.add(detalle)

    db.commit()
    db.refresh(corte)
    return corte


@router.get("/cortes/comparar")
def comparar_cortes(corte1: int, corte2: int, db: Session = Depends(get_db)):
    """Compara dos cortes y retorna las diferencias en valores."""
    c1 = db.query(Corte).get(corte1)
    c2 = db.query(Corte).get(corte2)
    if not c1 or not c2:
        raise HTTPException(404, "Corte no encontrado")

    detalles1 = {d.medicion_id: d.valor_snapshot for d in c1.detalles}
    detalles2 = {d.medicion_id: d.valor_snapshot for d in c2.detalles}

    all_ids = set(detalles1.keys()) | set(detalles2.keys())
    diferencias = []
    for mid in all_ids:
        v1 = detalles1.get(mid)
        v2 = detalles2.get(mid)
        if v1 != v2:
            diferencias.append({
                "medicion_id": mid,
                "valor_corte_1": v1,
                "valor_corte_2": v2,
                "diferencia": (v2 or 0) - (v1 or 0),
            })

    return {
        "corte_1": {"id": c1.id, "nombre": c1.nombre, "fecha": str(c1.fecha)},
        "corte_2": {"id": c2.id, "nombre": c2.nombre, "fecha": str(c2.fecha)},
        "diferencias": diferencias,
    }
