"""
Script de inicialización con datos semilla y demo para el dashboard.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, SessionLocal
from models import *
from models.entidades import Organizacion, Paisaje, Comunidad, Piloto
from models.mel import Indicador, PreguntaDeAprendizaje, Instrumento, Hito
from models.medicion import Medicion
from models.evidencia import Evidencia, EvidenciaIndicador, EvidenciaLQ
from models.changelog import ChangelogMedicion
from datetime import date


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Verificar si ya hay datos
    if db.query(Indicador).count() > 0:
        print("La BD ya contiene datos. Eliminando para re-inicializar...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    # ── Organizaciones ──
    orgs = [
        Organizacion(nombre="CATIE", siglas="CATIE", tipo="implementador", pais="Costa Rica"),
        Organizacion(nombre="UNEP", siglas="UNEP", tipo="agencia", pais="Internacional"),
        Organizacion(nombre="Asociación Campesina del Valle", siglas="ACV", tipo="comunidad", pais="Honduras"),
    ]
    db.add_all(orgs)
    db.flush()

    # ── Paisajes ──
    paisajes = [
        Paisaje(nombre="Corredor Seco Centroamericano", pais="Honduras", region="Corredor Seco", latitud=14.08, longitud=-87.21),
        Paisaje(nombre="Trifinio", pais="Guatemala/Honduras/El Salvador", region="Trifinio", latitud=14.45, longitud=-89.15),
        Paisaje(nombre="Reserva Bosawas", pais="Nicaragua", region="RACCN", latitud=13.90, longitud=-84.90),
    ]
    db.add_all(paisajes)
    db.flush()

    # ── Comunidades ──
    comunidades = [
        Comunidad(nombre="San Miguel de la Sierra", paisaje_id=paisajes[0].id, municipio="La Esperanza"),
        Comunidad(nombre="El Paraíso", paisaje_id=paisajes[0].id, municipio="Danlí"),
        Comunidad(nombre="Aldea Trifinio", paisaje_id=paisajes[1].id, municipio="Esquipulas"),
    ]
    db.add_all(comunidades)
    db.flush()

    # ── Pilotos ──
    pilotos = [
        Piloto(nombre="Restauración agroforestal CSC", organizacion_id=orgs[0].id, paisaje_id=paisajes[0].id,
               estado="activo", latitud=14.08, longitud=-87.25,
               descripcion="Sistema agroforestal con cacao y frutales"),
        Piloto(nombre="Corredor biológico Trifinio", organizacion_id=orgs[0].id, paisaje_id=paisajes[1].id,
               estado="activo", latitud=14.48, longitud=-89.18,
               descripcion="Restauración de conectividad ecológica"),
        Piloto(nombre="Silvopastura sostenible", organizacion_id=orgs[2].id, paisaje_id=paisajes[0].id,
               estado="en_planificacion", latitud=14.03, longitud=-87.12,
               descripcion="Conversión de pasturas degradadas"),
    ]
    db.add_all(pilotos)
    db.flush()

    # ── Indicadores ──
    indicadores = [
        Indicador(codigo="IND-1.1", nombre="Hectáreas bajo manejo sostenible", tipo="outcome", unidad="hectáreas", baseline="0", meta="500"),
        Indicador(codigo="IND-1.2", nombre="Diversidad de especies (Shannon)", tipo="outcome", unidad="índice", baseline="1.2", meta="2.5"),
        Indicador(codigo="IND-2.1", nombre="Familias con medios de vida mejorados", tipo="outcome", unidad="familias", baseline="0", meta="200"),
        Indicador(codigo="IND-2.2", nombre="Ingresos adicionales por productos SbN", tipo="outcome", unidad="USD/año", baseline="0", meta="1500"),
        Indicador(codigo="IND-3.1", nombre="Capacidad institucional local", tipo="outcome", unidad="puntaje 1-5", baseline="2.0", meta="4.0"),
        Indicador(codigo="IND-3.2", nombre="Planes de manejo aprobados", tipo="output", unidad="planes", baseline="0", meta="6"),
        Indicador(codigo="IND-4.1", nombre="Capacitaciones realizadas", tipo="output", unidad="eventos", baseline="0", meta="24"),
        Indicador(codigo="IND-4.2", nombre="Participantes capacitados", tipo="output", unidad="personas", baseline="0", meta="600"),
        Indicador(codigo="IND-5.1", nombre="Políticas locales con componente SbN", tipo="outcome", unidad="políticas", baseline="0", meta="3"),
        Indicador(codigo="IND-5.2", nombre="Alianzas público-privadas activas", tipo="output", unidad="alianzas", baseline="0", meta="5"),
    ]
    db.add_all(indicadores)
    db.flush()

    # ── Preguntas de Aprendizaje ──
    lqs = [
        PreguntaDeAprendizaje(codigo="LQ1", texto="¿Qué enfoques de restauración producen los mejores resultados ecológicos y sociales?"),
        PreguntaDeAprendizaje(codigo="LQ2", texto="¿Cómo influyen las condiciones climáticas locales en el éxito de las intervenciones SbN?"),
        PreguntaDeAprendizaje(codigo="LQ3", texto="¿Qué factores institucionales facilitan o dificultan la adopción de SbN?"),
        PreguntaDeAprendizaje(codigo="LQ4", texto="¿Cómo varían los beneficios socioeconómicos entre diferentes grupos demográficos?"),
        PreguntaDeAprendizaje(codigo="LQ5", texto="¿Qué mecanismos de gobernanza son más efectivos para la gestión de paisajes?"),
        PreguntaDeAprendizaje(codigo="LQ6", texto="¿Cómo se puede integrar el conocimiento local con la ciencia formal?"),
        PreguntaDeAprendizaje(codigo="LQ7", texto="¿Cuáles son las barreras principales para la escalabilidad de las SbN?"),
        PreguntaDeAprendizaje(codigo="LQ8", texto="¿Qué rol juegan los mercados verdes en la sostenibilidad financiera?"),
        PreguntaDeAprendizaje(codigo="LQ9", texto="¿Cómo fortalecer la equidad de género en la toma de decisiones?"),
        PreguntaDeAprendizaje(codigo="LQ10", texto="¿Qué lecciones pueden transferirse entre paisajes y contextos?"),
    ]
    db.add_all(lqs)
    db.flush()

    # ── Instrumentos ──
    instrumentos = [
        Instrumento(nombre="Encuesta de hogares", tipo="cuantitativo", descripcion="Encuesta socioeconómica a hogares participantes"),
        Instrumento(nombre="Parcela de monitoreo", tipo="cuantitativo", descripcion="Medición de biodiversidad y cobertura en parcelas permanentes"),
        Instrumento(nombre="Entrevista semiestructurada", tipo="cualitativo", descripcion="Entrevistas a actores clave"),
        Instrumento(nombre="Grupo focal", tipo="cualitativo", descripcion="Grupos focales con comunidades"),
        Instrumento(nombre="Análisis de documentos", tipo="mixto", descripcion="Revisión de políticas y planes"),
        Instrumento(nombre="Teledetección", tipo="cuantitativo", descripcion="Análisis de imágenes satelitales"),
        Instrumento(nombre="Registro administrativo", tipo="cuantitativo", descripcion="Datos de registros institucionales"),
        Instrumento(nombre="Observación participante", tipo="cualitativo", descripcion="Observación directa en campo"),
    ]
    db.add_all(instrumentos)
    db.flush()

    # ── Hitos ──
    hitos = [
        Hito(nombre="Línea base completada", estado="completado", responsable="Equipo MEL", fecha_planificada=date(2025, 3, 31), fecha_real=date(2025, 4, 15), descripcion="Recopilación de datos base de todos los indicadores"),
        Hito(nombre="Primer ciclo de monitoreo", estado="completado", responsable="Equipo MEL", fecha_planificada=date(2025, 6, 30), fecha_real=date(2025, 7, 10)),
        Hito(nombre="Taller de aprendizaje regional", estado="completado", responsable="CATIE", fecha_planificada=date(2025, 9, 15), fecha_real=date(2025, 9, 20)),
        Hito(nombre="Reporte semestral 1", estado="completado", responsable="CATIE/UNEP", fecha_planificada=date(2025, 6, 30), fecha_real=date(2025, 7, 1)),
        Hito(nombre="Segundo ciclo de monitoreo", estado="en_progreso", responsable="Equipo MEL", fecha_planificada=date(2026, 1, 31)),
        Hito(nombre="Evaluación de medio término", estado="en_progreso", responsable="Evaluador externo", fecha_planificada=date(2026, 3, 31)),
        Hito(nombre="Taller de aprendizaje 2", estado="pendiente", responsable="CATIE", fecha_planificada=date(2026, 6, 15)),
        Hito(nombre="Reporte anual completo", estado="pendiente", responsable="CATIE/UNEP", fecha_planificada=date(2026, 7, 31)),
        Hito(nombre="Evaluación final", estado="pendiente", responsable="Evaluador externo", fecha_planificada=date(2026, 11, 30)),
    ]
    db.add_all(hitos)
    db.flush()

    # ── Mediciones (datos demo) ──
    mediciones_data = [
        # IND-1.1 Hectáreas
        (1, date(2025, 4, 1), 0, 1, 1, "Ana Martínez", "Línea base"),
        (1, date(2025, 7, 15), 120, 2, 1, "Ana Martínez", "Primer monitoreo"),
        (1, date(2026, 1, 20), 285, 2, 1, "Carlos López", "Segundo monitoreo"),
        # IND-1.2 Diversidad
        (2, date(2025, 4, 1), 1.2, 2, 1, "Ana Martínez", "Línea base parcelas"),
        (2, date(2025, 7, 15), 1.5, 2, 1, "Ana Martínez", "Primer monitoreo"),
        (2, date(2026, 1, 20), 1.8, 2, 1, "Ana Martínez", "Segundo monitoreo"),
        # IND-2.1 Familias
        (3, date(2025, 4, 1), 0, 1, 1, "Rosa Gómez", "Línea base hogares"),
        (3, date(2025, 7, 15), 45, 1, 1, "Rosa Gómez", "Primer monitoreo"),
        (3, date(2026, 1, 20), 95, 1, 1, "Rosa Gómez", "Segundo monitoreo"),
        # IND-2.2 Ingresos
        (4, date(2025, 4, 1), 0, 1, 1, "Rosa Gómez", "Línea base"),
        (4, date(2026, 1, 20), 450, 1, 1, "Rosa Gómez", "Segundo monitoreo"),
        # IND-3.1 Capacidad
        (5, date(2025, 4, 1), 2.0, 3, 1, "Mario Ruiz", "Evaluación inicial"),
        (5, date(2026, 1, 20), 2.8, 3, 1, "Mario Ruiz", "Evaluación intermedia"),
        # IND-4.1 Capacitaciones
        (7, date(2025, 7, 15), 8, 7, 1, "Equipo", "Corte semestral"),
        (7, date(2026, 1, 20), 15, 7, 1, "Equipo", "Acumulado anual"),
        # IND-4.2 Participantes
        (8, date(2025, 7, 15), 180, 7, 1, "Equipo", "Corte semestral"),
        (8, date(2026, 1, 20), 340, 7, 1, "Equipo", "Acumulado anual"),
        # IND-5.2 Alianzas
        (10, date(2025, 7, 15), 1, 5, 1, "Mario Ruiz", "Primera alianza"),
        (10, date(2026, 1, 20), 3, 5, 1, "Mario Ruiz", "Tres alianzas activas"),
    ]
    for ind_id, fecha, valor, inst_id, org_id, resp, notas in mediciones_data:
        m = Medicion(
            indicador_id=ind_id, fecha=fecha, valor=valor,
            instrumento_id=inst_id, organizacion_id=org_id,
            paisaje_id=1, responsable=resp, notas=notas,
        )
        db.add(m)
        db.flush()
        db.add(ChangelogMedicion(medicion_id=m.id, valor_anterior=None, valor_nuevo=valor, responsable=resp, notas="Creación inicial"))

    # ── Evidencias (datos demo) ──
    evidencias_data = [
        ("documento", "Informe de línea base con resultados de encuesta de hogares y parcelas de monitoreo", date(2025, 4, 15), "Ana Martínez", "línea base,socioeconomía,biodiversidad"),
        ("documento", "Reporte semestral con análisis de progreso y lecciones aprendidas", date(2025, 7, 20), "CATIE", "reporte,progreso,semestral"),
        ("foto", "Registro fotográfico de parcelas restauradas en Corredor Seco", date(2025, 8, 10), "Carlos López", "restauración,fotos,campo"),
        ("texto", "Hallazgo: Las familias que combinan cacao con frutales reportan mayor resiliencia ante sequía", date(2025, 9, 22), "Taller regional", "aprendizaje,resiliencia,agroforestería"),
        ("texto", "Hallazgo: La participación femenina aumentó 15% tras las capacitaciones con enfoque de género", date(2025, 9, 22), "Taller regional", "género,inclusión,aprendizaje"),
        ("documento", "Protocolo de monitoreo de biodiversidad adaptado al contexto local", date(2025, 5, 10), "Ana Martínez", "protocolo,biodiversidad,metodología"),
        ("video", "Testimonio de productores sobre beneficios de sistemas agroforestales", date(2025, 11, 5), "Equipo comunicación", "testimonios,productores,video"),
        ("documento", "Análisis de brechas de capacidad institucional en municipios del Corredor Seco", date(2026, 1, 10), "Mario Ruiz", "capacidad,institucional,análisis"),
    ]
    for tipo, texto, fecha, autor, tags in evidencias_data:
        ev = Evidencia(tipo=tipo, texto=texto, fecha=fecha, autor=autor, tags=tags)
        db.add(ev)
        db.flush()

    # Vincular evidencias a indicadores y LQs
    db.add(EvidenciaIndicador(evidencia_id=1, indicador_id=1))
    db.add(EvidenciaIndicador(evidencia_id=1, indicador_id=2))
    db.add(EvidenciaIndicador(evidencia_id=1, indicador_id=3))
    db.add(EvidenciaIndicador(evidencia_id=2, indicador_id=1))
    db.add(EvidenciaIndicador(evidencia_id=3, indicador_id=1))
    db.add(EvidenciaLQ(evidencia_id=4, lq_id=1))
    db.add(EvidenciaLQ(evidencia_id=4, lq_id=2))
    db.add(EvidenciaLQ(evidencia_id=5, lq_id=9))
    db.add(EvidenciaLQ(evidencia_id=5, lq_id=4))
    db.add(EvidenciaLQ(evidencia_id=6, lq_id=6))
    db.add(EvidenciaLQ(evidencia_id=7, lq_id=1))
    db.add(EvidenciaLQ(evidencia_id=8, lq_id=3))
    db.add(EvidenciaIndicador(evidencia_id=8, indicador_id=5))

    db.commit()
    db.close()
    print("[OK] Base de datos inicializada con datos demo completos:")
    print("   3 organizaciones, 3 paisajes, 3 comunidades, 3 pilotos")
    print("   10 indicadores, 10 preguntas de aprendizaje, 8 instrumentos, 9 hitos")
    print("   19 mediciones, 8 evidencias con vinculos")
    print("")
    print("Ejecutar: uvicorn main:app --reload --host 0.0.0.0 --port 8000")


if __name__ == "__main__":
    seed()
