
# Managing an Existing Large Synonym Set

> **Status**: Research documentation
> **Last Updated**: 2026-01-17

_How to stabilise, refactor, and safely evolve a mature synonym corpus in a hybrid Elastic search system_

> **Context — Oak Search Synonym Corpus**
>
> Oak Search has a **curated synonym corpus (~580 entries across 23 categories)** that is:
>
> - the **single source of truth** for MCP tools, Elasticsearch, and the Search App
> - hand-maintained with LLM-assisted review and explicit sensitivity handling
> - already deployed via Elasticsearch `synonym_graph` filter with updateable `oak-syns` set
>
> **Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`
>
> | Category | Lines | Notes |
> |----------|-------|-------|
> | maths.ts | 375 | Most complex — algebra, trig, geometry, statistics |
> | citizenship.ts | 178 | Overlap with RSHE/PSHE |
> | cooking-nutrition.ts | 170 | Practical vs theory distinction |
> | physical-education.ts | 183 | Sport-specific vocabulary |
> | science.ts | 37 | **Underdeveloped** — needs expansion |
>
> This document explains **how to work with that existing corpus**, without discarding it, while introducing **sense-gated behaviour, relationship-aware expansion, and mining-assisted evolution**.

This document assumes familiarity with:

- Elasticsearch hybrid search (BM25 + ELSER)
- Synonym sets and analyzers
- Query-time expansion and ranking fusion

---

## 1) First principle: do **not** replace the existing synonym set

Your current synonym corpus has several properties that are expensive or impossible to recreate automatically:

- It is **curated**, not scraped
- It encodes **curriculum and pedagogical intent**
- It has **human / LLM review** and explicit sensitivity handling
- It is already embedded in:
  - AI agent ontology responses
  - Elasticsearch synonym sets
  - Phrase detection and autocomplete logic

**Therefore:**

> The existing synonym corpus must be treated as a **high-trust lexical asset**, not raw material to be regenerated.

The correct strategy is **containment, classification, and controlled evolution**, not replacement.

---

## 2) The real issue: semantic overload, not synonym quality

The problem with the current corpus is **not correctness** — it is **semantic overload**.

At present, a single mechanism (“synonyms”) is being used to represent _multiple kinds of relationships_:

| What’s currently encoded as a “synonym” | What it really represents |
|----------------------------------------|----------------------------|
| `trigonometry ↔ sohcahtoa`              | Alias / abbreviation       |
| `nutrition ↔ nutrients`                | Conceptual adjacency       |
| `linear equations ↔ solving for x`      | Pedagogical paraphrase     |
| `climate change ↔ global warming`       | Near-synonym (contextual)  |
| `semibreve ↔ whole note`                | True system equivalence    |

These relationships **should not all be handled the same way** by Elasticsearch.

Treating them uniformly as synonyms causes:

- sense leakage across subjects
- over-expansion at query time
- relevance regressions that are hard to diagnose

---

## 3) Reframe the corpus using relationship buckets (no deletion required)

You do **not** need to rewrite or delete existing synonym files.

Instead, you change **how they are interpreted and consumed**.

### 3.1 Relationship buckets (conceptual model)

Reclassify synonym entries conceptually into four buckets:

| Bucket | Meaning | Typical examples |
|------|--------|------------------|
| **A. Alias / surface form** | Truly interchangeable strings | abbreviations, spelling variants |
| **B. Pedagogical paraphrase** | How teachers/students phrase ideas | “solve for x” |
| **C. Sense-bound term** | Same word, different meaning by subject | “nutrition”, “tone”, “model” |
| **D. Related concept** | Conceptual neighbour, not equivalence | “nutrition” ↔ “calories” |

Your existing corpus already contains **all four buckets**.

The key change is:  
> **Only Bucket A should be treated as true Elasticsearch synonyms.**

---

## 4) What to do with the existing synonym files (practically)

### 4.1 Freeze them as authoritative vocabulary

Do **not**:

- auto-regenerate them
- bulk-edit them based on mining output
- downgrade their review standards

Instead:

- treat them as **authoritative, reviewed vocabulary**
- version them explicitly
- evolve them deliberately

Think of them as:
> “Human-verified curriculum language knowledge”

---

### 4.2 Introduce a _consumption layer_ that differentiates behaviour

The architectural change happens **after** the synonym data is loaded, not inside the files themselves.

Instead of:

```ts
// Everything becomes an Elasticsearch synonym
buildElasticsearchSynonyms(allSynonyms);
```

Move towards:

```ts
buildElasticsearchSynonyms({
  strictEquivalents,
  paraphrases,
  senseBound,
  related,
});
```

You can achieve this by:

- classifying entries at export time, or
- introducing lightweight annotations or metadata at the consumption boundary

No large-scale rewrite of existing files is required.

---

## 5) Deciding what qualifies as a _true_ Elasticsearch synonym

### 5.1 Criteria for strict equivalence (Bucket A)

An entry should only be deployed as an Elasticsearch synonym if:

- Substitution preserves meaning in **all contexts**
- Directionality does not matter (A ↔ B)
- Meaning does not depend on subject, phase, or pedagogy

**Good candidates**

- abbreviations and acronyms
- UK/US spelling variants
- notation/system equivalence (e.g. music note naming)

**Poor candidates**

- concept ↔ explanation
- concept ↔ prerequisite
- concept ↔ example

> **Rule of thumb:**  
> If you would hesitate to replace the term in a lesson title, it is **not** a strict synonym.

---

### 5.2 Everything else moves to query-time logic

Buckets **B, C, and D** should not be implemented as index-time synonyms.

Instead, they become:

- query-time expansions
- weakly boosted
- gated by subject/phase (“sense”)

This dramatically reduces unintended relevance drift.

---

## 6) How curated synonyms and mined relationships coexist

### 6.1 Different sources, different roles

| Source | Purpose |
|------|--------|
| Curated synonym corpus | Defines **how humans talk** about curriculum concepts |
| Mining outputs | Describe **how concepts relate within a specific subject/phase** |

They answer different questions:

- Curated synonyms:  
  _“What alternative terms might a user use for this concept?”_

- Mined relationships:  
  _“Given this subject and context, what else might be relevant?”_

They should **never be merged mechanically**.

---

## 7) Safe migration path (no flag day)

### Phase 0 — Current state

- Large synonym corpus deployed
- All entries treated uniformly

### Phase 1 — Containment

- Identify and extract **strict equivalences**
- Deploy only those as Elasticsearch synonym sets
- Keep the full corpus available to SDKs and agents

_No behavioural change yet._

### Phase 2 — Query-time reintroduction

- Reintroduce non-strict entries as:
  - phrase-level boosts
  - optional “should” clauses
  - sense-gated expansions

### Phase 3 — Mining-assisted evolution

- Use mining to **suggest** candidates
- Compare mined suggestions to curated vocabulary
- Prefer curated, reviewed terms where overlap exists

Mining assists judgement; it does not replace it.

---

## 8) What _not_ to do (hard constraints)

### ❌ Do not auto-generate synonyms from regex alone

Pattern mining finds text patterns, not semantic equivalence:

- translations mistaken for synonyms
- phoneme notation mistaken for vocabulary
- examples mistaken for definitions

Regex is useful for _candidate discovery_, not synonym definition.

### ❌ Do not let mining output write directly to synonym files

Mining output should go to:

- review queues
- relationship graphs
- experiment logs

Never directly into curated synonym sources.

### ❌ Do not collapse subject boundaries

Many terms are inherently sense-bound:

- “nutrition”
- “tone”
- “expression”
- “model”

Global synonymy for these terms is actively harmful.

---

## 9) Elasticsearch-specific guidance

### 9.1 Index-time

- Use `synonym_graph` for strict equivalences only  
  <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>
- Keep synonym sets:
  - small
  - stable
  - sense-scoped

### 9.2 Query-time

- Apply paraphrases and relationships at query time
- Gate expansions by subject/phase filters
- Use lower boosts than original query terms
- Fuse results using Reciprocal Rank Fusion  
  <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever>

This matches Elastic’s guidance:

- index-time synonymy for equivalence
- query-time logic for flexibility and safety

---

## 10) A shared mental model for the team

> **Synonyms are a scalpel, not a net.**

If a relationship is:

- **equivalent** → synonym  
- **contextual** → gate it  
- **explanatory** → expand it  
- **adjacent** → relate it  

Your existing corpus already encodes all of this knowledge.  
The task now is **precision of application**, not expansion of content.

---

## 11) TL;DR

- Keep the existing synonym corpus — it is high-value and hard-won
- Stop treating all entries as equivalent
- Restrict Elasticsearch synonym sets to true equivalence
- Move pedagogy, sense, and relationships to query-time logic
- Let mining _assist_ human judgement, not override it

---

### Further reading (external)

- Elasticsearch synonym_graph token filter:  
  <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>
- Elasticsearch Synonyms API:  
  <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym>
- Elasticsearch retrievers and RRF:  
  <https://www.elastic.co/docs/solutions/search/retrievers-overview>  
  <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever>
- Elasticsearch Analyze API (debugging analysis chains):  
  <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze>

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [README.md](./README.md) | Index and reading order |
| [aliases-and-equivalances.md](./aliases-and-equivalances.md) | Deep dive on mining strict equivalences |
| [data-and-domain-vocabulary.md](./data-and-domain-vocabulary.md) | Structural vocabulary and definitions |
| [elasticsearch-approaches.md](./elasticsearch-approaches.md) | Elastic-native implementation patterns |
| [uses-of-structured-domain-knowledge.md](./uses-of-structured-domain-knowledge.md) | Survey of all vocabulary levers |
| [python-mining-workspace.md](./python-mining-workspace.md) | Mining pipeline scope and governance |
| [documentation-gap-analysis.md](./documentation-gap-analysis.md) | Gaps and remediation plan |
