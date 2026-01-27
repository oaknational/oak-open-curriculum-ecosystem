# Ground Truth Review Sessions — January 2026

**Archived**: 2026-01-26  
**Original Location**: `current-state.md` (historical session logs)  
**Status**: Historical reference only

This file contains the session-by-session logs from the original ground truth review process (120 queries, 4 categories per subject-phase). This approach has been superseded by a revised strategy — see `ground-truth-redesign-plan.md`.

---

## Session 2026-01-24 Progress

### Validation Status: PASSING

`pnpm ground-truth:validate` **PASSES** with 0 errors.

All validation errors fixed:

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

---

## Science GT Fixes + Query Tuning (2026-01-23)

All 32 Science queries benchmarked and validated.

**Final Metrics (Post-Tuning)**:

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY (13 queries) | 0.836 | 0.737 | 0.641 | 0.723 |
| SECONDARY (19 queries) | 0.932 | 0.731 | 0.561 | 0.741 |
| **OVERALL** | **0.893** | 0.733 | 0.594 | 0.734 |

**Changes Made**:

1. **`minimum_should_match: '2<65%'`** — Changed from `75%` to conditional matching
2. **Fixed "energy transfers and efficiency" GT** — Search was correct, GT was wrong
3. **Fixed "plants and animals" GT** — Added `animal-habitats`, `protecting-microhabitats`
4. **Added control queries** — "electricity and magnets", "plants and animals"

---

## Religious Education Phase 1C COMPLETE (2026-01-21)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.875 | 0.677 | 0.583 | 0.750 |
| SECONDARY | 0.640 | 0.526 | 0.467 | 0.510 |

**Key Learning**: Original GT was COMPLETELY wrong for 6 of 9 queries — Sikh-specific content used for generic queries.

---

## Physical Education Phase 1C COMPLETE (2026-01-21)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.833 | 0.797 | 0.583 | 0.875 |
| SECONDARY | 0.813 | 0.725 | 0.667 | 0.787 |

**Key Learning**: Structure-only retrieval works well for PE once GT is correct.

---

## Music Phase 1C Complete (2026-01-20)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.781 | 0.567 | 0.417 | 0.750 |
| SECONDARY | 0.813 | 0.854 | 0.500 | 1.000 |

---

## Maths Phase 1C Complete (2026-01-20)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.675 | 0.607 | 0.500 | 0.683 |
| SECONDARY | 0.861 | 0.749 | 0.667 | 0.828 |

**Key Learnings**:

- Query register must match content level
- Tokenization ≠ fuzzy matching (word boundary issues need synonyms)
- Cross-topic GTs must reflect curriculum reality
- Secondary outperforms Primary (standardised vs fragmented vocabulary)

---

## Baseline Results (2026-01-13)

**Overall**: MRR=0.513 | Zero-hit rate=24.2%

---

## Subject Hierarchy Enhancement (2026-01-22)

The `subject_parent` field was implemented and verified. Science secondary searches now correctly include physics, chemistry, biology, and combined-science lessons.

**ADR**: ADR-101: Subject Hierarchy for Search Filtering

---

## Related ADRs

| ADR | Decision |
|-----|----------|
| ADR-085 | Three-stage validation model |
| ADR-098 | Split file architecture |
| ADR-099 | RRF normalisation fix |
| ADR-100 | Synonym coverage |
| ADR-101 | `subject_parent` for Science KS4 |
| ADR-102 | Conditional minimum_should_match |
| ADR-103 | Fuzzy matching limitations |
| ADR-104 | Domain term boosting (proposed) |

---

## Note

This historical record documents the first-pass GT review using 120 queries with 4 categories per subject-phase. The strategic revision (2026-01-26) identified that:

1. 66/78 natural-expression queries were clipped term lists, not natural phrasing
2. 30 typo queries was overkill — 5-10 proves fuzzy matching works
3. Cross-topic had questionable value — many were random mashups
4. Uniform distribution ignored content volume — maths needs more than cooking

See `ground-truth-redesign-plan.md` for the revised strategy.
