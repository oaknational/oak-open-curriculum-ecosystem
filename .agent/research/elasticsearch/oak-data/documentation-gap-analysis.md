# Gap Analysis and Remediation Plan for the Curriculum Search Documentation Set

> **Status**: Research documentation
> **Last Updated**: 2026-01-17

_Target environment: Elastic Serverless, hybrid retrieval (BM25 + semantic_text / ELSER), structured domain vocabulary, mining pipeline, TypeScript SDK_

## Implementation Status (as of 2026-01-17)

| Gap | Status | Notes |
|-----|--------|-------|
| Four-way RRF retrieval | ✅ Implemented | `rrf-query-builders.ts` |
| Curated synonyms | ✅ Implemented | ~580 entries in `src/mcp/synonyms/` |
| Phrase detection | ✅ Implemented | `detect-curriculum-phrases.ts` |
| Ground-truth harness | ✅ Implemented | 120 queries, MRR benchmarking |
| Query Shape Taxonomy | ❌ Not implemented | Gap A still open |
| Confidence Model | ❌ Not implemented | Gap B still open |
| Retriever Tree Catalogue | ⚠️ Partial | Defined in code, not documented |
| Definitions Capability | ❌ Not implemented | Gap D still open |
| Semantic Reranking | ❌ Not implemented | Recommended next step |
| Query Rules | ❌ Not implemented | Recommended next step |

---

This document is a **comprehensive gap analysis and remediation plan** for the collection of search-related documents produced so far.
It is intended to be **added verbatim to the document collection**, after which another agent (or team) will update the existing documents to close the identified gaps.

All references in this document are either:

- **descriptions of concepts already present in the doc set**, or
- **links to publicly accessible Elastic documentation or blogs**.

---

## 1) Executive diagnosis

### What the document set already does well

Across the current documents, the system already has strong foundations:

- A **clear bucketed model of vocabulary**:
  - strict equivalence (aliases)
  - pedagogical paraphrase
  - sense-bound terms
  - domain relationships  
- A principled rejection of “everything is a synonym”, with strong guidance on avoiding synonym explosion.
- A two-phase architecture:
  - offline mining (Python)
  - online application (Elastic Serverless + TypeScript SDK).
- Correct identification of **modern Elastic-native levers**:
  - `semantic_text`
  - retriever framework
  - Reciprocal Rank Fusion (RRF)
  - rule retriever
  - semantic reranking.
- Explicit treatment of **cross-subject structural vocabulary** (subjects, key stages, exam boards, tiers).
- Recognition that mining must be **review-assisted**, not automatic.

In short: the system is **conceptually sound and technically modern**.

---

### What is missing (high-level)

What the documentation set lacks is not features, but **decision structure**.

Specifically, it is missing:

- an explicit model of **how decisions are made**
- an explicit notion of **confidence and thresholds**
- an explicit catalogue of **supported retrieval strategies**
- explicit **operational constraints** (latency, fallback, failure)
- explicit **governance and lifecycle rules**

Without these, the system will work — but it will be **fragile, hard to tune, and hard to explain**.

---

## 2) Detailed gap analysis

### Gap A — No explicit _Query Shape Taxonomy_

**What’s missing**

The documents refer informally to:

- definition queries
- navigational queries
- exploratory queries
- revision / exam queries
- practice / worksheet queries

…but these are never defined as a **stable, named taxonomy**.

**Why this matters**

Elastic-native mechanisms such as:

- query rules
- retriever routing
- reranking
- pinning

all work best when driven by a **small, explicit set of query shapes**.

Without this:

- rule sets become ad hoc
- retriever selection logic spreads across code
- benchmarking becomes ambiguous (“which behaviour was tested?”)

**Remediation**

Create a canonical **Query Shape Taxonomy** document that:

- defines 5–8 query shapes
- gives examples for each
- specifies which Elastic levers are allowed or required for each shape

**Suggested content to add**

- A table:  
  `query shape → allowed retrievers → expansion policy → rerank policy → pinning rules`.

---

### Gap B — No explicit _Confidence Model_

**What’s missing**

The documents repeatedly state:

- “only apply when sense is known”
- “be conservative”
- “prefer doing nothing to doing the wrong thing”

…but never define what “known” or “conservative” means.

**Why this matters**

Without an explicit confidence model:

- behaviour will drift as rules and vocab grow
- debugging becomes subjective
- expansions and routing become unpredictable

**Remediation**

Introduce a simple **Confidence Tier Model**, for example:

- `CERTAIN`
- `HIGH`
- `MEDIUM`
- `LOW`

Then explicitly define:

- how confidence is derived (filters present, rule strength, vocab density, etc.)
- which actions are allowed at each tier

**Suggested content to add**

- A matrix mapping confidence tier → allowed expansions, reranking, pinning, routing.

---

### Gap C — No authoritative _Retriever Tree Catalogue_

**What’s missing**

The documents show examples of retriever composition, but do not define:

- which retriever trees are _supported_
- which are experimental
- which are deprecated

**Why this matters**

Elastic’s retriever framework makes it easy to create many combinations.  
Without an explicit catalogue:

- behaviour diverges across services
- benchmarks become incomparable
- maintenance cost rises sharply

**Remediation**

Create a **Retriever Tree Catalogue** that defines:

- a small set of named retrieval profiles (e.g. `baseline_hybrid`, `definition_first`, `hybrid_plus_rerank`)
- their exact composition (BM25, semantic, rules, rerank)
- their intended query shapes
- their latency expectations

**Suggested content to add**

- One section per retriever profile
- Canonical JSON examples
- Notes on when _not_ to use each profile

---

### Gap D — No concrete _Definitions Capability Design_

**What’s missing**

Definitions are discussed as important, but there is no concrete design for:

- where definitions live
- how they are indexed
- how they are retrieved
- how they are ranked relative to lessons

**Why this matters**

“what is X” queries are extremely common and high-value.
Without a definition strategy:

- relationship expansion may act as a poor substitute
- semantic reranking must do too much work

**Remediation**

Define a **Definitions Capability**, entirely Elastic-native:

- a `definition_text` field (and optionally a `semantic_text` definition field)
- a dedicated definition retriever
- rule-based routing for definition-seeking queries
- fusion with general lesson retrieval

**Suggested content to add**

- Field vs index trade-offs for definitions
- Example retriever tree including a definition channel
- Behaviour when no definition exists

---

### Gap E — Missing _Negative Controls_ (demotion and exclusion)

**What’s missing**

The docs focus heavily on:

- expansion
- boosting
- inclusion

They rarely discuss:

- demotion
- exclusion
- penalties for mismatch

**Why this matters**

Without negative controls:

- ambiguous queries drift toward overly broad results
- sensitive domains risk over-recall
- ranking quality degrades silently

**Remediation**

Explicitly design:

- subject mismatch penalties
- phase mismatch penalties
- exclusion rules for known-bad matches
- sensitivity guardrails (e.g. RSHE / RE)

**Suggested content to add**

- Examples of demotion logic
- When to exclude vs demote
- How this interacts with RRF and reranking

---

### Gap F — No explicit _Latency Budget and Degradation Policy_

**What’s missing**

The docs say “low latency preferred”, but do not define:

- target p50 / p95 budgets
- which stages are optional
- when expensive stages should be disabled

**Why this matters**

Elastic makes it easy to add:

- rerankers
- dense retrieval
- additional channels

Without a budget:

- performance regressions are inevitable
- operational decisions become reactive

**Remediation**

Define:

- latency budgets per stage (retrieval, fusion, rerank)
- a degradation policy (drop rerank, reduce top-K, disable dense channel)
- monitoring requirements

**Suggested content to add**

- A latency budget table
- A “graceful degradation ladder”

---

### Gap G — No explicit _Failure Modes and Fallback Plan_

**What’s missing**

There is no documented behaviour for:

- inference endpoint failures
- missing synonym sets
- misconfigured rules
- partial indexing failures

**Why this matters**

In serverless environments:

- inference endpoints are managed
- failures are inevitable
- silent degradation is dangerous

**Remediation**

Document explicit fallbacks:

- semantic failure → BM25-only retriever
- rule failure → bypass rules
- synonym failure → analyzer fallback + alert

**Suggested content to add**

- Failure scenarios
- Expected system behaviour
- Required logging

---

### Gap H — No _Versioning, Rollout, and Deprecation Strategy_

**What’s missing**

The docs discuss:

- curated vocab
- mined suggestions
- rules

…but not:

- how they are versioned
- how they are rolled out
- how they are rolled back
- how they are retired

**Why this matters**

Without lifecycle rules:

- the system only grows
- regressions are hard to isolate
- cleanup never happens

**Remediation**

Define:

- versioning conventions for vocab, rules, retriever profiles
- rollout stages (staging → canary → production)
- rollback criteria
- deprecation policy

---

### Gap I — No explicit _Ownership and Governance Model_

**What’s missing**

The docs assume review and care, but do not define:

- who owns synonyms
- who owns rules
- who approves mined promotions
- who handles sensitive domains

**Why this matters**

Search systems fail socially before they fail technically.
Unclear ownership leads to:

- stalled improvements
- risky changes
- inconsistent standards

**Remediation**

Define ownership per asset class:

- synonyms
- definitions
- rules
- mining pipeline
- sensitivity review

---

## 3) Remediation plan (phased)

### Phase 1 — Decision clarity (high priority)

**Deliverables**

- Search Decision Model
- Query Shape Taxonomy
- Confidence Model

**Outcome**

- All future behaviour is grounded in explicit decisions.

---

### Phase 2 — Elastic-native routing and retrieval

**Deliverables**

- Retriever Tree Catalogue
- Query Rules Strategy
- Definition routing rules

**Outcome**

- Behaviour is deterministic, benchmarkable, and consistent.

---

### Phase 3 — Content capabilities

**Deliverables**

- Definitions capability design
- Relationship channel design (field + retriever)

**Outcome**

- High-value query types are first-class.

---

### Phase 4 — Operations and governance

**Deliverables**

- Latency and degradation policy
- Failure and fallback plan
- Versioning, rollout, and deprecation policy
- Ownership model

**Outcome**

- System is safe to evolve long-term.

---

## 4) Suggested new documents to add

1. **Search Decision Model (Authoritative)**
   - Inputs
   - Derived signals
   - Retriever selection
   - Expansion policy
   - Rerank policy
   - Rule policy
   - Explain/log contract

2. **Query Shape Taxonomy**
   - Definitions
   - Detection signals
   - Allowed Elastic levers

3. **Confidence Model**
   - Tiers
   - Evidence sources
   - Allowed actions

4. **Retriever Tree Catalogue**
   - Named profiles
   - JSON definitions
   - Intended usage

5. **Definitions Capability Design**
   - Data model
   - Retrieval strategy
   - Fusion behaviour

6. **Operations & Governance**
   - Latency budgets
   - Fallbacks
   - Ownership
   - Deprecation

---

## 5) Acceptance criteria

The documentation set is “complete” when:

- Every behaviour is traceable to the Search Decision Model
- Every expansion is gated by confidence
- Every retriever profile is named and versioned
- Definitions are first-class, not incidental
- Latency and failure are explicitly handled
- Ownership and review are unambiguous

---

## 6) Final framing

You already have the _parts_.  
What you are missing is the **decision spine** that connects them.

Once that spine exists, the rest of the system becomes:

- easier to reason about
- easier to tune
- easier to explain
- safer to evolve

This remediation plan is designed to get you there with minimal rework and maximum leverage from the documents you already have.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [README.md](./README.md) | Index and reading order |
| [handling-existing-synonymish-things.md](./handling-existing-synonymish-things.md) | Managing existing synonym corpus |
| [aliases-and-equivalances.md](./aliases-and-equivalances.md) | Mining strict equivalences |
| [data-and-domain-vocabulary.md](./data-and-domain-vocabulary.md) | Structural vocabulary and definitions |
| [elasticsearch-approaches.md](./elasticsearch-approaches.md) | Elastic-native implementation patterns |
| [uses-of-structured-domain-knowledge.md](./uses-of-structured-domain-knowledge.md) | Survey of all vocabulary levers |
| [python-mining-workspace.md](./python-mining-workspace.md) | Mining pipeline scope and governance |
