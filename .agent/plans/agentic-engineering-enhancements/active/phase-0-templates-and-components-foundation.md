---
name: "Phase 0 - Templates and Components Foundation"
overview: >
  Establish a well-structured plans/templates/components system and ensure
  useful reusable templates exist for this and future collections.
todos:
  - id: p0-inventory
    content: "Inventory current templates/components and identify structural gaps."
    status: completed
  - id: p0-template-set
    content: "Define useful template set for feature, quality-fix, adoption, and roadmap work."
    status: completed
  - id: p0-component-set
    content: "Define reusable component set including evidence/claims guidance."
    status: completed
  - id: p0-collection-roadmap
    content: "Create collection roadmap and active plan mapping."
    status: completed
  - id: p0-doc-sync-contract
    content: "Add mandatory documentation synchronisation contract and tracking log."
    status: completed
  - id: p0-validation
    content: "Validate links and markdown quality for planning artifacts."
    status: completed
---

# Phase 0 - Templates and Components Foundation

## Intent

Make the planning system itself a first-class deliverable: structured,
discoverable, and reusable.

Phase status: complete (2026-02-24).

## Atomic Tasks

### Task 0.1: Inventory and Gap List

- Output:
  - template/component inventory
  - missing-template gap list
- Deterministic validation:
  - `find .agent/plans/templates -maxdepth 2 -type f | sort`

### Task 0.2: Template Set Hardening

- Output:
  - useful templates present for:
    - feature delivery
    - quality fixes
    - adoption rollout
    - collection roadmaps
- Deterministic validation:
  - `ls -1 .agent/plans/templates`
  - `rg -n "Template|Use When" .agent/plans/templates/README.md`

### Task 0.3: Component Set Hardening

- Output:
  - reusable components include quality gates, foundation alignment, risk,
    adversarial review, and evidence/claims
- Deterministic validation:
  - `ls -1 .agent/plans/templates/components`
  - `rg -n "evidence-and-claims" .agent/plans/templates/README.md`

### Task 0.4: Collection Roadmap and Active Mapping

- Output:
  - roadmap document in collection root
  - active execution plans mapped to each roadmap phase
- Deterministic validation:
  - `test -f .agent/plans/agentic-engineering-enhancements/roadmap.md`
  - `test -f .agent/plans/agentic-engineering-enhancements/active/README.md`

### Task 0.5: Documentation Synchronisation Contract

- Output:
  - documentation synchronisation requirement encoded in roadmap/collection docs
  - tracking log created for phase-by-phase updates/rationale
- Deterministic validation:
  - `test -f .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
  - `rg -n "Documentation Synchronisation Requirement" .agent/plans/agentic-engineering-enhancements/roadmap.md`
  - `rg -n "ADR-119|practice.md|prog-frame|Consolidation review" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`

### Task 0.6: Planning Artifact Validation

- Output:
  - no broken planning links in this collection
  - markdownlint clean for touched files
- Deterministic validation:
  - `rg -n "roadmap.md|active/" .agent/plans/agentic-engineering-enhancements`
  - `pnpm markdownlint:root`

## Done When

1. Template/component structure is explicit and documented.
2. Useful templates are available in `.agent/plans/templates`.
3. This collection has roadmap + atomic active plans per phase.
4. Documentation synchronisation tracking is required and discoverable.
