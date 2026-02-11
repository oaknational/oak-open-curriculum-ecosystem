# Semantic Search Roadmap

**Status**: 🔄 **SDK + CLI + Result Pattern + TSDoc Complete** — MCP integration (F) next  
**Last Updated**: 2026-02-11  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Metrics**: See [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) for baseline metrics per index

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

---

## Current State

SDK extraction, CLI wiring, Result pattern, and TSDoc are all complete. All three SDK services (retrieval, admin, observability) return `Result<T, E>` and are fully documented. The SDK has 34 tests; the CLI has 934 tests (82 test files). The full quality gate chain passes (clean through smoke:dev:stub). Next: Checkpoint F (MCP integration).

| Index | GTs | MRR | NDCG@10 | Status |
|-------|-----|-----|---------|--------|
| `oak_lessons` | 30 | 0.983 | 0.955 | ✅ Done |
| `oak_units` | 2 | 1.000 | 0.926 | ✅ Done |
| `oak_threads` | 1 | 1.000 | 1.000 | ✅ Done (mechanism check) |
| `oak_sequences` | 1 | 1.000 | 1.000 | ✅ Done (mechanism check) |

Full baseline details: [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md).

---

## Execution Order

```text
1. Ground Truth Foundation                       ✅ COMPLETE
   30 lesson GTs + multi-index GTs (units, threads, sequences)
         ↓
2. SDK Extraction + CLI Wiring                   ✅ COMPLETE
   a. Service extraction (A–D)                   ✅ COMPLETE
   b. CLI rename + wiring (E)                    ✅ COMPLETE
   c. TSDoc compliance fix (tag correctness)     ✅ COMPLETE
   d. Result pattern + TSDoc annotations (E2)    ✅ COMPLETE
         ↓
3. MCP Integration (post-sdk/mcp-integration/)       ← NEXT
   Wire hybrid search into MCP tools (Checkpoint F)
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

## Phase 2: SDK Extraction + CLI Wiring ✅ Complete

**Status**: ✅ Complete (Feb 2026)
**Location**: [active/search-sdk-cli.plan.md](active/search-sdk-cli.plan.md)

**Goal**: Extract search library into an SDK; rename the
current workspace as the CLI.

**Checkpoints A–E complete** (Feb 2026):

- SDK workspace at `packages/sdks/oak-search-sdk/`
- All three services fully implemented: retrieval, admin,
  observability (34 tests)
- CLI renamed to `apps/oak-search-cli/` with all
  subcommands wired to SDK services (934 tests)
- All quality gates pass
- Factory: `createSearchSdk({ deps, config }) -> SearchSdk`
- Evaluation rewired to use SDK retrieval code paths

| What | From | To |
|------|------|-----|
| SDK (retrieval, admin, obs) | `apps/.../src/lib/` | `packages/sdks/oak-search-sdk/` ✅ |
| CLI + evaluation | `apps/oak-open-curriculum-semantic-search/` | `apps/oak-search-cli/` ✅ |
| TSDoc compliance fix | Non-standard tags everywhere | Tags correct at source, `eslint-plugin-tsdoc` enforced ✅ |
| Result pattern + TSDoc annotations | Throws on failure, sparse docs | `Result<T, E>` everywhere + comprehensive TSDoc ✅ |

---

## Phase 3: MCP Integration

**Status**: 📋 Ready to start (SDK + CLI + Result pattern + TSDoc complete)  
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

## Three Workspaces

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream Oak API, type-gen |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (fully implemented, 34 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (934 tests) |

The Search SDK consumes types from the Curriculum SDK.
The Search CLI consumes the Search SDK.

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
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Guide](../../apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives/schema-first-execution.md) — Generator is source of truth
