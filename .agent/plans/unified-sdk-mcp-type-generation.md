# Unified SDK-MCP Type Generation Plan

## Central Organising Principle

**The entire SDK+MCP system is a pure function of the OpenAPI schema.**

Every single data structure, type, type guard, and Zod validator flows from the schema. Rebuilding the types after a schema change is the ONLY action needed for the entire SDK and MCP system to be updated.

```
OpenAPI Schema (Single Source of Truth)
           ↓
    SDK Type-Gen (ONE command)
           ↓
    Generates EVERYTHING:
    • Data structures
    • TypeScript types
    • Type guards
    • Zod validators
    • Tool definitions
    • Parameter types
    • Response schemas
           ↓
    SDK exports all
           ↓
    MCP imports and uses
```

## Core Requirements

### The Central Contract
**When the API changes, running `pnpm type-gen` in the SDK must be the ONLY action required to update the entire system.** No manual intervention, no hunting for changes, no risk of mismatched types.

### Type System Integrity
1. **ONE Type Assertion**: The schema is asserted ONCE in the entire codebase (`const schema = JSON.parse(schemaJson) as OpenAPI3`)
2. **Complete Knowledge**: After schema validation, we KNOW EVERYTHING about the API
3. **No Unknown Types**: There should be NO `unknown` types after schema validation - we have complete information
4. **No Record<string, unknown>**: Every use of `Record<string, unknown>` disables the type system and throws away information - use proper generated types
5. **Derived Types**: All types, type guards, and validators are DERIVED from the validated schema data structure

## Executive Summary

The current architecture creates artificial tension by treating SDK and MCP as separate entities. This plan unifies them into a single type-generation pipeline where EVERYTHING flows from the OpenAPI schema at SDK compile time.

## The Problem

We've been fighting a fundamental architectural mismatch:
- The MCP server generates tools at runtime from SDK data
- This requires type assertions to bridge compile-time and runtime boundaries
- The result: type safety violations and complex workarounds

## The Solution

**Eliminate the boundary by generating everything at SDK type-gen time.**

When the API schema changes, the ONLY action required is to regenerate SDK types. This automatically fixes both the SDK and MCP server.

## Key Insights from Analysis

### From Logger Utils Pattern
The `LOG_LEVEL_VALUES` pattern demonstrates how a single data structure can generate:
- Literal union types (`LogLevel`)
- Type guards (`isLogLevel`)
- Utility functions (`parseLogLevel`, `compareLogLevels`)
- All derived from ONE source of truth

### From Reference Implementation
The Oak API client typegen shows advanced patterns:
- Extract all parameter values from schema at build time
- Generate discriminated unions (`ValidPathAndParameters<K>`)
- Create type guards for every extracted type
- Use `as const` for literal preservation
- Parameterised types that narrow based on path keys

## Architecture Design

### Phase 1: Data Structure Definition (SDK Type-Gen Time)

```typescript
// Generated from OpenAPI schema
const MCP_TOOLS_DATA = {
  'oak-get-sequences-units': {
    path: '/sequences/{sequence}/units',
    method: 'get' as const,
    operationId: 'getSequences-units',
    parameters: {
      path: ['sequence'],
      query: ['year']
    },
    decorations: {
      name: 'oak-get-sequences-units',
      description: 'Retrieve units within a curriculum sequence'
    }
  },
  // ... all tools
} as const;
```

### Phase 2: Type Generation (SDK Compile Time)

```typescript
// Literal union of all tool names
export type McpToolName = keyof typeof MCP_TOOLS_DATA;
// 'oak-get-sequences-units' | 'oak-get-lessons-transcript' | ...

// Discriminated union of parameters
export type ToolParameters<T extends McpToolName> = 
  T extends 'oak-get-sequences-units' ? {
    sequence: string;
    year?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | 'all-years';
  } :
  T extends 'oak-get-lessons-transcript' ? {
    lesson: string;
  } :
  // ... all parameter types
  never;

// Type guard generation
export function isMcpToolName(value: unknown): value is McpToolName {
  return typeof value === 'string' && value in MCP_TOOLS_DATA;
}

// Tool response types
export type ToolResponse<T extends McpToolName> = 
  T extends 'oak-get-sequences-units' ? SequenceUnitsResponse :
  T extends 'oak-get-lessons-transcript' ? LessonTranscriptResponse :
  // ... all response types
  never;
```

### Phase 3: MCP Server as Coordination Layer

```typescript
// The MCP server becomes simple type-safe coordination
import { 
  MCP_TOOLS_DATA, 
  type McpToolName, 
  type ToolParameters,
  ResponseSchemas  // Zod schemas for runtime validation
} from '@oaknational/oak-curriculum-sdk';

function findTool<T extends McpToolName>(name: T) {
  return MCP_TOOLS_DATA[name];
}

async function handleTool<T extends McpToolName>(
  toolName: T,
  params: ToolParameters<T>
): Promise<ToolResponse<T>> {
  const tool = findTool(toolName);
  
  // Call the API (returns unknown data at runtime)
  const result = await sdk[tool.method.toUpperCase()](
    tool.path,
    { params: { query: params, path: params } }
  );
  
  // Zod validates the runtime response (ADR-032: boundary validation)
  const validatedData = ResponseSchemas[toolName].parse(result.data);
  return validatedData;
}
```

### Phase 4: Runtime Validation Layer (Zod)

**Critical**: Even with perfect type generation, Zod validators remain essential for:

1. **Runtime API Response Validation**
   - API responses are `unknown` at runtime
   - Zod transforms `unknown` → typed data safely
   - Protects against API contract violations

2. **External Boundary Protection** (ADR-032)
   - The API is an external system boundary
   - All external data MUST be validated
   - Type assertions would be lies

3. **Defence in Depth**
   - Compile-time: TypeScript types catch development errors
   - Runtime: Zod schemas catch API/data errors
   - Together: Complete type safety with no assertions

```typescript
// Generated alongside types
export const ResponseSchemas = {
  'oak-get-sequences-units': SequenceUnitsResponseSchema,
  'oak-get-lessons-transcript': LessonTranscriptResponseSchema,
  // ... all response schemas
} as const;
```

## Implementation Steps

**Guiding Principle**: Every step must maintain the central contract - everything flows from the schema.

### Step 1: Analyse Current Tool Requirements ✅
- ✅ Review all MCP tools currently exposed (25 tools identified)
- ✅ Map each to its OpenAPI operation
- ✅ Identify parameter patterns and response types
- ✅ Verify each can be generated from schema alone

### Step 2: Extend SDK Type Generation ✅
- ✅ Add tool generation to SDK type pipeline
- ✅ Generate `MCP_TOOLS_DATA` structure from OpenAPI operations
- ✅ Generate `McpToolName` union type
- ✅ Generate `ToolParameters<T>` discriminated union
- ✅ Generate type guards for all types
- ✅ Create mcp-toolgen.ts to run AFTER zodgen
- ✅ Map Zod schemas to tool names for runtime validation

### Step 3: Export from SDK 🚧
- ⏳ Add new exports to SDK index
- ⏳ Ensure tree-shaking works (only import what's needed)
- ⏳ Document the tool generation pattern
- ⏳ Generate comprehensive API documentation

### Step 4: Documentation Generation 🚧
**Critical**: Documentation must be comprehensive and AI-agent friendly

- **Primary Output**: Single document describing entire SDK public API
  - All types with complete definitions
  - All functions with signatures
  - Usage examples for every exported item
  - MCP tool documentation with parameters
  - Type guard usage patterns
  - Zod validator integration examples
  
- **Documentation Requirements**:
  - Must be generated from the same source (OpenAPI schema)
  - Must include inline code examples
  - Must explain the type flow from schema to usage
  - Must be consumable by AI agents for full SDK understanding
  
- **Generation Approach**:
  - Use TypeDoc for API extraction
  - Custom generator for unified markdown output
  - Include generated types inline (not just references)
  - Provide both TypeScript and JavaScript examples

### Step 5: Update MCP Server ⏳
- Remove ALL runtime tool generation
- Import generated types from SDK
- Update tool handler to use compile-time types
- Remove the `as any` assertion

### Step 6: Validate Central Contract ⏳
- Test that schema changes flow through automatically
- Verify no manual updates needed when API changes
- Ensure TypeScript catches breaking changes at compile time

## The Single Type Assertion

After this refactor, the ENTIRE system needs exactly ONE type assertion:
```typescript
// In SDK type-gen script
const schema = JSON.parse(schemaJson) as OpenAPI3;
```

**Critical Understanding**:
- This ONE assertion gives us a fully-typed data structure containing ALL API information
- From this point forward, we KNOW EVERYTHING - no unknowns, no Record<string, unknown>
- We create convenience data sub-structures from this complete knowledge
- We derive types and type guards from these data structures
- Everything else flows from this single source of truth with full type safety

Note: This is NOT a type assertion that bypasses validation. The schema IS validated, and Zod schemas provide runtime validation at the API boundary.

## Benefits

1. **Zero Runtime Generation**: Everything known at compile time
2. **Full Type Safety**: No type assertions in usage code
3. **Central Contract Preserved**: Schema → SDK → MCP automatically
4. **Simpler Architecture**: Remove artificial boundaries
5. **Better Developer Experience**: IDE knows all types
6. **Compile-Time Validation**: TypeScript catches API changes
7. **Runtime Safety**: Zod validates all API responses
8. **Defence in Depth**: Type safety at compile AND runtime

## Testing Strategy

1. **Unit Tests**: Test type guards with valid/invalid inputs
2. **Integration Tests**: Verify tool handler with all tool types
3. **E2E Tests**: Ensure actual API calls work
4. **Schema Change Test**: Verify regeneration fixes everything

## Success Criteria

1. ✅ No type assertions in MCP generation code (except the ONE schema assertion)
2. ✅ All tool names are literal types
3. ✅ All parameters have discriminated unions
4. ✅ Type guards for all dynamic values
5. ✅ Schema changes require ONLY SDK regeneration
6. ⏳ All quality gates pass
7. ✅ Every type flows from the OpenAPI schema
8. ✅ Every type guard flows from the OpenAPI schema
9. 🚧 Every Zod validator flows from the OpenAPI schema (needs mcp-toolgen integration)
10. ✅ The entire system updates with ONE command: `pnpm type-gen`
11. ⏳ Documentation is comprehensive and AI-agent consumable
12. ⏳ Single document contains complete SDK API reference
13. ⏳ NO `unknown` types after schema validation
14. ⏳ NO `Record<string, unknown>` anywhere in generated code
15. ⏳ All types are derived from the validated schema data structure

## Reflection

This approach aligns with our core principles:
- **Single Source of Truth**: OpenAPI schema
- **Generation Over Maintenance**: Build-time generation
- **Type Safety**: No compromises, no shortcuts
- **Simplicity**: Remove unnecessary boundaries

The key insight: SDK and MCP are not separate systems - they're one unified system with types flowing from a single generation point.

### The Contract Is Unbreakable

If the schema changes and we DON'T regenerate:
- **Build fails** (TypeScript catches it)

If we regenerate after schema changes:
- **Everything just works** (types flow through)

This is true functional programming: the entire SDK+MCP system becomes a pure function of the OpenAPI schema. No side effects, no manual state, just transformation.

## Current Status (2025-01-13)

### Completed
- ✅ Created unified OpenAPI validation function
- ✅ Removed all type assertions from MCP generation
- ✅ Generated MCP tools data structure from schema
- ✅ Created discriminated unions for parameters
- ✅ Implemented proper type guards without assertions
- ✅ Created mcp-toolgen.ts for post-zodgen validator mapping

### Key Architecture Decision
We discovered that trying to predict what zodgen will generate violates the contract. The solution: run generation in three phases:
1. typegen.ts - Generate OpenAPI artifacts and basic MCP types
2. zodgen.ts - Generate Zod schemas from OpenAPI
3. mcp-toolgen.ts - Read actual Zod output and map validators

This maintains the pure function contract - everything flows from the schema.

### Outstanding TODOs in Code
- `@todo Handle enum types with proper type narrowing` (parameters.ts:75)
- `@todo Figure out if this function should take the tools as an argument` (parameters.ts:186)

These will be addressed after all types are generated at SDK generation time.

## References

- ADR-029: No manual API data structures
- ADR-030: SDK as single source of truth  
- ADR-031: Generation at build time
- ADR-032: External boundary validation
- ADR-035: Unified SDK-MCP Type Generation (to be created)
- Logger utils pattern: `ecosystem/histoi/histos-logger/src/log-levels.ts`
- Reference implementation: `reference/oak-curriculum-api-client/scripts/api-types/typegen.ts`