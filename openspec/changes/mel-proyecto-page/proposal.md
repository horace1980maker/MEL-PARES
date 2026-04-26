## Why

El sistema necesita una pagina MEL Proyecto para dar seguimiento centralizado a los indicadores del proyecto PARES definidos en `MEL PROPOSAL V6.xlsx`. Actualmente esos indicadores viven en una hoja externa, lo que dificulta visualizar avance, controlar ediciones y mantener una lectura consistente del cumplimiento.

## What Changes

- Agregar una nueva pagina del sistema llamada MEL Proyecto.
- Mostrar los indicadores del Excel como una vista de seguimiento con nivel, indicador, linea base, meta, fuente, frecuencia, LQ, notas y avance actual.
- Representar el avance de cada indicador con una barra horizontal de porcentaje o progreso contra meta.
- Agregar un flujo de login exclusivo para administradores para habilitar edicion de indicadores y avances.
- Permitir que administradores autenticados editen los campos del indicador y ajusten el avance mediante una barra deslizable.
- Mantener la vista publica o no autenticada en modo lectura.

## Capabilities

### New Capabilities
- `mel-proyecto-indicators`: Pagina MEL Proyecto para visualizar, autenticar edicion y actualizar indicadores de proyecto con barras de avance.

### Modified Capabilities

## Impact

- Frontend: nueva vista/ruta MEL Proyecto, componentes de tabla/tarjetas de indicadores, barras de progreso y controles deslizables de edicion.
- Backend: modelos, endpoints y persistencia para indicadores MEL Proyecto, avances y autenticacion/autorizacion exclusiva de administradores.
- Datos: carga inicial basada en `MEL PROPOSAL V6.xlsx`, con 10 indicadores unicos identificados entre Outcome y Output.
- Seguridad: separacion entre lectura general y edicion autenticada.
