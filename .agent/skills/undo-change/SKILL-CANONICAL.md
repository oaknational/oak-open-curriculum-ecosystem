---
name: undo-change
classification: passive
description: >-
  Decision tree for safely undoing a working-tree, staged, or committed
  change. Identifies the git state of the change, names the safe and
  destructive operations available, and forces an owner-authorisation
  halt before any destructive operation. Loaded passively and invoked
  whenever the agent or owner reaches for an undo, revert, reset, or
  restore.
---

# Undo Change

Use this skill the moment any agent reaches for an undo. Includes
verbal forms (*undo*, *revert*, *roll back*, *throw away*, *get rid
of*, *reset*, *restore*) and operational forms (`git checkout --`,
`git restore`, `git reset`, `git revert`, `git stash`, `git clean`,
`rm` of a tracked file).

## Why This Skill Exists

On 2026-05-01, in flow-state confidence, an agent ran
`git checkout --` on three peer-owned files to clear a markdown-lint
failure path. The operation discarded parallel-agent uncommitted
work that had no other persistence in git. The destructive shape
was the same as a lint-autofix failure mode: take a "fix" action
that crosses from reversible to irreversible without the cognitive
shift firing.

This skill installs the cognitive shift as an active layer.

## Process

When the trigger fires, do **NOT** execute the operation. Instead:

1. **Name what is being undone**: file path, specific commit, or
   branch.
2. **Determine the git state** by running `git status --short` and
   `git log --oneline -5` (read-only). Optionally
   `git diff <file>` for the file's specific diff vs HEAD.
3. **Walk the decision tree below** to identify the safe operation.
4. **Render the diagnosis in chat**: the change being undone, the
   git state classification, the safe operation that applies, the
   destructive operations that are explicitly *not* recommended,
   and the reasoning.
5. **Halt and ask** the owner for explicit authorisation before
   performing any operation. The rendered diagnosis is the basis
   for the owner's decision.

The skill does not authorise unilateral execution. It always halts.

## Decision Tree

### File-level change

**A. Untracked (new file, never committed)**

- Safe action: `rm <file>`.
- Halt-ask: confirm with the owner that the file's contents are not
  needed. Untracked-and-deleted is unrecoverable from git.

**B. Tracked, modified, unstaged**

- **B.i. No other unstaged changes anywhere in the working tree**:
  - Recommend: `git restore <file>`.
  - Halt-ask: confirm because the operation is irreversible.
- **B.ii. Other unstaged changes exist (peer or own)**:
  - **DANGER ZONE**. This is the shape that produced the
    2026-05-01 incident.
  - Proof obligation: list the file's diff vs HEAD; verify the
    change being undone matches that diff exactly.
  - If the file contains peer-authored unstaged work, **HALT** —
    surface to the owner; do not act.
  - If the file contains only own work, surface the diff and ask
    before `git restore <file>`.
  - Never reach for `git checkout -- <file>` blindly in this
    branch — even with file scope, the agent must prove the
    precondition is safe.

**C. Tracked, modified, staged**

- Recommend: `git restore --staged <file>` (unstages; preserves the
  working tree).
- Then re-evaluate against branch B if the working tree also needs
  reverting.

**D. Tracked, modified, both staged and unstaged ("MM" in `git status`)**

- Sequence: C then B (with B's safety analysis).

### Commit-level change

**E. Most recent commit, not pushed**

- **E.i. Want to keep the changes for re-work**:
  - Recommend: `git reset --soft HEAD~1` (changes return to
    staging) OR `git reset HEAD~1` (changes return to working
    tree, unstaged).
  - Halt-ask: confirm the variant; verify no other agents have a
    commit-window claim.
- **E.ii. Want to discard the changes entirely**:
  - Recommend: `git revert HEAD` (preserves history; safer).
  - The destructive form (`git reset --hard HEAD~1`) is on the
    `permissions.deny` list in `.claude/settings.json` and must
    not be reached for. If the owner explicitly authorises it,
    surface the authorisation chain in chat and ask once more
    with the operation's full effect named.

**F. Pushed commit**

- **ALWAYS** recommend `git revert <sha>`.
- **NEVER** recommend reset or rebase. Never propose history
  rewrite on a pushed branch.
- Halt-ask: confirm before pushing the revert.

**G. Older history, unpushed (not the most recent commit)**

- DANGER ZONE — interactive rebase territory.
- HALT — surface full context to the owner; do not propose an
  action. The owner will decide whether to drop, squash, fix-up, or
  abandon the work.

### Branch-level change

**H. Wrong branch checked out**

- Recommend: `git switch <correct-branch>` (non-destructive).

**I. Want to delete a branch**

- **I.i. Branch is merged**:
  - Recommend: `git branch -d <branch>` (safe; refuses if unmerged).
- **I.ii. Branch has unmerged commits**:
  - **HALT** — refuse `git branch -D <branch>`; surface unmerged
    commits to the owner.

## Structural Guarantees

- Every leaf either halts-and-asks or recommends a non-destructive
  operation. There is no leaf that says *go ahead and destroy*.
- Branch B.ii is named explicitly with the 2026-05-01 incident as
  its motivating example, so the agent reading the skill has the
  failure pattern in front of them.
- The skill renders the diagnosis in chat (state classification +
  the change being undone + safety analysis) before any operation.
- Decisions are presented to the owner; never executed unilaterally.

## Pairs With

- [`.claude/settings.json`](../../../.claude/settings.json)
  `permissions.deny` and `permissions.ask` — settings prevents the
  destructive paths from running silently.
- The hook-layer safety net idea (in
  [`pending-graduations.md`](../../memory/operational/pending-graduations.md))
  — the per-call surfacing layer that complements settings and
  skill.
- [`read-before-asking` rule](../../rules/read-before-asking.md)
  — the empirical-question reformulation; the same *render the
  diagnosis, then halt-ask* shape, applied to questions instead of
  to undo operations.
- [PDR-057 (empirical-answerability)](../../practice-core/decision-records/PDR-057-empirical-answerability.md)
  — the doctrinal frame that supersedes the quarantined
  `apply-don't-ask` candidate; this skill remains the destructive-
  action compensator for the same family of agent failure modes.
- [Quarantined apply-don't-ask doctrine](../../memory/operational/quarantine/apply-dont-ask-doctrine.md)
  — the predecessor doctrine; quarantine cleared 2026-05-10 by
  PDR-057 + PDR-058. Preserved as historical evidence.

## Platform Adapters

Thin pointers (no slash-command form):

- Cursor: `.cursor/skills/undo-change/SKILL.md`
- Codex: `.agents/skills/undo-change/SKILL.md`
- Claude: `.claude/skills/undo-change/SKILL.md`

All platform adapters resolve to this canonical file.
