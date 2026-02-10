# M3: Ground Truth Restructure & Search Quality

**Status**: 🔄 Benchmark & Iterate  
**Priority**: HIGH  
**Parent**: [../roadmap.md](../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-13  
**Audit**: [../../evaluations/audits/ground-truth-audit-2026-01.md](../../evaluations/audits/ground-truth-audit-2026-01.md)

---

## ✅ Prerequisite Complete: RRF Architecture Fixed (2026-01-13)

The RRF scoring flaw has been fixed. Documents without transcripts are no longer penalised.

| Deliverable | Status |
|-------------|--------|
| ADR-099: Transcript-Aware RRF Normalisation | ✅ |
| `normaliseRrfScores()` pure function | ✅ |
| Unit tests (17) + Integration tests (6) | ✅ |
| All quality gates | ✅ |

**Details**: [transcript-aware-rrf.md](../archive/completed/transcript-aware-rrf.md) | [ADR-099](../../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)

---

## 🔄 Current: Benchmark & Iterate

**Goal**: Validate ground truths through benchmarking until search quality is the constraining factor.

Ground truths have been restructured, but we are **assuming** they are correct. Benchmarking will reveal whether failures are due to bad ground truths or bad search.

### Iteration Loop

```
1. Run benchmark     → pnpm benchmark --all
2. Analyse failures  → Is the failure due to ground truth or search?
3. If GT issue       → Fix expected slugs, document rationale
4. If search issue   → Ground truths validated for that query
5. Repeat            → Until search is the only bottleneck
```

### Success Criteria

Ground truths are validated when low MRR scores are caused by **search limitations**, not wrong expected slugs.

---

## ✅ Phase 1 Complete (2026-01-12)

All 30 subject-phase entries have been curated with 4 queries each (1 per category).

| Metric | Target | Actual |
|--------|--------|--------|
| Subject-phase folders | 30 | ✅ 30 |
| Category files per folder | 4 | ✅ 4 |
| Queries per category | 1 | ✅ 1 |
| Total queries | 120 | ✅ 120 |
| All slugs validated | 100% | ✅ 100% |
| All queries AI-curated | 100% | ✅ 100% |
| Quality gates | All pass | ✅ All pass |
| RRF architecture fixed | Required | ✅ Complete (ADR-099) |
| **Benchmark validated** | — | 📋 Ready to run |

---

## Critical Understanding

### The Fundamental Problem

The ground truth system measures the **wrong thing**:

| What We Thought | What We're Actually Measuring |
|-----------------|------------------------------|
| "Does search help teachers find useful content?" | "Did search return the exact slugs we arbitrarily wrote down?" |

**~60% of ground truths were broken or suboptimal.** Search often returns BETTER results than expected slugs.

**Full evidence and examples**: See [Audit Report](../../evaluations/audits/ground-truth-audit-2026-01.md)

### The Decision (2026-01-11)

After stakeholder discussion:

1. **Keep the current ground truth system** — it's not useless, just misunderstood
2. **Review categories** — ensure they test meaningful user behaviours
3. **Aggressively prune to 1 query per subject-phase-category** — 120 queries total
4. **Be explicit about what results tell us** — and what they don't
5. **Use AI-as-judge to curate** — at ground truth definition time
6. **Future**: Consider AI-driven evaluation layer AFTER pruning is complete

### Two Different Systems

| System | Contents | Access |
|--------|----------|--------|
| **Oak Curriculum API** | Canonical curriculum data | MCP tools (`oak-local`) |
| **Our ES Index** | Search-optimised copy | `hybrid-search` library |

Ground truths validated against Oak API, benchmarks run against ES index. Related but not identical.

---

## Final State

### Structure

| Dimension | Value |
|-----------|-------|
| Subject-phase entries | 30 (14 primary + 16 secondary) |
| Categories per entry | 4 |
| Queries per category | **1** |
| **Total queries** | **120** |

**Note**: citizenship-primary and german-primary don't exist in the curriculum. The 30 bulk data files represent all valid subject-phase combinations.

### Directory Structure

```
ground-truth/
├── maths/
│   ├── primary/
│   │   ├── precise-topic.ts      # 1 query
│   │   ├── natural-expression.ts # 1 query
│   │   ├── imprecise-input.ts    # 1 query
│   │   ├── cross-topic.ts        # 1 query
│   │   └── index.ts              # Exports ALL_QUERIES
│   └── secondary/
│       └── ... (same structure)
├── english/
│   └── ... (same structure)
└── ... (all subjects)
```

### Categories

| Category | Purpose | What It Tests |
|----------|---------|---------------|
| `precise-topic` | Curriculum-aligned terminology | Basic retrieval works |
| `natural-expression` | Teacher/student natural language | System bridges vocabulary |
| `imprecise-input` | Typos, misspellings | Error recovery |
| `cross-topic` | Concept intersections | Multi-topic handling |

---

## What This System Tells Us

| Question | Quality |
|----------|---------|
| "Did search change?" | ✅ Good — metric changes indicate something changed |
| "Do expected slugs appear in results?" | ✅ Good — direct measurement |
| "Is performance acceptable?" | ✅ Good — p95 latency is valid |

### What It Does NOT Tell Us

| Question | Why Not |
|----------|---------|
| "Are teachers satisfied?" | No user testing |
| "Is quality good enough?" | Ground truths are spot checks, not comprehensive |
| "Which approach is better?" | Only measures expected slug position |

**This must be explicitly documented in all reporting.**

---

## Progress Tracker (Complete)

| # | Subject-Phase | Curated | Queries |
|---|---------------|---------|---------|
| 1 | art-primary | ✅ | 4/4 |
| 2 | art-secondary | ✅ | 4/4 |
| 3 | citizenship-secondary | ✅ | 4/4 |
| 4 | computing-primary | ✅ | 4/4 |
| 5 | computing-secondary | ✅ | 4/4 |
| 6 | cooking-nutrition-primary | ✅ | 4/4 |
| 7 | cooking-nutrition-secondary | ✅ | 4/4 |
| 8 | design-technology-primary | ✅ | 4/4 |
| 9 | design-technology-secondary | ✅ | 4/4 |
| 10 | english-primary | ✅ | 4/4 |
| 11 | english-secondary | ✅ | 4/4 |
| 12 | french-primary | ✅ | 4/4 |
| 13 | french-secondary | ✅ | 4/4 |
| 14 | geography-primary | ✅ | 4/4 |
| 15 | geography-secondary | ✅ | 4/4 |
| 16 | german-secondary | ✅ | 4/4 |
| 17 | history-primary | ✅ | 4/4 |
| 18 | history-secondary | ✅ | 4/4 |
| 19 | maths-primary | ✅ | 4/4 |
| 20 | maths-secondary | ✅ | 4/4 |
| 21 | music-primary | ✅ | 4/4 |
| 22 | music-secondary | ✅ | 4/4 |
| 23 | physical-education-primary | ✅ | 4/4 |
| 24 | physical-education-secondary | ✅ | 4/4 |
| 25 | religious-education-primary | ✅ | 4/4 |
| 26 | religious-education-secondary | ✅ | 4/4 |
| 27 | science-primary | ✅ | 4/4 |
| 28 | science-secondary | ✅ | 4/4 |
| 29 | spanish-primary | ✅ | 4/4 |
| 30 | spanish-secondary | ✅ | 4/4 |

---

## Phase 2: AI-Driven Evaluation (Future)

**Deferred. Not currently planned.**

Separate evaluation layer for "does search help teachers?"

| Parameter | Value |
|-----------|-------|
| Query set size | 60-120 (2-4 per subject-phase) |
| Evaluation method | AI judges result usefulness |
| Frequency | Manual, local development |
| Executor | Human stakeholder |

This answers different questions than the ground truth system:

- "Would a teacher be satisfied with these results?"
- "Is result #1 useful even if it's not the expected slug?"
- "How does quality compare across subject-phases?"

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Transcript-Aware RRF](../archive/completed/transcript-aware-rrf.md) | ✅ Complete — Per-document score normalisation |
| [ADR-099](../../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md) | RRF normalisation decision |
| [Audit Report](../../evaluations/audits/ground-truth-audit-2026-01.md) | Full audit findings |
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry point |
| [Roadmap](../roadmap.md) | Overall roadmap |
| [Current State](../current-state.md) | System metrics |
| [ADR-085](../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Validation discipline |
| [ADR-098](../../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) | Registry design |
| [Ground Truth Process](../../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) | Curation workflow |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../../directives/rules.md)
2. [testing-strategy.md](../../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../../directives/schema-first-execution.md)
