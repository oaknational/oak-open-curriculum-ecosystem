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
    content: "Export and wire existing 'max-files-per-dir' rule with a calibrated threshold. (Execution delegated to the directory-cardinality child plan.)"
    status: pending
  - id: boundary-configuration
    content: "Configure boundary enforcement per the canonical import matrix (ADR-041). (Execution delegated to devx strictness convergence.)"
    status: pending
  - id: depcruise-lockdown
    content: "Retained as historical intent: dependency-cruiser now lives in .dependency-cruiser.mjs and the root gate path; package API enforcement moves to ADR-166 future enforcement."
    status: completed
  - id: knip-integration
    content: "Retained as historical intent: knip is already configured and promoted; future budget work consumes its findings rather than replanning it."
    status: completed
  - id: turbo-check-unification
    content: "Retained as historical intent: pnpm check is already the aggregate path; future budget enforcement must promote new checks through ADR-121."
    status: completed
  - id: agent-directive-grounding
    content: "Create .agent/directives/architectural-enforcement.md and ground all agents. (Strictness subset delegated to devx strictness; directory-cardinality subset delegated to the child plan.)"
    status: pending
---

# Architectural Enforcement Adoption

## 1. Intent

Harden the repository against architectural decay by moving from **prescriptive guidance** to **physical constraints**. This ensures that both human developers and AI agents are forced to maintain a clean, modular structure.

This plan implements the architectural enforcement direction established in:

- [ADR-119: Agentic Engineering Practice](../../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) (establishes physical constraints as a core philosophical commitment)
- [ADR-041: Workspace Structure Option A](../../../../docs/architecture/architectural-decisions/041-workspace-structure-option-a.md) (defines workspace layout and dependency direction)

See also: [Architecture README](../../../../docs/architecture/README.md) for the canonical architecture overview.

Based on requirements and analysis in:

- [Architectural Enforcement Playbook](../../../research/developer-experience/architectural-enforcement-playbook.md)
- [Augmented Engineering Practices (industry evidence)](../augmented-engineering-practices.research.md) (verification gaps, quality gates, mutation testing)
- [Evidence Bundle Template](../evidence-bundle.template.md) (for non-trivial enforcement claims and merge-readiness evidence)

**Related plans**:

- [Cross-Agent Standardisation](../archive/completed/cross-agent-standardisation.plan.md) (separated concern — portability and platform-agnostic alignment)
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
   - deterministic inventory and config tests for `max-files-per-dir`
   - pilot calibration and staged directory-cardinality activation
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
- **Execution source:** [devx-strictness-convergence.plan.md](../../developer-experience/active/devx-strictness-convergence.plan.md) for existing ESLint boundary work; future package API and deep-import checks route through [architectural-budget-enforcement-layer.plan.md](../../architecture-and-infrastructure/future/architectural-budget-enforcement-layer.plan.md).
- **Execution status:** directory-cardinality work is not the owner for this
  boundary lane.
- **Follow-up (from canonical URL work):** Route search-CLI SDK imports through a curriculum-sdk facade instead of importing directly from `@oaknational/sdk-codegen/api-schema`. Currently `apps/oak-search-cli` imports `generateCanonicalUrlWithContext` from `sdk-codegen` directly, bypassing the curriculum-sdk domain layer. Betty flagged this as a boundary hygiene concern during the canonical URL architecture review.

| Importer | core | libs | sdks | apps | Constraint |
|----------|------|------|------|------|------------|
| core     | —    | no   | no   | no   | Must remain domain-agnostic |
| libs     | yes  | —    | no   | no   | — |
| sdks     | yes  | yes  | DAG  | no   | No circular SDK-to-SDK dependencies |
| apps     | yes  | yes  | yes  | —    | — |

### Phase 3: Physics Lockdown (Dependency-Cruiser)

- **Goal:** Keep the dependency graph free from cycles, orphans, and forbidden
  layer-direction edges.
- **Execution source:** completed dependency-cruiser child plan:
  [depcruise-triage-and-remediation.plan.md](../../architecture-and-infrastructure/current/depcruise-triage-and-remediation.plan.md).
- **Rule intent:** dependency-cruiser owns graph shape. Package API, barrel,
  and deep-import enforcement are future ADR-166 enforcement-layer concerns,
  not directory-cardinality execution.

### Phase 4: Hygiene and Dead Code (Knip)

- **Goal:** Keep the "surface area" of the SDK and MCP servers minimal.
- **Execution source:** completed quality-gate hardening child:
  [knip-triage-and-remediation.plan.md](../../architecture-and-infrastructure/archive/completed/knip-triage-and-remediation.plan.md).

### Phase 5: Agentic Grounding

- **Goal:** Make the "First Question" mechanical for AI agents.
- **Execution source:** [quality-gate-hardening.plan.md](../../architecture-and-infrastructure/current/quality-gate-hardening.plan.md) for gate surfaces and [architectural-budget-system-across-scales.plan.md](../../architecture-and-infrastructure/future/architectural-budget-system-across-scales.plan.md) for future budget doctrine.
- **Requirement:** `pnpm check` MUST be run before any PR or merge-ready
  state. Future structural checks must enter that path only through their
  owning gate-promotion plans.
- **Evidence requirement:** Any non-trivial enforcement claim (boundary correctness, dead-code elimination, import-flow safety) MUST include an evidence bundle using [Evidence Bundle Template](../evidence-bundle.template.md).
- **Execution status:** split-guidance/rules updates delegated to canonical
  strictness convergence; depcruise, knip, and `pnpm check` are already live
  gate foundations. Future package API enforcement is routed through ADR-166.

## 3. Documentation Propagation Requirement

Apply the shared documentation-propagation contract:

- [Documentation Propagation component](../../templates/components/documentation-propagation.md)
- [documentation-sync-log.md](../documentation-sync-log.md) (collection tracking)

## 4. Success Metrics

- Dependency-cruiser reports zero circular dependencies and zero orphans.
- The directory-cardinality child proves configured `max-files-per-dir`
  activation without silent inventory no-ops.
- Future package API and deep-import checks route through ADR-166's
  enforcement layer.
- `knip` remains clean under the promoted root gate.
