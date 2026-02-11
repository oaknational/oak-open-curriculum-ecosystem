# Semantic Search UI & Evidence Plan (Deferred)

## Current Status (Deferred Until SDK Gates Are Green)

- Workstreams 1–3 complete; Workstream 4 in progress with remaining evidence tasks; Workstreams 6–7 pending; Workstream 8 (cross-cutting validation) ongoing.
- Evidence tasks include maintaining TDD, refreshing Playwright journeys, accessibility sweeps, documentation updates, and release-readiness checklists.
- This plan remains on hold until the SDK type-generation quality gates in `snagging-resolution-plan.md` report green across the board.

## Workstream Overview

1. **Search surfaces evidence** – refresh Playwright captures (responsive + reduced motion) and extend RTL assertions once SDK gates are green.
2. **Natural-search error banner** – add E2E coverage ensuring server-delivered copy appears.
3. **Admin & Status redesigns** – resume Workstreams 6 and 7 with schema-safe foundations.
4. **Search barrel refactor** – extract `src/search/index.ts`, repoint downstream consumers (e.g. `apps/oak-search-cli/src/types/oak.ts`, query parser helpers).
5. **Full quality gate** – run `pnpm check` after UI updates to verify repository health.

## Workstream Details

### Workstream 4 – Search Surfaces (Structured & Natural)

- Layout, highlight clamping, responsive evidence, and skeleton tone/motion polish complete (see `docs/ARCHITECTURE.md#search-secondary-accordion`, `evidence-log.md` entries dated 2025-10-22, `SearchSkeletons.integration.test.tsx`).
- Remaining actions:
  - Capture refreshed Playwright evidence (responsive + reduced-motion) once shared branch lands; extend RTL assertions against new skeleton states.
  - Instrument mobile support accordion toggles once shared analytics client lands; capture panel ID + open/closed state for funnel analysis.

### Workstream 5 – Natural Language Fixtures Reliability (Complete)

- Fixtures and integration tests lean entirely on SDK schemas with deterministic responses.
- Highlights:
  - `parseResponse` maps known error codes to user-friendly copy (unit + integration coverage).
  - Natural-language routes/tests consume SDK schemas; targeted Vitest runs are green.
  - Legacy CommonJS shims replaced with ESM-aware mocks.
- Remaining action: add UI-level coverage ensuring natural-search error banner renders server-delivered copy (Playwright update pending).

### Workstream 6 – Admin Page Redesign (Pending)

- Next steps:
  1. Apply `OperationsBlueprint` with sections (`Overview`, `Quick Actions`, `Jobs`, `Telemetry`).
  2. Convert job controls into descriptive cards with status chips and collapsible logs.
  3. Separate telemetry; integrate a fixture notice pill.
  4. Align responsive grid with search tokens; add sticky quick links as needed.
  5. Add integration tests for job card state transitions and Playwright coverage (light/dark, desktop/mobile).
  6. Capture visual evidence and log in `evidence-log.md`.

### Workstream 7 – Status Page Redesign (Pending)

- Next steps:
  1. Introduce `StatusSummaryCard` with severity icon, timestamp, and tone legend.
  2. Standardise service card height and accent colours.
  3. Refresh fatal alert styling with actionable guidance and optional dismissal when appropriate.
  4. Expand diagnostics (health endpoints, docs, last deploy metadata) via shared `OpsCard` primitives.
  5. Update tests for `status-helpers`, add RTL checks for summary announcements, refresh Playwright snapshots.
  6. Capture multi-mode Playwright evidence and record findings in `evidence-log.md`.

### Workstream 8 – Cross-cutting Validation & Evidence (Ongoing)

- Maintain TDD workflow—run `pnpm test --filter "ui"` per change and log outcomes.
- Re-baseline Playwright journeys (landing, structured, natural, admin, status) across light/dark, desktop/mobile, reduced-motion.
- Execute accessibility sweeps (axe + manual keyboard) and capture remediation notes in `evidence-log.md`.
- Refresh documentation (`semantic-search-responsive-layout-architecture.md`, `semantic-search-phase-1-ux-plan.md`, relevant READMEs) after each workstream.
- Keep release-readiness checklist up to date (UX acceptance criteria, artefacts, screenshots).

## Evidence & Tracking

- Log each UI milestone in `evidence-log.md` with links to test runs and screenshots once this plan resumes.
- Update repository TODOs (`t17`, `t18`, etc.) as steps complete.
- Do not re-enter these tasks until the SDK quality gates (type-gen, type-check, lint, test, build) are solidly green.
