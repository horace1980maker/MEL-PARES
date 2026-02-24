"""CRUD para paisajes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.entidades import Paisaje

router = APIRouter()


class PaisajeCreate(BaseModel):
    nombre: str
    pais: Optional[str] = None
    region: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    descripcion: Optional[str] = None


class PaisajeOut(PaisajeCreate):
    id: int
    class Config:
        from_attributes = True


@router.get("/paisajes", response_model=list[PaisajeOut])
def listar(db: Session = Depends(get_db)):
    return db.query(Paisaje).all()


@router.get("/paisajes/{id}", response_model=PaisajeOut)
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.query(Paisaje).get(id)
    if not obj:
        raise HTTPException(404, "Paisaje no encontrado")
    return obj


@router.post("/paisajes", response_model=PaisajeOut, status_code=201)
def crear(data: PaisajeCreate, db: Session = Depends(get_db)):
    obj = Paisaje(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/paisajes/{id}", response_model=PaisajeOut)
def actualizar(id: int, data: PaisajeCreate, db: Session = Depends(get_db)):
    obj = db.query(Paisaje).get(id)
    if not obj:
        raise HTTPException(404, "Paisaje no encontrado")
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/paisajes/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.query(Paisaje).get(id)
    if not obj:
        raise HTTPException(404, "Paisaje no encontrado")
    db.delete(obj)
    db.commit()
