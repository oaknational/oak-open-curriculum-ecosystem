# MCP edge and WAF security review — Cloudflare half

**Date**: 2026-08-21
**Author**: Seat S2 (Implementer, PDR-117), `mcp-submission-drive` thread, staffed by the
Director seat "Tulip mends Bark" (session `e6d535`)
**Scope**: Cloudflare edge and WAF design for Oak's MCP surface
**Status**: Review and recommendation. **Nothing in this document has been applied.**

---

## 0. What this is, and what it is not

The owner asked for a security review of Oak's MCP surface against two named sources:

- Cloudflare, *Securing your MCP server* —
  `https://developers.cloudflare.com/agents/model-context-protocol/guides/securing-mcp-server/`
- The MCP specification's security best practices —
  `https://modelcontextprotocol.io/docs/draft/tutorials/security/security_best_practices`

This document covers the **Cloudflare edge and WAF design half only**. A peer seat (S1) owns
the served-surface and application-code half: CSP, frame headers, origin-bypass probing of the
served surface, and in-app controls. Where a finding of mine touches that boundary I hand it
over by name rather than reviewing it.

**No configuration was changed.** No ruleset was edited, no `terraform plan` or `apply` was
run, no pull request was raised against `oaknational/Cloud-Config`. The rollout is the owner's:
his instruction is a log-only period of roughly two weeks with internal people testing and
reviewing before enforcement. This document is the design that period would exercise, plus the
measurements that justify it.

### Rulings taken as given

These are inside the owner's brief and are implemented in the design below rather than
re-argued:

- **WAF mode is `log` or `block`, never `challenge`.** A managed challenge is a browser
  interstitial; for a non-browser MCP client it is a failure with no error to report.
- **Log-only for around two weeks**, with internal testing and review before enforcement.
- **Lowest paranoia level, high anomaly threshold** (high threshold = less sensitive; see §6.1).
- **The MCP surface gets its own WAF rules**, separate from the main zone.
- **The MCP surface is proxied through Cloudflare** — "100%".

### Refs read, named

Every configuration claim below names the ref it came from, because a prior seat on this thread
reported host-scoped rules from an unmerged working tree as if they were the baseline.

| Source | Ref read | How |
| --- | --- | --- |
| `oaknational/Cloud-Config` Terraform | **`main`** (default branch, confirmed via API) | `gh api .../contents/...` |
| `Cloud-Config` PRs 557, 558, 561 | PR head + body as of 2026-08-21 | `gh pr view` |
| This repo's ADRs and code | **`origin/main`** at `1173c1adf` | worktree off `origin/main` |
| Live edge behaviour | production, 2026-08-21 | `curl` / `dig`, controls in §3 |

---

## 1. First deliverable — the verdict on `Cloud-Config#558`

### Verdict: **PARTIAL.** It does not fully discharge the log-or-block ruling.

`Cloud-Config#558` is **open, not merged** (`mergedAt: null`, measured 2026-08-21). It adds a
host-scoped `execute` rule for the OWASP Core Ruleset on `mcp.thenational.academy` with the
anomaly action set to `block` instead of `managed_challenge`, and narrows the zone-wide rule's
expression to exclude that host. Same ruleset, same paranoia level 1, same score threshold 40.

That is a correct and well-reasoned change. It is also **not sufficient**, for four distinct
reasons — three of which the PR itself names, and one of which it does not.

#### Gap 1 — It scopes one of at least two managed rulesets (the PR names this)

`firewall_managed_rules.tf` on `main` carries
`lifecycle { ignore_changes = [rules[0]] }`. The owner read `rules[0]` from the dashboard on
2026-08-20 and recorded it in the PR:

```text
rules[0] = Cloudflare Managed Ruleset
  Execution scope   : All incoming requests
  Ruleset action    : Default   (each rule applies its own default action)
  Ruleset status    : Default
```

So a **second managed ruleset acts on this host and is invisible to the repository.** It differs
from OWASP in the way that matters: OWASP accumulates an anomaly score and acts past a
threshold, whereas the Cloudflare Managed Ruleset is **signature-based — one rule match is
enough**. `#558` changes nothing about how that ruleset treats this host.

**My measurement in §3 makes this gap concrete rather than theoretical**, and points at this
ruleset as the more likely actor on the blocks I observed.

#### Gap 2 — It covers one host, and the surface is currently two hosts

`#558` scopes `mcp.thenational.academy`. But on `main` the `www` origin rule is still present
and still live: I measured a curriculum-shaped body returning **403 on
`www.thenational.academy/mcp`** as well (§3.4). `Cloud-Config#561` removes the `www` routing and
is **also open**. Until `#561` lands, the MCP surface has two front doors and `#558` hardens
one. After `#561` lands, `#558`'s scope is right — so this gap is sequencing, not design.

#### Gap 3 — It sets `block`, not `log`, and the owner asked for a log-only period first

The owner's ruling is "log or block, not challenge", and his rollout is **log-only for a
fortnight, then enforce**. `#558` goes straight to `block`. Merging it satisfies "not
challenge" and skips the measurement period.

This is the gap that matters most for sequencing, and it is worth being precise about *why*
skipping the log period is not merely procedural: without it, nobody has the false-positive rate
that decides whether enforcement is safe. `#558`'s own §"What we could NOT establish" says so
plainly — *"Whether the OWASP ruleset has ever actually challenged legitimate MCP traffic… we
have not read [Security Events]."*

**§3 of this document answers that question, and the answer is not the reassuring one.**

#### Gap 4 — It leaves the zone-wide custom rules untouched, and one of them already blocks

`#558` touches only `http_request_firewall_managed`. It does not touch
`http_request_firewall_custom`, which on `main` contains a zone-wide, host-unscoped rule:

```hcl
{
  description = "Block SQL requests"
  action      = "block"
  expression  = "(http.request.full_uri contains \".sql\")"
}
```

No `phases`, no `products`, no host scope — so it evaluates for **every host in the zone**,
including the MCP surface. I confirmed it fires (§3.1). Its exposure on MCP is narrow (the MCP
protocol carries parameters in the POST body, not the URI), but it is real for any `/mcp` GET
with a query string, and it is the instrument that let me prove the MCP host sits inside Oak's
own custom ruleset.

### What would fully discharge the ruling

1. `#561` merges and applies (single front door).
2. A **log-only** host-scoped override — not `block` — for **both** managed rulesets, for the
   fortnight. §7 gives the shape.
3. The fortnight's data is read against the exit criteria in §8.
4. Only then does the action move to `block`, i.e. `#558`'s end state, with any exclusions the
   data justifies.

**`#558` is the right destination reached one step too early, and covering one of two
rulesets.** My recommendation is not to close it but to re-target it to `log` and widen it to
both rulesets (§11, R1).

---

## 2. Established state — declared versus live

The declared and live states disagree, in a way that matters.

| Property | Declared on `Cloud-Config@main` | Live (measured 2026-08-21) | Agree? |
| --- | --- | --- | --- |
| `mcp.thenational.academy` proxied | `proxied = false`, with a comment arguing *for* grey cloud | **Proxied** — `server: cloudflare`, `cf-ray` present, anycast A records identical to `www` | **No** |
| OWASP scope | `expression = "true"` (whole zone) | Consistent with observation | Yes |
| OWASP anomaly action | `managed_challenge`, `score_threshold = 40` | Blocks I saw were **block**-shaped, not challenge-shaped (§3.3) | **Unresolved** |
| Cloudflare Managed Ruleset | Not in the repository (`ignore_changes`) | Active, "All incoming requests", action Default | N/A |
| Rate limiting on MCP paths | **None** — `rate_limits.tf` has exactly two rules, neither matching | No 429 observed; not load-tested (§10) | Yes (both empty) |
| `www` MCP origin route | Present and enabled | Live — `www.thenational.academy/mcp` still serves and still blocks (§3.4) | Yes |

**Why `proxied = false` still stands on `main`:** `Cloud-Config#557` is **open**. Its change was
applied out of band via a targeted apply (`-target='cloudflare_record.cname["mcp"]'`) on the
`cloudflare-misc` workspace, because an untargeted plan there proposes unrelated destructive
drift. So the live flip is real and the declaration is stale.

> **Correction to my brief.** I was told "`Cloud-Config#557` is APPLIED". That is true of the
> *live edge* and false of the *merge state* — the PR is open. The distinction matters because
> anyone reading `main` to learn the configuration will read `proxied = false` and be wrong, and
> because an untargeted apply on that workspace carries known destructive drift.

### Pre-existing Terraform drift — a hazard for anything applied here

`Cloud-Config#561`'s posted plan (run against the `cloudflare-rulesets` stack) shows
`cloudflare_ruleset.http_ratelimit` and `cloudflare_ruleset.http_request_firewall_custom` both
reporting **`Drift detected (update)`** on a pristine `origin/main` checkout, and the plan
proposes deleting a rate-limit rule (`"Downloads api"`, currently `enabled = false`) that exists
in Cloudflare but not in the repository.

**Consequence for my recommendation:** the rate-limiting rules I propose in §9 land in
`rate_limits.tf`, which is one of the drifted resources. Applying them will also apply that
drift. That must be an explicit decision, not a side effect. Reconciling the drift should be a
separate, prior change.

---

## 3. The headline finding — the false-positive problem is live, not prospective

The owner's constraint was: *"need to be mindful of false positives because it's basically all
large JSON-RPC and you can imagine lessons on computing like sql injections just getting
blocked."*

**It is not something to imagine. It is happening in production today, and it was happening on
`www/mcp` before the move.** This is a measurement.

### 3.1 The instrument, validated by a control that must fail

Before trusting any 403 I needed an instrument that distinguishes "Cloudflare blocked it" from
"the origin answered". The zone's own declared `"Block SQL requests"` rule provides one, because
its behaviour is predictable from the Terraform.

| Probe | Expected | Measured |
| --- | --- | --- |
| `GET mcp.thenational.academy/probe.sql` | 403 (rule must fire) | **403**, `server: cloudflare` |
| `GET www.thenational.academy/probe.sql` | 403 (rule must fire) | **403** |
| `GET mcp.thenational.academy/probe.txt` | not 403 (control) | **404** |
| `GET curriculum-mcp-alpha.oaknational.dev/probe.sql` | not 403 (no Oak WAF) | **404**, `server: Vercel` |

The control fails where it must and passes where it must. This does more than validate the
instrument: because the blocking rule is **Oak's own declared rule**, a 403 on it proves
`mcp.thenational.academy` sits inside **Oak's** `http_request_firewall_custom` ruleset — not
merely behind some Cloudflare.

**On the `cf-ray` trap.** A `cf-ray` alone proves only that Cloudflare fronts something. The
discriminator is the CNAME chain, and it separates the hosts cleanly:

```text
mcp.thenational.academy                 -> (no CNAME) A 104.18.6.160, 104.18.7.160
www.thenational.academy                 -> (no CNAME) A 104.18.7.160, 104.18.6.160   [same anycast]
clerk.thenational.academy               -> frontend-api.clerk.services.
                                           -> worker.clerkprod-cloudflare.net.        [LEAVES Oak's zone]
curriculum-mcp-alpha.oaknational.dev    -> 4a80221ded84b150.vercel-dns-013.com.
                                           -> A 64.239.109.1                          [Vercel, not Cloudflare]
```

`clerk.thenational.academy` would present Cloudflare headers and is **not** covered by Oak's
rules. That is the trap the brief warned of, and it bites in §9.3.

### 3.2 The experiment

Five JSON-RPC `tools/call` bodies, sent unauthenticated to `POST /mcp` at the edge and, as a
control, to the unproxied origin. Payload bodies were written to files and sent with
`--data-binary` so no shell interpretation could corrupt them. An unauthenticated request that
reaches the application returns **401** with a `WWW-Authenticate` challenge; a request stopped
at the edge returns **403** with Cloudflare's block page. The two are cleanly distinguishable.

| Body (`search` query argument) | Edge | Origin | Reading |
| --- | --- | --- | --- |
| `p5` Photosynthesis, Year 7 biology (benign control) | **401** | 401 | passes |
| `p2` XSS lesson: `<script>alert(document.cookie)</script>`, `<img src=x onerror=…>` | **401** | 401 | passes |
| `p1` SQL-injection lesson: `' OR 1=1 --`, `DROP TABLE`, `UNION ALL SELECT` | **403** | 401 | **BLOCKED** |
| `p3` Command-injection lesson: `; cat /etc/passwd`, `` `id` ``, `../../etc/shadow` | **403** | 401 | **BLOCKED** |
| `p4` Path traversal / LFI: `../../../../etc/passwd`, `php://filter/…` | **403** | 401 | **BLOCKED** |

**Every payload returns 401 at the origin.** The edge is the entire difference. The benign
control passes at the edge, so the instrument is not simply rejecting everything. `p1` returned
403 on two separate attempts with different ray IDs, so it is deterministic.

### 3.3 What blocked it — measured versus inferred

**Measured.** The 403 body is Cloudflare's block page — it carries
`data-translate="block_headline"`, *"Sorry, you have been blocked"*, and *"Attention Required"*.
The `cf-mitigated` response header is **absent**.

**Inferred (labelled as such).** A Cloudflare managed challenge sets `cf-mitigated: challenge`
and serves an interstitial ("Just a moment…"), not a block page. Its absence points away from
the OWASP rule's declared `managed_challenge` action and towards the **Cloudflare Managed
Ruleset** (`rules[0]`, action Default, signature-based, most rules defaulting to block) as the
actor. The graded ladder in §3.5 supports that reading, because the pattern is signature-shaped
rather than score-shaped.

**I cannot close this from outside.** Attributing a block to a specific rule requires Security
Events. **I hold ray IDs for blocked production requests** — for example
`a2e8f5916b246407-LHR` (`p1`), `a2e8f59a0888f2b2-LHR` (`p3`), `a2e8f59cfa585f1b-LHR` (`p4`),
`a2e8f9b81c7cc53e-LHR` (`r2`), `a2e8f9bc398a20c8-LHR` (`r5`). Anyone with dashboard access can
name the exact rule and ruleset for each in about a minute. **This is the single highest-value
owner ask in this document** (§12).

If the actor is the Cloudflare Managed Ruleset, then `#558` — which touches only OWASP — would
not have prevented any of the blocks I measured. That is Gap 1 made concrete.

### 3.4 It is not new, and it is not specific to the new host

| Probe | Result |
| --- | --- |
| `p1` to `www.thenational.academy/mcp` | **403** |
| `p5` to `www.thenational.academy/mcp` | 401 |

**This closes a question that both `#557` and `#558` explicitly recorded as unanswerable.** Both
said, in substance, "whether the ruleset ever actually acted on legitimate MCP traffic while the
app was served on `www/mcp` is unknown to us". It is now known: the same bodies are blocked on
`www` today, and the zone-wide `expression = "true"` scope means that has been true for the
whole `www/mcp` era. Proxying `mcp` did not create this exposure; it inherited it.

### 3.5 Precisely which content trips it — the graded ladder

This is where the finding gets useful, because the blocking is far narrower than "SQL content".

| Query argument | Result |
| --- | --- |
| `SQL basics: SELECT name FROM pupils` | 401 passes |
| `SQL basics: SELECT name FROM pupils WHERE year = 7` | 401 passes |
| `SQL injection: SELECT * FROM users WHERE 1=1 --` | 401 passes |
| `UNION ALL SELECT password FROM admin` | 401 passes |
| `SQL injection: ' OR 1=1 --` | **403 blocked** |

So it is **not** keyword matching. Complete `SELECT` statements pass. `UNION ALL SELECT
password FROM admin` passes. What trips it is the **canonical tautology-plus-comment exploit
form**, and separately the path-traversal and command-injection metacharacter clusters.

### 3.6 Does this touch Oak's real curriculum? Two honest answers

**Yes for user-authored queries.** Six realistic teacher or agent requests, same method:

| Realistic request | Edge | Origin |
| --- | --- | --- |
| "What are the key learning points of the SQL fundamentals lesson?" | 401 | — |
| "Why is `SELECT * FROM pupils WHERE name = 'x'` vulnerable to injection?" | 401 | — |
| "Explain the SQL injection example…: `' OR '1'='1`" | 401 | — |
| "Show the XSS payload `<script>alert('xss')</script>` for the input sanitisation lesson" | 401 | — |
| **"Make a Year 11 worksheet showing how `' OR 1=1 --` bypasses a login form"** | **403** | 401 |
| **"Explain path traversal using `../../etc/passwd` for the cyber threats unit"** | **403** | 401 |

Those last two are **entirely legitimate requests against Oak's own published KS4 computing
curriculum**, and they fail at the edge today. The origin answers 401 for both, so the edge is
the sole cause.

Oak really does teach this material. From the live MCP corpus: unit **"Databases and SQL"**
(KS4 computing, Year 11) with lessons `sql-fundamentals`, `sql-searches`,
`data-management-with-sql-statements`, whose lesson keywords are literally `SELECT`, `SELECT *`,
`INSERT`, `UPDATE`, `CREATE`; and unit **"Cyber threats and security"** including
`testing-as-a-form-of-defence`, whose transcript reads *"A SQL injection attack is a type of
cyber attack where a malicious user tricks a website or app into running harmful SQL…"* and
*"Penetration testers may run a simulated SQL injection attack…"*.

**No for stored content, on the sample I took — and I am reporting the negative because it
narrows the risk.** I pulled the full transcript of `testing-as-a-form-of-defence` (17,523
characters) and tested it for exploit metacharacters:

```text
contains "OR 1=1" : False      contains "--"     : False
contains "1=1"    : False      contains "SELECT" : False
contains "' OR"   : False      contains "UNION"  : False
contains "DROP"   : False      contains ";"      : False
```

The lesson describes SQL injection **in prose**, with no literal payload. The `sql-searches`
exit quiz contains `SELECT *`, `SELECT * FROM table`, `JOIN`, `DELETE` — all of which pass
(§3.5). So relaying Oak's stored curriculum content back through a request body would **not**
trip this, on the evidence I have.

**The refined risk statement, which is the one to design against:** the exposure is not that
Oak's stored content trips the WAF. It is that **user- and agent-authored request text trips
it** — a teacher asking for a worksheet that includes the canonical payload, an agent
constructing a security exercise, a pupil-facing example generator. That is narrower than the
owner's framing, more precisely locatable, and it lands exactly on the security-education
corner of the curriculum: the lessons *about* attacks.

**Why "narrower" is not "ignorable".** It fails precisely the requests most worth serving, it
fails them silently from the application's point of view (a Cloudflare rejection never reaches
the app, so Sentry cannot see it), and the failing user is a teacher who did nothing wrong.

---

## 4. ADR-219's premise is currently false for the MCP surface

This is a second, independent finding, and it is squarely in my lane.

**ADR-219 (Accepted 2026-07-30, supersedes ADR-158)** moved rate limiting out of the
application. MCP-411 removed the in-process limiter. The code carries the decision in comments —
`auth-routes.ts` and `oauth-proxy-routes.ts` both record that rate limiting *"is owned at the
edge (ADR-219)"* — and the CodeQL `js/missing-rate-limiting` findings on the public OAuth
registration endpoints are dismissed on that basis.

ADR-219 states its own falsifier:

> Edge configuration is load-bearing: if it is weakened or removed for a served domain, nothing
> in the application compensates, and **this decision's premise is falsified**.

And:

> This server no longer emits 429 of its own; a 429 reaching a client originates at the edge or
> upstream.

**Measured on `Cloud-Config@main`, `rate_limits.tf` contains exactly two rules:**

| Rule | Expression | Action |
| --- | --- | --- |
| Downloads API limit | `uri.path contains "api/downloads/"` or host `downloads-api…` | `managed_challenge`, 30/60s |
| Curriculum search API limit | `http.host contains "curriculum-search-api"` | `block` 403, 150/60s |

**Neither matches `mcp.thenational.academy`, `www.thenational.academy/mcp`, or any `/oauth/*`
path.** There is no rate limiting of any kind on the MCP surface at the edge.

So: the application's limiter was removed *because the edge owns the control*, and the edge does
not carry it. **ADR-219's premise is false for this surface, and the ADR itself names that
condition as its falsifier.** This is not me disagreeing with the ADR — the ADR pre-authorises
this conclusion and even names the remedy vocabulary: *"Where edge protection for a served
domain is thinner, the cure is edge configuration — a firewall rule or an origin lock — never an
in-process counter."*

Two incidental notes:

- The Downloads API rule uses `managed_challenge`. That is fine for a browser-driven download
  surface and is exactly the action the owner has ruled out for MCP. It is precedent in the
  zone, not a model to copy.
- The `js/missing-rate-limiting` dismissals on `/oauth/register` and `/oauth/token` are, as of
  today, dismissals whose stated warrant does not hold. Closing the §9 gap restores them.

---

## 5. The topology asymmetry — Cloudflare's guide assumes a deployment Oak does not have

Cloudflare's guide is **vendor documentation, not a specification**, and it is written for MCP
servers hosted **on Cloudflare Workers**. Oak's server runs on **Vercel behind Cloudflare**.
That difference cuts both ways, and the direction that matters is the one the guide is silent
about.

### 5.1 Oak has a reachable origin. A Workers-hosted server does not.

A Workers-hosted MCP server has no origin to address: the edge *is* the compute. Oak's does.
And it is reachable — this is measured, and it fell out of my control probes:

```text
POST https://curriculum-mcp-alpha.oaknational.dev/mcp   ->  401 + WWW-Authenticate
    server: Vercel        cf-ray: (absent)
```

That host serves the full MCP application, answers the protocol, and advertises
`resource_metadata="https://mcp.thenational.academy/.well-known/oauth-protected-resource/mcp"`.
It is not behind Cloudflare (`dig`: CNAME to `…vercel-dns-013.com`, Vercel A records; and my
`.sql` control returned 404 there rather than 403).

**Every edge control in this document — WAF, rate limits, managed rules — is bypassable by
addressing that host directly.** A ruleset on `mcp.thenational.academy` bounds traffic that
chooses to go through `mcp.thenational.academy`.

This is the structural point, and it is why the guide's silence is not reassurance: **a reader
who scores Oak against Cloudflare's guide can come away with a clean bill of health on a
control surface that has a documented way around it.** The guide does not mention origin locking
because its topology cannot have the problem.

**I am deliberately not resolving what to do about it.** Whether to proxy
`curriculum-mcp-alpha.oaknational.dev` is the coupled ADR-219 / MCP-349 owner decision the
Director is handling. I note only that the owner's "100% proxied" remark bears on it, and that
ADR-219 already names "an origin lock" as cure vocabulary. The mechanisms available — Cloudflare
Authenticated Origin Pull, a Vercel deployment-protection or trusted-IP configuration, or a
shared secret header enforced at the origin — are a design question for whoever takes that
decision. Served-surface analysis of that host is S1's boundary; the *edge-design consequence*
(that my controls are bypassable) is mine, and it is what I am reporting.

### 5.2 What transfers from the guide, and what does not

Having now read the guide in full (§6.0), the sort is sharper than I expected — and shorter,
because the guide's subject matter barely overlaps this document's.

| Guide topic | Transfers to Oak? | Whose lane |
| --- | --- | --- |
| Consent dialog before third-party OAuth (confused-deputy defence) | **Property yes, mechanism no** | S1 / Clerk lane |
| CSRF token on the consent form; `__Host-` cookies | **Property yes, mechanism no** | S1 / Clerk lane |
| Input sanitisation of client-supplied names, logos, URIs | **Yes** | S1 |
| CSP, `X-Frame-Options: DENY`, `nosniff` | **Yes** | **S1** — and note the `www` CSP exclusion in §13 |
| `state` in Workers KV with 10-minute expiry | **Property yes, mechanism no** — no KV on Vercel | S1 / Clerk lane |
| HMAC-signed approved-clients registry | **Property yes, mechanism no** | S1 / Clerk lane |
| `workers-oauth-provider` library | **No** | Not Oak's runtime |
| **WAF, rate limiting, bot management, challenges, DDoS** | **The guide says nothing about any of these** | This document, unaided |
| **Protecting a reachable origin** | **The guide cannot — Workers has no origin** | §5.1, and it is the gap |

The two bottom rows are the point. **Everything this review is actually about is absent from the
guide**, and the one exposure unique to Oak's topology is absent for a structural reason. So the
guide is a useful checklist for S1's half and contributes nothing to mine except by its silence.

---

## 6. Cloudflare's guide against the MCP specification

All vendor-documentation values in this section were read live from
`developers.cloudflare.com` in a dedicated citation-carrying pass; specification values from
`modelcontextprotocol.io`. Two flat contradictions between Cloudflare's own pages are flagged
where they arise.

### 6.0 The headline for this comparison: Cloudflare's guide contains no edge guidance at all

This is the most useful single fact in this section, and it is a negative.

Cloudflare's *Securing your MCP server* guide has these sections and no others: OAuth protection
with `workers-oauth-provider`; consent-dialog security; CSRF protection; input sanitization;
Content Security Policy; state handling; cookie security; the `__Host-` prefix; multiple OAuth
flows; approved-clients registry; security checklist.

Searched for in the page source, **absent entirely**: *WAF*, *firewall*, *rate limit*, *bot*,
*Turnstile*, *challenge*, *DDoS*, *SSE*, *streamable HTTP*, *transport*.

So:

- **The guide does not recommend managed challenge anywhere.** It does not discuss challenges at
  all. The owner's "never challenge" ruling therefore does not contradict Cloudflare's guidance —
  there is no guidance there to contradict. I had expected to report a divergence here; there
  isn't one, and saying so is more useful than manufacturing one.
- **The guide cannot be cited for or against any WAF, rate-limiting, or edge posture for MCP.**
  Anyone reasoning "Cloudflare's MCP security guide says X about the WAF" is reasoning about a
  document that does not exist.
- **What the guide actually is:** an application-layer OAuth-consent-hardening guide for
  Workers-hosted servers. Its content — CSRF tokens, consent dialogs, CSP, `__Host-` cookies,
  HMAC-signed approved-client registries, input sanitisation, KV-backed `state` with 10-minute
  expiry — is **almost entirely S1's and the Clerk lane's territory, not mine.** I am handing it
  over rather than reviewing it (§13).
- Its `workers-oauth-provider` and Workers KV mechanisms **do not transfer** to Oak's Vercel
  origin. The *properties* they implement do; the mechanisms do not.

**And it is silent on the one thing Oak's topology has and Workers does not: a reachable
origin.** That silence is §5.1, and it is why the guide cannot be read as a clean bill of health.

### 6.1 On "lowest paranoia, high anomaly threshold" — a label trap that will bite

The owner's intent is right. **Cloudflare's dashboard labels invert it, and a literal reading of
his words in the dashboard would select the opposite of what he wants.** This needs flagging
loudly because it is the single easiest way to implement this design backwards.

There are exactly **three** score thresholds — there is no "Very High":

| Cloudflare's label | Numeric threshold | Effect |
| --- | --- | --- |
| **Low** | 60 and higher | **Fewest** requests actioned — fewest false positives |
| **Medium** | 40 and higher (**default**, and what `main` sets) | Baseline |
| **High** | 25 and higher | **Most** requests actioned — most false positives |

From Cloudflare's concepts page, verbatim: *"Configuring a **Low** threshold means that more
rules will have to match the current request for the WAF to apply the configured ruleset
action."*

So **the number and the label run in opposite directions.** "High anomaly threshold" in the
owner's sense — less sensitive, fewer false positives — means **the number 60, which Cloudflare
labels "Low"**. Selecting the option labelled "High" would set 25 and make the false-positive
problem in §3 considerably worse.

**Implementation instruction: specify the number, never the label.** `score_threshold = 60`.

**Paranoia level** is separate and behaves intuitively: PL1–PL4, cumulative, PL4 strictest and
noisiest. `main` correctly runs PL1 only and explicitly disables the `paranoia-level-2/3/4`
tags. Keep that.

**One more thing Cloudflare says about this ruleset, which bears directly on §3.** From
Cloudflare's own OWASP overview page:

> "The Cloudflare OWASP Core Ruleset is prone to false positives and offers only marginal
> benefits when added on top of Cloudflare Managed Ruleset and WAF attack score."

**The vendor's own assessment is that this ruleset is the false-positive-prone one and adds
little.** That is a serious input to a decision nobody has yet framed: whether OWASP Core should
run on the MCP scope *at all*, as against relying on the Cloudflare Managed Ruleset plus WAF
attack score. §11 R6a raises it; I am not deciding it, because the answer depends on the
attribution in R2 — if the Managed Ruleset turns out to be doing the blocking, dropping OWASP
buys nothing.

### 6.2 On the MCP specification — revisions named, and one correction to my own framing

Per the Director's instruction, every specification-derived point carries its revision, whether
Oak implements it, and whether the source is stable or draft.

- **Oak's server implements revision `2025-11-25`.**
- **The current published revision is `2026-07-28`.**
- The URL in the owner's brief is a **draft** path
  (`/docs/draft/tutorials/security/security_best_practices`). It resolves; it is not a 404.
- **The implemented-versus-current gap is already tracked as MCP-644.** Where a requirement
  exists only in a revision Oak does not implement, that is an MCP-644 item, **not** a fresh
  defect.

The specification's security guidance is overwhelmingly **authorisation semantics**: token
audience binding and the flat prohibition on token passthrough (*"MCP servers MUST NOT accept
any tokens that were not explicitly issued for the MCP server"*), the confused-deputy problem
arising from static client IDs plus dynamic client registration, exact-string redirect-URI
matching, `state` handling that must not be established before consent, and SSRF defences on
metadata fetching. **Essentially all of it is application-layer and belongs to S1 and the Clerk
lane.** The edge cannot validate a token audience.

**Correction to my own earlier framing, stated plainly because it was an inference welded onto
a true observation.** I had written that Cloudflare's guide and the specification "agree that
dynamic client registration needs volumetric control". **That is false in both halves:**

- **The MCP specification does not require rate limiting.** Rate limiting appears in exactly one
  place — under *Security Control Circumvention*, as an example of a control that **token
  passthrough bypasses**: *"The MCP Server or downstream APIs might implement important security
  controls like rate limiting … If clients can obtain and use tokens directly with the downstream
  APIs without the MCP server validating them properly … they bypass these controls."* There is
  no DoS section and no volumetric requirement. **The specification must not be cited as
  mandating rate limiting.**
- **Cloudflare's guide does not mention rate limiting at all** (§6.0).

So §9's warrant rests on **ADR-219 and the concrete abuse case** — an unauthenticated endpoint
that writes durable state into a third-party system — and **not** on either named source. That is
a weaker citation base than I first wrote and a perfectly sufficient one; ADR-219 is Oak's own
accepted decision and it is explicit.

**On dynamic client registration, what the specification actually says** (draft; and materially
present in `2025-11-25`): DCR is *not* condemned. It is named as one of four enabling conditions
for confused deputy, and the prescribed fix is **per-client consent before the third-party flow,
plus exact redirect-URI matching** — not disabling DCR, and not rate limiting it. S1's and the
Clerk lane's item.

**A genuine draft-versus-implemented difference, reported as such:** the draft **replaces** the
`2025-11-25` *Session Hijacking* section with *State Handle Hijacking*, on the stated basis that
*"MCP is stateless and has no protocol-level sessions"*. Oak implements `2025-11-25`, whose
guidance is the session-ID form (*MUST* verify all inbound requests; *MUST NOT* use sessions for
authentication; *MUST* use secure non-deterministic session IDs; *SHOULD* bind them as
`<user_id>:<session_id>`). **This is a watch item on a draft that may still change, routed to
MCP-644, and it is application-layer — not an edge finding.** I raise it only so nobody reads
the draft page and reports a defect against the revision Oak actually implements.

### 6.3 Where the edge genuinely does not fit an MCP server

Since the guide is silent on the edge, this section is my own analysis rather than a comparison.

- **Challenge-based mitigation is unusable.** A challenge is a silent hang for a non-browser
  client — worse than a refusal, because there is nothing to report. The owner's ruling is
  correct and this is the whole reason.
- **Body inspection is the entire game, and generic WAF tuning is URL-shaped.** MCP carries
  everything in a JSON-RPC POST body. §3 is the demonstration.
- **The body-inspection limit is real, and its behaviour is the opposite of intuition.**
  Cloudflare inspects at most **128 KB** of a request body on **Enterprise** (Free is 1 MB —
  Cloudflare raised all plans to 1 MB and then **rolled Enterprise back to 128 KB precisely
  because it increased managed-ruleset false positives**; the 2025-12-05 changelog says so). The
  origin still receives the whole body; only matching is bounded. Consequences for MCP:
  - **The false-positive rate is not uniform in body size.** More inspected content means more
    rules can match and a higher cumulative anomaly score — Cloudflare states this explicitly.
    So a large body is *more* likely to trip the threshold, up to 128 KB, and content past
    128 KB is not inspected at all.
  - **A small-body test does not predict large-body behaviour**, in either direction. §3's
    payloads were ~266 bytes. §8.3 therefore requires large-body cases.
  - `http.request.body.truncated` (Enterprise) is available as a rule field, so "was this body
    only partially inspected?" is answerable and can be branched on.
  - **There is no documented switch to disable body inspection** for specific traffic. The
    available levers are a WAF **exception** scoped by expression (host + path), or Support
    raising the limit. So "limit request-body inspection on `/mcp`" — which my brief asked me to
    consider — **is not a thing Cloudflare exposes**. The nearest true equivalent is a scoped
    exception skipping specific body-matching rules, which is what §7 proposes.
- **Caching advice does not apply**, and is already handled: `config_settings.tf` bypasses cache
  for the MCP path scope, and long-lived SSE must never be cached.
- **"Just enable the managed ruleset" is the failure mode.** For an origin serving curriculum
  content *about* attacks, the default configuration blocks legitimate traffic. §3 measured it.

---

## 7. Proposed ruleset shape

**Not implemented. Illustrative HCL in the idiom of the existing files, for someone else to
apply.** It assumes `Cloud-Config#561` has landed, so `mcp.thenational.academy` is the single
front door.

### 7.1 Design principles

1. **The MCP scope gets its own rules** (owner's ruling). Achieved by narrowing the zone-wide
   rule's expression to exclude the MCP host and adding host-scoped rules — the pattern `#558`
   already establishes, and the pattern the `#551` reviewers asked for in preference to a skip
   rule.
2. **`log` for the fortnight, then `block`.** One field changes at the end. Never `challenge`.
3. **Both managed rulesets are scoped, not just OWASP.** Gap 1.
4. **Detection is never weakened to buy quiet.** Paranoia stays at level 1; the threshold rises;
   exclusions are named rules justified by measured false positives — not a blanket skip.
5. **Nothing is excluded before it is measured.** No exclusion lands in the first pass. §8
   earns them.

### 7.2 Stage 1 — log-only, for the fortnight

```hcl
locals {
  # Single front door after Cloud-Config#561. Keep this list in one place: the
  # scope is referenced by the managed-rules override AND the rate-limit rules.
  mcp_host = "mcp.thenational.academy"
}

resource "cloudflare_ruleset" "http_request_firewall_managed" {
  zone_id = data.cloudflare_zone.thenational.id
  name    = "default"
  kind    = "zone"
  phase   = "http_request_firewall_managed"

  # rules[0] is the Cloudflare Managed Ruleset, managed outside Terraform.
  # See the ignore_changes block below and the note in 7.3.
  rules {
    action     = "execute"
    enabled    = true
    expression = ""
  }

  # ---- OWASP Core, every host EXCEPT the MCP host (unchanged behaviour) ----
  rules {
    action = "execute"
    action_parameters {
      id = data.cloudflare_rulesets.owasp_core.rulesets[0].id
      overrides {
        categories { category = "paranoia-level-2"
          enabled            = false }
        categories { category = "paranoia-level-3"
          enabled            = false }
        categories { category = "paranoia-level-4"
          enabled            = false }
        rules {
          id              = local.owasp_score_exceeded_rule[0].id
          action          = "managed_challenge"
          score_threshold = 40
        }
      }
    }
    description = "Execute OWASP Core Ruleset (all hosts except the MCP surface)"
    expression  = "not (http.host eq \"${local.mcp_host}\")"
    enabled     = true
  }

  # ---- OWASP Core, MCP host only: LOG ONLY, raised threshold ----
  rules {
    action = "execute"
    action_parameters {
      id = data.cloudflare_rulesets.owasp_core.rulesets[0].id
      overrides {
        # Lowest paranoia (owner's ruling): level 1 only, as elsewhere.
        categories { category = "paranoia-level-2"
          enabled            = false }
        categories { category = "paranoia-level-3"
          enabled            = false }
        categories { category = "paranoia-level-4"
          enabled            = false }
        rules {
          id = local.owasp_score_exceeded_rule[0].id
          # LOG for the observation period. Becomes "block" at Stage 2 --
          # NEVER managed_challenge: a non-browser MCP client cannot solve a
          # challenge, so it presents as a hang with no error to report.
          # "log" is a documented valid action for rule 949110 and is
          # ENTERPRISE-ONLY; this zone is Enterprise (custom nameservers,
          # Logpush).
          action = "log"
          # 60 is the MAXIMUM (least sensitive) of the three documented
          # thresholds -- 60 / 40 (default) / 25. Cloudflare LABELS 60 as
          # "Low"; the label refers to sensitivity, not to the number.
          # The owner's "high anomaly threshold" means THIS value. Do not
          # pick the dashboard option labelled "High": that is 25, the most
          # sensitive setting, and it would make the false-positive problem
          # measured in section 3 substantially worse.
          score_threshold = 60
        }
      }
    }
    description = "MCP surface: OWASP Core, log-only observation period (MCP-622)"
    expression  = "(http.host eq \"${local.mcp_host}\")"
    enabled     = true
  }

  lifecycle {
    ignore_changes = [rules[0]]
  }
}
```

### 7.3 The Cloudflare Managed Ruleset — the part that cannot be written blind

**This is the gap that matters and I am not going to paper over it with plausible HCL.**

`rules[0]` is the Cloudflare Managed Ruleset, managed outside Terraform and invisible to the
repository. My §3 measurement points at it as the likely actor on the blocks I observed. It
therefore needs the *same* host-scoped log-only treatment as OWASP — and I cannot write that
override correctly without knowing its ruleset ID and which of its rules fire on this traffic.

**The correct sequence is:**

1. Someone with dashboard access resolves the ray IDs in §3.3 to rule IDs and ruleset IDs.
2. `rules[0]` is brought under Terraform, or a host-scoped override for it is authored from
   those IDs, in the same shape as the OWASP block above.
3. Only then is the log-only period meaningful, because otherwise the fortnight measures one of
   two rulesets and enforcement is switched on with the other one unobserved.

**A log-only period that observes only OWASP would produce a false all-clear**, because the
ruleset I suspect of doing the blocking would be neither logged nor scoped. Stating that plainly
is the most useful thing this section can do.

### 7.4 Stage 2 — enforcement, after the exit criteria in §8 are met

One field: `action = "log"` becomes `action = "block"` on the MCP rule, for both rulesets. Plus
any exclusions §8 justified. `score_threshold` holds at whatever the data supports.

**On exclusions, now that the mechanism is confirmed.** Cloudflare's WAF **exceptions** are the
right instrument, and they support exactly what this design needs: an expression-scoped skip
(host plus URI path) at three granularities — skip all remaining managed rules, skip named
rulesets, or **skip named rules within a ruleset**. The third is the one to use: a measured false
positive is cured by excluding *that rule* for *that scope*, never by skipping the ruleset.

Two constraints on exceptions that matter here:

- **Zone-level exceptions skip only zone-level rules.** Account-level rulesets execute first in
  a phase and a zone exception cannot suppress them. If any of Oak's managed rules turn out to be
  account-scoped, the exception must be authored at the account level. The attribution in R2
  reveals which.
- **Exceptions apply only to WAF managed rulesets.** The zone-wide custom rules in §7.5 are not
  reachable by an exception; they need host-scoping or a `skip` custom rule instead.

**On the block response.** A `block` action supports a custom response: status code in the
400–499 range (default 429 for rate-limiting rules, 403 for WAF blocks) and a body up to
**30 KB**. So enforcement can return a small JSON body a JSON-RPC client can actually surface,
rather than Cloudflare's HTML interstitial — which is what a client received in every §3 block
and is useless to it. **Do this.** An MCP client that receives HTML where JSON was expected
reports a parse failure, not a refusal.

### 7.5 Also recommended — remove the MCP surface from the accidental blanket rules

Independently of the managed rulesets, the zone-wide `"Block SQL requests"` custom rule
(`http.request.full_uri contains ".sql"`, no host scope, action `block`) applies to the MCP
surface for no articulated reason. It should be host-scoped to the surfaces it was written for,
or the MCP host excluded from it. Same for `"JavaScript Client Side Prototype Pollution Block"`.
These are cheap, well-understood, and reduce the surface the fortnight has to reason about.

---

## 8. How the log-only fortnight becomes evidence

The owner's instruction is a log-only period with internal people testing and reviewing. The
risk is that two weeks *pass* without anything being *measured*, and enforcement gets switched
on because the calendar said so. This section is the answer to "how would someone know, at the
end of two weeks, whether it is safe to enforce".

### 8.1 The instrument, and its three defects

Oak already pushes request logs to Datadog. From `misc/logpush.tf` on `main` (note: the job is
defined in the **zone module**, so it is zone-wide rather than MCP-scoped), the job is
`dataset = "http_requests"` with `sample_rate = 0.3`, and its field list includes `WAFAction`,
`WAFRuleID`, `WAFRuleMessage`, `FirewallMatchesActions`, `FirewallMatchesRuleIDs`,
`FirewallMatchesSources`, `ClientRequestHost`, `ClientRequestURI`, `EdgeResponseStatus`, `RayID`,
`ClientRequestUserAgent`.

**Defect 1 — it samples at 30%.** Roughly two of every three requests never reach Datadog. On a
low-volume pre-launch surface this is close to fatal for false-positive counting: a handful of
genuine false positives in a fortnight can sample to zero, and "we saw none" would then be an
artefact of the sampler rather than a finding. `sample_rate` is a general `output_options` field
with no documented dataset restriction, so it can be set to `1.0`.

**Defect 2 — the field names look like the legacy set, and legacy fields may arrive empty.**
This is the defect I would check first, because it would silently defeat everything else.
Cloudflare's current `http_requests` field reference names the security-decision fields
`SecurityAction`, `SecurityRuleID`, `SecurityRuleDescription`, and the arrays `SecurityActions`,
`SecurityRuleIDs`, `SecuritySources` — plus the scores `WAFAttackScore`, `WAFSQLiAttackScore`,
`WAFXSSAttackScore`, `WAFRCEAttackScore`. The names in Oak's job — `WAFAction`, `WAFRuleID`,
`WAFRuleMessage`, `FirewallMatches*` — **do not appear in that current reference.**

**[verify — this is a concrete, cheap check and it is the highest-priority one in this section:
query Datadog for any recent record where `WAFAction` or `FirewallMatchesActions` is non-empty.
If they are always empty, Oak's WAF logging has been blind for as long as the job has run, and
no amount of un-sampling fixes it.]** I am flagging rather than asserting: field names can be
maintained as aliases, and I could not read Datadog from here.

**Defect 3 — `http_requests` is the wrong dataset for rule attribution.** It flattens security
decisions to one record per request. Cloudflare's **`firewall_events`** dataset emits **one
record per matching rule** and carries what attribution needs and `http_requests` lacks:
`RuleID`, `Ref`, `Source`, `Description`, `MatchIndex` (position in the match chain), `Metadata`,
and `OriginatorRayID`. Conversely `firewall_events` does **not** carry the WAF attack scores that
`http_requests` does. **For this exercise you want both**, and `firewall_events` is the one that
answers "which rule, in what order".

**All three are fixable and must be fixed before the clock starts.** Concretely: a
`firewall_events` Logpush job, unsampled, alongside the existing `http_requests` job — with the
field-name question in Defect 2 resolved either way. Logpush is Enterprise-only, and this zone is
Enterprise.

**On the dashboard and the GraphQL API.** Security Events retains **30 days on Enterprise** (24 h
Free/Pro, 3 days Business), and Security Analytics 90 days. Two properties matter:

- **Security Events is sampled**: *"Security Events may use sampled data to improve
  performance"*, and *"if your search uses sampled data, Security Events might not display all
  events"*. Narrowing the time range reduces sampling. So it is the right tool for **attributing
  a specific ray ID** (§3.3) and the wrong tool for **counting** over a fortnight.
- **The GraphQL Analytics API is the better instrument** for the counting in §8.2 if Logpush is
  not fixed in time: the dataset behind Security Events is **`firewallEventsAdaptive`**, and
  unlike the dashboard it does not suffer the pagination inconsistencies Cloudflare documents.
  It is still subject to sampling, so Logpush remains the primary.

**Timing note:** my §3 ray IDs were captured 2026-08-21 and Enterprise retention is 30 days, so
attribution (R2) is available until roughly 2026-09-20. After that the payloads in §3.6 have to
be re-run to re-capture.

### 8.2 What to count

For every request where `http.host` is the MCP host and any WAF field is populated:

| Quantity | Why it matters |
| --- | --- |
| Total MCP requests (denominator) | A rate needs one. Without it, counts are meaningless |
| Requests with a non-empty `WAFAction` / `FirewallMatchesActions` | Would-be mitigations |
| Split by ruleset — OWASP versus Cloudflare Managed | Decides whether §7.3 was done properly |
| Split by rule ID, ranked by volume | The exclusion candidates. Expect a short head |
| Split by request path (`/mcp`, `/oauge/*`, `.well-known`) | Different scopes may need different actions |
| Split by authenticated versus unauthenticated | An authenticated user tripping a rule is a near-certain false positive |
| For each top rule ID: a sample of `ClientRequestURI` and, where lawful and available, body context | You cannot adjudicate a rule you cannot see firing |

### 8.3 Deliberate testing, not just passive waiting

Passive observation of a low-volume pre-launch surface will under-sample the interesting cases,
because the traffic that trips these rules is exactly the traffic nobody is generating yet.
Internal testers should be given a **named list of requests to make**, at minimum:

- The security-education corner of the curriculum: the "Databases and SQL" unit and the "Cyber
  threats and security" unit, asked about in the ways a teacher actually would — including
  requests to *produce* material containing canonical exploit examples. The five that already
  reproduce are in §3.6; **`r2` and `r5` are the regression cases**.
- Large bodies, to probe the inspection limit: a `tools/call` with a very large argument, and a
  long multi-turn session.
- Long-lived SSE streams held open for an extended period — `#557` flagged sustained streaming
  through the proxy as observed-once-only.
- The full OAuth dance including dynamic client registration, from a real MCP client.
- At least one request per MCP tool, so no tool's parameter shape is unobserved.

**Record each as a named case with its ray ID.** A ray ID makes any finding attributable later;
a screenshot does not.

### 8.4 Exit criteria — the actual answer to "is it safe to enforce?"

Enforcement is safe when **all** of these hold. Any one failing means the period extends or the
configuration changes, not that the calendar wins.

1. **Both managed rulesets are in scope and logging** for the MCP host (§7.3). If only OWASP
   was scoped, the period has not started.
2. **The logging instrument is unsampled** for the MCP surface, and a control query returns a
   known-present request — proving the pipeline works. A zero from an unvalidated query is not
   evidence.
3. **Denominator is non-trivial**: enough real MCP traffic and enough of §8.3's deliberate cases
   that a zero is informative rather than merely empty.
4. **Every rule that fired has a disposition**: either "true positive, keep blocking", or "false
   positive, exclude this rule for this scope", written down with the evidence.
5. **The `r2` / `r5` regression cases either no longer fire, or fire and are explicitly
   accepted** by a named person as traffic Oak is willing to refuse. They currently fire. This
   is the criterion I expect to be the binding one.
6. **The residual expected false-positive rate is stated as a number with its confidence**, not
   as "we saw nothing".
7. **A rollback is written down and has been rehearsed** — one field, `block` back to `log`, and
   whoever is on call knows it.
8. **Someone owns the alert.** Today there is no Cloudflare notification configured for security
   events on this zone (recorded in `#558`), and a Cloudflare rejection never reaches the
   application, so Sentry structurally cannot see it. Enforcing without an alert means the first
   report of a false positive comes from a teacher.

**The falsifier for this whole plan:** if at the end of the period the logs show mitigations on
the MCP host that nobody can attribute to a rule ID, the instrument failed and the period must
be re-run — not concluded optimistically.

---

## 9. Rate limiting

Recall §4: there is **none** on this surface today, and ADR-219 assumes there is.

### 9.1 `/oauth/register` and `/oauth/token` — the owner's specific ask

**What the endpoints actually are** (measured 2026-08-21). From
`https://mcp.thenational.academy/.well-known/oauth-authorization-server`:

```text
issuer                            https://mcp.thenational.academy
authorization_endpoint            https://mcp.thenational.academy/oauth/authorize
token_endpoint                    https://mcp.thenational.academy/oauth/token
registration_endpoint             https://mcp.thenational.academy/oauth/register
revocation_endpoint               https://clerk.thenational.academy/oauth/token/revoke
grant_types_supported             ["authorization_code", "refresh_token"]
code_challenge_methods_supported  ["S256"]
```

Behaviour:

| Probe | Result |
| --- | --- |
| `GET /oauth/register` | 404 (POST-only) |
| `POST /oauth/register` `{}` | 400 `invalid_redirect_uri` |
| `POST /oauth/token` `grant_type=authorization_code` | 400 `invalid_request` — "Client credentials missing" |

**Why a limit is genuinely needed here, not just tidy.** The 400 from `/oauth/register` is a Go
struct-validation error (`Key: 'CreateParams.redirect_uris' …`), i.e. the endpoint proxies to
Clerk. So an unauthenticated `POST /oauth/register` **creates a persistent OAuth client record
in Oak's Clerk instance**. That is the concrete abuse case: unauthenticated, unthrottled, and it
writes durable state into a third-party system with its own quotas.

**The warrant is ADR-219 plus that abuse case — not the two named sources.** As §6.2 records,
neither the MCP specification nor Cloudflare's guide requires rate limiting; the specification
mentions it only as a control that token passthrough bypasses, and the guide does not mention it
at all. ADR-219 is sufficient on its own: it is Oak's own accepted decision, it removed the
application's limiter *because the edge owns the control*, and §4 shows the edge does not carry
it.

**What legitimate traffic looks like, so the threshold is not guesswork.** This is the part
worth reasoning about rather than picking a round number:

- **`/oauth/register` is once-per-client-install, not once-per-session.** A conformant MCP
  client registers once and persists its `client_id`. So per-IP legitimate volume is
  *very* low — order one registration per new client installation.
- **The exception that sets the floor is shared egress.** A school, a corporate NAT, or a
  cloud-hosted agent platform presents many users behind one IP. If a hosted MCP client
  onboards several Oak users in a short window, they share an IP. Cloudflare's rate-limiting
  characteristics also count **per point of presence** when `cf.colo.id` is included, which
  further divides the count — the two existing rules in `rate_limits.tf` both do this.
- **`/oauth/token` is higher-volume by design**, because refresh-token exchanges recur for the
  life of a session. Its legitimate ceiling is meaningfully above `/oauth/register`'s and it
  should not share a counter with it.
- **Retries on failure inflate both**, and a broken client can retry hard.

**Proposed shape.** Two rules, not one, because the two endpoints have different legitimate
profiles. Both `block` with a JSON body — never `challenge`.

```hcl
# --- Dynamic client registration: unauthenticated, writes durable Clerk state ---
rules {
  action = "log" # -> "block" after the observation period
  action_parameters {
    response {
      status_code  = 429
      content      = "{\"error\":\"rate_limited\",\"error_description\":\"Too many registration requests.\"}"
      content_type = "application/json"
    }
  }
  ratelimit {
    characteristics     = ["cf.colo.id", "ip.src"]
    period              = 60
    requests_per_period = 10
    mitigation_timeout  = 600
  }
  expression  = "(http.host eq \"mcp.thenational.academy\" and http.request.uri.path eq \"/oauth/register\")"
  description = "MCP DCR limit (MCP-622)"
  enabled     = true
}

# --- Token endpoint: refresh traffic recurs, so a higher ceiling ---
rules {
  action = "log" # -> "block" after the observation period
  action_parameters {
    response {
      status_code  = 429
      content      = "{\"error\":\"rate_limited\",\"error_description\":\"Too many token requests.\"}"
      content_type = "application/json"
    }
  }
  ratelimit {
    characteristics     = ["cf.colo.id", "ip.src"]
    period              = 60
    requests_per_period = 60
    mitigation_timeout  = 60
  }
  expression  = "(http.host eq \"mcp.thenational.academy\" and http.request.uri.path eq \"/oauth/token\")"
  description = "MCP token endpoint limit (MCP-622)"
  enabled     = true
}
```

**On the numbers.** 10/min for registration and 60/min for token are **starting points chosen to
sit far above measured legitimate use and far below abuse**, not derived constants. They are
deliberately generous, because the asymmetry of harm is stark: a limit that is too high still
stops the abuse case that matters (sustained automated registration), whereas a limit that is
too low breaks a school. **The log-only period is what turns them into evidence-based numbers**
— §8's counting should include the observed peak per-IP-per-colo rate on each endpoint, and the
thresholds should be set a healthy multiple above that observed peak. The falsifier is explicit:
if the fortnight shows any legitimate client approaching either number, the number is wrong.

**Returning 429 rather than 403** matters for a protocol client: 429 is the status a
well-behaved client knows to back off on. It is within the documented 400–499 range for a custom
block response, and the 30 KB body cap is ample for a JSON error. Note that ADR-219 records
*"this server no longer emits 429 of its own; a 429 reaching a client originates at the edge or
upstream"* — so a 429 here is unambiguous and correctly attributed to the edge.

**Three refinements the mechanism supports, worth taking.**

1. **Count only failures on `/oauth/register`, via `counting_expression`.** A rate-limiting rule
   may use a counting expression distinct from its matching expression, and on Business and above
   that expression **may reference response fields** — the documented example is
   `http.response.code eq 403`. Counting only *unsuccessful* registrations
   (`http.response.code ge 400`) means a legitimate burst of genuine client installs never
   accumulates toward the limit, while the abuse pattern — repeated rejected or automated
   registration attempts — does. This substantially widens the safety margin on the endpoint
   where a false positive is most costly. Caveat: counting happens *after* the response is sent
   when response fields are used.
2. **Consider `cf.unique_visitor_id` instead of `ip.src` for the school-NAT case.** Cloudflare
   documents it as "IP with NAT support"; it is available on Business and above and is
   **incompatible with `ip.src`** (pick one). It would give users behind one school or corporate
   NAT separate counters, which is exactly the failure mode §9.1's threshold reasoning worries
   about. **Caveat worth stating: its NAT disambiguation relies on client-side signals a
   non-browser MCP client may not present**, in which case it degrades toward per-IP behaviour.
   So it is an improvement to test during the fortnight, not a substitute for a generous
   threshold.
3. **`cf.colo.id` is mandatory on every plan**, so counting is always per-data-centre. That
   divides any real client's observed rate across points of presence and is a further reason the
   thresholds above are generous rather than tight. Cloudflare also documents that counters
   update with *"a delay of up to a few seconds"*, so *"excess requests could still reach the
   origin before Cloudflare enforces a mitigation action"* — an edge rate limit is a volumetric
   bound, never an exact gate.

### 9.2 `/mcp` generally

The protocol endpoint needs a volumetric bound too, and it is currently the only layer, so its
absence is the whole control. Two observations shape it:

- **Requests are not uniform in cost.** A `tools/call` that fans out to the curriculum API is
  far more expensive than an `initialize`. A single request-count limit prices them the same.
- **A legitimate agent session is bursty.** An agent exploring a curriculum thread can issue
  many calls in quick succession, entirely legitimately. So the limit must tolerate bursts and
  bound sustained volume — which argues for a longer `period` with a proportionally higher
  count, rather than a tight per-second cap.

A reasonable starting shape is a per-IP-per-colo limit on `POST /mcp` with a **longer window**
(for example 300 requests over 60 seconds, or an equivalent longer-period rule), `log` first,
`block` with a 429 after. Enterprise supports periods up to 65,535 seconds and mitigation
timeouts up to a day, so a long window is available. **I am deliberately not proposing a firm
number**: unlike the OAuth endpoints, where the legitimate profile is derivable from the
protocol, `/mcp`'s legitimate profile depends on agent behaviour nobody here has measured yet.
§8's counting should produce the distribution of requests-per-IP-per-minute for real sessions,
and the threshold should be set from its tail. Proposing a number before that measurement would
be exactly the guesswork the owner asked me to avoid.

**On the cost-asymmetry problem, there is a real mechanism if it is licensed.** Cloudflare's
**Advanced Rate Limiting** (Enterprise add-on) permits request-body fields as counting
characteristics, including `lookup_json_string(http.request.body.raw, "<key>")`. For JSON-RPC
that means a limit can key on **the `method` field of the request body** — so `tools/call` can
carry a different budget from `initialize`, and an expensive fan-out tool can be bounded
separately from a cheap one. The same tier offers complexity-score-based limiting rather than
plain request counting. **Whether Oak's contract includes Advanced Rate Limiting is not
something I can determine from outside** — it should be checked, because if it is available it is
the single most fitting mechanism for this surface, and if it is not, the plain per-IP limit
above is the honest ceiling of what the edge can express.

**Per-user keying is out of scope here and already tracked.** Keying a limit on authenticated
identity rather than IP is materially better for this surface, and it is **MCP-593** (opened
when MCP-575 was found uncovered by the MCP-411 removal, and deliberately not
decision-complete — it needs Jim and Remy). Nothing in this section pre-empts it; an IP-keyed
edge limit is the floor that should exist regardless.

### 9.3 The gap no Oak rule can close

`revocation_endpoint` is `https://clerk.thenational.academy/oauth/token/revoke`. My `dig` in
§3.1 shows that host **CNAMEs out of Oak's zone** to a Clerk-operated worker. **No Cloudflare
rule in `Cloud-Config` can rate-limit, log, or protect it**, and it will never appear in Oak's
Security Events. Any statement of the form "the OAuth surface is rate-limited at the edge" is
false for this endpoint. It needs to be either accepted explicitly as Clerk's responsibility, or
proxied through Oak's zone — a decision for the Clerk lane, flagged here so it is not assumed
covered.

---

## 10. What I did not test, and why

| Not tested | Why |
| --- | --- |
| **Actual rate-limit thresholds under load** | Generating a burst against production `/oauth/register` would create real Clerk client records and constitutes load generation against a live service. The thresholds must come from observed logs (§8), not synthetic load. |
| **Which specific rule ID blocked each 403** | Requires Security Events. I hold the ray IDs (§3.3); this is the §12 owner ask. |
| **Whether a dashboard-created managed-rules *exception* already exists** | Not visible from outside or from the repository. `#558` flags it too. If one exists covering MCP paths, the answer to "has the WAF ever evaluated our traffic" changes from *unknown* to *no* — and my §3 blocks would then be attributable to custom rules instead. **This materially affects §3.3's inference and should be checked first.** |
| **Body-inspection limit behaviour on large bodies** | The limit is now known (128 KB on Enterprise, §6.3); a probe straddling it is a §8.3 test case rather than something I ran, because a >128 KB body against production is load generation, not observation. |
| **Whether Oak's Logpush job actually populates its WAF fields** | Requires Datadog access, which I do not have. This is §8.1 Defect 2 and it may be the most consequential unchecked item in the document. |
| **Whether Oak's contract includes Advanced Rate Limiting** | Contract fact, not observable from outside (§9.2). |
| **Long-lived SSE through the proxy** | Needs sustained observation, not a request. `#557` flagged it; §8.3 lists it. |
| **`terraform plan` for my proposed rules** | Out of brief — this is a review, and planning requires workspace rights plus the drift decision in §2. |
| **Live drift versus declared state across the whole rulesets stack** | Needs the Cloudflare connector or dashboard. `#561`'s plan already evidences drift on two resources (§2). |
| **Served-surface headers, CSP, frame options, app-layer origin-bypass** | **S1's boundary.** Not reviewed here. |

**On the Cloudflare MCP connector.** Per the brief I read the IaC first, and it answered almost
everything: declared state needs no connector. The residue that genuinely needs *live* state is
short and specific — ray-ID attribution, the `rules[0]` ruleset ID, whether an exception exists,
and the true extent of drift. Rather than struggle with an unauthenticated connector, I am
routing that as a distinct owner ask (§12). It is worth authenticating: every item on that list
is a minutes-long lookup for someone with access and a hard blocker from outside.

---

## 11. Recommendations

Each carries its warrant and a falsifier. Ordered by what unblocks what.

| # | Recommendation | Warrant | Falsifier |
| --- | --- | --- | --- |
| **R1** | **Re-target `Cloud-Config#558` from `block` to `log`, and widen it to cover the Cloudflare Managed Ruleset as well as OWASP.** Do not merge it as-is. | Owner's rollout is log-only first; §1 Gaps 1 and 3; §3 suggests the unscoped ruleset is the actual actor | Security Events attribute my §3 blocks solely to OWASP rules, in which case widening is unnecessary (though `log`-first still stands) |
| **R2** | **Attribute the §3.3 ray IDs before anything else.** Five ray IDs, dashboard lookup. | Everything downstream depends on knowing which ruleset blocks; §7.3 cannot be authored without it | The lookup returns nothing (retention expired), in which case reproduce and re-capture — the payloads are in §3.6 |
| **R3** | **Check for a pre-existing dashboard managed-rules exception on the MCP paths.** | If one exists, §3.3's inference is wrong and the WAF has never evaluated this traffic | No exception found |
| **R4** | **Fix the measurement instrument before the clock starts**: (a) confirm the existing job's `WAFAction` / `FirewallMatches*` fields are not empty legacy names, (b) add an unsampled `firewall_events` job, (c) validate every query with a control that must return a known request. | §8.1 — three independent defects, any one of which yields a false all-clear. (a) is the cheapest and the worst if unchecked | The fields populate, and traffic volume is high enough that 30% sampling still yields an adequate count — both computable |
| **R4a** | **Set `score_threshold` by the NUMBER 60, never the dashboard label.** | §6.1 — Cloudflare labels 60 "Low" and 25 "High"; the owner's "high threshold" means 60. Selecting the option labelled "High" inverts his ruling | None. This is a documented fact about the labels |
| **R5** | **Land `Cloud-Config#561` (subject to its own carousel-image merge-order gate) so the MCP surface is one host.** | §1 Gap 2 — two front doors means host-scoped rules harden one of them | The `www` route is retained deliberately, in which case every host-scoped rule here needs a second scope |
| **R6** | **Raise the anomaly score threshold to 60 for the MCP scope, keeping paranoia level 1.** | Owner's "lowest paranoia, high anomaly threshold"; `#558` keeps 40, the more-sensitive default | The fortnight shows real attacks scoring in the 40–60 band that the raise would admit |
| **R6a** | **Frame — do not yet decide — whether OWASP Core should run on the MCP scope at all.** | Cloudflare's own docs: it *"is prone to false positives and offers only marginal benefits when added on top of Cloudflare Managed Ruleset and WAF attack score"* (§6.1). For a curriculum-about-attacks origin that trade looks bad | R2 attributes the §3 blocks to the Managed Ruleset, in which case dropping OWASP buys nothing and this question closes |
| **R7** | **Add the §9.1 rate-limiting rules for `/oauth/register` and `/oauth/token`, `log` then `block` with 429.** | §4 — ADR-219's premise is currently false; unauthenticated DCR writes durable Clerk state | Clerk enforces adequate limits on its side for the proxied endpoints — checkable, and worth checking |
| **R8** | **Add a `/mcp` volumetric limit, threshold set from §8's measured distribution.** | §4 — the edge is the only layer and it is empty | Vercel-side or Clerk-side controls already bound this — again checkable |
| **R9** | **Host-scope or exclude the MCP surface from the zone-wide `"Block SQL requests"` and prototype-pollution custom rules.** | §7.5 — they apply to MCP for no articulated reason, and `block` zone-wide | They were deliberately intended zone-wide, in which case document why MCP is included |
| **R10** | **Reconcile the `http_ratelimit` / `http_request_firewall_custom` drift as a separate prior change.** | §2 — otherwise applying my rules also applies unrelated deletions as a side effect | Drift is intentional and documented somewhere I did not find |
| **R11** | **Configure a Cloudflare security-events alert for the MCP host before enforcing.** | §8.4 criterion 8 — a Cloudflare rejection never reaches the app, so Sentry cannot see it; without an alert the first report is a teacher's | An existing Datadog monitor on the logpush stream already covers it — checkable |
| **R12** | **Treat the reachable origin as a live edge-design constraint, and route it to the ADR-219 / MCP-349 decision — do not close it here.** | §5.1 — every control in this document is bypassable at `curriculum-mcp-alpha.oaknational.dev` | The origin is locked by a Vercel-side control I could not observe from outside |

### The one-line summary

**The edge currently does the opposite of what is wanted in both directions: it blocks
legitimate curriculum traffic it should pass, and it applies no volumetric limit to
unauthenticated endpoints it should bound.** `#558` addresses neither, though it is a step
towards the first.

---

## 12. Owner asks — routed, not assumed

For the Director to route. All four are minutes of work for someone with Cloudflare dashboard
access and hard blockers without it.

1. **Attribute five ray IDs** to rules and rulesets in Security Events (§3.3). Highest value.
   **Time-boxed: Enterprise retention is 30 days, so this expires around 2026-09-20**, after
   which the §3.6 payloads must be re-run to re-capture.
2. **Report the Cloudflare Managed Ruleset's ruleset ID** and the rules that fired, so §7.3's
   override can be authored rather than guessed.
3. **Confirm whether any managed-rules exception exists** on the MCP paths (§10, R3). Also
   whether any managed rules are **account-scoped**, since a zone-level exception cannot skip
   those (§7.4).
4. **Check one Datadog query**: does any recent record carry a non-empty `WAFAction` or
   `FirewallMatchesActions`? (§8.1 Defect 2.) If not, Oak's WAF logging has been blind, and that
   is the finding that matters most in this document after §3.
5. **Confirm whether Oak's Cloudflare contract includes Advanced Rate Limiting** (§9.2) — it
   decides whether a JSON-RPC-method-aware limit is available.
6. **Authenticate the `claude.ai Cloudflare` connector**, or grant read access to Security
   Events, so drift and live state stop being blind spots for this lane.

---

## 13. Boundary notes for peer seats

- **To S1 (served surface and application code):**
  - `POST /oauth/register` with `{}` returns a Go struct-validation error leaking an internal
    parameter name (`Key: 'CreateParams.redirect_uris' Error:Field validation for
    'redirect_uris' failed on the 'required' tag`). Information disclosure at an unauthenticated
    endpoint — your call, not mine.
  - `header_transforms.tf` on `Cloud-Config@main` **excludes `www.thenational.academy`** from the
    zone's `Content-Security-Policy` and `X-Frame-Options` rules
    (`… and not http.host eq "www.thenational.academy" …`). While the `www` MCP route lives, that
    is a real gap in your header analysis, and it is edge configuration rather than app code.
  - **The whole of Cloudflare's MCP guide is yours, not mine** (§6.0 / §5.2). Its checklist —
    consent dialog before the third-party flow, single-use CSRF token, `__Host-` prefixed
    `Secure; HttpOnly; SameSite=Lax` cookies, CSP `default-src 'none'` / `frame-ancestors 'none'`,
    `state` bound to session and deleted after use, HMAC-signed approved-client registry,
    HTML-encoding of client-supplied names and logos, and rejecting non-`http(s)` URL schemes —
    maps almost one-to-one onto the MCP specification's confused-deputy mitigations. It is a
    ready-made review grid for your half. Note the specification's stricter points: redirect-URI
    matching **MUST** be exact string matching, not wildcard or pattern; and the consent cookie
    **MUST NOT** be set until after the user approves, or the consent screen is bypassable.
- **To the Director:** §2's correction on `#557`'s merge state; §6.2's MCP-644 routing; §9.2's
  MCP-593 pointer; and §5.1 / R12 left open for the ADR-219 / MCP-349 decision you hold.

---

*Written by Seat S2, an AI agent, under PDR-117. Every measurement in §3, §5.1 and §9.1 was
taken first-hand against production on 2026-08-21 and names its instrument and control. No
Cloudflare configuration was read from, or written to, any branch other than
`oaknational/Cloud-Config@main`. Nothing here has been applied.*
