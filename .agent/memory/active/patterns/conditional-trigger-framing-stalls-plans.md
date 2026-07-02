---
name: "Conditional-Trigger Framing Stalls Plans"
polarity: anti-pattern
use_this_when: "Authoring or reviewing plan todos, sequencing, or scope — and a step is framed as 'when X ships', 'depends on future Y', or an unscheduled 'next phase'."
category: planning
related_pdr: PDR-058
proven_in: "v2 large-corpus-analysis kept candidate C49 (2026-06-30): recurring owner-corrected class — 'sequence not scope-reduction', 'schedule it, no imaginary flows' — across planning sessions."
proven_date: 2026-06-30
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Plan items parked behind vague conditionals that can never falsifiably fire, reading as 'planned' while nothing is scheduled — the imaginary-flow stall."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** "When X ships" is not a schedule. A plan
> commits to concrete sequence positions or it stalls.

## The failure mode

A todo framed on a conditional trigger ("when X ships", "depends on future
Y", a bare "next phase") reads as planned while committing to nothing: the
trigger has no falsifiable firing moment, so the item silently stalls and the
owner has to correct it. The corpus found this owner-corrected repeatedly.

## The affirmative shape

Commit to **concrete scheduled sequence positions**, with the full interface,
home, and envelope shipping from day one — only *implementations* are phased
("sequence, not scope-reduction"). Where a genuine dependency exists, name a
**falsifiable tripwire** (an observable event a future reader can check),
never a vague conditional. The governance home for the
optionality-decomposition doctrine and the tripwire-vs-vague-conditional
discriminator is
[PDR-058](../../../practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md);
this pattern is its plan-authoring firing shape.
