---
fitness_line_target: 80
fitness_line_limit: 125
fitness_char_limit: 7500
fitness_line_length: 100
split_strategy: "Keep concise; this is a reference extracted from AGENT.md"
---

# Agent Artefact Inventory

For the full architecture, see
[ADR-125 (Agent Artefact
Portability)](../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md).

## Canonical Content (Layer 1)

| Location | Purpose |
|----------|---------|
| `.agent/skills/*/SKILL.md` | Canonical skills (27: 16 active, 11 passive) |
| `.agent/rules/*.md` | Canonical operational rules (34) — reinforcements of policy |
| `.agent/commands/*.md` | Canonical commands (10 active, 3 experiments) |
| `.agent/directives/*.md` | Policy documents (AGENT.md, principles.md, testing-strategy.md, etc.) |
| `.agent/sub-agents/templates/*.md` | Canonical sub-agent prompts (ADR-114) |
| `.agent/sub-agents/components/personas/*.md` | Shared reviewer identity and review lens |
| `.agent/prompts/*.md` | Reusable prompt playbooks |
| `.agent/memory/patterns/` | Known solutions to recurring design problems ([README](../memory/patterns/README.md)) |
| `.agent/plans/` | Implementation plans, execution tracking |
| `agent-tools/` | Repo-root TypeScript CLI workspace for agent operational tooling (`claude-agent-ops`, `cursor-session-from-claude-session`) |

## Platform Adapters (Layer 2)

| Location | Purpose |
|----------|---------|
| `.cursor/skills/*/SKILL.md` | Cursor skill wrappers -> `.agent/skills/` |
| `.cursor/commands/*.md` | Cursor command wrappers -> `.agent/commands/` |
| `.cursor/rules/*.mdc` | Cursor activation triggers -> `.agent/rules/` or `.agent/skills/` |
| `.cursor/agents/*.md` | Cursor sub-agent wrappers -> `.agent/sub-agents/templates/` |
| `.claude/commands/*.md` | Claude Code command wrappers -> `.agent/commands/` |
| `.claude/rules/*.md` | Claude Code path-scoped triggers -> `.agent/rules/` or `.agent/skills/` |
| `.claude/agents/*.md` | Claude Code sub-agent wrappers -> `.agent/sub-agents/templates/` |
| `.claude/agents/archive/` | Archived Claude Code sub-agent wrappers (superseded or retired) |
| `.gemini/commands/*.toml` | Gemini CLI command and review wrappers -> `.agent/commands/` and `.agent/sub-agents/templates/` |
| `.agents/skills/*/SKILL.md` | Codex skill and sub-agent wrappers -> `.agent/skills/` and `.agent/sub-agents/templates/` |
