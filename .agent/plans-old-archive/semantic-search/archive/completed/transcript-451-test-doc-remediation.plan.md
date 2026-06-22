# Transcript 451 + Test Strategy + Documentation Remediation

**Status**: ✅ COMPLETE (all workstreams executed 2026-02-12)  
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)  
**Last Updated**: 2026-02-12

---

## Instruction

This plan contains four workstreams and a final quality gate.
**Execute all of them.** Each workstream is self-contained with
a problem statement, concrete file-level instructions, and a
completion checklist. Mark each workstream done as you finish it.

Before starting, read the three foundation documents below.
Re-read them at each workstream boundary.

---

## Workstream Status

| ID | Workstream | Status |
| --- | --- | --- |
| WS1 | [Handle HTTP 451 in SDK error classification](#workstream-1-handle-http-451-in-sdk-error-classification) | ✅ Complete |
| WS2 | [Remove network IO from E2E tests](#workstream-2-remove-network-io-from-e2e-tests) | ✅ Complete |
| WS3 | [Update stale documentation](#workstream-3-update-stale-documentation) | ✅ Complete |
| WS4 | [Verify directive compliance](#workstream-4-verify-directive-compliance) | ✅ Complete |
| QG | [Quality gates](#quality-gates) | ✅ Complete |

**Recommended order**: WS1 -> WS3 -> WS2 -> WS4 -> QG.
WS1 is small and unblocks WS3 documentation accuracy. WS2 is
the largest workstream. WS4 must run after all code changes.

---

## Foundation Documents (MUST READ + RE-COMMIT)

Before starting, and again at each workstream boundary, re-read
and explicitly re-commit to:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

---

## Context

Investigation of the `/lessons/{lesson}/transcript` endpoint
(2026-02-12) revealed five issues requiring remediation:

1. The upstream API now returns HTTP 451 (Unavailable For Legal
   Reasons) for unavailable transcripts. Our code does not
   handle this status.
2. E2E tests exist that perform forbidden network IO.
3. E2E tests mutate `process.env` instead of using DI.
4. Documentation records stale 500/404 behaviour that no longer
   matches upstream reality.
5. Error classification misclassifies 451 as `network_error`.

### Verification (2026-02-12)

Live API calls confirmed the upstream change:

| Lesson | Subject | Old Response | Current Response |
| --- | --- | --- | --- |
| `greetings-and-introductions` | French | 500 | **451** |
| `mein-traumhaus-describing-your-dream-home` | German | 500 | **451** |
| `mi-familia-introducing-your-family` | Spanish | 404 | **451** |
| `pythagoras-theorem` | Maths | n/a | **451** |
| `checking-understanding-of-addition-and-subtraction-with-fractions` | Maths | 200 | **200** |

Response body:

```json
{"code":"INTERNAL_SERVER_ERROR","statusCode":451,"message":"Transcript not available: \"...\""}
```

The body self-labels as `INTERNAL_SERVER_ERROR` despite the
HTTP status being 451. This is a remaining upstream bug.

---

## Workstream 1: Handle HTTP 451 in SDK error classification

### Problem

`classifyHttpError` in the generated `sdk-error-types.ts` handles
404, 429, and 500-504. HTTP 451 falls through to the catch-all
`network_error`, which is semantically wrong. 451 is a permanent
4xx status ("Unavailable For Legal Reasons"), not a transient
network failure.

### Key Finding: Generated Code

`classifyHttpError` is **generated** by the template at
`packages/sdks/oak-curriculum-sdk/type-gen/typegen/error-types/generate-error-types.ts`.

The output file is
`packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts`.

Per the schema-first directive, the fix **MUST** go in the
generator template. Do not edit the generated output file
directly.

### Approach (TDD)

1. **RED**: Write a unit test for the generator output proving
   that `classifyHttpError(451, 'some-lesson', 'transcript', 'Transcript not available')`
   returns `{ kind: 'legally_restricted', resource: 'some-lesson', resourceType: 'transcript' }`.
   Run `pnpm type-gen` first so the generated file is current.
   The test will fail because 451 currently returns
   `network_error`.

2. **GREEN**: In `generate-error-types.ts`, add a
   `status === 451` branch to the generated `classifyHttpError`
   function template that returns `legally_restricted` — a new,
   distinct error kind. 404 and 451 have different semantics:
   404 means "does not exist", 451 means "exists but is legally
   inaccessible". Add a new `SdkLegallyRestrictedError`
   interface and include it in the `SdkFetchError` union. Run
   `pnpm type-gen` to regenerate, then run the test. It must pass.

3. **REFACTOR**: Add TSDoc for the new `SdkLegallyRestrictedError`
   type. Update `isRecoverableError` to treat `legally_restricted`
   as recoverable (same as `not_found` — both are permanent and
   non-retryable). Add a `case 'legally_restricted'` branch to
   `formatSdkError` with a distinct message. Export the new type
   from the SDK public surface. Update all downstream consumers:
   transcript cache types, cache wrapper, ingestion error handling
   in `lesson-materials.ts` and `unit-processing.ts`.

> **Historical note**: The original plan collapsed 451 into
> `not_found`. This was corrected during execution — 404 and 451
> have different semantic meanings and MUST have distinct error
> kinds. See [ADR-109](/docs/architecture/architectural-decisions/109-http-451-distinct-classification.md).

### Files

| File | Action |
| --- | --- |
| `type-gen/typegen/error-types/generate-error-types.ts` | Add 451 branch in template, update TSDoc |
| `src/types/generated/api-schema/error-types/sdk-error-types.ts` | Regenerated by `pnpm type-gen` (do not edit) |
| New unit test co-located with generator | Test `classifyHttpError` handles 451 |

### Completion Checklist

- [x] Unit test for `classifyHttpError(451, ...)` returning `legally_restricted` exists and passes
- [x] Generator template updated with 451 branch returning `legally_restricted`
- [x] New `SdkLegallyRestrictedError` interface added to `SdkFetchError` union
- [x] `isRecoverableError` updated to include `legally_restricted`
- [x] `formatSdkError` updated with distinct `legally_restricted` case
- [x] `SdkLegallyRestrictedError` exported from SDK public surface
- [x] `pnpm type-gen` regenerates cleanly
- [x] `pnpm --filter @oaknational/oak-curriculum-sdk test` passes
- [x] `pnpm --filter @oaknational/oak-curriculum-sdk type-check` passes
- [x] TSDoc for `SdkLegallyRestrictedError` documents 451 semantics
- [x] Downstream consumers updated (cache types, cache wrapper, ingestion)

---

## Workstream 2: Remove network IO from E2E tests

### Rule

From `testing-strategy.md`:

> **E2E test**: A test that verifies the behaviour of a running
> system. E2E tests CAN trigger File System and STDIO IO but
> **NOT network IO**.
>
> **Smoke test**: A test that verifies the behaviour of a running
> system, locally or deployed. Smoke tests CAN trigger all IO
> types, DO have side effects, and DO NOT contain mocks.

From `principles.md`:

> Tests MUST NOT mutate `process.env`, use `vi.stubGlobal`,
> or use `vi.doMock`.

### 2a: Remove Notion MCP workspace

The `oak-notion-mcp` workspace was originally included to
force generalisation of code supporting multiple MCP servers.
That generalisation is now achieved (ADR-108 4-workspace
decomposition, multi-server architecture with stdio +
streamable-http). The Notion workspace serves no further
architectural purpose.

**Action**: Remove `apps/oak-notion-mcp/` entirely.

- Delete the workspace directory
- Remove from `pnpm-workspace.yaml`
- Remove from `turbo.json` tasks
- Remove Notion-related dependencies from root if any
- Remove `NOTION_API_KEY` from `.env.example` and env docs
- Clean Notion references from ~30 active documentation
  files (see Item #4 in [high-level-plan.md](../../high-level-plan.md))
- Retain a single historical note explaining why the
  workspace once existed and why it was removed
- Archive (do not delete) Notion reference docs

This eliminates the E2E test violation (the test required
`NOTION_API_KEY` and made live Notion API calls) without
needing the DI refactor that was previously planned.

### 2b: Built server E2E test -- refactor to use DI

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/built-server.e2e.test.ts`

This test spawns the production build as a subprocess and uses
`fetch('http://localhost:9999/...')` to verify four behaviours:
process alive, healthcheck response, root landing page, MCP
endpoint availability. All four use `fetch()` over TCP, which
is network IO forbidden by the testing strategy.

**Do NOT reclassify as a smoke test.** Simply relabelling a
test to permit IO is the lazy option, not the architecturally
correct option. Every other E2E test in this directory already
uses in-process supertest with DI. This test must follow the
same pattern. The existing `smoke:dev:stub` script already
covers "does the built artefact boot and respond?"

#### Current Architecture (violating)

```typescript
// Spawns subprocess, uses fetch() over TCP
server = spawn('node', [serverPath], { env: { ... } });
await waitForServerReady(testPort, 20, 250);  // fetch() polling
const response = await fetch(`http://localhost:${testPort}/healthz`);
```

#### Target Architecture (compliant)

```typescript
// In-process app with DI, tested via supertest
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { createApp } from '../src/application.js';
import request from 'supertest';

const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_API_KEY: 'test-key',
  CLERK_PUBLISHABLE_KEY: 'pk_test_...',
  CLERK_SECRET_KEY: 'sk_test_dummy',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
};

const runtimeConfig = loadRuntimeConfig(testEnv);
const app = createApp({ runtimeConfig });

// Test the same four behaviours, zero network IO
const response = await request(app).get('/healthz');
expect(response.status).toBe(200);
```

#### Refactoring Steps

1. Replace `spawn()` + `fetch()` with in-process
   `createApp({ runtimeConfig })` + supertest, following the
   same pattern as all other streamable-http E2E tests.

2. Remove the `waitForServerReady` polling function, the
   `ChildProcess` lifecycle management, and the port
   allocation. None of these are needed for in-process testing.

3. Keep all four test cases -- they prove the same behaviour
   via supertest instead of `fetch()`.

4. Once refactored, the test is identical in pattern to the
   other E2E tests. Consider whether the separate
   `vitest.e2e.built.config.ts` and `test:e2e:built` script
   are still needed, or whether this test should be merged
   into `vitest.e2e.config.ts` and `test:e2e`. If merged,
   remove the separate config, update `turbo.json` to remove
   the `test:e2e:built` task, and update the root
   `package.json`, AGENT.md, and quality gate references.

#### Current Wiring (may simplify after refactor)

- Config: `vitest.e2e.built.config.ts` includes only this file
- Script: `test:e2e:built` runs this config
- Turbo: `test:e2e:built` depends on `build` and `test:e2e`

### 2c: `process.env` mutation in in-process E2E tests

Several streamable-http E2E tests create the app **in-process**
via `createApp()` but configure it by mutating `process.env`
directly. The correct pattern (already used by compliant tests)
is to create an isolated env object and pass it through
`loadRuntimeConfig()` to `createApp({ runtimeConfig })`.

#### The `RuntimeConfig` Interface

```typescript
// From apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts
export interface RuntimeConfig {
  readonly env: Env;
  readonly dangerouslyDisableAuth: boolean;
  readonly useStubTools: boolean;
  readonly version: string;
  readonly vercelHostnames: readonly string[];
  readonly displayHostname?: string;
}
```

#### Compliant Pattern (from `auth-bypass.e2e.test.ts`)

```typescript
import { loadRuntimeConfig } from '../src/runtime-config.js';

const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  CLERK_PUBLISHABLE_KEY: 'REDACTED',
  CLERK_SECRET_KEY: 'sk_test_dummy_for_testing',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-api-key',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
};

const runtimeConfig = loadRuntimeConfig(testEnv);
const app = createApp({ runtimeConfig });
```

Reading `process.env.OAK_API_KEY` (read, not write) is
acceptable for inheriting a real key when available. The
critical difference is that an **isolated** env object is
created and passed through DI -- `process.env` is never
**mutated**.

#### Files Requiring Migration

Each of these files uses `enableAuthBypass()` which mutates
global `process.env`, plus direct `process.env.X = ...`
assignments. Replace with the compliant pattern above.

| File | Current Mutation | Migration |
| --- | --- | --- |
| `server.e2e.test.ts` | `enableAuthBypass()`, sets `OAK_API_KEY`, `ALLOWED_HOSTS`, deletes `ALLOWED_ORIGINS`, deletes `DANGEROUSLY_DISABLE_AUTH` (mid-test) | Create isolated `testEnv` per test case, pass through `loadRuntimeConfig()`. For the auth-re-enabled test, create a second env without `DANGEROUSLY_DISABLE_AUTH`. |
| `widget-metadata.e2e.test.ts` | `enableAuthBypass()`, sets `OAK_API_KEY`, `ALLOWED_HOSTS`, deletes `ALLOWED_ORIGINS` | Same pattern. Single `testEnv`. |
| `tool-examples-metadata.e2e.test.ts` | `enableAuthBypass()`, sets `OAK_API_KEY`, `ALLOWED_HOSTS`, deletes `ALLOWED_ORIGINS` | Same pattern. Single `testEnv`. |
| `header-redaction.e2e.test.ts` | `enableAuthBypass()`, sets `OAK_API_KEY`, `ALLOWED_HOSTS`, deletes `ALLOWED_ORIGINS`, deletes `DANGEROUSLY_DISABLE_AUTH` (mid-test) | Same pattern. Two envs (auth bypassed + auth enabled). |

#### Already Compliant (for reference)

These files already use the correct pattern. Use them as
examples when migrating the non-compliant files:

- `web-security-selective.e2e.test.ts`
- `mcp-connection-timeout.e2e.test.ts`
- `auth-bypass.e2e.test.ts`
- `helpers/create-stubbed-http-app.ts`
- `helpers/create-live-http-app.ts`

#### Shared `enableAuthBypass()` Helper

This function appears inline in the non-compliant test files
and mutates global `process.env`. After migration, delete it
from every file. The helpers `create-stubbed-http-app.ts` and
`create-live-http-app.ts` already solve this correctly -- they
build isolated env objects with auth bypass baked in.

**Note**: `built-server.e2e.test.ts` also uses `process.env`
but spawns a separate process, so env passing via the spawn
options is correct there (if reclassified as smoke test per
2b).

### WS2 Completion Checklist

- [x] **2a**: `apps/oak-notion-mcp/` workspace removed entirely
- [x] **2a**: Notion references cleaned from active documentation
- [x] **2a**: Historical note retained explaining original purpose
- [x] **2b**: `built-server.e2e.test.ts` merged into `vitest.e2e.config.ts` as in-process supertest with DI
- [x] **2b**: Zero `spawn()` or `fetch()` calls remain in the test
- [x] **2b**: Separate `vitest.e2e.built.config.ts`, `test:e2e:built` script, and turbo task removed
- [x] **2c**: `server.e2e.test.ts` uses `loadRuntimeConfig(testEnv)` pattern
- [x] **2c**: `widget-metadata.e2e.test.ts` uses `loadRuntimeConfig(testEnv)` pattern
- [x] **2c**: `tool-examples-metadata.e2e.test.ts` uses `loadRuntimeConfig(testEnv)` pattern
- [x] **2c**: `header-redaction.e2e.test.ts` uses `loadRuntimeConfig(testEnv)` pattern
- [x] **2c**: All `enableAuthBypass()` functions deleted
- [x] **2c**: Zero occurrences of `process.env` mutation in any E2E test (except subprocess spawn `env` options)

---

## Workstream 3: Update stale documentation

### 3a: DATA-VARIANCES.md

**File**: `docs/domain/DATA-VARIANCES.md` (lines 59-67)

Currently states French returns "500 server error" and German
returns "500 server error". Spanish shown as "404".

**Update**:

- Replace the MFL transcript response table with current 451
  behaviour (use the verification table from the Context
  section above)
- Note the body inconsistency (`code: "INTERNAL_SERVER_ERROR"`
  but HTTP status is 451)
- Update the "Explanation (API behaviour)" paragraph to
  reference 451
- Note that 451 (Unavailable For Legal Reasons) is semantically
  appropriate for TPC-restricted transcripts
- Note that some maths lessons (e.g. `pythagoras-theorem`) also
  return 451, while others still return 200
- Add verification date (2026-02-12)

### 3b: Upstream API wishlist

**File**: `.agent/plans/external/ooc-api-wishlist/00-overview-and-known-issues.md`
(lines 863-906, "MFL Transcript API Response Inconsistency")

The bug report documents 500 for French/German, 404 for Spanish.

**Update**:

- Record that upstream partially fixed the inconsistency -- all
  three MFL subjects now return 451 consistently
- Note the remaining issues:
  - Response body claims `INTERNAL_SERVER_ERROR` while HTTP
    status is 451
  - 451 is not documented in the OpenAPI schema
  - Some maths lessons now also return 451 (broader TPC
    enforcement?)
- Update the "Requested Fix" to reflect the new situation: 451
  is better than the previous inconsistent 500/404, but the
  body mislabelling and lack of schema documentation remain
- Add verification date (2026-02-12)

### 3c: ADR-078 dependency injection for testability

**File**: `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md`

The prohibited patterns table (line 129) scopes the
`process.env` prohibition to "unit and integration tests"
only. The acceptance criteria (lines 148-153) also only
mention "unit tests". However, `principles.md` line 37 says:

> Tests MUST NOT mutate `process.env`, use `vi.stubGlobal`,
> or use `vi.doMock`.

No qualification -- **all** tests. The ADR and the directive
are out of alignment.

The Neutral section (line 125) says "E2E tests may still set
environment via spawn options (process isolation makes this
safe)" which is correct for **subprocess-spawned** tests, but
does not distinguish in-process E2E tests (using `createApp()`
directly) from subprocess-spawned ones.

**Update**:

- Widen the prohibited patterns table scope from "unit and
  integration tests" to "all tests" (matching `principles.md`)
- Clarify the Neutral section: subprocess-spawned tests may
  pass env via spawn options (process isolation). In-process
  E2E tests must use DI via `loadRuntimeConfig(isolatedEnv)`
  or equivalent, never `process.env` mutation.
- Update acceptance criteria to cover all test types, not
  just unit tests

### 3d: ADR-092 transcript cache categorisation

**File**: `docs/architecture/architectural-decisions/092-transcript-cache-categorization.md`

The status table (line 60) shows
`not_found | API 404 OR API 200 with empty string`. HTTP 451
is not mentioned. Line 61 shows
`(transient error) | API 5xx or network failure`. With 451,
the transcript endpoint no longer returns 5xx for MFL -- it
returns a 4xx that is permanent, not transient.

**Update**:

- ✅ Updated: `TranscriptCacheStatus` now includes
  `legally_restricted` as a distinct status (not collapsed
  into `not_found`)
- ✅ Added `legally_restricted` row to status definitions table
- ✅ Updated cache flow diagram: `API451` transitions to
  `CacheLegallyRestricted` (distinct from `CacheNotFound`)
- ✅ "Why 3 Statuses" updated to "Why 4 Statuses" to explain
  the semantic distinction between 404 and 451

> **Historical note**: The original plan instructed collapsing
> 451 into the `not_found` cache status. This was corrected
> during execution — 451 gets its own `legally_restricted`
> cache status. See [ADR-092](/docs/architecture/architectural-decisions/092-transcript-cache-categorization.md)
> and [ADR-109](/docs/architecture/architectural-decisions/109-http-451-distinct-classification.md).

### 3e: Testing config fixes plan (archive)

**File**: `.agent/plans/archive/completed/testing-config-fixes-plan.md`

References "treated transient 5xx in transcript search as
acceptable" and "Replace the transcript search 5xx allowance".

**Action**: Verify that the referenced E2E test file
(`packages/oak-curriculum-sdk/e2e-tests/client/api-calls.e2e.test.ts`)
no longer exists. If deleted, add a brief resolution note. If
it still exists, audit it against the testing strategy.

### WS3 Completion Checklist

- [x] `DATA-VARIANCES.md` updated with 451 status, verification date, body inconsistency note
- [x] API wishlist updated with partial fix note, remaining issues, verification date
- [x] ADR-078 prohibited patterns scope widened to all tests, in-process E2E DI clarified
- [x] ADR-092 updated with 451 as distinct `legally_restricted` cache status and updated flow diagram
- [x] Archive plan has resolution note (or audit if file still exists)
- [x] `pnpm markdownlint:root` passes on all changed markdown files

---

## Workstream 4: Verify directive compliance

After workstreams 1-3, run a sweep to confirm:

### principles.md

- **Fail fast with helpful errors**: 451 now classified
  correctly as `legally_restricted`, not silently misclassified
  as `network_error`
- **No type shortcuts**: No `as`, `any`, `!`, or
  `Record<string, unknown>` introduced
- **No disabled checks**: No `eslint-disable`, `@ts-ignore`,
  or similar
- **Handle all cases explicitly**: `formatSdkError` switch is
  exhaustive (451 maps to new `legally_restricted` kind with
  its own case and distinct error message)

### testing-strategy.md

- **No E2E test performs network IO**: Notion MCP workspace
  removed (eliminating the violation), built-server test
  refactored to in-process supertest with DI and merged into
  main E2E suite
- **All mocks are simple fakes injected as arguments**: No
  complex mocks, no `vi.stubGlobal`, no `vi.doMock`
- **No `process.env` mutation in in-process tests**: All
  `createApp()` tests use `runtimeConfig` injection via
  `loadRuntimeConfig(isolatedEnv)`

### schema-first-execution.md

- **Generator-first mindset**: 451 fix goes through
  `generate-error-types.ts` template, not the generated output
- **Generated file not edited manually**: `sdk-error-types.ts`
  regenerated by `pnpm type-gen` only

### WS4 Completion Checklist

- [x] All three directives re-read and compliance confirmed
- [x] No new violations introduced by WS1-WS3 changes
- [x] `rg 'process\.env\.' --glob '*.e2e.test.ts'` in streamable-http shows no mutations (only reads)
- [x] `rg 'eslint-disable\|@ts-ignore\|@ts-expect-error' --glob '*.ts'` in changed files shows zero results

---

## Quality Gates

After all changes, run the full gate chain from repo root:

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

All must pass. No exceptions.

---

## Naming Conventions (Do Not Break)

Test-related scripts follow established patterns across the
monorepo. Do not introduce new naming conventions.

| Pattern | Meaning | Examples |
| --- | --- | --- |
| `test` | Unit + integration (vitest) | All workspaces |
| `test:e2e` | E2E tests (vitest) | Most apps |
| `test:smoke` | Vitest-based smoke tests | search-cli |
| `smoke:*` | Standalone tsx smoke scripts | streamable-http |
| `test:ui` | Playwright UI tests | streamable-http |

**Existing inconsistency** (out of scope for this plan):
`test:smoke` in search-cli vs `smoke:*` in streamable-http.
The search-cli uses vitest for smoke tests; the streamable-http
uses standalone tsx scripts. Both are valid patterns for their
respective contexts, but the naming diverges.

---

## Related Documents

| Document | Relationship |
| --- | --- |
| [ADR-078](../../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md) | DI for testability (needs scope widening in WS3) |
| [ADR-088](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) | Result pattern governing error types |
| [ADR-092](../../../../docs/architecture/architectural-decisions/092-transcript-cache-categorization.md) | Transcript cache categorisation (needs update in WS3) |
| [DATA-VARIANCES.md](../../../../docs/domain/DATA-VARIANCES.md) | Data variance reference (needs update in WS3) |
| [API wishlist](../../external/ooc-api-wishlist/00-overview-and-known-issues.md) | Upstream API issues (needs update in WS3) |
| [testing-strategy.md](../../../directives/testing-strategy.md) | E2E test rules |
| [schema-first-execution.md](../../../directives/schema-first-execution.md) | Generator-first mandate |
| [principles.md](../../../directives/principles.md) | Fail fast, no type shortcuts, no `process.env` mutation |
| [generate-error-types.ts](../../../../packages/sdks/oak-curriculum-sdk/type-gen/typegen/error-types/generate-error-types.ts) | Generator template for error types |
| [high-level-plan.md](../../high-level-plan.md) | Notion workspace removal (Item #4) |
| [runtime-config.ts](../../../../apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts) | `RuntimeConfig` interface (target pattern for WS2c) |
