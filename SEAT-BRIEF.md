# Seat brief — Owner Liaison

> Read this first, then run `/oak-start-right-team`. This brief is your per-seat
> context (worktree, branch, role, task, Director). It invokes the skill; it does
> not replace it.

## Who you are

- **Worktree:** the `oak-owner-liaison` sibling worktree (this checkout)
- **Branch:** `chore/owner-liaison`, cut from `origin/main`
- **Role:** `liaison`
- **Thread:** `mcp-submission-drive`
- **Director:** Peony hunts Nectar (`742fb5`), claude / claude-opus-5[1m],
  seated 2026-08-19 07:32Z at owner word — PDR-064 Moment 2 broadcast, claim
  `6228d1f1`. **Do not trust this line over the live registry:** confirm with
  `claims list` and read the CURRENT Director from a fresh row. This file has
  twice named a Director two generations stale.
  (Prior Directors on this thread, for record only: Dormouse turns Footfall
  `a54547` 2026-08-17 evening to 2026-08-19 morning; Skunk stirs Cavern `db8b9b`
  and Tuna holds Ballast `a2ce03` 2026-08-17; Wildfire holds Quench `ee2764`
  2026-08-13; Schooner rides Marsh `d9d5b8` and Walrus herds Jetty `a9cd9a`
  2026-08-12; Wisteria lifts Verdure `c4294f` 2026-08-06.)
- **Identity:** assigned at launch by the `SessionStart` hook. Confirm it with
  `pnpm agent-tools:collaboration-state -- identity preflight --platform claude --model Opus-5`.

## Why this seat exists

Standing owner instruction, MG, 2026-08-13:

> Any questions/blockers that need human input should be communicated to me VIA A
> SPECIFIC team member agent. I want you to create that team member agent in a
> worktree … so that any input required from me is in that terminal session so it
> doesn't get lost in the chitter chatter.

You are the single, dedicated channel between the agent fleet and **MG** (Matthew
Gregory, GitHub handle `mantagen`). You are **not** an implementer: no source
lane, no code claim, no delivery work. If you find yourself editing product code,
you have left your seat.

## Your three duties

### 1. Awareness

Run the canonical all-channels comms watcher (rule
`.agent/rules/comms-all-channels-watcher.md`) as **move 1**, before anything
else, and keep it live for the whole seat. Every question, blocker,
decision-request, owner-gate and lens-failure any seat raises arrives on that
stream. Assert it with `comms assert-watcher-live` and keep the F-95 heartbeat
green. Re-arm on the Monitor's own exit notification, and run the foreground
sweep after every restart. The stream is large (1,644 events on 2026-08-19) and
a drain deadline of 300000ms has been observed to time the watcher out; 600000ms
with a smaller `--max-events-per-drain` survived.

**Keep your own claim row fresh, and never read a stale peer row as a dead seat.**
Heartbeats are suspended fleet-wide (PDR-078 §4), so **nothing refreshes your claim
automatically** and it ages out after `freshness_seconds` (4h) while you are
demonstrably alive. Measured 2026-08-19: `claims heartbeat` is sound — it moves
`fresh_until` to `heartbeat_at + 4h` — the mechanism simply has no driver. This
seat's row went stale twice in two days and caused two peers to compute the fleet
as `n=2` with no liaison, which is the precise failure this seat exists to prevent.
**Arm a recurring self-heartbeat at session open**, well inside the window. And when
reading peers: **absent, stale, and retired are three different states** — only a
positive stand-down declaration means retired. Note the field is `heartbeat_at`,
not `last_heartbeat_at`; reading the wrong key reports a fresh row as stale.

### 2. The owner-facing decision queue

Maintain one visible queue **in this terminal**. Every item carries:

- **The ask** — what is actually being decided, in one sentence.
- **The lens run** — which of the five Decision Lenses were applied and why they
  failed to resolve it (`principles.md` §Decision Lenses: 1 architectural
  excellence → 2 strict everywhere → 3 could it be simpler → 4 would it be
  simpler if the system changed → 5 user value).
- **Your recommendation**, with its warrant.
- **What is blocked behind it** — named lanes, named tickets.

Present **verdicts, not menus**. Surface each item at MG's action moment, not
batched at the end. Keep it short — MG is often on a phone, so lead with the ask
and push the evidence into the durable artefact.

### 3. Relay

Carry MG's answers back to the fleet as **directed comms events**, and record
each as a binding surface so a later seat cannot re-ask a discharged gate. A
discharged gate that gets re-asked is a failure of this seat, not of the asker.

## The gate you enforce

Escalate upward **only** what the five Decision Lenses genuinely fail to resolve,
or what is constitutively MG's call — product or feature scope, accepted
residual-risk authorisation, or his own promised review. Over-surfacing is as
much a failure of this seat as losing a question: it is the risk-averse crouch,
and it under-uses the fleet's own decision authority.

Asking MG is never _wrong_ — the lenses discipline **whom** a question routes to,
not **whether** it may be asked.

## Drive context

- **The goal:** Oak's MCP app public beta, **publicised 6 September 2026**
  (owner-confirmed 2026-08-13). The acceptance bar is a **verified tag from
  Anthropic** (owner, 2026-08-17) — an external verdict, not a self-assessment,
  so anything on the path to that tag outranks internal tidiness.
- **The constraint that governs scheduling** (owner, 2026-08-17, SUPERSEDING the
  earlier "20 August"): MG is away ~22-31 August and back ~1 September, leaving
  ~4 working days from 2026-08-17. For anything dated after that, the question is
  not "is it before 6 Sept" but "does it need MG personally, and can that
  dependency be removed or pulled inside the window?"
- **THE RULE THAT GOVERNS THIS SEAT** (owner, 2026-08-17): route anything
  MG-needing the **SAME DAY it is discovered, never batched**. A Thursday
  discovery routed Thursday is fine; the same item held to Friday afternoon
  costs nine days. Batching is the failure mode this seat exists to prevent.
- **Boards of record:** `MCP App: First Major Release` (the agent-authored
  engineering project) and `MCP OKR: We reach 8000 requests to the Oak MCP app`
  (the human-authored project, Aakesh Pattani). **Both sit on team `MCP App
Pathfinder` and share one issue number space** — always name the project when
  you cite a ticket, or the number is ambiguous.
- **Identity discipline:** every commit and PR in this drive uses the
  `emgeebot-oakenfold` bot identity, with review requested from `mantagen`.
- **Coordination home:** the PRIMARY checkout, not this worktree. Claims, comms
  events and seen-files all resolve there via `git worktree list` — never seed or
  write coordination state into this worktree, or you create a decoy invisible to
  peers (the F-41 class).

---

# State at handover — 2026-08-19 morning, Raven turns Nocturne (`0aad1a`)

> **SUPERSEDED IN PART.** A later section — _State at 2026-08-19 afternoon, Thistle hunts
> Acorn_ — is the current record. Read that one first and prefer it wherever the two
> disagree. This section is retained because its error generators and mechanics traps are
> still live knowledge, not because its state is current.
>
> **Dated. Read this before the sections above where they disagree, and supersede it wholesale
> when you write your own.** Standing doctrine is above; this is what was true when I stood down.

## Fleet

- **Director: Peony hunts Nectar (`742fb5`)**, seated 07:32Z, PDR-064 Moment 2 broadcast, claim
  `6228d1f1`. Confirm against `claims list` — do not trust this line.
- Prior Director Dormouse turns Footfall (`a54547`) stood down retaining nothing.
- **No implementers live** at handover. Three warden seats reviewed and closed out on 18 Aug.
- Fleet is n=2 plus you.

## MG's live queue — he is picking these up himself after lunch, 19 Aug

Acts only he can perform. **These are surfaced and acknowledged; do not re-surface them, chase
them, or treat his silence as loss.**

1. Serve the OpenAI domain-challenge token at `www` → Verify Domain. Token is in the portal.
   The **apex** copy is the durable one (parent of every candidate subdomain) but the apex→`www`
   `301` is a Cloudflare edge rule, so it needs item 3.
2. Pingdom: add `/mcp/healthz` to the existing `www.thenational.academy` check **and report the
   interval** — MCP-481 AC1 needs 1–5 min and a longer interval fails SILENTLY.
3. Authenticate the `claude.ai Cloudflare` connector via `/mcp`. **This may already be
   unnecessary** — see §Open threads.
4. Install the `emgeebot-oakenfold` GitHub App on `oaknational/Oak-Web-Application` (currently
   scoped to one repo). Moves the whole OWA class off him.
5. Sentry UI: retire `Test Alert 1` (`488389`, the only rule with `environment: null`), and decide
   whether rule `758827` keeps its `Issue resolved trigger` condition — it notifies the production
   channel when an issue is FIXED, which dilutes the signal during his absence.
6. One glance: Sentry billing → spend by category. Tests whether the pay-as-you-go wall blocking
   uptime monitor `1593267` is really ~2M log events/month, ~75% `debug`.
7. **MCP-178** — the Anthropic listing state. Portal needs a Claude Team/Enterprise org Owner, so
   no agent can look. **Now a prerequisite for MCP-622**, because a host migration changes the
   endpoint that listing advertises.

**Owed to him and deliberately NOT delivered:** the R3 error-rate baseline and a `preview`
alert rule routing to `#mcp-alerts-sentry-preview`. He asked for both. **They are blocked on
MCP-497's noise being cured** — 99% of production error volume is one non-fault, so any threshold
derived today is derived from noise. Deliver them after that lands, and say why they waited.

## Discharged — re-asking any of these is a failure of THIS seat, not the asker's

- **MCP-618 / cure A is SETTLED.** Full name + email ship via the `profile` scope. **Country code
  will NOT be collected** — it is not an OIDC claim and Clerk metadata leaves MCP-first users
  blank; MG is having the published policy amended to say so. DPO cleared cure A on Slack.
- **Subdomain: `mcp.thenational.academy`**, path stays `/mcp`. MCP-622 unpaused.
- **MCP-497 is NOT an outage** and does not block 6 September. Medium, `pre-publish` removed, MG
  is telling Jim. See §My errors.
- **Cloud-Config DNS work** assigned to the Director, PR under `mantagen` — because emgeebot is
  not installed on that repo and 404s there.
- **Aakesh's OKR board:** links and status permitted, descriptions and comments NOT. Now a
  tracked rule on `main` (`foreign-board-write-discipline`, PR #906).
- Claude Code overage, Sentry PAYG as a spend ask, the GitHub PAT, `/mcp/healthz` staleness,
  carousel crops — all removed from his queue by the previous liaison after probing.
- Sentry **uptime monitors ARE available on the plan**; the blocker is quota, not tier.
- Whether the emgeebot/mantagen review carve is unresolved — it is not, it is tracked doctrine.

## Open threads worth knowing

- **The Cloudflare "unreadable config" blocker may be dissolving.** All day it was recorded as
  in no repository. That was measured against THIS repo. `oaknational/Cloud-Config` holds
  Cloudflare infrastructure-as-code including `infrastructure/cloudflare/rulesets/`. If the origin
  rules are there, MG's item 3 above is unnecessary for the routing work. The Director is checking.
- **PR #867 / MCP-581** is the one live lane: five operator-doc blockers, and it is the standing
  objection to trusting the production alert set (MCP-544 may only reach Done recorded as _armed
  but not dependable_).
- **Rule `758827` has never fired** — `lastTriggered: null` since 13 Aug. A Sentry test
  notification proves the Slack binding, not the rule's conditions or its environment filter.
- **My branch:** `chore/owner-liaison`, draft PR **#900** (retention only). Pushed at handover.

## My errors, and the two generators behind them

Recorded because the generators repeat, not for the tally.

**Generator 1 — reasoning about a mechanism instead of its consequence.**

- **MCP-497, the costly one.** Failures carried `mcp.method: server/discover`, so I concluded
  "fails at first contact, therefore the client gets nothing" and **escalated it to MG as the top
  priority of the drive**. I never queried the success side. The same users had 6,757 successful
  `initialize` and 62,963 successful `tools/call`; the user I named as impacted made 864 tool
  calls. The Director overturned it on measurement. **A failure at a step is not a failure of the
  journey.**
- **The country-code fork.** I rejected "partial A" and then offered MG an option that was itself
  partial A, buying a broader permission grant for no gain. I applied my own test to every option
  but mine.

**Generator 2 — asserting from a name or from memory instead of opening the thing.**

- **Minted MCP-621 as a duplicate of MCP-617** because I had read MCP-617's _name_ in a handoff and
  took a one-line description of its hardest open question for the whole ticket.
- **Told MG to mint an `alerts:write` org token.** No such scope exists, and organisation tokens
  have fixed scopes. Both asserted from memory, both wrong, corrected before he acted.
- Read `last_heartbeat_at` when the field is **`heartbeat_at`**, and reported my own live claim as
  stale.

**Also:** I wrote prose onto Aakesh's board, then recorded the resulting boundary too broadly
("write nothing"), which would have left both boards permanently disconnected. Both corrected.

**What worked:** n=2 with a Director who contradicts you. Every one of the above was caught within
minutes — several by the Director, several by me only because I re-measured before asserting.
**Invite the contradiction actively; it is the mechanism, not either seat's diligence.**

## Mechanics that cost me time

- **`comms watch` drain deadline:** 300000ms timed out on a 1,644-event stream. 600000ms with
  `--max-events-per-drain 40` survived. Re-arm on the exit notification and sweep the gap.
- **Comms events are gitignored** (`comms/*`, zero tracked). They are machine-local coordination
  state, NOT a durable record. So is `handoffs/*`. Anything that must outlive the machine goes to
  a tracked file on `main`.
- **This worktree could not commit for two days** — a stale zero-byte `index.lock` from 17 Aug,
  misdiagnosed as transient contention. Check the lock's age, holder and size before believing a
  contention story.
- **`claims heartbeat` takes only `--active --claim-id --now`** — no `--platform`/`--model`, unlike
  its siblings. Do not fill documented args by analogy.
- **`check-commit-message` uses `-F <file>`, not `--file`.**
- **`cmd | tail` reports the pipe's exit code.** Capture to a file and read `$?` unpiped.
- **A hook enforces positive design statements.** Two comms writes were refused for
  exception-shaped wording ("carve-out", "not an exception"). State the design as uniform instead —
  it is better writing anyway.
- **The GitHub review-request search is eventually consistent**: an early read is a false negative.
  Verify with the direct API read AND a settled search, never one alone.

---

# State at 2026-08-19 afternoon, Thistle hunts Acorn (`401aec`)

> **SUPERSEDED IN PART** by the 2026-08-20 handover section at the foot of this file. Its rulings and
> traps still stand; its state is a day old. Read the newest section first.
>
> **Was current when written.** Supersedes the morning section above wherever the two disagree. Standing doctrine is
> in the sections before both. Written mid-session rather than at stand-down, because comms is
> gitignored and same-day substance should not wait for a closeout that may not come.

## Fleet

- **Director: Peony hunts Nectar (`742fb5`)**, claim `6228d1f1`, seated 07:32Z. Confirm with
  `claims list`; the row's `heartbeat_at` lags because nothing drives it.
- **Liaison: this seat**, claim `f289d350`, role `liaison`, opened 12:46:38Z with an hourly
  self-heartbeat.
- One implementer lane in flight on Cloud-Config DNS. Fleet cap is two seats, so staffed slices
  QUEUE rather than starting together — read a silent slice as queued, not as progress.

## MG's queue — the morning list, trued

Items 1, 2, 4, 5, 6, 7 of the morning section stand unchanged: surfaced, acknowledged, his.
**Do not re-surface, chase, or read his silence as loss.** Two have moved:

- **Item 3 (authenticate the `claude.ai` Cloudflare connector) is WITHDRAWN.** The Cloudflare origin
  rules are in `oaknational/Cloud-Config` as Terraform —
  `infrastructure/cloudflare/rulesets/header_transforms.tf`, resource
  `cloudflare_ruleset.http_request_origin`. The "config is in no repository" record was measured
  against the wrong repository.
- **The Vercel domain is ADDED and off him.** `mcp.thenational.academy` is a domain on
  `poc-oak-open-curriculum-mcp`, added at his word once the IaC question resolved.

**Still owed to him and deliberately waiting:** the R3 error-rate baseline and a `preview` alert rule
to `#mcp-alerts-sentry-preview`, both blocked on MCP-497's noise. Ship them with the reason attached.

## Discharged today — re-asking any of these is a failure of THIS seat

- **`auth.md` and the AI-crawler / content-signals stance: APPROVED** with his condition — _"if that's
  what the ticket asks for and is current best practice"_. The condition is real work, not a
  formality: `auth.md` is a WorkOS convention rather than an RFC. **Verify best practice before
  anything ships; do not re-ask the approval.**
- **The policy half is largely an Oak-Web-Application change**, so the pending `emgeebot-oakenfold`
  install on that repo now has a second consumer.
- **MCP-622's proxied-vs-direct text** is stale text over a discharged decision, on OUR engineering
  project. True it in place; it is not an owner question.
- **The Vercel custom domain is not IaC for our project.** `poc-oak-open-curriculum-mcp` appears in
  zero `.tf` files; every OTHER Oak Vercel project is managed via
  `oak-terraform-modules/modules/vercel_project`. Ours is the sole exception.

## Measured facts worth not re-deriving

```text
/.well-known/oauth-authorization-server        200  RFC 8414, unrewritten Clerk binding
/.well-known/oauth-protected-resource/mcp      200  {"scopes_supported":["email"]}  <- see below
/.well-known/openid-configuration              404  (a DIFFERENT document from RFC 8414)
/auth.md                                       404
robots.txt on www                              200  15 lines, ZERO AI-crawler rules
Link: header on /mcp                           absent
Host: mcp.thenational.academy -> our app       403  "host not allowed" (security.ts:63)
```

- **RFC 9728 is DONE and correct** — path-suffixed per spec and advertised in the 401 challenge.
  Close that bullet; do not staff it.
- **The PRM advertises `email` only, so MCP-618's settled `profile` cure would arrive at nobody.**
  The list is codegen-derived (`mcp-security-policy.ts`, `DEFAULT_AUTH_SCHEME`), so it changes at the
  generator. And adding a scope is NOT safely additive: Clerk accepted `openid` at registration then
  returned `invalid_scope` at authorisation _via redirect_, which our server never sees. Prove
  `profile` with the cookie-deletion method; a synthetic `__client_uat=1` is not equivalent.
- **`ALLOWED_HOSTS` being plural does not mean the new host is IN it.** It is not. Blue/green needs
  the env extended AND a redeploy, because Vercel binds env at build time.
- **A fourth `www` consumer, ours:** `plugins/oak-open-curriculum/.mcp.json` on `main` of the PUBLIC
  repo hardcodes `https://www.thenational.academy/mcp`. It sets a FLOOR on how long `www/mcp` must
  keep serving the protocol — installed copies keep pointing there.

## THE GENERATOR THAT PRODUCED FOUR FAILURES IN ONE DAY

**An absence is never evidence until a presence has been shown by the same instrument.** Four
instances on 2026-08-19, across unrelated surfaces:

1. **MCP-497** — a failure count read as an outage; the success side was never queried.
2. **`get_project(...).domains`** — an absence read as a domain inventory. Broken by a control probe:
   the alpha host was also absent while production demonstrably served through it. The field then
   proved **unstable** — two identical calls returned two and three entries.
3. **An org-wide code search returning zeros** — where the control returned the same error object, so
   the zeros meant "instrument broken", not "nothing there".
4. **`ALLOWED_HOSTS`** — two true properties read as a statement about whether the new host works.

**The cure, because instance 4 passed three seats unchallenged precisely because it was true as
stated: a relayed finding must carry the OBSERVATION, not the INFERENCE.** MCP-307's note should have
stopped at _"`ALLOWED_HOSTS` is plural and independent of `CANONICAL_HOST`"_. The clause _"so the app
can answer on the new host with no code change"_ was a conclusion travelling as a measurement, and it
survived three relays because nobody re-derived it. **A conclusion decays; the evidence does not.**

## Mechanics this seat measured

- **`comms watch` auto-seeds an empty seen-file forward from now**, so a fresh cursor never replays
  history. A 300000ms step deadline is fine; the predecessor's 600000ms advice was fixing the wrong
  variable. The deadline sets how long a wedge SURVIVES, not whether one happens — host contention
  is the variable (load 19.49 when a watcher died, 2.50 when it did not).
- **`assert-watcher-live` can pass off a WEDGED watcher.** Process liveness is not delivery liveness.
  Check `last_drain_at` moving and `emitted_count` advancing in
  `comms-seen/<name>.json.heartbeat.json`.
- **`claims heartbeat` prints `recorded heartbeat on claim <id>` — plain text, no JSON.** A guard that
  greps its stdout for `fresh_until` reports a false alarm. Verify the STORED `heartbeat_at` instead.
- **The F-75 peer-liveness poll is vacuous for this fleet** — every heartbeat-emitting peer retired on
  or before 12 Aug, so the poll can only ever re-report the dead. An ACTIVE seat should therefore run
  the watcher WITHOUT `--exclude-tag heartbeat` rather than pair an empty exclusion with an empty
  poll; the exclusion's justification is reserve-seat economics, which an active seat does not have.
- **A `find -maxdepth 2` worktree-warmth probe misses the Director entirely** — coordination writes
  land at depth 4 under `.agent/state/collaboration/`. A zero from it is instrument scope, not
  silence.

## Later rulings, 2026-08-19 afternoon — all binding, all owner-given

**Do not re-ask any of these.** Two are standing instructions to stop raising a subject at all.

- **`mcp.*` PROCEEDS NOW.** A liaison recommendation to defer the host move past 6 September was put to
  him and **overturned**. Do not re-litigate it.
- **Pingdom `/mcp/healthz` DEFERRED** until `mcp.*` resolves — blocked by MCP-622. This reverses the
  reasoning recorded in MCP-622 §"Consequences while paused". Accepted residual risk, stated to him once:
  no external uptime check across 22–31 August.
- **Debug logs OFF in production**, standard levels only.
- **Oak-Web-Application install: DEFERRED, and he has asked us to stop raising it.** Standing
  instruction. The OWA class stays blocked — `robots.txt`, crawler rules, content signals, `/auth.md` at
  the `www` root. Plan them as blocked-not-dropped. **The write block is NOT a read block: both OWA and
  Oak-AI-Lesson-Assistant are PUBLIC and readable with no installation.**
- **MCP-178: product action, blocked, stop raising it.** Standing instruction. The listing is in the
  `community` tier; the verified tick is gated on fixing a support-docs page. **Claim-limit that follows:
  "verified by 6 September" is not achievable through any engineering action available to us.** That
  limits what may be claimed, not what is built.
- **`auth.md` and the AI-crawler / content-signals stance: APPROVED**, conditional on verifying current
  best practice first. The condition is real work — `auth.md` is a WorkOS convention, not an RFC.
- **Sentry `Test Alert 1` disabled; rule `758827` KEEPS its `Issue resolved` trigger** under monitoring
  (it has never fired, so the monitoring needs a first firing to mean anything).
- **`profile` (name + email) is the top engineering item** at his explicit urgency — MCP-345, Urgent,
  In Progress. `offline_access` is NOT covered by his ruling and stays open.

## Traps this seat measured, afternoon

- **A quota wall can look exactly like a permission wall.** `update_uptime_monitor` on a DISABLED monitor
  returned `400 "You don't have enough pay-as-you-go available to create a new seat"`. Read as
  "no permission" it would have produced a wrong human task; it is exhausted PAYG, and the log reduction
  is the cure. **The monitor also points at the ORIGIN (`curriculum-mcp-alpha…/healthz`), not the public
  path — the wrong side of the routing layer a host move breaks.**
- **The HCP Terraform token has a 30-day life and dies silently.** A bare `unauthorized` from
  `app.terraform.io` means **check the token's age first**. Recovery is `terraform login`, which cannot be
  done by an agent. The refreshed one expires ~18 September.
- **Plan rights are PER-WORKSPACE on that org.** The same token can queue runs on 52 of 101 workspaces
  including `cloudflare-rulesets`, but NOT `cloudflare-misc`. Looks like misconfiguration, not policy.
- **TFC run-history counts can be TARGETED runs.** Two applied runs read `0 add, 1 change, 0 destroy` —
  and carried `Warning: Resource targeting is in effect`, touching only an access group. **No DNS was
  refreshed at all.** The counts looked exactly like the evidence someone was hunting for.
- **The workspace `terraform-version` is floating `latest`** (last run v1.15.8) while the repo pins 1.9.4
  for CI and `required_version` is only a floor. **The version that validates is not the version that
  applies, and the one that applies moves on its own** — over 230 resources on Oak's live DNS zone.
- **An unproxied host is not in Cloudflare's path at all**, so no ruleset can act on it. Proof pair:
  the alpha host returns `server: Vercel` with **no `cf-ray`**; `www` returns `server: cloudflare` with
  `cf-ray` and `cf-cache-status`. This is the answer to "surely the www-scoped rule needs changing now" —
  not while the record is grey, and then it is **ADD a scope, never REPLACE one**, because `www/mcp` must
  keep serving the permanent carousel URLs and every installed plugin client.
- **`ALLOWED_HOSTS` being UNSET is the WORKING state.** Setting it REPLACES the Vercel-derived list rather
  than merging, so `ALLOWED_HOSTS=mcp.thenational.academy` would 403 the alpha host **and `www/mcp` with
  it**. A seat that "fixes" the config by pinning it makes things worse while appearing more precise.
- **`get_project(...).domains` is not a domain inventory and is UNSTABLE** — two identical calls returned
  two and three entries. Use the project-domains endpoint.
- **Directed events cross.** An amendment sent 84 seconds after a staffing event did not reach the seat;
  the staffing report was honestly silent because its author had not read the amendment yet. **Ask whether
  a directed message was absorbed rather than inferring it from a report's silence** — and control-probe
  the zeros before concluding absence.

## The cure that generalises, and it earned its place today

**A relayed finding must carry the OBSERVATION, not the INFERENCE.** MCP-307's note read
_"`ALLOWED_HOSTS` is plural and independent of `CANONICAL_HOST`, so the app can answer on the new host
with no code change"_. Both stated properties are TRUE; the conclusion is FALSE; and it passed three seats
unchallenged **because it was true as stated**. A conclusion decays as it travels; the evidence does not.
Applied to our own output: a config-grounded prediction must be labelled a prediction, never a result.

## Overnight 2026-08-19/20 — the machine slept, and it explains a trap we had misattributed

**State at 01:19Z on 20 Aug, measured not recalled:** `mcp.thenational.academy` still does not resolve;
Cloud-Config #556 `BLOCKED`/`REVIEW_REQUIRED` untouched since 16:41Z; PR #920 (`ALLOWED_HOSTS` made
additive) OPEN, `BLOCKED`, no review decision; **zero comms events since 21:40Z**; the one-page switch
procedure the owner needs for a morning cutover **was never written**. MG has the NOT-READY and the
decision (slip, or spend his first half-hour chasing Terraform plan rights).

**THE DIAGNOSIS THAT REFRAMES A STANDING TRAP: the comms-watch drain "timeout" is the MACHINE SLEEPING,
not host contention.** Evidence from one night:

- a watcher at `--step-timeout-ms 300000` died on a drain deadline;
- re-armed at `600000` on the contention theory, it died the same way;
- the hourly claim self-heartbeat stopped at the same time, twice;
- an independent `security-expert` reviewer seat died mid-session, attributed by the Director to the
  machine sleeping;
- **zero events, zero file writes and zero commits across a 3.5-hour window** in which a live Director
  was demonstrably working before and after.

A wall-clock deadline crossed while the host is asleep is **guaranteed** to fire on wake, at any deadline
value, with any event volume. **So raising the step timeout cannot help and lowering it does not hurt** —
which is why 300s and 600s failed identically. The standing guidance blames contention and cites load
averages; that explains the daytime deaths, **not these.** Keep the deadline SHORT so a wedge dies cheap,
expect deaths across any period the machine may sleep, and treat the mandated post-restart foreground
sweep as the real recovery path rather than the watcher.

**The seat consequence: overnight, the watcher is not an awareness surface at all.** A liaison spanning a
sleep window must sweep in the foreground on waking and must not read a quiet stream as a quiet estate.

**And the liveness consequence, which nearly cost a false escalation:** I reported the Director seat as
"gone dark" on four accurate measurements — cold heartbeat, no coordination writes, no worktree changes,
no commits, absent from the peer list. **They were live and working off the coordination surface.** The
measurements were right and the conclusion overreached. `ping-before-escalate` is what kept it from
reaching the owner as fact — but I had already told him the stronger version, and had to correct it.
**Absent from the coordination surface is not absent from the work; say the first and never the second.**

---

# State at handover — 2026-08-20, Thistle hunts Acorn (`401aec`) → Warbler herds Wingspan

> **CURRENT. Read this first; it supersedes every dated section above where they disagree.** Standing
> doctrine is in the sections before the dated ones and is unchanged.

## Fleet

- **Director: Coal hunts Brilliance (`70bc33`)**, claim `39718d8d`, seated at PDR-064 Moment 2 08:40:54Z
  today. Third Director on this thread in 24 hours (Dormouse → Peony → Coal). **Confirm against
  `claims list`.**
- **No implementers live** at handover, and an owner assignment to staff four is with the Director
  (event `8f487b41`).
- **The Director contradicts you and volunteers its own errors unprompted.** Both Directors today
  withdrew claims on their own initiative. **Invite that actively; it is the mechanism, not their
  diligence.**

## THE BIG THING THAT HAPPENED: the host move is DONE

`mcp.thenational.academy` is live, HTTPS, proxied, and self-describing. MG performed every step himself
this morning with this seat verifying each one:

```text
DNS record          created by targeted terraform apply from the PR branch, state serial 360
ALLOWED_HOSTS       #920 merged, released 1.175.1, deployed, additive (a host cannot evict another)
TLS                 Let's Encrypt, CN=mcp.thenational.academy, valid to 18 Nov 2026
HTTP                301 -> HTTPS (Vercel added it with the cert)
CANONICAL_HOST      mcp.thenational.academy — PRM, AS metadata, all OAuth endpoints self-describe there
proxied = true      cf-ray present; Cloudflare WAF and DDoS now in path
verified            MG connected mcpjam through the proxy; conformant probe returns 401 + correct challenge
www                 STILL serving: protocol 401, carousel 200, healthz 200
```

**Cloud-Config PRs open and under review: #557 (proxied=true) and #558 (WAF block-not-challenge).**
PR 556, the DNS record, is merged.

## Owner rulings today — re-asking any of these is a failure of THIS seat

- **NOTHING in this repo is served from `www`.** One host only. This dissolved MCP-307's per-host
  tension and MCP-517's root cause, and it is why the `www` PRM naming `mcp.*` is correct rather than a
  defect.
- **Anthropic: we have a direct line and will simply tell them the URL changed.** The
  origin-immutability question for their listing is CLOSED — do not investigate it. **OpenAI's rule
  still binds** (host frozen per submission, path free).
- **The carousel URLs are NOT immovable** — he can have the listing updated. Earlier reasoning that
  treated them as permanent is superseded. MCP-639 tests whether they are editable.
- **`mcp.*` proceeded now**, overturning this seat's recommendation to defer past 6 September.
- **Agents may now work in `oaknational/Oak-Web-Application`** — under the owner credential with an
  agent disclosure in the PR body, exactly the Cloud-Config #556/#557/#558 pattern. **The `emgeebot`
  install is still deferred and must not be raised again.**
- **`auth.md` and the AI-crawler / content-signals stance: APPROVED**, conditional on verifying current
  best practice. **That verification is still owed by this seat.**
- **MCP-178 is product-gated; the OWA install is deferred.** Both are standing instructions to stop
  raising the subject.
- **Debug logs off in production.** The Sentry PAYG wall blocks even EDITING uptime monitor `1593267`,
  so MCP-481 cannot complete until the log reduction lands.

## What is waiting on MG

1. **The `www`-pinned client test — the highest-value two minutes available.** Install the Oak plugin
   (its `.mcp.json` on `main` still hardcodes the `www` URL, so it IS a `www`-pinned client), connect it,
   make one authenticated call. `www` now advertises `mcp.*` as its canonical resource, so a pinned
   client meets an RFC 9728 identifier mismatch. **Whether real clients break is untested and only he
   can test it.** It answers the empirical half of MCP-638, MCP-639 and MCP-640 at once.
2. **MCP-517** — his own words on the two tests he ran move it In Review → Done.
3. **MCP-637 namespace** — `thenational.academy/...` versus `io.github.oaknational/...`. Identity, not
   engineering.
4. **MCP-631's server-card bullet** still cites SEP-2127 as guidance; only he or Aakesh can amend that
   text (the OKR-board fence held).
5. **MCP-422's gate** — the server card waits on the MCP extension reaching accepted status. His
   "sharpish" instruction and that gate are in tension; the gate is his to keep or lift.
6. **The advertise-vs-grant ruling** — we advertise `openid`, Oak's Clerk instance grants
   `email offline_access profile`. Advertise-only-what-we-grant is this seat's recommendation.
7. **Two Cloudflare dashboard reads**, both cheap and both load-bearing: the `www/mcp` Security Events
   history (may answer the OWASP question for free), and `Security → WAF → Exceptions` (an exception
   covering the MCP paths would mean the WAF never evaluated our traffic at all).
8. **His pre-existing queue**: OpenAI challenge token, Pingdom on `mcp.*` (now unblocked), Sentry
   billing glance, and the notification follow-up he took himself.

## Traps this seat measured — the expensive ones

- **`rules[0]` in `firewall_managed_rules.tf` is the Cloudflare Managed Ruleset**, on all incoming
  requests, under `ignore_changes` so invisible in code. **Signature-based, so one match acts** —
  a more likely false-positive source than OWASP at paranoia-1. #558 scopes OWASP only and says so.
- **`/mcp/*` is a catch-all** — `/mcp/anything` returns the transport handler's 406 identically to a
  real path, while outside the prefix returns 404. This falsified this seat's own "nothing to migrate
  later" claim about the server card.
- **A Cloudflare rejection never reaches the app**, so Sentry cannot see it and no notification exists.
  Edge-layer failures are invisible to every alerting surface Oak has.
- **The comms concept gate blocks the word "parked"** (indefinite-deferral). Name the gate and the
  decision instead. It also blocks exception-shaped wording like "carve-out".
- **A `terraform apply` can run from an unmerged branch** — CLI-driven workspace, so the working
  directory IS the config. `main`'s contents prove nothing about a record's provenance. This produced a
  false out-of-band-change escalation that nearly reached cloud-ops.
- **`cloudflare-misc` carries live destructive drift** — an untargeted plan proposes 7 destroys
  (Zero Trust access for 18 people) and un-proxying two `educator-api` hosts. **Always target.**
  Cloud-ops know.
- **Machine sleep kills monitors and wedges the comms watcher at any step deadline.** 300000ms and
  600000ms failed identically. Sweep in the foreground on waking; never read a quiet stream as a quiet
  estate.

## The generator, now at seven instances in two days

**A true observation carrying a false conclusion, where the conclusion travels as if it were the
measurement.** Today's: the alpha host being _reachable_ read as _in use_; `main` lacking a record read
as _nothing Terraform did it_; two true `ALLOWED_HOSTS` properties read as _the new host works_; four
accurate liveness measurements read as _the Director is gone_; a proxied host read as _the WAF evaluated
it_; "no cache rule covers it" read as _nothing to migrate_; and ADR-113's doc comment read as a
platform fact.

**The cure, and it is the one thing to carry into the seat: a relayed finding must carry the
OBSERVATION, not the INFERENCE.** A control validates the INSTRUMENT, never the INFERENCE. And when a
peer's four measurements support a conclusion you doubt, ask for the missing premise rather than
accepting or rejecting the conclusion.
