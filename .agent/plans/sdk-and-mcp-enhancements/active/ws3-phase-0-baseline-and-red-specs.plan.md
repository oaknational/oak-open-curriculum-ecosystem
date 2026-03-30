---
name: "WS3 Phase 0: Baseline and RED Specs"
overview: "Ground the live branch, capture contamination inventory, and establish failing RED tests before product changes."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: grounding
    content: "Re-ground against roadmap, umbrella plan, WS3 parent plan, and C8 auth closure plans."
    status: pending
  - id: contamination-inventory
    content: "Run canonical runtime contamination check and capture baseline evidence."
    status: pending
  - id: red-tests
    content: "Add RED tests for widget resource/metadata/auth policy before product code changes."
    status: pending
---

# WS3 Phase 0: Baseline and RED Specs

This companion plan narrows execution for Phase 0 only. The parent plan remains
authoritative for full WS3 scope and ordering.

## Required Inputs

1. `roadmap.md`
2. `mcp-app-extension-migration.plan.md`
3. `ws3-widget-clean-break-rebuild.plan.md`
4. `ws3-phase-3-canonical-contracts-and-runtime.plan.md` — contains binding
   `Reviewer-Validated Findings` section (B3 Hybrid retention, C8 prerequisite,
   visibility array format, task sequencing). Read before capturing the
   contamination inventory so the B3 Hybrid classification is understood.
5. `current/auth-safety-correction.plan.md`
6. `current/auth-boundary-type-safety.plan.md`

## Tasks

> **Post-WS2 calibration**: WS2 already removed runtime-path contamination
> (`window.openai`, `text/html+skybridge`, etc.). This inventory will primarily
> find dead files and the `oak-json-viewer` slug, not active runtime patterns.

1. Capture live branch state (`git status --short`, `git log --oneline --decorate -5`)
2. Run canonical runtime contamination check from the WS3 parent plan
3. Capture non-canonical inventory for:
   - legacy bridge residue (dead files awaiting deletion)
   - hard-coded resource identity (`oak-json-viewer` slug)
   - `tools-list-override.ts` B3 Hybrid (JSON Schema examples preservation —
     assess for retention in Phase 3, not contamination)
   - public-resource auth policy surface
4. Add/adjust RED tests for:
   - widget resource contract
   - widget metadata contract
   - public-resource auth policy
   - `WIDGET_TOOL_NAMES` non-empty assertion: the current empty set makes
     widget metadata E2E tests pass vacuously (no assertions execute). Add a
     RED test that asserts `WIDGET_TOOL_NAMES.size > 0` — this should fail now
     and turn GREEN when Phase 3 re-populates the set.
5. Record expected RED failure reason and planned GREEN evidence for phases 1-6.
   Record this in the **Evidence** section below — each phase gets one row with:
   RED command, expected failure reason, target GREEN phase, and GREEN evidence.
6. Rewrite active normative docs that still direct execution toward the dead
   widget runtime model

## Acceptance Evidence

1. Contamination inventory is captured and linked to downstream phases
2. RED tests fail for expected reasons (and are not vacuous)
3. No active doc still prescribes preserving legacy widget runtime behaviour
4. `WIDGET_TOOL_NAMES` non-empty RED assertion is in place and failing

## Evidence

Record the RED/GREEN contract for each downstream phase here during execution.

| Phase | RED command | Expected failure | GREEN phase | GREEN evidence |
|-------|-----------|------------------|-------------|----------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
