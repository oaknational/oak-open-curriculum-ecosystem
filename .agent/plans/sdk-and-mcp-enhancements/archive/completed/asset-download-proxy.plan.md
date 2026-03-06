---
name: "Asset Download Proxy — Secure, Clickable Download Links"
overview: "Add a download-asset MCP tool + server-side HMAC-signed download proxy so LLM-presented asset links work in browsers without exposing the Oak API key."
todos:
  - id: ws1-red
    content: "WS1 (RED): Token signing tests, execution tests, route tests. Tests MUST fail."
    status: complete
  - id: ws2-green
    content: "WS2 (GREEN): HMAC signing, tool definition, handler, Express route, application wiring. All tests MUST pass."
    status: complete
  - id: ws3-refactor
    content: "WS3 (REFACTOR): Tool guidance data, public API exports, code extraction for lint compliance."
    status: complete
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain (build, type-check, lint, test, e2e, smoke)."
    status: complete
  - id: ws5-design-simplification
    content: "WS5: Simplify capability-gated tool listing to always-list + fail-fast pattern."
    status: complete
  - id: ws6-tools-list-override-fix
    content: "WS6: Fix tools-list-override.ts to pass capabilities (then remove when simplified)."
    status: complete
  - id: ws7-e2e-verification
    content: "WS7: End-to-end verification — call download-asset via MCP, click signed URL, verify file downloads in browser."
    status: partial
  - id: ws8-review-remediations
    content: "WS8: Fix review findings — streaming error handlers, client disconnect handling, HMAC delimiter hardening, plan doc corrections."
    status: complete
  - id: ws9-quality-gates-final
    content: "WS9: Final quality gate chain after remediations."
    status: complete
isProject: false
---

# Asset Download Proxy — Secure, Clickable Download Links

**Last Updated**: 2026-03-06
**Status**: ✅ COMPLETE — code complete, all review remediations applied, ADR-126 written, quality gates pass (715 tests). WS7 E2E partially verified (tool in tools/list confirmed; full browser download pending manual verification).
**Scope**: Add a `download-asset` aggregated MCP tool and server-side download proxy that returns short-lived HMAC-signed URLs, enabling browsers to download lesson assets without exposing the Oak API key.

---

## Context

### Problem Statement

Asset download URLs from the Oak API require `Authorization: Bearer <apiKey>`. When an LLM presents these URLs as clickable links (e.g. in Claude Desktop, ChatGPT), the browser cannot inject the header, resulting in `UNAUTHORIZED` errors.

**Evidence**: Any `get-lessons-assets` response contains direct Oak API URLs. Clicking them in any MCP client UI fails with 401/403.

### Phase 1 (Completed Prior — Tool Guidance)

Added tool description guidance directing LLMs to the Oak website canonical URL for free downloads. This works but breaks the conversation flow — users must leave the LLM UI to download.

### Phase 2 (This Plan — Download Proxy)

Add a `download-asset` MCP tool + server-side download proxy. The tool generates HMAC-signed, time-limited URLs pointing to a new Express endpoint. That endpoint validates the token, then proxies the request to the Oak API with the real API key, streaming the binary response back to the browser.

### Existing Capabilities

- Aggregated tool pattern: hand-written tools combining multiple API calls (`search`, `fetch`, `explore-topic`)
- `UniversalToolExecutorDependencies` for dependency injection into tool handlers
- `AGGREGATED_TOOL_DEFS` / `AGGREGATED_HANDLERS` registration pattern
- `listUniversalTools` for tool listing with generated + aggregated tools
- `ASSET_TYPES` constant from `@oaknational/sdk-codegen/api-schema` (schema-derived)
- Clerk middleware with skip path support
- `tools-list-override.ts` for JSON Schema with examples in `tools/list`

---

## Design Principles

1. **Stateless authentication** — HMAC-SHA256 signature validated from URL params + shared `OAK_API_KEY`. No server-side session state. Works across Vercel function instances.
2. **Schema-first** — Asset type enum derived from generated `ASSET_TYPES`, not hand-listed.
3. **Dependency injection** — URL factory injected through the existing `UniversalToolExecutorDependencies` chain. No global state.
4. **Streaming** — Binary response piped via `Readable.fromWeb()`. No in-memory buffering of large files.
5. **Short-lived tokens** — 5-minute TTL. Sufficient for clicking; worthless for abuse.

**Non-Goals** (YAGNI):

- Batch/bulk downloads (one asset at a time is sufficient)
- Persistent download links (5-minute TTL is intentional)
- Custom download filenames (upstream Content-Disposition header is forwarded)
- stdio transport support (stdio users rely on canonical URL guidance from Phase 1)

---

## Architecture

```text
User asks for assets
  → LLM calls get-lessons-assets (existing tool, returns metadata)
  → LLM calls download-asset(lesson, type) (NEW tool)
    → Server generates HMAC-signed URL: /assets/download/:lesson/:type?sig=X&exp=T
    → LLM presents clickable link to user
  → User clicks link in browser
    → Express route validates signature + expiry
    → Server calls Oak API with Bearer token
    → Streams binary response back to user's browser
```

### Layer Responsibilities

| Layer | Responsibility |
|---|---|
| **SDK** (`aggregated-asset-download/download-token.ts`) | Pure HMAC-SHA256 signing/validation functions |
| **SDK** (`aggregated-asset-download/definition.ts`) | Tool definition + input schema (schema-derived enum) |
| **SDK** (`aggregated-asset-download/execution.ts`) | Validation + handler via injected URL factory |
| **App** (`asset-download/asset-download-route.ts`) | Express route, URL factory, `mountAssetDownloadProxy` |
| **App** (`handlers.ts`, `tool-handler-with-auth.ts`) | Wiring: URL factory → executor deps |
| **App** (`conditional-clerk-middleware.ts`) | Clerk skip for `/assets/download/` prefix |

---

## WS1 — Test Specification (RED)

### 1.1: Token Signing Tests

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/download-token.unit.test.ts`

12 tests covering:
- Deterministic signature generation (same inputs → same output)
- Valid signature verifies correctly
- Tampered lesson/type/expiry fails validation
- Expired token fails with `"Download link has expired"` reason
- Boundary case: token rejected at exact expiry moment (strict `>=` comparison)
- Uses `crypto.timingSafeEqual` (timing-safe comparison)

### 1.2: Execution Tests

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.unit.test.ts`

8 tests covering:
- Valid args produce download URL via injected factory
- Missing/empty lesson or type fails validation
- Non-asset-type string fails validation
- Extra properties rejected (strict schema)

### 1.3: Route Tests

**File**: `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.unit.test.ts`

Tests covering:
- Missing params return 400
- Invalid asset type returns 400
- Failed signature validation returns 403
- URL factory produces correct signed URLs with expected format

---

## WS2 — Implementation (GREEN)

### 2.1: HMAC Signing Pure Functions

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/download-token.ts`

```typescript
export function createDownloadSignature(
  lesson: string, type: string, expiresAt: number, secret: string
): string  // HMAC-SHA256 hex digest

export function validateDownloadSignature(
  lesson: string, type: string, signature: string,
  expiresAt: number, secret: string, nowMs: number
): { readonly valid: true } | { readonly valid: false; readonly reason: string }
```

### 2.2: Tool Definition

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`

- `DOWNLOAD_ASSET_TOOL_DEF` with annotations, security schemes, OpenAI _meta
- `DOWNLOAD_ASSET_INPUT_SCHEMA` using `[...ASSET_TYPES]` from `@oaknational/sdk-codegen/api-schema`

### 2.3: Tool Handler

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.ts`

- Zod-based validation (`DownloadAssetObjectSchema`) — no `as` type assertions
- `isAssetType()` type guard from codegen for enum validation
- `runDownloadAssetTool` calls injected `createAssetDownloadUrl` factory

### 2.4: SDK Registration

**Files modified**:
- `universal-tool-shared.ts` — Added optional `createAssetDownloadUrl` to `UniversalToolExecutorDependencies`
- `universal-tools/definitions.ts` — Added `'download-asset'` to `AGGREGATED_TOOL_DEFS`
- `universal-tools/executor.ts` — Added `handleDownloadAssetTool` to `AGGREGATED_HANDLERS`
- `universal-tools/list-tools.ts` — Lists all tools (fail-fast in handler if proxy unavailable)
- `tool-guidance-data.ts` — Added `'download-asset'` to `fetching` category
- `src/public/mcp-tools.ts` — Exported `createDownloadSignature`, `validateDownloadSignature`

### 2.5: Express Route and Application Wiring

**File**: `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts`

Three public functions:
- `createAssetDownloadRoute(deps)` — Express handler: validate → fetch upstream → stream
- `createAssetDownloadUrlFactory(baseUrl, createSignature, secret, ttlMs?)` — Closure-based URL factory
- `mountAssetDownloadProxy(app, displayHostname, oakApiKey, log)` — Bootstrap helper that receives a pre-resolved `displayHostname`; hostname-to-URL resolution (including localhost fallback) happens in `application.ts`

Refactored into small functions for lint compliance: `isNonEmptyString`, `validateRequestParams`, `forwardResponseHeaders`, `proxyUpstreamAsset`.

**File**: `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts`

Added `CLERK_SKIP_PREFIXES: ['/assets/download/']` — token IS the auth for this route.

**Files**: `handlers.ts`, `tool-handler-with-auth.ts`, `application.ts`

Dependency injection chain: `mountAssetDownloadProxy` → `createAssetDownloadUrl` → `handlerOptions` → `registerHandlers` → `handleToolWithAuthInterception` → executor deps → `handleDownloadAssetTool`.

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: Tool Guidance

Added `'download-asset'` to the `fetching` category in `tool-guidance-data.ts` so `get-curriculum-model` returns correct tool categorisation.

### 3.2: Code Extraction for Lint Compliance

- Extracted `mountAssetDownloadProxy` from `application.ts` to `asset-download-route.ts` (max-lines)
- Extracted `isNonEmptyString`, `validateRequestParams`, `forwardResponseHeaders`, `proxyUpstreamAsset` (max-statements, complexity)
- Replaced `as Record<string, unknown>` with Zod schema validation (consistent-type-assertions)
- Added eslint-disable for `Readable.fromWeb` type mismatch (Node.js / Web Streams incompatibility)

---

## WS4 — Quality Gates

All gates pass:

| Gate | Result |
|---|---|
| `pnpm build` | ✅ 14 tasks |
| `pnpm type-check` | ✅ 24 tasks |
| `pnpm lint:fix` | ✅ 0 errors |
| `pnpm test` | ✅ 703 app + 705 SDK = 1408 total |
| `pnpm format:root` | ✅ |
| `pnpm test:e2e` | ✅ 16 tests |
| `pnpm smoke:dev:stub` | ✅ |

---

## WS5 — Design Simplification

### Initial Design: Capability-Gated Tool Listing

Originally implemented `ToolListCapabilities` interface with `hasAssetDownloadProxy` boolean. The `listUniversalTools` function accepted optional capabilities, filtering out `download-asset` when the proxy wasn't available.

### Simplified Design: Always List + Fail Fast

**Decision**: Removed capability gating entirely. All tools are always listed. If `download-asset` is called without the proxy (e.g. on stdio), the handler returns a clear error message rather than silently hiding the tool.

**Rationale**:
- Simpler code — no `ToolListCapabilities` interface, no `CAPABILITY_GATED_TOOLS` map
- Better discoverability — LLMs can see the tool exists even if it can't be used
- Fail-fast with actionable error is better UX than invisible tools
- Removed ~30 lines of gating code from `list-tools.ts`

### Files Changed

- `list-tools.ts` — Removed `ToolListCapabilities`, `CAPABILITY_GATED_TOOLS`, capabilities parameter
- `handlers.ts` — Removed capabilities building, simplified `listUniversalTools` call
- `universal-tools/index.ts` — Removed `ToolListCapabilities` export
- `src/public/mcp-tools.ts` — Removed `ToolListCapabilities` export
- `universal-tools.unit.test.ts` — Removed capability gating test block

---

## WS6 — tools-list-override Fix

### Bug Found

`tools-list-override.ts` calls `listUniversalTools(generatedToolRegistry)` to build the `tools/list` response — this is a separate code path from `registerHandlers` that overrides the MCP SDK's default `tools/list` handler to preserve JSON Schema examples.

When capability gating existed, the override wasn't passing capabilities, so `download-asset` was always filtered out of `tools/list` even though it was registered for `tools/call`.

### Resolution

After the WS5 simplification removed capability gating, this became a non-issue — `listUniversalTools` no longer takes a capabilities parameter. The override naturally includes all tools.

### Local Dev Fix

`mountAssetDownloadProxy` originally required `displayHostname` (from Vercel env vars), returning `undefined` when not set. Locally, this meant the proxy never mounted.

**Fix**: In `application.ts`, the hostname-to-URL resolution falls back to `http://localhost:${process.env.PORT ?? '3333'}` when `displayHostname` is undefined. The route always mounts regardless of deployment environment.

---

## WS7 — End-to-End Verification (PENDING)

### Acceptance Criteria

1. Start local server (`pnpm dev:observe:noauth`)
2. Connect MCP client (Claude Code or Cursor)
3. Verify `download-asset` appears in `tools/list`
4. Call `download-asset(lesson: "<valid-lesson>", type: "slideDeck")`
5. Verify signed URL is returned with correct format
6. Click URL in browser — verify file downloads
7. Wait 5+ minutes, click same URL — verify 403 response
8. Verify stdio server does NOT provide working download (handler returns error)

**Status**: Tool confirmed present in `tools/list` via direct curl test. Full browser-based verification pending.

---

## WS8 — Review Remediations (PENDING)

Adversarial reviews were conducted on 2026-03-06 by four specialist agents: docs-adr-reviewer, security-reviewer, architecture-reviewer-wilma, architecture-reviewer-barney. Full findings below.

### 8.1: Must-Fix — Streaming Error Handlers

**Source**: architecture-reviewer-wilma (CRITICAL)
**File**: `asset-download-route.ts` — `proxyUpstreamAsset` function

**Problem**: `Readable.fromWeb(upstream.body).pipe(res)` has no error handlers. Stream errors (network timeout, upstream disconnect, client abort) are silently swallowed. The `try/catch` wrapper does not catch asynchronous pipe errors.

**Remediation**:

```typescript
const readable = Readable.fromWeb(upstream.body as any);
readable.on('error', (error) => {
  deps.logger.error('asset-download.stream.error', { error });
  if (!res.headersSent) {
    res.status(502).json({ error: 'Download stream error' });
  }
  res.destroy();
});
res.on('error', (error) => {
  deps.logger.error('asset-download.response.error', { error });
});
readable.pipe(res);
```

### 8.2: Must-Fix — Client Disconnect Handling

**Source**: architecture-reviewer-wilma (CRITICAL)
**File**: `asset-download-route.ts` — `proxyUpstreamAsset` function

**Problem**: No mechanism to abort the upstream fetch when the client disconnects mid-download. The fetch continues consuming API quota and Vercel function compute time on a dead connection.

**Remediation**: Use `AbortController` to cancel upstream fetch on response close:

```typescript
const controller = new AbortController();
res.once('close', () => controller.abort());

const upstream = await fetch(url, {
  headers: { Authorization: `Bearer ${deps.oakApiKey}` },
  redirect: 'follow',
  signal: controller.signal,
});
```

### 8.3: Should-Fix — HMAC Delimiter Hardening

**Source**: security-reviewer (IMPORTANT)
**File**: `download-token.ts` line 30

**Problem**: HMAC payload format `${lesson}:${type}:${expiresAt}` uses `:` as delimiter. If lesson slugs ever contain colons, this creates an ambiguous payload. Currently mitigated by `isAssetType` allow-list validation, but structurally fragile.

**Remediation**: Use JSON-serialised canonical form:

```typescript
const payload = JSON.stringify([lesson, type, expiresAt]);
```

**Risk**: This is a breaking change to the signature format. All in-flight signed URLs become invalid. Acceptable since the feature is not yet deployed to production.

### 8.4: Should-Fix — Hardcoded Upstream Base URL

**Source**: architecture-reviewer-barney (WARNING)
**File**: `asset-download-route.ts` line 20

**Problem**: `OAK_API_BASE_URL` is a module-level constant, not injected through `AssetDownloadRouteDeps`. Inconsistent with the DI philosophy used for all other dependencies in the same file.

**Remediation**: Add `oakApiBaseUrl` to `AssetDownloadRouteDeps` and inject from `mountAssetDownloadProxy`.

### 8.5: Should-Fix — Upstream Error Classification

**Source**: architecture-reviewer-wilma (MEDIUM)
**File**: `asset-download-route.ts` lines 94-107

**Problem**: All non-2xx upstream responses logged as generic `asset-download.upstream.error`. No distinction between auth failures (401/403), not-found (404), and transient errors (429, 503).

**Remediation**: Classify upstream errors by type for operational observability:

- 401/403 → `logger.error('asset-download.auth-error', ...)`
- 404 → `logger.warn('asset-download.not-found', ...)`
- 5xx → `logger.warn('asset-download.upstream-service-error', ...)`

### 8.6: Should-Fix — Signature Hex Validation

**Source**: security-reviewer (HARDENING)
**File**: `asset-download-route.ts` — `validateRequestParams`

**Problem**: The `sig` query parameter is checked for being a non-empty string but not validated as a hex string. `Buffer.from(signature, 'hex')` silently handles non-hex chars, caught by length check, but an explicit `/^[a-f0-9]{64}$/` check would reject garbage earlier.

**Remediation**: Add hex regex check in `validateRequestParams`.

### 8.7: Plan Document Corrections

**Source**: docs-adr-reviewer

Fixed in this update:

- ~~"Token has expired"~~ → `"Download link has expired"` (actual error message)
- ~~"token valid at exact expiry moment"~~ → "token rejected at exact expiry moment (strict `>=` comparison)"
- ~~`src/mcp/public/mcp-tools.ts`~~ → `src/public/mcp-tools.ts` (correct path)
- Fixed related plan link to point to archive: `../archive/completed/sitemap-driven-canonical-urls.plan.md`

---

## Documented Risks and Operational Considerations

### Vercel Timeout Constraint

**Source**: architecture-reviewer-wilma (CRITICAL — deployment architecture, not code)

Vercel serverless functions have strict timeout limits (10-30s depending on plan). Large file downloads (100MB+ videos at 5 Mbps = 160s) will exceed this limit, causing mid-download termination.

**Accepted risk for v1**: Most Oak lesson assets are small (slide decks ~2-5MB, worksheets ~1MB). Videos are the exception and are typically served via separate video hosting. If large file downloads become a requirement, options include:

- `Accept-Ranges: bytes` for resumable downloads
- Vercel Edge Network with extended streaming timeout
- Redirect to Oak API URL for files >10MB (requires separate auth solution)
- Document maximum supported file size in production

### API Key Rotation Coupling

**Source**: architecture-reviewer-wilma (CRITICAL — operational)

The HMAC signing secret is *derived* from the `OAK_API_KEY` via `deriveSigningSecret()` (HMAC-SHA256 key separation). If the API key rotates, all in-flight signed URLs (up to 5 minutes old) become invalid. Users receive 403 for links generated before rotation.

**Accepted risk**: Key rotation is infrequent. The 5-minute TTL limits the impact window. See ADR-126 for full analysis.

### Localhost Fallback in Production

**Source**: architecture-reviewer-wilma (MEDIUM)

If Vercel env vars (`VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`) are missing in production, signed URLs will point to `http://localhost:3333`. Links would be unreachable.

**Accepted risk**: Vercel deployment always sets these env vars. Local fallback is intentional for development. Could add startup validation if needed.

### `handleToolWithAuthInterception` Parameter Sprawl

**Source**: architecture-reviewer-barney (WARNING)

This function now takes 8 positional parameters. Pre-existing pressure made more visible by adding `createAssetDownloadUrl` as the 8th arg. Options object recommended as follow-up.

**Deferred**: Not blocking for this feature. Follow-up to consolidate into options object would reduce churn for future additions.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API key exposure via signed URL | Low | API key is NOT in the URL | HMAC signature only; secret never transmitted |
| Token replay (shared/leaked links) | Medium | 5-minute access to one asset | Short TTL, scoped to exact lesson + type |
| Vercel function instance variance | Low | Signing/validation on different instances | Stateless HMAC — URL params + shared env var |
| Large file timeout on Vercel | Medium | Download truncated mid-stream | Most assets small; document limit; add streaming error handlers (WS8.1) |
| Stream error during proxy | Medium | Silent failure, partial download | Add error handlers + client disconnect abort (WS8.1, WS8.2) |
| API key rotation | Low | In-flight URLs invalidated | 5-min TTL limits window; document in runbook |
| HMAC delimiter confusion | Low | Signature forgery via crafted slug | `isAssetType` allow-list mitigates; JSON canonical form fix in WS8.3 |

---

## Security Considerations

- **API key never in URL**: Signed URL contains only `sig` (HMAC hex) and `exp` (timestamp)
- **Short TTL**: 5-minute expiry. Leaked links become useless quickly
- **Scoped signatures**: HMAC covers lesson + type + expiry. Can't be reused for different assets
- **Timing-safe comparison**: Uses `crypto.timingSafeEqual` to prevent timing attacks
- **No Clerk auth needed**: The HMAC signature IS the auth for the download endpoint
- **Input validation**: Lesson slug validated as non-empty string, type validated against schema-derived `ASSET_TYPES` enum via `isAssetType()` allow-list at both SDK and route boundaries
- **Streaming proxy**: No request body parsing, minimal attack surface
- **Header allow-list**: Only `Content-Type`, `Content-Disposition`, `Content-Length` forwarded from upstream (no `Set-Cookie`, `Authorization` leakage)
- **SSRF mitigated**: Upstream URL uses hardcoded base with `encodeURIComponent` on path params; attacker cannot influence upstream host

---

## Foundation Alignment

- **Cardinal Rule**: Asset type enum derived from `ASSET_TYPES` (codegen output), not hand-listed
- **No Type Shortcuts**: Used Zod schema for validation instead of `as Record<string, unknown>`; one necessary eslint-disable for `Readable.fromWeb` Web/Node stream type mismatch
- **TDD**: Token signing tests written first (12 tests), execution tests (8 tests), route tests written before implementation
- **Quality Gates**: Full chain passes across all workspaces
- **Test Behaviour**: Tests validate signing determinism, tamper detection, expiry, URL format — not implementation details
- **Simple Mocks**: URL factory and signature functions injected as plain function deps

---

## Files Created

| File | Purpose |
|---|---|
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/download-token.ts` | HMAC-SHA256 signing/validation pure functions |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/download-token.unit.test.ts` | 12 token signing tests |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts` | Tool definition + schema-derived input schema |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.ts` | Zod validation + handler with injected URL factory |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.unit.test.ts` | 8 execution tests |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/index.ts` | Barrel file |
| `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts` | Express route, URL factory, mount helper |
| `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.unit.test.ts` | Route validation tests |

## Files Modified

| File | Change |
|---|---|
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts` | Added optional `createAssetDownloadUrl` to deps |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Added `'download-asset'` to `AGGREGATED_TOOL_DEFS` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` | Added `handleDownloadAssetTool` to `AGGREGATED_HANDLERS` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts` | Simplified to always list all tools |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/index.ts` | Updated exports |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts` | Added to `fetching` category |
| `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` | Exported signing functions |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts` | Updated for new tool, removed gating tests |
| `apps/oak-curriculum-mcp-streamable-http/src/application.ts` | Mount download proxy, pass URL factory |
| `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` | Pass `createAssetDownloadUrl` through handler chain |
| `apps/oak-curriculum-mcp-streamable-http/src/tool-handler-with-auth.ts` | Forward URL factory to executor deps |
| `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts` | Skip Clerk for `/assets/download/` |

---

## Key Decisions

| Decision | Rationale |
|---|---|
| HMAC-SHA256 over opaque tokens | Readable, debuggable URLs. No server-side token storage needed. Stateless across Vercel instances. |
| Derive secret from `OAK_API_KEY` | No new env var. HMAC(key, data) means the API key is never transmitted — only the signature. |
| 5-minute TTL | Long enough for a user to click. Short enough to limit replay risk. |
| Always list tool + fail-fast | Simpler than capability gating. Better discoverability. Actionable error messages. |
| Zod for input validation | Avoids `as` type assertions. Strict schema validation with clear error messages. |
| `Readable.fromWeb()` streaming | No in-memory buffering. Handles large slide decks and videos efficiently. |
| Clerk skip via prefix list | Download route authenticates via HMAC, not Clerk. Consistent with existing skip pattern. |
| Localhost fallback for baseUrl | `application.ts` falls back to `http://localhost:PORT` when Vercel env vars absent. Enables local development. |

---

## Documentation Propagation

- **ADR-126**: [HMAC-Signed Asset Download Proxy](../../../../docs/architecture/architectural-decisions/126-asset-download-proxy.md) — full security analysis, threat model, boundary design, transport awareness, accepted risks. Added to ADR README index.
- `docs/operations/troubleshooting.md` — updated during implementation
- `tool-guidance-data.ts` — `download-asset` added to fetching category
- TSDoc in `download-token.ts` — updated to reference derived signing secret (not OAK_API_KEY)

---

## Dependencies

**Blocking**: None — all prerequisite infrastructure existed.

**Related Plans**:
- Phase 1 tool guidance (canonical URL direction) — completed in prior session
- [sitemap-driven-canonical-urls.plan.md](../archive/completed/sitemap-driven-canonical-urls.plan.md) — related URL pattern work
