---
name: RE GT Phase 1C
overview: Phase 1C comparison for all 9 Religious Education queries - three-way comparison (YOUR rankings vs SEARCH results vs EXPECTED slugs), metrics collection, and documentation.
todos:
  - id: 1c-primary-precise
    content: "PRIMARY precise-topic 1C: Read expected, run benchmark, three-way comparison, critical question"
    status: completed
  - id: 1c-primary-natural
    content: "PRIMARY natural-expression 1C: Read expected, run benchmark, three-way comparison, critical question"
    status: completed
  - id: 1c-primary-imprecise
    content: "PRIMARY imprecise-input 1C: Read expected, run benchmark, three-way comparison, critical question"
    status: completed
  - id: 1c-primary-cross
    content: "PRIMARY cross-topic 1C: Read expected, run benchmark, three-way comparison, critical question"
    status: completed
  - id: 1c-secondary-precise
    content: "SECONDARY precise-topic 1C: Read expected, run benchmark, three-way comparison, critical question"
    status: completed
  - id: 1c-secondary-natural
    content: "SECONDARY natural-expression 1C: Read expected, run benchmark, three-way comparison, critical question"
    status: completed
  - id: 1c-secondary-imprecise
    content: "SECONDARY imprecise-input 1C: Read expected, run benchmark, three-way comparison, critical question"
    status: completed
  - id: 1c-secondary-cross
    content: "SECONDARY cross-topic 1C: Read expected, run benchmark, three-way comparison, critical question"
    status: completed
  - id: 1c-secondary-cross2
    content: "SECONDARY cross-topic-2 1C: Read expected, run benchmark, three-way comparison (academic query)"
    status: completed
  - id: phase2-validation
    content: "PHASE 2: Run type-check, ground-truth:validate, benchmark (both phases), record aggregate metrics"
    status: pending
  - id: phase3-documentation
    content: "PHASE 3: Update checklist with metrics and learnings, update GT files if needed"
    status: pending
  - id: todo-1769014929303-o2blzx5d7
    content: Review
    status: pending
  - id: todo-1769014937737-8a8yldcpt
    content: ""
    status: pending
---

# Religious Education Ground Truth Review: Phase 1C Comparison

**Last Updated**: 2026-01-21

**Status**: PLANNING

**Scope**: Three-way comparison for all 9 RE queries, metrics collection, validation, and documentation.

---

## Context

Phase 1B (complete) committed independent rankings for all 9 RE queries based on curriculum content analysis. Phase 1C NOW allows reading `.expected.ts` files and running benchmark to compare THREE sources:

1. **YOUR committed rankings** (from Phase 1B)
2. **SEARCH results** (from benchmark)
3. **EXPECTED slugs** (from `.expected.ts` files - first time seeing them!)

### Prerequisite: Phase 1B Complete

All COMMIT tables completed for 9 queries:

**PRIMARY (4 queries)**:

- `precise-topic`: "religious founders and leaders" - Top: guru-nanak (3)
- `natural-expression`: "why do people pray" - Top: introducing-prayer (3)
- `imprecise-input`: "relegion stories primary" - Top: stories-and-deeper-meanings (3)
- `cross-topic`: "places of worship and religious festivals" - Top: harvest-festival-in-uk (3)

**SECONDARY (5 queries)**:

- `precise-topic`: "religious beliefs and practices" - Top: different-forms-of-worship (3)
- `natural-expression`: "right and wrong philosophy" - Top: christian-teachings-about-good-and-evil (3)
- `imprecise-input`: "meditaton and prayer practices" - Top: forms-of-worship (3)
- `cross-topic`: "sacred texts and ethical teachings" - Top: ten-commandments (3)
- `cross-topic-2`: "East-West Schism..." - Top: the-trinity-and-orthodox-christianity (2)

### Cardinal Rules (from semantic-search.prompt.md)

1. **The search might be RIGHT. Expected slugs might be WRONG.**
2. **Three-way comparison is MANDATORY** - YOUR rankings vs SEARCH vs EXPECTED

---

## Foundation Document Commitment

Before beginning work:

1. **Re-read** `.agent/directives-and-memory/rules.md` - Core principles
2. **Re-read** `.agent/prompts/semantic-search/semantic-search.prompt.md` - Protocol rules
3. **Verify**: COMMIT tables from Phase 1B are complete and documented

---

## Resolution Plan

### Phase 1C: Comparison (All 9 Queries)

**Key Principle**: NOW we can read `.expected.ts` files and run benchmark. Compare THREE sources for each query.

---

#### Task 1C.1: PRIMARY precise-topic — "religious founders and leaders"

**YOUR Committed Rankings (from Phase 1B)**:

1. guru-nanak (3)
2. the-idea-of-a-buddha (3)
3. prophet-muhammad-the-leader (3)
4. moses-and-the-exodus (3)
5. the-legacy-of-guru-nanak (2)

**Step 1C.1.1: Read Expected Slugs (FIRST TIME)**

```bash
cat src/lib/search-quality/ground-truth/religious-education/primary/precise-topic.expected.ts
```

**Step 1C.1.2: Run Benchmark**

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark -s religious-education -p primary -c precise-topic --review
```

**Step 1C.1.3: Create Three-Way Comparison Table**

| Slug | YOUR Rank | SEARCH Rank | EXPECTED Score | Verdict |

|------|-----------|-------------|----------------|---------|

| ... | ... | ... | ... | ... |

**Step 1C.1.4: Critical Question**

> "What are the BEST slugs for this query — and where did they come from?"

**Acceptance Criteria**:

- Expected slugs read and documented
- Benchmark output recorded with ALL 4 metrics (MRR, NDCG@10, P@3, R@10)
- Three-way comparison table complete
- Critical question answered with justification
- Decision made: GT correct / Search better / Your candidates better / Mix

---

#### Task 1C.2: PRIMARY natural-expression — "why do people pray"

**YOUR Committed Rankings**:

1. introducing-prayer (3)
2. comparing-prayer-and-reflection (3)
3. different-christian-prayers (2)
4. different-muslim-prayers (2)
5. salat-finding-harmony-through-daily-prayer (2)

**Step 1C.2.1-4**: Follow same structure as Task 1C.1

---

#### Task 1C.3: PRIMARY imprecise-input — "relegion stories primary"

**YOUR Committed Rankings**:

1. stories-and-deeper-meanings (3)
2. shared-stories (3)
3. the-story-of-the-good-samaritan (3)
4. the-story-of-the-lost-son (3)
5. hindu-stories-of-creation (2)

**Step 1C.3.1-4**: Follow same structure as Task 1C.1

---

#### Task 1C.4: PRIMARY cross-topic — "places of worship and religious festivals"

**YOUR Committed Rankings**:

1. harvest-festival-in-uk (3)
2. the-jewish-festival-of-sukkot (2)
3. belonging-to-a-mosque (2)
4. diwali-in-india-and-the-uk (2)
5. the-celebration-of-holi (2)

**Note**: Limited true intersection in curriculum - most content separates these topics.

**Step 1C.4.1-4**: Follow same structure as Task 1C.1

---

#### Task 1C.5: SECONDARY precise-topic — "religious beliefs and practices"

**YOUR Committed Rankings**:

1. different-forms-of-worship (3)
2. the-six-beliefs-of-sunni-islam (3)
3. diverse-beliefs-regarding-sacraments (3)
4. beliefs-about-death-and-the-afterlife (3)
5. contrasting-worship-in-islam-and-christianity (2)

**Step 1C.5.1-4**: Follow same structure as Task 1C.1 (using secondary paths)

---

#### Task 1C.6: SECONDARY natural-expression — "right and wrong philosophy"

**YOUR Committed Rankings**:

1. christian-teachings-about-good-and-evil (3)
2. the-nature-of-human-goodness (3)
3. virtue-ethics (3)
4. situation-ethics (3)
5. dhamma-moral-precepts (2)

**Step 1C.6.1-4**: Follow same structure as Task 1C.1

---

#### Task 1C.7: SECONDARY imprecise-input — "meditaton and prayer practices"

**YOUR Committed Rankings**:

1. forms-of-worship (3)
2. salah-as-one-of-the-five-pillars (3)
3. how-and-why-muslims-perform-salah (3)
4. the-five-pillars (2)
5. baptism-and-the-eucharist (2)

**Note**: Limited meditation-specific content in secondary RE.

**Step 1C.7.1-4**: Follow same structure as Task 1C.1

---

#### Task 1C.8: SECONDARY cross-topic — "sacred texts and ethical teachings"

**YOUR Committed Rankings**:

1. ten-commandments (3)
2. two-great-commandments (3)
3. muslims-and-shariah-law (3)
4. worship-using-the-bible (2)
5. muslim-teachings-about-good-evil-and-suffering (2)

**Step 1C.8.1-4**: Follow same structure as Task 1C.1

---

#### Task 1C.9: SECONDARY cross-topic-2 — "East-West Schism..."

**YOUR Committed Rankings**:

1. the-trinity-and-orthodox-christianity (2)
2. the-pope-and-protestantism (2)
3. predestination-across-denominations (2)
4. martin-luther-and-the-reformation (2)
5. the-church-in-the-worldwide-community (1)

**Note**: HIGH DIFFICULTY academic query - curriculum gap identified (no direct East-West Schism or ecumenical content).

**Step 1C.9.1-4**: Follow same structure as Task 1C.1

---

## Phase 2: Validation

### Task 2.1: Run Validation Suite

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject religious-education --phase primary --verbose
pnpm benchmark --subject religious-education --phase secondary --verbose
```

### Task 2.2: Record Aggregate Metrics

**PRIMARY**:

| Category | MRR | NDCG | P@3 | R@10 | Changes Made |

|----------|-----|------|-----|------|--------------|

| precise-topic | ***|*** | ***|*** | Yes/No |

| natural-expression | ***|*** | ***|*** | Yes/No |

| imprecise-input | ***|*** | ***|*** | Yes/No |

| cross-topic | ***|*** | ***|*** | Yes/No |

| **AGGREGATE** | ***|*** | ***|*** | |

**SECONDARY**:

| Category | MRR | NDCG | P@3 | R@10 | Changes Made |

|----------|-----|------|-----|------|--------------|

| precise-topic | ***|*** | ***|*** | Yes/No |

| natural-expression | ***|*** | ***|*** | Yes/No |

| imprecise-input | ***|*** | ***|*** | Yes/No |

| cross-topic | ***|*** | ***|*** | Yes/No |

| cross-topic-2 | ***|*** | ***|*** | Yes/No |

| **AGGREGATE** | ***|*** | ***|*** | |

**Acceptance Criteria**:

- type-check passed
- ground-truth:validate passed
- benchmark completed for both phases
- All 9 queries have all 4 metrics recorded

---

## Phase 3: Documentation

### Task 3.1: Update Checklist

Update [ground-truth-review-checklist.md](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

- Mark religious-education/primary complete with metrics
- Mark religious-education/secondary complete with metrics
- Record key learnings
- Record changes made

### Task 3.2: Update GT Files (if needed)

If three-way comparison revealed better slugs, update:

- `src/lib/search-quality/ground-truth/religious-education/*/CATEGORY.expected.ts`

**Acceptance Criteria**:

- Checklist updated with all metrics
- Key learnings documented
- Any GT changes documented with justification

---

## Success Criteria

### Phase 1C

- All 9 queries have three-way comparison tables
- All 9 queries have critical question answered
- All 9 queries have all 4 metrics recorded
- Decisions documented: GT correct / Search better / Your candidates better / Mix

### Phase 2

- type-check passed
- ground-truth:validate passed
- Aggregate metrics recorded for both PRIMARY and SECONDARY

### Phase 3

- Checklist updated
- Key learnings documented
- GT files updated if changes needed

---

## Anti-Pattern: Retroactive Discovery

### WRONG (Validates Search After Seeing Results)

1. Read expected slugs
2. Run benchmark
3. See search returns A, B, C
4. Retroactively justify A, B, C as "good matches"
5. Three-way table shows all columns identical

### CORRECT (Independent Discovery Already Done)

1. COMMIT table from Phase 1B shows YOUR rankings (X, Y, Z)
2. NOW read expected slugs (A, B, ?)
3. NOW run benchmark - see search returns (A, C, D)
4. Three-way comparison reveals differences
5. Critical question: "Which source has the BEST slugs?"

---

## References

- Query files: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/religious-education/`
- Protocol: `.agent/plans/semantic-search/templates/ground-truth-session-template.md`
- Foundation: `.agent/directives-and-memory/rules.md`
- Previous plan: `.cursor/plans/re_gt_phase_1b_*.plan.md`
