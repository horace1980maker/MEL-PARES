## ADDED Requirements

### Requirement: Removed dashboard sections are inactive and not advertised
The system SHALL keep Comparador, Aprendizaje, and Inclusion inactive and SHALL NOT present them as available dashboard sections.

#### Scenario: Navigation is rendered
- **WHEN** the application navigation is displayed
- **THEN** Comparador, Aprendizaje, and Inclusion are not shown as selectable sections

#### Scenario: Dashboard scripts are loaded
- **WHEN** the dashboard shell loads frontend modules
- **THEN** it does not load Comparador, Aprendizaje, or Inclusion module scripts

#### Scenario: Removed route is requested
- **WHEN** a user navigates directly to `#comparador`, `#aprendizaje`, or `#inclusion`
- **THEN** the app does not render those removed modules as active dashboard sections

#### Scenario: Retired files remain in the repository
- **WHEN** retired module or CSS files for Comparador, Aprendizaje, or Inclusion still exist in the codebase
- **THEN** they are not loaded, routed, documented, or presented as active dashboard sections

### Requirement: Documentation reflects removed sections
The system SHALL stop documenting Comparador, Aprendizaje, and Inclusion as active dashboard sections.

#### Scenario: User reads dashboard documentation
- **WHEN** the README or main product documentation describes available dashboard modules
- **THEN** Comparador, Aprendizaje, and Inclusion are absent from the active module list

#### Scenario: User reads removed-section references
- **WHEN** documentation contains historical or data-model references related to learning questions or inclusion
- **THEN** those references do not present the removed frontend sections as currently available
