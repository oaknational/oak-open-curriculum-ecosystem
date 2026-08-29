# Environment Variables Reference

Complete reference for all environment variables used across the Oak Open Curriculum Ecosystem.

## Changing a deployment environment variable (procedure)

Deployment environment values get none of the review, versioning, or
rollback that code gets, and a change to one is not visible in any diff.
Incident evidence on MCP-475 shows why this surface needs an explicit
procedure. Follow all four steps.

**The supported contract is change → redeploy → verify.** Per Vercel:

> Changes to environment variables are not applied to previous
> deployments, they only apply to new deployments. You must redeploy your
> project to update the value of any variables you change in the
> deployment.
> — [Managing environment variables](https://vercel.com/docs/environment-variables/managing-environment-variables)

This is why an edit is not finished when the dashboard shows it saved.
It is also why the danger is _delayed_ rather than immediate: a bad value
sits harmless until some later deployment — one that may look entirely
routine and carry no indication its configuration moved underneath it.

_(Corrected 2026-08-04: this section previously stated that a change
reaches running deployments without any deployment of your own. The
vendor documents the opposite, and any incident timeline reasoned from
the old claim should be re-derived.)_

1. **Validate the value before entering it.** Run it through the guard
   that will judge it — for the pseudonym keyring, the strict resolver;
   for JSON-shaped values, a parse. A value that has never been
   machine-checked is a value you are pasting on faith. Feed the
   candidate value to the check on stdin or from a gitignored file (a
   workspace `.env.local`) — never as a shell argument, which lands in
   shell history and process listings. A local boot with the candidate
   value in the app's `.env.local` runs the same fail-fast resolution a
   deployment runs — see
   [vercel-environment-config](../../apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md).
2. **Stage replacement settings before removing old ones.** Vercel's
   documented boundary is deployment-based: changing a project setting
   does not mutate an existing deployment, and the next deployment reads
   the settings then in force. Edit in place when the scope is unchanged.
   When splitting one variable into per-environment records, add the new
   records first, deploy and verify the intended environment, and only
   then remove the obsolete setting. This order follows directly from
   the documented change → redeploy boundary.

3. **Redeploy, then check liveness.** Per the contract above a change
   reaches nothing until you redeploy, and a deployment that boots on a
   bad value never self-heals. After any change, confirm `/healthz`
   returns 200, then send an unauthenticated `POST /mcp` with
   `Accept: application/json, text/event-stream`. It must return 401 with
   the app's correct protected-resource-metadata `WWW-Authenticate`
   challenge. A 200, 406, missing challenge, or challenge naming the
   wrong protected-resource metadata URL is a failed verification. This
   step is what makes an environment change complete.
4. **If a deployed surface fails, read the runtime logs before forming
   any theory.** The application's fail-fast messages name the failing
   key and where to correct it. The incident evidence and diagnosis cost
   belong on the linked ticket, not in this repeatable procedure.

Recovery note: a production redeploy is the cure for a poisoned
deployment — outside Vercel's rolled-back state, the build guard admits a
rebuild of the last successfully deployed commit (ADR-163 §10, fourth
amendment). See the production build
guard's [ADR-163 §10 contract](../architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md#10-production-builds-require-a-semantic-release-commit)
for which commits may build. The rolled-back state (after a Vercel
Instant Rollback) behaves differently: a rollback runs no build and
suspends production domain auto-assignment until an explicit Undo
Rollback or promotion; the same ADR section records the vendor-sourced
boundary.

## Credential Policy

The repository policy is:

- Real credentials are only in local workspace `.env` and `.env.local` files.
- Workspace `.env` and `.env.local` files are ignored by git and must never be
  committed.
- Workspace `.env.example` files are placeholders only and must not contain
  live credentials.
- Other tracked files should contain placeholders, fixtures, or comments instead of secrets.

A useful guardrail is to run:

```bash
pnpm secrets:scan:all
```

Reference-document examples under `.agent/reference/` are intentionally
allowed to contain token-like examples; other files must use targeted line-level
exceptions only if required.

## Quick Reference by Contribution Level

| Contribution Level                                      | Required Variables                                          | Optional Variables | Setup Time    |
| ------------------------------------------------------- | ----------------------------------------------------------- | ------------------ | ------------- |
| **Level 1**: Unit tests, type-checking, linting         | None                                                        | None               | 0 minutes     |
| **Level 2**: Local dev servers, integration tests       | `OAK_API_KEY`, `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY` | `LOG_LEVEL`        | 10-15 minutes |
| **Level 3**: Live search and OAuth-backed local testing | `OAK_API_KEY`, `CLERK_*`, `ELASTICSEARCH_*`                 | `SEARCH_API_KEY`   | 1-2 hours     |

> **Note**: `pnpm test:e2e` itself uses mocks and dependency injection
> and does not require credentials. The Level 3 row above covers the
> related but distinct workflows of live search and OAuth-backed local testing — see
> [troubleshooting → E2E Tests Fail](./troubleshooting.md#e2e-tests-fail).

## Workspace Environment Files

Copy the example file for the workspace you are running. There is no root
`.env.example`; root-level onboarding and gates work without credentials.

```bash
# HTTP MCP server
cp apps/oak-curriculum-mcp-streamable-http/.env.example \
  apps/oak-curriculum-mcp-streamable-http/.env.local

# Search CLI
cp apps/oak-search-cli/.env.example apps/oak-search-cli/.env.local
```

### Required for Most Development

| Variable      | Purpose                   | Where to Get                                                                            | Used By                          |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| `OAK_API_KEY` | Access Oak Curriculum API | [Request a free key](https://open-api.thenational.academy/docs/about-oaks-api/api-keys) | SDK, HTTP MCP server, Search app |

### Authentication (HTTP MCP Server)

| Variable                | Purpose                           | Where to Get                                                                       | Used By         |
| ----------------------- | --------------------------------- | ---------------------------------------------------------------------------------- | --------------- |
| `CLERK_PUBLISHABLE_KEY` | OAuth authentication (public key) | [Clerk Dashboard](https://dashboard.clerk.com/) - create app, copy publishable key | HTTP MCP server |
| `CLERK_SECRET_KEY`      | OAuth authentication (secret key) | [Clerk Dashboard](https://dashboard.clerk.com/) - create app, copy secret key      | HTTP MCP server |

### Optional Development

| Variable                          | Purpose                                                                                                                                                                                                                                             | Default                                 | Used By           |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------- |
| `LOG_LEVEL`                       | Logging verbosity (`debug`, `info`, `warn`, `error`)                                                                                                                                                                                                | `info`                                  | Workspace runtime |
| `DANGEROUSLY_DISABLE_AUTH`        | **Local development only** - completely bypasses authentication; rejected in every deployed environment                                                                                                                                             | `false`                                 | HTTP MCP server   |
| `ALLOWED_HOSTS`                   | Comma-separated list of **additional** allowed hostnames, unioned with the auto-detected set — it can add a host, never remove one                                                                                                                  | Auto-detected (localhost or Vercel URL) | HTTP MCP server   |
| `CANONICAL_HOST`                  | Public address the server is reached at when an edge overrides the Host; fixes every self-description URL, and the origin Clerk derives from the forwarded headers                                                                                  | Unset (self-describe per request)       | HTTP MCP server   |
| `OBSERVABILITY_SINKS`             | JSON array selecting observability sinks, e.g. `'["sentry","posthog"]'`; `posthog` requires the full PostHog set below and, in production, at least one diagnostic sink alongside it                                                                | `[]`                                    | HTTP MCP server   |
| `POSTHOG_PROJECT_API_KEY`         | PostHog project ingestion key (`phc_`-class, write-only); required only when `posthog` is selected                                                                                                                                                  | Unset                                   | HTTP MCP server   |
| `POSTHOG_HOST`                    | Must be exactly `https://eu.i.posthog.com` when `posthog` is selected — no other region is accepted                                                                                                                                                 | Unset                                   | HTTP MCP server   |
| `POSTHOG_PSEUDONYM_ACTIVE_KEY_ID` | Id of the keyring entry used for new actor projections; must resolve exactly one entry                                                                                                                                                              | Unset                                   | HTTP MCP server   |
| `POSTHOG_PSEUDONYM_KEYRING`       | JSON array of `{ "id", "key" }` records; each `key` is a 43-char unpadded base64url encoding of exactly 32 bytes (generate with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`), ids and key material unique | Unset                                   | HTTP MCP server   |
| `POSTHOG_CAPTURE_MODE`            | Never supported: any non-empty value fails startup when `posthog` is selected (the capture transport is fixed by the reviewed adapter)                                                                                                              | Unset                                   | HTTP MCP server   |

When `posthog` is selected, the HTTP MCP server also relies on `@vercel/functions` as a runtime dependency: its `waitUntil` hook bounds post-response event delivery on Vercel. The hook needs no environment variable and no local setup — off Vercel the registration is a verified no-op and delivery still settles on the local event loop.

## Workspace-Specific Variables

### Search App (`apps/oak-search-cli/.env.local`)

The search app requires its own `.env.local` file with additional variables for Elasticsearch and natural language search.

#### Required

| Variable                | Purpose                                 | Where to Get                         |
| ----------------------- | --------------------------------------- | ------------------------------------ |
| `ELASTICSEARCH_URL`     | Elasticsearch Serverless HTTPS endpoint | Elasticsearch Cloud console          |
| `ELASTICSEARCH_API_KEY` | API key with manage + search privileges | Elasticsearch Cloud - Create API key |
| `OAK_API_KEY`           | Oak Curriculum API access               | Same key as other workspaces         |
| `SEARCH_API_KEY`        | Shared secret for admin/status routes   | `openssl rand -hex 32`               |
| `SEARCH_INDEX_VERSION`  | Monotonic cache/version tag             | Set manually (e.g., `v2026-03-01`)   |

#### Optional

| Variable                       | Purpose                                  | Default           |
| ------------------------------ | ---------------------------------------- | ----------------- |
| `ZERO_HIT_WEBHOOK_URL`         | Webhook for zero-hit telemetry           | `none` (disabled) |
| `SEARCH_INDEX_TARGET`          | Index namespace                          | `primary`         |
| `ZERO_HIT_PERSISTENCE_ENABLED` | Persist zero-hit events to Elasticsearch | `false`           |

**Complete reference**: See `apps/oak-search-cli/README.md` for detailed setup instructions.

### HTTP MCP Server (`apps/oak-curriculum-mcp-streamable-http/.env.local`)

**Minimal configuration**:

```bash
OAK_API_KEY=your_oak_api_key_here
ELASTICSEARCH_URL=https://your-es-endpoint
ELASTICSEARCH_API_KEY=your_es_api_key
```

**Production configuration** (with OAuth):

```bash
OAK_API_KEY=your_oak_api_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

**Development bypass** (local only):

```bash
OAK_API_KEY=your_oak_api_key_here
DANGEROUSLY_DISABLE_AUTH=true  # Local development only; rejected in deployed environments
```

The rejection is enforced at startup, not merely advised — see the app
README's
[Development Authentication](../../apps/oak-curriculum-mcp-streamable-http/README.md#development-authentication)
section for the enforcement contract.

**Complete reference**: See `apps/oak-curriculum-mcp-streamable-http/README.md` and [`apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`](../../apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md).

## Getting API Keys

### Oak API Key

Request a free API key from Oak's public form:
<https://open-api.thenational.academy/docs/about-oaks-api/api-keys>

Keys do not expire and are available to anyone. No approval process is required.

### Clerk (OAuth for HTTP Server)

1. Sign up at [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Create a new application
3. Navigate to "API Keys" section
4. Copy "Publishable Key" → `CLERK_PUBLISHABLE_KEY`
5. Copy "Secret Key" → `CLERK_SECRET_KEY`
6. Configure allowed redirect URLs for your development environment

### Elasticsearch (Search App)

**For Oak team members**:

1. Access team Elasticsearch Serverless project
2. Copy deployment URL → `ELASTICSEARCH_URL`
3. Create API key with manage + search privileges → `ELASTICSEARCH_API_KEY`

**For external contributors**:

1. Sign up for [Elasticsearch Cloud](https://cloud.elastic.co/)
2. Create a free Serverless project
3. Run `pnpm -C apps/oak-search-cli es:setup` to configure indices
4. Use provided credentials

## Development Without API Keys

Many development tasks work **without any environment variables**:

```bash
pnpm install      # Install dependencies
pnpm test         # Run unit tests
pnpm type-check   # Type checking
pnpm lint         # Linting
pnpm build        # Build packages (SDK, libs)
```

Environment variables are only required for:

- Running dev servers (`pnpm dev`)
- Integration tests that call real APIs
- Live-service workflows in workspaces that still expose them

This allows you to contribute code, tests, and documentation without needing to set up external services.

## Security Best Practices

### Never Commit API Keys

- **DO**: Use `.env` files (gitignored)
- **DO**: Use environment variables
- **DON'T**: Hardcode keys in code
- **DON'T**: Commit `.env` files

### Rotate Keys Regularly

- Rotate production keys every 90 days
- Rotate immediately if exposed
- Use different keys for dev/staging/production

### Minimum Privileges

- Use read-only keys when possible
- Limit Elasticsearch API key to specific indices
- Don't share admin-level keys

### Production Keys

- **NEVER** set `DANGEROUSLY_DISABLE_AUTH=true` in preview or production
- Always use separate production keys
- Monitor key usage for anomalies

## Troubleshooting

### "API key is required but not found"

**Solution**: Ensure you created the workspace `.env.local` file and set
`OAK_API_KEY` there:

```bash
# HTTP MCP server
cp apps/oak-curriculum-mcp-streamable-http/.env.example \
  apps/oak-curriculum-mcp-streamable-http/.env.local

# Search CLI
cp apps/oak-search-cli/.env.example apps/oak-search-cli/.env.local

# Edit the relevant .env.local and add your key
echo "OAK_API_KEY=your_key_here" >> apps/oak-curriculum-mcp-streamable-http/.env.local
```

### "Clerk keys not configured"

**Solution**: Only needed for HTTP server OAuth testing. Can skip for basic development:

```bash
# Option 1: Add Clerk keys
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Option 2: Bypass auth for local dev (rejected in deployed environments)
DANGEROUSLY_DISABLE_AUTH=true
```

### "Elasticsearch connection failed"

**Solution**: Required for search app development and for MCP server startup
when using the current server workspaces. Unit tests, builds, and many SDK-only
tasks do not require Elasticsearch. For local MCP development without a live
cluster, use stub mode where supported.

### Tests fail with "Cannot read environment variable"

**Solution**: Check if you're running integration/E2E tests that need API keys. Unit tests should not require any env vars:

```bash
pnpm test           # Unit tests (no env vars needed)
pnpm test:e2e       # E2E tests (uses mocks and DI — no env vars needed)
```

## Related Documentation

- [Root README Quick Start](../../README.md#quick-start) - Getting started with development
- [Root README](../../README.md) - Repository overview
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines
