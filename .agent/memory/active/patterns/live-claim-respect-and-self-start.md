---
name: "Respect Live Claims; Self-Start Once the Baton Is Yours"
polarity: pattern
use_this_when: "Deciding whether to begin work under a goal/Stop-hook pressure when another agent holds a claim, or whether to wait for an explicit 'go' once a goal has been handed to you."
category: process
proven_in: "Snapper binds Coral (2026-06-15→16) nearly barged a 'stale'-labelled but live claim under Stop-hook pressure; Rigel binds Meridian converted a handed, grounded goal into a permission checkpoint instead of self-starting."
proven_date: 2026-06-16
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Two dual failures: (1) barging an active peer claim because a derived 'freshness' field labelled it stale; (2) stalling on a goal that is already yours, grounded, and persistent, waiting for an explicit 'go' that will never come."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# Respect Live Claims; Self-Start Once the Baton Is Yours

Two dual disciplines about *when to act* under coordination pressure.

## Pattern

**Liveness is read from the live event stream, never a derived or displayed
field.** A claim's `freshness_status` (computed from `claimed_at` alone) can
report a demonstrably-live agent — one heartbeating every few minutes with a
recent commit — as `stale`. Ground the peer's **latest heartbeat / comms event /
commit** before acting on any claim. A goal's start-pressure (a Stop hook, an
owner directive to "start now") **never** overrides an active claim: wait for the
handover.

**Once the baton is yours, grounded, and the goal is persistent, self-start —
do not convert a cadence or pacing signal into a permission checkpoint.** The
dual of claim-respect: you wait for a *live peer's* handover, but once the work
is unambiguously yours and you have grounded it, begin without waiting for an
explicit "go." Asking for permission you already hold is friction.

## The discriminator

The question is *whose work is this right now?* If a live peer holds it →
respect the claim, ground their liveness from the event stream, wait. If it is
yours (handed, grounded, no live peer claim) → start.

## Anti-pattern

- Reading a derived `stale` label as licence to barge an active claim.
- Treating a Stop-hook or "start the goal" pressure as authority over a peer's claim.
- Stalling a handed, grounded, persistent goal pending an explicit "go."

## Related

- [`peer-commit-absorption-third-direction.md`](peer-commit-absorption-third-direction.md)
- `feedback_peer_status_claims_are_input_to_verify` (auto-memory)
- The `claims list` freshness defect is frictions-register F-44 (the tooling side).
