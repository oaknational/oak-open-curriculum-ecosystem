---
related_pdr: PDR-012
name: "Findings Route to a Lane or a Rejection"
category: process
status: proven
discovered: 2026-04-17
proven_in: "Sentry L-0b reviewer findings register (commit d08c6969) + prior scope-separation doctrine from the maximisation-pivot session"
informs_deeper_pattern: "no-smuggled-drops (pending consolidation — see docs/explorations/2026-04-18-depth-of-generalisation-in-pattern-extraction.md)"
---

# Findings Route to a Lane or a Rejection

Every reviewer finding must be **ACTIONED** (with the edit cited), attached
to a **named owning lane** with a specific scheduled edit, or **explicitly
REJECTED** with written rationale. There is no fourth outcome. "Deferred as
a follow-up" without an owning lane is a smuggled drop.

## Pattern

After a reviewer matrix run, the implementer builds a findings register
that accounts for every returned finding. Each entry carries:

1. Source reviewer + verbatim finding.
2. Status = `ACTIONED` | `TO-ACTION (lane X: <specific edit>)` | `REJECTED (rationale)`.
3. If `ACTIONED`: the exact edit location in the plan / code / ADR.
4. If `TO-ACTION`: the lane that absorbs it + the acceptance criterion it becomes.
5. If `REJECTED`: a written rationale naming the principle being upheld.

The register lives in the executable plan (or equivalent durable artefact),
not in chat or a session-only note. Future sessions verify against the
register to check that TO-ACTION items actually landed in their named
lanes.

## Anti-Pattern

Triaging a subset of findings as "high priority" and parking the rest as
"deferred follow-ups" or "nice-to-have." Parked findings without a named
lane + specific edit accumulate silently; they are effectively dropped
because no future session has a cue to action them.

Symptoms:

- A closing section titled "Deferred as follow-ups" or "Nice-to-have improvements."
- TO-ACTION items with only a lane name, no specific edit.
- TO-ACTION items with no named lane at all.
- Rejection justified by "low priority" rather than a principle.

## The Correction

When the owner pushes back on a "deferred" block, rewrite the register to
route every finding. If an item truly has nowhere to land, that is a
signal that the plan is missing a lane — either add the lane or reject
the item with a written rationale. The exercise surfaces structural
gaps.

## Evidence

**2026-04-17 Sentry L-0b close**. Initial close-of-session reviewer
matrix produced 29 findings. The first register split them into 7
"actioned in-situ" and 7 "deferred as future-lane follow-ups (low-
priority improvements, not load-bearing)." Owner correction: "plan to
address all of them unless they are explicitly rejected as incorrect,
update the current plan with all of them, nothing is deferred." The
register was rewritten: 18 ACTIONED, 11 TO-ACTION (each with owning
lane and specific edit), 0 REJECTED. The rewrite surfaced two
procedural issues (ADR Open Questions resolved only in plan prose; a
test-file `BYPASS_CANDIDATES` tautology) that the "deferred" framing
had hidden.

**Prior instance — scope separation** (distilled): the existing rule
"separate in-scope findings from pre-existing issues. Fix in-scope,
track pre-existing as gated follow-up" is the same principle applied to
scope rather than to review findings. "Track as gated follow-up" is a
legitimate home; "deferred without a gate" is not.

## When to Apply

- After any reviewer matrix or ad-hoc review pass.
- When closing a lane, phase, or session with outstanding findings.
- When the session-close summary is about to be written: check for any
  finding that is not explicitly ACTIONED, TO-ACTION-with-lane, or
  REJECTED.

## Related Patterns

- `nothing-unplanned-without-a-promotion-trigger.md` — the planning-layer
  sibling. Same "no smuggled drops" principle applied to planning-level
  decisions rather than to reviewer findings.
- `route-reviewers-by-abstraction-layer.md` — which reviewers to invoke.
- `reviewer-widening-is-always-wrong.md` — when to reject a reviewer's
  specific recommendation.
- `non-leading-reviewer-prompts.md` — how to write prompts that return
  useful findings in the first place.
- `review-intentions-not-just-code.md` — review before implementation,
  where findings have more lanes available to route to.

## Further Evidence

**2026-04-18 Observability restructure** (commit `2319a614`). A
comprehensive gap analysis surfaced fourteen unplanned observability
items. The same "no smuggled drops" principle that governs review
findings was applied at the planning layer: every item was absorbed
into either a MVP `current/` plan or a `future/` plan with a named,
testable promotion trigger. No item was parked as a vague "future
enhancement." The exercise of routing each item surfaced procedural
gaps that vague-backlog framing would have hidden (e.g. that
"business metrics pipeline" was actually MVP, not future; that
"synthetic monitoring" split into an MVP narrow scope and a future
broader exploration). This is the pattern applied one level up the
abstraction hierarchy, validating the underlying principle across
two different artefact types (review findings, planning items).
Extracted as its own pattern at
`patterns/nothing-unplanned-without-a-promotion-trigger.md`.
