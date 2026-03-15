---
name: "Bulk Metadata Quick Wins"
overview: "Capture low-risk value from existing bulk curriculum signals by wiring already-available extractors and preserving structured lesson and unit metadata for downstream mining and retrieval work."
source_research:
  - "../curriculum-asset-opportunity-map.research.md"
  - "../future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md"
  - "../future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md"
todos:
  - id: phase-0-scope-lock
    content: "Phase 0: Lock the exact quick-win field set, confirm stop-lines against P2/P3, and record the first coding slice."
    status: pending
  - id: phase-1-red
    content: "Phase 1 (RED): Add failing unit and integration tests for widened bulk extracted-data outputs and preserved structured metadata."
    status: pending
  - id: phase-2-green
    content: "Phase 2 (GREEN): Wire existing orphan extractors and preserve selected structured lesson/unit fields in the bulk mining flow."
    status: pending
  - id: phase-3-refactor
    content: "Phase 3 (REFACTOR): Simplify result shapes, remove duplication, and align docs/TSDoc with the widened asset surface."
    status: pending
  - id: phase-4-gates-review
    content: "Phase 4: Run the full quality gate chain, invoke specialist reviewers, and propagate settled outcomes to queue and roadmap docs."
    status: pending
---

# Bulk Metadata Quick Wins

**Last Updated**: 2026-03-07
**Status**: 🟢 ACTIVE
**Source Boundary**: 03 — Vocabulary and Semantic Assets
**Scope**: Low-risk widening of the bulk metadata surface using fields and extractors that already exist in the codebase but are not yet fully wired into `processBulkData()` or preserved for downstream use.

---

## Why This Is Active Now

This plan has been promoted into `active/` by direct user priority.

Important sequencing context:

- `m2-public-alpha-auth-rate-limits.execution.plan.md` remains the Milestone 2
  blocker in `current/`
- this plan does **not** replace or close that blocker
- this plan can progress without waiting for wider public-release readiness
- promotion here means "this is the semantic-search plan to execute next in this
  workstream", not "Milestone 2 is complete"

---

## Standalone Session Entry

Use this section to start a fresh session from this plan alone.

### Re-ground

Read:

1. `.agent/directives/AGENT.md`
2. `.agent/directives/principles.md`
3. `.agent/directives/testing-strategy.md`
4. `.agent/directives/schema-first-execution.md`
5. `.agent/plans/semantic-search/research-index.md`
6. `.agent/plans/semantic-search/curriculum-asset-opportunity-map.research.md`
7. `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md`
8. `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md`

### Verify Current State

Run:

```bash
git status --short
git branch --show-current
ls -1 .agent/plans/semantic-search/active
```

Then read:

1. `.agent/plans/semantic-search/active/README.md`
2. `.agent/plans/semantic-search/current/README.md`
3. `.agent/plans/semantic-search/roadmap.md`

### Read These Code Paths First

The first coding session should confirm the current behaviour in:

1. `packages/sdks/oak-sdk-codegen/src/bulk/processing.ts`
2. `packages/sdks/oak-sdk-codegen/src/bulk/extractors/`
3. `apps/oak-search-cli/src/adapters/bulk-lesson-transformer.ts`
4. `apps/oak-search-cli/src/adapters/bulk-unit-transformer.ts`
5. any result types or adapter contracts touched by widened bulk outputs

### First Session Goal

Do **Phase 0 only first**:

1. lock the exact quick-win field set
2. confirm the stop line against P2 and P3
3. decide the first failing tests to write

Do not start inventing glossary, retrieval-routing, or graph surfaces in the
first implementation slice.

---

## Problem

The bulk-download pipeline already has richer curriculum signals than the active
mining surface exposes.

Current evidence from the research pack shows:

1. `processBulkData()` publishes only a subset of the extractors that already
   exist in `@oaknational/sdk-codegen/bulk`
2. structured lesson signals such as keyword definitions, misconception
   responses, and detailed content guidance are still flattened or dropped in
   the current hand-off surfaces
3. unit sequencing and pedagogical context exist in bulk data but are not yet
   consistently promoted into reusable asset outputs

This is the clearest quick-win stream because it reuses existing schema-aware
code and does not require new retrieval policy, new query routing, or new
high-risk LLM steps.

---

## Desired Outcome

At the end of this plan:

- the bulk mining pipeline exposes a broader, schema-aligned extracted-data
  surface
- selected structured lesson and unit metadata survives in reusable forms rather
  than being reduced immediately to flat strings
- downstream work on glossary assets, thread/sequence enrichment, and learning
  graph surfaces can build on canonical outputs instead of re-mining ad hoc

---

## Scope Lock Decisions

Phase 0 must explicitly answer:

1. Which fields are in scope for the first quick-win slice?
2. Which of those are pure wiring/preservation changes versus changes needing
   new types or contracts?
3. Which result shape will act as the canonical widened hand-off surface?
4. Which tests prove value without overcommitting the later asset model?

Stop lines:

- P1 preserves raw structured data
- P2 owns canonical keyword-definition identity, deduplication, provenance, and
  dedicated definition-asset surfaces
- P3 consumes widened upstream signals for thread/sequence retrieval surfaces

If a candidate item requires materially new extractor logic or a new
cross-boundary consumer contract, defer it.

---

## Candidate Quick-Win Outputs

The highest-confidence additions for this plan are:

- keyword definitions as preserved raw structured data
- misconception responses
- richer content-guidance detail
- pupil outcomes
- transcript-availability or transcript-format metadata
- unit lesson ordering metadata

This list is intentionally narrower than the full research pack.

---

## Key Files And Likely Edit Surfaces

Start with these:

1. `packages/sdks/oak-sdk-codegen/src/bulk/processing.ts`
2. `packages/sdks/oak-sdk-codegen/src/bulk/extractors/`
3. bulk-facing adapter/result types that expose extracted-data outputs

Potential downstream verification surfaces:

1. `apps/oak-search-cli/src/adapters/bulk-lesson-transformer.ts`
2. `apps/oak-search-cli/src/adapters/bulk-unit-transformer.ts`
3. any tests covering bulk processing, mined outputs, or adapter contracts

---

## Phase Model

### Phase 0: Scope Lock

Lock the exact quick-win list before changing code.

Acceptance criteria:

1. the exact fields promoted in this plan are documented
2. the plan distinguishes:
   - widened mining outputs
   - preserved structured metadata
   - deferred retrieval consumers
3. non-goals are explicit
4. the stop line relative to P2 is explicit: P1 preserves raw structured keyword
   definition data in wider bulk outputs; P2 owns canonical identity,
   deduplication, provenance tagging, and any dedicated definition-asset surface
5. if a candidate item requires materially new extractor logic or a new
   cross-boundary consumer contract, it is deferred to a follow-on plan

### Phase 1: Test Specification (RED)

Add failing tests first for the widened bulk-processing contract.

Minimum coverage:

1. `processBulkData()` returns new extracted-data categories only when backed by
   real bulk fields or existing extractors
2. structured lesson metadata survives without ad hoc types
3. unit sequencing and pedagogical metadata are available for downstream
   consumers

### Phase 2: Implementation (GREEN)

Implement the minimum product changes needed to satisfy the tests.

Target areas:

1. `packages/sdks/oak-sdk-codegen/src/bulk/processing.ts`
2. existing extractor modules already present under
   `packages/sdks/oak-sdk-codegen/src/bulk/extractors/`
3. bulk-facing adapters or result types that need to expose the widened asset
   surface

### Phase 3: Refactor And Simplification

Refactor the widened surface so it remains easy to consume.

Acceptance criteria:

1. no duplicate extractor orchestration remains
2. names are aligned with the canonical field concepts already used in the repo
3. README/TSDoc and research cross-references describe the widened surface

### Phase 4: Quality Gates And Review

Run the relevant quality gates and invoke specialist review.

Minimum reviewers:

- `docs-adr-reviewer`
- `architecture-reviewer-barney`
- `architecture-reviewer-fred`
- `code-reviewer`

---

## Non-Goals

- New glossary or reference indices
- New query-routing policy
- LLM-based transcript mining
- New graph databases or multi-hop traversal features
- Rich thread/sequence retrieval changes beyond exposing reusable upstream assets

---

## Validation

Run the full canonical quality gate chain from
[roadmap.md](../roadmap.md#quality-gates), then add focused workspace tests as
needed.

Where needed, run focused workspace tests directly for:

- `@oaknational/sdk-codegen`
- `@oaknational/oak-search-cli`

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md](../future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md) | Evidence for the quick-win field set |
| [../future/03-vocabulary-and-semantic-assets/vocabulary-mining.md](../future/03-vocabulary-and-semantic-assets/vocabulary-mining.md) | Longer-term mining boundary plan |
| [../current/keyword-definition-assets.execution.plan.md](../current/keyword-definition-assets.execution.plan.md) | Next queued asset-surface plan that builds on this widened metadata |
| [../current/thread-sequence-semantic-surfaces.execution.plan.md](../current/thread-sequence-semantic-surfaces.execution.plan.md) | Next queued retrieval-surface plan that consumes these assets |
| [../current/m2-public-alpha-auth-rate-limits.execution.plan.md](../current/m2-public-alpha-auth-rate-limits.execution.plan.md) | Separate Milestone 2 blocker still queued alongside this active semantic-search stream |
