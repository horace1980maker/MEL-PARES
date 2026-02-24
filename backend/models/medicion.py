"""
Modelo para Medición con todos los campos requeridos.
"""
from sqlalchemy import Column, Integer, String, Float, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class Medicion(Base):
    __tablename__ = "mediciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    indicador_id = Column(Integer, ForeignKey("indicadores.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    valor = Column(Float, nullable=False)
    unidad_de_analisis = Column(String(100))  # organización, paisaje, piloto
    organizacion_id = Column(Integer, ForeignKey("organizaciones.id"), nullable=True)
    paisaje_id = Column(Integer, ForeignKey("paisajes.id"), nullable=True)
    piloto_id = Column(Integer, ForeignKey("pilotos.id"), nullable=True)
    instrumento_id = Column(Integer, ForeignKey("instrumentos.id"), nullable=False)
    responsable = Column(String(200))
    muestra = Column(String(200))
    notas = Column(Text)
    creado_en = Column(DateTime, default=datetime.utcnow)
    actualizado_en = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    indicador = relationship("Indicador", back_populates="mediciones")
    organizacion = relationship("Organizacion", back_populates="mediciones")
    paisaje = relationship("Paisaje", back_populates="mediciones")
    piloto = relationship("Piloto", back_populates="mediciones")
    instrumento = relationship("Instrumento", back_populates="mediciones")
