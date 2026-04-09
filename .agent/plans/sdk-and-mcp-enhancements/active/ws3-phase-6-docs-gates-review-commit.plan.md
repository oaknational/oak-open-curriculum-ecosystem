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
    status: done
  - id: reviewer-pass
    content: "Run required reviewer set and address findings."
    status: done
  - id: closure-checks
    content: "Verify WS3/WS4 acceptance plus C8 closure gate status."
    status: done
  - id: handoff-commit
    content: "Record merge-handoff state in the closeout commit and push PR #76 readiness evidence."
    status: done
---

# WS3 Phase 6: Docs, Gates, Review, Commit

**Status**: ACTIVE MERGE HANDOFF — pre-merge closure is complete and this plan stays live until the closeout commit is pushed and PR #76 is merged
**Last Updated**: 2026-04-09

Pre-merge docs, gates, reviewer remediation, and closure checks are complete.
Keep this plan active as the merge-handoff reference while the latest closeout
commit is pushed and until PR #76 lands; after merge it can be archived or
reused for the post-Phase 5 closure pass if needed.

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
2. Run full scrub:
   - `pnpm check`
3. Run reviewer set listed in WS3 parent plan and address ALL findings
4. Re-run canonical runtime contamination check from WS3 parent plan
5. Verify closure gates:
   - WS3/WS4 acceptance criteria are complete
   - C8 auth plans in `archive/completed/` are complete, or explicitly superseded by
     accepted architecture
   - Phase 0 RED/GREEN evidence table is fully populated with GREEN evidence
6. Commit and push the branch so PR #76 has a single merge-handoff state

## Acceptance Evidence

1. Active docs are mutually consistent (prompt, roadmap, umbrella, WS3 parent,
   indexes)
2. `pnpm check` passes
3. Runtime contamination check is clean
4. ALL reviewer findings are resolved (all findings are blocking per project
   rules)
5. Closure criteria for WS3/WS4 and C8 gates are satisfied
6. Phase 0 evidence table shows GREEN for all 6 phases
7. The branch is committed and pushed with a single merge-handoff state for
   PR #76
