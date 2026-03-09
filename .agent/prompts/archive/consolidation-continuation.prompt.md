# Semantic Search Plan Consolidation — Continuation Prompt

**Purpose**: Continue the plan consolidation work from a fresh chat with full context  
**Created**: 2025-12-28  
**Meta-Plan**: [`.agent/plans/semantic-search/meta-plan-consolidation.md`](../../plans/semantic-search/meta-plan-consolidation.md)  
**Cursor Plan**: [`.cursor/plans/semantic_search_plan_consolidation_c8f5bd1c.plan.md`](../../../.cursor/plans/semantic_search_plan_consolidation_c8f5bd1c.plan.md)

---

## Task Definition

**What**: Transform 27 fragmented planning documents (~9,500 lines) into a focused, linear structure (~15 files, ~3,500 lines).

**Why This Matters**:

1. **Agent efficiency** — Future agents face a sprawling structure where the same concept is explained in 3-5 places
2. **Information preservation** — Critical discoveries (e.g., synonym strategy inversion) are buried in plan addenda, not permanent locations
3. **Maintenance burden** — Completed work is mixed with pending tasks, causing staleness and drift
4. **Foundation alignment** — This work embodies the "Could it be simpler?" principle from `principles.md`

**Key Transformation**:

| Before | After |
|--------|-------|
| 27 files, ~9,500 lines | ~15 files, ~3,500 lines |
| Scattered sub-plans | Single linear `roadmap.md` |
| Insights buried in addenda | Insights in ADRs, research docs, TSDoc |
| Completed work mixed with pending | Archived completed work with summaries |

---

## Safety Net

**CRITICAL**: A backup copy of the original directory exists at:

```
.agent/plans/semantic-search-backup/
```

This enables full cross-referencing to prove no information has been lost.

---

## Current Todo Status

| ID | Content | Status |
|----|---------|--------|
| `phase-1-structure` | Create directory structure and archive completed work with summaries | ✅ completed |
| `phase-2-roadmap` | Create single authoritative `roadmap.md` with 11 milestones | ✅ completed |
| `phase-3-active` | Move active work to `active/` and reduce 02b from 2095 to ~400 lines | ✅ completed |
| `phase-4-planned` | Move pending work to `planned/` and merge phase-10 into 06 | ✅ completed |
| `phase-5-simplify` | Simplify README/current-state and delete redirect files | pending |
| `phase-6-insights` | Verify key insights in permanent locations, add missing ones | pending |
| `phase-7-xrefs` | Update all cross-references to new file locations | pending |
| `phase-8-verify` | Final verification and run all quality gates | pending |

**Dependencies**:
- ~~Phase 2, 3, 4 depend on Phase 1~~ ✅ All complete
- Phase 5 depends on Phases 2, 3, 4 ← **READY TO START**
- Phases 6, 7 depend on Phase 5
- Phase 8 depends on Phases 6, 7

---

## Foundation Documents (MANDATORY RE-READ)

Before proceeding, re-read and commit to:

1. **[`.agent/directives/principles.md`](../../directives/principles.md)** — First Question: "Could it be simpler?"
2. **[`.agent/directives/testing-strategy.md`](../../directives/testing-strategy.md)** — Test pyramid, TDD
3. **[`.agent/directives/schema-first-execution.md`](../../directives/schema-first-execution.md)** — Generator is source of truth
4. **[`.agent/directives/AGENT.md`](../../directives/AGENT.md)** — Agent-specific directives

---

## Key Documents to Reference

### Primary Planning Documents

| Document | Purpose |
|----------|---------|
| [`meta-plan-consolidation.md`](../../plans/semantic-search/meta-plan-consolidation.md) | Detailed execution plan (~690 lines) |
| [`semantic_search_plan_consolidation_c8f5bd1c.plan.md`](../../../.cursor/plans/semantic_search_plan_consolidation_c8f5bd1c.plan.md) | Cursor plan with structured todos |

### Current Structure (after Phases 1-4)

```
.agent/plans/semantic-search/
├── README.md                               (381 lines - TO SIMPLIFY)
├── current-state.md                        (248 lines - TO SIMPLIFY)
├── search-acceptance-criteria.md           (251 lines - KEEP)
├── roadmap.md                              (NEW - authoritative roadmap)
├── part-1-search-excellence.md             (41 lines - TO DELETE)
├── part-1-search-excellence/
│   └── README.md                           (290 lines - TO DELETE)
├── active/                                 (NEW)
│   ├── complete-data-indexing.md
│   ├── pattern-aware-ingestion.md
│   └── synonym-quality-audit.md
├── planned/                                (NEW)
│   ├── evaluation-infrastructure.md
│   ├── reference-indices.md                (merged with phase-10)
│   ├── resource-types.md
│   ├── mcp-graph-tools.md
│   ├── knowledge-graph-evolution.md
│   ├── transcript-mining.md
│   ├── thread-based-search.md
│   ├── vocabulary-mining-bulk.md           (reduced from 02b)
│   └── search-sdk-cli.md
├── planned/future/                         (NEW)
│   ├── entity-extraction.md
│   └── advanced-features.md
├── archive/completed/                      (NEW)
│   ├── tier-1-fundamentals.md
│   ├── synonym-architecture.md
│   ├── documentation-debt.md
│   └── four-retriever-implementation.md
└── reference-docs/                         (KEPT)
    ├── reference-ir-metrics-guide.md
    ├── reference-es-serverless-feature-matrix.md
    └── reference-data-completeness-policy.md
```

### Target Structure

```
.agent/plans/semantic-search/
├── roadmap.md                              # NEW: Single authoritative roadmap
├── current-state.md                        # KEEP: Simplified metrics snapshot
├── search-acceptance-criteria.md           # KEEP: Definition of done
├── README.md                               # KEEP: Simplified navigation
├── active/                                 # NEW: Currently blocking work
│   ├── complete-data-indexing.md
│   ├── pattern-aware-ingestion.md
│   └── synonym-quality-audit.md
├── planned/                                # NEW: Future work with specs
│   ├── transcript-mining.md
│   ├── vocabulary-mining-bulk.md           # Reduced 02b
│   ├── thread-based-search.md
│   ├── reference-indices.md                # Merged 06 + phase-10
│   ├── resource-types.md
│   ├── mcp-graph-tools.md
│   ├── knowledge-graph-evolution.md
│   ├── evaluation-infrastructure.md
│   └── search-sdk-cli.md
├── planned/future/                         # NEW: Post-SDK work
│   ├── entity-extraction.md
│   └── advanced-features.md
├── reference-docs/                         # KEEP: Reference material
│   ├── reference-ir-metrics-guide.md
│   ├── reference-es-serverless-feature-matrix.md
│   └── reference-data-completeness-policy.md
└── archive/completed/                      # NEW: Summaries of completed work
    ├── tier-1-fundamentals.md
    ├── synonym-architecture.md
    ├── documentation-debt.md
    └── four-retriever-implementation.md
```

---

## Quality Gates (Run After Each Phase)

```bash
# From repo root, one at a time
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Success Criteria

1. **Single roadmap document** with clear linear path (11 milestones)
2. **≤15 active/pending plan files** (down from 27)
3. **All key insights** in permanent locations (ADRs, research docs, TSDoc)
4. **No broken links** in workspace
5. **Quality gates pass** after consolidation
6. **Agent in fresh chat** can navigate to any task quickly

---

## Key Insights to Preserve

These insights MUST NOT be lost during consolidation:

| Insight | Current Location | Target Location |
|---------|------------------|-----------------|
| Synonym strategy is inverted | 02b Addendum D | `.agent/research/semantic-search/vocabulary-value-analysis.md` (verify) |
| Definition text IS the synonym source | 02b Addendum D | Research doc + curated synonyms README |
| Four-retriever ablation results | phase-3 lines 145-230 | ADR-082 appendix or new research doc |
| Hard queries: ELSER > Hybrid finding | phase-3 | ADR-082 or ADR-09X |
| Index EVERYTHING principle | part-1 README | Architecture doc or ADR |
| 7 curriculum structural patterns | Already in `ontology-data.ts` | ✅ Already preserved |

---

## Execution Notes

1. **Go slow** — This is about preservation, not speed
2. **Verify at each step** — Check nothing is lost before proceeding
3. **Use backup** — `.agent/plans/semantic-search-backup/` is the safety net
4. **Create commits** — One logical commit per phase for easy rollback
5. **Document removals** — If content is intentionally removed, note why

---

## Next Step

**Phases 1-4 are complete.** Ready to begin Phase 5: Simplify navigation documents.

Tasks:
1. Simplify `README.md` (target: ~150 lines)
2. Trim `current-state.md` (target: ~150 lines)
3. Delete `part-1-search-excellence.md` (redirect file)
4. Delete `part-1-search-excellence/README.md` (merged into roadmap)

