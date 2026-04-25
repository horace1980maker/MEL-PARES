"""Modelos para la matriz MEL de socios importada desde el Excel."""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from datetime import datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class MelSocioIndicador(Base):
    __tablename__ = "mel_socios_indicadores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_id = Column(String(120), nullable=False, unique=True)
    organizacion = Column(String(250), nullable=False, index=True)
    sheet = Column(String(120), nullable=False)
    excel_row = Column(Integer)
    tipo = Column(String(20), nullable=False, index=True)
    descripcion_esperada = Column(Text)
    indicador = Column(Text, nullable=False)
    linea_base = Column(Text)
    monitoreo_1 = Column(Text)
    monitoreo_2 = Column(Text)
    monitoreo_3 = Column(Text)
    monitoreo_4 = Column(Text)
    total_acumulado = Column(Float, default=0)
    meta_numerica = Column(Float)
    porcentaje_avance = Column(Float, default=0)
    meta_descriptiva = Column(Text)
    observacion_1 = Column(Text)
    observacion_2 = Column(Text)
    observacion_3 = Column(Text)
    observacion_4 = Column(Text)
    responsable = Column(String(200))
    evidencia_url = Column(Text)
    estado_validacion = Column(String(40), default="borrador")
    updated_by = Column(String(120))
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
