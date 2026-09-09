# Agent-readiness collation — internal notes vs live estate, 2026-09-09

Collated at owner request. Two halves: everything the estate already records
about agent-readiness, and a first-hand measurement of what the public estate
actually serves today. Where they disagree, the measurement wins.

## The external scanner, and why its score is not quoted here

> **SUPERSEDED later on 2026-09-09.** The scores below were called
> unretrievable because the page renders client-side. It has a JSON API —
> `POST https://isitagentready.com/api/scan` with `{"url": "https://<host>"}` —
> returning `level`, per-check `status` with request and response `evidence`,
> and a `nextLevel` object naming the exact checks between a host and its next
> level. Measured that day: `www` level 1 (needs only `contentSignals`), `mcp`
> level 0 (needs `robotsTxt`, `sitemap`, `linkHeaders`), `open-api` level 4
> (needs `authMd`, `mcpServerCard`, `a2aAgentCard`). Full working in
> [ADR-228](../../docs/architecture/architectural-decisions/228-agent-web-standards-dispositions.md).
> Read the API, not the page — and read `nextLevel` and the per-check
> `evidence`, never the headline number.

`isitagentready.com/www.thenational.academy` renders its result client-side, so
the page fetches as the tool's framework text with no scan output. **No score
for Oak is reproduced in this document, because none was retrieved.** What the
tool declares it measures, in its own five categories:

| Category | Checks |
|---|---|
| Discoverability | `robots.txt`, sitemap, `Link` headers, DNS-AID |
| Content accessibility | Markdown content negotiation |
| Bot access control | AI bot rules, Content Signals, Web Bot Auth |
| Protocol discovery | MCP Server Card, Agent Skills, WebMCP, OAuth, `Auth.md`, ARD |
| Commerce | x402, MPP, UCP, ACP |

Its own headline advice: *"publish a valid `robots.txt` with AI bot rules and
sitemap directives, and make sure your homepage exposes useful discovery
headers."*

So the rows below are those checks run directly against the estate instead.

## Measured live, 2026-09-09

| Surface | Result | Reading |
|---|---|---|
| `www` `Link: </.well-known/api-catalog>; rel="api-catalog"` | present | AR-A1 met |
| `www/.well-known/api-catalog` | 200, `application/linkset+json; profile=rfc9727` | AR-A1 met |
| — its anchors | absolute, `https://open-api.thenational.academy` only | correct host ownership |
| — skills-index relation | **absent** | AR-A2 unmet |
| `www/robots.txt` | 200, 6 sitemaps, `Disallow: /api`, `/_next/image` | baseline met |
| — AI-bot rules / Content Signals | **absent on `www`** | AR-A7 undecided here |
| `open-api/robots.txt` Content-Signal | **`ai-train=yes, search=yes, ai-input=yes`** | **already published — see 0c** |
| `www/sitemap.xml` | 200 `application/xml` | baseline met |
| `www/llms.txt` | **200, 92 lines** | exists; not tracked by the Phase 1 plan |
| — mentions the Open API | once, line 74 | partial front door |
| — mentions the MCP app | **not at all** | MCP-348 not in production |
| `www/mcp` | **404** | the owner's asked-for front door does not exist |
| `www/.well-known/agent-skills/index.json` | 404 | not the host — see below |
| `open-api/.well-known/agent-skills/index.json` | **200 `application/json`** | **skills ARE published** |
| `open-api/.well-known/agent-skills/oak-openapi/SKILL.md` | **200 `text/markdown`** | AR-A3 substantially met, on the right host |
| `www` markdown negotiation (`Accept: text/markdown`, `.md` suffix) | **html / 404** | AR-A5 unmet |
| `www/.well-known/mcp.json` | 404 | **correct** — MCP-346 answered NO |
| `open-api/robots.txt` | 200 | baseline met |
| `open-api/Auth.md` | 404 | **wrong case — see below** |
| `open-api/auth.md` | **200 `text/markdown`, 1,518b** | **AR-A4 substantially met** |
| `mcp/.well-known/oauth-protected-resource` | 200 `application/json` | PRM live |
| `mcp/robots.txt` | **404** | AR-A6 gap on an official app |
| DNS `_agent.thenational.academy` TXT | none | DNS-AID absent (deliberate, MCP-423) |
| Apex DNS TXT | carries `openai-domain-verification` | OpenAI portal path already prepared |
| Commerce (x402, MPP, UCP, ACP) | none | **deliberate non-goal** — Oak does not transact here |

## What the estate already records

**Phase 1 execution plan, authored and unstarted.**
`.agent/plans-backlog-2026-07/discovery/current/agent-readiness-discovery-hub.plan.md`
— 8 todos (`ar1`…`ar8`), **all `pending`**, with acceptance criteria AR-A1…A9
and a proof contract. Its blocking first task `ar1` is a standards refresh
against `standards-verification-2026-06-01.report.md`, **now three months old**.

Its governing principle is the one that should survive any scanner row:

> **Origin truth over scanner scores** — metadata lives on the host that owns
> the capability. The apex indexes; it does not pretend to be the MCP server or
> Open API.

and its first-principles check: *"does this surface make Oak's public machine
estate more truthful and useful, or merely satisfy a scanner row? If the
latter, do not implement it."*

**Eight strategic-tracking plans** under `discovery/future/`: agentic-mechanisms
(parent), agent-skills, dns-aid, mcp-server-cards, aila-a2a-agent-card,
web-bot-auth, webmcp, skills-classification-taxonomy.

**Owner rulings on record** (director rulings ledger R29–R30, handoff §afternoon):
- isitagentready's results are **all ticketed** — MCP-422…427 plus MCP-421 —
  with per-surface honesty framing preserved: open-api's OAuth absence is
  deliberate and its `auth.md` is to say so.
- *"once the mcp is live on the `<www.thenational.academy/mcp>` url, it would be
  great to advertise that"* — **that URL 404s today.**
- Front-door cross-linking (llms.txt ↔ open-api discovery ↔ MCP listing) is
  *"the first post-submission priority"* (owner: *"100% yes… 1000%"*) → MCP-421
  Urgent, John Roberts tagged. **Not in production.**

**Tickets, grouped by what they are waiting on:**

| Live / in flight | |
|---|---|
| MCP-421 | Cross-link the three agent front doors — **Urgent, In Progress**, nothing serving |
| MCP-348 | Describe the MCP app in www's llms.txt — In Progress, absent from live llms.txt |
| MCP-345 | Advertise only granted scopes in AS metadata — **PR #970 open now** |
| MCP-636 | Package the Oak app for ChatGPT (Apps SDK) — In Review |
| MCP-302 | Oak plugin → Claude plugin directory — Urgent, In Progress |

| Backlog, agent-readiness proper | |
|---|---|
| MCP-422 | Server card at `<streamable-http-url>/server-card` if/when the extension stabilises — SEP-1649 and the `/.well-known` paths are superseded |
| MCP-423 | DNS-AID SVCB/HTTPS records (Low) |
| MCP-424 | WebMCP tool registration (Low) |
| MCP-425 | OAuth/OIDC discovery metadata, per-surface disposition (Low) |
| MCP-426 | OAuth PRM, per-surface disposition (Low) |
| MCP-427 | `auth.md` agent-registration completeness on open-api (Low) |
| MCP-123 | Agent Skills standard alignment: generator pass-through, `references/`, packaging |
| MCP-637 | Publish `server.json` to the official MCP Registry — *"no board home"* |
| MCP-347 | Root PRM served by the app but outside the canonical route |
| MCP-413 | `Cache-Control` on OAuth discovery responses |

| Answered / held | |
|---|---|
| MCP-346 | **NO** — do not serve `/.well-known/mcp.json` (so today's 404 is correct) |
| MCP-623 | OIDC discovery + userinfo — held, *"NOBODY NEEDS IT"*, High→Low with un-hold triggers; the isitagentready check is satisfied by the AS document |
| MCP-644 | App implements protocol `2025-11-25`; current revision is `2026-07-28` and `server/discover` — mandatory for servers there — is absent |

| Foreign board (OKR project, both Matthew Gregory) | |
|---|---|
| MCP-631 | Discoverability for the MCP sub-domain — cites isitagentready checklists |
| MCP-633 | MCP Auth — cites isitagentready checklists |

## What this collation adds that was not already written down

0c. **Third correction, and the most consequential.** `open-api`'s
   `robots.txt` **already carries a Content Signals line** — verified in the
   served body 2026-09-09: `Content-Signal: ai-train=yes, search=yes,
   ai-input=yes`. It is in the response body from an origin file, not a
   Cloudflare-managed prepend, and not in the headers. So AR-A7 is **not**
   "unmet and unrouted": it is **partially adopted, permissive, and
   inconsistent across hosts** — `www` publishes nothing, `open-api` publishes
   consent to AI training. Whether those values were ever ratified by editorial
   or legal is **unknown to this report**, and `ai-train=yes` is exactly the
   class of public policy claim the hub plan's risk table says must be routed
   to decision owners before encoding. This supersedes the earlier reading here
   and in the standards refresh, both of which recommended Cloudflare-managed
   robots.txt as the mechanism on the assumption nothing was published yet.
0b. **Second correction, same class.** `open-api/auth.md` is **live** and says
   exactly what the plan asked it to say — static-key auth, `Authorization:
   Bearer <opaque key>`, the key-request form, and an explicit statement that
   OAuth, OIDC, DCR and agent registration are *intentionally* not published,
   naming the three endpoints. A first pass probed `Auth.md` — the capitalised
   spelling the plan uses — got a 404, and reported AR-A4 unmet. The convention
   is lowercase. Remaining gaps against `ar4`'s own wording: **rate limits** and
   a **support path** (the form provisions keys, it does not support them),
   which is what MCP-427 is for.
0. **Correction to a first reading, recorded because the report is durable.**
   Agent Skills are live — on `open-api.thenational.academy`, not the apex. A
   first pass probed only the apex path, found 404 and read AR-A3 as unmet.
   Publishing on the capability-owning host is what the plan's own
   origin-truth principle requires, so the real gap is narrower than it looked:
   the apex API catalog carries **no relation pointing at that index** (AR-A2),
   so an agent starting at the front door cannot reach the skills.
1. **`llms.txt` is live and unowned by the plan.** 92 lines, serving today,
   mentioning the Open API once and the MCP app not at all. The Phase 1 plan's
   acceptance criteria never mention `llms.txt`; two tickets (MCP-421, MCP-348)
   depend on it. Nothing reconciles the file with either.
2. **`www.thenational.academy/mcp` 404s**, so the owner's advertise-it wish has
   no target. Whether the front door is a redirect, a landing page, or a
   listing entry is undecided and unticketed.
3. **`mcp.thenational.academy` has no `robots.txt`** — AR-A6 makes that a
   baseline for *every* official Oak web app, and this is the newest one.
4. **The standards-verification report is three months stale** while `ar1`
   blocks all seven implementation todos. MCP-422's own note (SEP-1649
   superseded) and MCP-644 (protocol revision moved) are both evidence that the
   underlying standards have already drifted since it was written.
5. **Two boards hold the same subject.** MCP-631/633 on the OKR project cite the
   same scanner as MCP-421…427 on First Major Release. No edge links them.

## What is correctly absent

Recorded here so a future scanner row does not reopen a settled decision:
`/.well-known/mcp.json` (MCP-346, answered no), commerce metadata (plan
non-goal — Oak does not transact through these surfaces), OAuth metadata on
`open-api` (deliberate; static-key auth, to be documented in `Auth.md`),
DNS-AID (scope decision not made), WebMCP and A2A (product decisions not made),
and any Web Bot Auth claim (needs security-owned edge evidence).
