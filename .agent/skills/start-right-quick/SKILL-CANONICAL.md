---
name: start-right-quick
classification: active
description: Apply the repository start-right quick grounding workflow to the active session. Use when the user asks to start right, re-ground work, or explicitly apply the shared start-right-quick skill guidance and linked directives before or during task execution.
---

# Start Right (Quick)

## Goal

Load `.agent/skills/start-right-quick/shared/start-right.md` and enforce its directives in the current session before substantial work.

## Workflow

1. Read `.agent/skills/start-right-quick/shared/start-right.md`.
2. Resolve and read the files referenced by the prompt:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
3. Convert the prompt content into active commitments for this session:
   - Challenge assumptions and check that work is happening at the right layer.
   - Optimise for system-level value and architectural correctness over short-term expediency.
   - When analysing generated files, inspect generator code as the source of truth.
   - Discuss first-step direction with the user before committing to a major implementation path.
4. Post a concise grounding summary to the user that confirms the prompt was applied and lists the commitments now in force.
5. Include periodic re-grounding checkpoints in any non-trivial plan so the session re-reads and recommits to the three directive files.
6. Continue the user task while enforcing these commitments.

## Failure Handling

If a referenced file is missing or unreadable, report the exact path, apply all available directives, and ask the user whether to proceed or provide the missing file.
