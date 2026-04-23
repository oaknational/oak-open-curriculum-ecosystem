---
name: "Dependency-Cruiser Triage and Remediation"
overview: "Deep-audit all depcruise findings, verify every assumption with evidence, resolve circular dependencies and orphans, promote no-orphans to error severity, promote to blocking quality gate on all four surfaces."
todos:
  - id: phase-0-audit
    content: "Phase 0: Deep audit — re-run depcruise, verify every cycle and orphan classification, question all plan assumptions, correct before acting."
    status: complete
  - id: phase-1-config
    content: "Phase 1: Fix depcruise config — exclude 16 generated non-source files, delete 5 dead-code files, configure 21 legitimate entry points, exclude packages/docs/."
    status: complete
  - id: phase-2-circular-deps
    content: "Phase 2: Resolve 7 circular dependency SCCs — B1 first (20 errors), then A (16), then small cycles (B2, C, D, E, F, G)."
    status: complete
  - id: phase-2.5-reconcile
    content: "Phase 2.5: Reconcile — re-run depcruise after cycle breaks, check for new orphans or cycles."
    status: complete
  - id: phase-3-remaining-orphans
    content: "Phase 3: Resolve any remaining orphans from Phase 2.5; verify 0 warnings."
    status: complete
  - id: phase-4-promote
    content: "Phase 4: Promote no-orphans to error severity, verify 0 errors + 0 warnings, add depcruise to all four gate surfaces."
    status: complete
---

# Dependency-Cruiser Triage and Remediation

**Last Updated**: 2026-04-12
**Status**: Complete — all phases 0-4 resolved 2026-04-12
**Scope**: Deep-audit all depcruise findings, verify every assumption, resolve
circular dependencies and orphans, promote `no-orphans` to error severity,
promote to blocking quality gate on all four surfaces.
**Parent**: [quality-gate-hardening.plan.md](quality-gate-hardening.plan.md)
(item `enable-depcruise`)

## Context

Dependency-cruiser is installed and configured (`.dependency-cruiser.mjs`) but
is not wired into any gate surface. It runs on demand via `pnpm depcruise` and
**already exits non-zero** when errors exist (exit code = error count; verified
exit code 44 for 44 errors). It is simply not included in `pnpm check`,
pre-commit, pre-push, or CI.

The `no-orphans` rule is currently configured as `warn` severity. The end
state of this plan promotes it to `error` so that all depcruise rules are
strict — the tool reports only errors, never warnings.

The parent plan identifies depcruise as a Tier 2 gate addition. This plan is
modelled on the completed knip triage (904 findings → 0, promoted to all four
gate surfaces in ~2 days of focused work).

### Relationship to knip

Knip and depcruise are complementary static analysis tools. Their detection
scopes are mostly disjoint but can produce conflicting signals on orphan/unused
file detection (knip checks export reachability; depcruise checks import-graph
reachability from configured entry points). Where conflicts arise, evidence
determines the resolution.

| Tool | Detects | Does NOT detect |
|------|---------|-----------------|
| **Knip** | Unused deps, unused files, unused exports, dependency hygiene | Circular imports, architectural boundary violations |
| **Depcruise** | Circular deps, orphan modules, layer violations (core→libs→apps) | Unused code, undeclared dependencies |

Knip is now a blocking gate on all four surfaces. Depcruise is the natural next
promotion.

### Key insight from knip

The knip journey proved that large finding counts collapse into a small number
of structural root causes. Knip's 904 findings came from ~6 root causes;
depcruise's 87 findings come from 7 distinct cycle SCCs and 4 orphan action
categories. The remediation pattern is the same: investigate, cluster, fix root
causes, verify.

## Owner Decisions

These questions were raised during Phase 0 and resolved before execution.

1. **Strict end state**: All depcruise rules are `error` severity. `no-orphans`
   is promoted from `warn` to `error` in Phase 4 after all orphans are
   resolved. The clean baseline is 0 errors, 0 warnings — because there will
   be no warnings once all rules are `error`.
2. **All four gate surfaces**: Depcruise is added to `pnpm check`, pre-commit,
   pre-push, and CI — matching knip's coverage.
3. **Phase 0 approval**: The corrected plan (this document) is approved for
   execution.

## Phase 0 Audit Results (2026-04-12)

Phase 0 investigated all 12 plan assumptions (A1-A12) plus discovered 6
hidden assumptions (HA1-HA9). Three architecture reviewers (Barney, Betty,
Wilma) and the assumptions reviewer audited the plan's strategies.

### Assumption Verification

| # | Assumption | Verdict | Evidence |
|---|-----------|---------|----------|
| A1 | 44 errors collapse to ~5 distinct cycles | **Partially falsified** | 7 structurally distinct SCCs, not ~5 |
| A2 | 37/44 errors (84%) from two cycles | **Corrected in favour** | 39/44 (89%): 16 + 23 from two clusters |
| A3 | es-field-overrides cycle is barrel-mediated | **Verified** | `es-field-config.ts` value-re-exports barrel; `common.ts` type-only imports |
| A4 | universal-tools cycle through definitions chain | **Partially verified** | Chain confirmed; `mcp-prompt-messages` ↔ `mcp-prompts` is independent |
| A5 | 43 orphans cluster into ~3 categories | **Falsified** | 4 action categories: 16 exclude, 21 config, 5 delete, 1 off-graph |
| A6 | ~16 orphans are generated docs/shims to exclude | **Verified** | Exactly 16 generated non-source files |
| A7 | `_typedoc_src/` files are legitimate entry points | **Partially verified** | Some are TypeDoc entries; `packages/docs/` copies are stale residue |
| A8 | Test files just need entry config | **Verified** | All 14 test orphans matched by Vitest/Playwright configs |
| A9 | SDK source orphans consumed non-standardly | **Split** | 3 alive via dist subpaths; 5 genuinely dead (incl. 2 empty) |
| A10 | Breaking cycles preserves public API | **Mitigated** | Knip gate + reviewer-endorsed type-extraction approach |
| A11 | Depcruise exits 0 regardless of findings | **FALSIFIED** | Exit code is 44 (= error count) |
| A12 | Config is correct and complete | **Partially falsified** | `packages/docs/` crawled but not a workspace; `pathNot` gaps |

### Hidden assumptions discovered

| # | Hidden Assumption | Verdict |
|---|-------------------|---------|
| HA1 | Fast enough for pre-commit (~2s) | Likely OK; measure in Phase 4 |
| HA2 | No cross-workspace circular deps | Verified by absence |
| HA3 | `tsPreCompilationDeps: true` is correct | Verified — fix type-only cycles structurally |
| HA5 | `pathNot` exclusions complete | Falsified — missing doc output, Playwright, scripts |
| HA6 | "No overlap" with knip | Internal contradiction removed |
| HA9 | Exit code 44 = errors only | Needs verification in Phase 4 |

### Corrections applied to plan

1. Context section rewritten (A11 falsified — exits 44, not 0)
2. Cycle count corrected: 7 distinct SCCs, not ~5
3. Orphan categories corrected: 4 action categories (16/21/5/1), not ~3
4. "No overlap" claim removed; replaced with honest statement
5. Concrete fix specified per cycle (reviewer-endorsed strategies)
6. Phases 1 and 2 allowed in parallel (orthogonal concerns)
7. `packages/docs/` excluded (non-workspace directory)
8. Task 4.4 reduced to "verify existing exit behaviour"
9. Phase 2.5 checkpoint added (reconcile after cycle breaks)
10. `pnpm sdk-codegen` added as hard gate for SDK changes
11. `no-orphans` promoted to `error` in Phase 4 (owner decision: strict)

## Verified Findings (2026-04-12)

**Total**: 87 violations (44 errors, 43 warnings). 1,940 modules, 4,166
dependencies cruised. Exit code: 44.

| Category | Count | Severity | Priority |
|----------|-------|----------|----------|
| Circular dependencies | 44 | error | P1 — structural coupling |
| Orphan modules | 43 | warn (→ error in Phase 4) | P2 — config or dead code |
| Layer violations | 0 | error | N/A — clean |
| Deprecated Node APIs | 0 | warn | N/A — clean |

### Circular dependencies (44 errors → 7 distinct SCCs)

89% of errors (39/44) come from two barrel-mediated cycles in two SDK
packages. The remaining 5 errors are simple 2-3 node cycles in 3 packages.

#### SCC-A: es-field-overrides barrel (16 errors, oak-sdk-codegen)

Files in `packages/sdks/oak-sdk-codegen/code-generation/typegen/search/`.

**Structure**: `*-overrides.ts` → `common.ts` → (type-only) `es-field-config.ts`
→ (value re-export) `es-field-overrides/index.ts` → back to overrides.

**Key imports traced**:

- `common.ts` imports `EsFieldMapping` from `es-field-config.ts` as
  **type-only** (`import type`)
- `es-field-config.ts` **value re-exports** all override constants from the
  barrel (`export { LESSONS_FIELD_OVERRIDES, ... } from './es-field-overrides/index.js'`)
- Each `*-overrides.ts` uses **value** imports from `common.ts` (helper
  functions) + **type-only** from `es-field-config.ts` (mapping types)
- Some overrides (e.g. `zero-hit-overrides.ts`) skip `common.ts` and import
  directly from `es-field-config.ts`

**Fix (Barney/Betty consensus)**: Extract `EsFieldMapping`, `ZodTypeDescriptor`,
`EsCompletionContext` into a leaf `es-field-types.ts`. Point `common.ts` and all
overrides at the leaf. Keep `es-field-config.ts` re-exporting types for API
continuity.

#### SCC-B1: Aggregated tools + universal-tools (20 errors, oak-curriculum-sdk)

Files in `packages/sdks/oak-curriculum-sdk/src/mcp/`.

**Structure**: `definitions.ts` value-imports `*_TOOL_DEF` / `*_INPUT_SCHEMA`
from `aggregated-*/index.ts` → `execution.ts` value-imports
`formatError`/`formatToolResponse` from `universal-tool-shared.ts` →
`universal-tool-shared.ts` type-imports `GeneratedToolRegistry` from `types.ts`
→ `types.ts` type-imports `AGGREGATED_TOOL_DEFS` from `definitions.ts` → back.

**Key tension** (per all three architecture reviewers): `types.ts` derives
`AggregatedToolName` from the runtime map in `definitions.ts`
(`type AggregatedToolName = keyof typeof AGGREGATED_TOOL_DEFS`). Framework
types depend on consumer registration assembly — a "Separate Framework from
Consumer" violation.

**Fix (Barney)**: Change `definitions.ts` to import only registration leaf
artefacts (the individual `*_TOOL_DEF` / `*_INPUT_SCHEMA` constants), not the
`aggregated-*/index.ts` barrels. Then extract `AggregatedToolName` if the
cycle survives.

**Fix (Betty)**: Explicitly define `AggregatedToolName` union in `types.ts`
rather than deriving from `AGGREGATED_TOOL_DEFS`. Decompose
`universal-tool-shared.ts` into `tool-execution.ts` and `tool-formatting.ts`.

#### SCC-B2: mcp-prompt-messages ↔ mcp-prompts (1 error, oak-curriculum-sdk)

**Structure**: `mcp-prompts.ts` value-imports message factories from
`mcp-prompt-messages.ts`. `mcp-prompt-messages.ts` type-imports `PromptArgs`
from `mcp-prompts.ts`. Independent of SCC-B1.

**Fix**: Create `mcp-prompt-types.ts` holding `PromptArgs` and
`PromptMessage`. Both files import from it.

#### SCC-C: Tool guidance data chain (2 errors, oak-curriculum-sdk)

**Structure**: `curriculum-model-data.ts` → `tool-guidance-data.ts` →
`tool-guidance-workflows.ts` → `tool-guidance-types.ts` → `types.ts` →
`definitions.ts` → `aggregated-curriculum-model/index.ts` → back.

**Shares edges with SCC-B1** (through `types.ts` → `definitions.ts`).

**Fix (Barney consensus)**: Do NOT refactor independently. Fix SCC-B1 first,
re-run depcruise. This cycle is likely a derivative and will probably collapse
once the `types.ts` → `definitions.ts` back-edge is broken.

#### SCC-D: logger otel-format ↔ types (1 error)

Files in `packages/libs/logger/src/`.

**Structure**: Both directions are **type-only** (`import type`). A pure
type-level cycle. `otel-format.ts` type-imports `LogContext`,
`NormalizedError` from `types.ts`. `types.ts` type-imports `OtelLogRecord`
from `otel-format.ts`.

**Fix**: Create `otel-types.ts` for shared types.

#### SCC-E: design-tokens-core contrast-resolve ↔ index (1 error)

Files in `packages/design/design-tokens-core/src/`.

**Structure**: `contrast-resolve.ts` type-imports `DtcgTokenTree` from
`index.ts`. `index.ts` value-re-exports `resolveTokenTreeToHex` from
`contrast-resolve.ts`.

**Fix**: Move `DtcgTokenTree` out of barrel into a leaf type file. Internal
modules should not import their own package barrel.

#### SCC-F: oak-search-cli helpers (2 errors)

Files in `apps/oak-search-cli/src/lib/`.

**Structure**: `index-oak-build-helpers.ts` ↔ `index-oak-helpers.ts` with
`lesson-processing.ts` creating a 3-node path. `index-oak-build-helpers.ts`
type-imports `PairBuildContext`/`PairUnits` from `index-oak-helpers.ts`.
`index-oak-helpers.ts` value-imports build functions from
`index-oak-build-helpers.ts`.

**Fix**: Extract `PairBuildContext` and `PairUnits` to a leaf type module.

#### SCC-G: oak-search-cli adapters (1 error)

Files in `apps/oak-search-cli/src/adapters/`.

**Structure**: `oak-adapter.ts` value-imports `createUncachedClient`,
`createCachedClient`, `buildClientConfig` from `sdk-client-factory.ts`.
`sdk-client-factory.ts` type-imports `OakClient`, `CacheStats` from
`oak-adapter.ts`.

**Fix**: Move `OakClient`, `CacheStats` types to `oak-adapter-types.ts`.

#### Summary cycle table

| SCC | Errors | Workspace | Fix |
|-----|--------|-----------|-----|
| **A** es-field-overrides | 16 | `oak-sdk-codegen` | Leaf `es-field-types.ts` |
| **B1** aggregated tools | 20 | `oak-curriculum-sdk` | Rewire `definitions.ts` |
| **B2** prompts | 1 | `oak-curriculum-sdk` | `mcp-prompt-types.ts` |
| **C** guidance chain | 2 | `oak-curriculum-sdk` | Fix B1 first |
| **D** logger | 1 | `logger` | `otel-types.ts` |
| **E** design tokens | 1 | `design-tokens-core` | Leaf type file |
| **F** cli helpers | 2 | `oak-search-cli` | Leaf type module |
| **G** cli adapters | 1 | `oak-search-cli` | `oak-adapter-types.ts` |

### Orphan modules (43 warnings → 4 action categories)

| Category | Count | Action |
|----------|-------|--------|
| **(a)** Generated non-source | 16 | Exclude from depcruise |
| **(b)** Legitimate entry points | 21 | Configure as depcruise entry points |
| **(c)** Dead code | 5 | Delete |
| **(d)** Documented off-graph | 1 | Add to `pathNot` |

#### (a) Generated non-source — exclude (16 files)

TypeDoc-generated JS assets (10 files):

- `packages/sdks/oak-curriculum-sdk/docs/api/assets/{search,navigation,main,icons,hierarchy}.js`
- `apps/oak-search-cli/docs/api/assets/{search,navigation,main,icons,hierarchy}.js`

TypeDoc source shims (4 files):

- `packages/sdks/oak-sdk-codegen/docs/_typedoc_src/types/{search-response-schemas,search-index}.ts`
- `packages/sdks/oak-curriculum-sdk/docs/_typedoc_src/types/{search-response-schemas,search-index}.ts`

Non-workspace stale residue (2 files):

- `packages/docs/_typedoc_src/types/{search-response-schemas,search-index}.ts`

#### (b) Legitimate entry points — config (21 files)

SDK `src/` barrels consumed via `package.json` `exports` subpaths (5 files):

- `oak-sdk-codegen/src/{zod,query-parser,observability,admin}.ts`
- `oak-curriculum-sdk/src/types/schema-bridge.ts` (TypeDoc entry + tsup)

SDK `src/types/` TypeDoc entries (2 files):

- `oak-curriculum-sdk/src/types/public-types.ts`
- `oak-curriculum-sdk/docs/_typedoc_src/types/search-response-schemas.ts`
  (listed in `typedoc.json entryPoints`)

Test files — Vitest (10 files):

- `oak-sdk-codegen/code-generation/typegen/search/generate-subject-hierarchy.unit.test.ts`
- `oak-sdk-codegen/code-generation/typegen/mcp-tools/meta-examples-roundtrip.integration.test.ts`
- `oak-sdk-codegen/code-generation/typegen/error-types/classify-http-error.unit.test.ts`
- `oak-curriculum-sdk/src/types/test-generated/url-helpers.unit.test.ts`
- `oak-curriculum-sdk/src/schema-conformance.unit.test.ts`
- `oak-search-cli/src/lib/indexing/stage-contract-matrix.integration.test.ts`
- `oak-search-cli/src/adapters/oak-adapter.unit.test.ts`
- `oak-curriculum-mcp-streamable-http/src/register-prompts.integration.test.ts`
- `oak-curriculum-mcp-streamable-http/src/__tests__/mcp-server-internal-access.unit.test.ts`

Test files — Playwright (4 files):

- `oak-curriculum-mcp-streamable-http/tests/widget/{tokens-page,oak-banner,dev-index}.spec.ts`
- `oak-curriculum-mcp-streamable-http/tests/visual/landing-page.spec.ts`

Scripts (2 files):

- `oak-search-cli/operations/utilities/generate-synonyms.ts`
- `oak-curriculum-mcp-streamable-http/scripts/run-requests.js`

**Surprise**: `admin.ts` in oak-sdk-codegen is a published subpath export with
zero in-repo consumers. Alive for packaging (knip considers it live), orphan
for depcruise. Classification: **(b)** entry point.

#### (c) Dead code — delete (5 files)

- `oak-sdk-codegen/code-generation/typegen/search/es-types.ts` — unused
  duplicate; the live ES types are in `oak-curriculum-sdk`
- `oak-sdk-codegen/code-generation/schema-fetcher.ts` — `fetchOpenAPISchema`
  not referenced anywhere
- `oak-sdk-codegen/code-generation/lib/td-guards.ts` — no importers
- `oak-sdk-codegen/code-generation/schema-ingestion.integration.test.ts` —
  empty file (0 bytes)
- `oak-curriculum-sdk/src/types/openapi.ts` — empty file

#### (d) Documented off-graph — pathNot (1 file)

- `oak-sdk-codegen/src/synonyms/bucket-c-analysis.ts` — explicitly not part
  of the synonym set; documentation/analysis module intentionally not exported

**Surprise**: `packages/docs/_typedoc_src/` has no typedoc config, no
`package.json`, and is not a pnpm workspace. Likely stale residue from a
previous doc-gen layout. Excluded from depcruise; investigate for deletion
separately.

## Guiding Principles

From `principles.md`:

> "No unused code — If a function is not used, delete it."
>
> "Keep it strict — don't invent optionality, don't add fallback options."

**Decision rule**: Same evidence-first approach as knip. Circular dependencies
are resolved by refactoring the import graph (extracting types to leaf modules,
breaking barrel back-edges), not by adding ignore rules. The only legitimate
exclusions are for genuinely non-source content (generated docs, node_modules,
dist). Dead code is deleted, not excluded. Orphans that are legitimate entry
points get config, not exclusions.

## Quality Gate Strategy

After each phase, run:

```bash
pnpm depcruise    # Verify finding count decreased
pnpm knip         # No knip regressions from restructuring
pnpm type-check   # No type regressions
pnpm lint:fix     # No lint regressions
pnpm test         # No test regressions
```

For SDK cycle-breaking work, also run `pnpm sdk-codegen` (cardinal rule).

After Phase 4, run the full `pnpm check`.

## Resolution Plan

Phases 1 and 2 are independent and can execute in parallel after Phase 0.
Phase 3 depends on both. Phase 4 depends on Phase 3.

```text
Phase 0 (complete)
  ├─→ Phase 1 (config + dead code) ──┐
  └─→ Phase 2 (cycles) ─────────────┤
                                      ├─→ Phase 2.5 (reconcile)
                                      │     └─→ Phase 3 (remaining orphans)
                                      │           └─→ Phase 4 (strict + promote)
```

### Phase 0: Deep Audit — COMPLETE

All 12 assumptions verified with evidence. 6 hidden assumptions discovered.
3 architecture reviewers and assumptions reviewer have audited the plan.
See "Phase 0 Audit Results" section above.

---

### Phase 1: Fix Depcruise Config and Delete Dead Code

**Foundation Check-In**: Re-read principles.md §Code Quality.

Reduce noise by excluding verified non-source content, deleting dead code,
and configuring legitimate entry points. Based entirely on Phase 0 evidence.

#### Task 1.1: Exclude verified non-source content

Add to `.dependency-cruiser.mjs` `exclude.path`:

- `docs/api/assets/` (10 TypeDoc-generated JS files across 2 workspaces)
- `docs/_typedoc_src/` (4 TypeDoc source shims across 2 workspaces)
- `packages/docs/` (non-workspace directory with stale TypeDoc residue)

Add to `no-orphans` `pathNot`:

- `bucket-c-analysis\\.ts` (intentional non-export documentation)

**Acceptance Criteria**:

1. Orphan count drops by 17 (16 generated + 1 documented)
2. No dead code masked by exclusions

#### Task 1.2: Delete verified dead code

Delete the 5 files classified as dead in Phase 0:

1. `packages/sdks/oak-sdk-codegen/code-generation/typegen/search/es-types.ts`
2. `packages/sdks/oak-sdk-codegen/code-generation/schema-fetcher.ts`
3. `packages/sdks/oak-sdk-codegen/code-generation/lib/td-guards.ts`
4. `packages/sdks/oak-sdk-codegen/code-generation/schema-ingestion.integration.test.ts` (empty)
5. `packages/sdks/oak-curriculum-sdk/src/types/openapi.ts` (empty)

**Acceptance Criteria**:

1. Orphan count drops by 5
2. `pnpm knip` still clean
3. `pnpm type-check` and `pnpm test` pass

#### Task 1.3: Configure verified entry points

The remaining 21 orphans are legitimate files unreachable from depcruise's
default entry points. These need depcruise-level entry point configuration
or additional `pathNot` patterns for standalone test/script files.

Options:

- Add test file globs to `no-orphans` `pathNot` (e.g. `\\.test\\.ts$`,
  `\\.spec\\.ts$`, `scripts/`)
- Or configure workspace-specific entry points in depcruise options

**Acceptance Criteria**:

1. Orphan warning count is 0
2. Quality gates pass

---

### Phase 2: Resolve Circular Dependencies

**Foundation Check-In**: Re-read principles.md §Architecture.

Approach per the verified SCC map. Execution order per architecture reviewer
consensus (Barney):

#### Task 2.1: Break SCC-B1 — aggregated tools (20 errors)

The key architectural fix. `definitions.ts` value-imports from
`aggregated-*/index.ts` barrels. `types.ts` type-imports `AGGREGATED_TOOL_DEFS`
from `definitions.ts` to derive `AggregatedToolName`.

Fix: rewire `definitions.ts` to import only registration leaf artefacts (tool
definition constants and input schemas) rather than aggregated public barrels.
Extract `AggregatedToolName` to `types.ts` as an explicit union if needed.

After fixing, re-run depcruise: SCC-C (2 errors) likely collapses because it
shares the `types.ts` → `definitions.ts` back-edge.

**Acceptance Criteria**:

1. SCC-B1 errors drop from 20 to 0
2. SCC-C likely resolved (verify; if not, fix separately)
3. `pnpm sdk-codegen`, `pnpm knip`, `pnpm type-check`, `pnpm test` pass

#### Task 2.2: Break SCC-A — es-field-overrides (16 errors)

Extract `EsFieldMapping`, `ZodTypeDescriptor`, `EsCompletionContext` into a
leaf `es-field-types.ts`. Point `common.ts` and all override modules at the
leaf. Keep `es-field-config.ts` re-exporting types for API continuity.

**Acceptance Criteria**:

1. SCC-A errors drop from 16 to 0
2. `pnpm sdk-codegen`, `pnpm knip`, `pnpm type-check`, `pnpm test` pass

#### Task 2.3: Break remaining small SCCs (B2, D, E, F, G — 5 errors)

All are leaf-type extraction problems:

- **B2**: Create `mcp-prompt-types.ts` for `PromptArgs`/`PromptMessage`
- **D**: Create `otel-types.ts` for `OtelLogRecord`/`LogContext`/`NormalizedError`
- **E**: Move `DtcgTokenTree` out of `index.ts` to leaf type file
- **F**: Extract `PairBuildContext`/`PairUnits` to leaf type module
- **G**: Move `OakClient`/`CacheStats` to `oak-adapter-types.ts`

**Acceptance Criteria**:

1. All `no-circular` errors resolved (0 errors total)
2. `pnpm depcruise` shows 0 errors
3. Quality gates pass across all affected workspaces

---

### Phase 2.5: Reconcile After Cycle Breaks

Re-run `pnpm depcruise` after all cycle breaks. Check for:

- New orphan warnings from files that became unreachable after restructuring
- Any unexpected new cycles from the refactoring
- Orphan inventory changes that affect Phase 3 scope

**Acceptance Criteria**:

1. No new circular dependency errors
2. Any new orphans classified and assigned to Phase 3

---

### Phase 3: Resolve Remaining Orphans

**Foundation Check-In**: Re-read principles.md §Removing unused code.

Handle any orphans remaining after Phases 1 and 2.5. If Phases 1 and 2
resolved all orphans, this phase is a verification pass.

**Acceptance Criteria**:

1. Orphan warning count is 0
2. No dead code masked by config exclusions
3. Quality gates pass

---

### Phase 4: Promote to Strict Blocking Gate

**Foundation Check-In**: Re-read ADR-121 coverage matrix.

#### Task 4.1: Promote no-orphans to error severity

Change `no-orphans` from `severity: 'warn'` to `severity: 'error'` in
`.dependency-cruiser.mjs`. This makes all depcruise rules strict — every
finding is an error.

#### Task 4.2: Verify clean depcruise baseline

Run `pnpm depcruise` and confirm 0 errors (no warnings exist because all
rules are now `error` severity).

#### Task 4.3: Verify exit code semantics

Depcruise already exits non-zero for errors (exit code = error count).
With `no-orphans` promoted to `error`, any orphan will also contribute to
a non-zero exit code. Verify: `pnpm depcruise` returns exit 0 with 0
findings.

#### Task 4.4: Add depcruise to all four gate surfaces

Per ADR-121 and the quality-gate-hardening plan:

1. **`pnpm check`** — add `pnpm depcruise` to the check script
2. **Pre-commit** (`.husky/pre-commit`) — add `pnpm depcruise`
3. **Pre-push** (`.husky/pre-push`) — add `pnpm depcruise`
4. **CI** (`.github/workflows/ci.yml`) — add `pnpm depcruise` step

#### Task 4.5: Update ADR-121 coverage matrix

Add depcruise to the ADR-121 coverage matrix for all four surfaces.

**Acceptance Criteria**:

1. `no-orphans` severity is `error` in `.dependency-cruiser.mjs`
2. `pnpm depcruise` returns exit 0 with 0 findings
3. `pnpm depcruise` returns non-zero exit when errors exist
4. `pnpm check` includes depcruise
5. Pre-commit, pre-push, and CI include depcruise
6. ADR-121 matrix updated
7. Full `pnpm check` passes

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
- **Orphan investigation may reveal depcruise/knip conflicts**: Some orphans
  flagged by depcruise may overlap with code that knip considers live (knip
  checks exports, depcruise checks import reachability). Evidence determines
  the resolution.
- **Gate promotion increases CI duration**: Depcruise currently runs in ~2
  seconds. This is negligible overhead.
- **Phase 2 may create new orphans**: Restructuring modules during cycle
  breaking may make previously-reachable files unreachable. Phase 2.5
  reconciliation catches this.

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs` to graduate settled content, extract reusable
patterns, rotate the napkin, manage fitness, and update the practice
exchange.
