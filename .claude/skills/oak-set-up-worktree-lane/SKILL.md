---
name: oak-set-up-worktree-lane
description: "Create a git worktree for a lane and configure it so every downstream surface is true: an inherited bot commit identity checked rather than re-set, dependencies, environment files, and a draft PR at first push. Use when taking up a lane needing its own checkout, or when a worktree misbehaves — commits attributed to nobody, missing env, hook failures. Do not use to switch branches in place (never on the principal), for the session-level residency switch alone (that is EnterWorktree), or to dispose of a finished worktree. Right looks like: branch cut explicitly from origin/main, the inherited bot identity verified with no worktree-scoped override shadowing it, deps installed, .env.local carried, draft PR at first push. Wrong looks like: EnterWorktree fresh mode basing the branch on the principal's coordination HEAD so the lane PR ships foreign commits; or the bot commit email carrying the app id instead of the bot user id, which resolves to no GitHub user and silently breaks deployment attribution."
---

# Set Up Worktree Lane (Claude Code)

Read and follow `.agent/skills/set-up-worktree-lane/SKILL-CANONICAL.md`.
