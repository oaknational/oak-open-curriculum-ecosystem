# `.agents/agents/`

This directory is intentionally explanatory only.

Canonical sub-agent prompts live in `.agent/sub-agents/templates/`.
Platform adapters live where each platform has a native sub-agent
surface:

- Cursor: `.cursor/agents/`
- Claude Code: `.claude/agents/`
- Codex project agents: `.codex/agents/`

The `.agents/` standard provides a portable skill surface, not a
shared sub-agent invocation model. Sub-agent execution is platform
specific enough that thin wrappers here would imply parity that does
not exist.

See `.agent/memory/executive/artefact-inventory.md` and
`docs/architecture/architectural-decisions/125-agent-artefact-portability.md`.
