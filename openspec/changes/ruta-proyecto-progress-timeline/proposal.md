## Why

La seccion Ruta del Proyecto ya muestra hitos, pero todavia no comunica de forma inmediata como avanza el proyecto a partir de los datos MEL disponibles. Ahora que MEL Proyecto importa indicadores, avance, frecuencia, LQ y notas desde `MEL PROPOSAL V6.xlsx`, la Ruta puede convertirse en una lectura visual del progreso real del proyecto, no solo una lista cronologica.

## What Changes

- Convertir Ruta del Proyecto en una linea de tiempo horizontal, muy visual y responsive.
- Enriquecer cada hito con senales inferidas desde MEL Proyecto: avance agregado, indicadores vinculados, LQ relacionadas, estado de fuentes y notas relevantes.
- Mostrar periodos o momentos de seguimiento derivados de los campos existentes, especialmente frecuencia, avance y actualizaciones de indicadores.
- Mantener la lista de hitos existente como estructura base, usando datos MEL Proyecto para contextualizar el progreso sin crear una nueva experiencia de edicion.
- Agregar estados visuales claros para completado, en progreso, pendiente, con rezagos o con fuentes incompletas.

## Capabilities

### New Capabilities
- `ruta-progress-timeline`: Cubre la visualizacion horizontal del progreso del proyecto en Ruta, incluyendo hitos enriquecidos con datos inferidos desde MEL Proyecto.

### Modified Capabilities
- `mel-proyecto-indicators`: Los indicadores MEL Proyecto se exponen como fuente de contexto para vistas agregadas de progreso fuera de la pagina MEL Proyecto.

## Impact

- Frontend: `frontend/modules/ruta.js`, estilos en `frontend/css/styles.css`, y consumo de `api.hitos`, `api.melProyecto` y/o `api.melProyectoResumen`.
- Backend/API: posible endpoint agregado para resumen de timeline si la agregacion en cliente resulta demasiado fragil.
- Datos: reutiliza `hitos`, `MelProyectoIndicador` y los campos importados desde `MEL PROPOSAL V6.xlsx`; no requiere nuevo archivo fuente.
- UX: Ruta del Proyecto pasa de una lista vertical expandible a una linea de tiempo horizontal, escaneable, con detalle por hito.
