# Remote MCP Continuation Prompt

Read `GO.md` and follow ALL instructions before starting. Replace any sub‑agent
reviews with your own concise reflections on whether the current direction is
the most useful one. Keep todos small, actionable, and measurable.

Purpose: Provide a stable, minimal context to continue work on the Remote MCP Enablement plan in a fresh chat/session.

## Grounding

1. Read `GO.md` and follow ALL instructions. Replace any sub-agent reviews with concise reflections on direction usefulness and alternatives.
2. Read `.agent/plans/remote-mcp-enablement-plan.md` and use it as the authoritative plan. Keep this continuation prompt and the plan in sync.

## Current Intent

- Deliver Oak Curriculum MCP Streamable HTTP (stateless) for the Curriculum SDK, with tests and a Vercel-ready adapter. Local server is Oak Curriculum MCP STDIO (`apps/oak-curriculum-mcp-stdio`).
- Maintain parity with local STDIO behaviour; reuse DI wiring and generated tools. No bespoke tool definitions.
- Provide Vercel docs and a working curl example. Implement access control per environment (OAuth on Vercel, optional no‑auth locally, CI token) and CORS/DNS-rebinding safeguards.
  - Streamable HTTP negotiation: clients set `Accept: application/json, text/event-stream`; tests use this and parse SSE `data:` frames even in stateless mode.

## Current Progress

- Implemented Streamable HTTP server (stateless) with per-request handling and Accept
  negotiation. Security hardened with CORS and DNS‑rebinding protection.
- OAuth Protected Resource metadata endpoint added (GET + OPTIONS).
- Co‑hosted local AS (feature‑flag) added for demos/tests:
  - `/.well-known/openid-configuration` + `/.well-known/jwks.json`
  - RS verifies JWT access tokens with jose; E2E mints a short‑lived token and gets 200
- Unit tests: 401 unauthorised, tools/list, tool success/error (SDK mocked).
- E2E tests: 401 missing `Authorization`, tools/list with dev token, JWT happy path, CORS/DNS negative checks, list‑tools parity, 401 `WWW-Authenticate` assertions, and a stubbed success-path with SSE parsing.
- STDIO server: added failing test for non‑empty `list_tools`, enhanced startup diagnostics (tool count, transport connect) logged to `.logs`, and fixed a Cursor config path issue (root cause of “No tools or prompts”).
- All quality gates green (type-check, lint, unit, e2e, build).
- All quality gates green (type-check, lint, unit, e2e, build). Production deploy on Vercel runs Node LAMBDAS with the Express framework; default export of the Express app is in `apps/oak-curriculum-mcp-streamable-http/src/index.ts`.

Reflection: STDIO works because it passes compile‑time typed argument objects
into executors. Some HTTP clients send `arguments` as a string (plain/JSON),
which our strict typed executors rejected—hence remote failures with local
success. The fix belongs at the HTTP boundary: a typed parameter builder that
accepts exact typed objects and optionally parses JSON strings to those types,
failing fast otherwise.

### Recent fixes and operational learnings

- Vercel runtime contract: added default export of Express app to satisfy Express framework; removed monorepo root `api/server.ts` and rewrites.
- OAuth endpoints: ensure `/.well-known/*` initialize before bearer checks to avoid 401s; metadata does not require `OAK_API_KEY`.
- Hosts: wildcard host support for dynamic preview URLs (e.g. `poc-oak-open-curriculum-*.vercel.thenational.academy`).
- SSE parsing: tests parse first `data:` JSON line; no brittle string matching.

## Next Actions (short)

1. Type‑safe parameter builder at HTTP boundary. Accept exact typed objects; optionally parse JSON strings; fail fast otherwise. Remove dynamic/unknown types.
2. Documentation: keep `apps/oak-curriculum-mcp-streamable-http/README.md` aligned (Express framework, default export, troubleshooting, OAuth tokens usage).
3. CI: add a post-deploy Vercel smoke check (GET `/` and `/.well-known/oauth-protected-resource`).
4. Optional: add E2E tool success path using the real API (`E2E_REAL_API=true` + `OAK_API_KEY`) and explicit error path assertion.

## Non‑negotiables

- Stateless mode by default; session mode optional and documented.
- Unit/integration tests stay offline. HTTP E2E MAY call the real Curriculum API to prove end‑to‑end behaviour (mirrors SDK E2E). E2E configs must not load unit test network-blocking setup.
  - Avoid CI-only static token flows to reduce credential surface; prefer OAuth or local dev token only in local workflows.
- Use `OAK_API_KEY` for curriculum client; do not introduce new keys for the same purpose.
- Centralise env reading; avoid hidden lookups inside handlers.

## Environment Contract (dev + tests)

- `OAK_API_KEY` – curriculum API key (required)
- `REMOTE_MCP_MODE` – `stateless` | `session` (default `stateless`)
- `REMOTE_MCP_ALLOW_NO_AUTH` – `true|false` (default `false`) enables no‑auth on localhost only
- `REMOTE_MCP_DEV_TOKEN` – dev bearer token for local/testing; ignored on Vercel
- `REMOTE_MCP_CI_TOKEN` – CI bearer token, honoured only when `CI === 'true'`
- `ALLOWED_HOSTS`, `ALLOWED_ORIGINS` – comma-separated lists; fail-closed defaults; allow localhost in dev; hosts support `*` wildcards
- `LOG_LEVEL` – `debug|info|warn|error` (default `info`)
- Hosting flags: `VERCEL`, `VERCEL_ENV` (preview/production), `CI`
- AS/RS demo flags: `ENABLE_LOCAL_AS` (`true|false`), `LOCAL_AS_JWK` (public JWK JSON), `BASE_URL`, `MCP_CANONICAL_URI`

## Implementation Spine (execute in small, testable steps)

1. Ensure app exists `apps/oak-curriculum-mcp-streamable-http/` (Node runtime). Wire minimal Express server.
2. Add HTTP entry using `StreamableHTTPServerTransport`.
   - Stateless: per-request server+transport; close on response end.
   - Reuse local MCP handler registration and DI wiring.
3. Add auth middleware per environment:
   - Vercel (preview/prod): Require OAuth access token `Authorization: Bearer <token>`
   - Local (localhost): allow no‑auth when `REMOTE_MCP_ALLOW_NO_AUTH=true`; otherwise accept `REMOTE_MCP_DEV_TOKEN`
   - CI: accept `REMOTE_MCP_CI_TOKEN` only when `CI === 'true'`
   - Always return 401 with MCP authorization hints when unauthorized.
4. CORS and security:
   - Configure CORS; expose `Mcp-Session-Id` in session mode.
   - Enable DNS rebinding protection with `ALLOWED_HOSTS/ORIGINS`.
5. Tests (vitest + supertest): list tools, tool success, tool error, 401 vs 200.
6. Add `/.well-known/oauth-protected-resource` endpoint (GET + OPTIONS) that returns issuer metadata; include minimal docs.
7. Vercel docs: env mapping, curl example, and local dev steps (see below).

### Vercel quick config (demo)

Required

- `OAK_API_KEY` – curriculum API key
- `BASE_URL` – `https://curriculum-mcp-alpha.oaknational.dev`
- `MCP_CANONICAL_URI` – `${BASE_URL}/mcp`
- `ALLOWED_HOSTS` – `poc-oak-open-curriculum-*.vercel.thenational.academy,curriculum-mcp-alpha.oaknational.dev,localhost`

Optional

- `ALLOWED_ORIGINS` – set only if calling from a browser origin
- `LOG_LEVEL` – defaults to `info`
- `ENABLE_LOCAL_AS` – set to `true` for demo JWT flow; set `LOCAL_AS_JWK` to your public JWK JSON
- `REMOTE_MCP_CI_TOKEN` – CI only

## Curl Example (dev token)

```bash
curl -sS \
  -H "Authorization: Bearer $REMOTE_MCP_DEV_TOKEN" \
  -H 'Content-Type: application/json' \
  -X POST "$URL/mcp" \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
```

## Live validation (production)

Health

```bash
curl -sS -i https://curriculum-mcp-alpha.oaknational.dev/
```

Expect 200 and JSON body with status ok.

OAuth metadata

```bash
curl -sS -i https://curriculum-mcp-alpha.oaknational.dev/.well-known/oauth-protected-resource
```

Expect 200 JSON with resource and authorization_servers.

401 challenge (no auth)

```bash
curl -sS -i -H 'Accept: application/json, text/event-stream' -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}' \
  https://curriculum-mcp-alpha.oaknational.dev/mcp
```

Expect 401 with `WWW-Authenticate` including `resource` and `authorization_uri`.

## Quality Gates (from repo root)

Run often:

```bash
pnpm format:check && pnpm type-check && pnpm lint && pnpm test && pnpm build && pnpm identity-report
```

## Self‑Review Checklist (use on each PR/commit batch)

- Stateless path covered by tests; no flakey network dependencies
- Env contract documented in app README and tests
- Tool list parity with Curriculum SDK confirmed
- Unauthorized errors include MCP authorization hints
- Logs are written to repo `.logs` in dev only; no noisy console output in production

## Future considerations (capture for next session)

- Identity policy: today we allow any `*.thenational.academy` email via the AS domain rule. We also want an explicit allow‑list of email addresses. If we keep Google as the IdP, those emails must be Google accounts; if we support additional IdPs, we must clearly document the accepted identity formats and how the allow‑list is validated.
- STDIO server regression: Cursor shows no tools from the STDIO server despite green tests. Hypothesis: shared handler refactor or DI mis‑wiring. Add red test in the STDIO app asserting tool list non‑empty, then fix wiring and keep the test.
