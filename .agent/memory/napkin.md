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
