# No Parallel Long-Lived Branches

`main` is the sole integration point and the only place code is real. Branches
exist to carry ONE small change to `main` and die; a branch that lives long
enough to diverge is a defect, not a workflow.

## Trigger

Creating any branch; opening any PR; noticing any branch older than a working
day or any second coordination-shaped branch.

## Action

- **Every work branch is short-lived and single-ticket**: created from current
  `main`, carrying one Linear-ticketed atomic change (small diff, few commits),
  PR'd to `main`, merged or closed within hours — never days. If work outgrows
  the ticket, STOP and split; never let the branch absorb a second story.
- **`main` is the target of every PR.** No branch targets another branch; no
  stacked long-lived chains.
- **Exactly ONE sanctioned rolling branch exists**: the current coordination
  branch (`coordination/<name>`), which carries the live coordination-surface
  estate (session records, continuity documents, reports) to `main` through
  normal PRs. It is kept CURRENT, not divergent: after every `main` update it
  merges `main` back in (`git merge origin/main`, conflicts resolved as
  semantic unions — pure addition, both lineages conserved). A second
  coordination-shaped branch is a defect; supersede or merge it the day it is
  noticed.
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
AIP-128 (Linear-ID branch gate in the shared hooks), AIP-129 (`pr-contract`
required CI status: ticket link + size bounds). The stray-code register
pattern (`.agent/reports/agentic-engineering/stray-code-register-2026-07-16.md`)
is the audit shape when drift is suspected: enumerate, commit, PR, adjudicate.
