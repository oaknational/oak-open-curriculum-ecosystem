---
name: Architectural Enforcement Adoption
overview: >
  Apply the Architectural Enforcement Playbook to the repository to prevent
  monolith decay and enforce domain boundaries using ESLint constraints,
  dependency-cruiser, and knip.
todos:
  - id: eslint-strict-completion
    content: "Complete ESLint strict enforcement (Phase 0): resolve remaining lint errors."
    status: pending
  - id: baseline-lint-rules
    content: "Export and wire existing 'max-files-per-dir' rule; set threshold to 10."
    status: pending
  - id: boundary-configuration
    content: "Configure 'eslint-plugin-boundaries' per the canonical import matrix (ADR-041)."
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
---

# Architectural Enforcement Adoption

## 1. Intent

Harden the repository against architectural decay by moving from **prescriptive guidance** to **physical constraints**. This ensures that both human developers and AI agents are forced to maintain a clean, modular structure.

This plan implements the architectural enforcement direction established in:

- [ADR-119: Agentic Engineering Practice](../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) (establishes physical constraints as a core philosophical commitment)
- [ADR-041: Workspace Structure Option A](../../../docs/architecture/architectural-decisions/041-workspace-structure-option-a.md) (defines workspace layout and dependency direction)

See also: [Architecture README](../../../docs/architecture/README.md) for the canonical architecture overview.

Based on requirements and analysis in:

- [Architectural Enforcement Playbook](../../research/developer-experience/architectural-enforcement-playbook.md)
- [Augmented Engineering Practices (industry evidence)](augmented-engineering-practices.research.md) (verification gaps, quality gates, mutation testing)

**Related plan**: [Cross-Agent Standardisation](cross-agent-standardisation.plan.md) (separated concern — portability and platform-agnostic alignment).

## 2. Phases

### Phase 0: ESLint Strict Enforcement Completion (Prerequisite)

- **Goal:** Complete the ESLint centralisation already in progress.
- **Current state:** ESLint centralisation Phases 1-4 are complete (plugin
  created, all workspaces migrated, legacy configs deleted). Phase 5
  (strict enforcement) is partially done — all packages use `strict`
  config but persistent lint errors remain in `streamable-http` and
  `semantic-search`.
- **Task:** Resolve remaining lint errors in `streamable-http` and
  `semantic-search`. Verify `pnpm lint` passes cleanly across the
  monorepo.

### Phase 1: Physical Modularity (ESLint)

- **Goal:** Break up "God Folders."
- **Current state:** The `max-files-per-dir` rule already exists at
  `packages/core/oak-eslint/src/rules/max-files-per-dir.ts` with tests,
  but is NOT exported from the plugin index and NOT included in any
  config. The plugin index currently exports only
  `no-export-trivial-type-aliases`.
- **Task:** Export the rule from the plugin, include it in the `strict`
  config, audit existing directories for threshold breaches, and resolve
  violations by structural refactoring.
- **Target:** Root `eslint.config.ts` to apply this rule to all workspaces.

### Phase 2: Boundary Definition (ESLint)

- **Precursor:** The [SDK workspace separation](../semantic-search/active/sdk-workspace-separation.md)
  plan implements targeted SDK boundary rules (`createSdkBoundaryRules()` in
  `boundary.ts`) enforcing the sdks DAG constraint for the generation/runtime
  split. These should integrate with the broader layer enforcement when
  `eslint-plugin-boundaries` is adopted.
- **Goal:** Define semantic layers and enforce unidirectional flow.
- **Task:** Configure `eslint-plugin-boundaries` using the canonical import matrix:

| Importer | core | libs | sdks | apps | Constraint |
|----------|------|------|------|------|------------|
| core     | —    | no   | no   | no   | Must remain domain-agnostic |
| libs     | yes  | —    | no   | no   | — |
| sdks     | yes  | yes  | DAG  | no   | No circular SDK-to-SDK dependencies |
| apps     | yes  | yes  | yes  | —    | — |

### Phase 3: Physics Lockdown (Dependency-Cruiser)

- **Goal:** Enforce barrel-file (index.ts) encapsulation.
- **Task:** Configure `dependency-cruiser` at the root and for key packages.
- **Rule:** Disallow importing internals of a sibling directory; all traffic must traverse `index.ts`.

### Phase 4: Hygiene and Dead Code (Knip)

- **Goal:** Keep the "surface area" of the SDK and MCP servers minimal.
- **Task:** Add `knip` to the CI pipeline and root quality gate.

### Phase 5: Agentic Grounding

- **Goal:** Make the "First Question" mechanical for AI agents.
- **Task:** Create `.agent/directives/architectural-enforcement.md` and update `AGENT.md` to reference it.
- **Requirement:** `pnpm qg` MUST be run before any PR or merge-ready state. The `qg` script must be updated to include `depcruise` and `knip` as each phase lands.

## 3. Success Metrics

- Zero circular dependencies (via `madge` and `depcruise`).
- No source directory contains more than the configured threshold of files (excluding tests).
- All inter-package and inter-domain imports are routed through `index.ts`.
- `knip` reports zero unused exports.
