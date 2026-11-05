---
classification: core
description: Re-ask "could this be simpler without compromising quality or value?" at every elaboration boundary, not only at plan-time
---

# Re-Apply the First Question at Every Elaboration Boundary

The first question — *could it be simpler without compromising
quality or value?* — is implicitly assumed-asked at plan-time and
is then never re-asked at the level of "should this whole arc
exist?". Re-ask it at every elaboration boundary, and re-ask it
when doctrine sharpens mid-execution.

## The Rule

The first question is **not** a one-shot check at plan-start. It
is a discipline that fires:

1. **At plan-start** — does this work need to exist at all?
2. **At every elaboration boundary** — when a step expands into
   sub-steps, when a finding suggests new infrastructure, when a
   review recommends a refactor: does **this elaboration** need to
   exist, or is the simpler answer to keep the existing surface
   and apply the new insight tactically?
3. **When doctrine sharpens mid-execution** — when a principle is
   refined, an ADR is amended, or a rule is tightened: the
   question is *how do we adopt the new insight*, not *carry on
   with the now-known-bad approach* or *expand the now-known-bad
   approach to cover the new clause*.
4. **Before approving spend or apparatus on any lane** — a fleet, a
   ceremony, a queue, a merge mechanism: write the owner's end in
   one sentence and re-ask whether the lane is still denominated
   in it. A classification treated as a fact ("this is a
   rate-limiting cure", "this needs the merge queue") is answered
   by what the thing is FOR; seven owner corrections in one day
   shared that shape, and each was cheaper than the ceremony that
   preceded it (2026-09-06/07).

Plan-following is **not** principle-following. A plan that was
correct at authoring time can become principle-violating at
execution time as understanding deepens; the principle wins.

## The Two Failure Modes

### Failure Mode 1: Elaboration Without Re-Asking

Symptoms:

- Plans creating plans for days without product code moving.
- Supporting infrastructure built to support work that didn't need
  it.
- "Internally coherent" elaboration that doesn't advance the
  actual goal.

Worked example: a redesign of an existing test harness is framed as
a prerequisite for a downstream rename. Closer inspection: the
existing test already serves the regression-guard role for the
rename. The doctrine reference that motivated the redesign was a
test-design *guideline*, not a forcing function for an
infrastructure project. The simpler answer was *keep the test
where it is, apply the doctrine tactically, do the rename*.

The cure: at every elaboration boundary, re-ask the first
question. If the answer is "yes, this elaboration is necessary",
proceed. If the answer is "no, the simpler tactic is sufficient",
take the simpler tactic.

### Failure Mode 2: Carry-On vs Adopt

Symptoms (when doctrine sharpens mid-execution):

- Options framed as "strict-old-shape vs expanded-old-shape".
- Both options violate the new doctrine in slightly different
  ways.
- Neither option adopts the new doctrine.

The framing presupposes the old shape is the only shape. That is
the failure. The reshape **is** the work.

Worked example: a doctrine on test-cycle composition sharpens
mid-execution. Higher-level test cycles need to be **composed**
from low-level cycle pairs that each land green; they cannot sit
red across many commits while the composition is built. Two
options surface: keep the high-level test red until the
composition is complete, OR expand the high-level test to cover
the new clause more broadly. Neither adopts the new doctrine. The
adoption is: compose the high-level test from low-level cycles;
each cycle lands green; the high-level test goes green in the
commit that adds the final composing piece.

The cure: when surfacing options after doctrine sharpens, the
question is always "how do we adopt the new doctrine?", never
"do we adopt or do we carry on?". Carry-on is not on the table.

## The Warrant Ladder and Its Provenance Rung

The owner taught the re-derivation at three queue boundaries in two days
(2026-08-11 twice, 2026-08-12): a ratified plan's remaining items are
re-derived per item at every elaboration or queue boundary, adversarially,
up the ladder *what does this serve → who consumes it → what breaks if it
is never done → is the warrant owner word, a measured defect, or momentum
and symmetry*. Ratification stamps a plan as of a moment; it owner-locks
nothing. The shapes the questioning kept catching: symmetry with a landed
cure posing as a warrant; instruments built to find nothing; preconditions
masquerading as queued work; a partial re-affirmation silently carried
whole (a verdict naming a sub-part re-affirms only that sub-part); and
latent-defect polish over-served because the seat built the instrument.
Owner-verbatim items survive; derived rulings survive while the ruling
binds; momentum and symmetry items park; latent polish parks until
evidence. The ladder runs on work already in flight too: a card-ratified
PR whose framing never asked what impact the work buys is not settled by
the card, because an answer inherits the quality of the framing it
answered. Re-scopes land as dated plan amendments, never silent drops.

The ladder is circular unless the problem statement itself is traced
(2026-08-12, half an hour of the owner's time to surface). An item survived
two adversarial re-derivations because each answered "what does this
serve" FROM THE ITEM'S OWN DESCRIPTION; the chain that manufactured it ran
sweep code claiming jurisdiction over external skills, a review that ruled
the state acceptable with a disposition sentence appending "cure routed",
exemption doctrine giving the routed cure a clock, a card whose either/or
presupposed removal, one owner word, and a ticket calling itself
"owner-ratified". Owner: "it might just be the opinion of a prior agent,
redigested repeatedly until it gained authority." The rung BEFORE the
ladder: trace the problem claim to an owner observation or to a first-hand
reproduced defect in territory we own. A "problem" that exists only
relative to our own machinery's assumptions (our validator flags it, our
sweep needs an exemption for it) quarantines until the assumption is
verified; the machinery may be the misconfiguration, and in that instance
it was (our validation was adjudicating an external system, which
`testing-strategy.md` already forbade). A queue item that defends itself in
jargon is the self-signal (`no-hedging-vocabulary`).

At an elaboration boundary, restate what a proxy stands for before acting on
the proxy: a lane name read as one hierarchy of two use cases, a line limit
read as a question of room, and a count sent before its returns were in were
one generator (owner-corrected twice, 2026-09-24).

## Companion Discipline

This rule pairs with `principles.md` §Architectural Excellence Over
Expediency, which forbids surfacing a "cheap cure" / "quick fix" /
"land it then iterate" option as a legitimate trade-off. The
present rule extends the same shape to mid-execution doctrine
sharpening: the question is never "should we adopt", only "how".

## What to Do Instead

| Impulse | Wrong move | Right move |
|---|---|---|
| "The plan says do X next" | Do X without re-asking whether X is the right next step | Re-ask the first question at the elaboration boundary; do X if it survives, replace it if not |
| "Doctrine just sharpened; what about the in-flight work?" | Surface "carry on with old shape" vs "expand old shape" | Surface "how do we reshape this work to adopt the new doctrine"; the reshape is the work |
| "A reviewer wants new infrastructure" | Build the new infrastructure | Re-ask: does the existing surface, with a tactical fix, suffice? If yes, take the tactic |
| "The ADR calls for a forcing function" | Build the forcing function | Read the ADR carefully — most "guidelines" are not forcing functions; if the directive is a guideline, apply it tactically |

## Doctrinal Anchors

- principles.md §First Question (the principle this rule
  operationalises)
- principles.md §Architectural Excellence Over Expediency (the
  related option-presentation discipline)
- principles.md §Owner Direction Beats Plan (the conflict-surfacing
  discipline that handles the case where plan and principle
  disagree)
- `plan-body-first-principles-check.md` (the related rule that
  fires at plan authoring; this rule is the runtime companion that
  fires at execution-time elaboration boundaries)

## Enforcement

This is a discipline at output-time and at decision-time. The
related plan-body first-principles check rule fires at plan
authoring; this rule fires every time the plan or a finding
suggests new work, and every time doctrine sharpens. The signal is
behavioural, not hook-enforceable; the rule is the named
discipline that authoring agents apply.
