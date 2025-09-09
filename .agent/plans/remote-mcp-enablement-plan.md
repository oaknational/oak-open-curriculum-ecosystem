# Remote MCP Enablement Plan (Streamable HTTP + Express + Vercel)

Scope: enable Streamable HTTP for MCP servers using the official SDK transport, then provide an initial remote hosting solution on Vercel (Node runtime). Keep compile‑time tool generation and DI patterns unchanged.

## Goals

- Enable Streamable HTTP via `StreamableHTTPServerTransport` from `@modelcontextprotocol/sdk`.
- Provide a Vercel deployment template and docs so servers can be hosted remotely with streaming responses.
- Maintain parity with local STDIO behaviour through transport/adapter contract tests.
- Default to stateless mode end‑to‑end to align with serverless constraints and repo preferences.
- Renaming plan: Local server “Oak Curriculum MCP STDIO” (app: `apps/oak-curriculum-mcp-stdio`); Remote server “Oak Curriculum MCP Streamable HTTP” (app: `apps/oak-curriculum-mcp-streamable-http`). Drop POC label.
- App directory: `apps/oak-curriculum-mcp-streamable-http`; package name: `@oaknational/oak-curriculum-mcp-streamable-http`.
- OAuth‑first authorization aligned with MCP Basic Authorization (2025‑03‑26) and Vercel guidance; provide a dev fallback static token for local/testing.
- Preserve compile‑time SDK tool generation: remote server consumes the generated MCP tools from the Curriculum SDK; no bespoke tool definitions in the remote app.
- Expose OAuth Protected Resource Metadata endpoint (/.well-known/oauth-protected-resource) describing authorization servers and resource URL, per MCP Authorization.

## Non-goals

- Custom HTTP transport or bespoke NDJSON framing (use SDK transport).
- Cloudflare Workers support (tracked separately in `serverless-hosting-plan.md`).

## Acceptance criteria

- Server exposes Streamable HTTP endpoint using `StreamableHTTPServerTransport`.
- Stateless mode (no SSE) variant works end‑to‑end for tool calls; session‑managed variant (with SSE GET/DELETE) documented as optional.
- Note: Clients must send `Accept: application/json, text/event-stream` for Streamable HTTP transport negotiation; tests assert this and parse SSE-framed `data:` messages.
- Example deployment on Vercel for one server (e.g., Curriculum MCP) with documentation and a working curl example.
- E2E tests (vitest + supertest or similar) run against a local Express instance and PASS in CI, covering at minimum: list tools, tools/call success/error, 401 for missing/invalid auth, 200 for valid auth.
- Access control in place and documented:
  - Remote (Vercel preview/production): require OAuth 2.1 (authorization code + PKCE); POST /mcp requires `Authorization: Bearer <access_token>`.
  - Local development (localhost): permit no‑auth only when `REMOTE_MCP_ALLOW_NO_AUTH=true`; dev token allowed locally when present.
  - CI/CD: permit a static Bearer token via `REMOTE_MCP_CI_TOKEN` only when `CI === 'true'`.
  - Unauthorized requests return 401 and include MCP authorization hints in the JSON‑RPC error payload (per MCP Basic Authorization spec).
  - Dev token is ignored in any Vercel environment; it is local‑only. Optional: Vercel authentication in front of the function for team‑only access, with trade‑offs noted.
- ListTools parity: `list_tools` from the remote endpoint exactly matches the generated tools exported by the Curriculum SDK (source of truth), and a test asserts equality.
- OAuth 2.0 Protected Resource Metadata endpoint available at `/.well-known/oauth-protected-resource` and returns the canonical resource URI and the authorization server(s); OPTIONS preflight handled for CORS.
- Access tokens are short‑lived JWTs (RFC 9068) minted by our Authorization Server (AS), audience‑bound to the MCP canonical resource URI; the Resource Server (RS) validates `iss`, `aud`, `exp/iat` and signature with JWKS.
- Google ID tokens are NOT accepted as Bearer credentials to the RS; Google is used only for user sign‑in at the AS.
- Local testability documented (inspector flow) mirroring Vercel’s guidance.
- Unit/integration tests must not make network calls (use stubs/mocks). E2E tests for the HTTP server MAY make real network calls to the real Curriculum API to ensure end‑to‑end parity with the SDK tests.
- Env contract documented and enforced in tests:
  - `OAK_API_KEY` – curriculum API key (same as local app)
  - `REMOTE_MCP_MODE` – `stateless` | `session` (default `stateless`)
  - `REMOTE_MCP_ALLOW_NO_AUTH` – `true|false` (default `false`) enables no‑auth only on localhost
  - `REMOTE_MCP_DEV_TOKEN` – dev token for local usage; ignored on Vercel
  - `REMOTE_MCP_CI_TOKEN` – CI token honoured only when `CI === 'true'`
  - `ALLOWED_HOSTS`, `ALLOWED_ORIGINS` – comma‑separated lists for DNS‑rebinding protection and CORS
  - `LOG_LEVEL` – `debug|info|warn|error` (default `info`)
  - Hosting flags honoured: `VERCEL`, `VERCEL_ENV` (preview|production), `CI`
  - AS/RS (auth) variables:
    - `BASE_URL` – public base URL of the deployment (e.g. Vercel URL)
    - `MCP_CANONICAL_URI` – canonical resource URI (e.g. `${BASE_URL}/mcp`)
    - `OIDC_ISSUER` – Google issuer (`https://accounts.google.com`)
    - `OIDC_CLIENT_ID` – Google OAuth client id
    - `OIDC_REDIRECT_URI` – `${BASE_URL}/oauth/callback`
    - `ALLOWED_DOMAIN` – `thenational.academy`
    - `SESSION_SECRET` – cookie/session secret for AS
    - Dev toggle: `ENABLE_LOCAL_AS` (`true|false`) to run a minimal co‑hosted AS for local demos/tests

## Current status

- Streamable HTTP server implemented in `apps/oak-curriculum-mcp-streamable-http` (stateless)
  using the SDK transport, with Accept negotiation (`application/json, text/event-stream`).
- Security hardening in place:
  - DNS‑rebinding protection (fail‑closed with localhost defaults)
  - CORS middleware (mode‑aware headers; session headers documented)
  - OAuth Protected Resource metadata endpoint exposed at
    `/.well-known/oauth-protected-resource` (GET + OPTIONS)
- Auth: bearer middleware present with dev token support (local only) and CI token (CI only).
  OAuth path planned next per co‑hosted AS (Google sign‑in → our JWT access tokens).
- Tests:
  - Unit: 401 unauthorised; tools/list; tool success/error (SDK mocked)
  - E2E (supertest): 401 without `Authorization`; tools/list with dev token
- Tooling: tsconfig layouts standardised; typed ESLint covers tests/config; builds
  exclude tests for clean emits. Prettier runs from repo root only.
- All quality gates green (type‑check, lint, unit, e2e, build).

Gaps remaining to fully meet acceptance:

- E2E: add 200 path with valid auth and tool success (may call real API), and explicit
  error path assertions.
- ListTools parity assertion against SDK‑generated tools.
- Access control behaviour per environment (local no‑auth flag, CI token, OAuth on
  Vercel) and corresponding tests.

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

### Authorization model (co‑hosted AS + RS)

- AS (Authorization Server) endpoints (co‑hosted for demos):
  - `/.well-known/openid-configuration` (AS metadata)
  - `/.well-known/jwks.json` (JWKS for RS verification)
  - `/oauth/authorize` + `/oauth/callback` (Google OIDC Authorization Code + PKCE) [may be stubbed for demos]
- RS (Resource Server):
  - `/.well-known/oauth-protected-resource` (resource metadata with canonical URI and AS list)
  - Validates short‑lived JWT access tokens: `iss` = AS `BASE_URL`, `aud` = `MCP_CANONICAL_URI`.
  - Returns `401` with `WWW-Authenticate` referencing resource metadata.
- Local development policy:
  - Keep simple: allow `REMOTE_MCP_DEV_TOKEN` and optional `REMOTE_MCP_ALLOW_NO_AUTH=true` ONLY in local dev.
  - Feature‑gate local AS (`ENABLE_LOCAL_AS=true`) to expose metadata/JWKS and accept JWTs minted locally for E2E without adding attack surface to production.

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
   - DONE: Implemented CORS with mode‑aware headers; DNS‑rebinding protection enabled.
   - TODO: Add tests for allowed/blocked origins/hosts; document exposed headers for
     session mode.

3a. ACTION: Adopt OAuth2.1 authorization model (co‑hosted demo AS)
   - Do not accept Google ID tokens as Bearer; use Google only for user authentication at the AS.
   - RS exposes `/.well-known/oauth-protected-resource` with canonical resource and AS list; returns proper `WWW-Authenticate` on 401.
   - Add AS metadata endpoints: `/.well-known/openid-configuration`, `/.well-known/jwks.json`.
   - RS validates JWT access tokens (RFC 9068) using AS JWKS; enforce audience binding to `MCP_CANONICAL_URI`.
   - Local dev: behind `ENABLE_LOCAL_AS=true`, serve ephemeral JWKS and accept JWTs in E2E; keep dev token/no‑auth for local convenience only.

4. ACTION: Vercel integration
   - Create `apps/oak-curriculum-mcp-remote-poc/` with `vercel.json` or docs for project settings.
   - Use Node runtime (not Edge) to ensure streaming semantics and timeouts fit typical use.
   - Provide `curl` and minimal client example to demonstrate streaming POST behaviour; document SSE endpoints as optional.
     Example:

     ```bash
     curl -sS \
       -H "Authorization: Bearer $REMOTE_MCP_DEV_TOKEN" \
       -H 'Content-Type: application/json' \
       -X POST "$URL/mcp" \
       -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
     ```

     REVIEW: Self-analyze example deployability and documentation quality.

5. ACTION: Wire into one server (Curriculum MCP)
   - Add an HTTP entry that reuses existing DI wiring and registers the HTTP adapter.
   - Keep STDIO entry intact; choose entry via env/config.
   - Use the generated Curriculum SDK MCP tools via `createMcpToolsModule({ client })` and `getMcpTools()`; do not redefine tools in the remote app. The curriculum client should still read `OAK_API_KEY` only.
     REVIEW: Self-analyze that DI remains explicit and no implicit env lookups are introduced.

6. QUALITY-GATE: Run from repo root
   - `pnpm format:check && pnpm type-check && pnpm lint && pnpm test && pnpm build && pnpm identity-report`

7. ACTION: E2E tests for Express endpoint (real API allowed)
   - Status: Implemented 401 and list tools with dev token. Next: add 200 auth path and
     tool success/error assertions (may call real API on success path).

7a. ACTION: E2E tests for OAuth access tokens (no external calls)
   - Locally mint a short‑lived JWT using the same ephemeral signing key as the local AS (test‑only export) and assert RS accepts it (200).
   - Assert `WWW-Authenticate` on 401 references resource metadata.

8. ACTION: Coverage matrix to prove service works
   - Auth matrix: unauthorised 401; local dev token 200; CI token 200 (CI only); OAuth path documented for Vercel.
   - Transport negotiation: Accept header required; SSE parsing verified in responses.
   - Tools parity: list_tools matches SDK‑generated tools.
   - Tool execution: at least one happy path and one error path proved end‑to‑end (real API in E2E).
   - CORS/DNS‑rebinding: headers and host/origin checks enforced (tests for local/dev).

9. ACTION: Access control (OAuth‑first)
   - Implement OAuth 2.1 (authorization code + PKCE) using a Vercel‑compatible flow; accept `Authorization: Bearer <access_token>` minted by our AS (audience‑bound).
   - When unauthorized, return 401 and include MCP authorization metadata in the JSON‑RPC error to guide clients.
   - Provide a dev fallback: static Bearer token (env‑gated) for local/testing; ensure this is disabled in production.
   - Optional: document how to place Vercel authentication in front of the function for team‑only access.
     REVIEW: Self‑analyze simplicity and security trade‑offs vs spec recommendations; keep implementation canonical.
   - DONE: OAuth Protected Resource Metadata endpoint at `/.well-known/oauth-protected-resource` (GET + OPTIONS).
   - NEXT: Add AS metadata + JWKS, jose‑based JWT verification in RS; add local AS feature‑flag.

10. ACTION: Minimize duplication via shared workspace
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
