# Oak Ontology Graph Opportunities Strategy

**Last Updated**: 2026-03-07

## Purpose

This strategy translates the graph and knowledge-graph research into an
Oak-specific direction of travel.

It is based on the canonical synthesis in
[`elasticsearch-neo4j-oak-ontology-synthesis.research.md`](elasticsearch-neo4j-oak-ontology-synthesis.research.md)
and assumes the current reality:

- Oak has a published curriculum ontology in
  [`oaknational/oak-curriculum-ontology`](https://github.com/oaknational/oak-curriculum-ontology)
- the ontology includes semantic triples
- the ontology project already has a Neo4j export/deployment path, but this
  workstream should not assume access to a usable shared graph instance
- provisioning a separate Neo4j instance for this repo is therefore explicit
  enabling work for the first quick-win execution plan
- the ontology was produced by a separate team and should not be assumed to be a
  drop-in structural match for the search-facing data model in this repo
- the ontology is an early public release whose structure, URIs, and data are
  still subject to change

The ontology README also confirms that this is a standards-based semantic model
using RDF, OWL, SKOS, and SHACL, with explicit modelling of programme, unit,
unit variant, lesson, thread, exam board, tier, and National Curriculum
alignment.

Exploring the ontology repo adds four strategy-shaping facts:

- the ontology is validated through SHACL in CI
- instance data is already organised into temporal, taxonomy, thread, programme,
  and subject-level slices
- the source model represents sequencing and optionality through inclusion
  classes rather than only direct edges
- the Neo4j deployment is produced by a transformation pipeline, not a raw RDF
  mirror

## Strategic statement

Oak should pursue a **search-first, graph-augmented** strategy.

That means:

- `Neo4j + ontology triples` are the authoritative relationship layer
- `Elasticsearch` remains the primary retrieval, ranking, filtering, and
  projection layer
- value comes from careful alignment and bounded graph augmentation, not from
  forcing Elasticsearch to become the primary graph engine

## What the new synthesis adds

The synthesis sharpened five conclusions.

### 1. The ontology is now the centre of gravity for explicit relationships

Earlier exploration asked how far Elasticsearch could stretch towards graph
behaviour. The presence of a published ontology changes that. The important
question is now how to operationalise the ontology safely and productively,
not how to recreate it from search-side heuristics.

### 2. Partial overlap is the defining design constraint

The ontology and the repo likely overlap substantially, but they were not built
from the same artefact pipeline. Strategy must therefore assume:

- incomplete overlap in both directions
- identifier differences
- granularity differences
- structural mismatches
- relationships represented differently across systems

This is not an edge case. It is the normal operating assumption.

The ontology's early-release status strengthens this point: mismatch is not only
historical, it may continue to evolve as the ontology matures.

The transformed Neo4j export adds another layer of possible mismatch: even when
RDF concepts align, the operational graph may expose renamed properties,
flattened inclusion structures, and remapped relationships.

### 3. The first value is explanation and enrichment, not full synchronisation

The highest-confidence opportunities are:

- ontology-backed explanation of search results
- concept-aware retrieval improvements
- lightweight graph augmentation after search
- offline projection of graph-derived signals into Elasticsearch

These are more realistic first wins than attempting a full mirrored dual-store
model.

This is reinforced by the ontology's current shape: it already has rich
structures for threads, programme sequencing, taxonomy, and National Curriculum
alignment, but those structures should not be mirrored blindly into the repo's
current search model.

### 4. Stable join keys matter more than richer graph queries at this stage

Before Oak can exploit the ontology deeply, it must understand how current
searchable curriculum records align to ontology entities and relationships.

### 5. Deeper graph-native features should be earned, not assumed

Neo4j enables path queries, shortest path, and graph algorithms, but Oak should
only operationalise those capabilities where there is proven user value.

## Strategic goals

### Goal 1: improve search quality with ontology context

Use ontology entities and relationships to improve retrieval, ranking, and
result grouping without replacing Elasticsearch as the main search surface.

### Goal 2: improve trust through explanation

Make ontology context visible in a way that explains why a result was returned.

### Goal 3: build an explicit alignment layer

Represent match quality and mismatch explicitly rather than treating integration
as a silent join.

This alignment layer should also tolerate ontology release change over time.

It should also distinguish between canonical RDF entities and predicates, and
the transformed Neo4j labels and properties used in the deployed graph.

### Goal 4: create a platform for future graph-native experiences

Prepare for deeper curriculum navigation, progression guidance, recommendation,
and agent workflows without committing prematurely to traversal-heavy product
surfaces.

## Recommended architecture stance

### Authoritative roles

- `Neo4j + ontology triples`: authoritative for explicit curriculum
  relationships
- `Elasticsearch`: authoritative for retrieval, ranking, filtering, and
  search-facing projections
- application layer: authoritative for orchestration, alignment policy, and
  mismatch handling

Within that, strategy should recognise two ontology-facing representations:

- the source ontology model in RDF/OWL/SKOS/SHACL
- the transformed Neo4j operational graph produced by the export pipeline

### Integration stance

Treat Elasticsearch as a partial, search-optimised projection over a larger and
not perfectly aligned curriculum relationship space.

### Alignment stance

The integration model should be able to represent at least:

- exact matches
- transformed or normalised matches
- candidate matches needing review or heuristics
- records present only in the ontology
- records present only in search-facing data

## Opportunity areas

### 1. Ontology-backed enrichment of existing search documents

Attach ontology IDs and selected graph metadata to existing indexed documents
where confident matches exist.

Potential value:

- concept-aware retrieval
- structured filtering over ontology-derived fields
- explanation of why results were returned

Likely high-value ontology structures to start with:

- programme to unit to unit-variant to lesson relationships
- thread relationships
- National Curriculum alignment links
- knowledge taxonomy nodes such as discipline, strand, substrand, and content
  descriptor

Likely high-value operational join or projection fields to evaluate:

- URI-derived slugs such as `programmeSlug`, `unitSlug`, `lessonSlug`,
  `threadSlug`, and `contentDescriptorSlug`
- transformed title fields such as `programmeTitle`, `unitTitle`, and
  `lessonTitle`
- explicit identifiers where present such as `unitId`, `lessonId`, and
  `unitVariantId`

### 2. Query-time graph augmentation

Run search first, then use ontology IDs to fetch a bounded subgraph from Neo4j.

Potential value:

- explanation panels
- prerequisite context
- related-content suggestions
- richer MCP responses

Implementation should prefer the exported Neo4j shape for traversal, because
the export pipeline already flattens inclusion structures to optimise graph
queries.

### 3. Ontology projection indices in Elasticsearch

Create dedicated projection indices for ontology entities and selected
relationship summaries.

Potential value:

- concept-centric retrieval
- blended content-and-concept search
- lower dependence on live graph traversal for routine queries

The first projection candidates should come from ontology slices that are both
useful and comparatively stable:

- threads
- taxonomy concepts
- programme and unit metadata
- National Curriculum alignment summaries

### 4. Offline graph-derived features

Compute selected graph-derived features in Neo4j and project them into
Elasticsearch.

Potential examples:

- concept centrality
- depth or progression distance
- neighbourhood size
- prerequisite distance to a target concept
- counts of linked lessons or units

Potential ontology-native candidates now visible in the codebase:

- ordered sequence position from inclusion structures
- thread membership counts
- content-descriptor coverage counts
- number of unit variants attached to a unit

### 5. Recommendation and navigation surfaces

Use ontology structure to support:

- related lessons
- related units
- prerequisite and extension groupings
- curriculum-path guidance

The ontology's explicit temporal and programme hierarchy also creates a path to
better phase, key-stage, and year-group aware navigation if the alignment layer
is reliable enough.

## What not to do

### Do not assume direct one-to-one joins everywhere

A naive one-to-one join assumption will hide mismatch and create brittle search
behaviour.

### Do not make Elasticsearch the system of truth for deep graph logic

Elasticsearch is the right home for retrieval and projection, not for general
pathfinding or deep traversal semantics.

### Do not attempt full bidirectional synchronisation first

The overlap is too uncertain for a full mirror strategy to be the safest initial
move.

This is even more important while the ontology is still labelled as an early
release.

### Do not design against the wrong ontology representation

If a feature is built against the deployed Neo4j graph, document that clearly.
If a feature depends on source RDF semantics, document that clearly too. Those
are related but not interchangeable contracts.

### Do not let graph-native UX outrun user need

Most users are likely to remain search-first. Graph should improve search,
explanation, and navigation before it becomes a dominant interaction model.

## Immediate strategic work

The key design precursor remains the alignment audit below.

Separately, the first delivery quick win should provision a separate Neo4j
instance for this repo so the initial graph-augmented experiment can run
against a real graph environment rather than remain theoretical.

### Delivery prerequisite: Neo4j quick-win foundation

Stand up a Neo4j instance to host the curriculum knowledge graph used by the
first graph-augmented search experiment.

Primary outputs:

- a running Neo4j instance owned by this workstream
- the curriculum knowledge graph loaded into that instance
- a documented loading and refresh path that can be repeated as ontology data
  evolves
- a clear statement of whether the experiment uses the source ontology export,
  the transformed operational graph, or both

This is an enabling delivery step for the first quick win, not a replacement
for the alignment audit as the main architectural precursor.

### 1. Alignment audit

Compare current search-facing curriculum records with ontology entities and
relationships.

Primary outputs:

- overlap coverage
- mismatch taxonomy
- candidate join keys
- highest-value aligned entity classes
- volatility assessment for ontology fields and URIs most likely to change
- separation of issues caused by source-model mismatch vs export-model mismatch

### 2. Explanation prototype

Pick one search surface and add ontology-backed explanation for top results.

Success criteria:

- explanation is useful to users
- latency remains bounded
- unmatched content degrades gracefully
- the explanation path can be traced back to either source RDF semantics or the
  exported Neo4j shape without ambiguity

The preferred first quick win is to combine this prototype with the Neo4j
foundation above: provision the instance, load the graph, then use a bounded
subgraph fetch to explain selected search results.

### 3. Ontology projection prototype

Create a small Elasticsearch projection of ontology concepts and selected
relationship summaries, then test concept-aware retrieval on difficult queries.

Prioritise ontology slices with both high pedagogical value and likely stable
structure.

Start with projections that do not require reconstructing full sequencing logic
inside Elasticsearch.

### 4. Graph-derived ranking trial

Trial a small number of graph-derived signals to see whether they improve
ranking or grouping for progression-sensitive queries.

## Decision points

Oak should pause and review after the first prototypes answer these questions.

1. What percentage of current searchable entities can be matched confidently to
   ontology entities?
2. Which mismatches matter most in practice: identifiers, granularity,
   terminology, or missing entities?
3. Does ontology-backed explanation improve trust and usefulness enough to earn
   further integration?
4. Which graph-derived signals are stable and useful enough to project into
   Elasticsearch?
5. Which user journeys truly need live Neo4j traversal rather than search-side
   projection?

## Bottom line

Oak should not frame this as a choice between Elasticsearch and Neo4j.

The synthesis supports a different framing:

- Neo4j already holds the most credible explicit curriculum relationship layer
  through the ontology triples
- Elasticsearch remains the strongest retrieval and projection layer
- the main opportunity is a careful alignment and augmentation strategy that
  treats mismatch as normal and focuses first on explanation, enrichment, and
  bounded graph-aware retrieval
