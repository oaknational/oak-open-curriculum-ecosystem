# Observability (MCP Streamable-HTTP server)

Authoritative guide to Sentry instrumentation, spans, scope enrichment,
redaction, release metadata, and source-map upload for this app. This document
supersedes the Observability section in the workspace
[README.md](../README.md), which now summarises and links here.

Governance:

- [ADR-143 Observability Boundary](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
- [ADR-160 Non-Bypassable Redaction Barrier](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
- [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
  (five-axis principle, vendor-independence clause)
- [ADR-078 Dependency Injection](../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)
  (all Sentry wiring is DI-injected)

Upstream library: [`@oaknational/sentry-node`](../../../packages/libs/sentry-node/README.md).

## Deployment context

- **Sentry org**: `oak-national-academy`.
- **Sentry project (this app)**: `oak-open-curriculum-mcp`.
- **Sentry region**: `de.sentry.io` (EU). All DSNs, ingest URLs, and
  Sentry CLI calls use the EU host; the `.com` host is wrong for this
  project and silently produces 404s on release/commit operations.
- **Vercel project**: `poc-oak-open-curriculum-mcp` at
  [vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp](https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp).
  Environment variables, deployment logs, and the Sentry source-map
  upload contract are all configured there.
- **Sentry MCP server (`sentry-ooc-mcp`)**: project-scoped via URL
  path to `oak-national-academy/oak-open-curriculum-mcp`. Agent
  queries against this MCP server are pre-scoped to this app — no
  cross-project leak.

## The three modes

`SENTRY_MODE` controls runtime behaviour. Parsed once at startup via
`@oaknational/env-resolution`; never re-read.

- `SENTRY_MODE=off` — default kill switch. No Sentry SDK init, no outbound
  delivery, no fixture store. Structured JSON stdout via `@oaknational/logger`
  remains the canonical local log surface (ADR-162 vendor-independence).
- `SENTRY_MODE=fixture` — no-network local verification. Stdout JSON is
  retained; MCP observations and handled-error captures are recorded in a
  local fixture store used by tests and local validation. See
  `createFixtureSentryStore` in `@oaknational/sentry-node`.
- `SENTRY_MODE=sentry` — live mode. Stdout JSON is still retained; the Sentry
  SDK is initialised, the logger sink is active, live error capture and
  tracing are enabled, and every captured payload passes through the
  redaction barrier before transmission.

## Auto-instrumentation of MCP requests

The MCP server instance is wrapped with Sentry's MCP-aware instrumentation at
server construction:

```ts
import { wrapMcpServerWithSentry } from '@sentry/node';
// ...
wrapMcpServerWithSentry(server);
```

Location: [`src/app/core-endpoints.ts:98`](../src/app/core-endpoints.ts).

`wrapMcpServerWithSentry` is unconditional in the composition root; when
`SENTRY_MODE=off` the underlying `@sentry/node` SDK is not initialised, so
the wrapper is inert. The vendor-independence clause of ADR-162 is therefore
currently a _structural_ claim rather than a _tested invariant_; converting
it to a tested invariant is tracked under
[`current/multi-sink-vendor-independence-conformance.plan.md`](../../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md)
(Wave 5).

## Per-request span and scope enrichment

Every MCP request is wrapped in a single manual span named
`oak.http.request.mcp`, emitted in `createMcpHandler` at
[`src/mcp-handler.ts`](../src/mcp-handler.ts) via `observability.withSpan`.
HTTP-level attributes (`http.method`, `http.route`) are passed inline on the
`withSpan` call alongside `run`.

The manual span is the HTTP transport wrapper; `wrapMcpServerWithSentry` adds
nested MCP server-layer spans (per-tool, per-resource, per-prompt) underneath
it. Both layers coexist in Sentry's trace view.

Scope enrichment attaches MCP-specific context to the active scope for each
request in `enrichObservabilityScope` at
[`src/mcp-handler.ts`](../src/mcp-handler.ts):

- `mcp.method` — JSON-RPC method (e.g. `tools/call`, `tools/list`), set via
  `observability.setTag('mcp.method', mcpMethod)`.
- `mcp.tool_name` — resolved tool identifier, set in the dispatch handler at
  [`src/handlers.ts`](../src/handlers.ts) via
  `options.observability.setTag('mcp.tool_name', tool.name)`.
- User context — when an authenticated `userId` is present on
  `req.auth?.extra`, the scope `user.id` is set via
  `observability.setUser({ id: userId })`. No request body, query string, or
  header content is attached to the scope.

Auth-success logger lines (stdout JSON) carry `clientId`, `scopeCount`, and
`hasUserContext` derived from `AuthInfo` in
[`src/check-mcp-client-auth.ts`](../src/check-mcp-client-auth.ts) — these
are logger fields, not Sentry scope values.

These attributes compose with the per-request span in Sentry's trace view,
giving per-tool and per-method breakdowns without any custom dashboards.

## Express error handler registration

The Sentry Express error handler is registered at the app composition root,
gated on `SENTRY_MODE`:

```ts
// src/index.ts:40-41
setupSentryErrorHandler:
  config.env.SENTRY_MODE !== 'off' ? setupExpressErrorHandler : undefined,
```

The handler function is **DI-injected**: the app layer passes
`setupExpressErrorHandler` from `@sentry/node` in production, or `undefined`
in `off` mode. Tests inject a recording fake and assert on its invocation,
so the handler contract is covered without booting the Sentry SDK. See
[`src/app/bootstrap-error-handlers.ts`](../src/app/bootstrap-error-handlers.ts)
for the DI type.

## Manual spans

Beyond the per-request `oak.http.request.mcp`, the app emits targeted manual
spans at integration boundaries:

- bootstrap phases, including the upstream OAuth metadata fetch
- OAuth proxy upstream `register` and `token` calls
- asset-download upstream fetch and stream lifecycle

Each span is emitted via `observability.withSpan` / `startSpan`; no vendor
imports appear in app code beyond the composition root.

## Redaction barrier entry points

The redaction barrier is the single closure point where every payload
destined for Sentry is sanitised. Governed by ADR-143 (observability boundary)
and ADR-160 (non-bypassable redaction barrier), the barrier wires five
hooks as `SentryRedactionHooks` in `@oaknational/sentry-node`:

- `beforeSend` — errors and messages
- `beforeSendTransaction` — transactions
- `beforeSendSpan` — spans
- `beforeSendLog` — logger events (Sentry 10.x)
- `beforeBreadcrumb` — breadcrumbs

Every outbound payload passes through this wiring. A subset of the hooks
admits a consumer-supplied post-redaction slot via
`SentryPostRedactionHooks` (`beforeSend`, `beforeSendTransaction`,
`beforeBreadcrumb` today); the other two are redaction-only. Adding a new
payload-mutating hook to the Sentry SDK requires adding a new member to
`SentryRedactionHooks` — there is no way to wire a consumer hook that skips
redaction. Closure is enforced by
[`runtime-redaction-barrier.unit.test.ts`](../../../packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts)
(18 tests).

The HTTP telemetry boundary is metadata-only in line with ADR-143. The
Oak-side redactor (`runtime-redaction.ts` in `@oaknational/sentry-node`)
applies deny-list masking to:

- `/mcp` request payloads (method and route metadata are retained; other
  fields are deny-list-masked in place rather than removed)
- raw JSON-RPC envelopes, request bodies, query strings, cookies, and
  `Authorization` headers (deny-list-masked before Sentry capture)
- `application/x-www-form-urlencoded` OAuth payloads (treated as sensitive
  input)

`sendDefaultPii` is invariantly `false` per ADR-143; the redaction barrier
adds structural redaction on top of that floor.

**Behavioural expectations (enforced by vendor integration, not the Oak
barrier)**: `wrapMcpServerWithSentry` attaches MCP tool, resource, and
prompt observations with kind, name, status, duration, and trace
identifiers. These are not filtered by the Oak redactor alone — the shape
is a property of the vendor integration + `sendDefaultPii: false` combined.
Converting this to a tested invariant is a candidate for a future lane.

## Handled-error capture boundaries

Handled-error capture is reserved for unexpected terminal boundaries:

- bootstrap failure
- server listen failure
- Express error middleware (via the injected `setupExpressErrorHandler`)
- MCP cleanup failure
- OAuth upstream timeout / network failure
- asset-download proxy failure

Expected validation, auth, and upstream-status branches remain logs plus
span status only — they do not raise Sentry error events.

On shutdown and startup-failure paths, the app performs bounded Sentry
flushes at the process boundary: bootstrap failure, server listen error,
`SIGINT`, and `SIGTERM`. Per-request MCP teardown never initialises or
flushes Sentry.

## Source-map upload and release/commit/deploy linkage

Production Sentry stack traces are symbolicated via source-map upload, and
every production build registers a Sentry release + commit + deploy event,
all inside the Vercel Build Command.

**Mechanism (§L-8 onwards, 2026-04-21):** the workspace's default `build`
script runs the esbuild composition root
[`esbuild.config.ts`](../esbuild.config.ts), which conditionally injects
[`@sentry/esbuild-plugin`](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/esbuild/)
into the esbuild build options. The plugin performs every step previously
listed as ADR-163 §6.0–§6.6 (release upsert, explicit `--commit` form,
Debug-ID injection, sourcemap upload, finalize, deploy event) as library
operations during the build itself. The §6.0 idempotency posture is
preserved by the plugin's release upsert semantics: re-running the same
release identity is a no-op and the original deploy's commit attribution
is retained across Vercel manual redeploys.

Vercel runs this without a `buildCommand` override. The composition root
reads `process.env` once at the boundary; the two pure factories it calls
([`build-scripts/esbuild-config.ts`](../build-scripts/esbuild-config.ts)
for the Oak-owned esbuild contract,
[`build-scripts/sentry-build-plugin.ts`](../build-scripts/sentry-build-plugin.ts)
for the env → registration intent) take env as a typed parameter so the
ADR-163 policy logic stays test-driven.

`SENTRY_RELEASE_REGISTRATION_OVERRIDE=false` skips the plugin entirely
(the build runs and produces `dist/` with hidden source-maps but does not
talk to Sentry). This is the local-dev default per ADR-163 §4.

The plugin runs only in the Vercel Build Command — never in PR-check CI,
which remains network-free per ADR-161. Operational flow + log-grep
patterns: [sentry-deployment-runbook.md § 3b](../../../docs/operations/sentry-deployment-runbook.md).

Historical note: the L-7 lane (2026-04-20) used a bespoke four-file
TypeScript orchestrator (`build-scripts/sentry-release-and-deploy-cli.ts`
and friends) wrapping `sentry-cli` invocations, plus a
`scripts/upload-sourcemaps.sh` wrapper. All of those files are deleted by
§L-8 WS2.3 in favour of the vendor's first-party plugin. See ADR-163 §6
amendment 2026-04-21 (HOW → WHAT) and §7 amendment 2026-04-21 (composition
root replaces orchestrator script) for the full reframing.

## Release and metadata resolution

**Authoritative source**:
[ADR-163 Sentry Release Identifier, Source-Map Attachment, and Vercel
Production Attribution](../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md).

Release and environment resolve fail-fast at startup:

- **Release = root repo `package.json` semver.** `SENTRY_RELEASE_OVERRIDE`
  is the only explicit override. See ADR-163 §1.
- **Git SHA is metadata, not the release identifier.** Resolves from
  `GIT_SHA_OVERRIDE` or `VERCEL_GIT_COMMIT_SHA`, attached as the
  `git.commit.sha` Sentry tag and via `releases set-commits`. See
  ADR-163 §2.
- **Environment = `VERCEL_ENV` constrained by `VERCEL_GIT_COMMIT_REF`
  for production.** A production build from a non-main branch is
  downgraded to `preview` and a warning is emitted. See
  [ADR-163 §3 truth table](../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md#3-production-attribution-requires-both-vercel_envproduction-and-vercel_git_commit_refmain).
- **Local-dev builds do not register Sentry releases or deploys**
  unless both `SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` and
  `SENTRY_RELEASE_OVERRIDE=<version>` are set. See ADR-163 §4.

Invalid override values and missing root `package.json` version are startup
errors (fail-fast, not silent drift).

The root package version is only bumped by the `semantic-release`
workflow (`.github/workflows/release.yml`). Preview and local builds
can legitimately contain commits newer than the current release
version; the `git.commit.sha` tag distinguishes them within a single
release. On Vercel production, repo-owned build gating cancels non-
release builds before they run via `vercel.json` `ignoreCommand`,
preventing version drift under an old semantic-release tag.

## Related

- [Upstream library README](../../../packages/libs/sentry-node/README.md) —
  package-level reference for `@oaknational/sentry-node`.
- [Operational debugging](./operational-debugging.md) — request tracing,
  timing, diagnostics, production logging.
- [`what-the-system-emits-today.md`](../../../.agent/plans/observability/what-the-system-emits-today.md)
  — externally-verifiable observability-envelope snapshot (5×3 axis/runtime
  matrix, updated at every lane close).
- [Sentry observability maximisation plan](../../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — lane-level execution authority for every future observability lane that
  updates this document.
- [ADR-143 Observability Boundary](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
- [ADR-160 Non-Bypassable Redaction Barrier](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
- [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
