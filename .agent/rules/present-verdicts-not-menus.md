# Present Verdicts, Not Menus

Operationalises the standing feedback memories
[`feedback_no_responsibility_passback`](../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_no_responsibility_passback.md)
(origin 2026-05-09) and
[`feedback_answer_verification_questions_directly`](../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_answer_verification_questions_directly.md)
(origin 2026-04-24), together with
[PDR-057](../practice-core/decision-records/PDR-057-empirical-answerability-pre-question-gate.md)
(apply-don't-ask doctrine) and
[PDR-058](../practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md)
(stop-inventing-optionality).

## The Rule

When analysis is complete and a verdict has formed in the agent's own
reasoning, the agent **presents that verdict**. Converting completed
analysis into an `AskUserQuestion` multiple-choice form is
responsibility-passback dressed as deference.

The shape is structural, not vocabulary. If the agent could itself rank
the options by evidence already in context, surfacing them as a quiz to
the owner is the failure pattern, regardless of how the question is
phrased.

If the available doctrine, evidence, and long-term architectural
excellence frame leave only one defensible answer, there is no
question to ask. State the forced verdict and the evidence that makes
alternatives non-viable.

## Legitimate Uses of AskUserQuestion

`AskUserQuestion` (and equivalent multi-choice surfaces) is reserved for:

1. **Genuine permission gates.** Destructive operations, scope-expansion
   the owner has not authorised, irreversible actions on shared systems.
   Per `executing-actions-with-care` system guidance.
2. **Decisions only the owner can make.** Priorities between equally
   valid technical paths, undocumented preferences, scheduling, context
   the agent cannot derive from the codebase or memory.
3. **Exploration of design intent before verdict is possible.** When the
   agent genuinely has no strong basis for a position (early planning,
   ambiguous scope, novel domain), surfacing 2–3 approaches with
   trade-offs is the right move. This is the case the `oak-plan` skill's
   §Before Writing item 1 is written for.

## Illegitimate Uses (the trip-list shapes)

- Converting completed analysis into a multiple-choice form ("Which of
  these three findings is correct?" when the agent already knows).
- Asking the owner to choose after the evidence has forced a single
  defensible route.
- Spreading a single position across options to avoid commitment
  ("Option A: my verdict. Option B: the opposite. Option C: a hedge.").
- "Do these look fine?" after analysing them oneself.
- Quizzing the owner to ratify a verdict already evidenced in context.
- Asking what to prioritise when the brief already names the priority.

## Diagnostic

The reliable tell: *could the agent rank these options by evidence
already in context?* If yes, the quiz is evasion. Either commit to the
verdict, or do the missing analysis until ranking is possible.

## Pre-Pose Viability Check

Before presenting any `AskUserQuestion` options, run the option list through
the same judgement you would apply if no owner were present:

1. Name the evidence and doctrine that supports each option.
2. Ask whether you would actually take that option yourself.
3. Remove every option you would refuse to take.
4. Count the survivors:
   - **Zero**: keep analysing; you do not yet have a viable action.
   - **One**: state the verdict and invite correction, not selection.
   - **Two or three**: `AskUserQuestion` is legitimate if the choice still
     belongs to the owner under the legitimate-use criteria above.

Options that fail this screen are not respectful alternatives. They are
anti-shapes offered as owner work.

## What to Do Instead

1. **State the verdict** in the first sentence. Sound / concern /
   unsound; correct / incorrect; recommended / rejected.
2. **Cite the evidence** that produced the verdict — file paths, line
   numbers, ADR numbers, prior owner direction.
3. **Invite correction**, not selection. "Tell me which verdict is
   wrong and I'll re-analyse" is legitimate; "pick one of these three"
   over the agent's own findings is not.
4. **Reserve `AskUserQuestion`** for the three legitimate cases above.

## Doctrinal Anchors

- `feedback_no_responsibility_passback` (origin 2026-05-09): "it is
  your job to analyse and then present results, not to try to pass off
  the responsibility back to me."
- `feedback_answer_verification_questions_directly` (origin
  2026-04-24): yes/no + evidence; breadth as evasion is a named
  anti-pattern.
- `feedback_user_attention_means_analyse_report_flag`: when work
  requires user attention, analyse → report → flag; never silently
  defer, and never quiz instead of reporting.
- PDR-057 §Empirical-answerability pre-question gate: if the question
  is empirically answerable from the codebase/memory, the agent reads
  rather than asks.
- PDR-058 §Three-tier optionality decomposition: decision optionality
  is subsumed by PDR-057; design optionality routes to closed-shape
  cure; outcome optionality routes to falsifiability cure.

## Source Landing

Question-assumptions session 2026-05-11 (`Flamebright Burning Lava`).
The agent surfaced three correct assumption-breaks against an incoming
brief, then converted the findings into a 3-question `AskUserQuestion`
multiple-choice form rather than presenting verdicts. Owner called the
pattern out; both feedback memories were in context but did not nudge
the surface in time. This rule lands the doctrine in the
always-applied tier so the nudge fires earlier next time.

2026-05-26 n=2 enforcement-bundle closeout: an agent offered several
architecturally indefensible WIP-disposition options alongside the one route
that survived its own analysis. Owner clarified the per-decision discipline:
surface open decisions only after reflecting through the long-term
architectural excellence lens; in that worked instance, no open question
survived that lens. This added the pre-pose viability check above.
