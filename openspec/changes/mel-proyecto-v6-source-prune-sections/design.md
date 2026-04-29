## Context

MEL Proyecto currently seeds project-level indicators from `MEL PROPOSAL V6.xlsx`, but the parser uses the active worksheet implicitly and still carries assumptions from earlier workbook structure, including progress derived from the Meta column. The corrected source contract is explicit: MEL Proyecto indicators come only from `Sheet1` in `MEL PROPOSAL V6.xlsx`.

The current `Sheet1` workbook structure has an outcome section and an output section. Header rows include fields for level/output, indicator text, measurement instrument, evidence, baseline, target, current advance, percentage, source, frequency, learning question, and notes. The dashboard should reflect this source without importing from `TIMELINE`, `Sheet3`, or any earlier file version.

The dashboard shell also still exposes Comparador, Aprendizaje, and Inclusion as first-class modules. These sections are now out of scope and should be removed from the active app surface.

## Goals / Non-Goals

**Goals:**
- Make `Sheet1` in `MEL PROPOSAL V6.xlsx` the explicit MEL Proyecto source.
- Parse current Sheet1 columns without retaining old count or column assumptions.
- Use the Sheet1 `Porcentaje` column as the imported progress percentage, while preserving Meta and Avance as source fields.
- Keep MEL Proyecto admin editing, filters, summary metrics, and XLSX export working with the refreshed source data.
- Remove Comparador, Aprendizaje, and Inclusion from navigation, route titles, script loading, and user-facing documentation.
- Keep Ruta independent and unchanged by this change.

**Non-Goals:**
- No changes to Ruta timeline data or admin editing.
- No import from `TIMELINE`, `Sheet3`, or `MEL PROPOSAL V.5..md`.
- No deletion of backend reference models such as `PreguntaDeAprendizaje` if they are still used by other capabilities.
- No replacement of the MEL Proyecto admin authentication model.

## Decisions

1. Select `Sheet1` by name when building MEL Proyecto records.
   Rationale: using `wb.active` is brittle and can silently change if the workbook active sheet changes. Alternative: continue using the active sheet; rejected because the source contract must be explicit.

2. Treat `Porcentaje` as the progress source and preserve `Avance` separately.
   Rationale: Sheet1 separates target (`Meta`), current value (`Avance`), and percentage (`Porcentaje`). The visual progress bar should use the explicit percentage column instead of deriving progress from Meta. Alternative: continue deriving progress from Meta; rejected because it is now stale for this workbook.

3. Reset stale seeded data when the workbook-derived source set changes.
   Rationale: existing local databases may contain records imported under older parser assumptions. The implementation should detect source-set drift or provide a reset path so old indicators are not mixed with current Sheet1 records. Alternative: seed only when empty; rejected because it can preserve old leftovers after workbook changes.

4. Remove removed sections from the app shell first, then optionally leave dead module files only if they are no longer loaded or documented.
   Rationale: the user-facing product surface is controlled by navigation, route titles, and script loading. Deleting unused module files is acceptable if it does not disturb unrelated code, but the essential behavior is that users cannot access those sections as active modules.

5. Keep documentation aligned with the active app surface.
   Rationale: README and specs should not advertise removed sections. Alternative: leave docs as historical notes; rejected because the removed sections are breaking changes to the current dashboard.

## Risks / Trade-offs

- Existing SQLite databases may keep old MEL Proyecto rows -> add deterministic source identifiers and reset/reseed behavior when the workbook source set changes.
- Sheet1 contains non-numeric values such as `#VALUE!` or text in numeric columns -> parse defensively and preserve display text where useful, while using safe numeric defaults for calculations.
- Removing sections may leave inbound hashes such as `#comparador` with no module -> route users to a clear not-available state or remove title mappings so the app does not present removed sections as active.
- Documentation cleanup can be broader than code cleanup -> keep changes focused on references that present Comparador, Aprendizaje, and Inclusion as available app sections.

## Migration Plan

1. Update MEL Proyecto parser and tests against `MEL PROPOSAL V6.xlsx` / `Sheet1`.
2. Adjust persisted data handling so stale rows from older workbook assumptions are not retained.
3. Update MEL Proyecto frontend labels/fields only where Sheet1 changes the source contract.
4. Remove Comparador, Aprendizaje, and Inclusion from navigation, route title mappings, script loading, and user-facing docs.
5. Run backend MEL Proyecto tests, frontend syntax checks, and targeted reference searches for removed sections.

## Open Questions

- Should removed module files be deleted from `frontend/modules/`, or is it enough to stop loading and documenting them?
- Should MEL Proyecto export include both `Avance` and `Porcentaje` columns to mirror Sheet1 exactly?
