# Thread and Sequence Derived Surfaces

**Boundary**: retrieval-quality-engine  
**Status**: Research  
**Last Updated**: 6 March 2026

---

## Scope

This document answers:

- how thread and sequence documents are currently built
- which signals are missing from their current search surfaces
- which additional signals can be derived from units and lessons
- how thread and sequence search and suggestion could become more useful

It does **not** redefine small-index retrieval policy or RRF tuning contracts.

---

## Executive Summary

Threads and sequences are currently much thinner than the curriculum data that
supports them.

- `oak_threads` is mostly a title document with subject and count metadata.
- `oak_sequences` carries structural navigation data but little semantic or
  pedagogical description.
- both can be upgraded substantially using data already present on units and
  lessons
- the most useful near-term improvements are richer summaries, better suggestion
  inputs, and additional derived counts/spans

This is a strong candidate for high leverage because the underlying data already
exists and the current surfaces are visibly sparse.

---

## Current Thread Surface

Threads are currently derived from `unit.threads[]` across bulk files and mainly
retain:

- `thread_slug`
- `thread_title`
- `subject_slugs`
- `unit_count`
- thin `thread_semantic`
- title suggest input

That is enough to make thread search technically available, but not enough to
make it an especially rich search or suggestion target.

### Missing Thread Signals Already Available Indirectly

- first year / last year
- key-stage span
- ordered unit slugs and unit titles
- lesson count
- category coverage
- representative concepts from lessons
- prior-knowledge and NC coverage summaries

The repo’s thread progression extraction already proves that some of this
structure is available; it is just not fed back into `oak_threads`.

---

## Current Sequence Surface

Sequences are currently built one document per bulk file and mainly retain:

- slug and generated title
- subject and phase
- key stages
- years
- unit slugs
- category titles
- canonical URL

The mapping defines `sequence_semantic`, but the current builder path does not
meaningfully populate a rich semantic surface. In practice, sequence search is
closer to title/category lookup than to a pedagogical retrieval surface.

### Missing Sequence Signals Already Available Indirectly

- unit count
- lesson count
- thread coverage
- representative unit titles
- pedagogical summaries from units and lessons
- prior-knowledge footprint
- NC coverage footprint
- richer KS4 availability signals

---

## Derived Signals We Can Build Now

### For Threads

- `first_year`
- `last_year`
- `year_span`
- `key_stages`
- ordered `unit_slugs`
- ordered `unit_titles`
- `lesson_count`
- top category titles
- top keyword terms
- representative learning points
- representative misconceptions
- richer `thread_structure` and `thread_structure_semantic`

### For Sequences

- `unit_count`
- `lesson_count`
- `thread_slugs`
- `thread_titles`
- top category titles
- top keyword terms
- representative learning points
- representative unit descriptions
- `sequence_structure` and `sequence_structure_semantic`
- availability signals for tiers, exam boards, and options where applicable

---

## Search and Suggestion Opportunities

### Better Search Surfaces

For both threads and sequences, the clearest upgrade is to stop treating them as
mostly title-only documents.

Instead:

- keep the canonical title fields
- add concise, template-based semantic summaries
- add a small set of carefully chosen derived fields for lexical retrieval

This follows the same pattern that improved lessons and units under
template-based semantic summary work.

### Better Suggestions

Current suggestion behaviour is narrow relative to the underlying data. Better
thread/sequence suggestions could use:

- subject-qualified titles
- phase-qualified or key-stage-qualified sequence names
- representative unit titles
- top categories
- top canonical domain terms
- common query paraphrases, once governed elsewhere

For sequences in particular, phase-aware suggestion inputs are an obvious fit.

---

## Constraints

- Threads and sequences are still small corpora; improvements should respect the
  small-index reality rather than importing heavy machinery by default.
- Thread and sequence search are not identical problems. Threads represent
  conceptual progression; sequences represent curriculum containers and
  navigation.
- Richer summaries should improve usefulness without pretending these indices
  have lesson-like depth.
- Evidence work must distinguish “mechanism checks” from true ranking-quality
  evaluation.

---

## Highest-Leverage Opportunities

These are research signals for later plan promotion, not committed retrieval
changes.

1. Populate a real semantic surface for sequences.
2. Enrich thread and sequence summaries using unit and lesson signals already in
   bulk.
3. Add lightweight counts and span fields that improve browsing and filtering.
4. Improve suggestion inputs before considering heavier ranking changes.
5. Keep specialised graph traversal or reranking as later steps, not the first
   move.

---

## Confidence Summary

| Finding | Confidence | Evidence |
|---------|------------|----------|
| Thread and sequence documents are thinner than the underlying available data | High | Verified against current builders and bulk-derived sources |
| Better summaries and counts are feasible without upstream changes | High | Derived directly from units and lessons already in bulk |
| Suggestion surfaces are under-developed relative to available signals | High | Current builders and retrieval path are visibly narrow |
| Small-index constraints should remain explicit | High | Backed by current ADRs and retrieval contracts |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [learning-graph-surfaces.research.md](learning-graph-surfaces.research.md) | Cross-cutting relationship surfaces built from the same data |
| [document-relationships.md](document-relationships.md) | Existing future plan for relationship-aware retrieval |
| [../03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md](../03-vocabulary-and-semantic-assets/bulk-metadata-opportunities.research.md) | The underlying lesson/unit signals this document builds from |
| [ADR-077](../../../../../docs/architecture/architectural-decisions/077-semantic-summary-generation.md) | Pattern for richer summary surfaces |
| [ADR-110](../../../../../docs/architecture/architectural-decisions/110-thread-search-architecture.md) | Current thread-search architecture and its upgrade path |
