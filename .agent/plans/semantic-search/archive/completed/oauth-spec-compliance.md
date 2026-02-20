---
name: OAuth Spec Compliance — 401 on Initial Request
overview: >
  The MCP HTTP server has two spec-violating auth bypasses: (1) discovery
  methods (initialize, tools/list, etc.) skip auth entirely, preventing MCP
  clients from triggering the OAuth bootstrap flow, and (2) noauth tools
  (get-changelog, get-rate-limit) skip HTTP auth entirely, violating the
  MCP spec requirement that "Authorization MUST be included in every HTTP
  request from client to server." This plan removes both bypasses, bringing
  the server into full MCP spec compliance. DANGEROUSLY_DISABLE_AUTH mode
  is preserved unchanged. ChatGPT securitySchemes metadata is preserved
  (it describes scope requirements, not transport auth). Tool-level scope
  checking in check-mcp-client-auth.ts is preserved (noauth tools skip
  scope verification, not base auth).
todos:
  - id: analyse-impact
    content: "ANALYSIS: Map every file affected by removing the discovery-method auth bypass. Identify all tests that assert discovery methods skip auth, all conditional-clerk-middleware references, and all comments citing 'OpenAI ChatGPT requirements' as justification for skipping auth on discovery."
    status: completed
  - id: red-e2e-system-behaviour
    content: "RED (E2E — system behaviour): Update E2E tests to specify the new system behaviour FIRST, per testing-strategy.md. DISCOVERY BYPASS: (1) auth-enforcement.e2e.test.ts: invert 'Discovery Methods (No Auth Required)' section — assert 401 for initialize and tools/list without auth headers. (2) application-routing.e2e.test.ts: invert 'Discovery methods (no auth required)' section (lines 65-96). NOTE: lines 97-110 (fake-token test) are NOT a simple inversion — a fake Bearer token will fail Clerk verification and return 401; either expect 401 or delete. (3) public-resource-auth-bypass.e2e.test.ts: the unauthenticated resources/list call (line 83) will return 401; refactor to use the widget URI constant directly. (4) web-security-selective.e2e.test.ts: lines 323-333 assert tools/list returns < 400; after the change it returns 401. Fix as appropriate (test is about web security headers not auth). NOAUTH TOOL BYPASS: (5) auth-enforcement.e2e.test.ts: invert 'Public Tools (noauth)' section (lines 435-485) — assert 401 for get-changelog and get-rate-limit without auth headers. (6) application-routing.e2e.test.ts: invert 'Public generated tools (no auth required)' section (lines 113-163) — assert 401 for get-changelog, get-changelog-latest, get-rate-limit without auth. Run ALL E2E tests — they MUST fail against the current system."
    status: completed
  - id: red-integration-router
    content: "RED (integration): Write/update integration tests for mcp-router and conditional-clerk-middleware. In mcp-router.integration.test.ts: (a) invert 'discovery methods' assertions — auth middleware MUST be called for initialize and tools/list; (b) invert 'noauth tools' assertions — auth middleware MUST be called for get-changelog and get-rate-limit. In conditional-clerk-middleware.integration.test.ts, invert skip assertions — clerkMiddleware MUST run for discovery methods. Run tests — they MUST fail."
    status: completed
  - id: red-unit-classifier
    content: "RED (unit): In conditional-clerk-middleware.unit.test.ts, update the 6 discovery method assertions (currently assert shouldSkipClerkMiddleware returns true). Run tests — they MUST fail."
    status: completed
  - id: green-remove-auth-bypasses
    content: "GREEN: Remove BOTH auth bypasses from mcp-router.ts: (1) discovery-method bypass (isDiscoveryMethod check in shouldSkipAuth) and (2) noauth tool bypass (toolRequiresAuth check in tools/call conditional). After this change, mcp-router.ts simplifies dramatically: shouldSkipAuth only checks for public resource reads (resources/read with public URI); everything else goes through options.auth(). The entire tools/call conditional block, getToolNameFromBody, hasParams, hasName become dead code — delete in refactor step. Also remove CLERK_SKIP_METHODS and isDiscoveryMethod call from conditional-clerk-middleware.ts (module is SIMPLIFIED, not deleted — retains CLERK_SKIP_PATHS and public resource URI bypasses). DANGEROUSLY_DISABLE_AUTH is UNAFFECTED — the entire auth stack is bypassed at app startup when this flag is set. Tool-level scope checking in check-mcp-client-auth.ts is UNAFFECTED — toolRequiresAuth() there determines whether deeper scope verification is needed AFTER base auth is already enforced at the HTTP layer."
    status: completed
  - id: green-all-tests-pass
    content: "GREEN: Run all tests (unit, integration, E2E). ALL tests from the RED phase MUST now pass. Public resource reads (widget HTML, documentation) must still bypass auth — these are accessed via resources/read with specific URIs, not discovery methods."
    status: completed
  - id: refactor-delete-dead-code
    content: "REFACTOR: Delete dead code created by the auth bypass removals. (1) Delete mcp-method-classifier.ts and mcp-method-classifier.unit.test.ts if isDiscoveryMethod has no remaining consumers. (2) Delete discovery-methods-sync.unit.test.ts — sync invariant no longer applies. (3) In mcp-router.ts: delete getToolNameFromBody, hasParams, hasName (dead after tools/call conditional removal); remove imports of toolRequiresAuth, isUniversalToolName, UniversalToolName, isDiscoveryMethod. (4) Consider adding a replacement sync invariant test for public-resource skip parity (both layers still have public-resource skip logic). (5) Check for any other dead code across all affected files."
    status: completed
  - id: refactor-docs
    content: "REFACTOR: Update TSDoc across all affected files. Specifically: (1) mcp-router.ts — rewrite module and createMcpRouter TSDoc to reflect simplified routing (public resource reads skip auth, everything else goes through auth). Remove all references to discovery bypass, noauth tool bypass, '@see isDiscoveryMethod', '@see toolRequiresAuth'. (2) tool-auth-checker.ts line 33 — remove stale '@see isDiscoveryMethod'. (3) conditional-clerk-middleware.ts — update TSDoc to reflect reduced scope (path-based and public-resource skips only). (4) auth-routes.ts line 94 — remove 'Public tools (noauth): Skip auth' from auth model comment; update to reflect all POST /mcp requests require auth. (5) check-mcp-client-auth.ts — update TSDoc to clarify that toolRequiresAuth() check is about SCOPE verification, not HTTP transport auth. Base auth is enforced at the HTTP layer; this function determines whether deeper scope checking is needed. (6) README.md auth section — update to reflect that all MCP requests require authentication."
    status: completed
  - id: adr-supersede-056
    content: "ADR: Write a new ADR superseding ADR-056 (Conditional Clerk Middleware for Discovery). ADR-056 explicitly states 'Discovery methods MUST work without authentication' — this is incorrect per MCP 2025-11-25 spec. The new ADR documents: (1) the spec requirement that Authorization MUST be included in every HTTP request, (2) why the discovery bypass AND the noauth tool HTTP bypass were both incorrect, (3) the distinction between HTTP transport auth (all requests) and tool-level scope metadata (securitySchemes describes scope consent, not auth bypass), (4) the latency trade-off (acknowledge ADR-056's '97% faster' measurement, accept regression for spec compliance, note JWKS caching as the correct optimisation path), (5) what remains of the conditional middleware (path-based skips for /.well-known/*, /health, /ready), (6) public resource reads bypass auth via URI check in resources/read (not a spec violation — these are specific resource URIs, not MCP methods). Mark ADR-056 status as 'Superseded by ADR-NNN'. Update docs/architecture/architectural-decisions/README.md index with the new ADR entry and cross-link."
    status: completed
  - id: update-testing-strategy-example
    content: "DOCS: Update .agent/directives/testing-strategy.md lines 199-227. The example currently encodes the old (incorrect) behaviour ('SCENARIO: We want discovery methods to work WITHOUT authentication'). Update to reflect the corrected understanding, or replace with a different example that does not reference the superseded approach."
    status: completed
  - id: chatgpt-tool-auth
    content: "VERIFY: Confirm that ChatGPT tool-level auth (securitySchemes + _meta['mcp/www_authenticate']) still works correctly. ChatGPT's auth flow is: 401 on initial request, OAuth, token, initialize succeeds, tools/list with securitySchemes per tool (noauth/oauth2), tool-level scope challenges via _meta. The securitySchemes metadata describes which tools need additional scopes AFTER base auth, not which tools skip HTTP auth. After this change, ALL tools require base auth (valid Bearer token); securitySchemes tells ChatGPT which tools need scope consent. noauth tools (get-changelog, get-rate-limit) work with the base token without additional scope consent."
    status: completed
  - id: cursor-e2e-verify
    content: "VERIFY: Absorbed into oauth-validation-and-cursor-flows.plan.md — the problem persists despite AS metadata endpoint, needs further investigation after spec-compliant path is validated."
    status: cancelled
  - id: quality-gates
    content: "Run full quality gate chain in correct order: pnpm format:root && pnpm type-check && pnpm lint:fix && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm build"
    status: completed
isProject: false
---

## Problem Statement

The MCP HTTP server (`oak-curriculum-mcp-streamable-http`) skips
authentication for all "discovery methods" (`initialize`, `tools/list`,
`resources/list`, `prompts/list`, `resources/templates/list`,
`notifications/initialized`). When an MCP client like Cursor connects:

1. Client sends `POST /mcp` with `{method: "initialize"}` — **Server returns
   200** (auth skipped)
2. Client sends `POST /mcp` with `{method: "tools/list"}` — **Server returns
   200** (auth skipped)
3. Client considers the connection fully established — **never shows login
   UI**
4. Agent invokes a tool → `tools/call` → **Server returns 401** with
   `WWW-Authenticate` header
5. Client surfaces "Unauthorized" error to the agent — **no OAuth flow
   triggered**

### Evidence (2026-02-19)

Server logs show Cursor (`Cursor/2.5.17`) connecting successfully without
auth:

```text
clerkMiddleware skipped for discovery/public method  mcpMethod=tools/list
clerkMiddleware skipped for discovery/public method  mcpMethod=prompts/list
clerkMiddleware skipped for discovery/public method  mcpMethod=resources/list
```

Cursor never fetches `/.well-known/oauth-protected-resource` and never
encounters a 401.

curl confirms the 401 with correct `WWW-Authenticate` header IS returned for
`tools/call`:

```text
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="http://localhost:3333/.well-known/oauth-protected-resource"
x-clerk-auth-reason: dev-browser-missing
```

But Cursor never reaches this point because the connection already succeeded.

## Root Cause

The codebase has three layers that bypass auth for MCP requests:

1. **`conditional-clerk-middleware.ts`**: `CLERK_SKIP_METHODS` set skips
   `clerkMiddleware()` entirely for discovery methods (latency optimisation)
2. **`mcp-router.ts` (discovery)**: `shouldSkipAuth()` returns `true` for
   discovery methods, bypassing the auth middleware
3. **`mcp-router.ts` (noauth tools)**: `toolRequiresAuth()` returns `false`
   for tools with `securitySchemes: noauth`, bypassing the auth middleware
   entirely for `tools/call` requests to `get-changelog`, `get-rate-limit`,
   etc.

Bypasses 1 and 2 cite "Per MCP spec and OpenAI Apps requirements" as
justification. Bypass 3 conflates "no additional scopes needed" (correct
interpretation of `securitySchemes: noauth`) with "no HTTP auth needed"
(incorrect). The MCP spec requires "Authorization MUST be included in every
HTTP request from client to server" — this applies to ALL tools regardless
of their scope requirements.

## Spec Analysis

### MCP 2025-11-25 Specification (Authoritative)

The [MCP Authorization
spec](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
is unambiguous. The sequence diagram shows:

```text
C->>M: MCP request without token
M->>C: HTTP 401 Unauthorized (may include WWW-Authenticate header)
```

The spec does NOT distinguish between discovery and execution methods for
auth. **Any unauthenticated MCP request MUST receive a 401.**

Key quotes:

- "MCP clients MUST be able to parse `WWW-Authenticate` headers and respond
  appropriately to `HTTP 401 Unauthorized` responses from the MCP server."
- "Invalid or expired tokens MUST receive a HTTP 401 response."
- "Authorization MUST be included in every HTTP request from client to
  server."

### OpenAI Apps SDK (ChatGPT-Specific)

The [OpenAI Apps SDK auth
docs](https://developers.openai.com/apps-sdk/build/auth) describe a
**ChatGPT-specific extension** that builds ON TOP of the base MCP auth:

1. **Base flow**: 401 on initial request → OAuth → token → all subsequent
   requests include Bearer token
2. **Tool-level extension**: `securitySchemes` per tool (`noauth` / `oauth2`)
   and `_meta["mcp/www_authenticate"]` in tool responses for incremental scope
   consent

The OpenAI docs say: "Triggering the tool-level OAuth flow requires both
metadata (`securitySchemes` and the resource metadata document) **and**
runtime errors that carry `_meta['mcp/www_authenticate']`."

This means ChatGPT **does** expect the base 401 flow. The `securitySchemes`
are about which tools need which scopes AFTER the initial OAuth is complete,
not about whether discovery can happen without auth.

### Clerk MCP Documentation

The [Clerk MCP client connection
guide](https://clerk.com/docs/guides/development/mcp/connect-mcp-client)
for Cursor says:

> "Select the **Needs login** option when it loads."

This confirms Cursor shows a "Needs login" button — but only when the server
returns 401 during initial connection.

### Make MCP (Working Reference)

The [Make MCP Cursor
guide](https://developers.make.com/mcp-server/connect-using-oauth/usage-with-cursor)
confirms the working pattern:

> "In MCP Tools, you'll see Make added as an MCP tool. Click Needs login."

Make's server returns 401 on initial request — Cursor shows login. Our server
does not — Cursor does not.

### MCPJam OAuth Checklist

The [MCPJam OAuth
guide](https://www.mcpjam.com/blog/mcp-oauth-guide) Step 1:

> "The MCP client tries to make a call to your MCP server, but it does not
> have a bearer token. In the case where a bearer token is missing or
> incorrect, the server throws a 401 and authorization flow is initialized."
>
> "Check: Your MCP server returns a 401 with `WWW-Authenticate` when no
> bearer token is presented."

## Correct Architecture

### Before (Incorrect)

```text
POST /mcp {initialize}              → no auth check → 200 (OAuth never triggered)
POST /mcp {tools/list}              → no auth check → 200
POST /mcp {tools/call get-changelog}→ no auth check → 200 (noauth tool, spec violation)
POST /mcp {tools/call search}       → auth check    → 401 (too late, client confused)
```

### After (Spec-Compliant)

```text
POST /mcp {initialize}              → auth check → 401 + WWW-Authenticate
  → Client discovers auth server, does OAuth, gets token
POST /mcp {initialize}              → auth check → token valid → 200
POST /mcp {tools/list}              → auth check → token valid → 200
POST /mcp {tools/call get-changelog}→ auth check → token valid → 200 (no scope check needed)
POST /mcp {tools/call search}       → auth check → token valid → 200 (scope check passes)
```

### What Stays The Same

- `/.well-known/oauth-protected-resource` remains publicly accessible (RFC
  9728 requirement)
- Public resource reads (widget HTML, documentation) can still bypass auth
  (these are `resources/read` with specific URIs, not `tools/call`)
- ChatGPT `securitySchemes` per tool remain in `tools/list` response —
  they describe which tools need additional scope consent AFTER initial
  auth, not which tools skip HTTP auth. `noauth` means "no additional
  scope consent needed", not "no token needed"
- `_meta["mcp/www_authenticate"]` tool-level error responses remain
  functional for scope step-up
- The `auth-error-response.ts` module is unaffected
- Tool-level scope checking in `check-mcp-client-auth.ts` is unaffected —
  `toolRequiresAuth()` at this layer correctly skips deeper scope
  verification for `noauth` tools (base auth is enforced at HTTP layer)
- `DANGEROUSLY_DISABLE_AUTH` mode is unaffected — the entire auth stack is
  bypassed at app startup when this flag is set

### Latency Consideration

The conditional Clerk middleware was a latency optimisation (175ms → 5ms for
discovery). After this change, ALL requests go through `clerkMiddleware()`.
The 170ms overhead now applies to `initialize` and `tools/list`. This is
acceptable because:

1. These methods are called once at connection time, not repeatedly
2. The alternative (no login prompt) is a complete failure
3. Spec compliance is non-negotiable

If latency becomes a problem, the correct optimisation is to cache the Clerk
JWKS/session state, not to skip auth.

## Affected Files

### Must Change

| File | Change |
|------|--------|
| `mcp-router.ts` | Remove BOTH bypasses: (1) `isDiscoveryMethod` check in `shouldSkipAuth`, (2) `toolRequiresAuth()` check in `tools/call` conditional. Router simplifies to: public resource reads skip auth, everything else goes through `options.auth()`. Dead code after change: `getToolNameFromBody`, `hasParams`, `hasName`, imports of `toolRequiresAuth`, `isUniversalToolName`, `UniversalToolName`, `isDiscoveryMethod`. |
| `conditional-clerk-middleware.ts` | Remove `CLERK_SKIP_METHODS` set and `isDiscoveryMethod()` call. Module is SIMPLIFIED, not deleted — retains `CLERK_SKIP_PATHS` and public resource URI bypasses. Update TSDoc. |
| `mcp-method-classifier.ts` | Delete if no remaining consumers (per "no dead code" rule). |
| `mcp-router.integration.test.ts` | Invert "discovery methods (no auth required)" assertions — auth middleware MUST be called for all MCP methods. Also invert any "noauth tools skip auth" assertions — auth middleware MUST be called for ALL `tools/call` requests regardless of `securitySchemes`. |
| `conditional-clerk-middleware.integration.test.ts` | Invert skip assertions for discovery methods — clerkMiddleware MUST run. |
| `conditional-clerk-middleware.unit.test.ts` | Invert 6 discovery method assertions (lines 33-63) that assert `shouldSkipClerkMiddleware` returns `true`. |
| `mcp-method-classifier.unit.test.ts` | Delete (if classifier is deleted). |
| `discovery-methods-sync.unit.test.ts` | Delete — sync invariant no longer applies. |
| `auth-routes.ts` | Update TSDoc — remove "discovery skip" and "Public tools (noauth): Skip auth" from auth model comment (line 94). |
| `tool-handler-with-auth.integration.test.ts` | Update "Public tools (noauth)" section description (line 176-197) — test is about scope checking bypass, not HTTP auth bypass. Tool still executes without scope check, but base HTTP auth is now enforced. |
| `auth-enforcement.e2e.test.ts` | Invert "Discovery Methods (No Auth Required)" section (lines 125-161) — assert 401 for `initialize` and `tools/list` without auth headers. Also invert "Public Tools (noauth)" section (lines 435-485) — assert 401 for `get-changelog` and `get-rate-limit` without auth. |
| `application-routing.e2e.test.ts` | Invert "Discovery methods (no auth required)" section (lines 65-96). Lines 97-110 (fake-token test) need special handling — fake Bearer token fails Clerk verification, expect 401 or delete. Also invert "Public generated tools (no auth required)" section (lines 113-163) — assert 401 for `get-changelog`, `get-changelog-latest`, `get-rate-limit` without auth. |
| `public-resource-auth-bypass.e2e.test.ts` | Unauthenticated `resources/list` call (line 83) will return 401. Refactor to use widget URI constant directly instead of discovering via `resources/list`. |
| `web-security-selective.e2e.test.ts` | Lines 323-333 assert `tools/list` returns `< 400`; after change it returns 401. Fix: accept 401, add auth token, or use `dangerouslyDisableAuth` (test is about web security headers, not auth). |
| `tool-auth-checker.ts` | Remove stale `@see isDiscoveryMethod` TSDoc reference (line 33) — broken link after classifier deletion. Logic unchanged — `securitySchemes` and `noauth` tool bypass via `toolRequiresAuth()` are unaffected. |
| `README.md` | Update auth section to reflect that all MCP requests require authentication. |
| ADR-056 | Change status to "Superseded by ADR-NNN". |
| `docs/architecture/architectural-decisions/README.md` | Add new ADR entry and cross-link to ADR-056. |
| `.agent/directives/testing-strategy.md` | Update lines 199-227 — example encodes old (incorrect) behaviour. |

### Must NOT Change

| File | Reason |
|------|--------|
| `auth/mcp-auth/mcp-auth.ts` | Already correct — returns 401 with WWW-Authenticate. Now executes for discovery methods (previously unreachable), but the `!req.headers.authorization` check returns 401 before `getAuth()` is invoked — safe. |
| `auth/mcp-auth/mcp-auth-clerk.ts` | Downstream consumer of Clerk context via `getAuth()`. Architecturally relevant (now executes for discovery methods) but code is unchanged. |
| `auth/mcp-body-parser.ts` | Still needed by `conditional-clerk-middleware.ts` (public resource URI extraction) and `mcp-router.ts`. Must not be removed. |
| `auth/public-resources.ts` | Public resource bypass is correct (not discovery). |
| `auth-error-response.ts` | Tool-level `_meta` errors unaffected. |
| `check-mcp-client-auth.ts` | Logic unchanged — `toolRequiresAuth()` check at this layer is about SCOPE verification, not HTTP transport auth. After the HTTP-layer fix, base auth is enforced before this function runs. `noauth` tools correctly skip deeper scope checking here. TSDoc clarification tracked in `refactor-docs`. |
| `check-mcp-client-auth.unit.test.ts` | Tests are correct — they test scope checking behaviour. "Public tools" section (lines 129-143) verifies that tools not requiring scope auth return undefined. This is still correct after the HTTP-layer change. |
| `tool-auth-checker.unit.test.ts` | Tests correctly verify that `toolRequiresAuth()` reads `securitySchemes` metadata. Function logic unchanged. |
| `/.well-known/oauth-protected-resource` route | Must remain public per RFC 9728. |
| `auth-bypass.e2e.test.ts` | `DANGEROUSLY_DISABLE_AUTH` tests unaffected — entire auth stack is bypassed in that mode, which continues unchanged. |

## Open Questions

1. **DANGEROUSLY_DISABLE_AUTH mode**: When `DANGEROUSLY_DISABLE_AUTH=true`,
   should discovery methods still skip auth? Currently the entire auth stack
   is bypassed in this mode. This should continue unchanged — it is a
   development convenience, not a spec concern.

2. **STDIO server**: The STDIO server is unaffected — it does not use HTTP
   auth. No changes needed there.

3. **Deployed server (alpha)**: The deployed server at
   `https://curriculum-mcp-alpha.oaknational.dev/mcp` has the same bug.
   This fix will deploy automatically via CI/CD.

## Review Record

### Architecture Review Round 1 (2026-02-19)

**Verdict**: APPROVED WITH OBSERVATIONS

Reviewer confirmed:

- All changes confined to `apps/` — no boundary violations
- Dependency direction preserved (core <- libs <- apps)
- `DANGEROUSLY_DISABLE_AUTH` mode unaffected
- Latency trade-off assessment is accurate and proportionate

Note: Round 1 review noted "`noauth` tools unaffected — bypass via
`toolRequiresAuth()`". This was correct at the time but is now superseded
by the scope expansion to also remove the noauth tool HTTP bypass.

Observations addressed in plan update:

1. ADR-056 supersession — added `adr-supersede-056` todo
2. Missing `conditional-clerk-middleware.unit.test.ts` — added to table
3. Specific E2E test files enumerated — replaced "Multiple E2E tests"
4. `conditional-clerk-middleware.ts` post-change scope clarified
5. Missing "Must NOT Change" entries added

### Directives Review (2026-02-19)

Reviewed against `AGENT.md`, `rules.md`, `testing-strategy.md`,
`schema-first-execution.md`.

Critical finding: TDD ordering. The `testing-strategy.md` directive says
"System behaviour changes: Update E2E tests FIRST". Original plan had E2E
test updates in GREEN phase (after implementation). Corrected: E2E tests now
in RED phase (`red-e2e-system-behaviour`), before implementation.

Additional finding: `testing-strategy.md` lines 199-227 contain an example
that encodes the old (incorrect) behaviour. Added
`update-testing-strategy-example` todo.

### Architecture Review Round 2 — Barney (2026-02-19)

**Verdict**: ISSUES FOUND

Critical findings addressed in plan update:

1. `public-resource-auth-bypass.e2e.test.ts` was incorrectly in "Must NOT
   Change" — its unauthenticated `resources/list` call (line 83) will return
   401. Moved to "Must Change" with instruction to use widget URI constant
   directly.
2. `web-security-selective.e2e.test.ts` was missing from affected files —
   lines 323-333 assert `tools/list` returns `< 400`. Added to "Must
   Change".
3. ADR supersession task was missing ADR index updates — added
   `docs/architecture/architectural-decisions/README.md` to "Must Change"
   and to `adr-supersede-056` todo.

Warnings addressed:

4. Quality gate command order corrected to repo's preferred order (format →
   type-check → lint → test → build).
5. Sync invariant replacement noted — `refactor-delete-dead-code` todo now
   notes the need for a public-resource skip parity test.

### Architecture Review Round 2 — Fred (2026-02-19)

**Verdict**: APPROVED WITH OBSERVATIONS

Fred independently verified:

- `mcp-auth.ts` safety: `!req.headers.authorization` check returns 401
  before `getAuth()` is invoked for unauthenticated requests — safe

Note: Fred verified "`noauth` tools bypass operates through
`toolRequiresAuth()`, independent of `isDiscoveryMethod()` — unaffected".
This was correct at the time but is now superseded by scope expansion —
the `toolRequiresAuth()` HTTP bypass is also being removed. Fred's
verification that the bypass was a separate code path remains accurate
and useful for understanding the architecture.

- Dead code deletion (classifier + sync test) justified
- TDD ordering correct per `testing-strategy.md`
- Latency trade-off proportionate
- ADR-056 supersession approach correct
- Import directions respected, 0 violations

Warnings addressed in plan update:

1. `tool-auth-checker.ts` has stale `@see isDiscoveryMethod` reference (line
   33) — moved to "Must Change" for TSDoc update.
2. `mcp-router.ts` has stale `@see isDiscoveryMethod` reference (line 123)
   — already in "Must Change", now explicitly named in `refactor-docs` todo.
3. `application-routing.e2e.test.ts` fake-token test (lines 97-110) is not
   a simple inversion — fake Bearer token fails Clerk verification. Added
   note to `red-e2e-system-behaviour` todo and "Must Change" table.
4. `README.md` was mentioned in `refactor-docs` todo but missing from "Must
   Change" table — added.

Recommendation noted: consider renaming `conditional-clerk-middleware.ts`
post-change since its scope narrows to path-based and public-resource skips.
Deferred to refactor phase.

## References

- [MCP 2025-11-25 Authorization
  Spec](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [OpenAI Apps SDK
  Authentication](https://developers.openai.com/apps-sdk/build/auth)
- [Clerk MCP Connect
  Client](https://clerk.com/docs/guides/development/mcp/connect-mcp-client)
- [Make MCP Cursor
  Guide](https://developers.make.com/mcp-server/connect-using-oauth/usage-with-cursor)
- [MCPJam OAuth
  Checklist](https://www.mcpjam.com/blog/mcp-oauth-guide)
- [RFC 9728 — OAuth 2.0 Protected Resource
  Metadata](https://datatracker.ietf.org/doc/html/rfc9728)
