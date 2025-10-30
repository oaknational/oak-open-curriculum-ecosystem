# Testing Strategy: Oak Curriculum MCP Streamable HTTP

## Overview

This MCP server uses a comprehensive, multi-layered testing approach that proves correctness at different scales while maintaining deterministic, easy-to-understand test scenarios.

## Testing Philosophy

1. **No Conditional Logic in Tests** - Each test file has ONE clear setup and ONE clear set of expectations
2. **Deterministic Outcomes** - Test results provide instant, complete information about failures
3. **TDD Always** - Tests written first (Red), implementation second (Green), refactored third
4. **Production-Equivalent Testing** - Critical tests mirror production configuration exactly

## Test Layers

### Unit Tests (`*.unit.test.ts`)

- **Purpose**: Test pure functions in isolation
- **Characteristics**: No I/O, no side effects, no mocks
- **Run**: `pnpm test` (filtered to `*.unit.test.ts`)
- **Examples**:
  - `env.unit.test.ts` - Environment schema validation
  - `handlers.unit.test.ts` - Tool handler logic

### Integration Tests (`*.integration.test.ts`)

- **Purpose**: Test multiple units working together as imported code
- **Characteristics**: Code runs in test process, simple mocks allowed
- **Run**: `pnpm test` (filtered to `*.integration.test.ts`)
- **Examples**:
  - `clerk-auth-middleware.integration.test.ts` - Clerk middleware behavior
  - `index.unit.test.ts` - App initialization with all components

### E2E Tests (`*.e2e.test.ts`)

- **Purpose**: Test running system behavior (server in separate process)
- **Characteristics**: Real I/O, side effects, minimal mocks
- **Run**: `pnpm test:e2e`
- **Examples**:
  - `auth-enforcement.e2e.test.ts` - Production-equivalent auth testing
  - `auth-bypass.e2e.test.ts` - DX feature validation
  - `stub-mode.e2e.test.ts` - MCP protocol with stubs

### Smoke Tests (`smoke-tests/`)

- **Purpose**: Quick production-like validation (fastest E2E subset)
- **Characteristics**: Tests critical paths only
- **Run**: `pnpm smoke:dev:stub`, `pnpm smoke:dev:live:auth`, `pnpm smoke:remote`
- **Key Scenarios**: See "Smoke Test Matrix" below

## Test Scenario Matrix

Tests are organized across three dimensions:

- **Environment**: `dev` (local) vs `remote` (Vercel)
- **Data Source**: `stub` (canned) vs `live` (Oak API)
- **Auth**: `auth` (Clerk enforced) vs `noauth` (bypass enabled)

### Production Configuration

`remote + live + auth` - This is what runs on Vercel

### Valid Test Scenarios

| Scenario                  | Environment | Data | Auth   | Purpose                      | Critical?   |
| ------------------------- | ----------- | ---- | ------ | ---------------------------- | ----------- |
| **Production-Equivalent** | dev         | live | auth   | Proves complete stack works  | ✅ YES      |
| **Remote Health**         | remote      | live | auth   | Proves deployment successful | ✅ YES      |
| **MCP Protocol**          | dev         | stub | noauth | Fast protocol testing        | Recommended |
| **Oak API Integration**   | dev         | live | noauth | API integration testing      | Recommended |

### Auth Bypass Mechanism

**Purpose**: Developer convenience for local testing

**How it works**:

```typescript
const shouldBypassAuth =
  process.env.REMOTE_MCP_ALLOW_NO_AUTH === 'true' &&
  process.env.NODE_ENV === 'development' &&
  !process.env.VERCEL;
```

**Safety**:

- Only works in `NODE_ENV=development`
- Automatically disabled on Vercel
- Automatically disabled in production

**Testing Implications**:

- Auth validation logic still exists (tested in integration tests)
- Bypass just skips calling the middleware
- E2E tests prove both auth enforcement AND bypass work correctly

## Running Tests

### Local Development

```bash
# Fast iteration (unit + integration only)
pnpm test

# Full test suite (includes E2E)
pnpm test:e2e

# Quick smoke test (stub mode, no network)
pnpm smoke:dev:stub

# Production-equivalent smoke (CRITICAL before deploy)
pnpm smoke:dev:live:auth

# Full quality gate (all checks)
pnpm qg
```

### CI/CD

```bash
# GitHub Actions runs (from root):
pnpm qg
```

## Test File Organization

```text
apps/oak-curriculum-mcp-streamable-http/
├── src/
│   ├── *.unit.test.ts          # Unit tests (colocated with source)
│   └── *.integration.test.ts   # Integration tests (colocated)
├── e2e-tests/
│   ├── auth-enforcement.e2e.test.ts    # Auth enforcement (critical)
│   ├── auth-bypass.e2e.test.ts         # Auth bypass (DX feature)
│   ├── stub-mode.e2e.test.ts           # MCP protocol with stubs
│   ├── live-mode.e2e.test.ts           # Oak API integration
│   └── ... (other E2E tests)
└── smoke-tests/
    ├── smoke-dev-stub.ts               # Fast local check
    ├── smoke-dev-live-auth.ts          # Pre-deployment validation
    ├── smoke-remote.ts                 # Production health
    └── modes/
        ├── local-stub.ts
        ├── local-live-auth.ts
        └── remote.ts
```

## What Each Layer Proves

### Unit Tests Prove

- ✅ Environment schema validates Clerk keys
- ✅ Pure functions work correctly
- ✅ Tool handlers can be called

### Integration Tests Prove

- ✅ Clerk middleware rejects unauthorized requests (401)
- ✅ Clerk middleware accepts valid tokens
- ✅ OAuth discovery endpoints expose correct metadata
- ✅ App initialization works with all components

### E2E Tests Prove

- ✅ Running server enforces auth (production-equivalent)
- ✅ Running server allows bypass for local dev
- ✅ MCP protocol works end-to-end
- ✅ Oak API integration works
- ✅ Security features work (CORS, DNS rebinding)

### Smoke Tests Prove

- ✅ Quick smoke: System boots and responds
- ✅ Auth smoke: Production config works locally
- ✅ Remote smoke: Deployment is healthy

## Troubleshooting Test Failures

### "401 Unauthorized" in tests that should pass

- **Check**: Is auth bypass properly configured?
- **Fix**: Verify `REMOTE_MCP_ALLOW_NO_AUTH=true` and `NODE_ENV=development`

### "Expected 401, got 200" in auth enforcement tests

- **Check**: Is auth bypass accidentally enabled?
- **Fix**: Verify `NODE_ENV=test` (not `development`)

### "Cannot find module '@clerk/...'"

- **Check**: Are dependencies installed?
- **Fix**: Run `pnpm install`

### Tests pass locally but fail in CI

- **Check**: Environment variables differ between local and CI
- **Fix**: Review `.env.example` and CI configuration

## Adding New Tests

**Always use TDD**:

1. Write failing test (Red)
2. Run test to prove it fails
3. Implement feature (Green)
4. Run test to prove it passes
5. Refactor if needed

**Choose the right layer**:

- Pure function? → Unit test
- Multiple units? → Integration test
- Running system? → E2E test
- Critical path? → Smoke test

**Keep tests deterministic**:

- ONE setup per file
- NO conditional logic
- Clear, instant failure signals

## Auth Enforcement vs Auth Bypass

### When Auth is Enforced

Auth enforcement happens when:

- `NODE_ENV` is NOT `development`, OR
- `VERCEL` environment variable is set, OR
- `REMOTE_MCP_ALLOW_NO_AUTH` is not `'true'`

Tests that prove auth enforcement:

- `auth-enforcement.e2e.test.ts` - Full E2E suite
- `smoke:dev:live:auth` - Production-equivalent smoke
- Integration tests in `clerk-auth-middleware.integration.test.ts`

### When Auth is Bypassed

Auth bypass happens when ALL of:

- `REMOTE_MCP_ALLOW_NO_AUTH === 'true'`, AND
- `NODE_ENV === 'development'`, AND
- `VERCEL` is not set

Tests that prove auth bypass works:

- `auth-bypass.e2e.test.ts` - DX feature validation
- `smoke:dev:stub` - Uses bypass implicitly
- Unit tests - Use bypass for testing logic

## Environment Variables for Testing

### Required for ALL tests

- `CLERK_PUBLISHABLE_KEY` - Valid Clerk public key
- `CLERK_SECRET_KEY` - Valid Clerk secret key (or dummy for tests)
- `OAK_API_KEY` - Oak Curriculum API key (for live tests)

### Optional for specific scenarios

- `REMOTE_MCP_ALLOW_NO_AUTH=true` - Enable auth bypass (dev only)
- `NODE_ENV=development` - Required for bypass to work
- `VERCEL=1` - Simulates Vercel environment (disables bypass)

### Example: E2E Auth Enforcement Setup

```typescript
process.env.NODE_ENV = 'test'; // NOT development
process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_...';
process.env.CLERK_SECRET_KEY = 'sk_test_dummy';
delete process.env.REMOTE_MCP_ALLOW_NO_AUTH; // Auth ENABLED
delete process.env.VERCEL;
```

### Example: E2E Auth Bypass Setup

```typescript
process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true'; // Bypass ENABLED
process.env.NODE_ENV = 'development'; // Required
process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_...';
process.env.CLERK_SECRET_KEY = 'sk_test_dummy';
delete process.env.VERCEL; // Required for bypass
```

## Quality Gate

The quality gate (`pnpm qg`) runs all checks in order:

1. **Format check** - Prettier formatting
2. **Type check** - TypeScript compilation
3. **Lint** - ESLint rules
4. **Markdown lint** - Markdown formatting
5. **Unit + Integration tests** - `pnpm test`
6. **UI tests** - Playwright (if configured)
7. **E2E tests** - `pnpm test:e2e`
8. **Stub smoke** - `pnpm smoke:dev:stub`
9. **Auth smoke** - `pnpm smoke:dev:live:auth` ⭐ **CRITICAL**

All gates must pass before deploying to production.

## Future Enhancements

### Phase 3 TODO

- Add E2E test with real Clerk OAuth token via Device Flow
- Add OAuth discovery assertions to smoke tests
- Implement token acquisition helper for remote smoke tests
- Add performance benchmarks

### Deferred

- Contract testing with Pact (if needed)
- Mutation testing with Stryker (already configured)
- Visual regression testing (not applicable to API)
