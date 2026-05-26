# ADR-125: Agent Artefact Portability — Three-Layer Model

**Status**: Accepted
**Date**: 2026-03-04
**Amended**: 2026-05-09 — vendor-agnostic two-surface skills contract per [PDR-051](../../../.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md). Skill adapters are retired from `.cursor/skills/`, `.gemini/skills/`, `.codex/skills/`, and `.windsurf/skills/`; only `.agents/skills/` (cross-tool alias) and `.claude/skills/` (Claude-native) remain. Canonical skill body filename is `SKILL-CANONICAL.md` (non-discoverable). Custom command surfaces (`.agent/commands/`, `.cursor/commands/`, `.claude/commands/`, `.gemini/commands/`) are a transition target for retirement, but cleanup is not complete while those directories still exist in the repo. Canonical command behaviour is being subsumed into skills. The thin-wrapper contract, three-layer model, and rules/sub-agent surfaces are unchanged.
**Amended**: 2026-05-10 — clarified that Gemini `review-*.toml` files are
transitional sub-agent invocation adapters only while Gemini lacks native
sub-agent spawning. They are not a general custom-command surface and must be
removed or reclassified when native Gemini agent support exists.
**Amended**: 2026-05-10 — `.agent/commands/`, `.cursor/commands/jc-*.md`,
and `.gemini/commands/jc-*.toml` are now retired. Their substantive content
has been inlined into `.agent/skills/<name>/SKILL-CANONICAL.md`; skills are
the sole user-and-model-invokable workflow surface. The 2026-05-09
amendment's transitional language no longer applies. (Historical: at the
time of this amendment the owned-skill prefix was `jc-`; that prefix was
later migrated to `oak-` per the 2026-05-22 amendment.)
**Related**: [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md), [ADR-124 (Practice Propagation Model)](124-practice-propagation-model.md), [PDR-009 (Canonical-First Cross-Platform Architecture)](../../../.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md), [PDR-035 (Agent Work Capabilities Belong to the Practice)](../../../.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md), [PDR-051 (Vendor-Agnostic Skills Standardisation)](../../../.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md), [ADR-165 (Agent Work Practice Phenotype Boundary)](165-agent-work-practice-phenotype-boundary.md)

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

| Artefact             | Canonical location                                                                       | Purpose                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Skills               | `.agent/skills/*/SKILL-CANONICAL.md` and supporting `references/`, `scripts/`, `assets/` | Workflow capabilities, both user-invocable (slash) and model-invocable. Custom commands subsumed here per the 2026-05-09 amendment. |
| Directives           | `.agent/directives/*.md`                                                                 | Policies and principles                                                                                                             |
| Rules                | `.agent/rules/*.md`                                                                      | Always-applied operational reinforcements                                                                                           |
| Sub-agent templates  | `.agent/sub-agents/templates/*.md`                                                       | Reviewer prompts (ADR-114)                                                                                                          |
| Sub-agent personas   | `.agent/sub-agents/components/personas/*.md`                                             | Shared architecture reviewer identity and lens                                                                                      |
| Sub-agent components | `.agent/sub-agents/components/`                                                          | Reusable behaviours, principles, architecture notes                                                                                 |
| Plan templates       | `.agent/plans/` (organised by domain)                                                    | Implementation plans, execution tracking                                                                                            |

Live skill counts surface in the directory listing — counts in this ADR drift; the directory and `pnpm portability:check` are authoritative. The canonical skill body filename is `SKILL-CANONICAL.md` (non-discoverable); discovery filenames (`SKILL.md`) appear only in adapter directories.

### Layer 2: Platform Adapters (thin wrappers)

Each platform has thin wrappers that reference canonical content. Skill adapters are emitted by the `agent-tools:skills-adapter-generate` CLI; manual edits are forbidden by header comment in every emitted file. Owned skills carry a configurable prefix (default `oak-`) in adapter directories; ingested skills (recorded in `skills-lock.json`) keep their canonical name.

#### Cross-tool skill alias (`.agents/`)

| Location                                        | Format                                                                                                                                                                            | Read by                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `.agents/skills/*/SKILL.md`                     | Generated thin wrapper with spec-portable frontmatter (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) -> `.agent/skills/<id>/SKILL-CANONICAL.md` | Cursor, Codex, Gemini CLI, Amp |
| `.agents/skills/*/{references,scripts,assets}/` | Bytewise copies of canonical supporting files                                                                                                                                     | Same                           |
| `.agents/rules/*.md`                            | Thin wrapper -> `.agent/rules/`                                                                                                                                                   | Portable rule surface          |
| `.agents/agents/README.md`                      | Documents intentional absence of `.agents/` sub-agent wrappers                                                                                                                    | —                              |

#### Claude Code (`.claude/`)

| Location                                        | Format                                                                                                                                                                                                                                                                                                    | Read by            |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `.claude/skills/*/SKILL.md`                     | Generated thin wrapper with spec-portable frontmatter PLUS Claude top-level fields (`when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `context`, `agent`, `model`) derived from `metadata.claude-*` keys in canonical -> `.agent/skills/<id>/SKILL-CANONICAL.md` | Claude Code (only) |
| `.claude/skills/*/{references,scripts,assets}/` | Bytewise copies of canonical supporting files                                                                                                                                                                                                                                                             | Same               |
| `.claude/rules/*.md`                            | Thin wrappers -> `.agent/rules/`                                                                                                                                                                                                                                                                          | Claude Code        |
| `.claude/agents/*.md`                           | Markdown with YAML frontmatter (`name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `color`). All wrappers require: explicit `model` field, `color` field, and ≥2 `<example>` blocks in `description`.                                                                          | Claude Code        |
| `.claude/agents/archive/*.md`                   | Archived wrappers — superseded or retired agents. Preserved for reference. Not validated by `pnpm subagents:check`.                                                                                                                                                                                       | —                  |

#### Cursor (`.cursor/`) — sub-agents and rules only

| Location              | Format                                                        | Count |
| --------------------- | ------------------------------------------------------------- | ----- |
| `.cursor/rules/*.mdc` | Markdown with `alwaysApply`/`globs`/`description` frontmatter | live  |
| `.cursor/agents/*.md` | Markdown with `name`/`description`/`model`/`tools`/`readonly` | live  |

Cursor reads skills from `.agents/skills/` per its current docs. The
previously-emitted `.cursor/skills/` adapters are retired per the 2026-05-09
amendment; `.cursor/commands/` is retired in full per the 2026-05-10
amendment.

#### Gemini CLI (`.gemini/`) — settings only

Gemini CLI reads skills from `.agents/skills/` (documented as an alias
for `.gemini/skills/`, with precedence). General custom-command adapters
are retired per the 2026-05-10 amendment. `review-*.toml` files in
`.gemini/commands/` remain as transitional sub-agent invocation adapters
for a platform without native sub-agent spawning, not a user workflow
command surface.

#### Codex (`.codex/`)

| Location               | Format                                                         | Count |
| ---------------------- | -------------------------------------------------------------- | ----- |
| `.codex/agents/*.toml` | Codex project-agent adapters -> `.agent/sub-agents/templates/` | 22    |
| `.codex/hooks/*.mjs`   | Soft Codex hook adapters -> canonical Practice tooling         | —     |
| `.codex/config.toml`   | Tracked Codex project configuration                            | 1     |

Codex reads skills from `.agents/skills/` per its current docs (with parent-walk
to repo root); `.codex/skills/` is not used.

Codex skills are invoked with `$skill-name` syntax (e.g. `$oak-plan`,
`$oak-gates`) or selected through Codex's `/skills` built-in; repo-defined
workflows are not custom `/` commands. This follows the official
[Codex skills](https://developers.openai.com/codex/skills) and
[Codex CLI slash commands](https://developers.openai.com/codex/cli/slash-commands)
documentation. Codex reviewer sub-agents are configured through
`.codex/agents/*.toml`; `.agents/` remains the portable skill/rule
surface, not a sub-agent surface. Codex `agents.<name>.config_file` paths are
relative to `.codex/config.toml`, so the roster uses `agents/<name>.toml`.
Codex project hooks are Layer 2 adapters: they may surface session context or
invoke repo tooling, but the behavioural contract remains in `.agent/`
doctrine and canonical `agent-tools` commands.

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

### Owned-Skill Naming Convention

Owned skills (`metadata.owned: true` in canonical frontmatter) carry a
configurable prefix in adapter directories. The source default is
empty; the effective prefix `oak-` is passed explicitly via
`--prefix=oak-` in `package.json` scripts (`pnpm skills:check`).
Contributors who want a different prefix override at the call site.
Ingested skills (recorded in `skills-lock.json`) keep their canonical
name. The prefix is applied only at adapter emission; canonical
identity is unprefixed.

| Platform    | Invocation       | Source                                             |
| ----------- | ---------------- | -------------------------------------------------- |
| Claude Code | `/oak-plan`      | `.claude/skills/oak-plan/SKILL.md`                 |
| Cursor      | `/oak-plan`      | `.agents/skills/oak-plan/SKILL.md`                 |
| Codex       | `$oak-plan`      | `.agents/skills/oak-plan/SKILL.md`                 |
| Gemini CLI  | `activate_skill` | `.agents/skills/oak-plan/SKILL.md` (model-invoked) |
| Amp         | palette          | `.agents/skills/oak-plan/SKILL.md`                 |

### Sub-agent Adapter Formats

Each platform uses its native mechanism for sub-agent-equivalent functionality:

| Platform    | Mechanism                        | Key fields                                                                            |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| Cursor      | `.cursor/agents/*.md`            | `name`, `description`, `model`, `tools`, `readonly`                                   |
| Claude Code | `.claude/agents/*.md`            | `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `color` |
| Gemini CLI  | `.gemini/commands/review-*.toml` | Transitional sub-agent invocation adapter until native support exists                 |
| Codex       | `.codex/agents/*.toml`           | TOML roster and developer instructions loaded from canonical templates                |

Read-only reviewers on Claude Code use `permissionMode: plan` and `disallowedTools: Write, Edit` to enforce read-only behaviour at the platform level, not just via instructions.

### Rules: Policies vs Activation Triggers

Rules have two conceptually distinct layers:

1. **Authoritative policies** (`.agent/directives/principles.md`) — the canonical rules document defining what must be followed: TDD, no type shortcuts, fail fast, code quality standards, architectural model. This is substantive content. It is the single source of truth for the rules themselves.

2. **Activation triggers** (`.cursor/rules/*.mdc`, entry-point chains) — platform-specific mechanisms that determine _when_ and _how_ policies surface during a session. These are not thin wrappers for `principles.md` in the way command wrappers point at commands. They are a separate artefact type: a trigger mechanism that activates specific policies, directives, or skills at the right moment.

Some triggers activate policies from `principles.md` via a canonical rule (e.g., `apply-architectural-principles.mdc` → `.agent/rules/apply-architectural-principles.md` → `principles.md`). Others activate standalone directives (e.g., `invoke-code-experts.mdc` → `.agent/memory/executive/invoke-code-experts.md`). Others activate skills through generated adapters (e.g., `napkin-always-active.mdc` → `.agents/skills/oak-napkin/SKILL.md` backed by `.agent/skills/napkin/SKILL-CANONICAL.md`). The trigger is not the policy — it is the mechanism that surfaces the policy.

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

**Gemini CLI and Codex** receive policies via the entry-point chain:
`GEMINI.md` / `AGENTS.md` -> `.agent/directives/AGENT.md` ->
`.agent/directives/principles.md`. `.agents/rules/*.md` also provides
a portable thin-wrapper rule surface for platforms that scan `.agents/`
directly.

**Triggers that activate skills or directives:**

| Trigger                          | What it activates                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `apply-architectural-principles` | All architectural principles via `.agent/rules/apply-architectural-principles.md`                   |
| `napkin-always-active`           | `.agents/skills/oak-napkin/SKILL.md` -> `.agent/skills/napkin/SKILL-CANONICAL.md`                   |
| `use-start-right-skills`         | `.agents/skills/oak-start-right-quick/SKILL.md`, `.agents/skills/oak-start-right-thorough/SKILL.md` |
| `follow-the-practice`            | Practice reading, which leads to skills                                                             |
| `invoke-code-experts`            | All registered reviewers via `.agent/memory/executive/invoke-code-experts.md`                       |
| `lint-after-edit`                | Lint checking (file-scoped to `*.ts`)                                                               |

#### Trigger Content Contract

A trigger file (`.cursor/rules/*.mdc`) MUST:

- Include `alwaysApply`/`globs`/`description` frontmatter (activation metadata)
- Include a reference to its canonical source (`.agent/directives/*.md`, `.agent/skills/*/SKILL-CANONICAL.md`, an ADR, or `docs/`)

A trigger file MAY:

- Include a concise summary (max 5 lines) for immediate LLM context

A trigger file MUST NOT:

- Contain the full canonical policy — the canonical source is authoritative
- Exceed 10 content lines (excluding frontmatter) without review — if exceeded, consider whether the content belongs in the canonical source instead

### Skills Structure Contract (per PDR-051)

1. **One skill, one owner directory**: each skill is rooted at `.agent/skills/<skill-id>/`.
2. **Canonical filename**: the canonical body is named `SKILL-CANONICAL.md` — non-discoverable by every documented vendor scanner. Discovery filenames (`SKILL.md`) appear only in adapter directories.
3. **Stable naming**: paired modes use explicit IDs (`start-right-quick`, `start-right-thorough`).
4. **Supporting files**: optional `references/`, `scripts/`, `assets/` directories under canonical, copied bytewise into both adapter trees by the generator.
5. **Owned vs ingested**: every canonical skill is either owned (`metadata.owned: true`) or ingested (recorded in `skills-lock.json`). Validator refuses both-or-neither.
6. **Adapter surfaces**: exactly two — `.agents/skills/` (cross-tool alias, read by Cursor/Codex/Gemini/Amp) and `.claude/skills/` (Claude Code only). No other skill adapter surfaces are emitted.
7. **Generator-mandatory**: adapters are emitted by `agent-tools:skills-adapter-generate`. Manual edits forbidden by header comment in every emitted file; drift gate fails CI on divergence.
8. **No compatibility aliases**: canonical IDs are stable; only the configurable owned-skill prefix is applied at adapter emission.
9. **Classification**: every canonical `SKILL-CANONICAL.md` MUST include a `classification` field in its YAML frontmatter: `active` (invoked via slash) or `passive` (guidance consumed by workflows or linked from other artefacts).

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

- Skill and command permission allowlists (`Skill(oak-*)` entries)
- Safety hooks (`PreToolUse` matchers for Bash, Edit, Write)
- MCP tool allowlists (`mcp__*` entries)
- Domain fetch permissions (`WebFetch(domain:*)`)
- Plugin enable/disable state
- Standard development tool permissions (`git`, `gh`, `npx turbo`)

**Local settings contain:**

- Machine-local filesystem paths (`<home>/...`, `<tmp>/...`)
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

### Historical note: why `.agent/commands/` existed

`.agent/prompts/` already exists for reusable prompt playbooks (e.g.,
the semantic-search prompts). Commands were a distinct artefact type: they were
invoked by name, had platform-specific syntax, and mapped to slash commands.
Keeping them separate avoided overloading the
prompts directory.

### Why consistent `oak-*` naming across platforms

Different names for the same workflow (`oak-full-review` vs `/review` vs
`oak-review`, historically) created cognitive load when switching between
platforms. A single name per workflow reduces confusion and makes the system
easier to document and discover.

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
- Reviewer personas are DRY: defined once in canonical components,
  referenced by platform adapters and project-agent configuration.

### Trade-offs

- Four directories per artefact type (canonical + four platform adapters) creates more files, though each adapter is small.
- Platform-specific capabilities (Cursor `globs`, Claude `permissionMode`, Gemini `{{args}}`) require wrapper maintenance.
- `.agents/skills/` and `.agents/rules/` are portable adapter layers, while canonical content remains in `.agent/`. Thin wrappers bridge those surfaces consistently with the pattern used for all other platforms.
- Cursor is the only platform with granular rule activation (globs, agent-selected). Other platforms receive all rules at session start, which increases context consumption but ensures nothing is missed.
- Gemini CLI lacks native sub-agent spawning; review commands serve as the user-invoked equivalent but lack automatic delegation.

## Known Limitations

### Agent comprehension of thin wrappers

Agents may not follow "Read and follow X" instructions in thin wrappers, skipping the canonical content entirely. Mitigations vary by platform:

- **Cursor**: `@` file injection forces content loading — the most reliable mechanism.
- **Claude Code / Gemini CLI / Codex**: canonical content should include guards ("If you have not read X, stop and read it now"). Minimal fallback context (up to 5 lines) in wrappers helps when the agent skips the read.

### Externally installed skills

External tools may install full skill content into platform adapter
directories, especially `.agents/skills/`. In this repository that content
is canonicalised immediately into `.agent/skills/<name>/`, recorded in
`skills-lock.json`, and replaced in every platform directory with a thin
wrapper. Validation treats full content in adapter directories as drift, not
as an exclusion.

After canonicalisation, retaining the vendor-installed source plugin is a
separate operational decision. The default is to remove or disable any plugin
whose only remaining purpose is to duplicate the now-canonical skill content.
Keep the plugin only when it still supplies a distinct runtime capability,
update mechanism, or source-of-truth refresh path; record that reason beside
the artefact inventory or lock entry. Canonical content in `.agent/` remains
the source agents read during repository work.

## Amendments

### 2026-04-17 — Thin-wrapper scope clarification

The "thin wrapper" contract established in §Layer 2 applies to **platform
adapters wrapping canonical content**. This 2026-04-17 clarification is now
historical for command-to-skill relationships: commands (`.agent/commands/`)
are a retirement target per the 2026-05-09 amendment, and skills
(`.agent/skills/`) are the durable user-and-model-invokable capability
surface once migration completes. A platform adapter that activates skills or invokes logic of its own
is not a thin wrapper and does not satisfy this ADR's portability contract.

This clarification graduated from `.agent/memory/active/distilled.md` (2026-04-16
observation) as part of the enforce-edge tightening pass alongside
ADR-144's three-zone model revision.

### 2026-04-24 — Vendor skill canonicalisation and `.agents/rules`

Portability remediation canonicalised externally installed Clerk and MCP
Apps skills into `.agent/skills/`, replaced platform copies with thin
wrappers, and made `.agents/rules/` a first-class thin-wrapper rule
surface. `pnpm portability:check` now validates forward coverage,
reverse adapter links, wrapper form, `skills-lock.json`, symlink-free
skill adapters, and Claude tracked permission parity.

### 2026-05-26 — Post-canonicalisation plugin retention

Cross-platform memory import clarified the post-canonicalisation policy: a
vendor source plugin is not kept merely because it was the origin of a skill.
Once content is canonical, retention needs a current capability or refresh
reason; otherwise the plugin becomes a duplicate activation and load-budget
surface.

### 2026-04-28 — Agent-work capability ownership boundary

PDR-035 clarifies that agent collaboration, coordination, work management,
direction, lifecycle, identity, claims, handoff, review routing, and adjacent
agent-work behaviours are Practice substance by default. This ADR's layer model
therefore describes how this repo hosts and activates those artefacts; it does
not make local platform adapters, state files, or tooling the source of
portable agent-work doctrine. ADR-165 records this repository's phenotype
boundary for those local surfaces.

### 2026-04-28 — Codex session hook adapters

Codex `SessionStart` hooks are accepted as project adapters in Layer 2. The
tracked `.codex/config.toml` enables the project hook surface and
`.codex/hooks/practice-session-identity.mjs` acts as a soft adapter over the
canonical identity contract: it derives no new doctrine, and it may fail open
with no context when hook input or built artefacts are unavailable. Correctness
continues to live in the PDR-027 identity block and the canonical
`pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5`
interface.

### 2026-05-22 — Owned-skill prefix migrated from `jc-` to `oak-`

The owned-skill adapter prefix is migrated from the owner-personal `jc-`
namespace to the repo-neutral `oak-` namespace. The change has two
parts:

1. **Source default**: `agent-tools/src/bin/skills-adapter-generate.ts`
   no longer bakes in a default value. The prefix is sourced from
   `--prefix=oak-` passed explicitly in `package.json` scripts
   (`pnpm skills:check`). If neither the script nor the user passes
   `--prefix`, the effective prefix is empty.
2. **Committed adapter rename**: the 18 `.claude/skills/jc-*/` dirs and
   18 `.agents/skills/jc-*/` dirs are replaced with 36 `oak-*` dirs by
   running `skills-adapter-generate --clear --prefix=oak-`.

`Skill(jc-*)` permission entries in `.claude/settings.json` are
updated to `Skill(oak-*)` to match the new adapter names.

Rationale: the owner-personal `jc-` namespace bled into a repo asset
visible to every contributor. The `oak-` namespace matches the
workspace prefix (`@oaknational/...`) and the organisation identity.
Per `.agent/rules/replace-dont-bridge.md` the migration is a hard
cut-over; no transition shim or compatibility alias exists. Discovery
of new adapter names is via `ls .claude/skills/`.

### 2026-05-09 — Vendor-agnostic two-surface skills contract (PDR-051)

Skills moved to a non-discoverable canonical filename
(`SKILL-CANONICAL.md`) with bytewise-generated adapters at exactly two
surfaces: `.agents/skills/` (cross-tool alias, read by Cursor, Codex,
Gemini CLI, Amp) and `.claude/skills/` (Claude Code only). Adapter
trees at `.cursor/skills/`, `.gemini/skills/`, `.codex/skills/`, and
`.windsurf/skills/` are retired — those platforms read the cross-tool
alias and the per-vendor surfaces produced duplicate registrations and
drift. Custom command surfaces (`.agent/commands/`, `.cursor/commands/`,
`.claude/commands/`, `.gemini/commands/`) are targeted for retirement;
until the directories are removed, their contents are transitional and must not
be treated as the canonical workflow surface. Canonical command behaviour is
being subsumed into skills as the unified user-and-model-invokable workflow
surface. Adapters are emitted by
`pnpm agent-tools:skills-adapter-generate`; manual edits forbidden by
header comment in every emitted file; `pnpm portability:check` now
includes a drift gate and the new contract checks. Owned skills carry
`metadata.owned: true` in canonical frontmatter and a configurable
`jc-` prefix in adapters; ingested skills recorded in
`skills-lock.json` keep canonical names. (Historical: the prefix
was later migrated to `oak-` per the 2026-05-22 amendment.) The portable doctrine is
[PDR-051](../../../.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md);
this ADR records the host adoption.

### 2026-05-10 — Custom command surfaces retired

The retirement targeted by the 2026-05-09 amendment is now complete.
`.agent/commands/`, `.cursor/commands/jc-*.md`, and
`.gemini/commands/jc-*.toml` have been deleted; substantive command
content was inlined into the corresponding
`.agent/skills/<name>/SKILL-CANONICAL.md`. `.gemini/commands/review-*.toml`
files remain as transitional sub-agent invocation adapters per the
earlier 2026-05-10 amendment. `validate-portability.ts` and
`agent-tools/src/core/health-probe-{shared,parity}.ts` no longer
enumerate canonical commands or platform command adapters; skill-adapter
validation is delegated entirely to `pnpm skills:check`. Skills are now
the sole user-and-model-invokable workflow surface across all
platforms.

## References

- `.agent/skills/` — canonical skills (`SKILL-CANONICAL.md` per skill, plus supporting files)
- `.agent/rules/` and `.agent/directives/` — canonical rules and directives
- `.agent/sub-agents/` — canonical sub-agent prompts (ADR-114), personas, and components
- `.agents/skills/`, `.claude/skills/` — generated skill adapter surfaces (only two)
- `.cursor/`, `.claude/`, `.gemini/`, `.codex/` — platform adapters for sub-agents/rules/settings (no skills, no commands)
- [PDR-051](../../../.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md) — portable skills standardisation doctrine
- [ADR-135](135-agent-classification-taxonomy.md) — agent classification taxonomy referenced in the 2026-04-17 amendment
- [ADR-165](165-agent-work-practice-phenotype-boundary.md) — local phenotype boundary for PDR-035 agent-work capabilities
