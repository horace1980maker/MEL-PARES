"""CRUD para evidencias con filtrado múltiple."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.evidencia import Evidencia, EvidenciaIndicador, EvidenciaLQ, EvidenciaHito

router = APIRouter()


class EvidenciaCreate(BaseModel):
    tipo: str
    archivo_url: Optional[str] = None
    texto: Optional[str] = None
    fecha: date
    autor: Optional[str] = None
    tags: Optional[str] = None
    indicador_ids: Optional[list[int]] = []
    lq_ids: Optional[list[int]] = []
    hito_ids: Optional[list[int]] = []


class EvidenciaOut(BaseModel):
    id: int; tipo: str; archivo_url: Optional[str] = None; texto: Optional[str] = None
    fecha: date; autor: Optional[str] = None; tags: Optional[str] = None
    creado_en: Optional[datetime] = None
    class Config:
        from_attributes = True


@router.get("/evidencias", response_model=list[EvidenciaOut])
def listar(
    indicador_id: Optional[int] = None,
    lq_id: Optional[int] = None,
    tipo: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Evidencia)
    if tipo:
        q = q.filter(Evidencia.tipo == tipo)
    if indicador_id:
        q = q.join(EvidenciaIndicador).filter(EvidenciaIndicador.indicador_id == indicador_id)
    if lq_id:
        q = q.join(EvidenciaLQ).filter(EvidenciaLQ.lq_id == lq_id)
    return q.order_by(Evidencia.fecha.desc()).all()


@router.post("/evidencias", response_model=EvidenciaOut, status_code=201)
def crear(data: EvidenciaCreate, db: Session = Depends(get_db)):
    obj = Evidencia(
        tipo=data.tipo, archivo_url=data.archivo_url, texto=data.texto,
        fecha=data.fecha, autor=data.autor, tags=data.tags,
    )
    db.add(obj)
    db.flush()
    for iid in (data.indicador_ids or []):
        db.add(EvidenciaIndicador(evidencia_id=obj.id, indicador_id=iid))
    for lid in (data.lq_ids or []):
        db.add(EvidenciaLQ(evidencia_id=obj.id, lq_id=lid))
    for hid in (data.hito_ids or []):
        db.add(EvidenciaHito(evidencia_id=obj.id, hito_id=hid))
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/evidencias/{id}", response_model=EvidenciaOut)
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.query(Evidencia).get(id)
    if not obj:
        raise HTTPException(404, "Evidencia no encontrada")
    return obj


@router.delete("/evidencias/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.query(Evidencia).get(id)
    if not obj:
        raise HTTPException(404, "Evidencia no encontrada")
    db.delete(obj)
    db.commit()
