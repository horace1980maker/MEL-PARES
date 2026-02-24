## Requisitos AÑADIDOS

### Requisito: Selector de indicador y unidad de análisis

El módulo DEBE permitir al usuario seleccionar un indicador y una unidad de análisis (organización, paisaje o piloto) para visualizar la comparación.

#### Escenario: Seleccionar indicador y unidad

- **WHEN** el usuario selecciona un indicador y elige "por organización" como unidad de análisis
- **THEN** el comparador muestra los datos filtrados para ese indicador desglosados por organización

### Requisito: Visualización baseline/actual/meta

El módulo DEBE mostrar para la selección actual: valor de línea base, valor actual, valor meta, y una barra o gráfico de progreso con el cálculo automático.

#### Escenario: Mostrar comparación de valores

- **WHEN** el comparador tiene un indicador y unidad seleccionados
- **THEN** se muestra una tabla y gráfico con las columnas: línea base, actual, meta, progreso (%)

### Requisito: Serie histórica

El módulo DEBE mostrar una gráfica de serie de tiempo con las mediciones del indicador seleccionado a lo largo de los cortes de reporte.

#### Escenario: Visualizar evolución temporal

- **WHEN** el usuario visualiza un indicador que tiene mediciones en múltiples cortes
- **THEN** se muestra un gráfico de línea con la evolución del valor a través del tiempo

### Requisito: Desglose por instrumento y calidad de evidencia

El módulo DEBE mostrar qué instrumentos contribuyen a la medición actual y la calidad de evidencia resultante.

#### Escenario: Ver fuentes de medición

- **WHEN** el usuario expande el detalle de una medición en el comparador
- **THEN** se muestra la lista de instrumentos que la respaldan y el nivel de calidad de evidencia
