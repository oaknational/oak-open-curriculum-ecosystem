---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
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

- **PENDING-GRADUATIONS REGISTER DRAIN + PDR-091 (2026-06-08, Coppery Crackling Crucible / `a28ee6`,
  claude / Opus 4.8, owner-directed).** The dedicated register-drain the prior session anticipated:
  28 `status: graduated` tombstones + 1 verified `duplicate` removed from
  [`pending-graduations.md`](pending-graduations.md) after confirming each item's substance live in
  its named home (`00a9b434`); the negation-contrast enforcement increment was rehomed as a
  standalone owner-gated entry. Register **recalibrated on owner direction** (`fitness_line_limit`
  2200→1467, target 1500→1100; critical lands ~2200): it now reads `hard` **by design** — a standing
  informational-only drain-signal (not wired into any commit/push hook) to keep the owner-gated
  backlog walked down; never a gate, never chased. Owner doctrine **"Precedence is NOT approval"
  graduated to portable
  [PDR-091](../../practice-core/decision-records/PDR-091-precedence-is-not-approval.md)** + an
  always-applied host rule (`0e0e7f42`; docs-adr-expert reviewed). **Next safe step: none on this
  lane;** the deep owner-gated backlog (96 items) legitimately stays per its `lifecycle_model`.
- **CONTINUITY-SURFACE CONSOLIDATION RUN (2026-06-08, Cosmic Illuminating Planet / `773ea1`,
  claude / Opus 4.8, owner-directed).** The dedicated curation session the prior fitness-wiring
  anticipated. The four critical thread records (`eef`, `agentic-engineering-enhancements`,
  `observability`, `connecting-oak`) were curated to their pickup function per
  [`continuity-practice.md` §Disposition](../../directives/continuity-practice.md) —
  conserving each live pickup + the additive identity trail + un-homed insight, deleting
  homed/superseded session narrative (git retains the literal record).
  `agent-collaboration-research` reflowed to width; `repo-professionalism` opener de-drifted;
  this §Current State curated. **Residual signals (reported, not chased):** a few small
  paused/retired records keep minor link-dominated or barely-over width. **Next safe step: none
  on this lane.**
- **EXTERNAL-FACING SKILLS → EDUCATOR-END-USERS SYNTHESIS SEEDED (2026-06-08, Zephyrous Buffeting
  Falcon / `2de7a7`, claude / Opus 4.8, owner-directed).** Reviewed `oaknational/oak-skills` + the
  discovery skills lane; relocated the external-consumer skills/plugin/MCP-skill-like materials
  (7 docs) into
  [`user-experience/educator-end-users/previous-materials/`](../../plans/user-experience/educator-end-users/previous-materials/README.md)
  with a seed review report (`6101a946`); cross-linked the EEF↔oak-skills upstream request and
  corrected a stale EEF-status line. Web-verified finding: **plugins are the cross-vendor bundling
  layer** — Claude plugins and OpenAI **Codex plugins** both bundle skills + MCP via a marketplace.
  **Next safe step (owner-gated): synthesise an Oak plugin/bundle** (oak-skills' skills + this repo's
  MCP app incl. EEF) emitted from one capability source-of-truth to both marketplaces; the
  oak-skills-side EEF reference is an
  [upstream request](../../plans/upstream-feature-requests/oak-skills/reference-eef-evidence-once-live.md).
- **EEF `get-eef-evidence` — D6 COMPLETE; the surface is LIVE BY DEFAULT and EXERCISED
  (2026-06-08, Briny Charting Lagoon).** c4 `eef://interpretation` resource + c5 `adapt-lesson`
  prompt landed (`dcf46e6f`) + tool-prefix/dual-attribution/WCAG guidance (`6913aa47`); the flag
  flipped to the **kill-switch posture — default ON, `OAK_CURRICULUM_MCP_EEF_ENABLED=false`
  disables** — via a `feature-flags.ts` engine (`d3109d7c`). Per owner doctrine the flag
  **engine** is unit-tested, not per-flag configuration. The tool/resource/prompt were
  **exercised live over MCP HTTP** (no-auth dev server on port 3333): real evidence, attribution
  pass-through (authors + URLs), the markdown guide, the prompt, and the no-selector `isError`
  path all confirmed. ADR-193 boundary holds (c4/c5 needed no egress; carrier-fix / index-sig /
  generic-spine remain DEAD). Branch `feat/graph-tooling-tidyup` is **ahead 10 of origin,
  UNPUSHED**. **Next safe step (owner-directed): exercise the running app via the standard MCP
  tools — the EXERCISE RECIPE banner in the [`eef` record](threads/eef.next-session.md) — then
  D7, the teacher-value round-trip proof (the go-live flag mechanism is done; the delivered-value
  proof remains).**
- **MCP test estate + observability sinks plans → both `🟢 DECISION-COMPLETE`; execution
  owner-scheduled.**
  [`unified-mcp-server-test-harness.plan.md`](../../plans/sdk-and-mcp-enhancements/current/unified-mcp-server-test-harness.plan.md)
  (WS0 + WS3 executable now; WS1 = EEF D7) and
  [`observability-sinks-decoupling.plan.md`](../../plans/observability/current/observability-sinks-decoupling.plan.md)
  (C1+C2 atomic → C2b `SENTRY_MODE` bridge → C3 → C4 → C5; gated on the relevant feature
  branch merging). Neither has a dedicated thread record yet; see § Next Safe Steps.
- **Current product focus**: `eef` graph-tooling rebuild is the only active product lane. The
  `agentic-engineering-enhancements` activity is a temporary knowledge-curation lane — its live
  WS1→2b→2c→WS2 feedback-mechanism work lives in its thread record, not a product thread.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal
  sources, not long-term documentation. Outside explicit owner-gated research
  windows, process useful substance into memory/docs/plans and clear stale state.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild | [record][eef] | claude / Opus 4.8 / Briny Charting Lagoon / d6-completion-attribution-flag-default-on-and-live-exercise / 2026-06-08 (prior: Lanternlit Shrouding Raven c4-c5-reflection-and-attribution-fix 2026-06-08, Luminous Drifting Dawn c6-tool-gating-fix 2026-06-08, Evergreen Blossoming Copse adr-193-vendor-boundary-and-egress-membrane 2026-06-08, Pelagic Charting Rudder c1-c3-authoring-and-strict-type-flow 2026-06-07, Hidden Prowling Owl c1-finite-domain-prereq-and-type-widening-doctrine 2026-06-07, Arboreal Shedding Canopy d6-reshape-and-phase-e-handoff 2026-06-07, Moonlit Orbiting Moon d6-execution-reshaped 2026-06-07, Zephyrous Kiting Squall d6-readiness-regrounding 2026-06-06, Floating Darting Cloud d7-golive-plan-edit 2026-06-06, Dusky Dimming Candle author-d6-execution-plan 2026-06-06, Masked Creeping Lantern eef-deep-review-resolutions-adr191 2026-06-05, Dim Dimming Threshold eef-d5-execution 2026-06-05, Prismatic Twinkling Planet eef-d5-fresh-dual-review 2026-06-04, Windward Gliding Squall eef-d5-plan-authoring 2026-06-04, Shadowed Creeping Secret eef-d4-ratify 2026-06-04, Burnished Glowing Spark 2026-06-04, Lacustrine Swimming Beacon 2026-06-03, Seaworthy Swimming Sextant 2026-06-03, Galactic Glowing Prism + Opalescent Cascading Planet + Stellar Waning Planet + Silvered Lurking Mask 2026-06-02) |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work, starting with a deep review of the Oak Curriculum Ontology repo (separate concern from the bulk-derived graph redesign) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 — **opened, not started; deep review is a fresh session** |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Zephyrous Buffeting Falcon / skills-lane-relocated-to-educator-end-users / 2026-06-08 (prior: Blustery Lifting Gale skills-taxonomy-and-distribution 2026-06-03, Umbral Whispering Silhouette 2026-06-01) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | claude / Opus 4.8 / Coppery Crackling Crucible / pending-graduations-drain-and-pdr-091 / 2026-06-08 (prior: Cosmic Illuminating Planet dedicated-continuity-surface-consolidation 2026-06-08, Lofty Spiralling Plume continuity-surface-fitness-and-prose-awareness 2026-06-08, Briny Plumbing Beacon feedback-mechanism-follow-ons 2026-06-07, Eclipsed Watching Veil items-4+1 2026-06-07, Glittering Weaving Comet 2026-06-07, Volcanic Blazing Magma 2026-06-06, Lanternlit Passing Mask 2026-06-05, Hidden Hiding Dusk 2026-06-04, Arboreal Sprouting Branch 2026-06-04, Opalescent Illuminating Prism 2026-06-03, Lacustrine Swimming Beacon, Ashen Burning Magma, Solar Glowing Meteor, Stratospheric Buffeting Breeze, Lofty Sweeping Falcon, Shaded Veiling Mirror) |
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

**NEXT SAFE STEP (2026-06-08): D6 COMPLETE; the EEF surface is LIVE BY DEFAULT (kill-switch
flag, default ON) and was EXERCISED live over MCP HTTP this session (Briny Charting Lagoon).**
The owner-directed next step is to **exercise the running app via the standard MCP tools** —
the EXERCISE RECIPE banner in the [`eef` record](threads/eef.next-session.md) carries the
server-start command (port 3333, no-auth) and the four working JSON-RPC calls — then **D7**,
the teacher-value round-trip proof (the go-live flag mechanism is done; the delivered-value
proof against independent ground truth remains, per the master `d7-teacher-value-round-trip`
todo). The numbered history below is retained for context.
Open execution-time items (not blockers — G0/TDD surface them) + the full verdict
are in the `eef` next-session record banner. **D5 LANDED green as one commit (`2e9021ff`; Dim Dimming
Threshold, 2026-06-05)** — graph-core generic query layer + graph-native EEF view
(`inspectStrand`/`evidenceForMove`/envelope); the `d5-graph-construction-methods`
todo is `completed`; the runtime `projection?` param was dropped by owner decision
(see the `eef` thread banner + the D4 "Projection deferred" amendment). The
graph-tools-value-redesign lane stays parked on EEF D6 + D7. The numbered history
below is retained for context.

**Post-D5 deep review (2026-06-05, Masked Creeping Lantern) — resolutions landed:**
`NodeProjection`/`DeepKeyPath` removed (no consumer); status currency +
strategy-brief reconciliation (crosswalk — shared-intent kept, server-scoring
superseded, §5 orthogonal); **ADR-191 ratified** (deterministic data surface; the
agent is the only reasoner — Decision 10 promoted repo-wide); contributor-
attribution/PII policy codified (`documentation-hygiene` §2 + `ATTRIBUTION.md`;
personal emails only in `package.json`). Substantive set landed via `10c5aeac` +
`0d99dc00` (Jim Cresswell); ADR-191 file + PII-sweep remainder + handoff committed
this session.

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
   D6 + D7. See the `eef` thread banner.** **(Update 2026-06-04, Prismatic
   Twinkling Planet): the FRESH DUAL-REVIEW of the D5 plan + parent is DONE —
   verdict READY WITH CONDITIONS; all conditions C1–C8 owner-resolved and folded in
   (keep `projection?` + implement/test; per-graph depth-ceiling factory input; D4
   doc-fix in both places; C3–C7 clarifications). Every empirical claim was
   re-grounded first-hand; four adversarial attacks on the load-bearing claims were
   rejected as false-positives. NEXT: **execute D5** — build the new graph-core
   query layer (`GraphView<TNode, TNodeId, TEdgeType>`, `subgraph` only with
   `projection?` retained) + the graph-native EEF view fresh as TDD cycles, landing
   as ONE green commit, per the condition-folded `eef-d5-execution.plan.md`. The
   graph-tools-value-redesign lane stays parked on EEF D6 + D7.**
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

### Agent Tooling (collaboration CLI + PreToolUse guard) — LANDED + PUSHED

Both WIP lanes have landed and pushed (verified 2026-06-06, Starlit Scattering
Twilight curation pass — the prior "uncommitted, commit when greenlit" framing was
stale): Fiery's collaboration-state CLI (F-35 `--tag heartbeat` help + F-07
`comms list`/`show`) in `562b97f3`; Skyward's PreToolUse guard
fail-open-on-unbuilt-artefact (+ the pure `decideMissingGuardArtifact`) in
`89ec8dcf`. No open next step. Owner-gated residuals are tracked in
`pending-graduations.md`: the ADR-167 exit-0-log amendment (recommended not needed)
and F-36 (pnpm-wrapper porcelain-stdout) + F-07 list-filters
(owner-directed-optional).

### MCP Test Estate + Observability Sinks (both DECISION-COMPLETE 2026-06-06)

Both plans are `🟢 DECISION-COMPLETE`, execution owner-scheduled. Neither has a
dedicated thread record yet — the session-level home is the § Current State entry +
this section; create a thread record when execution is scheduled.

1. **Test estate** —
   [`unified-mcp-server-test-harness.plan.md`](../../plans/sdk-and-mcp-enhancements/current/unified-mcp-server-test-harness.plan.md):
   WS0 (built-server smoke harness) + WS3 (network-free e2e rebalance) are
   EEF-independent and executable now; WS1 (= EEF D7) is gated on EEF D6 landing.
   Cross-plan: sequence WS3's live-executor consolidation BEFORE the MCP slice of
   `no-io-test-boundary-and-di-recovery.plan.md` (collision risk, per the plan's
   §Cross-Plan Coordination).
2. **Observability sinks** —
   [`observability-sinks-decoupling.plan.md`](../../plans/observability/current/observability-sinks-decoupling.plan.md):
   C1+C2 (atomic: forcing-function test + standalone OTel `NodeTracerProvider`, adds
   `@opentelemetry/sdk-trace-node` + amends ADR-171) → C2b (build the `SENTRY_MODE`
   bridge in env-resolution + reconcile the sink-enum) → C3 (migrate consumers) → C4
   (renames) → C5 (close). Execution gated on the relevant feature branch(es) merging.

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
