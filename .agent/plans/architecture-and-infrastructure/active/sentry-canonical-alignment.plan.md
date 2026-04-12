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
  - id: early-init-http
    content: "Move Sentry SDK init to instrument.ts loaded via --import for HTTP server"
    status: pending
    note: "Highest-impact gap. Extract resolveSentryEnv(), single init path, sentryInitState flag. Config reviewer: add tsup entry, update start script, update dev runner."
  - id: express-error-handler
    content: "Adopt Sentry.setupExpressErrorHandler BEFORE createEnrichedErrorLogger"
    status: pending
    note: "Sentry reviewer corrected ordering: Sentry handler first per official docs, not terminal. Wrap in try-catch."
  - id: adapter-surface-extension
    content: "Add setUser, setTag, setContext to SentryNodeRuntime and SentryNodeSdk"
    status: pending
    note: "Simplified per sentry reviewer: @sentry/node v8+ isolation scopes make ambient calls safe per-request. No withScope needed."
  - id: trace-propagation-evaluation
    content: "Evaluate tracePropagationTargets for Oak-controlled hosts with security review"
    status: pending
    note: "Current [] is active opt-out of SDK default. Evaluation criteria defined. Security reviewer must sign off."
  - id: profiling-evaluation
    content: "Evaluate @sentry/profiling-node for the HTTP server under realistic load"
    status: pending
    note: "Low priority. ~5% CPU overhead. Native addon — verify Vercel ABI. Add SENTRY_ENABLE_PROFILING to env schema."
  - id: source-maps-automation
    content: "Automate source map upload — investigate Debug IDs vs release-based matching"
    status: pending
    note: "Sentry now uses Debug IDs (build-injected). Check @sentry/bundler-plugin + tsup support. Source maps already generated."
  - id: cli-early-init
    content: "Evaluate early init for Search CLI (lower priority than HTTP server)"
    status: pending
    note: "Short-lived process, lower impact. No central dev runner — requires individual script edits."
  - id: cli-context-enrichment
    content: "Add command-level context enrichment to CLI via setTag/setContext"
    status: pending
    note: "Depends on adapter-surface-extension. Tag with command name, index target, version."
  - id: cli-close-instead-of-flush
    content: "Use Sentry.close() instead of flush() for CLI shutdown"
    status: pending
    note: "Sentry reviewer: close() drains transport AND prevents further sends. More appropriate for short-lived process."
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

## Gap 1 — Early SDK Init (HIGH)

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

### Fix

Create `apps/oak-curriculum-mcp-streamable-http/src/instrument.ts` that
calls `Sentry.init()` with the resolved config. Load it via Node's
`--import` flag in the start script (`package.json` `start` command).

**Env resolution** (DECIDED — architecture reviewers unanimous):
Extract a thin `resolveSentryEnv()` function from
`@oaknational/sentry-node` that both `instrument.ts` and
`createSentryConfig` call. Options 1 (raw `process.env`) and 3
(accept duplication) are rejected — Option 1 violates ADR-078,
Option 3 creates silent config divergence between bootstrap and DI.

**Double-init problem** (CRITICAL — Wilma finding): Calling
`Sentry.init()` twice is undefined behaviour — the second call is
silently ignored by `@sentry/node`. The current `initialiseSentry()`
has no way to detect a prior init, so it would create a zombie runtime
that thinks it's live but the SDK was already configured differently.

**Resolution — single init, not dual init**: `instrument.ts` is the
**only** call site for `Sentry.init()` in sentry mode. The later
`createHttpObservability()` call must detect that Sentry is already
initialised and skip `sdk.init()`. Detection mechanism: export a
module-level `sentryInitState` flag from `instrument.ts` that the
runtime can read (simpler and more reliable than probing SDK internals).
In off/fixture mode, `instrument.ts` does nothing and
`initialiseSentry()` handles everything as before.

**Scope**: HTTP server only. The Search CLI is a short-lived process
where early init matters less — commands run sequentially and the main
outbound calls happen after init. CLI can adopt later for consistency.

### Acceptance criteria

- `instrument.ts` exists and is loaded via `--import` in dev and
  production start scripts
- `resolveSentryEnv()` extracted to `@oaknational/sentry-node` and
  used by both `instrument.ts` and `createSentryConfig`
- `Sentry.init()` is called exactly once (in `instrument.ts` for sentry
  mode, in `initialiseSentry` for fixture mode)
- Auto-generated Express route transactions appear in Sentry
- Outbound HTTP spans to Elasticsearch appear as children of the
  request transaction
- Existing DI test patterns still work (injectable SDK, fixture mode)
- `SENTRY_MODE=off` still prevents any SDK init

### Files (config reviewer detail)

- New: `apps/oak-curriculum-mcp-streamable-http/src/instrument.ts`
- Modified: `apps/oak-curriculum-mcp-streamable-http/tsup.config.ts`
  — add `instrument: 'src/instrument.ts'` to `entry` object
- Modified: `apps/oak-curriculum-mcp-streamable-http/package.json`
  — `start` becomes `node --import ./dist/instrument.js dist/index.js`
- Modified: `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts`
  — prepend `['--import', './src/instrument.ts']` to server args
- Modified: `packages/libs/sentry-node/src/runtime.ts` (skip init
  when already initialised)
- New/modified: `packages/libs/sentry-node/src/config-resolution.ts`
  (extract `resolveSentryEnv()`)

---

## Gap 2 — Express Error Handler (MEDIUM)

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

### Acceptance criteria

- `Sentry.setupExpressErrorHandler(app)` is called in the app bootstrap
  BEFORE `createEnrichedErrorLogger` (per official Sentry docs)
- Error events in Sentry include request URL, method, route, and status
- Existing `createEnrichedErrorLogger` behaviour unchanged
- Redaction hooks still fire on error events
- Registration ordering documented in code comments
- Registration wrapped in try-catch in bootstrap (Wilma: if it throws
  during registration, the app must still start)

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

### Fix

Evaluate whether to add Oak-controlled hosts to the allowlist:

- Elasticsearch Serverless endpoint (`*.elastic.cloud`)
- Oak API (`open-api.thenational.academy`)

**Security review required**: trace propagation headers leak trace IDs
to upstream services. For Elasticsearch (our own instance) this is safe.
For the Oak API (third-party from our perspective) it needs assessment.

This is an evaluation, not an automatic change. The deny-by-default
policy may be correct for v1.

**Evaluation criteria** (Wilma finding — must be explicit):

1. Is the target Oak-controlled? (ES: yes. Oak API: evaluate)
2. Does the target accept/log trace headers? (If not, propagation is
   pointless overhead)
3. What is the blast radius if trace IDs leak? (ES: low — our instance.
   Oak API: medium — third-party could correlate our request patterns)
4. Does the target support W3C `traceparent` or Sentry-proprietary
   `sentry-trace`? (Affects interop)

**Security reviewer** must sign off on each target before it's added.

### Acceptance criteria

- Evaluation completed per the criteria above for each candidate target
- Security review documented and signed off
- If approved: add targets to config, verify distributed trace
  continuity in Sentry
- If denied: document the rationale and close this gap as "accepted"

### Files

- Modified: `packages/libs/sentry-node/src/runtime-sdk.ts` (or config)
- May need: per-app `tracePropagationTargets` config in env schema

---

## Gap 5 — Profiling (LOW)

### Problem

No `@sentry/profiling-node` integration. No CPU flame graphs in Sentry.

### Fix

Evaluate under realistic production load. Profiling adds ~5% CPU
overhead and a native Node.js addon dependency. Not appropriate to add
speculatively.

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

**Assessment**: The `--import instrument.ts` pattern could be applied to
the CLI start script (`tsx bin/oaksearch.ts`) for consistency, but it's
lower priority than the HTTP server. Note: the CLI has no central dev
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
Gap 1 HTTP (early init)      — do first, highest impact
  └─ Gap 2 (error handler)   — depends on init being active
  └─ Gap 3 (adapter ext)     — independent, can parallel with Gap 2
       └─ CLI enrichment     — depends on Gap 3 (setTag/setContext)
       └─ CLI close()        — depends on Gap 3 (close on runtime)
Gap 4 (trace propagation)   — independent, security review gates it
Gap 5 (profiling)            — independent, needs production load data
Gap 6 (source maps)          — independent, Debug ID investigation first
Gap 1 CLI (early init)       — low priority, after HTTP is proven
```

Gaps 1-3 form a natural batch for the HTTP server. CLI enrichment and
close() follow once Gap 3 lands. Gaps 4-6 are independent evaluations.
CLI early init is the lowest priority item.

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
