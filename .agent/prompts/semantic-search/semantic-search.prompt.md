# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-13  
**Status**: 🔄 **Benchmark & Iterate** — Architecture correct, validating ground truths

---

## 🔄 Current Priority: Benchmark & Iterate

**RRF architecture is correct.** Ground truths are curated (120 queries). Now validate through benchmarking.

### Immediate Next Step

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark --all --verbose
```

### Iteration Loop

```
1. Run benchmark     → pnpm benchmark --all
2. Analyse failures  → Is this a ground truth problem or a search problem?
3. If GT issue       → Fix expected slugs, document rationale
4. If search issue   → Ground truths validated, search is the bottleneck
5. Repeat            → Until search quality is the only limiting factor
```

### Subjects to Watch

| Subject | Previous Issue | Expected Now |
|---------|---------------|--------------|
| French, German, Spanish | 0% transcript coverage, 50% scoring penalty | ✅ Should produce results |
| PE Primary | ~0.6% transcript coverage | ✅ Should produce results |
| PE Secondary | ~28.5% transcript coverage | ✅ Should produce results |

---

## ✅ Prerequisites Complete

| Prerequisite | Status | Details |
|--------------|--------|---------|
| RRF architecture | ✅ Fixed | [ADR-099](../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md) |
| Ground truths | ✅ Curated | 120 queries (30 × 4 categories) |
| Tests | ✅ Passing | 17 unit + 6 integration |
| Quality gates | ✅ Passing | All gates green |

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [M3 Plan](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md) | **CURRENT**: Benchmark & iterate specification |
| [Current State](../../plans/semantic-search/current-state.md) | System metrics, ground truth structure |
| [Roadmap](../../plans/semantic-search/roadmap.md) | Strategic direction |
| [Completed Work](../../plans/semantic-search/completed.md) | Historical record including RRF fix |

---

## Ground Truth Scope (IMPORTANT)

Ground truths measure **expected slug position**, NOT user satisfaction.

| What They Tell Us | What They Do NOT Tell Us |
|-------------------|--------------------------|
| "Did search change?" | "Are teachers satisfied?" |
| "Do expected slugs appear?" | "Is quality good enough?" |
| "Is performance acceptable?" | "Which result is better?" |

**All reporting must include this scope disclaimer.**

---

## Workspace

| Path | Contents |
|------|----------|
| `apps/oak-open-curriculum-semantic-search/` | Search app |
| `src/lib/search-quality/ground-truth/` | Ground truth definitions |
| `evaluation/analysis/benchmark.ts` | Benchmark runner |
| `evaluation/baselines/baselines.json` | Baseline storage |

---

## Commands Reference

```bash
cd apps/oak-open-curriculum-semantic-search

# Benchmarks
pnpm benchmark --all                              # Full benchmark
pnpm benchmark --subject french --verbose         # Check MFL
pnpm benchmark --subject physical-education       # Check PE

# Validation
pnpm type-check
pnpm ground-truth:validate

# Quality gates (from repo root)
cd /Users/jim/code/oak/oak-mcp-ecosystem
pnpm type-gen && pnpm build && pnpm type-check
pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
pnpm test:ui && pnpm smoke:dev:stub
```

---

## Foundation Documents (MANDATORY)

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — TDD, no type shortcuts, fail fast
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

---

## Value & Impact

**Always ask**: "What value are we delivering, through what impact, for which users?"

| Value | Impact | Users |
|-------|--------|-------|
| Validated search quality | Know what's working, what needs improvement | Developers |
| MFL/PE findability | Teachers can find language and PE content | Teachers |
| Regression detection | Confidence in search changes | Developers |
| Clear measurement scope | Honest reporting | Stakeholders |
