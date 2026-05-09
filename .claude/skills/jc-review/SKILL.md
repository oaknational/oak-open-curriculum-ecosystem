---
name: jc-review
description: >-
  Perform a code review with specialist sub-agents.
---

# Review (Codex)

Read and follow `.agent/commands/review.md`.

Before invoking any reviewer in Codex, resolve it through
`pnpm agent-tools:codex-reviewer-resolve <reviewer-name>`, then open the
reported `.codex` adapter and canonical `.agent` files so the review is grounded
in the repo-local definitions rather than memory.
