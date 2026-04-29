# Sentry Deployment Runbook

How to enable live Sentry error capture and tracing for Oak runtimes.

**Status**: The observability foundation code is in the HTTP MCP server
(PR #73, merged 2026-03-31). Rate limiting is in place (ADR-158).
Search CLI adoption is complete (2026-04-12). Local `.env.local`
credentials are provisioned for the HTTP MCP server (2026-04-12).
L-7 release + commits + deploy linkage landed 2026-04-20 as a bespoke
TypeScript orchestrator wrapping `sentry-cli`. **§L-8 (2026-04-21)
replaces that orchestrator with the vendor's first-party
`@sentry/esbuild-plugin`** running inside the MCP app's esbuild
composition root; the bespoke orchestrator and its `upload-sourcemaps.sh`
wrapper are deleted. Vercel runs the workspace's default `build` script
(no `buildCommand` override). See ADR-163 §6 amendment 2026-04-21
(HOW → WHAT outcomes) and §7 amendment 2026-04-21 (composition root
replaces orchestrator). Set Vercel environment variables at
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

**Sensitivity note: `SENTRY_DSN` is a public identifier, not a secret.**
Per [the Sentry DSN documentation](https://docs.sentry.io/concepts/key-terms/dsn-explainer/),
the DSN is intentionally embeddable in client code and contains only a
public key and a project identifier — it grants ingest-only authority,
not read or admin access. On Vercel, set `SENTRY_DSN` as a regular
(non-Sensitive) environment variable; the `SENTRY_AUTH_TOKEN` and any
Slack/PagerDuty integration tokens remain Sensitive. Treating DSN as a
secret is a documentation defect that propagates incorrect handling
elsewhere.

Set the following **per app** in the deployment platform:

### HTTP MCP server (Vercel)

In the [Vercel dashboard](https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/settings/environment-variables) under Settings > Environment Variables:

| Variable                    | Value                | Notes                                                                                                                 |
| --------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `SENTRY_MODE`               | `sentry`             | Enables live Sentry                                                                                                   |
| `SENTRY_DSN`                | `https://public@...` | HTTP server project DSN from Step 1                                                                                   |
| `SENTRY_TRACES_SAMPLE_RATE` | `1.0`                | Start at 1.0, reduce if volume is high                                                                                |
| `SENTRY_AUTH_TOKEN`         | `sntrys-...`         | Organisation auth token. Required at **build time** by `@sentry/esbuild-plugin`. See ADR-163 §6 (amended 2026-04-21). |

Auto-resolved (no need to set on Vercel):

| Variable             | Falls back to                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SENTRY_RELEASE`     | ADR-163 per-environment release projection: production-on-`main` uses resolved app semver; preview / production-from-non-main uses the `VERCEL_BRANCH_URL` host label; development uses `dev-<shortSha>`; `SENTRY_RELEASE_OVERRIDE` wins first. **Not** the git SHA — the SHA is metadata, attached separately. See [ADR-163](../architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md) §1–§2. |
| `SENTRY_ENVIRONMENT` | `VERCEL_ENV` **constrained by** `VERCEL_GIT_COMMIT_REF` per the [ADR-163 §3 truth table](../architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md#3-production-attribution-requires-both-vercel_envproduction-and-vercel_git_commit_refmain). A `VERCEL_ENV=production` build from a non-main branch is downgraded to `preview`.                                                               |
| git SHA (Sentry tag) | `VERCEL_GIT_COMMIT_SHA` — attached to every event as the `git.commit.sha` Sentry tag, and to the release itself via `@sentry/esbuild-plugin`'s `release.setCommits.commit` field (with `repo` pinned to the monorepo literal `oaknational/oak-open-curriculum-ecosystem`).                                                                                                                                                                       |

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
stack traces. As of §L-8 (2026-04-21) the canonical mechanism is the
vendor's [`@sentry/esbuild-plugin`](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/esbuild/),
configured by the MCP app's esbuild composition root and run inside
the Vercel Build Command. The plugin performs Debug-ID injection and
artefact-bundle upload as library operations during the build itself
(no separate CLI step). See [Sentry CLI Usage](./sentry-cli-usage.md)
for the historical CLI split, `.sentryclirc` composition rules, and
the artefact-bundle-vs-release model that still describes the resulting
Sentry-side state.

1. Ensure `SENTRY_RELEASE` resolves to the ADR-163 release row for the
   deployment being inspected. The SHA is attached separately as a Sentry tag and via
   `releases set-commits`. See
   [ADR-163 §1–§2](../architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md).
2. The MCP app's `build` script automatically invokes
   [`esbuild.config.ts`](../../apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts),
   which conditionally injects `@sentry/esbuild-plugin` based on the
   ADR-163 §3 / §4 policy (resolved by
   [`build-scripts/sentry-build-plugin.ts`](../../apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-plugin.ts)).
   When the policy says "register", the plugin embeds Debug IDs into
   each `.js` and matching `.map` under `dist/` and uploads the
   artefact bundle keyed by those Debug IDs.
3. Confirm in Sentry UI: **Project Settings → Source Maps → Artifact
   Bundles** — this is the authoritative Debug-ID-keyed surface and is
   the primary evidence that symbolication will resolve at event time.
   Release visibility (Releases → source maps on the release page) is
   a secondary, convenience check — useful when `release.name` is
   configured (which it is, per `createSentryBuildPlugin`) but NOT a
   substitute for the Artifact Bundles listing, because the match key
   at event time is the Debug ID, not the release string.

Local evidence generation: set
`SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` plus
`SENTRY_RELEASE_OVERRIDE=<version>` (and a valid `SENTRY_AUTH_TOKEN`)
and run `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http
build`. The composition root will exercise the same sequence the
Vercel Build Command uses. Leaving the override pair unset in dev skips
the plugin entirely and just produces `dist/` with hidden source-maps.

## Step 3b: Release → commit → deploy linkage (Vercel build-time)

**Authoritative mechanism**:
[ADR-163: Sentry Release Identifier, Source-Map Attachment, and Vercel
Production Attribution](../architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md).
This section transcribes ADR-163 for operational use; if this section
and ADR-163 disagree, the ADR wins.

**Preceding GitHub + Vercel machinery — already wired**:

1. `.github/workflows/release.yml` runs `semantic-release` on
   successful CI on `main`. `semantic-release` bumps the root
   `package.json` version and creates a commit back to `main`.
2. `apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/vercel-ignore-production-non-release-build.mjs`
   is wired as `ignoreCommand` in the workspace `vercel.json`. It
   cancels production builds that do not advance the root
   `package.json` version beyond the previous successful production
   deployment.

Net effect: Vercel's production Build Command only ever runs on a
`semantic-release` version-bump commit. Preview builds run on every
commit pushed to a branch with an open PR.

**Inside the Vercel Build Command** (§L-8, 2026-04-21 onwards): Vercel
runs the workspace's default `build` script (no `vercel.json`
`buildCommand` override). The script invokes
[`esbuild.config.ts`](../../apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts)
via `tsx`. The composition root reads `process.env`, asks
`createSentryBuildPlugin` to map ADR-163 §3 / §4 policy onto the
plugin's input shape, and conditionally injects
`@sentry/esbuild-plugin` into the esbuild build options. The plugin
then performs every step listed in ADR-163 §6.0–§6.6 (release upsert,
explicit `--commit org/repo@sha` form, Debug-ID injection, artefact
upload, finalize, deploy event) as library calls during the build.

The §6.0 idempotency posture is preserved by the plugin's release
upsert behaviour: re-running the same release identity is a no-op and
the original deploy's commit attribution survives Vercel manual
redeploys (ADR-163 §5).

Plugin configuration shape (read alongside ADR-163 §6 amendment
2026-04-21):

```typescript
sentryEsbuildPlugin({
  org: 'oak-national-academy',
  project: 'oak-open-curriculum-mcp',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: {
    name: RELEASE, // ADR-163 per-environment release projection
    finalize: true, // §6.5
    setCommits: {
      auto: false, // §6.2 — explicit form, --auto rejected by ADR-163 Alt 8
      commit: VERCEL_GIT_COMMIT_SHA,
      repo: 'oaknational/oak-open-curriculum-ecosystem',
    },
    deploy: { env: DERIVED_ENV }, // §6.6 — env from resolveSentryEnvironment
  },
  sourcemaps: {
    filesToDeleteAfterUpload: ['dist/**/*.js.map'], // strip .map post-upload
  },
  telemetry: false,
});
```

When the policy short-circuits (`registerRelease=false` in dev without
the override pair), the composition root logs `[esbuild.config] Sentry
plugin skipped: registration_disabled_by_policy` and runs `esbuild.build`
with no plugin — the build still produces `dist/` with hidden
source-maps.

**Environment-attribution rule** (ADR-163 §3):

| `VERCEL_ENV`  | `VERCEL_GIT_COMMIT_REF` | Sentry environment | Registered? | Warning              |
| ------------- | ----------------------- | ------------------ | ----------- | -------------------- |
| `production`  | `main`                  | `production`       | yes         | no                   |
| `production`  | any other / missing     | `preview`          | yes         | yes (mislabel guard) |
| `preview`     | any                     | `preview`          | yes         | no                   |
| `development` | any                     | `development`      | no          | no                   |
| unset         | any                     | `development`      | no          | no                   |

Local-dev builds skip registration unless BOTH
`SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` AND `SENTRY_RELEASE_OVERRIDE=<version>`
are set (ADR-163 §4).

**Grepping composition-root output in Vercel build logs**:

The esbuild composition root emits two stdout patterns at boundary
crossings; everything else comes from `@sentry/esbuild-plugin` itself
on stdout/stderr (vendor-controlled format). These form the operational
contract for troubleshooting:

| Pattern                                                                            | Channel       | Meaning                                                                                                                                                                        |
| ---------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[esbuild.config] Sentry plugin skipped: registration_disabled_by_policy`          | stdout        | `createSentryBuildPlugin` returned `kind=disabled` per ADR-163 §3 / §4 policy (dev without override pair). No-op.                                                              |
| `[esbuild.config] Sentry plugin enabled: release=<ver> env=<env>`                  | stdout        | Plugin injected with the resolved release name and environment. Vendor logs follow on stdout/stderr.                                                                           |
| `[esbuild.config] Sentry build-plugin intent error: { kind: '<k>', ... }`          | stderr        | Boundary read failed (missing `SENTRY_AUTH_TOKEN`, app version / branch URL for the selected release row, or commit SHA in a registered env). Build aborts with non-zero exit. |
| Vendor `@sentry/esbuild-plugin` log lines about release upsert / source-map upload | stdout/stderr | Vendor-controlled output covering the §6.0–§6.6 outcomes (release create-or-update, set-commits, debug-id injection, artefact upload, finalize, deploy event).                 |

**Verification**:

1. `sentry api organizations/oak-national-academy/releases/<release-name>/commits/`
   lists the build-commit under the release.
2. `sentry api organizations/oak-national-academy/releases/<release-name>/deploys/`
   lists the deploy for the resolved environment.
3. One release entry in the Sentry UI covers both preview and
   production deploys of the same version (one release → many
   deploys).

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

For the authoritative locus of the non-bypassable redaction barrier (ADR-160)
and the `SentryRedactionHooks` wiring, see
[`packages/libs/sentry-node/README.md § Redaction barrier (ADR-160)`](../../packages/libs/sentry-node/README.md#redaction-barrier-adr-160)
and
[`apps/oak-curriculum-mcp-streamable-http/docs/observability.md § Redaction barrier entry points`](../../apps/oak-curriculum-mcp-streamable-http/docs/observability.md#redaction-barrier-entry-points).

Operationally, all telemetry passes through the barrier before leaving
the process:

- Keys in `FULLY_REDACTED_KEYS` (tokens, secrets, API keys, DSN,
  cookies, authorisation headers)
- URL username/password credentials
- `/mcp` request payloads (method + route metadata retained; other fields
  deny-list-masked)
- Sentry breadcrumbs for MCP routes (method + route retained)

## Related Documentation

- [ADR-143: Coherent Structured Fan-Out](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
- [ADR-159: Per-Workspace Vendor CLI Ownership](../architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)
- [Sentry CLI Usage](./sentry-cli-usage.md)
- [Logging Guidance](../governance/logging-guidance.md)
- [Vercel Environment Configuration](../../apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md)
- [Production Debugging Runbook](./production-debugging-runbook.md)
