---
name: go
classification: active
description: Re-ground and structure execution with ACTION/REVIEW/GROUNDING cadence. Use when the user asks to go, re-ground work mid-session, or explicitly apply the GO workflow to structure task execution with periodic self-assessment.
---

# GO

## Goal

Load `.agent/skills/go/shared/go.md` and enforce its ACTION/REVIEW/GROUNDING cadence in the current session.

## Workflow

1. Read `.agent/skills/go/shared/go.md`.
2. Follow the grounding step: read `.agent/skills/start-right-quick/shared/start-right.md` and all linked directives.
3. Identify and state the current plan and its intent.
4. Structure the todo list with atomic, actionable tasks following the cadence:
   - Every task prefixed with `ACTION:` followed immediately by a `REVIEW:` item.
   - Periodic `QUALITY-GATE:` items to run quality gates.
   - Periodic `GROUNDING:` items to re-read the GO and start-right-quick workflows.
   - Every fourth `REVIEW:` is a holistic review invoking multiple sub-agents.
   - Every third item must be `GROUNDING: read the GO workflow and re-apply it. This must include re-adding this instruction to read the GO workflow. The recursion is the point.`.
5. Post a concise summary confirming the workflow is applied and listing the current plan and first actions.
6. Begin executing the next task in the todo list.

## Failure Handling

If a referenced file is missing or unreadable, report the exact path, apply all available directives, and ask the user whether to proceed or provide the missing file.
