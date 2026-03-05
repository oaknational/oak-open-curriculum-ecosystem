---
name: start-right-thorough
classification: active
description: Apply the repository start-right-thorough grounding workflow to the active session. Use for high-risk, cross-workspace, architectural, or planning-heavy work where full one-gate-at-a-time discipline is required from the start.
---

# Start Right (Thorough)

## Goal

Load `.agent/skills/start-right-thorough/shared/start-right-thorough.md` and enforce its directives in the current session before substantial work.

## Workflow

1. Read `.agent/skills/start-right-thorough/shared/start-right-thorough.md`.
2. Resolve and read the files referenced by the workflow:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/rules.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
3. Convert the workflow content into active commitments for this session:
   - use one-gate-at-a-time quality validation for non-trivial work
   - include explicit re-grounding points in any long-running execution plan
   - enforce reviewer invocation discipline per `invoke-code-reviewers`
4. Post a concise grounding summary to the user that confirms the thorough workflow is active.
5. Continue the user task while enforcing these commitments.

## Failure Handling

If a referenced file is missing or unreadable, report the exact path, apply all available directives, and ask the user whether to proceed or provide the missing file.
