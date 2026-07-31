# Design Work for Small PRs

**TRIGGER — this rule fires at work-SHAPING time**: plan authoring, ticket
scoping, stack design, lane briefing — the moment a body of work takes its
delivery shape. It does not first fire at PR-open; by then a mis-shaped
changeset is already expensive to split. The pr-lifecycle Phase 1 sizing
check is this rule's downstream backstop, not its home.

Owner ruling (2026-07-27, permanent doctrine, verbatim): *"we need all work
in small, safe PRs, 5 files changed normal, 10 acceptable, 20 a problem.
This is to keep the compexity of reviewer comments minimised. It is not the
only mechanism for that, but it is a helpful one"* — and, escalating it:
*"that is now a permanent rule and doctrine, design work to be delivered in
small PRs."*

## The rule

- **Work is DESIGNED to deliver as small, safe PRs** — decomposition into
  ~5-file stories happens upstream, in the plan, the ticket chain, or the
  stack shape, so each PR is born small rather than split under review
  pressure.
- **The sizing bands**: ~5 files changed is the NORMAL shape; 10 is
  acceptable; 20 is a problem. A design whose natural slices exceed 10
  files gets re-decomposed before any branch is cut.
- **The purpose is reviewer-comment complexity**, and the bands are one
  helpful mechanism among several — the review-triage rule and the
  round-convergence predicate are siblings, not substitutes. Meeting the
  band never excuses skipping the others; exceeding it is never cured by
  arguing the others suffice.
- **Worked instances**: the 92-file landing-page PR whose 43 threads never
  converged (restacked by owner ruling as six small PRs); the 30-file PR
  that ran ten review rounds. Both predate the bands; both are why they
  exist.
- Archival-class and generated-artefact changesets keep their PDR-132
  exemption — the bands govern authored work.
- **The indivisibility exception is proof-shaped, never convenience-shaped**
  (adjudicated 2026-07-30): bundling into one large PR is licensed only when
  the PROOF is indivisible — a mutual value-import cycle makes ordering
  arithmetically impossible, or the split slice would be an unreviewable
  object (a type-only PR with no consumer). An exception granted on such
  proof is explicitly not precedent for bundling on convenience.

Related: `pr-lifecycle` §Phase 1 (the downstream check), `ticket-management`
(one story per ticket), `proportionality` (the SCOPE axis), PDR-132 (round
budgets bind at authoring time).
