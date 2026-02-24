## Requisitos AÑADIDOS

### Requisito: CRUD de mediciones

El sistema DEBE exponer endpoints REST para crear, leer, actualizar y listar mediciones. Cada endpoint DEBE validar las referencias a entidades relacionadas.

#### Escenario: Crear medición vía POST

- **WHEN** se envía un POST a /api/mediciones con datos válidos
- **THEN** el sistema crea la medición y retorna 201 con el objeto creado

#### Escenario: Listar mediciones con filtros

- **WHEN** se envía un GET a /api/mediciones con parámetros de filtro (indicador_id, paisaje_id, fecha_desde, fecha_hasta)
- **THEN** el sistema retorna las mediciones que coincidan con los filtros aplicados

### Requisito: CRUD de evidencias

El sistema DEBE exponer endpoints REST para crear, leer, actualizar y listar evidencias con soporte para filtrado por indicador, pregunta de aprendizaje, organización, paisaje y piloto.

#### Escenario: Crear evidencia vía POST

- **WHEN** se envía un POST a /api/evidencias con datos válidos incluyendo tipo y contenido
- **THEN** el sistema crea la evidencia y retorna 201 con el objeto creado

### Requisito: Endpoints de agregación

El sistema DEBE exponer endpoints de agregación que calculen: progreso por indicador, conteo de evidencias por tipo, y resúmenes por unidad de análisis (organización, paisaje, piloto).

#### Escenario: Obtener progreso agregado por indicador

- **WHEN** se envía un GET a /api/agregacion/progreso?indicador_id=X
- **THEN** el sistema retorna el cálculo de progreso = (actual - baseline)/(meta - baseline) acotado entre 0 y 1

### Requisito: Gestión de cortes (snapshots)

El sistema DEBE permitir crear y consultar "cortes" de reporte que congelen el estado de mediciones en una fecha dada para comparar cambios entre períodos.

#### Escenario: Crear un corte de reporte

- **WHEN** se envía un POST a /api/cortes con una fecha y descripción
- **THEN** el sistema crea un snapshot del estado actual de todas las mediciones

#### Escenario: Comparar dos cortes

- **WHEN** se envía un GET a /api/cortes/comparar?corte1=X&corte2=Y
- **THEN** el sistema retorna las diferencias en valores de mediciones entre ambos cortes

### Requisito: CRUD de entidades de referencia

El sistema DEBE exponer endpoints REST para gestionar las entidades de referencia: organizaciones, paisajes, comunidades, pilotos, indicadores, preguntas de aprendizaje, instrumentos e hitos.

#### Escenario: Listar organizaciones

- **WHEN** se envía un GET a /api/organizaciones
- **THEN** el sistema retorna la lista completa de organizaciones registradas
