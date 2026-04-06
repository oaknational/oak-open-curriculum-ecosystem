# Oak Curriculum MCP – Streamable HTTP (Vercel-ready)

Status: private alpha
Next status: public alpha

This app exposes the Curriculum MCP server over Streamable HTTP using the official TypeScript SDK transport. It uses **stateless session management** (no server-side state) and is designed for Vercel's serverless Node runtime. Responses are streamed using Server-Sent Events (SSE) as per the MCP specification.

> **Canonical MCP server workspace**. Active Oak MCP server evolution now
> belongs in `apps/oak-curriculum-mcp-streamable-http`. The standalone stdio
> workspace, `apps/oak-curriculum-mcp-stdio`, is legacy and is no longer being
> actively maintained. The intended direction is to generalise this workspace so
> it can later provide a separate stdio entry point as well. See
> [ADR-128](../../docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md).

**Architecture**: This server imports all MCP tool definitions from `@oaknational/curriculum-sdk`. The tools are generated at compile time from the OpenAPI schema - no manual tool definitions exist in this application. When the API changes, `pnpm sdk-codegen` updates the SDK, and this server automatically has access to new/changed tools.

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.
Start with the [ADR index](../../docs/architecture/architectural-decisions/), then this HTTP MCP-focused set:

- [ADR-029](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) - No manual API data structures
- [ADR-030](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) - SDK as single source of truth
- [ADR-031](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md) - Generation-time extraction
- [ADR-113](../../docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) - MCP auth compliance
- [ADR-115](../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md) - OAuth authorisation server model
- [ADR-123](../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md) - MCP server primitives strategy

## What This Server Provides

This server exposes Oak's curriculum through the three MCP primitive types, each with a distinct control model defined by the [MCP specification](https://modelcontextprotocol.io/).

**Tools** (model-controlled) — 31 curriculum tools: 23 generated from the OpenAPI schema plus 8 aggregated tools (search, browse, fetch, explore, graph/orientation tools, and `download-asset`). The AI model decides when to call them. Generated tool definitions are updated automatically when the upstream API changes via `pnpm sdk-codegen`.

**Resources** (application-controlled) — `curriculum://model` (domain ontology, `priority: 1.0`), `curriculum://prerequisite-graph` (unit dependency data, `priority: 0.5`), and `curriculum://thread-progressions` (learning progression data, `priority: 0.5`). All annotated with `audience: ["assistant"]`. The host application decides whether to inject these into the model's context. Clients that support resource auto-injection get orientation data without a tool call.

**Prompts** (user-controlled) — `find-lessons`, `lesson-planning`, `explore-curriculum`, and `learning-progression`. Parameterised workflow templates the user explicitly invokes as slash commands or UI actions. Each orchestrates multiple tools in a proven sequence for a common teacher task.

Together, tools give the AI autonomous access to curriculum data, resources give capable clients pre-loaded context, and prompts give users structured entry points for common tasks. The goal is to make Oak's curriculum discoverable and usable through AI assistants, helping teachers find, understand, and adapt high-quality curriculum resources.

For the architectural rationale behind this primitive mapping, see [ADR-123](../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md) and [ADR-058](../../docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md).

## Quick start (local)

1. Set env vars (minimal — auth disabled for local dev):

```bash
export OAK_API_KEY=your_api_key
export ELASTICSEARCH_URL=https://your-es-url
export ELASTICSEARCH_API_KEY=your_es_api_key
export DANGEROUSLY_DISABLE_AUTH=true
export SENTRY_MODE=off
export ALLOWED_HOSTS=localhost,127.0.0.1,::1
```

2. Run dev server:

```bash
pnpm -C apps/oak-curriculum-mcp-streamable-http dev
```

3. List tools (auth disabled path shown above):

```bash
curl -sS \
  -H 'Content-Type: application/json' \
  -X POST http://localhost:3333/mcp \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
```

If you enable auth locally, repeat the same request with a valid Clerk-issued
Bearer token instead of relying on the disabled-auth path above.

Note: The server automatically adds the required `Accept: application/json, text/event-stream` header if missing, improving UX for simple curl commands and UI integrations.

## Widget development

The MCP App widget has a Vite dev server with hot module replacement for
iterating on UI and branding. To see the widget inside an MCP host, use
the `basic-host` example from the ext-apps SDK.

**Prerequisites**: `pnpm install` and `pnpm build` from the repo root
(design tokens and SDK must be built before the widget can resolve its
imports).

### Widget-only iteration (one terminal)

For layout and styling work that does not need MCP host context:

```bash
pnpm dev:widget
```

Open `http://localhost:5173/mcp-app.html`. Vite provides hot module
replacement — edits to React components, CSS, and design tokens are
reflected immediately. The ext-apps SDK will not connect to a host in
this mode, but the UI renders normally.

### Full MCP App dev loop (three terminals)

To see the widget rendered inside an MCP host iframe:

| Terminal | Command               | Purpose                                                                 |
| -------- | --------------------- | ----------------------------------------------------------------------- |
| 1        | `pnpm dev:auth:stub`  | MCP server on port 3333 (stub tools, no real API needed)                |
| 2        | `pnpm dev:widget`     | Widget Vite dev server with HMR at `http://localhost:5173/mcp-app.html` |
| 3        | `pnpm dev:basic-host` | basic-host from ext-apps SDK, connects to localhost:3333 (port 8080)    |

Start in order: server first (terminal 1), then widget (terminal 2),
then basic-host (terminal 3). Open `http://localhost:8080` to see the
host UI. Call a UI-bearing tool (e.g. `get-curriculum-model`) from the
basic-host interface to render the widget inside the host iframe.

`dev:basic-host` clones the `@modelcontextprotocol/ext-apps` repo to
`/tmp/mcp-ext-apps` on first run and reuses it on subsequent runs.
Delete that directory to refresh: `rm -rf /tmp/mcp-ext-apps`.

### Visual review with MCPJam

[MCPJam](https://www.mcpjam.com/) is an MCP Apps-compatible host useful
for visual design review and acceptance testing. Connect it to the local
server at `http://localhost:3333/mcp` (requires `dev:auth:stub` running).

## Observability

The HTTP server now uses a single app-level observability bundle created at
process start. In every mode, stdout JSON remains the canonical local log
surface.

`SENTRY_MODE` controls the runtime behaviour:

- `off` — default kill switch. No Sentry init, no Sentry sink, no outbound
  delivery, and no in-memory MCP recorder.
- `fixture` — no-network local verification mode. Stdout JSON is retained, and
  MCP observations plus handled-error captures are recorded only in local
  fixture stores used by tests and local validation.
- `sentry` — live Sentry mode. Stdout JSON is still retained, and the app adds
  the Sentry sink, live error capture, and tracing.

The HTTP telemetry boundary is metadata-only:

- generic `/mcp` request capture is reduced to safe method and route metadata
- raw JSON-RPC envelopes, request bodies, query strings, cookies, and
  authorisation headers are stripped before Sentry capture
- MCP tool, resource, and prompt observations retain only kind, name, status,
  duration, and trace identifiers
- the shared redaction policy also treats raw
  `application/x-www-form-urlencoded` OAuth payloads as sensitive input,
  rather than relying on query-only redaction

The app also adds targeted manual spans for:

- bootstrap phases, including upstream OAuth metadata fetch
- OAuth proxy upstream `register` and `token` calls
- asset-download upstream fetch and stream lifecycle

Handled-error capture is reserved for unexpected terminal boundaries such as
bootstrap failure, server listen failure, Express error middleware, MCP cleanup
failure, OAuth upstream timeout/network failure, and asset-download proxy
failure. Expected validation, auth, and upstream-status branches remain logs
plus span status only.

Successful auth logs retain client/scoping context only (`clientId`,
`scopeCount`, `hasUserContext`); `userId` is excluded from structured
observability payloads.

On shutdown and startup failure paths, the app performs bounded Sentry flushes
at the process boundary: bootstrap failure, server listen error, `SIGINT`, and
`SIGTERM`. Per-request MCP teardown never initialises or flushes Sentry.

## Vercel deployment

- Use Node runtime (not Edge)
- Required env:
  - `OAK_API_KEY` — Oak Curriculum API key
  - `ELASTICSEARCH_URL` — Elasticsearch endpoint (server fails at startup without this)
  - `ELASTICSEARCH_API_KEY` — Elasticsearch API key (server fails at startup without this)
  - `CLERK_PUBLISHABLE_KEY` — Clerk publishable key for OAuth (not required when `DANGEROUSLY_DISABLE_AUTH=true`)
  - `CLERK_SECRET_KEY` — Clerk secret key for auth middleware (not required when `DANGEROUSLY_DISABLE_AUTH=true`)
- Optional env:
  - `DANGEROUSLY_DISABLE_AUTH` — set to `true` to disable auth (makes Clerk keys optional)
  - `ALLOWED_HOSTS` (comma-separated, must include your primary hostname; supports `*` wildcards). Applied consistently to OAuth metadata endpoints and `/mcp` auth challenge/resource URL generation.
  - `LOG_LEVEL` (default `info`, use `debug` for staging)
  - `SENTRY_MODE` — `off` (default), `fixture`, or `sentry`
  - `SENTRY_DSN` — required when `SENTRY_MODE=sentry`
  - `SENTRY_RELEASE` — required when `SENTRY_MODE=sentry`
  - `SENTRY_TRACES_SAMPLE_RATE` — optional numeric trace sample rate for live Sentry mode
  - `REMOTE_MCP_MODE` (default `stateless`, recommended for Vercel — see `docs/vercel-environment-config.md`)

Environment loading uses `resolveEnv` from `@oaknational/env-resolution`: reads `.env` < `.env.local` < `process.env`, validates against a Zod schema with conditional Clerk key requirements, and returns `Result<RuntimeConfig, ConfigError>`. See `src/runtime-config.ts`.

**Important**: This server uses **stateless mode** by default, which is correct for Vercel's serverless architecture. Session state is not maintained between requests. See `docs/vercel-environment-config.md` for detailed explanation of transport modes.

### Smoke-test checklist (post-deploy)

- Confirm Node runtime (not Edge) in project settings
- Verify envs set: `OAK_API_KEY`, `ALLOWED_HOSTS`
- Curl `/.well-known/oauth-protected-resource` returns resource + auth servers
- POST `/mcp` without auth returns 401 with `WWW-Authenticate` containing `resource` and `authorization_uri`
- POST `/mcp` with a valid Bearer token returns 200 and SSE-wrapped JSON-RPC
- Disallowed or malformed `Host` headers return 403 on OAuth metadata and `/mcp` auth challenge path

### OAuth discovery

- `GET /.well-known/oauth-protected-resource` returns the canonical resource and authorisation servers
- 401 responses include a `WWW-Authenticate` header with `resource` and `authorization_uri` to guide clients

## Cursor (legacy local stdio) configuration

The checked-in `.mcp.json` and `.cursor/mcp.json` now point at the HTTP
server, not the legacy stdio workspace.

If you still need a manual local stdio setup during the transition,
point your client at:

```json
{
  "command": "pnpm",
  "args": ["exec", "tsx", "apps/oak-curriculum-mcp-stdio/bin/oak-curriculum-mcp.ts"]
}
```

If tools do not appear, check `.logs/oak-curriculum-mcp-startup/startup.log`
for diagnostics.

This is a transitional arrangement. The long-term plan is for this HTTP
workspace to provide its own stdio entry point so local stdio clients no longer
depend on the separate legacy workspace.

## Authentication

The server uses **Clerk OAuth** for production authentication. All requests to `/mcp` must include a valid Bearer token in the `Authorization` header.

> **Current status**: Authentication is provided by a Clerk test
> instance. Only internal Oak team members are supported as users
> at this time. External access is not available.

### OAuth Flow

1. Unauthenticated requests return `401` with `WWW-Authenticate` header containing OAuth discovery information
2. Client discovers authorization server via `/.well-known/oauth-protected-resource` endpoint
3. Client follows OAuth Authorization Code + PKCE flow to obtain access token
4. Client includes token in `Authorization: Bearer <token>` header

### Development Authentication

For local development only:

- Set `DANGEROUSLY_DISABLE_AUTH=true` to bypass authentication
- **NEVER** enable this in production or preview environments

### MCP Client Configuration

When configuring MCP clients (like Claude Desktop), they will automatically:

1. Detect the OAuth requirement from the 401 response
2. Follow the OAuth discovery flow
3. Redirect users to Clerk for authentication
4. Store and use the resulting access token

See `docs/clerk-oauth-trace-instructions.md` for detailed OAuth flow documentation.

## Troubleshooting

- **Server fails to start (OAuth metadata fetch timeout)**: If the server hangs or fails during startup when auth is enabled, ensure Clerk's `/.well-known/oauth-authorization-server` endpoint is reachable from the server's network. The auth bootstrap fetches upstream OAuth metadata at startup and will retry with exponential backoff (added in F10), but if the endpoint is unreachable the server will eventually fail. Check DNS resolution, firewall rules, and Clerk service status.
- 500 on `/.well-known/oauth-protected-resource` or `/mcp`:
  - Ensure Vercel framework is Express and the app default‑exports an Express instance (this repo does in `src/index.ts`).
  - Verify `ALLOWED_HOSTS` includes your alias host (e.g. `curriculum-mcp-alpha.oaknational.dev`).
  - If auth is enabled, verify `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set and that Clerk metadata discovery succeeds at startup.
- 401 without `Authorization`: the client must either follow the OAuth discovery flow or send a valid Clerk-issued Bearer token. For local smoke tests, either use a real Clerk token or set `DANGEROUSLY_DISABLE_AUTH=true` and retry without the `Authorization` header.
- Host blocked: add host to `ALLOWED_HOSTS`

## Search tools

Three search tools (`search`, `browse-curriculum`, `explore-topic`) provide Elasticsearch-backed semantic search. `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` are **required** environment variables — the server fails at startup if either is absent. In stub mode (`OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`), `createStubSearchRetrieval()` is used instead of a real Elasticsearch client, so credentials are still required by the env schema but no real ES connection is made.

## How it works

- MCP handlers are attached via `@oaknational/mcp-server-kit` `attachMcpHandlers`, using a registry of tools generated in the SDK.
- Request validation uses Zod schemas derived at compile-time from the OpenAPI spec; invalid inputs return a formatted error body (200 status, `isError: true`).
- Successful results are SSE-wrapped JSON-RPC responses formatted with `formatStandardContent`.

## Testing

This application has comprehensive test coverage across three testing layers:

### Unit Tests

- **Header Redaction** (`src/logging/header-redaction.unit.test.ts`): sensitive header redaction, IP address handling, edge cases
- **Validation Logger** (`src/validation-logger.unit.test.ts`): upstream error classification and logging
- **Prompt Registration** (`src/register-prompts.integration.test.ts`): MCP prompt schemas and message generation

### Integration Tests

- **Correlation Middleware** (`src/correlation/middleware.integration.test.ts`): header redaction in request/response logging, correlation ID propagation

### End-to-End Tests

- **Header Redaction E2E** (`e2e-tests/header-redaction.e2e.test.ts`): full request/response cycles with sensitive headers, OAuth scenarios
- **Tool E2E** (`e2e-tests/`): MCP tool invocation, resource listing, prompt registration, widget metadata

### Running Tests

```bash
# Run all unit and integration tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test

# Run E2E tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e

# Run all workspace test suites
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui
```

## Detailed Documentation

- [MCP primitives: intention and intended audience](docs/mcp-primitives-intention-and-audience.md) - Internal guide to tool/resource/prompt boundaries, control model, and UAT expectations
- [Operational Debugging](docs/operational-debugging.md) — request tracing, timing, diagnostics, error debugging, production logging
- [Widget Rendering](docs/widget-rendering.md) — widget dispatch, rendering architecture, and sandbox details

## Deployment Preconditions

**Rate limiting**: Edge/WAF rate limiting must be configured before
production deployment. The OAuth proxy endpoints (`/register`, `/token`)
are publicly reachable and require rate limiting to prevent abuse. See
[ADR-115](../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md)
for details.

**Documentation Status**: Last verified 2026-03-07 against `src/application.ts`, `src/auth-routes.ts`, and the current workspace-level transport documentation.

**Related Documentation**:

- [deployment-architecture.md](./docs/deployment-architecture.md) - Deployment patterns and architecture
- [middleware-chain.md](./docs/middleware-chain.md) - Complete middleware execution order
- [vercel-environment-config.md](./docs/vercel-environment-config.md) - Environment variable reference
