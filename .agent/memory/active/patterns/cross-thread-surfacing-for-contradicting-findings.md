---
name: "Research That Contradicts Another Thread's Decision Needs an Explicit Cross-Thread Surfacing Step"
polarity: pattern
use_this_when: "A piece of research, a report, or a finding in one thread reaches a conclusion that contradicts or bears on a pending/ratified decision living in a DIFFERENT thread."
category: process
proven_in: "The structuredContent-only rediscovery: a finding filed in one thread did not flow into the sibling decision thread for ~ten days because no one carried it across."
proven_date: 2026-06-16
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Assuming a filed report automatically informs a sibling decision thread — it does not; the contradiction sits unread until someone happens to cross the threads, often days later."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# Research That Contradicts Another Thread's Decision Needs an Explicit Cross-Thread Surfacing Step

A finding filed in thread A does **not** flow into thread B's decision by itself,
even when it directly contradicts or bears on a pending/ratified decision in B.
Threads are continuity units, not a shared bus; a report sitting in A's record is
invisible to B's next agent.

*(Graduated single-instance per [PDR-100](../../../practice-core/decision-records/PDR-100-decision-debt-as-a-first-class-pillar.md): the cross-thread-invisibility failure is non-obvious and the lenses give a clear answer, so it does not wait for a second occurrence; provenance and adaptation are the safety net.)*

## Pattern

When research, a report, or a finding in one thread reaches a conclusion that
bears on a decision in another thread, **add an explicit cross-thread surfacing
step**: post to the other thread's next-session record (or `repo-continuity.md
§ Active threads` if it changes another thread's next safe step), or raise it on
the comms stream addressed to that thread's lane. Filing in your own thread is
necessary but not sufficient.

## Anti-pattern

Filing a contradicting finding in its own thread and assuming the sibling
decision thread will absorb it. The contradiction is rediscovered days later, if
at all.

## Related

- [`findings-route-to-lane-or-rejection.md`](findings-route-to-lane-or-rejection.md) — every finding routes to a lane or is rejected.
- `repo-continuity.md § Active threads` — the cross-thread escalation surface for next-safe-step changes.
