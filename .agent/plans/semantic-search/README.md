# Semantic Search Planning Documents

**Git Version**: See `git log` for commit history  
**Status**: Phase 1E ✅ COMPLETE | Phase 1C 🟢 READY TO START  
**Last Updated**: 2025-12-09

---

## ✅ ARCHITECTURAL FIX COMPLETE (2025-12-09)

**All blocking issues resolved. Phase 1C (Baseline Metrics) is now UNBLOCKED.**

| Issue | Description                                              | Status                |
| ----- | -------------------------------------------------------- | --------------------- |
| 5.2   | **Lessons API pagination** - only 5 of 36 groups fetched | ✅ FIXED (2025-12-09) |
| 5.1   | Units `key_stage` naming (was misdiagnosed)              | ✅ RESOLVED           |
| 5.3   | No fuzzy matching - misspellings return 0 hits           | ✅ FIXED              |
| 5.4   | Thread canonical URL crash                               | ✅ FIXED              |
| 5.5   | Sequence canonical URL generation in SDK                 | ✅ FIXED (2025-12-09) |

**Solution Implemented**: Created `deriveLessonGroupsFromUnitSummaries()` function to derive lessons from complete unit summaries instead of the paginated `/lessons` endpoint.

**Result**: **314 lessons** now indexed (up from ~100), covering all 36 Maths KS4 units.

---

## 🎯 Strategic Goals

### Current Focus: Maths KS4 Proof of Concept

Validate Elasticsearch Serverless as the platform for intelligent curriculum search using Maths KS4 as a complete vertical slice.

### Future Roadmap

| Milestone             | Scope                                       | Purpose                                         |
| --------------------- | ------------------------------------------- | ----------------------------------------------- |
| **Maths KS4**         | Single subject, single key stage            | Prove architecture, validate search quality     |
| **Full Maths**        | All Maths content (KS1-KS4)                 | Scale within subject, handle curriculum breadth |
| **All Subjects**      | Complete Oak Curriculum (~340 combinations) | Full production deployment                      |
| **Advanced Features** | RAG, knowledge graph, personalisation       | Differentiated teacher experience               |

**Full Curriculum Ingestion**: Given the **Oak API 1000 requests/hour limit**, systematic ingestion of all 340 subject/keystage combinations requires 17-24 hours. The ingestion infrastructure (`pnpm ingest:all`, `pnpm ingest:progress`) is ready for this when validation is complete.

---

## 🎯 Start Here

### For New Implementation Sessions

**Read these in order**:

1. **`.agent/prompts/semantic-search/semantic-search.prompt.md`** ⭐ START HERE
   - Complete context for fresh chat sessions
   - Prerequisites, environment setup, current state
   - Quick start guide for Phase 1

2. **`maths-ks4-implementation-plan.md`** 📋 MAIN BACKEND PLAN
   - Complete implementation roadmap
   - All phases with detailed tasks
   - TDD approach, ADRs, success criteria

3. **`search-ui-plan.md`** 📋 MAIN FRONTEND PLAN
   - React components, design system
   - Fixture testing, accessibility
   - Responsive layout

4. **Foundation Documents** (MUST READ)
   - `.agent/directives-and-memory/rules.md`
   - `.agent/directives-and-memory/schema-first-execution.md`
   - `.agent/directives-and-memory/testing-strategy.md`

---

## Implementation Philosophy: Simpler First

**First Question**: Could it be simpler without compromising quality?

We implement the **simpler approach first** and only add complexity when it delivers measurable value:

| Phase  | Focus                       | Complexity | Purpose                      |
| ------ | --------------------------- | ---------- | ---------------------------- |
| **1**  | Two-way hybrid (BM25+ELSER) | Low        | Establish baseline, validate |
| **2**  | Evaluate dense vectors      | Medium     | Only if Phase 1 insufficient |
| **3+** | Advanced features           | High       | ReRank, filtered kNN, RAG    |

**Key Insight**: Don't build three-way hybrid infrastructure before validating that two-way is insufficient.

---

## Document Hierarchy

### Implementation Plans

| Document                               | Purpose                                                                                   | When to Use                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| **`maths-ks4-implementation-plan.md`** | Complete implementation plan for Maths KS4 vertical slice with all ES Serverless features | Primary backend/search implementation |
| **`search-ui-plan.md`**                | Frontend implementation: components, theme, fixtures, accessibility, Playwright tests     | UI/frontend implementation            |

### Reference Documents

| Document                                        | Purpose                                                |
| ----------------------------------------------- | ------------------------------------------------------ |
| **`reference-ir-metrics-guide.md`**             | IR metrics (MRR, NDCG) explained + implementation code |
| **`reference-data-completeness-policy.md`**     | Policy on what data we upload in full vs summarise     |
| **`reference-es-serverless-feature-matrix.md`** | Feature adoption tracking matrix with impact/cost/risk |

### Research Documents

| Document                                                                               | Purpose                               |
| -------------------------------------------------------------------------------------- | ------------------------------------- |
| **`.agent/research/elasticsearch/curriculum-schema-field-analysis.md`**                | Untapped API schema fields for search |
| **`.agent/research/elasticsearch/natural-language-search-with-es-native-features.md`** | ES-native NLP capabilities            |

### Archive

| Document/Directory                                                                        | Contents                                    |
| ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| **`.agent/prompts/semantic-search/archive/`**                                             | Archived prompts and completed phase guides |
| **`.agent/prompts/semantic-search/archive/phase-1a-complete.md`**                         | Phase 1A infrastructure TDD examples        |
| **`.agent/prompts/semantic-search/archive/curriculum-vocabulary-checkpoint-RESOLVED.md`** | Resolved checkpoint from Phase 1A           |

---

## Implementation Overview

### Strategic Goal

Create a **production-ready demo** of ES Serverless capabilities using Maths KS4 as a complete vertical slice, starting with the simplest approach that delivers value.

### Why Maths KS4?

- ✅ Maximum complexity (tiers, pathways, exam boards, threads)
- ✅ High teacher value (exam preparation)
- ✅ Complete feature coverage (all search capabilities)
- ✅ Manageable scope (~100-200 API requests, 10-20 minutes)
- ✅ Scalable patterns for full curriculum

### Implementation Phases

| Phase  | Duration  | Focus                     | Status                    | Key Features                             |
| ------ | --------- | ------------------------- | ------------------------- | ---------------------------------------- |
| **1A** | ✅ Done   | Maths KS4 Ingestion       | ✅ Complete (2025-12-09)  | 314 lessons, 36 units, 201 threads       |
| **1B** | ✅ Done   | RRF API Update            | ✅ Complete (2025-12-08)  | Updated to ES 8.11+ retriever API        |
| **1D** | ✅ Done   | Missing Indices Fix       | ✅ Complete (2025-12-09)  | oak_threads, oak_sequences, ref indices  |
| **--** | ✅ Done   | Blocking Issues           | ✅ Complete (2025-12-09)  | 12 schema issues + fuzzy matching fixed  |
| **1E** | ✅ Done   | Search Foundation         | ✅ Complete (2025-12-09)  | Lessons-from-unit-summaries architecture |
| **1C** | 0.5 days  | Baseline Metrics          | 🟢 **READY TO START**     | MRR, NDCG@10, zero-hit, latency          |
| **2**  | 0.5 days  | Evaluate Three-Way        | 🔵 Optional (if 1C fails) | Only if two-way insufficient             |
| **3**  | 0.5-1 day | Reference Index Data      | ⏸️ Future                 | Populate ref indices from ontology data  |
| **4**  | 2-3 days  | Relevance Enhancement     | ⏸️ Future                 | Elastic Native ReRank, filtered kNN      |
| **5**  | 3-4 days  | Entity Extraction & Graph | ⏸️ Future                 | NER models, Graph API, enrich processor  |
| **6**  | 4-5 days  | RAG Infrastructure        | ⏸️ Future                 | ES Playground, semantic_text, chunking   |
| **7**  | 5-6 days  | Knowledge Graph           | ⏸️ Future                 | Triple store, entity resolution          |
| **8**  | 3-4 days  | Advanced Features         | ⏸️ Future                 | LTR foundations, multi-vector            |

---

## Current System State

**Last verified**: 2025-12-09

### Maths KS4 Ingestion ✅ COMPLETE (2025-12-09)

| Index             | Document Count | Status |
| ----------------- | -------------- | ------ |
| `oak_lessons`     | **314**        | ✅     |
| `oak_units`       | 36             | ✅     |
| `oak_unit_rollup` | 244            | ✅     |
| `oak_threads`     | 201            | ✅     |
| `oak_sequences`   | 2              | ✅     |
| **Total**         | **~799**       | ✅     |

**Key Achievement**: All 36 Maths KS4 units now have their lessons indexed (up from only 5 groups/~100 lessons).

**Infrastructure Complete**:

- ✅ ES Serverless deployed (ES 8.11.0) with 7 indexes
- ✅ ELSER sparse embeddings configured (`.elser-2-elasticsearch`)
- ✅ Dense vector generation working (`.multilingual-e5-small-elasticsearch`)
- ✅ SDK rate limiting (5 req/sec, ADR-070)
- ✅ Synonym set `oak-syns` with 68 rules
- ✅ Field definitions architecture (ADR-067)
- ✅ Per-index completion contexts (ADR-068)
- ✅ Systematic ingestion (ADR-069)
- ✅ Two-way RRF query builders (BM25 + ELSER) - **updated to `retriever` API**
- ✅ Three-way RRF query builders (BM25 + ELSER + Dense) - **updated to `retriever` API**
- ✅ Tier, exam_board, pathway field extraction
- ✅ Lessons derived from unit summaries (not paginated API)
- ✅ ADRs 071-074 written
- ✅ All 11 quality gates passing (1,300+ tests)

### Phase 1B Complete ✅ (2025-12-08)

**RRF API Updated**:

- ✅ Migrated from deprecated `rank` API to ES 8.11+ `retriever` API
- ✅ Two-way RRF query builders updated (`rrf-query-builders.ts`)
- ✅ Three-way RRF query builders updated (`rrf-query-builders-three-way.ts`)
- ✅ Validated against live ES Serverless (21 results for "pythagoras theorem")
- ✅ All quality gates passing

### Phase 1D Complete ✅ (2025-12-09)

**Missing Indices Fixed**:

- ✅ `oak_threads` mapping generator created (`createThreadsMappingModule()`)
- ✅ `oak_sequences` document builder implemented with TDD
- ✅ `oak_threads` document builder + API integration (`/threads` endpoint)
- ✅ Thread ingestion integrated into `buildIndexBulkOps()` pipeline
- ✅ Reference index mappings generated (subjects, key_stages, glossary)
- ✅ Reference document builders implemented with TDD
- ✅ All quality gates passing

**Reference Indices (Future - Phase 3)**:

- Mappings and builders ready
- Data source: `ontology-data.ts` and `knowledge-graph-data.ts`
- NO extraction during ingestion - use static curriculum metadata

### Phase 1E Complete ✅ (2025-12-09)

**All Search Foundation Issues Resolved**:

- ✅ Issue 5.4: Thread canonical URL - returns `null`, throws for missing context (fail-fast)
- ✅ Issue 5.3: Fuzzy matching - added `fuzziness: 'AUTO'` to BM25 queries (TDD)
- ✅ Issue 5.1: key_stage naming - investigation confirmed code is correct
- ✅ Issue 5.2: Lessons API pagination - implemented `deriveLessonGroupsFromUnitSummaries()`
- ✅ Issue 5.5: Sequence canonical URL - fixed `isSingleEntityEndpoint()` in SDK
- ✅ All tests updated to expect fail-fast behavior (no error swallowing)
- ✅ ES indices reset and re-ingested with complete lessons
- ✅ All quality gates passing (1,300+ tests)

**Result**: 314 lessons indexed from all 36 units (was 100 from 5 groups).

### Next: Phase 1C (Baseline Metrics) 🟢 READY TO START

**Goal**: Establish baseline metrics with two-way hybrid search.

**Prerequisites** ✅ ALL COMPLETE

**Phase 1C Tasks**:

- [ ] Create ground truth data for Maths KS4 queries
- [ ] Run two-way hybrid search tests
- [ ] Measure MRR, NDCG@10, zero-hit rate, latency
- [ ] Decision: two-way sufficient OR evaluate three-way

---

## Technical Debt Resolved ✅ (2025-12-09)

All 16 blocking issues identified during deep review have been resolved.

| ID  | Category     | Issue                                           | Status                                                       |
| --- | ------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| 1.1 | Schema/Field | Missing `pathway` field in unit_rollup          | ✅ Added to field definitions and ES overrides               |
| 1.2 | Schema/Field | `thread_slugs/titles/orders` never populated    | ✅ `extractThreadInfo()` created, integrated into transforms |
| 1.3 | Schema/Field | Dense vector field naming inconsistency         | ✅ Documented in TSDoc comments                              |
| 2.1 | Facets       | Lesson facets missing tier, exam_board, pathway | ✅ Added to `createLessonFacets()`                           |
| 2.2 | Facets       | No unit facets exist                            | ✅ Created `createUnitFacets()` with `includeFacets` param   |
| 2.3 | Facets       | Sequence facets defined but unused              | ✅ Documented as future work in TSDoc                        |
| 3.1 | Data         | Hardcoded `subjectSlugs: ['maths']`             | ✅ Parameterised via `FetchThreadsOptions`                   |
| 3.2 | Data         | `buildThreadOps` returns `unknown[]`            | ✅ Replaced with `ThreadBulkOperation[]` type                |
| 3.3 | Data         | Rollup text missing pedagogical data            | ✅ `extractPedagogicalData()` + `createEnrichedRollupText()` |
| 4.1 | Status       | Phase 1C marked "CURRENT" but not started       | ✅ Status corrected in all documents                         |
| 4.2 | Status       | Missing search-quality infrastructure           | ✅ Created `src/lib/search-quality/` with types and exports  |
| 4.3 | Status       | Missing IR metrics implementation               | ✅ MRR and NDCG@10 implemented with TDD (13 unit tests)      |
| 5.1 | Search       | Units key_stage naming                          | ✅ Confirmed correct field name used                         |
| 5.2 | Search       | Lessons API pagination (100 limit)              | ✅ `deriveLessonGroupsFromUnitSummaries()` implemented       |
| 5.3 | Search       | No fuzzy matching configured                    | ✅ Added `fuzziness: 'AUTO'` to BM25 queries                 |
| 5.4 | Generator    | Thread canonical URL crash                      | ✅ Returns `null` for threads, throws for missing context    |
| 5.5 | SDK          | Sequence canonical URL generation               | ✅ Fixed `isSingleEntityEndpoint()` check order              |

---

## Foundation Document Alignment

All work MUST adhere to:

### Schema-First (Mandatory)

- All types, Zod schemas, ES mappings flow from field definitions
- Run `pnpm type-gen` after field definition changes
- Never edit generated files
- Update generators only

### TDD at ALL Levels (Mandatory)

- Write tests FIRST (RED → GREEN → REFACTOR)
- Unit tests: Pure functions, no IO, no mocks
- Integration tests: Code units together, simple mocks injected
- E2E tests: Running system, real behaviour

### Documentation (Mandatory)

- TSDoc with examples on all functions
- Authored docs in `apps/oak-open-curriculum-semantic-search/docs/`
- ADRs for architectural decisions
- Update continuation prompt with new capabilities

---

## Quality Gates

**ALL phases must pass ALL gates**:

```bash
# From repo root, one at a time, with no filters
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

**No exceptions. All gates must be green.**

---

## Success Criteria

### Phase 1A: Data Ingestion ✅ COMPLETE (2025-12-09)

- [x] Maths KS4 ingested (**314 lessons**, 36 units, 244 rollups, 201 threads)
- [x] Dense vectors generated
- [x] Basic BM25 search validated
- [x] All quality gates passing

### Phase 1B: RRF API Update ✅ COMPLETE (2025-12-08)

- [x] Researched ES 8.11+ `retriever` API syntax
- [x] Updated two-way RRF query builders (`rrf-query-builders.ts`)
- [x] Updated three-way RRF query builders (`rrf-query-builders-three-way.ts`)
- [x] Updated `elastic-http.ts` to support `retriever` property
- [x] Updated unit tests for new `retriever` structure
- [x] Validated with Maths KS4 data against live ES Serverless
- [x] All quality gates passing

### Phase 1D: Missing Indices ✅ COMPLETE (2025-12-09)

- [x] `OAK_THREADS_MAPPING` generated via `createThreadsMappingModule()`
- [x] `oak_sequences` document builder with TDD
- [x] `oak_threads` document builder with TDD + API integration
- [x] Thread ingestion integrated into main pipeline
- [x] Reference index mappings generated (3 indices)
- [x] Reference document builders implemented
- [x] All quality gates passing

### Phase 1E: Search Foundation ✅ COMPLETE (2025-12-09)

- [x] Issue 5.1: key_stage naming confirmed correct
- [x] Issue 5.2: Lessons-from-unit-summaries architecture implemented
- [x] Issue 5.3: Fuzzy matching configured
- [x] Issue 5.4: Thread canonical URL fixed
- [x] Issue 5.5: Sequence canonical URL fixed
- [x] ES indices reset and re-ingested
- [x] 314 lessons indexed (all 36 units)
- [x] All quality gates passing

### Phase 1C: Baseline Metrics 🟢 READY TO START

**Prerequisites** ✅ ALL RESOLVED (2025-12-09):

- [x] All Phase 1E issues resolved
- [x] Search-quality infrastructure created
- [x] MRR and NDCG metrics implemented with TDD

**Phase 1C Tasks** (Ready to Execute):

- [ ] Create ground truth data for Maths KS4 queries
- [ ] Two-way hybrid search working
- [ ] Baseline metrics established (MRR, NDCG@10, zero-hit, latency)
- [ ] Search quality validated
- [ ] Decision documented: two-way sufficient OR evaluate three-way

### Full Project

- [ ] Production-ready search for Maths KS4
- [ ] MRR: > 0.70
- [ ] NDCG@10: > 0.75
- [ ] Zero-hit rate: <10%
- [ ] p95 latency: <300ms
- [ ] Impressive stakeholder demo

---

## CLI Quick Reference

### Ingestion

```bash
cd apps/oak-open-curriculum-semantic-search

# Check ES status
pnpm es:status

# Ingest Maths KS4 (Phase 1)
pnpm es:ingest-live --subject maths --keystage ks4 --verbose

# Systematic ingestion (all combinations, 17-24 hours)
pnpm ingest:all
pnpm ingest:progress
```

### Elasticsearch

```bash
# Kibana
open https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud

# Reset indexes (destructive)
npx tsx src/lib/elasticsearch/setup/cli.ts reset
```

### Development

```bash
# Enable Redis caching
pnpm redis:up
SDK_CACHE_ENABLED=true pnpm es:ingest-live --subject maths --dry-run
```

---

## Getting Help

### For Implementation Questions

1. Review `maths-ks4-implementation-plan.md` for backend/search phase details
2. Review `search-ui-plan.md` for frontend implementation
3. Check `.agent/prompts/semantic-search/semantic-search.prompt.md` for entry point
4. Re-read foundation documents for principles
5. Review relevant ADRs in `docs/architecture/architectural-decisions/`

### For Architecture Questions

1. Check existing ADRs (067-074 currently)
2. Review foundation documents
3. Consult `reference-es-serverless-feature-matrix.md` for feature decisions

### For Fresh Chat Sessions

1. Start with `.agent/prompts/semantic-search/semantic-search.prompt.md`
2. It contains ALL context needed to continue work
3. Points to this README and implementation plans

---

## Archive Policy

Documents are archived when:

- **Consolidated**: Multiple plans merged into one
- **Superseded**: Newer plan replaces older one
- **Completed**: Work finished and documented in ADRs

Archive location:

- **`.agent/prompts/semantic-search/archive/`** - All archived prompts and completed phase guides

Current archived files:

- `phase-1a-complete.md` - Phase 1A infrastructure TDD examples and implementation guide
- `curriculum-vocabulary-checkpoint-RESOLVED.md` - Resolved checkpoint from Phase 1A
- `fix-missing-indices-COMPLETE.md` - Phase 1D implementation prompt (completed 2025-12-09)
- `fix-missing-indices-plan-COMPLETE.md` - Phase 1D detailed plan (completed 2025-12-09)

Archived documents are kept for historical reference but not used for active work.

---

## Document Maintenance

### When to Update

- **After each phase completes**: Update status, mark TODOs complete
- **When plans change**: Archive old version, create new with git commit reference
- **After ADR creation**: Link ADR in relevant plan sections
- **After docs creation**: Add to references section

### Version Control

- Use git commit hashes, not dates/version numbers in document headers
- Archive old documents with descriptive directory names (superseded-YYYY-MM)
- Keep one clear entry point (semantic-search.prompt.md)
- Keep one main plan (maths-ks4-implementation-plan.md)

---

**Ready to start? Read `.agent/prompts/semantic-search/semantic-search.prompt.md` next.**

---

**End of README**
