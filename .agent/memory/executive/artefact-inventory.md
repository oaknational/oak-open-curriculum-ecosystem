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
| `.agent/skills/<name>/SKILL-CANONICAL.md` | Canonical skills (sole user-and-model-invokable workflow surface) |
| `.agent/rules/*.md` | Canonical rules — reinforcements of policy |
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

| Surface | Cursor | Claude Code | Codex (`.agents/` alias) | Gemini |
|---------|--------|-------------|-------|--------|
| Skills | (reads `.agents/skills/`) | `.claude/skills/jc-*/SKILL.md` | `.agents/skills/jc-*/SKILL.md` | (reads `.agents/skills/`) |
| Rules | `.cursor/rules/*.mdc` | `.claude/rules/*.md` | `.agents/rules/*.md` | — |
| Sub-agents | `.cursor/agents/*.md` | `.claude/agents/*.md` | `.codex/agents/*.toml` | (`review-*.toml` transitional, sub-agent only) |

Platform adapters are thin pointers. Canonical content lives under
`.agent/`; adapters preserve platform activation semantics without copying
substance. Claude Code keeps tracked system policy in `.claude/settings.json`;
`.claude/settings.local.json` is gitignored user-local override state.

## How to Create New Artefacts

Always create the canonical file first, then add platform adapters.
Run `pnpm portability:check` after adding to verify parity.

### New Skill

1. **Canonical**: `.agent/skills/<name>/SKILL-CANONICAL.md` (with
   `classification: active | passive` frontmatter)
2. **Adapters (generated)**: `.agents/skills/jc-<name>/SKILL.md` and
   `.claude/skills/jc-<name>/SKILL.md` — emitted by
   `pnpm agent-tools:skills-adapter-generate`; **manual edits forbidden**
3. **Claude settings**: add `Skill(jc-<name>)` and
   `Skill(jc-<name>:*)` to `.claude/settings.json` `permissions.allow`
4. **Verification**: `pnpm skills:check` (adapter drift) and
   `pnpm portability:check` (permission + canonical frontmatter)

Skills are the sole user-and-model-invokable workflow surface; custom
command surfaces are retired (see ADR-125 §2026-05-10).

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
