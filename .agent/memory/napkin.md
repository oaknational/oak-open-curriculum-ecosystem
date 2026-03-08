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
