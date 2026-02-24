## Contexto

El Proyecto PARES de CATIE implementa un sistema MEL con 10 indicadores, 10 preguntas de aprendizaje y múltiples instrumentos de recolección. Actualmente los datos residen en hojas de cálculo dispersas sin un punto de consulta común. Se necesita un dashboard web que integre monitoreo cuantitativo, evidencia cualitativa y trazabilidad, con comparaciones por organización, paisaje y piloto.

El proyecto ya tiene una plataforma web existente (HTML/JS/Python con FastAPI) para análisis de datos SES participativos. Este dashboard MEL se construirá como una aplicación web independiente reutilizando el stack tecnológico existente.

## Objetivos / No-Objetivos

**Objetivos:**

- Dashboard web funcional con los 7 módulos descritos en la propuesta
- API REST para gestión de mediciones, evidencias y agregaciones
- Modelo de datos relacional completo con versionado de mediciones
- Cálculo automático de progreso y calidad de evidencia
- Exportación a PDF por organización/paisaje/indicador
- Filtros globales persistentes en toda la aplicación
- Interfaz completamente en español

**No-Objetivos:**

- Autenticación multi-usuario o control de acceso por roles (fase futura)
- Importación automática desde hojas de cálculo existentes (se hará manualmente o como fase posterior)
- Aplicación móvil nativa
- Integración con sistemas externos (GIS, etc.)

## Decisiones

### D1: Stack tecnológico — HTML/JS frontend + Python/FastAPI backend + SQLite

**Decisión**: Usar HTML vanilla con JavaScript modular para el frontend, FastAPI para el backend, y SQLite como base de datos.

**Alternativas consideradas**:

- React/Next.js + PostgreSQL: Más complejo, requiere Node.js y BD separada
- Django con templates: Monolítico, menos flexible para API REST

**Justificación**: Alineado con el stack existente del proyecto. SQLite simplifica el despliegue (archivo único). FastAPI ofrece documentación automática de la API. El frontend vanilla minimiza dependencias.

### D2: Arquitectura de módulos — SPA con routing por hash

**Decisión**: Aplicación de página única (SPA) donde cada módulo se carga dinámicamente. Navegación por hash (`#inicio`, `#ruta`, `#comparador`, etc.).

**Justificación**: Permite transiciones fluidas sin recargar la página. Los filtros globales persisten naturalmente. Compatible con despliegue estático.

### D3: Visualización — Chart.js para gráficos + Leaflet para mapas

**Decisión**: Chart.js para gráficos de barras, líneas y medidores. Leaflet con OpenStreetMap para el módulo de territorio.

**Alternativas**: D3.js (más potente pero más complejo), Mapbox (requiere API key).

**Justificación**: Ambas librerías son gratuitas, ligeras y bien documentadas. Suficientes para los tipos de visualización requeridos.

### D4: Exportación PDF — Generación en backend con reportlab/weasyprint

**Decisión**: El backend genera PDFs usando weasyprint (HTML→PDF) o reportlab.

**Justificación**: Permite HTML/CSS como plantilla de reporte, consistente con el diseño web. Control total del formato.

### D5: Modelo de datos — Versionado por registro de cambios (changelog)

**Decisión**: Cada nueva medición crea un registro en una tabla de changelog con diff, fecha y evidencia vinculada. No se sobreescriben valores anteriores.

**Justificación**: Exigido por los requisitos del sistema MEL. Permite reconstruir el estado en cualquier "corte" de reporte.

## Riesgos / Compromisos

- **[SQLite concurrencia]** → Aceptable para uso single-user/pocos usuarios simultáneos. Migrar a PostgreSQL si se necesita multi-usuario.
- **[Sin autenticación]** → El dashboard expone datos sin protección. Mitigación: desplegar en red interna o agregar autenticación básica.
- **[Volumen de datos]** → SQLite puede ser lento con >100k registros en mediciones. Mitigación: índices y paginación desde el inicio.
- **[Mapas offline]** → Leaflet requiere conexión para tiles de OpenStreetMap. Mitigación: cacheo de tiles o uso de tiles locales si es necesario.

## Preguntas abiertas

- ¿Se requiere autenticación básica para el MVP?
- ¿Cuál es el formato exacto de exportación preferido por CATIE (Word, PDF, ambos)?
- ¿Las coordenadas geográficas de los paisajes y pilotos están disponibles?
