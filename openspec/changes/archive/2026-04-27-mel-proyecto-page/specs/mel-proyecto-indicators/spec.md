## ADDED Requirements

### Requirement: MEL Proyecto page is available
The system SHALL provide a MEL Proyecto page as a first-class dashboard route for project-level MEL indicators.

#### Scenario: User opens MEL Proyecto
- **WHEN** a user navigates to the MEL Proyecto route
- **THEN** the system displays the MEL Proyecto page title, indicator summary, and project indicator list

#### Scenario: Navigation includes MEL Proyecto
- **WHEN** the application navigation is rendered
- **THEN** the user can select MEL Proyecto without typing the route manually

### Requirement: Project indicators are seeded from the Excel source
The system SHALL initialize MEL Proyecto indicators from `MEL PROPOSAL V6.xlsx`.

#### Scenario: Initial project indicators are loaded
- **WHEN** the MEL Proyecto data store is empty and the API is requested
- **THEN** the system imports the project indicators from the Excel source

#### Scenario: Source fields are preserved
- **WHEN** indicators are displayed after import
- **THEN** each indicator includes its level or output, indicator text, verification tool or media, baseline, target, source, frequency, LQ, notes, type, and progress

#### Scenario: Incomplete source indicator remains visible
- **WHEN** an imported indicator contains placeholder text such as "Completar UNEP"
- **THEN** the system displays the indicator with an incomplete-source status instead of excluding it

### Requirement: Progress is shown as horizontal bars
The system SHALL use the indicator Meta value as the MEL Proyecto progress value and display it as a horizontal bar with the current percentage.

#### Scenario: Read-only progress display
- **WHEN** a user views the indicator list without edit mode
- **THEN** each indicator shows a horizontal progress bar and a percentage label

#### Scenario: Meta value is expressed as progress percentage
- **WHEN** an indicator is loaded from the Excel Meta column
- **THEN** the system displays that value as the indicator Avance percentage

#### Scenario: Progress is bounded visually
- **WHEN** an indicator progress is below 0 percent or above 100 percent
- **THEN** the visual bar is clamped between 0 percent and 100 percent while retaining the saved value for reporting

### Requirement: Editing requires admin login
The system SHALL require a successful MEL Proyecto admin login before indicator data can be changed.

#### Scenario: Unauthenticated user sees read-only data
- **WHEN** a user has not logged in as a MEL Proyecto admin
- **THEN** the indicator list remains visible and the edit panel is hidden

#### Scenario: Admin logs in successfully
- **WHEN** a user submits valid MEL Proyecto admin credentials
- **THEN** the system stores an edit session token and enables editing controls

#### Scenario: Non-admin login is rejected
- **WHEN** a user submits non-admin or invalid MEL Proyecto credentials
- **THEN** the system keeps the page in read-only mode and shows an authentication error

### Requirement: Authenticated admins can update indicators
The system SHALL allow authenticated MEL Proyecto admins to update indicator metadata and progress.

#### Scenario: Admin updates indicator text fields
- **WHEN** an authenticated admin changes editable indicator fields and saves
- **THEN** the system persists the changes and returns the updated indicator

#### Scenario: Admin adjusts progress with slider
- **WHEN** an authenticated admin moves the progress slider and saves
- **THEN** the system persists the selected percentage and refreshes the horizontal progress bar

#### Scenario: Update without valid token is rejected
- **WHEN** an update request is sent without a valid MEL Proyecto admin token
- **THEN** the system rejects the request and does not change the indicator

### Requirement: MEL Proyecto summary is calculated
The system SHALL calculate summary values for the MEL Proyecto page.

#### Scenario: Summary displays totals
- **WHEN** the MEL Proyecto page loads
- **THEN** the system shows total indicators, Outcome count, Output count, average progress, and completed indicator count

#### Scenario: Filters update visible indicators
- **WHEN** a user filters by indicator type or searches indicator text
- **THEN** the visible list and count reflect the selected filter

### Requirement: MEL Proyecto indicators can be exported
The system SHALL allow users to export MEL Proyecto indicator data as an XLSX file.

#### Scenario: User exports current indicator data
- **WHEN** a user clicks the MEL Proyecto export action
- **THEN** the system downloads an XLSX file containing the current indicator dataset

#### Scenario: Export respects filters
- **WHEN** a user exports after applying a type or search filter
- **THEN** the downloaded XLSX contains only indicators matching those filters
