# Semantic Search — Navigation Hub

**Status**: 🔄 ES reset and cache validation pending
**Last Updated**: 2025-12-29
**Index Coverage**: 0% (ES reset required before ingestion)

---

## Quick Start

For new sessions, read in order:

1. **[roadmap.md](roadmap.md)** — **Single authoritative roadmap** (11 milestones)
2. **[current-state.md](current-state.md)** — Current metrics snapshot
3. **[search-acceptance-criteria.md](search-acceptance-criteria.md)** — Definition of done

---

## 🔄 Current Status

### Adapter Refactoring — Complete (2025-12-29)

Successfully refactored adapter layer using TDD:

| Metric             | Before    | After       |
| ------------------ | --------- | ----------- |
| `oak-adapter.ts`   | 593 lines | 197 lines   |
| Lint errors        | 70        | 0           |
| Quality gates      | Blocked   | All passing |

**New files created**:

- `sdk-cache/cache-wrapper.ts` — Cache wrappers with dependency injection
- `sdk-api-methods.ts` — API method factories
- `sdk-client-factory.ts` — Client creation helpers
- `src/adapters/README.md` — Architecture documentation

### Pending Before Ingestion

| Task             | Why Needed                                      | Status    |
| ---------------- | ----------------------------------------------- | --------- |
| ES reset         | Fresh indices after code changes                | 📋 Pending |
| Cache validation | Verify new `CacheOperations` interface works    | 📋 Pending |

### Next Steps (In Order)

```bash
cd apps/oak-open-curriculum-semantic-search

# 1. Reset ES
pnpm es:setup --reset

# 2. Verify caching (dry run)
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --dry-run

# 3. Full ingestion
pnpm es:ingest-live --all --verbose
```

---

## Canonical Ingestion CLI

**Entry point**: `src/lib/elasticsearch/setup/ingest-live.ts`

| Flag                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `--all`               | Ingest all 17 subjects                           |
| `--subject <slug>`    | Ingest specific subject(s), can be repeated      |
| `--keystage <slug>`   | Filter by key stage                              |
| `--index <kind>`      | Filter to specific index kind                    |
| `--force`             | Overwrite existing documents                     |
| `--bypass-cache`      | Skip Redis cache requirement                     |
| `--ignore-cached-404` | Bypass cached 404s for transcripts               |
| `--verbose`           | Detailed logging                                 |
| `--dry-run`           | Preview without indexing                         |

If interrupted, re-run the same command - incremental mode skips existing docs.

---

## ⚠️ Measurement Discipline

**Every search-affecting change must be measured.**

| Step        | Action                     | Tool                         |
| ----------- | -------------------------- | ---------------------------- |
| 1. Baseline | Record current metrics     | `pnpm eval:per-category`     |
| 2. Hypothesis | Document expected impact | `experiments/*.experiment.md`|
| 3. Implement | Make the change           | —                            |
| 4. Measure  | Run evaluation             | `pnpm eval:per-category`     |
| 5. Record   | Document results           | [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) |
| 6. Decide   | Accept/reject based on evidence | —                       |

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

| Document                   | Purpose                              |
| -------------------------- | ------------------------------------ |
| [rules.md](../../directives-and-memory/rules.md) | First Question: "Could it be simpler?" |
| [testing-strategy.md](../../directives-and-memory/testing-strategy.md) | Test pyramid, TDD approach |
| [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) | Generator is source of truth |
| [AGENT.md](../../directives-and-memory/AGENT.md) | Agent-specific directives |

---

## Key ADRs

| ADR        | Title                      | Purpose                |
| ---------- | -------------------------- | ---------------------- |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-First Strategy | Tier prioritisation |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground Truth Validation | Slug validation discipline |
| [ADR-087](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) | Batch-Atomic Ingestion | Resilient ingestion |
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
│   ├── pattern-aware-ingestion.md   # Milestone 2: Complex traversal (COMPLETE)
│   ├── synonym-quality-audit.md     # Milestone 3: Synonym quality
│   └── es-native-enhancements.md    # Phase 3e: BM25 optimisation
├── planned/                    # Future work with specs
├── planned/future/             # Post-SDK work
├── archive/completed/          # Summaries of completed work
└── reference-docs/             # Permanent reference material
```

---

## Related Documents

| Document                  | Purpose                        |
| ------------------------- | ------------------------------ |
| [evaluations/README.md](../../evaluations/README.md) | **Evaluation framework home** |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Chronological experiment history |
| [ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md) | Details of slug corrections |
| [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap |
| [search-experiment-guidance.md](../../evaluations/guidance/search-experiment-guidance.md) | How to run experiments |
| [curriculum-traversal-strategy.md](../curriculum-traversal-strategy.md) | API traversal patterns (7 patterns) |
| [high-level-plan.md](../high-level-plan.md) | Strategic coordination |

---

## Current State (Summary — 2025-12-29)

| Metric                  | Value            | Target   | Status               |
| ----------------------- | ---------------- | -------- | -------------------- |
| Adapter refactoring     | ✅ Complete      | —        | ✅ 593→197 lines     |
| Pattern-aware traversal | ✅ Complete      | —        | ✅ All 7 patterns    |
| Quality gates           | ✅ Passing       | —        | ✅ All 11 green      |
| ES reset                | 📋 Pending       | ✅       | 📋 Need to run       |
| Cache validation        | 📋 Pending       | ✅       | 📋 Verify new interface |
| Redis cache             | 12,039 entries   | —        | ⚠️ Verify accessible |
| Lessons indexed         | 0                | 12,316   | 📋 Pending           |

**Next Step**: Reset ES, verify caching, then run ingestion

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

### Adapter Architecture (Refactored 2025-12-29)

```text
oak-adapter.ts (Public API)
    ├── sdk-client-factory.ts (Client creation)
    │       ├── sdk-api-methods.ts (API method factories)
    │       └── sdk-cache/cache-wrapper.ts (Caching with DI)
    ├── oak-adapter-threads.ts (Thread-specific methods)
    └── oak-adapter-types.ts (Type definitions)
```

**See**: [src/adapters/README.md](../../../apps/oak-open-curriculum-semantic-search/src/adapters/README.md) for details.
