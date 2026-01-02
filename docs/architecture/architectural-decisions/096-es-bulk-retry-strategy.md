# ADR-096: Elasticsearch Bulk Retry Strategy

**Status**: Accepted — ✅ **VERIFIED** (2026-01-02)

**Date**: 2026-01-01

**Related ADRs**:

- [ADR-070: SDK Rate Limiting and Retry](070-sdk-rate-limiting-and-retry.md) - Pattern reuse
- [ADR-087: Batch Atomic Ingestion](087-batch-atomic-ingestion.md) - Idempotent re-runs
- [ADR-088: Result Pattern for Error Handling](088-result-pattern-for-error-handling.md) - Explicit error handling

## Context

During bulk ingestion of curriculum data into Elasticsearch, we encountered significant failures (~47%) due to ELSER (Elastic Learned Sparse EncodeR) queue overflow:

- **6,572 of ~12,320 lessons** were successfully indexed (~53%)
- **All failures** were HTTP 429 errors with `inference_exception`
- **Failures were position-dependent**: 93% overlap between runs (750/803 same docs)
- **First chunks succeeded**: First 2 chunks had ~100% success, then degradation

### Root Cause Analysis

ELSER is a machine learning model that generates sparse vector embeddings for `semantic_text` fields. When too many documents arrive simultaneously:

1. ELSER inference queue fills up
2. Subsequent inference requests return HTTP 429
3. Individual documents fail while the bulk request itself succeeds
4. Failed documents are permanently lost without retry

### Key Insight

The diagnostic runner (`elser-diagnostic-runner.ts`) proved that failures are **transient and recoverable**:

- Same documents that failed on first run succeeded when retried
- Failures correlated with queue position, not document content
- Parameter tuning (8MB chunks, 7001ms delay) improved success from 60% to 99.87%
- Document-level retry was necessary to achieve 100%

## Decision

Implement a **two-tier retry strategy** that separates transport errors from document-level failures:

### Tier 1: HTTP-Level Retry (Existing)

Retry entire chunks on transport errors (network issues, timeouts):

```typescript
async function uploadChunkWithRetry(
  es: EsTransport,
  chunk: BulkOperations,
  // ...
): Promise<ChunkUploadResult> {
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await attemptChunkUpload(es, chunk, logger);
    } catch (error) {
      // Transport error - retry entire chunk
      if (attempt === config.maxRetries) throw error;
      await sleep(calculateBackoffWithJitter(attempt, config.baseRetryDelayMs));
    }
  }
}
```

### Tier 2: Document-Level Retry (New)

After ALL chunks are processed, collect and retry documents that failed with retryable errors:

```typescript
export async function uploadAllChunks(/* ... */): Promise<number> {
  let allFailedOperations: BulkOperations = [];

  // Phase 1: Upload all initial chunks
  for (const chunk of chunks) {
    const result = await uploadChunkWithRetry(es, chunk /* ... */);
    allFailedOperations = [...allFailedOperations, ...result.failedOperations];
  }

  // Phase 2: Document-level retry
  for (let attempt = 0; attempt < maxRetries && allFailedOperations.length > 0; attempt++) {
    await sleep(calculateBackoff(attempt));
    const retryChunks = chunkOperations(allFailedOperations, MAX_CHUNK_SIZE_BYTES);
    // Retry and collect still-failed operations
    allFailedOperations = await retryChunks(retryChunks);
  }

  return totalUploaded;
}
```

### Retryable Error Detection

Only retry transient errors that may succeed on retry:

```typescript
export function isRetryableError(status: number, errorType: string): boolean {
  // Transient errors that may succeed on retry
  return status === 429 || status === 502 || status === 503 || status === 504;
}
```

**Retryable errors (will retry)**:

- HTTP 429: Rate limit / ELSER queue overflow
- HTTP 502: Bad gateway
- HTTP 503: Service unavailable
- HTTP 504: Gateway timeout

**Non-retryable errors (permanent failure)**:

- HTTP 400: Bad request / mapping errors
- HTTP 409: Version conflicts

### Configuration

```typescript
interface BulkUploadConfig {
  chunkDelayMs?: number; // Default: 7001ms (optimised 2026-01-02)
  maxRetries?: number; // Default: 3 (HTTP-level)
  documentRetryEnabled?: boolean; // Default: true
  documentMaxRetries?: number; // Default: 4
  documentRetryDelayMs?: number; // Default: 5000ms
}
```

### Optimised Constants (Verified 2026-01-02)

| Constant                                | Value  | Purpose                                    |
| --------------------------------------- | ------ | ------------------------------------------ |
| `MAX_CHUNK_SIZE_BYTES`                  | 8MB    | Smaller chunks reduce ELSER queue pressure |
| `DEFAULT_CHUNK_DELAY_MS`                | 7001ms | Base delay between chunk uploads           |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5×   | Progressive delay increase per retry       |
| `HTTP_MAX_RETRY_ATTEMPTS`               | 3      | Transport-level retry attempts             |
| `HTTP_BASE_RETRY_DELAY_MS`              | 1000ms | Base delay for HTTP backoff                |

**Initial retry delay**: Before each document retry round, an additional delay equal to the progressive chunk delay is applied to let the ELSER queue settle.

### CLI Integration

```bash
# Default behavior (retry enabled)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads

# Custom retry configuration
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --max-retries 5 --retry-delay 10000

# Disable document-level retry
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --no-retry
```

## Rationale

### Why Two Tiers?

**Separation of concerns**:

- Tier 1 handles transport failures (network level)
- Tier 2 handles document failures (application level)

**Different retry strategies**:

- Transport errors: retry immediately with short backoff
- Document errors: wait for queue to drain, then retry

**Minimal retry scope**:

- Only failed documents are retried, not entire chunks
- Reduces wasted work and queue pressure

### Why Retry After All Chunks?

**Queue draining**: ELSER queue has time to process backlog while remaining chunks upload.

**Better observability**: Failure counts are known before retry begins.

**Simpler implementation**: No need to track per-chunk retry state.

### Why Exponential Backoff with Jitter?

Prevents thundering herd when multiple documents retry simultaneously:

```typescript
function calculateBackoffWithJitter(attempt: number, baseDelayMs: number): number {
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * exponentialDelay;
  return Math.floor(jitter);
}
```

### Why Pure Functions?

Following project conventions:

- `isRetryableError`: Pure decision function
- `extractFailedOperations`: Pure transformation
- `calculateBackoffWithJitter`: Pure calculation

Easy to test, no side effects, predictable behavior.

## Consequences

### Positive

1. **100% Ingestion Success**
   - All ~12,320 lessons should now index successfully
   - Transient ELSER failures are automatically recovered

2. **Minimal Code Impact**
   - Leverages existing `extractFailedOperations` pure function
   - Follows ADR-070 retry pattern
   - No changes to document transformation logic

3. **Configurable Behavior**
   - CLI flags for custom retry settings
   - Can disable retry for debugging
   - Sensible defaults for production

4. **Observable**
   - Detailed logging of retry attempts
   - Final failure count reported
   - Success count tracked accurately

5. **Pattern Reuse**
   - Applies ADR-070 principles to ES bulk operations
   - Consistent retry behavior across the codebase

### Negative

1. **Increased Ingestion Time**
   - Retries add 5-15 seconds per retry attempt
   - Full ingestion may take 10-20% longer
   - **Mitigation**: Acceptable trade-off for reliability

2. **Memory Usage**
   - Failed operations collected in memory
   - ~47% failure rate means ~5,000 operations stored
   - **Impact**: ~1-2MB additional memory (negligible)

3. **Additional Complexity**
   - Two-tier retry adds code paths
   - More configuration options
   - **Mitigation**: Well-tested, documented, follows patterns

### Trade-offs Accepted

1. **Reliability over Speed**: We prioritize 100% success over faster ingestion.

2. **Memory over Disk**: Failed operations held in memory rather than written to disk for retry. Acceptable given expected failure counts.

3. **Retry All vs Adaptive**: We retry all retryable failures rather than implementing adaptive rate limiting. Simpler and sufficient for current needs.

## Implementation

### Module Structure

Retry logic is organized in `src/lib/indexing/retry/`:

```text
src/lib/indexing/retry/
├── index.ts              # Barrel file - public API
├── types.ts              # Retry-specific types
├── http-retry.ts         # Tier 1: HTTP-level retry
├── document-retry.ts     # Tier 2: document-level orchestration
└── chunk-processor.ts    # Retry chunk processing logic
```

### Files Modified

- `bulk-chunk-uploader.ts` - Main retry orchestration (imports from `./retry`)
- `ingest-cli-args.ts` - CLI flag parsing
- `ingest-bulk.ts` - Config wiring
- `ingest-harness-ops.ts` - dispatchBulk config parameter

### Files Created

- `src/lib/indexing/retry/` - Retry module (see structure above)
- `bulk-chunk-uploader.integration.test.ts` - Integration tests
- `e2e-tests/bulk-retry-cli.e2e.test.ts` - CLI E2E tests
- `src/lib/indexing/README.md` - Module documentation
- `src/lib/elasticsearch/setup/ingest-failure-report.ts` - JSON failure report generation

### Test Coverage

- **6 integration tests** for retry behavior
- **6 E2E tests** for CLI flags
- **All existing tests passing** (244 tests)

## Verification

### Before Implementation

| Metric          | Value                          |
| --------------- | ------------------------------ |
| Lessons indexed | 6,572 (~53%)                   |
| Failure rate    | ~47%                           |
| Failure type    | HTTP 429 `inference_exception` |

### After Implementation (✅ Verified 2026-01-02)

| Metric                   | Value           |
| ------------------------ | --------------- |
| **Documents indexed**    | 16,414          |
| **Lessons**              | 12,833          |
| **Units**                | 1,665           |
| **Threads**              | 164             |
| **Sequences**            | 30              |
| **Sequence facets**      | 57              |
| **Initial failure rate** | 0.10% (17 docs) |
| **Final failure rate**   | 0%              |
| **Retry rounds needed**  | 1               |
| **Total duration**       | ~22 minutes     |

### Optimisation History

| Run   | Chunk Size | Delay                    | Initial Failures | Retries | Time         |
| ----- | ---------- | ------------------------ | ---------------- | ------- | ------------ |
| 1     | 10MB       | 2500ms                   | 4,518 (28%)      | 4       | 21.3 min     |
| 2     | 10MB       | 4000ms                   | 1,896 (12%)      | 4       | 21.0 min     |
| 3     | 10MB       | 4000ms (+init delay)     | 2,363 (14%)      | 3       | 20.9 min     |
| 4     | 9MB        | 5000ms (+init delay)     | 677 (4%)         | 2       | 19.7 min     |
| 5     | 8MB        | 6500ms (+init delay)     | 21 (0.13%)       | 1       | 21.0 min     |
| **6** | **8MB**    | **7001ms** (+init delay) | **17 (0.10%)**   | **1**   | **22.0 min** |

### Verification Command

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --verbose
pnpm es:status
```

## References

- Diagnostic analysis: `diagnostics/elser-diagnostic-*.json`
- Plan document: `.agent/plans/semantic-search/active/elser-retry-robustness.md`
- Module documentation: `src/lib/indexing/README.md`
- Integration tests: `src/lib/indexing/bulk-chunk-uploader.integration.test.ts`
