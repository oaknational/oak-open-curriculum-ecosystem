# Semantic Search - Fresh Chat Entry Point

**Status**: Part 1 In Progress (Stream A ✅, Streams B/D 📋 Ready)  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Last Updated**: 2025-12-19

---

## Strategic Goal

Create a production-ready demo proving **Elasticsearch Serverless as the definitive platform** for intelligent curriculum search, using Maths KS4 as a vertical slice that scales to the full Oak curriculum.

**Why Maths KS4?** Maximum complexity (tiers, pathways, exam boards), high teacher value, complete feature coverage, manageable scope (~10 minutes to ingest).

---

## Quick Start

1. **Read foundation documents first** (mandatory):
   - `.agent/directives-and-memory/rules.md` — TDD, quality gates, no type shortcuts
   - `.agent/directives-and-memory/schema-first-execution.md` — All types from schema
   - `.agent/directives-and-memory/testing-strategy.md` — Test types and TDD approach

2. **Current plan**: [Part 1: Search Excellence](.agent/plans/semantic-search/part-1-search-excellence.md)

3. **Navigation hub**: [.agent/plans/semantic-search/README.md](.agent/plans/semantic-search/README.md)

4. **Requirements & context**: [.agent/plans/semantic-search/requirements.md](.agent/plans/semantic-search/requirements.md)

---

## Current State Summary

### Success Criteria (from ADR-081)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Standard Query MRR | 0.931 | ≥0.92 | ✅ Met |
| Hard Query MRR | 0.367 | ≥0.50 | ❌ Gap: 36% |
| Zero-hit Rate | 0% | 0% | ✅ Met |
| p95 Latency | ~450ms | ≤1500ms | ✅ Within budget |

### Part 1 Stream Status

```text
Part 1: Search Excellence
═══════════════════════════════════════════════════════════════════
Done when: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption

Stream A: Foundation                              ✅ Complete
  4-way hybrid, KS4 filtering, content-type-aware BM25, ground truth

Stream B: Relevance Optimisation                  📋 Ready to Start
  B.1 Baseline documentation (B-001) ← START HERE (mandatory)
  B.2 Semantic reranking experiment (E-001)
  B.3 Linear retriever experiment (E-003)

Stream C: Query Intelligence                      📋 Blocked on B.2
  Query expansion, phonetic, classification (wait for reranking results)

Stream D: Infrastructure                          📋 Ready to Start
  Extract Search SDK, CLI workspace, retire Next.js
```

**Next Step**: Stream B.1 — Complete baseline documentation (B-001)

⚠️ **B.1 is mandatory.** Without comprehensive per-query baseline data, experiments cannot be properly evaluated. You must document exact ranks and failure modes for all 15 hard queries before running any experiments.

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

**All gates must pass before proceeding.** Resolve any issues gate-by-gate.

### 2. Re-Index Fresh Data (Before Any Search Experiments)

**⚠️ Never run search quality smoke tests against stale indices.** Results are meaningless without fresh data.

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup                                           # Ensure mappings are current
pnpm es:ingest-live -- --subject maths --keystage ks4   # ~5-10 minutes
pnpm es:status                                          # Verify document counts
```

**Expected counts**: ~314 lessons, ~36 units for Maths KS4.

### 3. Run Smoke Tests

```bash
# Direct ES tests (no server needed)
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority

# API-based tests (need pnpm dev in another terminal)
pnpm vitest run -c vitest.smoke.config.ts scope-verification
pnpm vitest run -c vitest.smoke.config.ts search-quality
pnpm vitest run -c vitest.smoke.config.ts unit-search
pnpm vitest run -c vitest.smoke.config.ts ks4-filtering
```

---

## Architecture Notes

### Four-Retriever Design

Each entity (lesson, unit) uses four retrievers combined via RRF:

1. **BM25 on Content** — Lexical matching on teaching material
2. **ELSER on Content** — Semantic matching on teaching material
3. **BM25 on Structure** — Lexical matching on metadata/summaries
4. **ELSER on Structure** — Semantic matching on metadata/summaries

**Design rationale**: Content fields contain actual teaching material (transcripts). Structure fields contain curated metadata (learning objectives, curriculum alignment). Both perspectives are valuable for different query types.

### ES Serverless Features ($0 additional cost)

| Feature | Endpoint | Status |
|---------|----------|--------|
| BM25 | Built-in | ✅ Used |
| ELSER | `.elser-2-elasticsearch` | ✅ Used |
| ReRank | `.rerank-v1-elasticsearch` | 📋 E-001 experiment |
| LLM | `.gp-llm-v2-chat_completion` | 📋 E-002 experiment |

### Key ADRs

| ADR | Title |
|-----|-------|
| [ADR-081](docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Search Evaluation Framework |
| [ADR-080](docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) | KS4 Metadata Denormalisation |
| [ADR-075](docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Dense Vector Removal |

---

## Key File Locations

### Current Plan

```text
.agent/plans/semantic-search/
├── README.md                    # Navigation hub
├── part-1-search-excellence.md  # Current work — four streams
├── requirements.md              # Strategic context
└── phase-3-multi-index-and-fields.md  # Stream A reference
```

### Experiments

```text
.agent/evaluations/experiments/
├── B-001-hard-query-baseline.experiment.md     # Baseline documentation
├── E-001-semantic-reranking.experiment.md      # Stream B.2
├── E-002-query-expansion.experiment.md         # Stream C.1
├── E-003-linear-retriever.experiment.md        # Stream B.3
└── E-004-phonetic-enhancement.experiment.md    # Stream C.2
```

### Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/      # RRF query builders
├── src/lib/search-quality/     # Ground truth, metrics
├── src/lib/indexing/           # Document transforms
└── smoke-tests/                # Search quality benchmarks
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

**Rate Limit**: Oak API upgraded to **10,000 requests/hour**.

---

## Remember

1. **TDD is mandatory** — Write tests FIRST at ALL levels
2. **Schema-first** — All types flow from schema via `pnpm type-gen`
3. **No type shortcuts** — No `as`, `any`, `!`, `Record<string, unknown>`
4. **All quality gates must pass** — No exceptions
5. **Re-index before smoke tests** — Stale data = meaningless results
6. **Check experiments** — E-001 through E-004 have detailed methodology

---

## Elasticsearch Documentation

| Topic | URL |
|-------|-----|
| Hybrid Search (RRF) | <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html> |
| Linear Retriever | <https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search> |
| Semantic Reranking | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html> |
| ELSER | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html> |

---

**Ready?** Start with [Part 1: Search Excellence](.agent/plans/semantic-search/part-1-search-excellence.md)

Next task: Stream B.1 — Complete baseline documentation (B-001)
