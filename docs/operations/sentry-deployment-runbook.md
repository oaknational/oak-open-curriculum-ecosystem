# Sentry Deployment Runbook

How to enable live Sentry error capture and tracing for Oak runtimes.

**Status**: The observability foundation code is in the HTTP MCP server
(PR #73, merged 2026-03-31). Rate limiting is in place (ADR-158).
Search CLI adoption is pending. No Sentry credentials are configured
in `.env.local` or the Vercel dashboard yet — the code defaults to
`SENTRY_MODE=off` (fail-closed, safe). This runbook covers the
operational steps to go from `off` to `sentry` once all code
foundations are in place.

## Prerequisites

- A Sentry organisation with one project **per app** (each app gets its
  own DSN, release stream, and alert rules).
- Access to the deployment platform's environment variable settings
  (Vercel dashboard, CI secrets, or equivalent).

## Step 1: Create Sentry Projects

1. Log in to [sentry.io](https://sentry.io).
2. Create a **separate project** for each runtime:
   - `oak-curriculum-mcp-streamable-http` (platform: Node.js)
   - `oak-search-cli` (platform: Node.js) — when adoption is complete
3. Note each project's **DSN** from Project Settings > Client Keys.

Each app uses its own DSN so issues, traces, and logs are isolated per
service.

## Step 2: Configure Environment Variables

Set the following **per app** in the deployment platform:

### HTTP MCP server (Vercel)

In the Vercel dashboard under Settings > Environment Variables:

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

**Note**: Search CLI Sentry adoption is not yet wired. These variables
will be consumed once the `search-cli-adoption` work is complete.

## Step 3: Verify Release and Source Maps

Sentry needs source maps to show readable stack traces:

1. Ensure `SENTRY_RELEASE` resolves to the deployed commit SHA.
2. Upload source maps using the Sentry CLI or a build plugin.
3. Confirm in Sentry UI: Settings > Source Maps > the release shows
   uploaded artefacts.

Source map upload is not yet automated in CI. This is tracked as part
of the `deployment-and-evidence` todo in the execution plan.

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
- [Logging Guidance](../governance/logging-guidance.md)
- [Vercel Environment Configuration](../../apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md)
- [Production Debugging Runbook](./production-debugging-runbook.md)
