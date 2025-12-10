# Phase 3+: Future Roadmap

**Status**: 📋 PLANNED  
**Last Updated**: 2025-12-10 (Enhanced with Feature Parity Analysis)

---

## Overview

These phases add advanced features **only after** Phase 1/2 establish a solid baseline. Each phase should be validated before adding complexity.

**Important**: Phases 1 and 2 are frozen - they form part of a statistical comparison that changes would invalidate. All enhancements begin at Phase 3.

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

### Features

1. **Elastic Native ReRank** (`.rerank-v1-elasticsearch`)
   - Cross-encoder model for top-K reranking
   - Expected MRR improvement: +10-25%

2. **Filtered kNN**
   - Apply filters during vector search (not post-filter)
   - 50% faster for constrained searches

3. **Semantic Query Rules**
   - Pattern-based query rewriting
   - Example: "pythagoras" → add tier:higher filter
   - **Enhanced**: Integrate OWA alias patterns for direct PF matching

### Success Criteria

- [ ] ReRank integrated and tested
- [ ] Filtered kNN with benchmarks
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

```
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

| Phase  | Focus                       | Duration | Dependencies |
| ------ | --------------------------- | -------- | ------------ |
| **3a** | Feature Parity Quick Wins   | 1-2 days | None         |
| **3b** | Query Enhancement           | 1-2 days | Phase 3a     |
| **3c** | Relevance Enhancement       | 2-3 days | Phase 3b     |
| 4      | Entity Extraction & Graph   | 3-4 days | Phase 3c     |
| 5      | Reference Indices & Threads | 2-3 days | Phase 4      |
| 6      | RAG Infrastructure          | 4-5 days | Phase 5      |
| 7      | Knowledge Graph             | 5-6 days | Phase 6      |
| 8      | Advanced Features           | 3-4 days | Phase 7      |
| **9**  | Broader Resource Types      | 3-4 days | Phase 8      |

**Total**: ~5-6 weeks (aggressive: 4 weeks with parallel work)

---

## Priority Recommendation

Based on Feature Parity Analysis, recommended ordering for maximum practical value:

### Highest Impact First

1. **Phase 3a: Feature Parity Quick Wins** ← START HERE
   - OWA aliases immediately improve query understanding
   - `pupilLessonOutcome` improves search snippets
   - Title fields improve UI without lookups
   - Fast to implement, high value

2. **Phase 3b: Query Enhancement**
   - Evaluate production patterns
   - Prepare OWA compatibility

3. **Phase 5: Reference Indices & Threads** ← CONSIDER MOVING UP
   - Strong alignment with feature parity
   - Solves title field lookup problem properly
   - Enables thread navigation

4. Remaining phases in original order...

### Rationale

The feature parity analysis shows we have **architectural advantages** (ELSER, RRF, transcripts) but lack some **basic fields** that production uses for UX. Addressing these gaps first provides immediate value while the more advanced phases mature.

---

## What We Have That Production Doesn't

| Feature                    | Value                                 | Phase        |
| -------------------------- | ------------------------------------- | ------------ |
| **ELSER sparse vectors**   | Semantic understanding                | Phase 1-2 ✅ |
| **E5 dense vectors**       | Neural embeddings                     | Phase 2 ✅   |
| **RRF hybrid search**      | Superior result fusion                | Phase 1-2 ✅ |
| **Full transcripts**       | 45+ min searchable content per lesson | Phase 1 ✅   |
| **Query-time synonyms**    | Domain-specific expansion             | Current ✅   |
| **Completion suggestions** | Search-as-you-type                    | Current ✅   |
| **Curriculum ontology**    | Structured domain knowledge           | SDK ✅       |

---

## Guiding Principles

1. **Validate before adding complexity**
2. **Measure impact of each phase**
3. **Document decisions in ADRs**
4. **All quality gates must pass**
5. **First Question**: Could it be simpler?
6. **NEW**: Address practical gaps before advanced features
7. **NEW**: Teachers want curriculum resources, not just lessons

---

## Related Documents

- [Feature Parity Analysis](../../research/feature-parity-analysis.md)
- [Roadmap Feature Parity Alignment](../../research/roadmap-feature-parity-alignment.md)
- [Upstream API Wishlist](../external/upstream-api-metadata-wishlist.md)
- [Semantic Search Prompt](../../prompts/semantic-search/semantic-search.prompt.md)
