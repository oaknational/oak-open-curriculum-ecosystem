---
name: "Sentry Canonical Alignment"
overview: >
  Close the gaps between Oak's custom Sentry integration layer and the
  canonical Sentry Node.js/Express setup. The existing foundation
  (ADR-143, @oaknational/sentry-node adapter) prioritised DI testability
  and redaction safety but deferred several canonical Sentry capabilities.
  This plan addresses 6 specific deviations identified by gap analysis,
  ordered by impact. Each item preserves the DI/testability/redaction
  invariants while adopting idiomatic Sentry patterns.
parent_plan: "sentry-otel-integration.execution.plan.md"
source_analysis: "Sentry reviewer gap analysis (2026-04-12)"
todos:
  # === COMPLETED (2026-04-13, commit c8b66648) ===
  - id: cli-log-level-di
    content: "Wire runtimeConfig.logLevel into search-cli logger.ts via DI per ADR-078"
    status: done
    priority: next
    note: "Implemented 2026-04-13. configureLogLevel(LogLevel) with cache invalidation. Type-tightened from string to LogLevel per code-reviewer. Controlled ADR-078 violation tracked as cli-logger-di-audit."
  - id: cli-shutdown-ordering
    content: "Reorder CLI shutdown: clearAdditionalSinks before disableFileSink in oaksearch.ts finally block"
    status: done
    priority: next
    note: "Implemented 2026-04-13. clearAdditionalSinks now precedes disableFileSink. Sentry-reviewer confirmed ordering correct."
  - id: early-init-http
    content: "Spike preload locally, then add --import @sentry/node/preload to HTTP server start script and dev runner"
    status: done
    priority: next
    note: "Implemented 2026-04-13. Spike confirmed: Node 24 + tsup ESM + tsx all work. @sentry/node promoted to direct dependency. Both start script and dev runner updated."
  - id: express-error-handler
    content: "Adopt Sentry.setupExpressErrorHandler BEFORE createEnrichedErrorLogger"
    status: done
    priority: next
    note: "Implemented 2026-04-13. DI seam on CreateAppOptions (per Barney). Error handlers moved to setupPostAuthPhases (after routes). Extracted to bootstrap-error-handlers.ts. 6 in-memory integration tests. 5-reviewer pre-implementation review."
  - id: adapter-surface-extension
    content: "Add setUser, setTag, setContext, close to SentryNodeRuntime and SentryNodeSdk"
    status: done
    priority: next
    note: "Implemented 2026-04-13. All three modes (off/fixture/live). SentryUser, SentryContextPayload, SentryCloseError types. 9 unit tests. flushSdk/closeSdk extracted as helpers."
  - id: cli-close-instead-of-flush
    content: "Use Sentry.close() instead of flush() for CLI shutdown"
    status: done
    priority: next
    note: "Implemented 2026-04-13. close() on CliObservability delegates to sentryRuntime.close(). Sentry-reviewer confirmed correct for short-lived processes."
  - id: cli-logger-di-audit
    content: "Audit direct-import logger singletons (searchLogger etc.) against ADR-078 — track as known violation, plan remediation"
    status: done
    priority: next
    note: "Investigated 2026-04-13. 15 files import logger singletons directly. Remediation: createSearchLogger(config) factory at composition root (matches HTTP server pattern). ~15-file refactor, scoped to search CLI."
  # === AFTER ADAPTER EXTENSION (still local) ===
  - id: cli-context-enrichment
    content: "Add command-level context enrichment to CLI via setTag/setContext"
    status: pending
    note: "Depends on adapter-surface-extension. Tag with command name, index target, version."
  - id: custom-metrics
    content: "Expose Sentry.metrics (count, gauge, distribution) on the adapter with beforeSendMetric hook"
    status: pending
    note: "Via adapter (sentry reviewer: DI seam needed). enableMetrics defaults true, no init change. Wire beforeSendMetric into redaction layer."
  - id: cli-metrics
    content: "Wire CLI command execution metrics via Sentry.metrics.count"
    status: pending
    note: "Depends on custom-metrics (shared adapter). Emit command name, index target as attributes."
  - id: cli-early-init
    content: "Add --import @sentry/node/preload to CLI tsx invocations"
    status: pending
    note: "Same preload pattern as HTTP server. Lower priority — no central dev runner, requires individual script edits."
  # === NEEDS CREDENTIALS OR EXTERNAL (defer until Vercel provisioned) ===
  - id: trace-propagation-es
    content: "Add Elasticsearch host to tracePropagationTargets (low-ceremony, Oak-controlled)"
    status: pending
    note: "ES is our own instance. No formal security review needed. Can implement locally but verify with live traces."
  - id: trace-propagation-oak-api
    content: "Evaluate trace propagation to Oak API (third-party, security review required)"
    status: pending
    note: "open-api.thenational.academy is third-party. Security reviewer must sign off."
  - id: profiling-evaluation
    content: "Evaluate @sentry/profiling-node for the HTTP server before production release"
    status: pending
    note: "Evaluate with local or preview load. ~5% CPU overhead. Native addon — verify Vercel ABI. Ship or reject before release."
  - id: source-maps-automation
    content: "Automate source map upload before production release — investigate Debug IDs vs release-based matching"
    status: pending
    note: "Must be working BEFORE first production errors arrive. Sentry Debug IDs (build-injected) or Vercel integration."
---

# Sentry Canonical Alignment

## Role

This plan closes the gaps between Oak's Sentry integration and canonical
Sentry Node.js/Express practices. It is a child of the parent execution
plan (`sentry-otel-integration.execution.plan.md`) and inherits its
redaction, DI, and safety invariants.

## Motivation

A gap analysis (2026-04-12) compared the Sentry Express onboarding
wizard's canonical setup against the Oak `@oaknational/sentry-node`
integration layer. The analysis found 6 deviations, of which 1 is
high-severity (early init), 2 are medium (Express error handler, adapter
surface), and 3 are low (trace propagation, profiling, source maps).

The existing integration was designed around three priorities:

1. **DI testability** — injectable SDK, fixture mode, no global state
2. **Redaction safety** — `beforeSend`/`beforeBreadcrumb`/`beforeSendLog`
   hooks with deny-by-default MCP payload capture
3. **Non-fatal init** — Result pattern, `SENTRY_MODE=off` kill switch

These priorities are correct and must be preserved. The gaps are about
capabilities that were deferred, not about the architecture being wrong.

## Relationship to Parent Plan

**This plan does not block the parent plan.** The parent execution
plan's remaining items (Vercel credential provisioning and deployment
evidence bundle) can proceed independently. This child plan is
enhancement work that improves the quality of the observability
foundation, not a prerequisite for closing the parent.

## Hard Invariants

- ADR-078: DI everywhere — the adapter boundary must remain injectable
  and testable with simple fakes
- ADR-143: observability architecture — redaction barrier, fan-out model
- `SENTRY_MODE=off` remains the default and kill switch
- `sendDefaultPii: false` remains hardcoded — no override path
- `tracePropagationTargets` remains deny-by-default; any additions must
  be explicit, limited to Oak-controlled hosts, and security-reviewed
- No `vi.mock`, no `process.env` mutation in tests

---

## Gap 1 — Early SDK Init (HIGH, preventative) — SIMPLIFIED via `@sentry/node/preload`

### Problem

`Sentry.init()` is called inside `createHttpObservability()` at
`apps/oak-curriculum-mcp-streamable-http/src/index.ts:24`, **after**
`node:http` is imported at line 1 and Express is loaded via transitive
imports. The Sentry SDK monkey-patches `http.request`, Express route
handlers, and other modules at init time. Modules already loaded are
not retroactively patched. This means:

- No automatic transaction creation for Express routes
- No automatic spans for outbound HTTP calls (Elasticsearch, Oak API)
- No automatic breadcrumbs for HTTP activity
- The manual spans we create are the **only** spans

### Fix — `@sentry/node/preload` (canonical late-init pattern)

The official Sentry docs describe a **preload hook** designed exactly
for our situation: "you can't run init early because you need to
resolve config first."

```bash
node --import @sentry/node/preload dist/index.js
```

This **preloads module wrapping** (http, Express, etc.) via
`import-in-the-middle` WITHOUT calling `Sentry.init()`. Our existing
`createHttpObservability()` calls `Sentry.init()` at its normal time,
and the pre-wrapped modules automatically start emitting spans.

**Source**: Sentry official docs —
`platforms/javascript/guides/express/install/late-initialization.md`

**This eliminates all prior complexity concerns**:

- No custom `instrument.ts` file needed
- No `resolveSentryEnv()` extraction needed
- No double-init problem (preload never calls init)
- No `sentryInitState` flag or init-detection mechanism
- No changes to `@oaknational/sentry-node` adapter
- Our DI pipeline is completely unchanged

**SENTRY_MODE=off safety** (sentry reviewer verified): the docs state
"the modules are wrapped, but will not do anything — nothing will be
emitted or captured." If `Sentry.init()` is never called (our off-mode
path), the wrapped modules remain inert. No data emitted, no network
calls.

**Overhead when off**: minimal — loader hook registration and thin
proxy wrappers on http/Express. No network I/O, no buffering, no
spans. Low single-digit milliseconds at startup.

**Selective preloading**: `SENTRY_PRELOAD_INTEGRATIONS=Http,Express`
limits which modules are wrapped. NodeFetch always instruments. For
Oak, `Http,Express` is a reasonable starting point.

**Severity framing** (assumptions reviewer): this is preventative
quality, not a defect fix. No incidents have been reported from
missing auto-instrumentation. However, the system hasn't been in
production yet, and auto-instrumentation is the foundation that makes
Gap 2's error grouping and Gap 4's distributed tracing useful. Kept
as first priority because it's a one-line change with broad impact.

**Scope**: Both apps. The `--import` flag works with both `node` (HTTP
server) and `tsx` (CLI dev scripts).

### First action: spike

Before committing to this approach, run a 2-minute local spike
(assumptions reviewer): start the HTTP server with
`node --import @sentry/node/preload dist/index.js` and verify that
(a) the process starts, (b) no `import-in-the-middle` errors appear,
(c) Express route middleware shows in the OTel trace output. This
converts assumption to fact.

### Acceptance criteria

- Local spike confirms preload + tsup ESM + Node 24 works
- `--import @sentry/node/preload` in production start script and dev
  runner
- Auto-generated Express route transactions appear in Sentry
- Outbound HTTP spans to Elasticsearch appear as children of the
  request transaction
- Existing DI test patterns still work (injectable SDK, fixture mode)
- `SENTRY_MODE=off` still prevents any SDK init (verified: preload
  is inert without init)

### Files

- Modified: `apps/oak-curriculum-mcp-streamable-http/package.json`
  — `start` becomes `node --import @sentry/node/preload dist/index.js`
- Modified: `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts`
  — prepend `['--import', '@sentry/node/preload']` to server args
- Optionally: `SENTRY_PRELOAD_INTEGRATIONS=Http,Express` in env
- No changes to `@oaknational/sentry-node` adapter

---

## Gap 2 — Express Error Handler (MEDIUM) — can parallel Gap 1

**Note** (Barney): Gap 2 does not strictly depend on Gap 1.
`setupExpressErrorHandler` captures request context regardless of
whether auto-instrumentation is active. Better together (route
transactions improve error grouping), but independently useful.

### Problem

`createEnrichedErrorLogger` is a custom Express error middleware that
calls `observability.captureHandledError(err, logContext)`. It passes
method, path, correlationId, and duration — but not Sentry-native
request context (headers, route params, query string, transaction name,
HTTP status). This means:

- Error events in Sentry lack the structured request context that
  powers Issues page filters (filter by URL, by transaction)
- Transaction names are absent, so errors appear ungrouped
- The Sentry error handler also sets HTTP status on the event scope

### Fix

Call `Sentry.setupExpressErrorHandler(app)` in addition to (not instead
of) `createEnrichedErrorLogger`. **Ordering** (corrected by sentry
reviewer — Sentry docs require their handler BEFORE other error
middleware):

1. `Sentry.setupExpressErrorHandler(app)` — Sentry-native request
   context enrichment (registered first per official docs)
2. `createEnrichedErrorLogger` — our structured logging + correlation

**Sentry reviewer correction**: Wilma assumed `setupExpressErrorHandler`
is a terminal handler that does not call `next()`. The sentry reviewer
checked the official docs — the handler is designed to capture the
error and pass control onward. Our `createEnrichedErrorLogger` runs
after it and can still log and set correlation headers.

The existing `beforeSend` redaction hook fires on all events regardless
of how they're captured, so the redaction boundary is preserved.

### Design consideration

`setupExpressErrorHandler` is a function on the `@sentry/node` module,
not on our `SentryNodeSdk` adapter interface.

Option 3 is the recommended approach (Fred: "architecturally correct").
The adapter handles SDK lifecycle; Express-specific wiring belongs in
the app's bootstrap.

**Testing seam** (Betty finding, accepted trade-off):
`setupExpressErrorHandler` is imported directly from `@sentry/node`,
not via the adapter. It has no DI test seam. Tests that verify error
handler registration order will need the real SDK or an integration
test. This is an accepted trade-off — document it, don't try to fake
it.

**Express 5 compatibility** (assumptions reviewer concern, resolved):
`@opentelemetry/instrumentation-express@0.62.0` explicitly supports
`express >=4.0.0 <6`. `setupExpressErrorHandler` uses the standard
Express error middleware signature `(err, req, res, next)` which is
unchanged in Express 5. Add an integration test to confirm.

### Acceptance criteria

- `Sentry.setupExpressErrorHandler(app)` is called in the app bootstrap
  BEFORE `createEnrichedErrorLogger` (per official Sentry docs)
- Error events in Sentry include request URL, method, route, and status
- Existing `createEnrichedErrorLogger` behaviour unchanged
- Redaction hooks still fire on error events
- Registration ordering documented in code comments
- Registration wrapped in try-catch in bootstrap (Wilma: if it throws
  during registration, the app must still start)
- Integration test verifying Express 5 error handler compatibility

### Files

- Modified: `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts`
- Integration test: verify error handler registration and ordering

---

## Gap 3 — Adapter Surface Extension (MEDIUM)

### Problem

The `SentryNodeSdk` interface exposes only `init`, `captureException`,
`captureMessage`, `flush`, and `logger`. It does not expose `setUser`,
`setContext`, `setTag`, or `addBreadcrumb`. This means:

- No per-request user enrichment (who hit this error?)
- No contextual tags for error triage (which tenant? which MCP tool?)
- Combined with `sendDefaultPii: false`, user-impact analysis is
  completely unavailable

### Fix — SIMPLIFIED after sentry reviewer correction

**Architecture reviewer concern (Betty)**: Ambient `setUser()` /
`setTag()` calls mutate global Sentry scope, risking cross-request
leakage in concurrent Express.

**Sentry reviewer correction**: This concern is **not valid** for
`@sentry/node` v8+. The SDK automatically forks an **isolation scope**
per Express request. `Sentry.setUser()`, `Sentry.setTag()`, and
`Sentry.setContext()` write to the currently active isolation scope,
not the global scope. The official docs explicitly give per-request
user data as an example of isolation-scope-appropriate use.

**Resolution**: Use direct `setUser`/`setTag`/`setContext` on the
`SentryNodeRuntime`. No `withScope` wrapper needed — the SDK handles
request isolation. This is the simplest correct approach.

```typescript
/** Narrow user type — no email, no IP, no PII. */
export interface SentryUser {
  readonly id: string;
  readonly username?: string;
}

/** Named context payload — narrow, not Record<string, unknown>. */
export interface SentryContextPayload {
  readonly [key: string]: string | number | boolean | undefined;
}

export interface SentryNodeRuntime {
  // ... existing fields ...
  setUser(user: SentryUser | null): void;
  setTag(key: string, value: string): void;
  setContext(name: string, context: SentryContextPayload | null): void;
}
```

**Two-layer extension** (Fred finding): The `SentryNodeSdk` injectable
interface also needs these methods so tests can inject fakes:

```typescript
export interface SentryNodeSdk {
  // ... existing methods ...
  setUser(user: SentryUser | null): void;
  setTag(key: string, value: string): void;
  setContext(name: string, context: SentryContextPayload | null): void;
}
```

In off mode, these are noops. In fixture mode, they record to the
fixture store. In sentry mode, they delegate to `Sentry.setUser()` etc.

**PII validation** (Wilma finding): The narrow `SentryUser` type is
the primary guard (id + optional username only). Validation happens in
the adapter — the type system rejects email, IP, etc. at compile time.

**Null user propagation** (Wilma finding): `setUser(null)` clears user
context for the current isolation scope. In off mode this is a noop.
In fixture mode it records a null-user event. Because isolation scopes
are per-request, null propagation cannot affect other requests.

**Call-before-init race** (Wilma finding): Not possible. Auth
middleware receives `observability` via DI from the app factory. The
Express server only starts listening after `startConfiguredHttpServer`
completes, which happens after `createHttpObservability`. No race.

### Acceptance criteria

- `SentryNodeRuntime` exposes `setUser`, `setTag`, `setContext`
- `SentryNodeSdk` exposes the same methods for DI testability
- HTTP server sets user ID from Clerk auth context on each request
- Off/fixture modes are noop/fixture-captured
- No PII is included (no email, no IP — only Clerk user ID)
- All types are narrow and named (no `Record<string, unknown>`)
- Redaction hooks still apply to all events

### Files

- Modified: `packages/libs/sentry-node/src/types.ts`
- Modified: `packages/libs/sentry-node/src/runtime.ts`
- Modified: `packages/libs/sentry-node/src/runtime-sdk.ts`
- Modified: `apps/oak-curriculum-mcp-streamable-http/src/auth/`
  (enrich scope after auth)

---

## Gap 3.5 — Custom Metrics (MEDIUM)

### Problem

The `SentryNodeSdk` adapter does not expose `Sentry.metrics`. The
Sentry onboarding wizard includes `Sentry.metrics.count('test_counter', 1)`
as a standard verification step. Custom metrics (`count`, `gauge`,
`distribution`) are available in `@sentry/node` v10.25.0+ (our SDK is
`^10.47.0`) and require no special init options.

Without metrics, we have no way to track operational counters and
distributions in Sentry:

- Request counts per MCP tool
- Elasticsearch query latency distributions
- CLI command execution counts
- Cache hit/miss ratios
- Zero-hit query rates

### Fix

Expose `Sentry.metrics` on the `SentryNodeSdk` and `SentryNodeRuntime`
interfaces. Three metric types are available (v10.25.0+):

```typescript
export interface SentryMetrics {
  count(name: string, value?: number, attributes?: MetricAttributes): void;
  gauge(name: string, value: number, attributes?: MetricAttributes): void;
  distribution(name: string, value: number, attributes?: MetricAttributes): void;
}

export interface MetricAttributes {
  readonly [key: string]: string | number | boolean | undefined;
}
```

Note: there is no `set` type — it was removed in the v8→v9 migration.

In off mode, metrics are noops.
In fixture mode, metrics record to the fixture store.
In sentry mode, metrics delegate to `Sentry.metrics.*`.

**Why via adapter, not direct import** (Barney suggested bypassing
adapter; sentry reviewer overruled): direct `import * as Sentry`
at the app layer would require `vi.mock` in tests — violates ADR-078.
The DI seam provides off-mode noop and fixture capture.

**`enableMetrics`** (sentry reviewer): defaults to `true` in the SDK,
no init-option change needed. No `SENTRY_ENABLE_METRICS` env var
required — the kill switch is `SENTRY_MODE=off`.

**`beforeSendMetric`** (sentry reviewer): should be wired into the
redaction hook layer in `createSentryHooks` for consistency with
`beforeSend`, `beforeSendLog`, `beforeSendSpan`, etc. Metrics
attributes could contain sensitive values.

**No dependency on early init** — metrics work with standard
`Sentry.init()`, so this can be implemented independently of Gap 1.

**Depends on Gap 3** (adapter surface extension) — the metrics
interface follows the same two-layer extension pattern
(SDK interface + runtime interface).

### Acceptance criteria

- `SentryNodeRuntime` exposes `metrics` property with `count`,
  `gauge`, `distribution`
- `SentryNodeSdk` exposes the same for DI testability
- `beforeSendMetric` wired into `createSentryHooks` redaction layer
- HTTP server emits at least: tool invocation count, request latency
  distribution
- CLI emits at least: command execution count
- Off/fixture modes are noop/fixture-captured
- `MetricAttributes` uses narrow named type (not `Record<string, unknown>`)

### Files

- Modified: `packages/libs/sentry-node/src/types.ts`
- Modified: `packages/libs/sentry-node/src/runtime.ts`
- Modified: `packages/libs/sentry-node/src/runtime-sdk.ts`
- Modified: `apps/oak-curriculum-mcp-streamable-http/src/observability/`
  (emit tool metrics)
- Modified: `apps/oak-search-cli/src/observability/` (emit command
  metrics)

---

## Gap 4 — Trace Propagation Targets (MEDIUM, DELIBERATE)

### Problem

`tracePropagationTargets` is an empty array. **Sentry reviewer
clarification**: this is an **active opt-out**, not a neutral default.
The `@sentry/node` SDK default is to propagate trace context to ALL
outbound requests. Our `[]` overrides this to propagate to none.

This was a **deliberate** policy decision documented in the parent
execution plan. Outbound HTTP calls to Elasticsearch and the Oak API
do not carry `sentry-trace` or `baggage` headers, so distributed
traces break at the Oak server boundary.

### Fix — split into two targets (assumptions reviewer)

**4a. Elasticsearch (low-ceremony, Oak-controlled)**

ES Serverless (`*.elastic.cloud`) is our own instance. Adding it to
`tracePropagationTargets` enables distributed traces from MCP server
→ Elasticsearch queries. No formal security review needed — this is
Oak infrastructure. Trace IDs leaking to our own ES instance has no
blast radius.

**4b. Oak API (security review required)**

`open-api.thenational.academy` is third-party from our perspective.
Trace propagation headers would leak trace IDs to Oak's API
infrastructure. The security reviewer must assess:

1. Does the Oak API accept/log trace headers? (If not, propagation is
   pointless overhead)
2. What is the blast radius if trace IDs leak? (Medium — third-party
   could correlate our request patterns)
3. Does the Oak API support W3C `traceparent` or Sentry-proprietary
   `sentry-trace`?

### Acceptance criteria

- 4a: ES host added to `tracePropagationTargets`, distributed trace
  continuity verified in Sentry
- 4b: security review completed and documented
- If 4b approved: add Oak API host, verify traces
- If 4b denied: document rationale and close as "accepted"

### Files

- Modified: `packages/libs/sentry-node/src/runtime-sdk.ts` (or config)
- May need: per-app `tracePropagationTargets` config in env schema

---

## Gap 5 — Profiling (LOW)

### Problem

No `@sentry/profiling-node` integration. No CPU flame graphs in Sentry.

### Fix

Evaluate with local or preview deployment load before production
release. Profiling adds ~5% CPU overhead and a native Node.js addon
dependency. The decision to ship or reject profiling should be made
before release, not after — the first production performance issues
are the ones most worth profiling.

### Acceptance criteria

- Benchmark with and without profiling under simulated MCP load
- If overhead is acceptable: add `nodeProfilingIntegration()` to init
  options, gated behind an env flag
- If overhead is too high: document and close as "deferred"

### Files (config reviewer detail)

- Modified: `packages/libs/sentry-node/src/runtime-sdk.ts`
  (`createSentryInitOptions`)
- Modified: `packages/core/env/src/schemas/sentry.ts` — add
  `SENTRY_ENABLE_PROFILING: SENTRY_BOOLEAN_FLAGS.optional()`
- New dep: `@sentry/profiling-node` in HTTP server `dependencies`
  (native addon — Vercel ABI compatibility to be verified)

---

## Gap 6 — Source Map Automation (LOW)

### Problem

Source map upload is manual. The deployment runbook notes "not yet
automated in CI". Without source maps, Sentry stack traces show
minified code. **Config reviewer note**: both tsup configs already have
`sourcemap: true` — source maps are generated today. The gap is upload
automation, not generation.

### Fix

Two options (not mutually exclusive):

1. **Sentry Vercel Integration** — install from Vercel Marketplace,
   auto-uploads source maps on each deploy
2. **`@sentry/wizard` in CI** — `npx @sentry/wizard -i sourcemaps`
   adds a build plugin

The Vercel integration is simpler for the HTTP server. The CLI may need
the wizard approach for any bundled distribution.

**Debug IDs** (sentry reviewer finding — mitigates release ID risk):
Sentry now uses **Debug IDs** injected at build time to link source
maps, not release-based matching. This is independent of the release
string. If the build toolchain (tsup) supports Sentry Debug ID
injection (via `@sentry/bundler-plugin` or similar), the release ID
consistency concern (Wilma's finding) is largely mitigated.

**Investigation needed**: Does tsup support `@sentry/bundler-plugin`
for Debug ID injection? If so, this is the preferred approach over
release-based matching.

**Fallback — release ID consistency** (Wilma finding):
If Debug IDs are not supported with tsup, the release-based approach
remains. In that case: either (a) the Vercel integration handles this
automatically (it uses the deploy's git SHA for both), or (b) add a
CI step that compares the build release ID with the deployed release
ID and fails if they
diverge. Option (a) is preferred.

### Acceptance criteria

- Source maps appear in Sentry UI under the correct release
- Stack traces in production errors show readable TypeScript
- Release ID is consistent between build-time upload and runtime
  resolution (verified by CI or by the Vercel integration)

### Files

- Sentry Vercel integration config (external)
- Possibly: `apps/oak-curriculum-mcp-streamable-http/tsup.config.ts`
  (source map generation)
- CI: release ID consistency check (if not using Vercel integration)

---

## Search CLI Gap Analysis

The Search CLI shares the same adapter layer (`@oaknational/sentry-node`)
as the HTTP server, so Gaps 3, 4, and 5 apply identically. But the CLI
has different operational characteristics that affect the other gaps:

### Gap 1 (early init) — LOWER IMPACT for CLI

The CLI is a short-lived process. Commands run sequentially. The main
outbound HTTP calls (Elasticsearch) happen after `createCliObservability`
has already called `Sentry.init()`. Auto-instrumentation of `node:http`
would still be missed (the import happens before init via transitive
dependencies), but the practical impact is smaller:

- No Express route transactions needed (no web server)
- Outbound ES calls happen after init, but `node:http` is already
  loaded so the monkey-patch won't apply

**Assessment**: The same `--import @sentry/node/preload` flag can be
added to `tsx` invocations: `tsx --import @sentry/node/preload bin/oaksearch.ts`.
Lower priority than the HTTP server. Note: the CLI has no central dev
runner — `--import` adoption requires individual script edits in the
CLI's `package.json` (config reviewer finding).

### Gap 2 (Express error handler) — NOT APPLICABLE

The CLI has no Express. Error capture is via `captureHandledError` in
`withEsClient`'s catch block, which is the correct pattern for a CLI.

### Gap 3 (adapter surface) — APPLICABLE but different context

The CLI has no per-request user context (no auth). `setUser` is not
useful. `setTag` and `setContext` could be used for:

- Command name (`oaksearch search lessons`)
- Index target (`primary`/`sandbox`)
- Search index version

This would improve error triage in Sentry by tagging CLI errors with
the command and environment that triggered them.

### Gap 4 (trace propagation) — APPLICABLE

Same assessment as HTTP server. CLI outbound calls to Elasticsearch
could carry trace context if the deny-by-default policy is revised.

### Gap 5 (profiling) — NOT APPLICABLE

Short-lived CLI process. Profiling overhead is irrelevant and the data
would be too sparse to be useful.

### Gap 6 (source maps) — LOWER PRIORITY

The CLI is bundled via tsup. Source maps would help with production
error stack traces, but the CLI is typically run by operators who have
access to the source. Lower priority than the HTTP server.

### CLI-specific gap: command-level context enrichment

The CLI should tag Sentry events with the active command name. This
is not a canonical Sentry gap but an operational gap — when an error
arrives in Sentry from the CLI, the operator needs to know which
command was running.

**Fix**: In `withLoadedCliEnv`, wrap the span callback in
`observability.withEnrichedScope({ tags: { 'cli.command': commandName } }, ...)`.
This depends on Gap 3 (adapter surface extension).

### CLI-specific gap: `Sentry.close()` instead of `flush()` (sentry reviewer)

The CLI currently calls `flush()` before exit. For short-lived
processes, `Sentry.close()` is more appropriate — it drains the
transport AND prevents further sends, giving a cleaner shutdown.

**Fix**: Add `close()` to the `SentryNodeRuntime` interface. The CLI
entry point calls `close()` instead of `flush()`. The HTTP server
continues using `flush()` (long-lived process, may need to send more
events after flush).

### CLI-specific acceptance criteria

- CLI errors in Sentry are tagged with the command name
- CLI errors include index target and search index version as context
- `setTag`/`setContext` called in `withLoadedCliEnv` when observability
  is provided
- `close()` called instead of `flush()` at CLI exit
- Off/fixture modes are noop/captured

---

## Sequencing

```text
Gap 1 HTTP (early init)      — spike first, then one-line change
Gap 2 (error handler)        — can run in PARALLEL with Gap 1
Gap 3 (adapter ext)          — independent of Gaps 1-2
  └─ Gap 3.5 (metrics)       — depends on Gap 3 (same adapter pattern)
  └─ CLI enrichment          — depends on Gap 3 (setTag/setContext)
  └─ CLI metrics             — depends on Gap 3.5
  └─ CLI close()             — depends on Gap 3 (close on runtime)
Gap 4a (ES propagation)      — independent, low-ceremony
Gap 4b (Oak API propagation) — independent, security review gates it
Gap 5 (profiling)            — evaluate before release, ship or reject
Gap 6 (source maps)          — must be working before first prod errors
Gap 1 CLI (early init)       — low priority, after HTTP is proven
```

15 todos, all pending. Gaps 5 and 6 are pre-release requirements,
not post-release evaluations. The 15 items are the original 12 gap
items plus 3 from the merge session: `cli-log-level-di`,
`cli-logger-di-audit`, `cli-shutdown-ordering`.

**This plan does not block the parent plan** — Vercel credential
provisioning and deployment evidence can proceed independently.

## Verification

1. Deploy with `SENTRY_MODE=sentry` after Gaps 1-3
2. Trigger a test error — verify it appears in Sentry with:

   - Express route transaction name
   - Request context (method, URL, route)
   - Outbound HTTP spans (Elasticsearch call)
   - User ID (if authenticated)

3. Verify redaction: no MCP payload bodies, no tokens, no PII
4. CLI: verify command tags appear on CLI errors, `close()` drains
5. `pnpm check` green throughout

## Review Attribution

This plan was shaped by 5 specialist reviewers across 2 rounds:

**Round 1 — architecture reviewers (plan structure)**:

- **Fred** (boundary): mandated Option 2 for env resolution, two-layer
  SDK+runtime extension, narrow types
- **Wilma** (failure modes): double-init detection, terminal-handler
  semantics (later corrected), release ID consistency, null
  propagation, call-before-init race analysis
- **Betty** (cohesion): scope mutation concern (later corrected by
  sentry reviewer), init detection contract, testing seam trade-off,
  adapter justification

**Round 2 — domain specialists (correctness)**:

- **Sentry reviewer**: corrected Gap 2 ordering (Sentry handler first),
  corrected Gap 3 scope model (isolation scopes, not withScope), Debug
  IDs for source maps, `close()` for CLI, `tracePropagationTargets`
  is active opt-out
- **Config reviewer**: tsup entry point, dev runner args, start script
  format, profiling native addon risk, env schema gap, source maps
  already generated

The domain specialists corrected two assumptions made by the
architecture reviewers — demonstrating the value of multi-specialist
review with domain experts having final say on domain questions.
