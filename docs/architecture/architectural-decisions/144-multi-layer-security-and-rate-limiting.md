# ADR-144: Multi-Layer Security Architecture and Application Rate Limiting

## Status

Accepted (2026-03-31)

**Related**: [ADR-078 (Dependency Injection for Testability)](078-dependency-injection-for-testability.md), [ADR-143 (Coherent Structured Fan-Out for Observability)](143-coherent-structured-fan-out-for-observability.md)

## Context

CodeQL flags four routes in the HTTP MCP server with
`js/missing-rate-limiting` (high severity): POST /mcp, GET /mcp (both
auth modes), and POST /oauth/register. The repository ruleset enforces
`security_alerts_threshold: high_or_higher` on the CodeQL check, so these
alerts block any PR that touches the affected files.

The server is deployed on Vercel's serverless platform behind their CDN
edge. CDN-layer rate limiting already protects against volumetric DDoS.
Application-layer rate limiting provides **defence-in-depth**: it catches
abuse that bypasses the CDN (direct origin access, credential stuffing,
upstream amplification, slowloris-style application-level attacks).

Two amplification vectors exist:

1. **OAuth authorise redirect** (`GET /oauth/authorize`): each request
   triggers an upstream Clerk authorisation, consuming per-application
   quota. No authentication required — the redirect is public.

2. **HMAC-signed asset replay**: download URLs have a 5-minute TTL but
   no single-use constraint. Within the window, a valid URL can be
   replayed to exhaust the upstream Oak API per-key rate limit.

## Decision

Add per-IP application-layer rate limiting using `express-rate-limit`
with dependency injection for testability. Three rate limit profiles
cover six routes:

| Profile   | Routes                                                        | Window     | Limit  | Rationale                                             |
| --------- | ------------------------------------------------------------- | ---------- | ------ | ----------------------------------------------------- |
| **MCP**   | POST /mcp, GET /mcp (both auth modes)                         | 1 minute   | 120/IP | 2 req/s sustained — generous for interactive tool use |
| **OAuth** | POST /oauth/register, POST /oauth/token, GET /oauth/authorize | 15 minutes | 30/IP  | Low-frequency operations; prevents amplification      |
| **Asset** | GET /assets/download/:lesson/:type                            | 1 minute   | 60/IP  | Prevents replay-based upstream API exhaustion         |

### Multi-Layer Architecture

The HTTP MCP server relies on five defence layers. Each catches threats
the others miss; no single layer is sufficient alone.

| Layer                        | Protection                                                                                    | Failure Mode                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **DNS**                      | DNS rebinding guard rejects unrecognised `Host` headers (applied selectively to landing page) | Bypassed if attacker controls DNS for an allowed host       |
| **CDN/Edge**                 | Volumetric DDoS, geographic blocking, bot detection, TLS termination (Vercel edge)            | Bypassed by direct origin access or low-rate attacks        |
| **Application — auth**       | OAuth 2.1 via Clerk, CORS, security headers (CSP, HSTS, X-Frame-Options)                      | Bypassed if OAuth token compromised or auth disabled        |
| **Application — rate limit** | Per-IP rate limiting via `express-rate-limit` (this ADR)                                      | Distributed attacks across IPs; counter reset on cold start |
| **Upstream API**             | Oak API per-key rate limiting and quota management                                            | Exhaustible via amplification from our server               |

### Trust Boundaries

- **Client → CDN**: untrusted. CDN applies edge protection.
- **CDN → app origin**: semi-trusted. `app.set('trust proxy', 1)` is
  configured so `req.ip` reflects the real client IP from
  `X-Forwarded-For`, not the CDN's address. Without this, all clients
  share one rate limit bucket.
- **App → upstream API**: authenticated via `OAK_API_KEY`. Our server is
  the trust principal, not the end user.
- **Iframe sandbox → host**: OpenAI Apps SDK widget runs in a sandboxed
  iframe; CSP controls outbound requests.

### DI Approach

The rate limiter factory is injected via `CreateAppOptions.rateLimiterFactory`,
following ADR-078. Production uses `express-rate-limit`; tests inject a
no-op or recording fake. The factory is called three times during
bootstrap with the MCP, OAuth, and asset profiles.

### Honest Limitations

**Application-layer rate limiting on Vercel serverless is probabilistic.**
Vercel scales horizontally; each instance has its own in-memory counter.
The rate limiter catches naive single-instance bursts but does not
provide strong guarantees under horizontal scaling. Cold starts reset
all counters.

**The CDN edge is the authoritative rate limiter.** Application-layer
rate limiting is defence-in-depth, not the primary protection. Operators
**must** configure CDN-level rate limiting rules for production
deployments. Without CDN-level controls, the OAuth amplification vector
(`GET /oauth/authorize` creating upstream Clerk sessions) is effectively
unprotected under horizontal scaling because no single instance
accumulates enough counter hits to trigger a 429.

### Rate Limit Coordination

When both CDN and application rate limits are active:

1. CDN rejects volumetric attacks before they reach the origin.
2. Application rate limiter catches low-rate abuse, credential stuffing,
   and amplification that slips through CDN thresholds.
3. If the upstream Oak API returns 429 (per-key rate limit), the server
   propagates it as a 502 or handles it per-route.

### Failure Modes

| Failure                         | Consequence                                          | Mitigation                                     |
| ------------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| CDN down                        | All traffic hits origin directly; app limiter active | App limiter provides partial protection        |
| App limiter exhausted           | 429s for legitimate clients                          | Generous defaults; CDN handles sustained abuse |
| All counters reset (cold start) | Brief window of unprotected traffic                  | Acceptable for defence-in-depth                |
| Upstream API returns 429        | Asset downloads fail; tool calls return errors       | Observability captures the event; alerting     |

### 429 Response Format

Rate limit responses use the route's existing error format for
consistency:

- MCP and asset routes: `{ "error": "Too Many Requests", "message": "Rate limit exceeded. Try again later." }`
- OAuth routes: `{ "error": "too_many_requests", "error_description": "Rate limit exceeded. Try again later." }`

## Options Considered

1. **`express-rate-limit` with in-memory store** (chosen) — mature library,
   zero infrastructure, DI-friendly factory pattern. Probabilistic on
   serverless but acceptable for defence-in-depth when CDN is authoritative.
2. **Redis-backed distributed store** (deferred) — provides strong guarantees
   across instances but requires infrastructure (Vercel KV / Upstash Redis)
   and adds a network dependency to every request. Disproportionate for the
   current single-project deployment.
3. **Vercel Edge Middleware** — rate limiting at the edge before the function
   runs. Would be authoritative but couples rate limit logic to Vercel's
   proprietary Edge Runtime and moves configuration out of the codebase.
4. **Custom middleware** — no benefit over `express-rate-limit`; reinvents
   well-tested logic.

## Consequences

- CodeQL `js/missing-rate-limiting` alerts #5, #6, #7, #8 are cleared.
- All six routes on three profiles have per-IP rate limiting.
- The multi-layer security architecture is explicitly documented.
- Tests verify rate limiting behaviour via DI without `vi.mock`.
- Operators are honestly informed that application-layer rate limiting
  is probabilistic on serverless — the CDN is authoritative.
