# Sentry Deployment Runbook

How to enable live Sentry error capture and tracing for Oak runtimes.

**Status**: The observability foundation code is in the HTTP MCP server
(PR #73, merged 2026-03-31). Rate limiting is in place (ADR-158).
Search CLI adoption is complete (2026-04-12). Local `.env.local`
credentials are provisioned for the HTTP MCP server (2026-04-12).
Vercel dashboard credentials are pending — set them at
<https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/settings/environment-variables>.
This runbook covers the operational steps to go from `off` to `sentry`.

## Prerequisites

- A Sentry organisation with one project **per app** (each app gets its
  own DSN, release stream, and alert rules).
- Access to the deployment platform's environment variable settings
  (Vercel dashboard, CI secrets, or equivalent).

## Step 1: Create Sentry Projects

1. Log in to [sentry.io](https://sentry.io).
2. Create a **separate project** for each runtime:
   - `oak-open-curriculum-mcp` (platform: Node.js) — HTTP MCP server
   - `oak-open-curriculum-search-cli` (platform: Node.js) — Search CLI
3. Note each project's **DSN** from Project Settings > Client Keys.

Each app uses its own DSN so issues, traces, and logs are isolated per
service.

## Step 2: Configure Environment Variables

Set the following **per app** in the deployment platform:

### HTTP MCP server (Vercel)

In the [Vercel dashboard](https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/settings/environment-variables) under Settings > Environment Variables:

| Variable                    | Value                | Notes                                  |
| --------------------------- | -------------------- | -------------------------------------- |
| `SENTRY_MODE`               | `sentry`             | Enables live Sentry                    |
| `SENTRY_DSN`                | `https://public@...` | HTTP server project DSN from Step 1    |
| `SENTRY_TRACES_SAMPLE_RATE` | `1.0`                | Start at 1.0, reduce if volume is high |

Auto-resolved (no need to set on Vercel):

| Variable             | Falls back to           |
| -------------------- | ----------------------- |
| `SENTRY_RELEASE`     | `VERCEL_GIT_COMMIT_SHA` |
| `SENTRY_ENVIRONMENT` | `VERCEL_ENV`            |

Optional:

| Variable             | Default | Notes                                     |
| -------------------- | ------- | ----------------------------------------- |
| `SENTRY_ENABLE_LOGS` | `true`  | Structured logs via `Sentry.logger.*` API |
| `SENTRY_DEBUG`       | `false` | Enable temporarily for troubleshooting    |

**Do not set** `SENTRY_SEND_DEFAULT_PII=true`. The code rejects this
at startup to prevent accidental PII collection.

### Search CLI

Set in the execution environment (CI, local `.env.local`, or shell):

| Variable                    | Value                                      |
| --------------------------- | ------------------------------------------ |
| `SENTRY_MODE`               | `sentry`                                   |
| `SENTRY_DSN`                | Search CLI project DSN from Step 1         |
| `SENTRY_RELEASE`            | Set explicitly (no Vercel auto-resolution) |
| `SENTRY_TRACES_SAMPLE_RATE` | `1.0`                                      |

**Note**: Search CLI Sentry adoption is complete (2026-04-12). Local
`.env.local` credentials provisioned. The Search CLI has no Vercel
deployment — credentials are set via local `.env.local` or CI env.

## Step 3: Verify Release and Source Maps

Sentry needs source maps with embedded Debug IDs to show readable
stack traces. The canonical upstream flow is a two-step CLI pipeline
(`sourcemaps inject` then `sourcemaps upload`), which the wrapper
script performs automatically. See
[Sentry CLI Usage](./sentry-cli-usage.md) for the full CLI split,
`.sentryclirc` composition rules, artefact-bundle-vs-release model,
and troubleshooting.

1. Ensure `SENTRY_RELEASE` resolves to the deployed commit SHA.
2. Run the workspace-local wrapper to inject Debug IDs and upload the
   artefact bundle:
   [`upload-sourcemaps.sh`](../../apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh).
   The script fails fast if Debug ID injection did not produce at
   least one `//# debugId=` comment in `dist/`.
3. Confirm in Sentry UI: **Project Settings → Source Maps → Artifact
   Bundles** — this is the authoritative Debug-ID-keyed surface and is
   the primary evidence that symbolication will resolve at event time.
   Release visibility (Releases → source maps on the release page) is
   a secondary, convenience check — useful when `--release` is passed
   but NOT a substitute for the Artifact Bundles listing, because the
   match key at event time is the Debug ID, not the release string.

Source map upload is automated for local evidence generation via
`RELEASE=<tag> pnpm sourcemaps:upload` inside
`apps/oak-curriculum-mcp-streamable-http`. CI-triggered upload on
Vercel deploys is still tracked as part of the
`deployment-and-evidence` todo in the execution plan.

## Step 4: Deploy and Smoke Test

1. Deploy with the new environment variables.
2. Run the remote smoke test:

   ```bash
   pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http \
     smoke:remote --remote-base-url https://<deployment-host>/mcp
   ```

3. Check Sentry UI for:
   - **Issues**: no new issues from normal operation
   - **Performance**: traces under the correct service name and release
   - **Logs**: structured entries with `otel.attributes.*` and
     `otel.resource.*` prefixed attributes (if `SENTRY_ENABLE_LOGS` is
     enabled)

## Step 5: Configure Alerting

1. Set up alert rules per project in Sentry:
   - New issue alert (first occurrence)
   - Spike alert (volume threshold)
   - Performance alert (p95 latency threshold)
2. Route alerts to the appropriate channel (Slack, email, PagerDuty).

## Rollback

Set `SENTRY_MODE=off` (or remove the variable) and redeploy. The
runtime creates a noop observability bundle with no Sentry network
calls. No code change required.

## Vercel Log Drains as an Alternative

Vercel offers native [Log Drains](https://vercel.com/docs/observability/log-drains)
that can forward structured logs to Sentry without the Sentry SDK
running in the application process. This avoids SDK initialisation
overhead in serverless cold starts and removes the `@sentry/node`
dependency from the runtime bundle.

The current implementation uses the SDK approach because it provides
richer capabilities (error grouping, stack traces with source maps,
OTel span correlation, `beforeSend` redaction hooks). If the SDK
overhead proves problematic in production, Vercel Log Drains should
be evaluated as a lighter alternative — particularly for structured
log forwarding, which could complement or replace `SENTRY_ENABLE_LOGS`.

This is a future evaluation, not a current recommendation.

## What the Code Does in Each Mode

| Mode      | Sentry SDK           | Logger sinks             | Error capture           | Spans                    | Flush                     |
| --------- | -------------------- | ------------------------ | ----------------------- | ------------------------ | ------------------------- |
| `off`     | Not initialised      | stdout only              | Noop                    | Synthetic (context only) | Noop                      |
| `fixture` | Not initialised      | stdout + in-memory store | In-memory store         | Synthetic (context only) | Noop                      |
| `sentry`  | Initialised with DSN | stdout + Sentry logger   | Live `captureException` | Real OTel spans          | Bounded flush at shutdown |

## Observability Boundary

Sentry observability covers the **server-side Node.js process only**:
tool execution, resource serving, MCP protocol handling, and upstream
API calls.

The MCP server also serves React-based MCP App UIs as encoded HTML
strings via `ui://` resources. These widgets render inside sandboxed
iframes in the consuming MCP host (e.g. Claude Desktop) — they execute
in the host's browser context, not in the Node.js server process.
**Client-side errors within rendered MCP App views are not captured by
this Sentry integration.** If client-side widget observability is needed
in future, it would require a separate browser Sentry SDK initialised
within the widget HTML — a distinct workstream requiring its own ADR.

## Known Deviations from Canonical Sentry

The Oak integration wraps `@sentry/node` behind a DI adapter
(`@oaknational/sentry-node`) for testability and redaction safety.
This deviates from the canonical Sentry setup in several documented
ways. See
`.agent/plans/architecture-and-infrastructure/archive/completed/sentry-canonical-alignment.plan.md`
for the full gap analysis and remediation plan (completed 2026-04-17,
archived on the same date).

Key facts verified against official Sentry docs (2026-04-12):

- **Express error handler ordering**: `setupExpressErrorHandler` must
  be registered BEFORE other error middleware (not after).
- **Isolation scopes**: `@sentry/node` v8+ auto-forks an isolation
  scope per Express request. Ambient `setUser()`/`setTag()` are safe
  in concurrent Express — no `withScope` wrapper needed.
- **`tracePropagationTargets: []`** is an active opt-out of the SDK
  default (which propagates to all outbound requests).
- **Debug IDs**: Sentry now uses build-injected Debug IDs for source
  map matching, not release-string-based matching.
- **`Sentry.close()`** is more appropriate than `flush()` for
  short-lived CLI processes (drains transport and prevents further
  sends).

## Redaction

All telemetry passes through a shared redaction barrier before leaving
the process:

- Keys in `FULLY_REDACTED_KEYS` (tokens, secrets, API keys, DSN,
  cookies, authorisation headers)
- URL username/password credentials
- `/mcp` request payloads (stripped to method + route metadata only)
- Sentry breadcrumbs for MCP routes (stripped to method + route)

See `packages/core/observability/src/redaction.ts` and
`apps/oak-curriculum-mcp-streamable-http/src/observability/sanitise-mcp-events.ts`.

## Related Documentation

- [ADR-143: Coherent Structured Fan-Out](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
- [ADR-159: Per-Workspace Vendor CLI Ownership](../architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)
- [Sentry CLI Usage](./sentry-cli-usage.md)
- [Logging Guidance](../governance/logging-guidance.md)
- [Vercel Environment Configuration](../../apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md)
- [Production Debugging Runbook](./production-debugging-runbook.md)
