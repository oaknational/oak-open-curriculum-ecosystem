---
name: Phase 3a MCP Search Integration
overview: Build a complete search experience layer for the MCP curriculum servers, exposing all four search indexes plus suggestions and browsing, with compound tools for teacher workflows and rich NL guidance for agents.
todos:
  - id: ws1-search-tool
    content: "WS1 (RED): search tool -- types, validation, tool definition, execution stub, unit + integration tests for all 5 scopes (lessons, units, threads, sequences, suggest). Tests MUST fail."
    status: completed
  - id: ws1-browse-tool
    content: "WS1 (RED): browse-curriculum tool -- types, validation, tool definition, execution stub, unit + integration tests. Tests MUST fail."
    status: completed
  - id: ws1-explore-tool
    content: "WS1 (RED): explore-topic compound tool -- types, validation, tool definition, execution stub, integration tests (parallel multi-index). Tests MUST fail."
    status: completed
  - id: ws2-deps
    content: "WS2 (GREEN): Add @oaknational/result to curriculum-sdk (search-sdk blocked by circular dep, solved via DI); add oak-search-sdk + @elastic/elasticsearch to both MCP servers."
    status: completed
  - id: ws2-di-wiring
    content: "WS2 (GREEN): Extend UniversalToolExecutorDependencies with optional searchRetrieval. Add ES env config to both servers. Create SDK instances in wiring layers. Dependency inversion via SearchRetrievalService interface."
    status: completed
  - id: ws2-implement-search
    content: "WS2 (GREEN): Implement search tool -- dispatch by scope to all 5 SDK methods, Result-to-CallToolResult mapping, register in AGGREGATED_TOOL_DEFS + executor dispatch map."
    status: completed
  - id: ws2-implement-browse
    content: "WS2 (GREEN): Implement browse-curriculum tool -- fetchSequenceFacets, format structured overview."
    status: completed
  - id: ws2-implement-explore
    content: "WS2 (GREEN): Implement explore-topic compound tool -- parallel multi-index search, unified topic map."
    status: completed
  - id: ws2-tests-pass
    content: "WS2 (GREEN): All SDK tests pass (1241 across 113 files). Both server unit/integration tests pass."
    status: completed
  - id: ws3-nl-guidance
    content: "WS3 (REFACTOR): NL guidance layer -- tool-guidance-data.ts updated with search-sdk, explore-topic, browse-curriculum in discovery category, workflow references, new workflows (exploreTopic, discoverCurriculum), tips. Extracted workflows to tool-guidance-workflows.ts."
    status: completed
  - id: ws3-help-prompts
    content: "WS3 (REFACTOR): tool-guidance-data.ts extended for new tools. mcp-prompts.ts updated: find-lessons, lesson-planning, progression-map reference search-sdk; added explore-curriculum and learning-progression prompts (5 total). Message generators extracted to mcp-prompt-messages.ts."
    status: completed
  - id: ws3-docs-tsdoc
    content: "WS3 (REFACTOR): TSDoc audit (detached block in validation.ts fixed). READMEs updated for curriculum-sdk (search tools section), STDIO server (search tools optional section), HTTP server (search tools + ES factory docs)."
    status: completed
  - id: ws4-gates
    content: "WS4: Full quality gate chain (type-gen through smoke:dev:stub). Phase 3a regression in server.e2e.test.ts fixed (tool list parity). 17 pre-existing E2E failures documented."
    status: completed
  - id: ws4-reviews
    content: "WS4: Sub-agent reviews (code, architecture, test, config). All approved."
    status: completed
  - id: ws4-e2e-preexisting
    content: "WS4 follow-up: Fix 17 E2E failures — root cause was StreamableHTTPServerTransport single-client-per-instance. Fixed by creating fresh createApp() per test."
    status: completed
  - id: ws4-test-gaps
    content: "WS4 follow-up: search-retrieval-factory.ts has 9 integration tests (DI with FakeClient brand type). browse formatting.unit.test.ts has 7 unit tests (createFacet/createFacets helpers for generated SequenceFacet type). Mock shapes verified against generated types."
    status: completed
  - id: fail-fast-es-creds
    content: "Pre-WS5: Fail fast on missing Elasticsearch credentials — remove six layers of silent degradation. Server must fail at startup if ES creds missing, not return 'not configured' at runtime. See fail-fast-elasticsearch-credentials.md."
    status: completed
  - id: env-architecture-overhaul
    content: "Pre-WS5: Environment architecture overhaul complete — resolveEnv pipeline, conditional Clerk keys, discriminated RuntimeConfig. Archived. STDIO alignment deferred to stdio-http-server-alignment.md."
    status: completed
  - id: adr-116-env-resolution
    content: "Pre-WS5: Write ADR-116 for the resolveEnv pipeline architecture — source hierarchy with non-mutating dotenv.parse, Result<T, E> return, conditional Clerk keys via superRefine, discriminated RuntimeConfig union. Supersedes ADR-016 (original dotenv decision). (ADR-113 is taken — MCP spec-compliant auth.)"
    status: pending
  - id: ws5-compare
    content: "WS5: Compare new search tools vs old REST API search on representative queries."
    status: completed
  - id: ws5-skip-old-gen
    content: "WS5.1: Add SKIPPED_PATHS to mcp-tool-generator.ts to exclude /search/lessons and /search/transcripts from generated tools. TDD."
    status: pending
  - id: ws5-promote-search
    content: "WS5.2: Promote search-sdk to search — rename in AGGREGATED_TOOL_DEFS, delete aggregated-search/ module, update executor dispatch, update all cross-references. TDD."
    status: pending
  - id: ws5-quality-gates
    content: "WS5.4: Full quality gate chain after replacement (type-gen, build, type-check, lint, test, smoke)."
    status: pending
isProject: false
---

# Phase 3a: MCP Search Integration — Execution Plan

This is not a simple API adapter. This is an experience layer with two users: the human teacher and the AI agent. The tool architecture must serve both.

## Design Principles

1. **Every index gets exposed.** Four search indexes (lessons, units, threads, sequences) plus completion suggestions and faceted browsing = six retrieval capabilities. All must be accessible.
2. **Passthrough AND compound.** Individual scope access for precision. Multi-index tools for discovery. Teachers often don't know which scope they need.
3. **NL guidance is first-class.** Per ADR-107, the SDK is deterministic. The MCP layer teaches agents how to map "find me KS3 science lessons about cells" into structured search parameters. This happens through tool descriptions, examples, and cross-tool workflow guidance.
4. **Two users.** Agent-facing: rich descriptions, NL mapping examples, "Use this when" / "Do NOT use" patterns, prerequisite guidance. Human-facing: meaningful summaries, formatted results, next-action suggestions.

---

## Tool Architecture

### The Search Landscape

```mermaid
graph TD
    subgraph indexes [Four ES Indexes]
        lessons["oak_lessons (12,833 docs, 4-way RRF)"]
        units["oak_unit_rollup (1,665 docs, 4-way RRF)"]
        threads["oak_threads (164 docs, 2-way RRF)"]
        sequences["oak_sequences (30 docs, 2-way RRF)"]
    end

    subgraph tools [MCP Search Tools]
        search["search (scope param)"]
        browse["browse-curriculum"]
        explore["explore-topic (compound)"]
    end

    search -->|"scope: lessons"| lessons
    search -->|"scope: units"| units
    search -->|"scope: threads"| threads
    search -->|"scope: sequences"| sequences
    search -->|"scope: suggest"| lessons
    search -->|"scope: suggest"| units
    search -->|"scope: suggest"| sequences
    browse --> facets["oak_sequence_facets"]
    explore --> lessons
    explore --> units
    explore --> threads
```

### Tool 1: `search` -- primary search across all indexes

**Replaces:** the old REST-based `search` aggregated tool (after validation in WS5).

**Scopes** (5):

| Scope       | SDK Method        | Index             | Strategy   | When to use                              |
| ----------- | ----------------- | ----------------- | ---------- | ---------------------------------------- |
| `lessons`   | `searchLessons`   | `oak_lessons`     | 4-way RRF  | Find specific lessons on a topic         |
| `units`     | `searchUnits`     | `oak_unit_rollup` | 4-way RRF  | Find teaching units that cover a concept |
| `threads`   | `searchThreads`   | `oak_threads`     | 2-way RRF  | Find learning progressions across years  |
| `sequences` | `searchSequences` | `oak_sequences`   | 2-way RRF  | Find curriculum programme structures     |
| `suggest`   | `suggest`         | varies            | Completion | Typeahead as the user types              |

**Input schema:** `text` (required), `scope` (required), plus common filters (`subject`, `keyStage`, `size`, `from`) and scope-specific filters (lesson: `unitSlug`, `tier`, `examBoard`, `year`, `threadSlug`, `highlight`; unit: `minLessons`, `highlight`; sequence: `phaseSlug`, `category`; suggest: `limit`).

**NL-to-structured examples** (in tool description, per ADR-107):

| Teacher says                                    | Maps to                                                                             |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| "Find KS3 science lessons about photosynthesis" | `{ scope: 'lessons', text: 'photosynthesis', subject: 'science', keyStage: 'ks3' }` |
| "What units cover fractions in primary maths?"  | `{ scope: 'units', text: 'fractions', subject: 'maths', keyStage: 'ks2' }`          |
| "What's the learning progression for algebra?"  | `{ scope: 'threads', text: 'algebra', subject: 'maths' }`                           |
| "Show me secondary science programmes"          | `{ scope: 'sequences', text: 'science', keyStage: 'ks3' }`                          |
| "Suggest lessons starting with 'photo'"         | `{ scope: 'suggest', text: 'photo', scope: 'lessons' }`                             |
| "Find lessons on the Romans for Year 3"         | `{ scope: 'lessons', text: 'Romans', year: '3' }`                                   |
| "KS4 higher tier maths on trigonometry"         | `{ scope: 'lessons', text: 'trigonometry', keyStage: 'ks4', tier: 'higher' }`       |

**Agent workflow guidance** (in description):

- "Start with `scope: 'lessons'` for specific content. Use `scope: 'units'` for broader topic coverage. Use `scope: 'threads'` to understand how concepts build across years."
- "For learning progressions, search threads first, then call `get-thread-progressions` for the full ordered sequence."
- "For prerequisites, search threads for the topic, then call `get-prerequisite-graph` to see what comes before."
- "Combine with `fetch` to get full lesson details (objectives, keywords, misconceptions, quiz questions)."

### Tool 2: `browse-curriculum` -- structured navigation

**Backed by:** `fetchSequenceFacets()` from the Search SDK.

**Purpose:** When the teacher wants to browse what's available, not search for something specific. Returns structured facet data: subjects, key stages, units, lesson counts.

**Input schema:** `subject` (optional), `keyStage` (optional).

**When to use:** "What's available in KS2 science?", "Show me the maths curriculum", "What subjects can I browse?"

**Why separate from search:** Different interaction model. No free-text query. Returns categories and counts, not ranked results. Useful for initial orientation.

### Tool 3: `explore-topic` -- compound multi-index discovery

**Purpose:** The "I don't know what I'm looking for yet" tool. Searches lessons, units, AND threads in parallel for a topic, returning a unified topic map.

**Input schema:** `text` (required), `subject` (optional), `keyStage` (optional).

**Implementation:** Calls `searchLessons`, `searchUnits`, `searchThreads` in parallel (small `size`, e.g. 5 per scope). Formats a unified response:

```text
Topic: "photosynthesis"
Found across the curriculum:
- 12 lessons (top 5 shown)
- 3 units covering this topic
- 2 learning progression threads

Lessons:
  1. "Photosynthesis and leaf structure" (KS3 Science)
  2. ...

Units:
  1. "Plants and photosynthesis" (KS3 Science, 8 lessons)
  2. ...

Learning threads:
  1. "Biology: Cells and organisms" (Year 7-11)
  2. ...

Next steps: Use search with scope 'lessons' for more results,
or fetch a specific lesson for full details.
```

**When to use:** "What does Oak have about volcanos?", "I want to teach about electricity", "Explore fractions across the curriculum."

**Why compound:** Agents often don't know which scope is relevant. This gives a cross-curriculum overview in one call, then the agent can drill down.

---

## Dependency Strategy

Add search SDK as a direct dependency of curriculum-sdk for now. The cross-SDK dependency (curriculum-sdk -> search-sdk, search-sdk peer-deps curriculum-sdk) is a known concern. pnpm resolves it in workspace mode. We will solve this properly later -- extracting shared types to `packages/core/` is easier once we have working code to refactor.

**Dependencies to add:**

- `packages/sdks/oak-curriculum-sdk/package.json`: `@oaknational/result`, `@oaknational/oak-search-sdk`
- `apps/oak-curriculum-mcp-stdio/package.json`: `@oaknational/oak-search-sdk`, `@elastic/elasticsearch`
- `apps/oak-curriculum-mcp-streamable-http/package.json`: `@oaknational/oak-search-sdk`, `@elastic/elasticsearch`

---

## Data Flow

```mermaid
sequenceDiagram
    participant Teacher as Teacher / Agent
    participant MCP as MCP Server
    participant Executor as UniversalToolExecutor
    participant Handler as Tool Handler
    participant SDK as SearchSdk.retrieval
    participant ES as Elasticsearch

    Note over Teacher,ES: search tool (single scope)
    Teacher->>MCP: search { scope: 'lessons', text: '...', subject: '...' }
    MCP->>Executor: executor('search', args)
    Executor->>Handler: handleSearchTool(input, deps)
    Handler->>SDK: retrieval.searchLessons(params)
    SDK->>ES: 4-way RRF query
    ES-->>SDK: hits
    SDK-->>Handler: Result ok
    Handler-->>Teacher: CallToolResult with summary + structuredContent

    Note over Teacher,ES: explore-topic (compound, parallel)
    Teacher->>MCP: explore-topic { text: 'volcanos' }
    MCP->>Executor: executor('explore-topic', args)
    Executor->>Handler: handleExploreTool(input, deps)
    par Parallel search
        Handler->>SDK: searchLessons
        Handler->>SDK: searchUnits
        Handler->>SDK: searchThreads
    end
    SDK-->>Handler: 3x Result ok
    Handler->>Handler: merge into topic map
    Handler-->>Teacher: CallToolResult with unified overview
```

---

## WS1 -- Tool Definitions and Tests (RED)

All tests MUST FAIL at the end of WS1.

### 1.1: `search` tool module

**Directory:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/`

(Named `aggregated-search-sdk` to distinguish from the existing `aggregated-search` REST-based tool during the transition period.)

| File                 | Purpose                                                                | Template                               |
| -------------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| `types.ts`           | `SearchSdkArgs` type with `scope` discriminator, `SearchSdkScope`      | `aggregated-search/types.ts`           |
| `validation.ts`      | `validateSearchSdkArgs()` with Zod                                     | `aggregated-search/validation.ts`      |
| `tool-definition.ts` | `SEARCH_SDK_TOOL_DEF`, `SEARCH_SDK_INPUT_SCHEMA` with rich NL examples | `aggregated-search/tool-definition.ts` |
| `execution.ts`       | `runSearchSdkTool()` stub (throws)                                     | `aggregated-search/execution.ts`       |
| `formatting.ts`      | `formatSearchResults()` per-scope result formatting                    | new                                    |
| `index.ts`           | Barrel export                                                          | `aggregated-search/index.ts`           |

`**SearchSdkScope`:** `'lessons' | 'units' | 'threads' | 'sequences' | 'suggest'`

**Key type design:** `SearchSdkArgs` has a `scope` field plus all filter fields. Scope-specific filters are optional and validated in the handler (not at the Zod level -- keeps the schema simple for agents).

**Tests:**

- `validation.unit.test.ts` -- valid/invalid inputs for all 5 scopes, filter validation, subject/keyStage enum validation
- `execution.integration.test.ts` -- fake `RetrievalService`, test all 5 scope dispatches (success + error), filter passthrough, missing deps error
- `formatting.unit.test.ts` -- result formatting per scope, summary generation, empty results

### 1.2: `browse-curriculum` tool module

**Directory:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/`

| File                 | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `types.ts`           | `BrowseArgs` (subject?, keyStage?)       |
| `validation.ts`      | `validateBrowseArgs()`                   |
| `tool-definition.ts` | `BROWSE_TOOL_DEF`, `BROWSE_INPUT_SCHEMA` |
| `execution.ts`       | `runBrowseTool()` stub                   |
| `index.ts`           | Barrel export                            |

**Tests:**

- `validation.unit.test.ts` -- optional filters, invalid subject/keyStage
- `execution.integration.test.ts` -- fake retrieval, test facet response formatting

### 1.3: `explore-topic` compound tool module

**Directory:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/`

| File                 | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `types.ts`           | `ExploreArgs` (text, subject?, keyStage?)     |
| `validation.ts`      | `validateExploreArgs()`                       |
| `tool-definition.ts` | `EXPLORE_TOOL_DEF`, `EXPLORE_INPUT_SCHEMA`    |
| `execution.ts`       | `runExploreTool()` stub                       |
| `formatting.ts`      | `formatTopicMap()` merges multi-index results |
| `index.ts`           | Barrel export                                 |

**Tests:**

- `validation.unit.test.ts` -- text required, optional filters
- `execution.integration.test.ts` -- fake retrieval, test parallel dispatch, test merge logic, test partial failures (one scope errors, others succeed)
- `formatting.unit.test.ts` -- topic map formatting, empty scopes, mixed results

### 1.4: Run tests -- ALL must fail

```bash
pnpm test --filter @oaknational/curriculum-sdk
```

---

## WS2 -- Wiring and Implementation (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: Add dependencies

```bash
# curriculum-sdk
pnpm add @oaknational/result @oaknational/oak-search-sdk --filter @oaknational/curriculum-sdk

# Both MCP servers
pnpm add @oaknational/oak-search-sdk @elastic/elasticsearch --filter oak-curriculum-mcp-stdio
pnpm add @oaknational/oak-search-sdk @elastic/elasticsearch --filter oak-curriculum-mcp-streamable-http

pnpm install
```

### 2.2: Extend `UniversalToolExecutorDependencies`

**File:** [packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts) (line 33)

Add optional `searchRetrieval: RetrievalService` property. When absent, all search tools return a fail-fast error.

### 2.3: Implement `search` tool

**File:** `aggregated-search-sdk/execution.ts`

Dispatch by scope to the 5 SDK methods. Each handler:

- Builds scope-specific SDK params from `SearchSdkArgs`
- Calls the appropriate SDK method
- Maps `Result<T, RetrievalError>` to `CallToolResult` via `formatSearchResults()`
- Error: `formatError(result.error.message)` with `RetrievalError.type` for context

**Result formatting** (`formatting.ts`):

- Human-readable summary: "Found 15 lessons matching 'photosynthesis' in KS3 Science"
- `structuredContent`: full result data for model reasoning + widget display
- `_meta`: toolName, query, timestamp for widget routing
- Scope-specific: lessons show title/subject/keyStage/highlights; units show title/lessonCount; threads show title/subjectSlugs/unitCount; sequences show title/phaseTitle

### 2.4: Implement `browse-curriculum` tool

**File:** `aggregated-browse/execution.ts`

Calls `retrieval.fetchSequenceFacets(params)`. Formats the `SearchFacets` response into a structured overview showing subjects, key stages, units, and lesson counts.

### 2.5: Implement `explore-topic` compound tool

**File:** `aggregated-explore/execution.ts`

Calls `searchLessons`, `searchUnits`, `searchThreads` in parallel (using `Promise.all`). Small `size` per scope (e.g. 5). Merges into topic map. Handles partial failures gracefully (if one scope errors, still return the others with an error note).

### 2.6: Register all three tools

**File:** [definitions.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts) -- add to `AGGREGATED_TOOL_DEFS`

**File:** [executor.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts) -- add 3 cases to `executeAggregatedTool` switch

### 2.7: ES environment config + SDK wiring (both servers)

**STDIO** ([runtime-config.ts](apps/oak-curriculum-mcp-stdio/src/runtime-config.ts), [wiring.ts](apps/oak-curriculum-mcp-stdio/src/app/wiring.ts)):

- Optional `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` in env/config
- Create `searchRetrieval` from `createSearchSdk(...).retrieval` if credentials present
- Pass through to `createUniversalToolExecutor`

**HTTP** ([env.ts](apps/oak-curriculum-mcp-streamable-http/src/env.ts), [handlers.ts](apps/oak-curriculum-mcp-streamable-http/src/handlers.ts)):

- Optional Zod-validated ES env vars
- Same SDK wiring pattern
- Pass through to executor in `handleToolWithAuthInterception`

Both servers gracefully degrade: without ES credentials, search tools return "not configured" errors; all other tools work normally.

### 2.8: Run tests -- ALL must pass

```bash
pnpm test --filter @oaknational/curriculum-sdk
```

---

## WS3 -- NL Guidance, Examples, and Documentation (REFACTOR)

This workstream is NOT an afterthought. It is where the user experience is defined.

### 3.1: Tool descriptions with NL guidance

Each tool description follows the established "Use this when" / "Do NOT use" pattern, with scope-specific NL mapping examples. The descriptions teach the agent:

- **Which scope to choose** for different teacher intents
- **How to extract filters** from natural language ("KS3 science" -> `keyStage: 'ks3', subject: 'science'`)
- **When to combine tools** ("What comes before trigonometry?" -> search threads, then get-prerequisite-graph)
- **What each scope returns** so the agent can set teacher expectations

### 3.2: Cross-tool workflow guidance

Update [prerequisite-guidance.ts](packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts) to include search tool guidance. Add search-specific workflows to the guidance constants.

Key workflows to document:

| Teacher intent            | Tool sequence                                                    |
| ------------------------- | ---------------------------------------------------------------- |
| Find lessons on a topic   | `search(scope: 'lessons')`                                       |
| Plan a lesson             | `search(scope: 'lessons')` then `fetch(lesson:slug)` for details |
| Explore a topic           | `explore-topic` then drill down with `search`                    |
| Understand progression    | `search(scope: 'threads')` then `get-thread-progressions`        |
| Find prerequisites        | `search(scope: 'threads')` then `get-prerequisite-graph`         |
| Browse a subject          | `browse-curriculum(subject)`                                     |
| Discover what's available | `explore-topic` or `browse-curriculum`                           |

### 3.3: Extend `get-help` content

Update [tool-guidance-data.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/tool-guidance-data.ts):

- Add new tool categories (search tools alongside existing browsing/fetching)
- Add search-specific workflows
- Add NL mapping tips
- Add scope selection guidance

### 3.4: MCP prompts for search workflows

Update existing MCP prompts and add new ones:

- Update `find-lessons` prompt to use the new search tool
- Add `explore-curriculum` prompt for broad topic exploration
- Add `learning-progression` prompt for thread-based progression mapping

### 3.5: Result formatting for humans

Each scope's result formatter produces a human-readable summary that:

- States what was found (count, scope, query)
- Highlights key information (lesson titles, unit names, thread spans)
- Suggests next actions ("Use fetch to get full lesson details", "Search threads to see progression")
- Uses teacher-friendly language, not technical terms

### 3.6: Documentation and TSDoc

- Update workspace READMEs for curriculum-sdk, stdio server, http server
- Comprehensive TSDoc on all new functions, types, modules
- Update architecture docs with search tool architecture
- Update active plan and roadmap

---

## WS4 -- Quality Gates

### 4.1: Full quality gate chain

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

### 4.2: Verify existing tools unaffected

All 7 existing aggregated tools + all generated tools must work identically.

### 4.3: Sub-agent reviews

- `code-reviewer` on all changed files
- `architecture-reviewer` on cross-SDK dependency and tool architecture
- `test-reviewer` on new tests
- `config-reviewer` on package.json changes

---

## WS5 -- Compare, Replace, and Retire Old Search

### 5.0: Context and decisions

**Comparative testing (done informally):** The same query ("photosynthesis", KS3 science) was run through all four tools: old `search`, new `search-sdk`, `browse-curriculum`, and `explore-topic`. Results:

- Old `search` returns 20 lessons (only 3 genuinely relevant, similarity drops from 1.0 to 0.07 after #3) + 3 short transcript snippets. Title-based fuzzy matching produces many irrelevant results (e.g., "Electrical resistance", "Magnetic poles").
- New `search-sdk` (scope: lessons) returns 288 total hits (top 5 shown, all relevant). Includes keywords, learning points, misconceptions, teacher tips, highlighted transcript context. 4-way RRF + ELSER semantic ranking is strictly superior.
- `explore-topic` gives a unified topic map across lessons (288), units (41), and threads in a single call.
- `browse-curriculum` shows full KS3 Science structure (41 units, 290 lessons) without needing a query.

**Decision: replace.** The new search-sdk tools are superior in every dimension: relevance, coverage, richness, filtering, pagination. The old REST-based search adds no value.

**Three things need to happen:**

1. **Remove old `search` aggregated tool** — delete `aggregated-search/`, promote `search-sdk` to `search`
2. **Remove generated `get-search-lessons` and `get-search-transcripts`** — these REST API wrappers are now redundant (the old `search` was their only consumer)
3. **Assess unsurfaced search-sdk capabilities** — admin and observability services are not exposed via MCP tools

### 5.1: Remove generated search tools from the pipeline

**Problem:** `get-search-lessons` and `get-search-transcripts` are generated from `/search/lessons` and `/search/transcripts` in the OpenAPI spec. They are text-based REST wrappers — now entirely superseded by direct Elasticsearch semantic search via the search-sdk.

**Solution: endpoint skip list in the generator.**

**File:** `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts`

The `iterOperations()` function (line 60) iterates ALL paths in the OpenAPI spec. Add a const array of paths to skip, and filter before yielding:

```typescript
/**
 * API paths excluded from MCP tool generation.
 *
 * These endpoints are superseded by direct Elasticsearch search
 * via the search-sdk aggregated tools (search, browse-curriculum,
 * explore-topic). Generating MCP tools for them would create
 * redundant, inferior alternatives.
 */
const SKIPPED_PATHS: readonly string[] = [
  '/search/lessons',
  '/search/transcripts',
];
```

Then in `iterOperations()`, skip matching paths:

```typescript
for (const [path, pathItem] of Object.entries(schema.paths)) {
  if (SKIPPED_PATHS.some((skipped) => path.endsWith(skipped))) {
    continue;
  }
  // ... existing logic
}
```

**TDD approach:**

1. RED: Add a unit test for `iterOperations` (or `generateCompleteMcpTools`) that asserts `get-search-lessons` and `get-search-transcripts` are NOT in the generated tool set.
2. GREEN: Add the `SKIPPED_PATHS` filter.
3. REFACTOR: Verify `pnpm type-gen` no longer produces files for the skipped tools.

**Side effects to handle:**

- The old `aggregated-search/execution.ts` calls `deps.executeMcpTool('get-search-lessons', ...)` — this will fail once the generated tools are removed. This is intentional: we delete that module in 5.2.
- `list-tools.ts` will no longer include these tools in the tool list.
- Existing tests that reference these tool names will need updating.
- The `toolNames` array in the generated index will shrink by 2.

### 5.2: Promote `search-sdk` to `search`, delete old `aggregated-search/`

**Current state:**

| Tool name | Module | Backend | Status |
|-----------|--------|---------|--------|
| `search` | `aggregated-search/` | REST API (`get-search-lessons` + `get-search-transcripts`) | To be deleted |
| `search-sdk` | `aggregated-search-sdk/` | Elasticsearch via Search SDK (5 scopes) | To be promoted |

**Transition plan:**

1. **Rename `search-sdk` → `search` in `AGGREGATED_TOOL_DEFS`** (`definitions.ts` line 50). Change the key from `'search-sdk'` to `'search'`.

2. **Update tool metadata** — the tool's `annotations.title` should become `'Search Curriculum'` (inheriting from the old tool). Update `toolName` in `_meta` to `'search'`.

3. **Delete old module** — remove `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/` entirely:
   - `execution.ts` — calls `get-search-lessons` and `get-search-transcripts` (both removed in 5.1)
   - `tool-definition.ts` — old search tool definition
   - `types.ts` — old `SearchArgs` type
   - `validation.ts` — old search validation
   - `index.ts` — barrel export
   - `execution.integration.test.ts` — integration tests for old search

4. **Update `definitions.ts`** — remove the `search` import line (line 16) and the old `search` entry (line 43). Replace with the promoted `search-sdk`:

   ```typescript
   export const AGGREGATED_TOOL_DEFS = {
     search: { ...SEARCH_SDK_TOOL_DEF, inputSchema: SEARCH_SDK_INPUT_SCHEMA },
     fetch: { ... },
     // ... rest unchanged
     'browse-curriculum': { ... },
     'explore-topic': { ... },
   } as const;
   ```

5. **Update executor dispatch** — remove the old `search` case from the dispatch map in `executor.ts`. The new `search` case already exists (currently as `'search-sdk'`).

6. **Update all cross-references:**
   - `tool-guidance-data.ts` — update tool name references
   - `tool-guidance-workflows.ts` — workflow tool references
   - `mcp-prompts.ts` / `mcp-prompt-messages.ts` — prompt tool references
   - `prerequisite-guidance.ts` — context hint references
   - Tool descriptions that reference `search-sdk` by name
   - README documentation

7. **Update tests:**
   - E2E tests that call `search` will now exercise the new implementation
   - Integration tests that reference `search` tool by name
   - Smoke tests that verify tool list

**The `search` tool is the default broad search tool.** Its `scope` parameter lets agents choose the right index. For teachers who say "find me stuff about X" without specifying a scope, agents should use `explore-topic` (multi-index) or default to `search` with `scope: 'lessons'`. The tool description's NL guidance teaches agents this.

### 5.3: Assess unsurfaced search-sdk capabilities

**Capability audit:**

| Service | Method | Exposed via MCP? | Assessment |
|---------|--------|-------------------|------------|
| **Retrieval** | `searchLessons()` | `search` (scope: lessons), `explore-topic` | Fully exposed |
| | `searchUnits()` | `search` (scope: units), `explore-topic` | Fully exposed |
| | `searchThreads()` | `search` (scope: threads), `explore-topic` | Fully exposed |
| | `searchSequences()` | `search` (scope: sequences) | Fully exposed |
| | `suggest()` | `search` (scope: suggest) | Fully exposed |
| | `fetchSequenceFacets()` | `browse-curriculum` | Fully exposed |
| **Admin** | `setup()` | No | Destructive. Not for MCP clients. |
| | `reset()` | No | Destructive. Not for MCP clients. |
| | `verifyConnection()` | No | Health check. Could be useful for diagnostics but not teacher-facing. |
| | `listIndexes()` | No | Observability. Could surface document counts. Not priority. |
| | `updateSynonyms()` | No | Admin. Not for MCP clients. |
| | `ingest()` | No | Admin. Requires Oak API client. |
| | `getIndexMeta()` | No | Version info. Not teacher-facing. |
| | `setIndexMeta()` | No | Admin. Not for MCP clients. |
| **Observability** | `recordZeroHit()` | No | Write. Not for MCP clients. |
| | `getRecentZeroHits()` | No | Read-only. Could help debug search quality. Not priority. |
| | `getZeroHitSummary()` | No | Read-only. Useful for monitoring. Not priority. |
| | `persistZeroHitEvent()` | No | Write. Not for MCP clients. |
| | `fetchTelemetry()` | No | Read-only. Analytics. Not priority. |

**Conclusion:** All 6 retrieval methods are fully exposed. The 13 unexposed methods are admin/observability operations that are appropriately not teacher-facing. No action needed for WS5.

**Future consideration (not WS5):** If we build an admin MCP tool or a diagnostics tool, `verifyConnection()`, `listIndexes()`, and the zero-hit summary methods could be useful. This is a separate workstream.

### 5.4: TDD execution order

1. **RED tests first:**
   - Unit test: `iterOperations` (or equivalent) excludes `/search/lessons` and `/search/transcripts`
   - Integration test: `search` tool name resolves to the SDK-backed handler (not the REST-backed one)
   - E2E test: `search` tool returns the new response shape (scope, total, took, results with highlights)

2. **GREEN implementation:**
   - Add `SKIPPED_PATHS` to generator
   - Run `pnpm type-gen` to regenerate (removes 2 generated tools)
   - Delete `aggregated-search/` module
   - Rename `search-sdk` → `search` in definitions and executor
   - Update cross-references

3. **REFACTOR:**
   - Update NL guidance and help content
   - Update documentation
   - Clean up any orphaned imports or references

4. **Quality gates:**
   - `pnpm type-gen && pnpm build && pnpm type-check && pnpm lint && pnpm test && pnpm smoke:dev:stub`

### 5.5: Risk assessment

| Risk | Mitigation |
|------|------------|
| Agents already using `search` tool by name | Name stays `search` — agents won't notice the backend change. Input schema changes (adds `scope`, renames `q`→`text`). Tool description guides agents through the new schema. |
| Agents using `search-sdk` tool by name | Name disappears. `get-help` and tool descriptions will no longer reference it. Agents adapt on next tool list. |
| Generated `get-search-lessons` / `get-search-transcripts` used directly by agents | Rare — agents prefer the `search` aggregated tool. These generated tools had no special descriptions. Agents will use `search` instead. |
| `SKIPPED_PATHS` mechanism is fragile | Paths are stable API routes. If the API schema changes paths, `pnpm type-gen` will surface the change (tools reappear in the generated set, tests catch it). |
| Breaking change to `search` input schema | Old: `{ q, keyStage, subject, unit }`. New: `{ text, scope, subject, keyStage, ... }`. This is a breaking change for any client hardcoding the old schema. MCP clients re-read schemas on each session, so they adapt immediately. |

---

## Implementation Notes (WS1-WS2 Complete)

### Circular Dependency Resolution

`pnpm add @oaknational/oak-search-sdk --filter @oaknational/curriculum-sdk` caused a turbo "Cyclic dependency detected" error (search-sdk has curriculum-sdk as peerDependency). Solved via **dependency inversion**: `search-retrieval-types.ts` defines a local `SearchRetrievalService` interface structurally compatible with `oak-search-sdk`'s `RetrievalService`, using only curriculum-sdk's own generated types. The MCP servers import the concrete `oak-search-sdk` and pass it through.

### Key Architectural Decisions

- **Dispatch maps, not switches**: `executor.ts` and `execution.ts` use const object maps for tool/scope dispatch to stay within ESLint complexity limits
- **Two error patterns coexist**: Existing tools use `ToolExecutionResult`; search tools use `Result<T, E>` from `@oaknational/result`. Clean boundary. Unification is a separate future workstream (Phase 3b)
- **`_meta` and `securitySchemes` required**: All aggregated tools must include OpenAI Apps SDK `_meta` fields and OAuth `securitySchemes` for widget rendering and auth enforcement

### Quality Gate Results (WS4)

| Gate | Result | Notes |
| ---- | ------ | ----- |
| type-gen | Pass | |
| build | Pass | |
| type-check | Pass | |
| lint:fix | Pass | |
| format:root | Pass | |
| SDK tests | 1241 passed (113 files) | All green |
| STDIO E2E | 10 passed (4 files) | All green |
| HTTP unit/integration | 611 passed (51 files) | All green |
| HTTP E2E | 191 passed (25 files) | All green after transport isolation fix |

### E2E Transport Isolation Fix (17 previously failing tests — RESOLVED)

**Root cause**: MCP `StreamableHTTPServerTransport` in stateless mode served one client per instance. Tests that shared an app instance (via `beforeAll`) failed on the second request.

**Original fix** (WS4): Each test created its own fresh `createApp()` instance.

**Superseded by ADR-112**: The per-request transport pattern (implemented as part of the stateless transport bug fix) means the app now handles multiple sequential requests correctly. E2E tests were simplified — multi-step MCP flows (e.g. `getWidgetHtml()`) now share a single app instance. The `withFreshServer` smoke test workaround was also removed. See [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md).

---

## Additional Tasks (from 2026-02-20 review)

These items surfaced during the OAuth documentation review and are not OAuth-related, but affect the MCP server and developer experience.

### Fix quick-start anchor

`docs/quick-start.md` links to `#known-gate-caveats` but the onboarding heading is singular `### Known Gate Caveat`. Fix the link or the heading to match.

### Preserve historical review cleanly

`.agent/research/developer-experience/2026-02-20-onboarding-review.md` should have a historical snapshot note indicating when the review was conducted and any context that has since changed.

### Canonical health endpoint alignment

Adopt `/healthz` as canonical health check path. Align `conditional-clerk-middleware.ts` comments (which reference `/health` and `/ready`) with the actual route used by the server.

---

## Key Risks and Mitigations

| Risk                                           | Mitigation                                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Cross-SDK circular dependency                  | Solved via dependency inversion. `SearchRetrievalService` interface in curriculum-sdk. Extract to `packages/core/` later. |
| `@elastic/elasticsearch` bundle size on Vercel | Not yet verified. Lazy imports if needed. |
| ES credentials missing in deployment           | Optional env vars + fail-fast error. Existing tools unaffected. |
| Too many tools overwhelms agents               | Three new tools is modest. Rich descriptions + `get-help` + prerequisite guidance help agents choose. |
| Existing tool regression                       | `searchRetrieval` is optional. All existing code paths unchanged. E2E tests verify. |
| NL guidance insufficient                       | WS3 pending. Iterate on descriptions based on agent testing. The guidance is in code, easy to refine. |
| E2E transport isolation (was 17 failures)       | **Resolved.** Per-request transport (ADR-112) eliminated the root cause. Tests simplified. 193/193 E2E pass. |
