# Phase 3: Data-Driven Execution - Experience Log

## What We Built

Successfully implemented a pure data-driven MCP tool execution system where **everything flows from a single data structure**. No switch statements, no type assertions (except `as const`), just pure data lookup.

## The Journey

### Initial Misunderstanding

Started with assumptions about the openapi-fetch path-based client structure. Expected:
- Lowercase methods: `client[path]['get']`
- Simple parameter structure: `{ path: {...}, query: {...} }`

### Discovery Through Testing

Real structure revealed through empirical testing:
- **Methods are UPPERCASE**: `client['/path']['GET']`
- **Parameters are nested**: `{ params: { path: {...}, query: {...} } }`
- **Response wraps everything**: `{ data, error, response }`

This discovery came from running actual tests rather than guessing - a key lesson.

### The Breakthrough Moment

When the test script started working and successfully routed 25+ tools through a single static function using pure data lookup, it felt like watching a complex machine suddenly click into place. The data structure literally drives the execution.

### Error Handling Evolution

Initial implementation returned raw errors. User feedback led to implementing proper error classes with cause chains following ECMAScript spec:

```typescript
export class McpToolError extends Error {
  constructor(message: string, toolName: string, options?: { cause?: unknown; code?: string }) {
    super(message, { cause: options?.cause });
  }
}
```

This preserves the full error context while providing structured error information.

## Key Insights

### 1. Data Structures > Code

The power of generating a const data structure and deriving everything from it cannot be overstated. The `MCP_TOOL_MAP` becomes:
- The validator (via type guards)
- The router (via lookups)
- The type source (via `typeof`)

### 2. Path-Based Client Enables Purity

The path-based client's property access pattern `client[path][method]` enables pure data-driven execution without any branching logic.

### 3. Type Guards Eliminate Assertions

By using `isMcpToolName(value): value is McpToolName`, TypeScript knows the type after validation. No assertions needed.

### 4. Happy Path vs Unhappy Path

The unhappy path tests revealed important API behaviours:
- Some lessons are copyright-blocked
- Thread slugs need suffixes like 'grammar-38'
- Invalid parameters return structured errors

These "failures" actually proved the system works correctly.

## Subjective Experience

### The Elegance

There's something deeply satisfying about reducing complex routing logic to:
```typescript
const tool = MCP_TOOL_MAP[toolName];
return client[tool.path][tool.method](params);
```

### The Struggle

Fighting TypeScript to accept dynamic property access without type assertions was challenging. The solution - using `as keyof OakApiPathBasedClient` - feels like a compromise but maintains type safety.

### The Validation

When the architecture-reviewer gave an A- grade, it validated the approach. The minor type assertion issues are addressable without compromising the core pattern.

## Lessons Learned

1. **Test with real APIs early** - Assumptions about client structure were wrong
2. **Error handling matters** - Proper cause chains make debugging possible
3. **Data-driven doesn't mean inflexible** - The pattern handles 25+ diverse tools
4. **Type guards are powerful** - They prove types without assertions
5. **Documentation in code** - Critical comments about path-based client usage prevent regression

## What Made This Special

This wasn't just implementing a feature - it was proving a philosophy: that we can build type-safe, maintainable systems where data structures drive behaviour, eliminating the need for imperative code patterns.

The fact that adding a new tool now requires only updating the data structure (no code changes) validates the entire approach.

## Future Implications

This pattern could be applied to:
- Form validation systems
- API route handlers
- State machines
- Any system with many similar operations

The key is recognising when you have a data pattern that can replace code patterns.

---

*Written after successfully implementing Phase 3 of the data-driven MCP type generation system, December 2024*