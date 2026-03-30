---
name: "WS3 Phase 6: Docs, Gates, Review, Commit"
overview: "Finalise normative docs, run canonical gates, complete reviewer passes, and close WS3/WS4 with C8 closure checks."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: docs-sync
    content: "Rewrite and align active normative docs to the fresh MCP App architecture."
    status: pending
  - id: gates
    content: "Run canonical readiness and full-scrub gates."
    status: pending
  - id: reviewer-pass
    content: "Run required reviewer set and address findings."
    status: pending
  - id: closure-checks
    content: "Verify WS3/WS4 acceptance plus C8 closure gate status."
    status: pending
---

# WS3 Phase 6: Docs, Gates, Review, Commit

## Required Inputs

1. `ws3-widget-clean-break-rebuild.plan.md` — Phase 6 section lists specific
   docs to rewrite and the full reviewer set
2. `roadmap.md` — closure criteria
3. `mcp-app-extension-migration.plan.md` — umbrella exit criteria
4. `current/auth-safety-correction.plan.md` — C8 closure gate status
5. `current/auth-boundary-type-safety.plan.md` — C8 closure gate status
6. Phase 0 evidence table — verify all RED/GREEN contracts are satisfied

## Tasks

1. Align active docs listed in WS3 parent plan Phase 6
2. Run full scrub:
   - `pnpm check`
3. Run reviewer set listed in WS3 parent plan and address ALL findings
4. Re-run canonical runtime contamination check from WS3 parent plan
5. Verify closure gates:
   - WS3/WS4 acceptance criteria are complete
   - C8 auth plans in `current/` are complete, or explicitly superseded by
     accepted architecture
   - Phase 0 RED/GREEN evidence table is fully populated with GREEN evidence

## Acceptance Evidence

1. Active docs are mutually consistent (prompt, roadmap, umbrella, WS3 parent,
   indexes)
2. `pnpm check` passes
3. Runtime contamination check is clean
4. ALL reviewer findings are resolved (all findings are blocking per project
   rules)
5. Closure criteria for WS3/WS4 and C8 gates are satisfied
6. Phase 0 evidence table shows GREEN for all 6 phases
