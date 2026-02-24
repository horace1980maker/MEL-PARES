## Requisitos AÑADIDOS

### Requisito: Línea de tiempo de hitos

El módulo DEBE mostrar una línea de tiempo visual con todos los hitos del proyecto, ordenados cronológicamente, indicando estado (pendiente, en progreso, completado).

#### Escenario: Visualizar la ruta del proyecto

- **WHEN** el usuario navega al módulo Ruta del Proyecto
- **THEN** se muestra una línea de tiempo con todos los hitos registrados, cada uno con su fecha y estado

### Requisito: Detalle de hito

Al seleccionar un hito, el sistema DEBE mostrar: instrumentos requeridos, evidencias asociadas, responsables y estado de cumplimiento.

#### Escenario: Ver detalle de un hito

- **WHEN** el usuario hace clic en un hito de la línea de tiempo
- **THEN** se despliega un panel con la lista de instrumentos requeridos, evidencias cargadas, responsables asignados y porcentaje de completitud
