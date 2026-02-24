Construye un dashboard web para el Sistema MEL del Proyecto PARES. El dashboard debe permitir monitoreo, evaluación y aprendizaje, integrando indicadores cuantitativos, evidencia cualitativa, documentos y trazabilidad. Debe soportar comparación línea base vs valor actual vs meta, y comparaciones por organización, paisaje y piloto.

Contexto MEL:

- 10 preguntas de aprendizaje LQ1–LQ10.
- 10 indicadores: 6 outputs y 4 outcomes.
- Instrumentos activos: encuestas pre/post individuales, encuesta organizacional post, pausas reflexivas, sesiones de aprendizaje entre pares, entrevistas semiestructuradas, matrices de monitoreo y registros de campo.
- Ventanas de medición relevantes: posterior a ToT1 y ToT2 en 2025; validación de hojas de ruta julio 2025; sesiones CoP 2025-2026; visitas de verificación mayo–julio 2026; avances/cierre de inclusión julio y noviembre 2026; corte septiembre 2026 para pilotos implementados; encuentro interregional octubre 2026.

Requisitos funcionales:

1. Pantalla Inicio con KPIs principales por indicador, semáforo de evidencia y panel “qué cambió desde el último corte”.
2. Módulo Ruta del Proyecto en timeline con hitos, cada hito mostrando instrumentos requeridos, evidencias, responsables y estado.
3. Módulo Comparador de Cambio con selector indicador + unidad de análisis, mostrando baseline, actual y meta, serie histórica, desglose por instrumento y calidad de evidencia.
4. Módulo Aprendizaje: navegación por LQ, mostrando hallazgos, indicadores asociados, evidencia y bitácora de decisiones.
5. Módulo Inclusión: matrices por piloto para integración de medidas de inclusión y participación activa, con checklist y evidencias.
6. Módulo Territorio: mapa por paisaje con pilotos y fichas, y panel comparativo de outcomes sociales.
7. Módulo Evidencia: repositorio filtrable por indicador, LQ, organización, paisaje y piloto.

Modelo de datos mínimo:
Entidades: Organizacion, Paisaje, Comunidad, Piloto, Indicador, LearningQuestion, Instrumento, Medicion, Evidencia, Hito.
Cada Medicion debe tener: id, indicador_id, fecha, valor, unidad_analisis, organizacion_id opcional, paisaje_id opcional, piloto_id opcional, instrumento_id, responsable, muestra, notas, evidencias_asociadas.
Cada Evidencia: id, tipo, archivo_url o texto, fecha, autor, tags, enlaces a indicador/LQ/hito.

Reglas:

- Progreso = (actual - baseline)/(meta - baseline) acotado 0..1.
- Calidad de evidencia: alta si triangulación de al menos 2 fuentes, media si 1 fuente completa, baja si faltan metadatos.
- Soportar “cortes” de reporte: snapshot por fecha para comparar cambios entre periodos.
- Generar registro automático de cambios: cada nueva medición crea un log con diff y evidencia vinculada.

UI/UX:

- Sin slider manual. El estado se calcula por mediciones y evidencia.
- Filtros globales persistentes: periodo/corte, paisaje, organización, piloto, LQ.
- Exportables: PDF o documento por organización/paisaje/indicador con tabla de valores, gráficos y anexos de evidencia.

Implementación:

- Frontend con componentes modulares para KPIs, timeline, comparador, mapa, repositorio de evidencia y bitácora.
- Backend con API REST para CRUD de mediciones y evidencias, y endpoints de agregación por unidad de análisis.
- Base de datos relacional con claves foráneas y control de versiones de mediciones.
