# Semantic Search — Session Context

**Status**: ✅ BULK FIXES IMPLEMENTED — Ready for re-ingestion and verification
**Last Updated**: 2025-12-31
**Master Plan**: [Semantic Search Roadmap](../../plans/semantic-search/roadmap.md)
**Implementation Plan**: [bulk-ingestion-fixes.md](../../plans/semantic-search/active/bulk-ingestion-fixes.md) (COMPLETE)
**Data Quality Report**: [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md)
**ADR**: [ADR-093: Bulk-First Ingestion Strategy](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)

---

## 🎯 IMMEDIATE NEXT ACTION

**Run bulk ingestion and verify the fixes work.**

```bash
cd apps/oak-open-curriculum-semantic-search

# Preview first (dry run)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --dry-run

# Full ingestion (when ready)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads
```

**After ingestion, verify:**

```bash
# Check index counts
pnpm es:status

# Run diagnostic queries
pnpm eval:diagnostic

# Run retriever ablation
pnpm vitest run --config vitest.smoke.config.ts four-retriever-ablation
```

**Expected results after fixes:**

| Index | Expected Count | Previous (Broken) |
|-------|----------------|-------------------|
| `oak_lessons` | ~12,320 | 2,884 |
| `oak_units` | ~1,665 | 1,635 |
| `oak_unit_rollup` | ~1,665 | **0** (empty!) |
| `oak_threads` | ~164 | 164 |

**Retriever expectations:**

- `elser_structure` should now produce hits (was 0.000)
- Unit search should work (was 100% zero-hit)
- All 16 subjects should be indexed (was 14)

---

## ✅ FIXES IMPLEMENTED (2025-12-31)

Three critical fixes were implemented via TDD:

### Fix 1: Transcript NULL Handling ✅

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/bulk/bulk-schemas.ts`

**Problem**: Bulk data contains literal "NULL" strings for missing transcripts. The schema used `z.string().optional()` which passed "NULL" through as a valid string.

**Fix**: Changed to `nullSentinelSchema.optional()` which transforms "NULL" → `null` at parse time.

**Files changed**:

- `packages/sdks/oak-curriculum-sdk/src/types/generated/bulk/bulk-schemas.ts`
- `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/bulk-schemas.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/bulk/schema-templates-part2.ts`

### Fix 2: Semantic Summary Generation ✅

**Location**: `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-lesson-transformer.ts`

**Problem**: `lesson_structure` and `lesson_structure_semantic` were explicitly set to `undefined`, causing ELSER structure retriever to return 0.000.

**Fix**: Generate semantic summaries from bulk lesson's pedagogical fields (title, key stage, subject, unit, keywords, learning points, misconceptions, tips, guidance, outcome).

**Files changed**:

- `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-lesson-transformer.ts`
- `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-lesson-transformer.unit.test.ts` (NEW)

### Fix 3: Rollup Document Creation ✅

**Location**: `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-rollup-builder.ts`

**Problem**: `oak_unit_rollup` index was completely empty — rollup documents were never created in the bulk path.

**Fix**: Created `bulk-rollup-builder.ts` module that:

- Transforms bulk units to `SearchUnitSummary`
- Collects lesson transcript snippets per unit
- Generates rollup documents via `createRollupDocument`
- Integrated into `HybridDataSource.toBulkOperations()`

**Files changed**:

- `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-rollup-builder.ts` (NEW)
- `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-rollup-builder.unit.test.ts` (NEW)
- `apps/oak-open-curriculum-semantic-search/src/adapters/hybrid-data-source.ts`
- `apps/oak-open-curriculum-semantic-search/src/adapters/hybrid-data-source.unit.test.ts`
- `apps/oak-open-curriculum-semantic-search/src/adapters/hybrid-batch-processor.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/bulk-ingestion.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/ks4-context-builder.ts`

### Additional Refactoring

**`ingest-harness-ops.ts` exceeded max-lines lint rule (272 > 250)**

**Fix**: Extracted chunking and upload logic to `bulk-chunk-uploader.ts`.

**Files changed**:

- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/bulk-chunk-uploader.ts` (NEW)
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/ingest-harness-ops.ts`

---

## 📋 REMAINING WORK

After verifying the fixes work:

| Action | Status | Description |
|--------|--------|-------------|
| Re-run bulk ingestion | 📋 **NEXT** | Verify all fixes work together |
| Verify retriever performance | 📋 Pending | Run ablation tests |
| RSHE-PSHE 422 handling | 📋 Pending | Implement explicit 422 in search SDK |
| Parity test (bulk vs API) | 📋 Pending | Ensure both paths produce identical output |

---

## 📚 HISTORICAL CONTEXT (2025-12-31)

### Issues That Were Discovered

| Issue | Severity | Status |
|-------|----------|--------|
| `oak_unit_rollup` empty | 🔴 CRITICAL | ✅ **FIXED** — rollup builder implemented |
| Missing `lesson_structure` fields | 🔴 CRITICAL | ✅ **FIXED** — semantic summary generated |
| Only 2,884/12,833 lessons indexed | 🔴 CRITICAL | 🔄 **INVESTIGATING** — may be fixed now |
| 14/16 subjects indexed | 🟡 HIGH | 🔄 **INVESTIGATING** — may be fixed now |

### Retriever Status (BEFORE fixes)

| Retriever | Lessons Standard | Lessons Hard | Units |
|-----------|-----------------|--------------|-------|
| `bm25_content` | 0.456 ✅ | 0.217 | 0.000 ❌ |
| `elser_content` | 0.393 ✅ | 0.172 | 0.000 ❌ |
| `bm25_structure` | 0.440 ⚠️ | 0.067 ⚠️ | 0.000 ❌ |
| `elser_structure` | **0.000** ❌ | **0.000** ❌ | 0.000 ❌ |
| `four_way_hybrid` | 0.458 ✅ | 0.221 | 0.000 ❌ |

### Investigation Findings

See [08-bulk-ingestion-investigation-2025-12-31.md](../../research/ooc/08-bulk-ingestion-investigation-2025-12-31.md) for full details.

**Key findings**:

- Bulk download contains 12,833 raw lessons (12,320 unique after dedup)
- 14 subjects have 95-100% transcript coverage
- MFL subjects (French, German, Spanish) have ~0% transcripts (literal "NULL" strings)
- PE has partial coverage (primary 0.6%, secondary 28.5%)
- RSHE-PSHE is intentionally not in bulk data (documented in ADR-093)
- Maths duplicates (373) are identical content — safe to dedupe

---

## 🔧 KEY COMMANDS

```bash
# From apps/oak-open-curriculum-semantic-search

# Refresh bulk download data
pnpm bulk:download

# Bulk ingestion
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --dry-run  # Preview
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads            # Full run

# Evaluation
pnpm eval:diagnostic                                               # 18 diagnostic queries
pnpm eval:per-category                                             # Hard query baseline
pnpm vitest run --config vitest.smoke.config.ts four-retriever-ablation

# ES status check
pnpm es:status

# Quality gates (from repo root)
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
```

---

## 📖 FOUNDATION DOCUMENTS (MANDATORY)

Before any work, read:

1. **[rules.md](../../directives-and-memory/rules.md)** — First Question: "Could it be simpler?"
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth
4. **[ADR-088: Result Pattern](../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md)** — No try/catch, use Result pattern
5. **[ADR-051: OpenTelemetry Logging](../../../docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md)** — `logger.info` for critical, `logger.debug` for exhaustive

---

## ✅ ASSUMPTIONS — VERIFIED (2025-12-31)

**Investigation complete.** See [08-bulk-ingestion-investigation-2025-12-31.md](../../research/ooc/08-bulk-ingestion-investigation-2025-12-31.md) for full details.

| ID | Assumption | Status | Verified Finding |
|----|------------|--------|------------------|
| A1 | Bulk download contains ~12,833 lessons | ✅ **VERIFIED** | 12,833 raw, 12,320 unique after per-file dedup |
| A2 | `oak_unit_rollup` requires enriched documents | ✅ **VERIFIED** | Requires lesson snippets + semantic summary |
| A4 | MFL subjects have ~0% transcripts | ✅ **VERIFIED** | French 0-0.2%, German 0.2%, Spanish 0-0.8% |
| A5 | RSHE-PSHE absence is intentional | ✅ **DOCUMENTED** | Oak bulk API doesn't return it; return 422 |
| A6 | MFL has "no video" | ✅ **VERIFIED** | Transcripts are literal "NULL" string |
| A7 | Transcript percentages are accurate | ✅ **VERIFIED** | Full coverage verified |
| A8 | 100% maths KS4 tier coverage | ✅ **VERIFIED** | Confirmed |
| A9-A10 | Duplicate handling | ✅ **VERIFIED** | 373 maths duplicates are identical; safe to dedupe |
| A14 | 14 subjects have full transcripts | ✅ **VERIFIED** | 14 subjects 95-100%; PE and MFL partial/none |
| A15 | PE has partial transcripts | ✅ **VERIFIED** | Primary 0.6%, Secondary 28.5% |

---

## 📂 KEY FILES REFERENCE

### Bulk Ingestion Pipeline (FIXED)

| File | Purpose |
|------|---------|
| `src/adapters/bulk-lesson-transformer.ts` | Lesson → ES doc (now with semantic summary) |
| `src/adapters/bulk-rollup-builder.ts` | Unit → rollup doc (NEW) |
| `src/adapters/hybrid-data-source.ts` | Composes bulk + API + rollups |
| `src/lib/indexing/bulk-ingestion.ts` | Entry point for bulk operations |
| `src/lib/indexing/bulk-chunk-uploader.ts` | ES bulk upload chunking (NEW) |

### SDK Bulk Parsing

| File | Purpose |
|------|---------|
| `packages/sdks/.../bulk-schemas.ts` | Zod schemas (now with nullSentinelSchema) |
| `packages/sdks/.../bulk-reader.ts` | `parseBulkFile()`, `readAllBulkFiles()` |

### Documentation

| File | Purpose |
|------|---------|
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Master plan |
| [bulk-ingestion-fixes.md](../../plans/semantic-search/active/bulk-ingestion-fixes.md) | Implementation spec (COMPLETE) |
| [08-bulk-ingestion-investigation-2025-12-31.md](../../research/ooc/08-bulk-ingestion-investigation-2025-12-31.md) | Investigation findings |
