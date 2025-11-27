# MCP Infrastructure & Advanced Tools Plan

**Status**: PLANNED  
**Created**: 2025-11-27  
**Priority**: Foundation work (Phase 0) blocks other enhancements  
**Estimated Duration**: ~12-14 weeks (phased)

---

## Executive Summary

This comprehensive plan covers MCP architecture evolution and advanced capabilities:

1. **Phase 0: Foundation** - Aggregated tools type-gen refactor (prerequisite for all advanced work)
2. **Phase 1: Infrastructure Hardening** - Rate limiting, descriptor-first, type guards
3. **Phase 2: Tool Taxonomy & Categorization** - Categories, tags, metadata strategy
4. **Phase 3: Playbooks & Commands** - Agent interaction patterns
5. **Phase 4: Advanced MCP Tools** - Bulk operations, filtering, comparison, export

---

## Directive References

Read and follow:

- `.agent/directives-and-memory/rules.md` - Cardinal Rule, TDD, type safety, no shortcuts
- `.agent/directives-and-memory/schema-first-execution.md` - All runtime behaviour driven by generated artefacts
- `.agent/directives-and-memory/testing-strategy.md` - TDD-first, unit → integration → E2E

---

## Context and References

### Related Plans

- **01-mcp-tool-metadata-enhancement-plan.md** - Metadata enrichment (can run in parallel after Phase 0)
- **02-curriculum-ontology-resource-plan.md** - Ontology resource (depends on Phase 0)
- `.agent/plans/semantic-search/` - Search capabilities used by advanced tools
- `.agent/plans/oak-openai-app-plan.md` - OpenAI App SDK integration
- `.agent/plans/external/upstream-api-metadata-wishlist.md` - Upstream API improvements

### Priority Context

- **Current Priorities** (blocking this plan):
  1. ✅ Semantic search (Phase 1 in progress)
  2. 🔄 OAuth/Clerk integration
- **This Plan**: Priority 3 (Phase 0 can start after OAuth)

---

## Phase 0: Foundation - Aggregated Tools Type-Gen Refactor

**Status**: PREREQUISITE for all other phases  
**Duration**: ~2 weeks  
**Priority**: Must complete before any other MCP enhancement work

### Purpose

Refactor aggregated MCP tools (`search`, `fetch`) from hand-written runtime code to type-gen-generated definitions, establishing the pattern for composite MCP primitives before adding ontology resources and semantic search integration.

### Problem Statement

**Current state**: Aggregated tools are defined in hand-written runtime code:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search.ts` (220 lines)
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts` (~100 lines)
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` (116 lines)

**Good News**: Aggregated tools already use flat schemas (consistent with P0 flat schema fix):

- ✅ `SEARCH_INPUT_SCHEMA`: Flat properties (`q`, `keyStage`, `subject`, `unit`)
- ✅ `FETCH_INPUT_SCHEMA`: Flat properties (`id`)
- ✅ No nested `params` structure

**Issues**:

1. **Duplication**: Tool names, descriptions, schemas defined in separate code from generated tools
2. **Inconsistency**: Generated tools vs aggregated tools follow different patterns
3. **Inflexibility**: Adding semantic search would require more hand-written runtime code
4. **Schema-first violation**: Aggregated tool definitions don't flow from OpenAPI schema or declarative config
5. **Manual enum maintenance**: `KEY_STAGES` and `SUBJECT_SLUGS` are hardcoded arrays

**Target state**: All MCP tool definitions (basic + aggregated) generated at type-gen time:

- Configuration files define composition rules for aggregated tools
- Type-gen generators emit tool descriptors, validators, execution logic
- Runtime code imports and wires generated definitions (thin plumbing)
- Adding semantic search = editing config file + running `pnpm type-gen`

### Architecture Overview

#### Configuration Format

Create declarative JSON/TypeScript configuration defining aggregated tool composition:

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/config/aggregated-tools.config.json`

```json
{
  "version": "1.0.0",
  "tools": {
    "search": {
      "name": "search",
      "title": "Search Curriculum",
      "description": "Search across lessons and transcripts. Executes get-search-lessons and get-search-transcripts in parallel and combines results.",
      "annotations": {
        "readOnlyHint": true,
        "idempotentHint": true,
        "openWorldHint": false
      },
      "inputSchema": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "query": { "type": "string", "description": "Search query string" },
          "q": { "type": "string", "description": "Alias for query" },
          "keyStage": {
            "type": "string",
            "enum": ["ks1", "ks2", "ks3", "ks4"],
            "description": "Filter by key stage"
          },
          "subject": {
            "type": "string",
            "enum": ["art", "citizenship", "computing", "..."],
            "description": "Filter by subject"
          },
          "unit": { "type": "string", "description": "Filter by unit slug" }
        }
      },
      "composition": {
        "strategy": "parallel",
        "tools": [
          {
            "tool": "get-search-lessons",
            "mapInput": {
              "q": "q",
              "keyStage": "keyStage",
              "subject": "subject",
              "unit": "unit"
            }
          },
          {
            "tool": "get-search-transcripts",
            "mapInput": { "q": "q" }
          }
        ],
        "combineOutput": {
          "strategy": "merge",
          "keys": {
            "lessons": "tools[0].data",
            "transcripts": "tools[1].data"
          }
        }
      }
    },
    "fetch": {
      "name": "fetch",
      "title": "Fetch Resource",
      "description": "Fetch lesson, unit, subject, sequence, or thread metadata by canonical identifier.",
      "composition": {
        "strategy": "route",
        "router": {
          "field": "id",
          "routes": [
            {
              "pattern": "^lesson:(.+)",
              "tool": "get-lessons-summary",
              "mapInput": { "lesson": "$1" }
            },
            { "pattern": "^unit:(.+)", "tool": "get-units-summary", "mapInput": { "unit": "$1" } },
            {
              "pattern": "^subject:(.+)",
              "tool": "get-subject-detail",
              "mapInput": { "subject": "$1" }
            }
          ]
        }
      }
    }
  }
}
```

#### Generator Structure

**Directory**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-aggregated-tools/`

**Files**:

- `generator.ts` - Main generator orchestrator
- `config-schema.ts` - Zod schema for config validation
- `emit-descriptors.ts` - Emit tool descriptor types and constants
- `emit-validators.ts` - Emit Zod validators for input schemas
- `emit-executors.ts` - Emit execution logic from composition rules
- `emit-index.ts` - Emit aggregated tools index

**Generated output**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-aggregated-tools/`

**Files generated**:

- `index.ts` - Exported tool list, names, type guards
- `descriptors.ts` - Tool descriptor objects
- `validators.ts` - Input validation functions
- `executors.ts` - Execution logic for each tool
- `search.ts` - Complete definition for search tool
- `fetch.ts` - Complete definition for fetch tool

### Implementation Sessions (TDD Throughout)

#### Session 1: Configuration Schema and Validation (2 days)

**Tasks**:

1. Create `aggregated-tools.config.schema.json` JSON Schema definition
2. Create Zod schema in `type-gen/typegen/mcp-aggregated-tools/config-schema.ts`
3. Write unit tests for config validation
4. Create initial `aggregated-tools.config.json` with `search` and `fetch` definitions
5. Implement config loader with validation

**Acceptance**:

- Config validates against schema
- Unit tests confirm validation catches errors
- Config loader imports and validates successfully

#### Session 2: Descriptor Generation (2 days)

**Tasks**:

1. Implement `emit-descriptors.ts` generator
2. Generate TypeScript types for tool descriptors
3. Generate tool descriptor constants
4. Write unit tests for descriptor generation
5. Integrate into `pnpm type-gen` pipeline

**Acceptance**:

- `pnpm type-gen` generates descriptor types and constants
- Generated types match config structure
- Unit tests validate descriptor completeness

#### Session 3: Validator Generation (2 days)

**Tasks**:

1. Implement `emit-validators.ts` generator
2. Generate Zod schemas from config inputSchema
3. Generate validation functions
4. Write unit tests for validator generation
5. Test validation logic with valid/invalid inputs

**Acceptance**:

- Generated validators accept valid inputs
- Generated validators reject invalid inputs with clear messages
- Unit tests cover edge cases

#### Session 4: Executor Generation (3 days)

**Tasks**:

1. Implement `emit-executors.ts` generator
2. Generate execution logic for `parallel` composition strategy
3. Generate execution logic for `route` composition strategy
4. Handle input mapping, output combination, error handling
5. Write unit tests for executor generation
6. Write integration tests for generated executors

**Acceptance**:

- Generated executors call underlying tools correctly
- Input mapping works for all config scenarios
- Output combination produces expected structure
- Error handling preserves error messages

#### Session 5: Runtime Integration (2 days)

**Tasks**:

1. Update `universal-tools.ts` to import generated aggregated tools
2. Remove `aggregated-search.ts` and `aggregated-fetch.ts`
3. Update all imports across codebase
4. Update tests to use generated tools
5. Run full test suite

**Acceptance**:

- All imports resolve correctly
- No references to old runtime files remain
- All tests pass
- MCP servers behave identically to before refactor

#### Session 6: Documentation and Polish (1 day)

**Tasks**:

1. Document config format in `packages/sdks/oak-curriculum-sdk/docs/mcp-aggregated-tools-config.md`
2. Add TSDoc to generated types
3. Update SDK README with aggregated tools explanation
4. Run full quality gate

**Acceptance**:

- Documentation complete and accurate
- Quality gates pass (`pnpm qg`)

### Success Criteria (Phase 0)

1. ✅ Config format defined and validated
2. ✅ Generators emit valid TypeScript
3. ✅ Generated tools behave identically to hand-written versions
4. ✅ Runtime code is thin plumbing (imports generated definitions)
5. ✅ All tests pass
6. ✅ MCP servers work unchanged
7. ✅ Documentation complete
8. ✅ Zero hand-written aggregated tool code remains

---

## Phase 1: MCP Infrastructure Hardening

**Status**: PLANNED (after Phase 0)  
**Duration**: ~1-2 weeks  
**Priority**: Infrastructure improvements

### Purpose

Harden MCP infrastructure with production-ready features and remove technical debt from the type-gen pipeline.

### Scope

#### 1. Rate Limiting & Auth

- Implement rate limiting for MCP servers
- Enhanced authentication mechanisms
- Request throttling and queuing

#### 2. Descriptor-First Architecture

- Collapse generated `*Tool` stubs
- Derive handlers directly from descriptor constants
- Descriptor becomes single source of truth for transports, tooling, and docs

#### 3. Stable Constant Data Structures

- Emit stable constant data structure first
- Synthesise TypeScript types, Zod schemas, and type guards from data
- Ensure request/response validation remains consistent end-to-end

#### 4. Type Guard Threading

- Thread derived types and guards through `execute-tool-call`
- Flow through universal translation layer and future transports
- Ensure no path operates on `unknown` values

#### 5. Cleanup & Simplification

- Remove placeholder, no-op `handle` implementations
- Generator routes through real executors
- Avoid dead code and clarify runtime shape

#### 6. Generator-Level Tests

- Add tests that assert descriptions stay aligned with upstream OpenAPI schema
- Validate parameter metadata consistency
- Ensure validation rules match schema definitions

### Implementation Sessions

#### Session 1: Rate Limiting & Auth (2-3 days)

**Tasks**:

1. Design rate limiting strategy
2. Implement request throttling
3. Add queue management
4. Update authentication mechanisms
5. Write tests

#### Session 2: Descriptor-First Refactor (3-4 days)

**Tasks**:

1. Analyze current `*Tool` stub usage
2. Design descriptor-first handler routing
3. Implement consolidated handler system
4. Remove stub implementations
5. Update tests

#### Session 3: Type Guard Threading (2-3 days)

**Tasks**:

1. Audit paths operating on `unknown`
2. Implement type guard propagation
3. Update tool execution pipeline
4. Add type guard tests

#### Session 4: Generator Tests & Validation (2 days)

**Tasks**:

1. Add generator-level test suite
2. Test OpenAPI schema alignment
3. Validate parameter metadata
4. Test validation rule consistency

### Success Criteria (Phase 1)

1. ✅ Rate limiting implemented and tested
2. ✅ Descriptor-first architecture established
3. ✅ Type guards thread through entire system
4. ✅ Generator-level tests comprehensive
5. ✅ Dead code removed

---

## Phase 2: Tool Taxonomy & Categorization

**Status**: PLANNED (after Phase 1)  
**Duration**: ~1 week  
**Priority**: Improves tool discoverability

### Purpose

Define canonical tool categories and tags to improve agent routing and tool selection.

### Tool Categories

| Category                | Description                                       | Examples                                          |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `data.simple`           | Direct OpenAPI endpoint facades (single API call) | `get-key-stages`, `get-lessons-summary`           |
| `data.complex`          | Tools requiring multiple API calls                | `get-lesson-with-assets`, `get-unit-with-lessons` |
| `guidance.presentation` | In-repo authored presentation specs (no API)      | `getLessonPresentationSpec`                       |
| `guidance.ontology`     | Schema-derived metadata (no API)                  | `getOntology`                                     |
| `playbook`              | Process definitions for agents                    | `FindLesson@v1`                                   |
| `command`               | Slash-command mappings                            | `oak_find_lesson`                                 |

### Domain Tags

- `curriculum`, `lessons`, `units`, `sequences`, `search`
- `presentation`, `provenance`, `accessibility`
- `educational-context`, `content-sensitivity`

### Metadata Interface

```typescript
interface ToolMetadata {
  readonly category: ToolCategory;
  readonly tags: readonly string[];
  readonly stability?: 'stable' | 'beta' | 'experimental';
  readonly audience?: 'agent' | 'developer' | 'both';
  readonly determinism?: 'deterministic' | 'non-deterministic';
  readonly requiresNetwork?: boolean;
  readonly cacheable?: boolean;
  readonly rateLimitPolicy?: RateLimitPolicy;
  readonly multiCallComplexity?: number;
}
```

### Implementation

1. Define category and tag constants
2. Update tool descriptor contract to include metadata
3. Update type-gen to emit categories/tags from config
4. Update handler registration to pass metadata
5. Add integration tests for metadata presence

### Acceptance Criteria (Phase 2)

| Criterion                             | Test Method          |
| ------------------------------------- | -------------------- |
| All tools have category               | Grep generated files |
| All tools have at least one tag       | Integration test     |
| Metadata consistent across stdio/http | Comparison test      |
| Categories documented in AGENT.md     | Documentation review |

---

## Phase 3: Playbooks & Commands Registry

**Status**: PLANNED (after Phase 2)  
**Duration**: ~1-2 weeks  
**Priority**: Improves agent interaction patterns

### Purpose

Provide deterministic, in-repo authored process definitions that consuming agents execute without server-side orchestration.

### Playbook Structure

```typescript
interface Playbook {
  readonly id: string;
  readonly version: string;
  readonly inputs: readonly PlaybookInput[];
  readonly questions: readonly ClarificationQuestion[];
  readonly steps: readonly PlaybookStep[];
  readonly outputs: PlaybookOutputs;
}

type PlaybookStep =
  | { type: 'ask'; question: ClarificationQuestion }
  | { type: 'toolCall'; tool: string; params: Record<string, unknown> }
  | { type: 'aggregate'; sources: readonly string[]; into: string }
  | { type: 'format'; template: TemplateRef; data: string };
```

### FindLesson@v1 Playbook

```typescript
{
  id: 'FindLesson',
  version: 'v1',
  inputs: [{ name: 'query', type: 'string', required: true }],
  questions: [
    { id: 'audience', prompt: 'What is the target audience?', options: ['ks1', 'ks2', 'ks3', 'ks4'] },
    { id: 'subject', prompt: 'Which subject?', optional: true }
  ],
  steps: [
    { type: 'toolCall', tool: 'search', params: { q: '{{query}}', keyStage: '{{audience}}' } },
    { type: 'toolCall', tool: 'getLessonPresentationSpec', params: {} },
    { type: 'format', template: 'search-results.md', data: 'searchResults' }
  ]
}
```

### Commands Registry

**Resource**: `mcp://oak/commands/index.json`

```json
{
  "commands": {
    "oak_find_lesson": {
      "playbook": "FindLesson@v1",
      "summary": "Find lessons matching a query",
      "hints": ["Use natural language queries", "Specify key stage for better results"]
    },
    "oak_get_ontology": {
      "tool": "getOntology",
      "summary": "Get curriculum domain model"
    }
  }
}
```

### Implementation

1. Define Playbook and Step schemas via OpenAPI
2. Create `oak.playbooks.get` tool returning playbook definitions
3. Create commands registry resource
4. Write integration tests for playbook contract
5. Document in `docs/agent-guidance/`

### Acceptance Criteria (Phase 3)

| Criterion                          | Test Method       |
| ---------------------------------- | ----------------- |
| `FindLesson@v1` playbook validates | Schema validation |
| Playbooks are deterministic        | Unit test         |
| Commands registry discoverable     | MCP resource list |
| No server-side orchestration       | Code review       |

---

## Phase 4: Advanced MCP Tools

**Status**: FUTURE (after Phases 0-3 and prerequisites)  
**Duration**: ~8 weeks  
**Priority**: Deferred until foundation complete

**BLOCKED until**:

1. ✅ Phase 0 complete (aggregated tools refactor)
2. ✅ Ontology resource implemented (Plan 02)
3. ✅ Semantic search Phase 1 complete
4. ✅ OAuth/Clerk integration complete

### Advanced Tool Categories

#### Category 1: Batch & Bulk Operations

- **`bulk-unit-summaries`**: Fetch 2-20 unit summaries in parallel
- **`bulk-lesson-details`**: Fetch multiple lesson summaries with optional transcripts
- **`batch-thread-units`**: Fetch units for multiple threads, deduplicate

#### Category 2: Intelligent Filtering & Discovery

- **`find-units-by-thread`**: Search units by thread with ontology context
- **`discover-progression-pathway`**: Show topic progression across key stages

#### Category 3: Comparative Analysis

- **`compare-units`**: Compare 2-4 units side-by-side
- **`analyse-nc-coverage`**: Check NC statement coverage
- **`analyse-unit-progression`**: Compare units within a sequence

#### Category 4: Export & Reporting

- **`export-curriculum-data`**: Export in JSON/Markdown/CSV
- **`generate-lesson-plan`**: Compile lesson + assets + quiz
- **`generate-unit-overview`**: Compile unit with all lessons

### Configuration-Driven Architecture

Advanced tools follow same pattern as aggregated tools:

```json
{
  "tools": {
    "bulk-unit-summaries": {
      "name": "bulk-unit-summaries",
      "composition": {
        "strategy": "parallel-batch",
        "tool": "get-units-summary",
        "batchSize": 5,
        "mapInput": { "unit": "unitSlugs[*]" },
        "combineOutput": { "strategy": "array-merge", "resultKey": "units" }
      }
    }
  }
}
```

### Implementation Roadmap (Phase 4)

| Sub-Phase | Duration | Content                           |
| --------- | -------- | --------------------------------- |
| 4.1       | 2 weeks  | Config & generator infrastructure |
| 4.2       | 1 week   | Batch operations tools            |
| 4.3       | 2 weeks  | Filtering & discovery tools       |
| 4.4       | 2 weeks  | Comparison tools                  |
| 4.5       | 1 week   | Export tools                      |

---

## Implementation Schedule (All Phases)

| Phase                              | Duration  | Dependencies                          |
| ---------------------------------- | --------- | ------------------------------------- |
| Phase 0: Aggregated Tools Refactor | 2 weeks   | OAuth complete                        |
| Phase 1: Infrastructure Hardening  | 1-2 weeks | Phase 0                               |
| Phase 2: Tool Taxonomy             | 1 week    | Phase 1                               |
| Phase 3: Playbooks & Commands      | 1-2 weeks | Phase 2                               |
| Phase 4: Advanced Tools            | 8 weeks   | Phases 0-3, Ontology, Semantic Search |

**Total**: ~12-14 weeks (can be phased over multiple sprints)

---

## Quality Gates

After each phase:

```bash
pnpm type-gen      # Regenerate all tools
pnpm build         # No type errors
pnpm type-check    # All workspaces type-safe
pnpm lint -- --fix # No linting errors
pnpm test          # Unit + integration tests pass
pnpm test:e2e      # E2E tests pass
```

---

## Testing Strategy

Following `.agent/directives-and-memory/testing-strategy.md`:

1. **Unit Tests**: Pure functions, no I/O, no mocks
   - Configuration validation
   - Input mapping logic
   - Output combination logic
   - Comparison algorithms
   - Export formatters

2. **Integration Tests**: Code units working together, simple injected mocks
   - Tool executor generation
   - Batch coordination
   - Ontology enrichment

3. **E2E Tests**: Running system with side effects
   - Actual tool invocation via MCP protocol
   - Stubbed API responses (no network costs)

**TDD Throughout**: Write tests FIRST (Red → Green → Refactor)

---

## Risks and Mitigation

**Risk**: Generated code is harder to debug than hand-written code

- **Mitigation**: Emit readable TypeScript with clear variable names; add TSDoc comments; preserve stack traces

**Risk**: Config format becomes too complex

- **Mitigation**: Start simple (parallel + route strategies only); iterate based on actual needs; validate with JSON Schema

**Risk**: Breaking changes to MCP server behaviour

- **Mitigation**: Comprehensive E2E tests; manual testing in ChatGPT/Cursor before merge; feature flag if needed

**Risk**: Performance regression from generated code

- **Mitigation**: Profile generated executors; compare to hand-written versions; optimize hot paths

---

## TDD Reminder

Per testing-strategy.md:

> "Write tests **FIRST**. Red → Green → Refactor"

All changes follow:

1. **RED**: Write test that fails (feature doesn't exist yet)
2. **GREEN**: Implement minimal code to pass test
3. **REFACTOR**: Improve implementation while keeping tests green

---

## Related Plans

- **01-mcp-tool-metadata-enhancement-plan.md** - Metadata enhancement (parallel after Phase 0)
- **02-curriculum-ontology-resource-plan.md** - Ontology resource (depends on Phase 0)
- `.agent/plans/semantic-search/` - Search capabilities for advanced tools
- `.agent/plans/oak-openai-app-plan.md` - OpenAI App SDK integration

---

## Domain Documentation

- `packages/sdks/oak-curriculum-sdk/README.md` - SDK documentation
- `docs/architecture/curriculum-ontology.md` - Domain model
- `apps/oak-curriculum-mcp-stdio/README.md` - MCP server usage
- `apps/oak-curriculum-mcp-streamable-http/README.md` - HTTP MCP server

---

## Plan Maintenance

This plan will be updated when:

1. Prerequisites are completed (promote phases from PLANNED to ACTIVE)
2. Configuration formats evolve based on implementation learnings
3. New tool categories are identified
4. Upstream API changes affect tool capabilities
