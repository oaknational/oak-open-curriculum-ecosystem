# Elastic AI Capabilities: What to Use and Why

This note summarises AI-related capabilities in Elasticsearch that are relevant to search, RAG, and agent integration. It focuses on vendor-supported features.

## 1. ELSER (Sparse Semantic Retrieval)

ELSER provides semantic search without dense vectors. It is suited to:

- Hybrid search with BM25.
- Lower operational overhead (no external embedding service).
- Fast retrieval when you want semantic recall without managing vector stores.

Use `semantic_text` fields to run ELSER at ingest time.

## 2. Dense Vector Search (kNN)

Dense vectors offer strong semantic matching when you can supply embeddings from a dedicated model. This is useful for:

- Rich semantic queries, especially when domain-specific embeddings are available.
- Multilingual or cross-domain search when the embedding model supports it.

Use `dense_vector` fields with kNN search (HNSW) for retrieval.

## 3. Inference API

Elastic provides an inference API to integrate external models (embedding, reranking, and LLMs). This is the right choice when you want:

- A managed way to call OpenAI-compatible or hosted models.
- Consistent indexing or query-time inference through Elastic.

## 4. Reranking

Use text similarity reranking for precision improvements when:

- You have a high-signal, medium-length field for reranking.
- Latency budgets allow a second-stage model.

Avoid reranking on full transcripts or very short titles.

## 5. Semantic Text Field

`semantic_text` helps with automatic chunking and inference at ingest time. It is useful when:

- You need semantic retrieval over long documents.
- You want to avoid manual chunking in application code.

## References

- ELSER: https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-elser
- Semantic text field: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text
- Dense vector field: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector
- kNN search: https://www.elastic.co/docs/solutions/search/vector/knn
- Inference API: https://www.elastic.co/docs/solutions/search/using-openai-compatible-models
- Text similarity reranker: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever
