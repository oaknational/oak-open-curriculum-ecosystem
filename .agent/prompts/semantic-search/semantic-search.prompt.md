# Semantic Search — Session Context

**Status**: ✅ **VERIFIED** — Full ingestion complete including sequences
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

| Index | Count |
|-------|-------|
| **Lessons** | 12,833 |
| **Units** | 1,665 |
| **Threads** | 164 |
| **Sequences** | 30 |
| **Sequence facets** | 57 |
| **Total** | 16,414 |

### Architectural Principles

This codebase follows strict rules:

- **Schema-first**: All types flow from the OpenAPI spec via the SDK
- **TDD**: Tests first, always
- **No type shortcuts**: Never use `as`, `any`, `!`, or `Record<string, unknown>`
- **Quality gates**: All checks must pass after every change
- **Single pipeline**: One ingestion pipeline with thin adapters — NO duplication

For full details, see [rules.md](../../directives-and-memory/rules.md).

---

## 🎯 NEXT TASK: DRY/SRP Refactoring (Milestone 4)

### Problem

The sequence document builders follow a DRY/SRP-compliant pattern:

```text
[Bulk Data] → [Extractor] → [Params] → [Shared Builder] → [ES Doc]
[API Data]  → [Adapter]   → [Params] → [Shared Builder] → [ES Doc]
```

Other document types have **duplicated logic** between bulk and API paths.

### Data Source Analysis

All document types have **both API and bulk paths** available (from OpenAPI spec):

| Document | API Endpoints | Bulk Available |
|----------|--------------|----------------|
| **Threads** | `GET /threads`, `GET /threads/{slug}/units` | ✅ Yes |
| **Sequences** | `GET /sequences/{seq}/units`, etc. | ✅ Yes |
| **Lessons** | `GET /lessons/{lesson}/summary`, etc. | ✅ Yes |
| **Units** | `GET /units/{unit}/summary` | ✅ Yes |

### Current DRY Violations

| Type | Shared Builder | Bulk Transformer | Status |
|------|---------------|------------------|--------|
| **Sequences** | `createSequenceDocument()` | ✅ Calls shared | ✅ DRY |
| **Threads** | `createThreadDocument()` | ❌ `transformThreadToESDoc()` duplicates | **FIX** |
| **Lessons** | `createLessonDocument()` | ❌ `transformBulkLessonToESDoc()` duplicates | **FIX** |
| **Units** | `createUnitDocument()` | ❌ `transformBulkUnitToESDoc()` duplicates | **FIX** |

### Reference Implementation

**Follow the sequence pattern** — see these files:

| File | Role |
|------|------|
| `src/lib/indexing/sequence-document-builder.ts` | Shared builder with input-agnostic `CreateSequenceDocumentParams` |
| `src/adapters/bulk-sequence-transformer.ts` | Bulk extractor that calls `createSequenceDocument()` |

### Files to Refactor

**Priority order** (simplest first):

1. **Threads** (simplest — shared builder already exists):
   - `src/lib/indexing/thread-document-builder.ts` — Already has `createThreadDocument()`
   - `src/adapters/bulk-thread-transformer.ts` — Change `transformThreadToESDoc()` to call `createThreadDocument()`

2. **Lessons** (more complex — needs params interface extraction):
   - `src/lib/indexing/document-transforms.ts` — Has `createLessonDocument()` but API-centric params
   - `src/adapters/bulk-lesson-transformer.ts` — Has separate `transformBulkLessonToESDoc()`
   - Extract input-agnostic `CreateLessonDocumentParams` interface

3. **Units** (similar to lessons):
   - `src/lib/indexing/document-transforms.ts` — Has `createUnitDocument()` but API-centric params
   - `src/adapters/bulk-unit-transformer.ts` — Has separate `transformBulkUnitToESDoc()`
   - Extract input-agnostic `CreateUnitDocumentParams` interface

### Implementation Pattern

For each document type:

1. Define `Create<DocType>Params` interface (input-agnostic)
2. Refactor existing builder to accept params interface
3. Update bulk transformer to call shared builder
4. Update API adapter to call shared builder
5. Delete duplicated transformation code

### Acceptance Criteria

- [ ] Threads: `bulk-thread-transformer.ts` calls `createThreadDocument()`
- [ ] Lessons: Single `createLessonDocument()` used by both paths
- [ ] Units: Single `createUnitDocument()` used by both paths
- [ ] All quality gates pass
- [ ] TDD: tests first for each change

**See**: [roadmap.md](../../plans/semantic-search/roadmap.md) Milestone 4

---

## ✅ What's Complete

### Full Ingestion Verified (2026-01-02)

| Component | Status |
|-----------|--------|
| Two-tier retry system | ✅ Verified |
| Bulk-first ingestion (all document types) | ✅ Verified |
| Sequence indexing | ✅ Verified |
| Missing transcript handling | ✅ Complete |
| Quality gates | ✅ All passing (835 tests) |

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
| `DEFAULT_CHUNK_DELAY_MS` | 7001ms | Base delay between chunk uploads |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5× | Progressive delay per retry attempt |

---

## 📚 Key Files (For Reference)

| File | Purpose |
|------|---------|
| `src/lib/indexing/bulk-ingestion.ts` | Bulk-first ingestion pipeline |
| `src/lib/indexing/sequence-document-builder.ts` | Shared sequence document builder |
| `src/lib/indexing/sequence-facets.ts` | Shared sequence facet builder |
| `src/adapters/bulk-sequence-transformer.ts` | Bulk-specific extractor |
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
