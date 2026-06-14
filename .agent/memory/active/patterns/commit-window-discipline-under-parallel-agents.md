---
name: commit-window-discipline-under-parallel-agents
use_this_when: "Committing on a shared on-disk checkout where other agents may stage or commit concurrently — re-derive the staged set per chunk from a fresh git status, stage by explicit pathspec, and verify the staged set immediately before each commit; 'solo window' is a point-in-time read, not a session property."
polarity: pattern
category: process
status: stable
discovered: 2026-06-09
proven_by: "Sustained multi-agent work on the shared feat/comms-research branch (2026-06-09→14): 6+ agents committed concurrently on one on-disk checkout with zero content loss and zero collisions by re-deriving the staged set per chunk, committing by explicit pathspec, and verifying the staged set immediately before each commit. Conserved from distilled.md (multi-session cross-checkout commit discipline, the interim home noted there)."
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "On a shared on-disk checkout with live parallel agents, committing against a stale staged set or a point-in-time 'solo' assumption — sweeping a peer's working files into your commit, losing content, or colliding on the HEAD ref."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Commit-Window Discipline Under Live Parallel Agents

## Pattern

On a shared on-disk checkout where multiple agents may stage and commit concurrently, the
commit window is a **moving target**. Make collision-safety structural, not assumed:

1. **Re-derive the staged set per chunk, not per pass.** Each commit's pathspec comes from a
   FRESH `git status`; stage by **explicit pathspec** (`git commit -F <msg> -- <files>` commits
   exactly your bundle). Explicit-pathspec + per-chunk re-derivation carried 6+ agents on one
   branch with zero collisions.
2. **"Solo window" is a point-in-time observation, not a session property.** A registry empty
   at session-open can carry a peer's staged bundle by mid-session. Verify
   `git diff --cached --name-only` against your intended bundle **immediately before every**
   `git commit`; halt on any foreign entry.
3. **A granted commit window is exclusive until the grantee's PUSH closes it** — it spans the
   whole gate chain, not just the staging moment. One gate chain at a time per checkout/worktree.
4. **Whole-tree pre-commit gates bind you to a live peer's WIP.** A pre-push "branch failure" can
   be a TREE failure (root format/markdownlint gates inspect the working tree, not the pushed
   commits). Diagnose by separating tree state from branch content; don't leave bundles
   staged-but-uncommitted in a shared checkout longer than necessary.
5. **Verify content conservation by set-membership, not by edit-base.** On a shared tree a peer
   may commit your working files mid-session; the question is not "was my base stale?" but
   "was any content LOST?"

## Why it matters

The naive model — "I have a clean checkout, so my staged set is mine" — is false under live
parallel agents on one on-disk tree. Each of the five disciplines closes a specific gap that
single-agent habits leave open. The cost of getting it wrong is a peer's work swept into your
commit, your work lost, or a `cannot lock ref 'HEAD'` collision; the cost of the discipline is
one fresh `git status` and one `git diff --cached` per commit.

## When to apply

- Any commit on a shared branch/checkout where other agents are or may be live.
- Worktree or multi-checkout setups sharing a registry.
- Whenever a pre-commit/pre-push gate fails on files you did not touch (suspect tree-vs-branch).

## Adjacent

- [[peer-commit-absorption-third-direction]] — absorbing a peer's commit of your working files.
- The `cannot lock ref 'HEAD'` ref-lock is the final collision backstop — re-derive and
  re-commit, never delete the lock (auto-memory `no-delete-git-lock`, `no-lock-wait-loops`).
- Rule/PDR graduation of this discipline (a always-loaded rule) remains owner-gated; this
  pattern is its ecosystem-grounded instance home (PDR-007).
