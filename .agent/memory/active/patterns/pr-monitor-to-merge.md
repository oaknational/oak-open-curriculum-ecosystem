---
name: "PR Delivery: Monitor to Merge, Flat Stacks, Pure Diffs"
polarity: pattern
use_this_when: "Opening a pull request, choosing the base for a dependent change, or resolving merge conflicts that touch shared registry state."
category: process
layer: general
proven_in: "PR arc #152–#198 (2026-06-10 → 2026-06-12); owner-shaped 2026-06-10"
proven_date: 2026-06-10
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Abandoned-at-open PRs whose bot findings go unadjudicated, serial stacks that make fixing earlier PRs hard, and feature diffs carrying shared-registry state that conflicts with every other open PR by construction."
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: a PR is a live
> obligation from open to merge, based flat on main, carrying a pure
> diff.

## The shape

- **Monitor to merge.** Opening a PR creates a monitoring obligation
  that ends at merge: watch checks, **inline review comments** (`gh api
  repos/.../pulls/N/comments` — invisible to `gh pr view --json
  comments`, which returns only issue/timeline comments), AND the PR's
  **own terminal state** (`state`/`reviewDecision`/`mergedAt` — a
  check-bucket-only monitor is blind both to the merge itself and to
  inline reviews); emit and exit on `MERGED`/`CLOSED`. Adjudicate every
  bot/reviewer finding first-hand — both halves matter (refute false
  claims with source grounding; apply true ones — review bots have
  caught real second instances of defect classes the author had only
  patched once); reply with the verdicts on the PR. Each push re-triggers
  the bots, so batch fixes into one push to converge the re-review loop.
  **Monitor mechanics**: key the check-dedup on the **head SHA**, not the
  check name — a name-keyed monitor won't re-report a re-run's checks after a
  branch update (the names match the prior run's strings), so per-push tracking
  silently breaks. And emit on **every terminal bucket** (pass AND
  fail/skip/cancel), never `pass` alone — a pass-only filter makes a failure
  indistinguishable from "still running" (silence ≠ success).
- **Flat stacks.** Base PRs directly on main rather than serial stacks
  (stacks make fixing earlier PRs hard — owner, 2026-06-10);
  retarget/flatten as bases merge. **A stacked _working branch_ is allowed;
  a stacked _PR_ is not.** When slice N+1 depends on unmerged slice N, build
  N+1 on a working branch stacked on N's branch (keeps momentum — do not idle
  the critical path waiting for review), but **do not open N+1's PR until N
  merges**; then rebase N+1 onto fresh `origin/main` (N's commit drops out) and
  open it **flat** as a single-deliverable diff. Momentum of stacking + the
  clean diff of waiting. **Recovery** when a commit lands on the wrong (prior
  slice's) branch: `git switch -c <new> origin/main` → cherry-pick the commit
  onto fresh main (disjoint changes auto-merge clean) → `git branch -f
  <prior-branch> origin/<prior-branch>` to reset the prior pointer — the same
  non-destructive cherry-pick-onto-fresh-main move that flattens a
  mistakenly-stacked commit (no force-push, no removal).
- **Pure diffs.** Keep shared-registry state (`active-claims.json` and
  siblings) out of feature-PR diffs — it conflicts with every other
  open PR by construction. Resolve such conflicts to main's version of
  the registry, never the branch's.
- **Tense discipline.** Write sibling-PR claims as "lands in PR #N",
  switching to present tense only after merge.
