# SDK API

**Domain**: Understanding and stabilising the Search SDK interface  
**Intent**: Make the SDK usable, well-designed, and stable for consumers  
**Impact**: Developers can integrate easily, API surface is documented and predictable

---

## Why Separate?

This is about **API design**, not search quality. The questions here are:

- What filter combinations exist across the curriculum?
- How should the SDK expose these?
- What happens with invalid combinations?

This work informs SDK design decisions, not search relevance.

---

## Plans

| Plan | Description | Status |
|------|-------------|--------|
| [filter-testing.md](filter-testing.md) | Document all filter combinations, test edge cases | 📋 Pending |

---

## Key Insight

**KS4 Maths is NOT representative.** Different subjects have different metadata (tiers, exam boards, categories, unit options). We need to understand the full surface before stabilising the SDK API.

---

## Dependencies

- SDK extraction complete

---

## Success Criteria

- [ ] Filter matrix documented for all 17 subjects × 4 key stages
- [ ] All valid filter combinations have tests
- [ ] Invalid filter combinations handled gracefully
- [ ] SDK API refined based on findings
