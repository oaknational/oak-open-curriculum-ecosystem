# Curriculum MCP Enhancements Plan

Scope: Post‑enablement improvements for the Oak Curriculum MCP servers (STDIO and Streamable HTTP). Focus on OAuth 2.1, CI hardening, documentation, shared server core, and strict typed argument handling consistency across transports.

## Goals

- Deliver production‑ready OAuth 2.1 (Authorization Code + PKCE; Device Authorization) with audience‑bound RFC 9068 access tokens.
- Add CI post‑deploy smoke checks for the Vercel deployment.
- Remove temporary static token flows from production; keep local/CI guards narrowly scoped.
- Keep strict typed argument handling consistent across transports via SDK; add thin boundary wrapper only if necessary.
- Reduce duplication via a shared server core used by both STDIO and Streamable HTTP apps.
- Improve documentation and test coverage in line with repository rules.

## Tasks

### 1) OAuth 2.1 production implementation (AS + RS)
- Implement Authorization Server (AS) endpoints (co‑hosted):
  - `/.well-known/openid-configuration`, `/.well-known/jwks.json`
  - `/oauth/authorize` (Authorization Code + PKCE)
  - `/oauth/callback` (mint short‑lived access tokens, RFC 9068)
  - Optional: `/oauth/token` (code exchange) for more formal flows
- Token model:
  - Access token: short‑lived JWT (≈10 minutes), `iss = BASE_URL`, `aud = MCP_CANONICAL_URI`, include `scope`, `org`, and identity claims
  - Enforce domain/allow‑list at login; embed `org`/scopes in the minted token
  - Add Device Authorization Grant for headless/MCP clients
- Resource Server (RS):
  - Accept only audience‑bound access tokens (no Google ID tokens)
  - Validate `iss/aud/exp/iat` and signature via JWKS
  - Continue returning 401 with `WWW-Authenticate` referencing `/.well-known/oauth-protected-resource`
- Tests (no external calls):
  - Unit/integration: local JWKS, minted tokens, positive/negative verification
  - 401 `WWW-Authenticate` hints present and well‑formed
  - Device flow unit tests for code/user interaction surfaces
- Documentation:
  - User flows (UI and headless), envs, curl examples
  - Make clear that dev/CI tokens are not accepted in Vercel preview/production

### 2) CI post‑deploy Vercel smoke checks
- Pipeline step: call `GET /` and `GET /.well-known/oauth-protected-resource` on the deployed URL; assert 200 + expected JSON shape.
- Optionally, probe `POST /mcp` unauthorised path to assert 401 with `WWW-Authenticate` hints.

### 3) Replace temporary static token flows in production
- Ensure dev (`REMOTE_MCP_DEV_TOKEN`) and no‑auth modes are ignored on Vercel (preview/prod).
- Keep CI token path only when `CI === 'true'`; add deprecation date and remove once OAuth flows are live.

### 4) Type‑safe argument handling alignment (boundary vs SDK)
- Direction: centralise typed argument normalisation in the SDK; keep HTTP boundary thin.
- If required, provide a minimal boundary wrapper that accepts exact typed objects or JSON strings and delegates to the SDK.
- Tests:
  - String → typed object normalisation (single required query/path param and object forms)
  - Rejection paths for malformed strings and extra/unexpected fields

### 5) Shared server core to reduce duplication
- Create shared package exporting core MCP registration (e.g., `registerHandlers(server, mcpToolsModule, logger)`).
- Adopt in STDIO where safe to reduce duplication; keep changes minimal and reversible.
- Tests:
  - Non‑empty `list_tools` for both apps
  - Parity checks vs SDK exported `MCP_TOOLS`

### 6) Documentation improvements
- Add `docs/usage/streamable-http.md` covering:
  - Streamable HTTP usage, negotiation (`Accept: application/json, text/event-stream`), curl examples
  - Vercel deployment steps (Node runtime, Express default export)
  - Auth modes per environment; troubleshooting for CORS/DNS/401
- Update app README where needed; ensure session‑mode notes (optional) and required CORS headers are documented.

### 7) Identity policy extensions (Backlog)
- Beyond domain allow‑list, support an explicit email allow‑list; document IdP assumptions and accepted identity formats.

### 8) STDIO reliability guard
- Add/keep an explicit failing test asserting non‑empty `list_tools` for STDIO and fix wiring if ever regresses; keep green.

## Acceptance Criteria
- OAuth 2.1: AS and RS implemented; access tokens minted and validated; audience binding enforced; headless Device flow supported; tests pass without external calls.
- CI: post‑deploy Vercel smoke checks green for health and OAuth metadata; unauthorised path returns 401 with discovery hints.
- Production: dev/no‑auth/CI tokens not accepted on Vercel (except CI flow when `CI === 'true'`, clearly documented and slated for removal).
- Argument handling: SDK‑centred; HTTP boundary thin; tests cover string→typed paths and failure modes.
- Shared core adopted with parity tests; both transports list identical tools.
- Docs: usage guide added; app README updated; troubleshooting reflects Express runtime and security configuration.

## References
- See `research/search-app/mcp-demo-auth-approach.md` for the OAuth 2.1 model and endpoints.
- Remote MCP plan (archived) for prior context on transport, security, and tests.


