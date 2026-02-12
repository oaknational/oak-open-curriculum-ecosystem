# Architecture

**Last Updated**: 2026-02-11

## Overview

The semantic search workspace provides a CLI/SDK-first service that ingests Oak Curriculum content via the official SDK, stores enriched documents in **seven Elasticsearch Serverless indices**, and serves hybrid (lexical + semantic) queries with server-side **Reciprocal Rank Fusion (RRF)**.

> **Note**: The workspace operates as a CLI/SDK architecture. The UI layer was retired in Feb 2026 and the search SDK was extracted to `packages/sdks/oak-search-sdk/`. See [search-sdk-cli.plan.md](../../../.agent/plans/semantic-search/archive/completed/search-sdk-cli.plan.md) for the full plan.

---

## Indices (Elasticsearch Serverless)

| Index                 | Purpose                                            | Key Fields                                                                                                                                                                                                                                                                                                                                                 |
| --------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oak_lessons`         | Primary lesson retrieval surface                   | `lesson_id`, `lesson_slug`, `lesson_title`, lesson-planning data (`lesson_keywords`, `key_learning_points`, `misconceptions_and_common_mistakes`, `teacher_tips`, `content_guidance`), `transcript_text` with `term_vector`, `lesson_semantic` (`semantic_text`), canonical URL, unit metadata, completion `title_suggest` with contexts, audit timestamps |
| `oak_unit_rollup`     | Unit search and highlight surface                  | `unit_id`, `unit_slug`, `unit_title`, `unit_topics`, `lesson_ids`, `lesson_count`, canonical URLs, rollup snippets (`rollup_text`), `unit_semantic` (`semantic_text` with `copy_to`), completion `title_suggest`, facet fields (`key_stage`, `subject_slug`, `years`)                                                                                      |
| `oak_units`           | Lightweight unit metadata for analytics and facets | Mirrors unit identifiers, key stage/subject filters, lesson counts, canonical URLs; excludes rollup text for faster aggregations                                                                                                                                                                                                                           |
| `oak_threads`         | Curriculum thread metadata and relationships       | Thread identifiers, associated units, subject/key stage filters                                                                                                                                                                                                                                                                                            |
| `oak_sequences`       | Sequence discovery and navigation                  | `sequence_id`, `sequence_slug`, `sequence_title`, canonical URL, category/phase/year fields, associated unit slugs, optional `sequence_semantic`, completion payloads                                                                                                                                                                                      |
| `oak_sequence_facets` | Sequence facet metadata                            | Facet identifiers, sequence relationships, filtering metadata                                                                                                                                                                                                                                                                                              |
| `oak_meta`            | Index metadata and versioning                      | Index version, ingestion timestamps, schema version                                                                                                                                                                                                                                                                                                        |

Shared settings include the `oak_text` analyser (standard, lowercase, asciifolding, `synonym_graph` using `oak-syns`), the `oak_lower` normaliser for keyword filters, and `highlight.max_analyzed_offset` increased to accommodate long transcripts and rollups.

---

## CLI Architecture (`oaksearch`)

The workspace provides the `oaksearch` CLI, a thin wrapper over `@oaknational/oak-search-sdk`. All commands create an SDK instance via `createCliSdk()` (env → ES client → SDK), ensuring CLI, evaluation, and production consumers share the same code paths.

```text
bin/oaksearch.ts                    # Entry point (commander)
src/cli/
├── shared/
│   ├── create-cli-sdk.ts           # Env → SDK factory
│   ├── validators.ts               # Schema-derived type guards
│   ├── pass-through.ts             # Script delegation helper
│   └── output.ts                   # Terminal formatting
├── search/                         # oaksearch search {lessons|units|sequences|suggest|facets}
│   ├── index.ts                    # Command registration
│   └── handlers.ts                 # SDK retrieval calls
├── admin/                          # oaksearch admin {setup|status|synonyms|meta|ingest|...}
│   ├── index.ts                    # Command registration
│   └── handlers.ts                 # SDK admin calls
├── observe/                        # oaksearch observe {telemetry|summary|purge}
│   ├── index.ts                    # Command registration
│   └── handlers.ts                 # SDK observability calls
└── eval/                           # oaksearch eval {benchmark|validate|typegen}
    └── index.ts                    # Pass-through to evaluation scripts
```

**SDK-mapped commands** call the SDK directly (search, admin setup/status/synonyms/meta, observe telemetry/summary). **Pass-through commands** delegate to existing scripts via `execFileSync` for complex orchestration (ingest, verify, diagnostics, benchmarks).

---

## Search Capabilities

- **Structured hybrid search** — Search over lessons, units, or sequences. Builds server-side RRF queries via the SDK, returns highlights, canonical URLs, facets, zero-hit metadata.
- **Suggestion/type-ahead** — Backed by completion contexts and `search_as_you_type` fields.
- **Zero-hit telemetry** — Records queries that return no results for quality improvement.
- **CLI ingestion** — `oaksearch admin ingest` triggers resilient batching across lessons, units, sequences.
- **Index management** — `oaksearch admin setup` manages mappings, synonyms, and index creation.

---

## Design Rationale

- **RRF everywhere**: Reciprocal Rank Fusion lets us blend lexical lesson-planning fields with semantic embeddings without issuing multiple round trips. A single `_search` per scope keeps latency predictable and aligns with Elasticsearch Serverless limits.
- **Versioned caching (`SEARCH_INDEX_VERSION`)**: Every search response, suggestion payload, and telemetry entry is tagged with the current index version. Bumping the version after ingestion or rollup rebuilds gives deterministic cache invalidation.
- **Target-aware indices**: `SEARCH_INDEX_TARGET` flips the app between primary and sandbox aliases. Admin endpoints, zero-hit persistence, and CLI scripts all derive index names from this target.
- **ELSER-only embeddings**: Sparse vector embeddings via ELSER provide semantic understanding without the operational complexity of dense vectors. See [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md).

---

## Data Flow

1. **Ingestion**: Oak SDK adapters fetch enriched curriculum data (lessons, units, sequences), transform it into canonical payloads, and bulk index into Elasticsearch indices. Batching (≈250 docs) with exponential backoff handles throttling; progress markers allow resumable runs.
2. **Rollup rebuild**: A dedicated flow collects lesson-planning snippets (~300 characters per lesson), assembles unit rollups, copies text to `unit_semantic`, and updates completion payloads.
3. **Querying**: Validated requests build a single `_search` per scope combining lexical `multi_match` clauses and `semantic` queries via `rank.rrf`. Highlights use `unified` highlighter with sentence boundaries.
4. **Suggestions**: Completion API hits `title_suggest` with contextual filters; fallback `search_as_you_type` queries provide prefix matches.

---

## Query Processing Pipeline

When a search request arrives, the query passes through several stages before reaching Elasticsearch.

### 1. Noise Phrase Removal

Filler phrases are stripped from the user's query text before query building. Examples: "that X stuff", "how do I", "lesson on", "help with". This prevents irrelevant terms from diluting BM25 matching.

**Implementation**: `src/lib/query-processing/remove-noise-phrases.ts`

### 2. Curriculum Phrase Detection

Multi-word curriculum terms (e.g. "completing the square", "key learning points") are detected using longest-match-first against a vocabulary built from the SDK (`buildPhraseVocabulary()`). Detected phrases are used to create `match_phrase` boosters (boost 2.0) that are injected into BM25 retrievers.

**Implementation**: `src/lib/query-processing/detect-curriculum-phrases.ts`, `src/lib/hybrid-search/rrf-query-helpers.ts`  
**ADR**: [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)

### 3. Reciprocal Rank Fusion (RRF)

Each search scope uses Elasticsearch's retriever API to blend lexical and semantic results:

| Scope         | Retrievers                                                          | RRF Parameters                              |
| ------------- | ------------------------------------------------------------------- | ------------------------------------------- |
| **Lessons**   | 4-way: BM25 Content, ELSER Content, BM25 Structure, ELSER Structure | `rank_constant: 60`, `rank_window_size: 80` |
| **Units**     | 4-way: BM25 Content, ELSER Content, BM25 Structure, ELSER Structure | `rank_constant: 60`, `rank_window_size: 80` |
| **Threads**   | 2-way: BM25, ELSER                                                  | `rank_constant: 40`, `rank_window_size: 40` |
| **Sequences** | 2-way: BM25, ELSER                                                  | `rank_constant: 40`, `rank_window_size: 40` |

Synonym expansion is handled at the Elasticsearch analyser level via the `oak-syns` synonym set, not at the application level.

**Implementation**: `src/lib/hybrid-search/rrf-query-builders.ts`

### 4. Transcript-Aware Score Normalisation (Lessons Only)

Lessons without transcripts can only appear in the two Structure retrievers (not the two Content retrievers). Without normalisation, these lessons would be systematically ranked lower. Post-RRF normalisation scales scores so that structure-only lessons compete fairly with transcript-bearing lessons.

**Implementation**: `src/lib/hybrid-search/rrf-score-normaliser.ts`  
**ADR**: [ADR-099](../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)

---

## Developer Workflow

1. Copy `.env.example` → `.env.local`, set the required search credentials.
2. Run quality gates:

   ```bash
   pnpm type-gen
   pnpm build
   pnpm type-check
   pnpm lint:fix
   pnpm format:root
   pnpm markdownlint:root
   pnpm test
   pnpm test:e2e
   ```

3. Start the dev server: `pnpm -C apps/oak-search-cli dev`

---

## Observability & Telemetry

- Structured logs capture ingestion batches, retries, zero-hit searches (`scope`, `text`, filters), and index version rotations.
- Admin status endpoint collates counts, durations, and errors for dashboards.
- **Zero-hit persistence pipeline**: When `ZERO_HIT_PERSISTENCE_ENABLED=true`, zero-hit events are written to Elasticsearch with ILM policy for retention.

---

## Dependencies & Tooling

- **SDK**: All curriculum data comes from `@oaknational/oak-curriculum-sdk`; types generated via `pnpm type-gen` uphold the Cardinal Rule.
- **Testing**: Unit tests cover transforms and query builders; integration suites (Vitest + fixtures/ES test doubles) validate mappings and ingestion behaviour.

---

## Diagram (Conceptual)

```text
Oak Curriculum SDK
    ↓ (enriched transforms)
Resilient ingestion (batch, retry, alias swap)
    ↓
Elasticsearch Serverless indices (7 indices)
    ↓
Server-side RRF queries & suggestions
    ↓
CLI → SDK consumers
```

---

## Related ADRs

| ADR                                                                                                              | Topic                                       |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [ADR-067](../../../docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md)        | SDK Generated Elasticsearch Mappings        |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)               | ELSER-Only Embedding Strategy               |
| [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)                       | Phrase Query Boosting                       |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md)                      | Batch-Atomic Ingestion                      |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)               | Bulk-First Ingestion Strategy               |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)                      | ES Bulk Retry Strategy                      |
| [ADR-099](../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)          | Transcript-Aware RRF Score Normalisation    |
| [ADR-106](../../../docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Known-Answer-First Ground Truth Methodology |
| [ADR-107](../../../docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md)        | Deterministic SDK / NL-in-MCP Boundary      |
