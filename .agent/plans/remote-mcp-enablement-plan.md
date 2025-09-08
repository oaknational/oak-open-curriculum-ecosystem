# Remote MCP Enablement Plan (Streaming HTTP + Vercel)

Scope: implement Streaming HTTP transport for MCP servers (not SSE), then provide an initial remote hosting solution on Vercel. Keep compile-time tool generation and DI patterns unchanged.

## Goals

- Enable clients to connect to MCP servers over Streaming HTTP using newline-delimited JSON (NDJSON) framing for JSON-RPC messages.
- Provide a Vercel deployment template and docs so servers can be hosted remotely with streaming responses.
- Maintain parity with local STDIO behavior through transport contract tests.

## Non-goals

- SSE or WebSocket transports.
- Cloudflare Workers support (tracked separately in `serverless-hosting-plan.md`).

## Acceptance criteria

- Streaming HTTP framing specified (content type and message delimiter) and implemented in a new transport.
- End-to-end local test demonstrating request/response streaming without network calls (in-memory streams).
- Example deployment on Vercel for one server (e.g., Curriculum MCP) with documentation and a working curl example.

## Design outline

- Framing: `Content-Type: application/x-ndjson`; each JSON-RPC message as a single line terminated by `\n`.
- Transport: add `http-streaming` transport in `packages/libs/transport/` implementing the same send/receive contract as STDIO.
- Server integration: add an HTTP adapter that binds the MCP server loop to a Node/Vercel request/response stream.
- Backpressure/flush: use `res.flush()` or equivalent and write per-message chunks; ensure buffering disabled where supported.
- Heartbeats: optional periodic `{"jsonrpc":"2.0","method":"$heartbeat"}` messages to keep connections warm (configurable).

## Implementation steps

1) ACTION: Specify framing and contract
   - Add a short spec doc under `docs/architecture/` describing NDJSON framing and JSON-RPC expectations.
   - Define minimal helper utilities for encode/decode lines.
   REVIEW: Self-analyze spec for clarity, completeness, and compatibility with existing message shapes.

2) ACTION: Implement `http-streaming` transport
   - New module in `packages/libs/transport` implementing the transport interface (send, onMessage, close).
   - Unit tests for encoder/decoder and transport lifecycle (no network).
   REVIEW: Self-analyze transport against STDIO parity and edge cases (partial lines, backpressure, error paths).

3) ACTION: Add Node HTTP adapter
   - Small adapter that wires an incoming HTTP request to the MCP server, streaming responses via NDJSON.
   - Contract tests ensuring message exchange parity with STDIO.
   REVIEW: Self-analyze adapter behavior under concurrent requests and long-running streams.

4) ACTION: Vercel integration
   - Create `apps/oak-<server>/vercel/` example entry with `vercel.json` or docs for project settings.
   - Use Node runtime (not Edge) to ensure streaming semantics and timeouts fit typical use.
   - Provide `curl` and minimal client example to demonstrate streaming.
   REVIEW: Self-analyze example deployability and documentation quality.

5) ACTION: Wire into one server (Curriculum MCP)
   - Add an HTTP entry that reuses existing DI wiring and registers the HTTP adapter.
   - Keep STDIO entry intact; choose entry via env/config.
   REVIEW: Self-analyze that DI remains explicit and no implicit env lookups are introduced.

6) QUALITY-GATE: Run from repo root
   - `pnpm format:check && pnpm type-check && pnpm lint && pnpm test && pnpm build && pnpm identity-report`

## Milestones

- M1: Framing spec and `http-streaming` transport completed with tests.
- M2: Node HTTP adapter integrated; STDIO parity contract tests pass.
- M3: Vercel example deployed for Curriculum MCP; docs published.

## Risks and mitigations

- Serverless timeouts or buffering on Vercel: prefer Node runtime, document limits, chunk messages frequently.
- NDJSON framing compatibility: keep messages single-line JSON; validate with strict decoder and tests.
- Large payloads: stream progressively; avoid building giant buffers.

## Metrics

- p95 tool latency local vs remote (comparable under typical workloads).
- Error rate/timeouts in remote environment (aim near-zero with retries disabled in demo).

## Documentation

- Add a short guide under `docs/usage/` describing Streaming HTTP usage and the Vercel deployment steps.
