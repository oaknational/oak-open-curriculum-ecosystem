# Ground Truth Review Sessions 1-5 Log

**Archived**: 2026-03-07  
**Original Period**: 2026-01-13 to 2026-01-14  
**Status**: Superseded historical reference

---

## Summary

Sessions 1-5 reviewed 5/30 subject-phases (20/120 ground truths). This work
established key learnings but was conducted before fully understanding the
search architecture. We are now restarting the review with enhanced
understanding.

---

## Session 1: art/primary (2026-01-13)

**Aggregate MRR**: 0.875

| Category | MRR | Changes |
|----------|-----|---------|
| precise-topic | 1.000 | None |
| natural-expression | 1.000 | None |
| imprecise-input | 0.500 | Removed redundant "primary", replaced mark-making with painting slug |
| cross-topic | 1.000 | None |

**Key Learning**: Queries should not duplicate filter terms (e.g., "primary"
when already filtering to primary phase).

---

## Session 2: art/secondary (2026-01-14)

**Aggregate MRR**: 0.875

| Category | MRR | Changes |
|----------|-----|---------|
| precise-topic | 1.000 | None |
| natural-expression | 1.000 | Replaced art-as-self-discovery with personal-to-universal-art-as-connection |
| imprecise-input | 0.500 | Replaced mark-making-using-different-tools with drawing-for-different-purposes-and-needs |
| cross-topic | 1.000 | Replaced tone-hue-and-colour with exploring-portraits-through-paint |

**Key Learning**: Expected slugs must explicitly combine concepts tested by the
query.

---

## Session 3: citizenship/secondary (2026-01-14)

**Aggregate MRR**: 1.000

| Category | MRR | Changes |
|----------|-----|---------|
| precise-topic | 1.000 | Replaced voter-registration slugs with UK democracy/elections lessons |
| natural-expression | 1.000 | Replaced fairness-action slug with rights-origin lesson |
| imprecise-input | 1.000 | **REDESIGNED**: "UK goverment parliament democracy" → "parliment functions and roles" |
| cross-topic | 1.000 | Replaced rules/media slugs with democracy+rule-of-law lessons |

**Key Learning**: Imprecise-input typos must be ESSENTIAL — verify by comparing
results with/without the typo term. The original query had correctly-spelled
terms that bypassed the typo.

---

## Session 4: computing/primary (2026-01-14)

**Aggregate MRR**: 0.500 (0.611 excl. natural-expression)

| Category | MRR | Changes |
|----------|-----|---------|
| precise-topic | 1.000 | Added third expected slug |
| natural-expression | 0.167 | Replaced introduction-to-information-technology with making-choices-when-using-information-technology |
| imprecise-input | 0.333 | Verified typo "internat" IS essential via ES diagnostics |
| cross-topic | 0.500 | Replaced programming-sprites with programming-sequences |

**Key Learning**: ES diagnostics ("how does work" without typo) confirm typo
contribution.

---

## Session 5: computing/secondary (2026-01-14)

**Aggregate MRR**: 0.875 (1.000 excl. natural-expression)

| Category | MRR | Changes |
|----------|-----|---------|
| precise-topic | 1.000 | None |
| natural-expression | 0.500 | Replaced with KS3 intro lessons (correct for "beginners" intent) |
| imprecise-input | 1.000 | **SEMANTIC INTENT**: Changed from database-fundamentals to sql-searches |
| cross-topic | 1.000 | Replaced mathematical-operations with iterating-through-data-structures |

**Key Learning**: **Semantic Intent Principle** — Expected slugs must match what
the query semantically means. For "databse querying", the intent is SQL
queries, not database structure.

---

## Established Principles

1. **Differentiation**: Query must add value beyond subject+phase filter
2. **Imprecise-input design**: Typo must be ESSENTIAL — verify via ES
   diagnostics
3. **Curriculum exploration**: Find qualitatively best matches, not just top
   results
4. **Expected slugs match intent**: Update slugs to match query's semantic
   meaning
5. **Skill level matching**: "coding for beginners" should return KS3 intro,
   not KS4 advanced
6. **Semantic understanding**: Search understands meaning — SQL SELECT is
   "querying", even without "database" in title

---

## Why Restarting

Sessions 1-5 were conducted before fully understanding the search architecture:

- **Structure** (`lesson_structure` field): ALL lessons have BM25 + ELSER
  retrievers — the foundation
- **Content** (`lesson_content` field): SOME lessons have BM25 + ELSER
  retrievers (where transcripts exist) — a bonus
- **Combined via RRF**: Where content exists, 4 retrievers work together;
  otherwise 2 retrievers (Structure only)

This understanding changes how we interpret results and design ground truths.
We are restarting the review with this enhanced foundation, using four
exploration methods: gt-review (search service), direct ES queries, MCP tools,
and bulk data.

---

## Files Modified in Sessions 1-5

### Ground Truth Files

- `art/primary/imprecise-input.ts`
- `art/secondary/natural-expression.ts`
- `art/secondary/imprecise-input.ts`
- `art/secondary/cross-topic.ts`
- `citizenship/secondary/precise-topic.ts`
- `citizenship/secondary/natural-expression.ts`
- `citizenship/secondary/imprecise-input.ts`
- `citizenship/secondary/cross-topic.ts`
- `computing/primary/precise-topic.ts`
- `computing/primary/natural-expression.ts`
- `computing/primary/cross-topic.ts`
- `computing/secondary/natural-expression.ts`
- `computing/secondary/imprecise-input.ts`
- `computing/secondary/cross-topic.ts`

### Documentation Files

- `.agent/prompts/semantic-search/semantic-search.prompt.md`
- `.agent/plans/semantic-search/roadmap.md` (successor to the historical `current-state.md`)
- `.agent/plans/semantic-search/archive/completed/ground-truth-review-checklist.md`
- `apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md`

---

## Next Steps

Restart ground truth review from art/primary with enhanced understanding of
search architecture.
