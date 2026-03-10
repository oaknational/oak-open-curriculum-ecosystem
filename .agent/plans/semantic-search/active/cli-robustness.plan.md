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
  - id: phase-1-teardown
    content: "Phase 1: Introduce teardown pattern and resource scoping (TDD)."
    status: pending
  - id: phase-2-error-logging
    content: "Phase 2: Route CLI errors through the structured logger (TDD)."
    status: pending
  - id: phase-3-preconditions
    content: "Phase 3: Fail-fast precondition checks before resource creation (TDD)."
    status: pending
  - id: phase-4-process-exit
    content: "Phase 4: Guarantee process exit and graceful shutdown (TDD)."
    status: pending
  - id: phase-5-review
    content: "Phase 5: Reviewer gates and documentation."
    status: pending
isProject: false
---

# CLI Robustness: Error Handling, Process Lifecycle, and Dev-Ex

**Last Updated**: 2026-03-10
**Status**: PLANNED — awaiting reviewer approval
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

7. **No graceful shutdown** — No `SIGINT`/`SIGTERM` handlers exist.
   Ctrl+C during a long-running ingest may leave partial state in
   Elasticsearch with no cleanup.

8. **Module-level OakClient singleton** — `oak-adapter.ts` has a
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
3. **Resources are always cleaned up** — ES clients and OakClients are
   closed in `finally` blocks, regardless of success or failure
4. **Cheap checks happen first** — path existence, env validation, and
   other preconditions are validated before creating expensive connections
5. **Path resolution is robust** — `--bulk-dir` resolves relative to the
   app directory when no absolute path is given, with a clear error
   message showing resolved path, CWD, and a hint when the path is wrong
6. **All errors use `Result<T, E>`** — No `throw`/`catch` in the error
   handling path. Functions that can fail return `Result`. Callers handle
   both cases explicitly. This is a principles mandate: "Handle All Cases
   Explicitly — Don't throw, use the result pattern `Result<T, E>`"
7. **Graceful shutdown on signals** — SIGINT/SIGTERM close resources and
   exit with appropriate codes
8. **The pattern is simple and copyable** — future commands get the
   right behaviour by following the established pattern
9. **High-quality tests prove every behaviour** — TDD at all levels.
   Unit tests for pure functions (path resolution, precondition
   validation), integration tests for the resource wrapper pattern,
   E2E tests proving the process exits cleanly

## Non-Goals (YAGNI)

- Refactoring the OakClient singleton pattern (separate concern,
  documented for follow-up)
- Adding retry logic or reconnection handling
- Changing the Commander.js framework
- Refactoring the SDK lifecycle service interface
- Adding OTel/tracing (separate concern)

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` — fail fast, DRY, KISS
2. **Re-read** `.agent/directives/testing-strategy.md` — TDD at all levels
3. **Ask**: "Could it be simpler without compromising quality?"
4. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Strategic Approach

### Key Insight: Composition Root Owns Resources

The entry point (`bin/oaksearch.ts`) is the composition root (ADR-078).
Resource lifecycle should be managed here or in a thin wrapper that
command handlers use. The pattern is:

```typescript
// What we want: resource-scoped command execution
const { resources, cleanup } = await createCommandResources(cliEnv);
try {
  await command.execute(resources);
} finally {
  await cleanup();
}
```

### Design Decision: `withCliResources` Higher-Order Pattern

Rather than modifying every handler individually, introduce a
`withCliResources` wrapper that:

1. Creates resources (ES client, optionally OakClient)
2. Executes the handler with those resources
3. Closes all resources in a `finally` block
4. Calls `process.exit(process.exitCode ?? 0)` after cleanup

This is the simplest approach that fixes all commands uniformly.

### Two Resource Tiers

Not all commands need the same resources:

- **Tier 1 (ES only)**: `setup`, `reset`, `status`, `synonyms`, `meta`,
  `count`, `promote`, `rollback`, `validate-aliases`, all `search`,
  `observe` — need only an ES client
- **Tier 2 (ES + OakClient)**: `stage`, `versioned-ingest` — need ES
  client and OakClient (with optional Redis)

The wrapper should support both tiers without over-engineering.

### Error Logging: Dual Output

When a command fails, the error should be:

1. **Logged structurally** via the logger (JSON, with type + context)
2. **Printed humanly** via `printError` (chalk, for the user's terminal)

This preserves the human-readable terminal output while adding
structured observability. The logger call happens *inside* the wrapper;
individual handlers don't need to change their `printError` calls.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ES client `close()` throws | Low | Low | Wrap in try/catch in cleanup, log warning |
| OakClient `disconnect()` throws | Low | Low | Same — wrap, log, continue |
| `process.exit()` prevents pending writes | Medium | Medium | Flush logger before exit; `process.exit` is called *after* cleanup |
| Existing tests break from new exit behaviour | Medium | Medium | New pattern is additive — existing handler logic unchanged |
| Commander async action + process.exit interaction | Low | Medium | Test explicitly; Commander 12+ handles async actions |

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
   sites in `src/cli/`
2. For each, check whether a `close()`/`disconnect()` call exists
3. Document the inventory

**Acceptance Criteria**:

1. Complete table of all commands with resource creation and cleanup status
2. No command is missed

#### Task 0.2: Catalogue All `printError` Call Sites

**Goal**: Enumerate every place where errors are printed without
structured logging.

**Validation**: `grep -rn 'printError' apps/oak-search-cli/src/cli/`

**Acceptance Criteria**: Complete list of all `printError` call sites
that lack a corresponding logger call.

**Phase 0 Complete When**: Both inventories documented. No code changes.

---

### Phase 1: Introduce Teardown Pattern and Resource Scoping (TDD)

**Foundation Check-In**: Re-read `principles.md` (DRY, fail fast),
`testing-strategy.md` (TDD).

#### Task 1.1: Create `CliResources` Type and `withCliResources` Wrapper

**Design**: A higher-order function that wraps command handler execution
with resource lifecycle management.

```typescript
/** Resources available to CLI command handlers. */
interface CliResources {
  readonly esClient: Client;
}

/** Extended resources for commands that need Oak API access. */
interface IngestCliResources extends CliResources {
  readonly oakClient: OakClient;
}

/** Cleanup function returned by resource factories. */
type CleanupFn = () => Promise<void>;

/**
 * Execute a command handler with managed resource lifecycle.
 *
 * Creates resources, runs the handler, closes resources in finally,
 * and ensures process exit.
 */
async function withCliResources<R extends CliResources>(
  createResources: () => Promise<{ resources: R; cleanup: CleanupFn }>,
  handler: (resources: R) => Promise<void>,
): Promise<void> {
  let cleanup: CleanupFn = () => Promise.resolve();
  try {
    const created = await createResources();
    cleanup = created.cleanup;
    await handler(created.resources);
  } catch (error) {
    ingestLogger.error('Command failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    printError(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    await cleanup();
  }
}
```

**TDD Sequence**:

1. **RED**: Write unit test — `withCliResources` calls cleanup on
   success. Run → FAILS (function does not exist).
2. **RED**: Write unit test — `withCliResources` calls cleanup on error
   and sets exitCode. Run → FAILS.
3. **RED**: Write unit test — `withCliResources` calls cleanup even when
   handler throws. Run → FAILS.
4. **GREEN**: Implement `withCliResources`. Run → all PASS.
5. **REFACTOR**: Extract if needed.

**Acceptance Criteria**:

1. `withCliResources` exists in `src/cli/shared/`
2. Cleanup is called on success, on Result error, and on thrown error
3. Logger is called on error paths
4. No `unknown` types, no type assertions
5. Unit tests prove all three paths

#### Task 1.2: Create Resource Factory Functions

**Design**: Two factory functions matching the two resource tiers.

```typescript
function createBasicResources(cliEnv: CliSdkEnv): Promise<{
  resources: CliResources;
  cleanup: CleanupFn;
}>;

function createIngestResources(cliEnv: LifecycleIngestEnv): Promise<{
  resources: IngestCliResources;
  cleanup: CleanupFn;
}>;
```

**TDD Sequence**:

1. **RED**: Write test — `createBasicResources` returns resources and a
   cleanup that calls `esClient.close()`. Run → FAILS.
2. **RED**: Write test — `createIngestResources` returns resources and a
   cleanup that calls both `esClient.close()` and
   `oakClient.disconnect()`. Run → FAILS.
3. **GREEN**: Implement both. Run → PASS.
4. **REFACTOR**: Ensure cleanup errors are caught and logged, not thrown.

**Acceptance Criteria**:

1. Both factories return `{ resources, cleanup }`
2. Cleanup closes all created connections
3. Cleanup errors are logged as warnings, not thrown
4. Tests prove cleanup is called for each resource

#### Task 1.3: Migrate Lifecycle Ingest Commands

**Target**: `registerStageCmd` and `registerVersionedIngestCmd`.

Refactor `buildLifecycleServiceForIngest` to return
`{ service, cleanup }` and wrap both handlers in `withCliResources`.

**TDD Sequence**:

1. **RED**: Write integration test — after `stage` returns an error
   Result, the cleanup function is called. Run → FAILS.
2. **GREEN**: Refactor `registerStageCmd` to use `withCliResources`.
   Run → PASSES.
3. **REFACTOR**: Apply same pattern to `registerVersionedIngestCmd`.

**Acceptance Criteria**:

1. Both lifecycle ingest commands use `withCliResources`
2. ES client and OakClient are closed on success and error
3. Existing behaviour is preserved (same output, same exit codes)

#### Task 1.4: Migrate Lifecycle Alias Commands

**Target**: `registerPromoteCmd`, `registerRollbackCmd`,
`registerValidateAliasesCmd`.

Refactor `buildLifecycleServiceBasic` to return `{ service, cleanup }`
and wrap all three handlers.

**Acceptance Criteria**:

1. All three alias commands use `withCliResources`
2. ES client is closed on success and error

#### Task 1.5: Migrate SDK Admin Commands

**Target**: `registerSetupCmd`, `registerStatusCmd`,
`registerSynonymsCmd`, `registerMetaCmd`.

These use `createCliSdk` which creates an ES client internally. Either:

- (a) Modify `createCliSdk` to return `{ sdk, cleanup }`, or
- (b) Have the wrapper create the ES client and pass it to `createSearchSdk`

Option (b) is preferred — it makes the resource ownership explicit.

**Acceptance Criteria**:

1. All SDK admin commands use `withCliResources`
2. ES client is closed on success and error

#### Task 1.6: Migrate Search and Observe Commands

**Target**: All `search` subcommands and `observe summary`.

Same pattern as Task 1.5.

**Acceptance Criteria**:

1. All search and observe commands use `withCliResources`
2. ES client is closed on success and error

#### Task 1.7: Migrate Count Command

**Target**: `registerCountCmd`.

**Acceptance Criteria**:

1. Count command uses `withCliResources`
2. ES client is closed on success and error

**Phase 1 Quality Gates**:

```bash
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
pnpm format:root
```

---

### Phase 2: Route CLI Errors Through the Structured Logger (TDD)

**Foundation Check-In**: Re-read `principles.md` (fail fast with helpful
errors).

#### Task 2.1: Add Structured Error Logging to `withCliResources`

The wrapper already catches errors. Ensure it logs them structurally:

```typescript
ingestLogger.error('Command failed', {
  errorType: result.error.type,  // if Result error
  message: result.error.message,
  command: commandName,          // passed as context
});
```

**TDD Sequence**:

1. **RED**: Write test — when handler returns error Result, logger.error
   is called with structured data. Run → FAILS.
2. **GREEN**: Add logger call. Run → PASSES.

**Acceptance Criteria**:

1. Every error path in `withCliResources` logs via the structured logger
2. Logger call includes error type, message, and command context
3. `printError` is still called for human-readable terminal output
4. Both outputs happen on every error

#### Task 2.2: Add Structured Error Logging to Handlers That Don't Use the Wrapper

Some handlers (e.g., pass-through orchestration) don't use the wrapper.
Ensure they also log errors structurally.

**Acceptance Criteria**:

1. Every `printError` call site has a corresponding logger call
2. No error path exists that only writes to stderr

**Phase 2 Quality Gates**: Same as Phase 1.

---

### Phase 3: Fail-Fast Precondition Checks and Path Resolution (TDD)

**Foundation Check-In**: Re-read `principles.md` (fail fast, validate at
entry points, Result pattern).

#### Task 3.1: Create `resolveBulkDir` Pure Function Returning `Result`

**Current problem**: `--bulk-dir ./bulk-downloads` resolves relative to
CWD. The actual bulk data lives at `apps/oak-search-cli/bulk-downloads`.
Running from the repo root produces an ENOENT deep inside
`readAllBulkFiles`, after expensive ES and OakClient connections are
already open. The legacy path has `validateBulkDir` which throws (not
Result), and the new lifecycle commands skip it entirely.

**Target**: A pure function `resolveBulkDir` that:

1. Resolves the path relative to CWD (current behaviour for absolute paths)
2. If the resolved path does not exist, tries resolving relative to the
   app directory (e.g., `import.meta.dirname` or a passed `appRoot`)
3. Returns `Result<string, BulkDirError>` — never throws
4. On error, includes: the original path, the resolved path, CWD, the
   app-relative attempt, and a hint

```typescript
interface BulkDirError {
  readonly type: 'bulk_dir_not_found' | 'bulk_dir_empty';
  readonly message: string;
  readonly originalPath: string;
  readonly resolvedPath: string;
  readonly cwd: string;
}

function resolveBulkDir(
  rawPath: string,
  cwd: string,
  appRoot: string,
): Result<string, BulkDirError>;
```

**TDD Sequence**:

1. **RED**: Write unit test — `resolveBulkDir('./bulk-downloads', '/repo',
   '/repo/apps/oak-search-cli')` where the CWD path does not exist but
   the app-relative path does → returns `ok` with the app-relative path.
   Run → FAILS.
2. **RED**: Write unit test — neither path exists → returns `err` with
   helpful message including both attempted paths. Run → FAILS.
3. **RED**: Write unit test — CWD path exists → returns `ok` with CWD
   path (current behaviour preserved). Run → FAILS.
4. **RED**: Write unit test — path exists but contains no JSON files →
   returns `err` with `bulk_dir_empty`. Run → FAILS.
5. **GREEN**: Implement `resolveBulkDir`. Run → all PASS.
6. **REFACTOR**: Delete legacy `validateBulkDir` (it throws instead of
   returning Result) and update its callers.

**Acceptance Criteria**:

1. `resolveBulkDir` is a pure function returning `Result<string, BulkDirError>`
2. Tries CWD-relative first, then app-relative as fallback
3. Error includes original path, resolved path, CWD, and hint
4. No `throw` — callers handle the Result explicitly
5. Unit tests cover: CWD hit, app-relative fallback, both miss, empty dir

#### Task 3.2: Wire `resolveBulkDir` Into Lifecycle Commands

Call `resolveBulkDir` *before* `withCliResources` creates any connections.

```typescript
// In the action handler, BEFORE creating resources:
const dirResult = resolveBulkDir(opts.bulkDir, process.cwd(), appRoot);
if (!dirResult.ok) {
  ingestLogger.error('Bulk directory validation failed', dirResult.error);
  printError(dirResult.error.message);
  process.exitCode = 1;
  return;
}
const resolvedBulkDir = dirResult.value;
// NOW create resources and proceed
```

**TDD Sequence**:

1. **RED**: Write integration test — `stage` with non-existent
   `--bulk-dir` fails immediately with helpful message and does NOT
   create an ES client. Run → FAILS.
2. **GREEN**: Add precondition check before `withCliResources`.
   Run → PASSES.

**Acceptance Criteria**:

1. Missing `--bulk-dir` is detected before any connections are opened
2. Error message includes both attempted paths and a hint
3. No ES client or OakClient is created when the precondition fails
4. Logger records the error structurally with full context

#### Task 3.3: Wire `resolveBulkDir` Into Legacy Ingest Path

Replace `validateBulkDir` (which throws) with `resolveBulkDir` (which
returns Result) in the legacy `admin ingest` orchestration path.

**Acceptance Criteria**:

1. Legacy `validateBulkDir` deleted
2. Legacy ingest uses `resolveBulkDir` and handles the Result
3. No `throw` in the bulk dir validation path

#### Task 3.4: Validate Environment Preconditions Early

Check that `OAK_API_KEY` is present before creating connections in
lifecycle ingest commands. Currently this throws inside
`createIngestionClient` after the ES client is already open.

**Target**: A `validateIngestEnv` function returning
`Result<void, EnvError>` that checks all required env vars before any
resource creation.

**TDD Sequence**:

1. **RED**: Write unit test — `validateIngestEnv` without `OAK_API_KEY`
   returns `err` with clear message. Run → FAILS.
2. **GREEN**: Implement. Run → PASSES.

**Acceptance Criteria**:

1. Missing `OAK_API_KEY` is detected before ES client creation
2. Returns `Result`, does not throw
3. Error message is clear and actionable

**Phase 3 Quality Gates**: Same as Phase 1.

---

### Phase 4: Process Exit Guarantee and Graceful Shutdown (TDD)

**Foundation Check-In**: Re-read `principles.md` (fail fast).

#### Task 4.1: Ensure `process.exit()` After Cleanup

**Current**: `process.exitCode = 1` relies on event loop drainage, which
fails when resources hold sockets open.

**Target**: After Phase 1 cleanup closes all resources, add an explicit
`process.exit()` at the composition root level to guarantee termination.

**Design**: In `bin/oaksearch.ts`:

```typescript
const result = await program.parseAsync();
// Commander 12+ parseAsync resolves after the action completes.
// At this point, all withCliResources finally blocks have run.
process.exit(process.exitCode ?? 0);
```

This is the simplest guarantee. If cleanup worked (Phase 1), it is
redundant but harmless. If cleanup missed something, it prevents hangs.

**TDD Sequence**:

1. **RED**: Write E2E test — run `oaksearch admin stage --bulk-dir
   /nonexistent` and assert the process exits within 5 seconds. Run →
   FAILS (currently hangs).
2. **GREEN**: Add `process.exit()` after `parseAsync()`. Run → PASSES.

**Acceptance Criteria**:

1. CLI always exits after command completes (success or failure)
2. Exit code is preserved correctly
3. E2E test proves no hang

#### Task 4.2: Add SIGINT/SIGTERM Graceful Shutdown

**Design**: Register signal handlers that:

1. Log a shutdown message
2. Set exit code (130 for SIGINT, 143 for SIGTERM)
3. Call any registered cleanup functions
4. Call `process.exit()`

This is a safety net for long-running operations (e.g., bulk ingest)
where the user presses Ctrl+C.

**TDD Sequence**:

1. **RED**: Write test — sending SIGINT to the process calls cleanup
   and exits with code 130. Run → FAILS.
2. **GREEN**: Add signal handlers. Run → PASSES.

**Acceptance Criteria**:

1. SIGINT and SIGTERM are handled
2. Cleanup runs before exit
3. Exit codes follow convention (130, 143)

**Phase 4 Quality Gates**:

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

### Phase 5: Reviewer Gates and Documentation

#### Task 5.1: Post-Implementation Reviews

Invoke all mandatory reviewers:

- `code-reviewer` — gateway review of the pattern and all migrations
- `architecture-reviewer-barney` — boundary mapping: is `withCliResources`
  the right abstraction at the right layer?
- `architecture-reviewer-wilma` — resilience: are all failure modes
  covered? What if cleanup throws during signal handling?
- `test-reviewer` — TDD compliance, test quality
- `type-reviewer` — type flow through `withCliResources` generics
- `docs-adr-reviewer` — documentation completeness

#### Task 5.2: Documentation

1. **TSDoc on all new functions**: `withCliResources`, resource factories,
   `CliResources`, `IngestCliResources`, cleanup types
2. **Update CLI README**: Document the resource management pattern so
   future commands follow it
3. **ADR consideration**: If the pattern is significant enough, document
   as an ADR (resource lifecycle management in CLI tools)

---

## Testing Strategy

### Unit Tests (Pure Functions)

- `resolveBulkDir` — CWD path exists, app-relative fallback, both miss,
  empty dir, absolute path passthrough. All return `Result`, never throw.
  These are pure functions with injected FS checks (no real filesystem).
- `withCliResources` — cleanup on success, cleanup on error Result,
  cleanup on thrown error, logger called on error, exitCode set on error.
  Uses injected fake resources with `vi.fn()` cleanup functions.
- `validateIngestEnv` — missing OAK_API_KEY returns err, present returns ok.
- Resource factories — correct resources created, cleanup closes all
  resources, cleanup errors are caught and logged (not thrown).

### Integration Tests (Code Units Working Together)

- `registerStageCmd` with fake ES client and fake OakClient — cleanup
  called after error Result, cleanup called on success
- `registerVersionedIngestCmd` — same
- `resolveBulkDir` wired into `stage` handler — precondition failure
  prevents resource creation
- Resource factories with injectable ES client mock

### E2E Tests (Running System)

- `oaksearch admin stage --bulk-dir /nonexistent` exits within 5 seconds
  with code 1 and helpful error message
- `oaksearch admin stage --bulk-dir ./bulk-downloads` from repo root
  resolves correctly via app-relative fallback (or fails fast with hint)
- `oaksearch admin status` exits cleanly (no hang on success path either)

---

## Done When

### Functional

1. Every CLI command exits cleanly on success (no hang)
2. Every CLI command exits cleanly on error (no hang)
3. `admin stage --bulk-dir /nonexistent` fails fast with helpful message
   showing resolved path, CWD, and hint
4. `admin stage --bulk-dir ./bulk-downloads` from repo root resolves to
   `apps/oak-search-cli/bulk-downloads` via app-relative fallback
5. Ctrl+C during any command triggers graceful shutdown

### Structural

6. `withCliResources` pattern used by all resource-creating commands
7. Every error path logs through the structured logger AND `printError`
8. Cheap preconditions checked before expensive resource creation
9. No `finally`-less resource creation in any command handler
10. SIGINT/SIGTERM handlers registered at the composition root
11. All error-producing functions return `Result<T, E>` — no `throw` in
    the error handling path (path validation, env validation, resource
    creation)
12. Legacy `validateBulkDir` (throws) replaced with `resolveBulkDir`
    (returns Result)

### Quality

13. All quality gates pass
14. All mandatory reviewers invoked and findings addressed
15. TSDoc on all new public API surfaces
16. Unit tests for `resolveBulkDir` (CWD hit, app-relative fallback,
    both miss, empty dir)
17. Unit tests for `withCliResources` (cleanup on success, error, throw)
18. Integration tests for command handlers (cleanup called after error)
19. E2E test proves no-hang behaviour (process exits within 5 seconds)

---

## Key Files

| File | Role |
|------|------|
| `apps/oak-search-cli/bin/oaksearch.ts` | Composition root — gains `parseAsync` + `process.exit` + signal handlers |
| `apps/oak-search-cli/src/cli/shared/cli-resources.ts` | NEW — `withCliResources`, `CliResources`, resource factories |
| `apps/oak-search-cli/src/cli/shared/output.ts` | `printError` — unchanged but now always paired with logger |
| `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` | Gains `withCliResources` wrapping |
| `apps/oak-search-cli/src/cli/admin/admin-lifecycle-alias-commands.ts` | Gains `withCliResources` wrapping |
| `apps/oak-search-cli/src/cli/admin/admin-sdk-commands.ts` | Gains `withCliResources` wrapping |
| `apps/oak-search-cli/src/cli/admin/admin-count-command.ts` | Gains `withCliResources` wrapping |
| `apps/oak-search-cli/src/cli/search/index.ts` | Gains `withCliResources` wrapping |
| `apps/oak-search-cli/src/cli/observe/index.ts` | Gains `withCliResources` wrapping |
| `apps/oak-search-cli/src/cli/shared/create-cli-sdk.ts` | `createEsClient` unchanged; `createCliSdk` may gain cleanup return |
| `apps/oak-search-cli/src/cli/shared/resolve-bulk-dir.ts` | NEW — `resolveBulkDir` pure function returning `Result` |
| `apps/oak-search-cli/src/cli/shared/validate-ingest-env.ts` | NEW — `validateIngestEnv` returning `Result` |
| `apps/oak-search-cli/src/adapters/oak-adapter.ts` | OakClient `disconnect()` — called by cleanup |
| `apps/oak-search-cli/src/lib/logger.ts` | `disableFileSink()` — called by cleanup |
| `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest-cli-validators.ts` | `validateBulkDir` DELETED — replaced by `resolveBulkDir` |

---

## References

### Foundation Documents

- `.agent/directives/principles.md` — fail fast, DRY, KISS
- `.agent/directives/testing-strategy.md` — TDD at all levels
- `.agent/directives/schema-first-execution.md` — types from schema

### ADRs

- [ADR-078](../../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md) — Dependency injection
- [ADR-130](../../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md) — Blue/green lifecycle

### Related Plans

- [Unified Versioned Ingestion](unified-versioned-ingestion.plan.md) — Phase 3 blocked by this
