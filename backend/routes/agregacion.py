"""Endpoints de agregación: progreso por indicador y resúmenes."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models.medicion import Medicion
from models.mel import Indicador
from models.evidencia import EvidenciaIndicador

router = APIRouter()


@router.get("/progreso")
def progreso_por_indicador(indicador_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Calcula progreso = (actual - baseline) / (meta - baseline) acotado 0..1.
    Retorna progreso y calidad de evidencia para cada indicador.
    """
    q = db.query(Indicador)
    if indicador_id:
        q = q.filter(Indicador.id == indicador_id)
    indicadores = q.all()

    resultados = []
    for ind in indicadores:
        # Último valor medido
        ultima = db.query(Medicion).filter(
            Medicion.indicador_id == ind.id
        ).order_by(Medicion.fecha.desc()).first()

        actual = ultima.valor if ultima else 0
        try:
            baseline = float(ind.baseline) if ind.baseline else 0
            meta = float(ind.meta) if ind.meta else 0
        except (ValueError, TypeError):
            baseline, meta = 0, 0

        denominador = meta - baseline
        if denominador > 0:
            progreso = max(0, min(1, (actual - baseline) / denominador))
        else:
            progreso = 0

        # Calidad de evidencia: contar instrumentos distintos
        n_instrumentos = db.query(func.count(func.distinct(Medicion.instrumento_id))).filter(
            Medicion.indicador_id == ind.id
        ).scalar() or 0

        n_evidencias = db.query(func.count(EvidenciaIndicador.evidencia_id)).filter(
            EvidenciaIndicador.indicador_id == ind.id
        ).scalar() or 0

        if n_instrumentos >= 2 and n_evidencias >= 2:
            calidad = "alta"
        elif n_instrumentos >= 1 or n_evidencias >= 1:
            calidad = "media"
        else:
            calidad = "baja"

        resultados.append({
            "indicador_id": ind.id,
            "codigo": ind.codigo,
            "nombre": ind.nombre,
            "tipo": ind.tipo,
            "baseline": baseline,
            "actual": actual,
            "meta": meta,
            "progreso": round(progreso, 4),
            "calidad_evidencia": calidad,
            "num_mediciones": db.query(func.count(Medicion.id)).filter(Medicion.indicador_id == ind.id).scalar(),
        })

    return resultados


@router.get("/resumen")
def resumen_general(db: Session = Depends(get_db)):
    """Resumen general de conteos para el dashboard."""
    from models.entidades import Organizacion, Paisaje, Piloto
    from models.mel import Hito
    from models.evidencia import Evidencia

    return {
        "total_organizaciones": db.query(func.count(Organizacion.id)).scalar(),
        "total_paisajes": db.query(func.count(Paisaje.id)).scalar(),
        "total_pilotos": db.query(func.count(Piloto.id)).scalar(),
        "total_mediciones": db.query(func.count(Medicion.id)).scalar(),
        "total_evidencias": db.query(func.count(Evidencia.id)).scalar(),
        "total_hitos": db.query(func.count(Hito.id)).scalar(),
        "hitos_completados": db.query(func.count(Hito.id)).filter(Hito.estado == "completado").scalar(),
    }
