# Oak SDK Adapters

This directory contains adapters for curriculum data ingestion into Elasticsearch. Both **bulk download** and **API** data sources flow through the **same indexing pipeline** via minimal adapters.

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES (Adapters)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────┐    │
│  │    BULK DOWNLOAD            │    │         OAK API                 │    │
│  │    (Primary Source)         │    │    (Supplementation)            │    │
│  │                             │    │                                 │    │
│  │  30 JSON files (~757 MB)    │    │  /sequences/{seq}/units         │    │
│  │  16/17 subjects             │    │  (Maths KS4 tier info)          │    │
│  │  81% transcript coverage    │    │                                 │    │
│  └──────────────┬──────────────┘    └───────────────┬─────────────────┘    │
│                 │                                   │                      │
│                 ▼                                   ▼                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     BulkDataAdapter                                  │  │
│  │                                                                      │  │
│  │  • Reads bulk JSON via SDK's parseBulkFile()                        │  │
│  │  • Zod validation via SDK schemas                                   │  │
│  │  • "NULL" sentinel → null conversion (handled by SDK)               │  │
│  │  • Builds lesson/unit/thread lookup maps                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                 │                                                          │
│                 ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    HybridDataSource                                  │  │
│  │                                                                      │  │
│  │  Composes: BulkDataAdapter + ApiSupplementation                     │  │
│  │                                                                      │  │
│  │  • Iterates all lessons from bulk                                   │  │
│  │  • Enriches Maths KS4 lessons with tier info from API               │  │
│  │  • Produces: lessons, units, threads for indexing                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TRANSFORMERS (Pure Functions)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌───────────────┐ │
│  │ BulkLessonTransformer  │  │ BulkUnitTransformer    │  │ BulkThread    │ │
│  │                        │  │                        │  │ Transformer   │ │
│  │ Bulk Lesson            │  │ Bulk Unit              │  │               │ │
│  │    ↓                   │  │    ↓                   │  │ Bulk threads  │ │
│  │ SearchLessonsIndexDoc  │  │ SearchUnitsIndexDoc    │  │    ↓          │ │
│  │                        │  │                        │  │ ThreadDoc     │ │
│  └────────────────────────┘  └────────────────────────┘  └───────────────┘ │
│                                                                             │
│  ┌────────────────────────┐                                                 │
│  │ BulkRollupBuilder      │  Aggregates lesson snippets into unit rollups  │
│  │                        │                                                 │
│  │ Units + Lessons        │                                                 │
│  │    ↓                   │                                                 │
│  │ SearchUnitRollupDoc    │                                                 │
│  └────────────────────────┘                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SHARED INDEXING PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    bulk-ingestion.ts                                 │  │
│  │                                                                      │  │
│  │  • Orchestrates full ingestion                                      │  │
│  │  • Calls transformers to build ES documents                         │  │
│  │  • Creates bulk operations (index/create actions)                   │  │
│  │  • Dispatches to bulk-chunk-uploader                                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                 │                                                          │
│                 ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    bulk-chunk-uploader.ts                            │  │
│  │                                                                      │  │
│  │  • Chunks operations (500 docs per batch)                           │  │
│  │  • Retry with exponential backoff + jitter                          │  │
│  │  • Rate limiting (100ms between chunks)                             │  │
│  │  • Error reporting per chunk                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                 │                                                          │
│                 ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Elasticsearch Serverless                          │  │
│  │                                                                      │  │
│  │  Indices: oak_lessons, oak_units, oak_unit_rollup, oak_threads      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Principle: Same Pipeline, Different Sources

**Both bulk and API ingestion use the SAME indexing pipeline.** The only difference is the data source adapter:

| Mode     | Data Source                   | Adapter           | Use Case             |
| -------- | ----------------------------- | ----------------- | -------------------- |
| **Bulk** | JSON files (30 files, 757 MB) | `BulkDataAdapter` | Primary ingestion    |
| **API**  | Oak Curriculum API            | `OakClient`       | Supplementation only |

**Why this matters:**

- Single source of truth for ES document creation
- No divergence between ingestion modes
- Easier testing (same transforms, different inputs)
- API mode can be deprecated when bulk covers everything

---

## Type System

All types flow from two sources:

| Type Category    | Source                     | Examples                                       |
| ---------------- | -------------------------- | ---------------------------------------------- |
| **API Types**    | SDK generated from OpenAPI | `Lesson`, `Unit`, `Thread` (bulk schemas)      |
| **Search Types** | SDK generated for ES       | `SearchLessonsIndexDoc`, `SearchUnitsIndexDoc` |

**No custom types are invented.** Transformers convert API types → Search types.

---

## Files

### Bulk Ingestion Infrastructure

| File                           | Purpose                                      |
| ------------------------------ | -------------------------------------------- |
| `bulk-data-adapter.ts`         | Loads bulk JSON, builds lookup maps          |
| `bulk-lesson-transformer.ts`   | `Lesson` → `SearchLessonsIndexDoc`           |
| `bulk-unit-transformer.ts`     | `Unit` → `SearchUnitsIndexDoc`               |
| `bulk-thread-transformer.ts`   | Extracts threads, builds `ThreadDoc`         |
| `bulk-rollup-builder.ts`       | Aggregates lessons → `SearchUnitRollupDoc`   |
| `bulk-transform-helpers.ts`    | Shared pure functions (URL generation, etc.) |
| `hybrid-data-source.ts`        | Composes bulk + API supplementation          |
| `hybrid-batch-processor.ts`    | Batched iteration for memory efficiency      |
| `api-supplementation.ts`       | Fetches Maths KS4 tier info from API         |
| `vocabulary-mining-adapter.ts` | Extracts vocabulary for synonym mining       |

### API Client Infrastructure

| File                     | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| `oak-adapter.ts`         | **Public API** — `createOakClient()`, `OakClient` interface |
| `oak-adapter-types.ts`   | Type definitions for API methods                            |
| `oak-adapter-threads.ts` | Thread-specific API methods                                 |
| `sdk-api-methods.ts`     | Factories for each API endpoint                             |
| `sdk-client-factory.ts`  | Client creation (cached/uncached)                           |
| `sdk-guards.ts`          | Type guards for API response validation                     |
| `sdk-cache/`             | Redis caching infrastructure                                |

---

## Bulk Adapter Detail

### BulkDataAdapter

Wraps the SDK's bulk file parsing:

```typescript
import { parseBulkFile, readAllBulkFiles } from '@oaknational/oak-curriculum-sdk/public/bulk';

const adapter = new BulkDataAdapter();
await adapter.initialize(bulkDir);

// Access parsed data
for (const lesson of adapter.getLessons()) {
  // lesson is SDK's Lesson type with Zod validation applied
}
```

**What the SDK handles:**

- `"NULL"` string → `null` conversion
- `downloadsavailable` typo normalization
- Year as number OR "All years" string
- Optional transcript handling

### HybridDataSource

Composes bulk data with API enrichment:

```typescript
const source = new HybridDataSource({
  bulkAdapter,
  apiClient: oakClient,
});

// Iterates lessons with tier enrichment
for await (const lesson of source.getLessonsWithMaterials()) {
  // Maths KS4 lessons have tier info from API
  // All other lessons pass through unchanged
}
```

---

## Transformer Detail

### BulkLessonTransformer

Converts SDK `Lesson` → `SearchLessonsIndexDoc`:

```typescript
function transformBulkLesson(
  lesson: Lesson,
  unitContext: UnitContext,
  tierMap: TierMap,
): SearchLessonsIndexDoc {
  return {
    lesson_id: lesson.lessonSlug,
    lesson_slug: lesson.lessonSlug,
    lesson_title: lesson.lessonTitle,
    // ... field mapping
    lesson_content: lesson.transcript_sentences, // May be undefined
    lesson_structure: generateSemanticSummary(lesson),
    has_transcript: Boolean(lesson.transcript_sentences),
  };
}
```

**Key behavior:**

- `lesson_content` is **omitted** (not set to placeholder) when transcript missing
- `has_transcript` boolean for filtering/debugging
- Semantic summary generated from pedagogical fields

### BulkRollupBuilder

Aggregates lesson content into unit-level documents:

```typescript
function buildRollupDocument(unit: Unit, lessons: Lesson[]): SearchUnitRollupDoc {
  const snippets = lessons.map((l) => extractSnippet(l, 300));
  return {
    unit_id: unit.unitSlug,
    unit_content: snippets.join('\n\n'),
    unit_structure: generateUnitSemanticSummary(unit, lessons),
    // ...
  };
}
```

---

## API Client Detail

### Result Pattern (ADR-088)

All API methods return `Result<T, SdkFetchError>`:

```typescript
const result = await client.getLessonSummary('adding-fractions');

if (!result.ok) {
  switch (result.error.kind) {
    case 'not_found': // Handle 404
    case 'server_error': // Handle 5xx
  }
}
// result.value is typed
```

### Caching (ADR-066)

Environment variables control caching:

| Variable              | Purpose                 |
| --------------------- | ----------------------- |
| `SDK_CACHE_ENABLED`   | Enable Redis caching    |
| `SDK_CACHE_REDIS_URL` | Redis connection URL    |
| `SDK_CACHE_TTL_DAYS`  | Cache TTL (default: 14) |

### Negative Caching

404 responses cached with sentinel to avoid repeated network calls:

```typescript
const client = await createOakClient({
  caching: { ignoreCached404: true }, // Bypass cached 404s
});
```

---

## Related ADRs

| ADR                                                                                                       | Topic                         |
| --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)     | Bulk-first ingestion strategy |
| [ADR-094](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md)              | `has_transcript` field        |
| [ADR-095](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)       | Missing transcript handling   |
| [ADR-066](../../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md)              | SDK response caching          |
| [ADR-079](../../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md)              | Cache TTL jitter              |
| [ADR-088](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) | Result pattern                |

---

## Testing

All transformers have unit tests using fixtures:

```bash
pnpm test bulk-lesson-transformer
pnpm test bulk-rollup-builder
pnpm test hybrid-data-source
```

Tests use dependency injection — no global state, no mocks of internals.
