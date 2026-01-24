---
name: Problematic Queries Fix
overview: Resolve all problematic queries identified in the investigation (7 Priority 1 + 17 Priority 2 + 25+ Priority 3-4), implement GT and query fixes, add synonyms, and update documentation across all referenced planning files.
todos:
  - id: p1-gt-fixes
    content: "Phase 1.1: Fix 3 ground truth files (cooking-nutrition, english, history)"
    status: pending
  - id: p1-query-redesign
    content: "Phase 1.2: Redesign 2 queries (PE imprecise-input, French natural-expression)"
    status: pending
  - id: p1-synonym
    content: "Phase 1.3: Add 'timetables' synonym to maths.ts"
    status: pending
  - id: p1-benchmark
    content: "Phase 1: Run benchmarks for Priority 1 fixes and verify improvement"
    status: pending
  - id: p2-batch1
    content: "Phase 2: Investigate typo/fuzzy batch (plints, electrisity, rythm)"
    status: pending
  - id: p2-batch2
    content: "Phase 2: Investigate vocabulary batch (ice/water, global warming, singing in tune)"
    status: pending
  - id: p2-batch3
    content: "Phase 2: Investigate cross-topic batch (French verbs, BFG, algebra/graphs)"
    status: pending
  - id: p2-batch4
    content: "Phase 2: Investigate remaining Priority 2 queries"
    status: pending
  - id: p3-investigation
    content: "Phase 3: Investigate Priority 3-4 queries with poor NDCG/P@3/R@10"
    status: pending
  - id: doc-updates
    content: "Phase 4: Update documentation (investigation doc, roadmap, current-state, checklist)"
    status: pending
  - id: final-validation
    content: "Phase 5: Run full benchmark, validate quality gates, record final metrics"
    status: pending
---

# Problematic Queries Resolution Plan

## Context

The [problematic-queries-investigation.md](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/active/problematic-queries-investigation.md) document identifies 49+ queries performing below "good" thresholds. The Priority 1 (zero-hit) queries have been fully investigated with root causes identified and actions categorized.

## Phase 1: Implement Priority 1 Fixes (Already Investigated)

These 7 queries have been investigated. 6 are actionable now, 1 is blocked.

### 1.1 FIX NOW - Ground Truth Corrections (3 files)

| Query | Action | File |

|-------|--------|------|

| `nutrition and cooking techniques together` | Replace GT slugs | [`cooking-nutrition/secondary/cross-topic.expected.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/cooking-nutrition/secondary/cross-topic.expected.ts) |

| `narative writing storys iron man Year 3` | Add slug to GT | [`english/primary/imprecise-input.expected.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/english/primary/imprecise-input.expected.ts) |

| `vikins and anglo saxons` | Expand GT | [`history/primary/cross-topic.expected.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/history/primary/cross-topic.expected.ts) |

**cooking-nutrition/secondary/cross-topic.expected.ts** - Replace:

```typescript
// Current (theory-only, NO cooking techniques)
'eat-well-now': 3,
'making-better-food-and-drink-choices': 2,

// New (cooking + nutrition combined)
'making-pea-and-mint-falafel-with-tzatziki': 3,
'making-toad-in-the-hole': 3,
'making-aloo-gobi': 2,
```

### 1.2 FIX NOW - Query Redesign (2 files)

| Query | Issue | New Query | File |

|-------|-------|-----------|------|

| `footbal skills primary` | "football" not in curriculum (uses "feet") | `feet ball skills ks2` | [`physical-education/primary/imprecise-input.query.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/physical-education/primary/imprecise-input.query.ts) |

| `teach French negative sentences year 7` | English vocab for French curriculum | `French negation ne pas year 7` | [`french/secondary/natural-expression.query.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/french/secondary/natural-expression.query.ts) |

### 1.3 Add Synonym (Bucket A Exact Equivalence)

| Term | Expansion | File |

|------|-----------|------|

| `timetables` | `times table, times tables` | [`maths.ts`](packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/maths.ts) |

The synonym file already has a `times-table` entry (line 46-56). Add `timetables` as an additional entry or expand the existing one.

### 1.4 BLOCKED - Future Functionality Required

| Query | Required Feature | Status |

|-------|------------------|--------|

| `coding for beginners...` | Query rules (beginner intent detection) | Blocked until Level 3 features |

Mark as blocked in progress tracker. Document in [`modern-es-features.md`](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/post-sdk/search-quality/modern-es-features.md) if not already.

---

## Phase 2: Investigate Priority 2 (Very Low MRR < 0.333)

17 queries require the three-phase investigation protocol (1A: Query Analysis, 1B: Discovery + COMMIT, 1C: Comparison).

### Investigation Batch 1 (Typo/Fuzzy Issues)

| Query | Subject | Hypothesis |

|-------|---------|------------|

| `plints and enimals` | science/primary | Severe typos exceed fuzzy limits |

| `electrisity and magnits` | science/secondary | Known fuzzy false positive (magnits -> magnify) |

| `rythm beat ks1` | music/primary | Typo + ranking (R@10 = 1.0) |

### Investigation Batch 2 (Vocabulary Alignment)

| Query | Subject | Hypothesis |

|-------|---------|------------|

| `what makes ice turn into water` | science/primary | "turn into" vs "melting" vocabulary gap |

| `global warming effects` | geography/secondary | "global warming" vs "climate change" |

| `singing in tune for children` | music/primary | "in tune" = pitch, not timing |

### Investigation Batch 3 (Cross-Topic/Ranking)

| Query | Subject | Hypothesis |

|-------|---------|------------|

| `French verbs and vocabulary together` | french/secondary | Cross-topic intersection may not exist |

| `The BFG reading comprehension...` | english/primary | Too specific (book + author + year) |

| `combining algebra with graphs` | maths/secondary | Ranking issue (R@10 = 0.6) |

| `learning to cook healthy lunches` | cooking-nutrition/primary | Ranking issue (R@10 = 0.667) |

### Investigation Batch 4 (Remaining)

| Query | Subject | Notes |

|-------|---------|-------|

| `nutrision healthy food` | cooking-nutrition/secondary | Typo + ranking |

| `counting in groups of` | maths/primary | Query too short/vague |

| `geometry proof coordinate` | maths/secondary | Cross-topic design |

| `sacred texts and ethical teachings` | RE/secondary | Very low NDCG (0.098) |

| `multiplication arrays year 3` | maths/primary | Ranking issue |

| `singing and beat together` | music/primary | Cross-topic ranking |

| `teach students about gothic literature year 8` | english/secondary | Vocabulary alignment |

---

## Phase 3: Investigate Priority 3-4 (MRR >= 0.5 with Poor Other Metrics)

25+ queries have acceptable MRR but poor NDCG/P@3/R@10. These indicate:

- Results found but poorly ranked (low NDCG)
- Top 3 not useful (low P@3)
- Expected slugs not all found (low R@10)

Key patterns to investigate:

| Pattern | Queries | Likely Issue |

|---------|---------|--------------|

| MRR 0.5, NDCG < 0.4 | 5 queries | GT incomplete or search ranking |

| MRR 1.0, R@10 < 0.4 | 4 queries | GT overly broad |

| MRR 1.0, NDCG < 0.5 | 6+ queries | Expected slugs poorly ranked |

---

## Phase 4: Documentation Updates

### 4.1 Update Progress Tracker

In [`problematic-queries-investigation.md`](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/active/problematic-queries-investigation.md):

- Mark Priority 1 fixes as complete
- Add findings for Priority 2-4 queries

### 4.2 Update Current State

In [`current-state.md`](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/current-state.md):

- Update metrics after benchmark
- Document fixes made

### 4.3 Update Roadmap

In [`roadmap.md`](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/roadmap.md):

- Update "Recent Changes" section
- Note problematic queries resolution

### 4.4 Update Checklist

In [`ground-truth-review-checklist.md`](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

- Update subject-phase notes with findings
- Document lessons learned

### 4.5 Update Acceptance Criteria

In [`search-acceptance-criteria.md`](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/search-acceptance-criteria.md):

- Update GT review progress count
- Note any new documented exceptions

---

## Phase 5: Validation and Benchmarks

### 5.1 Quality Gates

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm ground-truth:validate
```

### 5.2 Run Benchmarks

```bash
# Per-subject after fixes
pnpm benchmark -s cooking-nutrition -p secondary --review
pnpm benchmark -s english -p primary --review
pnpm benchmark -s history -p primary --review
pnpm benchmark -s physical-education -p primary --review
pnpm benchmark -s french -p secondary --review
pnpm benchmark -s maths -p primary --review

# Full benchmark after all fixes
pnpm benchmark --all --verbose
```

### 5.3 Record Results

Update session log in problematic-queries-investigation.md with final metrics.

---

## Key Files Reference

| Category | Path |

|----------|------|

| Ground Truth Files | `apps/.../src/lib/search-quality/ground-truth/{subject}/{phase}/*.ts` |

| Synonyms | `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/*.ts` |

| Investigation Doc | `.agent/plans/semantic-search/active/problematic-queries-investigation.md` |

| Roadmap | `.agent/plans/semantic-search/roadmap.md` |

| Current State | `.agent/plans/semantic-search/current-state.md` |

| Checklist | `.agent/plans/semantic-search/active/ground-truth-review-checklist.md` |

| Modern ES Features | `.agent/plans/semantic-search/post-sdk/search-quality/modern-es-features.md` |

---

## Success Criteria

- All Priority 1 "FIX NOW" items implemented and verified
- Priority 2-4 queries investigated with root causes documented
- All affected GT files updated and validated
- Benchmarks run and metrics recorded
- Documentation updated across all referenced files
- No quality gate failures
