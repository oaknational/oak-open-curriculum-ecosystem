# Semantic Search Roadmap

**Status**: ✅ **Ground Truths Complete** — Ready for Application Improvement  
**Last Updated**: 2026-02-05  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Metrics**: [current-state.md](current-state.md)

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

---

## Current State

Ground truth infrastructure is complete across all four indexes. Baseline metrics are established. Priority is now application improvement.

| Index | GTs | MRR | Status |
|-------|-----|-----|--------|
| `oak_lessons` | 30 | 1.000 | ✅ Done |
| `oak_units` | 2 | 1.000 | ✅ Done |
| `oak_threads` | 1 | 1.000 | ✅ Done |
| `oak_sequences` | 1 | 1.000 | ✅ Done |

**Ground truth cleanup** (rename, consolidate protocol docs, deeper metrics) is documented in [multi-index-ground-truths.md](active/multi-index-ground-truths.md#remaining-work-deferred-to-next-session). These are not blockers.

---

## Execution Order

```text
1. Ground Truth Foundation                       ✅ COMPLETE
   30 lesson GTs + multi-index GTs (units, threads, sequences)
         ↓
2. Application Improvement                       ← NEXT
   SDK extraction, MCP integration, search quality levels
         ↓
3. SDK Extraction (sdk-extraction/)
   Extract search from Next.js app into SDK + CLI
         ↓
4. MCP Integration (post-sdk/mcp-integration/)
   Wire hybrid search into MCP tools
         ↓
5. Search Quality Levels (post-sdk/search-quality/)
   ├── Level 2: Document Relationships
   ├── Level 3: Modern ES Features
   └── Level 4: AI Enhancement
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

## Phase 1: Ground Truth Foundation ✅ Complete

**Location**: [active/multi-index-ground-truths.md](active/multi-index-ground-truths.md)

**Goal**: Create ground truths that answer "Does search help teachers find what they need?"

| Task | Status |
|------|--------|
| Lesson GTs (30 subject-phase pairs) | ✅ Complete |
| Known-Answer-First methodology (ADR-106) | ✅ Complete |
| Multi-index infrastructure (test scripts, benchmarks) | ✅ Complete |
| Unit GTs (2: maths primary, science secondary) | ✅ Complete |
| Thread GT (1: maths algebra) | ✅ Complete |
| Sequence GT (1: maths secondary) | ✅ Complete |
| Cleanup: rename, consolidate docs, metric depth | 📋 Deferred |

---

## Phase 2: SDK Extraction

**Status**: 📋 Ready after GT complete  
**Location**: [sdk-extraction/search-sdk-cli.md](sdk-extraction/search-sdk-cli.md)

**Goal**: Extract semantic search from Next.js app into a dedicated SDK and CLI.

| Component | From | To |
|-----------|------|-----|
| Retrieval services | `apps/.../src/lib/hybrid-search/` | `packages/libs/search-sdk/retrieval/` |
| Admin services | `apps/.../src/lib/admin/` | `packages/libs/search-sdk/admin/` |
| CLI commands | `apps/.../scripts/` | `packages/tools/search-cli/` |

---

## Phase 3: MCP Integration

**Status**: ⏸️ Blocked by SDK Extraction  
**Location**: [post-sdk/mcp-integration/](post-sdk/mcp-integration/)

**Goal**: Wire hybrid search into MCP tools — first consumer of SDK.

---

## Phase 4: Search Quality Levels

**Status**: ⏸️ Blocked by MCP Integration  
**Location**: [post-sdk/search-quality/](post-sdk/search-quality/)

Levels (from [ADR-082](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)):

| Level | Focus | Status |
|-------|-------|--------|
| **1** | Fundamentals (synonyms, phrase boosting) | ✅ Approaches complete |
| **2** | Document Relationships | 📋 Pending |
| **3** | Modern ES Features (semantic reranking, query rules) | 📋 Pending |
| **4** | AI Enhancement (LLM preprocessing) | 📋 Pending — DESTINATION |

**Levels are sequential.** Exhaust lower levels before moving up.

---

## MFL-Specific Considerations

Modern Foreign Languages (French, German, Spanish) have unique search challenges:

- **No transcripts**: MFL lessons have no video transcripts, only metadata
- **Low MRR**: Current MFL MRR is 0.19-0.29

**Future enhancement**: Multilingual semantic text retriever using `multilingual-e5-base`.

**Plan**: [post-sdk/search-quality/mfl-multilingual-embeddings.md](post-sdk/search-quality/mfl-multilingual-embeddings.md)

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
| [current-state.md](current-state.md) | Current metrics and architecture |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Guide](../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
