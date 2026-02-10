# MCP Aggregated Tools Type-Gen Refactor Plan

## Purpose

Refactor aggregated MCP tools (`search`, `fetch`) from hand-written runtime code to type-gen-generated definitions, establishing the pattern for composite MCP primitives before adding ontology resources and semantic search integration.

## Context and References

- Aligns with `.agent/directives/rules.md` (Cardinal rule: type-gen sufficiency)
- Follows `.agent/directives/schema-first-execution.md` (all complexity at type-gen time)
- Prerequisite for `.agent/plans/curriculum-ontology-resource-plan.md` Sprint 0
- Prerequisite for `.agent/plans/high-level-plan.md` Item #6 (semantic search MCP integration)
- Related to `.agent/plans/oak-openai-app-plan.md` (metadata optimization, tool consistency)

## Problem Statement

**Current state**: Aggregated tools (`search`, `fetch`) are defined in hand-written runtime code:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search.ts` (220 lines)
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts` (~100 lines)
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` (116 lines)

**Issues**:

1. **Duplication**: Tool names, descriptions, schemas defined in separate code from generated tools
2. **Inconsistency**: Generated tools vs aggregated tools follow different patterns
3. **Inflexibility**: Adding semantic search would require more hand-written runtime code
4. **Schema-first violation**: Aggregated tool definitions don't flow from OpenAPI schema or declarative config

**Target state**: All MCP tool definitions (basic + aggregated) generated at type-gen time:

- Configuration files define composition rules for aggregated tools
- Type-gen generators emit tool descriptors, validators, execution logic
- Runtime code imports and wires generated definitions (thin plumbing)
- Adding semantic search = editing config file + running `pnpm type-gen`

## Architecture Overview

### Configuration Format

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
              "params.query.q": "q",
              "params.query.keyStage": "keyStage",
              "params.query.subject": "subject",
              "params.query.unit": "unit"
            }
          },
          {
            "tool": "get-search-transcripts",
            "mapInput": {
              "params.query.q": "q"
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
              "mapInput": { "params.path.lesson": "$1" }
            },
            {
              "pattern": "^unit:(.+)",
              "tool": "get-units-summary",
              "mapInput": { "params.path.unit": "$1" }
            },
            {
              "pattern": "^subject:(.+)",
              "tool": "get-subject-detail",
              "mapInput": { "params.path.subject": "$1" }
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

### Generator Structure

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

### Runtime Integration

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`

**Changes**:

```typescript
// BEFORE: Hand-written aggregated tools
import { SEARCH_INPUT_SCHEMA, validateSearchArgs, runSearchTool } from './aggregated-search.js';
import { FETCH_INPUT_SCHEMA, validateFetchArgs, runFetchTool } from './aggregated-fetch.js';

const AGGREGATED_TOOL_DEFS = {
  search: {
    description: 'Search across lessons and transcripts...',
    inputSchema: SEARCH_INPUT_SCHEMA,
  },
  fetch: {
    description: 'Fetch lesson, unit, subject...',
    inputSchema: FETCH_INPUT_SCHEMA,
  },
} as const;

// AFTER: Import generated aggregated tools
import {
  aggregatedToolNames,
  isAggregatedToolName,
  type AggregatedToolName,
  getAggregatedToolDescriptor,
  validateAggregatedToolInput,
  executeAggregatedTool,
} from '../types/generated/api-schema/mcp-aggregated-tools/index.js';

export type UniversalToolName = AggregatedToolName | ToolName;

export function listUniversalTools(): UniversalToolListEntry[] {
  const aggregatedEntries = aggregatedToolNames.map((name) => {
    const descriptor = getAggregatedToolDescriptor(name);
    return {
      name,
      title: descriptor.title,
      description: descriptor.description,
      inputSchema: descriptor.inputSchema,
      annotations: descriptor.annotations,
    };
  });

  const generatedEntries = toolNames.map((name) => {
    const descriptor = getToolFromToolName(name);
    return {
      name,
      title: descriptor.title,
      description: descriptor.description,
      inputSchema: descriptor.inputSchema,
      annotations: descriptor.annotations,
    };
  });

  return [...aggregatedEntries, ...generatedEntries];
}

export function createUniversalToolExecutor(
  deps: UniversalToolExecutorDependencies,
): (name: UniversalToolName, args: unknown) => Promise<CallToolResult> {
  return async (name: UniversalToolName, args: unknown): Promise<CallToolResult> => {
    if (!isUniversalToolName(name)) {
      return formatUnknownTool(name);
    }

    const input = args === undefined ? {} : args;

    if (isAggregatedToolName(name)) {
      const validation = validateAggregatedToolInput(name, input);
      if (!validation.ok) {
        return formatError(validation.message);
      }
      return executeAggregatedTool(name, validation.value, deps);
    }

    const result = await deps.executeMcpTool(name, input);
    return mapExecutionResult(result);
  };
}
```

## Implementation Plan (TDD Throughout)

### Phase 1: Configuration Schema and Validation (2 days)

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

### Phase 2: Descriptor Generation (2 days)

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

### Phase 3: Validator Generation (2 days)

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

### Phase 4: Executor Generation (3 days)

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

### Phase 5: Runtime Integration (2 days)

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

### Phase 6: Documentation and Polish (1 day)

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

## Testing Strategy

### Unit Tests

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

### Integration Tests

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

### E2E Tests

**MCP server integration**:

- List tools includes aggregated tools
- Call aggregated tools via MCP protocol
- Validate responses match expected structure
- Test both STDIO and HTTP servers

## Quality Gates

After each phase:

1. `pnpm type-gen` - Generators run successfully
2. `pnpm build` - No type errors
3. `pnpm type-check` - All workspaces type-safe
4. `pnpm lint -- --fix` - No linting errors
5. `pnpm test` - All unit/integration tests pass
6. `pnpm test:e2e` - E2E tests pass

## Success Criteria

1. ✅ Config format defined and validated
2. ✅ Generators emit valid TypeScript
3. ✅ Generated tools behave identically to hand-written versions
4. ✅ Runtime code is thin plumbing (imports generated definitions)
5. ✅ All tests pass
6. ✅ MCP servers work unchanged
7. ✅ Documentation complete
8. ✅ Zero hand-written aggregated tool code remains

## Risks and Mitigation

**Risk**: Generated code is harder to debug than hand-written code

- **Mitigation**: Emit readable TypeScript with clear variable names; add TSDoc comments; preserve stack traces in error handling

**Risk**: Config format becomes too complex

- **Mitigation**: Start simple (parallel + route strategies only); iterate based on actual semantic search needs; validate config with JSON Schema

**Risk**: Breaking changes to MCP server behaviour

- **Mitigation**: Comprehensive E2E tests; manual testing in ChatGPT/Cursor before merge; feature flag if needed

**Risk**: Performance regression from generated code

- **Mitigation**: Profile generated executors; compare to hand-written versions; optimize hot paths

## Future Enhancements (Out of Scope)

- Sequential composition strategy (call tools in order, pass output to next)
- Conditional composition (call tool B only if tool A succeeds)
- Aggregated resources (similar pattern for MCP resources)
- Config validation at type-gen time with early error detection
- Visual config builder/editor

## Related Documents

### Implementation Directives

- `.agent/directives/rules.md` - Cardinal rule: type-gen sufficiency
- `.agent/directives/schema-first-execution.md` - Schema-first execution directive
- `.agent/directives/testing-strategy.md` - TDD approach

### Related Plans

- `.agent/plans/high-level-plan.md` - Overall project roadmap (prerequisite for Item #3, #6)
- `.agent/plans/curriculum-ontology-resource-plan.md` - Sprint 0 prerequisite
- `.agent/plans/oak-openai-app-plan.md` - Metadata optimization (benefits from consistent tool patterns)
- `.agent/plans/semantic-search/semantic-search-high-level-plan.md` - MCP integration architecture

### Domain Documentation

- `packages/sdks/oak-curriculum-sdk/README.md` - SDK documentation
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search.ts` - Current search implementation (to be removed)
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts` - Current fetch implementation (to be removed)
