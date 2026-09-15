---
fitness_line_target: 80
fitness_line_limit: 125
fitness_char_limit: 7500
fitness_line_length: 100
split_strategy: "Keep concise; this is a reference extracted from AGENT.md"
---

# Agent Artefact Inventory

See [ADR-125](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md),
and the [cross-platform matrix](./cross-platform-agent-surface-matrix.md).

## Canonical Content (Layer 1)

| Location | Purpose |
|----------|---------|
| `.agent/skills/<name>/SKILL-CANONICAL.md` | Canonical skills (sole user-and-model-invokable workflow surface) |
| `.agent/rules/*.md` | Canonical rules — reinforcements of policy |
| `.agent/directives/*.md` | Policy documents (AGENT.md, principles.md, etc.) |
| `.agent/sub-agents/templates/*.md` | Canonical sub-agent prompts (ADR-114) |
| `.agent/memory/active/patterns/` | Reusable solutions ([README](../active/patterns/README.md)) |
| `.agent/plans/` | Implementation plans, execution tracking |

## Host-Local, Non-Practice Surfaces

| Location | Purpose |
|----------|---------|
| `agent-tools/` | TypeScript implementation of optional Practice-operational CLIs |
| `plugins/*/` | User-facing plugin packages — product, not Practice (ADR-125 §Skill classes) |

`agent-tools/` is not portable Practice Core content and is not a platform adapter. It
is this repo's TypeScript implementation of capabilities that may need equivalents in
other ecosystems. Behaviour-level contracts belong in `.agent/`; implementation details
stay in the host-local tool. Agent-work capabilities are Practice-owned by default per
PDR-035; this repo's phenotype boundary is ADR-165.

## Platform Entrypoints

| Location | Purpose |
|----------|---------|
| `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` / `skills.md` | Thin platform entrypoints that point agents into `.agent/` |

## Platform Adapters (Layer 2)

| Surface | Cursor | Claude Code | Codex CLI | Gemini / Antigravity CLI |
| --- | --- | --- | --- | --- |
| Skills | reads `.agents/skills/` | `.claude/skills/oak-*/SKILL.md` | `.agents/skills/oak-*/SKILL.md` | reads `.agents/skills/` |
| Rules | `.cursor/rules/*.mdc` | `.claude/rules/*.md` | entry-point chain; native `.rules` unwired | entry-point chain only |
| Sub-agents | `.cursor/agents/*.md` | `.claude/agents/*.md` | `.codex/agents/*.toml` | transitional review commands; native agents unwired |
| Hooks | no policy activation | `.claude/settings.json` `PreToolUse` | `.codex/config.toml` identity-only `SessionStart` | upstream support; no project hook wired |
| MCP | user-local | user-local | `.codex/config.toml` `[mcp_servers]` | upstream support; no project MCP wired |

Platform adapters are thin pointers to canonical content under `.agent/`;
they preserve platform activation semantics without copying substance.
Claude Code keeps tracked system policy in `.claude/settings.json`;
`.claude/settings.local.json` is gitignored user-local override state.
Gemini / Antigravity CLI has native plugin surfaces for skills, agents, rules,
MCP definitions, and hooks, but the repo currently wires only the entrypoint
chain, portable skills, and transitional review commands.

## How to Create New Artefacts

Always create the canonical file first, then add platform adapters.
Run `pnpm portability:check` after adding to verify parity.

### New Skill

Every active skill spends the finite discovery budget — see the
budget mechanics under §New Runbook before adding one.

1. **Canonical**: `.agent/skills/<name>/SKILL-CANONICAL.md` (with
   `classification: active | passive` frontmatter)
2. **Adapters (generated)**: `.agents/skills/oak-<name>/SKILL.md` and
   `.claude/skills/oak-<name>/SKILL.md` — emitted by
   `pnpm agent-tools:skills-adapter-generate`; **manual edits forbidden**
3. **Claude settings**: add `Skill(oak-<name>)` and
   `Skill(oak-<name>:*)` to `.claude/settings.json` `permissions.allow`
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
Do not add `.agents/agents/` as a shared sub-agent surface; Antigravity-native
agent wrappers require a separate platform-specific design and verification.

### New Runbook

A **runbook** (repeatable operational procedure + verification) is a content kind, NOT
a new surface — [PDR-120](../../practice-core/decision-records/PDR-120-runbooks-are-a-content-kind-not-a-surface.md).
Route by the skill-load-budget triage: a **skill** (invocable + frequent), a **reference
doc** under `docs/operations/` (read on demand), or **embedded** in the rule/directive it
enacts; then add a pointer to the [Runbook Index](../../../docs/operations/README.md#runbook-index).
Full routing: [`extending.md` §Adding a Runbook](../../../docs/engineering/extending.md#adding-a-runbook).

The budget is empirical, not theoretical: every active skill's frontmatter
costs discovery tokens, and past roughly a hundred active skills Claude
Code silently drops late-listed skill metadata (observed 2026-05-06 at
~112 active skills). Treat the total active-skill count as a budgeted
ceiling, never an unbounded list: count the skills a plugin ships before
installing it, and once a plugin's content is canonicalised and locked,
removing the plugin is the default.
