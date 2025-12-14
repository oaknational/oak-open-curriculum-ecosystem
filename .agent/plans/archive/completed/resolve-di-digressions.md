# E2E Test Isolation and Flat Schema Arguments

**Last Updated**: 2025-11-18  
**Status**: 🟢 IN PROGRESS - Implementation underway  
**Scope**: Fix all E2E test failures (auth isolation + flat schema arguments)

---

## Context

E2E tests are failing due to two distinct issues:

### Issue 1: Global State Mutation (streamable-http)

E2E tests mutate global `process.env`, creating coupling between tests when run sequentially in `singleFork: true` mode. This causes intermittent test failures due to race conditions.

**Evidence**: `auth-enforcement.e2e.test.ts` fails intermittently because previous tests set `DANGEROUSLY_DISABLE_AUTH='true'` in `process.env`, and cleanup is not perfect.

**Root Cause**: Tests manipulating global state instead of using dependency injection.

**Existing Capabilities**: Product code already supports DI via:

- `loadRuntimeConfig(source: NodeJS.ProcessEnv)` - accepts isolated env object
- `createApp({ runtimeConfig })` - accepts pre-configured runtime config

### Issue 2: Nested Arguments (stdio)

E2E tests in stdio app pass arguments in old nested format (`params.path.lesson`) but tools now expect flat format (`lesson`).

**Evidence**:

- `multi-status-handling.e2e.test.ts` (2 failures)
- `mcp-protocol.e2e.test.ts` (2 failures)

**Root Cause**: Tests not updated after P0 flat schema generator fix.

### Issue 3: Workspace Boundary Violations (RESOLVED)

**Status**: ✅ **FIXED** - Deleted problematic tests that violated workspace boundaries

**Tests Deleted** (violations of @rules.md and @testing-strategy.md):

- `apps/oak-curriculum-mcp-streamable-http/src/handlers.unit.test.ts` - Imported SDK types, used complex mocks
- `apps/oak-curriculum-mcp-streamable-http/src/oauth-metadata-clerk.integration.test.ts` - Tested almost nothing useful
- `apps/oak-curriculum-mcp-streamable-http/src/app/auth.instrumentation.integration.test.ts` - Testing implementation, not behavior
- `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap.instrumentation.integration.test.ts` - Testing framework internals
- `apps/oak-curriculum-mcp-streamable-http/src/index.unit.test.ts` - E2E test disguised as unit test
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/sdk-client-stub.e2e.test.ts` - Testing SDK functionality in HTTP app

**Coverage Verification**: All deleted test coverage is maintained in proper E2E tests in the `e2e-tests/` directory.

---

## Quality Gate Strategy

**Critical**: Run ALL quality gates across ALL workspaces after EACH sub-task to catch regressions immediately.

**Why Not `--filter`?** Changes in the SDK can break multiple consuming workspaces. We must verify the entire monorepo after each change.

### After Each Task

```bash
# Run all quality gates across all workspaces
pnpm type-check  # Type check ALL workspaces
pnpm lint        # Lint ALL workspaces
pnpm test        # Test ALL workspaces
```

### After Each Phase

```bash
# Full quality gate sequence
pnpm type-gen    # Regenerate types (SDK changes)
pnpm build       # Build ALL workspaces
pnpm type-check  # Type check ALL workspaces
pnpm lint        # Lint ALL workspaces
pnpm test        # Test ALL workspaces
pnpm test:e2e    # E2E tests for ALL apps
```

**Rationale** (from @rules.md):

> "Run quality gates frequently to catch issues early"
> "If a change breaks something, you want to know immediately, not after 10 more changes"

**SDK Impact**: A single change in `packages/sdks/oak-curriculum-sdk` affects:

- `apps/oak-curriculum-mcp-stdio`
- `apps/oak-curriculum-mcp-streamable-http`
- All consuming workspaces

Therefore, quality gates MUST run across the entire monorepo.

---

## Problem Statement

### Current Architecture Issues

1. **Global State Mutation**: Tests directly modify `process.env`

   ```typescript
   // BAD: Mutates global state
   process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
   ```

2. **Test Coupling**: Sequential test execution in single fork means env pollution persists

   ```typescript
   // vitest.e2e.config.ts
   test: { pool: 'forks', poolOptions: { forks: { singleFork: true } } }
   ```

3. **Cleanup Complexity**: Attempting to restore `process.env` is brittle and error-prone

### Manifestation

- `auth-enforcement.e2e.test.ts` expects `DANGEROUSLY_DISABLE_AUTH` to be unset
- Previous tests (`auth-bypass.e2e.test.ts`, `create-stubbed-http-app.ts`) set it to `'true'`
- Test execution order determines pass/fail (race condition)
- Tests pass in isolation, fail when run in sequence

---

## Solution Architecture

### Principle (from @rules.md and @testing-strategy.md)

> "Tests should not have complex setup/teardown - that's a signal to simplify"
> "Mutating global state creates coupling"
> "Use dependency injection with pure functions"

### Key Insight

**The product code ALREADY solves this problem.** We don't need new abstractions - we need to USE the existing DI capabilities (`loadRuntimeConfig(source)`, `createApp({ runtimeConfig })`) instead of fighting against them with global state mutation.

This exemplifies the first question from rules.md: **"Could it be simpler?"**

Answer: YES - use what exists, don't add more.

### Strategy

**Replace global state mutation with isolated env objects passed via DI.**

**Non-Goals** (YAGNI):

- ❌ Creating new test infrastructure
- ❌ Adding compatibility layers
- ❌ "Testing the tests" with meta-tests
- ✅ Simply using existing, proven architecture correctly

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives-and-memory/rules.md` - Core principles
2. **Re-read** `.agent/directives-and-memory/testing-strategy.md` - Testing philosophy
3. **Re-read** `.agent/directives-and-memory/schema-first-execution.md` - Type generation flow
4. **Ask**: "Does this deliver system-level value, not just fix the immediate issue?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Task Completion Summary

Each task has:

- **Acceptance Criteria**: Specific, checkable conditions that must be met
- **Deterministic Validation**: Commands with expected outputs and exit codes
- **Task Complete When**: Clear statement of when to proceed

**How to Use**:

1. Read the acceptance criteria before starting the task
2. Complete the implementation
3. Run the deterministic validation commands
4. Check all acceptance criteria
5. Only mark task complete when ALL criteria met AND ALL validations pass

**Red Flag**: If validation commands don't produce expected results, STOP and fix before proceeding to next task.

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions (15 minutes)

**Foundation Check-In**: Re-read rules.md section on "No Global State" and testing-strategy.md on "Test Isolation".

**Key Principle**: Before implementing the DI-based isolation fix, we must verify that the product code doesn't bypass the DI system by reading `process.env` directly in places other than the config loading layer.

#### Task 0.1: Verify Product Code DI Completeness

**Current Assumption**: All environment variable reads happen through `loadRuntimeConfig()` and the DI system passes config down through the application.

**Validation Required**: Confirm no product code bypasses DI by reading `process.env` directly.

**Acceptance Criteria**:

1. ✅ All `process.env` reads in product code are limited to `runtime-config.ts` and bootstrap files
2. ✅ No handler, service, or middleware files read `process.env` directly
3. ✅ Application code receives all config through DI (constructor injection, function parameters)
4. ✅ If violations found, they are fixed BEFORE proceeding to Phase 1

**Deterministic Validation**:

```bash
# 1. Find all process.env reads in streamable-http product code
grep -r "process\.env\." apps/oak-curriculum-mcp-streamable-http/src/ \
  --exclude="*.test.ts" \
  --exclude-dir="node_modules" \
  -n
# Expected: Only matches in runtime-config.ts, bootstrap files, and application entry point

# 2. Specifically check handlers, services, middleware (should be ZERO)
grep -r "process\.env\." apps/oak-curriculum-mcp-streamable-http/src/handlers/ -n
grep -r "process\.env\." apps/oak-curriculum-mcp-streamable-http/src/services/ -n
grep -r "process\.env\." apps/oak-curriculum-mcp-streamable-http/src/middleware/ -n
# Expected: NO MATCHES for each (exit code 1)

# 3. Check stdio app as well
grep -r "process\.env\." apps/oak-curriculum-mcp-stdio/src/ \
  --exclude="*.test.ts" \
  --exclude-dir="node_modules" \
  -n
# Expected: Only matches in config/bootstrap files

# 4. If violations found, count them
violations=$(grep -r "process\.env\." apps/oak-curriculum-mcp-*/src/ \
  --exclude="*.test.ts" \
  --exclude="*config.ts" \
  --exclude="*bootstrap.ts" \
  --exclude="index.ts" \
  --exclude-dir="node_modules" \
  | wc -l)
echo "DI bypass violations found: $violations"
# Expected: 0
```

**If Violations Found**:

1. **STOP** - Do not proceed to Phase 1
2. **Document** each violation:
   - File path and line number
   - What env var is being read
   - Why it bypasses DI
3. **Fix** each violation using one of these patterns:
   - Move env read to `runtime-config.ts`
   - Add field to `RuntimeConfig` type
   - Pass through DI chain
4. **Re-run** quality gates: `pnpm type-check && pnpm lint && pnpm test`
5. **Re-validate** - return to deterministic validation above

**If No Violations**:

Proceed directly to Phase 1.

**Task Complete When**: All 4 acceptance criteria checked AND validation shows zero DI bypasses OR violations fixed and quality gates pass.

**Foundation Alignment**: This validates the core assumption that DI is the ONLY config pathway, ensuring the fix in Phases 1-2 will actually solve the problem.

**Phase 0 Result**: ❌ **VIOLATIONS FOUND** - Product code bypasses DI in multiple locations. Must fix before proceeding.

---

### Phase 0.5: Complete Product Code DI Implementation (3-4 hours)

**Foundation Check-In**: Re-read rules.md sections on "Pure functions first", "No global state", "Single source of truth for types", and testing-strategy.md on "Pure functions and dependency injection".

**Key Principle**: All configuration MUST flow through the DI system. No `process.env` access outside of the configuration loading layer. This ensures testability, maintainability, and architectural consistency.

**Phase 0 Findings**:

**Streamable-HTTP (6 violations including architectural flaw):**

- `auth-routes.ts:48` - `process.env.CLERK_PUBLISHABLE_KEY`
- `index.ts:16` - `process.env.PORT`
- `index.ts:22` - `process.env.DANGEROUSLY_DISABLE_AUTH` ⚠️ **CRITICAL**
- `logging/index.ts:42` - `process.env.npm_package_version`
- `runtime-config.ts:56-62` - Reads `source.VERCEL_*` directly (duplicates env.ts)
- `runtime-config.ts:66-67` - Reads `source.DANGEROUSLY_DISABLE_AUTH` and `source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS` (NOT in env.ts schema!)

**Architectural Flaw Identified**: `env.ts` validates SOME vars, but `runtime-config.ts` reads OTHER vars directly without validation. This violates single responsibility and creates two sources of truth.

**Correct Architecture**: `env.ts` should validate ALL env vars (single point of validation). `runtime-config.ts` should compose from the validated `env` object only.

**Stdio (8+ violations):**

- `wiring.ts:48` - `process.env.OAK_API_KEY`
- `stub-executors.ts:8` - `process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS` ⚠️ **CRITICAL**
- `server.ts:81, 96` - `process.env.LOG_LEVEL`, `process.env.OAK_API_KEY`
- `index.ts:24, 39, 42` - Multiple env reads
- `logging/index.ts:41` - `process.env.npm_package_version`
- **No `env.ts` validation layer exists** - all validation missing!

#### Task 0.5.1: Fix streamable-http Env Validation Architecture

**Current Issues**:

- `env.ts` validates SOME vars (via Zod schema)
- `runtime-config.ts` reads OTHER vars directly from `source` without validation
- Duplication: Vercel URLs validated in env.ts but re-read in runtime-config.ts
- Missing validation: `DANGEROUSLY_DISABLE_AUTH`, `OAK_CURRICULUM_MCP_USE_STUB_TOOLS`, `PORT`, `npm_package_version`
- Product code bypasses both layers in multiple locations

**Target Architecture**:

- **`env.ts`**: Single point of validation for ALL env vars (Zod schema + readEnv)
- **`runtime-config.ts`**: Pure composition from validated `env` object (NO `source` access)
- **Product code**: Receives config via DI (NO direct env access)

**Changes Required**:

1. **Extend `EnvSchema` in `src/env.ts`** to validate ALL missing vars:

```typescript
// src/env.ts
const EnvSchema = z.object({
  // Existing validated vars...
  OAK_API_KEY: z.string().min(1),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  // ... existing Vercel vars, BASE_URL, etc.

  // ✅ ADD missing vars that were being read raw:
  PORT: z.coerce.number().default(3333),
  npm_package_version: z.string().default('0.0.0'),
  DANGEROUSLY_DISABLE_AUTH: z.enum(['true', 'false']).optional(),
  OAK_CURRICULUM_MCP_USE_STUB_TOOLS: z.enum(['true', 'false']).optional(),
  NODE_ENV: z.string().optional(),
  // ... all other vars the app needs
});

export type Env = z.infer<typeof EnvSchema>;

/* eslint-disable-next-line no-restricted-syntax -- This is the ONLY file that reads process.env */
export function readEnv(env: NodeJS.ProcessEnv = process.env): Env {
  // Validation logic remains the same
  // ...
}
```

2. **Refactor `runtime-config.ts`** to use ONLY validated `env`:

```typescript
// src/runtime-config.ts
import { readEnv, type Env } from './env.js';

export interface RuntimeConfig {
  /** Validated environment variables */
  readonly env: Env;

  /** Server port (from env.PORT) */
  readonly port: number;

  /** Package version (from env.npm_package_version) */
  readonly packageVersion: string;

  /** Whether to bypass auth (local dev only) */
  readonly dangerouslyDisableAuth: boolean;

  /** Whether to use stub tools */
  readonly useStubTools: boolean;

  /** Vercel deployment hostnames */
  readonly vercelHostnames: readonly string[];
}

/* eslint-disable-next-line no-restricted-syntax -- Needs process.env default to call readEnv */
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  // ✅ Validate ONCE through env.ts
  const env = readEnv(source);

  // ✅ NO direct source access - compose from validated env
  const vercelHostnames = [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter((url): url is string => Boolean(url))
    .map((url) => url.toLowerCase());

  return {
    env,
    port: env.PORT,
    packageVersion: env.npm_package_version,
    dangerouslyDisableAuth: env.DANGEROUSLY_DISABLE_AUTH === 'true',
    useStubTools: env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS === 'true',
    vercelHostnames,
  };
}
```

3. **Refactor `auth-routes.ts`** to accept config via DI:

```typescript
/**
 * Creates authentication routes with proper dependency injection.
 *
 * @param config - Runtime configuration containing auth credentials
 * @returns Express router with auth endpoints
 */
export function createAuthRoutes(config: RuntimeConfig): Router {
  const router = Router();

  router.get('/oauth/metadata', (req, res) => {
    const publishableKey = config.security.clerkPublishableKey;
    // ... rest of implementation
  });

  return router;
}
```

4. **Refactor `index.ts`** to use config throughout:

```typescript
/**
 * Application entry point.
 * Loads configuration and starts the server.
 */
async function main(): Promise<void> {
  const config = loadRuntimeConfig();
  const app = createApp({ runtimeConfig: config });

  const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });

  // No direct process.env access anywhere
}
```

5. **Refactor `logging/index.ts`** to accept version via DI:

```typescript
/**
 * Creates logger instance with proper configuration.
 *
 * @param config - Runtime configuration including package version
 * @returns Configured logger instance
 */
export function createLogger(config: RuntimeConfig): Logger {
  return pino({
    // ... other config
    version: config.packageVersion,
  });
}
```

**Acceptance Criteria**:

1. ✅ `EnvSchema` in `env.ts` extended with ALL missing vars (PORT, npm_package_version, DANGEROUSLY_DISABLE_AUTH, OAK_CURRICULUM_MCP_USE_STUB_TOOLS)
2. ✅ `readEnv()` validates all vars through single Zod schema
3. ✅ `loadRuntimeConfig()` in `runtime-config.ts` uses ONLY validated `env` object (NO direct `source` access)
4. ✅ `runtime-config.ts` composes from `env.PORT`, `env.npm_package_version`, etc. (not `source.PORT`)
5. ✅ All TSDoc comments added following exhaustive documentation standard
6. ✅ `auth-routes.ts` refactored to accept config via DI
7. ✅ `index.ts` refactored to use config.port instead of process.env.PORT
8. ✅ `index.ts` auth check uses config.dangerouslyDisableAuth instead of process.env
9. ✅ `logging/index.ts` refactored to accept config via DI
10. ✅ Zero `process.env` reads outside of `readEnv()` in `env.ts` (streamable-http)
11. ✅ ESLint inline exception ONLY in `env.ts` (not runtime-config.ts)

**Deterministic Validation**:

```bash
# 1. Verify NO process.env in product code except env.ts
grep -r "process\.env\." apps/oak-curriculum-mcp-streamable-http/src/ \
  --exclude="*.test.ts" \
  --exclude="env.ts" \
  --exclude-dir="node_modules" \
  -n
# Expected: Only runtime-config.ts line with eslint-disable comment (exit code 0, 1 match)

# 2. Verify runtime-config.ts does NOT directly access source.* for config values
grep "source\\.DANGEROUSLY_DISABLE_AUTH\\|source\\.PORT\\|source\\.npm_package_version\\|source\\.VERCEL" apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts
# Expected: NO MATCHES (exit code 1) - should use env.* instead

# 3. Verify EnvSchema has ALL required fields
grep "PORT:" apps/oak-curriculum-mcp-streamable-http/src/env.ts
grep "npm_package_version:" apps/oak-curriculum-mcp-streamable-http/src/env.ts
grep "DANGEROUSLY_DISABLE_AUTH:" apps/oak-curriculum-mcp-streamable-http/src/env.ts
grep "OAK_CURRICULUM_MCP_USE_STUB_TOOLS:" apps/oak-curriculum-mcp-streamable-http/src/env.ts
# Expected: MATCH FOUND for each (exit code 0)

# 4. Verify runtime-config.ts uses env.* (not source.*)
grep "env\\.PORT\\|env\\.npm_package_version\\|env\\.DANGEROUSLY_DISABLE_AUTH" apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts
# Expected: MATCH FOUND (exit code 0) - uses validated env object

# 5. Verify ESLint exception only in env.ts
grep -n "eslint-disable.*no-restricted-syntax" apps/oak-curriculum-mcp-streamable-http/src/*.ts
# Expected: Only env.ts:line (exit code 0, 1 match)

# 6. Run quality gates
pnpm type-check  # Expected: exit 0, no type errors
pnpm lint        # Expected: exit 0, no lint errors
pnpm test        # Expected: exit 0, all tests pass
```

**Task Complete When**: All 11 acceptance criteria checked AND all validation commands pass.

---

#### Task 0.5.2: Refactor stdio Runtime Config

**Current Issues**:

- Product code reads `process.env` directly in wiring, server, index, stub-executors
- No centralized config layer
- Hard to test due to global state dependency

**Target Architecture**:

- Create `runtime-config.ts` for stdio app
- ALL env reads happen in config loading layer
- Config flows through DI to all consumers

**Changes Required**:

1. **Create `src/runtime-config.ts`**:

````typescript
/**
 * Runtime configuration for the stdio MCP server.
 *
 * @remarks
 * This is the single source of truth for all runtime configuration.
 * No code outside of `loadRuntimeConfig()` should access `process.env`.
 *
 * @packageDocumentation
 */

/**
 * Complete runtime configuration for the stdio MCP server.
 * All configuration values flow through this interface via dependency injection.
 */
export interface RuntimeConfig {
  /**
   * Oak Curriculum API key for authentication.
   * Required for production API access.
   */
  apiKey: string;

  /**
   * Log level for application logging.
   * Valid values: 'debug', 'info', 'warn', 'error'
   * Defaults to 'info' if not specified.
   */
  logLevel: string;

  /**
   * Package version for observability and diagnostics.
   * Sourced from npm_package_version during builds.
   */
  packageVersion: string;

  /**
   * When true, use stub tool executors instead of live API calls.
   * MUST be false in production.
   * Used for testing and development.
   */
  useStubTools: boolean;
}

/**
 * Loads runtime configuration from environment variables.
 * This is the ONLY function that should access process.env in the application.
 *
 * @param source - Environment variable source (defaults to process.env)
 * @returns Complete runtime configuration
 *
 * @example
 * ```typescript
 * // Production: use system environment
 * const config = loadRuntimeConfig();
 *
 * // Testing: use isolated environment
 * const testConfig = loadRuntimeConfig({
 *   OAK_API_KEY: 'test-key',
 *   LOG_LEVEL: 'debug',
 *   OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true'
 * });
 * ```
 *
 * @remarks
 * All environment variable reads MUST happen here and nowhere else.
 * This ensures testability through dependency injection.
 */
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  return {
    apiKey: source.OAK_API_KEY ?? '',
    logLevel: source.LOG_LEVEL ?? 'info',
    packageVersion: source.npm_package_version ?? '0.0.0',
    useStubTools: source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS === 'true',
  };
}
````

2. **Refactor `wiring.ts`** to accept config:

```typescript
/**
 * Creates configured SDK client instance.
 *
 * @param config - Runtime configuration containing API credentials
 * @returns Configured Oak Curriculum SDK client
 */
export function createSdkClient(config: RuntimeConfig): OakCurriculumClient {
  return new OakCurriculumClient({
    apiKey: config.apiKey,
  });
}
```

3. **Refactor `stub-executors.ts`** to accept config:

```typescript
/**
 * Determines whether to use stub executors based on configuration.
 *
 * @param config - Runtime configuration
 * @returns True if stub executors should be used
 *
 * @remarks
 * Stub executors are used for testing and development to avoid live API calls.
 * They MUST NOT be used in production.
 */
export function shouldUseStubExecutors(config: RuntimeConfig): boolean {
  return config.useStubTools;
}

/**
 * Gets appropriate tool executors based on configuration.
 * Returns stub executors if configured, otherwise live executors.
 *
 * @param config - Runtime configuration
 * @returns Map of tool executors
 */
export function getToolExecutors(config: RuntimeConfig): ToolExecutorMap {
  if (shouldUseStubExecutors(config)) {
    return createStubExecutors();
  }
  return createLiveExecutors();
}
```

4. **Refactor `server.ts`** to accept config:

```typescript
/**
 * Creates and configures MCP server instance.
 *
 * @param config - Runtime configuration
 * @returns Configured MCP server
 */
export function createServer(config: RuntimeConfig): Server {
  const logger = createLogger(config);
  const client = createSdkClient(config);
  const executors = getToolExecutors(config);

  return new Server({
    logger,
    client,
    executors,
  });
}
```

5. **Refactor `index.ts`** to use config:

```typescript
/**
 * Application entry point for stdio MCP server.
 * Loads configuration and starts the server.
 */
async function main(): Promise<void> {
  const config = loadRuntimeConfig();

  const logger = createLogger(config);
  logger.info('Starting Oak Curriculum MCP stdio server');
  logger.info(`API key configured: ${config.apiKey ? 'Yes' : 'No'}`);
  logger.info(`Using stub tools: ${config.useStubTools}`);

  const server = createServer(config);
  await server.start();
}
```

6. **Refactor `logging/index.ts`** to accept config:

```typescript
/**
 * Creates logger instance with proper configuration.
 *
 * @param config - Runtime configuration including log level and version
 * @returns Configured logger instance
 */
export function createLogger(config: RuntimeConfig): Logger {
  return pino({
    level: config.logLevel,
    version: config.packageVersion,
  });
}
```

**Acceptance Criteria**:

1. ✅ `src/runtime-config.ts` created with `RuntimeConfig` interface
2. ✅ `loadRuntimeConfig()` function created with exhaustive TSDoc
3. ✅ All TSDoc comments follow exhaustive documentation standard with @param, @returns, @remarks, @example
4. ✅ `wiring.ts` refactored to accept config via DI
5. ✅ `stub-executors.ts` refactored to accept config via DI
6. ✅ `server.ts` refactored to accept config via DI
7. ✅ `index.ts` refactored to use config throughout
8. ✅ `logging/index.ts` refactored to accept config via DI
9. ✅ Zero `process.env` reads outside of `loadRuntimeConfig()` in stdio
10. ✅ File-level @packageDocumentation comment added to `runtime-config.ts`

**Deterministic Validation**:

```bash
# 1. Verify runtime-config.ts exists
test -f apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
# Expected: exit 0 (file exists)

# 2. Verify NO process.env in product code except config loading
grep -r "process\.env\." apps/oak-curriculum-mcp-stdio/src/ \
  --exclude="*.test.ts" \
  --exclude="runtime-config.ts" \
  --exclude-dir="node_modules" \
  -n
# Expected: NO MATCHES (exit code 1)

# 3. Verify RuntimeConfig interface exists
grep "interface RuntimeConfig" apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
# Expected: MATCH FOUND (exit code 0)

# 4. Verify all config fields present
grep "apiKey:" apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
grep "logLevel:" apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
grep "useStubTools:" apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
# Expected: MATCH FOUND for each (exit code 0)

# 5. Verify exhaustive TSDoc present
grep "@packageDocumentation" apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
grep "@param source" apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
grep "@returns" apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
grep "@example" apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
# Expected: MATCH FOUND for each (exit code 0)

# 6. Run quality gates
pnpm type-check  # Expected: exit 0, no type errors
pnpm lint        # Expected: exit 0, no lint errors
pnpm test        # Expected: exit 0, all tests pass
```

**Task Complete When**: All 10 acceptance criteria checked AND all validation commands pass.

---

#### Task 0.5.3: Add ESLint Rules to Enforce DI Architecture

**Purpose**: Add static analysis rules to prevent future regressions by catching direct `process.env` access at lint time.

**Changes Required**:

1. **Add rule to `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts`** (already added by user):

```typescript
'no-restricted-syntax': [
  'error',
  {
    selector:
      'MemberExpression[object.property.name="process"][property.name="env"], MemberExpression[object.name="process"][property.name="env"]',
    message:
      'Avoid using process.env directly. In product code use the runtime config provided by the env library instead. In test code pass simple values directly via DI.',
  },
],
```

2. **Add same rule to `apps/oak-curriculum-mcp-stdio/eslint.config.ts`**:

```typescript
// Add to rules section (same as streamable-http)
'no-restricted-syntax': [
  'error',
  {
    selector:
      'MemberExpression[object.property.name="process"][property.name="env"], MemberExpression[object.name="process"][property.name="env"]',
    message:
      'Avoid using process.env directly. In product code use the runtime config provided by the env library instead. In test code pass simple values directly via DI.',
  },
],
```

3. **Add ESLint inline exceptions** to the ONLY files that should access `process.env`:

- `apps/oak-curriculum-mcp-streamable-http/src/env.ts` - already has exception
- `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts` - needs exception added

```typescript
/* eslint-disable-next-line no-restricted-syntax -- process.env is needed here to enable building the runtime config */
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
```

**Acceptance Criteria**:

1. ✅ ESLint rule added to streamable-http eslint.config.ts (already done by user)
2. ✅ ESLint rule added to stdio eslint.config.ts (NEW)
3. ✅ Exception added in streamable-http env.ts (already done by user)
4. ✅ Exception added in stdio runtime-config.ts (NEW)
5. ✅ Running `pnpm lint --filter @oaknational/oak-curriculum-mcp-streamable-http` shows ~179 violations before fixes
6. ✅ Running `pnpm lint --filter @oaknational/oak-curriculum-mcp-stdio` shows violations before fixes
7. ✅ After Phase 0.5 fixes, both apps lint clean with only 1-2 exceptions (in config loading files)

**Deterministic Validation**:

```bash
# 1. Verify rule exists in streamable-http
grep "no-restricted-syntax" apps/oak-curriculum-mcp-streamable-http/eslint.config.ts
# Expected: MATCH FOUND (exit code 0)

# 2. Verify rule exists in stdio
grep "no-restricted-syntax" apps/oak-curriculum-mcp-stdio/eslint.config.ts
# Expected: MATCH FOUND (exit code 0)

# 3. Count exceptions in streamable-http (should be 1: env.ts)
grep -c "eslint-disable.*no-restricted-syntax" apps/oak-curriculum-mcp-streamable-http/src/*.ts
# Expected: 1 (only env.ts)

# 4. Count exceptions in stdio (should be 1: runtime-config.ts)
grep -c "eslint-disable.*no-restricted-syntax" apps/oak-curriculum-mcp-stdio/src/*.ts
# Expected: 1 (only runtime-config.ts)

# 5. Verify lint catches violations before fixes (should fail with violations)
pnpm lint --filter @oaknational/oak-curriculum-mcp-streamable-http 2>&1 | grep "process.env" | wc -l
# Expected: ~179 violations before Phase 0.5 fixes

# 6. After Phase 0.5 fixes, verify lint passes
pnpm lint --filter @oaknational/oak-curriculum-mcp-streamable-http
pnpm lint --filter @oaknational/oak-curriculum-mcp-stdio
# Expected: exit 0 for both (all violations fixed)
```

**Task Complete When**: All 7 acceptance criteria checked AND all validation commands pass.

**Note on Test and Script Exceptions**:

- **Smoke Tests**: MUST follow the same DI patterns as E2E tests and product code. No direct `process.env` access allowed. Smoke tests are E2E tests run against deployed environments - same rules apply.
- **Scripts** (in `scripts/` directory): MAY be granted exceptions on a case-by-case basis with explicit user approval. Each script exception must be:
  - Documented with reason (why DI is impractical for this script)
  - Approved by user before implementation
  - Minimized in scope (prefer DI even in scripts when feasible)
- **Default**: All code follows DI pattern unless explicitly approved for exception

---

#### Task 0.5.4: Update Unit Tests for DI

**Purpose**: Ensure existing unit tests work with new DI-based architecture.

**Changes Required**:

1. Update any unit tests that relied on `process.env` to pass config explicitly
2. Add unit tests for new `loadRuntimeConfig()` functions
3. Verify all config validation logic is tested

**Acceptance Criteria**:

1. ✅ Unit tests for `loadRuntimeConfig()` in streamable-http
2. ✅ Unit tests for `loadRuntimeConfig()` in stdio
3. ✅ Tests verify all config fields are loaded correctly
4. ✅ Tests verify default values are applied correctly
5. ✅ Tests verify type coercion (e.g., string to number for port)
6. ✅ All existing unit tests pass with DI refactoring
7. ✅ Zero unit tests directly accessing `process.env`

**Deterministic Validation**:

```bash
# 1. Verify unit tests exist for runtime config
test -f apps/oak-curriculum-mcp-streamable-http/src/runtime-config.unit.test.ts
test -f apps/oak-curriculum-mcp-stdio/src/runtime-config.unit.test.ts
# Expected: exit 0 for each (files exist)

# 2. Verify no process.env in unit tests (should use isolated config)
grep -r "process\.env\." apps/oak-curriculum-mcp-*/src/*.unit.test.ts
# Expected: NO MATCHES (exit code 1)

# 3. Run unit tests
pnpm test
# Expected: exit 0, all tests pass

# 4. Verify test coverage for config loading
pnpm test -- --coverage runtime-config
# Expected: 100% coverage on loadRuntimeConfig()
```

**Task Complete When**: All 7 acceptance criteria checked AND all validation commands pass.

---

#### Task 0.5.5: Create Architectural Decision Record

**Purpose**: Document the decision to enforce DI for all configuration, explaining the rationale and implications.

**Changes Required**:

Create `docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md`:

```markdown
# ADR 054: Dependency Injection for All Configuration

**Status**: Accepted  
**Date**: 2025-11-18  
**Deciders**: Engineering Team  
**Context**: E2E test isolation, architectural consistency

---

## Context and Problem Statement

Our E2E tests were experiencing race conditions due to global `process.env` mutation. Investigation revealed that product code was reading `process.env` directly in multiple locations, bypassing any dependency injection system. This made testing difficult and created tight coupling to the global environment.

### Problems Identified

1. **Test Isolation**: Tests mutating `process.env` caused race conditions
2. **Testability**: Hard to test code that depends on global state
3. **Architectural Inconsistency**: Some code used DI, some bypassed it
4. **Type Safety**: Direct `process.env` access loses type information
5. **Discoverability**: Hard to know what config a function needs

### Phase 0 Findings

Validation revealed 12+ instances of product code bypassing DI:

- `streamable-http`: 4 violations including critical `DANGEROUSLY_DISABLE_AUTH`
- `stdio`: 8+ violations including critical `OAK_CURRICULUM_MCP_USE_STUB_TOOLS`

## Decision

**All configuration MUST flow through dependency injection. No `process.env` access outside of configuration loading layer.**

### Enforcement

1. **Single Entry Point**: `loadRuntimeConfig()` is the ONLY function that reads `process.env`
2. **Type-Safe Interfaces**: All config accessed through `RuntimeConfig` interface
3. **Dependency Injection**: Config passed as function parameters or constructor arguments
4. **Exhaustive Documentation**: All config functions have complete TSDoc
5. **Architectural Boundaries**: ESLint rules enforce no `process.env` in product code

## Consequences

### Positive

- ✅ **Testability**: Easy to test with isolated config objects
- ✅ **Type Safety**: Config is fully typed, TypeScript validates usage
- ✅ **Discoverability**: Function signatures show config dependencies
- ✅ **Isolation**: Tests cannot interfere with each other via global state
- ✅ **Refactorability**: Easy to change config structure in one place
- ✅ **Documentation**: Config requirements are self-documenting

### Negative

- ⚠️ **Verbosity**: Must pass config through call chains
- ⚠️ **Migration Effort**: Requires refactoring existing code
- ⚠️ **Breaking Changes**: Changes function signatures

### Mitigation

- Use composition root pattern (wire dependencies at app entry point)
- Minimize call chain depth through better architecture
- Refactor in phases to minimize disruption

## Implementation

### Phase 0.5 Tasks

1. Extend `RuntimeConfig` interfaces with all required fields
2. Refactor all code to accept config via DI
3. Update all unit tests to use isolated config
4. Add exhaustive TSDoc to all config-related code
5. Create this ADR to document the decision

### Quality Gates

- Zero `process.env` reads outside of `loadRuntimeConfig()`
- All unit tests pass with DI refactoring
- TypeScript validates all config access
- ESLint enforces architectural boundaries

## Alternatives Considered

### Alternative 1: Environment Variable Isolation (Rejected)

Create isolated environment variables per test using process forking.

**Rejected because:**

- Doesn't improve product code architecture
- Tests remain coupled to implementation
- Doesn't solve type safety issues
- More complex test infrastructure

### Alternative 2: Global Config Singleton (Rejected)

Create a global config object loaded at startup.

**Rejected because:**

- Still has testability issues (global mutable state)
- Hard to isolate tests
- Violates dependency injection principles
- Makes dependencies implicit

### Alternative 3: Partial DI (Rejected)

Allow `process.env` for "harmless" values like package version.

**Rejected because:**

- Creates inconsistency and confusion
- "Harmless" is subjective and changes over time
- Hard to enforce partial rules
- Better to be consistent and strict

## References

- `.agent/directives-and-memory/rules.md` - "No global state", "Pure functions first"
- `.agent/directives-and-memory/testing-strategy.md` - "Use dependency injection with pure functions"
- `.agent/plans/resolve-di-digressions.md` - Phase 0 validation findings
- Martin Fowler: "Inversion of Control Containers and the Dependency Injection pattern"

## Related Decisions

- Future: ADR for ESLint rules enforcing DI boundaries
- Future: ADR for composition root pattern in apps

---

**Compliance**: This decision aligns with rules.md principles on "No global state", "Pure functions first", and "Single source of truth for types".
```

**Acceptance Criteria**:

1. ✅ ADR file created at correct path
2. ✅ ADR follows standard format (Status, Date, Deciders, Context)
3. ✅ Problem statement clearly articulated
4. ✅ Decision explicitly stated
5. ✅ Consequences (positive and negative) documented
6. ✅ Alternatives considered and rejection rationale provided
7. ✅ Implementation plan included
8. ✅ References to foundation documents included
9. ✅ Compliance with rules.md explicitly stated

**Deterministic Validation**:

```bash
# 1. Verify ADR file exists
test -f docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
# Expected: exit 0 (file exists)

# 2. Verify ADR has required sections
grep "## Context and Problem Statement" docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
grep "## Decision" docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
grep "## Consequences" docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
grep "## Alternatives Considered" docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
# Expected: MATCH FOUND for each (exit code 0)

# 3. Verify references to foundation documents
grep "rules.md" docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
grep "testing-strategy.md" docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
# Expected: MATCH FOUND for each (exit code 0)

# 4. Verify markdown is valid
pnpm markdownlint:root docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
# Expected: exit 0, no markdown errors
```

**Task Complete When**: All 9 acceptance criteria checked AND all validation commands pass.

---

#### Task 0.5.6: Create Developer Guide Documentation

**Purpose**: Help developers understand and follow the DI pattern correctly.

**Changes Required**:

Create `docs/development/dependency-injection-guide.md`:

````markdown
# Dependency Injection Guide

This guide explains how we use dependency injection for configuration in this codebase.

## Core Principle

**All configuration flows through dependency injection. No `process.env` access outside of `loadRuntimeConfig()`.**

## Why?

1. **Testability**: Easy to test with isolated config objects
2. **Type Safety**: Config is fully typed, compiler validates usage
3. **Discoverability**: Function signatures show config dependencies
4. **Refactorability**: Change config structure in one place

## Pattern

### Loading Configuration

Configuration is loaded ONCE at application startup:

```typescript
// src/index.ts
import { loadRuntimeConfig } from './runtime-config.js';

async function main() {
  // Load config from environment
  const config = loadRuntimeConfig();

  // Pass to app bootstrap
  const app = createApp({ runtimeConfig: config });
  await app.start();
}
```
````

### Passing Configuration

Configuration flows through function parameters:

```typescript
// ✅ GOOD: Accept config via parameter
export function createService(config: RuntimeConfig): Service {
  return new Service({
    apiKey: config.apiKey,
    logLevel: config.logLevel,
  });
}

// ❌ BAD: Read process.env directly
export function createService(): Service {
  return new Service({
    apiKey: process.env.OAK_API_KEY, // NEVER DO THIS
    logLevel: process.env.LOG_LEVEL, // NEVER DO THIS
  });
}
```

### Testing

Tests pass isolated config objects:

```typescript
import { describe, it, expect } from 'vitest';
import { createService } from './service.js';

describe('Service', () => {
  it('should use provided config', () => {
    // Create isolated config for test
    const testConfig = {
      apiKey: 'test-key',
      logLevel: 'debug',
      // ... other required fields
    };

    const service = createService(testConfig);

    // Test behavior with known config
    expect(service.getApiKey()).toBe('test-key');
  });
});
```

## Rules

### DO

- ✅ Load config once at startup using `loadRuntimeConfig()`
- ✅ Pass config through function parameters
- ✅ Use TypeScript interfaces for config types
- ✅ Document config requirements in TSDoc
- ✅ Test with isolated config objects

### DON'T

- ❌ Read `process.env` in product code (only in `loadRuntimeConfig()`)
- ❌ Create global config singletons
- ❌ Mutate config after loading
- ❌ Use default values in business logic (use them in `loadRuntimeConfig()`)

## Adding New Configuration

When adding a new config value:

1. **Add to Interface**:

```typescript
// src/runtime-config.ts
export interface RuntimeConfig {
  // ... existing fields

  /**
   * New config field description.
   * Explain what it does and valid values.
   */
  newField: string;
}
```

2. **Load in `loadRuntimeConfig()`**:

```typescript
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  return {
    // ... existing fields
    newField: source.NEW_ENV_VAR ?? 'default-value',
  };
}
```

3. **Add Tests**:

```typescript
it('should load newField from environment', () => {
  const config = loadRuntimeConfig({
    NEW_ENV_VAR: 'test-value',
  });

  expect(config.newField).toBe('test-value');
});
```

4. **Use via DI**:

```typescript
export function someFunction(config: RuntimeConfig) {
  // Use config.newField
  const value = config.newField;
}
```

## Common Patterns

### Composition Root

Wire all dependencies at the application entry point:

```typescript
// src/index.ts - Composition Root
async function main() {
  const config = loadRuntimeConfig();
  const logger = createLogger(config);
  const client = createClient(config);
  const service = createService({ config, logger, client });
  const app = createApp({ service, logger });

  await app.start();
}
```

### Partial Config Interfaces

For functions that only need part of the config:

```typescript
// Define subset interface
interface LogConfig {
  logLevel: string;
  packageVersion: string;
}

// Function accepts subset
export function createLogger(config: LogConfig): Logger {
  return pino({
    level: config.logLevel,
    version: config.packageVersion,
  });
}

// RuntimeConfig satisfies LogConfig (structural typing)
const config: RuntimeConfig = loadRuntimeConfig();
const logger = createLogger(config); // Works!
```

## Troubleshooting

### ESLint Error: "process.env access not allowed"

**Problem**: You're reading `process.env` in product code.

**Solution**: Accept config via function parameter instead.

### Type Error: "Property X does not exist on type RuntimeConfig"

**Problem**: You're trying to use a config field that hasn't been added to the interface.

**Solution**: Add the field to `RuntimeConfig` interface and `loadRuntimeConfig()` function.

### Test Fails: "Cannot read property of undefined"

**Problem**: Test is not providing required config fields.

**Solution**: Provide complete config object in test, or use a test helper:

```typescript
// test-helpers.ts
export function createTestConfig(overrides = {}): RuntimeConfig {
  return {
    apiKey: 'test-key',
    logLevel: 'debug',
    // ... all required fields with sensible test defaults
    ...overrides,
  };
}

// In test
const config = createTestConfig({ apiKey: 'custom-key' });
```

## See Also

- [ADR 054: Dependency Injection for Configuration](../architecture/architectural-decisions/0001-dependency-injection-for-configuration.md)
- [Testing Strategy](../../directives-and-memory/testing-strategy.md)
- [Rules: No Global State](.agent/directives-and-memory/rules.md)

**Acceptance Criteria**:

1. ✅ Developer guide created at correct path
2. ✅ Guide explains core principle clearly
3. ✅ Pattern examples provided (good and bad)
4. ✅ Testing examples included
5. ✅ DO/DON'T rules clearly stated
6. ✅ "Adding New Configuration" workflow documented
7. ✅ Common patterns explained (composition root, partial interfaces)
8. ✅ Troubleshooting section included
9. ✅ Links to related documentation provided

**Deterministic Validation**:

```bash
# 1. Verify guide file exists
test -f docs/development/dependency-injection-guide.md
# Expected: exit 0 (file exists)

# 2. Verify guide has required sections
grep "## Core Principle" docs/development/dependency-injection-guide.md
grep "## Pattern" docs/development/dependency-injection-guide.md
grep "## Rules" docs/development/dependency-injection-guide.md
grep "## Adding New Configuration" docs/development/dependency-injection-guide.md
grep "## Common Patterns" docs/development/dependency-injection-guide.md
grep "## Troubleshooting" docs/development/dependency-injection-guide.md
# Expected: MATCH FOUND for each (exit code 0)

# 3. Verify markdown is valid
pnpm markdownlint:root docs/development/dependency-injection-guide.md
# Expected: exit 0, no markdown errors

# 4. Verify code examples are syntactically valid (optional but good)
# Extract code blocks and validate TypeScript syntax
# (Implementation depends on tooling available)
```

**Task Complete When**: All 9 acceptance criteria checked AND all validation commands pass.

---

### Task 0.5.7: Update lib/env Package Documentation

**Purpose**: Clarify the purpose and scope of the `@oaknational/env` workspace, and provide guidance on config management patterns.

**Current Confusion**: The package name suggests it's for shared configuration logic, but it's actually:

1. A runtime adapter for environment variable access (repo root discovery, dotenv loading)
2. A collection of shared configuration helpers
3. Documentation resource for config management patterns

**Changes Required**:

1. **Add TODO section to `packages/libs/env/README.md`**:

````markdown
## TODO: Package Naming and Scope

**Current State**: This package is named `@oaknational/env`, which suggests it provides shared configuration logic for applications. However, its actual purpose is more nuanced:

1. **Runtime Adapter**: Provides helpers for environment-dependent behaviors (finding repo root, loading .env files)
2. **Configuration Helpers**: Utilities that applications use to build their own config layers
3. **Not** Application Config: Does NOT provide shared configuration logic or manage app-specific env vars

**Proposed Renaming**: Consider renaming to better reflect actual purpose:

- `@oaknational/runtime-helpers` - emphasizes utility nature
- `@oaknational/env-helpers` - clarifies it helps with env, doesn't manage it
- `@oaknational/config-utilities` - broader scope including patterns/docs

**Architectural Note**: Each application MUST manage its own configuration:

- Apps define their own `EnvSchema` (Zod validation)
- Apps have their own `runtime-config.ts` (composition layer)
- This package provides TOOLS, not POLICY

## Configuration Management Guidance

### Pattern: Layered Configuration Architecture

Applications should follow this pattern:

1. **Validation Layer** (`src/env.ts`):
   - Define Zod schema for ALL env vars the app needs
   - Single `readEnv()` function that validates process.env
   - ONLY place that accesses process.env directly
   - Returns strongly-typed, validated `Env` object

2. **Composition Layer** (`src/runtime-config.ts`):
   - Imports validated `Env` type
   - Composes higher-level config from `env` object
   - NO direct process.env access
   - Returns `RuntimeConfig` with computed/derived values

3. **Dependency Injection**:
   - Load config ONCE at app startup
   - Pass through function parameters (not global)
   - Tests pass isolated config objects

### Example Structure

```text
apps/my-app/
  src/
    env.ts              # Zod schema + validation (ONLY process.env access)
    runtime-config.ts   # Composition from validated env
    index.ts            # Load config, wire dependencies
    services/
      my-service.ts     # Accepts config via DI
```
````

### Why Not Shared Config?

Each application has unique configuration needs:

- Different env vars required
- Different validation rules
- Different derived/computed config

Trying to share configuration logic would create coupling and reduce flexibility.

**See Also**:

- [Dependency Injection Guide](../../../docs/development/dependency-injection-guide.md)
- [ADR 054: Dependency Injection for Configuration](../../../docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md)

**Acceptance Criteria**:

1. ✅ TODO section added to `packages/libs/env/README.md`
2. ✅ Package naming concern documented with proposed alternatives
3. ✅ Architectural guidance on app-level config management included
4. ✅ Layered configuration pattern documented with examples
5. ✅ Explanation of why config is NOT shared included
6. ✅ Links to related docs (DI guide, ADR) included
7. ✅ Markdown validates with markdownlint

**Deterministic Validation**:

```bash
# 1. Verify TODO section exists
grep "## TODO: Package Naming and Scope" packages/libs/env/README.md
# Expected: MATCH FOUND (exit code 0)

# 2. Verify architectural guidance included
grep "### Pattern: Layered Configuration Architecture" packages/libs/env/README.md
# Expected: MATCH FOUND (exit code 0)

# 3. Verify links to related docs
grep "dependency-injection-guide.md\|0001-dependency-injection-for-configuration.md" packages/libs/env/README.md
# Expected: MATCH FOUND for both (exit code 0)

# 4. Validate markdown
pnpm markdownlint:root packages/libs/env/README.md
# Expected: exit 0, no markdown errors
```

**Task Complete When**: All 7 acceptance criteria checked AND all validation commands pass.

---

**Phase 0.5 Complete Validation**:

```bash
# Run full quality gate after Phase 0.5
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp

# 1. Verify NO process.env bypasses remain
violations=$(grep -r "process\.env\." apps/oak-curriculum-mcp-*/src/ \
  --exclude="*.test.ts" \
  --exclude="*config.ts" \
  --exclude-dir="node_modules" \
  | wc -l)
echo "DI bypass violations found: $violations"
# Expected: 0

# 2. Run quality gates
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint
pnpm test

# 3. Verify documentation exists
test -f docs/architecture/architectural-decisions/0001-dependency-injection-for-configuration.md
test -f docs/development/dependency-injection-guide.md
test -f apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts
test -f apps/oak-curriculum-mcp-stdio/src/runtime-config.ts
# Expected: exit 0 for each (all files exist)

# 4. Validate markdown
pnpm markdownlint:root docs/architecture/architectural-decisions/
pnpm markdownlint:root docs/development/dependency-injection-guide.md
```

**Success Criteria**:

- All commands exit 0
- Zero process.env bypasses in product code
- All documentation created and validated
- All tests pass

**Phase 0.5 Foundation Alignment Check**:

Before proceeding to Phase 1, verify:

- ✅ **rules.md - No Global State**: All process.env access eliminated from product code
- ✅ **rules.md - Single Source of Truth**: All config flows through RuntimeConfig interface
- ✅ **rules.md - Inline docs everywhere**: Exhaustive TSDoc on all config functions
- ✅ **testing-strategy.md - Pure Functions**: Config functions are pure, testable
- ✅ **schema-first-execution.md**: Config structure flows from interface definition

---

### Phase 1: Update Test Helpers (2 hours)

**Foundation Check-In**: Re-read rules.md sections on "Pure functions first", "No global state", and testing-strategy.md on "E2E tests".

**Key Principle**: We are NOT adding new capabilities. The product code ALREADY supports DI perfectly via `loadRuntimeConfig(source)` and `createApp({ runtimeConfig })`. This is about USING existing architecture, not creating new abstractions. (YAGNI, KISS)

#### Task 1.1: Refactor `create-stubbed-http-app.ts`

**Current Implementation** (line 39):

```typescript
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
```

**Target Implementation**:

```typescript
export function createStubbedHttpApp(envOverrides: Partial<NodeJS.ProcessEnv> = {}): Express {
  // Create isolated env - NO global mutation
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    DANGEROUSLY_DISABLE_AUTH: 'true',
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
    CLERK_PUBLISHABLE_KEY: 'pk_test_...',
    CLERK_SECRET_KEY: 'sk_test_...',
    ...envOverrides,
  };

  // Use DI - pass isolated env
  const runtimeConfig = loadRuntimeConfig(testEnv);
  return createApp({ runtimeConfig });
}
```

**Changes**:

- Accept `envOverrides` parameter for test-specific config
- Create isolated `testEnv` object (not mutating `process.env`)
- Use `loadRuntimeConfig(testEnv)` instead of `loadRuntimeConfig()` (default)
- Pass `runtimeConfig` to `createApp()`

**Acceptance Criteria**:

1. ✅ Function signature changed to accept `envOverrides` parameter
2. ✅ Function creates isolated `testEnv` object (not mutating `process.env`)
3. ✅ Function calls `loadRuntimeConfig(testEnv)` with isolated env
4. ✅ Function passes `runtimeConfig` to `createApp({ runtimeConfig })`
5. ✅ No `process.env.X = Y` assignments in function body

**Deterministic Validation**:

```bash
# 1. Verify no direct process.env mutations in the file
grep "process\.env\.[A-Z_]* =" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-stubbed-http-app.ts
# Expected: NO MATCHES (exit code 1)

# 2. Verify function accepts envOverrides parameter
grep "envOverrides.*Partial<NodeJS.ProcessEnv>" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-stubbed-http-app.ts
# Expected: MATCH FOUND (exit code 0)

# 3. Verify loadRuntimeConfig is called with isolated env
grep "loadRuntimeConfig(testEnv)" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-stubbed-http-app.ts
# Expected: MATCH FOUND (exit code 0)

# 4. Run quality gates
pnpm type-check  # Expected: exit 0, no type errors
pnpm lint        # Expected: exit 0, no lint errors
pnpm test        # Expected: exit 0, all tests pass
```

**Task Complete When**: All 5 acceptance criteria checked AND all validation commands pass.

---

#### Task 1.2: Refactor `create-live-http-app.ts`

**Current Implementation** (line 8):

```typescript
export function createLiveHttpApp(): Express {
  return createApp();
}
```

**Target Implementation**:

```typescript
export function createLiveHttpApp(envOverrides: Partial<NodeJS.ProcessEnv> = {}): Express {
  // Create isolated env with live credentials
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    // Copy all required env vars from process.env
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ?? '',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? '',
    OAK_CURRICULUM_API_KEY: process.env.OAK_CURRICULUM_API_KEY ?? '',
    // Explicitly do NOT set DANGEROUSLY_DISABLE_AUTH or USE_STUB_TOOLS
    ...envOverrides,
  };

  // Use DI - pass isolated env
  const runtimeConfig = loadRuntimeConfig(testEnv);
  return createApp({ runtimeConfig });
}
```

**Changes**:

- Accept `envOverrides` parameter
- Create isolated `testEnv` with explicit credential copying
- Use DI for config creation
- Default behavior: auth ENABLED, live tools

**Acceptance Criteria**:

1. ✅ Function signature changed to accept `envOverrides` parameter
2. ✅ Function creates isolated `testEnv` with explicit credential copying
3. ✅ Function does NOT set `DANGEROUSLY_DISABLE_AUTH` or `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` (defaults to secure, live)
4. ✅ Function calls `loadRuntimeConfig(testEnv)` with isolated env
5. ✅ Function passes `runtimeConfig` to `createApp({ runtimeConfig })`
6. ✅ No `process.env.X = Y` assignments in function body

**Deterministic Validation**:

```bash
# 1. Verify no direct process.env mutations in the file
grep "process\.env\.[A-Z_]* =" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-live-http-app.ts
# Expected: NO MATCHES (exit code 1)

# 2. Verify function accepts envOverrides parameter
grep "envOverrides.*Partial<NodeJS.ProcessEnv>" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-live-http-app.ts
# Expected: MATCH FOUND (exit code 0)

# 3. Verify DANGEROUSLY_DISABLE_AUTH is NOT set in testEnv defaults
grep -A 20 "const testEnv" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-live-http-app.ts | grep "DANGEROUSLY_DISABLE_AUTH.*true"
# Expected: NO MATCHES (exit code 1) - auth should be ENABLED by default

# 4. Verify loadRuntimeConfig is called with isolated env
grep "loadRuntimeConfig(testEnv)" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-live-http-app.ts
# Expected: MATCH FOUND (exit code 0)

# 5. Run quality gates
pnpm type-check  # Expected: exit 0, no type errors
pnpm lint        # Expected: exit 0, no lint errors
pnpm test        # Expected: exit 0, all tests pass
```

**Task Complete When**: All 6 acceptance criteria checked AND all validation commands pass.

---

#### Task 1.3: Update Smoke Tests to Follow DI Pattern

**Purpose**: Apply same DI patterns to smoke tests as E2E tests and product code.

**Policy** (from Task 0.5.3): Smoke tests MUST follow DI patterns. No exceptions without explicit user approval.

**Current State**: 48 `process.env` accesses across 15 smoke test files.

**Target Architecture**:

- Smoke tests use helper functions (`createStubbedHttpApp`, `createLiveHttpApp`) with env overrides
- NO direct `process.env` access in smoke test files
- Configuration passed via DI, same as E2E tests

**Changes Required**:

Review each smoke test file and refactor to use:

```typescript
// ✅ GOOD: Use helper with DI
const app = createLiveHttpApp({
  BASE_URL: 'http://localhost:3333',
  // ... other overrides
});

// ❌ BAD: Direct process.env access
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3333';
```

**Acceptance Criteria**:

1. ✅ All smoke test files reviewed and refactored to use DI
2. ✅ Zero direct `process.env` access in smoke test files
3. ✅ Smoke tests use same helper functions as E2E tests
4. ✅ All smoke tests pass after refactoring
5. ✅ ESLint rule catches any new smoke test violations

**Deterministic Validation**:

```bash
# 1. Verify NO process.env in smoke tests
grep -r "process\.env\." apps/oak-curriculum-mcp-streamable-http/smoke-tests/ \
  --exclude-dir="node_modules" \
  -n
# Expected: NO MATCHES (exit code 1)

# 2. Verify smoke tests use helper functions
grep -r "createStubbedHttpApp\|createLiveHttpApp" apps/oak-curriculum-mcp-streamable-http/smoke-tests/ | wc -l
# Expected: > 0 (helpers used)

# 3. Run smoke tests (if available)
cd apps/oak-curriculum-mcp-streamable-http
pnpm smoke:local-stub  # or equivalent
# Expected: All tests pass, exit 0

# 4. Run quality gates
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0, no violations
```

**Task Complete When**: All 5 acceptance criteria checked AND all validation commands pass.

**Note**: If specific smoke test files require `process.env` access for valid reasons (e.g., detecting environment type), document each case and request user approval before proceeding.

---

**Phase 1 Complete Validation**:

```bash
# Run full quality gate after Phase 1
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint
pnpm test
```

**Success Criteria**: All commands exit 0, no regressions introduced.

---

### Phase 2: Update E2E Tests (1 hour)

**Foundation Check-In**: Re-read testing-strategy.md on "E2E tests" and rules.md on "Test to interfaces, not internals".

#### Task 2.1: Update `auth-enforcement.e2e.test.ts`

**Current Implementation** (before line 8):

```typescript
describe('Auth Enforcement (E2E - Production Equivalent)', () => {
  let app: Express;

  beforeAll(() => {
    app = createLiveHttpApp();
  });
  // ...
});
```

**Target Implementation**:

```typescript
describe('Auth Enforcement (E2E - Production Equivalent)', () => {
  let app: Express;

  beforeAll(() => {
    // Explicitly pass env with auth ENABLED
    app = createLiveHttpApp({
      // Ensure DANGEROUSLY_DISABLE_AUTH is NOT set
      DANGEROUSLY_DISABLE_AUTH: undefined,
    });
  });
  // ...
});
```

**Changes**:

- Explicitly pass `envOverrides` to ensure test isolation
- Make test expectations clear in code
- No `process.env` mutation anywhere

**Acceptance Criteria**:

1. ✅ Test calls `createLiveHttpApp({ DANGEROUSLY_DISABLE_AUTH: undefined })`
2. ✅ No `process.env.X = Y` assignments in test file
3. ✅ Test still validates 401/403 responses (auth enforcement behavior)

**Deterministic Validation**:

```bash
# 1. Verify test uses createLiveHttpApp with explicit config
grep "createLiveHttpApp({" apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts
# Expected: MATCH FOUND (exit code 0)

# 2. Verify no process.env mutations in test file
grep "process\.env\.[A-Z_]* =" apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts
# Expected: NO MATCHES (exit code 1)

# 3. Run quality gates
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
pnpm test        # Expected: exit 0

# 4. Run this specific E2E test
cd apps/oak-curriculum-mcp-streamable-http
pnpm test:e2e auth-enforcement.e2e.test.ts
# Expected: All tests pass, exit 0
```

**Task Complete When**: All 3 acceptance criteria checked AND all validation commands pass.

---

#### Task 2.2: Update `auth-bypass.e2e.test.ts`

**Current Implementation** (line 26):

```typescript
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
```

**Target Implementation**:

```typescript
// Remove global mutation entirely - handled by createLiveHttpApp
app = createLiveHttpApp({
  DANGEROUSLY_DISABLE_AUTH: 'true',
});
```

**Changes**:

- Remove `process.env` mutation
- Pass auth bypass config via DI

**Acceptance Criteria**:

1. ✅ Test calls `createLiveHttpApp({ DANGEROUSLY_DISABLE_AUTH: 'true' })`
2. ✅ No `process.env.DANGEROUSLY_DISABLE_AUTH = 'true'` assignment in test file
3. ✅ Test still validates auth bypass behavior (200 responses without Bearer token)

**Deterministic Validation**:

```bash
# 1. Verify test uses createLiveHttpApp with auth bypass config
grep "createLiveHttpApp({" apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-bypass.e2e.test.ts
# Expected: MATCH FOUND (exit code 0)
grep "DANGEROUSLY_DISABLE_AUTH.*true" apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-bypass.e2e.test.ts
# Expected: MATCH FOUND in createLiveHttpApp call (exit code 0)

# 2. Verify no process.env mutations in test file
grep "process\.env\.DANGEROUSLY_DISABLE_AUTH =" apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-bypass.e2e.test.ts
# Expected: NO MATCHES (exit code 1)

# 3. Run quality gates
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
pnpm test        # Expected: exit 0

# 4. Run this specific E2E test
cd apps/oak-curriculum-mcp-streamable-http
pnpm test:e2e auth-bypass.e2e.test.ts
# Expected: All tests pass, exit 0
```

**Task Complete When**: All 3 acceptance criteria checked AND all validation commands pass.

---

#### Task 2.3: Update Other E2E Tests Using Helpers

All tests using `createStubbedHttpApp()` should continue working without changes, since:

- Stub helper already sets `DANGEROUSLY_DISABLE_AUTH: 'true'` in isolated env
- No global state mutation occurs
- Tests remain isolated

**Acceptance Criteria**:

1. ✅ All test files using `createStubbedHttpApp()` reviewed
2. ✅ All test files using `createLiveHttpApp()` reviewed
3. ✅ Zero `process.env.X = Y` assignments found in any E2E test file
4. ✅ All tests continue to pass (no behavioral changes)

**Deterministic Validation**:

```bash
# 1. Find all tests using helper functions
grep -r "createStubbedHttpApp\|createLiveHttpApp" apps/oak-curriculum-mcp-streamable-http/e2e-tests/*.e2e.test.ts
# Expected: List of test files (exit 0), MANUAL REVIEW each file

# 2. Verify NO process.env mutations in ANY E2E test
grep -r "process\.env\.[A-Z_]* =" apps/oak-curriculum-mcp-streamable-http/e2e-tests/*.e2e.test.ts
# Expected: NO MATCHES (exit code 1)

# 3. Count test files to verify complete coverage
find apps/oak-curriculum-mcp-streamable-http/e2e-tests -name "*.e2e.test.ts" | wc -l
# Expected: Known number of test files (for verification completeness)

# 4. Run quality gates
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
pnpm test        # Expected: exit 0
```

**Task Complete When**: All 4 acceptance criteria checked AND all validation commands pass.

---

**Phase 2 Complete Validation**:

```bash
# Run full quality gate after Phase 2 - ALL workspaces
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e  # E2E tests for ALL apps
```

**Success Criteria**: All commands exit 0 across all workspaces. Streamable-http E2E tests show improvement in auth isolation.

---

### Phase 3: Fix stdio E2E Test Arguments (30 minutes)

**Foundation Check-In**: Re-read schema-first-execution.md - "Every byte of runtime behaviour must be driven by generated artefacts that flow directly from the OpenAPI schema".

**Schema-First Context**: The nested → flat argument change flows from the P0 OpenAPI schema fix. When the schema changed, `pnpm type-gen` regenerated tool descriptors with flat argument structures. These tests simply weren't updated at that time. This phase aligns test data with generated types.

**Type Safety Validation**: After fixing arguments, we must verify TypeScript would catch similar issues in the future. If types are too loose (e.g., `Record<string, unknown>`), we've violated rules.md principle: "No type shortcuts".

#### Task 3.1: Update `multi-status-handling.e2e.test.ts`

**Location**: `apps/oak-curriculum-mcp-stdio/e2e-tests/multi-status-handling.e2e.test.ts`

**Current Implementation** (lines 110-116):

```typescript
arguments: {
  params: {
    path: {
      lesson: 'add-and-subtract-two-numbers-that-bridge-through-10',
    },
  },
},
```

**Target Implementation**:

```typescript
arguments: {
  lesson: 'add-and-subtract-two-numbers-that-bridge-through-10',
},
```

**Changes**:

- Remove `params.path` nesting
- Use flat argument structure

**Acceptance Criteria**:

1. ✅ Arguments changed from `{ params: { path: { lesson: 'x' } } }` to `{ lesson: 'x' }`
2. ✅ No `params` or `path` nesting remains in arguments
3. ✅ Test passes with flat structure (validates schema compliance)

**Deterministic Validation**:

```bash
# 1. Verify flat argument structure used
grep -A 5 "arguments:" apps/oak-curriculum-mcp-stdio/e2e-tests/multi-status-handling.e2e.test.ts | grep "lesson:"
# Expected: MATCH FOUND with flat structure (exit 0)

# 2. Verify NO nested params.path structure
grep "params:" apps/oak-curriculum-mcp-stdio/e2e-tests/multi-status-handling.e2e.test.ts
# Expected: NO MATCHES (exit code 1)

# 3. Run quality gates
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
pnpm test        # Expected: exit 0

# 4. Run this specific E2E test
cd apps/oak-curriculum-mcp-stdio
pnpm test:e2e multi-status-handling.e2e.test.ts
# Expected: All tests pass, exit 0
```

**Task Complete When**: All 3 acceptance criteria checked AND all validation commands pass.

---

#### Task 3.2: Update `mcp-protocol.e2e.test.ts`

**Location**: `apps/oak-curriculum-mcp-stdio/e2e-tests/mcp-protocol.e2e.test.ts`

**Current Implementation** (lines 122-128):

```typescript
arguments: {
  params: {
    query: {
      q: 'fractions',
    },
  },
},
```

**Target Implementation**:

```typescript
arguments: {
  q: 'fractions',
},
```

**Changes**:

- Remove `params.query` nesting
- Use flat argument structure

**Acceptance Criteria**:

1. ✅ Arguments changed from `{ params: { query: { q: 'fractions' } } }` to `{ q: 'fractions' }`
2. ✅ No `params` or `query` nesting remains in arguments
3. ✅ Test passes with flat structure (validates schema compliance)

**Deterministic Validation**:

```bash
# 1. Verify flat argument structure used
grep -A 5 "arguments:" apps/oak-curriculum-mcp-stdio/e2e-tests/mcp-protocol.e2e.test.ts | grep "q:"
# Expected: MATCH FOUND with flat structure (exit 0)

# 2. Verify NO nested params.query structure
grep "params:" apps/oak-curriculum-mcp-stdio/e2e-tests/mcp-protocol.e2e.test.ts
# Expected: NO MATCHES (exit code 1)

# 3. Run quality gates
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
pnpm test        # Expected: exit 0

# 4. Run this specific E2E test
cd apps/oak-curriculum-mcp-stdio
pnpm test:e2e mcp-protocol.e2e.test.ts
# Expected: All tests pass, exit 0
```

**Task Complete When**: All 3 acceptance criteria checked AND all validation commands pass.

---

#### Task 3.3: Run stdio E2E Tests

**Acceptance Criteria**:

1. ✅ All 12 stdio E2E tests pass
2. ✅ Zero argument validation errors in output
3. ✅ All tool calls execute successfully
4. ✅ Test output shows no schema-related failures

**Deterministic Validation**:

```bash
# 1. Run all stdio E2E tests
cd apps/oak-curriculum-mcp-stdio
pnpm test:e2e
# Expected: exit 0, "12 passed" in output

# 2. Verify no argument validation errors
pnpm test:e2e 2>&1 | grep -i "argument.*invalid\|validation.*failed"
# Expected: NO MATCHES (exit code 1)

# 3. Verify test count is correct
pnpm test:e2e 2>&1 | grep "passed"
# Expected: "12 passed" visible in output

# 4. Return to repo root
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
```

**Task Complete When**: All 4 acceptance criteria checked AND test suite passes.

---

#### Task 3.4: Verify Type Safety (Critical)

**Question**: Why didn't TypeScript catch the nested argument structure earlier?

**Investigation**:

1. Examine the test file type annotations:

   ```bash
   # Look for type assertions or loose types
   grep -n "arguments:" apps/oak-curriculum-mcp-stdio/e2e-tests/*.e2e.test.ts
   ```

2. Check if arguments are typed as `unknown`, `any`, or `Record<string, unknown>`
   - If YES: This violates rules.md - we've lost type information
   - If NO: TypeScript should have caught the error - investigate why it didn't

3. Verify generated tool descriptors provide strong types:

   ```typescript
   // Should see: ToolArgsForName<"get-lesson-downloads">
   // NOT: Record<string, unknown>
   ```

**Acceptance Criteria**:

1. ✅ Investigation complete: root cause of missed type error identified
2. ✅ If types are loose: follow-up issue filed OR types immediately strengthened
3. ✅ Verification that generated tool descriptors use strong types, not `Record<string, unknown>`
4. ✅ Documentation updated if systemic type safety gap found

**Deterministic Validation**:

```bash
# 1. Check test files for type assertions or loose types
grep -n "as any\|as unknown\|Record<string, unknown>" apps/oak-curriculum-mcp-stdio/e2e-tests/*.e2e.test.ts
# Expected: NO MATCHES (exit code 1) - strong types should be used

# 2. Examine MCP client types in SDK
grep -A 10 "CallToolRequest" packages/sdks/oak-curriculum-sdk/src/types/generated/ -r
# Expected: Find ToolArgsForName<TName> or similar, NOT unknown/any

# 3. Verify tool descriptor argument types are specific
grep "ToolArgsForName\|ToolArgs" packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/ -r | head -20
# Expected: Specific types per tool, not generic Record

# 4. Document findings
# Create or update: docs/architecture/type-safety-analysis.md (if needed)
```

**Task Complete When**: All 4 acceptance criteria checked AND follow-up actions taken if needed.

**Foundation Alignment**: This validates rules.md principle: "Preserve type information - NEVER widen types"

---

**Phase 3 Complete Validation**:

```bash
# Run full quality gate after Phase 3 - ALL workspaces
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e  # E2E tests for ALL apps
```

**Success Criteria**: All commands exit 0 across all workspaces. All 12 stdio E2E tests pass.

---

### Phase 4: Validation (30 minutes)

**Foundation Check-In**: Re-read all three foundation documents (rules.md, testing-strategy.md, schema-first-execution.md). Verify all principles followed throughout implementation.

#### Task 4.1: Run E2E Tests Sequentially

**Acceptance Criteria**:

1. ✅ All stdio E2E tests pass (12 tests)
2. ✅ All streamable-http E2E tests pass (75 tests)
3. ✅ `auth-enforcement.e2e.test.ts` passes consistently (10 consecutive runs)
4. ✅ Zero test failures due to env pollution
5. ✅ Zero argument validation errors

**Deterministic Validation**:

```bash
# 1. Run ALL E2E tests once
pnpm test:e2e
# Expected: exit 0, "87 passed" total (12 stdio + 75 streamable-http)

# 2. Verify stdio test count
cd apps/oak-curriculum-mcp-stdio && pnpm test:e2e 2>&1 | grep "passed"
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
# Expected: "12 passed"

# 3. Verify streamable-http test count
cd apps/oak-curriculum-mcp-streamable-http && pnpm test:e2e 2>&1 | grep "passed"
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
# Expected: "75 passed"

# 4. Run auth-enforcement test 10 times (test isolation)
for i in {1..10}; do
  echo "Run $i/10"
  cd apps/oak-curriculum-mcp-streamable-http
  pnpm test:e2e auth-enforcement.e2e.test.ts || break
  cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
done
# Expected: 10/10 passes (no race conditions)

# 5. Verify no validation errors in last full run
pnpm test:e2e 2>&1 | grep -i "argument.*invalid\|validation.*failed\|env.*pollution"
# Expected: NO MATCHES (exit code 1)
```

**Task Complete When**: All 5 acceptance criteria checked AND all validation commands pass.

---

#### Task 4.2: Verify Test Isolation (Manual Validation)

**Principle**: Test isolation is best validated through manual inspection and repeated execution, not by "testing the tests".

**Acceptance Criteria**:

1. ✅ Zero `process.env` assignments found in E2E test files (static analysis)
2. ✅ `process.env` unchanged after test suite execution (integrity check)
3. ✅ Tests pass 10 consecutive times (no race conditions)
4. ✅ All helper files use DI pattern (manual code review)

**Manual Verification Steps**:

1. **Static Analysis - No Global Mutations**:

   ```bash
   # Should find ZERO occurrences of process.env assignments
   grep -r "process\.env\.[A-Z_]* =" apps/*/e2e-tests/ --exclude="*.md"
   ```

2. **Process Env Integrity Check**:

   ```bash
   # Before running tests, capture process.env
   node -e "console.log(JSON.stringify(process.env))" > /tmp/env-before.json

   # Run E2E tests
   pnpm test:e2e

   # After tests, verify process.env unchanged
   node -e "console.log(JSON.stringify(process.env))" > /tmp/env-after.json
   diff /tmp/env-before.json /tmp/env-after.json
   # Expected: NO DIFFERENCES (tests didn't mutate global state)
   ```

3. **Isolation Through Repeated Runs**:

   ```bash
   # Run tests 10 times - should pass consistently
   for i in {1..10}; do
     echo "Run $i/10"
     pnpm test:e2e || break
   done
   # Expected: 10/10 passes (no race conditions from state leakage)
   ```

4. **Manual Code Review**:
   - Review all helper files: `e2e-tests/helpers/*.ts`
   - Verify NO `process.env.X = Y` assignments
   - Verify ALL use `loadRuntimeConfig(isolatedEnv)`
   - Verify ALL pass `{ runtimeConfig }` to `createApp()`

**Why Manual?**: Attempting to test test infrastructure creates complexity without proving correctness. The proof is in repeated execution and inspection, not in meta-tests.

**Task Complete When**: All 4 acceptance criteria checked AND manual verification steps completed with expected results.

---

#### Task 4.3: Full Quality Gate

**Acceptance Criteria**:

1. ✅ All quality gates pass: type-gen, build, type-check, lint, docs, format, markdownlint, test, test:e2e
2. ✅ Zero errors across all workspaces
3. ✅ Zero warnings that require action
4. ✅ All commands exit with code 0

**Deterministic Validation**:

Run complete quality gate sequence:

```bash
# Run each command and verify exit 0
pnpm i                                              # Expected: exit 0
pnpm type-gen                                       # Expected: exit 0, types regenerated
pnpm build                                          # Expected: exit 0, all packages built
pnpm type-check                                     # Expected: exit 0, no type errors
pnpm lint -- --fix                                  # Expected: exit 0, no lint errors
pnpm -F @oaknational/oak-curriculum-sdk docs:all   # Expected: exit 0, docs generated
pnpm format:root                                    # Expected: exit 0, files formatted
pnpm markdownlint:root                              # Expected: exit 0, markdown valid
pnpm test                                           # Expected: exit 0, all unit/integration tests pass
pnpm test:e2e                                       # Expected: exit 0, all E2E tests pass

# Verify final state
echo $?  # Expected: 0 (last command successful)
```

**Task Complete When**: All 4 acceptance criteria checked AND all commands exit 0.

---

#### Task 4.4: Foundation Document Compliance Checklist

**Final verification against foundation documents**:

- [ ] **rules.md - Cardinal Rule**: No changes to type generation. `pnpm type-gen` output unchanged (Phase 3 uses existing generated types)
- [ ] **rules.md - No Type Shortcuts**: Verified no `as`, `any`, `Record<string, unknown>` added (Task 3.4)
- [ ] **rules.md - No Global State**: Verified no `process.env` mutations (Task 4.2)
- [ ] **rules.md - No Compatibility Layers**: We replaced old approach, not wrapped it (Phases 1-2)
- [ ] **rules.md - Quality Gates**: All gates pass across all workspaces (Task 4.3)
- [ ] **testing-strategy.md - Test Behavior**: Tests validate auth enforcement behavior, not implementation
- [ ] **testing-strategy.md - E2E Definition**: Tests validate running systems in separate processes ✅
- [ ] **testing-strategy.md - Simple Mocks**: No complex mocks added (used existing DI)
- [ ] **schema-first-execution.md - Generator First**: Flat arguments flow from generated types (Phase 3)
- [ ] **System-Level Impact**: Tests are now reliable, developers can trust them, velocity improved

**Acceptance Criteria**:

1. ✅ All 10 checklist items verified and checked
2. ✅ Any unchecked items have documented justification OR are immediately fixed
3. ✅ Foundation documents reviewed and compliance confirmed

**Task Complete When**: All checklist items checked AND acceptance criteria met.

**If any item unchecked**: Stop and fix before proceeding.

---

## Testing Strategy

### Unit Tests

No new unit tests required - existing unit tests for `loadRuntimeConfig` already cover DI behavior.

**Existing Coverage**:

- `runtime-config.unit.test.ts` - tests config loading with various env inputs
- `security-config.unit.test.ts` - tests security config resolution

---

### Integration Tests

**No new integration tests required** - existing unit tests for `loadRuntimeConfig()` and `createApp()` already validate the DI pathway. We're simply USING existing, tested capabilities.

**Existing Coverage**:

- `runtime-config.unit.test.ts` - validates config loading with isolated env objects
- `security-config.unit.test.ts` - validates security flag resolution

**Principle**: Don't test test infrastructure. The E2E tests themselves prove the DI pathway works by executing successfully with isolated configs (Task 4.1, 4.2).

---

### E2E Tests

**Modified Tests**:

- `auth-enforcement.e2e.test.ts` - updated to use DI
- `auth-bypass.e2e.test.ts` - updated to use DI
- All other E2E tests - continue using helpers (no changes needed)

**Validation**:

- Run tests 10 times consecutively: `for i in {1..10}; do pnpm test:e2e || break; done`
- All runs must pass (no race conditions)

---

## Success Criteria

### Phase 0 (Foundation Verification)

- ✅ All `process.env` reads verified to be in config layer only
- ❌ DI bypasses found in handlers, services, middleware (12+ violations)
- ✅ All violations documented
- ❌ Foundation assumption invalidated: DI is NOT the only config pathway → **Phase 0.5 required**

### Phase 0.5 (Complete Product Code DI Implementation)

- ✅ **Task 0.5.1**: EnvSchema extended in streamable-http; runtime-config.ts uses validated env object only
- ✅ **Task 0.5.2**: Runtime config created for stdio with full Zod validation
- ✅ **Task 0.5.3**: ESLint rules added to both apps to prevent process.env access
- ✅ **Task 0.5.4**: Unit tests added/updated for DI config loading in both apps
- ✅ **Task 0.5.5**: ADR 054 created documenting DI architecture decision docs/architecture/architectural-decisions
- ✅ **Task 0.5.6**: Developer guide created with DI patterns, examples, troubleshooting
- ✅ **Task 0.5.7**: lib/env README updated with TODO and config management guidance
- ✅ Zero `process.env` reads outside of validation layer (env.ts or runtime-config.ts)
- ✅ All functions have exhaustive TSDoc (@param, @returns, @remarks, @example)
- ✅ All quality gates pass
- ✅ All documentation validated via markdownlint

### Phase 0.9 (Cleanup - COMPLETED ✅)

- ✅ Deleted tests violating workspace boundaries
- ✅ All deleted test coverage maintained in proper E2E tests
- ✅ `pnpm test` passes (unit/integration tests fixed)

### Phase 1 (Test Helpers - streamable-http)

- ✅ `create-stubbed-http-app.ts` uses isolated env, no global mutation
- ✅ `create-live-http-app.ts` uses isolated env, no global mutation
- ✅ Both helpers accept `envOverrides` parameter
- ✅ All 15 smoke test files refactored to use DI (48 process.env accesses eliminated)
- ✅ Zero `process.env` mutations in smoke tests (no exceptions granted)

### Phase 2 (E2E Tests - streamable-http)

- ✅ `auth-enforcement.e2e.test.ts` uses DI, no global mutation
- ✅ `auth-bypass.e2e.test.ts` uses DI, no global mutation
- ✅ Zero `process.env` mutations in any E2E test file
- ✅ All streamable-http E2E tests pass (75 tests)

### Phase 3 (E2E Tests - stdio)

- ✅ `multi-status-handling.e2e.test.ts` uses flat arguments
- ✅ `mcp-protocol.e2e.test.ts` uses flat arguments
- ✅ All stdio E2E tests pass (12 tests)

### Phase 4 (Validation)

- ✅ All E2E tests pass consistently (10 consecutive runs)
- ✅ No race conditions detected
- ✅ No argument validation errors
- ✅ Full quality gate passes
- ✅ Static analysis confirms no `process.env` mutations

### Overall

- ✅ Test isolation achieved
- ✅ Race conditions eliminated
- ✅ Flat schema arguments working correctly
- ✅ Workspace boundaries respected
- ✅ No behavioral changes to product code
- ✅ Test architecture improved (simpler, more maintainable)

---

## Dependencies

**Blocking**: None - can implement immediately

**Related Plans**:

- `streamable-http-quality-gate-fixes.md` - complementary code quality work

**Prerequisites**:

- ✅ Product code already supports DI (`loadRuntimeConfig`, `createApp`)
- ✅ Race condition identified and root cause understood

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: "Why are we doing this, and why does that matter?"

**Immediate Value**:

- **Reliability**: Tests pass consistently, no intermittent failures
- **Debuggability**: Test failures indicate real bugs, not env pollution
- **Simplicity**: No complex setup/teardown logic needed

**System-Level Impact**:

- **Velocity**: Developers trust tests, run them frequently
- **Maintainability**: Tests are simple, easy to understand and modify
- **Architecture**: Forces good design (DI, pure functions, no global state)
- **CI/CD**: Reliable tests enable confident automated deployment

**Risk of Not Doing**:

- **False positives**: Tests fail for wrong reasons (env pollution, not bugs)
- **False negatives**: Tests pass but leave env pollution that breaks later tests
- **Developer friction**: Flaky tests reduce trust, slow development
- **Hidden bugs**: Race conditions mask real issues

### Alignment with @rules.md and @testing-strategy.md

**From testing-strategy.md**:

> "Unit tests: no I/O, no mocks, test pure functions in isolation"
> "Integration tests: simple injected mocks, no actual I/O"
> "E2E tests: full stack, but isolated test data"

**From rules.md**:

> "Avoid complex setup/teardown - signal to simplify"
> "Use pure functions with dependency injection"
> "Type safety and validation at boundaries"

**This Plan**:

- ✅ Eliminates complex env cleanup (setup/teardown)
- ✅ Uses DI for test isolation
- ✅ Maintains type safety (uses existing typed interfaces)
- ✅ No new mocks or test complexity

---

## References

- Product code DI: `src/runtime-config.ts:loadRuntimeConfig()`
- App bootstrap: `src/application.ts:createApp()`
- Test helpers: `e2e-tests/helpers/create-*-http-app.ts`
- Failing test: `e2e-tests/auth-enforcement.e2e.test.ts`
- Testing strategy: `.agent/directives-and-memory/testing-strategy.md`
- Rules: `.agent/directives-and-memory/rules.md`
- Vitest config: `apps/oak-curriculum-mcp-streamable-http/vitest.e2e.config.ts`

---

## Implementation Notes

### Key Insight

The product code **already supports DI perfectly** - we just need to **use it in tests** instead of fighting against it with global state mutation.

### Migration Path

1. **Phase 1**: Fix helpers (central point of control)
2. **Phase 2**: Fix tests that directly mutate env
3. **Phase 3**: Validate isolation with repeated runs

### Minimal Risk

- No product code changes required
- Test behavior unchanged (same logic, different isolation mechanism)
- Can implement incrementally (one test file at a time)
- Easy to verify (run tests repeatedly, check for consistency)

---

## Validation Checklist

Run these commands to verify all fixes:

```bash
# Full quality gate sequence
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
pnpm type-gen   # Generate types
pnpm build      # Build all packages
pnpm type-check # Type check
pnpm lint       # Lint
pnpm test       # Unit & integration tests
pnpm test:e2e   # E2E tests

# Stability check (run 10 times)
for i in {1..10}; do
  echo "Run $i/10"
  pnpm test:e2e || break
done
```

**Expected Results**:

- ✅ All commands exit 0
- ✅ No type errors
- ✅ No lint errors
- ✅ All 12 stdio E2E tests pass
- ✅ All 75 streamable-http E2E tests pass
- ✅ 10/10 consecutive E2E test runs pass

---

## Code Quality Verification

Run these checks to confirm architectural compliance:

```bash
# No workspace boundary violations
grep -r "from.*@oaknational/oak-curriculum-sdk" apps/oak-curriculum-mcp-streamable-http/src/*.test.ts
# Expected: NO MATCHES (tests should not import SDK)

# No global state mutations in E2E tests
grep -r "process\.env\." apps/*/e2e-tests/ --exclude="*.md"
# Expected: NO MATCHES (should use DI instead)

# No prohibited types in E2E tests
grep -r "Record<string, unknown>" apps/*/e2e-tests/
# Expected: NO MATCHES (should use generated types)

# Verify flat arguments in stdio E2E tests
grep -r "params:" apps/oak-curriculum-mcp-stdio/e2e-tests/*.e2e.test.ts
# Expected: NO MATCHES (should use flat structure)
```

---

## Future Enhancements (Out of Scope)

- ~~Add ESLint rule to prevent future `process.env` mutations~~ ✅ **DONE in Task 0.5.3**
- ~~Document DI pattern in testing guide~~ ✅ **DONE in Task 0.5.6**
- Consider extracting common env configurations to test fixtures
- Apply same pattern to unit/integration tests if needed (currently E2E and smoke tests covered)
- Add contract tests to validate schema evolution compatibility
- Consider renaming `@oaknational/env` package (see Task 0.5.7 TODO)
