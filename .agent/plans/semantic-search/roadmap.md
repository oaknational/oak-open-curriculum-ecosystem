# Semantic Search Roadmap

**Status**: 🔄 **Ground Truth Review** — Validating expected slugs  
**Last Updated**: 2026-01-17  
**Metrics Source**: [current-state.md](current-state.md)  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

This is THE authoritative roadmap for semantic search work.

---

## Execution Order

```
1. Ground Truth Review (active/)              ← CURRENT
   Validate expected slugs until search quality is the constraining factor
         ↓
2. SDK Extraction (sdk-extraction/)
   Extract search from Next.js app into SDK + CLI
         ↓
3. MCP Integration (post-sdk/mcp-integration/)
   Wire hybrid search into MCP tools — FIRST consumer of SDK
         ↓
4. Everything Else (post-sdk/ streams, parallel where independent)
   ├── Search Quality (Levels 2 → 3 → 4)
   ├── Bulk Data Analysis
   ├── SDK API
   ├── Operations
   └── Extensions
```

---

## Status Legend

| Symbol | Status | Meaning |
|--------|--------|---------|
| ✅ | Complete | Work finished and verified |
| 🔄 | In Progress | Actively being worked on |
| 📋 | Pending | Ready to start, not blocked |
| ⏸️ | Blocked | Cannot start until dependency complete |

---

## 🔄 Phase 1: Ground Truth Review

**Status**: 🔄 In Progress (9/30 subject-phases complete)  
**Location**: [active/ground-truth-review-checklist.md](active/ground-truth-review-checklist.md)

**Goal**: Validate ground truths until search quality is the constraining factor.

Ground truths measure "did expected slugs appear?" — they must be correct before metrics are meaningful.

| Complete | Remaining |
|----------|-----------|
| art (2), citizenship (1), computing (2), cooking-nutrition (2), design-technology (2) | english, french, geography, german, history, maths, music, physical-education, religious-education, science, spanish |

**Level 1 approaches are complete** but Level 1 is NOT exhausted until ground truth review validates the measurements.

---

## 📋 Phase 2: SDK Extraction

**Status**: 📋 Ready after Ground Truth Review  
**Location**: [sdk-extraction/search-sdk-cli.md](sdk-extraction/search-sdk-cli.md)

**Goal**: Extract semantic search from Next.js app into a dedicated SDK and CLI.

| Component | From | To |
|-----------|------|-----|
| Retrieval services | `apps/.../src/lib/hybrid-search/` | `packages/libs/search-sdk/retrieval/` |
| Admin services | `apps/.../src/lib/admin/` | `packages/libs/search-sdk/admin/` |
| CLI commands | `apps/.../scripts/` | `packages/tools/search-cli/` |

---

## 📋 Phase 3: MCP Integration

**Status**: ⏸️ Blocked by SDK Extraction  
**Location**: [post-sdk/mcp-integration/](post-sdk/mcp-integration/)

**Goal**: Wire hybrid search into MCP tools.

This is the **first consumer** of the SDK. Doing it first:
- Validates that the SDK interface is usable
- Provides immediate value to agent workflows
- Exposes any SDK API issues early

---

## 📋 Phase 4: Streams (Post-SDK)

**Status**: ⏸️ Blocked by MCP Integration  
**Location**: [post-sdk/](post-sdk/)

Work is organized into **streams** — coherent domains with their own intent and impact.

| Stream | Intent | Sequential? |
|--------|--------|-------------|
| [search-quality/](post-sdk/search-quality/) | Improve search result relevance | Yes (Levels 2 → 3 → 4) |
| [bulk-data-analysis/](post-sdk/bulk-data-analysis/) | Mine vocabulary from curriculum data | No |
| [sdk-api/](post-sdk/sdk-api/) | Understand and stabilise SDK API | No |
| [operations/](post-sdk/operations/) | Run the system safely | No |
| [extensions/](post-sdk/extensions/) | Add capabilities beyond core search | No |

Streams can run in parallel where independent. See each stream's README for details.

---

## Search Quality Levels

Within the search-quality stream, work is organized into **levels** (from [ADR-082](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)):

| Level | Focus | Status |
|-------|-------|--------|
| **1** | Fundamentals (synonyms, phrase boosting) | ✅ Approaches complete, awaiting GT validation |
| **2** | Document Relationships | 📋 Pending |
| **3** | Modern ES Features (semantic reranking, query rules) | 📋 Pending |
| **4** | AI Enhancement (LLM preprocessing) | 📋 Pending — DESTINATION |

**Levels are sequential.** Exhaust lower levels before moving up.

**Level 4 is the destination, not optional.** Some queries cannot be solved without AI.

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

## Research Documents

| Document | Purpose |
|----------|---------|
| [elasticsearch-approaches.md](../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | Elastic-native patterns |
| [aliases-and-equivalances.md](../../research/elasticsearch/oak-data/aliases-and-equivalances.md) | Synonym classification |
| [documentation-gap-analysis.md](../../research/elasticsearch/oak-data/documentation-gap-analysis.md) | Gaps and remediation |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [completed.md](completed.md) | Historical completed work |
| [current-state.md](current-state.md) | Current metrics |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Level definitions |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
