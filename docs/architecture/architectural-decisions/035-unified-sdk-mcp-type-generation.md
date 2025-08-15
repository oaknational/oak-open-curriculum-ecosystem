# ADR-035: Unified SDK-MCP Type Generation

## Status

Accepted

## Context

The MCP server and SDK were treating type generation as separate concerns, leading to:
- Runtime tool generation in the MCP server
- Type assertions to bridge compile-time and runtime boundaries
- Hardcoded mappings between tools and schemas
- Violations of the "everything flows from the schema" principle

We discovered that the SDK and MCP are not separate systems - they're one unified system where all types should flow from a single generation point.

## Decision

We will generate ALL MCP tool types, parameters, and validators at SDK type-generation time, making the entire SDK+MCP system a pure function of the OpenAPI schema.

### Three-Phase Generation Pipeline

1. **typegen.ts** - Generates OpenAPI artifacts and basic MCP tool types
2. **zodgen.ts** - Generates Zod schemas from OpenAPI
3. **mcp-toolgen.ts** - Reads actual Zod output and generates validator mappings

This approach ensures we never predict what another generator will produce - we read actual outputs.

### Central Contract

The entire SDK+MCP system is a pure function of the OpenAPI schema:

```
OpenAPI Schema (Single Source of Truth)
           ↓
    SDK Type-Gen (ONE command: pnpm type-gen)
           ↓
    Generates EVERYTHING:
    • Data structures (MCP_TOOLS_DATA)
    • TypeScript types (McpToolName, ToolParameters<T>)
    • Type guards (isMcpToolName)
    • Zod validators (MCP_TOOL_VALIDATORS)
    • Tool definitions
    • Parameter types
    • Response schemas
           ↓
    SDK exports all
           ↓
    MCP imports and uses
```

### Key Principles

1. **No Predictions**: Never try to predict what another generator will produce
2. **No Hardcoding**: All mappings flow from the schema
3. **No Type Assertions**: Except the single schema parse at the boundary
4. **Pure Functions**: The entire system is deterministic from the schema

## Consequences

### Positive

- **Zero Runtime Generation**: Everything is known at compile time
- **Full Type Safety**: No type assertions in usage code
- **Automatic Updates**: Schema changes require only `pnpm type-gen`
- **Simpler Architecture**: Removes artificial boundaries between SDK and MCP
- **Better Developer Experience**: IDE knows all types at development time
- **Defence in Depth**: TypeScript types + Zod runtime validation

### Negative

- **Build Complexity**: Three-phase generation is more complex than single-phase
- **Ordering Dependency**: mcp-toolgen must run after zodgen
- **File System Reads**: mcp-toolgen reads generated files from disk

### Neutral

- The SDK becomes larger as it includes MCP-specific types
- Documentation must be regenerated when tools change
- Test fixtures need updating when the schema changes

## Implementation Details

### File Structure

```
packages/oak-curriculum-sdk/
├── scripts/
│   ├── typegen.ts              # Phase 1: OpenAPI types
│   ├── zodgen.ts               # Phase 2: Zod schemas
│   ├── mcp-toolgen.ts          # Phase 3: MCP validators
│   └── typegen/
│       └── mcp-tools/
│           ├── index.ts        # Extract tools from OpenAPI
│           ├── parameters.ts   # Generate parameter types
│           └── validators.ts   # Map to Zod validators
└── src/
    └── types/
        └── generated/
            └── api-schema/
                ├── mcp-tools.ts      # Generated tool data
                ├── mcp-parameters.ts # Generated parameters
                └── mcp-validators.ts # Generated validators
```

### Type Examples

```typescript
// Literal union of all tool names
export type McpToolName = 
  | 'oak-get-sequences-units'
  | 'oak-get-lessons-transcript'
  | 'oak-search-lessons'
  // ... all 25 tools

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

// Type guard without assertions
export function isMcpToolName(value: unknown): value is McpToolName {
  return typeof value === 'string' && value in MCP_TOOLS_DATA;
}
```

## Related Decisions

- ADR-029: No manual API data structures
- ADR-030: SDK as single source of truth
- ADR-031: Generation-time extraction
- ADR-032: External boundary validation
- ADR-034: System boundaries and type assertions
- ADR-036: Data-driven type generation pattern (refinement of this ADR)

## References

- Implementation plan: `.agent/plans/unified-sdk-mcp-type-generation.md`
- Data-driven refinement: `.agent/plans/data-driven-mcp-type-generation.md`
- Logger pattern: `ecosystem/histoi/histos-logger/src/log-levels.ts`
- MCP server: `ecosystem/psycha/oak-curriculum-mcp/`
