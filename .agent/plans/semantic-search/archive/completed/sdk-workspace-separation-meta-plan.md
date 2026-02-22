# SDK Workspace Separation Meta Plan: Canonical Findings Log

> Historical note (archived 22 February 2026): this file is a superseded
> historical snapshot and is non-authoritative. The canonical source for this
> work is `active/sdk-workspace-separation.md`.

**Status**: Archived historical snapshot (superseded)  
**Date**: 20 February 2026  
**Repo**: `/Users/jim/code/oak/oak-mcp-ecosystem`  
**Purpose**: historical findings log preserved for record only

---

## 1. Severity-Ordered Findings (Repo-Grounded Revalidation)

### Critical

#### C1. WS5 prerequisite is still open, so split execution must stay blocked

Evidence:

- `.agent/plans/semantic-search/archive/completed/phase-3a-mcp-search-integration.md:65` (`ws5-skip-old-gen`) is `pending`.
- `.agent/plans/semantic-search/archive/completed/phase-3a-mcp-search-integration.md:68` (`ws5-promote-search`) is `pending`.
- `.agent/plans/semantic-search/archive/completed/phase-3a-mcp-search-integration.md:71` (`ws5-quality-gates`) is `pending`.

Impact:

- Split work cannot begin without reintroducing moving-target risk.

Plan consequence:

- Hard gate (G0) remains mandatory before any split implementation phase.

#### C2. Generation workspace does not yet exist

Evidence:

- `packages/sdks` currently contains only `oak-curriculum-sdk` and
  `oak-search-sdk`.
- No `packages/sdks/oak-curriculum-sdk-generation` directory exists.

Impact:

- Workspace split remains pre-implementation.

Plan consequence:

- Scaffold phase is still required; no tasks may assume pre-existing package
  infrastructure.

#### C3. Search surface remains unstable across runtime and generated layers

Evidence:

- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts:41`
  includes `search`.
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts:47`
  includes `search-sdk`.
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/definitions.ts:57`
  includes `get-search-lessons`.
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/definitions.ts:58`
  includes `get-search-transcripts`.
- No skip filter is present in
  `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts`.

Impact:

- Generator/runtime search boundary remains transitional until WS5 is complete.

Plan consequence:

- Keep split gated on WS5 and avoid introducing new tool-boundary assumptions
  before replacement is complete.

#### C4. Turbo.json task graph is monolithic

Evidence:

- `turbo.json` defines `type-gen` outputs and `build` dependencies relative to a single workspace's root.
- No cross-package task dependencies exist between two SDK workspaces.

Impact:

- Splitting the code without updating the task graph will lead to cache misses or stale builds in the runtime SDK.

Plan consequence:

- Turbo task alignment is a first-class Phase 1 scaffold task.

#### C5. All vocab-generated artefacts are still runtime-owned and consumed

Evidence:

- Vocab output root defaults to runtime path:
  `packages/sdks/oak-curriculum-sdk/vocab-gen/run-vocab-gen.ts:42`
  (`src/mcp`).
- Generated filenames include runtime `src/mcp/**` artefacts:
  - `thread-progression-data.ts`
  - `prerequisite-graph-data.ts`
  - `misconception-graph-data.ts`
  - `vocabulary-graph-data.ts`
  - `nc-coverage-graph-data.ts`
  - `synonyms/generated/definition-synonyms.ts`
- Runtime modules import generated vocab outputs directly:
  - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts:20`
  - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts:20`

Impact:

- Partial movement would violate the preserved decision and leave mixed
  ownership.

Plan consequence:

- Step 1 must move all vocab-generated artefacts now, with no staged leftovers.

### High

#### H1. One-way boundary is currently violated inside vocab generation code

Evidence:

- `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/index.ts:59` imports from
  runtime `src/bulk/reader.js`.

Impact:

- Moving this unchanged would make generation depend on runtime internals.

Plan consequence:

- Boundary correction must be an explicit execution task, not a cleanup item.

#### H2. Runtime E2E tests are coupled to monolithic type-gen internals

Evidence:

- `packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/typegen-core.e2e.test.ts:4`
  imports `../../type-gen/typegen-core`.
- `packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/zodgen.e2e.test.ts:6`
  imports `../../type-gen/zodgen-core`.

Impact:

- Split will break tests unless migrated.

Plan consequence:

- Test migration is required in the main split phases.

#### H3. Script/config coupling is broad and must be migrated with file moves

Evidence:

- Generation scripts still live in runtime package scripts.
- Runtime config currently references generation trees across tsconfig, lint,
  test, and typedoc setup.

Impact:

- File moves alone are insufficient; config rewiring is first-class scope.

Plan consequence:

- Include explicit config/script migration phase and acceptance checks.

#### H4. Scope guard helper is pinned to monolithic paths

Evidence:

- `scripts/check-generator-scope.sh` allowlist entries reference runtime
  package generation paths.

Impact:

- Scope checker drifts or breaks after split if not updated.

Plan consequence:

- Script update is mandatory in split execution criteria.

#### H5. OAuth plan cross-reference drift was present in split planning

Evidence:

- Active split plan previously referenced a legacy OAuth plan filename while
  the active file is
  `.agent/plans/semantic-search/active/oauth-validation-and-cursor-flows.plan.md`.

Impact:

- Cross-plan prerequisite checks become unreliable.

Plan consequence:

- All split-plan references now standardised to the active OAuth plan path.

### Medium

#### M1. Generated provenance comments still assume monolithic path ownership

Evidence:

- MCP generator template headers and widget constants comments currently encode
  monolithic path assumptions.

Impact:

- Post-split generated comments will mislead maintainers unless updated.

Plan consequence:

- Template comment updates are part of split documentation work.

#### M2. Baseline import metrics are query-sensitive

Evidence:

- Prior import-count statements used non-locked query scopes and are not
  reproducible across command variants.

Impact:

- Progress/regression measurement can drift.

Plan consequence:

- Main plan now includes method-locked baseline commands.

---

## 2. Preserved Decisions (Authoritative)

1. **Move all vocab-generated artefacts now.**
   - No phased, partial, or temporary runtime ownership.

2. **Block split execution until WS5 is complete.**
   - `ws5-skip-old-gen`, `ws5-promote-search`, and `ws5-quality-gates` must be
     complete before split implementation begins.

---

## 3. Revalidation Snapshot (20 February 2026)

### Key measured baselines

- `packages/sdks/oak-curriculum-sdk/type-gen`: **192 files**
- `packages/sdks/oak-curriculum-sdk/src`: **310 files**
- `packages/sdks/oak-curriculum-sdk/src/types/generated`: **110 files**
- Non-test runtime source files importing local generated paths:
  **58 files**

### Revalidation command set

```bash
ls -1 packages/sdks

rg -n "ws5-skip-old-gen|ws5-promote-search|ws5-quality-gates" \
  .agent/plans/semantic-search/archive/completed/phase-3a-mcp-search-integration.md

rg -n "search-sdk|search" \
  packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts

rg -n "get-search-lessons|get-search-transcripts" \
  packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/definitions.ts

rg -n "SKIPPED_PATHS|skip|exclude" \
  packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts

rg -n "\.\./\.\./src/bulk/reader" \
  packages/sdks/oak-curriculum-sdk/vocab-gen/lib/index.ts

rg -n "typegen-core|zodgen-core|\.\./\.\./type-gen" \
  packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/typegen-core.e2e.test.ts \
  packages/sdks/oak-curriculum-sdk/e2e-tests/scripts/zodgen.e2e.test.ts

find packages/sdks/oak-curriculum-sdk/type-gen -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src -type f | wc -l
find packages/sdks/oak-curriculum-sdk/src/types/generated -type f | wc -l

rg -l "from ['\"](\.{1,2}/)+types/generated|from ['\"]src/types/generated" \
  packages/sdks/oak-curriculum-sdk/src \
  --glob '!**/types/generated/**' \
  --glob '!**/*.test.ts' | wc -l
```

---

## 4. Required Plan Outcomes (Applied in this Revision)

The companion execution plan
`.agent/plans/semantic-search/active/sdk-workspace-separation.md` now includes:

1. WS5 hard gate as Phase 0 blocker.
2. Explicit movement of all vocab-generated artefacts now.
3. Explicit boundary fix for `vocab-gen/lib/index.ts` reverse import.
4. Explicit migration of E2E tests coupled to `type-gen/*` internals.
5. Explicit migration tasks for scripts/config and scope guard script.
6. Generated provenance/TSDoc/docs update phase.
7. Method-locked baseline commands and mandatory acceptance criteria.
8. Correct OAuth plan path references.

---

## 5. Coverage Summary

Reviewed areas for this meta-plan update include:

- planning docs in `.agent/plans/semantic-search/active/`
- runtime SDK generation/runtime boundaries in
  `packages/sdks/oak-curriculum-sdk/`
- generator and vocab pipelines in
  `packages/sdks/oak-curriculum-sdk/type-gen/` and
  `packages/sdks/oak-curriculum-sdk/vocab-gen/`
- supporting guard scripts in `scripts/`

---

## 6. Current State Conclusion

The repository remains in a pre-split, WS5-blocked state. The updated execution
plan is now decision-complete for Step 1 and aligned with current evidence.
No assumptions from prior sessions were carried forward without revalidation.
