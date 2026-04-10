# ADR-097: Context Enrichment Architecture for Curriculum Search

## Status

Accepted (partially superseded by [ADR-110](./110-thread-search-architecture.md)
for thread searchability — `thread_semantic` is now populated and
`searchThreads` is a full SDK retrieval method. The context enrichment
model for threads enriching unit results remains valid. Update 2026-03-21:
the `sequence_semantic` "Skip" decision below is also no longer a durable
target state; the locked replacement contract now lives in
[ADR-139](./139-sequence-semantic-contract-and-ownership.md) and is summarised
in `apps/oak-search-cli/docs/INDEXING.md`.)

## Context

The semantic search system indexes lessons, units, sequences, and threads. An investigation into empty Elasticsearch fields revealed that:

1. **Categories** (unit topics) are missing from bulk downloads but available via API
2. **Sequence canonical URLs** were not being populated in facet documents
3. **Semantic text fields** for sequences/threads were empty and undefined

We needed to determine:

- Which empty fields should be populated
- How sequences and threads should be represented in search
- What value each field provides to end users

## Decision

### Sequences and Threads Are Structural Metadata, Not Search Targets

> **Historical classification**: The table below reflects the original design
> analysis. Thread searchability has since been elevated to full SDK retrieval
> (ADR-110), and the sequence "Navigation, not search" classification is
> superseded by ADR-139, which locks a real retrieval contract for sequences
> (deterministic `sequence_semantic` production with SDK-owned 2-way RRF).

We determined that sequences (curriculum programmes) and threads (learning progressions) are fundamentally different from lessons and units:

| Content Type | Primary Purpose                                    | Search Role                                                         |
| ------------ | -------------------------------------------------- | ------------------------------------------------------------------- |
| Lessons      | Educational content (videos, transcripts, quizzes) | Primary search target                                               |
| Units        | Grouped lessons with pedagogical context           | Primary search target                                               |
| Sequences    | Curriculum structure (subject + phase)             | Historical: navigation only; now has retrieval contract per ADR-139 |
| Threads      | Learning progression across years                  | Full retrieval (ADR-110)                                            |

**Decision**: Sequences and threads are NOT primary search targets. Their value is:

1. **Navigation** - "Show me the KS3 science curriculum structure"
2. **Progression** - "What comes before/after this unit?"
3. **Enrichment** - Adding curriculum context to lesson/unit results

### Context Enrichment Model

We implement a **context enrichment model** where:

- Lessons and units are the primary search surfaces
- Sequences and threads provide context displayed in results
- Categories enable faceted filtering

### Fields to Populate

| Field                        | Index                 | Action                    | Rationale                    |
| ---------------------------- | --------------------- | ------------------------- | ---------------------------- |
| `unit_topics`                | `oak_units`           | **Populate from API**     | Enables topic faceting       |
| `categories`                 | `oak_units`           | **Alias for unit_topics** | Same data, different name    |
| `category_titles`            | `oak_sequences`       | **Aggregate from units**  | Sequence-level topic summary |
| `sequence_canonical_url`     | `oak_sequence_facets` | **Populate**              | Navigation links             |
| `thread_slugs/titles/orders` | `oak_units`           | **Already populated**     | From bulk data               |

### Fields NOT Populated

| Field               | Index           | Decision                                     | Rationale                       |
| ------------------- | --------------- | -------------------------------------------- | ------------------------------- |
| `sequence_semantic` | `oak_sequences` | **Skip** (historical; superseded by ADR-139) | Sequences aren't search targets |
| `thread_semantic`   | `oak_threads`   | **Skip** (historical; superseded by ADR-110) | Threads aren't search targets   |

### API Supplementation Strategy

Categories require API supplementation during bulk ingestion:

1. **Endpoint**: `GET /api/sequences/{sequenceSlug}/units`
2. **Build CategoryMap**: Extract categories from API response
3. **Enrich during transform**: Pass CategoryMap to unit/sequence transformers

### Shared Utilities

Created shared utilities for DRY compliance:

- `oak-url-convenience.ts` (in `@oaknational/curriculum-sdk`) — URL generation, delegating to generated helpers (relocated from `canonical-url-generator.ts` per ADR-145)
- `slug-derivation.ts` - Extracting subject/phase from sequence slugs
- `category-supplementation.ts` - Building and using category maps

## Consequences

### Positive

1. **Clear separation of concerns** - search targets vs. navigation/context
2. **No wasted resources** - ELSER inference not spent on non-searchable content
3. **Category faceting enabled** - Users can filter by topic
4. **Context enrichment** - Results show curriculum position
5. **DRY compliance** - Shared utilities prevent duplication

### Negative

1. **API calls during ingestion** - ~200 extra API calls for categories
2. **Partial category coverage** - Not all subjects have categories (e.g., maths)

### Neutral

1. **Sequences/threads searchable by title** - BM25 on title_suggest still works
2. **Thread data already in bulk** - No API supplementation needed

## Implementation

- `category-supplementation.ts` - Category map building and lookup
- `bulk-unit-transformer.ts` - Updated to accept CategoryMap
- `bulk-sequence-transformer.ts` - Updated for canonical URLs and category titles
- `oak-url-convenience.ts` (in `@oaknational/curriculum-sdk`) — Shared URL generation (per ADR-145)
- `slug-derivation.ts` - Shared slug parsing

## Related Decisions

- [ADR-093](./093-bulk-first-ingestion-strategy.md) - Bulk-First Ingestion Strategy
- [ADR-080](./080-ks4-metadata-denormalisation.md) - KS4 Metadata Denormalisation
