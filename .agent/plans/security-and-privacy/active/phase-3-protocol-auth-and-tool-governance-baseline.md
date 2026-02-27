---
name: "Phase 3 - Protocol, Auth, and Tool Governance Baseline"
overview: >
  Convert research controls for protocol strictness, authentication/
  authorisation, and tool governance into an executable baseline plan for
  implementation work.
todos:
  - id: p3-control-scope
    content: "Scope baseline controls for protocol validation, authn/authz, and tool governance."
    status: pending
  - id: p3-validation-map
    content: "Define deterministic validation commands for each baseline control family."
    status: pending
  - id: p3-owner-mapping
    content: "Map controls to repository ownership surfaces and implementation order."
    status: pending
  - id: p3-cut-list
    content: "Produce implementation cut list for first non-planning execution tranche."
    status: pending
  - id: p3-doc-sync
    content: "Update documentation sync log with Phase 3 impacts and rationale."
    status: pending
isProject: false
---

# Phase 3 - Protocol, Auth, and Tool Governance Baseline

## Source Strategy

- [roadmap.md](../roadmap.md)
- [developing-secure-mcp-servers.research.md](../developing-secure-mcp-servers.research.md)
- [phase-3-baseline-control-cut-list.md](../phase-3-baseline-control-cut-list.md)
- [deferred-controls-register.md](../deferred-controls-register.md)

## Scope Boundary

This phase establishes executable baseline controls for:

- protocol and schema validation
- authentication and authorisation pathways
- tool governance and integrity controls

Low-priority items remain deferred and are tracked only as notes:

- sandboxing expansion
- prompt-injection automation

## Atomic Tasks

### Task 3.1: Control Baseline Definition

- Output:
  - control baseline covering Sections 6.1, 6.2, and 6.3 of the research report
    in `phase-3-baseline-control-cut-list.md`
- Deterministic validation:
  - `rg -n "6\.1 Protocol|6\.2 Authentication|6\.3 Tool governance" .agent/plans/security-and-privacy/developing-secure-mcp-servers.research.md`
  - `test -f .agent/plans/security-and-privacy/phase-3-baseline-control-cut-list.md`
  - `rg -n "Implementation Tranche 1|Deterministic Validation Map" .agent/plans/security-and-privacy/phase-3-baseline-control-cut-list.md`

### Task 3.2: Deterministic Validation Map

- Output:
  - command-level validation mapping for each baseline control class
- Deterministic validation:
  - `rg -n "Deterministic validation" .agent/plans/security-and-privacy/active/phase-3-protocol-auth-and-tool-governance-baseline.md`

### Task 3.3: Ownership and Implementation Order

- Output:
  - mapping of control families to implementation surfaces (`apps/`, `packages/sdks/`, directives/CI)
- Deterministic validation:
  - `rg -n "apps/|packages/sdks/|directives|CI" .agent/plans/security-and-privacy/*.md .agent/plans/security-and-privacy/active/*.md`

### Task 3.4: Implementation Cut List

- Output:
  - first execution tranche with atomic implementation slices and dependency order
    in `phase-3-baseline-control-cut-list.md`
- Deterministic validation:
  - `rg -n "first implementation slices|cut list|dependency" .agent/plans/security-and-privacy/developing-secure-mcp-servers.research.md .agent/plans/security-and-privacy/active/phase-3-protocol-auth-and-tool-governance-baseline.md`
  - `rg -n "Deferred Controls|Trigger to Promote" .agent/plans/security-and-privacy/deferred-controls-register.md`

### Task 3.5: Documentation Synchronisation

- Output:
  - Phase 3 entry updated in `documentation-sync-log.md`
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 3|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/security-and-privacy/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

## Done When

1. Protocol/auth/tool-governance baseline controls are mapped to execution.
2. Deterministic validation commands are defined per control class.
3. First implementation tranche is explicit and dependency ordered.
4. Documentation sync entry is complete for Phase 3.
