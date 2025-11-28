# Zod v4 Export Implementation Plan

**Status**: Active  
**Created**: 2025-11-28  
**Related ADR**: [ADR-055: Zod Version Boundaries](../../../docs/architecture/architectural-decisions/055-zod-version-boundaries.md)

## Foundation Documents

Before any work, re-read and commit to:

- [rules.md](../../directives-and-memory/rules.md)
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md)

**Pre-Work Question**: Are we solving the right problem, at the right layer?

---

## Architectural Insight

### The Single Source of Zod v3

**`openapi-zod-client` is the ONLY source of Zod v3 artefacts in the entire project.**

This library reads the OpenAPI schema and produces Zod v3 schemas. Everything else in the SDK and all apps should use Zod v4.

### The Adapter Pattern

We encapsulate `openapi-zod-client` in an **adapter** with a clear boundary:

```
┌─────────────────────────────────────────────────────────────────┐
│                    openapi-zod-client Adapter                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  openapi-zod-client (Zod v3)                            │    │
│  │  - Reads OpenAPI spec                                   │    │
│  │  - Produces Zod v3 schemas                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Adapter Layer                                          │    │
│  │  - Converts Zod v3 → Zod v4                             │    │
│  │  - Zod v3 NEVER escapes this boundary                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │  SDK Public API (Zod v4 ONLY) │
              └───────────────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │  Apps (Zod v4)                │
              └───────────────────────────────┘
```

### Benefits

1. **Clean boundary**: Zod v3 is contained; consumers only see Zod v4
2. **Replacement-ready**: The adapter defines what we need from `openapi-zod-client`
3. **Single responsibility**: One place handles the version translation
4. **Testable**: We can test the adapter boundary in isolation

### Adapter Interface (What We Need)

The adapter's public interface defines what our project requires from any OpenAPI → Zod library:

```typescript
interface OpenApiZodAdapter {
  /**
   * Generate Zod v4 schemas from an OpenAPI operation.
   * 
   * The implementation uses openapi-zod-client (Zod v3) internally
   * but MUST convert all output to Zod v4 before returning.
   */
  generateToolSchemas(operation: OpenApiOperation): {
    /** Flat input schema for MCP registration (Zod v4) */
    flatInputSchema: z4.ZodObject<z4.ZodRawShape>;
    /** Nested input schema for SDK invoke (Zod v4) */
    nestedInputSchema: z4.ZodObject<z4.ZodRawShape>;
    /** Output schema for response validation (Zod v4) */
    outputSchema: z4.ZodType;
  };
}
```

If we ever replace `openapi-zod-client`, the replacement must satisfy this interface.

---

## Overview

The SDK currently generates Zod v3 schemas via `openapi-zod-client` and allows them to leak into the public API. This causes:

1. Apps use Zod v4, creating type mismatches
2. MCP SDK expects Zod v4 for optimal compatibility
3. No clear boundary around the Zod v3 dependency

**Solution**: Create an adapter that encapsulates `openapi-zod-client` and converts all output to Zod v4 at type-gen time. Zod v3 artefacts never escape the adapter.

---

## Phase 1: Create the openapi-zod-client Adapter

### Goal

Encapsulate all `openapi-zod-client` usage in an adapter that:
1. Consumes Zod v3 output from `openapi-zod-client`
2. Converts to Zod v4 before returning
3. Exports ONLY Zod v4 schemas

### Prerequisites

- SDK uses Zod 3.25+ (currently 3.25.76 ✓)
- `zod/v4` export path is available ✓

### Tasks

#### 1.1 Verify Zod v4 API Access

**TDD Approach**: Write a test first that imports from `zod/v4` and validates basic functionality.

```typescript
// packages/sdks/oak-curriculum-sdk/type-gen/adapter/zod-v4.unit.test.ts
import { describe, it, expect } from 'vitest';
import { z } from 'zod/v4';

describe('zod/v4 import', () => {
  it('provides Zod v4 API from the zod package', () => {
    const schema = z.object({ name: z.string().describe('A name') });
    const result = schema.safeParse({ name: 'test' });
    expect(result.success).toBe(true);
  });
});
```

#### 1.2 Create the Adapter Module

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/adapter/`

```
type-gen/
├── adapter/
│   ├── index.ts              # Public API (Zod v4 only)
│   ├── openapi-zod-client-adapter.ts  # Encapsulates the library
│   ├── zod-v3-to-v4.ts       # Conversion utilities
│   └── types.ts              # Adapter interface
├── typegen/
│   └── ...                   # Consumes adapter, never touches Zod v3
```

**TDD Approach**:

1. **RED**: Write a test that expects Zod v4 schemas from the adapter
2. **GREEN**: Implement the adapter with conversion
3. **REFACTOR**: Clean up

#### 1.3 Implement Zod v3 → v4 Conversion

The conversion is straightforward because both APIs are structurally similar:

```typescript
// type-gen/adapter/zod-v3-to-v4.ts
import { z as z3 } from 'zod';
import { z as z4 } from 'zod/v4';

/**
 * Convert a Zod v3 object schema to Zod v4.
 * 
 * This function is the ONLY place where Zod v3 types are handled.
 * All consumers receive Zod v4 schemas.
 */
export function convertObjectSchemaToV4(
  v3Schema: z3.ZodObject<z3.ZodRawShape>,
): z4.ZodObject<z4.ZodRawShape> {
  // Rebuild the schema using Zod v4 primitives
  // Preserve .describe() calls for MCP parameter descriptions
  // ...
}
```

#### 1.4 Update Type-Gen to Use Adapter

Modify the type-gen templates to consume the adapter instead of using `openapi-zod-client` directly:

**Before** (Zod v3 leaks out):
```typescript
// type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts
import { z } from 'zod';  // v3
// ... generates v3 schemas that leak into public API
```

**After** (adapter boundary):
```typescript
// type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts
import { generateToolSchemas } from '../../adapter/index.js';
// ... generates v4 schemas from adapter
```

#### 1.5 Verify No Zod v3 Escapes

Add a lint rule or type-check that ensures:
- No `import { z } from 'zod'` (v3) outside the adapter
- Only `import { z } from 'zod/v4'` in generated files
- Adapter is the only module that imports from plain `'zod'`

#### 1.6 Update SDK Exports

Ensure public API surfaces export Zod v4 schemas:

- `listUniversalTools()` returns `flatZodSchema` as Zod v4
- Tool descriptors expose `toolMcpFlatInputSchema` as Zod v4
- Tool descriptors expose `zodOutputSchema` as Zod v4

### Quality Gates

After Phase 1:

```bash
pnpm type-gen    # Regenerate with adapter
pnpm build       # Build all packages
pnpm type-check  # Verify no type errors
pnpm lint        # Verify code style
pnpm test        # Run all tests
```

### Success Criteria

- [ ] Adapter encapsulates all `openapi-zod-client` usage
- [ ] Zod v3 types/objects NEVER escape the adapter boundary
- [ ] SDK exports Zod v4 schemas only
- [ ] Apps can import and use schemas with MCP SDK
- [ ] No type assertions needed for Zod schema usage
- [ ] All quality gates pass
- [ ] `.describe()` calls preserved for MCP parameter descriptions

---

## Phase 2: Resolve TS2589 Type Complexity

### Context

After Phase 1, we may still have the TS2589 "Type instantiation is excessively deep" error. This is a separate issue caused by TypeScript's type inference struggling with the union of all tool schemas.

**Root Cause**: When `listUniversalTools()` returns an array with `flatZodSchema` being a union of 26+ different Zod shapes, and this is passed to `registerTool<InputArgs>()`, TypeScript must infer the generic from a complex union. Zod's deeply recursive types combined with this union exceed TypeScript's depth limit.

### Pre-Phase-2 Question

Before solving, ask: **Is this solving the right problem at the right layer?**

Options to consider:

1. **Simplify the union**: Export a simpler type that doesn't require inferring all 26 tool shapes simultaneously
2. **Break registration into typed calls**: Register each tool with its specific type, not a union
3. **Use a type-erased intermediate**: Pass schemas through a function that returns `ZodRawShape` (the base type)
4. **Generator-level fix**: Generate something that avoids the union entirely

### Tasks

#### 2.1 Diagnose the Exact Recursion Path

**Investigation**:

1. Create a minimal reproduction with 2-3 tools
2. Identify which Zod type features cause the deepest recursion
3. Check if the issue is in `flatZodSchema` typing or in `registerTool`'s generics

#### 2.2 Evaluate Solutions

**Option A: Simplify `UniversalToolListEntry.flatZodSchema` Type**

Currently typed as `z.ZodRawShape | undefined`. Consider:

```typescript
// Instead of preserving exact shapes for each tool
flatZodSchema?: z.ZodRawShape;

// The value at runtime is still the specific shape, but the TYPE is the base
```

This loses compile-time precision but avoids the union explosion.

**Option B: Separate Registration by Tool Type**

```typescript
// Instead of one loop with a union
for (const tool of listUniversalTools()) { ... }

// Two loops with narrower types
for (const tool of listGeneratedTools()) { ... }  // narrower type
for (const tool of listAggregatedTools()) { ... } // no flatZodSchema
```

**Option C: Type-Erasing Wrapper Function**

```typescript
function toMcpInputSchema(schema: z.ZodRawShape | undefined): z.ZodRawShape | undefined {
  return schema; // Type is now base ZodRawShape, not the union
}

const input = toMcpInputSchema(tool.flatZodSchema);
```

**Option D: Generator-Level Type Simplification**

At type-gen time, export a branded or simplified type that doesn't trigger deep inference.

#### 2.3 Implement Chosen Solution

Follow TDD:

1. **RED**: Write a test that type-checks the registration loop
2. **GREEN**: Implement the solution
3. **REFACTOR**: Clean up

#### 2.4 Verify No Functionality Lost

Ensure:

- Parameter descriptions still flow through
- Type safety for tool args maintained where needed
- No runtime behaviour changes

### Quality Gates

After Phase 2:

```bash
pnpm type-check  # NO TS2589 error
pnpm lint
pnpm test
pnpm build
```

### Success Criteria

- [ ] No TS2589 error during type-check
- [ ] No type shortcuts (`as`, `any`, etc.) introduced
- [ ] MCP tool registration still works correctly
- [ ] Parameter descriptions preserved

---

## Future: Address JSON Schema / Zod Redundancy

### Context

The SDK currently exports both:

- **JSON Schema**: `tool.inputSchema`, `tool.toolOutputJsonSchema`
- **Zod Schema**: `tool.flatZodSchema`, `tool.zodOutputSchema`

These contain overlapping information.

### Options

1. **Document when to use each**: JSON Schema for serialization, Zod for runtime validation
2. **Consolidate**: Export only Zod, derive JSON Schema on demand
3. **Keep both**: Accept redundancy for different use cases

### Decision

Defer until after Phase 1 and 2. Current priority is Zod version alignment and type safety.

---

## Implementation Order

1. **Phase 1.1-1.3**: Create adapter with Zod v3 → v4 conversion
2. **Phase 1.4-1.5**: Update type-gen to use adapter, verify boundary
3. **Phase 1.6**: Update SDK exports
4. **Phase 2**: Address TS2589 (only if it persists after Phase 1)

---

## Rollback Plan

If Phase 1 causes issues:

1. Revert adapter and type-gen template changes
2. Re-run `pnpm type-gen` to restore previous output
3. Apps continue using JSON Schema fallback

---

## Future Replacement

If we ever need to replace `openapi-zod-client` (e.g., for better Zod v4 support), the adapter defines exactly what we need:

1. Parse OpenAPI operations
2. Generate input schemas (flat and nested)
3. Generate output schemas
4. Preserve descriptions for MCP

Any replacement library must satisfy the adapter interface.

---

## References

- [ADR-055: Zod Version Boundaries](../../../docs/architecture/architectural-decisions/055-zod-version-boundaries.md)
- [TS2589 Investigation Prompt](../../prompts/investigate-ts2589-type-recursion.prompt.md)
- [Zod v3/v4 Compatibility](https://zod.dev/v4)
