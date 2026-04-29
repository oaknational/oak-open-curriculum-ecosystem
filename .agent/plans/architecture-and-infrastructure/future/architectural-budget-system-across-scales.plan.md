---
name: "Architectural Budget System Across Scales"
overview: "Strategic parent for cross-scale architectural bounds, visibility, and staged enforcement without duplicating the workspace layer-separation programme."
todos:
  - id: doctrine-and-scale-model
    content: "Keep ADR-166, the scale model, and anti-gaming rules aligned with live implementation evidence."
    status: pending
  - id: visibility-layer
    content: "Promote the visibility-layer plan once the workspace audit or owner direction needs repo-wide budget metrics."
    status: pending
  - id: directory-cardinality-child
    content: "Use the developer-experience directory-cardinality plan as the executable child for max-files-per-dir."
    status: pending
  - id: enforcement-layer
    content: "Promote the enforcement-layer plan only after visibility, remediation paths, and gate failure modes are deterministic."
    status: pending
---

# Architectural Budget System Across Scales

**Last Updated**: 2026-04-29
**Status**: Strategic brief, not executable
**Lane**: `future/`
**ADR**:
[ADR-166](../../../../docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md)

## Role

This plan is the strategic parent for architectural budgets as visibility and
fitness signals across scales. It is a companion lens, not a replacement for
the existing layer-separation programme.

Authoritative ownership remains split deliberately:

- Layer topology and migration tranches:
  [Oak surface isolation and generic foundation programme](oak-surface-isolation-and-generic-foundation-programme.plan.md)
- Repo-wide layer/workspace audit:
  [workspace-layer-separation-audit.plan.md](../current/workspace-layer-separation-audit.plan.md)
- Directory-cardinality execution:
  [directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md)
- Quality-gate promotion:
  [quality-gate-hardening.plan.md](../current/quality-gate-hardening.plan.md)

## Intent

Function, file, directory, workspace, package API, and dependency-graph checks
must reinforce each other. Complexity reduced at one scale must not simply move
to the next scale up or sideways into a proxy workspace.

Budgets are architectural bounds, not tolerated debt. Existing blocking gates
remain hard gates. New diagnostic layers start as visibility reports and only
become enforcement when they have a deterministic failure mode and a proven
structural response.

## Domain Boundaries

In scope:

- cross-scale vocabulary and sequencing
- visibility-before-enforcement doctrine
- anti-gaming rules for artificial splits and proxy APIs
- child-plan routing for directory, workspace, package API, and graph work
- reviewer cadence for planning and later implementation

Out of scope:

- enabling new checks in this strategic plan
- choosing numeric thresholds before baseline evidence
- moving product code or splitting workspaces
- updating ADR-121 as though unenforced checks already run

## Child Plans

| Child | Lane | Role | Promotion trigger |
|---|---|---|---|
| [Architectural budget visibility layer](architectural-budget-visibility-layer.plan.md) | `future/` | Baseline repo-wide metrics and named consumers | Workspace audit or owner direction needs budget evidence |
| [Architectural budget enforcement layer](architectural-budget-enforcement-layer.plan.md) | `future/` | Stage future checks into `pnpm check`, hooks, and CI | Visibility baseline and remediation plans are complete |
| [Directory complexity enablement](../../developer-experience/current/directory-complexity-enablement.execution.plan.md) | `current/` | Execute the directory-cardinality budget via `max-files-per-dir` | Developer-experience lane starts implementation |
| [Workspace layer separation audit](../current/workspace-layer-separation-audit.plan.md) | `current/` | Own workspace/layer matrix and migration-map evidence | Already queued as the architecture P0 |

## Review Cadence

Planning-session reviews:

- before edits: `assumptions-reviewer`, `docs-adr-reviewer`,
  `architecture-reviewer-fred`, `architecture-reviewer-betty`,
  `config-reviewer`
- after ADR changes: `docs-adr-reviewer`, `architecture-reviewer-fred`
- after plan/index changes: `assumptions-reviewer`,
  `architecture-reviewer-barney`
- after visibility/enforcement plan changes: `config-reviewer`,
  `test-reviewer`
- before completion: `code-reviewer`, `docs-adr-reviewer`,
  `assumptions-reviewer`, and an adversarial pass from
  `architecture-reviewer-wilma`

Later complexity implementation reviews:

- baseline/visibility phase: `config-reviewer`, `test-reviewer`,
  `architecture-reviewer-betty`
- pre-enforcement phase: `assumptions-reviewer`,
  `architecture-reviewer-wilma`, `release-readiness-reviewer`
- post-enforcement phase: `code-reviewer`, `docs-adr-reviewer`,
  `config-reviewer`, `test-reviewer`

## Success Signals

- ADR-166 remains conceptual and does not duplicate executable thresholds.
- The visibility plan names consumers and triggers for every report.
- The enforcement plan names deterministic failing cases before any promotion.
- Directory-cardinality work is a child of the budget system, not its whole
  source of truth.
- Quality-gate documentation changes only when a check actually runs on a
  gate surface.

## Documentation Propagation

This strategic parent intentionally does not update these Practice doctrine
surfaces directly:

- ADR-119: no change, because this pass does not change the agentic practice.
- ADR-124: no change, because this pass does not change propagation mechanics.
- `.agent/practice-core/practice.md`: no change, because this is repo-specific
  architecture doctrine.

Required propagation when child work is promoted:

- update ADR-121 and build-system docs only for newly enforced gates
- update architecture and developer-experience indexes when lane state changes
- run consolidation after enforcement doctrine becomes settled

## Risks

| Risk | Mitigation |
|---|---|
| Budget language implies allowed violations | ADR-166 defines budgets as bounds and hard gates where enforced |
| Duplicate owner for layer separation | This plan links to, and does not replace, the existing programme |
| Passive visibility reports decay | Each report must name a consumer, trigger, and promotion path |
| Metrics cause artificial splits | Anti-gaming rules require capability boundaries and one-way dependencies |
| Enforcement lands before remediation | Enforcement plan remains future until visibility and remediation complete |
