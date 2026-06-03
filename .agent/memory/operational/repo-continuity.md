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

- **School-search research briefs normalised; report+plan session is the
  owner-directed NEXT session (2026-06-03, Hushed Lurking Mask / `75123f`,
  claude / Opus 4.8)** — the three gitignored reference-local briefs are now
  clean markdown siblings, and the owner added `additional-requirements.md`
  (POC builds in this repo; every API exposes strict OpenAPI 3.x). **Next:**
  author the tracked synthesis report, then the plan, from the four inputs.
  Authority and citation/provenance details:
  [`school-data-search` thread record](threads/school-data-search.next-session.md).
  Sequencing note: the upstream-sequences realignment below remains the
  standing top-priority item for its dedicated specialist session; the owner
  has explicitly directed the school-search report+plan session as next.
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
  (§Verdict). **Next: pushing is the owner's call; the upstream
  feature-request chase (bulk Phase 1–2 population) is the path to
  bulk-only ingestion and the deletion of the remaining supplementation
  endpoint.**
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
  [`graph-tools-substrate-migration.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/future/graph-tools-substrate-migration.plan.md)
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
- **One-thread resequencing ratified + estate corrections — committed
  `e8fe16e0` and PUSHED, full pre-push gate green (2026-06-02, Silvered
  Lurking Mask / `bbb696`, claude / Opus 4.8, owner-directed)** — the owner
  ratified: EEF + graph decontamination/consolidation + graph enhancements +
  substrate migration are ONE thread; **decontamination + consolidation
  execute FIRST** (graph-estate t2–t5/t7/t8 precede EEF D3+), preceded only by
  the mandate-1 deep contamination scan. Output schemas: **the EEF tool's
  lands first and alone via EEF D6**; the 3 existing graph tools receive
  theirs WITH their substrate migration (one replacement unit per tool:
  data/type re-emission + rewrite + `outputSchema`; untouched before it);
  rest per type; required/root promotion last — recorded in
  `output-schemas-for-mcp-tools.plan.md` §Resolved Sequencing +
  `graph-tool-output-schemas.plan.md` + graph-estate Judgement call 4. D7
  proves value on the live bulk tools; scaling is the migration's. Corruption
  removed (stale D6 conditional, superseded sequencing, OPEN-DECISION refs,
  the pre-existing 5-vs-4 misconceptions contradiction, `Increment 3` residue
  in the `graph-corpus-sdk` README/`package.json`). 3-reviewer workflow
  validated; findings critically assessed. **Next: the mandate-1 deep
  contamination scan** (now against pushed state), then graph-estate
  execution, then the unified substrate-migration plan, then EEF D3. Full
  detail: `eef` + `connecting-oak-resources` thread banners.
- **EEF/ADR/graph-estate plan review + refinement — doc-only, all uncommitted
  (2026-06-02, Flamebright Charring Ember / `30dd5d`, claude / Opus 4.8)** — deep
  multi-workflow review (holistic 6-lens, D3 4-lens, 4-architecture-reviewer pass,
  each critically assessed with false-positives rejected) plus grounded refinements
  to `eef/current/eef-graph-tool-completion.plan.md` (the EEF tool is a **graph
  universal tool**, not a bespoke bypass; `TNodeId` replace-not-extend; green-at-
  each-boundary replaces the "red-tree window" framing; the interpretation resource
  is **agent guidance**; live signal tools `get-misconception-graph`/
  `get-prior-knowledge-graph` pinned in D7), **ADR-157** (EvidenceCorpus/five-
  increment supersession + namespace de-noise), a new seed
  `eef/future/eef-revalidate-on-new-graph-tools.plan.md`, and
  `graph-estate-consolidation.plan.md` (cross-thread migration relationship + new
  **Judgement call 4**: ONE plan owns moving all existing graph tools to the new
  substrate). Three owner-caught convenient-claim slips (bespoke topology /
  over-specified output-schema mechanics / proliferated retired `Inc.3`) → cure
  sharpened in `distilled.md` + auto-memory. **TWO STANDING OWNER MANDATES for a
  near-future session:** (1) **deeply scan ALL this session's outputs for
  contamination**; (2) **graph estate consolidation + graph enhancement + EEF work
  can no longer exist independently — clean and align ALL graph work as ONE unit.**
  **OPEN:** input/output schema strategy is owned by
  `sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md` (the
  Abyssal Flowing Beacon workstream below; audited in-tree); EEF output-schema
  mechanics deferred to it (open-questions **Q-003**). Full detail: `eef` +
  `connecting-oak-resources` thread banners. Doc-only; markdownlint green on every
  touched file; full `pnpm check` NOT run (uncommitted, shared tree carries the
  output-schema workstream); no commit.
- **MCP output-schema plan audited + rewritten; graph-tool output-schema
  projection plan created (2026-06-02, Abyssal Flowing Beacon / `762085`,
  claude / Opus 4.8)** — a 61-agent audit of
  `sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md`
  ([report](../../reports/output-schema-mcp-plan-audit-2026-06-02.md)) found it
  materially stale (stdio transport gone; 34→35 tools / 10→11 aggregated;
  Phase-3 gate pointed at deleted `projections.ts` from PR #76). Rewrote it
  decision-complete (object-rooted **required** `outputSchema`, generated-vs-
  aggregated split, the S0 universal-tools seam) with one named open decision.
  Owner resolved it: **this plan owns S0**; apply the required field **per tool
  type, graph first**, promote to the root `UniversalToolListEntry` last. Owner
  correction mid-design (metacognition): output schemas are NOT hand-constructed
  Zod — they are a deterministic, type-strict **projection** of the static data
  fed to a **single Zod call** (`satisfies`-tied to `structuredContent`), the
  SAME pattern as EEF, emitted at codegen. New plan
  [`graph-tool-output-schemas.plan.md`](../../plans/sdk-and-mcp-enhancements/archive/completed/graph-tool-output-schemas.plan.md)
  (since absorbed and archived)
  (status DESIGN — co-designed with EEF D4–D6, five open questions, not
  executable); implementation **paused for owner review**. This aligns with the
  owner mandate in the `eef` banner: graph-estate + graph-enhancement + EEF must
  be cleaned and aligned as ONE unit. Doc-only, uncommitted on
  `feat/graph-tooling-tidyup`; no gates run (owner direction).
- **Graph-estate-consolidation plan made post-D2 accurate + crystal-clear, and
  `graph-ingest` decontaminated (2026-06-01, Coppery Warming Flame / `9a5cc3`,
  claude / Opus 4.8)** — full detail in the `eef` thread banner and the plan's new
  `## Execution sequence` (t1's six dispositions are unconfirmed proposals → t1 +
  `assumptions-expert` first; do-now subset = all but D7-gated t6); see item 7
  below. Two `graph-ingest` `gate-1a` comments removed → zero gate-1a/1b/Inc.3 code
  residue. Gate-green, uncommitted on `feat/graph-tooling-tidyup`.
- **Dedicated knowledge-curation pass (2026-06-01, Moonless Lurking Dusk /
  `0641a3`, claude / Opus 4.8)**: ran `oak-consolidate-until-done` +
  `oak-consolidate-docs`. **Two rules graduated**: `eef-corpus-grounding`
  (trigger-loaded, EEF-scoped — the folded open question dissolved: the rules tier
  is not always-on by construction, trigger-loaded is the designed home) and
  `verify-data-supports-shape-before-building` (always-on — consolidated the
  value-trace + fingerprint-data candidates into one design-time rule). **One rule
  clause**: `owner-attention-at-action-moments` §evidence-refutes-an-owner-approved-premise.
  **One workflow clause**: `consolidate-docs` step 7 — owner-gated items whose
  trigger is owner-direction get walked in-session, not parked. Critical napkin
  rotated → healthy (fully processed, archived verbatim); 3 cross-session lessons →
  `distilled.md`. `principles.md` char limit raised 24000 → 26000 (owner-directed).
  Seam-map archetype marked APPROVED (deferred to a focused session). Fitness green
  (`strict-hard` passes); no substance deleted, no number chased.
- **Comms-event write-integrity implemented (2026-06-01, Tempestuous Gliding
  Falcon / `019e83`, codex / GPT-5)**: owner-directed fix for the comms-CLI
  corruption bug is complete in the working tree and committed in this session.
  The plan
  [`agent-tooling/current/comms-event-write-integrity.plan.md`](../../plans/agent-tooling/current/comms-event-write-integrity.plan.md)
  now records D1-D5 complete: collaboration JSON writes validate serialized text
  before publish, immutable comms events use synced same-directory atomic create
  with no overwrite, readers hard-fail with the bad path named, `comms validate`
  scans true-JSON collaboration state, and `repo-validators:check` includes the
  validator. Owner correction landed in `principles.md`: no legacy directories,
  legacy shapes, fallback readers, or migration paths; canonical surfaces fail
  loudly when absent or invalid. F-05 is closed as
  `addressed-in-working-tree-2026-06-01`. Focused gates were run before closeout
  and are recorded in the plan; no quality gates were run during this handoff per
  owner direction.
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
| `eef` | EEF graph-tooling rebuild | [record][eef] | claude / Opus 4.8 / Lacustrine Swimming Beacon / eef-d3-review-then-ratify / 2026-06-03 (prior: Seaworthy Swimming Sextant 2026-06-03; Galactic Glowing Prism, Opalescent Cascading Planet, Stellar Waning Planet, Silvered Lurking Mask, all 2026-06-02) |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | codex / GPT-5 / Umbral Whispering Silhouette / promotion-and-root-docs-author / 2026-06-01 |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | codex / GPT-5 / Opalescent Illuminating Prism / dedicated-knowledge-curation / 2026-06-03 (prior: Lacustrine Swimming Beacon, Ashen Burning Magma, Solar Glowing Meteor, Stratospheric Buffeting Breeze, Lofty Sweeping Falcon, Shaded Veiling Mirror) |
| `school-data-search` | Oak School Data Search service (POC MVP): briefs → report → plan → build | [record][school-data-search] | claude / Opus 4.8 / Hushed Lurking Mask / brief-normaliser / 2026-06-03 |

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
   D3 is owner-ratified with the settlement decisions folded in (V1
   extension, metric-filter deferral, `adapt-lesson` rename, resource strand
   index); the `d3` todo is flipped, the bundle is uncommitted pending owner
   word, and D4 is the next deliverable.**
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
   `kg/future/graph-tools-substrate-migration.plan.md`, parked on the named
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

**complete — dedicated-knowledge-curation plus final no-commit/no-check handoff
(2026-06-03, Opalescent Illuminating Prism / codex / GPT-5 / `019e8e`).**
The active napkin was
processed through
`curator-passes/2026-06-03-opalescent-illuminating-prism-curation.md`,
preserved at `active/archive/napkin-2026-06-03-opalescent-curation.md`, and
reopened as a small live capture buffer. The PDF-only ChatGPT
report-normalisation protocol is graduated into the canonical skill and
pattern, and the pre-archive ledger tripwire is graduated into the
consolidation/handoff skills; `pending-graduations.md` has no live
`status: pending` items found by the current inventory grep. Final owner
instruction after completion: run session handoff + session-completion
consolidation only, with no commit and no check; done in the thread record and
napkin. This curation slice is not the next pickup lane.

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
[school-data-search]: threads/school-data-search.next-session.md
[agentic-mechanisms-discovery]: threads/agentic-mechanisms-discovery.next-session.md
[collab-research]: threads/agent-collaboration-research.next-session.md
[branch-fitness]: threads/branch-fitness-and-push-cadence.next-session.md
