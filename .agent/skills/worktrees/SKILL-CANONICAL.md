---
name: worktrees
classification: passive
description: >-
  When and how to use git worktrees for isolated work. Use for parallel
  development, risky experiments, or review work that should not affect
  the main working directory.
---

# Git Worktrees

Guidance on using git worktrees to isolate work without disrupting the main checkout.

## When to Use

- **Parallel feature work**: developing two features simultaneously without branch switching
- **Risky experiments**: trying an approach that might need to be discarded entirely
- **Review isolation**: checking out a PR branch for review without losing your current state
- **Plan execution**: executing an implementation plan in isolation (recommended by execution skills)

## How to Use

### Create a worktree

```bash
git worktree add .claude/worktrees/<name> -b <branch-name>
```

Or use the platform's worktree support (e.g., Claude Code's `EnterWorktree` tool).

### Work in the worktree

- The worktree is a full checkout with its own working directory
- Changes in the worktree do not affect the main checkout
- Both checkouts share the same `.git` directory (commits are visible from both)

### Clean up

```bash
git worktree remove .claude/worktrees/<name>
```

Remove worktrees when the work is complete and merged. Stale worktrees consume disk space.

## Conventions

- Worktrees live under `.claude/worktrees/` (gitignored)
- Name worktrees descriptively: `feature-auth`, `fix-search-bug`, `review-pr-42`
- Do not leave worktrees open indefinitely — clean up after merge

## References

- `git worktree` documentation: `git help worktree`
