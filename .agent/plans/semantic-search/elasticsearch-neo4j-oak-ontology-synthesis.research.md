# Elasticsearch, Neo4j, and Oak Ontology Synthesis

**Last Updated**: 2026-03-07

## Purpose

This document is the canonical synthesis of the graph and knowledge-graph
research relevant to Oak semantic search.

It consolidates three earlier research notes:

- `archive/elasticsearch-and-graphs.research.md`
- `archive/elasticsearch-and-neo4j.research.md`
- `archive/elasticsearch-neo4j-updated-with-refs.md`

Those source notes were useful but had two problems:

- broken internal citation markers made them hard to audit directly
- they did not fully reflect Oak's current situation, where a published
  curriculum ontology with semantic triples already exists and includes a
  Neo4j export/deployment path

This synthesis keeps the durable findings, replaces unstable citations with real
links, and translates the external platform research into Oak-relevant
conclusions.

## Current context

Oak now has a published curriculum ontology in
[`oaknational/oak-curriculum-ontology`](https://github.com/oaknational/oak-curriculum-ontology),
and the ontology project includes a Neo4j export/deployment path.

For planning in this repo, that should not be treated as guaranteed access to a
usable shared graph instance. A separate Neo4j instance may still need to be
provisioned for Oak search experiments and graph-augmented delivery work.

The ontology README adds important precision:

- it is a formal semantic model using RDF, OWL, SKOS, and SHACL
- it models programme, unit, unit variant, lesson, thread, exam board, tier,
  and National Curriculum alignment concepts explicitly
- it is published as an early release, with structure, URIs, and data still
  subject to change
- it explicitly positions semantic search and graph-database export as intended
  use cases

Exploring the ontology codebase adds implementation-level detail:

- the source ontology lives in `ontology/oak-curriculum-ontology.ttl`
- SHACL rules live in `ontology/oak-curriculum-constraints.ttl`
- instance data is split into temporal structure, programme structure, threads,
  and subject-specific TTL files
- the repo includes a dedicated Neo4j export pipeline with configurable
  transformations for labels, properties, slugs, relationships, and flattened
  inclusions

That changes the framing. The question is no longer "how graph-like can
Elasticsearch be on its own?". The more useful question is:

> How should Oak combine Elasticsearch and Neo4j so that retrieval,
> explanation, curriculum navigation, and future graph capabilities improve,
> while explicitly accounting for partial overlap and structural mismatch
> between the ontology and the search-facing data model?

## Executive synthesis

The combined research points to a clear separation of roles.

### Elasticsearch is strongest as the retrieval and projection layer

Elasticsearch is strong at:

- lexical retrieval and ranking
- semantic retrieval via sparse and dense vector techniques
- filtering, faceting, and aggregations
- ingest-time enrichment and NLP inference
- building query-specific projections over indexed data

It is weak at:

- deep native traversal
- variable-length path queries
- shortest-path operations
- graph algorithms as first-class query operations
- ontology reasoning and SPARQL-style semantics

Relevant references:

- [Elastic Graph overview](https://www.elastic.co/docs/explore-analyze/visualize/graph)
- [Graph explore API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-graph-explore)
- [`dense_vector` field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector)
- [`sparse_vector` field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/sparse-vector)
- [`semantic_text` field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [Retrievers overview](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/retrievers-overview.html)
- [RRF retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever)

### Neo4j is strongest as the explicit relationship layer

Neo4j is strong at:

- property-graph modelling
- variable-length pattern matching
- shortest-path queries
- graph-native traversal
- graph algorithms and graph analytics workflows

Relevant references:

- [Neo4j Cypher shortest paths](https://neo4j.com/docs/cypher-manual/current/patterns/shortest-paths/)
- [Neo4j variable-length patterns](https://neo4j.com/docs/cypher-manual/current/patterns/variable-length-patterns/)
- [Neo4j Graph Data Science algorithms](https://neo4j.com/docs/graph-data-science/current/algorithms/)

### Oak should treat the ontology as explicit graph truth, not as an optional add-on

The ontology triples change the centre of gravity.

The most valuable lesson from the Elasticsearch-only research is not that Oak
should try to make Elasticsearch behave like a native graph database. It is that
Elasticsearch can project, retrieve, and augment explicit graph data very well
when the graph already exists elsewhere.

For Oak, that means:

- `Neo4j + ontology triples` should be treated as the authoritative relationship
  layer
- `Elasticsearch` should remain the primary retrieval, ranking, and
  search-facing projection layer
- the main opportunity is careful integration, not platform replacement

This conclusion is strengthened by the ontology's explicit modelling of:

- temporal hierarchy: phase, key stage, year group
- knowledge taxonomy: discipline, strand, substrand, content descriptor
- programme structure: programme, unit, unit variant, lesson
- recurring conceptual structures such as threads
- links from Oak structures to National Curriculum content descriptors
- sequencing and optionality through `Inclusion`, `UnitVariantInclusion`,
  `LessonInclusion`, and `UnitVariantChoice`

The source files also show that the current public data is already partitioned
into usable slices:

- temporal structure in `data/temporal-structure.ttl`
- exam board and tier structures in `data/programme-structure.ttl`
- thread instances in `data/threads.ttl`
- subject-specific programme, taxonomy, and key-stage data under
  `data/subjects/`

## What each source contributed

### `elasticsearch-and-graphs.research.md`

Most useful durable contributions:

- clear distinction between implicit term-association graphs and explicit
  entity-edge graphs
- strong explanation of what Elastic Graph can and cannot do
- useful pattern of modelling explicit edges as documents and building bounded
  subgraphs in application logic
- useful emphasis on ingest enrichment, entity normalisation, and semantic
  retrieval as supporting primitives

Less useful for Oak now:

- generic product-surface survey material
- sections assuming the graph must be created from search-side extraction rather
  than starting from a published ontology

### `elasticsearch-and-neo4j.research.md`

Most useful durable contributions:

- strong separation of responsibilities between a search engine and a graph
  database
- high-value warning on stable identity and idempotent cross-store integration
- practical dual-store integration patterns
- clear articulation of where a graph database earns its complexity

Most relevant Oak takeaway:

- Elasticsearch and Neo4j are complementary, not competing, when one is used as
  a projection layer and the other as the explicit graph layer

### `elasticsearch-neo4j-updated-with-refs.md`

Most useful durable contributions:

- real source URLs for many platform claims
- stronger support for version-sensitive and licence-sensitive Elastic features
- clearer canonical vendor docs for Graph, retrievers, vectors, and semantic
  tooling

Caveat:

- the file still contains duplicated report content and retained unstable
  internal citation markers, so it is better used as a source artefact than as a
  canonical document

## What the synthesis establishes for Oak

### 1. Elastic Graph is not the core opportunity

Elastic Graph remains useful for association discovery over indexed terms, but
it should not be treated as Oak's primary curriculum graph model.

It is best suited to questions like:

- which terms co-occur meaningfully in a filtered subset of documents?
- which entities or attributes appear together unusually often?

Relevant references:

- [Elastic Graph](https://www.elastic.co/docs/explore-analyze/visualize/graph)
- [Graph explore API, 8.19](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/graph-explore-api.html)
- [Graph troubleshooting and sampling guidance](https://www.elastic.co/docs/explore-analyze/visualize/graph/graph-troubleshooting)

### 2. The ontology triples are the more important asset

Oak already has explicit graph structure. That makes the key opportunity:

- align ontology entities and relationships with search-facing content
- project selected graph context into Elasticsearch
- use Neo4j for relationship truth and deeper graph operations

This is more valuable than trying to infer the curriculum graph purely from
co-occurrence in content.

The ontology README makes this especially clear because it is not only a graph
export. It is a standards-based semantic model intended for semantic query,
interoperability, and graph-database usage.

The codebase reinforces this by showing that the ontology is accompanied by:

- SHACL validation in CI
- merged distribution generation in multiple RDF formats
- SPARQL query testing
- a purpose-built Neo4j export process

### 3. Search-first, graph-augmented flows are the natural fit

The research consistently supports a pattern of:

1. retrieve likely documents or entities with Elasticsearch
2. expand a bounded relevant subgraph from explicit relationships
3. use graph context for explanation, reranking, navigation, or answer support

This suits Oak because likely user journeys still begin with search or browse
intent rather than pure graph exploration intent.

The ontology structure suggests several especially valuable graph slices for
search augmentation:

- programme -> unit variant inclusion -> unit variant -> lesson inclusion ->
  lesson
- unit -> thread
- unit -> content descriptor
- subject -> strand -> substrand -> content descriptor

### 4. Partial overlap is a first-class architecture concern

Because the ontology was built by a separate team from a similar but not
identical view of the source world, Oak should explicitly expect:

- records present in the ontology but absent from current search indices
- records present in search indices but absent from the ontology
- one-to-many or many-to-one mappings
- different identifiers or naming conventions
- different granularity or boundary choices
- relationships represented in one system but flattened away in the other

The ontology README reinforces this caution in two ways:

- it explicitly says the ontology is an early public release and subject to
  change
- it notes that the National Curriculum mappings are best-effort applications
  of consistent structure where the source material was not originally designed
  as structured data

The codebase adds a third caution: the deployed Neo4j graph is not a raw RDF
mirror. The export pipeline applies transformations such as label remapping,
property renaming, slug extraction, relationship remapping, reverse
relationships, and inclusion flattening.

This means integration must represent mismatch explicitly instead of hiding it.

### 5. Stable identity is the hinge point

The Neo4j research is strongest where it stresses durable business identifiers.

For Oak, the practical implication is:

- never assume database-internal IDs are safe cross-system keys
- create or adopt explicit join keys for alignment work
- make match confidence and mismatch visible in the integration model

The export configuration suggests candidate join and projection fields already
exist or are derived, including URI-based slugs such as `programmeSlug`,
`unitSlug`, `lessonSlug`, `threadSlug`, and `contentDescriptorSlug`, plus
transformed title fields such as `programmeTitle`, `unitTitle`, and
`lessonTitle`.

## Architectural options for Oak

### Option A: Elasticsearch-first with ontology-backed augmentation

Flow:

1. search in Elasticsearch
2. resolve matched ontology IDs where available
3. fetch a bounded subgraph from Neo4j
4. use graph context for explanation and light reranking

Best for:

- rapid user-visible value
- low disruption to current search flows
- partial overlap where only some results have ontology mappings

Risks:

- alignment quality becomes the gating factor
- graph context may be uneven across result sets

### Option B: Elasticsearch projections of ontology entities and relationships

Flow:

1. project selected ontology entities and relationship summaries into dedicated
   Elasticsearch indices
2. retrieve both content documents and ontology-derived concept documents
3. use Neo4j only for deeper traversal or graph-native operations

Best for:

- concept-aware search
- lower query-time dependence on live graph traversal
- fast hybrid retrieval across content and concept layers
- reusing transformed slug and title properties from the operational Neo4j
  export shape

Risks:

- projection design may oversimplify the ontology
- projection freshness and mismatch policy must be explicit

### Option C: Full dual-store graph/search architecture

Flow:

1. Neo4j remains authoritative for relationship truth
2. Elasticsearch remains authoritative for retrieval and ranking projections
3. application orchestrates cross-store queries and synchronisation policies
4. graph-derived features are projected offline into Elasticsearch where useful

Best for:

- long-term platform capability
- explanation, recommendation, and progression-aware search
- future graph-native experiences

Risks:

- highest operational and alignment complexity
- demands clear ownership of synchronisation and mismatch handling
- demands explicit separation between RDF-source semantics and exported Neo4j
  semantics

## High-value opportunities supported by the research

### Concept-aware retrieval

Use ontology entities as an additional retrieval surface so that search can
match on curriculum concepts, not just document text.

Helpful references:

- [ELSER](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-elser)
- [NER example](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-ner-example)
- [Search Labs GraphRAG article](https://www.elastic.co/search-labs/blog/rag-graph-traversal)
- [Oak ontology README](https://github.com/oaknational/oak-curriculum-ontology/blob/main/README.md)

### Explainable results

Use graph context to answer questions like:

- why was this lesson returned?
- which concept does it teach?
- is this a prerequisite, a direct match, or an extension?

### Prerequisite-aware ranking and navigation

Where the ontology contains progression or dependency information, use it to:

- boost direct concept matches
- surface prerequisite content
- separate direct, preparatory, and extension results

The ontology's explicit `Progression` model and `coversContent` relationships
make this plausible, although the exact pedagogical semantics still need
verification before they are turned into ranking signals.

### Related-content recommendations

Use ontology neighbourhood rather than only text similarity to generate related
lessons, units, or concept clusters.

### Query-specific curriculum subgraphs

For some experiences, the right output is a small explanation-oriented graph,
not just a ranked list.

The ontology's explicit support for programmes, units, unit variants, lessons,
threads, and National Curriculum alignment means those subgraphs can be more
pedagogically meaningful than generic entity-neighbourhood expansions.

Because sequencing is represented through inclusion nodes rather than only
direct edges, the transformed Neo4j export shape is especially relevant for
query-time traversal and explanation.

## Guardrails from the research

### Do not assume one-to-one model equivalence

The ontology and the current repo structures are adjacent, overlapping systems,
not identical mirrors.

### Do not force Elasticsearch into deep traversal workloads

The research is consistent here. Elasticsearch can support bounded expansion and
projection patterns, but it is the wrong home for general pathfinding or deep
traversal.

Helpful references:

- [Paginate search results](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/paginate-search-results)
- [Parent join warning](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/parent-join)
- [Nested field warning](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/nested)

### Do not treat licence-sensitive Elastic features as assumptions

Some Elastic capabilities discussed in the research are version-sensitive or
subscription-sensitive.

Helpful references:

- [Elastic subscriptions](https://www.elastic.co/subscriptions)
- [Elastic 2026 subscription PDF](https://www.elastic.co/pdf/subscriptions-2026-02-03.pdf)
- [`semantic_text` field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [Retrievers overview](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/retrievers-overview.html)

### Do not hide mismatch

Alignment results should be explicit, for example as exact matches, transformed
matches, candidate matches, or unmatched records.

### Do not assume the ontology is static yet

The ontology README explicitly marks the release as early and says structure,
URIs, and data are subject to change. Any integration design should therefore
separate:

- stable local join and caching strategy
- refresh and re-alignment mechanics
- assumptions that need revalidation as ontology releases evolve

### Do not conflate RDF source shape with exported Neo4j shape

The ontology repository's Neo4j export intentionally transforms the RDF model to
optimise traversal and querying. Oak designs should state clearly whether a
feature depends on:

- source RDF classes and predicates
- transformed Neo4j labels, properties, and relationship types
- both, with an explicit mapping layer

## Recommended near-term conclusions

### Conclusion 1

Oak should not pursue an Elasticsearch-only mental model for graph enhancement.
The ontology already makes Neo4j the more credible home for explicit
relationship truth.

### Conclusion 2

Oak should treat Elasticsearch as the primary search and ranking layer, enriched
by ontology context rather than replaced by ontology traversal.

### Conclusion 3

The first implementation goal should be bounded graph augmentation and
explanation, not full synchronisation or deep graph-native product flows.

### Conclusion 4

The most important technical precursor is an alignment audit between current
searchable entities and ontology entities.

## Recommended next research and design steps

1. Measure overlap and mismatch between current search-facing curriculum records
   and ontology entities.
2. Identify candidate stable join keys and mismatch categories.
3. Separate the canonical RDF model from the transformed Neo4j export model in
   the integration design.
4. Prototype ontology-backed explanations for a search surface.
5. Prototype a small ontology projection index in Elasticsearch.
6. Decide which graph-derived features are best computed offline and projected
   into search.

## Key references

### Oak

- [Oak curriculum ontology repository](https://github.com/oaknational/oak-curriculum-ontology)
- [Oak ontology README](https://github.com/oaknational/oak-curriculum-ontology/blob/main/README.md)

### Elasticsearch

- [Elastic Graph overview](https://www.elastic.co/docs/explore-analyze/visualize/graph)
- [Graph explore API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-graph-explore)
- [Graph explore API, 8.19](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/graph-explore-api.html)
- [GraphRAG in Elasticsearch](https://www.elastic.co/search-labs/blog/rag-graph-traversal)
- [Inference processor](https://www.elastic.co/docs/reference/enrich-processor/inference-processor)
- [NER example](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-ner-example)
- [Enrich processor setup](https://www.elastic.co/docs/manage-data/ingest/transform-enrich/set-up-an-enrich-processor)
- [`dense_vector` field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector)
- [`sparse_vector` field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/sparse-vector)
- [`semantic_text` field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [Retrievers overview](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/retrievers-overview.html)
- [RRF retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever)
- [Paginate search results](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/paginate-search-results)
- [Elastic subscriptions](https://www.elastic.co/subscriptions)

### Neo4j and graph systems

- [Neo4j shortest paths](https://neo4j.com/docs/cypher-manual/current/patterns/shortest-paths/)
- [Neo4j variable-length patterns](https://neo4j.com/docs/cypher-manual/current/patterns/variable-length-patterns/)
- [Neo4j Graph Data Science algorithms](https://neo4j.com/docs/graph-data-science/current/algorithms/)
- [JanusGraph with Elasticsearch backend](https://docs.janusgraph.org/index-backend/elasticsearch/)
- [TigerGraph distributed query mode](https://docs.tigergraph.com/gsql-ref/4.2/querying/distributed-query-mode)

### RDF and KG semantics

- [RDF 1.1 Concepts and Abstract Syntax](https://www.w3.org/TR/rdf11-concepts/)
- [SPARQL 1.1 Query Language](https://www.w3.org/TR/sparql11-query/)
- [GraphDB reasoning](https://graphdb.ontotext.com/documentation/11.1/reasoning.html)

### Algorithms and research context

- [Efficient and robust approximate nearest neighbour search using HNSW](https://arxiv.org/abs/1603.09320)
