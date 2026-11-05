---
name: start-right-thorough
classification: active
description: >-
  Apply the repository's thorough grounding after classifying the host (a
  detected ChatGPT Work host keeps the reading and static checks and skips local
  execution). Use for high-risk, cross-workspace, architectural or
  planning-heavy work, where one-gate-at-a-time discipline is required from the
  start. Not for a routine solo task (that is start-right-quick) nor as the
  team bootstrap on its own (start-right-team layers the team protocols on
  top). Right looks like: the foundation documents internalised before the
  first edit and each gate run and read on its own. Wrong looks like: thorough
  grounding skipped for a cross-workspace change because the task "looked
  small".
---

# Start Right (Thorough)

## Goal

Load `.agent/skills/start-right-thorough/shared/start-right-thorough.md` and
enforce its directives in the current session before substantial work. The
shared workflow file is the source of truth for the full thorough sequence;
this skill body is only the invocation contract.

## Workflow

1. Read `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
   end to end.
2. Follow the workflow's referenced reading order. Thorough grounding extends
   quick grounding; it does not replace live repo-continuity, thread,
   active-claim, shared-comms, active-plan, and git-state checks with a
   smaller directive-only subset.
3. Resolve referenced directories through their indexes instead of copying
   their inventories into this skill. In particular, use `RULES_INDEX.md` for
   the always-applied rule tier and the relevant thread record for thread
   state.
4. Convert the workflow content into active commitments for this session:
   - use one-gate-at-a-time quality validation for non-trivial work;
   - include explicit re-grounding points in any long-running execution plan;
   - enforce reviewer invocation discipline per `invoke-code-experts`;
   - check live claims, comms, and git state before edits or commit-window
     activity.
5. Post a concise grounding summary to the user that confirms the thorough
   workflow is active.
6. Continue the user task while enforcing these commitments.

## Failure Handling

If a referenced file is missing or unreadable, report the exact path, apply all
available directives, and ask the user whether to proceed or provide the
missing file.
