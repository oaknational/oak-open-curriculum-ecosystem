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
Portability)](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md).
For the live platform support matrix, see
[cross-platform-agent-surface-matrix.md][matrix].

[matrix]: ./cross-platform-agent-surface-matrix.md

## Canonical Content (Layer 1)

| Location | Purpose |
|----------|---------|
| `.agent/skills/*/SKILL.md` | Canonical skills |
| `.agent/rules/*.md` | Canonical rules — reinforcements of policy |
| `.agent/commands/*.md` | Canonical commands |
| `.agent/directives/*.md` | Policy documents (AGENT.md, principles.md, etc.) |
| `.agent/sub-agents/templates/*.md` | Canonical sub-agent prompts (ADR-114) |
| `.agent/memory/active/patterns/` | Reusable solutions ([README](../active/patterns/README.md)) |
| `.agent/plans/` | Implementation plans, execution tracking |

## Host-Local Operational Tooling

| Location | Purpose |
|----------|---------|
| `agent-tools/` | TypeScript implementation of optional Practice-operational CLIs |

`agent-tools/` is not portable Practice Core content and is not a platform
adapter. It is this repo's TypeScript implementation of capabilities that
may need equivalents in other ecosystems. Behaviour-level contracts belong in
`.agent/`; implementation details stay in the host-local tool. Agent-work
capabilities are Practice-owned by default per PDR-035; this repo's phenotype
boundary is ADR-165.

## Platform Entrypoints

| Location | Purpose |
|----------|---------|
| `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` | Thin platform entrypoints that point agents into `.agent/` |

## Platform Adapters (Layer 2)

| Surface | Cursor | Claude Code | Codex | Gemini |
|---------|--------|-------------|-------|--------|
| Skills | `.cursor/skills/*/SKILL.md` | `.claude/skills/*/SKILL.md` | `.agents/skills/*/SKILL.md` | — |
| Commands | `.cursor/commands/*.md` | `.claude/commands/*.md` | `.agents/skills/jc-*/SKILL.md` | `.gemini/commands/*.toml` |
| Rules | `.cursor/rules/*.mdc` | `.claude/rules/*.md` | `.agents/rules/*.md` | — |
| Sub-agents | `.cursor/agents/*.md` | `.claude/agents/*.md` | `.codex/agents/*.toml` | — |

Platform adapters are thin pointers. Canonical content lives under
`.agent/`; adapters preserve platform activation semantics without copying
substance. Claude Code keeps tracked system policy in `.claude/settings.json`;
`.claude/settings.local.json` is gitignored user-local override state.

## How to Create New Artefacts

Always create the canonical file first, then add platform adapters.
Run `pnpm portability:check` after adding to verify parity.

### New Skill

1. **Canonical**: `.agent/skills/<name>/SKILL.md`
2. **Cursor**: `.cursor/skills/<name>/SKILL.md`
3. **Claude Code**: `.claude/skills/<name>/SKILL.md`
4. **`.agents/`**: `.agents/skills/<name>/SKILL.md`
5. **Claude settings**: add `Skill(<name>)` to
   `.claude/settings.json` `permissions.allow`

Adapter (same for Cursor/Claude/Codex): YAML front-matter with
`name` + `description`, body = `Read and follow
.agent/skills/<name>/SKILL.md`.

### New Command

1. **Canonical**: `.agent/commands/<name>.md`
2. **Cursor**: `.cursor/commands/jc-<name>.md`
3. **Claude Code**: `.claude/commands/jc-<name>.md`
4. **`.agents/`**: `.agents/skills/jc-<name>/SKILL.md`
5. **Gemini**: `.gemini/commands/jc-<name>.toml`
6. **Claude settings**: add `Skill(jc-<name>)` and
   `Skill(jc-<name>:*)` to `.claude/settings.json`

Adapter bodies all delegate: `Read and follow .agent/commands/<name>.md`.

- **Cursor**: plain markdown heading + `@.agent/commands/<name>.md`
- **Claude**: YAML front-matter (`description`, `allowed-tools: Read, Bash`)
- **`.agents/`**: YAML front-matter (`name: jc-<name>`, `description`)
- **Gemini**: TOML (`description`, `prompt`)

### New Rule

1. **Canonical**: `.agent/rules/<name>.md`
2. **Cursor**: `.cursor/rules/<name>.mdc`
3. **Claude Code**: `.claude/rules/<name>.md`
4. **`.agents/`**: `.agents/rules/<name>.md`

- **Cursor `.mdc`**: YAML front-matter (`description`,
  `alwaysApply: true`), body = `Read and follow
  .agent/rules/<name>.md`.
- **Claude**: plain text — `Read and follow .agent/rules/<name>.md`.
- **`.agents/`**: same plain-text pointer as Claude.

### New Sub-agent

1. **Canonical**: `.agent/sub-agents/templates/<name>.md`
2. **Cursor**: `.cursor/agents/<name>.md`
3. **Claude Code**: `.claude/agents/<name>.md`
4. **Codex**: `.codex/agents/<name>.toml`

Each adapter reads the canonical template as its first action.
See existing adapters for platform-specific metadata fields.
