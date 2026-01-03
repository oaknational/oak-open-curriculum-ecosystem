# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-03

This is a **standalone entrypoint** for semantic search sessions. Start here.

---

## 🚨 Architectural Discovery: Phase-Aligned Ground Truths

**Discovery (2026-01-03)**: The per-key-stage baseline approach is fundamentally misaligned with curriculum structure.

### The Problem

English KS1 and KS2 baselines showed catastrophically low MRR (0.131 and 0.107):

| Key Stage | MRR | Root Cause |
|-----------|-----|------------|
| KS1 | 0.131 | ❌ BFG queries fail — BFG content is KS2 |
| KS2 | 0.107 | ❌ Billy Goats queries fail — Billy Goats content is KS1 |

**The same "Primary" ground truths were used for both**, but expected slugs are key-stage-specific. This is a **test design flaw**, not a search quality issue.

### The Solution

**Phases** (primary/secondary) are the fundamental curriculum division, not key stages.

| Concept | Definition |
|---------|------------|
| **Phase** | `primary` (Years 1-6, KS1+KS2) or `secondary` (Years 7-11, KS3+KS4) |
| **Sequence** | Subject + Phase + optional exam board (e.g., `english-secondary-aqa`) |
| **Key Stage** | Overlay on years (KS1=Y1-2, KS2=Y3-6, KS3=Y7-9, KS4=Y10-11) |

**Ground truths should be organised by phase**, with search filters supporting flexible combinations.

---

## 🚀 Current Priority: M3 Revised Plan

**Plan**: [m3-revised-phase-aligned-search-quality.md](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md)

This plan:
1. **Restructures ground truths by phase** (primary/secondary/gcse)
2. **Enhances search filters** to support arrays (keyStages, years, phases)
3. **Achieves all original M3 goals** (comprehensive baselines)
4. **Incorporates comprehensive filter testing**

### Implementation Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Filter architecture enhancement (arrays, phases) | 📋 Planned |
| 2 | Ground truth restructure (by phase) | 📋 Planned |
| 3 | Analysis script update (phase-aware) | 📋 Planned |
| 4 | Run comprehensive baselines (by phase) | 📋 Planned |
| 5 | Comprehensive filter testing | 📋 Planned |

---

## Current Baseline Status (Pre-Restructure)

These baselines used the **flawed per-key-stage approach** — they will be superseded by phase-based baselines.

| Subject | KS1 | KS2 | KS3 | KS4 | Notes |
|---------|-----|-----|-----|-----|-------|
| **Maths** | — | — | — | ✅ 0.894 | Only KS4 ground truths exist |
| **English** | ⚠️ 0.131 | ⚠️ 0.107 | ✅ 0.742 | ⚠️ 0.394 | KS1/KS2 are test design flaws |
| **Science** | — | ✅ 0.852 | ✅ 0.899 | — | Excellent |
| **History** | — | ✅ 0.667 | ✅ 0.950 | — | Excellent |
| **Geography** | — | — | ✅ 0.759 | — | Good |
| **RE** | — | — | ✅ 0.667 | — | Good |
| **French** | — | — | ❌ 0.190 | — | Upstream transcript issue |
| **Spanish** | — | — | ❌ 0.294 | — | Upstream transcript issue |
| **German** | — | — | ❌ 0.194 | — | Upstream transcript issue |
| **Art** | — | — | ✅ 0.741 | — | Good |
| **Music** | — | — | ✅ 0.722 | — | Good |
| **Computing** | — | — | ⚠️ 0.481 | — | Acceptable |
| **D&T** | — | — | ✅ 0.815 | — | Excellent |
| **PE** | — | — | ❌ 0.356 | — | Poor |
| **Citizenship** | — | — | ✅ 0.667 | — | Good |
| **Cooking** | — | ⚠️ 0.493 | — | — | Acceptable |

**Key insight**: Most "secondary" subjects (KS3) perform well. The issues are:
1. **English KS1/KS2**: Test design flaw (fixed by phase restructure)
2. **English KS4**: Needs GCSE-specific synonyms (set texts)
3. **MFL Languages**: Upstream transcript issue (cannot fix)
4. **PE**: Needs synonyms and fuzzy matching

---

## Architecture Overview

### Filter Combinations (Proposed)

```typescript
interface SearchFilters {
  // Curriculum dimensions (all optional, combinable)
  subjects?: SubjectSlug[];       // Filter by subject(s)
  keyStages?: KeyStage[];         // Filter by key stage(s)
  years?: Year[];                 // Filter by year(s)
  phases?: Phase[];               // Filter by phase(s)
  
  // Content dimensions
  threads?: ThreadSlug[];
  categories?: CategorySlug[];    // English, Science, RE only
  
  // KS4-specific dimensions
  tiers?: Tier[];                 // 'foundation' | 'higher'
  examBoards?: ExamBoard[];
  unitOptions?: string[];         // Set texts, specialisms
}
```

**Invalid combinations** (e.g., year 7 + ks1) return empty results, not errors.

### Ground Truth Structure (Proposed)

```
ground-truth/
├── english/
│   ├── primary/           # Years 1-6 (KS1+KS2)
│   ├── secondary/         # Years 7-11 (KS3+KS4)
│   └── gcse/              # KS4 edge cases (set texts)
├── maths/
│   ├── primary/           # NEW
│   ├── secondary/         # Existing (restructured)
│   └── gcse/              # Complex topics
├── science/
│   ├── primary/           # Existing
│   └── secondary/         # Existing
└── [other subjects]/
    └── secondary/         # Most have secondary only
```

---

## What Is This Project?

**Oak National Academy** provides free, high-quality curriculum resources for UK schools (KS1-KS4, ages 5-16). This project builds **semantic search** over Oak's 16,000+ lessons to help teachers and AI agents find relevant educational content.

**Impact**: Teachers can find "lessons about equivalent fractions for Year 5" instead of navigating taxonomy trees.

---

## Repository Orientation

| Location | Purpose |
|----------|---------|
| `apps/oak-open-curriculum-semantic-search/` | Search app |
| `packages/sdks/oak-curriculum-sdk/` | Upstream Oak API access |
| `packages/libs/oak-curriculum-search-lib/` | Shared search library |
| `.agent/plans/semantic-search/` | Planning documents |
| `.agent/evaluations/` | Experiment framework |

---

## Before You Start

### 1. Read Foundation Documents (MANDATORY)

- **[rules.md](../../directives-and-memory/rules.md)** — First Question, TDD, no type shortcuts
- **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels
- **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

### 2. Verify Environment

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:status  # Should show 7 indices, 16,414 documents
```

### 3. Read the Current Plan

**[m3-revised-phase-aligned-search-quality.md](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md)**

---

## Known Data Issues

### MFL Transcripts Don't Exist (Upstream)

| Subject | Coverage | Implication |
|---------|----------|-------------|
| French | 0.2% | Search relies on metadata only |
| Spanish | 0.2% | Expected MRR ~0.2 is acceptable |
| German | 0.2% | Cannot fix without upstream change |

See [mfl-multilingual-embeddings.md](../../plans/semantic-search/post-sdk-extraction/mfl-multilingual-embeddings.md).

### Data Variances

**Essential reading**: [DATA-VARIANCES.md](../../../docs/data/DATA-VARIANCES.md)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/search-quality/ground-truth/` | Ground truths (being restructured) |
| `evaluation/analysis/analyze-cross-curriculum.ts` | Baseline analysis |
| `src/lib/hybrid-search/rrf-query-builders.ts` | ES query construction |

---

## Evaluation Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# Current (single key stage)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject maths --keyStage ks4

# After M3 Revised (phase-based)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --phase primary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --phase secondary
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject english --gcse
```

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

## Navigation

### Plans

| Document | Purpose |
|----------|---------|
| **[m3-revised-phase-aligned-search-quality.md](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md)** | **Current plan** |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Master roadmap |
| [current-state.md](../../plans/semantic-search/current-state.md) | Current metrics |
| [m3-search-quality-optimization.md](../../plans/semantic-search/active/m3-search-quality-optimization.md) | Original M3 (superseded) |

### Evaluations

| Document | Purpose |
|----------|---------|
| **[EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md)** | **How to run experiments — READ THIS** |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Record all baselines and experiments here |
| [experiments/template-for-search-experiments.md](../../evaluations/experiments/template-for-search-experiments.md) | Template for new experiments |

### Technical Docs

| Document | Purpose |
|----------|---------|
| **[DATA-VARIANCES.md](../../../docs/data/DATA-VARIANCES.md)** | Curriculum data differences |
| [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | MRR definitions |
| [QUERYING.md](../../../apps/oak-open-curriculum-semantic-search/docs/QUERYING.md) | Hybrid search queries |

---

## Key Principles

1. **Phase is the fundamental division** — not key stage
2. **Ground truths align with filter scope** — Primary queries test Primary content
3. **TDD always** — Red → Green → Refactor
4. **No type shortcuts** — No `as`, `any`, `!`
5. **Comprehensive coverage** — ALL phases × ALL subjects × ALL categories
