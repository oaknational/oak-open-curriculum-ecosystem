# Semantic Search Roadmap

**Status**: 🔄 **SDK validation next** — SDK extraction complete  
**Last Updated**: 2026-02-12  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Metrics**: See [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) for baseline metrics per index

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

---

## Current State

SDK extraction is complete. All three services (retrieval,
admin, observability) return `Result<T, E>` with per-service
error types and comprehensive TSDoc. The full quality gate
chain passes. The SDK must now be validated against real
Elasticsearch before wiring into its first consumer.

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
Phase 1: Ground Truth Foundation                    ✅ COMPLETE
  30 lesson GTs + multi-index GTs
         ↓
Phase 2: SDK Extraction + CLI Wiring                ✅ COMPLETE
  a. Service extraction (A–D)                       ✅
  b. CLI rename + wiring (E)                        ✅
  c. TSDoc compliance fix                           ✅
  d. Result pattern + TSDoc annotations (E2)        ✅
         ↓
Phase 2e: SDK Validation against Real ES             ← NEXT
  Run full evaluation suite, confirm baselines hold
         ↓
Phase 3: MCP Search Integration
  Wire SDK retrieval into MCP tools
         ↓
Phase 4: Search Quality + Ecosystem (parallel streams)
  ├── GT Expansion (30 → 80-100 queries)
  ├── Search Quality Levels 2 → 3 → 4 (sequential)
  ├── Bulk Data Analysis (vocabulary mining)
  ├── SDK API (filter testing, API stabilisation)
  ├── Subject Domain Model (type-gen enhancement)
  └── Operations (governance, latency budgets)
         ↓
Phase 5: Extensions
  RAG, knowledge graph, advanced features
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

---

## Phase 2: SDK Extraction + CLI Wiring ✅ Complete

**Location**: [active/search-sdk-cli.plan.md](active/search-sdk-cli.plan.md)

**Goal**: Extract search library into an SDK; rename the
current workspace as the CLI.

| What | From | To |
|------|------|-----|
| SDK (retrieval, admin, obs) | `apps/.../src/lib/` | `packages/sdks/oak-search-sdk/` ✅ |
| CLI + evaluation | `apps/oak-open-curriculum-semantic-search/` | `apps/oak-search-cli/` ✅ |
| TSDoc compliance fix | Non-standard tags everywhere | Tags correct at source, `eslint-plugin-tsdoc` enforced ✅ |
| Result pattern + TSDoc | Throws on failure, sparse docs | `Result<T, E>` everywhere + comprehensive TSDoc ✅ |

---

## Remediation: HTTP 451 + Test Strategy + Documentation

**Status**: 📋 Ready  
**Plan**: [active/transcript-451-test-doc-remediation.plan.md](active/transcript-451-test-doc-remediation.plan.md)

Cross-cutting remediation discovered during transcript
endpoint investigation (2026-02-12). Four workstreams:

| WS | Scope | Status |
| --- | --- | --- |
| WS1 | Handle HTTP 451 in SDK error classification (generator fix) | 📋 Pending |
| WS2 | Remove network IO and `process.env` mutation from E2E tests | 📋 Pending |
| WS3 | Update stale documentation (DATA-VARIANCES, API wishlist, ADR-092) | 📋 Pending |
| WS4 | Directive compliance sweep | 📋 Pending |

Can be executed in parallel with Phase 2e. WS1 and WS3 are
small. WS2 is smaller now that Notion MCP is being removed
entirely (smoke test reclassification, env mutation cleanup
remain).

---

## Public Release Readiness

**Status**: 📋 Ready
**Plan**: [active/public-release-readiness.plan.md](active/public-release-readiness.plan.md)

Prepares the repository for public visibility on GitHub and
the SDKs/libraries for publication as public npm packages
under the `@oaknational` scope. Six workstreams:

| WS | Scope | Status |
| --- | --- | --- |
| WS1 | Secrets audit and remediation (CRITICAL) | 📋 Pending |
| WS2 | Licence and legal (MIT file, Code of Conduct) | 📋 Pending |
| WS3 | Package.json standardisation (all 12 workspaces) | 📋 Pending |
| WS4 | Documentation overhaul (README, CONTRIBUTING, onboarding, CHANGELOG) | 📋 Pending |
| WS5 | GitHub repository configuration (templates, Dependabot) | 📋 Pending |
| WS6 | Publication dry run (tarball inspection, test install) | 📋 Pending |

Can be executed in parallel with other work. WS1 is a hard
blocker for making the repo public.

---

## Phase 2e: SDK Validation against Real Elasticsearch

**Status**: 📋 Ready to start

**Goal**: Confirm the completely rewritten SDK produces
correct results against a real Elasticsearch cluster. The
extraction involved DI refactoring, Result pattern wrapping,
service boundary changes, and query builder restructuring.
None of this has been validated against real ES.

| Task | Status |
|------|--------|
| Run full benchmark suite (`oaksearch eval benchmark`) | 📋 Pending |
| Confirm lesson MRR >= 0.983, NDCG >= 0.955 | 📋 Pending |
| Confirm unit MRR >= 1.000, NDCG >= 0.926 | 📋 Pending |
| Confirm thread and sequence baselines hold | 📋 Pending |
| Manual search queries across all retrieval methods | 📋 Pending |
| Exercise filter combinations (subject, key stage, tier) | 📋 Pending |
| Verify error handling with real ES failure scenarios | 📋 Pending |
| Confirm zero-hit observability flows end-to-end | 📋 Pending |
| Validate admin operations (setup, synonyms, metadata) | 📋 Pending |
| Confirm ES URL + credentials are constructor args, not env | 📋 Pending |

**Credential safety**: The Search SDK must require ES URL
and credentials as explicit constructor arguments. No
environment variable access inside the SDK. Only the CLI
reads env vars and passes them to `createSearchSdk()`. All
other consumers (MCP servers, future apps) must provide
their own credentials at construction time. This protects
the Oak-specific ES deployment.

**Tooling**: The CLI evaluation infrastructure (`oaksearch eval`)
was rewired to use SDK retrieval code paths at Checkpoint E.
Running benchmarks exercises the exact same SDK methods that
MCP will later consume.

---

## Phase 3: MCP Search Integration

**Status**: ⏸️ Blocked by Phase 2e validation  
**Plan**: [post-sdk/mcp-integration/wire-hybrid-search.md](post-sdk/mcp-integration/wire-hybrid-search.md)

**Goal**: Wire hybrid search into MCP tools — first
consumer of the SDK. Then compare with existing REST API
search and likely replace it.

| Task | Status |
|------|--------|
| `semantic-search` MCP tool wired to SDK retrieval | 📋 Pending |
| Filter parameters passed through correctly | 📋 Pending |
| `Result<T, E>` errors surfaced as MCP errors | 📋 Pending |
| Tool examples mapping user intent to SDK calls | 📋 Pending |
| Existing MCP tools unaffected | 📋 Pending |
| All quality gates pass | 📋 Pending |
| Compare semantic search with existing `search` tool (REST API) | 📋 Pending |
| If superior, replace REST API composite search with SDK-backed search | 📋 Pending |

---

## Phase 4: Search Quality + Ecosystem

**Status**: 📋 Pending  
**Location**: [post-sdk/](post-sdk/)

Multiple parallel streams, each with its own plan.
Some have internal sequencing; others can run
independently.

### Sequential streams

| Stream | Plan | Dependency | Status |
|--------|------|------------|--------|
| **GT Expansion** | [ground-truth-expansion-plan.md](post-sdk/search-quality/ground-truth-expansion-plan.md) | None (can start now) | 📋 Pending |
| **Level 2: Document Relationships** | [document-relationships.md](post-sdk/search-quality/document-relationships.md) | GT expansion | 📋 Pending |
| **Level 3: Modern ES Features** | [modern-es-features.md](post-sdk/search-quality/modern-es-features.md) | Level 2 exhausted | 📋 Pending |
| **Level 4: AI Enhancement** | [ai-enhancement.md](post-sdk/search-quality/ai-enhancement.md) | Level 3 exhausted | 📋 Pending |

### Parallel streams (can start alongside Phase 3 or 4)

| Stream | Plan | Notes | Status |
|--------|------|-------|--------|
| **Bulk Data Analysis** | [vocabulary-mining.md](post-sdk/bulk-data-analysis/vocabulary-mining.md) | Feeds vocabulary into search quality work | 📋 Pending |
| **SDK API** | [filter-testing.md](post-sdk/sdk-api/filter-testing.md) | 17 subjects × 4 key stages filter matrix | 📋 Pending |
| **Subject Domain Model** | [move-search-domain-knowledge-to-typegen-time.md](post-sdk/move-search-domain-knowledge-to-typegen-time.md) | Oak API SDK type-gen enhancement | 📋 Pending |
| **MFL Fix** | [mfl-multilingual-embeddings.md](post-sdk/search-quality/mfl-multilingual-embeddings.md) | MFL MRR 0.19-0.29, specific fix | 📋 Pending |
| **Operations** | [governance.md](post-sdk/operations/governance.md) | Latency budgets, failure modes, versioning | 📋 Pending |

---

## Phase 5: Extensions

**Status**: ⏸️ Blocked by Level 4  
**Location**: [post-sdk/extensions/](post-sdk/extensions/)

RAG infrastructure, knowledge graph evolution, and
advanced MCP graph tools. Requires Level 4 (AI
Enhancement) and MCP integration to be complete.

---

## MFL-Specific Considerations

Modern Foreign Languages (French, German, Spanish)
have unique search challenges:

- **No transcripts**: MFL lessons have no video
  transcripts, only metadata
- **Low MRR**: Current MFL MRR is 0.19-0.29

**Future enhancement**: Multilingual semantic text
retriever using `multilingual-e5-base`.

**Plan**: [post-sdk/search-quality/mfl-multilingual-embeddings.md](post-sdk/search-quality/mfl-multilingual-embeddings.md)

---

## Three Workspaces

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Oak API SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream OOC API types, type-gen |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (34 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (934 tests) |

The Search SDK consumes types from the Oak API SDK.
The Search CLI consumes the Search SDK.

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm test:e2e:built
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Guide](/apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives/schema-first-execution.md) — Generator is source of truth
