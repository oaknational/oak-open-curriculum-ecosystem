# Semantic Search - Fresh Chat Entry Point

**Status**: Part 1 In Progress — Tier 1 Fundamentals  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Strategy**: [ADR-082: Fundamentals-First](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)  
**Last Updated**: 2025-12-20

---

## Before You Start (MANDATORY)

### 1. Read Foundation Documents

These are non-negotiable. Read them before ANY work:

1. **[rules.md](../../directives-and-memory/rules.md)** — TDD, quality gates, no type shortcuts
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — Test types and TDD at ALL levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator-first architecture
4. **[ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)** — Fundamentals-first strategy

### 2. The First Question

Before every change, ask: **"Could it be simpler without compromising quality?"**

### 3. Cardinal Rule

If the upstream schema or SDK changes, running `pnpm type-gen` followed by `pnpm build` MUST be sufficient to bring all workspaces into alignment.

---

## Current State

For current metrics, index status, and known issues, see:

**[current-state.md](../../plans/semantic-search/current-state.md)** — THE single source of truth for current metrics

Quick summary:

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Lesson Hard MRR | 0.380 | ≥0.50 | ❌ Gap |
| Standard MRR | 0.931 | ≥0.92 | ✅ Met |

---

## Historical Context

For the full history of experiments and their impact:

**[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological experiment history

---

## Current Work

The active plan with detailed tasks:

**[Part 1: Search Excellence](../../plans/semantic-search/part-1-search-excellence.md)**

Current tier: **Tier 1 — Search Fundamentals**

Next tasks:
- B.4 Noise phrase filtering
- B.5 Phrase query enhancement
- B.6 Validate Tier 1 (MRR ≥0.45)

---

## Fresh Chat First Steps (MANDATORY)

### 1. Run Quality Gates (from repo root)

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

### 2. Re-Index Fresh Data (Before Any Search Experiments)

**Never run search quality smoke tests against stale indices.**

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup
pnpm es:ingest-live -- --subject maths --keystage ks4
pnpm es:status
```

### 3. Run Smoke Tests

```bash
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```

---

## Test Types for Search Work

| Test Type | What It Tests | File Pattern |
|-----------|---------------|--------------|
| **Unit** | Pure functions, no mocks, no IO | `*.unit.test.ts` |
| **Integration** | Units + simple injected mocks | `*.integration.test.ts` |
| **Smoke** | Running ES with real data | `smoke-tests/*.smoke.test.ts` |

**Critical**: Smoke tests are out-of-process tests against a running Elasticsearch instance.

---

## Key File Locations

### Current State & History

| File | Purpose |
|------|---------|
| [current-state.md](../../plans/semantic-search/current-state.md) | Current metrics, index status, known issues |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Chronological experiment history |
| [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap |

### Active Plan

| File | Purpose |
|------|---------|
| [README.md](../../plans/semantic-search/README.md) | Navigation hub |
| [part-1-search-excellence.md](../../plans/semantic-search/part-1-search-excellence.md) | Current work |

### Synonyms

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── maths.ts     # Maths KS4 synonyms (40+ entries)
└── index.ts     # Barrel export
```

### Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/      # RRF query builders
├── src/lib/search-quality/     # Ground truth, metrics
├── smoke-tests/                # Search quality benchmarks
└── docs/                       # INGESTION-GUIDE, SYNONYMS, etc.
```

---

## Key ADRs

| ADR | Title |
|-----|-------|
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | **Fundamentals-First Strategy** |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Search Evaluation Framework |
| [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) | SDK Domain Synonyms |

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
6. **No global state in tests**: Config as parameters, simple injected mocks
7. **Delete dead code**: If unused, delete it

---

**Ready?** Start with [Part 1: Search Excellence](../../plans/semantic-search/part-1-search-excellence.md)
