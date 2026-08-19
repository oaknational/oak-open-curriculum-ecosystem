# Runbook — switching the MCP app to `mcp.thenational.academy`

Written for **one person doing this once**, who has read no tickets. Every step
has a command, what a good result looks like, and how to undo it.

**Rule for the whole procedure: `www.thenational.academy/mcp` must keep working
at every step.** Not just at the end. Two external commitments depend on it and
neither can be changed:

- the three carousel images are baked into Anthropic's published listing;
- every already-installed Claude Code plugin has `https://www.thenational.academy/mcp`
  hardcoded in its local config.

So this is **add a host, then move what it advertises** — never "move the app".

## The one check you repeat after every step

```bash
curl -s -o /dev/null -w "www:%{http_code}\n" -X POST https://www.thenational.academy/mcp
curl -s -o /dev/null -w "carousel:%{http_code}\n" \
  https://www.thenational.academy/mcp/carousel/carousel_image_1.png
```

**Good: `www:401` and `carousel:200`.** The `401` is correct — it means the
protocol is answering and demanding auth. **Anything else: stop and roll back the
step you just did.**

---

## Preconditions — all four before you start

| #   | Thing                                | How to check                                                         | Owner                                |
| --- | ------------------------------------ | -------------------------------------------------------------------- | ------------------------------------ |
| 1   | Vercel domain registered             | Vercel → project → Domains → `mcp.thenational.academy` present       | ✅ done 19 Aug                       |
| 2   | PR #920 merged and deployed          | `gh pr view 920 --json state` → `MERGED`, then a deployment finished | needs review                         |
| 3   | Cloud-Config #556 merged and applied | `dig +short mcp.thenational.academy` returns a CNAME                 | **blocked on Terraform plan rights** |
| 4   | Clerk origins updated                | Clerk dashboard → the new host present                               | only needed for signed-in use        |

**Precondition 3 is the one that blocks everything.** Without it the hostname
does not resolve and there is nothing to switch to.

---

## Step 1 — make the app accept the new hostname

PR #920 makes `ALLOWED_HOSTS` _additive_. Until it is deployed, do **not** set the
variable: on the old code it _replaces_ the allow-list and would take production
down.

1. Merge #920 and wait for the deployment to finish.
2. Vercel → project → Settings → Environment Variables → add for **Production**:
   `ALLOWED_HOSTS = mcp.thenational.academy`
3. **Redeploy.** Vercel binds environment variables at build time, so an edit
   alone changes nothing.

**Verify without needing DNS** — send the Host header directly to Vercel's edge:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: mcp.thenational.academy" \
  http://64.239.123.1/
```

**Good: `404` or `401` — anything except `403`.** A `403` with
`host not allowed` means the app is still refusing the hostname: the deploy has
not picked up the variable.

**Rollback:** delete the `ALLOWED_HOSTS` variable and redeploy. The allow-list
returns to the platform-derived default.

## Step 2 — create the DNS record

Merge **Cloud-Config #556**. It adds one record:

```text
mcp.thenational.academy  CNAME  4a80221ded84b150.vercel-dns-013.com  proxied = false
```

It is deliberately **grey-cloud (unproxied)** — it goes straight to Vercel and
never touches Cloudflare's rules. That is why it needs no origin rule and cannot
disturb `www`.

**Verify:**

```bash
dig +short mcp.thenational.academy
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://mcp.thenational.academy/mcp
```

**Good: a CNAME answer, and `401` from the POST.**

**Rollback:** revert the merge in Cloud-Config and apply. DNS may take a few
minutes to clear.

## Step 3 — Clerk origins (only if you want signed-in use)

Add `https://mcp.thenational.academy` to the Clerk instance's allowed origins and
redirect URIs.

**Skip this and the host still serves the protocol** — unauthenticated probes,
health checks and metadata all work. Only the signed-in flow needs it.

**Verify properly.** Every automated gate in this estate runs unauthenticated, so
a signed-in defect passes everything. The only check that catches it: delete the
`__session` cookie **and its suffixed twin** in your browser, then complete a real
sign-in against the new host. A synthetic `__client_uat=1` is _not_ equivalent and
has produced false confidence here before.

**Rollback:** remove the origin entries.

## Step 4 — `CANONICAL_HOST`: this is the actual switch

Everything above **adds** a host. This step **moves what the app says about
itself**, and it is the only irreversible-feeling one.

`CANONICAL_HOST` is single-valued and drives self-description: the `issuer`, the
OAuth endpoints, and the protected-resource metadata. Change it and **every** host
— including `www` — starts advertising `mcp.thenational.academy`.

```text
Leave it   -> the new host works but describes itself as www.
              Correct for a blue/green trial. Clients still get pointed at www.
Change it  -> the new host is genuinely canonical.
              MCP-517 is a LIVE BUG in exactly this path: CANONICAL_HOST never
              reaches clerkMiddleware, and Clerk 422s can strand signed-in
              browsers.
```

**Recommendation: do not change it on switch day.** Do steps 1–3, confirm the new
host serves, and leave `CANONICAL_HOST` on `www` until MCP-517 is fixed. You get a
working second host with no self-description risk, and the genuinely risky change
happens on a day when someone is watching. There is currently **no external uptime
monitoring** on this app, so a failure here would be silent.

If you do change it:

1. Vercel → Environment Variables → `CANONICAL_HOST` → `mcp.thenational.academy`
2. Redeploy.
3. Verify the metadata moved **and** `www` still serves:

```bash
curl -s https://mcp.thenational.academy/.well-known/oauth-protected-resource/mcp
curl -s -o /dev/null -w "www:%{http_code}\n" -X POST https://www.thenational.academy/mcp
```

**Good: the metadata names the new host, and `www` still returns `401`.**

**Rollback:** set `CANONICAL_HOST` back to `www.thenational.academy` and redeploy.
Fast, but anything that read the metadata in between has cached the new values.

---

## What is NOT in scope, deliberately

- **Proxying the new host (orange cloud).** Needed before it takes canonical
  production traffic, but it is a _three-part_ change — the proxy flip, a
  header-transform exemption, and a cache-bypass scope extension, landed together.
  Grey-cloud today avoids all three.
- **Removing anything from `www`.** See the top of this page.
- **Telling Anthropic.** The owner has a direct line and will handle it.

## If something goes wrong and you are not sure which step caused it

Roll back in reverse order: `CANONICAL_HOST` first, then Clerk, then DNS, then
`ALLOWED_HOSTS`. Each step is independent, and the earlier ones are additive —
nothing before step 4 changes what existing clients see.

---

_Written 2026-08-19 by the Director seat of the `mcp-submission-drive`
(agent-authored). Preconditions verified first-hand on the evening of 19 August;
re-check them rather than trusting this table, since the blocked ones are
expected to change._
