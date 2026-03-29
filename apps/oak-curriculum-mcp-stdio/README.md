# Oak Curriculum MCP Server (STDIO)

MCP server that provides AI assistants with access to Oak National Academy's curriculum content.

> **Status: legacy workspace**. Active development and routine maintenance are
> halted for `apps/oak-curriculum-mcp-stdio`. Do not treat this workspace as the
> long-term Oak MCP server surface. The intended direction is to generalise
> `apps/oak-curriculum-mcp-streamable-http` so it can provide a separate stdio
> entry point while sharing the canonical server composition. See
> [ADR-128](../../docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md).

**Architecture**: This server imports all MCP tool definitions from `@oaknational/curriculum-sdk`. The tools are generated at compile time from the OpenAPI schema - no manual tool definitions exist in this application. When the API changes, `pnpm sdk-codegen` updates the SDK, and this server automatically has access to new/changed tools.

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.
Start with the [ADR index](../../docs/architecture/architectural-decisions/), then this MCP-focused set:

- [ADR-029](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) - No manual API data structures
- [ADR-030](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) - SDK as single source of truth
- [ADR-031](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md) - Generation-time extraction
- [ADR-107](../../docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) - Deterministic SDK and NL boundary

## Quick start

```bash
pnpm -C apps/oak-curriculum-mcp-stdio build
OAK_API_KEY=your_oak_api_key_here
```

Use this only where a manual local MCP client setup still requires the legacy
stdio workspace. The checked-in `.mcp.json` and `.cursor/mcp.json` now target
the HTTP server, not this legacy workspace.

This workspace is commented out of
[`pnpm-workspace.yaml`](../../pnpm-workspace.yaml), so root `pnpm check`
and root `pnpm --filter` commands do not include it. For intentional
legacy maintenance, run commands from this directory or use
`pnpm -C apps/oak-curriculum-mcp-stdio ...`.

## Architecture

This application follows the standard structure:

- App wiring in `src/app/`
- Tools in `src/tools/`
- Integrations in `src/integrations/`

## Architecture Highlights

### Compile-time SDK Tool Generation

- The `@oaknational/curriculum-sdk` generates MCP tool metadata and validators at compile time from the OpenAPI schema.
- This server lists tools from the SDK's generated `MCP_TOOLS`, and delegates execution via `executeToolCall` with the injected client.
- **No runtime schema fetching and no manual mapping layers** - everything is pre-generated and fully typed.
- **Key benefit**: When the OpenAPI schema changes upstream, running `pnpm sdk-codegen` automatically updates all tool definitions. This server immediately has access to new endpoints without any code changes.
- See [OpenAPI Pipeline Architecture](../../docs/architecture/openapi-pipeline.md) for the complete pattern.

## Tool surface

- This legacy workspace currently exposes the generated SDK tools only. It does
  not define the future canonical MCP surface.
- Use Inspector or `tools/list` to discover the currently registered tool set.
- Three search tools (`search`, `browse-curriculum`, `explore-topic`) provide semantic search across all four curriculum indexes (lessons, units, threads, sequences) plus typeahead suggestions and faceted browsing.

### Search tools

`ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` are **required** environment variables — `loadRuntimeConfig` fails at startup if either is absent. In stub mode (`OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`), `createStubSearchRetrieval()` is used instead of a real Elasticsearch client, so credentials are still validated at startup but no real ES connection is made.

## Behaviour and validation

- Implemented with MCP `McpServer`. Input validation uses SDK‑generated Zod shapes via `zodRawShapeFromToolInputJsonSchema`.
- Unknown tool and argument‑validation failures are surfaced as JSON‑RPC errors (thrown as `McpError` to clients).
- Execution or output‑validation failures return a single text content item containing a compact JSON error payload.

## Installation

This installation path is for the legacy stdio workspace only. For the
canonical Oak MCP server surface, see
`apps/oak-curriculum-mcp-streamable-http/README.md`.

```bash
# Install via npx (when published)
npx @oaknational/oak-curriculum-mcp

# Or clone and build locally
pnpm install
pnpm -C apps/oak-curriculum-mcp-stdio build
```

## Configuration

This configuration also targets the legacy stdio workspace rather than the
canonical HTTP MCP server workspace.

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "oak-curriculum": {
      "command": "npx",
      "args": ["-y", "@oaknational/oak-curriculum-mcp"],
      "env": {
        "OAK_API_KEY": "${OAK_API_KEY}"
      }
    }
  }
}
```

## Environment configuration

Environment loading uses `resolveEnv` from `@oaknational/env-resolution`: reads `.env` < `.env.local` < `process.env`, validates against `StdioEnvSchema` (a Zod schema composing shared schemas from `@oaknational/env`), and returns `Result<RuntimeConfig, ConfigError>`. Validation failures produce structured diagnostics listing each required key and whether it was present. See `src/runtime-config.ts` and `src/env.ts`.

Required variables: `OAK_API_KEY`, `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`. Optional: `LOG_LEVEL`, `OAK_CURRICULUM_MCP_USE_STUB_TOOLS`, `MCP_LOGGER_STDOUT`, `MCP_LOGGER_FILE_PATH`, `MCP_LOGGER_FILE_APPEND`.

## Testing

- Run the suite with `pnpm -C apps/oak-curriculum-mcp-stdio test`.
- Tests spin up an in-memory STDIO transport using the generated stub executor (`src/app/test-helpers/create-stubbed-stdio-server.ts`), covering initialise/list, success, validation, and missing stub flows without additional configuration.

## Legacy development and support

```bash
# Install dependencies
pnpm install

# Build the legacy workspace directly
pnpm -C apps/oak-curriculum-mcp-stdio build

# Run in development mode (stdio)
pnpm -C apps/oak-curriculum-mcp-stdio dev

# Run tests for the legacy workspace
pnpm -C apps/oak-curriculum-mcp-stdio test
```

No new feature work should be planned against this workspace. Limit changes here
to transitional maintenance that is strictly necessary until the stdio entry
point is consolidated into the HTTP workspace.

Root `pnpm check` validates the maintained workspace graph and does not
include this legacy workspace.

## How it works

- Uses `McpServer` directly; tools registered from SDK metadata.
- Validates tool arguments with Zod schemas generated by `@oaknational/curriculum-sdk` from the OpenAPI spec.
- Executes tools via `executeToolCall` on a client created from `OAK_API_KEY`.

## Detailed Documentation

- [Operational Debugging](docs/operational-debugging.md) — request tracing, execution timing, error debugging, log management, and debugging workflows
