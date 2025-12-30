# Semantic Search — Navigation Hub

**Status**: 🔄 Strategic pivot to bulk-first ingestion
**Last Updated**: 2025-12-30
**Index Coverage**: 3% (437 maths KS1 lessons indexed)

---

## Quick Start

For new sessions, read in order:

1. **[roadmap.md](roadmap.md)** — **Single authoritative roadmap** (bulk-first pivot)
2. **[current-state.md](current-state.md)** — Current metrics snapshot
3. **[complete-data-indexing.md](active/complete-data-indexing.md)** — **Implementation plan** (NEXT STEP)
4. **[search-acceptance-criteria.md](search-acceptance-criteria.md)** — Definition of done

**Foundation Documents (MANDATORY)**:

- [rules.md](../../directives-and-memory/rules.md) — Cardinal Rule, TDD, no type shortcuts
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

---

## 🔄 Strategic Pivot: Bulk-First Ingestion (2025-12-30)

**Decision**: Use bulk download as primary data source with API for supplementary data.

| Source | Purpose | Coverage |
|--------|---------|----------|
| **Bulk Download** | Lessons, transcripts (81%), metadata | All 17 subjects |
| **API** | Tier info (maths KS4), unit options | Structural data only |

**Key findings** ([bulk-download-vs-api-comparison.md](../../analysis/bulk-download-vs-api-comparison.md)):

- Bulk has transcripts for 81% of lessons (API only ~16%)
- Bulk has NO tier information (373 maths lessons duplicated)
- Bulk has NO unit options (geography/english KS4)
- RSHE-PSHE bulk file unavailable → returns 422 Unprocessable Content

**Bulk download infrastructure**: ✅ Complete (2025-12-30)

- Script: `apps/.../scripts/download-bulk.ts`
- Command: `pnpm bulk:download`
- Files: 30 JSON files, ~757 MB

**See**: [ADR-093: Bulk-First Ingestion Strategy](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)

### Architecture: Composition Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  vocab-gen (EXISTING)                  OakClient (EXISTING)      │
│  ├── parseBulkFile()                   ├── getSequenceUnits()    │
│  ├── readAllBulkFiles()                └── (tier only)           │
│  ├── Lesson, Unit types                                          │
│  └── Zod validation                                              │
│                              ↓                                   │
│              ┌─────────────────────────────────────┐             │
│              │   Bulk Data Adapter (NEW — thin)    │             │
│              │   Transforms bulk → ES doc format   │             │
│              └─────────────────────────────────────┘             │
│                              ↓                                   │
│              ┌─────────────────────────────────────┐             │
│              │      HybridDataSource (NEW)         │             │
│              │  Composes bulk + API as needed      │             │
│              └─────────────────────────────────────┘             │
│                              ↓                                   │
│              ┌─────────────────────────────────────┐             │
│              │    Existing Pipeline (MODIFIED)     │             │
│              │    index-oak.ts → ES Indexer        │             │
│              └─────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Existing Infrastructure (REUSE — DO NOT RECREATE)

Bulk download parsing is ALREADY IMPLEMENTED in `vocab-gen`:

| Module | Location | Purpose |
|--------|----------|---------|
| `parseBulkFile()` | `vocab-gen/lib/bulk-reader.ts` | Parse single file |
| `readAllBulkFiles()` | `vocab-gen/lib/bulk-reader.ts` | Parse all files |
| `lessonSchema` | `vocab-gen/lib/lesson-schema.ts` | Lesson Zod validation |
| `unitSchema` | `vocab-gen/lib/unit-schemas.ts` | Unit Zod validation |
| `nullSentinelSchema` | `vocab-gen/lib/vocabulary-schemas.ts` | `"NULL"` → `null` |

**Data quality issues**: [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md)

---

## Next Steps

### Phase 1: Bulk Data Adapter (TDD) — **NEXT STEP**

1. **Wrap vocab-gen** — DO NOT recreate parsing
2. Transform `Lesson` → `SearchLessonsIndexDoc`
3. Transform `Unit` → `SearchUnitsIndexDoc`
4. Extract threads from `sequence[].threads[]`

**Implementation details**: [complete-data-indexing.md](active/complete-data-indexing.md)

### Phase 2: Hybrid Data Source

1. Create `HybridDataSource` composing bulk + API
2. API calls only for: maths KS4 tiers, geography/english unit options
3. RSHE-PSHE: Return 422 Unprocessable Content

### Phase 3: Pipeline Integration

1. Update `index-oak.ts` to use `HybridDataSource`
2. Minimal changes to existing pipeline
3. Full ingestion run: `pnpm es:ingest-live --all --verbose`

### Completed Infrastructure ✅

- ~~Remove `video-availability.ts`~~ — **Done**
- ~~Create bulk download script~~ — **Done**
- ~~Download fresh bulk data~~ — **Done** (30 files, 757 MB)

---

## ⚠️ Measurement Discipline

**Every search-affecting change must be measured.**

| Step        | Action                     | Tool                         |
| ----------- | -------------------------- | ---------------------------- |
| 1. Baseline | Record current metrics     | `pnpm eval:per-category`     |
| 2. Hypothesis | Document expected impact | `experiments/*.experiment.md`|
| 3. Implement | Make the change           | —                            |
| 4. Measure  | Run evaluation             | `pnpm eval:per-category`     |
| 5. Record   | Document results           | [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) |
| 6. Decide   | Accept/reject based on evidence | —                       |

**Framework**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)
**Ground Truths**: [.agent/evaluations/](../../evaluations/README.md)

---

## Foundation Documents (MANDATORY)

| Document                   | Purpose                              |
| -------------------------- | ------------------------------------ |
| [rules.md](../../directives-and-memory/rules.md) | First Question: "Could it be simpler?" |
| [testing-strategy.md](../../directives-and-memory/testing-strategy.md) | Test pyramid, TDD approach |
| [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) | Generator is source of truth |
| [AGENT.md](../../directives-and-memory/AGENT.md) | Agent-specific directives |

---

## Key ADRs

| ADR        | Title                      | Purpose                |
| ---------- | -------------------------- | ---------------------- |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | **Bulk-First Ingestion** | Strategic pivot |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-First Strategy | Tier prioritisation |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground Truth Validation | Slug validation discipline |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Batch-Atomic Ingestion | Resilient ingestion |
| [ADR-091](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) | ~~Video Availability~~ | **Superseded by ADR-093** |

---

## Quality Gates

Run from repo root after any changes:

```bash
pnpm type-gen          # Makes changes
pnpm build             # Makes changes
pnpm type-check
pnpm lint:fix          # Makes changes
pnpm format:root       # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Directory Structure

```text
.agent/plans/semantic-search/
├── roadmap.md                  # Authoritative linear roadmap
├── current-state.md            # Current metrics snapshot
├── search-acceptance-criteria.md # Definition of done
├── README.md                   # This file
├── active/                     # Currently blocking work
│   ├── complete-data-indexing.md    # Milestone 1: Bulk-first ingestion
│   ├── pattern-aware-ingestion.md   # Milestone 2: Complex traversal (COMPLETE)
│   └── synonym-quality-audit.md     # Milestone 3: Synonym quality
├── planned/                    # Future work with specs
├── planned/future/             # Post-SDK work
├── archive/completed/          # Summaries of completed work
│   └── efficient-api-traversal.md   # Superseded by bulk-first
└── reference-docs/             # Permanent reference material
```

---

## Related Documents

| Document                  | Purpose                        |
| ------------------------- | ------------------------------ |
| [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md) | **Data quality issues** |
| [bulk-download-vs-api-comparison.md](../../analysis/bulk-download-vs-api-comparison.md) | Strategic analysis |
| [transcript-availability-analysis.md](../../analysis/transcript-availability-analysis.md) | Transcript coverage findings |
| [evaluations/README.md](../../evaluations/README.md) | Evaluation framework home |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Chronological experiment history |
| [curriculum-structure-analysis.md](../../analysis/curriculum-structure-analysis.md) | 7 API patterns documented |

---

## Current State (Summary — 2025-12-30)

| Metric                  | Value            | Target   | Status               |
| ----------------------- | ---------------- | -------- | -------------------- |
| Strategic pivot         | ✅ Decided       | —        | ✅ Bulk-first        |
| Bulk download infra     | ✅ Complete      | —        | ✅ 30 files, 757 MB  |
| vocab-gen parsing       | ✅ Exists        | —        | ✅ REUSE             |
| Adapter refactoring     | ✅ Complete      | —        | ✅ 593→197 lines     |
| Pattern-aware traversal | ✅ Complete      | —        | ✅ All 7 patterns    |
| Quality gates           | ✅ Passing       | —        | ✅ All 11 green      |
| **Bulk data adapter**   | 📋 **Pending**   | ✅       | 📋 Wraps vocab-gen   |
| Lessons indexed         | 437              | ~12,300  | 📋 3% (maths KS1)    |

**Next Step**: Implement Bulk Data Adapter using TDD (wraps existing `vocab-gen`)

**See**: [current-state.md](current-state.md) for full details.

---

## Architecture

### Four-Retriever Hybrid Design (Unchanged)

```text
Query → [BM25 Content] ─┐
     → [BM25 Structure] ─┼─→ RRF Fusion → Top 10 Results
     → [ELSER Content] ──┤
     → [ELSER Structure]─┘
```

**See**: [archive/completed/four-retriever-implementation.md](archive/completed/four-retriever-implementation.md) for implementation details.

### Adapter Architecture (Unchanged)

```text
oak-adapter.ts (Public API)
    ├── sdk-client-factory.ts (Client creation)
    │       ├── sdk-api-methods.ts (API method factories)
    │       └── sdk-cache/cache-wrapper.ts (Caching with DI)
    ├── oak-adapter-threads.ts (Thread-specific methods)
    └── oak-adapter-types.ts (Type definitions)
```

**See**: [src/adapters/README.md](../../../apps/oak-open-curriculum-semantic-search/src/adapters/README.md) for details.
