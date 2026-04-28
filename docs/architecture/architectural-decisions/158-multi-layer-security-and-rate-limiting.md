# ADR-158: Multi-Layer Security Architecture and Application Rate Limiting

## Status

Accepted (2026-03-31). Amended 2026-04-28 to add Runtime-Aware Key
Extraction (Vercel-aware `keyGenerator`) under Decision and re-state
Trust Boundaries accordingly. The amendment landed on PR-87 Phase 2.0.5
as defence-in-depth, not exploit closure — see the security re-review
at `.agent/plans/observability/active/pr-87-cluster-a-security-review.md`
for the FIND-001/002 reclassification (MUST-FIX → HARDENING).

**Related**: [ADR-078 (Dependency Injection for Testability)](078-dependency-injection-for-testability.md), [ADR-126 (Asset download proxy — HMAC trust discipline at boundaries)](126-asset-download-proxy.md), [ADR-143 (Coherent Structured Fan-Out for Observability)](143-coherent-structured-fan-out-for-observability.md)

## Context

CodeQL flags four routes in the HTTP MCP server with
`js/missing-rate-limiting` (high severity): POST /mcp, GET /mcp (both
auth modes), and POST /oauth/register. The repository ruleset enforces
`security_alerts_threshold: high_or_higher` on the CodeQL check, so these
alerts block any PR that touches the affected files.

The server is deployed on Vercel's serverless platform with **Cloudflare
sitting in front of Vercel** as the outermost edge. Both layers provide
volumetric DDoS protection, bot detection, and edge-level rate limiting;
the application-layer limiter is the **fourth** edge-protection layer in
the stack (Cloudflare → Vercel edge → app rate limit → app auth) and is
deliberately scoped as defence-in-depth, not the primary protection.

A further reduction in blast radius: **all MCP tools exposed by this
server are read-only**. A successful application-layer rate-limit
bypass cannot mutate state — only consume per-key upstream Oak API
quota (the amplification vector documented below) or push the server
toward its compute budget. There is no state-mutation surface to
protect; the limiter is only protecting upstream-quota and compute
budget, not data integrity.

Application-layer rate limiting is therefore valuable for: catching
abuse that bypasses both edge layers (direct origin access if such a
path is ever opened, credential stuffing, upstream amplification,
slowloris-style application-level attacks).

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

The HTTP MCP server relies on six defence layers. Each catches threats
the others miss; no single layer is sufficient alone. The two
edge-protection layers (Cloudflare in front of Vercel) provide
authoritative volumetric defence — application-layer rate limiting is
intentionally probabilistic and exists for cases where the edge layers
are bypassed.

| Layer                        | Protection                                                                                                                       | Failure Mode                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **DNS**                      | DNS rebinding guard rejects unrecognised `Host` headers (applied selectively to landing page)                                    | Bypassed if attacker controls DNS for an allowed host       |
| **Cloudflare (outer edge)**  | Cloudflare CDN/WAF in front of Vercel: volumetric DDoS, bot management, edge rate-limit rules, TLS termination, geo-restrictions | Bypassed by direct-origin access or low-rate attacks        |
| **Vercel (inner edge)**      | Vercel platform DDoS protection, edge functions, regional routing                                                                | Bypassed by direct-origin access or low-rate attacks        |
| **Application — auth**       | OAuth 2.1 via Clerk, CORS, security headers (CSP, HSTS, X-Frame-Options)                                                         | Bypassed if OAuth token compromised or auth disabled        |
| **Application — rate limit** | Per-IP rate limiting via `express-rate-limit` (this ADR)                                                                         | Distributed attacks across IPs; counter reset on cold start |
| **Upstream API**             | Oak API per-key rate limiting and quota management                                                                               | Exhaustible via amplification from our server               |

**Read-only blast radius.** All MCP tools exposed by this server are
read-only — there is no state-mutation surface. A successful bypass at
any layer cannot corrupt data; the worst-case impact is exhaustion of
upstream Oak API per-key quota or Vercel compute budget. This shapes
proportionality decisions throughout this ADR: the limiter exists to
protect quota and compute budget, not data integrity.

### Trust Boundaries

- **Client → CDN**: untrusted. CDN applies edge protection.
- **CDN → app origin**: semi-trusted. On Vercel runtime, the rate-limit
  `keyGenerator` reads `x-vercel-forwarded-for` directly (see
  Runtime-Aware Key Extraction below). On non-Vercel runtimes,
  `app.set('trust proxy', 1)` plus `req.ip` is the fallback path —
  `req.ip` reflects the real client IP from `X-Forwarded-For` only when
  the upstream proxy chain is correctly configured. Without either path,
  all clients share one rate limit bucket.
- **App → upstream API**: authenticated via `OAK_API_KEY`. Our server is
  the trust principal, not the end user.
- **Iframe sandbox → host**: OpenAI Apps SDK widget runs in a sandboxed
  iframe; CSP controls outbound requests.

### Runtime-Aware Key Extraction

The rate-limit `keyGenerator` adapts to the deployment runtime:

- **Vercel runtime** (`isVercelRuntime: true`): keys derive from the
  `x-vercel-forwarded-for` request header. Vercel writes this header
  server-side from the TCP connection and overwrites a client-supplied
  `X-Forwarded-For` on non-Enterprise plans, per the
  [Vercel request-headers documentation](https://vercel.com/docs/headers/request-headers)
  (verified 2026-04-28). This decouples the limiter from
  `app.set('trust proxy', 1)` semantics and remains correct if a
  customer-owned proxy is later placed upstream of Vercel.
- **Non-Vercel runtime** (`isVercelRuntime: false`): keys derive from
  `req.ip`. `x-vercel-forwarded-for` is **not** trusted on non-Vercel
  deployments because any client could spoof it; the security invariant
  the cure preserves is that `x-vercel-forwarded-for` is honoured only
  where the platform is documented to write it.

The runtime-detection seam is the validated env value
`runtimeConfig.env.VERCEL_ENV !== undefined`, derived once at the
composition root in `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
and passed as `RateLimiterFactoryOptions.isVercelRuntime` through to
`createDefaultRateLimiterFactory`. The factory exposes no default — call
sites must make an explicit Vercel/non-Vercel choice (a deliberate
"required parameter" design to avoid a silent default-arg path that
would degrade key extraction on a misconfigured production wiring).

**Configuration-drift tripwires.** This decision rests on two
load-bearing platform behaviours; if either changes, the keyGenerator
must be re-reviewed:

1. Vercel continues to overwrite (not append to) client-supplied
   `X-Forwarded-For` on this plan tier. A move to Vercel Enterprise with
   the "Trusted Proxy" feature enabled would re-open client-controlled
   XFF and require a fresh threat model.
2. `VERCEL_ENV` is a reliable Vercel-runtime signal. A future container
   or non-Vercel host that injects `VERCEL_ENV` would falsely opt into
   trusting `x-vercel-forwarded-for`; treat any environment that sets
   `VERCEL_ENV` outside Vercel as a configuration bug.

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
- Key extraction is runtime-aware (Vercel vs non-Vercel) and the
  required `RateLimiterFactoryOptions` parameter eliminates the silent
  default-arg path that would degrade the cure on a misconfigured
  production wiring (PR-87 Phase 2.0.5, 2026-04-28).
