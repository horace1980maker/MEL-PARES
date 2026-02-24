"""
Modelo para Evidencia con enlaces a indicador/LQ/hito.
"""
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class Evidencia(Base):
    __tablename__ = "evidencias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tipo = Column(String(50), nullable=False)  # documento, foto, texto, video
    archivo_url = Column(String(500))
    texto = Column(Text)
    fecha = Column(Date, nullable=False)
    autor = Column(String(200))
    tags = Column(String(500))  # tags separados por coma
    creado_en = Column(DateTime, default=datetime.utcnow)

    # Relaciones mediante tablas asociativas
    indicadores = relationship("EvidenciaIndicador", back_populates="evidencia", cascade="all, delete-orphan")
    preguntas = relationship("EvidenciaLQ", back_populates="evidencia", cascade="all, delete-orphan")
    hitos = relationship("EvidenciaHito", back_populates="evidencia", cascade="all, delete-orphan")


class EvidenciaIndicador(Base):
    __tablename__ = "evidencia_indicador"

    evidencia_id = Column(Integer, ForeignKey("evidencias.id"), primary_key=True)
    indicador_id = Column(Integer, ForeignKey("indicadores.id"), primary_key=True)

    evidencia = relationship("Evidencia", back_populates="indicadores")
    indicador = relationship("Indicador")


class EvidenciaLQ(Base):
    __tablename__ = "evidencia_lq"

    evidencia_id = Column(Integer, ForeignKey("evidencias.id"), primary_key=True)
    lq_id = Column(Integer, ForeignKey("preguntas_aprendizaje.id"), primary_key=True)

    evidencia = relationship("Evidencia", back_populates="preguntas")
    pregunta = relationship("PreguntaDeAprendizaje")


class EvidenciaHito(Base):
    __tablename__ = "evidencia_hito"

    evidencia_id = Column(Integer, ForeignKey("evidencias.id"), primary_key=True)
    hito_id = Column(Integer, ForeignKey("hitos.id"), primary_key=True)

    evidencia = relationship("Evidencia", back_populates="hitos")
    hito = relationship("Hito")
