---
name: "KG Integration Quick Wins"
overview: "Provision an isolated Neo4j curriculum graph, load the ontology's exported operational graph, and deliver the first bounded Elasticsearch integrations without assuming full model overlap."
source_research:
  - "../research/elasticsearch-neo4j-oak-ontology-synthesis.research.md"
  - "../oak-ontology-graph-opportunities.strategy.md"
  - "https://github.com/oaknational/oak-curriculum-ontology"
depends_on:
  - "kg-alignment-audit.execution.plan.md"
todos:
  - id: phase-0-decision-lock
    content: "Phase 0: Lock the first integration contract: separate Neo4j instance, ontology release pinning, initial join keys, and first user-visible quick wins."
    status: pending
  - id: phase-1-graph-instance
    content: "Phase 1: Provision a separate Neo4j instance and make ontology export/import repeatable, versioned, and observable."
    status: pending
  - id: phase-2-alignment-audit
    content: "Phase 2: Alignment audit queued at `kg-alignment-audit.execution.plan.md`; use its measured overlap outputs to narrow the remaining quick wins in this parent plan."
    status: completed
  - id: phase-3-es-projections
    content: "Phase 3: Create the first Elasticsearch ontology projection surfaces and graph-derived features for stable, high-value slices."
    status: pending
  - id: phase-4-query-augmentation
    content: "Phase 4: Prototype search-first, graph-augmented retrieval with bounded Neo4j expansion after Elasticsearch retrieval."
    status: pending
  - id: phase-5-review-promotion
    content: "Phase 5: Validate value, document the winning pattern, and promote the best quick win into active execution."
    status: pending
---

# KG Integration Quick Wins

**Last Updated**: 2026-03-07
**Status**: 📋 READY (current)
**Source Boundary**: Cross-boundary semantic-search / graph-enablement
**Scope**: Stand up an isolated ontology-backed graph lane for Oak search work,
prove the safest fast wins, and avoid assuming that the ontology and current
repo structures overlap perfectly.

---

## Promotion note

The alignment-audit slice of this parent plan has been promoted into
[kg-alignment-audit.execution.plan.md](kg-alignment-audit.execution.plan.md).
The remaining quick wins in this plan should now be narrowed using the audit
outputs rather than assumption-led overlap estimates.

---

## Problem

Oak now has three assets that were not previously available together:

1. a published curriculum ontology
2. a Neo4j export/deployment path in the ontology repo
3. a semantic-search stack that could benefit from explicit curriculum
   relationships

What Oak does **not** yet have is a safe, bounded, repeatable way to exploit
that graph in this repo.

Current constraints:

- the ontology was produced by a separate team from a similar but not identical
  view of the underlying curriculum data
- the ontology's source RDF model and its exported Neo4j operational graph are
  related but not identical contracts
- this repo should not assume it can depend on a shared ontology-team Neo4j
  deployment for search experiments or product work
- not every promising graph idea needs live graph traversal at runtime

Without a dedicated quick-win plan, ontology integration risks becoming either:

- a vague strategic aspiration, or
- an oversized dual-store project before the overlap is properly understood

---

## Desired Outcome

At the end of this plan:

- Oak has a separate Neo4j instance for semantic-search experimentation
- ontology export/import is reproducible and pinned to explicit source versions
- overlap and mismatch between ontology entities and search-facing records are
  measured rather than guessed
- Elasticsearch gains at least one useful ontology-backed projection or derived
  feature surface
- one bounded search-first graph augmentation flow is demonstrated end-to-end
- the team has enough evidence to decide whether deeper graph-native work is
  justified

---

## Recommendation Summary

### Best way to benefit from the source triples

Use the source triples in **three** roles, not one:

1. `Canonical source artefact`
   - keep versioned RDF distributions (`.ttl`, JSON-LD, N-Triples) for
     provenance, rebuilds, diffing, and offline analysis
2. `Operational graph`
   - load the ontology repo's transformed Neo4j export into a separate Neo4j
     instance for traversal, neighbourhood expansion, and graph-derived feature
     computation
3. `Search projections`
   - project only selected, stable, search-useful slices into Elasticsearch

### Should Oak serve flat files?

Yes, but **not** as the main runtime integration path.

Flat RDF files are useful for:

- release pinning
- reproducible graph rebuilds
- offline QA and alignment analysis
- future interoperability outside Neo4j

Flat files are a poor first runtime surface for:

- bounded traversal
- low-latency graph augmentation after search
- feature computation tied to the exported Neo4j operational shape

The recommended stance is:

- publish or retain flat-file snapshots as canonical source packages
- serve Neo4j for graph operations
- serve Elasticsearch for retrieval and search-facing projections

### How should Neo4j integrate with Elasticsearch?

The first integration should be **application-layer orchestration**, not direct
engine-to-engine coupling.

Preferred order:

1. Elasticsearch retrieves candidate records.
2. The application resolves confident ontology joins.
3. Neo4j returns a bounded local subgraph or precomputed graph features.
4. Elasticsearch-backed results are enriched, explained, grouped, or lightly
   reranked.

Avoid as a first step:

- treating Elasticsearch as the graph store
- treating Neo4j as the primary search engine
- introducing brittle live cross-engine joins inside query execution

---

## Quick Wins Worth Pursuing

### 1. Separate Neo4j graph instance

Provision an isolated Neo4j instance dedicated to search experimentation.

Immediate value:

- safe experimentation without depending on another team's runtime
- explicit version pinning
- repeatable import and rollback
- freedom to compute graph features or add search-specific helper labels if
  needed

### 2. Alignment audit and join-key inventory

Before heavy integration, measure what actually overlaps.

Minimum outputs:

- exact joins
- normalised or transformed joins
- candidate joins needing heuristics or review
- ontology-only entities
- search-only entities

Likely first join candidates from the ontology export:

- `programmeSlug`
- `unitSlug`
- `lessonSlug`
- `threadSlug`
- `contentDescriptorSlug`
- transformed title fields
- explicit IDs where available

### 3. Elasticsearch projection index for stable ontology slices

Create a small ontology projection index rather than mirroring the whole graph.

Best first candidates:

- threads
- programme and unit metadata
- taxonomy concepts
- National Curriculum alignment summaries

Immediate value:

- concept-aware filtering and recall
- lower dependence on live traversal for routine search tasks
- easier experimentation with hybrid search surfaces

### 4. Graph-backed explanation panels

After search retrieval, fetch a bounded graph neighbourhood that explains why a
result is relevant.

Examples:

- linked thread
- curriculum position
- nearby units or lessons
- National Curriculum links
- prerequisite or extension context where the graph is reliable enough

This is one of the safest first product wins because it improves trust without
requiring total graph/search convergence.

### 5. Offline graph-derived features projected into Elasticsearch

Compute features in Neo4j, then write them into Elasticsearch documents.

Best first candidates from the ontology export shape:

- sequence position
- unit-variant count
- lesson count per unit or programme slice
- thread membership count
- content-descriptor coverage count

This gives Oak graph value without making every query depend on live traversal.

### 6. Ontology-backed related-content suggestions

Use stable graph relationships to suggest adjacent material.

Best first suggestion families:

- other lessons in the same unit variant
- nearby units in the same programme
- content sharing a thread
- content aligned to the same content descriptor

### 7. Editorial and QA tooling

The graph can pay off internally before it pays off in public retrieval.

Examples:

- identify ontology entities with no search-facing counterpart
- identify search records lacking ontology alignment
- inspect suspiciously sparse or dense neighbourhoods
- compare ontology release deltas before reindexing

---

## Phase Model

### Phase 0: Decision Lock

Lock the minimum decisions before implementation:

1. Provision a separate Neo4j instance rather than using a shared deployment.
2. Pin the first ontology version or commit SHA.
3. Choose the first operational contract:
   - source RDF snapshot only
   - exported Neo4j operational graph
   - or both
4. Choose the first two or three quick wins to validate.
5. Lock the first join-key audit method.

Decision rule:

- prefer the smallest repeatable setup that can support both offline projection
  and one bounded query-time augmentation experiment

### Phase 1: Graph Instance and Data Load

Create the graph lane.

Deliverables:

- separate Neo4j instance
- scripted export/import path from ontology repo to the instance
- explicit source version metadata stored alongside the load
- load validation checks
- a small smoke-test query pack

Minimum acceptance:

- the graph can be rebuilt from a pinned ontology version without manual repair
- key traversal patterns return expected sample results

### Phase 2: Alignment Audit (promoted)

This slice is now owned by
[kg-alignment-audit.execution.plan.md](kg-alignment-audit.execution.plan.md).

This parent plan now consumes the audit outputs rather than re-describing the
audit work as if it were still queued here.

Required outputs from the promoted child plan:

- join-key inventory
- overlap report by entity class
- mismatch taxonomy
- recommendation for which ontology slices are ready for projection first
- a decision input for which remaining quick win should be promoted next

### Phase 3: Elasticsearch Projections

Project selected graph value into Elasticsearch.

Preferred first slices:

- threads
- programme/unit summaries
- National Curriculum alignment summaries
- one or two graph-derived numeric features

Preferred implementation pattern:

- batch projection jobs, not direct live ES-to-Neo4j coupling

### Phase 4: Query-Time Graph Augmentation

Prototype one bounded runtime flow.

Recommended first flow:

1. retrieve lessons or units in Elasticsearch
2. resolve confident ontology joins
3. fetch a small Neo4j neighbourhood
4. add explanation and related-content context to the response

Keep this bounded:

- one-hop or two-hop expansion only
- explicit latency budget
- graceful degradation when no confident join exists

### Phase 5: Review and Promotion

Decide what graduates into active execution.

Promotion candidates:

- explanation-first search augmentation
- projection-index enrichment pipeline
- graph-derived ranking features
- editorial graph QA tooling

---

## Guardrails

- Do not assume complete overlap between ontology and current repo structures.
- Do not design against the wrong ontology representation; distinguish source
  RDF semantics from exported Neo4j operational semantics.
- Keep flat files for provenance and rebuilds, but do not make them the main
  runtime dependency.
- Prefer batch projections and bounded augmentation before deep live traversal.
- Avoid a full mirrored dual-store architecture until the overlap audit proves
  it is worth the complexity.
- Treat ontology version drift as a normal operating condition.

---

## Non-Goals

- Full ontology synchronisation across all search-facing entities
- General-purpose SPARQL serving from this repo
- Replacing Elasticsearch with Neo4j for user search
- Replacing Neo4j with Elasticsearch Graph for explicit curriculum traversal
- Productising graph-native recommendations before overlap quality is measured

---

## Validation

### Technical validation

- Neo4j instance can be rebuilt from a pinned ontology version
- import is scripted and repeatable
- sample traversal queries pass
- Elasticsearch projection jobs are deterministic
- runtime graph augmentation degrades safely when joins are missing

### Product validation

- explanation output is understandable and genuinely helpful
- related-content suggestions improve navigation quality
- projected graph features improve filtering, grouping, or ranking enough to be
  noticeable

### Evidence validation

- overlap report is published before any broad rollout
- every projected field can be traced back to ontology source version and
  transformation path

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../research/elasticsearch-neo4j-oak-ontology-synthesis.research.md](../research/elasticsearch-neo4j-oak-ontology-synthesis.research.md) | Canonical graph and platform synthesis with real links |
| [../oak-ontology-graph-opportunities.strategy.md](../oak-ontology-graph-opportunities.strategy.md) | Strategic direction that this quick-win plan operationalises |
| [../../high-level-plan.md](../../high-level-plan.md) | Cross-collection sequencing that names this work as the next graph promotion candidate |
| [semantic-search/current/bulk-metadata-quick-wins.execution.plan.md](../../semantic-search/current/bulk-metadata-quick-wins.execution.plan.md) | Existing queued semantic-search work that may later consume graph-derived enrichments |
| [https://github.com/oaknational/oak-curriculum-ontology](https://github.com/oaknational/oak-curriculum-ontology) | Source ontology, RDF distributions, and Neo4j export implementation |
