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

Current handover state (fresh-session anchor, updated 2026-03-19 session 2):

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
  - **F2** (`category`): **Code fix implemented (2026-03-19 session 2).**
    `categoryMap` now wired through both the sequence path
    (`collectPhaseResults` → `extractAndBuildSequenceOperations` →
    `buildSequenceBulkOperations`) and the unit path (`processSingleBulkFile`
    → `createHybridDataSource` → `createBulkDataAdapter` →
    `createUnitTransformer`). `fetchCategoryMapForSequences()` added to
    `category-supplementation.ts`. Fails fast on API errors. All 1033
    search-cli tests pass. TDD evidence:
    `category-wiring.integration.test.ts`,
    `fetch-category-map.integration.test.ts`.
- **Blocking issue: Cardinal Rule breach.** The upstream OpenAPI schema now
  documents error responses (400, 401, 404) across endpoints. `pnpm sdk-codegen`
  fails at the response-map cross-validation step (`Extra (3): *:400, *:401,
  *:404`). This blocks `pnpm check` and therefore blocks all closure activities.
  See: `.agent/plans/semantic-search/current/codegen-schema-error-response-adaptation.plan.md`.
- The 404 decorator for transcript (`schema-enhancement-404.ts`) has been
  removed — the upstream schema now documents this response natively. The
  decorator infrastructure remains for future use.
- Phase 3 closure is blocked on:
  1. ~~F2 code fix (wire `categoryMap`)~~ — **DONE**,
  2. **codegen schema adaptation** (Cardinal Rule breach, see plan),
  3. Barney reviewer findings (3 items, all blocking — see below),
  4. remaining reviewer closure cycle (docs-adr, test, elasticsearch),
  5. operator re-ingest + readback (Task 2.3 evidence still pending).

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

### Step 3: Confirm Cardinal Rule is restored (prerequisite gate)

The codegen schema adaptation is handled in a **separate session** using
`.agent/plans/semantic-search/current/codegen-schema-error-response-adaptation.plan.md`.

Before resuming search work, confirm `pnpm sdk-codegen && pnpm build && pnpm check`
passes. If it does not, the codegen session must complete first.

### Step 4: Apply Barney reviewer findings (3 blocking items)

`architecture-reviewer-barney` reviewed the F2 fix (2026-03-19 session 2).
Three findings, all blocking:

1. **Add `fetchCategoryMapForSequences` to `BulkIngestionDeps`** — the function
   is called directly in `bulk-ingestion.ts` instead of through the DI surface.
   One-line addition to interface + default deps.
2. **Tighten `CategoryFetchDeps` return type** — currently `{ ok: boolean;
   value?: unknown; error?: unknown }`, should use discriminated union
   `Result<unknown, unknown>` from `@oaknational/result`.
3. **Remove stale `@see ADR-xxx` placeholder** in `category-supplementation.ts`
   TSDoc (line 25).

### Step 5: Final reviewer closure cycle (mandatory before completion)

Run reviewer cycle against the updated plan and this prompt:

1. ~~`architecture-reviewer-barney`~~ — **completed**, findings in Step 4
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

### Step 6: Run review/fix cycle for active findings closure

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
