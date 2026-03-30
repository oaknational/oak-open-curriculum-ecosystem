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

## Tasks

1. Align active docs listed in WS3 parent plan Phase 6
2. Run readiness gate:
   - `pnpm qg`
3. Run full scrub before push/merge:
   - `pnpm check`
4. Run reviewer set listed in WS3 parent plan and address findings
5. Re-run canonical runtime contamination check from WS3 parent plan
6. Verify closure gates:
   - WS3/WS4 acceptance criteria are complete
   - C8 auth plans in `current/` are complete, or explicitly superseded by accepted architecture

## Acceptance Evidence

1. Active docs are mutually consistent (prompt, roadmap, umbrella, WS3 parent, indexes)
2. `pnpm qg` and `pnpm check` pass
3. Runtime contamination check is clean
4. Reviewer findings are resolved (including low priority)
5. Closure criteria for WS3/WS4 and C8 gates are satisfied
