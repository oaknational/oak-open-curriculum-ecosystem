---
name: "Inter-Agent Sidebar with Default Action"
polarity: pattern
category: agent
status: proven
discovered: 2026-05-11
proven_in: "R1.b collaboration-protocol-hardening session (Soaring Darting Kite, 2026-05-11). At session open the canonical schema work conflicted with a live peer claim (Fronded Flowering Seed, claim 1ccfa79c, scope included comms-events/**). Posted directed sidebar comms event 2e1a886f-d614-4df7-b4cc-7605218144d4 with two specific questions (write vs read-only intent; expected claim-close ETA), an explicit deadline (15:00Z, ~60 min), and a named default action on no reply (defer R1.b session, re-launch after Fronded closes). Fronded replied at 544bf9bf within 10 minutes — confirmed read-only intent, proactively narrowed claim, R1.b proceeded. Zero owner mediation required. Polling cadence was honoured via a background watcher; no autonomous lock-wait loop."
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure
> mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

# Inter-Agent Sidebar with Default Action

When a peer agent's active claim conflicts with the scope an
opening session needs, the right move is **a directed comms-event
sidebar with a deadline and a named default action**, not an
escalation to the owner. The protocol works between two known
agents in minutes, without owner mediation, when the deadline +
default-action contract is explicit.

## Pattern

Three components make the sidebar load-bearing:

1. **Two-or-three specific questions** that yield owner-undirected
   answers. Write vs read-only intent; expected close ETA; whether
   a scope-narrow is acceptable. Open-ended questions ("what are
   you doing?") do not yield clean replies; specific questions do.
2. **An explicit deadline.** Forty to sixty minutes is a reasonable
   default — long enough for the peer to be working and notice the
   sidebar, short enough that the deadline still bounds the
   opening session's wait. The deadline is owner-style: it
   bounds wait time without being adversarial.
3. **A named default action on no reply.** "If no reply by 15:00Z,
   I treat your claim as covering the full scope for its TTL and
   defer this session." The default action is the operational
   continuity guarantee — the requesting session is not stranded by
   peer silence. Both parties see what happens absent reply.

The reply event uses `in_response_to: <sidebar-event-id>` and
`addressed_to: <sidebar-author>` for routing; the convention is
durable and threads cleanly across the canonical narrative-event
directory.

## When to use it

- Opening a session and finding an overlapping active claim from a
  peer agent.
- Needing peer-coordination on shared-state surfaces (comms-events,
  active-claims, plan files) where the peer's intent might not be
  obvious from claim scope alone.
- Resolving a workload-boundary question that is genuinely
  inter-agent (the agents can decide together) — not an owner
  decision in disguise.

## When not to use it

- The decision is owner-shaped (architectural trade-off, scope
  arbitration, prioritisation across threads). Inter-agent sidebar
  routes around the owner inappropriately.
- The conflict is on an irreversible commit-boundary surface
  (one of the agents is mid-staging). Owner-aware lock-wait
  protocol is the right cure there.
- The peer is unknown / inactive. Sidebar to a stale claim
  consumes the deadline without information; archive the stale
  claim first.

## Operational mechanics

- Post the sidebar via direct JSON write to the narrative
  comms-events directory, not via the CLI's `comms send` — the
  CLI failed on long-bodied invocations this session (B-10
  shell-mangling, see open friction). Direct write yields a
  schema-valid narrative event.
- Validate the written event against the canonical schema by
  reading required fields (`event_id`, `created_at`, `author`,
  `title`, `body`); the substrate fitness check catches schema
  violations at evaluation time.
- Poll via background watcher with a TTL; do not run an
  autonomous lock-wait loop. The watcher exits on reply or
  deadline.
- Append a narrative entry to `shared-comms-log.md` recording
  the sidebar — the comms-log is the human-readable audit trail.

## Evidence

- R1.b session 2026-05-11: sidebar `2e1a886f` → reply
  `544bf9bf` in ~10 minutes; Fronded narrowed claim
  proactively; R1.b unblocked; zero owner involvement.
- Related: this pattern complements
  [`patterns/different-lens-reviewer-divergence.md`](different-lens-reviewer-divergence.md)
  as a parallel-coordination shape — sidebars between agents in
  parallel work, lens-divergent reviewers in parallel review.

## Limits

Two known agents on the same thread can coordinate via sidebar.
The protocol does **not** prevent a *third* agent entering the
shared-state surface mid-session with non-pathspec staging — that
is the failure-mode named in
[`peer-commit-absorption-third-direction.md`](peer-commit-absorption-third-direction.md),
which is cured at the commit boundary, not the comms-event
boundary.
