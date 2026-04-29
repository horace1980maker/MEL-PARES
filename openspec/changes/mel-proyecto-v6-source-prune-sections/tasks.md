## 1. MEL Proyecto Source Contract

- [ ] 1.1 Update `backend/routes/mel_proyecto.py` to select `Sheet1` explicitly instead of relying on the active workbook sheet.
- [ ] 1.2 Update the Sheet1 parser to map current columns: level/output, indicator, instrument, evidence, baseline, Meta, Avance, Porcentaje, source, frequency, LQ, and notes.
- [ ] 1.3 Preserve `Meta` and `Avance` as source fields while using `Porcentaje` as the progress percentage.
- [ ] 1.4 Ensure imports ignore `TIMELINE`, `Sheet3`, `MEL PROPOSAL V.5..md`, and any previous file version.
- [ ] 1.5 Add deterministic source-set handling so stale MEL Proyecto records from older workbook/parser assumptions are not retained.

## 2. MEL Proyecto API and Frontend

- [ ] 2.1 Update MEL Proyecto API output/export fields to expose the refreshed Sheet1-derived evidence, advance, and percentage values.
- [ ] 2.2 Update `frontend/modules/mel-proyecto.js` labels, summary details, editor fields, and progress display to match the refreshed Sheet1 contract.
- [ ] 2.3 Keep MEL Proyecto admin login and protected updates working after the source-field changes.
- [ ] 2.4 Update `frontend/js/api.js` only if endpoint contracts or export behavior require frontend helper changes.

## 3. Remove Dashboard Sections

- [ ] 3.1 Remove Comparador, Aprendizaje, and Inclusion from `frontend/index.html` navigation.
- [ ] 3.2 Stop loading Comparador, Aprendizaje, and Inclusion module scripts in `frontend/index.html`.
- [ ] 3.3 Remove Comparador, Aprendizaje, and Inclusion route title mappings from `frontend/js/app.js`.
- [ ] 3.4 Delete or clearly retire `frontend/modules/comparador.js`, `frontend/modules/aprendizaje.js`, and `frontend/modules/inclusion.js` if they are no longer loaded.
- [ ] 3.5 Remove or update CSS that only supports the removed Comparador, Aprendizaje, and Inclusion sections when it is no longer referenced.

## 4. Documentation and Specs

- [ ] 4.1 Update `README.md` so active module lists and section descriptions no longer present Comparador, Aprendizaje, or Inclusion as available sections.
- [ ] 4.2 Update documentation references to clarify MEL Proyecto uses `MEL PROPOSAL V6.xlsx` / `Sheet1`.
- [ ] 4.3 Keep references to learning-question or inclusion data models only where they describe backend data, not removed frontend sections.

## 5. Verification

- [ ] 5.1 Update backend MEL Proyecto tests to calculate expected counts and fields from the current `Sheet1` parser.
- [ ] 5.2 Add or update tests proving `TIMELINE` and `Sheet3` are not imported as MEL Proyecto indicators.
- [ ] 5.3 Run `python -m unittest backend.tests.test_mel_proyecto backend.tests.test_ruta_timeline`.
- [ ] 5.4 Run `python -m compileall backend`.
- [ ] 5.5 Run `node --check frontend/js/app.js`, `node --check frontend/js/api.js`, and `node --check frontend/modules/mel-proyecto.js`.
- [ ] 5.6 Search for stale active-section references to Comparador, Aprendizaje, and Inclusion in frontend shell and README.
