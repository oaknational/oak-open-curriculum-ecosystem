---
name: "Directory Complexity Enablement"
overview: "Executable child plan for the directory-cardinality layer of the architectural budget system, centred on deterministic max-files-per-dir rollout."
todos:
  - id: phase-0-current-truth-baseline
    content: "Phase 0: Refresh current truth for max-files-per-dir, depcruise, knip, pnpm check, hooks, exports, nested package markers, and crowded directories."
    status: pending
  - id: phase-1-remediation-contract
    content: "Phase 1: Define the directory-cardinality remediation SOP and deterministic inventory contract."
    status: pending
  - id: phase-2-red-rule-and-config-proofs
    content: "Phase 2: Add RED tests proving unwired/no-op behaviour, inventory determinism, and an over-limit fixture."
    status: pending
  - id: phase-3-green-targeted-activation
    content: "Phase 3: Wire max-files-per-dir in the agreed initial scope with minimal structural remediation."
    status: pending
  - id: phase-4-pilot-calibration
    content: "Phase 4: Pilot on real crowded directories and calibrate threshold, ignores, and rollout scope from evidence."
    status: pending
  - id: phase-5-docs-and-gate-readiness
    content: "Phase 5: Propagate docs, update tracking, run reviewers, and prepare any future gate promotion through the enforcement layer."
    status: pending
---

# Directory Complexity Enablement

**Created**: 2026-03-07
**Last Updated**: 2026-04-29
**Status**: Queued executable child plan in `current/`
**Parent doctrine**:
[ADR-166](../../../../docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md)
and
[Architectural Budget System Across Scales](../../architecture-and-infrastructure/future/architectural-budget-system-across-scales.plan.md)

## Role

This plan owns the directory-cardinality execution slice of the architectural
budget system. It is no longer the single source of truth for every supporting
architecture guardrail. The parent ADR and architecture plans own the
cross-scale doctrine; this plan owns the safe rollout of
`@oaknational/max-files-per-dir`.

Directory budgets are intra-layer signals only. If a crowded directory reveals
framework/consumer mixing, lifecycle mixing, or context-specificity tension,
the response is a workspace or package boundary plan, not a deeper directory
tree.

## Current Truth

Oak already has:

- strict function, file, depth, and cyclomatic-complexity lint rules in the
  shared ESLint config
- `pnpm knip`, `pnpm depcruise`, and both tools in the root `pnpm check` path
- `.dependency-cruiser.mjs` as the graph-gate configuration
- `knip.config.ts` as the unused-code and dependency-hygiene configuration
- an implemented but unwired
  `packages/core/oak-eslint/src/rules/max-files-per-dir.ts`

The remaining directory-cardinality gap is narrower:

- the rule is not registered in the plugin/config path
- the rule can silently no-op without a configured inventory
- there is no deterministic inventory source or ignore policy
- there is no Oak SOP for responding to a directory-count failure
- crowded directories have not been piloted against the future rule

## Goal

Enable `max-files-per-dir` only after Oak can respond to a breach with
cohesive intra-layer design, deterministic inventory evidence, and reviewed
rollout settings.

## Non-Goals

- No immediate repo-wide activation.
- No threshold selection before baseline and pilot evidence.
- No re-planning completed `knip`, `depcruise`, or `pnpm check` integration.
- No directory split where ADR-154 requires workspace separation.
- No suppressions, threshold inflation, or compatibility barrels.
- No new graph tool while dependency-cruiser owns graph enforcement.

## Foundation Alignment

Before each phase:

1. Re-read `.agent/directives/principles.md`.
2. Re-read `.agent/directives/testing-strategy.md`.
3. Re-read `.agent/directives/schema-first-execution.md`.
4. Ask: could it be simpler without compromising quality?

Relevant doctrine:

- ADR-019: domain-driven file splitting
- ADR-041: workspace dependency direction
- ADR-121: quality-gate surfaces
- ADR-154: directories do not substitute for workspace layer boundaries
- ADR-155: decompose at the tension
- ADR-166: architectural budgets across scales

## Phase 0: Current-Truth Baseline

**Goal**: refresh the exact state before writing rule or config code.

**RED evidence first**:

1. Prove where `max-files-per-dir` is implemented, exported, and unwired.
2. Prove current `knip`, `depcruise`, and `pnpm check` wiring from live files.
3. Prove whether hook/CI surfaces can fail non-zero for future promoted gates.
4. Inventory package export shapes, deep-import candidates, nested package
   markers, and the largest authored directories.

**Acceptance criteria**:

1. The baseline names current truth, not March 2026 assumptions.
2. Any hook failure-mode issue is routed to quality-gate hardening before gate
   promotion is claimed.
3. Top crowded directories are recorded as pilot candidates, not automatic
   refactor targets.
4. Nested package markers are classified as workspace, fixture/generated, or
   remediation-needed.

**Deterministic validation**:

```bash
rg --line-number "max-files-per-dir" packages/core/oak-eslint/src
rg --line-number "depcruise|knip|check" package.json
test -f .dependency-cruiser.mjs
test -f knip.config.ts
find apps packages agent-tools -name package.json -not -path "*/node_modules/*"
```

## Phase 1: Remediation Contract and Inventory Design

**Goal**: define how developers respond to a directory-cardinality breach.

**RED evidence first**:

1. Prove existing guidance covers file/function splitting but not directory
   cardinality.
2. Prove the rule needs a non-empty inventory to avoid silent success.

**GREEN implementation**:

1. Add or update the canonical Oak guidance for directory-cardinality
   remediation.
2. Define the inventory source, sorting, generated/fixture exclusions, and
   ignore policy.
3. Require every breach to choose one response:
   - extract cohesive intra-layer sub-domains
   - move code to a lower general layer
   - split a workspace when the tension is a layer boundary
   - delete dead code
   - generate repeated structure instead of authoring it by hand

**Acceptance criteria**:

1. The SOP bans threshold bumps and suppressions as a primary response.
2. The inventory contract is deterministic and cannot be empty unnoticed.
3. The SOP points to ADR-154 when directory refactoring would hide a layer
   split.

**Deterministic validation**:

```bash
rg --line-number "directory-cardinality|directory complexity|max-files-per-dir" .agent docs packages/core/oak-eslint
rg --line-number "ADR-154|ADR-166|inventory|threshold|suppress" .agent docs
```

## Phase 2: RED Rule and Config Proofs

**Goal**: write failing tests that prove the desired rule wiring before
implementation.

**RED tests**:

1. Plugin registration fails until `max-files-per-dir` is exported.
2. Shared config test fails until the rule is configured for the chosen scope.
3. Inventory test fails when inventories are empty or unstable.
4. Fixture test fails on a known over-limit directory.

**Acceptance criteria**:

1. RED failures are behavioural, not missing-import or type-check failures.
2. Tests prove the configured inventory is non-empty and sorted.
3. The failure message points to the canonical remediation guidance.

**Deterministic validation**:

```bash
pnpm --filter @oaknational/eslint-plugin-standards test
pnpm --filter @oaknational/eslint-plugin-standards lint
```

## Phase 3: GREEN Targeted Activation

**Goal**: wire the rule in the smallest reviewed scope that proves the path.

**GREEN implementation**:

1. Export and register the rule in the plugin surface.
2. Configure the agreed initial scope with the deterministic inventory.
3. Improve the rule message to name the remediation contract.
4. Remediate initial breaches structurally, or route each out-of-scope breach
   to a named workspace/package plan.

**Acceptance criteria**:

1. The rule fails fast if the configured inventory is missing.
2. The initial scope is explicit and justified.
3. Remediation does not create proxy barrels, artificial packages, or layer
   hiding.
4. Any workspace-level finding is routed to the architecture programme.

**Deterministic validation**:

```bash
rg --line-number "max-files-per-dir" packages/core/oak-eslint/src
pnpm --filter @oaknational/eslint-plugin-standards test
pnpm lint
```

## Phase 4: Pilot and Calibration

**Goal**: use real hotspots to calibrate rollout behaviour from evidence.

**Pilot expectations**:

1. Choose pilot directories from the Phase 0 baseline.
2. Record whether each pilot response is directory extraction, lower-layer
   move, workspace split, deletion, or generated output.
3. Calibrate threshold and ignore policy from the pilot.
4. Re-check that changes reduce conceptual load rather than moving it to a
   neighbouring directory or workspace.

**Acceptance criteria**:

1. At least one real crowded directory has evidence-backed disposition.
2. Threshold and ignore policy are justified by pilot data.
3. Package API and dependency direction stay cleaner after remediation.

**Deterministic validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm depcruise
pnpm knip
```

## Phase 5: Documentation and Gate Readiness

**Goal**: close the child plan without overstating enforcement status.

**Tasks**:

1. Update developer-experience indexes and documentation sync log.
2. Update ADR-121 and build-system docs only if a check is promoted to a gate.
3. Route repo-wide enforcement to the future enforcement-layer plan until
   visibility and remediation are complete.
4. Run required reviewers and record dispositions.
5. Run consolidation after settled doctrine is ready to graduate.

**Acceptance criteria**:

1. Surrounding docs describe this plan as the directory-cardinality child.
2. Quality-gate docs do not claim new gate coverage before it exists.
3. Reviewer findings are fixed, rejected with rationale, or explicitly
   deferred with owner-visible evidence.

**Deterministic validation**:

```bash
rg --line-number "directory-complexity-enablement\\.execution\\.plan\\.md" .agent/plans
pnpm markdownlint-check:root .agent/plans/developer-experience docs/architecture/architectural-decisions
git diff --check
```

## Reviewer Gate Strategy

- Phase 0: `assumptions-reviewer`, `config-reviewer`
- Phase 1: `docs-adr-reviewer`, `architecture-reviewer-fred`
- Phase 2 and Phase 3: `code-reviewer`, `test-reviewer`,
  `config-reviewer`
- Phase 4: `architecture-reviewer-betty`,
  `architecture-reviewer-wilma`
- Phase 5: `code-reviewer`, `docs-adr-reviewer`,
  `assumptions-reviewer`

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| The rule silently no-ops | Require non-empty deterministic inventory and config tests |
| Counts cause mechanical splits | SOP requires a structural response and reviewer disposition |
| Directory split hides layer tension | ADR-154 routes layer tension to workspace separation |
| Existing gate state is misrepresented | Phase 0 refreshes live `knip`, `depcruise`, and `pnpm check` truth |
| Hook/CI promotion claims are false | Enforcement waits for non-zero failure-mode proof |

## Next Session Entry Point

1. Apply `start-right-quick`.
2. Re-read ADR-166, ADR-154, and this plan.
3. Start with Phase 0 baseline refresh, not rule wiring.
4. Treat any cross-scale finding as evidence for the parent architecture
   programme rather than forcing it into directory remediation.
