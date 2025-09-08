# Remote MCP Enablement Plan (Streamable HTTP + Express + Vercel)

Scope: enable Streamable HTTP for MCP servers using the official SDK transport, then provide an initial remote hosting solution on Vercel (Node runtime). Keep compile‑time tool generation and DI patterns unchanged.

## Goals

- Enable Streamable HTTP via `StreamableHTTPServerTransport` from `@modelcontextprotocol/sdk`.
- Provide a Vercel deployment template and docs so servers can be hosted remotely with streaming responses.
- Maintain parity with local STDIO behaviour through transport/adapter contract tests.
- App directory: `apps/oak-curriculum-mcp-remote-poc`; package name: `@oaknational/curriculum-mcp-remote-poc`.
- OAuth‑first authorization aligned with MCP Basic Authorization (2025‑03‑26) and Vercel guidance; provide a dev fallback static token for local/testing.
- Preserve compile‑time SDK tool generation: remote server consumes the generated MCP tools from the Curriculum SDK; no bespoke tool definitions in the remote app.

## Non-goals

- Custom HTTP transport or bespoke NDJSON framing (use SDK transport).
- Cloudflare Workers support (tracked separately in `serverless-hosting-plan.md`).

## Acceptance criteria

- Server exposes Streamable HTTP endpoint using `StreamableHTTPServerTransport`.
- Stateless mode (no SSE) variant works end‑to‑end for tool calls; session‑managed variant (with SSE GET/DELETE) documented as optional.
- Example deployment on Vercel for one server (e.g., Curriculum MCP) with documentation and a working curl example.
- E2E tests (vitest + supertest or similar) run against a local Express instance and PASS in CI, covering at minimum: list tools, tools/call success/error, 401 for missing/invalid auth, 200 for valid auth.
- Access control in place and documented:
  - OAuth‑first: implement OAuth 2.1 (authorization code + PKCE) to obtain access tokens; POST /mcp requires `Authorization: Bearer <token>`.
  - Unauthorized requests return 401 and include MCP authorization hints in the JSON‑RPC error payload (per MCP Basic Authorization spec).
  - Dev fallback: allow a static Bearer token for local/dev only (env‑gated), documented and covered by tests.
  - Optional: Vercel authentication in front of the function for team‑only access (Oak Vercel accounts), with notes on MCP client header behaviour and trade‑offs.
- ListTools parity: `list_tools` from the remote endpoint exactly matches the generated tools exported by the Curriculum SDK (source of truth), and a test asserts equality.
- Local testability documented (inspector flow) mirroring Vercel’s guidance.

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
- SDK usage: remote app uses the same MCP TypeScript SDK and the generated curriculum SDK; only the transport changes.

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
   - Create `apps/oak-curriculum-mcp-remote-poc/` with `vercel.json` or docs for project settings.
   - Use Node runtime (not Edge) to ensure streaming semantics and timeouts fit typical use.
   - Provide `curl` and minimal client example to demonstrate streaming POST behaviour; document SSE endpoints as optional.
     REVIEW: Self-analyze example deployability and documentation quality.

5. ACTION: Wire into one server (Curriculum MCP)
   - Add an HTTP entry that reuses existing DI wiring and registers the HTTP adapter.
   - Keep STDIO entry intact; choose entry via env/config.
   - Use the generated Curriculum SDK MCP tools via `createMcpToolsModule({ client })` and `getMcpTools()`; do not redefine tools in the remote app.
     REVIEW: Self-analyze that DI remains explicit and no implicit env lookups are introduced.

6. QUALITY-GATE: Run from repo root
   - `pnpm format:check && pnpm type-check && pnpm lint && pnpm test && pnpm build && pnpm identity-report`

7. ACTION: E2E tests for Express endpoint
   - Add vitest + supertest tests: list tools, tools/call happy path, tool error path; 401 vs 200 auth cases.
     REVIEW: Self‑analyze test coverage sufficiency and reliability (no network; local server instance only).

8. ACTION: Access control (OAuth‑first)
   - Implement OAuth 2.1 (authorization code + PKCE) using a Vercel‑compatible flow; accept requests with `Authorization: Bearer <access_token>`.
   - When unauthorized, return 401 and include MCP authorization metadata in the JSON‑RPC error to guide clients.
   - Provide a dev fallback: static Bearer token (env‑gated) for local/testing; ensure this is disabled in production.
   - Optional: document how to place Vercel authentication in front of the function for team‑only access.
     REVIEW: Self‑analyze simplicity and security trade‑offs vs spec recommendations; keep implementation canonical.

9. ACTION: Minimize duplication via shared workspace
   - Create shared package (e.g., `packages/curriculum-mcp-server-core`) exporting:
     - `registerHandlers(server, mcpToolsModule, logger)` core MCP handler registration (shared by local and remote)
     - Optionally, a shared tools module factory if we later refactor the local app
   - Adopt shared registration in the local server where low risk to reduce duplication.
     REVIEW: Self‑analyze change scope and safety; keep changes minimal and reversible.

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
- Vercel — Deploy MCP servers: [Deploy MCP servers to Vercel](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel)
- Vercel — Enabling MCP authorization: [Enabling authorization](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel#enabling-authorization)
- Vercel template — MCP with Express: [Template](https://vercel.com/templates/next.js/mcp-with-express)
- Vercel Labs — Express MCP example: [express-mcp repository](https://github.com/vercel-labs/express-mcp)
