# Semantic Search Roadmap

**Status**: 🔄 **Developer onboarding next** — public release readiness complete  
**Last Updated**: 2026-02-14  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Metrics**: See [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) for baseline metrics per index

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

---

## Current State

SDK extraction is complete. All three services (retrieval,
admin, observability) return `Result<T, E>` with per-service
error types and comprehensive TSDoc. Thread search is fully
integrated (8 GTs, baselines validated against live ES).
Public release readiness is complete (npm publish deferred
until token is created). Next: developer onboarding
experience, then wire the SDK into its first consumer (MCP).

| Index | GTs | MRR | NDCG@10 | Status |
|-------|-----|-----|---------|--------|
| `oak_lessons` | 30 | 0.983 | 0.955 | ✅ Done |
| `oak_units` | 2 | 1.000 | 0.926 | ✅ Done |
| `oak_threads` | 8 | 0.938 | 0.902 | ✅ SDK integrated, CLI wired, benchmarks migrated |
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
Phase 2e: SDK Validation against Real ES             ✅ COMPLETE
  Thread benchmarks validated against live ES
         ↓
Phase 2f: Public Release Readiness                   ✅ COMPLETE
  Secrets audit, licence, package.json, docs, GitHub config
  npm publish deferred until token is created
         ↓
Phase 2g: Developer Onboarding Experience
  Canonical journey, command truth, link integrity
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

**Location**: [archive/completed/search-sdk-cli.plan.md](archive/completed/search-sdk-cli.plan.md)

**Goal**: Extract search library into an SDK; rename the
current workspace as the CLI.

| What | From | To |
|------|------|-----|
| SDK (retrieval, admin, obs) | `apps/.../src/lib/` | `packages/sdks/oak-search-sdk/` ✅ |
| CLI + evaluation | `apps/oak-open-curriculum-semantic-search/` | `apps/oak-search-cli/` ✅ |
| TSDoc compliance fix | Non-standard tags everywhere | Tags correct at source, `eslint-plugin-tsdoc` enforced ✅ |
| Result pattern + TSDoc | Throws on failure, sparse docs | `Result<T, E>` everywhere + comprehensive TSDoc ✅ |

---

## Remediation: HTTP 451 + Test Strategy + Documentation ✅ Complete

**Status**: ✅ Complete
**Plan**: [archive/completed/transcript-451-test-doc-remediation.plan.md](archive/completed/transcript-451-test-doc-remediation.plan.md)

Cross-cutting remediation discovered during transcript
endpoint investigation (2026-02-12). Four workstreams:

| WS | Scope | Status |
| --- | --- | --- |
| WS1 | Handle HTTP 451 as `legally_restricted` (generator fix, ADR-109) | ✅ Complete |
| WS2 | Remove network IO and `process.env` mutation from E2E tests | ✅ Complete |
| WS3 | Update stale documentation (DATA-VARIANCES, API wishlist, ADR-092) | ✅ Complete |
| WS4 | Directive compliance sweep | ✅ Complete |

---

## Phase 2f: Public Release Readiness ✅ COMPLETE

**Status**: ✅ Complete (npm publish deferred until token is created)
**Plan**: [archive/completed/public-release-readiness.plan.md](archive/completed/public-release-readiness.plan.md)

All six workstreams completed. SDK renamed to
`@oaknational/curriculum-sdk`. npm publishing disabled
pending token creation.

| WS | Scope | Status |
| --- | --- | --- |
| WS1 | Secrets audit and remediation | ✅ Complete |
| WS2 | Licence and legal (MIT, OGL notice, branding, CoC) | ✅ Complete |
| WS3 | Package.json standardisation (all workspaces) | ✅ Complete |
| WS4 | Documentation overhaul (README, CONTRIBUTING, CHANGELOG, workspace READMEs) | ✅ Complete |
| WS5 | GitHub repository configuration (templates, Dependabot) | ✅ Complete |
| WS6 | Publication dry run (tarball inspection, test install) | ✅ Complete |

Permanent documentation: [Release and Publishing](../../../docs/development/release-and-publishing.md).

---

## Phase 2g: Developer Onboarding Experience

**Status**: 📋 After public release readiness
**Plan**: [active/developer-onboarding-experience.plan.md](active/developer-onboarding-experience.plan.md)

Dedicated stream for internal developer onboarding quality and
consistency. Follows public release readiness — some onboarding
work depends on the documentation and packaging established
in Phase 2f.

| WS | Scope | Status |
| --- | --- | --- |
| WS1 | Canonical onboarding journey | 📋 Pending |
| WS2 | Command truth and drift removal | 📋 Pending |
| WS3 | Link integrity and navigation | 📋 Pending |
| WS4 | Credential/access/contribution messaging | 📋 Pending |
| WS5 | Release operator onboarding (SDK-only) | 📋 Pending |
| WS6 | First-day rehearsal and sign-off | 📋 Pending |

---

## Thread Search: SDK Integration + Ground Truth Validation ✅ Complete

**Status**: ✅ Complete
**Plan**: [archive/completed/thread-search-sdk-integration.plan.md](archive/completed/thread-search-sdk-integration.plan.md)

Thread search is now fully integrated through the SDK, exposed via the
CLI `search threads` command, benchmarks use the SDK code path, and
8 ground truths span 5 subjects. Legacy test-query scripts deleted.

| WS | Scope | Status |
| --- | --- | --- |
| WS1 | SDK `searchThreads` method (types, retriever, service) | ✅ Complete |
| WS2 | CLI `search threads` command | ✅ Complete |
| WS3 | Benchmark migration to SDK code path | ✅ Complete |
| WS4 | Ground truth expansion (1 → 8 across 5 subjects) | ✅ Complete |
| WS5 | Validation and baseline lock | ✅ Complete |
| WS6 | Delete legacy test-query scripts | ✅ Complete |

---

## Phase 2e: SDK Validation against Real Elasticsearch ✅ Complete

**Status**: ✅ Complete

Thread benchmarks were run against a live Elasticsearch cluster
during the thread search integration work. The SDK code path
(`createCliSdk` → `sdk.retrieval.searchThreads`) produced
correct results: MRR=0.938, NDCG@10=0.902 across 8 GTs.
Remaining validation tasks (filter combinations, error handling,
admin ops) will be addressed as part of the MCP integration
work in Phase 3.

**Credential safety**: Confirmed — the Search SDK requires ES
URL and credentials as explicit constructor arguments. No
environment variable access inside the SDK.

---

## Phase 3: MCP Search Integration

**Status**: ⏸️ After public release + onboarding (Phases 2f, 2g)  
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
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (36 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (935 tests) |

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
