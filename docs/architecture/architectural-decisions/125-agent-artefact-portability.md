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
**Amended**: 2026-06-28 — `model` is now **optional** in sub-agent wrappers (the inherit policy: omit `model` so the invoking agent's model is used); Claude wrappers no longer require an explicit `model`, and the non-functional Cursor `tools` frontmatter field is dropped. The per-platform subagent frontmatter schema (`agent-tools/src/validators/subagents/frontmatter-schema.ts`) is the enforced SSOT for the allowed field-set and value enums. Owner-directed.
**Amended**: 2026-07-13 — added the root `skills.md` entry point (Layer 3) for [Linear coding sessions](https://linear.app/docs/coding-sessions). A delegated Linear session runs Claude Code or Codex (inheriting those entry-point chains) and can use a repo-root `skills.md` as supplementary guidance, so the file carries the same thin-pointer shape as `AGENTS.md` (AGENT.md pointer plus rules-index line). Owner-directed.
**Amended**: 2026-07-24 — ratified a **local GitHub Copilot CLI**
adapter family as a target under the same canonical Practice. The target uses
Copilot CLI's documented repository instruction, custom-agent, hook, settings,
skill-discovery, and MCP surfaces without creating another canonical content
home. This amendment is architectural authority, not a wired-state claim; the
cross-platform surface matrix remains the live target-versus-wired record.
Owner-directed through the first-class Copilot CLI plan estate.
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

| Artefact             | Canonical location                                                                                                                                                                                                                                                                                                              | Purpose                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Skills               | `.agent/skills/` canonicals in the three ratified shapes — `<skill-id>/`, `<concern>/<skill-id>/`, and `<concern>/<domain>/<skill-id>/` (owner-ruled 2026-08-10; `skill-tree-walk.ts` is the topology SSOT; adapter surfaces stay flat) — each holding `SKILL-CANONICAL.md` and supporting `references/`, `scripts/`, `assets/` | Workflow capabilities, both user-invocable (slash) and model-invocable. Custom commands subsumed here per the 2026-05-09 amendment. |
| Directives           | `.agent/directives/*.md`                                                                                                                                                                                                                                                                                                        | Policies and principles                                                                                                             |
| Rules                | `.agent/rules/*.md`                                                                                                                                                                                                                                                                                                             | Always-applied operational reinforcements                                                                                           |
| Sub-agent templates  | `.agent/sub-agents/templates/*.md`                                                                                                                                                                                                                                                                                              | Reviewer prompts (ADR-114)                                                                                                          |
| Sub-agent personas   | `.agent/sub-agents/components/personas/*.md`                                                                                                                                                                                                                                                                                    | Shared architecture reviewer identity and lens                                                                                      |
| Sub-agent components | `.agent/sub-agents/components/`                                                                                                                                                                                                                                                                                                 | Reusable behaviours, principles, architecture notes                                                                                 |
| Plan templates       | `.agent/plans/` (organised by domain)                                                                                                                                                                                                                                                                                           | Implementation plans, execution tracking                                                                                            |

Live skill counts surface in the directory listing — counts in this ADR drift; the directory and `pnpm portability:check` are authoritative. The canonical skill body filename is `SKILL-CANONICAL.md` (non-discoverable); discovery filenames (`SKILL.md`) appear only in adapter directories.

### Layer 2: Platform Adapters (thin wrappers)

Each platform has thin wrappers that reference canonical content. Skill adapters are emitted by the `agent-tools:skills-adapter-generate` CLI; manual edits are forbidden by header comment in every emitted file. Owned skills carry a REQUIRED prefix (`oak-` in this estate, pinned by the root `pnpm skills:generate` / `pnpm skills:check` scripts; the CLI refuses an unprefixed run) in adapter directories. Vendor-class skills are not adapters and are not generated: they are installed and managed by the external skills machinery, are never canonicalised, and are outside our validation's jurisdiction (see §Skill classes and validation jurisdiction).

#### Cross-tool skill alias (`.agents/`)

| Location                                        | Format                                                                                                                                                                                                                                                           | Read by                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `.agents/skills/*/SKILL.md`                     | Generated thin wrapper with spec-portable frontmatter (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) -> the skill's canonical body under `.agent/skills/` (any of the three ratified depths: flat, concern, or concern/domain) | Cursor, Copilot CLI, Codex, Gemini CLI, Amp |
| `.agents/skills/*/{references,scripts,assets}/` | Bytewise copies of canonical supporting files                                                                                                                                                                                                                    | Same                                        |
| `.agents/rules/*.md`                            | Thin wrapper -> `.agent/rules/`                                                                                                                                                                                                                                  | Portable rule surface                       |
| `.agents/agents/README.md`                      | Documents intentional absence of `.agents/` sub-agent wrappers                                                                                                                                                                                                   | —                                           |

#### Claude Code (`.claude/`)

| Location                                        | Format                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Read by            |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `.claude/skills/*/SKILL.md`                     | Generated thin wrapper with spec-portable frontmatter PLUS Claude top-level fields (`when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `context`, `agent`, `model`) derived from `metadata.claude-*` keys in canonical -> the skill's canonical body under `.agent/skills/` (any of the three ratified depths: flat, concern, or concern/domain)                                                                             | Claude Code (only) |
| `.claude/skills/*/{references,scripts,assets}/` | Bytewise copies of canonical supporting files                                                                                                                                                                                                                                                                                                                                                                                                                        | Same               |
| `.claude/rules/*.md`                            | Thin wrappers -> `.agent/rules/`                                                                                                                                                                                                                                                                                                                                                                                                                                     | Claude Code        |
| `.claude/agents/*.md`                           | Markdown with YAML frontmatter (`name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `color`). All wrappers require a `color` field and ≥2 `<example>` blocks in `description`; **`model` is optional** — omitted by default so the invoking agent's model is inherited (owner-directed inherit policy, 2026-06-28; the per-platform subagent frontmatter schema `agent-tools/src/validators/subagents/frontmatter-schema.ts` is the SSOT). | Claude Code        |
| `.claude/agents/archive/*.md`                   | Archived wrappers — superseded or retired agents. Preserved for reference. Not validated by `pnpm subagents:check`.                                                                                                                                                                                                                                                                                                                                                  | —                  |

#### Cursor (`.cursor/`) — sub-agents and rules only

| Location              | Format                                                                                                                                                                                                               | Count |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `.cursor/rules/*.mdc` | Markdown with `alwaysApply`/`globs`/`description` frontmatter                                                                                                                                                        | live  |
| `.cursor/agents/*.md` | Markdown with `name`/`description`/`model` (optional, inherit)/`readonly`; the `tools` frontmatter field is non-functional and dropped (Cursor sub-agent tools are not frontmatter-configurable per the schema SSOT) | live  |

Cursor reads skills from `.agents/skills/` per its current docs. The
previously-emitted `.cursor/skills/` adapters are retired per the 2026-05-09
amendment; `.cursor/commands/` is retired in full per the 2026-05-10
amendment.

#### Gemini / Antigravity CLI (`.gemini/` and `.agents/`)

Gemini / Antigravity CLI reads repo skills from `.agents/skills/`.
General custom-command adapters are retired per the 2026-05-10 amendment.
`review-*.toml` files in `.gemini/commands/` remain as transitional
reviewer invocation adapters that point at canonical templates, not a
user workflow command surface.

Antigravity CLI now documents native plugin bundles that may contain
skills, agents, rules, MCP definitions, and hooks. That upstream capability
does not imply every surface is wired in this repo: `.agents/rules/` is
documented here as a portable wrapper layer, while Antigravity rule
activation currently comes through the entrypoint chain; native agents,
`.agents/hooks.json`, and `.agents/mcp_config.json` remain unwired until a
fresh verification and adapter design lands.

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

#### GitHub Copilot CLI (`.github/`) — ratified target

The GitHub adapter family primarily serves **Copilot CLI running locally**.
Cloud-execution-specific delivery is not part of this decision, but shared
repository projections preserve parity across local and cloud Copilot wherever
both consume the same surface.

| Surface                  | Ratified repository projection                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Repo-wide instructions   | `.github/copilot-instructions.md` imports `AGENT.md`, giving local and cloud Copilot the full canonical rule set            |
| Path-scoped instructions | Generated `.github/instructions/**/*.instructions.md` activation projections                                                |
| Skills                   | Existing `.agents/skills/`; no duplicate `.github/skills/` tree                                                             |
| Custom agents            | Generated, cloud-safe `.github/agents/*.agent.md` wrappers over canonical specialists                                       |
| Hooks                    | Inherited `.claude/settings.json` activation for policy; native hooks only for separately proven non-policy lifecycle needs |
| Settings                 | `.github/copilot/settings.json` only where a tracked project setting is required                                            |
| MCP                      | A tracked, secret-free projection from a canonical server manifest established by delivery                                  |

Copilot CLI's
[documented skill discovery precedence](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#skills-reference),
verified 2026-07-25, is `.github/skills`, `.agents/skills`, then
`.claude/skills`, with first-found wins. The repository deliberately keeps
`.agents/skills` as its chosen Copilot skill home, so adding the GitHub adapter
family does not change the two-surface skills contract.

The inherited PascalCase `PreToolUse` activation in
`.claude/settings.json` is the sole Copilot policy activation. It feeds one
closed Claude/Copilot dispatcher and one platform-free policy evaluation;
native `.github/hooks` policy activation is excluded because repository hooks
also run in Copilot cloud-agent jobs. Native GitHub hooks remain candidates
only for separately probed, non-policy local lifecycle needs whose cloud
disposition is explicit. Whether each target surface is wired and
acceptance-proven is recorded in the cross-platform surface matrix, never
inferred from this ADR.

GitHub repository-wide and path-scoped instructions are also shared with
Copilot cloud surfaces. The instruction disposition manifest therefore marks
every emitted file `cloud-shared` or `cloud-excluded` — labels for the intended
disposition and the marker it emits, never for a proven platform outcome — and
a `cloud-excluded` modular instruction emits the documented
`excludeAgent: "cloud-agent"` frontmatter.

`excludeAgent` takes exactly one value: `"cloud-agent"` excludes the Copilot
cloud agent and `"code-review"` excludes Copilot code review. GitHub's
repository custom-instructions documentation, verified 2026-07-25, documents no
array, comma-separated, or repeated-key form, so whichever value is chosen the
other surface remains in scope — a file carrying `excludeAgent: "cloud-agent"`
is still read by Copilot code review. That residual exposure is a dated fact
about the platform, not a defect in the generator. The marker governs only the
supplemental modular copy: canonical rules and behaviour still reach local and
cloud Copilot through the root `AGENT.md` import. No canonical rule is
cloud-excluded under the parity contract. Content that genuinely must not reach
a Copilot surface cannot enter the canonical root rule corpus and requires a
separately designed mechanism. This capability claim is pinned to the
2026-07-25 documentation and expires: a later reader re-checks GitHub's current
documentation rather than trusting this paragraph.

Repository custom agents are visible to both local Copilot CLI and Copilot
cloud surfaces. Generated wrappers therefore carry an explicit cloud-safe
disposition: no secrets, machine-local paths, or local-only MCP assumptions;
`disable-model-invocation: true` is emitted unless automatic cloud selection
is separately accepted. The local CLI acceptance proof remains the delivery
target, but “cloud is out of scope” must never be used to ignore a shared
surface's cloud behaviour.

### Layer 3: Entry Points

Entry-point files direct each platform to the canonical practice:

| File                              | Platform               |
| --------------------------------- | ---------------------- |
| `CLAUDE.md`                       | Claude Code            |
| `AGENTS.md`                       | Codex                  |
| `GEMINI.md`                       | Gemini CLI             |
| `.github/copilot-instructions.md` | GitHub Copilot CLI     |
| `skills.md`                       | Linear coding sessions |

All entry points redirect to `.agent/directives/AGENT.md`. For Copilot, that
full-rule parity is intentional for both local CLI and cloud agent; modular
path-scoped instructions supplement context but never decide which canonical
rules apply. This is one instance of the wider portability objective: preserve
parity of behaviour and abilities across vendors wherever their platforms
provide equivalent mechanisms, and document only evidenced platform limits as
divergences.

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
Vendor-class skills sit outside the prefix scheme entirely — they keep
their upstream names, have no canonical, and the prefix is never a
class boundary (membership is recognised by the class marker, see
§Skill classes and validation jurisdiction). The prefix is applied only at
adapter emission; canonical identity is unprefixed.

| Platform                 | Invocation                   | Source                             |
| ------------------------ | ---------------------------- | ---------------------------------- |
| Claude Code              | `/oak-plan`                  | `.claude/skills/oak-plan/SKILL.md` |
| Cursor                   | `/oak-plan`                  | `.agents/skills/oak-plan/SKILL.md` |
| Codex                    | `$oak-plan`                  | `.agents/skills/oak-plan/SKILL.md` |
| Gemini / Antigravity CLI | `activate_skill` / `/skills` | `.agents/skills/oak-plan/SKILL.md` |
| GitHub Copilot CLI       | skill discovery/invocation   | `.agents/skills/oak-plan/SKILL.md` |
| Amp                      | palette                      | `.agents/skills/oak-plan/SKILL.md` |

### Sub-agent Adapter Formats

Each platform uses its native mechanism for sub-agent-equivalent functionality:

| Platform                 | Mechanism                                                  | Key fields                                                                                                           |
| ------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Cursor                   | `.cursor/agents/*.md`                                      | `name`, `description`, `model`, `tools`, `readonly`                                                                  |
| Claude Code              | `.claude/agents/*.md`                                      | `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `color`                                |
| Gemini / Antigravity CLI | `.gemini/commands/review-*.toml`; native `/agents` unwired | Transitional reviewer invocation adapter plus native platform capability                                             |
| Codex                    | `.codex/agents/*.toml`                                     | TOML roster and developer instructions loaded from canonical templates                                               |
| GitHub Copilot CLI       | `.github/agents/*.agent.md` (ratified target)              | Generated cloud-safe metadata, tool aliases, MCP selection, inherited model, and explicit auto-selection disposition |

Read-only reviewers on Claude Code use `permissionMode: plan` and `disallowedTools: Write, Edit` to enforce read-only behaviour at the platform level, not just via instructions.

### Rules: Policies vs Activation Triggers

Rules have two conceptually distinct layers:

1. **Authoritative policies** (`.agent/directives/principles.md`) — the canonical rules document defining what must be followed: TDD, no type shortcuts, fail fast, code quality standards, architectural model. This is substantive content. It is the single source of truth for the rules themselves.

2. **Activation triggers** (`.cursor/rules/*.mdc`, entry-point chains) — platform-specific mechanisms that determine _when_ and _how_ policies surface during a session. These are not thin wrappers for `principles.md` in the way command wrappers point at commands. They are a separate artefact type: a trigger mechanism that activates specific policies, directives, or skills at the right moment.

Some triggers activate policies from `principles.md` via a canonical rule (e.g., `apply-architectural-principles.mdc` → `.agent/rules/apply-architectural-principles.md` → `principles.md`). Others activate standalone directives (e.g., `invoke-code-experts.mdc` → `.agent/memory/executive/invoke-code-experts.md`). Others activate skills at their canonical bodies directly (e.g., `napkin-always-active.mdc` → `.agent/skills/knowledge/napkin/SKILL-CANONICAL.md`) — the portability validator requires trigger targets under `.agent/rules/` or `.agent/skills/`; generated adapter files are projections for platform discovery, never trigger targets (trued 2026-08-11 — the prior adapter-target example here contradicted the enforced contract). The trigger is not the policy — it is the mechanism that surfaces the policy.

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
   metadata (e.g., `use-result-pattern.mdc` with
   `globs: '**/*.{ts,tsx,mts}'`) that cannot be expressed by the
   consolidated trigger.

The three-layer model is preserved: trigger → canonical rule →
authoritative source. The consolidation reduces the number of
canonical rules and triggers, not the number of layers.

**Cursor** has granular activation via `.cursor/rules/*.mdc` frontmatter:

| Activation     | Mechanism                    | Example                                                    |
| -------------- | ---------------------------- | ---------------------------------------------------------- |
| Always-on      | `alwaysApply: true`          | `apply-architectural-principles.mdc` (consolidated)        |
| File-scoped    | `globs: "**/*.test.ts"`      | `no-conditional-tests.mdc`, `no-global-state-in-tests.mdc` |
| File-scoped    | `globs: '**/*.{ts,tsx,mts}'` | `use-result-pattern.mdc`, `generator-first-mindset.mdc`    |
| Agent-selected | `description: "..."`         | Agent decides based on relevance                           |

**Claude Code** has two activation mechanisms: always-on policies via the entry-point chain (`CLAUDE.md` → `AGENT.md` → `principles.md`), and path-scoped rules via `.claude/rules/*.md` with `paths` frontmatter. Path-scoped rules only load when Claude opens matching files, reducing context consumption for domain-specific policies (e.g., test rules only when editing test files). Only glob-scoped triggers have Claude rule equivalents — always-on triggers are already covered by the entry-point chain.

**Gemini CLI and Codex** receive policies via the entry-point chain:
`GEMINI.md` / `AGENTS.md` -> `.agent/directives/AGENT.md` ->
`.agent/directives/principles.md`. **Copilot CLI's ratified target** reaches
the same full canonical chain through `.github/copilot-instructions.md`, with
supplemental file-scoped context under `.github/instructions/`. The modular
disposition manifest governs whether an additional path-scoped copy is useful,
not whether the canonical rule applies. `.agents/rules/*.md` also provides a
portable thin-wrapper rule surface for platforms that scan `.agents/` directly.

**Triggers that activate skills or directives:**

| Trigger                          | What it activates                                                                                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apply-architectural-principles` | All architectural principles via `.agent/rules/apply-architectural-principles.md`                                                                                       |
| `napkin-always-active`           | `.agent/skills/knowledge/napkin/SKILL-CANONICAL.md` directly (canonical-direct per the trigger contract)                                                                |
| `use-start-right-skills`         | The three start-right canonicals directly (`.agent/skills/start-right-quick/`, `-thorough/`, `-team/` `SKILL-CANONICAL.md`) — canonical-direct per the trigger contract |
| `follow-the-practice`            | Practice reading, which leads to skills                                                                                                                                 |
| `invoke-code-experts`            | All registered reviewers via `.agent/memory/executive/invoke-code-experts.md`                                                                                           |
| `lint-after-edit`                | Lint checking (file-scoped to `*.ts`)                                                                                                                                   |

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

1. **One skill, one owner directory**: each skill is rooted at one of the three ratified depths — `.agent/skills/<skill-id>/`, `.agent/skills/<concern>/<skill-id>/`, or `.agent/skills/<concern>/<domain>/<skill-id>/` (owner-ruled 2026-08-10; the tree closes at three tiers; `skill-tree-walk.ts` is the topology SSOT; adapter surfaces stay flat).
2. **Canonical filename**: the canonical body is named `SKILL-CANONICAL.md` — non-discoverable by every documented vendor scanner. Discovery filenames (`SKILL.md`) appear only in adapter directories.
3. **Stable naming**: paired modes use explicit IDs (`start-right-quick`, `start-right-thorough`).
4. **Supporting files**: optional `references/`, `scripts/`, `assets/` directories under canonical, copied bytewise into both adapter trees by the generator.
5. **Practice vs Vendor**: every canonical skill under `.agent/skills/` is Oak-authored and Practice-governed. Third-party skills never become canonicals — they are Vendor-class, managed by the external skills machinery, and invisible to our projection tooling and permission census (see §Skill classes and validation jurisdiction).
6. **Adapter surfaces**: exactly two — `.agents/skills/` (cross-tool alias, read by Cursor/Copilot CLI/Codex/Gemini/Amp) and `.claude/skills/` (Claude Code only). No other skill adapter surfaces are emitted.
7. **Generator-mandatory**: adapters are emitted by `pnpm skills:generate`. Manual edits forbidden by header comment in every emitted file; drift gate fails CI on divergence.
8. **No compatibility aliases**: canonical IDs are stable; only the configurable owned-skill prefix is applied at adapter emission.
9. **Classification**: every canonical `SKILL-CANONICAL.md` MUST include a `classification` field in its YAML frontmatter: `active` (invoked via slash) or `passive` (guidance consumed by workflows or linked from other artefacts).
10. **Body portability**: a canonical skill body is either **portable** or **repo-bound**. A portable body carries its own content and contains no host specifics — neither repo names nor host _concepts_ ("Practice", "claims", "threads") — and travels between repos by transplantation or seeding (PDR-005), since skills are not Core-plasmid content. A repo-bound body reads the host corpus at runtime and is hydrated canonical content (ADR-165). Both use the identical placement and adapter surfaces above; portability is a body-content discipline the structural drift and wrapper gates cannot detect, so its guard is the PDR-108 three-context test plus a host-concept screen at authoring and review. The portable teaching-surface pattern is [PDR-112](../../../.agent/practice-core/decision-records/PDR-112-teaching-surface-family-across-a-portability-seam.md).

### Plan Template Contract

### Platform Configuration: Project vs Local Settings

Platform configuration files follow the same tracked/untracked split as
code. **Project settings** define the agentic system contract and must
work on fresh checkout. **Local settings** contain user-specific paths
and overrides.

| Platform                  | Project config (tracked)        | Local config                          |
| ------------------------- | ------------------------------- | ------------------------------------- |
| Claude Code               | `.claude/settings.json`         | `.claude/settings.local.json`         |
| GitHub Copilot CLI target | `.github/copilot/settings.json` | `.github/copilot/settings.local.json` |
| Cursor                    | `.cursor/settings.json`         | `.cursor/settings.local.json`         |
| Gemini CLI                | `.gemini/settings.json`         | `.gemini/settings.local.json`         |
| Codex                     | `.codex/config.toml`            | (no local equivalent documented)      |

**Depending on the platform, project settings may contain:**

- Skill and command permission allowlists (`Skill(oak-*)` entries)
- Safety hooks (`PreToolUse` matchers for Bash, Edit, Write)
- MCP tool allowlists (`mcp__*` entries)
- Domain fetch permissions (`WebFetch(domain:*)`)
- Plugin enable/disable state
- Standard development tool permissions (`git`, `gh`, `npx turbo`)

These examples are not portable setting semantics. In particular,
Claude-specific `Skill(...)` allowlists, permission merging, and hook shapes
must not be projected into Copilot settings. Each adapter uses only fields
documented and tested for its host; Copilot ignores unsupported setting keys.

**Local settings contain:**

- Machine-local filesystem paths (`<home>/...`, `<tmp>/...`)
- One-off command permissions accumulated during sessions
- User-specific MCP server selection
- Output style preferences

For Claude Code, arrays such as permissions and hooks **concatenate and
deduplicate** across scopes. No other platform inherits that merge contract
from this ADR.

**Why this matters:** tracked project settings are part of agentic
infrastructure when a host requires them for repository-wide activation. For
Claude Code, tracked permission allowlists can determine whether an adapter is
invokable. Copilot CLI discovers skills without a repository `Skill(...)`
allowlist; its settings may disable discovered skills but do not inherit
Claude's permission model. Saved tool approvals remain user-local rather than a
repository-shared policy surface.

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

Cursor, Claude Code, Gemini CLI, and Codex are active, and local Copilot CLI is
the ratified next adapter family. Maintaining independent copies of each skill,
rule, and specialist definition is unsustainable. The
canonical-plus-adapter model scales linearly: one canonical source plus the
thin projections each host actually supports.

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

- User-and-model workflows are authored once as skills and projected through
  the two-surface skill contract.
- Specialist definitions remain canonical while supported hosts receive their
  native adapter shapes.
- Skills remain discoverable through canonical entry points and generated
  adapters.
- Rule content canonical in `.agent/directives/`, activation policy platform-specific.
- Adding the Copilot CLI family requires thin projections, not content
  duplication.
- Vendor projections preserve shared agent behaviour and abilities rather than
  narrowing them for convenience.
- Reviewer personas are DRY: defined once in canonical components,
  referenced by platform adapters and project-agent configuration.

### Trade-offs

- Each supported host adds adapter files, though each projection remains thin
  or generated.
- Platform-specific capabilities (Cursor `globs`, Claude `permissionMode`, Gemini `{{args}}`) require wrapper maintenance.
- `.agents/skills/` and `.agents/rules/` are portable adapter layers, while canonical content remains in `.agent/`. Thin wrappers bridge those surfaces consistently with the pattern used for all other platforms.
- Cursor and the ratified Copilot CLI target have host-specific path-scoped
  instruction mechanisms with different contracts; other entry-point chains
  remain broad.
- Gemini CLI lacks native sub-agent spawning; review commands serve as the user-invoked equivalent but lack automatic delegation.

## Known Limitations

### Agent comprehension of thin wrappers

Agents may not follow "Read and follow X" instructions in thin wrappers, skipping the canonical content entirely. Mitigations vary by platform:

- **Cursor**: `@` file injection forces content loading — the most reliable mechanism.
- **Claude Code / Gemini CLI / Codex**: canonical content should
  include guards ("If you have not read X, stop and read it now"). Minimal
  fallback context in wrappers helps when the agent skips the read.

**Copilot CLI** has a stronger root-instruction mechanism:
`.github/copilot-instructions.md` supports recursive repository-contained
`@relative/path` imports. The target imports `AGENT.md` so local and cloud
Copilot load the same canonical rules as every other agent. Modular
`.github/instructions/**/*.instructions.md` files do not expand `@` imports,
so generated modular projections contain their bounded supplemental context
and remain governed by disposition and stale-output validation.

### Skill classes and validation jurisdiction

The estate holds three classes of skills (owner taxonomy, 2026-08-12).
Class membership derives from each class's own definition — location and
recorded derivation — never from name matching, because names (the
generation prefix) are configurable parameters, not class boundaries:

- **Practice skills** — Oak-authored, Practice-governed skills about
  working with this repository and the Practice. Canonical source:
  `.agent/skills/`. The adapter generator projects each canonical to
  `.claude/skills/<prefix><id>` and `.agents/skills/<prefix><id>`; every
  generated stub records its derivation in its body (the class marker,
  `agent-tools/src/skills-adapter-generate/adapter-stub.ts`), and that
  recorded derivation is how our tooling recognises its own projections.
  Our validation governs this class fully: projection reconciliation,
  drift checking, frontmatter validation, and the Claude permission
  census.
- **Vendor skills** — external skills installed and managed by the
  external skills machinery (`pnpx skills`), in whatever layout it
  chooses; its default writes a canonical copy under
  `.agents/skills/<id>` with a `.claude/skills/<id>` symlink, and
  project-scope installs are committed with the repository. Our
  validation has no jurisdiction here: entries not recognisable as
  Practice projections are never adjudicated, deleted, or censused
  (testing-strategy.md — never test external functionality that is not
  under our control). Provenance, updates, and drift are the external
  machinery's business; building our own oversight of them would
  recreate the jurisdiction error this section retires. Third-party
  skills are never canonicalised into `.agent/skills/` — the canonical
  corpus holds Oak-authored, Practice-governed content only.
- **User-facing skills** — skills Oak creates, in this or another Oak
  repository, surfaced to external users via MCP, plugins, or the
  external skills ecosystem. Current sub-classes: curriculum skills
  (for teachers) and engineering skills (for ed-tech engineers building
  on the curriculum SDK). Home today: `plugins/oak-open-curriculum/`.
  These are product deliverables assured under validation-strategy's
  tiers (teacher-facing content sits at the Critical/Standard tier);
  they are not repo-projection machinery and the adapter pipeline never
  touches them.

Three operational bounds keep the jurisdiction honest: (1)
name-addressed operations (emission, drift checking) REFUSE a foreign
occupant of an expected projection name rather than adjudicating or
overwriting it — recovery from a mangled stub or a name collision is a
human rename or removal, never an automatic write over unproven
territory; (2) classification reads candidate `SKILL.md` files
(kind-gated, never through symlinks), so an unreadable entry — even a
Vendor one — fails our run loudly as cannot-classify rather than being
guessed either way: a red caused by an unreadable Vendor entry is a
filesystem-permission problem, not a Practice defect; (3) a
byte-faithful copy of one of our stubs is indistinguishable from ours —
the marker records a derivation, not an identity — a recorded bound
(`agent-tools/src/skills-adapter-generate/adapter-stub.ts`) whose
closure would need an identity discriminator, a separate design
decision.

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

### 2026-08-12 — Three skill classes; validation scoped to the Practice class

The former §Externally installed skills described a vendoring class:
committed external copies pinned in `skills-lock.json`, symlinks
tolerated through a lock exemption in the reconciliation sweep, and two
recorded hash-reconciliation gaps. That machinery claimed jurisdiction
over external skills and defined the external installer's standard
layout as a defect — violating the testing doctrine's existing
never-test-external rule. The owner's three-class taxonomy (Practice /
Vendor / User-facing, now §Skill classes and validation jurisdiction)
replaces it: OUR lock-reading and validation plumbing is deleted —
`lock.ts`, the `lockedIds` machinery, the `--clear` lock-awareness the
2026-08-02 amendment below added, the portability cross-reference, and the
sweep's lock exemption. `skills-lock.json` itself belongs to the external
skills tooling and is left untouched: our validation has no jurisdiction
over it and does not read, validate, or reason about it. The sweep and the
permission census recognise Practice projections by their recorded
derivation (the class marker), and everything else at the projection roots
is out of jurisdiction. Plan:
`skill-classes-and-validation-jurisdiction` (ratified 2026-08-12).

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
`pnpm skills:generate`; manual edits forbidden by
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

### 2026-07-24 — Local Copilot CLI adapter family

The owner ratified local GitHub Copilot CLI as an equal first-class citizen of
the repository Practice. The adapter family follows the existing
canonical-first boundary:

- `.agent/` remains the source of doctrine and behaviour;
- `.agents/skills/` remains the selected Copilot skill home under GitHub's
  documented `.github/skills` → `.agents/skills` → `.claude/skills`
  first-found precedence;
- GitHub-native instructions, custom agents, hooks, settings, and repository
  MCP files are generated or thin projections only; MCP delivery first
  establishes a canonical secret-free server manifest by dispositioning every
  tracked platform candidate;
- Copilot identity, policy, communications, and lifecycle reuse canonical
  `agent-tools` boundaries through Copilot-specific parsers, renderers, probes,
  and composition;
- native startup supplies context and creates no shared coordination state; any
  working session, quick-start included, still registers a bounded active claim
  before its first edit under the always-loaded registration rule, and
  `oak-start-right-team` is the deliberate boundary for continuous team
  participation — heartbeat emission, the all-channels watcher, and the
  handoff/retirement lifecycle.

The amendment is restricted to Copilot CLI running locally. Coding-agent/cloud
execution, remote transport, hosted bridges, and unrelated Codex parity work
are excluded. The target-versus-wired truth lives in the cross-platform
surface matrix.

### 2026-08-02 — Externally installed skills: vendored class replaces canonicalise-into-core

The original §Externally installed skills instructed canonicalising external
content into `.agent/skills/`. Owner word (2026-08-02, in-session): that
approach "was true, a long time ago, that approach was abandoned". The
section now records the live rule — externals vendor into `.agents/skills/`
lock-pinned via `skills-lock.json` and never enter the canonical core
(worked instances: the clerk family and mcp-inspector at commit `93ffa8aed`;
the owner-invoked skill-creator install landed the same way on
2026-08-02). The plugin-retention guidance from the
original section remains valid and is preserved in place. In the same
change, the adapter generator's `--clear` gained lock awareness (vendored
externals are never removed; an unreadable lock or an unreadable surface
refuses the clear) and a skipped canonical directory became a hard failure
instead of a warning on a zero exit. The Layer 2 wrapper description, the
prefix paragraph, and structural invariant 5 — which still described the
abandoned canonicalise-ingested model — were updated to the vendored model
in the same amendment, so the ADR carries one model for lock entries.

## References

- `.agent/skills/` — canonical skills (`SKILL-CANONICAL.md` per skill, plus supporting files)
- `.agent/rules/` and `.agent/directives/` — canonical rules and directives
- `.agent/sub-agents/` — canonical sub-agent prompts (ADR-114), personas, and components
- `.agents/skills/`, `.claude/skills/` — generated skill adapter surfaces (only two)
- `.cursor/`, `.claude/`, `.github/`, `.gemini/`, `.codex/` — platform
  adapters for the surfaces each host supports (no additional canonical
  content homes)
- [First-class Copilot CLI Practice support report](../../../.agent/reports/agentic-engineering/first-class-copilot-cli-practice-support-2026-07-24.md)
- [PDR-051](../../../.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md) — portable skills standardisation doctrine
- [ADR-135](135-agent-classification-taxonomy.md) — agent classification taxonomy referenced in the 2026-04-17 amendment
- [ADR-165](165-agent-work-practice-phenotype-boundary.md) — local phenotype boundary for PDR-035 agent-work capabilities
