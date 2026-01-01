# Hybrid Retrieval: Lexical, Semantic, and Graph-Friendly Signals

This note describes a method-led approach to hybrid retrieval in Elasticsearch, combining lexical relevance (BM25), semantic relevance (ELSER or dense vectors), and graph-friendly signals (entity tags, co-occurrence, and relationships).

## 1. Components and When to Use Them

- Lexical search (BM25): precise term matching, good for exact titles, keywords, and filters.
- Semantic search (ELSER or dense vectors): handles paraphrases and concept similarity.
- Fusion (RRF or weighted combination): merges multiple retrievers without hand-tuning scores.
- Reranking (cross-encoder): improves precision when you have a medium-length, high-signal field.
- Graph-friendly signals: entity tags and relationships to boost results connected to the query.

## 2. Method for Building a Hybrid Query

1. Define the lexical fields:
   - Titles, short descriptions, curated keywords.
   - Apply boosts to high-signal fields.
2. Add synonyms for domain terms and numeric normalisation:
   - Synonyms are required for cases like "2" vs "two", "KS2" vs "Key Stage 2".
3. Choose a semantic path:
   - ELSER with `semantic_text` fields for sparse semantic search.
   - Dense vectors with `dense_vector` + kNN for dense semantic search.
4. Fuse with RRF:
   - Use RRF to combine ranked lists without score calibration.
5. Add filters and light boosts:
   - Use structured filters (subject, phase, content type).
   - Optionally boost documents that share entities or relationships with the query.

## 3. Example: RRF with BM25 + ELSER

```json
POST my-index/_search
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": {
              "multi_match": {
                "query": "year 5 fractions",
                "fields": ["title^2", "summary", "keywords"],
                "fuzziness": "AUTO"
              }
            }
          }
        },
        {
          "standard": {
            "query": {
              "semantic": {
                "field": "summary_semantic",
                "query": "year five fractions"
              }
            }
          }
        }
      ],
      "rank_window_size": 60,
      "rank_constant": 60
    }
  }
}
```

## 4. Example: RRF with BM25 + Dense Vector kNN

```json
POST my-index/_search
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": {
              "multi_match": {
                "query": "photosynthesis energy transfer",
                "fields": ["title^2", "summary", "keywords"]
              }
            }
          }
        },
        {
          "knn": {
            "field": "summary_embedding",
            "query_vector": [0.012, 0.034, 0.056],
            "k": 50,
            "num_candidates": 200
          }
        }
      ]
    }
  }
}
```

## 5. Reranking Guidance

Reranking is effective only when the rerank field is:

- Long enough to provide context (roughly 100 to 300 tokens).
- Short enough to avoid heavy latency.

Avoid reranking on full transcripts or very short titles. If you plan to rerank, create a dedicated "search summary" field designed for the cross-encoder.

## 6. Graph-Friendly Signals

To incorporate graph signals without a graph database:

- Tag documents with entities (topics, threads, standards).
- Boost results that share entity tags with the query entity.
- Use significant_terms or Graph Explore API to generate related entities and apply lightweight boosts.

## References

- RRF retriever: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever
- Semantic text field: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text
- ELSER overview: https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-elser
- Dense vector field: https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector
- kNN search: https://www.elastic.co/docs/solutions/search/vector/knn
- Text similarity reranker: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever
- Synonyms: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-with-synonyms.html
