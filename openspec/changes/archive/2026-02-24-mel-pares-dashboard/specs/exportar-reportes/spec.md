## Requisitos AÑADIDOS

### Requisito: Generación de reportes PDF

El sistema DEBE generar reportes descargables en formato PDF por organización, paisaje o indicador, incluyendo: tabla de valores (baseline, actual, meta), gráficos de progreso y anexos de evidencia.

#### Escenario: Exportar reporte por organización

- **WHEN** el usuario solicita exportar el reporte de la organización "CATIE"
- **THEN** el sistema genera un PDF con los indicadores de esa organización, sus valores, gráficos de progreso y evidencias asociadas como anexo

### Requisito: Filtros de exportación

El sistema DEBE permitir exportar reportes filtrados por período/corte, paisaje, organización, piloto o indicador específico.

#### Escenario: Exportar reporte de un período específico

- **WHEN** el usuario selecciona el corte "Septiembre 2026" y solicita la exportación
- **THEN** el PDF generado contiene sólo los datos correspondientes a ese corte
