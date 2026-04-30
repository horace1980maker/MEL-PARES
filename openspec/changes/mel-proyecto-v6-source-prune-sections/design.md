## Context

MEL Proyecto currently seeds project-level indicators from `MEL PROPOSAL V6.xlsx`, but the parser uses the active worksheet implicitly and still carries assumptions from earlier workbook structure, including progress derived from the Meta column. The corrected source contract is explicit: MEL Proyecto indicators come only from `Sheet1` in `MEL PROPOSAL V6.xlsx`.

The current `Sheet1` workbook structure has an outcome section and an output section. Header rows include fields for level/output, indicator text, measurement instrument, evidence, baseline, target, current advance, percentage, source, frequency, learning question, and notes. The dashboard should reflect this source without importing from `TIMELINE`, `Sheet3`, or any earlier file version.

Comparador, Aprendizaje, and Inclusion are now out of scope. The current shell already stops loading those module scripts and redirects direct hashes for those modules back to Inicio, so they are no longer active runtime sections. The remaining work is cleanup of any visible navigation, title mappings, documentation, and unused module/CSS files that still present them as available dashboard sections.

## Goals / Non-Goals

**Goals:**
- Make `Sheet1` in `MEL PROPOSAL V6.xlsx` the explicit MEL Proyecto source.
- Parse current Sheet1 columns without retaining old count or column assumptions.
- Use the Sheet1 `Porcentaje` column as the imported progress percentage, while preserving Meta and Avance as source fields.
- Keep MEL Proyecto admin editing, filters, summary metrics, and XLSX export working with the refreshed source data.
- Keep Comparador, Aprendizaje, and Inclusion inactive, and clean up remaining navigation, route title, module-file, CSS, and user-facing documentation references that still present them as available sections.
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

4. Treat removed sections as inactive when their scripts are not loaded and their direct hashes are redirected, then clean up remaining visible references.
   Rationale: the app already prevents Comparador, Aprendizaje, and Inclusion from rendering as active modules. The remaining concern is user-facing consistency: navigation, route-title labels, README text, and stale assets should not advertise removed sections.

5. Keep documentation aligned with the active app surface.
   Rationale: README and specs should not advertise removed sections. Alternative: leave docs as historical notes; rejected because the removed sections are breaking changes to the current dashboard.

## Risks / Trade-offs

- Existing SQLite databases may keep old MEL Proyecto rows -> add deterministic source identifiers and reset/reseed behavior when the workbook source set changes.
- Sheet1 contains non-numeric values such as `#VALUE!` or text in numeric columns -> parse defensively and preserve display text where useful, while using safe numeric defaults for calculations.
- Existing inbound hashes such as `#comparador`, `#aprendizaje`, and `#inclusion` are already redirected away from removed modules; keep that behavior while removing visible labels that imply the modules are still available.
- Documentation cleanup can be broader than code cleanup -> keep changes focused on references that present Comparador, Aprendizaje, and Inclusion as available app sections, while leaving backend data-model references if they still describe active data.

## Migration Plan

1. Update MEL Proyecto parser and tests against `MEL PROPOSAL V6.xlsx` / `Sheet1`.
2. Adjust persisted data handling so stale rows from older workbook assumptions are not retained.
3. Update MEL Proyecto frontend labels/fields only where Sheet1 changes the source contract.
4. Confirm Comparador, Aprendizaje, and Inclusion remain inactive, then remove remaining navigation, route title, stale asset, and user-facing documentation references.
5. Run backend MEL Proyecto tests, frontend syntax checks, and targeted reference searches for removed sections.

## Open Questions

- Should removed module files be deleted from `frontend/modules/`, or is it enough to leave them as retired code once they are not loaded, routed, or documented?
- Should MEL Proyecto export include both `Avance` and `Porcentaje` columns to mirror Sheet1 exactly?
