# Semantic Search — Session Context

**Status**: 🛑 Strategic decision required before proceeding
**Last Updated**: 2025-12-30
**Master Plan**: [Semantic Search Roadmap](../../plans/semantic-search/roadmap.md)

---

## 🚨 CRITICAL FINDINGS (2025-12-30)

A deep investigation into transcript availability revealed fundamental data source differences that require strategic discussion before proceeding.

### The Core Discovery

| Data Source | Transcript Coverage | Notes |
|-------------|---------------------|-------|
| **Bulk Download** | ~81% of lessons (14/17 subjects) | Complete transcripts |
| **Live API** | ~16% of lessons (maths only) | TPC-filtered |
| **MFL Subjects** | 0% | No video content exists |

**Key insight**: The bulk download and API are not equivalent data sources. They serve different purposes.

### Why This Matters

The current ingestion pipeline fetches transcripts via the live API. For non-maths subjects, this results in:

- ~65% of transcript requests returning 404
- Many "transcript not found" warnings (expected, not bugs)
- Semantic search limited to metadata-only for most subjects

**This is documented, expected behavior** — see [Oak API Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage):

> "Currently, the API includes **all lesson resources for KS1-4 maths**, plus a **sample of lesson resources** for [other subjects]"

### ⚠️ Video/Transcript Detection Code is Largely Pointless

The video availability detection code (`video-availability.ts`, ADR-091) was designed to optimize transcript fetching by pre-checking which lessons have videos. **However, this optimization is largely pointless because:**

1. **The assets endpoint is TPC-filtered** — it only returns ~35% of non-maths lessons, so we can't reliably detect video availability for most subjects
2. **Even when we know a lesson has video, the transcript API returns 404** — the TPC filter applies to transcripts too
3. **For maths (the only fully-cleared subject), nearly all lessons have both video AND transcript** — so the detection adds overhead without benefit

**Net result**: The detection code adds complexity but doesn't meaningfully reduce failed transcript fetches. The real solution is either:
- Use bulk download data (has transcripts)
- Wait for Oak to clear TPC for all subjects (Autumn 2025)

**Code affected**: `src/lib/indexing/video-availability.ts`, ADR-091, ADR-092

---

## 📊 Data Sources Compared

### Bulk Download (`reference/bulk_download_data/`)

| Attribute | Value |
|-----------|-------|
| **Last downloaded** | 2025-12-07 |
| **Total lessons** | 12,783 |
| **Subjects with full transcripts** | 14 (art, citizenship, computing, cooking-nutrition, design-technology, english, geography, history, maths, music, religious-education, science, RSHE) |
| **Subjects with no transcripts** | 3 (french, german, spanish — MFL subjects) |
| **Subjects with partial transcripts** | 1 (PE — 29% secondary, 0.7% primary) |
| **Data quality issues** | Null titles, tier duplicates, inconsistent null semantics |
| **Refresh frequency** | Unknown (no documented schedule) |

### Live API

| Attribute | Value |
|-----------|-------|
| **Transcript coverage** | Maths: 100%, Others: "sample" (~0-35%) |
| **Pagination bug** | 5 lessons missing from maths KS4 unfiltered queries |
| **TPC filtering** | Assets/transcripts filtered for license compliance |
| **Production timeline** | Full coverage expected **Autumn 2025** |

### Detailed Transcript Availability (Bulk Download)

| Subject | Primary | Secondary | Notes |
|---------|---------|-----------|-------|
| Art | 100% | 100% | |
| Citizenship | — | 100% | |
| Computing | 100% | 100% | |
| Cooking & Nutrition | 100% | 100% | |
| Design Technology | 100% | 100% | |
| English | 98% | 100% | 28 lessons without |
| Geography | 100% | 100% | |
| History | 100% | 100% | |
| **Maths** | 99.5% | 100% | 5 lessons without |
| Music | 100% | 96% | |
| Religious Education | 100% | 100% | |
| Science | 100% | 100% | |
| **French** | **0%** | **0.2%** | MFL — no video |
| **German** | — | **0.2%** | MFL — no video |
| **Spanish** | **0.9%** | **0%** | MFL — no video |
| **PE** | **0.7%** | **29%** | Partial video |

---

## 🔀 Strategic Options

Three approaches are available. None is assumed — discussion required.

### Option A: API-Only Ingestion (Current Implementation)

```
┌─────────────────────────────────────────────────────────────────┐
│  Continue with current pipeline                                  │
│                                                                  │
│  How it works:                                                   │
│  - Fetch lessons via API (unit-by-unit to avoid pagination bug) │
│  - Fetch transcripts via API (expect 404 for non-maths)         │
│  - Index all lessons, with or without transcripts               │
│                                                                  │
│  Pros:                                                           │
│  ✅ Already implemented and tested                               │
│  ✅ Real-time data (not stale)                                   │
│  ✅ Can proceed immediately                                      │
│                                                                  │
│  Cons:                                                           │
│  ❌ ~65% of non-maths transcript fetches return 404              │
│  ❌ Semantic search limited to maths + metadata                  │
│  ❌ Many expected warnings (noisy logs)                          │
│                                                                  │
│  Effort: 0 days                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Option B: Bulk Download Hybrid

```
┌─────────────────────────────────────────────────────────────────┐
│  Use bulk download for transcripts, API for metadata            │
│                                                                  │
│  How it works:                                                   │
│  - Parse bulk download JSON files for lesson enumeration        │
│  - Extract transcripts from bulk download                       │
│  - Supplement with API for real-time metadata if needed         │
│                                                                  │
│  Pros:                                                           │
│  ✅ 81% of lessons get full transcripts                          │
│  ✅ Semantic search works across 14/17 subjects                  │
│  ✅ No "transcript not found" noise                              │
│  ✅ Faster ingestion (no per-lesson API calls for transcripts)  │
│                                                                  │
│  Cons:                                                           │
│  ❌ ~4.5 days implementation                                     │
│  ❌ Bulk download may be stale (no refresh mechanism yet)        │
│  ❌ Must handle bulk download data issues (null titles, etc.)    │
│                                                                  │
│  Effort: ~4.5 days                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Option C: Dual-Index Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Separate indexes for different content types                   │
│                                                                  │
│  How it works:                                                   │
│  - Index 1: Rich (maths + bulk subjects with transcripts)       │
│  - Index 2: Foundation (MFL + PE without transcripts)           │
│  - Different retrieval strategies per index                     │
│                                                                  │
│  Pros:                                                           │
│  ✅ Optimized retrieval per content type                         │
│  ✅ Clear separation of capabilities                             │
│  ✅ Maths serves as exemplar with full features                  │
│                                                                  │
│  Cons:                                                           │
│  ❌ ~2 days implementation                                       │
│  ❌ More complex retriever logic                                 │
│  ❌ Two indexes to maintain                                      │
│  ❌ User experience question ("why is maths search better?")     │
│                                                                  │
│  Effort: ~2 days                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Option D: Wait for Autumn 2025

```
┌─────────────────────────────────────────────────────────────────┐
│  Wait for Oak to complete full API coverage                     │
│                                                                  │
│  Oak documentation states:                                       │
│  "Production is expected to finish in Autumn 2025"              │
│                                                                  │
│  Pros:                                                           │
│  ✅ Full transcript coverage via API                             │
│  ✅ No hybrid complexity                                         │
│  ✅ Single source of truth                                       │
│                                                                  │
│  Cons:                                                           │
│  ❌ 9+ months delay                                              │
│  ❌ Uncertain timeline                                           │
│  ❌ Maths-only semantic search in the meantime                   │
│                                                                  │
│  Effort: Time-based                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤔 Discussion Points for Next Session

Before proceeding, consider:

### 1. What user impact are we optimizing for?

- **Option A**: Ship fast with maths-only semantic search
- **Option B/C**: Broader coverage but more work
- **Option D**: Best coverage but long wait

### 2. Is "maths as exemplar" an acceptable interim state?

The current implementation provides full semantic search for maths (~16% of lessons). Is this valuable enough to ship while other subjects get metadata-only search?

### 3. How stale is acceptable for bulk download data?

The bulk download is ~3 weeks old. If we use it:
- What refresh mechanism do we need?
- How do we detect/handle new lessons added via API?

### 4. Is dual-index complexity justified?

Option C adds retrieval complexity. Is the benefit of optimized per-type retrieval worth the maintenance cost?

### 5. What does "done" look like for Phase 2.6?

- All lessons indexed (regardless of transcript)? 
- Verified transcript coverage per subject?
- Search quality baseline established?

---

## 📚 Key References

### Analysis Documents

| Document | Content |
|----------|---------|
| **[transcript-availability-analysis.md](../../analysis/transcript-availability-analysis.md)** | **Comprehensive findings from this investigation** — data tables, assumptions tested, investigation chronology |
| [curriculum-structure-analysis.md](../../analysis/curriculum-structure-analysis.md) | All 6 structural patterns, traversal strategies |

### API Wishlist Updates (2025-12-30)

New items added to `00-overview-and-known-issues.md`:

| ID | Request | Priority |
|----|---------|----------|
| **ER1** | Full data coverage across all subjects | HIGH |
| **ER2** | Documentation of API vs bulk download differences | MEDIUM |
| **ER3** | `hasTranscript` boolean flag in lessons endpoint | MEDIUM |
| Q1-Q6 | Clarifying questions for upstream team | — |

### ADRs

| ADR | Decision |
|-----|----------|
| [ADR-083](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) | Fetch lessons unit-by-unit (workaround for pagination bug) |
| [ADR-091](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) | Tri-state `hasVideo()` function for TPC-filtered assets |
| [ADR-092](../../../docs/architecture/architectural-decisions/092-transcript-cache-categorization.md) | Structured transcript cache metadata |

### External Documentation

| Link | Content |
|------|---------|
| [Oak Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage) | Official statement on API resource availability |
| [Oak Terms](https://open-api.thenational.academy/docs/about-oaks-api/terms) | OGL v3.0 licensing |
| [Bulk Download](https://open-api.thenational.academy/bulk-download) | Full dataset download |

---

## ✅ Completed Work Summary

All prerequisite work is complete. The system is technically ready for full ingestion.

### Phase 0: Plan Review — COMPLETE ✅

- All plan documents audited
- Bulk download data verified (30 files, ~12,783 lessons)
- API structure verified via MCP tools
- ES state documented

### Phase 1: Pattern-Aware Ingestion — COMPLETE ✅

All 7 curriculum structural patterns implemented:

| Pattern | Subjects |
|---------|----------|
| `simple-flat` | All KS1-KS3, some KS4 |
| `tier-variants` | Maths KS4 |
| `exam-subject-split` | Science KS4 |
| `exam-board-variants` | 12 subjects KS4 |
| `unit-options` | 6 subjects KS4 |
| `no-ks4` | Cooking-nutrition |
| `empty` | Edge cases |

### Phase 2.1-2.5: Infrastructure — COMPLETE ✅

| Task | Status | Result |
|------|--------|--------|
| Adapter refactoring | ✅ | 593→197 lines, TDD-driven |
| ES reset | ✅ | 7 indices, 192 synonyms |
| Cache validation | ✅ | 756 hits, 1 miss |
| ES upsert verify | ✅ | 638 docs (maths KS1) |
| Cache categorization | ✅ | Structured metadata, zero compat layers |
| Quality gates | ✅ | All 11 passing |

### Plan Consolidation — COMPLETE ✅

Legacy `.cursor/plans/` files deleted. Active plan: `.cursor/plans/semantic_search_ingestion_8eaea812.plan.md`

---

## 📋 Pending Work (from Plan)

| ID | Task | Phase | Status |
|----|------|-------|--------|
| `phase2-ingest` | Run full curriculum ingestion | 2 | ⏸️ Awaiting strategic decision |
| `phase2-gates` | Run all quality gates after ingestion | 2 | Pending |
| `phase3-counts` | Verify per-subject counts | 3 | Pending |
| `phase3-patterns` | Verify pattern-specific data | 3 | Pending |
| `phase3-baseline` | Establish search quality baseline | 3 | Pending |
| `phase3-docs` | Update current-state.md and roadmap.md | 3 | Pending |
| `phase3-gates` | Run all quality gates | 3 | Pending |

Phase 4 (SDK extraction) is deferred pending Phase 3 completion.

---

## Infrastructure Status

### ES Index Status (After Reset — 2025-12-29)

| Index | Doc Count | Target | Status |
|-------|-----------|--------|--------|
| `oak_lessons` | 437 (maths KS1) | ~12,783 | 📋 Needs full ingestion |
| `oak_units` | TBD | — | 📋 Needs full ingestion |
| `oak_unit_rollup` | TBD | — | 📋 Needs full ingestion |
| `oak_threads` | 201 (maths KS1) | — | 📋 Needs full ingestion |
| `oak_sequences` | TBD | — | 📋 Needs full ingestion |
| `oak_sequence_facets` | TBD | — | 📋 Needs full ingestion |

### Redis Cache Status (Verified Working)

| Metric | Value | Status |
|--------|-------|--------|
| Lesson summaries cached | 7,089 | ✅ Accessible |
| Lesson transcripts cached | 4,281 | ✅ Accessible |
| Unit summaries cached | 669 | ✅ Accessible |
| **Total cached** | **12,039** | ✅ Working |

---

## Quality Gates

Run from repo root after any changes:

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

## Foundation Documents (MANDATORY)

Before any work, read:

1. **[rules.md](../../directives-and-memory/rules.md)** — First Question: "Could it be simpler?"
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at all levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth
4. **[AGENT.md](../../directives-and-memory/AGENT.md)** — Agent-specific directives

---

## Key Files Reference

### Adapter Layer

| File | Purpose |
|------|---------|
| `src/adapters/oak-adapter.ts` | **Public API** — `createOakClient()`, `OakClient` interface |
| `src/adapters/oak-adapter-types.ts` | Type definitions for all API methods |
| `src/adapters/sdk-api-methods.ts` | Factories for each API endpoint |
| `src/adapters/sdk-cache/` | Caching infrastructure |

### Ingestion Pipeline

| File | Purpose |
|------|---------|
| `src/lib/elasticsearch/setup/ingest-live.ts` | CLI entry point |
| `src/lib/index-oak.ts` | Main indexing logic |
| `src/lib/indexing/lesson-materials.ts` | Transcript + summary fetching |
| `src/lib/indexing/pattern-aware-fetcher.ts` | Pattern-aware traversal |

### Bulk Download Data

| Path | Content |
|------|---------|
| `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/` | 30 JSON files, ~12,783 lessons |

---

## Upstream API Code Reference

For investigating API behavior, the upstream code is at `reference/oak-openapi/`:

| File | Purpose |
|------|---------|
| `src/lib/queryGate.ts` | **TPC license filtering** — explains assets/transcript incompleteness |
| `src/lib/queryGateData/supportedLessons.json` | 4,559 TPC-cleared lessons |
| `src/lib/queryGateData/supportedUnits.json` | 213 TPC-cleared units |
