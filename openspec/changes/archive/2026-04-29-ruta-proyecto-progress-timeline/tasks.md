## 1. Data Loading

- [x] 1.1 Add Ruta timeline model, seed parser, and API list endpoint based on the `TIMELINE` sheet deliverables.
- [x] 1.2 Remove MEL Proyecto indicator fetching from Ruta.
- [x] 1.3 Remove local helper functions that summarize or infer context from MEL Proyecto indicators.
- [x] 1.4 Update `frontend/modules/ruta.js` to load Ruta deliverables from `/api/ruta/timeline`.

## 2. Timeline Experience

- [x] 2.1 Replace the current vertical Ruta markup with a horizontal timeline rail anchored on chronological TIMELINE deliverables.
- [x] 2.2 Add deliverable cards or nodes with status, date, output, number, and sequence.
- [x] 2.3 Add a selected deliverable detail panel showing only TIMELINE sheet information.
- [x] 2.4 Ensure selection changes update the detail panel without reloading the dashboard route.
- [x] 2.5 Add Ruta admin login controls.
- [x] 2.6 Add an admin-only editor for all TIMELINE fields: No. Entregable, Output, Orden, Año, Mes, Entregable, and Estado.
- [x] 2.7 Persist admin edits through a protected Ruta PATCH endpoint and refresh the timeline/detail view.

## 3. Styling

- [x] 3.1 Add responsive timeline styles in `frontend/css/styles.css` with stable dimensions, readable labels, and horizontal scrolling or safe mobile stacking.
- [x] 3.2 Add restrained visual states for entregado and en proceso.
- [x] 3.3 Verify text does not overlap on desktop and mobile widths.
- [x] 3.4 Add compact admin login/editor styling consistent with existing MEL admin patterns.

## 4. Verification

- [x] 4.1 Run JavaScript syntax checks for touched frontend modules.
- [x] 4.2 Manually verify Ruta renders with TIMELINE deliverables only.
- [x] 4.3 Manually verify Ruta does not fetch or display MEL Proyecto indicator context.
- [x] 4.4 Add backend tests for Ruta timeline seeding, admin login, unauthorized update rejection, and updating all fields.
