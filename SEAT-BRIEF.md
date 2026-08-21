# Seat brief — Owner Liaison

> Read this first, then run `/oak-start-right-team`. This brief is your per-seat
> context (worktree, branch, role, task, Director). It invokes the skill; it does
> not replace it.

## Who you are

- **Worktree:** the `oak-owner-liaison` sibling worktree (this checkout)
- **Branch:** `chore/owner-liaison`, cut from `origin/main`
- **Role:** `liaison`
- **Thread:** `mcp-submission-drive`
- **Director:** Tulip mends Bark (`e6d535`), claude / claude-opus-5[1m], seated
  2026-08-21 08:23Z at owner word — PDR-064 Moment 2 broadcast under the
  forced-exception path, claim `39718d8d` adopted in place. **Do not trust this
  line over the live registry:** confirm with `claims list` against the PRIMARY
  registry path and read the CURRENT Director from a fresh row. This file has
  three times named a Director generations stale, and it went stale again within
  a day of the last correction.
  (Prior Directors on this thread, for record only: Coal hunts Brilliance
  `70bc33` 2026-08-20, died with the host; Peony hunts Nectar `742fb5`
  2026-08-19 to 2026-08-20 morning; Dormouse turns Footfall
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

---

# State at 2026-08-20 afternoon — Warbler herds Wingspan (`d010b3`)

> **SUPERSEDED IN PART** by the 2026-08-21 section at the foot of this file, which is current. Its traps and
> its seat-boundary correction still stand and are the most load-bearing paragraphs in this file. **But its
> §"THE TWO LIVE DECISIONS WITH MG" is stale in a way a successor will act on: decision 1, the
> `CANONICAL_HOST` revert, was WITHDRAWN by this same seat at 14:59Z the same day after MG caught it with one
> question. Do not re-open it.** Read the newest section first.
>
> Written mid-session, not at stand-down: comms is gitignored, and same-day substance should not wait for a
> closeout that may not come.

## THE SEAT BOUNDARY, RE-DRAWN BY THE OWNER TODAY — read this before you accept any inherited "owed" item

MG, verbatim, 2026-08-20, correcting this seat within the hour of taking it:

> You shouldn't be picking up work -- you should be keeping the board moving, giving me the queue of
> anything needed from me, and ensuring the director is on track

I had said I would pick up the outstanding `auth.md` best-practice verification, which three liaison seats
had handed down as "owed by this seat". **That wording is the trap** — it reads as an assignment when it is a
routing obligation. **Route it to the Director and require one of two answers: staffed, or deliberately not
staffed with the reason. Silence does not close it.** Route even when doing it yourself would be faster;
throughput is not what this seat is for.

**"Ensuring the Director is on track" is an ACTIVE check**, not a relay of their status report: read the board
first-hand, then ask which items they are deliberately not doing. That single question produced three staffed
seats within twenty minutes.

**Also corrected, and it is canonical doctrine I violated anyway:** I used gendered pronouns for the Director
in owner-facing chat. `agents-default-no-gender.md` (PDR-061) names owner-facing chat as the FIRST surface it
governs. **Agents are `they`.** The generator was relay register — quoting a peer's first-person voice at
length let the pronoun come from sentence momentum. When relaying a named seat, the name is the subject and
"they" is the only pronoun; a sentence wanting a singular gendered pronoun is the tell you are carrying a
character instead of a seat.

## Fleet

- **Director: Coal hunts Brilliance (`70bc33`)**, claim `39718d8d`. **Confirm against `claims list`.**
- **FIVE implementer seats live.** They **inherit the Director's identity**, so they are ONE registry row and
  are **not separately addressable** — a captured substrate defect, F-164. Reach them only through the
  Director; a successor re-staffs from their briefs. Both seats sign with a distinguishing suffix because
  that is the only mitigation available.
- **Five is the CAP.** The Director named themselves the bottleneck ("every result funnels through this
  context") and will not add a sixth; new work goes on the tracked block as staffable-not-staffed.
- **This seat: claim `611cba8c`, role `liaison`**, 15-minute self-heartbeat armed (nothing else refreshes it).

## THE TWO LIVE DECISIONS WITH MG, in the order given to him

**1. Revert `CANONICAL_HOST` to `www`.** **A conforming client dialling `www` CANNOT authorise** — measured
with `@modelcontextprotocol/sdk` 1.30.0's own `selectResourceURL()` against the live PRM, with a control, by
two seats independently. The throw is inside `auth()` **before client registration**: a hard discovery
failure, not a scope or token problem. **Every already-installed Claude Code plugin hardcodes the `www`
URL**, so that population is exactly what it hits. Residual: a client supplying a custom
`validateResourceURL` hook bypasses the check, so whether Claude Code's plugin is exempt is the one remaining
unknown.

**The interaction neither seat had priced: reverting makes the `www` address in Anthropic's Section C copy
TRUE again**, cutting the correction owed from three false claims to two. So keeping the new host carries a
reputational cost the revert does not.

**2. MCP-271's seven DCR risk rows.** Its own Definition of Done required decisions _"before or at the DCR
flip on production"_. **The flip is live and not one row is decided.** Row 2's predicted facade bypass is
real: `POST clerk.thenational.academy/oauth/register` answers `400` unauthenticated and direct, control route
`404`s. Consequence: attacker-controlled `client_name` and `logo_uri` render on Oak's branded consent page in
front of every teacher who signs in.

**AND THE EXPOSURE IS UNDETECTED, WHICH CHANGES WHAT ACCEPTING IT MEANS.** No instrument any seat holds can
see that surface — Oak's Cloudflare is the wrong zone, the requests bypass our app by construction (that IS
the bypass), and Clerk's logs are owner-dashboard only.

**Ordering doctrine that produced this sequence, and the Director adopted it: order on SHAPE, not severity.**
MCP-271 is the more serious item; the revert is a two-minute reversible switch removing a regression that
started today. If he has two minutes rather than twenty, the revert is the one that fits.

## THE TRAP THAT NEARLY INVERTED A SECURITY FINDING — carry this one

**A `cf-ray` proves Cloudflare fronts something. It does NOT prove it is YOUR Cloudflare.**

```text
clerk.thenational.academy  server: cloudflare, cf-ray, cf-cache-status: HIT
  CNAME -> frontend-api.clerk.services -> worker.clerkprod-cloudflare.net -> 172.64.153.110, 104.18.34.146
CONTROL www.thenational.academy / mcp.thenational.academy
  no third-party CNAME -> 104.18.6.160, 104.18.7.160   (the same pair: Oak's own proxied records)
```

On header evidence alone you would conclude Oak's Security Events cover the DCR endpoint. **They cover none
of it.** The Director nearly reported the opposite and the CNAME check is the only reason they did not. **The
`www/mcp` Security Events read in MG's queue therefore says nothing about DCR.**

## Facts measured this afternoon, so they are not re-derived

```text
mcp.* and www.* /mcp        401 + WWW-Authenticate -> resource_metadata at mcp.*   both proxied, cf-ray
PRM (both hosts)            resource = mcp.*/mcp,  scopes_supported = ["email"]
AS metadata (ours)          scopes_supported = 7 scopes, BYTE-IDENTICAL to Clerk's own
AS jwks_uri / revocation    clerk.thenational.academy  -> production realm IS live
alpha host /mcp/healthz     200, server: Vercel, NO cf-ray -> not in Cloudflare's path at all
```

- **`www` serves only the RFC 9728 PATH-SUFFIXED PRM form**; the bare path 404s to the marketing site. `mcp`
  serves both. The suffixed form is spec-correct, so this is conformant.
- **Advertise-vs-grant splits into two halves with different costs**, and collapsing them misprices his
  decision: **the PRM is OURS** (generator-side at `DEFAULT_AUTH_SCHEME`, free — and adding `profile` there
  IS MCP-345's cure); **the AS metadata is CLERK'S** and is forwarded unchanged by deliberate design, so
  changing it needs a Clerk change or breaks the transparency ADR-113 rules out.
- **The instance default grant carries NO `openid`** yet both AS documents advertise it. So a
  default-registered client requesting `openid` fails with `invalid_scope` **on a redirect our server never
  sees.** Same shape as the `www` discovery throw: **two silent client-side OAuth failures, neither visible
  to any gate we run, because every gate runs unauthenticated.**

## Discharged or answered today — re-asking these is a failure of THIS seat

- **`auth.md`: the verdict is NO, the owner's condition FAILED.** No client consumes it, its own spec routes
  agents via an AS-metadata block we cannot author, and Oak's existing open-api `auth.md` already does the
  one real job. **The remaining owner question is whether he withdraws an approval already given** — not
  whether to build it.
- **The doctrine contradiction the Director raised ("batched, never a dedicated PR" vs "read from the
  filesystem, not from a merge") is NOT an owner question.** Both hold if the batch rides the coordination
  branch and the **daily fold** lands it on `main`. Measurement: `coordination/2026-08-19-1651ad` is DUE with
  14 unlanded commits (another estate's work). **The missing thing is a fold nobody ran, not a ruling.**
- **`pre-submission` is a POST-submission label** — the connector went on 7 August. So MCP-292/306 are
  verifications of an act taken thirteen days ago, and the irreversible slug is already fixed. **That
  provenance is the owner's verbal account transcribed by an agent, with the submission reference still
  missing: a claim, not a measurement.**
- Board census, trued: **24 `pre-submission` items, 4 Done, 20 open, 12 Urgent open, 11 cold.**

## Waiting on MG beyond the two decisions

Whether the Anthropic Section C copy was **sent** (if so a correction is owed to a named reviewer: retention
says 5 years not twelve months; EU residency is false at 5 EU + 4 US); the four undisposed DCR clients from
5 August plus authorisation for a read-only DCR inventory; the `www`-pinned client test (now answering WHICH
population, not whether); whether `oak-curriculum-app-internal-preview` became Oak's permanent public slug
(irreversible, one look); PR **#913** review and merge; MCP-517's words; MCP-637's namespace; MCP-422's gate;
MCP-631's bullet; and his standing queue (OpenAI token, Pingdom, Sentry billing).

**Deliberately NOT in his queue:** MCP-644 (we implement MCP `2025-11-25`; current is `2026-07-28` and
`server/discover` is absent against a 197-hit control — real, but no decision available in his window, so it
goes to his return); the Linear description-`patch` normaliser defect (it silently dropped `~~` markers, so
never rely on strikethrough alone in Linear and diff the whole stored field after any patch); and MCP-143's
Guard 2 stranded on branch `pr5` with no PR — **ours to cure under his own retention ruling, not his to rule
on.**

## The generator, and it claimed me too

**A relayed finding must carry the OBSERVATION, not the INFERENCE.** I did it within the hour: I passed the
Director's sound, control-probed Clerk finding to MG as _"achievable at the generator with no Clerk dashboard
change"_, dropping the boundary of what it licensed. **The measurement was theirs and correct; the relay was
the lossy step.** The same-day routing rule got it to him fast and got it to him wrong — **speed of routing
makes the observation-versus-inference check MORE load-bearing, not less.**

---

# State at 2026-08-21 morning — Phoenix guards Scorch (`85bdbf`)

> **SUPERSEDED by the handover section at the foot of this file, written at this seat's close.** Its
> measurements and generators stand; its "what is open" is a day stale. Read the foot first.
>
> Originally: **CURRENT. Supersedes every dated section above where they disagree.** Standing doctrine is unchanged.
> Written at session open rather than at stand-down, because the seat above it died mid-afternoon with no
> stand-down and 6.5 hours of substance went with it. **Everything in §"The window nobody landed" below was
> recovered from the gitignored comms stream on this machine. It exists nowhere else.**

## THE MACHINE DIED, AND THAT IS THE WHOLE EXPLANATION — do not diagnose a fleet collapse

Two seats stopped at once and neither wrapped. **The host went down.** `uptime` reported `up 17 mins` at
08:21Z the next morning; the Director's last heartbeat was `20:23:19Z` and the liaison's `20:46:12Z`, both
ordinary beats with ordinary work in flight. The last comms event in the whole stream is `19:29:51Z`.

**Neither seat retired. Neither stood down. Neither failed.** Absent, stale and retired are three different
states, and this is the fourth shape: **killed from outside.** A successor reading two stale rows and an
eight-hour-silent stream will reach for a collapse story; the correct read is a power event.

**And the loss was near-total for anything not committed.** What survived: everything in git. What did not:
the comms stream is gitignored, so the only reason the afternoon is in this file at all is that a successor
swept it before writing. **This is the second consecutive day the same exposure has cost this seat.** Land
substance the hour it happens; a closeout you plan to write is not a record.

**Verified at pickup, and it is the reassuring half: no work was lost.** All 24 worktrees scanned — every one
clean except the PRIMARY, which holds only `napkin.md` modified plus two untracked-by-design paths. Seat B's
~5,100-deletion teardown, held uncommitted at 19:04Z with an explicit loss warning against it, **was committed
and pushed as #928 before the host died.**

## The window nobody landed — 2026-08-20, 14:08Z to 20:46Z

`SEAT-BRIEF.md`'s previous section was committed at 14:08Z. These are the events after it.

### The `CANONICAL_HOST` revert was WITHDRAWN at 14:59Z — the section above records it as live

MG killed it with one question (`CANONICAL_HOST revert???`) plus one ruling. **Disposition (b): keep the new
host, and `www`-pinned conforming clients must re-point.** The reasoning that matters, because it is the part
that generalises:

```text
NOW      CANONICAL_HOST = mcp.*      PRM.resource = mcp.*/mcp
  client dials mcp.*/mcp   -> resource matches            OK
  client dials www/mcp     -> RFC 9728 mismatch, throws   BROKEN  (installed legacy plugins)

REVERTED CANONICAL_HOST = www        PRM.resource = www/mcp
  client dials www/mcp     -> resource matches            OK      (legacy plugins fixed)
  client dials mcp.*/mcp   -> RFC 9728 mismatch, throws   BROKEN  (the canonical advertised host)
```

**The revert does not defer the mismatch, it inverts which population it breaks** — onto the host we publicise
and whose third-party verification is this drive's acceptance bar. Two seats priced it as "the reversible
option" and neither said so. **A reversible action is not therefore a cheap one; reversibility says nothing
about the cost while it is in force.**

### Five owner rulings, all binding, none of them to be re-asked

- **`www/mcp` HTML is Oak-Web-Application's. This repo serves no landing page there and needs nothing to do
  with it.** ("owa will serve html 'landing page' at www/mcp ... this repo needs nothing to do with it")
- **Carousel images ship from BOTH hosts for now.** ("let's add them in OWA so that they're in both places for
  now.") **He did not pick between the options put to him — he chose both**, which dissolves an unverifiable
  external contract instead of betting on it. The better answer than either offered.
- **`www/mcp` loses every association with this repo.** ("Let's just get rid of www/mcp as ANYTHING to do with
  this repo ... it's only causing headaches.") **Scope is wider than the `/mcp` prefix** — both `.well-known`
  documents are served from `www` and are NOT under `/mcp`, so a `/mcp*`-scoped edit leaves the job silently
  half-done.
- **No redirects, no signposting, no phased cutover.** ("No, no one has used www/mcp in earnest yet so we dont
  need to handle redirects or signposting", and "Frankly i don't care about breaking it at the moment, the
  blast radius is very low right now.")
- **An agent each, a PR each, for the teardown.** ("Great -- have the director send an agent each to create PRs
  for each of those.")

### The teardown, as he scoped it: `mcp.thenational.academy` becomes ONLY the MCP server

**Stays, because it IS the server:** `/mcp` (protocol), both `.well-known` discovery documents, `/oauth/*`,
`/mcp/healthz`. **Goes:** the landing-page surface, `public/carousel/` and its `ROUTED_ASSET_BASE` mount, the
`www` origin rules. **The carousel sentinel is RETARGETED at OWA's `www` URLs, never deleted** — it is the only
guard on an external contract Anthropic holds, and the guard must outlive the asset's move.

**The engineering objection that was raised rather than silently complied with, and it is doctrine:** deleting
the carousel assets while the sentinel still pins `/mcp/carousel/...` lands a red tree whose own documentation
says the correct response to a red sentinel is to STOP, not to update the fixture. **His "I don't care about
breaking it" is about the SERVED SURFACE, not about landing red on `main`.** Those are different things, and
an instruction about one is not consent for the other.

### A whole class of question we cannot answer, and the ticket that fixes it

**No instrument we hold can say which host a request arrived on.** Measured: PostHog's MCP events
(`$mcp_initialize`, `$mcp_tool_call`, `$mcp_tools_list`, `$mcp_resource_read`) are all live and none carries a
hostname, origin or URL property; `oak_client_surface` has exactly one value, `"other"`. Sentry cannot either —
`sendDefaultPii` is unset and headers pass through the redaction barrier.

**So the host migration was performed with no instrument for "is anyone still on the old host".** That question
recurs at the `www` removal, at any future move, and at any audit of the cutover. **Add the served host to the
MCP analytics properties** — it is our own emitter, it is cheap, and it converts a class of unanswerable
question into a query. It also carries the empirical half of MCP-638/639/640, which is why those three should
not hold it.

## THE FOUR OWNER-GATED ITEMS, as they stand at 2026-08-21 — the Director put them; this seat holds them

Ordered on **shape, not severity** — what fits the time he has, not what is most serious.

1. **The portal question, thirty seconds.** In the Anthropic submission portal, what host is recorded for the
   server URL and for the three carousel image URLs — `www.thenational.academy` or `mcp.thenational.academy`?
   **No agent can read the portal.** If `mcp.` on both, the carousel deletion here is safe once OWA deploys and
   there is no pinned-client exposure at all. If `www` on either, deleting `public/carousel/` breaks the
   published listing permanently no matter what OWA does — our copy is the origin for BOTH host URLs and OWA's
   is shadowed by the edge rule — and the installed base is pinned to a host now advertising a PRM that names a
   different resource.
2. **Cloud-Config #558 — merge and apply, one click, his own PR.** #557 is applied, so `mcp.` is proxied and
   inside a zone-wide OWASP ruleset (`expression = "true"`, Inbound Anomaly Score `managed_challenge` at
   threshold 40). **An MCP client cannot solve a browser interstitial.** State it as
   conditional-and-unmeasured — two Directors deliberately declined to trip the WAF to prove it — the point is
   that the fix costs a click either way.
3. **Two OWA reviews: #4453 (carousel plus both guards) and #4443 (the landing page).** The whole merge chain
   waits on them: #4453 must merge AND deploy before Cloud-Config #561 may apply, and #561 is the single act
   that unveils both OWA surfaces at once. Reviews are constitutively his under the identity doctrine.
4. **The ADR-219 / MCP-349 coupled decision — one decision, two consequences.** `curriculum-mcp-alpha.oaknational.dev`
   is unproxied (`server: Vercel`, no `cf-ray`, against proxied controls). That falsifies ADR-219's
   every-served-domain premise, on which the CodeQL `js/missing-rate-limiting` dismissals rest; and it makes
   MCP-349's prescribed evidence method unrunnable as written, because it asks for Cloudflare Security Analytics
   on a host not in Cloudflare's path. **Recommendation: proxy the alpha** — one change discharges both records
   instead of leaving a permanent exception plus an evidence method needing a rewrite. **Falsifier: if the alpha
   is deliberately unproxied for a reason nobody wrote down, proxying breaks that path and the exception is
   correct.** No such reason found in the record.

## THE FINDING THAT MOVED THE CHAIN: three PRs nobody had ever been asked to review

```text
OWA #4453  OPEN  REVIEW_REQUIRED  mergeStateStatus BEHIND    reviewRequests = NONE
OWA #4443  OPEN  REVIEW_REQUIRED  mergeStateStatus BEHIND    reviewRequests = NONE
CC  #561   OPEN  REVIEW_REQUIRED  mergeStateStatus BLOCKED   reviewRequests = [Cloud Ops]   (a team, no individual)
CC  #558   OPEN  REVIEW_REQUIRED  mergeStateStatus BEHIND    reviewRequests = [Cloud Ops]
CC  #556   MERGED  APPROVED
```

**`review-requested:mantagen` open across ALL of `oaknational` returns 10, and not one of the three is in it.**
Control: the instrument works — it returns #928, #927 and #913 in this repo plus seven older PRs across four
other repos, and the same instrument returned 32 for all-open here.

**This is not the "answered and never re-requested" failure mode. It is simpler: nobody was ever asked.** Two
green PRs, days old, in no human's filter, with the entire merge chain behind them. `Cloud Ops` is a team
assignment — the same automatic-not-a-human-act reading a predecessor control-probed on `jimCresswell`.

**And all three are `BEHIND` or `BLOCKED`**, so a review request without an update-against-`main` first hands
him a PR that cannot merge. **Sequence the update ahead of the ask.**

## THE GENERATOR THIS SEAT PRODUCED IN ITS FIRST HOUR

**A discharged gate discharges its own question, not the adjacent one it resembles.**

I read MG's ruling — _"no one has used www/mcp in earnest yet"_ — as also settling whether installed clients
are pinned to `www`, and told the Director to drop that item. **The Director corrected it and was right.** The
ruling is about a URL people use; the pinning question is about what a client dials, and **a client dials
whatever was recorded when it was installed, whether or not any human ever typed the URL.** Two different
objects, one of which he had answered.

**The cure the correction found is better than either framing:** the pinning question and the carousel question
are the same fact from two directions — what host string is in the portal — so it is ONE item, and no test is
needed. **When a discharge feels like it covers more than it was asked, look for the object it actually names.**

**Same family as the standing relay generator** (a relayed finding must carry the OBSERVATION, not the
INFERENCE), now at eight instances across three days: I carried "the population is empty" forward as if it
settled "which host is pinned". A conclusion decays; the evidence does not.

## Mechanics measured this morning

- **`claims heartbeat` requires `--now <iso>`** — it is not optional. Omitting it exits 2 with
  `missing required option --now`. A predecessor's note listing the flags as `--active --claim-id --now`
  reads as three optional flags; the third is mandatory. **Verify by reading the STORED `heartbeat_at`,** never
  the CLI's stdout — it prints plain text (`recorded heartbeat on claim <id>`) with no JSON and no `fresh_until`.
- **`claims list` takes `--active <path>` and REJECTS `--platform`/`--model`**, unlike its siblings. Do not fill
  documented args by analogy in either direction.
- **A queue audit inherits the scope of its search.** The previous Director audited this repo's 16
  `CHANGES_REQUESTED` PRs to a sound zero and was blind to three cross-repo PRs nobody had ever been asked to
  review. Neither instrument was wrong; each was blind where it did not look. **"The queue is N" is only ever
  true of the surfaces queried** — the same shape as the `cf-ray` zone trap.
- **A `reviewDecision` of `CHANGES_REQUESTED` is sticky** until a new review lands. #913 is cured at `9ba0d1972`
  and re-requested and still reads that way. Do not re-cure on the strength of the field.
- **The comms watcher's cursor auto-seeds forward from now**, so a fresh seat replays nothing. **Sweep the gap
  in the foreground before trusting the stream** — everything in this section came from that sweep, not from
  the watcher.
- **Delivery liveness was verified with a real non-self event**, not a process assert: the incoming Director's
  08:23:20Z broadcast rendered on the watcher. A green `assert-watcher-live` alone can pass a wedged watcher.

## Fleet at 08:30Z

- **Director: Tulip mends Bark (`e6d535`)**, claim `39718d8d` adopted in place, PDR-064 Moment 2 posted under
  the forced-exception path (no Moment 1 exists — Coal died with the host). Working the four uncured blocking
  review findings on #921, #922, #923, #924, then re-staffing the five dead implementer briefs.
- **Liaison: this seat**, claim `611cba8c` adopted in place, 43-minute self-heartbeat, all-channels watcher with
  no tag exclusion.
- **No implementer seats live.** All five died with the host; all five briefs survive and are being re-staffed.
- **MG is in BOTH terminals.** He seated the Director in the primary checkout and this seat here, minutes apart.
  The channel question was put to him rather than negotiated between two agents — his attention is his to
  allocate. Until he rules, the Director answers him when he types there and relays verbatim; this seat holds
  the queue as the record.
- **Every worktree that pre-dates PR #927 still carries an `origin/main` upstream.** #927 fixes new spawns only.
  Run `git branch --unset-upstream` before the first push in any re-entered worktree — three occurrences across
  sessions, and one nearly pushed a 5,000-line teardown onto `main`.

## Owner rulings 2026-08-21 — binding, re-asking any of these is a failure of THIS seat

### `Oak-Web-Application#4450` (llms.txt, MCP-348): a curation review, not a rejection

MG, verbatim, routed to the Director for their agents at his explicit word:

> The existing Oak Open API homepage is appropriate: current llms.txt v2 guidance says software
> documentation—especially API references and tutorials—is a primary use case. OpenAI, Anthropic and Gemini
> likewise link to Markdown API documentation from their official llms.txt files.
>
> I would request one small revision to PR #4450:
>
> - Keep the Open API homepage, MCP entry and ecosystem repository.
> - Replace the JSON Agent Skills index link with the directly useful Oak OpenAPI SKILL.md.
> - Remove the RFC 9727 API catalogue, or move it to ## Optional.
>
> RFC 9727 defines the catalogue for automated API discovery. It is machine-readable, but that does not
> automatically make it an LLM-friendly discovery surface. The llms.txt guidance prefers concise Markdown
> content that an agent can consume directly. The catalogue and Agent Skills index are valid adjacent
> machine/agent discovery surfaces; linking their raw JSON from the primary list is defensible, but weaker
> than linking the actual Markdown skill.
>
> So: Open API yes; raw catalogue/index as primary LLM links, probably no. This is a clarity/curation change
> rather than a fundamental flaw in the PR.

**His argument is measured, not stylistic, and I verified it before relaying:** both links he demotes serve
JSON, the one he promotes serves Markdown an agent reads directly.

```text
index.json  skills[0].url = /.well-known/agent-skills/oak-openapi/SKILL.md
GET  …/.well-known/agent-skills/oak-openapi/SKILL.md   200  text/markdown  2382 bytes  name: oak-openapi
GET  …/.well-known/api-catalog                          200  application/linkset+json; profile="…rfc9727"
```

**He authorised BOTH dispositions for the catalogue — remove, or move to `## Optional`.** The file already
carries a populated `## Optional` section, so moving costs nothing. The implementing seat picks one and states
which in the PR description. **Routing that choice back to him would be re-asking a discharged gate.**

The MCP entry he wants kept sits in `## AI Tools`; the other three lines share `## API & Developers`.

### The queue as delivered to him this morning, in the order he received it

1. **The portal question** — server URL and the three carousel image URLs: `www` or `mcp.`?
2. **Raise the Claude Code monthly overage limit** at `claude.ai/admin-settings/claude-code`. The automated
   reviewer has been dark since 2026-08-19: #921, #922, #923 and #924 each carry a `claude` `COMMENTED` review
   whose whole body is the spend-limit skip notice. **A review row exists and says nothing** — so any count of
   reviewer coverage reads those four as reviewed. The same limit killed a working seat mid-task on 20 Aug
   holding ~5,100 uncommitted deletions. **Ignore the notice's "reopen this pull request" instruction:** a
   fresh push triggers the reviewer, and four seats are pushing to those PRs anyway.
3. **#4453 is under his review as of 08:47Z** — link 1 of the chain. **#4443 beside it, never review-requested
   from any human since 17 Aug.**
4. **A question, not an ask: may we update `Cloud-Config#558` against `main`?** It is his own PR and `BEHIND`.
   Updating an owner's in-flight terraform branch unasked is the class of act the OWA authorisation gets
   withdrawn over, so it was put as a question.
5. **ADR-219 / MCP-349, the coupled decision** — recommendation proxy the alpha, with the falsifier attached.

### `#4453`'s red cross is Percy and it blocks nothing — verified independently before relaying

```text
required_status_checks.contexts on OWA main:
  SonarCloud Code Analysis · Pa11y · lint, check types · terraform-lint-format · test, Sonar
  ALL FIVE SUCCESS on #4453
percy/oak-web-application                                    ERROR      <- not in the required set
Percy (GitHub Actions leg)                                   SUCCESS
Manual status: Percy (Preview – oak-web-application-website) SUCCESS
control across recent open OWA PRs: #4450 ERROR  #4448 ERROR  #4452 SUCCESS  #4446 SUCCESS
```

**The workflow that runs Percy passes; the Percy service status errors.** A succeeding workflow whose published
service status errors is a broken reporting path, not a broken build. So `mergeStateStatus=BLOCKED` on #4453
means exactly `REVIEW_REQUIRED`. **Not claimed:** why Percy errors, or whether it hides a real visual regression
in OWA. Deliberately not ticketed in a foreign repo on his last day.

**Consequence for the record:** the older note that #4443 had "4 visual changes needing review" may have been
this same condition rather than genuine pending approvals. Unconfirmed — treat as unknown, not as cleared.

### THE CLASS THIS THREAD KEEPS PAYING FOR, now named

**An instrument returning a TRUE value that answers a DIFFERENT question.** Three unrelated surfaces in two
days, each one nearly inverting a conclusion:

- **`cf-ray`** proves Cloudflare fronts something, not that it is YOUR Cloudflare. The Clerk host chains out to
  a Clerk-operated worker, so Oak's Security Events cover none of the DCR surface.
- **A review row** proves a reviewer object exists, not that anything was reviewed. Four spend-limit skip
  notices counted as reviews, across two vendors — the napkin note naming Codex as well as `claude` is the
  second independent observation.
- **`author=mantagen`** proves the credential used, not who authored the work. Every agent in OWA and
  Cloud-Config commits under the owner credential by design, so authorship cannot separate our PRs from his.
  **Creation time against the staffing record is the live instrument.** This one nearly had us update the
  owner's own branch unasked.

**The cure is not vigilance, it is naming what the instrument measures before reading it as an answer.**

**And it retro-opens a closed audit:** the 2026-08-20 finding that 15 of 16 `CHANGES_REQUESTED` PRs show "no
push since review" was read as _the ball is with the author_. If some of those reviews are skip notices rather
than findings, it may instead mean **nobody reviewed the PR at all** — a different and worse queue state.
**Do not inherit "the answer is ZERO" as the whole truth.** Not re-run on 21 Aug because curing four live
findings was worth more; recorded as open rather than settled.

## THE STRUCTURAL FINDING OF 2026-08-21 — the owner's re-request instruction cannot work in foreign repos

**His standing instruction of 2026-08-17** — answering a review is not enough, emgeebot MUST re-request from
`mantagen` or the PR never re-enters his `review-requested:` filter — **is INOPERABLE in `Oak-Web-Application`
and `Cloud-Config`, by construction. Not by oversight.**

```text
POST /repos/oaknational/Oak-Web-Application/pulls/4443/requested_reviewers  reviewers[]=mantagen
  -> 422  "Review cannot be requested from pull request author."
CONTROL, same endpoint, same moment, non-author reviewer
  -> 200  reviewer added
authors: OWA #4443 mantagen · OWA #4450 mantagen · Cloud-Config #561 mantagen
```

**Every agent PR in those two repos is authored as `mantagen`, because emgeebot has no installation there. GitHub
refuses to make an author a reviewer of their own pull request. Therefore MG can never appear in
`reviewRequests` on any of them, and `review-requested:mantagen` can structurally never contain them.**

**This DISSOLVES this seat's own morning finding into something better.** I measured that #4453, #4443 and #4450
carried no review request and read it as _nobody was ever asked_ — a real gap in diligence. **It was an
impossibility, not a lapse.** The two readings have opposite cures: "we forgot" is cured by remembering, and
"GitHub refuses" is cured only by a different mechanism. **Reading it as a lapse would have produced a discipline
fix for a problem discipline cannot reach.**

**The route that works was demonstrated by neither seat's design:** `johnrobeds` approved OWA#4453 at 08:47Z and
it merged ten minutes later. A colleague who is neither the author nor an agent.

**So "complete" needs a foreign-repo clause.** Cured, pushed, up to date with `main`, and **in a named human's
filter** — where in THIS repo that means re-requested from `mantagen`, and in a foreign repo it means requested
from a **non-author colleague** AND listed to him by this seat, because his filter cannot see it.

**The structural root is the deferred emgeebot install on those repos, which is his standing closed subject.**
Recorded as the consequence of a ruling he has already made, NOT as a re-ask: while we author under his
credential there, his own filter discipline cannot reach those repos. **Do not reopen it; do not present the
consequence as a reason to.**

**An ordering belief this also killed.** This seat told him #4450 needed updating against `main` before it was
worth his attention. Wrong: #4453 went `BEHIND` again within the hour as eight commits landed, and **merged
anyway.** `BEHIND` is one command at the merge button and blocks neither review nor approval. **The load-bearing
act was always getting a non-author reviewer requested.**

## A CONTROL PROBE THAT MUTATED A REAL SYSTEM — disclosed, because the seat that did it disclosed it

Proving the 422 above, the Director requested `orangemug` on OWA#4450 as the control. **The 422 alone already
established the finding; the control was not needed, and it notified a colleague.** A control probe that changes
the world is not a probe, it is an action.

**The discipline that generalises: before running a control, ask whether the negative result already settles it.**
A refusal is self-proving — the endpoint demonstrably parsed and rejected. The control adds confidence only about
the instrument, which the refusal's own specificity already gave.

`orangemug` is defensible on the merits — he left three of the unresolved threads on #4443 — **but he was not
chosen on them, and the record says so rather than dressing the side effect up as method.**

## Linear's description-`patch` normaliser: the real mechanism, replacing the `~~` note

The record said the normaliser "silently dropped `~~` markers". **Measured twice in one write on MCP-345: it
re-splits emphasis that SPANS a code span, at the code-span boundary.**

```text
written  **`openid` is nonetheless excluded, and that exclusion STILL STANDS.**
stored   `openid` **is nonetheless excluded, and that exclusion STILL STANDS.**
written  **Do not read this correction as authorisation to add `openid`.**
stored   **Do not read this correction as authorisation to add** `openid`**.**
```

**Both benign — nothing dropped, meaning intact. And it explains the `~~` case: strikethrough spanning a code
span is re-split too, and `~~` has no valid split form, so the marker is discarded rather than moved.** One
defect, two outcomes.

**The sharper rule: never let emphasis span a code span in Linear markdown.** Write it wholly inside or wholly
outside. **Still diff the entire stored field after any patch** — that is the only reason this mutation is known
to be benign rather than assumed to be.

## THE CLASS, AT SIX INSTANCES IN ONE DAY — an instrument returning a TRUE value that answers a DIFFERENT question

1. **`cf-ray`** — proves Cloudflare fronts something, not that it is YOUR Cloudflare.
2. **A review row** — proves a reviewer object exists, not that anything was reviewed. Four spend-limit skip
   notices, two vendors.
3. **`author=mantagen`** — proves the credential used, not who authored. Nearly updated the owner's own branch.
4. **The comms `author` field** — proves the routing identity, not the author. Under F-164 a seat's broadcast
   wears its Director's name; this seat nearly wrote a seat's observation into the permanent record as the
   Director's. **What stopped it was asking for wording instead of paraphrasing a peer into a permanent record;
   the Director's refusal of the credit was the second check, not the first. Neither is a mechanism — the suffix
   convention lives in prose, which no reader is obliged to check.** Paired defect: the identity field is
   `author`, not `agent_id` — two seats independently read `agent_id`, got a uniform empty result, and one
   nearly reported it as a negative. **Control: all 1,722 events older than 2026-08-20T14:00Z carry `author` and
   none carries `agent_id`, so there was never a migration. We were both simply wrong** — a cleaner record than
   "the schema changed", because it removes a cutover a future seat would go looking for.
5. **A `Production` deployment row** — proves Vercel deployed a SHA, not that a path returns bytes.
6. **`reviewRequests: []`** — proves the author is not in their own review-request list, not that nobody was
   asked. The sharpest of the six, because the true reading and the false one have opposite cures.

**The cure is not vigilance. It is naming what the instrument measures before reading it as an answer.**

**And a seventh shape, from the same day: an instrument that CANNOT discriminate.** The Vercel production URL
returned `302` for present files and for a nonexistent control alike — deployment protection. **Reported as a
failed measurement rather than as weak evidence**, which is the class's cure working as designed. A probe with no
discriminating power has no weak reading; it has no reading.

## Also true at 2026-08-21 09:40Z

- **OWA#4453 MERGED** 08:57:07Z, merge commit `3c36d57d74e3`, approved by `johnrobeds` — **a human colleague who
  is neither the owner nor an agent, which is live evidence the delegation route works.**
- **OWA#4454 up**, the logo rebuild: one commit, 17 paths blob-identical to the old tip, both logo paths absent
  from every commit's full tree, control returning both at `815bcacaccfb` so the probe is not blind. **Claims no
  erasure:** `refs/pull/4443/head` keeps the blobs reachable, a force-push would not have changed that, and the
  GitHub Support purge is a separate owner decision. **Three old-branch commits touched the logo paths, not two**
  — added, modified, removed.
- **Old-branch deletion is deferred to his word.** His local `~/webdev/oak/owa` sits on it at `36bfa64f50`.
- **`git worktree add -b <branch> origin/main` sets the upstream to `origin/main` in a FOREIGN repo too.** PR
  #927 fixed the `agent-tools spawn` path only. **Fourth occurrence of this mechanism across sessions and repos,
  every one caught by a seat noticing.** It wants a wrapper or a rule, not another watch-item.
- **MCP-345 corrected on our board** — the disproven Clerk mechanism out of title and banner, the exclusion
  explicitly still standing as Oak's policy choice, and `offline_access` explicitly NOT settled: only one of the
  probe's three rows discriminates whether Clerk adds it or this instance grants it.
- **Six of this drive's PRs are in his filter on the day he leaves** — #913, #921, #922, #923, #924, #929, all
  mergeable, all documentation. **Recommendation given: hold them for his return.** None is on the path to the
  Anthropic verdict, and the knowledge is safe in git either way.
- **Two Director-state commits are committed LOCALLY and deliberately UNPUSHED** on `docs/mcp-warden-closeout-review-request-gate`
  (`368eea8ec`, `1a6083942`, worktree `oak-warden-closeout-gate`), because pushing would invalidate #913's
  verified re-request. **They survive a context death and a reboot; they do not survive disk loss. The reason for
  holding expires when he leaves.**

## Cloud-Config #561: a TARGETED apply IS warranted — the answer to his 2026-08-21 question

**He asked: "have an agent run plan on … #561 and let me know if we need a targeted apply or not". The answer is YES, and the reason is a finding rather than a technicality.**

```text
Plan: 0 to add, 3 to change, 0 to destroy.
  ~ cloudflare_ruleset.http_request_cache_settings    #561
  ~ cloudflare_ruleset.http_request_origin            #561
  ~ cloudflare_ruleset.http_ratelimit                 NOT #561 — out-of-band dashboard drift
```

**All three are `~ update in-place`. Replace, destroy and `-/+`: NONE — explicitly checked and stated as a fact
rather than left as an absence.** No `must be replaced`, `forces replacement` or `will be destroyed` anywhere in
either log; the `-` markers are nested `rules { }` removals inside in-place updates. **So the live origin ruleset
is edited, not rebuilt.**

**The third resource is DASHBOARD DRIFT, not merged-but-unapplied code** — a different and more interesting thing
than the `#558` hypothesis the tripwire was watching for:

```text
cloudflare_ruleset.http_ratelimit would LOSE one rule:
  description "Downloads api"  enabled = false  action = block
  20 requests / 60s, mitigation_timeout 86400
  expression: concat(http.host, http.request.uri.path) wildcard "*/api/downloads/lesson/*"
  last_updated 2026-03-25
```

**Two measurements establish it is drift and not code:** a `grep` across all git history for `"Downloads api"`
returns nothing — it has never been in the configuration, and it is a DIFFERENT rule from the codified
`"Downloads API limit"` in `rate_limits.tf`, which is unaffected. And no commit has touched `rulesets/` on
`origin/main` since 2026-08-01, so none since the last apply on 2026-08-04. Terraform's refresh phase names the
mechanism outright: `Drift detected (update)`.

**So someone created a disabled rate-limit rule in the Cloudflare dashboard on 25 March and never codified it,
and an UNTARGETED APPLY WOULD SILENTLY DELETE IT.** It is `enabled = false`, so there is **no live-traffic
consequence** — but parked configuration is deliberate, and disposing of it is a decision in its own right, not
a side effect of a routing removal.

**The invocation, verified by running it as a plan-only run rather than described** — it yields exactly
`0 to add, 2 to change, 0 to destroy` with only #561's two resources:

```bash
cd infrastructure/cloudflare/rulesets
terraform apply \
  -target=cloudflare_ruleset.http_request_cache_settings \
  -target=cloudflare_ruleset.http_request_origin
```

**The tail that matters: the drift SURVIVES a targeted apply and reappears in every future plan of this
workspace until someone codifies or deletes the "Downloads api" rule.** It will ambush whoever next runs an
untargeted apply. Separate follow-up, not part of #561.

**#558 is ABSENT from the plan, exactly as the tripwire predicted.** Nothing merged that we believed had not.
Also: `cloudflare_ruleset.http_request_firewall_custom` showed `Drift detected (update)` in refresh but produced
NO planned action, so that drift now matches config — do not read the refresh line as a second finding.

### The plan-only gate was structural, not careful

Settings read from the Terraform Cloud API **before** anything was queued: `auto-apply=False`,
`auto-apply-run-trigger=False`, `execution-mode=remote`, `vcs-repo=null` (CLI-driven), `locked=False`. Then the
control fact, which is the one that matters:

```text
run-Nx4zRV32FotzKohc   planned_and_finished   plan-only=True   is-confirmable=False
run-3z34jdrWcZcaeqNC   planned_and_finished   plan-only=True   is-confirmable=False
```

**`is-confirmable: false` means neither run COULD be applied.** `-input=false` throughout, so no prompt was
answerable even in principle, and `terraform apply` was never run. **The difference between "I was careful" and
"it was structurally impossible", and the second is what a seat should produce when the cost of being wrong is
an unintended change to a production edge.**

**Why this gate existed at all: the instruction "plan only, no apply" is TRUE as written and answers a different
question against a remote backend.** `terraform plan` here queues a run in Oak's Terraform Cloud rather than
computing locally, so a seat could obey the instruction literally and still trigger an apply if auto-apply were
on. **This is the day's class arriving in a DIRECTIVE rather than an instrument** — the liaison wrote the intent,
the Director gated the mechanism, and only the second is safe.

### FOR HIM, and it is not the answer to his question

**The Terraform Cloud token on this machine is his own PERSONAL USER TOKEN** — username `mg-oak`, bound to the
owner's own Oak account, `is-service-account: False`. **So both plan runs are attributed to HIM in Oak's
infrastructure audit log.** Nothing improper happened and the runs were unconfirmable. **But an agent has
created two entries in an infrastructure audit trail under his personal identity, and he should be told rather
than discover it.** Same pattern as the `mantagen`-authored PRs in the foreign repos, on a surface where the
audit trail is the whole point.

**And it settles the rights question honestly rather than favourably: plan rights exist AS HIM, not as an agent
identity. The inherited "no agent holds plan rights" record is neither confirmed nor refuted — it was untested
and remains so.**

### Two adjacent findings, neither owner-gated

- **`.gitignore:173-174` has the tfplan rule COMMENTED OUT** — `# example: *tfplan*` — so `*.tfplan` is not
  ignored, and two such files in his working tree sit one `git add -A` from a public repository. **At 86 bytes
  each against a cloud backend they are almost certainly remote-run pointer stubs rather than value-bearing
  plans, so this is not escalated as an exposure.** The gitignore gap is the curable thing, and it is a one-line
  change to a file nobody is mid-editing. **His files were left unread, unmoved and undeleted.**
- **`git clone --branch` is a clean route past the `worktree add` footgun** — it set upstream to the lane's own
  ref, not `origin/main`. The footgun did not fire. **Worth adding to F-167's candidate cures: the defect is
  specific to `worktree add`, and cloning sidesteps it entirely.** The seat also declined `git worktree prune`
  on a dead worktree registration, because pruning writes to the owner's repo metadata — the same boundary as
  declining to update his branch.

## THE `www` MIGRATION IS DONE — Cloud-Config #561 applied 2026-08-21 by the owner

**He applied the targeted plan himself after two independent plan runs agreed.** Verified immediately afterwards
by this seat, and independently by an implementer seat minutes later:

```text
www/mcp · /.well-known/oauth-protected-resource/mcp · /.well-known/oauth-authorization-server
        · /oauth/register · /mcp/healthz          ALL 404 text/html   <- off this repo entirely
www/mcp/carousel/_1,_2,_3.png   200 image/png, digests EXACT MATCH    <- OWA is the origin now
CONTROL _4.png   406 application/json (our accept-gate)  ->  404 text/html (OWA's own 404)
mcp.*   PRM 200 (resource=mcp.*/mcp) · AS 200 · POST /oauth/register 400
        · GET /oauth/authorize 307 -> clerk.thenational.academy · POST /mcp 401 + challenge · healthz 200
mcp.*   cf-cache-status DYNAMIC on both discovery docs and healthz
```

**The `406 → 404` on the control is the load-bearing measurement, not the three 200s.** Images still loading
proves nothing about which origin served them; the control's shape changing from our transport's accept-gate to
OWA's Next.js 404 is what proves the origin changed hands.

**A fact the plan revealed that had only been inferred: `www/mcp` was routed to
`curriculum-mcp-alpha.oaknational.dev`** — the removed rule's `host_header` and `origin.host` were both that
alias. So the host S1 established is a production domain of the production Vercel project was also serving
`www` all along.

**No cache-bypass rule is needed on `mcp.*`, measured rather than assumed.** All four paths return
`cf-cache-status: DYNAMIC` with no rule in place — the app sets its own `no-store` / `max-age=0` headers and
these paths carry no cacheable extension. **Residual worth a low-priority ticket, not a blocker:** the two
discovery documents send `public, max-age=0, must-revalidate` rather than `no-store`, so they are uncached by
Cloudflare's default rather than by prohibition.

## OWNER RULING: go forward with #558 AS WRITTEN. Do not re-raise the divergence.

**He was told the divergence explicitly and decided anyway. Re-raising it is a failure of this seat.**

`Cloud-Config#558` was authored 2026-08-20T12:01Z, **before** his security brief of 2026-08-21, and diverges
from that brief in two measurable places:

```text
#558 sets   action = "block"        his brief said LOG ONLY for a couple of weeks
#558 sets   score_threshold = 40    his brief said a HIGH threshold — and Cloudflare LABELS 60 "Low", 25 "High",
                                    so his words mean the NUMBER 60
#558 sets   paranoia-level-1 only   MATCHES his brief
```

**His ruling, verbatim, 2026-08-21:** _"i think i will tweak config after my holiday -- let's go forward with
this for now"_.

**And #558 is a net improvement on the same population rather than a deferral** — this is the framing to carry,
because "it does not cure the curriculum blocking" is true and misleading:

```text
today       curriculum-shaped payload -> managed_challenge at 40 (zone-wide)
              a non-browser client cannot solve it, so it presents as a HUNG CONNECTION
              and Cloudflare's rejection never reaches the app, so nothing surfaces it
after #558  same payload -> block at 40 (mcp.* only) -> a clean 403 the client can report
```

**Accepted residual, stated to him once:** for the ~9 days of his absence, a teacher asking the MCP app about
SQL injection or path traversal gets a legible 403 rather than an answer. Bounded — plain SQL, `SELECT *` and
`<script>` all pass; what trips it is the tautology-plus-comment exploit form and path-traversal metacharacter
clusters.

**Two gaps #558 does not close, and the PR must say so or it reads as complete coverage:**

- **The Cloudflare Managed Ruleset** (`rules[0]`, signature-based, under `ignore_changes`, invisible to that
  repo) is untouched and is the likely actor on the measured blocks. **Changing the OWASP score action does not
  necessarily change what blocks.**
- **Scoping to `http.host eq "mcp.thenational.academy"` leaves the alpha alias with nothing.** Different zone,
  production domain, and an XSS-shaped path reaches the application there that the WAF blocks on `mcp.*`. **He
  has ruled not to touch that endpoint, so this is a stated residual, not a task.**

**Resolved in #558's favour by the migration:** the earlier "covers one of two live front doors" caveat is gone.
After #561, `mcp.*` is the only front door for the protocol.

**Still blocking #558 mechanically, and both are his:** the branch is `BEHIND` and it is HIS, so nobody rebases
it without his word; and it needs one approving review from a colleague, because he authored it and cannot
approve his own PR. **Merge before apply this time** — #557 and #561 are both applied-while-open, and `main`
declaring one thing while the edge does another twice over stops being an incident.

## His priority ordering, 2026-08-21 afternoon

1. **Teardown follow-ups, as PRs.** Carousel deletion + its `ROUTED_ASSET_BASE` mount + the loopback sentinel as
   ONE atomic PR (the sentinel is **deleted, not retargeted** — OWA's required jest guard from #4453 now holds
   that external contract, and every test tier here is in-process loopback so no test here can probe a live
   host). Plus MCP-651's allowlist, the six docs still calling the landing page live, the four topology
   comments, and the ADR-217 / ADR-122 governance acts.
2. **The security work on `mcp.*`** — #558.
3. **Everything else waits for his return**, on his instruction: the nine held documentation PRs, MCP-653, the
   GitHub Support purge decision on #4443's history, and the old-branch deletion.

---

# HANDOVER at seat close — 2026-08-21 16:00Z, Phoenix guards Scorch (`85bdbf`)

> **CURRENT. Supersedes every dated section above where they disagree.** Standing doctrine at the top of this
> file is unchanged. Written at close, with the whole day behind it rather than mid-session.

## Read this first: the drive's shape changed today

**The `www` → `mcp.*` migration is DONE.** That was the open engineering question every earlier section in this
file is organised around, and it is closed. `www.thenational.academy` serves nothing from this repo. The owner
applied the routing removal himself and it is verified from both sides.

**So a successor's job is no longer "get the host moved". It is: the security posture on the new host, and the
review queue.**

## FLEET AND SEAT STATE

- **Director: Tulip mends Bark (`e6d535`)**, claim `39718d8d`. **Confirm against `claims list` — this line has
  gone stale within a day, three times.**
- **Nine implementer seats ran and all retired.** R1–R7 (review cures, plugin repoint, logo rebuild), S1–S3
  (security reviews and the WAF recommendation), C1 (the changelog sweep), D1–D2 (teardown follow-ups), T1 (the
  terraform plans). None live at close.
- **This seat: claim `611cba8c`, closed at wrap.** Branch `chore/owner-liaison`, draft PR **#900**, remote at
  `9008b3138`, `0 0` ahead/behind, clean tree.
- **The thread record `mcp-submission-drive.next-session.md` is the DIRECTOR's surface**, actively maintained,
  and it is on `origin/main` rather than this branch. **Do not write it from this seat** — read it, and let the
  Director own it. This file is the liaison's continuity home.

## WHAT THE OWNER IS PICKING UP ON RETURN — he is away until ~1 September

**His own ordering, given at close.** The handover document he will forward is
`MCP handover — 21 August, ahead of a week away` on the `MCP App: First Major Release` project.

1. **The Clerk OAuth client list** — one look, and it sets the severity of the token-binding finding.
2. **Rebuild the WAF rule**, then log-only for a fortnight with internal testers before enforcing.
3. **MCP-653** — the refresh removes two tools from a submitted connector. Product call, not a merge.
4. **The review queue** and the WAF threshold tuning.

**Standing instruction from him, still live: do not batch anything MG-needing.** Route the same day. And the
close instruction he gave at ~13:00Z: **do not message him until the PRs are in a stable state** — that
condition was met at 15:20Z and reported, so it is discharged, not standing.

## OWNER RULINGS TODAY — binding. Re-asking any of these is a failure of THIS seat.

- **Anthropic's listing has `mcp.*/mcp` as the server URL and that is FINAL.** Image URLs are repointable in
  their dashboard, which is what dissolved the carousel gate.
- **`www/mcp` may 404 until OWA's landing page deploys**, which will happen before any marketplace push.
- **Go forward with `Cloud-Config#558` as written; config tuning after his leave.** He was shown the divergence
  from his own log-only/threshold-60 brief and decided anyway. **Do not re-raise it.**
- **Do not touch `curriculum-mcp-alpha.oaknational.dev`.** "not relevant to the release any more." **Note the
  premise moved after he ruled** — S1 established it is a production domain of the production Vercel project
  with a live WAF bypass into production. He was told; the ruling stands.
- **The 87 registered OAuth clients need no action from him.** He said so explicitly when the list was surfaced.
- **`orangemug` stands as reviewer** on OWA #4450 and #4454.

## THE ONE THING THAT FAILED, AND WHY IT MATTERS BEYOND ITSELF

**`Cloud-Config#558` merged, and its apply was REJECTED by Cloudflare: error `20014`, "more than one rule is
trying to execute the same managed ruleset".** Two `execute` rules against the same OWASP Core ruleset — one
`eq mcp`, one `ne mcp` — is not a permitted structure. Reverted as `Cloud-Config#562`, awaiting review.

**Nothing landed.** Verified three ways: the apply's own counters all `None`, `/probe.sql` still 403 on both
hosts with a benign control at 404, and the MCP surface healthy. **Cloudflare rejects the ruleset PATCH
atomically.**

**Two consequences a successor must carry:**

1. **`PR #934`'s recommendation is unapplicable as written** — it keeps the same two-rule structure and changes
   only `block → log` and `40 → 60`. **Its measurement design (day-zero gate, weekly control probe, the
   fourteen-day criteria) is the valuable part and survives.** Say which half is dead when you route it.
2. **For Cloudflare rulesets, a green `terraform plan` is NOT evidence the apply will succeed.** The plan
   validates HCL and diffs state; it never asks the platform whether the shape is permitted. **The constraint
   was documented and readable at authoring time, and two security reviews of that PR assessed what the rule
   would DO rather than whether it could EXIST.** That is the review gap, and `verify-vendor-call-shapes-at-plan-author-time`
   is the rule that would have caught it.

## MECHANICS THIS SEAT MEASURED — the expensive ones

- **`terraform plan`/`apply` against a Terraform Cloud backend QUEUES A RUN in Oak's organisation.** It does not
  compute locally. So "plan only, no apply" as an instruction is not a mechanism gate — a seat can obey it
  literally and still trigger an apply if auto-apply is on. **Establish `auto-apply=False` and confirm the run
  returns `is-confirmable: false` BEFORE queueing.** That is the difference between "I was careful" and "it was
  structurally impossible".
- **The TFC credential on this machine is the OWNER'S PERSONAL TOKEN** (`mg-oak`, `is-service-account: False`).
  Every run an agent queues is attributed to him in Oak's infrastructure audit log. **Disclose it; do not apply
  under it without explicit per-act authorisation.**
- **`latest-change-at` on a TFC workspace moves on an ATTEMPTED apply, not only a successful one.** It moved at
  14:47:50 on the failed #558 apply. I had used it as a positive control earlier in the day; it would have
  misled me here.
- **Two workspaces, not one.** `infrastructure/cloudflare/rulesets/` is workspace `cloudflare-rulesets`;
  `infrastructure/cloudflare/misc/` is `cloudflare-misc`. A plan in one cannot see the other's changes. The
  owner's four merged PRs spanned both.
- **A stale zero-byte `index.lock` and genuine transient contention BOTH occurred today, hours apart.** Check
  age, size and holder before believing either story. The stale one was 2h22m old with no holder; git's own
  advice to remove it was correct once that was established.
- **`recordStagedBundle` applies a fingerprint with NO emptiness check.** A failed `git add` left an empty index
  and the queue recorded a fingerprint of nothing. **Assert `git diff --staged` is non-empty before
  `record-staged`.** F-169 narrows the consequence: `verify-staged` would still have failed, so the defect is a
  false attestation in shared coordination state rather than a gate bypass.
- **`claims heartbeat` requires `--now`; `claims list` rejects `--platform`/`--model`; `claims close` requires
  `--summary`.** Three siblings, three different arg contracts.
- **`gh pr list` has no `mergeStateStatus` field** (it is a `pr view` field), and **zsh does not word-split an
  unquoted `$VAR`** — both cost a silent empty result rather than an error.

## THE FAILURE CLASS THIS DAY WAS MADE OF — seven instruments plus two variants

**An instrument returning a TRUE value that answers a DIFFERENT question.** Every instance was measured:

1. **`cf-ray`** — proves Cloudflare fronts something, not that it is Oak's Cloudflare.
2. **A review row** — proves a reviewer object exists, not that anything was reviewed. Four spend-limit skip
   notices, two vendors.
3. **`author=mantagen`** — proves the credential, not the author. Every agent PR in the foreign repos is his.
4. **The comms `author` field** — proves the routing identity, not the author. Under F-164 a seat's broadcast
   wears its Director's name. **Paired defect: the field is `author`, not `agent_id`, and all 1,722 older events
   confirm there was never a migration — we were simply both wrong.**
5. **A `Production` deployment row** — proves a SHA deployed, not that a path returns bytes.
6. **`reviewRequests: []`** — proves the author is not in their own review-request list, not that nobody was
   asked. **GitHub refuses to make an author a reviewer, so the owner's re-request discipline is INOPERABLE in
   OWA and Cloud-Config while we author under his credential.**
7. **A 404 from `/branches/main/protection`** — proves classic protection is absent, not that the branch is
   unprotected. This repo uses RULESETS. **A trigger built on that 404 would have reported a red board as
   stable, vacuously.**

**Variant A — an instrument that cannot discriminate at all.** A Vercel URL returned 302 for present and absent
files alike. **The honest output is "failed measurement", not weak evidence.**

**Variant B — an AUTHORITY over-extended.** An owner's words relayed as a work item without testing the
technical premise inside them. His teardown list said "delete `public/carousel/` and its `ROUTED_ASSET_BASE`
mount"; the mount is not carousel-specific and #928 keeps it and adds assertions. **A ruling is authoritative
about INTENT and is not evidence about the CODEBASE. Deference to the first must not extend silently to the
second.** Seven liaison relays carried that premise unchecked.

**The cure is not vigilance. It is naming what the instrument measures before reading it as an answer.**

## AND THE ONE THAT IS ABOUT THE SEAT ITSELF

**Getting the routing right is not the same as getting the question right, and the second failure is invisible
from inside the first.** This seat spent the morning routing a portal question to the owner: measured, framed as
one fact with two consequences, put first because it was cheapest. **It should never have been on his queue.**
Its whole force was permanence, and the images were always repointable. **Ask what makes an unanswerable
external fact BINDING before asking what its VALUE is** — reversibility, not identity, usually decides whether
it is a gate. That retires owner items outright instead of routing them well.

## OPEN, AND WHO HOLDS IT

- **17 fleet PRs green and awaiting review** in this repo; OWA #4443/#4450/#4454 and Cloud-Config #562 stable.
  Nothing blocked on anything but a reviewer.
- **#761 is `DIRTY`** — MCP-143 PR-3, opened 4 August. Its required checks physically cannot run until someone
  rebases it, so it is neither red nor green but unknowable. **The Director recommends CLOSE with its substance
  re-ticketed**, on three grounds: its premise partly moved (`CANONICAL_HOST` is set, the host move is done), it
  cannot be assessed, and alive it becomes a permanent by-name exception in every stability check. **Owner call,
  after his return.**
- **Dependabot #893/#894 cannot merge** — they bump `codeql-action` to 4.37.7 which breaks CodeQL, and CodeQL is
  in this repo's required set. Not ours; nothing records that they must not merge.
- **MCP-651, MCP-652, MCP-653** minted by this seat. **MCP-345 corrected** — its title and banner asserted a
  disproven Clerk mechanism while the exclusion decision stands.
- **Two Linear documents** this seat authored, both on `MCP App: First Major Release`: the changelog-tools
  explainer and the owner's handover.

## WHAT EXISTS ONLY IN THE GITIGNORED COMMS STREAM

**Roughly sixty directed events between this seat and the Director**, carrying the correction-and-counter-
correction that produced most of the findings above. **The rulings and the measurements are in tracked state;
the arguments are not.** Two seats each caught the other in a wrong conclusion repeatedly, and the value was in
the exchange rather than either seat's output. **A successor gets the conclusions and not the reasoning, and
that gap is real and unhandled.**
