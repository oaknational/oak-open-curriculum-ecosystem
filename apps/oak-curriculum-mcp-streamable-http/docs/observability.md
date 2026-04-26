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
  config.env.SENTRY_MODE === 'sentry' ? setupExpressErrorHandler : undefined,
```

The handler function is **DI-injected**: the app layer passes
`setupExpressErrorHandler` from `@sentry/node` in production, or `undefined`
in `off` / `fixture` modes. Tests inject a recording fake and assert on its invocation,
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
reads `process.env` once at the boundary; pure helpers project app-version
identity into the Sentry build env, build Oak-owned esbuild options, and map
env → registration intent:
[`build-scripts/sentry-build-environment.ts`](../build-scripts/sentry-build-environment.ts),
[`build-scripts/esbuild-config.ts`](../build-scripts/esbuild-config.ts), and
[`build-scripts/sentry-build-plugin.ts`](../build-scripts/sentry-build-plugin.ts).
Those helpers take env or env-derived literals as typed parameters so the
ADR-163 policy logic stays test-driven.

Leaving the local-dev override pair unset skips the plugin entirely
(the build runs and produces `dist/` with hidden source-maps but does not
talk to Sentry). Set `SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` together with
`SENTRY_RELEASE_OVERRIDE=<version>` to force a local registration rehearsal
per ADR-163 §4.

The plugin runs only in the Vercel Build Command — never in PR-check CI,
which remains network-free per ADR-161. Operational flow + log-grep
patterns: [sentry-deployment-runbook.md § 3b](../../../docs/operations/sentry-deployment-runbook.md).

**Repo-owned pre-preview gate:** `pnpm -F @oaknational/oak-curriculum-mcp-streamable-http build:sentry:configured`
loads env through the canonical resolution pipeline
(`repo .env` < `repo .env.local` < `app .env` < `app .env.local` <
`process.env`), seeds representative preview-style Vercel env when those
fields are absent, runs `esbuild.config.ts`, and fails unless the build logs
show `[esbuild.config] Sentry plugin enabled:` while omitting
`registration_disabled_by_policy` and `auth_token_missing`. This is an app-
local proof that the configured esbuild-plugin path still wires correctly; it
is not PR-check/CI coverage and it is not deployment or preview proof.

Historical note: the L-7 lane (2026-04-20) used a bespoke four-file
TypeScript orchestrator (`build-scripts/sentry-release-and-deploy-cli.ts`
and friends) wrapping `sentry-cli` invocations, plus a
`scripts/upload-sourcemaps.sh` wrapper. All of those files are deleted by
§L-8 WS2.3 in favour of the vendor's first-party plugin. See ADR-163 §6
amendment 2026-04-21 (HOW → WHAT) and §7 amendment 2026-04-21 (composition
root replaces orchestrator script) for the full reframing.

## Issue grouping by error class (custom fingerprinting)

The MCP HTTP server's `beforeSend` chain runs `applyFingerprint`
AFTER the redaction barrier so known error families get a stable,
class-keyed Sentry fingerprint. This locks issue grouping to domain
semantics rather than stack-trace coincidence.

Current families and the fingerprint table live in
[`packages/libs/sentry-node/README.md` § Fingerprinting](../../../packages/libs/sentry-node/README.md#fingerprinting-locked-grouping-for-known-error-families-l-imm-sub-item-1).
See that file for the addition pattern when a new error family
needs locked grouping.

## Vercel ↔ Sentry Marketplace integration — verification PENDING

**Status (2026-04-26 L-IMM Sub-item 6)**: VERIFICATION PENDING —
requires Vercel project-settings access. The agent landing this
plan cannot inspect Vercel's UI; this section captures the surface
the owner inspects to close the verification.

**Why this matters.** Sentry has two ways to provision DSN /
auth-token / release-attribution metadata for a Vercel project:

1. **Vercel ↔ Sentry Marketplace integration** (auto-provisioning).
   Connecting the integration in Vercel project settings injects
   `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_PROJECT`,
   `SENTRY_ORG`, and related env vars into preview + production
   environments without manual configuration.
2. **Hand-rolled `SENTRY_*` env-var pass-through** (current shape).
   The repo declares the env vars as Vercel project settings and
   relies on Turbo's task-env pass-through (commit `216a7fd2` —
   `fix(turbo): pass SENTRY_* env vars through to build tasks`) to
   make them visible during the Vercel build command. This is the
   shape that produced today's working Sentry integration on this
   branch.

The two are not mutually exclusive — the Marketplace integration
is one source of the env vars; hand-rolled values can override or
supplement it. The verification confirms which source is
authoritative today and whether any redundancy exists.

**Inspection steps for the owner**:

1. Open Vercel project settings for `oak-open-curriculum-mcp` →
   **Integrations** tab.
2. Note whether Sentry appears under installed integrations.
   - If yes: record which env vars it auto-provisions and which
     environments (preview / production / development) it covers.
   - If no: confirm hand-rolled env vars are the sole source.
3. Cross-reference against the env-var list visible in
   **Settings → Environment Variables**: any value that matches a
   Marketplace-managed key is duplicate / overridden.
4. Cross-reference against
   [`vercel.json`](../vercel.json) and the workspace's
   [`package.json`](../package.json) build scripts to confirm none
   of them assume the integration is connected.

**Deliverable on completion**: replace this section with a
paragraph naming the verified state (Marketplace-connected vs
hand-rolled) plus rationale. If Marketplace is connected, document
which env vars it manages and the override precedence. If not,
document why hand-rolled was kept (typical reasons: scoping
control, audit trail, integration-version stability).

**Related context**:

- The lane plan body lives in
  [`active/sentry-observability-maximisation-mcp.plan.md`](../../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  § L-IMM Sub-item 6.
- The execution wrapper that gates closure on this verification
  lives in
  [`archive/completed/sentry-immediate-next-steps.plan.md`](../../../.agent/plans/observability/archive/completed/sentry-immediate-next-steps.plan.md)
  Tier 3d.
- The L-IMM lane closes on 5/6 with this item PENDING per owner
  direction at plan-time (2026-04-26).

## Release and metadata resolution

**Authoritative source**:
[ADR-163 Sentry Release Identifier, Source-Map Attachment, and Vercel
Production Attribution](../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md).

Environment resolves at startup; Sentry release resolves only for live/fixture
Sentry modes and for build-time release registration:

- **Release = ADR-163 per-environment projection.** `SENTRY_RELEASE_OVERRIDE`
  wins first. Otherwise production-on-`main` uses the resolved application
  version, preview / production-from-non-main uses the `VERCEL_BRANCH_URL`
  host label, and development uses `dev-<shortSha>`. See ADR-163 §1.
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

Invalid override values and missing application version are startup errors
where that identity is required (fail-fast, not silent drift). `SENTRY_MODE=off`
does not require Sentry release metadata.

The root package version is only bumped by the `semantic-release`
workflow (`.github/workflows/release.yml`). Preview and local builds
can legitimately contain commits newer than the current production
version; their Sentry release is not the production semver row. On
Vercel production, repo-owned build gating cancels non-
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
