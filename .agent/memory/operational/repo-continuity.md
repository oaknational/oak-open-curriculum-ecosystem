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
- **2026-06-02 / 2026-06-03 session-close summaries archived** — discharged
  history (repo-professionalism report + planability routing; capability
  taxonomy / ADR-189; school-search synthesis + POC plan; upstream-sequences
  realignment; EEF D3 ratification; 2026-06-03 agentic curation; JC4 plan
  authoring; graph-estate consolidation; Mandate-1 contamination scan). The
  live pickup state is in § Next Safe Steps, § Active Threads, and the thread
  banners. Verbatim:
  [`archive/repo-continuity-current-state-2026-06-04-arboreal-history-trim.md`](archive/repo-continuity-current-state-2026-06-04-arboreal-history-trim.md).
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
- **2026-06-01 agent-readiness discovery promotion archived** — discharged
  history; the live next step (`ar1-refresh-standards-and-live-estate`) is in
  § Next Safe Steps › Agentic Mechanisms Discovery + the thread record. Verbatim
  in the 2026-06-04 arboreal history-trim archive linked above.
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
| `eef` | EEF graph-tooling rebuild | [record][eef] | claude / Opus 4.8 / Windward Gliding Squall / eef-d5-plan-authoring-and-review / 2026-06-04 (prior: Shadowed Creeping Secret eef-d4-whole-plan-review-then-ratify 2026-06-04, Twilit Cascading Supernova migration-plan-overhaul 2026-06-04, Burnished Glowing Spark 2026-06-04, Lacustrine Swimming Beacon 2026-06-03, Seaworthy Swimming Sextant 2026-06-03, Galactic Glowing Prism + Opalescent Cascading Planet + Stellar Waning Planet + Silvered Lurking Mask 2026-06-02) |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work, starting with a deep review of the Oak Curriculum Ontology repo (separate concern from the bulk-derived graph redesign) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 — **opened, not started; deep review is a fresh session** |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Blustery Lifting Gale / skills-taxonomy-and-distribution / 2026-06-03 (prior: Umbral Whispering Silhouette 2026-06-01) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | claude / Opus 4.8 / Hidden Hiding Dusk / dedicated-consolidation+owner-directed-graduations / 2026-06-04 (prior: Arboreal Sprouting Branch 2026-06-04, Opalescent Illuminating Prism 2026-06-03, Lacustrine Swimming Beacon, Ashen Burning Magma, Solar Glowing Meteor, Stratospheric Buffeting Breeze, Lofty Sweeping Falcon, Shaded Veiling Mirror) |
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
reframed; C-10 path fixed). **WS-D1 / G-8 DONE (2026-06-04): the 4-workspace
bundle is ratified** (contracts + sdk [data/ingest/search modules] + client +
apps/api under a new top-level `school-data-search/` tier; auth in apps/api;
authored boundary rules — betty + fred reviewed/validated, 6-way split
rejected; see the
[decomposition doc](../../plans/school-data-search/current/school-data-search-wsd1-decomposition.md)).
**Next: ADR-041 amendment (school-data-search/ tier matrix row + authored
boundary rules) + draft ADR-190 (F-B produced-spec) → `docs-adr-expert`;
promote to `active/`; begin WS1+.** Carry the verification discipline +
licensing guardrail. See the
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
   D6 + D7. See the `eef` thread banner.** **(Update 2026-06-04, Windward Gliding
   Squall): the D5 EXECUTION PLAN is now authored + reviewed READY
   ([`eef-d5-execution.plan.md`](../../plans/sector-engagement/eef/current/eef-d5-execution.plan.md),
   current/; Iridescent pair-review + type/assumptions/fred, all conditions
   incorporated) and the parent D5-Proof package filter was fixed
   (owner-authorised: `@oaknational/oak-curriculum-sdk` → `@oaknational/curriculum-sdk`).
   NEXT: a fresh session dual-reviews the D5 plan AND this parent plan together,
   then executes D5.**
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

### Agent Tooling (collaboration CLI)

Uncommitted, **verified** WIP in the working tree (2026-06-04, Fiery Forging
Ash) — **intentional, not orphan; awaiting owner commit greenlight.** Two
collaboration-state CLI fixes from Windward's live-session frictions: F-35
(`comms append`/`send --help` now document the `--tag heartbeat` typed-arg
mode; help strings extracted to `cli-spec-help.ts`) and F-07 (new
`comms list [--tail N]` + `comms show --event-id` read-back; new module
`cli-comms-query.ts`). agent-tools workspace gates green
(build/type-check/lint/863 tests); full-repo `pnpm check` NOT run (uncommitted +
live peers on the shared tree). Frictions register updated (F-35, F-07 flipped
to partially-addressed, F-36 added for pnpm-wrapper porcelain-stdout). **Next
safe step: commit slice A (F-35) + slice B (F-07) — independently shippable —
then F-36 / F-07 list-filters if the owner directs.**

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

**ran this handoff → owner-directed (2026-06-04, Windward Gliding Squall /
claude / Opus 4.8 / `ab2bcd`, EEF D5 plan-authoring + review close;
session-completion mode).** Owner asked for fix + full handoff + consolidation +
insights + commit. Landed: D5 execution plan authored + reviewed READY
(`eef-d5-execution.plan.md`); parent D5-Proof package filter fixed
(owner-authorised). Insights homed: convergence-is-not-proof /
a-verification-claim-is-not-verification → `distilled.md` + Claude auto-memory
(`feedback_validate_specialist_findings_before_acting`, broadened to ALL
external agent feedback incl. peers) + napkin (felt-authority / discrepancy-claims
/ grounding-bar entries); experience file landed; PDR candidate (felt-authority
unification) recorded in `pending-graduations.md`. **Deferred with reason**:
cross-thread/cross-platform curation + the `distilled.md` HARD-zone drain
(192/180 ln) are dedicated-curation-pass work this single-lane planning close
does not carry context for — falsifiable: the next curator can count the
distilled line-count + the unread cross-platform surfaces; the conservation
invariant is honoured (preserved at full weight, not trimmed). Verdict:
`partial slice landed`.

**FRESH-SESSION QUEUE EXECUTED (2026-06-04, Hidden Hiding Dusk / claude / Opus 4.8 /
`38dbaf`, dedicated consolidation + owner-directed graduations).** Ran the two Arboreal
queued items. (1) Opened the action-time-structural-interrupt design lane —
`future/action-time-structural-interrupt-design-space.plan.md` (general doctrine-traction
frame; grounding caught that the design space pre-existed in closure-pressure-design-space,
so it defers mechanism exploration there; three-axis reconciliation firing × detection ×
response; assumptions-expert PROPORTIONAL). (2) Owner-directed graduation walk: graduated
PDR-090 (one-law-three-faces), ADR-190 Proposed (heartbeat-cron health via watcher-staleness),
clauses on `knowledge-preservation-over-fitness-warnings` (retire-lossy-mirror) and
`handoff-messages-self-contained` (openers teach by form); G status update; docs-adr-expert
ACCEPT (verified). **B1 deferred to EEF-redesign promotion** (its ADR home is owned by the
active graph-tools-value-redesign thread — collision avoided). C verified without withdrawal
(claim-glob covered/withdraw-ready; merge-divergence NOT covered, stays gated; cursor-seed
trigger fired n=2); light D/E/F sweep found no further fired/covered signals. Parallel
oak-kg-ontology session committed `7a3f8cfb` mid-session — verified zero overlap with this
session's changed set. Full backlog dispositions recorded in `pending-graduations.md`.

**COMPLETED — dedicated-knowledge-curation, owner goal "consolidate until done"
(2026-06-04, Arboreal Sprouting Branch / claude / Opus 4.8 / `262b3f`).**
DISCHARGED the deferred drain the prior single-lane closes below flagged (napkin
rotation; this index over-limit; cross-platform memory unread). Full ledger:
[`curator-passes/2026-06-04-arboreal-sprouting-branch-curation.md`](curator-passes/2026-06-04-arboreal-sprouting-branch-curation.md).
Fitness before→after (side-effect, not the goal): napkin CRITICAL→healthy; this
file HARD→soft (633→440 ln, 43.8k→31k ch); 0 hard / 0 critical at rest. Real
curation: napkin rotated (13 sections dispositioned, full source archived); 6
register candidates routed (each verified absent first); commit-window discipline
→ distilled; `pnpm outdated` exit-code → `tooling.md`. Cross-platform memory read
(near-empty harvest = success); experience cross-read (45 files, 5 emergent
patterns, 3 sub-agent "drift" flags rejected as false positives). Audits: 7c
thread-register clean; 7e cleared 18 abandoned commit_queue entries; step-8 fixed
a stale `.remember` provenance fragment in `user-collaboration.md`. Certified by
a 4-agent adversarial verification workflow + an independent structural re-check
(which caught one post-workflow markdownlint defect — fixed). Verdict: `complete`
for drainable buffers + fitness-at-rest. **Owner-walk + graduations (owner-directed
this session):** item 6 → minted `.agent/rules/closed-shape-design-optionality.md`
(PDR-058 §Surface 2); item 46 + 2 experience-pattern candidates → consolidated into
PDR-089 §Decision 6 (a clause, not a duplicate PDR — PDR-089 owned the substrate);
owner-gated→owner-directed captured as doctrine (item 7 + consolidate-docs step-7
owner-walk clause: owner-gated must not be a graveyard). **Owner directed continuing
in a fresh session.** Fresh-session queue: (a) open the action-time-structural-interrupt
design lane (3rd greenlit graduation, not started); (b) walk the rest of the
owner-gated backlog under the collapse directive (recommendation-first digest;
the autonomy-primitive/Director cluster honestly needs a real second instance —
the owner may override). Ground from the curator-pass ledger.

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
