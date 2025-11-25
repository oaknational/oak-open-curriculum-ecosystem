# HTTP-Level Auth Architecture (Historical Reference)

**Status**: Replaced by tool-level auth (see tool-level-auth-architecture.md)  
**Date Replaced**: 2025-11-24  
**Reason**: Incompatible with OpenAI Apps SDK requirement for HTTP 200 responses

## Overview

This was a clean, well-architected HTTP-level authentication middleware system using Express middleware to enforce OAuth authentication before requests reached the MCP SDK. While architecturally sound, it was incompatible with the OpenAI Apps SDK's requirement that all responses be HTTP 200 with errors in MCP `_meta` fields.

## Architecture

### Request Flow

```text
Client Request
    ↓
clerkMiddleware (sets req.auth)
    ↓
mcpAuthClerk (verifies token)
    ↓ (if auth fails)
HTTP 401 + WWW-Authenticate header
    ↓ (if auth succeeds)
req.auth = AuthInfo
    ↓
MCP Handler
    ↓
Tool Execution
```

### Key Components

#### 1. `mcp-auth.ts` - Core Middleware

Pure function-based middleware that:

- Accepted a token verifier function (dependency injection)
- Extracted Bearer token from Authorization header
- Verified token using provided verifier
- Validated resource parameter (RFC 8707)
- Returned HTTP 401 with WWW-Authenticate on failure
- Attached AuthInfo to `req.auth` on success

**Key Design Principles**:

- Pure function for token verification (testable)
- Dependency injection for flexibility
- Comprehensive logging with correlation IDs
- RFC-compliant error responses

```typescript
/**
 * Express middleware that enforces OAuth 2.1 authentication for MCP requests.
 *
 * Flow:
 * 1. Extracts Bearer token from Authorization header
 * 2. Returns 401 if no token or malformed header
 * 3. Verifies token using provided verifier function
 * 4. Returns 401 if token verification fails
 * 5. Validates JWT audience claim matches resource URL (RFC 8707)
 * 6. Returns 401 if audience validation fails
 * 7. Attaches AuthInfo to req.auth and calls next() if all checks pass
 */
export function mcpAuth(
  verifyToken: TokenVerifier,
  resourceUrl: string,
  logger?: Logger,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Implementation...
  };
}
```

#### 2. `mcp-auth-clerk.ts` - Clerk Integration

Wrapper that integrated Clerk's OAuth with the core middleware:

```typescript
export function createMcpAuthClerk(resourceUrl: string, logger?: Logger): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth = await getAuth(req, { acceptsToken: 'oauth_token' });

    return mcpAuth(async (token, request) => verifyClerkToken(auth, token), resourceUrl, logger)(
      req,
      res,
      next,
    );
  };
}
```

#### 3. `verify-clerk-token.ts` - Pure Token Verification

Pure function with no side effects:

```typescript
export function verifyClerkToken(
  auth: MachineAuthObject<'oauth_token'>,
  token: string | undefined,
): AuthInfo | undefined {
  // Pure validation logic
  // Returns AuthInfo or undefined
}
```

#### 4. `auth-response-helpers.ts` - RFC-Compliant Responses

Helper functions for creating proper OAuth error responses:

```typescript
export function sendAuthError(
  res: Response,
  errorType: AuthErrorType,
  description: string,
  resourceUrl: string,
  logger?: Logger,
): void {
  const metadataUrl = generateMetadataUrl(resourceUrl);
  const wwwAuthenticate = `Bearer resource_metadata="${metadataUrl}", error="${errorType}", error_description="${description}"`;

  res.setHeader('WWW-Authenticate', wwwAuthenticate);
  res.status(401).json({
    error: errorType,
    error_description: description,
  });
}
```

#### 5. `mcp-router.ts` - Route Registration

Clean separation between authenticated and unauthenticated routes:

```typescript
export function registerAuthenticatedRoutes(
  app: Express,
  transport: StreamableHTTPServerTransport,
  authMiddleware: RequestHandler,
  logger?: Logger,
): void {
  app.post('/mcp', authMiddleware, createMcpHandler(transport, logger));
  app.get('/mcp', authMiddleware, createMcpHandler(transport, logger));
}
```

## Testing Architecture

### Unit Tests

Pure function testing with no mocks:

```typescript
describe('verifyClerkToken', () => {
  it('returns undefined for missing token', () => {
    const auth = createMockAuth({ isAuthenticated: false });
    const result = verifyClerkToken(auth, undefined);
    expect(result).toBeUndefined();
  });

  it('returns AuthInfo for valid token', () => {
    const auth = createMockAuth({
      isAuthenticated: true,
      userId: 'user_123',
    });
    const result = verifyClerkToken(auth, 'valid-token');
    expect(result).toBeDefined();
    expect(result?.extra?.userId).toBe('user_123');
  });
});
```

### Integration Tests

Testing middleware integration without running server:

```typescript
describe('mcpAuth integration', () => {
  it('should return 401 when auth context missing', async () => {
    const { req, res, next } = createMocks();
    const middleware = createMcpAuthClerk(resourceUrl, logger);

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.setHeader).toHaveBeenCalledWith(
      'WWW-Authenticate',
      expect.stringContaining('Bearer resource_metadata='),
    );
  });
});
```

### E2E Tests

Testing complete request/response cycle:

```typescript
describe('Auth enforcement E2E', () => {
  it('should reject unauthenticated requests with 401', async () => {
    const response = await fetch('http://localhost:3333/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'tools/call', params: { name: 'search' } }),
    });

    expect(response.status).toBe(401);
    expect(response.headers.get('WWW-Authenticate')).toContain('Bearer');
  });
});
```

## Why It Was Replaced

### The Problem

OpenAI Apps SDK requires:

1. **All responses must be HTTP 200**
2. Errors must be in MCP response `_meta` field
3. Specifically: `_meta["mcp/www_authenticate"]` for auth errors

Our HTTP 401 responses were rejected by the OpenAI Apps SDK before they could be processed.

### The Mismatch

```typescript
// What we were doing (HTTP-level auth)
HTTP 401
WWW-Authenticate: Bearer resource_metadata="..."
{ error: "invalid_token" }

// What OpenAI Apps SDK needs (tool-level auth)
HTTP 200
{
  isError: true,
  _meta: {
    "mcp/www_authenticate": ["Bearer resource_metadata=\"...\""]
  }
}
```

## Lessons Learned

### What Worked Well

1. **Pure functions for verification** - Made testing trivial
2. **Dependency injection** - Clean separation of concerns
3. **Comprehensive logging** - Clear auth decision trail
4. **RFC compliance** - Proper OAuth error responses
5. **Clear architectural boundaries** - Easy to understand and maintain

### What We'd Keep

- Pure function approach for token verification
- Dependency injection pattern
- Logging strategy with correlation IDs
- Test coverage strategy (unit → integration → E2E)

### What We Had to Change

- **Location of auth checking**: Moved from HTTP middleware to tool handler
- **Error response format**: HTTP 401 → HTTP 200 with MCP `_meta`
- **Context propagation**: Added AsyncLocalStorage to access request in tool handlers

## Files Deleted

### Implementation

- `src/auth/mcp-auth/mcp-auth.ts`
- `src/auth/mcp-auth/mcp-auth-clerk.ts`
- `src/mcp-router.ts`

### Tests

- `src/auth/mcp-auth/mcp-auth.unit.test.ts`
- `src/auth/mcp-auth/mcp-auth.integration.test.ts`
- `src/auth/mcp-auth/mcp-auth-logging.integration.test.ts`
- `src/auth/mcp-auth/mcp-auth-resource-validation.integration.test.ts`
- `src/auth-www-authenticate.integration.test.ts`
- `src/clerk-auth-middleware.integration.test.ts`
- `src/mcp-router.integration.test.ts`

## Replacement Architecture

See: `tool-level-auth-architecture.md`

Key differences:

- Uses AsyncLocalStorage for request context propagation
- Auth checking in `handleToolWithAuthInterception` (before SDK execution)
- Returns HTTP 200 with MCP `_meta` field for auth errors
- Compatible with OpenAI Apps SDK
