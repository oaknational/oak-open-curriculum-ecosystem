---
pdr_kind: governance
---

# PDR-082: n=2 Collaboration Mode (Lightweight Protocol for Two-Agent Teams)

**Status**: Proposed (first draft)
**Date**: 2026-05-25
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(agent identity tuple — still required at n=2);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement — protocol-shape unchanged at n=2);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator handoff two moments — inert at n=2 unless coordinator
role is explicitly opt-in);
[PDR-078](PDR-078-liveness-heartbeat-contract.md)
(liveness-heartbeat contract — the protocol this PDR scopes for
n=2 reduction);
[`start-right-team` SKILL](../../skills/start-right-team/SKILL-CANONICAL.md)
(team-bootstrap workflow — the SKILL this PDR amends scope for);
`feedback_coordinator_role_threshold` user-memory
(coordinator role expected default at ≥4 agents; n=2 mode generalises
the principle to the full team-bootstrap protocol).

## Context

The `start-right-team` SKILL + PDR-078 heartbeat contract were
designed to scale across multi-agent rotating-cast sessions, where
silent retirement detection, coordinator-less-window prevention,
gate-singleton coordination, and the
comms-stream-as-canonical-truth principle are real failure modes
worth structural cure.

The protocol's overhead is non-linear in team size. At n ≥ 4 with
rotating cast, the heartbeat-cron + all-channels-watcher +
team-cadence-message-sweep + directed-event-for-cross-agent-coord
substrate is justified by the failure modes it prevents. At n = 2 in
a single owner-visible session, the substrate becomes pure
overhead: heartbeats add no information the owner cannot see
directly in chat, directed events between two agents duplicate
chat-relayable coordination, and substantive broadcasts mostly
duplicate what the owner sees in chat.

Observation surface (first instance, 2026-05-25 session):

- A 2-agent session (Stormy Surfing Dock `2a7b65` + Fiery Kindling
  Brazier `9f4026`) preparing PR 115 for merge generated:
  - Heartbeats at 4-min cadence per agent = ~30 heartbeat events
    per hour combined for liveness signal the owner could observe
    directly in chat.
  - Multiple verdict-standby / amendment-review-standby heartbeats
    carrying no new information, each consuming an owner-visible
    task-notification slot.
  - Owner explicitly flagged: "the comms appear to be causing a
    MASSIVE overhead, is that true?" — confirmed substantively
    true at n=2.

The failure modes the full protocol prevents do not all apply at
n=2:

- **Coordinator-less window (PDR-064)**: no coordinator role at
  n=2 unless explicitly opted in. No window to cure.
- **Silent retirement detection (PDR-078)**: at n=2 both agents
  are visible in the same owner-chat surface; retirement is owner-
  observable directly.
- **Gate-singleton coordination (SKILL §1a)**: relevant only if
  both agents would otherwise contend for `pnpm check`; resolved
  by explicit owner direction at session-open ("Fiery is Commit
  Marshal") with no need for elaborate coordination ceremony.
- **Comms-as-canonical-truth (PDR-066)**: relevant at scale; at
  n=2 the owner-chat IS the canonical truth surface.

The principle generalises a pattern user-memory has already named
for the coordinator role specifically: peer collaboration is the
default for ≤ 3 agents, coordinator role becomes the expected
default at ≥ 4 agents (`feedback_coordinator_role_threshold`). This
PDR extends the same scale-sensitivity to the full team-bootstrap
protocol.

## Decision

Define an **n=2 collaboration mode** with a reduced protocol
surface. The mode activates when the team has exactly two active
participants both visible in the same owner-chat surface (or one
chat-relayed via the owner). It exits to full SKILL protocol when
a third agent joins, or terminates when both agents close out.

### What stays at n=2

The following substrate is retained because its value is
independent of team size:

| Substrate | Why retained |
|---|---|
| Identity preflight (`start-right-quick` foundation) | Identity tuple discipline (PDR-027) applies at every n. |
| All-channels comms watcher | The only out-of-chat channel for cross-agent signals (tree-green, push-landed, gate-state). |
| Claim opening on substantive source / doctrine edits | Durable substrate; audit trail; conflict-prevention with peer claims if a third joins. |
| Commit-queue intents for marshal coordination | Marshal commit-window discipline; explicit-pathspec staging. |
| Substantive cross-agent broadcasts | Tree-green, push-landed, gate-state, merge-ready, blocker. Required because they carry information the owner-chat does not. |
| Mid-cycle retirement protocol (PDR-063) | Still applies if either agent retires mid-cycle; the handoff-record substrate is independent of n. |
| Final-heartbeat-end + team-member closeout broadcasts | Closeout signal still useful for explicit completion. |

### What drops at n=2

The following substrate is dropped because its value at n=2 is
below the overhead cost:

| Substrate | Why dropped |
|---|---|
| Heartbeat cron (both agents) | Liveness is owner-visible in chat. |
| Periodic heartbeat broadcasts | Same as above. |
| Standby-state heartbeat broadcasts (`verdict-standby`, `amendment-review-standby`, etc.) | No information beyond chat-visible state. |
| Directed events between the two agents | Chat-relay via the owner is equally efficient and visible. |
| Team-cadence 120s message-sweep | Owner-chat IS the cadence; agent responds when owner directs. |
| Multi-section team-start ceremony | A single concise registration broadcast suffices; owner already sees both agents start. |

### What changes at n=2

- **Liveness ≡ owner-chat responsiveness.** The heartbeat substrate
  is replaced by the agent's chat responsiveness. An agent silent
  in chat is presumed unavailable; the owner observes directly.
- **Coordination surface ≡ owner-chat + minimal comms events.**
  Cross-agent gates (tree-green, push-landed, gate-state) remain on
  comms. Substantive owner-class direction (verdict surfacing,
  approval, scope changes) flows via chat directly.
- **Cross-agent acknowledgement ≡ chat-relay or single observed
  event.** Two-event ack-pairs collapse to one event (or zero, if
  the owner relays).

### Trigger / exit

**Activates when**:

- Team has exactly two active participants, AND
- Both are visible in the same owner-chat surface (or one chat-relayed
  via the owner), AND
- No expected third-agent join is in scope for this session.

**Exits when**:

- A third agent joins (full SKILL protocol re-activates immediately —
  the joining agent runs full team-start; existing agents restart
  heartbeat cron + watcher if previously stopped), OR
- Both agents close out and the session ends.

### Accepted failure modes (with mitigation)

- **Loss of automated retirement detection** — owner sees in chat
  directly; mitigated by chat-visibility, accepted as low-probability
  failure in 2-agent owner-visible context.
- **Loss of comms-stream-as-canonical-truth at this session scale**
  — owner-chat becomes canonical for the 2-agent session; comms
  retains canonical role for cross-session and N>2 sessions. Valid
  trade-off scoped to the n=2 mode only.
- **Delayed propagation of substantive substrate** — durable
  substrate (claims, commits, closed-claims, ADR/PDR/plan files)
  remains comms-substrate-bearing; chat-relay covers transient
  coordination only.

## Rationale

**Why a mode rather than a flag.** A flag on the existing SKILL
would invite drift between the flag's named drop-set and the actual
behaviour of each agent at runtime. A mode with explicit
activation/exit triggers + a named drop-set + a named retain-set
is auditable and refusable: an agent can self-check "am I in n=2
mode?" against the triggers, and the owner can call the mode in or
out explicitly.

**Why activation is conjunctive on team-size AND chat-visibility.**
A 2-agent team where the agents cannot see each other through the
owner-chat would lose the liveness-replacement substrate that
makes n=2 mode safe. Both conditions must hold for the dropped
substrate to be safely replaceable.

**Why a third agent triggers immediate full-protocol re-entry.**
At n=3 the chat-visibility-as-liveness substrate degrades: not all
three agents may be visible in the same chat surface; rotating
cast becomes possible; coordinator-class needs may surface. The
full SKILL protocol must reactivate atomically rather than
gradually, to prevent the half-loaded-protocol failure mode (some
agents heartbeating, others not, no shared substrate to coordinate
on).

**Why the marshal-singleton survives n=2.** Even at two agents,
only one agent should run `pnpm check` at a time to avoid commit-
window contention. The marshal-singleton is owner-directed at
session-open ("Fiery is Commit Marshal") and remains in effect;
n=2 mode does not relax this.

## Consequences

### Required

- The `start-right-team` SKILL gains an n=2 mode section
  documenting the trigger, drop-set, retain-set, and exit. The
  SKILL becomes the operational entry point; this PDR is the
  doctrine source.
- Agents who detect n=2 conditions at session-open may declare
  n=2 mode in their team-start broadcast (single broadcast suffices)
  and skip the heartbeat-cron-start step.
- An agent already running the full protocol may drop to n=2 mode
  mid-session on owner direction or on observed team-size collapse
  to n=2; the agent cancels their heartbeat cron + announces the
  mode shift in one final broadcast, then operates under n=2 rules.

### Forbidden

- Dropping retained substrate (cross-agent broadcasts for tree-green
  / push-landed / gate-state / merge-ready / blocker; claim opening;
  commit-queue intents). These remain mandatory at n=2.
- Treating chat-visibility as a substitute for cross-agent gate
  signals. Tree-green, push-landed, gate-state events are substrate
  precisely because they carry information chat does not.
- Activating n=2 mode without verifying both activation conditions
  (team-size AND chat-visibility).

### Accepted Cost

- Discrete mode-switching adds protocol surface area (n=2 mode is a
  distinct shape from the full protocol). The cost is the
  documentation + agent-self-check overhead; the benefit is the
  removed runtime overhead at n=2 sessions.
- One PDR + one SKILL amendment + one user-memory cross-reference
  to land the mode formally.

## Falsifiability (PDR-026)

This first draft asserts:

1. **Heartbeat overhead is disproportionate at n=2.** Falsifiable
   by: a second n=2 session that operates the full protocol
   without owner complaint OR observable overhead cost. If the
   first-instance observation does not replicate, the mode is
   premature optimisation.

2. **Chat-visibility safely replaces liveness substrate at n=2.**
   Falsifiable by: an n=2 session under n=2 mode where one agent
   becomes silently unresponsive and the owner does not observe
   the silence in chat, causing a coordination failure. If this
   happens, the chat-visibility-as-liveness substitution is
   insufficient.

3. **Third-agent join can re-activate full protocol atomically.**
   Falsifiable by: a 2→3 transition under n=2 mode where the
   re-activation produces a half-loaded-protocol state (e.g.,
   two agents in n=2 mode, third in full protocol, missing
   coordination). If this happens, the activation/exit triggers
   need refinement.

Second-instance evidence path:

- A second n=2 session that activates the mode cleanly + completes
  without coordination failure → mode validated, candidate for
  Adopted.
- A second n=2 session that surfaces a new overhead vector or
  failure mode → mode refined, remains Proposed.
- Three n=2 sessions, all clean → mode candidate for Accepted
  (with SKILL amendment landing the operational details).

## Open questions deferred to second instance + SKILL amendment

1. Should n=2 mode also relax the team-start broadcast itself
   (e.g., to a directed event to the existing agent + owner-chat
   declaration), or is a single concise broadcast still the
   canonical entry?
2. Does n=2 mode imply a different commit-queue cadence (e.g.,
   shorter TTL because contention is impossible at n=2)?
3. How does n=2 mode interact with the curator lane (PDR-081)
   when one of the two agents is a curator? Curator work crosses
   sessions and may need the full substrate even in a 2-agent
   session.
4. Should the mode be named the **default** at n=2, or remain
   opt-in? First draft proposes activation-on-trigger (effectively
   default) rather than opt-in; second-instance evidence may
   refine.
5. SKILL amendment shape: a new §"n=2 collaboration mode" section
   inside `start-right-team` SKILL-CANONICAL.md, OR a separate
   sibling SKILL `start-right-team-n2`? First draft favours the
   inline-section shape (one canonical entry, mode-section
   within).

## Notes for the second-instance trigger

This first draft is authored at first-instance observation
(2026-05-25 Stormy + Fiery PR 115 merge-prep session). Per the
substance-preservation discipline named in
`feedback_pending_graduations_is_buffer_not_dump`, the PDR is the
substrate-preservation surface, not pending-graduations. The
falsifiability section above is the second-instance trigger; this
PDR remains Proposed until a second n=2 session either validates
or refines the mode.
