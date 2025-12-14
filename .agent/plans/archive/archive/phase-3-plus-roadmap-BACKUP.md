# Phase 3+: Future Roadmap

**Status**: 📋 PLANNED  
**Last Updated**: 2025-12-11 (Added Multi-Index Search Generality)

---

## Overview

These phases add advanced features **only after** Phase 1/2 establish a solid baseline. Each phase should be validated before adding complexity.

**Phase 1 & 2 Complete**: Two-way hybrid (BM25 + ELSER) confirmed optimal. E5 dense vectors and reranking evaluated but provide no benefit. See `.agent/research/elasticsearch/hybrid-search-reranking-evaluation.md`.

**Key Gap Identified**: All Phase 1/2 work focused on lesson search. Teachers also need unit search, combined search, and result type awareness. This is addressed in Phase 3a (Priority 0).

### Vision: Curriculum Resource Discovery

Teachers don't just want to find lessons - they want to discover **curriculum resources**:

- Lessons (individual teaching sessions)
- Units (themed lesson collections)
- Curricula/Programmes (year-long pathways)
- Worksheets & downloadable resources
- Quizzes & assessments
- Transcripts (searchable video content)

This roadmap progressively builds toward comprehensive curriculum resource discovery.

---

## Phase 3.0: Multi-Index Search Generality (1-2 days)

**Priority**: CRITICAL - Foundation for all search features

All Phase 1/2 experimentation focused exclusively on **lesson search**. Teachers need to search across multiple content types. This phase establishes the foundation for unified search.

### Current State

| Index             | Hybrid Search | Tested        | Notes                               |
| ----------------- | ------------- | ------------- | ----------------------------------- |
| `oak_lessons`     | BM25 + ELSER  | ✅ Extensive  | 314 Maths KS4 lessons               |
| `oak_unit_rollup` | BM25 + ELSER  | ❌ Not tested | `unit_semantic` exists but untested |
| `oak_units`       | BM25 only     | ❌ Not tested | No semantic field                   |
| `oak_sequences`   | BM25 + ELSER  | ❌ Not tested | `sequence_semantic` exists          |
| `oak_threads`     | BM25 + ELSER  | ❌ Not tested | `thread_semantic` exists            |

### Questions to Address

#### 1. Can ES distinguish result types?

**Answer**: Yes. Each index has distinct structure. Options:

- **`_index` field**: Every ES hit includes `_index` in response - tells you which index the result came from
- **Explicit `doc_type` field**: Add `doc_type: 'lesson' | 'unit' | 'sequence'` to each document
- **Field presence**: Lessons have `lesson_slug`, units have `unit_slug`, etc.

**Recommendation**: Use `_index` (already available) + add explicit `doc_type` field for clarity.

#### 2. Can we filter to only lessons or only units?

**Answer**: Yes. Multiple approaches:

- **Separate endpoints**: Current approach - `/api/search` handles lessons, separate endpoint for units
- **Index targeting**: Query specific index: `POST /oak_lessons/_search` vs `POST /oak_units/_search`
- **Multi-index with filter**: `POST /oak_lessons,oak_units/_search` with `doc_type` filter in query

**Recommendation**: Support both separate endpoints (simple) AND unified endpoint with type filter (flexible).

#### 3. Can we search lessons within a specified unit?

**Answer**: Yes. Lessons already have `unit_ids` field (array of unit slugs).

```json
{
  "query": {
    "bool": {
      "must": [{ "multi_match": { "query": "quadratic equations" } }],
      "filter": [{ "term": { "unit_ids": "solving-quadratics-higher" } }]
    }
  }
}
```

**Note**: This works with RRF by adding filter to each retriever.

#### 4. Is unit search using hybrid?

**Current state**: `oak_unit_rollup` has `unit_semantic` field with `copy_to` from title + rollup.
**Unknown**: Whether the unit search endpoint actually uses RRF with ELSER.
**Action needed**: Audit and test unit search implementation.

### Implementation Tasks

| Task                                 | Description                                                                                   | Effort | Priority     |
| ------------------------------------ | --------------------------------------------------------------------------------------------- | ------ | ------------ |
| **Verify unit hybrid search**        | Confirm `runUnitsSearch` uses RRF with ELSER (BM25 + ELSER)                                   | Low    | **CRITICAL** |
| **Test unit hybrid search**          | Create ground truth and smoke tests for units                                                 | Medium | **HIGH**     |
| **Experiment with unit reranking**   | Test reranking with `rollup_text` (~300 chars/lesson) - field already exists with good length | Low    | **HIGH**     |
| **Add `doc_type` field**             | Add to all index schemas via field definitions                                                | Low    | Medium       |
| **Add unit filter to lesson search** | Allow `?unit=slug` parameter                                                                  | Low    | Medium       |
| **Unified search endpoint**          | Single endpoint returning mixed results with type                                             | Medium | Medium       |

**Note**: Lesson reranking deferred to upstream API (needs `rerank_summary` field). Unit reranking is feasible NOW because `rollup_text` already has appropriate length (~300 chars/lesson).

### Success Criteria

- [ ] Unit search confirmed using hybrid (BM25 + ELSER)
- [ ] `doc_type` field added to all indexes
- [ ] Lesson search supports unit filter
- [ ] Unit search has ground truth and metrics
- [ ] Decision on unified vs separate endpoints documented

---

## Phase 3a: Feature Parity Quick Wins (1-2 days)

**Priority**: HIGH - Immediate value with low effort

These enhancements address gaps identified in the [Feature Parity Analysis](../../research/feature-parity-analysis.md) and can be implemented immediately using available Open API data.

### Task 1: OWA Alias System Import (Manual, One-Time)

Import the rich alias system from OWA's `oakCurriculumData.ts` into our synonym system.

**Source**: `reference/Oak-Web-Application/src/context/Search/suggestions/oakCurriculumData.ts`

**Target**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`

**OWA Aliases Include**:

```typescript
// Subject aliases
{ slug: 'maths', aliases: ['mathematics', 'math', 'numeracy'] }
{ slug: 'english', aliases: ['literacy', 'ela', 'english language'] }
{ slug: 'science', aliases: ['stem'] }

// Key stage aliases with year group mappings
{ slug: 'ks1', aliases: ['key stage 1', 'keystage 1', 'y1', 'y2', 'year 1', 'year 2'] }
{ slug: 'ks2', aliases: ['key stage 2', 'keystage 2', 'y3', 'y4', 'y5', 'y6'] }
{ slug: 'ks3', aliases: ['key stage 3', 'keystage 3', 'y7', 'y8', 'y9'] }
{ slug: 'ks4', aliases: ['key stage 4', 'keystage 4', 'y10', 'y11', 'gcse'] }

// Exam board aliases
{ slug: 'aqa', aliases: ['aqa exam board'] }
{ slug: 'edexcel', aliases: ['edexcel exam board', 'pearson'] }
{ slug: 'ocr', aliases: ['ocr exam board'] }
```

**Implementation**:

1. Extract aliases from `oakCurriculumData.ts`
2. Merge with existing synonyms in SDK
3. Ensure no duplicates or conflicts
4. Update synonym generation script if needed
5. Run `pnpm type-gen` to regenerate

**Benefit**: Enables direct PF (Programme Factor) matching from search queries, e.g., "y5 maths" → `keyStage: ks2, subject: maths`

### Task 2: Add `pupilLessonOutcome` to Lesson Index

**Source**: Open API `/lessons/{lesson}/summary` → `pupilLessonOutcome`

**Purpose**: Search result snippets and highlighting (production uses this for result display)

**Implementation**:

- Add field to lesson document schema (`field-definitions/curriculum.ts`)
- Update `document-transforms.ts` to extract from lesson summary
- Consider boosting in BM25 query (production boosts 3x)

**Impact**: HIGH - Key UX improvement for search results

### Task 3: Add Display Title Fields

Add human-readable title fields that production uses for UI display:

| Field           | Source                      | Purpose                           |
| --------------- | --------------------------- | --------------------------------- |
| `subjectTitle`  | `/lessons/{lesson}/summary` | Display "Mathematics" not "maths" |
| `keyStageTitle` | `/lessons/{lesson}/summary` | Display "Key Stage 2" not "ks2"   |

**Benefit**: Eliminates lookup overhead in consuming applications

### Task 4: Add Unit Enrichment Fields

From `/units/{unit}/summary`:

| Field                          | Purpose                          |
| ------------------------------ | -------------------------------- |
| `description`                  | Unit search snippets             |
| `whyThisWhyNow`                | Pedagogical context for teachers |
| `categories[]`                 | Additional filtering dimension   |
| `priorKnowledgeRequirements[]` | Prerequisite discovery           |
| `nationalCurriculumContent[]`  | NC alignment search              |

### Success Criteria

- [ ] OWA aliases merged into synonym system
- [ ] `pupilLessonOutcome` indexed and queryable
- [ ] Title fields added to lesson documents
- [ ] Unit description fields indexed
- [ ] ADR documenting field additions
- [ ] All quality gates pass

---

## Phase 3b: Query Enhancement (1-2 days)

### Production Query Patterns Worth Evaluating

Based on analysis of `constructElasticQuery.ts`:

1. **Phrase Matching Priority**
   - Production: `title^6`, `pupilLessonOutcome^3` for phrase matches
   - Consider: Add phrase boost to our BM25 component

2. **Fuzzy Configuration**
   - Production: `fuzziness: "AUTO:4,7"`, `prefix_length: 1`
   - Our current: `fuzziness: "AUTO"` (less precise)
   - Consider: Adopt production's tighter fuzzy settings

3. **`copy_to` Aggregated Field Pattern**
   - Production uses `all_fields` via `copy_to` for fuzzy matching
   - Consider: Evaluate if this improves recall without hurting precision

### OWA Compatibility Layer

For future OWA integration, prepare response mappings:

```typescript
// Response field mappings
{
  // Our field → OWA expected field
  lesson_title: 'title',
  key_stage_slug: 'keyStageSlug',
  // Derived fields
  keyStageShortCode: deriveFromKeyStageSlug(key_stage_slug), // 'KS2'
}
```

### Success Criteria

- [ ] Phrase matching boost evaluated (with A/B metrics)
- [ ] Fuzzy config comparison documented
- [ ] OWA field mapping documented
- [ ] ADRs for any query changes

---

## Phase 3c: Relevance Enhancement (2-3 days)

_Previously Phase 3 - renumbered to accommodate feature parity work_

### Phase 2 Learnings Applied

Reranking was extensively evaluated in Phase 2 with these findings:

| Configuration               | Result             | Lesson                                |
| --------------------------- | ------------------ | ------------------------------------- |
| Rerank on `transcript_text` | 22+ second latency | Field too long for cross-encoder      |
| Rerank on `lesson_title`    | NDCG dropped 3%    | Field too short for semantic signal   |
| Combined field needed       | Not tested         | Would require new `rerank_text` field |

**Conclusion**: Reranking is NOT recommended for lessons without significant field redesign.

**Unit reranking opportunity**: `rollup_text` (~300 chars/lesson) may be suitable. Worth testing in Phase 3.0.

### Features

1. ~~**Elastic Native ReRank**~~ → Defer unless combined field added
   - Phase 2 showed reranking hurts quality on current fields
   - Reconsider only if `rerank_text` field added

2. **Filtered kNN** → Defer (E5 not beneficial)
   - Phase 2 showed E5 dense vectors provide no benefit
   - No value in optimizing kNN if not using dense vectors

3. **Semantic Query Rules** → Keep
   - Pattern-based query rewriting
   - Example: "pythagoras" → add tier:higher filter
   - **Enhanced**: Integrate OWA alias patterns for direct PF matching

### Success Criteria

- [x] ReRank evaluated (Phase 2 - not beneficial for lessons)
- [x] Dense vectors evaluated (Phase 2 - not beneficial)
- [ ] Unit reranking with `rollup_text` evaluated
- [ ] 5+ semantic query rules defined
- [ ] OWA alias patterns integrated
- [ ] ADRs written

---

## Phase 4: Entity Extraction & Graph (3-4 days)

### Features

1. **NER Models** (Hugging Face via ES Inference API)
   - Extract curriculum entities from transcripts
   - Entity types: CONCEPT, TOPIC, SKILL

2. **Graph API Discovery**
   - Find co-occurring concepts
   - Build concept relationship graph

3. **Enrich Processor**
   - Join reference data at ingest time
   - **Enhanced**: Use for title field enrichment (subjectTitle, keyStageTitle from reference data)

### Success Criteria

- [ ] NER extracting entities from >80% lessons
- [ ] Graph API discovering >20 relationships
- [ ] ADRs written

---

## Phase 5: Reference Indices & Threads (2-3 days)

### New Indices

| Index                      | Purpose                        | Feature Parity Alignment      |
| -------------------------- | ------------------------------ | ----------------------------- |
| `oak_ref_subjects`         | Subject metadata               | Solves `subjectTitle` lookup  |
| `oak_ref_key_stages`       | Key stage metadata             | Solves `keyStageTitle` lookup |
| `oak_curriculum_glossary`  | Keywords with definitions      | Lesson keyword definitions    |
| `oak_curriculum_standards` | National curriculum statements | NC alignment search           |

### Features

- Thread-based navigation
- Prior knowledge requirements indexing
- National curriculum content search
- **Enhanced**: OWA compatibility layer for response formatting

### Success Criteria

- [ ] Reference indices created
- [ ] Thread filtering working
- [ ] Standards-aligned search enabled
- [ ] OWA-compatible response format documented

---

## Phase 6: RAG Infrastructure (4-5 days)

### Features

1. **ES Playground** - Low-code RAG prototyping
2. **`semantic_text` Field** - Auto-chunking transcripts
3. **LLM Chat Completion** - Elastic Native LLM integration
   - **Reference**: OWA's `callModel.ts` uses LLM for filter suggestions
   - Consider: Curriculum-aware LLM integration
4. **Ontology Grounding** - Domain knowledge enhancement

### Success Criteria

- [ ] Chunked transcripts indexed
- [ ] RAG endpoint implemented
- [ ] Ontology index created

---

## Phase 7: Knowledge Graph (5-6 days)

### Features

1. **Triple Store** (`oak_curriculum_graph`)
   - Subject-predicate-object triples
   - Explicit and inferred relationships

2. **Entity Resolution**
   - Deduplicate entities across lessons
   - Canonical entity IDs

3. **Multi-Hop Reasoning**
   - Find learning pathways
   - Prerequisite chains
   - **Enhanced**: Could partially address pathway navigation without API changes

### Success Criteria

- [ ] Triple store populated
- [ ] Entity resolution >90% precision
- [ ] Multi-hop queries working

---

## Phase 8: Advanced Features (3-4 days)

### Features

1. **Learning to Rank (LTR) Foundations**
   - Click-through data collection
   - Feature extraction for future model training

2. **Multi-Vector Fields**
   - Title + summary + key points as separate vectors
   - Aspect-based retrieval

3. **Runtime Fields**
   - Computed fields at query time
   - Custom relevance scoring
   - **Enhanced**: Derive `keyStageShortCode` from `keyStageSlug`

### Success Criteria

- [ ] Click tracking implemented
- [ ] Multi-vector fields tested
- [ ] Runtime field patterns documented

---

## Phase 9: Broader Resource Types (3-4 days)

**NEW PHASE**: Extend beyond lessons to full curriculum resource discovery.

### Resource Types to Index

| Resource Type   | Source                     | Search Use Cases                              |
| --------------- | -------------------------- | --------------------------------------------- |
| **Units**       | Already indexed            | "Find units on fractions"                     |
| **Sequences**   | `/sequences`               | "Browse Year 7 Science curriculum"            |
| **Worksheets**  | `/lessons/{lesson}/assets` | "Find downloadable worksheets"                |
| **Quizzes**     | `/lessons/{lesson}/quiz`   | "Find assessment questions on photosynthesis" |
| **Transcripts** | Already indexed            | Deep content search                           |

### Features

1. **Unified Search Endpoint**
   - Search across all resource types
   - Faceted filtering by resource type

2. **Asset Discovery**
   - Index downloadable resources (worksheets, slides)
   - Filter by resource type (PDF, PPTX, video)

3. **Quiz Content Search**
   - Index quiz questions and answers
   - Find assessments by topic

### Success Criteria

- [ ] Sequence search working
- [ ] Asset discovery indexed
- [ ] Quiz content searchable
- [ ] Unified search endpoint implemented

---

## Features Requiring Upstream API Changes

These features **cannot be implemented** without changes to the Open API. See [Upstream API Wishlist](../external/upstream-api-metadata-wishlist.md) for full details.

### HIGH PRIORITY - Blocking Key Features

| Feature                          | Missing Data           | Impact                                    | Wishlist Item            |
| -------------------------------- | ---------------------- | ----------------------------------------- | ------------------------ |
| **"NEW" content badges**         | `cohort` field         | Cannot show promotional badges            | -                        |
| **Legacy curriculum filtering**  | `isLegacy` field       | Cannot filter 2020-2023 content           | -                        |
| **Multi-pathway search results** | `pathways[]` array     | Cannot show tier/examboard variants       | #5: Programme Variants   |
| **Exact OWA URL generation**     | `programmeSlug`        | Must generate URLs differently            | #6: Resource Identifiers |
| **Programme-based filtering**    | Full programme context | Cannot filter by tier/examboard in search | #5: Programme Variants   |

### MEDIUM PRIORITY - Would Improve Experience

| Feature                         | Missing Data         | Impact                                | Wishlist Item            |
| ------------------------------- | -------------------- | ------------------------------------- | ------------------------ |
| **Year group display**          | `yearTitle`          | Must derive "Year 3" from year number | -                        |
| **Tier display**                | `tierTitle`          | Cannot show "Foundation"/"Higher"     | #5: Programme Variants   |
| **Thread progression metadata** | Enhanced thread data | Limited progression tracking          | #10: Thread Enhancements |
| **Resource timestamps**         | `lastUpdated`        | Cannot efficiently cache/invalidate   | #15: Resource Timestamps |

### Dependencies on API Team Work

```text
Our Phase 3+                API Team Work
─────────────────────────────────────────────────────
Phase 5 (Reference)    ←──  Ontology endpoint (#3)
Phase 7 (Knowledge)    ←──  Thread enhancements (#10)
Programme filtering    ←──  Programme variants (#5)
URL generation         ←──  Resource identifiers (#6)
Efficient caching      ←──  Resource timestamps (#15)
```

---

## Timeline Estimate

| Phase   | Focus                         | Duration | Dependencies                            |
| ------- | ----------------------------- | -------- | --------------------------------------- |
| **3.0** | Multi-Index Search Generality | 1-2 days | None (CRITICAL)                         |
| **3a**  | Feature Parity Quick Wins     | 1-2 days | Phase 3.0                               |
| **3b**  | Query Enhancement             | 1-2 days | Phase 3a                                |
| **3c**  | Relevance Enhancement         | 1-2 days | Phase 3b (reduced - reranking deferred) |
| 4       | Entity Extraction & Graph     | 3-4 days | Phase 3c                                |
| 5       | Reference Indices & Threads   | 2-3 days | Phase 4                                 |
| 6       | RAG Infrastructure            | 4-5 days | Phase 5                                 |
| 7       | Knowledge Graph               | 5-6 days | Phase 6                                 |
| 8       | Advanced Features             | 3-4 days | Phase 7                                 |
| **9**   | Broader Resource Types        | 3-4 days | Phase 8                                 |

**Total**: ~5-6 weeks (aggressive: 4 weeks with parallel work)

---

## Priority Recommendation

Based on Phase 1/2 learnings and Feature Parity Analysis, recommended ordering:

### Highest Impact First

1. **Phase 3.0: Multi-Index Search Generality** ← START HERE (CRITICAL)
   - All Phase 1/2 work was lesson-only
   - Teachers need unit search, combined search, scoped search
   - Foundation for all other search features
   - Unblocks unit reranking evaluation

2. **Phase 3a: Feature Parity Quick Wins**
   - OWA aliases immediately improve query understanding
   - `pupilLessonOutcome` improves search snippets
   - Title fields improve UI without lookups
   - Fast to implement, high value

3. **Phase 3b: Query Enhancement**
   - Evaluate production patterns
   - Prepare OWA compatibility

4. **Phase 5: Reference Indices & Threads** ← CONSIDER MOVING UP
   - Strong alignment with feature parity
   - Solves title field lookup problem properly
   - Enables thread navigation

5. Remaining phases in original order...

### Rationale

Phase 2 conclusively showed that **two-way hybrid (BM25 + ELSER) is optimal** for lesson search. Dense vectors and reranking don't help. The gap is not in search quality algorithms but in **search scope** - we only search lessons, but teachers need to search units, programmes, and combined results.

### What NOT to Prioritize

Based on Phase 2 findings, these are low priority or deferred:

| Item             | Reason                                |
| ---------------- | ------------------------------------- |
| E5 dense vectors | Proven ineffective                    |
| Three-way hybrid | Adds complexity with no benefit       |
| Lesson reranking | Requires new field, uncertain benefit |
| kNN optimization | Not using dense vectors               |

---

## What We Have That Production Doesn't

| Feature                    | Value                                 | Status                      |
| -------------------------- | ------------------------------------- | --------------------------- |
| **ELSER sparse vectors**   | Semantic understanding                | ✅ Validated (Phase 1-2)    |
| ~~**E5 dense vectors**~~   | ~~Neural embeddings~~                 | ❌ Not beneficial (Phase 2) |
| **RRF hybrid search**      | Superior result fusion                | ✅ Optimal config found     |
| **Full transcripts**       | 45+ min searchable content per lesson | ✅ Indexed                  |
| **Query-time synonyms**    | Domain-specific expansion             | ✅ Operational              |
| **Completion suggestions** | Search-as-you-type                    | ✅ Implemented              |
| **Curriculum ontology**    | Structured domain knowledge           | ✅ In SDK                   |

### Phase 2 Conclusions (2025-12-11)

- **E5 dense vectors**: Evaluated, provide no benefit over ELSER
- **Reranking**: Evaluated, hurts quality on current fields
- **Two-way hybrid (BM25 + ELSER)**: Confirmed optimal
- **Full findings**: `.agent/research/elasticsearch/hybrid-search-reranking-evaluation.md`

---

## Architectural Technical Debt

### Error Handling & Retry Logic → SDK

**Current state**: Error handling and retry logic for upstream API calls (500 errors, transient failures) is implemented in the semantic search app (`oak-adapter-cached.ts`, `ingestion-error-collector.ts`).

**Target state**: Move to SDK with clear separation of concerns:

| Responsibility                    | Location | Example                                         |
| --------------------------------- | -------- | ----------------------------------------------- |
| Retry logic (exponential backoff) | **SDK**  | 3 retries, 1s/2s/4s delays                      |
| Error normalisation               | **SDK**  | Transform 500/503/timeout → `TransientApiError` |
| Circuit breaker (if needed)       | **SDK**  | Prevent cascade failures                        |
| **What to do with errors**        | **App**  | Log, skip, fail, collect for summary            |
| **Context enrichment**            | **App**  | Add keyStage/subject/lessonSlug to logs         |
| **Reporting/summary**             | **App**  | Display error summary at end of ingestion       |

**Rationale**: All SDK consumers benefit from robust API interaction. Apps decide policy (fail-fast vs graceful degradation).

**When**: Phase 3a or as separate SDK improvement sprint.

---

## Guiding Principles

1. **Validate before adding complexity**
2. **Measure impact of each phase**
3. **Document decisions in ADRs**
4. **All quality gates must pass**
5. **First Question**: Could it be simpler?
6. **NEW**: Address practical gaps before advanced features
7. **NEW**: Teachers want curriculum resources, not just lessons
8. **NEW**: SDK handles mechanics, apps handle policy

---

## Related Documents

- [Feature Parity Analysis](../../research/feature-parity-analysis.md)
- [Roadmap Feature Parity Alignment](../../research/roadmap-feature-parity-alignment.md)
- [Upstream API Wishlist](../external/upstream-api-metadata-wishlist.md)
- [Semantic Search Prompt](../../prompts/semantic-search/semantic-search.prompt.md)
