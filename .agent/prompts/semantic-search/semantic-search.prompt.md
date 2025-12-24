# Semantic Search - Fresh Chat Entry Point

**Status**: Part 1 ACTIVE — Tier 1 EXHAUSTED, Tier 2 READY  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Strategy**: [ADR-082: Fundamentals-First](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)  
**Last Updated**: 2025-12-24

---

## 🎯 TL;DR — What's Actually Happening

**Tier 1 is EXHAUSTED** (2025-12-24). MRR 0.614 exceeds target (0.45), and all standard Tier 1 approaches have been verified. The intent-based category (0.229) has a documented exception — it requires Tier 4 (LLM/metadata) solutions.

### Current State

| What | Status |
|------|--------|
| Ground truth data | ✅ FIXED — 63 slugs corrected (ADR-085) |
| TRUE baseline | ✅ MEASURED — MRR 0.614 (verified 2025-12-24) |
| Quality gates | ✅ PASS — All 11 gates |
| Tier 1 target | ✅ MET — 0.614 ≥ 0.45 |
| Tier 1 exhaustion | ✅ COMPLETE — All approaches verified (2025-12-24) |
| Tier 2 | 🔓 READY — Can proceed when prioritised |

### What Was Verified (2025-12-24)

All Tier 1 standard approaches:
- ✅ Synonyms — All patterns work (single-word, phrase, UK/US, abbreviations, technical)
- ✅ Query processing — B.4 noise filtering, B.5 phrase boosting, stop words
- ✅ Vocabulary — Top 20 curriculum keywords analysed, no critical gaps
- ⚠️ Intent-based — Exception granted (requires Tier 4, not Tier 1)

---

## Current Metrics (Verified 2025-12-24)

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Lesson Hard MRR | **0.614** | ≥0.45 | ✅ Target met |
| Lesson Std MRR | 0.963 | ≥0.92 | ✅ Met |
| Unit Hard MRR | 0.806 | ≥0.50 | ✅ Met |
| Unit Std MRR | 0.988 | ≥0.92 | ✅ Met |

### Per-Category (Lesson Hard)

| Category | MRR | Status |
|----------|-----|--------|
| misspelling | 0.833 | ✅ Excellent |
| naturalistic | 0.722 | ✅ Good |
| multi-concept | 0.625 | ✅ Good |
| synonym | 0.611 | ✅ Good |
| colloquial | 0.500 | ✅ Good |
| **intent-based** | **0.229** | ⚠️ Exception granted (Tier 4 problem) |

---

## Before You Start (MANDATORY)

### 1. Read Foundation Documents

1. **[rules.md](../../directives-and-memory/rules.md)** — TDD, quality gates, no type shortcuts
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — Test types
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator-first
4. **[ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)** — Fundamentals-first strategy

### 2. The First Question

Before every change: **"Could it be simpler without compromising quality?"**

### 3. Cardinal Rule

`pnpm type-gen && pnpm build` MUST be sufficient to align all workspaces with upstream changes.

---

## Active Plan Structure

The search excellence work is now organised as:

```
.agent/plans/semantic-search/part-1-search-excellence/
├── README.md                       ← Master plan (START HERE)
├── 01-tier-1-fundamentals.md       ← ✅ COMPLETE (2025-12-24)
├── 02a-synonym-architecture.md     ← 📋 Fix circular dependency
├── 02b-vocabulary-mining.md        ← 🌟 COMPREHENSIVE vocabulary mining (HIGH)
├── 03-evaluation-infrastructure.md ← 📋 Unify directories
├── 04-documentation-debt.md        ← ✅ COMPLETE (2025-12-24)
├── 05-complete-data-indexing.md    ← 📋 Index ALL curriculum data
├── 06-reference-indices.md         ← 📋 Reference data (subjects, key stages)
└── 07-resource-types.md            ← 📋 Worksheets, quizzes, sequences
```

**Start with**: [part-1-search-excellence/README.md](../../plans/semantic-search/part-1-search-excellence/README.md)

---

## What's Next

### Tier 2: Document Relationships (🔓 Ready)

Tier 1 is exhausted. Tier 2 can proceed when prioritised:
- [ ] Cross-reference boosting between lessons and units
- [ ] Prerequisite/successor relationship scoring
- [ ] Thread context integration
- [ ] Sequence context integration

### Medium Priority

1. **Fix synonym circular dependency** — `generate-synonyms-file.ts` imports from runtime
2. **Unify evaluation directories** — `.agent/evaluations/` vs `apps/.../evaluation/`

### Low Priority

3. **Update remaining documentation** — ADR-082 needs Tier 1 status update

---

## Known Architectural Issue

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-synonyms-file.ts`

**Problem**: Type-gen code imports from SDK runtime code (line 5), which violates the cardinal rule and creates circular dependencies.

**Solution**: Move synonyms into type-gen-time code.

**Tracked in**: [02-synonym-architecture.md](../../plans/semantic-search/part-1-search-excellence/02-synonym-architecture.md)

---

## Fresh Chat First Steps

### 1. Verify Quality Gates

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm test:e2e:built && pnpm test:ui && pnpm smoke:dev:stub
```

### 2. Read the Master Plan

[part-1-search-excellence/README.md](../../plans/semantic-search/part-1-search-excellence/README.md)

### 3. Pick Next Work

**Tier 1 is COMPLETE.** Choose from:
- **Tier 2**: Document relationships (when prioritised)
- **02-synonym-architecture.md**: Fix circular dependency (medium priority)
- **03-evaluation-infrastructure.md**: Unify directories (medium priority)

---

## Key File Locations

### Plans & State
| File | Purpose |
|------|---------|
| [part-1-search-excellence/README.md](../../plans/semantic-search/part-1-search-excellence/README.md) | Master plan |
| [current-state.md](../../plans/semantic-search/current-state.md) | Verified metrics |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Experiment history |

### Ground Truth
| File | Purpose |
|------|---------|
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground truth validation |
| [ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md) | The 63-slug incident |

### Implementation
```
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/      # RRF query builders
├── src/lib/query-processing/   # Noise filtering, phrase detection
├── src/lib/search-quality/     # Ground truth, metrics
├── evaluation/analysis/        # Measurement scripts
└── smoke-tests/                # Search quality benchmarks
```

### Synonyms
```
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/  # SOURCE OF TRUTH
└── *.ts                                            # maths.ts, science.ts, etc.
```

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

## Principles

1. **Meeting target ≠ complete** — Exhaust options before moving on
2. **First Question**: Could it be simpler without compromising quality?
3. **TDD at ALL levels**: RED → GREEN → REFACTOR
4. **Schema-first**: All types flow from schema via `pnpm type-gen`
5. **No type shortcuts**: Never `as`, `any`, `!`
6. **Ground truth discipline**: All slugs validated by validation script
7. **Delete dead code**: If unused, delete it

---

**Ready?**

1. Read: [part-1-search-excellence/README.md](../../plans/semantic-search/part-1-search-excellence/README.md)
2. Pick a sub-plan based on priority
3. Continue the work
