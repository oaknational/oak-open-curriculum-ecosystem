# Best Elastic Serverless-Native Approaches for Intent, NL Queries, Expansion, and Relevance

> **Status**: Research documentation
> **Last Updated**: 2026-01-17
> **Context**: Oak Search uses `semantic_text` fields, BM25 + ELSER, four-way RRF. Everything stays inside Elastic.

This document focuses on **what to do next** using **Elastic Serverless-native** capabilities (AI and non-AI), with links to official docs and Elastic Search Labs posts.

---

## 0) The core design pattern Elastic is pushing now

Elastic's recent "AI-native" innovations converge on the same architecture:

1. **Retrieve candidates in multiple ways** (lexical + semantic + rules)
2. **Fuse candidates robustly** (RRF / linear)
3. **Optionally rerank the top-K** with a stronger model (semantic reranking)
4. Keep **synonyms strict** and move "relationships" into **retrievers / rerankers**

Key building blocks:

- `semantic_text` field type (simplifies inference + chunking)
  <https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text>
  <https://www.elastic.co/docs/solutions/search/semantic-search/semantic-search-semantic-text>
- Retriever framework + RRF (compose multiple retrieval strategies)
  <https://www.elastic.co/docs/solutions/search/retrievers-overview>
  <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever>
- Semantic reranking + `text_similarity_reranker` retriever
  <https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking>
  <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever>
- Query rules + rule retriever (intent-ish deterministic behaviour)
  <https://www.elastic.co/docs/solutions/search/retrievers-overview>
  <https://www.elastic.co/search-labs/blog/semantic-search-query-rules>

---

## 1) Natural-language queries: lean harder into semantic + rerank (biggest ROI)

### 1.1 Ensure you're using `semantic_text` "the intended way"

Oak Search already uses `semantic_text` fields:

- `lesson_structure_semantic` — semantic embedding of curated summary (100% coverage)
- `lesson_content_semantic` — semantic embedding of transcript (~81% coverage)

This gives you:

- automatic inference at ingestion
- automatic chunking
- simplified mapping and "just index text" workflow

**Implication**: you can safely increase reliance on semantic retrieval for long, natural-language queries without bespoke chunking logic.

### 1.2 Add semantic reranking (often the biggest "it understands me" improvement)

Semantic reranking is designed precisely for your situation: you already retrieve decent candidates, but the ordering is not always right (especially for short ambiguous queries and NL questions).

Docs: <https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking>
Retriever: <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever>

**How to use it well:**

- Retrieve broadly (BM25 + semantic) to get high recall
- Rerank only top-K (e.g. 100–200) for latency control
- Treat reranking as your "intent disambiguator" among plausible candidates

---

## 2) "Intent-ish" behaviour inside Elastic: Query Rules + retriever routing

Elastic doesn't provide probabilistic intent classification out of the box, but it does provide **deterministic intent triggers** via Query Rules and the **rule retriever**.

### 2.1 Use the rule retriever as the outermost layer

Elastic's own guidance: **rule retriever must be outermost** (top-level) so rules apply correctly with semantic search, RRF, and reranking.

Reference + explanation:

- Rule retriever is listed in retrievers overview: <https://www.elastic.co/docs/solutions/search/retrievers-overview>
- Practical ordering guidance: <https://www.elastic.co/search-labs/blog/semantic-search-query-rules>

### 2.2 What query rules can do for you (high-value patterns)

Inside Elastic, query rules can:

- **Pin** canonical docs for navigational queries (unit/lesson titles, known head queries)
- **Exclude** known-bad matches for certain phrases
- Route to a different retriever tree (e.g. definition-first vs exploration-first)

This is the best "native" mechanism for:

- "what is X / define X" style queries
- navigational queries ("year 8 art unit …")
- patching recurring benchmark failures deterministically

---

## 3) Query expansion: strict synonyms + semantic similarity + "relationships as retrievers"

### 3.1 Keep synonyms strict (equivalence only)

Oak Search already uses synonyms via the `oak_syns_filter` (`synonym_graph` type) at search time.

**Current state**: ~580 curated entries across 17 subjects in `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`

Elastic synonyms are powerful, but you'll get better relevance if you restrict them to strict equivalence:

- abbreviations (e.g., "HCF" ↔ "highest common factor")
- spelling variants (e.g., "factorise" ↔ "factorize")
- true cross-system equivalences

Docs:

- "Search with synonyms": <https://www.elastic.co/docs/solutions/search/full-text/search-with-synonyms>
- `synonym_graph` (multiword correctness): <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>
- Synonyms API (manage sets operationally): <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym>

**Practical rule**: do _not_ encode conceptual adjacency ("nutrition" ↔ "calories") as synonyms.

### 3.2 Let `semantic_text` + ELSER handle "normal" synonymy and paraphrase

Semantic retrieval on `semantic_text` gives you:

- paraphrase tolerance
- fuzzy conceptual similarity
- domain vocabulary lift without you expanding synonym sets

Docs: <https://www.elastic.co/docs/solutions/search/semantic-search/semantic-search-semantic-text>

### 3.3 Treat "domain relationships" as a separate channel

This is the big conceptual upgrade: relationships are not synonyms, so don't encode them as synonyms.

Elastic-native ways to do "relationship expansion" without leaving Elastic:

1. **Index relationship terms into a dedicated field** (e.g. `related_terms`)
2. Add a **retriever** that targets this field (BM25 and/or semantic)
3. Fuse that retriever with your main channels via RRF

Docs: <https://www.elastic.co/docs/solutions/search/retrievers-overview>
RRF: <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever>

This gives you:

- recall improvements from relationships
- without polluting strict synonym logic
- and with ranking control via fusion + rerank

---

## 4) Add a "definitions" capability entirely inside Elastic

Oak's lesson data includes keyword definitions. Adding a dedicated definition retrieval path is high-value for:

- "what is X"
- "define X"
- student queries

### 4.1 The simplest, Elastic-native definition pattern

- Add a field like `definition_text` (and optionally `definition_semantic` as `semantic_text`)
- Populate it from lesson keyword definitions
- Add a dedicated retriever for definition fields
- Use rule retriever to route "what is / define" queries toward definition retriever
- Fuse with the general retrievers (so if no definition exists, you still return good content)

This stays fully inside Elastic and leverages the same retriever composition system.

---

## 5) Dense embeddings inside Elastic Serverless (optional additional channel)

If you want a dense channel in addition to ELSER (sparse), Elastic Inference Service provides options.

### 5.1 EIS endpoints in Serverless

Elastic Serverless provides inference endpoints:

- EIS docs: <https://www.elastic.co/docs/explore-analyze/elastic-inference/eis>
- Jina embeddings (dense): <https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-jina>

If you want a dense channel:

- Create an inference endpoint for a dense model
- Use it for kNN dense retrieval
- Fuse dense + ELSER + BM25 via RRF
- Optionally add semantic reranking

This is particularly useful for multilingual/MFL content or paraphrase-heavy scenarios where ELSER may not capture all variants.

> **Note**: Oak Search currently uses ELSER via `semantic_text` fields. A dense channel would be additive, not a replacement.

---

## 6) Retriever tree patterns for Oak Search

Below are **concrete retriever-tree patterns** using Oak's actual field names.

### 6.1 Current Oak architecture (four-way RRF)

This is what Oak Search currently implements in `rrf-query-builders.ts`:

```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": {
              "multi_match": {
                "query": "{{q}}",
                "fuzziness": "AUTO",
                "fields": ["lesson_title^4", "lesson_keywords^3", "lesson_structure^2", "lesson_content^1"]
              }
            }
          }
        },
        {
          "standard": {
            "query": { "semantic": { "field": "lesson_structure_semantic", "query": "{{q}}" } }
          }
        },
        {
          "standard": {
            "query": {
              "multi_match": {
                "query": "{{q}}",
                "fuzziness": "AUTO",
                "fields": ["lesson_content^2", "lesson_keywords^1"]
              }
            }
          }
        },
        {
          "standard": {
            "query": { "semantic": { "field": "lesson_content_semantic", "query": "{{q}}" } }
          }
        }
      ],
      "rank_window_size": 80,
      "rank_constant": 60
    }
  }
}
```

### 6.2 With semantic reranking (proposed enhancement)

Adding `text_similarity_reranker` on top of existing RRF:

```json
{
  "retriever": {
    "text_similarity_reranker": {
      "retriever": {
        "rrf": {
          "retrievers": [
            { "standard": { "query": { "multi_match": { "query": "{{q}}", "fuzziness": "AUTO", "fields": ["lesson_title^4", "lesson_keywords^3", "lesson_structure^2"] } } } },
            { "standard": { "query": { "semantic": { "field": "lesson_structure_semantic", "query": "{{q}}" } } } },
            { "standard": { "query": { "multi_match": { "query": "{{q}}", "fuzziness": "AUTO", "fields": ["lesson_content^2", "lesson_keywords^1"] } } } },
            { "standard": { "query": { "semantic": { "field": "lesson_content_semantic", "query": "{{q}}" } } } }
          ],
          "rank_window_size": 80,
          "rank_constant": 60
        }
      },
      "field": "lesson_content",
      "inference_id": ".rerank-v1-elasticsearch",
      "inference_text": "{{q}}",
      "rank_window_size": 100
    }
  }
}
```

### 6.3 With rule retriever for intent routing (proposed enhancement)

Rule retriever must be outermost:

```json
{
  "retriever": {
    "rule": {
      "ruleset_id": "oak-curriculum-query-rules",
      "retriever": {
        "text_similarity_reranker": {
          "retriever": {
            "rrf": {
              "retrievers": [...]
            }
          },
          "field": "lesson_content",
          "inference_id": ".rerank-v1-elasticsearch",
          "inference_text": "{{q}}",
          "rank_window_size": 100
        }
      }
    }
  }
}
```

---

## 7) What to do next (recommended sequence)

Given Oak Search's current state (semantic_text + BM25 + ELSER + four-way RRF):

1. **Add semantic reranking** (`text_similarity_reranker`) on top of existing RRF.
   Docs: <https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking>
   Ref: <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever>

2. **Introduce rule retriever outermost** and start with a small set of query rules:
   - definition triggers ("what is", "define", "meaning of")
   - navigational triggers (exact unit titles, key known head queries)
   Docs: <https://www.elastic.co/search-labs/blog/semantic-search-query-rules>

3. **Audit existing synonyms** — classify entries as strict equivalence vs relationships.
   Current location: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`

4. **Add relationship channel** (dedicated field + retriever) rather than expanding synonyms.

5. **Optional**: add dense channel via EIS for multilingual / paraphrase-heavy scenarios.

---

## 8) Operational tooling you should actively use while iterating

- **Analyze API** to test analysers, synonyms, and tokenisation:
  <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze>
- **Explain / Profile** (for debugging ranking):
  <https://www.elastic.co/guide/en/elasticsearch/reference/current/search-explain.html>
  <https://www.elastic.co/guide/en/elasticsearch/reference/current/search-profile.html>
- **Synonym sets management** (avoid reindexing):
  <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym>

---

## 9) Key principle to keep you out of trouble

**Inside Elastic Serverless, the best "interpretation" is usually achieved by:**

- keeping strict equivalence in synonyms
- letting semantic retrieval provide soft meaning
- letting RRF fuse multiple interpretations
- letting a semantic reranker choose the best ordering among candidates
- using rule retriever to enforce deterministic business "intent" patches

That aligns directly with Elastic's modern search stack: `semantic_text` + retrievers + fusion + rerank + rules.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [README.md](./README.md) | Index and reading order |
| [handling-existing-synonymish-things.md](./handling-existing-synonymish-things.md) | Managing existing synonym corpus |
| [aliases-and-equivalances.md](./aliases-and-equivalances.md) | Mining strict equivalences |
| [data-and-domain-vocabulary.md](./data-and-domain-vocabulary.md) | Structural vocabulary and definitions |
| [uses-of-structured-domain-knowledge.md](./uses-of-structured-domain-knowledge.md) | Survey of all vocabulary levers |
| [python-mining-workspace.md](./python-mining-workspace.md) | Mining pipeline scope and governance |
| [documentation-gap-analysis.md](./documentation-gap-analysis.md) | Gaps and remediation plan |
