---
fitness_line_target: 350
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# Next-Session Record — `mcp-submission-drive`

> **Record created 2026-08-13**, at the drive's first wrap. The thread had been
> named in claims and comms since 2026-08-06 with **no record on disk** — five
> Director seats used it as a coordination key while its index of homes lived
> only in dead session context. That gap is this record's founding reason.

## The goal

Oak's MCP app reaches public beta, **publicised 6 September 2026**
(owner-confirmed 2026-08-13). Not general availability — GA's bar stays ahead.

**The constraint that actually governs scheduling** (owner, 2026-08-17,
SUPERSEDING the 2026-08-13 "20 August" figure): MG is **away ~22-31 August** and
back ~1 September. From 2026-08-18 that is roughly **three working days**. The
operative question for anything dated after that is not "is it before 6 Sept" but
**"does it need MG personally, and can that dependency be removed or pulled inside
the window?"** Re-dating without answering that produces schedule pressure without
reducing risk.

**And the consequence that matters more than the dates** (owner, 2026-08-17): route
anything MG-needing the **SAME DAY it is discovered, never batched**. An item held
to Friday afternoon costs nine days.

## Coverage map — the human OKR project's five critical-path tickets

Produced 2026-08-13 from a full read of both boards. `MCP App: First Major
Release` (engineering) and `MCP OKR: We reach 8000 requests` (Aakesh's) sit on
one team and **share one issue-number space** — always name the project.

| Their ticket | Coverage | Engineering home |
|---|---|---|
| **MCP-575** per-user API keys | **Was uncovered.** MCP-274 and MCP-90 were both *Canceled* — retired when in-code rate limiting went (MCP-411). That settled *where* enforcement lives, never *what identity it keys on*. | **MCP-593** (new). Deliberately not decision-complete: needs Jim + Remy. |
| **MCP-577** Sentry observability | Covered but **invisible** — eight tickets sat with no project, so they appeared on no board. | MCP-544, MCP-495, MCP-493, MCP-481, MCP-480, MCP-559, MCP-546, MCP-580 — all now homed on the project. |
| **MCP-574** tool error rates | Half. Its two symptoms are separate defects. | `error=unknown` → **MCP-582** (re-scoped, larger than stated). `harness=other` → **MCP-594** (new, PR #880). |
| **MCP-579** carousel hosting | Mechanism covered, act was not. | **MCP-595** (new) → PR #883. Images verified PNG 1000×1000. |
| **MCP-94** Oak website | **Split across repos.** Landing page ours; nav dropdown is not. | Ours: MCP-128/509/350/182/348/421. Not ours: **MCP-596** (new) — no lane, no owner, still open. |

**Three items Aakesh's list did not surface** that outrank parts of it: the
Privacy/DPIA milestone (14 open, several Urgent, DPO consultation needs external
lead time); M2/M3 guidance pipeline and content (both 0%, and the release bet
rests on them); and MCP-536, the server-key naming decision — renaming after
publicity is far worse than before.

## Where everything lives (the index a successor needs)

- **Board of record**: `MCP App: First Major Release`, target 2026-09-06.
  Milestones re-dated 2026-08-13 and re-cut against what was then read as a
  20 Aug edge; the live constraint is the ~22-31 Aug absence above.
- **Tickets minted this drive**: MCP-593 (per-user credentials), MCP-594
  (harness attribution), MCP-595 (carousel), MCP-596 (web-app lane gap),
  MCP-597 (monitor disabled), MCP-599 (standing sign-off criteria).
  MCP-598 exists as a **duplicate of MCP-445** — the Sentry-identifier question
  already had a home.
- **Failure-mode doctrine**: `patterns/observer-must-see-the-terminal-state.md`
  (new); recurrence recorded on `patterns/turbo-cache-false-green.md`; three
  classes in the napkin.
- **Formation letter**: `.agent/experience/2026-08-13-wildfire-holds-quench-*`.
- **Owner-liaison seat — LIVE as of 2026-08-18, do NOT reconstitute a new one.**
  **Raven turns Nocturne** (`0aad1a`), claim `81fae3c8`, role `liaison`, worktree
  `oak-owner-liaison` on branch `chore/owner-liaison`. It is the single channel to MG:
  owner-facing items route to it, never direct. Its `SEAT-BRIEF.md` is the
  reconstitution path **only if no liaison is live** — check the claims registry first
  (`claims list`), and remember a STALE row does not mean a dead seat when heartbeats
  are suspended. The brief's own Director pointer was stale until corrected 2026-08-18;
  re-check it before trusting any seat pointer in it.

## LIVE STATE, 2026-08-20 ~13:35Z (Coal hunts Brilliance, `70bc33`, Director — SEAT STILL LIVE)

**This block is written mid-tenure, not at wrap.** It exists because a peer asked the right
question — whether a successor could pick this up from TRACKED state today — and the honest
answer was no. The comms stream and handoff records are gitignored and die with this machine;
this file and the Director brief are what survive. Written now rather than at closeout so the
answer stops being no.

### THE HOST MOVE IS DONE

`mcp.thenational.academy` is live, HTTPS, proxied, self-describing, and an MCP client session
has been driven through it. **The owner performed every step himself**, with a liaison seat
verifying each: DNS via targeted `terraform apply` from the unmerged PR branch (state serial
360, 09:48:27Z), additive `ALLOWED_HOSTS` (#920, merged `97daa15f3`, released 1.175.1),
certificate issuance, `CANONICAL_HOST`, then the proxy flip. **`www` still serves throughout,
deliberately.** Measured on both hosts ~12:31Z: conformant MCP `initialize` → `401` with a
correct RFC 9728 challenge; `/mcp/healthz` → `200`; carousel → `200`.

**Cloud-Config #556 was still OPEN at this write** — the record exists because the apply ran
from the branch, so `main` is behind state and merging #556 **as written** reconciles it. It
already matches state byte for byte. Nothing to import; no already-exists risk.

### THE `www`-PINNED CLIENT QUESTION — ANSWERED 2026-08-20 ~14:00Z, AND THE ANSWER IS THE BAD ONE

**A conforming client dialling `www` CANNOT authorise.** Measured with the reference implementation's own
code — `@modelcontextprotocol/sdk` 1.30.0 `selectResourceURL()` against the live-fetched PRM — by an
implementer seat and then reproduced first-hand by this Director:

```text
https://mcp.thenational.academy/mcp  -> OK      (CONTROL passes)
https://www.thenational.academy/mcp  -> THROWS  "Protected resource https://mcp.thenational.academy/mcp
                                                 does not match expected …/www…"
```

The throw is inside `auth()` **before client registration**, so it is a hard discovery failure. Residual:
a client supplying a custom `validateResourceURL` hook bypasses the check, so shipping clients divide
into those on the default path (fail) and those overriding it.

**DISPOSITION: (b) — keep `CANONICAL_HOST` on the new host and accept that `www`-pinned conforming clients
must re-point.** Two owner inputs settled this, and **the earlier "revert `CANONICAL_HOST`" recommendation
from this seat is WITHDRAWN as wrong:**

1. **The revert does not defer the mismatch, it INVERTS which population it breaks.** The PRM is
   host-independent — measured, both hosts serve the identical document driven by `CANONICAL_HOST`. So
   setting it back to `www` fixes legacy installs and **breaks every client dialling the canonical
   advertised host**, which is the host being publicised and the one whose third-party verification is
   this drive's acceptance bar. **Strictly the worse side of the trade.** This seat had the
   host-independence measurement and failed to carry it through to the revert case; the owner caught it
   with one question.
2. **Owner ruling: `www/mcp` becomes OWA's HTML landing page and this repo has nothing to do with it.**
   So `www/mcp` stops being a protocol endpoint at all, and **the re-point was always unavoidable** — the
   revert would only have delayed a legacy break by days while breaking the canonical host meanwhile.

**Option (c) — `www` self-describing as `www` while the new host describes itself — remains the correct
end state and is NOT available**, because `CANONICAL_HOST` is single-valued. That is the engineering work,
and it is what made this situation possible.

### SEQUENCING CONSTRAINT — ONE ORIGIN RULE NOW CARRIES THREE UNRELATED JOBS

**`www/mcp` currently serves (1) the carousel images, (2) the MCP protocol for `www`-pinned clients, and
(3) is the incoming home of the web application's landing page.** So the Cloudflare `http_request_origin`
rule for `www/mcp` is **a single act with three consequences**, and one of them is the moment `www`-pinned
installs stop reaching this app at all.

**Measured state** (owner-liaison seat, 2026-08-20):

```text
www/mcp/carousel/carousel_image_1.png   200 image/png   <- THIS app, via the www/mcp origin rule
mcp/mcp/carousel/carousel_image_1.png   200 image/png
mcp/carousel/carousel_image_1.png       200 image/png
www/carousel/carousel_image_1.png       404             <- only /mcp* reaches this app on www
cache-control on all of them            public, max-age=0, must-revalidate   (no edge caching)
files      apps/oak-curriculum-mcp-streamable-http/public/carousel/carousel_image_{1,2,3}.png
sentinel   a test PINS the three /mcp/carousel/carousel_image_N.png paths
```

**Whoever touches that rule first triggers the other two.** This must be ONE planned change with a stated
order, not three seats each making a locally-correct edit. **The order, and the reason for each step:**

1. **Carousel destination first — the images must serve at their new home BEFORE the origin rule changes.**
   Their URLs are baked into Anthropic's published listing, so a rule change that precedes the move 404s
   assets inside a third party's live listing. **The destination is an OPEN owner question — see below.**
2. **Re-pin the sentinel in the SAME change as the move, never a following pass.** The test pins those
   three exact paths: move the images without re-pinning and it either goes green against nothing or red
   for the wrong reason. That is the MCP-606 trap precisely.
3. **Tell Anthropic the URLs moved, at or before step 4.** The owner has established this is cheap —
   *"we can tell anthropic they've moved, no problem"* — but it is his line to them, not ours.
4. **Then the origin-rule change** handing `www/mcp` to the web application. **This is the moment
   `www`-pinned protocol installs stop reaching this app** — under disposition (b) they already cannot
   authorise, but this takes them from a failed handshake to a different application entirely. **Accept
   that deliberately, on the record, not as a side effect of a routing edit.**
5. **The HTML-leg removal on this repo's `/mcp`** follows or accompanies step 4, and must not precede it in
   a way that leaves `www/mcp` serving nothing.

**REQUIREMENT ON STEP 4, and it is the difference between a diagnosable break and an undiagnosable one.**
Today a `www`-pinned client fails at *discovery* — the reference SDK throws before registration, which is
a protocol error a client can surface and a human can search for. **After the origin rule moves, a pinned
client POSTing `www/mcp` reaches the web application and receives an HTML page: the same break, with a
materially worse diagnosis, on installs we cannot reach while the owner is away.**

**So step 4 must not ship as a bare routing swap.** `www/mcp` must answer a *protocol-shaped* request —
one whose `Accept` is `application/json` or `text/event-stream` rather than `text/html` — with a
self-describing response that names the new endpoint. Two candidate shapes, and the choice belongs to
whoever implements it:

- **A JSON error body naming `https://mcp.thenational.academy/mcp`.** Safest: it cannot be mis-followed,
  and it puts the new address in front of anyone reading a client log.
- **A `308`/`307` redirect to the new endpoint.** Cleaner when it works, but **verify before choosing it**:
  clients vary in whether they follow redirects on `POST`, and a redirect interacts with RFC 9728 resource
  identity in ways this drive has already been bitten by once today.

**Do not let this become "the web application serves HTML there now" and stop.** The requirement is that a
protocol client learns where it should go, from the response, without anyone here being reachable.

**OPEN OWNER QUESTION, DO NOT STAFF AND DO NOT MOVE AN IMAGE:** where the carousel images should live —
`www.` (marketing, Sanity-backed, CMS-controllable later) or `mcp.`. **He has not decided.** The liaison
recommended `www.` via Sanity, on the grounds that three screenshots with paired prompts, already renamed
once, are editorial assets whose every future change currently costs a PR, a deploy and an engineer — and
that it follows from his own two rulings today (this repo is protocol-only; `www/mcp` is the web
application's surface). **That is a recommendation awaiting an answer, not a decision.**

**Live tension to state honestly if it comes up:** MCP-458 is Urgent, `pre-submission`, and unstarted with
the owner's availability ending 20 August. The liaison's advice to him was not to let the destination gate
the deliverable. So the real question at his ruling is whether this ships before he goes at all, or whether
the screenshots ship where they are and move later.

### THE HIGHEST-VALUE REMAINING UNKNOWN

**`www` now serves a PRM whose `resource` is `https://mcp.thenational.academy/mcp`.** So a
client that dialled `www` — which is *every already-installed Claude Code plugin*, hardcoded —
is handed an identifier for a different URL. *Inference, labelled:* per RFC 9728 / RFC 8707 a
client validating the resource identifier either refuses, or acquires a token audienced for the
new host and presents it to `www`, which works only if the resource server does not check
audience per host.

**Nobody has tested it. Every automated gate here runs unauthenticated, so this class of defect
passes all of them.** The test is two minutes: an existing `www`-pinned plugin install, sign in,
one authenticated tool call. **It also answers the empirical half of MCP-638, MCP-639 and
MCP-640 at once.** It is in the owner's queue via the liaison and is the single thing worth his
attention before he leaves.

### PRs OPEN AT THIS WRITE — all bot-authored, zero failing checks

| PR | What | State |
|---|---|---|
| **#913** | warden-closeout gate + inference-vs-observation pattern; **carries BOTH Directors' continuity blocks** | three review findings cured, re-requested |
| **#921** | the switch runbook, **rewritten as a cutover record** | four review findings cured, re-requested |
| **#922** | ADR-113's disproven `openid` mechanism corrected | open, review requested |
| **#923** | MCP-636 gap report rescued from an untracked tree + two napkin entries + frictions F-164/F-165 | open, review requested |
| **#924** | ADR-219's every-served-domain premise corrected | open, review requested |

### TICKETS MINTED THIS TENURE

**MCP-642** (`release.yml` checks out main's tip, not the SHA that passed CI — verified
first-hand; deliberately a ticket not a PR, because the obvious `ref:` fix hands
semantic-release a detached HEAD), **MCP-643** (the security review's engineering remediation,
which needed a live home because MCP-634 is `Done`). Implementer seats also minted MCP-637
through MCP-641.

### FIVE IMPLEMENTER SEATS LIVE AT THIS WRITE — all inherit this Director's identity

**They are ONE row in the claims registry and are not separately addressable there** (defect
F-164). They sign with distinguishing suffixes, which is the only mitigation:

- **Seat A (front-doors)** — MCP-421 + MCP-348, incl. `Oak-Web-Application` work.
- **Seat B (discovery-metadata)** — MCP-623 + MCP-413; briefed consumer-question-first.
- **Seat C (auth.md verification)** — research only; is `/auth.md` still best practice.
- **Seat D (pre-submission sweep)** — 19 open, 9 Urgent, 7 cold since 4–6 Aug.
- **Seat E (conformance run)** — MCP-184 against the NEW host.

**A successor inherits their results with no way to address them directly.** Re-staff from
these briefs rather than trying to reach the seats.

### OWNER RULINGS LANDED TODAY — do not re-ask

- **Nothing in this repo is served from `www`** as the end state.
- **The Anthropic listing is changeable** through his direct line — not immovable.
- **Agents may work in `Oak-Web-Application`** under the owner credential with an agent
  disclosure blockquote (the Cloud-Config #556/#557/#558 pattern). **The bot install stays
  closed — do not raise it.**
- **The liaison seat does not take work.** Verbatim: *"you should be keeping the board moving,
  giving me the queue of anything needed from me, and ensuring the director is on track"*. An
  inherited "owed by this seat" item is a routing obligation, not an assignment — it comes to
  the Director to staff.

### WHAT THE ACCEPTANCE BAR ACTUALLY IS, stated so it is not oversold

**The drive's bar is a verified tag from Anthropic. It is product-gated and NOT achievable
through any engineering action available to us.** Agent-readiness discovery work makes the
server more findable; **it does not produce the tick.** Any burndown implying otherwise is
wrong. This changes what may be *claimed*, not what is built.

### OWED AND NOT DELIVERED — inherit as owed

- **The `auth.md` best-practice condition** (Seat C is answering it; the *build* stays fenced).
- **The R3 error-rate baseline and a `preview` alert rule** to `#mcp-alerts-sentry-preview`,
  inherited across three liaison seats, still waiting on MCP-497's noise being cured.
- **The ADR-219 / MCP-349 coupled decision** — see below.

### THE COUPLED DECISION IN THE OWNER'S QUEUE

`curriculum-mcp-alpha.oaknational.dev` is **unproxied** (`server: Vercel`, no `cf-ray`, against
proxied controls). Two consequences that arrived separately and are one decision:

1. **ADR-219's premise is falsified for that host** — the CodeQL `js/missing-rate-limiting`
   dismissals rest on it. #924 corrects the record without choosing.
2. **MCP-349's prescribed evidence method is unrunnable as written** — it asks for realistic
   traffic through the alpha and a Cloudflare Security Analytics read, but the alpha is not in
   Cloudflare's path, so no such data exists and no ruleset evaluates it. The OWASP evidence
   must instead come from `www/mcp` history.

**Proxy the alpha → JR's method becomes runnable and ADR-219's premise is restored. Accept the
exposure → MCP-349's evidence comes from `www/mcp` history and ADR-219 keeps a recorded
exception.** One decision, two consequences.

### THE GENERATOR THAT DOMINATED THIS DAY

**Seven-plus instances in two days across three seats: a true observation with a conclusion
welded on, the conclusion travelling as though it were the measurement.** Five were this seat's,
every one while forewarned. The distillation this tenure added, now in the napkin and in #913:

> **A control validates the INSTRUMENT, never the INFERENCE.** Four control-probed measurements
> supported a false conclusion ("the DNS record was made by hand outside Terraform") because the
> premise behind them — that an apply must come from a merged branch — was never tested. After a
> control passes, ask separately what else must be true for the conclusion to follow.

And its sibling, learned at cost: **re-measure at the moment of ESCALATION, not of discovery.**
Two owner decisions were escalated at 10:05Z that the owner had already resolved by 12:25Z.

## State at wrap, 2026-08-20 (Peony hunts Nectar, `742fb5`) — READ THIS FIRST

Sections below are historical. Where they disagree with this block, this block wins.
Full pre-position: comms event `ac68f51b`.

### The live thing: the host switch is TODAY and NOT READY

```text
dig mcp.thenational.academy   -> nothing        NO DNS RECORD
Cloud-Config #556             -> BLOCKED, REVIEW_REQUIRED (Terraform plan rights)
Vercel domain                 -> registered, verified 200
app accepts new host          -> NO, 403; PR #920 cures it, open
Clerk allowed origins         -> unstarted, not agent-doable
```

**No DNS record means nothing to switch to.** #556 needs plan rights on
`ws-RoT5BsWbN2mQZwZe` — 52 of 101 workspaces are runnable with the owner's
credential, that one is not, and sibling `cloudflare-rulesets` is. Looks
unintentional; worth raising with cloud-ops separately from the PR.

Procedure: `docs/operations/mcp-subdomain-switch-runbook.md` (PR #921).
**Recommendation already with the owner: steps 1–3 only, leave `CANONICAL_HOST` on
`www`** — it is single-valued, MCP-517 is a live bug in exactly that path, there is
no external uptime monitoring, and he is away 22–31 August.

### What landed this tenure

- **Vercel domain added** for `mcp.thenational.academy` at owner instruction, after
  establishing it is not Terraform-managed. **Ours is the only Oak Vercel project not
  managed as code** — MCP-635 raised, sequenced deliberately after the cutover.
- **MCP-497 overturned.** Hours from blocking the 6 September gate. The client is
  Anthropic's connector (627 failures, 12 users) — and those same users have 1,376
  successful `initialize` calls and 14,217 tool calls. Version negotiation working,
  not an outage. Owner dropped it to Medium and removed `pre-publish`.
- **MCP-634** minted, then its own cure corrected: setting `ALLOWED_HOSTS` explicitly
  would have evicted the host production serves on **and** killed `www/mcp` via the
  Cloudflare origin rewrite. Cure is union-in-code (PR #920).
- **MCP-622 trued in three places.** Its "the config is in no repository" sentence is
  false — the Cloudflare rules are Terraform in `oaknational/Cloud-Config`
  (`rulesets/header_transforms.tf`, `cloudflare_ruleset.http_request_origin`). That
  withdrew a dashboard-access request from the owner's queue.
- **Doctrine landed** (PR #913): the warden-closeout re-request gate, the three-reads
  queue discipline, and the `relayed-findings-carry-the-inference-not-the-observation`
  pattern.

### Five disproven beliefs — do not re-inherit them

1. **ADR-113's "Clerk rejects `openid`"** — FALSE, measured by DCR probe with a
   discriminating control. Clerk grants exactly the registered scopes, or the instance
   default. **The ADR still carries the wrong sentence; correcting it as a tracked PR
   is the successor's first task.**
2. **`profile` is already in Oak's Clerk default grant**, as is `offline_access`.
3. **MCP-307's "no code change needed"** — both stated properties true, conclusion
   false. The new host 403s.
4. **`get_project(...).domains` is not a domain inventory** and is unstable between
   identical calls.
5. **MCP-618's premise** conflated Clerk sign-up with OAuth authorisation; the owner
   dissolved it himself. Names are absent because Clerk's sign-up never asks
   (`first_name` enabled, `required=False`) — no scope changes that.

### Traps measured this tenure

- **A subagent inherits your PDR-027 identity**, and while it holds a claim
  `comms append` **and** `comms direct` both refuse to send — you are cut off the
  coordination lane by your own implementer. Cure: close the finished claim.
- **The harness reports `exit 0` on a commit the pre-commit hook rejected.** Twice.
  Check whether HEAD moved, never the notification.
- **Working off the coordination surface is indistinguishable from absent.** Four
  hours of it here; the liaison correctly pinged before escalating.
- `--model 'claude-opus-5[1m]'` **must be quoted** or zsh globbing kills the watcher.
- **`assert-watcher-live` reads green off a wedged watcher** — test cursor movement
  plus `emitted_count` advancing.

### From outside: a real defect nobody had ticketed

A third-party review pack surfaced it and it verified first-hand: **`release.yml`
triggers on `workflow_run` and its checkout supplies no `ref:`**, so it tags the
branch head at dispatch rather than the SHA that passed CI. The window opens whenever
two PRs merge inside one CI duration — this repo's normal mode. One line:
`ref: ${{ github.event.workflow_run.head_sha }}`. The file's own header comment
claims the opposite.

---

## State at wrap, 2026-08-17 evening (Skunk stirs Cavern, `db8b9b`) — SUPERSEDED IN PART

**PRECEDENCE, corrected 2026-08-18. Read this before trusting anything in this block.**
This block was written as the current one and declared everything below it historical.
It is now **partly superseded**. The precedence order is:

1. **§"Owner boundary, 2026-08-18"** and **§"Next safe steps — current as of
   2026-08-18"**, both BELOW this block, are the CURRENT instructions and **outrank
   this block wherever they disagree.**
2. This block outranks everything else below it, including Tuna holds Ballast's wrap
   from earlier the same day.

The original blanket sentence — "everything below is historical, this block wins" —
was true when written and became false the moment newer sections were appended
beneath it. It would have declared the 2026-08-18 owner boundary historical, and a
successor obeying it could have repeated the prohibited foreign-board writes that
boundary exists to prevent. **A precedence claim that names a POSITION rather than a
DATE inverts as soon as the document grows.**

**STALE AS OF 2026-08-18 — A LIAISON EXISTS. Do not act on the paragraph below
without reading this first.** The owner-liaison seat **Raven turns Nocturne**
(`0aad1a`) is live, holds claim `81fae3c8` with role `liaison`, and is the single
channel to MG. **Owner-facing traffic routes to the liaison, NOT direct to MG.**
Following the original instruction below would send owner traffic straight to him,
against the routing contract.

*Historical, as written 2026-08-17 evening:* the fleet was then EMPTY — both the
Director seat and the owner-liaison seat (`Wildfire spins Temper`, `8e5eba`) stood
down that evening at MG's word with no retained claims and no successor
pre-positioned, so the incoming Director was the owner interface directly. That is
the Director's NORMAL role under PDR-117 (single owner-interface: answer what you
can, lens-resolve the ambiguous, escalate what is constitutively the owner's) and
not an exception — but the "do not wait for a liaison to exist" instruction is
discharged, because one now does.

**DISCHARGED 2026-08-18: MG seated a liaison — Raven turns Nocturne (`0aad1a`), claim
`81fae3c8`. Owner-facing traffic goes to it, not direct. The paragraph below is retained
because its PDR-117 distinction is still correct doctrine and worth reading; only its
"there is no liaison" premise has expired.**

*As written 2026-08-17 evening — recorded separately, because it is a DIFFERENT fact:
there was then no liaison seat.*
PDR-117's Director-absent case is the case where NO DIRECTOR SEAT IS HELD, and what
it does is move the owner-interface to the **Implementer** — PDR-117 §The routing
contract, verbatim: *"the Implementer **is** the owner-interface directly; the upward
flow shortens to Implementer → owner."* It does NOT return coordination authority to
the owner. Liaison absence does not trigger that case at all and does not alter the
Director's role. What liaison absence changes is VOLUME, not authority: every
owner-facing item routes through the Director itself, with no relay seat to compress
or batch it.

Escalate on EITHER trigger, not just the second: **the lenses genuinely fail, OR the
decision is constitutively the owner's** (product / feature scope). And PDR-117 is
explicit that *"asking the owner is always legitimate and never discouraged — the
lenses refocus attention, they are not a gate on questions."* A Director who narrows
escalation to owner-constitutive items only will sit on a lens-failure, which inside a
four-working-day window is the expensive direction to err.

Corrected 2026-08-18 after the PR Review Warden caught the conflation on PR #903. Both
earlier statements of it were REMOVED in the same change rather than left standing; the
pre-cure text is readable in PR #903's diff.

### The single biggest correction: Oak already has external uptime monitoring

**Pingdom is live and already probing `www.thenational.academy`.** MG, verbatim:
*"pingdom is probing `www.thenational.academy` but we can add /mcp"* (backticks
added for the markdown gate; his words are unchanged).

For two weeks this thread carried, as established fact, that **Oak had no production
uptime monitoring**. It is stated in MCP-597, in the 2026-08-13 false-green napkin
entry, in two Director wraps, and it was load-bearing for a spend request, an
acceptance-criteria promotion, a provider comparison, **and a document given to MG to
share with his product team**. MCP-481 is now corrected in place with a visible
scope-correction block rather than a quiet edit.

The measurement behind the claim was sound and I re-verified it: the *Sentry* org holds
exactly one monitor, disabled, **zero checks in 30 days**. What was measured was *"the
Sentry org holds no active monitors"*. The qualifier fell off between probe and claim,
and five seats inherited it.

**Absence of a monitor in the surface you looked at is not absence of monitoring.**
Captured as a failure mode on the comms stream (`29b951e6`). It is the exact dual of
this thread's `disabled`-but-`ok` false green — there one surface over-reported health,
here one under-reported coverage; both were readings treated as facts about the world
rather than facts about the instrument. **Vendor inventory lives only in the owner's
head**, so no amount of in-repo rigour reaches it: when writing a universal negative
about the estate, put the scope in the sentence and ask him.

### MCP-614 is ANSWERED — verdict `baa53264`, `In Progress`

| AC | Provider | Cost |
|---|---|---|
| **AC1** health probe | **Pingdom** — add `/mcp/healthz` to the existing check | £0, already paid |
| **AC2** auth probe + `WWW-Authenticate` assertion | **Sentry** (fallback: Checkly free tier) | plausibly £0 |
| **AC3** interrupting destination | **OPEN — does NOT carry over** | £0 |
| **AC4** designed error alert set | Sentry, unchanged | £0, no uptime seat |
| **AC5** external | both satisfied | — |
| **AC6** synthetic distinguishable | Pingdom (its bot UA is modifiable) | — |
| **AC7** independent planes | **now genuinely satisfiable** | £0 |

Measured against production 2026-08-17T16:03:54Z, first-hand: `GET /mcp/healthz` →
`200`; `POST /mcp` without the protocol `Accept` → `406`; with it → `401` plus
`www-authenticate: Bearer resource_metadata="…/.well-known/oauth-protected-resource/mcp"`.

**Cloudflare is structurally excluded**, read from its own API schema: `GET`/`HEAD`
only (no `POST`), no request body, and **no response-header assertion field exists at
all**. Its schema also states *"The User-Agent header cannot be overridden"* (fails
AC6). And against a **proxied** host a health check *"will probe Cloudflare's edge
rather than your actual origin server"* — Cloudflare's edge probing Cloudflare's edge,
which is AC5's own sentence (*"a monitor that dies with the thing it monitors is not a
monitor"*) arriving through a vendor door. **Verified by ONE seat only** — the liaison
stopped mid-verification once the owner's facts closed the question. Do not cite it as
jointly confirmed.

**Pingdom cannot do AC2:** its *"check for string"* matches text *"anywhere in the
HTML"* — the response **body**, not headers. A body match on the 401 error body was
explicitly **refused** as the weakening AC2 forbids.

**AC7 is the quiet win:** Pingdom for liveness plus Sentry for errors gives two
genuinely independent notification planes — the independence AC7 currently makes us
*confess we lack*. Mark it satisfiable rather than amending it to accept one plane.

**Sentry cost, corrected mid-session.** Docs verify *"All Sentry plans include one cron
monitor and one uptime monitor"* and *"the PAYG budget is only available on paid
plans"*. Because Pingdom takes AC1, Sentry needs **exactly one** monitor — the included
one — so the incremental cost is plausibly **zero**. I stated a "$1/monitor/month"
figure as fact and **withdrew it** (threaded correction `efe09e4e`): it came from a
search summary, not a page I read. The recommendation never depended on the price.

**The PAYG 400 is anomalous, not expected.** Docs say deactivated monitors count *"if
they were previously active in the current billing period. Otherwise, they don't"* —
and `1593267` has run zero checks in 30 days. Three hypotheses MG's billing view
separates in one glance: unfunded budget → top-up; consumed slot → nothing to buy;
**free/Developer plan → PAYG unavailable rather than merely unfunded**. **I did NOT
re-measure the 400** — re-testing it is a *write* to a production monitor, which is
MCP-597's act, not this spike's.

### The asks MG is holding — UPDATED 2026-08-18, one DISCHARGED by measurement

**Ask 3's first half is ANSWERED — do not put it to him.** Measured first-hand in Sentry
2026-08-18: **uptime monitors ARE available on the plan.** The feature exists and the API
exposes full create/update. **The blocker is QUOTA, not plan tier** — a distinction the
earlier revision of this record did not have, and it changes the shape of the decision
from "can we?" to "will we fund it?".

**The PAYG refusal is now REPRODUCED A THIRD TIME, today, on an idempotent NO-OP** —
`update_uptime_monitor` setting the monitor's name to its own current value returned
`HTTP 400 {"status":["You don't have enough pay-as-you-go available to create a new
seat"]}`. So it is not "enabling costs a seat": **every write to detector `1593267` is
refused, including a rename.** Sentry uptime is unusable without a spend decision, full
stop. Three independent measurements across five days.

**Also new, and it constrains AC2:** `create_uptime_monitor` DOES accept `method`,
`headers` and `body`, so the `Accept: application/json, text/event-stream` header MCP-493
needs for its `POST /mcp` probe is settable and the 406-vs-401 trap is solvable. But the
schema states plainly *"Advanced response assertions are not supported in this MVP;
configure them in the Sentry UI if needed."* **AC2's header assertion is UI-ONLY, not
API-reachable.** Detector `1593267`'s live assertion is `status_code_check >199 AND <300`
and carries no header assertion.

**And a live gap nobody had named:** alert rule `758827` "MCP production — new issue" is
enabled, `environment: production`, routed to `mcp-alerts-sentry-prod` — but
**`lastTriggered: null`. It has never fired.** The owner's Slack test proved the
*binding*, not the rule. `metricRules: []`. Separately `488389` "Test Alert 1" is **still
enabled with `environment: null`**, so preview noise still reaches
`#sentry-alert-testing` — MCP-544's "retire Test Alert 1" step is still outstanding.

The asks below are what remains. Do not re-ask, do not add:

1. **Pingdom:** add a `/mcp/healthz` check to the existing `www.thenational.academy`
   check. He does it himself (agreed — a two-minute UI action beats provisioning a
   token).
2. **Pingdom:** report that existing check's **interval**. AC1 requires 1–5 minutes and
   **a longer interval fails it silently.**
3. **Sentry, ONE glance now, not two:** can **Early Adopter** be switched on? That
   flag is what unlocks response-header assertions, i.e. AC2, and there is **no
   read-only Sentry surface** for org settings or feature flags, so it needs his own
   view. The plan-availability half of this ask is DISCHARGED — see above.
4. **A spend decision on the Sentry PAYG quota**, newly separable from ask 3 now that
   plan tier is ruled out as the cause. Not the same question as "is a monitor
   available": the monitor is available and every write to it is refused for want of
   quota. If Pingdom takes AC1 at £0 and Sentry keeps AC2, this is the one remaining
   cost question on the detection chain.

Recommendation already with him on the one fork: if the included monitor is
unavailable, pay for the single monitor rather than adding Checkly — two tools already
in the estate beats three with a new vendor account.

### PR state at this wrap

| PR | State |
|---|---|
| **#902** operator-local tier + identity action-class split | **OPEN, all 15 checks PASS**, `BLOCKED` on the code-owner gate only, review requested from `mantagen` |
| #900 owner-liaison seat brief | open, draft, retention only |
| #867, #761 | open, ours, unchanged — #761 still 1000+ behind with conflicts, unanswered |

**MCP-606** (carousel filenames + literal URL sentinels) is **`In Review`, NOT merged** —
verified first-hand at this wrap. The outgoing liaison's handoff listed it as merged; it
is not. Flagged rather than quietly corrected because it is the day's dominant failure
class arriving one more time: I had already written "merged" into this record on their
word, and only the wrap's metaloss pass caught it. **Inherited claims are claims.**

### The PR Review Warden seat is armed, with merge authority

Owner instruction: *"i want to set up a colpilot agent to be doing code reviews …
watching for any open PRs with 'mantagen' requested review … reviewing as identity
'mantagen' and should turn on automerge too"*.

- Worktree `oak-pr-review-warden` on `chore/pr-review-warden`, **fast-forwarded from
  668-behind to `05cca303f`**, installed, built, `.env.local` copied, bare `eslint`
  proven to resolve, `gh` confirmed as `mantagen`.
- **Seat brief revision 2** at
  `.agent/state/collaboration/handoffs/pr-review-warden-seat-brief.md` (machine-local).
  Revision 1's *"Never merge"* is **withdrawn by the owner**.
- **Auto-merge authorised** under six conditions (approved, all threads resolved,
  checks green, not a draft, not `mantagen`-authored, no open findings), `--merge` only
  (repo is merge-commit-only), never `--admin`. **Hands off and route to the Director**
  for release/CI/ruleset config, credentials or auth guards, `.agent/` doctrine, and
  anything deleting or disabling a gate.
- **The self-review wall bites immediately:** GitHub forbids a PR's author from
  reviewing it, so posting as `mantagen` the warden can only *comment* on MG's own PRs
  (#772, #768, #750) — it cannot approve or usefully arm auto-merge there.
- Queue was **0** at setup — control-probed against 15 open PRs, a true zero, with every
  requested review pointing at `jimCresswell`. It is now **1**: PR #902.

### Owner facts settled today — do not re-ask

- **Availability:** *"i'm off at the end of this week until the end of the month."*
  ~4 working days from 2026-08-17; away ~22–31 Aug; back ~1 Sept; publicity 6 Sept.
  **The consequence that matters more than the dates: route anything MG-needing the
  SAME DAY it is discovered, never batched.** Thursday is fine; Friday afternoon costs
  nine days. This supersedes the record's earlier "20 August".
- **Credential split, verbatim:** *"emgee-bot for commits/PR raises … mantagen for
  reviews/approvals."* Landed as **tracked doctrine** in
  `bot-identity-on-third-party-systems` §"The action-class split" (PR #902), general
  rather than per-seat. This **resolves** the review-warden-grant tension earlier
  briefs called open. Cite the rule, not per-user memory.
- **Delegation:** *"i want the new director to pick up all those Observability issues …
  anything that the director's team of agents can't do (limited by permissions;
  requires me judgement; etc) then i can pick up."*
- **Assignee is owner-of-record, not ownership of the doing.** MCP-481/597/493/544 were
  MG-assigned before any agent arrived; the delegation instruction is the work signal.
- **Spend posture:** *"doesn't feel like a priority i'm not sure we need it"* and *"i
  didn't realise Sentry probs were an additional spend"* — both said **before** the
  number was known. Neither is a refusal of a £0 path.
- **Register discipline, MG-corrected:** anything he *forwards to a human* is **facts
  and asks only** — state → gap → action → owner → date. He called an earlier draft
  "fluffy". The dense internal register suits tickets and comms events and is wrong for
  a colleague-facing paste.

### New: the operator-local config tier (PR #902)

`.agent/operator-local/` is a **durable machine-local** home for facts that were
homeless and lost at least once each: credential bindings, tone of voice, personal
operating preferences. `profile.md` is gitignored; two stubs are tracked.

- **Resolve it in the PRIMARY checkout** — `git worktree list --porcelain | head -1`.
  It cannot reach a linked worktree, and copying it per worktree diverges invisibly.
- **Absence is the expected condition** (Any User, Any Machine): proceed on tracked
  defaults and say nothing.
- The shared start-right workflow **§3a** points every session at it.
- It exists because per-user memory is a **buffer** the estate drains by design — the
  2026-08-10 review-warden grant lived only there and was about to be lost.
- **MG's tone-of-voice section is deliberately near-empty and marked `[CONFIRM]`.**
  Seeded only from evidenced behaviour; his outward voice is **unratified**. A seat
  drafting anything in his voice should say so.

### MCP-617 — new, and it carries a live unknown

Cloudflare change to serve `GET text/html` on `/mcp` from the Oak web app. Raised by
the liaison seat; `Backlog`, High, M9, `CloudOps`.

- **No DNS change and no code change in this repo for the cutover.** OWA is already the
  default origin for `www`; this app is a path-scoped carve-out, and the change
  *narrows* it so fall-through does the rest. Reversible; mistakes surface as visible
  404s. Four files become dead afterwards — listed as cleanup, deliberately not part of
  the change, because the alpha alias still serves them (MCP-307 open).
- The predicate is `selectsHtmlLeg` in `src/mcp-middleware.ts`, already unit-tested —
  use it as the spec.
- **THE UNKNOWN:** code comments say the rule is scoped to `/mcp` and `/mcp/*`, but
  `/.well-known/oauth-protected-resource/mcp` demonstrably resolves on `www` and does
  **not** match that scope. Either a second undocumented rule exists or the live scope
  is wider. **The edge config is in no repo** — no `wrangler.*`, no cloudflare
  directory. Whoever holds Cloudflare access must **enumerate every rule on that host
  before changing anything.**
- Nine-probe acceptance test on the ticket, every expected value measured live. Two
  probes non-optional: the carousel images (permanent URLs in Anthropic's listing) and
  `/mcp/healthz` (ADR-162's obligation and Pingdom's new target).
- Needs **Cloudflare and OWA access** — both permission walls, both MG's.

### Traps found today, both still live in the tooling

1. **`agent-tools spawn` leaves the new branch tracking `origin/main`** — so a bare
   `git push` from a spawned lane targets **main**. Cured by hand on
   `chore/pr-review-warden`, `docs/operator-local-profile-tier` and
   `docs/director-handoff-skunk-stirs-cavern`. The tool still does it. **Unset the
   upstream on every spawned lane.**
2. **A fresh-worktree `pnpm build` corrupts a tracked generated file** —
   `packages/sdks/oak-sdk-codegen/src/generated/vocab/graph-corpus/data.json` emerged
   with 461 lines deleted and an invalid control character at offset 24371460, failing
   `validate-current-source` and therefore blocking **any** commit in that worktree.
   That is also why spawn's own lane-marker commit failed. HEAD's copy parses clean, so
   it is build-side. Repair without a working-tree-overwrite command:
   `git show "HEAD:$F" > "$F"` — git reads history, the shell writes.

### FOR THE INCOMING DIRECTOR — start here

**Being the owner interface is the Director's NORMAL role under PDR-117** — answer what
you can, lens-resolve the ambiguous, escalate what is constitutively the owner's — not an
exception to it.

**BUT AS OF 2026-08-18 YOU ARE NOT THE RELAY: route owner-facing items to the LIAISON**,
Raven turns Nocturne (`0aad1a`), claim `81fae3c8`. The upward flow is Implementer →
Director → liaison → MG. When this block was written on 2026-08-17 evening both the prior
Director and the liaison had stood down with no seat pre-positioned, so the Director was
the relay; that is no longer true. Same-day routing still binds, and now binds on the
liaison rather than on you.

**Landing target: MCP-597.** Pingdom takes AC1 at zero cost, so the Sentry quota no
longer gates the health probe. Sequence:

1. **Check whether MG answered the three asks above.** Two of them unblock MCP-597
   outright. If unanswered and it is late in his week, that is the single most
   time-critical thing on the drive — after Friday it waits nine days.
2. **MCP-544 (AC4) needs no owner input — but it is NOT unblocked, and those are
   different claims.** CORRECTED 2026-08-18, in place, because this block's own
   precedence rule ("where they disagree, this block wins") would otherwise make a
   successor prefer this instruction over the correction: MCP-544 is `blockedBy`
   **MCP-495**, which is Urgent/`Todo` and whose PR #768 carries the owner's own
   *"DO NOT MERGE — post-submission"* label. So it is not the piece to move while
   waiting. Verified first-hand on the board 2026-08-18.
3. **MCP-493 (AC3)** — and note the destination does **not** carry over.
   `#mcp-alerts-sentry-prod` was decided for the *Sentry* path; a Pingdom failure needs
   its own destination decision.
4. **PR #902 is MERGED — DISCHARGED, do not action it.** Merge commit `3002f4476`,
   2026-08-18T11:57:30Z, an ancestor of this record's own head. `.agent/operator-local/`,
   the start-right §3a pointer and the credential action-class ruling are all on `main`.
   What replaced it as the open PR work: **#903** (this record) and **#906** (the
   foreign-board-write-discipline rule), both carrying reviewer blockers.

**Do not** re-run the provider comparison; it is answered. **Do not** weaken AC2 to fit
a tool, and **do not** propose an in-repo scheduler (ADR-162, AC5).

**Still the highest-value unknown on the drive:** nobody has looked at what Anthropic
did with the connector, submitted 2026-08-07. Verified-tier escalation is automatic and
unattended, and **MCP-178** — the witness ticket whose whole job is to check — has
never been started and is on no project. Only MG can see the portal. It touches his
stated acceptance bar (a verified tag from Anthropic) and has been open all day.

## State at wrap, 2026-08-17 midday (Tuna holds Ballast, `a2ce03`) — historical

Superseded where it disagrees with the evening block above — notably its "there is no
production uptime monitoring" premise and its two Sentry spend asks.

The 2026-08-13 sections below are **historical**. Where they disagree with this
block, this block wins. Every claim here was verified first-hand today.

### The single biggest correction: the connector was ALREADY SUBMITTED

**The Claude connector went in on Friday 2026-08-07.** MCP-106 closed 2026-08-10.
Aakesh's MCP-92 "Publish app in Claude" and MCP-88 both read Done since 2026-08-11.
Our board's M0 still reads ~66% and overdue, which is the pessimistic half of a
two-board disagreement.

Per the requirements read on MCP-106: submissions are auto-scanned and listed as
**community** connectors by default, and **Anthropic auto-escalates high-value
listings to verified review — no action needed from us**. MG's acceptance bar is a
**verified tag from Anthropic** (owner, 2026-08-17), so the mechanism to that bar has
been running unattended for over a week.

**Nobody has checked what happened.** MCP-178 — the ticket whose whole job is
"after review completes, publish on approval, verify from a fresh account, record the
listing reference" — is still `Todo`, unassigned, never started. **This is the
highest-value unknown on the drive** and it needs MG (the portal requires a Claude
Team/Enterprise org Owner; no agent can look). Three questions for him: what state is
the listing in (community or escalated)? the submission reference was never recorded;
was the fast-track email to our Anthropic contact ever sent?

### Production sign-in is LIVE — MCP-143 does not gate submission

Measured against production, not read off a board: PRM resolves; the advertised
authorization server's **unrewritten** `jwks_uri` and `revocation_endpoint` are both
on `clerk.thenational.academy` (the production realm — the unrewritten pair is the
only lens a proxy rewrite cannot fake); `POST /mcp` unauthenticated returns `401`
with a correct RFC 9728 `WWW-Authenticate` challenge.

So MCP-143's Linear `blocks` edge to MCP-106 is **stale board state**. Its stage 2
(the actual promotion) is done; what remains is stage 1 guard hardening — real
security work, not a release gate. **#761 is not the critical path**: it is 1047
commits behind main with four conflicts in `env-clerk-guards.ts` and `env.ts`, the
very files it changes, and MG's three findings are substantive design changes, two of
which imply deployment decisions that are his.

### PR state at this wrap

| PR | State |
|---|---|
| **#882** knowledge + consolidation | **MERGED** `d5ee6dd2d` — this record reached `main` here |
| **#880** MCP-594 attribution | **MERGED** `0e74b43ce`, v1.171.0 |
| **#883** MCP-595 carousel | **MERGED** `e46da7927`, v1.171.0 |
| **#881** MCP-301 public docs | **CLOSED** at owner direction — product concern; branch preserved |
| **#900** owner-liaison seat brief | **OPEN, draft** — retention only |
| #867, #761 | open, ours, unchanged |

### Board corrections landed today

- **M6 now defines BOTH halves.** Its description was analytics-only, so the
  monitoring half had **no acceptance bar and therefore could not fail** — that is
  why it read ~70% with zero production alerting. **MCP-481 is now the acceptance
  criteria** (AC1–AC7, provider-neutral, each falsifiable from evidence).
- M6's false "EU data residency" claim corrected (MCP-470: 5 EU + 4 US; MG's own
  comment says it *must not* claim EU-only).
- OKR milestone "Private Beta → Public Beta" date `2026-09-02` → **`2026-09-06`**.
- **MCP-309 corrected**: it carried "the live gate on the plugin is MCP-339 …
  MCP-339 still has no assignee" for four days after MCP-339 closed Done.
  **Blockers 8 → 3.** Five unwired, each confirmed Done first-hand.
- MCP-308 (public-docs mirror) **Cancelled** and removed from the project.

### The three real M0 blockers

**MCP-468** (in progress) · **MCP-458** (human check discharged — all three PNGs read
directly, no prompt text visible; what remains is Aakesh confirming the image→prompt
pairing, which was *inferred* and never specified) · **MCP-330** — the one to watch:
Backlog, nobody moving it, an upstream `oak-openapi` call, and the ticket says
resolution *"is a decision, not an edit"*. It is the only blocker with no owner in
motion.

### Sentry: the PAYG gate is REAL and wider than assumed

```text
HTTP 400
{"status":["You don't have enough pay-as-you-go available to create a new seat"]}
```

Measured twice, including on a **URL-only** edit with no status change — so the quota
blocks **every write** to detector `1593267`, not just enabling it. We cannot even
correct the stale alpha-alias URL and leave it disabled ready to flip. Proved from
check history (`period=7d` → "No checks found"), never the config field: it has never
run, and its `uptimeStatus: ok` is meaningless.

**Correction to step 3 below:** the "slash form routes through Clerk" caution does
**not** reproduce. Both forms return identical `200` + `no-store` today. Use the bare
form anyway — because the monitor's assertion is `status_code > 199 AND < 300`, a
pure 2xx check that cannot distinguish them, and cannot express MCP-481's AC2 at all.

### Two standing owner instructions, binding on every seat

1. **emgeebot for EVERY GitHub write** (2026-08-17), not just `gh pr create` — PR
   comments, review replies, `gh api -X POST/PATCH/DELETE`. Six instances of the
   `gh`-is-not-ambient class. **Carry the token line verbatim in any brief**; briefing
   "use emgeebot, it's ambient" is the git half and caused two of the six.
2. **Answering a review is not finished until emgeebot re-requests review from
   `mantagen`** — otherwise it never re-enters his filtered queue. #880 sat answered
   and green for **four days**, invisible. Verify against the queue search, never the
   POST's echo.

### Live GitHub degradation at this wrap (may have cleared)

- REST `/pulls/<n>/reviews` returns **zero bytes** repo-wide (761, 867, 878, 886,
  899) while **GraphQL returns the reviews**. Any tooling reading review state over
  REST currently reads "no reviews" for every PR.
- GraphQL 503s intermittently, so `gh pr create` fails; `gh api -X POST .../pulls`
  (REST) works. #900 was created that way.
- The PR list endpoint intermittently returns "We couldn't respond in time" at a full
  5000/5000 rate limit — retry absorbs it.

### FOR THE INCOMING DIRECTOR — start here

**MG's word, 2026-08-17:** *"the director is closing out, i will start a new director
and get them to work through these tickets."* The observability work is set up,
labelled, prioritised and assigned to him, ready to pick up.

```text
MCP-481  ACCEPTANCE CRITERIA — monitoring/alerting        Todo · Urgent · MG
  ├── MCP-614  Choose the provider against AC1–AC7        Todo · Urgent · Spike  ← START HERE
  │              blocks MCP-597
  ├── MCP-597  re-point + enable + prove checks ran       Todo · Urgent
  ├── MCP-493  alert rule → #mcp-alerts-sentry-prod       Todo · Urgent
  │              blockedBy MCP-597
  └── MCP-544  design + arm the alert set                 Todo · Urgent
```

All five carry the `observability` label, as do four adjacent tickets (MCP-480,
MCP-495, MCP-559, MCP-581) that are deliberately **not** children — forcing them under
MCP-481 would dilute the acceptance bar until it means nothing. Label gives the group
view; parenthood is reserved for the ACs. Deliberately **not** a milestone: MG's
milestone doctrine (2026-07-30) is simple, completable, externally-visible product
states, and "alerting is armed" is an operational posture no teacher can see.

**Start at MCP-614, not MCP-597.** Whoever opens MCP-597 first hits the PAYG 400 on
their first API call. MCP-614 carries the verbatim refusal, the URL-only-edit finding,
and the instruction to verify provider capability **against the provider's API**, not
a pricing-page bullet — AC2 is a response-*header* assertion, and "custom headers
supported" usually means *sending* them.

### Routing contract — new owner constraint, 2026-08-17

MG, verbatim: *"you'll stay as the owner liaison for any tasks required of me. that
means keeping the chatter quiet so only stuff i need to read comes in here."*

- **Directed event to the liaison ONLY when something genuinely needs MG** — a
  decision the five lenses do not resolve, an owner-constitutive call (product or
  feature scope, accepted residual risk, a spend authorisation), or an act only he can
  perform.
- **Everything else stays on the broadcast stream.** The liaison holds the
  all-channels watcher and absorbs coordination hygiene, branch state, fold ceremonies,
  failure-mode captures and instrument findings. They read them; he does not.
- **Do not route to MG directly** unless he has directed you to. Upward flow is
  Implementer → Director → liaison → MG.

Do **not** "helpfully" arm the `--exclude-tag heartbeat` quiet configuration. The
liaison checked: it would filter nothing, because heartbeats are suspended fleet-wide
under PDR-078 §4 and `comms peer-liveness` reports all 12 peers retired. The traffic
reaching MG was `narrative` broadcasts, which that flag cannot touch. The lever is
behavioural, not configurational.

**MCP-596 is MG's own**, In Progress, tracked in the `oak-web-application` repo, not
here. Do not chase it and do not re-ask who owns it.

## State at wrap, 2026-08-13

| PR | State |
|---|---|
| **#878** MCP-580 canonical `/healthz` | **MERGED and LIVE** — production returns `200`, `no-store`. |
| **#880** MCP-594 client attribution | Open, all checks green, blocked on MG's own `CHANGES_REQUESTED`; request moved to `jimCresswell`. |
| **#881** MCP-301 public documentation | Open. 24 claims sourced, 7 gaps as owner options. |
| **#882** knowledge + consolidation | Open, based on the coordination branch. |
| **#883** MCP-595 carousel | Open, 19/19 green, awaiting Aakesh's name verification. |

## Owner boundary, 2026-08-18 — LINKS AND STATUS YES, DESCRIPTIONS AND COMMENTS NO

Two owner instructions minutes apart, and **the second governs the scope**. An earlier
revision of this record carried only the first and stated the boundary as "write
nothing", which was too broad; corrected here the same day.

**First, the prohibition:** *"Ah -- please don't post onto Aakeh's board or tickets. I
see you've edited it. .. please undo"*

**Then the narrowing, which is the operative rule:** *"For each of those tickets on
Aakesh's board could we link them to their related tickets on our board please? and
update the status (this we *can* do)"*

On the Linear project `MCP OKR: We reach 8000 requests to the Oak MCP app`:

| | |
|---|---|
| **PERMITTED** | `relatedTo` / `blockedBy` links pointing at our engineering tickets; **status** updates so the board reflects reality |
| **NOT PERMITTED** | editing the **description**; posting **comments** |
| **STAYS THEIRS** | **priority** — the owner named links and status only, and the priority edits were the part he asked undone |

**Why the line falls there, which is worth more than memorising it: a description is the
product owner's own statement of their need, and a comment is us speaking on their
record. Links and status are shared bookkeeping about work we own.** Being factually
right about someone else's ticket is not authority over their words — but it IS a reason
to keep the graph honest. Reading the prohibition as blanket would leave the two boards
permanently disconnected, which is the very thing the owner was pointing at.

**How the violation happened, recorded because the reasoning is the reusable part.** Five
of the six tickets on the owner's same-day priority list sit on Aakesh's project — a fact
the liaison established first-hand and stated plainly in its opening message. This
Director then issued rulings requiring writes to three of them (MCP-618 priority plus
links, MCP-611 cancelled, MCP-577's scope steer), and the liaison executed them. Nobody
lacked the fact. **"Our board" meant the engineering project only, and a shared
issue-number space made adjacent tickets feel in-scope when their OWNERSHIP had never
changed.** Four tickets were reverted and re-read to confirm; Linear's activity log still
records that the edits happened and cannot be erased.

## MCP-611 — hazard CLOSED, kept here as the reasoning record

MCP-611 describes a cookie banner the owner has called **moot**: *"The cookie banner is a
moot point -- what we need instead is for GET /mcp text/html to serve from OWA"*. It is
superseded by **MCP-617**.

It is now **Cancelled and linked to MCP-617** — closed by the permitted mechanism (status
plus a link) rather than by prose on someone else's ticket, so a board-reading seat will
not staff a banner nobody wants. Retained here only as the reasoning, not as the guard.

**MCP-577's scope steer stays on OUR side**, because a description edit is not permitted:
tool-call failure rates are Sentry's job; **abuse is NOT** (an edge concern under ADR-219
via MCP-411, and Sentry structurally cannot see abuse — abuse is a flood of successful
200s emitting no error event); **security risk is NOT** (exception trackers report
crashes, not attacks — home is MCP-271). Homed on MCP-271/MCP-481. Do not re-assert it on
their tickets.

## Next safe steps — current as of 2026-08-18

Rewritten 2026-08-18. The 2026-08-13 list this replaces routed MCP-597 through a
Sentry PAYG unblock, which MCP-614's verdict superseded — Pingdom takes AC1 at £0.
Everything below survived that supersession and is either re-verified first-hand or
explicitly marked unverified. Anything absent is discharged or superseded, not
forgotten.

1. **Two billing limits, both open, both minutes of admin, owner-only.**
   Re-verified 2026-08-18 first-hand on #902/#903: the `claude` reviewer posts
   *"your organization's overage spend limit has been reached"* and
   `chatgpt-codex-connector` posts *"Codex usage limits have been reached for code
   reviews"*. **BOTH** automated reviewers are dark, so every PR now merges with no
   automated review. The `claude` overage was first recorded **2026-08-13** and has
   been unactioned five days — that age is the finding; the Codex limit was only
   discovered 2026-08-18, so the five days attach to the first member, not the pair.
   Owner word 2026-08-18: *"i've got reviewers on hand don't worry"* — so treat this
   as RISK CARRIED, not as an open ask, and do not re-route it to him.
2. **Rotate the GitHub PAT** visible in plaintext in the process list. Recorded
   2026-08-13; **NOT re-verified 2026-08-18**. Re-measure before acting and treat
   it as live until measured otherwise. Security item, owner-only.
3. **MCP-597 — the landing target. ONE blocker edge is stale; the other is TRUE.**
   - **MCP-580 is Done** (2026-08-13, PR #878) and its `blockedBy` edges on MCP-597,
     MCP-544, MCP-493 and MCP-481 are stale. Cutting them is a Linear write.
   - **MCP-614's edge is TRUE — do not cut it.** Its provider COMPARISON is answered
     (Pingdom takes AC1 at £0; do not re-run the comparison — owner instruction), but
     the TICKET is `In Progress` and its step 0 still needs the Pingdom interval and
     the two Sentry-plan facts sitting unanswered in the owner's queue. "The
     comparison is answered" and "the ticket is unblocked" are different claims, and
     an earlier revision of this record conflated them. Cutting this edge would make
     MCP-597 look startable when the first Sentry API call still hits the PAYG 400.
   - **The two AC legs have DIFFERENT vehicles, which is why 1593267 still matters.**
     AC1 (health probe) is Pingdom, £0, and is ask #1 above — the owner adds
     `/mcp/healthz` to the existing check himself. AC2 (auth probe with the
     `WWW-Authenticate` assertion) stays on **Sentry's included monitor**, so
     detector `1593267` remains the vehicle for AC2 and its work is **re-point,
     ENABLE, and prove checks ran**.
   - **The PAYG quota blocks EVERY WRITE to 1593267, not merely enabling it** —
     measured twice, including on a URL-only edit. This is the fact that makes the
     Sentry-plan ask load-bearing rather than administrative, and it is why the two
     billing limits above are the items gating the only automated detection that
     functions across the owner's 22–31 August absence.
   - Use `https://www.thenational.academy/mcp/healthz` in **bare form, no trailing
     slash**. Note the REASON, because this record measured the old one as false: the
     "slash form routes through Clerk" caution does **not** reproduce — both forms
     return identical `200` + `no-store`. Use the bare form because the monitor's
     assertion is `status_code > 199 AND < 300`, which cannot distinguish them.
   - Prove checks ran **from the check history**, never from the config field: this
     detector read `disabled` while its Uptime Status still read `ok`.
4. **MCP-458** is one human act: confirm the prompt is not visible in the three
   carousel images. Format, width, naming, placement and byte integrity are
   discharged.
5. **M6's milestone description still says "EU data residency" and is false**
   (MCP-470: 5 EU + 4 US, owner-chosen). Offered to the owner; not yet fixed.
6. **MCP-544 is NOT the free lane** the 2026-08-17 evening block called it. The
   correction is applied IN PLACE at that block's own item 2 — see
   §"FOR THE INCOMING DIRECTOR" above — because this section sits below a block
   whose precedence rule would otherwise override it. Recorded here only as a
   pointer, deliberately not as the authority.

## Standing traps this thread has paid for

- **`agent-tools spawn`, never raw `git worktree add`.** Measured across four
  worktrees: spawn-created ones pass the pre-commit gate; a hand-rolled one
  cannot, and the failure presents as a `next/font/google` build error.
- **`gh` is authenticated as the owner even though git is ambient emgeebot.** A
  bare `gh pr create` authors as `mantagen` and silently drops the reviewer
  request, leaving the code-owner gate unsatisfiable. Mint a token; verify with
  `--json author,reviewRequests`. Five instances to date.
- **A non-existent path under `/mcp/` returns 406, not 404.** Any check written
  as "confirm it is not a 404" passes on a completely broken URL.
- **Board state is not work state.** Five of MCP-309's eight declared blockers
  were already Done while the board implied otherwise; one discharged gate read
  as the top launch risk. **Recurred 2026-08-17**: a `CHANGES_REQUESTED` flag was
  read as a work signal and nearly staffed an implementer lane against work that
  had been finished for four days — the cure commit post-dated the review by
  thirteen minutes.
- **A zero from a filtered query is only evidence if the filter is known to
  match something.** `reviewed-by:claude` → 0; `reviewed-by:claude[bot]` → 627.
  **GitHub renders bot logins as `claude` in GraphQL and `claude[bot]` in REST**,
  so a login carried across surfaces silently matches nothing and reads as a
  measured absence. Control probe: run the same query with a filter you know
  returns hits.
- **Never compare a `…Z` timestamp against a local wall-clock.** A `+0100` commit
  time read against a UTC clock turned 79 minutes into "15 minutes ago" and
  produced a false "actively working right now". Use epoch arithmetic. The
  Director brief carries the inverse instance.
- **A git identity is not a session.** Commit authorship was used to identify
  which live session held a branch; it was the wrong session entirely. Authorship
  tells you which credential signed, nothing about who is at the terminal.
- **Suppressing stderr on a watcher turns failure into apparent quiet.** A
  `2>/dev/null` on a review watcher made it see 5 items where a correct read sees
  53 — roughly 90% blind, silently. Capture stderr, report failed reads, and
  foreground-probe any watcher before arming it.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
|---|---|---|---|---|---|---|
| Wisteria lifts Verdure | claude-code | claude-opus-5 | c4294f | director | 2026-08-06 | 2026-08-06 |
| Schooner rides Marsh | claude | Opus-5 | d9d5b8 | director | 2026-08-12 | 2026-08-12 |
| Walrus herds Jetty | claude | Opus-5 | a9cd9a | director | 2026-08-12 | 2026-08-12 |
| Marlin binds Wave | copilot | GPT-5.6 Sol | a8a9e9 | pr-review-warden | 2026-08-12 | 2026-08-12 |
| Wildfire holds Quench | claude | Opus-5 | ee2764 | director | 2026-08-13 | 2026-08-13 |
| Tuna holds Ballast | claude-code | Opus-5 | a2ce03 | director | 2026-08-17 | 2026-08-17 |
| Wildfire spins Temper | claude | Opus-5 | 8e5eba | liaison | 2026-08-17 | 2026-08-17 |
| Orchid holds Bark | claude | Opus-5 | 2abbd1 | liaison | 2026-08-13 | 2026-08-13 |
| Skunk stirs Cavern | claude-code | claude-opus-5 | db8b9b | director | 2026-08-17 | 2026-08-17 |
| Dormouse turns Footfall | claude | claude-opus-5[1m] | a54547 | director | 2026-08-17 | 2026-08-18 |
| Sloop spins Spray | copilot | GPT-5.6 Sol | c42e7e | pr-review-warden | 2026-08-18 | 2026-08-18 |
| Raven turns Nocturne | claude | Opus-5 | 0aad1a | liaison | 2026-08-18 | 2026-08-18 |
