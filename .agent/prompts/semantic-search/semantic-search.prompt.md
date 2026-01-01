# Semantic Search — Session Context

**Status**: 🚨 **BLOCKED** — Missing transcript handling must complete first
**Last Updated**: 2026-01-01

---

## 📖 What This Is

The **Oak Open Curriculum Semantic Search** app (`apps/oak-open-curriculum-semantic-search`) indexes Oak National Academy's curriculum into Elasticsearch for hybrid search (BM25 + ELSER).

**Elasticsearch indices:**

| Index | Content | Expected Count |
|-------|---------|----------------|
| `oak_lessons` | Lesson documents with transcripts, keywords, learning points | ~12,320 |
| `oak_units` | Unit documents | ~1,665 |
| `oak_unit_rollup` | Aggregated lesson snippets per unit | ~1,665 |
| `oak_threads` | Cross-unit conceptual strands | ~164 |

**Four-retriever hybrid search:**

```
Query → [BM25 Content] ─┐
     → [BM25 Structure] ─┼─→ RRF Fusion → Results
     → [ELSER Content] ──┤
     → [ELSER Structure]─┘
```

---

## ✅ What's Complete

- Bulk-first ingestion infrastructure (ADR-093)
- SDK bulk export with schema-first types
- BulkDataAdapter, HybridDataSource, rollup builder
- CLI wiring (`--bulk` mode)
- Bulk upload robustness (chunking, retry, backoff)
- Quality gates all passing

---

## 🚨 BLOCKING WORK — DO NOT RE-INGEST

**All items below must complete BEFORE running re-ingest.**

See [missing-transcript-handling.md](../../plans/semantic-search/active/missing-transcript-handling.md) for full details.

| # | Task | Status |
|---|------|--------|
| 1 | TDD: Update unit tests FIRST (remove `[No transcript available]` assertions) | ⬜ |
| 2 | Make transcript fields optional in search schema with TSDoc explaining why | ⬜ |
| 3 | Add `has_transcript` field to search schema and mapping | ⬜ |
| 4 | Update transformer to conditionally include content fields | ⬜ |
| 5 | Investigate and resolve DRY issue (document-transforms.ts vs bulk-lesson-transformer.ts) | ⬜ |
| 6 | Add upstream API wishlist item for optional transcript schema | ⬜ |
| 7 | Run all quality gates | ⬜ |

---

## 📖 ES Documentation Finding

**Official Elasticsearch null_value documentation confirms:**

> "A `null` value cannot be indexed or searched. When a field is set to `null`, (or an empty array or an array of `null` values) it is treated as though that field has no values."

**Conclusion**: We can safely omit `lesson_content` and `lesson_content_semantic` for lessons without transcripts. Documents will still be indexed and searchable via structure fields. **No experiment needed** — the official docs are definitive.

---

## 📖 Before You Start

**Read foundation documents:**

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

**Do NOT guess how ES works — read the official documentation:**

- [ES null_value](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/null-value)
- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)

**Understand current state:**

- [current-state.md](../../plans/semantic-search/current-state.md) — Authoritative metrics
- [roadmap.md](../../plans/semantic-search/roadmap.md) — Master plan and milestones
- [complete-data-indexing.md](../../plans/semantic-search/active/complete-data-indexing.md) — Implementation phases

---

## 🎯 NEXT ACTION (After Blocking Work Complete)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force
pnpm es:status
```

---

## 📋 Active Work

| Document | Purpose | Status |
|----------|---------|--------|
| [missing-transcript-handling.md](../../plans/semantic-search/active/missing-transcript-handling.md) | ADR-095: Omit content fields for lessons without transcripts | 🚨 BLOCKING |

---

## 🔧 Quality Gates

Run after blocking work complete, from repo root:

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e
```

---

## 📚 Key ADRs

| ADR | Topic |
|-----|-------|
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first ingestion strategy |
| [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) | `has_transcript` field |
| [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) | Missing transcript handling (Option D) |

---

## ⚠️ Key Principles

1. **Read the docs** — Don't guess how ES works, read official documentation
2. **TDD always** — Red → Green → Refactor, update tests FIRST
3. **Single source of truth** — Don't duplicate code/information
4. **Schema-first** — Types flow from OpenAPI via `pnpm type-gen`
