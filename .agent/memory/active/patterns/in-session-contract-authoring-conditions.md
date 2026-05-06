---
name: In-Session Contract Authoring Conditions
polarity: pattern
use_this_when: A plan has just landed that proposes a new contract / directive / governance doc and the question is whether to author the contract in the same session or sequence it to a fresh session
category: process
proven_in: .agent/directives/operationalisation-contract.md
proven_date: 2026-05-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Defaulting either way without checking the conditions — authoring a heavy directive in a tired session and degrading the directive, or sequencing a small contract that was already half-drafted to a fresh session and losing momentum"
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: when a plan
> proposes a contract and the question is "now or fresh
> session", the three named conditions decide. Default neither
> way without checking them.

## Principle

The standing 30%-context rule for directive-file work
(`directive-file-context-budget`) sequences directive edits to
the start of a fresh session by default. The default exists
because directive files are deep, dense, structurally
load-bearing, and unforgiving of context-pressure errors.

But the default is exactly that — a default. A small,
self-illustrating contract whose substance is already drafted
in the plan body can land in the same session as the plan
without violating the spirit of the budget rule. The judgement
required is not "should I always defer" but "do these specific
conditions hold for this specific contract".

The judgement has three named gating conditions. All three
must hold; any one missing returns the work to the default
sequencing.

## Pattern

Before authoring a contract in the same session as the plan
that proposes it, check all three conditions:

1. **Explicit owner pre-alignment** — the owner has named the
   in-session authoring as the desired shape, not the default
   defer. If the question "now or fresh session?" has not been
   asked and answered, the answer is *fresh session*.
2. **Contract self-illustrating in scale** — the contract is
   small enough that its full body fits in current context
   with headroom for full-depth editing. A contract that needs
   30%+ of remaining context to author honestly is not
   self-illustrating; defer.
3. **Plan body already contains the substantive contract
   content** — the contract's substance, examples, and
   structure have already been drafted in the plan body during
   plan authoring. The in-session work is *relocating* the
   substance to its proper home and adjusting prose for
   directive-shape, not authoring the substance from scratch.

If all three hold, in-session authoring is viable. If any one
is missing, the contract is sequenced to a fresh session per
the standing 30%-context budget rule.

## Worked Instance

2026-05-06, Hidden Slipping Moth session. The strategic plan
landed in the session. Owner directed Phase 0 (authoring the
operationalisation-contract directive) be run in the same
session. The conditions held:

1. Owner pre-alignment: explicit *"author in this session"*
   direction.
2. Self-illustrating scale: directive landed at 171 lines,
   inside Level-1 discipline.
3. Plan body content: the contract's substance was already
   drafted in the plan body during plan authoring; the
   in-session work was relocation + directive-shape adjustment.

The contract landed cleanly. The session was at ~85% context
when the directive landed, but the substance was already
drafted — the in-session move was extractive, not generative.

## Anti-pattern

Treating either pole as the default without checking the
conditions. The two failure modes are mirror images:

- *Always defer* — losing momentum on a small contract that
  was already half-drafted; the next session pays a fresh
  start-up cost without proportional benefit; the contract
  drift-decays in the plan body in the meantime.
- *Always author in-session* — degrading a heavy contract by
  authoring under context pressure; subtle errors land in a
  load-bearing directive and propagate through every future
  session that reads it.

The discipline is to check the three conditions every time,
treating both poles as legitimate-when-conditions-hold.

## Diagnostic at Plan-Landing Time

When the plan lands and proposes a contract, the agent asks
three questions in order:

1. *Has the owner directed in-session authoring explicitly?*
   (If no — defer; do not proactively offer in-session.)
2. *Is the contract small enough that I can author it with
   full-depth editing in the remaining context?* (If no —
   defer; degraded directive-authoring is worse than fresh-
   session directive-authoring.)
3. *Is the contract substance already drafted in the plan
   body?* (If no — the in-session work would be generative,
   not extractive; defer.)

Three yes answers — author in-session. Any one no — defer per
the standing 30%-context budget rule.

## When to Apply

- A plan proposes a new contract / directive / governance doc
  and the question of timing arises
- Owner asks whether to author now or in a fresh session
- The agent itself is about to volunteer in-session authoring
  — the conditions check is the gate before the offer
