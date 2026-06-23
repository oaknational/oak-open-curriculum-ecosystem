---
name: "PR Delivery: Monitor to Merge, Flat Stacks, Pure Diffs"
polarity: pattern
use_this_when: "Opening a pull request, choosing the base for a dependent change, or resolving merge conflicts that touch shared registry state."
category: process
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
  that ends at merge: watch checks AND review comments; adjudicate
  every bot/reviewer finding first-hand — both halves matter (refute
  false claims with source grounding; apply true ones — review bots
  have caught real second instances of defect classes the author had
  only patched once); reply with the verdicts on the PR.
- **Flat stacks.** Base PRs directly on main rather than serial stacks
  (stacks make fixing earlier PRs hard — owner, 2026-06-10);
  retarget/flatten as bases merge.
- **Pure diffs.** Keep shared-registry state (`active-claims.json` and
  siblings) out of feature-PR diffs — it conflicts with every other
  open PR by construction. Resolve such conflicts to main's version of
  the registry, never the branch's.
- **Tense discipline.** Write sibling-PR claims as "lands in PR #N",
  switching to present tense only after merge.
