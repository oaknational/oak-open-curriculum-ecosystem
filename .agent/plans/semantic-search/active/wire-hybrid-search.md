# Wire Hybrid Search into MCP Tools

**Stream**: mcp-integration
**Status**: 🔄 In Progress — all prerequisites complete
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)
**Origin**: Moved from `post-sdk/mcp-integration/wire-hybrid-search.md`
**Created**: 2026-01-17
**Last Updated**: 2026-02-16

---

## Overview

Wire the Search SDK's hybrid retrieval into the existing
MCP curriculum servers. This is the **first consumer** of
the Search SDK after extraction.

**Why first?**

1. **Validates SDK interface** — if MCP can't use it, the
   interface needs work
2. **Immediate value** — agents can search curriculum with
   full hybrid power (4-way RRF, ELSER, transcripts)
3. **Exposes issues early** — before other consumers build
   on the SDK

---

## Prerequisites

| Prerequisite | Status |
|--------------|--------|
| Search SDK extracted | ✅ `packages/sdks/oak-search-sdk/` |
| All services return `Result<T, E>` | ✅ Checkpoint E2 |
| Comprehensive TSDoc | ✅ Checkpoint E2 |
| All quality gates pass | ✅ |
| SDK validated against real ES (Phase 2e) | ✅ Complete (MRR=0.938, 8 GTs) |

---

## Scope

### In scope

| Capability | SDK Method | Description |
|------------|-----------|-------------|
| Search lessons | `retrieval.searchLessons()` | 4-way RRF hybrid search |
| Search units | `retrieval.searchUnits()` | 4-way RRF hybrid search |
| Search sequences | `retrieval.searchSequences()` | 2-way RRF hybrid search |
| Suggestions | `retrieval.suggest()` | Typeahead completions |
| Filter passthrough | All retrieval methods | Subject, key stage, tier, exam board |
| Compare with REST API search | — | Evaluate semantic search vs existing `search` aggregated tool |
| Replace if superior | — | If SDK-backed search outperforms REST API search, replace the composite search |

### Out of scope (for this plan)

- Admin or observability services in MCP (operator
  tooling, stays in CLI)
- Thread search in MCP (threads are conceptual progressions
  for curriculum designers, not the primary MCP search use
  case — can be added later)
- NL query mapping (stays in MCP tool examples per
  ADR-107, not in this wiring layer)
- Advanced intent classification (Level 4 future work)

---

## Architecture

### Current state

```text
MCP Tool Layer
    └── search (aggregated) → Oak REST API
        ├── get-search-lessons
        └── get-search-transcripts
```

The existing `search` aggregated tool in
`@oaknational/curriculum-sdk` calls the upstream
Oak REST API for lesson and transcript search.

**Key files**:

- Tool definition: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- Execution: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`
- Registration: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`
- Dispatch: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`
- Types: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`

### Target state (phase 1: add alongside)

```text
MCP Tool Layer
    ├── search (aggregated) → Oak REST API (unchanged)
    │
    └── semantic-search → Search SDK → Elasticsearch
        ├── searchLessons   (4-way RRF)
        ├── searchUnits     (4-way RRF)
        ├── searchSequences (2-way RRF)
        └── suggest         (completions)
```

The new `semantic-search` tool calls the Search SDK
directly, backed by Elasticsearch with ELSER sparse
vectors. The existing REST API search tool is
unchanged initially.

### Target state (phase 2: compare and replace)

```text
MCP Tool Layer
    └── search → Search SDK → Elasticsearch
        ├── searchLessons   (4-way RRF)
        ├── searchUnits     (4-way RRF)
        ├── searchSequences (2-way RRF)
        └── suggest         (completions)
```

If semantic search outperforms the REST API composite
search, the old `search` aggregated tool is replaced.
The REST API `get-search-*` individual tools may be
retained as data sources but no longer drive the
primary search experience.

### Key decision: NL stays in MCP

Per [ADR-107], the Search SDK remains deterministic.
Natural-language interpretation (e.g. inferring subject
from query text) is the MCP layer's responsibility,
expressed through comprehensive tool examples that
guide the agent.

[ADR-107]: /docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md

---

## Concrete Implementation Guide

### The aggregated tool pattern

The `semantic-search` tool follows the established
aggregated tool pattern. The existing `search` tool
(`aggregated-search/`) is the template.

**Files to create** in
`packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-semantic-search/`:

| File | Purpose | Template |
|------|---------|----------|
| `tool-definition.ts` | MCP metadata, JSON Schema input, annotations, `_meta` | `aggregated-search/tool-definition.ts` |
| `execution.ts` | `runSemanticSearchTool()` delegating to Search SDK | `aggregated-search/execution.ts` |
| `types.ts` | `SemanticSearchArgs` validated input type | `aggregated-search/types.ts` |
| `validation.ts` | `validateSemanticSearchArgs()` Zod validation | `aggregated-search/validation.ts` |
| `index.ts` | Barrel export | `aggregated-search/index.ts` |

**Files to modify**:

| File | Change |
|------|--------|
| `universal-tools/definitions.ts` | Add `'semantic-search': { ...SEMANTIC_SEARCH_TOOL_DEF, inputSchema: SEMANTIC_SEARCH_INPUT_SCHEMA }` to `AGGREGATED_TOOL_DEFS` |
| `universal-tools/executor.ts` | Add `case 'semantic-search':` to `executeAggregatedTool()` switch |

`AggregatedToolName` is derived from
`keyof typeof AGGREGATED_TOOL_DEFS`, so it updates
automatically when the definition map changes.

### Dependency injection: the Search SDK

**The central challenge**: The current
`UniversalToolExecutorDependencies` type centres on
`executeMcpTool` (calling REST API tools via
`OakApiPathBasedClient`). The semantic search tool
needs a completely different dependency — a Search SDK
instance backed by Elasticsearch.

**Solution**: Extend `UniversalToolExecutorDependencies`
with an optional `searchSdk` property (or create a
dedicated `SemanticSearchDependencies` type). The
aggregated tool's execution function receives the SDK
and delegates retrieval calls.

**SDK instantiation** happens in the MCP server wiring
layer — NOT in the SDK, NOT in the aggregated tool.
The wiring layer:

1. Reads ES credentials from environment
2. Creates an `@elastic/elasticsearch` `Client`
3. Calls `createSearchSdk({ deps: { esClient, logger }, config: { indexTarget: 'primary' } })`
4. Passes the SDK instance through the executor dependencies

### ES credentials in MCP servers

Both MCP servers need new environment variables:

| Variable | Purpose |
|----------|---------|
| `ELASTICSEARCH_URL` | ES cluster URL |
| `ELASTICSEARCH_API_KEY` | ES API key for authentication |

**STDIO server** (`apps/oak-curriculum-mcp-stdio/`):

- Add to `StdioEnv` interface and `loadRuntimeConfig()` in `src/runtime-config.ts`
- Create ES client and Search SDK in `wireDependencies()` in `src/app/wiring.ts`
- Pass through tool executors

**Streamable HTTP server** (`apps/oak-curriculum-mcp-streamable-http/`):

- Add to `EnvSchema` in `src/env.ts` (Zod-validated)
- Create ES client and Search SDK in wiring layer
- Pass through `registerHandlers()` options
- **Vercel deployment**: ES credentials must be added to Vercel environment

**Important**: The Search SDK itself never reads env
vars — URL and credentials must be passed as constructor
arguments. This protects the Oak-specific ES deployment.

### Error handling

SDK methods return `Result<T, RetrievalError>`.
`RetrievalError` is a discriminated union:

```text
RetrievalError =
  | { type: 'es_error',          message, statusCode? }
  | { type: 'timeout',           message }
  | { type: 'validation_error',  message }
  | { type: 'unknown',           message }
```

The MCP tool handler maps:

- `result.ok` → MCP content response (formatted results)
- `!result.ok` → MCP error response:
  `{ isError: true, content: [{ type: 'text', text: result.error.message }] }`

No silent error swallowing. Every error is surfaced.

### `@elastic/elasticsearch` as a dependency

The Search SDK declares `@elastic/elasticsearch` as a
peer dependency (^9.2.0). The MCP apps need it as a
direct dependency. This is a significant transitive
dependency — verify the Vercel bundle size impact for
the HTTP server.

---

## SDK API for MCP consumers

The MCP server creates an SDK instance via:

```typescript
import { createSearchSdk } from '@oaknational/oak-search-sdk';

const sdk = createSearchSdk({
  deps: { esClient, logger },
  config: { indexTarget: 'primary' },
});
```

All retrieval methods return `Result<T, RetrievalError>`:

```typescript
const result = await sdk.retrieval.searchLessons({
  text: 'how bones and muscles move the body',
  subject: 'science',
  keyStage: 'ks3',
});

if (!result.ok) {
  return { isError: true, content: [{ type: 'text', text: result.error.message }] };
}

// result.value: LessonsSearchResult
// result.value.results: readonly LessonResult[]
// result.value.total, result.value.took, result.value.timedOut
```

### Available retrieval methods

| Method | Params | Result |
|--------|--------|--------|
| `searchLessons` | `SearchLessonsParams` | `Result<LessonsSearchResult, RetrievalError>` |
| `searchUnits` | `SearchUnitsParams` | `Result<UnitsSearchResult, RetrievalError>` |
| `searchSequences` | `SearchSequencesParams` | `Result<SequencesSearchResult, RetrievalError>` |
| `suggest` | `SuggestParams` | `Result<SuggestionResponse, RetrievalError>` |
| `fetchSequenceFacets` | `FacetParams?` | `Result<SearchFacets, RetrievalError>` |

### Filter parameters

**Common filters (all search methods)**:

| Param | Type | Required |
|-------|------|----------|
| `text` | `string` | Yes |
| `subject` | `SearchSubjectSlug` | No |
| `keyStage` | `KeyStage` | No |
| `size` | `number` (1-100, default 25) | No |
| `from` | `number` (default 0) | No |

**Lesson-specific filters**:

| Param | Type | Notes |
|-------|------|-------|
| `unitSlug` | `string` | Filter to specific unit |
| `tier` | `string` | KS4 maths/science (foundation/higher) |
| `examBoard` | `string` | KS4 only |
| `examSubject` | `string` | biology/chemistry/physics |
| `ks4Option` | `string` | KS4 option programme slug |
| `year` | `string` | Year group |
| `threadSlug` | `string` | Curriculum thread slug |
| `highlight` | `boolean` (default true) | Include highlights |

**Unit-specific filters**:

| Param | Type |
|-------|------|
| `minLessons` | `number` |
| `highlight` | `boolean` |

**Sequence-specific filters**:

| Param | Type |
|-------|------|
| `phaseSlug` | `string` |
| `category` | `string` |
| `includeFacets` | `boolean` |

### MCP tool input schema design

The `semantic-search` tool input schema should expose
a **unified interface** that selects scope and passes
filters. Design options:

1. **Single tool with `scope` parameter** — one
   `semantic-search` tool where the user specifies
   `scope: 'lessons' | 'units' | 'sequences'` and the
   handler dispatches to the appropriate SDK method.
   Simpler for agents — one tool to learn.

2. **Separate tools per scope** — `semantic-search-lessons`,
   `semantic-search-units`, `semantic-search-sequences`.
   More explicit, but more tools to discover.

**Recommendation**: Option 1 (single tool with scope).
The existing `search` tool is a single aggregated tool.
Keep consistency. The MCP tool handler dispatches
internally based on scope.

---

## Execution Phases (TDD)

### WS1 — Tool definition and tests (RED)

| Task | Details |
|------|---------|
| Define input schema | Zod-validated, matching SDK params. Scope param + common filters + scope-specific filters |
| Define tool metadata | Description, annotations, `_meta`, security schemes |
| Write unit tests | `validateSemanticSearchArgs()` — valid and invalid inputs |
| Write integration tests | Aggregated tool returns results from a mocked SDK instance |
| Tests MUST fail | Tool does not exist yet |

### WS2 — Wiring and implementation (GREEN)

| Task | Details |
|------|---------|
| Add dependencies | `@oaknational/oak-search-sdk` and `@elastic/elasticsearch` to MCP apps |
| Add ES env config | `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY` in both servers' env/runtime-config |
| Extend executor deps | Add optional `searchSdk` (or equivalent) to `UniversalToolExecutorDependencies` |
| Create SDK instance | In wiring layer, from env credentials |
| Implement tool handler | `runSemanticSearchTool()` dispatching by scope to SDK retrieval methods |
| Register tool | Add to `AGGREGATED_TOOL_DEFS` and `executeAggregatedTool()` |
| Both servers | Ensure STDIO and Streamable HTTP servers both pass the SDK through |
| Tests MUST pass | Integration tests with mocked SDK |

### WS3 — Tool examples and documentation (REFACTOR)

| Task | Details |
|------|---------|
| Tool examples | Comprehensive examples mapping NL intent to SDK calls (per ADR-107) |
| MCP tool metadata | Description, annotations, invocation status |
| Documentation | Update workspace READMEs, ARCHITECTURE docs |
| TSDoc | Comprehensive TSDoc on all new functions |

### WS4 — Quality gates

| Task | Details |
|------|---------|
| Full quality gate chain | All gates, from repo root, in order |
| Verify existing tools | Existing MCP tools unaffected |
| Update plans and roadmap | Mark Phase 3 tasks complete |

### WS5 — Compare and replace

| Task | Details |
|------|---------|
| Run comparable queries | Both `search` (REST) and `semantic-search` (SDK) |
| Compare quality | Relevance, coverage, latency |
| Replace if superior | Remove or demote old `search` aggregated tool |
| Update tool descriptions | Reflect new search as primary |
| Full quality gate chain | Again, after replacement |

---

## Success Criteria

- [ ] MCP `semantic-search` tool returns Elasticsearch
      results via the SDK
- [ ] All filter parameters are passed through correctly
- [ ] `Result<T, E>` errors are surfaced as MCP error
      responses (never swallowed)
- [ ] Existing MCP curriculum tools continue to work
      unchanged
- [ ] Integration tests cover success and error paths
- [ ] Tool examples guide agents to use the tool
      effectively
- [ ] Semantic search compared with REST API search on
      representative queries
- [ ] If superior, REST API composite search replaced
      with SDK-backed search
- [ ] All quality gates pass

---

## Risk Factors

| Risk | Mitigation |
|------|------------|
| ES credentials in Vercel deployment | Add to Vercel environment before deploying HTTP server |
| `@elastic/elasticsearch` bundle size on Vercel | Verify serverless function size stays within limits |
| Tool coexistence confusion | Clear, differentiated tool descriptions during phase 1 |
| ES cluster availability | Search SDK returns `Result` errors — MCP surfaces them cleanly |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../archive/completed/search-sdk-cli.plan.md](../archive/completed/search-sdk-cli.plan.md) | SDK extraction (complete) |
| [../roadmap.md](../roadmap.md) | Master roadmap |
| [ADR-107] | Deterministic SDK / NL-in-MCP boundary |
| [Search SDK README](/packages/sdks/oak-search-sdk/README.md) | SDK documentation |
| [Aggregated search tool](/packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/) | Template for the new tool |
| [Universal tools](/packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/) | Registration and dispatch |
| [STDIO wiring](/apps/oak-curriculum-mcp-stdio/src/app/wiring.ts) | DI for STDIO server |
| [HTTP handlers](/apps/oak-curriculum-mcp-streamable-http/src/handlers.ts) | Registration for HTTP server |

---

## Foundation Documents

Before starting work, re-read:

1. [rules.md](../../../directives/rules.md)
2. [testing-strategy.md](../../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../../directives/schema-first-execution.md)
