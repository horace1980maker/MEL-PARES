"""Modelo para la linea de tiempo editable de Ruta del Proyecto."""
from datetime import datetime
import os
import sys

from sqlalchemy import Column, DateTime, Integer, String, Text

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class RutaTimelineItem(Base):
    __tablename__ = "ruta_timeline_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_id = Column(String(120), nullable=False, unique=True)
    excel_row = Column(Integer)
    codigo = Column(String(120), nullable=False)
    output = Column(String(40))
    orden = Column(Integer, index=True)
    anio = Column(Integer, index=True)
    mes = Column(String(40), index=True)
    entregable = Column(Text, nullable=False)
    estado = Column(String(80), index=True)
    updated_by = Column(String(120))
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
