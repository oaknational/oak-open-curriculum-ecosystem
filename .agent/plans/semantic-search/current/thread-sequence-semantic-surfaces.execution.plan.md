---
name: "Thread and Sequence Semantic Surfaces"
overview: "Upgrade thread and sequence search targets from thin title-led documents to richer, derived semantic surfaces built from existing unit and lesson signals."
source_research:
  - "../curriculum-asset-opportunity-map.research.md"
  - "../future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md"
  - "../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md"
  - "../future/04-retrieval-quality-engine/learning-graph-surfaces.research.md"
  - "../future/04-retrieval-quality-engine/document-relationships.md"
depends_on:
  - "./m2-public-alpha-auth-rate-limits.execution.plan.md"
  - "../active/bulk-metadata-quick-wins.execution.plan.md"
  - "./keyword-definition-assets.execution.plan.md"
todos:
  - id: phase-0-scope-lock
    content: "Phase 0: Lock the exact derived fields and summary surfaces for threads and sequences, keeping small-index constraints explicit."
    status: pending
  - id: phase-1-red
    content: "Phase 1 (RED): Add failing tests for enriched thread/sequence builders, semantic fields, counts, spans, and suggestion inputs."
    status: pending
  - id: phase-2-green
    content: "Phase 2 (GREEN): Implement richer thread and sequence semantic/document surfaces from existing unit and lesson data."
    status: pending
  - id: phase-3-refactor
    content: "Phase 3 (REFACTOR): Simplify builder logic, align field naming, and update docs/ground-truth references."
    status: pending
  - id: phase-4-gates-review
    content: "Phase 4: Run quality gates, retrieval-focused review, and document the next relationship/search follow-ups."
    status: pending
---

# Thread and Sequence Semantic Surfaces

**Last Updated**: 2026-03-06
**Status**: 📋 READY (current)
**Source Boundary**: 04 — Retrieval Quality Engine
**Scope**: Enrich the `oak_threads` and `oak_sequences` surfaces using
existing unit and lesson data so these indices become more useful search and
suggestion targets without changing the consumer-facing search contract first.

---

## Problem

Threads and sequences are currently much thinner than the curriculum data that
supports them.

Evidence from the research pack shows:

1. `oak_threads` is still heavily title-led, with limited derived semantic
   content.
2. `oak_sequences` does not yet consistently express the richer semantic surface
   its mapping suggests.
3. both can derive better summaries, counts, spans, and suggestion inputs from
   units and lessons that already exist in the bulk pipeline.

This is a strong high-impact stream because it improves thinner search targets
without needing a new data source.

---

## Desired Outcome

At the end of this plan:

- thread and sequence documents expose richer semantic summaries
- lightweight derived counts and spans are available
- suggestion inputs are better aligned to the real curriculum structures
- the work remains compatible with current small-index retrieval constraints

---

## Prerequisites

- [m2-public-alpha-auth-rate-limits.execution.plan.md](./m2-public-alpha-auth-rate-limits.execution.plan.md)
- [bulk-metadata-quick-wins.execution.plan.md](../active/bulk-metadata-quick-wins.execution.plan.md)
- [keyword-definition-assets.execution.plan.md](./keyword-definition-assets.execution.plan.md)

P3 depends directly on P1 for widened upstream signals. Its dependency on P2 is
primarily sequencing and consistency: if canonical keyword-definition assets are
available by then, P3 may consume them, but P3 should not block on inventing
its own competing term surface.

---

## Phase Model

### Phase 0: Scope Lock

Lock the exact first delivery.

Candidate fields and surfaces:

- for threads:
  - year span
  - key-stage span
  - lesson count
  - richer semantic summary
  - stronger suggestion inputs
- for sequences:
  - semantic summary
  - unit count
  - lesson count
  - thread coverage
  - stronger suggestion inputs

The locked scope must stay small enough to fit the “thin target” nature of
these indices.

Relationship to Level 2 `document-relationships.md`:

- this plan enriches the **document surface**
- it does not, by itself, complete retrieval-time thread/sequence integration,
  cross-reference boosting, or prerequisite scoring
- its outputs should become inputs to later Level 2 relationship work, not an
  accidental replacement for that plan

### Phase 1: Test Specification (RED)

Add failing tests for:

1. enriched thread document builders
2. enriched sequence document builders
3. deterministic derived counts and spans
4. semantic surface population
5. suggestion input shaping

Ground-truth work may need targeted additions, but this plan should not rewrite
the evidence methodology itself.

### Phase 2: Implementation (GREEN)

Implement the selected enrichments in the ingestion/build path.

Likely change areas:

1. thread builder and transformer path
2. sequence builder and transformer path
3. any generated field definitions if the scope adds new document fields
4. stored suggestion-input shaping that depends on the enriched surfaces

### Phase 3: Refactor and Simplification

Acceptance criteria:

1. thread and sequence field naming stays aligned with existing lesson/unit
   structure where sensible
2. semantic-summary composition follows existing repo patterns
3. new fields are documented as derived rather than pretending to be upstream
   API parity

### Phase 4: Quality Gates and Review

Minimum reviewers:

- `docs-adr-reviewer`
- `architecture-reviewer-betty`
- `architecture-reviewer-fred`
- `architecture-reviewer-wilma`
- `test-reviewer`

---

## Guardrails

- Do not over-design these indices as if they were lesson documents.
- Keep small-index constraints explicit.
- Prefer summary and suggestion improvements before heavier ranking or traversal
  work.
- Defer query-policy or multi-hop graph behaviour to their owning boundaries.
- Keep suggestion policy, routing, and response-shaping changes outside this
  plan; this plan only enriches the stored data surface they may later read.

---

## Non-Goals

- New graph database adoption
- Full relationship-graph execution
- Consumer API changes for thread/sequence search
- Rewriting RRF policy or small-index retrieval rules
- Conflating thread semantics with sequence semantics

---

## Validation

Run the full canonical quality gate chain from
[roadmap.md](../roadmap.md#quality-gates), then add focused benchmark or
ground-truth runs where the implementation changes ranking or semantic surfaces
materially.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md](../future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md) | Primary evidence for this plan |
| [../future/04-retrieval-quality-engine/learning-graph-surfaces.research.md](../future/04-retrieval-quality-engine/learning-graph-surfaces.research.md) | Cross-cutting relationship surfaces that may later consume these enrichments |
| [../future/04-retrieval-quality-engine/document-relationships.md](../future/04-retrieval-quality-engine/document-relationships.md) | Follow-on retrieval plan using richer relationship context |
| [../active/bulk-metadata-quick-wins.execution.plan.md](../active/bulk-metadata-quick-wins.execution.plan.md) | Upstream asset-widening plan that supports later enrichments |
| [keyword-definition-assets.execution.plan.md](keyword-definition-assets.execution.plan.md) | Sequenced prior plan that may provide canonical term assets for enrichment inputs |
