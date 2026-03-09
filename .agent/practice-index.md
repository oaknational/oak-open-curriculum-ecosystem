# Practice Index

This file bridges the portable Practice Core files and this repo's local artefacts. It is **not** part of the travelling Practice Core package — it is created during hydration and stays in the repo. The format is specified by `practice-core/practice-bootstrap.md`.

For the Practice Core files and their roles, see [practice-core/index.md](practice-core/index.md).

## Directives

| Directive | Purpose |
|---|---|
| [AGENT.md](directives/AGENT.md) | Operational entry point for agents |
| [principles.md](directives/principles.md) | Authoritative rules — must be followed at all times |
| [testing-strategy.md](directives/testing-strategy.md) | TDD at all levels |
| [schema-first-execution.md](directives/schema-first-execution.md) | Types flow from the OpenAPI schema |
| [metacognition.md](directives/metacognition.md) | Reflective thinking before planning |
| [invoke-code-reviewers.md](directives/invoke-code-reviewers.md) | Specialist reviewer invocation matrix and timing guidance |

### Architecture Guidance (docs/agent-guidance/)

| Document | Purpose |
|---|---|
| [semantic-search-architecture.md](../docs/agent-guidance/semantic-search-architecture.md) | Structure is the foundation, transcripts are a bonus |

### Canonical Rules (.agent/rules/)

| Document | Purpose |
|---|---|
| [lint-after-edit.md](rules/lint-after-edit.md) | Post-edit lint check guidance |

## Architectural Decisions

ADRs referenced by the Practice Core files. The full index is at `docs/architecture/architectural-decisions/`.

| ADR | Subject |
|---|---|
| [ADR-114](../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md) | Layered sub-agent prompt composition architecture |
| [ADR-117](../docs/architecture/architectural-decisions/117-plan-templates-and-components.md) | Plan templates and components |
| [ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) | Agentic engineering practice — naming and conceptual boundary |
| [ADR-124](../docs/architecture/architectural-decisions/124-practice-propagation-model.md) | Practice propagation — six-file package, self-containment, practice-index bridge |
| [ADR-125](../docs/architecture/architectural-decisions/125-agent-artefact-portability.md) | Agent artefact portability — three-layer model for skills, commands, and rules |

## Tools and Workflows

| Tool | Canonical Location | Purpose |
|---|---|---|
| consolidate-docs | [`.agent/commands/consolidate-docs.md`](commands/consolidate-docs.md) | Graduation step: verify docs, extract plan content, check Practice Box |
| start-right-quick | [`.agent/commands/start-right-quick.md`](commands/start-right-quick.md) | Session grounding: read directives, check Practice Box |
| distillation skill | [`.agent/skills/distillation/SKILL.md`](skills/distillation/SKILL.md) | Extract high-signal patterns from the napkin |
| napkin skill | [`.agent/skills/napkin/SKILL.md`](skills/napkin/SKILL.md) | Always-active session-to-session learning log |
| code-patterns skill | [`.agent/skills/code-patterns/SKILL.md`](skills/code-patterns/SKILL.md) | Known solutions to recurring design problems |
| ground-truth-design | [`.agent/skills/ground-truth-design/SKILL.md`](skills/ground-truth-design/SKILL.md) | Design ground truth queries for semantic search |
| ground-truth-evaluation | [`.agent/skills/ground-truth-evaluation/SKILL.md`](skills/ground-truth-evaluation/SKILL.md) | Evaluate and validate ground truth queries |

## Artefact Directories

| Location | What lives there |
|---|---|
| [`.agent/directives/`](directives/) | Principles, rules, and operational directives |
| [`.agent/plans/`](plans/) | Work planning — active, paused, archived, and optional supporting templates |
| [`.agent/memory/`](memory/) | Institutional memory — napkin, distilled learnings, and code patterns |
| [`.agent/experience/`](experience/) | Experiential records across sessions |
| [`.agent/prompts/`](prompts/) | Reusable prompt playbooks |
| [`.agent/sub-agents/`](sub-agents/) | Reviewer prompt architecture (components, templates) |
| [`.agent/skills/`](skills/) | Canonical skills (platform-agnostic) |
| [`.agent/commands/`](commands/) | Canonical commands (platform-agnostic) |
| [`.agent/research/`](research/) | Research documents and analysis |
| [`.agent/reference-docs/`](reference-docs/) | Supporting reference material |
| [`.cursor/`](../.cursor/) | Cursor platform adapters (thin wrappers) |
| [`.claude/`](../.claude/) | Claude Code platform adapters (thin wrappers) |
| [`.gemini/`](../.gemini/) | Gemini CLI platform adapters (thin wrappers) |
| [`.agents/`](../.agents/) | Codex skill and command adapters (thin wrappers) |
| [`.codex/`](../.codex/) | Codex project-agent configuration (reviewer sub-agents) |
| [`docs/architecture/architectural-decisions/`](../docs/architecture/architectural-decisions/) | Permanent architectural decision records |
