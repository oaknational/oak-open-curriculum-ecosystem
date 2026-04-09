---
name: "WS3 Phase 6: Docs, Gates, Review, Commit"
overview: "Finalise normative docs, run canonical gates, complete reviewer passes, and close WS3/WS4 with C8 closure checks."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: docs-sync
    content: "Rewrite and align active normative docs to the fresh MCP App architecture."
    status: done
  - id: gates
    content: "Run canonical readiness and full-scrub gates."
    status: in_progress
  - id: reviewer-pass
    content: "Run required reviewer set and address findings."
    status: done
  - id: closure-checks
    content: "Verify WS3/WS4 acceptance plus C8 closure gate status."
    status: in_progress
  - id: handoff-commit
    content: "Record the production-startup and ESLint resolver-standardisation handoff state in the closeout commit and push PR #76 readiness evidence."
    status: in_progress
---

# WS3 Phase 6: Docs, Gates, Review, Commit

**Status**: ACTIVE MERGE HANDOFF — post-CI Vercel startup failure reopened the closeout; targeted recovery, built-artifact proof, and resolver-standardisation are green locally, final gates/preview/commit remain
**Last Updated**: 2026-04-09

Pre-merge docs, reviewers, and closure work had been complete, but the first
Vercel preview after CI exposed a production-only startup defect. The closeout
is therefore reopened long enough to land the built-runtime fix, add a
production-path proof, standardise the active-workspace ESLint resolver stack
so runtime-correct `.js` MCP SDK imports stay lint-clean, rerun the final
aggregate/preview checks, and push one truthful merge-handoff state before
PR #76 lands.

## Required Inputs

1. `ws3-widget-clean-break-rebuild.plan.md` — Phase 6 section lists specific
   docs to rewrite and the full reviewer set
2. `roadmap.md` — closure criteria
3. `mcp-app-extension-migration.plan.md` — umbrella exit criteria
4. `../archive/completed/auth-safety-correction.plan.md` — C8 closure gate status
5. `../archive/completed/auth-boundary-type-safety.plan.md` — C8 closure gate status
6. `../archive/completed/ws3-phase-4.5-live-react-and-metadata-shape.plan.md` —
   completed Phase 4.5 provenance and acceptance evidence
7. Phase 0 evidence table — verify all RED/GREEN contracts are satisfied

## Tasks

1. Align active docs listed in WS3 parent plan Phase 6
2. Re-run targeted production-path proof for the startup recovery:
   - `pnpm exec turbo run build --filter=@oaknational/oak-curriculum-mcp-streamable-http --continue --force`
   - plain-Node import of `dist/application.js`
   - focused built-artifact E2E coverage
3. Run full scrub:
   - `pnpm check`
4. Run reviewer set listed in WS3 parent plan and address ALL findings
5. Re-run canonical runtime contamination check from WS3 parent plan
6. Verify closure gates:
   - WS3/WS4 acceptance criteria are complete
   - C8 auth plans in `archive/completed/` are complete, or explicitly superseded by
     accepted architecture
   - Phase 0 RED/GREEN evidence table is fully populated with GREEN evidence
   - deployed preview/runtime startup is confirmed after push
7. Commit and push the branch so PR #76 has a single merge-handoff state

## Acceptance Evidence

1. Active docs are mutually consistent (prompt, roadmap, umbrella, WS3 parent,
   indexes)
2. Production-path proof passes for the built server entry surface:
   plain-Node import of `dist/application.js` and focused built-artifact E2E
3. `pnpm check` passes
4. Runtime contamination check is clean
5. ALL reviewer findings are resolved (all findings are blocking per project
   rules)
6. Closure criteria for WS3/WS4 and C8 gates are satisfied
7. Phase 0 evidence table shows GREEN for all 6 phases
8. The deployed preview/runtime startup path has been rechecked after push
9. The branch is committed and pushed with a single merge-handoff state for
   PR #76
