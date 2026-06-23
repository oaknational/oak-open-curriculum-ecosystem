---
name: "CI Consolidation, Gate Parity, and eslint-disable Remediation"
overview: "CI consolidation and widget cleanup are complete. Remaining: documentation propagation and known issues."
todos:
  - id: phase-0-foundation
    content: "Phase 0: Verify foundation assumptions — catalogue eslint-disable instances, confirm widget deletion scope, verify Turbo graph."
    status: done
  - id: phase-1-eslint-enforcement
    content: "Phase 1: Add ESLint rule to detect and ban all eslint-disable comments."
    status: done
  - id: phase-2-widget-deletion
    content: "Phase 2: Delete dead widget Playwright tests and supporting infrastructure."
    status: done
  - id: phase-3-eslint-remediation
    content: "Phase 3: eslint-disable remediation — EXTRACTED to eslint-disable-remediation.plan.md. Partial work completed here (generic JSON writer, 3 dataset migrations)."
    status: done
  - id: phase-4-reporter-script
    content: "Phase 4: Create CI reporter script (TDD) — parses Turbo --summarize JSON, emits GitHub Step Summary and annotations."
    status: done
  - id: phase-5-ci-consolidation
    content: "Phase 5: Consolidate CI workflow — single Turbo invocation, add missing gates, wire reporter."
    status: done
  - id: phase-6-documentation
    content: "Phase 6: Propagate the settled enforcement and CI decisions into permanent documentation."
    status: done
---

# CI Consolidation, Gate Parity, and eslint-disable Remediation

**Last Updated**: 2026-03-29
**Status**: COMPLETE — all phases done. The one remaining known issue
(renderer test coverage) is blocked on the replacement widget shipping.
The eslint-disable remediation work was extracted to
`eslint-disable-remediation.plan.md`. This plan can be archived once the
branch merges to `main`.

## Document Role

- This plan covers the CI infrastructure and enforcement foundation.
- eslint-disable comment remediation has been extracted to
  `eslint-disable-remediation.plan.md` (same directory).
- Phase 6 (documentation) remains here because it documents the CI
  decisions made in Phases 0-5.

## Completed Work

| Phase | Summary |
|-------|---------|
| 0 | Foundation: catalogued eslint-disable instances, confirmed widget scope, verified Turbo graph |
| 1 | Created `@oaknational/no-eslint-disable` ESLint rule with user-approval marker support |
| 2 | Deleted dead widget Playwright tests and renderer test infrastructure |
| 3 | **Partial** — extracted generic `writeJsonDataset`, migrated vocabulary/misconception/nc-coverage graphs to JSON loader (9 directives removed). **Remaining remediation extracted** to `eslint-disable-remediation.plan.md` |
| 4 | Created CI Turbo summary reporter script (TDD) |
| 5 | Consolidated CI workflow: single Turbo invocation, added missing gates, wired reporter |

## Remaining Phase

### Phase 6: Documentation and validation

**Goal**: align permanent docs with the settled enforcement and CI
decisions, and keep the prompt concise.

#### Tasks

1. Update ADR-065 where CI consolidation changes documented gate
   surfaces or rationale.
2. Update ADR-086: fix pipeline location (currently says
   `oak-curriculum-sdk`, actual is `oak-sdk-codegen`), document JSON
   loader as the canonical large-graph pattern (supersedes monolithic
   typed-export approach).
3. Update `docs/engineering/build-system.md` where the authoritative
   gate surface changed.
4. Update `.agent/directives/testing-strategy.md` only where the
   implemented behaviour changed stable testing guidance.
5. Update `.agent/directives/principles.md` only where the enforcement
   mechanism itself needs explicit documentation.
6. Keep the session prompt short and make it point back to this plan
   for detail.
7. Invoke `docs-adr-reviewer` after ADR updates.

#### Acceptance criteria

1. Permanent docs reflect the actual implemented system
2. The session prompt is concise and operational only
3. No duplicate or contradictory facts remain between prompt and plan
4. `pnpm check` still passes after documentation-affecting edits that
   trigger gates

## Known Issues

### Resolved (2026-03-29)

- ~~check-blocked-patterns IO tests misclassified~~ — split to
  `check-blocked-patterns.integration.test.ts`
- ~~Root vitest.config.ts glob too broad~~ — tightened to
  `*.unit.test.ts` + `*.integration.test.ts`
- ~~TSDoc on plugin registration~~ — already present (lines 11-18)
- ~~Child process in integration test~~ — moved to
  `e2e-tests/generators/write-json-graph-file.e2e.test.ts`
- ~~eslint.config.ts auth override~~ — irreducible (confirmed by
  type-reviewer); improved documentation

### Remaining

- Renderer files lost test coverage when widget tests were deleted —
  new tests when the replacement widget ships.

## Non-Goals

- Reopening the completed CI consolidation unless fresh CI evidence
  disproves it
- Reintroducing widget test infrastructure for the deleted ChatGPT
  widget path
- eslint-disable remediation (now in its own plan)

## References

- `.github/workflows/ci.yml`
- `scripts/ci-turbo-report.mjs`
- `packages/core/oak-eslint/src/rules/no-eslint-disable.ts`
- `docs/architecture/architectural-decisions/065-turbo-task-dependencies.md`
- `.agent/plans/architecture-and-infrastructure/active/eslint-disable-remediation.plan.md`
