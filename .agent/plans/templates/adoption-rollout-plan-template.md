---
name: "[Adoption Plan Title]"
overview: "[One-line summary of the adoption objective]"
todos:
  - id: phase-0-baseline
    content: "Phase 0: Baseline audit and constraints validation."
    status: pending
  - id: phase-1-design
    content: "Phase 1: Define policy/design contract and target behaviours."
    status: pending
  - id: phase-2-integration
    content: "Phase 2: Integrate into prompts/templates/workflows."
    status: pending
  - id: phase-3-pilot
    content: "Phase 3: Pilot in one stream and capture evidence."
    status: pending
  - id: phase-4-rollout
    content: "Phase 4: Rollout and enforce merge-readiness checks."
    status: pending
---

# [Adoption Plan Title]

**Last Updated**: [YYYY-MM-DD]
**Status**: 🟡 PLANNING
**Scope**: [One-line scope]

---

## Context

[What problem this adoption addresses, why now, and what exists already]

## Goal

[Clear adoption goal with measurable outcome]

## Non-Goals (YAGNI)

- [Explicitly out of scope item 1]
- [Explicitly out of scope item 2]

---

## Phase 0 — Baseline Audit

### Task 0.1: Inventory current behaviour

- Output: [inventory artifact path]
- Validation: [command + expected result]

### Task 0.2: Identify constraints and blockers

- Output: [constraints list]
- Validation: [review criteria]

---

## Phase 1 — Policy/Design Contract

### Task 1.1: Define normative rules

- Output: [policy doc path]
- Validation: [review criteria]

### Task 1.2: Define acceptance criteria

- Output: [criteria list]
- Validation: [deterministic checks]

---

## Phase 2 — Workflow Integration

### Task 2.1: Update prompts/directives

- Output: [files updated]
- Validation: [diff + checklist]

### Task 2.2: Update templates/components

- Output: [files updated]
- Validation: [template references present]

---

## Phase 3 — Pilot

### Task 3.1: Run pilot on one active stream

- Output: [pilot evidence artifact]
- Validation: [defined metrics threshold]

### Task 3.2: Calibrate based on findings

- Output: [adjustment log]
- Validation: [before/after comparison]

---

## Phase 4 — Rollout and Enforcement

### Task 4.1: Expand to all target streams

- Output: [rollout checklist]
- Validation: [all targets complete]

### Task 4.2: Merge-readiness guard

- Output: [enforcement rule]
- Validation: [failing case blocked]

### Task 4.3: Documentation propagation

- Output: [ADR/directive/reference-doc/README updates or no-change rationale]
- Validation: [phase entry in documentation sync log + consolidation review]

---

## Quality Gates

> See [quality-gates.md](components/quality-gates.md)

## Foundation Alignment

> See [foundation-alignment.md](components/foundation-alignment.md)

## Documentation Propagation

> See [documentation-propagation.md](components/documentation-propagation.md)

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.

## Risk Assessment

> See [risk-assessment.md](components/risk-assessment.md)
