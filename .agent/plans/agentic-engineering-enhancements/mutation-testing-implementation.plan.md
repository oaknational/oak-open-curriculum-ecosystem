---
name: Stryker Mutation Testing Integration
overview: >
  Deliver mutation-testing capability across all pnpm workspaces via Stryker,
  adding pnpm mutate as a quality gate to validate that tests actually protect
  behaviour.
todos:
  - id: re-baseline
    content: "Re-audit workspace layout, vitest configs, and dependency posture against current state."
    status: pending
  - id: phase-0-foundation
    content: "Land root-level Stryker dependencies, base config template, Turbo task, and pnpm mutate command."
    status: pending
  - id: phase-1-pilot
    content: "Run mutation testing on 2 pilot workspaces (1 library, 1 app) and capture results."
    status: pending
  - id: phase-2-rollout
    content: "Roll out Stryker config to all workspaces with test scripts."
    status: pending
  - id: phase-3-automation
    content: "Integrate incremental mutation runs into CI, add new-workspace detection."
    status: pending
---

# Stryker Mutation Testing Integration Plan

## Core References

- [Testing Strategy](../../directives/testing-strategy.md)
- [Augmented Engineering Practices (industry evidence)](augmented-engineering-practices.research.md) — mutation testing rationale (Parts 8.1, 8.2, Part G)
- [StrykerJS documentation](https://stryker-mutator.io/docs/stryker-js/introduction/) — full docs available via `@StrykerJS` in Cursor

## Intent

Deliver a dependable mutation-testing capability across all pnpm workspaces so that quality gates gain mutation coverage (via `pnpm mutate`) without disrupting existing Vitest unit and integration suites. Mutation testing validates that tests actually protect behaviour — if you introduce a bug and tests still pass, tests are not protecting you.

## Milestone Position

This plan is a **pre-beta gate** — mutation testing must be operational before the repository exits public alpha and enters public beta. See the [high-level plan](../high-level-plan.md) Milestone 3.

## Current State

> **Prerequisite gate**: Phase 0 MUST NOT begin until the re-baseline audit (todo `re-baseline`) is completed and this section is updated.

### Re-baseline checklist

The workspace layout has changed significantly since the last audit (2025-09-24). The re-baseline must verify:

- [ ] Enumerate all workspaces with `test` scripts (current layout)
- [ ] Confirm each workspace has an explicit vitest config suitable for Stryker sandboxing
- [ ] Verify `pnpm mutate` does not yet exist at root level
- [ ] Verify `turbo.json` has no `mutate` task
- [ ] Verify no `@stryker-mutator/*` packages in root `devDependencies`
- [ ] Remove references to deleted workspaces (e.g. `@oaknational/mcp-providers-node`)

See [Appendix: Historical Pilot](#appendix-historical-pilot) for findings from the 2025-09-24 pilot run.

## Prerequisites (to validate during re-baseline)

### 1. Vitest Configuration Normalisation

- Standardise unit/integration globs so Stryker targets only in-process tests
- Ensure all workspaces with test scripts have explicit vitest configs (not relying on implicit defaults)
- Evaluate a shared testing configuration workspace (`packages/config/testing/`) for reusable vitest + Stryker helpers

### 2. Dev Dependency Strategy

- Add `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `@stryker-mutator/typescript-checker` to root `devDependencies`
- Align Stryker versions with the monorepo Vitest major version
- Document hoisting expectations

### 3. Turbo Task Extensions

- Draft a `mutate` task in `turbo.json` modelled on `test`
- Define `pnpm mutate` at root to call `turbo run --continue mutate`
- During Phases 0–2, `mutate` runs as a **supplementary signal** (nightly CI or release pipelines only — not part of `pnpm qg`). During Phase 3, evaluate promotion to `pnpm qg` once performance overhead is acceptable and mutant survival is below threshold.

## Strategic Roadmap

### Phase 0 — Foundation and Governance

- Publish re-baseline audit and remediation backlog
- Land root-level Stryker dependencies and base config template with agreed thresholds
- Introduce `pnpm mutate` (Turbo-backed) and document workspace `mutate` scripts
- Update `CONTRIBUTING.md` and quality-gate guidance

### Phase 1 — Pilot Workspaces

- Mutation testing operational in one library (`packages/libs/logger/`) and one app (`apps/oak-curriculum-mcp-stdio/`), validating Node pathways
- Capture performance metrics, mutant survival hotspots, and remediation guidance

### Phase 2 — Monorepo Roll-out

- All workspaces with test scripts expose mutation coverage
- Roll out workspace-level `mutate` scripts
- Establish reporting to surface mutation results in CI
- Build shared testing configuration workspace if justified by pilot findings

### Phase 3 — Optimisation and Automation

- Incremental mutant runs (touched-files mode) to reduce feedback loop time
- Automated detection of missing `stryker.config.ts` in new workspaces
- Contributor guidance and remediation patterns

## Success Metrics

- **Coverage adoption**: 100% of workspaces with `test` scripts have active `mutate` tasks wired into Turbo
- **Supplementary signal (Phases 0–2)**: Mutation testing runs as part of nightly CI or release pipelines; not a blocking quality gate during initial roll-out. Phase 3 evaluates promotion to `pnpm qg`.
- **Surviving mutants**: Critical workspaces maintain ≤ 5% surviving mutants after remediation
- **Developer experience**: Mutation runs complete within 2x the baseline unit-test runtime for pilot workspaces

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Performance overhead from long mutation runs | Phased roll-out, incremental modes, nightly full runs |
| Existing test flakiness amplified by mutation | Enforce deterministic test design before enabling Stryker |
| Config drift across workspaces | Shared base config, periodic audits, lint checks |
| CI runner resource limits | Profile during pilots, adjust infrastructure as needed |

## Appendix: Historical Pilot

> The following records a pilot run from 2025-09-24 on a workspace that has since been removed. Preserved for context.

A pilot run on the former `@oaknational/mcp-providers-node` workspace produced a mutation score of **53.57%** (15 killed, 13 survived). Surviving mutants clustered around console logging branches, highlighting missing behavioural assertions.

**Key findings**:

- Stryker's sandbox requires self-contained vitest configs — fragile relative paths to shared base configs break in the sandbox
- Vitest configuration duplication is needed for Stryker sandboxing — consider a shared testing configuration workspace to solve this cleanly
