---
name: "Ground-Truth Archive Retirement"
overview: "Delete ground-truth-archive/ (old 120-query system) and wire the evaluation pipeline to use only the canonical ground-truth/ model."
todos:
  - id: gap-analysis
    content: "Map capability gaps between old (120 queries, QueryCategory, combineGroundTruth) and new (~33 queries, no categories) models."
    status: pending
  - id: migrate-shared-types
    content: "Identify shared types (GroundTruthQuery, Phase, QueryCategory) used by benchmark pipeline; create neutral evaluation types or simplify."
    status: pending
  - id: migrate-consumers
    content: "Update 18 evaluation files to source data from ground-truth/ only. Complete benchmark-adapters.ts migration."
    status: pending
  - id: delete-archive
    content: "Delete ground-truth-archive/ entirely (39 barrels, registry, types, all query files)."
    status: pending
  - id: update-docs
    content: "Update evaluation README, IR-METRICS.md, ground-truth-protocol.md, and ADR-085/098 references."
    status: pending
  - id: verify-gates
    content: "Run pnpm knip, pnpm type-check, pnpm test, pnpm lint:fix, pnpm check."
    status: pending
---

# Ground-Truth Archive Retirement

**Last Updated**: 2026-04-12
**Status**: Future
**Scope**: Delete `ground-truth-archive/` and wire evaluation
pipeline to use only the canonical `ground-truth/` model.
**Origin**: Owner directive during knip Phase 2.5 (2026-04-12):
"anything in an archive should be deletable without consequence;
the newer system IS the system; the old system is a poorly
removed remnant."

## Context

The `apps/oak-search-cli/` workspace has two ground-truth models:

- **Old**: `src/lib/search-quality/ground-truth-archive/` — the
  120-query system with 39 barrel files, `QueryCategory`,
  `combineGroundTruth`, a registry pattern, and per-subject/phase
  query data. Its `types.ts` header says "ARCHIVED: pre-2026-02-04"
  but it is **not** safely deletable today.
- **New**: `src/lib/search-quality/ground-truth/` — ~33
  foundational lesson queries + cross-subject + units/threads/
  sequences. Simpler types, no categories, no `combineGroundTruth`.

The evaluation pipeline (`evaluation/`) is canonical and live
(wired into `oaksearch eval`, listed as knip entries, recently
maintained). It currently consumes BOTH models:

- `benchmark-adapters.ts` bridges new model data into old model
  types for the benchmark runners
- `validate-ground-truth.ts` uses the old model's registry
- Experiment runners use old model aggregates like
  `MATHS_SECONDARY_ALL_QUERIES`

## Migration Scope (from investigation 2026-04-12)

- **18 evaluation files** directly import from `ground-truth-archive/`
- **Capability gaps** in new model: no `QueryCategory`, no
  multi-query-per-subject-phase, no `DIAGNOSTIC_QUERIES`, fewer
  sequence queries (1 vs 41), no `combineGroundTruth`
- **Complexity**: Significant — validation, benchmarks, and
  experiments are coupled to archive types
- **Consequence**: Validation runs against ~33 queries instead
  of 120+ (this is the new design intent, not a regression)

## Implementation Approach

1. Map shared types that need to survive or be replaced
2. Decide whether `QueryCategory` is needed in the new model
   or if category-based benchmarking is retired
3. Update `benchmark-adapters.ts` to source ALL data from
   `ground-truth/` only (partially done already)
4. Update `validate-ground-truth.ts` to use new model access
5. Update `validation-runner.ts` to use new sequence model
6. Update experiment runners to use new model equivalents
7. Delete `ground-truth-archive/` entirely
8. Update documentation (evaluation README, IR-METRICS.md,
   ground-truth-protocol.md, ADR-085/098)
9. Update knip.config.ts if any entries reference archive paths
10. Run full quality gates

## Dependencies

- None blocking. This can execute independently.
- Complements the test-suite-audit-and-triage plan (sibling
  future plan) which would benefit from a clean ground-truth
  model.

## Risks

- Experiment runners may need redesign if they depend on the
  120-query corpus volume for statistical significance
- `QueryCategory`-based filtering in benchmark code may need
  simplification or removal
- Some evaluation documentation is already stale (e.g.
  `evaluation/README.md` references scripts that don't exist)
