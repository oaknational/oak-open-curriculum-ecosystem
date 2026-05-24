---
name: "Untracked WIP Whole-Tree Lint Blocker"
polarity: anti-pattern
use_this_when: "A multi-agent workspace has untracked work-in-progress and another agent's commit or push is blocked by whole-tree quality gates."
category: agent
status: proven
discovered: 2026-05-23
proven_in: >-
  2026-05-22 to 2026-05-23 multi-agent gate-1a substrate-floor team
  session: three instances where one agent's untracked work-in-progress
  blocked another agent's whole-tree pre-commit or push checks.
proven_date: 2026-05-23
adjacent: ".agent/rules/local-broken-code-never-leaves.md; .agent/rules/dont-break-build-without-fix-plan.md; .agent/memory/active/patterns/honest-restructure-over-band-aid.md"
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Treating untracked local work as private when shared whole-tree gates make it a team-visible blocker."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a failure mode to avoid:
> untracked work-in-progress is treated as private while whole-tree gates
> make it visible to every peer trying to commit or push.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

# Untracked WIP Whole-Tree Lint Blocker

In a shared multi-agent working tree, untracked work-in-progress is not
isolated just because it is uncommitted. Whole-tree quality gates scan
the workspace state, so one agent's untracked file with lint, format,
type, or markdown errors can block another agent's otherwise clean
commit or push.

The anti-pattern is the mental model "my untracked WIP is local to me".
In this repo's collaboration model, whole-tree gates make the current
working tree a shared substrate. If your untracked WIP is broken, every
peer using that tree can inherit the gate failure.

## Diagnostic

This pattern fires when all of the following are true:

1. Agent A has untracked or unstaged work-in-progress in the shared
   working tree.
2. Agent B attempts a commit or push whose own staged bundle is clean.
3. The hook or gate fails on Agent A's untracked/unstaged file.
4. The failure is not a staged-bundle ownership issue; it is a
   whole-tree cleanliness issue.

The important distinction: pathspec discipline protects what enters a
commit, but it does not make whole-tree gates ignore broken untracked
state.

## Worked Instances

**Instance 1 — Foamy blocked Sparking's t20 commit.**

Foamy's untracked `packages/core/graph-core/src/graph-view/index.ts`
carried eight ESLint errors, including a `max-lines` failure. Sparking's
t20 first commit attempt failed on Foamy's untracked WIP. Foamy cleared
the blocker by splitting the module into a small barrel, a types module,
and an interface module: an honest restructure rather than a lint
band-aid.

**Instance 2 — Sparking blocked SVW's t10 commit.**

Sparking's untracked
`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/freshness.ts`
carried four TSDoc errors and one type-assertion lint error. SVW's t10
first commit attempt failed on that untracked WIP. Foamy sent a directed
diagnostic with concrete fix shapes; Sparking resolved the issue by
deleting the premature binding test per the `no-conditional-tests`
doctrine and amending the plan.

**Instance 3 — Sparking's WS2.3 parser WIP blocked later pushes.**

Sparking's untracked Turtle parser work carried prettier formatting
errors that blocked subsequent pushes. Shade landed a peer-format cure
at `644c937b`.

## Cure

The immediate cure is a directed peer diagnostic with the exact failing
file, rule, and candidate fix shape. This should happen over the shared
coordination channel, because the blocker has already become shared
state.

When you own the broken WIP, the cure is one of:

- fix the WIP immediately,
- narrow it into a known clean shape,
- move it out of the shared tree if it is not ready to participate in
  whole-tree gates,
- or explicitly coordinate a short-lived broken-gate window with a named
  fix plan, if the repo's current rules permit that shape.

The durable cure is usually the sibling positive pattern:
[`honest-restructure-over-band-aid`](honest-restructure-over-band-aid.md).
If the gate is pointing at a real design seam, restructure the work
rather than adding a superficial bypass.

## Composition

- [`local-broken-code-never-leaves`](../../../rules/local-broken-code-never-leaves.md)
  names the invariant that broken code is not an acceptable resting
  state.
- [`dont-break-build-without-fix-plan`](../../../rules/dont-break-build-without-fix-plan.md)
  names the cross-agent coupling: whole-tree breakage blocks peers.
- [`honest-restructure-over-band-aid`](honest-restructure-over-band-aid.md)
  names the positive response shape when the gate is surfacing a real
  design concern.

## Graduation Status

Graduated from
[`pending-graduations.md`](../../operational/pending-graduations.md)
on 2026-05-23 after three same-session instances established the
failure mode and the working peer-diagnostic cure.
