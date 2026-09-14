# Review: `agent-readiness-discovery-hub.plan.md` — 2026-09-09

Thorough review at owner request, of
`.agent/plans-backlog-2026-07/discovery/current/agent-readiness-discovery-hub.plan.md`
(authored 2026-06-01, 8 todos, all `pending`) and its evidence base
`standards-verification-2026-06-01.report.md`.

**Verdict: do not execute as written. The doctrine has held; the task list has
not.** Three of the plan's premises are now false, one acceptance criterion is
assigned to the wrong host, the surface agents read first is missing entirely,
and the sequencing has in practice moved to the ticket graph. Re-found it rather
than refreshing it.

## The premises that are now false

**1. `mcp.thenational.academy` is live.** The evidence report records "does not
currently resolve", and the plan gates its MCP non-goals on the host not
existing yet ("Publishing MCP Server Cards before `mcp.thenational.academy`
exists"). Measured today: the host serves protected-resource metadata (200
`application/json`). The alpha host the report cites as the substitute
(`curriculum-mcp-alpha.oaknational.dev`) is superseded, and a switch runbook is
already an open PR (ecosystem #921). Every MCP row in §Scope needs re-deciding,
not re-dating.

**2. Agent Skills are already published — on `open-api`, not the apex.** The
report's row says the index 404s and Phase 1 "must add skills publication". Live
today:

| URL | Result |
|---|---|
| `open-api.thenational.academy/.well-known/agent-skills/index.json` | 200 `application/json` |
| `open-api.thenational.academy/.well-known/agent-skills/oak-openapi/SKILL.md` | 200 `text/markdown` |
| `www.thenational.academy/.well-known/agent-skills/index.json` | 404 |

The plan's §Scope assigns this to "Apex index; Oak-owned artifact origins".
Publishing on the capability-owning host is what the plan's own origin-truth
principle demands, so the estate did the righter thing than the plan asked. The
consequence is that **`ar3` is largely done and `AR-A2` is the whole remaining
job** — one catalog relation pointing at open-api's index. Cheaper than the plan
prices it.

**3. The standards report is three months stale, and `ar1` is a rewrite, not a
refresh.** Its own "Corrections To Carry Forward" have themselves been
superseded:

- It names SEP-2127 and `.well-known/mcp-server-card` as the server-card
  authority. MCP-422 records the current answer as
  `<streamable-http-url>/server-card`, with SEP-1649 **and** the `/.well-known`
  paths superseded.
- MCP-346 answered **NO** to serving `/.well-known/mcp.json` at all. Neither
  plan nor report carries that decision, so a future reader re-opens it.
- MCP-644 records the app on protocol revision `2025-11-25` while the current
  revision is `2026-07-28`, where `server/discover` is mandatory for servers and
  absent here. The report predates the concept entirely.
- DNS-AID was checked at draft `-02` (2026-05-27) and needs re-checking.

## The gap the plan never had

**`llms.txt` is live, 92 lines, and appears nowhere in the plan.** Not in
§Scope, not in the acceptance criteria, not in the validation commands. It is
the surface a general-purpose agent reads first, it already names the Open API,
and it does **not** name the MCP app. Two tickets (MCP-421 Urgent, MCP-348) and
an open owner-authored PR (Oak-Web-Application#4450, 1 file, +4 lines,
`REVIEW_REQUIRED` since 2026-08-25) all act on it. A plan that claims to own
agent-readiness discoverability and omits `llms.txt` is not describing the
estate.

## `/mcp` — a path whose subtree is live and whose page is not

Worth recording precisely, because it is easy to state as a redirect:

| URL | Measured 2026-09-09 |
|---|---|
| `www.thenational.academy/mcp` | **404**, `x-matched-path: /404`, `x-vercel-cache: HIT`, zero redirects (browser UA too) |
| `www.thenational.academy/mcp/carousel/carousel_image_1.png` | **200 `image/png`**, 130,873 bytes, zero redirects |
| `www.thenational.academy/ai-plugin` | 200 `text/html` |
| `www.thenational.academy/ai-plugin/carousel/carousel_image_1.png` | 200, same 130,873 bytes |

The mechanism is a **rewrite, not a redirect** — `next.config.ts:530-535`,
`/mcp/carousel/:file` → `/ai-plugin/carousel/:file` — and the source comment is
explicit that this is deliberate: *"This is a REWRITE, not a redirect, so those
stored URLs keep returning 200 with the same bytes and no redirect"*, because
Anthropic's directory listing stores the old `/mcp/carousel` URLs and refetches
them indefinitely. Its removal condition is an owner action in the submission
portal (MCP-689), with the deletion itself blocked behind it (MCP-690).

So `/mcp` serves a working subtree under a parent that 404s. The live effect:
a crawler fetching a stored carousel URL succeeds, while an agent following the
`/mcp` link that PR #4450 is about to publish in `llms.txt` hits a dead end.
Neither the plan nor any acceptance criterion covers the path.

## Acceptance criteria, re-scored against the live estate

| | Criterion | State |
|---|---|---|
| AR-A1 | apex `Link` header + RFC 9727 catalog | **met** (catalog served via a rewrite to `/api/well-known/api-catalog`) |
| AR-A2 | absolute anchors + exactly one skills relation | anchors met; **skills relation absent** — now the highest-value single edit |
| AR-A3 | skills index valid, artifacts resolve, digests match | **substantially met on `open-api`**; digest verification unaudited by this review |
| AR-A4 | `open-api/Auth.md` documents static-key auth | **substantially met at `auth.md`** (lowercase; the capitalised path 404s). Documents the static-key model and the deliberate OAuth absence. Gaps: rate limits, support path — MCP-427 |
| AR-A5 | markdown representation for curriculum pages | **unmet** — `Accept: text/markdown` returns HTML, `.md` 404s. **The only criterion with neither a ticket nor a PR.** |
| AR-A6 | robots + sitemap on every official web app | apex and open-api met; **`mcp.thenational.academy/robots.txt` 404s** — the newest official app is the one breaching the baseline |
| AR-A7 | Content Signals ratified or explicitly gated | **unmet and unrouted** — apex robots carries no AI-bot rules; the decision brief for editorial/legal was never produced |
| AR-A8 | Web Bot Auth recorded per app with evidence | **unmet** — no per-app decision ledger exists |
| AR-A9 | focused checks + `pnpm check` before claiming readiness | not applicable until work resumes |

## The structural finding

The plan sits in `plans-backlog-2026-07/` with every todo `pending`, while its
work proceeds ticket-by-ticket on two different Linear projects — MCP-421…427 on
*MCP App: First Major Release*, MCP-631/633 on the *MCP OKR* project, with no
edge between them. **The board, not the plan, is the live execution
instrument.** Keeping a shelved plan that claims the sequencing invites two
readers to disagree about what is authoritative.

## Recommendation

1. **Keep** §Design Principles, §Non-Goals and the Plan-Body First-Principles
   Check verbatim. They have held up better than anything else in the document,
   and the estate has honoured them — MCP-346's "no", open-api's deliberate
   OAuth absence, commerce untouched, skills published on the owning host.
2. **Supersede the standards report** rather than editing it; date the new one
   and carry MCP-422, MCP-346 and MCP-644 into it as settled facts.
3. **Re-cut the todo list as the ticket graph**, with `AR-A5` minted (it has no
   ticket) and an `llms.txt` criterion added. Sequence: `/mcp` decided → #4450 +
   ecosystem #925 merged → catalog skills relation → `Auth.md` → the
   robots/Content-Signals decision brief.
4. **Decide `/mcp` explicitly**: a page, a redirect to `/ai-plugin`, or a
   documented rewrite-only path. Whatever is chosen, the carousel rewrite's
   removal condition (MCP-689/690) rides on the same decision, and PR #4450 is
   blocked behind it.
5. **Link the two Linear projects** or move one side, so the scanner-derived
   work has one home.
