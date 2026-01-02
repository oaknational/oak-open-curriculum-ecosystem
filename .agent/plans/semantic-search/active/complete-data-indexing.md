# Milestone 1: Complete Data Indexing (Bulk-First)

**Status**: ✅ **VERIFIED** — Should be archived
**Parent**: [roadmap.md](../roadmap.md)
**Session Context**: [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md)
**Updated**: 2026-01-02

---

## ✅ VERIFICATION COMPLETE

### Full Ingestion Results (2026-01-02)

| Metric | Value |
|--------|-------|
| **Documents indexed** | 16,327 (100%) |
| **Lessons** | 12,833 |
| **Units** | 1,665 |
| **Unit rollups** | 1,665 |
| **Threads** | 164 |
| **Initial failures** | 21 (0.13%) |
| **Final failures** | 0 |
| **Retry rounds** | 1 |
| **Duration** | ~21 minutes |

### Optimised Parameters

| Constant | Value |
|----------|-------|
| `MAX_CHUNK_SIZE_BYTES` | 8MB |
| `DEFAULT_CHUNK_DELAY_MS` | 7001ms |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5× |
| Initial retry delay | ✅ Enabled |

See [ADR-096](../../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) for full optimisation history.

---

## ✅ All Phases Complete

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
| 5i | ELSER retry - Progressive delay | ✅ Complete |
| 5j | ELSER retry - JSON failure report | ✅ Complete |
| **5k** | **Full ingestion verification** | ✅ **VERIFIED** |

---

## 📋 Next Task: DRY/SRP Refactoring (Milestone 4)

This milestone is complete. Sequence indexing is also verified (30 sequences, 57 facets).

The next task is applying the DRY/SRP pattern to all document builders.

**See**: [roadmap.md](../roadmap.md) Milestone 4 for full details.

---

## 📚 Permanent Reference

### ADRs (Architectural Decisions)

| ADR | Topic | Status |
|-----|-------|--------|
| [ADR-096](../../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry Strategy | ✅ Verified |
| [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first ingestion | ✅ Complete |
| [ADR-094](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) | `has_transcript` field | ✅ Complete |
| [ADR-095](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) | Missing transcript handling | ✅ Complete |

### App Documentation

| Document | Purpose |
|----------|---------|
| [Search App README](../../../../apps/oak-open-curriculum-semantic-search/README.md) | CLI usage, setup |
| [Indexing README](../../../../apps/oak-open-curriculum-semantic-search/src/lib/indexing/README.md) | Module documentation |
| [Adapters README](../../../../apps/oak-open-curriculum-semantic-search/src/adapters/README.md) | Adapter architecture |

---

## Foundation Documents

Before any implementation:

1. [rules.md](../../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
