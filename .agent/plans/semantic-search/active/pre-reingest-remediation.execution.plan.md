---
name: "Pre-Reingest Remediation"
overview: >
  Resolve all known code issues before re-indexing: populate sequence_semantic
  per ADR-139, restore SDK-owned 2-way RRF for sequences, collapse CLI
  duplicate retriever, add lessons threadSlug field-integrity test, and
  document optional prod smoke. TDD throughout, full gates and reviews at end.
todos:
  - id: phase-1-red-seq-semantic
    content: "Write failing tests for deterministic sequence_semantic construction, fail-fast validation, and builder contract."
    status: pending
  - id: phase-1-red-retrieval
    content: "Write failing test for SDK 2-way RRF sequence retrieval shape (BM25 + semantic on sequence_semantic)."
    status: pending
  - id: phase-1-red-threadslug
    content: "Write failing lessons threadSlug field-integrity test mirroring sequence category contract."
    status: pending
  - id: phase-2-green-seq-semantic
    content: "Implement generateSequenceSemanticSummary and wire through builder, transformer, and ingestion pipeline."
    status: pending
  - id: phase-2-green-retrieval
    content: "Upgrade buildSequenceRetriever to 2-way RRF and update search-sequences.ts."
    status: pending
  - id: phase-3-refactor
    content: "Collapse CLI duplicate sequence retriever to SDK adapter, update docs and architecture."
    status: pending
  - id: prod-smoke-doc
    content: "Add optional prod smoke procedure to INDEXING.md (canonical home), wire optional package script."
    status: pending
  - id: phase-4-gates-reviews
    content: "Full quality gates + architecture reviewers (barney/betty/fred/wilma) + elasticsearch reviewer + test reviewer + code reviewer."
    status: pending
---

# Pre-Reingest Remediation

**Status**: ACTIVE
**Scope**: Resolve all known code and documentation issues before re-indexing.
**Branch**: `feat/es_index_update`

## Why This Plan Exists

Re-indexing is an expensive operational step. It must not be wasted on code
that is known to be incomplete. Five issues are currently outstanding; all
must be fixed, tested, and reviewed before the operator runs `admin stage`.

## Issue Inventory

| ID | Issue | Root Cause | Fix |
|----|-------|-----------|-----|
| S1 | `sequence_semantic` not populated | `createSequenceDocument` does not set it; test asserts `undefined` | Implement per ADR-139 |
| S2 | Sequence retrieval is lexical-only | `buildSequenceRetriever` returns plain `standard` retriever | Upgrade to 2-way RRF |
| S3 | Legacy CLI duplicate sequence retriever | `createSequenceRetriever` in `rrf-query-builders.ts` wraps single BM25 in one-child RRF | Collapse to SDK adapter |
| S4 | Missing lessons `threadSlug` field-integrity test | No test pins `threadSlug` -> `term(thread_slugs)` to `SEARCH_FIELD_INVENTORY` | Add mirroring sequence category pattern |
| S5 | No documented prod smoke procedure | Operators have no repeatable way to validate search post-promote | Add to `INDEXING.md` |

## Authority

- [ADR-139](../../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md) is the permanent contract for S1/S2/S3
- [sequence-retrieval-architecture-followup.plan.md](../current/sequence-retrieval-architecture-followup.plan.md) carries execution detail (locked recipe)
- [search-contract-followup.plan.md](../current/search-contract-followup.plan.md) specifies S4/S5

---

## Phase 1: Test Specification (RED)

Write failing tests first. No implementation code until all RED tests exist.

**Scope clarification**: S5 (prod smoke docs) is documentation, not code — it
has no RED phase and is handled in Phase 3. If RED tests require a new type on
a params interface (e.g. adding `sequenceSemantic: string` to
`CreateSequenceDocumentParams`), adding that type signature is making the test
expressible, not implementation — the test should still fail because nothing
populates the value yet.

### Task 1.1: Sequence semantic construction tests

**File**: `apps/oak-search-cli/src/lib/indexing/semantic-summary-generator.unit.test.ts`

Add `describe('generateSequenceSemanticSummary')` with:

1. **Deterministic construction**: Given ordered unit summaries and sequence
   metadata, output starts with a context line naming title, subject, phase,
   years, and key stages, followed by per-unit summaries separated by double
   newlines.
2. **Reuses `generateUnitSemanticSummary`**: Per-unit text matches the output
   of `generateUnitSemanticSummary(summary, keyStageTitle, subjectTitle)`.
3. **Preserves unit ordering**: Output segments appear in the same order as
   the input unit slug list.

**File**: `apps/oak-search-cli/src/lib/indexing/sequence-document-builder.unit.test.ts`

4. **Builder sets `sequence_semantic`**: Flip existing test from
   `expect(doc.sequence_semantic).toBeUndefined()` to
   `expect(doc.sequence_semantic).toBeDefined()` and assert non-empty string.
5. **Fail-fast: zero units**: Calling `createSequenceDocument` with empty
   `unitSlugs` and no `sequenceSemantic` throws.
6. **Fail-fast: empty semantic output**: Calling with a whitespace-only
   `sequenceSemantic` throws.

### Task 1.2: SDK 2-way RRF retrieval shape test

**File**: `packages/sdks/oak-search-sdk/src/retrieval/search-sequences.integration.test.ts`

7. **Flip from "not RRF" to "uses RRF"**: Change the existing test
   `'uses a plain lexical retriever for sequences'` to assert `rrf` is present
   with exactly two retrievers: one BM25 `multi_match` and one
   `semantic: { field: 'sequence_semantic' }`. Assert `rank_constant: 40`,
   `rank_window_size: 40`.
8. **Both retrievers share the same filter**: When filters are provided, both
   RRF sub-retrievers carry the identical filter clause.

### Task 1.3: Lessons `threadSlug` field-integrity test

**File**: `packages/sdks/oak-search-sdk/src/retrieval/search-field-integrity.integration.test.ts`

9. **`threadSlug` aligns with inventory**: Call `searchLessons` (via mock
   search) with `threadSlug: 'number-fractions'`, inspect the captured request,
   assert `{ term: { thread_slugs: 'number-fractions' } }` appears in the
   filter, and assert `SEARCH_FIELD_INVENTORY` has
   `{ indexFamily: 'lessons', fieldName: 'thread_slugs', mappingType: 'keyword' }`.

### Coverage notes (locked recipe alignment)

The locked execution recipe (sequence-retrieval-architecture-followup.plan.md
Phase 1) lists six coverage buckets. Tasks 1–9 above cover buckets 1–4
directly. The remaining two are covered structurally:

- **CLI/SDK parity (bucket 5)**: Phase 3 Task 3.1 collapses the CLI duplicate
  retriever to an SDK adapter. After collapse, parity is structural — there
  is only one implementation. A dedicated anti-drift test is unnecessary once
  the duplicate code path is removed.
- **Schema/mapping assertions (bucket 6)**: Task 1.1 items 4–6 prove that
  produced documents set `sequence_semantic` as non-empty and throw on
  violations. The generated schema already declares the field; `pnpm type-check`
  verifies alignment between produced documents and generated types. A separate
  "schema declares it required" test would test the code generator, which is
  out of scope.

---

## Phase 2: Implementation (GREEN)

Make the RED tests pass with the smallest correct implementation.

### Task 2.1: `generateSequenceSemanticSummary`

**File**: `apps/oak-search-cli/src/lib/indexing/semantic-summary-generator.ts`

Add:

```typescript
export function generateSequenceSemanticSummary(
  params: GenerateSequenceSemanticParams,
): string
```

Where `GenerateSequenceSemanticParams` contains:

- `sequenceTitle: string`
- `subjectTitle: string`
- `phaseTitle: string`
- `years: readonly string[]`
- `keyStages: readonly string[]`
- `orderedUnitSummaries: readonly { summary: SearchUnitSummary; keyStageTitle: string; subjectTitle: string }[]`

Implementation (per ADR-139 locked recipe):

1. Fail fast if `orderedUnitSummaries` is empty.
2. Build context line: `"{sequenceTitle} is a {subjectTitle} {phaseTitle} curriculum sequence covering {keyStages joined} ({years joined})."`.
3. For each unit summary, call `generateUnitSemanticSummary(summary, keyStageTitle, subjectTitle)`.
4. Fail fast if any unit semantic normalises to empty after trimming.
5. Join: context line + double-newline + unit semantics joined with double newlines.
6. Fail fast if final result normalises to empty after trimming.

### Task 2.2: Wire through builder and transformer

**File**: `apps/oak-search-cli/src/lib/indexing/sequence-document-builder.ts`

- Add `sequenceSemantic: string` to `CreateSequenceDocumentParams`.
- Add validation: throw if `sequenceSemantic.trim().length === 0`.
- Set `sequence_semantic: params.sequenceSemantic` in the returned document.

**File**: `apps/oak-search-cli/src/adapters/bulk-sequence-transformer.ts`

In `extractSequenceParamsFromBulkFile`:

- Import `transformBulkUnitToSummary` from `bulk-rollup-builder.ts`.
- Import `generateSequenceSemanticSummary` from `semantic-summary-generator.ts`.
- For each unit in `bulkFile.sequence`, call `transformBulkUnitToSummary(unit, subjectSlug, unit.keyStageSlug, bulkFile.sequenceSlug)` to get `SearchUnitSummary`.
- Look up key stage title via `findKeyStageTitle(unit.keyStageSlug, bulkFile.lessons)`.
- Call `generateSequenceSemanticSummary(...)` with the ordered summaries.
- Add `sequenceSemantic` to the returned params.

**Ordering authority**: The locked recipe (ADR-139 §3.1) specifies deriving
ordered unit slugs from the sequence-units payload. Ingestion always uses bulk
data; `bulkFile.sequence` provides units in sequence order and is the ordering
authority. Task 1.1 item 3 (preserves unit ordering) tests that the generator
respects input order.

### Task 2.3: SDK 2-way RRF for sequences

**File**: `packages/sdks/oak-search-sdk/src/retrieval/retrieval-search-helpers.ts`

Upgrade `buildSequenceRetriever` to match `buildThreadRetriever` pattern:

```typescript
export function buildSequenceRetriever(
  query: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    rrf: {
      retrievers: [
        {
          standard: {
            query: {
              multi_match: {
                query,
                type: 'best_fields',
                fuzziness: 'AUTO',
                fields: ['sequence_title^2', 'category_titles', 'subject_title', 'phase_title'],
              },
            },
            filter,
          },
        },
        { standard: { query: { semantic: { field: 'sequence_semantic', query } }, filter } },
      ],
      rank_window_size: 40,
      rank_constant: 40,
    },
  };
}
```

**File**: `packages/sdks/oak-search-sdk/src/retrieval/search-sequences.ts`

No structural change needed — `searchSequences` already passes the retriever
result directly to ES. The RRF change is transparent.

---

## Phase 3: Refactor and Cleanup

### Task 3.1: Collapse CLI duplicate sequence retriever

**File**: `apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts`

`createSequenceRetriever` (lines ~254-280) wraps a single BM25 retriever in
a one-child RRF envelope. Now that the SDK owns 2-way RRF:

- Remove `createSequenceRetriever` and `buildSequenceRrfRequest`.
- Have `runSequencesSearch` in `apps/oak-search-cli/src/lib/hybrid-search/sequences.ts`
  delegate to the SDK `searchSequences` path, or call `buildSequenceRetriever`
  from the SDK directly.
- Update any CLI tests that assert the old one-child RRF shape.

### Task 3.2: Documentation updates

**File**: `apps/oak-search-cli/docs/ARCHITECTURE.md`

- Update the RRF table: sequences now use 2-way RRF (BM25 + semantic on
  `sequence_semantic`), same as threads.
- Remove the "harness-only artifact" paragraph added during review closeout.

**File**: `apps/oak-search-cli/docs/INDEXING.md`

- Add *Optional production search smoke* section (canonical home per
  `search-contract-followup.plan.md`):
  - Prerequisites (prod MCP or ES credentials).
  - Query matrix: F1/F2 reproduction JSON, one baseline per scope.
  - Interpretation: SDK `total` reflects page length, not `hits.total`.
  - Explicit exclusion: not part of `pnpm test` or default CI.

**File**: `.agent/research/elasticsearch/methods/hybrid-retrieval.md`

- Update Oak Integration Notes: sequences now use SDK-owned 2-way RRF.
  Remove "harness-only artifact" wording.

### Task 3.3: Update field-gap ledger

**File**: `.agent/plans/semantic-search/archive/completed/field-gap-ledger.json`

Add a `sequence_semantic` entry:

```json
{
  "indexFamily": "sequences",
  "fieldName": "sequence_semantic",
  "stage": "ingest_dispatch_readback",
  "status": "must_be_populated",
  "findingRefs": ["S1"],
  "notes": "ADR-139: sequence_semantic required in produced documents"
}
```

---

## Phase 4: Quality Gates and Reviews

### Gates (full suite, restart-on-fix discipline)

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

### Required reviewer passes

| Reviewer | Scope |
|----------|-------|
| `code-reviewer` | All code changes |
| `test-reviewer` | TDD compliance, test quality |
| `architecture-reviewer-barney` | Boundary and dependency mapping |
| `architecture-reviewer-betty` | Cohesion and coupling |
| `architecture-reviewer-fred` | ADR compliance |
| `architecture-reviewer-wilma` | Resilience and failure modes |
| `elasticsearch-reviewer` | Mapping, query, retriever changes |
| `type-reviewer` | If type changes expand |
| `docs-adr-reviewer` | ADR-139 alignment, doc updates |

---

## Completion Criteria

All of the following must be true before `admin stage` is run:

1. All RED tests from Phase 1 pass green.
2. `sequence_semantic` is populated for every sequence during bulk ingestion.
3. Fail-fast validation throws on zero units, missing summaries, or empty output.
4. SDK `buildSequenceRetriever` returns 2-way RRF with `sequence_semantic`.
5. CLI legacy sequence retriever is collapsed or delegates to SDK.
6. Lessons `threadSlug` field-integrity test exists and passes.
7. Optional prod smoke documented in `INDEXING.md`.
8. Full quality gates green.
9. All required reviewer passes complete with no blocking findings.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-139](../../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md) | Permanent contract for sequence_semantic |
| [f2-closure-and-p0-ingestion.execution.plan.md](./f2-closure-and-p0-ingestion.execution.plan.md) | Active P0 lane (blocked until this remediation completes) |
| [sequence-retrieval-architecture-followup.plan.md](../current/sequence-retrieval-architecture-followup.plan.md) | Locked execution recipe (Phase 0 done, Phases 1-4 now in this plan) |
| [search-contract-followup.plan.md](../current/search-contract-followup.plan.md) | S4/S5 source (threadSlug test + prod smoke) |
| [search-tool-prod-validation-findings-2026-03-15.md](./search-tool-prod-validation-findings-2026-03-15.md) | F1/F2 findings register |
