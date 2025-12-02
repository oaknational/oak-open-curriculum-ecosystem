# ADR-056: Conditional Clerk Middleware for MCP Discovery Methods

**Status**: Accepted  
**Date**: 2025-12-01  
**Related**: [ADR-052 (OAuth 2.1)](052-oauth-2.1-for-mcp-http-authentication.md), [ADR-053 (Clerk)](053-clerk-as-identity-provider.md), [ADR-054 (Tool-Level Auth)](054-tool-level-auth-error-interception.md)

## Context

ChatGPT makes multiple MCP protocol requests when refreshing a conversation or reconnecting to an MCP server:

1. `initialize` - Server capability negotiation
2. `tools/list` - Tool catalog discovery
3. `resources/list` - Resource discovery
4. `prompts/list` - Prompt discovery
5. `resources/templates/list` - Template discovery
6. Potentially multiple `resources/read` calls for widget templates

With **~28 requests on refresh** and **~170ms Clerk middleware overhead per request**, the total latency becomes significant (~5 seconds), causing timeouts and poor user experience.

### The Human Impact

An educator using ChatGPT with Oak curriculum tools experiences:

- ❌ **Bad UX**: ~5 second delays on page refresh, potential timeouts
- ✅ **Good UX**: Sub-second discovery, instant tool availability

### Technical Analysis

The `clerkMiddleware()` from `@clerk/express` is installed globally per Clerk best practices. It runs on every request to set up authentication context, even for requests that don't need authentication.

Per MCP specification and OpenAI Apps requirements, **discovery methods must work without authentication**:

- `initialize` - Must return server capabilities without auth
- `tools/list` - Must return tool catalog without auth
- `resources/list` - Must return resource catalog without auth
- `prompts/list` - Must return prompt catalog without auth

The existing `createMcpRouter` already skips **auth enforcement** for discovery methods, but Clerk middleware still runs to set up auth context (~170ms overhead).

### Rejected Approaches

**Approach 1: Move clerkMiddleware to /mcp routes only** ❌

```typescript
// Only apply Clerk to /mcp routes
app.use('/mcp', clerkMiddleware());
```

Rejected because:

- Violates Clerk best practices (global middleware)
- Could break auth context for other routes
- Doesn't solve the core problem (still runs for all /mcp requests)

**Approach 2: Use Clerk's lazy auth loading** ❌

Investigate if Clerk can defer auth setup until actually needed.

Rejected because:

- Clerk's architecture requires context setup early
- No documented lazy loading option
- Would require significant upstream changes

**Approach 3: Remove Clerk entirely for discovery** ❌

Skip all Clerk code for discovery methods.

Rejected because:

- May break observability/logging that depends on Clerk context
- Could cause issues if future features need auth context in discovery

## Decision

**Create conditional middleware that skips Clerk auth context setup for MCP discovery methods while preserving it for all other requests.**

The conditional middleware:

1. Parses the request body to extract the MCP method
2. Checks if the method is a discovery method
3. Skips clerkMiddleware entirely for discovery methods
4. Applies clerkMiddleware for all other requests

### Implementation Pattern

```typescript
// conditional-clerk-middleware.ts
export function createConditionalClerkMiddleware(
  clerkMw: RequestHandler,
  logger: Logger,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (shouldSkipClerkMiddleware(req)) {
      logger.debug('clerkMiddleware skipped for discovery/public method', {
        path: req.path,
        mcpMethod: getMcpMethodFromBody(req.body),
      });
      next();
      return;
    }

    // Run clerkMiddleware for requests that might need auth
    clerkMw(req, res, next);
  };
}
```

### Skip Criteria

Discovery methods that skip Clerk:

- `initialize` - MCP capability negotiation
- `tools/list` - Tool discovery
- `resources/list` - Resource discovery
- `prompts/list` - Prompt discovery
- `resources/templates/list` - Template discovery
- `notifications/initialized` - Client notification

Public paths that skip Clerk:

- `/.well-known/oauth-protected-resource` - OAuth metadata
- `/.well-known/openid-configuration` - OIDC discovery
- `/health` - Health check
- `/ready` - Readiness check

### Integration

```typescript
// auth-routes.ts - setupGlobalAuthContext
const rawClerkMiddleware = clerkMiddleware();
const instrumentedClerkMw = instrumentMiddleware('clerkMiddleware', rawClerkMiddleware, log);
const conditionalClerkMw = createConditionalClerkMiddleware(instrumentedClerkMw, log);
app.use(conditionalClerkMw);
```

## Rationale

### Why This Layer is Correct

**Middleware Chain Flow**:

| Middleware            | Discovery Requests | Auth-Required Requests |
| --------------------- | ------------------ | ---------------------- |
| CORS                  | ✅ Runs            | ✅ Runs                |
| Security Headers      | ✅ Runs            | ✅ Runs                |
| **Conditional Clerk** | ⏭️ **SKIPPED**     | ✅ Runs                |
| MCP Router            | ✅ Runs            | ✅ Runs                |
| MCP Handler           | ✅ Runs            | ✅ Runs                |

Discovery requests bypass Clerk (~170ms saved), other requests get full auth context.

### MCP Protocol Compliance

Per MCP specification:

- Discovery methods MUST work without authentication
- Tool execution methods MAY require authentication
- Auth enforcement happens at tool execution, not discovery

This optimization correctly reflects that discovery needs NO auth context, not just no auth enforcement.

### Latency Impact

| Scenario                        | Before | After  | Improvement    |
| ------------------------------- | ------ | ------ | -------------- |
| Single discovery request        | ~175ms | ~5ms   | **97% faster** |
| 28 discovery requests (refresh) | ~5s    | ~140ms | **97% faster** |
| Tool execution                  | ~175ms | ~175ms | No change      |

### Type Safety

The implementation uses type guards, not type assertions:

```typescript
function hasMethodProperty(value: unknown): value is { method: unknown } {
  return typeof value === 'object' && value !== null && 'method' in value;
}

function getMcpMethodFromBody(body: unknown): string | undefined {
  if (hasMethodProperty(body) && typeof body.method === 'string') {
    return body.method;
  }
  return undefined;
}
```

## Consequences

### Positive

1. **Human Impact**: Educators experience instant discovery (~140ms vs ~5s)
2. **Protocol Compliance**: Correctly reflects that discovery needs no auth context
3. **Observability**: Debug logging tracks which requests skip Clerk
4. **No Auth Degradation**: Tool execution still gets full Clerk context
5. **Type Safety**: Pure functions with type guards, no assertions

### Neutral

1. **Request Body Parsing**: Middleware parses body to detect method
   - **Mitigation**: Body is already parsed by express.json() middleware
   - **Impact**: Negligible overhead (~1ms)

2. **Additional Middleware Layer**: New conditional wrapper
   - **Mitigation**: Simple pass-through for non-discovery
   - **Benefit**: Single responsibility, testable

### Negative

1. **Coupling to MCP Protocol**: Middleware knows about MCP methods
   - **Mitigation**: Uses existing `isDiscoveryMethod` from mcp-method-classifier
   - **Benefit**: Reuses existing protocol classification

## Configuration

### Vercel Function Settings

Updated `vercel.json` for production resilience:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "express",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

- **maxDuration: 30** - Prevents premature function termination
- **memory: 1024** - Better performance for auth operations

## References

- **MCP Specification**: Discovery methods must work without auth
- **OpenAI Apps Docs**: ChatGPT OAuth linking requirements
- **Clerk Express SDK**: Global middleware pattern
- **Implementation**:
  - `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts`
  - `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
  - `apps/oak-curriculum-mcp-streamable-http/vercel.json`

## Related ADRs

- [ADR-052: OAuth 2.1 for MCP HTTP Server Authentication](052-oauth-2.1-for-mcp-http-authentication.md) - Why we need OAuth
- [ADR-053: Clerk as Identity Provider](053-clerk-as-identity-provider.md) - Auth provider choice
- [ADR-054: Tool-Level Auth Error Interception](054-tool-level-auth-error-interception.md) - Auth error handling
- [ADR-051: OpenTelemetry-Compliant Logging](051-opentelemetry-compliant-logging.md) - Logging format
