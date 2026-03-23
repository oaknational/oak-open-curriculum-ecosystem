## Session 2026-03-23 — Boundary separation, clarification, and enforcement

### What Was Done (continued from reviewer findings)

- Completed full CLI-SDK boundary enforcement:
  - Exported all capability families from SDK `/read`: retriever builders,
    BM25 field constants + configs, semantic field names, query processing,
    score processing, highlights.
  - CLI's `rrf-query-builders.ts` now delegates ALL retriever shapes to SDK.
  - Migrated all 4 experiment builders (experiment, ablation, reranking,
    configurable) to import SDK building blocks — same change, per Betty.
  - Stripped `rrf-query-helpers.ts` from 412 lines to ~120 (filters + facets only).
  - Deleted 12 files: dead orchestrator, dead search modules, score normaliser,
    duplicate query processing directory (5 files).
  - Amended ADR-134 with capability family matrix documenting SDK ownership.
  - Added "Architectural Excellence Over Expediency" + "Layer Role Topology"
    principles to `principles.md` and Practice Core `practice-lineage.md`.
  - Created `apps-are-thin-interfaces` canonical rule + platform adapters.
  - Created `sdk-owned-retriever-delegation` code pattern.
  - Updated Practice Core provenance (index 8) and CHANGELOG.
- All quality gates green: 997 tests, 0 lint errors, type-check clean.

### Lessons

- "Boundary collapse" is the wrong framing. This was boundary SEPARATION,
  CLARIFICATION, and ENFORCEMENT. The boundary was always supposed to exist
  (ADR-134 defined it). The CLI grew code on the wrong side.
- Four architecture reviewers independently converging on the same finding
  is the strongest signal. When all four agree, act decisively.
- Betty's insistence that experiment builders be migrated in the same change
  was critical. The "I'll fix it later" pattern is how the drift happened.
- The fuzziness drift (CLI `AUTO` vs SDK `AUTO:6,9`) proved the violation
  was causing real search quality differences, not just aesthetic duplication.

---

## Session 2026-03-23a — Architecture reviewer findings + CLI-SDK boundary audit

### What Was Done

- Ran all 4 architecture reviewers (Barney, Betty, Fred, Wilma) on S1–S5 changes.
- Fixed Wilma critical #1: `buildOrderedUnitSummaries` now fails fast on invalid
  key stages (was silently truncating, violating ADR-139 §4).
- Fixed Wilma #3: Added `sequence_semantic` field-integrity assertion in builder test.
- Fixed Wilma #7: Added fail-fast contract TSDoc to `extractAndBuildSequenceOperations`.
- Collapsed thread retriever to SDK delegation (Barney W1, Betty F1, Fred F3):
  removed `createThreadRetriever` + `THREAD_BM25_FIELDS` from CLI, imports
  `buildThreadRetriever` from `@oaknational/oak-search-sdk/read`.
- Fixed stale "lexical-only" docstring in `sequences.ts` (Fred F2).
- Fixed TSDoc `@example` missing `sequenceSemantic` param (Barney W3).
- Replaced all `as` type assertions in test helpers with `isRecord`-based runtime
  narrowing (Barney W4).
- Created code pattern: `sdk-owned-retriever-delegation.md` — abstract pattern for
  collapsing app-local retriever builders to SDK delegation.
- All quality gates green: 1058 tests, 0 lint errors, type-check clean.

### Key Architectural Finding: CLI-SDK Retriever Boundary

**The full retriever duplication landscape** (discovered via reviewer convergence):

| Scope | SDK retriever | CLI retriever | Status |
|-------|--------------|---------------|--------|
| Sequences | `buildSequenceRetriever` | ~~`createSequenceRetriever`~~ | Collapsed this session |
| Threads | `buildThreadRetriever` | ~~`createThreadRetriever`~~ | Collapsed this session |
| Lessons | `buildFourWayRetriever(..., 'lesson')` | `createLessonRetriever` | **Still duplicated** |
| Units | `buildFourWayRetriever(..., 'unit')` | `createUnitRetriever` | **Still duplicated** |

The CLI's `createLessonRetriever` and `createUnitRetriever` duplicate the SDK's
`buildFourWayRetriever`. All four architecture reviewers independently flagged
the sequence/thread duplication; the lesson/unit duplication is the same pattern.

**Principle**: The SDK is the capability layer; the CLI is the operational interface.
Retriever shape construction is a capability (domain contract), not an operation.
CLI should import retriever builders from SDK `/read`, keeping only filter
construction (app-specific) and request assembly (CLI-specific).

### Lessons

- Four parallel architecture reviewers converge on the same structural finding
  from different perspectives (DRY, coupling, ADR compliance, drift risk). This
  is strong signal — structural patterns found by 3+ reviewers are real.
- `isValidKeyStage` guard was silently skipping units before Wilma caught it.
  Defensive guards that skip instead of throwing are silent data loss in
  fail-fast pipelines.
- Code pattern documentation (`sdk-owned-retriever-delegation.md`) crystallises
  the mechanical fix so future sessions don't re-discover it.

---

## Session 2026-03-22b — Pre-reingest remediation execution (Phases 1-3)

### What Was Done

- Executed Phases 1-3 of the pre-reingest remediation plan using **parallel
  worktree agents** (4 work units, all independent file sets, zero merge
  conflicts).
- WU-1 (S1): Implemented `generateSequenceSemanticSummary`, wired through
  `sequence-document-builder` and `bulk-sequence-transformer`. 4 new tests,
  fail-fast validation on empty units/empty semantic.
- WU-2 (S2+S3): Upgraded SDK `buildSequenceRetriever` to 2-way RRF (BM25 +
  ELSER semantic on `sequence_semantic`). Collapsed CLI duplicate retriever
  to SDK delegation. 17 new tests across SDK and CLI.
- WU-3 (S4): Added lessons `threadSlug` field-integrity test pinning
  `thread_slugs` → `term` filter against `SEARCH_FIELD_INVENTORY`.
- WU-4 (S5+docs): Added prod smoke section to INDEXING.md, updated RRF table
  in ARCHITECTURE.md, updated hybrid-retrieval research doc, added
  `sequence_semantic` to field-gap ledger.
- Integration required: fixing `builder-field-integrity.integration.test.ts`
  and `sequence-bulk-helpers.ts` (callers of `createSequenceDocument` needed
  the new `sequenceSemantic` param), updating `search-sequences.integration.test.ts`
  from standard-retriever to RRF-aware helpers, exporting `buildSequenceRetriever`
  from SDK `/read` subpath, and adjusting eslint overrides.
- All quality gates green: 1057 tests, 0 lint errors, type-check clean.

### Lessons

- Worktree agents branch from `main`, not the feature branch. When `main` and
  the feature branch have diverged (e.g., SDK retriever already RRF on main
  but standard on feature), patches don't apply cleanly. Manual file copy +
  reconciliation is needed.
- Making a params interface field required (adding `sequenceSemantic: string`)
  is a breaking change to every caller. Run `pnpm type-check` early to find
  all call sites — there are always more than you expect.
- The `/read` subpath in SDK package.json exports is separate from the root
  export. New functions must be explicitly added to `src/read.ts`.

---

## Session 2026-03-22a — Pre-reingest remediation plan + doc consolidation

### What Was Done

- User explicitly re-scoped priorities: ALL known bugs must be fixed before
  re-indexing, not just F1/F2 data fixes. Previously-deferred post-P0 items
  (sequence_semantic, 2-way RRF, CLI collapse, threadSlug test, prod smoke)
  are now blocking.
- Deep codebase investigation confirmed 5 outstanding issues (S1–S5):
  S1 (`sequence_semantic` unpopulated), S2 (lexical-only retrieval),
  S3 (CLI duplicate retriever), S4 (missing threadSlug field-integrity test),
  S5 (no documented prod smoke procedure).
- Created `pre-reingest-remediation.execution.plan.md` in `active/` with
  TDD phase model (RED/GREEN/REFACTOR/GATES) consolidating work items from
  `sequence-retrieval-architecture-followup.plan.md` and
  `search-contract-followup.plan.md`.
- Updated all cross-references: session prompt, active/README, current/README,
  F2 closure plan, both queued plans. All now correctly reflect the remediation
  plan as the immediate blocking action before re-ingest.

### Lessons

- When a user changes priority (from "deferred post-P0" to "active blocking"),
  the cross-reference update scope is wide: session prompt, active README,
  current README, the parent plan, and every referenced queued plan all carry
  stale "does not block re-ingest" / "queued" / "post-P0" language. Check all
  authority docs, not just the new plan.
- Creating a consolidation plan from two existing reference plans requires
  careful authority delineation: the remediation plan executes, the reference
  plans document the locked recipe. Both must link to each other.
- Ingestion always uses bulk data. Do not write speculative "if a future
  API-based ingestion path..." hedges — the bulk pipeline is the pipeline.

---

## Session 2026-03-21 — Consolidation and Phase 2 preparation

### What Was Done

- Deep update of execution plan and session prompt for fresh-session clarity:
  condensed Phase 1 detail into summary table, expanded Task 2.1 into full
  operator runbook, corrected CLI path (`bin/oaksearch.ts` not `src/bin/`).
- Updated findings register execution state to 2026-03-21.
- Updated all authority docs (execution plan, session prompt, current/README,
  findings register) and memory files (MEMORY.md, project memory, versioned
  ingestion tracker).
- Ran full consolidate-docs sweep (steps 1–10).
- Rotated napkin (498 lines → archive/napkin-2026-03-21.md).
- Distilled: "moving plan artefacts is cross-cutting" entry added.

### Lessons

- CLI entry points can diverge from plan documentation over time — always
  verify paths against `package.json` scripts or `glob` before documenting
  operator runbooks.
- Session prompts benefit from restructuring after phase boundaries: what was
  useful execution detail during Phase 1 becomes noise for Phase 2. Separate
  "where we are" from "what was done".

---

## Session 2026-03-21 — jc-consolidate-docs (validate-aliases documentation)

### What Was Done

- Extracted operational semantics of `validate-aliases` vs `admin count` to
  permanent `apps/oak-search-cli/docs/INDEXING.md`; linked from search-cli
  README, semantic-search prompt, F2 execution plan, agent guidance
  `semantic-search-architecture.md`, and distilled.md pointer.
- Fixed stale status row in `.agent/plans/semantic-search/active/README.md`
  (still showed Phase 1 task ordering).

### Lessons

- **Consolidate-docs step 1**: “How it works” for CLI behaviour belongs in
  workspace docs (INDEXING.md), not only in plans — plans stay execution-only.

---

## Session 2026-03-21 — Search F1/F2 bug locus + regression tests

### What Was Done

- Documented MCP vs SDK vs index evidence in
  `search-tool-prod-validation-findings-2026-03-15.md` (code trace section).
- Added oak-search-sdk tests: four-way lesson RRF filter parity
  (`rrf-query-builders.unit.test.ts`); sequence dual-retriever filter parity
  (`search-sequences.integration.test.ts`).

### Lessons

- Prod “same hit count” does not prove a filter is ignored when `total` is
  page-length and the baseline top-N may already satisfy the filter.
- Empty `category_titles` in API responses aligns with ingest/categoryMap
  issues, not MCP dropping `category`.

---

## Session 2026-03-21 — Search contract follow-up plan (queued)

### What Was Done

- Added `.agent/plans/semantic-search/current/search-contract-followup.plan.md`
  (lessons `threadSlug` field-integrity test + optional prod smoke, not CI).
- Linked from F2 execution plan (new todo + Task 3.3), `current/README.md`,
  `active/README.md`, findings register.

### Lessons

- Post-P0 work belongs in `current/` queue so F2 archive stays operator-focused.

---

## Session 2026-03-21 — Findings summary + prompt sync

### What Was Done

- Findings register **Summary** aligned with 2026-03-21 state (root causes known,
  code fixes in, prod closure pending re-ingest).
- `semantic-search.prompt.md`: `total` caveat, link to
  `search-contract-followup.plan.md`, Step 3 sync note.

---

## Session 2026-03-21 — jc-consolidate-docs sweep

### What Was Done

- Ran consolidate-docs steps: semantic-search prompts/plans cross-references OK;
  no `active/`→`archive/` link fixes needed; practice `incoming/` empty; napkin
  86 lines (under rotation threshold); no code-pattern extraction triggered.
- Fitness spot-check: `AGENT.md` 162/200 ceiling; `principles.md` 140; `distilled.md`
  188 — all within typical ceilings (verify frontmatter if any file grows).

### Lessons

- Consolidate-docs is mostly “verify and report” when authority docs were updated
  in-session already.

---

## Session 2026-03-21 — jc-consolidate-docs follow-up extraction

### What Was Done

- Extracted the newly settled sequence semantic-field design from queued
  semantic-search plan/prompt text into permanent workspace docs:
  `apps/oak-search-cli/docs/INDEXING.md` and `apps/oak-search-cli/docs/ARCHITECTURE.md`.
- Updated the external Claude memory note
  `versioned-ingestion-progress.md` to point at the current canonical F2/P0
  plan instead of the stale `active/unified-versioned-ingestion` path.
- Rechecked fitness ceilings and practice-box status during the sweep.

### Lessons

- When a user locks a future architectural direction ("this field stays and must
  be populated"), that decision should not live only in a queued plan or prompt;
  extract it into permanent technical docs immediately, even if implementation is
  deferred.
- Platform-specific memory can accumulate stale canonical-plan paths after plan
  promotion or lane changes; consolidate-docs should check those external notes,
  not just repo markdown.

---

## Session 2026-03-21 — Search CLI lint fix

### What Was Done

- Refactored `parseCliArgs` in
  `apps/oak-search-cli/operations/ingestion/field-readback-audit-cli.ts` by
  extracting per-argument parsing so the new `--target-version` support stays
  intact while `max-statements` passes.
- Verified `pnpm lint` exits 0 at repo root; package-local lint and the focused
  `field-readback-audit-cli.unit.test.ts` also pass.

### Lessons

- When `git status` shows a modified file but `git diff` appears empty, check
  `git diff --cached` before editing — staged-only changes can hide in-flight
  work that still needs preserving.
