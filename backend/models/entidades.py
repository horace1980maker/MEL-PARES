"""
Modelos para entidades base: Organización, Paisaje, Comunidad, Piloto.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class Organizacion(Base):
    __tablename__ = "organizaciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False, unique=True)
    siglas = Column(String(20))
    tipo = Column(String(100))  # ONG, gobierno, academia, etc.
    pais = Column(String(100))
    descripcion = Column(Text)

    pilotos = relationship("Piloto", back_populates="organizacion")
    mediciones = relationship("Medicion", back_populates="organizacion")


class Paisaje(Base):
    __tablename__ = "paisajes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False, unique=True)
    pais = Column(String(100))
    region = Column(String(200))
    latitud = Column(Float)
    longitud = Column(Float)
    descripcion = Column(Text)

    comunidades = relationship("Comunidad", back_populates="paisaje")
    pilotos = relationship("Piloto", back_populates="paisaje")
    mediciones = relationship("Medicion", back_populates="paisaje")


class Comunidad(Base):
    __tablename__ = "comunidades"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    paisaje_id = Column(Integer, ForeignKey("paisajes.id"), nullable=False)
    municipio = Column(String(200))
    descripcion = Column(Text)

    paisaje = relationship("Paisaje", back_populates="comunidades")


class Piloto(Base):
    __tablename__ = "pilotos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    organizacion_id = Column(Integer, ForeignKey("organizaciones.id"), nullable=False)
    paisaje_id = Column(Integer, ForeignKey("paisajes.id"), nullable=False)
    latitud = Column(Float)
    longitud = Column(Float)
    descripcion = Column(Text)
    estado = Column(String(50), default="activo")  # activo, completado, suspendido

    organizacion = relationship("Organizacion", back_populates="pilotos")
    paisaje = relationship("Paisaje", back_populates="pilotos")
    mediciones = relationship("Medicion", back_populates="piloto")
