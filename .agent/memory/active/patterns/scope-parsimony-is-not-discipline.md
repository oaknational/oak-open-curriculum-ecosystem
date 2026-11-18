---
name: "Scope Parsimony Is Not Discipline"
polarity: anti-pattern
use_this_when: "You are about to justify deferring, narrowing, or working around something by citing a scoping rule (YAGNI, consolidate-at-second-consumer, don't-extract-single-consumer, plan-scope hygiene, an external constraint) — check the rule's actual warrant before applying it, and ask the corrective question: does this thing have an independent identity worth defining, describing, and testing in isolation?"
category: agent
layer: general
proven_in: "Three same-direction owner corrections in ONE session (2026-07-08, PR #328 deep review): (1) estate workspaces (observability/logger) treated as frozen — real defects routed away as 'not this plan's prerequisite' when the owner's direction was to enhance the estate in support of the work; (2) our own MCP app's auth treated as an external constraint — a persisted-human-refresh-token workaround designed around it, when adding first-class machine identity to our own app dissolved the store, the refresh machinery, and the identity liability at once; (3) an ai-gateway model-layer extraction called 'premature' via consolidate-at-second-consumer — wrong warrant: that rule prevents SPECULATIVE abstraction, and the layer had a present, crisp identity (contract + isolation tests). Each instance cited a REAL rule with the WRONG warrant."
proven_date: 2026-07-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Optimising for the smallest defensible diff and mistaking it for discipline — using scoping doctrine as cost-avoidance justification, so the estate freezes around whatever exists and excellence quietly degrades to expediency."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*,
> not a shape to repeat.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

# Scope Parsimony Is Not Discipline

## The anti-pattern

Under review pressure, an agent optimises for the **smallest defensible diff**: the
narrowest change is the easiest to justify and the fastest to land, so scoping rules
(YAGNI, `consolidate-at-second-consumer`, don't-extract-single-consumer-abstractions,
plan-scope hygiene, "that's an external constraint") get reached for as *cost-avoidance
heuristics* rather than by their actual warrants. The result reads as discipline —
every deferral cites a rule — while the system freezes around whatever already exists.

This is the quiet cousin of the rush impulse that `principles.md`
§Architectural-Excellence-Over-Expediency names: not *"cheap because fast"* but
**"narrow because defensible."** The feedback is asymmetric — overreach gets challenged
in review immediately; timidity is only visible as a pattern, usually to the owner,
after several instances.

## The tell

- A real rule cited with the wrong warrant: the rule's precondition (speculation, an
  imagined future consumer, a genuinely external system) does not hold, but the rule's
  *name* is doing the justificatory work.
- "We can't change X" where X is inside the estate (a workspace, a boundary config, our
  own app's auth surface). Nothing in the estate is frozen; boundaries are configured,
  never obeyed blindly.
- Deferral language accumulating in one artefact: "at a second consumer", "when Y
  exists", "premature", "out of scope for this plan" — each individually defensible.

## The cure

At every decomposition or deferral point ask the corrective question:

> **Does this thing have an independent identity worth defining, describing, and
> testing in isolation?** — never *"can we defer it?"*

If yes, articulating it (its own workspace, its own contract, its own tests) is not
speculation — it is articulation of something already real. The anti-speculation rules
exist to prevent *invented* abstractions; they do not forbid giving present, real
functionality its own describable identity. And when a constraint blocks a legitimate
need, first-principles-check the constraint itself (decision lens 4: would it be
simpler if the system changed?) before fitting the work to it.

## Relationship to neighbouring patterns

- [`precedent-compounding-is-the-mechanism-of-entropy`](precedent-compounding-is-the-mechanism-of-entropy.md)
  — the same failure family from the opposite side: precedent-compounding reuses a
  landed shape *because it landed*; scope-parsimony refuses a right shape *because the
  narrower one is defensible*. Both substitute procedural legitimacy for
  principle-compliance.
- [`never-disable-checks`](../../../rules/never-disable-checks.md) §Configuring a check
  to express the architecture is not disabling it — the boundary-config instance of the
  same regime at lint altitude (2026-07-08); this pattern generalises it to plans,
  workspaces, and auth surfaces.
