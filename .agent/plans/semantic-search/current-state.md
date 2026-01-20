# Semantic Search — Current State

**Last Updated**: 2026-01-20  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Status**: 🔄 **Ground truth review** (20/30 subject-phases complete)

---

## Current Phase

**Phase 1: Ground Truth Review** — Validating expected slugs.

Level 1 approaches are complete, but Level 1 is NOT exhausted until ground truth review validates the measurements. Until 30/30 subject-phases are reviewed, MRR values may change as ground truths are corrected.

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
| Ground truths reviewed | 🔄 **20/30 subject-phases** |
| Baselines established | ✅ 120 queries measured |
| Quality gates | ✅ All passing |
| Split file architecture | ✅ `*.query.ts` + `*.expected.ts` |

**Reviewed**: art (2), citizenship (1), computing (2), cooking-nutrition (2), design-technology (2), english (2), french (2), geography (2), german (1), history (1+partial), **maths (2)**

**Next Session**: music/primary + music/secondary

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
