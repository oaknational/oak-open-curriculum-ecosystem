# Graph Discovery with Elastic

This note focuses on Elastic-native features for graph-style discovery without a separate graph database.

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

## References

- Graph overview: https://www.elastic.co/docs/explore-analyze/visualize/graph
- Graph Explore API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-graph-explore
- Significant terms aggregation: https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation
- Adjacency matrix aggregation: https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-adjacency-matrix-aggregation
- Transforms overview: https://www.elastic.co/docs/explore-analyze/transforms/transform-overview
- Nested field type: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/nested
- Join field type: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/parent-join
