# ADR-110: Thread Search Architecture

## Status

Accepted (partially supersedes [ADR-097](./097-context-enrichment-architecture.md))

## Context

[ADR-097](./097-context-enrichment-architecture.md) classified threads as
"context enrichment, not search targets" and decided not to populate the
`thread_semantic` ELSER field. At that time, thread search was only a
mechanism check — 1 ground truth, no SDK method, no CLI command, and
benchmarks called Elasticsearch directly.

Since then:

1. `thread_semantic` was populated during ingestion (ELSER inference on
   thread titles), enabling semantic search over threads.
2. The Search SDK needed a complete retrieval surface — consumers
   (MCP servers, future apps) must search all four content types
   through a single SDK interface, not reach past the SDK to raw ES.
3. With 164 threads spanning all 16 subjects, teachers have a
   legitimate use case: "How does algebra develop across years?" or
   "What is the forces progression?" — these are thread searches.

The question was: what retrieval architecture should `searchThreads`
use?

## Decision

### Threads Are Directly Searchable

Threads are promoted from "context enrichment" to a directly searchable
content type alongside lessons, units, and sequences. ADR-097's
classification of threads as non-search-targets is superseded for the
`oak_threads` index, though its context enrichment model (threads
enriching unit results) remains valid and complementary.

### Two-Way RRF (Not Four-Way)

Thread search uses **two-way Reciprocal Rank Fusion**:

| Retriever | Field             | Boost | Purpose          |
| --------- | ----------------- | ----- | ---------------- |
| BM25      | `thread_title`    | 2.0   | Lexical matching |
| ELSER     | `thread_semantic` | —     | Semantic meaning |

This contrasts with lessons and units, which use **four-way RRF**
(BM25 Content + ELSER Content + BM25 Structure + ELSER Structure).

**Rationale**: Threads have a single text surface — the thread title.
There is no "content vs structure" distinction because threads have
no transcripts, lesson-planning data, keywords, or rollup text. The
only fields are `thread_title`, `thread_slug`, `subject_slugs`, and
`unit_count`. Two retrievers are the natural fit: one lexical, one
semantic. Adding more would mean duplicating the same field across
retrievers, which adds latency without improving ranking.

### RRF Parameters

| Parameter          | Threads | Lessons/Units | Rationale                   |
| ------------------ | ------- | ------------- | --------------------------- |
| `rank_constant`    | 40      | 60            | Smaller corpus, fewer ties  |
| `rank_window_size` | 40      | 80            | 164 docs — 40 is sufficient |

The `rank_constant` controls how quickly RRF scores decay with rank.
A smaller constant (40 vs 60) gives more weight to top-ranked
results, which is appropriate for a small corpus where there are
fewer candidates competing. The `rank_window_size` determines how
many results each retriever contributes to fusion; 40 covers ~24%
of the entire thread corpus, providing adequate coverage without
unnecessary computation.

### Subject Filter: `subject_slugs` Array Field

Thread documents use `subject_slugs` (plural, array) rather than
`subject_slug` (singular, scalar) because a single thread can span
multiple subjects. For example, MFL threads like "adjectives" span
french, german, and spanish simultaneously.

The SDK maps the consumer-facing `subject` parameter to a
`{ term: { subject_slugs: value } }` query internally. This is an
implementation detail — consumers pass a single subject slug and the
array field handles multi-subject threads transparently.

## Consequences

### Positive

1. **Complete SDK surface** — All four content types searchable
   through `RetrievalService`, no need for raw ES calls
2. **Consistent consumer API** — `searchThreads` follows the same
   `SearchParamsBase` → `Result<ThreadsSearchResult, RetrievalError>`
   pattern as all other retrieval methods
3. **Measurable quality** — 8 ground truths across 5 subjects
   provide real baselines (MRR=0.938, NDCG@10=0.902)
4. **Appropriate complexity** — Two-way RRF matches the data surface
   without over-engineering

### Negative

1. **ELSER inference cost** — `thread_semantic` field now populated
   during ingestion (~164 documents, minimal cost)
2. **ADR-097 partial supersession** — Requires reading both ADRs to
   understand the full picture

### Neutral

1. **Upgrade path** — If thread documents gain richer content (e.g.,
   progression descriptions, unit summaries), the architecture can
   evolve to 3-way or 4-way RRF without changing the consumer API
2. **Sequence parity** — Sequences also use 2-way RRF with identical
   parameters, maintaining consistency across small-corpus indexes

## Implementation

- `packages/sdks/oak-search-sdk/src/retrieval/search-threads.ts` —
  `searchThreads` function
- `packages/sdks/oak-search-sdk/src/retrieval/retrieval-search-helpers.ts` —
  `buildThreadRetriever` (two-way RRF builder)
- `packages/sdks/oak-search-sdk/src/types/retrieval-results.ts` —
  `ThreadResult`, `ThreadsSearchResult`
- `apps/oak-search-cli/src/cli/search/register-threads-cmd.ts` —
  CLI `search threads` command

## Related Decisions

- [ADR-097](./097-context-enrichment-architecture.md) — Context
  Enrichment Architecture (partially superseded)
- [ADR-076](./076-elser-only-embedding-strategy.md) — ELSER-Only
  Embedding Strategy
- [ADR-107](./107-deterministic-sdk-nl-in-mcp-boundary.md) —
  Deterministic SDK / NL-in-MCP Boundary
- [ADR-106](./106-known-answer-first-ground-truth-methodology.md) —
  Known-Answer-First Ground Truth Methodology
