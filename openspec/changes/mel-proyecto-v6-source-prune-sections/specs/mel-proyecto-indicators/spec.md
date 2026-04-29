## MODIFIED Requirements

### Requirement: Project indicators are seeded from the Excel source
The system SHALL initialize MEL Proyecto indicators from `Sheet1` in `MEL PROPOSAL V6.xlsx`.

#### Scenario: Initial project indicators are loaded
- **WHEN** the MEL Proyecto data store is empty and the API is requested
- **THEN** the system imports the project indicators from `Sheet1` in `MEL PROPOSAL V6.xlsx`

#### Scenario: Source fields are preserved
- **WHEN** indicators are displayed after import
- **THEN** each indicator includes its level or output, indicator text, measurement instrument, evidence, baseline, target, advance value, percentage, source, frequency, LQ, notes, type, and progress

#### Scenario: Incomplete source indicator remains visible
- **WHEN** an imported indicator contains placeholder text such as "Completar UNEP"
- **THEN** the system displays the indicator with an incomplete-source status instead of excluding it

#### Scenario: Non-indicator sheets are ignored
- **WHEN** the workbook also contains `TIMELINE`, `Sheet3`, or other sheets
- **THEN** MEL Proyecto imports indicators only from `Sheet1`

#### Scenario: Old source leftovers are absent
- **WHEN** the Sheet1 source data changes from a previous workbook version
- **THEN** the system does not keep stale MEL Proyecto records from the previous source set

### Requirement: Progress is shown as horizontal bars
The system SHALL use the Sheet1 `Porcentaje` value as the MEL Proyecto progress value and display it as a horizontal bar with the current percentage.

#### Scenario: Read-only progress display
- **WHEN** a user views the indicator list without edit mode
- **THEN** each indicator shows a horizontal progress bar and a percentage label

#### Scenario: Porcentaje value is expressed as progress percentage
- **WHEN** an indicator is loaded from the Excel Sheet1 `Porcentaje` column
- **THEN** the system displays that value as the indicator Avance percentage

#### Scenario: Meta and Avance source values remain available
- **WHEN** an indicator is displayed or exported
- **THEN** the system preserves the Sheet1 `Meta` and `Avance` values separately from the progress percentage

#### Scenario: Progress is bounded visually
- **WHEN** an indicator progress is below 0 percent or above 100 percent
- **THEN** the visual bar is clamped between 0 percent and 100 percent while retaining the saved value for reporting

### Requirement: MEL Proyecto summary is calculated
The system SHALL calculate summary values for the MEL Proyecto page from the current Sheet1-backed indicator dataset.

#### Scenario: Summary displays totals
- **WHEN** the MEL Proyecto page loads
- **THEN** the system shows total indicators, Outcome count, Output count, average progress, completed indicator count, and incomplete-source count based on the current Sheet1 import

#### Scenario: Filters update visible indicators
- **WHEN** a user filters by indicator type or searches indicator text
- **THEN** the visible list and count reflect the selected filter

### Requirement: MEL Proyecto indicators can be exported
The system SHALL allow users to export the current Sheet1-backed MEL Proyecto indicator data as an XLSX file.

#### Scenario: User exports current indicator data
- **WHEN** a user clicks the MEL Proyecto export action
- **THEN** the system downloads an XLSX file containing the current Sheet1-backed indicator dataset

#### Scenario: Export respects filters
- **WHEN** a user exports after applying a type or search filter
- **THEN** the downloaded XLSX contains only indicators matching those filters

#### Scenario: Export includes refreshed source columns
- **WHEN** a user exports MEL Proyecto indicators
- **THEN** the downloaded XLSX includes Sheet1-derived fields for evidence, advance value, and percentage
