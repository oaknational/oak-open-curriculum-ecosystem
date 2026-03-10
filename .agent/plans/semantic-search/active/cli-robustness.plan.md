---
name: "CLI Robustness: Error Handling, Process Lifecycle, and Dev-Ex"
overview: >
  Fix systematic issues in the oak-search-cli where errors do not cause
  process exit, error messages bypass the structured logger, resources
  are never cleaned up, and cheap preconditions are validated after
  expensive resource creation. Every admin command can hang indefinitely
  after an error.
todos:
  - id: phase-0-audit
    content: "Phase 0: Audit and catalogue every affected command and resource."
    status: pending
  - id: phase-1-teardown-and-logging
    content: "Phase 1: Process exit guarantee, teardown pattern, resource scoping, and structured error logging (TDD)."
    status: pending
  - id: phase-2-preconditions
    content: "Phase 2: Fail-fast precondition checks before resource creation (TDD)."
    status: pending
  - id: phase-3-e2e-validation
    content: "Phase 3: E2E validation of no-hang behaviour and edge cases (TDD)."
    status: pending
  - id: phase-4-review
    content: "Phase 4: Reviewer gates, documentation, and ADR."
    status: pending
isProject: false
---

# CLI Robustness: Error Handling, Process Lifecycle, and Dev-Ex

**Last Updated**: 2026-03-10
**Status**: PLANNED — v4 (post-review, all 7 reviewers addressed)
**Scope**: All CLI command handlers in `apps/oak-search-cli/src/cli/`
**Trigger**: `admin stage` hung indefinitely after ENOENT error (2026-03-10)

---

## Problem Statement

The oak-search-cli has systematic issues across **all command handlers**:

1. **Process hangs after errors** — Every admin command that creates an ES
   client or OakClient (with Redis) sets `process.exitCode = 1` on error
   but never closes the underlying TCP connections. Open sockets keep the
   Node.js event loop alive indefinitely. The user must Ctrl+C to kill
   the process.

2. **Errors bypass the structured logger** — `printError()` is
   `process.stderr.write(chalk.red(...))` — raw stderr with ANSI escape
   codes. Errors are invisible to the structured logger (`ingestLogger`),
   file sinks, and any future observability integration. The structured
   JSON log lines stop, then a raw chalk string appears on stderr — two
   completely different output systems in one command.

3. **No resource cleanup** — `buildLifecycleServiceForIngest()` creates
   an ES client and an OakClient (potentially with Redis) but returns
   only the `IndexLifecycleService`. The caller has no handle to close
   the underlying connections. No `finally` block exists in any handler.

4. **Expensive resources created before cheap validation** — The `stage`
   command creates an ES client and OakClient (Redis connection, API key
   validation) *before* discovering that `--bulk-dir` points to a
   non-existent path. The ENOENT is a cheap `fs.readdir` that should
   happen first.

5. **Path resolution is CWD-relative, not app-relative** — `--bulk-dir
   ./bulk-downloads` resolves relative to `process.cwd()`, not relative
   to the app directory (`apps/oak-search-cli/`). Running from the repo
   root produces `ENOENT` because `./bulk-downloads` does not exist at
   the repo root — the actual path is `apps/oak-search-cli/bulk-downloads`.
   The legacy ingest CLI has `validateBulkDir()` with a helpful error
   message and `existsSync` check, but the new lifecycle commands skip
   it entirely. Furthermore, the legacy `DEFAULT_BULK_DIR` is
   `'./bulk-downloads'` — also CWD-relative and fragile.

6. **Errors use `throw` and `catch` instead of `Result<T, E>`** — The
   principles mandate the Result pattern (`Result<T, E>`) for all error
   handling, with explicit case handling. Many error paths use `try/catch`
   with generic `Error` objects, losing type information and making it
   impossible to handle specific error cases. `validateBulkDir` throws;
   `createIngestionClient` throws; `readAllBulkFiles` throws. These
   should return `Result` types that callers handle explicitly.

7. **Module-level OakClient singleton** — `oak-adapter.ts` has a
   `clientSingleton` at module scope. If `disconnect()` is called on it,
   subsequent callers get the disconnected singleton. Fragile ownership.

### Affected Commands

**Every command handler** in `src/cli/` uses the same pattern:

```typescript
try {
  const sdk = createCliSdk(cliEnv); // or buildLifecycleServiceForIngest
  const result = await sdk.someOperation();
  if (!result.ok) {
    printError(`${result.error.type}: ${result.error.message}`);
    process.exitCode = 1;
    return; // ← process does NOT exit if connections are open
  }
} catch (error) {
  printError(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
  // ← same: no cleanup, no exit guarantee
}
```

| Command Group | Commands | Creates ES Client | Creates OakClient (Redis) | Hang Risk |
|---------------|----------|-------------------|---------------------------|-----------|
| Lifecycle ingest | `stage`, `versioned-ingest` | Yes | Yes | **CRITICAL** |
| Lifecycle alias | `promote`, `rollback`, `validate-aliases` | Yes | No | HIGH |
| SDK admin | `setup`, `reset`, `status`, `synonyms`, `meta get/set` | Yes | No | HIGH |
| Count | `count` | Yes | No | HIGH |
| Search | `lessons`, `units`, `sequences`, `threads`, `suggest`, `facets` | Yes | No | HIGH |
| Observe | `summary` | Yes | No | HIGH |
| Orchestration | `ingest`, `verify`, `download` | No (child process) | No | LOW |

The lifecycle ingest commands are the most critical because they create
*both* an ES client and an OakClient with a potential Redis connection.
But the pattern is broken everywhere.

---

## Goals

1. **Every command exits cleanly** — on success *and* on error, the
   process exits within a bounded time after the handler returns
2. **Every error is logged structurally** — errors go through the
   structured logger with type, message, and context, not raw stderr
3. **Resources are always cleaned up** — ES clients are closed in
   `finally` blocks; OakClients are closed locally by the 2 ingest
   commands that create them
4. **Cheap checks happen first** — path existence, env validation, and
   other preconditions are validated before creating expensive connections
5. **Path resolution is robust** — `--bulk-dir` resolves relative to
   `APP_ROOT` when a relative path is given, with a clear error message
   showing the resolved path and a hint when the path is wrong
6. **New error-handling functions use `Result<T, E>`** — `resolveBulkDir`
   and `validateIngestEnv` return `Result`, never throw. Remaining
   throw-sites in legacy validators are tracked for follow-up.
7. **The pattern is simple and copyable** — future commands get the
   right behaviour by following the established pattern
8. **High-quality tests prove every behaviour** — TDD at all levels.
   Unit tests for pure functions (path resolution, precondition
   validation), integration tests for the resource wrapper pattern,
   E2E tests proving the process exits cleanly

## Non-Goals (YAGNI)

- Refactoring the OakClient singleton pattern (separate concern,
  documented for follow-up; note: calling `disconnect()` on the
  singleton poisons it for any subsequent use in the same process —
  safe in CLI single-command-then-exit, but a latent DI violation)
- Adding retry logic or reconnection handling
- Changing the Commander.js framework
- Refactoring the SDK lifecycle service interface
- Adding OTel/tracing (separate concern)
- Signal handlers for SIGINT/SIGTERM — `process.exit()` after
  `parseAsync()` is sufficient; Node.js terminates on SIGINT by default
  and the OS cleans up TCP sockets on process exit. If graceful
  mid-operation cancellation is needed later, design with
  `AbortController`, not signal handlers.
- Converting all existing throw-sites to Result (tracked follow-up:
  `validators.ts` has 3 throws, `admin-sdk-commands.ts:182` has 1,
  `createIngestionClient` throws `CacheRequiredError`,
  `requireOakApiKey` throws). These are caught by `withEsClient`'s
  catch block and do not cause hangs.

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` — fail fast, DRY, KISS
2. **Re-read** `.agent/directives/testing-strategy.md` — TDD at all levels
3. **Ask**: "Could it be simpler without compromising quality?"
4. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Strategic Approach

### Key Insight: Composition Root + Explicit Resource Ownership

The entry point (`bin/oaksearch.ts`) is the composition root — where
`process.env` is read and threaded as configuration (per ADR-078). The
critical change is migrating from `program.parse()` (synchronous) to
`await program.parseAsync()` followed by `process.exit()`. This single
change guarantees termination for all commands.

Resource cleanup is the second concern: a thin `withEsClient` wrapper
ensures the ES client is closed in a `finally` block. The 2 ingest
commands manage their OakClient cleanup locally.

### Design Decision: `withEsClient` Concrete Wrapper

A concrete (non-generic) wrapper that:

1. Accepts a pre-created ES client (caller owns creation, wrapper owns cleanup)
2. Executes the handler
3. Catches unexpected throws — logs structurally (full error object in
   metadata for stack trace preservation) + prints humanly
4. Closes the ES client in a `finally` block (error-isolated)

The caller (command handler action) creates the ES client via
`createEsClient(cliEnv)` and passes it in. This satisfies ADR-078:
the wrapper accepts all dependencies as parameters, making it testable
with simple fakes — no `vi.mock` needed.

`disableFileSink()` is called at the composition root (`bin/oaksearch.ts`)
after `parseAsync()` completes, before `process.exit()`. It does not
belong in `withEsClient` — the wrapper's responsibility is ES client
lifecycle, not log-file lifecycle.

This replaces the earlier `withCliResources<R>` generic design. The
generic was speculative: only 2 of ~15 commands need OakClient, and
those 2 manage it locally. A concrete wrapper is simpler, has no type
parameter, no `CleanupFn` type, and no factory indirection.

**Note on `process.exitCode`**: `withEsClient` does NOT set
`process.exitCode` directly. Instead, `deps` includes a `setExitCode`
callback. The composition root passes
`(code) => { process.exitCode = code; }`. This keeps global state
mutation at the composition root and eliminates `afterEach` cleanup
in tests (ADR-078).

```typescript
/**
 * Execute a CLI command handler with a managed ES client lifecycle.
 *
 * Runs the handler, catches unexpected throws, and closes the client
 * in a finally block regardless of outcome. The caller creates the
 * client; the wrapper guarantees cleanup.
 *
 * @param esClient - Pre-created Elasticsearch client
 * @param handler - The command handler to execute (must be inline —
 *   all resource creation must happen inside this closure so that
 *   withEsClient's finally block can clean up on any throw)
 * @param deps - Injected dependencies (logger, error printer, exit code setter)
 */
async function withEsClient(
  esClient: Client,
  handler: () => Promise<void>,
  deps: {
    logger: Logger;
    printError: (msg: string) => void;
    setExitCode: (code: number) => void;
  },
): Promise<void> {
  try {
    await handler();
  } catch (error) {
    deps.logger.error('Command failed', { error });
    deps.printError(
      error instanceof Error ? error.message : String(error),
    );
    deps.setExitCode(1);
  } finally {
    try {
      await esClient.close();
    } catch (closeErr) {
      deps.logger.warn('ES client close failed', { error: closeErr });
    }
  }
}
```

### Ingest Commands: Local OakClient Management

The 2 ingest commands (`stage`, `versioned-ingest`) create an OakClient
inside the `withEsClient` handler and manage its cleanup in a local
`finally` block. Each resource has its own error-isolated try/catch.

**Cleanup order invariant**: OakClient disconnect runs in the inner
`finally` (local to handler), ES client close runs in the outer `finally`
(`withEsClient`). Inner resources are cleaned up first. If both throw,
both errors are logged as warnings; `setExitCode(1)` is called once
in `withEsClient`'s catch block if the handler itself threw.

```typescript
// Inside stage handler — preconditions first, then resources
const dirResult = resolveBulkDir(opts.bulkDir, APP_ROOT, fs.existsSync, hasJsonFiles);
if (!dirResult.ok) { /* fail fast, no resources created */ return; }

const esClient = createEsClient(cliEnv);
await withEsClient(esClient, async () => {
  const oakClient = await createIngestionClient({ env: cliEnv });
  try {
    const runIngest = createRunVersionedIngest({ oakClient, esTransport: esClient, ... });
    const service = buildLifecycleService(
      esClient, cliEnv.SEARCH_INDEX_TARGET, runIngest, ingestLogger,
    );
    const result = await service.stage({ bulkDir: dirResult.value, ... });
    if (!result.ok) {
      ingestLogger.error('Stage failed', { ...result.error });
      printError(`${result.error.type}: ${result.error.message}`);
      deps.setExitCode(1);
      return;
    }
    printSuccess(`Staged version ${result.value.version}`);
    printJson(result.value);
  } finally {
    try {
      await oakClient.disconnect();
    } catch (disconnectErr) {
      ingestLogger.warn('OakClient disconnect failed', {
        error: disconnectErr,
      });
    }
  }
}, { logger: ingestLogger, printError, setExitCode: (c) => { process.exitCode = c; } });
```

If OakClient creation itself fails (throws), the error propagates to
`withEsClient`'s catch block, which logs and sets exitCode. The ES
client is still closed in `withEsClient`'s finally — no resource leak.

### Error Logging: Dual Output

When a command fails, the error is:

1. **Logged structurally** via the injected logger (JSON, with full
   error object in metadata for stack trace preservation)
2. **Printed humanly** via the injected `printError` (chalk, for the
   terminal)

Both happen inside `withEsClient`'s catch block for unexpected throws.
For Result errors, the handler itself does both (this preserves the
existing handler pattern).

### SDK Admin Commands: Explicit ES Client Ownership

`createCliSdk` currently creates an ES client internally and wires
`ZERO_HIT_*` configuration. To enable cleanup, the handler creates the
ES client via `createEsClient(cliEnv)` and passes it to
`createSearchSdk` directly. The `ZERO_HIT_*` normalisation logic
(webhook URL `'none'` → `undefined`, persistence config) moves to a
shared `buildSearchSdkConfig(cliEnv)` helper that returns the config
object without creating any resources.

**Note on evaluation scripts**: `createCliSdk` is also imported by 8
benchmark scripts in `evaluation/analysis/`. These are outside the CLI
command path and do not suffer from the hang problem. `createCliSdk`
will be retained for evaluation use and marked with a TSDoc note
explaining that CLI commands must use `createEsClient` + `withEsClient`
instead. If evaluation scripts later need cleanup, they can migrate
independently.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ES client `close()` throws | Low | Low | Error-isolated try/catch in cleanup, logged as warning |
| OakClient `disconnect()` throws | Low | Low | Same — error-isolated try/catch, logged as warning |
| `process.exit()` prevents pending writes | Medium | Medium | `disableFileSink()` called before `process.exit()` |
| Existing tests break from new exit behaviour | Medium | Medium | New pattern is additive — existing handler logic unchanged |
| Commander 14 `parseAsync` behaviour | Low | Medium | Test explicitly; Commander 14 awaits async actions correctly |
| OakClient singleton poisoning after disconnect | Low | Low | Single-command-then-exit CLI pattern; tracked for follow-up |

---

## Tasks

### Phase 0: Audit and Catalogue

**Foundation Check-In**: Re-read `principles.md` (fail fast).

#### Task 0.1: Enumerate All Resource-Creating Command Handlers

**Goal**: Produce a complete inventory of every command handler, what
resources it creates, and whether it cleans them up.

**Validation**:

1. Search all `createEsClient`, `createCliSdk`,
   `buildLifecycleServiceForIngest`, `buildLifecycleServiceBasic` call
   sites in `src/cli/` and `evaluation/`
2. For each, check whether a `close()`/`disconnect()` call exists
3. Document the inventory

**Acceptance Criteria**:

1. Complete table of all commands with resource creation and cleanup status
2. No command is missed
3. Evaluation script callers of `createCliSdk` documented

#### Task 0.2: Catalogue All `printError` Call Sites

**Goal**: Enumerate every place where errors are printed without
structured logging.

**Validation**: `grep -rn 'printError' apps/oak-search-cli/src/cli/`

**Acceptance Criteria**: Complete list of all `printError` call sites
that lack a corresponding logger call.

**Phase 0 Complete When**: Both inventories documented. No code changes.

---

### Phase 1: Process Exit Guarantee, Teardown Pattern, Resource Scoping, and Structured Error Logging (TDD)

**Foundation Check-In**: Re-read `principles.md` (DRY, fail fast),
`testing-strategy.md` (TDD).

#### Task 1.0: Migrate `parse()` to `parseAsync()` + `process.exit()`

**This is the single most important change in the plan.** It fixes the
hang problem for every command, independent of the cleanup pattern.
All subsequent tasks depend on this — `withEsClient` cleanup only
works if the composition root awaits async actions before exiting.

**Current**: `program.parse()` at `bin/oaksearch.ts:54` is the
synchronous variant. Async action handlers may not have completed when
`parse()` returns, and there is no `process.exit()` after it — the
process relies on event loop drainage, which fails when open sockets
exist.

**Target**: In `bin/oaksearch.ts`:

```typescript
await program.parseAsync();
// Commander 14 parseAsync resolves after async actions complete.
// At this point, all withEsClient finally blocks have run.
disableFileSink(); // flush and close log file sink before exit
process.exit(process.exitCode ?? 0);
```

**Sub-task 1.0a: Add error isolation to `disableFileSink()`.**
The current implementation (`logger.ts` lines 183–190) calls
`activeFileSink.end()` without a try/catch. If `end()` throws,
`process.exit()` never executes — reintroducing the hang. Wrap the
`end()` call in try/catch so a failing file-sink close never prevents
`process.exit()`.

**TDD Sequence**:

1. **BASELINE**: Write E2E test — run `oaksearch --help` and assert the
   process exits within 5 seconds with exit code 0. Place in
   `apps/oak-search-cli/e2e-tests/cli-exit.e2e.test.ts`. Run →
   PASSES (confirms baseline works before changes).
2. **RED**: Write E2E test — run `oaksearch admin stage --bulk-dir
   ./does-not-exist` and assert the process exits within 5 seconds with
   exit code 1 and a helpful error message. Run → FAILS (currently
   hangs).
3. **GREEN**: Change `program.parse()` to `await program.parseAsync()`
   and add `disableFileSink()` then `process.exit(process.exitCode ?? 0)`.
   Run → PASSES.

**Note on E2E test environment**: E2E tests that invoke the CLI as a
child process need minimal env vars (ELASTICSEARCH_URL,
ELASTICSEARCH_API_KEY, SEARCH_INDEX_TARGET). Tests that validate
error paths (like `./does-not-exist` bulk dir) do not need a real ES
cluster — the precondition check fails before any connection is
attempted. Use `--help` for the success-path baseline (no env needed).

**Acceptance Criteria**:

1. CLI always exits after command completes (success or failure)
2. Exit code is preserved correctly
3. E2E tests prove no-hang behaviour
4. `bin/oaksearch.ts` uses `parseAsync()` not `parse()`
5. `disableFileSink()` called after `parseAsync()`, before `process.exit()`
6. `disableFileSink()` wraps `activeFileSink.end()` in try/catch

#### Task 1.1: Create `withEsClient` Wrapper

**Design**: A concrete function that wraps command handler execution
with ES client lifecycle management. Dependencies (logger, printError,
setExitCode) are injected as parameters per ADR-078.

**TDD Sequence** (interleaved RED-GREEN per test):

1. **RED**: Write integration test — `withEsClient` calls
   `esClient.close()` on success. Run → FAILS (function does not exist).
2. **GREEN**: Implement minimal `withEsClient` with try/finally. Run → PASSES.
3. **RED**: Write integration test — `withEsClient` calls
   `esClient.close()` and logs structurally when handler throws.
   Run → FAILS.
4. **GREEN**: Add catch block with logger call. Run → PASSES.
5. **RED**: Write integration test — `withEsClient` calls
   `deps.setExitCode(1)` when handler throws. Run → FAILS (if not
   already covered).
6. **GREEN**: Add setExitCode call. Run → PASSES.
7. **RED**: Write integration test — when `esClient.close()` throws,
   the error is logged as a warning (not re-thrown). Run → FAILS.
8. **GREEN**: Add try/catch around close. Run → PASSES.
9. **REFACTOR**: Extract if needed. Run quality gates.

**Note on testing**: `withEsClient` accepts
`deps: { logger, printError, setExitCode }` as injected parameters.
Tests pass simple fakes — no mocking framework needed for the logger.
The ES client is a simple fake with a `vi.fn()` `close` method.
`setExitCode` is a `vi.fn()` — no `process.exitCode` mutation, no
`afterEach` cleanup needed.

**Note on test classification**: `withEsClient` accepts a pre-created ES
client as its first parameter. Tests inject a fake ES client, making
these integration tests (simple mocks injected as arguments). Named
`with-es-client.integration.test.ts`.

**Note on `process.exitCode` in all tests**: Any test that exercises
error paths through `withEsClient` or command handlers uses an injected
`setExitCode` fake — never mutates `process.exitCode` directly. Tests
for handler code that currently sets `process.exitCode` directly should
migrate to the injected pattern as part of the handler migration.

**Acceptance Criteria**:

1. `withEsClient` exists in `src/cli/shared/with-es-client.ts`
2. ES client is closed on success and on error (error-isolated)
3. Injected logger is called on unexpected throw paths (full error
   object in metadata, not just message string)
4. Injected `printError` is called on unexpected throw paths
5. Injected `setExitCode` is called (not `process.exitCode` directly)
6. No `unknown` types, no type assertions
7. Integration tests prove all paths

#### Task 1.2: Migrate Lifecycle Ingest Commands

**Target**: `registerStageCmd` and `registerVersionedIngestCmd` in
`admin-lifecycle-commands.ts`.

**DELETE `buildLifecycleServiceForIngest`** — this function buries
resource handles (creates ES client and OakClient internally, returns
only the service). Instead, inline resource creation in the handler so
each resource has explicit ownership and cleanup. ADR-133 will codify
the rule: "factories must not bury resource handles".

**REPLACE existing `buildLifecycleServiceBasic`** in
`admin-lifecycle-alias-commands.ts` (line 33) — this function also
creates its own ES client internally (same anti-pattern). Create a
new shared version in `src/cli/shared/build-lifecycle-service.ts` that
accepts a pre-created ES client:

```typescript
function buildLifecycleService(
  esClient: Client,
  target: 'primary' | 'sandbox',
  runVersionedIngest: RunVersionedIngestFn,
  logger: Logger,
): IndexLifecycleService;
```

For alias-only commands (Task 1.3) that don't need real ingestion,
pass a no-op `runVersionedIngest` stub.

**TDD Sequence**:

1. **RED**: Write integration test — extract the `stage` action callback
   and call it directly with fake deps. After an error Result,
   `oakClient.disconnect()` is called. Run → FAILS.
2. **GREEN**: Refactor `registerStageCmd` to use `withEsClient` with
   local OakClient cleanup. Run → PASSES.
3. **RED**: Write integration test — when OakClient creation fails
   (throws), ES client is still closed (verified via `withEsClient`'s
   own tests — this test proves ES client is passed to `withEsClient`).
   Run → FAILS.
4. **GREEN**: Ensure OakClient creation is inside the handler (so
   `withEsClient`'s finally still closes ES client). Run → PASSES.
5. **REFACTOR**: Apply same pattern to `registerVersionedIngestCmd`.

**Note on integration test strategy**: To test `registerStageCmd`
without Commander indirection, extract the action callback into a
named function and test it directly. Alternatively, invoke the
Commander action by calling `.parseAsync(['node', 'test', 'stage',
'--bulk-dir', './fake'])` on a test program instance. The former is
simpler and preferred.

**Note on integration test intent**: These tests prove observable
behaviour: given a stage command with fake deps, OakClient cleanup
occurs after failure. They do NOT re-prove `withEsClient` behaviour
(e.g., `esClient.close()` is called) — that is proven by Task 1.1
tests. Each proof happens once.

**Acceptance Criteria**:

1. Both lifecycle ingest commands use `withEsClient`
2. ES client and OakClient are closed on success and error
3. OakClient disconnect failure does not prevent ES client close
4. ES client close failure does not prevent OakClient disconnect
5. Existing behaviour is preserved (same output, same exit codes)
6. `buildLifecycleServiceForIngest` deleted
7. Old `buildLifecycleServiceBasic` in `admin-lifecycle-alias-commands.ts` deleted

#### Task 1.3: Migrate Lifecycle Alias Commands

**Target**: `registerPromoteCmd`, `registerRollbackCmd`,
`registerValidateAliasesCmd` in `admin-lifecycle-alias-commands.ts`.

Uses the shared `buildLifecycleService` from Task 1.2 with a no-op
`runVersionedIngest` stub. No OakClient — simpler than ingest commands.

**Acceptance Criteria**:

1. All three alias commands use `withEsClient`
2. ES client is closed on success and error
3. Old `buildLifecycleServiceBasic` (which buried the ES client) is deleted

#### Task 1.4: Migrate SDK Admin Commands

**Target**: `registerSetupCmd`, `registerStatusCmd`,
`registerSynonymsCmd`, `registerMetaCmd`.

These use `createCliSdk` which creates an ES client internally. Migrate
to explicit ES client ownership: the handler creates the ES client via
`createEsClient(cliEnv)`, passes it to `withEsClient` for lifecycle
management, and calls `createSearchSdk` directly with the
externally-owned client.

**`ZERO_HIT_*` configuration**: The normalisation logic in `createCliSdk`
(webhook URL `'none'` → `undefined`, persistence/retention config)
moves to a shared `buildSearchSdkConfig(cliEnv)` pure function that
returns the config object without creating any resources. This function
is tested with its own unit tests.

After CLI callers are migrated, **retain `createCliSdk` for evaluation
scripts only** — the 8 benchmark scripts in `evaluation/analysis/` use
it and do not suffer from the hang problem. Add a TSDoc deprecation
note directing CLI commands to use `createEsClient` + `withEsClient`.

**Acceptance Criteria**:

1. All SDK admin commands use `withEsClient`
2. ES client is closed on success and error
3. All CLI callers use `createSearchSdk` with externally-owned client
4. `ZERO_HIT_*` normalisation in `buildSearchSdkConfig()` with unit tests
5. `createCliSdk` retained for evaluation scripts with deprecation TSDoc

#### Task 1.5: Migrate Search and Observe Commands

**Target**: All `search` subcommands and `observe summary`.

Same pattern as Task 1.4.

**Acceptance Criteria**:

1. All search and observe commands use `withEsClient`
2. ES client is closed on success and error

#### Task 1.6: Migrate Count Command

**Target**: `registerCountCmd`.

**Acceptance Criteria**:

1. Count command uses `withEsClient`
2. ES client is closed on success and error

#### Task 1.7: Ensure All Error Paths Log Structurally

For handlers using `withEsClient`, unexpected throws are automatically
logged by the wrapper. For Result errors, add a structured logger call
alongside each `printError` inside the handler body.

For pass-through orchestration commands that don't use the wrapper,
add structured logger calls alongside their `printError` calls.

**Acceptance Criteria**:

1. Every error path in every command logs via the structured logger
2. Every error path also calls `printError` for human-readable output
3. No error path exists that only writes to stderr

**Phase 1 Quality Gates**:

```bash
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
pnpm format:root
```

---

### Phase 2: Fail-Fast Precondition Checks and Path Resolution (TDD)

**Foundation Check-In**: Re-read `principles.md` (fail fast, validate at
entry points, Result pattern).

#### Task 2.1: Create `resolveBulkDir` Pure Function Returning `Result`

**Current problem**: `--bulk-dir ./bulk-downloads` resolves relative to
CWD. The actual bulk data lives at `apps/oak-search-cli/bulk-downloads`.
Running from the repo root produces an ENOENT deep inside
`readAllBulkFiles`, after expensive ES and OakClient connections are
already open. The legacy path has `validateBulkDir` which throws (not
Result), and the new lifecycle commands skip it entirely.

**Design**: A pure function `resolveBulkDir` with single-resolution
strategy:

- Absolute paths pass through as-is
- Relative paths resolve against `APP_ROOT` (already exported from
  `src/cli/shared/pass-through.ts`, line 22)
- No CWD fallback — this removes the ambiguity of dual resolution
- If the user wants CWD-relative, they pass an absolute path
- Returns `Result<string, BulkDirError>` — never throws
- Filesystem predicates are injected for testability (ADR-078)

```typescript
interface BulkDirError {
  readonly type: 'bulk_dir_not_found' | 'bulk_dir_empty';
  readonly message: string;
  readonly originalPath: string;
  readonly resolvedPath: string;
}

function resolveBulkDir(
  rawPath: string,
  appRoot: string,
  exists: (path: string) => boolean,
  hasJsonFiles: (path: string) => boolean,
): Result<string, BulkDirError>;
```

**Note on discriminant field**: `BulkDirError` uses `type` as the
discriminant, matching the existing codebase convention. ADR-088
examples use `kind`. This divergence is tracked as a follow-up to
reconcile (see Tracked Follow-Ups).

**TDD Sequence** (interleaved RED-GREEN):

1. **RED**: Write unit test — absolute path that exists → returns `ok`
   with the path unchanged. Run → FAILS (function does not exist).
2. **GREEN**: Implement minimal `resolveBulkDir`. Run → PASSES.
3. **RED**: Write unit test — relative path resolved against `appRoot`
   where the resolved path exists → returns `ok` with resolved path.
   Run → FAILS.
4. **GREEN**: Add relative path resolution. Run → PASSES.
5. **RED**: Write unit test — resolved path does not exist → returns
   `err` with `bulk_dir_not_found`, helpful message including the
   resolved path and a hint. Run → FAILS.
6. **GREEN**: Add existence check and error path. Run → PASSES.
7. **RED**: Write unit test — path exists but `hasJsonFiles` returns
   false → returns `err` with `bulk_dir_empty`. Run → FAILS.
8. **GREEN**: Add empty-dir check. Run → PASSES.
9. **REFACTOR**: Clean up.

**Note on purity**: `exists` and `hasJsonFiles` are injected as
parameters. Tests pass simple inline fakes — no mocking framework, no
real filesystem. The composition root passes `fs.existsSync` and a
thin wrapper around `fs.readdirSync`.

**Predicate contract**: `hasJsonFiles` must not throw — it returns
`false` if the directory is unreadable. The composition root wrapper
should catch `readdirSync` errors and return `false`.

**Acceptance Criteria**:

1. `resolveBulkDir` is a pure function in `src/cli/shared/resolve-bulk-dir.ts`
2. Returns `Result<string, BulkDirError>` — never throws
3. Single resolution strategy: absolute pass-through, relative against `APP_ROOT`
4. FS predicates injected as parameters (ADR-078)
5. Error includes original path, resolved path, and hint
6. Unit tests cover: absolute path, relative path, path not found, empty dir

#### Task 2.2: Wire `resolveBulkDir` Into Lifecycle Commands

Call `resolveBulkDir` *before* `withEsClient` creates any connections.

**Pattern contract**: All preconditions MUST be checked before resource
creation. This ordering is enforced by integration tests (Task 2.2 TDD)
and verified by grep during Phase 0 audit.

```typescript
// In the action handler, ALL preconditions BEFORE creating resources:
// 1. Validate env (cheapest — pure string check)
const envResult = validateIngestEnv({ oakApiKey: cliEnv.OAK_API_KEY });
if (!envResult.ok) {
  ingestLogger.error('Env validation failed', envResult.error);
  printError(envResult.error.message);
  deps.setExitCode(1);
  return;
}
// 2. Resolve and validate bulk dir (cheap FS — existsSync + readdirSync)
const dirResult = resolveBulkDir(
  opts.bulkDir,
  APP_ROOT,
  fs.existsSync,
  (p) => { try { return fs.readdirSync(p).some((f) => f.endsWith('.json')); } catch { return false; } },
);
if (!dirResult.ok) {
  ingestLogger.error('Bulk directory validation failed', dirResult.error);
  printError(dirResult.error.message);
  deps.setExitCode(1);
  return;
}
const resolvedBulkDir = dirResult.value;
// 3. NOW create resources and proceed (ES client, OakClient)
```

**TDD Sequence**:

1. **RED**: Write integration test — `stage` with non-existent
   `--bulk-dir` fails immediately with helpful message and does NOT
   create an ES client. Run → FAILS.
2. **GREEN**: Add precondition check before `withEsClient`.
   Run → PASSES.

**Acceptance Criteria**:

1. Missing `--bulk-dir` is detected before any connections are opened
2. Error message includes the resolved path and a hint
3. No ES client or OakClient is created when the precondition fails
4. Logger records the error structurally
5. Verify with grep: no `createEsClient` call before `resolveBulkDir` in any ingest handler

#### Task 2.3: Wire `resolveBulkDir` Into Legacy Ingest Path

Replace `validateBulkDir` (which throws) with `resolveBulkDir` (which
returns Result) in the legacy `admin ingest` orchestration path.

**Acceptance Criteria**:

1. Legacy `validateBulkDir` deleted
2. Legacy ingest uses `resolveBulkDir` and handles the Result
3. No `throw` in the bulk dir validation path
4. Legacy `validateBulkDir` is not called anywhere (verify with grep)

#### Task 2.4: Validate Environment Preconditions Early

Check that `OAK_API_KEY` is present before creating connections in
lifecycle ingest commands. Currently this throws inside
`createIngestionClient` after the ES client is already open.

**Design**: A `validateIngestEnv` function that accepts env as an
explicit parameter (ADR-078 — no reading `process.env` directly):

```typescript
function validateIngestEnv(
  env: { oakApiKey: string | undefined },
): Result<void, EnvError>;
```

**Note on scope**: `validateIngestEnv` only checks ingest-specific env
vars like `OAK_API_KEY` that are not in the base config schema. ES
connection parameters (`ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`)
are already validated by `loadRuntimeConfig` at the composition root
(`bin/oaksearch.ts` lines 27–40) before any command handler runs.

**TDD Sequence**:

1. **RED**: Write unit test — `validateIngestEnv({ oakApiKey: 'key' })`
   returns `ok`. Run → FAILS (function does not exist).
2. **GREEN**: Implement minimal function returning `ok`. Run → PASSES.
3. **RED**: Write unit test — `validateIngestEnv({ oakApiKey: undefined })`
   returns `err` with clear message. Run → FAILS.
4. **GREEN**: Add validation check. Run → PASSES.

**Note**: The underlying `requireOakApiKey` in `oak-adapter.ts` still
throws. `validateIngestEnv` is a precondition check that runs before
`createIngestionClient` is called, avoiding the throw path entirely.
Converting `requireOakApiKey` itself is tracked as a follow-up.

**Acceptance Criteria**:

1. Missing `OAK_API_KEY` is detected before ES client creation
2. Returns `Result`, does not throw
3. Accepts env as an explicit parameter (not `process.env`)
4. Error message is clear and actionable

**Phase 2 Quality Gates**: Same as Phase 1.

---

### Phase 3: E2E Validation and Edge Cases (TDD)

**Foundation Check-In**: Re-read `principles.md` (fail fast),
`testing-strategy.md` (E2E tests specify system behaviour).

**Note**: `parseAsync()` + `process.exit()` was applied in Phase 1
(Task 1.0). This phase extends the E2E tests from Phase 1 with
additional assertions proving the full system works end-to-end after
all migrations.

#### Task 3.1: E2E Validation of Full Cleanup Chain

**Context**: The E2E tests written in Task 1.0 prove the process exits.
This task extends them with stronger assertions on error message
content (resolved path shown, hint included) now that Phase 2
preconditions are in place.

**Steps**:

1. **EXTEND**: Update the error-path E2E test from Task 1.0 to assert
   the error message includes the resolved path and a hint (Phase 2
   precondition now provides this). Run → verify it PASSES.
2. **VERIFY**: Confirm `--help` baseline test still passes after all
   migrations.

**Note**: `oaksearch admin status` requires a running ES cluster,
making it unsuitable for CI E2E tests. Use `--help` for the
success-path exit test — it exercises the full `parseAsync()` →
`disableFileSink()` → `process.exit()` chain without external deps.

**Acceptance Criteria**:

1. E2E tests prove no-hang on both error and success paths
2. Error path test validates helpful error message content
3. Tests complete within 5-second timeout (no hangs)

**Phase 3 Quality Gates**:

```bash
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm format:root
pnpm markdownlint:root
```

---

### Phase 4: Reviewer Gates, Documentation, and ADR

#### Task 4.1: Post-Implementation Reviews

Invoke all mandatory reviewers:

- `code-reviewer` — gateway review of the pattern and all migrations
- `architecture-reviewer-barney` — boundary mapping: is `withEsClient`
  the right abstraction at the right layer?
- `architecture-reviewer-wilma` — resilience: are all failure modes
  covered? What if cleanup throws?
- `test-reviewer` — TDD compliance, test quality
- `type-reviewer` — type flow through `withEsClient` and `resolveBulkDir`
- `docs-adr-reviewer` — documentation completeness

#### Task 4.2: Create ADR-133: CLI Resource Lifecycle Management

The `withEsClient` pattern is a cross-cutting architectural decision
that all future CLI commands must follow. It changes how the process
exits (explicit `process.exit()` instead of event loop drainage) and
mandates resource cleanup via `finally` blocks.

**Pre-check**: Verify ADR README index is up to date. ADR-132
(`132-sitemap-scanner-for-canonical-url-validation.md`) exists on disk
but may be missing from the README index — backfill if needed before
adding ADR-133.

**Contents**:

- Status: Proposed (update to Accepted after implementation and review)
- Context: TCP connections preventing process exit
- Decision: `withEsClient` wrapper + `parseAsync()` + `process.exit()`;
  `setExitCode` injected via deps (no direct `process.exitCode` mutation
  in shared utilities)
- Rule: factories must not bury resource handles — if a factory creates
  a closeable resource, the caller must receive the handle for cleanup
  (anti-pattern: `buildLifecycleServiceForIngest` created ES client and
  OakClient but returned only the service; also: old
  `buildLifecycleServiceBasic` in alias commands created ES client
  internally — corrected during this work)
- Consequences: all commands must use the wrapper; ingest commands
  manage OakClient cleanup locally; `disableFileSink()` at composition
  root, not in the wrapper
- Known deferred violations: OakClient singleton in `oak-adapter.ts`
  (tracked for follow-up)
- Rejected alternatives: generic `withCliResources<R>` (YAGNI),
  signal handlers (YAGNI), event loop drainage (broken)

**Path**: `docs/architecture/architectural-decisions/133-cli-resource-lifecycle-management.md`

#### Task 4.3: Documentation

1. **TSDoc on all new functions**: `withEsClient`, `resolveBulkDir`,
   `validateIngestEnv`, `buildLifecycleService`, `buildSearchSdkConfig`
2. **Update CLI README**: specific sections to update:
   - Directory overview: add `src/cli/shared/with-es-client.ts`,
     `resolve-bulk-dir.ts`, `validate-ingest-env.ts`,
     `build-lifecycle-service.ts`
   - Technical highlights: add note on resource lifecycle and process
     exit guarantee
   - CLI Reference: update `--bulk-dir` flag description to explain
     that relative paths resolve against the app directory, not CWD
3. **Create ADR-133** (Task 4.2 above)

---

## Testing Strategy

### Unit Tests (Pure Functions — No IO, No Mocks)

- `resolveBulkDir` — absolute path passthrough, relative path resolved
  against appRoot, path not found, empty dir. FS predicates injected
  as simple inline fakes. Named `resolve-bulk-dir.unit.test.ts`.
- `validateIngestEnv` — missing `oakApiKey` returns err, present returns
  ok. Env passed as explicit parameter. Named
  `validate-ingest-env.unit.test.ts`.
- `buildSearchSdkConfig` — `ZERO_HIT_WEBHOOK_URL` normalisation, config
  assembly. Named `build-search-sdk-config.unit.test.ts`.

### Integration Tests (Code Units Working Together — Simple Injected Fakes)

- `withEsClient` — cleanup on success, cleanup on handler throw,
  structured logging on throw (full error in metadata), setExitCode
  called on throw, cleanup error isolated (close throws but is caught).
  Uses `vi.fn()` for `esClient.close()`, `setExitCode`, and simple
  logger fakes injected as deps.
  Named `with-es-client.integration.test.ts`.
- `registerStageCmd` with fake ES client and fake OakClient —
  OakClient disconnected after error Result, OakClient disconnected on
  success. Named in `admin-lifecycle-commands.integration.test.ts`.
- `resolveBulkDir` wired into `stage` handler — precondition failure
  prevents resource creation.

### E2E Tests (Running System — Separate Process)

- `oaksearch admin stage --bulk-dir ./does-not-exist` exits within
  5 seconds with code 1 and helpful error message. Named
  `cli-exit.e2e.test.ts` in `apps/oak-search-cli/e2e-tests/`.
- `oaksearch --help` exits cleanly with code 0 (success path baseline).

### Test Isolation Rules

- **No `process.exitCode` mutation**: All tests use the injected
  `setExitCode` fake. No `afterEach` cleanup for `process.exitCode`.
- **No `vi.mock`, `vi.stubGlobal`, `process.env` mutation**: Per
  ADR-078 and testing-strategy.md.
- **Each proof once**: `withEsClient` tests prove ES cleanup.
  Handler tests prove handler-specific behaviour (OakClient cleanup,
  precondition ordering). No duplication.

---

## Done When

### Functional

1. Every CLI command exits cleanly on success (no hang)
2. Every CLI command exits cleanly on error (no hang)
3. `admin stage --bulk-dir ./does-not-exist` fails fast with helpful
   message showing resolved path and hint
4. `admin stage --bulk-dir ./bulk-downloads` resolves to
   `apps/oak-search-cli/bulk-downloads` via `APP_ROOT` resolution

### Structural

5. `withEsClient` pattern used by all resource-creating commands
6. Ingest commands manage OakClient cleanup locally in `finally` blocks
7. Every error path logs through the structured logger AND `printError`
8. Cheap preconditions checked before expensive resource creation
9. No `finally`-less resource creation in any command handler
10. `withEsClient` accepts logger, printError, and setExitCode as
    injected deps (ADR-078)
11. `resolveBulkDir` returns `Result<string, BulkDirError>` — never throws
12. `validateIngestEnv` accepts env as parameter, returns `Result` — never throws
13. Legacy `validateBulkDir` (throws) replaced with `resolveBulkDir`
14. `buildLifecycleServiceForIngest` deleted (buried resource handles)
15. Old `buildLifecycleServiceBasic` in alias commands deleted (buried ES client)
16. `createCliSdk` retained for evaluation scripts only, with deprecation TSDoc
17. `bin/oaksearch.ts` uses `parseAsync()` + `disableFileSink()` + `process.exit()`
18. Each resource cleanup is error-isolated (own try/catch)
19. `disableFileSink()` called at composition root with error-isolated `end()`
20. `ZERO_HIT_*` config normalisation in `buildSearchSdkConfig()` pure function

### Quality

21. All quality gates pass
22. All mandatory reviewers invoked and findings addressed
23. TSDoc on all new public API surfaces
24. ADR-133 created for CLI resource lifecycle management
25. CLI README updated (directory overview, technical highlights, `--bulk-dir`)
26. Unit tests for `resolveBulkDir` (absolute, relative, not found, empty)
27. Unit tests for `validateIngestEnv` (missing key, present key)
28. Unit tests for `buildSearchSdkConfig` (ZERO_HIT normalisation)
29. Integration tests for `withEsClient` (cleanup on success, throw, close error)
30. Integration tests for command handlers (cleanup called after error)
31. E2E tests prove no-hang behaviour (process exits within 5 seconds)

### Tracked Follow-Ups (Outside Scope)

- Convert `validators.ts` throw-sites to Result (3 functions)
- Convert `admin-sdk-commands.ts:182` throw to Result
- Convert `createIngestionClient` CacheRequiredError to Result
- Convert `requireOakApiKey` throw to Result
- Refactor OakClient singleton pattern (DI violation — also a known
  violation of ADR-133's "factories must not bury resource handles" rule)
- Reconcile ADR-088 discriminant field convention (`kind` in ADR
  examples vs `type` in codebase)
- Migrate evaluation benchmark scripts away from `createCliSdk` if they
  need resource cleanup

---

## Key Files

| File | Role |
|------|------|
| `apps/oak-search-cli/bin/oaksearch.ts` | Composition root — gains `parseAsync` + `process.exit()` |
| `apps/oak-search-cli/src/cli/shared/with-es-client.ts` | NEW — `withEsClient` wrapper |
| `apps/oak-search-cli/src/cli/shared/build-lifecycle-service.ts` | NEW — shared `buildLifecycleService` (replaces both buried-handle factories) |
| `apps/oak-search-cli/src/cli/shared/build-search-sdk-config.ts` | NEW — `buildSearchSdkConfig` pure function for ZERO_HIT config |
| `apps/oak-search-cli/src/cli/shared/output.ts` | `printError` — unchanged but now always paired with logger |
| `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` | Gains `withEsClient` wrapping + local OakClient cleanup; `buildLifecycleServiceForIngest` DELETED |
| `apps/oak-search-cli/src/cli/admin/admin-lifecycle-alias-commands.ts` | Gains `withEsClient` wrapping; old `buildLifecycleServiceBasic` DELETED |
| `apps/oak-search-cli/src/cli/admin/admin-sdk-commands.ts` | Gains `withEsClient` wrapping |
| `apps/oak-search-cli/src/cli/admin/admin-count-command.ts` | Gains `withEsClient` wrapping |
| `apps/oak-search-cli/src/cli/admin/admin-orchestration-commands.ts` | Gains structured logger calls alongside `printError` |
| `apps/oak-search-cli/src/cli/search/index.ts` | Gains `withEsClient` wrapping |
| `apps/oak-search-cli/src/cli/observe/index.ts` | Gains `withEsClient` wrapping |
| `apps/oak-search-cli/src/cli/shared/create-cli-sdk.ts` | `createEsClient` unchanged; `createCliSdk` retained for evaluation only with deprecation TSDoc |
| `apps/oak-search-cli/src/cli/shared/resolve-bulk-dir.ts` | NEW — `resolveBulkDir` pure function returning `Result` |
| `apps/oak-search-cli/src/cli/shared/validate-ingest-env.ts` | NEW — `validateIngestEnv` returning `Result` |
| `apps/oak-search-cli/src/cli/shared/pass-through.ts` | `APP_ROOT` — used by `resolveBulkDir` at the call site. **Verify**: relative depth (`../../..`) must be correct in compiled `dist/` output, not just source |
| `apps/oak-search-cli/src/adapters/oak-adapter.ts` | OakClient `disconnect()` — called by ingest handler cleanup |
| `apps/oak-search-cli/src/lib/logger.ts` | `disableFileSink()` — called at composition root; gains error-isolated `end()` call |
| `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest-cli-validators.ts` | `validateBulkDir` DELETED — replaced by `resolveBulkDir` |

---

## References

### Foundation Documents

- `.agent/directives/principles.md` — fail fast, DRY, KISS, Result pattern
- `.agent/directives/testing-strategy.md` — TDD at all levels

### ADRs

- [ADR-078](../../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md) — Dependency injection for testability
- [ADR-088](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) — Result pattern for explicit error handling
- [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) — Bulk-first ingestion strategy
- [ADR-130](../../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md) — Blue/green index lifecycle

### Related Plans

- [Unified Versioned Ingestion](unified-versioned-ingestion.plan.md) — Phase 3 blocked by this
