---
name: "Comprehensive Field Integrity Integration Tests"
overview: "Design and implement comprehensive integration tests proving all search index fields are correctly handled within each pipeline stage and end-to-end across stages."
todos:
  - id: phase-0-foundation
    content: "Phase 0: Build canonical all-field inventory and stage-contract matrix from generated schemas and mappings."
    status: completed
  - id: phase-1-stage-tests
    content: "Phase 1: Implement stage-level integration suites proving per-field handling at extraction, document-build, and bulk-operation assembly stages."
    status: completed
  - id: phase-2-end-to-end-tests
    content: "Phase 2: Implement cross-stage integration suites proving end-to-end field integrity from source payloads to indexed documents."
    status: completed
  - id: phase-3-hardening
    content: "Phase 3: Run full quality gates, specialist reviews, and documentation propagation with deterministic evidence."
    status: in_progress
---

# Comprehensive Field Integrity Integration Tests

**Status**: 🟡 IMPLEMENTATION IN PROGRESS (handover refresh)  
**Scope**: Prove, via comprehensive integration tests, that all fields for all semantic-search index families are correctly handled at each pipeline stage and across the pipeline end-to-end.
**Execution mode for this authority**: implementation and hardening are active; final closure requires refreshed reviewer round + findings register sync.
**Primary intent**: produce deterministic proof that the search data pipeline is
built and wired correctly before any further ingest attempt.

## Progress Audit (2026-03-19)

### What Has Been Done

- `packages/libs/search-contracts` created and registered, with canonical field inventory + ingest/retrieval stage matrices derived from generated search artefacts.
- Machine-readable ledger and manifest created:
  - `.agent/plans/semantic-search/active/field-gap-ledger.json`
  - `.agent/plans/semantic-search/active/field-integrity-test-manifest.json`
- Field-integrity suites implemented across planned stages:
  - extraction, builder, bulk ops, cross-stage, retrieval integration/unit, readback integration, ledger/manifest contract checks.
- Readback audit operation implemented with split responsibilities:
  - CLI parsing, ledger validation, retry policy, ES dependency adapter, and core audit orchestration.
- Documentation and architecture propagation implemented:
  - `@oaknational/search-contracts` in architecture/docs indexes,
  - ADR-138 added for shared field-contract surface,
  - CLI + contracts README updates.
- Root-cause investigation completed (2026-03-19):
  - **F1** (`threadSlug` on lessons): confirmed stale index. Code pipeline
    proven correct at every stage. Source data verified as fully populated
    (1072/1072 lessons in `maths-primary.json` have thread associations).
    No code fix needed — re-ingest resolves.
  - **F2** (`category` on sequences): **FIXED (2026-03-19 session 2).**
    `categoryMap` wired through full pipeline — both the sequence path
    (`collectPhaseResults` → `extractAndBuildSequenceOperations` →
    `buildSequenceBulkOperations`) and the unit path (`processSingleBulkFile`
    → `createHybridDataSource` → `createBulkDataAdapter` →
    `createUnitTransformer`). `fetchCategoryMapForSequences()` added.
    Fails fast on API errors. TDD evidence:
    `category-wiring.integration.test.ts`,
    `fetch-category-map.integration.test.ts`. All 1033 search-cli tests pass.
- 404 decorator removed for transcript endpoint (upstream schema now native).
  Infrastructure retained for future use.
- **Cardinal Rule breach discovered (2026-03-19 session 2):** upstream OpenAPI
  schema now documents error responses (400, 401, 404). `pnpm sdk-codegen`
  fails at response-map cross-validation. Blocks `pnpm check`. Separate plan
  created: `codegen-schema-error-response-adaptation.plan.md`.

### What Is Good

- Contract surface is shared and boundary-safe (`libs` package consumed by CLI and SDK).
- Manifest-driven `test:field-integrity` is explicit-path and fail-fast (no glob ambiguity).
- Retry/readback logic now has dedicated unit + integration coverage, including transient status handling and zero-count retry behaviour.
- F1/F2 root causes identified with deterministic evidence. F2 code fix complete.
- The 404 decorator's self-healing guard (`assertResponseStatusSlotAvailable`)
  worked exactly as designed — it failed fast when the upstream schema caught up.

### What Needs Doing

1. ~~**Fix F2**~~ — **DONE** (2026-03-19 session 2).
2. **Resolve Cardinal Rule breach**: codegen schema adaptation for upstream
   error responses. See `.agent/plans/semantic-search/current/codegen-schema-error-response-adaptation.plan.md`.
3. **Apply Barney reviewer findings** (3 blocking items):
   - Add `fetchCategoryMapForSequences` to `BulkIngestionDeps`
   - Tighten `CategoryFetchDeps` return type to discriminated union
   - Remove stale `@see ADR-xxx` placeholder
4. Complete reviewer closure cycle (docs-adr, test, elasticsearch).
5. Ensure operator evidence for Task 2.3 is refreshed and stored at
   `.agent/plans/semantic-search/active/evidence/task-2.3.evidence.json`
   after re-ingest.
6. Sync final `F1`/`F2` dispositions in the active findings register so
   plan/prompt/findings state is fully coherent before declaring completion.

### Fresh-Session Restart Checklist

1. Re-ground (`start-right-thorough` + foundation directives).
2. **Fix F2** — wire `categoryMap` into ingestion pipeline (TDD).
3. Run full gates (`pnpm check`).
4. Run reviewer quartet (`architecture-reviewer-barney`, `docs-adr-reviewer`,
   `test-reviewer`, `elasticsearch-reviewer`) against current worktree.
5. Apply/finalise any reviewer findings and re-run gates.
6. Operator re-ingest, then run `field-readback-audit.ts` to populate
   Task 2.3 evidence.
7. Production retest F1 + F2 after re-ingest.
8. Update findings register and mark Phase 3 complete.

---

## Context

Recent production validation showed that mapping presence alone is insufficient: fields can exist in mappings while being unpopulated in indexed documents. We need a comprehensive, deterministic test architecture that validates all fields at all stages, not only the currently failing fields.

### Current live-state baseline (must be treated as open blindness until disproven)

Live checks against the current promoted aliases (`v2026-03-15-134856`) confirm:

- `oak_lessons_v2026-03-15-134856`: `thread_slugs` mapping type is `keyword`, but population check returns:
  - `has_thread_slugs = 0`
  - `missing_thread_slugs = 12391`
- `oak_sequences_v2026-03-15-134856`: `category_titles` mapping type is `text`, but population check returns:
  - `exists_count = 0`
  - `missing_count = 30`
- Sample reads for `lesson_slug`/`thread_slugs` and `sequence_slug`/`category_titles` return values for slug fields but no populated values for the target fields.

Implication:

- mapping correctness and query wiring checks are necessary but not sufficient;
- stage-by-stage population contracts must be proven before any further ingest command.

### Issue 1: Field population gaps can survive local fixes

Evidence from live cluster checks and production retest:

- `thread_slugs` exists in lesson mapping but no indexed values are observed in lesson docs.
- `category_titles` exists in sequence mapping but no indexed values are observed in sequence docs.
- Query filters can be correctly wired yet still fail if field population is missing upstream.

Root cause class:

- Stage contracts are not comprehensively asserted across extraction -> build -> bulk ops -> ingest.
- Existing tests are strong in some hotspots but do not systematically guarantee all-field integrity for every index family.

### Issue 2: Current tests are not comprehensive across all fields and stages

Current strengths:

- Builder and helper tests exist for key components.
- Query helper tests exist for filter clauses.

Current gap:

- No canonical “all fields by index” inventory enforced by integration tests.
- No deterministic cross-stage suite proving that every field with source data survives all stages and lands in ES as expected.

---

## Solution Architecture

### Principle

From [`principles.md`](../../../directives/principles.md) and
[`testing-strategy.md`](../../../directives/testing-strategy.md):

- Test behaviour, not implementation internals.
- TDD at all levels.
- Fail fast with explicit diagnostics.
- Types and contracts flow from generated schema artefacts.

### Key Insight

Treat field integrity as an explicit pipeline contract:

1. Canonical inventory (what fields must exist per index family),
2. Stage contract matrices (what each stage must preserve/transform, split by owner),
3. Deterministic tests that assert both local stage behaviour and end-to-end outcomes.

This keeps complexity manageable by standardising assertions instead of hand-curating one-off checks per bug.
Stage-level tests assert only each stage's public output contract, never private
intermediate state or implementation internals.

### Non-Goals

- ❌ Re-architecting the ingestion pipeline in this plan.
- ❌ Adding compatibility layers or fallback dynamic-mapping behaviours.
- ❌ Expanding scope beyond semantic-search index families used by Oak search.
- ❌ Introducing new scope unrelated to field-integrity closure for `F1`/`F2`.

---

## Field Grouping Model (All Index Families)

All tests must validate fields grouped by responsibility, per index family:

1. `identity_and_routing`  
   Example: ids, slugs, doc type, canonical URLs.
2. `curriculum_context`  
   Example: subject/key stage/phase/years and hierarchy fields.
3. `relationships`  
   Example: unit/thread/sequence linkage arrays and counts.
4. `pedagogical_and_domain_content`  
   Example: lesson/unit pedagogical metadata, category/topic fields.
5. `semantic_and_text_search_surfaces`  
   Example: full text, semantic text, suggest contexts.
6. `enrichment_and_programme_metadata`  
   Example: KS4/tier/exam/options and supplementary enrichment fields.

Index families in scope:

- `lessons`
- `units`
- `unit_rollup`
- `threads`
- `sequences`
- `sequence_facets`
- `meta` (metadata contract checks where relevant to lifecycle integrity)

Fixture policy:

- Anchor fixture data to generated schema types or captured API responses.
- Use `as const satisfies <GeneratedType>` (or equivalent) to couple fixtures to schema evolution.

---

## Quality Gate Strategy

Why not workspace filters:

- Search pipeline contracts cross `apps/oak-search-cli`, generated SDK artefacts, and retrieval SDK behaviour.
- Partial filtering risks false confidence by missing cross-workspace regressions.
- Wildcard-only test commands risk false positives when no files match. Every execution step must run an explicit file manifest.

Validation tool ownership (mandatory):

- Runtime behaviour: Vitest/Supertest/Playwright suites (`pnpm test`, `pnpm test:e2e`, `pnpm test:ui`).
- Type correctness: TypeScript compiler (`pnpm type-check`).
- Coding standards and forbidden patterns: ESLint (`pnpm lint:fix`).
- Formatting and markdown standards: Prettier/Markdownlint (`pnpm format:root`, `pnpm markdownlint:root`).
- Operator live-state evidence: search CLI admin commands plus dedicated operations scripts (no ad-hoc shell pattern scanning).

After each substantive plan or implementation task:

```bash
pnpm type-check
pnpm lint:fix
pnpm test
```

After each phase (full one-gate-at-a-time sequence):

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

Final full gate before completion:

```bash
pnpm check
```

Gate discipline:

1. Run one gate at a time.
2. If any gate fails, fix and restart from the first gate in that sequence.
3. Do not skip gates, do not narrow to workspace filters, do not use bypass flags.

---

## Resolution Plan

### Acceptance Criteria Contract (Mandatory)

Every numbered acceptance criterion in this plan is interpreted and validated
using the same strict shape:

- **Given**: explicit preconditions/inputs are present (files, commands, env,
  fixtures, and ownership boundaries).
- **When**: the listed deterministic validation command(s) for the task are run.
- **Then**: the observable outcome is binary pass/fail with no subjective
  interpretation.
- **Evidence artefact**: proof is captured in one or more of:
  - test output (`vitest`/`pnpm test*`);
  - compiler output (`pnpm type-check`);
  - lint output (`pnpm lint:fix`);
  - gate output (`pnpm check`);
  - committed artefact diffs (manifest, ledger, scripts, matrix/inventory files);
  - operator JSON evidence emitted by the audited command.

Evidence locations (mandatory):

- Active findings register:
  `.agent/plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md`
- Task evidence notes:
  `.agent/plans/semantic-search/active/evidence/<task-id>.md`
- Operator JSON evidence:
  `.agent/plans/semantic-search/active/evidence/<task-id>.evidence.json`

Task completion rule:

- A task is complete only when all its criteria have a recorded evidence
  artefact linked from the active findings register or a task evidence note.

### Phase 0: Canonical Inventory and Stage Contracts

**Goal**: Produce an authoritative all-field inventory and a stage contract matrix per index family.

#### Task 0.0: Establish authoritative baseline and current-gap ledger

Acceptance criteria (Given/When/Then + Evidence):

1. Plan contains current live baseline metrics for known blind fields (population counts, not only mapping presence).
2. A machine-readable gap ledger exists for each index family/field pair, with status:
   - `unknown`
   - `expected_empty_with_precondition`
   - `must_be_populated`
   - `verified`.
3. Gap ledger path and format are explicit and stable:
   `.agent/plans/semantic-search/active/field-gap-ledger.json`.
4. `F1`/`F2` are mapped to concrete field-stage contract gaps, not only symptom statements.
5. Artefact-validation tests are written first (RED) and used to drive baseline/gap-ledger structure (GREEN, then REFACTOR).
6. `task-0.0-gap-ledger.integration.test.ts` is created first and proves:
   - required gap-ledger statuses are present and valid;
   - `F1`/`F2` each map to at least one `{index_family, field, stage}` tuple.

Operator validation (non-CI, requires configured ES target):

```bash
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin validate-aliases
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin meta get
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin count
```

#### Task 0.1: Build canonical field inventory from generated artefacts

Acceptance criteria (Given/When/Then + Evidence):

1. Inventory is derived from generated sources (not manually authored lists).
2. Every index family in scope has an explicit field list.
3. Each field is tagged with group (`identity_and_routing`, etc.).
4. Each field is tagged with:
   - source contract (generated type/mapping origin),
   - stage producer,
   - stage consumers,
   - expected population semantics.
5. Inventory is published in a boundary-safe shared location (generated artefacts or shared package), not app-local test fixtures.
6. Inventory includes both generated type anchors and generated mapping anchors; tests fail on type-vs-mapping drift.
7. `field-inventory.integration.test.ts` asserts generated type-vs-mapping parity
   for all in-scope families and fails on drift.
8. A schema/mapping fingerprint is recorded at
   `.agent/plans/semantic-search/active/evidence/phase-0-schema-mapping-fingerprint.json`
   and verified by tests so Phase 0 outputs fail fast if generated contracts
   change before implementation.
9. Inventory ownership is outside `apps/` so SDK and CLI consume the same contract without reverse imports.
10. If `packages/libs/search-contracts/` does not exist, this task creates and
   registers it before running inventory tests.

Deterministic validation (after package creation in this task):

```bash
pnpm vitest run packages/libs/search-contracts/src/field-inventory.integration.test.ts
pnpm type-check
```

#### Task 0.2: Define stage contract matrix per field group

Stages:

1. source extraction/adaptation
2. document builder mapping
3. bulk operation assembly
4. ingest dispatch/readback (integration boundary)
5. retrieval/query usage (where applicable)

Acceptance criteria (Given/When/Then + Evidence):

1. For each field group, expected behaviour is declared per stage:
   - required pass-through
   - computed transform
   - optional with source-precondition
2. Matrices explicitly mark fields that are not expected at certain stages.
3. Matrices are machine-checkable by tests (fixture-driven).
4. Two owner-specific matrices are maintained over one shared inventory:
   - ingest matrix (CLI-owned: extraction -> builder -> bulk -> ingest/readback),
   - retrieval matrix (SDK-owned: query/filter semantics).
5. Matrices explicitly declare producer/consumer file ownership per stage so test failures route to the right boundary:
   - extraction/adaptation (`apps/oak-search-cli/src/adapters/oak-adapter*`)
   - bulk transformation (`apps/oak-search-cli/src/adapters/bulk-*-transformer*`, `apps/oak-search-cli/src/adapters/bulk-rollup-builder*`, `apps/oak-search-cli/src/adapters/bulk-data-adapter*`)
   - document builders (`apps/oak-search-cli/src/lib/indexing/*document*`)
   - batch/bulk assembly (`apps/oak-search-cli/src/lib/index-batch-*`, `apps/oak-search-cli/src/lib/indexing/ingest-harness-*`)
   - retrieval query wiring (`packages/sdks/oak-search-sdk/src/retrieval/*`)

Deterministic validation:

```bash
pnpm vitest run apps/oak-search-cli/src/lib/indexing/stage-contract-matrix.integration.test.ts
pnpm type-check
```

#### Task 0.3: Create explicit field-integrity test manifest

Acceptance criteria (Given/When/Then + Evidence):

1. A manifest file lists every required field-integrity test path explicitly (no globs).
2. CI command executes from that manifest and fails if any listed file is missing.
3. Manifest groups tests by phase and stage.
4. Validation fails when the manifest is empty (`passWithNoTests` cannot mask missing coverage).
5. `test:field-integrity` uses a dedicated Vitest config with
   `passWithNoTests: false` (mandatory).
6. `test:field-integrity` is defined in root `package.json` and runs the manifest-listed tests as the single source of paths.
7. `test:field-integrity` fails with explicit diagnostics when any manifest path does not exist.
8. Skipped tests and forbidden test patterns are enforced by explicit ESLint
   test-file rules in workspace config (for example banning `it.skip`,
   `describe.skip`, and equivalent APIs), not by shell text scanning.
9. Skipped tests are prohibited: fix or delete them, never keep them skipped.
10. TDD evidence is explicit for this task:
    - RED: `pnpm test:field-integrity` fails because script/manifest do not yet exist.
    - GREEN: script + manifest are added and command succeeds.

Deterministic validation (created by this task):

```bash
pnpm test:field-integrity
pnpm lint:fix
```

---

### Phase 1: Stage-Level Integration Suites

**Goal**: Prove each stage handles all fields correctly within stage boundaries.
**TDD discipline**: For each task, write/extend tests first (RED), run and confirm failure, implement minimal changes (GREEN), then refactor while tests remain green.

#### Task 1.1: Extraction-stage integration tests (all index families)

Acceptance criteria (Given/When/Then + Evidence):

1. Source payload fixtures include representative values for all field groups.
2. Extraction outputs include expected values (or explicit undefined) per matrix.
3. Missing optional source data is handled deterministically with explicit expectations.
4. Optional-field expectations are sourced from the stage contract matrix and
   asserted in test output (not ad-hoc fixture comments).

Deterministic validation:

```bash
pnpm vitest run apps/oak-search-cli/src/adapters/extraction-field-integrity.integration.test.ts
pnpm type-check
pnpm lint:fix
```

#### Task 1.2: Document-builder integration tests (all index families)

Acceptance criteria (Given/When/Then + Evidence):

1. Builder input fixtures cover all field groups.
2. Builder output documents match expected field/value contracts for each index family.
3. Negative-path tests fail fast on contract violations.
4. Assertions are inventory/matrix-driven (not hand-written one-off checks).

Deterministic validation:

```bash
pnpm vitest run apps/oak-search-cli/src/lib/indexing/builder-field-integrity.integration.test.ts
pnpm type-check
pnpm lint:fix
```

#### Task 1.3: Bulk-operation assembly tests

Acceptance criteria (Given/When/Then + Evidence):

1. Bulk operation streams are validated for alternating action/document integrity.
2. Document payloads in operations preserve fields validated in prior stage tests.
3. Index routing (`_index`, `_id`) matches family contracts.
4. Validation fixtures/assertions are derived from canonical inventory/matrix.

Deterministic validation:

```bash
pnpm vitest run apps/oak-search-cli/src/lib/indexing/bulk-ops-field-integrity.integration.test.ts
pnpm type-check
pnpm lint:fix
```

---

### Phase 2: Cross-Stage Field Integrity

**Goal**: Prove end-to-end field integrity from source fixtures through ingestion to readback.
**TDD discipline**: Apply the same RED -> GREEN -> REFACTOR sequence as Phase 1.

#### Task 2.1: Cross-stage fixture ingestion integration suite

Acceptance criteria (Given/When/Then + Evidence):

1. Deterministic fixture set covers all field groups across all index families.
2. End-to-end run is in-process only and uses injected/mocked ES dependencies (no network IO).
3. End-to-end run produces indexed documents whose fields match stage matrix expectations.
4. Assertions cover both presence and expected null/undefined semantics.
5. Assertions are field- and semantics-specific (inventory/matrix keyed), not generic non-empty checks.
6. Test harness enforces serialization boundaries between write-side and read-side contracts (no shared mutable state shortcuts).

Deterministic validation:

```bash
pnpm vitest run apps/oak-search-cli/src/lib/indexing/cross-stage-field-integrity.integration.test.ts
```

#### Task 2.2: Retrieval-surface contract verification

Acceptance criteria (Given/When/Then + Evidence):

1. For filter/sort/suggest-relevant fields, query helpers and retrieval flows are asserted against the shared boundary-safe inventory source (never app-local fixtures).
2. Contract tests fail when a query references a field that is not allowed by
   the inventory + retrieval matrix + gap-ledger disposition for that stage.
3. Filter semantics for critical groups (relationships, categories, threads) are explicitly covered.
4. Query semantics are validated in CI against generated mapping artefacts (for example text-vs-keyword implications).
5. Retrieval integration tests remain in-process with injected dependencies (no network IO).
6. Unit tests are limited to pure query-helper behaviour (for example filter-clause construction from inventory contracts).
7. Mapping-semantics rationale is documented in
   `.agent/plans/semantic-search/active/evidence/task-2.2-retrieval-semantics.md`.

Deterministic validation:

```bash
pnpm vitest run packages/sdks/oak-search-sdk/src/retrieval/search-field-integrity.integration.test.ts
pnpm vitest run packages/sdks/oak-search-sdk/src/retrieval/search-field-integrity.unit.test.ts
```

#### Task 2.3: Readback validation (split by CI and operator evidence)

Acceptance criteria (CI integration tests, Given/When/Then + Evidence):

1. `readback-field-audit.integration.test.ts` is in-process only and uses injected/mock ES responses.
2. Checks are index-family aware and produce actionable diagnostics.
3. Readback checks fail with explicit diagnostics naming:
   - index family,
   - field,
   - expected semantics,
   - observed population metric.

Deterministic validation (CI):

```bash
pnpm vitest run apps/oak-search-cli/src/lib/indexing/readback-field-audit.integration.test.ts
```

Acceptance criteria (operator evidence, non-CI, Given/When/Then + Evidence):

1. Runtime readback commands validate population rates for fields expected to be populated.
2. Evidence output is machine-readable JSON and includes, per audited field:
   alias, resolved index/version, mapping presence/type, `exists_count`,
   `missing_count`, and attempt/timing metadata.
3. Readback timing accounts for refresh visibility before classifying population failures.
4. Live mapping checks are captured as operator evidence and reconciled with generated mapping expectations.
5. Operator readback commands are generated from the gap ledger (or updated in lockstep) when new blind fields are added.
6. Operator evidence includes numeric count values for each field-level readback; exit codes alone are insufficient for disposition.
7. For large ingests or longer refresh intervals, operator evidence extends retry
   windows with backoff beyond the default 6x5s policy before disposition.
8. If ES returns transient 503/429 during readback, operators treat this as
   load/backpressure and extend retry windows with backoff before disposition.
9. Lifecycle verification paths that do immediate post-ingest/post-promote counts
   must implement refresh-visibility handling in code (`refresh=wait_for` on
   writes, or bounded retry at verification boundary) before relying on operator
   readback evidence.
10. The operator readback command fails non-zero on unknown ledger fields,
    missing mappings, or unresolved aliases, with fail-fast diagnostics.
11. This task implements `apps/oak-search-cli/operations/ingestion/field-readback-audit.ts`
    and its in-process tests before the operator command is used as evidence.
12. Operator evidence JSON is written to
    `.agent/plans/semantic-search/active/evidence/task-2.3.evidence.json`.

Operator validation (non-CI, requires configured ES target):

```bash
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin validate-aliases
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin meta get
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin count
pnpm tsx apps/oak-search-cli/operations/ingestion/field-readback-audit.ts \
  --ledger .agent/plans/semantic-search/active/field-gap-ledger.json \
  --attempts 6 \
  --interval-ms 5000 \
  --emit-json
# `oak_lessons`/`oak_sequences` are alias names; resolve current versioned targets
# from `validate-aliases` output before interpreting evidence.
# `field-readback-audit.ts` is created and tested within Task 2.3 before this
# operator command is used as evidence.
# Readback disposition must use numeric evidence emitted by the audit command and
# the gap-ledger semantics (`must_be_populated` vs `expected_empty_with_precondition`).
```

---

### Phase 3: Hardening, Gates, and Documentation

#### Task 3.1: Full quality gates and reviewer pass

Acceptance criteria (Given/When/Then + Evidence):

1. All required gates pass without bypasses.
2. Required reviewer findings are resolved or explicitly owner-triaged using
   statuses `resolved`, `accepted-risk`, or `rejected-finding` by the lane
   owner (repository maintainer), and each disposition has a written rationale
   linked in the active findings register.
3. Reviewer cycle is completed for:
   - `architecture-reviewer-barney`
   - `docs-adr-reviewer`
   - `test-reviewer`
   - `elasticsearch-reviewer`
4. All reviewer suggestions are implemented by default; any rejection includes
   explicit written rationale plus counter-evidence.
5. No skipped tests or forbidden test patterns are allowed, enforced through lint rules in CI/local gates.

Deterministic validation:

```bash
pnpm check
pnpm lint:fix
```

#### Task 3.2: Documentation propagation

Acceptance criteria (Given/When/Then + Evidence):

1. Active findings register references the latest field-integrity evidence pack
   for each active finding (`F1`, `F2`) with explicit status and evidence path.
2. Prompt and lane indexes point to authoritative plan/evidence locations.
3. No stale or contradictory status statements remain across prompt, plan, and
   findings register after the update pass.

Deterministic validation:

```bash
pnpm markdownlint:root
```

---

## Testing Strategy

### Integration-first architecture (primary)

Primary deliverable is integration coverage proving stage contracts and cross-stage behaviour.

### Unit support tests (secondary)

Unit tests are added only where needed to isolate deterministic helper logic used by integration fixtures/matrix handling.

### E2E/runtime validation

Runtime checks remain focused on field population and contract evidence, not broad UI/system behaviour.
Operator commands (`admin validate-aliases`, `admin count`) are evidence steps, not CI integration tests.

---

## Success Criteria

### Phase 0

- ✅ Canonical all-field inventory exists and is generated from source-of-truth artefacts.
- ✅ Stage contract matrix is complete for all index families.

### Phase 1

- ✅ Stage-level integration suites prove all field groups are handled correctly.

### Phase 2

- ✅ End-to-end suite proves field integrity across stages for all index families.
- ✅ Retrieval contract tests prevent silent field-use regressions.

### Phase 3

- ✅ `pnpm check` passes with no bypasses.
- ✅ Reviewer cycle (`architecture-reviewer-barney`, `docs-adr-reviewer`, `test-reviewer`, `elasticsearch-reviewer`) has no unhandled findings.
- ✅ Prompt/plan/findings register are coherent and cross-linked.

### Overall

- ✅ “All fields, all stages” is test-enforced rather than assumption-based.
- ✅ Future regressions in field population fail deterministically in CI before deploy.
- ✅ A pre-ingest readiness certificate is produced: no field remains in `unknown` for in-scope families.

---

## Operational Readiness Checklist

Complete this checklist before starting implementation or ingest activity.
This is the single pre-op authority for operationalising this plan.

1. Scope lock is confirmed:
   - execution scope is limited to comprehensive field-integrity testing and
     active findings `F1`/`F2`;
   - no unrelated roadmap expansion is introduced.
2. Phase 0 bootstrap tasks are explicitly scheduled as first execution items:
   - create/register `packages/libs/search-contracts/` (if absent);
   - create `.agent/plans/semantic-search/active/field-gap-ledger.json`;
   - add root `test:field-integrity` script + manifest enforcement.
3. Validation tool ownership is explicitly enforced:
   - behavioural validation via tests;
   - type correctness via `pnpm type-check`;
   - coding standards/forbidden patterns via `pnpm lint:fix`;
   - formatting/markdown via `pnpm format:root` and `pnpm markdownlint:root`;
   - no ad-hoc shell text scanning for quality decisions.
4. Refresh-visibility handling is planned as an early implementation task for
   lifecycle verification paths (not deferred to late hardening).
5. Operator evidence command contract is agreed for
   `apps/oak-search-cli/operations/ingestion/field-readback-audit.ts`,
   including required output fields:
   - alias + resolved index/version;
   - mapping presence/type;
   - `exists_count` and `missing_count`;
   - attempt/timing metadata;
   - non-zero exit on unknown ledger fields or mapping/alias failures.
6. Operator environment and privileges are confirmed before first live run:
   - required environment variables are present;
   - ES permissions support admin/readback commands used in this lane.
7. Reviewer go/no-go is agreed for planning readiness:
   - `architecture-reviewer-barney`
   - `docs-adr-reviewer`
   - `test-reviewer`
   - `elasticsearch-reviewer`
8. Stop/go policy is acknowledged by owner and operator:
   - no ingest commands are run until the **Pre-Ingest Readiness Gate** in this
     document is fully green.

Operationalisation go/no-go rule:

- **Go** only when all checklist items above are complete and evidenced in the
  active findings register and linked plan updates.
- **No-go** if any item is incomplete, ambiguous, or lacks deterministic evidence.

---

## Pre-Ingest Readiness Gate (Mandatory Stop/Go)

No new ingest command may be run until all conditions are true:

1. Inventory + stage matrix + manifest exist and are green.
2. `unknown` field statuses are reduced to zero for in-scope families.
3. Every `must_be_populated` field has deterministic assertions at:
   - extraction
   - builder
   - bulk assembly
   - readback.
4. Reviewer cycle (`architecture-reviewer-barney`, `docs-adr-reviewer`, `test-reviewer`, `elasticsearch-reviewer`) is complete with no unhandled findings.
5. Active findings register links the latest evidence pack and statuses for `F1`/`F2`.
6. Every `expected_empty_with_precondition` field has explicit precondition
   evidence and sampled readback proof with numeric counts.
7. Filterable fields have mapping-aligned semantics documented and tested:
   - exact-match string filters require keyword-backed (or otherwise non-analysed structured) fields;
   - analysed text matching is permitted only when explicitly documented as phrase semantics.
   - when a filterable field is analysed text, disposition must be explicit before ingest: add keyword-backed exact surface, or declare phrase-only semantics with regression tests.
   - documented semantics must live in retrieval matrix artefacts and findings
     evidence notes, with matching regression tests.
8. Post-ingest evidence captures include refresh-visibility handling before readback conclusions.
9. Lifecycle verification code paths include refresh-visibility handling so
   post-ingest/post-promote verification does not fail on refresh timing alone.

---

## Risks and Mitigations

1. **Risk**: Inventory drift from generated contracts.  
   **Mitigation**: Build inventory directly from generated artefacts; fail tests on drift.
2. **Risk**: Overly brittle assertions for optional fields.  
   **Mitigation**: Encode source-precondition rules in stage matrix.
3. **Risk**: High test runtime.  
   **Mitigation**: Shared fixtures and matrix-driven parametrised suites.
4. **Risk**: False confidence from isolated tests only.  
   **Mitigation**: Mandatory cross-stage and readback evidence tasks.
5. **Risk**: Filter semantics mismatch against mapping type (for example exact-filter expectations over `text` fields).  
   **Mitigation**: explicit retrieval-stage mapping-aware tests and documented semantics decisions.

---

## Foundation Alignment

This plan explicitly aligns with:

- [`principles.md`](../../../directives/principles.md) (simplicity, fail-fast, no shortcuts)
- [`testing-strategy.md`](../../../directives/testing-strategy.md) (TDD, behaviour-first, integration semantics)
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md) (generated contracts as source of truth)

Before each phase: re-read these directives and verify no compatibility layers, no disabled checks, and no type shortcuts are introduced.

---

## References

- [`principles.md`](../../../directives/principles.md)
- [`testing-strategy.md`](../../../directives/testing-strategy.md)
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md)
- [`search-tool-prod-validation-findings-2026-03-15.md`](./search-tool-prod-validation-findings-2026-03-15.md)
- [`ADR-117`](../../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md)
