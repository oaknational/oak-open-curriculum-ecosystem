# Semantic Search — Navigation Hub

**Status**: ✅ **Full ingestion verified** — Now optimising search quality
**Last Updated**: 2026-01-02
**Session Entry Point**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Quick Start

**For new sessions, start with the prompt file:**

➡️ **[semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)** — Standalone session entry point

Then read:

1. **[roadmap.md](roadmap.md)** — Authoritative roadmap
2. **[current-state.md](current-state.md)** — Current metrics
3. **[search-acceptance-criteria.md](search-acceptance-criteria.md)** — Tier definitions

**Foundation Documents (MANDATORY)**:

- [rules.md](../../directives-and-memory/rules.md) — Cardinal Rule, TDD, no type shortcuts
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

---

## Current ES Index State (2026-01-02)

| Index | Documents | Storage |
|-------|-----------|---------|
| `oak_lessons` | 184,985 | 806.62MB |
| `oak_unit_rollup` | 165,345 | 706.06MB |
| `oak_units` | 1,635 | 8.94MB |
| `oak_threads` | 164 | 255.53KB |
| `oak_sequence_facets` | 57 | 375.14KB |
| `oak_sequences` | 30 | 267.67KB |
| `oak_meta` | 1 | 5.34KB |

**Actual documents**: 16,414 (ES counts include ELSER sub-documents)

---

## 🎯 Next Priority: Search Quality Optimization

**Milestone 3** combines:
- Comprehensive ground truths (all subjects, all key stages)
- Baseline benchmarks
- Synonym audit and improvement
- Bulk download data analysis

**Current gap**: Ground truths cover KS4 Maths only (73 queries). Need 200+ for full curriculum.

See [roadmap.md](roadmap.md) for details.

---

## ✅ Completed Milestones

| Milestone | Status |
|-----------|--------|
| M1: Complete ES Ingestion | ✅ Verified |
| M2: Sequence Indexing | ✅ Verified |
| M4: DRY/SRP Refactoring | ✅ Complete |
| M5: Data Completeness | ✅ Complete |

---

## Architecture: Two-Tier Retry

```text
┌─────────────────────────────────────────────────────────────┐
│                   Bulk Upload Flow                          │
│                                                             │
│  Chunk 1 ──┐                                               │
│  Chunk 2 ──┼──► Tier 1: HTTP Retry ──► ES Bulk API        │
│  Chunk N ──┘   (transport errors)                          │
│                     │                                       │
│                     ▼                                       │
│              Collect Failed Docs                           │
│                     │                                       │
│                     ▼                                       │
│            Tier 2: Document Retry                          │
│           (429, 502, 503, 504)                             │
│                     │                                       │
│                     ▼                                       │
│        Progressive Chunk Delay (×1.5)                      │
│           (allow ELSER to drain)                           │
└─────────────────────────────────────────────────────────────┘
```

**See**: [ADR-096: ES Bulk Retry Strategy](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)

---

## Key ADRs

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry Strategy | ✅ Verified |
| [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) | Context Enrichment | ✅ Complete |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-First Ingestion | ✅ Complete |
| [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) | Phrase Query Boosting | ✅ Implemented |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-First Strategy | Active |

---

## Quality Gates

Run from repo root after any changes:

```bash
pnpm type-gen && pnpm build && pnpm type-check
pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
pnpm test:ui && pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Directory Structure

```text
.agent/plans/semantic-search/
├── roadmap.md                  # Authoritative linear roadmap
├── current-state.md            # Current metrics snapshot
├── search-acceptance-criteria.md # Tier definitions
├── README.md                   # This file (navigation hub)
├── planned/
│   ├── future/                 # Future milestones
│   │   ├── synonym-quality-audit.md  # M3: Search quality
│   │   ├── conversational-search.md  # M11: LLM search
│   │   └── ...
│   └── sdk-extraction/         # SDK + CLI extraction
├── archive/completed/          # Completed work
└── reference-docs/             # Permanent reference material
```

---

## ES Documentation

**Do NOT guess how ES works** — read the official documentation:

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)
