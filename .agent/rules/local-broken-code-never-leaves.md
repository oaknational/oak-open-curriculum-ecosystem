# Local Broken Code Never Leaves

Operationalises the **Local broken code never leaves** principle in
[`.agent/directives/principles.md § Code Quality`](../directives/principles.md#code-quality).

## The Invariant

Broken code is **never acceptable**. The local-only constraint is not
an excuse to tolerate brokenness; it is the discipline that prevents
brokenness from reaching other agents, reviewers, CI, and production
before you finish fixing it.

The principle has two halves and both must be held:

1. **Broken code must be fixed, not tolerated.** Even locally,
   broken state is not a working state. "It's just broken locally"
   is not a stable resting position; it is an in-progress fix that
   has not yet landed.
2. **Local broken code never leaves the local environment.** No
   `git push`, no PR open, no MR push, no remote-branch update until
   the change is **proven to work** in the form it is supposed to
   run.

Local commits are fine — they are local snapshots and reversible.
**Pushing is the public act** that publishes state to peer agents
and reviewers. Pushing broken code:

- burns peer-agent and reviewer cycles on diagnosis the author could
  have closed with one more local check,
- pollutes the shared branch with state nobody can trust,
- destroys the load-bearing invariant that "the remote branch is in
  a state we can run against."

## What counts as "proven to work"

The proof is **observed behaviour, not the absence of red**. Common
proofs by change shape:

- **New / changed test**: the test runs locally and passes (red →
  green for new tests; green for changed tests).
- **New / changed CLI subcommand**: the command runs locally and
  exits with the expected stdout / stderr / exit code.
- **New / changed UI**: the dev server starts; the relevant page
  renders the expected state; the golden path is exercised in a
  browser.
- **New / changed API route or handler**: a request to the route
  returns the expected response (curl / fetch / integration test).
- **New / changed migration**: the migration runs forward and back
  locally against a representative dataset.
- **Refactor**: the existing test suite passes AND the touched
  surfaces are observed running unchanged (the refactor's
  no-behaviour-change claim is verified, not asserted).
- **Documentation-only change**: the affected pages render correctly
  (markdown lint clean + visual scan); no behavioural proof needed.

## What does NOT count as proof

- *"It compiles"* — compilation is necessary, not sufficient.
- *"The type-checker is happy"* — same.
- *"The tests pass without me running the changed test"* — the
  changed test must run.
- *"The lint passes"* — lint is a syntactic property, not a
  behavioural one.
- *"I think it works"* — observation, not opinion, is the proof.

## When the proof is hard to obtain

Some changes are hard to prove locally:

- Infrastructure changes that only exercise in CI.
- Cross-environment effects (production-only feature flags).
- Cron / scheduled work whose trigger condition is hard to simulate.

In these cases the proof can be **a documented plan for how the proof
will land** (e.g., "the CI run on the PR will exercise this code path
because X, Y, Z"). This is a deliberate handoff to a downstream gate;
it is NOT a licence to push first and hope, and it is NOT permission
to leave the code broken locally. The local state must still be
broken-only-in-the-named-axis; everything else must be working.

If neither local proof nor a clear downstream-proof path exists, the
change is not ready to push.

## Composition with existing principles

- Pairs with [`never-disable-checks`](never-disable-checks.md): the
  gates must be on AND the change must be observed running. Gates-on
  is necessary; gates-on plus broken-runtime is still broken code.
- Pairs with [`no-warning-toleration`](no-warning-toleration.md): a
  warning is the cheap version of the failure it names; "warning but
  it ran" is not proof, because the warning's failure mode has not
  been exercised.
- Pairs with [`dont-break-build-without-fix-plan`](dont-break-build-without-fix-plan.md):
  if a multi-commit sequence intentionally has broken intermediate
  states, those states remain LOCAL until the sequence ends green.

## The "but it's just" exceptions

There are none. Common rationalisations and their refusals:

- *"But it's just a typo fix"* → still build it and observe it
  rendering / running.
- *"But it's just a doc change"* → markdown lint + render check is
  the local proof; it's cheap, run it.
- *"But it's just a comment"* → no proof required if truly only
  comments; verify the diff is comment-only.
- *"But CI will catch it"* → CI is a backstop, not a proof. Pushing
  with the expectation that CI will tell you whether your change
  works is making the team's compute pay for your local check.
- *"But the previous commit was clean"* → the current change is the
  one being pushed; it needs its own proof.

## Owner-direction status

Standing. Established 2026-05-11 (initial framing as "broken code
stays local" sharpened immediately by owner: the stays-framing
implies broken code is okay while local, and broken code is never
okay). Applies to every push, on every branch, by every agent on
every platform.
