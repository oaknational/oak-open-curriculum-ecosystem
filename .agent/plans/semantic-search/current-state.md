# Semantic Search — Current State

**Last Updated**: 2026-01-21  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Status**: 🔄 **Ground truth review** (26/30 subject-phases complete)

---

## Current Phase

**Phase 1: Ground Truth Review** — Validating expected slugs.

Level 1 approaches are complete, but Level 1 is NOT exhausted until ground truth review validates the measurements. Until 30/30 subject-phases are reviewed, MRR values may change as ground truths are corrected.

**Next Session**: Science (CRITICAL SUBJECT — 24 queries, 3 per category, like Maths)

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
| Ground truths reviewed | 🔄 **26/30 subject-phases** |
| Baselines established | ✅ 120 queries measured |
| Quality gates | ✅ All passing |
| Split file architecture | ✅ `*.query.ts` + `*.expected.ts` |

**Reviewed**: art (2), citizenship (1), computing (2), cooking-nutrition (2), design-technology (2), english (2), french (2), geography (2), german (1), history (1+partial), maths (2), music (2), physical-education (2), religious-education (2)

**Remaining (4)**: science (2), spanish (2)

**Next Session**: Science Phase 0+1A+1B — CRITICAL SUBJECT with THREE queries per category (like Maths)

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

### Key Learnings from Sessions 1-19

#### Foundational Principles (Sessions 1-7)

1. **Imprecise-input tests resilience**: Proves that typos and messy input don't break search — the combined system (BM25 fuzziness + ELSER semantics + RRF) should still return relevant results despite imperfect input
2. **Semantic intent**: Expected slugs must match what the query semantically means, not just title keywords
3. **Skill level matching**: "coding for beginners" should return KS3 intro, not KS4 advanced
4. **Specification vs optimisation**: Ground truth review is about correctness (the answer key), not optimising scores (tuning the system)
5. **Ground truth correctness over benchmark scores**: If semantically correct slugs don't rank well, the ground truth should still use them. This reveals search quality issues.
6. **Cross-topic requires BOTH components**: For "X AND Y together" queries, expected slugs must combine BOTH concepts.

#### Deep Exploration Standard (Session 8)

7. **5-10 MCP summaries per category**: Deep exploration requires getting `get-lessons-summary` for 5-10 candidates, not just 1-2. This reveals lessons missed by superficial exploration.
8. **Comparison tables are mandatory**: Create explicit tables for every category: `| Slug | Keywords | Key Learning | Score |`. This prevents "good enough" thinking.
9. **Unit-level exploration**: List ALL lessons in relevant units using `get-units-summary`, not just keyword-filtered results. Lessons with non-obvious titles may be highly relevant.
10. **Ask "Am I confident?"**: Before finalising each category, explicitly ask: "Have I discovered the BEST possible matches through deep exploration?"
11. **Rendering as valid intersection**: For sketching + materials queries, lessons about rendering that explicitly teach "show material texture" ARE valid intersections — `realistic-rendering-techniques` is better than `advanced-3d-sketching` for this query.
12. **Human factors vocabulary**: In design context, "empathy" (understanding what users experience) IS human factors — don't miss lessons with related vocabulary.
13. **Natural-expression semantic matching**: "DT making things move" should match lessons with "mechanisms are systems that make something move" in key learning — match informal phrasing.
14. **Vocabulary bridging verification**: For sustainability queries, verify expected slugs explicitly use bridging vocabulary (e.g., `material-sustainability` uses "sustainable").
15. **Some queries have no perfect match**: Document when no single lesson truly combines all query concepts — select best approximations from different angles.

#### Search vs Ground Truth Corrections (Sessions 9-16)

16. **The search might be RIGHT**: Session 9 (English) proved MRR 0.000 was WRONG ground truth, not search failure. After correction: MRR 1.000.
17. **Vocabulary precision matters**: "emotions" ≠ "feel", "actions" ≠ "effects". Query terms must match expected slug content.
18. **COMMIT before benchmark**: Must form independent judgment BEFORE seeing search results.
19. **Fresh MCP for every query**: Never copy expected slugs between queries, even with "similar intent".

#### Exhaustive Discovery (Sessions 17-18)

20. **Title-only matching is insufficient**: Lessons in non-obvious units (e.g., "meine Welt") may contain highly relevant content.
21. **Search can be more comprehensive than manual discovery**: If search finds relevant content you missed, your discovery was incomplete.
22. **100% certainty for critical subjects**: For maths, "good enough" is unacceptable.

#### Query Design (Session 19 — Maths Preparation)

23. **Phase 1A catches design issues early**: Analysing queries before exploring data identifies miscategorised or poorly designed queries.
24. **Vocabulary bridges must be genuine**: "the bit where you complete the square" contains curriculum vocabulary — not a true vocabulary bridge.
25. **Cross-topic must combine concepts, not tools**: "pattern blocks tangrams" tests tool co-occurrence, not meaningful concept intersection.
26. **3 queries per category for maths**: Comprehensive coverage for the most important subject.

#### Phase 1B Discovery (Session 20 — Maths Discovery)

27. **COMMIT before comparison**: Independent rankings formed using bulk data + MCP summaries BEFORE viewing existing `.expected.ts` files or search results.
28. **Exhaustive exploration for maths**: 125 primary units (~1,072 lessons), 98 secondary units (~1,073 lessons) systematically searched.
29. **Cross-topic gaps**: Some cross-topic queries (e.g., "geometry proof coordinate") have limited direct curriculum matches — need to select best approximations.
30. **MCP summaries reveal hidden relevance**: Key learning quotes essential for ranking decisions (e.g., "The gradient is a measure of how steep a line is" for "how steep is the line").
31. **Primary maths well-structured**: Place value, fractions, multiplication units have excellent lesson coverage with clear progression.
32. **Secondary maths dense coverage**: Quadratics, simultaneous equations, probability units have multiple highly-relevant lessons per topic.

#### RE Session Findings (Session 21 — RE Phase 1C)

33. **Generic queries require generic expected slugs**: Queries like "religious founders and leaders" need cross-faith content, not Sikh-only.
34. **Bulk API data alignment issue**: See [bug report](bug-report-bulk-api-incomplete-paired-units.md). The Oak Bulk API returns incomplete data for paired RE units (Islam half only, not Buddhism half). This causes GT validation failures for lessons that exist in search but not in bulk data.
35. **Original GT can be completely wrong**: 6 of 9 RE queries had completely wrong expected slugs (Sikh-specific for generic queries).

**Documentation**: [GROUND-TRUTH-GUIDE.md](../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) — consolidated design, troubleshooting, lessons learned

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
