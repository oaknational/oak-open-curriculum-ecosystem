# Part 1: Search Excellence

**Status**: 🔄 In Progress  
**Priority**: High  
**Done When**: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption  
**Created**: 2025-12-19

---

## Foundation Documents

Before starting any work, read and commit to:

1. [rules.md](../../directives-and-memory/rules.md) — TDD, quality gates, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — Test types and TDD approach
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator-first architecture

---

## Success Criteria

From [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md):

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Standard Query MRR | 0.931 | ≥0.92 | ✅ Met |
| Hard Query MRR | 0.367 | ≥0.50 | ❌ Gap: 36% |
| Zero-hit Rate | 0% | 0% | ✅ Met |
| p95 Latency | ~450ms | ≤1500ms | ✅ Within budget |

---

## Stream Overview

```text
═══════════════════════════════════════════════════════════════════
Part 1: Search Excellence
═══════════════════════════════════════════════════════════════════
Done when: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption

Stream A: Foundation                                [✅ Complete]
───────────────────────────────────────────────────────────────────
  A.1  4-way hybrid implementation                         ✅
  A.2  KS4 filtering                                       ✅
  A.3  Content-type-aware BM25                             ✅
  A.4  Ground truth queries defined                        ✅

Stream B: Relevance Optimisation                    [📋 Ready]
───────────────────────────────────────────────────────────────────
  B.1  Baseline documentation ← START HERE          B-001  📋
  B.2  Semantic reranking experiment                E-001  📋
  B.3  Linear retriever experiment                  E-003  📋
  B.4  Implement winning approaches                        📋
  B.5  Validate MRR ≥0.50                                  📋

Stream C: Query Intelligence                        [📋 Blocked]
───────────────────────────────────────────────────────────────────
  C.1  Query expansion experiment                   E-002  📋
  C.2  Phonetic enhancement experiment              E-004  📋
  C.3  Query classification design                  ADR-082 📋
  C.4  Implement classification routing                    📋

Stream D: Infrastructure                            [📋 Ready]
───────────────────────────────────────────────────────────────────
  D.1  Extract Search SDK                                  📋
  D.2  Create CLI workspace                                📋
  D.3  Retire Next.js app                                  📋
  D.4  Documentation                                       📋

Dependencies:
  • C.1-C.4 depend on B.2 results (reranking may obviate expansion)
  • Part 2 depends on D.1-D.3 (SDK must exist for MCP to consume)
  • Stream D can start immediately (no blockers)
```

---

## Stream A: Foundation [✅ Complete]

**Purpose**: Establish the baseline search infrastructure with four-retriever hybrid architecture.

**Completed Work** (see [phase-3-multi-index-and-fields.md](phase-3-multi-index-and-fields.md)):

| Task | Description | Status |
|------|-------------|--------|
| A.1 | Four-way hybrid implementation (BM25 + ELSER on Content + Structure) | ✅ |
| A.2 | KS4 filtering (tier, examBoard, examSubject, ks4Option) | ✅ |
| A.3 | Content-type-aware BM25 (min_should_match: 75% for lessons) | ✅ |
| A.4 | Ground truth queries defined (standard + hard) | ✅ |

**Key Outcomes**:

- Standard Query MRR: 0.931
- Hard Query MRR: 0.367 (improved from 0.250 baseline)
- All quality gates passing

---

## Stream B: Relevance Optimisation [📋 Ready to Start]

**Purpose**: Improve Hard Query MRR from 0.367 to ≥0.50 through retrieval and reranking experiments.

**Rationale**: Research ([search-query-optimization-research.md](../../research/search-query-optimization-research.md)) identified that semantic reranking and linear retriever weighting are the highest-impact, lowest-risk approaches.

### ⚠️ B.1 is Mandatory Before Any Experiments

**Do not skip B.1.** Without a comprehensive per-query baseline:

- You cannot measure whether an experiment improved or regressed specific queries
- You cannot identify which failure categories benefit from which approaches
- You cannot distinguish real improvements from noise
- Experiment results will be uninterpretable and the work wasted

B.1 requires running all 15 hard queries, recording exact ranks, and documenting failure modes. This takes ~1 hour but saves days of wasted experimentation.

### Tasks

| ID | Task | Experiment | Status | Notes |
|----|------|------------|--------|-------|
| **B.1** | **Document baseline behaviour** | [B-001](../../evaluations/experiments/B-001-hard-query-baseline.experiment.md) | 📋 | **START HERE** — Per-query analysis |
| B.2 | Semantic reranking experiment | [E-001](../../evaluations/experiments/E-001-semantic-reranking.experiment.md) | 📋 | `.rerank-v1-elasticsearch` |
| B.3 | Linear retriever experiment | [E-003](../../evaluations/experiments/E-003-linear-retriever.experiment.md) | 📋 | Weight ELSER higher than BM25 |
| B.4 | Implement winning approaches | — | 📋 | Based on B.2/B.3 results |
| B.5 | Validate Hard MRR ≥0.50 | — | 📋 | Final acceptance gate |

### Experiment Decision Criteria

From [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md):

| Change Type | Accept If | Reject If |
|-------------|-----------|-----------|
| Reranking | Hard MRR ≥+15%, Standard MRR ≥0.92 | p95 latency >2000ms |
| Fusion change | Overall MRR ≥+5% | Hard query MRR regresses |

### Dependencies

- None — can start immediately
- Blocks: Stream C (reranking may obviate query expansion)

---

## Stream C: Query Intelligence [📋 Blocked on B.2]

**Purpose**: Improve handling of specific hard query categories through pre-processing.

**Rationale**: Different query types (misspellings, naturalistic, intent-based) may benefit from different pre-processing strategies. However, if reranking (B.2) achieves target MRR, complex pre-processing may be unnecessary.

### Tasks

| ID | Task | Experiment | Status | Notes |
|----|------|------------|--------|-------|
| C.1 | Query expansion experiment | [E-002](../../evaluations/experiments/E-002-query-expansion.experiment.md) | 📋 | LLM-based synonym/term expansion |
| C.2 | Phonetic enhancement experiment | [E-004](../../evaluations/experiments/E-004-phonetic-enhancement.experiment.md) | 📋 | Metaphone/Soundex for misspellings |
| C.3 | Query classification design | ADR-082 | 📋 | Route queries to optimal pipeline |
| C.4 | Implement classification routing | — | 📋 | Based on C.3 design |

### Dependencies

- **Blocked by B.2**: Wait for reranking results before investing in expansion
- If reranking achieves ≥0.50 MRR, Stream C may be deferred to Part 3

---

## Stream D: Infrastructure [📋 Ready to Start]

**Purpose**: Extract Search SDK for MCP consumption and retire the Next.js app layer.

**Rationale**: The current implementation is packaged as a Next.js app, but actual usage is scripts + `src/lib/**`. MCP integration requires a clean SDK boundary.

### Tasks

| ID | Task | Status | Notes |
|----|------|--------|-------|
| D.1 | Extract Search SDK | 📋 | `packages/libs/<search-sdk>/` |
| D.2 | Create CLI workspace | 📋 | First-class CLI, not ad-hoc scripts |
| D.3 | Retire Next.js app | 📋 | Remove from build graph |
| D.4 | Documentation | 📋 | Preserve patterns as docs/examples |

### SDK Architecture

From [phase-4-search-sdk-and-cli.md](phase-4-search-sdk-and-cli.md):

```typescript
// Public API surface
createSearchSdk({ deps, config }) -> {
  retrieval,    // RRF query builders, result shaping
  admin,        // ES setup, ingestion, rollups
  observability // Zero-hit logging, metrics
}
```

**Key Principle**: Config and clients are provided by the consumer. No internal singletons.

### Checkpoints

1. **A**: Confirm assumptions, define contract (TDD entry)
2. **B**: Extract Retrieval service (read path)
3. **C**: Extract Admin/Indexing service (write path)
4. **D**: Extract Observability service
5. **E**: Build CLI workspace
6. **F**: MCP integration wiring
7. **G**: Retire Next.js layer

### Dependencies

- None — can start immediately
- Enables: Part 2 (MCP Natural Language Tools)

---

## Elasticsearch Documentation

| Topic | URL |
|-------|-----|
| Hybrid Search (RRF) | <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html> |
| Linear Retriever | <https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search> |
| Semantic Reranking | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html> |
| ELSER | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html> |
| Inference API | <https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html> |

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

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [phase-3-multi-index-and-fields.md](phase-3-multi-index-and-fields.md) | Stream A completed work |
| [phase-4-search-sdk-and-cli.md](phase-4-search-sdk-and-cli.md) | Stream D detailed checkpoints |
| [search-query-optimization-research.md](../../research/search-query-optimization-research.md) | Stream B/C technical approaches |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Metrics and decision criteria |

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-19 | Initial document created from plan restructure |
