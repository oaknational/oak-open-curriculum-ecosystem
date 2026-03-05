---
fitness_ceiling: 80
split_strategy: "Keep concise; this is a reference extracted from AGENT.md"
---

# Agent Artefact Inventory

For the full architecture see [ADR-125 (Agent Artefact Portability)](../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md).

## Canonical Content (Layer 1)

| Location | Purpose |
|----------|---------|
| `.agent/skills/*/SKILL.md` | Canonical skills (12: 2 active, 10 passive) |
| `.agent/commands/*.md` | Canonical commands (10 active, 3 experiments) |
| `.agent/directives/*.md` | Canonical rules and policies |
| `.agent/sub-agents/templates/*.md` | Canonical sub-agent prompts (ADR-114) |
| `.agent/sub-agents/components/personas/*.md` | Shared reviewer identity and review lens |
| `.agent/prompts/*.md` | Reusable prompt playbooks |
| `.agent/memory/code-patterns/` | Known solutions to recurring design problems ([README](../memory/code-patterns/README.md)) |
| `.agent/plans/` | Implementation plans, execution tracking |

## Platform Adapters (Layer 2)

| Location | Purpose |
|----------|---------|
| `.cursor/skills/*/SKILL.md` | Cursor skill wrappers -> `.agent/skills/` |
| `.cursor/commands/*.md` | Cursor command wrappers -> `.agent/commands/` |
| `.cursor/rules/*.mdc` | Cursor activation metadata -> `.agent/directives/` |
| `.cursor/agents/*.md` | Cursor sub-agent wrappers -> `.agent/sub-agents/templates/` |
| `.claude/commands/*.md` | Claude Code command wrappers -> `.agent/commands/` |
| `.claude/agents/*.md` | Claude Code sub-agent wrappers -> `.agent/sub-agents/templates/` |
| `.gemini/commands/*.toml` | Gemini CLI command and review wrappers -> `.agent/commands/` and `.agent/sub-agents/templates/` |
| `.agents/skills/*/SKILL.md` | Codex skill and sub-agent wrappers -> `.agent/skills/` and `.agent/sub-agents/templates/` |
