---
pdr_kind: governance
---

# PDR-103: Scope From the Goal Before Approach — an Active Boundary Gate

**Status**: Accepted
**Date**: 2026-06-18
**Related**:
[PDR-029](PDR-029-perturbation-mechanism-bundle.md) (tripwire doctrine — make
boundary checks fire as artefacts, not aspirations; this PDR adds a new tripwire of
that family);
the `re-apply-first-question-at-elaboration-boundaries` rule (the **pruning** boundary
question — "could it be simpler?"; this PDR adds the sibling **scoping** question);
[`plan-body-first-principles-check`](../../rules/plan-body-first-principles-check.md)
(the plan-authoring-time companion);
the `passive-guidance-loses-to-artefact-gravity` pattern (why a reminder is not enough);
`open-questions.md` Q-001 (the same structural problem for report-only fitness — a
passive signal needs an active firing surface).

## Context

A recurring failure mode, evidenced across a long strategy/plan-estate session
(2026-06-18) where the owner had to correct the same root five times: the agent
**acts on the frame in front of it without grounding that frame against the goal.**
It has two faces:

- **Under-scoping** — a task arrives as a narrow pointer ("fix this file", "handle
  this artefact"); the agent examines exactly that, fixes it, and declares done,
  never stepping back to ask *what goal does this serve, and what is the full set of
  surfaces relevantly in scope for that goal?* The owner then points at the next
  surface that sat, unexamined, in the same context. (Worked instance: a "cold read"
  that read the controlling plan and stopped, while the thread record — its co-equal
  pickup surface — sat unverified beside it.)
- **Over-gating** — the mirror: the agent invents a constraint or permission gate
  from inherited doctrine ("this is owner-ratified") without grounding it against
  current policy, adding friction the goal does not want. (Worked instance:
  asserting PDR authoring is owner-ratified, generalised from a Core-edit approval
  clause, uncited — a `gates-must-be-citable` breach arriving fluently.)

Both are the same defect: a frame (the pointer's implied scope; an inherited gate)
is accepted **fluently** and acted on before it is grounded against the goal and the
current authorities.

The repo already has boundary-firing discipline, but it does not catch this:

1. It fires the **pruning** question ("could it be simpler?"), never the **scoping**
   question ("what is the goal, and what is the full relevant set?"). There was a
   rule against over-building and none against under-scoping.
2. It is **passive** by its own admission ("the signal is behavioural, not
   hook-enforceable; the named discipline that authoring agents apply") — which is
   exactly the documented `passive-guidance-loses-to-artefact-gravity` failure under
   context pressure.
3. It fires at **plan-start and elaboration** boundaries, not at the boundary that
   bites hardest: a **reactive task/owner-pointer arriving mid-conversation**, and the
   moment of **declaring an examination or verification done**.

## Decision

**Before starting the approach on any non-trivial task — and before declaring any
examination or verification done — the agent scopes from the goal, as an observable
artefact.** Concretely:

1. **Restate the goal** the task serves (the pointer is evidence *about* the goal,
   not the task itself).
2. **Derive the full relevant set** — the surfaces, work, and downstream consumers
   that sit in that goal's context — and name what is in and out of scope.
3. **Emit a proportionate `Goal · in-scope · out-of-scope` artefact** before the
   first substantive tool call, and **walk the in-scope set** before declaring done.

The scoping question — *"what is the goal, and what is the full set relevant to it?"*
— joins *"could it be simpler?"* as a standing **framing question** re-asked at every
boundary: task/pointer arrival, elaboration, doctrine-sharpening, and done-declaration.

**Completeness criterion** (the test the artefact serves): *no consumer arriving
through any entry point encounters a stale or wrong state, and nothing relevant to the
goal is left unwalked.* The verification consumer-walk is the technique; this gate is
its trigger.

**Proportionality.** One line for bounded work; skipped for trivial work (a typo, a
one-line answer). The **impact test** guards against theatre: if producing the
artefact never changes the approach, it is ceremony — its job is to catch a too-narrow
scope or an ungrounded gate. This is not plan-theatre; it is the smallest observable
form of the step-back.

**The artefact is the active upgrade.** A passive "remember to scope" reminder loses
to artefact gravity. Producing an output makes the two skipped questions unskippable
and makes the scope **observable** (to the owner, to a reviewer, to the statusline).
This is the PDR-029 move: the check fires as an artefact, not an aspiration.

**Staged enforcement (evidence-gated).** The artefact gate still relies on the agent
producing it, so it is more structural than a reminder but less than a hook. If
evidence shows it is skipped under pressure (a second recorded instance), escalate to
a harness hook (UserPromptSubmit / pre-edit) — the only fully-active layer. This is
the same structural question as Q-001 (a passive signal needs a firing surface);
cross-link the two when either is next worked.

## Rationale

Naming a discipline does not inoculate against violating it (the metacognition
directive's own warning; the conservation-reflex of PDR-089). The cure is structural,
not vigilance. The cheapest structural form that is genuinely active is a required,
observable, proportionate artefact at the two boundaries where the defect occurs.
This is generative metacognition (purpose-by-default) made routine: derive scope from
the goal *before* approach, rather than retrofitting it after a correction.

Alternatives rejected:

- **A passive rule alone** ("step back and scope"): the existing boundary rule is
  already passive and already failed; another reminder would fail the same way.
- **A hook first**: over-engineered and noise-prone before evidence that the artefact
  gate is insufficient; habituation dims an always-firing prompt. Hold as escalation.
- **Owner-ratification of scope per task**: that is the over-gating face of the very
  defect this PDR names.

## Consequences

### Required

- Non-trivial tasks open with a proportionate `Goal · in-scope · out` artefact before
  the first substantive tool call.
- "Done" on an examination/verification is claimed only after the in-scope set is
  walked — not after the pointed-at artefact alone.
- A gate or constraint asserted as policy ("X is owner-ratified / required / blocked")
  is cited or not asserted (`gates-must-be-citable`).

### Forbidden

- Declaring an examination or verification complete having examined only the surface
  pointed at, when co-located surfaces sit in the same goal-context.
- Inventing a permission gate from inherited doctrine without grounding it against
  current policy.

### Accepted cost

- A line of scoping overhead on every non-trivial task. Justified by the corrections
  it prevents (the session that motivated this PDR spent most of its turns on residue
  a goal-scoped walk would have caught in one).

## Notes

Authored as a **best-effort artefact under the current consolidation policy** — agents
author and graduate Practice doctrine on best effort in dedicated consolidation
sessions, accepting that mistakes will surface through use and be corrected by the
knowledge flow; perfect-today is not the bar, better-tomorrow is. This PDR is itself
an instance of that policy: not owner-pre-ratified, offered to the flow to be sharpened
by the frictions of applying it.

Operationalised by the always-applied rule
[`scope-from-goal-before-approach`](../../rules/scope-from-goal-before-approach.md).
