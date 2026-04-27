## ADDED Requirements

### Requirement: MEL Proyecto supports aggregate progress context
The system SHALL make MEL Proyecto indicator data usable as aggregate progress context for other dashboard views.

#### Scenario: Ruta requests project indicator context
- **WHEN** the Ruta del Proyecto module needs project progress context
- **THEN** the system provides MEL Proyecto indicator fields needed to infer progress, monitoring period, LQ relationships, source status, and update recency

#### Scenario: Aggregate context preserves read-only access
- **WHEN** project indicator context is consumed by Ruta del Proyecto
- **THEN** the system does not require admin login and does not expose editing controls outside the MEL Proyecto admin workflow
