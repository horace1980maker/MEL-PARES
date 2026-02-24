## Requisitos AÑADIDOS

### Requisito: Tarjetas KPI por indicador

La página de inicio DEBE mostrar una tarjeta KPI por cada indicador con: nombre del indicador, valor actual, valor meta, barra de progreso y semáforo de calidad de evidencia (alta=verde, media=amarilla, baja=roja).

#### Escenario: Visualizar KPIs al cargar el dashboard

- **WHEN** el usuario accede a la página de inicio
- **THEN** se muestran las tarjetas KPI de los 10 indicadores con sus valores actuales y progreso

### Requisito: Panel "qué cambió desde el último corte"

La página de inicio DEBE incluir un panel que liste los cambios más recientes desde el último corte de reporte: nuevas mediciones, cambios de valor y nuevas evidencias.

#### Escenario: Mostrar cambios recientes

- **WHEN** el usuario accede a la página de inicio y existen mediciones posteriores al último corte
- **THEN** el panel muestra una lista cronológica de los cambios con indicador, valor anterior, valor nuevo y fecha

### Requisito: Semáforo de evidencia

Cada indicador DEBE mostrar un semáforo de calidad de evidencia: alta (triangulación ≥2 fuentes), media (1 fuente completa), baja (faltan metadatos).

#### Escenario: Indicador con evidencia triangulada

- **WHEN** un indicador tiene evidencias de al menos 2 instrumentos diferentes
- **THEN** el semáforo muestra calidad "alta" (verde)
