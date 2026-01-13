# Semantic Search — Navigation

**Last Updated**: 2026-01-13

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## ✅ RRF Architecture Fixed (2026-01-13)

The RRF scoring flaw has been fixed. MFL/PE subjects are no longer structurally disadvantaged.

**Details**: [ADR-099](../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)

---

## Current Priority: Benchmark & Iterate

Ground truths have been restructured (120 queries), RRF is now correct. Ready for **validation through benchmarking**.

**Goal**: Iterate until the constraining factor is search quality, not ground truth quality.

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark --all  # Run benchmarks
# Analyse failures → Fix ground truths OR confirm search is the bottleneck
```

---

## Critical Understanding

Ground truths measure **expected slug position**, NOT user satisfaction.

See: [Audit Report](../../evaluations/audits/ground-truth-audit-2026-01.md)

---

## Documents

| Document | Purpose |
|----------|---------|
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry point, current status, warnings |
| [Audit Report](../../evaluations/audits/ground-truth-audit-2026-01.md) | Full audit findings |
| [Roadmap](roadmap.md) | Future work items and dependencies |
| [Completed](completed.md) | Historical completed work |
| [Current State](current-state.md) | System metrics and ES index state |
| [M3 Plan](active/m3-revised-phase-aligned-search-quality.md) | Ground truth restructure specification |
| [Transcript-Aware RRF](active/transcript-aware-rrf.md) | Per-document score normalization for MFL/PE |

---

## Foundation Documents (MANDATORY)

1. [rules.md](../../directives-and-memory/rules.md)
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md)
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)
