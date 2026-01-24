# Subject Hierarchy Enhancement Plan

**Status**: ✅ COMPLETE  
**Created**: 2026-01-22  
**Completed**: 2026-01-22  
**ADR**: [ADR-101: Subject Hierarchy for Search Filtering](../../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md)

---

## Summary

This plan implemented the `subject_parent` field to enable hierarchical subject filtering in Elasticsearch. The enhancement allows searches for "science" to include KS4 physics, chemistry, biology, and combined-science lessons.

**For full architectural context, see [ADR-101](../../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md).**

---

## Implementation Completed

| Phase | Status | Details |
|-------|--------|---------|
| Schema Enhancement | ✅ | `subject_parent` added to SDK field definitions |
| Type Generation | ✅ | Zod schemas and ES mappings generated |
| Document Builders | ✅ | `lesson-document-core.ts` and `unit-document-core.ts` compute `subject_parent` |
| Query Enhancement | ✅ | `rrf-query-helpers.ts` uses `subject_parent` for filtering |
| Index Reset | ✅ | `pnpm es:reset` to apply new mappings |
| Bulk Ingestion | ✅ | Full re-index with `pnpm es:ingest-live --bulk --all --verbose` (~24 min) |
| Verification | ✅ | `subject_parent` confirmed in Kibana and via curl queries |

---

## Verification Results (2026-01-22)

Benchmark run after ingestion:

```
pnpm benchmark -s science -p secondary --review
```

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.681 | ~ borderline |
| NDCG@10 | 0.521 | ✗ below threshold |
| P@3 | 0.333 | ✗ below threshold |
| R@10 | 0.611 | ✓ passing |

**Key Finding**: All 12 science queries now return science content (filtering works). The remaining quality gaps are **search ranking issues**, not filtering issues.

---

## Issues Discovered

The enhancement revealed search quality issues that were previously masked by the filtering bug:

### Strong Performers

| Query | MRR | Notes |
|-------|-----|-------|
| "cell structure and function" | 1.000 | 4/4 found, NDCG 0.956 |
| "energy and chemical reactions" | 1.000 | 3/4 found, NDCG 0.810 |

### Quality Gaps (for future work)

| Query | MRR | Issue |
|-------|-----|-------|
| "what makes things hot or cold" | 0.000 | 0/4 found - vocabulary bridging failure |
| "why does metal go rusty" | 0.250 | 2/4 found but poorly ranked |
| "electromagnetic spectrum waves" | 0.333 | High R@10 but low MRR (ranking issue) |

### Data Model Clarification

During verification, discovered the actual data model:

- `subject_slug`: Always normalized (e.g., "science" for all science variants)
- `subject_parent`: Matches `subject_slug` (the parent/umbrella subject)
- `exam_subjects`: Contains specific KS4 variants (e.g., `["physics"]`, `["combined-science"]`)

For granular KS4 science filtering by specific subject (physics, chemistry, biology), the `exam_subjects` field is the target — not `subject_slug`.

---

## Next Steps

This enhancement is complete. Remaining work:

1. **Science GT Quality Review** — Address the search quality gaps discovered above
2. **Subject-Specific GTs** — Add verification queries for physics/chemistry/biology/combined-science using `exam_subjects` field
3. **Spanish GT Review** — Continue with Spanish (2 subject-phases remaining)

**Future architecture work**: [subject-domain-model.md](../post-sdk/subject-domain-model.md) — Full SDK architecture for subject hierarchy (after GT review)

---

## Files Modified

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts` | Added `subject_parent` field |
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/lesson-document-core.ts` | Compute `subject_parent` |
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/unit-document-core.ts` | Compute `subject_parent` |
| `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts` | Filter by `subject_parent` |
| Various test files | Added `subject_parent` to mocks |

---

## References

- [ADR-101: Subject Hierarchy for Search Filtering](../../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md) — Architectural decision
- [ADR-080: Curriculum Data Denormalization Strategy](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) — Parent ADR
