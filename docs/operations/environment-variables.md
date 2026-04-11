# Environment Variables Reference

Complete reference for all environment variables used across the Oak Open Curriculum Ecosystem.

## Credential Policy

The repository policy is:

- Real credentials are only in local `.env` and `.env.local` files.
- `.env` and `.env.local` are ignored by git and must never be committed.
- `.env.example` files are placeholders only and must not contain live credentials.
- Other tracked files should contain placeholders, fixtures, or comments instead of secrets.

A useful guardrail is to run:

```bash
pnpm secrets:scan:all
```

Reference-document examples under `.agent/reference/` are intentionally
allowed to contain token-like examples; other files must use targeted line-level
exceptions only if required.

## Quick Reference by Contribution Level

| Contribution Level                                         | Required Variables                                          | Optional Variables | Setup Time    |
| ---------------------------------------------------------- | ----------------------------------------------------------- | ------------------ | ------------- |
| **Level 1**: Unit tests, type-checking, linting            | None                                                        | None               | 0 minutes     |
| **Level 2**: Local dev servers, integration tests          | `OAK_API_KEY`, `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY` | `LOG_LEVEL`        | 10-15 minutes |
| **Level 3**: Full E2E, search functionality, OAuth testing | `OAK_API_KEY`, `CLERK_*`, `ELASTICSEARCH_*`                 | `SEARCH_API_KEY`   | 1-2 hours     |

## Monorepo-Wide Variables

Set these in the root `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
# Edit .env with your values
```

### Required for Most Development

| Variable      | Purpose                   | Where to Get                                                                            | Used By                                     |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------- |
| `OAK_API_KEY` | Access Oak Curriculum API | [Request a free key](https://open-api.thenational.academy/docs/about-oaks-api/api-keys) | SDK, MCP servers (stdio & HTTP), Search app |

### Authentication (HTTP MCP Server)

| Variable                | Purpose                           | Where to Get                                                                       | Used By         |
| ----------------------- | --------------------------------- | ---------------------------------------------------------------------------------- | --------------- |
| `CLERK_PUBLISHABLE_KEY` | OAuth authentication (public key) | [Clerk Dashboard](https://dashboard.clerk.com/) - create app, copy publishable key | HTTP MCP server |
| `CLERK_SECRET_KEY`      | OAuth authentication (secret key) | [Clerk Dashboard](https://dashboard.clerk.com/) - create app, copy secret key      | HTTP MCP server |

### Optional Development

| Variable                   | Purpose                                                   | Default                                 | Used By                                   |
| -------------------------- | --------------------------------------------------------- | --------------------------------------- | ----------------------------------------- |
| `LOG_LEVEL`                | Logging verbosity (`debug`, `info`, `warn`, `error`)      | `info`                                  | All apps                                  |
| `DANGEROUSLY_DISABLE_AUTH` | **Development only** - completely bypasses authentication | `false`                                 | HTTP MCP server (NEVER use in production) |
| `ALLOWED_HOSTS`            | Comma-separated list of allowed hostnames                 | Auto-detected (localhost or Vercel URL) | HTTP MCP server                           |
| `SMOKE_REMOTE_BASE_URL`    | Base URL for remote smoke tests                           | -                                       | Smoke tests                               |

## Workspace-Specific Variables

### Search App (`apps/oak-search-cli/.env.local`)

The search app requires its own `.env.local` file with additional variables for Elasticsearch and natural language search.

#### Required

| Variable                | Purpose                                 | Where to Get                         |
| ----------------------- | --------------------------------------- | ------------------------------------ |
| `ELASTICSEARCH_URL`     | Elasticsearch Serverless HTTPS endpoint | Elasticsearch Cloud console          |
| `ELASTICSEARCH_API_KEY` | API key with manage + search privileges | Elasticsearch Cloud - Create API key |
| `OAK_API_KEY`           | Oak Curriculum API access               | Same as root `.env`                  |
| `SEARCH_API_KEY`        | Shared secret for admin/status routes   | `openssl rand -hex 32`               |
| `SEARCH_INDEX_VERSION`  | Monotonic cache/version tag             | Set manually (e.g., `v2026-03-01`)   |

#### Optional

| Variable                       | Purpose                                  | Default           |
| ------------------------------ | ---------------------------------------- | ----------------- |
| `ZERO_HIT_WEBHOOK_URL`         | Webhook for zero-hit telemetry           | `none` (disabled) |
| `SEARCH_INDEX_TARGET`          | Index namespace                          | `primary`         |
| `ZERO_HIT_PERSISTENCE_ENABLED` | Persist zero-hit events to Elasticsearch | `false`           |

**Complete reference**: See `apps/oak-search-cli/README.md` for detailed setup instructions.

### HTTP MCP Server (via root `.env`)

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
DANGEROUSLY_DISABLE_AUTH=true  # NEVER use in production!
```

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
- Smoke tests

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

- **NEVER** set `DANGEROUSLY_DISABLE_AUTH=true` in production
- Always use separate production keys
- Monitor key usage for anomalies

## Troubleshooting

### "API key is required but not found"

**Solution**: Ensure you've created `.env` file and set `OAK_API_KEY`:

```bash
cp .env.example .env
# Edit .env and add your key
echo "OAK_API_KEY=your_key_here" >> .env
```

### "Clerk keys not configured"

**Solution**: Only needed for HTTP server OAuth testing. Can skip for basic development:

```bash
# Option 1: Add Clerk keys
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Option 2: Bypass auth for local dev (NOT for production)
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

- [Quick Start Guide](../foundation/quick-start.md) - Getting started with development
- [Root README](../../README.md) - Repository overview
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines
