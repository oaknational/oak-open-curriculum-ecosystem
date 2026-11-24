---
classification: situational
description: 'A git push either sends commits or deletes refs, never both. The pre-push hook passes a deletions-only push without running its gates, because the gates check the commits a push sends and a deletion sends none, and it refuses a push that does both. An agent does not delete a remote branch by push at all: it uses merge-bot retire, which deletes through the API as the bot. Failure shapes: a branch deletion that waited minutes on a full check of an unrelated working tree and was refused by it; a deletion slipped into a push of commits so that one of the two escapes its proper handling.'
trigger: ceremony:push
---

# Deletions Never Ride a Push

## The rule

A push does one of two things:

- **It sends commits.** It creates or updates refs, and it deletes none.
- **It deletes refs.** It sends no commits.

A push never does both. To delete a branch and push work in the same sitting,
make two pushes.

## What the hook does

The pre-push hook reads the refs git is about to push and acts on what they do:

- **Commits only:** every gate runs, as before.
- **Deletions only:** the hook passes the push and runs no gate.
- **Both:** the hook refuses the push before any gate runs and names this rule.

The classification is `agent-tools/src/push-shape/`.

## Why a deletion runs no gate

The pre-push gates check what a push sends: the secret scan reads the pushed
commits, the review-cost gate prices the pushed branches, and `pnpm check`
verifies the tree those commits came from. A deletion sends no commit. Running
the gates on it checks whichever working tree the command happened to be typed
in, which has nothing to do with the branch being removed.

The cost was real. On 2026-11-24 a deletion of four branches from the primary
checkout ran the full check for several minutes and was then refused by a gate
that was failing in that checkout for an unrelated reason.

## Why the two are never mixed

The hook gives one verdict for a whole push. If a push could carry both, the
hook would have to choose: run the gates, so the deletion waits on and can be
refused by checks that do not concern it, or skip them, so the commits go
unchecked. Keeping the two apart means each push gets exactly the handling its
content needs, and "this push only deletes" is a fact the hook can read from the
refs alone.

## Who deletes by push

A person, from their own checkout, under their own sign-in.

An agent does not. An agent deletes a remote branch with `merge-bot retire`,
which proves the branch is on the default branch and deletes it through
GitHub's API as the bot, with a read-back
([`worktree-hygiene`](worktree-hygiene.md), the standing prune policy). That
command makes no push, so the hook never sees it, and the deletion is recorded
as the bot's act. An agent's push goes through `merge-bot push`, which writes
one branch and deletes nothing.

## What this rule does not decide

Whether a branch may be deleted. [`worktree-hygiene`](worktree-hygiene.md)
decides that: every remote branch is assessed first. This rule covers only a
deletion made with `git push`.
