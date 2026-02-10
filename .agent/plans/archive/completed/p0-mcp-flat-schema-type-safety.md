# P0: MCP Flat Schema Type Safety Implementation Plan

**Date**: November 18, 2024  
**Priority**: P0 - Critical (Blocks P1 parameter descriptions from being visible)  
**Status**: Won't Fix - This is a generator bug, and we will fix it in the generator.
**Implements**: Type-safe unwrapping of nested params structure for MCP registration

---

## PROBLEM STATEMENT

### The Issue

Our generated MCP tool schemas use a nested structure that does not match the expected flat structure from MCP clients:

```typescript
// What we generate and pass to registerTool
{
  params: z.object({
    query: z.object({
      q: z.string(),
      keyStage: z.union([...]).optional()
    })
  })
}

// What MCP SDK expects (flat structure)
{
  q: z.string(),
  keyStage: z.union([...]).optional()
}
```

**Impact**: Cursor UI shows "params: No description" instead of showing individual parameters.

### Why TypeScript Didn't Catch This

The `ZodRawShape` type is defined as:

```typescript
type ZodRawShape = { [k: string]: ZodTypeAny };
```

This index signature is **too permissive** - it allows:

- `{ q: z.string() }` ✅ (flat, correct)
- `{ params: z.object({ q: z.string() }) }` ✅ (nested, incorrect but type-checks)

Both type-check successfully because both are "objects with string keys and Zod types as values."

The MCP SDK's `registerTool` signature:

```typescript
registerTool<InputArgs extends ZodRawShape = ZodRawShape>(
  name: string,
  options: { inputSchema?: InputArgs },
  handler: (args: z.infer<z.ZodObject<InputArgs>>) => Promise<CallToolResult>
): void
```

**Cannot distinguish** between flat and nested structures at compile time due to the permissive index signature.

---

## SOLUTION APPROACH

### Three-Pronged Strategy

1. **Behavioral Test**: Prove MCP protocol compliance (test the behavior, not implementation)
2. **Runtime Validation**: Simple validation function using type predicates and spread operator
3. **Long-Term Architecture**: Generate dedicated flat schema (future work)

This aligns with:

- **@rules.md**: Fail fast, no type shortcuts, TDD, **First Question: "Could it be simpler?"**
- **@schema-first-execution.md**: Generator-first mindset, fail at generation/build time
- **@testing-strategy.md**: Test behavior, not implementation

---

## IMPLEMENTATION PLAN

### Phase 1: Behavioral Test (TDD - Red)

**Objective**: Prove that registered tools have flat parameter structure in MCP protocol

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/server.integration.test.ts` (new file)

**Why Integration Test**:

- Tests code units working together (McpServer + our registration logic)
- Does NOT spawn processes or make network calls
- Imports code directly, runs in-process
- Per `@testing-strategy.md`: "Integration tests import and test code directly"

**Test Strategy**:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { registerMcpTools } from './server.js';
import { MCP_TOOL_DESCRIPTORS } from '@oaknational/oak-curriculum-sdk';

describe('MCP Tool Registration - Parameter Structure', () => {
  let server: McpServer;
  let client: Client;
  let transport: InMemoryTransport;

  beforeEach(() => {
    server = new McpServer({ name: 'test', version: '1.0.0' });
    transport = new InMemoryTransport();
    client = new Client(
      { name: 'test-client', version: '1.0.0' },
      {
        capabilities: {},
      },
    );

    // Connect server and client
    server.connect(transport);
    client.connect(transport);
  });

  it('should register tools with flat parameter structure (not nested in params)', async () => {
    // Arrange: Register our MCP tools
    const descriptors = Object.values(MCP_TOOL_DESCRIPTORS);
    const stubExecutor = async () => ({
      content: [{ type: 'text' as const, text: 'stub' }],
    });

    // Act: Register tools using our registration function
    await registerMcpTools(server, descriptors, stubExecutor);

    // Request tool list from server via MCP protocol
    const response = await client.request(
      {
        method: 'tools/list',
      },
      ListToolsResultSchema,
    );

    // Assert: Check tool with known parameters
    const searchTool = response.tools.find((t) => t.name === 'get-search-lessons');
    expect(searchTool).toBeDefined();

    // Should have inputSchema with flat parameters at top level
    expect(searchTool.inputSchema).toBeDefined();
    expect(searchTool.inputSchema.type).toBe('object');

    // CRITICAL: Parameters should be at top level, NOT nested in 'params'
    expect(searchTool.inputSchema.properties).toBeDefined();
    expect(searchTool.inputSchema.properties.q).toBeDefined(); // ✅ Flat
    expect(searchTool.inputSchema.properties.keyStage).toBeDefined(); // ✅ Flat

    // Should NOT have nested structure
    expect(searchTool.inputSchema.properties.params).toBeUndefined(); // ❌ No wrapper
  });

  it('should handle tools with zero parameters', async () => {
    // Similar test for get-subjects (no params tool)
    const descriptors = Object.values(MCP_TOOL_DESCRIPTORS);
    const stubExecutor = async () => ({
      content: [{ type: 'text' as const, text: 'stub' }],
    });

    await registerMcpTools(server, descriptors, stubExecutor);

    const response = await client.request(
      {
        method: 'tools/list',
      },
      ListToolsResultSchema,
    );

    const subjectsTool = response.tools.find((t) => t.name === 'get-subjects');
    expect(subjectsTool).toBeDefined();

    // Should have empty properties or no required params
    expect(subjectsTool.inputSchema.type).toBe('object');
    const props = subjectsTool.inputSchema.properties || {};
    expect(Object.keys(props)).toHaveLength(0); // Empty, not { params: {} }
  });
});
```

**Expected Result**: Tests FAIL (Red) - our current implementation registers nested structure

### Phase 2: Type-Safe Unwrapping Function

**Objective**: Create runtime function that validates flat structure using type predicates

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/flat-mcp-schema.ts` (new file)

**Why New File**:

- Single responsibility (flattening logic)
- Easier to test in isolation
- Clear module boundary

**Implementation**:

````typescript
import type { z } from 'zod';

/**
 * Type guard to check if a Zod type is a ZodObject.
 *
 * @param zodType - Any Zod type
 * @returns True if the type is a ZodObject
 */
function isZodObject(zodType: z.ZodTypeAny): zodType is z.ZodObject<z.ZodRawShape> {
  return zodType._def?.typeName === 'ZodObject';
}

/**
 * Unwraps our nested params/query/path structure into a flat structure
 * suitable for MCP SDK registration.
 *
 * Our generated schemas use:
 * ```
 * { params: { query: {...}, path: {...} } }
 * ```
 *
 * MCP SDK expects:
 * ```
 * { param1: z.string(), param2: z.number(), ... }
 * ```
 *
 * This function flattens the nested structure so parameters are
 * discoverable by MCP clients (Cursor, Claude Desktop, etc.).
 *
 * @param zodRawShape - Our generated nested Zod RawShape
 * @returns Flat Zod RawShape suitable for MCP registration
 * @throws {TypeError} If the structure is invalid or cannot be flattened safely
 *
 * @remarks
 * This is a SHORT-TERM fix. Long-term, the generator should produce
 * a dedicated flat schema field (toolMcpFlatZodSchema).
 *
 * Uses spread operator instead of Object.assign to preserve Zod types.
 * No type assertions - validation is separate.
 *
 * @see .agent/plans/p0-mcp-flat-schema-type-safety.md
 * @see .agent/research/deep-reflection-schema-first-and-findings.md (Priority 0)
 */
export function unwrapToFlatMcpSchema(zodRawShape: z.ZodRawShape): z.ZodRawShape {
  // Check if already flat (no params wrapper)
  if (!zodRawShape['params']) {
    validateNoNestedObjects(zodRawShape);
    return zodRawShape;
  }

  const paramsSchema = zodRawShape['params'];

  // Ensure params is a ZodObject
  if (!isZodObject(paramsSchema)) {
    throw new TypeError(
      'Expected params to be a ZodObject, got: ' +
        paramsSchema._def?.typeName +
        '. This is a generator bug - all tool schemas must have object-type params.',
    );
  }

  const paramsShape = paramsSchema._def.shape();

  // Build flat shape using spread operator (preserves types)
  let flatShape: z.ZodRawShape = {};

  for (const [key, value] of Object.entries(paramsShape)) {
    if (key === 'query' || key === 'path') {
      if (!isZodObject(value)) {
        throw new TypeError(
          `Expected ${key} to be a ZodObject, got: ${value._def?.typeName}. ` +
            'This is a generator bug - parameter groups must be objects.',
        );
      }

      const nestedShape = value._def.shape();

      // Check for collisions BEFORE merging
      for (const nestedKey of Object.keys(nestedShape)) {
        if (flatShape[nestedKey] !== undefined) {
          throw new TypeError(
            `Parameter name collision: '${nestedKey}' appears in both path and query parameters. ` +
              'This is an OpenAPI schema bug - parameter names must be unique.',
          );
        }
      }

      // Use spread operator to preserve types
      flatShape = { ...flatShape, ...nestedShape };
    } else {
      // Use spread operator to add field
      flatShape = { ...flatShape, [key]: value };
    }
  }

  validateNoNestedObjects(flatShape);
  return flatShape;
}

/**
 * Validates that a ZodRawShape has no nested ZodObjects at top level.
 *
 * @param shape - The shape to validate
 * @throws {TypeError} If the shape contains nested objects
 */
function validateNoNestedObjects(shape: z.ZodRawShape): void {
  for (const [key, value] of Object.entries(shape)) {
    if (isZodObject(value)) {
      throw new TypeError(
        `Parameter '${key}' is a nested object. ` +
          'MCP schemas must have flat parameter structure. ' +
          'This indicates the unwrapping logic failed or generator produced invalid structure.',
      );
    }
  }
}
````

**Unit Tests** (`flat-mcp-schema.unit.test.ts`):

```typescript
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { unwrapToFlatMcpSchema } from './flat-mcp-schema.js';

describe('unwrapToFlatMcpSchema', () => {
  describe('flattening nested structure', () => {
    it('should flatten query parameters to top level', () => {
      // Arrange: Nested structure like our generator produces
      const nested = {
        params: z.object({
          query: z.object({
            q: z.string(),
            limit: z.number().optional(),
          }),
        }),
      };

      // Act
      const flat = unwrapToFlatMcpSchema(nested);

      // Assert: Top level should have q and limit
      expect(flat.q).toBeDefined();
      expect(flat.limit).toBeDefined();
      expect(flat.params).toBeUndefined();
    });

    it('should flatten path parameters to top level', () => {
      const nested = {
        params: z.object({
          path: z.object({
            id: z.string(),
            slug: z.string(),
          }),
        }),
      };

      const flat = unwrapToFlatMcpSchema(nested);

      expect(flat.id).toBeDefined();
      expect(flat.slug).toBeDefined();
      expect(flat.params).toBeUndefined();
    });

    it('should flatten both path and query parameters', () => {
      const nested = {
        params: z.object({
          path: z.object({
            keyStage: z.string(),
          }),
          query: z.object({
            subject: z.string().optional(),
          }),
        }),
      };

      const flat = unwrapToFlatMcpSchema(nested);

      expect(flat.keyStage).toBeDefined();
      expect(flat.subject).toBeDefined();
      expect(flat.params).toBeUndefined();
    });

    it('should handle empty params (zero-parameter tools)', () => {
      const nested = {
        params: z.object({}),
      };

      const flat = unwrapToFlatMcpSchema(nested);

      expect(Object.keys(flat)).toHaveLength(0);
      expect(flat.params).toBeUndefined();
    });

    it('should pass through already-flat schemas', () => {
      const alreadyFlat = {
        q: z.string(),
        limit: z.number(),
      };

      const flat = unwrapToFlatMcpSchema(alreadyFlat);

      expect(flat.q).toBeDefined();
      expect(flat.limit).toBeDefined();
    });
  });

  describe('error handling - fail fast with helpful messages', () => {
    it('should throw if params is not a ZodObject', () => {
      const invalid = {
        params: z.string(), // Wrong type
      };

      expect(() => unwrapToFlatMcpSchema(invalid)).toThrow(
        /Expected params to be a ZodObject.*This is a generator bug/,
      );
    });

    it('should throw if query is not a ZodObject', () => {
      const invalid = {
        params: z.object({
          query: z.string(), // Should be object
        }),
      };

      expect(() => unwrapToFlatMcpSchema(invalid)).toThrow(
        /Expected query to be a ZodObject.*This is a generator bug/,
      );
    });

    it('should throw if path is not a ZodObject', () => {
      const invalid = {
        params: z.object({
          path: z.array(z.string()), // Should be object
        }),
      };

      expect(() => unwrapToFlatMcpSchema(invalid)).toThrow(
        /Expected path to be a ZodObject.*This is a generator bug/,
      );
    });

    it('should throw on parameter name collision', () => {
      const collision = {
        params: z.object({
          path: z.object({
            id: z.string(),
          }),
          query: z.object({
            id: z.number(), // Same name as path param
          }),
        }),
      };

      expect(() => unwrapToFlatMcpSchema(collision)).toThrow(
        /Parameter name collision.*'id'.*OpenAPI schema bug/,
      );
    });

    it('should throw if result is not truly flat', () => {
      // This tests the validation step
      const stillNested = {
        nested: z.object({
          inner: z.string(),
        }),
      };

      expect(() => unwrapToFlatMcpSchema(stillNested)).toThrow(
        /Parameter 'nested' is a nested object.*must have flat parameter structure/,
      );
    });
  });

  describe('type preservation', () => {
    it('should preserve Zod types exactly (no widening)', () => {
      const nested = {
        params: z.object({
          query: z.object({
            status: z.union([z.literal('active'), z.literal('inactive')]),
          }),
        }),
      };

      const flat = unwrapToFlatMcpSchema(nested);

      // Type should be preserved exactly
      expect(flat.status).toBe(nested.params._def.shape().query._def.shape().status);
    });

    it('should preserve optional modifiers', () => {
      const nested = {
        params: z.object({
          query: z.object({
            optional: z.string().optional(),
            required: z.string(),
          }),
        }),
      };

      const flat = unwrapToFlatMcpSchema(nested);

      expect(flat.optional._def.typeName).toBe('ZodOptional');
      expect(flat.required._def.typeName).toBe('ZodString');
    });
  });
});
```

### Phase 3: Update Registration Function (Green)

**Location**: `apps/oak-curriculum-mcp-stdio/src/app/server.ts`

**Changes**:

```typescript
import { zodRawShapeFromToolInputJsonSchema } from '@oaknational/oak-curriculum-sdk';
import { unwrapToFlatMcpSchema } from './flat-mcp-schema.js'; // NEW

export function registerMcpTools(
  server: Server,
  descriptors: readonly ToolDescriptor<ToolName, OakClient, unknown, unknown>[],
  executor: ToolExecutor<ToolName>,
): void {
  for (const descriptor of descriptors) {
    const name = descriptor.name;
    const description = ensureDescriptorDescription(descriptor, name);

    const handler = createToolHandler(executor, name);

    // Convert JSON Schema to Zod RawShape (our nested structure)
    const nestedInput = zodRawShapeFromToolInputJsonSchema(descriptor.inputSchema);

    // Flatten for MCP registration (unwrap params/query/path)
    // See: .agent/plans/p0-mcp-flat-schema-type-safety.md
    const flatInput = unwrapToFlatMcpSchema(nestedInput);

    server.registerTool(
      name,
      {
        title: name,
        description,
        inputSchema: flatInput, // Now flat!
      },
      handler,
    );
  }
}
```

**Expected Result**: Integration tests PASS (Green)

### Phase 4: Manual Verification

**Steps**:

1. Run the MCP server: `pnpm --filter oak-curriculum-mcp-stdio dev`
2. Connect with Cursor
3. Inspect tool signature in Cursor UI
4. **Expected**: Individual parameters visible (`q: string`, `keyStage: enum`, etc.)
5. **Expected**: No "params: No description" wrapper

---

## TESTING STRATEGY

### Test Levels

Per `@testing-strategy.md`:

1. **Unit Tests** (`*.unit.test.ts`):
   - Test `unwrapToFlatMcpSchema` function in isolation
   - Pure function, no side effects, no I/O
   - Fast, deterministic, no mocks

2. **Integration Tests** (`*.integration.test.ts`):
   - Test `registerMcpTools` with MCP SDK
   - Code units working together (in-process)
   - Simple mocks (stub tool executor)
   - Verifies MCP protocol compliance

3. **Manual Verification**:
   - Run actual MCP server with Cursor
   - Validates end-to-end behavior
   - Not automated (E2E would require Cursor API)

### TDD Flow

1. **Red**: Write failing integration test (Phase 1)
2. **Green**: Implement solution (Phases 2-3)
3. **Refactor**: Clean up, optimize (if needed)

### What We're Testing

✅ **Testing Behavior** (correct):

- MCP protocol sees flat parameters
- Zero-param tools handled correctly
- Parameter types preserved
- Errors thrown with helpful messages

❌ **Not Testing Implementation** (correct):

- Not testing internal unwrapping logic details
- Not testing Zod internals
- Not testing MCP SDK internals

---

## ALIGNMENT WITH DIRECTIVES

### Schema-First Execution (@schema-first-execution.md)

| Principle                                     | How We Align                                                     |
| --------------------------------------------- | ---------------------------------------------------------------- |
| "Runtime files act only as very thin façades" | ✅ Unwrapping is minimal transformation, not recreation          |
| "No runtime modification of types"            | ✅ We transform structure, not types themselves                  |
| "Fail fast at generation time"                | ✅ Throws helpful errors if generator produces invalid structure |
| "Generator is single source of truth"         | ✅ We work with generated artifacts, don't recreate them         |

**Note**: This is a SHORT-TERM fix. Long-term, generator should produce flat schema directly.

### Core Rules (@rules.md)

| Rule                                     | How We Align                                                          |
| ---------------------------------------- | --------------------------------------------------------------------- |
| "First Question: Could it be simpler?"   | ✅ YES! Removed branded types, using simple validation + spread       |
| "TDD - Write tests FIRST"                | ✅ Integration test written first (Phase 1)                           |
| "Fail fast and hard with helpful errors" | ✅ All error paths throw TypeError with context                       |
| "No type shortcuts (any, as, !)"         | ✅ No type assertions, proper type predicates (`is`), spread operator |
| "Preserve type information"              | ✅ Spread operator preserves Zod types exactly during flattening      |
| "Pure functions first"                   | ✅ `unwrapToFlatMcpSchema` is pure (no side effects, deterministic)   |
| "No Object.\* methods"                   | ✅ Using spread operator instead of `Object.assign`                   |

### Testing Strategy (@testing-strategy.md)

| Principle                                   | How We Align                                            |
| ------------------------------------------- | ------------------------------------------------------- |
| "Test behavior, not implementation"         | ✅ Test MCP protocol compliance (observable behavior)   |
| "Pure functions have unit tests"            | ✅ `unwrapToFlatMcpSchema` has comprehensive unit tests |
| "Integration points have integration tests" | ✅ `registerMcpTools` has integration test              |
| "No complex mocks"                          | ✅ Simple stub executor, real MCP SDK                   |
| "Each proof happens once"                   | ✅ No duplicate test cases                              |

---

## RISKS AND MITIGATION

### Risk 1: Runtime Performance

**Risk**: Unwrapping on every registration could be slow

**Likelihood**: LOW - We register tools once at startup

**Mitigation**: None needed - not a hot path

### Risk 2: Generator Changes Break Unwrapping

**Risk**: Future generator changes produce different structure

**Likelihood**: MEDIUM - Generator is evolving

**Mitigation**:

- Comprehensive error messages point to generator bugs
- Integration tests catch issues immediately
- Document this as SHORT-TERM fix, plan long-term generator change

### Risk 3: MCP SDK Changes

**Risk**: MCP SDK changes how it handles inputSchema

**Likelihood**: LOW - Stable public API

**Mitigation**:

- Integration tests use real MCP SDK
- Would catch breaking changes immediately
- Version pinning in package.json

---

## SUCCESS CRITERIA

### Implementation Complete When:

1. ✅ All unit tests pass (`flat-mcp-schema.unit.test.ts`)
2. ✅ All integration tests pass (`server.integration.test.ts`)
3. ✅ No linter errors
4. ✅ Type-checks pass
5. ✅ Manual verification in Cursor shows flat parameters
6. ✅ Documentation updated (this plan, research docs)

### Validation Checklist:

```bash
# Run tests
pnpm --filter oak-curriculum-mcp-stdio test

# Type-check
pnpm --filter oak-curriculum-mcp-stdio type-check

# Lint
pnpm --filter oak-curriculum-mcp-stdio lint

# Manual test
pnpm --filter oak-curriculum-mcp-stdio dev
# → Connect Cursor
# → Inspect tool signatures
# → Verify parameters visible
```

---

## FUTURE WORK (Out of Scope)

### Long-Term Architectural Fix

**Option A**: Generate two schema formats

```typescript
// For our SDK API (current)
readonly toolInputJsonSchema: { params: { query: {...}, path: {...} } }

// NEW: For MCP registration (flat)
readonly toolMcpFlatZodSchema: z.ZodRawShape & FlatMcpInputSchema
```

**Option B**: Change generator to produce flat structure

- Breaking change (major version bump)
- Eliminate `params` wrapper entirely
- Update all TypeScript interfaces

**Decision Point**: Separate discussion after P0 implementation complete

---

## REFERENCES

**Project Directives**:

- `.agent/directives/schema-first-execution.md`
- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`

**Research Documents**:

- `.agent/research/deep-reflection-schema-first-and-findings.md` (Priority 0)
- `.agent/research/mcp-tool-description-schema-flow-analysis.md` (Section 5.0)
- `.agent/research/mcp-sdk-type-reuse-investigation.md` (Additional Finding 1)

**MCP Documentation**:

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification - Tools](https://modelcontextprotocol.io/specification/latest/server/tools)

---

**END OF PLAN**
