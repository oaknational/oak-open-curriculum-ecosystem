## Session 2026-03-10 — Consolidate Docs Drift Sweep

### What Was Done

- Ran the `jc-consolidate-docs` sweep against semantic-search planning surfaces.
- Updated `.agent/plans/semantic-search/README.md` and
  `.agent/plans/semantic-search/roadmap.md` so they reflect the active
  short-term PR #67 snagging lane and current active-plan count.
- Removed stale deleted `.cursor/plans/...` references from
  `.agent/prompts/archive/consolidation-continuation.prompt.md`, keeping the
  canonical repo meta-plan as the authority.
- Fixed markdownlint warnings in the archived continuation prompt introduced by
  stale formatting blocks.

### Patterns to Remember

- Consolidation should always include stale-link sweeps for platform-plan paths
  (`.cursor/plans/*.plan.md`) because these files are ephemeral and easy to
  reference accidentally from durable docs.
- When active-plan lanes change, update both collection navigation
  (`README.md`) and strategic sequence docs (`roadmap.md`) in the same pass.

## Session 2026-03-10 — PR #67 Snagging Plan Refinement

### What Was Done

- Refined `.agent/plans/semantic-search/active/short-term-pr-snagging.plan.md`
  to enforce explicit decision boundaries (`FIX_NOW`, `FIX_LATER`, `DISAGREE`),
  add per-item evidence requirements, and strengthen RED/GREEN/REFACTOR closure.
- Tightened validation sequencing to one-gate-at-a-time local checks before
  remote PR re-check and explicit PR thread closure protocol.
- Updated prompt/plan discoverability chain:
  `.agent/prompts/semantic-search/pr-67-snagging-triage.prompt.md` now points to
  the active plan as execution authority; active README now includes standalone
  prose for the snagging entry.
- Ran read-only specialist reviews (`code-reviewer`, `docs-adr-reviewer`) and
  incorporated non-blocking documentation hygiene fixes.

### Patterns to Remember

- For snagging workflows, keep one canonical definition for structured triage
  fields (plan) and have prompts reference it to prevent drift.
- If active README prose links across the `.agent/` tree, verify relative paths
  from the current file location; depth mistakes are easy to make.

## Session 2026-03-10 — Short-Term Snagging Plan Authoring

### What Was Done

- Created a new executable active plan:
  `.agent/plans/semantic-search/active/short-term-pr-snagging.plan.md`.
- Framed the plan as a strict short-term snagging lane for PR checks and
  high-priority review findings, with RED/GREEN/REFACTOR phases, deterministic
  validation commands, non-goals, and risk controls.
- Updated active plan discoverability in
  `.agent/plans/semantic-search/active/README.md` with an A5 entry.
- Added a dedicated next-session prompt at
  `.agent/prompts/semantic-search/pr-67-snagging-triage.prompt.md` for
  item-by-item PR triage, including explicit evidence-based disagreement
  guidance for Copilot findings.

### Patterns to Remember

- For snagging plans, keep scope aggressively narrow: blockers first, then
  priority findings, then closure hygiene.
- Always make new active plans discoverable immediately via the active index.

## Session 2026-03-10 — Canonical URL Validation Layer (WS1-WS5)

### What Was Done

- Implemented the canonical URL validation layer per the integration plan
  (WS1-WS5). TDD throughout: RED tests first, GREEN implementation, REFACTOR.
- Core module: `validate-canonical-urls.ts` with binary search against sorted
  `teacherPaths`, batch validation, reference file loading with Result pattern.
- Typed discriminated union `SitemapRefError` with four error kinds:
  `file_not_found`, `invalid_json`, `schema_mismatch`, `unsorted_paths`.
- Comprehensive type guard `isSitemapScanOutput` checking all five consumed
  fields at the external data boundary (ADR-034).
- Sortedness invariant check on `teacherPaths` after loading — prevents binary
  search from returning silent incorrect results on unsorted input.
- Wired into `codegen.ts` as a post-generation step: warn-only on
  `file_not_found`, throw on all other error kinds.
- 25 tests (12 unit pure-function, 13 integration with fail-fast).
- All four specialist reviewers invoked (test-reviewer, fred, code-reviewer,
  wilma). All findings addressed: fail-fast throws, comprehensive type guard,
  direct string comparison (not localeCompare), sortedness validation.
- ADR-132 already existed. Plan updated to WS1-WS5 COMPLETE.

### Patterns to Remember

- `localeCompare` uses locale-sensitive collation that may not match
  `Array.prototype.sort()` default unicode order. For binary search against
  `sort()`-ordered data, use `===`/`<`/`>` operators directly.
- When loading external sorted data for binary search, always verify the
  sortedness invariant — an unsorted array causes silent wrong results, not
  crashes.
- Integration tests that depend on reference files should fail fast (throw at
  describe-block level) rather than silently skip — silent skips are prohibited
  skip equivalents.

---

## Session 2026-03-10 — Phase 3 Preparation (Dry Run, Logging, Count Tool)

### What Was Done

- Validated dry run end-to-end (Task 3.0 complete).
- Investigated document count discrepancy: `_cat/indices` reports 193k lesson docs
  vs 12,746 true parent docs. The 15x inflation is expected — ELSER `semantic_text`
  field chunking creates nested Lucene documents for each text chunk.
- Upgraded progress visibility: SDK index creation logging from `debug` to `info`,
  per-chunk upload progress with percentage, injected `ingestLogger` into lifecycle deps.
- Created `admin count` CLI command using ES `_count` API — reports true parent
  document counts excluding ELSER chunk inflation.
- Removed `SetupOptions` verbose flag infrastructure — logger DI handles this concern.
- Diagnosed stage hang: `createAllIndexes` with `semantic_text` fields triggers ELSER
  model loading (5+ minutes, no feedback). Fixed with per-index creation logging.
- All quality gates pass (excluding pre-existing `agent-tools` uv dependency).

### Patterns to Remember

- `_cat/indices` doc counts include ELSER `semantic_text` nested chunk documents —
  always use `_count` API for true parent document counts.
- ELSER model loading on first index creation with `semantic_text` fields can take 5+
  minutes. Always log before/after index creation so operators can distinguish "hanging"
  from "loading ML model".
- When a CLI process needs visibility and kill capability, give the command to the user
  to run in their terminal — don't execute via background agents.

---

## Session 2026-03-09 — PR #61 Merge, oak-preview MCP Smoke Test, Plan Update

### What Was Done

- Exercised all 37 tools on the `oak-preview` MCP server end-to-end: discovery,
  browsing, fetching, progression, search (all 5 scopes), download-asset. All
  returned 200. Large graph endpoints (thread-progressions 183K, prerequisite-graph
  1.5M) correctly spilled to disk.
- Updated PR #61 description to cover all 36 commits (was stale, only covered
  first 5). Organised by area: search rename, blue/green lifecycle, versioned
  ingestion, agent infrastructure.
- PR #61 merged to `main`.
- Updated the unified versioned ingestion plan: status line, new progress log
  entry, new Task 3.0 (dry run), remaining work list, Done When progress.
  Next session starts with `pnpm oaksearch admin ingest --dry-run --verbose`.
- Updated platform memory (versioned-ingestion-progress.md, MEMORY.md) to reflect
  the merge.

### Patterns to Remember

- When a PR description goes stale, organise commits by area (table format) rather
  than listing chronologically — readers need to understand the shape of the change,
  not the order it happened.
- MCP server smoke tests should exercise every tool, not just the common paths.
  The two large graph endpoints were the most interesting — they proved the
  spill-to-disk behaviour works correctly.

---

## Session 2026-03-09 — Consolidation + Castr Practice-Core Integration

### What Was Done

- Full consolidation pass (`/jc-consolidate-docs`). Documentation confirmed
  current. Napkin 388 lines (under 500), distilled 184 lines (under 200).
- Integrated Practice Core incoming from `castr` repo (provenance index 7,
  2026-03-09). All six Practice Core files adopted wholesale.
- Changes adopted: capitalisation consistency (`Practice Core`, `Practice Box`,
  `Practice Index`), stageable reviewer layer wording, paused workstreams in
  plan hierarchy, "Paused is not future" learned principle, title simplification
  ("The Practice"), table formatting.
- Fixed stale "via skills" Codex agent references in outgoing practice-context
  files (`platform-adapter-reference.md`, `reviewer-system-guide.md`) — Codex
  reviewers use `.codex/` project-agent config, not skills.
- Cleared both incoming directories (practice-core box + practice-context).
- Fitness check: 3 files slightly over ceiling (practice-lineage +10,
  practice-bootstrap +8, CONTRIBUTING +9) — flagged, not blocking.

### Patterns to Remember

- The Castr round-trip validated that the Core files handle mature-repo
  integration well — no blank-slate assumptions, stageable agent architecture.
- Practice-context outgoing files drift silently: the Codex model changed but
  the support docs weren't updated until Castr noticed.

---

## Session 2026-03-09 — Practice-Core Integration (new-cv round-trip)

### What Was Done

- Full integration of practice-core incoming from `new-cv` repo (provenance
  indices 3–5, 2026-03-05 to 2026-03-09). All six practice-core files updated.
- Appended provenance index 6 to all three trinity files.
- Created CHANGELOG.md (was missing locally — sixth practice-core file).
- Added `.codex/` to platform adapter lists throughout practice.md and
  practice-bootstrap.md.
- Adopted value traceability as plan workflow point 5.
- Replaced templates as required infrastructure with optional supporting
  artefacts.
- Lowered napkin distillation threshold from ~800 to ~500 lines across
  practice-core, consolidate-docs command, distillation skill, and napkin skill.
- Removed repo-specific ADR references from portable files (routed via
  practice-index).
- Adopted expanded learned principles in practice-lineage.md.
- Added Adaptation Levels, Restructuring path, Validation scripts sections.
- Adopted practice-context adjunct pattern references.
- Updated practice-index.md: added `.agents/` and `.codex/` directories,
  updated ADR-124 description from five-file to six-file.
- Cleared practice box and practice-context incoming.
- Also read practice-context/incoming/ support material (evolution-rationale,
  false-starts-and-corrections, codex-adoption-report, local-adaptations).

### Patterns to Remember

- When integrating a practice-core round-trip, read every line — not all
  changes are macroscopic. Naming changes (rules.md vs principles.md), threshold
  changes (800→500), and micro-formatting changes (italic style) all matter.
- The practice-core portable files use generic names (rules.md, invoke-reviewers)
  — the practice-index.md bridges to local names (principles.md,
  invoke-code-reviewers.md). This is by design.
- practice-context/incoming/ provides high-signal rationale that the changelog
  alone cannot convey. Read it before integrating, clear it after.

## Session 2026-03-09 — Unified Versioned Ingestion Plan

### What Was Done

- Created `unified-versioned-ingestion.plan.md` — a new execution plan that
  replaces the predecessor blue-green reindex plan. The new plan is grounded
  in architectural excellence: one pipeline, correct layer boundaries, types
  from schema, and full resilience coverage.
- Invoked all 6 pre-implementation reviewers (4 architecture, code, docs-adr).
  All 9 findings were incorporated as planned work — none deferred or dismissed.
- Resilience findings (partial success detection, orphaned index cleanup,
  all-failure reporting, Result pattern for data source errors) are addressed
  in Phase 2 Tasks 2.4-2.7, not deferred as follow-ups.
- Predecessor plan marked SUPERSEDED with reference to successor.
- Active plans README updated with new priority table.

### Patterns to Remember

- Never classify reviewer findings as "non-blocking" on behalf of the owner.
  Present all findings; let the human decide priority. "Risk acceptance is a
  human decision" (already in distilled.md) applies to finding classification
  too.
- When creating a successor plan from a failed execution, the predecessor's
  root cause analysis and completed prerequisites are valuable historical
  records — reference them, don't duplicate them.
- Root cause clarity matters for commit messages: "format mismatch" (SDK
  assumed flat arrays, bulk files are BulkDownloadFile objects) is more
  accurate than "unknown[] type issue".

## Session 2026-03-08 — Stage/Promote Split

### What Was Done

- Added `stage()` and `promote(version)` to `IndexLifecycleService` (ADR-130),
  splitting the existing `versionedIngest` flow into two independent phases:
  stage (create, ingest, verify) and promote (swap aliases, write metadata,
  cleanup).
- `versionedIngest` remains as the all-in-one convenience.
- Extracted `promote` into `lifecycle-promote.ts` (lint max-lines/complexity).
- Extracted shared test helpers into `lifecycle-test-helpers.ts` and split the
  integration test file into two (main + stage/promote).
- Added `buildPromoteMeta` pure function + unit tests.
- Registered `admin stage` and `admin promote --version <v>` CLI commands.
- Updated ADR-130 and SDK README to document the new operations.
- 166 tests across 15 files, all quality gates green.

### Patterns to Remember

- When extracting a function to satisfy lint max-lines, decompose it into
  smaller helpers in the new file rather than moving the monolith — the
  complexity/statements limits will still fire otherwise.
- Shared test fixtures in lifecycle tests now live in `lifecycle-test-helpers.ts`
  to avoid duplication across the split test files.

## Session 2026-03-08 — Phase 8d Completion and Commit

### What Was Done

- Completed the max-lines extraction (Phase 8d): `lifecycle-rollback.ts` created
  in a prior session, commit was pending due to pre-commit hook timeout.
- Fixed commitlint failure: `ADR-130` in subject triggered sentence-case check;
  rewrote subject line to lowercase.
- Committed `bf23cefc` (31 files, +1496/-482) — all quality gates pass.
- Updated execution plan: marked Phase 8d done, revised "What to do next" for
  Phase 8b (final reviewer pass).
- Ran consolidation pass: no documentation drift, no patterns meeting extraction
  barrier, no ephemeral content needing promotion.

### Patterns to Remember

- Commitlint's `subject-case` rule rejects uppercase acronyms like `ADR-130` in
  the subject line. Use lowercase descriptions instead: "complete blue/green
  lifecycle" not "ADR-130 Phases 3-8d".
- When pre-commit hooks produce large output (turbo replays all cached logs),
  redirect to a file to see the actual error at the end.

## Session 2026-03-08 — Blue/Green Consolidation Pass

### What Was Done

- Ran `jc-consolidate-docs` after the ADR-130 blue/green implementation
  (WS0–WS4) and specialist reviewer pass completed.
- Verified ADR-130, execution plan, and all cross-references are current.
- Confirmed no blue-green content stranded in ephemeral locations (napkin,
  auto-memory, platform plans) — the execution plan is the standalone
  session entry point.
- No code patterns met the extraction barrier.
- Practice inbox empty; fitness ceiling overages unchanged from prior pass
  (CONTRIBUTING.md +9, practice-lineage.md +1, practice-bootstrap.md +30).

### Patterns to Remember

- The execution plan's "Implementation Notes" section is the right home for
  hard-won session lessons that are execution instructions rather than
  permanent documentation. They'll be useful for the next session but don't
  belong in ADRs or distilled.md.
- When a plan is the standalone entry point for a future session, verify it
  during consolidation even if no new work was done in this session — drift
  accumulates between sessions.

## Session 2026-03-07 — Consolidate Docs Reconciliation Pass

### What Was Done

- Re-ran `jc-consolidate-docs` after the graph-planning surfaces stabilised and
  treated the newly added graph plans as canonical.
- Aligned `.agent/plans/high-level-plan.md`,
  `.agent/plans/semantic-search/README.md`,
  `.agent/plans/semantic-search/roadmap.md`, and
  `.agent/prompts/semantic-search/semantic-search.prompt.md` to the settled
  graph hierarchy:
  `kg-alignment-audit.execution.plan.md` active,
  `kg-integration-quick-wins.plan.md` queued as the parent follow-on plan.
- Brought milestone naming and quality-gate order back into sync across the
  touched planning surfaces, including restoring `pnpm subagents:check` to the
  high-level plan's gate list.
- Fixed the parent graph quick-win plan so its dependency and Phase 2 text now
  reflect the promoted alignment-audit child plan instead of pretending that
  audit work is still only queued in the parent.
- Removed absolute local-machine paths from
  `.agent/plans/semantic-search/active/kg-alignment-audit.execution.plan.md`
  by replacing them with repo URLs.
- Corrected the semantic-search prompt's stale unit NDCG figure and removed a
  hard-coded lesson benchmark sentence in favour of the Ground Truth Protocol
  and roadmap as the metrics authority.

### Patterns to Remember

- When a queued parent plan promotes one slice into `active/`, update all three
  layers together: frontmatter todo status, body phase descriptions, and the
  collection navigation surfaces.
- For cross-repo references inside committed docs, prefer stable URLs or
  relative repo notes over machine-specific absolute paths.
- If benchmark figures appear in more than one planning surface, designate one
  authority doc and make the others point to it instead of restating numbers.

## Session 2026-03-07 — High-Level Plan Reprioritisation

### What Was Done

- Updated `.agent/plans/high-level-plan.md` with an `Immediate Next Intentions`
  section reflecting the current user-priority sequence:
  snagging/deploy, post-deploy bulk-data re-download and reindex validation,
  MCP Apps migration work, then an ontology quick win.
- Tightened step 4 so the high-level plan points to promoting a quick win from
  `oak-ontology-graph-opportunities.strategy.md` into a dedicated execution
  plan, rather than treating the strategy note itself as the executable artefact.
- Updated `.agent/plans/semantic-search/oak-ontology-graph-opportunities.strategy.md`
  so the first quick-win framing explicitly includes provisioning a separate
  Neo4j instance for this repo, while preserving the alignment audit as the key
  architectural precursor.
- Updated
  `.agent/plans/semantic-search/elasticsearch-neo4j-oak-ontology-synthesis.research.md`
  so it now describes a Neo4j export/deployment path rather than implying this
  workstream already has a usable shared graph instance.

### Patterns to Remember

- If a strategic index points at near-term work from a `*.strategy.md` note,
  phrase it as promotion into a dedicated execution plan to avoid plan-type
  drift.
- For ontology/graph work, distinguish clearly between "the ontology project has
  a Neo4j path" and "this repo has access to a usable experiment environment".
- When introducing a delivery prerequisite, keep it separate from the main
  architectural precursor so sequencing logic stays legible.

## Session 2026-03-07 — Napkin Distillation

### What Was Done

- Archived the outgoing napkin to `.agent/memory/archive/napkin-2026-03-07.md` after the consolidation pass.
- Refined `distilled.md` with two durable reminders: rebuild the source package after cross-package moves, and sweep the live napkin when plan paths move.
- Reset the working napkin for subsequent sessions.

### Current State

- Practice inbox: empty (`.gitkeep` only).
- No additional durable content was found in Claude-side memory during this rotation.
- Remaining fitness overages to watch: `CONTRIBUTING.md` (+9), `practice-lineage.md` (+1), `practice-bootstrap.md` (+30).

## Session 2026-03-07 — Consolidate Docs Follow-Through

### What Was Done

- Ran the `jc-consolidate-docs` workflow against this session's live planning
  surfaces.
- Fixed top-level collection status drift in `.agent/plans/README.md` so
  agentic-engineering, developer-experience, and security-and-privacy no longer
  present as merely planned.
- Removed the accidental Milestone 2 blocker dependency from the queued
  semantic-search execution plans while keeping the real dependency on the
  active bulk-metadata stream explicit.
- Moved the superseded semantic-search sessions 1-5 log into
  `archive/completed/`, updated the collection README to point at the committed
  path, and fixed the remaining stale historical path in that record.
- Trimmed stale content from `distilled.md`: updated MCP tool counts from
  `23 + 7` to `23 + 8` and removed a stale-link-sweep reminder now codified in
  `.agent/commands/consolidate-docs.md`.

### Patterns to Remember

- Queue numbering (`P0`, `P1`, `P2`) belongs in navigation surfaces only unless
  the plan bodies use the exact same scheme; otherwise prefer plan names inside
  the plan text.
- Historical logs that stay live outside `archive/` need at least one README
  link, or they silently fall out of the discoverability chain.
- During consolidation, stale knowledge should be removed from `distilled.md`
  once the same guidance exists in a canonical command, ADR, README, or docs
  page.

## Session 2026-03-07 — Elasticsearch Specialist Capability Rollout

### What Was Done

- Executed the full elasticsearch-specialist-capability plan (Phases 0–4).
- Created canonical triplet: reviewer template, active-workflow skill, situational rule.
- Created platform adapters across Cursor, Claude, Gemini, and Codex.
- Updated coordination docs (AGENT.md roster, invoke-code-reviewers.md triage/examples).
- Updated stale counts in ADR-129, artefact-inventory, and practice-core provenance.
- Self-review by the elasticsearch-reviewer caught real issues: broken Serverless URL (404), stale ES Guide URL (301 redirect), wrong `.agent/research/` paths.

### Patterns to Remember

- Self-review validates doctrine: having the reviewer review itself is a practical smoke test for the live-docs-first workflow.
- Elastic documentation has migrated from `elastic.co/guide/...` to `elastic.co/docs/...` — old URLs redirect or 404. Always verify URLs with WebFetch before encoding them in templates.
- `research/` paths in this repo are under `.agent/research/`, not at the repo root.
- Bulk curriculum data changes over time; a full pipeline is redownload → reprocess → reindex.

## Session 2026-03-07 — Oak Ontology Opportunity Note

### What Was Done

- Added an Oak-specific opportunity note beside the external graph research
  notes, then later promoted that work into
  `.agent/plans/semantic-search/oak-ontology-graph-opportunities.strategy.md`.
- Added
  `.agent/plans/semantic-search/elasticsearch-neo4j-oak-ontology-synthesis.research.md`
  as the canonical synthesis with real links.
- Archived the superseded graph research notes with unstable inline citation
  markers under `.agent/plans/semantic-search/archive/`.

### Patterns to Remember

- When external research is broad and citations are unstable, preserve the
  durable architectural conclusions in a local note tied to current repo
  realities.
- For ontology integration, treat mismatch explicitly as a first-class design
  concern rather than assuming direct one-to-one joins.
- When the ontology source repo becomes available, replace generic
  \"triples in Neo4j\" language with the ontology's own concrete model:
  RDF/OWL/SKOS/SHACL, programme-unit-unit-variant-lesson-thread structures, and
  early-release volatility.
- The ontology repo also distinguishes source RDF shape from the operational
  Neo4j shape via an export transformation pipeline; research and strategy docs
  should not blur those two contracts.

## Session 2026-03-07 — KG Integration Quick-Wins Plan

### What Was Done

- Added `.agent/plans/semantic-search/current/kg-integration-quick-wins.plan.md`
  as the first dedicated queued plan promoted from the ontology graph strategy.
- Made the plan answer the runtime-shape question directly: keep flat RDF
  distributions for provenance and rebuilds, but use the exported Neo4j graph
  plus selected Elasticsearch projections for operational quick wins.
- Updated semantic-search navigation and the high-level plan so the new graph
  quick-win plan is now part of the discoverability chain.

### Patterns to Remember

- For ontology-backed search work, flat files are best treated as canonical
  release artefacts and rebuild inputs, not as the primary runtime query
  surface.
- The first Elasticsearch/Neo4j integration step should be application-layer
  orchestration and batch projection, not brittle live cross-engine joins.
- The safest early graph wins are overlap auditing, explanation surfaces,
  small projection indices, and offline graph-derived features.

## Session 2026-03-07 — Alignment Audit Promotion

### What Was Done

- Promoted the alignment-audit slice from the parent graph quick-win plan into
  `.agent/plans/semantic-search/active/kg-alignment-audit.execution.plan.md`.
- Made the promoted plan explicit about two things that were previously too
  implicit: the exact outputs it must produce, and the specific docs/plans that
  must be updated once those outputs exist.
- Updated semantic-search active/current/navigation docs and the high-level
  plan to reflect that graph work now has an active evidence-first lane.

### Patterns to Remember

- When promoting a research-backed quick win into active execution, the plan
  should name not only the work to do but the repo artefacts that completion
  must update afterwards.
- Alignment audits need both machine-rerunnable implementation and a
  human-readable canonical report; raw script output alone is not enough.

## Session 2026-03-07 — Consolidate Docs Recheck

### What Was Done

- Re-ran the `jc-consolidate-docs` checks against the newly promoted graph
  planning surfaces.
- Removed the last stale semantic-search README wording that still described
  the ontology strategy as feeding only a future graph quick-win plan.
- Reconfirmed that the practice inbox is empty and that the semantic-search
  roadmap and prompt already reference the active alignment-audit plan and the
  queued parent quick-win plan consistently.

### Patterns to Remember

- After plan promotion, stale wording often survives in explanatory sections
  even when tables and queues are already correct; sweep narrative paragraphs as
  well as status tables.
- Fitness ceilings are signals, not blockers: `CONTRIBUTING.md`,
  `practice-lineage.md`, and `practice-bootstrap.md` remain slightly over and
  should be treated as future consolidation candidates.

## Session 2026-03-07 — Live MCP Smoke Test and Upstream Bug Report

### What Was Done

- Conducted a systematic black-box smoke test of the deployed `oak-preview` MCP
  server, then classified findings by ownership: our code, upstream API, stale
  ES data.
- Fixed two code defects using TDD:
  1. `searchSequences` and the CLI `rrf-query-builders.ts` now apply a
     `key_stages` term filter when `keyStage` is provided (was silently dropped).
  2. Codegen source for `SearchSuggestionItemSchema` relaxed `url` from
     `z.string().min(1)` to `z.string().optional().default('')`.
- Wrote a precision bug report at `.agent/reports/oak-openapi-bug-report-2026-03-07.md`
  documenting three upstream `oak-openapi` issues with exact file/line references
  from the upstream source code.
- Fixed `.gitignore` so `.agent/reports/` is not excluded by the broad
  `**/reports/` Node.js diagnostic pattern.
- Updated the snagging plan to acknowledge the additional fixes committed on the
  same branch.

### Patterns to Remember

- When smoke-testing a live service, classify findings by ownership before
  fixing: our code, upstream API, stale data. This prevents wasted effort fixing
  the wrong thing.
- The `**/reports/` gitignore pattern catches `.agent/reports/` — always check
  that new directories are not accidentally ignored.
- Cross-repo bug reports are far more actionable with precise file/line
  references from the upstream source. If you have access to the code, cite it.
- Codegen-emitted Zod schemas must match what the runtime actually produces, not
  what the upstream ideally provides. The runtime emits `url: ''` for
  suggestions; the schema must allow it.

## Session 2026-03-10 — Oak Preview MCP Server Smoke Pass

### What Was Done

- Ran a live black-box smoke test against the deployed `oak-preview` MCP server
  (not local files), with schema-first invocation.
- Verified prerequisite orientation call: `get-curriculum-model`.
- Exercised discovery and browsing flows:
  `browse-curriculum`, `search` (`lessons`, `threads`, `suggest`), and
  `explore-topic`.
- Exercised retrieval flows:
  `fetch` (`unit:comparing-fractions`, `lesson:photosynthesis`),
  `get-lessons-assets`, and `download-asset`.
- Exercised large payload graph endpoints:
  `get-thread-progressions` and `get-prerequisite-graph`, confirming successful
  response and spill-to-file behaviour.
- Verified failure surfaces are informative:
  404 for unknown lesson slug and validation error for `suggest` without
  `subject` or `keyStage`.

### Patterns to Remember

- For this MCP setup, always read tool descriptor JSON first, then invoke tools;
  this avoids argument-shape mistakes and aligns with the MCP contract.
- A strong smoke pass should include both happy paths and intentional bad-input
  calls to validate fail-fast error messages.
- Large graph tools should be explicitly exercised during smoke checks because
  spill-to-file behaviour is an important runtime path, not an edge case.
- `get-rate-limit` returning `limit: 0, remaining: 0, reset: 0` can be expected
  when using the special no-limits key; do not misclassify that output as a
  fault.

## Session 2026-03-11 — Pre-merge Reviewer Tranches

### What Was Done

- Ran reviewer tranches in pairs across `main...HEAD`: `code-reviewer`, all four
  architecture reviewers, `docs-adr-reviewer`, `type-reviewer`, and
  `test-reviewer`.
- Fixed CLI/SDK boundary drift by moving `admin count` through
  `AdminService.countDocs()` and wiring the CLI via SDK (not raw ES client calls).
- Standardised doc-count verification on Elasticsearch `_count` in
  `verifyDocCounts` to avoid semantic-text inflated `_cat/indices` counts.
- Added fail-fast input validation (`parseMetaJson` upfront, empty `--bulk-dir`,
  empty `--file`) and strengthened tests for those branches.
- Replaced blocking `Atomics.wait` polling in `agent-tools` with async sleep.
- Updated docs/ADR drift (`ARCHITECTURE.md`, workspace READMEs, ADR-133 status),
  and extracted duplicate OTel log-record
  test parsing helpers.

### Patterns to Remember

- When an admin command talks to Elasticsearch directly, prefer moving the
  operation into SDK admin service APIs to preserve ADR-030 boundaries.
- If one command reports true parent counts with `_count`, any verification
  path must use the same metric source or operators will get contradictory
  numbers.
- Reviewer tranches uncover cross-cutting drift (docs + tests + architecture);
  apply fixes tranche-by-tranche and re-run targeted checks after each slice.
