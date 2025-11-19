# P0: MCP Flat Schema - Generator-First Implementation

**Date**: November 18, 2024  
**Priority**: P0 - Critical (Blocks parameter visibility in MCP clients)  
**Status**: Planning  
**Implements**: Generator-produced flat schema for MCP tool registration  
**Supersedes**: `.agent/plans/archive/p0-mcp-flat-schema-type-safety.md`

---

## EXECUTIVE SUMMARY

This plan implements flat parameter schema generation at compile time, eliminating the need for runtime unwrapping. The generator will emit both nested (for SDK ergonomics) and flat (for MCP registration) schema formats.

**Key Insight**: The generator already has all the information and infrastructure needed. Adding flat schema emission is ~20 lines of code that reuses existing helpers.

**Alignment**:

- ✅ Schema-First Execution: "Update templates and rerun `pnpm type-gen`"
- ✅ Cardinal Rule: "ALL types generated at compile time ONLY"
- ✅ Rules.md: "NEVER create compatibility layers"
- ✅ First Question: "Could it be simpler?" - YES! 20 LOC vs 300 LOC

---

## PROBLEM STATEMENT

### The Issue

Our generated MCP tool schemas use a nested structure that MCP clients cannot navigate:

```typescript
// What we generate (nested)
{
  params: z.object({
    query: z.object({
      q: z.string(),
      keyStage: z.union([...])
    })
  })
}

// What MCP SDK expects (flat)
{
  q: z.string(),
  keyStage: z.union([...])
}
```

**Impact in Cursor UI**:

```text
Parameters:
• params: No description
```

Instead of:

```text
Parameters:
• q: string - Search query
• keyStage: enum - Key stage filter (ks1, ks2, ks3, ks4)
```

### Root Cause

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`

Lines 176-181 wrap everything in `params`:

```typescript
return {
  type: 'object',
  properties: { params: paramsSchema }, // ← Wraps all parameters
  required: ['params'],
  additionalProperties: false,
};
```

Lines 147-167 further nest into `path` and `query` sub-objects.

This nested structure serves internal SDK type safety but breaks MCP parameter discovery.

### Why TypeScript Didn't Catch This

`ZodRawShape` is defined as:

```typescript
type ZodRawShape = { [k: string]: ZodTypeAny };
```

This index signature is too permissive - both structures type-check:

- `{ q: z.string() }` ✅ (flat, correct)
- `{ params: z.object({ q: z.string() }) }` ✅ (nested, incorrect but passes)

The MCP SDK's `registerTool` cannot distinguish at compile time.

---

## SOLUTION APPROACH

### Generator-First Strategy

Generate **two schema formats** at compile time:

1. **Nested** (`toolZodSchema`, `toolInputJsonSchema`): Current structure for SDK ergonomics
2. **Flat** (`toolMcpFlatInputSchema`): New flat structure for MCP registration

Both generated from the same source data (OpenAPI schema), no runtime transformation needed.

### Why This is The Correct Approach

**From Schema-First Execution Directive**:

> "When behaviour needs to change, update the templates under `type-gen/typegen/mcp-tools/**/*` and rerun `pnpm type-gen`."

**From Rules.md**:

> "NEVER create compatibility layers, no backwards compatibility - replace old approaches with new approaches"

**From Cardinal Rule**:

> "ALL static data structures, types, type guards, Zod schemas... MUST be generated at compile time ONLY"

**Generator fix**: ✅ Implements all three perfectly  
**Runtime unwrapping**: ❌ Violates all three

### Complexity Comparison

**Generator Approach** (This Plan):

- Add `buildFlatMcpZodObject()`: ~15 LOC (reuses existing `buildZodFields()`)
- Modify `inputSchemaBlock()`: ~3 LOC
- Emit flat schema: ~1 LOC
- Update descriptor export: ~1 LOC
- Update registration: ~1 LOC change
- **Total: ~21 LOC across 5 files**
- **No technical debt, permanent solution**

**Runtime Unwrapping** (Rejected):

- Unwrapping function: ~100 LOC
- Unit tests: ~100 LOC
- Integration tests: ~100 LOC
- Navigate Zod internals
- **Total: ~300 LOC + ongoing maintenance**
- **Technical debt until eventual removal**

---

## IMPLEMENTATION PLAN

### Phase 1: Write Failing Generator Tests (TDD - Red)

**Objective**: Prove generator should emit flat MCP schema

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.unit.test.ts` (new file)

**Why Unit Test**:

- Tests pure function (no I/O, no side effects)
- Per `@testing-strategy.md`: "Pure functions have unit tests"
- Generator functions are pure transformations

**Test Strategy**:

```typescript
import { describe, it, expect } from 'vitest';
import { buildFlatMcpZodObject } from './emit-input-schema.js';
import type { ParamMetadataMap } from './param-metadata.js';

describe('buildFlatMcpZodObject', () => {
  describe('flattening path and query parameters', () => {
    it('should flatten query parameters to top level', () => {
      // Arrange
      const pathParams: ParamMetadataMap = {};
      const queryParams: ParamMetadataMap = {
        q: {
          name: 'q',
          typePrimitive: 'string',
          required: true,
          description: 'Search query',
        },
        limit: {
          name: 'limit',
          typePrimitive: 'number',
          required: false,
        },
      };

      // Act
      const result = buildFlatMcpZodObject(pathParams, queryParams);

      // Assert: Should generate flat Zod object string
      expect(result).toContain('z.object({');
      expect(result).toContain('q: z.string()');
      expect(result).toContain('limit: z.number().optional()');
      expect(result).not.toContain('params');
      expect(result).not.toContain('query');
    });

    it('should flatten path parameters to top level', () => {
      const pathParams: ParamMetadataMap = {
        keyStage: {
          name: 'keyStage',
          typePrimitive: 'string',
          required: true,
          allowedValues: ['ks1', 'ks2', 'ks3', 'ks4'],
          valueConstraint: 'enum',
        },
      };
      const queryParams: ParamMetadataMap = {};

      const result = buildFlatMcpZodObject(pathParams, queryParams);

      expect(result).toContain('keyStage: z.union([');
      expect(result).toContain('z.literal("ks1")');
      expect(result).not.toContain('params');
      expect(result).not.toContain('path');
    });

    it('should merge path and query parameters in flat structure', () => {
      const pathParams: ParamMetadataMap = {
        keyStage: {
          name: 'keyStage',
          typePrimitive: 'string',
          required: true,
          allowedValues: ['ks1', 'ks2'],
          valueConstraint: 'enum',
        },
      };
      const queryParams: ParamMetadataMap = {
        subject: {
          name: 'subject',
          typePrimitive: 'string',
          required: false,
        },
      };

      const result = buildFlatMcpZodObject(pathParams, queryParams);

      // Both parameters at top level
      expect(result).toContain('keyStage: z.union([');
      expect(result).toContain('subject: z.string().optional()');
      expect(result).not.toContain('params');
    });

    it('should handle zero parameters (empty object)', () => {
      const pathParams: ParamMetadataMap = {};
      const queryParams: ParamMetadataMap = {};

      const result = buildFlatMcpZodObject(pathParams, queryParams);

      expect(result).toBe('z.object({})');
    });
  });

  describe('preserving parameter metadata', () => {
    it('should preserve enum values', () => {
      const queryParams: ParamMetadataMap = {
        status: {
          name: 'status',
          typePrimitive: 'string',
          required: true,
          allowedValues: ['active', 'inactive'],
          valueConstraint: 'enum',
        },
      };

      const result = buildFlatMcpZodObject({}, queryParams);

      expect(result).toContain('z.literal("active")');
      expect(result).toContain('z.literal("inactive")');
    });

    it('should preserve optional/required distinction', () => {
      const queryParams: ParamMetadataMap = {
        required: {
          name: 'required',
          typePrimitive: 'string',
          required: true,
        },
        optional: {
          name: 'optional',
          typePrimitive: 'string',
          required: false,
        },
      };

      const result = buildFlatMcpZodObject({}, queryParams);

      expect(result).toContain('required: z.string()');
      expect(result).toContain('optional: z.string().optional()');
    });

    it('should handle array types', () => {
      const queryParams: ParamMetadataMap = {
        tags: {
          name: 'tags',
          typePrimitive: 'string[]',
          required: false,
        },
      };

      const result = buildFlatMcpZodObject({}, queryParams);

      expect(result).toContain('tags: z.array(z.string()).optional()');
    });
  });
});
```

**Expected Result**: Tests FAIL (Red) - function doesn't exist yet

### Phase 2: Implement Generator Function (TDD - Green)

**Objective**: Create pure function that generates flat Zod schema string

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`

**Implementation**:

````typescript
/**
 * Build a flat Zod object for MCP tool registration.
 *
 * Merges path and query parameters into a single flat object structure
 * that MCP clients can navigate to discover individual parameters.
 *
 * This differs from buildZodObject which creates nested structure
 * (params → path/query) for internal SDK type safety.
 *
 * @param pathParams - Path parameter metadata from OpenAPI
 * @param queryParams - Query parameter metadata from OpenAPI
 * @returns Zod schema string with flat parameter structure
 *
 * @example
 * ```typescript
 * // Input: path: { id: 'ks1' }, query: { q: 'search' }
 * // Output: "z.object({ id: z.string(), q: z.string() })"
 * ```
 *
 * @remarks
 * - Reuses existing buildZodFields() for type generation
 * - Parameters appear at top level (no params/path/query nesting)
 * - Path parameters listed before query parameters
 * - MCP clients can discover and document each parameter individually
 *
 * @see buildZodObject - Generates nested structure for SDK internal use
 * @see .agent/plans/p0-mcp-flat-schema-generator-fix.md
 * @see .agent/research/deep-reflection-schema-first-and-findings.md (Priority 0)
 */
export function buildFlatMcpZodObject(
  pathParams: ParamMetadataMap,
  queryParams: ParamMetadataMap,
): string {
  // Merge path and query parameters - path first for consistency
  const allEntries = [...Object.entries(pathParams), ...Object.entries(queryParams)];

  // Handle zero-parameter tools
  if (allEntries.length === 0) {
    return 'z.object({})';
  }

  // Reuse existing buildZodFields which handles all type generation logic:
  // - Enum unions (z.literal values)
  // - Optional parameters (.optional())
  // - Array types
  // - Primitive types
  const fields = buildZodFields(allEntries).join(', ');

  return `z.object({ ${fields} })`;
}
````

**Why This Works**:

- Reuses `buildZodFields()` which already handles all parameter type logic
- No duplication of type generation code
- Pure function (deterministic, no side effects)
- Simple 15-line implementation

**Expected Result**: Unit tests PASS (Green)

### Phase 3: Integrate into Schema Generation

**Objective**: Emit flat schema alongside nested schema

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-schema.ts`

**Changes to `inputSchemaBlock()` function** (lines 136-147):

```typescript
function inputSchemaBlock(
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): { jsonLiteral: string; zodLiteral: string; flatMcpZodLiteral: string } {
  const schemaObject = buildInputSchemaObject(pathParamMetadata, queryParamMetadata);
  const propertiesLiteral = JSON.stringify(schemaObject.properties);
  const requiredKeys = schemaObject.required ?? [];
  const requiredPart = requiredKeys.length > 0 ? `, required: ${JSON.stringify(requiredKeys)}` : '';

  const jsonLiteral = `export const toolInputJsonSchema = { type: 'object' as const, properties: ${propertiesLiteral} as const, additionalProperties: false as const${requiredPart} };`;

  const zodLiteral = `export const toolZodSchema = ${buildZodObject(pathParamMetadata, queryParamMetadata)};`;

  // NEW: Generate flat schema for MCP registration
  const flatMcpZodLiteral = `export const toolMcpFlatInputSchema = ${buildFlatMcpZodObject(pathParamMetadata, queryParamMetadata)};`;

  return { jsonLiteral, zodLiteral, flatMcpZodLiteral };
}
```

**Changes to `emitSchema()` function** (lines 149-163):

```typescript
export function emitSchema(
  operation: OperationObject,
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): string {
  void operation;
  const lines: string[] = [];
  lines.push(buildHeaderBlock(pathParamMetadata, queryParamMetadata));

  const { jsonLiteral, zodLiteral, flatMcpZodLiteral } = inputSchemaBlock(
    pathParamMetadata,
    queryParamMetadata,
  );

  lines.push(jsonLiteral);
  lines.push(zodLiteral);
  lines.push(flatMcpZodLiteral); // NEW: Emit flat schema
  lines.push('export type ToolInputSchema = z.infer<typeof toolZodSchema>;');
  lines.push(emitErrorDescription(pathParamMetadata, queryParamMetadata));

  return lines.join('\n');
}
```

**Add import at top of file**:

```typescript
import {
  buildInputSchemaObject,
  buildZodObject,
  buildFlatMcpZodObject,
} from './emit-input-schema.js';
```

### Phase 4: Include in Tool Descriptor

**Objective**: Export flat schema from each tool descriptor

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts`

**Changes to descriptor export** (around line 105):

```typescript
export const ${descriptorName} = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    // ... existing invoke implementation
  },
  toolZodSchema,
  toolInputJsonSchema,
  toolMcpFlatInputSchema,  // NEW: Include flat schema
  toolOutputJsonSchema: primaryResponseDescriptor.json,
  zodOutputSchema: primaryResponseDescriptor.zod,
  describeToolArgs,
  inputSchema: toolInputJsonSchema,
  operationId,
  name,
  // ... rest of descriptor
```

### Phase 5: Update Tool Descriptor Contract

**Objective**: Add flat schema field to ToolDescriptor interface

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`

**Note**: This file may be generated. If so, update the template that generates it.

**Add field to interface**:

```typescript
export interface ToolDescriptor<
  TName extends string,
  TClient,
  TArgs,
  TResult,
  TStatus extends string | number = string | number,
> extends Tool {
  readonly name: TName;
  readonly description?: string;

  // Existing nested schemas (for SDK internal use)
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    readonly properties?: Record<string, unknown>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolZodSchema: z.ZodType<TArgs>;

  // NEW: Flat schema for MCP registration
  readonly toolMcpFlatInputSchema: z.ZodRawShape;

  // ... rest of interface
}
```

**Add TSDoc comment**:

```typescript
/**
 * Flat Zod schema for MCP tool registration.
 *
 * Contains all parameters (path + query) at top level without nesting.
 * Use this for McpServer.registerTool() to enable parameter discovery.
 *
 * @remarks
 * MCP clients require flat parameter structure to discover and document
 * individual parameters. The nested toolZodSchema is used for SDK validation.
 *
 * @see .agent/plans/p0-mcp-flat-schema-generator-fix.md
 */
readonly toolMcpFlatInputSchema: z.ZodRawShape;
```

### Phase 6: Generate and Verify

**Objective**: Run type generation and verify output

**Commands**:

```bash
# Navigate to SDK
cd packages/sdks/oak-curriculum-sdk

# Run type generation
pnpm type-gen

# Verify build still works
pnpm build

# Run tests
pnpm test
```

**Verification**:

1. Check generated tool files have `toolMcpFlatInputSchema` export
2. Verify flat schema contains parameters at top level
3. Type-check passes
4. Existing tests still pass

**Example Generated Output** (`get-search-lessons.ts`):

```typescript
export const toolInputJsonSchema = {
  /* nested structure */
};
export const toolZodSchema = z.object({
  params: z.object({
    /* nested */
  }),
});
export const toolMcpFlatInputSchema = z.object({
  q: z.string(),
  keyStage: z
    .union([z.literal('ks1'), z.literal('ks2'), z.literal('ks3'), z.literal('ks4')])
    .optional(),
  subject: z.string().optional(),
  unit: z.string().optional(),
});
```

### Phase 7: Update MCP Server Registration

**Objective**: Use flat schema for MCP tool registration

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/server.ts`

**Current code** (around line 225-240):

```typescript
const input = zodRawShapeFromToolInputJsonSchema(descriptor.inputSchema);

server.registerTool(
  name,
  {
    title: name,
    description,
    inputSchema: input, // ← Currently uses converted nested schema
  },
  handler,
);
```

**Updated code**:

```typescript
// Use generated flat schema directly - no conversion needed
server.registerTool(
  name,
  {
    title: name,
    description,
    inputSchema: descriptor.toolMcpFlatInputSchema, // ← Use flat schema
  },
  handler,
);
```

**Benefits**:

- No runtime conversion needed
- No `zodRawShapeFromToolInputJsonSchema()` call needed
- Direct use of generated schema
- Simpler code

**Note**: The `zodRawShapeFromToolInputJsonSchema()` function can be removed entirely if no longer used elsewhere.

### Phase 8: Integration Test for MCP Protocol Compliance

**Objective**: Prove that registered tools have flat parameter structure in MCP protocol

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/server.integration.test.ts` (new file)

**Why Integration Test**:

- Tests code units working together (McpServer + our registration)
- Does NOT spawn processes or make network calls
- Imports code directly, runs in-process
- Per `@testing-strategy.md`: "Integration tests import and test code directly"

**Test Strategy**:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { ListToolsResultSchema } from '@modelcontextprotocol/sdk/types.js';
import { registerMcpTools } from './server.js';
import { MCP_TOOL_DESCRIPTORS } from '@oaknational/oak-curriculum-sdk';

describe('MCP Tool Registration - Flat Parameter Structure', () => {
  let server: McpServer;
  let client: Client;
  let transport: InMemoryTransport;

  beforeEach(() => {
    server = new McpServer({
      name: 'test-server',
      version: '1.0.0',
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });

    // Connect
    void server.connect(serverTransport);
    void client.connect(clientTransport);
  });

  it('should register tools with flat parameter structure (not nested)', async () => {
    // Arrange: Register tools using our registration function
    const descriptors = Object.values(MCP_TOOL_DESCRIPTORS);
    const stubExecutor = async () => ({
      content: [{ type: 'text' as const, text: 'stub' }],
    });

    // Act: Register tools
    registerMcpTools(server, descriptors, stubExecutor);

    // Request tool list via MCP protocol
    const response = await client.request({ method: 'tools/list' }, ListToolsResultSchema);

    // Assert: Check tool with known parameters
    const searchTool = response.tools.find((t) => t.name === 'get-search-lessons');
    expect(searchTool, 'get-search-lessons tool should exist').toBeDefined();

    // Should have inputSchema with properties at top level
    expect(searchTool!.inputSchema).toBeDefined();
    expect(searchTool!.inputSchema.type).toBe('object');
    expect(searchTool!.inputSchema.properties).toBeDefined();

    // CRITICAL: Parameters at top level, NOT nested in 'params'
    expect(searchTool!.inputSchema.properties.q).toBeDefined(); // ✅ Flat
    expect(searchTool!.inputSchema.properties.keyStage).toBeDefined(); // ✅ Flat

    // Should NOT have nested structure
    expect(searchTool!.inputSchema.properties.params).toBeUndefined(); // ❌ No wrapper
  });

  it('should handle tools with zero parameters', async () => {
    const descriptors = Object.values(MCP_TOOL_DESCRIPTORS);
    const stubExecutor = async () => ({
      content: [{ type: 'text' as const, text: 'stub' }],
    });

    registerMcpTools(server, descriptors, stubExecutor);

    const response = await client.request({ method: 'tools/list' }, ListToolsResultSchema);

    const subjectsTool = response.tools.find((t) => t.name === 'get-subjects');
    expect(subjectsTool, 'get-subjects tool should exist').toBeDefined();

    // Should have empty properties, not { params: {} }
    expect(subjectsTool!.inputSchema.type).toBe('object');
    const props = subjectsTool!.inputSchema.properties || {};
    expect(Object.keys(props)).toHaveLength(0); // Empty object
    expect(props.params).toBeUndefined(); // No params wrapper
  });

  it('should preserve parameter types and constraints', async () => {
    const descriptors = Object.values(MCP_TOOL_DESCRIPTORS);
    const stubExecutor = async () => ({
      content: [{ type: 'text' as const, text: 'stub' }],
    });

    registerMcpTools(server, descriptors, stubExecutor);

    const response = await client.request({ method: 'tools/list' }, ListToolsResultSchema);

    const searchTool = response.tools.find((t) => t.name === 'get-search-lessons');
    const props = searchTool!.inputSchema.properties;

    // Check string parameter
    expect(props.q.type).toBe('string');

    // Check enum parameter
    expect(props.keyStage.enum).toBeDefined();
    expect(props.keyStage.enum).toContain('ks1');
    expect(props.keyStage.enum).toContain('ks2');
  });
});
```

**Expected Result**: Tests PASS - flat parameters visible in MCP protocol

### Phase 9: Manual Verification in Cursor

**Objective**: Verify parameters visible in Cursor UI

**Steps**:

1. Build and run the MCP server:

   ```bash
   cd apps/oak-curriculum-mcp-stdio
   pnpm build
   pnpm dev
   ```

2. Connect with Cursor (following existing MCP setup)

3. Inspect `get-search-lessons` tool in Cursor UI

4. **Expected UI Display**:

   ```text
   Parameters:
   • q: string - Search query
   • keyStage: enum - Key stage (ks1, ks2, ks3, ks4)
   • subject: string (optional) - Subject filter
   • unit: string (optional) - Unit filter
   ```

5. **NOT Expected** (old broken behavior):

   ```text
   Parameters:
   • params: No description
   ```

---

## TESTING STRATEGY

### Test Hierarchy

Per `@testing-strategy.md`:

1. **Unit Tests** (`*.unit.test.ts`):
   - Test `buildFlatMcpZodObject()` function
   - Pure function, no side effects, no I/O
   - Fast, deterministic, no mocks
   - Tests transformation logic in isolation

2. **Integration Tests** (`*.integration.test.ts`):
   - Test `registerMcpTools()` with MCP SDK
   - Code units working together (in-process)
   - Simple mocks (stub tool executor)
   - Verifies MCP protocol compliance

3. **Manual Verification**:
   - Run actual MCP server with Cursor
   - Validates end-to-end behavior
   - Not automated (would require Cursor API access)

### TDD Flow

1. **Red**: Write failing tests (Phases 1, 8)
2. **Green**: Implement solution (Phases 2-7)
3. **Refactor**: Clean up if needed (as we go)

### What We're Testing

✅ **Testing Behavior** (correct):

- Generator produces flat schema string
- MCP protocol sees flat parameters
- Zero-param tools handled correctly
- Parameter metadata preserved

❌ **Not Testing Implementation** (correct):

- Not testing string manipulation details
- Not testing MCP SDK internals
- Not testing Zod internals

---

## ALIGNMENT WITH DIRECTIVES

### Schema-First Execution (@schema-first-execution.md)

| Requirement                                                | How We Align                                 |
| ---------------------------------------------------------- | -------------------------------------------- |
| "Update templates under type-gen/ and rerun pnpm type-gen" | ✅ Exactly our approach                      |
| "Runtime files act only as very thin façades"              | ✅ Registration just uses generated schema   |
| "Generator is single source of truth"                      | ✅ Both schemas generated at compile time    |
| "No runtime modification of types"                         | ✅ No transformation, use generated directly |
| "Fail fast at generation time"                             | ✅ Build fails if generation fails           |
| "Generator-first mindset"                                  | ✅ Fix in generator, not runtime workaround  |

**Prohibited Practices We Avoid**:

- ✅ NOT hand-authoring runtime helpers that transform types
- ✅ NOT introducing fallbacks that cope with missing data
- ✅ NOT re-validating in runtime (validation via generated schema)

### Core Rules (@rules.md)

| Rule                                                   | How We Align                                   |
| ------------------------------------------------------ | ---------------------------------------------- |
| "First Question: Could it be simpler?"                 | ✅ YES! 21 LOC vs 300 LOC                      |
| "Cardinal Rule: ALL types from schema at compile time" | ✅ Flat schema generated via pnpm type-gen     |
| "TDD - Write tests FIRST"                              | ✅ Tests in Phases 1 & 8, implementation after |
| "NEVER create compatibility layers"                    | ✅ No runtime transformation layer             |
| "No backwards compatibility"                           | ✅ Replace approach at source (generator)      |
| "Pure functions first"                                 | ✅ buildFlatMcpZodObject is pure               |
| "Fail fast with helpful errors"                        | ✅ Build fails if generator fails              |
| "No type shortcuts (any, as, !)"                       | ✅ Generator emits properly typed schemas      |

### Testing Strategy (@testing-strategy.md)

| Principle                                      | How We Align                                            |
| ---------------------------------------------- | ------------------------------------------------------- |
| "TDD - tests first"                            | ✅ Unit tests (Phase 1) before implementation (Phase 2) |
| "Test behavior, not implementation"            | ✅ Test output structure, not internal logic            |
| "Pure functions have unit tests"               | ✅ buildFlatMcpZodObject tested in isolation            |
| "Integration tests for units working together" | ✅ Server registration + MCP SDK protocol test          |
| "No complex mocks"                             | ✅ Simple stub executor in integration test             |
| "Each proof happens once"                      | ✅ No duplicate test cases                              |

---

## BENEFITS OF GENERATOR APPROACH

### Simplicity

- **21 LOC** vs 300 LOC runtime unwrapping
- Reuses existing `buildZodFields()` infrastructure
- No navigation of Zod internals (`_def`, `shape()`)
- Direct schema usage, no runtime transformation

### Alignment with Architecture

- ✅ Schema-first execution (generator produces both formats)
- ✅ Cardinal rule (compile-time generation)
- ✅ No compatibility layers (fix at source)
- ✅ Type safety preserved (generated schemas)

### Maintainability

- No technical debt to remove later
- Permanent solution
- Changes in one place (generator)
- Clear separation of concerns (nested for SDK, flat for MCP)

### Developer Experience

- Parameters visible in Cursor UI
- Parameter types discoverable
- LLMs can understand tool signatures
- Better error messages (will improve further with P1 descriptions)

---

## RISKS AND MITIGATION

### Risk 1: Breaking Changes to Generated Code

**Risk**: Consumers depend on generated descriptor structure

**Likelihood**: LOW - We're adding a field, not changing existing ones

**Mitigation**:

- Additive change only (new field)
- Existing `toolZodSchema` and `toolInputJsonSchema` unchanged
- Apps opt-in by using new field
- Backwards compatible

### Risk 2: Generator Test Coverage

**Risk**: Generator tests might not catch all edge cases

**Likelihood**: MEDIUM - Generator is complex

**Mitigation**:

- Comprehensive unit tests for new function
- Integration test proves MCP protocol compliance
- Manual verification in Cursor
- Existing generator test suite catches regressions

### Risk 3: OpenAPI Schema Edge Cases

**Risk**: Unusual parameter structures might not work

**Likelihood**: LOW - We're reusing proven `buildZodFields()`

**Mitigation**:

- Leverages same logic as nested schema generation
- If nested works, flat will work (same building blocks)
- Test with various parameter types
- Can extend tests as edge cases discovered

---

## SUCCESS CRITERIA

### Implementation Complete When:

1. ✅ Unit tests pass (`buildFlatMcpZodObject`)
2. ✅ Integration tests pass (MCP protocol compliance)
3. ✅ Generator runs without errors (`pnpm type-gen`)
4. ✅ All generated files include `toolMcpFlatInputSchema`
5. ✅ MCP server builds successfully
6. ✅ Type-checks pass across all workspaces
7. ✅ Existing tests still pass (no regressions)
8. ✅ Manual verification in Cursor shows flat parameters
9. ✅ No linter errors

### Validation Checklist:

```bash
# Generate types
cd packages/sdks/oak-curriculum-sdk
pnpm type-gen

# Unit tests
pnpm test emit-input-schema.unit.test.ts

# Type-check
pnpm type-check

# Build SDK
pnpm build

# Build and test MCP server
cd ../../apps/oak-curriculum-mcp-stdio
pnpm build
pnpm test server.integration.test.ts

# Type-check
pnpm type-check

# Lint
pnpm lint

# Manual test
pnpm dev
# → Connect Cursor
# → Inspect tool signatures
# → Verify individual parameters visible
```

---

## FOLLOW-UP WORK (Out of Scope)

These improvements build on the flat schema foundation but are separate tasks:

### Priority 1: Add Descriptions to Zod Schemas

- Emit `.describe()` calls in generated Zod
- Preserve descriptions in flat schema
- Improves error messages and documentation

### Priority 2: Consolidate JSON Schema Types

- Create single shared JSON Schema type definition
- Import in generator, runtime, and contract
- Reduces duplication from 3 to 1

### Priority 3: Make Descriptions Required at Generation Time

- Generator fails if OpenAPI operation lacks description
- Remove runtime description check
- Fail fast at build time

### Priority 4: Remove z.any() Fallback

- Replace with helpful TypeError
- Forces generator to support all needed types
- Closes type system holes

### Priority 5: Improve Error Message Formatting

- Use Zod's detailed error information
- Format with field paths and specific issues
- Leverages work from P1 (descriptions)

---

## REFERENCES

**Project Directives**:

- `.agent/directives-and-memory/schema-first-execution.md`
- `.agent/directives-and-memory/rules.md`
- `docs/agent-guidance/testing-strategy.md`

**Research Documents**:

- `.agent/research/deep-reflection-schema-first-and-findings.md` (Priority 0)
- `.agent/research/mcp-tool-description-schema-flow-analysis.md` (Section 5.0)
- `.agent/research/mcp-sdk-type-reuse-investigation.md` (Additional Finding 1)

**Superseded Plans**:

- `.agent/plans/archive/p0-mcp-flat-schema-type-safety.md` (Runtime unwrapping approach)

**MCP Documentation**:

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification - Tools](https://modelcontextprotocol.io/specification/latest/server/tools)

**Implementation Files**:

- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-schema.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts`
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`
- `apps/oak-curriculum-mcp-stdio/src/app/server.ts`

---

**END OF PLAN**
