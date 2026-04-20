---
name: "Stage What You Commit, Commit What You Staged"
use_this_when: "about to run `git commit` with unrelated changes visible in `git status` — the index may carry work the commit message does not describe."
category: process
proven_in: ".agent/memory/active/archive/napkin-2026-03-24.md (session 2026-03-24); .agent/memory/active/napkin.md (session 2026-04-19, commit bundling during observability restructure close-out)"
proven_date: 2026-04-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "commits whose content diverges from their message because pre-existing staged or partially-staged changes rode along"
  stable: true
---

# Stage What You Commit, Commit What You Staged

The git **index** is not a passive surface. It accumulates state from
earlier edits, partial stages, and upstream workflow steps. Running
`git commit` after `git add <file>` commits **everything already in
the index**, not just the file you just staged. If `git status` shows
`MM`, `M ` with whitespace, or `A ` on files unrelated to the change
you are about to commit, and you do not act on them first, the commit
message will describe less than the commit contains.

## Pattern

Before every commit, explicitly read the index. Two proven checks:

1. **Two-letter status read**: run `git status --short` and scan for
   `MM` (modified in both index and working tree), `A ` (newly added),
   `R ` (renamed), `D ` (deleted). Only the leftmost letter matters for
   index state; the rightmost is working-tree-only and does not land in
   the commit.
2. **Direct index diff**: run `git diff --cached` and confirm the staged
   content matches the commit message you intend to write. This catches
   the case where the status code is boring (`M `) but the staged
   content is larger than expected.

If unrelated content is staged, either:

- **Unstage** with `git restore --staged <path>` before committing; or
- **Split** into a separate commit with its own message if the unrelated
  change is legitimate but orthogonal.

## Anti-Pattern

Running `git add <my-file>` then `git commit` without inspecting index
state, under the assumption that the commit will only carry the file
just added. When `MM` or `A ` entries exist on other files, the commit
silently absorbs them. The commit message describes only the intended
change; the commit content carries more. Not destructive — but the
commit message lies about what the commit is.

Symptoms:

- Commits whose diff on review is broader than the subject line implies.
- Later sessions surprised that a file "was in" a commit whose subject
  never mentioned it.
- Bisect or blame pointing at a commit whose message does not explain
  why the blamed line changed.

## The Correction

When `git status` surfaces unrelated staged entries:

1. Pause before committing.
2. Read `git diff --cached` in full.
3. For each unrelated path: either unstage with `git restore --staged`
   or write a separate commit with an accurate message.
4. Re-run `git status --short`; confirm only intended files are staged.
5. Commit.

## Evidence

**2026-03-24 — editing under mixed index state**. A file showed as
modified in `git status` but plain `git diff` appeared empty.
Root cause: changes were staged, not working-tree; `git diff --cached`
showed the in-flight work. Editing on top of a file whose staged state
was not inspected risks losing or double-staging content.
(`archive/napkin-2026-03-24.md` lines 464–468.)

**2026-04-19 — commit-message divergence during restructure close-out**.
A commit intended to land only the physical reorder of a plan file
bundled in pre-existing `MM` edits on unrelated files because the
index state was not inspected before `git commit`. The bundled work
was legitimate parallel research, but the commit message described
only the reorder. Not destructive; the mismatch between commit message
and commit content is the real defect.

Both instances share the same underlying principle: **the index is
durable state between edits; `git status` shows both index and
working tree; a commit lands only the index**. The ergonomic default
of `git add <file> && git commit` trusts the index is empty, which it
often is not.

## When to Apply

- Every commit. The inspection cost is seconds.
- After any workflow that stages files as a side effect (rebase, merge,
  auto-fix, hook-driven stages).
- When `git status --short` reports any line whose leftmost character
  is not a single space (a non-blank index state).
- When running under a harness that may have staged files on your
  behalf (auto-mode commit hooks, IDE integrations, formatter hooks).

## Related Patterns

- `verify-before-propagating.md` — same discipline applied to claim
  propagation: confirm the surface you are about to modify says what
  you think it says before you modify it.
- `evidence-before-classification.md` — index state is evidence;
  classify the commit scope from that evidence, not from the message
  you planned to write.
