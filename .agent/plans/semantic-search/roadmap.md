# Semantic Search Roadmap

**Status**: 🚨 **BLOCKED** — Missing transcript handling must complete first
**Last Updated**: 2026-01-01
**Metrics Source**: [current-state.md](current-state.md)
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative roadmap for semantic search work.

---

## 🚨 BLOCKED — Missing Transcript Handling

**All re-ingestion work is blocked until missing transcript handling is complete.**

See [missing-transcript-handling.md](active/missing-transcript-handling.md) for:

- Full implementation checklist
- ES documentation research findings
- TDD requirements

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

## ✅ Bulk Ingestion Fixes Complete

All critical fixes implemented and quality gates passing:

| Fix | Status | ADR |
|-----|--------|-----|
| Transcript NULL handling | ✅ Complete | [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) |
| Semantic summary generation | ✅ Complete | — |
| Rollup document creation | ✅ Complete | — |
| Bulk upload robustness | ✅ Complete | — |

**Archived**: [bulk-ingestion-fixes.md](archive/completed/bulk-ingestion-fixes.md)

---

## 📋 Active Work

| Document | Status | Description |
|----------|--------|-------------|
| [missing-transcript-handling.md](active/missing-transcript-handling.md) | 🚨 BLOCKING | Option D: Omit content fields for lessons without transcripts |

---

## 📋 Pending Actions

| Action | Status | Notes |
|--------|--------|-------|
| **Missing transcript handling** | 🚨 BLOCKING | Must complete first |
| **Clean slate re-ingest** | 📋 BLOCKED | After transcript handling |
| **Run full metrics** | 📋 Pending | After re-ingest |
| **Fuzzy matching diagnostic** | 📋 Pending | Create ES explain query |
| **Unit query categories** | 📋 Pending | Add `category` field to ground truth |
| **RSHE-PSHE 422 handling** | 📋 Pending | Implement in search SDK |

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
| 5c | Missing transcript handling | 🚨 BLOCKING |
| 5d | Full ingestion | 📋 BLOCKED |

---

## Linear Path to Success

### Milestone 1: Complete ES Ingestion (Bulk-First)

**Status**: 🚨 BLOCKED on missing transcript handling
**Specification**: [complete-data-indexing.md](active/complete-data-indexing.md)

**Expected after re-ingest**:

| Index | Expected Count |
|-------|----------------|
| `oak_lessons` | ~12,320 |
| `oak_units` | ~1,665 |
| `oak_unit_rollup` | ~1,665 |
| `oak_threads` | ~164 |

### Milestone 2: Missing Transcript Handling

**Status**: 🚨 IN PROGRESS — BLOCKING
**Specification**: [missing-transcript-handling.md](active/missing-transcript-handling.md)
**ADRs**: [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md), [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)

### Milestone 3: Synonym Quality Audit

**Status**: 📋 Pending (blocked on Milestone 2)
**Specification**: [synonym-quality-audit.md](planned/future/synonym-quality-audit.md)

### Milestone 4-11: Future Work

See individual specification files in `planned/` directory.

### Milestone 12: Conversational Search (Tier 4)

**Status**: 📋 Deferred — Tier 4 work
**Specification**: [conversational-search.md](planned/future/conversational-search.md)

For queries requiring intent understanding (e.g., "challenging extension work for able mathematicians").

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen && pnpm build && pnpm type-check
pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e
```

**All gates must pass. No exceptions.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [current-state.md](current-state.md) | Authoritative metrics |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy |
| [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) | `has_transcript` field |
| [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) | Missing transcript handling |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

**Do NOT guess how ES works** — read the official documentation:

- [ES null_value](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/null-value)
- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
