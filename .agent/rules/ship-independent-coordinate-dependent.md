# Ship Independent, Coordinate Dependent

Operationalises
[PDR-077 (Marshal as Cycle Discipline)](../practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md)
and the owner-directed 2026-05-25 PR #115 marshal-cycle retrospective
captured in
[pending graduations](../memory/operational/pending-graduations/2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md).

## Rule

When a work bundle contains both independently shippable fixes and
coordination-dependent substance, ship the independent fixes first unless the
owner has explicitly asked to optimise for a single combined push.

Bundling is not the default. A verified trivial or mechanical fix that can land
within standing authorisation should become visible at its impact surface
promptly: origin-visible commit, addressed review comment, refreshed CI signal,
or equivalent. The coordinated work continues in parallel under its own claim,
review, and marshal path.

## Trigger

This rule fires before a commit marshal, coordinator, or implementer bundles
multiple work items into one commit, queue intent, or push window.

Ask the action-visibility question:

> Would this bundle defer an independent item's impact artefact?

Impact artefacts include:

- a commit visible on origin;
- a review comment marked addressed;
- a CI or quality-gate run triggered by the fix;
- a blocker removed from a PR or handoff queue.

If yes, split the bundle unless the owner has explicitly prioritised a single
combined push over earlier visibility.

## Action

1. Identify which items are independently shippable and which items genuinely
   depend on coordination.
2. Ship the independent item as its own commit or queue intent, with normal
   explicit-pathspec and gate discipline.
3. Keep the coordination-dependent item in its own claim, queue intent, or
   handoff bundle.
4. If the owner asks to minimise CI run count or push count, record that owner
   direction in the commit or comms evidence before bundling.

## Forbidden Shapes

- Holding trivial verified fixes behind a substantive curation, doctrine, or
  multi-agent coordination bundle.
- Treating CI-economy as a marshal-unilateral reason to delay independent
  review-comment fixes.
- Calling a bundle "efficient" while it defers the first impact artefact of an
  independent item.

## Worked Instance

During the 2026-05-25 PR #115 marshal cycle, three review comments sat
unaddressed on origin while trivial fixes were bundled with substantive
coordinated work. The actual trivial fixes were small; the delay came from the
coordination ceremony around unrelated bundle members. The structural lesson is
that independent impact should ship independently, while dependent work
coordinates in parallel.

## Falsifiability

In the next mixed trivial-plus-substantive marshal cycle, a verified trivial fix
should ship and trigger its impact artefact within five minutes of
verification, regardless of the substantive bundle's coordination state. If the
split causes worse owner-visible cost than the delayed-impact bundle, this rule
needs refinement.

## Composition

- [`stage-by-explicit-pathspec.md`](stage-by-explicit-pathspec.md) still governs
  the staging boundary for the independent commit.
- [`check-singleton-per-window.md`](check-singleton-per-window.md) still governs
  whole-repo gate singleton behaviour. This rule decides bundle shape; it does
  not authorise duplicate gate runs.
- [`respect-active-agent-claims.md`](respect-active-agent-claims.md) still
  requires visible coordination when another agent owns the touched area.
