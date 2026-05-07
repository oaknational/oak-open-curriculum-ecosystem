# Monitor Branch Touched Files

## Rule

**Periodically check how many unique files the current branch has touched since
it diverged from main. Treat the count as a scope-shape signal, not a vanity
metric.**

Run:

```bash
pnpm agent-tools:branch-touched-files -- --base origin/main --head HEAD
```

Check at these moments:

+ session start on a feature branch;
+ after merging or rebasing main;
+ before broadening scope beyond the active plan;
+ before committing a large chunk or refreshing a PR handoff.

## Thresholds

+ **< 50 files** — no warning. Continue normally.
+ **50-99 files: soft warning** — inspect the touched-file list and confirm
  the branch still has one coherent outcome.
+ **100-149 files: hard warning** — pause scope expansion until you have
  refreshed the plan direction and named what remains to land.
+ **150+ files: critical warning** — stop broadening the branch. Produce an
  owner-visible split plan before adding more scope unless the owner explicitly
  authorises continuing as one PR.

## Behavioural Guidance

At soft or higher, write down the answers before continuing:

+ Where are we now?
+ Where do we need to get to?
+ What impact and value is the branch meant to deliver?
+ What is the shortest route from the current state to that target?
+ Which file, package, product, documentation, or practice boundaries could
  become self-contained PRs that still land working value?
+ Which work should be deferred, split, or explicitly declared out of scope so
  the branch stays reviewable?

At hard or critical, the next action should be planning and split analysis, not
more implementation. Prefer working, self-contained PRs over one oversized PR
that hides multiple decisions, test surfaces, and review concerns behind a
single diff.

The count does not mechanically block work. Owner direction can override it.
The rule exists to force visible judgement before a branch becomes too large to
review safely.
