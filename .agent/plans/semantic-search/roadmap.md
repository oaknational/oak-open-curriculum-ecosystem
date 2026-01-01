# Semantic Search Roadmap

**Status**: ✅ **IMPLEMENTATION COMPLETE** — Verification pending
**Last Updated**: 2026-01-01
**Metrics Source**: [current-state.md](current-state.md)
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative roadmap for semantic search work.

---

## ✅ ELSER RETRY IMPLEMENTATION COMPLETE

### Implementation Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1.1 | Diagnostic script for failure analysis | ✅ Complete |
| 1.2 | Analyse document characteristics | ✅ Complete |
| 1.3 | Multiple run comparison | ✅ Complete |
| 2 | Root cause analysis with evidence | ✅ Complete |
| 3 | Solution design (informed by data) | ✅ Complete |
| 4.1 | Parameter tuning (10MB chunks, 2000ms delay) | ✅ Complete (60%→85%) |
| 4.2 | Retry utilities (`isRetryableError`, `extractFailedOperations`) | ✅ Complete |
| 4.3 | Integration with uploader | ✅ Complete |
| 4.4 | CLI flags for retry config | ✅ Complete |
| 5 | ADR-096 documentation | ✅ Complete |
| **6** | **Full ingestion verification** | 📋 **NEXT SESSION** |

### Root Cause (Confirmed)

ELSER queue overflow causes document-level failures. Evidence:

| Finding | Evidence |
|---------|----------|
| Queue builds over time | First 2 chunks: 100%, Chunks 3+: degraded |
| Position-dependent failures | 93% overlap between runs (750/803 same docs) |
| HTTP 429 errors | All failures are `inference_exception` |
| Only semantic_text affected | Indices without ELSER: 100% success |

### Solution: Two-Tier Retry (ADR-096)

- **Tier 1** (HTTP-level): Retries entire chunk on transport errors
- **Tier 2** (document-level): Retries individual documents that fail with transient errors (429, 502, 503, 504)

---

## 📋 Secondary Investigation Complete

| Issue | Status | Notes |
|-------|--------|-------|
| `oak_sequence_facets` has 0 docs | ✅ Known gap | Not in bulk-first path (ADR-093) |
| `oak_sequences` has 0 docs | ✅ Known gap | Not in bulk-first path (ADR-093) |

---

## ✅ Missing Transcript Handling Complete

See [missing-transcript-handling.md](active/missing-transcript-handling.md) for implementation details.

---

## 🎯 Next Action

**Verify full ingestion in next session:**

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

## 🔧 Implementation Status

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | SDK bulk export (schema-first) | ✅ Complete |
| 1 | BulkDataAdapter (Lesson/Unit transforms) | ✅ Complete |
| 2 | API supplementation (Maths KS4 tiers) | ✅ Complete |
| 3 | HybridDataSource (bulk + API + rollups) | ✅ Complete |
| 4 | VocabularyMiningAdapter | ✅ Complete |
| 5a | Bulk thread transformer | ✅ Complete |
| 5b | CLI wiring | ✅ Complete |
| 5c | Missing transcript handling | ✅ Complete |
| 5d | ELSER retry - Parameter tuning | ✅ Complete (60%→85%) |
| 5e | ELSER retry - Retry utilities | ✅ Complete |
| 5f | ELSER retry - Integration | ✅ Complete |
| 5g | ELSER retry - CLI flags | ✅ Complete |
| 5h | ELSER retry - Documentation | ✅ Complete |
| **5i** | **Full ingestion run** | 📋 **NEXT SESSION** |

---

## Linear Path to Success

### Milestone 1: Complete ES Ingestion (Bulk-First)

**Status**: ✅ Implementation complete, verification pending
**Specification**: [complete-data-indexing.md](active/complete-data-indexing.md)

### Milestone 2: Missing Transcript Handling

**Status**: ✅ COMPLETE
**Specification**: [missing-transcript-handling.md](active/missing-transcript-handling.md)
**ADRs**: [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md), [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)

### Milestone 3: Synonym Quality Audit

**Status**: 📋 Pending (blocked on Milestone 1 verification)
**Specification**: [synonym-quality-audit.md](planned/future/synonym-quality-audit.md)

### Milestone 4-11: Future Work

See individual specification files in `planned/` directory.

### Milestone 12: Conversational Search (Tier 4)

**Status**: 📋 Deferred — Tier 4 work
**Specification**: [conversational-search.md](planned/future/conversational-search.md)

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [current-state.md](current-state.md) | Authoritative metrics |
| [elser-retry-robustness.md](active/elser-retry-robustness.md) | Solution spec |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [elser-scaling-notes.md](../../research/elasticsearch/elser/elser-scaling-notes.md) | ELSER research |
| [ADR-070](../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md) | Retry pattern (reused) |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Idempotent re-runs |
| [ADR-088](../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) | Typed error handling |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | **NEW** ES Bulk Retry |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
4. [elser-scaling-notes.md](../../research/elasticsearch/elser/elser-scaling-notes.md) — ELSER behaviour

**Do NOT guess how ES works** — read the official documentation:

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)
