# Practice Index

This file bridges the portable Practice Core files and this repo's local
artefacts. It is **not** part of the travelling Practice Core package — it is
created during hydration and stays in the repo. The baseline content model is
specified by `practice-core/practice-bootstrap.md`, but local sections can be
split more explicitly when that improves discoverability.

For the Practice Core files and their roles, see [practice-core/index.md](practice-core/index.md).

## Directives

| Directive                                                         | Purpose                                                   |
| ----------------------------------------------------------------- | --------------------------------------------------------- |
| [AGENT.md](directives/AGENT.md)                                   | Operational entry point for agents                        |
| [principles.md](directives/principles.md)                         | Authoritative rules — must be followed at all times       |
| [testing-strategy.md](directives/testing-strategy.md)             | TDD at all levels                                         |
| [schema-first-execution.md](directives/schema-first-execution.md) | Types flow from the OpenAPI schema                        |
| [metacognition.md](directives/metacognition.md)                   | Reflective thinking before planning                       |
| [invoke-code-reviewers.md](directives/invoke-code-reviewers.md)   | Specialist reviewer invocation matrix and timing guidance |

### Architecture Guidance (docs/agent-guidance/)

| Document                                                                                  | Purpose                                              |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [semantic-search-architecture.md](../docs/agent-guidance/semantic-search-architecture.md) | Structure is the foundation, transcripts are a bonus |

### Rules and Hooks Surface

The governance layer is larger than a single file:

- **34 canonical rules** live in [`.agent/rules/`](rules/)
- Thin platform adapters live in [`.cursor/rules/`](../.cursor/rules/) and
  [`.claude/rules/`](../.claude/rules/)
- The canonical hook policy lives in [`.agent/hooks/policy.json`](hooks/policy.json)
- The narrative hook explainer lives in [`.agent/hooks/README.md`](hooks/README.md)
- The live platform-support map lives in
  [`.agent/reference/cross-platform-agent-surface-matrix.md`](reference/cross-platform-agent-surface-matrix.md)

Representative rules:

| Rule                                                       | Purpose                                               |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| [follow-the-practice.md](rules/follow-the-practice.md)     | Keep work aligned with the full Practice system       |
| [tdd-at-all-levels.md](rules/tdd-at-all-levels.md)         | Enforce RED → GREEN → REFACTOR across test levels     |
| [no-type-shortcuts.md](rules/no-type-shortcuts.md)         | Prevent type-erasing shortcuts and assertion drift    |
| [invoke-code-reviewers.md](rules/invoke-code-reviewers.md) | Require the reviewer matrix after non-trivial changes |

Hook support:

| Surface                       | Location                                                                                                      | Current status                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Canonical hook policy         | [`.agent/hooks/policy.json`](hooks/policy.json)                                                               | Source of truth                                                                                                         |
| Hook explainer                | [`.agent/hooks/README.md`](hooks/README.md)                                                                   | Human-readable scope and porting notes                                                                                  |
| Native Claude activation      | [`.claude/settings.json`](../.claude/settings.json)                                                           | Tracked Claude Code project settings; wires `PreToolUse` on fresh checkout, with additive local overrides in `.claude/settings.local.json` |
| Cross-platform support matrix | [`.agent/reference/cross-platform-agent-surface-matrix.md`](reference/cross-platform-agent-surface-matrix.md) | Records supported vs unsupported surfaces                                                                               |

## Architectural Decisions

ADRs referenced by the Practice Core files. The full index is at `docs/architecture/architectural-decisions/`.

| ADR                                                                                                              | Subject                                                                            |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [ADR-114](../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md) | Layered sub-agent prompt composition architecture                                  |
| [ADR-117](../docs/architecture/architectural-decisions/117-plan-templates-and-components.md)                     | Plan templates and components                                                      |
| [ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)                      | Agentic engineering practice — naming and conceptual boundary                      |
| [ADR-124](../docs/architecture/architectural-decisions/124-practice-propagation-model.md)                        | Practice propagation — Core package contract, self-containment, practice-index bridge (contract expanded to files + required directories by PDR-007) |
| [ADR-125](../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)                        | Agent artefact portability — three-layer model for skills, commands, and rules     |
| [ADR-150](../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md) | Continuity surfaces, session handoff, and surprise pipeline                |
| [ADR-152](../docs/architecture/architectural-decisions/152-provenance-uuid-migration.md)                        | Provenance UUID migration — `index` → `id` in travelling provenance chains        |

## Commands, Skills, and Prompts

The execution surface is intentionally split by role:

- **10 stable canonical commands** in [`.agent/commands/`](commands/)
- **3 experimental commands** in [`.agent/commands/experiments/`](commands/experiments/)
- **27 canonical skills** in [`.agent/skills/`](skills/)
- **Prompt library** in [`.agent/prompts/`](prompts/) with the active index at
  [`.agent/prompts/README.md`](prompts/README.md)

Representative execution surfaces:

| Surface               | Canonical location                                      | Representative entries                                                                                                                                                                                                                                                                                                                                                                          | Purpose                                                       |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Commands              | [`.agent/commands/`](commands/)                         | [`start-right-quick.md`](commands/start-right-quick.md), [`start-right-thorough.md`](commands/start-right-thorough.md), [`go.md`](commands/go.md), [`session-handoff.md`](commands/session-handoff.md), [`gates.md`](commands/gates.md), [`plan.md`](commands/plan.md), [`review.md`](commands/review.md), [`commit.md`](commands/commit.md), [`consolidate-docs.md`](commands/consolidate-docs.md), [`metacognition.md`](commands/metacognition.md) | Explicit user-invoked workflows                               |
| Experimental commands | [`.agent/commands/experiments/`](commands/experiments/) | `collaborate`, `step-back`, `think`                                                                                                                                                                                                                                                                                                                                                             | Trial surfaces not yet promoted into the stable command set   |
| Skills                | [`.agent/skills/`](skills/)                             | [`napkin`](skills/napkin/SKILL.md), [`patterns`](skills/patterns/SKILL.md), [`chatgpt-report-normalisation`](skills/chatgpt-report-normalisation/SKILL.md), [`systematic-debugging`](skills/systematic-debugging/SKILL.md), [`start-right-quick`](skills/start-right-quick/SKILL.md), [`start-right-thorough`](skills/start-right-thorough/SKILL.md)                                                                    | On-demand expertise and multi-step workflows                  |
| Session prompts       | [`.agent/prompts/`](prompts/)                           | [`session-continuation.prompt.md`](prompts/session-continuation.prompt.md), [`gt-review.md`](prompts/archive/gt-review.md), [`semantic-search/semantic-search.prompt.md`](prompts/semantic-search/semantic-search.prompt.md)                                                                                                                                                                                       | Stateful session entry points tied to active plans or domains |

## Memory and Patterns

Institutional memory accumulates across sessions and distils into
reusable knowledge:

| Artefact | Location | Purpose |
| --- | --- | --- |
| Distilled learnings | [`memory/distilled.md`](memory/distilled.md) | Hard-won rules — read before every session |
| Pattern library | [`memory/patterns/`](memory/patterns/README.md) | 56 abstract solutions to recurring design problems |
| Session napkin | [`memory/napkin.md`](memory/napkin.md) | Current session observations, written continuously |
| Napkin archive | [`memory/archive/`](memory/archive/) | Rotated napkins (historical record) |

The patterns skill ([`.agent/skills/patterns/SKILL.md`](skills/patterns/SKILL.md))
teaches agents to check the pattern library before inventing new approaches.
Platform adapters exist at `.cursor/skills/patterns/`, `.claude/skills/patterns/`,
and `.agents/skills/patterns/`.

## Artefact Directories

| Location                                                                                      | What lives there                                                            |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`.agent/practice-core/`](practice-core/)                                                     | Portable Practice Core package — trinity + entry points + CHANGELOG + provenance + `decision-records/` (PDRs) + `patterns/` (general abstractions) + `incoming/` (Practice Box) |
| [`.agent/directives/`](directives/)                                                           | Principles, rules, and operational directives                               |
| [`.agent/plans/`](plans/)                                                                     | Work planning — active, paused, archived, and optional supporting templates |
| [`.agent/memory/`](memory/)                                                                   | Institutional memory — napkin, distilled learnings, and code patterns       |
| [`.agent/experience/`](experience/)                                                           | Experiential records across sessions                                        |
| [`.agent/prompts/`](prompts/)                                                                 | Domain-specific handover prompts — stateful session context                 |
| [`.agent/sub-agents/`](sub-agents/)                                                           | Reviewer prompt architecture (components, templates)                        |
| [`.agent/skills/`](skills/)                                                                   | Canonical skills (platform-agnostic)                                        |
| [`.agent/commands/`](commands/)                                                               | Canonical commands (platform-agnostic)                                      |
| [`.agent/research/`](research/)                                                               | Research documents and analysis                                             |
| [`.agent/reference/`](reference/)                                                             | Supporting reference material, including the cross-platform surface matrix  |
| [`.cursor/`](../.cursor/)                                                                     | Cursor platform adapters (thin wrappers)                                    |
| [`.claude/`](../.claude/)                                                                     | Claude Code platform adapters (thin wrappers)                               |
| [`.gemini/`](../.gemini/)                                                                     | Gemini CLI platform adapters (thin wrappers)                                |
| [`.agents/`](../.agents/)                                                                     | Codex skill and command adapters (thin wrappers)                            |
| [`.codex/`](../.codex/)                                                                       | Codex project-agent configuration (reviewer sub-agents)                     |
| [`docs/architecture/architectural-decisions/`](../docs/architecture/architectural-decisions/) | Permanent architectural decision records                                    |
