# ADR-133: CLI Resource Lifecycle Management

## Status

Proposed

## Date

2026-03-10

## Context

The oak-search-cli has a systematic issue where every admin command can hang
indefinitely after an error. The root cause: open Elasticsearch TCP connections
keep the Node.js event loop alive, and no command handler closes them.

The pattern was: `createCliSdk(cliEnv)` creates an ES client internally,
returns the SDK, and the client handle is never exposed for cleanup. When
a handler throws or returns an error, the client remains open, preventing
`process.exit()` from being reached.

### Specific failure modes

1. **`program.parse()` returns before async handlers complete** — Commander's
   synchronous `parse()` does not await action handlers
2. **ES client handles are buried** — `createCliSdk` and
   `buildLifecycleServiceForIngest` create ES clients internally, never
   exposing them for cleanup
3. **No structured error logging** — `printError` writes to stderr but
   no structured log is emitted for observability
4. **No precondition checks before resource creation** — invalid `--bulk-dir`
   paths are only discovered after ES and Redis connections are opened

## Decision

### 1. Composition root: `parseAsync()` + `process.exit()`

Replace `program.parse()` with `await program.parseAsync()` followed by
`process.exit(process.exitCode ?? 0)`. This ensures all async handlers
complete before exit, and `process.exit()` terminates even if connections
remain open.

### 2. `withEsClient` wrapper

Introduce a concrete wrapper function that guarantees ES client cleanup:

```typescript
async function withEsClient(
  esClient: CloseableEsClient,
  handler: () => Promise<void>,
  deps: WithEsClientDeps,
): Promise<void>;
```

See `src/cli/shared/with-es-client.ts` for the full typed interface.

The caller creates the ES client; the wrapper guarantees cleanup in a
`finally` block. Unexpected throws are caught, logged structurally,
printed as human-readable errors, and signalled via `setExitCode(1)`.

### 3. Externally-owned resources

All resource creation happens outside the buried factories:

- **ES client**: Created via `createEsClient(cliEnv)` at the command level,
  passed to `withEsClient` for lifecycle management
- **OakClient**: Created inside the `withEsClient` handler, cleaned up in
  a local `finally` block with error-isolated disconnect
- **SDK**: Created via `createSearchSdk({ deps: { esClient }, config })` with
  the externally-owned client

### 4. Precondition checks before resource creation

`resolveBulkDir` and `validateIngestEnv` run BEFORE `createEsClient`,
so invalid inputs fail fast with helpful messages — no TCP connections
opened, no process hangs.

### 5. Structural logging on all error paths

Every `printError` call is paired with a structured logger call, ensuring
errors are captured in structured logs for observability.

## Consequences

### Positive

- CLI commands exit cleanly in all scenarios (success, error, precondition failure)
- No process hangs from orphaned TCP connections
- Structured logs capture all errors for debugging and observability
- Precondition failures give actionable messages without network roundtrips
- All dependencies are injected (ADR-078), making handlers testable with fakes

### Negative

- Each command handler has more boilerplate (explicit `createEsClient` +
  `withEsClient` instead of `createCliSdk`)
- `createCliSdk` is retained for backward compatibility with existing
  evaluation scripts in `evaluation/` (marked with deprecation TSDoc)

### Neutral

- The `withEsClient` pattern is similar to Go's `defer` or Python's `with`
  — a well-understood resource management idiom
- No runtime behaviour change for successful paths — only error and cleanup
  paths are affected

## Related

- ADR-078: Dependency injection for testability
- ADR-088: Result pattern for explicit error handling — precondition functions
  (`resolveBulkDir`, `validateIngestEnv`) use Result for expected failures;
  `withEsClient` catches unexpected throws as a safety net
- ADR-130: Blue/green index lifecycle
