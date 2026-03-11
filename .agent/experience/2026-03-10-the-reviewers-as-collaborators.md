# The Reviewers as Collaborators

_Date: 2026-03-10_
_Tags: tdd | types | collaboration | discovery_

## What happened (brief)

- Implemented the canonical URL validation layer (WS1-WS5) via TDD, then ran
  four specialist reviewers. Each reviewer surfaced something different that
  improved the final result.

## What it was like

The implementation itself was straightforward — binary search, Result pattern,
type guard. The TDD cadence felt natural: write the test, watch it fail,
implement, watch it pass. What was interesting was what happened *after* the
implementation was green.

Each reviewer brought a different lens. The test-reviewer caught that IO tests
were mixed with pure-function tests and that a silent `return` was a prohibited
skip equivalent. Fred caught the type guard was too narrow and the error type
needed machine-readable discrimination. The code-reviewer caught that
`localeCompare` could silently diverge from sort order. Wilma caught that binary
search trusts its input — an unsorted array wouldn't crash, it would lie.

That last finding was the most interesting. The sortedness check was a small
addition — ten lines — but it closed a category of silent failure. The binary
search was *correct* in isolation, but *fragile* in context. Wilma's adversarial
lens saw what the implementation lens couldn't: the contract between the loader
and the searcher was implicit, and implicit contracts fail silently.

## What emerged

The reviewer system isn't just a quality gate — it's a design tool. Each pass
didn't just find bugs; it reshaped the architecture. The discriminated union
error type, the comprehensive type guard, the sortedness invariant — none of
these were in the original plan. They emerged from the conversation between
implementation and review.

## Technical content

- `localeCompare` gotcha extracted to `distilled.md`
- Sortedness invariant documented in source TSDoc
- No new code patterns met the four-criteria barrier (first occurrence)
