## ADDED Requirements

### Requirement: Ruta displays a horizontal project progress timeline
The system SHALL display Ruta del Proyecto as a horizontal visual timeline that can be scanned across project deliverables from the TIMELINE sheet.

#### Scenario: User opens Ruta del Proyecto
- **WHEN** a user navigates to the Ruta del Proyecto module
- **THEN** the system displays project deliverables in chronological order on a horizontal timeline

#### Scenario: Timeline fits narrow screens
- **WHEN** the timeline is viewed on a mobile-width screen
- **THEN** the system keeps deliverable content readable using horizontal scrolling or a responsive stacked layout without overlapping text

### Requirement: Timeline uses only TIMELINE sheet fields
The system SHALL display timeline content using only the reviewed TIMELINE fields and SHALL NOT link timeline entries to MEL Proyecto indicators.

#### Scenario: Deliverable is displayed
- **WHEN** Ruta renders a timeline entry
- **THEN** the entry displays TIMELINE fields such as deliverable number, output, month/year, title, order, and status

#### Scenario: MEL Proyecto indicators exist
- **WHEN** MEL Proyecto indicator data is available elsewhere in the dashboard
- **THEN** Ruta does not fetch it, summarize it, or infer any relationship between indicators and timeline deliverables

### Requirement: Ruta timeline fields are admin-editable
The system SHALL allow an authenticated admin to edit all TIMELINE fields for each Ruta deliverable.

#### Scenario: Admin logs into Ruta
- **WHEN** an authorized admin submits valid Ruta credentials
- **THEN** the system enables editing controls for timeline deliverables

#### Scenario: Non-admin attempts to edit Ruta
- **WHEN** a user attempts to update a timeline deliverable without a valid admin token
- **THEN** the system rejects the update

#### Scenario: Admin updates a deliverable
- **WHEN** an authenticated admin changes No. Entregable, Output, Orden, Año, Mes, Entregable, or Estado
- **THEN** the system persists the updated fields and refreshes the timeline/detail view from the saved record

### Requirement: Timeline communicates delivery status
The system SHALL show each deliverable's status from the TIMELINE sheet.

#### Scenario: Deliverable is marked delivered
- **WHEN** a TIMELINE row has Estado "Entregado"
- **THEN** the timeline displays that entry as delivered

#### Scenario: Deliverable is in process
- **WHEN** a TIMELINE row has Estado "En proceso"
- **THEN** the timeline displays that entry as in process

### Requirement: Timeline detail remains inspectable
The system SHALL let users inspect a deliverable or period without leaving Ruta del Proyecto.

#### Scenario: User selects a timeline item
- **WHEN** a user selects a timeline deliverable
- **THEN** the system displays a detail panel with the deliverable's TIMELINE information

#### Scenario: User changes selection
- **WHEN** a user selects a different timeline item
- **THEN** the detail panel updates without reloading the whole dashboard page
