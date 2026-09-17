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

## Both the tool AND the merger can be confident and wrong

"Git cannot" (above) invites a false inference — that the *agent* doing the hand-merge is
the reliable party. It is not, and trusting it as such is how a careful semantic merge still
loses meaning. Both parties fail the same way: **confident and wrong.**

- **Git** is confident and wrong when a clean auto-merge — few or no conflict markers —
  combines the *text* fine but breaks the *meaning*: two `Current State` blocks, a duplicated
  identity row, entries out of order, a now-dangling link. Absence of a marker is not evidence
  of correctness.
- **The merging agent** is confident and wrong when its loss-scan is bounded by the invariant
  classes it *thought to check*. An empty heading set-diff (step 7) proves no *entry* was
  dropped; it does **not** prove no *invariant* was violated, and it cannot enumerate the
  checks the agent never ran. "I merged everything" is the agent's version of the missing
  conflict marker — a felt completeness that was never grounded. Completeness here is
  **structurally unprovable**, for the same reason a handoff author cannot self-verify its own
  loss-scan
  ([PDR-011](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md),
  `verify-dont-trust`, [[ground-convenient-claims]]): the party who performed the merge shares
  the frame whose gaps it would have to stand outside to see.

So neither the conflict-marker set nor the agent's own set-diff is a completeness certificate.
Two mandatory consequences:

1. **The safeguard is a reviewable diff read by someone who holds the invariants** — a second
   agent or the owner — never the merge algorithm and never the author's own scan. Emit the
   merge as a reviewable diff (never a silent `gh pr merge`); the review is the catch.
2. **State the verdict as "no *known* invariant violated," never "provably complete."** The
   known classes to check beyond dropped entries (non-exhaustive by construction — extend it):
   a duplicated index block or table/identity row; an additive-identity row that should have
   coalesced; an ADR/PDR/plan/friction **numbering collision** (different filenames make it
   invisible to the merge) — resolve per
   [PDR-049 §Sequential-identifier collisions](../../practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md):
   the trunk side keeps the number, the other side renumbers to the next free number
   re-derived at merge time, and every index and reference updates in the same change; a
   moved/deleted-file **reference cascade** (navigation or
   prescription mode); **cross-file coupling** where a one-side file depends on the other's
   continuity edit; a **silent compile break** in adjacent code that text-merged clean — only
   `pnpm type-check` and the tests on the *merged tree* settle that, never the textual
   `merge-tree`.

## When this fires

Whenever a memory or state file has diverged on two branches or sessions and a merge,
rebase, cherry-pick, or post-branch-update `gh pr merge` would combine them. Files in
scope (non-exhaustive): `repo-continuity.md`, `napkin.md`, `distilled.md`,
`director-handoff.md`, thread `*.next-session.md` records, `pending-graduations.md`,
`open-questions`, and any file carrying a `merge_class:` frontmatter key.

**Live-write contention on ONE tree is a different, lighter problem** — this skill is
for DIVERGED copies. When several agents concurrently edit the same memory file in one
working tree (e.g. simultaneous closeouts appending to a thread record), the Edit-tool
modified-since-read guard correctly refuses each stale write; the clean cure is a
settle-wait — an until-loop waiting for the file's mtime to be stable >20s, BOUNDED (give up
after ~3 minutes and coordinate the ordering explicitly on comms, per
`loop-exit-criteria-required`) — then an immediate re-read + edit (worked instance: three
agents closing on one thread record, 2026-07-02).

## The `merge_class` taxonomy

Each memory/state file declares its merge shape in frontmatter (`merge_class:`). Resolve
per class:

- **`append-only-narrative`** (e.g. `napkin.md`): timestamped, attributed observations.
  Merge = UNION of every entry from both sides; never drop one. Order by append/recency.
  If both sides recorded the same lesson, keep one and note both sessions. The union is a
  git builtin — `git merge-file -p --union ours base theirs` — verified by the heading
  set-diff proof plus exact line arithmetic (base + mine-appends + theirs-appends =
  merged line count); no hand-splicing needed for this class. The arithmetic proof applies
  to the RAW `--union` output, before any same-lesson dedup pass — deduplication breaks the
  arithmetic by design. **A rotation on one side and appends on the other is this class's
  most dangerous shape** (worked, 2026-08-06 branch reconciliation): neither side's change
  is wrong, so a line-merge resolves confidently either way. The safe order is to prove the
  DRAIN lossless first — `cmp` the archive's head against the pre-rotation file — after
  which the rotation stands and only the un-homed appends need carrying across.
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
   Heading-level proofs structurally cannot see WITHIN-LINE edits: when you choose one
   side of an index-class file, diff the REJECTED side against base for line-level edits
   outside the region that superseded it, and re-apply each (worked instance, PR #324
   round 2: an ours-wins resolution silently reverted the other side's
   `current/`→`active/` link corrections; caught by two reviewers).
5. **Respect fitness limits.** These files carry line/char limits in frontmatter. If the
   union overflows, the cure is conserve-insight-and-drain per the file's
   `overflow_disposition` (run `consolidate-docs`) — NEVER drop a concept to fit.
6. **Land it as a real 2-parent merge commit** (the `git merge` in §Mechanics produces
   one), not a single-parent squash or cherry-pick of one side. The merge commit records in
   history that the two divergent lines were reconciled, so git's future merge-base
   calculations know it; a single-parent commit leaves them unaware and the same divergence
   can resurface or be mis-resolved later.
7. **Verify losslessness mechanically — do not trust the conflict count.** No conflict
   markers remain; the commit has both parents; `markdownlint` is clean. Then *prove* no
   concept was lost, because the dangerous files are the **auto-merged** ones (e.g.
   `distilled.md` emptied by a drain on one side vs full on the other), not the ones that
   raised a conflict. For each memory file in the merge: (a) **heading/entry set-diff** —
   diff the entry headings of every clean side against the chosen result; an *empty
   miss-set* is the proof, the "I merged everything" assertion is not; (b) **merge-base
   diff** — `git diff $(git merge-base HEAD <other-ref>) <other-ref> -- <file>` to detect
   post-divergence additions the other side could not have drained. If a side appears to
   have *removed* entries (a drain), confirm each removed entry is live in its permanent
   home (or in that side's archive) before accepting the emptied version — a drain is
   lossless only when the substance reached its home. Sibling:
   [[ground-convenient-claims]], `verify-dont-trust`.
8. **Assert the ERA WITNESS — mandatory after EVERY union.** The NEWEST section heading
   of EACH side — and, for files carrying an identity/seat table, each side's newest
   identity row — must be present in the result **or verified at its drain destination
   per step 7** (a legitimately-drained side's newest entry is correctly absent from the
   result; the witness for that side is the verified home or archive, never
   re-introduction). A set-diff proof only compares the pair the merger CHOSE; if the
   union accidentally adopted an entire stale side for a file, the proof reads green
   while a whole era is gone (worked loss, PR #324, 2026-07-08: a union dropped the
   entire Goshawk/Rigel era from two continuity surfaces while its set-diff proofs read
   green; recovered from the object store at `5faf08205`). The era witness binds the
   proof to recency, which a set-diff structurally cannot see.
9. **Recompute LINKS over the unioned sections.** A union re-introduces the stale side's
   links, not just its content — a path correct when written and broken after a later
   move rides back in (worked instance: a `current/` plan link re-introduced after the
   `active/` move). Run `validate-markdown-links` scoped to the merged file, or `test -f`
   each relative target the union (re-)introduced.
10. **Second reader, from the object store.** A second seat reads the merge commit with
    `git show <sha>:<file>` (no tree access needed) and re-runs the proofs independently:
    markers count; heading set-diff of EACH clean side against the result; "result lines
    outside main ∪ ours" (nothing invented); "main lines absent from the result" read line
    by line; the era witness; `git diff --stat <side> <result> -- <files that should equal
    that side>`. Both the tool and the merger can be confident and wrong (above): the
    second read found one factual cure (a release number) and three dropped facts that git
    and the merger had both read as clean, inside a minute (2026-09-02). For a ROTATED
    append-only surface met at a fold, add the archive-coverage check: diff the incoming
    side's entry HEADINGS against the rotation archive, content-grep before declaring a gap
    (113 of 116 covered, one under its trued heading), and carry only the genuinely absent
    entries under a dated union note (2026-08-17).

## Mechanics that respect the repo rules

Do not reach for `git stash`, `git reset`, or `git checkout -- <file>` to clear the working
tree here: `git checkout -- <file>` discards uncommitted work (forbidden by
`never-use-git-to-remove-work`), `git stash` is owner-disfavoured, and `git reset` needs
owner consent. To advance past
uncommitted memory edits onto a moved base instead: create a branch that carries the
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
