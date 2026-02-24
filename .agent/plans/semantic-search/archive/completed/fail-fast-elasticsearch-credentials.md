---
name: Fail Fast on Missing Elasticsearch Credentials
overview: >
  Remove six layers of silent degradation across three workspaces. When
  Elasticsearch credentials are missing, the server MUST fail at startup
  with a helpful error message — not start normally and return "not
  configured" when tools are invoked. In stub mode, a stub
  SearchRetrievalService replaces the real ES connection entirely.
todos:
  - id: red-env-validation
    content: "RED: Write integration tests specifying that readEnv (HTTP) throws when ES credentials are missing, and loadRuntimeConfig (STDIO) throws when ES credentials are missing. Run tests — they MUST fail."
    status: pending
  - id: red-http-factory
    content: "RED: Update search-retrieval-factory.integration.test.ts — delete the 'when credentials are missing' describe block entirely (5 tests). Change factory call signatures to use required env fields. Run tests — they MUST fail (type errors, factory still has old signature)."
    status: pending
  - id: red-sdk-not-configured
    content: "RED: Delete 'returns error when searchRetrieval is not configured' tests from all three SDK tool integration tests (search-sdk, browse, explore). Change createDeps() to require SearchRetrievalService (no undefined). Run tests — they MUST fail (type errors, searchRetrieval still optional)."
    status: pending
  - id: green-sdk-stub-search
    content: "GREEN: Create search-retrieval-stub.ts in the SDK with createStubSearchRetrieval(). Export from public/mcp-tools.ts. Uses ok() from @oaknational/result to return empty result sets."
    status: pending
  - id: green-sdk-types
    content: "GREEN: Make searchRetrieval required in UniversalToolExecutorDependencies (universal-tool-shared.ts). Remove the ? and update TSDoc."
    status: pending
  - id: green-sdk-execution
    content: "GREEN: Remove NOT_CONFIGURED_MESSAGE constant and the if (deps.searchRetrieval === undefined) guard from all three execution files (aggregated-search-sdk, aggregated-browse, aggregated-explore). These branches are now unreachable — delete them, trust the types."
    status: pending
  - id: green-http-env
    content: "GREEN: In env.ts, change ElasticsearchEnvSchema.partial().shape to ElasticsearchEnvSchema.shape. ES credentials are now required at env validation time. Update TSDoc."
    status: pending
  - id: green-http-factory
    content: "GREEN: In search-retrieval-factory.ts, make env parameter fields required. Change return type to SearchRetrievalService. Remove the if-missing branch entirely (unreachable after env validation). Remove the logging branch for not-configured."
    status: pending
  - id: green-http-handlers
    content: "GREEN: In handlers.ts, change searchRetrieval from optional (?) to required in ToolHandlerDependencies, RegisterHandlersOptions, and buildToolHandlerDependencies parameter."
    status: pending
  - id: green-http-stub-wiring
    content: "GREEN: In application.ts initializeCoreEndpoints, use createStubSearchRetrieval() in stub mode instead of creating a real ES client with dummy credentials."
    status: pending
  - id: green-stdio-config
    content: "GREEN: In runtime-config.ts (STDIO), make ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY required in StdioEnv. Add fail-fast validation in loadRuntimeConfig that throws with helpful error when credentials are missing."
    status: pending
  - id: green-stdio-wiring
    content: "GREEN: In wiring.ts (STDIO), simplify createSearchRetrieval (remove unreachable if-missing branch). Use createStubSearchRetrieval() in stub mode, real factory otherwise."
    status: pending
  - id: green-stdio-tools
    content: "GREEN: In tools/index.ts (STDIO), change searchRetrieval from optional (?) to required in UniversalToolExecutors."
    status: pending
  - id: green-test-helpers
    content: "GREEN: Add and export createFakeSearchRetrieval() from HTTP server test-helpers/fakes.ts (move from search-retrieval-factory.integration.test.ts)."
    status: pending
  - id: green-e2e-http
    content: "GREEN: Add dummy ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY to create-stubbed-http-app.ts testEnv and createMockRuntimeConfig() in test-config.ts."
    status: pending
  - id: green-e2e-stdio
    content: "GREEN: Add dummy ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY to all STDIO E2E test env blocks."
    status: pending
  - id: green-smoke
    content: "GREEN: Add dummy ES credentials to smoke local-stub.ts env setup."
    status: pending
  - id: green-tests-pass
    content: "GREEN: All tests pass — run pnpm test and pnpm test:e2e."
    status: pending
  - id: refactor-tsdoc
    content: "REFACTOR: Remove 'When absent, search tools return not configured errors' from all TSDoc. Remove 'optional' language from server READMEs. Update ElasticsearchEnvSchema TSDoc in shared env package."
    status: pending
  - id: refactor-docs
    content: "REFACTOR: Update session prompt, Phase 3a plan, and roadmap to reflect that searchRetrieval is now required."
    status: pending
  - id: quality-gates
    content: "REFACTOR: Full quality gate chain (type-gen, build, type-check, lint:fix, format:root, markdownlint:root, test, test:e2e, test:ui, smoke:dev:stub). All must pass."
    status: pending
isProject: false
---

# Fail Fast on Missing Elasticsearch Credentials

**Status**: ✅ Complete (2026-02-18)
**Priority**: High — blocking tool usability verification (WS5)
**Parent**: [Phase 3a — MCP Search Integration](phase-3a-mcp-search-integration.md)
**Branch**: `feat/semantic_search_deployment`

---

## Problem

Six layers of silent degradation exist across three workspaces. When
Elasticsearch credentials are missing, the server starts normally,
registers all search tools, and only returns a "not configured" error
when a user actually invokes one. This violates two core rules:

1. **Fail FAST** — never silently ignore errors
2. **Keep it strict** — don't invent optionality

The result is that an operator or developer sees the search tools in
the tool list, assumes they work, calls one, and gets a cryptic
"not configured" response. This is exactly the failure mode that
fail-fast is designed to prevent.

### Six Layers of Silent Degradation

| Layer | File | Current Behaviour |
|-------|------|-------------------|
| 1. Env schema | `apps/.../src/env.ts` | `ElasticsearchEnvSchema.partial().shape` — ES creds optional at validation |
| 2. HTTP factory | `apps/.../src/search-retrieval-factory.ts` | Returns `undefined` when creds missing |
| 3. HTTP handlers | `apps/.../src/handlers.ts` | `searchRetrieval?: SearchRetrievalService` |
| 4. STDIO wiring | `apps/.../src/app/wiring.ts` | Returns `undefined` when creds missing |
| 5. SDK types | `packages/.../src/mcp/universal-tool-shared.ts` | `searchRetrieval?: SearchRetrievalService` |
| 6. SDK execution (x3) | `packages/.../aggregated-*/execution.ts` | `if (deps.searchRetrieval === undefined) return formatError(NOT_CONFIGURED_MESSAGE)` |

### Additionally in STDIO

| Layer | File | Current Behaviour |
|-------|------|-------------------|
| Config | `apps/.../src/runtime-config.ts` | `ELASTICSEARCH_URL?: string` |
| Tools | `apps/.../src/tools/index.ts` | `searchRetrieval?: SearchRetrievalService` |

---

## Design Decision

The server MUST fail at startup if Elasticsearch credentials are
missing. The search tools (`search-sdk`, `browse-curriculum`,
`explore-topic`) are always registered in `AGGREGATED_TOOL_DEFS`.
If they exist in the tool list, they must function. There is no
valid "partial" state where tools are listed but don't work.

### Stub Mode

In stub mode (`OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`), ALL
external dependencies are replaced with stubs. This includes
the SearchRetrievalService. The server MUST NOT create a real
ES client with dummy credentials in stub mode — that is a lie
(infrastructure that looks real but isn't). Instead, a
`createStubSearchRetrieval()` function in the SDK provides a
pure-data stub that returns empty result sets. No ES client
is constructed, no real connection is attempted.

```text
Current: Silent Degradation          Proposed: Fail Fast
─────────────────────────           ──────────────────────
env:     ES creds optional    →     env:     ES creds REQUIRED
factory: returns undefined    →     factory: always returns service
type:    searchRetrieval?     →     type:    searchRetrieval (required)
tool:    returns "not config" →     tool:    always has service
stub:    no searchRetrieval   →     stub:    createStubSearchRetrieval()
```

### Trust the Types

Once the entry-point validation (Zod env schema for HTTP,
`loadRuntimeConfig` for STDIO) guarantees that ES credentials
are present, all downstream code trusts those types. There are
no "defence-in-depth" re-checks for missing credentials in
factories or execution functions. The type system guarantees
presence. Unreachable branches are deleted, not retained.
This follows "Types from the schema" and avoids dead code.

---

## Testing Implication

### Dummy Credentials for Env Validation

E2E tests and smoke tests currently run without live ES
credentials. After this change, they must provide dummy
credentials (`ELASTICSEARCH_URL=http://fake-es:9200`,
`ELASTICSEARCH_API_KEY=fake-api-key`) to pass env validation.
These dummy values are never used to create a real ES client
because stub mode uses `createStubSearchRetrieval()` instead.

### Stub SearchRetrievalService in the SDK

A new `createStubSearchRetrieval()` function is added to the
curriculum SDK, alongside the existing `createStubToolExecutionAdapter()`.
It returns a `SearchRetrievalService` that resolves all methods with
empty `ok` results (zero items, no errors). It uses the `ok()` helper
from `@oaknational/result` for type safety.

This stub is used in product code (both MCP servers, when in stub
mode) — it is NOT a test fake. Test fakes use `vi.fn()` and live
in test-helpers. The stub uses plain functions and lives in the SDK.

### Test Fake in HTTP Test Helpers

The existing `createFakeRetrieval()` in the factory integration test
is promoted to `test-helpers/fakes.ts` as `createFakeSearchRetrieval()`.
This uses `vi.fn()` for assertion support and is used in tests only.

### STDIO loadRuntimeConfig Validation

The STDIO server does not use Zod (that alignment is a separate
backlog item). Instead, `loadRuntimeConfig` gains explicit validation
that throws with a helpful error when ES credentials are missing.
This is fail-fast at the entry point — the earliest possible moment.

---

## Changes by File

### 1. SDK: Create stub SearchRetrievalService

**New file**: `packages/sdks/oak-curriculum-sdk/src/mcp/search-retrieval-stub.ts`

Creates a pure-data stub that satisfies `SearchRetrievalService`
without any external dependencies. All methods return `ok` results
with empty result sets.

```typescript
import { ok } from '@oaknational/result';
import type { SearchRetrievalService } from './search-retrieval-types.js';

/**
 * Creates a stub SearchRetrievalService for use in stub mode.
 *
 * Returns empty result sets for all methods. No Elasticsearch
 * client is created, no real connection is attempted. Used by
 * both MCP servers when OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true.
 *
 * This is NOT a test fake — test fakes use vi.fn() for assertion
 * support. This stub uses plain functions for production stub mode.
 */
export function createStubSearchRetrieval(): SearchRetrievalService {
  return {
    searchLessons: () =>
      Promise.resolve(ok({ scope: 'lessons', total: 0, took: 0, timedOut: false, results: [] })),
    searchUnits: () =>
      Promise.resolve(ok({ scope: 'units', total: 0, took: 0, timedOut: false, results: [] })),
    searchSequences: () =>
      Promise.resolve(ok({ scope: 'sequences', total: 0, took: 0, timedOut: false, results: [] })),
    searchThreads: () =>
      Promise.resolve(ok({ scope: 'threads', total: 0, took: 0, timedOut: false, results: [] })),
    suggest: () =>
      Promise.resolve(ok({ suggestions: [], cache: { version: '1', ttlSeconds: 300 } })),
    fetchSequenceFacets: () =>
      Promise.resolve(ok({ sequences: [] })),
  };
}
```

**Export**: Add to `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts`:

```typescript
export { createStubSearchRetrieval } from '../mcp/search-retrieval-stub.js';
```

### 2. SDK: Make searchRetrieval required

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`
**Line**: 48

```typescript
// Before
readonly searchRetrieval?: SearchRetrievalService;

// After
readonly searchRetrieval: SearchRetrievalService;
```

Rewrite TSDoc on the `searchRetrieval` field:

```typescript
/**
 * Search retrieval service for SDK-backed search tools.
 *
 * Used by search-sdk, browse-curriculum, and explore-topic tools
 * to query Elasticsearch directly via the Search SDK. The type is
 * structurally compatible with Search SDK's RetrievalService.
 *
 * Provided by the MCP server wiring: real ES service in production,
 * stub service (createStubSearchRetrieval) in stub mode.
 */
readonly searchRetrieval: SearchRetrievalService;
```

### 3. SDK: Remove "not configured" guards from all three tools

These guards checked `if (deps.searchRetrieval === undefined)`.
After making `searchRetrieval` required in the type, these
branches are unreachable. Delete them entirely — trust the types.

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.ts`

- Delete `NOT_CONFIGURED_MESSAGE` constant (lines 24-27)
- Delete `if (deps.searchRetrieval === undefined)` guard (lines 166-168)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/execution.ts`

- Delete `NOT_CONFIGURED_MESSAGE` constant (lines 19-22)
- Delete `if (deps.searchRetrieval === undefined)` guard (lines 45-47)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/execution.ts`

- Delete `NOT_CONFIGURED_MESSAGE` constant (lines 20-23)
- Delete `if (deps.searchRetrieval === undefined)` guard (lines 149-151)

### 4. HTTP server: Make env schema require ES credentials

**File**: `apps/oak-curriculum-mcp-streamable-http/src/env.ts`
**Line**: 69

```typescript
// Before
const EnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.partial().shape)

// After
const EnvSchema = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape)
```

Rewrite the TSDoc on `EnvSchema`:

```typescript
/**
 * HTTP server environment schema.
 *
 * Composes shared contracts from @oaknational/mcp-env with
 * HTTP-server-specific fields. Elasticsearch credentials are
 * required — the server fails at startup if they are absent.
 */
```

### 5. HTTP server: Simplify factory (trust the types)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/search-retrieval-factory.ts`
**Lines**: 44-91

The env parameter fields become required. The return type becomes
`SearchRetrievalService` (not `| undefined`). The `if-missing`
branch is deleted entirely — the entry-point env validation
(step 4) guarantees credentials are present. There is nothing to
check and no error to throw. The factory always succeeds.

New overload signatures:

```typescript
/**
 * Creates a SearchRetrievalService from validated environment credentials.
 *
 * @param env - Environment variables with ES credentials (validated by env schema)
 * @param logger - Logger for startup messages
 * @returns SearchRetrievalService connected to Elasticsearch
 */
export function createSearchRetrieval(
  env: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string },
  logger: { info: (msg: string) => void },
): SearchRetrievalService;

/**
 * Creates a SearchRetrievalService with injectable factory dependencies.
 *
 * @param env - Environment variables with ES credentials (validated by env schema)
 * @param logger - Logger for startup messages
 * @param factories - Injectable factory dependencies for testability
 * @returns SearchRetrievalService connected to Elasticsearch
 */
export function createSearchRetrieval<TClient>(
  env: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string },
  logger: { info: (msg: string) => void },
  factories: SearchRetrievalFactories<TClient>,
): SearchRetrievalService;

export function createSearchRetrieval(
  env: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string },
  logger: { info: (msg: string) => void },
  factories: SearchRetrievalFactories = defaultFactories,
): SearchRetrievalService {
  const esClient = factories.createEsClient({
    node: env.ELASTICSEARCH_URL,
    auth: { apiKey: env.ELASTICSEARCH_API_KEY },
  });
  const searchSdk = factories.createSdk({
    deps: { esClient },
    config: { indexTarget: 'primary' },
  });
  logger.info('Search retrieval service configured (Elasticsearch connected)');
  return searchSdk.retrieval;
}
```

Delete the `if-missing` branch, the `return undefined` path,
and the "not configured" log message. They are dead code.

### 6. HTTP server: Remove optionality from wiring

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

- **Line 27**: `readonly searchRetrieval?: SearchRetrievalService`
  to `readonly searchRetrieval: SearchRetrievalService` in
  `ToolHandlerDependencies`
- **Line 38**: Same change in `RegisterHandlersOptions`
- **Line 57**: `searchRetrieval: SearchRetrievalService | undefined`
  to `searchRetrieval: SearchRetrievalService` in
  `buildToolHandlerDependencies`

### 7. HTTP server: Stub mode wiring

**File**: `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
**Function**: `initializeCoreEndpoints` (line 153)

In stub mode, use `createStubSearchRetrieval()` from the SDK
instead of creating a real ES client with dummy credentials.
In real mode, use `createSearchRetrieval()` as before.

```typescript
// Before
const searchRetrieval = createSearchRetrieval(runtimeConfig.env, log);

// After
import { createStubSearchRetrieval } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

const searchRetrieval = runtimeConfig.useStubTools
  ? createStubSearchRetrieval()
  : createSearchRetrieval(runtimeConfig.env, log);
```

This ensures stub mode never constructs real ES infrastructure.

### 8. STDIO server: Make credentials required with validation

**File**: `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts`
**Lines**: 19-20

Make `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` required
in the `StdioEnv` interface:

```typescript
// Before
readonly ELASTICSEARCH_URL?: string;
readonly ELASTICSEARCH_API_KEY?: string;

// After
readonly ELASTICSEARCH_URL: string;
readonly ELASTICSEARCH_API_KEY: string;
```

**Lines**: 53-73 (`loadRuntimeConfig`)

Add fail-fast validation before constructing `StdioEnv`. This is
the entry-point validation for the STDIO server (analogous to the
Zod env schema in the HTTP server). The STDIO server does not use
Zod — that alignment is a separate backlog item
(`stdio-http-server-alignment.md`). The validation uses explicit
checks with helpful error messages.

```typescript
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const rawLogLevel = source.LOG_LEVEL?.toLowerCase();
  const logLevel = isValidLogLevel(rawLogLevel) ? rawLogLevel : 'info';

  // Fail fast: ES credentials are required for search tools
  const esUrl = source.ELASTICSEARCH_URL;
  const esApiKey = source.ELASTICSEARCH_API_KEY;
  if (!esUrl) {
    throw new Error(
      'ELASTICSEARCH_URL is required. ' +
      'Set this environment variable to the Elasticsearch cluster URL.',
    );
  }
  if (!esApiKey) {
    throw new Error(
      'ELASTICSEARCH_API_KEY is required. ' +
      'Set this environment variable to the Elasticsearch API key.',
    );
  }

  const env: StdioEnv = {
    LOG_LEVEL: source.LOG_LEVEL,
    ENVIRONMENT_OVERRIDE: source.ENVIRONMENT_OVERRIDE,
    MCP_LOGGER_STDOUT: source.MCP_LOGGER_STDOUT,
    MCP_LOGGER_FILE_PATH: source.MCP_LOGGER_FILE_PATH,
    MCP_LOGGER_FILE_APPEND: source.MCP_LOGGER_FILE_APPEND,
    OAK_API_KEY: source.OAK_API_KEY,
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS,
    ELASTICSEARCH_URL: esUrl,           // narrowed to string by validation above
    ELASTICSEARCH_API_KEY: esApiKey,     // narrowed to string by validation above
  };

  return {
    logLevel,
    env,
    useStubTools: toBooleanFlag(source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS),
  };
}
```

### 9. STDIO server: Simplify factory and wiring

**File**: `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts`
**Lines**: 98-122

The local `createSearchRetrieval` function simplifies: `StdioEnv`
now guarantees ES credentials are present, so the `if-missing`
branch is deleted. The function always returns `SearchRetrievalService`.

```typescript
/**
 * Creates a SearchRetrievalService from validated STDIO environment.
 */
function createSearchRetrieval(
  env: StdioEnv,
  logger: { info: (msg: string) => void },
): SearchRetrievalService {
  const esClient = new Client({ node: env.ELASTICSEARCH_URL, auth: { apiKey: env.ELASTICSEARCH_API_KEY } });
  const searchSdk = createSearchSdk({
    deps: { esClient },
    config: { indexTarget: 'primary' },
  });
  logger.info('Search retrieval service configured (Elasticsearch connected)');
  return searchSdk.retrieval;
}
```

**Lines**: 167-171 (`wireDependencies`)

In stub mode, use `createStubSearchRetrieval()` from the SDK.
In real mode, use the local `createSearchRetrieval()`.

```typescript
// Before
const searchRetrieval = createSearchRetrieval(runtimeConfig.env, logger);

// After
import { createStubSearchRetrieval } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

const searchRetrieval = runtimeConfig.useStubTools
  ? createStubSearchRetrieval()
  : createSearchRetrieval(runtimeConfig.env, logger);
```

### 10. STDIO server: Remove optionality from tools interface

**File**: `apps/oak-curriculum-mcp-stdio/src/tools/index.ts`
**Line**: 25

```typescript
// Before
readonly searchRetrieval?: SearchRetrievalService;

// After
readonly searchRetrieval: SearchRetrievalService;
```

### 11. Test helpers: Export fake SearchRetrievalService

**File**: `apps/oak-curriculum-mcp-streamable-http/src/test-helpers/fakes.ts`

Add and export `createFakeSearchRetrieval()`. Move the
implementation from `search-retrieval-factory.integration.test.ts`
(lines 32-41) and import it there instead. This is a test fake
(uses `vi.fn()` for assertion support), distinct from the runtime
stub in step 1.

```typescript
/** Creates a properly typed fake SearchRetrievalService for tests. */
export function createFakeSearchRetrieval(): SearchRetrievalService {
  return {
    searchLessons: vi.fn<SearchRetrievalService['searchLessons']>(),
    searchUnits: vi.fn<SearchRetrievalService['searchUnits']>(),
    searchSequences: vi.fn<SearchRetrievalService['searchSequences']>(),
    searchThreads: vi.fn<SearchRetrievalService['searchThreads']>(),
    suggest: vi.fn<SearchRetrievalService['suggest']>(),
    fetchSequenceFacets: vi.fn<SearchRetrievalService['fetchSequenceFacets']>(),
  };
}
```

### 12. E2E, smoke, and environment updates

All test environments need dummy ES credentials to pass
env validation. The credentials are never used to create a
real ES client because stub mode uses `createStubSearchRetrieval()`.

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-stubbed-http-app.ts`

Add to `testEnv`:

```typescript
ELASTICSEARCH_URL: 'http://fake-es:9200',
ELASTICSEARCH_API_KEY: 'fake-api-key-for-stub-tests',
```

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/test-config.ts`

Add to `createMockRuntimeConfig()` env defaults:

```typescript
ELASTICSEARCH_URL: 'http://fake-es:9200',
ELASTICSEARCH_API_KEY: 'fake-api-key-for-mock-config',
```

**STDIO E2E tests** (4 files in `apps/oak-curriculum-mcp-stdio/e2e-tests/`):

Add `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` to the `env`
block passed to `StdioClientTransport`:

```typescript
env: {
  ...process.env,
  OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
  OAK_API_KEY: apiKey,
  LOG_LEVEL: 'error',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
},
```

**Smoke tests**: `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub.ts`

Add to env setup:

```typescript
process.env.ELASTICSEARCH_URL ??= 'http://fake-es:9200';
process.env.ELASTICSEARCH_API_KEY ??= 'fake-api-key-for-smoke';
```

### 13. Update integration tests

**File**: `apps/oak-curriculum-mcp-streamable-http/src/search-retrieval-factory.integration.test.ts`

- Move `createFakeRetrieval()` to `test-helpers/fakes.ts` and import
- Delete the entire `when credentials are missing` describe block
  (5 tests). With required env fields, calling the factory without
  credentials is a type error — there is no runtime path to test.
- Keep the `when credentials are present` describe block (4 tests).
  Update call signatures to use non-optional env fields if needed.

**SDK aggregated tool tests** (3 files):

- Delete `returns error when searchRetrieval is not configured`
  test from each file
- Update `createDeps()` to require a `SearchRetrievalService`
  argument (no more `undefined` default)

### 14. Update documentation

**TSDoc**:

- Remove "When absent, search tools return 'not configured' errors"
  from `universal-tool-shared.ts`
- Remove "optional" language from `search-retrieval-factory.ts`
  and `handlers.ts` TSDoc

**ElasticsearchEnvSchema TSDoc** (`packages/libs/env/src/schemas/elasticsearch.ts`):

Update the TSDoc to remove the MCP-specific "search tools disabled"
context. The `.partial()` example is still valid for other consumers,
but the commentary should not imply that MCP servers use it:

```typescript
/**
 * Contract schema for Elasticsearch connectivity.
 *
 * Import and compose this schema when your app requires Elasticsearch.
 * Fields are required by default — use `.partial()` only if your
 * application has a genuine optional-ES mode.
 *
 * @example Required (MCP servers, search services)
 * ```typescript
 * const AppEnv = OakApiKeyEnvSchema.extend(ElasticsearchEnvSchema.shape);
 * ```
 *
 * @example Optional (hypothetical app with ES as a bonus feature)
 * ```typescript
 * const AppEnv = OakApiKeyEnvSchema
 *   .extend(ElasticsearchEnvSchema.partial().shape);
 * ```
 */
```

**READMEs**:

- Update `README.md` for both servers — remove "optional" language
  around ES credentials, state they are required
- Update session prompt (`semantic-search.prompt.md`) — change
  "Optional searchRetrieval" to "Required searchRetrieval"
- Update Phase 3a plan — note that optionality was removed
- Update roadmap if needed

---

## TDD Approach

### RED

TDD at ALL levels. The RED phase writes tests that specify the
new behaviour. They MUST fail before implementation exists.

**1. Entry-point validation tests (integration level)**

Write integration tests proving that env validation rejects
missing ES credentials:

- HTTP: test that `readEnv({...requiredFieldsExceptES})` throws
  with an error mentioning `ELASTICSEARCH_URL` or
  `ELASTICSEARCH_API_KEY`. File: new
  `env.integration.test.ts` or add to existing env test file.
- STDIO: test that `loadRuntimeConfig({...withoutES})` throws
  with a helpful error message. File: new
  `runtime-config.integration.test.ts` or add to existing test.
- Run: tests FAIL (current implementations accept missing ES creds)

**2. Factory integration tests (integration level)**

Update `search-retrieval-factory.integration.test.ts`:

- Delete the `when credentials are missing` describe block
  entirely (5 tests that specify the old "returns undefined"
  behaviour)
- Update remaining test signatures to use required env fields
- Run: type-check FAILS (factory implementation still accepts
  optional env fields and returns `| undefined`)

**3. SDK tool integration tests (integration level)**

Update all three `execution.integration.test.ts` files:

- Delete `returns error when searchRetrieval is not configured`
- Change `createDeps(retrieval?: SearchRetrievalService)` to
  `createDeps(retrieval: SearchRetrievalService)` — remove the
  optional parameter
- Run: type-check FAILS (the `UniversalToolExecutorDependencies`
  type still has `searchRetrieval?`)

### GREEN

Make all production code changes (steps 1-12 above). Order:

1. SDK stub (step 1) — no dependencies, can go first
2. SDK types + execution (steps 2-3) — makes searchRetrieval
   required, removes guards
3. HTTP server (steps 4-7) — env schema, factory, handlers,
   stub wiring
4. STDIO server (steps 8-10) — config validation, factory,
   tools interface, stub wiring
5. Test helpers (step 11) — move fake to shared location
6. E2E/smoke env (step 12) — add dummy credentials
7. Integration tests (step 13) — update test signatures

Run: `pnpm test` and `pnpm test:e2e` — all tests PASS.

### REFACTOR

1. TSDoc and documentation updates (step 14)
2. Full quality gate chain:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

All gates MUST pass. No exceptions.

---

## Files Changed (summary)

| Workspace | Files | Nature |
|-----------|-------|--------|
| curriculum-sdk | 5 | New stub file, type change, remove dead code, export |
| HTTP server | 8-9 | Env, factory, handlers, application wiring, test helpers, E2E helpers, smoke |
| STDIO server | 5-6 | Config validation, wiring, tools interface, E2E env |
| Shared env | 1 | ElasticsearchEnvSchema TSDoc |
| Docs | 3-4 | Session prompt, plan, READMEs |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Breaking deployed server (no ES creds in Vercel env) | Vercel already has ES creds set; this change makes their absence a startup error instead of a runtime surprise |
| E2E tests fail without dummy creds | Dummy creds added to all test environments; stub mode uses createStubSearchRetrieval() |
| STDIO subprocess tests fail | Dummy creds added to StdioClientTransport env blocks |
| Smoke tests fail | Dummy creds added to local-stub.ts env setup |
| Stub mode search tools call real ES | Fixed: stub mode uses createStubSearchRetrieval() — no real ES client is ever created |
| STDIO loadRuntimeConfig type mismatch | Fixed: explicit validation narrows string or undefined to string before StdioEnv construction |

---

## Architectural Corrections Applied

This plan was reviewed against the codebase and six issues were
identified and corrected:

| Issue | Problem | Fix |
|-------|---------|-----|
| 1. Stub wiring ineffective | STDIO `stub-executors.ts` returns fake searchRetrieval but `wiring.ts` overwrites it with real factory | Both servers select stub vs real at the wiring level, not in stub-executors |
| 2. STDIO loadRuntimeConfig type gap | Making `StdioEnv` fields required creates `string \| undefined` to `string` assignment error | Explicit validation in loadRuntimeConfig narrows types before assignment |
| 3. Unreachable branches retained | Factory `if-missing` branches become unreachable after type changes | Branches deleted entirely — trust the types, no dead code |
| 4. Factory overloads unclear | Plan did not show full new signatures for simplified factory | Full signatures with required fields and non-optional return documented |
| 5. Shared schema TSDoc misleading | ElasticsearchEnvSchema TSDoc says "search tools disabled when absent" | TSDoc updated to reflect required usage, `.partial()` example reframed |
| 6. TDD sequence at wrong level | Original RED phase had no entry-point validation tests | RED phase includes readEnv and loadRuntimeConfig validation tests |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Phase 3a Plan](phase-3a-mcp-search-integration.md) | Parent plan for MCP search integration |
| [ADR-112](/docs/architecture/architectural-decisions/112-per-request-mcp-transport.md) | Per-request transport (recently completed) |
| [STDIO-HTTP Alignment](../../../architecture-and-infrastructure/stdio-http-server-alignment.md) | Future: shared Zod validation for STDIO |
| [rules.md](../../../directives/rules.md) | Fail FAST, keep it strict |
| [testing-strategy.md](../../../directives/testing-strategy.md) | TDD at ALL levels |
| [roadmap.md](../roadmap.md) | Semantic search roadmap |
| [session prompt](../../../prompts/semantic-search/semantic-search.prompt.md) | Session entry point |

---

## Mandatory Reading Before Starting

1. [AGENT.md](../../../directives/AGENT.md)
2. [rules.md](../../../directives/rules.md) — especially "Fail FAST" and "Keep it strict"
3. [testing-strategy.md](../../../directives/testing-strategy.md)
4. [distilled.md](../../../memory/distilled.md)
5. [napkin.md](../../../memory/napkin.md)
