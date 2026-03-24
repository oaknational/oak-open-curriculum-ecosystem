# Handover Prompts vs Session-Entry Skills

**Origin**: oak-open-curriculum-ecosystem, 2026-03-23
**Context**: Discovered during integration of the prompts-to-skills migration
from algo-experiments

## The Distinction

The prompts-to-skills migration correctly identified that **generic session
workflows** (start-right-quick, start-right-thorough, go) should be skills,
not prompts. They are state-free, reusable, and follow the same
canonical-first pattern as other skills.

However, the migration also eliminated `.agent/prompts/` as an artefact
category entirely. In doing so, it lost a legitimate category:
**handover prompts** — domain-specific, intentionally stateful playbooks
that carry current plan references, domain context, and session-entry
scaffolding.

## Two Categories, Two Purposes

| Property          | Session-entry skills              | Handover prompts                            |
| ----------------- | --------------------------------- | ------------------------------------------- |
| **State**         | State-free (mandatory)            | Intentionally stateful                      |
| **Content**       | Generic workflow steps            | Domain-specific session context              |
| **References**    | Plan-discovery surfaces only      | Specific active plans by name               |
| **Lifecycle**     | Evergreen                         | Archived when work completes                |
| **Location**      | `.agent/skills/`                  | `.agent/prompts/`                           |
| **Frontmatter**   | `type: workflow`                  | `type: handover`, `parent_plan: <path>`     |

## Evidence

In oak-mcp-ecosystem, `.agent/prompts/semantic-search/semantic-search.prompt.md`
is a handover prompt. It carries:

- The absolute priority ("Fix the bugs")
- References to specific active plans by file path
- Current lane status (Phase 1 complete, Phase 2 unblocked)
- Domain-specific safety policy (ingest safety, operator-run commands)
- Key facts for context (F1/F2 findings, SDK `total` caveat)

This cannot be a skill — it is per-domain, per-workstream, intentionally
mutable, and archived when the workstream completes. Making it state-free
would destroy its value.

## Proposed Practice Core Update

The portable Core should acknowledge both categories:

1. **Session-entry skills** (generic, state-free) — already modelled
2. **Handover prompts** (domain-specific, stateful) — a valid local
   adaptation that repos with long-running domain workstreams will need

The Workflow Commands section in `practice-lineage.md` and the Workflow
section in `practice.md` should mention that repos may keep domain-specific
handover prompts in `.agent/prompts/` alongside generic session skills in
`.agent/skills/`. The artefact map should include `.agent/prompts/` as an
optional location.

This is not a rollback of the prompts-to-skills migration — it is a
refinement. The migration was correct for generic workflows. The gap is
that it didn't model the stateful handover case.

## Porting Advice

- If your repo has no long-running domain workstreams, you don't need
  handover prompts — session-entry skills are sufficient
- If you have domain workstreams with active plans, operator procedures,
  and session-entry scaffolding, consider `.agent/prompts/` for those
- The key rule: session-entry skills are state-free; handover prompts are
  intentionally stateful. Never mix the two concerns in the same file
