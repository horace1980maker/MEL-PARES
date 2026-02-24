## 1. Configuración del proyecto

- [x] 1.1 Crear estructura de directorios del proyecto: `backend/`, `frontend/`, `backend/models/`, `backend/routes/`, `frontend/js/`, `frontend/css/`, `frontend/modules/`
- [x] 1.2 Inicializar el backend con FastAPI: crear `backend/main.py` con configuración CORS, montaje de archivos estáticos y registro de routers
- [x] 1.3 Crear `backend/requirements.txt` con dependencias: fastapi, uvicorn, sqlalchemy, pydantic, weasyprint
- [x] 1.4 Crear `backend/database.py` con configuración de SQLAlchemy para SQLite

## 2. Modelo de datos

- [x] 2.1 Crear modelos SQLAlchemy para entidades base: Organización, Paisaje, Comunidad, Piloto (`backend/models/entidades.py`)
- [x] 2.2 Crear modelos SQLAlchemy para entidades MEL: Indicador, PreguntaDeAprendizaje, Instrumento, Hito (`backend/models/mel.py`)
- [x] 2.3 Crear modelo SQLAlchemy para Medición con todos los campos requeridos y claves foráneas (`backend/models/medicion.py`)
- [x] 2.4 Crear modelo SQLAlchemy para Evidencia con campos completos y enlaces a indicador/LQ/hito (`backend/models/evidencia.py`)
- [x] 2.5 Crear modelo para Changelog de mediciones con valor_anterior, valor_nuevo, fecha_cambio (`backend/models/changelog.py`)
- [x] 2.6 Crear modelo para Corte (snapshot) de reporte (`backend/models/corte.py`)
- [x] 2.7 Crear script de inicialización de BD con datos semilla para indicadores, LQs e instrumentos (`backend/seed.py`)

## 3. API REST — Entidades de referencia

- [x] 3.1 Crear router con CRUD para organizaciones (`backend/routes/organizaciones.py`)
- [x] 3.2 Crear router con CRUD para paisajes (`backend/routes/paisajes.py`)
- [x] 3.3 Crear router con CRUD para comunidades, pilotos (`backend/routes/territorios.py`)
- [x] 3.4 Crear router con CRUD para indicadores, preguntas de aprendizaje, instrumentos, hitos (`backend/routes/mel_ref.py`)

## 4. API REST — Mediciones y evidencias

- [x] 4.1 Crear router CRUD para mediciones con validación de referencias y creación automática de changelog (`backend/routes/mediciones.py`)
- [x] 4.2 Crear router CRUD para evidencias con filtrado por indicador, LQ, organización, paisaje, piloto (`backend/routes/evidencias.py`)
- [x] 4.3 Crear endpoint de agregación de progreso por indicador: GET /api/agregacion/progreso (`backend/routes/agregacion.py`)
- [x] 4.4 Crear endpoints de gestión de cortes: POST /api/cortes, GET /api/cortes/comparar (`backend/routes/cortes.py`)

## 5. Frontend — Estructura base

- [x] 5.1 Crear `frontend/index.html` con layout SPA: barra de navegación lateral, área de contenido principal, barra de filtros globales
- [x] 5.2 Crear `frontend/css/styles.css` con sistema de diseño: variables CSS, paleta de colores, tipografía, componentes base
- [x] 5.3 Crear `frontend/js/app.js` con router por hash, sistema de módulos y gestión de estado de filtros globales
- [x] 5.4 Crear `frontend/js/api.js` con funciones cliente para comunicación con la API REST

## 6. Módulo Inicio (Dashboard)

- [x] 6.1 Crear `frontend/modules/inicio.js` con tarjetas KPI por indicador mostrando valor actual, meta, barra de progreso y semáforo de evidencia
- [x] 6.2 Implementar panel "qué cambió desde el último corte" con lista cronológica de cambios recientes

## 7. Módulo Ruta del Proyecto

- [x] 7.1 Crear `frontend/modules/ruta.js` con línea de tiempo visual de hitos (pendiente/en progreso/completado)
- [x] 7.2 Implementar panel de detalle de hito: instrumentos requeridos, evidencias, responsables, estado

## 8. Módulo Comparador de Cambio

- [x] 8.1 Crear `frontend/modules/comparador.js` con selector de indicador y unidad de análisis
- [x] 8.2 Implementar visualización baseline/actual/meta con tabla y gráfico de barras (Chart.js)
- [x] 8.3 Implementar gráfico de serie histórica por cortes de reporte
- [x] 8.4 Implementar desglose por instrumento y calidad de evidencia

## 9. Módulo Aprendizaje

- [x] 9.1 Crear `frontend/modules/aprendizaje.js` con navegación por las 10 preguntas de aprendizaje
- [x] 9.2 Implementar vista de hallazgos, indicadores asociados y evidencia por LQ
- [ ] 9.3 Implementar bitácora de decisiones con formulario de registro (Deferido a próxima versión)

## 10. Módulo Inclusión

- [x] 10.1 Crear `frontend/modules/inclusion.js` con selector de piloto y matriz de medidas de inclusión
- [x] 10.2 Implementar checklist de estado (planificado/en progreso/completado) y enlaces a evidencias
- [x] 10.3 Implementar panel de participación activa con resumen demográfico

## 11. Módulo Territorio

- [x] 11.1 Crear `frontend/modules/territorio.js` con mapa Leaflet + OpenStreetMap y marcadores por paisaje/piloto
- [x] 11.2 Implementar fichas popup de piloto al hacer clic en marcadores
- [x] 11.3 Implementar panel comparativo de outcomes sociales entre paisajes

## 12. Repositorio de Evidencia

- [x] 12.1 Crear `frontend/modules/evidencia.js` con lista filtrable de evidencias (por indicador, LQ, organización, paisaje, piloto)
- [x] 12.2 Implementar vista de detalle de evidencia con preview y metadatos

## 13. Exportación de Reportes

- [x] 13.1 Crear endpoint de generación PDF en backend: GET /api/exportar/pdf (`backend/routes/exportar.py`)
- [x] 13.2 Crear plantilla HTML para reportes PDF con tablas de valores, gráficos y anexos de evidencia
- [ ] 13.3 Implementar botón de exportar en el frontend con selector de filtros (Deferido a próxima versión)

## 14. Integración y pruebas

- [x] 14.1 Verificar que todos los módulos del frontend cargan correctamente vía routing por hash
- [x] 14.2 Verificar CRUD completo de mediciones con changelog automático
- [x] 14.3 Verificar cálculo de progreso y semáforo de evidencia
- [ ] 14.4 Verificar generación de PDF con datos reales (Deferido a próxima versión)
- [x] 14.5 Verificar filtros globales aplicados en todos los módulos
