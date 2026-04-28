# Oak Ontology Graph Opportunities

## Purpose

This note extracts the durable, Oak-relevant value from the external research in:

- `elasticsearch-and-graphs.research.md`
- `elasticsearch-and-neo4j.research.md`

Those documents are broad market and platform research rather than repo-specific design documents. Their broken citations reduce auditability, but they still contain useful architectural signals. This note translates those signals into Oak-specific opportunities in light of the current reality:

- Oak now has a published curriculum ontology: <https://github.com/oaknational/oak-curriculum-ontology>
- the ontology already includes semantic triples
- the triples are already deployed to Neo4j
- the ontology was produced by a separate team from a similar, but not identical, view of the underlying source data

## Current framing

The ontology changes the central question.

The earlier research asked, in effect, "how graph-like can Elasticsearch be?".

That is no longer the most important question for Oak. Oak already has explicit graph data in the form of ontology triples stored in Neo4j. The more useful question is:

> How should Oak combine Elasticsearch and Neo4j so that search, retrieval, explanation, and curriculum navigation all improve without assuming perfect structural overlap?

## Durable insights from the research

### 1. Elasticsearch is a retrieval and projection engine, not the graph source of truth

The most durable conclusion from the research is that Elasticsearch is strong at:

- lexical retrieval
- semantic retrieval
- ranking
- filtering and faceting
- analytics
- building query-specific projections

It is weak at:

- deep traversal
- path queries
- graph-native constraints
- graph algorithms as first-class operations

For Oak, this implies that the ontology triples in Neo4j should be treated as authoritative relationship data, while Elasticsearch should remain the primary retrieval and ranking layer.

### 2. Explicit graph data is more valuable than inferred graph data

The research distinguishes between:

- implicit graphs inferred from co-occurrence
- explicit graphs modelled as entities and edges

Oak now has explicit graph data. That makes the ontology much more strategically valuable than Elastic Graph-style association discovery for core curriculum relationships.

Elastic Graph may still be useful for exploration or diagnostics, but it should not be treated as the primary model of curriculum structure.

### 3. Search-first, graph-augmented workflows are a strong fit

A recurring pattern in the research is:

1. retrieve relevant entities or documents with search
2. expand the relevant part of the graph
3. use that graph context for explanation, reranking, or answer construction

This fits Oak well because most likely user journeys still begin with search-like intent:

- "find me lessons about equivalent fractions"
- "what should I teach before this?"
- "what else is closely related to this lesson or concept?"

### 4. Stable cross-system identity is critical

The Neo4j research is especially valuable on identity discipline:

- use durable business identifiers
- do not rely on database-internal identifiers
- treat search indices as derived projections

For Oak, this is essential because overlap will be partial, not perfect. The system must be able to represent:

- direct matches
- probable matches
- one-to-many mappings
- unmatched records in either direction

### 5. Bounded subgraph construction is more realistic than open-ended traversal

The Elasticsearch research is useful where it recommends bounded, query-specific subgraph construction instead of pretending a search index is a full graph database.

For Oak, this suggests:

- expand only 1-2 hops by default
- cap neighbour counts
- favour explanation-oriented graph slices over full traversal
- compute broader graph operations offline or in Neo4j, not at query time in Elasticsearch

## What the ontology enables for Oak

The presence of ontology triples in Neo4j creates several clear enhancement opportunities.

### 1. Concept-aware search

Search results can become more concept-aware if ontology entities are projected into Elasticsearch and linked to content documents.

Potential outcomes:

- match on curriculum concepts, not just surface text
- improve recall for conceptually related wording
- return lessons, units, and other curriculum objects through shared concept links

### 2. Explainable search results

Graph context can make results easier to justify.

Examples:

- "returned because this lesson teaches concept X"
- "returned because concept X is a prerequisite of concept Y"
- "returned because this unit contains lessons linked to the queried concept cluster"

This is one of the highest-value opportunities because it improves trust as well as relevance.

### 3. Prerequisite and progression-aware ranking

If the ontology contains prerequisite, dependency, or sequence-like relationships, Oak can use them to improve ranking and navigation.

Examples:

- boost lessons directly teaching a queried concept
- surface prerequisite material when the query implies missing foundations
- group results into "direct match", "prepares for", and "extends"

### 4. Related-content recommendations

Ontology relationships can support recommendation patterns that are stronger than text similarity alone.

Examples:

- related lessons by shared concept
- nearby units by ontology neighbourhood
- concept bridges across subjects or phases where the ontology supports them

### 5. Query-specific curriculum subgraphs

For some experiences, the output should not just be a ranked list. It should be a small graph-shaped context window.

Examples:

- concept -> prerequisite -> lesson
- unit -> key concepts -> linked lessons
- lesson -> taught concepts -> adjacent concepts

This could support:

- richer MCP responses
- UI panels
- teacher-facing planning flows

### 6. Better entity grounding for semantic retrieval

If ontology IDs are attached to indexed curriculum documents, Elasticsearch can retrieve text while the application uses graph IDs for grounding.

That gives Oak a cleaner pattern:

- Elasticsearch finds relevant content
- ontology IDs identify the concepts involved
- Neo4j provides graph context around those concepts

## The central constraint: overlap is real, but incomplete

This is the most important practical caution.

The ontology and the repo likely describe substantially overlapping parts of the same curriculum world, but they were not produced from the same artefact pipeline and should not be assumed to align perfectly.

Oak should explicitly expect:

- entities present in the ontology but absent from current search indices
- entities present in search indices but absent from the ontology
- different identifiers for conceptually similar records
- different boundary choices, granularity, and naming
- relationships represented in one system but flattened or missing in the other

This means the right design is not "join everything directly". The right design is "build a deliberate alignment layer".

## Recommended architectural stance

### Authoritative roles

- `Neo4j + ontology triples`: authoritative for explicit curriculum relationships
- `Elasticsearch`: authoritative for retrieval, ranking, filtering, and search-facing projections

### Integration stance

Treat Elasticsearch as a projection layer over a partially aligned curriculum graph, not as a complete mirror of Neo4j.

### Alignment stance

Introduce explicit alignment states, for example:

- `exact_match`
- `mapped_with_transform`
- `candidate_match`
- `unmatched_in_ontology`
- `unmatched_in_search`

Even if these exact labels change, the principle matters: mismatch must be represented, not hidden.

## Practical opportunities worth exploring first

### 1. Ontology-backed enrichment of existing search documents

Attach ontology IDs and selected graph metadata to existing indexed documents where confident matches exist.

Why this is attractive:

- low disruption
- keeps Elasticsearch as the main query surface
- enables graph-aware ranking and explanation quickly

### 2. Query-time graph augmentation

Run search first, then use matched ontology IDs to fetch a bounded subgraph from Neo4j.

Why this is attractive:

- avoids premature full synchronisation
- makes partial overlap manageable
- yields user-visible value fast

### 3. Projection indices for ontology entities and relations

Create dedicated Elasticsearch projections for ontology entities and possibly selected relation views.

Why this is attractive:

- supports concept-centric retrieval
- allows hybrid retrieval across content and concepts
- avoids forcing all graph access through Neo4j at query time

### 4. Offline graph-derived features

Compute graph-derived signals in Neo4j and project them into Elasticsearch.

Examples:

- concept centrality
- concept depth
- prerequisite distance
- local neighbourhood size
- curated relationship counts

Why this is attractive:

- adds graph intelligence without query-time traversal cost

## Opportunities that need extra caution

### 1. Full bidirectional synchronisation

Do not assume every ontology change and every search-document change should immediately sync both ways. The overlap is too uncertain for that to be safe by default.

### 2. Treating ontology structure as a drop-in replacement for repo structures

The ontology may be better for some relationship questions and worse for some operational or search-specific concerns. It should enrich Oak's search model, not silently overwrite it.

### 3. Assuming graph-native UX is always better than search UX

Most users probably still begin with search or browse intent, not explicit graph exploration intent. Graph should improve retrieval and explanation rather than dominate the interaction model prematurely.

## Suggested evaluation questions

Before committing to a deeper integration, Oak should answer:

1. What proportion of current searchable curriculum records can be matched confidently to ontology entities?
2. Where are the largest structural mismatches: identifiers, granularity, relationship semantics, or missing entities?
3. Which user-facing improvements are easiest to prove first: explanation, recommendations, prerequisite guidance, or concept-aware recall?
4. Which graph-derived signals are stable enough to project into Elasticsearch?
5. Which experiences truly require live Neo4j traversal, and which can be served from Elasticsearch projections?

## Recommended next experiments

### Experiment 1: alignment audit

Build a one-off analysis that measures overlap and mismatch between:

- current searchable curriculum entities in this repo
- ontology entities and triples in Neo4j

Primary outputs:

- match coverage
- mismatch taxonomy
- candidate join keys
- highest-value aligned entity classes

### Experiment 2: explanation prototype

Pick one search surface and add ontology-backed explanation for top results.

Success would look like:

- useful explanations
- bounded latency
- graceful handling of unmatched content

### Experiment 3: concept projection prototype

Index a small Elasticsearch projection of ontology concepts and selected relationship summaries, then test whether concept-aware retrieval improves difficult queries.

### Experiment 4: prerequisite-aware ranking trial

Use a small, explicit slice of ontology relationships to test whether ranking improves for progression-sensitive queries.

## Bottom line

The most valuable lesson from the external research is not that Oak should try to make Elasticsearch behave like a graph database.

It is that Oak now has the ingredients for a stronger split of responsibilities:

- Neo4j holds explicit curriculum relationships via the ontology triples
- Elasticsearch handles retrieval, ranking, and projection
- the product opportunity is in joining them carefully, with explicit treatment of mismatch and incomplete overlap

That makes the most promising near-term direction:

1. align what can be aligned confidently
2. enrich search documents with ontology context
3. use bounded graph augmentation for explanation and retrieval improvement
4. only expand into deeper graph-native behaviour where the user value is proven
