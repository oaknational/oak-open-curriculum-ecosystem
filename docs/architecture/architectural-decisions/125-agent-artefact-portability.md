# ADR-125: Agent Artefact Portability — Three-Layer Model

**Status**: Accepted
**Date**: 2026-03-04
**Related**: [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md), [ADR-124 (Practice Propagation Model)](124-practice-propagation-model.md)

## Context

ADR-114 established a three-layer prompt composition architecture for sub-agents: canonical templates in `.agent/sub-agents/templates/`, reusable components in `.agent/sub-agents/components/`, and thin platform wrappers in `.cursor/agents/`. This eliminated duplication and drift for reviewer prompts.

However, three other artefact types — skills, commands, and rules — remained platform-specific. Skills existed only in `.cursor/skills/`, commands were duplicated between `.cursor/commands/` and `.claude/commands/` with divergent names and content, and rules lived only in `.cursor/rules/*.mdc`. This created:

1. **Duplication**: 6 commands duplicated between Cursor and Claude with inconsistent content.
2. **Platform lock-in**: 5 skills existed only for Cursor with no portable equivalent.
3. **Maintenance entropy**: changing a command required editing two files in two directories with different names.
4. **Incomplete coverage**: Gemini and Codex had entry points (`GEMINI.md`, `AGENTS.md`) but no access to skills or commands.

## Decision

Extend the three-layer model from ADR-114 to all agent artefact types: skills, commands, rules, and sub-agents — with consistent naming and full coverage across Cursor, Claude Code, Gemini CLI, and Codex.

### Layer 1: Canonical Content (platform-agnostic)

All substantive workflow content lives under `.agent/`:

| Artefact               | Canonical location                           | Count     | Purpose                                                             |
| ---------------------- | -------------------------------------------- | --------- | ------------------------------------------------------------------- |
| Skills (active)        | `.agent/skills/*/SKILL.md` and `shared/*.md` | 2         | Command-invoked workflows (start-right-quick, start-right-thorough) |
| Skills (passive)       | `.agent/skills/*/SKILL.md`                   | 10        | Guidance consumed by workflows or linked from other artefacts       |
| Commands               | `.agent/commands/*.md`                       | 10 active | Reusable command instructions                                       |
| Commands (experiments) | `.agent/commands/experiments/*.md`           | 3 parked  | Experimental commands not yet hooked up                             |
| Rules                  | `.agent/directives/*.md`                     | —         | Policies and principles                                             |
| Sub-agent templates    | `.agent/sub-agents/templates/*.md`           | 11        | Reviewer prompts (ADR-114)                                          |
| Sub-agent personas     | `.agent/sub-agents/components/personas/*.md` | 4         | Shared architecture reviewer identity and lens                      |
| Sub-agent components   | `.agent/sub-agents/components/`              | —         | Reusable behaviours, principles, architecture notes                 |
| Plan templates         | `.agent/plans/` (organised by domain)        | —         | Implementation plans, execution tracking                            |

### Layer 2: Platform Adapters (thin wrappers)

Each platform has thin wrappers that reference canonical content. All command adapters use the `jc-*` prefix for consistent naming.

#### Cursor

| Location                    | Format                                                        | Count |
| --------------------------- | ------------------------------------------------------------- | ----- |
| `.cursor/commands/jc-*.md`  | Markdown with `@` file references                             | 9     |
| `.cursor/rules/*.mdc`       | Markdown with `alwaysApply`/`globs`/`description` frontmatter | 17    |
| `.cursor/skills/*/SKILL.md` | Thin wrappers -> `.agent/skills/`                             | 7     |
| `.cursor/agents/*.md`       | Markdown with `name`/`description`/`model`/`tools`/`readonly` | 14    |

#### Claude Code

| Location                      | Format                                                                                                                                                                                                                           | Count |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `.claude/commands/jc-*.md`    | Markdown with YAML frontmatter (`description`, `allowed-tools`, `argument-hint`, `model`)                                                                                                                                        | 9     |
| `.claude/rules/*.md`          | Markdown with `paths` frontmatter for glob-scoped activation                                                                                                                                                                     | 6     |
| `.claude/agents/*.md`         | Markdown with YAML frontmatter (`name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `color`). All wrappers require: explicit `model` field, `color` field, and ≥2 `<example>` blocks in `description`. | 13    |
| `.claude/agents/archive/*.md` | Archived wrappers — superseded or retired agents. Preserved for reference. Not validated by `pnpm subagents:check`.                                                                                                              | —     |

#### Gemini CLI

| Location                         | Format                                                                                           | Count |
| -------------------------------- | ------------------------------------------------------------------------------------------------ | ----- |
| `.gemini/commands/jc-*.toml`     | TOML v1 with `prompt` (required) and `description` (optional); `{{args}}` for argument injection | 9     |
| `.gemini/commands/review-*.toml` | TOML v1 review commands -> `.agent/sub-agents/templates/`                                        | 14    |

#### Codex

| Location                                    | Format                                                                   | Count |
| ------------------------------------------- | ------------------------------------------------------------------------ | ----- |
| `.agents/skills/jc-*/SKILL.md`              | Thin wrapper with `name`/`description` frontmatter -> `.agent/commands/` | 9     |
| `.agents/skills/*/SKILL.md` (instructional) | Thin wrapper -> `.agent/skills/`                                         | 7     |
| `.agents/skills/*/SKILL.md` (sub-agents)    | Thin wrapper -> `.agent/sub-agents/templates/`                           | 14    |

Codex skills are invoked with `$skill-name` syntax (e.g. `$jc-review`, `$code-reviewer`).

### Layer 3: Entry Points

Root-level files direct each platform to the canonical practice:

| File        | Platform    |
| ----------- | ----------- |
| `CLAUDE.md` | Claude Code |
| `AGENTS.md` | Codex       |
| `GEMINI.md` | Gemini CLI  |

All entry points redirect to `.agent/directives/AGENT.md`.

### The Thin Wrapper Contract

A thin wrapper contains ONLY:

- Platform-specific activation metadata (e.g., Cursor `.mdc` frontmatter with `globs`/`alwaysApply`, Claude YAML frontmatter with `allowed-tools`/`permissionMode`, Gemini TOML `description`)
- A short description
- A pointer to the canonical content path
- Platform-specific invocation syntax where the canonical form cannot express it (e.g., Cursor `@` mentions, Claude `$ARGUMENTS`, Gemini `{{args}}`/`!{...}`/`@{...}`, Cursor Task tool `subagent_type`)

A thin wrapper MUST NOT contain substantive instructions, workflow steps, or logic that does not exist in the canonical source. The canonical content describes **what** to do; the wrapper describes **how** to invoke it on a specific platform.

### Command Naming Convention

All command adapters use the `jc-` prefix across every platform. This ensures a developer switching between platforms uses the same invocation name:

| Platform    | Invocation   | Example                  |
| ----------- | ------------ | ------------------------ |
| Cursor      | `/jc-review` | Slash command in chat    |
| Claude Code | `/jc-review` | Slash command in CLI/IDE |
| Gemini CLI  | `/jc-review` | Custom command           |
| Codex       | `$jc-review` | Skill mention in CLI/IDE |

### Sub-agent Adapter Formats

Each platform uses its native mechanism for sub-agent-equivalent functionality:

| Platform    | Mechanism                        | Key fields                                                                            |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| Cursor      | `.cursor/agents/*.md`            | `name`, `description`, `model`, `tools`, `readonly`                                   |
| Claude Code | `.claude/agents/*.md`            | `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `color` |
| Gemini CLI  | `.gemini/commands/review-*.toml` | `description`, `prompt` (user-invoked review commands)                                |
| Codex       | `.agents/skills/*/SKILL.md`      | `name`, `description` (skills as the sub-agent mechanism)                             |

Read-only reviewers on Claude Code use `permissionMode: plan` and `disallowedTools: Write, Edit` to enforce read-only behaviour at the platform level, not just via instructions.

### Rules: Policies vs Activation Triggers

Rules have two conceptually distinct layers:

1. **Authoritative policies** (`.agent/directives/principles.md`) — the canonical rules document defining what must be followed: TDD, no type shortcuts, fail fast, code quality standards, architectural model. This is substantive content. It is the single source of truth for the rules themselves.

2. **Activation triggers** (`.cursor/rules/*.mdc`, entry-point chains) — platform-specific mechanisms that determine _when_ and _how_ policies surface during a session. These are not thin wrappers for `principles.md` in the way command wrappers point at commands. They are a separate artefact type: a trigger mechanism that activates specific policies, directives, or skills at the right moment.

Some triggers activate policies from `principles.md` via a canonical rule (e.g., `apply-architectural-principles.mdc` → `.agent/rules/apply-architectural-principles.md` → `principles.md`). Others activate standalone directives (e.g., `invoke-code-reviewers.mdc` → `.agent/directives/invoke-code-reviewers.md`). Others activate skills (e.g., `napkin-always-active.mdc` → `.agent/skills/napkin/SKILL.md`). The trigger is not the policy — it is the mechanism that surfaces the policy.

#### Many-to-One Consolidation Pattern

When multiple canonical rules all point to the same authoritative source
(e.g., different sections of `principles.md`), they may be consolidated
into a single canonical rule with a single trigger. This avoids
maintaining many thin redirects that add no value beyond the indirection.

The consolidation works as follows:

1. **One consolidated canonical rule** (e.g.,
   `.agent/rules/apply-architectural-principles.md`) replaces many
   individual rules that were thin pointers to `principles.md`.
2. **One consolidated trigger per platform** (e.g.,
   `apply-architectural-principles.mdc`,
   `.claude/rules/apply-architectural-principles.md`) replaces the
   individual triggers.
3. **Specialised rules retained** when they have unique activation
   metadata (e.g., `no-type-shortcuts.mdc` with `globs: "**/*.ts"`)
   that cannot be expressed by the consolidated trigger.

The three-layer model is preserved: trigger → canonical rule →
authoritative source. The consolidation reduces the number of
canonical rules and triggers, not the number of layers.

**Cursor** has granular activation via `.cursor/rules/*.mdc` frontmatter:

| Activation     | Mechanism               | Example                                                    |
| -------------- | ----------------------- | ---------------------------------------------------------- |
| Always-on      | `alwaysApply: true`     | `apply-architectural-principles.mdc` (consolidated)        |
| File-scoped    | `globs: "**/*.test.ts"` | `no-skipped-tests.mdc`, `no-global-state-in-tests.mdc`     |
| File-scoped    | `globs: "**/*.ts"`      | `no-type-shortcuts.mdc`, `unknown-is-type-destruction.mdc` |
| Agent-selected | `description: "..."`    | Agent decides based on relevance                           |

**Claude Code** has two activation mechanisms: always-on policies via the entry-point chain (`CLAUDE.md` → `AGENT.md` → `principles.md`), and path-scoped rules via `.claude/rules/*.md` with `paths` frontmatter. Path-scoped rules only load when Claude opens matching files, reducing context consumption for domain-specific policies (e.g., test rules only when editing test files). Only glob-scoped triggers have Claude rule equivalents — always-on triggers are already covered by the entry-point chain.

**Gemini CLI, Codex** receive policies via the entry-point chain only: `GEMINI.md` / `AGENTS.md` → `.agent/directives/AGENT.md` → `.agent/directives/principles.md`. All policies are effectively always-on via the entry point.

**Triggers that activate skills or directives:**

| Trigger                          | What it activates                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| `apply-architectural-principles` | All architectural principles via `.agent/rules/apply-architectural-principles.md`         |
| `napkin-always-active`           | `.agent/skills/napkin/SKILL.md`                                                           |
| `use-start-right-skills`         | `.agent/skills/start-right-quick/SKILL.md`, `.agent/skills/start-right-thorough/SKILL.md` |
| `follow-the-practice`            | Practice reading, which leads to skills                                                   |
| `invoke-code-reviewers`          | All registered reviewers via `.agent/directives/invoke-code-reviewers.md`                 |
| `lint-after-edit`                | Lint checking (file-scoped to `*.ts`)                                                     |

#### Trigger Content Contract

A trigger file (`.cursor/rules/*.mdc`) MUST:

- Include `alwaysApply`/`globs`/`description` frontmatter (activation metadata)
- Include a reference to its canonical source (`.agent/directives/*.md`, `.agent/skills/*/SKILL.md`, an ADR, or `docs/`)

A trigger file MAY:

- Include a concise summary (max 5 lines) for immediate LLM context

A trigger file MUST NOT:

- Contain the full canonical policy — the canonical source is authoritative
- Exceed 10 content lines (excluding frontmatter) without review — if exceeded, consider whether the content belongs in the canonical source instead

### Skills Structure Contract

1. **One skill, one owner directory**: each skill is rooted at `.agent/skills/<skill-id>/`.
2. **Stable naming**: paired modes use explicit IDs (`start-right-quick`, `start-right-thorough`).
3. **Required files**: `SKILL.md` (canonical workflow contract).
4. **Optional files**: `agents/<platform>.yaml` (adapter metadata), `shared/` (reusable workflow sources owned by the skill).
5. **Shared workflow ownership**: a skill must not store another skill's shared workflow sources.
6. **Adapter boundary**: `.agent/skills/**` is the platform-agnostic source of truth; `.cursor/skills/**` are thin wrappers.
7. **Command/rule boundary**: `.cursor/commands/**` and `.claude/commands/**` invoke skills/workflows but are not canonical content stores; `.cursor/rules/**` define activation policy and point to canonical content.
8. **No compatibility aliases**: canonical command IDs are mandatory; do not keep parallel alias commands.
9. **Classification**: every `SKILL.md` MUST include a `classification` field in its YAML frontmatter: `active` (invoked via platform commands) or `passive` (guidance consumed by workflows or linked from other artefacts).

### Plan Template Contract

### Platform Configuration: Project vs Local Settings

Platform configuration files follow the same tracked/untracked split as
code. **Project settings** define the agentic system contract and must
work on fresh checkout. **Local settings** contain user-specific paths
and overrides.

| Platform    | Project config (tracked) | Local config (gitignored)        |
| ----------- | ------------------------ | -------------------------------- |
| Claude Code | `.claude/settings.json`  | `.claude/settings.local.json`    |
| Cursor      | `.cursor/settings.json`  | `.cursor/settings.local.json`    |
| Gemini CLI  | `.gemini/settings.json`  | `.gemini/settings.local.json`    |
| Codex       | `.codex/config.toml`     | (no local equivalent documented) |

**Project settings contain:**

- Skill and command permission allowlists (`Skill(jc-*)` entries)
- Safety hooks (`PreToolUse` matchers for Bash, Edit, Write)
- MCP tool allowlists (`mcp__*` entries)
- Domain fetch permissions (`WebFetch(domain:*)`)
- Plugin enable/disable state
- Standard development tool permissions (`git`, `gh`, `npx turbo`)

**Local settings contain:**

- Absolute filesystem paths (`/Users/...`, `/tmp/...`)
- One-off command permissions accumulated during sessions
- User-specific MCP server selection
- Output style preferences

Arrays (permissions, hooks) **concatenate and deduplicate** across
scopes per Claude Code merge semantics. This means project permissions
are always active, and users can add their own on top without editing
tracked files.

**Why this matters:** without tracked project settings, a fresh checkout
has skills that exist as adapters but cannot be invoked — platform
permission systems silently block them. The project settings layer is
part of the agentic system infrastructure, not a user preference.

### Plan Templates

Plan templates are platform-agnostic by nature — they are consumed directly by agents on all platforms and do not require Layer 2 adapters.

1. **Location**: plans live under `.agent/plans/<domain>/` organised by status (`active/`, `current/`, `future/`, `archive/`).
2. **Frontmatter**: plans use YAML frontmatter with `name`, `overview`, and `todos` (status tracking).
3. **No adapters**: plan templates need no platform-specific wrappers.
4. **Lifecycle**: NOT STARTED → IN PROGRESS → COMPLETE → archived.

## Rationale

### Why extend rather than replace

ADR-114's three-layer model is proven and working for sub-agents. The same forces (duplication, drift, maintenance cost) apply to skills, commands, and rules. Extending the existing pattern avoids inventing a new architecture.

### Why not keep platform-specific content

Four platforms are now active: Cursor, Claude Code, Gemini CLI, and Codex. Maintaining independent copies of each command, skill, and rule across four platforms is unsustainable. The canonical-plus-adapter model scales linearly: one canonical file plus one thin wrapper per platform.

### Why `.agent/commands/` instead of `.agent/prompts/`

`.agent/prompts/` already exists for reusable prompt playbooks (e.g.,
`session-continuation.prompt.md`, semantic search prompts). Commands are a
distinct artefact type: they are invoked by name, have platform-specific
syntax, and map to slash commands. Keeping them separate avoids overloading the
prompts directory.

### Why consistent `jc-*` naming across platforms

Different names for the same command (`jc-full-review` vs `/review` vs `jc-review`) created cognitive load when switching between platforms. A single name per command reduces confusion and makes the system easier to document and discover.

### Why principles.md is separate from activation triggers

`principles.md` is the authoritative policy document — substantive content that defines what must be done. The `.mdc` trigger files are a platform-specific activation mechanism — metadata that controls when and how policies surface. These are different artefact types serving different purposes. A trigger may activate a rule from `principles.md`, a standalone directive, or a skill. Conflating them would either force all rules into individual files (losing the coherent policy document) or force all triggers into one file (losing granular activation control). Keeping them distinct preserves both values.

### Why `permissionMode: plan` for Claude Code reviewers

Claude Code natively supports read-only permission modes. Using `permissionMode: plan` plus `disallowedTools: Write, Edit` enforces read-only behaviour at the platform level, rather than relying solely on system prompt instructions. This is more robust and follows the principle of least privilege.

## Consequences

### Positive

- Commands authored once, available on all four platforms with identical names.
- Sub-agents available on all four platforms using each platform's native mechanism.
- Skills discoverable by all agents through `AGENT.md` and platform-specific adapters.
- Rule content canonical in `.agent/directives/`, activation policy platform-specific.
- Adding a fifth platform requires only thin wrappers, not content duplication.
- Architecture reviewer personas are DRY: defined once in canonical components, referenced by all 16 platform wrappers.

### Trade-offs

- Four directories per artefact type (canonical + four platform adapters) creates more files, though each adapter is small.
- Platform-specific capabilities (Cursor `globs`, Claude `permissionMode`, Gemini `{{args}}`) require wrapper maintenance.
- Codex uses `.agents/skills/` (plural) for discovery, while our canonical path is `.agent/skills/` (singular). Thin wrappers in `.agents/skills/` bridge the gap, consistent with the pattern used for all other platforms.
- Cursor is the only platform with granular rule activation (globs, agent-selected). Other platforms receive all rules at session start, which increases context consumption but ensures nothing is missed.
- Gemini CLI lacks native sub-agent spawning; review commands serve as the user-invoked equivalent but lack automatic delegation.

## Known Limitations

### Agent comprehension of thin wrappers

Agents may not follow "Read and follow X" instructions in thin wrappers, skipping the canonical content entirely. Mitigations vary by platform:

- **Cursor**: `@` file injection forces content loading — the most reliable mechanism.
- **Claude Code / Gemini CLI / Codex**: canonical content should include guards ("If you have not read X, stop and read it now"). Minimal fallback context (up to 5 lines) in wrappers helps when the agent skips the read.

### Plugin and external content in adapter directories

Platform adapter directories may contain externally installed content (e.g., Clerk skills) alongside canonical wrappers. Validation scripts must exclude non-canonical content to avoid false positives.

## Amendments

### 2026-04-17 — Thin-wrapper scope clarification

The "thin wrapper" contract established in §Layer 2 applies to **platform
adapters wrapping canonical content**, not to canonical command-to-skill
relationships. Commands (`.agent/commands/`) and skills (`.agent/skills/`)
are sibling Layer 1 artefacts; a canonical command that orchestrates
skills or invokes logic of its own is not a thin wrapper, and it does not
violate this ADR's thin-wrapper requirement. A "thick" orchestrating
command is a valid Layer 1 artefact — see ADR-135's `process_executor`
classification for the worked example.

This clarification graduated from `.agent/memory/distilled.md` (2026-04-16
observation) as part of the enforce-edge tightening pass alongside
ADR-144's three-zone model revision.

## References

- `.agent/skills/` — canonical skills (12: 2 active, 10 passive)
- `.agent/commands/` — canonical commands (10 active, 3 experiments)
- `.agent/directives/` — canonical rules
- `.agent/sub-agents/` — canonical sub-agent prompts (ADR-114), personas, and components
- `.cursor/`, `.claude/`, `.gemini/`, `.agents/` — platform adapters
- [ADR-135](135-agent-classification-taxonomy.md) — agent classification taxonomy referenced in the 2026-04-17 amendment
