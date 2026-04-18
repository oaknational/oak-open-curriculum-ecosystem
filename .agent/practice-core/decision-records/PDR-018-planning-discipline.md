---
pdr_kind: governance
---

# PDR-018: Planning Discipline — End Goals and Workflow Contracts

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(findings about plans — including missing end goals — route under
PDR-012);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(plans that promote to `current/` follow both-readiness-criteria
discipline from PDR-014).

## Context

Plans and workflows structure work. Two planning failure modes
consistently produce low-value work despite apparent productivity:

1. **Means goals substitute for end goals**. A plan is framed
   around the means ("close 15 gaps", "reduce line count by 30%",
   "migrate to framework X") without a clear end ("what does the
   user actually need from this?"). The means-framed plan
   generates activity — gaps get closed, lines get cut, migration
   happens — but the activity does not correspond to user-impact
   outcomes. The work appears productive by its own metrics
   while delivering little.

2. **Workflow contracts with ambiguous verbs**. A workflow or
   repair process uses verbs that could mean multiple things
   ("update", "sync", "reconcile", "propagate"). When the workflow
   runs against multiple artefacts or locations, ambiguity in the
   verb allows each application to interpret differently. The
   workflow produces inconsistent results across artefacts without
   any single application being wrong by its own interpretation.

Underlying cause: planning prose is cheap; plan substance requires
clarity about purpose (end goal) and contract (what verbs commit
to). Without explicit discipline, prose races ahead of substance.

## Decision

**Every non-trivial plan names its end goal — the user-impact
outcome sought — before naming means. Workflow contracts use
unambiguous verbs; ambiguous vocabulary is replaced or
disambiguated before the workflow runs.**

### End goals over means goals

A non-trivial plan states:

1. **End goal** — the user-impact outcome the plan aims to
   deliver. Answers: "what does the user ultimately need?" or
   "what changes for the user when this plan completes?"
2. **Mechanism** — how the means produce the end. Answers: "why
   do these specific means deliver that end?"
3. **Means** — the specific work items.

The mechanism is the bridge. A plan with end goal + means but no
mechanism is working on faith that the means will produce the
end. A plan with means + mechanism but no end is optimising
without a target.

**Anti-pattern**: "Close all 15 knip findings" (means only; no
named end goal; no mechanism from "no knip findings" to
user-impact). Corrected: "Prevent downstream consumers from
silently relying on code the author meant to remove (end) by
removing exports knip confirms are unreferenced (means), so each
removed export reduces the surface of latent breakage
(mechanism)."

**Symptoms of a means-dominated plan**:

- Acceptance criteria measure activity ("15 items closed", "line
  count reduced"), not outcomes.
- The work completes and the plan closes, but nobody can articulate
  what changed for the user.
- Follow-up plans cite "we did X but then had to do Y" — X was
  means without end; Y is the real work surfacing after.

### Workflow contract clarity

A workflow that repairs, transforms, or propagates content across
multiple artefacts uses **unambiguous verbs**. Ambiguous verbs
create drift:

| Ambiguous | Disambiguated |
|---|---|
| "update" | "rewrite from scratch" / "edit in place" / "append" |
| "sync" | "copy verbatim" / "reconcile differences" / "overwrite destination" |
| "propagate" | "broadcast unchanged" / "adapt per receiver" / "promote to authoritative" |
| "migrate" | "move files" / "rewrite content" / "adapt and relocate" |
| "refactor" | "rename" / "extract module" / "change structure without changing behaviour" |

When a workflow uses an ambiguous verb, one of two responses is
required before the workflow runs:

1. **Replace** the verb with an unambiguous one.
2. **Disambiguate** by naming which of the possible meanings
   applies to this workflow, in the workflow's definition.

A workflow with ambiguous verbs that runs against N artefacts
without disambiguation produces N interpretations and N different
outcomes. The drift is invisible at single-artefact application
and becomes visible only when the outcomes are compared.

## Rationale

**Why end goals.** Means without ends produce activity without
impact. The means can be executed correctly while the plan
delivers nothing useful. Naming the end goal first forces the
question "is this means-set actually the right path to the end?"
to be asked before work starts, when redirection is cheap.

**Why mechanism.** End + means without mechanism is belief:
"these means, when done, will produce that end." Writing the
mechanism forces the belief to be examined. Sometimes the
mechanism is obvious and the writing is ceremonial; sometimes
the mechanism turns out not to exist, and the plan is revised.

**Why unambiguous workflow verbs.** A workflow is a contract
between the author who writes it and every agent that runs it.
Ambiguous verbs mean the contract has no single interpretation —
each runner interprets. Across N runs, N interpretations. The
drift compounds silently.

Alternatives rejected:

- **Implicit end goals.** Authors claim the end is "obvious";
  downstream agents interpret differently; the plan produces
  inconsistent work.
- **Ambiguous verbs as a shorthand.** Saves drafting effort; costs
  more in reconciliation and drift.

## Consequences

### Required

- Non-trivial plans state end goal + mechanism + means explicitly.
- Acceptance criteria measure outcome, not just activity.
- Workflow contracts use unambiguous verbs or explicitly
  disambiguate.
- Findings about missing end goals or ambiguous verbs route per
  PDR-012.

### Forbidden

- Plans whose acceptance criteria are purely activity-measuring
  without any outcome measure.
- Workflows that use ambiguous verbs against multiple artefacts
  without explicit disambiguation.

### Accepted cost

- Writing end goals and mechanisms takes more effort than
  writing means-only plans. Justified by the plans that get
  cancelled when the mechanism doesn't hold up.
- Replacing ambiguous verbs in workflows takes more drafting
  effort. Justified by consistent outcomes across N applications.

## Notes

### Host-local context (this repo only)

Proven instances retained with `related_pdr: PDR-018`:

- `.agent/memory/patterns/end-goals-over-means-goals.md` —
  originated from knip-triage planning where "close 96 unused
  exports" was the means-framed plan; the end-goal-framed
  rewrite was materially smaller and more targeted.
- `.agent/memory/patterns/repair-workflow-contract-clarity.md` —
  originated from repair workflows using ambiguous verbs that
  produced divergent outcomes across artefacts.
