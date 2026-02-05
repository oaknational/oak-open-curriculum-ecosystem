# Semantic Search — Ground Truth Work

**Status**: ✅ Phase 1 Complete  
**Total**: 30 foundational ground truths  
**Baseline Metrics**: MRR=1.000, NDCG=0.989, P@3=0.956, R@10=1.000  
**Last Updated**: 2026-02-05

---

## Current State

Phase 1 is complete. The Foundational Ground Truths system is:

- **Integrated with the benchmark** (`pnpm benchmark --all`)
- **Producing excellent metrics** (see baseline above)
- **Testing actual search value** via 4-way RRF

For future expansion, see [ground-truth-expansion-plan.md](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md).

---

## Mandatory Reading

Before any ground truth work, read these documents:

1. **[Ground Truth Protocol](./ground-truth-protocol.md)** — The step-by-step process
2. **[Semantic Search Architecture](../../directives-and-memory/semantic-search-architecture.md)** — Structure is the foundation
3. **[ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md)** — Known-Answer-First methodology

---

## Running the Benchmark

```bash
cd apps/oak-open-curriculum-semantic-search

# All ground truths
pnpm benchmark --all

# Single subject-phase
pnpm benchmark -s maths -p secondary

# Review mode (detailed per-query output)
pnpm benchmark -s maths -p secondary --review
```

---

## Testing Queries

Our search uses **4-way Reciprocal Rank Fusion (RRF)**. Raw ES queries bypass this infrastructure.

**ALWAYS** use the test script:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm tsx src/lib/search-quality/test-query.ts "your query" subject keyStage
```

**NEVER** use raw Elasticsearch queries.

---

## Coverage Status

| Subject | Primary | Secondary | Notes |
|---------|---------|-----------|-------|
| maths | ✅ | ✅ | |
| english | ✅ | ✅ | |
| science | ✅ | ✅ | |
| history | ✅ | ✅ | |
| geography | ✅ | ✅ | |
| computing | ✅ | ✅ | |
| art | ✅ | ✅ | |
| music | ✅ | ✅ | |
| design-technology | ✅ | ✅ | |
| physical-education | ✅ | ✅ | |
| religious-education | ✅ | ✅ | |
| french | ✅ | ✅ | |
| german | — | ✅ | No primary |
| spanish | ✅ | ✅ | |
| citizenship | — | ✅ | No primary |
| cooking-nutrition | ✅ | ✅ | |
| physics | — | Future | KS4 only |
| chemistry | — | Future | KS4 only |
| biology | — | Future | KS4 only |
| combined-science | — | Future | KS4 only |

**Legend**: ✅ Complete | Future = Phase 2 | — Not applicable

---

## The Value We Provide

Teachers use our search to find lessons. Ground truths test:

> **"If a teacher searches for X, do they get useful results?"**

We are NOT testing Elasticsearch. We are testing whether **our system** — with **our data**, **our retrievers**, and **our configuration** — helps teachers find content.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Ground Truth Protocol](./ground-truth-protocol.md) | Step-by-step process |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology decision |
| [Semantic Search Architecture](../../directives-and-memory/semantic-search-architecture.md) | Structure is the foundation |
| [queries-redesigned.md](../../../apps/oak-open-curriculum-semantic-search/docs/ground-truths/queries-redesigned.md) | Coverage matrix |
| [expansion-plan.md](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) | Future work |
| [completed redesign plan](../../plans/semantic-search/archive/completed/ground-truth-redesign-plan.md) | Phase 1 completion record |
