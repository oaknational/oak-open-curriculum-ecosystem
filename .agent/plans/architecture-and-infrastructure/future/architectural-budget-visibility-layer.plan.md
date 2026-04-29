---
name: "Architectural Budget Visibility Layer"
overview: "Strategic plan for read-only repo-wide architecture metrics that feed budget decisions before enforcement."
todos:
  - id: baseline-contract
    content: "Define the read-only metric contract, exclusions, consumers, and output location."
    status: pending
  - id: workspace-and-directory-metrics
    content: "Capture workspace file counts, source lines, crowded directories, exports, and nested package markers."
    status: pending
  - id: graph-and-api-metrics
    content: "Capture dependency fan-in/fan-out, forbidden edges, cycles, orphans, and public API exposure."
    status: pending
  - id: consumer-routing
    content: "Route findings to workspace audit, directory-cardinality, or enforcement child plans."
    status: pending
---

# Architectural Budget Visibility Layer

**Last Updated**: 2026-04-29
**Status**: Strategic brief, not executable
**Lane**: `future/`
**Parent**:
[Architectural Budget System Across Scales](architectural-budget-system-across-scales.plan.md)
**ADR**:
[ADR-166](../../../../docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md)

## Intent

Create a read-only visibility layer for architectural budget signals before
any new checks become blocking gates.

The visibility layer exists to answer: where is complexity concentrating, at
which scale, and which existing plan should own the response?

## Named Consumers

| Consumer | Trigger | Uses |
|---|---|---|
| Workspace layer separation audit | Phase 1 and Phase 2 classification | Workspace/layer pressure and tranche slicing |
| Directory complexity enablement | Phase 0 baseline refresh | Crowded directories and inventory design |
| Enforcement layer plan | Promotion from future to current | Deterministic failure cases and allowlists |
| Quality gate hardening | Before any gate promotion | Surface mapping and non-zero failure proof |

If a metric has no named consumer, it must not be added.

When promoted, the first executable slice must serve one named consumer trigger
only. The plan can expand after that consumer has used the report and recorded
the disposition.

## Metric Contract

The visibility report should capture:

- workspace source file counts and source lines
- largest authored directories by file count
- package export count and export shape
- public wildcard export surfaces
- cross-workspace internal or deep import candidates
- internal `@oaknational/*` dependency fan-in and fan-out
- dependency-cruiser cycles, forbidden edges, and orphans
- nested `package.json` markers, with fixture/generated disposition
- generated, fixture, cache, declaration, and documentation exclusions

Every generated report must include:

- command and version used to produce it
- git SHA
- timestamp
- exclusions version
- output path
- owning consumer plan and phase

The report must separate:

- enforced failures from existing gates
- visible-only pressure signals
- future enforcement candidates

## Non-Goals

- No blocking checks.
- No threshold selection before baseline data exists.
- No dashboard or new tool if a simple generated report is sufficient.
- No duplicate layer/workspace matrix outside the workspace audit plan.

## Promotion Trigger

Promote this plan to `current/` when either:

1. the workspace layer separation audit needs repo-wide budget evidence for
   tranche slicing, or
2. the owner asks to begin enforcing a new budget scale.

Execution decisions are finalised only during promotion.

## Validation Expectations

When promoted, the executable plan must prove:

- the report is deterministic and sorted
- exclusions are explicit and reviewed
- existing gate failures are not hidden as informational metrics
- every metric appears in at least one consumer section
- every consumer citation names the report version it used
- the owning consumer plan is updated, or records an explicit no-op rationale
- no repo-tracked file is rewritten unless the command is explicitly a report
  generation step in the executable plan

## Review Cadence

- Before implementation: `assumptions-reviewer`, `config-reviewer`,
  `architecture-reviewer-betty`
- After report contract design: `test-reviewer`, `config-reviewer`
- Before completion: `code-reviewer`, `docs-adr-reviewer`,
  `architecture-reviewer-wilma`
