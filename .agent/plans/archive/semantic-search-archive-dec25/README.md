# Semantic Search - Navigation Hub

**Status**: Part 1 ACTIVE — Focus: Synonym Quality Audit (Plan 11)  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Strategy**: [ADR-082: Fundamentals-First](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)  
**Last Updated**: 2025-12-27

---

## 🎯 Current State

**Tier 1 is EXHAUSTED** (2025-12-24). MRR 0.614 exceeds target (0.45), and all standard Tier 1 approaches have been verified. The intent-based category (0.229) has a documented exception — it requires Tier 4 (LLM/metadata) solutions. Tier 2 can proceed when prioritised.

### Verified Metrics (2025-12-24)

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Lesson Hard MRR | **0.614** | ≥0.45 | ✅ Target met, Tier 1 EXHAUSTED |
| Lesson Std MRR | 0.963 | ≥0.92 | ✅ Met |
| Unit Hard MRR | 0.806 | ≥0.50 | ✅ Met |
| Unit Std MRR | 0.988 | ≥0.92 | ✅ Met |

### Ground Truth (Fixed 2025-12-23)

| Fix | Status |
|-----|--------|
| 63 lesson slugs corrected | ✅ Complete |
| Unit slugs validated | ✅ All 36 exist |
| Sequence ground truth created | ✅ 41 queries |
| Validation script created | ✅ Validates all slugs via API |
| Quality gates pass | ✅ All 11 gates |

**See**: [ADR-085: Ground Truth Validation Discipline](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)

---

## Quality Gates — ✅ VERIFIED (2025-12-23)

| Gate | Status |
|------|--------|
| `pnpm type-gen` | ✅ Pass |
| `pnpm build` | ✅ Pass |
| `pnpm type-check` | ✅ Pass |
| `pnpm lint:fix` | ✅ Pass |
| `pnpm format:root` | ✅ Pass |
| `pnpm markdownlint:root` | ✅ Pass |
| `pnpm test` | ✅ Pass |
| `pnpm test:e2e` | ✅ Pass |
| `pnpm test:e2e:built` | ✅ Pass |
| `pnpm test:ui` | ✅ Pass |
| `pnpm smoke:dev:stub` | ✅ Pass |

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| **[Part 1: Search Excellence](part-1-search-excellence/README.md)** | **Master plan (START HERE)** |
| **[current-state.md](current-state.md)** | Verified metrics |
| **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** | Chronological experiment history |
| **[ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)** | Ground truth validation |
| **[ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)** | Details of the 63 slug corrections |

---

## Quick Start

For new sessions, read in this order:

1. **Foundation Documents** (MUST READ FIRST)
   - [rules.md](../../directives-and-memory/rules.md) — TDD, quality gates, no type shortcuts
   - [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — All types from schema
   - [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — Test types and TDD approach
   - [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — **Fundamentals-first strategy**

2. **Ground Truth Status** (CRITICAL)
   - [ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md) — The 63 corrections
   - Understand that ALL previous measurements are suspect

3. **Current State & History**
   - [current-state.md](current-state.md) — Current metrics (UNVERIFIED)
   - [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) — Experiment history

4. **Current Work**
   - [Part 1: Search Excellence](part-1-search-excellence.md) — Active plan
   - [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) — Strategic roadmap

---

## Strategic Direction

> "We should be able to do an excellent job with traditional methods, and an amazing job with non-AI recent search methods, and a phenomenal job once we take that already optimised approach and add AI into the mix."

**Semantic Reranking was REJECTED** with a -16.8% regression. **However, this decision may be wrong** — it was based on invalid ground truth. **DEFERRED** — will revisit after Tier 2 if needed; system already exceeds targets without it.

```text
                           ┌─────────────────┐
                           │   PHENOMENAL    │  ← Tier 4: AI Enhancement (RE-EVALUATE)
                       ┌───┴─────────────────┴───┐
                       │       EXCELLENT         │  ← Tier 3: Modern ES Features
                   ┌───┴─────────────────────────┴───┐
                   │           VERY GOOD             │  ← Tier 2: Document Relationships
               ┌───┴─────────────────────────────────┴───┐
               │              GOOD                       │  ← Tier 1: Search Fundamentals
               │              ← WE ARE HERE              │
               └─────────────────────────────────────────┘
```

---

## What We Preserve (Going Forward, Not Back)

The ground truth correction is a **quality improvement**, not a setback. We preserve:

| Category | What We Keep |
|----------|--------------|
| **Implementations** | B.4 noise filtering, B.5 phrase boosting, 163 synonyms deployed |
| **Architecture** | Four-retriever hybrid, RRF fusion, content/structure separation |
| **Learnings** | ES synonym filter works for tokens not phrases, generic AI lacks domain knowledge |
| **Strategy** | Fundamentals-first (ADR-082), tier-based advancement |
| **Code Quality** | All quality gates pass, type-safe, tested |

We are going **forward with enhanced understanding** — now we can trust our measurements.

---

## Part Overview

```text
═══════════════════════════════════════════════════════════════════
Part 1: Search Excellence (Fundamentals-First)      [🔄 IN PROGRESS]
═══════════════════════════════════════════════════════════════════
Done when: All tiers EXHAUSTED, Search SDK ready
Current: Tier 1 EXHAUSTED (0.614), Tier 2 ready

  Master Plan: part-1-search-excellence/README.md

  Sub-Plans:
    01-tier-1-fundamentals.md       ✅ Complete (2025-12-24)
    02a-synonym-architecture.md     ✅ Complete (2025-12-24)
    02b-vocabulary-mining.md        ✅ Extraction complete — All 5 generators done
    03-evaluation-infrastructure.md 📋 Unify duplicate directories
    04-documentation-debt.md        ✅ Complete (2025-12-24)
    05-complete-data-indexing.md    📋 Index ALL curriculum data
    06-reference-indices.md         📋 Reference data (subjects, key stages)
    07-resource-types.md            📋 Worksheets, quizzes, sequences
    08-mcp-graph-tools.md           ✅ Partial — Thread + prerequisite tools done
    09-knowledge-graph-evolution.md 📋 Property graph → True KG
    10-transcript-mining.md         📋 Mine transcripts for spoken synonyms
    11-synonym-quality-audit.md     🔄 **CURRENT FOCUS** — Audit + add synonyms

═══════════════════════════════════════════════════════════════════
Part 2: MCP Natural Language Tools                  [📋 Planned]
═══════════════════════════════════════════════════════════════════
(Cross-reference: .agent/plans/sdk-and-mcp-enhancements/)

═══════════════════════════════════════════════════════════════════
Part 3: Future Enhancements                         [📋 Future]
═══════════════════════════════════════════════════════════════════
```

---

## Metrics

### Current State (Verified 2025-12-24)

For current metrics, index status, and known issues, see **[current-state.md](current-state.md)**.

| Metric | Value | Status |
|--------|-------|--------|
| Lesson Hard MRR | **0.614** | ✅ Target met (≥0.45) |
| Unit Hard MRR | 0.806 | ✅ Met |
| Lesson Std MRR | 0.963 | ✅ Met |
| Unit Std MRR | 0.988 | ✅ Met |

**Note**: Tier 1 EXHAUSTED (2025-12-24). Intent-based exception granted. See [Search Acceptance Criteria](search-acceptance-criteria.md) for details.

### Tier Advancement Criteria

| Tier | MRR Target | Exit Criteria |
|------|------------|---------------|
| **Tier 1** | ≥0.45 | VERIFIED synonyms, noise, phrases complete |
| **Tier 2** | ≥0.55 | Cross-reference demonstrably helps |
| **Tier 3** | ≥0.60 | Parameters evidence-based |
| **Tier 4** | ≥0.75 | Only if Tiers 1-3 plateau |

### What's Actually Proven

| Claim | Evidence | Status |
|-------|----------|--------|
| Code compiles | `pnpm type-check` passes | ✅ Proven |
| Unit tests pass | `pnpm test` passes | ✅ Proven |
| All quality gates pass | All 11 gates pass | ✅ Proven |
| Ground truth is valid | Integration test passes | ✅ Proven (2025-12-23) |
| Test isolation works | `isolate: true, pool: 'forks'` | ✅ Proven |
| Four-retriever improves search | Ablation study | ✅ Proven |
| B.4/B.5 improve search | TRUE baseline MRR 0.614 | ✅ Verified (2025-12-24) |
| Semantic reranking harms search | Experiment | ⏸️ DEFERRED — revisit after Tier 2 if needed |

---

## ✅ Ingestion Complete — Validated (2025-12-22)

| Milestone | Status |
|-----------|--------|
| Lesson ingestion (ADR-083) | ✅ 436 lessons |
| Unit `lesson_count` fixed | ✅ 36/36 units correct |
| Thread fields populated | ✅ All units have `thread_slugs` |
| Bulk download validation | ✅ 436 lessons, 36 units match exactly |

---

## Architecture

### Four-Retriever Hybrid Design

```text
Query → [BM25 Content] ─┐
     → [BM25 Structure] ─┼─→ RRF Fusion → Top 10 Results
     → [ELSER Content] ──┤
     → [ELSER Structure]─┘
```

| Retriever | Field Type | Purpose |
|-----------|------------|---------|
| BM25 on Content | Transcript/rollup text | Lexical matching on teaching material |
| ELSER on Content | Transcript/rollup text | Semantic matching on teaching material |
| BM25 on Structure | Curated summary | Lexical matching on metadata |
| ELSER on Structure | Curated summary | Semantic matching on metadata |

---

## Key ADRs

| ADR | Title | Purpose |
|-----|-------|---------|
| [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) | **Phrase Query Boosting** | B.5 implementation |
| [ADR-083](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) | **Complete Lesson Enumeration** | Fix ingestion gap |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | **Fundamentals-First Strategy** | Tier prioritisation |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Search Evaluation Framework | Metrics, decision criteria |

---

## Quality Gates

Run from repo root after any changes:

```bash
pnpm type-gen          # Makes changes
pnpm build             # Makes changes
pnpm type-check
pnpm lint:fix          # Makes changes
pnpm format:root       # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Key File Locations

### Search Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/            # RRF query builders
├── src/lib/search-quality/           # Ground truth, metrics
│   └── ground-truth/                 # ✅ CORRECTED ground truth
│       ├── units/                    # Unit ground truth
│       └── sequences/                # ✅ NEW — Sequence ground truth
├── src/lib/indexing/                 # Document transforms
├── evaluation/
│   ├── analysis/                     # Measurement scripts
│   ├── validation/                   # ✅ Ground truth validation script
│   └── experiments/                  # Hypothesis testing
├── smoke-tests/                      # Search quality benchmarks
└── docs/                             # INGESTION-GUIDE, SYNONYMS, etc.
```

### Ground Truth Validation

```text
src/lib/search-quality/ground-truth/
├── hard-queries.ts                   # ✅ 15 corrected slugs
├── diagnostic-synonym-queries.ts     # ✅ 9 corrected slugs  
├── diagnostic-multi-concept-queries.ts # ✅ 9 corrected slugs
├── units/                            # ✅ All 36 slugs validated
└── sequences/                        # ✅ NEW — 41 queries created

evaluation/validation/
├── validate-ground-truth.ts          # ✅ Validates ALL slugs exist in API
└── lib/                              # Validation helpers (Zod schemas, API checkers)
```

---

## Document Index

### Ground Truth & Corrections

| Document | Purpose |
|----------|---------|
| [ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md) | **Details of all 63 corrections** |
| `evaluation/validation/validate-ground-truth.ts` | Validates all slugs exist |

### Current State & History

| Document | Purpose |
|----------|---------|
| [current-state.md](current-state.md) | **Current metrics** (UNVERIFIED) |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | **Chronological history** |

### Active Plans

| Document | Purpose |
|----------|---------|
| [Part 1: Search Excellence](part-1-search-excellence/README.md) | **Master plan** — start here |
| [01-tier-1-fundamentals.md](part-1-search-excellence/01-tier-1-fundamentals.md) | Exhaust Tier 1 options |
| [02a-synonym-architecture.md](part-1-search-excellence/02a-synonym-architecture.md) | Fix circular dependency (blocks 02b) |
| [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap |

---

## Development Rules

### Fundamentals First (ADR-082)

1. **Tier 1**: Synonyms, phrase matching, noise filtering
2. **Tier 2**: Document relationships (Unit→Lesson, threads)
3. **Tier 3**: RRF tuning, Linear Retriever, field boosting
4. **Tier 4**: AI (only when Tiers 1-3 plateau AND verified)

### TDD at All Levels

1. **RED** — Write test first, run it, prove it fails
2. **GREEN** — Write minimal implementation to pass
3. **REFACTOR** — Improve implementation, tests stay green

### Ground Truth Discipline

1. **All slugs must exist** — Validated by `evaluation/validation/validate-ground-truth.ts`
2. **Semantic correctness** — Expected results should match query intent
3. **No fabricated slugs** — Always verify against live API

---

## How to Update Documentation After Changes

When metrics change (after an experiment or system change):

1. Run the relevant evaluation scripts to measure new values
2. Update the metrics tables in [current-state.md](current-state.md)
3. Update the "Last Updated" date in this file and current-state.md
4. **Add an entry to [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)**
5. Update [part-1-search-excellence.md](part-1-search-excellence.md) if experiment status changes

**Critical**: The experiment log is the historical record. Always update it after completing work.

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-24 | **Restructured** Part 1 into directory with sub-plans |
| 2025-12-24 | Corrected Tier 1 status: target met ≠ complete |
| 2025-12-24 | TRUE baseline established (MRR 0.614, verified) |
| 2025-12-23 | **Ground truth corrected** — 63 slugs fixed (ADR-085) |
| 2025-12-23 | Sequence ground truth created — 41 queries |
| 2025-12-23 | Integration test created — validates all slugs via API |
| 2025-12-22 | Ingestion data quality fixes complete |
| 2025-12-22 | Status updated to ACTIVE |
| 2025-12-19 | Semantic reranking rejected (⚠️ decision may be wrong) |
