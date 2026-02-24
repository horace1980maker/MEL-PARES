"""CRUD para organizaciones."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.entidades import Organizacion

router = APIRouter()


class OrganizacionCreate(BaseModel):
    nombre: str
    siglas: Optional[str] = None
    tipo: Optional[str] = None
    pais: Optional[str] = None
    descripcion: Optional[str] = None


class OrganizacionOut(OrganizacionCreate):
    id: int
    class Config:
        from_attributes = True


@router.get("/organizaciones", response_model=list[OrganizacionOut])
def listar(db: Session = Depends(get_db)):
    return db.query(Organizacion).all()


@router.get("/organizaciones/{id}", response_model=OrganizacionOut)
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.query(Organizacion).get(id)
    if not obj:
        raise HTTPException(404, "Organización no encontrada")
    return obj


@router.post("/organizaciones", response_model=OrganizacionOut, status_code=201)
def crear(data: OrganizacionCreate, db: Session = Depends(get_db)):
    obj = Organizacion(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/organizaciones/{id}", response_model=OrganizacionOut)
def actualizar(id: int, data: OrganizacionCreate, db: Session = Depends(get_db)):
    obj = db.query(Organizacion).get(id)
    if not obj:
        raise HTTPException(404, "Organización no encontrada")
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/organizaciones/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.query(Organizacion).get(id)
    if not obj:
        raise HTTPException(404, "Organización no encontrada")
    db.delete(obj)
    db.commit()
