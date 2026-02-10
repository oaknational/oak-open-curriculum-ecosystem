# ADR-054: Tool-Level Authentication Error Interception and \_meta Emission

**Status**: Accepted  
**Date**: 2025-11-23  
**Related**: [ADR-052 (OAuth 2.1)](052-oauth-2.1-for-mcp-http-authentication.md), [ADR-053 (Clerk)](053-clerk-as-identity-provider.md)

## Context

ChatGPT's OAuth linking UI only appears when the MCP server provides **both** signals:

1. **Tool registration**: `securitySchemes` field indicating OAuth is available
2. **Error responses**: `_meta["mcp/www_authenticate"]` field indicating OAuth is necessary

Without the `_meta` field in error responses, users see generic auth failures instead of a "Connect" button to authenticate.

### The Human Impact

An educator using ChatGPT asks: "Show me Year 7 maths lessons." Without proper error handling:

- ❌ **Bad UX**: "Authentication failed" - user hits a wall
- ✅ **Good UX**: "Connect your Oak account to access curriculum data" - clear path forward

We're building the second experience. The technical requirement is to detect authentication errors at the tool execution layer and transform them into MCP-compliant responses with the `_meta` field.

### Architectural Challenge: Error Cause Preservation

The SDK follows best practices with Result<T, E> pattern and error cause chains. However, by the time errors reach the MCP handler, structured information is lost:

```typescript
// Error flow through the stack:
1. HTTP client throws Error { status: 401 }
2. executeToolCall() catches, wraps: { error: McpToolError { cause: Error { status: 401 } } }
   Type: ToolExecutionResult ✅ Preserves structured error

3. createUniversalToolExecutor() maps to CallToolResult (MCP protocol format)
   Type: CallToolResult ❌ Only text content, structured error lost

4. Handler receives CallToolResult
   Problem: Cannot access original error object to check status code
```

**The Core Issue**: We need to detect auth errors (check HTTP status codes, Clerk error patterns) but the error object is no longer accessible after transformation to `CallToolResult`.

### Architectural Constraint: Schema-First

Per [schema-first directive](../../../.agent/directives/schema-first-execution.md), the SDK's types and error handling flow from the OpenAPI schema. We cannot modify the SDK to add MCP-specific metadata to `ToolExecutionResult` or `CallToolResult` - that would violate schema-first.

The MCP server layer (apps) is where MCP protocol-specific concerns belong.

### Rejected Approaches

**Approach 1: Parse Error Text in Handler** ❌

```typescript
// After executor returns CallToolResult
if (result.isError) {
  const errorText = result.content[0].text;
  if (errorText.includes('401') || errorText.includes('Unauthorized')) {
    // Heuristic detection
  }
}
```

Rejected because:

- Violates "preserve type information" principle
- Fragile (error messages can change)
- Loses structured data (status codes, error types)
- Goes against Result<T,E> best practice

**Approach 2: Modify SDK to Preserve Error Metadata** ❌

Add error metadata to `CallToolResult` so it's available at handler level.

Rejected because:

- Violates schema-first (SDK types flow from OpenAPI, not MCP concerns)
- Wrong architectural layer (MCP metadata doesn't belong in schema-driven SDK)
- Creates coupling between SDK and MCP protocol

**Approach 3: Catch Errors in Handler's Outer Try/Catch** ❌

Wrap executor call in try/catch and detect auth errors there.

Rejected because:

- Executor never throws - it returns `CallToolResult` (Result pattern)
- Would only catch synchronous errors in executor creation, not execution errors
- Doesn't align with how the code actually works

## Decision

**Intercept authentication errors in the `executeMcpTool` callback where we receive `ToolExecutionResult` with structured error objects.**

The handler already provides an `executeMcpTool` callback to the executor. This callback receives `ToolExecutionResult`, which preserves the error object with cause chain. We intercept at this point:

1. Check if result contains an error
2. Extract the underlying error (via `cause` chain if wrapped)
3. Use pure detection functions to identify auth errors
4. If auth error detected, throw it
5. Outer try/catch in handler catches the thrown error
6. Handler formats MCP response with `_meta` field

### Implementation Pattern

```typescript
// In handlers.ts - registerHandlers function
server.registerTool(tool.name, config, async (params: unknown) => {
  try {
    const client = deps.createClient(apiKey);
    const executor = deps.createExecutor({
      executeMcpTool: async (name, args) => {
        const execution = await deps.executeMcpTool(name, args, client);

        // INTERCEPTION POINT: We have ToolExecutionResult here
        if ('error' in execution && execution.error) {
          const { error } = execution;
          // Check error or its cause for auth signals
          const authCheckTarget = error.cause ?? error;

          if (isAuthError(authCheckTarget)) {
            // Throw so outer handler can format with _meta
            throw authCheckTarget;
          }
        }

        return execution; // Non-auth errors proceed normally
      },
    });

    return await executor(tool.name, params ?? {});
  } catch (error) {
    // Outer handler catches thrown auth errors
    if (isAuthError(error)) {
      const resourceUrl = deps.getResourceUrl();
      const errorType = getAuthErrorType(error);
      const description = getAuthErrorDescription(error);

      logger.warn('Tool execution auth error', {
        toolName: tool.name,
        errorType,
        description,
      });

      return createAuthErrorResponse(errorType, description, resourceUrl);
    }
    throw error; // Re-throw non-auth errors
  }
});
```

### Pure Functions (Separate Concern)

Auth error detection and response formatting are implemented as pure functions:

- `isAuthError(error: unknown): boolean` - Detects HTTP 401/403, Clerk auth errors
- `getAuthErrorType(error: unknown): AuthErrorType` - Maps to RFC 6750 error types
- `getAuthErrorDescription(error: unknown): string` - Extracts user-friendly message
- `createAuthErrorResponse(type, description, resourceUrl): AuthErrorResponse` - Generates MCP response

These are tested independently with 47 unit tests (TDD: Red → Green → Refactor).

## Rationale

### Why This Layer is Correct

**Architectural Boundaries**:

| Layer                       | Type         | Has Structured Error?                       | Our Action           |
| --------------------------- | ------------ | ------------------------------------------- | -------------------- |
| HTTP Client                 | throws       | ✅ `Error { status: 401 }`                  | -                    |
| executeToolCall             | returns      | ✅ `{ error: McpToolError { cause: ... } }` | -                    |
| **executeMcpTool callback** | **receives** | **✅ ToolExecutionResult**                  | **← INTERCEPT HERE** |
| createUniversalToolExecutor | returns      | ❌ CallToolResult (text only)               | Too late             |
| Handler                     | receives     | ❌ CallToolResult                           | Too late             |

We intercept at the last layer where structured error information exists.

### Result<T,E> Pattern Compliance

This approach perfectly aligns with Result<T,E> best practices:

```typescript
const result: ToolExecutionResult = await executeMcpTool(name, args, client);

// Standard Result pattern: Check discriminant, handle each case
if ('error' in result) {
  const error = result.error;
  // Access structured error object with cause chain
  // Make decisions based on error type/properties
} else {
  const data = result.data;
  // Success path
}
```

### Type Information Preservation

- ✅ No type assertions (`as`, `any`, `!`)
- ✅ No heuristic text parsing
- ✅ Access actual error objects with status codes
- ✅ Preserve cause chains
- ✅ Type-safe error checking

### Schema-First Compliance

- ✅ SDK types unchanged (flow from OpenAPI schema)
- ✅ MCP-specific logic in MCP server layer (apps)
- ✅ No coupling between SDK and MCP protocol
- ✅ Running `pnpm type-gen && pnpm build` still brings everything into alignment

### Testability

Integration tests can inject mock `executeMcpTool` that returns error results:

```typescript
const mockExecuteMcpTool = vi.fn().mockResolvedValue({
  error: {
    message: 'Unauthorized',
    cause: Object.assign(new Error('Unauthorized'), { status: 401 }),
  },
});

// Test that handler intercepts and formats _meta response
```

No complex mocking required - simple dependency injection.

## Consequences

### Positive

1. **Human Impact**: Educators see "Connect" button instead of cryptic errors
2. **Architectural Cleanliness**: Respects layer boundaries, schema-first, Result<T,E>
3. **Type Safety**: No type assertions, preserves error cause chains
4. **Testability**: Simple mocks, pure functions, comprehensive unit tests
5. **Observability**: Structured logging with context (toolName, errorType, description)
6. **Maintainability**: Clear separation of concerns, well-documented

### Neutral

1. **Additional Callback Logic**: The `executeMcpTool` callback now has error interception logic
   - **Mitigation**: Well-documented, tested, single responsibility
2. **Error Throwing Pattern**: We throw errors from callback to be caught by outer handler
   - **Mitigation**: This is standard exception handling, clear flow

### Negative

1. **Indirect Flow**: Error interception happens in callback, formatting in outer handler
   - **Mitigation**: Comprehensive comments explain the two-phase approach
   - **Benefit**: Separation of concerns (detection vs formatting)

## References

- **Plan**: `.agent/plans/schema-first-security-implementation.md` (Sub-Phase 2.7)
- **OpenAI Docs**: MCP authorization spec (ChatGPT OAuth requirements)
- **RFC 6750**: OAuth 2.0 Bearer Token Usage (WWW-Authenticate format)
- **Implementation**:
  - `apps/oak-curriculum-mcp-streamable-http/src/auth-error-detector.ts` (pure functions)
  - `apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts` (pure function)
  - `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` (integration)

## Notes

### Universal Best Practice: Error Cause Preservation

This decision exemplifies a universal principle: **Preserve error cause chains throughout the system.**

The `cause` property in JavaScript errors (and our `McpToolError`) allows errors to be wrapped while preserving the original context. This ADR shows why this matters:

- Original error has `status: 401` (structured data)
- Wrapped as `McpToolError` with `cause` pointing to original
- Interception code checks `error.cause ?? error` to find auth signal
- Without `cause`, we'd only have wrapped message (loses status code)

**Lesson**: Always use `{ cause: originalError }` when wrapping errors. It's cheap to preserve, expensive to lose.

### Schema-First vs MCP-Specific Metadata

This ADR clarifies an important boundary:

- **Schema-First** applies to SDK types that flow from OpenAPI (client methods, validators, response types)
- **MCP Protocol Metadata** (like `_meta` field) belongs in the MCP server layer, not the SDK
- Adding `_meta` to error responses is correct - it's MCP protocol-specific, not schema-derived

Running `pnpm type-gen && pnpm build` brings SDK into alignment with schema. It doesn't generate MCP protocol metadata - that's the apps layer's job.

### TDD at Integration Level

This sub-phase demonstrated TDD at the integration level:

1. **RED**: Wrote integration tests proving tool handlers intercept auth errors
2. **GREEN**: Implemented interception in `handlers.ts` to make tests pass
3. **REFACTOR**: Extracted pure functions, improved testability

Integration tests validate how multiple units work together (detection functions + handler + logger + MCP SDK). They use simple mocks injected as arguments, no complex mocking frameworks.

This is distinct from E2E tests (coming in Tasks 2.7.7-2.7.8) which will validate the running system out-of-process with real HTTP requests.

## Related ADRs

- [ADR-052: OAuth 2.1 for MCP HTTP Server Authentication](052-oauth-2.1-for-mcp-http-authentication.md) - Why we need OAuth
- [ADR-053: Clerk as Identity Provider](053-clerk-as-identity-provider.md) - Auth provider choice
- [ADR-002: Pure Functions First](002-pure-functions-first.md) - Design principle (error detection as pure functions)
- [ADR-034: System Boundaries and Type Assertions](034-system-boundaries-and-type-assertions.md) - Type safety at boundaries
