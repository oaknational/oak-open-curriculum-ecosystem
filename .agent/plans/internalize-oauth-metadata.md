# Plan: Internalize OAuth Metadata Generation

**Status:** Draft  
**Created:** 2024-11-15  
**Priority:** Medium  
**Effort:** ~1-2 hours (pure TDD work)

---

## Executive Summary

Remove the `@clerk/mcp-tools` dependency by internalizing OAuth metadata generation functionality. We only use two functions from this package (`protectedResourceHandlerClerk` and `authServerMetadataHandlerClerk`), and we've already fixed their bugs and internalized the authentication middleware. This completes the internalization work, giving us full control, better quality, and eliminating an external dependency.

---

## Intentions

### Primary Goals

1. **Remove External Dependency**: Eliminate `@clerk/mcp-tools` from our codebase
2. **Fix Known Issues**: Resolve User-Agent and caching problems in the upstream library
3. **Maintain Quality**: Use TDD to ensure correctness of all new code
4. **Improve Performance**: Add intelligent caching for OAuth metadata (1-hour TTL)
5. **Follow Best Practices**: Align with @rules.md and @testing-strategy.md principles

### Secondary Goals

1. **Educational Value**: Demonstrate pure function TDD workflow
2. **Code Ownership**: Understand and control all OAuth flows
3. **Documentation**: Comprehensive inline docs for future maintainers

---

## Current State Analysis

### What We Use from `@clerk/mcp-tools`

Located in `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`:

```typescript
import {
  protectedResourceHandlerClerk, // Line 5
  authServerMetadataHandlerClerk, // Line 6
} from '@clerk/mcp-tools/express';
```

**Usage:**

1. **`protectedResourceHandlerClerk`** (line 73-76) - Generates RFC 9728 Protected Resource Metadata
2. **`authServerMetadataHandlerClerk`** (line 84) - Fetches RFC 8414 Authorization Server Metadata from Clerk

### What We've Already Internalized

In `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/`:

- ✅ `mcpAuth()` - Generic OAuth middleware
- ✅ `mcpAuthClerk()` - Clerk-specific OAuth middleware
- ✅ `getPRMUrl()` - Fixed URL generation (fixing their bug)
- ✅ `verifyClerkToken()` - Pure token verification function
- ✅ **Full unit test coverage** for all the above

### Known Issues in `@clerk/mcp-tools`

1. **Missing User-Agent**: `fetchClerkAuthorizationServerMetadata` uses Node's default User-Agent (`node`) instead of identifying the library
2. **No Caching**: Fetches OAuth metadata on every request (wasteful)
3. **No Error Handling**: No timeout, no HTTP status checking, no retry logic
4. **No Validation**: Doesn't validate response content-type or structure

---

## Desired Impact

### Immediate Benefits

1. ✅ **Dependency Reduction**: One fewer package to maintain/audit
2. ✅ **Bug Fixes**: Proper User-Agent, error handling, timeouts
3. ✅ **Performance**: 1-hour metadata cache (OAuth metadata rarely changes)
4. ✅ **Code Quality**: TDD-driven, fully tested pure functions

### Long-term Benefits

1. ✅ **Maintainability**: Code we understand and control
2. ✅ **Flexibility**: Easy to customize for our needs
3. ✅ **Security**: No supply chain risk from this dependency
4. ✅ **Standards Compliance**: Direct RFC implementation we can verify

---

## Architecture Design

### File Structure

```text
apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/
├── index.ts                                    # Existing - public API
├── mcp-auth.ts                                 # Existing
├── mcp-auth-clerk.ts                           # Existing
├── get-prm-url.ts                              # Existing
├── types.ts                                    # Existing
├── verify-clerk-token.ts                       # Existing
├── *.unit.test.ts                              # Existing tests
│
└── metadata/                                   # NEW FOLDER
    ├── index.ts                                # Public API
    │
    ├── core/                                   # Pure functions
    │   ├── derive-fapi-url.ts                  # NEW - Pure function
    │   ├── derive-fapi-url.unit.test.ts        # NEW - Tests FIRST
    │   ├── generate-protected-resource-metadata.ts  # NEW - Pure function
    │   ├── generate-protected-resource-metadata.unit.test.ts  # NEW - Tests FIRST
    │   └── index.ts                            # Exports
    │
    ├── fetch/                                  # IO functions
    │   ├── fetch-authorization-server-metadata.ts  # NEW - With caching
    │   ├── fetch-authorization-server-metadata.integration.test.ts  # NEW - Mocked tests
    │   ├── metadata-cache.ts                   # NEW - Simple in-memory cache
    │   ├── metadata-cache.unit.test.ts         # NEW - Tests FIRST
    │   └── index.ts                            # Exports
    │
    ├── handlers/                               # Express handlers
    │   ├── protected-resource-handler.ts       # NEW - Express handler
    │   ├── protected-resource-handler.unit.test.ts  # NEW - Tests FIRST
    │   ├── auth-server-metadata-handler.ts     # NEW - Express handler
    │   ├── auth-server-metadata-handler.unit.test.ts  # NEW - Tests FIRST
    │   └── index.ts                            # Exports
    │
    └── types/                                  # Type definitions
        ├── protected-resource-metadata.ts      # NEW - RFC 9728 types
        ├── authorization-server-metadata.ts    # NEW - RFC 8414 types
        └── index.ts                            # Exports
```

### Design Principles

Following @rules.md:

1. **TDD**: Write tests FIRST (Red → Green → Refactor)
2. **Pure Functions First**: All core logic is pure, testable functions
3. **Clear Boundaries**: Each folder has explicit public API via index.ts
4. **Fail Fast**: Explicit error handling with helpful messages
5. **Type Safety**: No `any`, `as`, or type shortcuts
6. **Inline Documentation**: Full JSDoc for all functions

---

## Implementation Plan

### Phase 1: Pure Functions (Core Logic)

**Goal**: Implement RFC-compliant metadata generation with zero I/O

#### Step 1.1: `derive-fapi-url` (TDD)

**Test First** (`derive-fapi-url.unit.test.ts`):

```typescript
- Test valid pk_test_ key decoding
- Test valid pk_live_ key decoding
- Test invalid key format throws error
- Test empty key throws error
- Test malformed base64 throws error
```

**Implementation** (`derive-fapi-url.ts`):

- Pure function: `publishableKey: string → URL: string`
- Decodes base64 Clerk domain from publishable key
- Removes trailing `$` character
- Returns `https://{domain}`

#### Step 1.2: `generate-protected-resource-metadata` (TDD)

**Test First** (`generate-protected-resource-metadata.unit.test.ts`):

```typescript
- Test RFC 9728 compliant structure
- Test all required fields present
- Test custom properties merge correctly
- Test URL formatting
```

**Implementation** (`generate-protected-resource-metadata.ts`):

- Pure function: `(authServerUrl, resourceUrl, properties?) → Metadata`
- Returns RFC 9728 compliant metadata object
- Merges custom properties (e.g., scopes_supported)

#### Step 1.3: `metadata-cache` (TDD)

**Test First** (`metadata-cache.unit.test.ts`):

```typescript
- Test cache miss returns undefined
- Test cache hit returns cached value
- Test cache expiry after TTL
- Test cache clear removes all entries
- Test different keys don't collide
```

**Implementation** (`metadata-cache.ts`):

- Pure data structure: Map-based cache with TTL
- `get(key): value | undefined`
- `set(key, value, ttl?): void`
- `clear(): void`
- Default TTL: 1 hour (3600000ms)

**Quality Gate After Phase 1:**

```bash
pnpm test                          # All tests pass
pnpm type-check                    # No type errors
pnpm lint -- --fix                 # No lint errors
```

---

### Phase 2: Fetch Functions (I/O with Mocks)

**Goal**: Implement OAuth metadata fetching with proper error handling and caching

#### Step 2.1: `fetch-authorization-server-metadata` (TDD with Mocks)

**Test First** (`fetch-authorization-server-metadata.integration.test.ts`):

```typescript
- Mock global fetch
- Test successful fetch returns metadata
- Test sets correct User-Agent header
- Test adds Accept: application/json header
- Test caching prevents duplicate fetches
- Test HTTP 404 throws helpful error
- Test HTTP 500 throws helpful error
- Test timeout after 10 seconds
- Test invalid content-type throws error
- Test malformed JSON throws error
- Test cache expiry causes refetch
```

**Implementation** (`fetch-authorization-server-metadata.ts`):

```typescript
- Async function with proper error handling
- Sets User-Agent: @oaknational/oak-curriculum-mcp-streamable-http@{version}
- Sets Accept: application/json
- 10-second timeout using AbortController
- Validates HTTP status (res.ok)
- Validates content-type is application/json
- Uses metadata-cache for 1-hour caching
- Throws detailed errors with context
```

**Quality Gate After Phase 2:**

```bash
pnpm test                          # All tests pass
pnpm type-check                    # No type errors
pnpm lint -- --fix                 # No lint errors
```

---

### Phase 3: Express Handlers

**Goal**: Create Express route handlers that use the pure functions

#### Step 3.1: `protected-resource-handler` (TDD)

**Test First** (`protected-resource-handler.unit.test.ts`):

```typescript
- Mock Express req/res objects
- Test handler generates correct metadata
- Test derives FAPI URL from env var
- Test uses request protocol and host
- Test merges custom properties
- Test throws on missing CLERK_PUBLISHABLE_KEY
- Test response is JSON
```

**Implementation** (`protected-resource-handler.ts`):

```typescript
- Express RequestHandler
- Reads CLERK_PUBLISHABLE_KEY from env
- Derives authServerUrl via deriveFapiUrl
- Gets resourceUrl from req (protocol + host + path)
- Calls generateProtectedResourceMetadata
- Returns JSON response
```

#### Step 3.2: `auth-server-metadata-handler` (TDD)

**Test First** (`auth-server-metadata-handler.unit.test.ts`):

```typescript
- Mock Express req/res objects
- Mock fetch (via fetchAuthorizationServerMetadata)
- Test handler fetches and returns metadata
- Test derives FAPI URL from env var
- Test throws on missing CLERK_PUBLISHABLE_KEY
- Test response is JSON
- Test caching works across requests
```

**Implementation** (`auth-server-metadata-handler.ts`):

```typescript
- Express RequestHandler
- Reads CLERK_PUBLISHABLE_KEY from env
- Derives fapiUrl via deriveFapiUrl
- Calls fetchAuthorizationServerMetadata
- Returns JSON response
```

**Quality Gate After Phase 3:**

```bash
pnpm test                          # All tests pass
pnpm type-check                    # No type errors
pnpm lint -- --fix                 # No lint errors
```

---

### Phase 4: Integration & Cleanup

**Goal**: Replace imports and remove dependency

#### Step 4.1: Update `auth-routes.ts`

**Changes:**

```typescript
// BEFORE:
import {
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk,
} from '@clerk/mcp-tools/express';

// AFTER:
import {
  protectedResourceHandler,
  authServerMetadataHandler,
} from './auth/mcp-auth/metadata/index.js';
```

**Update usages:**

```typescript
// Line 73: protectedResourceHandlerClerk → protectedResourceHandler
// Line 84: authServerMetadataHandlerClerk → authServerMetadataHandler
```

#### Step 4.2: Remove Dependency

```bash
pnpm remove @clerk/mcp-tools
```

**Quality Gate After Phase 4:**

```bash
pnpm i                             # Clean install
pnpm type-gen                      # Regenerate types
pnpm build                         # Build succeeds
pnpm type-check                    # No type errors
pnpm lint -- --fix                 # No lint errors
pnpm format                        # Format check
pnpm markdownlint                  # Markdown lint
pnpm test                          # All tests pass
pnpm test:e2e                      # E2E tests pass
```

---

## Acceptance Criteria

### Functional Requirements

- [ ] All new pure functions have unit tests (written first)
- [ ] All fetch functions have integration tests with mocks
- [ ] All Express handlers have unit tests with mocked dependencies
- [ ] OAuth metadata generation follows RFC 9728 exactly
- [ ] Authorization server metadata fetch follows RFC 8414
- [ ] Metadata caching reduces network calls (1-hour TTL)
- [ ] User-Agent header identifies our application
- [ ] Timeouts prevent hanging requests (10 seconds)
- [ ] HTTP errors produce helpful error messages
- [ ] Missing env vars produce clear errors

### Non-Functional Requirements

- [ ] `@clerk/mcp-tools` completely removed from package.json
- [ ] No runtime errors when starting the server
- [ ] OAuth flow still works end-to-end
- [ ] All quality gate commands pass
- [ ] Test coverage ≥ 95% for new code
- [ ] All functions have JSDoc documentation
- [ ] All types are explicit (no `any`, `as`, etc.)
- [ ] Code follows TDD: tests written first

### Quality Gates (Must Pass in Order)

1. [ ] `pnpm i` - Clean install succeeds
2. [ ] `pnpm type-gen` - Type generation succeeds
3. [ ] `pnpm build` - Build succeeds
4. [ ] `pnpm type-check` - No type errors
5. [ ] `pnpm lint -- --fix` - No lint errors
6. [ ] `pnpm -F @oaknational/oak-curriculum-sdk docs:all` - Docs generate
7. [ ] `pnpm format` - Formatting correct
8. [ ] `pnpm markdownlint` - Markdown lint passes
9. [ ] `pnpm test` - All unit/integration tests pass
10. [ ] `pnpm test:e2e` - All E2E tests pass

---

## Validation Strategy

### Unit Test Validation

**Pure Functions (No I/O):**

- `derive-fapi-url`: 5 test cases minimum
- `generate-protected-resource-metadata`: 4 test cases minimum
- `metadata-cache`: 5 test cases minimum

**Integration Tests (Mocked I/O):**

- `fetch-authorization-server-metadata`: 10 test cases minimum
- `protected-resource-handler`: 7 test cases minimum
- `auth-server-metadata-handler`: 6 test cases minimum

### End-to-End Validation

**Smoke Test Checklist:**

1. [ ] Start dev server with auth enabled
2. [ ] Hit `/.well-known/oauth-protected-resource` → 200 OK, valid JSON
3. [ ] Hit `/.well-known/oauth-authorization-server` → 200 OK, valid JSON
4. [ ] Verify User-Agent in logs shows our app name
5. [ ] Hit metadata endpoint twice → verify only 1 fetch call (caching works)
6. [ ] Verify OAuth flow completes successfully with real Clerk credentials

### Quality Gate Validation

Run full quality gate after each phase AND at the end:

```bash
#!/bin/bash
# quality-gate.sh

set -e

echo "=== Quality Gate ==="
echo "1. Clean install..."
pnpm i

echo "2. Type generation..."
pnpm type-gen

echo "3. Build..."
pnpm build

echo "4. Type check..."
pnpm type-check

echo "5. Lint..."
pnpm lint -- --fix

echo "6. SDK docs..."
pnpm -F @oaknational/oak-curriculum-sdk docs:all

echo "7. Format..."
pnpm format

echo "8. Markdown lint..."
pnpm markdownlint

echo "9. Unit tests..."
pnpm test

echo "10. E2E tests..."
pnpm test:e2e

echo "✅ All quality gates passed!"
```

---

## Rollback Strategy

### If Issues Arise

**Immediate Rollback:**

```bash
# 1. Revert auth-routes.ts changes
git checkout HEAD -- apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts

# 2. Reinstall @clerk/mcp-tools
pnpm add @clerk/mcp-tools@^0.3.1

# 3. Remove new metadata folder
rm -rf apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/metadata

# 4. Run quality gate
pnpm i && pnpm build && pnpm test
```

**Prevention:**

- Each phase has quality gate checkpoint
- Tests written first ensure correctness
- No changes to existing auth middleware (already working)
- New code is isolated in `metadata/` folder

---

## Risk Assessment

### Risks: MINIMAL ⭐

| Risk                   | Probability | Impact | Mitigation                           |
| ---------------------- | ----------- | ------ | ------------------------------------ |
| Breaking OAuth flow    | Low         | High   | Full E2E tests, gradual rollout      |
| Type errors            | Very Low    | Low    | Strict TypeScript, no shortcuts      |
| Cache bugs             | Low         | Medium | Unit tests for cache, TTL validation |
| Metadata format errors | Very Low    | Medium | RFC compliance tests, validation     |
| Missing dependencies   | Very Low    | Low    | Explicit error messages              |

### Why Low Risk?

1. ✅ **Simple Logic**: Just data transformation and HTTP
2. ✅ **Well-Defined Standards**: RFC 9728 and RFC 8414 are clear
3. ✅ **Comprehensive Tests**: TDD ensures correctness
4. ✅ **No Breaking Changes**: Existing auth middleware unchanged
5. ✅ **Easy Rollback**: Can revert in < 2 minutes

---

## Success Metrics

### Code Quality Metrics

- [ ] Test coverage ≥ 95% for new code
- [ ] Zero linter errors
- [ ] Zero type errors
- [ ] All functions documented with JSDoc
- [ ] All tests pass consistently

### Performance Metrics

- [ ] OAuth metadata cached (1-hour TTL)
- [ ] Network calls reduced by ~99% (due to caching)
- [ ] No increase in response time
- [ ] Timeout protection prevents hangs

### Maintainability Metrics

- [ ] Code is self-documenting via types and docs
- [ ] Pure functions are easy to reason about
- [ ] Tests serve as living documentation
- [ ] No external dependency on `@clerk/mcp-tools`

---

## Timeline Estimate

### Development (TDD)

- **Phase 1** (Pure Functions): 30 minutes
  - Write 14 tests
  - Implement 3 pure functions
  - Run quality gate

- **Phase 2** (Fetch Functions): 30 minutes
  - Write 10 mocked integration tests
  - Implement fetch with caching
  - Run quality gate

- **Phase 3** (Express Handlers): 20 minutes
  - Write 13 tests
  - Implement 2 handlers
  - Run quality gate

- **Phase 4** (Integration & Cleanup): 10 minutes
  - Update imports
  - Remove dependency
  - Run full quality gate

**Total Estimated Time: 90 minutes**

### Buffer: 30 minutes for unexpected issues

**Total with Buffer: 2 hours**

---

## Notes for Implementation

### TDD Workflow (CRITICAL)

For each function, follow this exact workflow:

```text
1. RED:   Write test(s) first → Run → Confirm they FAIL
2. GREEN: Write minimal code to make tests PASS
3. REFACTOR: Improve code while keeping tests GREEN
4. QUALITY GATE: Run full suite after each function
```

**Never write code before tests!**

### Type Safety

- Use `readonly` for all data structures
- Use `as const` for literal values
- Never use `any`, `as`, `!`, `Record<string, unknown>`
- Import types with `type` keyword: `import type { ... }`

### Error Messages

All errors should be:

- **Specific**: Include the failing value/context
- **Actionable**: Tell user what to do
- **Helpful**: Link to docs or RFCs when appropriate

Example:

```typescript
throw new Error(
  `Invalid Clerk publishable key format. Expected pk_test_* or pk_live_*, got: ${key}. ` +
    `See: https://clerk.com/docs/references/backend/overview#publishable-key`,
);
```

### Documentation

Every function needs:

````typescript
/**
 * Brief one-line description.
 *
 * Longer explanation if needed. Mention RFC compliance.
 *
 * @param paramName - Description
 * @returns Description
 * @throws Error description and when
 *
 * @example
 * ```typescript
 * const result = myFunction('input');
 * // Returns: expected output
 * ```
 */
````

---

## References

### RFCs

- [RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728) - OAuth 2.0 Protected Resource Metadata
- [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414) - OAuth 2.0 Authorization Server Metadata

### Project Standards

- `.agent/directives-and-memory/rules.md` - Code quality rules
- `docs/agent-guidance/testing-strategy.md` - Testing approach
- Existing `auth/mcp-auth/` code - Reference implementation

### Clerk Documentation

- [Clerk Publishable Keys](https://clerk.com/docs/references/backend/overview#publishable-key)
- [Clerk OAuth](https://clerk.com/docs/authentication/social-connections/oauth)

---

## Approval Checklist

Before starting implementation:

- [ ] Plan reviewed and approved
- [ ] Architecture design validated
- [ ] Test strategy confirmed
- [ ] Quality gate process understood
- [ ] Rollback strategy documented
- [ ] Time estimate reasonable

After implementation:

- [ ] All acceptance criteria met
- [ ] All quality gates passed
- [ ] E2E validation successful
- [ ] Documentation complete
- [ ] Code reviewed (if applicable)

---

**END OF PLAN**
