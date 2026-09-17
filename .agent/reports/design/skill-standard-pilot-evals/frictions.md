# Eval iteration 1 — frictions

Harvest material for the skill-craft skills the parent plan names as a WS9
candidate (skill-design, skill-writing, eval-design, eval-running). Recorded
at occurrence across iteration 1 and its review round, 2026-08-12. Each entry
is what actually got in the way.

The dominant lesson of the round has its own section at the end.

## A grader's tokeniser is a claim about the domain, and mine was wrong

`trunkClasses()` matched `[a-z0-9-]+`, which stops at an underscore. The
design system uses BEM element classes — `.oak-btn__icon`,
`.oak-quiz-answer__key`, `.oak-accordion__body` — so the scan recorded the
BLOCK and silently dropped the ELEMENT. A page using the real
`oak-btn__icon` was then scored as having invented it.

That single character published a false headline: an invention rate of 4.7%
where the true rate was 0%, plus a routed machinery-gap finding (F3) about
"near-miss BEM classes" that described nothing but my own bug. The grader
now asserts at startup that the trunk scan finds at least one `__` class, so
this regression cannot recur silently.

*Route:* eval-design skill. A grader needs a self-check that fails when its
own tokeniser stops seeing a category it is supposed to see.

## Three artefact shapes, three false negatives, one parser

The theming grader's selection detector was rewritten to parse what a
control actually offers instead of searching text. It then failed three
times against real artefacts, each time reporting "offered set is empty" for
a control that offered themes:

1. `<option value="…">` — the only shape the first version knew.
2. `<button data-theme-choice="…">` — a button group, found when grading the
   without-skill leg.
3. `{ light: 'Light', dark: 'Dark', … }` — an object map, found when grading
   the estate's OWN reference switcher, the implementation DDR-004 cites as
   carrying the working statement.

Each fix was one more shape bolted on. Every one of them is now a control
fixture, so the next regression is caught — but the pattern is the finding,
not the individual gaps.

*Route:* WS8-general. Regex reading of source is the wrong instrument for
"what does this control offer". The honest next step is a real parser over
an AST, and the grader's header now states that limit rather than implying
completeness.

## An assertion that can pass by doing nothing is not an assertion

The first version of the page grader had `no-literal-design-values` and
`zero-ad-hoc-css` both pass on an artefact that authored no CSS at all. The
ungrounded baseline scored better than the grounded one on those two purely
by writing less. Iteration 1's honest reading needed both assertions plus a
composition measure, which the suite does not yet have.

*Route:* iteration 2 of this suite; recorded as finding F2 in `benchmark.json`.

## The negative control is the part that earns the green

`grade-theming.ts` returned green on the reference implementation with the
evidence "data-theme values written: none" — a true pass that would have
read identically had the detector been broken. Every assertion in both
suites now has a control that must fail it, and the theming suite has
per-boundary controls in both directions, so a green run distinguishes a
conforming artefact from a blind grader.

Two of those controls were themselves wrong on first write and had to be
corrected: `dataset.themeChoice` matched a `dataset.theme` read pattern with
no word boundary, failing a conforming positive.

*Route:* standard clause candidate. An eval suite without per-boundary
controls in both directions is not evidence.

## `validate-authored-css` cannot grade an arbitrary file

The repo's authored-CSS gate walks a fixed workspace root, so the eval could
reuse its CLASSIFIER (`demos/oak-design-showcase/tools/css-literal-values.ts`)
but not its walker. The classifier also lives inside a demo workspace, so a
grader in the skills tree reaches it through a seven-segment relative
import — correct, and fragile to any move of either end.

*Route:* WS8-general. A `--path` mode on the validator would make the gate
and the eval the same instrument, and the classifier wants a home a grader
can import by package name.

## Response-shaped cases need their own grader mode

Cases (a) and (b) produce files. Case (c) produces a REPLY, and grading it
with the page grader failed a conforming answer twice over: the extractor
never looked inside fenced ```css blocks (so a one-off rule handed over in
prose was invisible), while the class-reference assertion was binding (so a
correct answer that names no classes failed for the shape of its reply).
`frictions.md` in the first round claimed fences were handled; they were
not, and that claim was wrong when written.

*Route:* eval-design skill. Artefact-shaped and response-shaped cases are
different case kinds with different graders, not one grader with a flag
bolted on afterwards.

## The without-skill leg needs a sandbox, not a promise

A clean-context subagent given a repo path will read the repo, which
destroys the comparison, so each ungrounded leg is told as a hard constraint
not to read anything under the repo root. That is an instruction, not an
isolation boundary, and it is a deviation from the spec's blind comparison.
Separately, one grounded leg copied design-system CSS files beside its
output despite being told not to — instructions to legs are honoured
approximately.

*Route:* eval-running skill. "Without skill" needs a sandbox.

## The identity ratchet fires on moved text, not just new text

Re-homing reference substance moved a line naming a counter-brand into a new
file, which the identity-naming ratchet correctly read as a new occurrence
of the outgoing identity. The re-home was reshaped so the named line stays
in the entry. A pure move of existing prose can trip a content ratchet, and
the failure arrives at commit time rather than authoring time.

*Route:* skill-writing skill.

## The lesson of the round

Every defect above is the same defect: **the instrument was trusted because
it was green.** The tokeniser, the text search, the selection parser, the
prose extractor and the case-(c) mode each produced confident output that
was wrong, and each was caught only by an outside reader or by checking a
result against the artefact by hand. Iteration 1's published benchmark
asserted a 4.7% residual and routed a finding for classes that exist.

The eval discipline that follows from this is not "write more assertions".
It is: **an assertion's evidence string must be checkable against the
artefact by eye, and somebody must actually check it.** The graders now emit
the offered set, the offending CSS rule, and the read-to-sink path rather
than a bare verdict, precisely so the next reader can falsify them in
seconds.

*Route:* eval-design skill, as its opening principle.
