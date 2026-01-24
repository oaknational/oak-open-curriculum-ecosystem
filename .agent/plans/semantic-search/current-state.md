# Semantic Search — Current State

**Last Updated**: 2026-01-24  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Status**: 🔄 **Ground Truth Review — Quality Improvement Pass**

---

## ✅ Session 2026-01-24 Progress

### Validation Status: PASSING

`pnpm ground-truth:validate` **PASSES** with 0 errors.

All validation errors have been fixed:
- `cooking-nutrition/secondary/precise-topic`: Added 2 more slugs
- `maths/primary/imprecise-input-2`: Extended query to 4 words
- `maths/primary/cross-topic`: Varied relevance scores

### Key Accomplishments

| Issue | Resolution | Result |
|-------|------------|--------|
| French negation synonym missing | Added to `french.ts` | MRR 0.000 → **1.000** |
| Control queries for fuzzy diagnosis | Added history/cross-topic-2, maths/precise-topic-4 | Diagnostic capability |
| MFL synonym DRY violations | Documented in `mfl-synonym-architecture.md` | Future refactoring planned |
| Bucket C translation hints | Removed from MFL files, archived in `bucket-c-analysis.ts` | Cleaner synonym sets |
| German negation German words | Removed `nicht`, `kein`, `nie` | English synonyms only |

### Zero-Hit Query Resolution

| Query | Before | After | Status |
|-------|--------|-------|--------|
| `making French sentences negative KS3` | MRR 0.000 | MRR 1.000 | ✅ Resolved |
| `dribbling baal with feet` | MRR 0.000 | MRR 1.000 | ✅ Resolved |
| `vikins and anglo saxons` | MRR 0.000 | MRR 1.000 | ✅ Resolved |
| `nutrition and cooking techniques together` | MRR 0.000 | MRR 1.000 | ✅ Resolved |
| `narative writing storys iron man Year 3` | MRR 0.000 | MRR 0.333 | ⚠️ Search gap |
| `coding for beginners...` | MRR 0.000 | MRR 0.000 | ⏸️ Future work |

### Remaining Challenges

| Challenge | Root Cause | Future Solution |
|-----------|------------|-----------------|
| `narative writing storys iron man Year 3` MRR 0.333 | Multiple typos exceed fuzzy limits | Query rules, domain boosting |
| `electrisity and magnits` MRR 0.200 | Fuzzy false positive (magnits → magnify) | Domain term boosting |
| MFL subjects MRR 0.19-0.29 | No transcripts, English-only ELSER | Multilingual embeddings |

See: [problematic-queries-investigation.md](active/problematic-queries-investigation.md) for detailed analysis

---

## ✅ RESOLVED: Subject Hierarchy Enhancement

The `subject_parent` field has been implemented and verified (2026-01-22). Science secondary searches now correctly include physics, chemistry, biology, and combined-science lessons.

**Implementation**: [subject-hierarchy-enhancement.md](./archive/completed/subject-hierarchy-enhancement.md)  
**ADR**: [ADR-101: Subject Hierarchy for Search Filtering](../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md)

### Verification Results

Post-ingestion benchmark (2026-01-22):

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.681 | ~ borderline |
| NDCG@10 | 0.521 | ✗ below threshold |
| P@3 | 0.333 | ✗ below threshold |
| R@10 | 0.611 | ✓ passing |

**Key Finding**: Filtering now works correctly. The remaining quality gaps are **search ranking issues**, not filtering issues.

### Search Quality Gaps (Pre-Discovery)

| Query | MRR | Issue | Status |
|-------|-----|-------|--------|
| "what makes things hot or cold" | 0.000 | Vocabulary bridging failure | **REVISED** to "why do some things feel hotter than others" |
| "why does metal go rusty" | 0.250 | Results found but poorly ranked | Awaiting Phase 1C re-measurement |
| "electromagnetic spectrum waves" | 0.333 | High R@10 + Low MRR = ranking issue | Awaiting Phase 1C re-measurement |

**Note**: These metrics are from before Phase 1B re-discovery. Phase 1C will produce fresh measurements for all 29 queries.

**Future architecture work**: [subject-domain-model.md](./post-sdk/subject-domain-model.md) — Full SDK architecture (after GT review)

---

## Current Phase

**Phase 1: Ground Truth Review** — Quality improvement pass in progress.

### ✅ Validation Passing

All validation errors have been fixed. Benchmark results are trustworthy.

### Recommended Next Actions

1. **Continue Priority 3 queries** — Very low MRR (0.001-0.333) queries
2. **MFL quality investigation** — Evaluate multilingual embedding options
3. **Document search gaps** — Some queries expose search limitations, not GT errors

### MFL-Specific Considerations (Added 2026-01-24)

MFL subjects (French, German, Spanish) have unique challenges:

| Challenge | Impact | Potential Solution |
|-----------|--------|-------------------|
| No transcripts | ~0% content coverage | Structure-only retrieval (architectural limit) |
| English-only ELSER | Semantic matching weak | Multilingual embedding model |
| Low MRR (0.19-0.29) | Below all other subjects | Combination of above |

**Potential enhancement**: Add a multilingual semantic text retriever using a model like `multilingual-e5-base` on the metadata semantic_text field.

**See**: [roadmap.md](roadmap.md) "MFL-Specific Considerations" section and [mfl-synonym-architecture.md](post-sdk/search-quality/mfl-synonym-architecture.md)

### Documented Search Gaps (Not GT Errors)

These queries expose genuine search limitations that require future search improvements:

| Query | MRR | Root Cause | Future Solution |
|-------|-----|------------|-----------------|
| `narative writing storys iron man Year 3` | 0.333 | Multiple typos exceed fuzzy limits | Query rules, domain boosting |
| `electrisity and magnits` | 0.200 | Fuzzy false positive (magnits → magnify) | Domain term boosting |
| `coding for beginners...` | 0.000 | Search doesn't prioritise "introduction" | Query rules, semantic reranking |

---

## Search Architecture

### Two Information Sources Per Lesson

| Source | ES Field | Description | Coverage |
|--------|----------|-------------|----------|
| **Structure** | `lesson_structure` | Curated semantic summary (title, unit, keywords, key learning points) | ALL lessons (100%) |
| **Content** | `lesson_content` | Full video transcript + pedagogical fields | SOME lessons (~81%) |

### Four Retrievers (Combined via RRF)

| Retriever | ES Field | Technology |
|-----------|----------|------------|
| **Structure BM25** | `lesson_structure`, `lesson_title` | Keyword matching with fuzziness |
| **Structure ELSER** | `lesson_structure_semantic` | Semantic embedding |
| **Content BM25** | `lesson_content`, `lesson_keywords`, etc. | Keyword matching with fuzziness |
| **Content ELSER** | `lesson_content_semantic` | Semantic embedding |

### How They Combine

| Lesson Type | Retrievers Used | Coverage |
|-------------|-----------------|----------|
| **With content** | All 4 retrievers combined via RRF | ~81% of lessons |
| **Without content** | Structure only (2 retrievers) | ~19% of lessons |

**Critical**: Structure is the **foundation** — all lessons have it. Content is a **bonus** where transcripts exist.

---

## 🔄 Ground Truth Comprehensive Review

| Milestone | Status |
|-----------|--------|
| RRF normalisation (ADR-099) | ✅ Implemented and validated |
| Synonym coverage (ADR-100) | ✅ All 17 subjects have domain-specific synonyms (~580 total) |
| Ground truths reviewed | 🔄 **28/30 subject-phases** |
| Baselines established | ✅ 120 queries measured |
| Quality gates | ✅ All passing |
| Split file architecture | ✅ `*.query.ts` + `*.expected.ts` |

**Reviewed**: art (2), citizenship (1), computing (2), cooking-nutrition (2), design-technology (2), english (2), french (2), geography (2), german (1), history (1+partial), maths (2), music (2), physical-education (2), religious-education (2), science (2 — Phase 1C COMPLETE)

**Remaining (2)**: spanish (2)

**Next Session**: Spanish Phase 1B — MFL subject with structure-only retrieval

### Science GT Fixes + Query Tuning (2026-01-23)

All 32 Science queries benchmarked and validated.

**Final Metrics (Post-Tuning)**:

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY (13 queries) | 0.836 | 0.737 | 0.641 | 0.723 |
| SECONDARY (19 queries) | 0.932 | 0.731 | 0.561 | 0.741 |
| **OVERALL** | **0.893** | 0.733 | 0.594 | 0.734 |

**Primary Category Breakdown**:

| Category | MRR | NDCG@10 | P@3 | R@10 |
|----------|-----|---------|-----|------|
| precise-topic | 1.000 | 0.970 | 1.000 | 1.000 |
| natural-expression | 0.722 | 0.466 | 0.222 | 0.300 |
| imprecise-input | 0.611 | 0.576 | 0.556 | 0.717 |
| cross-topic | 0.875 | 0.805 | 0.750 | 0.838 |

**Secondary Category Breakdown**:

| Category | MRR | NDCG@10 | P@3 | R@10 |
|----------|-----|---------|-----|------|
| precise-topic (8 queries) | 1.000 | 0.806 | 0.625 | 0.850 |
| natural-expression | 0.875 | 0.580 | 0.333 | 0.521 |
| imprecise-input | 0.800 | 0.675 | 0.583 | 0.737 |
| cross-topic | 1.000 | 0.805 | 0.667 | 0.750 |

**Changes Made (2026-01-23)**:

1. **`minimum_should_match: '2<65%'`** — Changed from `75%` to conditional matching for 3+ term queries
2. **Fixed "energy transfers and efficiency" GT** — Search was correct, GT was wrong. MRR 0.333 → **1.000**
3. **Fixed "plants and animals" GT** — Added `animal-habitats`, `protecting-microhabitats`. MRR → **1.000**
4. **Added control queries** — "electricity and magnets" (MRR 1.000) and "plants and animals" (MRR 1.000) for typo comparison
5. **Documented fuzziness/minimum_should_match tuning** in modern-es-features.md

**Known Fuzzy Matching Limitation**:

| Query | Issue | Root Cause |
|-------|-------|------------|
| "electrisity and magnits" | MRR 0.200 — Microscopy lessons in top 3 | "magnits" fuzzy-matches "magnify" (edit distance 2) |
| "plints and enimals" | MRR 0.200 — Missing cross-topic lessons | Fuzzy dilutes signal in 2-term queries |

**Solution (deferred)**: Domain term boosting — boost matches on curriculum vocabulary. Documented in [modern-es-features.md](post-sdk/search-quality/modern-es-features.md).

### Science Phase 1C COMPLETE (2026-01-22)

Previous baseline before 2026-01-23 tuning:

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY (12 queries) | 0.787 | 0.743 | 0.639 | 0.799 |
| SECONDARY (17 queries) | 0.892 | 0.653 | 0.451 | 0.657 |

### Religious Education Phase 1C COMPLETE (2026-01-21)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.875 | 0.677 | 0.583 | 0.750 |
| SECONDARY | 0.640 | 0.526 | 0.467 | 0.510 |

**GT Corrections Made**:

- PRIMARY precise-topic: Expanded to cross-faith founders (prophet-muhammad, idea-of-a-buddha, guru-nanak, moses)
- PRIMARY natural-expression: REPLACED — Previous (guru-nanak) was wrong for "why do people pray". Changed to prayer-focused lessons.
- PRIMARY imprecise-input: Added story-focused lessons
- PRIMARY cross-topic: REPLACED — Previous (guru-nanak teachings) was wrong for "places of worship and religious festivals". Changed to festival/worship lessons.
- SECONDARY precise-topic: REPLACED Buddhism-only slugs with cross-faith content
- SECONDARY natural-expression: Expanded to include ethics lessons
- SECONDARY imprecise-input: REPLACED dhamma slugs with worship/prayer lessons
- SECONDARY cross-topic: REPLACED afterlife slugs with text+ethics lessons
- SECONDARY cross-topic-2: Added reconciliation lessons for "East-West Schism and ecumenical movements"

**Key Learnings**:

1. **Original GT was COMPLETELY wrong** for 6 of 9 queries — Sikh-specific content (Guru Nanak) was used for generic queries about prayer, festivals, founders
2. **Generic queries require generic expected slugs** — "religious founders and leaders" needs cross-faith content, not Sikh-only
3. **Bulk API data alignment issue**: See [bug report](bug-report-bulk-api-incomplete-paired-units.md). Search returns Buddhist meditation content that doesn't exist in bulk data files. The Oak Bulk API returns incomplete data for paired RE units (Islam half only, not Buddhism half).
4. **Phase 1B COMMIT process worked** — Independent discovery revealed misalignment before seeing expected slugs

### Physical Education Phase 1C COMPLETE (2026-01-21)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.833 | 0.797 | 0.583 | 0.875 |
| SECONDARY | 0.813 | 0.725 | 0.667 | 0.787 |

**GT Corrections Made**:

- PRIMARY precise-topic: Added feet-dribbling lessons (query is generic "ball skills")
- PRIMARY natural-expression: Changed from passing to throwing lessons ("throw and catch")
- PRIMARY imprecise-input: Changed to feet-based football skills ("footbal" = soccer)
- PRIMARY cross-topic: Added `introduce-maps-working-together` (perfect title match)
- SECONDARY precise-topic: Added `the-fitt-principle` (original slug not found)
- SECONDARY natural-expression: Changed to exercise programme lessons
- SECONDARY imprecise-input: Added `high-jump` and `triple-jump` lessons
- SECONDARY cross-topic: Changed to fitness components lessons

**Search Quality Gaps Identified**:

- PRIMARY imprecise-input: Typo "footbal" doesn't strongly recover to football (MRR=0.333)
- SECONDARY imprecise-input: Typo "runing" appears weak (MRR=0.250) but investigation revealed BM25 fuzzy matching IS working — the issue is multi-term query ranking (lessons matching more query terms rank higher than running-only lessons)

**Key Learnings**:

1. Original GT was completely wrong for most queries - needed substantial corrections
2. Structure-only retrieval works well for PE once GT is correct
3. **Synonym DRY Fix (2026-01-21)**: Removed duplicate `physical-education` definition from `physical-education.ts`. Subject name synonyms now defined ONLY in `subjects.ts`. This fixed incorrect "sport/sports" expansion that was causing `drugs-in-sport` to rank highly for athletics queries.
4. **BM25 explain investigation**: Used ES explain API to verify fuzzy matching works correctly. The "runing" typo DOES match "running" content, but in multi-term queries, lessons matching more terms naturally rank higher.

**Historical COMMIT Rankings (from Phase 1B)**:

**PRIMARY Queries**:

| Query | Category | Rank 1 | Rank 2 | Rank 3 | Rank 4 | Rank 5 |
|-------|----------|--------|--------|--------|--------|--------|
| "dribbling ball skills" | precise-topic | dribbling-with-hands [3] | moving-with-a-ball-using-our-feet [3] | develop-moving-with-the-ball-using-our-feet-dribbling [3] | dribbling-and-keeping-control [3] | dribbling-and-keeping-possession-using-our-hands [2] |
| "how to throw and catch" | natural-expression | throwing-and-catching [3] | throwing-with-accuracy [3] | throwing-underarm [3] | passing-and-receiving-using-our-hands [2] | overarm-throwing [2] |
| "footbal skills primary" | imprecise-input | moving-with-a-ball-using-our-feet [3] | kicking-passing [3] | dribbling-with-our-feet-in-games [3] | passing-and-receiving-using-our-feet [3] | dribbling-to-score-a-point-in-game-activities-using-our-feet [2] |
| "maps and teamwork outdoor activities" | cross-topic | introduce-maps-working-together [3] | using-a-map-to-follow-a-route [3] | collaborate-effectively-to-complete-a-timed-course [3] | orientating-a-map-to-locate-points [2] | create-and-use-simple-tactics-through-team-challenges [2] |

**SECONDARY Queries**:

| Query | Category | Rank 1 | Rank 2 | Rank 3 | Rank 4 | Rank 5 |
|-------|----------|--------|--------|--------|--------|--------|
| "fitness training FITT principle..." | precise-topic | the-fitt-principle [3] | the-fitt-frequency-intensity-time-and-type-principle [3] | the-principles-of-training-and-their-application-to-a-personal-exercise-programme [3] | planning-a-training-programme [2] | design-your-programme [2] |
| "getting fit exercise programme" | natural-expression | planning-a-training-programme [3] | promotion-of-personal-health [3] | physical-emotional-and-social-health-fitness-and-wellbeing [3] | the-relationship-between-health-and-fitness [2] | future-goals-and-healthy-habits [2] |
| "PE athletics runing and jumping" | imprecise-input | running-for-speed-and-the-relationship-between-distance-and-time [3] | jumping-for-distance [3] | jumping-for-height [3] | running-for-distance-and-understanding-pace [2] | training-in-teams-for-personal-bests-in-long-jump-and-triple-jump [2] |
| "fitness and athletics together" | cross-topic | the-fitt-frequency-intensity-time-and-type-principle [3] | training-with-intensity [3] | your-strengths-as-an-athlete [3] | design-your-programme [2] | training-in-teams-for-personal-bests-in-sprint-events [2] |

**Key Observations from Discovery**:

1. **PRIMARY dribbling**: Ball skills units (Year 1-2) have comprehensive dribbling coverage for hands and feet
2. **PRIMARY throwing/catching**: "Ball skills: sending, receiving and dribbling" unit has `throwing-and-catching` as exact title match
3. **PRIMARY imprecise-input**: Football skills = dribbling/kicking with feet; searched with correct spelling for semantic intent
4. **PRIMARY cross-topic**: OAA: Orienteering unit explicitly combines maps + teamwork in title and content
5. **SECONDARY fitness/FITT**: "Physical training: principles of training" unit has direct FITT lessons at KS4
6. **SECONDARY cross-topic**: "Athletics: fitness development of pace or power" unit is the perfect intersection - unit title contains both concepts

**Phase 1C Next**: Run benchmark, three-way comparison (COMMIT vs SEARCH vs EXPECTED), record metrics, update GT if needed.

### Music Phase 1C Complete (2026-01-20)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.781 | 0.567 | 0.417 | 0.750 |
| SECONDARY | 0.813 | 0.854 | 0.500 | 1.000 |

**GT Corrections Made**:

- `music/primary/natural-expression.expected.ts`: Changed from timing-related to pitch-related slugs ("in tune" = pitch accuracy, not timing)
- `music/primary/imprecise-input.expected.ts`: Replaced KS2 `syncopated-rhythms` with KS1-appropriate lessons
- `music/secondary/cross-topic.expected.ts`: Changed from narrow (scary/tension) to composition-focused (all involve creating, not just analyzing)

**Search Quality Gaps Identified**:

- PRIMARY natural-expression: Search doesn't find pitch-related lessons well (MRR=0.125)
- SECONDARY cross-topic: Film composition lessons ranked at 4, 6, 7 instead of top 3 (MRR=0.250)

### Maths Phase 1C Complete (2026-01-20)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.675 | 0.607 | 0.500 | 0.683 |
| SECONDARY | 0.861 | 0.749 | 0.667 | 0.828 |

**GT Corrections Made**:

- `maths/secondary/natural-expression-2.expected.ts`: Quadratic → linear equations (search was RIGHT)
- `maths/primary/cross-topic`: Changed from "fractions word problems money" to "area and perimeter problems together" (verified cross-topic content)
- Synonym added: `times-table => timetables, timestables, time tables`

**Key Learnings**:

- Query register must match content level (informal → basic, not advanced)
- Tokenization ≠ fuzzy matching (word boundary issues need synonyms)
- Cross-topic GTs must reflect curriculum reality (intersection must exist)
- Secondary outperforms Primary (standardised vs fragmented vocabulary)

**Sessions 1-5 Log**: [sessions-1-5-log.md](logs/sessions-1-5-log.md) — Previous work before enhanced understanding

### Required Standard

**Use ALL relevant MCP tools AND bulk data** for every ground truth review.

| Tool | Purpose |
|------|---------|
| **Bulk data** (`jq`) | Find ALL candidate lessons |
| **`get-lessons-summary`** | Get keywords, key learning points for each candidate |
| **`get-units-summary`** | Understand lesson ordering (critical for beginner/advanced queries) |
| **`get-key-stages-subject-units`** | See unit structure |
| **`benchmark --review`** | See actual search results with ALL 4 metrics |

**Plan template**: [ground-truth-session-template.md](templates/ground-truth-session-template.md)

### Key Learnings

**See [GROUND-TRUTH-GUIDE.md Part 6: Lessons Learned](../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md#part-6-lessons-learned) for the complete, authoritative list of learnings from all 25+ sessions.**

The guide contains lessons organised by session covering:

- Foundational principles (Sessions 1-7)
- Deep exploration standards (Session 8)
- Search vs GT corrections (Sessions 9-16)
- Exhaustive discovery (Sessions 17-18)
- Query design and Phase 1A (Session 19)
- Maths comprehensive review (Sessions 19-20)
- RE and PE corrections (Session 21)
- Science architecture fixes and query tuning (Sessions 22-23)

### Related ADRs

| ADR | Decision |
|-----|----------|
| [ADR-085](../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Three-stage validation model |
| [ADR-098](../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) | Split file architecture |
| [ADR-101](../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md) | `subject_parent` for Science KS4 |
| [ADR-102](../../docs/architecture/architectural-decisions/102-conditional-minimum-should-match.md) | Conditional minimum_should_match |
| [ADR-103](../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md) | Fuzzy matching limitations |
| [ADR-104](../../docs/architecture/architectural-decisions/104-domain-term-boosting.md) | Domain term boosting (proposed) |

---

## Baseline Results (2026-01-13)

**Overall**: MRR=0.513 | Zero-hit rate=24.2%

---

## Benchmark Results by Subject (2026-01-13)

> **Measurement Scope**: Ground truth metrics measure expected slug position, not user satisfaction.

### Top Performers (MRR >= 0.7)

| Subject | Phase | MRR | Zero% |
|---------|-------|-----|-------|
| history | secondary | 1.000 | 0% |
| science | secondary | 1.000 | 0% |
| art | primary | 0.875 | 0% |
| geography | primary | 0.875 | 0% |
| maths | secondary | 0.833 | 0% |
| english | primary | 0.792 | 0% |
| music | secondary | 0.750 | 25% |
| cooking-nutrition | secondary | 0.750 | 25% |

### Needs Improvement (MRR < 0.3)

| Subject | Phase | MRR | Zero% | Issue |
|---------|-------|-----|-------|-------|
| physical-education | secondary | 0.000 | 100% | Search issue |
| german | secondary | 0.063 | 50% | Search issue |
| physical-education | primary | 0.188 | 50% | Search issue |
| religious-education | secondary | 0.192 | 25% | Search issue |
| french | primary | 0.250 | 75% | Search issue |
| french | secondary | 0.250 | 75% | Search issue |
| spanish | secondary | 0.250 | 75% | Search issue |

---

## RRF Normalisation Validation

The RRF fix (ADR-099) is confirmed working:

| Subject Group | Pre-Fix Behaviour | Post-Fix (2026-01-13) |
|---------------|-------------------|----------------------|
| MFL (French, German, Spanish) | 50% scoring penalty, unable to compete | **Producing results** (MRR 0.06-0.29) |
| PE Primary | 50% scoring penalty | **Producing results** (MRR 0.19) |
| PE Secondary | 50% scoring penalty | Zero results (search issue, not GT) |

**Conclusion**: MFL/PE subjects can now compete. Note that MFL subjects (French, German, Spanish) use **structure retrieval only** (metadata: title, keywords, key learning) because transcripts are not available for these subjects (~0% content coverage). This is an architectural fact, not a limitation. Ground truths for MFL subjects must be designed for structure-based retrieval.

---

## Ground Truth Structure (2026-01-12)

| Metric | Value | Status |
|--------|-------|--------|
| Subject-phase entries | 30 | ✅ |
| Total queries | **120** | ✅ |
| Categories per entry | 4 | ✅ |
| AI-curated entries | **30/30** | ✅ |
| Quality gates | All passing | ✅ |
| RRF architecture | Fixed (ADR-099) | ✅ |
| **Benchmark validated** | **Complete** | ✅ |

Each subject-phase entry contains exactly 4 queries, one per category:

| Category | Tests | Example Query |
|----------|-------|---------------|
| `precise-topic` | Curriculum terminology | "quadratic equations factorising" |
| `natural-expression` | Vocabulary bridging | "the bit where you complete" |
| `imprecise-input` | Search resilience to messy input | "simulatneous equasions" |
| `cross-topic` | Concept intersection | "algebra with graphs" |

---

## ES Index State

| Index | Documents | Storage |
|-------|-----------|---------|
| `oak_lessons` | 184,985 | 806.62MB |
| `oak_unit_rollup` | 165,345 | 706.06MB |
| `oak_units` | 1,635 | 8.94MB |
| `oak_threads` | 164 | 255.53KB |
| `oak_sequence_facets` | 57 | 375.14KB |
| `oak_sequences` | 30 | 267.67KB |
| `oak_meta` | 1 | 5.34KB |

**Note**: `oak_lessons` and `oak_unit_rollup` counts include ELSER sub-documents.

**Actual documents**:

| Type | Count |
|------|-------|
| Lessons | 12,833 |
| Units | 1,665 |
| Threads | 164 |
| Sequences | 30 |
| Sequence facets | 57 |
| **Total** | **16,414** |

---

## Content Coverage by Subject

| Subject Group | Content Coverage | Retrievers Used |
|---------------|------------------|-----------------|
| MFL (French, German, Spanish) | ~0% | Structure only (2/4) |
| PE Primary | ~0.6% | Structure only (2/4) |
| PE Secondary | ~28.5% | Mostly Structure only |
| All other subjects | 95-100% | All 4 retrievers |

**~19% of all lessons have no content (transcript)** — these rely solely on Structure BM25 + ELSER.

**Implication**: Low MRR in MFL/PE may indicate Content-dependency in ground truth design, not search failure. Ground truths should test Structure retrieval (which works for all lessons) as the foundation.

---

## Bulk Data Files

30 files in `bulk-downloads/`:

| Phase | Count | Subjects |
|-------|-------|----------|
| Primary | 14 | art, computing, cooking-nutrition, design-technology, english, french, geography, history, maths, music, physical-education, religious-education, science, spanish |
| Secondary | 16 | art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, science, spanish |

---

## Validation Commands

```bash
cd apps/oak-open-curriculum-semantic-search

pnpm type-check               # TypeScript validation
pnpm ground-truth:validate    # Runtime validation (16 checks)
pnpm benchmark --all          # Run benchmarks (after RRF fix)
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry |
| [Review Checklist](active/ground-truth-review-checklist.md) | **CURRENT**: Ground truth review progress |
| [Ground Truth Guide](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design, troubleshooting, lessons learned |
| [Roadmap](roadmap.md) | Work items |
