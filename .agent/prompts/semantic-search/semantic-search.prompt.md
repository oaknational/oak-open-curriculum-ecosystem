# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-19

---

## Current Priority: Search Response Tuning

SDK extraction is complete (Checkpoints A–E2). Thread search SDK
integration is complete — `searchThreads` is wired through the SDK,
exposed via `oaksearch search threads`, benchmarks use the SDK code
path, 8 ground truths span 5 subjects (MRR=0.938, NDCG@10=0.902),
and legacy `test-query-*.ts` scripts have been deleted. All SDK
retrieval methods have been validated against live Elasticsearch.

**Active plans**:
- [phase-3a-mcp-search-integration.md](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md) — MCP search tools (WS1-WS4 complete, WS5 remaining)
- [search-response-tuning.md](../../plans/semantic-search/active/search-response-tuning.md) — **current priority** (P1 response format unification, P2 type deduplication, P3 ES source filtering)
- [env-architecture-overhaul.md](../../plans/semantic-search/active/env-architecture-overhaul.md) — largely complete, needs final quality gate pass

**Next action**: Search response tuning. Three problems, prioritised:

1. **P1: Response format drift.** Generated tools put full JSON in
   `content[0].text` (Cursor sees it). Aggregated tools put a one-line
   summary in `content[0].text` and full data in `structuredContent`
   (Cursor cannot see it). Fix: one unified formatting function that
   puts both a summary AND JSON in the `content` array (MCP spec
   supports multiple content blocks). All tools, same shape.

2. **P2: Duplicated type definitions.** `ToolAnnotations` and `ToolMeta`
   are defined twice — inline in the generated contract AND as named
   interfaces in `universal-tools/types.ts`. They can drift silently.
   Fix: emit named types from the type-gen codegen, re-export in
   runtime code. This is a focused subset of the broader Phase 0
   aggregated-tools-to-type-gen migration.

3. **P3: Bloated ES responses.** `search-sdk` returns 186 KB for 5
   results because the full `lesson_content` transcript (14K chars per
   lesson) is included. Fix: `_source` filtering in the Search SDK to
   exclude transcript and semantic fields. 94% payload reduction.

Read the plan first:
[search-response-tuning.md](../../plans/semantic-search/active/search-response-tuning.md)

After response tuning: WS5 — compare SDK search (`search-sdk`) vs REST
API search (`search`) on representative queries; replace if superior.

**Completed**: [fail-fast-elasticsearch-credentials.md](../../plans/semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md)

**Roadmap**: [roadmap.md](../../plans/semantic-search/roadmap.md)

---

## Discipline, Correctness, Architectural Excellence

The directives in `.agent/directives/` are the authority. Read
them. Follow them. There is one right way to do everything in
this codebase, and it is defined there. What follows is a
summary -- when in doubt, the directives win.

**Strictness is a design requirement.** Do not invent optionality.
Do not add fallback options. Do not create compatibility layers.
We know exactly what is needed. The proper functioning of the
system depends on acknowledging those restrictions and valuing the
insights offered by the type system.

**First Question.** Before every decision: could it be simpler
without compromising quality?

**TDD at ALL levels.** RED, GREEN, REFACTOR -- at unit,
integration, AND E2E. The test comes first. It MUST fail before
implementation exists. Test behaviour, not implementation. Simple
fakes injected as arguments, never complex mocks. No global state
manipulation. If tests lag behind code at any level, TDD was not
followed.

**Types from the schema.** All types derive from the OpenAPI
schema via `pnpm type-gen`. No ad-hoc types. No `as`. No `any`.
No `!`. No `Record<string, unknown>`. Preserve type information --
never widen a literal to `string`. If the type system resists,
the code is wrong.

**Result pattern.** All I/O methods return `Result<T, E>`. Handle
all cases explicitly. Never throw. Never return null.

**Fail fast.** Never swallow errors. Never log and continue. Fail
immediately with a message that explains what and why.

**Generator-first.** Change templates, rerun `pnpm type-gen`.
Never edit generated files. Missing data is a generator bug.

**Quality gates are blocking.** Every gate, every time. A failing
gate means the work is not done. There is no such thing as an
acceptable failure.

**Never disable checks.** No `@ts-ignore`. No `eslint-disable`.
No `--no-verify`. Fix the code, not the check.

**Architectural boundaries.** SDK consumes Curriculum SDK types.
CLI consumes SDK. Enforced by ESLint. Do not bypass.

**Document everything.** Exhaustive TSDoc. Public APIs with
examples. ADRs for decisions. Progressive disclosure from README
to source.

**Protocol.** If you cannot follow proper protocol, STOP and
explain why. Do not work around it.

## Mandatory Reading

Read ALL of these before writing any code. Not after. Before.
They are the authority. They define how this codebase works,
what is expected, and why. If you skip them, you will violate
the standards and produce work that must be rejected.

1. [AGENT.md](../../directives/AGENT.md) -- Cardinal rule, first question, essential links
2. [rules.md](../../directives/rules.md) -- Core rules: TDD, strictness, types, quality, architecture
3. [testing-strategy.md](../../directives/testing-strategy.md) -- TDD at ALL levels, test definitions, violations
4. [schema-first-execution.md](../../directives/schema-first-execution.md) -- Generator is source of truth, prohibited practices
5. [semantic-search-architecture.md](../../directives/semantic-search-architecture.md) -- Structure is the foundation, correct framing
6. [metacognition.md](../../directives/metacognition.md) -- Think about your thoughts, reflect, gain insights
7. [roadmap.md](../../plans/semantic-search/roadmap.md) -- Authoritative milestone sequence

---

## What We Have

A production-ready Elasticsearch-backed semantic search
system split across three workspaces:

- **Search SDK** (`packages/sdks/oak-search-sdk/`): Fully
  implemented retrieval, admin, and observability services
  with dependency injection. All methods return
  `Result<T, E>`. 36 tests.
- **Search CLI** (`apps/oak-search-cli/`): Thin wrapper
  over the SDK providing `oaksearch` commands for search,
  admin, evaluation, and observability. 935 tests.
- **Oak API SDK** (`packages/sdks/oak-curriculum-sdk/`):
  Upstream Oak Open Curriculum API types, generated via
  `pnpm type-gen`.

**DI and credential safety**: The Search SDK requires ES
URL and credentials as explicit constructor arguments —
no environment variable access inside the SDK. Only the
CLI reads env vars (centralised in `src/lib/env.ts`,
ESLint-enforced). The `createCliSdk()` factory maps
env → ES client → SDK instance. All other consumers
(MCP servers, future apps) must provide their own
credentials at construction time.

### Search Pipeline

4-way RRF hybrid search (BM25 + ELSER on both Content
and Structure) for lessons and units, 2-way for threads
and sequences. Query processing includes noise phrase
removal, curriculum phrase detection, and transcript-aware
score normalisation.

**Full details**: [ARCHITECTURE.md](/apps/oak-search-cli/docs/ARCHITECTURE.md)

### Indexes

| Index | Documents | Purpose |
|-------|-----------|---------|
| `oak_lessons` | 12,833 | Primary lesson retrieval |
| `oak_unit_rollup` | 1,665 | Unit search and highlights |
| `oak_threads` | 164 | Conceptual progression strands |
| `oak_sequences` | 30 | API data structures (generate programme views) |

### Ground Truth Baselines

| Index | GTs | MRR | NDCG@10 |
|-------|-----|-----|---------|
| Lessons | 30 | 0.983 | 0.944 |
| Units | 2 | 1.000 | 0.923 |
| Threads | 8 | 0.938 | 0.902 |
| Sequences | 1 | 1.000 | 1.000* |

\* Single-query index — mechanism check only. Thread GTs were
expanded from 1 to 8 across 5 subjects as part of the
[thread search plan](../../plans/semantic-search/archive/completed/thread-search-sdk-integration.plan.md)
(now complete).

**Protocol**: [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

---

## Completed Work

### SDK Extraction (Checkpoints A–E2) ✅

Full details: [search-sdk-cli.plan.md](../../plans/semantic-search/archive/completed/search-sdk-cli.plan.md)

- SDK workspace at `packages/sdks/oak-search-sdk/`
- All 16 I/O methods return `Result<T, E>` with
  per-service error types (`RetrievalError`, `AdminError`,
  `ObservabilityError`)
- Comprehensive TSDoc on all functions
- CLI at `apps/oak-search-cli/` with error boundary pattern
- Evaluation rewired to use SDK retrieval code paths

### TSDoc Compliance Fix ✅

Non-standard TSDoc tags fixed at source across the entire
codebase (462 files). `eslint-plugin-tsdoc` added with
`tsdoc/syntax: warn` for regression prevention.

---

### Remediation: HTTP 451 + Test Strategy + Documentation ✅

Cross-cutting remediation completed 2026-02-12. The upstream
API returns HTTP 451 (Unavailable For Legal Reasons) for
restricted transcripts. Our SDK now classifies 451 as
`legally_restricted` — a distinct error kind, separate from
`not_found` (404). See [ADR-109](/docs/architecture/architectural-decisions/109-http-451-distinct-classification.md).

Four workstreams completed: 451 error handling (new
`SdkLegallyRestrictedError` kind via generator fix), E2E test
compliance (network IO removal, `process.env` cleanup), stale
documentation updates, directive compliance sweep.

**Plan**: [transcript-451-test-doc-remediation.plan.md](../../plans/semantic-search/archive/completed/transcript-451-test-doc-remediation.plan.md)

### Thread Search: SDK Integration + Ground Truth Validation ✅

Thread search wired through the SDK and exposed to all consumers.
Completed 2026-02-12. Six workstreams:

1. **SDK method**: `searchThreads` on `RetrievalService` — 2-way RRF
   (BM25 on `thread_title^2` + ELSER on `thread_semantic`), subject
   filter maps to `subject_slugs` array field. Extracted to
   `search-threads.ts`; `toRetrievalError` extracted to
   `retrieval-error.ts` to break dependency cycle.
2. **CLI command**: `oaksearch search threads <query>` with
   `--subject` and `--size` options. `registerThreadsCmd` extracted
   to dedicated file for max-lines compliance.
3. **Benchmark migration**: `benchmark-all-threads.ts` and
   `benchmark-threads.ts` now use `sdk.retrieval.searchThreads`
   via `createCliSdk(env())`. No direct `esSearch` calls remain.
4. **Ground truth expansion**: 1 → 8 GTs across 5 subjects (maths,
   science, english, computing, geography). Known-Answer-First
   methodology. Live baselines: MRR=0.938, NDCG@10=0.902,
   P@3=0.333, R@10=0.938.
5. **Validation**: Full benchmark suite run against live ES.
   Documentation updated across roadmap, SDK README, session
   prompt, and ground-truth-protocol.
6. **Legacy cleanup**: 4 `test-query-*.ts` scripts deleted (lessons,
   units, sequences, threads). All references updated to use
   `oaksearch search <scope>` CLI commands.

**Plan**: [thread-search-sdk-integration.plan.md](../../plans/semantic-search/archive/completed/thread-search-sdk-integration.plan.md)

### Fail-Fast Elasticsearch Credentials ✅

Six layers of silent degradation removed across three workspaces.
Both MCP servers now fail at startup if `ELASTICSEARCH_URL` or
`ELASTICSEARCH_API_KEY` are absent; env validation (Zod for HTTP,
explicit check for STDIO) enforces this at the entry point. All
downstream code trusts the types — unreachable `if-missing` branches
deleted. Stub mode uses `createStubSearchRetrieval()` (exported from
curriculum-sdk `public/mcp-tools.ts`) instead of constructing a real
ES client. `searchRetrieval` is required in `UniversalToolExecutorDependencies`,
`ToolHandlerDependencies`, and `UniversalToolExecutors`.

**Plan**: [fail-fast-elasticsearch-credentials.md](../../plans/semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md)

### Streamable HTTP Transport Bug Fix (ADR-112) ✅

The streamable-http server was creating one `StreamableHTTPServerTransport`
in stateless mode at startup and reusing it. The MCP SDK (v1.26.0)
forbids this — stateless transports throw after the first request.
Fixed by implementing the per-request transport pattern (ADR-112):
a factory creates a fresh `McpServer` + `StreamableHTTPServerTransport`
per request while sharing heavy dependencies (ES client, config, logger).
E2E tests simplified (6 files), smoke test `withFreshServer` workaround
removed, all "one-client" comments removed.

**ADR**: [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md)
**Plan**: [streamable-http-transport-stateless-bug.md](../../plans/semantic-search/archive/completed/streamable-http-transport-stateless-bug.md)

### Code Quality Remediation ✅

Two cross-cutting code quality workstreams completed
2026-02-16, after developer onboarding:

1. **TSDoc lint warnings**: Resolved all 1,693 TSDoc lint
   warnings to 0 across the entire monorepo. Escaping
   fixed at generator level. `eslint-plugin-tsdoc` enforces
   regression prevention.
2. **Remove type shortcuts**: Eliminated type assertions
   (`as`, `as unknown`, `any`, `!`), `Reflect` API usage,
   and `Record<string, unknown>` patterns across generators,
   product code, and tests (137 files changed). Type guards,
   `satisfies`, and widen-by-assignment patterns used instead.

---

## Phase 3a — MCP Search Tools (WS1-WS4 Complete)

Three new MCP tools expose the Search SDK's Elasticsearch-backed
semantic search to agents and teachers. WS1 (RED), WS2 (GREEN),
WS3 (REFACTOR), and WS4 (quality gates + test gap fill) are
complete. Only WS5 (compare SDK search vs REST API; replace if
superior) remains.

**Execution plan**: [phase-3a-mcp-search-integration.md](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md)

### Search Tool Architecture

| Tool | Scopes/Purpose | SDK Methods |
|------|---------------|-------------|
| `search-sdk` | 5 scopes: lessons, units, threads, sequences, suggest | `searchLessons`, `searchUnits`, `searchThreads`, `searchSequences`, `suggest` |
| `browse-curriculum` | Faceted navigation (no free-text query) | `fetchSequenceFacets` |
| `explore-topic` | Compound parallel cross-scope discovery | `searchLessons` + `searchUnits` + `searchThreads` in parallel |

The old `search` tool (REST API) coexists during transition.
WS5 will compare and likely replace it.

### Key Implementation Details

- **Dependency inversion**: `SearchRetrievalService` interface
  in curriculum-sdk (`search-retrieval-types.ts`) breaks the
  circular dependency with search-sdk. Structurally compatible
  with `oak-search-sdk`'s `RetrievalService`.
- **`searchRetrieval` on `UniversalToolExecutorDependencies`**:
  **Required** (not optional). Both MCP servers fail at startup
  if `ELASTICSEARCH_URL` or `ELASTICSEARCH_API_KEY` are absent.
  In stub mode (`OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`),
  `createStubSearchRetrieval()` is used instead of a real ES
  client — no real connection is attempted. See
  [fail-fast-elasticsearch-credentials.md](../../plans/semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md).
- **MCP servers inject the concrete implementation**: Both
  STDIO and HTTP servers create `createSearchSdk().retrieval`
  when `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` are set.
- **Error mapping**: `Result<T, RetrievalError>` maps directly
  to `CallToolResult`. Two error patterns coexist (existing
  `ToolExecutionResult` and new `Result<T, E>`).
- **Dispatch maps**: `executor.ts` uses a const object map
  for tool dispatch; `execution.ts` uses a scope dispatcher
  map. Both avoid `switch` statements for ESLint complexity.
- **`isAggregatedToolName` derives from `AGGREGATED_TOOL_DEFS`**:
  The type guard in `universal-tools/type-guards.ts` uses
  `value in AGGREGATED_TOOL_DEFS` — NOT a hardcoded list of
  tool names. This was fixed (2026-02-19) after the guard had
  drifted from the definitions, causing `search-sdk`,
  `browse-curriculum`, and `explore-topic` to appear in
  `tools/list` but return "Unknown tool" on `tools/call`.
  The fix ensures the guard stays in sync automatically. Do
  NOT revert to a manually maintained list.

### Module Locations

```text
packages/sdks/oak-curriculum-sdk/src/mcp/
  search-retrieval-types.ts    — SearchRetrievalService interface (DI)
  aggregated-search-sdk/       — search-sdk tool (5 scopes)
  aggregated-browse/           — browse-curriculum tool
  aggregated-explore/          — explore-topic tool

apps/oak-curriculum-mcp-stdio/src/app/wiring.ts       — STDIO ES wiring
apps/oak-curriculum-mcp-streamable-http/src/
  search-retrieval-factory.ts  — HTTP ES factory
  handlers.ts                  — HTTP search injection
```

### What Needs Doing Next

**Search Response Tuning** — current priority (pre-WS5):

Testing the new `search-sdk` tool revealed three problems that must
be fixed before WS5 comparison can be meaningful:

1. **Response format drift** (P1): Generated tools put full JSON in
   `content[0].text` (visible to Cursor). Aggregated tools put only
   a one-line summary there, hiding the data in `structuredContent`
   (invisible to Cursor). This makes the aggregated tools functionally
   useless for any MCP client that reads `content` only. Fix: unify
   to one formatting function; all tools return summary + JSON in
   `content[]` plus `structuredContent` plus `_meta`.

2. **Duplicated types** (P2): `ToolAnnotations` and `ToolMeta` defined
   independently in the generated contract AND in runtime types. Fix:
   emit from type-gen codegen, re-export in runtime. A focused subset
   of the broader Phase 0 aggregated-tools-to-type-gen migration
   ([03-mcp-infrastructure-advanced-tools-plan.md](../../plans/sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md)).

3. **Bloated ES responses** (P3): 186 KB for 5 results because
   `lesson_content` (14K chars per lesson) is included. Fix: `_source`
   filtering in Search SDK. 94% reduction.

**Plan**: [search-response-tuning.md](../../plans/semantic-search/active/search-response-tuning.md)

**After response tuning — WS5 (COMPARE AND REPLACE)**:

- Run representative teacher queries through both old `search`
  (REST) and new `search-sdk` (ES/SDK)
- Compare relevance, coverage, latency
- If superior, remove old `aggregated-search/` module
- Full quality gate chain after replacement
- Requires live Elasticsearch credentials in the environment

**Completed: Environment architecture overhaul**. `@oaknational/mcp-env`
overhauled to a proper `resolveEnv` pipeline. `Result<T, E>` pattern.
HTTP server: conditional Clerk keys via `superRefine`, discriminated
`RuntimeConfig` union, `loadRuntimeConfig` returns `Result`. Entry
points gutted to minimal wiring. `result` and `env` packages moved
to `packages/core/`. Quality gates passing.
See [env-architecture-overhaul.md](../../plans/semantic-search/active/env-architecture-overhaul.md).

**Completed: Fail-fast ES credentials**. Six layers of silent
degradation removed. `searchRetrieval` is now required across all
three workspaces. Both servers fail at startup if ES credentials
are absent. Stub mode uses `createStubSearchRetrieval()` — no real
ES client constructed. `createStubSearchRetrieval()` exported from
curriculum-sdk `public/mcp-tools.ts`. All quality gates pass.
See [archived plan](../../plans/semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md).

**Completed in WS3**: NL guidance (`tool-guidance-data.ts`,
`tool-guidance-workflows.ts`), MCP prompts (`mcp-prompts.ts`,
`mcp-prompt-messages.ts` — 5 prompts total), TSDoc audit,
READMEs for curriculum-sdk, STDIO, HTTP servers.

**Completed in WS4 follow-up**: `search-retrieval-factory.ts`
integration tests (9 tests, DI with `FakeClient`), browse
`formatting.unit.test.ts` (7 tests, `createFacet`/`createFacets`
helpers for generated types).

### Environment and Config (2026-02-18)

- `@oaknational/mcp-env` overhauled: `resolveEnv` pipeline reads
  `.env` < `.env.local` < `process.env`, validates against
  app-provided Zod schema, returns `Result<T, EnvResolutionError>`.
  Dead code removed (`createAdaptiveEnvironment`,
  `EnvironmentProvider`, bolted-on diagnostics).
- Shared Zod schemas: `OakApiKeyEnvSchema`,
  `ElasticsearchEnvSchema`, `LoggingEnvSchema` as composable
  building blocks.
- HTTP server: conditional Clerk keys via `superRefine`,
  `RuntimeConfig` discriminated union on `dangerouslyDisableAuth`,
  `loadRuntimeConfig` returns `Result<RuntimeConfig, ConfigError>`.
- `result` and `env` packages moved from `packages/libs/` to
  `packages/core/`.
- STDIO–HTTP server alignment plan on backlog
  (`.agent/plans/architecture/stdio-http-server-alignment.md`).
- Env overhaul largely complete, needs final quality gate pass:
  [env-architecture-overhaul.md](../../plans/semantic-search/active/env-architecture-overhaul.md)

### Phase 4 — Search Quality + Ecosystem

Multiple parallel streams:

| Stream | Focus |
|--------|-------|
| GT Expansion | 30 → 80-100 ground truths |
| Search Quality Levels 2-4 | Document relationships → Modern ES → AI enhancement |
| Bulk Data Analysis | Vocabulary mining from curriculum data |
| SDK API | Filter testing across 17 subjects × 4 key stages |
| Subject Domain Model | Move subject knowledge to type-gen time |
| Operations | Governance, latency budgets, failure modes |

**Details**: [roadmap.md](../../plans/semantic-search/roadmap.md)

---

## CLI Commands (`oaksearch`)

See [apps/oak-search-cli/README.md](../../apps/oak-search-cli/README.md#cli-commands-oaksearch) for the full CLI command reference.

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

Run the full chain after every piece of work, from repo root.
Not some of them. All of them. In this order. Every time.

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

**Every gate MUST pass. There is no such thing as an acceptable
failure. If a gate fails, the work is not done. Fix it.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](/apps/oak-search-cli/docs/ARCHITECTURE.md) | Search pipeline architecture |
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and GT process |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Ground truth methodology |
| [ADR-082](/docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first search strategy |
| [ADR-107](/docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | Deterministic SDK / NL-in-MCP boundary |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Authoritative plan sequence |
| [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) | Per-request MCP transport (stateless bug fix) |
| [Transport Bug Plan (archived)](../../plans/semantic-search/archive/completed/streamable-http-transport-stateless-bug.md) | Investigation and fix (complete) |
| [Active plan: Phase 3a](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md) | MCP search integration (WS1-WS4 done, WS5 remaining) |
| [Active plan: Response tuning](../../plans/semantic-search/active/search-response-tuning.md) | Unified response format, type deduplication, ES source filtering (current priority) |
| [Active plan: Env overhaul](../../plans/semantic-search/active/env-architecture-overhaul.md) | Env resolution pipeline (largely complete) |
| [Plan 03 Phase 0](../../plans/sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md) | Aggregated tools type-gen migration (future, blocks Phases 1-4) |
| [Completed: Fail-fast ES creds](../../plans/semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md) | Remove silent degradation on missing ES credentials ✅ |
| [Background: wire-hybrid-search](../../plans/semantic-search/archive/completed/wire-hybrid-search-background.md) | Original architectural design (reference only) |
| [Multi-Index Plan](../../plans/semantic-search/archive/completed/multi-index-ground-truths.md) | Completed ground truth work |
| [expansion-plan.md](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) | Future GT expansion |
