# ADR-096: Elasticsearch Bulk Retry Strategy

**Status**: Accepted

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
- Parameter tuning (10MB chunks, 2000ms delay) improved success from 60% to 85%
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
  chunkDelayMs?: number; // Default: 2000ms
  maxRetries?: number; // Default: 3 (HTTP-level)
  documentRetryEnabled?: boolean; // Default: true
  documentMaxRetries?: number; // Default: 3
  documentRetryDelayMs?: number; // Default: 5000ms
}
```

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

### Files Modified

- `bulk-chunk-uploader.ts` - Main retry implementation
- `ingest-cli-args.ts` - CLI flag parsing
- `ingest-bulk.ts` - Config wiring
- `ingest-harness-ops.ts` - dispatchBulk config parameter

### Files Created

- `bulk-chunk-uploader.integration.test.ts` - Integration tests
- `e2e-tests/bulk-retry-cli.e2e.test.ts` - CLI E2E tests
- `src/lib/indexing/README.md` - Module documentation

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

### Expected After Implementation

| Metric          | Value              |
| --------------- | ------------------ |
| Lessons indexed | ~12,320 (100%)     |
| Failure rate    | 0% (after retries) |
| Additional time | 10-20% longer      |

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
