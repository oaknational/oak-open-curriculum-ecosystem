# Vocabulary-Aware Search Improvements in Elastic Serverless

> **Status**: Research documentation
> **Last Updated**: 2026-01-17

This document explains **all major levers available in Elastic Serverless** for using structured vocabulary data — including **synonyms, definitions, structural terms, and domain relationships** — to improve:

- Sense classification (subject, phase, intent)
- Query expansion
- Controlled boosting and ranking
- Filter inference and query routing
- Explainability and observability

The scope is intentionally **Elastic-native only**:

- No external services
- No custom plugins
- Everything runs inside Elastic Serverless or in client-side query construction

## Oak Search Current State

Oak Search already implements several of these patterns:

| Feature | Implementation | Location |
|---------|----------------|----------|
| **BM25 + ELSER** | Four-way RRF on structure + content fields | `rrf-query-builders.ts` |
| **Synonyms** | ~580 curated entries via `synonym_graph` filter | `src/mcp/synonyms/` |
| **Phrase detection** | Multi-word curriculum terms for phrase boosting | `detect-curriculum-phrases.ts` |
| **Subject/phase filters** | Applied at query time via filter clauses | `rrf-query-helpers.ts` |

**Not yet implemented**: Query rules, semantic reranking, relationship channels, definition retrieval.

---

## 1. Sense classification using Elastic-native mechanisms

Elastic Serverless does not provide a single built-in “intent classifier”, but it provides multiple **composable primitives** that can be used together to infer **subject, phase, and query intent** from vocabulary signals.

### 1.1 Query Rules (Rule Retriever)

Elastic’s **query rules** allow predefined rules to trigger when a query matches certain conditions (exact terms, substrings, regex patterns). These rules can then **modify retrieval behaviour**.

Documentation:

- Query rules overview: <https://www.elastic.co/docs/solutions/search/retrievers-overview>
- Rule retriever reference: <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rule-retriever>

Rules can be used to:

- Detect subject indicators (“art”, “maths”, “biology”)
- Detect phase indicators (“KS2”, “Year 9”, “GCSE”)
- Detect programme vocabulary (“foundation tier”, “AQA”)

When a rule triggers, it can:

- Pin specific documents
- Exclude documents
- Route the query to a specific retriever configuration

Rules are applied **inside Elasticsearch**, so they are low-latency and deterministic.

Important limitation:

- Query rules cannot arbitrarily inject new filters into the query DSL
- They are best used for routing, pinning, or exclusion, not full intent rewriting

### 1.2 Synonym-based sense signalling

Synonym sets can also be used to **normalise sense indicators**.

Example:

- “KS2”, “Key Stage 2”, “Years 3–6” → normalised token
- “A-level”, “A level”, “Sixth form” → normalised token

Synonyms can be managed via the **Synonyms API**:
<https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym>

Using the `synonym_graph` token filter ensures correct handling of multi-word expressions:
<https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>

This approach is fast and native, but it behaves more like **broad matching** than strict classification. It works best when combined with explicit metadata filters.

### 1.3 Client-side pre-search classification (still Elastic-native)

Some sense decisions are easier to make **before the search request**:

- Is the user asking for a definition?
- Are they explicitly requesting a year group or exam board?
- Are they likely exploring vs revising?

Client-side classification can use:

- Curated vocabulary lists
- Structural term maps
- Lightweight heuristics

The result is then expressed **purely via Elastic queries**:

- Adding filters
- Choosing retrievers
- Adjusting boosts

This preserves Elastic as the execution engine while allowing more expressive logic.

Latency trade-off:

- Slightly higher than pure in-engine rules
- Often acceptable for better correctness

---

## 2. Query expansion using structured vocabulary

Query expansion improves recall by ensuring conceptually relevant documents are retrieved even when wording differs.

Elastic supports **three distinct expansion mechanisms**, each suited to different types of vocabulary.

---

### 2.1 Synonym sets (explicit lexical equivalence)

Synonyms allow different surface forms to be treated as equivalent at search time.

Elastic documentation:

- Search with synonyms: <https://www.elastic.co/docs/solutions/search/full-text/search-with-synonyms>
- synonym_graph token filter: <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>
- Token graphs overview: <https://www.elastic.co/docs/manage-data/data-store/text-analysis/token-graphs>

Key properties:

- Best for abbreviations, spelling variants, and true equivalence
- Applied at **search time** when using synonym sets
- No reindexing required when synonym sets are updated

Recommended usage:

- Use synonyms **only for strict equivalence**
- Keep synonym sets small and sense-scoped
- Avoid conceptual adjacency (“nutrition” ≠ “calories”)

---

### 2.2 Definitions as controlled expansion signals

Definitions are not synonyms, but they can inform expansion.

Example:

- “photosynthesis” definition mentions “chlorophyll”, “sunlight”, “energy”
- These terms may be relevant in search even if not literal synonyms

Ways to use definitions safely:

- Extract **key terms** from definitions and treat them as *related concepts*
- Apply them as **low-boost query-time expansions**
- Never add full definition text to synonym sets

Definitions are especially useful for:

- Agent reasoning
- UI explanations
- Review of mined vocabulary candidates

---

### 2.3 Semantic expansion using ELSER

Elastic Learned Sparse Encoder (ELSER) provides **semantic retrieval** without explicit synonym rules.

Documentation:

- ELSER overview: <https://www.elastic.co/guide/en/machine-learning/current/ml-nlp-elser.html>

ELSER works by:

- Expanding text into weighted semantic tokens
- Matching documents based on learned associations
- Capturing relationships beyond literal term overlap

Key properties:

- Fully Elastic-native
- No custom training required
- Slightly higher latency than BM25, but designed for real-time search

ELSER complements, rather than replaces, curated synonyms:

- Synonyms handle known equivalence
- ELSER handles unknown or implicit similarity

---

## 3. Controlled boosting with domain knowledge

Expansion alone is not enough; ranking must be guided so the **most appropriate documents rise to the top**.

Elastic provides several native boosting mechanisms.

---

### 3.1 Field-level boosting

Field boosts prioritise matches in specific fields.

Example:

- Boost matches in `title` or `curriculum_tags`
- Lower weight for matches in long transcript text

This is done via standard query DSL (e.g. `multi_match`, `bool` queries).

Advantages:

- Extremely low latency
- Simple to reason about
- Works well with curated vocabulary

---

### 3.2 Function score and rank features

Elastic supports scoring based on numeric or boolean features.

Documentation:

- Rank feature fields: <https://www.elastic.co/guide/en/elasticsearch/reference/current/rank-feature.html>

Use cases:

- Boost “core” lessons
- Boost canonical curriculum material
- Boost documents aligned with inferred difficulty level

These scores can be precomputed and stored in the index, making runtime evaluation very fast.

---

### 3.3 Pinned results via query rules

Query rules can pin specific documents to the top of results for certain queries.

Documentation:

- Pinned queries: <https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-pinned-query.html>

Example use cases:

- Unit overview pages
- Canonical definitions
- Entry-point lessons

Pinned results override scoring and should be used sparingly.

---

### 3.4 Hybrid ranking and fusion (RRF)

Elastic supports running multiple retrievers and fusing results.

Documentation:

- Retriever framework: <https://www.elastic.co/docs/solutions/search/retrievers-overview>
- RRF retriever: <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever>

Common pattern:

- BM25 retriever (lexical precision)
- ELSER retriever (semantic recall)
- Fuse via Reciprocal Rank Fusion

Benefits:

- Captures both exact terminology and conceptual similarity
- Reduces risk of synonym over-expansion
- Fully native and single-request

---

## 4. Vocabulary-aware ranking strategies

Vocabulary data can inform ranking beyond simple expansion.

---

### 4.1 Taxonomy proximity boosting

If documents are tagged with:

- Concepts
- Broader topics
- Related curriculum areas

Then ranking can prefer:

- Exact concept matches
- Near-neighbour concepts
- Broader context documents

This is implemented by:

- Indexing related tags
- Boosting matches with lower conceptual distance
- Using precomputed numeric proximity scores if needed

Elastic does not traverse graphs at query time, but this behaviour can be simulated via indexing strategy.

---

### 4.2 Pedagogical alignment

Queries often imply level or intent:

- “GCSE algebra”
- “introductory fractions”
- “advanced trigonometry”

Ranking can be adjusted by:

- Boosting documents with matching level metadata
- Applying rescore phases for top-N results

Elastic supports rescore queries natively:
<https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-rescore.html>

This allows deeper ranking logic without affecting recall.

---

## 5. Filter inference and query routing

Structural vocabulary often implies **filters**, not content expansion.

---

### 5.1 Structural term detection

Examples:

- “Year 7” → KS3
- “AQA GCSE Biology” → KS4 + exam board + subject
- “Foundation tier” → programme factor

These terms should:

- Add filters
- Constrain retrieval
- Not expand content terms

This logic is usually best implemented **before the query is sent**, using curated maps.

---

### 5.2 Synonym-based filter tagging (advanced pattern)

An alternative approach:

- Inject hidden filter tokens via synonym expansion
- Index those tokens only in relevant documents

This allows filters to be applied implicitly via analysis.

This approach is fully Elastic-native but harder to debug and maintain.

---

## 6. Logging and explainability

As vocabulary logic grows, **observability becomes critical**.

---

### 6.1 Explain and profile APIs

Elastic supports:

- Explain API: <https://www.elastic.co/guide/en/elasticsearch/reference/current/search-explain.html>
- Profile API: <https://www.elastic.co/guide/en/elasticsearch/reference/current/search-profile.html>

These tools show:

- Which terms matched
- How scores were computed
- Whether synonym expansion occurred

They are essential for relevance debugging.

---

### 6.2 Analyzer testing

The `_analyze` API shows how text is tokenised and expanded.

Documentation:
<https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze>

This is the fastest way to validate synonym behaviour.

---

### 6.3 Application-level logging

Elastic does not automatically report:

- Which synonym fired
- Which rule triggered

Best practice:

- Log inferred filters
- Log rule activations
- Log expansion decisions in the SDK

This provides transparency and supports continuous tuning.

---

## 7. Summary of best practices

- Use synonyms only for true equivalence
- Use ELSER for semantic similarity
- Use query-time expansion for relationships
- Use filters for structure
- Use RRF to blend signals
- Keep everything explainable

---

## 8. Final takeaway

Elastic Serverless provides a **complete, composable toolkit** for vocabulary-aware search.

The key is not adding more data, but **using each type of data at the correct layer**:

- Equivalence → synonyms
- Meaning → semantic models
- Structure → filters
- Relationships → controlled expansion
- Authority → boosting and pinning

When used together, these levers produce a search experience that is:

- Precise
- Explainable
- Scalable
- Fully Elastic-native

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [README.md](./README.md) | Index and reading order |
| [handling-existing-synonymish-things.md](./handling-existing-synonymish-things.md) | Managing existing synonym corpus |
| [aliases-and-equivalances.md](./aliases-and-equivalances.md) | Mining strict equivalences |
| [data-and-domain-vocabulary.md](./data-and-domain-vocabulary.md) | Structural vocabulary and definitions |
| [elasticsearch-approaches.md](./elasticsearch-approaches.md) | Elastic-native implementation patterns |
| [python-mining-workspace.md](./python-mining-workspace.md) | Mining pipeline scope and governance |
| [documentation-gap-analysis.md](./documentation-gap-analysis.md) | Gaps and remediation plan |
