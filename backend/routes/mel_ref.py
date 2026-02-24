"""CRUD para indicadores, preguntas de aprendizaje, instrumentos e hitos."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.mel import Indicador, PreguntaDeAprendizaje, Instrumento, Hito

router = APIRouter()


# --- Indicadores ---
class IndicadorOut(BaseModel):
    id: int; codigo: str; nombre: str; tipo: str
    unidad: Optional[str] = None; baseline: Optional[str] = None; meta: Optional[str] = None
    descripcion: Optional[str] = None
    class Config:
        from_attributes = True

@router.get("/indicadores", response_model=list[IndicadorOut])
def listar_indicadores(tipo: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Indicador)
    if tipo:
        q = q.filter(Indicador.tipo == tipo)
    return q.all()

@router.get("/indicadores/{id}", response_model=IndicadorOut)
def obtener_indicador(id: int, db: Session = Depends(get_db)):
    obj = db.query(Indicador).get(id)
    if not obj:
        raise HTTPException(404, "Indicador no encontrado")
    return obj


# --- Preguntas de aprendizaje ---
class LQOut(BaseModel):
    id: int; codigo: str; texto: str; descripcion: Optional[str] = None
    class Config:
        from_attributes = True

@router.get("/preguntas", response_model=list[LQOut])
def listar_preguntas(db: Session = Depends(get_db)):
    return db.query(PreguntaDeAprendizaje).all()

@router.get("/preguntas/{id}", response_model=LQOut)
def obtener_pregunta(id: int, db: Session = Depends(get_db)):
    obj = db.query(PreguntaDeAprendizaje).get(id)
    if not obj:
        raise HTTPException(404, "Pregunta no encontrada")
    return obj


# --- Instrumentos ---
class InstrumentoOut(BaseModel):
    id: int; nombre: str; tipo: Optional[str] = None; descripcion: Optional[str] = None
    class Config:
        from_attributes = True

@router.get("/instrumentos", response_model=list[InstrumentoOut])
def listar_instrumentos(db: Session = Depends(get_db)):
    return db.query(Instrumento).all()


# --- Hitos ---
class HitoOut(BaseModel):
    id: int; nombre: str; estado: Optional[str] = None; responsable: Optional[str] = None
    fecha_planificada: Optional[date] = None; fecha_real: Optional[date] = None
    descripcion: Optional[str] = None
    class Config:
        from_attributes = True

@router.get("/hitos", response_model=list[HitoOut])
def listar_hitos(estado: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Hito)
    if estado:
        q = q.filter(Hito.estado == estado)
    return q.order_by(Hito.fecha_planificada).all()

@router.get("/hitos/{id}", response_model=HitoOut)
def obtener_hito(id: int, db: Session = Depends(get_db)):
    obj = db.query(Hito).get(id)
    if not obj:
        raise HTTPException(404, "Hito no encontrado")
    return obj
