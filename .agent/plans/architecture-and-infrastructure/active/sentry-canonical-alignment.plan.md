---
name: "Sentry Canonical Alignment"
overview: >
  Close the gaps between Oak's custom Sentry integration layer and the
  canonical Sentry Node.js/Express setup so real production failures are
  diagnosable in Sentry with trustworthy, redaction-safe signal and the
  minimum permanent Oak-specific observability machinery. The existing
  foundation (ADR-143, @oaknational/sentry-node adapter) prioritised DI
  testability and redaction safety but deferred several canonical Sentry
  capabilities. This plan addresses those deviations while keeping
  off-the-shelf Sentry as the baseline and adding only the Oak-specific
  value that native coverage does not currently provide.
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
  # === COMPLETED (2026-04-14, Sentry last mile session) ===
  - id: http-close-on-shutdown
    content: "Add close() to HttpObservability, switch all 3 shutdown paths from flush to close"
    status: done
    priority: next
    note: "Implemented 2026-04-14, committed 3962b5d0. Provider-neutral types in packages/core/observability/. Error mappers extracted to @oaknational/sentry-node/runtime-error.ts (Fred ruling — adapter knows both sides). Delegates tested (9 unit tests). close() tested in all 3 shutdown paths (server-runtime.unit.test.ts). CLI close() + fixture setTag/setContext tests added."
  - id: cli-context-enrichment
    content: "Add command-level context enrichment to CLI via setTag/setContext"
    status: done
    priority: next
    note: "Implemented 2026-04-14, committed 3962b5d0. setTag/setContext added. Options bag with 5 call sites. setTag assertions added to with-loaded-cli-env.unit.test.ts (explicit + default command name). Admin/eval sites not yet threaded (additive, not blocking)."
  - id: http-context-enrichment
    content: "Wire setUser/setTag/setContext on HttpObservability for MCP handler enrichment"
    status: done
    priority: next
    note: "Implemented 2026-04-14, committed 3962b5d0. mcp-handler.ts: Zod authInfoExtraSchema for userId extraction (shared with check-mcp-client-auth.ts), enrichObservabilityScope helper extracted (complexity fix). handlers.ts: mcp.tool_name tag. 6 mcp-handler unit tests (setTag/setUser, auth matrix). Code-reviewer + sentry-reviewer approved."
  # === COMPLETED (2026-04-14c, session c) ===
  - id: describe-config-error-extraction
    content: "Extract describeConfigError to @oaknational/sentry-node"
    status: done
    note: "Implemented 2026-04-14c. TDD (7 unit tests). Both apps now import from sentry-node. Eliminates verbatim duplication."
  - id: preload-refactor
    content: "Move --import @sentry/node/preload from package.json to documented shell script"
    status: done
    note: "Implemented 2026-04-14c. scripts/start-server.sh with extensive documentation (why, what happens when off, references). Dev runner retains inline --import with comment pointing to script for rationale."
  # === REMAINING (this branch, before PR) ===
  - id: wrap-mcp-server-investigation
    content: "Define the required live-path MCP observability signal and verify native Sentry's baseline versus Oak's gap"
    status: done
    priority: next
    note: "Completed 2026-04-15. Verified that native Sentry is the correct off-the-shelf baseline for the live MCP path, but it does not currently provide first-class exception capture on Oak's real register* path. Historical pre-reframe snapshot preserved in archive/superseded for comparison."
  - id: wrap-mcp-server-adopt
    content: "Adopt native Sentry as the canonical MCP live-path baseline and add only the minimum Oak-specific register* gap closure required for production debugging value"
    status: done
    note: "Completed 2026-04-15. Commit d7cf028b: wired wrapMcpServerWithSentry in factory, removed all sentry-mcp wrapper usage from production code. Cleanup commit 2: deleted dead tests (trace-context block, mcp-server-internal-access), removed dead HttpObservability members (createMcpObservationOptions, mcpRecorder, McpObservationRuntime extension), removed sentry-mcp from production deps, added integration tests proving native wrapping order. 612 tests pass, gates green."
  - id: sentry-mcp-collapse
    content: "Re-home fixture/test support and remove @oaknational/sentry-mcp only when deletion is low-risk"
    status: in_progress
    note: "Circular justification chain broken: HttpObservability no longer extends McpObservationRuntime, sentry-mcp has zero production consumers in the HTTP app. Package still exists in packages/libs/sentry-mcp/ with its own internal tests. Full deletion is now low-risk — next step is to verify no other workspace imports it and remove."
  - id: custom-metrics
    content: "Expose Sentry.metrics (count, gauge, distribution) on the adapter with beforeSendMetric hook"
    status: dropped
    note: "Tracked in sentry-observability-expansion.plan.md (EXP-A). Explicitly out of this child plan."
  - id: cli-metrics
    content: "Wire CLI command execution metrics via Sentry.metrics.count"
    status: dropped
    note: "Tracked in sentry-cli-observability-extension.plan.md (CLI-1). Explicitly out of this child plan."
  - id: mcp-request-context
    content: "Add Sentry.setContext('mcp_request', ...) for richer error detail in Sentry sidebar"
    status: dropped
    note: "Tracked in sentry-observability-expansion.plan.md (EXP-B). Explicitly out of this child plan."
  - id: cli-early-init
    content: "Add --import @sentry/node/preload to CLI tsx invocations"
    status: dropped
    note: "Tracked as explicit option in sentry-cli-observability-extension.plan.md (CLI-3) with decision gate and fallback path."
  - id: trace-propagation-es
    content: "Add Elasticsearch host to tracePropagationTargets (low-ceremony, Oak-controlled)"
    status: dropped
    note: "Tracked in sentry-observability-expansion.plan.md (EXP-C1) and CLI mirror track (CLI-2)."
  - id: trace-propagation-oak-api
    content: "Evaluate trace propagation to Oak API (third-party, security review required)"
    status: dropped
    note: "Tracked in sentry-observability-expansion.plan.md (EXP-C2) with explicit security gate."
  - id: profiling-evaluation
    content: "Evaluate @sentry/profiling-node for the HTTP server before production release"
    status: dropped
    note: "Tracked in sentry-observability-expansion.plan.md (EXP-D) with benchmark gate."
  - id: source-maps-automation
    content: "Automate source map upload via sentry-cli post-build step"
    status: dropped
    note: "Tracked in parent plan WS6 and in sentry-observability-expansion.plan.md (EXP-E) for implementation options and acceptance evidence."
---

# Sentry Canonical Alignment

## Role

This plan closes the remaining **HTTP MCP live-path** gaps between Oak's
Sentry integration and canonical Sentry Node.js practices so real MCP
failures are diagnosable in production with trustworthy, actionable
signal. It is a child of the parent execution plan
(`sentry-otel-integration.execution.plan.md`) and inherits its
redaction, DI, and safety invariants.

Historical comparison snapshot preserved for traceability:

- [pre-value-reframe snapshot](../archive/superseded/sentry-canonical-alignment.plan.pre-value-reframe-2026-04-15.md)

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

The point of this plan is not canonical compliance for its own sake. The
point is operational value: off-the-shelf Sentry should own the baseline
live path wherever it can, and Oak should add only the minimum extra
functionality required where native coverage stops short.

## Relationship to Parent Plan

**This plan does not block the parent plan.** The parent execution plan
remains authoritative for shared foundation concerns, credential
provisioning, source-map automation, and deployment evidence. This child
plan is authoritative only for the remaining HTTP MCP runtime-alignment
decisions on the live path.

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
Gap 2's error grouping and broader downstream tracing useful. Kept
as first priority because it's a one-line change with broad impact.

**Scope**: HTTP server only. The child-plan target is the HTTP MCP live
path. Search CLI keeps explicit per-command init under the parent-plan
contract and is not part of this plan's execution scope.

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
- Registration failure policy must be explicit and documented; if
  startup is allowed to continue in `SENTRY_MODE=sentry`, record this as
  a temporary non-canonical divergence with a follow-up removal path
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

## MCP Live-Path Observability — Native Baseline plus Oak Gap Closure

### Value and Impact

The goal of this track is not package removal, wrapper purity, or
"canonical" adoption as an end in itself. The goal is operational:

- real MCP failures on Oak's live path must produce fast, trustworthy,
  actionable Sentry signal
- that signal must remain redaction-safe and compatible with
  `SENTRY_MODE=off`
- off-the-shelf Sentry should own the canonical production path
  wherever it already provides value
- Oak should add only the minimum extra functionality needed where the
  native surface stops short
- package shape follows from that outcome; it is not the objective

### Metacognitive Correction

Two framing errors showed up in sequence:

1. **Sunk-cost rationalisation**: the earlier plan discovered the native
   wrapper, then invented "retain `sentry-mcp` for fixture mode" as a
   reason to keep a path that production no longer needed.
2. **Mechanism-first drift**: the investigation then recentred on
   "what survives of `@oaknational/sentry-mcp`?" instead of the
   underlying production value.

The correct question is:

> What live-path observability signal does Oak need beyond native
> Sentry, and where should that responsibility live with the least
> permanent custom machinery?

### Required Live-Path Outcome

For the HTTP MCP server, the authoritative production path must satisfy
all of the following:

- native Sentry owns transport/session/protocol tracing and correlation
  on the live path
- thrown handler failures on Oak's real `register*` path appear as
  first-class Sentry failure signal, not only as transactions or MCP
  error payloads
- non-throwing tool failures that legitimately return
  `CallToolResult.isError = true` are explicitly classified (captured vs
  log-only) and proven by test
- `sendDefaultPii: false` continues to suppress MCP payload capture by
  default
- `SENTRY_MODE=off` remains inert and safe
- no parallel custom MCP tracing system remains once the native
  baseline adoption is complete

### Verified Baseline and Gap (2026-04-15)

#### 1. What native Sentry already gives Oak

- **Source reading**: `wrapMcpServerWithSentry()` patches `connect`
  and the deprecated `tool` / `resource` / `prompt` methods, then
  wraps transport `onmessage` / `send` / `onclose` / `onerror`.
- **Oak-path spike**: wrapping the real `McpServer` on Oak's actual
  `createMcpHandler` + `StreamableHTTPServerTransport` path emitted
  native `mcp.server` transactions for:
  `tools/call get-curriculum-model`,
  `prompts/get find-lessons`,
  `resources/read docs://oak/getting-started.md`.
- **Safety spike**: no-init/off-mode runs remained safe; wrapped
  tool/resource/prompt calls still completed without wrapper failures.
- **Capture-policy spikes**: with `sendDefaultPii: false`, native MCP
  tracing still recorded method/target/transport/protocol metadata
  while omitting request arguments and payload bodies by default.

#### 2. The verified live-path gap

- Oak's real registration path is `registerTool` /
  `registerResource` / `registerPrompt`; native Sentry does **not**
  patch those methods.
- The decisive error-parity spike proved the gap:
  `registerTool('boom')` and deprecated `tool('boom')` both emitted a
  `tools/call boom` transaction, but only the deprecated `tool()` path
  produced a captured exception event.
- Conclusion: native Sentry is the right baseline, but it does not yet
  provide the full failure signal Oak needs on the live `register*`
  path.

#### 3. Current Oak-specific surface and migration burden

- `@oaknational/sentry-mcp` currently mixes two separate concerns:
  runtime handler wrapping and fixture/test recorder support.
- The runtime consumer is the HTTP app; the remaining surface is
  fixture/test or package-internal.
- Conclusion: live-path gap closure and fixture/test support must be
  treated as separate design problems. "Tests use it" is migration
  surface, not architectural justification.

### Plan Direction

- Native Sentry is the canonical off-the-shelf baseline for the live
  MCP path.
- Oak must add the minimum additional functionality needed to preserve
  the missing live-path value; today that is first-class exception
  capture on the real `register*` path.
- Any Oak-owned addition must stay narrow:
  - capture missing failure signal only
  - not recreate transport/session/protocol tracing
  - not create a second custom MCP span system
- For this branch, the Oak-specific gap closure should live in
  `apps/oak-curriculum-mcp-streamable-http`, not in a renewed shared
  wrapper package. Revisit only if a second live MCP server consumer
  appears.
- Freeze `@oaknational/sentry-mcp` as an expansion surface; do not add
  new responsibilities there.
- Historical comparison context is preserved in:
  [pre-value-reframe snapshot](../archive/superseded/sentry-canonical-alignment.plan.pre-value-reframe-2026-04-15.md)

### Next Execution Track

1. **Adopt the native baseline on the real server path**
   - Wrap the real `McpServer` at composition root with
     `wrapMcpServerWithSentry()`.
   - Make native transport/session/protocol tracing the authoritative
     production path.

2. **Add the minimum Oak-specific `register*` gap closure**
   - Preserve first-class error capture for thrown
     `registerTool` failures on the real HTTP path.
   - Treat `registerResource` / `registerPrompt` extension as proof-
     triggered only. Add explicit capture only if characterisation tests
     show native protocol-error capture is insufficient.
   - Own this gap-closure layer in the HTTP app.
   - Do not emit custom Oak tracing spans in the gap-closure layer.

3. **Separate fixture/test support from runtime signal**
   - Move recorder/types into the HTTP app unless a genuinely shared
     runtime consumer appears during implementation.
   - Replace wrapper-characterisation tests with tests for the chosen
     authoritative live path.
   - Keep only the fixtures needed to prove the rewritten architecture.

4. **Collapse obsolete packaging**
   - Remove or collapse `@oaknational/sentry-mcp` only after runtime
     gap closure and fixture/test migration are complete.
   - Treat package removal as an outcome of simplification, not a
     primary success criterion.

### Acceptance Criteria for This Track

- Real HTTP-path success case: native `mcp.server` transactions exist
  for tool, prompt, and resource requests.
- Real HTTP-path thrown `registerTool` failure: Sentry captures both
  the transaction and a first-class exception event.
- Real HTTP-path non-throwing tool failure that returns
  `CallToolResult.isError` is explicitly classified (captured vs
  log-only) and validated by test.
- Stateless Streamable HTTP behaviour is preserved on the authoritative
  path (no session-id requirement introduced by observability changes).
- `sendDefaultPii: false` continues to omit MCP inputs/outputs by
  default.
- `SENTRY_MODE=off` remains inert.
- No duplicate Oak-specific MCP tracing spans remain on the
  authoritative live path.
- Fixture/test coverage proves the chosen architecture rather than the
  superseded wrapper package.

---

## Scope Deliberately Excluded From This Child Plan

These items are valid but are not required to complete HTTP MCP
live-path alignment and therefore are explicitly moved out of this child
plan:

- CLI enhancements (including CLI metrics and CLI preload options):
  `sentry-cli-observability-extension.plan.md`
- Metrics expansion (`Sentry.metrics` / `beforeSendMetric`):
  `sentry-observability-expansion.plan.md`
- Propagation expansion to Elasticsearch or third-party Oak API hosts:
  `sentry-observability-expansion.plan.md`
- Profiling adoption (`@sentry/profiling-node`):
  `sentry-observability-expansion.plan.md`
- Source-map automation and deployment evidence:
  parent-plan WS6 plus `sentry-observability-expansion.plan.md`

Authoritative tracking for source maps, credentials, and deployment
proof remains in:
`sentry-otel-integration.execution.plan.md`.

Lossless comparison map against the superseded plan and this narrowed plan:
`sentry-observability-translation-crosswalk.plan.md`.

---

## Sequencing

```text
DONE:
  - Gap 1 (HTTP preload)
  - Gap 2 (Express error handler ordering)
  - Gap 3 (adapter surface extension + context enrichment)
  - Investigation of native MCP baseline versus Oak register* gap

NEXT (child-plan authority):
  1) Adopt native MCP wrapper baseline on the real HTTP server path
  2) Add minimum app-local register* gap closure for first-class failure signal
  3) Re-home fixture/test support to smallest justified owner
  4) Remove @oaknational/sentry-mcp only if deletion is low-risk after proof

PARENT PLAN HANDOFF (not owned here):
  - Credential provisioning completion
  - Source-map upload automation
  - Deployment evidence bundle
```

The adoption gate is now: preserve required live-path debugging value
with the smallest architecture, not package-fate optimisation.

---

## Verification

1. Deploy with `SENTRY_MODE=sentry` on the HTTP server path after the
   MCP live-path adoption changes.
2. Trigger a successful MCP request and verify:
   - native `mcp.server` transaction exists for tool, prompt, and
     resource calls
   - method/target/transport/protocol metadata is present
   - no MCP request/response payload bodies when `sendDefaultPii: false`
3. Trigger a thrown `registerTool` failure and verify:
   - first-class exception event captured
   - correlated `mcp.server` transaction present
   - no raw MCP payload bodies, tokens, or PII
4. Trigger one non-throwing tool failure that returns
   `CallToolResult.isError = true` and verify the explicit classification
   decision (captured vs log-only) is applied as designed.
5. Characterise prompt/resource failure behaviour before extending
   custom gap closure:
   - one thrown `registerPrompt` failure path
   - one thrown `registerResource` failure path
   - if native protocol-error capture is insufficient for either path,
     implement explicit capture and re-run verification before closure
6. Verify off-mode/no-init remains inert on the same path.
7. Verify no duplicate Oak-specific MCP tracing spans remain on the
   authoritative live path.
8. Verify MCP wire behaviour for `tools/call` is unchanged by
   observability changes (success and `isError` envelopes preserved).
9. `pnpm check` remains green.

---

## Parent-Plan Handoff Criteria

When this child plan's verification is complete, the remaining finish
work must continue in the parent plan:

1. complete platform credential provisioning,
2. complete source-map upload automation with repo-specific proof, and
3. complete the deployment evidence bundle.

## Review Attribution

This plan was shaped by specialist reviewers across 3 rounds:

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

**Round 3 — framing correction (2026-04-15)**:

- **Barney**: corrected the objective from package fate to production
  debugging value; native Sentry is the live-path baseline, Oak should
  add only the minimum missing signal
- **Assumptions reviewer**: corrected the lingering false dichotomy;
  the primary decision is which live-path signal must survive on
  `register*` and where that responsibility should live
- **Sentry reviewer + MCP reviewer**: validated the decisive
  `registerTool('boom')` parity gap between native transactions and
  first-class exception capture

The domain specialists corrected two assumptions made by the
architecture reviewers — demonstrating the value of multi-specialist
review with domain experts having final say on domain questions.
