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

**The constraint that actually governs scheduling** (owner, 2026-08-13): MG's
effective availability ends **20 August**. He is away the following week and
busy the week he returns. So the operative question for anything dated after
20 Aug is not "is it before 6 Sept" but **"does it need MG personally, and can
that dependency be removed or pulled inside the window?"** Re-dating without
answering that produces schedule pressure without reducing risk.

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
  Milestones re-dated 2026-08-13 and re-cut against the 20 Aug edge.
- **Tickets minted this drive**: MCP-593 (per-user credentials), MCP-594
  (harness attribution), MCP-595 (carousel), MCP-596 (web-app lane gap),
  MCP-597 (monitor disabled), MCP-599 (standing sign-off criteria).
  MCP-598 exists as a **duplicate of MCP-445** — the Sentry-identifier question
  already had a home.
- **Failure-mode doctrine**: `patterns/observer-must-see-the-terminal-state.md`
  (new); recurrence recorded on `patterns/turbo-cache-false-green.md`; three
  classes in the napkin.
- **Formation letter**: `.agent/experience/2026-08-13-wildfire-holds-quench-*`.
- **Owner-liaison seat**: reconstitutes from `SEAT-BRIEF.md` on
  `chore/owner-liaison` (`e24629a93`).

## State at wrap, 2026-08-17 (Tuna holds Ballast, `a2ce03`) — READ THIS FIRST

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

## Next safe steps

1. **Two billing limits** — the highest-leverage items, both minutes of admin,
   both gating the only automated watchers that function across MG's absence:
   Claude Code overage (automated PR review is dead org-wide) and Sentry PAYG
   (monitor 1593267 cannot be enabled).
2. **Rotate the GitHub PAT** visible in plaintext in the process list.
3. **MCP-597**: after the billing unblock, re-point monitor 1593267 to
   `https://www.thenational.academy/mcp/healthz` — **bare form, no trailing
   slash** (the slash form routes through Clerk; identical bodies, so a
   status-code assertion cannot tell them apart) — enable it, and **prove checks
   ran from the history**, never from the config field.
4. **MCP-458** is down to one human act: confirm the prompt is not visible in
   the three carousel images. Format, width, naming, placement and byte
   integrity are discharged.
5. **M6's milestone description still says "EU data residency" and is false**
   (MCP-470: 5 EU + 4 US, owner-chosen). Offered to the owner; not yet fixed.

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
