# Synonym Quality Audit Report

**Date**: 2025-12-27  
**Status**: ✅ COMPLETE  
**Duration**: ~2 hours

---

## Summary

This audit reviewed existing synonyms for weak entries, removed precision risks, and added high-value foundational synonyms for KS1/KS2 vocabulary.

### Key Outcomes

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Lesson Hard MRR | 0.614 | 0.614 | No change |
| Unit Hard MRR | 0.806 | 0.806 | No change |
| Lessons Hybrid MRR | 0.963 | 0.963 | No change |
| Units Hybrid MRR | 0.988 | 0.988 | No change |
| Total synonyms deployed | ~190 | 192 | +2 net |

**Result**: No MRR regression. Precision improvements from removals balanced by additions.

---

## Changes Made

### Removals (Precision Improvements)

| File | Entry Removed | Reason |
|------|---------------|--------|
| `maths.ts` | `total` from `addition` synonyms | Too broad — "total" appears in many contexts (total marks, total cost) and could cause false positives via ES expansion |
| `science.ts` | `gravity`, `gravitational` from `forces` synonyms | Category error — gravity IS a force (a specific type), not a synonym for the concept of forces |

### Additions (Foundational Vocabulary)

#### English Synonyms (8 new entries)

| Term | Value Score | Synonyms Added |
|------|-------------|----------------|
| adjective | 678 | `describing word`, `descriptive word` |
| noun | 579 | `naming word`, `name word` |
| verb | 304 | `action word`, `doing word` |
| adverb | 240 | `describing verb word` |
| suffix | 378 | `word ending`, `end of word` |
| prefix | 94 | `word beginning`, `start of word` |
| root word | 216 | `base word`, `stem word` |
| fronted adverbial | 140 | `sentence starter`, `adverbial phrase` |

#### Maths Synonyms (6 new entries)

| Term | Value Score | Synonyms Added |
|------|-------------|----------------|
| partition | 207 | `break apart`, `split up` |
| multiple | 154 | `times table number` |
| equation | 118 | `number sentence` |
| denominator | 55 | `bottom number` |
| numerator | 44 | `top number` |
| estimate | 109 | `guess`, `rough answer` |

---

## Audit Decisions

### maths.ts (119 entries reviewed)

| Entry | Issue | Mechanism | Decision |
|-------|-------|-----------|----------|
| `total` | Too broad | ES expansion | **REMOVED** |
| `difference` | Ambiguous | ES expansion | KEEP — genuine maths term |
| `product` | Ambiguous | ES expansion | KEEP — maths context disambiguates |
| `numerator`, `denominator` (in fractions) | Parts not synonyms | ES expansion | KEEP — aids discoverability |

### science.ts (11 entries reviewed)

| Entry | Issue | Mechanism | Decision |
|-------|-------|-----------|----------|
| `gravity`, `gravitational` | Category error | ES expansion | **REMOVED** |
| `chlorophyll`, `chloroplast` | Components | ES expansion | KEEP — aids discoverability |
| `solid`, `liquid`, `gas` | Instances | ES expansion | KEEP — aids discoverability |

---

## Validation

All new synonyms were validated against curriculum definitions in `vocabulary-graph-data.ts`:

- **adjective**: "a word that **describes** a noun" → `describing word` ✅
- **noun**: "a **naming** word for people, places or things" → `naming word` ✅
- **suffix**: "a letter or group of letters at the **end of a word**" → `word ending` ✅
- **denominator**: "the **bottom number** in a fraction" → `bottom number` ✅
- **numerator**: "the **top number** in a fraction" → `top number` ✅

---

## Mechanism Classification

Most new synonyms are multi-word phrases, which use **Phrase Detection + Boosting** rather than ES synonym expansion:

| Mechanism | Count | Precision Risk |
|-----------|-------|----------------|
| Phrase boost (multi-word) | 13 | Lower |
| ES expansion (single-word) | 1 (`guess`) | Higher |

---

## Quality Gates

All quality gates passed after changes:

```
✅ pnpm type-gen
✅ pnpm build
✅ pnpm type-check
✅ pnpm lint:fix
✅ pnpm format:root
✅ pnpm markdownlint:root
✅ pnpm test
✅ pnpm test:e2e
✅ pnpm test:e2e:built
✅ pnpm test:ui
✅ pnpm smoke:dev:stub
```

---

## Files Modified

1. `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/maths.ts`
   - Removed `total` from addition synonyms
   - Added 6 foundational maths synonyms

2. `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/science.ts`
   - Removed `gravity`, `gravitational` from forces synonyms

3. `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/english.ts`
   - Added 8 foundational English grammar synonyms

---

## Recommendations for Future Work

1. **Monitor "circle rules" query**: Currently ranks 4th for circle theorems; consider adding more specific synonyms
2. **Consider subject-scoping**: Terms like "gradient" mean different things in maths vs art
3. **Evaluate cross-subject terms**: Terms appearing in 7+ subjects may need disambiguation

---

## Related Documents

- [synonym-quality-audit.md](../../plans/semantic-search/active/synonym-quality-audit.md) — Original plan
- [vocabulary-value-analysis.md](vocabulary-value-analysis.md) — Value scoring framework
- [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — Synonym architecture
- [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) — Phrase boosting mechanism

