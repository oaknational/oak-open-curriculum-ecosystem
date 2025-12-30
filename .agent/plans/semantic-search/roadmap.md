# Semantic Search Roadmap

**Status**: 🔄 Strategic pivot to bulk-first ingestion
**Last Updated**: 2025-12-30
**Metrics Source**: [current-state.md](current-state.md)

This is THE authoritative roadmap for semantic search work. All other plan documents reference this file.

---

## 🔄 Current Status

### Strategic Pivot: Bulk-First Ingestion (2025-12-30)

**Decision**: Use bulk download as primary data source with API for supplementary data.

| Source | Purpose |
|--------|---------|
| **Bulk Download** | Lesson enumeration, transcripts (81%), metadata — all 17 subjects |
| **API** | Tier info (maths KS4), unit options (geography/english) |

**Key findings from comparison** ([bulk-download-vs-api-comparison.md](../../analysis/bulk-download-vs-api-comparison.md)):

- Bulk has transcripts for 81% of lessons (API only ~16%)
- Bulk has NO tier information (373 maths lessons duplicated with no discriminator)
- Bulk has NO unit options (geography/english alternative units)
- RSHE-PSHE bulk file unavailable → returns 422 Unprocessable Content (no API fallback)
- Video availability detection code removed (`video-availability.ts` deleted)

**Architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│  BulkDownloadSource (NEW)              OakClient (EXISTING)      │
│  ├── parseSequence(file)               ├── getSequenceUnits()    │
│  ├── getLessons()                      └── (tier/unit options)   │
│  └── getUnits()                                                  │
│                              ↓                                   │
│              ┌─────────────────────────────────────┐             │
│              │      HybridDataSource (NEW)         │             │
│              │  Composes bulk + API as needed      │             │
│              └─────────────────────────────────────┘             │
│                              ↓                                   │
│              ┌─────────────────────────────────────┐             │
│              │    Existing Pipeline (UNCHANGED)    │             │
│              │    index-oak.ts → ES Indexer        │             │
│              └─────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

**Next steps**:

1. ✅ **Remove `video-availability.ts`** — Complete (2025-12-30)
2. ✅ **Bulk download infrastructure** — Complete (2025-12-30) — 30 files, 757 MB
3. 📋 **Implement Bulk Data Adapter** (TDD) — **NEXT STEP**
   - Wraps existing `vocab-gen` bulk reader
   - Transforms to ES document format
   - DO NOT reinvent parsing — use `@oaknational/oak-curriculum-sdk/vocab-gen`
4. 📋 **Create HybridDataSource** composing bulk + API
5. 📋 **Update pipeline** to use HybridDataSource

**Existing infrastructure to reuse (DO NOT RECREATE)**:

| Module | Location | Purpose |
|--------|----------|---------|
| `parseBulkFile()` | `vocab-gen/lib/bulk-reader.ts` | Parse single file |
| `readAllBulkFiles()` | `vocab-gen/lib/bulk-reader.ts` | Parse all files |
| `lessonSchema` | `vocab-gen/lib/lesson-schema.ts` | Zod validation |
| `unitSchema` | `vocab-gen/lib/unit-schemas.ts` | Zod validation |
| `nullSentinelSchema` | `vocab-gen/lib/vocabulary-schemas.ts` | `"NULL"` → `null` |

### Cache Categorization Enhancement — Complete (2025-12-30)

| Metric | Before | After |
|--------|--------|-------|
| `eslint-disable.*no-deprecated` | 11 | **0** |
| Migration script | In codebase | **Standalone** |
| Structured cache metadata | — | `available`, `no_video`, `not_found` |

### Adapter Refactoring — Complete (2025-12-29)

| Metric             | Before    | After       |
| ------------------ | --------- | ----------- |
| `oak-adapter.ts`   | 593 lines | 197 lines   |
| Lint errors        | 70        | 0           |
| New test coverage  | —         | 22 tests    |

### ~~Efficient API Traversal~~ — SUPERSEDED (2025-12-30)

> ⚠️ **SUPERSEDED by ADR-093**: The video availability detection approach has been replaced by bulk-first ingestion. The bulk download contains transcripts directly, eliminating the need for video availability detection. `video-availability.ts` has been removed.

**See**: [ADR-091](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) (superseded by ADR-093)
**See**: [archive/completed/efficient-api-traversal.md](archive/completed/efficient-api-traversal.md)

### Validations Complete (2025-12-29/30)

| Task             | Why Needed                                      | Status    |
| ---------------- | ----------------------------------------------- | --------- |
| Quality gates    | Verify implementation works                     | ✅ Complete |
| ES reset         | Fresh indices for clean ingestion               | ✅ Complete |
| Cache validation | Verify new `CacheOperations` interface works    | ✅ Complete (756 hits, 1 miss) |
| ES upsert verify | Confirm incremental mode still works            | ✅ Complete (638 docs ingested) |
| Cache categorization | Observability for transcript unavailability | ✅ Complete |

### Next Steps

1. ✅ **Run quality gates**: All 11 gates passed
2. ✅ **Reset ES**: `pnpm es:setup --reset` — 7 indices, 192 synonyms
3. ✅ **Verify caching**: Dry-run passed, cache hits working
4. ✅ **Verify writes**: Maths KS1 ingested (437 docs + 201 threads)
5. ✅ **Cache categorization**: Structured metadata implemented
6. 📋 **Full ingestion**: `pnpm es:ingest-live --all --verbose`

---

## ⚠️ Measurement Discipline

**Every search change must be measured.**

Before implementing any milestone that affects search (synonyms, indices, retrievers, ES features):

1. **Baseline**: Record current metrics using ground truth queries
2. **Hypothesis**: Document expected impact in experiment file
3. **Implement**: Make the change
4. **Measure**: Run evaluation against same ground truth
5. **Record**: Update [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) with results
6. **Decide**: Accept/reject based on evidence

**Framework**: [ADR-081: Search Approach Evaluation Framework](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)
**Ground Truths**: [.agent/evaluations/](../../evaluations/README.md)

---

## Current State (Snapshot — 2025-12-30)

| Metric                  | Value            | Status                  |
| ----------------------- | ---------------- | ----------------------- |
| Tier 1                  | EXHAUSTED        | ✅ All approaches verified (2025-12-24) |
| Pattern-aware traversal | COMPLETE         | ✅ All 7 patterns implemented |
| Adapter refactoring     | COMPLETE         | ✅ 593→197 lines, TDD-driven |
| Cache categorization    | COMPLETE         | ✅ Zero compatibility layers |
| Quality gates           | PASSING          | ✅ All 11 gates green   |
| ES reset                | COMPLETE         | ✅ 7 indices, 192 synonyms |
| Cache validation        | COMPLETE         | ✅ 756 hits, 1 miss      |
| Redis cache             | 12,039 entries   | ✅ Verified accessible   |

---

## Blocking Work (Do These First)

### 🔄 Milestone 1: Complete ES Ingestion (Bulk-First)

**Status**: 📋 BLOCKED — Bulk data adapter implementation required
**Dependencies**: Pattern-aware traversal (COMPLETE), adapter refactoring (COMPLETE), **bulk data adapter (PENDING)**
**Specification**: [active/complete-data-indexing.md](active/complete-data-indexing.md)
**Data Quality**: [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md)

**Strategic Pivot**: This milestone has been updated to use **bulk-first ingestion** per [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md).

**Implementation phases**:

1. 📋 **Phase 1: Bulk Data Adapter** (TDD)
   - Wraps existing `vocab-gen` bulk reader (DO NOT recreate parsing)
   - Transforms `Lesson` → `SearchLessonsIndexDoc`
   - Transforms `Unit` → `SearchUnitsIndexDoc`
   - Extracts threads from `sequence[].threads[]`
   - Unit tests with fixtures (not 757MB real data)

2. 📋 **Phase 2: API Supplementation**
   - Maths KS4 tier info from API
   - Unit options deferred (not critical for search)
   - RSHE-PSHE: skip in ingestion, 422 in API

3. 📋 **Phase 3: HybridDataSource**
   - Compose bulk + API
   - Deduplication logic per subject type

4. 📋 **Phase 4: Pipeline Integration**
   - Update `index-oak.ts` to use HybridDataSource
   - Full ingestion run

**Existing infrastructure** (REUSE — DO NOT RECREATE):

- ✅ `vocab-gen` bulk parsing (Zod schemas, file reader)
- ✅ Pattern-aware traversal (for API calls)
- ✅ Adapter refactoring complete
- ✅ ES indices reset (7 indices, 192 synonyms)
- ✅ Cache categorization (for API responses)
- ✅ Quality gates passing

**Expected**: ~12,300 unique lessons across 16 subjects (RSHE-PSHE returns 422).

**Acceptance Criteria**:

- [x] ES indices reset with current mappings
- [x] Cache categorization providing observability
- [x] `video-availability.ts` removed (superseded by bulk-first)
- [x] Bulk download infrastructure complete (30 files, 757 MB)
- [ ] BulkDownloadSource implemented with unit tests
- [ ] HybridDataSource composing bulk + API
- [ ] All 16 supported subjects ingested
- [ ] RSHE-PSHE returns 422 with proper error message
- [ ] Counts verified against bulk download reference
- [ ] Quality gates passing after ingestion

---

## ✅ Completed Work

### Cache Categorization Enhancement — COMPLETE (2025-12-30)

**Status**: ✅ COMPLETE
**Specification**: See ADR-092

Structured cache metadata to distinguish transcript unavailability reasons:

| Status | Meaning |
|--------|---------|
| `available` | Transcript data exists |
| `no_video` | Lesson has no video asset |
| `not_found` | API 404 or empty response |

**Clean architecture**:

- Zero eslint-disable comments
- Migration script is standalone (no codebase imports)
- No backwards compatibility layer

### Milestone 2: Pattern-Aware Ingestion — COMPLETE

**Status**: ✅ COMPLETE (2025-12-29)
**Specification**: [active/pattern-aware-ingestion.md](active/pattern-aware-ingestion.md)

All 7 curriculum structural patterns now handled:

| Pattern               | Implementation        |
| --------------------- | --------------------- |
| `simple-flat`         | ✅ All KS1-KS3, some KS4 |
| `tier-variants`       | ✅ Maths KS4          |
| `exam-subject-split`  | ✅ Science KS4        |
| `exam-board-variants` | ✅ 12 subjects KS4    |
| `unit-options`        | ✅ 6 subjects KS4     |
| `no-ks4`              | ✅ Cooking-nutrition  |
| `empty`               | ✅ Edge cases         |

### Adapter Refactoring — COMPLETE

**Status**: ✅ COMPLETE (2025-12-29)

| Before                       | After                       |
| ---------------------------- | --------------------------- |
| `oak-adapter.ts` (593 lines) | `oak-adapter.ts` (197 lines)|
| 70 lint errors               | 0 lint errors               |
| Quality gates blocked        | All 11 passing              |

**New files created**:

| File                         | Purpose                                |
| ---------------------------- | -------------------------------------- |
| `sdk-cache/cache-wrapper.ts` | Cache wrappers with dependency injection |
| `sdk-cache/transcript-cache-types.ts` | Structured cache entry types |
| `sdk-api-methods.ts`         | API method factories                   |
| `sdk-client-factory.ts`      | Client creation helpers                |
| `src/adapters/README.md`     | Architecture documentation             |

---

## Linear Path to Success

### Evaluation Requirements for Each Milestone

Each milestone that affects search quality **must** include:

1. **Ground truth coverage**: Queries that test the feature
2. **Before metrics**: Baseline measurement before implementation
3. **After metrics**: Measurement after implementation
4. **Decision**: Accept if improvement, reject if regression
5. **Recording**: Results in [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)

### Milestone 3: Synonym Quality Audit

**Status**: 📋 Pending (blocked on Milestone 1)
**Dependencies**: Milestone 1 (needs all subjects indexed)
**Specification**: [active/synonym-quality-audit.md](active/synonym-quality-audit.md)

**User Impact**: Search works correctly for foundational vocabulary (adjective, noun, suffix, etc.).

| Current Coverage      | Issue                          |
| --------------------- | ------------------------------ |
| 163 curated synonyms  | Target GCSE-level compound terms |
| Top 100 curriculum terms | **0% synonym coverage**     |

---

### Milestone 4: Transcript Mining

**Status**: 📋 Pending
**Dependencies**: Milestones 1, 3
**Specification**: [planned/transcript-mining.md](planned/transcript-mining.md)

**User Impact**: +15-25 foundational synonyms in teacher language; +5-10% colloquial query MRR.

---

### Milestone 5: Thread-Based Search

**Status**: 📋 Pending
**Dependencies**: Milestones 1, 2
**Specification**: [planned/thread-based-search.md](planned/thread-based-search.md)

**User Impact**: "What comes before X?", "What should I teach next?" queries work.

| Data Point             | Count                    |
| ---------------------- | ------------------------ |
| Threads                | 164 across 14 subjects   |
| Thread → Unit mappings | ~1,600 units             |

---

### Milestone 6: Reference Indices

**Status**: 📋 Pending
**Dependencies**: Milestone 1
**Specification**: [planned/reference-indices.md](planned/reference-indices.md)

**User Impact**: "What subjects are available?", "What key stages for maths?" queries work.

---

### Milestone 7: Resource Types

**Status**: 📋 Pending
**Dependencies**: Milestone 1
**Specification**: [planned/resource-types.md](planned/resource-types.md)

**User Impact**: Search for worksheets, quizzes, and other resource types.

---

### Milestone 8: Vocabulary Mining (Bulk)

**Status**: 📋 Pending
**Dependencies**: Milestones 1, 3, 4
**Specification**: [planned/vocabulary-mining-bulk.md](planned/vocabulary-mining-bulk.md)

**User Impact**: Searchable glossary with 13K+ terms; enhanced synonym coverage.

---

### Milestone 9: MCP Graph Tools

**Status**: 📋 Pending
**Dependencies**: Milestone 8
**Specification**: [planned/mcp-graph-tools.md](planned/mcp-graph-tools.md)

**User Impact**: AI agents can answer "What's the learning path to trigonometry?"

---

### Milestone 10: Knowledge Graph Evolution

**Status**: 📋 Pending
**Dependencies**: Milestones 8, 9
**Specification**: [planned/knowledge-graph-evolution.md](planned/knowledge-graph-evolution.md)

**User Impact**: True knowledge graph queries connecting concepts across curriculum.

---

### Milestone 11: Search SDK + CLI Extraction

**Status**: 📋 Pending
**Dependencies**: All above
**Specification**: [planned/search-sdk-cli.md](planned/search-sdk-cli.md)

**User Impact**: Search functionality available as SDK for MCP and other consumers.

---

## Future (Post-SDK)

These are post-SDK work items that depend on upstream API changes or advanced features.

| Item               | Specification                                     | Blocker      |
| ------------------ | ------------------------------------------------- | ------------ |
| Entity Extraction  | [planned/future/entity-extraction.md](planned/future/entity-extraction.md) | SDK complete |
| Advanced Features  | [planned/future/advanced-features.md](planned/future/advanced-features.md) | SDK complete |

---

## Tier Progression

Per [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

| Tier   | Name                   | Status              | Exit Criteria                         |
| ------ | ---------------------- | ------------------- | ------------------------------------- |
| **1**  | Search Fundamentals    | ✅ EXHAUSTED (2025-12-24) | MRR ≥0.45, all approaches verified |
| **2**  | Document Relationships | 🔓 Ready            | MRR ≥0.55                             |
| **3**  | Modern ES Features     | 📋 Blocked          | MRR ≥0.60                             |
| **4**  | AI Enhancement         | ⏸️ Deferred         | Only after Tiers 1-3 exhausted        |

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen          # Generate types from schema
pnpm build             # Build all packages
pnpm type-check        # TypeScript validation
pnpm lint:fix          # Auto-fix linting issues
pnpm format:root       # Format code
pnpm markdownlint:root # Markdown lint
pnpm test              # Unit + integration tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built app
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

**All gates must pass. No exceptions.**

---

## Related Documents

| Document                  | Purpose                        |
| ------------------------- | ------------------------------ |
| [current-state.md](current-state.md) | Authoritative metrics source |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Definition of done |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first strategy |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground truth validation |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Batch-atomic ingestion |
| [ADR-091](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) | ~~Video availability~~ (superseded) |
| [ADR-092](../../../docs/architecture/architectural-decisions/092-transcript-cache-categorization.md) | Transcript cache categorization |
| [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | **Bulk-first ingestion** |

---

## Foundation Documents (MANDATORY)

Before any work, re-read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question: "Could it be simpler?"
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at all levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
