# Enhanced Search with Elasticsearch Serverless and Neo4j Knowledge Graph

Modern search implementations increasingly combine **knowledge graphs** with traditional search engines to deliver richer, more intuitive user experiences. This hybrid approach enables multiple complementary search modes—from fast **lexical (keyword)** search to **semantic (meaning-based)** retrieval and **AI‑enhanced** discovery—while also surfacing **implicit relationships** that are otherwise difficult to uncover.

This document explores **idiomatic, canonical, and vendor‑supported approaches** to advanced search using:

- **Elasticsearch Serverless / Elastic Cloud / AWS OpenSearch Serverless**
- **Neo4j Aura (managed Neo4j)**

The analysis focuses on **official features**, documented best practices, and supported architectures (not workarounds), with an emphasis on **end‑user search**, **breadth of discovery**, **implicit relationships**, and **TypeScript‑friendly PaaS deployments**. The dataset context is the Oak National Academy OAKS API.

---

## 1. Lexical Search (Keyword and Full‑Text Search)

### Elasticsearch / OpenSearch

Lexical search retrieves documents based on exact or linguistically normalized term matches. Elasticsearch and OpenSearch excel here through **inverted indexes** and the **BM25 ranking algorithm**, a probabilistic relevance model derived from TF‑IDF.

- Elastic relevance scoring (BM25):  
  https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-similarity.html

By default, Elasticsearch performs **full‑text search**, meaning text is analyzed into tokens rather than matched as raw strings. Officially supported capabilities include:

- Language‑specific analyzers (stemming, stop words)
- Fuzzy queries for typo tolerance
- Prefix, wildcard, and phrase queries
- Field‑level boosting

Text analysis overview:  
https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis.html

#### Synonym Search (Official Support)

Elastic provides first‑class **synonym support**, allowing queries to be expanded with equivalent terms. This is essential for domain vocabularies, curriculum terminology, and accessibility.

- Synonym sets and APIs:  
  https://www.elastic.co/guide/en/elasticsearch/reference/current/search-with-synonyms.html

Synonyms can be applied:

- At **index time** (stored expansions)
- At **query time** (dynamic expansion)

This allows “television” to match “TV”, or “Key Stage 3” to match “KS3”, without changing user behavior.

Elastic Cloud provides UI and API support for managing synonym sets directly, making this a fully supported production feature.

---

### Neo4j Full‑Text Search

Neo4j supports lexical search via **Lucene‑backed full‑text indexes**, which are an official, core database feature.

- Neo4j full‑text index documentation:  
  https://neo4j.com/docs/cypher-manual/current/indexes-for-full-text-search/

These indexes can be created over:

- Node labels and properties
- Relationship properties

They support:

- Lucene query syntax
- Relevance scoring
- Custom analyzers
- Near‑real‑time updates as graph data changes

This enables keyword search directly over graph entities such as lessons, units, or subjects, returning ranked nodes that can then be expanded via graph traversal.

---

## 2. Semantic Search (Vector and Conceptual Search)

Semantic search retrieves results based on **meaning**, not just shared keywords. Both Elastic and Neo4j provide officially supported vector search capabilities.

---

### Elasticsearch / OpenSearch Vector Search

Elastic and OpenSearch support **dense vector fields** and **k‑nearest neighbor (kNN)** similarity search.

- AWS OpenSearch Serverless vector search:  
  https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-vector-search.html

Supported features include:

- Cosine similarity, L2 distance, dot product
- Hybrid queries (vector + lexical)
- Filtering and aggregation alongside vector search

Elastic explicitly positions vector search as a core semantic capability:

- Elastic vector search overview:  
  https://www.elastic.co/what-is/vector-search

#### ELSER: Elastic Learned Sparse Encoder (Vendor‑Provided)

Elastic provides **ELSER**, a vendor‑trained NLP model that enables semantic search without external embeddings.

- ELSER documentation:  
  https://www.elastic.co/guide/en/machine-learning/current/ml-nlp-elser.html

ELSER:

- Generates sparse semantic representations
- Integrates directly with Elasticsearch inverted indexes
- Requires no external ML infrastructure
- Is fully supported on Elastic Cloud

ELSER can be applied using:

- Ingest pipelines
- `semantic_text` field mappings

This provides an officially supported path to semantic search with minimal operational complexity.

---

### Neo4j Vector Search

Neo4j supports vector similarity search through **native vector indexes** based on **HNSW**.

- Neo4j vector index documentation:  
  https://neo4j.com/docs/cypher-manual/current/indexes-for-vector-search/

Capabilities include:

- Storing embeddings as node or relationship properties
- Creating vector indexes with defined dimensions and similarity functions
- Querying nearest neighbors via built‑in procedures

Example procedures:

- `db.index.vector.queryNodes`
- `db.index.vector.queryRelationships`

Neo4j also exposes vector similarity functions directly in Cypher:

- Vector similarity functions:  
  https://neo4j.com/docs/cypher-manual/current/functions/vector/

These can be combined with graph traversal and filtering for highly expressive semantic queries.

---

### Conceptual Search via Knowledge Graphs

Neo4j enables **ontology‑driven semantic expansion** by modeling explicit relationships between concepts. This allows:

- Query expansion via related concepts
- Discovery of implicit semantic links
- Curriculum‑aware semantic matching

Rather than relying solely on embeddings, the graph structure itself encodes meaning.

---

## 3. Graph‑Based Search and Discovery

Graph search enables discovery through **relationships**, not just documents.

---

### Neo4j Native Graph Traversal

Neo4j’s Cypher query language enables:

- Multi‑hop traversals
- Path queries
- Prerequisite and progression analysis
- Curriculum sequencing discovery

These queries support **exploratory search**, where users discover relevant content they did not explicitly search for.

Graph traversal patterns are first‑class and optimized in Neo4j:

- Cypher pattern matching:  
  https://neo4j.com/docs/cypher-manual/current/

---

### Elasticsearch Graph Explore API

Elastic provides a **Graph exploration API** for discovering statistically significant relationships via term co‑occurrence.

- Elastic Graph API overview:  
  https://www.elastic.co/guide/en/kibana/current/xpack-graph.html

The Graph API:

- Surfaces meaningful relationships
- Filters out noisy or trivial correlations
- Supports recommendation and discovery use cases

While not a full graph database, it provides supported relationship discovery over indexed data.

---

### Canonical Neo4j + Elasticsearch Architecture

Elastic and Neo4j explicitly document a complementary architecture:

- Neo4j as the **system of record** for relationships
- Elasticsearch for **fast retrieval and ranking**

Neo4j describes this as “using the right tool for the right job.”

- Neo4j on Elasticsearch integration patterns:  
  https://neo4j.com/developer/graph-data-science/search/

In this pattern:

- The graph enriches queries and results
- Elasticsearch handles scale, latency, and relevance scoring
- End users experience fast, context‑aware search

---

## 4. AI‑Enhanced Search

### Personalization

User context (progress, preferences, roles) can be modeled in Neo4j and used to personalize search ranking in Elasticsearch.

Elastic supports:

- Function score queries
- Custom ranking signals

Neo4j supplies the relational intelligence.

---

### Hybrid Ranking and Reranking

Hybrid search combines lexical and semantic relevance.

Elastic supports:

- Hybrid queries
- Two‑stage retrieval and reranking

- Elastic semantic reranking:  
  https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html

Graph‑derived signals (centrality, proximity, curriculum importance) can be incorporated into ranking logic.

---

### Generative AI and Retrieval‑Augmented Generation (RAG)

Both platforms support RAG architectures.

Neo4j:

- Vector search + graph grounding
- GraphRAG patterns

- Neo4j GraphRAG overview:  
  https://neo4j.com/developer-blog/graphrag/

Elastic:

- Semantic search as retrieval layer
- Integration with inference services

- Elastic AI and semantic search:  
  https://www.elastic.co/enterprise-search/semantic-search

This enables:

- Natural‑language question answering
- Grounded, explainable AI responses
- Reduced hallucination risk

---

## 5. Conclusion

Elasticsearch Serverless and Neo4j together provide a **comprehensive, vendor‑supported search stack**:

- **Lexical search** for precision
- **Semantic search** for meaning
- **Graph traversal** for discovery
- **AI‑enhanced ranking, personalization, and QA**

Both platforms offer managed services (**Elastic Cloud**, **AWS OpenSearch Serverless**, **Neo4j Aura**) and robust **JavaScript / TypeScript clients**, making them well‑suited for production end‑user search across the full Oak curriculum dataset.

This architecture directly supports:

- Breadth‑first discovery
- Implicit relationship surfacing
- Novel educational insight
- Scalable, future‑proof search
