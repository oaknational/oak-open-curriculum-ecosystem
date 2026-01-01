# Elastic + Neo4j: When to Combine

This note outlines a method for combining Elasticsearch (fast retrieval and ranking) with Neo4j (deep graph traversal).

## 1. When Elastic Alone Is Enough

Elastic is often sufficient when you need:

- Fast lexical and semantic retrieval.
- Co-occurrence-based discovery (Graph Explore API).
- Entity-centric indexing via transforms.

## 2. When Neo4j Adds Value

Add Neo4j when you need:

- Multi-hop traversal with complex patterns.
- Graph algorithms (centrality, community detection).
- Explicit relationship semantics and constraints.

## 3. Integration Pattern

Common pattern:

1. Use Elastic for retrieval and ranking.
2. Use Neo4j to expand or validate relationships for the top results.
3. Surface graph-derived features back into ranking or UI.

## 4. Data Synchronisation

Options:

- Periodic batch sync (ETL).
- Event-driven sync for changes.
- Store ids in both systems to allow cross-linking.

## References

- Neo4j full-text indexes: https://neo4j.com/docs/cypher-manual/current/indexes-for-full-text-search/
- Neo4j vector indexes: https://neo4j.com/docs/cypher-manual/current/indexes-for-vector-search/
- Neo4j GraphRAG overview: https://neo4j.com/developer-blog/graphrag/
- Elastic Graph Explore API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-graph-explore
