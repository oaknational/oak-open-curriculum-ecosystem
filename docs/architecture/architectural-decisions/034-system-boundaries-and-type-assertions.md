# ADR-034: System Boundaries and Type Assertions

## Status

Accepted

## Context

Through deep analysis of both our implementation and the reference Oak curriculum API client, we've identified a fundamental architectural challenge: bridging TypeScript's compile-time type system with runtime dynamic dispatch requirements. This document defines our architectural strategy for managing system boundaries and type assertions.

## The Central Contract

```text
API Schema → SDK Type-Gen → Everything Else Works Automatically
```

When the Oak API changes:

1. **ONLY ACTION NEEDED**: Re-run SDK type-gen
2. **SDK UPDATES**: New types, paths, methods flow from schema
3. **MCP AUTOMATICALLY WORKS**: Because it uses SDK types directly

## System Architecture

### Layer 1: OpenAPI Schema (External Source of Truth)

- **Location**: Remote API endpoint
- **Nature**: JSON schema defining all API operations
- **Boundary Type**: External system boundary

### Layer 2: SDK (Generated Bridge)

- **Location**: `packages/sdks/oak-curriculum-sdk`
- **Components**:
  - Generated types (`api-paths-types.ts`)
  - Generated schemas (`api-schema.ts`)
  - Generated validators (Zod schemas)
  - Client wrapper (OpenAPI-fetch)
- **Nature**: Build-time generated from OpenAPI schema
- **Boundary Type**: Generation boundary (build-time to runtime)

### Layer 3: MCP Server (Runtime Consumer)

- **Location**: `ecosystem/psycha/oak-curriculum-mcp`
- **Components**:
  - Enriched tools (generated at build-time)
  - Tool handler (runtime dispatcher)
  - MCP protocol implementation
- **Nature**: Runtime dynamic dispatch based on generated metadata
- **Boundary Type**: Library interface boundary

## System Boundaries Analysis

### Boundary 1: OpenAPI Schema → SDK Generation

**Type**: External to internal transformation
**Assertion Required**: NO
**Reason**: Pure code generation, no runtime types involved

### Boundary 2: SDK → OpenAPI-fetch Library

**Type**: TypeScript to external library
**Assertion Required**: YES (minimal)
**Current Implementation**:

```typescript
// In tool-handler.ts
const sdkPath = enrichedTool.path as any;
const result = await sdk.GET(sdkPath, options);
```

**Reason**: OpenAPI-fetch requires compile-time literal path types (e.g., `"/lessons/{lesson}/summary"`), but we have runtime strings. TypeScript cannot narrow runtime strings to compile-time literal unions.

### Boundary 3: MCP Protocol → Tool Handler

**Type**: External protocol to internal handler
**Assertion Required**: NO
**Reason**: We validate incoming parameters using generated Zod schemas

### Boundary 4: Tool Handler → SDK Methods

**Type**: Internal orchestration
**Assertion Required**: NO (after Boundary 2 assertion)
**Reason**: Types flow through from enriched tools

## Critical Discovery: Why Assertions Cannot Be Eliminated

### The Fundamental Mismatch

1. **OpenAPI-fetch Design**: Requires literal path types at compile-time for type safety
2. **MCP Requirements**: Needs dynamic tool invocation at runtime
3. **TypeScript Limitation**: Cannot convert runtime strings to compile-time literal types

### Example of the Problem

```typescript
// What OpenAPI-fetch expects:
sdk.GET('/lessons/{lesson}/summary', { params: { path: { lesson: 'abc' } } });
//       ^^^^^^^^^^^^^^^^^^^^^^^^^ Must be a literal type

// What we have at runtime:
const path = enrichedTool.path; // string at runtime, even with "as const" in generation
sdk.GET(path, options); // TypeScript error: string is not assignable to literal union
```

## Can Validation or Type Predicates Replace Assertions?

### Analysis

We investigated whether type predicates could eliminate the assertion:

```typescript
// Hypothetical type predicate
function isValidPath(path: string): path is keyof paths {
  return VALID_PATHS.includes(path);
}

// Usage attempt
if (isValidPath(enrichedTool.path)) {
  sdk.GET(enrichedTool.path, options); // STILL FAILS
}
```

**Result**: This fails because:

1. Type predicates narrow the type of the **variable**, not its literal value
2. `enrichedTool.path` remains type `string`, just narrowed to `string & keyof paths`
3. OpenAPI-fetch needs the **actual literal** like `"/lessons/{lesson}/summary"`

### Validation's Role

Validation serves a different purpose:

- **Request validation**: Ensures parameters match expected schema (we use Zod)
- **Response validation**: Ensures API responses match expected schema (we use Zod)
- **Path validation**: Could verify path is valid, but cannot convert to literal type

## Architectural Decision

### Where Assertions Are Required

1. **SDK → OpenAPI-fetch boundary**: Single `as any` for path parameter
   - Location: `tool-handler.ts:112`
   - Justification: Library requires compile-time literals, we have runtime strings

### Where Assertions Are NOT Required

1. **All parameter handling**: Validated by Zod schemas
2. **Response handling**: Validated by Zod schemas
3. **Tool name mapping**: Direct lookup in generated array
4. **HTTP method selection**: Literal types preserved through generation

### Assertion Guidelines

1. **Minimize scope**: Only assert at the exact boundary
2. **Document thoroughly**: Explain why it's necessary
3. **Validate safety**: Ensure the assertion is safe through generation
4. **Never cascade**: Don't let assertions propagate through the system

## Implementation Strategy

### Current Correct Implementation

```typescript
// tool-handler.ts - THE ONLY ASSERTION IN THE SYSTEM
const sdkPath = enrichedTool.path as any;
const result = await sdk.GET(sdkPath, {
  params: { query: queryParams, path: pathParams },
});
```

This is correct because:

1. **Minimal**: Single assertion at library boundary
2. **Safe**: Path comes from SDK-generated enriched tools
3. **Documented**: Clear explanation of why it's needed
4. **Isolated**: Doesn't affect any other code

### What We DON'T Do

```typescript
// WRONG: Casting to specific types
const sdkPath = enrichedTool.path as '/lessons/{lesson}/summary';

// WRONG: Multiple assertions
const method = enrichedTool.method as HttpMethod;
const params = userParams as SdkParams;

// WRONG: Asserting function types
const sdkMethod = sdk[method] as Function;
```

## Validation Strategy

### Where We Use Validation

1. **Incoming MCP requests**: Validate parameters against Zod schemas
2. **API responses**: Validate responses against Zod schemas
3. **Configuration**: Validate environment variables and config files

### Generated Validators

```typescript
// request-validators.ts
export function validateRequest(
  path: string,
  method: HttpMethod,
  args: unknown,
): ValidationResult<unknown> {
  // Uses generated Zod schemas
  const schema = parameterSchemaMap.get(key);
  return parseEndpointParameters(schema, args);
}
```

## Consequences

### Positive

1. **Type safety preserved**: Full type flow except at unavoidable boundary
2. **Central contract maintained**: API changes only require regeneration
3. **Validation comprehensive**: All data validated at boundaries
4. **Minimal assertions**: Only one `as any` in entire system

### Negative

1. **Cannot achieve zero assertions**: OpenAPI-fetch design makes this impossible
2. **Runtime overhead**: Validation adds processing time
3. **Generation complexity**: Must maintain generation scripts

### Neutral

1. **Industry standard**: Reference implementation also accepts boundary assertions
2. **Library limitation**: Not our design flaw, but external constraint

## Conclusion

Our architecture achieves the optimal balance:

- **Maximum type safety** within TypeScript's capabilities
- **Minimal assertions** only at unavoidable boundaries
- **Comprehensive validation** for runtime safety
- **Maintained central contract** for automatic updates

The single type assertion at the OpenAPI-fetch boundary is not a compromise or failure—it's the architecturally correct solution for bridging compile-time and runtime type systems.

## References

- Reference Oak Curriculum API Client implementation
- OpenAPI-fetch documentation
- TypeScript handbook on literal types
- ADR-029: No Manual API Data
- ADR-030: SDK as Single Source of Truth
- ADR-031: Generation at Build Time
