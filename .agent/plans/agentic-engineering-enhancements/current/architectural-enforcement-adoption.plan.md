---
name: Architectural Enforcement Adoption
overview: >
  Apply the Architectural Enforcement Playbook to the repository to prevent
  monolith decay and enforce domain boundaries using ESLint constraints,
  dependency-cruiser, and knip. Directory-complexity-related execution now
  lives in the canonical developer-experience enablement plan.
todos:
  - id: eslint-strict-completion
    content: "Complete ESLint strict enforcement (Phase 0): resolve remaining lint errors."
    status: pending
  - id: baseline-lint-rules
    content: "Export and wire existing 'max-files-per-dir' rule with a calibrated threshold. (Execution delegated to the canonical directory-complexity plan.)"
    status: pending
  - id: boundary-configuration
    content: "Configure boundary enforcement per the canonical import matrix (ADR-041). (Execution delegated to devx strictness convergence.)"
    status: pending
  - id: depcruise-lockdown
    content: "Initialize .dependency-cruiser.cjs with mandatory index.ts barrel enforcement. (Execution delegated to the canonical directory-complexity plan.)"
    status: pending
  - id: knip-integration
    content: "Configure knip to detect dead code and unused exports across workspaces. (Execution delegated to the canonical directory-complexity plan.)"
    status: pending
  - id: turbo-qg-unification
    content: "Update turbo.json and root package.json to include 'pnpm qg' as a combined task. (Execution delegated to the canonical directory-complexity plan.)"
    status: pending
  - id: agent-directive-grounding
    content: "Create .agent/directives/architectural-enforcement.md and ground all agents. (Strictness subset delegated to devx strictness; directory-complexity subset delegated to the canonical directory-complexity plan.)"
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
- [Augmented Engineering Practices (industry evidence)](../augmented-engineering-practices.research.md) (verification gaps, quality gates, mutation testing)
- [Evidence Bundle Template](../evidence-bundle.template.md) (for non-trivial enforcement claims and merge-readiness evidence)

**Related plans**:

- [Cross-Agent Standardisation](cross-agent-standardisation.plan.md) (separated concern — portability and platform-agnostic alignment)
- [Hallucination and Evidence Guard Adoption](hallucination-and-evidence-guard-adoption.plan.md) (claim integrity and evidence policy)

### Execution Role

This is a strategic source plan (intent, constraints, and phase design). The
authoritative execution tasks for this stream live in:

- [phase-3-architectural-enforcement-execution.md](../active/phase-3-architectural-enforcement-execution.md)

### Convergence Update (2026-03-04)

Directory-complexity-related enforcement work is now split by disruption profile:

1. **Integrated in canonical strictness plan**:
   - `no-console` convergence
   - canonical execution: [devx-strictness-convergence.plan.md](../../developer-experience/active/devx-strictness-convergence.plan.md)
2. **Canonicalised in the queued directory-complexity plan**:
   - remediation SOP for directory-complexity breaches
   - structural guardrails required before `max-files-per-dir`
   - depcruise, knip, and qg-level integration for this workstream
   - staged `max-files-per-dir` activation
   - canonical execution: [directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md)
3. **Retained here as strategic intent only**:
   - rationale for physical constraints and success metrics
   - phase design context for the wider architectural-enforcement stream

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

### Phase 1: Physical Modularity (ESLint, deferred)

- **Goal:** Break up "God Folders."
- **Execution source:** [directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md)
- **Status:** queued there as the canonical execution source of truth.

### Phase 2: Boundary Definition (ESLint)

- **Precursor:** The [SDK workspace separation](../../semantic-search/archive/completed/sdk-workspace-separation.md) (archived)
  plan implements targeted SDK boundary rules (`createSdkBoundaryRules()` in
  `boundary.ts`) enforcing the sdks DAG constraint for the generation/runtime
  split. These should integrate with the broader layer enforcement when
  `eslint-plugin-boundaries` is adopted.
- **Goal:** Define semantic layers and enforce unidirectional flow.
- **Execution source:** [directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md)
- **Execution status:** implementation detail now lives in the canonical queued plan so the supporting-constraint bundle is described once.
- **Follow-up (from canonical URL work):** Route search-CLI SDK imports through a curriculum-sdk facade instead of importing directly from `@oaknational/sdk-codegen/api-schema`. Currently `apps/oak-search-cli` imports `generateCanonicalUrlWithContext` from `sdk-codegen` directly, bypassing the curriculum-sdk domain layer. Betty flagged this as a boundary hygiene concern during the canonical URL architecture review.

| Importer | core | libs | sdks | apps | Constraint |
|----------|------|------|------|------|------------|
| core     | —    | no   | no   | no   | Must remain domain-agnostic |
| libs     | yes  | —    | no   | no   | — |
| sdks     | yes  | yes  | DAG  | no   | No circular SDK-to-SDK dependencies |
| apps     | yes  | yes  | yes  | —    | — |

### Phase 3: Physics Lockdown (Dependency-Cruiser)

- **Goal:** Enforce barrel-file (index.ts) encapsulation.
- **Execution source:** [directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md)
- **Rule intent:** Disallow importing internals of a sibling directory; all traffic must traverse `index.ts`.

### Phase 4: Hygiene and Dead Code (Knip)

- **Goal:** Keep the "surface area" of the SDK and MCP servers minimal.
- **Execution source:** [directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md)

### Phase 5: Agentic Grounding

- **Goal:** Make the "First Question" mechanical for AI agents.
- **Execution source:** [directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md)
- **Requirement:** `pnpm qg` MUST be run before any PR or merge-ready state. The qg path should include the selected structural checks as that plan lands them.
- **Evidence requirement:** Any non-trivial enforcement claim (boundary correctness, dead-code elimination, import-flow safety) MUST include an evidence bundle using [Evidence Bundle Template](../evidence-bundle.template.md).
- **Execution status:** split-guidance/rules updates delegated to canonical strictness convergence; depcruise/knip/qg grounding remains in this stream.

## 3. Documentation Propagation Requirement

Apply the shared documentation-propagation contract:

- [Documentation Propagation component](../templates/components/documentation-propagation.md)
- [documentation-sync-log.md](documentation-sync-log.md) (collection tracking)

## 4. Success Metrics

- Zero circular dependencies (via the structural graph check(s) selected in the canonical directory-complexity plan).
- No source directory contains more than the configured threshold of files (excluding tests).
- All inter-package and inter-domain imports are routed through `index.ts`.
- `knip` reports zero unused exports.
