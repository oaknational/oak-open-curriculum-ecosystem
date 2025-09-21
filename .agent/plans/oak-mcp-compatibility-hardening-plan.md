# Oak MCP Server Hardening & Compatibility Guide

**Targets:** Google Gemini • ElevenLabs Agents • General MCP Clients
**Date:** 2025-09-19

---

## 0) Executive Summary

This document consolidates everything learned in our testing to make the Oak MCP server fully standards-compliant and “just work” with **Gemini** and **ElevenLabs** (Streamable HTTP transport). It also defines a migration plan to standardise the endpoint at **`/mcp`** (deprecating `/openai_connector`). Current code already uses the official SDK; the steps below focus on closing the remaining gaps and proving compliance.

**Key actions:**

1. **Transport & framing:** Route both POST and GET requests through the official `StreamableHTTPServerTransport`. Let the SDK emit the spec-compliant SSE frames (or JSON when enabled). Relocate health checks away from `/mcp` so GET requests can open the SDK-managed stream (or return 405). Fail fast with explicit transport errors.
2. **Handshake:** `initialize` **must include** `clientInfo`. After success, the client sends `notifications/initialized`, then `tools/list`.
3. **Canonical tool schema & conversions:** Ensure each tool has `name`, `description`, and an **`inputSchema` with `type:"object"`** generated directly from the OpenAPI schema. Introduce compile-time generated conversion helpers (via Zod) that normalise input/output types in both directions using schema-derived types only—**never use type assertions**, always narrow with the generated guards. Use the same helpers everywhere (no compatibility layers) and fail fast when coercion fails with helpful error messages.
4. **Capabilities:** In `initialize.result.capabilities.tools`, set `{ "listChanged": true }` (optional but helpful).
5. **Universal translation surface:** Promote the existing `/openai_connector` translation logic into a shared layer that fronts every transport (`/mcp`, stdio, future hosts). The OpenAI-specific route then becomes a thin adapter over the universal implementation without introducing a compatibility shim.
6. **Single public MCP surface:** Converge stdio and streamable HTTP servers on a single `/mcp` endpoint that exposes the full tool catalogue—including the `fetch` and `search` helpers currently surfaced only via `/openai_connector`—using the shared translation layer and schema-derived types.
7. **Discovery on agents:** ElevenLabs **does support HTTP streaming MCP**. With the SDK-managed Streamable HTTP transport and a solid `tools/list`, tools display correctly—plan to verify with scripted probes.
8. **Endpoint:** **Migrate to `/mcp`**, ensuring `/mcp` and `/openai_connector` behaviour aligns during the overlap window. Provide redirects and a cutover plan.

---

## 1) Current Observations & Issues Found

### 1.1 Handshake

- `initialize` without `clientInfo` fails with a schema error (`params.clientInfo` required). **Fix:** Always include `clientInfo`.
- A correct `initialize` returned protocolVersion and capabilities but no tools (expected).

### 1.2 Tool Discovery (`tools/list`)

- Server returns a **rich toolset**. Verify the current payload by inspecting the handler output (capture a snapshot before further changes).
- Maintain pure MCP payloads: no stray `method`/`path`/`operationId` fields. Once the baseline is confirmed, add regression tests to ensure future changes stay compliant.
- Keep integer types (`offset`, `limit`, `year`) consistent. Latest SDK output appears aligned; introduce schema snapshot tests to guard against regressions.

### 1.3 Transport

- Observed SSE-style prefixes (`event:`/`data:`) are **expected**. Streamable HTTP relies on Server-Sent Events for streaming; no NDJSON munging required when the SDK handles responses.

---

## 2) Transport & Framing

**Canonical approach:**

- Delegate POST handling to `StreamableHTTPServerTransport`. It enforces `Accept: application/json, text/event-stream`, validates payloads, and streams responses as SSE (`Content-Type: text/event-stream`) unless JSON mode is explicitly enabled.
- Delegate GET handling to the same transport so clients can open a server-initiated SSE stream. If we do not support server-push, respond with HTTP 405 rather than a custom JSON body. Move health probes to a separate path (e.g. `/healthz`).
- No manual NDJSON framing required—the SDK serialises JSON-RPC messages and prefixes them with `event:`/`data:` per spec.

---

## 3) Protocol Handshake

Flow per spec ([MCP Server Spec 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server)):

1. Client → `initialize` (with `clientInfo`)
2. Server → `initialize.result` (capabilities, serverInfo, optional instructions)
3. Client → `notifications/initialized`
4. Client → `tools/list` → Server returns tool array

> Not returning tools in `initialize` is **expected**. Tools only come from `tools/list`.

---

## 4) Tool Schema Best Practices

- Required: `name`, `description`, `inputSchema` (object) produced by the generator without manual edits.
- Remove non-MCP fields (`method`, `path`, `operationId`) from public payloads; if the data is needed internally, surface it under `x-oak-*` using generated types.
- Tighten numeric types → generate canonical `integer`/`number` unions from the OpenAPI schema and ensure they stay consistent across tools.
- Standardise `year` type by coercing every variant through the generated conversion helpers (string enums, numbers, and union outputs).
- Provide human-friendly descriptions.
- **Never use type assertions**—always rely on schema-derived TypeScript types and generated type guards for narrowing, and fail fast with descriptive errors when inputs do not conform.

## 4.1) Universal MCP Translation Layer

- Generate a shared translation module during `pnpm type-gen` that:
  - Imports the compile-time OpenAPI types and emits Zod schemas/guards for canonical MCP request/response shapes.
  - Provides bidirectional conversion helpers (raw OpenAPI ↔ canonical MCP) that validate and normalise without type assertions, failing fast with useful error messages.
  - Is implemented through TDD with pure functions and unit tests that exercise every conversion path; follow the testing workflow in `docs/agent-guidance/testing-strategy.md`.
- Refactor the existing `/openai_connector` code to delegate to this module so that `/mcp`, stdio, ElevenLabs, and future agents all consume the same translation path.
- Ensure the translation module exposes only schema-derived types and guards, making it impossible to bypass validation or introduce compatibility layers.

---

## 5) Endpoint Migration Plan

1. Audit current `/mcp` and `/openai_connector` handlers.
2. Route `/mcp` POST/GET through the shared `StreamableHTTPServerTransport` (section 2). Ensure GET no longer returns custom JSON; expose health info separately (e.g. `/healthz`).
3. Move the `search` and `fetch` tool definitions into the universal tool module so `/mcp` on both servers returns the complete toolset via `tools/list`.
4. Keep `/openai_connector` as an alias during migration while it delegates to the shared module; publish a deprecation timeline and final cutover plan that leaves `/mcp` as the sole public surface.
5. Update documentation to describe `/mcp` as the canonical endpoint once migration is complete.

---

## 6) Example Payloads (Validated)

### 6.1 Initialize Request

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {},
    "clientInfo": {
      "name": "oak-mcp-prober",
      "version": "0.1.0"
    }
  }
}
```

### 6.2 Initialize Response

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": { "tools": { "listChanged": true } },
    "serverInfo": { "name": "oak-curriculum-http", "version": "0.1.0" },
    "instructions": "Use tools/list to retrieve available tools."
  }
}
```

### 6.3 notifications/initialized

```json
{ "jsonrpc": "2.0", "method": "notifications/initialized" }
```

### 6.4 tools/list Request

```json
{ "jsonrpc": "2.0", "id": "2", "method": "tools/list", "params": {} }
```

### 6.5 tools/list Response

```json
{
  "jsonrpc": "2.0",
  "id": "2",
  "result": {
    "tools": [
      {
        "name": "search",
        "description": "Search across lessons and transcripts.",
        "title": "Search Lessons",
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": { "type": "string" },
            "keyStage": { "type": "string", "enum": ["ks1", "ks2", "ks3", "ks4"] },
            "subject": { "type": "string", "enum": ["science", "maths", "english", "..."] },
            "unit": { "type": "string" }
          },
          "required": ["query"],
          "additionalProperties": false
        }
      }
    ],
    "nextCursor": null
  }
}
```

### 6.6 tools/call Request

```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "method": "tools/call",
  "params": {
    "name": "search",
    "arguments": {
      "query": "photosynthesis",
      "keyStage": "ks3",
      "subject": "science"
    }
  }
}
```

### 6.7 tools/call Response

```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "result": {
    "content": [
      { "type": "text", "text": "Found 2 lessons matching 'photosynthesis' in KS3 Science." },
      {
        "type": "json",
        "data": {
          "results": [
            {
              "title": "Photosynthesis Basics",
              "slug": "science-ks3-photosynthesis-basics",
              "url": "https://oak.example/lessons/science-ks3-photosynthesis-basics"
            },
            {
              "title": "Photosynthesis: Light and Dark Stages",
              "slug": "science-ks3-photosynthesis-light-dark",
              "url": "https://oak.example/lessons/science-ks3-photosynthesis-light-dark"
            }
          ]
        }
      }
    ]
  }
}
```

---

## 8) Side‑by‑Side Comparisons (Current vs Spec‑Compliant)

> These are illustrative diffs based on payloads we observed from `/openai_connector`. Aligning to the right‑hand examples will reduce agent parsing issues and improve compatibility.

### 8.1 Initialize (Missing `clientInfo`)

**Current (problem):**

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {}
  }
}
```

**Server error observed:**

```json
{
  "jsonrpc":"2.0","id":"1",
  "error":{
    "code":-32603,
    "message":"[ { "code":"invalid_type", "expected":"object", "received":"undefined", "path":["params","clientInfo"], "message":"Required" } ]"
  }
}
```

**Spec‑compliant:**

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {},
    "clientInfo": { "name": "oak-mcp-prober", "version": "0.1.0" }
  }
}
```

### 8.2 Tool Definition & Schema Consistency

- Inspect the current `tools/list` output to confirm no stray `method`/`path` fields are leaking; record a baseline snapshot.
- Once validated, capture the snapshot in tests to ensure future changes stay MCP-compliant and use the universal translation module for both generation and runtime handling.
- Integer/enumerated fields (e.g. `offset`, `limit`, `year`) must be surfaced through the generated conversion helpers—add regression assertions that the canonical Zod schemas (no type assertions) enforce the expected constraints.

### 8.4 Stream Framing (SSE)

Streamable HTTP is defined in terms of Server-Sent Events. The SDK emits frames like:

```text
event: message
data: {"jsonrpc":"2.0","id":"2","result":{ ... }}

```

Do not replace SSE with NDJSON; rely on the SDK to keep pace with the specification.

---

## 9) References

- [MCP Server Spec (2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18/server)
- [MCP Server Tools Schema](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [Build a Server Guide (Node SDK)](https://modelcontextprotocol.io/docs/develop/build-server#node)
- [Schema TypeScript Reference](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2025-06-18/schema.ts)

---

## 10) Quick Checklist

- [x] Update express router so `/mcp` POST/GET fall through to `StreamableHTTPServerTransport`; expose `/healthz` (or similar) for probes and adjust monitoring. Ensure the handler fails fast with explicit errors when Accept headers are invalid (let the SDK enforce where possible). Ship with unit/integration tests proving GET/POST behaviour.
- [x] Generate the universal translation module during `pnpm type-gen`: update generator scripts, emit schema-derived Zod helpers, and add unit tests for every conversion. Use pure functions, follow TDD, and forbid `as` assertions.
- [x] Refactor MCP tool registration and execution (stdio + streamable HTTP + `/openai_connector`) to consume the translation module, removing duplicated schemas and ensuring all runtime types are the generated ones. Cover the refactor with unit tests verifying handler outputs and fast-failing validation.
- [x] Surface the shared `search` and `fetch` tools through the universal module so `/mcp` on both servers exposes the complete toolset via `tools/list`. Add regression tests that assert these tools appear with correct schema metadata.
- [x] Strip non-MCP fields from public tool payloads or tuck them under `x-oak-*` fields using generated schema-derived types. Add tests that fail if stray fields reappear.
- [x] Ensure `initialize` requests continue to include `clientInfo` (already true) and add regression tests in our probe suite covering handshake success/failure paths.
- [x] Confirm `capabilities.tools.listChanged` appears in responses; add an explicit assertion in transport integration tests.
- [x] Add regression tests for `tools/list` payload shape, translation round-trips, and schema snapshots (including `year` coercion) leveraging the generated guards. Use TDD so converters are validated before integration.
- [x] Document `/openai_connector` deprecation path and timeline; configure redirect/alias during migration without creating a compatibility layer.
- [ ] Run scripted curl probes plus Gemini/ElevenLabs smoke tests and capture SSE traces for verification. Store results to demonstrate standards compliance.
- [x] Update the SDK build pipeline (`tsup.config.ts`, `tsconfig.build.json`, exports) so the universal tool layer ships in `dist/` without relying on source imports; rerun builds to confirm consumers resolve the module.
- [x] Adjust consuming workspaces (`oak-curriculum-mcp-stdio`, `oak-curriculum-mcp-streamable-http`, `oak-open-curriculum-semantic-search`) to import from the published SDK surface rather than packages/.../src, verifying `package.json` dependencies point to the workspace package.
- [x] Re-run `pnpm build` and address any residual type-generation or bundling gaps so the monorepo builds cleanly end-to-end.
- [x] Extend generated MCP tool descriptors so schema descriptions surface in `MCP_TOOLS`, add detailed JSDoc for executors/adapters, and ensure Gemini surfaces tool-centric copy.
- [ ] Extend the `smoke-dev` probe to cover `/healthz`, Accept-header enforcement, initialize (success/failure), merged tool list, and `/openai_connector` alias behaviour; schedule it as the weekly MCP health check.
- [ ] Sweep README/usage docs to emphasise `/mcp` as canonical, note `/openai_connector` as a temporary alias, and link to the deprecation timeline.

---

## Appendix A — Future Enhancements

- Investigate higher-level “hero” tools (e.g. `suggest_lesson_plan`) once the canonical transport and compliance work, and the semantic search work, is complete.

---

## 12) Future Hardening – Tool Generation

- Collapse the generated `*Tool` stubs once we can derive handlers directly from the descriptor constants. The descriptor should be the single source of truth for transports, tooling, and docs.
- Emit a stable constant data structure first, then synthesise TypeScript types, Zod schemas, and type guards from that data so request/response validation remains consistent end-to-end without manual assertions.
- Thread the derived types and guards through `execute-tool-call`, the universal translation layer, and future transports so no path operates on `unknown` values.
- Remove placeholder, no-op `handle` implementations once the generator can route through real executors; this avoids dead code and clarifies the runtime shape for contributors.
- Add generator-level tests that assert descriptions, parameter metadata, and validation rules stay aligned with the upstream OpenAPI schema.

---

**End of document.**
