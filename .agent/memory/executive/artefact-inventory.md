---
fitness_line_target: 80
fitness_line_limit: 125
fitness_char_limit: 7500
fitness_line_length: 100
split_strategy: 'Keep concise; this is a reference extracted from AGENT.md'
---

# Agent Artefact Inventory

See PDR-009,
and the [cross-platform matrix](./cross-platform-agent-surface-matrix.md).

## Canonical Content (Layer 1)

| Location                                  | Purpose                                                           |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `.agent/skills/<name>/SKILL-CANONICAL.md` | Canonical skills (sole user-and-model-invokable workflow surface) |
| `.agent/rules/*.md`                       | Canonical rules — reinforcements of policy                        |
| `.agent/directives/*.md`                  | Policy documents (AGENT.md, principles.md, etc.)                  |
| `.agent/sub-agents/templates/*.md` | Canonical sub-agent prompts (PDR-009), each carrying its declaration in frontmatter: the one source of the adapter surfaces, which are generated outputs and never hand-authored |
| `.agent/memory/active/patterns/`          | Reusable solutions ([README](../active/patterns/README.md))       |
| `.agent/plans/`                           | Plan nodes: strategic, delivery and runbook (`plan-node-schema.md`) |

## Host-Local, Non-Practice Surfaces

| Location       | Purpose                                                         |
| -------------- | --------------------------------------------------------------- |
| `agent-tools/` | TypeScript implementation of optional Practice-operational CLIs |
| the host's user-facing plugin packages, where it ships them (OCE shipped its own from this repository until 2026-10-21 and now builds them in oaknational/oak-ai-plugins) | Product, not Practice (OCE's ADR-125 §Skill classes) |

`agent-tools/` is not portable Practice Core content and is not a platform adapter. It
is the host's TypeScript implementation of capabilities that may need equivalents in
other ecosystems. Behaviour-level contracts belong in `.agent/`; implementation details
stay in the host-local tool. Agent-work capabilities are Practice-owned by default per
PDR-035; the host's phenotype boundary record (in OCE, ADR-165) names what stays
host-local.

## Platform Entrypoints

| Location                                              | Purpose                                                    |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` / `skills.md` | Thin platform entrypoints that point agents into `.agent/` |

## Platform Adapters (Layer 2)

| Surface    | Cursor                  | Claude Code                          | Codex CLI                                         | Gemini / Antigravity CLI                |
| ---------- | ----------------------- | ------------------------------------ | ------------------------------------------------- | --------------------------------------- |
| Skills     | reads `.agents/skills/` | `.claude/skills/<prefix>*/SKILL.md`  | `.agents/skills/<prefix>*/SKILL.md`               | reads `.agents/skills/`                 |
| Rules      | `.cursor/rules/*.mdc`   | `.claude/rules/*.md`                 | entry-point chain; the host's exec-policy rules where wired | entry-point chain only         |
| Sub-agents | `.cursor/agents/*.md`   | `.claude/agents/*.md`                | `.codex/agents/*.toml`                            | `.gemini/agents/*.md` where the host renders Gemini |
| Hooks      | no policy activation    | `.claude/settings.json` `PreToolUse` | `.codex/config.toml` identity-only `SessionStart` | upstream support; no project hook wired |
| MCP        | user-local              | user-local                           | `.codex/config.toml` `[mcp_servers]` where the host tracks servers | upstream support; no project MCP wired |

`<prefix>` is the host's skill adapter prefix (`jc-` here, `oak-` in OCE); the
platforms a host renders are its templates' `platforms` declarations, and the
cross-platform matrix records what each host has wired.

Platform adapters are thin pointers to canonical content under `.agent/`;
they preserve platform activation semantics without copying substance.
Claude Code keeps tracked system policy in `.claude/settings.json`;
`.claude/settings.local.json` is gitignored user-local override state.
Gemini / Antigravity CLI has native plugin surfaces for skills, agents, rules,
MCP definitions, and hooks; the repo wires the entrypoint chain (`GEMINI.md`)
and the portable skills, and a host whose declarations render Gemini also
generates the sub-agents under `.gemini/agents/`.

## How to Create New Artefacts

Always create the canonical file first; its platform adapters are generated
(`pnpm portability:fix` for a rule or a sub-agent, `pnpm skills:generate` for a skill) and
never edited by hand; `pnpm portability:check` recomputes them and refuses drift.

### New Skill

Every active skill spends the finite discovery budget — see the
budget mechanics under §New Runbook before adding one.

1. **Canonical**: `.agent/skills/<name>/SKILL-CANONICAL.md` (with
   `classification: active | passive` frontmatter). Optional Agent Skills
   frontmatter projects to both surfaces — the field set the skills generator
   projects (recorded in OCE's ADR-125, its Layer 2 adapter table). Quote
   every `metadata` value (`owned: "true"`): the map is string→string and an
   unquoted `true` or `1.0` refuses the canonical.
2. **Adapters (generated)**: `.agents/skills/<prefix><name>/SKILL.md` and
   `.claude/skills/<prefix><name>/SKILL.md` — emitted by
   `pnpm skills:generate`; **manual edits forbidden**
3. **Claude settings**: add `Skill(<prefix><name>)` and
   `Skill(<prefix><name>:*)` to `.claude/settings.json` `permissions.allow`
4. **Verification**: `pnpm skills:check` (adapter drift) and
   `pnpm portability:check` (permission + canonical frontmatter)

Skills are the sole user-and-model-invokable workflow surface; custom
command surfaces are retired (2026-05-10, recorded in OCE's ADR-125).

### New Rule

1. **Canonical**: `.agent/rules/<name>.md`, with the declaration in its frontmatter:
   `classification` (`core` or `situational`), `description`, and for a situational rule
   `trigger` and optionally `globs` (a YAML list). The trigger vocabulary is the
   declaration's own (`surface:`, `ceremony:`, and kin, as the existing rules use it).
2. **Projections (generated)**: run `pnpm portability:fix`. It renders the rule's row in
   `RULES_INDEX.md`, `.cursor/rules/<name>.mdc`, `.claude/rules/<name>.md` and
   `.agents/rules/<name>.md` from the declaration; `pnpm portability:check` recomputes them
   byte for byte. Those four surfaces are wholly generated: a hand edit fails the check, a
   regular file there that no rule renders is removed by `--fix`, and a link, directory or
   special entry there makes the check refuse before it writes or removes anything. The
   shapes live in `agent-tools/src/rule-declarations/render-rule-projections.ts`.

### New Sub-agent

1. **Canonical**: `.agent/sub-agents/templates/<name>.md`, with a frontmatter declaration
   (a description and, per platform, only what deviates from the standard adapter body;
   `.agent/sub-agents/README.md` §Declarations)
2. **The adapters**: `pnpm portability:fix` renders `.cursor/agents/<name>.md`,
   `.claude/agents/<name>.md` and `.codex/agents/<name>.toml` with its `.codex/config.toml`
   block from the declaration, and `.gemini/agents/<name>.md` where the declaration's
   platform set renders Gemini; `pnpm portability:check` recomputes them, so none is
   written by hand.

Each pointer adapter reads the canonical template as its first action; an inline-prompt
role's Claude adapter (PDR-009) carries the template's System prompt block instead.
Do not add `.agents/agents/` as a shared sub-agent surface; Antigravity-native
agent wrappers require a separate platform-specific design and verification.

### New Runbook

A **runbook** (repeatable operational procedure + verification) is a content kind, NOT
a new surface — [PDR-120](../../practice-core/decision-records/PDR-120-runbooks-are-a-content-kind-not-a-surface.md).
Route by the skill-load-budget triage: a **skill** (invocable + frequent), a **reference
doc** under `.agent/reference/` (read on demand; list it in that directory's README), or
**embedded** in the rule/directive it enacts.

The budget is empirical, not theoretical: every active skill's frontmatter
costs discovery tokens, and past roughly a hundred active skills Claude
Code silently drops late-listed skill metadata (observed 2026-05-06 at
~112 active skills). Treat the total active-skill count as a budgeted
ceiling, never an unbounded list: count the skills a plugin ships before
installing it, and once a plugin's content is canonicalised and locked,
removing the plugin is the default.
