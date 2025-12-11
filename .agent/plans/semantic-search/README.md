# Semantic Search Planning Documents

**Status**: Phase 1 & 2 Complete | Phase 3+ Restructured | Two-Way Hybrid (BM25 + ELSER) Confirmed Optimal  
**Last Updated**: 2025-12-11

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
   - Cost model (spoiler: $0/month for AI/ML features)
   - Demo scenarios for validation
   - **New**: Search UI, Cloud Functions, Admin Dashboard deliverables

3. **Entry Point** - `.agent/prompts/semantic-search/semantic-search.prompt.md`
   - Current state summary
   - Phase status and next steps
   - Quick reference for commands and file locations

---

## Phase Overview

Remaining work is organized into three parts:

### Part 1: MCP Prerequisites (Phase 3)

Foundation for a `semantic_search` MCP tool that searches lessons and units with filters.

| Phase | Name                     | Status  | Effort   | Description                        |
| ----- | ------------------------ | ------- | -------- | ---------------------------------- |
| **3** | **Multi-Index & Fields** | 📋 Next | 2-3 days | Unit search, doc_type, OWA aliases |

### Part 2: Enhancements (Phases 4-9)

UI, admin tooling, query improvements, and curriculum enrichment. Phase 9 transforms raw search into a curriculum discovery interface.

| Phase | Name              | Status     | Effort   | Description                            |
| ----- | ----------------- | ---------- | -------- | -------------------------------------- |
| 4     | Search UI         | 📋 Planned | 3-4 days | Functional, portable search UX         |
| 5     | Cloud Functions   | 📋 Planned | 2-3 days | HTTP ingestion endpoints on Vercel     |
| 6     | Admin Dashboard   | 📋 Planned | 2-3 days | Ingestion control, metrics display     |
| 7     | Query Enhancement | 📋 Planned | 1-2 days | Production patterns, OWA compatibility |
| 8     | Entity Extraction | 📋 Future  | 3-4 days | NER, concept graphs                    |
| 9     | Reference Indices | 📋 Future  | 2-3 days | Subject/keystage metadata, threads     |

### Part 3: AI Integration (Phase 10+)

Advanced AI capabilities: RAG, Knowledge Graph, Learning to Rank.

| Phase | Name   | Status    | Effort     | Description               |
| ----- | ------ | --------- | ---------- | ------------------------- |
| 10+   | Future | 📋 Future | 15-20 days | RAG, Knowledge Graph, LTR |

### Completed Phases

| Phase | Name          | Status      | Description                 |
| ----- | ------------- | ----------- | --------------------------- |
| 1     | Foundation    | ✅ Complete | Lexical baseline, ELSER fix |
| 2     | Dense Vectors | ✅ Complete | E5 evaluated, no benefit    |

---

## Document Structure

```text
.agent/plans/semantic-search/
├── README.md                           # This file - navigation hub
├── requirements.md                     # Strategic context, risks, costs, demos
│
├── phase-3-multi-index-and-fields.md   # 📋 Current - unit search, doc_type, aliases
├── phase-4-search-ui.md                # 📋 NEW - functional search experience
├── phase-5-cloud-functions.md          # 📋 NEW - HTTP ingestion endpoints
├── phase-6-admin-dashboard.md          # 📋 NEW - ingestion control UI
├── phase-7-query-enhancement.md        # 📋 Query patterns, OWA compatibility
├── phase-8-entity-extraction.md        # 📋 NER, concept graphs
├── phase-9-reference-indices.md        # 📋 Reference data, threads
├── phase-10-plus-future.md             # 📋 RAG, KG, LTR, resource types
│
├── reference-docs/                     # Reference documentation
│   ├── reference-data-completeness-policy.md
│   ├── reference-es-serverless-feature-matrix.md
│   └── reference-ir-metrics-guide.md
│
└── archive/                            # Completed and superseded documents
    ├── phase-1-foundation-COMPLETE.md       # ✅ Complete
    ├── phase-2-dense-vectors-COMPLETE.md    # ✅ Complete
    ├── phase-3-plus-roadmap-BACKUP.md       # Backup before restructure
    ├── maths-ks4-implementation-plan.md     # Original 3000-line plan
    └── search-ui-plan.md                    # Old UI plan (superseded by Phase 4)
```

---

## Current Results: Two-Way Hybrid (BM25 + ELSER) - CONFIRMED OPTIMAL

| Metric        | Result    | Target  | Status   |
| ------------- | --------- | ------- | -------- |
| MRR           | **0.900** | > 0.70  | ✅ PASS  |
| NDCG@10       | 0.716     | > 0.75  | ❌ Below |
| Zero-hit rate | **0.0%**  | < 10%   | ✅ PASS  |
| Avg Latency   | **153ms** | < 300ms | ✅ PASS  |

**3 of 4 targets met.** Two-way hybrid confirmed optimal after extensive Phase 2 experimentation.

---

## Key Findings (Phase 1 & 2)

1. **Two-way hybrid is optimal** - BM25 + ELSER provides best balance
2. **E5 dense vectors provide no benefit** - For this dataset, sparse vectors (ELSER) are sufficient
3. **Reranker field matters critically** - Full transcripts cause 20+ second latencies; short titles lack semantic signal
4. **ELSER was not operational for lessons** - Fixed by adding `lesson_semantic: transcript` to document transform

---

## Next Steps: Phase 3

### Priority Tasks

| Task                               | Priority     | Notes                               |
| ---------------------------------- | ------------ | ----------------------------------- |
| **Verify unit hybrid search**      | **CRITICAL** | Ensure units use BM25 + ELSER       |
| **Test unit search quality**       | **HIGH**     | Create ground truth and smoke tests |
| **Experiment with unit reranking** | **HIGH**     | Test with `rollup_text` field       |
| **Add `doc_type` field**           | Medium       | Distinguish lesson/unit in results  |
| **Import OWA aliases**             | Medium       | Better query understanding          |

See `phase-3-multi-index-and-fields.md` for full details.

---

## Quality Gates

Run after every piece of work, from repo root, in order:

```bash
pnpm type-gen                                     # Generate types
pnpm build                                        # Build all
pnpm type-check                                   # TypeScript validation
pnpm lint:fix                                     # Auto-fix linting
pnpm format:root                                  # Format code
pnpm markdownlint:root                            # Markdown lint
pnpm test                                         # Unit + integration
pnpm test:e2e                                     # E2E tests
pnpm test:e2e:built                               # E2E on built app
pnpm test:ui                                      # Playwright UI tests
pnpm smoke:dev:stub                               # Smoke tests
```

All gates must pass. No exceptions.

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

### SDK Synonyms

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── subjects.ts                       # Subject name variations
├── key-stages.ts                     # Key stage aliases
├── numbers.ts                        # Maths terms (squared → quadratic)
└── index.ts                          # Barrel exports
```

---

## Development Rules (From Foundation Docs)

### TDD is Mandatory

1. **RED** - Write test first, run it, prove it fails
2. **GREEN** - Write minimal implementation to pass
3. **REFACTOR** - Improve implementation, tests stay green

### No Type Shortcuts

Never use `as`, `any`, `!`, `Record<string, unknown>`. All types flow from `pnpm type-gen`.

### All Quality Gates Must Pass

No exceptions. No `--no-verify`. Fix issues, don't disable checks.

---

## Rate Limit Update

**Oak API rate limit upgraded**: 1,000 → **10,000 requests/hour**

This significantly reduces ingestion time for full curriculum indexing.

---

**Ready to start?** Read `.agent/prompts/semantic-search/semantic-search.prompt.md`
