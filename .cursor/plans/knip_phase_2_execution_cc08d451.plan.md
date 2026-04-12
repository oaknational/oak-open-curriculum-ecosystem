---
name: Knip Phase 2 Execution
overview: Systematically remediate 850 unused exports/types across 9 groups, using evidence-based triage to trim barrels, de-export internals, and delete dead code.
todos:
  - id: batch-a-phase-barrels
    content: "ACTION: Trim 32+ phase-level barrel files (primary/secondary/ks4 index.ts) in ground-truth-archive — remove all re-export lines, keep only *_ALL_QUERIES"
    status: completed
  - id: batch-a-subject-barrels
    content: "ACTION: Trim 16 subject-level barrel files in ground-truth-archive — remove re-export lines for *_PRIMARY_ALL_QUERIES and *_SECONDARY_ALL_QUERIES"
    status: completed
  - id: batch-a-top-barrel
    content: "ACTION: Trim top-level ground-truth-archive/index.ts — remove unused subject re-exports and type re-exports, delete ALL_GROUND_TRUTH_QUERIES constant, keep MATHS_SECONDARY_ALL_QUERIES + registry + diagnostics"
    status: completed
  - id: batch-a-gt-nonarchive
    content: "ACTION: Trim ground-truth/ (non-archive) barrels — same pattern, ~65 findings"
    status: completed
  - id: batch-a-generated
    content: "ACTION: Fix generator to stop exporting TOTAL_LESSON_COUNT/GENERATED_AT, handle generated schema exports"
    status: completed
  - id: batch-a-review
    content: "REVIEW: Run pnpm knip, verify ~526 reduction. Invoke code-reviewer on barrel changes."
    status: completed
  - id: batch-a-gate
    content: "QUALITY-GATE: pnpm type-check && pnpm doc-gen && pnpm test after Batch A"
    status: completed
  - id: grounding-1
    content: "GROUNDING: Re-read GO, principles.md, check plan alignment"
    status: completed
  - id: batch-b-hybrid
    content: "ACTION: De-export hybrid-search internals, delete ablation barrel re-exports"
    status: pending
  - id: batch-b-indexing
    content: "ACTION: De-export ~40 indexing module internal types/helpers"
    status: pending
  - id: batch-b-adapters
    content: "ACTION: Trim adapter barrels, delete dead code (clearSdkCache, resetClientSingleton, etc.)"
    status: pending
  - id: batch-b-cli-lib
    content: "ACTION: Trim cli/shared barrel, de-export lib internals, delete dead code (esBulk, suggestLogger, etc.), trim types/oak.ts facade"
    status: pending
  - id: batch-b-review
    content: "REVIEW: Run pnpm knip, verify ~153 reduction. Invoke code-reviewer."
    status: completed
  - id: batch-b-gate
    content: "QUALITY-GATE: pnpm type-check && pnpm doc-gen && pnpm test after Batch B"
    status: completed
  - id: batch-c-auth
    content: "ACTION: Delete 8 dead auth-response-helpers functions, trim auth barrel, de-export auth-middleware-instrumentation internals"
    status: pending
  - id: batch-c-other
    content: "ACTION: De-export observability/register-resources/test-helpers/widget internals, delete dead PROMPT_SCHEMAS, trim e2e helper types"
    status: pending
  - id: batch-c-review
    content: "REVIEW: Run pnpm knip, verify ~110 reduction. Invoke code-reviewer + architecture-reviewer (auth dead code deletion)."
    status: completed
  - id: batch-c-gate
    content: "QUALITY-GATE: pnpm type-check && pnpm doc-gen && pnpm test after Batch C"
    status: completed
  - id: grounding-2
    content: "GROUNDING: Re-read GO, principles.md, check plan alignment"
    status: cancelled
  - id: batch-d-all
    content: "ACTION: De-export agent-tools type re-exports + packages internal types/helpers"
    status: completed
  - id: batch-d-review
    content: "REVIEW: Run pnpm knip — expect 0 unused exports. Invoke code-reviewer."
    status: completed
  - id: final-gate
    content: "QUALITY-GATE: Full pnpm build && pnpm type-check && pnpm doc-gen && pnpm test && pnpm knip (exit 0 target)"
    status: completed
  - id: update-plans
    content: "ACTION: Update parent plan status, child plan status, session prompt continuity contract, napkin"
    status: completed
isProject: false
---

# Knip Phase 2: Unused Exports Execution Plan

**Status**: COMPLETE — all 850 findings resolved to 0. `pnpm knip` exits 0.
**Completed**: 2026-04-11k

## Intent

Reduce the knip unused exports count from 850 (614 exports + 236 types) to 0 by applying the correct remediation for each finding based on evidence gathered from three parallel investigation agents. This is Phase 2 of the [knip-triage-and-remediation.plan.md](.agent/plans/architecture-and-infrastructure/active/knip-triage-and-remediation.plan.md).

## Investigated Distribution

```
ground-truth-archive barrels   441  (52%) — barrel re-exports never consumed externally
ground-truth (non-archive)      65  ( 8%) — same barrel pattern in newer module
ground-truths/generated         20  ( 2%) — generated schemas/constants unused at runtime
hybrid-search                   29  ( 3%) — ablation builders unused, filter utils internal
indexing                        78  ( 9%) — same-file-only exports + internal types
adapters                        46  ( 5%) — barrel bloat + dead code (clearSdkCache, etc.)
streamable-http                110  (13%) — auth dead code, same-file-only, barrel bloat
agent-tools                     28  ( 3%) — type re-exports from barrels
packages                        15  ( 2%) — internal types unnecessarily exported
types/oak.ts                    23  ( 3%) — duplicate facade over sdk-codegen
```

## Assumptions Questioned

1. **"Barrel trimming is sufficient"** — YES for an app. oak-search-cli has no downstream consumers. Restructuring the ground-truth module is out of scope.
2. **"Config hints (Phase 3) won't affect Phase 2 accuracy"** — YES. The "refine entry pattern" hints mean knip isn't tracing some entries, which could ADD findings, not reduce them. Phase 2 first is correct.
3. **"Ground-truth-archive files are hand-authored"** — VERIFIED. No generator found. Safe to edit directly.
4. **"Generated files should be fixed in the generator"** — YES for `ground-truths/generated/`. `TOTAL_LESSON_COUNT`, `GENERATED_AT`, and unused schemas are emitted by [generate-ground-truth-types.ts](apps/oak-search-cli/ground-truths/generation/generate-ground-truth-types.ts). Fix the generator, then regenerate.
5. **"Dead auth-response-helpers should be deleted, not consolidated"** — YES for this phase. `mcp-auth.ts` has its own private implementations. Consolidation is a future refactoring concern, not a knip concern.
6. **"De-exporting is always better than deleting"** — NO. Per principles.md: "If a function is not used, delete it." Functions with zero consumers (not even same-file) should be deleted entirely. De-export is only for functions used internally but not externally.

## Level-of-fix Decision Matrix

- **Barrel re-export with no external consumer** -> Delete the re-export line from the barrel. The underlying symbol stays accessible via direct import.
- **Export used only within the same file** -> Remove `export` keyword. Keep the function/type.
- **Export with zero consumers anywhere** -> Delete the function/constant entirely.
- **Generated file export unused at runtime** -> Fix the generator to stop emitting the export, then regenerate.
- **Duplicate facade re-export** -> Delete the re-export from the facade file.

## Execution Sequence (GO Cadence)

### Batch A: Ground-truth barrel trimming (526 findings, ~60%)

The single highest-impact batch. Covers ground-truth-archive (441) + ground-truth non-archive (65) + generated (20).

**Why scripted**: 54+ barrel files follow an identical pattern. Manual editing is error-prone at this scale. A targeted script (or batch StrReplace) that removes re-export lines from `index.ts` files is safe and verifiable.

**What stays**: Each phase-level barrel keeps its `*_ALL_QUERIES` composition export. Each subject-level barrel keeps its `*_ALL_QUERIES` aggregation. The top-level barrel keeps: registry functions, `MATHS_SECONDARY_ALL_QUERIES` (consumed by experiments), and diagnostic queries. `ALL_GROUND_TRUTH_QUERIES` is deleted (zero consumers).

**What goes**: All per-query-constant re-exports (`ART_PRIMARY_PRECISE_TOPIC_QUERY`, etc.), all unused subject-level re-exports from the top barrel, all type re-exports where consumers import directly from sub-modules.

**Generated files**: Fix [generate-ground-truth-types.ts](apps/oak-search-cli/ground-truths/generation/generate-ground-truth-types.ts) to stop exporting `TOTAL_LESSON_COUNT` and `GENERATED_AT`, then regenerate. Generated schemas need separate investigation of the schema-emitter.

### Batch B: oak-search-cli non-ground-truth (153 findings, ~18%)

Per-module fixes:

- **hybrid-search**: Delete 8 ablation re-exports from `experiment-query-builders.ts`. De-export `buildYearFilter`, `buildTierFilter`, `buildExamBoardFilter`, `collectMetadataFilters` (same-file-only). Consider deleting `buildThreadRrfRequest` (zero consumers outside tests — need architecture reviewer input on whether this is intentional API).
- **indexing**: De-export ~40 internal types/helpers (e.g. `fetchAndEnrichThreads`, `addRollupSnippet`, `EnrichedThread`). All confirmed same-file-only.
- **adapters**: Trim `sdk-cache/index.ts` barrel (transcript types imported directly). Delete `clearSdkCache`, `resetClientSingleton` (dead). De-export `KEY_STAGES`, `SUBJECTS` (internal). Trim `bulk-data-adapter.ts` barrel.
- **cli/shared**: The entire `shared/index.ts` barrel is unused (CLI uses deep imports). Trim or delete the barrel. Delete `printWarning` function (dead).
- **lib modules**: De-export internal helpers in `elastic-http.ts`, `env.ts`, `es-client.ts`, `logger.ts`. Delete `esBulk` (dead), `createEsClient` in es-client.ts (dead), `suggestLogger` (dead).
- **types/oak.ts**: Delete 23 unused sdk-codegen facade re-exports.

### Batch C: streamable-http (110 findings, ~13%)

Per-module fixes:

- **auth-middleware-instrumentation.ts**: De-export 6 same-file-only functions.
- **auth-response-helpers.ts**: Delete dead `send*`/`handle*` functions (8 functions). These have duplicate private implementations in `mcp-auth.ts`. Track "consolidate auth helpers" as follow-up.
- **auth/mcp-auth/index.ts barrel**: Remove unused re-exports (`mcpAuth`, `createAuthLogContext`, type re-exports).
- **observability**: De-export `decodeUrlValue`, `extractMcpRoute`, `isMcpRoute` (same-file-only).
- **register-resources.ts**: De-export `registerGraphResource` (same-file-only). Remove `registerWidgetResource` re-export.
- **test-helpers/fakes.ts**: Remove `createFakeStreamableTransport` + `createFakeMcpServer` re-exports.
- **prompt-schemas.ts**: Delete `PROMPT_SCHEMAS` constant + `PromptSchemas`/`PromptName` types (dead).
- **E2E helpers**: De-export `LiveHttpApp`, `StubbedHttpApp`, SSE types (unused type exports).
- **Widget**: De-export `AppRuntimeState`, `AppRuntimeDispatch` (same-file-only).
- **Other**: De-export `DOWNLOAD_TTL_MS`, `BootstrapPhaseContext`, `AuthErrorResponse`, etc.

### Batch D: agent-tools + packages (43 findings, ~5%)

Small, mechanical batch:

- **agent-tools**: Remove barrel type re-exports. De-export internal interfaces (`PhaseDetectionInput`, `SessionMatchResult`, etc.).
- **packages/logger**: De-export `RequestMetadataSource`, `RequestLoggingSource`, `LoggingNext`, `FormatOtelLogRecordOptions`, `UnifiedLoggerOptions`.
- **packages/sentry-mcp**: De-export `InMemoryMcpObservationRecorder`.
- **packages/eslint**: De-export `LibPackage`, `DesignPackage`.
- **packages/openapi-zod-client-adapter**: De-export `isRawParameter`, `isRawError`, `transformParameter`, `transformError`.

## Quality Gate Strategy

- After each batch: `pnpm knip` (verify count decreased), `pnpm type-check`, `pnpm doc-gen` (TypeDoc generates from exported symbols — removing exports may remove entries or cause errors if a public function's return type references a now-non-exported type), `pnpm test`
- After Batch A: expect ~526 reduction
- After Batch B: expect ~153 more
- After Batch C: expect ~110 more
- After Batch D: expect ~43 more, target: 0 unused exports
- Before commit: `pnpm build` (verify .d.ts generation)
- If `pnpm doc-gen` produces changes: review the diff, update `typedoc.json` entry points if needed, commit doc changes alongside the export removals

## Architectural Decision Point

**`buildThreadRrfRequest`** in hybrid-search: zero callers outside its own unit test. Is this intentional API for future thread search, or dead code? Recommend asking architecture reviewers before deleting — thread search may be planned.

## Follow-ups (Out of Scope)

- Consolidate `auth-response-helpers.ts` with `mcp-auth.ts` (duplicate implementations)
- Restructure ground-truth module barrel hierarchy (excessive nesting)
- Fix schema-emitter to stop generating unused validation schemas
- Evaluate whether `shared/index.ts` in CLI should be deleted or consumers should be migrated to use it consistently

## Risks

- **Removing export from a type used in .d.ts**: Run `pnpm build` after changes. TypeScript will error if a public function's return type references a non-exported type.
- **TypeDoc entry point drift**: `pnpm doc-gen` generates API docs from exported symbols. Removing exports will remove them from generated docs. Run `pnpm doc-gen` after each batch to catch errors (e.g. broken cross-references, missing entry points in `typedoc.json`). Review the diff to ensure nothing important disappeared from the docs.
- **Generated file drift**: If we fix the generator but don't regenerate, the fix is incomplete. Always regenerate after generator changes.
- **Test-only consumers**: Some exports are consumed only by tests. Per principles.md, this is valid — tests are consumers. De-exporting these would break tests.
