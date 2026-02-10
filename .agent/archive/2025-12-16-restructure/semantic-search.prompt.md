# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 1 & 2 Complete | **Phase 3.0 ✅ VERIFIED** | **Phase 3a ✅ IMPLEMENTED** | **Phase 3b ⚠️ NEEDS REWORK** | Phase 4 PLANNED (SDK + CLI)  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Last Updated**: 2025-12-16

---

## 📋 Current State

**Parts 3.0 and 3a are COMPLETE. Part 3b needs rework** to implement four-retriever architecture correctly.

### Part 3.0 (Verification) ✅ VERIFIED
- ✅ Hybrid superiority experiment: Lessons hybrid > BM25/ELSER; Units ELSER slightly better MRR but hybrid better NDCG
- ✅ Lesson-only search verified
- ✅ Unit-only search verified
- ✅ Joint search (both types) verified
- ✅ Lesson filter by unit verified
- ✅ Redis cache TTL updated to 14 days with ±12 hour jitter (ADR-079)

### Part 3a (Feature Parity) ✅ IMPLEMENTED
- ✅ OWA aliases imported (subjects, key stages, exam boards)
- ✅ `pupilLessonOutcome` field added to lesson index
- ✅ Display title fields (`subjectTitle`, `keyStageTitle`) added
- ✅ Unit enrichment fields added (`description`, `whyThisWhyNow`, `categories`, etc.)
- ✅ **KS4 Metadata Denormalisation** implemented:
  - `ks4-context-builder.ts` traverses sequences and builds `UnitContextMap`
  - KS4 arrays indexed: `tiers[]`, `examBoards[]`, `examSubjects[]`, `ks4Options[]` + titles
  - Smoke tests for KS4 filtering created

### Part 3b (Semantic Summaries) ⚠️ NEEDS REWORK
- ✅ Dense vector code removed (ADR-075)
- ✅ Semantic summary generator templates exist
- ⚠️ **ISSUE**: `unit_semantic` was incorrectly replaced with summary instead of adding new field
- ⚠️ **ISSUE**: Field naming doesn't follow consistent nomenclature
- 🔲 Four-retriever architecture not yet implemented

### Part 3c (Four-Retriever Architecture) 🔲 NEW
- 🔲 Implement consistent field nomenclature (`<entity>_content|structure[_semantic]`)
- 🔲 Add `lesson_structure` field for BM25 on lesson summaries
- 🔲 Add `unit_structure` field for BM25 on unit summaries
- 🔲 Restore `unit_content_semantic` to use rollup content (not summary)
- 🔲 Add `unit_structure_semantic` for ELSER on unit summaries
- 🔲 Update query builders to use four retrievers + RRF
- 🔲 Verify KS4 filtering works with re-indexed data

### ⚠️ VERIFICATION NEEDED
1. Re-index with fresh data after Part 3c implementation
2. Run KS4 filtering smoke tests to prove filtering works
3. Run search quality benchmarks to measure MRR/NDCG with four retrievers

---

## ⚠️ Fresh Chat First Steps (MANDATORY)

**Significant code changes have occurred** since the last semantic search session. Before any feature work:

### 1. Run Full Quality Gates (from repo root)

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

**All gates must pass before proceeding.** Resolve any issues gate-by-gate.

### 2. ALWAYS Re-Index Fresh (CRITICAL)

**⚠️ Never run search quality smoke tests against stale indices.** The indices may contain data from a previous session with different schema, transforms, or field mappings. Results are meaningless without fresh data.

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup                                           # Ensure mappings are current
pnpm es:ingest-live -- --subject maths --keystage ks4   # ~5-10 minutes
pnpm es:status                                          # Verify document counts
```

**Expected counts**: ~314 lessons, ~36 units for Maths KS4.

### 3. Understand Smoke Test Architecture

There are **two categories** of smoke tests:

| Category        | Examples                                               | Requirements                      |
| --------------- | ------------------------------------------------------ | --------------------------------- |
| **API-based**   | `scope-verification`, `search-quality`, `unit-search-*` | Next.js dev server + fresh ES     |
| **Direct ES**   | `hybrid-superiority`                                   | ES credentials in `.env.local`    |

**API-based tests**: Hit `/api/search` endpoint → full stack validation.
**Direct ES tests**: Talk to Elasticsearch directly → raw query validation.

Both require **fresh indices** to produce meaningful results. Never skip re-indexing.

### 4. Run Verification Tests in Correct Order

```bash
# Direct ES tests (no server needed)
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority

# API-based tests (need server running in separate terminal)
# Terminal 1: pnpm dev
# Terminal 2:
pnpm vitest run -c vitest.smoke.config.ts scope-verification
```

### 5. Then Proceed with Phase 3 Work

Once quality gates pass, indices are fresh, and verification tests pass, continue with Part 3a/3b work.

---

## Strategic Goal

Create a production-ready demo proving Elasticsearch Serverless as the **definitive platform** for intelligent curriculum search, using Maths KS4 as a vertical slice that scales to the full Oak curriculum.

**Phase 3 Goal**: Prove multi-index search infrastructure works correctly with four-retriever hybrid architecture:

1. ✅ Prove BM25 + ELSER hybrid is superior to either alone
2. ✅ Prove lesson-only, unit-only, and joint search all work
3. ✅ Prove lesson search can filter by unit
4. ✅ Add feature parity fields (including KS4 metadata)
5. 🔲 Implement four-retriever architecture (BM25 + ELSER on content + structure)
6. 🔲 Prove KS4 filtering works after re-indexing

**Next phase (Phase 4)**: Extract the search capability as an **SDK + first-class local CLI**, so it can be consumed by the **Express MCP server** (NL policy stays in MCP via comprehensive tool examples). See `.agent/plans/semantic-search/phase-4-search-sdk-and-cli.md`.

**MCP tool creation** is coordinated separately in `.agent/plans/sdk-and-mcp-enhancements/` (Phase 4 prepares the SDK surface the MCP tool will consume).

**Why Maths KS4?** Maximum complexity (tiers, pathways, exam boards), high teacher value, complete feature coverage, manageable scope (~10 minutes to ingest).

**Success**: MRR > 0.70, NDCG@10 > 0.75, KS4 filtering proven, impressive stakeholder demo, scalable patterns.

---

## Read First

**Foundation documents** (MUST read before any work):

1. `.agent/directives/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives/schema-first-execution.md` - All types from field definitions
3. `.agent/directives/testing-strategy.md` - Test types and TDD approach

**Source of truth** (for all types and available data):

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` - **The OpenAPI schema**
- `.agent/plans/external/upstream-api-metadata-wishlist.md` - Fields to request from upstream API

**Requirements & context** (strategic goals, risks, costs, demos):

- `.agent/plans/semantic-search/requirements.md` - **Read this for business context**

**Navigation hub**: `.agent/plans/semantic-search/README.md`

---

## Type Discipline Status

Quality gates are now **passing**. Type discipline restoration work is ongoing but not blocking semantic search.

**Plan**: `.agent/plans/quality-and-maintainability/type-discipline-restoration-plan.md`

**Current state**: 2 lint errors remain; test isolation enabled (`isolate: true` + `pool: 'forks'`).

---

## Elasticsearch Documentation

Key ES documentation for this project:

| Topic                   | URL                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| **Hybrid Search (RRF)** | https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html                   |
| **Semantic Search**     | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html       |
| **ELSER**               | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html |
| **Semantic Reranking**  | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html    |
| **Retriever API**       | https://www.elastic.co/guide/en/elasticsearch/reference/current/retriever.html             |

---

## Current State

### Completed Work

| Item                                              | Status      |
| ------------------------------------------------- | ----------- |
| Two-way hybrid code written (BM25 + ELSER RRF)    | ✅ Complete |
| Lesson search: MRR 0.908, 40 ground truth queries | ✅ Complete |
| Unit search: MRR 0.915, 43 ground truth queries   | ✅ Complete |
| Dense vector code removed (ADR-075)               | ✅ Complete |
| All quality gates passing                         | ✅ Complete |
| BM25 vs ELSER vs Hybrid experiment                | ✅ Complete |
| Part 3.0 verification (scope, doc_type, filters)  | ✅ Complete |
| Redis cache TTL 14 days + jitter (ADR-079)        | ✅ Complete |
| Part 3a: Feature Parity fields                    | ✅ Complete |
| Part 3a: KS4 Metadata Denormalisation             | ✅ Complete |
| Semantic summary generator templates              | ✅ Complete |

### Phase 3 Remaining Work

**📋 Detailed execution plan**: `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`

#### Part 3c: Four-Retriever Architecture 🔲 NEW

| Task | Priority | Status |
| ---- | -------- | ------ |
| Rename fields to consistent nomenclature | **CRITICAL** | 🔲 Pending |
| Add `lesson_structure` field (BM25 text) | **CRITICAL** | 🔲 Pending |
| Add `unit_structure` field (BM25 text) | **CRITICAL** | 🔲 Pending |
| Restore `unit_content_semantic` to rollup content | **CRITICAL** | 🔲 Pending |
| Add `unit_structure_semantic` field | **CRITICAL** | 🔲 Pending |
| Update summary templates to include ALL API fields | **HIGH** | 🔲 Pending |
| Update query builders to use four retrievers | **HIGH** | 🔲 Pending |
| Re-index with new field schema | **HIGH** | 🔲 Pending |
| Prove KS4 filtering works | **CRITICAL** | 🔲 Pending |
| Run search quality benchmarks (MRR/NDCG) | **HIGH** | 🔲 Pending |

**Field Rename Mapping**:

| Current Field | New Field | Notes |
|---------------|-----------|-------|
| `transcript_text` | `lesson_content` | Rename |
| `lesson_semantic` | `lesson_content_semantic` | Rename |
| `lesson_summary_semantic` | `lesson_structure_semantic` | Rename |
| (new) | `lesson_structure` | Add BM25 text field |
| `rollup_text` | `unit_content` | Rename |
| `unit_semantic` | `unit_content_semantic` | **RESTORE to rollup content** |
| (new) | `unit_structure` | Add BM25 text field |
| (new) | `unit_structure_semantic` | Add ELSER field |

#### KS4 Filtering Verification 🔲 CRITICAL

| Task | Status |
| ---- | ------ |
| Re-index Maths KS4 with updated schema | 🔲 Pending |
| Run `ks4-filtering.smoke.test.ts` | 🔲 Pending |
| Verify tier filtering (`tiers[]`) | 🔲 Pending |
| Verify exam board filtering (`examBoards[]`) | 🔲 Pending |
| Verify exam subject filtering (`examSubjects[]`) | 🔲 Pending |
| Verify KS4 option filtering (`ks4Options[]`) | 🔲 Pending |

**Approach**: Traverse `/sequences/{sequence}/units` endpoints, build lookup tables mapping units → tiers/examBoards, decorate indexed documents with arrays. See [ADR-080](docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md).

See `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md` for full details.

---

## Technical Architecture

### Four-Retriever Hybrid Search (BM25 + ELSER on Content + Structure)

We use Elasticsearch's Reciprocal Rank Fusion (RRF) to combine **four retrievers** for each entity type, providing both content-based and structure-based matching across lexical and semantic dimensions.

**Design rationale**: Content fields contain the actual teaching material (transcripts, lesson snippets). Structure fields contain curated metadata about what the content covers (learning objectives, curriculum alignment, pedagogical context). Both perspectives are valuable for different query types:
- Content retrievers: "Find lessons that discuss/teach X"
- Structure retrievers: "Find lessons about topic Y"

### Consistent Field Nomenclature

All entities follow the pattern: `<entity>_content|structure[_semantic]`

| Entity | Content (BM25) | Content (ELSER) | Structure (BM25) | Structure (ELSER) |
|--------|----------------|-----------------|------------------|-------------------|
| Lesson | `lesson_content` | `lesson_content_semantic` | `lesson_structure` | `lesson_structure_semantic` |
| Unit   | `unit_content` | `unit_content_semantic` | `unit_structure` | `unit_structure_semantic` |

### Lesson Fields

| Field | Content Source | Purpose |
|-------|----------------|---------|
| `lesson_content` | Full video transcript | BM25 lexical matching on teaching content |
| `lesson_content_semantic` | Full video transcript | ELSER semantic matching on teaching content |
| `lesson_structure` | Curated summary (~200 tokens) | BM25 lexical matching on pedagogical metadata |
| `lesson_structure_semantic` | Curated summary (~200 tokens) | ELSER semantic matching on pedagogical metadata |

### Unit Fields (Rollup)

| Field | Content Source | Purpose |
|-------|----------------|---------|
| `unit_content` | Aggregated lesson snippets + pedagogical data | BM25 lexical matching on teaching content |
| `unit_content_semantic` | Aggregated lesson snippets + pedagogical data | ELSER semantic matching on teaching content |
| `unit_structure` | Curated summary (~200 tokens) | BM25 lexical matching on unit overview |
| `unit_structure_semantic` | Curated summary (~200 tokens) | ELSER semantic matching on unit overview |

### RRF Query Structure

```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        { "standard": { "query": { "multi_match": { "query": "...", "fields": ["lesson_content", "lesson_title"] } } } },
        { "standard": { "query": { "multi_match": { "query": "...", "fields": ["lesson_structure"] } } } },
        { "standard": { "query": { "semantic": { "field": "lesson_content_semantic", "query": "..." } } } },
        { "standard": { "query": { "semantic": { "field": "lesson_structure_semantic", "query": "..." } } } }
      ],
      "rank_window_size": 100,
      "rank_constant": 60
    }
  }
}
```

See: <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html>

### No Reranker Required Initially

With four complementary retrievers, RRF typically does a good job of combining results. A reranker may be added later if:
- RRF produces good recall (relevant docs in top-20) but poor precision at top-3
- Quality metrics show diminishing returns from retriever-only approach

**Decision**: Build four-retriever RRF first, measure quality, then evaluate reranking if needed.

### Why ELSER Only (No Dense Vectors)

Phase 2 evaluated E5 dense vectors - **no benefit for curriculum search**:

- ELSER handles curriculum vocabulary well (quadratic, denominator, photosynthesis)
- Dense vectors added latency (+33%) without improving MRR/NDCG
- Simpler architecture with one embedding type

See: <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html>

### Structural Summary Content

Structural summaries include **all available fields** from the API, tolerating missing optional fields gracefully.

**Lesson Structure Summary** (from `/lessons/{lesson}/summary`):

```text
{lessonTitle} is a {keyStageTitle} {subjectTitle} lesson.

Key learning: {keyLearningPoints[*].keyLearningPoint}.
Keywords: {lessonKeywords[*].keyword} - {description}.
Common misconceptions: {misconceptionsAndCommonMistakes[*].misconception}.
Teacher tips: {teacherTips[*].teacherTip}.
Content guidance: {contentGuidance[*].contentGuidanceLabel}.
Pupil outcome: {pupilLessonOutcome}.
Unit context: {unitTitle} ({unitSlug}).
```

**Unit Structure Summary** (from `/units/{unit}/summary`):

```text
{unitTitle} is a {keyStageSlug} {subjectSlug} unit for {year} containing {lessonCount} lessons.

Overview: {whyThisWhyNow}.
Description: {description}.
Notes: {notes}.
Prior knowledge: {priorKnowledgeRequirements[*]}.
National curriculum: {nationalCurriculumContent[*]}.
Threads: {threads[*].title}.
Categories: {categories[*].categoryTitle}.
Lessons: {unitLessons[*].lessonTitle} ({lessonSlug}).
```

**Principle**: Include ALL fields, use `[*]` notation for arrays. The user's query perspective is unknown - they might search by misconception, by curriculum alignment, by thread, or by lesson title. Comprehensive coverage maximises match potential.

### ES Serverless Features ($0 additional cost)

| Feature | Endpoint                               | Purpose                | Status      |
| ------- | -------------------------------------- | ---------------------- | ----------- |
| BM25    | Built-in                               | Lexical search         | ✅ Used     |
| ELSER   | `.elser-2-elasticsearch`               | Sparse semantic        | ✅ Used     |
| E5      | `.multilingual-e5-small-elasticsearch` | Dense vectors          | ❌ Not used |
| ReRank  | `.rerank-v1-elasticsearch`             | Cross-encoder reranker | 📋 Planned  |
| LLM     | `.gp-llm-v2-chat_completion`           | Future RAG / summaries | 📋 Planned  |

### ADRs

| ADR                                                                                          | Title                              | Status      |
| -------------------------------------------------------------------------------------------- | ---------------------------------- | ----------- |
| [ADR-074](docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md)  | Elastic-Native-First Philosophy    | Accepted    |
| [ADR-075](docs/architecture/architectural-decisions/075-dense-vector-removal.md)             | Dense Vector Code Removal          | Accepted    |
| [ADR-076](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)    | ELSER-Only Embedding Strategy      | Accepted    |
| [ADR-077](docs/architecture/architectural-decisions/077-semantic-summary-generation.md)      | Semantic Summary Generation        | Accepted    |
| [ADR-079](docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md)             | SDK Cache TTL Jitter               | Implemented |
| [ADR-080](docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) | KS4 Metadata Denormalisation  | Accepted    |

---

## Current Metrics

### Lesson Search (314 Maths KS4 lessons)

| Metric        | Result    | Target  | Status   |
| ------------- | --------- | ------- | -------- |
| MRR           | **0.908** | > 0.70  | ✅ PASS  |
| NDCG@10       | 0.725     | > 0.75  | ⚠️ Below |
| Zero-hit rate | **0.0%**  | < 10%   | ✅ PASS  |
| p95 Latency   | 367ms     | < 300ms | ⚠️ Above |

### Unit Search (36 Maths KS4 units)

| Metric        | Result    | Target  | Status  |
| ------------- | --------- | ------- | ------- |
| MRR           | **0.915** | > 0.60  | ✅ PASS |
| NDCG@10       | **0.924** | > 0.65  | ✅ PASS |
| Zero-hit rate | **0.0%**  | < 15%   | ✅ PASS |
| p95 Latency   | **196ms** | < 300ms | ✅ PASS |

---

## Data

**Last indexed**: 2025-12-15 (Maths KS4)

| Index             | Count | Hybrid Search | Status       |
| ----------------- | ----- | ------------- | ------------ |
| `oak_lessons`     | 314   | BM25 + ELSER  | ✅ Verified  |
| `oak_unit_rollup` | 36    | BM25 + ELSER  | ✅ Verified  |
| `oak_units`       | 36    | BM25 only     | ✅ Verified  |
| `oak_threads`     | 201   | BM25 + ELSER  | ❌ Untested  |
| `oak_sequences`   | 2     | BM25 + ELSER  | ❌ Untested  |

All 36 Maths KS4 units have their lessons indexed. Redis cache refreshed with 14-day TTLs (8,109 entries).

**Note**: Hybrid superiority experiment completed. For lessons, hybrid is superior. For units, results are mixed (ELSER slightly better MRR, hybrid better NDCG@10).

---

## Embedding Strategy

### Current State (Needs Update to Four-Retriever)

| Resource | Content Field | Structure Field | Status |
| -------- | ------------- | --------------- | ------ |
| Lessons  | `lesson_semantic` (transcript) | `lesson_summary_semantic` (summary) | ⚠️ Needs rename |
| Units    | `unit_semantic` (incorrectly contains summary) | N/A | ⚠️ Needs fix |

### Target State (Four-Retriever Architecture)

| Resource | Content Field | Structure Field |
| -------- | ------------- | --------------- |
| Lessons  | `lesson_content_semantic` (transcript ~5000 tokens) | `lesson_structure_semantic` (summary ~200 tokens) |
| Units    | `unit_content_semantic` (rollup ~200-400 tokens) | `unit_structure_semantic` (summary ~200 tokens) |

### Dense Vectors: REMOVED ✅

Phase 2 evaluation showed E5 dense vectors provide **no benefit** for curriculum search:

- MRR: 0.900 (two-way) vs 0.897 (three-way) - no improvement
- Latency: 180ms (two-way) vs 240ms (three-way) - 33% worse

**Decision**: Remove all dense vector code. See [ADR-075](docs/architecture/architectural-decisions/075-dense-vector-removal.md).

✅ **Completed 2025-12-15**: All dense vector code has been removed.

### Semantic Summary Implementation

Summary generator templates exist but need updates for comprehensive field coverage:

**Implementation files**:
- `semantic-summary-generator.ts` - `generateLessonSemanticSummary()`, `generateUnitSemanticSummary()`

**Required changes**:
1. Update `generateLessonSemanticSummary()` to include ALL fields from `LessonSummaryResponseSchema`
2. Update `generateUnitSemanticSummary()` to include ALL fields from `UnitSummaryResponseSchema`
3. Include full lesson list in unit summary (title + slug for each)
4. Tolerate missing optional fields gracefully

**Future enhancement**: LLM-generated summaries via `.gp-llm-v2-chat_completion` for richer prose.

See [ADR-077](docs/architecture/architectural-decisions/077-semantic-summary-generation.md).

---

## Phase Structure

### Completed

| Phase | Name          | Status      | Description                 |
| ----- | ------------- | ----------- | --------------------------- |
| 1     | Foundation    | ✅ Complete | Lexical baseline, ELSER fix |
| 2     | Dense Vectors | ✅ Complete | E5 evaluated, no benefit    |

### Current

| Phase | Name                     | Status         | Description                        |
| ----- | ------------------------ | -------------- | ---------------------------------- |
| **3** | **Multi-Index & Fields** | 🔄 In Progress | Unit search, doc_type, OWA aliases |

### Future

| Phase | Name              | Status     | Effort   |
| ----- | ----------------- | ---------- | -------- |
| 4     | Search SDK + CLI  | 📋 Planned | 3-6 days |
| 5     | Search UI         | 📋 Planned | 3-4 days |
| 6     | Cloud Functions   | 📋 Planned | 2-3 days |
| 7     | Admin Dashboard   | 📋 Planned | 2-3 days |
| 8     | Query Enhancement | 📋 Planned | 1-2 days |
| 9     | Entity Extraction | 📋 Future  | 3-4 days |
| 10    | Reference Indices | 📋 Future  | 2-3 days |
| 11+   | AI Integration    | 📋 Future  | 15-20d   |

**Phase documents**: `.agent/plans/semantic-search/phase-{N}-*.md`

---

## Key Files

### Search Quality

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/search-quality/
│   ├── ground-truth/              # Lesson + unit ground truth
│   │   ├── units/                 # 43 unit queries
│   │   └── ...                    # 40 lesson queries
│   ├── metrics.ts                 # MRR, NDCG calculations
│   └── index.ts                   # Public exports
└── smoke-tests/
    ├── search-quality.smoke.test.ts       # Lesson benchmarks
    ├── unit-search-quality.smoke.test.ts  # Unit benchmarks
    └── unit-search-verification.smoke.test.ts
```

### RRF Query Builders

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts           # Two-way (BM25 + ELSER)
├── rrf-query-helpers.ts            # Shared helpers
├── lessons.ts                      # Lesson search
└── units.ts                        # Unit search
```

### Document Transforms

```text
apps/oak-open-curriculum-semantic-search/src/lib/indexing/
└── document-transforms.ts          # createLessonDocument(), createUnitDocument()
```

### SDK Synonyms

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── subjects.ts         # Subject name variations
├── key-stages.ts       # Key stage aliases
├── numbers.ts          # Numbers + maths terms
└── index.ts            # Barrel file
```

---

## Quality Gates

Run after every piece of work, from repo root, in order:

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

## Running Tests

### Direct ES Tests (no server needed)

These tests talk directly to Elasticsearch using credentials from `.env.local`:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority
```

### API-Based Tests (need server)

These tests hit the `/api/search` endpoint:

```bash
# Terminal 1: Start the dev server
cd apps/oak-open-curriculum-semantic-search
rm -rf .next  # Clear cache
pnpm dev

# Terminal 2: Run API-based smoke tests
pnpm vitest run -c vitest.smoke.config.ts scope-verification
pnpm vitest run -c vitest.smoke.config.ts search-quality
pnpm vitest run -c vitest.smoke.config.ts unit-search
```

## Re-Ingestion (MANDATORY before verification)

**⚠️ Always re-index before running smoke tests.** Stale indices invalidate all results.

```bash
cd apps/oak-open-curriculum-semantic-search

# Setup indices with current mappings
pnpm es:setup

# Ingest Maths KS4 fresh (~5-10 minutes)
pnpm es:ingest-live -- --subject maths --keystage ks4

# Verify document counts (expect ~314 lessons, ~36 units)
pnpm es:status
```

---

## Environment

Required in `apps/oak-open-curriculum-semantic-search/.env.local`:

```bash
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here
LOG_LEVEL=info
```

**Rate Limit**: Oak API upgraded to **10,000 requests/hour** (from 1,000).

---

## Remember

1. **TDD is mandatory** - Write tests FIRST at ALL levels (RED → GREEN → REFACTOR)
2. **Schema-first** - All types flow from field definitions via `pnpm type-gen`
3. **No type shortcuts** - No `as`, `any`, `!`, `Record<string, unknown>`
4. **No skipped tests** - Fix it or delete it
5. **Fail fast** - Clear error messages, no silent failures
6. **Delete dead code** - If unused, delete it
7. **All quality gates must pass** - No exceptions, no workarounds

---

**Ready?** Start with Phase 3: `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
