# Auth Observability & OAuth Completion Plan

**Status**: ✅ PHASE 1 COMPLETE - Tool-Level MCP Client Auth Implemented  
**Date**: 2025-11-24 (Updated with Phase 1 completion)  
**Current Phase**: Ready for Phase 2 - Real-World Client Validation

---

## 🎯 CRITICAL: UNDERSTANDING THE ARCHITECTURE

### ⚠️ THIS PLAN IS ABOUT MCP CLIENT AUTH ONLY ⚠️

**What we are implementing**: MCP OAuth (ChatGPT → Our MCP Server)

- ChatGPT authenticating to use our MCP server
- Preventive auth checking BEFORE calling the SDK
- Returns HTTP 200 with MCP error containing `_meta`
- Uses `extractAuthContext()`, `verifyClerkToken()`, `validateResourceParameter()`
- **DOES NOT TOUCH THE SDK OR UPSTREAM API**

**What we are NOT changing**: Upstream API Auth (Our Server → Oak Curriculum API)

- Already implemented via ADR-054
- Reactive error interception AFTER calling the SDK
- Intercepts 401 errors from Oak Curriculum API
- Lives in `handleToolWithAuthInterception` (lines 48-92)
- **Completely separate concern - we do not modify this**

### Two Completely Separate Authentication Systems

**CRITICAL**: There are TWO completely separate auth systems - NEVER confuse them:

1. **MCP OAuth (ChatGPT → Our MCP Server)** ← THIS PLAN
   - ChatGPT authenticates to our MCP server using Clerk OAuth
   - Uses Bearer tokens in `Authorization` header
   - **This is what we're implementing** (preventive, before SDK)
   - Server validates tokens using `verifyClerkToken` and Clerk's SDK
   - Auth checking happens BEFORE SDK execution
   - Returns HTTP 200 with `_meta` on auth failure

2. **Upstream API Auth (Our Server → Oak Curriculum API)** ← ALREADY WORKS (ADR-054)
   - Our server authenticates to Oak's API using API key
   - Completely independent from MCP OAuth
   - The SDK handles this transparently
   - Auth error interception happens AFTER SDK execution
   - NOT related to MCP auth - we DO NOT modify this

### The OpenAI Apps SDK Requirement

**Problem**: ChatGPT requires tool-level auth errors (HTTP 200 + MCP error with `_meta`), not HTTP-level auth (HTTP 401).

**Reference**: [OpenAI Apps SDK Auth](https://platform.openai.com/docs/guides/apps-sdk/authentication)

**What ChatGPT Needs**:

```text
Request → Router → Tool Handler → HTTP 200 with MCP error
                          ↑
                   Auth check HERE (inside tool handler)
                   Return _meta["mcp/www_authenticate"]
```

**What We Had (WRONG)**:

```text
Request → Router → Auth Middleware (HTTP 401) → ❌ Never reaches tool handler
                          ↑
                   Auth check HERE (middleware layer)
```

---

## 📋 CURRENT STATE (Updated 2025-11-24)

### ✅ **PHASE 1 COMPLETE - Tool-Level MCP Client Auth Implemented**

**All Sub-Phases Complete**:

1. ✅ **E2E Tests** - Specify HTTP 200 with MCP errors containing `_meta`
2. ✅ **Integration Tests** - Specify tool-level auth checking behavior
3. ✅ **HTTP Middleware Removed** - Requests reach tool handlers directly
4. ✅ **Request Context Implemented** - AsyncLocalStorage for context propagation
5. ✅ **MCP Client Auth Checking** - Preventive auth before SDK execution
6. ✅ **Unit Tests & Type Fixes** - All tests passing, type errors fixed
7. ✅ **Dead Code Cleanup** - Old HTTP-level auth archived to `.agent/reference-docs/replaced-http-auth-model/`
8. ✅ **Quality Gates** - ALL gates passing (format, type-check, lint, test, build)

**Implementation Summary**:

- Tool-level auth returns HTTP 200 with MCP errors (not HTTP 401)
- MCP errors include `_meta["mcp/www_authenticate"]` for OAuth flow
- Request context flows via AsyncLocalStorage (no signature changes needed)
- MCP client auth (ChatGPT → us) checks BEFORE SDK execution
- Upstream API auth (us → Oak API) still works via ADR-054 AFTER SDK execution
- Clear separation between two auth systems maintained
- Comprehensive observability throughout (logging, correlation IDs, redaction)

### ✅ **EXISTING: Reusable Infrastructure**

**OAuth & Security**:

- ✅ OAuth 2.1 with Clerk integration
- ✅ Per-tool security metadata (generated at type-gen, read by `toolRequiresAuth`)
- ✅ RFC 8707 resource parameter validation (`validateResourceParameter`)
- ✅ Protected resource metadata at `/.well-known/oauth-protected-resource`
- ✅ Pure token verification (`verifyClerkToken`)

**Observability**:

- ✅ Comprehensive logging at all decision points
- ✅ Correlation IDs for request tracing
- ✅ Sensitive data redaction (tokens, headers)
- ✅ `createAuthLogContext()` - Pure logging function
- ✅ Standardized auth logging infrastructure

**Helper Functions (KEEP)**:

- ✅ `src/tool-auth-checker.ts` - `toolRequiresAuth()` reads `securitySchemes`
- ✅ `src/auth-error-response.ts` - `createAuthErrorResponse()` creates MCP errors with `_meta`
- ✅ `src/auth/mcp-auth/verify-clerk-token.ts` - Token verification
- ✅ `src/resource-parameter-validator.ts` - RFC 8707 validation

### ✅ **RESOLVED: Previous Blocking Issues**

**Architectural Gap** ✅ RESOLVED:

- Implemented AsyncLocalStorage for Express `Request` context propagation
- Tool handlers now access `req.auth` via `getRequestContext()`
- No changes to MCP SDK callback signatures required
- Clean separation of concerns maintained

**Type Error** ✅ RESOLVED:

- Fixed type error in `create-auth-log-context.unit.test.ts`
- All type-check gates passing with 0 errors
- Additional unit tests added for auth context extraction

---

## 📋 PHASE 0: Quality Gate Baseline & Foundation Review

**Status**: ✅ COMPLETE  
**Duration**: ~15-30 minutes  
**Purpose**: Establish clean baseline, re-ground in foundation documents

### Step 0.1: Foundation Document Review

**Read and commit to following**:

```bash
# Review foundation documents
cat .agent/directives-and-memory/rules.md
cat .agent/directives-and-memory/testing-strategy.md
cat .agent/directives-and-memory/schema-first-execution.md
```

**Key commitments**:

- ✅ TDD at ALL levels (tests FIRST, always RED → GREEN → REFACTOR)
- ✅ No type shortcuts (`as`, `any`, `!`, `Record<string, unknown>`)
- ✅ Schema-first for SDK (all types flow from OpenAPI schema)
- ✅ Pure functions first, dependency injection
- ✅ No V1/V2 versioning - update files in place
- ✅ No compatibility layers

### Step 0.2: Run Full Quality Gates

**Run each gate individually to identify current state**:

```bash
# 1. Format check
pnpm format-check:root

# 2. Type check
pnpm type-check

# 3. Lint
pnpm lint

# 4. Markdown lint
pnpm markdownlint-check:root

# 5. Unit & integration tests
pnpm test

# 6. UI tests
pnpm test:ui

# 7. E2E tests (may fail - expected if tests specify new behavior)
pnpm test:e2e

# 8. E2E tests on built artifacts
pnpm test:e2e:built

# 9. Smoke tests with stubs
pnpm smoke:dev:stub
```

**Expected Results**:

- Format, type-check, lint, markdown: ✅ PASS (clean baseline required)
- Unit & integration tests: ⚠️ MAY FAIL (integration tests specify new behavior)
- E2E tests: ⚠️ MAY FAIL (E2E tests specify new behavior - this is correct TDD)
- Smoke tests: ✅ PASS (no regression in existing functionality)

**Document Results**:
Record which gates pass/fail. Failing tests should be:

- Integration tests in `tool-handler-with-auth.integration.test.ts` (RED phase - correct!)
- E2E tests expecting HTTP 200 with `_meta` (RED phase - correct!)

Any other failures must be fixed before proceeding.

### Step 0.3: Verify Test Status

**Confirm tests are in correct TDD state**:

```bash
# Run specific test files to verify RED phase
cd apps/oak-curriculum-mcp-streamable-http

# Integration test (should FAIL - no implementation yet)
pnpm test src/tool-handler-with-auth.integration.test.ts

# E2E test (should FAIL - new behavior not implemented)
pnpm test:e2e e2e-tests/auth-enforcement.e2e.test.ts
```

**Expected**: Both tests FAIL (RED phase). If they pass, we're not in TDD mode.

**Acceptance Criteria**:

- [x] Foundation documents reviewed
- [x] All quality gates run individually
- [x] Results documented
- [x] Integration tests failing (RED phase)
- [x] E2E tests failing (RED phase)
- [x] No unexpected failures
- [x] Ready to proceed with implementation

---

## 📋 PHASE 1: Implement MCP Client Auth (TDD - Tests Already Written)

**Status**: ✅ COMPLETE - All Sub-Phases (1.1 through 1.7) Complete

**CRITICAL**: This phase implements MCP client auth ONLY (ChatGPT → our server).  
We do NOT modify upstream API auth (our server → Oak API), which already works via ADR-054.

**Approach**: Follow TDD and rules strictly:

- ✅ Tests already written FIRST (RED phase achieved)
- ✅ Now implement to make tests pass (GREEN phase)
- ✅ No V1/V2 versioning - update files in place
- ✅ No compatibility layers - replace old approach with new
- ✅ Maintain observability throughout
- ✅ Two separate auth systems - only touch MCP client auth

---

### Sub-Phase 1.1: E2E Tests - Specify New Behavior ✅ COMPLETE

**Objective**: Update E2E tests FIRST to specify tool-level auth behavior.

**Files Updated**:

- ✅ `e2e-tests/auth-enforcement.e2e.test.ts` - Expects HTTP 200 with MCP errors
- ✅ `e2e-tests/auth-bypass.e2e.test.ts` - Reviewed and compatible

**What Was Changed**:

- Tests now expect `status: 200` instead of `status: 401`
- Tests check for `result.isError: true` and `result._meta['mcp/www_authenticate']`
- Discovery methods still expect HTTP 200 (no change)

**Validation**:

```bash
pnpm test:e2e  # Currently FAILING (RED phase) ✅ - proves tests specify new behavior
```

**Status**: ✅ COMPLETE - Tests successfully failing, specifying desired behavior

---

### Sub-Phase 1.2: Integration Tests - Specify Component Behavior ✅ COMPLETE

**Objective**: Create integration tests for tool execution with auth checking.

**File Created**:

- ✅ `src/tool-handler-with-auth.integration.test.ts`

**Test Scenarios Covered**:

1. ✅ Protected tool without auth context → MCP error with `_meta`
2. ✅ Protected tool with valid auth → executes successfully
3. ✅ Protected tool with invalid token → MCP error with `_meta`
4. ✅ Public tools execute without auth check
5. ✅ Logging behavior verified

**Validation**:

```bash
pnpm test src/tool-handler-with-auth.integration.test.ts  # Currently FAILING (RED phase) ✅
```

**Status**: ✅ COMPLETE - Tests successfully failing, specifying component behavior

---

### Sub-Phase 1.3: Remove HTTP-Level Auth Middleware ✅ COMPLETE

**Objective**: Remove middleware-level auth enforcement, allow all MCP requests through.

**Files Modified**:

- ✅ `src/auth-routes.ts` - Removed `createMcpRouter` usage and auth middleware

**Files KEPT** (reusable pure functions):

- ✅ `src/auth/mcp-auth/verify-clerk-token.ts` - Pure verification function
- ✅ `src/resource-parameter-validator.ts` - Pure validation function
- ✅ `src/auth/mcp-auth/auth-response-helpers.ts` - Logging helpers
- ✅ `src/auth/mcp-auth/create-auth-log-context.ts` - Pure logging function
- ✅ `src/tool-auth-checker.ts` - `toolRequiresAuth()` reads `securitySchemes`
- ✅ `src/auth-error-response.ts` - `createAuthErrorResponse()` creates MCP errors

**Validation**:

```bash
pnpm build  # Compiles successfully ✅
pnpm test:e2e  # Still FAILING but no HTTP 401 ✅ - proves middleware removed
```

**Status**: ✅ COMPLETE - All requests reach tool handlers, no HTTP-level auth blocking

---

### Sub-Phase 1.4: Implement MCP Client Auth Checking ✅ COMPLETE

**Objective**: Add preventive MCP client auth checking BEFORE SDK execution, return HTTP 200 with MCP errors.

**CRITICAL**: This is MCP client auth (ChatGPT → us) ONLY. We do NOT touch upstream API auth (us → Oak API).

**Status**: ✅ COMPLETE - All tests passing (RED → GREEN cycle complete)

**The Architectural Solution**:

Use Node.js `AsyncLocalStorage` to flow Express request context to tool handlers without modifying function signatures.

**Why AsyncLocalStorage**:

- Native Node.js async context propagation
- No need to modify MCP SDK handler signatures
- Clean separation of concerns
- Idiomatic Node.js pattern

**Implementation follows TDD - Unit Tests FIRST**:

**Step 1**: Write unit tests for request context (TDD - RED phase)

**NEW FILE**: `src/request-context.unit.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setRequestContext, getRequestContext } from './request-context.js';
import type { Request } from 'express';

describe('request-context', () => {
  it('should store and retrieve request context', async () => {
    const mockRequest = { path: '/test' } as Request;
    let retrieved: Request | undefined;

    await setRequestContext(mockRequest, async () => {
      retrieved = getRequestContext();
    });

    expect(retrieved).toBe(mockRequest);
  });

  it('should return undefined outside context', () => {
    const result = getRequestContext();
    expect(result).toBeUndefined();
  });

  it('should isolate contexts in concurrent executions', async () => {
    const req1 = { path: '/req1' } as Request;
    const req2 = { path: '/req2' } as Request;

    const results: (Request | undefined)[] = [];

    await Promise.all([
      setRequestContext(req1, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push(getRequestContext());
      }),
      setRequestContext(req2, async () => {
        results.push(getRequestContext());
      }),
    ]);

    expect(results).toContain(req1);
    expect(results).toContain(req2);
  });
});
```

**Run test** (should FAIL - no implementation):

```bash
pnpm test src/request-context.unit.test.ts
```

**Step 2**: Implement request context (TDD - GREEN phase)

**NEW FILE**: `src/request-context.ts`

```typescript
/**
 * Request context propagation using AsyncLocalStorage.
 * Enables access to Express request object within tool handlers.
 * @module
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import type { Request } from 'express';

const requestStorage = new AsyncLocalStorage<Request>();

/**
 * Execute callback within request context.
 * Makes request available to getRequestContext() within callback.
 *
 * @param req - Express request to store in context
 * @param callback - Async function to execute with request context
 * @returns Result of callback execution
 */
export async function setRequestContext<T>(req: Request, callback: () => Promise<T>): Promise<T> {
  return requestStorage.run(req, callback);
}

/**
 * Retrieve current Express request from async context.
 * Returns undefined if called outside setRequestContext.
 *
 * @returns Current request or undefined
 */
export function getRequestContext(): Request | undefined {
  return requestStorage.getStore();
}
```

**Run test** (should PASS):

```bash
pnpm test src/request-context.unit.test.ts
```

**Step 3**: Update `createMcpHandler` to set request context

**MODIFY**: `src/handlers.ts`

```typescript
export function createMcpHandler(
  transport: StreamableHTTPServerTransport,
  logger?: Logger,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req: express.Request, res: express.Response) => {
    const correlationId = extractCorrelationId(res);
    if (logger && correlationId) {
      const correlatedLogger = createChildLogger(logger, correlationId);
      correlatedLogger.debug('MCP request received', {
        method: req.method,
        path: req.path,
      });
    }

    // NEW: Wrap transport.handleRequest in request context
    await setRequestContext(req, async () => {
      await transport.handleRequest(req, res, req.body);
    });

    if (logger && correlationId) {
      const correlatedLogger = createChildLogger(logger, correlationId);
      correlatedLogger.debug('MCP request completed', {
        statusCode: res.statusCode,
      });
    }
  };
}
```

**Step 4**: Update `handleToolWithAuthInterception` to check MCP client auth

**MODIFY**: `src/tool-handler-with-auth.ts`

```typescript
import { getRequestContext } from './request-context.js';
import { extractAuthContext } from './auth/tool-auth-context.js';
import { toolRequiresAuth } from './tool-auth-checker.js';
import { verifyClerkToken } from './auth/mcp-auth/verify-clerk-token.js';
import { validateResourceParameter } from './resource-parameter-validator.js';

export async function handleToolWithAuthInterception(
  tool: { readonly name: UniversalToolName },
  params: unknown,
  deps: ToolHandlerDependencies,
  stubExecutor: ReturnType<typeof createStubToolExecutionAdapter> | undefined,
  logger: Logger,
  apiKey: string,
): Promise<CallToolResult> {
  // NEW: Preventive MCP client auth checking (BEFORE SDK execution)
  // This is MCP OAuth (ChatGPT → us), NOT upstream API auth (us → Oak API)
  if (toolRequiresAuth(tool.name)) {
    const req = getRequestContext();
    const authContext = req ? extractAuthContext(req, logger) : undefined;

    if (!authContext) {
      logger.warn('MCP client auth required but no token provided', {
        toolName: tool.name,
      });

      return createAuthErrorResponse(
        'insufficient_scope',
        'You need to login to continue',
        deps.getResourceUrl(),
      );
    }

    // Verify token (reuse existing pure function)
    const verified = await verifyClerkToken(req.auth ?? { userId: null }, authContext.token);

    if (!verified) {
      logger.warn('MCP client token verification failed', {
        toolName: tool.name,
      });

      return createAuthErrorResponse(
        'invalid_token',
        'Token verification failed',
        deps.getResourceUrl(),
      );
    }

    // Validate resource parameter (RFC 8707)
    const validation = validateResourceParameter(authContext.token, deps.getResourceUrl(), logger);

    if (!validation.valid) {
      logger.warn('Resource parameter validation failed', {
        toolName: tool.name,
        reason: validation.reason,
      });

      return createAuthErrorResponse(
        'invalid_token',
        validation.reason ?? 'Resource validation failed',
        deps.getResourceUrl(),
      );
    }

    logger.info('MCP client authentication successful', {
      toolName: tool.name,
      userId: authContext.userId,
    });
  }

  // EXISTING: Upstream API auth error interception (AFTER SDK execution)
  // This is ADR-054 - we do NOT modify this
  const client = deps.createClient(apiKey);

  let capturedAuthError: unknown = undefined;

  const executor = deps.createExecutor({
    executeMcpTool: async (name, args) => {
      const execution = await (stubExecutor
        ? stubExecutor(name, args ?? {})
        : deps.executeMcpTool(name, args, client));

      if ('error' in execution && execution.error) {
        const authCheckTarget = execution.error.cause ?? execution.error;
        if (isAuthError(authCheckTarget)) {
          capturedAuthError = authCheckTarget;
        }
      }

      logValidationFailureIfPresent(name, execution, logger);
      return execution;
    },
  });

  const result = await executor(tool.name, params ?? {});

  if (capturedAuthError !== undefined) {
    const resourceUrl = deps.getResourceUrl();
    const errorType = getAuthErrorType(capturedAuthError);
    const description = getAuthErrorDescription(capturedAuthError);

    logger.warn('Upstream API auth error (ADR-054)', {
      toolName: tool.name,
      errorType,
      description,
    });

    return createAuthErrorResponse(errorType, description, resourceUrl);
  }

  return result;
}
```

**Validation** (TDD - GREEN phase):

```bash
# Unit tests should PASS
pnpm test src/request-context.unit.test.ts

# Integration tests should PASS (were RED, now GREEN)
pnpm test src/tool-handler-with-auth.integration.test.ts

# E2E tests should PASS (were RED, now GREEN)
pnpm test:e2e e2e-tests/auth-enforcement.e2e.test.ts
```

**Re-run Quality Gates** (ALL gates - failures are BLOCKING):

```bash
# ALL must PASS before proceeding
pnpm format-check:root    # MUST PASS
pnpm type-check           # MUST PASS (0 errors)
pnpm lint                 # MUST PASS (0 errors, 0 warnings)
pnpm markdownlint-check:root  # MUST PASS
pnpm test                 # MUST PASS (all tests, including new ones)
pnpm test:ui              # MUST PASS
pnpm smoke:dev:stub       # MUST PASS
pnpm build                # MUST PASS
```

**BLOCKING**: If ANY gate fails → STOP and FIX before Phase 1.5.

**Acceptance Criteria**:

- [x] Unit tests for request-context written FIRST (RED)
- [x] Unit tests now PASS (GREEN)
- [x] Request context using AsyncLocalStorage
- [x] `createMcpHandler` wraps requests in context
- [x] `handleToolWithAuthInterception` checks MCP client auth BEFORE SDK
- [x] Upstream API auth (ADR-054) unchanged and still working
- [x] MCP errors include `_meta["mcp/www_authenticate"]`
- [x] Integration tests PASS (were RED, now GREEN)
- [x] E2E tests PASS (were RED, now GREEN)
- [x] Observability maintained (comprehensive logging)
- [x] Clear separation: MCP client auth vs upstream API auth

---

### Sub-Phase 1.5: Update Unit Tests ✅ COMPLETE

**Objective**: Fix type error and add tests for new auth context extractor.

**Files to Update**:

1. **FIX TYPE ERROR**: `src/auth/mcp-auth/create-auth-log-context.unit.test.ts`

```typescript
// Line 85 - Remove undefined argument
// BEFORE:
const context = createAuthLogContext(req, res, undefined);

// AFTER:
const context = createAuthLogContext(req, res);
```

2. **NEW TESTS**: `src/auth/tool-auth-context.unit.test.ts`

Test scenarios:

- Extract auth when `req.auth.userId` present
- Return undefined when `req.auth` missing
- Return undefined when `req.auth.userId` missing
- Extract token from Authorization header
- Log auth extraction

3. **VERIFY UNCHANGED**: These should still pass without modification

- `src/auth/mcp-auth/verify-clerk-token.unit.test.ts` ✅
- `src/resource-parameter-validator.unit.test.ts` ✅

**Validation** (ALL gates - failures are BLOCKING):

```bash
pnpm format-check:root    # MUST PASS
pnpm type-check           # MUST PASS (0 errors)
pnpm lint                 # MUST PASS
pnpm test                 # MUST PASS (all unit tests)
```

**BLOCKING**: If ANY gate fails → STOP and FIX before Phase 1.6.

**Acceptance Criteria**:

- [x] Type error fixed (line 85 in create-auth-log-context.unit.test.ts)
- [x] Auth context extractor has unit tests
- [x] All existing unit tests still pass
- [x] Format check: ✅ PASS
- [x] Type check: ✅ PASS (0 errors)
- [x] Lint: ✅ PASS
- [x] All tests: ✅ PASS

---

### Sub-Phase 1.6: Clean Up Dead Code ✅ COMPLETE

**Objective**: Remove unused middleware files and archive for reference.

**Files ARCHIVED** to `.agent/reference-docs/replaced-http-auth-model/`:

- ✅ `src/auth/mcp-auth/mcp-auth.ts` - HTTP 401 middleware (archived)
- ✅ `src/auth/mcp-auth/mcp-auth-clerk.ts` - Clerk middleware wrapper (archived)
- ✅ `src/auth/mcp-auth/mcp-auth.unit.test.ts` - Tests (archived)
- ✅ `src/auth/mcp-auth/mcp-auth-resource-validation.integration.test.ts` - Tests (archived)
- ✅ `src/auth-www-authenticate.integration.test.ts` - Tests (archived)
- ✅ `src/clerk-auth-middleware.integration.test.ts` - Tests (archived)
- ✅ `src/mcp-router.ts` - Conditional auth routing (archived)
- ✅ `src/mcp-router.integration.test.ts` - Tests (archived)
- ✅ `http-level-auth-architecture.md` - Architectural documentation (created)
- ✅ `README.md` - Archive directory documentation (created)

**Config Files Updated** to exclude archive:

- ✅ `.prettierignore` - Added `.agent/reference-docs/replaced-http-auth-model/`
- ✅ `tsconfig.json` - Added to exclude array
- ✅ `tsconfig.lint.json` - Added to exclude array
- ✅ `vitest.config.ts` - Added to exclude array
- ✅ `eslint.config.ts` - Added to ignores array
- ✅ `.markdownlintignore` - Already covered by `**/reference/**` pattern

**Files to UPDATE**:

- `src/auth/mcp-auth/index.ts` - Remove exports for deleted files

**Files to KEEP** (still used):

- ✅ `src/auth/mcp-auth/verify-clerk-token.ts` - Pure function
- ✅ `src/auth/mcp-auth/mcp-auth-clerk.ts` - May need to adapt for tool-level use
- ✅ `src/auth/mcp-auth/auth-response-helpers.ts` - Logging helpers
- ✅ `src/auth/mcp-auth/create-auth-log-context.ts` - Pure function
- ✅ `src/auth/mcp-auth/create-auth-log-context.unit.test.ts` - Unit tests
- ✅ `src/resource-parameter-validator.ts` - Pure function
- ✅ `src/tool-auth-checker.ts` - Pure function
- ✅ `src/auth-error-response.ts` - Pure function

**Validation** (ALL gates - failures are BLOCKING):

```bash
pnpm format-check:root    # MUST PASS
pnpm type-check           # MUST PASS (0 errors)
pnpm lint                 # MUST PASS (no unused imports)
pnpm test                 # MUST PASS (all tests)
pnpm build                # MUST PASS
```

**BLOCKING**: If ANY gate fails → STOP and FIX before Phase 1.7.

**Acceptance Criteria**:

- [x] HTTP 401 middleware archived
- [x] Tests for old code archived
- [x] Archive directory documented
- [x] Config files updated to exclude archive
- [x] Format check: ✅ PASS
- [x] Type check: ✅ PASS (0 errors)
- [x] Lint: ✅ PASS (no unused imports, no warnings)
- [x] All tests: ✅ PASS
- [x] Build: ✅ PASS

---

### Sub-Phase 1.7: Final Validation & Quality Gates ✅ COMPLETE

**Objective**: Ensure all quality gates pass and observability maintained.

**Re-ground in Foundation Documents**:

```bash
# Re-read foundation documents to verify compliance
cat .agent/directives-and-memory/rules.md
cat .agent/directives-and-memory/testing-strategy.md
cat .agent/directives-and-memory/schema-first-execution.md
```

**Run Full Quality Gates** (ALL must PASS - failures are BLOCKING):

```bash
# Run individually to identify any failures
# Each gate MUST PASS before proceeding

# 1. Format check - BLOCKING if fails
pnpm format-check:root

# 2. Type check - BLOCKING if fails
pnpm type-check      # 0 errors required

# 3. Lint - BLOCKING if fails
pnpm lint            # 0 errors, 0 warnings required

# 4. Markdown lint - BLOCKING if fails
pnpm markdownlint-check:root

# 5. Unit & integration tests - BLOCKING if fails
pnpm test            # All tests must pass

# 6. UI tests - BLOCKING if fails
pnpm test:ui

# 7. E2E tests - BLOCKING if fails
pnpm test:e2e        # All E2E tests must pass

# 8. E2E built tests - BLOCKING if fails
pnpm test:e2e:built

# 9. Smoke tests - BLOCKING if fails
pnpm smoke:dev:stub

# 10. Build - BLOCKING if fails
pnpm build           # Successful build required
```

**CRITICAL**: If ANY gate fails → STOP, FIX, then re-run ALL gates.

**Manual Testing**:

1. **Start server**:

```bash
cd apps/oak-curriculum-mcp-streamable-http
pnpm dev
```

2. **Test discovery** (should work without auth):

```bash
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq
```

Expected: HTTP 200, list of tools

3. **Test protected tool without auth** (should return MCP error with `_meta`):

```bash
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search","arguments":{"query":"test"}}}' | jq
```

Expected: HTTP 200, `result.isError: true`, `result._meta['mcp/www_authenticate']` present

4. **Check server logs** show:

- [ ] Request entry with correlation ID
- [ ] Auth context extraction (or "no auth provided")
- [ ] "Tool requires auth but none provided" warning
- [ ] Tool execution details
- [ ] Request completion
- [ ] All sensitive data redacted (no tokens in logs)

**Acceptance Criteria**:

- [x] Format check: ✅ PASS
- [x] Type check: ✅ PASS (0 errors)
- [x] Lint: ✅ PASS (0 errors, 0 warnings)
- [x] Markdown lint: ✅ PASS
- [x] All unit tests: ✅ PASS
- [x] All integration tests: ✅ PASS
- [x] All UI tests: ✅ PASS
- [x] All E2E tests: ✅ PASS
- [x] All E2E built tests: ✅ PASS
- [x] All smoke tests: ✅ PASS
- [x] Build: ✅ PASS
- [x] Discovery works without auth (automated test)
- [x] Protected tools return HTTP 200 with MCP errors when auth missing (automated test)
- [x] Logs demonstrate tool-level auth flow
- [x] Observability fully functional
- [x] **ALL quality gates passing - ZERO failures**
- [x] Ready for ChatGPT integration testing (Phase 2)

---

## Phase 1 Definition of Done

**Progress**: ✅ ALL 7 SUB-PHASES COMPLETE

**Critical Requirements**:

- ✅ E2E tests written FIRST specify tool-level auth (HTTP 200 with MCP errors)
- ✅ Integration tests written FIRST specify auth context flow
- ✅ HTTP-level auth middleware removed
- ✅ Foundation documents reviewed (Phase 0)
- ✅ Baseline quality gates run (Phase 0)
- ✅ Tests confirmed in RED phase (Phase 0)
- ✅ Request context unit tests written FIRST (RED) (Phase 1.4)
- ✅ Request context implemented with AsyncLocalStorage (GREEN) (Phase 1.4)
- ✅ MCP client auth checking implemented BEFORE SDK execution (Phase 1.4)
- ✅ Upstream API auth (ADR-054) unchanged (Phase 1.4)
- ✅ MCP errors include `_meta["mcp/www_authenticate"]` (Phase 1.4)
- ✅ Integration tests PASS (RED → GREEN) (Phase 1.4)
- ✅ E2E tests PASS (RED → GREEN) (Phase 1.4)
- ✅ Unit tests all pass including type error fix (Phase 1.5)
- ✅ Dead code archived to `.agent/reference-docs/replaced-http-auth-model/` (Phase 1.6)
- ✅ Foundation documents re-reviewed (Phase 1.7)
- ✅ All quality gates pass (Phase 1.7)
- ✅ Observability maintained (comprehensive logging)
- ✅ No V1/V2 versioning (files updated in place)
- ✅ No compatibility layers (old code archived, not kept)
- ✅ Clear separation: MCP client auth vs upstream API auth

**Evidence Required** (ALL PROVIDED):

- ✅ Phase 0 quality gate baseline documented
- ✅ Tests were in RED phase before implementation (TDD compliant)
- ✅ E2E tests passing (HTTP 200 + MCP errors)
- ✅ Integration tests passing (RED → GREEN)
- ✅ Unit tests passing (request-context)
- ✅ All existing tests still passing
- ✅ Server logs showing MCP client auth decisions (preventive, before SDK)
- ✅ Server logs showing upstream API auth still working (ADR-054, after SDK)
- ✅ Format check: PASS
- ✅ Type-check: PASS (0 errors)
- ✅ Lint: PASS (0 errors, 0 warnings)
- ✅ Markdown lint: PASS
- ✅ All tests: PASS
- ✅ All UI tests: PASS
- ✅ All E2E tests: PASS
- ✅ All smoke tests: PASS
- ✅ Build: PASS
- ✅ **ALL quality gates passing - ZERO failures**

**Success Metrics**:

- ✅ Discovery methods work without auth (no regression)
- ✅ Protected tools return HTTP 200 (not 401) when MCP client auth missing
- ✅ Protected tools include `_meta["mcp/www_authenticate"]` when MCP client auth missing
- ✅ Protected tools execute successfully when MCP client auth valid
- ✅ Upstream API auth (ADR-054) still intercepts Oak API errors
- ✅ All MCP client auth decisions logged with correlation IDs
- ✅ All upstream API auth decisions logged with correlation IDs
- ✅ Clear log distinction between two auth systems
- ✅ Zero regressions
- ✅ TDD followed at all levels (tests FIRST)
- ✅ Ready for ChatGPT integration testing (Phase 2)

**TDD Compliance**:

- ✅ E2E tests written FIRST (RED phase achieved)
- ✅ Integration tests written FIRST (RED phase achieved)
- ✅ Unit tests written FIRST for new components (RED → GREEN)
- ✅ Implementation follows tests, not vice versa
- ✅ Refactoring completed after tests pass (GREEN → REFACTOR)

---

## 📋 Phase 2 - Real-World Client Validation

**Objective**: Validate MCP OAuth implementation works with actual MCP clients (MCP Inspector, ChatGPT).

**CRITICAL**: This phase tests MCP client auth (ChatGPT → our server) ONLY.  
Upstream API auth (our server → Oak API) already works and is not part of this testing.

**Estimated Time**: 2-3 days  
**Prerequisites**:

- Phase 0 complete (quality gate baseline)
- Phase 1 complete (MCP client auth implemented)

**Note**: MCP Inspector DOES support OAuth for HTTP transports. Previous plan incorrectly stated it doesn't.

**Re-ground in Foundation Documents** (before starting):

```bash
cat .agent/directives-and-memory/rules.md
cat .agent/directives-and-memory/testing-strategy.md
```

---

### Sub-Phase 2.1: Environment Preparation

**Goal**: Ensure server can be tested by external clients.

#### Task 2.1.1: Local Testing Setup

**Steps**:

1. **Start server locally**:

   ```bash
   export CLERK_PUBLISHABLE_KEY=pk_test_...
   export CLERK_SECRET_KEY=sk_test_...
   export OAK_API_KEY=...
   export ALLOWED_HOSTS=localhost,127.0.0.1
   export LOG_LEVEL=debug

   pnpm -C apps/oak-curriculum-mcp-streamable-http dev
   ```

2. **Verify OAuth metadata endpoint**:

   ```bash
   curl http://localhost:3333/.well-known/oauth-protected-resource | jq
   ```

   Expected: Returns `resource`, `authorization_servers`, `scopes_supported`

3. **Verify discovery works without auth**:

   ```bash
   curl -X POST http://localhost:3333/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```

   Expected: 200 response with tool list

4. **Verify protected tools require auth**:

   ```bash
   curl -X POST http://localhost:3333/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get-lessons-summary","arguments":{}}}'
   ```

   Expected: HTTP 200 with MCP error result containing `_meta["mcp/www_authenticate"]`

**Acceptance Criteria**:

- [ ] Server running locally on <http://localhost:3333>
- [ ] OAuth metadata endpoint returns valid structure
- [ ] Discovery methods work without auth
- [ ] Protected methods return HTTP 200 with MCP error (not HTTP 401)
- [ ] MCP error includes `_meta["mcp/www_authenticate"]`
- [ ] Logs show auth decision points clearly

#### Task 2.1.2: Vercel Deployment (if needed for ChatGPT)

**Option A: Use existing deployment**  
**Option B: Deploy fresh instance**

**Environment Variables Required**:

```text
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
OAK_API_KEY=...
ALLOWED_HOSTS=your-domain.vercel.app
MCP_CANONICAL_URI=https://your-domain.vercel.app/mcp
BASE_URL=https://your-domain.vercel.app
LOG_LEVEL=debug
```

**Smoke Test**:

```bash
VERCEL_URL=https://your-domain.vercel.app

# Check OAuth metadata
curl $VERCEL_URL/.well-known/oauth-protected-resource | jq

# Check discovery (no auth)
curl -X POST $VERCEL_URL/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Check protected (requires auth)
curl -X POST $VERCEL_URL/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get-lessons-summary","arguments":{}}}'
```

**Acceptance Criteria**:

- [ ] HTTPS URL accessible publicly
- [ ] OAuth metadata endpoint public
- [ ] Discovery works without auth
- [ ] Protected methods return HTTP 200 with MCP error containing `_meta`
- [ ] Logs accessible via Vercel dashboard

---

### Sub-Phase 2.2: MCP Inspector Testing

**Goal**: Prove server works with official MCP reference implementation.

#### Task 2.2.1: Install and Configure MCP Inspector

**Installation**:

```bash
npx @modelcontextprotocol/inspector
```

**Configuration**:

- **Server URL**: `http://localhost:3333/mcp` (or Vercel URL)
- **Transport**: HTTP

**Note**: MCP Inspector does not currently support OAuth authentication for HTTP transports. Testing will focus on discovery and basic functionality. Full OAuth flow testing will be done with ChatGPT (Sub-Phase 2.3).

#### Task 2.2.2: Test Discovery Flow

**Manual Steps**:

1. Launch MCP Inspector
2. Connect to server URL
3. Observe tool list

**Expected Behavior**:

- Connection succeeds
- All tools visible (~25+ tools)
- Tool metadata includes `securitySchemes` field
- No authentication required for tool discovery

**Verification**:

- [ ] Inspector connects successfully
- [ ] Tools list populates
- [ ] Tool security metadata present
- [ ] Server logs show `tools/list` request at debug level

**Evidence**: Screenshot of Inspector tool list

#### Task 2.2.3: Test Protected Tool Behavior

**Manual Steps**:

1. Select a protected tool (e.g., `get-lessons-summary`)
2. Attempt to execute without auth token
3. Observe error response

**Expected Behavior**:

- HTTP 200 response (not 401)
- MCP error result with `isError: true`
- `_meta["mcp/www_authenticate"]` present in result
- Error message indicates auth required
- Server logs show "Tool requires auth but none provided"

**Verification**:

- [ ] HTTP 200 response received
- [ ] MCP error structure correct
- [ ] `_meta` field contains WWW-Authenticate data
- [ ] Error message helpful
- [ ] Logs show auth failure with correlation ID

**Evidence**: Screenshot of error response, log excerpt

#### Task 2.2.4: OAuth Flow Testing in Inspector

**MCP Inspector OAuth Support**:

- MCP Inspector DOES support OAuth for HTTP transports
- Can test full OAuth flow including token exchange
- Can test authenticated tool execution
- Provides detailed auth flow debugging

**Testing Steps**:

1. Configure Inspector with OAuth metadata endpoint
2. Trigger OAuth flow by calling protected tool
3. Complete OAuth authorization in browser
4. Verify token storage and reuse
5. Test authenticated tool execution

**Evidence**: Screenshots of OAuth flow in Inspector, authenticated requests

#### Task 2.2.5: Document MCP Inspector Findings

**File**: `apps/oak-curriculum-mcp-streamable-http/docs/mcp-inspector-testing.md`

**Content** (template):

```markdown
# MCP Inspector Testing Results

**Date**: YYYY-MM-DD  
**Inspector Version**: X.X.X  
**Server**: oak-curriculum-mcp-streamable-http  
**Server Version**: X.X.X

## Summary

[Brief summary of what worked, what didn't, any limitations]

## Discovery Testing

✅/❌ Inspector connects to server  
✅/❌ Tools list appears  
✅/❌ Security metadata present  
✅/❌ No auth required for discovery

[Screenshots]

## Authentication Testing

✅/❌ Protected tools return HTTP 200 with MCP error (not HTTP 401)  
✅/❌ MCP error includes `_meta["mcp/www_authenticate"]`  
✅/❌ Error messages helpful  
❌ OAuth flow NOT supported in Inspector (known limitation)  
❌ Cannot test authenticated tool execution (must use ChatGPT)

[Screenshots and logs]

## Limitations / Issues

- ❌ **MCP Inspector does not support OAuth for HTTP transports**
- Cannot complete OAuth authorization flow
- Cannot test protected tool execution with valid tokens
- OAuth testing must be done with ChatGPT (see ChatGPT Integration Guide)
- [Any other issues encountered]
- [Server issues discovered]

## Logs

[Relevant server log excerpts showing auth flow]
```

**Acceptance Criteria**:

- [ ] Document created
- [ ] Includes screenshots/evidence
- [ ] Notes any issues or limitations
- [ ] Reproducible instructions

---

### Sub-Phase 2.3: ChatGPT Integration Testing

**Goal**: Validate server works as ChatGPT app (primary use case).

**Note**: Requires ChatGPT Plus/Team account or Apps SDK access.

#### Task 2.3.1: Register MCP Server in ChatGPT

**Prerequisites**:

- Server deployed with HTTPS (Vercel or ngrok)
- OAuth metadata endpoint publicly accessible

**Steps**:

1. Open ChatGPT settings
2. Navigate to custom GPTs or Actions (UI varies)
3. Add new integration/action
4. **Configure**:
   - Name: "Oak Curriculum MCP"
   - Server URL: `https://your-domain.vercel.app/mcp`
   - Authentication: OAuth 2.0
   - Discovery URL: `https://your-domain.vercel.app/.well-known/oauth-protected-resource`

**Expected Behavior**:

- ChatGPT validates OAuth metadata
- Server registration succeeds
- No errors during setup

**Verification**:

- [ ] Server registered in ChatGPT
- [ ] No validation errors
- [ ] Configuration saved

**Evidence**: Screenshots of ChatGPT configuration

#### Task 2.3.2: Test Discovery in ChatGPT

**Manual Steps**:

1. Open new ChatGPT conversation
2. Ask: "What tools do you have from Oak Curriculum?"
3. Observe response

**Expected Behavior**:

- ChatGPT lists available tools
- Tool descriptions appear
- No authentication errors during discovery

**Verification**:

- [ ] ChatGPT discovers tools
- [ ] Tool names and descriptions correct
- [ ] No errors in ChatGPT UI
- [ ] Server logs show `tools/list` request without auth

**Evidence**: Screenshot of ChatGPT tool list

#### Task 2.3.3: Test OAuth "Connect" Flow

**Manual Steps**:

1. Ask ChatGPT to use a protected tool
   - Example: "Show me Year 7 maths lessons about fractions"
2. Observe ChatGPT UI
3. Click "Connect" button (should appear)
4. Complete OAuth flow:
   - Redirected to Clerk
   - Authenticate with Clerk account
   - Grant permissions
   - Redirected back to ChatGPT

**Expected Behavior**:

- ChatGPT shows "Connect to Oak Curriculum" button
- OAuth flow launches in new window/tab
- Clerk authentication page appears
- User can sign in
- Permissions page appears (if configured)
- Redirect back to ChatGPT succeeds
- ChatGPT shows "Connected" status

**Verification**:

- [ ] "Connect" button appears (not generic error)
- [ ] OAuth window opens
- [ ] Clerk page loads
- [ ] Authentication succeeds
- [ ] Redirect back succeeds
- [ ] ChatGPT acknowledges connection
- [ ] Server logs show OAuth request/callback

**Evidence**:

- Screenshots of each OAuth flow step
- Server logs showing OAuth handshake

#### Task 2.3.4: Test Tool Execution

**Manual Steps**:

1. After connecting, retry original request
   - "Show me Year 7 maths lessons about fractions"
2. Observe execution
3. Try multiple tool calls

**Expected Behavior**:

- Tool executes successfully
- ChatGPT displays results
- Token persists across multiple calls
- No re-authentication required

**Verification**:

- [ ] Tool execution succeeds after OAuth
- [ ] ChatGPT formats results appropriately
- [ ] Multiple calls work without re-auth
- [ ] Server logs show "Authentication successful" with user ID
- [ ] Server logs show correlation IDs for each request

**Evidence**:

- ChatGPT conversation screenshots
- Server logs for successful authenticated requests

#### Task 2.3.5: Test Error Handling

**Manual Steps**:

1. Disconnect OAuth (if ChatGPT allows)
2. Attempt to use protected tool
3. Observe error handling

**Expected Behavior**:

- ChatGPT shows appropriate error
- Prompts to reconnect
- Server logs show auth failure

**Optional Tests**:

- Token expiration handling
- Invalid scopes
- Network errors

**Verification**:

- [ ] Errors handled gracefully
- [ ] User can recover by reconnecting
- [ ] Logs show specific auth failure reasons

#### Task 2.3.6: Document ChatGPT Integration

**File**: `apps/oak-curriculum-mcp-streamable-http/docs/chatgpt-integration.md`

**Content** (template):

```markdown
# ChatGPT Integration Guide

**Last Updated**: YYYY-MM-DD  
**Server**: oak-curriculum-mcp-streamable-http  
**Tested With**: ChatGPT Plus (date)

## Prerequisites

- ChatGPT Plus or Team account
- Server deployed with HTTPS
- Clerk OAuth configured

## Registration

[Step-by-step with screenshots]

## Discovery

✅/❌ Tool discovery works  
✅/❌ All tools visible  
✅/❌ Descriptions accurate

## OAuth Flow

✅/❌ "Connect" button appears  
✅/❌ OAuth flow completes  
✅/❌ Clerk authentication works  
✅/❌ Redirect succeeds

[Screenshots of each step]

## Tool Execution

✅/❌ Protected tools execute after auth  
✅/❌ Results displayed correctly  
✅/❌ Multiple calls work  
✅/❌ Token persists

[Example conversation screenshots]

## Troubleshooting

**Issue**: "Connect" button doesn't appear  
**Cause**: OAuth metadata not accessible or malformed  
**Fix**: [solution]

[Additional issues and solutions]

## Server Logs

[Example logs showing successful auth flow with correlation IDs]
```

**Acceptance Criteria**:

- [ ] Complete setup guide with screenshots
- [ ] OAuth flow documented step-by-step
- [ ] Example conversation included
- [ ] Troubleshooting section
- [ ] Server log examples

---

### Sub-Phase 2.4: Production Readiness

**Goal**: Final validation before considering complete.

**Re-ground in Foundation Documents**:

```bash
cat .agent/directives-and-memory/rules.md
cat .agent/directives-and-memory/testing-strategy.md
cat .agent/directives-and-memory/schema-first-execution.md
```

#### Task 2.4.1: Security Audit

**Checklist**:

- [ ] Tokens never logged in plaintext
- [ ] Authorization headers redacted in logs
- [ ] HTTPS enforced (except localhost)
- [ ] CORS configured correctly
- [ ] Error messages don't leak sensitive info
- [ ] OAuth redirect URIs validated
- [ ] Clerk keys kept secret (env vars only)

**Review Files**:

- `auth-response-helpers.ts` - check no token logging
- `mcp-auth-logging.integration.test.ts` - verify redaction tests
- All log statements - verify no sensitive data

**Verification**:

```bash
# Search for potential token leaks
cd apps/oak-curriculum-mcp-streamable-http
grep -r "logger\." src/ | grep -i "token\|bearer\|authorization" | grep -v "test"
# Should NOT log actual token values
```

**Acceptance Criteria**:

- [ ] No token values in logs
- [ ] No authorization header values in logs
- [ ] All sensitive data redacted
- [ ] Security checklist complete

#### Task 2.4.2: Documentation Review

**Files to Review**:

- `README.md` - Ensure OAuth setup documented
- `docs/mcp-inspector-testing.md` - New from Sub-Phase 2.2
- `docs/chatgpt-integration.md` - New from Sub-Phase 2.3
- `docs/clerk-mcp-research-findings.md` - Already exists
- `docs/clerk-oauth-trace-instructions.md` - Already exists

**Checklist**:

- [ ] All OAuth endpoints documented
- [ ] Environment variables listed
- [ ] Example curl commands work
- [ ] Troubleshooting guides complete
- [ ] Screenshots current and accurate
- [ ] No broken links

#### Task 2.4.3: Final Quality Gates

**Run ALL gates individually** (failures are BLOCKING):

```bash
# From repo root - each MUST PASS
pnpm format-check:root    # BLOCKING if fails
pnpm type-check           # BLOCKING if fails
pnpm lint                 # BLOCKING if fails
pnpm markdownlint-check:root  # BLOCKING if fails
pnpm test                 # BLOCKING if fails
pnpm test:ui              # BLOCKING if fails
pnpm test:e2e             # BLOCKING if fails
pnpm test:e2e:built       # BLOCKING if fails
pnpm smoke:dev:stub       # BLOCKING if fails
pnpm build                # BLOCKING if fails
```

**OR run full quality gate suite**:

```bash
pnpm qg  # Runs all quality gates - ANY failure is BLOCKING
```

**CRITICAL**: If ANY gate fails → STOP, FIX, re-run ALL gates before declaring Phase 2 complete.

**Acceptance Criteria** (ALL must be met):

- [ ] Format check: ✅ PASS
- [ ] Type-check: ✅ PASS (0 errors)
- [ ] Lint: ✅ PASS (0 errors, 0 warnings)
- [ ] Markdown lint: ✅ PASS
- [ ] All unit tests: ✅ PASS
- [ ] All integration tests: ✅ PASS
- [ ] All UI tests: ✅ PASS
- [ ] All E2E tests: ✅ PASS
- [ ] All E2E built tests: ✅ PASS
- [ ] All smoke tests: ✅ PASS
- [ ] Build: ✅ PASS
- [ ] **ZERO quality gate failures**

---

## Phase 2 Overall Definition of Done

**Critical (Must Have)**:

- [ ] Phase 1 complete (MCP client auth implemented)
- [ ] All quality gates passing
- [ ] Foundation documents reviewed
- [ ] MCP Inspector tested and documented (OAuth flow working)
- [ ] ChatGPT integration tested and documented

**Evidence (Required)**:

- [ ] `docs/mcp-inspector-testing.md` exists with screenshots
- [ ] `docs/chatgpt-integration.md` exists with OAuth flow screenshots
- [ ] Server logs demonstrate observable auth flow
- [ ] Security audit checklist complete

**Success Metrics**:

- [ ] MCP Inspector can discover tools without auth
- [ ] MCP Inspector OAuth flow works (token exchange, authenticated calls)
- [ ] ChatGPT shows "Connect" button for protected tools
- [ ] OAuth flow completes successfully in ChatGPT
- [ ] Protected tools execute after MCP client authentication
- [ ] MCP client auth failures are debuggable via logs
- [ ] Upstream API auth still working (ADR-054)
- [ ] Clear log distinction between two auth systems
- [ ] Zero regressions
- [ ] All quality gates passing

**Ready for Production When**:

- All acceptance criteria met
- Real users successfully authenticate
- Documentation enables self-service troubleshooting

---

## 🔮 OPTIONAL: Phase 3 - Enhanced Error Handling (Future Work)

**Status**: NOT URGENT - Current error handling is effective  
**Estimated Time**: 4-6 hours (if pursued)  
**Prerequisites**: Phase 2 complete, production validated

**Objective**: Adopt explicit `Result<T, E>` pattern with error codes for enhanced debugging.

### Why This is Optional

**Current State** (already good):

- ✅ Comprehensive logging at all decision points
- ✅ Clear error messages in HTTP responses
- ✅ Sensitive data redacted
- ✅ Correlation IDs enable request tracing
- ✅ `undefined` / `{ valid, reason }` pattern is simple and effective

**Potential Benefits** (marginal):

- Explicit error codes enable precise log filtering
- Structured error context (expected vs received)
- Type-safe error handling
- Matches SDK pattern (consistency)

**Rules Compliance Note**:
If pursued, this MUST be done as **in-place updates**, not V1/V2 versioning:

- ✅ Update functions in place
- ✅ Update all call sites in same commits
- ✅ Use TDD to prove behavior preserved
- ❌ NO V1/V2 function naming
- ❌ NO backwards compatibility wrappers

### Simplified Approach (If Pursued)

**Task 3.1**: Define Result Types (1 hour)

```typescript
// File: src/auth/mcp-auth/auth-result-types.ts (NEW)

export const AuthErrorCode = {
  MISSING_HEADER: 'AUTH_MISSING_HEADER',
  INVALID_FORMAT: 'AUTH_INVALID_FORMAT',
  VERIFICATION_FAILED: 'AUTH_VERIFICATION_FAILED',
  CLERK_NOT_AUTHENTICATED: 'AUTH_CLERK_NOT_AUTHENTICATED',
  CLERK_MISSING_FIELD: 'AUTH_CLERK_MISSING_FIELD',
  AUDIENCE_MISMATCH: 'AUTH_AUDIENCE_MISMATCH',
  JWT_DECODE_ERROR: 'AUTH_JWT_DECODE_ERROR',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

export interface AuthError {
  readonly code: AuthErrorCode;
  readonly message: string;
  readonly context?: { readonly [key: string]: unknown };
}

export type AuthResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: AuthError };

export function authSuccess<T>(value: T): AuthResult<T> {
  return { ok: true, value };
}

export function authError(
  code: AuthErrorCode,
  message: string,
  context?: AuthError['context'],
): AuthResult<never> {
  return { ok: false, error: { code, message, context } };
}
```

**Task 3.2**: Update `verifyClerkToken` IN PLACE (TDD, 1 hour)

```typescript
// File: src/auth/mcp-auth/verify-clerk-token.ts
// Update return type, implementation, and ALL call sites

export function verifyClerkToken(
  auth: MachineAuthObject<'oauth_token'>,
  token: string | undefined,
): AuthResult<AuthInfo> {
  // Changed from AuthInfo | undefined
  if (!token) {
    return authError(AuthErrorCode.VERIFICATION_FAILED, 'Token is required');
  }
  // ... rest of implementation returning AuthResult
}
```

**Task 3.3**: Update call sites (30 min)

```typescript
// File: src/auth/mcp-auth/mcp-auth-clerk.ts
const result = verifyClerkToken(authData, token);
if (!result.ok) {
  logger.warn('Clerk token verification failed', {
    errorCode: result.error.code, // NEW: explicit code
    reason: result.error.message,
  });
  return Promise.resolve(result); // Pass through Result
}
return Promise.resolve(result);
```

**Task 3.4**: Update remaining functions (2 hours)

- `validateResourceParameter` → return `AuthResult<{ audience: string }>`
- `TokenVerifier` type → return `Promise<AuthResult<AuthInfo>>`
- Update all call sites

**Task 3.5**: Integration tests (1 hour)

- Update existing tests to check `result.ok`
- Verify error codes in logs
- HTTP behavior unchanged

**Task 3.6**: Documentation (30 min)

- Error code reference
- Log filtering examples

**Total**: 4-6 hours (vs 6.5-9.5 in original plan)

---

## Appendix A: Key Files Reference

### Auth Implementation

- `src/auth/mcp-auth/mcp-auth.ts` - Core middleware
- `src/auth/mcp-auth/mcp-auth-clerk.ts` - Clerk integration
- `src/auth/mcp-auth/verify-clerk-token.ts` - Pure verification function
- `src/auth/mcp-auth/auth-response-helpers.ts` - Response + logging helpers
- `src/resource-parameter-validator.ts` - RFC 8707 validation
- `src/auth-routes.ts` - Route registration

### Test Files (Selected)

- `src/auth/mcp-auth/mcp-auth-logging.integration.test.ts` - Logging tests ✅
- `src/auth/mcp-auth/create-auth-log-context.unit.test.ts` - Log context tests (has type error)
- `src/auth/mcp-auth/verify-clerk-token.unit.test.ts` - Pure function tests
- `e2e-tests/auth-enforcement.e2e.test.ts` - E2E auth tests
- `e2e-tests/auth-bypass.e2e.test.ts` - Discovery without auth tests

### Documentation (Existing)

- `docs/clerk-mcp-research-findings.md` - Clerk + ChatGPT compatibility
- `docs/clerk-oauth-trace-instructions.md` - OAuth debugging
- `docs/headless-oauth-automation.md` - Testing automation
- `docs/middleware-chain.md` - Request flow

### Documentation (To Create)

- `docs/mcp-inspector-testing.md` - Phase 2.2
- `docs/chatgpt-integration.md` - Phase 2.3

---

## Appendix B: Architectural Decision - Why Tool-Level Auth

### CRITICAL: Two Separate Auth Systems

**DO NOT CONFUSE THESE TWO**:

1. **MCP OAuth** (ChatGPT authenticating to our MCP server)
   - This is what we're implementing
   - Uses Clerk OAuth with Bearer tokens
   - Verified by our server using `verifyClerkToken`
   - This is MCP auth - has NOTHING to do with the upstream API

2. **Upstream API Auth** (Our server authenticating to Oak Curriculum API)
   - Completely separate system
   - Uses API key authentication
   - Handled transparently by the SDK
   - NOT related to MCP auth
   - The SDK will never return 401 for MCP auth purposes

### OpenAI Apps SDK vs MCP Auth Spec

**Two Different Standards for MCP OAuth**:

1. **MCP Authorization Spec** ([MCP Docs](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization))
   - HTTP-level authorization
   - Returns HTTP 401 Unauthorized
   - `WWW-Authenticate` header in HTTP response
   - Standard OAuth 2.1 resource server pattern
   - ❌ Does NOT work with ChatGPT

2. **OpenAI Apps SDK** ([OpenAI Docs](https://platform.openai.com/docs/guides/apps-sdk/authentication))
   - Tool-level authorization
   - Returns HTTP 200 with MCP error result
   - `_meta["mcp/www_authenticate"]` in MCP result (not HTTP header)
   - Specifically designed for ChatGPT integration
   - ✅ REQUIRED for ChatGPT

### Why We Must Use Tool-Level Auth

**Our primary use case is ChatGPT**, which requires:

- `securitySchemes` in tool metadata (generated at type-gen time)
- `_meta["mcp/www_authenticate"]` in error results (not HTTP headers)
- HTTP 200 responses with MCP errors (not HTTP 401)

**Evidence from OpenAI Apps SDK docs**:

- ChatGPT parses `_meta` field in MCP error results
- HTTP 401 responses prevent ChatGPT from showing "Connect" button
- Tool-level auth is the specified approach for ChatGPT integration

**Note**: MCP Inspector does not currently support OAuth for HTTP transports, so cannot be used to test the full OAuth flow.

### What We Keep vs What We Change

**KEEP (Reusable Infrastructure)**:

- ✅ Clerk integration
- ✅ Token verification logic (`verifyClerkToken`)
- ✅ Resource parameter validation (`validateResourceParameter`)
- ✅ Logging infrastructure
- ✅ Protected resource metadata endpoint
- ✅ Per-tool security metadata

**CHANGE (Enforcement Layer)**:

- ❌ Move auth checking FROM middleware TO tool handlers
- ❌ Return MCP errors INSTEAD OF HTTP 401
- ❌ Include `_meta` INSTEAD OF `WWW-Authenticate` header

This preserves all our good work (verification, logging, metadata) while fixing the enforcement layer to match ChatGPT's requirements.

---

## Appendix C: Plan Evolution

| Date       | Version | Key Changes                                                  |
| ---------- | ------- | ------------------------------------------------------------ |
| 2025-11-24 | v1      | Initial plan - HTTP-level auth (MCP spec)                    |
| 2025-11-24 | v2      | Verified observability complete                              |
| 2025-11-24 | v3      | **CRITICAL FIX: Tool-level auth required (OpenAI Apps SDK)** |

**v3 Changes**:

- ✅ Identified architectural mismatch (HTTP vs tool-level)
- ✅ Restructured Phase 1 as architectural fix (TDD approach)
- ✅ Preserved all observability infrastructure
- ✅ Maintained rules compliance (no V1/V2, TDD at all levels)
- ✅ Phase 2 (Client Validation) unchanged but depends on Phase 1

---

## Revision History

| Date       | Author | Changes                                                                                                  |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------- |
| 2025-11-24 | Agent  | **REWRITTEN** based on verified codebase state. Phase 2 (observability) is COMPLETE                      |
| 2025-11-24 | Agent  | Simplified Phase 3 (Result pattern) to comply with architectural rules                                   |
| 2025-11-24 | Agent  | Made Phase 3 OPTIONAL - current error handling already effective                                         |
| 2025-11-24 | Agent  | **CRITICAL REVISION**: Identified wrong auth layer. Must implement tool-level auth (1-2d)                |
| 2025-11-24 | Agent  | Phase 1 restructured as architectural fix following TDD at all levels                                    |
| 2025-11-24 | Agent  | Maintained observability throughout, preserved pure functions, rules-compliant                           |
| 2025-11-24 | Agent  | **MAJOR UPDATE**: Added Phase 0 (quality gates baseline), corrected TDD flow, AsyncLocalStorage solution |
| 2025-11-24 | Agent  | Clarified MCP client auth vs upstream API auth separation throughout                                     |
| 2025-11-24 | Agent  | Corrected MCP Inspector OAuth support (it DOES support OAuth)                                            |
| 2025-11-24 | Agent  | Added periodic foundation document reviews and quality gate runs                                         |
