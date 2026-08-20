# `mcp.thenational.academy` — cutover record, verification set, and rollback

**The switch happened on 2026-08-20.** This document was written the evening
before as a forward procedure; it is now the **record of what was actually done**,
the **verification set that proves the result**, and the **rollback**, which is the
only part still waiting to be used.

**Read this before touching the hosts.** If you are here because something looks
broken, go to [Rollback](#rollback) — and read its ordering warning first, because
the intuitive order strands clients.

## The constraint that governed the whole thing, and still does

**`www.thenational.academy/mcp` must keep working.** Two external commitments
depend on it and neither can be changed by us:

- the three carousel images are baked into Anthropic's published listing;
- every already-installed Claude Code plugin has
  `https://www.thenational.academy/mcp` hardcoded in its local config.

So this was **add a host, then move what it advertises** — never "move the app".
Both hosts serve today, and that is deliberate, not a leftover.

---

## What was actually done, in order

Each row is a measurement, not a plan. Where a fact came from another seat it says
so.

| #   | Change                                                     | Evidence                                                                                                                                                          |
| --- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Vercel domain registered on the project                    | `/v9/projects/<prj>/domains/<host>` → `200`, `verified: true`; control host → `404 not_found`                                                                     |
| 2   | `ALLOWED_HOSTS` made additive (PR #920)                    | merged `97daa15f3`, released **1.175.1**                                                                                                                          |
| 3   | `ALLOWED_HOSTS=mcp.thenational.academy` set for Production | the HTML leg stopped returning `403 host not allowed`                                                                                                             |
| 4   | DNS record created by **targeted `terraform apply`**       | owner-run from the unmerged PR branch; state serial **360** at `09:48:27Z`; `cloudflare_record.cname["mcp"]` in state (liaison's read, control: 60 cname entries) |
| 5   | `CANONICAL_HOST` switched to `mcp.thenational.academy`     | both hosts' PRM now names the new host (below)                                                                                                                    |
| 6   | `proxied = true` applied                                   | `server: cloudflare` + `CF-RAY` present, matching the `www` control                                                                                               |
| 7   | TLS certificate issued                                     | `https` → `200`; `http` → `301` (Vercel restores the redirect once a certificate exists)                                                                          |

**Cloud-Config #556 was still OPEN when this was written.** The record exists and
is Terraform-managed because the apply ran from the branch — with CLI-driven
execution the working directory _is_ the configuration, so an unmerged branch can
apply. **`main` is therefore behind state, and merging #556 as written reconciles
it.** Do not "true it to reality" — it already matches state byte for byte, same
value and same `proxied` flag. There is nothing to import and no already-exists
risk.

### One correction to step 4, recorded because the old version of this page was wrong

This page previously said the record was deliberately **grey-cloud (unproxied)**,
and that proxying was out of scope as a three-part change. **That was the plan on
19 August and it is not what shipped:** the host is proxied as of step 6, so
Cloudflare's WAF and rate limiting are in path. Treat the old grey-cloud reasoning
as history.

---

## Verification set

**Every check here is honest about what it proves.** The previous version of this
page repeated one probe — an empty `POST /mcp` with no `Accept` header — and read
its `401` as proof that "the protocol is answering". It is not: a `401` only proves
an auth boundary responded. A code review (`mantagen`, 2026-08-20) called that out
as a false-green generator, and it was right. The probes below separate
**transport health** from **the expected auth challenge**.

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

**Good — measured 2026-08-20 12:31Z, both hosts identical:**

```text
HTTP/2 401
www-authenticate: Bearer resource_metadata="https://mcp.thenational.academy/.well-known/oauth-protected-resource/mcp"
```

The `401` is correct **and now means something**, because the request was a
well-formed `initialize` with the required `Accept` header: the transport accepted
the request, negotiated, and the auth boundary answered with a conformant RFC 9728
challenge. **A `406` here means your `Accept` header is wrong, not that the server
is broken** — see the path note below.

### 2. TLS must actually complete — a status code is not enough

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://mcp.thenational.academy/mcp/healthz
curl -s -o /dev/null -w '%{http_code}\n' http://mcp.thenational.academy/mcp/healthz   # expect 301
```

**Good: `200` over HTTPS, and `301` on plain HTTP.**

**Why this check exists.** Between the DNS record appearing and the certificate
issuing, the host resolved, served **plaintext HTTP with no redirect**, and failed
the TLS handshake outright. In that window the full OAuth proxy — DCR and the token
endpoint — was reachable in cleartext. A status-code check over HTTP passes happily
in that state. **The redirect is the signal that the certificate landed**; Vercel
withholds it until then.

### 3. The host is proxied — check with a control

```bash
curl -s -D - -o /dev/null http://mcp.thenational.academy/mcp/healthz | grep -iE '^(server|cf-ray)'
curl -s -D - -o /dev/null http://www.thenational.academy/mcp/healthz | grep -iE '^(server|cf-ray)'  # control
```

**Good: `server: cloudflare` and a `CF-RAY` on both.** If the new host shows
`server: Vercel` with no `CF-RAY`, it is unproxied and Cloudflare's WAF and rate
limiting are **not** in path — which falsifies ADR-219's premise for that domain.

### 4. Discovery documents agree, on both hosts

```bash
for H in https://mcp.thenational.academy https://www.thenational.academy; do
  curl -s "$H/.well-known/oauth-protected-resource/mcp"; echo
  curl -s "$H/.well-known/oauth-authorization-server" | grep -o '"issuer":"[^"]*"'
done
```

**Good — measured, identical on both hosts:**

```text
{"resource":"https://mcp.thenational.academy/mcp","authorization_servers":["https://mcp.thenational.academy"],"scopes_supported":["email"]}
"issuer":"https://mcp.thenational.academy"
```

### 5. The external commitments still hold

```bash
for H in https://mcp.thenational.academy https://www.thenational.academy; do
  curl -s -o /dev/null -w "$H carousel:%{http_code}\n" "$H/mcp/carousel/carousel_image_1.png"
  curl -s -o /dev/null -w "$H healthz:%{http_code}\n"  "$H/mcp/healthz"
done
```

**Good: `200` on all four.** Measured.

### Path note — `/mcp/*` is a catch-all, so "not a 404" proves nothing

```text
GET /mcp/server-card             -> 406 {"error":"Accept header must include text/event-stream"}
GET /mcp/zzz-nonexistent-control -> 406  (identical — this is the control)
GET /mcp                         -> 406  (identical)
GET /mcp/healthz                 -> 200  (a real route, so the probe discriminates)
```

The Streamable HTTP transport answers the whole `/mcp/*` path space. **A
non-existent path under `/mcp/` returns `406`, not `404`**, so any check written as
"confirm it is not a 404" passes on a completely wrong URL. It also means the
MCP-recommended server-card location is currently occupied by the transport
handler — see MCP-422.

---

## What is NOT verified — the honest gap

**This is the part a reader should not skim.** Everything above is
unauthenticated, and **every automated gate in this estate runs unauthenticated**,
so a signed-in defect passes all of them.

1. **No already-installed, `www`-pinned client has completed an authenticated call
   since the cutover.** This is the open item, and it is the one that matters:
   `www` now serves a PRM whose `resource` is
   `https://mcp.thenational.academy/mcp`, so a client that dialled `www` is handed
   an identifier for a _different_ URL. _Inference, not measurement:_ per RFC 9728
   and RFC 8707 a client validating the resource identifier either refuses, or
   acquires a token audienced for the new host and presents it to `www` — which
   works only if the resource server does not check audience per host. **Nobody
   has run it.** The test is: take an existing plugin install still pointed at
   `https://www.thenational.academy/mcp`, sign in, make one authenticated tool
   call.
2. **Whether the resource server validates token audience per host** — untested,
   and it is what decides outcome (1).
3. **The signed-in browser flow.** The decisive instrument is deleting the
   `__session` cookie **and its suffixed twin** and completing a real sign-in
   against the new host. A synthetic `__client_uat=1` is **not** equivalent and has
   produced false confidence here before. The owner ran the cookie-deletion test on
   both hosts on cutover day and **the MCP-517 symptom did not reproduce** (owner's
   result, relayed by the liaison seat — not measured by this document's author).

---

## Rollback

**Read the ordering warning before you touch anything.**

### The ordering warning

The obvious rollback order — undo the last thing first, so `CANONICAL_HOST`, then
Clerk origins, then DNS, then `ALLOWED_HOSTS` — **is wrong in its tail**, and the
previous version of this page recommended it. Removing the new Clerk origin or
narrowing `ALLOWED_HOSTS` **because `CANONICAL_HOST` was reverted** can strand
sessions and clients that already observed the new metadata: they hold tokens and
cached discovery documents naming the new host, and you have just removed the
host's ability to serve them. The steps are **not** independent — they are coupled
through Clerk and through discovery caching.

**Roll back the self-description; leave the additive safety in place.**

### Step 1 — revert the self-description (this is the actual undo)

1. Vercel → Environment Variables → `CANONICAL_HOST` → `www.thenational.academy`
2. **Redeploy** — Vercel binds environment variables at build time, so an edit
   alone changes nothing.
3. Verify with verification checks 1 and 4 above: both hosts answer `401` to a
   conformant `initialize`, and the discovery documents name `www` again.

**This is fast and it is usually the whole rollback.** Anything that read the
metadata in the interim has cached the new values, so expect a tail of clients
still using the new host — which is exactly why the next step is _not_ to remove
the new host.

### Step 2 — STOP. Leave everything additive in place.

**Keep** the DNS record, the Vercel domain, the Clerk origin, and
`ALLOWED_HOSTS`. All four are additive: they let the new host keep working for
clients that already moved, and none of them changes what a `www` client sees.
Leaving them costs nothing and removing them breaks the tail.

### Step 3 — only if the host must genuinely be withdrawn

Do this **only** when client state is proven safe — no client is authenticating
against the new host, checked rather than assumed — and then in this order:

1. Remove the Clerk origin entries.
2. Revert Cloud-Config #556 (or destroy the record) and apply. DNS takes minutes
   to clear.
3. De-register the domain from the Vercel project.
4. Remove `ALLOWED_HOSTS` last. On the current additive code this returns the
   allow-list to its platform-derived default and cannot empty it.

**If you are rolling back to escape the pre-certificate plaintext window
specifically**, de-registering the domain from the Vercel project (3) is the
fastest complete stop, because it removes the edge's willingness to serve the Host
at all.

---

## Reusing this for the next host move

The transferable parts, in the order they bit:

1. **A `401` is not protocol health.** Send a conformant request with the required
   `Accept` header, or you are testing the auth boundary and calling it the
   transport.
2. **A registered, verified domain has no certificate until DNS points at it.**
   Expect a window where the host resolves, serves cleartext, and fails TLS. Do not
   judge the cutover in it, and do not leave anything resident in it.
3. **`CANONICAL_HOST` is single-valued.** Moving it changes self-description for
   **every** host, including the one you are protecting. That is the whole risk of
   the switch, and it is what created the untested `www`-pinned-client question
   above.
4. **Verify additive steps by Host header at the edge**, before DNS exists — no
   waiting on propagation.
5. **Control-probe every absence.** "Not a 404" passes on a broken URL here; a
   uniform result across a target and a known-bad control means your instrument is
   broken, not that you measured something.
6. **Roll back self-description first and additive safety last** — or never.

---

_Originally written 2026-08-19 as a forward procedure; rewritten 2026-08-20 as a
record after the cutover, by the Director seat of the `mcp-submission-drive`
(agent-authored, not typed by Matthew Gregory). Four blocking review findings from
`mantagen` are cured here: the non-conformant protocol probe (verification 1), the
procedure not performing the switch it promised (superseded by events — the
cutover is recorded rather than proposed), shallow cutover verification
(verifications 1–5 plus the explicit unverified list), and the rollback removing
additive safety before client state is proven safe (the ordering warning). Every
"Good" value is a measurement taken on 2026-08-20, not an expectation; re-run the
probes rather than trusting them._
