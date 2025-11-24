# Auth Observability & OAuth Implementation Completion Plan

**Status**: Phase 2 Tasks 2.7.9-2.7.10 Remaining, Phase 4 Not Started  
**Date**: 2025-11-24  
**Previous Plan**: `.agent/plans/schema-first-security-implementation.md` (Phases 1-2.7.8 complete)

---

## 🎯 CURRENT STATUS - START HERE

**Phase 2**: 🔄 **95% COMPLETE** (OAuth Security Implementation)  
**Phase 4**: ⏳ **NOT STARTED** (Auth Observability & Debugging - NEW)  
**Phase 5**: ⏳ **NOT STARTED** (Real-World Client Validation)

**Estimated Remaining Time**: 3-5 days total

- Phase 2 completion: 0.5 day
- Phase 4 (Auth Observability): 1.5-2 days
- Phase 5 (Client Validation): 1-2 days

### Resume Point

**➡️ BEGIN AT: Phase 2, Sub-Phase 2.7, Task 2.7.9**

---

## 📋 Executive Summary

This plan completes the OAuth 2.1 security implementation for the Oak Curriculum MCP Server and adds comprehensive observability to the authentication layer. The work is divided into three phases:

1. **Phase 2 (Remaining)**: Fix quality gates and validate OAuth implementation
2. **Phase 4 (NEW)**: Add auth observability and debugging infrastructure
3. **Phase 5**: Real-world client testing (ChatGPT, MCP Inspector)

### Critical Issue Addressed

**Problem**: Authentication middleware is a black box with zero internal logging. When auth fails, we have no visibility into:

- Which validation step failed
- What the actual vs. expected values were
- Whether Clerk returned auth context
- JWT structure and audience claims

**Impact**: Cannot diagnose intermittent auth issues (e.g., reported "Invalid JWT format" error)

**Solution**: Phase 4 adds comprehensive logging following established codebase patterns.

---

## Phase 2 (Remaining): Complete OAuth Security Implementation

**Status**: 95% Complete (Tasks 2.7.1-2.7.8 done)  
**Remaining**: Tasks 2.7.9-2.7.10, Sub-Phase 2.8

---

### Sub-Phase 2.7: Tool-Level Auth Error Handling (Completion)

**Status**: Tasks 2.7.1-2.7.8 ✅ COMPLETE  
**Remaining**: Tasks 2.7.9-2.7.10

#### Task 2.7.9: Fix Type-Check Errors

**Goal**: Resolve all TypeScript compilation errors in auth error handling code.

**TDD Approach**: Fix → Verify → Refactor

##### Steps

1. **Run type-check to identify errors**

   ```bash
   pnpm type-check
   ```

2. **Fix each error**
   - E2E test setup type mismatches
   - Handler signature inconsistencies
   - Type guard improvements

3. **Verify fix**

   ```bash
   pnpm type-check  # Must pass
   pnpm test        # All tests still passing
   ```

4. **Refactor if needed**
   - Improve type safety
   - Remove any type assertions
   - Preserve type information

##### Acceptance Criteria

- [ ] `pnpm type-check` passes with zero errors
- [ ] All existing tests still pass
- [ ] No type assertions (`as`) introduced
- [ ] Type information preserved throughout

##### Definition of Done

- Type-check passes
- Tests pass
- No regressions in type safety

---

#### Task 2.7.10: Alignment Checkpoint

**Goal**: Verify all Phase 2 Sub-Phase 2.7 work aligns with architectural principles.

##### Verification Steps

1. **Schema-First Compliance**
   - [ ] Tool security metadata flows from OpenAPI schema
   - [ ] No manual security definitions in app code
   - [ ] `pnpm type-gen` regenerates all necessary types

2. **Testing Strategy Compliance**
   - [ ] Pure functions have unit tests (no I/O, no mocks)
   - [ ] Integration tests use simple injected mocks
   - [ ] E2E tests run against real system
   - [ ] All tests follow Red-Green-Refactor

3. **Code Quality**
   - [ ] No dead code
   - [ ] No commented-out code
   - [ ] All functions have TSDoc
   - [ ] No skipped tests

4. **Architectural Boundaries**
   - [ ] Auth error detection is pure function
   - [ ] MCP-specific logic stays in app layer
   - [ ] SDK remains schema-driven

##### Acceptance Criteria

- [ ] All verification steps checked and passing
- [ ] ADR-054 implementation matches specification
- [ ] Zero architectural violations

##### Definition of Done

- All checks complete
- Ready for Sub-Phase 2.8

---

### Sub-Phase 2.8: Phase 2 Validation and Quality Gates

**Goal**: Prove Phase 2 complete and regression-free.

#### Tasks

##### Task 2.8.1: Run Complete Quality Gate Sequence

**Steps:**

```bash
# Format code
pnpm format:root

# Type-check
pnpm type-check

# Lint (with auto-fix)
pnpm lint -- --fix

# Run all tests
pnpm test

# Build all packages
pnpm build
```

**Acceptance Criteria:**

- [ ] All commands exit with code 0
- [ ] No warnings in type-check output
- [ ] No lint errors remaining
- [ ] All 266+ tests passing
- [ ] Build artifacts created successfully

---

##### Task 2.8.2: Run E2E Tests

**Steps:**

```bash
pnpm test:e2e
```

**Verification:**

- [ ] All E2E tests pass
- [ ] No flaky tests
- [ ] Auth error `_meta` emission tests pass
- [ ] Method-aware routing tests pass

---

##### Task 2.8.3: Manual Testing with MCP Inspector

**Prerequisites:**

- MCP Inspector installed
- Clerk development tenant configured
- Server running locally

**Test Scenarios:**

1. **Discovery without auth**

   ```bash
   # Start server
   pnpm -C apps/oak-curriculum-mcp-streamable-http dev

   # Connect MCP Inspector
   npx @modelcontextprotocol/inspector
   # URL: http://localhost:3333/mcp
   ```

   - [ ] `tools/list` works without auth
   - [ ] All tools returned with `securitySchemes`
   - [ ] No errors in server logs

2. **Protected tool execution without auth**
   - Call `get-lessons-summary` without Bearer token
   - [ ] Returns 401 with `WWW-Authenticate` header
   - [ ] Error message is helpful
   - [ ] Points to OAuth metadata endpoint

3. **OAuth metadata discovery**

   ```bash
   curl http://localhost:3333/.well-known/oauth-protected-resource
   ```

   - [ ] Returns 200
   - [ ] Contains `resource` field (canonical MCP URI)
   - [ ] Contains `authorization_servers` array
   - [ ] Contains `scopes_supported` from generated tools

4. **Public tool execution without auth**
   - Call `get-changelog` without Bearer token
   - [ ] Returns 200 (no auth required)
   - [ ] Changelog data returned

**Evidence Collection:**

- Screenshot MCP Inspector connection
- Capture server logs showing auth flow
- Save curl outputs

---

##### Task 2.8.4: Documentation Update

**File**: `apps/oak-curriculum-mcp-streamable-http/README.md`

**Updates Required:**

1. **Method-Aware Routing Section**

   ```markdown
   ## Method-Aware Authentication Routing

   The server implements intelligent routing based on MCP method classification:

   - **Discovery methods** (`initialize`, `tools/list`): No auth required
   - **Tool execution** (`tools/call`): Per-tool security metadata
     - OAuth2 tools: Require Bearer token
     - NoAuth tools: No authentication needed
   - **Unknown methods**: Require auth (safe default)

   This enables ChatGPT and other clients to discover tools before authentication.
   ```

2. **Tool Security Metadata Section**

   ```markdown
   ## Tool Security Metadata

   Tool security schemes are generated at compile time from `mcp-security-policy.ts`:

   - **OAuth2 tools**: Require authentication
     - All data retrieval tools (lessons, units, subjects, etc.)
     - Search and fetch tools

   - **Public tools**: No authentication required
     - `get-changelog`, `get-changelog-latest`
     - `get-rate-limit`

   Run `pnpm type-gen` to regenerate after policy changes.
   ```

3. **Authentication Flow Diagram**
   - Add sequence diagram showing discovery → auth → execution
   - Document `_meta["mcp/www_authenticate"]` error responses

**Acceptance Criteria:**

- [ ] README accurately reflects current implementation
- [ ] Examples are tested and working
- [ ] Diagrams are clear and accurate
- [ ] Links to ADRs and related docs

---

#### Sub-Phase 2.8 Acceptance Criteria

- [ ] All quality gates pass
- [ ] E2E tests pass
- [ ] Manual testing with MCP Inspector successful
- [ ] Zero regressions
- [ ] Documentation updated and accurate

#### Definition of Done

- All tasks completed
- All acceptance criteria met
- Phase 2 overall acceptance criteria achieved
- Ready to proceed to Phase 4

---

## Phase 4 (NEW): Auth Observability & Debugging Infrastructure

**Objective**: Add comprehensive logging and observability to the authentication layer to enable debugging of auth issues.

**Motivation**: Critical gap identified in investigation - auth middleware has zero internal logging, making it impossible to diagnose failures.

**Layer**: Infrastructure (cross-cutting concern)  
**Approach**: TDD with pure functions where possible

---

### Sub-Phase 4.1: Auth Middleware Logging Infrastructure

**Goal**: Add structured logging to all auth middleware decision points following established codebase patterns.

---

#### Task 4.1.1: Design Logging Strategy (TDD - Red Phase)

**Approach**: Write integration tests that verify logging behavior BEFORE implementing.

##### Test Cases to Write

**File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-logging.integration.test.ts`

1. **Test: Logs when authorization header is missing**

   ```typescript
   it('logs when authorization header is missing', async () => {
     const logSpy = vi.spyOn(logger, 'warn');
     const auth = mcpAuth(mockVerifier, logger);

     await request(createTestApp(auth)).post('/test').expect(401);

     expect(logSpy).toHaveBeenCalledWith(
       'Auth required but no authorization header present',
       expect.objectContaining({
         method: 'POST',
         path: '/test',
       }),
     );
   });
   ```

2. **Test: Logs when Bearer token format is invalid**

   ```typescript
   it('logs when Bearer token format is invalid', async () => {
     const logSpy = vi.spyOn(logger, 'warn');
     // Authorization header without "Bearer " prefix
   });
   ```

3. **Test: Logs when Clerk verification fails**

   ```typescript
   it('logs when Clerk verification fails with context', async () => {
     const logSpy = vi.spyOn(logger, 'warn');
     // Mock verifier returns undefined
   });
   ```

4. **Test: Logs when resource parameter validation fails**

   ```typescript
   it('logs resource parameter validation failure with details', async () => {
     const logSpy = vi.spyOn(logger, 'warn');
     // JWT has wrong audience claim
   });
   ```

5. **Test: Logs successful authentication**

   ```typescript
   it('logs successful authentication with user context', async () => {
     const logSpy = vi.spyOn(logger, 'debug');
     // Valid token, passes all checks
   });
   ```

6. **Test: Redacts sensitive information in logs**

   ```typescript
   it('redacts authorization header in logs', async () => {
     const logSpy = vi.spyOn(logger, 'warn');
     // Verify token not logged in plaintext
   });
   ```

**Run tests**: Should FAIL (Red phase - logging not implemented yet)

```bash
pnpm test src/auth/mcp-auth/mcp-auth-logging.integration.test.ts
# Expected: All tests fail
```

##### Acceptance Criteria

- [ ] 6+ integration tests written
- [ ] Tests cover all auth decision points
- [ ] Tests verify log content and context
- [ ] Tests check sensitive data redaction
- [ ] All tests fail initially (Red phase confirmed)

##### Definition of Done

- Tests written and committed
- Tests fail as expected
- Ready for implementation (Green phase)

---

#### Task 4.1.2: Implement Auth Middleware Logging (TDD - Green Phase)

**Goal**: Add logging to make tests pass.

##### Implementation Steps

1. **Update `mcpAuth` signature**

   **File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`

   ```typescript
   // Before
   export function mcpAuth(verifyToken: TokenVerifier): RequestHandler;

   // After
   export function mcpAuth(verifyToken: TokenVerifier, logger: Logger): RequestHandler;
   ```

2. **Add logging to decision points**

   Following pattern from `createEnsureMcpAcceptHeader`:

   ```typescript
   // Missing authorization header
   if (!req.headers.authorization) {
     logger.warn('Auth required but no authorization header present', {
       method: req.method,
       path: req.path,
       correlationId: res.locals.correlationId,
     });
     sendMissingAuthResponse(res, prmUrl);
     return;
   }

   // Invalid Bearer token format
   const token = extractBearerToken(req.headers.authorization);
   if (!token) {
     logger.warn('Invalid Bearer token format', {
       method: req.method,
       path: req.path,
       correlationId: res.locals.correlationId,
       // DO NOT log the actual header value (sensitive)
     });
     sendInvalidFormatResponse(res, prmUrl);
     return;
   }

   // Clerk verification failure
   const authData = await verifyToken(token, req);
   if (!authData) {
     logger.warn('Token verification failed', {
       method: req.method,
       path: req.path,
       correlationId: res.locals.correlationId,
       // Context from Clerk would be helpful here
     });
     sendVerificationFailedResponse(res);
     return;
   }

   // Resource parameter validation failure
   const validation = checkResourceParameter(token, req);
   if (!validation.valid) {
     const reason = validation.reason ?? 'Unknown validation error';
     logger.warn('Resource parameter validation failed', {
       method: req.method,
       path: req.path,
       correlationId: res.locals.correlationId,
       reason,
       expectedResource: getMcpResourceUrl(req),
       // Audience from JWT would be helpful
     });
     sendInvalidResourceResponse(res, prmUrl, reason);
     return;
   }

   // Success
   logger.debug('Authentication successful', {
     method: req.method,
     path: req.path,
     correlationId: res.locals.correlationId,
     userId: authData.extra?.userId,
     clientId: authData.clientId,
     scopes: authData.scopes,
   });

   req.auth = authData;
   next();
   ```

3. **Update call sites**

   **File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts`

   ```typescript
   import type { Logger } from '@oaknational/mcp-logger';

   export function createMcpAuthClerk(logger: Logger): RequestHandler {
     return (req: Request, res: Response, next: NextFunction): void => {
       const authMiddleware = mcpAuth((token, req: Request) => {
         // ... existing verification logic ...
       }, logger);

       authMiddleware(req, res, next);
     };
   }
   ```

   **File**: `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`

   ```typescript
   // Update to pass logger
   const mcpAuthMw = instrumentMiddleware('mcpAuthClerk', createMcpAuthClerk(authLog), authLog);
   ```

4. **Run tests to verify**

   ```bash
   pnpm test src/auth/mcp-auth/mcp-auth-logging.integration.test.ts
   # Expected: All tests pass (Green phase)
   ```

##### Acceptance Criteria

- [ ] All integration tests pass
- [ ] Logging added at all decision points
- [ ] Sensitive data NOT logged (tokens, headers)
- [ ] Correlation IDs included in logs
- [ ] Context is actionable (helps debugging)
- [ ] Follows established logging patterns

##### Definition of Done

- Tests pass
- No regressions in existing tests
- Code follows codebase conventions

---

#### Task 4.1.3: Refactor for Maintainability (TDD - Refactor Phase)

**Goal**: Improve implementation while keeping tests green.

##### Refactoring Opportunities

1. **Extract helper functions**

   ```typescript
   // Pure function for creating log context
   function createAuthLogContext(req: Request, res: Response, extra?: JsonObject): JsonObject {
     return {
       method: req.method,
       path: req.path,
       correlationId: res.locals.correlationId,
       ...extra,
     };
   }
   ```

2. **Standardize log messages**
   - Create constants for log messages
   - Ensure consistency across auth flow

3. **Type safety**
   - Ensure all log context is properly typed
   - No `any` or `unknown` in log calls

##### Verification

```bash
# After each refactor, verify
pnpm test  # All tests still pass
pnpm type-check  # No type errors
pnpm lint  # No new lint issues
```

##### Acceptance Criteria

- [ ] Code is more maintainable
- [ ] All tests still pass
- [ ] No type safety regressions
- [ ] Logging is consistent

##### Definition of Done

- Refactoring complete
- Tests green
- Quality gates pass

---

### Sub-Phase 4.2: Clerk Integration Observability

**Goal**: Add visibility into Clerk authentication context and why verification fails.

---

#### Task 4.2.1: Enhance Clerk Token Verification Logging (TDD)

**Red Phase**: Write tests first

**File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.unit.test.ts`

##### Test Cases

1. **Test: Returns undefined when token is missing**

   ```typescript
   it('returns undefined when token is missing', () => {
     const result = verifyClerkToken(mockAuthObject, undefined);
     expect(result).toBeUndefined();
   });
   ```

2. **Test: Returns undefined when isAuthenticated is false**

   ```typescript
   it('returns undefined when isAuthenticated is false', () => {
     const auth = { isAuthenticated: false, tokenType: 'oauth_token' };
     expect(verifyClerkToken(auth, 'token')).toBeUndefined();
   });
   ```

3. **Test: Returns undefined when clientId is missing**

   ```typescript
   it('returns undefined when clientId is missing', () => {
     const auth = {
       isAuthenticated: true,
       tokenType: 'oauth_token',
       clientId: undefined,
       scopes: ['read'],
       userId: '123',
     };
     expect(verifyClerkToken(auth, 'token')).toBeUndefined();
   });
   ```

**Note**: `verifyClerkToken` is a pure function, so we'll log from the CALLER, not the function itself.

##### Implementation Strategy

Since `verifyClerkToken` is pure, add logging in `mcp-auth-clerk.ts` AROUND the verification call:

```typescript
const authMiddleware = mcpAuth((token, req: Request) => {
  const authData = getAuth(req, { acceptsToken: 'oauth_token' });

  // Log Clerk auth context
  logger.debug('Clerk authentication context', {
    isAuthenticated: authData.isAuthenticated,
    hasClientId: !!authData.clientId,
    hasScopes: !!authData.scopes,
    hasUserId: !!authData.userId,
    tokenType: authData.tokenType,
  });

  if (!authData.isAuthenticated) {
    logger.warn('Clerk authentication failed', {
      tokenType: authData.tokenType,
    });
    return Promise.resolve(undefined);
  }

  const result = verifyClerkToken(authData, token);

  if (!result) {
    logger.warn('Clerk token verification failed', {
      reason: !authData.clientId
        ? 'missing clientId'
        : !authData.scopes
          ? 'missing scopes'
          : !authData.userId
            ? 'missing userId'
            : 'unknown',
    });
  }

  return Promise.resolve(result);
}, logger);
```

##### Acceptance Criteria

- [ ] Logs Clerk auth context on every request
- [ ] Logs specific reason when verification fails
- [ ] Does NOT log sensitive tokens
- [ ] Preserves pure function property of `verifyClerkToken`

##### Definition of Done

- Logging implemented
- Tests pass
- Pure functions remain pure

---

### Sub-Phase 4.3: RFC 8707 Validation Observability

**Goal**: Add visibility into JWT structure and audience validation.

---

#### Task 4.3.1: Add JWT Decode Logging

**Approach**: Log JWT structure (decoded, but not verified again - Clerk already did that)

##### Implementation

**File**: `apps/oak-curriculum-mcp-streamable-http/src/resource-parameter-validator.ts`

**Current**: Pure function (no logging)

**Strategy**: Add OPTIONAL logger parameter that defaults to no-op logger

```typescript
import type { Logger } from '@oaknational/mcp-logger';

// Create no-op logger for when none provided
const noopLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  // ... other required methods
};

export function validateResourceParameter(
  token: string,
  expectedResource: string,
  logger: Logger = noopLogger,
): ResourceValidationResult {
  try {
    const decoded = jwtDecode(token, { complete: true });

    if (!decoded || typeof decoded === 'string') {
      logger.warn('JWT decode failed', {
        reason: 'Invalid JWT format',
      });
      return { valid: false, reason: 'Invalid JWT format' };
    }

    const payload = decoded.payload;

    if (typeof payload === 'string') {
      logger.warn('JWT decode failed', {
        reason: 'Invalid JWT payload format',
      });
      return { valid: false, reason: 'Invalid JWT payload format' };
    }

    // Log JWT structure (without sensitive claims)
    logger.debug('JWT decoded', {
      hasAudience: !!payload.aud,
      audienceType: Array.isArray(payload.aud) ? 'array' : 'string',
      audienceCount: Array.isArray(payload.aud) ? payload.aud.length : 1,
      issuer: payload.iss,
      subject: payload.sub,
      expiresAt: payload.exp,
    });

    const audiences = getAudiences(payload.aud);
    const result = isResourceInAudiences(audiences, expectedResource);

    if (!result.valid) {
      logger.warn('Audience validation failed', {
        expectedResource,
        actualAudiences: audiences,
        reason: result.reason,
      });
    } else {
      logger.debug('Audience validation succeeded', {
        expectedResource,
        matchedAudience: audiences.find((a) => a === expectedResource),
      });
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn('JWT validation error', {
      error: errorMessage,
    });
    return {
      valid: false,
      reason: `Token decode error: ${errorMessage}`,
    };
  }
}
```

##### Update Call Site

**File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`

```typescript
// Pass logger to validation function
const validation = checkResourceParameter(token, req, logger);
```

```typescript
function checkResourceParameter(
  token: string,
  req: Request,
  logger: Logger,
): { valid: boolean; reason?: string } {
  const expectedResource = getMcpResourceUrl(req);
  return validateResourceParameter(token, expectedResource, logger);
}
```

##### Acceptance Criteria

- [ ] JWT structure logged on decode
- [ ] Audience mismatch logged with details
- [ ] Sensitive claims NOT logged (sub, custom claims)
- [ ] Logger parameter is optional (backwards compatible)
- [ ] Pure function tests still pass

##### Definition of Done

- Implementation complete
- Tests updated
- No breaking changes to existing code

---

### Sub-Phase 4.4: E2E Tests for Auth Logging

**Goal**: Prove that auth failures are observable in production.

---

#### Task 4.4.1: E2E Test for Auth Failure Logging

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-logging.e2e.test.ts`

##### Test Cases

1. **Test: Missing auth header logs warning**

   ```typescript
   it('logs warning when auth header is missing', async () => {
     const logSpy = setupLogSpy(logger);

     await request(app)
       .post('/mcp')
       .send({ method: 'tools/call', params: { name: 'get-lessons-summary' } })
       .expect(401);

     expect(logSpy.warn).toHaveBeenCalledWith(
       'Auth required but no authorization header present',
       expect.any(Object),
     );
   });
   ```

2. **Test: Invalid token format logs warning**

3. **Test: Wrong audience logs details**

   ```typescript
   it('logs audience mismatch with details', async () => {
     const tokenWithWrongAud = createJWT({
       aud: 'https://wrong-server.com/mcp',
       // ... other claims
     });

     await request(app)
       .post('/mcp')
       .set('Authorization', `Bearer ${tokenWithWrongAud}`)
       .send({ method: 'tools/call', params: { name: 'get-lessons-summary' } })
       .expect(401);

     expect(logSpy.warn).toHaveBeenCalledWith(
       'Audience validation failed',
       expect.objectContaining({
         expectedResource: 'http://localhost:3333/mcp',
         actualAudiences: ['https://wrong-server.com/mcp'],
       }),
     );
   });
   ```

4. **Test: Successful auth logs debug info**

   ```typescript
   it('logs successful authentication', async () => {
     const validToken = await createValidClerkToken();

     await request(app)
       .post('/mcp')
       .set('Authorization', `Bearer ${validToken}`)
       .send({ method: 'tools/call', params: { name: 'get-lessons-summary' } })
       .expect(200);

     expect(logSpy.debug).toHaveBeenCalledWith(
       'Authentication successful',
       expect.objectContaining({
         userId: expect.any(String),
         clientId: expect.any(String),
       }),
     );
   });
   ```

##### Acceptance Criteria

- [ ] 4+ E2E tests written
- [ ] Tests verify actual log output
- [ ] Tests run against real server
- [ ] Tests pass
- [ ] Coverage includes all auth paths

##### Definition of Done

- E2E tests written and passing
- Auth logging verified end-to-end

---

### Sub-Phase 4.5: Troubleshooting Documentation

**Goal**: Document how to use auth logs for debugging.

---

#### Task 4.5.1: Create Auth Troubleshooting Guide

**File**: `apps/oak-curriculum-mcp-streamable-http/docs/auth-troubleshooting.md`

##### Content Outline

# Authentication Troubleshooting Guide

## Overview

This guide explains how to diagnose authentication issues using server logs.

## Log Levels

Auth logging uses different levels:

- `DEBUG`: Successful auth, JWT structure, detailed flow
- `WARN`: Auth failures, validation errors
- `ERROR`: Unexpected errors (should be rare)

## Common Issues

### Issue: "Auth required but no authorization header present"

**Symptom**: 401 response, no Bearer token sent

**Log Example**:

```json
{
  "level": "WARN",
  "message": "Auth required but no authorization header present",
  "method": "POST",
  "path": "/mcp",
  "correlationId": "req_123456_abc"
}
```

**Cause**: Client not sending Authorization header

**Fix**: Ensure client sends `Authorization: Bearer <token>` header

---

### Issue: "Invalid Bearer token format"

**Symptom**: 401 response, malformed auth header

**Log Example**:

```json
{
  "level": "WARN",
  "message": "Invalid Bearer token format",
  "method": "POST",
  "path": "/mcp"
}
```

**Cause**: Authorization header not in format `Bearer <token>`

**Fix**: Check client is using correct header format

---

### Issue: "Token verification failed"

**Symptom**: 401 response, Clerk rejects token

**Log Example**:

```json
{
  "level": "WARN",
  "message": "Clerk authentication failed",
  "isAuthenticated": false,
  "tokenType": "oauth_token"
}
```

**Cause**: Clerk doesn't recognize the token (expired, invalid, wrong tenant)

**Fix**:

1. Check token is from correct Clerk tenant
2. Check token hasn't expired
3. Verify Clerk secret key is correct

---

### Issue: "Audience validation failed"

**Symptom**: 401 response, JWT audience doesn't match

**Log Example**:

```json
{
  "level": "WARN",
  "message": "Audience validation failed",
  "expectedResource": "https://mcp.example.com/mcp",
  "actualAudiences": ["https://other-server.com"],
  "reason": "Token audience mismatch"
}
```

**Cause**: JWT `aud` claim doesn't include this server's canonical URI

**Fix**:

1. Verify Clerk is including `resource` parameter in tokens
2. Check MCP_CANONICAL_URI env var matches OAuth flow
3. Ensure client sends correct `resource` param to Clerk

---

## Debugging with Correlation IDs

Every request has a correlation ID. Use it to trace the full auth flow:

```bash
# Find all logs for a specific request
grep "req_123456_abc" logs.txt

# Example output shows full auth flow
```

## Clerk Configuration Checklist

- [ ] `CLERK_PUBLISHABLE_KEY` set correctly
- [ ] `CLERK_SECRET_KEY` set correctly
- [ ] Clerk app configured for OAuth 2.0
- [ ] Resource parameter echoed in tokens (`aud` claim)
- [ ] Scopes match server's `scopes_supported`

## JWT Inspection

To inspect JWT structure (for debugging only):

```bash
# Decode JWT (DO NOT do this with production tokens in shared environments)
echo "<token>" | base64 -d
```

Look for:

- `aud` claim matching server URI
- `exp` claim (expiration)
- `iss` claim (Clerk issuer)

### Acceptance Criteria

- [ ] Documentation covers all common auth failures
- [ ] Examples include actual log output
- [ ] Troubleshooting steps are actionable
- [ ] Clerk configuration documented
- [ ] Security warnings included (don't log tokens!)

### Definition of Done

- Documentation written
- Reviewed for accuracy
- Linked from main README

---

#### Task 4.5.2: Document Clerk JWT Requirements

**File**: `apps/oak-curriculum-mcp-streamable-http/docs/clerk-jwt-structure.md`

##### Content

# Clerk JWT Structure Requirements

## Overview

For RFC 8707 compliance, Clerk must issue JWTs with specific claims.

## Required JWT Claims

### `aud` (Audience)

**Required**: YES
**Format**: String or array of strings
**Value**: Must include the MCP server's canonical URI

**Example**:

```json
{
  "aud": "https://mcp.example.com/mcp"
}
```

Or for multiple audiences:

```json
{
  "aud": ["https://mcp.example.com/mcp", "https://other-service.com"]
}
```

**How Clerk Sets This**: The `resource` parameter from the OAuth authorization request should be echoed into the `aud` claim.

**MCP Client Behavior**: Clients MUST send `resource` parameter in:

1. Authorization request to Clerk
2. Token request to Clerk

**Server Validation**: Server checks `aud` includes expected resource URI.

---

### `iss` (Issuer)

**Required**: YES  
**Format**: String (URL)  
**Value**: Clerk's issuer URL

**Example**:

```json
{
  "iss": "https://clerk.yourapp.com"
}
```

---

### `sub` (Subject)

**Required**: YES  
**Format**: String (user ID)  
**Value**: Clerk user ID

**Example**:

```json
{
  "sub": "user_2abc123def"
}
```

---

### `exp` (Expiration)

**Required**: YES  
**Format**: Number (Unix timestamp)  
**Value**: Token expiration time

**Example**:

```json
{
  "exp": 1699999999
}
```

---

## How to Verify Clerk Configuration

1. **Trigger OAuth flow** with ChatGPT or MCP Inspector

2. **Check server logs** for JWT decode info:

   ```json
   {
     "message": "JWT decoded",
     "hasAudience": true,
     "audienceType": "string",
     "issuer": "https://clerk.yourapp.com"
   }
   ```

3. **If audience is missing**:
   - Clerk may not support RFC 8707 resource parameter
   - Contact Clerk support
   - May need to configure custom claims

## Testing JWT Structure

Use the test helper to create valid JWTs for testing:

```typescript
import { createMockClerkJWT } from '@/test-helpers/clerk-jwt-helpers';

const jwt = createMockClerkJWT({
  aud: 'http://localhost:3333/mcp',
  sub: 'user_123',
  iss: 'https://clerk.test.com',
  exp: Math.floor(Date.now() / 1000) + 3600,
});
```

### Acceptance Criteria

- [ ] All required JWT claims documented
- [ ] Examples are accurate
- [ ] Clerk configuration guidance clear
- [ ] Testing guidance included

### Definition of Done

- Documentation complete
- Examples tested
- Reviewed for technical accuracy

---

## Sub-Phase 4.4 & 4.5 Overall Acceptance Criteria

- [ ] All auth decision points logged
- [ ] Logs are actionable for debugging
- [ ] Sensitive data is redacted
- [ ] E2E tests verify logging works
- [ ] Documentation enables self-service debugging

## Phase 4 Overall Definition of Done

- All sub-phases complete
- All tests passing
- Documentation complete
- Auth failures are now observable and debuggable
- Ready for Phase 5 (real-world client testing)

---

## Phase 5: Real-World Client Validation

**Objective**: Validate the implementation with real MCP clients, especially ChatGPT.

**Prerequisites**: Phases 2 and 4 complete

---

### Sub-Phase 5.1: MCP Inspector Testing

**Goal**: Prove the server works with MCP Inspector (reference implementation).

#### Task 5.1.1: Set Up Test Environment

**Steps:**

1. Deploy server locally

   ```bash
   pnpm -C apps/oak-curriculum-mcp-streamable-http dev
   ```

2. Install MCP Inspector (if not already installed)

   ```bash
   npm install -g @modelcontextprotocol/inspector
   ```

3. Configure Clerk development tenant
   - Ensure `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` set
   - Verify Clerk OAuth app configured

**Acceptance Criteria:**

- [ ] Server running on <http://localhost:3333>
- [ ] MCP Inspector installed
- [ ] Clerk configured

---

### Task 5.1.2: Test Discovery Flow

**Steps:**

1. Launch MCP Inspector

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. Connect to server
   - URL: `http://localhost:3333/mcp`
   - No authentication needed for connection

3. List tools
   - Click "List Tools" in Inspector
   - Verify all tools appear
   - Check each tool has `securitySchemes` field

**Verification:**

- [ ] MCP Inspector connects successfully
- [ ] `tools/list` returns all tools (25+)
- [ ] Tool metadata includes security schemes
- [ ] No errors in server logs during discovery
- [ ] Discovery works WITHOUT authentication

**Evidence**: Screenshot of MCP Inspector tool list

---

#### Task 5.1.3: Test OAuth Metadata Discovery

**Steps:**

1. Check OAuth metadata endpoint

   ```bash
   curl http://localhost:3333/.well-known/oauth-protected-resource | jq
   ```

2. Verify metadata structure
   - Contains `resource` field
   - Contains `authorization_servers` array
   - Contains `scopes_supported` from generated tools

**Acceptance Criteria:**

- [ ] Metadata endpoint returns 200
- [ ] Metadata includes all required fields
- [ ] Scopes match generated tool security metadata

**Evidence**: Save curl output

---

#### Task 5.1.4: Test Authentication Flow

**Manual Steps:**

1. Call protected tool without auth in MCP Inspector
   - Select tool: `get-lessons-summary`
   - Try to execute without providing token
   - Expected: 401 with helpful error

2. Check error response
   - Should include `WWW-Authenticate` header
   - Should point to OAuth metadata
   - Server logs should show auth failure with reason

3. Follow OAuth flow (if MCP Inspector supports it)
   - Start OAuth authorization
   - Authenticate with Clerk
   - Verify token received

**Acceptance Criteria:**

- [ ] Protected tools fail without auth
- [ ] Error messages are helpful
- [ ] `WWW-Authenticate` header present
- [ ] OAuth flow works (if supported by Inspector)
- [ ] Server logs show clear auth failure reasons

**Evidence**:

- Screenshot of 401 error
- Server log excerpt showing auth attempt
- OAuth flow completion (if applicable)

---

#### Task 5.1.5: Test Tool Execution

**Steps:**

1. Call public tool without auth

   ```bash
   curl -X POST http://localhost:3333/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get-changelog"}}'
   ```

   - Expected: 200 response with changelog data

2. Call protected tool with valid token (if OAuth completed)
   - Execute `get-lessons-summary`
   - Expected: 200 response with lesson data

3. Check server logs
   - Verify auth success logged
   - Verify no errors during execution

**Acceptance Criteria:**

- [ ] Public tools work without auth
- [ ] Protected tools work with valid auth
- [ ] Server logs show successful auth
- [ ] Tool execution results are correct

**Evidence**:

- Tool execution outputs
- Server logs showing successful auth

---

#### Task 5.1.6: Document Findings

**File**: `apps/oak-curriculum-mcp-streamable-http/docs/testing-with-mcp-inspector.md`

**Content**:

- Setup instructions
- Test results summary
- Screenshots
- Any issues encountered
- Workarounds or limitations

**Acceptance Criteria:**

- [ ] Documentation complete
- [ ] Includes evidence (screenshots, logs)
- [ ] Notes any issues or edge cases
- [ ] Ready for others to reproduce

---

### Sub-Phase 5.2: ChatGPT Integration Testing

**Goal**: Validate the server works as a ChatGPT app (primary requirement).

**Note**: Requires ChatGPT Apps SDK access or ChatGPT Plus/Team account.

---

#### Task 5.2.1: Deploy Server for ChatGPT Access

**Options**:

1. **Vercel deployment** (recommended)
   - Deploy to Vercel
   - Configure environment variables
   - Use HTTPS URL for ChatGPT

2. **Local with ngrok tunnel**

   ```bash
   ngrok http 3333
   # Use ngrok HTTPS URL for ChatGPT
   ```

**Configuration**:

- Ensure `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` set
- Set `ALLOWED_HOSTS` to include deployment domain
- Set `MCP_CANONICAL_URI` if using custom domain

**Acceptance Criteria:**

- [ ] Server accessible via HTTPS
- [ ] Environment variables configured
- [ ] OAuth metadata endpoint accessible publicly

---

#### Task 5.2.2: Register MCP Server in ChatGPT

**Steps**:

1. Open ChatGPT settings
2. Navigate to "Actions" or "Apps" (UI may vary)
3. Add new MCP server
4. Configure:
   - **Server URL**: `https://your-server.com/mcp`
   - **Authentication**: OAuth 2.0
   - **OAuth Metadata**: `https://your-server.com/.well-known/oauth-protected-resource`

**Acceptance Criteria:**

- [ ] Server registered successfully in ChatGPT
- [ ] No errors during registration
- [ ] ChatGPT validates OAuth metadata

**Evidence**: Screenshot of ChatGPT server configuration

---

#### Task 5.2.3: Test ChatGPT Discovery

**Steps**:

1. Open ChatGPT chat
2. Type: "What tools do you have from Oak Curriculum?"
3. Verify ChatGPT discovers tools

**Expected Behavior**:

- ChatGPT shows available tools
- Tools include Oak curriculum tools
- No errors during discovery

**Acceptance Criteria:**

- [ ] ChatGPT discovers all tools
- [ ] Tool descriptions appear correctly
- [ ] No authentication required for discovery

**Evidence**: Screenshot of ChatGPT tool list

---

#### Task 5.2.4: Test ChatGPT Authentication UI

**Steps**:

1. Ask ChatGPT to use a protected tool
   - Example: "Show me Year 7 maths lessons"

2. Verify OAuth flow
   - ChatGPT should show "Connect" button
   - Click "Connect"
   - Should redirect to Clerk for authentication

3. Complete OAuth flow
   - Authenticate with Clerk
   - Grant permissions
   - Should redirect back to ChatGPT

**Acceptance Criteria:**

- [ ] ChatGPT shows "Connect" button (not generic error)
- [ ] OAuth flow launches correctly
- [ ] User can authenticate with Clerk
- [ ] ChatGPT receives access token
- [ ] No errors during OAuth flow

**Evidence**:

- Screenshots of OAuth flow
- Server logs showing OAuth requests

---

#### Task 5.2.5: Test ChatGPT Tool Execution

**Steps**:

1. After connecting, ask ChatGPT to use a tool
   - "Show me Year 7 maths lessons about fractions"

2. Verify execution
   - ChatGPT calls tool with Bearer token
   - Server authenticates request
   - Tool executes successfully
   - Results returned to ChatGPT

3. Test multiple tool calls
   - Verify token reused
   - Verify no re-authentication needed

**Acceptance Criteria:**

- [ ] Tool execution succeeds after auth
- [ ] ChatGPT displays results correctly
- [ ] Token persists across multiple calls
- [ ] Server logs show successful auth

**Evidence**:

- ChatGPT conversation screenshots
- Server logs showing authenticated requests

---

#### Task 5.2.6: Document ChatGPT Integration

**File**: `apps/oak-curriculum-mcp-streamable-http/docs/chatgpt-integration.md`

**Content**:

- Setup instructions
- Registration steps
- OAuth flow walkthrough
- Screenshots of:
  - Server configuration
  - Tool discovery
  - OAuth "Connect" UI
  - Successful tool execution
- Troubleshooting tips
- Known limitations

**Acceptance Criteria:**

- [ ] Comprehensive setup guide
- [ ] Screenshots of all key steps
- [ ] Troubleshooting section
- [ ] Notes on any issues encountered

---

### Sub-Phase 5.3: Automated E2E Tests for Client Compatibility

**Goal**: Create automated tests that prove ChatGPT-compatible behavior.

---

#### Task 5.3.1: E2E Test for Unauthenticated Discovery

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/client-compat-discovery.e2e.test.ts`

```typescript
describe('Client Compatibility - Discovery', () => {
  it('allows tools/list without authentication', async () => {
    const response = await request(app).post('/mcp').send({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
    });

    expect(response.status).toBe(200);
    expect(response.body.result).toHaveProperty('tools');
    expect(Array.isArray(response.body.result.tools)).toBe(true);
  });

  it('includes securitySchemes in tool metadata', async () => {
    const response = await request(app).post('/mcp').send({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
    });

    const tools = response.body.result.tools;
    const protectedTool = tools.find((t) => t.name === 'get-lessons-summary');

    expect(protectedTool.securitySchemes).toContainEqual({
      type: 'oauth2',
      scopes: expect.any(Array),
    });
  });
});
```

**Acceptance Criteria:**

- [ ] Tests verify unauthenticated discovery works
- [ ] Tests verify security metadata present
- [ ] Tests pass

---

#### Task 5.3.2: E2E Test for OAuth Metadata

**File**: Same as above or separate

```typescript
describe('Client Compatibility - OAuth Metadata', () => {
  it('serves protected resource metadata', async () => {
    const response = await request(app).get('/.well-known/oauth-protected-resource');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('resource');
    expect(response.body).toHaveProperty('authorization_servers');
    expect(response.body.authorization_servers).toBeInstanceOf(Array);
    expect(response.body.authorization_servers.length).toBeGreaterThan(0);
  });

  it('includes scopes from generated tools', async () => {
    const response = await request(app).get('/.well-known/oauth-protected-resource');

    expect(response.body).toHaveProperty('scopes_supported');
    expect(response.body.scopes_supported).toContain('curriculum:read');
  });
});
```

**Acceptance Criteria:**

- [ ] Tests verify OAuth metadata structure
- [ ] Tests verify required fields present
- [ ] Tests pass

---

#### Task 5.3.3: E2E Test for Per-Tool Authorization

**File**: Same or separate

```typescript
describe('Client Compatibility - Per-Tool Auth', () => {
  it('requires auth for protected tools', async () => {
    const response = await request(app)
      .post('/mcp')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: { name: 'get-lessons-summary', arguments: { lesson: 'test' } },
      });

    expect(response.status).toBe(401);
    expect(response.headers['www-authenticate']).toMatch(/Bearer/);
  });

  it('allows public tools without auth', async () => {
    const response = await request(app)
      .post('/mcp')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: { name: 'get-changelog' },
      });

    expect(response.status).toBe(200);
    expect(response.body.result).toHaveProperty('content');
  });
});
```

**Acceptance Criteria:**

- [ ] Tests verify per-tool auth decisions
- [ ] Tests cover both protected and public tools
- [ ] Tests pass

---

### Sub-Phase 5.4: Production Readiness Validation

**Goal**: Final checks before considering Phase 5 complete.

---

#### Task 5.4.1: Security Audit

**Checklist**:

- [ ] Tokens never logged in plaintext
- [ ] Authorization headers redacted in logs
- [ ] HTTPS enforced (except localhost)
- [ ] CORS configured correctly
- [ ] Rate limiting considered (out of scope for this phase, but noted)
- [ ] Error messages don't leak sensitive info

---

#### Task 5.4.2: Performance Verification

**Tests**:

1. Measure auth middleware overhead

   ```bash
   # Compare response times with/without auth
   ```

2. Check for memory leaks
   - Run load test
   - Monitor memory usage

3. Verify no performance regressions

**Acceptance Criteria:**

- [ ] Auth overhead < 50ms per request
- [ ] No memory leaks detected
- [ ] No performance regressions vs. pre-auth baseline

---

#### Task 5.4.3: Documentation Review

**Files to Review**:

- Main README
- Auth troubleshooting guide
- Clerk JWT requirements
- ChatGPT integration guide
- MCP Inspector testing guide

**Checklist**:

- [ ] All docs accurate
- [ ] All examples tested
- [ ] All screenshots current
- [ ] No broken links
- [ ] Security warnings present

---

#### Task 5.4.4: Final Quality Gate

**Run ALL checks**:

```bash
pnpm format:root
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

**Acceptance Criteria:**

- [ ] All commands pass
- [ ] Zero errors or warnings
- [ ] All tests green (unit, integration, E2E)
- [ ] Build successful

---

## Phase 5 Overall Acceptance Criteria

- [ ] MCP Inspector testing complete and documented
- [ ] ChatGPT integration tested and documented
- [ ] Automated E2E tests cover client compatibility
- [ ] Security audit passed
- [ ] Performance verified
- [ ] Documentation complete and accurate
- [ ] All quality gates pass

## Phase 5 Definition of Done

- All sub-phases complete
- All acceptance criteria met
- Real-world clients (ChatGPT, Inspector) work correctly
- Production deployment ready
- OAuth security implementation COMPLETE

---

## Overall Plan Completion Criteria

### All Phases Complete When:

1. **Phase 2**: OAuth implementation complete, all tests passing
2. **Phase 4**: Auth observability complete, debugging is easy
3. **Phase 5**: Real-world validation complete, ChatGPT integration works

### Success Metrics:

- [ ] ChatGPT can discover tools without auth
- [ ] ChatGPT shows "Connect" button for protected tools
- [ ] OAuth flow completes successfully
- [ ] Protected tools execute after authentication
- [ ] Auth failures are debuggable via logs
- [ ] Zero regressions in existing functionality
- [ ] All quality gates passing
- [ ] Documentation complete

### Ready for Production When:

- All phases complete
- All acceptance criteria met
- Security audit passed
- Performance verified
- Real users can successfully authenticate and use tools

---

## Appendix: Key Files & Locations

### Implementation Files

**Auth Middleware**:

- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/resource-parameter-validator.ts`

**Routing**:

- `apps/oak-curriculum-mcp-streamable-http/src/mcp-router.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`

**Error Handling**:

- `apps/oak-curriculum-mcp-streamable-http/src/auth-error-detector.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/tool-handler-with-auth.ts`

### Test Files

**Unit Tests**:

- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/*.unit.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth-error-*.unit.test.ts`

**Integration Tests**:

- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/*.integration.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/handlers-auth-errors.integration.test.ts`

**E2E Tests**:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-*.e2e.test.ts`

### Documentation Files

**Architecture**:

- `docs/architecture/architectural-decisions/052-oauth-2.1-for-mcp-http-authentication.md`
- `docs/architecture/architectural-decisions/053-clerk-as-identity-provider.md`
- `docs/architecture/architectural-decisions/054-tool-level-auth-error-interception.md`

**User Documentation** (to be created):

- `apps/oak-curriculum-mcp-streamable-http/docs/auth-troubleshooting.md`
- `apps/oak-curriculum-mcp-streamable-http/docs/clerk-jwt-structure.md`
- `apps/oak-curriculum-mcp-streamable-http/docs/testing-with-mcp-inspector.md`
- `apps/oak-curriculum-mcp-streamable-http/docs/chatgpt-integration.md`

---

## Revision History

| Date       | Author | Changes                                                                                                         |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| 2025-11-24 | Agent  | Initial version - consolidated from schema-first-security-implementation.md, added Phase 4 (Auth Observability) |
