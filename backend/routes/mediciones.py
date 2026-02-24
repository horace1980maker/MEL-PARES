"""CRUD para mediciones con changelog automático."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.medicion import Medicion
from models.changelog import ChangelogMedicion

router = APIRouter()


class MedicionCreate(BaseModel):
    indicador_id: int
    fecha: date
    valor: float
    unidad_de_analisis: Optional[str] = None
    organizacion_id: Optional[int] = None
    paisaje_id: Optional[int] = None
    piloto_id: Optional[int] = None
    instrumento_id: int
    responsable: Optional[str] = None
    muestra: Optional[str] = None
    notas: Optional[str] = None


class MedicionOut(MedicionCreate):
    id: int
    creado_en: Optional[datetime] = None
    class Config:
        from_attributes = True


@router.get("/mediciones", response_model=list[MedicionOut])
def listar(
    indicador_id: Optional[int] = None,
    paisaje_id: Optional[int] = None,
    organizacion_id: Optional[int] = None,
    piloto_id: Optional[int] = None,
    fecha_desde: Optional[date] = None,
    fecha_hasta: Optional[date] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Medicion)
    if indicador_id:
        q = q.filter(Medicion.indicador_id == indicador_id)
    if paisaje_id:
        q = q.filter(Medicion.paisaje_id == paisaje_id)
    if organizacion_id:
        q = q.filter(Medicion.organizacion_id == organizacion_id)
    if piloto_id:
        q = q.filter(Medicion.piloto_id == piloto_id)
    if fecha_desde:
        q = q.filter(Medicion.fecha >= fecha_desde)
    if fecha_hasta:
        q = q.filter(Medicion.fecha <= fecha_hasta)
    return q.order_by(Medicion.fecha.desc()).all()


@router.post("/mediciones", response_model=MedicionOut, status_code=201)
def crear(data: MedicionCreate, db: Session = Depends(get_db)):
    obj = Medicion(**data.model_dump())
    db.add(obj)
    db.flush()
    log = ChangelogMedicion(
        medicion_id=obj.id,
        valor_anterior=None,
        valor_nuevo=obj.valor,
        responsable=obj.responsable,
        notas="Creación inicial",
    )
    db.add(log)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/mediciones/{id}", response_model=MedicionOut)
def actualizar(id: int, data: MedicionCreate, db: Session = Depends(get_db)):
    obj = db.query(Medicion).get(id)
    if not obj:
        raise HTTPException(404, "Medición no encontrada")
    valor_anterior = obj.valor
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    if valor_anterior != obj.valor:
        log = ChangelogMedicion(
            medicion_id=obj.id,
            valor_anterior=valor_anterior,
            valor_nuevo=obj.valor,
            responsable=obj.responsable,
        )
        db.add(log)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/mediciones/{id}", response_model=MedicionOut)
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.query(Medicion).get(id)
    if not obj:
        raise HTTPException(404, "Medición no encontrada")
    return obj


@router.delete("/mediciones/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.query(Medicion).get(id)
    if not obj:
        raise HTTPException(404, "Medición no encontrada")
    db.delete(obj)
    db.commit()


class QuickUpdateIn(BaseModel):
    indicador_id: int
    valor: float
    notas: Optional[str] = "Ajustado desde dashboard"


@router.patch("/mediciones/quick-update", response_model=MedicionOut, status_code=201)
def quick_update(data: QuickUpdateIn, db: Session = Depends(get_db)):
    """Create a new measurement from a dashboard slider adjustment."""
    # Find last measurement for this indicator to reuse instrument
    ultima = db.query(Medicion).filter(
        Medicion.indicador_id == data.indicador_id
    ).order_by(Medicion.fecha.desc()).first()

    instrumento_id = ultima.instrumento_id if ultima else 1
    valor_anterior = ultima.valor if ultima else None

    obj = Medicion(
        indicador_id=data.indicador_id,
        fecha=date.today(),
        valor=data.valor,
        instrumento_id=instrumento_id,
        responsable="Dashboard",
        notas=data.notas,
    )
    db.add(obj)
    db.flush()

    log = ChangelogMedicion(
        medicion_id=obj.id,
        valor_anterior=valor_anterior,
        valor_nuevo=obj.valor,
        responsable="Dashboard",
        notas=data.notas,
    )
    db.add(log)
    db.commit()
    db.refresh(obj)
    return obj
