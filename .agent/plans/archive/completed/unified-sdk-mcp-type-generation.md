# Unified SDK-MCP Type Generation

## Central Principle

**SDK+MCP system as pure function of OpenAPI schema.**

```text
OpenAPI Schema → SDK Type-Gen → All Data Structures, Types, Type Predicates
```

## Core Challenge

### The Boundary Problem

- **openapi-fetch requirement**: Exact literal types at compile time (`"ks1" | "ks2"` not `string`)
- **MCP reality**: Receives `unknown` parameters at runtime
- **Result**: we need to use type predicates to validate the parameters at runtime
- challenge: we need really good type predicates to validate the parameters at runtime
- solution part 1: we create one master schema data structure that contains all information about the schema, and use that to generate both comprehensive types and type predicates (already in place in the SDK type generation). See `reference/oak-curriculum-api-client/scripts/api-types/typegen.ts` relative to the repo root for an alternative example of this approach.
- solution part 2: we run the mcp tooling type-gen _after_ the sdk type-gen. We import the master schema data structure and the generated types and type predicates, and we use them to PROGRAMMATICALLY create a new data structure the master tool data structure, which is the SAME as the master schema data structure, but for each combination of path, operation, and parameter, we add programmatically defined tooling metadata (name, arguments, etc). It is VITAL that this generation only relies on the master schema data structure, the generated types, and the generated type predicates, if we add any hard coded values or custom types we break the contract.
- **constraints 1**: this means we can't use ANY custom types, as soon as we set something to string or number we are breaking the contract. ALL types must flow from the schema. THIS IS THE CORE CONTRACT.
- **constraints 2**: no disabling the type system, no `as`, `any`, `record<string, *>` etc. They all break the contract. And we DON'T NEED THEM, once the master tool data structure exists it contains all possible combinations of path, operation, and parameter, and the tool names and arguments and SDK response and return types for each one.

So:

Schema -> (Schema Data Structure -> Schema Types -> Schema Type Predicates) -> (Tool Data Structure -> Tool Types -> Tool Type Predicates)

with all of the types and type predicates flowing from the schema data structure and into the runtime code.

e.g.

```typescript
/**
 * The master data structure for log levels
 *
 * All types and type guards are derived from this.
 * Each level has:
 * - label: The string representation
 * - value: Numeric value for comparison (lower = more verbose)
 * - default: Whether this is the default level
 */
export const LOG_LEVEL_VALUES = {
  TRACE: { label: 'TRACE', value: 0, default: false },
  DEBUG: { label: 'DEBUG', value: 10, default: false },
  INFO: { label: 'INFO', value: 20, default: true },
  WARN: { label: 'WARN', value: 30, default: false },
  ERROR: { label: 'ERROR', value: 40, default: false },
  FATAL: { label: 'FATAL', value: 50, default: false },
} as const;

/**
 * Log levels: TRACE, DEBUG, INFO, WARN, ERROR, FATAL
 */
export type LogLevel = keyof typeof LOG_LEVEL_VALUES;

/**
 * Standard environment variable keys for logging configuration
 */
export const LOG_LEVEL_KEY = 'LOG_LEVEL' as const;
export const ENABLE_DEBUG_LOGGING_KEY = 'ENABLE_DEBUG_LOGGING' as const;

/**
 * Base logging environment interface
 * Use this to ensure consistent logging configuration across organisms
 */
export interface BaseLoggingEnvironment {
  [LOG_LEVEL_KEY]: LogLevel;
  [ENABLE_DEBUG_LOGGING_KEY]: boolean;
}

/**
 * Type guard to check if a value is a valid LogLevel
 * @param value - Unknown value to check
 * @returns True if value is a valid LogLevel
 */
export function isLogLevel(value: unknown): value is LogLevel {
  if (typeof value !== 'string') {
    return false;
  }
  return Object.keys(LOG_LEVEL_VALUES).includes(value);
}
```

But with more sophisticated data structures, and types that retain the constraints of that data structure, like

```typescript
//Generated code
/**
 * For each path, and each method within that path,
 * map to the return type of a 200 response.
 *
 * This works because the raw schema type and the OpenAPI-TS type use the path as the key.
 */
export type PathReturnTypes = {
  [P in ValidPath]: {
    get: Paths[P]['get']['responses'][200]['content']['application/json'];
  };
};
```

or

```typescript
//Generated code
// Make ValidPathAndParameters parameterized by the path key K
type ValidPathAndParameters<K extends PathGroupingKeys> = {
  // Only include paths that are valid for this specific K
  [P in ValidPath as P extends keyof Paths ? P : never]?: ValidParameterCombination<P, K>;
};
```

Basically, deeply analyse and understand reference/oak-curriculum-api-client/scripts/api-types/typegen.ts (relative to the repo root) and apply those patterns to both the SDK and MCP type generation at type generation time.

Then, we use `unknown` in the public API of the SDK, where we need to use the generated type-predicates at runtime to validate the parameters.

We expose the MCP specific API of the SDK, which only takes TYPED parameters. Then we use `unknown` one more time for the mcp tool name and arguments, use the generated mcp tool type-predicates to validate the tool amd parameters combo at runtime, and then pass them to the strongly typed SDK API for MCP tools.

## Current, Broken System Architecture & Flow **BAD**

Note that the repo code is currently a mess, and the flow is not as described above. It is a mix of old approaches, and it is not clear which one is being used where. Go slowly and carefully, validate each step, and do not seek to preserve the current state.

### Build-Time Flow (Type Generation)

```text
1. OpenAPI Schema (JSON)
   ↓
2. SDK type-gen script runs
   ↓
3. Generates:
   - API types (paths, components)
   - MCP_TOOL_MAP data structure
   - executeToolCall function with switch
   ↓
4. SDK exports all generated code
```

### Runtime Flow (MCP → SDK)

```text
1. MCP receives tool call with unknown params
   ↓
2. MCP handler extracts params, calls SDK's executeToolCall
   ↓
3. executeToolCall switches on tool name
   ↓
4. Each case passes params to SDK method
   ↓
5. SDK validates & makes API call
   ↓
6. Response returned through chain
```

### Generated Structure: MCP_TOOL_MAP

Maps tool names to their OpenAPI operations:

```typescript
export const MCP_TOOL_MAP = {
  'oak-get-sequences-units': {
    mcpName: 'oak-get-sequences-units' as const,
    path: '/sequences/{sequence}/units' as const,
    method: 'get' as const,
    operationId: 'getSequences-getSequenceUnits',
    pathParams: ['sequence'] as const,
    queryParams: ['year'] as const,
    operation: paths['/sequences/{sequence}/units']['get'],
  },
  // ... 24 more tools
};
```

### Execution: Switch-Based Router

```typescript
export async function executeToolCall(
  toolName: string,
  params: unknown,
  sdk: OakApiClient,
): Promise<{ data?: unknown; error?: unknown }> {
  switch (toolName) {
    case 'oak-get-sequences-units': {
      const p = params as Record<string, unknown>;
      // @ts-expect-error - SDK validates exact types at runtime
      return sdk.GET('/sequences/{sequence}/units', {
        params: { path: { sequence: p.sequence }, query: { year: p.year } },
      });
    }
    // ... cases for all tools
  }
}
```

### Key Achievements

- ✅ NO `any` in generated code
- ✅ Single source of truth (OpenAPI schema)
- ✅ All types flow from schema
- ✅ MCP delegates to SDK completely
- ✅ Build-time generation (not runtime)

## Previous Attempts & Lessons

### Multiple Generator Attempts (Deleted)

Created 9 different generator approaches before settling on current solution:

- individual-executor-generator.ts
- direct-executor-generator.ts
- inline-typed-generator.ts
- no-any-generator.ts
- overload-generator.ts
- pure-passthrough-generator.ts
- schema-driven-generator.ts

**Key Lesson**: Trying to convert generic types to specific types always requires assertions. The solution is to avoid the conversion entirely.

## Next Steps

### Immediate

1. Regenerate SDK with current architecture (eliminates `@ts-expect-error`)
2. Run full test suite to validate
3. Update MCP handler if needed

### Future Considerations

- Type predicates for runtime validation (alternative to `@ts-expect-error`)
- Individual executor functions per tool (avoid generic→specific conversion)
- Zod integration for response validation

## Files Modified

### Core Generator

- `/packages/oak-curriculum-sdk/scripts/typegen/mcp-tools/mcp-tool-mapping-generator.ts`
  - Generates MCP_TOOL_MAP and executeToolCall

### Generated Output

- `/packages/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools.ts`
  - Contains generated tool mapping and execution logic

### MCP Integration

- `/ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/handlers/tool-handler.ts`
  - Uses SDK's executeToolCall function

## Success Metrics

- ✅ No `any`, `as`, `string`, or `record<string, *>` in generated code
- ✅ Single source of truth (OpenAPI)
- ✅ All types flow from schema
- ✅ Build-time generation for everything
- 🚧 No type suppression (current: uses `@ts-expect-error`)
- No disabling eslint rules

## Proposed alternative based on the core challenge

### High-Level Plan Sketch

**Core Insight**: Transform the boundary problem into a data-driven solution where type predicates prove runtime values match compile-time types, eliminating ALL type assertions and suppressions.

#### Phase 1: Master Schema Data Structure (SDK Type-Gen)

- Create exhaustive const data structure from OpenAPI schema
- Extract ALL paths, methods, parameters with literal types (`as const`)
- Include parameter types, optionality, enums, and constraints
- This becomes the single source of truth for ALL downstream generation

#### Phase 2: Type Predicates Generation (SDK Type-Gen)

- Generate comprehensive type predicates for each operation
- One predicate function per unique parameter combination
- Predicates validate against the schema data structure itself
- Return type-narrowed values that exactly match SDK requirements
- NO custom types - everything flows from the schema structure

#### Phase 3: MCP Tool Metadata Layer (MCP Type-Gen - Runs AFTER SDK)

- Import SDK's master schema data structure and generated types
- Programmatically add MCP-specific metadata (tool names, descriptions)
- Generate tool-specific type predicates that compose SDK predicates
- Create exhaustive switch that uses predicates to narrow before calling SDK
- NO hardcoded values - everything derived from imported SDK structures

#### Phase 4: Two-Boundary Validation Flow

- **Boundary 1**: MCP receives `unknown` → validate to known tool+params structure
- **Boundary 2**: Tool executor validates params → calls typed SDK methods
- Each boundary uses generated predicates, never assertions
- Runtime validation proves compile-time types are satisfied

#### Phase 5: Testing & Documentation

- Unit test ALL generated type predicates with valid/invalid inputs
- Integration test the complete MCP→SDK flow
- Generate comprehensive JSDoc documentation from schema
- Ensure every generated item is documented and testable

**Success Metric**: Zero `@ts-expect-error`, zero `as`, zero `any`, zero `Record<string, unknown>` in generated code. Everything flows from the schema data structure.

## References

- ADR-029: No manual API data structures
- ADR-030: SDK as single source of truth
- ADR-032: External boundary validation
