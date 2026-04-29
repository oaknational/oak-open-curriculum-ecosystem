---
name: "Scripts Validator Family — Workspace Migration"
overview: "Migrate the scripts/validate-* family of repo-invariant validators (helpers + runtimes + tests) into a declared workspace, eliminating ADR-041 / §Separate-Framework-from-Consumer drift, and graduate the owner-direction rule that prevents future drift."
todos:
  - id: phase-0-foundation
    content: "Phase 0: Resolve Build-vs-Buy (agent-tools/ vs new workspace) via assumptions-reviewer; graduate the owner-direction rule to a canonical .agent/rules/*.md file; author the ADR delta or peer ADR."
    status: pending
  - id: phase-1-pilot
    content: "Phase 1: Migrate validate-no-stale-script-invocations (the cleanest test case, no cross-workspace imports) as the first concrete consumer of the chosen home; verify tests + CI green."
    status: pending
  - id: phase-2-zero-coupling
    content: "Phase 2: Migrate the four other validators with no cross-workspace imports (validate-fitness-vocabulary, validate-subagents, validate-practice-fitness, validate-portability) in one focused commit batch."
    status: pending
  - id: phase-3-coupling-fix
    content: "Phase 3: Migrate validate-eslint-boundaries and convert its relative cross-workspace import (`../packages/core/oak-eslint/src/...`) into a proper devDependency import via @oaknational/eslint-plugin-standards."
    status: pending
  - id: phase-4-consolidation
    content: "Phase 4: Consolidate the duplicated filesystem walker across migrated validators into a single shared utility within the workspace."
    status: pending
  - id: phase-5-rewire
    content: "Phase 5: Re-wire test execution (retire or sharply scope `pnpm test:root-scripts`); update CI workflow YAML; sweep documentation (ADR-168 reference, build-system.md, governance-claim-needs-a-scanner.md, etc.)."
    status: pending
  - id: phase-6-validation
    content: "Phase 6: Full quality-gate sweep + docs-adr-reviewer + release-readiness-reviewer; archive plan; close claim."
    status: pending
---

# Scripts Validator Family — Workspace Migration

**Last Updated**: 2026-04-29
**Status**: 🔴 NOT STARTED
**Scope**: Move the six in-tree repo-invariant validator/helper/test triples currently in `scripts/` into a declared workspace, fixing the boundary-rule blind spot and eliminating ~370 lines of duplicated filesystem-walker code.

**Source strategic brief**: [`future/scripts-validator-family-workspace-migration.plan.md`](../future/scripts-validator-family-workspace-migration.plan.md)
(retained as the architectural anchor; this `current/` plan supersedes it for execution).

---

## Context

PR #90 added a sixth validator (`scripts/validate-no-stale-script-invocations`) following the existing `scripts/validate-*` peer pattern. The owner challenged the placement and four parallel architecture reviewers (architecture-reviewer-{barney, betty, fred, wilma}) confirmed the existing pattern is **structural drift**, not canon. The whole family wants a workspace home.

### Issue 1: validators with helpers and tests in `scripts/` evade workspace tooling

`scripts/` is **not a workspace**. It has no `package.json`, is not listed in `pnpm-workspace.yaml`, is invisible to:

- `pnpm depcruise` (run only against `apps/`, `packages/`, `agent-tools/`)
- the workspace ESLint boundary rules (`packages/core/oak-eslint/src/rules/boundary.ts` — `scripts/**` is not in the tier list and gets only a `no-console` carve-out at the root config)
- per-workspace `pnpm type-check` (root tsconfig.json includes only `*.config.ts`, not `scripts/**`)
- the turbo task graph

Yet `scripts/` currently hosts ~2,335 lines of TypeScript across:

| File | Lines | Tests |
|---|---|---|
| `scripts/validate-portability.ts` + helpers | 553 | 348-line unit + integration |
| `scripts/validate-practice-fitness.ts` | 685 | 287-line unit |
| `scripts/validate-fitness-vocabulary.ts` | 216 | 126-line unit |
| `scripts/validate-subagents.ts` + helpers | 230 | 150-line unit |
| `scripts/validate-eslint-boundaries.ts` | ~80 | (no tests; cross-workspace src/ import) |
| `scripts/validate-no-stale-script-invocations.ts` + helpers | ~250 | 119-line unit (added in PR-90 commit `62ea5032`) |

**Evidence**: ADR-041 §Tier table omits `scripts/`. `pnpm-workspace.yaml` contains no `scripts/` entry. `eslint.config.ts:29-32` confirms the only `scripts/`-specific carve-out is `no-console: off`. `vitest.config.ts:7` reaches into `scripts/**/*.test.ts` from the root config rather than via a workspace test task.

**Root cause**: The pattern arose by repetition, not by decision. Each validator added a peer to the previous one's shape; cardinality has crossed the consolidate-at-third-consumer threshold. ADR-168 §Workspace-script-ban (Rule 2) addressed the inverse direction (workspaces calling root scripts) but did not name root-resident validators as a class.

**Existing capabilities that solve the underlying problem**:

- `agent-tools/` is a declared workspace with `package.json`, build, tests, and a precedent of repo-walking CLIs (`claude-agent-ops`, `collaboration-state`, `agent-identity`).
- `packages/core/` and `packages/libs/` are tier-declared homes with full boundary-rule + type-check coverage.

### Issue 2: cross-workspace src/ import bypassing the package public API

`scripts/validate-eslint-boundaries.ts:8` imports from `../packages/core/oak-eslint/src/rules/boundary.js`. That is a relative path into a workspace's internal `src/`, bypassing the `@oaknational/eslint-plugin-standards` package surface.

**Root cause**: `scripts/` has no `package.json`, so it cannot list `@oaknational/eslint-plugin-standards` as a `devDependency`. The relative-path workaround works under `tsx`'s `development` resolution condition but is the textbook ADR-168 violation reframed.

### Issue 3: filesystem-walker duplication across three validators

`validate-portability.ts`, `validate-subagents.ts`, and `validate-no-stale-script-invocations.ts` each implement their own recursive directory walker with bespoke exclusion predicates. The duplication is the structural consequence of "no shared abstraction layer" — i.e. no workspace home in which a shared utility could live.

### Issue 4: owner-direction rule not graduated to canonical surface

The owner directed on 2026-04-27: "Anything complex or high enough risk to need tests MUST be moved into a proper workspace, that absolutely applies to everything touched by the test:root-scripts script." The substance lives in:

- `feedback_no_workspace_to_root_scripts` user-memory entry
- `.agent/memory/active/archive/napkin-2026-04-29.md` (rotated; original Prismatic Waxing Constellation 2026-04-27 napkin entry)

There is **no** `.agent/rules/*.md` canonical rule file. Future PRs will re-litigate the question without it.

---

## Quality Gate Strategy

**Critical**: Run quality gates one at a time after each phase. The migration touches workspace tooling configuration in addition to source code — a single batched run risks masking which gate caught what.

### After Each Task

```bash
pnpm type-check
pnpm lint
pnpm test:root-scripts   # until Phase 5 retires it
pnpm test                # workspace tests must continue to pass
```

### After Each Phase

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:root-scripts
pnpm knip                # depcruise gains visibility on migrated files mid-flight
pnpm depcruise
pnpm markdownlint:root
pnpm format:root
pnpm practice:fitness:informational
```

CI verification per push: `gh pr checks <pr#>` and `sonar list issues` filtered to OPEN/CONFIRMED.

---

## Solution Architecture

### Principle (from `principles.md` and reviewer synthesis)

> "Distinct architectural layers MUST live in distinct workspaces. Modules/directories may organise code inside a layer, but they do not satisfy layer separation." — `principles.md` §Separate Framework from Consumer
>
> "Apps are thin user interfaces. SDKs and libraries own all domain-specific logic and mechanisms." — `principles.md` §Layer Role Topology (applied to validators: a `pnpm` script entrypoint may be the thin invocation seam, but the **mechanism** belongs in a workspace where it is type-checked, linted, knip'd, depcruise'd, and unit-tested as first-class code)

### Key Insight

The framework/consumer split has already been done **intellectually** in each validator (helper module = framework; runtime walker = Oak-specific consumer). It just hasn't been done at the **workspace boundary**. The migration realises the split that already exists in code shape.

This exemplifies the first question from `principles.md`: **"Could it be simpler?"** — Answer: **YES**. Today: 6 helper modules + 6 walkers + 6 unit-test pairs in `scripts/`, with three duplicated filesystem walkers. Post-migration: same code in a declared workspace, one shared filesystem-walker utility, full boundary/type/depcruise coverage.

### Strategy

- Phase 0 resolves the open Build-vs-Buy question via `assumptions-reviewer` and graduates the owner-direction rule before any code moves. **Default destination**: `agent-tools/` (Barney + Fred + Wilma majority); pivot to a new workspace iff Betty's cohesion argument survives review.
- Phases 1–3 migrate validators in increasing order of coupling: zero-coupling first (Phase 1 pilot, then Phase 2 batch), then the cross-workspace-coupled `validate-eslint-boundaries` (Phase 3) where the relative-import bypass is fixed in the same commit.
- Phase 4 consolidates the duplicated filesystem walker into one shared utility within the workspace.
- Phase 5 retires `pnpm test:root-scripts` (or scopes it to genuinely thin shell residue) and rewires CI + docs.
- Phase 6 invokes `docs-adr-reviewer` and `release-readiness-reviewer` for closure.

**Non-Goals** (YAGNI):

- ❌ Migrating Group B (`scripts/check-blocked-{content,patterns}.ts` — Claude-hook stdin/stdout protocol). Different execution model; separate plan.
- ❌ Migrating Group C (`scripts/ci-turbo-report.ts`, `scripts/ci-schema-drift-check.ts`, etc. — CI-only tooling). Separate plan.
- ❌ Inventing new validators in flight. The migration preserves behaviour; new gates land later.
- ❌ Extending the `eslint-plugin-standards` boundary rules to add a new tier in this plan. If the chosen home is `agent-tools/`, the existing `TOOLING_PACKAGE_IMPORTS` rule already covers it.
- ✅ What we ARE doing: moving 6 existing validators into a declared workspace with full tooling coverage; eliminating the cross-workspace src/ import; consolidating the duplicated filesystem walker; graduating the doctrine.

---

## Build-vs-Buy Attestation

The destination workspace question is the load-bearing Build-vs-Buy decision in this plan.

**First-party / "buy" option**: `agent-tools/` workspace.

- Pros: already exists; has tsconfig, eslint, vitest, build pipeline; `TOOLING_PACKAGE_IMPORTS` boundary rule already covers it; Barney/Fred/Wilma recommend.
- Cons: Betty argues its semantic remit ("operational CLIs for agents") differs from "repo-invariant governance validators". Adding governance scanners alongside `claude-agent-ops` may dilute its identity.

**Bespoke / "build" option**: new workspace (e.g. `packages/devx/repo-invariants` or `packages/core/repo-invariants`).

- Pros: clean semantic home; clear cohesion; future validators have an obvious destination.
- Cons: ~1–2 hours of new infrastructure (tsconfig, eslint, vitest, package.json, pnpm-workspace.yaml entry); a third tooling-tier alongside `agent-tools/` and `scripts/`.

**Resolution mechanism**: Phase 0 invokes `assumptions-reviewer` with both options framed and the reviewers' positions cited. The reviewer's brief is to challenge the default (`agent-tools/`) and either confirm it or surface a concrete cohesion blocker that justifies the new-workspace cost.

**Default if reviewer is silent**: `agent-tools/` (3-of-4 reviewer majority + simpler infrastructure path).

---

## Reviewer Scheduling (phase-aligned)

- **Phase 0**: `assumptions-reviewer` (resolve Build-vs-Buy); `architecture-reviewer-fred` (confirm rule-graduation wording aligns with ADR-168/041); `docs-adr-reviewer` (size ADR delta vs new ADR vs rule-only landing).
- **Phase 1 (pilot)**: `code-reviewer` gateway after the pilot commit; `test-reviewer` to confirm migrated tests match the workspace's vitest conventions; `architecture-reviewer-barney` to verify the boundary line.
- **Phase 2 (batch)**: `code-reviewer` after the batch commit. `test-reviewer` if any test-file logic shifts during migration.
- **Phase 3 (coupling fix)**: `code-reviewer` + `architecture-reviewer-fred` (the public-API-bypass fix is principle-load-bearing).
- **Phase 4 (consolidation)**: `code-reviewer` after the shared-walker commit.
- **Phase 5 (rewire)**: `architecture-reviewer-wilma` (adversarial: probe failure modes of the rewiring — CI race conditions, duplicate runs, silent gate skips).
- **Phase 6 (closure)**: `docs-adr-reviewer` + `release-readiness-reviewer`.

Reviewer scheduling is phase-aligned, not closure-batched.

---

## Foundation Document Commitment

Re-read at start of each phase:

1. `.agent/directives/principles.md` — §Separate Framework from Consumer, §Layer Role Topology, §Architectural Excellence Over Expediency, §Refactoring (especially "Refactoring TDD: Existing tests ARE the safety net").
2. `.agent/directives/testing-strategy.md` — §Refactoring TDD (RED phase is compiler errors, not runtime test failures, when behaviour does not change).
3. `.agent/directives/schema-first-execution.md` — N/A for this plan (no SDK code touched).
4. ADR-041 (workspace structure) and ADR-168 (TS6 baseline + workspace-script architectural rules).

---

## Lifecycle Trigger Commitment

Active claim required at execution start. Multi-session plan: refresh the thread record (or open a new thread for this work) per PDR-027. Apply [`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md) for the multi-file phases.

---

## Documentation Propagation Commitment

The following surfaces reference the current `scripts/` paths and need lockstep updates by Phase 5:

- `.agent/memory/active/patterns/governance-claim-needs-a-scanner.md` (path references, possibly content if the migration changes the canonical example)
- `docs/engineering/build-system.md` (test-runner discussion if `pnpm test:root-scripts` is retired or scoped)
- `docs/architecture/architectural-decisions/168-typescript-6-baseline-and-workspace-script-architectural-rules.md` (Future Work item 3 closure note + new ADR-amendment block, or new peer ADR)
- `package.json` `scripts.test:root-scripts` and `scripts.check`
- `.github/workflows/*.yml` invocations of `pnpm test:root-scripts`
- The chosen workspace's README — adding a new section if migrated to `agent-tools/`, or authoring the README if a new workspace is created
- `.agent/rules/no-workspace-evading-scripts.md` (or the chosen rule name) — new canonical file plus thin adapters in `.claude/rules/`, `.cursor/rules/`, `.agents/rules/` (mirrors the portability-validator's surface-matrix expectations)

If no update is needed for a required surface, record an explicit no-change rationale.

---

## Resolution Plan

### Phase 0: Foundation + Decision Gate (~2–4 hours)

**Foundation Check-In**: Re-read `principles.md §Separate Framework from Consumer`, ADR-041, ADR-168, and the strategic brief at [`future/scripts-validator-family-workspace-migration.plan.md`](../future/scripts-validator-family-workspace-migration.plan.md).

**Key Principle**: Resolve the destination workspace before moving any code; graduate the doctrine before extending the pattern.

#### Task 0.1: Resolve Build-vs-Buy via `assumptions-reviewer`

**Current Assumption**: Default destination is `agent-tools/` (3-of-4 reviewer majority).

**Validation Required**: Challenge the assumption with the reviewers' positions surfaced; confirm or pivot.

**Acceptance Criteria**:

1. ✅ `assumptions-reviewer` invoked with both options framed and cited.
2. ✅ Reviewer report either confirms `agent-tools/` or names a concrete cohesion blocker (Betty's argument operationalised).
3. ✅ Decision recorded in this plan body and in a comms-log entry.
4. ✅ If the decision is a new workspace, the workspace name and tier home (`packages/core/`, `packages/devx/`, etc.) is named in the same record.

**Deterministic Validation**:

```bash
# 1. Decision recorded
grep -n "Phase 0 decision:" .agent/plans/architecture-and-infrastructure/current/scripts-validator-family-workspace-migration.plan.md
# Expected: at least one match identifying the destination

# 2. If new workspace, pnpm-workspace.yaml prepared
grep "<chosen-workspace-path>" pnpm-workspace.yaml
# Expected: present (Phase 0 records the entry shape; Phase 1 lands it)
```

**Task Complete When**: Destination workspace identified and recorded.

#### Task 0.2: Graduate the owner-direction rule to a canonical `.agent/rules/*.md` file

**Current State**: Doctrine exists in user-memory entry `feedback_no_workspace_to_root_scripts` and in archived napkin; no canonical rule file.

**Acceptance Criteria**:

1. ✅ `.agent/rules/no-workspace-evading-scripts.md` (or owner-approved name) authored as canonical body.
2. ✅ Thin adapters created in `.claude/rules/`, `.cursor/rules/`, `.agents/rules/` (matching the portability-validator's surface-matrix expectations).
3. ✅ Rule body cites: ADR-168 §Workspace-script-ban as architectural anchor; the 2026-04-27 owner direction as provenance; the threshold ("any TS file in `scripts/` with a separated `*-helpers.ts` or any `*.{unit,integration}.test.ts` file MUST live in a declared workspace").
4. ✅ `pnpm portability:check` and `pnpm subagents:check` pass with the new rule file in place.
5. ✅ `pnpm format:root` and `pnpm markdownlint:root` pass.

**Deterministic Validation**:

```bash
ls .agent/rules/no-workspace-evading-scripts.md  # or chosen name
ls .claude/rules/no-workspace-evading-scripts.md
ls .cursor/rules/no-workspace-evading-scripts.md
ls .agents/rules/no-workspace-evading-scripts.md
# Expected: all four files exist

pnpm portability:check
pnpm subagents:check
# Expected: exit 0
```

#### Task 0.3: Author ADR delta or peer ADR

**Current State**: ADR-168 covers workspace→root direction only. The new doctrine covers root→workspace-evasion (the inverse).

**Acceptance Criteria**:

1. ✅ `docs-adr-reviewer` consulted to choose between ADR-168 amendment, peer ADR, or rule-only landing.
2. ✅ ADR amendment landed (or new ADR authored) per the reviewer's recommendation.
3. ✅ ADR cross-references the rule file from Task 0.2.

**Task Complete When**: Decision recorded and the ADR change is on disk and `pnpm markdownlint:root` passes.

**Phase 0 Complete Validation**:

```bash
pnpm portability:check
pnpm subagents:check
pnpm markdownlint:root
pnpm format:root
```

**Success Criteria**: All commands exit 0; destination workspace decided; rule and ADR landed.

---

### Phase 1: Pilot Migration — `validate-no-stale-script-invocations` (~1–2 hours)

**Foundation Check-In**: Re-read `testing-strategy.md §Refactoring TDD` ("Existing tests ARE the safety net — run them before and after the split, no new tests needed for internal restructuring").

**Key Principle**: This validator is the cleanest test case (zero cross-workspace imports, smallest surface). Use it to discover the bin/wiring pattern before tackling the larger migrations.

#### Task 1.1: Move runtime + helper + tests into the chosen workspace

**Acceptance Criteria**:

1. ✅ Files moved from `scripts/` to the workspace path agreed in Phase 0 (e.g. `agent-tools/src/repo-validators/no-stale-script-invocations/` for the helper and runtime, `agent-tools/tests/repo-validators/.../` for tests).
2. ✅ Imports updated to workspace-internal relative paths.
3. ✅ The pure helper retains its existing 9 unit tests; no new tests required (refactor RED phase = compiler-error-driven).
4. ✅ The runtime entry registers as a bin in the workspace's `package.json` if the chosen home is `agent-tools/`.

**Deterministic Validation**:

```bash
ls scripts/validate-no-stale-script-invocations*.ts 2>&1
# Expected: no matches (file deleted from scripts/)

ls <chosen-workspace>/<chosen-path>/find-stale-script-invocations.ts
# Expected: file exists at new location

pnpm --filter <workspace-package> test
# Expected: 9 unit tests pass
```

#### Task 1.2: Re-wire `pnpm test:root-scripts` to invoke the migrated validator from its new home

**Acceptance Criteria**:

1. ✅ `package.json` `test:root-scripts` invokes the workspace bin (e.g. `pnpm --filter @oaknational/agent-tools exec validate-no-stale-script-invocations`) instead of `pnpm exec tsx scripts/validate-no-stale-script-invocations.ts`.
2. ✅ The full `pnpm test:root-scripts` chain still passes.

**Deterministic Validation**:

```bash
pnpm test:root-scripts
# Expected: exit 0; validate-no-stale-script-invocations: OK reported
```

#### Phase 1 Complete Validation

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:root-scripts
pnpm knip
pnpm depcruise
pnpm markdownlint:root
pnpm format:root
```

**Success Criteria**: All commands exit 0. Pilot validator now lives in a workspace under full tooling coverage.

---

### Phase 2: Zero-Coupling Batch (~3–5 hours)

Migrate the four validators that have **no cross-workspace imports**: `validate-fitness-vocabulary`, `validate-subagents` (+ helpers + tests), `validate-practice-fitness`, `validate-portability` (+ helpers + tests).

**Foundation Check-In**: Re-read `testing-strategy.md §Refactoring TDD`.

#### Task 2.1: Migrate `validate-fitness-vocabulary` triple

#### Task 2.2: Migrate `validate-subagents` triple (with helpers)

#### Task 2.3: Migrate `validate-practice-fitness` (note: 685 lines + 287-line test — the largest)

#### Task 2.4: Migrate `validate-portability` triple (with helpers and integration test)

**Each task acceptance criteria** (mirrors Task 1.1 / 1.2):

1. ✅ Files moved to workspace; imports updated.
2. ✅ Existing tests pass unchanged.
3. ✅ Bin entries registered (if applicable).
4. ✅ `pnpm test:root-scripts` chain re-wired and still passes.
5. ✅ All quality gates exit 0.

**Phase 2 Complete When**: All four migrated; full quality-gate sweep green.

---

### Phase 3: Coupled Migration — `validate-eslint-boundaries` + Public-API Fix (~1–2 hours)

**Foundation Check-In**: Re-read `principles.md §Refactoring → NEVER create compatibility layers`.

**Key Principle**: The relative-path import is a workaround. The fix is the proper `devDependency` import; do not preserve the relative path.

#### Task 3.1: Migrate the validator and convert its import to `@oaknational/eslint-plugin-standards`

**Current Implementation** (at `scripts/validate-eslint-boundaries.ts:8`):

```typescript
import { ... } from '../packages/core/oak-eslint/src/rules/boundary.js';
```

**Target Implementation** (at the new workspace path):

```typescript
import { ... } from '@oaknational/eslint-plugin-standards';
```

**Acceptance Criteria**:

1. ✅ Validator moved to chosen workspace.
2. ✅ Workspace `package.json` lists `@oaknational/eslint-plugin-standards` as a `devDependency` via the `workspace:*` protocol (per ADR-012 / ADR-168).
3. ✅ Import converted; `tsx` development-condition workaround removed.
4. ✅ `pnpm test:root-scripts` still produces the same boundary-check output.
5. ✅ `pnpm depcruise` now sees the validator as a workspace consumer of the eslint package, not a relative-path bypass.

---

### Phase 4: Filesystem-Walker Consolidation (~1–2 hours)

**Foundation Check-In**: Re-read `principles.md §Refactoring → Don't extract single-consumer abstractions` (test: do three+ consumers exist?). With three migrated validators using independent walkers, the consolidation passes the test.

#### Task 4.1: Extract the shared walker into a workspace utility module

**Acceptance Criteria**:

1. ✅ Single utility module exposes `walkRepoFiles({ roots, extensions, excludedFragments })` (or analogue).
2. ✅ The three consumers (`validate-portability`, `validate-subagents`, `validate-no-stale-script-invocations`) all import from the shared utility; their bespoke walkers deleted.
3. ✅ All existing tests still pass.
4. ✅ Net line-count reduction recorded.

---

### Phase 5: Rewire + Documentation Sweep (~1–2 hours)

#### Task 5.1: Retire or sharply scope `pnpm test:root-scripts`

**Acceptance Criteria**:

1. ✅ Either: `test:root-scripts` removed from `package.json` and the `pnpm check` chain rewires to the workspace tasks.
2. ✅ Or: `test:root-scripts` retained but scoped to genuinely thin shell residue with an inline comment naming what it covers.

#### Task 5.2: Update CI workflow YAML

**Acceptance Criteria**:

1. ✅ `.github/workflows/*.yml` invocations of `pnpm test:root-scripts` updated per Task 5.1.
2. ✅ `pnpm exec tsx scripts/validate-no-stale-script-invocations.ts` (the gate added in PR-90) — the validator gate now fires from the workspace task; `validate-no-stale-script-invocations` (the canonical TS-script invocation gate) remains active.

#### Task 5.3: Documentation sweep

Update each surface listed in §Documentation Propagation Commitment. Record an explicit no-change rationale where no update is needed.

---

### Phase 6: Validation + Closure (~1 hour)

#### Task 6.1: Full Quality Gate Run

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:root-scripts   # if retained per Phase 5
pnpm test:widget
pnpm test:ui
pnpm test:a11y
pnpm subagents:check
pnpm portability:check
pnpm knip
pnpm depcruise
pnpm markdownlint:root
pnpm format:root
pnpm practice:fitness:informational
```

**Acceptance Criteria**: every command exits 0.

#### Task 6.2: `docs-adr-reviewer`

Verify ADR-168 amendment / peer ADR + rule file land cleanly; cross-references resolve; no documentation drift.

#### Task 6.3: `release-readiness-reviewer`

Synthesise quality-gate evidence + breaking-change risk (no public API changes; `pnpm test:root-scripts` semantics may change) + migration impact + operational readiness into a GO / GO WITH CONDITIONS / NO-GO recommendation.

#### Task 6.4: Foundation Document Compliance Checklist

- [ ] `principles.md - Architectural Excellence Over Expediency`: drift cured at the boundary, not duplicated across.
- [ ] `principles.md - Separate Framework from Consumer`: "Distinct workspaces" rule now satisfied for the validator family.
- [ ] `principles.md - Refactoring → No compatibility layers`: relative-path bypass replaced with the proper `devDependency` import; not bridged.
- [ ] `principles.md - Quality Gates`: full gate sweep green pre- and post-migration.
- [ ] `testing-strategy.md - Refactoring TDD`: behaviour-preserving migration; existing tests served as the safety net; no new tests required for the move itself.
- [ ] `schema-first-execution.md`: N/A confirmed.

#### Task 6.5: Archive plan; close active claim

- Move this plan to `.agent/plans/architecture-and-infrastructure/archive/completed/`.
- Move the source strategic brief at `future/scripts-validator-family-workspace-migration.plan.md` to `archive/completed/` alongside it.
- Close the active claim covering this work.
- Run `/jc-consolidate-docs` per §Consolidation below.

---

## Testing Strategy

### Unit Tests

**Existing coverage** is sufficient — the migration is behaviour-preserving. The 9 unit tests on `findStaleScriptInvocations`, plus the unit tests on each migrating validator's helper, all carry over with import-path updates only.

**No new unit tests required** for the migration itself. Per `testing-strategy.md §Refactoring TDD`: "Existing tests ARE the safety net — run them before and after the split, no new tests needed for internal restructuring."

### Integration Tests

**Existing coverage** is sufficient for the validators that have integration tests (`validate-portability.integration.test.ts`, `check-blocked-content.integration.test.ts`).

**New integration tests required** if Phase 4 introduces any non-trivial new behaviour in the consolidated walker (it should not — the consolidation is a refactor).

### E2E / Smoke Tests

Not affected by this plan.

---

## Success Criteria

### Phase 0

- ✅ Destination workspace decided and recorded.
- ✅ Canonical rule file landed.
- ✅ ADR amendment / peer ADR landed.

### Phase 1 (Pilot)

- ✅ `validate-no-stale-script-invocations` lives in the chosen workspace.
- ✅ All quality gates green; CI green; PR comment block updated.

### Phase 2–4

- ✅ All Group A validators migrated.
- ✅ Cross-workspace src/ import eliminated.
- ✅ Filesystem walker consolidated.

### Phase 5

- ✅ `pnpm test:root-scripts` retired or scoped.
- ✅ Documentation sweep complete; no stale path references.

### Phase 6

- ✅ All quality gates green; release-readiness GO.
- ✅ Plan archived; claim closed.

### Overall

- ✅ Six validators migrated from `scripts/` into a declared workspace under full tooling coverage.
- ✅ Owner-direction rule graduated to canonical surface; future drift prevented by the rule + the new architectural shape.
- ✅ No behaviour change in any validator (proven by existing tests).
- ✅ Cross-workspace src/ bypass eliminated.
- ✅ Filesystem-walker duplication eliminated.

---

## Dependencies

**Blocking**: PR #90 must merge first (this plan operates on the post-merge `main` baseline). Phase 0's rule-graduation and ADR decision can begin in parallel.

**Related Plans**:

- [`future/scripts-validator-family-workspace-migration.plan.md`](../future/scripts-validator-family-workspace-migration.plan.md) — source strategic brief.
- `current/sonarjs-activation-and-sonarcloud-backlog.plan.md` — adjacent quality-gate work; not blocked by this plan.
- ADR-168 — direct architectural ancestor; will receive the amendment from Task 0.3.

**Prerequisites**:

- ✅ Architecture-reviewer consensus (recorded in PR #90 comment `4346908971`).
- ✅ Strategic brief at `future/`.
- ⚪ PR #90 merged to `main` (pending owner MCP manual validation).

---

## Notes

### Why This Matters (System-Level Thinking)

**Immediate value**:

- Validators gain workspace ESLint boundary-rule coverage; a future rogue import is caught at lint time, not at runtime.
- Validators gain `pnpm type-check` coverage via workspace tsconfig; type errors caught pre-runtime.
- The cross-workspace src/ bypass in `validate-eslint-boundaries` becomes a proper `devDependency` import, restoring the package public-API contract.
- Filesystem-walker duplication eliminated.

**System-level impact**:

- Future validators have an obvious, rule-enforced home; the "default to `scripts/`" anti-pattern is structurally prevented.
- ADR-168 §Workspace-script-ban gains its inverse-direction completion; the workspace doctrine is whole.
- The owner-direction rule moves from oral-tradition (napkin + memory) to canonical (`.agent/rules/`); future contributors do not re-litigate.
- `pnpm test:root-scripts` retirement (or sharpening) removes a category that confused the test-runner architecture.

**Risk of not doing**:

- Drift compounds: each new validator added to `scripts/` ad hoc extends the family beyond cardinality six.
- The cross-workspace src/ bypass remains and may be copied by future code.
- Filesystem-walker duplication becomes triplication, then quadruplication.
- The owner-direction rule remains uncodified; future PRs re-litigate, costing review cycles.

### Alignment with `principles.md` and `testing-strategy.md`

> "Distinct architectural layers MUST live in distinct workspaces. Modules/directories may organise code inside a layer, but they do not satisfy layer separation."

This plan's central work is realising that requirement at the validator family.

> "Existing tests ARE the safety net — run them before and after the split, no new tests needed for internal restructuring."

This plan applies that rule rigorously: no new tests added during migration; behaviour-preservation proven by the existing test suites.

---

## References

- [Source strategic brief](../future/scripts-validator-family-workspace-migration.plan.md)
- PR #90 reviewer-consensus comment: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/90#issuecomment-4346908971>
- ADR-041 (workspace structure): `docs/architecture/architectural-decisions/041-workspace-structure-option-a.md`
- ADR-168 (TS6 baseline + workspace-script architectural rules): `docs/architecture/architectural-decisions/168-typescript-6-baseline-and-workspace-script-architectural-rules.md`
- ADR-165 (agent-work-practice-phenotype-boundary): `docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md`
- Pattern: `.agent/memory/active/patterns/governance-claim-needs-a-scanner.md`
- User-memory: `feedback_no_workspace_to_root_scripts`

---

## Implementation Notes

### Key Insight

The framework/consumer split is already done in code shape. The migration realises it at the workspace boundary — small unit of conceptual rework, mostly mechanical file moves + import updates.

### Migration Path

1. Phase 0 — decide + graduate the rule.
2. Phase 1 — pilot smallest-coupling validator.
3. Phase 2 — batch zero-coupling validators.
4. Phase 3 — coupled validator + public-API fix.
5. Phase 4 — consolidate the duplicated walker.
6. Phase 5 — rewire test-runner + documentation.
7. Phase 6 — validation + closure.

### Minimal Risk

- Each phase is independently green-gated; failure at phase N does not roll back phase N−1.
- Existing tests carry the safety net; behaviour preservation is the load-bearing invariant.
- The pilot phase (Phase 1) uses the cleanest validator (zero coupling) so the bin/wiring pattern is discovered before the larger migrations.

---

## Validation Checklist

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:root-scripts   # may be retired by Phase 5
pnpm subagents:check
pnpm portability:check
pnpm knip
pnpm depcruise
pnpm markdownlint:root
pnpm format:root
pnpm practice:fitness:informational
```

**Expected**: all exit 0.

---

## Code Quality Verification

```bash
# 1. No validators remain in scripts/
ls scripts/validate-*.ts 2>&1
# Expected after Phase 5: only thin Group B/C residue (Claude hooks, CI tooling) — no Group A validators.

# 2. validate-eslint-boundaries no longer reaches into another workspace's src/
grep -r "from '\.\./packages" <chosen-workspace>/src/ 2>&1
# Expected: no matches (proper @oaknational/* imports only)

# 3. Canonical rule file present
ls .agent/rules/no-workspace-evading-scripts.md  # or chosen name
# Expected: exists
```

---

## Consolidation

After all phases complete and quality gates pass, run `/jc-consolidate-docs` to:

- Graduate any settled patterns (e.g. "validator family belongs in a workspace, not `scripts/`" → either the rule already authored in Task 0.2 or a peer pattern note).
- Rotate the napkin if execution observations have accumulated.
- Manage fitness across surfaces touched.
- Update the practice exchange.

Archive this plan and the source strategic brief to `archive/completed/`.

---

## Future Enhancements (Out of Scope)

- **Group B migration** (Claude-hook scripts): `check-blocked-content`, `check-blocked-patterns`. Different execution model (stdin/stdout protocol). Separate plan.
- **Group C migration** (CI-only tooling): `ci-turbo-report`, `ci-schema-drift-check`, `prevent-accidental-major-version`. Separate plan.
- **Consolidating `validate-portability` and `validate-subagents` allowlist patterns** into shared config — out of scope; speculative.
- **Adding new structural validators** (e.g. for the local-vs-CI invocation gap flagged in PR-90 closure plan §Future Enhancements) — separate plans, but the migrated workspace becomes the obvious home.
