# Header Redaction Test Coverage Implementation

**Created**: 2025-11-14  
**Priority**: 🔴 CRITICAL BLOCKER for Session 3.C Staging Deployment  
**Context**: Security-critical feature with ZERO test coverage

---

## Task Overview

Implement comprehensive unit, integration, and E2E test coverage for the header redaction module (`apps/oak-curriculum-mcp-streamable-http/src/logging/header-redaction.ts`), which is responsible for protecting sensitive data in HTTP headers before they are logged.

This is a **security-critical** feature that MUST be thoroughly tested before deployment to staging. The potential impact of getting header redaction wrong includes:

- Leaking authentication tokens (Authorization, X-API-Key, X-Auth-Token)
- Exposing Clerk OAuth tokens (X-Vercel-OIDC-Token, X-Vercel-Proxy-Signature)
- Revealing user cookies (Cookie, Set-Cookie headers)
- Exposing client IP addresses (CF-Connecting-IP, X-Forwarded-For, etc.)

**Current Status**: The module has ZERO test coverage despite being integrated into the correlation middleware and actively used in production logs.

---

## Before You Begin

**REQUIRED READING** (in this order):

1. `@.agent/context/HANDOFF.md` - Big picture orientation and current status
2. `@.agent/context/continuation.prompt.md` - Complete technical context and historical decisions
3. `@.agent/context/context.md` - Recent changes and immediate next steps
4. `@.agent/directives/rules.md` - Cardinal rules (MUST follow)
5. `@.agent/directives/testing-strategy.md` - TDD workflow (Red → Green → Refactor)
6. `@apps/oak-curriculum-mcp-streamable-http/src/logging/header-redaction.ts` - Module under test
7. `@apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.ts` - Integration point

**Context Summary**:

- Repository: Oak MCP Ecosystem (monorepo with pnpm)
- Branch: `feat/oauth_support`
- Current State: All 218 tests passing, all quality gates green
- Test Baseline: 129 unit/integration, 57 e2e, 5 e2e:built, 21 UI, 6 smoke
- Blocker: Header redaction module has zero test coverage
- Next: Session 3.C staging deployment (blocked until tests complete)

---

## The Module Under Test

**File**: `apps/oak-curriculum-mcp-streamable-http/src/logging/header-redaction.ts`

**Purpose**: Redact sensitive information from HTTP headers before logging to prevent data leakage.

**Key Functions**:

1. `redactHeadersSummary(headers: IncomingHttpHeaders): IncomingHttpHeaders`
   - Redacts sensitive incoming request headers
   - Fully redacts: authorization, cookie, x-api-key, x-auth-token, x-vercel-oidc-token, x-vercel-proxy-signature
   - Partially redacts: cf-connecting-ip, x-forwarded-for, x-real-ip, x-vercel-forwarded-for, x-vercel-proxied-for
   - Preserves non-sensitive headers unchanged

2. `redactOutgoingHeadersSummary(headers: OutgoingHttpHeaders): OutgoingHttpHeaders`
   - Redacts sensitive outgoing response headers
   - Same redaction rules as incoming headers
   - Handles set-cookie (outgoing) in addition to cookie (incoming)

**Redaction Rules**:

- **Full Redaction**: Header value replaced with `"[REDACTED]"` (no information leaked)
- **Partial Redaction**: Shows first 4 and last 4 characters (e.g., `192.168.1.1` → `"192....1.1"`)
  - If value ≤ 8 characters: Replace with `"[PARTIALLY_REDACTED]"`
  - If array: Apply partial redaction to each element
- **Preservation**: All other headers passed through unchanged

**Current Integration**: Used in `correlation/middleware.ts` to log request and response headers with redaction applied.

---

## Test Coverage Requirements

Following TDD principles and testing-strategy.md, implement THREE levels of test coverage:

### 1. Unit Tests (Primary Focus)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/logging/header-redaction.unit.test.ts`

**Test Categories** (minimum 30 test cases):

#### A. Full Redaction Headers (8-10 tests)

- ✅ Authorization header → `"[REDACTED]"`
- ✅ Cookie header → `"[REDACTED]"`
- ✅ Set-Cookie header → `"[REDACTED]"`
- ✅ X-API-Key header → `"[REDACTED]"`
- ✅ X-Auth-Token header → `"[REDACTED]"`
- ✅ X-Vercel-OIDC-Token header → `"[REDACTED]"`
- ✅ X-Vercel-Proxy-Signature header → `"[REDACTED]"`
- ✅ Case insensitivity (e.g., `AUTHORIZATION`, `authorization`, `Authorization` all redacted)

#### B. Partial Redaction Headers (8-10 tests)

- ✅ CF-Connecting-IP with valid IP (>8 chars) → partial redaction `"192....1.1"`
- ✅ X-Forwarded-For with valid IP (>8 chars) → partial redaction
- ✅ X-Real-IP with valid IP (>8 chars) → partial redaction
- ✅ X-Vercel-Forwarded-For with valid IP (>8 chars) → partial redaction
- ✅ X-Vercel-Proxied-For with valid IP (>8 chars) → partial redaction
- ✅ Short value (≤8 chars) → `"[PARTIALLY_REDACTED]"`
- ✅ Array of IPs → each element partially redacted
- ✅ Array with short values → each element `"[PARTIALLY_REDACTED]"`

#### C. Preservation (4-6 tests)

- ✅ Accept header → unchanged
- ✅ Content-Type header → unchanged
- ✅ User-Agent header → unchanged
- ✅ Custom header (e.g., X-Custom-Header) → unchanged
- ✅ Empty headers object → returns empty object

#### D. Edge Cases (8-10 tests)

- ✅ Undefined header value → returns undefined
- ✅ Empty string value → preserved as empty string (unless sensitive)
- ✅ Very long header value → redacted correctly
- ✅ Mixed case header names → redacted correctly
- ✅ Headers with special characters → handled correctly
- ✅ Multiple sensitive headers in same object → all redacted
- ✅ Array with mixed sensitive/non-sensitive → correct selective redaction
- ✅ Null-like values (null, undefined, empty string) → handled gracefully

#### E. Integration with Both Functions (4-6 tests)

- ✅ `redactHeadersSummary` preserves all object properties except values
- ✅ `redactOutgoingHeadersSummary` preserves all object properties except values
- ✅ Both functions handle same header name consistently
- ✅ Both functions handle IncomingHttpHeaders and OutgoingHttpHeaders types correctly

**Test Structure Example**:

```typescript
import { describe, it, expect } from 'vitest';
import { redactHeadersSummary, redactOutgoingHeadersSummary } from './header-redaction.js';
import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http';

describe('header-redaction', () => {
  describe('redactHeadersSummary (incoming headers)', () => {
    describe('full redaction headers', () => {
      it('should fully redact Authorization header', () => {
        const headers: IncomingHttpHeaders = {
          authorization: 'Bearer secret-token-12345',
        };
        const redacted = redactHeadersSummary(headers);
        expect(redacted.authorization).toBe('[REDACTED]');
      });

      // ... more full redaction tests
    });

    describe('partial redaction headers', () => {
      it('should partially redact CF-Connecting-IP header', () => {
        const headers: IncomingHttpHeaders = {
          'cf-connecting-ip': '192.168.1.100',
        };
        const redacted = redactHeadersSummary(headers);
        expect(redacted['cf-connecting-ip']).toBe('192....100');
      });

      // ... more partial redaction tests
    });

    describe('preservation', () => {
      it('should preserve Accept header unchanged', () => {
        const headers: IncomingHttpHeaders = {
          accept: 'application/json',
        };
        const redacted = redactHeadersSummary(headers);
        expect(redacted.accept).toBe('application/json');
      });

      // ... more preservation tests
    });

    describe('edge cases', () => {
      it('should handle undefined header value', () => {
        const headers: IncomingHttpHeaders = {
          'x-custom': undefined,
        };
        const redacted = redactHeadersSummary(headers);
        expect(redacted['x-custom']).toBeUndefined();
      });

      // ... more edge case tests
    });
  });

  describe('redactOutgoingHeadersSummary (outgoing headers)', () => {
    // Mirror structure for outgoing headers
    // Pay special attention to set-cookie (outgoing) vs cookie (incoming)
  });
});
```

### 2. Integration Tests (Secondary Focus)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.integration.test.ts` (add tests to existing file)

**Test Categories** (minimum 8-10 test cases):

#### A. Request Header Logging (4-5 tests)

- ✅ Request with Authorization header → logged as `"[REDACTED]"`
- ✅ Request with Cookie header → logged as `"[REDACTED]"`
- ✅ Request with CF-Connecting-IP → logged with partial redaction
- ✅ Request with mixed sensitive/non-sensitive headers → correct selective redaction
- ✅ Request headers appear in correlation middleware start log

#### B. Response Header Logging (4-5 tests)

- ✅ Response with Set-Cookie header → logged as `"[REDACTED]"`
- ✅ Response with X-Vercel-OIDC-Token → logged as `"[REDACTED]"`
- ✅ Response with mixed sensitive/non-sensitive headers → correct selective redaction
- ✅ Response headers appear in correlation middleware finish log

**Test Structure Example**:

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../application.js';
import { createTestLogger, type CapturedLogEntry } from '../test-helpers/logger.js';

describe('correlation middleware header redaction', () => {
  it('should redact Authorization header in request logs', async () => {
    const { logger, captured } = createTestLogger();
    const app = createApp({ logger });

    await request(app).get('/healthz').set('Authorization', 'Bearer secret-token').expect(200);

    const requestLog = captured.find((entry) => entry.message === 'Request started');
    expect(requestLog?.context?.requestHeaders?.authorization).toBe('[REDACTED]');
  });

  // ... more integration tests
});
```

### 3. End-to-End Tests (Tertiary Focus)

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/header-redaction.e2e.test.ts`

**Test Categories** (minimum 4-6 test cases):

#### A. Full Request/Response Cycle (3-4 tests)

- ✅ E2E: Request with sensitive headers → correlation logs show redaction
- ✅ E2E: Response with sensitive headers → correlation logs show redaction
- ✅ E2E: Round-trip with multiple sensitive headers → all redacted in logs

#### B. Real-World Scenarios (1-2 tests)

- ✅ E2E: Simulated Clerk OAuth request with X-Vercel-OIDC-Token
- ✅ E2E: Simulated production request with full header set

**Test Structure Example**:

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/application.js';
import { createTestLogger } from '../src/test-helpers/logger.js';

describe('Header Redaction E2E', () => {
  it('should redact all sensitive headers in full request/response cycle', async () => {
    const { logger, captured } = createTestLogger();
    const app = createApp({ logger });

    await request(app)
      .get('/healthz')
      .set('Authorization', 'Bearer secret')
      .set('Cookie', 'session=abc123')
      .set('X-API-Key', 'apikey-xyz')
      .set('CF-Connecting-IP', '192.168.1.100')
      .expect(200);

    // Verify request log
    const requestLog = captured.find((entry) => entry.message === 'Request started');
    expect(requestLog?.context?.requestHeaders?.authorization).toBe('[REDACTED]');
    expect(requestLog?.context?.requestHeaders?.cookie).toBe('[REDACTED]');
    expect(requestLog?.context?.requestHeaders?.['x-api-key']).toBe('[REDACTED]');
    expect(requestLog?.context?.requestHeaders?.['cf-connecting-ip']).toBe('192....100');

    // Verify response log
    const responseLog = captured.find((entry) => entry.message === 'Request completed');
    expect(responseLog?.context?.responseHeaders).toBeDefined();
  });
});
```

---

## TDD Workflow

**MANDATORY**: Follow the Red → Green → Refactor cycle per testing-strategy.md

### Phase 1: Red (Write Failing Tests)

1. Create `header-redaction.unit.test.ts`
2. Write all 30+ unit tests (they will fail - module exists but no tests exist yet)
3. Run `pnpm test` to verify tests fail (or pass if module already works correctly)

### Phase 2: Green (Verify Module Works)

1. Run tests again
2. If tests pass: Module already correct, proceed to integration tests
3. If tests fail: Module has bugs, fix them until tests pass
4. Run `pnpm test` repeatedly until all unit tests pass

### Phase 3: Integration (Add Integration Tests)

1. Add 8-10 integration tests to `correlation/middleware.integration.test.ts`
2. Verify tests pass (module should already work via unit test validation)
3. Run `pnpm test:e2e` to verify no regressions

### Phase 4: E2E (Add End-to-End Tests)

1. Create `e2e-tests/header-redaction.e2e.test.ts`
2. Write 4-6 E2E tests
3. Verify tests pass
4. Run full test suite (`pnpm test:all`) to verify no regressions

### Phase 5: Refactor (If Needed)

1. Review module implementation for code smells
2. Extract helper functions if needed (keep functions ≤8 complexity)
3. Verify ALL tests still pass after any refactoring
4. Run full quality gates (`pnpm check`)

---

## Validation Criteria

Before marking this task complete, verify ALL of the following:

### Test Coverage

- ✅ Minimum 30 unit tests in `header-redaction.unit.test.ts`
- ✅ Minimum 8-10 integration tests in `correlation/middleware.integration.test.ts`
- ✅ Minimum 4-6 E2E tests in `e2e-tests/header-redaction.e2e.test.ts`
- ✅ Total new tests: 42-46 minimum

### Test Quality

- ✅ Every sensitive header type has explicit test coverage
- ✅ Both full and partial redaction rules are tested
- ✅ Edge cases (undefined, empty, arrays, long values) are tested
- ✅ Case insensitivity is tested
- ✅ Both incoming and outgoing headers are tested
- ✅ Integration with correlation middleware is tested
- ✅ All tests have descriptive names explaining what they test

### Code Quality

- ✅ No linter errors
- ✅ No type-check errors
- ✅ All tests pass (218 baseline + 42-46 new = ~260-264 total)
- ✅ No regressions in existing tests
- ✅ Test code follows project patterns (imports, naming, structure)

### Quality Gates

- ✅ `pnpm build` passes
- ✅ `pnpm type-check` passes
- ✅ `pnpm lint` passes
- ✅ `pnpm format` passes
- ✅ `pnpm markdownlint` passes
- ✅ `pnpm test` passes (all unit/integration tests)
- ✅ `pnpm test:e2e` passes (all E2E tests)
- ✅ `pnpm test:e2e:built` passes (built server verification)
- ✅ `pnpm test:ui` passes (UI tests, if any)
- ✅ `pnpm smoke:dev:stub` passes (smoke tests)
- ✅ `pnpm check` passes (runs all quality gates)

### Documentation

- ✅ Update `apps/oak-curriculum-mcp-streamable-http/README.md` with header redaction test coverage note
- ✅ Update `.agent/context/context.md` with test completion milestone
- ✅ Update `.agent/context/continuation.prompt.md` historical record
- ✅ No need to update HANDOFF.md (mid-session work, not a major milestone)

---

## Implementation Guidelines

### Type Safety

- ❌ NEVER use: `any`, `as`, `Record<string, unknown>`, `Object.*`, `Reflect.*`
- ✅ ALWAYS use: Specific types from Node.js `http` module (`IncomingHttpHeaders`, `OutgoingHttpHeaders`)
- ✅ ALWAYS treat test inputs as properly typed (IncomingHttpHeaders, OutgoingHttpHeaders)

### Test Structure

- Use `describe` blocks to organize tests by category
- Use descriptive test names: `it('should redact Authorization header to [REDACTED]', ...)`
- One assertion per test (focused, clear failures)
- Use type-safe expect assertions

### Test Helpers

- Use existing `createTestLogger` helper for capturing logs
- Use `supertest` for HTTP testing
- Import types from `node:http` (canonical Node.js types)

### Common Pitfalls to Avoid

1. ❌ Don't test implementation details (internal functions)
2. ❌ Don't mutate header objects in tests (create new objects for each test)
3. ❌ Don't skip tests with `.skip()` (all tests must run and pass)
4. ❌ Don't use magic strings (use constants for "[REDACTED]", "[PARTIALLY_REDACTED]")
5. ❌ Don't test multiple things in one test (focused tests only)

### Example Patterns to Follow

Look at existing test files for patterns:

- `apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.integration.test.ts` - Integration test patterns
- `apps/oak-curriculum-mcp-streamable-http/src/logging/logging.unit.test.ts` - Unit test patterns
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts` - E2E test patterns

---

## Execution Steps

1. **Read all required documentation** (listed at top)
2. **Create unit test file** with 30+ test cases
3. **Run tests** (`pnpm test`) to verify they work
4. **Fix any failures** in the module (if tests expose bugs)
5. **Add integration tests** to existing middleware test file
6. **Create E2E test file** with 4-6 test cases
7. **Run full test suite** (`pnpm test:all`) to verify no regressions
8. **Run quality gates** (`pnpm check`) to ensure all pass
9. **Update documentation** (context.md, continuation.prompt.md, README.md)
10. **Commit changes** with conventional commit message

**Commit Message Example**:

```text
test(streamable-http): add comprehensive header redaction test coverage

- Add 32 unit tests for header-redaction.ts
- Add 10 integration tests to correlation middleware
- Add 6 E2E tests for full request/response cycle
- Verify all sensitive headers (auth, cookies, tokens, IPs) are redacted
- Verify partial redaction for IP addresses
- Verify preservation of non-sensitive headers
- All 48 new tests passing, 266 total tests passing
- Closes security blocker for Session 3.C staging deployment
```

---

## Success Criteria

This task is complete when:

1. ✅ Header redaction module has comprehensive test coverage (unit, integration, E2E)
2. ✅ All quality gates pass with zero regressions
3. ✅ Total test count increases by 42-46 tests minimum
4. ✅ Documentation updated to reflect test completion
5. ✅ Session 3.C staging deployment is unblocked
6. ✅ Security team can confidently deploy knowing sensitive data is protected

---

## Questions to Ask if Stuck

1. "How does the existing correlation middleware integration test pattern work?"
2. "What test helpers are available for capturing logs?"
3. "How do I run a single test file to iterate faster?"
4. "What's the difference between IncomingHttpHeaders and OutgoingHttpHeaders?"
5. "How do I verify header redaction without accessing raw HTTP internals?"

---

## Repository Commands

```bash
# Navigate to repository root
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp

# Run unit tests only
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test

# Run E2E tests only
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e

# Run all test suites
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:all

# Run quality gates
pnpm check

# Run specific test file (fast iteration)
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test src/logging/header-redaction.unit.test.ts
```

---

## Context Restoration Prompt for Fresh Chat

Copy this prompt into a fresh chat to begin work:

```text
I'm implementing comprehensive test coverage for the header redaction module in the Oak MCP Ecosystem. This is a CRITICAL BLOCKER for Session 3.C staging deployment.

Please read these files to understand the context:

@.agent/context/HANDOFF.md
@.agent/context/continuation.prompt.md
@.agent/context/context.md
@.agent/directives/rules.md
@.agent/directives/testing-strategy.md
@.agent/prompts/header-redaction-test-coverage.prompt.md (this file)

Once ready:
1. Confirm understanding of the security-critical nature of this work
2. Review the module under test: @apps/oak-curriculum-mcp-streamable-http/src/logging/header-redaction.ts
3. Review the integration point: @apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.ts
4. Begin TDD workflow: Red → Green → Refactor
5. Create unit test file with 30+ tests
6. Add integration tests to middleware test file
7. Create E2E test file
8. Run full quality gates
9. Update documentation

Let me know when you're ready to begin, and I'll confirm the approach before you start writing tests.
```

---

**Priority**: 🔴 CRITICAL BLOCKER  
**Estimated Effort**: 2-3 hours  
**Dependencies**: None (all prerequisites complete)  
**Blocks**: Session 3.C Staging Deployment  
**Impact**: HIGH - Security critical feature must be proven before production
