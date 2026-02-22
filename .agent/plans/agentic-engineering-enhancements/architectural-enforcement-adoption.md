---
name: Architectural Enforcement Adoption
overview: >
  Apply the Architectural Enforcement Playbook to the repository to prevent
  monolith decay and enforce domain boundaries using ESLint constraints,
  dependency-cruiser, and knip.
todos:
  - id: baseline-lint-rules
    content: "Implement 'max-files-per-dir' ESLint rule and set threshold to 10."
    status: pending
  - id: boundary-configuration
    content: "Configure 'eslint-plugin-boundaries' to define core/sdk/app unidirectional flow."
    status: pending
  - id: depcruise-lockdown
    content: "Initialize .dependency-cruiser.cjs with mandatory index.ts barrel enforcement."
    status: pending
  - id: knip-integration
    content: "Configure knip to detect dead code and unused exports across workspaces."
    status: pending
  - id: turbo-qg-unification
    content: "Update turbo.json and root package.json to include 'pnpm qg' as a combined task."
    status: pending
  - id: agent-directive-grounding
    content: "Create .agent/directives/architectural-enforcement.md and ground all agents."
    status: pending
  - id: cross-agent-standardisation
    content: "Align skills and commands with AGENTS.md and Agent Skills specifications."
    status: pending
---

# Architectural Enforcement Adoption Plan

## 1. Intent

Harden the repository against architectural decay by moving from **prescriptive guidance** to **physical constraints**. This ensures that both human developers and AI agents are forced to maintain a clean, modular structure. Additionally, align the repository with emerging cross-agent standards to ensure portability and reduce maintenance entropy.

This plan implements the principles and structural requirements defined in:
- [ADR-119: Agentic Engineering Practice](../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)

## 2. Phases

### Phase 1: Physical Modularity (ESLint)
- **Goal:** Break up "God Folders."
- **Task:** Implement the `max-files-per-dir` custom rule (as defined in the playbook) in `packages/core/oak-eslint`.
- **Target:** Root `eslint.config.ts` to apply this rule to all workspaces.

### Phase 2: Boundary Definition (ESLint)
- **Goal:** Define semantic layers and enforce unidirectional flow.
- **Task:** Configure `eslint-plugin-boundaries`.
- **Layers:** `core` -> `libs` -> `sdks` -> `apps`.

### Phase 3: Physics Lockdown (Dependency-Cruiser)
- **Goal:** Enforce barrel-file (index.ts) encapsulation.
- **Task:** Configure `dependency-cruiser` at the root and for key packages.
- **Rule:** Disallow importing internals of a sibling directory; all traffic must traverse `index.ts`.

### Phase 4: Hygiene and Dead Code (Knip)
- **Goal:** Keep the "surface area" of the SDK and MCP servers minimal.
- **Task:** Add `knip` to the CI pipeline and root quality gate.

### Phase 5: Cross-Agent Standardisation Alignment
- **Goal:** Ensure portability across Cursor, Claude Code, Gemini CLI, and others.
- **Task 1: Skill Frontmatter:** Normalise `SKILL.md` frontmatter to use `metadata:` block for non-standard fields (`version`, `date`).
- **Task 2: Command Portability:** Extract canonical instruction content from `.cursor/commands/` and `.claude/commands/` into agent-agnostic `.agent/commands/*.md` templates.
- **Task 3: YAGNI Cleanup:** Delete speculative `openai.yaml` stubs in `.agent/skills/`.
- **Task 4: Workspace Context:** Add nested `AGENTS.md` files for high-complexity workspaces (e.g., streamable-http) to provide targeted per-package context.

### Phase 6: Agentic Grounding
- **Goal:** Make the "First Question" mechanical for AI agents.
- **Task:** Create `.agent/directives/architectural-enforcement.md` and update `AGENT.md` to reference it.
- **Requirement:** `pnpm qg` MUST be run before any PR or merge-ready state.

## 3. Success Metrics
- Zero circular dependencies (via `madge` and `depcruise`).
- No source directory contains more than 10 files (excluding tests).
- All inter-package and inter-domain imports are routed through `index.ts`.
- `knip` reports zero unused exports.
- All `SKILL.md` files are 100% compliant with the `agentskills.io` specification.
- Zero duplication of instruction logic between platform-specific command files.
