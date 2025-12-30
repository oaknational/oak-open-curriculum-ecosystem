# Semantic Search Current State

**Last Updated**: 2025-12-30
**Measured Against**: Post strategic pivot to bulk-first (2025-12-30)
**Ground Truth Status**: ✅ Corrected and Verified (Maths KS4 only)

This is THE authoritative source for current system metrics.

---

## Strategic Pivot: Bulk-First Ingestion (2025-12-30)

**Decision**: Use bulk download as primary data source with API for supplementary data.

| Source | Purpose | Coverage |
|--------|---------|----------|
| **Bulk Download** | Lessons, units, threads, transcripts (81%), metadata | 16/17 subjects |
| **API** | Tier info (maths KS4), unit options (optional) | Structural data only |

**See**: [ADR-093](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | [bulk-download-vs-api-comparison.md](../../analysis/bulk-download-vs-api-comparison.md)

---

## ⚠️ Existing Infrastructure (REUSE — DO NOT RECREATE)

**Critical**: Bulk download parsing is ALREADY IMPLEMENTED in `vocab-gen`. Do not reinvent:

| Module | Location | Provides |
|--------|----------|----------|
| `parseBulkFile()` | `vocab-gen/lib/bulk-reader.ts` | Single file parsing with Zod |
| `readAllBulkFiles()` | `vocab-gen/lib/bulk-reader.ts` | Multi-file parsing |
| `lessonSchema` | `vocab-gen/lib/lesson-schema.ts` | Lesson validation |
| `unitSchema` | `vocab-gen/lib/unit-schemas.ts` | Unit validation |
| `nullSentinelSchema` | `vocab-gen/lib/vocabulary-schemas.ts` | `"NULL"` → `null` |

**Data quality issues documented**: [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md)

---

## Index Status (2025-12-30)

**🔄 STATUS: Strategic pivot decided. Bulk download parser implementation required.**

### Summary

| Metric                     | Current     | Target   | Status               |
| -------------------------- | ----------- | -------- | -------------------- |
| Lessons indexed            | 437 (maths KS1) | ~12,316  | 📋 Partial           |
| Subjects indexed           | 1/17        | 17/17    | 📋 Partial           |
| Pattern-aware traversal    | ✅          | ✅       | ✅ Implemented       |
| Adapter refactoring        | ✅          | ✅       | ✅ Complete          |
| Efficient API traversal    | ✅          | ✅       | ✅ Complete          |
| Cache categorization       | ✅          | ✅       | ✅ Complete (2025-12-30) |
| Quality gates              | ✅          | ✅       | ✅ All 11 passing    |
| ES reset                   | ✅          | ✅       | ✅ Complete (2025-12-29) |
| Cache validation           | ✅          | ✅       | ✅ Complete (756 hits, 1 miss) |

### ES Indices (Post-Reset — 2025-12-29)

| Index                | Doc Count | Status            |
| -------------------- | --------- | ----------------- |
| `oak_lessons`        | 437       | 📋 Maths KS1 only |
| `oak_units`          | TBD       | 📋 Partial        |
| `oak_unit_rollup`    | TBD       | 📋 Partial        |
| `oak_threads`        | 201       | 📋 Maths KS1 only |
| `oak_sequences`      | TBD       | 📋 Partial        |
| `oak_sequence_facets`| TBD       | 📋 Partial        |

---

## Completed Validations

### 1. Cache Categorization Enhancement — COMPLETE ✅ (2025-12-30)

Structured cache metadata for transcript availability:

| Status | Meaning |
|--------|---------|
| `available` | Transcript data exists |
| `no_video` | Lesson has no video asset |
| `not_found` | API 404 or empty response |

**Architecture**: Clean separation with zero compatibility layers:

| Metric | Before | After |
|--------|--------|-------|
| `eslint-disable.*no-deprecated` | 11 | **0** |
| Migration script | In codebase | **Standalone** |

**Files created**:

| File | Purpose |
|------|---------|
| `transcript-cache-types.ts` | Types, guards, serialization |
| `scripts/migrate-transcript-cache.ts` | Standalone migration |
| ADR-092 | Strategy documentation |

### 2. ES Reset — COMPLETE ✅ (2025-12-29)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
# Result: 7 indices created, 192 synonyms loaded
```

### 3. Cache Validation — COMPLETE ✅ (2025-12-29)

The adapter refactoring introduced a new `CacheOperations` interface. Verified:

| Check                    | How to Verify                              | Status    |
| ------------------------ | ------------------------------------------ | --------- |
| Redis connection         | Run ingestion, check for "SDK caching enabled" | ✅ Working |
| Cache reads              | Check for cache hits in verbose output     | ✅ 756 hits |
| Cache writes             | Check for cache misses followed by API calls | ✅ 1 miss |
| Negative caching (404s)  | Check "Caching 404 response" logs          | ✅ Working |
| `--bypass-cache` flag    | Should log "SDK caching disabled"          | ✅ Working |
| `--ignore-cached-404`    | Should log "Ignoring cached 404"           | ✅ Working |

### 4. ES Upsert Verification — COMPLETE ✅ (2025-12-29)

Ran Maths KS1 ingestion: 638 docs (437 lessons + 201 threads)

---

## Recent Work Completed

### Cache Categorization Enhancement — COMPLETE ✅ (2025-12-30)

| Deliverable | Status |
|-------------|--------|
| `TranscriptCacheEntry` discriminated union | ✅ |
| Type guard `isTranscriptCacheEntry` | ✅ |
| Serialize/deserialize functions | ✅ |
| Standalone migration script | ✅ |
| Cache wrapper updated | ✅ |
| Zero eslint-disable comments | ✅ |
| All 11 quality gates | ✅ |

### ~~Efficient API Traversal~~ — SUPERSEDED (2025-12-30)

> ⚠️ **SUPERSEDED by ADR-093**: The video availability detection approach has been replaced by bulk-first ingestion. The bulk download contains transcripts directly, eliminating the need for video availability detection.

**Removed files**:

| File | Status |
|------|--------|
| ~~`src/lib/indexing/video-availability.ts`~~ | **Removed** |
| ~~`src/lib/indexing/video-availability.unit.test.ts`~~ | **Removed** |

**See**: [ADR-091](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) (superseded by ADR-093)

### Adapter Refactoring — COMPLETE ✅ (2025-12-29)

Reduced `oak-adapter.ts` from **593 lines to 197 lines** using TDD:

| New File                     | Purpose                                     | Lines |
| ---------------------------- | ------------------------------------------- | ----- |
| `sdk-cache/cache-wrapper.ts` | `withCache`, `withCacheAndNegative` with DI | 248   |
| `sdk-api-methods.ts`         | API method factories                        | 143   |
| `sdk-client-factory.ts`      | Client creation helpers                     | 141   |

**Key changes**:

- Dependency injection for cache wrappers (testable without Redis)
- 22 adapter unit tests
- All functions under complexity limits
- New `src/adapters/README.md` documentation

### Quality Gates — ALL PASSING ✅

| Gate                   | Status  |
| ---------------------- | ------- |
| `pnpm type-gen`        | ✅ Pass |
| `pnpm build`           | ✅ Pass |
| `pnpm type-check`      | ✅ Pass |
| `pnpm lint:fix`        | ✅ Pass |
| `pnpm format:root`     | ✅ Pass |
| `pnpm markdownlint:root` | ✅ Pass |
| `pnpm test`            | ✅ Pass (665 tests) |
| `pnpm test:e2e`        | ✅ Pass |
| `pnpm test:e2e:built`  | ✅ Pass |
| `pnpm test:ui`         | ✅ Pass |
| `pnpm smoke:dev:stub`  | ✅ Pass |

---

## Redis Cache Status — VERIFIED ✅

**Configuration**: Local Docker Redis at `redis://localhost:6379`

| Metric                   | Value      | Status                     |
| ------------------------ | ---------- | -------------------------- |
| Lesson summaries cached  | 7,089      | ✅ Accessible              |
| Lesson transcripts cached| 4,281      | ✅ Accessible              |
| Unit summaries cached    | 669        | ✅ Accessible              |
| **Total cached**         | **12,039** | ✅ Verified working        |

**Verification result**: Dry-run showed 756 cache hits, 1 miss. New `CacheOperations` interface works correctly.

---

## Target Counts (from Bulk Download)

| Subject              | Target Unique | Notes                    |
| -------------------- | ------------- | ------------------------ |
| maths                | 1,934         | Includes KS4 tiers       |
| english              | 2,525         | Has unit options         |
| science              | 1,277         | Includes KS4 exam subjects |
| physical-education   | 992           |                          |
| geography            | 683           | Has unit options         |
| history              | 684           |                          |
| religious-education  | 612           |                          |
| computing            | 528           | ⚠️ Many may lack videos  |
| french               | 522           |                          |
| spanish              | 525           |                          |
| music                | 434           |                          |
| german               | 411           |                          |
| art                  | 403           | Has unit options         |
| design-technology    | 360           | Has unit options         |
| citizenship          | 318           |                          |
| cooking-nutrition    | 108           | No KS4                   |
| rshe-pshe            | —             | ❌ 422 (bulk unavailable) |
| **TOTAL**            | **~12,300**   | 16 subjects              |

---

## Search Metrics (Maths KS4 Vertical Slice Only)

**⚠️ These metrics are from Maths KS4 only before ES reset. Will need re-verification after ingestion.**

### Historical Performance (2025-12-24)

| Metric             | Value     | Target  | Status                   |
| ------------------ | --------- | ------- | ------------------------ |
| Lesson Hard MRR    | **0.614** | ≥0.45   | ✅ Exceeded target by 36% |
| Unit Hard Query MRR| 0.806     | ≥0.50   | ✅ Met                   |
| Lesson Std Query MRR | 0.963   | ≥0.92   | ✅ Met                   |
| Unit Std Query MRR | 0.988     | ≥0.92   | ✅ Met                   |
| Zero-hit Rate      | 0%        | 0%      | ✅ Met                   |
| p95 Latency        | ~450ms    | ≤1500ms | ✅ Met                   |

---

## Tier Status

| Tier   | Name                   | Status              | Exit Criteria                         |
| ------ | ---------------------- | ------------------- | ------------------------------------- |
| **1**  | Search Fundamentals    | ✅ **EXHAUSTED**    | MRR 0.614 ≥ 0.45, all approaches verified |
| **2**  | Document Relationships | 🔓 Ready            | MRR ≥0.55 — Can proceed               |
| **3**  | Modern ES Features     | 📋 Blocked          | MRR ≥0.60 — Waiting for Tier 2        |
| **4**  | AI Enhancement         | ⏸️ Deferred         | Only after Tiers 1-3 exhausted        |

**See**: [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## Implementation Status

| Feature                  | Status      | Notes                                 |
| ------------------------ | ----------- | ------------------------------------- |
| **Strategic pivot**      | ✅ Decided  | Bulk-first ingestion (ADR-093)        |
| **Bulk download infra**  | ✅ Complete | Script, 30 files, 757 MB (2025-12-30) |
| **vocab-gen parsing**    | ✅ Exists   | Zod schemas, file reader — REUSE      |
| Pattern-aware traversal  | ✅ Complete | All 7 patterns implemented            |
| Static pattern config    | ✅ Complete | 68 subject × keystage combinations    |
| Adapter refactoring      | ✅ Complete | 593→197 lines, TDD-driven             |
| ~~video-availability.ts~~ | ⛔ Removed  | Superseded by bulk-first (ADR-093)   |
| Cache categorization     | ✅ Complete | Structured metadata, zero compat layers |
| Quality gates            | ✅ Passing  | All 11 gates green                    |
| ES reset                 | ✅ Complete | 7 indices, 192 synonyms (2025-12-29)  |
| Cache validation         | ✅ Complete | 756 hits, 1 miss (2025-12-29)         |
| ES upsert verified       | ✅ Complete | 638 docs (maths KS1)                  |
| Incremental ingestion    | ✅ Verified | `create` action by default            |
| Force mode               | ✅ Verified | `--force` flag for overwrite          |
| Four-retriever hybrid    | ✅ Complete | BM25 + ELSER with RRF fusion          |
| Synonyms (192 entries)   | ✅ Deployed | Loaded at ES reset                    |
| **Bulk data adapter**    | 📋 Pending  | Wraps vocab-gen, transforms to ES docs |
| **Hybrid data source**   | 📋 Pending  | Composes bulk + API                   |
| Full ingestion           | 📋 Pending  | Blocked on adapter                    |

---

## Ground Truth Status

| Ground Truth      | Queries  | Status                    |
| ----------------- | -------- | ------------------------- |
| Lesson standard   | 40       | ✅ All exist (Maths KS4)  |
| Lesson hard       | 15       | ✅ Corrected (Maths KS4)  |
| Lesson diagnostic | 18       | ✅ Corrected (Maths KS4)  |
| Unit standard     | Multiple | ✅ All exist              |
| Unit hard         | Multiple | ✅ All exist              |
| Sequence standard | 24       | ✅ Created                |
| Sequence hard     | 17       | ✅ Created                |

**Note**: Ground truths only cover Maths KS4. Expansion to other subjects blocked on complete ingestion.

---

## Bulk Download Reference

**Active Source**: `apps/oak-open-curriculum-semantic-search/bulk-downloads/` (2025-12-30)
**Reference Copy**: `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/`

| Metric         | Value  |
| -------------- | ------ |
| Files          | 30     |
| Raw lessons    | ~12,500 |
| Unique lessons | ~12,300 |
| Duplicates     | ~200 (tiers) |

**Missing from bulk**: RSHE-PSHE (returns 422 Unprocessable Content — no API fallback)

**Refresh command**: `cd apps/oak-open-curriculum-semantic-search && pnpm bulk:download`

---

## Related Documents

- **[roadmap.md](roadmap.md)** — Linear execution path
- **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological history
- **[ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)** — 63 slug corrections
- **[curriculum-structure-analysis.md](../../analysis/curriculum-structure-analysis.md)** — 7 API patterns documented
- **[archive/completed/](archive/completed/)** — Completed work summaries
