## Requisitos AÑADIDOS

### Requisito: Repositorio filtrable de evidencia

El sistema DEBE proporcionar un repositorio donde todas las evidencias sean listables y filtrables por: indicador, pregunta de aprendizaje, organización, paisaje y piloto.

#### Escenario: Filtrar evidencias por indicador y paisaje

- **WHEN** el usuario aplica filtros de indicador=I3 y paisaje=Trifinio
- **THEN** se muestran solo las evidencias vinculadas al indicador I3 que pertenezcan al paisaje Trifinio

### Requisito: Visualización de evidencia

Para cada evidencia, el sistema DEBE mostrar: tipo (documento, foto, texto), fecha, autor, tags y enlaces a los indicadores/preguntas/hitos asociados.

#### Escenario: Ver detalle de una evidencia

- **WHEN** el usuario hace clic en una evidencia del repositorio
- **THEN** se muestra el contenido o preview del archivo, con metadatos completos y enlaces navegables a las entidades asociadas
