---
title: "PR-87 Cluster A — Pre-Phase Adversarial Security Review (Rate-Limit Bypass Surface)"
plan_ref: pr-87-architectural-cleanup
phase: 2.1
reviewer: security-reviewer (claude-opus)
review_run_at: 2026-04-28T11:54Z
re_review_run_at: 2026-04-28T13:58Z
branch: feat/otel_sentry_enhancements
ref_sha: 7c589a0a
status: evidence
findings_summary: "Re-reviewed 2026-04-28 against current Vercel docs: FIND-001/002 reclassified MUST-FIX → HARDENING (premise contradicted); 2 SHOULD-FIX, 4 HARDENING; cure landing as defensive hardening not exploit closure"
---

# PR-87 Cluster A — Pre-Phase Adversarial Security Review

> **Re-assessment notice (2026-04-28T13:58Z).** The original review was
> written against an unverified assumption that "Vercel's edge **appends**
> the connecting client's IP to any incoming `X-Forwarded-For` header
> rather than replacing it" (Topic 1, ATTACK section, Topic 2 CURRENT).
> Independent verification against current Vercel docs at
> <https://vercel.com/docs/headers/request-headers> (fetched 2026-04-28)
> contradicts that premise: Vercel **overwrites** `X-Forwarded-For` on
> non-Enterprise plans ("we currently overwrite the X-Forwarded-For header
> and do not forward external IPs. This restriction is in place to prevent
> IP spoofing"); custom-XFF passthrough is gated behind a paid Enterprise
> "Trusted Proxy" feature.
>
> Re-review verdict (security-reviewer, claude-opus, 2026-04-28T13:58Z):
> FIND-001 and FIND-002 are reclassified **MUST-FIX → HARDENING**. The
> rotating-XFF bypass attack as described is not exploitable on this
> deployment. The Vercel-aware `keyGenerator` cure remains worth landing
> as **defence-in-depth** (configuration-drift insurance, decoupling from
> `trust proxy`, protection if a customer-owned proxy is later added
> upstream of Vercel) — but it does not need to land before the
> Phase 2.1 brand-preservation work, and the commit framing must be
> "hardening" rather than "exploit closure". FIND-003, FIND-004, and the
> HARDENING items (FIND-005..009) are unchanged.
>
> The original "appends" framing below is preserved verbatim for audit
> trail; treat the substantive sections as superseded by this notice for
> any classification or sequencing decision.

**Scope.** Live rate-limiting bypass surface on `feat/otel_sentry_enhancements`
at ref `7c589a0a`, independent of CodeQL. Read-only review; no code changes
proposed beyond architectural cures.

**Status (original).** RISKS FOUND. Two MUST-FIX, two SHOULD-FIX, four HARDENING.
The headline risk is straightforward `X-Forwarded-For` spoofing on Vercel
because `app.set('trust proxy', 1)` is paired with the unmodified default
`keyGenerator`.

**Status (post-reassessment).** Two HARDENING (was MUST-FIX), two SHOULD-FIX,
four HARDENING. No exploitable bypass on this deployment. See re-assessment
notice above.

**Verification limits.** Reviewer did not run live traffic against the
deployed Vercel function. Findings are derived from source plus the
installed `express-rate-limit@8.3.2` source in `node_modules`. Vercel-edge
header-stripping behaviour is documented behaviour, not measured here;
the original FIND-001 framing assumed an unverified "appends" semantic
which Vercel docs contradict — see re-assessment notice above.

---

## Topic 1 — Key extraction defaults under `trust proxy = 1`

**CURRENT.** `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts:246`
sets `app.set('trust proxy', 1)`. None of the rate limiters supplies a
`keyGenerator`; `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limiter-factory.ts:73-79`
only passes `windowMs`, `limit`, `standardHeaders`, `legacyHeaders`,
`message`. The package default keyGenerator at
`node_modules/express-rate-limit/dist/index.mjs:756-769` reads `request.ip`
and runs it through `ipKeyGenerator`. Express with `trust proxy = 1`
resolves `req.ip` by trusting **exactly one** hop of `X-Forwarded-For` from
the right and returning the right-most-but-one entry.

**ATTACK.** A single attacker (one client IP, e.g. `203.0.113.5`) sends
requests with `X-Forwarded-For: 1.1.1.<n>, <next>` and crafts the
right-most-but-one entry to be a different value per request. With
`trust proxy = 1`, Express trusts the right-most entry as the proxy
(Vercel's edge IP) and uses the entry immediately to its left as `req.ip`.
Vercel's edge **appends** the connecting client's IP to any incoming
`X-Forwarded-For` header rather than replacing it. The attacker therefore
controls the entry that Express reads as `req.ip`: e.g. send
`X-Forwarded-For: 9.9.9.9` and Vercel forwards
`X-Forwarded-For: 9.9.9.9, 203.0.113.5`. With `trust proxy = 1`, Express
skips one (the right-most, Vercel) and returns `9.9.9.9`. Rotating that
header value gives the attacker effectively unlimited unique rate-limit
keys.

This is **the** classic `trust proxy = 1` + Vercel-style edge bypass. It
applies to every rate-limited route — MCP, OAuth flow, OAuth metadata,
asset download, `/test-error`.

**CLASSIFICATION.** **MUST-FIX**. Application-layer rate limiting on every
route is currently bypassable by header spoofing from any single client.
The mitigation by CDN edge limiting (referenced in
`rate-limiter-factory.ts:51-60`) is real, but the application-layer limiter
as documented in code is a fig leaf against this attack — a single-machine
attacker hits CDN limits eventually; the app layer adds nothing extra
against it.

**CURE.** Define a custom `keyGenerator` that pins to Vercel's
`x-vercel-forwarded-for` (Vercel sets this directly from the connecting
client and clients cannot inject it through `x-forwarded-for` — Vercel
rewrites/appends, so `x-vercel-forwarded-for` is the trustworthy value).
Fall back to `req.ip` only outside Vercel. Pass the chosen key through
`ipKeyGenerator()` for IPv6 subnetting (`express-rate-limit` warns at
line 612-616 if a custom keyGenerator references `request.ip` without it).
Per ADR-078, keep this in `rate-limiter-factory.ts` so all four profiles
inherit the same generator. Revisit `trust proxy = 1` once the
keyGenerator no longer depends on it.

---

## Topic 2 — `X-Forwarded-For` spoofing on Vercel's edge

**CURRENT.** Same code as Topic 1. The Vercel-edge layer adds
`x-vercel-forwarded-for` (the genuinely connecting IP, set by Vercel) and
**appends** to any client-supplied `x-forwarded-for`. Express +
`trust proxy = 1` consumes the latter, not the former. There is no Vercel
`headers` config in `apps/oak-curriculum-mcp-streamable-http/vercel.json`
to strip incoming `x-forwarded-for` before it reaches Express.

**ATTACK.** As Topic 1. The Vercel-specific element: the trustworthy
header (`x-vercel-forwarded-for`) is being ignored; the
attacker-influenceable header (`x-forwarded-for`) is being trusted.
Reversing this would close the vector.

**CLASSIFICATION.** **MUST-FIX** (same finding as Topic 1, presented
through the Vercel-specific lens for clarity).

**CURE.** Custom `keyGenerator` reads `req.headers['x-vercel-forwarded-for']`
first (single value, set by edge), splits on comma, takes the first entry
(real client). On non-Vercel deployments, fall back to `req.ip`. Pass
through `ipKeyGenerator(ip, 56)` for IPv6 subnet collapsing. This is one
centralised function, a few lines, in `rate-limiter-factory.ts`.

---

## Topic 3 — Header-bypass paths via additional IP-bearing headers

**CURRENT.** No code consults `X-Real-IP`, `Forwarded` (RFC 7239),
`True-Client-IP`, or `CF-Connecting-IP` for routing/auth/identity. They
appear only in `apps/oak-curriculum-mcp-streamable-http/src/logging/header-redaction.unit.test.ts`
(test data) and in production redaction via `redactHeaders` in
`apps/oak-curriculum-mcp-streamable-http/src/logging/header-redaction.ts`
(header-name redaction for log emission, not consumption).
`express-rate-limit`'s default keyGenerator reads `request.ip` only; per
`node_modules/express-rate-limit/dist/index.mjs:355-362`, if
`headers.forwarded` is present it warns but still ignores it. So Vercel's
edge does not consume these for IP resolution either.

**ATTACK.** None directly via these headers as long as the keyGenerator
stays default; Express does not consult them. (This stops being safe the
moment someone adds a custom keyGenerator that reads them — see Topic 1's
cure must use `x-vercel-forwarded-for` and **not** the easily-spoofed
`X-Real-IP`.)

**CLASSIFICATION.** **HARDENING** (current code clean; record the
constraint so the FIND-001 cure is implemented correctly).

**CURE.** When implementing the FIND-001 keyGenerator, deliberately do
**not** trust `X-Real-IP`, `Forwarded`, `True-Client-IP`, or
`CF-Connecting-IP`. Trust only `x-vercel-forwarded-for` (Vercel-set, not
client-injectable through `x-forwarded-for` because Vercel writes it
server-side from the TCP connection).

---

## Topic 4 — OAuth proxy three-endpoint sharing

**CURRENT.** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts:54-99`
— `createOAuthProxyRoutes` receives a single `oauthRateLimiter:
RequestHandler` and attaches the **same instance** to all three endpoints
(`POST /oauth/register` line 81-85, `GET /oauth/authorize` line 87-89,
`POST /oauth/token` line 91-96).
`apps/oak-curriculum-mcp-streamable-http/src/test-error/register-diagnostic-routes.ts:43`
and
`apps/oak-curriculum-mcp-streamable-http/src/test-error/test-error-route.ts:207`
then attach the **same** `oauthRateLimiter` to `POST /test-error` (gated
by `TEST_ERROR_SECRET`, forbidden in production but live in non-prod
environments).

Because `express-rate-limit` keys per IP (not per IP+route), the four
routes share one bucket: 30 requests / 15 min / IP across the union of
`/oauth/register` + `/oauth/authorize` + `/oauth/token` + `/test-error`.

**ATTACK.**

- (a) **Cross-endpoint amplification (DoS coupling).** A misbehaving
  legitimate client looping `GET /oauth/authorize` (e.g. browser reload)
  burns the budget for `POST /oauth/token`; a real OAuth completion attempt
  from the same IP is then 429ed mid-flow. Result: legitimate self-DoS
  without attacker action.
- (b) **Probe-amplifies-flow.** A reconnaissance script hitting
  `POST /oauth/register` 30 times locks out the same IP from completing the
  OAuth flow, even if each registration is structurally fine.
- (c) **Test-error budget consumption.** In any non-prod environment with
  `TEST_ERROR_SECRET` set, repeated probe runs (intended for Sentry
  validation) lock out OAuth completion for any client sharing that IP —
  including human developers behind a corporate NAT.

This is not a security-perimeter bypass; it's an integrity issue
(legitimate OAuth flow becomes unreliable under load) and a coupling risk.
Rate-limit-profile authoring intent in `rate-limit-profiles.ts:29-48`
clearly meant the 30/15min budget to apply *per OAuth endpoint*, not as a
shared pool with `/test-error` thrown in.

**CLASSIFICATION.** **SHOULD-FIX**. Not directly exploitable for
unauthorised access; will cause real false-positive 429s in production for
legitimate clients sharing IPs (corporate NAT, mobile carriers, schools).

**CURE.** Two paths, pick one:

1. Construct three (or four, including `/test-error`) **separate** limiter
   instances from the same `OAUTH_RATE_LIMIT` profile.
   `create-rate-limiters.ts:50-53` currently calls
   `factory(OAUTH_RATE_LIMIT)` once; either factory each endpoint
   independently, or use distinct stores per endpoint. (Note:
   `express-rate-limit`'s `unsharedStore` validation at
   `node_modules/express-rate-limit/dist/index.mjs:379-387` already
   prevents accidental store sharing if you re-construct instances.)
2. If the bucket really is meant to be shared, give `/test-error` its
   **own** profile so probe runs cannot starve OAuth completion.

The brand-preservation work in PR-87 doesn't change this — but the cure
naturally aligns with explicit `RateLimitRequestHandler`-typed instances
per endpoint.

---

## Topic 5 — Cold-start counter reset windows

**CURRENT.** `rate-limiter-factory.ts:51-60` documents this explicitly:
"Counters reset on cold start — brief unprotected window." `MemoryStore` at
`node_modules/express-rate-limit/dist/index.mjs:17-50` is per-process.
Vercel serverless functions can be reaped between requests, so cold start
= blank slate.

**ATTACK.** A patient attacker times bursts to immediately follow a cold
start. Detection: probe `/healthz` or
`/.well-known/oauth-protected-resource` (not authoritatively rate-limited
because the metadata limiter resets too). Burst MCP/OAuth/asset traffic
during the cold window. Effective limit per cold cycle =
`MCP_RATE_LIMIT.limit + OAUTH_RATE_LIMIT.limit + ...` per IP per cold
start, not per minute.

**CLASSIFICATION.** **HARDENING** (acknowledged trade-off in code; CDN
edge is the first line; in-memory is defence-in-depth that is
intentionally weak).

**CURE.** Move to a shared store (Redis / Vercel KV / Upstash) keyed per
limiter, OR document the trade-off as accepted in ADR-158 and accept that
the application-layer limiter is probabilistic. The current source comment
already does the latter; the cure here is no behaviour change but an
explicit, owner-acknowledged ADR-178-style decision so this isn't carried
as silent technical debt.

---

## Topic 6 — In-memory store atomicity and multi-instance counter divergence

**CURRENT.** Same `MemoryStore` per Vercel function instance (autoscaled).
`rate-limiter-factory.ts:51-60` mentions the cold-start case but is silent
on N concurrent warm instances. Each warm instance has its own counter;
effective limit = `N_instances × declared limit`. `MemoryStore.localKeys =
true` (line 36) is a flag that prevents `unsharedStore` validation errors
but is **not** a cross-instance lock — it just records that this store is
purely local.

**ATTACK.** Simple distributed attacker (or a single attacker against a
high-traffic deployment with multiple warm instances) sees `2x`, `3x`,
`Nx` the declared limit. With `MCP_RATE_LIMIT.limit = 120` and 5 warm
instances, an attacker gets ~600 req/min/IP through the application-layer
limiter. CDN edge still applies, so this isn't unbounded — but the
application-layer number in code does not reflect production reality.

**CLASSIFICATION.** **HARDENING** with caveat: if owners read
`MCP_RATE_LIMIT.limit = 120` as the contract, that contract is currently
violated by Nx. SHOULD-FIX **if** the contract is meant to be
authoritative.

**CURE.** Same as Topic 5 — shared store. If staying with `MemoryStore`,
restate the profile units honestly: e.g. `limit: 120` means "per warm
instance", not "per IP fleet-wide". The Phase 2.1 brand-preservation cure
has no impact here; this is independent of CodeQL.

---

## Topic 7 — Skip-path interactions with `createConditionalClerkMiddleware`

**CURRENT.** `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts:34-43`
— Clerk auth is bypassed for `/.well-known/oauth-*`, `/healthz`,
`/oauth/authorize`, `/oauth/token`, `/oauth/register` (paths) and
`/assets/download/*` (prefix; HMAC self-authenticates per ADR-126), and
for MCP `resources/read` of public URIs.

Cross-checking against the rate-limiter coverage:

| Path | Auth | Rate limiter |
|------|------|--------------|
| `/.well-known/oauth-protected-resource[/mcp]` | skip | metadata (60/min) |
| `/.well-known/oauth-authorization-server` | skip | metadata (60/min) |
| `/.well-known/openid-configuration` | skip | **none** |
| `/.well-known/mcp-stub-mode` | skip | metadata (only when `useStubTools`) |
| `/healthz` | skip | **none** |
| `/oauth/register` | skip | oauth |
| `/oauth/authorize` | skip | oauth |
| `/oauth/token` | skip | oauth |
| `/assets/download/*` | skip (HMAC) | asset (60/min) |
| `/mcp` (public resources/read) | skip | mcp (120/min) |
| `/mcp` (other) | Clerk | mcp (120/min) |
| `/` (landing page) | n/a | **none** |
| static (`expressStatic`) | n/a | **none** |
| `/test-error` (when secret set) | secret | oauth |

Two unauthenticated, **unrate-limited** paths emerge:

- (a) **`/.well-known/openid-configuration`** is in the Clerk skip list
  (line 38) but has **no route registration** in `auth-routes.ts` — Express
  returns 404 quickly, so this is mostly cheap. However, the skip-path
  entry is cosmetic dead code (skipping a path that doesn't exist).
- (b) **`/healthz`** in `app/health-endpoints.ts:11-18` is registered
  without any rate limiter. Health probes from the platform are fine;
  arbitrary callers can flood `/healthz` from a single IP unboundedly at
  the application layer.
- (c) **`/` and static files** in `app/static-content.ts:23` and `:36` —
  landing page renders synchronously (`renderLandingPageHtml`) and
  `expressStatic` serves files. No rate limiter. Floodable.

No path that should hit auth instead bypasses the limiter; the inverse
risk (limiter applied where it shouldn't be) doesn't show up either. The
misalignment is purely on cross-cutting un-limited surface.

**ATTACK.**

- (a) Health-probe flood from single IP — minor; CDN edge mitigates;
  landing page render is cheap-ish but not free.
- (b) `expressStatic` flood — bounded by file count/size; CDN cache should
  serve most of it.

**CLASSIFICATION.** **SHOULD-FIX** for `/healthz` (cheap to add a generous
limiter; otherwise it's a known origin-load amplifier from a single IP).
**HARDENING** for `/` and static.

**CURE.** Add a dedicated `HEALTH_RATE_LIMIT` profile (e.g. 600/min/IP —
generous enough that platform probes never hit it but bounded enough to
mute single-IP flood) and apply it in `addHealthEndpoints`. For landing
page + static, either accept (CDN handles) or apply a low-priority generic
limiter; document the choice in ADR-158. Remove
`/.well-known/openid-configuration` from the Clerk skip list since the
route does not exist (or register it with the metadata limiter).

---

## Topic 8 — Accidental `getKey`/`resetKey` exposure post-narrowing

**CURRENT.** A repo-wide search
(`grep -rn "getKey\|resetKey\|resetAll\|RateLimitRequestHandler" apps/oak-curriculum-mcp-streamable-http/src/`)
returns zero hits in non-test source (the only matches are
`landing-page/render-tools-section.unit.test.ts`'s coincidental
`getKeyStagesPos` variable name in tool listings).
`apps/oak-curriculum-mcp-streamable-http/src/test-helpers/rate-limiter-fakes.ts`
is a fake for tests only — its no-op middleware does **not** carry
`getKey`/`resetKey` properties at runtime, but it also does not intersect
with prod code.

**ATTACK.** None today. The risk to flag for the Phase 2.1 cure: once the
`RateLimitRequestHandler` brand is preserved end-to-end, the limiter
parameter at every authorising route registration will carry
`.resetKey(key)` and `.getKey()`. If a future error handler, debug
endpoint, or admin route accepts the limiter and exposes `resetKey`
reachable via HTTP input — even via a single guarded call — that's a
1-call-per-attacker rate-limit bypass.

A particularly bad future smell: an error-handler that catches
`ERR_ERL_PERMISSIVE_TRUST_PROXY` and "tries to recover" by
`limiter.resetKey(req.ip)`.

**CLASSIFICATION.** **HARDENING** (forward-looking; nothing to fix in
current source, but worth a Phase 2.1 invariant test).

**CURE.** When the brand is preserved, add an explicit lint or grep rule
asserting that `.resetKey(`, `.resetAll(`, `.getKey(` never appear in
`src/**/*.ts` outside `rate-limiting/**` — and never in `oauth-proxy/**`,
`auth-routes.ts`, `test-error/**`, `app/**` route registrations. This is a
one-line `pnpm lint` plugin or a unit test that scans the source tree.
Cheap, durable, prevents the regression.

The test helper's no-op middleware should remain a plain `RequestHandler`
(not branded), so production code that consumes a `RateLimitRequestHandler`
and starts calling `resetKey` would fail to compile when wired with the
fake — a structural barrier. Verify this stays true post-cure.

---

## Topic 9 — `bootstrap-helpers.ts:151` and pre-auth cross-cutting middleware

**CURRENT.** `bootstrap-helpers.ts:140-157` registers
`setupBaseMiddleware`, which wires `expressJson({ limit: '1mb' })`,
`createCorrelationMiddleware`, and (debug-only) `createRequestLogger`. Of
these, `expressJson` is the body-size cap but **not** a rate-limit;
`createCorrelationMiddleware` is observability cross-cutting; the request
logger only mounts when log level is debug. Earlier in the chain,
`app.set('trust proxy', 1)` is set in `initializeAppInstance` before any
middleware. After `setupBaseMiddleware`, `setupSecurityMiddleware` adds
CORS + DNS-rebinding-protection (selective) + security headers — none of
which are rate limiters.

There is **no global baseline rate limiter on `/`**. Each route gets its
specific limiter (or none for `/healthz`, `/`, static). The CodeQL #69
alert at line 151 is firing on `app.use(createRequestLogger(...))` (a
logging middleware, debug-gated). That is structurally cross-cutting and
not auth-bearing — agreed with the existing comment at line 137-139.

**ATTACK.** The relevant question: is there any pre-auth, body-parsed
surface that an attacker can hammer to amplify cost beyond the per-route
limits? Two targets:

- (a) `expressJson({ limit: '1mb' })` runs **before** any rate limiter on
  every request. An attacker can POST 1MB JSON bodies to `/mcp`
  (rate-limited) up to 120/min — but `expressJson` parses the body before
  the limiter rejects on attempt 121. So 1MB × 120 = 120MB JSON parsing
  per minute per IP per warm instance, multiplied across instances and
  across cold starts. Not a clear DoS, but a non-trivial allocation and
  CPU cost.
- (b) For unrate-limited paths (`/`, `/healthz`, static, landing):
  `expressJson` still runs but content-type-mismatch makes it cheap.

**CLASSIFICATION.** **HARDENING**. There is no MUST-FIX absence here.
CodeQL #69 is correctly classified as a misclassification in code
comments, but it points at a real architectural question: should there be
a global baseline rate limiter? Reviewer's read: yes, a low-budget global
limiter (e.g. 600/min/IP) before `expressJson` would catch flood patterns
that route-specific limiters miss for unauthenticated/unlimited paths.
This is a defence-in-depth improvement, not a current bypass.

**CURE.** Optional: introduce a `GLOBAL_BASELINE_RATE_LIMIT` profile (very
loose, e.g. 600/min/IP across all paths) and `app.use(globalBaselineLimiter)`
immediately after `app.set('trust proxy', 1)` and before `expressJson`.
This naturally subsumes:

- Topic 7 unlimited surface (`/healthz`, `/`, static)
- Topic 9 pre-parse JSON-amplification
- Provides a uniform key extraction site if the FIND-001 keyGenerator cure
  lives there.

It does **not** subsume the per-route limiters — those still enforce
stricter category-specific budgets. The architectural gain is one place to
run the (fixed) keyGenerator and to backstop unlimited paths.

---

## Numbered Findings

### FIND-001 — MUST-FIX — `X-Forwarded-For` spoofing bypasses every rate limiter

- **Where.** `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts:246`
  sets `trust proxy = 1`;
  `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limiter-factory.ts:71-80`
  does not pass `keyGenerator`. Default keyGenerator at
  `node_modules/express-rate-limit/dist/index.mjs:756-769` reads `req.ip`.
- **What.** Single attacker rotates `X-Forwarded-For` value; Vercel
  appends real IP; Express skips the right-most entry (Vercel) and trusts
  the attacker-controlled left-of-rightmost entry. Every rate-limit key
  becomes attacker-controlled.
- **Cure.** Custom `keyGenerator` reads `x-vercel-forwarded-for` (split on
  comma, take first) on Vercel, falls back to `req.ip` otherwise, passes
  through `ipKeyGenerator` for IPv6 subnetting. Centralise in
  `rate-limiter-factory.ts`.
- **RED test.** Express app under `trust proxy = 1` with default-factory
  limiter; send 200 requests with rotating `X-Forwarded-For`; expect to
  see 429 after 120 (currently fails — all 200 succeed).

### FIND-002 — MUST-FIX (same root as FIND-001 in Vercel-specific framing)

- **Where.** Same code; Vercel header semantics.
- **What.** `x-vercel-forwarded-for` (trustworthy) is ignored;
  `x-forwarded-for` (client-influenceable) is trusted.
- **Cure.** As FIND-001.
- **RED test.** Asserts that the keyGenerator picked by every limiter
  consumes `x-vercel-forwarded-for` (not `x-forwarded-for`).

### FIND-003 — SHOULD-FIX — OAuth flow + test-error share a single 30/15min/IP bucket

- **Where.** `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts:81,87,91`
  and `apps/oak-curriculum-mcp-streamable-http/src/test-error/test-error-route.ts:207`
  all attach the same `oauthRateLimiter` instance from
  `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/create-rate-limiters.ts:51`.
- **What.** `/oauth/register` + `/oauth/authorize` + `/oauth/token` +
  `/test-error` share one bucket; legitimate flows DoS each other from the
  same IP under load.
- **Cure.** Either four independent limiter instances from
  `OAUTH_RATE_LIMIT`, or split `/test-error` to its own profile.
- **RED test.** Hit `GET /oauth/authorize` 30 times (lock the IP); then
  `POST /oauth/token` from same IP → currently 429 even though
  `/oauth/token` should still have headroom.

### FIND-004 — SHOULD-FIX — `/healthz` has no application-layer rate limit

- **Where.** `apps/oak-curriculum-mcp-streamable-http/src/app/health-endpoints.ts:11,15`.
- **What.** Single-IP flood unbounded at app layer; CDN handles, but
  origin still pays request cost when CDN cache misses.
- **Cure.** Generous health-probe-friendly limiter (e.g. 600/min/IP).
- **RED test.** Send N requests from one IP to `/healthz`; expect 429
  above limit.

### FIND-005 — HARDENING — Cold-start counter reset

- **Where.** `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limiter-factory.ts:51-60`
  (acknowledged); default `MemoryStore` at
  `node_modules/express-rate-limit/dist/index.mjs:17-50`.
- **What.** Counters wipe on cold start; bursts immediately after cold
  start are unprotected.
- **Cure.** Shared store (Redis / Vercel KV / Upstash) **or** explicit ADR
  acceptance of probabilistic enforcement.

### FIND-006 — HARDENING — Per-instance counter divergence under autoscaling

- **Where.** Same as FIND-005.
- **What.** Effective limit = `N_instances × declared limit` at warm
  steady state; `MemoryStore.localKeys = true` is a marker, not a lock.
- **Cure.** Shared store, or restate profile units as per-instance in code
  and ADR.

### FIND-007 — HARDENING — Cosmetic Clerk skip-path entry for non-existent route

- **Where.** `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts:38`
  lists `/.well-known/openid-configuration`, but the route is never
  registered.
- **What.** Dead code; future drift risk if someone wires the route
  without registering a rate limiter (would land in metadata profile
  category).
- **Cure.** Either register the route (with metadata limiter) or drop the
  skip entry.

### FIND-008 — HARDENING — Forward-looking: enforce no `getKey`/`resetKey`/`resetAll` calls outside `rate-limiting/`

- **Where.** N/A today; risk emerges once Phase 2.1 brand-preservation
  lands.
- **What.** Branded `RateLimitRequestHandler` exposes
  `resetKey`/`resetAll` to every consumer; future debug/error paths could
  wire them to HTTP input.
- **Cure.** Repo-wide static check (lint rule or unit test scanning
  `src/**/*.ts`) asserting these symbols never appear outside
  `rate-limiting/**`. Test helper fake stays unbranded so prod consumers
  calling `resetKey` fail to compile against the fake.

### FIND-009 — HARDENING — `expressJson({ limit: '1mb' })` runs before per-route rate limiters

- **Where.** `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts:145`.
- **What.** 1MB JSON parse cost incurred per request even for requests
  that the per-route limiter would 429; up to 120MB/min/IP/instance JSON
  parse on `/mcp` POST before per-route 429 kicks in.
- **Cure.** Optional global baseline limiter (e.g. 600/min/IP) installed
  immediately after `trust proxy = 1` and before `expressJson`. Naturally
  absorbs the FIND-001 keyGenerator and back-stops FIND-004.

---

## Recommended Phase 2 sequencing (reviewer)

1. **Land FIND-001 / FIND-002 cure first**, before the brand-preservation
   type-narrowing. The brand-preservation work is structural; the spoofing
   bypass is exploitable today. RED tests for the keyGenerator fix do not
   depend on the brand.
2. **Then proceed with the Cluster A type-narrowing** as planned — but
   include FIND-008's static check as part of the Phase 2.1 invariant set,
   since the brand expansion is what motivates it.
3. **FIND-003, FIND-004 in a Phase 2.2 follow-up** — clean separation,
   separate cure, separate RED tests.
4. **FIND-005, FIND-006, FIND-007, FIND-009 → ADR-158 amendment** — record
   acceptance or schedule.

This evidence file is the source of truth for Cluster A bypass surface.
The PR-87 plan §Cluster A section references this file by path; do not
duplicate findings into the plan body.
