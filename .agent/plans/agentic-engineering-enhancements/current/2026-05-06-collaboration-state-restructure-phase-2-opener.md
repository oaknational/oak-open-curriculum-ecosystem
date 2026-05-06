---
status: opener
authored: 2026-05-06
authored_by: Briny Plumbing Fjord (claude-code, claude-opus-4-7-1m, fd36cf)
thread: agentic-engineering-enhancements
target_session_shape: execute Phase 2 of the collaboration-state surface-restructure plan
context_budget_for_directives: <30% (standing rule — Phase 2 edits agent-collaboration.md)
---

# Next session opener — Collaboration-state restructure, Phase 2

**Thread**: `agentic-engineering-enhancements`.

**Target**: execute Phase 2 of
[`collaboration-state-surface-restructure.plan.md`](collaboration-state-surface-restructure.plan.md)
under the placement contract at
[`.agent/memory/executive/collaboration-state-placement-contract.md`](../../../memory/executive/collaboration-state-placement-contract.md).

**Phase 2 work, sequenced as separate commits in the same phase**:

1. Move §Schema-Field Provenance from `collaboration-state-lifecycle.md`
   into `$comment_provenance` annotations on `active-claims.schema.json`
   (and the three sibling schemas where applicable). Lifecycle keeps a
   one-line pointer.
2. Move doctrine paragraphs from lifecycle.md (read/write posture,
   "resist unilateral cleanup", "visibility before deletion is the
   discipline", identity-preflight-gates-all-writes) into
   `agent-collaboration.md`. Lifecycle keeps recipe halves and cites.
3. **Separate commit, same phase**: vocabulary normalisation across the
   surface family — *stale* / *fresh-but-quiet* / *orphaned* / *expired*
   per the plan §Phase 2 step 3.
4. Re-tagline lifecycle.md and confirm every section is recipe-shaped.

**Boundary**: this is a *placement* restructure, not a behavioural one.
No TTL changes, no schema field reductions, no major-version bumps.

**Run**: `/jc-start-right-thorough` (Phase 2 edits a directive). Apply
the placement contract before each move; re-run `pnpm practice:fitness:informational`
and `pnpm practice:vocabulary` after each commit; dispatch
`docs-adr-reviewer` and `code-reviewer` with execution-legitimacy framing
once Phase 2 is staged (the contract is owner-decided, not up for review).
