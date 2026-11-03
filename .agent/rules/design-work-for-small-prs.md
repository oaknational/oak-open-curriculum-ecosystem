---
classification: core
description: "Work is DESIGNED to deliver as small, safe PRs — decomposition happens at plan/ticket/stack shaping time, not at PR-open. Owner sizing bands (2026-07-27, permanent doctrine): ~5 files changed normal, 10 acceptable, 20 a problem. Purpose is reviewer-comment complexity; one mechanism among several, never a substitute for review triage or round convergence. The bands have a floor: every PR pays a flat cost, so changes that share a story go as one PR inside the bands (PDR-132 item 7)."
---

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
- **The bands have a floor as well as a ceiling**: every pull request pays
  a flat cost whatever its size, so a slice smaller than its story needs
  costs more than it saves. Changes that share a story go as one pull
  request inside the bands, never one per line or per row (PDR-132
  §Decision item 7, the owner's word of 2026-09-26).
- **Worked instances**: the 92-file landing-page PR whose 43 threads never
  converged (restacked by owner ruling as six small PRs); the 30-file PR
  that ran ten review rounds. Both predate the bands; both are why they
  exist. A third, inside the bands (2026-09-06, a 26-path SDK changeset):
  nine of ten review findings across two rounds hit its one
  filesystem-touching script, and the writer plus its ADR amendment was a
  second review story a split at open would have isolated — a script that
  touches the filesystem earns its own PR beside pure renderers.
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

A review tool's size cap is one more reason the PR is shaped small at design time: the owner's own
/ultrareview on PR 66 "was refused by the tool ("too large: 21 files, 16,235 lines")", and the seat
had to cut four subset fixtures to review it at all (Jackal wakes Nocturne's resume record of
2026-09-06, event 13ed5809).

A new owner ruling lands alone, as its own pull request, the day it is given; its later homing
by a consolidation pass rides with its neighbours. One ruling carried in two estates merged
within an hour where it was its own pull request, and was still unlanded twenty-two hours later
where it rode a bundle (2026-09-24 to 25). Frame an intake as concepts, the owner's rulings first, so that a bundle
shows as one: an intake framed as a file merge did not trip this rule. And no slice ships text
that is false until a later slice lands: a slice was re-cut because its header and a note
described what the next slice would add (2026-09-28).
