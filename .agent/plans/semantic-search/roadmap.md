# Semantic Search Roadmap

**Status**: 🔄 **SDK Extraction** — Ground truths complete, extracting search into SDK + CLI  
**Last Updated**: 2026-02-10  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Metrics**: See [Ground Truth Protocol](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md) for baseline metrics per index

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

---

## Current State

Ground truth infrastructure is complete across all four indexes. Baseline metrics are established. SDK extraction is the immediate priority.

| Index | GTs | MRR | NDCG@10 | Status |
|-------|-----|-----|---------|--------|
| `oak_lessons` | 30 | 0.983 | 0.955 | ✅ Done |
| `oak_units` | 2 | 1.000 | 0.926 | ✅ Done |
| `oak_threads` | 1 | 1.000 | 1.000 | ✅ Done (mechanism check) |
| `oak_sequences` | 1 | 1.000 | 1.000 | ✅ Done (mechanism check) |

Full baseline details: [Ground Truth Protocol](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md).

---

## Execution Order

```text
1. Ground Truth Foundation                       ✅ COMPLETE
   30 lesson GTs + multi-index GTs (units, threads, sequences)
         ↓
2. SDK Extraction (sdk-extraction/)              ← CURRENT
   Extract search into SDK + CLI (Next.js layer removed)
         ↓
3. MCP Integration (post-sdk/mcp-integration/)
   Wire hybrid search into MCP tools
         ↓
4. Search Enhancements (post-sdk/search-quality/)
   Ground truth expansion, fundamentals re-evaluation,
   document relationships, modern ES features, AI enhancement
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

**Location**: [archive/completed/multi-index-ground-truths.md](archive/completed/multi-index-ground-truths.md)

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

## Phase 2: SDK Extraction 🔄 Current

**Status**: 🔄 In Progress  
**Location**: [active/search-sdk-cli.md](active/search-sdk-cli.md)

**Goal**: Extract semantic search into a dedicated SDK and CLI. Next.js layer already removed (Feb 2026).

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

## Phase 4: Search Enhancements

**Status**: ⏸️ Blocked by MCP Integration  
**Location**: [post-sdk/search-quality/](post-sdk/search-quality/)

Search enhancements form one workstream encompassing ground truth expansion, fundamentals re-evaluation, document relationships, modern ES features, and AI enhancement. Work items draw from [ADR-082](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) but are managed as a single enhancements plan rather than rigid sequential tiers.

| Area | Focus | Status |
|------|-------|--------|
| **GT expansion** | More examples and scenarios before tuning | 📋 Pending |
| **Fundamentals re-evaluation** | Re-assess Level 1 approaches with validated GTs | 📋 Pending |
| **Document relationships** | Cross-reference boosting, thread/sequence context | 📋 Pending |
| **Tuning** | Field boosts, RRF parameters, MFL investigation | 📋 Pending |
| **Modern ES features** | Semantic reranking, query rules | 📋 Pending |
| **AI enhancement** | LLM preprocessing, intent extraction | 📋 Pending — DESTINATION |

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
| [Ground Truth Protocol](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Guide](../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
