---
name: "Quality Gate Hardening"
overview: "Unified plan for all pending quality gate enhancements: promote static analysis tools, harden ESLint enforcement, enable mutation testing across all workspaces, and remediate all findings."
todos:
  - id: forbidden-comment-test-exemption
    content: "Allow forbidden-comment patterns in files specifically testing their detection (hook + ESLint test infrastructure)."
    status: pending
  - id: oak-eslint-self-linting
    content: "Subject the oak-eslint workspace to the oak-eslint recommended/strict config, unless circular dependency prevents it."
    status: pending
  - id: promote-no-eslint-disable
    content: "Promote @oaknational/no-eslint-disable from warn to error after Phase 3 remediation in the active CI plan completes."
    status: pending
  - id: enable-knip
    content: "Triage knip findings (94 unused files, 626 unused exports, 14 dependency issues) and promote to blocking QG."
    status: pending
  - id: enable-depcruise
    content: "Resolve dependency-cruiser findings (circular deps, orphans) and promote to blocking QG."
    status: pending
  - id: enable-max-files-per-dir
    content: "Enable the max-files-per-dir ESLint rule across all workspaces and remediate violations."
    status: pending
  - id: promote-type-assertions-in-tests
    content: "Remove the testRules exception that makes consistent-type-assertions a warning rather than an error. Remediate all ~218 assertion warnings across 6 workspaces."
    status: pending
  - id: enable-stryker-all-workspaces
    content: "Enable Stryker mutation testing in all workspaces with initial loose thresholds. Create incremental remediation plan."
    status: pending
---

# Quality Gate Hardening

**Last Updated**: 2026-03-29
**Status**: Strategic brief — not yet executable
**Scope**: All pending quality gate promotions and enforcement hardenings, consolidated into a single plan with remediation work for each.

## Problem and Intent

The repository has several quality tools installed but not yet promoted to blocking gates, and several enforcement gaps where checks are weaker than the principles demand. Each tool surfaces genuine pre-existing issues that must be remediated before promotion.

This plan unifies all pending quality gate work into a single strategic brief to prevent fragmentation across multiple small plans.

## Domain Boundaries

### In Scope

1. **Forbidden-comment test infrastructure** — allow the content-blocking hook and ESLint rule test files to contain the patterns they test
2. **oak-eslint self-linting** — the ESLint plugin workspace should be subject to its own rules
3. **`@oaknational/no-eslint-disable` promotion** — warn to error after remediation
4. **knip** — triage findings, promote to blocking QG
5. **dependency-cruiser** — resolve findings, promote to blocking QG
6. **max-files-per-dir** — enable and remediate
7. **`consistent-type-assertions` in tests** — remove the warn exception, promote to error
8. **Stryker mutation testing** — enable in all workspaces with loose initial thresholds, then incrementally tighten

### Not in Scope

- Remediation of the ~101 eslint-disable comments (tracked in the active CI consolidation plan)
- CI workflow changes (tracked in the active CI consolidation plan)
- New Playwright tests for the replacement widget (tracked separately)

## Dependencies and Sequencing

| Enhancement | Depends on | Notes |
|------------|-----------|-------|
| Forbidden-comment test exemption | None | Can proceed immediately |
| oak-eslint self-linting | Forbidden-comment exemption (if self-linting catches test file patterns) | Investigate circular dependency risk first |
| `no-eslint-disable` promotion | Active CI plan Phase 3 (eslint-disable remediation) | Cannot promote until all comments are remediated |
| knip | None | Independent — triage work only |
| dependency-cruiser | None | Independent — triage work only |
| max-files-per-dir | None | Independent — remediation may overlap with knip dead-code removal |
| `consistent-type-assertions` in tests | None | Large remediation (~218 warnings across 6 workspaces) |
| Stryker | None | Existing plan at `.agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md` — absorb into this plan |

## Enhancement Details

### 1. Forbidden-Comment Test Infrastructure

**Problem**: The `check-blocked-content.mjs` hook blocks agents from writing the user-approval marker in files. But the ESLint rule's test file (`no-eslint-disable.unit.test.ts`) must contain test strings with that marker to verify the rule allows it.

**Fix**: Modify the hook to exempt files matching a specific pattern (e.g. `**/no-eslint-disable*.test.*`) from the content check. The hook already has the file path available in the tool payload.

**Remediation**: None — this is infrastructure-only.

### 2. oak-eslint Self-Linting

**Problem**: The oak-eslint workspace uses a minimal ESLint config (`tseslint.configs.strict` directly) rather than its own `configs.recommended`. This means the workspace that defines the rules doesn't follow them.

**Fix**: Update `packages/core/oak-eslint/eslint.config.ts` to use `configs.recommended` (or `configs.strict`). Investigate whether importing the config from the package's own source creates a circular dependency at build time. If it does, use the built `dist/` output.

**Remediation**: Fix any rule violations within the oak-eslint package that are revealed.

### 3. Promote `no-eslint-disable` from warn to error

**Problem**: Currently at `warn` to allow the active CI plan's Phase 3 remediation to proceed without blocking lint.

**Fix**: Change `'@oaknational/no-eslint-disable': 'warn'` to `'error'` in `recommended.ts` after all unapproved eslint-disable comments have been removed.

**Remediation**: None — all remediation happens in the active CI plan.

### 4. Enable knip as Blocking QG

**Problem**: knip surfaces 94 unused files, 626 unused exports, and 14 dependency issues. These are genuine findings that need triage.

**Fix**: Triage all findings. Delete genuine dead code. Adjust `knip.config.ts` for false positives. Add `pnpm knip` to `qg` and `check` scripts.

**Remediation**: Significant — see `.agent/plans/architecture-and-infrastructure/static-analysis-tool-promotion.plan.md` for initial triage plan.

### 5. Enable dependency-cruiser as Blocking QG

**Problem**: dependency-cruiser finds circular dependencies and orphan modules. These need resolution before promotion.

**Fix**: Resolve circular deps (refactor or mark as intentional). Exclude genuinely external orphans. Add `pnpm depcruise` to `qg` and `check` scripts.

**Remediation**: See static-analysis-tool-promotion.plan.md.

### 6. Enable max-files-per-dir

**Problem**: The `@oaknational/max-files-per-dir` ESLint rule exists but is not activated in any config.

**Fix**: Add the rule to `configs.recommended` or `configs.strict`. Remediate any directories that exceed the threshold by splitting into subdirectories.

**Remediation**: Audit all directories, split where needed.

### 7. Promote `consistent-type-assertions` in Tests to Error

**Problem**: `testRules` in `packages/core/oak-eslint/src/index.ts` sets `@typescript-eslint/consistent-type-assertions` to `warn` with `assertionStyle: 'never'`. This was an intermediate step (promoted from `off` to `warn`). The final state should be `error`.

**Fix**: Change to `error`. Fix all ~218 assertion warnings across 6 workspaces by narrowing fake interfaces, using DI, or constructing objects with the right shape directly.

**Remediation**: Large — each workspace's test fakes need individual attention. Parallel agents can handle independent workspaces.

### 8. Enable Stryker Mutation Testing

**Problem**: Stryker is configured but not enabled as a gate. Existing plan at `.agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md`.

**Fix**: Enable `pnpm mutate` in all workspaces. Configure initial thresholds loose enough for current code to pass. Then create an incremental plan to tighten thresholds and improve test suite effectiveness.

**Remediation**: Per-workspace configuration and threshold tuning. New tests where mutation testing reveals uncovered behaviour.

## Success Signals (Justifying Promotion to Current)

- Active CI plan Phase 3 complete (eslint-disable remediation done)
- Capacity for a focused sprint on quality gate work
- No higher-priority feature or bug work blocking

## Risks and Unknowns

- knip triage scope is large (626 unused exports) — may need phased approach
- oak-eslint self-linting may hit circular dependency — needs investigation
- Stryker thresholds need calibration per workspace — initial run needed
- `consistent-type-assertions` remediation in tests is labour-intensive (~218 warnings)

## Promotion Trigger

Promote to `current/` when:
1. The active CI plan (Phases 3-6) is complete
2. The branch is merged to `main`
3. Team has capacity for a quality-gate sprint

## Absorbed Plans

This plan supersedes and absorbs:
- `.agent/plans/architecture-and-infrastructure/static-analysis-tool-promotion.plan.md` (knip + depcruise)
- `.agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md` (Stryker)

When this plan is promoted to `current/`, archive those plans with a note pointing here.
