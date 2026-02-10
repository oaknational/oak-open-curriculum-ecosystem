# Advanced MCP Tools Implementation Plan

**Status**: FUTURE (Priority 4 - after ontology, OAuth, semantic search)  
**Created**: 2025-10-28  
**Owner**: Engineering

## Purpose

This plan defines advanced MCP tooling beyond simple API endpoint facades, including bulk operations, intelligent filtering, comparative analysis, and export capabilities. These tools compose existing generated tools and ontology resources to provide higher-level workflows for AI assistants.

**IMPORTANT**: This is a FUTURE priority. Current priorities are:

1. ✅ Semantic search (Phase 1 in progress)
2. 🔄 Ontology resource implementation
3. 🔄 OAuth/Clerk integration
4. ⏸ Advanced tooling (THIS PLAN - deferred)

## Context and References

### Alignment with Core Directives

- **.agent/directives/rules.md** – Cardinal Rule, TDD, type safety, no shortcuts
- **.agent/directives/schema-first-execution.md** – All runtime behaviour driven by generated artefacts
- **.agent/directives/testing-strategy.md** – TDD-first, unit → integration → E2E
- **.agent/plans/high-level-plan.md** – Strategic roadmap (Items #1-3 are prerequisites)
- **.agent/plans/curriculum-ontology-resource-plan.md** – Provides curriculum structure knowledge required for intelligent tools
- **.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md** – Pattern for composite tools

### Related Plans

- `.agent/plans/curriculum-tools-guidance-playbooks-plan.md` – Overlapping vision (Phase 1 complete, rest deferred)
- `.agent/plans/mcp-enhancements-plan.md` – **TO DELETE** (low quality, superseded by this plan)
- `.agent/plans/upstream-api-metadata-wishlist.md` – Upstream API improvements that would benefit advanced tools

## Prerequisites (MUST Complete Before Starting)

### 1. ✅ Aggregated Tools Moved to Type-Gen (Sprint 0)

**Current State**: ❌ NOT DONE

- `search` and `fetch` tools are still hand-written runtime code:
  - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search.ts` (225 lines)
  - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts` (~100 lines)
  - `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` (118 lines)

**Required**: Complete `.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md` Sprint 0

**Why**: Establishes the pattern for type-gen-generated composite MCP primitives. All advanced tools MUST follow this pattern.

### 2. ✅ Ontology Resource Implemented

**Current State**: ❌ NOT DONE

No type-gen generators in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/ontology/`

**Required**: Complete `.agent/plans/curriculum-ontology-resource-plan.md`

**Why**: Advanced tools require curriculum structure knowledge (relationships, hierarchies, metadata) to provide intelligent filtering and recommendations.

### 3. ✅ Semantic Search Phase 1 Complete

**Current State**: 🔄 IN PROGRESS

Phase 1 functionality work is ongoing. Status-aware response handling completed.

**Required**: Complete `.agent/plans/semantic-search/semantic-search-high-level-plan.md` Phase 1

**Why**: Several advanced tools depend on semantic search capabilities (contextual recommendations, intelligent filtering).

## Architecture Principles

### Schema-First for Non-Upstream Tools

**Challenge**: Advanced tools don't map to single upstream API endpoints. How do we maintain schema-first architecture?

**Solution**: Declarative configuration files + type-gen generation (same as aggregated tools pattern)

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

### Testing Strategy

Following `.agent/directives/testing-strategy.md`:

1. **Unit Tests**: Pure functions, no I/O, no mocks
   - Configuration validation
   - Input mapping logic
   - Output combination logic

2. **Integration Tests**: Code units working together, simple injected mocks
   - Tool executor generation
   - Batch coordination
   - Error aggregation

3. **E2E Tests**: Running system with side effects
   - Actual tool invocation via MCP protocol
   - Stubbed API responses (no network costs)

**TDD Throughout**: Write tests FIRST (Red → Green → Refactor)

## Advanced Tool Categories

### Category 1: Batch & Bulk Operations

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

### Category 2: Intelligent Filtering & Discovery

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

### Category 3: Comparative Analysis

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

### Category 4: Export & Reporting

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

### Category 5: Context-Aware Recommendations (Future)

**Note**: Depends on AI/ML capabilities - out of scope for initial implementation

**Proposed Tools** (placeholder):

1. **`recommend-lessons`** - Context-aware lesson suggestions
2. **`suggest-adaptations`** - Adaptation suggestions for local context
3. **`find-related-content`** - Semantic similarity-based discovery

**Implementation**: Requires integration with guidance/playbooks system (`.agent/plans/curriculum-tools-guidance-playbooks-plan.md`)

## Implementation Roadmap

### Phase 0: Foundation (Prerequisites)

**Blocked until complete**:

1. ✅ Complete aggregated tools refactor (Sprint 0)
2. ✅ Implement ontology resource
3. ✅ Complete semantic search Phase 1

**Acceptance**: All prerequisites green, pattern established for type-gen composite tools

### Phase 1: Configuration & Generator Infrastructure (2 weeks)

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

### Phase 2: Batch Operations Tools (1 week)

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

### Phase 3: Filtering & Discovery Tools (2 weeks)

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

### Phase 4: Comparison Tools (2 weeks)

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

### Phase 5: Export Tools (1 week)

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

### Phase 6: Documentation & Polish (3 days)

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

## Configuration Schema Design

### Advanced Tools Config Structure

```typescript
interface AdvancedToolsConfig {
  readonly version: string;
  readonly tools: Record<string, AdvancedToolDefinition>;
}

interface AdvancedToolDefinition {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly annotations?: MCP Annotations;
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

### Generator Output Structure

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

## Testing Strategy

### Unit Test Coverage

**Pure Functions**:

- Configuration validation
- Input mapping logic
- Output combination logic
- Comparison algorithms
- Export formatters
- Error aggregation

**Example**:

```typescript
// bulk-unit-summaries.unit.test.ts
describe('bulkUnitSummariesInputMapper', () => {
  it('maps array of slugs to individual tool calls', () => {
    const input = { unitSlugs: ['unit-1', 'unit-2', 'unit-3'] };
    const result = bulkUnitSummariesInputMapper(input);

    expect(result).toEqual([
      { params: { path: { unit: 'unit-1' } } },
      { params: { path: { unit: 'unit-2' } } },
      { params: { path: { unit: 'unit-3' } } },
    ]);
  });

  it('validates max items constraint', () => {
    const input = { unitSlugs: new Array(21).fill('unit') };
    const result = validateBulkUnitSummariesInput(input);

    expect(result.ok).toBe(false);
    expect(result.error).toContain('maximum 20 units');
  });
});
```

### Integration Test Coverage

**Code Units Working Together**:

- Tool executor generation
- Batch coordinator with simple mocks
- Ontology enrichment with mock resource
- Error handling across components

**Example**:

```typescript
// bulk-unit-summaries.integration.test.ts
describe('bulkUnitSummaries execution', () => {
  it('coordinates parallel tool calls with batching', async () => {
    const mockExecutor = vi.fn().mockResolvedValue({ ok: true, data: { unitSlug: 'test' } });

    const deps = { executeMcpTool: mockExecutor };
    const executor = createBulkUnitSummariesExecutor(deps);

    const input = { unitSlugs: ['unit-1', 'unit-2', 'unit-3'] };
    const result = await executor(input);

    expect(mockExecutor).toHaveBeenCalledTimes(3);
    expect(result.ok).toBe(true);
    expect(result.data.units).toHaveLength(3);
  });
});
```

### E2E Test Coverage

**Running System**:

- MCP server exposes advanced tools
- Tools invoke generated tools via MCP protocol
- Stubbed API responses (no network costs)
- Full error handling

**Example**:

```typescript
// bulk-unit-summaries.e2e.test.ts
describe('MCP bulk-unit-summaries tool', () => {
  it('fetches multiple unit summaries via MCP protocol', async () => {
    const server = await startStubMcpServer();
    const client = await createMcpClient(server);

    const result = await client.callTool('bulk-unit-summaries', {
      unitSlugs: ['unit-1', 'unit-2'],
    });

    expect(result.content[0].type).toBe('text');
    const data = JSON.parse(result.content[0].text);
    expect(data.units).toHaveLength(2);
  });
});
```

## Quality Gates

After each phase:

```bash
pnpm type-gen      # Regenerate all advanced tools
pnpm build         # No type errors
pnpm type-check    # All workspaces type-safe
pnpm lint -- --fix # No linting errors
pnpm test          # Unit + integration tests pass
pnpm test:e2e      # E2E tests pass
```

## Success Criteria

### Phase Completion

1. ✅ Configuration format defined and validated
2. ✅ Generators emit valid TypeScript
3. ✅ Generated tools behave correctly
4. ✅ Runtime code is thin plumbing
5. ✅ All tests pass (unit, integration, E2E)
6. ✅ MCP servers expose advanced tools
7. ✅ Documentation complete
8. ✅ Zero hand-written advanced tool code (all generated)

### Overall Success

1. ✅ Advanced tools provide value beyond simple API calls
2. ✅ Schema-first architecture maintained
3. ✅ Cardinal Rule upheld (pnpm type-gen sufficient)
4. ✅ TDD throughout implementation
5. ✅ Type safety preserved (no shortcuts)
6. ✅ Proper error handling and observability
7. ✅ Comprehensive test coverage
8. ✅ Clear documentation and examples

## Risks and Mitigation

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

## Future Enhancements (Out of Scope)

- AI/ML-powered recommendations
- Natural language query interface
- Real-time collaborative planning tools
- Visual curriculum mapping UI
- Integration with external planning tools
- Workflow automation (sequential tool chains)
- User preference learning
- Advanced caching strategies

## Related Documentation

### Implementation Directives

- `.agent/directives/rules.md` - Cardinal rule, TDD, type safety
- `.agent/directives/schema-first-execution.md` - Generator-first mindset
- `.agent/directives/testing-strategy.md` - Unit → integration → E2E

### Related Plans

- `.agent/plans/high-level-plan.md` - Strategic roadmap (Items #1-3 are prerequisites)
- `.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md` - Pattern to follow
- `.agent/plans/curriculum-ontology-resource-plan.md` - Provides structure knowledge
- `.agent/plans/curriculum-tools-guidance-playbooks-plan.md` - Overlapping vision (deferred)
- `.agent/plans/upstream-api-metadata-wishlist.md` - Upstream enhancements

### Domain Documentation

- `packages/sdks/oak-curriculum-sdk/README.md` - SDK documentation
- `docs/architecture/curriculum-ontology.md` - Domain model
- `apps/oak-curriculum-mcp-stdio/README.md` - MCP server usage
- `apps/oak-curriculum-mcp-streamable-http/README.md` - HTTP MCP server

## Plan Maintenance

This plan will be updated when:

1. Prerequisites are completed (promote from FUTURE to ACTIVE)
2. Configuration format evolves based on implementation learnings
3. New tool categories are identified
4. Upstream API changes affect tool capabilities
5. Performance characteristics require architecture changes

**Last Updated**: 2025-10-28  
**Next Review**: When prerequisites #1-3 are complete
