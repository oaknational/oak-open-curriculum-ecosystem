# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-06 (M3 Phases 1-7 Built, Ready for Testing)

This is a **standalone entrypoint** for semantic search sessions. Start here.

---

## What Is This?

**Elasticsearch-backed semantic search** for the Oak National Academy curriculum. The system indexes 16,000+ lessons across 16 subjects and enables teachers and AI agents to find relevant content using natural language queries.

**Workspace**: `apps/oak-open-curriculum-semantic-search/`

**Architecture**: 4-retriever hybrid search (BM25 + ELSER sparse vectors) across content and structure fields. See [QUERYING.md](../../../apps/oak-open-curriculum-semantic-search/docs/QUERYING.md).

---

## Current Goal

**Create comprehensive ground truths covering ALL subjects × ALL phases, then establish universal benchmarks that enable meaningful like-for-like comparison when index structure or retriever configuration changes.**

**Impact**: Teachers and AI agents searching for any subject at any phase get measurably good results. We can prove improvements and detect regressions across the full curriculum.

---

## Key Discovery (Why Phase-Aligned)

Per-key-stage testing was **fundamentally flawed**:

- Primary content spans KS1+KS2 — the same lessons appear across both
- Testing KS1 separately from KS2 caused false failures (slugs valid in KS2 but not KS1)
- Curriculum is organised by **phase** (primary/secondary), not individual key stage

**Solution**: Ground truths organised by `subject/phase/` (e.g., `maths/primary/`, `maths/secondary/`). KS4 is a special case of secondary with additional complexity, handled via `keyStage?: KeyStage` property on queries.

---

## Current Status: Unified Evaluation Infrastructure Ready for Testing

**Phases 1-7 BUILT** 🔄 — Ground truths and unified benchmark infrastructure built, needs validation.

**Next Work**: Phase 8 — Run comprehensive baselines to validate infrastructure, update registry with measured MRR values.

---

## What's Been Completed

| Phase | Description | Date |
|-------|-------------|------|
| **Phase 1** | SDK Schema — `phase_slug` in index documents | 2026-01-03 |
| **Phase 2** | Indexing — `derivePhaseFromKeyStage()` populates `phase_slug` | 2026-01-03 |
| **Phase 3** | Search Filters — Array support for phases, keyStages, years, examBoards | 2026-01-03 |
| **Phase 4** | Analysis CLI — `--phase`, `--keyStages`, `--years`, `--examBoards` | 2026-01-03 |
| **Phase 5a** | Directory restructure — phase-aligned structure, clean exports | 2026-01-05 |
| **Phase 5b** | Create ALL primary ground truths (14 subjects) | 2026-01-06 |
| **Phase 5c** | Create missing secondary ground truths | 2026-01-06 |
| **Phase 5d** | Create KS4-specific ground truths (maths tiers, science subjects, etc.) | 2026-01-06 |
| **Phase 7a** | Create `GROUND_TRUTH_REGISTRY` (ADR-098) | 2026-01-06 |
| **Phase 7b-c** | Unified `benchmark.ts` evaluation tool | 2026-01-06 |
| **Phase 7d-e** | Cleanup — delete fragmented scripts and performance-measuring smoke tests | 2026-01-06 |

---

## What's Next

### Phase 8: Run Comprehensive Baselines

**Prerequisites**:
1. Elasticsearch must be running (cloud or local)
2. Data must be ingested (see [INGESTION-GUIDE.md](../../../apps/oak-open-curriculum-semantic-search/docs/INGESTION-GUIDE.md))
3. `.env` file configured with ES credentials

**Run the unified benchmark**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark --all                    # All subjects, all phases
pnpm benchmark --subject maths          # One subject
pnpm benchmark --phase primary          # One phase
```

**Then**: Update `baselineMrr` values in `GROUND_TRUTH_ENTRIES` (`registry/entries.ts`) with measured results.

---

## Architecture (Two Categories of Tools)

| Category | Question | When Run | Output |
|----------|----------|----------|--------|
| **Evaluations** | "Did this change improve quality?" | Manual, before/after changes | Metrics to compare |
| **Smoke Tests** | "Is search working as expected?" | CI/CD, deployment | Pass/fail |

**Never conflate these concerns.** Evaluation measures quality; smoke tests verify behavior.

---

## Ground Truth Structure

```
ground-truth/
├── registry/
│   ├── types.ts              # Phase = 'primary' | 'secondary'
│   ├── entries.ts            # GROUND_TRUTH_ENTRIES (single source of truth)
│   └── index.ts              # Type-safe accessors
├── {subject}/
│   ├── primary/              # Years 1-6 (KS1+KS2)
│   │   ├── {topic}.ts
│   │   └── index.ts
│   ├── secondary/            # Years 7-11 (KS3+KS4)
│   │   ├── {topic}.ts
│   │   ├── ks4/              # KS4-specific queries (keyStage: 'ks4')
│   │   │   └── ...
│   │   └── index.ts
│   └── index.ts
└── types.ts                  # GroundTruthQuery (with keyStage?: KeyStage)
```

**Phase Model**: `Phase = 'primary' | 'secondary'` only. KS4 is part of secondary but KS4-specific queries have `keyStage: 'ks4'` set for correct ES filtering.

---

## Ground Truth Creation Methodology

**TDD Process** (per [testing-strategy.md](../../directives-and-memory/testing-strategy.md)):

1. **RED**: Add query with expected slugs to ground truth file
2. **Validate**: Run `pnpm tsx evaluation/validation/validate-ground-truth.ts` — MUST fail if slugs don't exist
3. **GREEN**: Fix slugs by validating against API/MCP tools
4. **Document**: Add comprehensive TSDoc explaining the test scenario

**Per subject**: Minimum 15 queries mixing categories (naturalistic, misspelling, synonym, multi-concept).

---

## MCP Tools for Discovery

Use Oak Curriculum MCP tools to discover and validate content:

```typescript
// List units for a subject/key-stage
mcp_ooc-http-dev-local_get-key-stages-subject-units({ keyStage: "ks2", subject: "maths" })

// List lessons
mcp_ooc-http-dev-local_get-key-stages-subject-lessons({ keyStage: "ks2", subject: "maths" })

// Validate slug exists
mcp_ooc-http-dev-local_get-lessons-summary({ lesson: "adding-fractions-with-same-denominator" })

// Search for content
mcp_ooc-http-dev-local_search({ q: "fractions year 3", subject: "maths", keyStage: "ks2" })
```

---

## Bulk Data Location

```
apps/oak-open-curriculum-semantic-search/bulk-downloads/
├── maths-primary.json         # 125 units
├── maths-secondary.json       # 98 units
├── english-primary.json       # 213 units
├── english-secondary.json     # 71 units
├── ...
└── manifest.json              # List of all files
```

---

## Metrics Tracked

| Metric | Purpose |
|--------|---------|
| **MRR** | Position of first relevant result (primary) |
| **NDCG@10** | Overall ranking quality |
| **Precision@10** | Proportion of top 10 that are relevant |
| **Recall@10** | Proportion of relevant found in top 10 |
| **Zero-Hit Rate** | Queries returning nothing |
| **p95 Latency** | User experience |

> **Full definitions**: [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md)

---

## Query Categories

| Category | Description | Priority |
|----------|-------------|----------|
| naturalistic | Teacher/student language | HIGH |
| misspelling | Typos, mobile errors | CRITICAL |
| synonym | Alternative terminology | HIGH |
| multi-concept | Topic intersections | MEDIUM |
| colloquial | Informal language | MEDIUM |
| intent-based | Pedagogical purpose | EXPLORATORY |

**Two query types needed**:
1. **Curriculum concept**: "teaching fractions to year 4" (stable)
2. **Content discovery**: "Macbeth Lady Macbeth guilt" (content-dependent)

---

## Foundation Documents (MANDATORY)

Before ANY work, read:

- **[rules.md](../../directives-and-memory/rules.md)** — First Question, TDD, no type shortcuts
- **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels
- **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

---

## Quality Gates

Run after every change:

```bash
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

## Key Files

All paths relative to `apps/oak-open-curriculum-semantic-search/`:

| File | Purpose |
|------|---------|
| `src/lib/search-quality/ground-truth/registry/` | Ground truth registry (single source of truth, ADR-098) |
| `src/lib/search-quality/metrics.ts` | MRR, NDCG, Precision, Recall calculations |
| `evaluation/analysis/benchmark.ts` | **Unified benchmark tool** |
| `evaluation/validation/validate-ground-truth.ts` | Slug validation |
| `bulk-downloads/` | Source curriculum data (JSON files) |
| [DATA-VARIANCES.md](../../../docs/data/DATA-VARIANCES.md) | **Critical**: Curriculum data differences, KS4 complexity |
| [ADR-098](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) | Registry architecture decision |

---

## Navigation

| Document | Purpose |
|----------|---------|
| **This file** | Session entry point |
| [m3-revised-phase-aligned-search-quality.md](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md) | **Comprehensive plan** |
| [current-state.md](../../plans/semantic-search/current-state.md) | Authoritative metrics |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Master roadmap |
| [EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md) | How to run experiments |
| [DATA-VARIANCES.md](../../../docs/data/DATA-VARIANCES.md) | Curriculum data differences |
