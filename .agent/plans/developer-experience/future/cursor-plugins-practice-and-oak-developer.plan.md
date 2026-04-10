---
plan_kind: strategic
lifecycle: future
collection: developer-experience
title: Cursor plugins — Practice (marketplace) and Oak developer (local)
created: 2026-04-10
status: exploration
execution_note: |
  This document is a strategic brief for exploration and sequencing.
  Implementation decisions are finalised only when promoted to current/active.
---

# Cursor plugins — Practice (marketplace) and Oak developer (local)

## 1. Problem and intent

**Problem**

- The **Practice** (rules, skills, agents, commands, hooks, multi-vendor support) is valuable outside this monorepo, but there is no single, validated distribution that meets **Cursor marketplace** requirements while staying maintainable.
- **Oak curriculum developers** need a coherent, repo-aligned way to work with Oak-specific surfaces (sdk-codegen, curriculum SDK, HTTP MCP server, search SDK, search CLI) and to **run the local dev MCP HTTP server as an MCP server** so agents and IDEs can inspect real data while coding.

**Intent**

1. **Plugin A — Practice for new repos (marketplace track)**  
   A Cursor plugin aimed at **general developers** that packages everything needed to bring the Practice to a **new repository**, including **multi-vendor support** (Clerk, Sentry, Vercel, etc., as defined by the Practice), with manifest and quality gates sufficient for **Cursor marketplace** listing.

2. **Plugin B — Oak developer (local-first)**  
   A Cursor plugin aimed at **developers working with Oak Open Curriculum data** in this repo: how to use codegen, curriculum SDK, HTTP MCP server, search SDK, search CLI, and how to **configure and run the local dev HTTP MCP** for interactive data access during development. **Ship locally** first (e.g. `~/.cursor/plugins/local/...` or repo-adjacent path), **integrate with** existing Practice skills, agents, and rules, and **design for** a future **shared** distribution once workspace packages are published to npm (see [sdk-publishing-and-versioning-plan.md](./sdk-publishing-and-versioning-plan.md)).

**Foundation alignment** (exploration must respect):

- `.agent/directives/principles.md` — strictness, no compatibility layers, schema-first where applicable.
- `.agent/directives/testing-strategy.md` — any automation or validators for plugin manifests should be test-backed where feasible.
- `.agent/directives/schema-first-execution.md` — Oak-facing documentation in Plugin B must not drift from generated types and documented codegen flows.

## 2. Domain boundaries and non-goals

**In scope (exploration)**

- Marketplace **requirements** and **quality gates** for Plugin A (manifest, discovery paths, metadata, review checklist).
- **Component inventory** for both plugins: which rules, skills, agents, commands, hooks, MCP server stubs or docs belong in which plugin.
- **Dependency graph**: Plugin B’s relationship to Plugin A (recommended: Oak plugin **depends on** or **assumes** Practice plugin for shared rules/skills vs duplicating — decision in exploration).
- **Local MCP HTTP** story: documented `pnpm` targets, env expectations, and a **repeatable** Cursor MCP config snippet for this repo’s dev server.
- **Sequencing**: research spikes ordered to reduce rework (marketplace constraints before large content moves).

**Out of scope (for this strategic brief)**

- Actually **scaffolding** or **publishing** either plugin (no `~/.cursor/plugins/local/*` creation until a promoted executable plan).
- **Replacing** repo-root AGENTS.md / CLAUDE.md with plugins-only workflows.
- **Guaranteeing** npm publication timelines (tracked separately; Plugin B “shared” phase gates on publishing work).

## 3. Dependencies and sequencing assumptions

| Dependency | Affects | Notes |
|------------|---------|--------|
| Cursor **marketplace** rules and `plugin.json` schema | Plugin A | Spike: read current Cursor plugin submission docs and `plugin-quality-gates` rule; list blocking vs nice-to-have. |
| **Practice core** layout (`.agent/`, `.cursor/rules`, skills) | Both | Decide what is “core Practice” vs Oak-only; avoid duplicating large trees. |
| **sdk-codegen / build** entrypoints | Plugin B | Skills and commands must reference real scripts (`pnpm sdk-codegen`, etc.). |
| **oak-curriculum-mcp-streamable-http** dev contract | Plugin B | Local MCP HTTP instructions must match app README and e2e/dev contracts. |
| **Search CLI / search SDK** workspaces | Plugin B | Map package names, test commands, and doc entry points. |
| **Publishing** (`sdk-publishing-and-versioning-plan`) | Plugin B future | “Shared plugin” phase assumes installable packages; until then, local-only is explicit. |

**Suggested exploration order**

1. **Marketplace bar for Plugin A** — checklist and gap analysis against current Practice packaging.
2. **Content split** — Practice-only vs Oak-only vs shared; minimise fork drift.
3. **Plugin B local MCP** — single source of truth for “how to run + how to wire Cursor MCP” (link to authoritative app docs).
4. **Integration model** — Plugin B extends Practice (preferred) vs monolithic Oak plugin (only if marketplace duplication is unacceptable).
5. **Future shared distribution** — criteria to promote Plugin B beyond local (npm deps, versioning, support).

## 4. Success signals (justify promotion to `current/`)

- A written **marketplace readiness matrix** for Plugin A with **pass/fail** per requirement and **owner** for each gap.
- A **component manifest** (tables): rules/skills/agents/commands/hooks per plugin; explicit **non-duplication** strategy.
- **Validated** local MCP HTTP instructions (another developer can follow them without repo insider knowledge).
- **Decision record**: dependency model A↔B and migration path when packages hit npm.
- Clear **promotion trigger** (below) agreed with engineering owner.

## 5. Risks and unknowns

| Risk | Mitigation |
|------|------------|
| Marketplace rules change or are underspecified | Early spike against official checklist; pin references in plan archive. |
| Practice + Oak content duplication | Prefer layering (B depends on A) and thin Oak-specific overlay. |
| Local MCP wiring differs by OS or Cursor version | Document minimum versions; test on two setups during promotion. |
| Publishing delays block “shared” Plugin B | Keep local-first scope; defer npm coupling to explicit phase. |
| Skills reference stale commands | Bind verification to `package.json` scripts and CI smoke where possible. |

## 6. Promotion trigger into `current/`

Promote when **all** hold:

1. Marketplace gap analysis for Plugin A is **complete** and **reviewed** (plugin-architect or equivalent).
2. Component split and dependency model **A↔B** are **decided** and written down.
3. Owner accepts **scope** for first executable slice (e.g. “Plugin A MVP marketplace submit” or “Plugin B local-only v0.1”).
4. **Non-goals** for the first executable plan are explicit (YAGNI).

## 7. Metacognition (bridge from action to impact)

**Impact sought:** faster, safer onboarding for external repos (Practice) and for Oak curriculum engineering (data-aware dev with MCP), without fragmenting governance or duplicating the Practice.

**Reflection:** Two plugins reduce the temptation to ship Oak-only concerns into a marketplace “generic” bundle; the main tension is **layering vs two independent installs** — resolving that early avoids rework.

**What would change approach:** If marketplace policy **requires** a single plugin per publisher topic, adjust to **one plugin with optional Oak component paths** and document activation — but only if evidence from the marketplace spike supports it.

## 8. Learning loop

On completion of any promoted executable workstream: run `/jc-consolidate-docs`, update [documentation-sync-log.md](../documentation-sync-log.md), and add outcomes to [completed-plans.md](../../completed-plans.md) when archived.

## 9. References

- ADR-117: plan templates and components — `docs/architecture/architectural-decisions/117-plan-templates-and-components.md`
- SDK publishing / future shared distribution — [sdk-publishing-and-versioning-plan.md](./sdk-publishing-and-versioning-plan.md)
- **Cursor create-plugin plugin** (marketplace / `cursor-public`): not only the scaffold skill — the installed bundle includes **agents**, **skills**, and **rules** that should be used when this work is promoted to execution:
  - **Agent `plugin-architect`** (`agents/plugin-architect.md`) — component mix (`rules`, `skills`, `agents`, `commands`, `hooks`, `mcpServers`), layout, manifest shape, discoverability, implementation checklist; default output `~/.cursor/plugins/local/<plugin-name>/`.
  - **Skills**: `create-plugin-scaffold` (scaffold new plugin), `review-plugin-submission` (marketplace readiness audit).
  - **Rules**: `plugin-quality-gates.mdc` — manifest paths, component metadata, submission quality.
  - Paths on disk follow Cursor’s plugin cache layout, e.g. `~/.cursor/plugins/cache/cursor-public/create-plugin/<revision>/` (revision hash varies after updates).
- Repo engineering gates — `docs/engineering/build-system.md`
