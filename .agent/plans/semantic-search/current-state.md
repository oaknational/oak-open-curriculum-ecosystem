# Semantic Search Current State

**Last Updated**: 2025-12-31
**Status**: 🚨 BLOCKED — Critical issues discovered during bulk ingestion evaluation
**Measured Against**: Failed bulk ingestion run (2025-12-31)
**Ground Truth Status**: ✅ Corrected and Verified (Maths KS4 only)
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative source for current system metrics.

---

## 🚨 CRITICAL: Bulk Ingestion Failed (2025-12-31)

**A live bulk ingestion run revealed fundamental implementation failures.**

See [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) for:
- Master list of 15 unverified assumptions
- 5 mandatory remediation actions
- Root cause analysis

### Issues Discovered

| Issue | Severity | Impact |
|-------|----------|--------|
| **`oak_unit_rollup` empty** | 🔴 CRITICAL | Unit search 100% zero-hit |
| **Missing `lesson_structure` fields** | 🔴 CRITICAL | ELSER structure 100% zero-hit |
| **Only 2,884/12,833 lessons indexed** | 🔴 CRITICAL | ~78% of curriculum missing |
| **14/16 subjects indexed** | 🟡 HIGH | PE, Spanish missing entirely |

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

## Index Status (2025-12-31)

**🚨 STATUS: Bulk ingestion FAILED — Critical issues require investigation.**

### Summary

| Metric                     | Current     | Target   | Status               |
| -------------------------- | ----------- | -------- | -------------------- |
| Lessons indexed            | **2,884**   | ~12,833  | 🚨 **22% — 78% MISSING** |
| Subjects indexed           | **14/16**   | 16/16    | 🚨 **PE, Spanish missing** |
| SDK bulk export            | ✅          | ✅       | ✅ Complete (Phase 0) |
| BulkDataAdapter            | ⚠️          | ✅       | ⚠️ **Missing structure fields** |
| API supplementation        | ✅          | ✅       | ✅ Complete (Phase 2) |
| HybridDataSource           | ✅          | ✅       | ✅ Complete (Phase 3) |
| VocabularyMiningAdapter    | ✅          | ✅       | ✅ Complete (Phase 4) |
| Bulk thread transformer    | ✅          | ✅       | ✅ Complete (Phase 5a) |
| CLI wiring (`--bulk` mode) | ✅          | ✅       | ✅ Complete (Phase 5b) |
| Full ingestion run         | 🚨          | ✅       | 🚨 **FAILED** (Phase 5c) |
| Quality gates              | ✅          | ✅       | ✅ All 11 passing |

### ES Indices (After Failed Bulk Ingestion — 2025-12-31)

| Index                | Doc Count | Expected | Status            |
| -------------------- | --------- | -------- | ----------------- |
| `oak_lessons`        | **2,884** | ~12,833  | 🚨 **22% — 78% MISSING** |
| `oak_units`          | 1,635     | ~1,665   | ✅ Complete |
| `oak_unit_rollup`    | **0**     | ~1,665   | 🚨 **EMPTY — unit search broken** |
| `oak_threads`        | 164       | 164      | ✅ Complete |
| `oak_sequences`      | 0         | —        | 📋 Not in scope |
| `oak_sequence_facets`| 0         | —        | 📋 Not in scope |

### Retriever Status (from ablation test)

| Retriever | Lessons Standard | Lessons Hard | Units |
|-----------|-----------------|--------------|-------|
| `bm25_content` | 0.456 ✅ | 0.217 | 0.000 ❌ |
| `elser_content` | 0.393 ✅ | 0.172 | 0.000 ❌ |
| `bm25_structure` | 0.440 ⚠️ | 0.067 ⚠️ | 0.000 ❌ |
| `elser_structure` | **0.000** ❌ | **0.000** ❌ | 0.000 ❌ |
| `four_way_hybrid` | 0.458 ✅ | 0.221 | 0.000 ❌ |

### Subjects Indexed (Lessons)

| Subject | Doc Count | Expected | Status |
|---------|-----------|----------|--------|
| history | 433 | ? | 📋 Needs verification |
| art | 403 | ? | 📋 Needs verification |
| english | 399 | ? | 📋 Needs verification |
| religious-education | 332 | ? | 📋 Needs verification |
| design-technology | 304 | ? | 📋 Needs verification |
| maths | 216 | ? | 📋 Needs verification |
| computing | 199 | ? | 📋 Needs verification |
| french | 168 | ? | 📋 Needs verification |
| geography | 136 | ? | 📋 Needs verification |
| science | 81 | ? | 📋 Needs verification |
| german | 67 | ? | 📋 Needs verification |
| citizenship | 65 | ? | 📋 Needs verification |
| music | 57 | ? | 📋 Needs verification |
| cooking-nutrition | 24 | ? | 📋 Needs verification |
| **physical-education** | **0** | ? | 🚨 **MISSING** |
| **spanish** | **0** | ? | 🚨 **MISSING** |

---

## Completed Work (2025-12-31)

### Bulk-First Ingestion Pipeline — EVALUATION REVEALED FAILURES

| Phase | Description | Status |
|-------|-------------|--------|
| **0** | SDK bulk export with generated schemas | ✅ Complete |
| **1** | BulkDataAdapter (Lesson/Unit transforms) | ⚠️ **INCOMPLETE** — missing structure fields |
| **2** | API supplementation (Maths KS4 tiers) | ✅ Complete |
| **3** | HybridDataSource (bulk + API composition) | ✅ Complete |
| **4** | VocabularyMiningAdapter (extractors + synonyms) | ✅ Complete |
| **5a** | Bulk thread transformer | ✅ Complete |
| **5b** | CLI wiring | ✅ Complete |
| **5c** | Full ingestion | 🚨 **FAILED** |

**Key files created**:

| File | Purpose |
|------|---------|
| `src/adapters/bulk-data-adapter.ts` | Transforms bulk → ES docs |
| `src/adapters/bulk-lesson-transformer.ts` | Lesson → ES doc transformation |
| `src/adapters/bulk-unit-transformer.ts` | Unit → ES doc transformation |
| `src/adapters/bulk-transform-helpers.ts` | URL generation, phase derivation |
| `src/adapters/bulk-thread-transformer.ts` | Thread extraction and ES doc transformation |
| `src/adapters/api-supplementation.ts` | KS4 tier enrichment |
| `src/adapters/hybrid-data-source.ts` | Unified data source |
| `src/adapters/hybrid-batch-processor.ts` | Batch KS4 enrichment |
| `src/adapters/vocabulary-mining-adapter.ts` | Vocabulary extraction |
| `src/lib/indexing/bulk-ingestion.ts` | Pipeline entry point |
| `src/lib/elasticsearch/setup/ingest-cli-args.ts` | CLI args with `--bulk` mode |

**SDK changes**:

| Change | Purpose |
|--------|---------|
| `type-gen/typegen/bulk/` | Generated bulk Zod schemas |
| `src/bulk/extractors/` | 15 extractors (8 new) |
| `src/bulk/generators/` | Synonym miner, graph generators |
| `public/bulk` export | Public SDK entry point |

**Completed (Phase 5a)**:

- `src/adapters/bulk-thread-transformer.ts` — Extracts threads, deduplicates, builds ES docs
- `src/adapters/bulk-thread-transformer.unit.test.ts` — 9 unit tests
- `src/lib/indexing/bulk-ingestion.ts` — Updated to include thread operations

**Completed (Phase 5b)**:

- `src/lib/elasticsearch/setup/ingest-cli-args.ts` — Added `--bulk` and `--bulk-dir` options
- `src/lib/elasticsearch/setup/ingest-live.ts` — Bulk mode execution path
- `src/lib/elasticsearch/setup/ingest-bulk.ts` — Bulk ingestion orchestration
- `src/lib/elasticsearch/setup/ingest-output.ts` — Output formatting

**FAILED (Phase 5c)**:

Full ingestion run completed but with critical failures:
- Only 2,884/12,833 lessons indexed (~22%)
- `oak_unit_rollup` empty (0 docs)
- `lesson_structure` fields missing (set to `undefined` in transformer)
- Physical Education and Spanish subjects missing entirely

**Mandatory remediation actions before further development:**

| Action | Status | Specification |
|--------|--------|---------------|
| 1. Define parity requirements | ✅ COMPLETE | [bulk-api-parity-requirements.md](active/bulk-api-parity-requirements.md) |
| 2. Deep code review | ✅ COMPLETE | [bulk-code-review.md](active/bulk-code-review.md) |
| 3. Investigate lesson count | 📋 **NEXT** | See hypotheses in code review |
| 4. Deep transcript survey | 📋 Pending | Blocked on Action 3 |
| 5. RSHE-PSHE 422 handling | 📋 Pending | Blocked on Action 3 |

See [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) for full details and investigation plan.

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
| `pnpm test`            | ✅ Pass (734 tests) |
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
| **Bulk data adapter**    | ⚠️ **INCOMPLETE** | Missing `lesson_structure` fields |
| **Hybrid data source**   | ✅ Complete | Composes bulk + API                   |
| **Vocabulary mining**    | ✅ Complete | Extractors + synonym mining           |
| **Bulk thread transformer** | ✅ Complete | Extracts from `sequence[].threads[]` |
| **CLI wiring**           | ✅ Complete | `--bulk` and `--bulk-dir` options     |
| **Full ingestion**       | 🚨 **FAILED** | 2,884/12,833 lessons, unit_rollup empty |
| **RSHE-PSHE 422**        | 📋 Pending | Not yet implemented in search SDK     |

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
| Duplicates     | 373 (maths KS4) |

**Missing from bulk**: RSHE-PSHE (returns 422 Unprocessable Content — no API fallback)

**Refresh command**: `cd apps/oak-open-curriculum-semantic-search && pnpm bulk:download`

### Maths KS4 Duplicate Analysis (2025-12-30)

**373 duplicate lessons break down as**:

| Category | Count | Explanation |
|----------|-------|-------------|
| Legitimate | 210 | Shared between BOTH tier variants |
| Spurious | 163 | Data quality issue — incorrectly duplicated |

**Solution**: Simple deduplication by `lessonSlug`, apply tiers from API unit→tier map.

### Maths KS4 Tier Coverage (2025-12-30)

**Investigation confirmed 100% tier coverage from API**:

| Metric | Value |
|--------|-------|
| Unique KS4 units in bulk | 36 |
| Units with tier info from API | 36 ✅ |
| Unique KS4 lessons in bulk | 436 |
| Lessons with tier derivable | 436 ✅ |

**Tier distribution**:
- 30 units in BOTH tiers → lessons get `tiers: ['foundation', 'higher']`
- 6 units HIGHER only → lessons get `tiers: ['higher']`
- 0 units foundation only

---

## Related Documents

- **[roadmap.md](roadmap.md)** — Linear execution path
- **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological history
- **[ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)** — 63 slug corrections
- **[curriculum-structure-analysis.md](../../analysis/curriculum-structure-analysis.md)** — 7 API patterns documented
- **[archive/completed/](archive/completed/)** — Completed work summaries
