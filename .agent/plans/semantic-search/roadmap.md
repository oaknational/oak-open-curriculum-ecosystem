# Semantic Search Roadmap

**Status**: 🔄 **Benchmark & Iterate** — RRF fixed, validating ground truths  
**Last Updated**: 2026-01-13  
**Metrics Source**: [current-state.md](current-state.md)  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

This is THE authoritative roadmap for semantic search work.

---

## ✅ Complete: RRF Architecture Fix (2026-01-13)

**The 4-way RRF was broken.** Documents without transcripts were penalised by 50%.

| Deliverable | Status |
|-------------|--------|
| ADR-099: Transcript-Aware RRF Normalisation | ✅ |
| `normaliseRrfScores()` pure function | ✅ |
| Unit tests (17) + Integration tests (6) | ✅ |
| DI refactor per ADR-078 | ✅ |
| All quality gates | ✅ |

**Details**: [transcript-aware-rrf.md](archive/completed/transcript-aware-rrf.md) | [ADR-099](../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)

---

## Ground Truth Understanding (2026-01-11)

Ground truths were restructured to 120 queries (30 entries × 4 categories), AI-curated.

**Important**: Ground truths measure "did expected slugs appear?" not "are teachers satisfied?"

See: [Audit Report](../../evaluations/audits/ground-truth-audit-2026-01.md)

---

## Status Legend

| Symbol | Status | Meaning |
|--------|--------|---------|
| ✅ | Complete | Work finished and verified |
| 🔧 | Fix Required | Architectural issue that must be fixed |
| 🔄 | In Progress | Actively being worked on |
| 📋 | Pending | Ready to start, not blocked |
| ⏸️ | Blocked/Deferred | Cannot start until dependency complete, or deprioritised |
| ❌ | Cancelled | No longer needed (with rationale) |

---

## Dependency Chain

```
Phase 1: Ground Truth Pruning & Curation ✅ COMPLETE
        ↓
Fix RRF Architecture ✅ COMPLETE (ADR-099)
        ↓
🔄 Benchmark & Iterate ← CURRENT PRIORITY
        ↓
Phase 2: AI-Driven Evaluation (Deferred)
        ↓
Comprehensive Filter Testing (pre-sdk-extraction/)
        ↓
Bulk Data Analysis (pre-sdk-extraction/)
        ↓
Tier 2: Document Relationships (pre-sdk-extraction/)
        ↓
Tier 3: Modern ES Features (pre-sdk-extraction/)
        ↓
SDK Extraction (sdk-extraction/)
        ↓
MCP Search Tool (post-sdk-extraction/)
        ↓
Tier 4: AI Enhancement (post-sdk-extraction/)
```

---

## ✅ COMPLETE: Phase 1 — Ground Truth Pruning & Curation

**Status**: ✅ Complete (2026-01-12)  
**Specification**: [M3 Plan](active/m3-revised-phase-aligned-search-quality.md)

All 30 subject-phase entries curated with AI-as-judge review.

**Final Structure**:

| Metric | Value |
|--------|-------|
| Subject-phase entries | 30 |
| Categories per entry | 4 |
| Queries per category | 1 |
| **Total queries** | **120** |
| AI-curated | 100% |
| Quality gates | All passing |

---

## 🔄 CURRENT: Benchmark & Iterate

**Status**: 🔄 In Progress  
**Goal**: Validate ground truths until search quality is the constraining factor

**Prerequisites**: ✅ RRF architecture is correct. Score normalisation applied.

Ground truths have been restructured and AI-curated (120 queries). Once RRF is fixed, benchmarking will reveal whether failures are due to:

1. **Bad ground truth** — Expected slugs are wrong for the query
2. **Bad search** — Search isn't returning what it should

### Iteration Loop

```
1. Run benchmark     → pnpm benchmark --all
2. Analyse failures  → Identify root cause (ground truth or search?)
3. If GT issue       → Fix ground truth, document rationale, re-run
4. If search issue   → Ground truths validated, search is the bottleneck
5. Repeat            → Until search quality is the only limiting factor
```

### Success Criteria

**Ground truths are validated when**:

- Low MRR scores are caused by search limitations, NOT wrong expected slugs
- Manual review of failures confirms actual search results are worse than expected
- Iteration produces diminishing returns on ground truth fixes

**Then** we can trust benchmark results to guide search improvements.

### Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# Run full benchmark
pnpm benchmark --all

# Investigate specific failures
pnpm benchmark --subject maths --phase primary --verbose
```

---

## 📋 FUTURE: Phase 2 — AI-Driven Evaluation

**Status**: 📋 Deferred until Phase 1 complete  

Separate evaluation layer for "does search help teachers?"

| Parameter | Value |
|-----------|-------|
| Query set size | 60-120 (2-4 per subject-phase) |
| Evaluation method | AI judges result usefulness |
| Frequency | Manual, local development |
| Executor | Human stakeholder |

---

## 🔄 Comprehensive Baselines

**Status**: 🔄 Part of Benchmark & Iterate phase

Run `pnpm benchmark --all` — but treat results as **validation data**, not final baselines.

**Key insight**: Until we iterate and confirm ground truths are correct, benchmark results tell us about ground truth quality AS WELL AS search quality. We cannot separate them until ground truths are validated.

**Important**: All baseline reporting must include scope disclaimer:

> **Measurement Scope**: Ground truth metrics measure expected slug position, not user satisfaction. A query may receive low MRR while search returns useful results.

---

## PRE-SDK-EXTRACTION Work

Must complete before SDK can be extracted.

### Comprehensive Filter Testing ⚠️ HIGH PRIORITY

**Status**: 📋 Planned (after ground truth review)
**Specification**: [pre-sdk-extraction/comprehensive-filter-testing.md](pre-sdk-extraction/comprehensive-filter-testing.md)

**KS4 Maths is NOT representative of the whole curriculum.** Before SDK extraction, we MUST:

- Document all filter dimensions for all 17 subjects × 4 key stages
- Understand metadata differences (tiers, exam boards, categories, unit options)
- Test all valid and invalid filter combinations
- Establish filter-specific MRR baselines

**This is blocking SDK extraction** — we cannot design a clean filter API without understanding all edge cases.

### Bulk Data Analysis

**Status**: 📋 Planned
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

### MFL Subject-Aware RRF ⚠️ HIGH PRIORITY

**Status**: 📋 Planned
**Specification**: [post-sdk-extraction/mfl-multilingual-embeddings.md](post-sdk-extraction/mfl-multilingual-embeddings.md)

French, Spanish, German have the worst MRR (0.19-0.29). MFL lessons have almost no transcripts (0.2% coverage).

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

| Feature | Specification | Notes |
|---------|---------------|-------|
| Reference Indices | [backlog/reference-indices.md](backlog/reference-indices.md) | Glossary, NC coverage |
| Resource Types | [backlog/resource-types.md](backlog/resource-types.md) | Worksheets, quizzes |

---

## Two SDKs

| SDK | Location | Purpose |
|-----|----------|---------|
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Access to upstream Oak API, type-gen |
| **Search SDK** | To be: `packages/libs/search-sdk/` | Elasticsearch-backed semantic search |

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

| Document | Purpose |
|----------|---------|
| [ADR-099](../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md) | RRF normalisation (complete) |
| [completed.md](completed.md) | Historical completed work |
| [current-state.md](current-state.md) | Current metrics |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Tier definitions |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Experiment history |

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
