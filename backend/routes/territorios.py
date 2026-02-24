"""CRUD para comunidades y pilotos."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.entidades import Comunidad, Piloto

router = APIRouter()


# --- Comunidades ---
class ComunidadCreate(BaseModel):
    nombre: str
    paisaje_id: int
    municipio: Optional[str] = None
    descripcion: Optional[str] = None


class ComunidadOut(ComunidadCreate):
    id: int
    class Config:
        from_attributes = True


@router.get("/comunidades", response_model=list[ComunidadOut])
def listar_comunidades(paisaje_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Comunidad)
    if paisaje_id:
        q = q.filter(Comunidad.paisaje_id == paisaje_id)
    return q.all()


@router.post("/comunidades", response_model=ComunidadOut, status_code=201)
def crear_comunidad(data: ComunidadCreate, db: Session = Depends(get_db)):
    obj = Comunidad(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# --- Pilotos ---
class PilotoCreate(BaseModel):
    nombre: str
    organizacion_id: int
    paisaje_id: int
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    descripcion: Optional[str] = None
    estado: Optional[str] = "activo"


class PilotoOut(PilotoCreate):
    id: int
    class Config:
        from_attributes = True


@router.get("/pilotos", response_model=list[PilotoOut])
def listar_pilotos(paisaje_id: Optional[int] = None, organizacion_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Piloto)
    if paisaje_id:
        q = q.filter(Piloto.paisaje_id == paisaje_id)
    if organizacion_id:
        q = q.filter(Piloto.organizacion_id == organizacion_id)
    return q.all()


@router.post("/pilotos", response_model=PilotoOut, status_code=201)
def crear_piloto(data: PilotoCreate, db: Session = Depends(get_db)):
    obj = Piloto(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/pilotos/{id}", response_model=PilotoOut)
def obtener_piloto(id: int, db: Session = Depends(get_db)):
    obj = db.query(Piloto).get(id)
    if not obj:
        raise HTTPException(404, "Piloto no encontrado")
    return obj
