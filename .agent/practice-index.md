# Practice Index

This file bridges the portable practice-core files and this repo's local artefacts. It is **not** part of the travelling practice-core package — it is created during hydration and stays in the repo. The format is specified by `practice-core/practice-bootstrap.md`.

For the practice-core files and their roles, see [practice-core/index.md](practice-core/index.md).

## Directives

| Directive | Purpose |
|---|---|
| [AGENT.md](directives/AGENT.md) | Operational entry point for agents |
| [rules.md](directives/rules.md) | Authoritative rules — must be followed at all times |
| [testing-strategy.md](directives/testing-strategy.md) | TDD at all levels |
| [schema-first-execution.md](directives/schema-first-execution.md) | Types flow from the OpenAPI schema |
| [metacognition.md](directives/metacognition.md) | Reflective thinking before planning |
| [semantic-search-architecture.md](directives/semantic-search-architecture.md) | Structure is the foundation, transcripts are a bonus |

## Architectural Decisions

ADRs referenced by the practice-core files. The full index is at `docs/architecture/architectural-decisions/`.

| ADR | Subject |
|---|---|
| [ADR-114](../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md) | Layered sub-agent prompt composition architecture |
| [ADR-117](../docs/architecture/architectural-decisions/117-plan-templates-and-components.md) | Plan templates and components |
| [ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) | Agentic engineering practice — naming and conceptual boundary |
| [ADR-124](../docs/architecture/architectural-decisions/124-practice-propagation-model.md) | Practice propagation — five-file package, self-containment, practice-index bridge |

## Tools and Workflows

| Tool | Purpose |
|---|---|
| [/jc-consolidate-docs](../.cursor/commands/jc-consolidate-docs.md) | Graduation step: verify docs, extract plan content, check practice box |
| [/jc-start-right](../.cursor/commands/jc-start-right.md) | Session grounding: read directives, check practice box |
| [distillation skill](../.cursor/skills/distillation/SKILL.md) | Extract high-signal patterns from the napkin |
| [invoke-code-reviewers rule](../.cursor/rules/invoke-code-reviewers.mdc) | Full roster, invocation matrix, timing tiers, triage checklist |

## Artefact Directories

| Location | What lives there |
|---|---|
| [`.agent/directives/`](directives/) | Principles, rules, and operational directives |
| [`.agent/plans/`](plans/) | Work planning — active, archived, and templates |
| [`.agent/memory/`](memory/) | Institutional memory — napkin, distilled learnings, and code patterns |
| [`.agent/experience/`](experience/) | Experiential records across sessions |
| [`.agent/prompts/`](prompts/) | Reusable prompt playbooks |
| [`.agent/sub-agents/`](sub-agents/) | Reviewer prompt architecture (components, templates) |
| [`.agent/skills/`](skills/) | Repo-managed skills for shared workflows |
| [`.agent/research/`](research/) | Research documents and analysis |
| [`.agent/reference-docs/`](reference-docs/) | Supporting reference material |
| [`.cursor/rules/`](../.cursor/rules/) | Always-applied workspace rules |
| [`.cursor/commands/`](../.cursor/commands/) | Slash commands |
| [`.cursor/agents/`](../.cursor/agents/) | Sub-agent definitions (Cursor-specific) |
| [`.cursor/skills/`](../.cursor/skills/) | Skills (Cursor-specific) |
| [`docs/architecture/architectural-decisions/`](../docs/architecture/architectural-decisions/) | Permanent architectural decision records |
