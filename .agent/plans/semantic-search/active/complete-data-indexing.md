# Milestone 1: Complete Data Indexing (Bulk-First)

**Status**: 🚨 **BLOCKED** — Missing transcript handling must complete first
**Parent**: [roadmap.md](../roadmap.md)
**Session Context**: [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md)
**Updated**: 2026-01-01

---

## 🚨 BLOCKED: Missing Transcript Handling

**All re-ingestion work is blocked until missing transcript handling is complete.**

See [missing-transcript-handling.md](missing-transcript-handling.md) for:

- Full implementation checklist with TDD requirements
- ES documentation research findings
- DRY issue investigation

---

## ✅ Completed Phases (Brief Summary)

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | SDK bulk export (schema-first) | ✅ Complete |
| 1 | BulkDataAdapter (Lesson/Unit transforms) | ✅ Complete |
| 2 | API supplementation (Maths KS4 tiers) | ✅ Complete |
| 3 | HybridDataSource (bulk + API + rollups) | ✅ Complete |
| 4 | VocabularyMiningAdapter | ✅ Complete |
| 5a | Bulk thread transformer | ✅ Complete |
| 5b | CLI wiring (`--bulk` mode) | ✅ Complete |
| **5c** | **Missing transcript handling** | 🚨 **BLOCKING** |
| 5d | Full ingestion run | 📋 Pending (blocked) |

**Completed infrastructure**:

- `src/adapters/bulk-thread-transformer.ts`
- `src/adapters/bulk-rollup-builder.ts`
- `src/lib/indexing/bulk-ingestion.ts`
- `src/lib/indexing/bulk-chunk-uploader.ts`
- CLI: `--bulk` flag and `--bulk-dir` option

---

## 🎯 Next Action (After Blocking Complete)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force
pnpm es:status
```

**Expected results**:

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
| [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first ingestion strategy |
| [ADR-094](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) | `has_transcript` field |
| [ADR-095](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) | Missing transcript handling |

### App Documentation

| Document | Purpose |
|----------|---------|
| [Search App README](../../../../apps/oak-open-curriculum-semantic-search/README.md) | CLI usage, setup |
| [Adapters README](../../../../apps/oak-open-curriculum-semantic-search/src/adapters/README.md) | Adapter architecture |

### Research & Analysis

| Document | Purpose |
|----------|---------|
| [bulk-download-vs-api-comparison.md](../../../analysis/bulk-download-vs-api-comparison.md) | Strategic analysis |
| [07-bulk-download-data-quality-report.md](../../../research/ooc/07-bulk-download-data-quality-report.md) | Data quality issues |

### Archives (Historical Interest)

| Document | Purpose |
|----------|---------|
| [bulk-ingestion-fixes.md](../archive/completed/bulk-ingestion-fixes.md) | Issues fixed 2025-12-31 |
| [pattern-aware-ingestion.md](../archive/completed/pattern-aware-ingestion.md) | 7 API patterns |
| [bulk-api-parity-requirements.md](../archive/completed/bulk-api-parity-requirements.md) | Original specification |

---

## Foundation Documents

Before any implementation:

1. [rules.md](../../../directives-and-memory/rules.md) — TDD, no type shortcuts
2. [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
