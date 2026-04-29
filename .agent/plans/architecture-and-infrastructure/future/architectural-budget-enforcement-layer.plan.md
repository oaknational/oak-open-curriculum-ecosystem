---
name: "Architectural Budget Enforcement Layer"
overview: "Strategic plan for promoting calibrated architecture-budget checks into blocking quality-gate surfaces."
todos:
  - id: preconditions
    content: "Require visibility baseline, remediation plans, and hook/CI failure-mode proof before promotion."
    status: pending
  - id: package-api-contract
    content: "Define strict package export and deep-import enforcement without breaking current public wildcard exports silently."
    status: pending
  - id: workspace-anti-gaming-contract
    content: "Define enforcement for nested package markers, proxy packages, and artificial workspace splits."
    status: pending
  - id: gate-promotion
    content: "Stage each check through pnpm check, hooks, CI, ADR-121, and build-system docs together."
    status: pending
---

# Architectural Budget Enforcement Layer

**Last Updated**: 2026-04-29
**Status**: Strategic brief, not executable
**Lane**: `future/`
**Parent**:
[Architectural Budget System Across Scales](architectural-budget-system-across-scales.plan.md)
**ADR**:
[ADR-166](../../../../docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md)

## Intent

Define the later enforcement path for architecture-budget checks after
visibility, remediation, and deterministic failure modes exist.

This plan does not enable checks. It records the future contract so enforcement
does not arrive as a surprise or as a noisy gate.

## Promotion Preconditions

Promote to `current/` only after:

1. the visibility layer has produced a reviewed baseline
2. every proposed check has a named structural response
3. known baseline failures have owner-visible remediation plans with owner,
   expiry, and tranche id
4. hook and CI surfaces are proven to fail non-zero when the command fails
5. ADR-121 and build-system updates are ready to land with the actual gate
   promotion

The current pre-push Turbo exit-status issue belongs in quality-gate hardening
before this plan can rely on hook promotion evidence.

## Enforcement Candidates

| Candidate | Future failure mode | Required proof before gate promotion |
|---|---|---|
| Directory cardinality | Configured `max-files-per-dir` inventory reports over-limit directories | Non-empty deterministic inventory and over-limit fixture |
| Package exports | Export target missing or public surface exceeds approved shape | Export targets resolve and public API is intentionally documented |
| Deep imports | Cross-workspace import bypasses approved package exports | Imports resolve through package specifiers, not internals |
| Nested package markers | Nested `package.json` has no fixture/generated disposition | Allowlist or removal plan is explicit |
| Proxy packages | Workspace exists only to re-export another workspace | Real contract or implementation is proven; otherwise remove or fold into owner |
| Workspace layers | New or changed workspace hosts multiple architectural layers | Fails non-zero once blocking; baseline exceptions need owner, expiry, and tranche id |

## Package API Contract

Future enforcement must distinguish public exports from forbidden internals.
Some packages intentionally expose subpaths today. The check must therefore
validate the declared `exports` contract first, then forbid imports that bypass
that contract through `src`, `dist`, or unexported internal paths.

Wildcard exports are not automatically banned, but each wildcard must be
treated as a public API surface with an owner, documentation, and an expiring
allowlist when it hides unstable internals. The allowlist must name a removal
trigger; "future narrowing" is not sufficient.

Tests and documentation cannot redeem a hollow package. A workspace that only
proxies or re-exports another workspace must either own a real contract or
implementation, or be removed/folded into the real owner.

## Gate Promotion Contract

When a check becomes blocking, the same change must update:

- root `package.json` or workspace scripts
- pre-commit, pre-push, and CI surfaces if the check belongs there
- ADR-121 if a quality-gate surface changes
- build-system documentation if command semantics change
- the owning executable plan with validation evidence

Warnings are not acceptable terminal states. A check is either informational
with a named consumer, or blocking with non-zero failure behaviour.

## Non-Goals

- No compatibility aliases.
- No threshold inflation to make initial activation pass.
- No hidden allowlists without owner and expiry or fixture rationale.
- No duplicate graph tool while dependency-cruiser owns the graph gate.

## Review Cadence

- Before promotion: `assumptions-reviewer`, `config-reviewer`,
  `architecture-reviewer-wilma`, `release-readiness-reviewer`
- During implementation: `test-reviewer`, `config-reviewer`,
  relevant architecture reviewers
- Before completion: `code-reviewer`, `docs-adr-reviewer`,
  `config-reviewer`, `test-reviewer`
