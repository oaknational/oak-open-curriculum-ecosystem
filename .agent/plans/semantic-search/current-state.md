# Semantic Search Current State

**Last Updated**: 2026-01-01
**Status**: ✅ **IMPLEMENTATION COMPLETE** — Verification pending
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative source for current system metrics.

---

## ✅ IMPLEMENTATION COMPLETE

### Two-Tier Retry System Implemented

All code work is complete. Only verification against live Elasticsearch remains.

| Phase | Task | Status |
|-------|------|--------|
| 1 | Integration tests (TDD RED) | ✅ Complete |
| 2 | Document-level retry (TDD GREEN) | ✅ Complete |
| 3 | CLI flags | ✅ Complete |
| 4 | Refactor for excellence | ✅ Complete |
| 5 | Documentation (ADR-096, README, TSDoc) | ✅ Complete |
| 6 | Quality gates | ✅ All passing |
| **7** | **Full ingestion verification** | 📋 **NEXT SESSION** |

### Solution: ADR-096

- **Tier 1** (HTTP-level): Retries entire chunk on transport errors
- **Tier 2** (document-level): Retries individual documents that fail with transient errors

See [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md).

---

## Pre-Implementation ES State (Before Retry)

**Note**: These metrics are from before the retry system was implemented.

### Verified ES Index Counts (Pre-retry)

| Index | Count | Expected | Completion | Has semantic_text |
|-------|-------|----------|------------|-------------------|
| `oak_lessons` | 6,572 | ~12,320 | ~53% | ✅ Yes (2 fields) |
| `oak_unit_rollup` | 523 | ~1,665 | ~31% | ✅ Yes (2 fields) |
| `oak_units` | 1,635 | ~1,665 | ~98% | ❌ No |
| `oak_threads` | 164 | ~164 | 100% | ❌ No |

### Root Cause Analysis (Complete)

**ELSER queue overflow** causes document-level failures:

| Finding | Evidence |
|---------|----------|
| Queue builds over time | First 2 chunks: 100%, Chunks 3+: degraded |
| Position-dependent failures | 93% overlap between runs (750/803 same docs) |
| HTTP 429 errors | All failures are `inference_exception` |
| Only semantic_text affected | Indices without ELSER: 100% success |

---

## Retry Error Classification

**Retryable (transient failures):**

- HTTP 429: Rate limit / queue overflow (ELSER `inference_exception`)
- HTTP 502: Bad gateway
- HTTP 503: Service unavailable
- HTTP 504: Gateway timeout

**Non-retryable (permanent failures):**

- HTTP 400: Bad request (mapping errors)
- HTTP 404: Not found
- HTTP 409: Version conflict

---

## Expected Post-Implementation Metrics

After running full ingestion with retry:

| Index | Expected Count |
|-------|----------------|
| `oak_lessons` | ~12,320 |
| `oak_units` | ~1,665 |
| `oak_unit_rollup` | ~1,665 |
| `oak_threads` | ~164 |

---

## Empty Indices (Known Gap)

| Index | Count | Status |
|-------|-------|--------|
| `oak_sequence_facets` | 0 | ✅ Known gap - not in bulk path |
| `oak_sequences` | 0 | ✅ Known gap - not in bulk path |

**Finding**: The bulk-first ingestion strategy (ADR-093) does not include sequence operations. This is a known gap, not a bug.

---

## ✅ Missing Transcript Handling Complete

| # | Task | Status |
|---|------|--------|
| 1 | TDD: Update unit tests FIRST | ✅ |
| 2 | Make transcript fields optional in schema | ✅ |
| 3 | Add `has_transcript` field | ✅ |
| 4 | Update transformer | ✅ |
| 5 | Resolve DRY issue | ✅ |
| 6 | Add upstream API wishlist item | ✅ |
| 7 | Run quality gates | ✅ |

See [missing-transcript-handling.md](active/missing-transcript-handling.md) for details.

---

## 🔧 Implementation Status

| Component | Status |
|-----------|--------|
| SDK bulk export (schema-first) | ✅ Complete |
| BulkDataAdapter | ✅ Complete |
| API supplementation (Maths KS4 tiers) | ✅ Complete |
| HybridDataSource (bulk + API + rollups) | ✅ Complete |
| Bulk thread transformer | ✅ Complete |
| CLI wiring (`--bulk` mode) | ✅ Complete |
| Missing transcript handling | ✅ Complete |
| **ELSER retry system** | ✅ Complete |
| Quality gates | ✅ All passing (809 tests) |

---

## 📚 Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](roadmap.md) | Master plan and milestones |
| [elser-retry-robustness.md](active/elser-retry-robustness.md) | Solution spec |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [elser-scaling-notes.md](../../research/elasticsearch/elser/elser-scaling-notes.md) | ELSER research |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | **NEW** ES Bulk Retry |
| [ADR-070](../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md) | Retry pattern (reused) |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Idempotent re-runs |
| [ADR-088](../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) | Typed error handling |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy |
