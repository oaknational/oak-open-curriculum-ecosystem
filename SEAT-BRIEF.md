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

# State at handover — 2026-08-19, Raven turns Nocturne (`0aad1a`)

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
