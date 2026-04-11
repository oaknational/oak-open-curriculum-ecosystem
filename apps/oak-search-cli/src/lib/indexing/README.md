# Indexing Module

This module handles bulk document ingestion into Elasticsearch, including document transformation, chunking, and retry logic for transient failures.

## Overview

The indexing pipeline processes curriculum data from bulk download files and the Oak API, transforms it into Elasticsearch documents, and uploads them with robust retry mechanisms.

## Key Components

### Bulk Upload (Document to ES)

- **`bulk-chunk-uploader.ts`** - Main upload orchestrator with two-tier retry
- **`bulk-chunk-utils.ts`** - Pure utilities for chunking operations
- **`bulk-retry-utils.ts`** - Retry decision logic (determines retryable errors)
- **`ingest-harness-ops.ts`** - High-level dispatch coordination

### Retry Module (`retry/`)

- **`retry/index.ts`** - Barrel file defining public API
- **`retry/types.ts`** - Retry-specific type definitions
- **`retry/http-retry.ts`** - Tier 1: HTTP-level retry (transport errors)
- **`retry/document-retry.ts`** - Tier 2: Document-level retry orchestration
- **`retry/chunk-processor.ts`** - Retry chunk processing logic

### Document Transformation

- **`document-transforms.ts`** - API path document transformation (delegates to shared builders)
- **`lesson-document-core.ts`** - Shared lesson document builder (DRY)
- **`unit-document-core.ts`** - Shared unit document builder (DRY)
- **`lesson-document-builder.ts`** - High-level lesson building from aggregated data
- **`thread-document-builder.ts`** - Creates thread index documents (DRY)
- **`sequence-document-builder.ts`** - Creates sequence index documents (input-agnostic)
- **`sequence-facets.ts`** - Creates sequence facet documents (input-agnostic)

### Shared Utilities

- URL generation now lives in `@oaknational/curriculum-sdk` (`oak-url-convenience.ts`), which delegates to generated URL helpers in `@oaknational/sdk-codegen`. See ADR-145.
- Slug derivation (subject/phase extraction from sequence slugs) lives in `@oaknational/curriculum-sdk` (`sequence-slug-derivation.ts`)

## DRY Pattern for Document Builders

Document builders follow a DRY (Don't Repeat Yourself) pattern that ensures a **single source of truth** for document creation logic. Both API and bulk ingestion paths delegate to shared builders.

### Architecture

```text
[Bulk Data] --> [Extractor] --> [Params Interface] --> [Shared Builder] --> [ES Doc]
[API Data]  --> [Adapter]   --> [Params Interface] --> [Shared Builder] --> [ES Doc]
```

### Implementation Pattern

Each document type follows this structure:

1. **Shared Core Builder** (`*-document-core.ts` or `*-document-builder.ts`)
   - Defines input-agnostic `Create*DocParams` interface
   - Implements `build*Document()` function that creates ES documents
   - Contains no knowledge of API or bulk input types

2. **Bulk Adapter** (`bulk-*-transformer.ts` in `src/adapters/`)
   - Defines `extract*ParamsFromBulk()` to convert bulk types to params interface
   - Calls shared builder to create ES document

3. **API Adapter** (`document-transforms.ts`)
   - Defines `extract*ParamsFromAPI()` to convert API types to params interface
   - Calls shared builder to create ES document

### Document Type Status

| Document Type | Shared Builder             | Bulk Path       | API Path        | Status |
| ------------- | -------------------------- | --------------- | --------------- | ------ |
| Threads       | `createThreadDocument()`   | ✅ Calls shared | ✅ Direct       | DRY    |
| Lessons       | `buildLessonDocument()`    | ✅ Calls shared | ✅ Calls shared | DRY    |
| Units         | `buildUnitDocument()`      | ✅ Calls shared | ✅ Calls shared | DRY    |
| Sequences     | `createSequenceDocument()` | ✅ Calls shared | N/A             | DRY    |
| Rollups       | `createRollupDocument()`   | ✅ Calls shared | ✅ Direct       | DRY    |

### Benefits

- **Single Source of Truth**: Document structure defined once, used everywhere
- **Testability**: Shared builders have focused unit tests
- **Maintainability**: Changes to ES document structure only need one update
- **Type Safety**: Input-agnostic interfaces ensure both paths provide required data

### Ingestion Orchestration

- **`bulk-ingestion.ts`** - Bulk-first ingestion pipeline (lessons, units, threads, sequences)
- **`ingest-harness.ts`** - Main ingestion harness

### Bulk Transformers (`src/adapters/`)

- **`bulk-thread-transformer.ts`** - Extracts threads from bulk files and builds ES operations
- **`bulk-sequence-transformer.ts`** - Extracts sequences from bulk files and builds ES operations for `oak_sequences` and `oak_sequence_facets` indexes
- **`bulk-unit-transformer.ts`** - Transforms bulk units to ES documents, with optional category enrichment

### Data Supplementation (`src/adapters/`)

- **`category-supplementation.ts`** - Builds category maps from API for enriching bulk data
- **`api-supplementation.ts`** - KS4 metadata enrichment from API

## Retry Strategy

The module implements a two-tier retry strategy for ELSER queue overflow errors:

### Tier 1: HTTP-Level Retry

- Retries entire chunks on transport errors (network issues, timeouts)
- Exponential backoff with jitter
- Configured via `maxRetries` and `baseRetryDelayMs`

### Tier 2: Document-Level Retry

- After ALL chunks are processed, collects documents that failed with transient errors
- Retries only failed documents (HTTP 429, 502, 503, 504)
- Non-retryable errors (400, 409) are NOT retried
- Configured via `documentRetryEnabled`, `documentMaxRetries`, `documentRetryDelayMs`

```typescript
import { uploadAllChunks } from './bulk-chunk-uploader';

const result = await uploadAllChunks(es, chunks, logger, 1000, {
  chunkDelayMs: 8000, // Delay between chunks to prevent queue overflow
  documentRetryEnabled: true, // Enable Tier 2 retry
  documentMaxRetries: 4, // Retry failed docs up to 4 times
  documentRetryDelayMs: 5000, // Base delay for document retry backoff
});
```

## Configuration

### CLI Flags

The ingestion CLI supports retry configuration:

```bash
# Default retry behavior (bulk mode; 3 retries, 5s base delay)
pnpm es:ingest

# Custom retry configuration
pnpm es:ingest -- --bulk-dir ./bulk-downloads --max-retries 5 --retry-delay 10000

# Disable document-level retry (fail fast)
pnpm es:ingest -- --no-retry
```

### Configuration Options

| Option                 | CLI Flag        | Default | Description                        |
| ---------------------- | --------------- | ------- | ---------------------------------- |
| `chunkDelayMs`         | -               | 8000    | Delay between chunks (ms)          |
| `maxRetries`           | -               | 3       | HTTP-level retry attempts          |
| `documentRetryEnabled` | `--no-retry`    | true    | Enable document-level retry        |
| `documentMaxRetries`   | `--max-retries` | 4       | Document-level retry attempts      |
| `documentRetryDelayMs` | `--retry-delay` | 5000    | Base delay for document retry (ms) |

### Optimised Constants (Updated 2026-02-28)

| Constant                                | Value  | Purpose                                    |
| --------------------------------------- | ------ | ------------------------------------------ |
| `MAX_CHUNK_SIZE_BYTES`                  | 8MB    | Smaller chunks reduce ELSER queue pressure |
| `DEFAULT_CHUNK_DELAY_MS`                | 8000ms | Base delay between chunk uploads           |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5×   | Progressive delay per retry attempt        |

## Troubleshooting

### ELSER Queue Overflow (HTTP 429)

**Symptom**: Documents fail with `inference_exception` and HTTP 429 status.

**Cause**: ELSER inference queue is overwhelmed by too many concurrent embedding requests.

**Solution**:

1. Increase `chunkDelayMs` to give more time between chunks
2. Ensure document-level retry is enabled (default)
3. Increase `documentRetryDelayMs` if retries still fail

### Non-Retryable Errors (HTTP 400, 409)

**Symptom**: Documents permanently fail and are not retried.

**Cause**: Documents have mapping errors or version conflicts.

**Solution**:

1. Check the mapping schema matches document structure
2. For 409 conflicts, inspect document identity and payload before retrying
3. Review document content for invalid field values

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    CLI (ingest.ts)                          │
│                           │                                 │
│                    ┌──────▼──────┐                         │
│                    │ executeBulk │                         │
│                    │  Ingestion  │                         │
│                    └──────┬──────┘                         │
│                           │                                 │
│                    ┌──────▼──────┐                         │
│                    │ dispatchBulk │                        │
│                    └──────┬──────┘                         │
│                           │                                 │
│     ┌─────────────────────▼─────────────────────┐          │
│     │         uploadAllChunks (orchestrator)     │          │
│     │                                            │          │
│     │  ┌────────────────────────────────────┐   │          │
│     │  │ Phase 1: Upload initial chunks      │   │          │
│     │  │  ├─ uploadChunkWithRetry (Tier 1)  │   │          │
│     │  │  └─ Collect failed operations       │   │          │
│     │  └────────────────────────────────────┘   │          │
│     │                    │                       │          │
│     │  ┌────────────────▼────────────────────┐  │          │
│     │  │ Phase 2: Document-level retry        │  │          │
│     │  │  ├─ Re-chunk failed operations       │  │          │
│     │  │  ├─ attemptChunkUpload (no Tier 1)  │  │          │
│     │  │  └─ Exponential backoff with jitter  │  │          │
│     │  └─────────────────────────────────────┘  │          │
│     └────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## Key Files Reference

| File                           | Purpose                                           |
| ------------------------------ | ------------------------------------------------- |
| `bulk-ingestion.ts`            | Bulk-first ingestion pipeline orchestrator        |
| `bulk-chunk-uploader.ts`       | Upload orchestration with two-tier retry          |
| `lesson-document-builder.ts`   | High-level lesson building from aggregated data   |
| `lesson-document-core.ts`      | Shared lesson document builder (DRY)              |
| `unit-document-core.ts`        | Shared unit document builder (DRY)                |
| `thread-document-builder.ts`   | Creates thread index documents                    |
| `sequence-document-builder.ts` | Creates sequence index documents                  |
| `sequence-facets.ts`           | Creates sequence facet documents                  |
| `oak-url-convenience.ts` (SDK) | URL generation (in `@oaknational/curriculum-sdk`) |

## Related Documentation

- [ADR-070: SDK Rate Limiting and Retry](../../../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md)
- [ADR-087: Batch Atomic Ingestion](../../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md)
- [ADR-093: Bulk-First Ingestion Strategy](../../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)
- [ADR-096: ES Bulk Retry Strategy](../../../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)
- [ADR-097: Context Enrichment Architecture](../../../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md)
