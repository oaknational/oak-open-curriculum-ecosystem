# Comprehensive MCP Enhancement Plan

**Status**: PLANNED (Phases 0-2)  
**Created**: 2025-11-11  
**Owner**: Engineering  
**Last Updated**: 2025-11-11

## Purpose

This comprehensive plan unifies all MCP enhancement work into a single roadmap, covering:

1. **Phase 0: Foundation** - Aggregated tools type-gen refactor (prerequisite for all advanced work)
2. **Phase 1: Infrastructure Hardening** - Core MCP infrastructure improvements
3. **Phase 2: Advanced MCP Tools** - High-level composite tools for complex workflows

**Priority Context**:

- **Current Priorities** (blocking this plan):
  1. ✅ Semantic search (Phase 1 in progress)
  2. 🔄 Curriculum ontology resource implementation
  3. 🔄 OAuth/Clerk integration
- **This Plan**: Priority 4 (starts after 1-3 complete)

## Context and References

### Alignment with Core Directives

- `.agent/directives-and-memory/rules.md` – Cardinal Rule, TDD, type safety, no shortcuts
- `.agent/directives-and-memory/schema-first-execution.md` – All runtime behaviour driven by generated artefacts
- `.agent/directives-and-memory/testing-strategy.md` – TDD-first, unit → integration → E2E
- `.agent/plans/high-level-plan.md` – Strategic roadmap

### Related Plans

- `.agent/plans/curriculum-ontology-resource-plan.md` – Provides curriculum structure knowledge for Phase 2
- `.agent/plans/semantic-search/` – Search capabilities used by advanced tools
- `.agent/plans/oak-openai-app-plan.md` – Metadata optimization benefiting from consistent tool patterns
- `.agent/plans/curriculum-tools-guidance-playbooks-plan.md` – Overlapping vision (Phase 1 complete, rest deferred)
- `.agent/plans/external/upstream-api-metadata-wishlist.md` – Upstream API improvements benefiting advanced tools

---

## Phase 0: Foundation - Aggregated Tools Type-Gen Refactor

**Status**: PREREQUISITE for Phases 1-2  
**Duration**: ~2 weeks  
**Priority**: Must complete before any other MCP enhancement work  
**Last Updated**: 2025-11-18 (post P0 flat schema fix)

### Purpose

Refactor aggregated MCP tools (`search`, `fetch`) from hand-written runtime code to type-gen-generated definitions, establishing the pattern for composite MCP primitives before adding ontology resources and semantic search integration.

### Problem Statement

**Current state** (post P0 flat schema fix): Aggregated tools (`search`, `fetch`) are defined in hand-written runtime code:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search.ts` (220 lines)
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts` (~100 lines)
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` (116 lines)

**Good News**: Aggregated tools already use flat schemas (consistent with P0 flat schema fix):

- ✅ `SEARCH_INPUT_SCHEMA`: Flat properties (`q`, `keyStage`, `subject`, `unit`)
- ✅ `FETCH_INPUT_SCHEMA`: Flat properties (`id`)
- ✅ No nested `params` structure

**Issues**:

1. **Duplication**: Tool names, descriptions, schemas defined in separate code from generated tools
2. **Inconsistency**: Generated tools vs aggregated tools follow different patterns (descriptor vs hand-written)
3. **Inflexibility**: Adding semantic search would require more hand-written runtime code
4. **Schema-first violation**: Aggregated tool definitions don't flow from OpenAPI schema or declarative config
5. **Manual enum maintenance**: `KEY_STAGES` and `SUBJECT_SLUGS` are hardcoded arrays, not derived from source

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
            "mapInput": {
              "q": "q"
            }
          }
        ],
        "combineOutput": {
          "strategy": "merge",
          "keys": {
            "lessons": "tools[0].data",
            "transcripts": "tools[1].data",
            "q": "input.q",
            "keyStage": "input.keyStage",
            "subject": "input.subject",
            "unit": "input.unit"
          }
        }
      }
    },
    "fetch": {
      "name": "fetch",
      "title": "Fetch Resource",
      "description": "Fetch lesson, unit, subject, sequence, or thread metadata by canonical identifier. Routes to appropriate endpoint based on ID prefix.",
      "annotations": {
        "readOnlyHint": true,
        "idempotentHint": true,
        "openWorldHint": false
      },
      "inputSchema": {
        "type": "object",
        "required": ["id"],
        "additionalProperties": false,
        "properties": {
          "id": {
            "type": "string",
            "description": "Canonical identifier (e.g., 'lesson:oak-lesson-slug', 'unit:oak-unit-slug')",
            "pattern": "^(lesson|unit|subject|sequence|thread):.+"
          }
        }
      },
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
            {
              "pattern": "^unit:(.+)",
              "tool": "get-units-summary",
              "mapInput": { "unit": "$1" }
            },
            {
              "pattern": "^subject:(.+)",
              "tool": "get-subject-detail",
              "mapInput": { "subject": "$1" }
            }
          ]
        },
        "combineOutput": {
          "strategy": "enrich",
          "addFields": {
            "id": "input.id",
            "type": "detectTypeFromId(input.id)",
            "canonicalUrl": "generateCanonicalUrlWithContext(type, input.id)",
            "data": "routedToolResult.data"
          }
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
- Unit tests cover edge cases (optional fields, enums, patterns)

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
4. Update plan documents referencing aggregated tools
5. Run full quality gate

**Acceptance**:

- Documentation complete and accurate
- Quality gates pass (`pnpm qg`)
- Plan cross-links updated

### Testing Strategy

#### Unit Tests

**Config validation**:

- Valid configs pass
- Invalid configs fail with clear messages
- Required fields enforced
- Enum values validated

**Descriptor generation**:

- Descriptors match config structure
- Type guards work correctly
- Tool names extracted correctly

**Validator generation**:

- Generated Zod schemas validate correctly
- Error messages are clear
- Optional fields handled correctly

**Executor generation**:

- Parallel composition calls tools correctly
- Route composition selects correct tool
- Input mapping transforms inputs correctly
- Output combination produces expected structure

#### Integration Tests

**Type-gen pipeline**:

- Config loads successfully
- Generators emit valid TypeScript
- Generated code compiles without errors
- Generated types export correctly

**Tool execution**:

- Generated executors call underlying tools
- Input validation works end-to-end
- Output formatting matches expected structure
- Error handling preserves context

#### E2E Tests

**MCP server integration**:

- List tools includes aggregated tools
- Call aggregated tools via MCP protocol
- Validate responses match expected structure
- Test both STDIO and HTTP servers

### Quality Gates

After each session:

1. `pnpm type-gen` - Generators run successfully
2. `pnpm build` - No type errors
3. `pnpm type-check` - All workspaces type-safe
4. `pnpm lint -- --fix` - No linting errors
5. `pnpm test` - All unit/integration tests pass
6. `pnpm test:e2e` - E2E tests pass

### Success Criteria

1. ✅ Config format defined and validated
2. ✅ Generators emit valid TypeScript
3. ✅ Generated tools behave identically to hand-written versions
4. ✅ Runtime code is thin plumbing (imports generated definitions)
5. ✅ All tests pass
6. ✅ MCP servers work unchanged
7. ✅ Documentation complete
8. ✅ Zero hand-written aggregated tool code remains

### Risks and Mitigation

**Risk**: Generated code is harder to debug than hand-written code

- **Mitigation**: Emit readable TypeScript with clear variable names; add TSDoc comments; preserve stack traces in error handling

**Risk**: Config format becomes too complex

- **Mitigation**: Start simple (parallel + route strategies only); iterate based on actual semantic search needs; validate config with JSON Schema

**Risk**: Breaking changes to MCP server behaviour

- **Mitigation**: Comprehensive E2E tests; manual testing in ChatGPT/Cursor before merge; feature flag if needed

**Risk**: Performance regression from generated code

- **Mitigation**: Profile generated executors; compare to hand-written versions; optimize hot paths

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
- Ensure request/response validation remains consistent end-to-end without manual assertions

#### 4. Type Guard Threading

- Thread derived types and guards through `execute-tool-call`
- Flow through universal translation layer and future transports
- Ensure no path operates on `unknown` values

#### 5. Cleanup & Simplification

- Remove placeholder, no-op `handle` implementations
- Generator routes through real executors
- Avoid dead code and clarify runtime shape for contributors

#### 6. Generator-Level Tests

- Add tests that assert descriptions stay aligned with upstream OpenAPI schema
- Validate parameter metadata consistency
- Ensure validation rules match schema definitions

#### 7. Hero Tools Investigation (Future)

- Investigate higher-level "hero" tools (e.g. `suggest_lesson_plan`)
- Requires: Canonical transport complete, compliance work done, semantic search operational

### Implementation Sessions

#### Session 1: Rate Limiting & Auth (2-3 days)

**Tasks**:

1. Design rate limiting strategy
2. Implement request throttling
3. Add queue management
4. Update authentication mechanisms
5. Write tests

**Acceptance**:

- Rate limits enforced
- Authentication enhanced
- Tests pass

#### Session 2: Descriptor-First Refactor (3-4 days)

**Tasks**:

1. Analyze current `*Tool` stub usage
2. Design descriptor-first handler routing
3. Implement consolidated handler system
4. Remove stub implementations
5. Update tests
6. Run quality gates

**Acceptance**:

- Handlers derived from descriptors
- No stub implementations remain
- All tests pass
- MCP servers function identically

#### Session 3: Type Guard Threading (2-3 days)

**Tasks**:

1. Audit paths operating on `unknown`
2. Implement type guard propagation
3. Update tool execution pipeline
4. Add type guard tests
5. Validate end-to-end type safety

**Acceptance**:

- No paths operate on `unknown`
- Type guards flow through system
- Type-check passes across all workspaces

#### Session 4: Generator Tests & Validation (2 days)

**Tasks**:

1. Add generator-level test suite
2. Test OpenAPI schema alignment
3. Validate parameter metadata
4. Test validation rule consistency
5. Run full quality gates

**Acceptance**:

- Generator tests comprehensive
- OpenAPI alignment validated
- Quality gates pass

### Success Criteria

1. ✅ Rate limiting implemented and tested
2. ✅ Descriptor-first architecture established
3. ✅ Type guards thread through entire system
4. ✅ Generator-level tests comprehensive
5. ✅ Dead code removed
6. ✅ All quality gates pass

---

## Phase 2: Advanced MCP Tools

**Status**: FUTURE (Priority 4 - after ontology, OAuth, semantic search)  
**Duration**: ~8 weeks  
**Priority**: Deferred until Phases 0-1 and prerequisites complete

### Purpose

Implement advanced MCP tooling beyond simple API endpoint facades, including bulk operations, intelligent filtering, comparative analysis, and export capabilities. These tools compose existing generated tools and ontology resources to provide higher-level workflows for AI assistants.

**IMPORTANT**: This phase is BLOCKED until all prerequisites are complete:

1. ✅ Phase 0 complete (aggregated tools refactor)
2. ✅ Ontology resource implemented
3. ✅ Semantic search Phase 1 complete
4. ✅ OAuth/Clerk integration complete

### Architecture Principles

#### Schema-First for Non-Upstream Tools

**Challenge**: Advanced tools don't map to single upstream API endpoints. How do we maintain schema-first architecture?

**Solution**: Declarative configuration files + type-gen generation (same as aggregated tools pattern from Phase 0)

```typescript
// Configuration file (checked into git)
// packages/sdks/oak-curriculum-sdk/type-gen/config/advanced-tools.config.json
{
  "version": "1.0.0",
  "tools": {
    "bulk-unit-summaries": {
      "name": "bulk-unit-summaries",
      "title": "Bulk Fetch Unit Summaries",
      "description": "Fetch summaries for multiple units in parallel. More efficient than multiple individual calls.",
      "annotations": {
        "readOnlyHint": true,
        "idempotentHint": true
      },
      "inputSchema": {
        "type": "object",
        "required": ["unitSlugs"],
        "properties": {
          "unitSlugs": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 1,
            "maxItems": 20,
            "description": "Array of unit slugs to fetch (max 20)"
          }
        }
      },
      "composition": {
        "strategy": "parallel-batch",
        "tool": "get-units-summary",
        "batchSize": 5,
        "mapInput": {
          "params.path.unit": "unitSlugs[*]"
        },
        "combineOutput": {
          "strategy": "array-merge",
          "resultKey": "units"
        }
      }
    }
  }
}
```

**Type-Gen Generator**:

- Reads configuration
- Generates tool descriptors, validators, executors
- Emits to `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-advanced-tools/`
- Runtime imports and wires generated definitions

**Cardinal Rule Compliance**: Running `pnpm type-gen` regenerates all advanced tool definitions. Runtime code is thin plumbing.

### Advanced Tool Categories

#### Category 1: Batch & Bulk Operations

**Gap Analysis**: Users need efficient multi-entity fetching

**Proposed Tools**:

1. **`bulk-unit-summaries`**
   - Fetch 2-20 unit summaries in parallel
   - Batched execution (5 concurrent requests max)
   - Aggregated error reporting
   - Use case: Comparing multiple units across key stages

2. **`bulk-lesson-details`**
   - Fetch multiple lesson summaries in parallel
   - Optional inclusion of transcripts/assets
   - Use case: Lesson planning across multiple topics

3. **`batch-thread-units`**
   - Fetch units for multiple threads in parallel
   - Deduplicate units appearing in multiple threads
   - Use case: Cross-thread curriculum mapping

**Implementation Pattern**:

- Configuration-driven parallel execution
- Generated at type-gen time
- Runtime executor handles concurrency, batching, error aggregation

#### Category 2: Intelligent Filtering & Discovery

**Gap Analysis**: Generic search tools lack educational context

**Proposed Tools**:

1. **`find-units-by-thread`**
   - Search units belonging to specific threads
   - Filter by key stage, subject, year
   - Return with ontology context (relationships, prerequisites)
   - Use case: Finding all "Geometry" units across key stages

2. **`find-lessons-with-fieldwork`**
   - Identify lessons suitable for fieldwork activities
   - Filter by subject, location type (urban/rural/coastal)
   - Return with practical activity indicators
   - Use case: Planning outdoor education
   - **Note**: Requires upstream metadata enhancement

3. **`discover-progression-pathway`**
   - Show how a topic progresses across key stages
   - Return unit/lesson sequences by year
   - Include prior knowledge requirements
   - Use case: Understanding curriculum vertical progression

**Implementation Pattern**:

- Compose existing generated tools with ontology queries
- Apply educational logic filters
- Enrich results with ontology metadata

#### Category 3: Comparative Analysis

**Gap Analysis**: No tools for comparing curriculum entities

**Proposed Tools**:

1. **`compare-units`**
   - Compare 2-4 units side-by-side
   - Show similarities (shared threads, topics)
   - Show differences (key stage, complexity, prerequisites)
   - Return structured comparison data
   - Use case: Adapting lessons across year groups

2. **`analyse-nc-coverage`**
   - Check which NC statements are covered by selected lessons/units
   - Identify gaps in coverage
   - Return alignment matrix
   - Use case: Curriculum audit and planning

3. **`analyse-unit-progression`**
   - Compare units within a sequence
   - Show learning progression and dependencies
   - Identify optional vs required content
   - Use case: Planning teaching sequence

**Implementation Pattern**:

- Fetch entities via generated tools
- Apply comparison algorithms (pure functions, unit-tested)
- Structure comparison results
- Generated descriptor defines output schema

#### Category 4: Export & Reporting

**Gap Analysis**: No structured export capabilities

**Proposed Tools**:

1. **`export-curriculum-data`**
   - Export lessons/units/sequences in structured formats
   - Formats: JSON, Markdown, CSV
   - Include ontology context and canonical URLs
   - Use case: External tool integration, offline access

2. **`generate-lesson-plan`**
   - Compile lesson summary + assets + quiz into structured plan
   - Template-based formatting (Markdown/HTML)
   - Include provenance and attribution
   - Use case: Teacher-ready lesson documentation

3. **`generate-unit-overview`**
   - Compile unit summary + all lesson overviews
   - Show progression through lessons
   - Include NC coverage and assessment points
   - Use case: Unit planning documentation

**Implementation Pattern**:

- Fetch data via generated tools
- Apply formatting templates (pure functions)
- Generated tool defines output schema and format options

#### Category 5: Context-Aware Recommendations (Future)

**Note**: Depends on AI/ML capabilities - out of scope for initial implementation

**Proposed Tools** (placeholder):

1. **`recommend-lessons`** - Context-aware lesson suggestions
2. **`suggest-adaptations`** - Adaptation suggestions for local context
3. **`find-related-content`** - Semantic similarity-based discovery

**Implementation**: Requires integration with guidance/playbooks system

### Implementation Roadmap

#### Phase 2.1: Configuration & Generator Infrastructure (2 weeks)

**Objective**: Establish configuration format and generator infrastructure

**Tasks**:

1. Design advanced tools configuration schema (JSON Schema + Zod)
2. Create `type-gen/typegen/advanced-tools/` directory
3. Implement configuration loader and validator (TDD)
4. Create generator for batch/parallel tools (TDD)
5. Emit tool descriptors, validators, executors
6. Integrate into `pnpm type-gen` pipeline

**Acceptance**:

- Configuration validates against schema
- Generators emit valid TypeScript
- `pnpm type-gen && pnpm build` succeeds
- Unit tests pass

#### Phase 2.2: Batch Operations Tools (1 week)

**Objective**: Implement first category (bulk fetch tools)

**Tasks**:

1. Define `bulk-unit-summaries` configuration (TDD)
2. Generate tool definition
3. Implement parallel execution logic (TDD)
4. Add error aggregation (TDD)
5. Integration tests with mocked tool executor
6. E2E tests with stubbed API

**Acceptance**:

- Tool appears in MCP server tool list
- Bulk fetch executes correctly
- Error handling works
- All tests pass

#### Phase 2.3: Filtering & Discovery Tools (2 weeks)

**Objective**: Implement intelligent filtering tools

**Tasks**:

1. Define filtering tool configurations (TDD)
2. Implement ontology-aware filtering logic (TDD)
3. Generate tools with ontology integration
4. Add educational context enrichment
5. Integration and E2E tests

**Acceptance**:

- Tools compose generated tools + ontology
- Filtering logic is pure and tested
- Results include ontology metadata
- All tests pass

#### Phase 2.4: Comparison Tools (2 weeks)

**Objective**: Implement comparative analysis tools

**Tasks**:

1. Design comparison algorithms (TDD)
2. Implement as pure functions with unit tests
3. Define comparison tool configurations
4. Generate comparison tools
5. Integration and E2E tests

**Acceptance**:

- Comparison algorithms are pure and tested
- Tools provide structured comparison data
- Output schemas are well-defined
- All tests pass

#### Phase 2.5: Export Tools (1 week)

**Objective**: Implement export and reporting tools

**Tasks**:

1. Design template system for exports (TDD)
2. Implement formatters as pure functions
3. Define export tool configurations
4. Generate export tools
5. Integration and E2E tests

**Acceptance**:

- Multiple export formats supported
- Templates are testable
- Provenance and attribution included
- All tests pass

#### Phase 2.6: Documentation & Polish (3 days)

**Objective**: Complete documentation and examples

**Tasks**:

1. Document configuration format
2. Add tool usage examples
3. Update MCP server README
4. Create advanced tools guide
5. Add to agent guidance documentation
6. Run full quality gates

**Acceptance**:

- Documentation complete
- Examples work
- Quality gates pass

### Configuration Schema Design

#### Advanced Tools Config Structure

```typescript
interface AdvancedToolsConfig {
  readonly version: string;
  readonly tools: Record<string, AdvancedToolDefinition>;
}

interface AdvancedToolDefinition {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly annotations?: MCPAnnotations;
  readonly inputSchema: JSONSchema;
  readonly composition: ToolComposition;
}

type ToolComposition =
  | ParallelBatchComposition
  | SequentialComposition
  | ConditionalComposition
  | EnrichmentComposition;

interface ParallelBatchComposition {
  readonly strategy: 'parallel-batch';
  readonly tool: GeneratedToolName;
  readonly batchSize: number;
  readonly mapInput: InputMapping;
  readonly combineOutput: OutputCombination;
}

interface EnrichmentComposition {
  readonly strategy: 'enrich';
  readonly baseTool: GeneratedToolName;
  readonly enrichWith: readonly EnrichmentSource[];
  readonly combineOutput: OutputCombination;
}

interface EnrichmentSource {
  readonly type: 'ontology' | 'tool';
  readonly source: string; // ontology resource URI or tool name
  readonly mapping: FieldMapping;
}
```

#### Generator Output Structure

```plaintext
packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-advanced-tools/
├── index.ts                    # Exports all advanced tools
├── descriptors.ts              # Tool descriptor constants
├── validators.ts               # Input validation functions
├── executors.ts                # Execution logic
├── tools/
│   ├── bulk-unit-summaries.ts  # Complete tool definition
│   ├── bulk-lesson-details.ts
│   └── ...
└── utils/
    ├── batch-coordinator.ts    # Generated batch execution logic
    ├── error-aggregator.ts     # Generated error handling
    └── ontology-enricher.ts    # Generated ontology integration
```

### Testing Strategy

Following `.agent/directives-and-memory/testing-strategy.md`:

1. **Unit Tests**: Pure functions, no I/O, no mocks
   - Configuration validation
   - Input mapping logic
   - Output combination logic
   - Comparison algorithms
   - Export formatters
   - Error aggregation

2. **Integration Tests**: Code units working together, simple injected mocks
   - Tool executor generation
   - Batch coordination
   - Ontology enrichment
   - Error handling across components

3. **E2E Tests**: Running system with side effects
   - Actual tool invocation via MCP protocol
   - Stubbed API responses (no network costs)
   - Full error handling

**TDD Throughout**: Write tests FIRST (Red → Green → Refactor)

### Success Criteria

#### Phase 2 Completion

1. ✅ Configuration format defined and validated
2. ✅ Generators emit valid TypeScript
3. ✅ Generated tools behave correctly
4. ✅ Runtime code is thin plumbing
5. ✅ All tests pass (unit, integration, E2E)
6. ✅ MCP servers expose advanced tools
7. ✅ Documentation complete
8. ✅ Zero hand-written advanced tool code (all generated)

#### Overall Success

1. ✅ Advanced tools provide value beyond simple API calls
2. ✅ Schema-first architecture maintained
3. ✅ Cardinal Rule upheld (pnpm type-gen sufficient)
4. ✅ TDD throughout implementation
5. ✅ Type safety preserved (no shortcuts)
6. ✅ Proper error handling and observability
7. ✅ Comprehensive test coverage
8. ✅ Clear documentation and examples

### Risks and Mitigation

**Risk**: Generated code becomes too complex to debug

- **Mitigation**: Emit readable TypeScript with TSDoc; use simple patterns; add source maps

**Risk**: Configuration format becomes unwieldy

- **Mitigation**: Start simple; iterate based on real needs; validate with JSON Schema

**Risk**: Performance issues with parallel execution

- **Mitigation**: Implement rate limiting; batch size constraints; profile and optimize

**Risk**: Breaking changes to generated tool contracts

- **Mitigation**: Comprehensive E2E tests; MCP protocol stability; semantic versioning

**Risk**: Maintenance burden of custom composition logic

- **Mitigation**: Keep composition strategies simple; reuse patterns; document thoroughly

### Future Enhancements (Out of Scope)

- AI/ML-powered recommendations
- Natural language query interface
- Real-time collaborative planning tools
- Visual curriculum mapping UI
- Integration with external planning tools
- Workflow automation (sequential tool chains)
- User preference learning
- Advanced caching strategies

---

## Quality Gates (All Phases)

After each implementation session:

```bash
pnpm type-gen      # Regenerate all tools
pnpm build         # No type errors
pnpm type-check    # All workspaces type-safe
pnpm lint -- --fix # No linting errors
pnpm test          # Unit + integration tests pass
pnpm test:e2e      # E2E tests pass
```

---

## Summary of Changes

This comprehensive plan combines three previous documents:

1. **Phase 0**: Content from `mcp-aggregated-tools-type-gen-refactor-plan.md`
2. **Phase 1**: Content from `mcp-enhancements-plan.md` (expanded with implementation details)
3. **Phase 2**: Content from `advanced-mcp-tools-plan.md`

**Benefits of consolidation**:

- Single source of truth for MCP enhancement roadmap
- Clear dependency chain (Phase 0 → Phase 1 → Phase 2)
- Consistent architecture patterns across all phases
- Unified testing strategy and quality gates
- Easier to track progress and maintain

---

## Related Documentation

### Implementation Directives

- `.agent/directives-and-memory/rules.md` - Cardinal rule, TDD, type safety
- `.agent/directives-and-memory/schema-first-execution.md` - Generator-first mindset
- `.agent/directives-and-memory/testing-strategy.md` - Unit → integration → E2E

### Related Plans

- `.agent/plans/high-level-plan.md` - Strategic roadmap
- `.agent/plans/curriculum-ontology-resource-plan.md` - Provides structure knowledge for Phase 2
- `.agent/plans/semantic-search/` - Search capabilities used by advanced tools
- `.agent/plans/oak-openai-app-plan.md` - Metadata optimization
- `.agent/plans/external/upstream-api-metadata-wishlist.md` - Upstream enhancements

### Domain Documentation

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
5. Performance characteristics require architecture changes

**Created**: 2025-11-11  
**Last Updated**: 2025-11-11  
**Next Review**: When Prerequisites #1-3 (semantic search, ontology, OAuth) are complete
