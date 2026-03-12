---
name: "Developer Experience Strictness Convergence"
overview: "Canonical phased plan to converge test discipline, ESLint override removal, no-console enforcement, and the remaining strictness-specific lint promotion work into one executable track."
todos:
  - id: phase-0-baseline-lock
    content: "Phase 0: Recompute and lock enforcement baseline with exact commands and dated evidence."
    status: completed
  - id: phase-1-type-runtime-alignment
    content: "Phase 1: Align Clerk request auth typing/runtime checks and remove blocked Object.assign usage in streamable-http E2E helper."
    status: completed
  - id: phase-2-shared-eslint-architecture
    content: "Phase 2: Tighten shared oak-eslint architecture for deterministic promotion of test/repo restrictions, no-console policy, and strictness-specific config behaviour."
    status: pending
  - id: phase-3-remediate-violations
    content: "Phase 3: Remove existing violations before promotion (type assertions, vi.mock family, Object.assign, inline directives in tests, no-console in enforced scopes)."
    status: pending
  - id: phase-4-remove-override-blocks
    content: "Phase 4: Remove workspace ESLint override blocks, including sdk-codegen authored/generated blocks and app-level override debt."
    status: pending
  - id: phase-5-promote-enforcement
    content: "Phase 5: Promote temporary warn/off states to error and enforce zero-warning linting across monorepo."
    status: pending
  - id: phase-6-docs-archive-closure
    content: "Phase 6: Complete documentation propagation, cross-reference cleanup, and closure/archival checks."
    status: pending
---

# Developer Experience Strictness Convergence

**Created**: 2026-03-03
**Last Updated**: 2026-03-07
**Status**: 🟢 IN PROGRESS (`active/`)
**Owner**: Jim (project owner — sole authority for exception approvals)
**Scope**: Merge and execute overlapping strictness work previously split across E2E test-discipline enforcement, ESLint override-removal, and no-console enforcement, while delegating directory-complexity-specific architectural work to its own canonical plan.

---

## Canonical Status

This is the **single execution source of truth** for strictness convergence.

Superseded source plans:

- `../archive/superseded/e2e-vi-mock-clerk-removal.plan.md`
- `../archive/superseded/eslint-override-removal.plan.md`
- `../../architecture-and-infrastructure/archive/completed/no-console-enforcement.plan.md` (folded into this canonical plan on 2026-03-04)

Related architectural-enforcement sources:

- `../../agentic-engineering-enhancements/current/architectural-enforcement-adoption.plan.md`
- `../../agentic-engineering-enhancements/active/phase-3-architectural-enforcement-execution.md`
- `../current/directory-complexity-enablement.execution.plan.md`

Skills/commands/rules portability: **Superseded** — all skills-first architecture, command unification, and rules consolidation work has moved to [ADR-125 (Agent Artefact Portability)](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md).

### Scope Expansion (2026-03-04)

This canonical plan executes:

1. `no-console` policy convergence and violation remediation.
2. Strictness-specific ESLint convergence work needed for shared config promotion.

Extracted to the canonical directory-complexity plan:

- `../current/directory-complexity-enablement.execution.plan.md`
- supporting structural guardrails required before `max-files-per-dir`
- staged activation of `max-files-per-dir` itself

### Phase 2 Scope Addendum (2026-03-04)

The skills-first architecture, skill structure contract, and command/rules portability work that was originally scoped here has been **extracted to [ADR-125 (Agent Artefact Portability)](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)**. Directory-complexity-specific architectural work is now executed from [directory-complexity-enablement.execution.plan.md](../current/directory-complexity-enablement.execution.plan.md). This plan retains only the remaining ESLint strictness concerns.

---

## Foundation Alignment

Before each phase starts:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Ask: **Could it be simpler without compromising quality?**

Non-negotiables for this plan:

- No compatibility layers
- No check-disabling shortcuts
- No undocumented exceptions
- No hidden scope drift between parallel plan files

### Exception Governance

**Only the project owner (Jim) can approve exceptions to the rules defined in `.agent/directives/principles.md`.** AI agents, sub-agents, and reviewers MUST NOT:

- Approve, create, or ratify exceptions to any rule on their own authority
- Classify a rule violation as "legitimate" or "necessary" without explicit owner approval
- Treat prior exception patterns as blanket permission for new exceptions
- Silently carry forward undocumented exceptions between phases

When an agent encounters a case that appears to require an exception:

1. **Stop** — do not implement the exception
2. **Document** the specific rule, the exact code location, and the technical rationale
3. **Present** the case to the project owner with the evidence
4. **Wait** for explicit owner approval before proceeding
5. **Record** the approval with date and rationale in this plan's execution notes

Exceptions approved by the owner are recorded in the [Approved Exceptions Register](#approved-exceptions-register) below and are scoped to the specific case — they do not generalise.

---

## Problem Statement

Two previously separate plans converged into overlapping scope and started to drift on inventory accuracy, sequencing, and cross-references. This created three execution risks:

1. Conflicting counts and stale blockers can mis-sequence implementation.
2. Enforcement architecture changes can be made before violation burn-down is ready.
3. Plan maintenance overhead doubles when one stream changes facts used by the other.

This plan collapses those risks into one phased execution track.

---

## Baseline Inventory (Locked 2026-03-03)

Phase 0 must re-run and refresh these values before code changes, but this is the starting baseline:

### Type assertion warnings (`@typescript-eslint/consistent-type-assertions`)

- `streamable-http`: 110
- `curriculum-sdk`: 37
- `stdio`: 27
- `search-cli`: 20
- `logger`: 13
- `sdk-codegen`: 11
- **Total**: 218

### `vi.mock`/`vi.doMock`/`vi.stubGlobal`

- In `*.test.ts`/`*.spec.ts`: 21 calls across 8 files
- Repo-wide under `apps/` + `packages/`: 24 calls across 9 files
  - includes 3 calls in test-support file `packages/sdks/oak-sdk-codegen/code-generation/codegen-once.mock.ts`

### `Object.assign`

- 8 calls across 7 files in 5 workspaces

### Inline ESLint directives in tests

- 12 disable directives across 10 test files
- plus 1 inline rule-configuration comment in `e2e-tests/server.e2e.test.ts`

### `console.*` surface and `no-console` override topology

- 628 `console.*` call sites across `apps/` + `packages/` (includes scripts, smoke/evaluation tooling, and generated-JS string builders).
- 7 explicit `'no-console': 'off'` override entries currently present in root/workspace ESLint config files.
- 1 explicit `'no-console': 'error'` override entry currently present in workspace config files.

### Boundary/separation lint baseline

- Custom boundary rules are already consumed in workspace ESLint configs (18 references to `appBoundaryRules`/`appArchitectureRules`/`createSdkBoundaryRules`).
- `eslint-plugin-boundaries` package is not yet present in repository manifests (0 references).

### Phase 0 Refresh Delta (2026-03-03)

- Refresh run date: 2026-03-03
- Result: no metric drift from locked baseline
- Confirmation:
  - type-assertion warnings remain 218 total across the same 6 workspaces
  - `vi.mock` family remains 21 test-scope calls and 24 repo-scope calls
  - `Object.assign` remains 8 calls across 7 files
  - inline directives remain 12 test-file disable directives plus 1 e2e inline config comment

### Deep Review Refresh Delta (2026-03-04)

- Refresh run date: 2026-03-04
- Result: drift detected in 4 metrics since Phase 0 lock
- Evidence source: parallel codebase exploration agents scanning all `apps/` and `packages/`

| Metric | Phase 0 value | Current value | Delta | Notes |
|---|---|---|---|---|
| `vi.mock` (test scope) | 21 across 8 files | 21 across 8 files | None | Stable |
| `vi.mock` (repo-wide) | 24 across 9 files | 24 across 9 files | None | Stable |
| `Object.assign` (source) | 0 | 0 | None | Stable (references remain in docs/plans only) |
| Inline ESLint directives (tests) | 12 across 10 files | **14 across 11 files** | **+2 directives, +1 file** | New directives in widget spec files and sdk-codegen test |
| Inline ESLint directives (e2e) | 1 inline config | **0** | **-1** | e2e inline config removed |
| `console.*` call sites | 628 | **733 across 156 files** | **+105 calls** | Growth in evaluation/benchmark scripts (search-cli) |
| `no-console: 'off'` overrides | 7 | **6 across 6 files** | **-1** | One override removed or consolidated |
| `no-console: 'error'` overrides | 1 | **2 across 2 files** | **+1** | Baseline enforcement now visible in `recommended.ts` |
| Type-assertion warnings | 218 total | Not re-run via lint | Pending | Requires `pnpm lint` per-workspace to confirm |

New inline ESLint directive locations (not in Phase 0 baseline):

- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-accessibility.spec.ts` (2 directives)
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts` (2 directives)
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/search/generate-search-index.unit.test.ts` (2 directives)

Action required: **baseline must be refreshed and re-locked before Phase 2 begins.**

---

## Deterministic Baseline Commands

```bash
# Type assertion warning baseline (run per workspace)
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/curriculum-sdk lint
pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/logger lint
pnpm --filter @oaknational/sdk-codegen lint

# vi.mock family
rg --line-number --hidden --glob '!node_modules' --glob '*.{test,spec}.ts' "\bvi\.mock\(|\bvi\.doMock\(|\bvi\.stubGlobal\(" apps packages
rg --line-number --hidden --glob '!node_modules' "\bvi\.mock\(|\bvi\.doMock\(|\bvi\.stubGlobal\(" apps packages

# Object.assign
rg --line-number --hidden --glob '!node_modules' "Object\.assign\(" apps packages

# Inline directives in test files
rg --line-number --hidden --glob '!node_modules' --glob '*.{test,spec}.ts' "^\s*(/\*|//)\s*(eslint-disable|eslint-disable-next-line|eslint-disable-line)" apps packages
rg --line-number --hidden --glob '!node_modules' --glob '*.e2e.test.ts' "^\s*/\*\s*eslint\s+" apps packages

# console/no-console topology
rg --line-number --hidden --glob '!node_modules' "\bconsole\.(log|error|warn|info|debug|trace)\(" apps packages
rg --line-number "'no-console': 'off'" eslint.config.ts apps/*/eslint.config.ts packages/*/*/eslint.config.ts
rg --line-number "'no-console': 'error'" eslint.config.ts apps/*/eslint.config.ts packages/*/*/eslint.config.ts

# boundary/separation baseline
rg --line-number "appBoundaryRules|appArchitectureRules|createSdkBoundaryRules" apps/*/eslint.config.ts packages/*/*/eslint.config.ts
rg --line-number "eslint-plugin-boundaries" package.json pnpm-lock.yaml apps packages || true
```

### Deterministic Count Commands

```bash
# Type-assertion warning counts per workspace
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint 2>&1 | rg -c "@typescript-eslint/consistent-type-assertions"
pnpm --filter @oaknational/curriculum-sdk lint 2>&1 | rg -c "@typescript-eslint/consistent-type-assertions"
pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint 2>&1 | rg -c "@typescript-eslint/consistent-type-assertions"
pnpm --filter @oaknational/search-cli lint 2>&1 | rg -c "@typescript-eslint/consistent-type-assertions"
pnpm --filter @oaknational/logger lint 2>&1 | rg -c "@typescript-eslint/consistent-type-assertions"
pnpm --filter @oaknational/sdk-codegen lint 2>&1 | rg -c "@typescript-eslint/consistent-type-assertions"

# Static count extraction
rg --line-number --hidden --glob '!node_modules' --glob '*.{test,spec}.ts' "\bvi\.mock\(|\bvi\.doMock\(|\bvi\.stubGlobal\(" apps packages | wc -l
rg --line-number --hidden --glob '!node_modules' "\bvi\.mock\(|\bvi\.doMock\(|\bvi\.stubGlobal\(" apps packages | wc -l
rg --line-number --hidden --glob '!node_modules' "Object\.assign\(" apps packages | wc -l
rg --line-number --hidden --glob '!node_modules' --glob '*.{test,spec}.ts' "^\s*(/\*|//)\s*(eslint-disable|eslint-disable-next-line|eslint-disable-line)" apps packages | wc -l
rg --line-number --hidden --glob '!node_modules' --glob '*.e2e.test.ts' "^\s*/\*\s*eslint\s+" apps packages | wc -l
rg --line-number --hidden --glob '!node_modules' "\bconsole\.(log|error|warn|info|debug|trace)\(" apps packages | wc -l
rg --line-number "'no-console': 'off'" eslint.config.ts apps/*/eslint.config.ts packages/*/*/eslint.config.ts | wc -l
rg --line-number "'no-console': 'error'" eslint.config.ts apps/*/eslint.config.ts packages/*/*/eslint.config.ts | wc -l
rg --line-number "appBoundaryRules|appArchitectureRules|createSdkBoundaryRules" apps/*/eslint.config.ts packages/*/*/eslint.config.ts | wc -l
rg --line-number "eslint-plugin-boundaries" package.json pnpm-lock.yaml apps packages | wc -l
```

---

## Quality Gate Strategy

After each sub-task:

```bash
pnpm type-check
pnpm lint
pnpm test
```

After each phase where generators or templates change:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
```

Additional targeted gates where relevant:

```bash
pnpm test:e2e
```

## Reviewer Gate Strategy

At each phase completion checkpoint, record reviewer outcomes and required follow-ups:

1. Always: `code-reviewer`, `docs-adr-reviewer`
2. Structural/config phases (2, 4, 5): `architecture-reviewer-barney`, `architecture-reviewer-fred`, `architecture-reviewer-betty`, `config-reviewer`
3. Test and type remediation phases (1, 3): `test-reviewer`, `type-reviewer`
4. Auth-sensitive changes: `security-reviewer`

Do not mark a phase as complete until required reviewer findings are either fixed or explicitly carried as dated follow-up debt.

### Execution Notes (2026-03-03)

- Phase 0 executed: baseline commands re-run, counts unchanged, delta recorded.
- Phase 1 executed:
  - `Request.auth` declaration aligned to callable Clerk contract.
  - `extractAuthContext` runtime user-id extraction aligned to callable auth.
  - blocked `Object.assign` removed from `e2e-tests/helpers/test-config.ts`.
  - streamable-http auth fixture helpers updated for callable `req.auth`.
- Validation outcomes for Phase 1:
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check` ✅ pass
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint` returns existing baseline warnings (`consistent-type-assertions`)
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http exec vitest run src/auth/tool-auth-context.unit.test.ts` ✅ pass
  - full `test` and `test:e2e` in this environment fail with `listen EPERM 0.0.0.0` (sandbox/network binding constraint), not a deterministic type error from the Phase 1 code changes

### Remediation Snapshot (2026-03-03, post-Phase 1)

- Sequencing note: `Object.assign` burn-down was executed early as low-coupling remediation and does not depend on Phase 2 shared-rule architecture changes.
- `Object.assign` scan (`rg "Object\\.assign\\(" apps packages`) now returns **0** matches (down from baseline 8).
- `vi.mock` family counts unchanged:
  - 21 calls in `*.test.ts`/`*.spec.ts`
  - 24 calls repo-wide in `apps/` + `packages/`
- Inline ESLint directive counts unchanged:
  - 12 disable directives across test/spec files
  - 1 inline ESLint config comment in e2e tests
- Type-assertion warning distribution unchanged at 218 total:
  - `streamable-http`: 110
  - `curriculum-sdk`: 37
  - `stdio`: 27
  - `search-cli`: 20
  - `logger`: 13
  - `sdk-codegen`: 11

---

## Execution Ownership and Boundary Gates

Dependency direction guardrail for execution sequencing:
`packages/core` -> `packages/libs`/`packages/sdks` -> `apps`.

| Phase | Primary owner | Workspace boundary | Entry gate | Exit gate |
|---|---|---|---|---|
| 0 | Collection owner | Planning/docs only | Canonical plan exists in `active/` | Baseline metrics captured with dated evidence |
| 1 | Streamable HTTP app owner | `apps/oak-curriculum-mcp-streamable-http` only | Baseline locked | Auth typing/runtime alignment merged and green |
| 2 | ESLint core owner | `packages/core/oak-eslint` first, then workspace config callers | Phase 1 complete | Shared rule architecture agreed and lint-clean |
| 3 | Workspace owners | Per-workspace remediation in planned order | Phase 2 complete | Violation inventory reduced to zero for targeted classes |
| 4 | SDK Codegen + app owners | `packages/sdks/oak-sdk-codegen`, then app override debt | Phase 3 complete | Override blocks removed with no regression |
| 5 | ESLint core + all workspaces | Monorepo-wide enforcement | Phase 4 complete | `pnpm lint` zero warnings/errors |
| 6 | Collection/docs owners | Plan/docs/archive surfaces only | Phase 5 complete | Canonical references stable and archival preconditions met |

---

## Phase Plan

### Phase 0: Baseline Lock (Evidence First)

Goal:

- Recompute and record exact inventories with run date and command provenance.

RED (tests/evidence first):

1. Run all baseline scan commands and capture raw outputs.
2. Prove whether counts differ from locked baseline values.

GREEN (minimal implementation):

1. Update baseline section in this file with exact refreshed counts.
2. Add a dated "delta" note if any count has changed.

REFACTOR (cleanup/documentation):

1. Remove stale phrasing where values or file counts drifted.
2. Keep one authoritative metrics block in this plan only.

Acceptance criteria:

1. Baseline block reflects latest command outputs with date.
2. Workspace-level warning splits are included, not just totals.
3. Drift is explicitly documented under a delta subsection.

Deterministic validation:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/curriculum-sdk lint
pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/logger lint
pnpm --filter @oaknational/sdk-codegen lint
rg --line-number --hidden --glob '!node_modules' --glob '*.{test,spec}.ts' "\\bvi\\.mock\\(|\\bvi\\.doMock\\(|\\bvi\\.stubGlobal\\(" apps packages
rg --line-number --hidden --glob '!node_modules' "\\bvi\\.mock\\(|\\bvi\\.doMock\\(|\\bvi\\.stubGlobal\\(" apps packages
rg --line-number --hidden --glob '!node_modules' "Object\\.assign\\(" apps packages
rg --line-number --hidden --glob '!node_modules' --glob '*.{test,spec}.ts' "^\\s*(/\\*|//)\\s*(eslint-disable|eslint-disable-next-line|eslint-disable-line)" apps packages
rg --line-number --hidden --glob '!node_modules' --glob '*.e2e.test.ts' "^\\s*/\\*\\s*eslint\\s+" apps packages
```

---

### Phase 1: Foundational Type/Runtime Alignment

Goal:

- Align Clerk auth typing and runtime assumptions in streamable-http.

Primary targets:

- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/types.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth/tool-auth-context.ts`
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/test-config.ts`

RED (tests/evidence first):

1. Add or update tests that fail under current `Request.auth` typing/runtime assumptions.
2. Add failing assertion showing no-op middleware still depends on blocked `Object.assign`.

GREEN (minimal implementation):

1. Update Express request augmentation to Clerk callable `auth` contract.
2. Update runtime auth extraction logic to handle callable auth correctly.
3. Replace blocked `Object.assign` usage in no-op Clerk middleware helper.

REFACTOR (cleanup/documentation):

1. Remove dead/unreachable type branches caused by prior auth shape assumptions.
2. Tighten doc comments to describe callable auth contract.

Acceptance criteria:

1. Express `Request.auth` typing matches Clerk callable contract.
2. Runtime user-id extraction works for callable auth and rejects invalid shapes.
3. E2E helper no longer uses `Object.assign`.
4. Relevant streamable-http lint/test/type-check commands pass.

Deterministic validation:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
! rg --line-number "Object\\.assign\\(" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/test-config.ts
```

---

### Phase 2: Shared ESLint Architecture Tightening

Goal:

- Make promotion of restrictions deterministic and centrally controlled for the remaining strictness-specific config work, while leaving directory-complexity preconditions to their canonical plan.

Primary targets:

- `packages/core/oak-eslint/src/index.ts`
- `packages/core/oak-eslint/src/configs/recommended.ts`
- `packages/core/oak-eslint/src/configs/strict.ts`
- Workspace configs that currently require cast/disable workarounds (notably search-cli)

RED (tests/evidence first):

1. Add/adjust ESLint config tests where present to fail under current policy gaps.
2. Demonstrate current inability to promote targeted rules without ambiguity.
3. Prove baseline for `no-console` override drift and the remaining shared-config inconsistency across workspace configs.

GREEN (minimal implementation):

1. Implement shared config architecture for deterministic severity promotion.
2. Implement repo-wide `vi.mock`/`vi.doMock`/`vi.stubGlobal` enforcement design.
3. Implement strict restriction for `Object.assign`.
4. Define and encode inline-config strategy (`noInlineConfig` rollout and/or narrow allowlist).
5. Converge `no-console` policy into explicit allowlisted scopes only (scripts/smoke/evaluation/operational CLI).
6. Record the hand-off boundary to `../current/directory-complexity-enablement.execution.plan.md` so directory-complexity support work is not duplicated here.

REFACTOR (cleanup/documentation):

1. Remove workaround comments/casts made unnecessary by shared config cleanup.
2. Update inline docs in config modules for rule intent and phase sequencing.
3. At Phase 2 closeout, run `@.cursor/commands/jc-consolidate-docs.md` so settled guidance is extracted into permanent documentation before phase sign-off.

Acceptance criteria:

1. Shared ESLint config exposes a clear promotion path without ad hoc per-workspace hacks.
2. Repo-wide mock-family policy is encoded and test-support scope is covered.
3. `Object.assign` restriction exists in strict rule-set with explicit message.
4. Inline-config policy is explicit and enforceable.
5. `no-console` scope is explicit: default enforcement with a narrow, documented allowlist.
6. The directory-complexity hand-off is explicit and points to the canonical queued plan.
7. `@.cursor/commands/jc-consolidate-docs.md` has been run at Phase 2 completion and documentation extraction outcomes are recorded.

Deterministic validation:

```bash
pnpm --filter @oaknational/eslint-plugin-standards test
pnpm --filter @oaknational/eslint-plugin-standards lint
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
rg --line-number "'no-console': 'off'" eslint.config.ts apps/*/eslint.config.ts packages/*/*/eslint.config.ts
rg --line-number "directory-complexity-enablement\\.execution\\.plan\\.md" .agent/plans/developer-experience .agent/plans/agentic-engineering-enhancements
# Phase 2 closeout (required):
# run @.cursor/commands/jc-consolidate-docs.md and record extracted documentation outputs.
```

Non-goals in this phase:

- Do not attempt full violation burn-down yet.
- Do not remove workspace override blocks yet.
- Do not duplicate directory-complexity supporting constraints from the canonical queued plan.
- Skills/commands/rules architecture and migration are handled by the Agent Artefact Portability plan.

---

### Phase 3: Remediate Existing Violations

Goal:

- Burn down violation inventory before rule promotion.

RED (tests/evidence first):

1. Snapshot current warnings/violations per workspace and violation class.
2. Add failing tests where DI seams are required to remove `vi.mock`.

GREEN (minimal implementation):

1. Remove all **unjustified** type-assertion suppressions across target workspaces. For each remaining suppression, document the rationale inline and present to the owner for approval (see [Exception Governance](#exception-governance)).
2. Replace/remove all `vi.mock` family usage repo-wide (including test-support files).
3. Remove all `Object.assign` usage in scoped product/test files.
4. Remove inline ESLint test directives or move to explicit allowlist.
5. Burn down `console.*` usage in enforced product scopes and narrow `no-console: off` usage to approved allowlist paths only.

#### `vi.mock` DI Refactoring Scope (from deep review)

| Workspace | Files | Calls | Dominant pattern | DI approach |
|---|---|---|---|---|
| `search-cli` | 5 | 14 | Mocking ES client, search functions, logger | Accept search functions and client as explicit parameters |
| `streamable-http` | 1 | 5 | Mocking Clerk auth module | Inject callable auth fake via existing test helpers |
| `stdio` | 1 | 1 | Mocking MCP server transport | Use existing `createFakeMcpServer` from test-helpers |
| `sdk-codegen` | 1 | 3 | `codegen-once.mock.ts` test support | Refactor to accept codegen function as parameter |

Canonical DI pattern to follow: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` (`RegisterHandlersOptions` interface with explicit dependencies).

REFACTOR (cleanup/documentation):

1. Collapse duplicated helper patterns into reusable DI test fakes.
2. Update this plan's per-workspace progress table after each workspace batch.
3. Remove `isolate: true` and `pool: 'forks'` from `vitest.config.base.ts` once `vi.mock` calls are eliminated and tests pass without process isolation.

Acceptance criteria:

1. Assertion warnings reduced to a **documented justified residual baseline**. Each remaining suppression must have: (a) an inline rationale comment, (b) a categorisation (architectural bridge / test infrastructure / external library), and (c) **explicit owner approval** recorded in the [Approved Exceptions Register](#approved-exceptions-register). The target is not zero — it is zero *unjustified* suppressions.
2. `vi.mock`/`vi.doMock`/`vi.stubGlobal` scan returns zero in enforced scope.
3. `Object.assign` scan returns zero in enforced scope.
4. Inline ESLint test-directive scan returns zero in enforced scope.
5. `no-console` passes in enforced scopes, with only documented allowlist exceptions remaining.
6. Vitest `isolate: true` and `pool: 'forks'` workarounds in `vitest.config.base.ts` are removed after `vi.mock` burn-down is complete and tests pass without process isolation.

Deterministic validation:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/curriculum-sdk lint
pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/logger lint
pnpm --filter @oaknational/sdk-codegen lint
! rg --line-number --hidden --glob '!node_modules' "\\bvi\\.mock\\(|\\bvi\\.doMock\\(|\\bvi\\.stubGlobal\\(" apps packages
! rg --line-number --hidden --glob '!node_modules' "Object\\.assign\\(" apps packages
! rg --line-number --hidden --glob '!node_modules' --glob '*.{test,spec}.ts' "^\\s*(/\\*|//)\\s*(eslint-disable|eslint-disable-next-line|eslint-disable-line)" apps packages
! rg --line-number --hidden --glob '!node_modules' --glob '*.e2e.test.ts' "^\\s*/\\*\\s*eslint\\s+" apps packages
rg --line-number "'no-console': 'off'" eslint.config.ts apps/*/eslint.config.ts packages/*/*/eslint.config.ts
```

Execution order (revised 2026-03-04 per deep review findings):

1. `search-cli` — heaviest `vi.mock` burden (14 calls across 5 files); blocks vitest `isolate: true` / `pool: 'forks'` workaround removal
2. `streamable-http` — second heaviest (5 calls in 1 file); auth-mock refactoring
3. `stdio` — light (1 call in 1 file); fakes already exist
4. `sdk-codegen` — test-support file (3 calls in `codegen-once.mock.ts`)
5. `curriculum-sdk` — type-assertion focus; minimal `vi.mock` exposure
6. `logger` — type-assertion focus; error-context narrowing patterns require owner review

Rationale for reorder: the original order followed dependency direction (`packages/core` → `packages/sdks` → `apps`). The revised order prioritises `vi.mock` burn-down impact. Dependency direction is respected within each violation class — `vi.mock` removal in search-cli does not depend on SDK changes.

---

### Phase 4: Remove ESLint Override Blocks

Goal:

- Remove major override blocks after underlying causes are fixed.

RED (tests/evidence first):

1. For each override block, prove the real root cause with failing lint output.
2. For generated output, prove failures against generator source before touching output.

GREEN (minimal implementation):

1. Remove sdk-codegen authored overrides (`code-generation/**`, `vocab-gen/**`).
2. Remove sdk-codegen generated-output overrides by fixing generators/templates.
3. Remove app-level override debt in search-cli and streamable-http.
4. Remove search-cli `testRules` cast + eslint-disable workaround.

REFACTOR (cleanup/documentation):

1. Delete stale override comments and drifted rationale blocks.
2. Ensure override inventory in docs reflects post-removal state.

Acceptance criteria:

1. Target override blocks are deleted from config files.
2. Regenerated code passes lint with removed generated-output overrides.
3. Search-cli config no longer relies on assertion cast workaround.
4. Workspace lint/type-check/test gates stay green after each removal batch.

Deterministic validation:

```bash
pnpm --filter @oaknational/sdk-codegen lint
pnpm --filter @oaknational/sdk-codegen test
pnpm sdk-codegen
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
! rg --line-number "code-generation/\\*\\*|src/types/generated/\\*\\*|vocab-gen/generators/analysis-report-generator\\.ts" packages/sdks/oak-sdk-codegen/eslint.config.ts
! rg --line-number "testRules as unknown as Linter\\.RulesRecord|eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- testRules types don't match defineConfig's strict expectations|TODO: remove once config DI standardisation is complete" apps/oak-search-cli/eslint.config.ts apps/oak-curriculum-mcp-streamable-http/eslint.config.ts
```

---

### Phase 5: Promote to Final Enforcement

Goal:

- Promote temporary warn/off states to final error enforcement.

RED (tests/evidence first):

1. Prove remaining warnings/errors before final severity promotion.
2. Confirm promotion fails while any residual violations remain.

GREEN (minimal implementation):

1. Promote temporary warn/off states to target error-state.
2. Apply final cleanup for any newly surfaced violations.

REFACTOR (cleanup/documentation):

1. Remove phase-language in config comments that no longer applies.
2. Update canonical plan status and remaining checklists.

Acceptance criteria:

1. Final intended severities are active in shared/workspace configs.
2. Root lint passes with zero warnings and zero errors.
3. Workspace lint commands pass cleanly.

Deterministic validation:

```bash
pnpm lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/curriculum-sdk lint
pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint
pnpm --filter @oaknational/search-cli lint
pnpm --filter @oaknational/logger lint
pnpm --filter @oaknational/sdk-codegen lint
```

---

### Phase 6: Documentation and Archival Closure

Goal:

- Ensure documentation remains canonical and closure is auditable.

RED (tests/evidence first):

1. Scan for stale references to superseded strictness plan paths.
2. Verify collection indexes and roadmap align with final execution state.

GREEN (minimal implementation):

1. Update cross-references to point to canonical plan (or archive targets at closure).
2. Record completion evidence in `../documentation-sync-log.md`.
3. Prepare combined plan archival actions only when all gates are green.

REFACTOR (cleanup/documentation):

1. Remove stale supersession notes that reference non-existent paths.
2. Keep one canonical closure note in collection-level docs.

Acceptance criteria:

1. No stale links to pre-convergence strictness plan locations remain.
2. Documentation sync log contains dated closure evidence.
3. Supersession/delegation links for folded no-console and architectural-enforcement source plans are accurate.
4. Archive conditions are explicitly met before archive move is performed.

Deterministic validation:

```bash
! rg --line-number "\\[[^]]*\\]\\([^)]*(e2e-vi-mock-clerk-removal|eslint-override-removal)\\.plan\\.md\\)" .agent/plans .agent/memory .agent/directives .cursor | rg --line-number -v "archive/superseded/(e2e-vi-mock-clerk-removal|eslint-override-removal)\\.plan\\.md"
rg --line-number "devx-strictness-convergence\\.plan\\.md" .agent/plans/architecture-and-infrastructure/archive/completed/no-console-enforcement.plan.md .agent/plans/agentic-engineering-enhancements/current/architectural-enforcement-adoption.plan.md .agent/plans/agentic-engineering-enhancements/active/phase-3-architectural-enforcement-execution.md
pnpm markdownlint-check:root
```

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Enforcement promoted before burn-down is complete | Immediate lint/test gate failures | Preserve phase sequencing and use baseline lock at each promotion point |
| Repo-wide `vi.mock` scope causes broad refactoring | Large change surface | Batch by workspace and maintain DI-first pattern library |
| Generated-code override removal introduces regressions | Build/type/lint churn | Fix generators first, then regenerate and verify with full gates |
| Inline-config strategy blocks legitimate exceptional tests | Progress stalls | Use explicit, documented allowlist policy where architecture requires narrow exceptions |
| Premature `max-files-per-dir` rollout creates broad disruption | Delivery slowdown and large unrelated churn | Defer activation until boundary/separation guidance and refactor playbooks are fully adopted |
| Type-assertion zero target is unrealistic | False sense of progress or stalled Phase 3 | Reframe target to "zero unjustified" with owner-approved residual baseline |
| Agents self-approve rule exceptions | Erosion of quality standards without owner awareness | All exceptions require explicit owner approval via the [Approved Exceptions Register](#approved-exceptions-register) |
| Baseline drift between phases masks regression | Stale metrics lead to incorrect sequencing decisions | Mandatory baseline refresh and re-lock before each phase begins |

---

## Non-Goals

- Removing legitimate `no-console` carve-outs for CLI and operational scripts unless separately re-scoped.
- Enabling `max-files-per-dir` in the current execution window.
- Bundling unrelated architectural refactors not required for strictness convergence.
- Running parallel strictness plans for the same scope.

---

## Approved Exceptions Register

Exceptions to the rules in `.agent/directives/principles.md` that have been explicitly approved by the project owner. Each entry is scoped to the specific case described — it does not generalise.

| Date | Rule | Location | Rationale | Owner Decision |
|---|---|---|---|---|
| — | — | — | No exceptions approved yet | — |

---

## Deep Review Findings (2026-03-04)

Full codebase analysis performed by 5 parallel exploration agents. Key findings that inform plan execution:

### ESLint Architecture Assessment

- The oak-eslint package is well-architected with `recommended` → `strict` layering and 6 boundary rule exports.
- `testRules` type cast workaround (`testRules as unknown as Linter.RulesRecord` in search-cli config) is confirmed as a Phase 2/4 target.
- No centralised `vi.mock` restriction exists — Phase 2 must encode this.
- No severity promotion lifecycle mechanism exists — rules are either `error` or `off` with no `warn → error` path.

### Type Assertion Landscape

The 218-warning burn-down target requires nuanced handling:

| Category | Estimated count | Fixable? | Owner decision required? |
|---|---|---|---|
| Generated code (sdk-codegen) | ~5,570 | No — codegen pipeline concern | No — already excluded via override |
| Architectural bridges (MCP SDK ↔ Clerk) | ~10–15 | No — necessary library type bridging | Yes — each needs owner approval |
| Test infrastructure fakes | ~100–120 | Partially (20–30%) | Yes — residual suppressions need approval |
| Error context narrowing (logger) | ~20–30 | No — non-enumerable property pattern | Yes — pattern needs owner approval |
| Fixable test/product casts | ~35–50 | Yes | No — just fix them |

**Conclusion**: targeting zero warnings is unrealistic. The realistic target is zero *unjustified* suppressions, with each justified residual recorded in the [Approved Exceptions Register](#approved-exceptions-register).

### DI and Test Infrastructure Readiness

- Test helpers exist in 5 locations with well-designed fakes.
- DI pattern is canonical in streamable-http (`RegisterHandlersOptions`, `RuntimeConfig` params).
- `process.env` access is clean — nearly all at entry points with ESLint enforcement.
- Vitest uses `isolate: true` and `pool: 'forks'` as workarounds for `vi.mock` race conditions; these can be removed after `vi.mock` burn-down.

### Console/Logger Topology

- Product code and test code have **zero** `console.*` calls — enforcement is already working.
- All 733 `console.*` calls are in approved scopes: scripts, evaluation, smoke tests, generated client-side JS, logger file-sink fallback.
- The `no-console` convergence in Phase 2 is primarily about codifying what is already true and centralising the scattered `'no-console': 'off'` entries.

### Boundary Rules

- Boundary enforcement is comprehensive and functioning using `import-x/no-restricted-paths` and `@typescript-eslint/no-restricted-imports`.
- `eslint-plugin-boundaries` is not present (0 references) — existing custom rules are sufficient.
- Phase 2 boundary work is about formalising and documenting the existing architecture.

---

## Cross-References

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`
- `.agent/skills/start-right-quick/shared/start-right.md`
- `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
- `.agent/skills/start-right-quick/SKILL.md`
- `.agent/skills/start-right-thorough/SKILL.md`
- `.cursor/skills/start-right-quick/SKILL.md`
- `.cursor/skills/start-right-thorough/SKILL.md`
- `.cursor/commands/jc-start-right-quick.md`
- `.cursor/commands/jc-start-right-thorough.md`
- `.cursor/rules/use-start-right-skills.mdc`
- `../archive/superseded/e2e-vi-mock-clerk-removal.plan.md`
- `../archive/superseded/eslint-override-removal.plan.md`
- `../../architecture-and-infrastructure/archive/completed/no-console-enforcement.plan.md`
- `../../agentic-engineering-enhancements/current/architectural-enforcement-adoption.plan.md`
- `../../agentic-engineering-enhancements/active/phase-3-architectural-enforcement-execution.md`
- `../documentation-sync-log.md`

---

## Next Session Entry Point (Standalone)

Use this section to start the next execution session without external context.

1. Apply session grounding:
   - Cursor command: `@.cursor/commands/jc-start-right-quick.md` (default) or `@.cursor/commands/jc-start-right-thorough.md` (complex/cross-workspace work).
   - Skill sources: `.agent/skills/start-right-quick/shared/start-right.md` and `.agent/skills/start-right-thorough/shared/start-right-thorough.md`.
2. Re-read canonical foundation rules:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
3. Reconfirm active phase state from this file front matter (`todos`) and `Execution Notes`.
4. Run deterministic baseline probes before making changes in a new phase:
   - type-assertion warning counts per workspace
   - `vi.mock` family scans
   - `Object.assign` scan
   - inline ESLint directive scan
   - `console.*` and `no-console` topology scan
5. Execute one phase at a time with reviewer gates enabled; do not overlap phase implementation.

Session start checklist:

- [ ] Grounding skill applied (`start-right-quick` or `start-right-thorough`)
- [ ] Canonical phase and entry/exit gate identified
- [ ] Baseline metrics refreshed for touched scope
- [ ] Reviewer matrix for the phase preselected
