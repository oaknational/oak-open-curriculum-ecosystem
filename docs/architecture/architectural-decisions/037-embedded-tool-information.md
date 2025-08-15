# ADR-037: Minimal Tool Lookup Architecture

## Status
Accepted

## Context

The MCP (Model Context Protocol) server needs to map tool names to SDK operations while preserving complete type information. Previous approaches attempted to maintain separate mapping structures (MCP_TOOL_MAP, TOOL_EXECUTORS, PARAM_VALIDATORS) but encountered fundamental TypeScript limitations:

1. **Union Type Creation**: Accessing data structures with union keys creates union types that cannot be called
2. **Type Information Loss**: Separate structures required type assertions at runtime boundaries
3. **Complex Workarounds**: Attempts to preserve types through function references added complexity without solving the core problem
4. **Duplicate Generation**: Maintaining separate MCP-specific type generation pipeline alongside SDK generation

The core issue: when `toolName` is a union type (all possible tool names), accessing `TOOL_EXECUTORS[toolName]` creates a union of all executor functions with incompatible signatures, making the result uncallable without type assertions.

## Decision

We will **generate only a minimal lookup table** from tool names to schema coordinates. All other information already exists in the schema.

### Implementation

```typescript
// Export the schema as a runtime constant
export const schema = {...} as const;

// The ONLY generated structure needed
export const TOOL_LOOKUP = {
  'oak-get-sequences-units': {
    path: '/sequences/{sequence}/units' as const,
    method: 'GET' as const
  }
  // ... other tools with just path/method
} as const;

// Type guard
export function isToolName(value: unknown): value is keyof typeof TOOL_LOOKUP {
  return typeof value === 'string' && value in TOOL_LOOKUP;
}

// Access pattern
const { path, method } = TOOL_LOOKUP[toolName];
const operation = schema.paths[path][method]; // All data lives here
```

## Consequences

### Positive

1. **Absolute Minimum Redundancy**: Only tool name → path/method mapping is new
2. **Zero Type Loss**: Direct schema access preserves all type relationships
3. **No Type Assertions**: Type guards prove validity without requiring assertions
4. **Single Source of Truth**: OpenAPI schema contains all operation data
5. **Maximum Simplicity**: One lookup table, one type guard, direct access
6. **Maintainable**: Minimal generation, less code to maintain
7. **Type-Safe Execution**: Direct client access with validated parameters

### Negative

1. **Runtime Schema Required**: Schema must be available at runtime (mitigated: schemas are typically small)
2. **O(1) Lookup Required**: Need lookup table for performance (mitigated: minimal structure, easy to generate)

### Neutral

1. **Migration Required**: Existing code using TOOL_EXECUTORS pattern must be updated
2. **Documentation Updates**: New pattern requires documentation for maintainers

## Alternatives Considered

### 1. TOOL_EXECUTORS Pattern (Abandoned)
Function references that attempted to preserve types:
```typescript
export const TOOL_EXECUTORS = {
  'oak-get-sequences-units': (client) => client['/sequences/{sequence}/units'].GET
}
```
**Rejected because**: Creates union types when accessed with union keys, requiring type assertions.

### 2. Complex Type Gymnastics
Using conditional types and type-level programming to preserve relationships.
**Rejected because**: Added significant complexity without fully solving the union problem.

### 3. Runtime Type Assertions
Accept type assertions at validated runtime boundaries.
**Rejected because**: Violates our principle of zero type assertions, indicating design flaws.

## Implementation Strategy

1. **Phase 1**: Enhance SDK generation to embed tool information
2. **Phase 2**: Generate reverse lookups and type guards
3. **Phase 3**: Update execute-tool-call.ts to use embedded approach
4. **Phase 4**: Update MCP server to use new patterns
5. **Phase 5**: Remove old patterns and clean up

## Related Decisions

- ADR-035: Unified SDK-MCP Type Generation (superseded by this decision)
- ADR-036: Data-Driven Type Generation (foundational principles still apply)
- ADR-034: System Boundaries and Type Assertions (reinforces no-assertion principle)
- ADR-030: SDK Single Source Truth (extended by embedding tool info)

## References

- TypeScript Handbook: Union Types and Type Guards
- Reference implementation: oak-curriculum-api-client VALID_PATHS_BY_PARAMETERS pattern
- MCP Protocol Specification

## Notes

This decision represents the ultimate simplification: we only generate what's truly new (tool names) and map them to coordinates in the existing schema. Everything else - parameters, types, descriptions - already exists.

The pattern follows the reference implementation's approach of exporting the schema as a runtime constant and using minimal helper structures. This is the simplest possible solution that maintains type safety and performance.