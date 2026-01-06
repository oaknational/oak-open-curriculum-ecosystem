# Semantic Search Roadmap

**Status**: ✅ **Full ingestion verified** — Now optimising search quality
**Last Updated**: 2026-01-03
**Metrics Source**: [current-state.md](current-state.md)
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

This is THE authoritative roadmap for semantic search work.

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

## ✅ Completed Milestones

### Milestone 1: Complete ES Ingestion ✅

| Metric            | Value        |
| ----------------- | ------------ |
| Documents indexed | 16,414       |
| Initial failures  | 17 (0.10%)   |
| Final failures    | 0            |
| Duration          | ~22 minutes  |

See [ADR-096: ES Bulk Retry Strategy](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md).

### Milestone 2: Sequence Indexing ✅

| Index               | Count |
| ------------------- | ----- |
| `oak_sequences`     | 30    |
| `oak_sequence_facets` | 57  |

### Milestone 4: DRY/SRP Refactoring ✅

All document builders follow the shared pattern.

### Milestone 5: Data Completeness ✅

All fields resolved with appropriate sources (API supplementation, bulk data extraction).

---

## ✅ COMPLETE: M3 — Phase-Aligned Search Quality & Unified Evaluation

**Status**: ✅ **Phases 1-7 Complete** — Ready for Phase 8 (baselines)
**Specification**: [active/m3-revised-phase-aligned-search-quality.md](active/m3-revised-phase-aligned-search-quality.md)

**Discovery**: Per-key-stage testing is misaligned with curriculum structure. Primary content spans KS1+KS2. Ground truths organised by **phase** (primary/secondary). KS4 is a special case of secondary with `keyStage?: KeyStage` property on queries.

### M3 Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 1-4 | SDK, Indexing, Filters, CLI | ✅ Complete |
| 5a | Ground truth restructure (ks→phase) | ✅ Complete (2026-01-05) |
| 5b-d | Create ALL ground truths (14 primary, all secondary, KS4-specific) | ✅ Complete (2026-01-06) |
| 6 | ES Re-index (add phase_slug) | ⏸️ Cancelled (phase model changed) |
| 7 | Unified evaluation infrastructure (`GROUND_TRUTH_REGISTRY`, `benchmark.ts`) | ✅ Complete (2026-01-06) |
| 8 | Run comprehensive baselines | 📋 **Next** |

### Key Findings

- **Creative subjects excel**: Art (0.741), Music (0.722), D&T (0.815) MRR
- **Languages struggle**: French (0.190), Spanish (0.294), German (0.194)
- **Misspelling universal weakness**: PE, Languages fail on typos
- **Synonym gaps**: "coding"→"programming", "saying no"→"negation"

**Next Steps**: Complete remaining baselines, audit language-specific synonyms, add common misspellings.

---

## PRE-SDK-EXTRACTION Work

Must complete before SDK can be extracted.

### Comprehensive Filter Testing ⚠️ HIGH PRIORITY

**Status**: 📋 Planned (after M3)
**Specification**: [pre-sdk-extraction/comprehensive-filter-testing.md](pre-sdk-extraction/comprehensive-filter-testing.md)

**KS4 Maths is NOT representative of the whole curriculum.** Before SDK extraction, we MUST:

- Document all filter dimensions for all 17 subjects × 4 key stages
- Understand metadata differences (tiers, exam boards, categories, unit options)
- Test all valid and invalid filter combinations
- Establish filter-specific MRR baselines

**This is blocking SDK extraction** — we cannot design a clean filter API without understanding all edge cases.

### Bulk Data Analysis

**Status**: 📋 Planned (after M3)
**Specification**: [pre-sdk-extraction/bulk-data-analysis.md](pre-sdk-extraction/bulk-data-analysis.md)

Consolidated vocabulary mining, transcript analysis, entity extraction. Mining the bulk download data to identify patterns that address search quality gaps.

### Tier 2: Document Relationships

**Status**: 📋 Planned
**Specification**: [pre-sdk-extraction/tier-2-document-relationships.md](pre-sdk-extraction/tier-2-document-relationships.md)

Exploit document relationships (threads, sequences, prerequisites) for better relevance.

### Tier 3: Modern ES Features

**Status**: 📋 Planned
**Specification**: [pre-sdk-extraction/tier-3-modern-es-features.md](pre-sdk-extraction/tier-3-modern-es-features.md)

RRF parameter tuning, field boost optimization, kNN evaluation.

---

## SDK EXTRACTION

### Search SDK + CLI

**Status**: 📋 Planned (after pre-SDK work)
**Specification**: [sdk-extraction/search-sdk-cli.md](sdk-extraction/search-sdk-cli.md)

Extract semantic search into:

1. **Search SDK** — `packages/libs/search-sdk/`
2. **Search CLI** — First-class CLI workspace
3. **Retire Next.js** — Remove app layer

---

## POST-SDK-EXTRACTION Work

Requires SDK to exist first.

### MFL Multilingual Embeddings ⚠️ HIGH PRIORITY

**Status**: 📋 Planned — Hypothesis verification needed first
**Specification**: [post-sdk-extraction/mfl-multilingual-embeddings.md](post-sdk-extraction/mfl-multilingual-embeddings.md)

French, Spanish, German have the worst MRR (0.19-0.29). **Hypothesis**: ELSER v2 is English-only and cannot semantically match target language content.

**Before implementing**, we MUST:

1. Read Elastic ELSER documentation to verify language limitations
2. Test hypothesis empirically (ELSER-only vs BM25-only for MFL)
3. Analyze failure modes for MFL queries

### MCP Search Tool

**Status**: 📋 Planned
**Specification**: [post-sdk-extraction/mcp-search-tool.md](post-sdk-extraction/mcp-search-tool.md)

Expose search via MCP for AI agents.

### Tier 4: AI Enhancement

**Status**: 📋 DEFERRED (Tier 4 entry criteria not met)
**Specification**: [post-sdk-extraction/tier-4-ai-enhancement.md](post-sdk-extraction/tier-4-ai-enhancement.md)

LLM-based query understanding for intent-based queries. Only after Tiers 1-3 are exhausted.

### Advanced Features

**Status**: 📋 FUTURE
**Specification**: [post-sdk-extraction/advanced-features.md](post-sdk-extraction/advanced-features.md)

RAG infrastructure, knowledge graph evolution, multi-vector fields.

---

## Backlog

These features are documented but not prioritised:

| Feature           | Specification                               | Notes                  |
| ----------------- | ------------------------------------------- | ---------------------- |
| Reference Indices | [backlog/reference-indices.md](backlog/reference-indices.md) | Glossary, NC coverage |
| Resource Types    | [backlog/resource-types.md](backlog/resource-types.md) | Worksheets, quizzes   |

---

## Two SDKs

| SDK               | Location                                | Purpose                              |
| ----------------- | --------------------------------------- | ------------------------------------ |
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/`    | Access to upstream Oak API, type-gen |
| **Search SDK**    | To be: `packages/libs/search-sdk/`      | Elasticsearch-backed semantic search |

The Search SDK **consumes types from** the Curriculum SDK but is a separate concern.

---

## Quality Gates

Run after every piece of work, from repo root:

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

**All gates must pass. No exceptions.**

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [current-state.md](current-state.md)                                                          | Authoritative metrics |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)          | Session context      |
| [search-acceptance-criteria.md](search-acceptance-criteria.md)                                | Tier definitions     |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)                                      | Experiment history   |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

**Do NOT guess how ES works** — read the official documentation:

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)
