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

- **`document-transforms.ts`** - Core document transformation logic
- **`lesson-document-builder.ts`** - Creates lesson index documents
- **`thread-document-builder.ts`** - Creates thread index documents
- **`sequence-document-builder.ts`** - Creates sequence index documents

### Ingestion Orchestration

- **`bulk-ingestion.ts`** - Bulk-first ingestion pipeline
- **`ingest-harness.ts`** - Main ingestion harness

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
  chunkDelayMs: 6500, // Delay between chunks to prevent queue overflow
  documentRetryEnabled: true, // Enable Tier 2 retry
  documentMaxRetries: 4, // Retry failed docs up to 4 times
  documentRetryDelayMs: 5000, // Base delay for document retry backoff
});
```

## Configuration

### CLI Flags

The ingestion CLI supports retry configuration:

```bash
# Default retry behavior (3 retries, 5s base delay)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads

# Custom retry configuration
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --max-retries 5 --retry-delay 10000

# Disable document-level retry (fail fast)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --no-retry
```

### Configuration Options

| Option                 | CLI Flag        | Default | Description                        |
| ---------------------- | --------------- | ------- | ---------------------------------- |
| `chunkDelayMs`         | -               | 6500    | Delay between chunks (ms)          |
| `maxRetries`           | -               | 3       | HTTP-level retry attempts          |
| `documentRetryEnabled` | `--no-retry`    | true    | Enable document-level retry        |
| `documentMaxRetries`   | `--max-retries` | 4       | Document-level retry attempts      |
| `documentRetryDelayMs` | `--retry-delay` | 5000    | Base delay for document retry (ms) |

### Optimised Constants (Verified 2026-01-02)

| Constant                                | Value  | Purpose                                    |
| --------------------------------------- | ------ | ------------------------------------------ |
| `MAX_CHUNK_SIZE_BYTES`                  | 8MB    | Smaller chunks reduce ELSER queue pressure |
| `DEFAULT_CHUNK_DELAY_MS`                | 6500ms | Base delay between chunk uploads           |
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
2. For 409 conflicts, use `--force` flag to overwrite
3. Review document content for invalid field values

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    CLI (ingest-live.ts)                     │
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

## Related Documentation

- [ADR-070: SDK Rate Limiting and Retry](../../../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md)
- [ADR-087: Batch Atomic Ingestion](../../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md)
- [ADR-096: ES Bulk Retry Strategy](../../../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)
