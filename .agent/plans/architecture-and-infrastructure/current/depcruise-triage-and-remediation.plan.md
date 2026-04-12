---
name: "Dependency-Cruiser Triage and Remediation"
overview: "Deep-audit all depcruise findings, verify every assumption with evidence, resolve circular dependencies and orphans, promote to blocking quality gate."
todos:
  - id: phase-0-audit
    content: "Phase 0: Deep audit — re-run depcruise, verify every cycle and orphan classification, question all plan assumptions, correct before acting."
    status: pending
  - id: phase-1-config
    content: "Phase 1: Fix depcruise config — exclude genuinely non-source content, add legitimate entry points, based on Phase 0 evidence."
    status: pending
  - id: phase-2-circular-deps
    content: "Phase 2: Resolve circular dependencies — investigate each cycle's actual import chain, refactor with evidence."
    status: pending
  - id: phase-3-remaining-orphans
    content: "Phase 3: Investigate and resolve remaining orphan warnings after config fixes."
    status: pending
  - id: phase-4-promote
    content: "Phase 4: Verify clean baseline, promote depcruise to pnpm check, pre-commit, pre-push, and CI."
    status: pending
---

# Dependency-Cruiser Triage and Remediation

**Last Updated**: 2026-04-12
**Status**: Current — queued, not started
**Scope**: Deep-audit all depcruise findings, verify every assumption, resolve
circular dependencies and orphans, promote to blocking quality gate.
**Parent**: [quality-gate-hardening.plan.md](quality-gate-hardening.plan.md)
(item `enable-depcruise`)

## Context

Dependency-cruiser is installed and configured (`.dependency-cruiser.mjs`) but
is not a blocking gate. It runs on demand via `pnpm depcruise` but exits 0
regardless of findings (errors and warnings are reported but don't fail the
command in any gate surface).

The parent plan identifies depcruise as a Tier 2 gate addition. This plan is
modelled on the completed knip triage (904 findings → 0, promoted to all four
gate surfaces in ~2 days of focused work).

### Relationship to knip

Knip and depcruise are complementary static analysis tools with no overlap:

| Tool | Detects | Does NOT detect |
|------|---------|-----------------|
| **Knip** | Unused deps, unused files, unused exports, dependency hygiene | Circular imports, architectural boundary violations |
| **Depcruise** | Circular deps, orphan modules, layer violations (core→libs→apps) | Unused code, undeclared dependencies |

Knip is now a blocking gate on all four surfaces. Depcruise is the natural next
promotion.

### Key insight from knip

The knip journey proved that large finding counts collapse into a small number
of structural root causes. Knip's 904 findings came from ~6 root causes;
depcruise's 87 findings come from ~5 distinct cycles and ~3 orphan categories.
The remediation pattern is the same: investigate, cluster, fix root causes,
verify.

## Verified Findings (2026-04-12)

**Total**: 87 violations (44 errors, 43 warnings). 1,940 modules, 4,166
dependencies cruised.

| Category | Count | Severity | Priority |
|----------|-------|----------|----------|
| Circular dependencies | 44 | error | P1 — structural coupling |
| Orphan modules | 43 | warn | P2 — config or dead code |
| Layer violations | 0 | error | N/A — clean |
| Deprecated Node APIs | 0 | warn | N/A — clean |

### Circular dependencies (44 errors → ~5 distinct cycles)

The 44 error reports collapse into 5 distinct dependency cycles. Each cycle
manifests as multiple errors because depcruise reports one error per entry point
into the cycle.

| Cycle | Errors | Workspace | Root cause |
|-------|--------|-----------|------------|
| `es-field-overrides` barrel | 15 | `oak-sdk-codegen` | Barrel `index.ts` re-exports override modules that import `common.ts` → `es-field-config.ts` → barrel. Classic barrel-mediated cycle. |
| `universal-tools` / aggregated tools | ~22 | `oak-curriculum-sdk` | `definitions.ts` → `index.ts` → `execution.ts` → `universal-tool-shared.ts` → `types.ts` → `definitions.ts`. Every aggregated tool module enters through this same cycle. |
| `index-oak-build-helpers` ↔ `index-oak-helpers` | 2 | `oak-search-cli` | Mutual helper dependency through `lesson-processing.ts`. |
| `oak-adapter` ↔ `sdk-client-factory` | 1 | `oak-search-cli` | Adapter and factory mutually depend. |
| `otel-format` ↔ `types` | 1 | `logger` | Format module imports types that import format. |
| `contrast-resolve` ↔ `index` | 1 | `design-tokens-core` | Contrast module imported by barrel that it imports from. |
| `aggregated-*` long chains | 2 | `oak-curriculum-sdk` | `curriculum-model-data` → `ontology-data` → `tool-guidance-data` → `types` → `definitions` → barrel → `execution`. |

**Key pattern**: 37 of 44 errors (84%) come from just two cycles in two SDK
packages. These are barrel-mediated cycles — the same architectural pattern
that generated the majority of knip findings.

### Orphan modules (43 warnings → ~3 categories)

| Category | Count | Root cause |
|----------|-------|------------|
| TypeDoc-generated JS assets (`docs/api/assets/*.js`) | 10 | Generated output scanned by depcruise; should be excluded in config |
| TypeDoc source shims (`_typedoc_src/types/`) | 6 | Doc-gen entry points not wired as depcruise entries |
| Playwright test specs (`tests/widget/`, `tests/visual/`) | 4 | Test files not reachable from source entry points |
| Integration/unit test orphans | 5 | Standalone test files with no import chain from entries |
| SDK code-generation files | 9 | Scripts, standalone generators, and test files not wired as entries |
| Misc source orphans | 5 | `register-prompts.integration.test.ts`, `generate-synonyms.ts`, etc. |
| SDK source files (`src/admin.ts`, `src/observability.ts`, etc.) | 4 | May be genuinely unreachable or consumed via non-standard patterns |

**Key pattern**: ~16 of 43 orphans (37%) are generated doc assets or doc shims
that should be excluded from scanning. Another ~9 are test files that need
entry configuration. Only ~18 require investigation.

## Guiding Principles

From `principles.md`:

> "No unused code — If a function is not used, delete it."

> "Keep it strict — don't invent optionality, don't add fallback options."

**Decision rule**: Same evidence-first approach as knip. Every finding must be
investigated before action. Circular dependencies are resolved by refactoring
the import graph (extracting types, inverting dependencies, breaking barrel
cycles), not by adding ignore rules. The only legitimate exclusions are for
genuinely non-source content (generated docs, node_modules, dist).

## Quality Gate Strategy

After each phase, run:

```bash
pnpm depcruise    # Verify finding count decreased
pnpm knip         # No knip regressions from restructuring
pnpm type-check   # No type regressions
pnpm lint         # No lint regressions
pnpm test         # No test regressions
```

After Phase 4, run the full `pnpm check`.

## Assumptions to Verify

The following assumptions were made during initial drafting from a single
`pnpm depcruise` run. **Every one must be verified with evidence in Phase 0
before any code changes are made.**

| # | Assumption | Risk if wrong | How to verify |
|---|-----------|---------------|---------------|
| A1 | 44 circular errors collapse to ~5 distinct cycles | Work could be larger or smaller; wrong grouping → wrong fix | Trace every error's actual import chain; build a cycle adjacency map |
| A2 | 37 of 44 errors (84%) come from two cycles in two packages | The "big two" cycles may be decomposable into independent sub-cycles | Read every file in the `es-field-overrides/` and `universal-tools/` chains |
| A3 | The `es-field-overrides` cycle is barrel-mediated | It may be a genuine type dependency, not just a re-export issue | Inspect what `es-field-config.ts` actually uses from `index.ts` |
| A4 | The `universal-tools` cycle passes through `definitions.ts` → barrel → `execution.ts` → `universal-tool-shared.ts` → `types.ts` → `definitions.ts` | The chain may skip nodes or include additional modules not yet seen | Walk every import statement in the chain |
| A5 | 43 orphans cluster into ~3 categories | Categories may overlap, or some "orphans" may be false positives from depcruise config | Re-run and classify every single orphan individually |
| A6 | ~16 orphans are generated docs/doc shims that should be excluded | Some may be legitimate source files with misleading paths; exclusion would mask dead code | Inspect each path; confirm it is truly generated/non-source |
| A7 | TypeDoc `_typedoc_src/` files are legitimate entry points | They may be dead remnants of a removed doc-gen pipeline | Check if `_typedoc_src/` is referenced by any build/doc script |
| A8 | Playwright/integration test files just need entry config | Some test files may be genuinely abandoned or testing deleted features | Check each test file imports and whether the feature under test exists |
| A9 | SDK source orphans (`admin.ts`, `observability.ts`) may be consumed via non-standard patterns | They may be genuinely dead code that should be deleted | Search for ALL consumers: imports, dynamic requires, package.json exports field |
| A10 | Breaking barrel cycles preserves public API surfaces | Refactoring may break downstream consumers, codegen contracts, or test expectations | After each refactor, run `pnpm knip` (catches export surface changes) + `pnpm type-check` + `pnpm test` |
| A11 | Depcruise currently exits 0 regardless of findings | It may already exit non-zero for errors (just not wired as a gate) | Run `pnpm depcruise; echo $?` and check the actual exit code |
| A12 | The config in `.dependency-cruiser.mjs` is correct and complete for the current workspace structure | Workspaces may have been added/removed since the config was last updated | Compare configured entry points against actual `packages/*/` and `apps/*/` directories |

## Resolution Plan

### Phase 0: Deep Audit (~2-4 hours)

**Foundation Check-In**: Re-read principles.md §Code Quality and §Architecture.

**Purpose**: Establish verified ground truth. The knip work proved that initial
assumptions about finding counts, categories, and root causes are frequently
wrong. Every assumption in this plan must be verified with evidence before any
code changes are made.

**Key lesson from knip**: The Phase 2.5 follow-ups revealed that 3 of 4
original plan assumptions were materially incorrect (barrel had 17 consumers,
not 0; auth helpers were fully dead, not partially wired; schema emitter
problem was narrower than assumed). Plans drafted from a single tool run
inherit that run's framing bias.

#### Task 0.1: Re-run depcruise and capture raw output

Run `pnpm depcruise` and capture the full output. Parse every individual
finding into a structured inventory (file, rule, severity, cycle chain if
circular, exact module path if orphan).

**Acceptance Criteria**:
1. Complete finding inventory exists with no findings omitted
2. Finding count matches the tool's summary line

#### Task 0.2: Verify circular dependency groupings (A1-A4)

For every `no-circular` error:
1. Trace the **actual** import chain reported by depcruise (not the assumed one)
2. Build a cycle adjacency map showing which files participate in which cycles
3. Verify whether cycles are truly distinct or share edges
4. For the two "big" cycles: read every file in the chain and confirm the
   import is real (not a type-only import that `isolatedModules` would handle)

**Acceptance Criteria**:
1. Verified cycle count (may differ from the assumed ~5)
2. Each cycle has a traced import chain with file:line evidence
3. Assumption corrections documented if counts or groupings differ

#### Task 0.3: Verify orphan classifications (A5-A9)

For every `no-orphans` warning:
1. Identify the exact file path
2. Search for ALL consumers: `import`, `require`, `package.json` exports,
   `tsconfig.json` paths, build scripts, test configs
3. Classify as: (a) generated non-source, (b) legitimate entry point needing
   config, (c) genuinely dead code, or (d) consumed via non-standard pattern
4. For each classification, record the evidence

**Acceptance Criteria**:
1. Every orphan individually classified with evidence
2. Category counts verified (may differ from assumed ~3 categories)
3. Any dead code identified for deletion (not config exclusion)

#### Task 0.4: Verify depcruise config completeness (A11-A12)

1. Check the actual exit code of `pnpm depcruise` (is it already non-zero?)
2. Compare `.dependency-cruiser.mjs` entry points against actual workspace
   directories
3. Check for stale exclusions or missing workspaces
4. Verify the `doNotFollow` / `exclude` patterns still match the repo layout

**Acceptance Criteria**:
1. Exit code behaviour documented
2. Any stale config identified
3. Updated plan with corrected assumptions if needed

#### Task 0.5: Revise plan based on audit findings

After Tasks 0.1-0.4, update the "Verified Findings" section and the Phase 1-3
task descriptions to reflect actual evidence. Correct any assumption that
proved wrong. Present revised plan for owner review before proceeding.

**Acceptance Criteria**:
1. All 12 assumptions have a verified/falsified status with evidence
2. Plan updated with corrected cycle counts, orphan categories, and task scopes
3. Owner has reviewed and approved the corrected plan

---

### Phase 1: Fix Depcruise Config (~1-2 hours)

**Foundation Check-In**: Re-read principles.md §Code Quality.

Reduce noise by excluding genuinely non-source content and adding legitimate
entry points. **Only apply exclusions that were verified as correct in
Phase 0.** This is the depcruise equivalent of knip's Phase 3 (config hints).

#### Task 1.1: Exclude verified non-source content

Based on Phase 0 evidence, exclude content confirmed as generated non-source
(e.g. TypeDoc output). Do NOT exclude anything that Phase 0 classified as
potentially dead code.

**Acceptance Criteria**:
1. Only Phase-0-verified non-source exclusions applied
2. Orphan count drops by the verified amount
3. No dead code masked by exclusions

#### Task 1.2: Configure verified entry points

Based on Phase 0 evidence, add legitimate entry points (test files, scripts,
doc-gen shims) that are confirmed alive but unreachable from source entries.

**Acceptance Criteria**:
1. Only Phase-0-verified entry points added
2. Orphan count drops by the verified amount
3. Quality gates pass

---

### Phase 2: Resolve Circular Dependencies (~2-4 hours)

**Foundation Check-In**: Re-read principles.md §Architecture.

This is the core work. Each cycle needs structural analysis and targeted
refactoring. Approach from largest cluster to smallest. **Use the verified
cycle map from Phase 0, not the draft assumptions.**

#### Task 2.1: Break the largest cycle cluster

Based on Phase 0's verified cycle adjacency map, tackle the cluster with the
most errors first. For each cycle:

1. Read every file in the chain
2. Identify the minimal dependency that creates the cycle
3. Determine the refactoring: type extraction, dependency inversion, barrel
   restructuring, or module splitting
4. Implement, then verify with `pnpm depcruise` + `pnpm knip` + `pnpm type-check`

**Acceptance Criteria**:
1. Largest cycle cluster resolved
2. Error count drops by the verified amount
3. No knip regressions (export surfaces preserved)
4. Type-check and tests pass for affected workspaces

#### Task 2.2: Break remaining cycle clusters

Repeat Task 2.1 for each remaining verified cycle cluster, smallest to largest.

**Acceptance Criteria**:
1. All `no-circular` errors resolved
2. `pnpm depcruise` shows 0 errors
3. Quality gates pass across all affected workspaces

---

### Phase 3: Resolve Remaining Orphans (~1 hour)

**Foundation Check-In**: Re-read principles.md §Removing unused code.

After Phase 1 config fixes, handle orphans that Phase 0 classified as
genuinely dead code or needing pattern fixes.

#### Task 3.1: Delete verified dead code

For each orphan that Phase 0 classified as genuinely dead:
1. Delete the file
2. Run `pnpm knip` to confirm no new issues
3. Run `pnpm type-check` and `pnpm test`

#### Task 3.2: Fix non-standard consumption patterns

For each orphan that Phase 0 classified as consumed via non-standard pattern:
1. Fix the consumption pattern (add proper import, fix package.json exports)
2. Verify the orphan warning resolves

**Acceptance Criteria**:
1. Orphan warning count is 0
2. No dead code masked by config exclusions
3. Quality gates pass

---

### Phase 4: Promote to Blocking Gate (~30 minutes)

**Foundation Check-In**: Re-read ADR-121 coverage matrix.

#### Task 4.1: Verify clean depcruise baseline

Run `pnpm depcruise` and confirm 0 findings across all categories.

#### Task 4.2: Add depcruise to all four gate surfaces

Per ADR-121 and the quality-gate-hardening plan's "pre-push === CI" decision:

1. **`pnpm check`** — add `pnpm depcruise` to the check script
2. **Pre-commit** (`.husky/pre-commit`) — add `pnpm depcruise`
3. **Pre-push** (`.husky/pre-push`) — add `pnpm depcruise`
4. **CI** (`.github/workflows/ci.yml`) — add `pnpm depcruise` step

#### Task 4.3: Update ADR-121 coverage matrix

Add depcruise to the ADR-121 coverage matrix for all four surfaces.

#### Task 4.4: Ensure depcruise exits non-zero on errors

Based on Phase 0's exit code investigation, configure `--max-errors 0` or
equivalent if needed to make it a proper blocking gate.

**Acceptance Criteria**:

1. `pnpm depcruise` returns exit 0 with 0 findings
2. `pnpm depcruise` returns non-zero exit when errors exist
3. `pnpm check` includes depcruise
4. Pre-commit, pre-push, and CI include depcruise
5. ADR-121 matrix updated
6. Full `pnpm check` passes

---

## Dependencies

**Parent plan**: `quality-gate-hardening.plan.md` (item `enable-depcruise`)

**Completed prerequisite**: Knip triage and remediation — complete. Knip is a
blocking gate, so any file deletions or restructuring during depcruise work
will be caught by knip immediately.

**No other blocking dependencies** — this plan can execute independently.
ESLint config standardisation (sibling item in parent plan) is not a
prerequisite for depcruise work.

## Non-Goals (YAGNI)

- Per-workspace depcruise configs (single root config is sufficient)
- Custom visualisation of dependency graphs (the dot reporter exists for
  on-demand use)
- Enforcing import-depth limits (not a current finding)
- Cross-package `src/` import enforcement (already handled by ESLint
  boundary rules, as noted in `.dependency-cruiser.mjs`)

## Risks

- **Barrel cycle refactoring may change public API surfaces**: When extracting
  types from barrels to break cycles, ensure re-exports are preserved so
  downstream consumers aren't broken. Run `pnpm knip` after each refactoring
  to catch any newly unused or missing exports.
- **SDK refactoring may affect codegen consumers**: The two largest cycles are
  in SDK packages. Any type extraction must preserve the generated type
  contract. Run `pnpm sdk-codegen` and `pnpm type-check` after SDK changes.
- **Orphan investigation may reveal genuinely dead code**: Some orphans flagged
  by depcruise may overlap with code that knip considered live (because knip
  checks exports, depcruise checks import reachability). Evidence determines
  the resolution.
- **Gate promotion increases CI duration**: Depcruise currently runs in ~2
  seconds. This is negligible overhead.

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs` to graduate settled content, extract reusable
patterns, rotate the napkin, manage fitness, and update the practice
exchange.
