# Curriculum Ontology MCP Resource Implementation Plan

## Purpose

Implement a schema-derived curriculum ontology exposed as an MCP resource, enabling AI agents to understand the Oak Curriculum domain model, entity relationships, and tool composition patterns. The ontology will be split into schema-derived facts (auto-generated) and educational guidance (manual), merged at runtime and exposed via MCP resources.

## Context and References

- Aligns with `.agent/directives-and-memory/rules.md` (Cardinal rule: type-gen sufficiency)
- Follows `.agent/directives-and-memory/schema-first-execution.md` (all complexity at type-gen time)
- Builds on existing aggregated tools pattern (`search`, `fetch` in `packages/sdks/oak-curriculum-sdk/src/mcp/`)
- References existing ontology documentation: `docs/architecture/curriculum-ontology.md`
- Implements Phase 0 Item 8 from `.agent/plans/oak-openai-app-plan.md` (OpenAI App SDK integration)
- Provides interim solution for `.agent/plans/upstream-api-metadata-wishlist.md` Item 3 (upstream `/ontology` endpoint)
- Supports metadata optimization described in `.agent/plans/upstream-api-metadata-wishlist.md` (tool guidance patterns)

## Cardinal Rule Compliance

**Type-gen must be sufficient**: Running `pnpm type-gen` must generate the complete schema-derived ontology JSON **and the resource registration code**. Runtime code is thin plumbing that imports and exposes the generated resources.

## Critical Architectural Note: Move All MCP Definitions to Type-Gen

**Current state**: Aggregated tools (`search`, `fetch`) and resources (ontology) are defined at runtime with hand-written code in `packages/sdks/oak-curriculum-sdk/src/mcp/`.

**Target state**: All MCP tool and resource definitions must be generated at type-gen time to:

1. **Eliminate duplication**: Single source of truth for tool/resource names, descriptions, schemas
2. **Maintain consistency**: Generated tools and aggregated tools follow same patterns
3. **Enable evolution**: When semantic search integrates, it's part of generated `search` tool definition
4. **Enforce schema-first**: All MCP primitives derive from OpenAPI schema + guidance configs

**Implementation approach**:

- Move `aggregated-search.ts`, `aggregated-fetch.ts`, and `ontology-resource.ts` logic into type-gen generators
- Create `type-gen/typegen/mcp-aggregated-tools/` and `type-gen/typegen/mcp-resources/` directories
- Generate tool/resource descriptors, validators, and execution logic at type-gen time
- Runtime code becomes pure plumbing: import generated definitions, wire to MCP SDK

**Priority**: Must happen before semantic search integration (Item #6 in high-level plan) to avoid compounding technical debt.

**Tracking**: This refactor should be added as a prerequisite step in the implementation phases below.

## Architecture Overview

### Two-Layer Ontology

1. **Schema-Derived Layer** (auto-generated at type-gen time)
   - Entities extracted from OpenAPI response schemas
   - Relationships derived from schema structure
   - Enumerations from parameter/field enums
   - Endpoint-to-entity mappings
   - Field types, cardinalities, required/optional
   - Generated: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/curriculum-ontology.schema.json`

2. **Guidance Layer** (hand-authored, version-controlled)
   - Educational context (ages, phases, purposes)
   - Tool composition patterns and workflows
   - Domain knowledge (UK education system)
   - Usage examples and scenarios
   - Interpretation rules
   - Location: `packages/sdks/oak-curriculum-sdk/docs/curriculum-ontology.guidance.json`

3. **Runtime Merge** (thin plumbing)
   - Merge schema + guidance at resource access time
   - Filter by requested entities/format
   - Format as JSON/summary/mermaid
   - Location: `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-resource.ts`

### MCP Resource vs Tool

**Resources** are static/semi-static data that can be read; **Tools** are executable functions. The ontology fits the resource model:

- Static schema facts (change only on schema updates)
- Stable guidance (changes rarely)
- No side effects, no external API calls
- Read-only access pattern
- MCP specification supports resources via `resources/list` and `resources/read`

## Implementation Phases

### Phase 1: Type-Gen Schema Extractor (TDD)

**Objective**: Generate `curriculum-ontology.schema.json` during `pnpm type-gen` by parsing the OpenAPI schema.

#### 1.1 Create Extractor Module

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/ontology/schema-extractor.ts`

**Responsibilities**:

- Parse OpenAPI schema (`api-schema-sdk.json`)
- Extract entities from component schemas
- Derive relationships from nested structures and foreign keys
- Extract enumerations from parameter/field constraints
- Map endpoints to entities
- Output structured JSON

**Interface**:

```typescript
export interface ExtractedEntity {
  readonly id: string;
  readonly label: string;
  readonly definition: string;
  readonly schemaRefs: readonly string[];
  readonly primaryKey: string;
  readonly fields: ReadonlyRecord<string, EntityField>;
}

export interface EntityField {
  readonly type: string;
  readonly required: boolean;
  readonly description?: string;
  readonly schemaRef?: string;
}

export interface ExtractedRelationship {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly type: 'containment' | 'reference' | 'coverage';
  readonly cardinality: 'one-to-one' | 'one-to-many' | 'many-to-many';
  readonly schemaRefs: readonly string[];
  readonly evidence: readonly string[];
}

export interface ExtractedOntology {
  readonly version: string;
  readonly generatedAt: string;
  readonly source: string;
  readonly entities: ReadonlyRecord<string, ExtractedEntity>;
  readonly relationships: ReadonlyRecord<string, ExtractedRelationship>;
  readonly enumerations: ReadonlyRecord<string, ExtractedEnumeration>;
  readonly endpoints: ReadonlyRecord<string, ExtractedEndpoint>;
}

export function extractOntologyFromSchema(schema: OpenAPIObject): ExtractedOntology;
```

**TDD Approach**:

1. Write test: Extract `Lesson` entity from `LessonSummaryResponseSchema`
2. Write test: Extract `Unit-has-Lesson` relationship from nested structure
3. Write test: Extract `KeyStageSlug` enumeration from parameter schema
4. Write test: Map `get-lessons-summary` endpoint to `Lesson` entity
5. Implement extractor to pass tests

**Validation**:

- Unit tests for each extraction function
- Integration test that processes full schema and validates output structure
- Snapshot test for known entity/relationship set

#### 1.2 Integrate into Type-Gen Pipeline

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen.ts`

**Changes**:

```typescript
import { extractOntologyFromSchema } from './typegen/ontology/schema-extractor.js';

// After schema loading...
const extractedOntology = extractOntologyFromSchema(sdkSchema);

// Write to generated directory
const ontologyOutputPath = path.join(outDirectory, 'curriculum-ontology.schema.json');
writeFileSync(ontologyOutputPath, JSON.stringify(extractedOntology, null, 2));
```

**Validation**:

- `pnpm type-gen` generates `curriculum-ontology.schema.json`
- File is valid JSON and matches `ExtractedOntology` type
- Git diff shows expected changes when schema evolves

#### 1.3 Entity Extraction Rules

**Entities are derived from**:

- Response schemas ending in `ResponseSchema`
- Primary keys identified by fields ending in `Slug` or explicit PK patterns
- Nested objects within response schemas (e.g., `Quiz`, `Question`, `Answer`)

**Heuristics**:

- `LessonSummaryResponseSchema` → `Lesson` entity with `lessonSlug` PK
- `SequenceUnitsResponseSchema.units[]` → `Unit` entity with `unitSlug` PK
- Nested `questions[]` → `Question` entity

**Test cases**:

- Extract core entities: Lesson, Unit, Sequence, Subject
- Extract nested entities: Quiz, Question, Answer, Asset
- Extract metadata entities: KeyStage, Phase, YearGroup
- Handle optional fields correctly

#### 1.4 Relationship Extraction Rules

**Relationships are derived from**:

- Foreign key fields (e.g., `unitSlug` in Lesson → Unit relationship)
- Nested arrays (e.g., `units[]` in Sequence → many Units)
- Coverage fields (e.g., `keyStages[]` → Subject covers KeyStages)

**Heuristics**:

- Field ending in `Slug` referencing another entity → `reference` relationship
- Array of nested objects → `containment` relationship
- Array of references → `coverage` or `many-to-many` relationship

**Evidence tracking**:

```typescript
{
  "id": "Unit-has-Lesson",
  "evidence": [
    "KeyStageSubjectLessonsResponseSchema contains lessons array",
    "LessonSummaryResponseSchema has unitSlug foreign key"
  ]
}
```

#### 1.5 Enumeration Extraction Rules

**Enumerations are derived from**:

- Parameter schemas with `enum` constraints
- Response field schemas with `enum` constraints
- OpenAPI `enum` definitions in components

**Test cases**:

- Extract `KeyStageSlug`: `["ks1", "ks2", "ks3", "ks4"]`
- Extract `SubjectSlug`: full list from parameter schema
- Extract `AssetType`: from asset response schemas
- Extract `QuestionType`: from quiz schemas

#### 1.6 Endpoint Mapping Rules

**Endpoints are mapped to**:

- Primary entity returned (from response schema analysis)
- Relationships exercised (from path parameters and nesting)
- Query capabilities (from query parameter schemas)

**Test cases**:

- `get-lessons-summary` → returns `Lesson`, uses `Lesson-belongs_to-Unit` relationship
- `get-key-stages-subject-lessons` → returns `Lesson[]`, exercises `Unit-has-Lesson`
- `get-search-lessons` → returns `Lesson[]`, uses search similarity

### Phase 2: Manual Guidance JSON (Hand-Authored)

**Objective**: Create version-controlled educational and tooling guidance.

#### 2.1 Create Guidance Schema

**File**: `packages/sdks/oak-curriculum-sdk/docs/curriculum-ontology.guidance.schema.json`

Define JSON schema for guidance validation:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["version", "educationalContext", "toolCompositionPatterns"],
  "properties": {
    "version": { "type": "string" },
    "maintainedBy": { "type": "string" },
    "lastUpdated": { "type": "string", "format": "date" },
    "educationalContext": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["purpose", "audience"],
        "properties": {
          "purpose": { "type": "string" },
          "audience": { "type": "string" },
          "typicalUse": { "type": "string" }
        }
      }
    },
    "toolCompositionPatterns": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["name", "description", "useWhen", "steps"],
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "useWhen": { "type": "string" },
          "steps": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["tool", "purpose"],
              "properties": {
                "tool": { "type": "string" },
                "purpose": { "type": "string" },
                "parameters": { "type": "object" },
                "optional": { "type": "boolean" }
              }
            }
          }
        }
      }
    }
  }
}
```

#### 2.2 Populate Guidance JSON

**File**: `packages/sdks/oak-curriculum-sdk/docs/curriculum-ontology.guidance.json`

**Content sections**:

1. **Educational Context**: Purpose, audience, typical use for each entity
2. **Tool Composition Patterns**: Discovery, lesson planning, unit overview workflows
3. **Workflow Examples**: Concrete scenarios with step-by-step tool usage
4. **Domain Knowledge**: Key stage ages/years, hierarchy, UK education context
5. **Interpretation Rules**: Year normalization, canonical URL patterns

**Validation**:

- JSON validates against guidance schema
- References valid entity IDs from schema-derived ontology
- Tool names match generated MCP tool names
- Version follows semantic versioning

#### 2.3 Guidance Versioning

**Version format**: `major.minor.patch`

- **Major**: Breaking changes to guidance structure (e.g., rename sections)
- **Minor**: Add new patterns, examples, or entities
- **Patch**: Typo fixes, clarifications, small improvements

**Git workflow**:

- Guidance changes reviewed by curriculum team
- Schema changes reviewed by engineering team
- Both tracked in separate commits for clarity

### Phase 3: MCP Resource Exposure (Thin Runtime)

**Objective**: Merge schema + guidance at runtime; expose as MCP resources.

#### 3.1 Create Ontology Resource Module

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-resource.ts`

**Responsibilities**:

- Import generated schema JSON
- Import guidance JSON
- Merge both layers on demand
- Support filtering and formatting
- Provide resource URIs

**Interface**:

```typescript
export interface OntologyResourceOptions {
  readonly format?: 'full' | 'schema-only' | 'guidance-only' | 'summary';
  readonly entities?: readonly string[];
  readonly relationships?: readonly string[];
  readonly includeExamples?: boolean;
}

export interface MergedOntology {
  readonly version: {
    readonly schema: string;
    readonly guidance: string;
    readonly combined: string;
  };
  readonly generatedAt: string;
  readonly entities: ReadonlyRecord<string, EnrichedEntity>;
  readonly relationships: ReadonlyRecord<string, EnrichedRelationship>;
  readonly enumerations: ReadonlyRecord<string, EnrichedEnumeration>;
  readonly toolGuidance: ReadonlyRecord<string, ToolCompositionPattern>;
  readonly examples?: readonly WorkflowExample[];
  readonly domainKnowledge: DomainKnowledge;
}

export function getOntologyResource(options?: OntologyResourceOptions): MergedOntology;

export function listOntologyResources(): ResourceListEntry[];
```

**TDD Approach**:

1. Write test: Import schema JSON successfully
2. Write test: Import guidance JSON successfully
3. Write test: Merge produces expected structure
4. Write test: Filter by entity returns subset
5. Write test: Format='summary' returns condensed version
6. Implement merge and filtering logic

**Validation**:

- Unit tests for merge logic
- Unit tests for filtering
- Unit tests for format variants
- Integration test with real schema + guidance JSONs

#### 3.2 Resource URI Design

**Resource URIs**:

- `curriculum://ontology/schema` - Schema-derived facts only
- `curriculum://ontology/guidance` - Educational guidance only
- `curriculum://ontology/full` - Merged full ontology
- `curriculum://ontology/summary` - Condensed version
- `curriculum://ontology/entities/{entityId}` - Single entity detail
- `curriculum://ontology/relationships/{relationshipId}` - Single relationship detail

**Resource metadata**:

```typescript
{
  uri: 'curriculum://ontology/full',
  name: 'Oak Curriculum Ontology',
  description: 'Complete curriculum domain model with schema facts and educational guidance',
  mimeType: 'application/json'
}
```

#### 3.3 Register Resources in Universal MCP

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-resources.ts` (new)

**Responsibilities**:

- List available ontology resources
- Handle resource read requests
- Validate resource URIs
- Format responses

**Interface**:

```typescript
export function listUniversalResources(): ResourceListEntry[];

export function readUniversalResource(uri: string): ResourceContent;

export function isUniversalResourceUri(value: unknown): value is UniversalResourceUri;
```

**Integration with MCP SDK**:

```typescript
// In MCP server setup (stdio/http)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources: listUniversalResources() };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  return readUniversalResource(uri);
});
```

#### 3.4 Format Variants

**Full format** (`format: 'full'`):

- Complete schema entities + relationships
- Complete guidance patterns + examples
- ~5-10KB JSON

**Schema-only format** (`format: 'schema-only'`):

- Only schema-derived facts
- No educational context or workflows
- ~3-5KB JSON

**Guidance-only format** (`format: 'guidance-only'`):

- Only educational context and workflows
- No schema structure details
- ~3-5KB JSON

**Summary format** (`format: 'summary'`):

- Entity names and primary relationships only
- Top 3 tool composition patterns
- No examples, no field details
- ~1-2KB JSON (token-efficient for context-limited agents)

### Phase 4: Testing Strategy (TDD Throughout)

#### 4.1 Unit Tests

**Schema Extractor**:

- `schema-extractor.unit.test.ts`
- Test entity extraction from known schemas
- Test relationship derivation rules
- Test enumeration extraction
- Test endpoint mapping

**Ontology Resource**:

- `ontology-resource.unit.test.ts`
- Test schema + guidance merge
- Test filtering by entity/relationship
- Test format variants
- Test resource URI validation

#### 4.2 Integration Tests

**Type-Gen Pipeline**:

- `ontology-generation.integration.test.ts`
- Run type-gen on test schema
- Validate generated `curriculum-ontology.schema.json` structure
- Ensure known entities present
- Ensure relationships derived correctly

**MCP Resource Flow**:

- `ontology-resource-mcp.integration.test.ts`
- Register resources in test MCP server
- List resources via MCP protocol
- Read resource via MCP protocol
- Validate response format

#### 4.3 E2E Tests (Stubbed)

**Ontology Resource Access**:

- `ontology-resource.e2e.test.ts`
- Start stubbed MCP server
- Request `curriculum://ontology/full`
- Validate merged ontology structure
- Request filtered view
- Validate subset returned

#### 4.4 Validation Tests

**JSON Schema Validation**:

- Guidance JSON validates against guidance schema
- Generated schema JSON validates against schema ontology type
- Merged ontology validates against combined type

**Reference Integrity**:

- Guidance references valid schema entities
- Tool names in workflows match generated tool names
- Relationship sources/targets reference valid entities

### Phase 5: Documentation and Maintenance

#### 5.1 Update Existing Docs

**Files to update**:

- `docs/architecture/curriculum-ontology.md` - Reference new structure
- `packages/sdks/oak-curriculum-sdk/README.md` - Document ontology resource
- `.agent/plans/oak-openai-app-plan.md` - Update Phase 0 Item 8 with implementation details

**Content**:

- Explain two-layer architecture
- Document resource URIs
- Provide usage examples
- Link to guidance schema

#### 5.2 Generator Documentation

**TSDoc in generator**:

```typescript
/**
 * Extracts curriculum ontology from OpenAPI schema.
 *
 * This generator parses the Open Curriculum API OpenAPI schema and derives:
 * - Entities from response schemas
 * - Relationships from nested structures and foreign keys
 * - Enumerations from parameter/field constraints
 * - Endpoint-to-entity mappings
 *
 * The extracted ontology is written to `curriculum-ontology.schema.json` and
 * merged with hand-authored guidance at runtime.
 *
 * @param schema - The OpenAPI schema object
 * @returns Extracted ontology structure
 * @see packages/sdks/oak-curriculum-sdk/docs/curriculum-ontology.guidance.json
 */
export function extractOntologyFromSchema(schema: OpenAPIObject): ExtractedOntology;
```

#### 5.3 Maintenance Protocol

**When OpenAPI schema changes**:

1. Run `pnpm type-gen`
2. Review generated `curriculum-ontology.schema.json` diff
3. Update guidance JSON if new entities/relationships added
4. Run full test suite
5. Review merged ontology output

**When guidance changes**:

1. Edit `curriculum-ontology.guidance.json`
2. Validate against guidance schema
3. Run guidance validation tests
4. Commit with clear description of pedagogical changes

**Ownership**:

- **Schema extraction**: Engineering team
- **Guidance content**: Curriculum/product team
- **Integration**: Engineering team

## Implementation Order

### Sprint 0: Refactor Aggregated Tools to Type-Gen (3-5 days) ⚠️ **PREREQUISITE**

**Objective**: Move `search` and `fetch` tools from runtime to type-gen generation.

**Tasks**:

1. Create `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-aggregated-tools/` directory
2. Create aggregated tool configuration format (JSON/TypeScript config defining composition rules)
3. Implement generator for `search` tool (calls `get-search-lessons` + `get-search-transcripts`)
4. Implement generator for `fetch` tool (routes by canonical ID prefix)
5. Generate tool descriptors, input schemas, validators, execution logic
6. Update `universal-tools.ts` to import generated aggregated tools instead of hand-written
7. Remove `aggregated-search.ts` and `aggregated-fetch.ts` runtime files
8. Update tests to use generated tools
9. Validate `pnpm type-gen && pnpm build && pnpm test`

**Acceptance**: Aggregated tools are generated at type-gen time; runtime code imports generated definitions; all tests pass; no change to MCP server behaviour.

**Rationale**: Establishes pattern for type-gen-generated composite MCP primitives before adding ontology resources and semantic search.

### Sprint 1: Foundation (1 week)

1. Create schema extractor module skeleton
2. Implement entity extraction (TDD)
3. Write unit tests for entity extraction
4. Implement relationship extraction (TDD)
5. Write unit tests for relationship extraction
6. Integrate into type-gen pipeline
7. Validate generated schema JSON

**Acceptance**: `pnpm type-gen` generates valid `curriculum-ontology.schema.json`

### Sprint 2: Guidance and Merge (1 week)

1. Create guidance schema definition
2. Populate guidance JSON with initial content
3. Create ontology resource module
4. Implement merge logic (TDD)
5. Write unit tests for merge
6. Implement filtering and formatting
7. Write unit tests for variants

**Acceptance**: Ontology resource merges schema + guidance correctly

### Sprint 3: MCP Resource Generation (1 week)

**Objective**: Generate ontology resource definitions at type-gen time; expose via thin runtime plumbing.

**Tasks**:

1. Create `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-resources/` directory
2. Create resource generator that emits resource descriptors, URIs, and access logic
3. Generate ontology resource definitions from schema JSON + guidance JSON at type-gen time
4. Update `universal-tools.ts` (or create `universal-resources.ts`) to import generated resources
5. Register resources in MCP servers (stdio + http) using generated definitions
6. Write integration tests for resource generation
7. Write E2E tests for resource access (stubbed)
8. Update documentation

**Acceptance**: Resources generated at type-gen time; accessible via MCP protocol in both servers; runtime code is thin plumbing

### Sprint 4: Polish and Validation (3 days)

1. Add format variants (summary, mermaid)
2. Implement resource filtering
3. Add validation tests
4. Update all documentation
5. Run full quality gate
6. Capture walkthrough for OpenAI App SDK plan

**Acceptance**: All tests pass; documentation complete; ready for OpenAI App SDK integration

## Quality Gates

After each sprint:

1. `pnpm type-gen` - Schema extraction succeeds
2. `pnpm build` - No type errors
3. `pnpm type-check` - All workspaces type-safe
4. `pnpm lint -- --fix` - No linting errors
5. `pnpm test` - All unit/integration tests pass
6. `pnpm test:e2e` - E2E tests pass
7. `pnpm markdownlint` - Documentation valid

## Success Criteria

1. ✅ `pnpm type-gen` generates complete schema-derived ontology
2. ✅ Guidance JSON validates against schema
3. ✅ Resources accessible via MCP protocol
4. ✅ Filter by entity/relationship works
5. ✅ Format variants return correct structure
6. ✅ All tests pass
7. ✅ Documentation complete
8. ✅ Zero manual schema maintenance (all flows from OpenAPI)

## Risks and Mitigation

**Risk**: Schema extraction heuristics miss important relationships

- **Mitigation**: Comprehensive test suite with known entities; manual review of generated ontology; iterate on extraction rules

**Risk**: Guidance JSON gets out of sync with schema

- **Mitigation**: Validation tests check references; automated checks in CI; clear ownership and review process

**Risk**: Ontology too large for token-constrained agents

- **Mitigation**: Summary format provides condensed view; filtering by entity reduces size; mermaid format for human review

**Risk**: Type-gen performance degrades with complex extraction

- **Mitigation**: Profile extractor; cache intermediate results; optimize hot paths; extraction is one-time at build

## Future Enhancements (Out of Scope for Initial Implementation)

- Mermaid diagram generation from ontology JSON
- JSON-LD format with `@context` for semantic web compatibility
- Ontology versioning and diff detection
- Interactive ontology explorer UI
- Ontology-driven code generation (e.g., graph traversal helpers)
- **Integration with upstream API `/ontology` endpoint when available** (see `.agent/plans/upstream-api-metadata-wishlist.md` Item 3 for upstream requirements)

## Relationship to Upstream API Work

This implementation provides an **interim solution** while the upstream API team develops the official `/ontology` endpoint (`.agent/plans/upstream-api-metadata-wishlist.md` Item 3).

### Current Approach (Shimmed at MCP Layer)

- ✅ **Immediate value**: AI agents get curriculum structure knowledge now
- ✅ **Zero upstream dependency**: No API changes required
- ✅ **Schema-first**: Auto-updates when OpenAPI schema evolves
- ⚠️ **Duplication**: Schema extraction logic lives in MCP layer

### Future Approach (Upstream API Endpoint)

When upstream delivers `/ontology`:

1. **Replace schema extraction**: Consume upstream endpoint instead of parsing OpenAPI at type-gen
2. **Retain guidance layer**: Educational context and tool workflows remain MCP-specific
3. **Benefit all consumers**: Not just MCP/AI; all API consumers get ontology access
4. **Single source of truth**: Upstream owns curriculum structure definitions

### Migration Strategy

Phase 1 (Current): Shimmed implementation per this plan
Phase 2 (Future): Hybrid – consume upstream schema facts, merge with local guidance
Phase 3 (Ideal): Full upstream integration with MCP-layer guidance overlay

This approach provides immediate value while aligning with long-term upstream API architecture.

## Related Documents

### Implementation Directives

- `.agent/directives-and-memory/rules.md` - Cardinal rule: type-gen sufficiency; TDD approach
- `.agent/directives-and-memory/schema-first-execution.md` - Schema-first execution directive
- `docs/agent-guidance/testing-strategy.md` - Testing strategy for unit/integration/E2E tests

### Related Plans

- `.agent/plans/oak-openai-app-plan.md` - OpenAI App SDK integration plan (Phase 0 Item 8)
- `.agent/plans/upstream-api-metadata-wishlist.md` - Upstream API enhancement wishlist (Item 3: `/ontology` endpoint)
- `.agent/plans/semantic-search/snagging-resolution-plan.md` - Current SDK quality gate process

### Domain Documentation

- `docs/architecture/curriculum-ontology.md` - Existing ontology documentation (basis for guidance JSON)
- `packages/sdks/oak-curriculum-sdk/README.md` - SDK documentation (to be updated with resource usage)
