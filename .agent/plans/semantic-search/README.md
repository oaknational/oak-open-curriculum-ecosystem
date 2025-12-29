# Semantic Search — Navigation Hub

**Status**: Active — Tier 1 EXHAUSTED, blocking on full ingestion  
**Last Updated**: 2025-12-29

---

## Quick Start

For new sessions, read in order:

1. **[roadmap.md](roadmap.md)** — **Single authoritative roadmap** (11 milestones)
2. **[current-state.md](current-state.md)** — Current metrics snapshot
3. **[search-acceptance-criteria.md](search-acceptance-criteria.md)** — Definition of done

---

## ⚠️ Critical: Measure Every Change

**Every search-affecting change must be measured.**

| Step | Action | Tool |
|------|--------|------|
| 1. Baseline | Record current metrics | `pnpm eval:per-category` |
| 2. Hypothesis | Document expected impact | `experiments/*.experiment.md` |
| 3. Implement | Make the change | — |
| 4. Measure | Run evaluation | `pnpm eval:per-category` |
| 5. Record | Document results | [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) |
| 6. Decide | Accept/reject based on evidence | — |

**Framework**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)  
**Ground Truths**: [.agent/evaluations/](../../evaluations/README.md)

---

## Strategic Direction

> "We should be able to do an excellent job with traditional methods, and an amazing job with non-AI recent search methods, and a phenomenal job once we take that already optimised approach and add AI into the mix."

```text
                       ┌─────────────────┐
                       │   PHENOMENAL    │  ← Tier 4: AI Enhancement
                   ┌───┴─────────────────┴───┐
                   │       EXCELLENT         │  ← Tier 3: Modern ES Features
               ┌───┴─────────────────────────┴───┐
               │           VERY GOOD             │  ← Tier 2: Document Relationships
           ┌───┴─────────────────────────────────┴───┐
           │              GOOD (Tier 1 EXHAUSTED)    │  ← Tier 1: Search Fundamentals
           │              ✅ WE ARE HERE              │
           └─────────────────────────────────────────┘
```

---

## Foundation Documents (MANDATORY)

| Document | Purpose |
|----------|---------|
| [rules.md](../../directives-and-memory/rules.md) | First Question: "Could it be simpler?" |
| [testing-strategy.md](../../directives-and-memory/testing-strategy.md) | Test pyramid, TDD approach |
| [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) | Generator is source of truth |
| [AGENT.md](../../directives-and-memory/AGENT.md) | Agent-specific directives |

---

## Key ADRs

| ADR | Title | Purpose |
|-----|-------|---------|
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-First Strategy | Tier prioritisation |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground Truth Validation | Slug validation discipline |
| [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) | Phrase Query Boosting | B.5 implementation |
| [ADR-083](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) | Complete Lesson Enumeration | Fix ingestion gap |
| [ADR-080](../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) | Curriculum Denormalization | API traversal patterns |

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

## Directory Structure

```text
.agent/plans/semantic-search/
├── roadmap.md                  # Authoritative linear roadmap
├── current-state.md            # Current metrics snapshot
├── search-acceptance-criteria.md # Definition of done
├── README.md                   # This file
├── active/                     # Currently blocking work
│   ├── complete-data-indexing.md    # Milestone 1: Full curriculum ingestion
│   ├── pattern-aware-ingestion.md   # Milestone 2: Complex traversal patterns
│   ├── synonym-quality-audit.md     # Milestone 3: Synonym quality
│   └── es-native-enhancements.md    # Phase 3e: BM25 optimisation
├── planned/                    # Future work with specs
├── planned/future/             # Post-SDK work
├── archive/completed/          # Summaries of completed work
└── reference-docs/             # Permanent reference material
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [evaluations/README.md](../../evaluations/README.md) | **Evaluation framework home** |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Chronological experiment history |
| [ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md) | Details of slug corrections |
| [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap |
| [search-experiment-guidance.md](../../evaluations/guidance/search-experiment-guidance.md) | How to run experiments |
| [curriculum-traversal-strategy.md](../curriculum-traversal-strategy.md) | API traversal patterns (7 patterns) |
| [high-level-plan.md](../high-level-plan.md) | Strategic coordination |

---

## Current Metrics (Summary)

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Lesson Hard MRR | **0.614** | ≥0.45 | ✅ Tier 1 EXHAUSTED |
| Lesson Std MRR | 0.963 | ≥0.92 | ✅ Met |
| Unit Hard MRR | 0.806 | ≥0.50 | ✅ Met |
| Unit Std MRR | 0.988 | ≥0.92 | ✅ Met |

**See**: [current-state.md](current-state.md) for full details.

---

## Architecture

### Four-Retriever Hybrid Design

```text
Query → [BM25 Content] ─┐
     → [BM25 Structure] ─┼─→ RRF Fusion → Top 10 Results
     → [ELSER Content] ──┤
     → [ELSER Structure]─┘
```

**See**: [archive/completed/four-retriever-implementation.md](archive/completed/four-retriever-implementation.md) for implementation details.
