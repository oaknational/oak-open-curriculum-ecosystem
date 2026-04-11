---
name: "Application-layer rate limiting for MCP HTTP routes"
overview: >
  Add express-rate-limit to the 4 CodeQL-flagged routes as defence-in-depth
  behind existing CDN rate limiting. Clears CodeQL js/missing-rate-limiting
  alerts that block PRs touching auth-routes.ts and oauth-proxy-routes.ts.
todos:
  - id: phase-0-design
    content: "Phase 0: Confirm limiter config and DI approach."
    status: completed
    note: "express-rate-limit v8.3.2 installed, trust proxy configured, 3 profiles defined."
  - id: phase-1-implement
    content: "Phase 1: TDD — add rate limiting middleware with DI."
    status: completed
    note: "6 routes across 3 profiles wired via RateLimiterFactory DI. 16 new tests, all 659 pass."
  - id: phase-2-verify
    content: "Phase 2: Quality gates, CodeQL verification, documentation."
    status: completed
    note: "ADR-144 written, all quality gates green, 6 reviewers invoked."
---

# Application-Layer Rate Limiting for MCP HTTP Routes

**Last Updated**: 2026-03-31
**Status**: ✅ COMPLETE (2026-03-31)
**Scope**: Add `express-rate-limit` to 4 auth-protected routes in the HTTP
MCP server as defence-in-depth behind existing Vercel/CDN edge protection.

## Context

CodeQL flags 4 routes with `js/missing-rate-limiting` (high severity):

| Alert | File | Route | Line |
|-------|------|-------|------|
| #5 | `auth-routes.ts` | GET /mcp (auth-disabled) | 80 |
| #6 | `auth-routes.ts` | POST /mcp (auth-enabled) | 111 |
| #7 | `auth-routes.ts` | GET /mcp (auth-enabled) | 113 |
| #8 | `oauth-proxy-routes.ts` | POST /oauth/register | 48 |

The repository ruleset enforces `security_alerts_threshold: high_or_higher`
on the CodeQL check, so these alerts block any PR that touches the affected
files — including the observability PR #73 which merged main's changes.

CDN-layer rate limiting (Vercel edge) already protects against volumetric
DDoS. Application-layer rate limiting provides defence-in-depth: it catches
abuse that bypasses the CDN (direct origin access, credential stuffing on
OAuth, slowloris-style attacks at the application level).

## Solution

Use [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit)
with injected configuration. Two limiters with different profiles:

### MCP routes (POST/GET /mcp)

- **Window**: 1 minute
- **Max requests**: 120 per IP (2 req/s sustained)
- **Rationale**: MCP tool calls are interactive — a human or agent calling
  tools in rapid succession. 2 req/s sustained is generous for interactive
  use; batch operations go through the SDK directly.

### OAuth routes (POST /oauth/register, POST /oauth/token, GET /oauth/authorize)

- **Window**: 15 minutes
- **Max requests**: 30 per IP
- **Rationale**: OAuth registration, token exchange, and authorise redirects
  are low-frequency operations. 30 per 15 minutes prevents credential
  stuffing and upstream Clerk amplification while allowing normal OAuth
  flows. GET /oauth/authorize is included because each request triggers an
  upstream Clerk authorisation — an amplification vector.

### Asset download proxy (GET /assets/download/:lesson/:type)

- **Window**: 1 minute
- **Max requests**: 60 per IP
- **Rationale**: HMAC-signed URLs have expiry but no single-use constraint.
  Replay of a valid URL could exhaust the Oak API per-key rate limit,
  degrading service for all users. 60/min is generous for legitimate
  download use.

### DI approach

The limiter factory is injected via `RateLimiterFactory` — a function that
returns Express middleware. Production uses `express-rate-limit`; tests
pass a no-op middleware. This follows ADR-078 (DI for testability) and
avoids `vi.mock`.

```typescript
type RateLimiterFactory = (options: {
  readonly windowMs: number;
  readonly limit: number;
  readonly message: string;
}) => RequestHandler;
```

The factory is passed through `createApp` options, defaulting to
`express-rate-limit`'s `rateLimit` in production.

### Non-Goals

- Custom store (Redis, Memcached) — the default in-memory store is
  sufficient for a single-instance Vercel deployment
- Per-user rate limiting — IP-based is correct for defence-in-depth;
  per-user throttling is a product decision, not a security one
- Rate limiting on unauthenticated routes (/healthz, /, landing page) —
  these are read-only, idempotent, and cached at the CDN

## Security Review Findings (2026-03-31)

The security reviewer identified the following risks. All must be
addressed during implementation:

### CRITICAL: `trust proxy` not configured

Express has no `trust proxy` setting. Behind Vercel's reverse proxy,
`req.ip` returns the CDN's IP, not the client's. Without this, all
requests share one rate limit bucket — either blocking everyone or
protecting nobody.

**Fix**: Add `app.set('trust proxy', 1)` in `initializeAppInstance` or
`setupBaseMiddleware`, before any rate limiting middleware. Integration
tests must verify `req.ip` reflects `X-Forwarded-For`.

### IMPORTANT: In-memory store is per-instance on Vercel serverless

Vercel scales horizontally; each instance has its own counter. The rate
limiter catches single-instance bursts but does not provide strong
guarantees under horizontal scaling. The CDN layer provides the strong
guarantee.

**Fix**: Document honestly in the ADR: "Application-layer rate limiting
on Vercel serverless is probabilistic. It catches naive single-instance
bursts. The CDN layer is the authoritative rate limiter."

### IMPORTANT: Response body format

429 responses must match the existing error format (`{ error, message }`
or the OAuth `{ error, error_description }` shape) for consistency.

## Phase 0: Confirm Design

1. Verify `express-rate-limit` is compatible with the existing Express
   version and Vercel's serverless runtime
2. Confirm the in-memory store resets per cold start (acceptable for
   defence-in-depth; CDN handles sustained attacks)
3. Confirm `express-rate-limit` returns standard `429 Too Many Requests`
   with `Retry-After` header
4. **Configure `trust proxy`** — `app.set('trust proxy', 1)` so `req.ip`
   reflects the real client IP behind Vercel's reverse proxy

**Acceptance criteria**:
- `express-rate-limit` installed as dependency
- `trust proxy` configured and tested
- `pnpm type-check` passes with the import

## Phase 1: TDD — Add Rate Limiting

### Task 1.1: Create rate limiter DI types and factory

- Define `RateLimiterFactory` type
- Create `createDefaultRateLimiterFactory` wrapping `express-rate-limit`
- Add to `createApp` options with default

### Task 1.2: RED — Write integration tests

Test that:
- MCP routes return 429 after exceeding the limit
- OAuth routes return 429 after exceeding the limit
- Rate limit headers are present in responses
- The limiter factory is injectable (test uses a recording fake)

### Task 1.3: GREEN — Wire limiters to routes

- `auth-routes.ts`: add MCP limiter before `mcpRouter` on POST and
  GET /mcp routes
- `oauth-proxy-routes.ts`: add OAuth limiter on POST /oauth/register,
  POST /oauth/token, and GET /oauth/authorize
- `bootstrap-helpers.ts`: add MCP limiter to the auth-disabled /mcp routes
- `asset-download-route.ts`: add asset limiter on GET /assets/download

### Task 1.4: REFACTOR — TSDoc, cleanup

**Acceptance criteria**:
- `pnpm check` passes
- No new lint errors or warnings
- Integration tests prove 429 behaviour

## Phase 2: Verify and Document

1. Run `pnpm check` — all gates green
2. Verify CodeQL alerts #5, #6, #7, #8 are resolved (push and check)
3. Update `docs/operations/sentry-deployment-runbook.md` if rate limit
   env vars are added
4. Update the HTTP app README with rate limiting section

**Acceptance criteria**:
- CodeQL `js/missing-rate-limiting` alerts cleared
- `pnpm check` passes
- Documentation updated

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Legitimate high-volume client blocked | Low | Medium | Generous defaults (120/min MCP, 30/15min OAuth); CDN handles most traffic |
| In-memory store lost on cold start | Expected | Low | Acceptable for defence-in-depth; CDN is primary layer |
| Rate limit headers leak server info | Low | Low | Standard `Retry-After` is expected; no custom headers |

## ADR: Multi-Layer Security Architecture

This work should produce an ADR documenting the full multi-layer rate
limiting and security architecture. The ADR captures the design rationale
for where each protection lives and why — not just the application layer
added here, but the complete stack:

| Layer | Protection | Owner |
|-------|-----------|-------|
| **DNS** | DNS rebinding guard (`createDnsRebindingMiddleware`) — rejects requests with unrecognised `Host` headers | App (Express middleware) |
| **CDN/Edge** | Volumetric DDoS, geographic blocking, bot detection, TLS termination | Vercel edge / CDN config |
| **Application — auth** | OAuth 2.1 via Clerk (`mcpAuth` middleware), CORS, security headers (CSP, HSTS, X-Frame-Options) | App (Express middleware) |
| **Application — rate limit** | Per-IP rate limiting on auth-protected routes (this plan) | App (`express-rate-limit`) |
| **Upstream API** | Oak API key authentication, per-key rate limiting, quota management | Oak API (external) |

The ADR should cover:

1. **Defence-in-depth rationale** — why each layer exists and what it
   catches that other layers miss
2. **Trust boundaries** — CDN → app origin, app → upstream API, client →
   CDN, iframe sandbox → host
3. **Rate limit coordination** — how CDN limits, app limits, and upstream
   API limits interact (cascading 429s, back-pressure propagation)
4. **DNS rebinding** — why the existing guard exists, what it protects,
   and its relationship to CORS and the `Host` header allowlist
5. **Security headers** — the current CSP, HSTS, and frame-options
   posture and how it relates to OpenAI Apps SDK widget sandboxing
6. **Failure modes** — what happens when each layer fails (CDN down,
   app rate limit exhausted, upstream API returns 429)

**Suggested ADR number**: next available after ADR-143.

## Dependencies

- **Blocking**: None — can be done on a separate branch
- **Related**: PR #73 (observability) — currently blocked by these alerts

## References

- CodeQL alerts: #5, #6, #7, #8
- [`express-rate-limit` docs](https://www.npmjs.com/package/express-rate-limit)
- ADR-078: Dependency Injection for Testability
- `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts`
