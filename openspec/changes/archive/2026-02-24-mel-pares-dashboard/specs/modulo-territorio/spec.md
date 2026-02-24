## Requisitos AÑADIDOS

### Requisito: Mapa interactivo por paisaje

El módulo DEBE mostrar un mapa interactivo (Leaflet + OpenStreetMap) con marcadores por cada paisaje y piloto georeferenciado.

#### Escenario: Visualizar paisajes en el mapa

- **WHEN** el usuario navega al módulo Territorio
- **THEN** se muestra un mapa con marcadores en las ubicaciones de los paisajes registrados

### Requisito: Fichas de piloto

Al hacer clic en un marcador del mapa, el sistema DEBE mostrar una ficha del piloto o paisaje con: nombre, organización responsable, indicadores clave y estado general.

#### Escenario: Ver ficha de un piloto desde el mapa

- **WHEN** el usuario hace clic en el marcador de un piloto
- **THEN** se despliega una ficha con el nombre, organización, indicadores asociados y progreso

### Requisito: Panel comparativo de resultados sociales

El módulo DEBE incluir un panel que compare outcomes sociales entre paisajes lado a lado.

#### Escenario: Comparar outcomes entre paisajes

- **WHEN** el usuario selecciona dos o más paisajes en el panel comparativo
- **THEN** se muestra una tabla comparativa con los valores de outcomes sociales de cada paisaje
