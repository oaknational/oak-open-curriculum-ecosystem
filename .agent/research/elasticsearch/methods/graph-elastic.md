# Graph Discovery with Elastic

This note focuses on Elastic-native features for graph-style discovery without a separate graph database.

## Positioning (near-term)

These ES-only, graph-adjacent features are intended for **immediate** search improvements. They also remain useful after a future Neo4j adoption, because graph-derived views can be materialised back into Elasticsearch for retrieval and faceting. For the later-phase Neo4j path, see `graph-elastic-neo4j.md`.

## 1. Graph Explore API

The Graph Explore API surfaces connections between terms and entities based on co-occurrence. Use it to:

- Build "related concepts" suggestions.
- Explore clusters of topics.
- Expand queries using statistically significant neighbours.

## 2. Significant Terms and Adjacency

If you want more control than Graph Explore:

- `significant_terms` finds terms unusually common in a focused result set.
- `adjacency_matrix` quantifies overlap between known filters or facets.

## 3. Entity-Centric Indexing with Transforms

Transforms can produce entity-centric indices:

- Each entity becomes a document with aggregated relationships and counts.
- This enables fast filtering and faceting for graph-like views.

## 4. Relationship Modelling

Prefer denormalised fields (arrays of ids/tags) for search performance. Use:

- `nested` fields when you need per-object matching in arrays.
- `join` fields only if you run a non-serverless cluster and genuinely need parent/child relations.

## 5. Learning Path Queries (Prerequisites)

Learning-path questions ("what comes before X") can be served from ES if you materialise prerequisite edges:

- Store unit-to-unit or concept-to-concept edges in a dedicated index.
- Add edge metadata (subject, thread, edge_type) for filtering.
- Use adjacency queries to step through 1 to 2 hops and surface a path.

This provides lightweight traversal without a full graph database, and it can be combined with Graph Explore or significant terms for expansion.

## References

- Graph overview: https://www.elastic.co/docs/explore-analyze/visualize/graph
- Graph Explore API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-graph-explore
- Significant terms aggregation: https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation
- Adjacency matrix aggregation: https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-adjacency-matrix-aggregation
- Transforms overview: https://www.elastic.co/docs/explore-analyze/transforms/transform-overview
- Nested field type: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/nested
- Join field type: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/parent-join
