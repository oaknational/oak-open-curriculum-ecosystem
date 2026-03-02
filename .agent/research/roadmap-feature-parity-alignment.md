# Roadmap vs Feature Parity Analysis: Alignment Review

**Created**: 2025-12-10  
**Updated**: 2025-12-10 (Recommendations incorporated into roadmap)  
**Purpose**: Compare Phase 3+ roadmap against feature parity analysis findings

> **Note**: The recommendations in this document have been incorporated into the [Semantic Search Roadmap](../../plans/semantic-search/roadmap.md). This document is retained for reference.

---

## Executive Summary

The Phase 3+ roadmap is **technically ambitious and forward-looking**, but the feature parity analysis reveals several **practical gaps** that should be addressed before or alongside the advanced features. The roadmap focuses on cutting-edge capabilities (ReRank, NER, Knowledge Graphs) while missing some foundational "quick wins" that could significantly improve parity with production search.

### Key Finding

**The roadmap lacks a "Feature Parity Phase"** that addresses immediate, implementable improvements discovered in the analysis.

---

## 1. Alignment Matrix

### What the Roadmap Addresses ✅

| Feature Parity Finding       | Roadmap Phase | Notes                                                |
| ---------------------------- | ------------- | ---------------------------------------------------- |
| Semantic search capabilities | Phase 1-2 ✅  | Already addressed - ELSER + RRF                      |
| Transcript search            | Phase 1 ✅    | We have this, production doesn't                     |
| Thread navigation            | Phase 5       | Reference Indices & Threads                          |
| Curriculum synonyms          | Current ✅    | We have synonym system                               |
| National curriculum content  | Phase 5       | `oak_curriculum_standards` index                     |
| Prior knowledge requirements | Phase 5       | Mentioned as "Prior knowledge requirements indexing" |
| Glossary/Keywords            | Phase 5       | `oak_curriculum_glossary` index                      |

### What the Roadmap DOESN'T Address ❌

| Feature Parity Finding                             | Priority | Why It Matters                                    |
| -------------------------------------------------- | -------- | ------------------------------------------------- |
| **`pupilLessonOutcome` field**                     | **HIGH** | Key UX improvement - available NOW in Open API    |
| **Title fields** (`subjectTitle`, `keyStageTitle`) | MEDIUM   | UI display without lookups                        |
| Unit `description` and `whyThisWhyNow`             | MEDIUM   | Richer unit search                                |
| OWA alias system integration                       | MEDIUM   | Better direct PF matching                         |
| Response format alignment with OWA                 | MEDIUM   | Frontend compatibility                            |
| `copy_to` pattern for aggregated search            | LOW      | Production uses this for fuzzy matching           |
| Phrase matching boost strategy                     | LOW      | Production boosts title 6x, pupilLessonOutcome 3x |

---

## 2. Phase-by-Phase Analysis

### Phase 3: Relevance Enhancement (2-3 days)

| Roadmap Item          | Feature Parity Alignment         | Adjustment Needed?                                       |
| --------------------- | -------------------------------- | -------------------------------------------------------- |
| Elastic Native ReRank | Independent - nice to have       | ✅ Keep                                                  |
| Filtered kNN          | Independent - performance        | ✅ Keep                                                  |
| Semantic Query Rules  | **Aligns with OWA alias system** | 🔄 **Enhance**: Use OWA's `oakCurriculumData.ts` aliases |

**Recommended Addition**:

- Add "OWA Alias Integration" task - import rich aliases from `oakCurriculumData.ts` into our synonym system

### Phase 4: Entity Extraction & Graph (3-4 days)

| Roadmap Item        | Feature Parity Alignment | Adjustment Needed?                             |
| ------------------- | ------------------------ | ---------------------------------------------- |
| NER Models          | Independent - advanced   | ✅ Keep                                        |
| Graph API Discovery | Independent - advanced   | ✅ Keep                                        |
| Enrich Processor    | Could add title fields   | 🔄 **Enhance**: Use for title field enrichment |

**Observation**: This phase is advanced AI work. Consider whether quick wins should come first.

### Phase 5: Reference Indices & Threads (2-3 days)

| Roadmap Item                 | Feature Parity Alignment                         | Adjustment Needed? |
| ---------------------------- | ------------------------------------------------ | ------------------ |
| `oak_ref_subjects`           | **Directly aligns** with missing `subjectTitle`  | ✅ Perfect fit     |
| `oak_ref_key_stages`         | **Directly aligns** with missing `keyStageTitle` | ✅ Perfect fit     |
| `oak_curriculum_glossary`    | Aligns with keyword definitions                  | ✅ Keep            |
| `oak_curriculum_standards`   | Aligns with `nationalCurriculumContent`          | ✅ Keep            |
| Thread-based navigation      | Aligns - we have thread data                     | ✅ Keep            |
| Prior knowledge requirements | Aligns - available in Open API                   | ✅ Keep            |

**This phase has the strongest alignment with feature parity findings!**

### Phase 6: RAG Infrastructure (4-5 days)

| Roadmap Item        | Feature Parity Alignment             | Adjustment Needed?                                           |
| ------------------- | ------------------------------------ | ------------------------------------------------------------ |
| semantic_text Field | Independent - advanced               | ✅ Keep                                                      |
| LLM Chat Completion | **Aligns with OWA's `callModel.ts`** | 🔄 **Enhance**: Reference OWA's AI filter suggestion pattern |
| Ontology Grounding  | Independent - advanced               | ✅ Keep                                                      |

**Observation**: OWA already has LLM integration for filter suggestions (`callModel.ts`). Could inform our approach.

### Phase 7: Knowledge Graph (5-6 days)

| Roadmap Item        | Feature Parity Alignment                | Adjustment Needed? |
| ------------------- | --------------------------------------- | ------------------ |
| Triple Store        | Independent - advanced                  | ✅ Keep            |
| Entity Resolution   | Independent - advanced                  | ✅ Keep            |
| Multi-Hop Reasoning | Could help with pathway-like navigation | Consider           |

**Observation**: This is cutting-edge. Validates that we can't easily replicate production's `pathways[]` feature.

### Phase 8: Advanced Features (3-4 days)

| Roadmap Item        | Feature Parity Alignment               | Adjustment Needed?                         |
| ------------------- | -------------------------------------- | ------------------------------------------ |
| Learning to Rank    | Independent - long-term                | ✅ Keep                                    |
| Multi-Vector Fields | We already have title + lesson vectors | ✅ Alignment exists                        |
| Runtime Fields      | Could derive `keyStageShortCode`       | 🔄 **Enhance**: Add runtime field examples |

---

## 3. Gap Analysis: What's Missing from Roadmap

### High Priority Gaps (Should Add)

#### 1. **"Phase 2.5: Feature Parity Quick Wins"** (NEW - 1-2 days)

These are implementable NOW and provide immediate value:

```markdown
## Phase 2.5: Feature Parity Quick Wins (1-2 days)

### Features

1. **Add `pupilLessonOutcome` to lesson index**
   - Source: Open API `/lessons/{lesson}/summary`
   - Use for: Search result snippets, highlighting
   - Impact: HIGH - matches production UX

2. **Add title fields for display**
   - `subjectTitle`, `keyStageTitle` from lesson summary
   - Eliminates lookup overhead
   - Impact: MEDIUM - better UI compatibility

3. **Add unit description fields**
   - `description`, `whyThisWhyNow` from unit summary
   - Improves unit search relevance
   - Impact: MEDIUM

### Success Criteria

- [ ] `pupilLessonOutcome` indexed and queryable
- [ ] Title fields added to response schema
- [ ] Unit description searchable
- [ ] ADR documenting field additions
```

#### 2. **OWA Compatibility Layer** (Add to Phase 5 or new phase)

```markdown
### OWA Compatibility

1. **Response schema alignment**
   - Map our field names to OWA expected format
   - Add `keyStageShortCode` derivation
   - Handle URL generation without `programmeSlug`

2. **Alias system enrichment**
   - Import OWA's `oakCurriculumData.ts` aliases
   - Merge with our synonym system
   - Enable direct PF matching from search queries
```

### Medium Priority Gaps

#### 3. **Production Query Pattern Analysis** (Add to Phase 3)

The roadmap doesn't mention learning from production's query patterns:

- Production's phrase matching boost (title^6, pupilLessonOutcome^3)
- Production's fuzzy config (AUTO:4,7, prefix_length:1)
- Production's `copy_to` aggregated field pattern

**Recommendation**: Add task to evaluate whether these patterns should inform our BM25 component.

### Lower Priority Gaps

#### 4. **Limitations Documentation**

The roadmap doesn't acknowledge what we CAN'T do:

| Cannot Implement            | Reason                         |
| --------------------------- | ------------------------------ |
| "NEW" content badges        | No `cohort` in Open API        |
| Legacy curriculum filtering | No `isLegacy` in Open API      |
| Multi-pathway dropdown      | No `pathways[]` in Open API    |
| Exact OWA URL format        | No `programmeSlug` in Open API |

**Recommendation**: Add section to roadmap acknowledging these limitations and potential upstream requests.

---

## 4. Recommended Roadmap Adjustments

### Immediate Changes

1. **Insert "Phase 2.5: Feature Parity Quick Wins"** before Phase 3
   - Add `pupilLessonOutcome`, title fields, unit descriptions
   - 1-2 days, high impact
   - Addresses the most actionable findings

2. **Enhance Phase 3: Semantic Query Rules**
   - Add OWA alias system import task
   - Reference `oakCurriculumData.ts` patterns

3. **Enhance Phase 5: Reference Indices**
   - Explicitly tie to solving `subjectTitle`/`keyStageTitle` gaps
   - Add OWA compatibility layer tasks

### Documentation Additions

4. **Add "Limitations" section to roadmap**
   - Document what can't be achieved with Open API
   - Identify potential upstream API requests

5. **Add "Production Learnings" section**
   - Query patterns worth evaluating
   - Analyzer configurations to consider

---

## 5. Updated Phase Summary

| Phase   | Original Focus        | Enhanced Focus             | New Duration |
| ------- | --------------------- | -------------------------- | ------------ |
| **2.5** | _NEW_                 | Feature Parity Quick Wins  | 1-2 days     |
| 3       | Relevance Enhancement | + OWA Alias Integration    | 2-3 days     |
| 4       | Entity Extraction     | No change                  | 3-4 days     |
| 5       | Reference Indices     | + OWA Compatibility Layer  | 3-4 days     |
| 6       | RAG Infrastructure    | + OWA AI pattern reference | 4-5 days     |
| 7       | Knowledge Graph       | No change                  | 5-6 days     |
| 8       | Advanced Features     | + Runtime field examples   | 3-4 days     |

**Adjusted Total**: ~4.5-5.5 weeks (was ~4-5 weeks)

---

## 6. Priority Recommendation

Given the findings, I recommend this ordering for maximum practical value:

### Highest Impact First

1. **Phase 2.5: Feature Parity Quick Wins** ← **ADD THIS**
   - `pupilLessonOutcome` immediately improves search snippets
   - Title fields improve UI without lookups
   - Fast to implement, high value

2. **Phase 5: Reference Indices & Threads** ← **MOVE UP?**
   - Strong alignment with feature parity
   - Solves title field lookup problem properly
   - Enables thread navigation

3. **Phase 3: Relevance Enhancement**
   - ReRank, Filtered kNN, Query Rules
   - Now enhanced with OWA alias integration

4. Remaining phases in original order...

### Rationale

The feature parity analysis shows we have architectural advantages (ELSER, RRF, transcripts) but lack some basic fields that production uses for UX. Addressing these gaps first provides immediate value while the more advanced phases mature.

---

## 7. Key Takeaways

| Category           | Insight                                                 |
| ------------------ | ------------------------------------------------------- |
| **Strengths**      | Roadmap is technically ambitious and forward-looking    |
| **Gap**            | Missing "quick wins" phase for immediate feature parity |
| **Opportunity**    | OWA alias system is rich and could enhance our synonyms |
| **Limitation**     | Some production features require Open API changes       |
| **Recommendation** | Insert Phase 2.5, enhance Phase 5, document limitations |

---

## Appendix: Files for Reference

### Roadmap

- `.agent/plans/semantic-search/roadmap.md`

### Feature Parity Analysis

- `.agent/research/feature-parity-analysis.md`

### OWA Alias System (to import)

- `reference/Oak-Web-Application/src/context/Search/suggestions/oakCurriculumData.ts`

### Our Synonym System (to enhance)

- `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`
