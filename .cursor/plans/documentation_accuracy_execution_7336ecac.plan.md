---
name: Documentation Accuracy Execution
overview: Execute the 6 workstreams from the documentation accuracy improvements plan, starting with the blocking Workstream A (dependency direction and boundary definitions) then proceeding through B-F. Verification against current file state has confirmed all 19 issues and uncovered 2 additional broken links in ADR-041.
todos:
  - id: ws-a-boundary-fixes
    content: "Workstream A: Fix dependency direction and boundary definitions across ADR-041, enforcement plan, architecture reviewer template, and architecture README (5 files, BLOCKING)"
    status: completed
  - id: ws-a-validation
    content: "Workstream A5: Post-update validation -- invoke architecture-reviewer-fred and docs-adr-reviewer to confirm alignment"
    status: completed
  - id: ws-b-mutation-plan
    content: "Workstream B: Fix mutation testing plan -- broken link (B1), stale state (B2), quality-gate positioning (B3)"
    status: completed
  - id: ws-c-adr-practice
    content: "Workstream C: Rationalise ADR-119 / practice.md -- trim ADR duplication (C1), enrich practice.md (C2), add canonical-source note (C3)"
    status: completed
  - id: ws-d-plan-structure
    content: "Workstream D: Split cross-agent plan into committed-now vs conditional-later sections"
    status: completed
  - id: ws-e-research-hygiene
    content: "Workstream E: Add staleness caveats to research document inventory counts"
    status: completed
  - id: ws-f-collection-index
    content: "Workstream F: Create collection README with read order and dependencies"
    status: completed
  - id: quality-gates
    content: Run markdownlint:root and format:root after all changes
    status: completed
  - id: final-reviews
    content: Invoke code-reviewer, architecture-reviewer-fred, and docs-adr-reviewer for final review
    status: completed
isProject: false
---

# Documentation Accuracy Execution Plan

## Context

The [documentation-accuracy-improvements.plan.md](.agent/plans/agentic-engineering-enhancements/documentation-accuracy-improvements.plan.md) is a comprehensive, self-contained plan originating from a multi-reviewer session. It identifies 19 issues (3 HIGH, 10 MEDIUM, 3 LOW, 3 observations) across documentation files.

**Strategic position**: This work is a prerequisite for Milestone 2's architectural enforcement tooling ([architectural-enforcement-adoption.plan.md](.agent/plans/agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md)). Wrong boundary definitions would produce wrong `eslint-plugin-boundaries` and `dependency-cruiser` configuration.

**Verification summary**: All issues confirmed against current file state. Two additional issues discovered (see A1 amendments below).

---

## Workstream A: Dependency Direction and Boundary Definition (BLOCKING)

Must complete before enforcement tooling. 5 files.

### A1 -- Update ADR-041 in place

**File**: [docs/architecture/architectural-decisions/041-workspace-structure-option-a.md](docs/architecture/architectural-decisions/041-workspace-structure-option-a.md)

Confirmed stale content at lines 12-24:

- `packages/libs/` listed twice (lines 15-16)
- `packages/providers/` listed but no longer exists
- Dependency flow "core -> libs -> apps/SDKs" is incomplete

**Changes**:

- Replace workspace list with current layout (`apps/`, `packages/core/`, `packages/libs/`, `packages/sdks/`)
- Replace dependency flow with canonical import matrix (from plan Background section)
- Add "Updated: 2026-02-22" to Status line
- Remove `packages/providers/` references

**Amendment (not in original plan)**: Two additional broken links at lines 38-39:

- `.agent/plans/architectural-refinements-plan.md` -- file deleted
- `.agent/plans/workspace-structure-options.md` -- file deleted

These should be removed or replaced with a note: "Historical plans -- see git history for original context."

**Amendment (provider-system.md)**: The link to `docs/architecture/provider-system.md` (line 40) is valid -- the file exists. However, its content is stale (references `@oaknational/mcp-providers-node` which no longer exists). The link should remain, but flag `provider-system.md` for a separate cleanup pass (out of scope for this plan -- it is not a boundary definition issue).

### A2 -- Replace linear shorthand in enforcement plan

**File**: [.agent/plans/agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md](.agent/plans/agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md)

Confirmed at line 57: `core -> libs -> sdks -> apps` is ambiguous.

**Changes**:

- Replace linear shorthand with canonical import matrix table
- Add ADR-041 to "implements" citation list
- Add `docs/architecture/README.md` as a reference
- Update `boundary-configuration` YAML todo to reference the matrix

### A3 -- Fix architecture reviewer template

**File**: [.agent/sub-agents/templates/architecture-reviewer.md](.agent/sub-agents/templates/architecture-reviewer.md)

Confirmed at lines 97-108: `sdks/ can import from core/` omits `libs/` and other sdks.

**Changes**:

- Fix valid patterns: `sdks/ can import from core/, libs/, and other sdks/ (no circular dependencies)`
- Add invalid pattern: `Circular SDK-to-SDK imports`

### A4 -- Document cross-SDK policy in architecture README

**File**: [docs/architecture/README.md](docs/architecture/README.md)

Confirmed at line 38: correctly states sdks depend on `core`/`libs` but does not mention cross-SDK imports.

**Changes**:

- Add: sdks depend on `core`/`libs`/other `sdks` (no circular dependencies)

### A5 -- Post-update validation

Invoke `architecture-reviewer-fred` and `docs-adr-reviewer` (readonly) to confirm alignment.

---

## Workstream B: Mutation Testing Plan Cleanup (HIGH broken link)

**File**: [.agent/plans/agentic-engineering-enhancements/mutation-testing-implementation.plan.md](.agent/plans/agentic-engineering-enhancements/mutation-testing-implementation.plan.md)

### B1 -- Fix broken link

Confirmed at line 29: `../../.agent/directives/testing-strategy.md` resolves to `.agent/.agent/directives/testing-strategy.md` (doubled path). Fix: `../../directives/testing-strategy.md`.

### B2 -- Trim stale operational state

Lines 42-68 contain a 2025-09-24 audit with references to deleted workspaces. Trim to a re-baseline checklist, move historical pilot to appendix, add prerequisite gate.

### B3 -- Position quality-gate vs supplementary signal

Lines 88 and 120 are ambiguous about whether mutation testing is a quality gate. Make explicit: Phases 0-2 supplementary signal, Phase 3 evaluate promotion.

---

## Workstream C: ADR-119 / practice.md Rationalisation (MEDIUM)

### C1 -- Trim ADR-119 mechanism detail

**File**: [docs/architecture/architectural-decisions/119-agentic-engineering-practice.md](docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)

Confirmed duplication at lines 91-163. Trim three-layer model, feedback loops, and self-teaching sections to summaries with delegation to `practice.md`.

### C2 -- Enrich practice.md

**File**: [.agent/directives/practice.md](.agent/directives/practice.md)

Add brief mentions of architectural enforcement commitment and cross-agent standardisation direction (currently unique to ADR-119).

### C3 -- Add canonical-source note to reference doc

**File**: [.agent/reference-docs/prog-frame/agentic-engineering-practice.md](.agent/reference-docs/prog-frame/agentic-engineering-practice.md)

Confirmed: no canonical-source note exists. Add one at top.

---

## Workstream D: Cross-Agent Plan Structure (MEDIUM)

**File**: [.agent/plans/agentic-engineering-enhancements/cross-agent-standardisation.plan.md](.agent/plans/agentic-engineering-enhancements/cross-agent-standardisation.plan.md)

Confirmed: Tasks 1+3 are immediate, Tasks 2+4+5 are conditional with explicit triggers. Restructure into "Committed Work" and "Conditional Work" sections. Update YAML frontmatter.

---

## Workstream E: Research Document Hygiene (LOW)

**File**: [.agent/plans/agentic-engineering-enhancements/2026-02-21-cross-agent-standardisation-landscape.research.md](.agent/plans/agentic-engineering-enhancements/2026-02-21-cross-agent-standardisation-landscape.research.md)

Confirmed: inventory counts at Section 4.3 lack date caveats. Add staleness note above the table. Defer structural simplification (E2).

---

## Workstream F: Collection README (OBSERVATION)

**Directory**: `.agent/plans/agentic-engineering-enhancements/`

Create lightweight `README.md` with collection purpose, document inventory, read order, and dependency map.

---

## Quality Gates

After all changes, run:

```bash
pnpm markdownlint:root
pnpm format:root
```

These are documentation-only changes -- no code files are modified (except the architecture reviewer template, which is markdown). No build/type-check/test gates are affected.

---

## Reviewer Invocations

After all workstreams complete:

- `code-reviewer` (gateway)
- `architecture-reviewer-fred` (ADR compliance)
- `docs-adr-reviewer` (documentation completeness and drift)

Intermediate A5 validation (after Workstream A only):

- `architecture-reviewer-fred` (confirm boundary definitions)
- `docs-adr-reviewer` (confirm ADR-041 lifecycle wording)

---

## Canonical Import Matrix (reference for all edits)

| Importer | core | libs | sdks | apps | Constraint                  |
| -------- | ---- | ---- | ---- | ---- | --------------------------- |
| core     | --   | no   | no   | no   | Must remain domain-agnostic |
| libs     | yes  | --   | no   | no   | --                          |
| sdks     | yes  | yes  | DAG  | no   | No circular SDK-to-SDK deps |
| apps     | yes  | yes  | yes  | --   | --                          |
