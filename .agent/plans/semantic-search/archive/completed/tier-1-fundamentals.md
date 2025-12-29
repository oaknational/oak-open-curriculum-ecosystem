# Archive: Tier 1 Fundamentals — EXHAUSTED

**Status**: ✅ Complete  
**Completed**: 2025-12-24  
**Original Location**: `part-1-search-excellence/01-tier-1-fundamentals.md`

---

## Summary

All Tier 1 (Search Fundamentals) improvements were exhausted, achieving MRR 0.614 against a target of ≥0.45 (+36% above target).

---

## What Was Done

1. **Synonym Diagnostic Coverage** — All patterns verified working:
   - Single-word synonyms (`trig`, `factorise`, `pythag`)
   - Phrase synonyms (handled by B.5 phrase boosting)
   - UK/US spelling variants (ELSER handles automatically)
   - Abbreviation expansion (`pythag`, `quad`, `diff`)
   - Technical vocabulary (`transposition`)

2. **Intent-Based Query Analysis** — Exception documented:
   - Queries like "challenging extension work for able mathematicians" require metadata not in the upstream API
   - These are Tier 4 problems, not solvable with Tier 1 approaches

3. **Bulk Download Vocabulary Mining** — Top 20 keywords analysed:
   - No critical vocabulary gaps found
   - All high-frequency terms handled by synonyms or ELSER

4. **Plateau Validation** — De facto achieved:
   - All standard approaches verified complete
   - No more Tier 1 experiments possible

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Intent-based exception granted | Requires Tier 4 (metadata), not Tier 1 |
| Tier 1 declared EXHAUSTED, not just "complete" | Meeting target ≠ exhausting options |

---

## Final Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Overall Lesson Hard MRR | **0.614** | ≥0.45 |
| Synonym category | 0.611 | — |
| Intent-based category | 0.229 | ⚠️ Exception (Tier 4) |

---

## Related ADRs

- [ADR-082: Fundamentals-First Search Strategy](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)
- [ADR-085: Ground Truth Validation Discipline](../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)

---

## Key Learnings

1. **"Target Met" ≠ "Complete"** — Exhaustion means exploring all fundamental improvements, not just hitting a number.
2. **Intent-based queries are a different class of problem** — They require metadata that doesn't exist in the current API.
3. **ELSER handles UK/US variants automatically** — No need for explicit synonyms for spelling differences.


