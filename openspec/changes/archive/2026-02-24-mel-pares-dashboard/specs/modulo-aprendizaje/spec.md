## Requisitos AÑADIDOS

### Requisito: Navegación por pregunta de aprendizaje

El módulo DEBE presentar las 10 preguntas de aprendizaje (LQ1–LQ10) como elementos navegables, permitiendo seleccionar una para ver su detalle.

#### Escenario: Seleccionar una pregunta de aprendizaje

- **WHEN** el usuario selecciona LQ3
- **THEN** el módulo muestra los hallazgos, indicadores asociados y evidencia vinculados a LQ3

### Requisito: Hallazgos e indicadores asociados

Para cada pregunta de aprendizaje, el módulo DEBE mostrar: hallazgos registrados, indicadores que contribuyen a responderla y las evidencias correspondientes.

#### Escenario: Ver hallazgos de una pregunta

- **WHEN** el usuario visualiza el detalle de una pregunta de aprendizaje
- **THEN** se muestran los hallazgos con fecha, descripción e indicadores vinculados

### Requisito: Bitácora de decisiones

El módulo DEBE incluir una bitácora de decisiones tomadas a partir de los hallazgos de cada pregunta de aprendizaje.

#### Escenario: Registrar una decisión

- **WHEN** el usuario agrega una decisión vinculada a LQ5
- **THEN** la decisión se almacena con fecha, descripción, autor y aparece en la bitácora de LQ5
