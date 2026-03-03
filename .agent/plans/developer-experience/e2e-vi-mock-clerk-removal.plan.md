---
name: "Remove vi.mock('@clerk/express') from E2E tests"
overview: "Eliminate all vi.mock usage in streamable-http E2E tests by leveraging existing DI (dangerouslyDisableAuth) and adding a small DI seam for Clerk middleware injection. Fixes ADR-078 violations and removes a source of intermittent test coupling."
todos:
  - id: tier-1-remove-redundant
    content: "Tier 1: Remove redundant vi.mock from 4 files that already use dangerouslyDisableAuth: true."
    status: pending
  - id: tier-2-di-seam
    content: "Tier 2: Add clerkMiddlewareFactory DI seam to CreateAppOptions and setupGlobalAuthContext."
    status: pending
  - id: tier-2-update-tests
    content: "Tier 2: Update 7 auth-enabled test files to inject no-op middleware via DI instead of vi.mock."
    status: pending
  - id: tier-2-mcp-tools-mock
    content: "Tier 2: Investigate and remove vi.mock('@clerk/mcp-tools/server') from 2 files (server, header-redaction)."
    status: pending
  - id: verify
    content: "Run full E2E suite and quality gates to confirm zero regressions."
    status: pending
---

# Remove vi.mock('@clerk/express') from E2E tests

**Created**: 2026-03-03
**Status**: PENDING
**Scope**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`
**Prerequisite**: None — self-contained within one workspace.

---

## Problem

11 of 23 E2E test files in the streamable-http app use `vi.mock('@clerk/express')` —
module-level global state manipulation that violates ADR-078 and the testing strategy.
2 files also mock `@clerk/mcp-tools/server`.

This caused intermittent test coupling failures (investigated 2026-03-03, see napkin
session 2026-03-03f). The immediate failures were resolved by deleting redundant tests
and removing `singleFork: true`, but the `vi.mock` violations remain as tech debt.

---

## Inventory

### Tier 1 — Redundant mocks (mock + `dangerouslyDisableAuth: true`)

These files disable auth via DI, so the mock is dead code — `setupGlobalAuthContext`
returns early without ever calling `clerkMiddleware`.

| File | Mock |
|------|------|
| `string-args-normalisation.e2e.test.ts` | `@clerk/express` |
| `tool-call-success.e2e.test.ts` | `@clerk/express` |
| `enum-validation-failure.e2e.test.ts` | `@clerk/express` |
| `validation-failure.e2e.test.ts` | `@clerk/express` |

**Fix**: Delete the `vi.mock` block and remove `vi` from the vitest import if unused.

### Tier 2 — Auth-enabled tests (mock is currently necessary)

These files test with auth *enabled* (`dangerouslyDisableAuth` is `false` or absent).
`setupGlobalAuthContext` hard-imports `clerkMiddleware` from `@clerk/express`, which
would make network calls to Clerk without the mock.

| File | `@clerk/express` | `@clerk/mcp-tools/server` | Notes |
|------|:-:|:-:|-------|
| `server.e2e.test.ts` | ✓ | ✓ | Mixed: some tests auth-enabled, some bypassed |
| `header-redaction.e2e.test.ts` | ✓ | ✓ | Mixed |
| `auth-enforcement.e2e.test.ts` | ✓ | | All auth-enabled |
| `public-resource-auth-bypass.e2e.test.ts` | ✓ | | All auth-enabled |
| `web-security-selective.e2e.test.ts` | ✓ | | All auth-enabled, `dangerouslyDisableAuth: false` |
| `application-routing.e2e.test.ts` | ✓ | | Mixed |
| `mcp-connection-timeout.e2e.test.ts` | ✓ | | No auth bypass at all |

**Fix**: Add a DI seam to product code so tests can inject a no-op middleware.

---

## Implementation

### Tier 1: Remove redundant mocks (~5 min)

For each of the 4 files:

1. Delete the `vi.mock('@clerk/express', ...)` block.
2. Remove `vi` from the vitest import if no longer used.
3. Run the individual test file to confirm it passes.

### Tier 2: DI seam for Clerk middleware (~30 min)

#### Step 1: Product code change

Add an optional `clerkMiddlewareFactory` to `CreateAppOptions`:

```typescript
// In application.ts / CreateAppOptions
readonly clerkMiddlewareFactory?: () => RequestHandler;
```

Thread it through `createApp` → `setupGlobalAuthContext`. When provided, use it
instead of importing `clerkMiddleware` from `@clerk/express`. When absent (production),
use the real import as today.

The same pattern applies to `@clerk/mcp-tools/server` if the existing
`upstreamMetadata` injection point on `setupOAuthAndCaching` is insufficient.
Check whether the 2 files that mock `@clerk/mcp-tools/server` could instead
use `upstreamMetadata` injection (already supported by `CreateAppOptions`).

#### Step 2: Update test files

For each of the 7 files:

1. Delete the `vi.mock('@clerk/express', ...)` block.
2. Pass a no-op middleware via the new DI parameter.
3. Remove `vi` from the vitest import if no longer used.
4. Run the individual test file to confirm it passes.

#### Step 3: Verify

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`
- `pnpm type-check`
- `pnpm lint:fix`

---

## Success Criteria

- Zero `vi.mock` calls in `e2e-tests/**/*.e2e.test.ts`.
- All 23 E2E test files pass.
- No new ESLint overrides or `@ts-ignore` comments.
- Product code change is minimal: one optional parameter with a default.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Auth-enabled tests may rely on subtle mock behaviour (e.g. `getAuth()` return shape) | The no-op middleware just calls `next()` — same as the current mock. Auth enforcement is tested by checking HTTP status codes, not by inspecting Clerk internals. |
| `@clerk/mcp-tools/server` mock may not be replaceable by `upstreamMetadata` injection | Investigate before implementing. If not, add a second small DI seam. |

---

## References

- ADR-078: Dependency injection for testability
- Testing strategy: no global state manipulation (`vi.mock`, `vi.stubGlobal`, `vi.doMock`)
- Napkin session 2026-03-03f: root cause analysis of intermittent E2E failures
