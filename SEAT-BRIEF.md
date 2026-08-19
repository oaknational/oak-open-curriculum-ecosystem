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
