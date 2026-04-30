## 1. MEL Proyecto Source Contract

- [x] 1.1 Update `backend/routes/mel_proyecto.py` to select `Sheet1` explicitly instead of relying on the active workbook sheet.
- [x] 1.2 Update the Sheet1 parser to map current columns: level/output, indicator, instrument, evidence, baseline, Meta, Avance, Porcentaje, source, frequency, LQ, and notes.
- [x] 1.3 Preserve `Meta` and `Avance` as source fields while using `Porcentaje` as the progress percentage.
- [x] 1.4 Ensure imports ignore `TIMELINE`, `Sheet3`, `MEL PROPOSAL V.5..md`, and any previous file version.
- [x] 1.5 Add deterministic source-set handling so stale MEL Proyecto records from older workbook/parser assumptions are not retained.

## 2. MEL Proyecto API and Frontend

- [x] 2.1 Update MEL Proyecto API output/export fields to expose the refreshed Sheet1-derived evidence, advance, and percentage values.
- [x] 2.2 Update `frontend/modules/mel-proyecto.js` labels, summary details, editor fields, and progress display to match the refreshed Sheet1 contract.
- [x] 2.3 Keep MEL Proyecto admin login and protected updates working after the source-field changes.
- [x] 2.4 Update `frontend/js/api.js` only if endpoint contracts or export behavior require frontend helper changes.

## 3. Removed Dashboard Sections Cleanup

- [x] 3.1 Remove Comparador, Aprendizaje, and Inclusion from `frontend/index.html` navigation.
- [x] 3.2 Confirm Comparador, Aprendizaje, and Inclusion module scripts are not loaded in `frontend/index.html`.
- [x] 3.3 Confirm direct `#comparador`, `#aprendizaje`, and `#inclusion` hashes are redirected away from removed modules in `frontend/js/app.js`.
- [x] 3.4 Delete or clearly retire `frontend/modules/comparador.js`, `frontend/modules/aprendizaje.js`, and `frontend/modules/inclusion.js` if they are no longer loaded or documented.
- [x] 3.5 Remove or update CSS that only supports the removed Comparador, Aprendizaje, and Inclusion sections when it is no longer referenced.

## 4. Documentation and Specs

- [x] 4.1 Update `README.md` so active module lists and section descriptions no longer present Comparador, Aprendizaje, or Inclusion as available sections.
- [x] 4.2 Update documentation references to clarify MEL Proyecto uses `MEL PROPOSAL V6.xlsx` / `Sheet1`.
- [x] 4.3 Keep references to learning-question or inclusion data models only where they describe backend data, not removed frontend sections.

## 5. Verification

- [x] 5.1 Update backend MEL Proyecto tests to calculate expected counts and fields from the current `Sheet1` parser.
- [x] 5.2 Add or update tests proving `TIMELINE` and `Sheet3` are not imported as MEL Proyecto indicators.
- [x] 5.3 Run `python -m unittest backend.tests.test_mel_proyecto backend.tests.test_ruta_timeline`.
- [x] 5.4 Run `python -m compileall backend`.
- [x] 5.5 Run `node --check frontend/js/app.js`, `node --check frontend/js/api.js`, and `node --check frontend/modules/mel-proyecto.js`.
- [x] 5.6 Search for stale active-section references to Comparador, Aprendizaje, and Inclusion in frontend shell and README.
