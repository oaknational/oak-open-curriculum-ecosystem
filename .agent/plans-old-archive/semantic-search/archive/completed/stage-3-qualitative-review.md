# Stage 3 Qualitative Review: Comprehensive Critical Review Plan

**Status**: ✅ **COMPLETED** (2026-01-09)
**Created**: 2026-01-09
**Completed**: 2026-01-09
**Purpose**: Exhaustive critical review of every single ground truth query
**Scope**: 474 queries across 30 entries

---

## Completion Summary

This plan was executed and completed on 2026-01-09. All criteria were met.

### Results

| Metric | Value |
|--------|-------|
| Total queries reviewed | 474 |
| Total slugs validated | 1,290 |
| Subject/phase entries | 30 |
| Issues found | 1 |
| Issues fixed | 1 |

### Issue Log

| Entry | Query | Issue | Resolution |
|-------|-------|-------|------------|
| maths/primary | times tables year 3 | Wrong category | cross-topic → precise-topic |

### Documentation

- **Results**: [Stage 3 Review Progress](../../../reviews/stage-3-review-progress.md)
- **ADR Update**: [ADR-085](../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)

---

## Original 10-Point Review Checklist

For reference, each query was reviewed against:

1. **Query realism**: Would a teacher actually type this?
2. **Query length**: 3-7 words (single-word only for `imprecise-input`)
3. **Slug existence**: All slugs exist in bulk data
4. **Relevance accuracy**: Scores match lesson content (3=direct, 2=related, 1=tangential)
5. **Completeness**: No relevant lessons missing
6. **Slug count**: ≤5 slugs per query
7. **Score distribution**: At least one score=3, varied scores
8. **Category accuracy**: Category matches query type
9. **Priority accuracy**: Priority reflects importance
10. **Description quality**: Description explains what the query tests

---

## Category Coverage Requirements

All 30 entries verified to meet:

| Category | Minimum |
|----------|---------|
| `precise-topic` | 4+ |
| `natural-expression` | 2+ |
| `imprecise-input` | 1+ |
| `cross-topic` | 1+ |

---

## Bulk Data Commands Reference

```bash
# Count lessons in bulk data file
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons | length'

# List all lesson slugs
cat bulk-downloads/{subject}-{phase}.json | jq -r '.lessons[].lessonSlug'

# Search by keyword in title
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | {slug: .lessonSlug, title: .lessonTitle}'

# Get specific lesson by slug
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons[] | select(.lessonSlug == "SLUG")'

# Search by keyword in slug
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons[] | select(.lessonSlug | test("KEYWORD"; "i")) | .lessonSlug'

# List lessons in a unit
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons[] | select(.unitTitle | test("UNIT_KEYWORD"; "i")) | {slug: .lessonSlug, title: .lessonTitle}'
```

---

## MCP Tools for Verification

```bash
# Get lesson summary
get-lessons-summary lesson:{slug}

# Search for lessons
search q:"{query}" subject:{subject} keyStage:{ks}

# Get unit details
get-units-summary unit:{unit-slug}
```

---

## Completion Criteria (All Met ✓)

1. ✅ All 30 entries have status COMPLETE in progress tracker
2. ✅ All queries (474) have been individually reviewed using the 10-point checklist
3. ✅ All issues have been documented in Issues Log
4. ✅ All issues have been corrected
5. ✅ All entries meet category coverage requirements
6. ✅ Coverage matrix is complete
7. ✅ All quality gates pass
8. ✅ Ground truth validation passes
9. ✅ Review summary document is complete
10. ✅ ADR-085 is updated with Stage 3 completion

---

## Deep Verification (Sampling)

Post-review, 15 queries across maths and english were verified against lesson summaries:

- Relevance scores match actual lesson content
- No obviously missing lessons in verified queries
- Vocabulary bridging works as intended (e.g., "rearrange formulas" → "changing the subject")

---

## Sign-Off

Ground truths are **production-ready** for Phase 8 benchmarks.
