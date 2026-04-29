## Why

La seccion Ruta del Proyecto debe reflejar directamente la hoja `TIMELINE` de `MEL PROPOSAL V6.xlsx`. La vista actual no debe vincular entregables con indicadores ni inferir relaciones desde MEL Proyecto; debe funcionar como una linea de tiempo independiente basada solo en los campos de esa hoja.

El equipo tambien necesita corregir la ruta sin tocar codigo, por lo que Ruta debe incluir un acceso admin para editar todos los campos de cada entregable.

## What Changes

- Convertir Ruta del Proyecto en una linea de tiempo horizontal, muy visual y responsive basada en la hoja `TIMELINE` de `MEL PROPOSAL V6.xlsx`.
- Mostrar cada entregable con numero, output, orden, anio, mes, titulo y estado.
- Mantener la seleccion local para inspeccionar el detalle de un entregable sin recargar la ruta.
- Agregar estados visuales claros para entregado y en proceso.
- No consumir ni relacionar indicadores MEL Proyecto en Ruta.
- Agregar login admin y edicion persistente de todos los campos TIMELINE: No. Entregable, Output, Orden, Año, Mes, Entregable y Estado.

## Capabilities

### New Capabilities
- `ruta-progress-timeline`: Cubre la visualizacion horizontal independiente de los entregables del TIMELINE en Ruta.

### Modified Capabilities
- Ninguna.

## Impact

- Frontend: `frontend/modules/ruta.js`, `frontend/js/api.js`, estilos en `frontend/css/styles.css`, y datos revisados de la hoja `TIMELINE`.
- Backend/API: nueva persistencia y endpoints de Ruta para listar, login admin y actualizar entregables.
- Datos: usa los entregables de la hoja `TIMELINE` en `MEL PROPOSAL V6.xlsx` como semilla inicial y guarda ediciones en base de datos.
- UX: Ruta del Proyecto pasa de una lista vertical expandible a una linea de tiempo horizontal, escaneable, con detalle por entregable.
