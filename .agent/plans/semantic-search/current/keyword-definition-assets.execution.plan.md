---
name: "Keyword Definition Assets"
overview: "Promote lesson keyword definitions from summary-only metadata into first-class, provenance-aware curriculum assets that can support glossary, boosting, and specialised retrieval work."
source_research:
  - "../curriculum-asset-opportunity-map.research.md"
  - "../future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md"
  - "../future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md"
  - "../future/04-retrieval-quality-engine/definition-retrieval.md"
depends_on:
  - "./m2-public-alpha-auth-rate-limits.execution.plan.md"
  - "../active/bulk-metadata-quick-wins.execution.plan.md"
todos:
  - id: phase-0-decision-lock
    content: "Phase 0: Lock the initial asset shape, provenance model, and first consumer boundary."
    status: pending
  - id: phase-1-red
    content: "Phase 1 (RED): Add failing tests for keyword-definition asset generation, provenance, and canonical shape."
    status: pending
  - id: phase-2-green
    content: "Phase 2 (GREEN): Implement schema-aligned keyword-definition asset generation and expose it through a canonical ingestion surface."
    status: pending
  - id: phase-3-refactor
    content: "Phase 3 (REFACTOR): Simplify naming, remove duplication, and align future glossary/retrieval docs with the chosen asset model."
    status: pending
  - id: phase-4-gates-review
    content: "Phase 4: Run quality gates, docs review, and architecture review; capture promotion guidance for glossary and retrieval follow-on work."
    status: pending
---

# Keyword Definition Assets

**Last Updated**: 2026-03-06
**Status**: 📋 READY (current)
**Source Boundary**: 03 — Vocabulary and Semantic Assets
**Scope**: Turn lesson keyword definitions into a reusable, provenance-aware
asset surface rather than leaving them as summary text or lesson-local flat
metadata only.

---

## Problem

Lesson keyword definitions are one of the strongest curriculum-native assets in
the repo, but they are not yet treated as a first-class product surface.

Current state:

1. keyword terms are indexed on lessons
2. definitions are used in summaries and mining
3. glossary/reference-index scaffolding exists in the repo
4. no canonical, stable keyword-definition asset surface yet owns provenance and
   downstream reuse

Without that asset layer:

- glossary work stays half-scaffolded
- domain-term boosting has a weaker source of truth
- specialised definition retrieval stays coupled to lesson documents
- future graph and suggestion work lacks stable term identity

---

## Desired Outcome

At the end of this plan:

- keyword definitions have a canonical asset shape
- provenance is explicit (`oak.keyword`, and any future categories if needed)
- the initial ingestion surface is schema-aligned and reusable
- later glossary or definition-retrieval work can consume the asset without
  re-deriving the same structure

---

## Prerequisites

- [m2-public-alpha-auth-rate-limits.execution.plan.md](./m2-public-alpha-auth-rate-limits.execution.plan.md)
- [bulk-metadata-quick-wins.execution.plan.md](../active/bulk-metadata-quick-wins.execution.plan.md)

P2 assumes P1 has widened the raw bulk outputs. P2 then promotes that preserved
data into a canonical, deduplicated, provenance-aware asset surface.

---

## Phase Model

### Phase 0: Decision Lock

Resolve the minimum decisions before implementation:

1. What is the initial canonical asset shape?
2. Which provenance states are in scope now?
3. Is the first delivery:
   - canonical asset generation only, or
   - asset generation plus a dedicated Elasticsearch document surface?

The plan should prefer the simplest deliverable that creates a stable source of
truth for follow-on glossary work.

### Phase 1: Test Specification (RED)

Add failing tests first for:

1. canonical term + definition shape
2. provenance preservation
3. subject/key-stage/lesson provenance capture
4. deterministic handling of repeated terms across lessons

### Phase 2: Implementation (GREEN)

Implement the chosen asset-generation path in the schema-aligned bulk pipeline.

Likely change areas:

1. bulk extractors and processing outputs in `@oaknational/sdk-codegen/bulk`
2. any generated or authored types that represent reusable definition assets
3. a canonical builder or export surface for later glossary consumers

### Phase 3: Refactor and Simplification

Acceptance criteria:

1. keyword-definition assets are named consistently with the rest of the repo
2. no duplicate definition-shaping logic remains in downstream consumers
3. boundary-local docs clearly distinguish:
   - asset generation
   - retrieval policy
   - glossary/retrieval consumption

### Phase 4: Quality Gates and Review

Minimum reviewers:

- `docs-adr-reviewer`
- `architecture-reviewer-betty`
- `architecture-reviewer-fred`
- `code-reviewer`

---

## Decision Guidance

Use the smallest viable first step:

- prefer a canonical reusable asset surface first
- add a dedicated Elasticsearch glossary document surface only if this plan can
  do so without blurring into query-policy or retrieval-routing work

This keeps Boundary 03 responsible for the asset itself while allowing Boundary
04 and Boundary 05 to consume it cleanly later.

---

## Non-Goals

- Final query-shape routing for definition intent
- Full runtime glossary UX or MCP response design
- Transcript-mined paraphrase promotion
- Ontology-wide canonical concept IDs for all curriculum entities

---

## Validation

Run the full canonical quality gate chain from
[roadmap.md](../roadmap.md#quality-gates), then add focused workspace tests as
needed.

Add focused test runs for affected workspaces as needed.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md](../future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md) | Primary evidence for first-class keyword-definition assets |
| [../future/04-retrieval-quality-engine/definition-retrieval.md](../future/04-retrieval-quality-engine/definition-retrieval.md) | Downstream retrieval plan that should consume the asset |
| [../active/bulk-metadata-quick-wins.execution.plan.md](../active/bulk-metadata-quick-wins.execution.plan.md) | Upstream quick-win widening of the bulk metadata surface |
| [thread-sequence-semantic-surfaces.execution.plan.md](thread-sequence-semantic-surfaces.execution.plan.md) | Parallel queued plan for thinner retrieval targets |
