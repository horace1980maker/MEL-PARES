## 1. Data Loading

- [x] 1.1 Update `frontend/modules/ruta.js` to load hitos and MEL Proyecto indicators in parallel.
- [x] 1.2 Add graceful fallback so Ruta renders existing hitos if MEL Proyecto data fails or is empty.
- [x] 1.3 Create local helper functions to summarize MEL Proyecto indicators by progress, LQ, frequency, source status, notes, and update recency.

## 2. Timeline Experience

- [x] 2.1 Replace the current vertical Ruta markup with a horizontal timeline rail anchored on chronological hitos.
- [x] 2.2 Add milestone cards or nodes with status, date, responsible party, progress signal, and source-follow-up indicator.
- [x] 2.3 Add a selected milestone detail panel showing milestone text, inferred MEL context, related LQs, indicator counts, and source status.
- [x] 2.4 Ensure selection changes update the detail panel without reloading the dashboard route.

## 3. Styling

- [x] 3.1 Add responsive timeline styles in `frontend/css/styles.css` with stable dimensions, readable labels, and horizontal scrolling or safe mobile stacking.
- [x] 3.2 Add restrained visual states for completado, en progreso, pendiente, rezago, and fuente incompleta.
- [x] 3.3 Verify text does not overlap on desktop and mobile widths.

## 4. Verification

- [x] 4.1 Run JavaScript syntax checks for touched frontend modules.
- [x] 4.2 Manually verify Ruta renders with both hitos plus MEL Proyecto context.
- [x] 4.3 Manually verify Ruta still renders when MEL Proyecto loading fails or returns no records.
