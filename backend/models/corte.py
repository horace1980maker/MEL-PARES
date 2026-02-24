"""
Modelo para Corte (snapshot) de reporte.
"""
from sqlalchemy import Column, Integer, Float, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class Corte(Base):
    __tablename__ = "cortes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    fecha = Column(Date, nullable=False)
    descripcion = Column(Text)
    creado_en = Column(DateTime, default=datetime.utcnow)

    detalles = relationship("CorteDetalle", back_populates="corte", cascade="all, delete-orphan")


class CorteDetalle(Base):
    __tablename__ = "corte_detalles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    corte_id = Column(Integer, ForeignKey("cortes.id"), nullable=False)
    medicion_id = Column(Integer, ForeignKey("mediciones.id"), nullable=False)
    valor_snapshot = Column(Float, nullable=False)

    corte = relationship("Corte", back_populates="detalles")
    medicion = relationship("Medicion")
