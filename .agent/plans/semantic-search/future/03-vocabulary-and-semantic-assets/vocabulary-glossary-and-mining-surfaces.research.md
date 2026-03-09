# Vocabulary, Glossary, and Mining Surfaces

**Boundary**: vocabulary-and-semantic-assets  
**Status**: Research  
**Last Updated**: 6 March 2026

---

## Scope

This document focuses on richer curriculum vocabulary assets:

- keyword objects and definitions
- aliases, synonyms, paraphrases, and sense-bound terms
- glossary-style and reference-index surfaces
- mined assets that already exist but are not yet first-class consumers

It does **not** define query-shape routing. Query policy remains authoritative in
Boundary 05.

---

## Executive Summary

The repo already has most of the ideation needed for a serious curriculum
vocabulary system.

- Bulk lessons provide expert-authored keyword definitions.
- The repo already distinguishes strict aliases, paraphrases, sense-bound terms,
  and relationship terms.
- The runtime already indexes some lesson vocabulary signals and already mines
  others.
- Mappings and builders for glossary/reference-style surfaces already exist.

The gap is not “do we have the idea?” The gap is “have we promoted those assets
into stable, first-class surfaces with provenance, governance, and consumers?”

---

## Current Asset Classes

### 1. Lesson Keyword Terms

Current lesson indexing keeps keyword **terms** as `lesson_keywords`.

This is useful for BM25, but it is only the thinnest slice of the underlying
asset. The richer object also contains:

- definition text
- subject spread
- lesson provenance
- first-introduction heuristics

### 2. Vocabulary Mining Outputs

The mining pipeline already extracts:

- keywords
- misconceptions
- learning points
- teacher tips
- prior knowledge
- NC statements
- threads

It also supports derived synonym mining from keyword definitions.

### 3. Curated Synonym Assets

The repo already has a strong conceptual model:

- alias
- paraphrase
- sense-bound term
- relationship term

This is important because not all “synonym-ish” assets should be handled as ES
synonym rules. Some belong in query-time policy or separate relationship
channels.

### 4. Glossary and Reference Index Scaffolding

The codebase already contains mapping and builder work for glossary/reference
surfaces. That means the question is less about feasibility and more about:

- source of truth
- provenance
- consumer contract
- operational ownership

---

## What Is Missing Today

### Stable Keyword Identity

The current live lesson surface largely treats keywords as lesson-local strings.
That loses the idea that “photosynthesis” or “coefficient” is a reusable domain
asset with:

- a canonical term
- one or more definitions
- subject and key-stage provenance
- lesson provenance
- a confidence or curation state

### First-Class Definition Surfaces

Definitions appear in summaries and mining, but not yet as a stable,
independently searchable curriculum vocabulary surface.

This is the clearest place where the historical `lesson_keywords_detailed`
concept matters: it points to an earlier instinct that full keyword objects
should survive ingestion.

### Provenance Model

A richer vocabulary surface needs to distinguish at least:

- `oak.keyword` — directly from lesson keyword objects
- `curated` — hand-authored or manually reviewed additions
- `mined` — derived from definitions or transcripts

Without provenance, vocabulary assets become hard to trust and hard to roll
back.

### Runtime Consumer Gap

The repo already plans or scaffolds several consumers, but not all are fully
operational:

- glossary-style retrieval
- domain-term boosting
- concept suggestions
- misconception guidance
- relationship-aware query expansion

---

## Candidate Vocabulary Surfaces

### A. Nested Keyword Objects On Lessons

Pros:

- keeps lesson-local provenance close to the source
- simplest bridge from current lesson ingestion

Cons:

- duplicates the same term across many lessons
- weak for term-first retrieval and global curation

### B. Dedicated Curriculum Glossary Index

Pros:

- term-first retrieval becomes natural
- provenance and curation can be explicit
- suggestions and definition queries are cleaner
- easier to add `semantic_text`, `search_as_you_type`, and exact term routing

Cons:

- requires dedicated ingestion and versioning
- must reconcile duplicate definitions and subject-specific sense boundaries

### C. Versioned Domain Vocabulary Sets

These are not the same as glossary entries. They are operational assets for:

- term boosting
- typo correction preference
- subject-gated disambiguation
- suggestion generation

The repo’s existing synonym classification model already supports this split.

---

## Richer Mining Opportunities

### Definition-Derived Assets

Keyword definitions can power:

- glossary documents
- domain vocabulary sets
- alias candidates
- paraphrase candidates
- sense-bound disambiguation hints

### Transcript-Derived Assets

Transcript mining should stay higher-risk and lower-confidence than keyword
definitions, but it can add:

- teacher-language paraphrases
- plain-English reformulations
- misconception pairings

This is where query-log and transcript evidence should complement bulk metadata,
not replace it.

### Misconception and Guidance Assets

The repo already mines misconception prompts but can go further with:

- misconception → response pairs
- guidance area and supervision signals
- subject/key-stage prevalence

That would create a better “how do I address this?” surface than a flat array on
lesson documents.

---

## Candidate Asset Shapes

These are exploratory shapes for reasoning and comparison. They are not yet a
committed schema or plan-level contract.

### 1. Glossary Asset

- canonical term
- term slug
- definition
- subject/key-stage provenance
- lesson provenance
- provenance type
- optional semantic field

### 2. Domain Vocabulary Asset

- canonical term
- allowed aliases
- subject gating
- key-stage or phase gating
- asset class: alias, paraphrase, sense-bound, relationship
- deployment policy: synonym set, weak expansion, boost-only, relationship-only

### 3. Guidance Asset

- misconception
- response
- subject/key-stage provenance
- linked lessons/units
- optional relation to keywords or learning points

---

## Constraints

- Sense-bound terms must not be promoted into global synonym behaviour without
  subject or phase discipline.
- Bulk data is strong on expert-authored definitions but weak on real user query
  behaviour.
- Operational consumers need rollback and versioning for mined assets.
- Query policy should decide when specialised vocabulary surfaces are used; this
  document only maps the assets and their potential consumers.

---

## Highest-Leverage Next Questions

1. Should the first glossary step be nested lesson objects or a dedicated
   glossary index?
2. Which provenance states are allowed into live retrieval?
3. Which vocabulary assets belong in ES synonym sets versus query-time logic?
4. How do we join glossary assets to thread/sequence and learning-graph
   surfaces without collapsing them into one giant ontology?

---

## Confidence Summary

| Finding | Confidence | Evidence |
|---------|------------|----------|
| The repo already has strong vocabulary-system thinking | High | Verified in future plans, ADRs, and existing research |
| Glossary/reference surfaces are scaffolded but not yet fully operationalised | High | Verified in existing mappings/builders and future plans |
| Stable keyword identity is a major missing layer | High | Current live usage is mostly flattened or lesson-local |
| Transcript mining should complement, not replace, keyword-definition assets | Medium | Supported by prior reflections, but operational approach still open |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [bulk-metadata-opportunities.research.md](bulk-metadata-opportunities.research.md) | Source audit for the raw curriculum signals |
| [vocabulary-mining.md](vocabulary-mining.md) | Existing future plan that this research strengthens |
| [../04-retrieval-quality-engine/definition-retrieval.md](../04-retrieval-quality-engine/definition-retrieval.md) | Specialised retrieval path that consumes glossary-style assets |
| [ADR-063](../../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) | Synonym source-of-truth architecture |
| [ADR-086](../../../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) | Bulk mining and graph export pattern |
| [ADR-104](../../../../../docs/architecture/architectural-decisions/104-domain-term-boosting.md) | Domain-term boosting strategy |
