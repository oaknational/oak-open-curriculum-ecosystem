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

- per-user feedback memory: `feedback_question_shape_known_bad_vs_adopt`
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
