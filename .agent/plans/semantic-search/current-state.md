# Semantic Search — Current State

**Last Updated**: 2026-01-16
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

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
| Ground truths reviewed | 🔄 **6/30 subject-phases** (art/primary, art/secondary, citizenship/secondary, computing/primary, computing/secondary, cooking-nutrition/primary) |
| Baselines established | ✅ 120 queries measured |
| Quality gates | ✅ All passing |

**Next Session**: cooking-nutrition/secondary (4 queries)

**Sessions 1-5 Log**: [sessions-1-5-log.md](logs/sessions-1-5-log.md) — Previous work before enhanced understanding

### Required Standard

**Use ALL relevant MCP tools AND bulk data** for every ground truth review.

| Tool | Purpose |
|------|---------|
| **Bulk data** (`jq`) | Find ALL candidate lessons |
| **`get-lessons-summary`** | Get keywords, key learning points for each candidate |
| **`get-units-summary`** | Understand lesson ordering (critical for beginner/advanced queries) |
| **`get-key-stages-subject-units`** | See unit structure |
| **`gt-review`** | See actual search results |

**Plan template**: [ground-truth-session-template.md](templates/ground-truth-session-template.md)

### Key Learnings from Sessions 1-6

1. **Imprecise-input tests resilience**: Proves that typos and messy input don't break search — the combined system (BM25 fuzziness + ELSER semantics + RRF) should still return relevant results despite imperfect input
2. **Semantic intent**: Expected slugs must match what the query semantically means, not just title keywords
3. **Skill level matching**: "coding for beginners" should return KS3 intro, not KS4 advanced
4. **Curriculum exploration**: Find qualitatively best matches, not just top search results
5. **Specification vs optimisation**: Ground truth review is about correctness (the answer key), not optimising scores (tuning the system)
6. **Use MCP `get-units-summary` for lesson ordering**: For "beginner" queries, identify which lessons are FIRST in unit (true beginner) vs END of unit (capstone). Lower MRR with correct ground truth exposes search issues — valuable information.
7. **Ground truth correctness over benchmark scores**: If semantically correct slugs don't rank well, the ground truth should still use them. This reveals search quality issues.
8. **Review ALL lessons systematically**: List all lessons in the pool and review the full list, not just search results or title-based jq filters. MCP key learning points may reveal relevance not visible in titles.
9. **Distinguish practical vs theory lessons**: For queries like "learning to cook X", practical cooking lessons should be preferred over theory lessons, even if theory ranks higher in search.

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

**Conclusion**: MFL/PE subjects can now compete. Low MRR values are due to search limitations (misspelling handling, content matching), not structural RRF disadvantage.

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
