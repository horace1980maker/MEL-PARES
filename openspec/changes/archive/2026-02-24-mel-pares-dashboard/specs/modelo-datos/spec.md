## Requisitos AÑADIDOS

### Requisito: Esquema relacional central

El sistema DEBE implementar una base de datos relacional con las siguientes entidades: Organización, Paisaje, Comunidad, Piloto, Indicador, PreguntaDeAprendizaje, Instrumento, Medición, Evidencia, Hito. Todas las relaciones DEBEN usar claves foráneas con integridad referencial.

#### Escenario: Crear una medición con relaciones válidas

- **WHEN** se crea una medición con indicador_id, instrumento_id y opcionalmente organización_id, paisaje_id o piloto_id existentes
- **THEN** el sistema almacena la medición y sus relaciones se mantienen íntegras

#### Escenario: Rechazar medición con referencia inválida

- **WHEN** se intenta crear una medición con un indicador_id que no existe
- **THEN** el sistema retorna un error de validación

### Requisito: Versionado de mediciones

Cada nueva medición DEBE crear un registro en la tabla de changelog que incluya: id_medición, fecha_cambio, valor_anterior, valor_nuevo, responsable y evidencias_asociadas. Los valores anteriores NO DEBEN ser sobreescritos.

#### Escenario: Registro automático de cambio al actualizar medición

- **WHEN** se actualiza el valor de una medición existente
- **THEN** el sistema crea un nuevo registro en el changelog con el valor anterior, el nuevo valor y la fecha del cambio

### Requisito: Entidad Medición con campos completos

Cada Medición DEBE contener: id, indicador_id, fecha, valor, unidad_de_análisis, organización_id (opcional), paisaje_id (opcional), piloto_id (opcional), instrumento_id, responsable, muestra, notas, evidencias_asociadas.

#### Escenario: Crear medición con todos los campos requeridos

- **WHEN** se envía una medición con todos los campos obligatorios
- **THEN** el sistema la almacena correctamente y es recuperable vía API

### Requisito: Entidad Evidencia con campos completos

Cada Evidencia DEBE contener: id, tipo, archivo_url o texto, fecha, autor, tags, y enlaces a indicador/pregunta_de_aprendizaje/hito.

#### Escenario: Crear evidencia vinculada a un indicador

- **WHEN** se crea una evidencia con tipo, contenido y un indicador_id válido
- **THEN** el sistema la almacena y la vinculación es navegable desde el indicador
