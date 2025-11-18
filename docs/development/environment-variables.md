# Environment Variables Reference

Complete reference for all environment variables used across the Oak MCP Ecosystem.

## Quick Reference by Contribution Level

| Contribution Level                                         | Required Variables                          | Optional Variables                                   | Setup Time    |
| ---------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------- | ------------- |
| **Level 1**: Unit tests, type-checking, linting            | None                                        | None                                                 | 0 minutes     |
| **Level 2**: Local dev servers, integration tests          | `OAK_API_KEY`                               | `LOG_LEVEL`                                          | 10-15 minutes |
| **Level 3**: Full E2E, search functionality, OAuth testing | `OAK_API_KEY`, `CLERK_*`, `ELASTICSEARCH_*` | `OPENAI_API_KEY`, `SEARCH_API_KEY`, `NOTION_API_KEY` | 1-2 hours     |

## Monorepo-Wide Variables

Set these in the root `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
# Edit .env with your values
```

### Required for Most Development

| Variable      | Purpose                   | Where to Get                                               | Used By                                     |
| ------------- | ------------------------- | ---------------------------------------------------------- | ------------------------------------------- |
| `OAK_API_KEY` | Access Oak Curriculum API | Contact Oak National Academy team or use provided test key | SDK, MCP servers (stdio & HTTP), Search app |

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
| `ALLOWED_ORIGINS`          | Comma-separated CORS origins                              | Auto-detected                           | HTTP MCP server                           |
| `SMOKE_REMOTE_BASE_URL`    | Base URL for remote smoke tests                           | -                                       | Smoke tests                               |

### Architectural Reference (Optional)

| Variable         | Purpose                                           | Where to Get                                                 | Used By                                |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------- |
| `NOTION_API_KEY` | Notion integration (architectural reference only) | [Notion Integrations](https://www.notion.so/my-integrations) | Notion MCP server (optional workspace) |

> **Note**: The Notion MCP server is an architectural reference to demonstrate the OpenAPI→SDK→MCP pattern's generality. It is **not required** for core development.

## Workspace-Specific Variables

### Search App (`apps/oak-open-curriculum-semantic-search/.env.local`)

The search app requires its own `.env.local` file with additional variables for Elasticsearch and natural language search.

#### Required

| Variable                | Purpose                                 | Where to Get                         |
| ----------------------- | --------------------------------------- | ------------------------------------ |
| `ELASTICSEARCH_URL`     | Elasticsearch Serverless HTTPS endpoint | Elasticsearch Cloud console          |
| `ELASTICSEARCH_API_KEY` | API key with manage + search privileges | Elasticsearch Cloud - Create API key |
| `OAK_API_KEY`           | Oak Curriculum API access               | Same as root `.env`                  |
| `SEARCH_API_KEY`        | Shared secret for admin/status routes   | Generate secure random string        |
| `SEARCH_INDEX_VERSION`  | Monotonic cache/version tag             | Set manually (e.g., `v2025-03-16`)   |
| `AI_PROVIDER`           | AI provider for natural language search | `openai` or `none`                   |

#### Optional

| Variable                            | Purpose                                  | Default           |
| ----------------------------------- | ---------------------------------------- | ----------------- |
| `OPENAI_API_KEY`                    | Required when `AI_PROVIDER=openai`       | -                 |
| `ZERO_HIT_WEBHOOK_URL`              | Webhook for zero-hit telemetry           | `none` (disabled) |
| `SEARCH_INDEX_TARGET`               | Index namespace                          | `primary`         |
| `ZERO_HIT_PERSISTENCE_ENABLED`      | Persist zero-hit events to Elasticsearch | `false`           |
| `SEMANTIC_SEARCH_USE_FIXTURES`      | Enable fixture mode for testing          | `live`            |
| `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE` | Show fixture toggle in UI                | `false`           |

**Complete reference**: See `apps/oak-open-curriculum-semantic-search/README.md` for detailed setup instructions.

### HTTP MCP Server (via root `.env`)

**Minimal configuration**:

```bash
OAK_API_KEY=your_key_here
```

**Production configuration** (with OAuth):

```bash
OAK_API_KEY=your_key_here
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

**Development bypass** (local only):

```bash
OAK_API_KEY=your_key_here
DANGEROUSLY_DISABLE_AUTH=true  # NEVER use in production!
```

**Complete reference**: See `apps/oak-curriculum-mcp-streamable-http/README.md` and `docs/vercel-environment-config.md`.

### Stdio MCP Server (via root `.env`)

**Minimal configuration**:

```bash
OAK_API_KEY=your_key_here
```

**Optional**:

```bash
LOG_LEVEL=debug  # For debugging
MCP_LOGGER_FILE_PATH=.logs/custom-path.log  # Custom log file location
```

**Complete reference**: See `apps/oak-curriculum-mcp-stdio/README.md`.

## Getting API Keys

### Oak API Key

**For Oak team members**:

1. Contact the Oak engineering team
2. Request a development API key
3. Use the provided key in your `.env` file

**For external contributors**:

Currently, external API keys are not automatically available. Please open a GitHub issue to request access for development purposes.

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
3. Run `pnpm -C apps/oak-open-curriculum-semantic-search elastic:setup` to configure indices
4. Use provided credentials

### OpenAI (Natural Language Search)

1. Sign up at [https://platform.openai.com/](https://platform.openai.com/)
2. Navigate to API Keys
3. Create new key → `OPENAI_API_KEY`
4. Note: This requires billing to be enabled

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
- E2E tests
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
CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Option 2: Bypass auth for local dev (NOT for production)
DANGEROUSLY_DISABLE_AUTH=true
```

### "Elasticsearch connection failed"

**Solution**: Only needed for search app development. SDK and MCP servers don't require Elasticsearch.

### Tests fail with "Cannot read environment variable"

**Solution**: Check if you're running integration/E2E tests that need API keys. Unit tests should not require any env vars:

```bash
pnpm test           # Unit tests (no env vars needed)
pnpm test:e2e       # E2E tests (requires env vars)
```

## Related Documentation

- [Onboarding Guide](./onboarding.md) - Getting started with development
- [Root README](../../README.md) - Repository overview
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines
