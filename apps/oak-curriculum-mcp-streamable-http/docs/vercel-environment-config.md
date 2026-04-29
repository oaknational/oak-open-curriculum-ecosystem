# Vercel Environment Configuration

This reference lists the environment variables and platform settings required to run the Streamable HTTP server on Vercel. Apply the same configuration to both the **Production** and **Preview** environments, with the exceptions noted below.

## Runtime Configuration

- **Runtime**: Node.js (Edge runtimes are not supported)
- **Build Output**: Serve the default `/api` output (no custom `output: export`)
- **Serverless Functions**: No additional configuration required; the server runs as a standard Node server

## Required Environment Variables

| Variable                | Production | Preview | Notes                                                                                                                                                                                                                                                             |
| ----------------------- | ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLERK_PUBLISHABLE_KEY` | ✅         | ✅      | Clerk publishable key for the deployed application                                                                                                                                                                                                                |
| `CLERK_SECRET_KEY`      | ✅         | ✅      | Clerk secret key used by server-side auth middleware                                                                                                                                                                                                              |
| `OAK_API_KEY`           | ✅         | ✅      | Oak Curriculum API key for live data                                                                                                                                                                                                                              |
| `SENTRY_AUTH_TOKEN`     | ✅         | ✅      | Sentry organisation auth token. Required at **build time** by the release-and-deploy orchestrator (ADR-163 §6). Scoped to the `oak-national-academy` org; never commit to `.sentryclirc`. Runtime Sentry SDK does NOT need it — events are delivered via the DSN. |

## Optional Environment Variables

| Variable                               | Default Behaviour                                                                                 | Usage                                                                                                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ALLOWED_HOSTS`                        | Localhost allow-list, or all Vercel deployment URLs + localhost entries if any Vercel URL present | Override to provide a custom DNS allow-list for the DNS-rebinding guard                                                                                                                                                          |
| `REMOTE_MCP_MODE`                      | `stateless` (recommended)                                                                         | See "MCP Transport Modes" section below for detailed explanation                                                                                                                                                                 |
| `LOG_LEVEL`                            | `info`                                                                                            | Useful for smoke harness diagnostics; server-side logging tidy-up tracked in the backlog                                                                                                                                         |
| `DANGEROUSLY_DISABLE_AUTH`             | **Must remain unset/`false`**                                                                     | Local development only; never enable in Vercel environments                                                                                                                                                                      |
| `SENTRY_MODE`                          | `off`                                                                                             | Set to `sentry` for live error capture and tracing (requires DSN, release, sample rate)                                                                                                                                          |
| `SENTRY_DSN`                           | —                                                                                                 | Required when `SENTRY_MODE=sentry`; Sentry project DSN                                                                                                                                                                           |
| `SENTRY_TRACES_SAMPLE_RATE`            | —                                                                                                 | Numeric 0.0–1.0; required for live mode                                                                                                                                                                                          |
| `SENTRY_ENVIRONMENT_OVERRIDE`          | Falls back to `VERCEL_ENV` → `development`                                                        | Explicit override only; `NODE_ENV` is intentionally ignored                                                                                                                                                                      |
| `SENTRY_RELEASE_OVERRIDE`              | Unset                                                                                             | Explicit override only; when absent, ADR-163 derives release from the environment row (production app version, preview branch URL host, or development short SHA)                                                                |
| `APP_VERSION_OVERRIDE`                 | Falls back to the root repo `package.json` version                                                | Explicit override only; build and startup fail if neither yields a valid version                                                                                                                                                 |
| `GIT_SHA_OVERRIDE`                     | Falls back to `VERCEL_GIT_COMMIT_SHA`                                                             | Explicit override only; attached as the `git.commit.sha` Sentry tag and via `releases set-commits`. Never the release identifier. See ADR-163 §2.                                                                                |
| `VERCEL_GIT_COMMIT_REF`                | Consumed read-only from Vercel system env                                                         | Branch name. Required to match `main` before `VERCEL_ENV=production` results in a `production` Sentry environment (ADR-163 §3). Missing branch on a production build is treated as a mislabel guard and downgrades to `preview`. |
| `SENTRY_RELEASE_REGISTRATION_OVERRIDE` | Unset                                                                                             | Set to `1` together with `SENTRY_RELEASE_OVERRIDE` to enable Sentry release + deploy registration from a local context (UAT evidence). One without the other is a startup error. See ADR-163 §4.                                 |
| `SENTRY_ENABLE_LOGS`                   | `true` when live                                                                                  | Enable Sentry structured logs via `Sentry.logger.*` API                                                                                                                                                                          |
| `SENTRY_DEBUG`                         | `false`                                                                                           | Enable Sentry SDK debug output                                                                                                                                                                                                   |

CORS is unconditionally permissive (all origins allowed). Security is enforced by OAuth authentication, not by origin restrictions. There are no CORS-related environment variables to configure.

## Sentry environment derivation (ADR-163 §3 truth table)

The derived Sentry `environment` and release-registration policy are a
function of `VERCEL_ENV` + `VERCEL_GIT_COMMIT_REF`. This table is the
authoritative operator-facing reference; the code source of truth is
`resolveSentryEnvironment` + `resolveSentryRegistrationPolicy` in
`@oaknational/sentry-node`.

| `VERCEL_ENV`  | `VERCEL_GIT_COMMIT_REF` | Sentry `environment` | Release registered? | Warning emitted                       |
| ------------- | ----------------------- | -------------------- | ------------------- | ------------------------------------- |
| `production`  | `main`                  | `production`         | yes                 | —                                     |
| `production`  | any other branch        | `preview`            | yes (as preview)    | `production_env_with_non_main_branch` |
| `production`  | unset / empty           | `preview`            | yes (as preview)    | `production_env_with_missing_branch`  |
| `preview`     | any                     | `preview`            | yes                 | —                                     |
| `development` | any                     | `development`        | no (default)        | —                                     |
| unset         | any                     | `development`        | no                  | —                                     |

The §3 guard downgrades `VERCEL_ENV=production` on a non-`main` branch
to `preview`, so feature-branch preview builds never pollute the
production Sentry bucket. Local-dev registration is enabled only by the
`SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` + `SENTRY_RELEASE_OVERRIDE=<version>`
pair (ADR-163 §4).

## Preview vs Production Notes

- **Preview Deployments**: Configure the same keys as production. Clerk restricts tokens by domain, so ensure preview URLs are present in the Clerk allowlist.
- **Production Deployment**: Mirrors the preview configuration. Provide explicit `ALLOWED_HOSTS` only when you need to extend beyond or replace the defaults derived from Vercel's system environment variables. Production also has a repo-owned ignore-build gate so non-release commits do not create ghost releases under an unchanged semantic-release version.

## Vercel Deployment URLs

Vercel provides three system environment variables for deployment URLs. When deployed on Vercel, all three URLs are automatically included in the allowed hosts for DNS rebinding protection:

| Variable                        | Description                                                | Example                           |
| ------------------------------- | ---------------------------------------------------------- | --------------------------------- |
| `VERCEL_URL`                    | Unique URL for this specific deployment                    | `myapp-abc123.vercel.app`         |
| `VERCEL_BRANCH_URL`             | Branch-specific URL (same for all deployments of a branch) | `myapp-git-feat-oauth.vercel.app` |
| `VERCEL_PROJECT_PRODUCTION_URL` | Production URL (same across all production deployments)    | `myapp.vercel.app`                |

This ensures that:

- Preview deployments work via their unique deployment URL and branch URL
- Production deployments are accessible via the unique deployment URL, production URL, and any custom domains
- You don't need to manually configure `ALLOWED_HOSTS` for standard Vercel deployments

For more information, see [Vercel's System Environment Variables documentation](https://vercel.com/docs/environment-variables/system-environment-variables).

## MCP Transport Modes

The `REMOTE_MCP_MODE` environment variable configures how the MCP transport manages sessions. Understanding this is important for correct deployment configuration.

### Stateless Mode (Default - Recommended for Vercel)

**Value**: `stateless` (or unset, defaults to stateless)

**How it works:**

- No session IDs generated or tracked
- Each request is completely independent
- No server-side state storage required
- Transport initialized with `sessionIdGenerator: undefined`

**CORS Headers (Stateless):**

```text
Allowed Headers: Content-Type, Authorization
Exposed Headers: WWW-Authenticate
```

**Why use stateless mode:**

- ✅ **Perfect for serverless**: No state to maintain between function invocations
- ✅ **Horizontal scaling**: Any instance can handle any request
- ✅ **Vercel compatible**: No session affinity or sticky sessions required
- ✅ **Simpler architecture**: No session storage or validation logic
- ✅ **MCP compliant**: Fully compliant with MCP Streamable HTTP specification

**Recommended for:**

- Vercel deployments (production and preview)
- AWS Lambda, Google Cloud Functions, Azure Functions
- Any serverless or auto-scaling platform
- Stateless RESTful architectures

### Session Mode (Not Recommended for Vercel)

**Value**: `session`

**How it works:**

- Server generates unique session IDs for each client
- Session ID sent via `Mcp-Session-Id` response header
- Client must include `mcp-session-id` request header on subsequent requests
- Server validates session ID and maintains in-memory state
- **Requires persistent server process** (not suitable for serverless)

**CORS Headers (Session):**

```text
Allowed Headers: Content-Type, Authorization, mcp-session-id
Exposed Headers: Mcp-Session-Id, WWW-Authenticate
```

**Why NOT to use session mode on Vercel:**

- ❌ **State lost between invocations**: Serverless functions are ephemeral
- ❌ **No session affinity**: Different requests may hit different instances
- ❌ **Scaling issues**: Requires sticky sessions or shared session storage
- ❌ **Complexity**: Needs session store (Redis, DynamoDB, etc.)

**When to use session mode:**

- Long-running server processes (traditional VPS, dedicated servers)
- Applications requiring server-side state between requests
- Load balancers with sticky session support
- Use cases where you CANNOT use OAuth or other stateless auth

### Current Implementation

The HTTP server uses the **per-request transport pattern**: each incoming request creates a fresh `McpServer` and `StreamableHTTPServerTransport`. This matches the MCP SDK's canonical stateless example and works correctly on Vercel (both cold starts and warm instances).

```typescript
// Per-request factory (from src/application.ts)
const mcpFactory: McpServerFactory = () => {
  const server = new McpServer(
    { name: 'oak-curriculum-http', version: '0.1.0' },
    { instructions: SERVER_INSTRUCTIONS },
  );
  registerHandlers(server, handlerOptions);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  return { server, transport };
};
```

Shared dependencies (Elasticsearch client, runtime configuration) are created once at startup. The `REMOTE_MCP_MODE` environment variable affects which CORS headers are exposed (session mode additionally exposes `Mcp-Session-Id`), not the actual transport behaviour.

### Recommendation

**For all Vercel deployments (production and preview), either:**

1. Leave `REMOTE_MCP_MODE` unset (defaults to stateless), OR
2. Explicitly set `REMOTE_MCP_MODE=stateless`

**Do not set `REMOTE_MCP_MODE=session` on Vercel** - it will not work correctly and may cause unexpected behavior.

## Sentry metadata policy

**Authoritative source**:
[ADR-163 Sentry Release Identifier, Source-Map Attachment, and Vercel
Production Attribution](../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md).

The MCP server intentionally avoids broad fallback chains.

- Environment: `SENTRY_ENVIRONMENT_OVERRIDE` → `VERCEL_ENV` →
  `development`, **constrained by `VERCEL_GIT_COMMIT_REF` for production**
  — a `VERCEL_ENV=production` build from a non-main branch is downgraded
  to `preview`. See the
  [ADR-163 §3 truth table](../../../docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md#3-production-attribution-requires-both-vercel_envproduction-and-vercel_git_commit_refmain).
- Release: `SENTRY_RELEASE_OVERRIDE` → ADR-163 environment projection
  (production-on-`main` app version, preview / production-from-non-main
  `VERCEL_BRANCH_URL` host label, or development `dev-<shortSha>`; never the
  git SHA).
- Git SHA metadata: `GIT_SHA_OVERRIDE` → `VERCEL_GIT_COMMIT_SHA` —
  attached as the `git.commit.sha` Sentry tag, indexed and filterable.
- Local-dev registration override: both
  `SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` and
  `SENTRY_RELEASE_OVERRIDE=<version>` must be set together (ADR-163 §4).

`NODE_ENV` is not used for Sentry environment resolution because deployment
systems frequently override it opaquely. The root repo `package.json` version
is the canonical application version fallback for now. It is updated by the
GitHub `semantic-release` workflow. Production avoids ghost releases by
cancelling builds whose root `package.json` version has not advanced beyond the
previous successful production deployment; preview releases use the branch URL
host label instead of reusing the production semver row.

## Production build gating

`apps/oak-curriculum-mcp-streamable-http/vercel.json` defines an
`ignoreCommand` that runs before the Vercel build:

```json
{
  "ignoreCommand": "node runtime-only-scripts/vercel-ignore-production-non-release-build.mjs"
}
```

The command behaves as follows:

- Preview and development deployments always continue.
- Production continues when the current root repo `package.json` version is
  greater than the previous successful production deployment version.
- Production is cancelled when the version is unchanged or lower.
- If there is no previous successful production deployment yet, production
  continues.

This keeps production aligned with semantic-release commits while still letting
preview deployments exercise newer commits that have not been released yet.

## Verification Checklist

- Repo-owned pre-preview build gate:
  `pnpm -F @oaknational/oak-curriculum-mcp-streamable-http build:sentry:configured`
  proves the configured Sentry esbuild-plugin branch with representative
  preview-style Vercel env. The command now loads its env through the
  canonical resolution pipeline
  (`repo .env` < `repo .env.local` < `app .env` < `app .env.local` <
  `process.env`), so `SENTRY_AUTH_TOKEN` can come from the app-local
  `.env.local` instead of needing an inline shell export. It is
  intentionally outside PR-check/CI per ADR-161 and does not replace
  deployment/preview validation.
- After every configuration change, redeploy and run:
  1. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url https://<deployment-host>/mcp`
  2. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live:auth` (optional but recommended when Clerk settings change)
- Confirm that unauthenticated `POST /mcp` requests return `401` with a `WWW-Authenticate` header, and that the OAuth flow succeeds in an MCP client such as Claude Desktop.
