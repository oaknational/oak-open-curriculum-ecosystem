# ADR-046: OpenAI-Compatible Tool Surface in the Streamable HTTP App

Status: Accepted
Date: 2025-09-15

## Context

We need to expose OpenAI-compatible tools (`search`, `fetch`) that:

- Follow the OpenAI connector response contract: each `tools/call` result returns a content array with a single `{ type: "text", text: <JSON string> }` item matching the schema.
- Are discoverable via MCP `tools/list` so any compliant client (OpenAI, ElevenLabs, Gemini, etc.) sees them alongside the curriculum tools.
- Reuse the Oak Curriculum SDK’s generated types/validators.
- Run over the same Streamable HTTP transport as `/mcp` (the repo standard).

Originally we hosted these tools on a separate `/openai_connector` transport. That duplicated schema/registration logic and forced consumers to switch endpoints. The new universal translation layer means we can expose the complete toolset—curriculum tools + OpenAI facades—through a single `/mcp` surface while keeping `/openai_connector` as a temporary alias for backwards compatibility.

## Decision

1. Generate OpenAI-compatible tool facades in the SDK at type-gen time and expose them through a universal MCP translation module. The module normalises inputs/outputs using schema-derived Zod validators—no type assertions, fail fast.
2. Register every tool (curriculum + OpenAI facades) on the same `McpServer` instance behind `/mcp`, driven by the universal executor.
3. Keep `/openai_connector` as a short-lived alias that delegates to the same executor for consumers that have not migrated yet. Publish a deprecation notice and sunset timeline.
4. Share all security, logging, and Accept-header enforcement middleware between `/mcp` and `/openai_connector`, returning HTTP 406 whenever the `Accept` header omits `application/json` or `text/event-stream`.
5. Continue using the SDK-managed Streamable HTTP transport (Server-Sent Events framing), avoiding bespoke NDJSON shims.
6. Track caching, semantic search integration for `search`, and the `/openai_connector` removal as follow-on milestones.

## Rationale

- Single deployment surface: simpler ops, logging, security, and monitoring.
- Universal translation layer guarantees every tool (curriculum + OpenAI) stays schema-derived and MCP-compliant.
- `/openai_connector` remains available for existing integrations but no longer carries any bespoke logic, making deprecation safe once clients migrate.
- The facade design lets us evolve the `search` implementation (e.g., semantic search backend) without changing the contract.

## Consequences

- All clients see the same tool list on `/mcp`; `/openai_connector` is now an alias slated for removal once consumers switch.
- The universal executor owns the OpenAI formatting rules, so there’s a single place to maintain the JSON-as-text contract.
- Caching remains a future enhancement; semantic search integration for `search` stays on the roadmap.

## Implementation Sketch

- In `apps/oak-curriculum-mcp-streamable-http`:
  - Mount `/mcp` on the canonical `McpServer` and expose `/openai_connector` as an alias wired through `registerOpenAiConnectorHandlers`, ensuring both surfaces lean on the SDK’s universal executor.
  - Instantiate `StreamableHTTPServerTransport` instances for both `/mcp` and the alias, and guard them with `ensureMcpAcceptHeader`, which fails fast unless `Accept` contains both `application/json` and `text/event-stream`.
  - Surface `/healthz` (HEAD + GET) as the only unauthenticated probe endpoint; keep MCP transports dedicated to protocol traffic.

- SDK universal layer:
  - Generate type-safe tool metadata and executors at `pnpm type-gen` time and expose helpers (`listUniversalTools`, `createUniversalToolExecutor`, `executeOpenAiToolCall`) consumed by both `/mcp` and `/openai_connector`.

- OpenAI `search` (generated in SDK):
  - Aggregates `get-search-lessons` and `get-search-transcripts`
  - Normalises to `{ results: [{ id, title, url }] }`
  - Returns as a single text content item

- OpenAI `fetch` (generated in SDK):
  - Determines content type from `id` prefixes and routes to the appropriate SDK tool
  - Uses deterministic, context-aware URL helpers generated in the SDK
  - Returns `{ id, title, text, url, metadata? }` wrapped in a single text content item

## Alternatives Considered

- Separate app for OpenAI Connector: rejected (adds operational overhead).
- SSE transport: rejected (project standardises on Streamable HTTP).
- Hiding OpenAI tools via `allowed_tools` filtering only: rejected (tool discovery would still show the full set unless filtered by client). We now expose the merged list but keep `/openai_connector` as an alias until migration completes.

## Links

- Plan: `.agent/plans/curriculum-mcp-enhancements-plan.md`
- OpenAI connector standards: `.agent/reference-docs/openai-connector-standards.md`
- Current Streamable HTTP app: `apps/oak-curriculum-mcp-streamable-http/`
