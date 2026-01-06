# Semantic Search — Navigation Hub

**Status**: ✅ **Full ingestion verified** — Now optimising search quality
**Last Updated**: 2026-01-03
**Session Entry Point**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Quick Start

**For new sessions, start with the prompt file:**

➡️ **[semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)** — Standalone session entry point

Then read:

1. **[roadmap.md](roadmap.md)** — Authoritative roadmap
2. **[current-state.md](current-state.md)** — Current metrics
3. **[search-acceptance-criteria.md](search-acceptance-criteria.md)** — Tier definitions

**Foundation Documents (MANDATORY)**:

- [rules.md](../../directives-and-memory/rules.md) — Cardinal Rule, TDD, no type shortcuts
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

---

## Directory Structure

```
.agent/plans/semantic-search/
├── README.md                      # This file (navigation hub)
├── roadmap.md                     # Authoritative linear roadmap
├── current-state.md               # Current metrics snapshot
├── search-acceptance-criteria.md  # Tier definitions
│
├── active/                        # CURRENT executable work
│   └── m3-revised-phase-aligned-search-quality.md  # Phase-aligned ground truths + filters
│
├── pre-sdk-extraction/            # Must complete before SDK extraction
│   ├── README.md                  # Overview
│   ├── bulk-data-analysis.md      # Vocabulary mining, transcripts, entities
│   ├── tier-2-document-relationships.md  # Cross-referencing, threads
│   └── tier-3-modern-es-features.md      # RRF tuning, field boosting
│
├── sdk-extraction/                # The SDK migration itself
│   ├── README.md                  # Overview
│   └── search-sdk-cli.md          # Full extraction specification
│
├── post-sdk-extraction/           # Requires SDK to exist first
│   ├── README.md                  # Overview
│   ├── mcp-search-tool.md         # MCP integration
│   ├── tier-4-ai-enhancement.md   # LLM pre-processing
│   └── advanced-features.md       # RAG, knowledge graph, etc.
│
├── backlog/                       # No clear timeline, documented ideas
│   ├── README.md                  # Overview
│   ├── reference-indices.md       # Glossary, NC coverage
│   └── resource-types.md          # Worksheets, quizzes
│
└── archive/completed/             # Completed work (historical)
```

---

## Dependency Chain

```
M3: Search Quality Optimization (active/)
        ↓
Comprehensive Filter Testing (pre-sdk-extraction/) ← HIGH PRIORITY
        ↓
Bulk Data Analysis (pre-sdk-extraction/)
        ↓
Tier 2: Document Relationships (pre-sdk-extraction/)
        ↓
Tier 3: Modern ES Features (pre-sdk-extraction/)
        ↓
SDK Extraction (sdk-extraction/)
        ↓
MFL Multilingual Embeddings (post-sdk-extraction/) ← HIGH PRIORITY
        ↓
MCP Search Tool (post-sdk-extraction/)
        ↓
Tier 4: AI Enhancement (post-sdk-extraction/)
```

---

## Two SDKs

This project involves TWO distinct SDKs:

| SDK               | Location                                | Purpose                              |
| ----------------- | --------------------------------------- | ------------------------------------ |
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/`    | Access to upstream Oak API, type-gen |
| **Search SDK**    | To be: `packages/libs/search-sdk/`      | Elasticsearch-backed semantic search |

The Search SDK **consumes types from** the Curriculum SDK but is a separate concern.

---

## Current ES Index State (2026-01-02)

| Index               | Documents | Storage    |
| ------------------- | --------- | ---------- |
| `oak_lessons`       | 184,985   | 806.62MB   |
| `oak_unit_rollup`   | 165,345   | 706.06MB   |
| `oak_units`         | 1,635     | 8.94MB     |
| `oak_threads`       | 164       | 255.53KB   |
| `oak_sequence_facets` | 57      | 375.14KB   |
| `oak_sequences`     | 30        | 267.67KB   |
| `oak_meta`          | 1         | 5.34KB     |

**Actual documents**: 16,414 (ES counts include ELSER sub-documents)

---

## 🔄 In Progress: M3 — Phase-Aligned Search Quality & Unified Evaluation

**Status**: 🔄 **Phases 1-7 Built** — Ready for Phase 8 (run baselines to validate)

See [active/m3-revised-phase-aligned-search-quality.md](active/m3-revised-phase-aligned-search-quality.md)

### Completed

| Completed | What |
|-----------|------|
| ✅ Filter Architecture | Array support for keyStages, years, phases |
| ✅ Ground Truth Restructure | Phase-aligned directories, KS4 as special case of secondary |
| ✅ Comprehensive Ground Truths | 14 primary subjects, all secondary subjects, KS4-specific |
| ✅ Unified Evaluation | `GROUND_TRUTH_REGISTRY`, `benchmark.ts`, cleanup |

### Next Priority

| Priority | Work | Why |
|----------|------|-----|
| **Phase 8** | Run comprehensive baselines | Measure MRR for all entries, update registry |

---

## Key ADRs

| ADR      | Title                        | Status      |
| -------- | ---------------------------- | ----------- |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-First Strategy | Active |
| [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) | Phrase Query Boosting | Implemented |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry Strategy | Verified |
| [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) | Context Enrichment | Complete |

---

## Quality Gates

Run from repo root after any changes:

```bash
pnpm type-gen && pnpm build && pnpm type-check
pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
pnpm test:ui && pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Technical Documentation (Search App)

All operational documentation lives in the search app workspace:

| Document | Location | Purpose |
| -------- | -------- | ------- |
| **IR Metrics Guide** | [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | MRR, NDCG@10, zero-hit rate definitions |
| **Querying** | [QUERYING.md](../../../apps/oak-open-curriculum-semantic-search/docs/QUERYING.md) | How hybrid search queries work |
| **Indexing** | [INDEXING.md](../../../apps/oak-open-curriculum-semantic-search/docs/INDEXING.md) | Index structure and fields |
| **Synonyms** | [SYNONYMS.md](../../../apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md) | Synonym expansion strategy |
| **Diagnostic Queries** | [DIAGNOSTIC-QUERIES.md](../../../apps/oak-open-curriculum-semantic-search/docs/DIAGNOSTIC-QUERIES.md) | Diagnostic query categories |
| **Ingestion Guide** | [INGESTION-GUIDE.md](../../../apps/oak-open-curriculum-semantic-search/docs/INGESTION-GUIDE.md) | How to run ingestion |
| **Data Completeness** | [DATA-COMPLETENESS.md](../../../apps/oak-open-curriculum-semantic-search/docs/DATA-COMPLETENESS.md) | Ingestion completeness policy |

---

## ES Documentation

**Do NOT guess how ES works** — read the official documentation:

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)
