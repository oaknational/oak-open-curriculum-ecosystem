# Semantic Search Roadmap

**Status**: 🔄 **Phase 3 (MCP Search Integration) in progress** — all prerequisites complete  
**Last Updated**: 2026-02-21  
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
until token is created). Developer onboarding experience
is complete. Type shortcuts have been removed across the
monorepo.

**Three workstreams remain before the branch can merge:**

1. **WS5 — Replace old search** (3a): Comparative testing
   confirms the search-sdk tools are strictly superior.
   WS5 replaces the old REST-based search and retires the
   generated wrappers.
2. **Proxy OAuth AS for Cursor** (3f): Phase 1 (RED + GREEN)
   mostly complete — 3 proxy endpoints, 32 tests, passthrough
   philosophy applied. Remaining: async bootstrap, `fetch` DI,
   E2E updates, Cursor validation.
   Plan: [proxy-oauth-as-for-cursor.plan.md](active/proxy-oauth-as-for-cursor.plan.md)
3. **SDK workspace separation** (3e): Split `curriculum-sdk`
   into type-gen and runtime workspaces with enforced
   one-way dependency.

Result pattern unification (3b) and STDIO-HTTP alignment
(3c) are deferred to post-merge.

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
Phase 2g: Developer Onboarding Experience             ✅ COMPLETE
  Canonical journey, command truth, link integrity
         ↓
Phase 2h: Code Quality Remediation                     ✅ COMPLETE
  Remove type shortcuts, TSDoc warnings
         ↓
Phase 3: MCP Search Integration + Merge Prep          🔄 IN PROGRESS
  ├── 3a. Search tool wiring — WS5 replace old search   (merge-blocking)
  ├── 3d. OAuth spec compliance — 401 on initial req     ✅ COMPLETE (ADR-113)
  ├── 3d'. Widget KG tidy-up — fix crash, migrate SVGs   ✅ COMPLETE
  ├── 3e'. OAuth validation + Cursor investigation       ✅ COMPLETE
  ├── 3e. SDK workspace separation — type-gen/runtime    (merge-blocking)
  ├── 3f. Proxy OAuth AS for Cursor                      (merge-blocking, Phase 1 partial)
  └── 3b. Result pattern unification                     (post-merge)
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

## Phase 2g: Developer Onboarding Experience ✅ Complete

**Status**: ✅ Complete
**Plan**: [archive/completed/developer-onboarding-experience.plan.md](archive/completed/developer-onboarding-experience.plan.md)

Dedicated stream for internal developer onboarding quality and
consistency. Followed public release readiness — onboarding
work depended on the documentation and packaging established
in Phase 2f.

| WS | Scope | Status |
| --- | --- | --- |
| WS1 | Canonical onboarding journey | ✅ Complete |
| WS2 | Command truth and drift removal | ✅ Complete |
| WS3 | Link integrity and navigation | ✅ Complete |
| WS4 | Credential/access/contribution messaging | ✅ Complete |
| WS5 | Release operator onboarding (SDK-only) | ✅ Complete |
| WS6 | First-day rehearsal and sign-off | ✅ Complete |

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

## Phase 2h: Code Quality Remediation ✅ Complete

**Status**: ✅ Complete

Cross-cutting code quality work completed after developer
onboarding. Two workstreams:

| WS | Scope | Status |
| --- | --- | --- |
| TSDoc lint warnings | Resolve all 1,693 TSDoc lint warnings to 0 | ✅ Complete |
| Remove type shortcuts | Eliminate type assertions, Reflect API, Record patterns across generators, product code, and tests (137 files) | ✅ Complete |

---

## Phase 3: MCP Search Integration + Merge Prep

**Status**: 🔄 In Progress — all prerequisites complete

Multiple workstreams. Three are **merge-blocking** (3a WS5,
3e SDK split, 3f proxy OAuth AS). Two are completed (3d OAuth
spec compliance, 3e' OAuth validation). Two are post-merge
(3b result unification, 3c STDIO alignment).

### 3a. Search Tool Wiring (merge-blocking)

**Active plan**: [phase-3a-mcp-search-integration.md](active/phase-3a-mcp-search-integration.md)
**Background**: [wire-hybrid-search (archived)](archive/completed/wire-hybrid-search-background.md)

**Goal**: Wire hybrid search into MCP tools — first
consumer of the SDK. Then compare with existing REST API
search and replace it.

| Task | Status |
|------|--------|
| Three MCP search tools (`search-sdk`, `browse-curriculum`, `explore-topic`) wired to SDK retrieval | ✅ Complete (WS1-WS2) |
| Filter parameters passed through correctly | ✅ Complete |
| `Result<T, E>` errors surfaced as MCP errors | ✅ Complete |
| NL guidance, tool descriptions, workflow guidance, MCP prompts | ✅ Complete (WS3) |
| TSDoc, READMEs for curriculum-sdk, STDIO, HTTP servers | ✅ Complete (WS3) |
| Test gaps: search-retrieval-factory (9 tests), browse formatting (7 tests) | ✅ Complete (WS4 follow-up) |
| Existing MCP tools unaffected | ✅ Complete |
| All quality gates pass (191/191 E2E, 1241 SDK, 620 HTTP unit/integration) | ✅ Complete (WS4) |
| Fail fast on missing ES credentials (remove silent degradation) | ✅ Complete — [plan](archive/completed/fail-fast-elasticsearch-credentials.md) |
| Environment architecture overhaul (fix env loading, conditional Clerk keys, discriminated RuntimeConfig) | ✅ Complete — [plan](archive/completed/env-architecture-overhaul.md) |
| Compare semantic search with existing `search` tool (REST API) | 📋 Pending (WS5) |
| If superior, replace REST API composite search with SDK-backed search | 📋 Pending (WS5) |

### 3d. OAuth Spec Compliance ✅ COMPLETE

**Completed plan**: [oauth-spec-compliance.md](archive/completed/oauth-spec-compliance.md)
**ADR**: [ADR-113](/docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md)

All MCP methods now require HTTP-level authentication.
Discovery method and noauth tool auth bypasses removed.
ADR-056 superseded. ~300 lines of dead code deleted.
`mcp-router.ts` simplified dramatically.

| Task | Status |
|------|--------|
| Analysis — map affected files and tests | ✅ Complete |
| RED (E2E): Assert 401 for discovery without auth | ✅ Complete |
| RED (integration): Invert router and middleware assertions | ✅ Complete |
| RED (unit): Invert classifier assertions | ✅ Complete |
| GREEN: Remove discovery bypass from mcp-router and clerk middleware | ✅ Complete |
| GREEN: All tests pass | ✅ Complete |
| REFACTOR: Delete dead code (classifier, sync tests) | ✅ Complete |
| REFACTOR: Update TSDoc and README auth section | ✅ Complete |
| ADR: Supersede ADR-056 (conditional clerk middleware) | ✅ Complete |
| Update testing-strategy.md example | ✅ Complete |
| Verify ChatGPT tool-level auth still works | ✅ Complete |
| Verify Cursor OAuth flow (Needs login → Clerk) | ✅ Investigated — Cursor bug confirmed, see 3f (proxy OAuth AS) |
| Full quality gate chain | ✅ Complete |

### 3e'. OAuth Validation and Cursor Investigation ✅ COMPLETE

**Archived plans**: [oauth-validation-and-cursor-flows.plan.md](archive/completed/oauth-validation-and-cursor-flows.plan.md),
[cursor-oauth-investigation-report.md](archive/completed/cursor-oauth-investigation-report.md)

AS metadata endpoint added. Spec-compliant smoke test (`pnpm smoke:oauth:spec`)
passes end-to-end. Cursor investigation complete — root cause diagnosed as
a confirmed client-side bug ([forum #151331](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331)).

| Task | Status |
|------|--------|
| AS metadata endpoint (`/.well-known/oauth-authorization-server`) | ✅ Complete |
| Spec-compliant OAuth discovery chain smoke test | ✅ Complete |
| Spec-compliant OAuth E2E smoke test | ✅ Complete |
| Run spec smoke against live dev server | ✅ Complete |
| Cursor-specific investigation | ✅ Complete — root cause: `resource_metadata` URL loss |

### 3f. Proxy OAuth AS for Cursor (merge-blocking)

**Active plan**: [proxy-oauth-as-for-cursor.plan.md](active/proxy-oauth-as-for-cursor.plan.md)

**Goal**: Act as a proxy OAuth AS so Cursor sees RS and AS on the same
origin, bypassing the confirmed Cursor bug.

**Completed**: Three proxy endpoints (register, authorize, token),
pure functions, 22 unit tests, 10 integration tests, four architectural
reviews. Passthrough philosophy: proxy does NOT validate.

**Remaining**: Async bootstrap (make `createApp` async, ~25 call sites),
inject `fetch` for test DI, update E2E test assertions, Cursor
validation, smoke test updates, quality gates, documentation.

| Task | Status |
|------|--------|
| Phase 1 (RED): Failing integration + unit tests for proxy | ✅ Complete (22 + 10 tests) |
| Phase 1 (GREEN): Implement proxy endpoints, update metadata | ✅ Complete |
| Architecture design (custom routes chosen over SDK router) | ✅ Complete |
| Architectural review (Barney, Betty, Fred, Wilma) | ✅ Complete |
| Make `createApp` async for metadata fetch | 📋 Pending |
| Inject `fetch` into proxy config for test DI | 📋 Pending |
| Update E2E test assertions (self-origin in metadata) | 📋 Pending |
| Phase 1 (VALIDATE): Cursor E2E, smoke tests pass | 📋 Pending |
| Quality gates | 📋 Pending |
| Documentation, ADRs, archive plans | 📋 Pending |

### 3d'. Widget Knowledge Graph Tidy-Up ✅ Complete

**Plan**: [ontology-knowledge-graph-tidy-up.md](archive/completed/ontology-knowledge-graph-tidy-up.md)

The `get-knowledge-graph` tool was removed and its data
merged into `get-ontology`. A dangling renderer reference
previously crashed all widget rendering. This remediation is now complete.

| Task | Status |
|------|--------|
| Fix widget crash (remove dead knowledgeGraph reference) | ✅ Complete |
| Migrate knowledge graph SVGs to ontology renderer | ✅ Complete |
| Clean up widget-preview.html | ✅ Complete |
| Update documentation (README, agent prompts) | ✅ Complete |
| Full quality gate chain | ✅ Complete |

### 3e. SDK Workspace Separation (merge-blocking)

**Active plan**: [sdk-workspace-separation.md](active/sdk-workspace-separation.md)
**Meta-plan**: [sdk-workspace-separation-meta-plan.md](active/sdk-workspace-separation-meta-plan.md)
**Detailed plan**: [pipeline-enhancements/sdk-workspace-separation-plan.md](../pipeline-enhancements/sdk-workspace-separation-plan.md)
**ADR**: [ADR-108](../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)

**Goal**: Split `@oaknational/curriculum-sdk` into two
workspaces: `curriculum-sdk-generation` (type-gen) and
`curriculum-sdk` (runtime). Runtime depends on type-gen,
never the reverse.

| Task | Status |
|------|--------|
| Foundations: inventory, import audit, CI review | 📋 Pending |
| Public API blueprint: export grouping, barrel design | 📋 Pending |
| Workspace scaffolding: create generation workspace | 📋 Pending |
| Boundary enforcement: ESLint rules, turbo.json | 📋 Pending |
| Runtime updates: switch imports, remove duplicates | 📋 Pending |
| Documentation and validation | 📋 Pending |

### 3b-bug. Streamable HTTP Transport — Stateless Mode Bug ✅ COMPLETE

**ADR**: [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md)
**Plan**: [archive/completed/streamable-http-transport-stateless-bug.md](archive/completed/streamable-http-transport-stateless-bug.md)

Fixed via per-request transport pattern (ADR-112). Factory creates
fresh `McpServer` + `StreamableHTTPServerTransport` per request while
sharing heavy dependencies. E2E tests simplified, smoke workaround
removed, all quality gates pass.

| Task | Status |
|------|--------|
| Confirm impact on local dev + Vercel warm instances | ✅ Complete |
| Choose architecture (Option B: per-request transport) | ✅ Complete |
| Implement fix with TDD (E2E first, then implementation) | ✅ Complete |
| Full quality gates pass | ✅ Complete |

### 3c. STDIO–HTTP Server Alignment (post-merge, backlog)

**Plan**: [../../architecture/stdio-http-server-alignment.md](../../architecture/stdio-http-server-alignment.md)

**Goal**: Eliminate all non-transport differences between the
STDIO and HTTP servers. Both should share env validation, tool
registration, search retrieval, resources, prompts, and error
handling. Only transport-specific code (auth, logging sink,
Express middleware, Vercel config, widgets) should differ.

| Task | Status |
|------|--------|
| STDIO uses shared Zod schemas from `@oaknational/mcp-env` | 📋 Pending |
| Shared tool registration pattern | 📋 Pending |
| Shared search retrieval factory | 📋 Pending |
| STDIO registers resources and prompts | 📋 Pending |
| E2E feature parity verification | 📋 Pending |

### 3b. MCP Result Pattern Unification (post-merge)

**Plan**: [post-sdk/mcp-integration/mcp-result-pattern-unification.md](post-sdk/mcp-integration/mcp-result-pattern-unification.md)

**Goal**: Migrate the MCP tool execution layer from the
custom `ToolExecutionResult` discriminated union to the
canonical `Result<T, E>` from `@oaknational/result`,
aligning with the Search SDK and Search CLI.

| Task | Status |
|------|--------|
| `ToolExecutionResult` → `Result<ToolExecutionSuccess, McpToolError>` | 📋 Pending |
| Remove `extractExecutionData` (direct `Result` usage) | 📋 Pending |
| Validation functions → `Result<T, string>` | 📋 Pending |
| Update auth interception to inspect `Result.error` | 📋 Pending |
| Update stub executor | 📋 Pending |
| Update all tests (~10 files) | 📋 Pending |
| All quality gates pass | 📋 Pending |

**Scope**: ~25-30 files across Curriculum SDK MCP code,
STDIO server, HTTP server. Does not block merge — the
semantic-search tool bypasses `ToolExecutionResult`
entirely. Best started on a new branch after merge.

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
| **Bulk Schema-Driven Type-Gen** | [bulk-schema-driven-type-gen.md](post-sdk/bulk-schema-driven-type-gen.md) | Replace template-based bulk Zod generation with schema-driven generation from `bulk-downloads/schema.json`; extract authoritative domain enums | 📋 Pending |
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

## Five Workspaces

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Oak API SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream OOC API types, type-gen, MCP tool definitions |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (36 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (935 tests) |
| **MCP STDIO** | `apps/oak-curriculum-mcp-stdio/` | STDIO transport MCP server |
| **MCP HTTP** | `apps/oak-curriculum-mcp-streamable-http/` | HTTP transport MCP server (Vercel) |

The Search SDK consumes types from the Oak API SDK.
The Search CLI consumes the Search SDK.
Both MCP servers consume the Oak API SDK (tool definitions)
and optionally the Search SDK (search retrieval).

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
