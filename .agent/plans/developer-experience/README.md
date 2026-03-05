# Developer Experience Plans

This collection tracks developer-experience planning work under ADR-117 lifecycle folders.

## Lifecycle Structure

- `active/` — executable plans in progress now
- `current/` — executable plans queued next
- `future/` — strategic backlog for later promotion
- `archive/` — completed and superseded history
- `governance/` — governance-specific review artefacts

## Manual Re-triage Record (2026-03-03)

On 2026-03-03 the collection was manually migrated into lifecycle lanes, and the overlapping strictness plans were superseded by a single canonical plan.

### Re-triage rationale

- `onboarding-simulations-public-alpha-readiness.md` -> `active/`
  Current status is active and already executing against public-alpha readiness outcomes.
- `generated-document-pipeline-extraction-plan.md` -> `future/`
  Scope is strategic draft-level and not execution-ready yet.
- `sdk-publishing-and-versioning-plan.md` -> `future/`
  Planned medium-priority hardening work, not currently in flight.
- `tsdoc-generated-docs-overhaul.plan.md` -> `future/`
  Not started and explicitly audit-first, so deferred.
- `e2e-vi-mock-clerk-removal.plan.md` + `eslint-override-removal.plan.md` -> `archive/superseded/`
  Superseded by `active/devx-strictness-convergence.plan.md` to eliminate scope overlap and status drift.

## Canonical Strictness Plan

- Current canonical plan: `active/devx-strictness-convergence.plan.md`
- Session handoff/start lives inside: `active/devx-strictness-convergence.plan.md` -> `Next Session Entry Point (Standalone)`
- Superseded source plans:
  - `archive/superseded/e2e-vi-mock-clerk-removal.plan.md`
  - `archive/superseded/eslint-override-removal.plan.md`
- Cross-collection folded/delegated sources (2026-03-04):
  - `../architecture-and-infrastructure/no-console-enforcement.plan.md` (superseded and folded here)
  - `../agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md` (boundary/separation + split-guidance subset delegated here; `max-files-per-dir` deferred)

## Indexes

- [active/README.md](./active/README.md)
- [current/README.md](./current/README.md)
- [future/README.md](./future/README.md)
- [roadmap.md](./roadmap.md)
- [documentation-sync-log.md](./documentation-sync-log.md)
