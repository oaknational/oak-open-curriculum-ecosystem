# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-21

---

## Immediate Task: WS5 — Replace Old Search with Search SDK

**Plan**: [phase-3a-mcp-search-integration.md](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md)

WS1-WS4 are complete. Three new search tools (`search-sdk`,
`browse-curriculum`, `explore-topic`) are implemented, tested,
and working. Comparative testing confirms they are strictly
superior to the old REST-based `search` tool.

**WS5 replaces the old search and retires the generated REST
wrappers. There are four pending todos:**

1. **WS5.1** (`ws5-skip-old-gen`): Add `SKIPPED_PATHS` to
   `mcp-tool-generator.ts` to exclude `/search/lessons` and
   `/search/transcripts` from generated tools. TDD.

2. **WS5.2** (`ws5-promote-search`): Promote `search-sdk` to
   `search` in `AGGREGATED_TOOL_DEFS`. Delete
   `aggregated-search/` module. Update executor dispatch and
   all cross-references. TDD.

3. **WS5.4** (`ws5-quality-gates`): Full quality gate chain
   after replacement.

4. **ADR-116** (`adr-116-env-resolution`): Write ADR-116 for
   the `resolveEnv` pipeline architecture. This is a documentation
   task, independent of WS5 code changes.

The plan file has detailed implementation steps for each
(sections 5.1-5.5). Read the plan before starting.

---

## Two Merge Blockers Remain

The `feat/semantic_search_deployment` branch requires two
workstreams before it can merge:

1. **WS5** (this task) — replace old search
2. **SDK workspace separation** — split `curriculum-sdk` into
   type-gen and runtime workspaces
   ([plan](../../plans/semantic-search/active/sdk-workspace-separation.md))

All other merge blockers are complete (OAuth, proxy, auth).

**Roadmap**: [roadmap.md](../../plans/semantic-search/roadmap.md)

---

## Current Search Tool Landscape

Understanding these four tools is essential for WS5:

| Tool | Module | Backend | Status |
|------|--------|---------|--------|
| `search` (old) | `aggregated-search/` | REST API (`get-search-lessons` + `get-search-transcripts`) | **To be deleted in WS5** |
| `search-sdk` (new) | `aggregated-search-sdk/` | Elasticsearch via Search SDK (5 scopes) | **To be promoted to `search` in WS5** |
| `browse-curriculum` | `aggregated-browse/` | `fetchSequenceFacets` | Working, no changes needed |
| `explore-topic` | `aggregated-explore/` | Parallel `searchLessons` + `searchUnits` + `searchThreads` | Working, no changes needed |

### Key Files for WS5

| File | Role in WS5 |
|------|-------------|
| `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts` | Add `SKIPPED_PATHS` here (5.1) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Rename `search-sdk` → `search` (5.2) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` | Update dispatch map (5.2) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/` | **Delete entirely** (5.2) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/` | Promoted to `search` (5.2) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/tool-guidance-data.ts` | Update tool name references (5.2) |

### Architecture Context

- **DI**: `SearchRetrievalService` interface breaks circular dependency.
  `searchRetrieval` is **required** on `UniversalToolExecutorDependencies`.
- **Fail-fast**: Servers fail at startup without ES credentials. Stub
  mode uses `createStubSearchRetrieval()`.
- **Dispatch**: Const object maps (not switches) for tool/scope dispatch.
- **`isAggregatedToolName`**: Derives from `AGGREGATED_TOOL_DEFS` via
  `value in AGGREGATED_TOOL_DEFS` — do NOT revert to a hardcoded list.
- **Response format**: Unified `formatToolResponse()` — all tools return
  2-item `content` array (summary + JSON), `structuredContent`, `_meta`.
- **Scopes via `SCOPES_SUPPORTED`**: All aggregated tool definitions
  import OAuth scopes from the stable re-export at
  `src/mcp/scopes-supported.ts` (not hardcoded). Follow this pattern.

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
system split across five workspaces:

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

\* Single-query index — mechanism check only.

**Protocol**: [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

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

## Completed Work (Reference Only)

All archived plans: `.agent/plans/semantic-search/archive/completed/`

| Work | Key Outcome | Reference |
|------|------------|-----------|
| MCP Search WS1-WS4 | 3 new search tools wired, NL guidance, prompts, tests | This plan |
| Proxy OAuth AS | Transparent proxy to Clerk, Cursor works (ADR-115) | [ADR-115](/docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md) |
| OAuth Spec Compliance | All MCP methods require auth (ADR-113) | [ADR-113](/docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) |
| Transport Bug Fix | Per-request transport pattern (ADR-112) | [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) |
| SDK Extraction | 16 I/O methods returning `Result<T, E>` | [plan](../../plans/semantic-search/archive/completed/search-sdk-cli.plan.md) |
| Fail-Fast ES Credentials | Silent degradation removed | [plan](../../plans/semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md) |
| Env Architecture | `resolveEnv` pipeline, discriminated `RuntimeConfig` | [plan](../../plans/semantic-search/archive/completed/env-architecture-overhaul.md) |
| Code Quality | TSDoc warnings 0, type shortcuts eliminated | -- |

---

## Related Documents

### Immediately Relevant to WS5

| Document | Why |
|----------|-----|
| [Phase 3a plan](../../plans/semantic-search/active/phase-3a-mcp-search-integration.md) | **The plan** -- read WS5 section before starting |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Overall milestone sequence |
| [ADR-107](/docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | Deterministic SDK / NL-in-MCP boundary (governs tool descriptions) |

### Background Architecture

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](/apps/oak-search-cli/docs/ARCHITECTURE.md) | Search pipeline architecture |
| [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) | SDK Workspace Decomposition |
| [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) | Per-request MCP transport |
| [ADR-113](/docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) | MCP spec-compliant auth |
| [ADR-115](/docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md) | Proxy OAuth AS for Cursor |
