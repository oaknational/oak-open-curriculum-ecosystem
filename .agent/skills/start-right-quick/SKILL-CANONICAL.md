---
name: start-right-quick
classification: active
description: Apply the repository start-right quick grounding workflow to the active session. Use when the user asks to start right, re-ground work, or explicitly apply the shared start-right-quick skill guidance and linked directives before or during task execution.
---

# Start Right (Quick)

## Goal

Load `.agent/skills/start-right-quick/shared/start-right.md` and enforce
its directives in the current session before substantial work. The shared
workflow file is the source of truth for the reading order; this skill body is
only the invocation contract.

## Workflow

1. Read `.agent/skills/start-right-quick/shared/start-right.md` end to end.
2. Follow the workflow's referenced reading order. Do not replace it with a
   smaller directive-only subset; the shared file names the current
   foundation, memory, live-state, active-plan, and git-state surfaces.
3. Resolve referenced directories through their indexes instead of copying
   their inventories into this skill. In particular, use `RULES_INDEX.md` for
   the always-applied rule tier and the relevant thread record for thread
   state.
4. Convert the workflow content into active commitments for this session:
   - Challenge assumptions and check that work is happening at the right layer.
   - Optimise for system-level value and architectural correctness over
     short-term expediency.
   - When analysing generated files, inspect generator code as the source of truth.
   - Check live claims, comms, and git state before edits or commit-window
     activity.
   - Discuss first-step direction with the user before committing to a major
     implementation path when intent is genuinely unclear.
5. Post a concise grounding summary to the user that confirms the workflow was
   applied and lists the commitments now in force.
6. Include periodic re-grounding checkpoints in any non-trivial plan so the
   session re-reads and recommits to the shared workflow's foundation files.
7. Continue the user task while enforcing these commitments.

## Failure Handling

If a referenced file is missing or unreadable, report the exact path, apply all
available directives, and ask the user whether to proceed or provide the
missing file.
