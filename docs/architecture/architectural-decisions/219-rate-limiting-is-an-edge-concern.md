# ADR-219: Rate Limiting Is an Edge Concern

## Status

**Accepted** (2026-07-30); amended 2026-08-21 — the Context's "every
served domain" premise narrowed to proxied domains only, see the
Amendment at the end

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
   **This holds per domain, not universally — see the amendment of 2026-08-21
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

## Amendment — 2026-08-21: the every-served-domain premise holds only for a proxied domain

The Context above originally claimed the edge carries traffic controls for
**every** served domain. **Cloudflare's WAF and rate-limiting rules are in path
only for a _proxied_ domain.** That claim is narrowed in place in Context point
1 and marked there; this amendment records the measurement behind the narrowing
and what follows from it.

Measured 2026-08-20 at ~12:25Z, each host against a proxied control:

| Host                                   | `server` header | `cf-ray` | Verdict         |
| -------------------------------------- | --------------- | -------- | --------------- |
| `www.thenational.academy`              | `cloudflare`    | present  | Proxied         |
| `mcp.thenational.academy`              | `cloudflare`    | present  | Proxied         |
| `curriculum-mcp-alpha.oaknational.dev` | `Vercel`        | absent   | **Not proxied** |

So for `curriculum-mcp-alpha.oaknational.dev` the Cloudflare controls this ADR
names as the control's home are demonstrably not in path, and the application
ships no limiter to compensate.

**This is not the falsification clause firing.** §Decision's clause is a
cessation clause — the dismissal "is falsified the moment the edge **stops**
carrying the control" — and §Consequences conditions on edge configuration
being "weakened or removed". Neither describes this host: no cessation of edge
control is recorded for it, yet the premise does not hold for it. The clause as
written covers only a domain that loses its edge protection, not one that is
unproxied without ever having been un-proxied — which is itself a gap in the
original record.

**Scope of the claim, stated precisely.** Vercel's own platform DDoS baseline
remains in path for that host, so this is **not** "no volumetric protection".
It is: _the Cloudflare layer this ADR names as the control's home is absent for
that domain._ Vercel project firewall rules are not readable from the
repository, so no claim is made about them either way.

**What the measurement does and does not establish.** A header read is
point-in-time: it establishes each host's proxy state at ~12:25Z on 2026-08-20
and nothing about its history. That the alpha host's premise was inaccurate
when written, rather than broken by a later change, is an **inference** from the
absence of any recorded change to its proxy state — not a measurement. No claim
is made here about when `mcp.thenational.academy` became proxied.

**What is affected, stated as a class rather than a list.** The affected
population is the open, growing class named in §Consequences: every
`js/missing-rate-limiting` disposition on this server's route registrations
whose recorded rationale is this ADR's edge premise. On an unproxied host the
**Cloudflare limb** of that rationale is unsupported; the Vercel limb, where a
dismissal names it, still holds. The class is deliberately **not** enumerated
exhaustively here — it grows with each new route, so a frozen list in this ADR
would go stale silently.

Dated exemplars, measured 2026-08-21 per alert (state read from `fixed_at`, not
from a list filter — a dismissed alert whose instance later disappears keeps
`state: dismissed` and gains a `fixed_at`):

- **Alert #5** (`auth-routes.ts:117`, dismissed 2026-07-30, still present on
  current code) is the clearest in-class case: it records this ADR's premise
  verbatim — "the app is behind Cloudflare, which provides rate-limiting, and
  is also hosted on Vercel which enforces bot and DoS protection".
- **Alerts #8** (`oauth-proxy-routes.ts:72`) and **#65** (`auth-routes.ts:160`),
  both dismissed 2026-03-31 and both still present, record only "already
  protected". The in-process limiter did not exist on that date — it landed
  2026-04-28 and left 2026-07-30 — so "already protected" cannot have meant it.
  **Inference, labelled:** the edge is the only control it can have meant, which
  places these two inside the class; their comments do not say so.
- **Alert #90** (`bootstrap-helpers.ts:165`, dismissed 2026-05-22, still
  present) is outside the class: its rationale is misclassification —
  cross-cutting middleware, not a route handler.
- The dismissals that named the in-process limiter explicitly ("DI-injected per
  ADR-078", 2026-06-23) were all resolved when that limiter was removed, and
  **#230** — which recorded the edge premise alongside #5 — was resolved
  2026-08-12. Resolved alerts are history, not live exposure.

**A second population cites this ADR as an abuse bound without carrying a rule
disposition.** `/assets/download/:lesson/:type` is the sharpest such case: its
docstring records that abuse is bounded by this ADR's edge controls _and_ that
the service's Oak API key is exempt from upstream per-key rate limiting
(Context point 2). On an unproxied host the capability stays bounded by its
HMAC signature and 5-minute TTL while the Cloudflare limb of the volumetric
bound the docstring names is absent. That path carries no code-scanning alert of
any rule, in any state — it is a citation, not a dismissal. The two populations
are distinct and fail differently.

**The residual risk is recorded here, NOT accepted.** Accepting it, or proxying
the host, is an owner decision and has not been made. This amendment removes a
false statement from the record; it does not settle what to do about the
condition the statement was hiding.

_Provenance: a retrospective `security-expert` review of pull request 920
(2026-08-20) surfaced the falsification. The per-host proxy states were
measured first-hand on 2026-08-20 at ~12:25Z, each against a proxied control.
The alert states, dismissal rationales and the limiter's landing and removal
dates were measured first-hand on 2026-08-21 against the repository's
code-scanning alert set and git history._
