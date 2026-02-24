"""
Modelo para Changelog de mediciones.
"""
from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class ChangelogMedicion(Base):
    __tablename__ = "changelog_mediciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    medicion_id = Column(Integer, ForeignKey("mediciones.id"), nullable=False)
    valor_anterior = Column(Float)
    valor_nuevo = Column(Float, nullable=False)
    fecha_cambio = Column(DateTime, default=datetime.utcnow)
    responsable = Column(String(200))
    notas = Column(Text)

    medicion = relationship("Medicion")
