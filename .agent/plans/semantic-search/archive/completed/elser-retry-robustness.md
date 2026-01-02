# ELSER Retry Robustness

**Status**: ✅ **IMPLEMENTATION COMPLETE** — Verification pending
**Created**: 2026-01-01
**Updated**: 2026-01-01
**Related ADRs**: [ADR-096](../../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md), [ADR-070](../../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md), [ADR-087](../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md), [ADR-088](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md)

---

## ✅ IMPLEMENTATION COMPLETE

All code work is done. Only verification against live Elasticsearch remains.

### Implementation Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Diagnostic tooling | ✅ Complete |
| 2 | Root cause analysis | ✅ Complete |
| 3 | Solution design | ✅ Complete |
| 4.1 | Parameter tuning | ✅ Complete (60%→85%) |
| 4.2 | Retry utilities | ✅ Complete |
| 4.3 | Integration with uploader | ✅ Complete |
| 4.4 | CLI flags | ✅ Complete |
| 5 | Documentation | ✅ Complete |
| 6 | Quality gates | ✅ All passing |
| **7** | **Full ingestion verification** | 📋 **NEXT SESSION** |

### New Files Created

```text
src/lib/indexing/
├── http-retry.ts          # Tier 1 (HTTP-level) retry
├── document-retry.ts      # Tier 2 (document-level) retry
├── README.md              # Module documentation

src/lib/elasticsearch/setup/
├── ingest-cli-help.ts      # CLI help text
├── ingest-cli-processors.ts # Argument processors

docs/architecture/architectural-decisions/
└── 096-es-bulk-retry-strategy.md  # ADR
```

### CLI Flags Added

| Flag | Default | Description |
|------|---------|-------------|
| `--max-retries <n>` | 3 | Maximum document-level retry attempts |
| `--retry-delay <ms>` | 5000 | Base delay for exponential backoff |
| `--no-retry` | false | Disable document-level retry |

---

## Problem Statement (Resolved)

During bulk ingestion, approximately **50% of documents failed** with `inference_exception` errors from ELSER. The implementation now:

- ✅ Has HTTP-level retry (connection failures, timeouts)
- ✅ Logs document-level failures with details
- ✅ **NEW**: Retries documents that fail with transient errors like `inference_exception`

---

## Root Cause (Confirmed)

ELSER queue overflow causes document-level failures:

| Finding | Evidence |
|---------|----------|
| **ELSER queue overflow** | HTTP 429 errors with `inference_exception` |
| **Position-dependent** | 93% failure overlap between runs (750/803 same docs) |
| **Queue builds over time** | First 2 chunks: 100%, Chunks 3+: degraded |
| **~60% success rate** | Before retry implementation |

**Conclusion:** Failures are **transient** (queue-position-dependent), not **deterministic** (document-dependent). Document-level retry WILL work.

---

## Solution: Two-Tier Retry (ADR-096)

```text
┌─────────────────────────────────────────────────────────────┐
│                   Bulk Upload Flow                          │
│                                                             │
│  Chunk 1 ──┐                                               │
│  Chunk 2 ──┼──► Tier 1: HTTP Retry ──► ES Bulk API        │
│  Chunk N ──┘   (transport errors)                          │
│                     │                                       │
│                     ▼                                       │
│              Collect Failed Docs                           │
│                     │                                       │
│                     ▼                                       │
│            Tier 2: Document Retry                          │
│           (429, 502, 503, 504)                             │
│                     │                                       │
│                     ▼                                       │
│              Exponential Backoff                           │
│           (allow ELSER to drain)                           │
└─────────────────────────────────────────────────────────────┘
```

### Retryable vs Non-Retryable Errors

| Status | Type | Retry? | Example |
|--------|------|--------|---------|
| 429 | Rate limit | ✅ Yes | ELSER queue overflow |
| 502 | Bad gateway | ✅ Yes | Proxy errors |
| 503 | Unavailable | ✅ Yes | Service restarting |
| 504 | Timeout | ✅ Yes | Gateway timeout |
| 400 | Bad request | ❌ No | Mapping errors |
| 404 | Not found | ❌ No | Missing index |
| 409 | Conflict | ❌ No | Version conflict |

---

## Implementation Checklist

### Step 1: Parameter Tuning ✅ COMPLETE

- [x] Update `DEFAULT_CHUNK_DELAY_MS` from 500 to 2000
- [x] Update `MAX_CHUNK_SIZE_BYTES` from 20MB to 10MB
- [x] Update unit tests

### Step 2: TDD - Pure Functions ✅ COMPLETE

- [x] `extractFailedOperations(response, ops)` — in `bulk-retry-utils.ts`
- [x] `isRetryableError(status, errorType)` — in `bulk-retry-utils.ts`
- [x] 32 unit tests

### Step 3: TDD - Integration ✅ COMPLETE

- [x] Failing integration tests (6 tests)
- [x] Modify `attemptChunkUpload` to return `ChunkUploadResult`
- [x] Implement retry loop in `uploadAllChunks`
- [x] Add CLI flags
- [x] E2E tests (6 tests)

### Step 4: Documentation ✅ COMPLETE

- [x] TSDoc on all new functions
- [x] `src/lib/indexing/README.md`
- [x] ADR-096

### Step 5: Verification 📋 NEXT SESSION

- [ ] Run `pnpm diagnose:elser --limit 2000` to baseline
- [ ] Run full ingestion with retry enabled
- [ ] Verify ES document counts match expected (~12,320 lessons, ~1,665 units)

---

## Success Criteria

- [x] All quality gates pass (809 tests)
- [ ] ES document counts match expected: ~12,320 lessons, ~1,665 units
- [ ] Ingestion completes without manual intervention
- [x] Documentation complete (TSDoc, README, ADR-096)

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-096](../../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | **NEW** ES Bulk Retry Strategy |
| [ADR-070](../../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md) | Retry pattern source of truth |
| [ADR-087](../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Batch-atomic ingestion, idempotent re-runs |
| [ADR-088](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) | Typed error handling |
| [bulk-chunk-uploader.ts](../../../../apps/oak-open-curriculum-semantic-search/src/lib/indexing/bulk-chunk-uploader.ts) | Upload orchestration |
| [http-retry.ts](../../../../apps/oak-open-curriculum-semantic-search/src/lib/indexing/http-retry.ts) | Tier 1 retry |
| [document-retry.ts](../../../../apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-retry.ts) | Tier 2 retry |

---

## Foundation Documents

Before implementation, re-read:

1. [rules.md](../../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
