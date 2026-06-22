# Ground Truth Redesign Plan

**Created**: 2026-01-25  
**Completed**: 2026-02-05  
**Status**: ✅ COMPLETE  
**Outcome**: 30 foundational ground truths integrated with benchmark system

---

## Summary

Phase 1 successfully established the Foundational Ground Truths system:

- **30 ground truths** created (one per subject-phase pair)
- **Known-Answer-First methodology** validated and documented
- **Benchmark integration** complete — ground truths run through 4-way RRF search
- **Baseline metrics** established: MRR=1.000, NDCG=0.989, P@3=0.956, R@10=1.000

### Remaining Coverage

Three KS4 science variants were not included in Phase 1:

- physics/secondary (KS4 only)
- chemistry/secondary (KS4 only)  
- biology/secondary (KS4 only)

These can be added in future expansion work. Combined-science covers the general KS4 science use case.

---

## What Was Built

### Foundational Ground Truths System

```text
src/lib/search-quality/ground-truth/
├── types.ts              # MinimalGroundTruth type definition
├── index.ts              # Exports GROUND_TRUTHS and accessors
├── index.unit.test.ts    # Unit tests for accessor functions
├── README.md             # Documentation
├── GROUND-TRUTH-GUIDE.md # Design principles
└── entries/              # 30 individual ground truth files
    ├── maths-secondary.ts
    ├── maths-primary.ts
    └── ... (28 more)
```

### Benchmark Integration

The benchmark system (`evaluation/analysis/`) was updated to:

1. **Import from new ground truths** via `benchmark-adapters.ts`
2. **Support AllSubjectSlug** for KS4 science variants
3. **Run all 30 ground truths** through the full 4-way RRF search pipeline

### Key Files Changed

| File | Purpose |
|------|---------|
| `benchmark-adapters.ts` | Converts MinimalGroundTruth → GroundTruthEntry |
| `benchmark-entry-runner.ts` | Updated types for AllSubjectSlug |
| `benchmark-query-runner.ts` | Updated types for AllSubjectSlug |
| `benchmark-request-builder.ts` | Updated types for AllSubjectSlug |
| `benchmark-main.ts` | Imports from new ground truths |

---

## Archived Code

The previous 120-query, 4-category system is preserved in:

```text
src/lib/search-quality/ground-truth-archive/
```

See [ground-truth-archive/README.md](../../../../apps/oak-search-cli/src/lib/search-quality/ground-truth-archive/README.md) for:

- What the archive contains
- Why it was archived
- How to restore if needed

---

## Future Work

See [ground-truth-expansion-plan.md](../../future/09-evaluation-and-evidence/ground-truth-expansion-plan.md) for Phase 2 expansion opportunities:

- Adding queries per subject-phase
- Category diversity (typos, natural expressions, imprecise input)
- Cross-topic queries
- Graded relevance refinement

---

## Key Decisions

| Decision | Outcome |
|----------|---------|
| **Known-Answer-First methodology** | Queries designed from curriculum content, not invented |
| **One GT per subject-phase** | Establishes baseline, proves system works |
| **Top-3 with relevance scores** | 3=direct, 2=related, 1=tangential |
| **Benchmark integration** | Full metrics pipeline, not just spot checks |

See [ADR-106: Known-Answer-First Ground Truth Methodology](../../../../docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) for the permanent decision record.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-106](../../../../docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology decision |
| [ground-truth-protocol.md](../../prompts/semantic-search/ground-truth-protocol.md) | The protocol |
| [queries-redesigned.md](../../../../apps/oak-search-cli/docs/ground-truths/queries-redesigned.md) | Coverage matrix |
| [ground-truth-expansion-plan.md](../../future/09-evaluation-and-evidence/ground-truth-expansion-plan.md) | Future work |
