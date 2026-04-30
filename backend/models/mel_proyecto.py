"""Modelo para indicadores MEL a nivel de proyecto."""
from datetime import datetime
import os
import sys

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class MelProyectoIndicador(Base):
    __tablename__ = "mel_proyecto_indicadores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_id = Column(String(160), nullable=False, unique=True)
    excel_row = Column(Integer)
    tipo = Column(String(20), nullable=False, index=True)
    nivel = Column(Text)
    indicador = Column(Text, nullable=False)
    herramienta = Column(Text)
    evidencia = Column(Text)
    linea_base = Column(Text)
    meta = Column(Text)
    meta_numerica = Column(Float)
    avance = Column(Text)
    valor_actual = Column(Float, default=0)
    porcentaje = Column(Text)
    porcentaje_avance = Column(Float, default=0)
    fuente_informacion = Column(Text)
    frecuencia = Column(Text)
    lq = Column(Text)
    notas = Column(Text)
    estado_fuente = Column(String(40), default="completo")
    source_hash = Column(String(64))
    updated_by = Column(String(120))
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
