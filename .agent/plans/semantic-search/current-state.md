# Semantic Search Current State

**Last Updated**: 2026-01-02
**Status**: ✅ **VERIFIED** — Full ingestion complete including sequences
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative source for current system metrics.

---

## ✅ Full Ingestion Verified (2026-01-02)

### Document Counts

| Index | Indexed | ES Count | Notes |
|-------|---------|----------|-------|
| `oak_lessons` | 12,833 | 184,985 | ES count includes ELSER sub-documents |
| `oak_units` | 1,665 | 1,635 | ✅ |
| `oak_unit_rollup` | 1,665 | 165,345 | ES count includes ELSER sub-documents |
| `oak_threads` | 164 | 164 | ✅ |
| `oak_sequences` | 30 | 30 | ✅ NEW |
| `oak_sequence_facets` | 57 | 57 | ✅ NEW |
| **Total** | **16,414** | — | |

**Note**: ES document counts for indexes with `semantic_text` fields are higher due to ELSER creating internal sub-documents for sparse vector storage.

### Ingestion Metrics

| Metric | Value |
|--------|-------|
| **Documents indexed** | 16,414 |
| **Initial failures** | 17 (0.10%) |
| **Final failures** | 0 |
| **Retry rounds** | 1 |
| **Duration** | ~22 minutes |

### Optimised Parameters

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_CHUNK_SIZE_BYTES` | 8MB | Smaller chunks reduce ELSER queue pressure |
| `DEFAULT_CHUNK_DELAY_MS` | 7001ms | Base delay between chunk uploads |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5× | Progressive delay per retry attempt |
| Initial retry delay | ✅ Enabled | Delay before first retry chunk |

See [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) for implementation details.

---

## Next Priority: DRY/SRP Refactoring (Milestone 4)

The DRY/SRP pattern used for sequences **must** be applied to lessons, units, and threads.
See [roadmap.md](roadmap.md) Milestone 4 — **HIGH priority**.

---

## ✅ Completed Work

| Component | Status | Documentation |
|-----------|--------|---------------|
| Two-tier retry system | ✅ Verified | [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) |
| Bulk-first ingestion | ✅ Verified | [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) |
| Missing transcript handling | ✅ Complete | [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md), [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) |
| Sequence indexing | ✅ Verified | [roadmap.md](roadmap.md) Milestone 2 |
| Quality gates | ✅ All passing | 835 tests |

---

## 📚 Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](roadmap.md) | Master plan and milestones |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry (verified) |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy |
