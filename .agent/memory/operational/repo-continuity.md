---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: 'Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here'
merge_class: index-narrative-tables
---

# Repo Continuity

Repo-level operational index for active thread state. Historical session-close
prose is archived under [`archive/`](archive/), with the latest pre-compaction
source snapshot preserved at
[`archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md`](archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md).
Detailed lane histories live in thread records, curator reports, completed
plans, and prior continuity archives; this file should stay a compact pickup
surface.

## Current State

- **MIGRATION PLAN OVERHAULED → VALUE-DRIVEN REDESIGN, renamed + reframed
  (2026-06-04, Twilit Cascading Supernova / `bb53a9`, claude / Opus 4.8,
  owner-directed)** — accepted Burnished's handoff (comms `0e2f7e7b`) and ran the
  overhaul deeper than the metaplan first framed. `graph-tools-substrate-migration.plan.md`
  → **[`graph-tools-value-redesign.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/future/graph-tools-value-redesign.plan.md)**
  (renamed via `git mv`, history preserved), re-derived from two constraints +
  design agency; behaviour-preservation AND the "migration" framing removed as
  bad-assumption residue. Per-corpus value-shapes decided: prior-knowledge =
  bounded subgraph (owner-ratified), thread-progressions = sequence projection
  (owner-ratified), misconception = **owner-directed graph** (curriculum-anchored
  bounded subgraph; thread→unit→lesson→misconception verified present in the bulk
  source). Owner-directed architecture (this session): **one bulk graph + bounded
  query views** (not fragmented graphs); **identity is deliberate — slugs are NOT
  guaranteed-unique ids, placement is an edge** (a lesson can be in >1 unit);
  **bulk-derived graphs and the Oak Ontology repo are SEPARATE concerns** sharing
  the substrate (concepts live in the ontology; cross-source join gated on the
  alignment audit). Metaplan `graph-migration-plan-overhaul.plan.md` driven to
  COMPLETED; features-plan §1 boundary reconciled; referrers repointed; 3 readiness
  reviewers (assumptions + architecture fred/betty) READY-WITH-CONDITIONS, all
  validated + applied. KG estate survey report written:
  [`graph-kg-estate-and-two-source-survey-2026-06-04.md`](../../reports/graph-kg-estate-and-two-source-survey-2026-06-04.md).
  **Owner-directed open item: review the entire `oak-kg` / ontology estate** as a
  distinct future activity (timing owner's; not yet planned). Plan stays PARKED on
  EEF D6 + D7 (EEF v1 consumes today's prerequisite + misconception tools as-is —
  must not be touched until EEF v1 ships). Two Claude auto-memory reflexes added
  (check the bulk source not the lossy projection; a present key is not a graph
  identity).
- **`.remember` PLUGIN DISABLED + de-referenced repo-wide (2026-06-04,
  Moonlit Waxing Nebula / `e756f7`, claude / Opus 4.8, owner-directed)** —
  the vendored `remember@claude-plugins-official` plugin is disabled in
  `settings.json` (repo-wide; takes effect at next session start) and
  `settings.local.json`. Rationale: its single-session one-shot `remember.md`
  baton collides with parallel-session practice (write-clobber + the deeper
  consume-collision that empties a peer's unconsumed opener) and is redundant
  against the versioned, claim-safe canonical continuity surfaces. The local
  corpus was mined (3 agents, ~1,400 lines) before deletion and returned
  ZERO orphans not already in a durable home — confirming redundancy. All
  permanent instructional surfaces de-referenced (6 skill docs, 2 rules, 1
  directive, ADR-144, distilled exemplar); historical records and ephemeral
  plan-body examples left intact. Commits `b188aa29` + `681e5d0f`, both
  full-hook-gate green. Canonical handoff is unaffected — it never depended
  on `.remember` (thread records + this file are the real baton).
- **REPO PROFESSIONALISM ASSESSMENT REPORT LANDED + ROUTED FOR PLANABILITY
  REVIEW (2026-06-03, Airy Whirling Wing / `019e8e`, codex / GPT-5)** —
  the formal assessment report is at
  [`oak-repo-professionalism-engineering-quality-report-2026-06-03.md`](../../reports/oak-repo-professionalism-engineering-quality-report-2026-06-03.md)
  and is indexed from `.agent/reports/README.md`. It gives the blunt verdict
  "high-skill, high-discipline, high-friction", ratings, evidence snapshot,
  risk modes, and a friction-reduction roadmap. It is now discoverable from
  plan index surfaces as an **assessment input, not an executable plan**:
  root `.agent/plans/README.md`, `high-level-plan.md`,
  architecture/current, DevX/current, agentic-engineering/current, and
  agent-tooling all point to it for a practical-planability assessment. Next
  safe step: run one bounded triage session that decides whether to cut
  practical plans from the roadmap, route items into existing plans, or retire
  the assessment thread with no new plan.
- **CAPABILITY TAXONOMY RATIFIED + DISTRIBUTION ESTATE LANDED (2026-06-03,
  Blustery Lifting Gale / `9b33b0`, claude / Opus 4.8, owner-directed
  throughout)** —
  [ADR-189](../../../docs/architecture/architectural-decisions/189-audience-led-agent-capability-taxonomy.md)
  ratifies the two-axis capability taxonomy: audience (repo-working skills /
  Oak developer capabilities / curriculum assistance capabilities) ×
  distribution locus (repo-internal / distributable / both), with
  `SKILL.md`/MCP/plugins as packaging-never-category. The
  [taxonomy plan](../../plans/discovery/future/skills-classification-taxonomy.plan.md)
  and the owner's
  [distribution-channels report](../../plans/discovery/future/skills-distribution-channels-suggestions.report.md)
  are homed side by side in `discovery/future/` (final of four owner-directed
  homes); the executive
  [vocabulary contract](../executive/agent-capability-vocabulary.md)
  carries both axes + the teacher-facing avoid-list. The first-party
  `oaknational/oak-skills` library (private; six user-facing skills, Claude
  plugin shape) is wired in as promotion-trigger evidence;
  [`agent-skills-discovery.plan.md`](../../plans/discovery/future/agent-skills-discovery.plan.md)
  gained §Installation Messaging Redundancy (owner requirement: redundant
  announcement surfaces; mutual announcement between capability tiers) and a
  reconcile-against-the-real-library note. Owner corrections folded: rigour
  standards (evidence/provenance/caveats/teacher judgement) are constraints
  inside capabilities, NOT branding; brand/tone classification stays the
  audit's open question. Reviewed in real time (docs-adr-expert +
  code-expert; ADR renumbered 188→189 after slot collision with the
  emission-binding plan's reservation; all findings dispositioned). The
  taxonomy plan is **promotable on owner direction** (blocking prerequisite
  met via ADR-189; trigger evidence recorded). **Integration of the library's
  user-facing skills into this repo is likely but undecided — owner
  decision, no committed scope.** Authority: the two plans above + the
  `agentic-mechanisms-discovery` thread record.
- **School-search synthesis report + gated POC plan LANDED (2026-06-03,
  Furnace Roasting Brazier / `88a769`, claude / Opus 4.8)** — the
  self-contained synthesis of the three briefs + owner requirements is at
  [`school-data-search-synthesis-report-2026-06-03.md`](../../reports/school-data-search-synthesis-report-2026-06-03.md)
  (`36f1d61b`): convergent foundation, 16 named owner forks, collision
  ledger vs repo doctrine, OpenAPI produced-spec inversion (F-A/F-B/F-C,
  ADR candidate), build-time verification ledger. The new
  [`school-data-search` collection](../../plans/school-data-search/README.md)
  (`26b7eb77`) carries the executable POC plan: gates G-1…G-9 → WS-D1
  decomposition → WS1–WS10 TDD workstreams. Reviewed in real time
  (assumptions-expert ×2, architecture-expert-betty, docs-adr-expert; all
  dispositions recorded). **Next: the owner gate session** — walk G-1…G-9
  against the report (it carries all considerations; no further research
  needed), then promote the plan to `active/`. Authority:
  [`school-data-search` thread record](threads/school-data-search.next-session.md).
- **UPSTREAM SEQUENCES API REALIGNMENT EXECUTED — all three plan todos
  complete, owner-approved adaptation route landed (2026-06-03, Moonlit
  Waxing Nebula / `e756f7`, claude / Opus 4.8, dedicated specialist
  session)** — evidence-first execution: the FULL OpenAPI diff was derived
  by direct JSON diff before any regeneration (one path removed, one
  added, `/subjects` collapsed to a slug-string enum, all 25 other paths
  unchanged — including `/sequences/{sequence}/units`), and a fresh
  authenticated bulk download proved the BULK DATA UNCHANGED (schema
  byte-identical to 2026-05-21; feature-request fields declared but
  populated in zero units). Verdict (owner-approved): search indexes
  CANNOT yet be built purely from bulk — `tiers`/`exam_subjects`/
  `unit_topics` still come only from `getSequenceUnits`, which survives;
  bulk-only remains the target, blocked upstream on
  `bulk_data_for_semantic_search.feature_request.md` Phases 1–2. Cure
  executed: API surface shrunk 2 → 1 endpoints — `getSubjectSequences`
  deleted everywhere (replace-don't-bridge), enumeration rewired to
  `getSubjectDetail` (`/subjects/{subject}`) consuming `sequenceSlugs`;
  `SubjectSequenceEntry` now derives from the schema
  (`SubjectDetail['sequenceSlugs'][number]`); sandbox fixture moved to
  `subject-detail.json`; evaluation api-checkers rewired; dead SDK guard
  trio removed; four mechanical fixes re-applied. Reviewed in real time
  (code-expert + type-expert; findings critically validated, accepted
  fixes applied). ALL gates green including online `pnpm check` — the
  recorded known-red is CLOSED. Named follow-up (pre-existing): the
  `SequenceUnitsFetcher` `Promise<unknown>` erasure through the
  ks4-context/sequence-facet traversal, recorded in the plan's
  execute-cure todo. Authority:
  [`upstream-sequences-api-realignment.plan.md`](../../plans/sdk-and-mcp-enhancements/current/upstream-sequences-api-realignment.plan.md)
  (§Verdict). **Post-realignment arc landed in the same session
  (commits `2b746ef9`, `dc399f3f`, `790fc098`, `23e50d9a`)**: the
  bulk-data POPULATION feature request
  ([`bulk_data_population.feature_request.md`](../../plans/semantic-search/current/bulk_data_population.feature_request.md),
  owner hands upstream 2026-06-04, incl. the `/api/bulk/schema`
  endpoint companion ask); the
  [`schema-change-minimal-adaptation`](../../plans/sdk-and-mcp-enhancements/current/schema-change-minimal-adaptation.plan.md)
  lane (two-tier Cardinal Rule ADR + six hardening todos,
  owner-ratified "yes to all");
  `bulk-schema-driven-code-generation.md` promotion APPROVED (move at
  its executing session); and the schema-strictness open question
  SETTLED — `.strict()` everywhere stands, strip/passthrough rejected,
  cure is drift freshness (recorded in
  `schema-resilience-and-response-architecture.plan.md` OQ1).
  **Next: owner-directed — the next session returns to EEF D4; the
  minimal-adaptation lane executes after or parallel to D4 on owner
  scheduling. Pushing remains the owner's call (branch ~25 ahead).**
- **EEF D3 OWNER-RATIFIED and COMMITTED (2026-06-03, Lacustrine Swimming
  Beacon / `687a54`, claude / Opus 4.8)** — independent review (full corpus
  census, cite-or-strike, V1–V8 re-verification, 4-lens refutation workflow
  with author re-grounding) found four real defects clustered in the
  contract's `members[]` cell, all fixed. Owner settlement: V1 extended
  (`closing_the_disadvantage_gap`, `headline.number_of_studies`,
  `implementation.digital_technology_application` — never second-class);
  metric filters deferred to `eef/future/eef-tool-metric-filter-inputs.plan.md`
  (trigger: D7 green + observed usage; D4 handoff is nine names); prompt
  renamed `adapt-lesson`; a corpus-cited strand index added to the resource
  (axis filters reach only the 17 tagged strands — the index is the
  corpus-complete discovery surface); declared-only exclusions recorded as
  snapshot-relative and self-healing. The `d3` todo is flipped. The day's
  working tree landed as four owner-directed full-gate-green chunks:
  `a0fd7b0f` (D3 ratification), `88d8da9d` (Antigravity identity slice),
  `6379f1e4` (taxonomy seed), `422e57e0` (continuity + lifecycle, incl. the
  orphan Seaworthy experience file). **Next: D4 (graph capability shape,
  binding the nine handed-off names); the branch is unpushed — pushing is
  the owner's call.** Full detail: `eef` thread banner.
- **Agentic curation history for 2026-06-03 lives in the
  `agentic-engineering-enhancements` thread record and curator ledgers.** The
  Antigravity identity slice (`88d8da9d`), taxonomy seed (`6379f1e4`), first
  accepted pending-graduations batch, and Lofty session-completion slice are no
  longer live pickup instructions; keep this file focused on the current
  curation state below.
- **JC4 unified substrate-migration plan AUTHORED — parked on a named
  trigger (2026-06-02, Galactic Glowing Prism / `cd7389`, claude / Opus 4.8,
  owner-approved session plan)** —
  [`graph-tools-value-redesign.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/future/graph-tools-value-redesign.plan.md)
  owns moving all three existing graph tools onto `graph-corpus-sdk`:
  per-corpus replacement units, ratified decisions carried with citations,
  open Decisions A–F settled at promotion (**trigger: EEF D6 + D7**). Two
  absorbed plans archived; the ADR-086 amendment rides the first
  re-emission. Four-specialist refutation review applied. **Next: EEF D3
  per EEF Next Safe Steps item 6.** Full detail: `eef` thread banner.
- **Graph-estate consolidation executed — t2–t5+t7 landed as one ship-unit at
  `c3b78eec` and PUSHED, full pre-push gate green; scoped t8 verification
  PASSED (2026-06-02, Opalescent Cascading Planet / `0340f9`, claude /
  Opus 4.8, owner-approved session plan)** — eleven plans archived to
  `kg/archive/completed/` with banners + one where-did-they-go record in
  `completed-plans.md`; the four misconception feature plans consolidated into
  `kg/future/oak-misconceptions-graph-features.plan.md` (each problem a named
  section; both assumptions-expert park-header conditions honoured;
  `maxResponseTokens=16000` marked retired); `oak-kg-threads-surface` +
  `nc-knowledge-taxonomy-surface` parked with substance-preserving
  block-condition headers; the KG README rewritten to the post-move reality;
  `graph-stack.plan.md` re-framed per ADR-173 (Inc.N/gate labels retired,
  landed WS statuses flipped, WS5 closed as executed-by-consolidation);
  every surviving live reference de-linked; `repo-continuity.md` verified
  zero-edit for retired tokens. Reviewed in real time (docs-adr-expert +
  adversarial dangling-pointer hunt; all findings remediated). `t6` + full
  `t8` close stay D7-gated; the `t8` todo is `pending` by design. **Next:
  author the Judgement-call-4 unified substrate-migration plan from the
  clean estate, then EEF D3.** Full detail: `eef` thread banner.
- **Mandate-1 deep contamination scan executed — estate clean after nine
  fixes (2026-06-02, Stellar Waning Planet / `64c383`, claude / Opus 4.8,
  owner-directed standing mandate)** — the scan covered the full
  four-commit session-output surface (`384b74de`, `9946ccf4`, `e8fe16e0`,
  `52cad7ee`; perimeter corrected at grounding). Method + complete ledger:
  [`mandate-1-contamination-scan-2026-06-02.md`](../../reports/mandate-1-contamination-scan-2026-06-02.md)
  (8 refutation-briefed reviewers + adversarial verification; 13 findings
  → 7 survived → all author-grounded; known-answer probe unfound,
  calibration recorded). Nine fixes: plan count/citation precisions (W2
  8-vs-11; JC3 heading "5"→four; D0–D2 completeness; meta-plan branch
  merged via PR #108), the temporal-seam buffer entry re-grounded to
  green-at-each-boundary, this file's item-7 heading restated to the
  one-thread order, the audit-workflow FILE_MAP path, and the
  `graph-corpus-sdk` root-barrel TSDoc rewritten to present truth.
  Cross-document consistency of the ratified sequencing/ownership/counts
  verified across all four plans + both thread banners + this file.
  **Spelling signal resolved in-session**: the owner directed British
  "judgement" estate-wide (executed as a mechanical sweep by a parallel
  cursor session, then scoped); the two generated vocab `data.json`
  snapshots are carved out — their strings are upstream caption-derived
  curriculum content and `pnpm sdk-codegen` would revert hand-edits; the
  upstream content defect is noted in the scan report §Spelling signal.
  **Next: graph-estate t2+t3+t4 → t5+t7 → scoped t8 in a fresh
  session**, then the JC4 unified substrate-migration plan, then EEF
  D3. Full detail: `eef` thread banner.
- **2026-06-02 Flamebright plan-review and Abyssal output-schema entries
  archived**: both are discharged history (mandates executed; output-schema
  state carried by open-questions Q-003 and the owning plans). Verbatim text:
  [`archive/repo-continuity-current-state-2026-06-03-blustery-history-trim.md`](archive/repo-continuity-current-state-2026-06-03-blustery-history-trim.md).
- **2026-06-01/02 Silvered resequencing, Coppery post-D2, Tempestuous
  comms-integrity, and Moonless curation entries archived**: all four are
  discharged history (the resequencing fully executed via mandate-1 +
  graph-estate t2–t5+t7 + EEF D3; comms-integrity landed with its plan as
  authority; curation outcomes live as the graduated rules, `distilled.md`,
  and the napkin archive). Verbatim text:
  [`archive/repo-continuity-current-state-2026-06-03-moonlit-history-trim.md`](archive/repo-continuity-current-state-2026-06-03-moonlit-history-trim.md).
- **Agent-readiness discovery promoted + root planning docs refreshed
  (2026-06-01, Umbral Whispering Silhouette / `019e83`, codex / GPT-5)**: the
  Oak ticket was re-verified against live standards and public Oak endpoints,
  then Phase 1 was promoted to
  [`discovery/current/agent-readiness-discovery-hub.plan.md`](../../plans/discovery/current/agent-readiness-discovery-hub.plan.md)
  with evidence in
  [`discovery/current/standards-verification-2026-06-01.report.md`](../../plans/discovery/current/standards-verification-2026-06-01.report.md).
  DNS-AID, Aila A2A, WebMCP, and Web Bot Auth now have gated future child
  plans; Web Bot Auth is first-class in discovery with security-and-privacy as
  the enforcement/evidence cross-link; `robots.txt` and sitemaps are recorded
  as general requirements for every official Oak web app. Root
  [`high-level-plan.md`](../../plans/high-level-plan.md) and
  [`plans/README.md`](../../plans/README.md) were overhauled so discovery is
  reachable from both strategic and operational planning entry points. Thread
  record:
  [`agentic-mechanisms-discovery.next-session.md`](threads/agentic-mechanisms-discovery.next-session.md).
  Controlling parent plan:
  [`agentic-mechanisms-discovery.plan.md`](../../plans/discovery/future/agentic-mechanisms-discovery.plan.md).
  Next safe step is `ar1-refresh-standards-and-live-estate`; no endpoint
  implementation, no commit, and no gates were run during the owner-requested
  light handoff.
- **Older May 31 / June 1 EEF and longitudinal-review history archived from
  the active pickup index**: detailed D1/value-reframe/no-escape-hatches/
  owner-question, pre-decision, and D0 history lives in
  `archive/repo-continuity-deep-consolidation-status-2026-06-02-shaded-veiling.md`;
  the 2026-06-01 EEF execution entries (D2 landing, seam-mapping, stub
  deletion, replacement-plan correction) live in
  `archive/repo-continuity-current-state-2026-06-02-seaworthy-eef-history.md`;
  live EEF execution truth is the `eef` thread banner plus the next-safe-step
  section below.
- **Current product focus**: `eef` graph-tooling rebuild is the only active
  product lane. The `agentic-engineering-enhancements` activity in this window is
  a temporary knowledge-curation lane, not a product implementation thread.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal
  sources, not long-term documentation. Outside explicit owner-gated research
  windows, process useful substance into memory/docs/plans and clear stale state.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild | [record][eef] | claude / Opus 4.8 / Shadowed Creeping Secret / eef-d4-whole-plan-review-then-ratify / 2026-06-04 (prior: Twilit Cascading Supernova migration-plan-overhaul 2026-06-04, Burnished Glowing Spark 2026-06-04, Lacustrine Swimming Beacon 2026-06-03, Seaworthy Swimming Sextant 2026-06-03, Galactic Glowing Prism + Opalescent Cascading Planet + Stellar Waning Planet + Silvered Lurking Mask 2026-06-02) |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work, starting with a deep review of the Oak Curriculum Ontology repo (separate concern from the bulk-derived graph redesign) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 — **opened, not started; deep review is a fresh session** |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Blustery Lifting Gale / skills-taxonomy-and-distribution / 2026-06-03 (prior: Umbral Whispering Silhouette 2026-06-01) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | codex / GPT-5 / Opalescent Illuminating Prism / dedicated-knowledge-curation / 2026-06-03 (prior: Lacustrine Swimming Beacon, Ashen Burning Magma, Solar Glowing Meteor, Stratospheric Buffeting Breeze, Lofty Sweeping Falcon, Shaded Veiling Mirror) |
| `repo-professionalism-assessment` | Repo professionalism / engineering-quality report → planability triage | [record][repo-professionalism-assessment] | codex / GPT-5 / Airy Whirling Wing / report-author-and-planability-router / 2026-06-03 |
| `school-data-search` | Oak School Data Search service (POC MVP): briefs → report → plan → gate walk → **deep review complete** → build | [record][school-data-search] | claude / Opus 4.8 / Fiery Sparking Caldera / deep-review-and-refinement / 2026-06-04 (prior: Mossy Whispering Bark 2026-06-04, Furnace Roasting Brazier + Hushed Lurking Mask 2026-06-03) |
| `semantic-search` | Search data foundations: upstream-schema alignment, bulk sourcing, minimal-adaptation arc | [record][semantic-search] | claude / Opus 4.8 / Moonlit Waxing Nebula / upstream-realignment-specialist / 2026-06-03 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `connecting-oak-resources` | Oak resource graph substrate for EEF | [record][connecting] | claude / Opus 4.8 / Galactic Glowing Prism / jc4-plan-authoring (kg collection) / 2026-06-02 (prior: Opalescent Cascading Planet, Stellar Waning Planet, Silvered Lurking Mask, all 2026-06-02) |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / Cycle 1 substrate capture / 2026-05-24 |
| `mcp-product-analytics` | MCP product analytics design and Path-to-GA Programme | [record][mcp-analytics] | Stellar Glowing Satellite / claude / claude-opus-4-7 / Programme landed + amendments / 2026-05-26 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 2026-05-10 |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / claude-code / 2026-05-06 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | Squally / cursor / 2026-04-30 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |
| `agent-collaboration-research` | Comms-corpus pattern research | [record][collab-research] | Twilit Orbiting Satellite / routing-sunset execution landed; research vector owner-gated / 2026-05-29 |

## Next Safe Steps

### School Data Search

All nine owner gates decided 2026-06-04, plus a high-stakes verification pass
(reopened/resolved three: G-1 F-C→F-B; G-6 NI register + Scotland geospatial;
coordinates dropped). **Deep review complete (2026-06-04, Fiery Sparking
Caldera): sound, faithful, build-ready** — refinements committed `1839e9b8`
(WS9 reuses `@oaknational/logger` stdio-only + `@oaknational/observability`;
new WS11 access-gated value-proof school-picker page; canonical-ID a tested
invariant + per-nation sourceId-identity check at WS4; England/GIAS
front-loaded; change_events/import-run-inspection deferred post-go; report §6
reframed; C-10 path fixed). **Next: WS-D1 (decomposition) →
`architecture-expert` betty + fred → G-8; draft ADR-190 (F-B produced-spec,
repo-wide forward guidance, justified on Zod-canonical merits) →
`docs-adr-expert`; promote to `active/`; begin WS1+.** Carry the verification
discipline + licensing guardrail. See the
[`school-data-search` thread record][school-data-search].

### Agentic Mechanisms Discovery

1. Treat the parent plan
   [`agentic-mechanisms-discovery.plan.md`](../../plans/discovery/future/agentic-mechanisms-discovery.plan.md)
   as the layer map for skills, MCP Server Cards, MCP runtime discovery, A2A,
   registry metadata, and generic AI discovery proposals.
2. Resume executable work from
   [`agent-readiness-discovery-hub.plan.md`](../../plans/discovery/current/agent-readiness-discovery-hub.plan.md),
   starting with `ar1-refresh-standards-and-live-estate`.
3. Keep Web Bot Auth in Phase 1 as a decision-ledger and security-evidence
   bridge; the future child plan owns any later enabled-control rollout.
4. Do not implement gated `future/` endpoints or metadata until the owner
   explicitly promotes the relevant child plan.

### Repo Professionalism Assessment

1. Start from the report:
   [`oak-repo-professionalism-engineering-quality-report-2026-06-03.md`](../../reports/oak-repo-professionalism-engineering-quality-report-2026-06-03.md).
2. Treat the plan-index links added 2026-06-03 as routing evidence, not
   execution authority. The report is an assessment input, not a plan.
3. Decide Q-005 in
   [`open-questions.md`](open-questions.md#q-005--can-the-repo-professionalism-assessment-be-cut-into-practical-plans):
   can a practical plan be made, and if yes, should it be one cross-cutting
   plan or separate plans under architecture/quality gates, DevX,
   agentic-engineering, and agent-tooling?
4. If plan work is justified, create or route it through the owning collection
   indexes; if not, record the no-plan verdict and retire this thread with a
   banner.

### EEF Graph-Tooling Rebuild

1. Re-ground in the `eef` thread banner and current git state.
2. D0 (fixed-data doctrine + validator removal + estate decontamination) and D1
   (teacher value contract) are complete and committed (`ce9745c7`, `f8548985`).
   The live plan reads as positive design, carried by one invariant: every tool,
   resource, prompt, graph operation, and handler is implemented with real
   graph-derived logic and tests, or it is absent. `EEF_TOOLKIT_DATA` is the only
   source of truth; relevance is by pedagogical move on EEF-native finite axes,
   and the value intersects Oak's misconception/prior-knowledge tools at the
   workflow level.
3. The two reviews (whole-plan + D2) are COMPLETE (2026-06-01, Windswept Floating
   Summit). The plan was corrected and enhanced: graph-view status truth, V1
   source-path fixes, optionality made first-class with verified corpus
   cardinalities, Decision 10 (deterministic data; the agent is the only reasoner),
   and a rewritten `## Sequencing` carrying the seam taxonomy + the "seams compose,
   never reconciled" law.
4. **D2 IS COMPLETE (2026-06-01, Lunar Transiting Eclipse, commit `9019bb86`,
   green + reviewed by code/type/test experts).** The typed raw-corpus foundation
   is built in `graph-corpus-sdk` (`EefStrand`/`EefStrandId`/`EefStrandById`/
   `isValidStrandKey`, raw domains, declared-vs-observed divergence, related-strand
   edges, corpus provenance); the old list-shaped EEF surface was removed across
   three workspaces; `OAK_CURRICULUM_MCP_EEF_ENABLED` is a dormant seam for D6. The
   source-path table is at `eef/current/eef-d2-source-path-table.md`.
5. **Contamination-correction arc (2026-06-01, commits `fb7ad234`, `70ccbef8`,
   `75b0734a`).** A fabricated key-stage→phase concept (the corpus holds phase and
   key-stage as two independent fields with no mapping) reached the canonical plan
   from a deleted prompt and was caught by the owner; removed, then an independent
   grounding audit + tombstone disposition pass cleared it. Lesson in Claude
   auto-memory (`harvest-from-deleted-is-contamination-vector`). The cite-or-tag
   corpus-grounding discipline is now a real `trigger-loaded` rule
   ([`.agent/rules/eef-corpus-grounding.md`](../../rules/eef-corpus-grounding.md));
   the stopgap doc was retired (graduated 2026-06-01).
6. **D3 (MCP tool/resource/prompt contract) is the next plan deliverable** —
   owner-ratified, `mcp-expert` SDK-registration verification pending. The D3/D4
   PENDING reviewers fire against the ratified D3/D4 outputs once those exist.
   **This session (2026-06-01, Dawnlit Dancing Satellite)** reviewed the whole plan
   and D3 with every corpus claim grounded against `EEF_TOOLKIT_DATA` (all
   cardinalities, the phase/key-stage independence, and the divergence verified
   exact; no fabrication). Applied post-D2 currency truth-fixes to the plan (D2
   `completed`; the never-built `EefKeyStage`/`EefPriority` replaced with the real
   projection inventory; already-removed surfaces corrected) and added the missing
   attribution rows to the source-path table. A session-built `field-cardinality.ts`
   projection was **backed out** (owner-directed) as a zero-consumer surface
   restating an inherent type fact — the floor/sparse split **is** `keyof EefStrand`,
   carried by the corpus type, derived at D6 from the graph-native view via the
   `satisfies` tie; there is no separate structure to build. The thread banner now
   carries an explicit GOOD/GREAT quality bar. **D3 is advanced to ratifiable
   output (2026-06-02, Seaworthy Swimming Sextant)**: the whole-plan and D3
   reviews ran (4-lens refutation workflow, findings applied), the declared-only
   filter-exclusions edit is applied in D3, and the contract + SDK/app
   verification record are authored in
   [`eef-d3-mcp-contract.md`](../../plans/sector-engagement/eef/current/eef-d3-mcp-contract.md)
   with all four D3 PENDING reviewers run and their conditions applied. An
   owner-directed adversarial audit (2026-06-03) removed three author-invented
   surfaces; a pinned-target mcp-expert re-pass returned SIGN-OFF. **The
   review-then-ratify gate CLOSED 2026-06-03 (Lacustrine Swimming Beacon):
   D3 is owner-ratified + committed (`a0fd7b0f`). **D4 (graph capability shape)
   is now AUTHORED + RATIFIABLE (2026-06-04, Burnished Glowing Spark, committed
   `ca927e40`):** owner decision B made EEF a homogeneous strand graph (guidance
   reports inline; nine bound names → eight); the fundamental heterogeneous
   node/edge model is deferred-and-homed in the migration plan. **That migration
   plan was OVERHAULED → value-driven redesign and renamed
   `graph-tools-value-redesign.plan.md` (2026-06-04, Twilit Cascading Supernova);
   the `graph-migration-plan-overhaul.plan.md` metaplan is COMPLETED.** The
   node/edge model is now scoped there as one-bulk-graph + views with a deliberate
   identity model. **D4 + the whole EEF plan were REVIEWED and D4 OWNER-RATIFIED
   (2026-06-04, Shadowed Creeping Secret): 11 review corrections applied, the EEF
   and value-redesign plans verified coherent (manifest disposition mirrored both
   ways), the `d4` todo flipped to `completed`. D5 — build the new graph-core query
   layer (`GraphView<TNode, TNodeId, TEdgeType>`, `subgraph` only) + the EEF
   strand-view fresh — is the next safe step.** The redesign stays parked on EEF
   D6 + D7. See the `eef` thread banner.**
7. **Graph-estate-consolidation: t2–t5+t7 EXECUTED and pushed at `c3b78eec`;
   scoped t8 verification PASSED (2026-06-02, Opalescent Cascading Planet)**.
   The estate reads true in one pass: eleven plans archived with banners +
   index entries, the four misconception feature plans consolidated into
   `kg/future/oak-misconceptions-graph-features.plan.md`, both
   assumptions-expert park-header conditions honoured at the t4 move,
   the KG README rewritten, `graph-stack.plan.md` re-framed per ADR-173,
   surviving live references de-linked. `t6` + the full `t8` close are the
   only remaining graph-estate items and stay D7-gated (the `t8` todo is
   `pending` by design). **The Judgement-call-4 unified substrate-migration
   plan is AUTHORED (2026-06-02, Galactic Glowing Prism):**
   `kg/future/graph-tools-value-redesign.plan.md`, parked on the named
   promotion trigger EEF D6 + D7. **The next step in the ratified one-thread
   order is EEF D3 per item 6.**
8. The seam-mapping taxonomy + "seams compose" law is a candidate for a reusable
   plan template/archetype (owner-confirmed intent); tracked in
   [`pending-graduations.md`](pending-graduations.md).

### Agentic-Engineering Curation

1. The 2026-06-03 docs bundles are committed (`a0fd7b0f`, `88d8da9d`,
   `6379f1e4`, `422e57e0`); current curation is Opalescent's dedicated pass.
2. `napkin.md` has been processed through the Opalescent item-level ledger and
   preserved as `active/archive/napkin-2026-06-03-opalescent-curation.md`.
   The PDF-only ChatGPT report-normalisation protocol graduated into the
   canonical skill and pattern; the pre-archive ledger tripwire graduated into
   the consolidation/handoff skills. Remaining register items are owner-gated
   or trigger-gated.
3. The abandoned commit-queue residue entries in `active-claims.json` remain a
   secondary cleanup signal; do not treat them as current commit authority.
4. The relative-link integrity item is accepted as a future validator lane, not
   implemented tooling; promote the plan only on its recorded trigger.
5. Comms-event rotation remains paused until a dedicated comms research plan
   exists.

### Docs Consolidation Repair

1. For a later ordinary continuation, use
   [`codex-docs-consolidation.brief.md`](codex-docs-consolidation.brief.md).
2. Treat fitness as routing evidence only; do not archive, split, shard, rename,
   pointer-replace, or move unprocessed content to improve scores.
3. Continue item-level dispositions from active buffers and the canonical
   [`pending-graduations.md`](pending-graduations.md). Owner-gated items remain
   there until their trigger fires.
4. Comms-event rotation remains paused until a dedicated comms research plan
   exists.

### Connecting-Oak / PR History

Before resuming paused graph-substrate work, re-check current PR, CI, Sonar,
CodeQL, active claims, commit queue, and git state. Do not rely on historical
issue counts in archived prose.

## Open Owner-Decision Items

1. `pending-graduations.md` contains owner-gated doctrine and follow-up decisions;
   process only when a trigger fires or the owner directs.
2. MCP product analytics execution-plan promotion is deferred. Production PostHog
   capture still needs the legal/privacy gates named in the exploration record.
3. Monorepo workspace topology remains parked until after the graph MVP
   implementation tranche unless the owner reopens it.
4. Comms-event lifecycle research is owner-gated; do not rotate the event corpus
   from calendar age alone.

## Repo-Wide Invariants / Non-Goals

Each invariant below has a canonical home; this section is a resume aid, not the
authority.

- Comms-log rotation is paused until a dedicated comms research plan exists.
- No compatibility layers; replace, do not bridge.
- Distinct architectural layers live in distinct workspaces.
- TDD at all levels; tests prove product behaviour, not file presence.
- Strict validation happens only at boundaries.
- No `process.env` read/write in test files or setup files.
- `--no-verify` requires fresh per-invocation owner authorisation.
- No warning toleration.
- Owner direction beats plan.
- Curriculum data in this monorepo comes through the published Oak Open
  Curriculum HTTP API and generated SDK.
- Knowledge preservation is absolute; fitness warnings route work, not deletion.
- Shared memory/state files are always writable and commit-includable when dirty.

## Deep Consolidation Status

**ran this handoff → owner-directed (2026-06-04, Fiery Sparking Caldera /
claude / Opus 4.8 / `80d50a`, school-data-search deep-review close).** Owner
asked for full handoff + consolidation + last insights + commit. Session
insights homed: napkin (cross-thread-analogy correction; canonical-ID
sharpening); `distilled.md` (review-from-own-value lesson); experience file;
plan WS4 sourceId-identity sharpening (committed); Claude auto-memory
`feedback_no_cross_thread_analogy_in_review`. Cross-thread convergence (napkin
at 400+ lines → rotation; graph-thread graduations) is DUE but NOT bounded for
this single-thread review close — deferred to a dedicated curation pass, NOT
trimmed (conservation invariant); this index file is itself over its
line-limit → same deferred drain. Cross-platform memory: own-platform (Claude)
done; codex/cursor/gemini NOT read (single-lane review close).

**ran this handoff → owner-directed (2026-06-04, Twilit Cascading Supernova /
claude / Opus 4.8 / `bb53a9`, migration-plan-overhaul session close).** Owner
asked for full handoff + consolidation + insights + commit (eef-thread-scoped).
Converged this session: two Claude auto-memory reflexes
(`feedback_check_bulk_schema_before_declaring_data_unsourced`,
`feedback_present_key_is_not_graph_identity`) + MEMORY.md index; napkin captured
at full weight (already over the 300 line-limit pre-session — drain remains a
dedicated curation pass, NOT a trim, per the conservation invariant); experience
file landed; one ADR candidate recorded in pending-graduations (bulk-derived vs
ontology graphs as separate concerns sharing the substrate). **Deferred with
reason**: the cross-thread fitness sweep + cross-platform memory read
(codex/cursor/gemini) are thread-scoped curation this single-lane EEF-overhaul
session does not carry the context for — falsifiable: the next dedicated curator
can count the unread cross-platform surfaces and the napkin line-count. Verdict:
`session lessons converged; broad cross-thread curation deferred`.

Prior same-day pass: **owner-directed (2026-06-04, Burnished Glowing Spark /
claude / Opus 4.8 / `67b679`, EEF D4 contract session close).** Owner asked
for a full handoff + consolidate-docs + commit (eef-thread-scoped). Homed: the
value-first/existing-is-malleable lesson → Claude auto-memory
(`feedback_value_first_existing_is_malleable`) + `distilled.md` + the `eef`
banner; napkin captured at full weight (now over the 300 line-limit — drain is
a future dedicated curation pass, NOT a trim, per the conservation invariant);
experience file landed; the migration-overhaul metaplan ratified + handed to
Twilit (active lane, comms `0e2f7e7b`); decision-B graduation candidate
(node-kind-that-dedups-one-leaf) recorded in napkin. Cross-platform memory read:
own-platform (Claude) done; codex/cursor/gemini surfaces NOT read this session
(single-lane EEF close) — left for the dedicated curation pass.

Prior same-day pass: **owner-directed (2026-06-04, Mossy Whispering Bark
/ claude / Opus 4.8 / `fac519`, school-data-search owner gate session
close)** — full handoff + consolidate-docs; scope: napkin disposition,
graduation-candidate routing (synthesis-verification-discipline → PDR/rule
candidate; licensing guardrail → ADR candidate if the project proceeds),
cross-platform memory read.

Prior pass: **completed — session-completion mode, owner-requested
handoff + consolidation at the realignment session close (2026-06-03,
Moonlit Waxing Nebula / claude / Opus 4.8 / `e756f7`).** Fresh learning
homed: nine napkin entries (incl. two `candidate:` tags —
dissolution-by-re-attribution, PDR-shaped; opener-staleness third face),
one experience file (`2026-06-03-moonlit-the-verdict-before-the-plan.md`),
the new `semantic-search` thread record + Active-threads row. ADR
candidate (two-tier Cardinal Rule) is plan-owned
(`schema-change-minimal-adaptation` todo 1), not register-duplicated.
Entry points clean; tracks empty; practice box empty; pending-graduations
0 due; claims/queue clear. Fitness: this file's hard signal (35.2k/35k
chars) cured by the documented split_strategy — four discharged entries
archived verbatim to
`archive/repo-continuity-current-state-2026-06-03-moonlit-history-trim.md`.
Live buffers honestly remaining: experience-corpus cross-read (5+ files
landed today) is thread-scoped depth deferred to the next dedicated
curation pass — constraint: cross-corpus synthesis needs the
curation-lane context this realignment session does not carry;
falsifiable: the next curator can count today's unread experience files.
Verdict: `partial slice landed`. Prior status (Airy, not due —
assessment handoff) and older history: companion archive.

Previous completed curation slice: dedicated-knowledge-curation plus final
no-commit/no-check handoff by Opalescent Illuminating Prism on 2026-06-03. The
active napkin was processed through
`curator-passes/2026-06-03-opalescent-illuminating-prism-curation.md`,
preserved at `active/archive/napkin-2026-06-03-opalescent-curation.md`, and
reopened as a small live capture buffer; that slice is not the next pickup
lane.

**Historical deep-consolidation closeout entries archived.** Older closeout
prose from this section, dated 2026-05-31 to 2026-06-02, now lives in the
companion archive. The active status above is the current pickup state; the
archive is evidence, not a live queue.

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[mcp-analytics]: threads/mcp-product-analytics.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md
[oak-kg-ontology]: threads/oak-kg-ontology-planning-review.next-session.md
[school-data-search]: threads/school-data-search.next-session.md
[semantic-search]: threads/semantic-search.next-session.md
[agentic-mechanisms-discovery]: threads/agentic-mechanisms-discovery.next-session.md
[repo-professionalism-assessment]: threads/repo-professionalism-assessment.next-session.md
[collab-research]: threads/agent-collaboration-research.next-session.md
[branch-fitness]: threads/branch-fitness-and-push-cadence.next-session.md
