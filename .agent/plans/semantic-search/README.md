# Semantic Search Planning Documents

**Status**: Phase 1 & 2 Complete | Phase 3 IN PROGRESS | Two-Way Hybrid (BM25 + ELSER) Confirmed Optimal  
**Last Updated**: 2025-12-12

---

## Quick Start

For new implementation sessions, read in this order:

1. **Foundation Documents** (MUST READ FIRST)
   - `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
   - `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
   - `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

2. **Requirements & Context** - `requirements.md`
   - Strategic goals and business success criteria
   - Risk mitigation strategies
   - Cost model ($0/month for AI/ML features - all included in ES Serverless)
   - Demo scenarios for validation

3. **Entry Point** - `.agent/prompts/semantic-search/semantic-search.prompt.md`
   - Current state summary
   - Phase status and next steps
   - Quick reference for commands and file locations

---

## Elasticsearch Documentation

Key ES documentation for this project:

| Topic                        | URL                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| **Hybrid Search (RRF)**      | https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html                     |
| **Semantic Search Overview** | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html         |
| **ELSER (Sparse Vectors)**   | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html   |
| **Semantic Reranking**       | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html      |
| **Retriever API**            | https://www.elastic.co/guide/en/elasticsearch/reference/current/retriever.html               |
| **Multi-index Search**       | https://www.elastic.co/guide/en/elasticsearch/reference/current/search-multiple-indices.html |

---

## Phase Overview

### Completed Phases

| Phase | Name          | Status      | Key Outcomes                                        |
| ----- | ------------- | ----------- | --------------------------------------------------- |
| 1     | Foundation    | ✅ Complete | Lexical baseline, ELSER fix, MRR 0.900 for lessons  |
| 2     | Dense Vectors | ✅ Complete | E5 evaluated - no benefit, two-way hybrid confirmed |

### Current Phase

| Phase | Name                     | Status         | Progress   | Description                        |
| ----- | ------------------------ | -------------- | ---------- | ---------------------------------- |
| **3** | **Multi-Index & Fields** | 🔄 In Progress | 8/18 tasks | Unit search, doc_type, OWA aliases |

**Phase 3 Completed:**

- ✅ Unit hybrid search verified (BM25 + ELSER)
- ✅ Unit ground truth expanded (43 queries)
- ✅ Unit smoke tests passing (MRR 0.915, NDCG@10 0.924)
- ✅ Three-way RRF code removed (dead code cleanup)
- ✅ All quality gates passing

**Phase 3 Remaining (10 tasks):**

- 🔲 BM25 vs ELSER vs Hybrid comparative experiment
- 🔲 Add `doc_type` field to all indexes
- 🔲 Verify unit filter on lesson search
- 🔲 ADR: unified vs separate endpoints
- 🔲 OWA aliases import
- 🔲 `pupilLessonOutcome` field
- 🔲 Display title fields
- 🔲 Unit enrichment fields
- 🔲 ADR: field additions
- 🔲 Unit reranking experiment

See `phase-3-multi-index-and-fields.md` for full details.

### Future Phases

#### Part 2: Enhancements (Phases 4-9)

| Phase | Name              | Status     | Effort   | Description                            |
| ----- | ----------------- | ---------- | -------- | -------------------------------------- |
| 4     | Search UI         | 📋 Planned | 3-4 days | Functional, portable search UX         |
| 5     | Cloud Functions   | 📋 Planned | 2-3 days | HTTP ingestion endpoints on Vercel     |
| 6     | Admin Dashboard   | 📋 Planned | 2-3 days | Ingestion control, metrics display     |
| 7     | Query Enhancement | 📋 Planned | 1-2 days | Production patterns, OWA compatibility |
| 8     | Entity Extraction | 📋 Future  | 3-4 days | NER, concept graphs                    |
| 9     | Reference Indices | 📋 Future  | 2-3 days | Subject/keystage metadata, threads     |

#### Part 3: AI Integration (Phase 10+)

| Phase | Name   | Status    | Effort     | Description               |
| ----- | ------ | --------- | ---------- | ------------------------- |
| 10+   | Future | 📋 Future | 15-20 days | RAG, Knowledge Graph, LTR |

---

## Current Metrics

### Lesson Search (314 Maths KS4 lessons)

| Metric        | Result    | Target  | Status   |
| ------------- | --------- | ------- | -------- |
| MRR           | **0.908** | > 0.70  | ✅ PASS  |
| NDCG@10       | 0.725     | > 0.75  | ⚠️ Below |
| Zero-hit rate | **0.0%**  | < 10%   | ✅ PASS  |
| p95 Latency   | **367ms** | < 300ms | ⚠️ Above |

### Unit Search (36 Maths KS4 units)

| Metric        | Result    | Target  | Status  |
| ------------- | --------- | ------- | ------- |
| MRR           | **0.915** | > 0.60  | ✅ PASS |
| NDCG@10       | **0.924** | > 0.65  | ✅ PASS |
| Zero-hit rate | **0.0%**  | < 15%   | ✅ PASS |
| p95 Latency   | **196ms** | < 300ms | ✅ PASS |

---

## Key Findings (Phase 1 & 2)

1. **Two-way hybrid is optimal** - BM25 + ELSER provides best balance of precision and recall
2. **E5 dense vectors provide no benefit** - For this dataset, sparse vectors (ELSER) are sufficient
3. **Reranker field matters critically** - Full transcripts cause 20+ second latencies; short titles lack semantic signal
4. **ELSER was not operational for lessons** - Fixed by adding `lesson_semantic: transcript` to document transform

See ES hybrid search documentation: https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html#semantic-search-hybrid

---

## Document Structure

```text
.agent/plans/semantic-search/
├── README.md                           # This file - navigation hub
├── requirements.md                     # Strategic context, risks, costs, demos
│
├── phase-3-multi-index-and-fields.md   # 🔄 Current - unit search, doc_type, aliases
├── phase-4-search-ui.md                # 📋 Planned - functional search experience
├── phase-5-cloud-functions.md          # 📋 Planned - HTTP ingestion endpoints
├── phase-6-admin-dashboard.md          # 📋 Planned - ingestion control UI
├── phase-7-query-enhancement.md        # 📋 Planned - query patterns, OWA compatibility
├── phase-8-entity-extraction.md        # 📋 Future - NER, concept graphs
├── phase-9-reference-indices.md        # 📋 Future - reference data, threads
├── phase-10-plus-future.md             # 📋 Future - RAG, KG, LTR, resource types
│
├── reference-docs/                     # Reference documentation
│   ├── reference-data-completeness-policy.md
│   ├── reference-es-serverless-feature-matrix.md
│   └── reference-ir-metrics-guide.md
│
└── archive/                            # Completed and superseded documents
    ├── phase-1-foundation-COMPLETE.md
    ├── phase-2-dense-vectors-COMPLETE.md
    └── ...
```

---

## Quality Gates

Run after every piece of work, from repo root, in order:

```bash
pnpm type-gen          # Generate types from schema
pnpm build             # Build all packages
pnpm type-check        # TypeScript validation
pnpm lint:fix          # Auto-fix linting issues
pnpm format:root       # Format code
pnpm markdownlint:root # Markdown lint
pnpm test              # Unit + integration tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built app
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

**All gates must pass. No exceptions.**

---

## Key File Locations

### Search Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/            # RRF query builders
├── src/lib/search-quality/           # Ground truth, metrics
├── src/lib/indexing/                 # Document transforms
├── smoke-tests/                      # Search quality benchmarks
└── docs/                             # INGESTION-GUIDE, SYNONYMS, etc.
```

### SDK & Field Definitions

```text
packages/sdks/oak-curriculum-sdk/
├── src/mcp/synonyms/                 # Subject, key stage, number synonyms
└── src/.../field-definitions/        # Index schemas (schema-first)
```

---

## Development Rules (From Foundation Docs)

### TDD is Mandatory at All Levels

1. **RED** - Write test first, run it, prove it fails
2. **GREEN** - Write minimal implementation to pass
3. **REFACTOR** - Improve implementation, tests stay green

This applies to unit tests, integration tests, AND E2E tests.

### Schema-First

All types flow from the OpenAPI schema via `pnpm type-gen`. Never hand-author types.

### No Type Shortcuts

Never use `as`, `any`, `!`, `Record<string, unknown>`. Preserve type information.

### All Quality Gates Must Pass

No exceptions. No `--no-verify`. Fix issues, don't disable checks.

### Delete Dead Code

If code is unused, delete it. No commented-out code. No skipped tests.

---

## ES Serverless Features Used

| Feature  | ES Endpoint                            | Cost | Purpose                             |
| -------- | -------------------------------------- | ---- | ----------------------------------- |
| BM25     | Built-in                               | $0   | Lexical search                      |
| ELSER    | `.elser-2-elasticsearch`               | $0   | Sparse semantic embeddings          |
| E5 Dense | `.multilingual-e5-small-elasticsearch` | $0   | Dense vectors (evaluated, not used) |
| ReRank   | `.rerank-v1-elasticsearch`             | $0   | Cross-encoder reranking             |
| LLM      | `.gp-llm-v2-chat_completion`           | $0   | Future RAG integration              |

All AI/ML features are included in the ES Serverless subscription at no additional cost.

See: https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html

---

## Rate Limit

**Oak API rate limit**: **10,000 requests/hour** (upgraded from 1,000)

This makes full curriculum ingestion feasible in reasonable time.

---

**Ready to start?** Read `.agent/prompts/semantic-search/semantic-search.prompt.md`
