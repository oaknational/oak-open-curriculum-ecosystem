# Cross-Agent Standardisation Landscape

**Date**: 21 February 2026
**Scope**: Emerging standards for AI coding agent configuration, and alignment opportunities within this repository.

---

## Executive Summary

Two open standards are emerging for AI coding agent configuration, both with significant industry adoption:

1. **AGENTS.md** — project-level instructions, now under the Linux Foundation.
2. **Agent Skills** (`SKILL.md`) — portable capability packages, originated from Anthropic.

This repository already implements a layered architecture (ADR-114) that is structurally ahead of what either standard prescribes. However, there are concrete alignment opportunities — particularly around skill metadata normalisation, directory consolidation, and command portability — that would reduce maintenance cost and improve cross-agent compatibility with minimal effort.

Several important categories (sub-agent definitions, always-applied rules, slash commands) have **no cross-agent standard** and remain inherently platform-specific. The repository's existing strategy of agent-agnostic cores with thin platform wrappers is the correct hedge for these areas.

---

## Part 1: The Standards

### 1.1 AGENTS.md

- **Website**: <https://agents.md/>
- **Steward**: Agentic AI Foundation, a Series of LF Projects under the Linux Foundation.
- **Adoption**: 60,000+ open-source repositories.
- **Supported by**: OpenAI Codex, Google Jules, Cursor, Amp, Factory, Aider, Goose, OpenCode, Zed, Warp, VS Code, Devin (Cognition), Windsurf, Roo Code, Gemini CLI, GitHub Copilot, Kilo Code, Phoenix, Semgrep, and others.

#### Format

Plain markdown. No required schema, no YAML frontmatter, no prescribed headings. Any markdown content works. Agents parse it as natural language instructions.

#### Key design decisions

- **Separate from README.md**: READMEs are for humans; AGENTS.md is for agents. The content can be more detailed, verbose, and operationally specific than a human would want to read.
- **Nested files for monorepos**: Agents read the nearest `AGENTS.md` in the directory tree, so each workspace or package can have its own. The closest file takes precedence.
- **No versioning or metadata**: Deliberately minimal. Treat it as living documentation. No frontmatter, no schema evolution concerns.
- **Compatibility aliases**: The specification suggests `ln -s AGENTS.md AGENT.md` for backward compatibility with older conventions.

#### What it covers

| Concern | Covered? |
|---|---|
| Project-level instructions | Yes |
| Build/test commands | Yes |
| Code style guidelines | Yes |
| Monorepo per-package instructions | Yes (nested files) |
| Sub-agent definitions | No |
| Skill/capability packages | No |
| Always-applied rules | No |
| Slash commands | No |
| Platform-specific config | No (explicitly out of scope) |

### 1.2 Agent Skills (SKILL.md)

- **Website**: <https://agentskills.io/>
- **Origin**: Anthropic (Claude Code). Now an open standard.
- **Specification repository**: <https://github.com/agentskills/agentskills>
- **Reference implementation**: `skills-ref` Python CLI for validation and prompt XML generation.
- **Supported by**: Cursor, Claude Code, Gemini CLI, Amp, OpenAI Codex, GitHub, VS Code, Roo Code, Factory, Goose, Databricks, Spring AI, Letta, TRAE, Qodo, Firebender, and others.

#### Format

A skill is a directory containing a `SKILL.md` file with YAML frontmatter and markdown body.

```yaml
---
name: skill-name          # Required. Lowercase, hyphens, 1-64 chars.
description: ...          # Required. What it does and when to use it. 1-1024 chars.
license: Apache-2.0       # Optional.
compatibility: ...        # Optional. Environment requirements.
allowed-tools: Read Bash(git:*)  # Optional, experimental.
metadata:                 # Optional. Arbitrary key-value pairs.
  author: example-org
  version: "1.0"
---

# Skill instructions in markdown
```

#### Directory structure

```text
skill-name/
├── SKILL.md          # Required
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation agents can read on demand
└── assets/           # Optional: templates, schemas, data files
```

#### Key design decisions

- **Progressive disclosure**: At startup, agents load only `name` and `description` (~100 tokens per skill). On activation, the full `SKILL.md` body is loaded (<5,000 tokens recommended). Resources in `scripts/`, `references/`, `assets/` are loaded only when needed.
- **Name must match directory name**: `name: pdf-processing` must live in a directory called `pdf-processing/`.
- **No runtime assembly**: Skills are static files, not dynamically composed. This keeps them auditable and version-controllable.
- **Non-standard fields belong in `metadata:`**: The spec defines six top-level fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`). Anything else should go in the `metadata` map.

#### What it covers

| Concern | Covered? |
|---|---|
| Portable capability packages | Yes |
| Skill discovery and activation | Yes |
| Progressive context loading | Yes |
| Bundled scripts and resources | Yes |
| Cross-agent compatibility | Yes |
| Sub-agent definitions | No |
| Always-applied rules | No |
| Slash commands | No |
| Platform-specific config | No |

### 1.3 Relationship between the two standards

AGENTS.md and Agent Skills are complementary, not competing:

- **AGENTS.md** answers: "What should an agent know about this project?"
- **Agent Skills** answers: "What capabilities can an agent load on demand?"

A project can (and should) use both. AGENTS.md provides the baseline context; skills provide specialised capabilities that are activated selectively.

---

## Part 2: Platform-Specific Conventions

### 2.1 Cursor

| Concept | Location | Format |
|---|---|---|
| Sub-agents | `.cursor/agents/*.md` | Markdown + YAML frontmatter (`name`, `description`, `model`, `tools`, `readonly`) |
| Always-applied rules | `.cursor/rules/*.mdc` | Markdown + YAML frontmatter (`description`, `alwaysApply`, `globs`) |
| Skills | `.cursor/skills/*/SKILL.md` | Agent Skills format |
| Slash commands | `.cursor/commands/*.md` | Markdown + optional YAML (`description`, `argument-hint`) |
| Settings | `.cursor/settings.json` | JSON |
| MCP servers | `.cursor/mcp.json` | JSON |
| Plans | `.cursor/plans/*.plan.md` | Markdown + YAML frontmatter |

### 2.2 Claude Code

| Concept | Location | Format |
|---|---|---|
| Root instructions | `CLAUDE.md` | Plain markdown |
| Slash commands | `.claude/commands/**/*.md` | Markdown + optional YAML (`description`, `argument-hint`) |
| Settings | `.claude/settings.json` | JSON (permissions, MCP servers) |
| Plugin metadata | `.claude-plugin/plugin.json` | JSON (`name`, `version`, `author`, `category`) |

### 2.3 Gemini

| Concept | Location | Format |
|---|---|---|
| Settings | `.gemini/settings.json` | JSON (MCP servers, `contextFileName`) |
| Root instructions | Configurable via `contextFileName` (defaults to `AGENTS.md`) | Markdown |

### 2.4 Windsurf

| Concept | Location | Format |
|---|---|---|
| Always-applied rules | `.windsurf/rules/*.md` | Markdown + YAML frontmatter (`trigger: always_on`) |

### 2.5 OpenAI Codex

| Concept | Location | Format |
|---|---|---|
| Root instructions | `AGENTS.md` | Plain markdown |

### 2.6 GitHub Copilot

| Concept | Location | Format |
|---|---|---|
| Root instructions | `.github/copilot-instructions.md` | Plain markdown |

### 2.7 Cross-platform skill discovery (`.agents/`)

The `.agents/` directory (plural) is an emerging convention for vendor-provided skills that work across multiple platforms. In this repo, Clerk ships skills here with dual adapters:

- `SKILL.md` — Agent Skills format (works with Cursor, Claude Code, etc.)
- `.claude-plugin/plugin.json` — Claude Code plugin metadata

This directory is not part of either formal standard but appears to be an emerging convention for third-party skill distribution.

---

## Part 3: What Has No Standard

The following concepts are used in this repository but have no cross-agent standard and no clear path to one:

### 3.1 Sub-agent definitions

No standard exists for defining specialised review agents with specific lenses, tool access, and read-only constraints. This is inherently tied to the host agent's dispatch mechanism. Cursor's `.cursor/agents/*.md` with `model`, `tools`, and `readonly` fields has no equivalent in Claude Code, Codex, or any other platform.

The repository's approach — canonical logic in `.agent/sub-agents/templates/` with thin Cursor-specific wrappers in `.cursor/agents/` — is the correct strategy. If another platform gains sub-agent dispatch, equivalent thin wrappers can be created pointing at the same templates.

### 3.2 Always-applied rules

Cursor's `.mdc` format with `alwaysApply: true` and `globs` conditions has no equivalent elsewhere. The closest alternatives:

- Put everything in `AGENTS.md` (no conditional application, no glob targeting).
- For Claude Code, put them in `CLAUDE.md` (no conditional application).

The repository's approach is pragmatic: critical rules live in `.cursor/rules/*.mdc` for Cursor, and the most important directives are also captured in `.agent/directives/AGENT.md` (read by all agents via `AGENTS.md`, `CLAUDE.md`, etc.).

### 3.3 Slash commands

Cursor and Claude Code both support slash commands but with different invocation models:

- **Cursor**: `.cursor/commands/*.md`, invoked as `/command-name`, supports `$ARGUMENT`.
- **Claude Code**: `.claude/commands/**/*.md`, invoked as `/command-name`, supports `$ARGUMENT`, also supports subdirectory namespacing (`/perspective/step-back`).

The formats are similar (both are markdown with optional YAML frontmatter) but not identical. No cross-platform command format exists.

### 3.4 Platform operational config

Settings files (`.cursor/settings.json`, `.claude/settings.json`, `.gemini/settings.json`) are inherently platform-specific: they configure permissions, MCP servers, models, and environment. Standardisation here is neither feasible nor desirable — these are the equivalent of editor-specific settings.

---

## Part 4: Current Repository Architecture

### 4.1 The three-layer model (ADR-114)

The repository implements a three-layer prompt composition architecture:

```text
Layer 1: Components (.agent/sub-agents/components/)
         └── Leaf-node building blocks (DRY/YAGNI principles, architecture team guidance)

Layer 2: Templates (.agent/sub-agents/templates/)
         └── Canonical workflows composed from components

Layer 3: Consumer wrappers (.cursor/agents/*.md)
         └── Thin identity/dispatch envelopes (~5 lines each)
```

This architecture is more sophisticated than anything either AGENTS.md or Agent Skills addresses, and it is the correct approach for managing sub-agent prompt complexity.

### 4.2 Root entry point delegation

All platform-specific root entry points delegate to a single agent-agnostic core:

```text
AGENTS.md                           → .agent/directives/AGENT.md
CLAUDE.md                           → .agent/directives/AGENT.md
.github/copilot-instructions.md     → .agent/directives/AGENT.md
.windsurf/rules/generalrules.md     → .agent/directives/AGENT.md
```

The cost of adding a new platform is one line of markdown.

### 4.3 Inventory summary

| Category | Agent-agnostic (.agent/) | Cursor (.cursor/) | Claude (.claude/) | Other |
|---|---|---|---|---|
| Directives | `directives/AGENT.md`, `rules.md`, etc. | — | — | — |
| Sub-agent templates | 10 in `sub-agents/templates/` | — | — | — |
| Sub-agent components | 2 in `sub-agents/components/` | — | — | — |
| Sub-agent wrappers | — | 13 in `agents/` | — | — |
| Skills | 1 in `skills/` | 4 in `skills/` | — | 7 in `.agents/skills/` (Clerk) |
| Always-applied rules | — | 13 in `rules/` | — | 1 in `.windsurf/rules/` |
| Slash commands | — | 10 in `commands/` | 9 in `commands/` | — |
| Memory/learning | `memory/napkin.md`, `distilled.md` | — | — | — |
| Plans | `plans/` | `plans/` (Cursor-managed) | — | — |
| Prompts | `prompts/` | — | — | — |
| Experience | `experience/` | — | — | — |

---

## Part 5: Opportunities for Standardisation Within This Repository

### 5.1 Skill frontmatter normalisation (low effort, high alignment)

**Current state**: Two skills (`napkin`, `distillation`) use non-standard top-level frontmatter fields (`version`, `date`). The Agent Skills spec reserves top-level fields for `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. Non-standard fields should go in `metadata:`.

**Affected files**:

- `.cursor/skills/napkin/SKILL.md` — has `version: 6.0.0`, `date: 2026-02-16`
- `.cursor/skills/distillation/SKILL.md` — has `version: 1.0.0`, `date: 2026-02-16`

**Recommended change**:

```yaml
# Before (non-standard)
version: 6.0.0
date: 2026-02-16

# After (spec-compliant)
metadata:
  version: "6.0.0"
  date: "2026-02-16"
```

**Risk**: Minimal. Cursor's skill system currently ignores unknown fields. Moving them to `metadata` is purely a hygiene change that aligns with the spec without affecting behaviour.

### 5.2 Skill directory consolidation (medium effort, architectural clarity)

**Current state**: Skills live in three locations:

| Location | Contents | Discovery |
|---|---|---|
| `.cursor/skills/` | Project-specific skills (napkin, distillation, ground-truth-*) | Cursor auto-discovers |
| `.agents/skills/` | Vendor-provided skills (Clerk suite) | Cross-platform convention |
| `.agent/skills/` | Agent-agnostic skills (start-right) with platform adapter stubs | Neither standard discovers |

**Options**:

1. **Status quo** — accept fragmentation, document the rationale.
2. **Consolidate project skills into `.agents/skills/`** — move project-specific skills alongside vendor skills, configure Cursor to scan `.agents/skills/`. This maximises cross-platform portability.
3. **Keep vendor skills in `.agents/skills/`, move project skills to `.agent/skills/`** — maintains the agent-agnostic core pattern but requires Cursor to scan both directories.

**Recommendation**: Option 1 (status quo) for now. The fragmentation is low-cost and each location serves a different purpose. `.cursor/skills/` skills are genuinely Cursor-specific (they reference Cursor-only features like the napkin workflow). `.agents/skills/` is for vendor-distributed cross-platform skills. `.agent/skills/` is for project-specific cross-platform skills, of which there is currently only one stub. Consolidation should wait until there is a real second consumer (e.g., Claude Code gaining skill support equivalent to Cursor's).

### 5.3 Command portability (medium effort, moderate value)

**Current state**: Several slash commands exist in both `.cursor/commands/` and `.claude/commands/` with overlapping intent but different implementations:

| Intent | Cursor | Claude Code |
|---|---|---|
| Quality gates | `jc-gates.md` (structured) | `jc-quality-gates.md` (one-liner) |
| Commit | `jc-commit.md` (structured) | `jc-commit-and-push.md` (one-liner) |
| Deep thinking | `jc-think.md` (structured) | `perspective/deep-thought.md` (structured) |
| Step back | `jc-step-back.md` (structured) | `perspective/step-back.md` (minimal) |
| Review | `jc-review.md` | `jc-full-review.md` |
| Planning | `jc-plan.md` | `planning/create-detailed-plan.md` |
| Experience | — | `jc-experience.md` |
| Consolidate docs | `consolidate-docs.md` | — |
| Start right | `jc-start-right.md` | — |
| Go | `go.md` | — |

The structured Cursor commands and the minimal Claude commands often encode the same intent with different levels of detail. The Cursor versions are generally more comprehensive.

**Recommendation**: Extract the canonical instruction content into `.agent/commands/` (agent-agnostic markdown) and have platform-specific command files delegate to them, mirroring the sub-agent template pattern. This would:

- Reduce drift between the two command sets.
- Make it trivial to add commands for future platforms.
- Preserve platform-specific invocation metadata (frontmatter) in the wrappers.

This is a YAGNI consideration — the current duplication is manageable. Pursue this only if the command sets continue to grow or a third platform is added.

### 5.4 Nested AGENTS.md for monorepo packages (low effort, moderate value)

**Current state**: The repository has a single root `AGENTS.md`. The AGENTS.md specification supports nested files for monorepo packages, with the nearest file taking precedence.

**Opportunity**: Add `AGENTS.md` files in key workspace directories (e.g., `apps/oak-curriculum-mcp-streamable-http/`, `packages/sdks/oak-curriculum-sdk/`) containing workspace-specific build commands, testing instructions, and architectural notes. Agents editing code in those directories would automatically receive more targeted context.

**Recommendation**: Consider this when onboarding external contributors or when agent interactions in specific workspaces regularly require repeated context. Not urgent — the current AGENT.md entry point covers the project well.

### 5.5 `.windsurf/rules/` alignment check (trivial effort)

**Current state**: The single Windsurf rule (`generalrules.md`) correctly delegates to `.agent/directives/AGENT.md` with `trigger: always_on`. This mirrors the pattern used by `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`.

**Status**: Already aligned. No action needed.

### 5.6 `.agent/skills/start-right/agents/openai.yaml` stub (decision needed)

**Current state**: The `start-right` skill has a `SKILL.md` (Agent Skills format) and an `agents/openai.yaml` stub. The YAML file contains a Codex-specific adapter format that is not part of any standard:

```yaml
interface:
  display_name: "Start Right"
  short_description: "Load start-right prompt into current session"
  default_prompt: "Use $start-right to load and apply ..."
```

**Options**:

1. **Delete the stub** — Codex does not currently support a skill dispatch mechanism equivalent to Cursor's. The YAML format is speculative.
2. **Keep as a placeholder** — signals intent to support Codex when/if it gains skill support.
3. **Replace with a compatibility note** — document in the SKILL.md that the skill is designed for cross-platform use but currently only has a Cursor consumer.

**Recommendation**: Option 1 (delete). The YAML format is not part of any standard and Codex has no documented skill dispatch mechanism. If Codex adopts Agent Skills, it will use `SKILL.md` directly. The stub adds no value and creates false expectations. This is a YAGNI violation.

---

## Part 6: Maturity Assessment

### Standards maturity

| Standard | Governance | Specification | Tooling | Adoption | Stability |
|---|---|---|---|---|---|
| AGENTS.md | Linux Foundation | Informal (markdown convention) | None needed | High (60k+ repos) | Stable (simple by design) |
| Agent Skills | Open (originated Anthropic) | Formal spec at agentskills.io | `skills-ref` CLI | Growing (20+ platforms) | Maturing (spec may evolve) |

### Repository maturity vs standards

| Aspect | This repo | Standards | Assessment |
|---|---|---|---|
| Root entry points | Delegates to .agent/ | AGENTS.md convention | Ahead — single-source delegation is cleaner than inline content |
| Skills | SKILL.md format | Agent Skills spec | Mostly aligned, minor frontmatter drift |
| Sub-agents | Three-layer architecture (ADR-114) | No standard | Ahead — no standard addresses this |
| Rules | .mdc with alwaysApply | No standard | Platform-locked (unavoidable) |
| Commands | Platform-specific with overlap | No standard | Mild duplication, manageable |
| Memory/learning | Four-layer persistence | No standard | Unique to this repo, no standard expected |

---

## Part 7: Recommendations Summary

| # | Action | Effort | Value | Priority |
|---|---|---|---|---|
| 5.1 | Normalise skill frontmatter to spec | Trivial | Spec compliance | Do now |
| 5.2 | Skill directory consolidation | Medium | Architectural clarity | Wait for second consumer |
| 5.3 | Command portability via agent-agnostic cores | Medium | Drift reduction | Wait for third platform or growth |
| 5.4 | Nested AGENTS.md for workspaces | Low | Better per-package context | When onboarding or complexity demands |
| 5.5 | Windsurf rules alignment | None | Already aligned | Done |
| 5.6 | Delete speculative openai.yaml stub | Trivial | Remove YAGNI violation | Do now |

### Guiding principle

The repository's existing architecture — agent-agnostic cores with thin platform wrappers — is the correct strategy. The two emerging standards validate this approach. Continue investing in the agnostic core; keep platform-specific wrappers thin and trivially replaceable.

---

## References

- AGENTS.md specification: <https://agents.md/>
- Agent Skills specification: <https://agentskills.io/specification>
- Agent Skills "What are skills?": <https://agentskills.io/what-are-skills>
- Agent Skills integration guide: <https://agentskills.io/integrate-skills>
- Agent Skills GitHub: <https://github.com/agentskills/agentskills>
- Anthropic example skills: <https://github.com/anthropics/skills>
- ADR-114 (Layered Sub-agent Prompt Composition): `docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md`
- Sub-agents README: `.agent/sub-agents/README.md`
