# ADR-036: Data-Driven Type Generation Pattern

## Status

Accepted

## Context

While implementing ADR-035 (Unified SDK-MCP Type Generation), we discovered that generating imperative code (switch statements, individual functions) was creating unnecessary complexity and requiring type suppressions (`@ts-expect-error`).

Analysis of the reference implementation (`reference/oak-curriculum-api-client/scripts/api-types/typegen.ts`) revealed a superior pattern: generate data structures, not code. The data structure itself becomes the validator, router, and type source.

## Decision

We will adopt a data-driven type generation pattern where:

1. **Generate data structures, not imperative code**
2. **Types are derived from data using `typeof` and index access**
3. **Type guards validate against the data structure itself**
4. **Routing uses validated keys for type-safe lookup**

### Core Pattern

```typescript
// 1. Data structure (single source of truth)
export const MCP_TOOLS = {
  'oak-get-sequences-units': {
    path: '/sequences/{sequence}/units' as const,
    method: 'get' as const,
    pathParams: ['sequence'] as const,
    queryParams: ['year'] as const,
  },
  // ... all tools
} as const;

// 2. Types derived from data
export type McpToolName = keyof typeof MCP_TOOLS;
export type ToolConfig<T extends McpToolName> = typeof MCP_TOOLS[T];

// 3. Type guard checks against data
export function isMcpToolName(value: string): value is McpToolName {
  return value in MCP_TOOLS;
}

// 4. Lookup-based execution (no switch needed)
const tool = MCP_TOOLS[validatedToolName];  // Type-safe!
```

### The `maybe` Pattern

Use the prefix `maybe` for unvalidated values to make the validation flow explicit:

```typescript
export async function executeToolCall(
  maybeToolName: string,      // Unvalidated
  maybeParams: unknown,        // Unvalidated
  sdk: OakApiClient
) {
  // Validate tool name
  if (!isMcpToolName(maybeToolName)) {
    throw new TypeError(`Unknown tool: ${maybeToolName}`);
  }
  const toolName: McpToolName = maybeToolName;  // Now validated!
  
  // Validate params
  if (!isValidParamsForTool(toolName, maybeParams)) {
    throw new TypeError(`Invalid params for ${toolName}`);
  }
  const params: ToolParameters<typeof toolName> = maybeParams;  // Now validated!
  
  // Use validated keys for lookup
  const tool = MCP_TOOLS[toolName];
  return sdk[tool.method](tool.path, { params });
}
```

## Key Principles

### 1. Data as Source of Truth

The const data structure is the single source of truth for:
- Available values (via object keys)
- Type definitions (via `typeof`)
- Runtime validation (via inclusion checks)

### 2. No Switch Statements

Switch statements are unnecessary when you have:
- Validated keys that guarantee type-safe lookup
- Data structures that contain all routing information

### 3. Type Predicates, Not Assertions

Type predicates prove types at runtime without assertions:
- `value is Type` narrows the type when the predicate returns true
- No `as Type` assertions needed
- TypeScript's control flow analysis understands the narrowing

### 4. Generate Data, Not Code

Instead of generating:
```typescript
// ❌ Imperative code
switch(toolName) {
  case 'tool1': return executeTool1();
  case 'tool2': return executeTool2();
}
```

Generate:
```typescript
// ✅ Data structure
const TOOLS = {
  'tool1': { path: '/path1', method: 'get' },
  'tool2': { path: '/path2', method: 'post' },
}
```

## Consequences

### Positive

- **Eliminates ALL type suppressions**: No `@ts-expect-error`, no `as`, no `any`
- **Simpler generated code**: Data structures are easier to generate than imperative code
- **Better debugging**: Data structures are inspectable at runtime
- **Clearer validation flow**: The `maybe` pattern makes validation explicit
- **Type-safe dynamic access**: Validated keys enable type-safe lookup
- **Follows established patterns**: Aligns with reference implementation

### Negative

- **Learning curve**: Developers need to understand the data-driven pattern
- **Indirection**: Execution flow through data lookup rather than direct calls

### Neutral

- Performance is equivalent (object lookup is O(1) like switch)
- Testing approach changes from testing functions to testing data and validators

## Implementation

### Phase 1: Refactor MCP Tool Generation

Update `/packages/oak-curriculum-sdk/scripts/typegen/mcp-tools/mcp-tool-mapping-generator.ts`:
- Remove switch statement generation
- Generate pure data structure
- Generate type predicates that check against data

### Phase 2: Update Executor

Replace switch-based executor with lookup-based:
- Use validated keys for type-safe lookup
- Implement `maybe` pattern for validation flow

### Phase 3: Update MCP Handler

Adapt handler to use new data-driven approach:
- Same external API
- Cleaner internal implementation

## Validation

Success is achieved when:
1. Zero type suppressions in generated code
2. All routing via data lookup, not switches
3. Type predicates validate against data structures
4. The `maybe` pattern is used consistently

## Examples from Codebase

### Logger Pattern (`ecosystem/histoi/histos-logger/src/log-levels.ts`)

```typescript
export const LOG_LEVEL_VALUES = {
  DEBUG: { label: 'DEBUG', value: 10 },
  INFO: { label: 'INFO', value: 20 },
} as const;

export type LogLevel = keyof typeof LOG_LEVEL_VALUES;

export function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === 'string' && value in LOG_LEVEL_VALUES;
}
```

### Path Parameters (`reference/oak-curriculum-api-client`)

```typescript
export const KEY_STAGES = ["ks1", "ks2", "ks3", "ks4"] as const;
export type KeyStage = typeof KEY_STAGES[number];

export function isKeyStage(value: string): value is KeyStage {
  return KEY_STAGES.includes(value);
}
```

## Related Decisions

- ADR-029: No manual API data structures
- ADR-030: SDK as single source of truth
- ADR-031: Generation at build time
- ADR-032: External boundary validation
- ADR-034: System boundaries and type assertions
- ADR-035: Unified SDK-MCP type generation

## References

- Data-driven plan: `.agent/plans/data-driven-mcp-type-generation.md`
- Reference implementation: `reference/oak-curriculum-api-client/scripts/api-types/typegen.ts`
- Logger pattern: `ecosystem/histoi/histos-logger/src/log-levels.ts`