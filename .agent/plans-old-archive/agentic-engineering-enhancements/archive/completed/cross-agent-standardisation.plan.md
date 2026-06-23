---
name: Cross-Agent Standardisation
overview: >
  Align the repository's agent artefacts (skills, commands, workspace context)
  with emerging cross-agent standards to ensure portability across Cursor,
  Claude Code, Gemini CLI, and other platforms.
todos:
  # Committed work (do now)
  - id: skill-frontmatter
    content: "Normalise SKILL.md frontmatter to use metadata: block for non-standard fields."
    status: cancelled
  - id: openai-yaml-cleanup
    content: "Delete untested openai.yaml stub; recreate validated adapter when Codex is actively used."
    status: cancelled
  # Conditional work (do when trigger fires)
  - id: command-portability
    content: "CONDITIONAL: Extract canonical instruction content into agent-agnostic .agent/commands/*.md templates. Trigger: when command sets grow further or a third platform is added."
    status: cancelled
  - id: workspace-context
    content: "CONDITIONAL: Add nested AGENTS.md files for high-complexity workspaces. Trigger: when onboarding external contributors or when agent interactions regularly require repeated context."
    status: cancelled
  - id: subagent-wrappers
    content: "CONDITIONAL: Evaluate creating thin sub-agent wrappers for Claude Code and GitHub/VS Code. Trigger: when Claude Code or GitHub Copilot becomes an active development platform."
    status: cancelled
---

# Cross-Agent Standardisation

> **SUPERSEDED**: All tasks from this plan have been absorbed into [ADR-125 (Agent Artefact Portability)](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md). This plan is archived for historical reference only.

## 1. Intent

Ensure portability of the agentic engineering practice across Cursor, Claude Code, Gemini CLI, and other platforms by aligning agent artefacts with emerging cross-agent standards. Reduce maintenance entropy caused by platform-specific duplication.

This plan implements the cross-agent standardisation direction established in:

- [ADR-119: Agentic Engineering Practice](../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) (names portability as an evolving implementation direction)

Based on requirements and analysis in:

- [Cross-Agent Standardisation Landscape (research)](2026-02-21-cross-agent-standardisation-landscape.research.md)

**Related plan**: [Architectural Enforcement Adoption](architectural-enforcement-adoption.plan.md) (separated concern — physical constraints and boundary enforcement).

### Execution Role

This is a strategic source plan (intent, committed-vs-conditional split, and
trigger policy). The authoritative execution tasks for this stream live in:

- ~~phase-4-cross-agent-standardisation-execution.md~~ (archived, superseded by ADR-125)

## 2a. Committed Work

### Task 1: Skill Frontmatter Normalisation

- **Goal:** Comply with the Agent Skills specification for `SKILL.md` frontmatter.
- **Task:** Normalise frontmatter to use `metadata:` block for non-standard fields (`version`, `date`).
- **Scope:** All `SKILL.md` files in `.agent/skills/` and `.cursor/skills/`.
- **Research**: Landscape report section 5.1.

### Task 3: Codex Skills Adapter Cleanup

- **Goal:** Remove untested adapter; avoid false confidence from unvalidated stubs.
- **Task:** Delete the current `agents/openai.yaml` stub in `.agent/skills/start-right/`. When Codex becomes an active development platform, create a validated adapter following the [Codex Skills guide](https://developers.openai.com/codex/guides/skills).
- **Context:** Codex documents and supports `agents/openai.yaml` as first-class skills metadata. The current stub was written before the Codex skills guide was published and has not been validated against the current specification.
- **Research**: Landscape report section 5.6.

## 2b. Conditional Work

The following tasks are deferred until their explicit triggers fire.

### Task 2: Command Portability

- **Goal:** Eliminate duplication of instruction logic between platform-specific command files.
- **Task:** Extract canonical instruction content from `.cursor/commands/` and `.claude/commands/` into agent-agnostic `.agent/commands/*.md` templates. Platform-specific files become thin wrappers — mirroring the sub-agent template pattern.
- **Trigger:** When command sets grow further or a third platform is added.
- **Research**: Landscape report section 5.3.

### Task 4: Workspace Context

- **Goal:** Provide targeted per-package context for high-complexity workspaces.
- **Task:** Add nested `AGENTS.md` files for workspaces where the root-level context is insufficient (e.g., `apps/oak-curriculum-mcp-streamable-http/`).
- **Trigger:** When onboarding external contributors or when agent interactions in specific workspaces regularly require repeated context.
- **Research**: Landscape report section 5.4.

### Task 5: Sub-agent Wrappers for Additional Platforms

- **Goal:** Extend the three-layer sub-agent architecture (ADR-114) to Claude Code and GitHub/VS Code.
- **Task:** Evaluate and create thin sub-agent wrappers in `.claude/agents/` and/or `.github/agents/` pointing at the canonical templates in `.agent/sub-agents/templates/`.
- **Context:** Claude Code and GitHub/VS Code now support sub-agent definitions with Markdown + YAML frontmatter. The three-layer architecture was designed for exactly this scenario — adding a new platform is a thin-wrapper exercise.
- **Trigger:** When Claude Code or GitHub Copilot becomes an active development platform.
- **Research**: Landscape report sections 3.1 and 5.7.

## 3. Documentation Propagation Requirement

Apply the shared documentation-propagation contract:

- [Documentation Propagation component](../templates/components/documentation-propagation.md)
- [documentation-sync-log.md](documentation-sync-log.md) (collection tracking)

## 4. Success Metrics

### Committed (Tasks 1, 3)

- All `SKILL.md` files pass frontmatter validation against the Agent Skills specification.
- No untested agent configuration stubs remain.

### Conditional (when triggers fire)

- Zero duplication of instruction logic between platform-specific command files. (Task 2)
- High-complexity workspaces have local `AGENTS.md` providing targeted context. (Task 4)
- Sub-agent wrappers exist for each actively-used development platform. (Task 5)
