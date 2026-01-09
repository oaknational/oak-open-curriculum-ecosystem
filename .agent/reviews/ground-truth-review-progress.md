# Ground Truth Qualitative Review Progress

**Started**: 2026-01-08
**Completed**: 2026-01-08
**Status**: ✅ Complete — All 30 entries reviewed

## Review Criteria Checklist

For each query, verify:

### Query Realism

- [ ] Would a real teacher type this exact query?
- [ ] Is this how someone would naturally search for this content?
- [ ] Is the query too artificial or contrived?

### Specificity (tests ranking, not topic presence)

- [ ] Are only 2-4 lessons truly "highly relevant" (score=3)?
- [ ] If more than 5 slugs, is the query too broad?
- [ ] Does the query distinguish between lessons, not just find "related" content?

### Relevance Score Accuracy

- [ ] Score=3: Does this lesson **directly answer** the query?
- [ ] Score=2: Is this lesson **related and useful** but not the primary answer?
- [ ] Score=1: Is this lesson **tangentially related**?

### Completeness

- [ ] Are there other lessons that should have been included?
- [ ] Are there lessons incorrectly included?

### Category Accuracy

- [ ] Does the assigned category match the query characteristics?

---

## Decision Framework

| Issue Type | Action |
|------------|--------|
| Query unrealistic | Rewrite or delete |
| Too many score=3 slugs | Reassess scores, demote some to 2 or 1 |
| Query too broad | Make more specific or delete |
| Missing relevant lessons | Add with appropriate scores |
| Wrong category | Correct category |
| Relevance scores wrong | Correct based on lesson content |

---

## Progress Tracking

### Core Subjects

| Entry | Queries | Reviewed | Issues Found | Fixed | Notes |
|-------|---------|----------|--------------|-------|-------|
| maths/primary | 37 | [x] | 12 | 12 | Query realism fixes: "one half fraction"→"teaching halves Year 1", "equal parts whole"→"equal parts of a whole", etc. |
| maths/secondary | 135 | [x] | 0 | 0 | All queries realistic, well-categorized, good score distribution |
| english/primary | 14 | [x] | 0 | 0 | Well-structured queries with primary texts (BFG, Iron Man, traditional tales) |
| english/secondary | 57 | [x] | 0 | 0 | Comprehensive GCSE text coverage (Shakespeare, 19th-c, poetry) |
| science/primary | 15 | [x] | 0 | 0 | Good coverage of primary biology/physics/chemistry |
| science/secondary | 35 | [x] | 0 | 0 | Comprehensive coverage of biology/chemistry/physics |

### Humanities

| Entry | Queries | Reviewed | Issues Found | Fixed | Notes |
|-------|---------|----------|--------------|-------|-------|
| history/primary | 6 | [x] | 0 | 0 | Romans, Vikings, Anglo-Saxons coverage |
| history/secondary | 15 | [x] | 0 | 0 | Medieval, modern, KS4 depth studies |
| geography/primary | 7 | [x] | 0 | 0 | Local area, UK, mapping |
| geography/secondary | 14 | [x] | 0 | 0 | Physical + human geography, KS4 fieldwork |
| religious-education/primary | 7 | [x] | 0 | 0 | World religions basics |
| religious-education/secondary | 7 | [x] | 0 | 0 | Buddhism, ethics, philosophy |
| citizenship/secondary | 6 | [x] | 0 | 0 | Democracy, rights, active citizenship |

### Languages (MFL)

| Entry | Queries | Reviewed | Issues Found | Fixed | Notes |
|-------|---------|----------|--------------|-------|-------|
| french/primary | 6 | [x] | 0 | 0 | Structural content focus (no transcripts) |
| french/secondary | 6 | [x] | 0 | 0 | Grammar/negation queries |
| spanish/primary | 6 | [x] | 0 | 0 | Structural content focus (no transcripts) |
| spanish/secondary | 6 | [x] | 0 | 0 | AR verbs, ser/estar queries |
| german/secondary | 6 | [x] | 0 | 0 | Present tense weak verbs |

### Creative Subjects

| Entry | Queries | Reviewed | Issues Found | Fixed | Notes |
|-------|---------|----------|--------------|-------|-------|
| art/primary | 7 | [x] | 0 | 0 | Drawing, painting, mark-making |
| art/secondary | 9 | [x] | 0 | 0 | Art movements, portraiture, wellbeing |
| music/primary | 7 | [x] | 0 | 0 | Singing, rhythm, instruments |
| music/secondary | 9 | [x] | 0 | 0 | Film music, blues, EDM, drumming |
| design-technology/primary | 7 | [x] | 0 | 0 | Mechanisms, CAD, structures |
| design-technology/secondary | 9 | [x] | 0 | 0 | Materials, ergonomics, sustainability |

### Practical Subjects

| Entry | Queries | Reviewed | Issues Found | Fixed | Notes |
|-------|---------|----------|--------------|-------|-------|
| computing/primary | 7 | [x] | 0 | 0 | Digital skills, networks, internet |
| computing/secondary | 9 | [x] | 0 | 0 | Python, networking, cybersecurity |
| physical-education/primary | 18 | [x] | 0 | 0 | Ball skills, games, swimming, dance |
| physical-education/secondary | 9 | [x] | 0 | 0 | Athletics, fitness, invasion games |
| cooking-nutrition/primary | 6 | [x] | 0 | 0 | Healthy eating, recipes, food around world |
| cooking-nutrition/secondary | 8 | [x] | 0 | 0 | Eatwell Guide, macronutrients, recipes |

---

## Summary

| Category | Entries | Total Queries | Reviewed | Issues | Fixed |
|----------|---------|---------------|----------|--------|-------|
| Core | 6 | 293 | 6 | 12 | 12 |
| Humanities | 7 | 62 | 7 | 0 | 0 |
| Languages | 5 | 30 | 5 | 0 | 0 |
| Creative | 6 | 48 | 6 | 0 | 0 |
| Practical | 6 | 57 | 6 | 0 | 0 |
| **Total** | **30** | **490** | **30** | **12** | **12** |

---

## Findings Log

### Patterns Identified

1. **Query Realism Issue in maths/primary**: Several queries used awkward word order ("one half fraction", "equal parts whole", "triangles shapes properties"). Fixed by rewriting to natural teacher phrasing.

2. **Score Distribution**: Many queries correctly use graded relevance (3, 2, 1) demonstrating proper ranking test design.

3. **Category Coverage**: All 6 categories (naturalistic, misspelling, synonym, multi-concept, colloquial, intent-based) are well-represented across subjects.

4. **MFL Limitation Acknowledged**: French, Spanish, German ground truths properly note transcript limitations and focus on structural content.

### Anti-Patterns Found

1. **Awkward Keyword Phrases**: Queries like "one half fraction" instead of "teaching halves Year 1" - not how teachers actually search.

2. **Missing Conjunctions**: "equal parts whole" instead of "equal parts of a whole".

3. **Reversed Word Order**: "triangles shapes properties" instead of "properties of triangles".

### Lessons Learned

1. **Query Design**: Always read queries aloud - if it sounds unnatural, a teacher wouldn't type it.

2. **Score Granularity**: Having at least one score=3, one score=2, and where appropriate score=1 creates effective ranking tests.

3. **Validation Integration**: The 17 automated checks catch structural issues, but semantic quality requires human review.

### Changes Made

All 12 issues were in maths/primary:

- `fractions.ts`: 5 queries reworded for natural phrasing
- `geometry.ts`: 3 queries reworded for correct word order
- `number.ts`: 2 queries reworded
- `hard-queries.ts`: 2 queries reworded
