---
id: codex-live-acceptance-seat
node_type: delivery
name: "A live Codex seat runs the whole team journey"
overview: "The Codex membership programme's proof: a live Codex seat joins a team session and runs the whole team journey unsupervised, from start-right to handover, with each step's evidence recorded and every gap routed to a node."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: codex-queue-wake-bridge
    kind: blocking
  - plan: codex-pretooluse-guard-parity
    kind: blocking
owner_gates: []
last_updated: 2026-10-02
---

# A live Codex seat runs the whole team journey

## Goal

A Codex seat joins a live team session and runs the whole team journey without supervision.
Each step leaves evidence a reviewer can check. What the run cannot do becomes a routed gap,
not a caveat. This is the Codex membership programme's proof under `agent-platform-citizenship`,
whose bet is that "First-class citizenship is behavioural, not a count of matching files".

## Why this step, and why this shape

- **The bet is behavioural, so the proof is a run.** The programme's other nodes each close one
  measured gap: wake (`codex-queue-wake-bridge`) and guard parity
  (`codex-pretooluse-guard-parity`). Only a whole journey shows whether the gaps that remain are
  the ones the concept exploration named.
- **The day's evidence is partial.** On 2026-09-24 two Codex seats worked as members. They held
  identity, comms, claims, heartbeats, a pairing channel, bot pushes, bot pull requests, TDD cures
  under full gates, and a merge through the door (PR 193). They did not run the journey end to end,
  unprompted, and they stalled whenever they were idle.
- **The co-owner's seat runs it.** The Director named Luna stirs Radiance's seat to run the live
  acceptance journey (2026-09-24, about 15:35Z).

## The journey

Each step is checked by the evidence named for it.

1. **Start right.** Identity from the seat's own seed, a registration and a claim through the
   team start skill. Before registering, the seat compares its `SessionStart` identity with
   `identity preflight`. A missing `PRACTICE_AGENT_SESSION_ID_CODEX` is recorded as found, not
   read as a failed identity by itself. Evidence: both identity readings, the registration event
   and the claim id.
2. **Stay awake.** The all-channels watcher, the heartbeat, and a wake on a directed event while
   idle, with no prompt. The watcher covers canonical comms only. So the seat also runs one sweep
   of the surfaces the team rule leaves to separate reads: the file-only pairing and standards
   channels, the active claims and the commit queue. Evidence: the event id, the queue time and
   the reply's event id, and the sweep's record.
3. **Be refused.** A command the policy denies, such as a commit to `main`, is refused by the
   guard. Evidence: the hook's recorded outcome.
4. **Deliver.** One small, owner-approved change by TDD, under full gates, pushed through
   `merge-bot push`, with a bot pull request. Evidence: the commits and the pull request.
   The push runs with no permission prompt (pull request 241's condition 5, the Director,
   2026-09-25); pull request 255's no-prompt bot landing is the first datum (2026-09-26), and a
   prompt on the live run is the landing toolkit's first cure.
5. **Settle.** Its review legs are read, findings are dispositioned, and the pull request merges
   through the door. Evidence: the door's verdict and the merge-landed event.
6. **Hand over.** Continuity written, claims closed or handed over, heartbeat-end posted, every
   process closed. This step runs in a dedicated, disposable team session, never in a co-owned
   working session. Evidence: the handover record and the process table.

## Acceptance criteria (each with a proof — required)

- **Every step of the journey passes on a live seat.** Proof: `owner-held`, a dated run record
  on the then-latest CLI, with each step's evidence as named above. The owner, or a seat at the
  owner's word, observes it.
- **Every step that fails becomes a routed gap.** A failed step has a delivery node or a named
  owner and sensor before the run record closes. Proof: `repo-safe`, the run record's gap table,
  each row pointing at its node.

## Todos

1. **The run script.** Write the journey above as a checklist the observing seat follows. It
   takes its steps from the team start skill, the collaboration rules and the citizenship plan,
   and needs no Codex-specific shortcut.
2. **The run.** After both sibling nodes land, the co-owner's seat runs the journey on the
   then-latest CLI, in a dedicated, disposable team session. The run record names its host.
3. **The gaps.** Route every failed step, then return the programme's status to the owner.

## Out of scope

- Building any missing capability during the run. A gap is routed, never patched live.
- Invocation mode, the Codex dialogues instrument.
- Other platforms' membership.

## Review dispositions

- **2026-09-24, Luna stirs Radiance (01a0d3), the co-owner** (the pairing channel, 16:43:00Z).
  Accepted and folded in:
  - Step 1 compares the `SessionStart` identity with `identity preflight` before registering,
    which also tests the absent `PRACTICE_AGENT_SESSION_ID_CODEX` without treating it as a
    failure by itself.
  - Step 2 records one sweep of the file-only surfaces the watcher does not cover.
  - Step 6, and the run, use a dedicated, disposable team session.
