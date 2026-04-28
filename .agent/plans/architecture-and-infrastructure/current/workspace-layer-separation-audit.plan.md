---
name: "Workspace Layer Separation Audit"
overview: "Executable audit and migration-preparation plan for enforcing ADR-154: distinct architectural layers must live in distinct workspaces."
todos:
  - id: phase-0-doctrine-and-inventory
    content: "Phase 0: Re-ground ADR-154, ADR-108, the Oak surface isolation programme, pnpm workspace topology, and current package inventory."
    status: pending
  - id: phase-1-structural-audit
    content: "Phase 1: Build the layer/workspace matrix and mark every workspace as single-layer, mixed-layer, or wrongly placed."
    status: pending
  - id: phase-2-migration-map
    content: "Phase 2: Convert findings into tranche migration maps with target workspace names, dependency direction, validation, and sequencing."
    status: pending
  - id: phase-3-enforcement-plan
    content: "Phase 3: Define the lint/depcruise/knip/workspace checks needed to enforce the target topology after migrations."
    status: pending
  - id: phase-4-consolidation
    content: "Phase 4: Update ADRs, indexes, continuity state, and child plans; run consolidation so the audit is not stranded in plan prose."
    status: pending
---

# Workspace Layer Separation Audit

**Last Updated**: 2026-04-28
**Status**: Queued — not started
**Scope**: Audit the whole repo against the strengthened ADR-154 rule that
distinct architectural layers must live in distinct workspaces, then prepare
the executable migration tranches.
**Parent / Source**:
[Oak surface isolation and generic foundation programme](../future/oak-surface-isolation-and-generic-foundation-programme.plan.md)

## Context

The owner clarified the missing enforcement edge in the layer doctrine:
most code in this repo is not properly separated into layers, and separate
layers **must** live in separate workspaces. A folder, module, or barrel split
inside one workspace is not sufficient when two concerns differ by generality,
lifecycle, dependency weight, or consumer specificity.

ADR-154 already says to separate framework from consumer and to push behaviour
down the context-specificity gradient. This plan makes the next move
executable: audit every workspace, name every mixed-layer pressure, and prepare
targeted migration tranches rather than attempting one giant refactor.

## Problem Statement

Current architecture contains known mixed-layer workspaces:

- `packages/sdks/oak-sdk-codegen` mixes OpenAPI API codegen, bulk-data graph
  generation, Oak-specific generation config, generated output, and public
  runtime-facing barrels.
- `packages/core/env`, `packages/core/oak-eslint`,
  `packages/design/design-tokens-core`, `packages/libs/sentry-mcp`,
  `packages/libs/search-contracts`, and others are already classified as
  mixed in the strategic parent plan.
- Apps and SDKs still contain places where generic mechanism, Oak-wide
  wrappers, and narrow Oak-domain leaves are collocated.

The architectural failure is not merely naming or folder layout. It is that
workspace boundaries do not yet match the layer model, so import policies,
tests, and package ownership cannot enforce the doctrine.

## Solution Architecture

### Key Doctrine

Distinct layers require distinct workspaces. A workspace may contain internal
modules for one coherent layer, but it must not host multiple layers separated
only by directories, barrels, or naming conventions.

Layer examples:

- many-repo generic foundation
- repo-local generic capability
- purpose-specific reusable tool
- thin Oak-wide wrapper
- narrow Oak-domain leaf/configuration

### Strategy

This plan is an executable audit and migration-preparation lane. It does not
move product code itself. It creates the evidence and child plan shape needed
for safe, TDD-shaped workspace migrations.

### Audit TDD Shape

Because this plan audits architecture rather than changing runtime code, the
TDD shape is evidence-first:

- **RED**: name each current workspace/layer violation with concrete imports,
  exports, manifests, or plan contradictions.
- **GREEN**: record the smallest target workspace split or lower-layer move
  that would satisfy ADR-154.
- **REFACTOR**: consolidate duplicate findings into child plans, ADR updates,
  enforcement rules, and indexes so the next tranche can implement without
  rediscovering the same evidence.

## Non-Goals

- No code moves or package renames in this audit lane.
- No compatibility facades, alias packages, or long-lived dual import paths.
- No attempt to complete every migration in one branch.
- No weakening of the cardinal rule or schema-first generated-type flow.
- No exception that treats same-workspace directories as adequate layer
  separation.

## Foundation Alignment

- `principles.md`: strict and complete; architectural excellence over
  expediency; separate framework from consumer; context specificity gradient;
  no compatibility layers.
- `testing-strategy.md`: structural moves need tests that prove behaviour at
  the interface, not tests for file presence.
- `schema-first-execution.md`: SDK/codegen migrations must preserve the rule
  that runtime behaviour flows from generated artefacts.
- ADR-154: workspace boundaries are the enforcement surface for layer
  separation.
- ADR-108: SDK/codegen remains the canonical worked example for codegen/runtime
  and generic/Oak separation.

## Lifecycle Trigger Commitment

- **Session entry**: run `jc-start-right-thorough`, read active claims, and
  consult current collaboration state before audit edits.
- **Work shape**: this queued executable plan is the work-shape artefact.
- **Pre-edit coordination**: open claims for each child tranche before
  modifying workspace/package files.
- **During work**: record cross-agent overlap and owner decisions in the shared
  communication log or a decision thread.
- **Session handoff**: close claims, refresh repo-continuity and this plan.
- **Deep consolidation**: run `jc-consolidate-docs` after Phase 4 or whenever
  audit findings become settled doctrine.

## Quality Gate Strategy

This audit uses read-only static-analysis commands until child migration plans
begin implementation:

```bash
pnpm knip
pnpm depcruise
pnpm lint
pnpm type-check
pnpm test
pnpm check
```

Child implementation plans must add the relevant workspace-specific tests and
`pnpm sdk-codegen` when SDK/codegen or generated artefacts are touched.

## Resolution Plan

### Phase 0: Doctrine and Inventory Baseline

**Goal**: establish the authoritative starting point before classifying code.

**Acceptance Criteria**:

1. ADR-154, ADR-108, and the strategic parent plan have been read.
2. `pnpm-workspace.yaml`, `package.json` scripts, and package manifests have
   been inventoried.
3. Existing classifications from the strategic parent plan have been checked
   against current workspace reality.
4. Any stale or contradicted plan state is corrected before Phase 1.

**Deterministic Validation**:

```bash
pnpm -r list --depth -1
pnpm knip
pnpm depcruise
```

### Phase 1: Layer/Workspace Matrix

**Goal**: produce the authoritative matrix that maps each workspace to one
layer and names violations where it cannot.

**Acceptance Criteria**:

1. Every workspace has exactly one target layer or a named mixed-layer
   violation.
2. Each violation names the lower layer, upper layer, current imports/exports,
   and likely target workspace split.
3. The matrix distinguishes internal module partitioning from true workspace
   separation.
4. Findings are stored in the strategic parent plan or a referenced evidence
   artefact, not only in chat.

**Deterministic Validation**:

```bash
pnpm -r list --depth -1
pnpm depcruise:report
rg -n "@oaknational/" packages apps agent-tools
```

### Phase 2: Migration Map and Child Plan Slicing

**Goal**: convert the matrix into executable, reviewable migration tranches.

**Acceptance Criteria**:

1. Each mixed-layer workspace has a target state: split, move, retire,
   neutralise, or explicitly keep as one coherent layer.
2. Each target state names package/workspace names, dependency direction,
   import-path changes, and validation commands.
3. Migration tranches are small enough to land without compatibility aliases.
4. Existing strategic plans are updated rather than duplicated.

**Deterministic Validation**:

```bash
rg -n "mixed|Target state|Tranche|workspace" .agent/plans/architecture-and-infrastructure
pnpm markdownlint-check:root .agent/plans/architecture-and-infrastructure
```

### Phase 3: Enforcement Design

**Goal**: define how the final topology will be enforced after migrations.

**Acceptance Criteria**:

1. The plan names the enforcement mechanism for workspace layer direction:
   ESLint boundaries, dependency-cruiser rules, package manifest checks, or a
   custom workspace classifier.
2. Enforcement is staged so it does not block before migrations land.
3. Each proposed rule has a deterministic command and failure mode.
4. Quality-gate integration is routed through the quality-gate hardening plan
   where appropriate.

**Deterministic Validation**:

```bash
pnpm depcruise
pnpm lint
pnpm check
```

### Phase 4: Documentation and Consolidation

**Goal**: leave the repo in a state where the next implementation agent can
execute without rediscovering the architecture.

**Acceptance Criteria**:

1. ADR-154 and any impacted ADRs reflect the final audit conclusions.
2. The strategic parent plan, roadmap, and current/future indexes point at the
   correct child plans.
3. `repo-continuity.md` and the thread record name the next safe tranche.
4. `jc-consolidate-docs` has run or the reason for not running it is recorded
   with deferral-honesty evidence.

**Deterministic Validation**:

```bash
pnpm markdownlint-check:root .agent/plans/architecture-and-infrastructure docs/architecture/architectural-decisions
pnpm practice:fitness:informational
git diff --check
```

## Risk Assessment

| Risk | Mitigation |
| --- | --- |
| Audit becomes a giant implementation plan | Keep this plan to classification, migration maps, and child-plan creation only. |
| Layer splits create compatibility aliases | Child plans must use clean-break import rewrites; aliases are non-goals. |
| Workspaces multiply without real boundaries | Every proposed workspace must own one coherent layer and have an enforcement story. |
| Existing active branch work is disrupted | This plan stays queued until explicitly promoted to active. |
| SDK/codegen split duplicates existing strategy | Tranche 4 must absorb `codegen/future/sdk-codegen-workspace-decomposition.md`, not compete with it. |

## Learning Loop

At completion, run `jc-consolidate-docs`. Any stable rule about workspace
layering that is not already in ADR-154 must graduate to ADR/docs, and any
transient audit evidence must either move to the strategic parent plan or be
archived with the completed plan.
