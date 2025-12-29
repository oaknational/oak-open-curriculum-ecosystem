# Semantic Search Current State

**Last Updated**: 2025-12-29
**Measured Against**: Post-adapter refactoring (ES needs reset)
**Ground Truth Status**: ✅ Corrected and Verified (Maths KS4 only)

This is THE authoritative source for current system metrics.

---

## Index Status (2025-12-29)

**🔄 STATUS: Adapter refactoring complete. ES reset and cache validation pending.**

### Summary

| Metric                     | Current     | Target   | Status               |
| -------------------------- | ----------- | -------- | -------------------- |
| Lessons indexed            | 0           | ~12,316  | 📋 Pending           |
| Subjects indexed           | 0/17        | 17/17    | 📋 Pending           |
| Pattern-aware traversal    | ✅          | ✅       | ✅ Implemented       |
| Adapter refactoring        | ✅          | ✅       | ✅ Complete          |
| Quality gates              | ✅          | ✅       | ✅ All 11 passing    |
| ES reset                   | —           | ✅       | 📋 Pending           |
| Cache validation           | —           | ✅       | 📋 Pending (re-verify) |

### ES Indices (Need Reset)

| Index                | Doc Count | Status            |
| -------------------- | --------- | ----------------- |
| `oak_lessons`        | 0         | 📋 Needs reset    |
| `oak_units`          | 0         | 📋 Needs reset    |
| `oak_unit_rollup`    | 0         | 📋 Needs reset    |
| `oak_threads`        | 0         | 📋 Needs reset    |
| `oak_sequences`      | 0         | 📋 Needs reset    |
| `oak_sequence_facets`| 0         | 📋 Needs reset    |

---

## Pending Validations

### 1. ES Reset Required

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
```

### 2. Cache Validation Required

The adapter refactoring introduced a new `CacheOperations` interface. Need to verify:

| Check                    | How to Verify                              | Status    |
| ------------------------ | ------------------------------------------ | --------- |
| Redis connection         | Run ingestion, check for "SDK caching enabled" | 📋 Pending |
| Cache reads              | Check for cache hits in verbose output     | 📋 Pending |
| Cache writes             | Check for cache misses followed by API calls | 📋 Pending |
| Negative caching (404s)  | Check "Caching 404 response" logs          | 📋 Pending |
| `--bypass-cache` flag    | Should log "SDK caching disabled"          | 📋 Pending |
| `--ignore-cached-404`    | Should log "Ignoring cached 404"           | 📋 Pending |

**Verification Commands**:

```bash
# Test with cache enabled
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --dry-run

# Test with cache bypassed
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --bypass-cache --dry-run
```

---

## Recent Work Completed (2025-12-29)

### Adapter Refactoring — COMPLETE ✅

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
| `pnpm test`            | ✅ Pass |
| `pnpm test:e2e`        | ✅ Pass |
| `pnpm test:e2e:built`  | ✅ Pass |
| `pnpm test:ui`         | ✅ Pass |
| `pnpm smoke:dev:stub`  | ✅ Pass |

---

## Redis Cache Status (Needs Verification)

| Metric                   | Value      | Status                     |
| ------------------------ | ---------- | -------------------------- |
| Lesson summaries cached  | 7,089      | ⚠️ Verify still accessible |
| Lesson transcripts cached| 4,281      | ⚠️ Verify still accessible |
| Unit summaries cached    | 669        | ⚠️ Verify still accessible |
| **Total cached**         | **12,039** | ⚠️ Verify after refactoring |

**Why verification needed**: The new `CacheOperations` interface changed how we interact with Redis.

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
| rshe-pshe            | TBD           | API only, no bulk file   |
| **TOTAL**            | **~12,316**   |                          |

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
| Pattern-aware traversal  | ✅ Complete | All 7 patterns implemented            |
| Static pattern config    | ✅ Complete | 68 subject × keystage combinations    |
| Adapter refactoring      | ✅ Complete | 593→197 lines, TDD-driven             |
| Quality gates            | ✅ Passing  | All 11 gates green                    |
| ES reset                 | 📋 Pending  | Need to run `pnpm es:setup --reset`   |
| Cache validation         | 📋 Pending  | Verify new CacheOperations works      |
| Incremental ingestion    | 📋 Verify   | `create` action by default            |
| Force mode               | 📋 Verify   | `--force` flag for overwrite          |
| Four-retriever hybrid    | ✅ Complete | BM25 + ELSER with RRF fusion          |
| Synonyms (163 entries)   | ✅ Deployed | Awaiting verification post-ingestion  |

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

**Source**: `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/`

| Metric         | Value  |
| -------------- | ------ |
| Files          | 30     |
| Raw lessons    | 12,783 |
| Unique lessons | 12,316 |
| Duplicates     | 467 (tiers/options) |

**Note**: RSHE-PSHE has no bulk download file (API only).

---

## Related Documents

- **[roadmap.md](roadmap.md)** — Linear execution path
- **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological history
- **[ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)** — 63 slug corrections
- **[curriculum-structure-analysis.md](../../analysis/curriculum-structure-analysis.md)** — 7 API patterns documented
- **[archive/completed/](archive/completed/)** — Completed work summaries
