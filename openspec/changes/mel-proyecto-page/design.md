## Context

The current app is a hash-routed FastAPI plus vanilla frontend dashboard. It already includes a `melSocios` module with authenticated editing, SQLAlchemy persistence, REST endpoints, and progress bars for organization-level MEL indicators. The new MEL Proyecto page should follow that local pattern while tracking project-level indicators from `MEL PROPOSAL V6.xlsx`.

The Excel source contains 10 unique project indicators: 4 Outcome indicators and 6 Output indicators. Rows include level/output, indicator text, tools or verification media, baseline, target, information source, frequency, LQ, and notes. One Output 3.1 indicator still contains placeholder UNEP text and should be imported visibly as incomplete rather than hidden.

## Goals / Non-Goals

**Goals:**
- Add a first-class MEL Proyecto page available from the system navigation.
- Persist project-level indicators separately from partner-level `mel_socios` records.
- Seed initial project indicators from `MEL PROPOSAL V6.xlsx`.
- Show progress as horizontal bars, using the Excel Meta value as Avance and displaying it as a percentage.
- Hide indicator editing until an admin is logged in, then let authenticated admins update indicator metadata and progress using a slider.
- Reuse existing API, router, styling, and simple token authentication conventions where practical.

**Non-Goals:**
- Replace the existing MEL socios matrix.
- Implement full user management, password recovery, roles beyond project editor/admin, or external identity providers.
- Build a complete Excel round-trip export unless later requested.
- Resolve incomplete UNEP indicator wording in the source file.

## Decisions

1. Create a separate `MelProyectoIndicador` model and `/api/mel-proyecto` route group.

   Rationale: project indicators have different granularity from partner indicators. Keeping a separate table avoids overloading `mel_socios_indicadores` and makes seeding, authorization, and UI behavior simpler.

   Alternative considered: reuse `MelSocioIndicador` with a pseudo organization named `Proyecto`. This would reduce model count, but it would blur partner and project reporting semantics.

2. Store progress as a normalized decimal between 0 and 1, with display as 0-100%.

   Rationale: this matches the existing frontend progress helpers and makes percentage targets like 0.58 and 0.75 easy to compare. Count indicators can still calculate progress from current value divided by target.

   Alternative considered: store only raw current values. This is useful for count indicators, but the user explicitly wants a percentage bar and slider.

3. Support both automatic and manual progress.

   Rationale: some indicators have numeric targets and can be calculated; others are qualitative or use percentage metas. Editors need a slider to set visible status directly. The saved record should retain current value and progress percentage so the UI stays predictable.

4. Reuse the simple HMAC bearer-token login pattern from MEL socios for this page, but restrict login to admins only.

   Rationale: it fits the current app and is enough for protected editing in this prototype/system. This page is project-level, so partner or organization accounts must not be accepted. Admin credentials should be configurable through environment variables, with a local default only for development.

5. Implement the frontend as `frontend/modules/mel-proyecto.js`.

   Rationale: this mirrors the module system in `frontend/js/app.js`, keeps the page independently maintainable, and lets navigation add a route alias such as `#mel-proyecto`.

## Risks / Trade-offs

- Source file changes after seeding -> provide an idempotent seed/import path keyed by a stable source id and document that manual edits in the app become the active record.
- Simple local authentication is not enterprise-grade -> keep admin credentials environment-configurable, reject non-admin login attempts, and scope protected endpoints to editing only.
- Slider-only editing can lose numeric nuance -> pair the slider with a numeric percentage input or display value, and keep current/raw value fields for count indicators.
- Long indicator text can make dense tables hard to scan -> use compact cards or a table with expandable notes and responsive wrapping.
- Placeholder UNEP rows may look unfinished -> surface them with an "incomplete source" status instead of silently dropping them.

## Migration Plan

1. Add backend model and create tables on startup through the existing database initialization path.
2. Add idempotent seeding from `MEL PROPOSAL V6.xlsx`; preserve already edited records on repeat startup.
3. Add read endpoints, login endpoint, and authenticated update endpoint.
4. Add API client helpers, frontend module, navigation entry, and stylesheet additions.
5. Verify syntax and run available backend/frontend checks.
