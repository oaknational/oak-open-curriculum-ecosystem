---
name: "Application-layer rate limiting for MCP HTTP routes"
overview: >
  Add express-rate-limit to the 4 CodeQL-flagged routes as defence-in-depth
  behind existing CDN rate limiting. Clears CodeQL js/missing-rate-limiting
  alerts that block PRs touching auth-routes.ts and oauth-proxy-routes.ts.
todos:
  - id: phase-0-design
    content: "Phase 0: Confirm limiter config and DI approach."
    status: pending
  - id: phase-1-implement
    content: "Phase 1: TDD — add rate limiting middleware with DI."
    status: pending
  - id: phase-2-verify
    content: "Phase 2: Quality gates, CodeQL verification, documentation."
    status: pending
---

# Application-Layer Rate Limiting for MCP HTTP Routes

**Last Updated**: 2026-03-31
**Status**: 🟡 PLANNING
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

### OAuth routes (POST /oauth/register, /oauth/token)

- **Window**: 15 minutes
- **Max requests**: 30 per IP
- **Rationale**: OAuth registration and token exchange are low-frequency
  operations. 30 per 15 minutes prevents credential stuffing while allowing
  normal OAuth flows (register once, token refresh every few minutes).

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

## Phase 0: Confirm Design

1. Verify `express-rate-limit` is compatible with the existing Express
   version and Vercel's serverless runtime
2. Confirm the in-memory store resets per cold start (acceptable for
   defence-in-depth; CDN handles sustained attacks)
3. Confirm `express-rate-limit` returns standard `429 Too Many Requests`
   with `Retry-After` header

**Acceptance criteria**:
- `express-rate-limit` installed as dependency
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

- `auth-routes.ts`: add limiter middleware before `mcpRouter` on both
  POST and GET /mcp routes
- `oauth-proxy-routes.ts`: add limiter middleware on POST /oauth/register
  and POST /oauth/token
- `bootstrap-helpers.ts`: add limiter to the auth-disabled /mcp routes

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
