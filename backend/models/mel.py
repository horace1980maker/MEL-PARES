"""
Modelos para entidades MEL: Indicador, PreguntaDeAprendizaje, Instrumento, Hito.
"""
from sqlalchemy import Column, Integer, String, Text, Date, Table, ForeignKey
from sqlalchemy.orm import relationship
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


# Tabla asociativa indicador <-> pregunta de aprendizaje
indicador_lq = Table(
    "indicador_lq", Base.metadata,
    Column("indicador_id", Integer, ForeignKey("indicadores.id"), primary_key=True),
    Column("lq_id", Integer, ForeignKey("preguntas_aprendizaje.id"), primary_key=True),
)


class Indicador(Base):
    __tablename__ = "indicadores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False, unique=True)  # e.g. O1, O2, OC1
    nombre = Column(String(300), nullable=False)
    tipo = Column(String(20), nullable=False)  # output, outcome
    unidad = Column(String(100))
    baseline = Column(String(100))
    meta = Column(String(100))
    descripcion = Column(Text)

    preguntas = relationship("PreguntaDeAprendizaje", secondary=indicador_lq, back_populates="indicadores")
    mediciones = relationship("Medicion", back_populates="indicador")


class PreguntaDeAprendizaje(Base):
    __tablename__ = "preguntas_aprendizaje"

    id = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(10), nullable=False, unique=True)  # LQ1..LQ10
    texto = Column(Text, nullable=False)
    descripcion = Column(Text)

    indicadores = relationship("Indicador", secondary=indicador_lq, back_populates="preguntas")


class Instrumento(Base):
    __tablename__ = "instrumentos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(300), nullable=False)
    tipo = Column(String(100))  # encuesta, entrevista, pausa reflexiva, etc.
    descripcion = Column(Text)

    mediciones = relationship("Medicion", back_populates="instrumento")


class Hito(Base):
    __tablename__ = "hitos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(300), nullable=False)
    fecha_planificada = Column(Date)
    fecha_real = Column(Date)
    estado = Column(String(50), default="pendiente")  # pendiente, en_progreso, completado
    responsable = Column(String(200))
    descripcion = Column(Text)
