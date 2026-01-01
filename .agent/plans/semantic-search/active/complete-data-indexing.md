# Milestone 1: Complete Data Indexing (Bulk-First)

**Status**: ✅ **IMPLEMENTATION COMPLETE** — Verification pending
**Parent**: [roadmap.md](../roadmap.md)
**Session Context**: [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md)
**Updated**: 2026-01-01

---

## ✅ ELSER RETRY IMPLEMENTATION COMPLETE

All code work is done. Only verification against live Elasticsearch remains.

### Implementation Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Diagnostic tooling | ✅ Complete |
| 2 | Root cause analysis | ✅ Complete |
| 3 | Solution design | ✅ Complete |
| 4.1 | Parameter tuning (10MB chunks, 2000ms delay) | ✅ Complete (60%→85%) |
| 4.2 | Retry utilities | ✅ Complete |
| 4.3 | Integration with uploader | ✅ Complete |
| 4.4 | CLI flags | ✅ Complete |
| 5 | Documentation (ADR-096) | ✅ Complete |
| 6 | Quality gates | ✅ All passing |
| **7** | **Full ingestion verification** | 📋 **NEXT SESSION** |

See [elser-retry-robustness.md](elser-retry-robustness.md) and [ADR-096](../../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) for details.

---

## Pre-Implementation ES State

| Index | Count | Expected | Completion |
|-------|-------|----------|------------|
| `oak_lessons` | 6,572 | ~12,320 | ~53% |
| `oak_unit_rollup` | 523 | ~1,665 | ~31% |
| `oak_units` | 1,635 | ~1,665 | ~98% |
| `oak_threads` | 164 | ~164 | 100% |

### Root Cause (Confirmed)

ELSER queue overflow causes document-level failures:

| Finding | Evidence |
|---------|----------|
| Queue builds over time | First 2 chunks: 100%, Chunks 3+: degraded |
| Position-dependent failures | 93% overlap between runs (750/803 same docs) |
| HTTP 429 errors | All failures are `inference_exception` |
| Only semantic_text affected | Indices without ELSER: 100% success |

---

## ✅ Completed Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | SDK bulk export (schema-first) | ✅ Complete |
| 1 | BulkDataAdapter (Lesson/Unit transforms) | ✅ Complete |
| 2 | API supplementation (Maths KS4 tiers) | ✅ Complete |
| 3 | HybridDataSource (bulk + API + rollups) | ✅ Complete |
| 4 | VocabularyMiningAdapter | ✅ Complete |
| 5a | Bulk thread transformer | ✅ Complete |
| 5b | CLI wiring (`--bulk` mode) | ✅ Complete |
| 5c | Missing transcript handling | ✅ Complete |
| 5d | ELSER retry - Parameter tuning | ✅ Complete |
| 5e | ELSER retry - Utilities | ✅ Complete |
| 5f | ELSER retry - Integration | ✅ Complete |
| 5g | ELSER retry - CLI flags | ✅ Complete |
| 5h | ELSER retry - Documentation | ✅ Complete |
| **5i** | **Full ingestion run** | 📋 **NEXT SESSION** |

---

## 🎯 Next Action (Next Session)

Run full ingestion and verify success:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --verbose
pnpm es:status
```

**Expected results:**

| Index | Expected Count |
|-------|----------------|
| `oak_lessons` | ~12,320 |
| `oak_units` | ~1,665 |
| `oak_unit_rollup` | ~1,665 |
| `oak_threads` | ~164 |

---

## 📚 Permanent Reference

### ADRs (Architectural Decisions)

| ADR | Topic |
|-----|-------|
| [ADR-096](../../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | **NEW** ES Bulk Retry Strategy |
| [ADR-070](../../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md) | Retry pattern (reused) |
| [ADR-087](../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Batch-atomic ingestion, idempotent re-runs |
| [ADR-088](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) | Typed error handling |
| [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first ingestion strategy |
| [ADR-094](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) | `has_transcript` field |
| [ADR-095](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) | Missing transcript handling |

### App Documentation

| Document | Purpose |
|----------|---------|
| [Search App README](../../../../apps/oak-open-curriculum-semantic-search/README.md) | CLI usage, setup |
| [Indexing README](../../../../apps/oak-open-curriculum-semantic-search/src/lib/indexing/README.md) | **NEW** Module documentation |
| [Adapters README](../../../../apps/oak-open-curriculum-semantic-search/src/adapters/README.md) | Adapter architecture |

---

## Foundation Documents

Before any implementation:

1. [rules.md](../../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
