# Semantic Search — Navigation Hub

**Status**: ✅ **VERIFIED** — Full ingestion complete, sequence indexing pending
**Last Updated**: 2026-01-02
**Session Entry Point**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Quick Start

**For new sessions, start with the prompt file:**

➡️ **[semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)** — Session entry point

Then read:

1. **[roadmap.md](roadmap.md)** — Authoritative roadmap
2. **[current-state.md](current-state.md)** — Current metrics
3. **[ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md)** — ES Bulk Retry Strategy (verified)

**Foundation Documents (MANDATORY)**:

- [rules.md](../../directives-and-memory/rules.md) — Cardinal Rule, TDD, no type shortcuts
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

---

## ✅ Verification Complete

### Full Ingestion Results (2026-01-02)

| Metric | Value |
|--------|-------|
| **Documents indexed** | 16,327 (100%) |
| **Lessons** | 12,833 |
| **Units** | 1,665 |
| **Initial failures** | 21 (0.13%) |
| **Final failures** | 0 |
| **Duration** | ~21 minutes |

### Two-Tier Retry System (ADR-096)

| Component | Status |
|-----------|--------|
| Tier 1 (HTTP-level) retry | ✅ Verified |
| Tier 2 (document-level) retry | ✅ Verified |
| Progressive chunk delay (×1.5) | ✅ Verified |
| Initial retry delay | ✅ Verified |
| JSON failure report | ✅ Verified |
| **Production verification** | ✅ **COMPLETE** |

---

## 📋 Next Task: Sequence Indexing

**Problem**: `oak_sequences` and `oak_sequence_facets` are empty despite data being available in bulk downloads.

**Solution**: Wire sequence document building into existing bulk ingestion pipeline (NO pipeline duplication).

**See**: [roadmap.md](roadmap.md) for full task details.

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
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | **ES Bulk Retry Strategy** | ✅ Verified |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-First Ingestion | ✅ Complete |
| [ADR-094](../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) | `has_transcript` Field | ✅ Complete |
| [ADR-095](../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) | Missing Transcript Handling | ✅ Complete |
| [ADR-070](../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md) | SDK Rate Limiting and Retry | Pattern source |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Batch-Atomic Ingestion | Idempotent re-runs |

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
├── README.md                   # This file (navigation hub)
├── active/                     # Currently active work
│   └── complete-data-indexing.md  # ✅ Archived (verified)
├── planned/
│   ├── sdk-extraction/         # SDK + CLI extraction (Milestone 11)
│   └── future/                 # Post-SDK enhancements
├── archive/completed/          # Completed work
│   ├── elser-retry-robustness.md  # ✅ Archived
│   ├── missing-transcript-handling.md  # ✅ Archived
│   └── ...
└── reference-docs/             # Permanent reference material
```

---

## ES Documentation

**Do NOT guess how ES works** — read the official documentation:

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)
