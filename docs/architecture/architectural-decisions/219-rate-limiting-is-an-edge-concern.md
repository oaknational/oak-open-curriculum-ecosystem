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
   traffic controls for every served domain. Their strength per domain is an
   edge-configuration decision, made and reviewed where the control lives.

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
Where the finding's premise holds, the fix comes first. `js/missing-rate-limiting`
is the one finding whose instrument cannot see the layer doing the job: CodeQL
finds no in-process limiter because there is none, and cannot see the edge that
carries the control. The query is excluded in tracked CodeQL configuration (the
2026-09-17 amendment below); every other finding is cured at source under the
one-outcome rule in `docs/governance/sonar-disposition-policy.md`. The exclusion
knowingly silences the query for every route; it rests on an architectural
claim on the record, and that claim is falsified the moment the edge stops
carrying the control.

## Consequences

- The server ships no limiter middleware, no limiter dependency and no limiter
  tests; `express-rate-limit` leaves the application's own dependencies. (It
  remains in the lockfile as a transitive dependency of the MCP SDK, unused
  by this application's code.)
- Changing a rate limit is edge-configuration work. The repository holds no
  second copy of the control to drift against it.
- Edge configuration is load-bearing: if it is weakened or removed for a
  served domain, nothing in the application compensates, and this decision's
  premise is falsified.
- This server no longer emits 429 of its own; a 429 reaching a client
  originates at the edge or upstream.
- `js/missing-rate-limiting` raises no alert: the `query-filters` entry in
  `.github/codeql/codeql-config.yml` excludes the query for every file the
  analysis scans. A genuinely new HTTP route anywhere is therefore not flagged
  by the analyser; this decision's edge rule, not an alert, is what covers it.
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

## Amendment: the one exclusion is tracked configuration (2026-09-17)

This decision first said each `js/missing-rate-limiting` occurrence takes an
individual false-positive dismissal in code scanning, "never a repo-wide query
exclusion", so the guard would keep firing on new routes. On 2026-09-08 the
owner ruled that no finding is dismissed ("We don't dismiss issues, we fix
them") with this class as the one exception, to be kept dismissed rather than
revisited every few weeks. Two records then disagreed about the mechanism: the
rules tier described a per-alert dismissal by the owner (`41235118c`,
2026-09-10), and the same day `.github/codeql/codeql-config.yml` gained a
`query-filters` exclusion of the query (`bd7a3509e`). Asked which was meant, the
owner answered on 2026-09-17, verbatim: "a permanent exclusion is allowed, but
ONLY for that one issue".

The tracked exclusion is therefore the mechanism, and §Decision and the
consequence bullet above are amended to it. Its scope is the query, not a path:
no other query id or finding class is excluded or dismissed by any route. The
comments at the MCP server's route registrations, which name the edge as the
owner of volumetric control and cite this decision, stay as the in-tree
statement of the claim; the owner's 2026-09-08 word also asked them to recognise
in-process limiting as defence in depth, which they do not yet say (the
`code-scanning-alerts-to-zero` plan's unit 6). The falsifier is unchanged: if the edge stops carrying the control
for a served domain, this decision and its exclusion fall together.
