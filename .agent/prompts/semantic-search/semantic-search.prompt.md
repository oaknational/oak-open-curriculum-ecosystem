# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-20

---

## Current Priority: Three Merge Blockers

The `feat/semantic_search_deployment` branch requires three
workstreams to complete before it can merge. All active plans
are in `plans/semantic-search/active/`.

### 1. WS5 — Replace Old Search with Search SDK

**Active plan**: [phase-3a-mcp-search-integration.md](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md)

WS1-WS4 complete. Comparative testing confirms the search-sdk
tools are strictly superior. WS5 implements the replacement:

1. **WS5.1**: Add `SKIPPED_PATHS` to `mcp-tool-generator.ts` to
   exclude `/search/lessons` and `/search/transcripts` from
   generated tools. TDD.
2. **WS5.2**: Promote `search-sdk` → `search` in
   `AGGREGATED_TOOL_DEFS`. Delete `aggregated-search/` module.
   Update executor dispatch and all cross-references. TDD.
3. **WS5.4**: Full quality gate chain.

### 2. OAuth — Validate Spec-Compliant Path, Then Cursor

**Active plan**: [oauth-validation-and-cursor-flows.plan.md](../../plans/semantic-search/active/oauth-validation-and-cursor-flows.plan.md)

**Completed**:

- OAuth spec compliance (ADR-113) — all MCP methods require auth
- AS metadata endpoint restored for backward compatibility
- Completed plan: [oauth-spec-compliance.md](../../plans/semantic-search/archive/completed/oauth-spec-compliance.md)

**Current state**: Discovery chain (steps 1-3) passes against a live
dev server. PKCE flow code is clean (sessionJwt fallback removed).
One remaining blocker: the Clerk REST API supports creating OAuth apps
with `consent_screen_enabled: false` (needed so the authorize endpoint
redirects instead of showing an interactive consent page), but the
`@clerk/backend` v2.29.2 SDK types don't expose this property. Next
step: bypass the SDK types for this one call (direct REST, SDK upgrade,
or post-create PATCH), then run `pnpm smoke:oauth:spec` against a live
dev server. Consent-disabled apps are approved for ephemeral smoke tests
only — all product apps MUST keep consent enabled. Cursor-specific path
is lower priority, deferred until the spec path is proven.

### 2b. Widget Knowledge Graph Tidy-Up

**Active plan**: [ontology-knowledge-graph-tidy-up.md](../../plans/semantic-search/active/ontology-knowledge-graph-tidy-up.md)

The `get-knowledge-graph` tool was removed and its data
merged into `get-ontology`. A dangling `renderKnowledgeGraph`
reference in `widget-script.ts` crashes all widget rendering,
causing 19 UI test failures. Fix the crash, migrate the
knowledge graph SVGs to the ontology renderer, clean up
stale documentation references.

### 3. SDK Workspace Separation — Type-Gen / Runtime Split

**Active plan**: [sdk-workspace-separation.md](../../plans/semantic-search/active/sdk-workspace-separation.md)
**Meta-plan**: [sdk-workspace-separation-meta-plan.md](../../plans/semantic-search/active/sdk-workspace-separation-meta-plan.md)

Split `@oaknational/curriculum-sdk` into `curriculum-sdk-generation`
(type-gen) and `curriculum-sdk` (runtime). Runtime depends on
type-gen, never the reverse.

### Post-Merge

- [mcp-result-pattern-unification.md](../../plans/semantic-search/post-sdk/mcp-integration/mcp-result-pattern-unification.md) — `ToolExecutionResult` → `Result<T, E>` (new branch after merge)
- STDIO-HTTP server alignment — backlog

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

All archived plans: `.agent/plans/semantic-search/archive/completed/`

| Work | Key Outcome | Plan |
|------|------------|------|
| SDK Extraction (A–E2) | 16 I/O methods returning `Result<T, E>`, CLI with `oaksearch` | [search-sdk-cli.plan.md](../../plans/semantic-search/archive/completed/search-sdk-cli.plan.md) |
| Thread Search | `searchThreads` wired, 8 GTs, MRR=0.938 | [thread-search-sdk-integration.plan.md](../../plans/semantic-search/archive/completed/thread-search-sdk-integration.plan.md) |
| HTTP 451 Remediation | `legally_restricted` error kind (ADR-109) | [transcript-451-test-doc-remediation.plan.md](../../plans/semantic-search/archive/completed/transcript-451-test-doc-remediation.plan.md) |
| Fail-Fast ES Credentials | Silent degradation removed, `searchRetrieval` required | [fail-fast-elasticsearch-credentials.md](../../plans/semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md) |
| Transport Bug Fix | Per-request transport pattern (ADR-112) | [streamable-http-transport-stateless-bug.md](../../plans/semantic-search/archive/completed/streamable-http-transport-stateless-bug.md) |
| Code Quality | 1,693 TSDoc warnings → 0, type shortcuts eliminated | — |
| TSDoc Compliance | Non-standard tags fixed at source (462 files) | — |
| Response Tuning | Unified `formatToolResponse()`, type dedup, 94% ES payload reduction | [search-response-tuning.md](../../plans/semantic-search/archive/completed/search-response-tuning.md) |
| Env Architecture | `resolveEnv` pipeline, conditional Clerk keys, discriminated `RuntimeConfig` | [env-architecture-overhaul.md](../../plans/semantic-search/archive/completed/env-architecture-overhaul.md) |
| MCP Search WS1-WS4 | 3 new search tools wired, NL guidance, prompts, integration tests | [phase-3a-mcp-search-integration.md](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md) |
| OAuth Spec Compliance | All MCP methods require auth, ADR-113, ADR-056 superseded | [oauth-spec-compliance.md](../../plans/semantic-search/archive/completed/oauth-spec-compliance.md) |
| AS Metadata Endpoint | Backward-compatible `/.well-known/oauth-authorization-server` via local derivation | [oauth-validation-and-cursor-flows.plan.md](../../plans/semantic-search/active/oauth-validation-and-cursor-flows.plan.md) |

---

## Phase 3a — MCP Search Tools

**Plan**: [phase-3a-mcp-search-integration.md](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md)

### Current Tools

| Tool | Scopes/Purpose | SDK Methods |
|------|---------------|-------------|
| `search-sdk` | 5 scopes: lessons, units, threads, sequences, suggest | `searchLessons`, `searchUnits`, `searchThreads`, `searchSequences`, `suggest` |
| `browse-curriculum` | Faceted navigation (no free-text query) | `fetchSequenceFacets` |
| `explore-topic` | Compound parallel cross-scope discovery | `searchLessons` + `searchUnits` + `searchThreads` in parallel |
| `search` (old) | REST API lessons + transcripts | `get-search-lessons` + `get-search-transcripts` |

### Key Architecture

- **DI**: `SearchRetrievalService` interface breaks circular dependency.
  `searchRetrieval` is **required** on `UniversalToolExecutorDependencies`.
- **Fail-fast**: Servers fail at startup without ES credentials. Stub
  mode uses `createStubSearchRetrieval()`.
- **Dispatch**: Const object maps (not switches) for tool/scope dispatch.
- **`isAggregatedToolName`**: Derives from `AGGREGATED_TOOL_DEFS` via
  `value in AGGREGATED_TOOL_DEFS` — do NOT revert to a hardcoded list.
- **Response format**: Unified `formatToolResponse()` — all tools return
  2-item `content` array (summary + JSON), `structuredContent`, `_meta`.
- **`ToolAnnotations`/`ToolMeta`**: Derived from `ToolDescriptor`
  contract via indexed access types (not duplicated).
- **ES `_source` filtering**: Centralised exclude lists in
  `source-excludes.ts` (94% payload reduction for lessons).

### What Needs Doing (WS5)

Comparative testing confirms search-sdk is strictly superior.
WS5 replaces the old search and retires the generated REST wrappers.
See the plan for detailed implementation steps (5.1-5.5).

### Future: Phase 4 — Search Quality + Ecosystem

| Stream | Focus |
|--------|-------|
| GT Expansion | 30 → 80-100 ground truths |
| Search Quality Levels 2-4 | Document relationships → Modern ES → AI enhancement |
| SDK API | Filter testing across 17 subjects × 4 key stages |
| Subject Domain Model | Move subject knowledge to type-gen time |

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

### Active (Merge-Blocking)

| Document | Purpose |
|----------|---------|
| [Phase 3a plan](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md) | MCP search WS5 — replace old search |
| [OAuth spec compliance](../../plans/semantic-search/archive/completed/oauth-spec-compliance.md) | 401 on unauthenticated discovery (complete, archived) |
| [OAuth validation / Cursor flows](../../plans/semantic-search/active/oauth-validation-and-cursor-flows.plan.md) | **Primary OAuth plan** — spec-compliant smoke test + Cursor flow |
| [Widget KG tidy-up](../../plans/semantic-search/active/ontology-knowledge-graph-tidy-up.md) | Fix widget crash, migrate KG SVGs to ontology |
| [SDK workspace separation](../../plans/semantic-search/active/sdk-workspace-separation.md) | Type-gen / runtime split |
| [SDK split meta-plan](../../plans/semantic-search/active/sdk-workspace-separation-meta-plan.md) | Guide for improving SDK split plan |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Authoritative plan sequence |

### Post-Merge

| Document | Purpose |
|----------|---------|
| [Result pattern unification](../../plans/semantic-search/post-sdk/mcp-integration/mcp-result-pattern-unification.md) | `ToolExecutionResult` → `Result<T, E>` |
| [Env overhaul](../../plans/semantic-search/archive/completed/env-architecture-overhaul.md) | Env resolution pipeline (completed) |

### Architecture

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](/apps/oak-search-cli/docs/ARCHITECTURE.md) | Search pipeline architecture |
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and GT process |
| [ADR-082](/docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first search strategy |
| [ADR-107](/docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | Deterministic SDK / NL-in-MCP boundary |
| [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) | Per-request MCP transport |
| [ADR-113](/docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) | MCP spec-compliant auth for all methods |
| [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) | SDK Workspace Decomposition |
| [Plan 03 Phase 0](../../plans/sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md) | Aggregated tools type-gen migration (future) |
| [GT expansion](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) | Future GT expansion |
