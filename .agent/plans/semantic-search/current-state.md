# Semantic Search Current State

**Last Updated**: 2026-01-02
**Status**: ✅ **VERIFIED** — Full ingestion complete
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative source for current system metrics.

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
| **Initial failure rate** | 0.13% (21 docs) |
| **Final failure rate** | 0% |
| **Retry rounds needed** | 1 |
| **Total duration** | ~21 minutes |

### Optimised Parameters

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_CHUNK_SIZE_BYTES` | 8MB | Smaller chunks reduce ELSER queue pressure |
| `DEFAULT_CHUNK_DELAY_MS` | 6000ms | Base delay between chunk uploads |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5× | Progressive delay per retry attempt |
| Initial retry delay | ✅ Enabled | Delay before first retry chunk |

See [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) for full verification history.

---

## ES Index Counts (Verified)

| Index | Count | Expected | Status |
|-------|-------|----------|--------|
| `oak_lessons` | 12,833 | ~12,320 | ✅ Complete |
| `oak_units` | 1,665 | ~1,665 | ✅ Complete |
| `oak_unit_rollup` | 1,665 | ~1,665 | ✅ Complete |
| `oak_threads` | 164 | ~164 | ✅ Complete |
| `oak_sequences` | 0 | TBD | 📋 Next task |
| `oak_sequence_facets` | 0 | TBD | 📋 Next task |

---

## 📋 Next Task: Wire Sequence Ingestion

### Problem

The bulk download files contain sequence data, but the bulk-first ingestion pipeline does not currently process sequences. The sequence document builders exist but are not wired into the unified pipeline.

### Solution

Wire sequence document building into the existing bulk ingestion pipeline using the same adapter pattern:

1. **Existing builders**: `sequence-bulk-helpers.ts` has `buildSequenceOps` and `buildSequenceFacetOps`
2. **Single pipeline**: Use the same `dispatchBulk` flow — NO duplication
3. **Thin adapter**: Add sequence extraction to `BulkDataAdapter` or create `SequenceAdapter`

**Key constraint**: One ingestion pipeline with switchable data source adapters. Any duplication of pipeline logic is a DRY violation.

See [roadmap.md](roadmap.md) for full task details.

---

## ✅ Completed Work

| Component | Status | Documentation |
|-----------|--------|---------------|
| Two-tier retry system | ✅ Verified | [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) |
| Bulk-first ingestion | ✅ Complete | [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) |
| Missing transcript handling | ✅ Complete | [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md), [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) |
| Quality gates | ✅ All passing | 817+ tests |

---

## 📚 Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](roadmap.md) | Master plan and milestones |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry (verified) |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy |
