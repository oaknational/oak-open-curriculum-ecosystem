# Wire Hybrid Search into MCP Tools

**Stream**: mcp-integration  
**Status**: ⏸️ Blocked by SDK validation (Phase 2e)  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-17  
**Last Updated**: 2026-02-11

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
| SDK validated against real ES (Phase 2e) | 📋 Pending |

**Note**: The SDK must be validated against real
Elasticsearch before wiring into MCP. The extraction
involved complete re-architecture (DI, Result pattern,
service boundaries). See Phase 2e in the
[roadmap](../../roadmap.md).

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

### Also in scope

| Capability | Description |
|------------|-------------|
| Compare with REST API search | Evaluate semantic search vs existing `search` aggregated tool |
| Replace if superior | If SDK-backed search outperforms REST API search, replace the composite search |

### Out of scope (for this plan)

- Admin or observability services in MCP (operator
  tooling, stays in CLI)
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
  // result.error: { type: 'es_error' | 'timeout' | ... , message: string }
  return { isError: true, content: [{ type: 'text', text: result.error.message }] };
}

// result.value: LessonsSearchResult
// result.value.results: readonly LessonResult[]
// result.value.meta: { total, took, timedOut }
```

### Available retrieval methods

| Method | Params | Result |
|--------|--------|--------|
| `searchLessons` | `SearchLessonsParams` | `Result<LessonsSearchResult, RetrievalError>` |
| `searchUnits` | `SearchUnitsParams` | `Result<UnitsSearchResult, RetrievalError>` |
| `searchSequences` | `SearchSequencesParams` | `Result<SequencesSearchResult, RetrievalError>` |
| `suggest` | `SuggestParams` | `Result<SuggestionResponse, RetrievalError>` |
| `fetchSequenceFacets` | `FacetParams?` | `Result<SearchFacets, RetrievalError>` |

### Filter parameters (all optional)

| Param | Type | Available on |
|-------|------|-------------|
| `subject` | `SearchSubjectSlug` | All search methods |
| `keyStage` | `KeyStage` | All search methods |
| `tier` | `string` | Lessons only (KS4 maths/science) |
| `examBoard` | `string` | Lessons only (KS4) |
| `unitSlug` | `string` | Lessons only |
| `highlight` | `boolean` | Lessons, units |
| `phaseSlug` | `string` | Sequences, suggest |

---

## Integration approach

### Which MCP server?

Both curriculum MCP servers
(`oak-curriculum-mcp-stdio` and
`oak-curriculum-mcp-streamable-http`) should support
semantic search. The implementation should be shared
— either in a common module or in the curriculum SDK.

### Wiring

1. **Dependencies**: Add `@oaknational/oak-search-sdk`
   and `@elastic/elasticsearch` to the MCP app(s)
2. **Configuration**: ES connection URL and credentials
   read from environment variables in the MCP server's
   wiring layer (following existing env patterns in
   `runtime-config.ts` / `env.ts`). **The Search SDK
   itself never reads env vars** — URL and credentials
   must be passed as constructor arguments to protect
   the Oak-specific ES deployment.
3. **SDK instance**: Create via `createSearchSdk()` in
   the wiring layer, passing ES URL and credentials
   explicitly, alongside the existing
   `createOakPathBasedClient()`
4. **Tool registration**: Register semantic search tool
   handlers that delegate to the SDK, following the
   existing tool registration pattern

### Error handling

SDK methods return `Result<T, RetrievalError>`.
The MCP tool handler maps:

- `ok` → MCP content response (formatted results)
- `err` → MCP error response with error type and message

No silent error swallowing. Every error is surfaced.

---

## Execution phases (TDD)

### Phase 1 — Tool definition and tests (RED)

- Define the `semantic-search` MCP tool input schema
  (Zod-validated, matching SDK params)
- Write integration tests asserting the tool returns
  results from a mocked SDK
- Tests MUST fail (tool doesn't exist yet)

### Phase 2 — Wiring and implementation (GREEN)

- Add dependencies to MCP app package.json
- Add ES configuration to env/runtime-config
- Create SDK instance in wiring layer
- Implement tool handler delegating to SDK retrieval
- Register tool alongside existing tools
- Tests MUST pass

### Phase 3 — Tool examples and documentation (REFACTOR)

- Add comprehensive tool examples mapping natural
  language intent to SDK calls (per ADR-107)
- Document the tool in MCP tool metadata
- Update ARCHITECTURE docs if needed

### Phase 4 — Quality gates

- Run full quality gate chain
- Verify existing MCP tools unaffected
- Update plans and roadmap

### Phase 5 — Compare and replace

- Run comparable queries through both `search` (REST API)
  and `semantic-search` (SDK) tools
- Compare result quality: relevance, coverage, latency
- If semantic search is superior (expected), replace the
  REST API composite search with SDK-backed search
- Remove or demote the old `search` aggregated tool
- Update tool descriptions and examples
- Run full quality gate chain again

---

## Success criteria

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

## Related documents

| Document | Purpose |
|----------|---------|
| [../../archive/completed/search-sdk-cli.plan.md](../../archive/completed/search-sdk-cli.plan.md) | SDK extraction (complete) |
| [../../roadmap.md](../../roadmap.md) | Master roadmap |
| [ADR-107] | Deterministic SDK / NL-in-MCP boundary |
| [Search SDK README](/packages/sdks/oak-search-sdk/README.md) | SDK documentation |

---

## Foundation documents

Before starting work, re-read:

1. [rules.md](../../../../directives/rules.md)
2. [testing-strategy.md](../../../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../../../directives/schema-first-execution.md)
