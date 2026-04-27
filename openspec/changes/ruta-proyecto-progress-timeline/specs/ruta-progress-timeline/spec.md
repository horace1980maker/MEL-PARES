## ADDED Requirements

### Requirement: Ruta displays a horizontal project progress timeline
The system SHALL display Ruta del Proyecto as a horizontal visual timeline that can be scanned across project milestones.

#### Scenario: User opens Ruta del Proyecto
- **WHEN** a user navigates to the Ruta del Proyecto module
- **THEN** the system displays project milestones in chronological order on a horizontal timeline

#### Scenario: Timeline fits narrow screens
- **WHEN** the timeline is viewed on a mobile-width screen
- **THEN** the system keeps milestone content readable using horizontal scrolling or a responsive stacked layout without overlapping text

### Requirement: Timeline milestones include MEL Proyecto progress context
The system SHALL enrich each milestone with progress context inferred from MEL Proyecto indicators when project indicator data is available.

#### Scenario: Progress context is available
- **WHEN** Ruta loads both milestone data and MEL Proyecto indicators
- **THEN** each milestone displays a visual progress signal derived from related indicator progress, source status, or project summary data

#### Scenario: Progress context is unavailable
- **WHEN** Ruta loads milestones but MEL Proyecto indicator data cannot be loaded
- **THEN** the system still displays the timeline using the existing milestone date, status, responsible party, and description fields

### Requirement: Timeline communicates monitoring moments
The system SHALL show monitoring moments inferred from MEL Proyecto frequency, learning question, notes, progress, and update fields.

#### Scenario: Indicators include monitoring metadata
- **WHEN** MEL Proyecto indicators include frequency, LQ, notes, progress, or update timestamps
- **THEN** the timeline detail view summarizes those signals as monitoring context for the relevant milestone or project period

#### Scenario: Indicators mention incomplete sources
- **WHEN** one or more related MEL Proyecto indicators have incomplete source status
- **THEN** the timeline highlights the milestone or period as needing source follow-up

### Requirement: Timeline detail remains inspectable
The system SHALL let users inspect a milestone or period without leaving Ruta del Proyecto.

#### Scenario: User selects a timeline item
- **WHEN** a user selects a milestone or monitoring period
- **THEN** the system displays a detail panel with milestone information, inferred progress, related LQs, indicator counts, and source follow-up status

#### Scenario: User changes selection
- **WHEN** a user selects a different timeline item
- **THEN** the detail panel updates without reloading the whole dashboard page
