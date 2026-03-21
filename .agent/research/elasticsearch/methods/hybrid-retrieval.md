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
2. Tune lexical behaviour by content type:
   - Lessons: prioritise precision with `min_should_match` (e.g. 75%) to reduce noise on naturalistic queries.
   - Units: allow more recall (e.g. broader fuzziness) for longer, summarised queries.
   - Avoid stemming and aggressive stop-word removal if they regress hard-query relevance.
3. Add synonyms for domain terms and numeric normalisation:
   - Synonyms are required for cases like "2" vs "two", "KS2" vs "Key Stage 2".
4. Choose a semantic path:
   - ELSER with `semantic_text` fields for sparse semantic search.
   - Dense vectors with `dense_vector` + kNN for dense semantic search.
5. Fuse with RRF:
   - Use RRF to combine ranked lists without score calibration.
6. Add filters and light boosts:
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

Note: Oak's current implementation uses four retrievers for lessons and units (BM25 + ELSER on content and structure fields), two retrievers for threads, and lexical-only sequence retrieval because `sequence_semantic` is not yet populated.

## 4. Weighted Fusion vs RRF

RRF is a robust default because it avoids score calibration, but it does not support per-retriever weights. If you need to down-weight noisy lexical signals for hard queries, use the Linear retriever (ES 8.18+ preview, 9.0+ GA).

When to prefer Linear retriever:

- You need retriever weights (e.g. higher weight for ELSER on naturalistic queries).
- You want content-type-specific weighting (lessons vs units).
- You want to preserve score magnitudes rather than rank-only fusion.

Keep RRF when:

- You need a simple, low-tuning baseline.
- Retrievers are on very different score scales and you do not want to normalise.

## 5. Query Routing by Type

Different query types benefit from different retrieval strategies. A lightweight classifier (rule-based or LLM-assisted) can route queries to:

- Topic queries: full hybrid (BM25 + ELSER).
- Naturalistic queries: ELSER-weighted fusion or reranked path.
- Misspellings: phonetic + fuzzy lexical path, low-boost semantic.
- Intent-only queries: reranked path with outcome and misconception fields boosted.

Routing lets you avoid "one size fits all" fusion that dilutes the strongest signal for hard queries.

## 6. Oak Integration Notes (Current)

These notes are system-specific and may drift; treat them as integration examples and check `../system/` for current status.

- Lessons and units use four-way RRF (BM25 + ELSER on content and structure fields) via `src/lib/hybrid-search/rrf-query-builders.ts`.
- Threads use two-way RRF.
- Sequences are currently lexical-only in the same module because `sequence_semantic` is mapped but not populated; if semantic retrieval returns, prefer current Elastic guidance for `semantic_text` rather than blindly restoring the earlier query shape.
- Query preprocessing removes noise phrases and boosts curriculum phrases from the SDK synonym vocabulary (`src/lib/query-processing/*`).
- Structured filters include KS4 programme factors (tier, exam board, exam subject, ks4 options) and thread/category filters (`src/lib/hybrid-search/rrf-query-helpers.ts`).
- Index targeting is environment-driven (primary vs sandbox) via `src/lib/search-index-target.ts`.
- Ablation notes: `min_should_match: 75%` improved lesson hard-query MRR (0.250 -> 0.367), while `fuzziness: AUTO:3,6` helped units but not lessons; stemming and stop-word filters regressed hard queries.

## 7. Example: RRF with BM25 + Dense Vector kNN

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

## 8. Reranking Guidance

Reranking is effective only when the rerank field is:

- Long enough to provide context (roughly 100 to 300 tokens).
- Short enough to avoid heavy latency.

Avoid reranking on full transcripts or very short titles. If you plan to rerank, create a dedicated "search summary" field designed for the cross-encoder.

## 9. Graph-Friendly Signals

To incorporate graph signals without a graph database:

- Tag documents with entities (topics, threads, standards).
- Boost results that share entity tags with the query entity.
- Use significant_terms or Graph Explore API to generate related entities and apply lightweight boosts.

## 10. Related Content (More Like This)

For "similar lesson" recommendations, use `more_like_this` on short, high-signal fields (title, summary, keywords). Avoid using full transcripts, which add noise and cost.

## References

- RRF retriever: [Elastic docs](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever)
- Semantic text field: [Elastic docs](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- ELSER overview: [Elastic docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-elser)
- Dense vector field: [Elastic docs](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/dense-vector)
- kNN search: [Elastic docs](https://www.elastic.co/docs/solutions/search/vector/knn)
- Text similarity reranker: [Elastic docs](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever)
- Synonyms: [Elastic docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-with-synonyms.html)
