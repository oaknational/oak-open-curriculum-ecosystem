# Plan: Search CLI Observability Adoption

## Context

Branch `feat/otel_sentry_enhancements` carries the production observability
foundation — a Milestone 2 blocker. The main merge is COMPLETE (commits
`da26c4bf`, `9e6ed327`, `f005a4ad`). The HTTP MCP server has full Sentry +
OTel observability. The Search CLI (`apps/oak-search-cli`) has **6 critical
gaps**: no Sentry init, no sinks, no env config, no command spans, no flush,
no error capture.

This plan closes all 6 gaps using TDD throughout, following the patterns
established in the HTTP server while keeping the module lighter (short-lived
CLI process, no MCP wrapping, no live OTel tracer).

---

## Implementation Steps

### Step 1 — Add `@oaknational/sentry-node` dependency

**File**: `apps/oak-search-cli/package.json`

Add `"@oaknational/sentry-node": "workspace:*"` to `dependencies`.
Run `pnpm install` to regenerate the lockfile.

---

### Step 2 — Extend env schema with `SentryEnvSchema` (TDD)

**Files**:
- `apps/oak-search-cli/src/env.ts` — add `.extend(SentryEnvSchema.shape)`
- `apps/oak-search-cli/src/lib/env.unit.test.ts` — add Sentry field tests

**Test first** (add to existing `describe('parseEnv', ...)`):
1. `'defaults SENTRY_MODE to off when not provided'` — call `parseEnv(withBaseEnv({}))`, assert `result.value.SENTRY_MODE === 'off'`
2. `'accepts SENTRY_MODE=fixture'` — assert `result.ok === true`
3. `'accepts SENTRY_MODE=sentry with DSN and release'` — pass `SENTRY_MODE: 'sentry'`, `SENTRY_DSN`, `SENTRY_RELEASE`, etc., assert ok
4. `'rejects invalid SENTRY_MODE'` — pass `'bogus'`, assert `result.ok === false`

**Implementation**: Import `SentryEnvSchema` from `@oaknational/env`. Add
`.extend(SentryEnvSchema.shape)` to `SearchCliBaseEnvSchema` between
`.extend(LoggingEnvSchema.shape)` and the CLI-specific `.extend({...})`.

No Vercel env vars needed in the Zod schema — the `sentry-node` config
builder resolves those internally from `process.env`.

---

### Step 3 — Create `CliObservability` module (TDD)

**New directory**: `apps/oak-search-cli/src/observability/`

#### 3a. Error type — `cli-observability-error.ts`

```typescript
export type CliObservabilityError = ObservabilityConfigError | InitialiseSentryError;
export function describeCliObservabilityError(error: CliObservabilityError): string;
```

Exhaustive switch on `error.kind`, matching the HTTP server's pattern at
`http-observability-error.ts`.

#### 3b. Core module — `cli-observability.ts`

**Interface**:
```typescript
export interface CliObservability {
  readonly service: string;
  readonly environment: string;
  readonly release: string;
  readonly sentrySink: LogSink | null;
  readonly fixtureStore?: FixtureSentryStore;
  withSpan<T>(options: CliSpanOptions<T>): Promise<T>;
  captureHandledError(error: unknown, context?: LogContextInput): void;
  flush(timeoutMs?: number): Promise<Result<void, SentryFlushError>>;
}

export interface CliSpanOptions<T> {
  readonly name: string;
  readonly attributes?: SpanAttributes;
  readonly run: () => Promise<T> | T;
}
```

**Factory**:
```typescript
export function createCliObservability(
  runtimeConfig: SearchCliRuntimeConfig,
  options?: CreateCliObservabilityOptions,
): Result<CliObservability, CliObservabilityError>;
```

Where `CreateCliObservabilityOptions` carries optional DI overrides:
`serviceName?`, `sentrySdk?`, `fixtureStore?`.

**Implementation flow**:
1. `createSentryConfig(runtimeConfig.env)` → Result
2. `initialiseSentry(config, { serviceName, sdk?, fixtureStore? })` → Result
3. Build the `CliObservability` object:
   - `sentrySink`: `createSentryLogSink(sentryRuntime)` (null in off mode)
   - `captureHandledError`: normalise error → delegate to `sentryRuntime.captureHandledError`
   - `flush`: delegate to `sentryRuntime.flush`
   - `withSpan`: delegate to `withActiveSpan` from `@oaknational/observability`
     with tracer undefined (synthetic context only — no live OTel tracer for the CLI)

No `postRedactionHooks` needed — the CLI has no HTTP requests with sensitive
query parameters. Default Sentry redaction from `@oaknational/sentry-node`
suffices.

#### 3c. Barrel — `index.ts`

Re-exports: `CliObservability`, `CliSpanOptions`, `CreateCliObservabilityOptions`
(types), `CliObservabilityError` (type), `createCliObservability` (function),
`describeCliObservabilityError` (function).

#### 3d. Tests — `cli-observability.unit.test.ts`

**Test first** using DI fakes (no `vi.mock`):

1. `'off mode: no SDK init, null sink, noop captureHandledError'`
   — Create runtime config with `SENTRY_MODE: 'off'`, inject fake SDK
   — Assert: `sdk.init` not called, `sentrySink` is null

2. `'fixture mode: non-null sink, captures to fixture store'`
   — Create runtime config with `SENTRY_MODE: 'fixture'`, inject `createFixtureSentryStore()`
   — Call `captureHandledError(new Error('test'))`
   — Assert: fixture store has one capture of kind `'exception'`

3. `'fixture mode: exposes sentrySink for logger integration'`
   — Assert: `sentrySink` is not null

4. `'sentry mode: SDK init called once, flush delegates to SDK'`
   — Inject fake SDK with `flush → true`
   — Assert: `sdk.init` called once, `flush()` delegates

5. `'returns Err when SENTRY_MODE is invalid'`
   — Assert: result is Err with kind `'invalid_sentry_mode'`

6. `'returns Err when SDK init throws'`
   — Inject fake SDK where `init` throws
   — Assert: result is Err with kind `'sentry_sdk_init_failed'`

7. `'withSpan runs callback and returns its value'`
   — Create in off mode, call `withSpan({ name: 'test', run: () => 42 })`
   — Assert: result is 42

8. `'flush resolves ok in off mode'`
   — Assert: `(await obs.flush()).ok === true`

**Fake SDK pattern** — same as HTTP server tests:
```typescript
interface FakeSentrySdk {
  readonly sdk: SentryNodeSdk;
  readonly init: MockInstance;
  readonly flush: MockInstance;
  // ...
}
```

---

### Step 4 — Wire Sentry sink into logger via `registerAdditionalSink` (TDD)

**File**: `apps/oak-search-cli/src/lib/logger.ts`

**Test first** — new file `apps/oak-search-cli/src/lib/logger.unit.test.ts`:

1. `'a registered sink receives log events'`
   — Create fake `LogSink` with `write: vi.fn()`
   — Call `registerAdditionalSink(fakeSink)`
   — Call `searchLogger.info('test')`
   — Assert: `fakeSink.write` called with event containing `'test'`
   — Cleanup: `clearAdditionalSinks()`

2. `'clearAdditionalSinks removes all sinks'`
   — Register fake sink, clear, log, assert fake NOT called

3. `'multiple sinks all receive events'`
   — Register two fakes, log, assert both called

4. `'registerAdditionalSink invalidates cache'`
   — Register sink A, log (populates cache), register sink B, log again
   — Assert: sink B received the second event

**Implementation**:

Add module-level state:
```typescript
let additionalSinks: readonly LogSink[] = [];
```

Add two exported functions:
```typescript
export function registerAdditionalSink(sink: LogSink): void {
  additionalSinks = [...additionalSinks, sink];
  loggerCache = null;
}

export function clearAdditionalSinks(): void {
  if (additionalSinks.length > 0) {
    additionalSinks = [];
    loggerCache = null;
  }
}
```

Update `getLoggers()` sinks array:
```typescript
const sinks = activeFileSink
  ? [createNodeStdoutSink(), activeFileSink, ...additionalSinks]
  : [createNodeStdoutSink(), ...additionalSinks];
```

Import `type LogSink` from `@oaknational/logger`.

---

### Step 5 — Wire observability into entry point

**File**: `apps/oak-search-cli/bin/oaksearch.ts`

**Changes**:

1. Import `loadRuntimeConfig` from `../src/runtime-config.js`
2. Import `registerAdditionalSink`, `clearAdditionalSinks` from `../src/lib/logger.js`
3. Import `createCliObservability`, `describeCliObservabilityError` from `../src/observability/index.js`
4. Import `type CliObservability` from `../src/observability/index.js`

**Eager init** (before command registration):
```typescript
let cliObservability: CliObservability | undefined;

const configResult = loadRuntimeConfig(loadOptions);
if (configResult.ok) {
  const obsResult = createCliObservability(configResult.value);
  if (obsResult.ok) {
    cliObservability = obsResult.value;
    if (cliObservability.sentrySink) {
      registerAdditionalSink(cliObservability.sentrySink);
    }
  } else {
    process.stderr.write(
      `Warning: observability init failed (${describeCliObservabilityError(obsResult.error)}), continuing without Sentry\n`,
    );
  }
}
```

If `configResult` fails, commands will fail with the same error via
`withLoadedCliEnv`, but `--help` and `--version` still work. The env loader
caches, so no double-load.

**Thread observability to command factories**:
```typescript
program.addCommand(searchCommand(cliEnvLoader, cliObservability));
program.addCommand(adminCommand(cliEnvLoader, cliObservability));
program.addCommand(evalCommand(cliEnvLoader, cliObservability));
program.addCommand(observeCommand(cliEnvLoader, cliObservability));
```

**Flush in finally block** (order matters):
```typescript
try {
  await program.parseAsync();
} finally {
  if (cliObservability) {
    const flushResult = await cliObservability.flush();
    if (!flushResult.ok) {
      process.stderr.write(`Warning: Sentry flush failed\n`);
    }
  }
  const sinkResult = disableFileSink();
  if (!sinkResult.ok) {
    process.stderr.write(`Warning: ${sinkResult.error.message}\n`);
  }
  clearAdditionalSinks();
  process.exit(process.exitCode ?? 0);
}
```

---

### Step 6 — Add command-level spans via `withLoadedCliEnv`

**File**: `apps/oak-search-cli/src/cli/shared/with-loaded-cli-env.ts`

**Test first** — new file `apps/oak-search-cli/src/cli/shared/with-loaded-cli-env.unit.test.ts`:

1. `'wraps action in span when observability is provided'`
   — Fake observability with `withSpan` that records the span name
   — Assert: called with name starting `'oak.cli.command'`

2. `'runs action directly when observability is undefined'`
   — Omit observability, assert action still runs

3. `'action errors propagate through span'`
   — Make action throw, assert error propagates

**Implementation**: Add optional `observability` parameter:
```typescript
export function withLoadedCliEnv<TArgs extends readonly unknown[]>(
  cliEnvLoader: SearchCliEnvLoader,
  action: (cliEnv: SearchCliEnv, ...args: TArgs) => Promise<void> | void,
  observability?: CliObservability,
): (...args: TArgs) => Promise<void> {
  return async (...args: TArgs): Promise<void> => {
    const envResult = cliEnvLoader.load();
    if (!envResult.ok) {
      printConfigError(envResult.error);
      process.exitCode = 1;
      return;
    }
    const runAction = async () => { await action(envResult.value, ...args); };
    if (observability) {
      await observability.withSpan({ name: 'oak.cli.command', run: runAction });
    } else {
      await runAction();
    }
  };
}
```

**Update command factories** to accept and thread `observability?`:
- `src/cli/search/index.ts` — `searchCommand(loader, observability?)`
- `src/cli/admin/index.ts` — `adminCommand(loader, observability?)`
- `src/cli/eval/index.ts` — `evalCommand(loader, observability?)`
- `src/cli/observe/index.ts` — `observeCommand(loader, observability?)`

Each factory passes `observability` as the third arg to `withLoadedCliEnv`.

---

### Step 7 — Add `captureHandledError` to command error paths

**File**: `apps/oak-search-cli/src/cli/shared/with-es-client.ts`

**Test first** — add to existing `with-es-client.integration.test.ts`:

1. `'calls captureHandledError when handler throws and capture is provided'`
   — Inject `captureHandledError: vi.fn()` into deps
   — Throw from handler
   — Assert: called with the error and `{ boundary: 'cli_command_error' }`

2. `'does not throw when captureHandledError is undefined'`
   — Omit from deps, throw from handler, assert no additional error

**Implementation**: Add optional field to `WithEsClientDeps`:
```typescript
readonly captureHandledError?: (error: unknown, context?: LogContextInput) => void;
```

Update catch block:
```typescript
} catch (error: unknown) {
  deps.logger.error('Command failed', normalizeError(error));
  deps.printError(error instanceof Error ? error.message : String(error));
  deps.captureHandledError?.(error, { boundary: 'cli_command_error' });
  deps.setExitCode(1);
}
```

**Wire into deps objects**: Each command group's deps factory gains an
optional `observability?.captureHandledError` field. Only done where
observability is threaded through. All existing call sites continue to work
(field is optional).

---

### Step 8 — Update `.env.example`

**File**: `apps/oak-search-cli/.env.example`

Remove `"not yet wired — pending Search CLI adoption"` from the Sentry
section. Add optional fields matching the HTTP server pattern:
```
# SENTRY_ENVIRONMENT=production
# SENTRY_ENABLE_LOGS=true
# SENTRY_DEBUG=false
```

---

### Step 9 — Quality gates

```bash
pnpm --filter @oaknational/search-cli type-check
pnpm --filter @oaknational/search-cli lint:fix
pnpm --filter @oaknational/search-cli test
pnpm check   # full monorepo gate
```

---

### Step 10 — Reviewer sweep

Invoke these specialist reviewers after implementation:

| Reviewer | Focus | Why |
|----------|-------|-----|
| `code-reviewer` | Gateway — overall quality | Always first |
| `sentry-reviewer` | Sentry config, init, sink, flush, capture patterns | Core observability domain |
| `test-reviewer` | TDD compliance, DI patterns, no `vi.mock` | New test files |
| `architecture-reviewer-fred` | Boundary compliance, dependency direction | New package dependency |
| `security-reviewer` | Redaction, DSN handling, no PII leaks | Sentry touches secrets/telemetry |
| `architecture-reviewer-betty` | Cohesion of CLI vs HTTP observability | Shared patterns, different lifecycle |

Act on all findings before considering the work complete.

---

## Critical Files

### Modified
- `apps/oak-search-cli/package.json` — add sentry-node dependency
- `apps/oak-search-cli/src/env.ts` — extend with SentryEnvSchema
- `apps/oak-search-cli/src/lib/logger.ts` — registerAdditionalSink + clearAdditionalSinks
- `apps/oak-search-cli/bin/oaksearch.ts` — observability init + flush
- `apps/oak-search-cli/src/cli/shared/with-loaded-cli-env.ts` — optional span wrapping
- `apps/oak-search-cli/src/cli/shared/with-es-client.ts` — captureHandledError in deps
- `apps/oak-search-cli/src/cli/search/index.ts` — accept observability param
- `apps/oak-search-cli/src/cli/admin/index.ts` — accept observability param
- `apps/oak-search-cli/src/cli/eval/index.ts` — accept observability param
- `apps/oak-search-cli/src/cli/observe/index.ts` — accept observability param
- `apps/oak-search-cli/.env.example` — update Sentry section
- `apps/oak-search-cli/src/lib/env.unit.test.ts` — add Sentry env tests

### New
- `apps/oak-search-cli/src/observability/cli-observability.ts`
- `apps/oak-search-cli/src/observability/cli-observability-error.ts`
- `apps/oak-search-cli/src/observability/index.ts`
- `apps/oak-search-cli/src/observability/cli-observability.unit.test.ts`
- `apps/oak-search-cli/src/lib/logger.unit.test.ts`
- `apps/oak-search-cli/src/cli/shared/with-loaded-cli-env.unit.test.ts`

### Reference (read-only)
- `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts`
- `packages/libs/sentry-node/src/` — all files (public API reference)
- `packages/core/observability/src/` — withActiveSpan, span context

### Reused functions (not reimplemented)
- `createSentryConfig` from `@oaknational/sentry-node`
- `initialiseSentry` from `@oaknational/sentry-node`
- `createSentryLogSink` from `@oaknational/sentry-node`
- `createFixtureSentryStore` from `@oaknational/sentry-node`
- `withActiveSpan` from `@oaknational/observability`
- `normalizeError` from `@oaknational/logger/node`

---

## Key Design Decisions

1. **`sentrySink` as a property, not a `createLogger` method** — The CLI's
   logger uses module-level lazy proxies. Rather than redesigning it to use a
   factory pattern, we expose the sink and let the composition root inject it
   via `registerAdditionalSink`. Minimal change, same outcome.

2. **No `withSpanSync`** — All CLI commands are async. No use case for
   synchronous spans.

3. **No `postRedactionHooks`** — The CLI has no HTTP requests with sensitive
   query parameters. Default Sentry redaction suffices.

4. **Observability failure is non-fatal** — If `createCliObservability`
   returns `Err`, log a warning and continue. `SENTRY_MODE=off` (default)
   works without any Sentry env vars.

5. **Synthetic spans only** — No live OTel tracer for the CLI. `withActiveSpan`
   with `tracer: undefined` runs the callback unchanged. Future enhancement
   possible but YAGNI now.

6. **`captureHandledError` only in `withEsClient` catch** — Domain errors
   (`Result.err`) in individual handlers are expected failures, not Sentry
   captures. Only unexpected throws at the ES client boundary are captured.

---

## Verification

1. `pnpm check` passes (full monorepo gate)
2. All 6 reviewer findings acted upon
3. `SENTRY_MODE=off`: no Sentry init, null sink, no outbound delivery
4. `SENTRY_MODE=fixture`: fixture store populated by captures and logs
5. Flush completes before `process.exit` in all exit paths
6. Existing CLI behaviour unchanged when `SENTRY_MODE=off`
7. TDD evidence: each test file written before its product code

---

## Post-Adoption (Owner Actions — not this session)

1. **Sentry credential provisioning** — owner configures real DSN in
   `.env.local` and Vercel per `docs/operations/sentry-deployment-runbook.md`
2. **Deployment evidence bundle** — verify release/source maps, alerting
   baseline (depends on real credentials)
