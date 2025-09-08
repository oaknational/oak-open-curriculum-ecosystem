# Remote MCP Enablement Plan (Streamable HTTP + Vercel)

Scope: enable Streamable HTTP for MCP servers using the official SDK transport, then provide an initial remote hosting solution on Vercel (Node runtime). Keep compile‑time tool generation and DI patterns unchanged.

## Goals

- Enable Streamable HTTP via `StreamableHTTPServerTransport` from `@modelcontextprotocol/sdk`.
- Provide a Vercel deployment template and docs so servers can be hosted remotely with streaming responses.
- Maintain parity with local STDIO behavior through transport/adapter contract tests.

## Non-goals

- Custom HTTP transport or bespoke NDJSON framing (use SDK transport).
- Cloudflare Workers support (tracked separately in `serverless-hosting-plan.md`).

## Acceptance criteria

- Server exposes Streamable HTTP endpoint using `StreamableHTTPServerTransport`.
- Stateless mode (no SSE) variant works end‑to‑end for tool calls; session‑managed variant (with SSE GET/DELETE) documented as optional.
- Example deployment on Vercel for one server (e.g., Curriculum MCP) with documentation and a working curl example.

## Design outline

- Transport: use `StreamableHTTPServerTransport` from the TS SDK; no custom wire format.
- Modes:
  - Stateless: per‑request transport/server instance, no SSE notifications; best fit for serverless (Vercel) and “no SSE” requirement.
  - Session‑managed (optional): POST initializes session, GET provides SSE notifications, DELETE terminates. Requires sticky state; not ideal for serverless.
- HTTP surface: POST /mcp for client→server JSON‑RPC payloads; for session mode also GET/DELETE /mcp as per SDK docs.
- CORS (browser clients): expose header `Mcp-Session-Id` and allow `mcp-session-id` when using session mode.
- Security: enable DNS rebinding protection for local dev; configure `allowedHosts`/`allowedOrigins` as appropriate in remote environments.
- Vercel runtime: use Node runtime (not Edge); ensure streaming/chunked responses are not buffered by middleware.
- Rationale: in stateless mode, create a fresh server/transport per request to avoid JSON‑RPC request ID collisions across concurrent clients.

## Implementation steps

1. ACTION: Select Streamable HTTP mode
   - Default to stateless mode (no SSE) to satisfy “not SSE” requirement and Vercel serverless constraints.
   - Document optional session‑managed mode (POST/GET/DELETE) for environments that can maintain in‑memory session maps.
     REVIEW: Self‑analyze mode decision against hosting constraints and client expectations.

2. ACTION: Add HTTP entry using SDK transport
   - Create an HTTP entry that constructs `StreamableHTTPServerTransport` and delegates to `transport.handleRequest(req, res, body)`.
   - Stateless: instantiate server/transport per request; close on `res.close`.
   - Session‑managed (optional): initialize on first POST (detect with `isInitializeRequest`), store by session ID, support GET/DELETE routes.
     REVIEW: Self‑analyze for parity with STDIO and proper lifecycle/cleanup.

3. ACTION: CORS and security
   - For browser clients, configure CORS to expose `Mcp-Session-Id` and allow header `mcp-session-id` (session mode only). Example: `exposedHeaders: ['Mcp-Session-Id']`, `allowedHeaders: ['Content-Type', 'mcp-session-id']`.
   - Enable DNS rebinding protection for local dev; set `allowedHosts`/`allowedOrigins` in remote.
     REVIEW: Self‑analyze correctness of CORS and protection settings.

4. ACTION: Vercel integration
   - Create `apps/oak-<server>/vercel/` example entry with `vercel.json` or docs for project settings.
   - Use Node runtime (not Edge) to ensure streaming semantics and timeouts fit typical use.
   - Provide `curl` and minimal client example to demonstrate streaming POST behavior; document SSE endpoints as optional.
     REVIEW: Self-analyze example deployability and documentation quality.

5. ACTION: Wire into one server (Curriculum MCP)
   - Add an HTTP entry that reuses existing DI wiring and registers the HTTP adapter.
   - Keep STDIO entry intact; choose entry via env/config.
     REVIEW: Self-analyze that DI remains explicit and no implicit env lookups are introduced.

6. QUALITY-GATE: Run from repo root
   - `pnpm format:check && pnpm type-check && pnpm lint && pnpm test && pnpm build && pnpm identity-report`

## Milestones

- M1: Framing spec and `http-streaming` transport completed with tests.
- M2: Node HTTP adapter integrated; STDIO parity contract tests pass.
- M3: Vercel example deployed for Curriculum MCP; docs published.

## Risks and mitigations

- Serverless timeouts or buffering on Vercel: prefer Node runtime, document limits, keep responses streaming.
- Session state on serverless: avoid session‑managed mode on Vercel; use stateless mode initially.
- Browser access: misconfigured CORS may block `Mcp-Session-Id` access; provide exact header config in docs.
- DNS rebinding: enable protection for local dev to avoid vulnerabilities.

## Metrics

- p95 tool latency local vs remote (comparable under typical workloads).
- Error rate/timeouts in remote environment (aim near-zero with retries disabled in demo).

## Documentation

- Add a short guide under `docs/usage/` describing Streaming HTTP usage and the Vercel deployment steps.

## References

- Streamable HTTP (TypeScript SDK) — setup, session management, CORS, DNS rebinding: [TypeScript SDK README — Streamable HTTP](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/README.md#streamable-http)
