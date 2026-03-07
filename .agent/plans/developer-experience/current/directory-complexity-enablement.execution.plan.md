---
name: "Directory Complexity Enablement"
overview: "Canonical executable plan for the supporting constraints, toolchain, and staged rollout gates required before Oak enables `max-files-per-dir`."
todos:
  - id: phase-0-baseline-lock
    content: "Phase 0: Lock the directory-complexity baseline, scope, and ownership boundaries."
    status: pending
  - id: phase-1-policy-contract
    content: "Phase 1: Define the remediation contract and directory-complexity SOP."
    status: pending
  - id: phase-2-supporting-enforcement
    content: "Phase 2: Land the supporting enforcement bundle (boundary contract, depcruise, knip, qg integration)."
    status: pending
  - id: phase-3-pilot-calibration
    content: "Phase 3: Pilot the supporting bundle on real Oak hotspots and calibrate activation settings."
    status: pending
  - id: phase-4-staged-activation
    content: "Phase 4: Export, wire, and activate `max-files-per-dir` only after the supporting bundle proves out."
    status: pending
  - id: phase-5-docs-closure
    content: "Phase 5: Complete documentation propagation, cross-reference cleanup, and lifecycle follow-through."
    status: pending
---

# Directory Complexity Enablement

**Created**: 2026-03-07
**Last Updated**: 2026-03-07
**Status**: 🟡 PLANNING (`current/`)
**Scope**: Define and execute the full supporting constraint bundle that must exist before Oak enables `max-files-per-dir`, then stage a narrow activation with deterministic validation.

---

## Canonical Status

This is the **single executable source of truth** for the directory-complexity workstream:

1. the remediation SOP and refactoring contract
2. the supporting structural guardrails that make directory limits architecturally useful
3. the staged activation criteria for `max-files-per-dir`

Overlapping plans must reference this file rather than duplicate execution detail.

Delegated/folded sources:

- `../active/devx-strictness-convergence.plan.md`
- `../../agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md`
- `../../agentic-engineering-enhancements/active/phase-3-architectural-enforcement-execution.md`

---

## Context

Oak already has:

- a working but unwired `packages/core/oak-eslint/src/rules/max-files-per-dir.ts`
- strong file/function complexity guardrails in shared ESLint configs
- custom boundary rules for `core`, `libs`, `sdks`, and `apps`

Oak does **not** yet have the full companion system that prevents `max-files-per-dir` from degenerating into "shuffle files until lint passes":

- a canonical SOP for how to respond to a directory-complexity breach
- barrel-boundary enforcement proving that extracted sub-domains expose narrow public APIs
- dead-code enforcement to clean up refactors
- a quality-gate path that keeps the supporting toolchain permanently active
- calibrated rollout evidence showing what threshold and ignore policy Oak should actually use

The external comparator reviewed on 2026-03-07 confirmed the useful pattern:

1. define the remediation contract first
2. enforce public API and internal-boundary discipline
3. clean up dead code created by refactors
4. only then enable the directory-count rule

## Goal

Create a single, evidence-backed Oak plan that lands the structural support bundle first and enables `max-files-per-dir` only after the repo can respond to it with bounded-context refactors rather than mechanical file movement.

## Non-Goals

- Immediate repo-wide activation of `max-files-per-dir`
- Choosing a final file-count threshold before hotspot evidence exists
- Adopting `eslint-plugin-boundaries` by default if Oak's existing custom boundary rules can express the required constraints
- Folding unrelated strictness work (`vi.mock`, type-assertion burn-down, override removal) into this plan

---

## Foundation Alignment

Before each phase starts:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Ask: **Could it be simpler without compromising quality?**

Non-negotiables for this plan:

- No compatibility layers
- No check-disabling shortcuts
- No threshold inflation to hide violations
- No barrel-file sprawl that re-exports internals as a workaround
- No duplication of execution detail across plan files

---

## Phase Plan

### Phase 0: Baseline and Scope Lock

Goal:

- Lock the exact baseline, supporting-tool gap, and ownership boundaries before any execution work begins.

RED (evidence first):

1. Prove the current state of `max-files-per-dir` wiring, boundary rules, and toolchain gaps.
2. Inventory the current hotspot classes that would be affected by a future rollout.
3. Prove which parts of the work belong here versus in adjacent strictness/enforcement plans.

GREEN (minimal implementation):

1. Record the authoritative baseline and scope in this plan only.
2. Move overlapping plans to reference this plan for directory-complexity execution detail.

REFACTOR (cleanup/documentation):

1. Remove stale claims that still imply execution detail is owned elsewhere.
2. Keep one authoritative execution path for this workstream.

Acceptance criteria:

1. `max-files-per-dir` current state is documented with exact code-location evidence.
2. Supporting-tool gaps (`dependency-cruiser`, `knip`, qg integration, SOP) are explicitly listed.
3. Adjacent plans describe this file as the canonical execution source for this work.

Deterministic validation:

```bash
rg --line-number "max-files-per-dir" packages/core/oak-eslint/src
rg --line-number "dependency-cruiser|knip|qg" package.json turbo.json .agent/plans
rg --line-number "directory-complexity-enablement\\.execution\\.plan\\.md" .agent/plans/developer-experience .agent/plans/agentic-engineering-enhancements
```

---

### Phase 1: Policy Contract and Remediation SOP

Goal:

- Define the architectural response contract so a directory-limit failure produces cohesive refactoring, not file shuffling.

RED (tests/evidence first):

1. Prove what the current repo guidance says about splitting files/functions/directories.
2. Identify the missing directory-complexity-specific instructions.

GREEN (minimal implementation):

1. Create a canonical directory-complexity SOP in the appropriate Oak guidance surface.
2. Define the required response pattern:
   - identify sub-domains
   - extract cohesive groups, not single-file orphans
   - add explicit `index.ts` contracts
   - keep internals private
   - avoid wildcard exports
3. Decide whether Oak needs a new dedicated rule/doc surface or whether an existing guidance surface should be extended.

REFACTOR (cleanup/documentation):

1. Ensure the SOP and plan language agree on the same remediation vocabulary.
2. Remove any stale references that still imply "split because lint said so" without contract guidance.

Acceptance criteria:

1. Oak has a single canonical SOP for directory-complexity remediation.
2. The SOP explicitly bans threshold bumps and suppressions as the primary response.
3. The SOP explicitly requires bounded-context extraction and public API design.

Deterministic validation:

```bash
test -f .agent/rules/directory-complexity-enablement.md || test -f docs/governance/directory-complexity-enablement.md
rg --line-number "bounded context|index\\.ts|wildcard export|threshold|suppress" .agent/rules docs/governance .agent/directives
```

---

### Phase 2: Supporting Enforcement Bundle

Goal:

- Land the structural support bundle that makes directory limits safe and meaningful.

RED (tests/evidence first):

1. Prove the current boundary model can or cannot express the needed public-API constraints.
2. Prove the repo currently lacks barrel-boundary and dead-code enforcement.
3. Prove the current qg path does or does not include the required structural checks.

GREEN (minimal implementation):

1. Choose and implement the semantic-boundary path:
   - prefer extending Oak's existing custom `boundary.ts` rules if they are sufficient
   - adopt `eslint-plugin-boundaries` only if the custom rules cannot express the required semantics cleanly
2. Add `dependency-cruiser` configuration enforcing barrel/public-API access patterns for the selected scopes.
3. Add `knip` configuration for dead-code and unused-export cleanup after refactors.
4. Integrate the chosen structural checks into the repo quality-gate path.
5. Decide whether a supplemental graph check such as `madge` adds unique value or should remain out of scope, and record the rationale here.

REFACTOR (cleanup/documentation):

1. Update tooling docs and plan references so the support bundle is described once.
2. Remove stale assumptions that `max-files-per-dir` can be enabled without this bundle.

Acceptance criteria:

1. Oak has an explicit, tested boundary/public-API contract for extracted sub-domains.
2. Oak has `dependency-cruiser` configuration for barrel-boundary enforcement.
3. Oak has `knip` configuration for dead-code detection in the same scopes.
4. The quality-gate path references the selected structural checks.
5. The plan records the rationale for the semantic-boundary implementation choice.

Deterministic validation:

```bash
test -f .dependency-cruiser.cjs
rg --line-number "index\\.ts|forbidden|circular" .dependency-cruiser.cjs
test -f knip.ts || test -f knip.json || test -f knip.config.ts
rg --line-number "depcruise|knip|qg" package.json turbo.json
rg --line-number "eslint-plugin-boundaries|createSdkBoundaryRules|appBoundaryRules|appArchitectureRules" packages/core/oak-eslint apps packages
```

---

### Phase 3: Pilot and Calibration

Goal:

- Run the support bundle against real Oak hotspots before enabling the directory-count rule.

RED (tests/evidence first):

1. Identify one or more real candidate hotspots from Oak's current structure.
2. Prove how the support bundle behaves on those hotspots before `max-files-per-dir` is active.

GREEN (minimal implementation):

1. Choose pilot scopes from the baseline.
2. Apply the support bundle and fix resulting structural issues with cohesive extraction.
3. Capture evidence about:
   - practical sub-domain boundaries
   - barrel/public-API ergonomics
   - dead-code cleanup burden
   - likely threshold and ignore-suffix policy

REFACTOR (cleanup/documentation):

1. Fold the pilot findings back into this plan's rollout settings.
2. Tighten the staged-activation criteria using real evidence rather than intuition.

Acceptance criteria:

1. At least one real Oak hotspot has been used as a calibration pilot.
2. The plan records the recommended threshold, ignore policy, and initial activation scope.
3. The pilot demonstrates that the support bundle changes developer behaviour in the intended way.

Deterministic validation:

```bash
pnpm type-check
pnpm lint
pnpm test
rg --line-number "threshold|ignore|pilot|hotspot" .agent/plans/developer-experience/current/directory-complexity-enablement.execution.plan.md
```

---

### Phase 4: Staged `max-files-per-dir` Activation

Goal:

- Export, wire, and activate `max-files-per-dir` only after the supporting bundle has been proven.

RED (tests/evidence first):

1. Add or update rule/config tests that fail until the rule is exported and wired correctly.
2. Prove the activation fails cleanly on known breached directories before remediation.

GREEN (minimal implementation):

1. Improve the Oak rule message so it points to the canonical Oak remediation guidance.
2. Export the rule from `packages/core/oak-eslint/src/index.ts`.
3. Wire the rule into the chosen shared config or initial target scopes only.
4. Apply the calibrated threshold and ignore policy from Phase 3.
5. Remediate the initial breaches structurally.

REFACTOR (cleanup/documentation):

1. Remove any stale comments or plan text that still describe the rule as unwired-only.
2. Record the rollout boundary clearly: pilot scope first, broader rollout only after successful evidence.

Acceptance criteria:

1. `max-files-per-dir` is exported and wired in the agreed initial scope.
2. The rule message points to Oak's canonical SOP.
3. Initial breaches are resolved by bounded-context refactors rather than threshold changes.
4. The activation scope and threshold match the Phase 3 calibration decision.

Deterministic validation:

```bash
rg --line-number "max-files-per-dir" packages/core/oak-eslint/src/index.ts packages/core/oak-eslint/src/configs
pnpm --filter @oaknational/eslint-plugin-standards test
pnpm --filter @oaknational/eslint-plugin-standards lint
pnpm lint
```

---

### Phase 5: Documentation Propagation and Lifecycle Closure

Goal:

- Ensure surrounding docs reference this canonical plan and that the workstream can later move cleanly through `active/` and archive.

RED (tests/evidence first):

1. Scan for stale references that still imply the old split ownership.
2. Verify collection indexes, roadmaps, and source plans all point at this file.

GREEN (minimal implementation):

1. Update collection indexes and strategic/source plans.
2. Record the planning update in `../documentation-sync-log.md`.
3. Prepare promotion guidance for moving this plan from `current/` to `active/` once execution starts.

REFACTOR (cleanup/documentation):

1. Remove duplicated execution detail from adjacent plans where practical.
2. Keep this plan as the only place that fully describes the staged rollout.

Acceptance criteria:

1. Developer-experience indexes and roadmap reference this plan.
2. Agentic-engineering source/execution surfaces reference this plan for this workstream.
3. Documentation sync tracking records the canonicalisation change.

Deterministic validation:

```bash
rg --line-number "directory-complexity-enablement\\.execution\\.plan\\.md" .agent/plans/developer-experience .agent/plans/agentic-engineering-enhancements
pnpm markdownlint-check:root
```

---

## Quality Gates

After each sub-task:

```bash
pnpm type-check
pnpm lint
pnpm test
```

After each toolchain or config phase:

```bash
pnpm build
pnpm type-check
pnpm lint
pnpm test
```

Additional targeted gates when structural tools land:

```bash
pnpm depcruise
pnpm knip
```

If a supplemental graph tool is adopted in Phase 2, add it here and to the repo quality-gate path at the same time.

---

## Reviewer Gate Strategy

At each phase completion checkpoint:

1. Always: `code-reviewer`, `docs-adr-reviewer`
2. Structural/tooling phases (2, 4): `architecture-reviewer-barney`, `architecture-reviewer-fred`, `architecture-reviewer-betty`, `config-reviewer`
3. Calibration/rollout phases (3, 4): `test-reviewer`

Do not mark a phase complete until required reviewer findings are either fixed or explicitly carried as dated follow-up debt in this plan.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `max-files-per-dir` is enabled before the support bundle exists | Mechanical file shuffling, boundary regressions, churn | Phase sequencing is mandatory; activation is blocked until Phase 3 evidence exists |
| `dependency-cruiser` and `knip` are added without clear scope | High-noise rollout and low trust in the tools | Start with pilot scopes and record scope rationale in this plan |
| Boundary tooling is overcomplicated | Tooling drift and unnecessary maintenance | Prefer extending Oak's existing custom boundary rules unless a clear gap is proven |
| Threshold chosen too early | Wrong activation pressure and avoidable churn | Calibrate threshold and ignore policy in Phase 3 |
| Adjacent plans continue duplicating execution detail | Canonical drift and stale references | Update all overlapping plans to point here and keep this file authoritative |

---

## Cross-References

- `../active/devx-strictness-convergence.plan.md`
- `../README.md`
- `../roadmap.md`
- `./README.md`
- `../../agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md`
- `../../agentic-engineering-enhancements/active/phase-3-architectural-enforcement-execution.md`
- `../../../reference-docs/architecture/boundary-enforcement-with-eslint.md`
- `../../../research/developer-experience/architectural-enforcement-playbook.md`

---

## Next Session Entry Point (Standalone)

1. Apply session grounding with `start-right-quick` unless the work expands again.
2. Re-read the three foundation directives.
3. Treat this plan as the canonical execution source for directory-complexity work.
4. Start with Phase 0 baseline confirmation, not implementation.
