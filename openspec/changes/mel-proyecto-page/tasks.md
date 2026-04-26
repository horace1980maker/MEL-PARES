## 1. Backend Data Model And Seeding

- [x] 1.1 Add a `MelProyectoIndicador` SQLAlchemy model for project-level indicators.
- [x] 1.2 Register the model so the existing database initialization creates the table.
- [x] 1.3 Implement an idempotent seed/import function for `MEL PROPOSAL V6.xlsx`.
- [x] 1.4 Map Excel rows into Outcome/Output indicators with level/output, indicator, verification media, baseline, target, source, frequency, LQ, notes, status, current value, and progress.
- [x] 1.5 Preserve existing edited records when the seed/import function runs more than once.

## 2. Backend API And Auth

- [x] 2.1 Add `/api/mel-proyecto/login` using the existing simple bearer-token pattern with environment-configurable credentials.
- [x] 2.2 Add read endpoints for indicator list, summary, and optional filters by type/search.
- [x] 2.3 Add an authenticated update endpoint for editable indicator fields and progress percentage.
- [x] 2.4 Reject update requests without a valid MEL Proyecto editor token.
- [x] 2.5 Include incomplete-source status for placeholder indicators such as "Completar UNEP".

## 3. Frontend Route And API Client

- [x] 3.1 Add MEL Proyecto API helpers to `frontend/js/api.js`.
- [x] 3.2 Add route aliases and page title for `melProyecto` / `mel-proyecto` in `frontend/js/app.js`.
- [x] 3.3 Add the MEL Proyecto script to `frontend/index.html`.
- [x] 3.4 Add a MEL Proyecto navigation link in the sidebar.

## 4. Frontend MEL Proyecto Module

- [x] 4.1 Create `frontend/modules/mel-proyecto.js` following the existing module registration pattern.
- [x] 4.2 Render summary metrics for total indicators, Outcomes, Outputs, average progress, and completed indicators.
- [x] 4.3 Render the indicator list with level/output, indicator text, baseline, target, source, frequency, LQ, notes, status, and horizontal progress bar.
- [x] 4.4 Add type and search filters that update the visible indicators and count.
- [x] 4.5 Add login/logout UI that stores and clears the MEL Proyecto edit session.
- [x] 4.6 Render authenticated edit controls for selected indicators, including a slider for progress percentage.
- [x] 4.7 Save edits through the authenticated API and refresh the visible progress bar after save.

## 5. Styling And Responsive Behavior

- [x] 5.1 Add MEL Proyecto styles to `frontend/css/styles.css` using the existing dashboard visual language.
- [x] 5.2 Ensure progress bars, sliders, filters, and long indicator text remain readable on desktop and mobile widths.
- [x] 5.3 Keep unauthenticated edit controls visibly read-only without hiding the indicator data.

## 6. Verification

- [x] 6.1 Run backend syntax checks with `python -m compileall backend`.
- [x] 6.2 Run frontend syntax checks for changed JavaScript files with `node --check`.
- [x] 6.3 Manually verify read-only load, login failure, login success, slider save, filter behavior, and incomplete-source display.
