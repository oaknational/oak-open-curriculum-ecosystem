---
name: "Preserve the Value-Rationale (Why-It-Matters) at Handoff, Not Only the What and How"
polarity: pattern
related_pdr: PDR-011
use_this_when: "Completing a plan, writing a handoff record, or graduating work to a permanent home — any point where served user-stories or design intent are about to be summarised."
category: process
proven_in: "prior-session owner correction, promoted from the per-user buffer; the general form of PDR-011's grounded-execution-knowledge capture edge"
proven_date: 2026-06-21
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Conserving a plan's 'what' (acceptance met) and 'how' (mechanism) at handoff while losing its 'why it matters' — the value-rationale, the most easily-lost and most valuable layer."
  stable: true
---

> **POLARITY: PATTERN.** A plan's user-stories carry *why it matters* —
> the layer most easily lost at handoff and the most valuable to keep.

## The shape

At completion and handoff, analyse each served story's disposition and
conserve its **why** into the permanent home — the skill
description/body, the ADR/PDR Context, the README purpose lines — not
only the **what** (acceptance met) and the **how** (mechanism). The what
and how survive in the diff and the tests; the why survives only if you
write it where the next reader will look.

## The cure

Make the value-rationale a named output of every handoff and graduation,
alongside acceptance and mechanism. This is the instance form of
PDR-011's grounded-execution-knowledge second capture edge. Sibling:
[`feedback_trace_user_value_before_tool_design`].
