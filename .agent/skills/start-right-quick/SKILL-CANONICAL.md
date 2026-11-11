---
name: start-right-quick
classification: active
description: >-
  Apply the repository's quick grounding to a solo session after classifying the
  host (a detected ChatGPT Work host keeps the reading and static checks and
  skips local execution). Use when the user asks to start right or re-ground a
  routine solo task. Not for a coordinated multi-agent session (that is
  start-right-team) nor for high-risk, cross-workspace, architectural or
  planning-heavy work (that is start-right-thorough). Right looks like: the
  reading order followed to its end, the live collaboration checks read, the
  rename suggested. Wrong looks like: quick grounding chosen for a team or
  high-risk session so the team registration or the one-gate-at-a-time
  discipline never starts.
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
