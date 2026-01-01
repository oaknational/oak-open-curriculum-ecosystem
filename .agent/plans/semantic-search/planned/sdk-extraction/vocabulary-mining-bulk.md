# Vocabulary Mining: Bulk Data Mining

**Status**: 📋 Planned (blocked on Milestone 1)  
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md) (Milestone 8)  
**Priority**: High  
**Dependencies**: Milestones 1, 3, 4 (complete ingestion, synonym audit, transcript mining)

---

## Goal

Mine the entirety of Oak's bulk download data (~630MB, 30 files) to extract:

1. **Synonym patterns** — "also known as", parentheticals, cross-lesson variants
2. **Keyword relationships** — Definition-based connections, cross-subject terms
3. **High-value vocabulary** — Most frequent, most foundational, most cross-referenced
4. **Misconception clusters** — Topics with highest error density
5. **Learning progression patterns** — Implicit dependencies not captured by threads

---

## What's Already Done

| Component | Status | Output |
|-----------|--------|--------|
| Pipeline infrastructure | ✅ COMPLETE | `vocab-gen/` CLI |
| Bulk reader + Zod validation | ✅ COMPLETE | Handles all data quality issues |
| 7 Extractors | ✅ COMPLETE | 13K keywords, 12K misconceptions, etc. |
| Thread progression generator | ✅ COMPLETE | `thread-progression-data.ts` |
| Prerequisite graph generator | ✅ COMPLETE | `prerequisite-graph-data.ts` |

**Run with**: `pnpm vocab-gen` (from repo root)

---

## What's Next

| Generator | User Need | Status |
|-----------|-----------|--------|
| `misconception-graph-generator.ts` | "What mistakes should I watch for?" | 📋 Next |
| `synonym-miner.ts` | "Better search for vocabulary queries" | 📋 Planned |
| `nc-coverage-generator.ts` | "Does this cover the NC?" | 📋 Planned |
| ES indexing | "Search the glossary" | 📋 Planned |

---

## Proposed Elasticsearch Indices

### 1. Curriculum Glossary Index (`oak_curriculum_glossary`)

| Field | Type | Source |
|-------|------|--------|
| `term` | keyword | `lessonKeywords[].keyword` |
| `definition` | text | `lessonKeywords[].description` |
| `subject` | keyword | Lesson subject |
| `key_stage` | keyword | Lesson key stage |
| `year` | integer | Lesson year |
| `lesson_slugs` | keyword[] | Lessons using this term |
| `frequency` | integer | Usage count |
| `first_introduced` | integer | Earliest year |

**Size**: ~13,349 documents (unique keywords)

### 2. Misconception Index (`oak_misconceptions`)

| Field | Type | Source |
|-------|------|--------|
| `misconception` | text | The wrong belief |
| `response` | text | How to address it |
| `subject` | keyword | Subject |
| `key_stage` | keyword | Key stage |
| `year` | integer | Year |
| `lesson_slug` | keyword | Lesson that addresses it |

**Size**: ~12,777 documents

### 3. NC Coverage Map (`oak_nc_coverage`)

| Field | Type | Source |
|-------|------|--------|
| `nc_statement` | text | Official NC text |
| `units` | object[] | Units covering this statement |
| `lessons` | object[] | Lessons within those units |
| `subject` | keyword | Subject |
| `key_stage` | keyword | Key stage |
| `coverage_depth` | keyword | How deeply covered |

**Size**: ~500-1000 documents (unique NC statements)

### 4. Pedagogical Vocabulary Index (`oak_pedagogy_vocab`)

| Field | Type | Source |
|-------|------|--------|
| `term` | keyword | Pedagogical term |
| `context` | text | How it's used |
| `source_type` | keyword | teacher_tip, content_guidance, etc. |
| `subject` | keyword | Subject if applicable |
| `examples` | text[] | Usage examples |

**Size**: ~2,000 documents

---

## Open Questions (Blocking Decisions)

These decisions need resolution before Phase 3 (synonym integration):

### Synonym Integration

| Question | Options | Decision |
|----------|---------|----------|
| Conflict resolution | Curated always wins, but log conflicts? | TBD |
| Confidence scoring | Pattern clarity, definition length, cross-ref count? | TBD |
| Promotion workflow | Manual review vs semi-auto PR vs auto-promote? | TBD |
| Size limits | ES performance with 10x synonyms? Per-category limits? | Benchmark needed |
| Regeneration safety | vocab-gen must NEVER modify curated files | ✅ Decided |

### Glossary Design

| Question | Consideration |
|----------|---------------|
| Link back to lessons or units? | Both? Configurable? |
| Term evolution across key stages? | Same word, different meanings? |
| Versioning on curriculum updates? | How to track vocabulary changes? |
| Multi-language? | Welsh curriculum vocabulary? |
| Access control? | Public API or authenticated only? |

---

## Key Discoveries (from Research)

### Synonym Strategy is Inverted

| What We Have | Reality |
|--------------|---------|
| 163 curated synonyms | Target GCSE-level compound terms |
| Top 100 curriculum terms | **0% synonym coverage** |
| Highest-value terms | `adjective`, `noun`, `suffix`, `evaluate` |

**The high-volume vocabulary is foundational (KS1-KS2) single words**, not GCSE compound terms.

**Full analysis**: [vocabulary-value-analysis.md](../../../research/semantic-search/vocabulary-value-analysis.md)

### Definition Text IS the Synonym Source

```text
adjective: "a word that DESCRIBES a noun"     → "describing word"
noun: "a NAMING word for people..."           → "naming word"
denominator: "the BOTTOM NUMBER in a fraction" → "bottom number"
```

Regex patterns like "also known as" were a category error. The definitions contain explanatory phrases that teachers use to search.

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Search MRR on vocabulary queries | +10% improvement | Before/after evaluation |
| Learning path accuracy | 90%+ correct | AI answering "what comes before?" |
| Misconception detection | Relevant surfaced | Teacher feedback |

---

## Evaluation Requirements

Before implementing ES indexing:

- [ ] Create ground truth queries for glossary search (e.g., "what is an adjective?")
- [ ] Baseline MRR for vocabulary-type queries (current system)
- [ ] After MRR for vocabulary-type queries (with new indices)
- [ ] Per-index ablation: measure impact of each new index
- [ ] Record all results in [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)

**Evaluation Protocol**:
1. Define test queries for each new index type
2. Record baseline search behaviour (likely null or irrelevant results)
3. Implement and index
4. Measure improvement
5. Document in experiment file

---

## Related Documents

- [vocab-gen/](../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/) — Pipeline code (no README yet)
- [ADR-086](../../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) — Graph export pattern
- [vocabulary-value-analysis.md](../../../research/semantic-search/vocabulary-value-analysis.md) — Value score research
- [elasticsearch-optimization-opportunities.md](../../../research/semantic-search/elasticsearch-optimization-opportunities.md) — ES optimization ideas

