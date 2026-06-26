---
name: semantic-merge
classification: active
description: >-
  Merge agent memory and state files (napkin, repo-continuity, distilled, thread
  records, registers) by reconciling CONCEPTS, not lines. Use whenever these files
  diverge across branches or sessions and a merge, rebase, cherry-pick, or post-update
  `gh pr merge` would combine them — git line-merges silently corrupt the meaning.
---

# Semantic Merge — concept-preserving merge of memory and state

## Why this exists

Agent memory and state files are concept-bearing narratives and indexes, not
line-oriented code. Git merges by lines; it has no model of "a session entry", "a
lesson", "a register item", "a table row", or "recency order". A git line-merge of two
diverged memory files will silently stack entries wrongly, interleave two narratives
incoherently, drop one session's entry, or duplicate content. The result satisfies git
but corrupts the knowledge. **A human-level reconciliation of the concepts is required —
you must do it, git cannot.**

## When this fires

Whenever a memory or state file has diverged on two branches or sessions and a merge,
rebase, cherry-pick, or post-branch-update `gh pr merge` would combine them. Files in
scope (non-exhaustive): `repo-continuity.md`, `napkin.md`, `distilled.md`,
`director-handoff.md`, thread `*.next-session.md` records, `pending-graduations.md`,
`open-questions`, and any file carrying a `merge_class:` frontmatter key.

## The `merge_class` taxonomy

Each memory/state file declares its merge shape in frontmatter (`merge_class:`). Resolve
per class:

- **`append-only-narrative`** (e.g. `napkin.md`): timestamped, attributed observations.
  Merge = UNION of every entry from both sides; never drop one. Order by append/recency.
  If both sides recorded the same lesson, keep one and note both sessions.
- **`index-narrative-tables`** (e.g. `repo-continuity.md`): a compact index of
  per-session / per-thread entries plus tables. Merge = UNION of entries, grouped by
  session, most-recent-session first; keep tables intact (never split a row); and
  re-apply any single-line edit one side made that the other did not (e.g. a "DONE"
  mark on a prior next-safe-step). Combine the same session's multiple landings into one
  coherent entry rather than scattering them.
- **Other declared classes** carry the same union rule; the class only names the structure
  to preserve, never a licence to discard. As of writing the live classes are:
  `mostly-append-register` (e.g. `pending-graduations.md`) and `curated-learning-register`
  (e.g. `distilled.md`) — union entries, keep register grouping/curation order, never drop
  an item; `active-register-shard` — union within each shard, keep shard boundaries;
  `curation-ledger` — union rows, keep ledger columns intact; `index-narrative` — as
  `index-narrative-tables` without the tables. Re-run this grep before relying on the list:
  `grep -rhE '^merge_class:' .agent/memory .agent/state | sort -u`.
- If a file declares no `merge_class`, treat it as an append-only union and verify by hand.

The invariant across every class: **the merge is a union of concepts; no entry from either
side is ever dropped to fit a structure or a limit.**

## Procedure

1. **Preserve each side's CLEAN version first.** Before resolving, save the clean content
   of both sides — the working-tree file from each branch *before* the merge, or
   `git show <ref>:<file>` per ref, or the conflict stages once merging
   (`git show :2:<file>` = ours, `:3:<file>` = theirs, `:1:<file>` = base). Do NOT rely on
   `git diff <base> -- <file>` once the file is conflicted: it diffs the base against the
   marker-filled working tree, so "what each side added" computed from it can be wrong and
   silently lose one side's entry. Once both clean sides are saved, nothing can be lost.
2. **Identify what each side ADDED** vs the common base (entries, lessons, rows,
   single-line edits). Memory merges are almost always additive on both sides — the
   merge is a union, not a reconciliation of competing values.
3. **Author the union by hand.** Produce a merged file where every concept from both
   sides is present and coherent: recency-ordered, session-grouped where the class is
   index-shaped, tables intact, single-line edits re-applied, same-session landings
   combined.
4. **Review the WHOLE changed section, not just conflict hunks.** Git auto-merges
   non-conflicting hunks; those can be semantically wrong too (two top entries stacked
   oddly, a row inserted mid-table). Read the entire section both sides touched.
5. **Respect fitness limits.** These files carry line/char limits in frontmatter. If the
   union overflows, the cure is conserve-insight-and-drain per the file's
   `overflow_disposition` (run `consolidate-docs`) — NEVER drop a concept to fit.
6. **Land it as a real 2-parent merge commit** (the `git merge` in §Mechanics produces
   one), not a single-parent squash or cherry-pick of one side. The merge commit records in
   history that the two divergent lines were reconciled, so git's future merge-base
   calculations know it; a single-parent commit leaves them unaware and the same divergence
   can resurface or be mis-resolved later.
7. **Verify**: no conflict markers remain; both sides' concepts are present; the commit has
   both parents; `markdownlint` is clean.

## Mechanics that respect the repo rules

`git stash`, `git reset`, and `git checkout -- <file>` are forbidden. To advance past
uncommitted memory edits onto a moved base without them: create a branch that carries the
uncommitted edits (`git switch -c`), commit them, then `git merge origin/main`. The
conflict markers land exactly on the divergent entries — resolve them as a concept union,
then review the whole file. This is the path that surfaces the divergence for hand-merge
rather than hiding it behind a silent auto-merge.

## Anti-patterns

- Letting `gh pr merge` / auto-merge line-merge these files.
- Resolving only the conflict markers and trusting git's auto-merged hunks.
- Dropping one side's entry to "simplify" or to fit a fitness limit.
- `-X ours` / `-X theirs` on memory files — each discards one side's concepts wholesale.
- `gh pr merge --delete-branch` while carrying uncommitted memory edits: it switches the
  local checkout to the base branch and aborts mid-way, scrambling the working tree (the
  remote merge still succeeds; the local tree is the casualty).
