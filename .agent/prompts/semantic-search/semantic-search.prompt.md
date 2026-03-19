---
prompt_id: semantic-search
title: "Semantic Search Session Entry Point"
type: handover
status: active
last_updated: 2026-03-19
---

# Semantic Search — Session Entry Point

This is a working handover document. Keep it concise and operational.

---

## Active Authority

- Active findings authority:
  [search-tool-prod-validation-findings-2026-03-15.md](../../plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md)
- Active execution authority:
  [comprehensive-field-integrity-integration-tests.execution.plan.md](../../plans/semantic-search/active/comprehensive-field-integrity-integration-tests.execution.plan.md)
- Session bootstrap and lane-order authority: this prompt

Current lane objective:

- Build and execute a comprehensive proof framework for search pipeline
  correctness (`all fields`, `all stages`) before any further ingest attempt.
- Keep work anchored to active findings `F1`/`F2` and update dispositions with
  deterministic evidence.

Current handover state (fresh-session anchor, updated 2026-03-19):

- Phase 0/1/2 implementation work is complete in the current worktree:
  - shared `search-contracts` package,
  - manifest-driven field-integrity suite,
  - stage and cross-stage integrity tests,
  - retrieval integrity tests,
  - ledger-driven readback audit operation.
- Root-cause investigation completed (2026-03-19):
  - **F1** (`threadSlug`): confirmed stale index, not a code defect. Full
    pipeline proven correct. Source data verified as fully populated. No code
    fix needed — re-ingest resolves.
  - **F2** (`category`): confirmed `categoryMap` is never wired into the
    ingestion pipeline. `buildCategoryMap()` exists and is tested but
    `extractAndBuildSequenceOperations()` never passes it to
    `buildSequenceBulkOperations()`. **Code fix required before re-ingest.**
    Target file: `apps/oak-search-cli/src/lib/indexing/bulk-ingestion-phases.ts:141-145`.
- Phase 3 closure is blocked on:
  1. F2 code fix (wire `categoryMap`),
  2. reviewer closure cycle (not yet run on current diff),
  3. operator re-ingest + readback (Task 2.3 evidence still pending).

---

## Session Start Sequence

### Step 1: Ground

- [start-right-thorough.md](../../skills/start-right-thorough/shared/start-right-thorough.md)
- [AGENT.md](../../directives/AGENT.md)
- [principles.md](../../directives/principles.md)
- [testing-strategy.md](../../directives/testing-strategy.md)
- [schema-first-execution.md](../../directives/schema-first-execution.md)

### Step 2: Verify live state

Before any mutation, run admin readbacks:

- `validate-aliases`
- `meta get`
- `count`
- `oak_meta` mapping contract check

From repo root, use:
`pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin <subcommand>`.

Then run field-level readbacks for active blind fields (`thread_slugs`,
`category_titles`) and keep evidence in the active findings register.

Policy:

- Use search CLI/admin commands and dedicated operations scripts only.
- No ad-hoc shell text scanning for validation decisions.
- If refresh-visibility is a factor, use the bounded retry discipline defined in
  the active execution plan.
- If a short admin check runs longer than 10 minutes, stop and escalate to the
  operator before any further mutation commands.

### Step 3: F2 code fix and closure refinement (next session priority)

1. **Fix F2**: Wire `buildCategoryMap()` into `extractAndBuildSequenceOperations()`
   in `bulk-ingestion-phases.ts`. TDD — write a test first proving categoryMap
   flows through to `buildSequenceBulkOperations()`. This is a small, focused
   change. See findings register for full root-cause detail.
2. Run full gates after the fix (`pnpm check`).
3. Confirm pre-ingest readiness gate status with current evidence.
4. Close any remaining ambiguity in `F1`/`F2` disposition wording/evidence links.

No new scope starts until these items are complete.

### Step 4: Final reviewer closure cycle (mandatory before completion)

Run reviewer cycle against the updated plan and this prompt:

1. `architecture-reviewer-barney`
2. `docs-adr-reviewer`
3. `test-reviewer`
4. `elasticsearch-reviewer`

Policy:

- Findings and suggestions are actionable by default.
- Fix all reviewer issues and suggestions unless explicitly rejected as
  incorrect with written rationale.
- Re-run affected reviewers after each fix round until closure.
- `test-reviewer` validates both plan/prompt alignment and the concrete test
  surfaces now present in the worktree.

### Step 5: Run review/fix cycle for active findings closure

Run specialist review/fix loops on code/docs touched while finalising `F1`/`F2`
status and evidence coherence.

### Step 6: Deep-update discipline for prompt/findings register

When execution state changes materially (new findings, status flips, reviewer
closure rounds, evidence additions), update both:

1. `semantic-search.prompt.md` (lane-ordering and current focus), and
2. `search-tool-prod-validation-findings-2026-03-15.md` (finding status,
   evidence links, disposition rationale)

in the same session before declaring completion.
If readiness-gate wording changes in either document, update the other in the
same session to keep authority surfaces consistent.

---

## Ingest Safety Policy

- Do not run ingest/promote commands until the execution plan records explicit
  readiness-gate closure.
- For operator-run ingest:
  1. agent prepares exact command and pre-check context;
  2. operator runs command independently;
  3. agent monitors output and proposes remediation.
- Agent does not start ingest commands unless explicitly requested in-session.

---

## Lane Indexes

- [Active Plans](../../plans/semantic-search/active/README.md)
- [Current Queue](../../plans/semantic-search/current/README.md)
- [Roadmap](../../plans/semantic-search/roadmap.md)
- [Archive](../../plans/semantic-search/archive/completed/README.md)
