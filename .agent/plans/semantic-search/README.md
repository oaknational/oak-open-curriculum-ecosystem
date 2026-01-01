# Semantic Search — Navigation Hub

**Status**: 🚨 **BLOCKED** — Missing transcript handling must complete first
**Last Updated**: 2026-01-01
**Session Entry Point**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Quick Start

**For new sessions, start with the prompt file:**

➡️ **[semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)** — Session entry point

Then read:

1. **[roadmap.md](roadmap.md)** — Authoritative roadmap
2. **[current-state.md](current-state.md)** — Current metrics
3. **[missing-transcript-handling.md](active/missing-transcript-handling.md)** — **BLOCKING WORK**

**Foundation Documents (MANDATORY)**:

- [rules.md](../../directives-and-memory/rules.md) — Cardinal Rule, TDD, no type shortcuts
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

---

## 🚨 Current Status: BLOCKED

**All re-ingestion is blocked until missing transcript handling is complete.**

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

## ✅ What's Complete

| Component | Status |
|-----------|--------|
| Bulk-first ingestion strategy (ADR-093) | ✅ Complete |
| SDK bulk export with schema-first types | ✅ Complete |
| BulkDataAdapter, HybridDataSource, rollup builder | ✅ Complete |
| CLI wiring (`--bulk` mode) | ✅ Complete |
| Bulk upload robustness (chunking, retry, backoff) | ✅ Complete |
| Quality gates | ✅ All passing |

---

## Architecture: Bulk-First Ingestion

| Source | Purpose | Coverage |
|--------|---------|----------|
| **Bulk Download** | Lessons, transcripts (81%), metadata | 16/17 subjects |
| **API** | Tier info (maths KS4), unit options | Structural data only |

**See**: [ADR-093: Bulk-First Ingestion Strategy](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)

### Four-Retriever Hybrid Search

```text
Query → [BM25 Content] ─┐
     → [BM25 Structure] ─┼─→ RRF Fusion → Results
     → [ELSER Content] ──┤
     → [ELSER Structure]─┘
```

---

## Key ADRs

| ADR | Title | Purpose |
|-----|-------|---------|
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-First Ingestion | Strategic pivot |
| [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) | `has_transcript` Field | Filtering/debugging |
| [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) | Missing Transcript Handling | Option D: Omit content fields |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-First Strategy | Tier prioritisation |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Batch-Atomic Ingestion | Resilient ingestion |

---

## Quality Gates

Run from repo root after any changes:

```bash
pnpm type-gen && pnpm build && pnpm type-check
pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e
```

**All gates must pass. No exceptions.**

---

## Directory Structure

```text
.agent/plans/semantic-search/
├── roadmap.md                  # Authoritative linear roadmap
├── current-state.md            # Current metrics snapshot
├── README.md                   # This file (navigation hub)
├── active/                     # Currently blocking work (2 docs only)
│   ├── missing-transcript-handling.md  # 🚨 BLOCKING
│   └── complete-data-indexing.md       # Implementation phases
├── planned/
│   ├── sdk-extraction/         # SDK + CLI extraction (Milestone 11)
│   │   ├── search-sdk-cli.md
│   │   ├── evaluation-infrastructure.md
│   │   └── vocabulary-mining-bulk.md
│   └── future/                 # Post-SDK enhancements
│       ├── synonym-quality-audit.md
│       ├── es-native-enhancements.md
│       ├── advanced-features.md
│       └── (+ 8 more)
├── archive/completed/          # Completed work (9 docs)
└── reference-docs/             # Permanent reference material
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | **Session entry point** |
| [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md) | Data quality issues |
| [bulk-download-vs-api-comparison.md](../../analysis/bulk-download-vs-api-comparison.md) | Strategic analysis |
| [evaluations/README.md](../../evaluations/README.md) | Evaluation framework |

---

## ES Documentation

**Do NOT guess how ES works** — read the official documentation:

- [ES null_value](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/null-value)
- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
