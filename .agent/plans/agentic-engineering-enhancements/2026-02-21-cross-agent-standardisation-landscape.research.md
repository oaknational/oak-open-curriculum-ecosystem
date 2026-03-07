# Cross-Agent Standardisation Landscape

**Date**: 21 February 2026 (originated); 22 February 2026 (merged addendum corrections)
**Scope**: Emerging standards for AI coding agent configuration, and alignment opportunities within this repository.

---

## Executive Summary

Four open standards and protocols are emerging for AI coding agent interoperability, each addressing a different layer:

1. **AGENTS.md** — project-level instructions, now under the Linux Foundation.
2. **Agent Skills** (`SKILL.md`) — portable capability packages, originated from Anthropic.
3. **Model Context Protocol (MCP)** — agent-to-tool/resource integration, originated from Anthropic, now under the Linux Foundation.
4. **Agent2Agent Protocol (A2A)** — agent-to-agent discovery and collaboration, originated from Google.

This repository already implements a layered architecture (ADR-114) that is structurally ahead of what any individual standard prescribes. However, there are concrete alignment opportunities — particularly around skill metadata normalisation, directory consolidation, and command portability — that would reduce maintenance cost and improve cross-agent compatibility with minimal effort.

The landscape is converging on a common format: **Markdown + optional YAML frontmatter + layered discovery** (global, repo, subdir, task/agent-specific). This validates the repository's existing "agent-agnostic cores with thin platform wrappers" strategy.

---

## Part 1: The Standards

### 1.1 AGENTS.md

- **Website**: <https://agents.md/>
- **Steward**: Agentic AI Foundation (AAIF), a Series of LF Projects under the Linux Foundation.
  - [Linux Foundation: formation of AAIF (Dec 9, 2025)](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
  - [OpenAI: co-founding AAIF and contributing AGENTS.md](https://openai.com/index/agentic-ai-foundation/)
- **Adoption**: 60,000+ open-source repositories.
- **Supported by**: OpenAI Codex, Google Jules, Cursor, Amp, Factory, Aider, Goose, OpenCode, Zed, Warp, VS Code, Devin (Cognition), Windsurf, Roo Code, Gemini CLI, GitHub Copilot, Kilo Code, Phoenix, Semgrep, and others.

#### Format

Plain markdown. No required schema, no YAML frontmatter, no prescribed headings. Any markdown content works. Agents parse it as natural language instructions.

#### Key design decisions

- **Separate from README.md**: READMEs are for humans; AGENTS.md is for agents. The content can be more detailed, verbose, and operationally specific than a human would want to read.
- **Nested files for monorepos**: Agents read the nearest `AGENTS.md` in the directory tree, so each workspace or package can have its own. The closest file takes precedence.
- **No versioning or metadata**: Deliberately minimal. Treat it as living documentation. No frontmatter, no schema evolution concerns.
- **Compatibility aliases**: The specification suggests `ln -s AGENTS.md AGENT.md` for backward compatibility with older conventions.
- **Precedence rules are partially vendor-defined**: e.g. OpenAI Codex documents its own lookup order and optional override behaviour ([Codex: Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)).

#### Coverage

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
- **Specification**: <https://agentskills.io/specification/2025-02-17/>
- **Repository**: <https://github.com/agentskills/agentskills>
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

#### Coverage

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

### 1.3 Model Context Protocol (MCP)

- **Specification**: [MCP Specification (stable 2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
- **Steward**: Now under the Linux Foundation (AAIF) alongside AGENTS.md.
  - [Anthropic: donating MCP and establishing AAIF](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)

MCP standardises how LLM applications and agents connect to **tools** (callable functions), **resources** (structured context), and **prompts** (server-provided prompt templates).

#### Registry and packaging

- **MCP Registry**: an official, centralised metadata repository for publicly accessible MCP servers ([overview](https://modelcontextprotocol.io/registry/about), [docs](https://registry.modelcontextprotocol.io/docs), [quickstart](https://modelcontextprotocol.io/registry/quickstart)).
- **MCP Bundle format (`.mcpb`)**: an emerging distribution format for portable local MCP servers ([blog post](https://blog.modelcontextprotocol.io/posts/2025-11-20-adopting-mcpb/), [repo/spec](https://github.com/modelcontextprotocol/mcpb)).

#### Relevance to this landscape

Even if repo instruction standards converge, tool access will remain a differentiator. MCP is increasingly the interoperability layer for "the agent can safely *do things*" (query CI logs, run tests, open tickets, etc.). This repository produces MCP servers — understanding MCP's standardisation trajectory is directly relevant.

### 1.4 Agent2Agent Protocol (A2A)

- **Website**: <https://a2a-protocol.org/>
- **Origin**: Google.
- **Primary sources**: [announcement](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/), [Agent Discovery docs](https://a2a-protocol.org/latest/topics/agent-discovery/), [A2A and MCP comparison](https://a2a-protocol.org/latest/topics/a2a-and-mcp/)

A2A standardises how autonomous agents (often run by different vendors) discover each other and collaborate on tasks. Key concepts:

- **Agent Cards** — a JSON "business card" describing identity, endpoint, auth, and skills.
- Standardised **task lifecycle** and streaming patterns.
- Explicit separation: **agent-to-agent** interactions (A2A) vs **agent-to-tool** interactions (MCP).

Discovery follows [RFC 8615](https://datatracker.ietf.org/doc/rfc8615/) well-known path conventions.

#### Relevance to this landscape

Coding agents are increasingly composed into systems ("planner agent, implementer agent, reviewer agent"). A2A is the first broadly-backed attempt to standardise cross-vendor delegation patterns. The repository's sub-agent architecture (ADR-114) already implements this pattern internally; A2A addresses it at the network/cross-vendor level.

### 1.5 Relationship between the standards

The four standards are complementary, not competing:

| Standard | Question it answers |
|---|---|
| **AGENTS.md** | What should an agent know about this project? |
| **Agent Skills** | What capabilities can an agent load on demand? |
| **MCP** | How does an agent connect to tools and resources? |
| **A2A** | How do agents discover and collaborate with each other? |

A project can (and should) use AGENTS.md + Agent Skills + MCP together. A2A applies when multi-agent delegation crosses vendor boundaries.

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
| Subagents | `.claude/agents/*.md` | Markdown + YAML frontmatter ([docs](https://docs.anthropic.com/en/docs/claude-code/subagents)) |
| Slash commands | `.claude/commands/**/*.md` | Markdown + optional YAML (`description`, `argument-hint`) |
| Settings | `.claude/settings.json` | JSON (permissions, MCP servers) |
| Plugin metadata | `.claude-plugin/plugin.json` | JSON (`name`, `version`, `author`, `category`) |

### 2.3 Gemini

| Concept | Location | Format |
|---|---|---|
| Settings | `.gemini/settings.json` | JSON (MCP servers, `contextFileName`) |
| Root instructions | `GEMINI.md` (default); configurable via `contextFileName` to also read `AGENTS.md` | Markdown |

Source: [Gemini CLI: GEMINI.md documentation](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)

### 2.4 Windsurf

| Concept | Location | Format |
|---|---|---|
| Always-applied rules | `.windsurf/rules/*.md` | Markdown + YAML frontmatter (`trigger: always_on`) |

### 2.5 OpenAI Codex

| Concept | Location | Format |
|---|---|---|
| Root instructions | `AGENTS.md` | Plain markdown |
| Skills metadata | `agents/openai.yaml` | YAML (skill identity, dependencies) ([docs](https://developers.openai.com/codex/guides/skills)) |

### 2.6 GitHub Copilot / VS Code

| Concept | Location | Format |
|---|---|---|
| Root instructions | `.github/copilot-instructions.md` | Plain markdown |
| Path-scoped instructions | `.github/instructions/*.instructions.md` | Markdown + YAML frontmatter (`applyTo` glob) |
| Custom agents | `.github/agents/*.agent.md` | Markdown + YAML frontmatter |
| Agent Skills | Via Agent Skills spec | SKILL.md format |

Sources: [GitHub: Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions), [VS Code: Use custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions), [GitHub: Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration), [VS Code: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents), [VS Code: Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)

### 2.7 Cross-platform skill discovery (`.agents/`)

The `.agents/` directory (plural) is an emerging convention for vendor-provided skills that work across multiple platforms. In this repo, Clerk ships skills here with dual adapters:

- `SKILL.md` — Agent Skills format (works with Cursor, Claude Code, etc.)
- `.claude-plugin/plugin.json` — Claude Code plugin metadata

This directory is not part of either formal standard but appears to be an emerging convention for third-party skill distribution.

---

## Part 3: What Has No Cross-Platform Standard

The following concepts are used in this repository but lack a formal cross-platform standard, though some now have platform-specific analogues.

### 3.1 Sub-agent definitions

No *cross-platform* standard exists for defining specialised review agents with specific lenses, tool access, and read-only constraints. However, close analogues now exist on multiple platforms:

| Platform | Location | Format |
|---|---|---|
| Cursor | `.cursor/agents/*.md` | Markdown + YAML (`model`, `tools`, `readonly`) |
| Claude Code | `.claude/agents/*.md` | Markdown + YAML ([docs](https://docs.anthropic.com/en/docs/claude-code/subagents)) |
| GitHub/VS Code | `.github/agents/*.agent.md` | Markdown + YAML ([docs](https://docs.github.com/en/copilot/reference/custom-agents-configuration)) |

The formats are similar (Markdown + YAML frontmatter) but not identical. The convergence trend suggests a cross-platform sub-agent standard may emerge.

The repository's approach — canonical logic in `.agent/sub-agents/templates/` with thin platform-specific wrappers in `.cursor/agents/` — remains correct. As other platforms gain sub-agent dispatch, equivalent thin wrappers can be created pointing at the same templates. Claude Code and GitHub/VS Code wrappers are now feasible.

### 3.2 Always-applied rules

Cursor's `.mdc` format with `alwaysApply: true` and `globs` conditions now has a close equivalent in GitHub/VS Code:

| Platform | Location | Mechanism |
|---|---|---|
| Cursor | `.cursor/rules/*.mdc` | `alwaysApply: true` + `globs` in YAML frontmatter |
| GitHub/VS Code | `.github/instructions/*.instructions.md` | `applyTo` glob in YAML frontmatter |

Other platforms have no scoped-rule equivalent:

- **Claude Code**: put rules in `CLAUDE.md` (no conditional application)
- **Gemini**: put rules in `GEMINI.md` (no conditional application)

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
GEMINI.md                           → .agent/directives/AGENT.md
.github/copilot-instructions.md     → .agent/directives/AGENT.md
.windsurf/rules/generalrules.md     → .agent/directives/AGENT.md
```

The cost of adding a new platform is one line of markdown.

### 4.3 Inventory summary

> Counts are as-of the research date (2026-02-21). Re-audit the directories listed below for current state before acting on specific numbers.

| Category | Agent-agnostic (.agent/) | Cursor (.cursor/) | Claude (.claude/) | Other |
|---|---|---|---|---|
| Directives | `directives/AGENT.md`, `principles.md`, etc. | — | — | — |
| Sub-agent templates | 11 in `sub-agents/templates/` | — | — | — |
| Sub-agent components | 3 in `sub-agents/components/` | — | — | — |
| Sub-agent wrappers | — | 14 in `agents/` | — | — |
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
| Metacognition | — | `perspective/metacognition.md` |
| Collaboration | — | `drafts/collaborate.md` |
| Consolidate docs | `jc-consolidate-docs.md` | — |
| Start right | `jc-start-right-quick.md`, `jc-start-right-thorough.md` | — |
| Go | `jc-go.md` | — |

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

**Current state**: The `start-right` skill has a `SKILL.md` (Agent Skills format) and an `agents/openai.yaml` stub. The YAML file contains a Codex-specific adapter format:

```yaml
interface:
  display_name: "Start Right"
  short_description: "Load start-right prompt into current session"
  default_prompt: "Use $start-right to load and apply ..."
```

**Context**: Codex documents and uses `agents/openai.yaml` as a first-class skills metadata format ([Codex: Skills guide](https://developers.openai.com/codex/guides/skills)). This is vendor-specific but supported, not speculative.

**Options**:

1. **Keep and align** — treat as a supported vendor adapter (analogous to the Cursor wrappers for sub-agents), verify it matches the current Codex skills guide format, and document its purpose.
2. **Delete** — the current stub may not match the documented Codex format and has not been tested. Recreate it when Codex is actively used as a development platform.
3. **Replace with a compatibility note** — document in the SKILL.md that the skill is designed for cross-platform use and list supported adapters.

**Recommendation**: Option 2 (delete and recreate when needed). The stub was written before the Codex skills guide was published and has not been validated against the current specification. Keeping an untested adapter creates false confidence. When Codex becomes an active platform, create a validated adapter following the current guide.

### 5.7 Sub-agent wrappers for Claude Code and GitHub/VS Code (new opportunity)

**Current state**: Sub-agent templates exist in `.agent/sub-agents/templates/` but wrappers exist only for Cursor (`.cursor/agents/`).

**Opportunity**: Claude Code and GitHub/VS Code now support sub-agent definitions. Thin wrappers could be created in `.claude/agents/` and `.github/agents/` pointing at the same canonical templates.

**Recommendation**: Evaluate when Claude Code or GitHub Copilot becomes an active development platform for this repository. The three-layer architecture (ADR-114) was designed for exactly this scenario — adding a new platform is a thin-wrapper exercise.

---

## Part 6: Maturity Assessment

### Standards maturity

| Standard | Governance | Specification | Tooling | Adoption | Stability |
|---|---|---|---|---|---|
| AGENTS.md | Linux Foundation (AAIF) | Informal (markdown convention) | None needed | High (60k+ repos) | Stable (simple by design) |
| Agent Skills | Open (originated Anthropic) | Formal spec at agentskills.io | `skills-ref` CLI | Growing (20+ platforms) | Maturing (spec may evolve) |
| MCP | Linux Foundation (AAIF) | Formal spec (2025-11-25) | Official SDKs, registry | High (broad adoption) | Stable |
| A2A | Open (originated Google) | Formal spec | Reference implementations | Early | Maturing |

### Repository maturity vs standards

| Aspect | This repo | Standards | Assessment |
|---|---|---|---|
| Root entry points | Delegates to .agent/ | AGENTS.md convention | Ahead — single-source delegation is cleaner than inline content |
| Skills | SKILL.md format | Agent Skills spec | Mostly aligned, minor frontmatter drift |
| Sub-agents | Three-layer architecture (ADR-114) | Emerging vendor analogues (Cursor, Claude Code, GitHub/VS Code) | Ahead — our architecture is more sophisticated and portable |
| Rules | .mdc with alwaysApply | GitHub/VS Code `applyTo` equivalent; others lack scoping | Ahead for Cursor; portable for GitHub/VS Code |
| Commands | Platform-specific with overlap | No standard | Mild duplication, manageable |
| Memory/learning | Four-layer persistence | No standard | Unique to this repo, no standard expected |

---

## Part 7: Convergence and Future Direction

### 7.1 Format convergence

The ecosystem is converging on **Markdown + YAML frontmatter**, but the *meaning* of fields like "tools allowed", "read-only mode", "always apply", and "model selection" still differs between products.

The next wave of standardisation pressure will likely land on:

- **Permission models** (how agents declare and request powers)
- **Policy enforcement** (allowlists, audit, enterprise controls)
- **Provenance and trust** (signed registries, verified publishers)

MCP's registry/namespace work is a concrete example of this shift.

### 7.2 Agent Skills to A2A mapping opportunity

A2A Agent Cards include skill descriptors (`AgentSkill` objects), while Agent Skills standardises skill packaging in `SKILL.md`. There is an obvious future interoperability win in defining a consistent mapping between "repo-local SKILL.md package metadata" and "network-advertised A2A Agent Card skill metadata."

### 7.3 Skill dependencies to MCP registry mapping opportunity

Codex's skill dependencies and MCP's registry identity conventions are converging on the same problem: "how do you refer to reusable capabilities in a portable way?"

### 7.4 Minimum viable interoperability checklist

For maximum portability across ecosystems without chasing every vendor format:

1. Provide **AGENTS.md** (high-level repo onboarding + core policies)
2. Package deep procedures as **SKILL.md** skills (on-demand loading)
3. Prefer tool integrations via **MCP**, and publish/share servers via the registry where appropriate
4. If operating multi-agent systems, track **A2A** as the cross-vendor delegation candidate

---

## Part 8: Recommendations Summary

| # | Action | Effort | Value | Priority |
|---|---|---|---|---|
| 5.1 | Normalise skill frontmatter to spec | Trivial | Spec compliance | Do now |
| 5.2 | Skill directory consolidation | Medium | Architectural clarity | Wait for second consumer |
| 5.3 | Command portability via agent-agnostic cores | Medium | Drift reduction | Wait for third platform or growth |
| 5.4 | Nested AGENTS.md for workspaces | Low | Better per-package context | When onboarding or complexity demands |
| 5.5 | Windsurf rules alignment | None | Already aligned | Done |
| 5.6 | Delete and recreate openai.yaml when needed | Trivial | Remove untested adapter | Do now |
| 5.7 | Sub-agent wrappers for Claude Code/GitHub | Low | Cross-platform sub-agents | When platform becomes active |

### Guiding principle

The repository's existing architecture — agent-agnostic cores with thin platform wrappers — is the correct strategy. The four emerging standards validate this approach. Continue investing in the agnostic core; keep platform-specific wrappers thin and trivially replaceable.

---

## References

### Standards bodies and governance

- [AGENTS.md](https://agents.md/)
- [Agentic AI Foundation (AAIF)](https://aaif.io/)
- [Linux Foundation: AAIF announcement (Dec 9, 2025)](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
- [OpenAI: co-founding AAIF and contributing AGENTS.md](https://openai.com/index/agentic-ai-foundation/)
- [Anthropic: donating MCP and establishing AAIF](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)

### AGENTS.md and Codex

- [OpenAI Codex: Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [OpenAI Codex: Skills guide](https://developers.openai.com/codex/guides/skills)

### Agent Skills

- [Agent Skills home](https://agentskills.io/)
- [Agent Skills specification](https://agentskills.io/specification/2025-02-17/)
- [VS Code: Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Agent Skills GitHub](https://github.com/agentskills/agentskills)
- [Anthropic example skills](https://github.com/anthropics/skills)

### MCP

- [MCP Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Registry overview](https://modelcontextprotocol.io/registry/about)
- [Official MCP Registry docs](https://registry.modelcontextprotocol.io/docs)
- [Registry quickstart](https://modelcontextprotocol.io/registry/quickstart)
- [MCP blog: Server instructions](https://blog.modelcontextprotocol.io/posts/2025-11-03-using-server-instructions/)
- [MCP blog: adopting MCP Bundles (.mcpb)](https://blog.modelcontextprotocol.io/posts/2025-11-20-adopting-mcpb/)
- [MCP Bundles repo/spec](https://github.com/modelcontextprotocol/mcpb)

### A2A

- [Google: A2A announcement](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [A2A docs: Agent Discovery](https://a2a-protocol.org/latest/topics/agent-discovery/)
- [A2A docs: A2A and MCP](https://a2a-protocol.org/latest/topics/a2a-and-mcp/)
- [RFC 8615 (well-known URIs)](https://datatracker.ietf.org/doc/rfc8615/)

### GitHub / VS Code conventions

- [GitHub: Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [VS Code: Use custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [GitHub: Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [VS Code: Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)

### Claude and Gemini conventions

- [Claude Code: Create custom subagents](https://docs.anthropic.com/en/docs/claude-code/subagents)
- [Gemini CLI: GEMINI.md documentation](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)

### ADR-114

- [Layered Sub-agent Prompt Composition Architecture](../../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md)
