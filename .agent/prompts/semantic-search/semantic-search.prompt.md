# Semantic Search — Session Context

**Status**: ✅ **VERIFIED** — Sequence indexing pending
**Last Updated**: 2026-01-02

---

## 📖 Project Context

### What This Project Is

This is the **Oak National Academy MCP Ecosystem** — a monorepo containing:

- **MCP servers** that expose Oak's curriculum data to AI agents (Claude, etc.)
- **Semantic search application** that powers natural language search over the curriculum
- **SDK** that provides typed access to Oak's curriculum API

### What Semantic Search Does

The semantic search app (`apps/oak-open-curriculum-semantic-search`) indexes Oak's entire curriculum into Elasticsearch for teachers and students to search using natural language. For example:

- "How do I teach fractions to Year 5?"
- "Lessons about the water cycle"
- "KS4 physics electricity"

The app uses **ELSER** (Elastic Learned Sparse EncodeR) to generate semantic embeddings, enabling search by meaning rather than just keywords.

### Current State (Verified 2026-01-02)

| Metric | Value |
|--------|-------|
| **Documents indexed** | 16,327 (100%) |
| **Lessons** | 12,833 |
| **Units** | 1,665 |
| **Threads** | 164 |
| **Sequences** | 0 (📋 next task) |

### Architectural Principles

This codebase follows strict rules:

- **Schema-first**: All types flow from the OpenAPI spec via the SDK
- **TDD**: Tests first, always
- **No type shortcuts**: Never use `as`, `any`, `!`, or `Record<string, unknown>`
- **Quality gates**: All checks must pass after every change
- **Single pipeline**: One ingestion pipeline with thin adapters — NO duplication

For full details, see [rules.md](../../directives-and-memory/rules.md).

---

## 🎯 YOUR TASK: Wire Sequence Ingestion

### Problem

The bulk download files contain sequence data (`sequenceSlug`, `sequence` array), but the bulk-first ingestion pipeline does not currently process sequences:

- `oak_sequences`: 0 documents (should have data)
- `oak_sequence_facets`: 0 documents (should have data)

### Solution

Wire sequence document building into the **existing** bulk ingestion pipeline.

**Key constraint**: One ingestion pipeline with thin adapters. Any duplication of pipeline logic is a DRY violation per [rules.md](../../directives-and-memory/rules.md).

### Implementation Approach

1. **Existing builders**: `sequence-bulk-helpers.ts` already has:
   - `buildSequenceOps()`
   - `buildSequenceFacetOps()`

2. **Integration point**: `bulk-ingestion.ts` orchestrates document building:
   - Currently calls `buildLessonIndexDoc`, `buildUnitIndexDoc`, `buildThreadDocs`
   - Add calls to sequence builders

3. **Data source**: Bulk download files already contain sequence data:
   - Each file has `sequenceSlug` and `sequence` array
   - No additional API calls needed

4. **Single pipeline**: Use the same `dispatchBulk` flow — do NOT create separate sequence ingestion

### Acceptance Criteria

- [ ] `oak_sequences` populated from bulk data
- [ ] `oak_sequence_facets` populated from bulk data
- [ ] No duplication of ingestion pipeline logic
- [ ] All quality gates pass
- [ ] TDD: tests written FIRST

### Verification Command

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --verbose
pnpm es:status
# Verify oak_sequences and oak_sequence_facets have document counts
```

---

## ✅ What's Complete (No Changes Needed)

### Full Ingestion Verified (2026-01-02)

| Component | Status |
|-----------|--------|
| Two-tier retry system | ✅ Verified |
| Bulk-first ingestion (lessons, units, threads) | ✅ Verified |
| Missing transcript handling | ✅ Complete |
| Quality gates | ✅ All passing |

### CLI Usage

```bash
# Full bulk ingestion (recommended)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --verbose

# Reset and verify
pnpm es:setup --reset
pnpm es:status
```

### CLI Flags Available

| Flag | Default | Description |
|------|---------|-------------|
| `--max-retries <n>` | 4 | Maximum document-level retry attempts |
| `--retry-delay <ms>` | 5000 | Base delay for exponential backoff |
| `--no-retry` | false | Disable document-level retry |
| `--verbose` | false | Enable detailed logging |
| `--force` | false | Proceed even if data exists |

---

## 📖 Architecture Overview

### Two-Tier Retry Strategy (ADR-096)

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

### Optimised Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_CHUNK_SIZE_BYTES` | 8MB | Smaller chunks reduce ELSER queue pressure |
| `DEFAULT_CHUNK_DELAY_MS` | 6000ms | Base delay between chunk uploads |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5× | Progressive delay per retry attempt |

---

## 📚 Key Files (For Reference)

| File | Purpose |
|------|---------|
| `src/lib/indexing/bulk-ingestion.ts` | Bulk-first ingestion pipeline |
| `src/lib/indexing/sequence-bulk-helpers.ts` | Sequence document builders |
| `src/lib/indexing/bulk-chunk-uploader.ts` | Upload orchestration |
| `src/lib/indexing/README.md` | Module documentation |
| `docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md` | ADR |

---

## 🔧 Quality Gates (Run After Any Changes)

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## ⚠️ Key Principles (MANDATORY)

1. **TDD always** — Red → Green → Refactor
2. **No type shortcuts** — No `as`, `any`, `!`
3. **Single pipeline** — NO duplication of ingestion logic
4. **Read foundation docs first**:
   - [rules.md](../../directives-and-memory/rules.md)
   - [testing-strategy.md](../../directives-and-memory/testing-strategy.md)
   - [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)

---

## 📚 Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Master roadmap |
| [current-state.md](../../plans/semantic-search/current-state.md) | Current metrics |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry (verified) |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first strategy |
