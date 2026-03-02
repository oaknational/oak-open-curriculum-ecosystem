# Curriculum Search Relevance Playbook (Elastic Serverless)

> **Status**: Research documentation for vocabulary mining and search improvement.
> **Last Updated**: 2026-01-17

This directory is a **cohesive set of design documents** for improving search over curriculum assets (metadata + transcripts) using **Elastic Serverless**. The core goal is to improve relevance for **domain-specific language** and **domain-specific relationships** (sense-dependent meaning) without damaging precision via over-broad "synonyms".

---

## Current Oak Search Architecture

The search app already implements:

| Component | Implementation | Location |
|-----------|----------------|----------|
| **Four-way RRF** | BM25 + ELSER on `lesson_structure` (100%) + `lesson_content` (~81%) | `rrf-query-builders.ts` |
| **Curated synonyms** | ~580 entries across 17 subjects via `synonym_graph` filter | `src/mcp/synonyms/` |
| **Phrase detection** | Multi-word curriculum terms detected for phrase boosting | `detect-curriculum-phrases.ts` |
| **Ground-truth harness** | 120 queries across 30 subject-phases with MRR benchmarking | `ground-truth/` |

**ES Analyser Configuration** (`es-analyzer-config.ts`):

- `oak_text_index`: `standard` tokeniser + `lowercase` (index time)
- `oak_text_search`: `standard` tokeniser + `lowercase` + `oak_syns_filter` (search time)
- `oak_syns_filter`: `synonym_graph` type with updateable `oak-syns` set

### Subject Complexity Varies Dramatically

| Subject | Synonym Lines | Complexity Notes |
|---------|---------------|------------------|
| **maths** | 375 | Rich vocabulary: operations, algebra, trigonometry, geometry, statistics |
| **science** | 37 | Underdeveloped; needs physics/chemistry/biology sub-domains |
| **cooking-nutrition** | 170 | Practical vs theory distinction matters |
| **citizenship** | 178 | Overlap with RSHE/PSHE vocabulary |

**Maths secondary and science secondary require special attention** due to:

- **High vocabulary density**: Many synonymous expressions per concept (e.g., trigonometry has 14 variants)
- **Cross-topic relationships**: Algebra ↔ graphs ↔ geometry interconnections
- **Exam board variance**: Science has AQA, Edexcel, OCR variants at KS4
- **Notation variance**: Mathematical symbols vs spoken forms (e.g., "y = mx + c" vs "y equals mx plus c")
- **Tier differentiation**: Foundation vs Higher content with shared vocabulary but different depth

### Future Direction

Static vocabulary analysis (mining) will eventually move **upstream** to the bulk-data generation pipeline, rather than being part of sdk-codegen. This keeps vocabulary extraction close to the source data while the SDK remains a consumer of generated artefacts.

---

## What success looks like

Implementing these patterns should produce:

* Better recall for **aliases, abbreviations, and curriculum jargon** (without synonym explosion)
* Better precision via **sense gating** (subject/phase-aware expansion)
* Better ordering for natural-language queries using **native reranking**
* A safer vocabulary strategy that separates:

  * equivalence ("same thing")
  * relationships ("related things")
  * structure ("filters and scope")
* A roadmap to scale: mining, review workflows, versioning, and governance

---

## Contents

### Start here

* **[documentation-gap-analysis.md](./documentation-gap-analysis.md)**
  A gap analysis and remediation plan for strengthening this document set into an operational playbook: query-shape taxonomy, confidence model, retriever catalogue, definitions capability, latency/fallback, versioning, governance.

### Vocabulary & meaning model

* **[handling-existing-synonymish-things.md](./handling-existing-synonymish-things.md)**
  How to safely manage an existing large "synonym-ish" corpus by separating strict equivalence from paraphrase/relationships/sense-bound terms.
* **[aliases-and-equivalances.md](./aliases-and-equivalances.md)**
  How to mine and apply strict equivalences (aliases, abbreviations, formatting variants) without polluting results across senses.
* **[data-and-domain-vocabulary.md](./data-and-domain-vocabulary.md)**
  How to handle cross-subject structural vocabulary (subjects, key stages, exam boards, tiers) and definitions as separate assets from subject-specific terms.

### Elastic Serverless strategy

* **[elasticsearch-approaches.md](./elasticsearch-approaches.md)**
  A practical "best next moves" guide for Elastic Serverless-native improvements using `semantic_text`, retrievers, RRF, query rules, semantic reranking, and (optionally) dense retrieval.
* **[uses-of-structured-domain-knowledge.md](./uses-of-structured-domain-knowledge.md)**
  A broad survey of ways structured vocabulary can improve retrieval (sense classification signals, expansion, boosting, routing, observability).

### Mining pipeline

* **[python-mining-workspace.md](./python-mining-workspace.md)**
  Governance and scope boundaries for the offline vocabulary mining pipeline. Mining proposes; humans decide.

---

## Recommended reading order

1. **[documentation-gap-analysis.md](./documentation-gap-analysis.md)** (sets the improvement spine)
2. **[handling-existing-synonymish-things.md](./handling-existing-synonymish-things.md)** (prevents relevance regressions early)
3. **[aliases-and-equivalances.md](./aliases-and-equivalances.md)** (what to mine and how to apply it safely)
4. **[data-and-domain-vocabulary.md](./data-and-domain-vocabulary.md)** (structural terms + definitions strategy)
5. **[elasticsearch-approaches.md](./elasticsearch-approaches.md)** (Elastic-native execution plan)
6. **[uses-of-structured-domain-knowledge.md](./uses-of-structured-domain-knowledge.md)** (idea inventory and tuning levers)

---

## Highest ROI experiments to run next

These are ordered to maximise impact while minimising risk and complexity.

### Short-term

1. **Add semantic reranking on top of existing RRF**

   * Why: often the biggest "it understands me" improvement for natural-language queries and ambiguous terms.
   * What to read: **[elasticsearch-approaches.md](./elasticsearch-approaches.md)**
   * Elastic docs:

     * [Semantic reranking](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking)
     * [`text_similarity_reranker` retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever)
     * [Retriever framework overview](https://www.elastic.co/docs/solutions/search/retrievers-overview)

2. **Introduce Query Rules + rule retriever for "head" patterns**

   * Why: deterministic fixes for definition-style and navigational queries; reduces brittle client logic.
   * Start small: "what is / define / meaning of", exact unit/lesson titles, known benchmark failures.
   * Elastic docs:

     * [Rule retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rule-retriever)
     * [RRF retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever)
   * Practical reading:

     * [Semantic search + Query rules (Elastic Search Labs)](https://www.elastic.co/search-labs/blog/semantic-search-query-rules)

3. **Audit existing synonyms for bucket classification**

   * Why: prevents cross-sense pollution and precision regressions.
   * Action: classify entries as strict equivalence (Bucket A) vs relationships (Bucket D).
   * Current state: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/` — ~580 curated entries
   * Elastic docs:

     * [Search with synonyms](https://www.elastic.co/docs/solutions/search/full-text/search-with-synonyms)
     * [`synonym_graph` token filter](https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter)
     * [Synonyms API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym)

4. **Expand science secondary synonyms**

   * Why: science synonyms (37 lines) are underdeveloped compared to maths (375 lines).
   * Action: add physics, chemistry, biology sub-domain vocabulary following the maths pattern.
   * Focus areas: equations/formulae, scientific terminology, practical vocabulary.

5. **Improve observability while tuning**

   * Use these constantly during iteration:

     * [_analyze API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze)
     * [Explain API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-explain.html)
     * [Profile API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-profile.html)

---

### Long-term

1. **Create the missing "decision spine" documents**

   * Deliverables (as called out in the gap analysis):

     * Query Shape Taxonomy
     * Confidence Model
     * Retriever Tree Catalogue ("profiles")
     * Latency & fallback policy
     * Versioning/deprecation/governance model
   * Why: prevents drift as rules, vocab, and retriever trees expand.
   * What to read: **[documentation-gap-analysis.md](./documentation-gap-analysis.md)**

2. **Build a reviewable mining → promotion pipeline**

   * Mine per subject-phase → produce artefacts → human review → deploy to Elastic synonym sets / relationship fields / rule sets.
   * Why: scales domain knowledge without sacrificing quality.
   * Future: mining will move upstream to bulk-data generation.
   * What to read: **[aliases-and-equivalances.md](./aliases-and-equivalances.md)**

3. **Add a "relationship channel" as a separate retriever (not synonyms)**

   * Index relationship expansions into a dedicated field (`related_terms` or similar).
   * Add a retriever targeting that field; fuse via RRF; let reranking decide ordering.
   * Why: captures domain adjacency without polluting equivalence logic.

4. **Consider a second semantic channel (dense retrieval) only if you see gaps**

   * Particularly useful for multilingual/MFL or paraphrase-heavy queries.
   * Elastic-native option: Elastic Inference Service endpoints.
   * Docs:

     * [Elastic Inference Service](https://www.elastic.co/docs/explore-analyze/elastic-inference/eis)
     * [kNN search](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html)

5. **Plan for feature-based ranking / LTR only after the above stabilises**

   * You already have labelled data and a benchmark harness; LTR becomes the natural next lever once:

     * query shapes are explicit,
     * retriever profiles are stable,
     * observability is strong.

---

## How to use this folder in practice

* Treat these docs as a **design and tuning playbook**.
* When you change retrieval behaviour, update:

  * which vocabulary bucket it affects (equivalence vs relationship vs structural),
  * which retriever profile it belongs to,
  * and how it is measured in your benchmark harness.

If you only do one thing: **make every change traceable to a named strategy** (retriever profile + vocabulary bucket + expected metric impact). That discipline is what keeps search relevance improvements compounding rather than oscillating.

---

## Quick external links (Elastic docs hub)

* [semantic_text field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
* [Semantic search with semantic_text](https://www.elastic.co/docs/solutions/search/semantic-search/semantic-search-semantic-text)
* [Retrievers overview](https://www.elastic.co/docs/solutions/search/retrievers-overview)
* [RRF retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever)
* [Rule retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rule-retriever)
* [Semantic reranking](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking)
* [`text_similarity_reranker` retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever)
* [Search with synonyms](https://www.elastic.co/docs/solutions/search/full-text/search-with-synonyms)
* [`synonym_graph` token filter](https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter)
* [Synonyms API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym)

---

## Oak Codebase Locations

| Component | Path | Purpose |
|-----------|------|---------|
| **Synonym corpus** | `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/` | Curated synonym data (~580 entries) |
| **ES analyser config** | `packages/sdks/oak-sdk-codegen/code-generation/typegen/search/es-analyzer-config.ts` | `synonym_graph` filter configuration |
| **RRF query builders** | `apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts` | Four-way RRF construction |
| **Phrase detection** | `apps/oak-search-cli/src/lib/query-processing/detect-curriculum-phrases.ts` | Multi-word curriculum term detection |
| **Ground truth** | `apps/oak-search-cli/src/lib/search-quality/ground-truth/` | 120 queries for MRR benchmarking |
| **Diagnostic queries** | `apps/oak-search-cli/src/lib/search-quality/ground-truth/diagnostic-synonym-queries.ts` | Synonym expansion pattern tests |
| **Synonym miner** | `packages/sdks/oak-curriculum-sdk/vocab-gen/generators/synonym-miner.ts` | TypeScript-based definition mining |
