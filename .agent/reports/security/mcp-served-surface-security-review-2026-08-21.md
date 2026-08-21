# MCP Served-Surface Security Review

**Date**: 2026-08-21
**Seat**: S1 (Implementer, served-surface and code half), PDR-117
**Commissioned by**: the owner, via the Director on the `mcp-submission-drive` thread
**Repository state**: `origin/main` at `1173c1adf` (release 1.175.1)
**Deployed state at probe time**: `x-app-version: 1.175.1` on every surface probed

## What this document is

A written assessment. **No security configuration was changed by this review.**
No CSP header, route handler, rate limit, or edge rule was edited. Every
recommendation below is a proposal with a stated warrant and a stated
falsifier, for the owner or a later seat to accept, reject, or defer.

## Scope and boundary

This review owns the **served surface and application code**. A peer seat (S2)
owns the Cloudflare edge and WAF *design*. Where a measurement here is of edge
*behaviour*, it is reported as an observation and the attribution or remedy is
routed to S2 rather than resolved.

Not in scope: Cloudflare ruleset authoring, WAF configuration, the
`oaknational/Cloud-Config` repository.

## Reference basis, with revisions

Every requirement cited below carries the revision it appears in and whether
that revision is the one this server implements. This matters because a
requirement in a revision we do not implement is a planned upgrade item, not a
defect.

- **The server implements MCP revision `2025-11-25`.** The current published
  revision is `2026-07-28`. The gap between them is tracked as MCP-644 and is
  not re-litigated here.
- The owner's brief linked the **draft** security-best-practices page. Where a
  requirement is cited below, it was independently checked against the
  **`2025-11-25`** copy of the same page, and the report states which copy
  carries it. Draft-only material is labelled as such and treated as a watch
  item.
- The **Cloudflare guide is vendor documentation, not a specification**, and it
  is written for MCP servers hosted on Cloudflare Workers. This server runs on
  Vercel behind Cloudflare — a different topology. Guide advice that assumes a
  Workers deployment is marked as such and is not reported as a failure.

Notably, the Cloudflare guide **does not address** rate limiting, WAF
configuration, origin protection, direct-to-origin access, or secret
authentication headers. The owner's origin-bypass question is therefore not a
gap against that guide; it is the owner's own instinct, and it is a good one.

## Method, and the limits of the instruments used

**Every probe below is paired with a control that must fail or must differ.**
A status code on one path proves nothing without a neighbouring path whose
result must differ. Where a control was not available, the finding is marked
`NOT ESTABLISHED` rather than asserted.

**Measurement and inference are separated deliberately.** A control validates
the *instrument*, never the *inference*. After each control, the report states
separately what else must be true for the conclusion to follow.

Three instrument limits bound this review and are load-bearing:

1. **No automated gate in this repository can verify a served header.** Every
   test tier — `.unit.`, `.integration.`, and `e2e-tests/` despite its name —
   runs in-process against a loopback request helper, and runs
   unauthenticated. Tests were read here to learn *intent*. No passing test is
   cited as evidence of live behaviour.
2. **Signed-in behaviour was not measured.** Unauthenticated probes cannot see
   defects that appear only with a session. The only instrument that catches
   those is deleting the `__session` cookie *and its suffixed twin* and
   re-running the flow signed in. That was not done; it needs the owner or a
   seat with a real account. Every signed-in gap is named explicitly below.
3. **A `cf-ray` proves Cloudflare fronts a host, not that it is Oak's
   Cloudflare.** Every edge attribution below rests on a CNAME-chain check,
   not on headers. The discriminating case is recorded in full.

## Summary of findings

Severity is this review's own judgement: **HIGH** = exploitable or
control-defeating today; **MEDIUM** = a real weakening of a control that
depends on something else also going wrong; **LOW** = hygiene or information
disclosure; **NON-FINDING** = investigated and refuted, recorded so it is not
re-raised.

| Ref | Finding | Severity |
| --- | --- | --- |
| F1 | One production hostname reaches the Vercel origin with no Cloudflare in path; the WAF that blocks a payload on every other hostname does not see it | HIGH |
| F2 | Nothing at the origin requires proof of edge transit, and all three Vercel deployment protections are disabled, so edge coverage is a per-DNS-record property with a silent failure mode | HIGH |
| F3 | An edge response-header transform replaces the application's CSP on `mcp.thenational.academy` with a far weaker one, discarding `default-src`, `script-src` and `object-src` | HIGH |
| F4 | Application-level clickjacking headers are `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN`, weaker than the spec's `'none'`/`DENY`, and the edge only compensates on some hostnames | MEDIUM |
| F5 | Authorization-server metadata advertises seven scopes where the protected resource declares one | MEDIUM |
| F6 | Upstream Clerk validation errors pass through to unauthenticated callers verbatim | LOW |
| F7 | The application runs no rate limiting of any kind, by design, and cannot detect the edge ceasing to carry it | MEDIUM |
| N1 | "The consent page lacks `frame-ancestors 'none'`" — refuted; this server serves no consent page | NON-FINDING |
| N2 | "`script-src 'unsafe-inline'` is an XSS weakness here" — refuted as stated; it exists solely for a Cloudflare-injected script, and on production no `script-src` is served at all | NON-FINDING |
| N3 | "Preview deployments are a production-data bypass" — refuted; previews bind to the development Clerk instance | NON-FINDING |
| N4 | "This is a confused-deputy proxy needing per-client consent" — refuted; the proxy introduces no static client ID | NON-FINDING |

## Question 1 — origin bypass, and whether it is a stack-wide property

The owner asked whether a shared secret header gates the origin, and
generalised the question himself. The general case is the important half, and
the answer has two parts that must not be collapsed: **edge coverage is
excellent where it applies, and there is nothing whatsoever holding it in
place.**

### MEASURED

**The MCP application is live on four distinct hostname surfaces.** All four
returned `x-app-version: 1.175.1` and the same healthz body, so all four are
the same build:

```text
mcp.thenational.academy                               (canonical)
www.thenational.academy/mcp                           (the host being retired)
poc-oak-open-curriculum-mcp.vercel.thenational.academy (Vercel deployment alias)
curriculum-mcp-alpha.oaknational.dev                  (alpha alias)
```

The Vercel project `prj_y9hRhJxzdzX198RzOrwq9t8j7ODp` lists, as its own
domains, both `mcp.thenational.academy` and
`curriculum-mcp-alpha.oaknational.dev`. **The alpha alias is not a stale
POC; it is a production domain of the production project.**

The enumeration is bounded, not open-ended. `open-api.thenational.academy/mcp/healthz`
and `teachers.thenational.academy/mcp/healthz` both return their own
applications' Next.js HTML, not the MCP healthz payload. The control that gives
this negative discriminating power is the same path on
`mcp.thenational.academy`, which returns
`{"status":"ok","mode":"streamable-http","auth":"required-for-post"}`. So the
list of four is the full set among the Oak hostnames examined — with the caveat
recorded under NOT ESTABLISHED below that Oak's wider estate was not
enumerated.

**DNS attribution, by CNAME chain rather than by header.**

```bash
dig +noall +answer mcp.thenational.academy A
#   -> 104.18.6.160, 104.18.7.160   (inside 104.16.0.0/13, Cloudflare; no CNAME leaves the zone)
dig +noall +answer thenational.academy NS
#   -> quercus.thenational.academy, cerris.thenational.academy
dig +noall +answer quercus.thenational.academy A
#   -> 162.159.9.224  (inside 162.158.0.0/15, Cloudflare vanity nameserver)

dig +noall +answer curriculum-mcp-alpha.oaknational.dev CNAME
#   -> 4a80221ded84b150.vercel-dns-013.com.  -> 64.239.109.1   (Vercel, NOT Cloudflare)
```

The control that gives this discriminating power, and the trap it avoids:

```bash
dig +noall +answer clerk.thenational.academy CNAME
#   -> frontend-api.clerk.services. -> worker.clerkprod-cloudflare.net. -> 104.18.34.146
```

`clerk.thenational.academy` also answers with a `cf-ray` and
`server: cloudflare`, and it is **not** on Oak's Cloudflare — the CNAME leaves
the zone into Clerk's own Cloudflare account. Header evidence alone would have
attributed Clerk's edge behaviour to Oak. The zone-internal A records on
`mcp.thenational.academy`, under Cloudflare vanity nameservers for the
`thenational.academy` zone, are what make the Oak attribution sound.

**The WAF is real, zone-wide, and blind to the alpha alias.** The same request,
four hostnames:

```bash
P='%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E-s1probe'
curl -sS -o /dev/null -w '%{http_code}\n' "https://mcp.thenational.academy/$P"
#   -> 403, body "Attention Required! | Cloudflare"
curl -sS -o /dev/null -w '%{http_code}\n' "https://www.thenational.academy/mcp/$P"
#   -> 403, Cloudflare block page
curl -sS -o /dev/null -w '%{http_code}\n' \
  "https://poc-oak-open-curriculum-mcp.vercel.thenational.academy/$P"
#   -> 403, Cloudflare block page
curl -sS -w '%{http_code}\n' "https://curriculum-mcp-alpha.oaknational.dev/$P"
#   -> 404 from the application, body: Cannot GET /%3Cimg%20src%3Dx...
```

The control that gives this its power: a benign path on the same four hosts
returns the application's own 404 on all four. So the 403 is discriminating —
it is the payload, not the host, that produces it, and the alpha alias is the
only host where the payload reaches the application.

**The alpha alias carries production identity, not a sandbox one.** Its
discovery documents name the production canonical host and the production
Clerk instance:

```bash
curl -sS https://curriculum-mcp-alpha.oaknational.dev/.well-known/oauth-authorization-server
#   issuer:   https://mcp.thenational.academy
#   jwks_uri: https://clerk.thenational.academy/.well-known/jwks.json
```

The control: the same document on a preview deployment names
`native-hippo-15.clerk.accounts.dev` — the development Clerk instance — and
its own hostname as issuer. So the field genuinely varies by environment, and
the alpha alias genuinely sits in the production one.

**There is no proof-of-edge gate in the application.** Each of these searches
would have found one:

```text
x-vercel-protection-bypass   0 non-test hits
VERCEL_AUTOMATION_BYPASS     0
EDGE_SECRET / ORIGIN_SECRET / SHARED_SECRET   0
clientCertificate / mtls     0
cf-connecting-ip             2 hits, both in src/logging/header-redaction.ts
```

The two `cf-connecting-ip` hits are redaction-list entries — the header is
scrubbed from logs, never read as a control. `app.set('trust proxy')` was
removed with the rate limiter, so the application does not read any
`X-Forwarded-*` value either.

The complete environment-variable surface (`src/env.ts`) is
`ALLOWED_HOSTS`, `APP_VERSION_OVERRIDE`, `CANONICAL_HOST`,
`CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DANGEROUSLY_DISABLE_AUTH`,
`GIT_SHA_OVERRIDE`, `OAK_API_BASE_URL`, `OAK_CURRICULUM_MCP_USE_STUB_TOOLS`,
`PORT`, `REMOTE_MCP_MODE`, `TEST_ERROR_SECRET`. **No variable in that list
could hold an edge shared secret.** This is a stronger negative than a grep:
the boundary schema is closed, so a secret-header gate could not be configured
without a code change.

**All three Vercel deployment protections are disabled** on the project:

```text
passwordProtection: enabled=false
ssoProtection:      enabled=false
trustedIps:         enabled=false
```

**DNS-rebinding protection does not fill the gap, and is not meant to.** It is
mounted on the static-content routes and the `/mcp` HTML negotiation leg only
(`src/mcp-middleware.ts`, `src/application.ts`), not on `/mcp` JSON-RPC,
`/oauth/*`, or `/.well-known/*`. And its allow-list is additive over
Vercel-derived hostnames (`src/security-config.ts`), so a project domain is
allowed by construction — the alpha alias serves the HTML landing page with
`200`, which measures this directly.

### INFERRED

- **A production access token minted at `mcp.thenational.academy` is accepted
  at `curriculum-mcp-alpha.oaknational.dev`.** Warrant: both resolve the same
  canonical origin and the same Clerk JWKS, and audience validation binds to
  the canonical origin rather than the requested Host. **This is inference, not
  measurement** — it needs a real token to confirm, which unauthenticated
  probing cannot supply.
- **`www.thenational.academy/mcp` reaches the MCP application through a
  platform rewrite from a different Vercel project.** Warrant: the response
  carries this application's `x-app-version` and CSP, but that hostname is not
  among this project's four domains. The mechanism is not measured.
- The one confirmed bypass exists because a DNS record in the
  Cloudflare-hosted `oaknational.dev` zone is **unproxied** while its
  neighbours are proxied. Warrant: the zone's nameservers are Cloudflare's,
  yet the record CNAMEs straight to Vercel. Not measured: whether this was
  deliberate.

### NOT ESTABLISHED

- Whether the same unproxied-record pattern exists for **other Oak services**.
  `open-api.thenational.academy` and `www.thenational.academy` are both Vercel
  origins behind Oak's Cloudflare (measured, via `x-vercel-id` with
  `server: cloudflare`), but the credential available to this seat sees **one
  Vercel team with one project**. That is a measurement of the instrument, not
  of Oak's estate. The rest of Oak's Vercel footprint sits outside this
  credential's scope and was not examined.
  *Cheapest way to measure*: enumerate every DNS record in both Cloudflare
  zones and list those whose proxy status is off. That is S2's surface.
- Whether the alpha alias is still needed at all.

### RECOMMENDATIONS

**R1 — Remove `curriculum-mcp-alpha.oaknational.dev` from the production
Vercel project, or proxy its DNS record.** *Warrant*: it is the only measured
path that reaches the production application with production identity and no
WAF. *Falsifier*: if the alias is a required test vehicle whose whole purpose
is to observe origin behaviour without the edge, then removing it destroys a
diagnostic that has already proved its worth in this very review — in which
case proxy the record and keep a separate, non-production vehicle.

**R2 — Add an origin-side proof-of-edge control, and make its absence
visible.** *Warrant*: R1 fixes one record; F2 is that nothing prevents the next
one. The estate's own decision record makes this the load-bearing point —
ADR-219 states plainly that "if [edge configuration] is weakened or removed for
a served domain, nothing in the application compensates, and this decision's
premise is falsified." Today nothing detects that falsification. *Falsifier*: a
shared-secret header is itself a secret to rotate and a way to take the service
down; if the owner judges that operational cost higher than the residual risk,
the cheaper alternative is **detection rather than enforcement** — have the
application record, per request, whether a Cloudflare-injected header was
present, and alert on absence. That is observable, reversible, and cannot cause
an outage. **On the evidence, I recommend detection first and enforcement
second**, because detection has no failure mode that takes the service down and
would have surfaced this finding without a review.

**R3 — Treat "which hostnames serve this application" as a tracked invariant.**
*Warrant*: this review found four surfaces; the brief anticipated one. A
periodic check that enumerates project domains and asserts each is proxied
would have caught F1 on the day the alias was added. *Falsifier*: if domain
additions already pass through a review that checks proxy status, this is
redundant — but no such check was found in this repository.

## Question 2 — clickjacking headers on consent and `/oauth/*` routes

The naive form of this finding is wrong, and the correction matters more than
the finding.

### MEASURED

**The requirement, and its revision.** The bullet the owner is asking about is:

> Prevent iframing via `frame-ancestors` CSP directive or
> `X-Frame-Options: DENY` to prevent clickjacking

It appears under **Consent UI Requirements**, inside the Confused Deputy
mitigation. It is present **verbatim in the `2025-11-25` revision** — the
revision this server implements — as well as in the draft. So this is not a
future-revision item and does not route to MCP-644. It is live against us,
*if* it has a target.

**It has no target: this server serves no consent page.**

```bash
curl -sS -D - -o /dev/null https://mcp.thenational.academy/oauth/authorize
#   HTTP/2 307
#   location: https://clerk.thenational.academy/oauth/authorize
```

`handleAuthorize` in `src/oauth-proxy/oauth-proxy-handlers.ts` forwards the
client's query parameters to a fixed upstream URL and redirects. It renders no
HTML. Following the chain, Clerk redirects again to
`/oauth/authorize/continue`, which returns `401` JSON to an unauthenticated
caller. **The consent screen is Clerk's, on a hostname whose CNAME leaves
Oak's zone.** Oak's headers do not govern it and Oak's edge rules do not reach
it.

**What the application does serve, per route.** Helmet is mounted with
`app.use` in `src/app/bootstrap-security.ts` during the pre-auth phase, so all
routes below receive its headers:

- `/` — the baked landing page, HTML.
- `/mcp` — JSON-RPC, plus an HTML negotiation leg for browsers.
- `/oauth/register`, `/oauth/authorize`, `/oauth/token` — JSON and redirects,
  no HTML.
- `/.well-known/*` — JSON.
- the MCP App widget — delivered as an MCP *resource*
  (`text/html;profile=mcp-app`), **not** governed by this CSP; it declares its
  own allowances through `_meta.ui.csp.resourceDomains` in
  `register-widget-resource.ts`.

**The application's own headers are weaker than the spec's bullet asks for.**
`src/security-headers.ts` sets `frameAncestors: ["'self'"]`, and relies on
helmet's default `X-Frame-Options: SAMEORIGIN`. The spec bullet asks for
`'none'` / `DENY`.

**On the canonical host the edge compensates; on two other hosts it does
not.** Same path, three hosts:

```bash
curl -sS -D - -o /dev/null https://mcp.thenational.academy/
#   x-frame-options: DENY
curl -sS -D - -o /dev/null https://curriculum-mcp-alpha.oaknational.dev/
#   x-frame-options: SAMEORIGIN
curl -sS -D - -o /dev/null https://poc-oak-open-curriculum-mcp.vercel.thenational.academy/mcp/healthz
#   x-frame-options: SAMEORIGIN
```

### INFERRED

- **The confused-deputy conditions are not met, so the per-client-consent
  obligation the iframe bullet belongs to does not attach.** The spec lists
  four conjunctive vulnerable conditions, the first being that the proxy "uses
  a **static client ID** with a third-party authorization server". Reading
  `oauth-proxy-handlers.ts`: `handleRegister` forwards the client's own dynamic
  registration body to Clerk, so **each MCP client receives its own Clerk
  `client_id`**; `handleAuthorize` forwards the client's own `client_id`
  onward. Oak introduces no static client ID and acts as no single OAuth
  client. The first condition fails, so the conjunction fails.
  **This is inference from code, and it is the load-bearing inference in this
  section.** *Falsifier*: a signed-in test in which a newly DCR-registered
  client is taken through `/oauth/authorize` and Clerk skips the consent screen
  because a cookie from an earlier client is present. If consent is skipped,
  the conditions *are* met and N4 is wrong.
- Since Clerk mints per-client IDs, any Clerk consent cookie is bound to a
  `client_id`, which is the mitigation the spec asks for — discharged by the
  authorization server rather than by the proxy.

### NOT ESTABLISHED

- **The framing headers on Clerk's actual consent page.** Unauthenticated
  probing reaches only a `401`. *Cheapest way to measure*: sign in, open the
  consent page, and read `Content-Security-Policy` and `X-Frame-Options` from
  the response — the delete-`__session`-and-its-suffixed-twin method. This is
  the single highest-value unmeasured item in this review, because if Clerk
  does not set `frame-ancestors` there, the spec's MUST is unmet by the system
  as a whole even though it is unmet by nobody's code in this repository.
- Whether `X-Frame-Options: DENY` at the edge is a deliberate Oak rule or a
  Cloudflare managed transform. Routed to S2.

### RECOMMENDATIONS

**R4 — Set `frameAncestors: ["'none'"]` and `xFrameOptions: 'deny'` in
`src/security-headers.ts`.** *Warrant*: the application serves no page that
needs to be framed anywhere, including by itself. `'self'` buys nothing and
costs the difference between meeting and not meeting a `2025-11-25` MUST. It
also makes the two non-canonical hostnames correct without depending on an
edge rule. *Falsifier*: if any surface is framed same-origin, this breaks it.
The candidate is the MCP App widget — but the widget is delivered as an MCP
resource governed by its own declared policy, not by this header, so the
falsifier is expected not to fire. **Confirm by rendering the widget after the
change**, not by reasoning about it.

**R5 — Measure Clerk's consent-page headers before concluding the system meets
the bullet.** *Warrant*: the obligation is on "the MCP-level consent page";
we delegate that page, so we inherit its posture and should know it.
*Falsifier*: if Clerk documents `frame-ancestors 'none'` on hosted OAuth
pages, a documentation citation substitutes for the probe.

## Question 3 — CSP correctness, and whether `script-src 'unsafe-inline'` is a real weakness here

The specific question inverts on measurement. The answer is that
`'unsafe-inline'` is not the weakness — **the edge discarding `script-src`
altogether is.**

### MEASURED

**Three hosts, three CSPs, one build.** This is the discriminating triple:

```bash
# direct to Vercel, no Cloudflare in path
curl -sS -D - -o /dev/null https://curriculum-mcp-alpha.oaknational.dev/mcp/healthz
# content-security-policy: default-src 'self';base-uri 'self';font-src 'self';
#   form-action 'self';frame-ancestors 'self';img-src 'self';object-src 'none';
#   script-src 'self' 'unsafe-inline';script-src-attr 'none';
#   style-src 'self' 'unsafe-inline';upgrade-insecure-requests;
#   connect-src 'self';child-src 'self'

# through Oak's Cloudflare, on a Vercel deployment alias
curl -sS -D - -o /dev/null \
  https://poc-oak-open-curriculum-mcp.vercel.thenational.academy/mcp/healthz
# content-security-policy: (identical to the above)

# through Oak's Cloudflare, on the canonical host
curl -sS -D - -o /dev/null https://mcp.thenational.academy/mcp/healthz
# content-security-policy: upgrade-insecure-requests; frame-ancestors 'self';
```

The middle probe is the control that makes this sound. It has Cloudflare in the
path — `server: cloudflare`, a `cf-ray`, a `__cf_bm` cookie — and it carries
the application's full CSP. So "Cloudflare is in the path" does **not** explain
the canonical host's stripped CSP; only a rule scoped to that hostname does.
All three responses carried `x-app-version: 1.175.1`, and the two healthz
responses shared an identical `ETag`, so the origin is emitting the same bytes.

**The replacement is wholesale, not a merge.** On the canonical host even the
404 handler's own `content-security-policy: default-src 'none'` — which the
alpha alias shows plainly — is replaced by the same fixed
`upgrade-insecure-requests; frame-ancestors 'self';`. Directives lost on the
canonical host: `default-src`, `base-uri`, `font-src`, `form-action`,
`img-src`, `object-src`, `script-src`, `script-src-attr`, `style-src`,
`connect-src`, `child-src`. **With neither `default-src` nor `script-src`
served, production imposes no script-source restriction at all.**

**The transform is hostname-scoped, and scoped differently from the WAF.**
`mcp`, `open-api`, and `teachers` all serve the stripped CSP plus
`x-frame-options: DENY`, `referrer-policy: strict-origin-when-cross-origin`,
HSTS with `preload`, and a `permissions-policy`. `www` gets the
referrer and permissions headers but **no** enforced CSP at all — it serves its
own long `content-security-policy-report-only`. `vercel.thenational.academy`
gets none of the transform. The WAF, by contrast, fires on all of them.

**The only inline script on the served page is Cloudflare's own.** Extracting
scripts from the production landing page: exactly one inline `<script>`, 921
bytes, and its content is the Cloudflare challenge bootstrap —
`window.__CF$cv$params` followed by an injected
`/cdn-cgi/challenge-platform/scripts/jsd/main.js`. The page has **zero**
`<style>` blocks and **zero** inline `style` attributes. Every asset reference
is same-origin. So the code comment in `security-headers.ts` is accurate, and
now measured: `script-src 'unsafe-inline'` exists for Cloudflare's injection,
not for Oak's own markup.

**No reflected-input sink was found.** The 404 handler echoes the path, and it
arrives percent-encoded and stays that way:

```bash
curl -sS https://curriculum-mcp-alpha.oaknational.dev/%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E
#   <pre>Cannot GET /%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E</pre>
#   served with content-security-policy: default-src 'none'
```

Control: the same request with a benign path differs only in the echoed text,
so the echo is real and the encoding is what neutralises it.

**Against the Cloudflare guide's template.** The guide's CSP is
`default-src 'none'; script-src 'self' [nonce]; style-src 'self' 'unsafe-inline';
img-src 'self' https:; font-src 'self'; form-action 'self';
frame-ancestors 'none'; base-uri 'self'; connect-src 'self'`. Oak's origin CSP
differs in three ways: `default-src 'self'` rather than `'none'`,
`script-src 'unsafe-inline'` rather than a nonce, and `frame-ancestors 'self'`
rather than `'none'`. The nonce recommendation is marked in the guide as
Workers-specific; the clickjacking one is deployment-agnostic. Oak is stricter
than the template on `img-src` (`'self'` versus `'self' https:`).

### INFERRED

- **`style-src 'unsafe-inline'` is surplus and can go.** The code comment
  retains it because the Cloudflare rationale is "documented for scripts and
  unproven for styles". The measurement resolves it: the challenge bootstrap
  sets style through CSSOM property assignment (`a.style.position='absolute'`),
  which CSP `style-src` does not govern, and the page itself has zero inline
  styles. *Falsifier*: Cloudflare's interstitial challenge page is a separate
  document; if it is served carrying the origin's CSP and contains an inline
  `<style>`, removing this breaks a bot-protection page. Verify by triggering a
  managed challenge and reading that page's own headers before removing.
- **On production today, the `'unsafe-inline'` question is moot**, because no
  `script-src` reaches the browser. It bites only on the hostnames where the
  application's CSP survives — which is the majority of them.
- A nonce is feasible in principle but awkward: the landing page is **baked at
  build time** (`build-scripts/bake-landing-page.ts`), so a per-response nonce
  would need injection at serve time. Not measured.

### NOT ESTABLISHED

- **Which Cloudflare mechanism performs the replacement** — a Response Header
  Transform Rule, a managed transform, or a Worker. Routed to S2. The
  measurement above tells S2 exactly what to look for: a rule scoped to
  `mcp`, `open-api`, and `teachers`, setting rather than appending
  `content-security-policy`.
- Whether the replacement is deliberate. It cannot be inferred from the effect.
  It *adds* four headers that are improvements and *removes* eleven CSP
  directives that are protections, which reads more like a security-headers
  template applied without noticing the origin already sent a stronger CSP than
  like a considered decision. **That is a guess and is labelled as one.**

### RECOMMENDATIONS

**R6 — This is the finding to act on first.** Stop the edge replacing the
application's CSP on the canonical host. Whether the fix is scoping the rule
out, or switching it from set to add, is S2's call. *Warrant*: production
currently serves the weakest CSP of any surface measured, on the one hostname
that matters most, and the application's own carefully-authored policy is
discarded before it reaches a browser. *Falsifier*: if the stripped CSP is
deliberate because the full one broke a Cloudflare challenge page, then the
correct fix is narrowing the application's CSP knowingly, not silently
replacing it — and that reasoning should be on the record either way.

**R7 — Tighten `default-src` to `'none'` and add an explicit `object-src
'none'`.** *Warrant*: aligns with the Cloudflare template; the served page's
asset list is fully enumerated above, so every needed source already has its
own directive. *Falsifier*: any asset class not in the enumerated list breaks.
Verify by loading the page and reading the console, not by reasoning.

**R8 — Do not remove `script-src 'unsafe-inline'` while Cloudflare injects its
challenge bootstrap.** *Warrant*: measured — the injected inline script is
real and is the only inline script present. Removing the directive would break
bot protection on the HTML surfaces. **This is a recommendation against a
change that a reviewer reasoning from the guide alone would propose.**

**R9 — Prefer a rendered check over any header reasoning for these changes.**
*Warrant*: no gate in this repository can see a served header, so every CSP
change in this estate ships unverified unless someone probes the deployed host.
*Falsifier*: none — this is a statement about the instruments, established in
the Method section.

## Question 4 — rate limiting on `/mcp`, application side

### MEASURED

**The application runs no rate limiter, deliberately.** The removal is
commit `826652664`, "remove the in-code rate limiter — rate limiting is an edge
concern (ADR-219)", under ticket MCP-411. ADR-219
(`docs/architecture/architectural-decisions/219-rate-limiting-is-an-edge-concern.md`)
records three reasons: the edge owns volumetric control; the upstream quota
threat never applied because this service's Oak API key is exempt as an
internal consumer; and on Vercel Fluid Compute an in-process counter could not
count per client, because instances are short-lived, routing is not
client-affine, and the forwarded header the limiter keyed on resolved to
Cloudflare egress addresses.

What the removal took with it, per the commit body: the limiter sources and
tests, the `express-rate-limit` dependency from the application, and
`app.set('trust proxy', 1)`.

**What remains in the application.** No limiter, no `429` of its own — ADR-219
states that "a 429 reaching a client originates at the edge or upstream". The
upstream OAuth legs preserve a `429` mapping in
`src/oauth-proxy/oauth-proxy-response.ts`. The OAuth proxy applies a
**10-second upstream timeout** via `AbortController`
(`oauth-proxy-routes.ts`, `timeoutMs ?? 10000`). `/oauth/token` parses its body
with `express.text({ type: 'application/x-www-form-urlencoded' })`, which
carries Express's default 100 kB body ceiling. `src/auth/mcp-body-parser.ts`
imposes no limit of its own — it is type-guard extraction, not a parser.

The `get-rate-limit` MCP tool reports the **upstream Oak Open Curriculum API's**
per-key limits, not any limit of this server's. Per ADR-219 this service's key
is exempt as an internal consumer.

**A bounded burst produced no throttling on either host.**

```bash
for i in $(seq 1 30); do
  curl -sS -o /dev/null -w '%{http_code} ' -X POST "https://$h/mcp" \
    -H 'content-type: application/json' \
    -H 'accept: application/json, text/event-stream' \
    -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{...}}'
done
# mcp.thenational.academy:               30x 401
# curriculum-mcp-alpha.oaknational.dev:  30x 401
```

**This probe has weak discriminating power and must not be over-read.** It
establishes only that no limit binds below 30 requests per burst from one
address. It cannot distinguish "no limit" from "a limit above this threshold",
and 30 requests is far too few to characterise an edge limiter. It is reported
because the *absence* of a 429 is consistent with ADR-219's claim that the
application emits none, and for no more than that.

**Dynamic client registration is open and unauthenticated on both hosts:**

```bash
curl -sS -X POST https://mcp.thenational.academy/oauth/register \
  -H 'content-type: application/json' -d '{"s1_probe_invalid":true}'
#   HTTP 400  {"error":"invalid_redirect_uri", ...}
```

`400` rather than `401` is the discriminating result: the endpoint is reachable
without credentials and rejects on content, so it is open by design (as MCP DCR
requires) rather than gated. Combined with no application rate limiting, this
is an unauthenticated endpoint that causes an upstream Clerk write on each
valid call.

### INFERRED

- ADR-219's premise is sound as reasoning and **unfalsifiable from inside the
  application** as an operational claim. The ADR says so itself: the decision
  "is falsified the moment the edge stops carrying the control", but nothing in
  the application observes whether it still does. F1 is a concrete instance —
  on the alpha alias the edge carries nothing, and the application is unaware.
- `/oauth/register` is the most attractive abuse target on the surface, because
  it is unauthenticated and it does upstream work. *Not measured*: whether
  Clerk itself rate-limits registration. **I deliberately did not probe that**,
  because establishing it means creating client records in Clerk.

### NOT ESTABLISHED

- **The edge's actual rate-limit configuration.** S2's boundary, and the half
  that decides whether ADR-219's premise holds.
- Whether `/oauth/register` is rate-limited anywhere. *Cheapest way to
  measure*: read the Cloudflare rules for that path (S2), rather than by probe.
- Whether the 100 kB `/oauth/token` ceiling and the absence of any comparable
  documented ceiling on `/mcp` JSON-RPC bodies is deliberate. The MCP body path
  was read and no explicit limit was found; whether the SDK transport imposes
  one was not established.

### RECOMMENDATIONS

**R10 — Give ADR-219 the detector it names but does not have.** *Warrant*: the
ADR makes an architectural claim explicitly conditional on edge configuration,
and provides no way to notice the condition failing. This is the same
mechanism as R2 and should be one piece of work, not two. *Falsifier*: if the
edge configuration is itself under change control with review, the detector is
belt-and-braces — but F1 shows a path where the edge was simply not in front of
the application at all, which no ruleset review would have caught.

**R11 — Establish, at the edge, what protects `/oauth/register`.** *Warrant*:
unauthenticated, causes upstream writes, and the application by design does
nothing. *Falsifier*: if Clerk rate-limits registration per source, the
exposure is Clerk's and bounded.

**R12 — Do not reinstate an in-application limiter.** *Warrant*: ADR-219's
three reasons were measured, not assumed, and the deployment facts that
defeated the old limiter have not changed. *Falsifier*: a move off Fluid
Compute to client-affine routing would reopen the question.

## Other findings met in passing

**F5 — Scope advertisement exceeds resource need.** Measured: the
protected-resource document declares `scopes_supported: ["email"]`, while the
authorization-server document advertises `openid`, `profile`, `email`,
`public_metadata`, `private_metadata`, `offline_access`, `user:org:read`. The
capability fields are passed through unchanged from Clerk by
`rewriteAuthServerMetadata` (`oauth-proxy-upstream.ts` rewrites the four
endpoint fields only). The `2025-11-25` security page's Scope Minimization
section lists "Publishing all possible scopes in `scopes_supported`" as a
common mistake, and its guidance is SHOULD-level, not MUST. Inferred: a client
with no `scope` challenge to guide it falls back to requesting everything
advertised, so a consent screen may ask for `private_metadata` this server
never uses. **Not established**: whether the Clerk OAuth application actually
grants those scopes — that is Clerk-side configuration and was not inspected.
*Recommendation*: filter `scopes_supported` in the metadata rewrite to the set
this resource uses. *Falsifier*: ADR-115's transparent-passthrough constraint
deliberately forbids refusals of Oak's own devising; narrowing an advertised
capability may fall under that constraint, which makes this a decision for the
ADR's owner rather than a defect to fix.

**F6 — Upstream error text passes through verbatim.** Measured: an
unauthenticated `POST /oauth/register` returns
`Key: 'CreateParams.redirect_uris' Error:Field validation for 'redirect_uris'
failed on the 'required' tag` — Clerk's internal Go struct names, reaching an
anonymous caller through `applyParsedResponse`. Low severity. Worth noting for
the contrast: Oak's *own* rejection path in
`oauth-proxy-redirect-uri-validation.ts` is scrupulous about this, documenting
that the description is "STATIC by construction — the submitted URI is never
echoed" because the endpoint is unauthenticated and hostile input is expected.
The discipline is right and holds for Oak's refusals; it does not extend to
Clerk's. *Recommendation*: none urgent; if ADR-115's passthrough contract
permits, map upstream 4xx bodies to a generic RFC 7591 error.

**N3 — Preview deployments are not a production bypass.** Measured: preview
deployment documents name `native-hippo-15.clerk.accounts.dev` as `jwks_uri`
and their own hostname as `issuer`, so `CANONICAL_HOST` is unset in preview and
tokens do not cross between preview and production. Measured: deployment
aliases are all on `vercel.thenational.academy`, which is Cloudflare-proxied
and WAF-covered; guessed `*.vercel.app` hostnames returned Vercel's
`DEPLOYMENT_NOT_FOUND`, distinguishable from an application 404 by the absence
of `x-app-version`. A custom deployment suffix replacing the `.vercel.app`
URLs is a real piece of hardening Oak already has. Inferred: preview
deployments are publicly reachable, which is a data-free information surface
(they expose build metadata and the landing page) and not a data exposure.

**Positive finding — the auth-disable flag is guarded at the boundary.**
`DANGEROUSLY_DISABLE_AUTH` is refused outside local development by a schema
check in `src/env.ts` (line 127), and the served behaviour confirms auth is on:
`POST /mcp` returns `401` unauthenticated on every one of the four surfaces.
The served `401` is the right instrument here — it measures the target, not the
guard.

**Positive finding — no open redirect in the OAuth proxy.**
`buildAuthorizeRedirectUrl` appends `URLSearchParams.toString()` to an upstream
base URL derived deterministically from the Clerk publishable key. No query
parameter can steer the host.

## Residual risks I am not certain about

Named rather than smoothed, in descending order of how much they would change
this report:

1. **Clerk's consent-page framing headers are unmeasured.** If Clerk does not
   set them, the `2025-11-25` MUST is unmet by the system even though no code
   in this repository is at fault. This is the one gap that could turn N1 back
   into a finding. Measure it signed in.
2. **Token acceptance on the alpha alias is inferred, not measured.** The whole
   severity of F1 turns on it. If audience validation binds to the requested
   Host rather than the canonical origin, F1 drops from HIGH to a
   defence-in-depth concern. Measure it with one authenticated `tools/list`
   against the alias.
3. **The confused-deputy refutation (N4) rests on reading two functions.** It
   is the most consequential inference in the document. If Oak ever introduces
   a static client ID — for instance by registering one Clerk client for all MCP
   clients — the four vulnerable conditions close and a per-client consent page
   becomes a MUST, complete with its framing requirement.
4. **Oak's wider Vercel estate was not examined**, because the credential
   available sees one team and one project. The stack-wide claim in Q1 is
   supported for the MCP application's four surfaces and for three
   `thenational.academy` hostnames; it is *not* supported as a statement about
   every Oak service.
5. **The rate-limit burst is 30 requests.** It characterises nothing about the
   edge. Do not cite it as evidence that no limit exists.
6. **Attribution of the CSP replacement to a specific Cloudflare mechanism is
   not established.** The effect is measured on five hostnames; the cause is
   S2's.
7. **`www.thenational.academy/mcp` is live and serving the MCP application**,
   on a host documented as being retired. Whether it is scheduled for removal,
   and whether its rewrite path bypasses anything the canonical host applies,
   was not established.

## Absorbed reviewer verdict

A `security-expert` review of the code half was commissioned in parallel with
these probes, with the same measurement-versus-inference discipline imposed on
it. Its disposition is recorded in the section below as accepted, refuted, or
deferred, with the evidence for each. **A reviewer's confident claim is a
claim, not a measurement**, and every item was checked against the probes above
before being accepted.

<!-- REVIEWER-DISPOSITION -->

## For the Director

Routed to S2: the CSP-replacement rule's identity and scope (R6), the WAF's
scope relative to it, the edge rate-limit configuration, and an enumeration of
unproxied DNS records across both Cloudflare zones.

Routed to the owner: R1 (remove or proxy the alpha alias) is the one item where
a small configuration change closes a measured HIGH finding, and it is edge or
platform configuration rather than code. It is stated here rather than applied,
per the brief.
</content>
