# ADR-046: OpenAI Connector-Compatible Tools in Streamable HTTP App at `/openai_connector`

Status: Accepted
Date: 2025-09-15

## Context

We want to expose OpenAI Connector-compatible tools (`search`, `fetch`) that:

- Follow the OpenAI connector response contract: tool results must return a content array with exactly one content item of `type: "text"`, whose `text` is a JSON-encoded object matching the required schema.
- Are discoverable as just these two tools via MCP `tools/list`, and callable via MCP `tools/call`.
- Reuse our existing Oak Curriculum SDK and MCP infrastructure.
- Live alongside our existing Streamable HTTP MCP endpoint (`/mcp`) without adding SSE (we standardise on Streamable HTTP).

Short-term, `search` should aggregate existing search endpoints. Medium-term, we’ll switch to the upcoming semantic search service as the backing for `search`. Caching will be added later.

## Decision

1. Host OpenAI Connector-compatible tools on a new path in the same Express app: `/openai_connector`.
2. Create a separate MCP `Server` instance, connected to its own `StreamableHTTPServerTransport`, mounted at `/openai_connector`.
3. Register only two tools on this server:
   - `search(query: string)` → returns `{ results: [{ id, title, url }] }`
   - `fetch(id: string)` → returns `{ id, title, text, url, metadata? }`
4. Implement both tools as thin facades:
   - `search` (now): aggregate existing SDK MCP tools (e.g., `get-search-lessons`, `get-search-transcripts`), dedupe, normalise, and transform to the OpenAI format. Later: replace aggregation with the semantic search service.
   - `fetch`: route by ID pattern to the relevant SDK MCP tool (e.g., lessons/units/subjects/sequences), transform to the OpenAI format, and produce canonical URLs.
5. Apply the same security middleware to `/openai_connector` as `/mcp`:
   - Reuse bearer auth and DNS rebinding protections.
   - Add Accept header normalisation middleware for MCP (same pattern as `/mcp`).
6. Do not add SSE; continue to use Streamable HTTP transport.
7. Mark caching as a later enhancement (not in this phase).

## Rationale

- Single deployment surface: simpler ops, logging, security, and monitoring.
- Clear separation of concerns via two MCP `Server` instances in one app: the `/mcp` endpoint lists the full SDK-generated toolset; `/openai_connector` only exposes `search` and `fetch`.
- Thin facades maximise reuse of generated types/validators/executors and reduce risk.
- The path-based design makes it easy to evolve `search` to semantic search later without changing the contract.

## Consequences

- We must run two MCP servers (two `Server`+`StreamableHTTPServerTransport` pairs) in-process and mount each on its own route.
- We add format-conversion code to comply with OpenAI’s strict content array + JSON-as-text requirement.
- We must ensure `/openai_connector` is fully MCP-compliant for `tools/list` and `tools/call`, but with only two tools.
- Caching is deferred; initial responses may be slower for large documents until caching is added later.

## Implementation Sketch

- In `apps/oak-curriculum-mcp-streamable-http`:
  - Create `createOpenAiConnectorServer()` that:
    - Instantiates a new MCP `Server`
    - Registers `tools/list` → returns `[{ name: 'search' }, { name: 'fetch' }]` with their input schemas
    - Registers `tools/call` for `search` and `fetch` that:
      - Delegate to SDK MCP executors (`executeToolCall`) where applicable
      - Transform results into the OpenAI “single text item containing JSON” format
  - Create a new `StreamableHTTPServerTransport` for the OpenAI server and mount POST on `/openai_connector`.
  - Apply Accept header middleware also on `/openai_connector`.

- `search` facade (now):
  - Aggregate `get-search-lessons` and `get-search-transcripts` calls
  - Normalise to `{ results: [{ id, title, url }] }`
  - Return via `[{ type: 'text', text: JSON.stringify({results}) }]`

- `fetch` facade:
  - Determine content type from `id` (`lesson:…`, `unit:…`, `subject:…`, `sequence:…`)
  - Route to the appropriate SDK MCP tool
  - Transform to `{ id, title, text, url, metadata? }`
  - Return via the same single-text content array requirement

## Alternatives Considered

- Separate app for OpenAI Connector: rejected (adds operational overhead).
- SSE transport: rejected (project standardises on Streamable HTTP).
- Exposing `search`/`fetch` on `/mcp` with allowed_tools filtering only: rejected (tool discovery would still show the full set unless filtered by client).

## Links

- Plan: `.agent/plans/curriculum-mcp-enhancements-plan.md`
- OpenAI connector standards: `.agent/reference-docs/openai-connector-standards.md`
- Current Streamable HTTP app: `apps/oak-curriculum-mcp-streamable-http/`
