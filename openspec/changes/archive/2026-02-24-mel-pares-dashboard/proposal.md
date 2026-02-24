## Por qué

El Proyecto PARES de CATIE necesita un dashboard MEL (Monitoreo, Evaluación y Aprendizaje) unificado para dar seguimiento a 10 indicadores (6 de producto, 4 de resultado) a lo largo de múltiples ventanas de medición (2025–2026), organizaciones, paisajes y pilotos. Actualmente no existe una herramienta integrada: los datos están dispersos en hojas de cálculo y documentos, lo que dificulta comparar línea base vs. valor actual vs. meta, evaluar la calidad de evidencia o responder las 10 preguntas de aprendizaje con evidencia trazable.

## Qué cambia

- **Nuevo dashboard web** con siete módulos funcionales: Inicio con KPIs, Ruta del Proyecto, Comparador de Cambio, Aprendizaje, Inclusión, Territorio (mapa) y Repositorio de Evidencia.
- **API REST backend** para CRUD de mediciones y evidencias, más endpoints de agregación por organización, paisaje y piloto.
- **Modelo de datos relacional** que cubre: Organización, Paisaje, Comunidad, Piloto, Indicador, PreguntaDeAprendizaje, Instrumento, Medición, Evidencia, Hito — con integridad referencial completa y versionado de mediciones.
- **Cálculo automático de progreso y calidad**: progreso = (actual − línea base)/(meta − línea base) acotado 0‥1; calidad de evidencia = alta/media/baja según reglas de triangulación.
- **Cortes de reporte**: snapshots por fecha para comparar cambios entre períodos.
- **Exportación a PDF/documento** por organización, paisaje o indicador con tablas, gráficos y anexos de evidencia.
- **Filtros globales persistentes**: período/corte, paisaje, organización, piloto, pregunta de aprendizaje.

## Capacidades

### Capacidades nuevas

- `modelo-datos`: Esquema relacional central (Organización, Paisaje, Comunidad, Piloto, Indicador, PreguntaDeAprendizaje, Instrumento, Medición, Evidencia, Hito) con versionado de mediciones y registro de cambios.
- `api-backend`: API REST para CRUD de mediciones y evidencias, endpoints de agregación, gestión de cortes/snapshots.
- `inicio-dashboard`: Página principal con tarjetas KPI por indicador, semáforo de evidencia y panel "qué cambió desde el último corte".
- `ruta-proyecto`: Línea de tiempo de hitos mostrando instrumentos requeridos, evidencias, responsables y estado.
- `comparador-cambio`: Selector de indicador + unidad de análisis mostrando línea base/actual/meta, serie histórica, desglose por instrumento y calidad de evidencia.
- `modulo-aprendizaje`: Navegación por pregunta de aprendizaje mostrando hallazgos, indicadores asociados, evidencia y bitácora de decisiones.
- `modulo-inclusion`: Matrices por piloto para medidas de inclusión y participación activa con checklist y evidencias.
- `modulo-territorio`: Mapa por paisaje con fichas de pilotos y panel comparativo de resultados sociales.
- `repositorio-evidencia`: Almacén filtrable de evidencia por indicador, pregunta de aprendizaje, organización, paisaje y piloto.
- `exportar-reportes`: Generación de PDF/documento por organización, paisaje o indicador con tablas, gráficos y anexos de evidencia.

### Capacidades modificadas

_(ninguna — proyecto nuevo)_

## Impacto

- **Código**: Frontend completamente nuevo (arquitectura de componentes modulares) y backend nuevo (servidor API + BD relacional).
- **Dependencias**: Framework web, librería de gráficos, librería de mapas, librería de generación de PDF, base de datos relacional.
- **Sistemas**: Requiere un entorno de hosting para la aplicación web y la base de datos; migración/importación de datos desde hojas de cálculo existentes.
