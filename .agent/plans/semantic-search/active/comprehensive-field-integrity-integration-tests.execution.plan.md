---
name: "Comprehensive Field Integrity Integration Tests"
overview: "Design and implement comprehensive integration tests proving all search index fields are correctly handled within each pipeline stage and end-to-end across stages."
todos:
  - id: phase-0-foundation
    content: "Phase 0: Build canonical all-field inventory and stage-contract matrix from generated schemas and mappings."
    status: in_progress
  - id: phase-1-stage-tests
    content: "Phase 1: Implement stage-level integration suites proving per-field handling at extraction, document-build, and bulk-operation assembly stages."
    status: pending
  - id: phase-2-end-to-end-tests
    content: "Phase 2: Implement cross-stage integration suites proving end-to-end field integrity from source payloads to indexed documents."
    status: pending
  - id: phase-3-hardening
    content: "Phase 3: Run full quality gates, specialist reviews, and documentation propagation with deterministic evidence."
    status: pending
---

# Comprehensive Field Integrity Integration Tests

**Last Updated**: 2026-03-15  
**Status**: 🟡 PLANNING  
**Scope**: Prove, via comprehensive integration tests, that all fields for all semantic-search index families are correctly handled at each pipeline stage and across the pipeline end-to-end.

---

## Context

Recent production validation showed that mapping presence alone is insufficient: fields can exist in mappings while being unpopulated in indexed documents. We need a comprehensive, deterministic test architecture that validates all fields at all stages, not only the currently failing fields.

### Issue 1: Field population gaps can survive local fixes

Evidence from live cluster checks and production retest:

- `thread_slugs` exists in lesson mapping but is fully null in indexed lesson docs.
- `category_titles` exists in sequence mapping but is fully null in indexed sequence docs.
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

From `@.agent/directives/principles.md` and `@.agent/directives/testing-strategy.md`:

- Test behaviour, not implementation internals.
- TDD at all levels.
- Fail fast with explicit diagnostics.
- Types and contracts flow from generated schema artefacts.

### Key Insight

Treat field integrity as an explicit pipeline contract:

1. Canonical inventory (what fields must exist per index family),
2. Stage contract matrix (what each stage must preserve/transform),
3. Deterministic tests that assert both local stage behaviour and end-to-end outcomes.

This keeps complexity manageable by standardising assertions instead of hand-curating one-off checks per bug.

### Non-Goals

- ❌ Re-architecting the ingestion pipeline in this plan.
- ❌ Adding compatibility layers or fallback dynamic-mapping behaviours.
- ❌ Expanding scope beyond semantic-search index families used by Oak search.

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

---

## Quality Gate Strategy

Why not workspace filters:

- Search pipeline contracts cross `apps/oak-search-cli`, generated SDK artefacts, and retrieval SDK behaviour.
- Partial filtering risks false confidence by missing cross-workspace regressions.

After each substantive task:

```bash
pnpm type-check
pnpm lint
pnpm test
```

After each phase:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
```

Final full gate before completion:

```bash
pnpm secrets:scan:all
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Resolution Plan

### Phase 0: Canonical Inventory and Stage Contracts

**Goal**: Produce an authoritative all-field inventory and a stage contract matrix per index family.

#### Task 0.1: Build canonical field inventory from generated artefacts

Acceptance criteria:

1. Inventory is derived from generated sources (not manually authored lists).
2. Every index family in scope has an explicit field list.
3. Each field is tagged with group (`identity_and_routing`, etc.).
4. Inventory is committed as test fixture/support artefact for reuse.

Deterministic validation:

```bash
pnpm test "apps/oak-search-cli/src/**/field-inventory*.integration.test.ts"
pnpm type-check
```

#### Task 0.2: Define stage contract matrix per field group

Stages:

1. source extraction/adaptation
2. document builder mapping
3. bulk operation assembly
4. ingest dispatch/readback (integration boundary)
5. retrieval/query usage (where applicable)

Acceptance criteria:

1. For each field group, expected behaviour is declared per stage:
   - required pass-through
   - computed transform
   - optional with source-precondition
2. Matrix explicitly marks fields that are not expected at certain stages.
3. Matrix is machine-checkable by tests (fixture-driven).

Deterministic validation:

```bash
pnpm test "apps/oak-search-cli/src/**/stage-contract-matrix*.integration.test.ts"
pnpm type-check
```

---

### Phase 1: Stage-Level Integration Suites

**Goal**: Prove each stage handles all fields correctly within stage boundaries.

#### Task 1.1: Extraction-stage integration tests (all index families)

Acceptance criteria:

1. Source payload fixtures include representative values for all field groups.
2. Extraction outputs include expected values (or explicit undefined) per matrix.
3. Missing optional source data is handled deterministically with explicit expectations.

Deterministic validation:

```bash
pnpm test "apps/oak-search-cli/src/**/extraction-field-integrity*.integration.test.ts"
```

#### Task 1.2: Document-builder integration tests (all index families)

Acceptance criteria:

1. Builder input fixtures cover all field groups.
2. Builder output documents match expected field/value contracts for each index family.
3. Negative-path tests fail fast on contract violations.

Deterministic validation:

```bash
pnpm test "apps/oak-search-cli/src/**/builder-field-integrity*.integration.test.ts"
```

#### Task 1.3: Bulk-operation assembly tests

Acceptance criteria:

1. Bulk operation streams are validated for alternating action/document integrity.
2. Document payloads in operations preserve fields validated in prior stage tests.
3. Index routing (`_index`, `_id`) matches family contracts.

Deterministic validation:

```bash
pnpm test "apps/oak-search-cli/src/**/bulk-ops-field-integrity*.integration.test.ts"
```

---

### Phase 2: Cross-Stage End-to-End Field Integrity

**Goal**: Prove end-to-end field integrity from source fixtures through ingestion to readback.

#### Task 2.1: End-to-end fixture ingestion integration suite

Acceptance criteria:

1. Deterministic fixture set covers all field groups across all index families.
2. End-to-end run produces indexed documents whose fields match stage matrix expectations.
3. Assertions cover both presence and expected null/undefined semantics.

Deterministic validation:

```bash
pnpm test "apps/oak-search-cli/src/**/e2e-field-integrity*.integration.test.ts"
```

#### Task 2.2: Retrieval-surface contract verification

Acceptance criteria:

1. For filter/sort/suggest-relevant fields, query helpers and retrieval flows are asserted against the same inventory.
2. Contract tests fail when a query references an unpopulated or unmapped field unexpectedly.
3. Filter semantics for critical groups (relationships, categories, threads) are explicitly covered.

Deterministic validation:

```bash
pnpm test "packages/sdks/oak-search-sdk/src/retrieval/*field-integrity*.integration.test.ts"
pnpm test "packages/sdks/oak-search-sdk/src/retrieval/*field-integrity*.unit.test.ts"
```

#### Task 2.3: Runtime readback smoke checks against staged indexes

Acceptance criteria:

1. Readback scripts/checks validate non-null rates for fields expected to be populated.
2. Checks are index-family aware and produce actionable diagnostics.
3. Evidence format is suitable for active findings register linkage.

Deterministic validation:

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts admin count
pnpm test "apps/oak-search-cli/src/**/readback-field-audit*.integration.test.ts"
```

---

### Phase 3: Hardening, Gates, and Documentation

#### Task 3.1: Full quality gates and reviewer pass

Acceptance criteria:

1. All required gates pass without bypasses.
2. Required reviewer findings are resolved or explicitly owner-triaged.

Deterministic validation:

```bash
pnpm check
```

#### Task 3.2: Documentation propagation

Acceptance criteria:

1. Active findings register references field-integrity evidence where relevant.
2. Prompt and lane indexes point to authoritative plan/evidence locations.
3. No stale or contradictory status statements remain.

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

### Overall

- ✅ “All fields, all stages” is test-enforced rather than assumption-based.
- ✅ Future regressions in field population fail deterministically in CI before deploy.

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

---

## Foundation Alignment

This plan explicitly aligns with:

- `@.agent/directives/principles.md` (simplicity, fail-fast, no shortcuts)
- `@.agent/directives/testing-strategy.md` (TDD, behaviour-first, integration semantics)
- `@.agent/directives/schema-first-execution.md` (generated contracts as source of truth)

Before each phase: re-read these directives and verify no compatibility layers, no disabled checks, and no type shortcuts are introduced.

---

## References

- `@.agent/directives/principles.md`
- `@.agent/directives/testing-strategy.md`
- `@.agent/directives/schema-first-execution.md`
- `@.agent/plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md`
- `@docs/architecture/architectural-decisions/117-plan-templates-and-components.md`
