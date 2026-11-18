---
name: "Multi-Writer Landing Order: Deletion-Bearing Bundles Commit First"
polarity: pattern
use_this_when: "Multiple lanes share one checkout (or one estate gate) and any lane's work-in-progress DELETES a tracked file — and commits are queuing."
category: process
layer: general
proven_in: "curriculum-hub-demo 2026-07-02 (multi-agent window): a hygiene lane's tracked-file deletions blocked every estate commit until the deleting lane's cycle committed first; the one-index multi-cycle commit-train technique landed three cycles from one mixed tree. Recorded in the Director #7 handoff record's operating protocol."
proven_date: 2026-07-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A tracked-file deletion in any live worktree fail-louds the whole-tree validators (tracked-but-missing) for EVERY committer; the reflex cure — resurrecting the file — reverses deliberate forward motion."
  stable: true
---

# Multi-Writer Landing Order: Deletion-Bearing Bundles Commit First

> **POLARITY: PATTERN.** This is a shape to repeat: the cure is landing
> ORDER, never file resurrection.

## The mechanism

Whole-tree validators that fail loud on tracked-but-missing files (the
machine-local-paths class) read the WORKTREE, not the staged set. So
one lane's pending tracked-file deletion blocks **all** lanes' commits
— including unrelated pathspec commits, because a pathspec commit
builds its temporary index from HEAD + pathspec while the deletion
still sits in the tree.

## The shape

1. **The deleting lane's cycle commits FIRST** — deletion-bearing
   bundles take priority within any commit train.
2. **Never resurrect a final-intent deletion** to unblock a commit —
   the deletion is forward motion; restoring it to green a gate
   reverses decided work (and restore-shaped commands are themselves
   hook-blocked in comms for this reason).
3. **Compose with the one-index multi-cycle commit train** when several
   lanes' work must land from one mixed tree: pathspec-commit (cycle A,
   worktree state) → plain commit (cycle B's pre-staged index snapshot
   survives untouched) → add+commit (cycle C delta).
4. When a mid-cycle lane blocks the tree entirely, ask that lane for a
   **compile/lint-green checkpoint** (their green unstaged WIP rides in
   the tree while the train runs; their commit lands later) — don't
   wait for slice completion.

## Related

- `stage-by-explicit-pathspec`; the commit skill's queue ceremony;
  `never-use-git-to-remove-work` (resurrection is its mirror image —
  re-creating removed work is equally a history falsification);
  `ship-independent-coordinate-dependent`.
