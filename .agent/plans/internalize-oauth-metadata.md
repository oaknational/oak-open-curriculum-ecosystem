# Plan: Internalize OAuth Metadata Generation

**Status:** Ready for Implementation  
**Created:** 2024-11-15  
**Revised:** 2024-11-16  
**Priority:** Medium  
**Effort:** ~30 minutes (pure TDD work)

---

## Executive Summary

Remove the `@clerk/mcp-tools` dependency by implementing two simple Express handlers. We only use two functions from this immature package, and we can implement them in ~80 lines of code with full test coverage. This gives us complete control, eliminates supply chain risk, and removes unnecessary complexity (caching we don't want).

**Architectural Principle:** "Could it be simpler?" - Yes. Two files, pure TDD, no premature abstraction.

---

## Problem Statement

### Current State

**Dependency:** `@clerk/mcp-tools@^0.3.1`  
**Usage:** 2 Express handlers in `auth-routes.ts`:

- `protectedResourceHandlerClerk` - Generates RFC 9728 metadata (static JSON)
- `authServerMetadataHandlerClerk` - Proxies Clerk's RFC 8414 metadata

**Issues:**

1. 🔴 **Immature package** - Not production-ready, rapid API changes
2. 🔴 **Supply chain risk** - External dependency we don't control
3. 🔴 **Unwanted caching** - Package caches metadata, we want fresh fetches
4. 🔴 **Minimal value** - These are trivial functions (~80 lines total)

### Desired State

**Zero dependencies** for OAuth metadata generation.

**Two simple functions we control:**

- Generate RFC 9728 metadata (pure data transformation)
- Fetch RFC 8414 metadata from Clerk (simple HTTP proxy)

**Benefits:**

- ✅ No supply chain risk
- ✅ No caching (fresh data every request)
- ✅ Full control over implementation
- ✅ Simpler codebase (less code than before)

---

## Goals

### Primary Goals (Must Have)

1. **Remove Dependency**: Eliminate `@clerk/mcp-tools` from package.json
2. **Maintain Functionality**: OAuth metadata endpoints work identically
3. **No Caching**: Fresh metadata fetches (no TTL, no cache module)
4. **Code Ownership**: Simple, testable code we fully control

### Non-Goals (Explicitly Out of Scope)

- ❌ Adding caching (we want direct fetches)
- ❌ Complex architecture (keep it simple)
- ❌ Performance optimization (not needed)
- ❌ Changing OAuth flow (only replacing handlers)

---

## Architecture Design

### First Question: "Could it be simpler?"

**Answer:** Yes. Two files is sufficient.

### File Structure

```text
apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/
├── oauth-metadata-handlers.ts              # NEW - ~80 lines
└── oauth-metadata-handlers.integration.test.ts  # NEW - ~100 lines
```

**That's it. No folders. No premature abstraction.**

### Design Principles

From `@rules.md`:

- ✅ **TDD**: Write tests FIRST (Red → Green → Refactor)
- ✅ **Keep it simple**: KISS, YAGNI, DRY
- ✅ **Pure functions first**: `deriveFapiUrl` is pure, testable
- ✅ **Fail fast**: Explicit error handling with context
- ✅ **Type safety**: No `any`, `as`, or shortcuts
- ✅ **Inline docs**: JSDoc for all exported functions

From `@testing-strategy.md`:

- ✅ **Test behavior, not implementation**
- ✅ **Integration tests for handlers** (they integrate multiple units)
- ✅ **Simple mocks**: Mock Express req/res and global fetch
- ✅ **No useless tests**: Each test proves something useful

---

## Implementation Plan (TDD)

### Phase 1: Tests First (RED) - 10 minutes

**Create:** `oauth-metadata-handlers.integration.test.ts`

Write failing tests for:

#### `protectedResourceHandler` (3 tests)

1. ✅ Generates RFC 9728 compliant metadata
2. ✅ Uses request protocol and host for resource URL
3. ✅ Throws helpful error if `CLERK_PUBLISHABLE_KEY` missing

#### `authServerMetadataHandler` (4 tests)

1. ✅ Fetches Clerk metadata from correct URL
2. ✅ Sets User-Agent header identifying our app
3. ✅ Has 10-second timeout (uses AbortSignal)
4. ✅ Handles HTTP errors gracefully

**Quality Check:**

```bash
pnpm test oauth-metadata-handlers  # All tests FAIL (RED) ✅
```

---

### Phase 2: Implementation (GREEN) - 15 minutes

**Create:** `oauth-metadata-handlers.ts`

Implement minimal code to make tests pass:

#### Pure Function: `deriveFapiUrl`

```typescript
/**
 * Derives Clerk FAPI URL from publishable key.
 *
 * @param publishableKey - pk_test_* or pk_live_*
 * @returns Clerk FAPI URL
 * @throws Error if key format invalid
 */
function deriveFapiUrl(publishableKey: string): string {
  // Decode base64-encoded domain from key
  // Remove trailing $ character
  // Return https://{domain}
}
```

#### Express Handler: `protectedResourceHandler`

```typescript
/**
 * RFC 9728 Protected Resource Metadata handler.
 *
 * Generates static metadata pointing OAuth clients to Clerk.
 * No caching - metadata is computed from env vars and request.
 */
export function protectedResourceHandler(req: express.Request, res: express.Response): void {
  // Read CLERK_PUBLISHABLE_KEY from env
  // Derive Clerk FAPI URL
  // Build resource URL from request
  // Return RFC 9728 JSON
}
```

#### Express Handler: `authServerMetadataHandler`

```typescript
/**
 * RFC 8414 Authorization Server Metadata handler.
 *
 * Fetches Clerk's OAuth metadata. No caching - proxies every request.
 */
export async function authServerMetadataHandler(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  // Read CLERK_PUBLISHABLE_KEY from env
  // Derive Clerk metadata URL
  // Fetch with timeout and User-Agent
  // Return JSON or call next(error)
}
```

**Quality Check:**

```bash
pnpm test oauth-metadata-handlers  # All tests PASS (GREEN) ✅
```

---

### Phase 3: Refactor - 5 minutes

Improve code quality while keeping tests green:

- Add comprehensive JSDoc comments
- Extract error messages as constants
- Ensure type safety (no `any`, no `as`)
- Format and lint

**Quality Check:**

```bash
pnpm type-check                    # No errors ✅
pnpm lint -- --fix                 # No errors ✅
pnpm test oauth-metadata-handlers  # Still PASS ✅
```

---

### Phase 4: Integration - 5 minutes

#### Step 4.1: Update `auth-routes.ts`

Replace imports:

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
} from './auth/mcp-auth/oauth-metadata-handlers.js';
```

Update usages:

```typescript
// Line 73: protectedResourceHandlerClerk → protectedResourceHandler
// Line 84: authServerMetadataHandlerClerk → authServerMetadataHandler
```

#### Step 4.2: Remove Dependency

```bash
pnpm remove @clerk/mcp-tools
```

#### Step 4.3: Update exports in `index.ts` (if needed)

Ensure new handlers are exported from `auth/mcp-auth/index.ts` if required by other modules.

**Quality Gate:**

```bash
pnpm i                             # Clean install
pnpm type-gen                      # Regenerate types
pnpm build                         # Build succeeds
pnpm type-check                    # No type errors
pnpm lint -- --fix                 # No lint errors
pnpm format                        # Format code
pnpm markdownlint                  # Markdown lint
pnpm test                          # All tests pass
pnpm test:e2e                      # E2E tests pass
```

---

## Acceptance Criteria

### Functional Requirements (Must Pass)

- [ ] `protectedResourceHandler` generates RFC 9728 compliant JSON
- [ ] Handler reads `CLERK_PUBLISHABLE_KEY` from environment
- [ ] Handler derives correct Clerk FAPI URL from key
- [ ] Handler builds resource URL from request (protocol + host)
- [ ] Handler includes `scopes_supported: ['mcp:invoke', 'mcp:read']`
- [ ] Handler throws helpful error if env var missing
- [ ] `authServerMetadataHandler` fetches from Clerk's `/.well-known/openid-configuration`
- [ ] Handler sets `User-Agent: @oaknational/oak-curriculum-mcp-streamable-http`
- [ ] Handler has 10-second timeout via `AbortSignal`
- [ ] Handler calls `next(error)` on failures (proper Express error handling)
- [ ] No caching - every request fetches fresh metadata

### Non-Functional Requirements (Must Pass)

- [ ] `@clerk/mcp-tools` completely removed from `package.json`
- [ ] No runtime errors when starting server
- [ ] OAuth discovery flow works end-to-end
- [ ] All quality gate commands pass
- [ ] Test coverage ≥ 95% for new code
- [ ] All functions have JSDoc documentation
- [ ] All types explicit (no `any`, `as`, `!`, etc.)
- [ ] Total LOC < 200 lines (implementation + tests)

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

## Definition of Done

### Code Complete When:

1. ✅ Two files created (`oauth-metadata-handlers.ts` and `.integration.test.ts`)
2. ✅ 7 tests written and passing
3. ✅ All functions have JSDoc documentation
4. ✅ `auth-routes.ts` updated to use new handlers
5. ✅ `@clerk/mcp-tools` removed from `package.json`
6. ✅ All quality gates pass

### Functionality Proven When:

1. ✅ Unit/integration tests pass (7 tests)
2. ✅ E2E tests pass (existing OAuth tests)
3. ✅ Manual smoke test successful:

   ```bash
   # Start server
   pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev

   # Test protected resource metadata
   curl http://localhost:3333/.well-known/oauth-protected-resource | jq
   # Expected: RFC 9728 JSON with authorization_servers array

   # Test auth server metadata
   curl http://localhost:3333/.well-known/oauth-authorization-server | jq
   # Expected: RFC 8414 JSON from Clerk
   ```

### Ready to Ship When:

1. ✅ All acceptance criteria met
2. ✅ All quality gates passed
3. ✅ Manual smoke test successful
4. ✅ No regression in existing E2E tests
5. ✅ Code reviewed (if required)

---

## Validation Strategy

### Test Strategy

**Integration Tests** (`.integration.test.ts`) - 7 tests total:

- Mock Express `req`/`res` objects
- Mock global `fetch` for HTTP calls
- Test behavior at handler level
- Verify error handling

**E2E Tests** (existing) - 0 new tests needed:

- `auth-enforcement.e2e.test.ts` already validates OAuth flow
- `web-security-selective.e2e.test.ts` already validates metadata endpoints
- No new E2E tests required (functionality unchanged)

### Manual Validation Checklist

**Before Starting:**

1. [ ] Verify current implementation works:
   ```bash
   curl http://localhost:3333/.well-known/oauth-protected-resource
   curl http://localhost:3333/.well-known/oauth-authorization-server
   ```
2. [ ] Save current responses for comparison

**After Implementation:**

1. [ ] Start dev server: `pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev`
2. [ ] Test protected resource endpoint - response matches original
3. [ ] Test auth server endpoint - response matches original
4. [ ] Check logs - User-Agent appears in requests
5. [ ] Test error case - remove `CLERK_PUBLISHABLE_KEY`, expect 500 with helpful message
6. [ ] Verify no `@clerk/mcp-tools` in `node_modules`

### Quality Gate Execution

Run full quality gate sequence:

```bash
#!/bin/bash
# From repository root

echo "=== OAuth Metadata Internalization Quality Gate ==="

echo "1. Clean install..."
pnpm i || exit 1

echo "2. Type generation..."
pnpm type-gen || exit 1

echo "3. Build..."
pnpm build || exit 1

echo "4. Type check..."
pnpm type-check || exit 1

echo "5. Lint..."
pnpm lint -- --fix || exit 1

echo "6. SDK docs..."
pnpm -F @oaknational/oak-curriculum-sdk docs:all || exit 1

echo "7. Format..."
pnpm format || exit 1

echo "8. Markdown lint..."
pnpm markdownlint || exit 1

echo "9. Unit tests..."
pnpm test || exit 1

echo "10. E2E tests..."
pnpm test:e2e || exit 1

echo "✅ All quality gates passed!"
```

---

## Rollback Strategy

### If Issues Arise

**Immediate Rollback (< 2 minutes):**

```bash
# 1. Revert all changes
git checkout HEAD -- apps/oak-curriculum-mcp-streamable-http/src/

# 2. Reinstall dependency
pnpm add @clerk/mcp-tools@^0.3.1

# 3. Verify
pnpm i && pnpm build && pnpm test
```

### Prevention

- Small, focused change (2 files only)
- Tests written first (TDD)
- Quality gates after each phase
- No changes to existing auth middleware
- OAuth E2E tests catch regressions

---

## Risk Assessment

### Risks: MINIMAL ⭐

| Risk                      | Probability | Impact | Mitigation                       |
| ------------------------- | ----------- | ------ | -------------------------------- |
| Breaking OAuth flow       | Very Low    | High   | E2E tests catch this immediately |
| Incorrect metadata format | Very Low    | Medium | RFC compliance tests             |
| Missing env var handling  | Very Low    | Low    | Explicit tests for this          |
| Type errors               | Very Low    | Low    | Strict TypeScript                |

### Why Very Low Risk?

1. ✅ **Trivial logic**: Just data transformation and HTTP proxy
2. ✅ **Well-defined RFCs**: RFC 9728 and RFC 8414 are clear specs
3. ✅ **TDD approach**: Tests prove correctness before shipping
4. ✅ **No auth changes**: Existing middleware untouched
5. ✅ **Easy rollback**: Single git revert + pnpm add

---

## Timeline Estimate

### TDD Development

- **Phase 1** (Tests First): 10 minutes
  - Write 7 failing integration tests
  - Verify they fail (RED)

- **Phase 2** (Implementation): 15 minutes
  - Implement 3 functions (~80 lines)
  - Make all tests pass (GREEN)

- **Phase 3** (Refactor): 5 minutes
  - Add JSDoc
  - Improve error messages
  - Run quality checks (GREEN)

- **Phase 4** (Integration): 5 minutes
  - Update imports in `auth-routes.ts`
  - Remove dependency
  - Run full quality gate

**Total Estimated Time: 35 minutes**

### No Buffer Needed

This is simple work with clear steps. 35 minutes is realistic.

---

## Success Metrics

### Code Quality

- ✅ Test coverage ≥ 95% for new code
- ✅ Zero linter errors
- ✅ Zero type errors
- ✅ JSDoc on all exported functions
- ✅ LOC < 200 (simpler than original package)

### Functionality

- ✅ OAuth metadata endpoints return identical responses
- ✅ User-Agent header identifies our application
- ✅ Timeout protection prevents hangs
- ✅ Error messages are helpful and actionable

### Maintainability

- ✅ Code is self-documenting
- ✅ No external dependency
- ✅ Tests serve as living documentation
- ✅ Easy to modify in future

---

## Notes for Implementation

### TDD Workflow (CRITICAL)

**For EACH function:**

```text
1. RED:   Write test(s) first → Run → Confirm they FAIL
2. GREEN: Write minimal code to make tests PASS
3. REFACTOR: Improve code quality while keeping tests GREEN
```

**Never write code before tests.**

### Type Safety

From `@rules.md`:

- Use `readonly` for all data structures
- Never use `any`, `as`, `!`, `Record<string, unknown>`
- Import types with `type` keyword: `import type { Request } from 'express'`
- Let TypeScript infer where possible

### Error Messages

All errors must be:

- **Specific**: Include the failing value
- **Actionable**: Tell user what to do
- **Helpful**: Link to docs if appropriate

Example:

```typescript
throw new Error(
  `CLERK_PUBLISHABLE_KEY environment variable is required. ` +
    `See: https://clerk.com/docs/references/backend/overview#publishable-key`,
);
```

### Documentation

Every exported function needs JSDoc:

````typescript
/**
 * One-line description.
 *
 * Longer explanation if needed. Mention RFC compliance.
 *
 * @param name - Description
 * @returns Description
 * @throws Error description
 *
 * @example
 * ```typescript
 * const url = deriveFapiUrl('pk_test_xyz');
 * // Returns: 'https://clerk.domain'
 * ```
 */
````

---

## References

### Standards

- [RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728) - OAuth 2.0 Protected Resource Metadata
- [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414) - OAuth 2.0 Authorization Server Metadata

### Project Standards

- `.agent/directives-and-memory/rules.md` - Code quality rules
- `docs/agent-guidance/testing-strategy.md` - Testing approach
- `.agent/experience/2025-11-16-execution-vs-architecture.md` - "Could it be simpler?" principle

### Clerk Documentation

- [Publishable Keys](https://clerk.com/docs/references/backend/overview#publishable-key)
- [OAuth Configuration](https://clerk.com/docs/authentication/social-connections/oauth)

---

## Architectural Lessons Applied

### From Recent Experience

**The First Question:** "Could it be simpler?"

- ✅ Yes - 2 files instead of 13
- ✅ Yes - no caching (we don't want it)
- ✅ Yes - flat structure (no premature folders)

**Show the Thinking:**

- This plan explicitly states WHY we chose 2 files
- It explains WHAT we're optimizing for (simplicity)
- It shows HOW this aligns with principles

**Test Pyramid Discipline:**

- Pure function → tested through handlers
- Handlers → integration tests (they integrate units)
- Full flow → existing E2E tests (no new tests needed)

---

## Approval Checklist

### Before Starting

- [ ] Plan reviewed and approved
- [ ] Goals clearly understood (no caching, remove dependency)
- [ ] Architecture validated (2 files is sufficient)
- [ ] TDD approach confirmed
- [ ] Time estimate reasonable (35 minutes)

### After Completion

- [ ] All acceptance criteria met
- [ ] All quality gates passed
- [ ] Manual smoke test successful
- [ ] No regressions in E2E tests
- [ ] Ready to merge

---

**END OF PLAN**

**Remember:** Simplicity is a feature, not a limitation. Two files. Zero caching. Full control.
