# Collaboration Functionality Is Value-Contingent

Every piece of collaboration functionality — a monitor, a heartbeat, a
broadcast, a claim, the commit-queue ceremony, a directed event, a status
report — earns its place only by the value it provides **in the current
context**. None is unconditional. The cost is real (tokens, owner-visible
notifications, agent turns); the justification is the consumer that relies
on what the functionality produces, here and now.

## The classifier — awareness, behaviour, ceremony

- **Awareness** is passively knowing the team's state: the all-channels
  comms watcher, a working-tree watcher, a git-state watcher. Awareness is
  the cheap precondition for responding in time. It is near-universally
  justified and is **never** ceremony. A role whose value depends on timely
  response (the commit warden) is blind without it.
- **Behaviour** is the valuable response to what awareness surfaces: gate
  and commit a ready bundle, flag a dangerous git state, route work, raise a
  blocker. This is where collaboration delivers value.
- **Ceremony** is repetitive low-value activity done to *feel* productive
  instead of delivering value: a status emission on every monitor tick, a
  broadcast that duplicates what the consumer already sees, a claim-refresh
  with no reader, queue-grinding when a tight hand-off would do. Drop it.

## Trigger

About to start, mandate, perform, or skip any collaboration functionality —
or reading a doctrine surface that frames one as a "non-negotiable
precondition." Fires before the mechanism is reached for, and again when the
session context changes (team size, presence of a live owner-conductor,
rotating cast).

## Action

Name the **consumer** that relies on this functionality's output in the
current context. No consumer means no value; do not do it.

- Awareness monitors almost always have a consumer (you, needing to respond
  in time) — keep them. Do NOT mis-file a monitor as ceremony and drop it;
  that blinds the role.
- Outgoing periodic emission is the contingent surface. A liveness
  heartbeat's consumer is async retirement-detection (silence drives claim
  auto-rebalance). When a live owner-conductor detects retirement directly,
  that consumer is absent and the periodic heartbeat adds nothing a consumer
  reads; when the conductor goes async or the cast rotates, the consumer
  reappears. PDR-082 (Proposed) instances this at n=2 (owner-visible
  liveness); generalising the variable from team-size to consumer-presence
  is a working hypothesis on PDR-082's second-instance path. The heartbeat
  contract (PDR-078, Accepted) governs until that graduates — do not
  pre-empt it with a standalone exemption.
- An owner direction to "minimise ceremony" trims the ceremony surface
  (repetitive low-value emission), never the awareness monitors.
- Re-evaluate when context changes — the classification is contingent and
  self-healing, not a one-time switch.
- If a mechanism does not fit one category cleanly — a claim, say, is both
  an awareness signal to peers and a durable governance artefact — apply the
  consumer test directly rather than forcing a category.

## Failure modes this prevents

1. **Mis-filing awareness as ceremony.** Dropping a monitor under a "no
   ceremony" direction, blinding a role whose value is timely response.
   Founding instance: a commit warden refused to start the
   message / filesystem / git monitors (2026-06-06), reasoning the owner's
   "no ceremony" direction excluded them; it did not — monitors are
   awareness.
2. **Ceremony as productivity theatre.** Emitting heartbeats, broadcasts, or
   claim-refreshes that carry no information a consumer needs. Worked
   instance: PDR-082 §Context — n=2 heartbeat overhead the owner could see
   directly in chat.

## Why a Rule, Not a Clause

The value-contingency discipline is agent-general: it fires at every
collaboration-functionality decision, not at one structural moment. It had
lived only in auto-memory (`useful-work-over-ceremony`,
`comms-ceremony-minimal`), which is passive — under context pressure it did
not fire (the
[`passive-guidance-loses-to-artefact-gravity`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
failure). The rule corpus is the active behavioural-modifier layer; this
rule is that active layer. The portable *contract* substance already lives
in PDR-082 / PDR-080 / PDR-066 — what was missing is the always-applied
operational discipline, which is rule-shaped.

## Related Surfaces

- [PDR-082 (n=2 collaboration mode)](../practice-core/decision-records/PDR-082-n2-collaboration-mode.md)
  — **Status: Proposed** (first-instance evidence; see its §Falsifiability).
  The value-contingency principle applied at one scale: drop the heartbeats
  and message-sweeps the owner sees directly, retain the all-channels
  watcher. This rule names the general principle; PDR-082's team-size framing
  is the founding instance, and whether consumer-presence is the deeper
  variable is a hypothesis on PDR-082's second-instance path.
- [PDR-080 (coordination-event absorption is signal-driven)](../practice-core/decision-records/PDR-080-coordination-event-absorption-is-signal-driven.md)
  — events absorbed by signal, not by calendar.
- [PDR-066 (comms-events as failure-mode channel)](../practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md)
  — the four-section body is the forcing function: if you cannot fill it,
  the substance is routine.
- [`agent-collaboration.md` §"Knowledge and Communication, Not Mechanical Refusals"](../directives/agent-collaboration.md)
  — collaboration mechanisms are knowledge-providing tripwires for reasoning
  peers, not ceremony.
- [`comms-all-channels-watcher.md`](comms-all-channels-watcher.md) and
  [`liveness-heartbeat-cron.md`](liveness-heartbeat-cron.md) — the awareness
  surface (always-value) and the outgoing-emission surface (contingent).

## Enforcement

Behavioural at every collaboration-functionality decision. The check is the
one-sentence consumer test: *name the consumer that relies on this output in
the current context.* No automated gate; the discipline is the named pause
before reaching for — or mandating — a mechanism.
