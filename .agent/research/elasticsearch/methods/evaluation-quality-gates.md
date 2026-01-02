# Evaluation and Quality Gates for Search

This note defines a pragmatic evaluation approach for retrieval and RAG. The goal is to prevent regressions, quantify improvements, and keep latency and cost within budget.

## 1. Define the Evaluation Set

Create a small, curated query set that reflects real use:

- Short keyword queries.
- Natural language questions.
- Filters that exercise key facets.

Keep the set stable and versioned so results are comparable over time.

Stratify the corpus to avoid overfitting:

- Subject (all major subjects).
- Key stage (KS1 to KS4).
- Query type (misspellings, naturalistic, synonyms, multi-concept, colloquial, intent-based).
- Persona (teacher, student, curriculum planner).

Keep a small holdout set to validate that improvements generalise beyond the tuning set.

## 2. Offline Metrics

Standard retrieval metrics:

- MRR for "first correct result".
- NDCG@k for quality at the top of the list.
- Recall@k for coverage.

Elastic supports offline rank evaluation via the rank evaluation API.

Interpret MRR with simple bands to guide decisions:

- >= 0.80: excellent (result in top 1 to 2 positions).
- >= 0.50: good (result in top 2 to 3 positions).
- >= 0.33: acceptable (result in top 3 to 5 positions).
- < 0.33: poor (users are likely to reformulate).

## 3. Online Metrics

Monitor:

- Zero-hit rate.
- Click-through rates on top results.
- Reformulation rate (how often users re-search).
- P95 latency per query type.

## 4. RAG-Specific Checks

For RAG systems:

- Grounding rate: percentage of answers supported by retrieved citations.
- Citation accuracy: are cited sources relevant?
- Answer consistency: repeated queries should not drift.

## 5. Quality Gates

Treat these as required gates for changes that affect ranking:

- Offline evaluation within acceptable bounds.
- No regression in p95 latency.
- No spike in zero-hit rate.
- No regression on standard-query MRR while improving hard-query MRR.

## References

- Rank evaluation API: https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-rank-eval
- Search profile API: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-profile
