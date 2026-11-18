---
classification: core
description: Main is the sole integration point; branches are short-lived, single-ticket, and die at merge. One sanctioned rolling coordination branch only, kept current by re-merging main.
---

# No Parallel Long-Lived Branches

`main` is the sole integration point and the only place code is real. Branches
exist to carry ONE small change to `main` and die; a branch that lives long
enough to diverge is a defect, not a workflow. Throughout this rule, `main`
reads as the repository's default branch — derived at the moment of use,
never a literal (`downstream-checkout-never-writes-upstream-surfaces`); on a
downstream checkout it is whatever the remote's HEAD names.

## Trigger

Creating any branch; opening any PR; noticing any branch older than a working
day or any second coordination-shaped branch.

## Action

- **Every work branch is short-lived and single-ticket**: created from current
  `main` — or, for a build-ahead lane only, from the parent lane branch it
  builds on, the one start point this rule admits (below) — carrying one ticketed atomic change (small diff, few commits),
  PR'd to `main`, merged or closed within hours — never days. If work outgrows
  the ticket, STOP and split; never let the branch absorb a second story.
- **`main` is the target of every PR.** No branch targets another branch; no
  stacked long-lived chains. A build-ahead worktree cut from a parent lane
  branch (`worktree-hygiene` §1) is inside this rule, not outside it: its PR
  targets `main` from its first push (which waits for a free slot under the
  work-in-progress limit, owner 2026-10-02, the branch holding local commits
  meanwhile; a waiting branch's working day runs from the slot's opening, not
  from its cut, and a count that stays full past a working day is routed to
  the Director as a throughput question, never absorbed by the branch that
  waits), its base advances to `main` by one merge
  or a re-cut when the parent lands, and it lives no longer than the parent's
  landing plus its own — a short-lived single-story branch whose start point
  happens to be a sibling's tip, never a chain.
- **Exactly ONE sanctioned rolling branch exists**: the current coordination
  branch (`coordination/<name>`), which carries the live coordination-surface
  estate (session records, continuity documents, reports) to `main` through
  normal PRs. It is kept CURRENT, not divergent: after every `main` update it
  merges `main` back in (`git merge origin/<default-branch>`, conflicts resolved as
  semantic unions — pure addition, both lineages conserved). A second
  coordination-shaped branch is a defect; supersede or merge it the day it is
  noticed. PDR-127 (the team-branch coordination protocol) governs how work
  coordinates AROUND the one sanctioned rolling branch — scope claims,
  reconciliation, comms sweeps; it does not license additional long-lived
  branches, and any reading of it that would is superseded by this rule.
- **Estate roll-up PRs are cut as short-lived branches from the coordination
  tip, never opened from the rolling branch itself.** A PR whose head is the
  living coordination branch re-triggers a fresh bot review round on every
  later push to that branch — including pushes after the PR merges — and the
  merged PR becomes a review treadmill (worked instance 2026-07-17: a
  rolling-head roll-up accumulated 109 review threads; the cut-branch
  equivalent the same day closed at 5). Cut a branch at the tip, PR it, and
  delete it at merge under the `worktree-hygiene` branch-deletion contract
  (owner-authorised, content-verified — merge itself is the content proof
  for a cut branch whose tip the merge commit carries).
- **Whole-repo judgements bind only on `main`.** Unused-code verdicts, Sonar
  cures, knip entries, dead-file deletions, and consolidations made from a
  branch's view are void for any file whose consumers may live elsewhere —
  the 2026-07-16 worked instance: a Sonar cure on one branch deleted
  `refound-path-resolve.ts` as "unused" while its only consumers lived on a
  second unmerged branch, and main broke the moment both merged.
- **If it works, it goes in `main`** — green work held back on a branch is
  integration debt accruing interest. Merge-or-close is the daily default;
  "keeping it around" requires a named owner-agreed gate or the branch closes.

## Why

Finding-rate, review effort, and integration risk all scale with divergence
surface. Two branches, each blind to the other's tree, silently invalidate
each other's whole-repo reasoning; the longer they live the bigger the lie.
The 2026-07-16 four-PR arc (≈340 review threads, ~12 hours, one integration
break) is the measured instance; the owner's ruling (small PRs, tight DORA
metrics, ticket-first) is the standing cure this rule pins.

## Enforcement

Behavioural at branch/PR creation, plus mechanical layers as they land:
a ticket-ID branch gate in the shared hooks and a `pr-contract` required CI
status (ticket link + size bounds) as they land (OCE's means-home for the two
is its tickets AIP-128 and AIP-129). The stray-code register
pattern (OCE, 2026-07-16)
is the audit shape when drift is suspected: enumerate, commit, PR, adjudicate.
