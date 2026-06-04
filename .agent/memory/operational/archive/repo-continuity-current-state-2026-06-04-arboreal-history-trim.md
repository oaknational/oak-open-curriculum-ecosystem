---
archived_from: .agent/memory/operational/repo-continuity.md § Current State
archived_at: 2026-06-04
archived_by: Arboreal Sprouting Branch (claude / Opus 4.8 / 262b3f)
reason: >-
  Discharged 2026-06-01/02/03 session-close summaries trimmed from the live
  Current State index (HARD fitness). Each verified discharged; the live pickup
  state is carried in repo-continuity § Next Safe Steps, § Active Threads, and
  the thread banners. Disposition ledger:
  curator-passes/2026-06-04-arboreal-sprouting-branch-curation.md
---

# Repo Continuity — Current State archive (2026-06-04 Arboreal history trim)

Verbatim discharged session-close summaries moved out of the live
`repo-continuity.md` § Current State during the 2026-06-04 dedicated
knowledge-curation pass. These are history, not live pickup instructions. The
live state is in `repo-continuity.md` § Next Safe Steps, § Active Threads, and
each thread's banner. Nothing here is lost — it is conserved verbatim below.

## Discharged 2026-06-02 / 2026-06-03 session-close summaries

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

## Discharged 2026-06-01 session-close summary

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
