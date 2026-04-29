## Why

MEL Proyecto must use `Sheet1` from the updated `MEL PROPOSAL V6.xlsx` workbook as the source of truth, with its current indicator data and no stale records, parser assumptions, tests, or UI labels left over from earlier file versions. The dashboard also needs to be simplified by removing sections that are no longer part of the current product scope.

## What Changes

- Refresh the MEL Proyecto import contract against `Sheet1` in the updated `MEL PROPOSAL V6.xlsx` workbook.
- Rebuild the MEL Proyecto import mapping so visible indicators, summaries, admin editing fields, filters, tests, and exports reflect only the current workbook data.
- Remove old-source leftovers: stale count assumptions, obsolete sheet parsing assumptions, and fallback behavior that could silently preserve data from an earlier version of the workbook.
- Use `Sheet1` as the indicator worksheet; do not import indicators from `TIMELINE`, `Sheet3`, or any previous file version.
- **BREAKING** Remove the Comparador dashboard section from navigation, route handling, script loading, and user-facing documentation.
- **BREAKING** Remove the Aprendizaje dashboard section from navigation, route handling, script loading, and user-facing documentation.
- **BREAKING** Remove the Inclusion dashboard section from navigation, route handling, script loading, and user-facing documentation.
- Keep Ruta independent from MEL Proyecto and from the removed sections.

## Capabilities

### New Capabilities
- `dashboard-section-pruning`: Covers removal of the Comparador, Aprendizaje, and Inclusion dashboard sections from the active app surface.

### Modified Capabilities
- `mel-proyecto-indicators`: Refresh the source workbook contract for MEL Proyecto indicators to `MEL PROPOSAL V6.xlsx` / `Sheet1`, and require the implementation to remove old-source assumptions.

## Impact

- Data/source: MEL Proyecto seed logic, parser mapping, tests, and expected indicator counts change to match `Sheet1` in the updated `MEL PROPOSAL V6.xlsx` workbook.
- Backend/API: `backend/routes/mel_proyecto.py`, MEL Proyecto tests, and any source constants or import helpers that reference the old file.
- Frontend: MEL Proyecto page field rendering if the current V6 `Sheet1` columns differ from the current UI fields.
- Frontend shell: `frontend/index.html`, route/module registration, script loading, and README references for Comparador, Aprendizaje, and Inclusion.
- Documentation: OpenSpec main specs and README sections must no longer describe removed dashboard sections as available.
- Source-file note: `MEL PROPOSAL V6.xlsx` is the intended source, and `Sheet1` is the indicator worksheet for MEL Proyecto.
