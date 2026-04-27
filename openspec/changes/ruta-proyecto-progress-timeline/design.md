## Context

Ruta del Proyecto currently fetches `/api/hitos` and renders a vertical clickable list in `frontend/modules/ruta.js`. The backend seed provides dated milestones such as baseline completion, monitoring cycles, reports, workshops, midterm evaluation, and final evaluation.

MEL Proyecto is now a separate project-level indicator surface backed by `MelProyectoIndicador` and `/api/mel-proyecto`. Its imported fields include `tipo`, `nivel`, `indicador`, `herramienta`, `linea_base`, `meta`, `valor_actual`, `porcentaje_avance`, `fuente_informacion`, `frecuencia`, `lq`, `notas`, `estado_fuente`, and `updated_at`. These fields are enough to infer project progress context without adding a new data-entry model.

## Goals / Non-Goals

**Goals:**
- Make Ruta del Proyecto a horizontal, highly visual timeline.
- Preserve the existing milestone route as the backbone of the project route.
- Add project progress context from MEL Proyecto indicators, especially progress, LQ, frequency, source status, notes, and update recency.
- Keep the view useful if MEL Proyecto data fails to load.
- Keep the implementation in the current vanilla JS/FastAPI style.

**Non-Goals:**
- No new admin editing workflow in Ruta.
- No new Excel import source.
- No migration of existing `hitos` data into MEL Proyecto.
- No attempt to infer exact calendar dates from free-text notes beyond conservative period grouping.

## Decisions

1. Render the timeline in `frontend/modules/ruta.js` using both `api.hitos({})` and `api.melProyecto({})`.
   Rationale: both endpoints already exist, and the Ruta view can tolerate partial failure. Alternative: add a backend aggregation endpoint immediately; defer unless client inference becomes brittle.

2. Use seeded hitos as the canonical timeline anchors.
   Rationale: hitos already contain planned dates, real dates, status, responsible party, and descriptions. Alternative: generating a timeline only from MEL Proyecto would lose explicit project-management milestones.

3. Infer MEL context by period and signal rather than hard-coded indicator-to-hito mappings.
   Rationale: MEL Proyecto does not currently store milestone IDs. The first implementation can group indicators into broad monitoring context using frequency text, LQs, source status, progress, and update timestamps. Alternative: add a join table; too heavy for the requested visual enhancement.

4. Use horizontal scrolling on narrow screens with stable card widths.
   Rationale: the user asked for a horizontal visual timeline, and a scrollable rail preserves that mental model. Alternative: fully vertical mobile layout; acceptable as a fallback only if text overlap becomes a problem.

5. Keep detail state local to the module.
   Rationale: users should inspect milestones without route changes or page reloads. Alternative: deep-link selected milestones; not needed for the first version.

## Risks / Trade-offs

- Free-text inference may feel approximate -> label derived context as project progress context and avoid overstating exact causal links.
- Large indicator notes can overwhelm the timeline -> show compact summaries and reserve full notes for the selected detail panel.
- Parallel API calls can partially fail -> use `Promise.allSettled` or equivalent so Ruta still renders with hitos only.
- Existing CSS palette may become noisy if timeline states add many colors -> use restrained status colors and progress bars, not a new one-note palette.

## Migration Plan

No database migration is required for the first implementation. Deploy as a frontend change that consumes existing APIs. If the client-side inference proves insufficient, add a read-only `/api/ruta/progreso` endpoint later without changing the visible contract.

## Open Questions

- Should timeline period labels use explicit semester names once the project team confirms reporting cadence?
- Should each LQ receive its own mini-lane in the timeline, or stay as tags in milestone details for the first version?
