# Semantic Search - Fresh Chat Entry Point

**Status**: Part 1 ACTIVE — 🔴 RE-BASELINE REQUIRED (Ground Truth Corrected)  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Strategy**: [ADR-082: Fundamentals-First](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)  
**Last Updated**: 2025-12-23 23:00 UTC

---

## 🔴 TL;DR — Ground Truth Fixed, All Experiments Need Re-Running

**On 2025-12-23, we discovered that 63 ground truth slugs (15%) were invalid** — lesson references that don't exist in the Oak Curriculum API. All previous MRR measurements are suspect.

### The Situation

| What | Status |
|------|--------|
| Ground truth data | ✅ **FIXED** — 63 slugs corrected |
| Integration test | ✅ **CREATED** — validates all slugs exist |
| Sequence ground truth | ✅ **CREATED** — 41 queries |
| Quality gates | ✅ **PASS** — All 11 gates |
| MRR measurements | ⚠️ **UNVERIFIED** — need re-measurement |
| Semantic reranking decision | ⚠️ **NEEDS RE-EVALUATION** — may have been wrongly rejected |

### What Must Happen First

**Re-run ALL experiments** to establish TRUE baselines:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # New hard query baseline
pnpm eval:diagnostic      # New diagnostic baseline
```

**Then**:
1. Update `current-state.md` with VERIFIED metrics
2. Add entry to `EXPERIMENT-LOG.md`: "Ground Truth Correction Baseline"
3. Re-evaluate the semantic reranking decision

### What We Preserve (Going Forward, Not Back)

We are NOT going back in time. The following remain valid:

| Category | What We Keep |
|----------|--------------|
| **Implementations** | B.4 noise filtering, B.5 phrase boosting, 163 synonyms |
| **Architecture** | Four-retriever hybrid, RRF fusion |
| **Learnings** | ES synonym filter works for tokens not phrases |
| **Strategy** | Fundamentals-first (ADR-082) |
| **Ground Truth** | ✅ NOW VALIDATED — can trust future measurements |

---

## Quality Gates — ✅ VERIFIED (2025-12-23)

All 11 quality gates pass. No code changes needed before running experiments.

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

## Before You Start (MANDATORY)

### 1. Read Foundation Documents

These are non-negotiable. Read them before ANY work:

1. **[rules.md](../../directives-and-memory/rules.md)** — TDD, quality gates, no type shortcuts
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — Test types and TDD at ALL levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator-first architecture
4. **[ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)** — Fundamentals-first strategy

### 2. Understand the Ground Truth Situation

Read: **[ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)**

Key points:
- 63 slugs were fabricated or incorrectly named
- MRR was scoring against phantom lessons
- "Failures" may have been correct — searching for lessons that don't exist
- The semantic reranking rejection (-16.8%) may be WRONG

### 3. The First Question

Before every change, ask: **"Could it be simpler without compromising quality?"**

### 4. Cardinal Rule

If the upstream schema or SDK changes, running `pnpm type-gen` followed by `pnpm build` MUST be sufficient to bring all workspaces into alignment.

---

## Current State (⚠️ UNVERIFIED)

For current metrics, index status, and known issues, see:

**[current-state.md](../../plans/semantic-search/current-state.md)** — THE single source of truth

Quick summary:

| Metric | Previous Value | Verified Value | Notes |
|--------|----------------|----------------|-------|
| Lesson Hard MRR | 0.369 | ??? | Re-measure with corrected GT |
| Unit Hard MRR | 0.856 | ??? | Re-measure with corrected GT |
| Lesson Std MRR | 0.944 | ??? | Re-measure with corrected GT |
| Unit Std MRR | 0.988 | ??? | Re-measure with corrected GT |
| Indexed Lessons | 436 | 436 | ✅ Validated |
| Synonyms Deployed | 163 | 163 | ✅ Deployed |

---

## Experiments Needing Re-Evaluation

| Experiment | Previous Decision | Action |
|------------|-------------------|--------|
| **Semantic Reranking** | ❌ REJECTED (-16.8%) | ⚠️ **RE-RUN** — decision may be wrong |
| B.3 Synonym Coverage | ✅ ACCEPTED (+3.5%) | 🔄 Verify improvement holds |
| B.4 Noise Filtering | ✅ ACCEPTED (+16.8%) | 🔄 Verify improvement holds |
| B.5 Phrase Boosting | (never measured) | 🔄 Get actual measurements |

**Critical**: The semantic reranking experiment was rejected based on invalid ground truth. We may have discarded a working approach.

---

## Immediate Priorities

### Priority 1: Establish TRUE Baselines

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # Lesson hard queries by category
pnpm eval:diagnostic      # Detailed pattern analysis
```

Document the results in:
- `current-state.md` — Replace ??? with actual values
- `EXPERIMENT-LOG.md` — New entry "Ground Truth Correction Baseline"

### Priority 2: Measure B.5 Impact

B.5 Phrase Boosting is implemented but was never measured. Get actual numbers.

### Priority 3: Re-Evaluate Semantic Reranking

Once true baselines are established, re-run the semantic reranking experiment.

---

## Current Implementation Status

### ✅ Implemented (Need Verification)

| Feature | Files | Claimed Impact | Verified? |
|---------|-------|----------------|-----------|
| B.4 Noise Filtering | `remove-noise-phrases.ts` | +16.8% | ❌ Re-measure |
| B.5 Phrase Boosting | `detect-curriculum-phrases.ts`, `rrf-query-helpers.ts` | Unknown | ❌ Measure |
| Synonyms | `synonyms/maths.ts` (163 entries) | Working | ❌ Validate |

### ✅ INGESTION COMPLETE

All ingestion data quality issues resolved (2025-12-22):
- 436 lessons indexed (validated vs bulk download)
- 36 units with correct lesson counts
- All thread fields populated

---

## Ground Truth Files (CORRECTED)

```text
src/lib/search-quality/ground-truth/
├── ground-truth.integration.test.ts  # ✅ Validates ALL slugs via API
├── hard-queries.ts                   # ✅ 15 slugs corrected
├── diagnostic-synonym-queries.ts     # ✅ 9 slugs corrected
├── diagnostic-multi-concept-queries.ts # ✅ 9 slugs corrected
├── units/                            # ✅ All 36 slugs validated
│   ├── hard-queries.ts
│   └── *.ts
└── sequences/                        # ✅ NEW — 41 queries created
    ├── types.ts
    ├── standard-queries.ts           # 24 queries
    ├── hard-queries.ts               # 17 queries
    └── index.ts
```

---

## Fresh Chat First Steps (MANDATORY)

### 1. Verify Quality Gates (from repo root)

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

**All gates must pass. Fail fast. No exceptions.**

### 2. Run Evaluation Scripts

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # Hard query baseline with CORRECTED ground truth
pnpm eval:diagnostic      # Diagnostic analysis with CORRECTED ground truth
```

### 3. Update Documentation

1. Update `current-state.md` with VERIFIED metrics
2. Add entry to `EXPERIMENT-LOG.md`
3. Update this prompt with verified values

---

## Key File Locations

### Ground Truth & Validation

| File | Purpose |
|------|---------|
| [ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md) | Details of all 63 corrections |
| `ground-truth.integration.test.ts` | Validates all slugs exist in API |

### Current State & History

| File | Purpose |
|------|---------|
| [current-state.md](../../plans/semantic-search/current-state.md) | Current metrics (UNVERIFIED) |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Chronological experiment history |
| [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap |

### Active Plan

| File | Purpose |
|------|---------|
| [README.md](../../plans/semantic-search/README.md) | Navigation hub |
| [part-1-search-excellence.md](../../plans/semantic-search/part-1-search-excellence.md) | Current work |

### Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/      # RRF query builders
├── src/lib/query-processing/   # B.4 noise, B.5 phrases
├── src/lib/search-quality/     # Ground truth, metrics
├── evaluation/
│   ├── analysis/               # Measurement scripts
│   └── experiments/            # Hypothesis testing
└── smoke-tests/                # Search quality benchmarks
```

---

## Key ADRs

| ADR | Title |
|-----|-------|
| [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) | **Phrase Query Boosting** |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | **Fundamentals-First Strategy** |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Search Evaluation Framework |

---

## Environment

Required in `apps/oak-open-curriculum-semantic-search/.env.local`:

```bash
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here
LOG_LEVEL=info
```

---

## Principles (from Foundation Documents)

1. **First Question**: Could it be simpler without compromising quality?
2. **TDD at ALL levels**: RED → GREEN → REFACTOR, tests FIRST
3. **Schema-first**: All types flow from schema via `pnpm type-gen`
4. **No type shortcuts**: Never `as`, `any`, `!`, `Record<string, unknown>`
5. **Fail fast**: Never silently fail, helpful error messages
6. **Ground truth discipline**: All slugs must exist, validated by integration test
7. **Delete dead code**: If unused, delete it

---

## Key Insight: We Are Going Forward, Not Back

The ground truth correction is a **quality improvement**, not a setback:

1. **Before**: Measurements were noise — scoring against phantom lessons
2. **After**: Measurements will be valid — can trust the numbers
3. **Preserved**: All implementations, architecture, learnings, strategy

The semantic reranking rejection may be wrong. The B.4/B.5 improvements may be larger or smaller than claimed. **We don't know until we measure with valid ground truth.**

---

**Ready?** 

1. First: Run `pnpm eval:per-category` to establish TRUE baselines
2. Then: Update documentation with VERIFIED metrics
3. Finally: Continue with [Part 1: Search Excellence](../../plans/semantic-search/part-1-search-excellence.md)
