# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-05 (M3 Plan Consolidated)

This is a **standalone entrypoint** for semantic search sessions. Start here.

---

## Goal

**Create comprehensive ground truths covering ALL subjects × ALL phases, then establish universal benchmarks that enable meaningful like-for-like comparison when index structure or retriever configuration changes.**

**Impact**: Teachers and AI agents searching for any subject at any phase get measurably good results. We can prove improvements and detect regressions across the full curriculum.

---

## Key Discovery (Why Phase-Aligned)

Per-key-stage testing was **fundamentally flawed**:

- Primary content spans KS1+KS2 — the same lessons appear across both
- Testing KS1 separately from KS2 caused false failures (slugs valid in KS2 but not KS1)
- Curriculum is organised by **phase** (primary/secondary), not individual key stage

**Solution**: Ground truths organised by `subject/phase/` (e.g., `maths/primary/`, `maths/secondary/`).

---

## Current Status: Comprehensive Ground Truths

**Phases 1-5a COMPLETE** ✅ — Infrastructure ready.

**Next Work**: Phase 5b — Create ALL missing primary ground truths (10 subjects).

---

## What's Been Completed

| Phase | Description | Date |
|-------|-------------|------|
| **Phase 1** | SDK Schema — `phase_slug` in index documents | 2026-01-03 |
| **Phase 2** | Indexing — `derivePhaseFromKeyStage()` populates `phase_slug` | 2026-01-03 |
| **Phase 3** | Search Filters — Array support for phases, keyStages, years, examBoards | 2026-01-03 |
| **Phase 4** | Analysis CLI — `--phase`, `--keyStages`, `--years`, `--examBoards` | 2026-01-03 |
| **Phase 5a** | Directory restructure — phase-aligned structure, clean exports | 2026-01-05 |

---

## What's Next

### Phase 5b: Create ALL Missing Primary Ground Truths

**10 subjects** need `primary/` ground truths:

| Subject | Units | Priority | Notes |
|---------|-------|----------|-------|
| maths | 125 | 1 | Largest, most important |
| physical-education | 65 | 2 | Large but simpler |
| art | 42 | 3 | Creative |
| geography | 37 | 4 | Physical/human |
| music | 36 | 5 | Performance/composition |
| religious-education | 36 | 6 | World religions |
| computing | 30 | 7 | Programming/data |
| spanish | 21 | 8 | **MFL - structure-only** |
| design-technology | 18 | 9 | Materials/making |
| french | 15 | 10 | **MFL - structure-only** |

**MFL Note**: French and Spanish have **no transcripts** (automatic captioning doesn't work for non-English speech). ELSER is also English-only. Ground truths for MFL MUST test **structural fields** (`lesson_structure`, `lesson_structure_semantic`) and metadata, NOT transcript content. This validates our 4-retriever hybrid architecture works for all subjects.

### Phase 5c: Create Missing Secondary Ground Truth

- **cooking-nutrition/secondary/** (12 units)

### Phase 5d: Create KS4-Specific Ground Truths

For subjects with KS4 complexity, create `secondary/ks4/` subdirectories:

- **science**: Biology, Chemistry, Physics (exam subject split)
- **maths**: Foundation/Higher tier variants
- **english**: Set texts (Macbeth, Inspector Calls)
- **MFL**: Exam board skills
- Others as needed

### Phases 6-8

- **Phase 6**: ES re-index (add `phase_slug` to existing documents)
- **Phase 7**: **Unified Evaluation Infrastructure**
  - 7a: Create `GROUND_TRUTH_REGISTRY` as single source of truth
  - 7b: Update validation to iterate registry
  - 7c: Create unified `benchmark.ts` **evaluation tool** (measure effects of changes)
  - 7d: Create unified `search-baseline.smoke.test.ts` **smoke test** (is it working?)
  - 7e: Delete fragmented scripts and tests
  - 7f: Remove legacy `--keyStage` param
- **Phase 8**: Run comprehensive phase-based baselines for ALL subjects

**Key Distinction** (two categories of tools):

| Category | Question | When Run | Output |
|----------|----------|----------|--------|
| **Evaluations** | "Did this change improve quality?" | Manual, before/after changes | Metrics to compare |
| **Smoke Tests** | "Is search working as expected?" | CI/CD, deployment | Pass/fail |

---

## Ground Truth Structure

```
ground-truth/
├── {subject}/
│   ├── primary/              # Years 1-6 (KS1+KS2)
│   │   ├── {topic}.ts
│   │   ├── hard-queries.ts
│   │   └── index.ts
│   ├── secondary/            # Years 7-11 (KS3+KS4)
│   │   ├── {topic}.ts
│   │   ├── hard-queries.ts
│   │   ├── ks4/              # For complex KS4 subjects
│   │   │   └── ...
│   │   └── index.ts
│   └── index.ts
```

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

| File | Purpose |
|------|---------|
| `src/lib/search-quality/ground-truth/` | Ground truths |
| `src/lib/search-quality/metrics.ts` | MRR, NDCG, Precision, Recall calculations |
| `evaluation/analysis/analyze-cross-curriculum.ts` | Phase-based analysis |
| `evaluation/validation/validate-ground-truth.ts` | Slug validation |
| `bulk-downloads/` | Source data |
| [DATA-VARIANCES.md](../../../docs/data/DATA-VARIANCES.md) | **Critical**: Curriculum data differences, KS4 complexity |

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
