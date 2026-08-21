# ADR-219: Rate Limiting Is an Edge Concern

## Status

**Accepted** (2026-07-30)

**Supersedes**: [ADR-158](158-multi-layer-security-and-rate-limiting.md)
(Multi-Layer Security Architecture and Application Rate Limiting)

**Related**: [ADR-115](115-proxy-oauth-as-for-cursor.md) — public OAuth proxy
endpoints; [ADR-126](126-asset-download-proxy.md) — asset download proxy;
[ADR-121](121-quality-gate-surfaces.md) — quality gate surfaces

## Context

ADR-158 added an in-process per-IP limiter to the HTTP MCP server as a fourth
defence layer, in answer to CodeQL `js/missing-rate-limiting`. Three facts
remove its basis.

1. **The edge owns volumetric control.** Cloudflare and Vercel carry the
   traffic controls for a served domain, and their strength per domain is an
   edge-configuration decision, made and reviewed where the control lives.
   **This holds per domain, not universally — see the amendment of 2026-08-20
   below. It was originally written as "every served domain", which is not
   true of an unproxied one.**

2. **The upstream quota threat does not exist.** The Oak Open Curriculum API
   rate-limits per key, but this service's key is exempt as an internal
   consumer. The quota-exhaustion amplification ADR-158 was sized against
   never applied to this service.

3. **The deployment cannot count per client in process.** On Vercel Fluid
   Compute, instances are short-lived, request routing is not client-affine,
   and the forwarded-for header the limiter keyed on resolves to Cloudflare
   egress addresses. An in-process counter therefore counted per
   point-of-presence per instance lifetime — never per client.

Together: a control that could not enforce what its name claimed, sized
against a threat that did not apply, standing in front of an edge that held
the real control.

## Decision

**Rate limiting for the HTTP MCP server is owned at the edge; the application
runs no in-process rate limiter.** Volumetric and abuse controls are
configured in Cloudflare and Vercel and are authoritative there. The
application layer's security responsibilities are authentication,
authorisation, input validation, and the trust-boundary controls a stateless
request can actually enforce.

**Static-analysis findings are adjudicated against the actual architecture.**
Where the finding's premise holds, the fix comes first. Where the instrument
cannot see the layers doing the job, the finding is dismissed with the
rationale recorded against a decision record. `js/missing-rate-limiting` on
this server is of the second kind: CodeQL finds no in-process limiter because
there is none, and cannot see the edge that carries the control. A dismissal
of this kind is an architectural claim on the record, not a silenced check —
and it is falsified the moment the edge stops carrying the control.

## Consequences

- The server ships no limiter middleware, no limiter dependency and no limiter
  tests; `express-rate-limit` leaves the application's own dependencies. (It
  remains in the lockfile as a transitive dependency of the MCP SDK, unused
  by this application's code.)
- Changing a rate limit is edge-configuration work. The repository holds no
  second copy of the control to drift against it.
- Edge configuration is load-bearing: if it is weakened or removed for a
  served domain, nothing in the application compensates, and this decision's
  premise is falsified **for that domain**.
- This server no longer emits 429 of its own; a 429 reaching a client
  originates at the edge or upstream.
- `js/missing-rate-limiting` will re-fire on new routes. Each occurrence is
  dispositioned against this ADR rather than closed with middleware — as an
  individual false-positive dismissal in code scanning citing this ADR, never
  a repo-wide query exclusion, so the guard keeps firing on genuinely new
  routes.
- `app.set('trust proxy', 1)` leaves with the limiter it was installed for.
  Its only candidate consumer — the debug request logger's `ip` field — is
  fully redacted before reaching any sink, and under `trust proxy` Express's
  proxy-aware getters (`req.protocol`, `req.secure`, `req.host`,
  `req.hostname`) read client-supplied `X-Forwarded-*` headers — the hazard
  the canonical-origin and PRM-URL modules each documented refusing by hand.
  Without the setting the naive getters are safe by default. The Host-based
  DNS-rebinding guard and self-origin derivation read the raw `Host` header
  and are unaffected.
- The amplification record is corrected, not inherited: the public
  `/oauth/authorize` endpoint builds a 302 redirect and makes no upstream
  call — its amplification factor is zero; asset-URL replay within the
  5-minute HMAC TTL re-reads one already-authorised asset. The cost ceiling
  for both is upstream capacity and compute spend, not a per-key quota, and
  their volumetric bound is the edge.
- Where edge protection for a served domain is thinner, the cure is edge
  configuration — a firewall rule or an origin lock — never an in-process
  counter.
- ADR-158 is superseded but stays readable: its threat model, key-extraction
  analysis and §Honest Limitations are the record of what was built and what
  it could not do.

## Amendment — 2026-08-20: the every-served-domain premise does not hold for an unproxied host

The Context above originally claimed the edge carries traffic controls for
**every** served domain. The accepted text remains as written, as history;
this amendment narrows that claim. **Cloudflare's WAF and rate-limiting rules
are in path only for a _proxied_ domain.** Measured 2026-08-20 at ~12:25Z,
each host against a proxied control:

```text
www.thenational.academy               server: cloudflare, CF-RAY present   PROXIED
mcp.thenational.academy               server: cloudflare, CF-RAY present   PROXIED (since 2026-08-20)
curriculum-mcp-alpha.oaknational.dev  server: Vercel,     no CF-RAY        NOT PROXIED
```

So for `curriculum-mcp-alpha.oaknational.dev` this decision's falsification
clause **has fired**: Cloudflare's configured controls are demonstrably not in
path, and the application ships no limiter to compensate.

**Scope of the claim, stated precisely.** Vercel's own platform DDoS baseline
remains in path for that host, so this is **not** "no volumetric protection".
It is: _the Cloudflare layer this ADR names as the control's home is absent for
that domain._ Vercel project firewall rules are not readable from the
repository, so no claim is made about them either way.

**This pre-dates the 2026-08-20 host work.** The alpha host has always been
unproxied; the premise was inaccurate when written rather than broken by a
change. What changed on 2026-08-20 is only that a second host briefly shared
the condition and no longer does.

**What is affected, stated as a class rather than a list.** The affected
population is the open, growing class named in §Consequences: every
`js/missing-rate-limiting` disposition on this server's route registrations
whose recorded rationale is this ADR's edge premise. On an unproxied host that
rationale is unsupported. The class is deliberately **not** enumerated
exhaustively here — it grows with each new route, so a frozen list in this ADR
would go stale silently. Dated exemplars, measured 2026-08-21 against the
repository's code-scanning alert set:

- **Alerts #5 and #230** (`auth-routes.ts`, both dismissed 2026-07-30) record
  this ADR's premise verbatim — "the app is behind Cloudflare, which provides
  rate-limiting". These are the clearest in-class cases.
- The in-code dispositions that name the rule and cite this ADR sit in
  `auth-routes.ts` and `oauth-proxy/oauth-proxy-routes.ts`.
- Dismissals on `app/bootstrap-helpers.ts` are adjacent to the class, not in
  it: their recorded rationale is misclassification — cross-cutting
  middleware, not a route handler — rather than the edge premise.
- Dismissals dated 2026-03-31 and 2026-06-23 rest on the in-process limiter
  that MCP-411 later removed under this ADR, so their recorded rationale no
  longer describes the code. That is a separate staleness from the proxy
  question and is not resolved by this amendment.

**A second population cites this ADR as an abuse bound without carrying a rule
disposition.** `/assets/download/:lesson/:type` is the sharpest such case: its
docstring records that abuse is bounded by this ADR's edge controls _and_ that
the service's Oak API key is exempt from upstream per-key rate limiting
(Context point 2). On an unproxied host the capability stays bounded by its
HMAC signature and 5-minute TTL while the volumetric bound the docstring names
is absent. It is a citation, not a code-scanning dismissal; the two populations
are distinct and fail differently.

**The residual risk is recorded here, NOT accepted.** Accepting it, or proxying
the host, is an owner decision and has not been made. This amendment removes a
false statement from the record; it does not settle what to do about the
condition the statement was hiding.

_Provenance: a retrospective `security-expert` review of pull request 920
(2026-08-20) surfaced the falsification. The per-host proxy states above were
re-measured first-hand on 2026-08-20 at ~12:25Z, each against a proxied
control; the code-scanning exemplars were measured first-hand on 2026-08-21
against the repository's dismissed-alert set._
