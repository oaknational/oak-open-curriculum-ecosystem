# Semantic Search Current State

**Last Updated**: 2026-01-01
**Status**: 🚨 **BLOCKED** — Missing transcript handling must complete first
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative source for current system metrics.

---

## 🚨 BLOCKED — Missing Transcript Handling

**All re-ingestion work is blocked until missing transcript handling is complete.**

See [missing-transcript-handling.md](active/missing-transcript-handling.md) for full details.

| # | Blocking Task | Status |
|---|---------------|--------|
| 1 | TDD: Update unit tests FIRST | ⬜ |
| 2 | Make transcript fields optional in schema | ⬜ |
| 3 | Add `has_transcript` field | ⬜ |
| 4 | Update transformer | ⬜ |
| 5 | Resolve DRY issue | ⬜ |
| 6 | Add upstream API wishlist item | ⬜ |
| 7 | Run quality gates | ⬜ |

---

## 🎯 Next Action (After Blocking Complete)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force
pnpm es:status
```

---

## 📊 Expected Results After Re-ingest

| Index | Expected Count | Previous (Broken) |
|-------|----------------|-------------------|
| `oak_lessons` | ~12,320 | 2,884 |
| `oak_units` | ~1,665 | 1,635 |
| `oak_unit_rollup` | ~1,665 | **0** (empty!) |
| `oak_threads` | ~164 | 164 |

---

## 📋 Pending Work

| Item | Status | Document |
|------|--------|----------|
| Missing transcript handling (Option D) | 🚨 BLOCKING | [missing-transcript-handling.md](active/missing-transcript-handling.md) |
| Fuzzy matching investigation | 📋 Pending | Create diagnostic script |
| Unit hard query categories | 📋 Pending | Add `category` field |
| RSHE-PSHE 422 handling | 📋 Pending | Implement in search SDK |

---

## 📊 Search Quality Metrics

**Evaluation data lives in** [evaluations/baselines/hard-query-baseline.md](../../evaluations/baselines/hard-query-baseline.md).

**Status**: Measurements need re-running after blocking work + re-ingest.

```bash
# Run after re-ingest
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category
```

---

## 🔧 Implementation Status

| Component | Status |
|-----------|--------|
| SDK bulk export (schema-first) | ✅ Complete |
| BulkDataAdapter | ✅ Complete (fixes applied) |
| API supplementation (Maths KS4 tiers) | ✅ Complete |
| HybridDataSource (bulk + API + rollups) | ✅ Complete |
| Bulk thread transformer | ✅ Complete |
| CLI wiring (`--bulk` mode) | ✅ Complete |
| Bulk upload robustness (retry/backoff) | ✅ Complete |
| **Missing transcript handling** | 🚨 BLOCKING |
| Quality gates | ⏳ After blocking work |

---

## 📚 Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](roadmap.md) | Master plan and milestones |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [missing-transcript-handling.md](active/missing-transcript-handling.md) | Active work: Blocking |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy |
| [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) | `has_transcript` field |
| [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) | Missing transcript handling |
