---
name: "Directory Complexity and Architectural Fitness Signals"
overview: "Decision-ready child plan for replacing the unwired max-files-per-dir ESLint shape with deterministic, non-blocking architectural fitness signals."
todos:
  - id: phase-0-current-truth-baseline
    content: "Phase 0: Refresh current truth for the rule, validator framework, architectural-budget plans, and directory baseline."
    status: completed
  - id: phase-1-ratify-signal-contract
    content: "Phase 1: Ratify that directory cardinality is a report-only signal, define named consumers, and decide the ADR-166 amendment route."
    status: pending
  - id: phase-2-discovery-classification
    content: "Phase 2: Use TDD to build deterministic discovery, file-role classification, and stable human/JSON output in the validator framework."
    status: pending
  - id: phase-3-report-only-pilot
    content: "Phase 3: Wire a report-only directory-concentration slice and pilot contrasting behaviour-code and registry/data directories."
    status: pending
  - id: phase-4-suite-expansion
    content: "Phase 4: Add further architectural signals only where a named consumer and interpretation contract exist."
    status: pending
  - id: phase-5-rule-retirement
    content: "Phase 5: Retire the unwired ESLint rule after replacement-equivalence proof and propagate the settled signal-versus-invariant doctrine."
    status: pending
---

# Directory Complexity and Architectural Fitness Signals

**Created**: 2026-03-07
**Last Updated**: 2026-07-15
**Status**: Decision-ready for the estate-wide report-only signal, which still
awaits owner ratification. **Superseded for the Reliable Atoms workspace class
by the owner's ruling of 2026-09-14** — read the note below before this plan.

## 2026-09-14 Owner ruling — what this plan no longer governs

The owner ruled that the workspaces holding Reliable Atoms are a declared
class subject to a **blocking** directory-cardinality validator in the
repository validator framework, with stricter length, complexity and clarity
budgets; that the check is a validator, never an ESLint rule and never a test;
and that the unregistered `max-files-per-dir` ESLint rule is deleted. For the
class, Phase 1 below is answered (invariant, not signal), the threshold
non-goals do not apply, and Phase 5's replacement-equivalence condition is
void because the replacement is a different instrument. The durable records
are ADR-166 §Amendment 2026-09-14 and ADR-230 §Repository interpretation; the
executable node is the Reliable Atoms programme's delivery node
`reliable-atoms-workspace-shape` in the live plan estate. Everything below
stays true for the rest of the estate: the report-only signal remains an
unratified proposal, and no workspace outside the class is evidence about the
class.
**Parent doctrine**:
[ADR-166](../../../../docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md)
and
[Architectural Budget System Across Scales](../../architecture-and-infrastructure/future/architectural-budget-system-across-scales.plan.md)

**Concept evidence**:
[Architectural Fitness Functions: Concept Exploration](../../../reports/architectural-fitness-functions-concept-exploration-2026-07-15.md)

## 2026-07-15 Re-foundation

First-hand inspection changed the intended implementation shape:

- `max-files-per-dir` is implemented and tested but is neither exported nor
  configured;
- it requires a caller-supplied repository inventory inside a per-file ESLint
  rule and silently returns no finding when that inventory is absent;
- a read-only baseline found 77 authored source directories above its default
  of eight files, including behaviour code, registries, and data-like
  collections with materially different interpretations;
- the established repository validator framework is a better mechanism for
  deterministic discovery, classification, report-only output, and agent
  consumption.

The phases below headed **Historical activation shape** preserve the previous
plan for provenance but are no longer executable instructions. The
authoritative next sequence is the re-founded sequence in this section. Do not
wire the ESLint rule merely because the historical phase says to do so.

## Role

This plan owns the directory-cardinality execution slice of the architectural
budget system. It is no longer the single source of truth for every supporting
architecture guardrail. The parent ADR and architecture plans own the
cross-scale doctrine; this plan owns the decision and execution path for the
first repository-level directory-concentration signal.

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

The remaining directory-cardinality gap is not rule registration. It is the
absence of a trustworthy interpretation contract:

- deterministic repository discovery and explicit file-role classification;
- stable human-readable and JSON outputs;
- named consumers and review cadence;
- an SOP that treats counts as noticers rather than failures;
- contrasting pilots that distinguish behaviour-code pressure from coherent
  registries or data collections;
- a settled boundary between heuristic signals and enforceable invariants.

## Goal

Create a non-blocking architectural-fitness signal that makes upward migration
of complexity visible without turning a file count into a limit or mechanical
refactoring instruction.

## Non-Goals

- No ESLint activation.
- No blocking directory-count gate.
- No threshold selection as an architectural pass/fail line.
- No re-planning completed `knip`, `depcruise`, or `pnpm check` integration.
- No directory split where ADR-154 requires workspace separation.
- No suppressions, threshold inflation, or compatibility barrels.
- No new graph tool while dependency-cruiser owns graph enforcement.

## Re-founded Execution Sequence

### Phase 1: Ratify the Signal Contract

Decide explicitly that directory cardinality is informational, name its
consumer and cadence, and choose whether ADR-166 needs an amendment or a
superseding decision. The warrant is the baseline's mixed directory roles. The
direction is falsified if the owner supplies evidence that count is a strict,
role-independent invariant with one ungameable response.

### Phase 2: Discovery and Classification with TDD

Build the smallest validator-framework slice that proves deterministic roots,
sorting, production/test/generated/fixture/registry classification, non-empty
inventory, and identical human/JSON facts. Reuse an existing repository
analysis surface if one is discovered to own the complete contract.

### Phase 3: Report-only Pilot

Run the signal against at least one behaviour-code directory and one coherent
registry/data-like directory. Record the disposition, including a valid
“observed; no structural change” result. Stop if reviewers cannot reach
repeatable interpretations without an allowlist masquerading as taxonomy.

### Phase 4: Named-consumer Expansion

Add workspace, export, or graph observations only when a consumer states the
decision each signal informs. Never duplicate an invariant already owned by
ESLint, dependency-cruiser, Knip, or package-contract validation.

### Phase 5: Rule Retirement and Doctrine Propagation

After replacement-equivalence tests and discovery wiring are proven, delete the
unwired custom rule and its tests in the same change. Propagate the settled
signal/invariant distinction to ADR-166, planning indexes, quality-gate docs,
and the architecture-budget thread as required by the ratified decision.

## Historical Activation Shape — Preserved, Not Executable

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

### Former Phase 0: Current-Truth Baseline

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

### Former Phase 1: Remediation Contract and Inventory Design

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

### Former Phase 2: RED Rule and Config Proofs

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

### Former Phase 3: GREEN Targeted Activation

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

### Former Phase 4: Pilot and Calibration

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

### Former Phase 5: Documentation and Gate Readiness

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

- Phase 0: `assumptions-expert`, `config-expert`
- Phase 1: `docs-adr-expert`, `architecture-expert-fred`
- Phase 2 and Phase 3: `code-expert`, `test-expert`,
  `config-expert`
- Phase 4: `architecture-expert-betty`,
  `architecture-expert-wilma`
- Phase 5: `code-expert`, `docs-adr-expert`,
  `assumptions-expert`

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| The replacement inventory silently empties | Require non-empty deterministic discovery and tests |
| Counts cause mechanical splits | Treat counts as observations and require an interpretation record |
| Directory split hides layer tension | ADR-154 routes layer tension to workspace separation |
| Existing gate state is misrepresented | Phase 0 refreshes live `knip`, `depcruise`, and `pnpm check` truth |
| Hook/CI promotion claims are false | Enforcement waits for non-zero failure-mode proof |

## Next Session Entry Point

1. Apply `start-right-quick`.
2. Re-read ADR-166, ADR-154, and this plan.
3. Start with Phase 1 owner ratification, not rule wiring; the 2026-07-15
   baseline is complete but must be cheaply re-verified before code changes.
4. Treat any cross-scale finding as evidence for the parent architecture
   programme rather than forcing it into directory remediation.
