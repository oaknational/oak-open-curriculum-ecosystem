---
name: Behaviour-Nudge Pressure Design Constraints
polarity: design-note
category: coordination-architecture
status: provisional
discovered: 2026-05-12
proven_in: "Owner-directed design prompt 2026-05-12 during a P5 queue-pressure window; peer expansion captured across two comms events. Forward-looking substance: no implementation has run yet. Captured here as a design-note pattern so that when a behaviour-nudge implementation slice opens, these constraints are visible at plan-author time. Promotion to a PDR is appropriate when the implementation slice opens; until then this pattern is the design-substrate."
---

> **POLARITY: DESIGN-NOTE.** Forward-looking design constraints captured against the moment a behaviour-nudge implementation slice opens. Not yet implementable; not yet falsifiable in code.

# Behaviour-Nudge Pressure Design Constraints

Owner design prompt 2026-05-12: weight collaboration events by
**occurrence frequency** and **immediacy** to nudge group
behaviour. Two notes from the same window:

## Note 1 — Frequency-Immediacy Weighting

Treat repeated recent classes of friction as **escalating signals**,
not as **hard scheduling authority**. The score makes patterns
visible and timely; it never silently reorders work.

Example signals from the source window:

- Repeated `git:index/head` holds.
- Active commit-queue pressure.
- Downstream `pnpm-lock` blocking.
- Directed-message pressure.
- Hook-green blockers.

Example nudge messages:

- *"queue pressure is rising; pause new staging"*
- *"lockfile dependency is blocking downstream work"*
- *"same blocker has appeared three times in ten minutes; ask
  coordinator for route"*

Owner and coordinator decisions remain **explicit**. The pressure
score is a signal that surfaces patterns; the decision to act is
always a human or coordinator decision.

## Note 2 — Anti-Panic Damping Safeguards

If pressure-to-act builds as an exponential function convolved
with urgency, it can improve group cohesion on pressing blockers
**but** also create group panic. Design constraints to prevent
that:

1. Pressure scores must be **explainable, damped, capped, and
   expressed as reversible prompts** rather than automatic
   action.
2. Candidate safeguards:
   - **Decay with cooldown** — signals fade if the underlying
     condition resolves, even before the cooldown completes.
   - **Require evidence citations** — every pressure prompt
     names the events that produced it.
   - **Separate urgency from importance** — high-importance
     signals do not automatically inherit high urgency.
   - **Suppress duplicate-herd amplification** — multiple agents
     observing the same signal do not multiply the score.
   - **Expose uncertainty** — confidence intervals on the
     pressure score; low-confidence scores produce softer
     prompts.
   - **Prefer "ask coordinator" over "act now" at high pressure**
     — the default cure at high pressure is escalation, not
     autonomous action.
   - **Let humans / coordinators override or mute a pressure
     class** — operator authority over the nudge system, not
     the other way around.
3. Constructive target: **collective attention on current
   blockers**, not emotional contagion or unreviewed auto-
   reordering.

## When This Pattern Fires

When a plan or PDR proposes behaviour-nudge architecture, pressure
scoring across collaboration events, or automatic prioritisation
shaped by recent friction. The constraints above are the design
inputs at plan-author time.

## Cross-References

- `.agent/memory/operational/pending-graduations.md` 2026-05-22 —
  the original capture entry remains until either an
  implementation slice opens or owner direction promotes this to
  a PDR.
- `.agent/skills/oak-start-right-team/` — the team-coordination
  surface where behaviour nudges would mount.
