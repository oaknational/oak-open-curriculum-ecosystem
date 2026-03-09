# Complete Phase 2.7: Tool-Level Auth Error Handling

## Prerequisites: READ FIRST

**Foundation Documents** (Re-read before starting):

1. `.agent/directives/principles.md` - TDD, quality gates, type safety
2. `.agent/directives/testing-strategy.md` - Test types, TDD at all levels
3. `.agent/directives/schema-first-execution.md` - Generator/runtime contract
4. `.agent/plans/schema-first-security-implementation.md` (lines 2314-2480) - Sub-Phase 2.7 details

## Current Status

**Completed** (Tasks 2.7.1-2.7.4):

- ✅ `createAuthErrorResponse()` pure function (15 unit tests)
- ✅ `isAuthError()`, `getAuthErrorType()`, `getAuthErrorDescription()` pure functions (32 unit tests)
- ✅ Quality: 253/253 tests passing, zero regressions, all gates pass

**Remaining** (Tasks 2.7.5-2.7.10):

- ⏳ Integration tests for tool handler error interception
- ⏳ Implement tool handler error interception
- ⏳ E2E tests for \_meta emission
- ⏳ Quality gates and alignment checkpoint

---

## Task 2.7.5: Integration Tests for Tool Handler (RED)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers-auth-errors.integration.test.ts`

**Goal**: Prove tool handlers intercept auth errors and emit MCP-compliant \_meta responses.

**Test Categories** (12+ tests):

1. **Upstream auth errors** - Oak API 401/403, Clerk token failures → \_meta emission
2. **Error response structure** - Verify content, isError, \_meta["mcp/www_authenticate"]
3. **Observability** - Logger called with toolName, errorType, description
4. **Non-auth errors** - Validation/network errors → no \_meta, error re-thrown

**Testing Approach**:

```typescript
describe('Tool Handler Auth Error Handling', () => {
  it('should emit _meta on Oak API 401', async () => {
    // Mock ToolHandlerDependencies with executor that throws 401
    const mockDeps: ToolHandlerDependencies = {
      createClient: () => mockClient,
      createExecutor: () => mockExecutor,
      executeMcpTool: async () => {
        throw Object.assign(new Error('Unauthorized'), { status: 401 });
      },
      getResourceUrl: () => 'https://test.example.com/mcp',
    };
    const mockLogger = { warn: vi.fn() /* ... */ };

    // Call tool handler with mocked dependencies
    const result = await toolHandler(params, mockDeps, mockLogger);

    // Assert _meta structure
    expect(result.isError).toBe(true);
    expect(result._meta['mcp/www_authenticate']).toBeDefined();
    expect(result._meta['mcp/www_authenticate'][0]).toContain('Bearer');
    expect(mockLogger.warn).toHaveBeenCalledWith('Tool execution auth error', {
      toolName: expect.any(String),
      errorType: 'invalid_token',
      description: expect.any(String),
    });
  });

  // ... 11+ more tests covering all scenarios
});
```

**Key Points**:

- In-process test (import code, no running system)
- Simple mocks injected as function arguments
- Test behavior (does it emit \_meta?), not implementation (how does it detect errors?)
- MUST fail initially (RED phase)

**Run**: `pnpm test handlers-auth-errors.integration.test.ts`

**Expected**: All tests FAIL (product code doesn't exist yet)

---

## Task 2.7.6: Implement Tool Handler Error Interception (GREEN)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

**Changes Required**:

1. **Add to `ToolHandlerDependencies` interface**:

```typescript
export interface ToolHandlerDependencies {
  readonly createClient: (apiKey: string) => OakApiClient;
  readonly createExecutor: (config: ExecutorConfig) => ToolExecutor;
  readonly executeMcpTool: ExecuteMcpToolFunction;
  readonly getResourceUrl: () => string; // NEW - for _meta resource URL
}
```

2. **Import error handling functions**:

```typescript
import { isAuthError, getAuthErrorType, getAuthErrorDescription } from './auth-error-detector.js';
import { createAuthErrorResponse } from './auth-error-response.js';
```

3. **Wrap tool execution in try/catch** (in `registerHandlers` loop):

```typescript
server.registerTool(
  tool.name,
  {
    /* existing config with securitySchemes */
  },
  async (params: unknown) => {
    try {
      // Existing execution logic
      return executor(tool.name, params ?? {});
    } catch (error) {
      if (isAuthError(error)) {
        const resourceUrl = deps.getResourceUrl();
        const errorType = getAuthErrorType(error);
        const description = getAuthErrorDescription(error);

        options.logger.warn('Tool execution auth error', {
          toolName: tool.name,
          errorType,
          description,
        });

        return createAuthErrorResponse(errorType, description, resourceUrl);
      }
      throw error; // Re-throw non-auth errors
    }
  },
);
```

4. **Provide `getResourceUrl` in dependencies**:

```typescript
const deps: ToolHandlerDependencies = {
  ...defaultDependencies,
  getResourceUrl: () => {
    // Implementation to get resource URL from request context
    // Could use AsyncLocalStorage or pass through options
    return options.resourceUrl ?? 'https://default.example.com/mcp';
  },
  ...(options.overrides ?? {}),
};
```

**Run**: `pnpm test handlers-auth-errors.integration.test.ts`

**Expected**: All tests PASS (GREEN phase)

**Quality Gate**: `pnpm format:root && pnpm type-check && pnpm lint -- --fix && pnpm test && pnpm build`

---

## Task 2.7.7: E2E Tests for \_meta Emission (RED)

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-error-meta-emission.e2e.test.ts`

**Goal**: Prove end-to-end that auth errors trigger \_meta emission for ChatGPT.

**Test Categories** (10+ tests):

1. **Discovery methods** - tools/list, initialize without token → 200, no \_meta
2. **Public tools** - get-changelog without token → 200, no \_meta
3. **Auth-required tools** - get-key-stages without token → \_meta emission
4. **Aggregated tools** - search, fetch without token → \_meta emission
5. **Valid auth** - get-key-stages with valid token → success, no \_meta

**Structure**:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/application.js';

describe('Auth Error _meta Emission (E2E)', () => {
  let app;

  beforeAll(() => {
    app = createApp({
      /* test config */
    });
  });

  it('should emit _meta when calling get-key-stages without token', async () => {
    const response = await request(app)
      .post('/mcp')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: { name: 'get-key-stages', arguments: {} },
      });

    expect(response.body.result.isError).toBe(true);
    expect(response.body.result._meta['mcp/www_authenticate']).toBeDefined();
    expect(response.body.result._meta['mcp/www_authenticate'][0]).toMatch(
      /Bearer.*resource_metadata.*error=/,
    );
  });

  // ... 9+ more tests
});
```

**Run**: `pnpm test:e2e -- auth-error-meta-emission`

**Expected**: Tests FAIL initially (RED phase)

---

## Task 2.7.8: Run E2E Tests (GREEN)

**Command**: `pnpm test:e2e -- auth-error-meta-emission`

**Expected**: All E2E tests PASS

**If tests fail**: Debug tool handler, verify `getResourceUrl` injection, check auth error detection, review logs, fix, re-run quality gates.

---

## Task 2.7.9: Quality Gates

**Run ALL gates**:

```bash
pnpm format:root
pnpm type-check
pnpm lint -- --fix
pnpm test
pnpm build
```

**Expected**: All PASS, ~260+ tests, zero regressions

**Policy**: If any gate fails, FIX IMMEDIATELY. Never disable checks. Refactor if complexity issues arise.

---

## Task 2.7.10: Alignment Checkpoint

**Verify**:

- [ ] Tests written FIRST at all levels (unit, integration, E2E)
- [ ] Error handling functions are pure (no side effects, no I/O)
- [ ] Observability comprehensive (logger with context)
- [ ] \_meta format matches OpenAI specification
- [ ] No type assertions (as, any, !) in new code
- [ ] No disabled checks or skipped tests
- [ ] Tests prove behavior, not implementation

**Re-read**: `principles.md` (TDD section), `testing-strategy.md` (test types)

---

## Definition of Done

**Sub-Phase 2.7 COMPLETE when**:

- [x] Pure functions created/tested (Tasks 2.7.1-2.7.4) ✅
- [ ] Integration tests written and passing (Task 2.7.5-2.7.6, 12+ tests)
- [ ] E2E tests written and passing (Tasks 2.7.7-2.7.8, 10+ tests)
- [ ] All quality gates pass (~260+ tests)
- [ ] Alignment checkpoint verified
- [ ] Tool-level auth errors trigger ChatGPT OAuth linking UI (proven by E2E)

---

## Commit Messages

**After Task 2.7.5** (RED):

```text
test(auth): add integration tests for tool handler error interception

Test tool handlers intercept auth errors and emit _meta responses.
Covers upstream errors, observability, non-auth error handling.

Part of Phase 2, Sub-Phase 2.7. Tests fail as expected (RED).
```

**After Task 2.7.6** (GREEN):

```text
feat(auth): intercept auth errors in tool handlers and emit _meta

Tool handlers catch auth errors, return MCP responses with
_meta["mcp/www_authenticate"] to trigger ChatGPT OAuth linking UI.

- Add getResourceUrl to ToolHandlerDependencies
- Wrap tool execution in try/catch
- Log errors with context via logger
- Re-throw non-auth errors

Part of Phase 2, Sub-Phase 2.7. All integration tests passing.
```

**After Tasks 2.7.7-2.7.8**:

```text
test(auth): add E2E tests for _meta emission on auth failures

Prove end-to-end auth errors trigger _meta for ChatGPT.
All tool types covered, all E2E tests passing.

Part of Phase 2, Sub-Phase 2.7.
```

**After Task 2.7.9** (completion):

```text
chore(phase2): complete Sub-Phase 2.7 - auth error handling

- 47 unit tests for pure functions
- 12+ integration tests for tool handler
- 10+ E2E tests for _meta emission
- All quality gates passing (~260+ tests)
- Zero regressions

Phase 2 Sub-Phase 2.7 COMPLETE. Ready for 2.8 (validation).
```

---

## Critical Rules

1. **TDD**: Tests FIRST, always (Red → Green → Refactor)
2. **Pure functions**: No side effects, no I/O in error handling
3. **Simple mocks**: Injected as arguments, no complex logic
4. **Quality gates**: After EVERY step, fix failures immediately
5. **Never disable**: No skipped tests, no disabled checks
6. **Type safety**: No `as`, `any`, `!` - preserve type information
7. **Observability**: Use `@oaknational/mcp-logger` with context

---

## Next Steps

After Sub-Phase 2.7: Proceed to **Sub-Phase 2.8: Phase 2 Validation** (see plan lines 2482-2535)

**START NOW**: Task 2.7.5 - Write integration tests (RED phase) 🚀
