# `mcp.thenational.academy` — cutover record, verification set, and rollback

**The switch happened on 2026-08-20.** This document was written the evening
before as a forward procedure; it is now the **record of what was actually done**,
the **verification set that proves the result**, and the **rollback**, which is the
only part still waiting to be used.

**Read this before touching the hosts.** If you are here because something looks
broken, go to [Rollback](#rollback) — and read its two warnings first: the
disposition warning, because reverting the canonical host is settled against, and
the ordering warning, because the intuitive order strands clients.

## The premise this was done under — and the ruling that replaced it

**The premise on 19–20 August was "`www.thenational.academy/mcp` must keep
working".** Two external commitments were held to depend on it: the three carousel
images baked into Anthropic's published listing, and every already-installed Claude
Code plugin, which has `https://www.thenational.academy/mcp` hardcoded in its local
config. So the shape was **add a host, then move what it advertises** — never "move
the app".

**That premise is now retired, and this section is the correction. Do not carry the
old one forward.** Two things retired it, in this order.

### 1. The premise was already false in the authenticated path — measured, not argued

`CANONICAL_HOST` is single-valued, so both hosts serve the **identical**
protected-resource metadata naming `https://mcp.thenational.academy/mcp` as the
resource. Measured 2026-08-20 ~14:00Z with the reference implementation's own
`selectResourceURL()` (`@modelcontextprotocol/sdk` 1.30.0) against the live-fetched
document, by an implementer seat and reproduced by the Director seat:

```text
https://mcp.thenational.academy/mcp  -> OK      (control passes)
https://www.thenational.academy/mcp  -> THROWS  "Protected resource
                                                 https://mcp.thenational.academy/mcp
                                                 does not match expected …/www…"
```

The throw is inside `auth()` **before client registration**, so it is a hard
discovery failure rather than a scope or token problem. **A conforming `www`-pinned
client cannot authorise.** Residual: a client supplying a custom
`validateResourceURL` hook bypasses the check, so shipping clients divide into those
on the default path (fail) and those overriding it — which of the installed base is
which is **not measured**.

So "`www/mcp` keeps working" was true only for unauthenticated probes. It was never
true for the signed-in path the commitment was about.

### 2. Owner ruling, 2026-08-20 — `www/mcp` is retired as anything to do with this repository

The end state is that **`mcp.thenational.academy` is ONLY the MCP server**; anything
serving assets or HTML comes from Oak-Web-Application instead. What stays on this
repository's surface, because it **is** the server:

- `/mcp` — the Streamable HTTP protocol endpoint
- `/.well-known/oauth-protected-resource/mcp` and `/.well-known/oauth-authorization-server`
- `/oauth/*` — the app-served authorisation, token and registration endpoints
- `/mcp/healthz`

**No redirects, no signposting, no phased cutover.** Owner ruling, verbatim: _"No, no
one has used www/mcp in earnest yet so we dont need to handle redirects or
signposting."_ An earlier requirement for a self-describing response at the swap was
retired at that ruling. **Do not reintroduce any of it.**

**The withdrawal mechanism is Cloud-Config PR #561**, which removes **both**
`www.thenational.academy` MCP rules (see
[the origin-rule scope](#the-actual-origin-rule-scope-measured-not-remembered)). It
was OPEN and awaiting review at the time of writing. Withdrawal is **not** a rollback
action and is not performed by anything in this document.

### What that means for an operator reading the rest of this page

- **Nothing here instructs you to preserve `www/mcp`.** Where a check below runs on
  `www`, it is measuring a **withdrawal in progress** — a current fact about a surface
  being retired — not a requirement to keep green.
- **`CANONICAL_HOST` stays on the new host. This is settled, not a preference.** The
  recommendation to revert it to `www` was live on 2026-08-20 morning and is
  **withdrawn as wrong** (recorded at commit `ca80bbac1`): the metadata is
  host-independent, so reverting does not defer the mismatch, it inverts which
  population it breaks — fixing legacy installs by breaking every client dialling the
  canonical advertised host, which is the host being publicised. The correct end
  state, each host self-describing as itself, is **unavailable** because
  `CANONICAL_HOST` is single-valued.
- **The disposition is: keep the canonical host, and `www`-pinned conforming clients
  must re-point.** Accepted, with the ruling above as the reason the re-point was
  always unavoidable.

---

## What was actually done, in order

Each row is a measurement, not a plan. Where a fact came from another seat it says so.

| #   | Change                                                     | Evidence                                                                                                                                                               |
| --- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Vercel domain registered on the project                    | `/v9/projects/<prj>/domains/<host>` → `200`, `verified: true`; control host → `404 not_found`                                                                          |
| 2   | `ALLOWED_HOSTS` made additive (PR #920)                    | merged `97daa15f3`, released **1.175.1**                                                                                                                               |
| 3   | `ALLOWED_HOSTS=mcp.thenational.academy` set for Production | the HTML leg stopped returning `403 host not allowed`                                                                                                                  |
| 4   | DNS record created by **targeted `terraform apply`**       | owner-run from the then-unmerged PR branch; state serial **360** at `09:48:27Z`; `cloudflare_record.cname["mcp"]` in state (liaison's read, control: 60 cname entries) |
| 5   | `CANONICAL_HOST` switched to `mcp.thenational.academy`     | both hosts' protected-resource metadata now names the new host (below)                                                                                                 |
| 6   | `proxied = true` applied                                   | `server: cloudflare` + `CF-RAY` present, matching the `www` control                                                                                                    |
| 7   | TLS certificate issued                                     | `https` → `200`; `http` → `301` (Vercel restores the redirect once a certificate exists)                                                                               |

**No Clerk change was made.** There is no row for one because none was performed. The
pre-cutover measurement at 2026-08-20 08:20Z recorded Clerk allowed origins and
redirect URIs as _"unstarted, not agent-doable"_ — no `clerk` CLI installed, no
`CLERK_SECRET_KEY` in `.env.local`, and the production-secret route deliberately
declined — and no later record in this repository shows an origin being added, by
anyone, for `mcp.thenational.academy`. The signed-in cookie-cleared flow was then run
by the owner on both hosts on cutover day and the MCP-517 symptom did not reproduce
(owner's result, relayed by the liaison seat).

**This is a bounded negative, so read its scope.** What is established is that _this
repository's record contains no Clerk change_. This document's author **cannot read
the Clerk instance configuration** — the production instance
(`clerk.thenational.academy`, shared with the main Oak website) is reachable only with
the production secret, which no seat here holds. So "no origin was added" is a
statement about the record, not a read of Clerk. **The rollback therefore contains no
Clerk step**; see [Rollback](#rollback).

**Cloud-Config #556 (the DNS record) is MERGED** — `2026-08-20T09:56:45Z`. It was
still OPEN when the apply ran, which is why the record existed before the merge: with
CLI-driven execution the working directory _is_ the configuration, so an unmerged
branch can apply. The merge reconciled `main` with state; it already matched byte for
byte, same value and same `proxied` flag, so there was nothing to import and no
already-exists risk.

### One correction to step 4, recorded because the old version of this page was wrong

This page previously said the record was deliberately **grey-cloud (unproxied)**, and
that proxying was out of scope as a three-part change. **That was the plan on 19
August and it is not what shipped:** the host is proxied as of step 6, so Cloudflare's
WAF and rate limiting are in path. Treat the old grey-cloud reasoning as history.

---

## Verification set

**Every check here is honest about what it proves.** An earlier version of this page
repeated one probe — an empty `POST /mcp` with no `Accept` header — and read its `401`
as proof that "the protocol is answering". It is not: a `401` only proves an auth
boundary responded. A code review (`mantagen`, 2026-08-20) called that out as a
false-green generator, and it was right. The probes below separate **transport
health** from **the expected auth challenge**, and every one of checks 1–5 is
**unauthenticated** — see
[check 6](#6-the-signed-in-cookie-cleared-flow--the-only-check-that-sees-mcp-517),
which is the only one that can see the failure class that matters.

### 1. Conformant MCP protocol check — run this on BOTH hosts

```bash
init='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"verify","version":"1.0"}}}'
for H in https://mcp.thenational.academy https://www.thenational.academy; do
  echo "== $H"
  curl -s -D - -o /dev/null -X POST "$H/mcp" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json, text/event-stream' \
    -d "$init" | grep -iE '^(HTTP/|www-authenticate)'
done
```

**Measured 2026-08-21, both hosts identical (unchanged since 2026-08-20 12:31Z):**

```text
HTTP/2 401
www-authenticate: Bearer resource_metadata="https://mcp.thenational.academy/.well-known/oauth-protected-resource/mcp"
```

The `401` is correct **and now means something**, because the request was a
well-formed `initialize` with the required `Accept` header: the transport accepted the
request, negotiated, and the auth boundary answered with a conformant RFC 9728
challenge. **A `406` here means your `Accept` header is wrong, not that the server is
broken** — see the path note below.

**On `www` this is a withdrawal measurement, not a pass criterion.** It answers today
because the origin rule is still live. When Cloud-Config #561 merges, the expected
result on `www` becomes the main website's own response to `POST /mcp`, and that is
the correct outcome, not a regression.

### 2. TLS must actually complete — a status code is not enough

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://mcp.thenational.academy/mcp/healthz
curl -s -o /dev/null -w '%{http_code}\n' http://mcp.thenational.academy/mcp/healthz   # expect 301
```

**Good: `200` over HTTPS, and `301` on plain HTTP.** Both re-measured 2026-08-21.

**Why this check exists.** Between the DNS record appearing and the certificate
issuing, the host resolved, served **plaintext HTTP with no redirect**, and failed the
TLS handshake outright. In that window the full OAuth proxy — DCR and the token
endpoint — was reachable in cleartext. A status-code check over HTTP passes happily in
that state. **The redirect is the signal that the certificate landed**; Vercel
withholds it until then.

### 3. The host is proxied — check with a control

```bash
curl -s -D - -o /dev/null http://mcp.thenational.academy/mcp/healthz | grep -iE '^(server|cf-ray)'
curl -s -D - -o /dev/null http://www.thenational.academy/mcp/healthz | grep -iE '^(server|cf-ray)'  # control
```

**Good: `server: cloudflare` and a `CF-RAY` on both** — re-measured 2026-08-21. If the new host shows
`server: Vercel` with no `CF-RAY`, it is unproxied and Cloudflare's WAF and rate
limiting are **not** in path — which falsifies ADR-219's premise for that domain.

### 4. Discovery documents — with host labels, a control, and no silent pass

This check previously used a bare `grep -o` inside an unlabelled loop, so a non-routed
or non-JSON response printed **nothing** and the run still read as "identical on both
hosts". The form below labels each host, always prints a line, and carries a control
that must differ between the hosts.

```bash
for H in https://mcp.thenational.academy https://www.thenational.academy; do
  echo "== $H"

  printf '  PRM (/mcp-suffixed): '
  curl -s -w ' [%{http_code} %{content_type}]\n' \
    "$H/.well-known/oauth-protected-resource/mcp" | head -c 400

  printf '  AS metadata (root):  '
  curl -s "$H/.well-known/oauth-authorization-server" \
    | grep -o '"issuer":"[^"]*"' || echo '(no issuer field — not JSON, or not routed to this app)'

  printf '  CONTROL, PRM unqualified (must NOT reach this app on www): '
  curl -s -o /dev/null -w '%{http_code} %{content_type}\n' \
    "$H/.well-known/oauth-protected-resource"
done
```

**Measured 2026-08-21 — verbatim output of the block above:**

```text
== https://mcp.thenational.academy
  PRM (/mcp-suffixed): {"resource":"https://mcp.thenational.academy/mcp","authorization_servers":["https://mcp.thenational.academy"],"scopes_supported":["email"]} [200 application/json; charset=utf-8]
  AS metadata (root):  "issuer":"https://mcp.thenational.academy"
  CONTROL, PRM unqualified (must NOT reach this app on www): 200 application/json; charset=utf-8
== https://www.thenational.academy
  PRM (/mcp-suffixed): {"resource":"https://mcp.thenational.academy/mcp","authorization_servers":["https://mcp.thenational.academy"],"scopes_supported":["email"]} [200 application/json; charset=utf-8]
  AS metadata (root):  "issuer":"https://mcp.thenational.academy"
  CONTROL, PRM unqualified (must NOT reach this app on www): 404 text/html; charset=utf-8
```

**The control is what makes the two identical readings trustworthy.** On `www` the
**unqualified** protected-resource path returns the main website's `404` HTML, while
the `/mcp`-suffixed one returns this app's JSON. Same host, same `.well-known`
prefix, opposite destinations — so the instrument discriminates, and the matching
metadata above is a real match rather than a uniform artefact.

**The root AS-metadata path DOES reach this app on `www`.** That is measured, and it
matters because it is easy to conclude otherwise: two source comments in this
repository — in `served-origin.ts` and `app/static-asset-paths.ts` — describe the edge
rule as scoped to `/mcp` and `/mcp/*`. Their **conclusions** are correct (the
unqualified metadata path and root-relative assets do stay on the website, as the
control above shows), but their **stated scope is incomplete**, and reading it as the
whole rule yields the wrong expectation for this check. The measured scope is below.

#### The actual origin-rule scope, measured not remembered

There are **two** rules, not one, in `oaknational/Cloud-Config`, and they carry a
**byte-identical** expression:

| File (under `infrastructure/cloudflare/rulesets/`) | Rule                     | Effect                                                                    |
| -------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| `header_transforms.tf`                             | origin route (MCP-172)   | rewrites origin + `host_header` to `curriculum-mcp-alpha.oaknational.dev` |
| `config_settings.tf`                               | cache settings (MCP-172) | bypasses cache for the same path scope                                    |

Read from that repository's `main` on 2026-08-21:

```text
(http.host eq "www.thenational.academy") and (
  http.request.uri.path eq "/mcp"
  or starts_with(http.request.uri.path, "/mcp/")
  or http.request.uri.path eq "/.well-known/oauth-protected-resource/mcp"
  or http.request.uri.path eq "/.well-known/oauth-authorization-server"
  or starts_with(http.request.uri.path, "/oauth/")
)
```

**Five path families, not one.** Consequences an operator needs:

- The root AS-metadata path and all of `/oauth/*` on `www` are **claimed for this
  app**, which is why check 4 reads identically on both hosts.
- The **unqualified** `/.well-known/oauth-protected-resource` is **not** in scope,
  which is why the control returns the website's `404`.
- **Removing the origin rule alone orphans the cache rule.** Cloud-Config #561 removes
  both, together, for exactly this reason. Never remove one.

### 5. What `www` still serves — a withdrawal measurement

```bash
for H in https://mcp.thenational.academy https://www.thenational.academy; do
  curl -s -o /dev/null -w "$H carousel:%{http_code}\n" "$H/mcp/carousel/carousel_image_1.png"
  curl -s -o /dev/null -w "$H healthz:%{http_code}\n"  "$H/mcp/healthz"
done
```

**Measured 2026-08-21: `200` on all four.**

**Read this as state, not as a commitment being honoured.** The carousel images are
**assets**, and the owner ruling puts assets and HTML on Oak-Web-Application rather
than this repository. **Where the carousel is finally served from is an open
owner-held question at the time of writing** — it is not settled by this document and
nothing here should be read as promising `/mcp/carousel/*` on either host. The
`/mcp/healthz` row is different: health is part of the server and stays.

### 6. The signed-in, cookie-cleared flow — the only check that sees MCP-517

**Checks 1–5 cannot detect the MCP-517 failure class and neither can any automated
gate in this estate**, because every one of them runs unauthenticated. A signed-in
defect passes all of them.

This check is **manual, browser-based, and required** wherever this document calls for
it — including in the rollback. It has no `curl` form.

1. In the browser, delete the `__session` cookie **and its suffixed twin** for the
   Clerk domain. A synthetic `__client_uat=1` is **not** equivalent and has produced
   false confidence here before.
2. Complete a real sign-in against `https://mcp.thenational.academy`, then make one
   authenticated tool call.
3. Repeat both steps against `https://www.thenational.academy` for as long as that
   host is still routed to this app.

**Expected: sign-in completes and the authenticated call succeeds, with no Clerk
`422`.** The owner ran exactly this on both hosts on cutover day and the MCP-517
symptom did not reproduce (owner's result, relayed by the liaison seat — not measured
by this document's author).

### Path note — `/mcp/*` is a catch-all, so "not a 404" proves nothing

```text
GET /mcp/server-card             -> 406 {"error":"Accept header must include text/event-stream"}
GET /mcp/zzz-nonexistent-control -> 406  (identical — this is the control)
GET /mcp                         -> 406  (identical)
GET /mcp/healthz                 -> 200  (a real route, so the probe discriminates)
```

The Streamable HTTP transport answers the whole `/mcp/*` path space. **A non-existent
path under `/mcp/` returns `406`, not `404`**, so any check written as "confirm it is
not a 404" passes on a completely wrong URL. It also means the MCP-recommended
server-card location is currently occupied by the transport handler — see MCP-422.

---

## What is NOT verified — the honest gap

**This is the part a reader should not skim.**

1. **Whether the resource server validates token audience per host** — untested. It is
   what decides whether a client that _does_ override `validateResourceURL`, and so
   gets past the discovery failure above, can then present a token audienced for the
   new host to `www` and be served.
2. **How much of the installed base overrides `validateResourceURL`.** The default path
   fails, measured. The overriding path is untested and its size is unknown.
3. **The Clerk instance configuration.** Not readable from here (see
   [What was actually done](#what-was-actually-done-in-order)). The signed-in flow
   worked on both hosts on cutover day; _why_ it worked with no recorded Clerk change
   is **not established**, and this document does not claim that no change was needed —
   only that none is recorded.
4. **Where the carousel images are finally served from** — owner-held, open.

Items 1–2 replace an earlier entry on this page which said the `www`-pinned client
question had never been run. **It has been run, and the answer is in
[the premise section](#1-the-premise-was-already-false-in-the-authenticated-path--measured-not-argued).**

---

## Rollback

**Read both warnings before you touch anything.**

### Warning 1 — the disposition is settled against this rollback

**Reverting `CANONICAL_HOST` to `www` is withdrawn as wrong and is not an available
preference.** The metadata is host-independent, so the revert does not defer the
mismatch — it **inverts which population breaks**, fixing legacy installs by breaking
every client dialling the canonical advertised host. And `www/mcp` is being withdrawn
from this repository, so the revert has no durable destination.

**This section is retained as an emergency procedure only** — for an operator facing a
live failure on the new host with no better lever — never as the answer to "which host
should we be on". If you are reading it as a choice, stop: the choice is made.

### Warning 2 — the ordering

The obvious rollback order — undo the last thing first, so `CANONICAL_HOST`, then DNS,
then `ALLOWED_HOSTS` — **is wrong in its tail**, and an earlier version of this page
recommended it. Narrowing `ALLOWED_HOSTS` or withdrawing the host **because
`CANONICAL_HOST` was reverted** can strand sessions and clients that already observed
the new metadata: they hold tokens and cached discovery documents naming the new host,
and you have just removed the host's ability to serve them. The steps are **not**
independent — they are coupled through discovery caching.

**Roll back the self-description; leave the additive safety in place.**

### Step 1 — revert the self-description (this is the actual undo)

1. Vercel → Environment Variables → `CANONICAL_HOST` → `www.thenational.academy`.
2. **Rebuild the deployment currently in production.** The environment value is
   consumed at **build** time, so the edit alone changes nothing — and this project
   makes "just redeploy" ambiguous in two ways that both fail silently. Use exactly one
   operation:

   ```bash
   # the supported operation: rebuild the deployment that is CURRENTLY in production
   vercel redeploy <current-production-deployment-id-or-url>
   ```

   The dashboard equivalent is **Redeploy** on the deployment marked _Current_ under
   Production. It triggers a **rebuild**, which is what picks up the changed value.

   **Do NOT use Instant Rollback** (`vercel rollback`). It re-promotes an **existing
   build**, and that build's environment snapshot — and its baked landing page — were
   made with the old value. It cannot apply an environment change, and it looks like it
   succeeded.

   **Do NOT redeploy an older deployment.** This workspace wires an `ignoreCommand`
   (`vercel.json` → `runtime-only-scripts/vercel-ignore-production-non-release-build.mjs`,
   ADR-163 §10) that **cancels** a production build on `main` when the current
   `package.json` version is **≤** the previous one. Rebuilding an older deployment
   trips exactly that arm and the build is cancelled — the change never ships, and the
   only trace is a cancelled build. Rebuilding the **current** production deployment is
   safe by construction: the guard has a dedicated arm for
   `VERCEL_GIT_COMMIT_SHA === VERCEL_GIT_PREVIOUS_SHA` that continues **without**
   comparing versions, precisely so a known-good release can be rebuilt.

   `CANONICAL_HOST` is a hash-bearing build input (`turbo.json`, after MCP-516), so a
   genuine rebuild re-bakes rather than replaying a cached artefact made with the old
   value. That defect has happened on production once; the cure is in place, and the
   reason to know it is that a **cached** bake is the third way "I redeployed" can be
   true and ineffective.

3. **Verify.** Verification checks 1 and 4 confirm the metadata now names `www` — but
   they are **unauthenticated and cannot see the MCP-517 failure class**, which is
   precisely the class a `CANONICAL_HOST` change moves. **Rollback is not verified until
   [check 6](#6-the-signed-in-cookie-cleared-flow--the-only-check-that-sees-mcp-517)
   passes on both hosts:** delete the `__session` cookie and its suffixed twin, sign in
   for real, make one authenticated call, on `mcp.` and on `www.`. A green
   checks-1-and-4 run with check 6 unrun is a false green.

**This is fast and it is usually the whole rollback.** Anything that read the metadata
in the interim has cached the new values, so expect a tail of clients still using the
new host — which is exactly why the next step is _not_ to remove the new host.

### Step 2 — STOP. Leave everything additive in place.

**Keep** the DNS record, the Vercel domain, and `ALLOWED_HOSTS`. All three are
additive: they let the new host keep working for clients that already moved, and none
of them changes what a `www` client sees. Leaving them costs nothing and removing them
breaks the tail.

**There is no Clerk step here, in either direction.** No Clerk change is recorded as
part of this cutover, so there is nothing to keep and nothing to remove. **Do not
remove origin entries from the Clerk instance on the strength of this document** — the
instance is shared with the main Oak website, this document's author could not read its
configuration, and removing an entry nobody here added is an unbounded change to
another service. If a Clerk change turns out to have been made, record it in
[What was actually done](#what-was-actually-done-in-order) **with where and by whom**
before anyone plans its removal.

### Step 3 — only if the host must genuinely be withdrawn

Do this **only** when client state is proven safe — no client is authenticating against
the new host, checked rather than assumed — and then in this order:

1. Revert Cloud-Config #556 (or destroy the record) and apply. DNS takes minutes to
   clear.
2. De-register the domain from the Vercel project.
3. Remove `ALLOWED_HOSTS` last. On the current additive code this returns the
   allow-list to its platform-derived default and cannot empty it.

**If you are rolling back to escape the pre-certificate plaintext window
specifically**, de-registering the domain from the Vercel project (2) is the fastest
complete stop, because it removes the edge's willingness to serve the Host at all.

**Withdrawing `www/mcp` is not on this list.** It is the owner-ruled end state, it is
carried by Cloud-Config #561, and it is not a rollback action.

---

## Reusing this for the next host move

The transferable parts, in the order they bit:

1. **A `401` is not protocol health.** Send a conformant request with the required
   `Accept` header, or you are testing the auth boundary and calling it the transport.
2. **A registered, verified domain has no certificate until DNS points at it.** Expect a
   window where the host resolves, serves cleartext, and fails TLS. Do not judge the
   cutover in it, and do not leave anything resident in it.
3. **`CANONICAL_HOST` is single-valued.** Moving it changes self-description for
   **every** host, including the one you are protecting. That is the whole risk of the
   switch, and it is what made a conforming `www`-pinned client unable to authorise.
4. **Verify additive steps by Host header at the edge**, before DNS exists — no waiting
   on propagation.
5. **Control-probe every absence.** "Not a 404" passes on a broken URL here; a uniform
   result across a target and a known-bad control means your instrument is broken, not
   that you measured something.
6. **Read the edge rule, do not remember it.** The scope was five path families in two
   byte-identical rules, while source comments in this repository described it as `/mcp`
   and `/mcp/*`. Both statements produce the same answer for assets and the wrong answer
   for OAuth metadata.
7. **"Redeploy" is not one operation.** Re-promoting an existing build cannot apply an
   environment change; rebuilding an **older** deployment can be cancelled by a
   version-advance guard; and a cached build step can replay a stale value unless it is
   hash-bearing. Name the exact operation in the procedure.
8. **Roll back self-description first and additive safety last** — or never.
9. **Every automated gate here is unauthenticated.** Any procedure whose risk is a
   signed-in defect needs a manual cookie-cleared sign-in as an explicit step, or it
   ships green over the failure it was written to catch.

---

_Originally written 2026-08-19 as a forward procedure; rewritten 2026-08-20 as a record
after the cutover, and revised 2026-08-21 to cure a second round of blocking review
findings from `mantagen`: the governing constraint was stale against the `www/mcp`
retirement ruling (the premise section is rewritten and the `www` checks reframed as
withdrawal measurements), the Clerk rollback was not reversible from the record (no
Clerk change is recorded; the instructions are removed and the bounded negative is
stated with its scope), "redeploy" was underspecified (the supported operation is now
named, with Instant Rollback and older-deployment rebuilds ruled out for measured
reasons), and verification check 4 could pass silently (host labels, an always-printing
form, a discriminating control, and the measured origin-rule scope). Agent-authored,
not typed by Matthew Gregory. Every "Measured" value is a measurement taken on the
stated date, not an expectation; re-run the probes rather than trusting them._
