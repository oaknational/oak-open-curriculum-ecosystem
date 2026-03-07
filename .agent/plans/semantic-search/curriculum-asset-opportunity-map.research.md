# Curriculum Asset Opportunity Map

**Status**: Research  
**Last Updated**: 6 March 2026

---

## Scope

This document answers five cross-cutting questions:

1. Which lesson signals exist but are not fully used?
2. Which unit signals exist but are not fully used?
3. Which thread and sequence signals could be derived from lessons and units?
4. Which richer vocabulary, glossary, synonym, and graph surfaces are feasible?
5. How should these opportunities be grouped so they do not become siloed?

It does **not** decide implementation sequencing or query-routing policy. Those
belong in the relevant boundary plans.

---

## Executive Summary

The repo already has the raw ingredients for a much richer curriculum search
system than the current live surfaces expose.

- Lessons carry more structured pedagogical data than the current lesson index
  or mining pipeline fully uses.
- Units already expose strong structural and pedagogical fields, but we are not
  yet aggregating lesson-level pedagogy up into unit-level search surfaces.
- Threads and sequences are currently under-described search targets. They can
  become much more useful by deriving richer summaries and suggestion signals
  from units and lessons.
- Vocabulary, glossary, and graph thinking in the repo is already strong; the
  main gap is operationalising mined assets as first-class Elasticsearch and MCP
  surfaces.

The highest-leverage shift is to treat curriculum signals as **assets** first
and **retrieval inputs** second. That makes them reusable across search, MCP,
glossary, and future graph-backed experiences.

---

## Short Answers

The detailed, authoritative signal lists live in the boundary-local research
documents linked below. The answers here are a synthesis, not a replacement.

### 1. Lessons

We currently use keyword terms, misconception text, learning points, teacher
tips, prior knowledge, NC statements, and threads in the mining pipeline, plus
some flattened lesson fields in lesson indexing.

We are **not** getting full value from:

- keyword definitions
- misconception responses
- structured content-guidance detail
- `transcript_vtt`
- lesson-level transcript coverage and asset coverage signals
- dedicated, independently indexable lesson keyword objects

### 2. Units

Units already retain more than lessons do in the search surface, but we are not
yet constructing stronger unit-level pedagogy from lesson data.

High-value constructable unit signals include:

- aggregated keyword terms and definitions
- aggregated learning points
- aggregated misconception plus response patterns
- aggregated teacher tips
- ordered lesson-path summaries from `unitLessons[].lessonOrder`
- transcript/download coverage summaries

### 3. Threads and Sequences

Both are currently thinner than the data available beneath them.

- Threads can gain year spans, key-stage spans, ordered units, lesson counts,
  category coverage, and derived pedagogical summaries.
- Sequences can gain semantic summaries, counts, thread coverage, representative
  concepts, and much better suggestion inputs.

### 4. Richer Mining

The most promising richer assets are:

- glossary/reference surfaces for keyword definitions
- versioned domain vocabulary sets for boosting and suggestions
- relationship assets joining prior knowledge, learning points, keywords, and
  thread progression
- derived graph-like indices for prerequisites, misconceptions, coverage, and
  term provenance

### 5. Better Than The Older Future Docs

The older `future/` plans already contain good ideas, but much of the durable
analysis was trapped inside backlog documents. This research pack extracts that
thinking into boundary-local research companions so future plans can stay
lighter, more promotable, and easier to evolve.

---

## Opportunity Tiers

These tiers are **research prioritisation signals**, not a committed execution
sequence.

### High Feasibility

- Wire existing but unused extractors and structured fields into the mining view
- Treat keyword definitions as first-class assets, not just summary text
- Populate richer thread and sequence semantic surfaces from existing data
- Fix obvious partial implementations such as `sequence_semantic` remaining
  unmapped in practice

### Medium Feasibility

- Add glossary/reference surfaces with clear provenance
- Add relationship-aware derived surfaces for prerequisites, misconceptions, and
  thread progression
- Improve suggestion paths for threads, sequences, and concept-first queries

### Exploratory

- LLM-assisted transcript mining for paraphrases and teacher-language patterns
- Graph-backed traversal or graph-export consumers layered on top of ES-native
  surfaces
- Behaviour-driven mining from query logs and zero-hit telemetry

---

## Boundary Model

The cleanest split is:

- **Boundary 03** for curriculum signal assets:
  vocabulary, definitions, structured metadata, mined assets
- **Boundary 04** for retrieval surfaces:
  thread/sequence documents, graph-adjacent retrieval, specialised search paths
- **Boundary 05** for routing and policy:
  when a query should hit glossary-style or relationship-aware retrieval
- **Boundary 07** for operational guardrails:
  latency, rollback, versioning, ownership
- **Boundary 09** for evidence:
  ground truths and comparability

This avoids splitting by resource type alone. Resource scope should be a
dimension within the research, not the organising principle of the whole pack.

---

## Detailed Documents

| Question Area | Primary Research |
|---------------|------------------|
| Bulk lesson/unit audit + second-pass call chain | [Bulk Metadata Opportunities](future/03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md) |
| Domain vocabulary, glossary, synonyms, keyword identity | [Vocabulary, Glossary, and Mining Surfaces](future/03-vocabulary-and-semantic-assets/vocabulary-glossary-and-mining-surfaces.research.md) |
| Thread and sequence enrichment, search, and suggestions | [Thread and Sequence Derived Surfaces](future/04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md) |
| High-level learning graph and graph-adjacent ES surfaces | [Learning Graph Surfaces](future/04-retrieval-quality-engine/learning-graph-surfaces.research.md) |

---

## Confidence Summary

| Area | Confidence | Why |
|------|------------|-----|
| Bulk field inventory | High | Directly verified against schema, adapters, and builders |
| Missing mining outputs | High | Verified in `processBulkData()` and extractor inventory |
| Thread/sequence enrichment opportunities | High | Current docs are visibly thin relative to underlying data |
| Glossary/reference surface feasibility | Medium | Strong scaffold and plan evidence, but not fully operational in runtime |
| Behaviour-driven synonym mining | Medium | Strategically sound, but requires query telemetry rather than bulk alone |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [research-index.md](research-index.md) | Navigation for the full research pack |
| [ADR-089](../../../docs/architecture/architectural-decisions/089-index-everything-principle.md) | Architectural basis for capturing more signals |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first ingestion architecture |
| [ADR-110](../../../docs/architecture/architectural-decisions/110-thread-search-architecture.md) | Current thread-search contract and limits |
