# Learning Graph Surfaces

**Boundary**: retrieval-quality-engine  
**Status**: Research  
**Last Updated**: 6 March 2026

---

## Scope

This document explores graph-like curriculum surfaces that can be built from the
current lesson, unit, thread, and sequence data.

Here, “learning graph” means any reusable relationship surface that helps answer
questions such as:

- what should I learn before this?
- how does this idea progress over time?
- which concepts are taught together?
- which misconceptions attach to which concepts?

It does **not** commit the repo to a specific graph database or multi-hop runtime
architecture.

---

## Executive Summary

The repo already has several strong graph-adjacent assets:

- prerequisite graph
- thread progression data
- vocabulary extraction
- misconception extraction
- NC coverage extraction

What is still missing is a coherent set of **consumer surfaces**. Several assets
exist as generated artefacts or plans, but do not yet show up as stable,
searchable, explainable Elasticsearch or MCP experiences.

That means the opportunity is not “invent a graph”. The opportunity is “promote
existing relationship assets into first-class retrieval and navigation
surfaces”.

---

## Existing Relationship Assets

### Explicit

- unit prior knowledge requirements
- unit threads with order
- national curriculum coverage
- lesson keyword definitions
- lesson misconceptions with responses

### Derived

- prerequisite graph edges
- thread progression graph
- mined synonyms from definitions
- lesson-to-unit and unit-to-sequence relationships

---

## Candidate Learning Graph Layers

### 1. Term Layer

Boundary note: the term layer is fundamentally a Boundary 03 asset-generation
concern. It is included here to show the full graph surface, not to supersede
the vocabulary asset model. See
[../03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md](../03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md)
for the authoritative vocabulary-asset framing.

Nodes:

- keyword terms
- glossary terms
- paraphrases and aliases

Edges:

- alias of
- paraphrase of
- defined in
- taught in

### 2. Lesson and Unit Pedagogy Layer

Nodes:

- lessons
- units
- learning points
- misconceptions

Edges:

- teaches
- addresses misconception
- belongs to unit
- precedes / follows within unit

### 3. Curriculum Structure Layer

Nodes:

- units
- threads
- sequences

Edges:

- in thread
- in sequence
- earlier in progression
- prerequisite of

These layers can stay separate as surfaces even if, conceptually, they form one
larger curriculum graph.

---

## Elasticsearch-Native Surfaces

The most credible near-term path is not “replace Elasticsearch with a graph
store”. It is to create **graph-adjacent indices or derived documents** that
make relationship questions cheap to answer inside the existing search system.

### Strong Candidate Surfaces

1. **Curriculum glossary surface**
   - term, definition, provenance, subject/key-stage spread
2. **Prerequisite surface**
   - unit-to-unit prerequisite edges and supporting evidence
3. **Thread progression surface**
   - ordered unit progression with year and key-stage spans
4. **Misconception guidance surface**
   - misconception plus response, linked to lessons/units/terms
5. **Coverage surface**
   - NC statements linked to units, sequences, and possibly key concepts

These do not require full graph traversal to be useful. They simply expose
relationship-rich assets as first-class documents.

---

## Combining Prior Knowledge and Learning Points

Combining prior knowledge and learning points into a high-level “learning graph”
is one of the strongest opportunities in this area.

The most plausible model is:

- treat unit `priorKnowledgeRequirements` as incoming prerequisites
- treat lesson `keyLearningPoints` as outgoing taught capabilities
- connect them through unit and thread structure

This gives a useful directional pattern:

```text
prior knowledge
  → unit entry expectations
  → lesson learning points
  → thread progression
  → later unit entry expectations
```

Even without perfect canonical concept IDs, this can support:

- “what comes before?”
- “what does this prepare students for?”
- “show me the progression through this concept family”

The key is to keep the first implementation grounded in explicit curriculum
signals rather than jumping immediately to speculative ontology work.

---

## Where The Current Repo Is Strong

- Strong extraction logic already exists.
- Strong future-state thinking already exists.
- The repo already distinguishes vocabulary, relationships, and retrieval
  mechanics more clearly than many systems do.

## Where The Current Repo Is Still Thin

- relationship assets are not yet consistently exposed as stable ES or MCP
  surfaces
- glossary-like assets remain partially scaffolded
- several generated artefacts still lack runtime consumers
- thread and sequence search do not yet fully benefit from relationship assets

---

## Safeguards

- Keep asset generation separate from query policy.
- Keep relationship assets separate from operational synonym rules.
- Use provenance and confidence rather than pretending all mined edges are equal.
- Favour ES-native, inspectable surfaces first; promote to heavier graph
  solutions only if the simpler model is exhausted.

---

## Confidence Summary

| Finding | Confidence | Evidence |
|---------|------------|----------|
| The repo already has graph-adjacent asset generation | High | Verified in extractors, generated artefacts, and ADRs |
| Consumer surfaces lag behind generated assets | High | Multiple assets or plans exist without full runtime consumers |
| Prior knowledge plus learning points can support a useful high-level graph | Medium | Strong structural fit, but canonical concept identity remains open |
| ES-native surfaces should precede heavier graph architecture | High | Aligns with current repo direction and existing infrastructure |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [thread-sequence-derived-surfaces.research.md](thread-sequence-derived-surfaces.research.md) | Thin-target search surfaces that can consume relationship assets |
| [document-relationships.md](document-relationships.md) | Existing future plan for relationship-aware retrieval |
| [../03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md](../03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md) | Vocabulary asset layer that can feed graph-like surfaces |
| [ADR-086](../../../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) | Existing graph-export pattern |
| [ADR-110](../../../../../docs/architecture/architectural-decisions/110-thread-search-architecture.md) | Current thread retrieval contract and future upgrade note |
