"""
Punto de entrada principal - FastAPI con CORS, archivos estáticos y routers.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, Base
from models import *  # noqa: F401 — registra todos los modelos

from routes.organizaciones import router as org_router
from routes.paisajes import router as paisaje_router
from routes.territorios import router as terr_router
from routes.mel_ref import router as mel_router
from routes.mediciones import router as med_router
from routes.evidencias import router as ev_router
from routes.agregacion import router as agr_router
from routes.cortes import router as corte_router
from routes.exportar import router as export_router

# Crear tablas al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MEL-PARES Dashboard API",
    description="API REST para el Sistema MEL del Proyecto PARES",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Todos los routers bajo /api con sus paths completos en los decoradores
app.include_router(org_router, prefix="/api", tags=["Organizaciones"])
app.include_router(paisaje_router, prefix="/api", tags=["Paisajes"])
app.include_router(terr_router, prefix="/api", tags=["Territorios"])
app.include_router(mel_router, prefix="/api", tags=["MEL Referencia"])
app.include_router(med_router, prefix="/api", tags=["Mediciones"])
app.include_router(ev_router, prefix="/api", tags=["Evidencias"])
app.include_router(agr_router, prefix="/api/agregacion", tags=["Agregación"])
app.include_router(corte_router, prefix="/api", tags=["Cortes"])
app.include_router(export_router, prefix="/api", tags=["Exportar"])

# Servir frontend como archivos estáticos (DEBE ir al final)
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
