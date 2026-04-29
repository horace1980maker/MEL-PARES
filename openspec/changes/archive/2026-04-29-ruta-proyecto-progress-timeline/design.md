## Context

Ruta del Proyecto previously fetched `/api/hitos` and rendered a vertical clickable list in `frontend/modules/ruta.js`. The requested rebuild uses the `TIMELINE` sheet from `MEL PROPOSAL V6.xlsx` as the visible project route, with deliverable number, output, order, year, month, deliverable title, and status.

Ruta must stand alone. It must not consume MEL Proyecto indicators, infer relationships between indicators and timeline entries, or display LQ, frequency, notes, source status, or aggregate progress from MEL Proyecto.

Ruta also needs an admin editing workflow so authorized users can update every TIMELINE field from the dashboard.

## Goals / Non-Goals

**Goals:**
- Make Ruta del Proyecto a horizontal, highly visual timeline.
- Use the TIMELINE deliverables as the backbone of the project route.
- Show each deliverable's number, output, order, month/year, title, and status.
- Provide admin login and persistent editing for all TIMELINE fields.
- Keep the implementation in the current vanilla JS/FastAPI style.

**Non-Goals:**
- No new Excel import source.
- No migration of existing `hitos` data into MEL Proyecto.
- No new Excel import workflow for Ruta; the current rebuild embeds the reviewed TIMELINE deliverables in the frontend.
- No MEL Proyecto indicator consumption, matching, inference, or aggregate context in Ruta.
- No source-follow-up, LQ, frequency, note, or progress panels derived from indicators.
- No public editing controls; editing requires admin login.

## Decisions

1. Render the timeline in `frontend/modules/ruta.js` using only the reviewed TIMELINE deliverables.
   Rationale: the workbook TIMELINE is the requested project route source, and Ruta should not attach external indicator meaning to timeline entries. Alternative: add a backend Excel-imported timeline endpoint later if the workbook becomes operational data.

2. Use TIMELINE deliverables as the canonical timeline anchors.
   Rationale: TIMELINE contains the current deliverable sequence, output mapping, target month/year, title, and delivery status. Alternative: keep `/api/hitos` as canonical; rejected for this rebuild because it does not match the requested sheet.

3. Do not infer cross-data relationships.
   Rationale: the user clarified that timeline entries should not be linked to indicators or inferred MEL context. The only displayed context should come from TIMELINE fields.

4. Persist editable TIMELINE rows in a Ruta-specific table seeded from the workbook.
   Rationale: admin edits need durable storage. The workbook remains the initial source, but subsequent dashboard edits are saved through the API.

5. Use Ruta-specific admin endpoints with the same token pattern used by MEL admin modules.
   Rationale: this matches existing login UX and backend conventions without coupling Ruta to MEL Proyecto indicators.

6. Use horizontal scrolling on narrow screens with stable card widths.
   Rationale: the user asked for a horizontal visual timeline, and a scrollable rail preserves that mental model. Alternative: fully vertical mobile layout; acceptable as a fallback only if text overlap becomes a problem.

7. Keep detail state local to the module.
   Rationale: users should inspect milestones without route changes or page reloads. Alternative: deep-link selected milestones; not needed for the first version.

## Risks / Trade-offs

- Embedded TIMELINE data can drift if the workbook changes -> if the sheet becomes frequently updated, add a backend import or JSON generation step.
- Dashboard edits can diverge from the workbook -> treat the workbook as seed data and the database as the active editable timeline.
- Existing CSS palette may become noisy if timeline states add many colors -> use restrained status colors, not a new one-note palette.

## Migration Plan

No manual database migration is required for the first implementation because the app creates SQLAlchemy tables on startup. Deploy as a frontend/backend change that seeds `ruta_timeline_items` from the reviewed TIMELINE sheet and updates rows through `/api/ruta/timeline/{id}` after admin login.

## Open Questions

- Should admin edits be exported back to Excel in a later version?
