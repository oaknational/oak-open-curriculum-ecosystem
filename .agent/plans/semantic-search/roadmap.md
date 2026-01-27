# Semantic Search Roadmap

**Status**: 🔄 **Ground Truth Strategy Revision**  
**Last Updated**: 2026-01-26  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Metrics**: [current-state.md](current-state.md)

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

---

## Current Work: Ground Truth Redesign

**Plan**: [ground-truth-redesign-plan.md](active/ground-truth-redesign-plan.md)

The previous GT structure (120 queries, 4 categories per subject-phase) has been superseded by a revised strategy focused on answering:

> "Does search help teachers find what they need?"

### What Changed (2026-01-26)

| Before | After |
|--------|-------|
| 154 queries, uniform distribution | ~80-100 queries, content-weighted |
| 4 categories per subject-phase | Bulk natural-query + handful of mechanics proofs |
| Clipped term lists as "natural-expression" | Natural phrasing required |
| Testing ES features (stemming, disambiguation) | Testing OUR value proposition |

### New Category Structure

| Category | Purpose | Count |
|----------|---------|-------|
| `natural-query` | How teachers actually search | **Bulk** |
| `exact-term` | BM25 returns exact terms | **Few** |
| `typo-recovery` | Fuzzy matching works | **Handful** |
| `curriculum-connection` | Genuine topic pairings | **Few if any** |
| `future-intent` | Not yet built (excluded) | **2-3** |

### Eliminated Categories

- `morphological-variation` — ES stemming handles it
- `ambiguous-term` — Filtering handles it
- `difficulty-mismatch` — We enable teachers, not police them
- `metadata-only` — Metadata IS the default

---

## Execution Order

```text
1. Ground Truth Redesign (active/)              ← CURRENT
   Revise queries per new strategy
         ↓
2. Expected Slugs (bulk data mining)
   Mine slugs from bulk-downloads/*.json
         ↓
3. Implementation
   Update .query.ts and .expected.ts files
         ↓
4. Benchmark & Analysis
   Validate with pnpm benchmark
         ↓
5. SDK Extraction (sdk-extraction/)
   Extract search from Next.js app into SDK + CLI
         ↓
6. MCP Integration (post-sdk/mcp-integration/)
   Wire hybrid search into MCP tools
         ↓
7. Everything Else (post-sdk/ streams)
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

## Phase 1: Ground Truth Redesign

**Status**: 🔄 In Progress  
**Location**: [active/ground-truth-redesign-plan.md](active/ground-truth-redesign-plan.md)

**Goal**: Create ground truths that answer "Does search help teachers find what they need?"

| Task | Status |
|------|--------|
| Revise natural-expression → natural phrasing | 📋 Pending |
| Reduce typo-recovery to 5-10 total | 📋 Pending |
| Evaluate/eliminate cross-topic | 📋 Pending |
| Increase maths coverage | 📋 Pending |
| Mine expected slugs from bulk data | 📋 Pending |
| Implement in code | ⏸️ Blocked |
| Benchmark and analyse | ⏸️ Blocked |

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
