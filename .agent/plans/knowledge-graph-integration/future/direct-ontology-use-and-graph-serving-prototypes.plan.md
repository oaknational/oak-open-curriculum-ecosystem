---
name: "Direct Ontology Use and Graph Serving Prototypes"
overview: "Start with direct ontology-backed use as the control case, then compare bounded Neo4j and Stardog prototypes against the same Oak use cases to determine whether either downstream serving platform earns adoption."
status: future
related_reports:
  - "../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md"
related_research:
  - "../../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md"
related_plans:
  - "../current/kg-alignment-audit.execution.plan.md"
  - "ontology-integration-strategy.md"
  - "../active/open-education-knowledge-surfaces.plan.md"
specialist_reviewer: "assumptions-reviewer, docs-adr-reviewer, onboarding-reviewer, architecture-reviewer-wilma"
todos:
  - id: dgsp-1-direct-use-baseline
    content: "Define the direct ontology-use baseline first: which MCP surfaces, search projections, QA checks, or partner-facing slices can be delivered from pinned ontology artefacts without introducing a live graph platform."
    status: pending
  - id: dgsp-2-shared-use-cases
    content: "Lock the shared prototype use cases, success measures, source versions, and comparison rubric so direct use, Neo4j, and Stardog are tested against the same Oak workloads."
    status: pending
  - id: dgsp-3-neo4j-prototype
    content: "Run a bounded Neo4j prototype focused on the existing export path, product-graph ergonomics, and the maintenance/support risks attached to the transformed serving graph."
    status: pending
  - id: dgsp-4-stardog-prototype
    content: "Run a bounded Stardog prototype focused on ontology-native serving, GraphQL/SPARQL ergonomics, reasoning/explanation value, and operational unknowns."
    status: pending
  - id: dgsp-5-comparison-synthesis
    content: "Publish a comparison synthesis covering strengths, weaknesses, new discoveries, unknowns, and whether either platform materially outperforms the direct-use baseline for specific workloads."
    status: pending
  - id: dgsp-6-propagation
    content: "Propagate prototype outcomes into the graph strategy, ontology integration strategy, MCP/search plans, and discovery surfaces so the repo's graph direction follows evidence rather than platform preference."
    status: pending
---

# Direct Ontology Use and Graph Serving Prototypes

**Status**: FUTURE  
**Last Updated**: 19 April 2026

## Problem and Intent

The repo now has two strong pieces of cross-boundary analysis:

1. the formal ontology integration report in
   [oak-ontology-mcp-search-integration-report-2026-04-19.md](../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md),
   which argues that official ontology value should land directly in MCP
   orientation, standalone ontology surfaces, search projections, and QA
   governance
2. the platform-comparison research note in
   [kg-neo4j-stardog-product-creation-clean.md](../../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md),
   which argues that Neo4j and Stardog are downstream serving-architecture
   choices rather than the ontology itself

Taken together, these documents imply a missing strategic step:

- Oak should not assume that a live graph platform is required before value can
  be created from the ontology
- Oak should treat **direct ontology use** as a valid first-class baseline
- Oak should compare Neo4j and Stardog only after the baseline is clear and the
  same small set of Oak use cases is agreed

This plan therefore exists to create an evidence-driven comparison between
four possible outcomes:

1. **neither** — direct ontology-backed use without a live graph database
2. **Neo4j** — transformed product-serving graph downstream of canonical RDF
3. **Stardog** — ontology-native semantic serving downstream of canonical RDF
4. **both** — differentiated downstream roles for different workloads, with one
   canonical semantic source still in charge

## What This Research Already Gives Us

The Neo4j/Stardog note is useful for more than vendor comparison. It gives the
repo five planning assets that should now become explicit.

### 1. A control case

The most important extraction is that `neither` is a valid outcome. MCP
resources, offline search projections, QA checks, and some partner-facing
shapes may be achievable directly from pinned ontology artefacts before any
live graph platform is justified.

### 2. A workload shortlist

The note already names the most decision-useful prototype workloads:

- teacher journey or curriculum-navigation API
- partner-facing structured curriculum API slice
- explainable relationship test
- AI grounding slice
- change-management test

These should be reused rather than replaced with vendor demo scenarios.

### 3. A reusable unknowns backlog

The note already surfaces the unknowns that matter most:

- Neo4j projection maintenance cost and semantic drift
- support expectations around `rdflib-neo4j`
- Stardog GraphQL schema-governance friction
- Stardog reasoning overhead and explanation value
- whether direct ontology use already solves enough of the first-wave product
  problem to defer either platform

### 4. A governance rule

Canonical RDF should remain the source of truth in all scenarios. Any Neo4j or
Stardog surface is downstream serving infrastructure, not the ontology itself.

### 5. A decision gate

The architecture choice should follow external mission value:
discoverability, trustworthiness, interoperability, explainability, and
educational usefulness for real users.

## Domain Boundaries

This plan is about evaluating downstream serving options for Oak's ontology.

In scope:

- direct ontology-backed MCP surfaces and orientation candidates
- direct ontology-backed search or QA projections
- bounded Neo4j and Stardog prototypes against the same use cases
- strengths, weaknesses, surprises, and unknowns revealed by those prototypes
- evidence needed to decide whether either platform should be promoted into
  executable work

Out of scope:

- production deployment of either platform
- a full vendor selection or procurement process
- rewriting current search or MCP services around a graph database up front
- treating the transformed Neo4j export as the canonical ontology
- treating the platform choice as a prerequisite for using the ontology at all

## Sequencing Assumptions

1. Start with a pinned ontology snapshot and explicit provenance.
2. Define the direct-use baseline before any platform comparison.
3. Reuse the same workload shortlist across all prototype lanes.
4. Keep the compared layers separate:
   - canonical RDF ontology
   - transformed Neo4j operational graph
   - ontology-native Stardog serving layer
   - repo-local MCP/search/QA projections
5. Keep Neo4j and Stardog prototypes bounded to a small set of Oak use cases,
   not general platform tours.

## Prototype Lanes

### Lane A: Direct ontology use first

This is the control case.

Questions to answer:

- Which MCP surfaces can be served directly from ontology projections without a
  live graph platform?
- Which search-facing or QA-facing artefacts can be built directly from pinned
  RDF or distribution files?
- Which early external or internal features gain enough value from direct use
  that a graph database can be deferred?

Candidate first slices:

- MCP orientation structure and ontology coverage metadata
- direct `oak-kg-*` resources for temporal structure, threads, taxonomy,
  programme sequencing, lesson semantics, and NC progressions
- search projection indices built from stable ontology slices
- provenance and drift checks in CI

### Lane B: Neo4j serving-graph prototype

This lane tests the value of Oak's existing product-graph projection path.

Questions to answer:

- What does the transformed Neo4j export enable that direct use does not?
- Which use cases genuinely benefit from traversal-oriented ergonomics,
  flattened inclusion structures, or GraphQL/Cypher app serving?
- How much semantic distortion and maintenance burden does the projection
  introduce?
- How much platform risk attaches to the current `rdflib-neo4j` path?

### Lane C: Stardog semantic-serving prototype

This lane tests the value of keeping the serving contract much closer to the
ontology.

Questions to answer:

- Which use cases benefit from ontology-native GraphQL/SPARQL, reasoning, and
  explanation?
- Are Stardog's GraphQL ergonomics and schema-governance workflow good enough
  for Oak's likely consumers?
- Does reasoning materially improve trust, explainability, or AI grounding for
  the shortlisted use cases?
- Is the operational complexity justified by the semantic gains?

### Lane D: Cross-lane comparison

The comparison output must capture at least:

- strengths
- weaknesses
- new discoveries
- unresolved unknowns
- what each lane makes easy
- what each lane makes harder
- what direct ontology use already covers
- what, if anything, only Neo4j enables
- what, if anything, only Stardog enables
- whether a split outcome of `both, for different use cases` is justified or
  merely duplicative

## Shared Prototype Use Cases

Every lane should use the same small set of Oak workloads.

Recommended shortlist:

1. Teacher journey API or MCP slice
2. Partner-facing structured curriculum API slice
3. Explainable relationship slice
4. AI grounding slice
5. Change-management and schema-refresh slice

These should be narrowed during promotion to `current/`, but the narrowed set
must remain shared across all lanes.

## Success Signals

This strategic brief should be considered successful when the repo can answer
the following questions with evidence rather than preference.

- Does direct ontology use already satisfy the first-wave MCP/search/QA needs?
- If Neo4j adds value, which exact workloads justify the transformed serving
  graph?
- If Stardog adds value, which exact workloads justify ontology-native serving?
- Are any of the perceived platform advantages erased once the same workload
  and control case are used?
- Do the findings support one platform, a hybrid, or continued use of neither?

## Risks and Unknowns

| Risk or unknown | Why it matters |
|---|---|
| Direct-use baseline under-specified | If the control case is weak, either platform may look better than it really is |
| Search-first bias | The graph choice could be over-fit to search workloads and miss MCP, QA, partner, or expert-tooling value |
| Neo4j semantic drift | A successful product graph can silently become the de facto truth unless provenance and drift checks are explicit |
| Neo4j support-path uncertainty | `rdflib-neo4j` support expectations matter if Neo4j remains the incumbent |
| Stardog ergonomics unknown | Semantic fit alone is not enough if the serving workflow is awkward for Oak teams or consumers |
| Stardog operational overhead | Infrastructure and capability costs may outweigh semantic gains for the shortlisted workloads |
| Hybrid overreach | Running multiple downstream representations without strict role separation can double cost without doubling value |
| Immature ontology assumptions | Early-release source changes can invalidate prototype findings if provenance and source locking are weak |

## Promotion Trigger Into `current/`

Promote this plan when all of the following are true:

1. The direct-use baseline is explicitly scoped and accepted as the control
   case.
2. The compared ontology snapshot, export assumptions, and workload shortlist
   are pinned.
3. The comparison rubric names the exact evidence to capture for strengths,
   weaknesses, discoveries, and unknowns.
4. The repo has capacity to run bounded prototypes without conflating them with
   production adoption.

## Implementation Note

Any commands, infrastructure choices, sample queries, or data-loading details
captured during research are reference material only at this stage. Final
execution choices are locked only when this strategic brief is promoted into
`current/` or `active/`.
