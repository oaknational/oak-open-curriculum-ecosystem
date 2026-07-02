---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `eef` thread

> **PAUSED 2026-06-19 (owner direction).** The D0–D7 build arc is delivered and shipped
> (v1.16.0, live by default). The **D7 teacher-value round-trip proof is dropped as overkill** —
> its underlying intent (delivered-value proof against independent ground truth) can be
> transformed into a **later, more useful investigation** when this thread is reactivated. No
> active next step; reactivation is owner-directed.

## Current Continuation

- **2026-06-12 (Forge turns Basalt / claude-code Fable 5, `c4b882`) — EEF DATA SURFACING-GAP
  RESEARCH LANDED.** Read-only research: corpus-vs-surfaced inventory, verified first-hand
  (full surfacing stack read; three live oak-prod probes; 24-agent workflow with adversarial
  verify). The report is the conservation home:
  [`eef-data-surfacing-gap-research-2026-06-12.md`](../../../plans/sector-engagement/eef/reference/eef-data-surfacing-gap-research-2026-06-12.md)
  (committed by the Director in `32bcd9d1b`; owner roadmap item 7 owns organising its
  follow-ons). Load-bearing for the next EEF session: report §8 lists the ten unowned items
  (no recorded decision anywhere) — headline: EEF absent from `get-curriculum-model`
  orientation; methodology sub-fields exported but rendered nowhere; the unowned EEF
  provenance/refresh outreach (report §6), which also gates the corpus-backfill opportunity
  (report §7). Sibling artefacts: the
  [DfE data SDK seed](../../../plans/sector-engagement/future/dfe-data-sdk.plan.md)
  (sector-engagement thread) — DfE EES statistics as a COMPLEMENTARY source, never a
  replacement (owner posture 2026-06-12); the EEF corpus stays whole and authoritative for
  EEF evidence — and the owner-commissioned
  [executive briefing](../../../plans/sector-engagement/eef/reference/oak-eef-executive-briefing-2026-06-12.md)
  (standalone, C-suite Oak + EEF): the outreach vehicle for the report-§6 partnership
  conversation (dataset depth, update route, licence terms).
- **THIS SESSION (2026-06-11→12, Cosmos turns Equinox / claude Fable 5, `1bc763`,
  snagging-execution successor per PDR-063 handoff from Dusky Passing Mist) — 🟢 SNAGGING ARC
  LANDED.** The 2026-06-11 snagging plan's three-PR arc is fully merged: PR #190 (outbound
  token health metric, merge `8f1cc49c0`, released 1.27.0), PR #191 (EEF dual-shape — the
  owner-decided reversal of D6/D7 structuredContent-only, merge `1b02b70b4`, released 1.28.0,
  including the E3 docs supersession sweep across the EEF plans / output-schemas plan /
  ADR-058 / ADR-195 / D3 contract), PR #192 (keyword-graph `limit` schema bounds, merge
  `f4e8da260`), plus PR #193 (S4 closure + arc record + replay-recipe correction, merge
  `9686adba3`). Post-merge verified: the write-up's Shape-B replay against a local 1.28.0
  build returns the dual shape; production serves 1.28.0; the metric's spans + "MCP response
  size" logs are arriving in production Sentry — with one named caveat: span-ATTRIBUTE
  searchability in the Sentry explorer is unconfirmed (`has:oak.mcp.response.body_bytes`
  finds nothing while the spans exist; the logs dataset carries `bodyBytes`/`tokensEst`), so
  check attribute indexing before wiring the threshold follow-on to span queries. All review
  verdicts adjudicated first-hand on the PRs. **Next safe steps for this lane (queued by
  design, recorded in the
  [snagging plan](../../../plans/sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md)):**
  (1) S3 corpus-typo routing — refresh bulk downloads, regenerate, then route (needs a
  network/regen window); (2) the S2 cure — keyword identity-model design decision
  (per-placement descriptions belong on edges; evidence in the plan); (3) the outbound-token
  threshold follow-on (trigger: baselines visible in Sentry; note the searchability caveat);
  (4) optional annex — Codex/Gemini client probes, and a fresh-session Claude Code re-probe
  of `get-eef-evidence` against deployed 1.28.0 to complete the client matrix.
- **2026-06-11 evening (Dawnlit Glimmering Orbit / cursor Fable 5, `50c2d1`,
  oak-prod-live-mcp-exercise + snagging, solo). NOTE this branch lags the eef arc** — the
  TRACK-G completion narrative and this session's first-wave artefacts (verification record +
  thread-record entry) live on branch `docs/graph-team-direction-2026-06-10` (commits
  `ae5372e2c` + `c9ff6bb49`, pushed); reconcile on merge. This branch carries the session's
  second wave, owner-directed: **write-up before fixes, successor will not be a Cursor
  instance**. Landed here (swept into peer commit `3de15f01a`, content verified conserved):
  the self-contained
  [cursor-visibility write-up](../../../reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md)
  (server wire shapes pinned to source; Cursor delivers ONLY `content` blocks to the model —
  decoration-key fingerprint proof; the ratified `content: []` + structuredContent-only
  `get-eef-evidence` success is fully invisible to the Cursor agent, shape-based not
  size-based; prompt layer = user slash commands yes / agent invocation no, results loop back
  as injected command context; replay recipe for non-Cursor successors) and the
  [snag register](../../../plans/sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md)
  (S0 client-population probe → S1 owner decision on the EEF shape; S2 keyword description
  leakage; S3 corpus typo; S4 `limit` schema bounds; S5 prompt-UX observation). **Next safe
  step for this lane**: S0 — probe how non-Cursor clients surface the Shape-B response (one
  call each per the write-up's §6 replay recipe), then put S1 to the owner.
- **PRIOR ARC (2026-06-10 → 2026-06-11): the graph implementation team — seven Director
  holders, ~38 agent seats, Track-G + the re-proof + ARC reliability delivered IN FULL;
  the team dissolved cleanly with zero open PRs (arc PRs #142–#187 merged).** The durable
  homes for the arc narrative: the
  [session operations + experience report](../../../reports/graph-team-session-operations-and-experience-2026-06-10-11.md)
  (owner-directed synthesis; central finding: reading doctrine does not fire it — mechanism
  does), the
  [graph plan](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md)
  todos (per-deliverable authority), the preserved comms-event corpus, the handoff records
  under `.agent/state/collaboration/handoffs/`, and git history (per the identity-table
  contract below). Live carries from the arc: owner items HELD AS-IS (principles-prompt
  attribution validation, gating the S3 principles follow-on; bulk-export-lags-live); the
  Director-queue agent-tools lanes (register-recorded); w3-c1 + next product tranche shaped
  by observed alpha use, not design momentum (owner doctrine, 2026-06-11). PR #187 merged
  the coordination home back to main — the end-of-arc step the forward-only model never
  specified (gap captured in the generalisation plan todo x6, which is the live carrier).
- **PRIOR SESSION (2026-06-09, Fragrant Spreading Sapling / claude Fable 5, branches
  `feat/graph-migration-part-1` → `feat/graph-migration-part-2`) — graph-tools readiness →
  🟢 DECISION-COMPLETE.** The review-and-readiness session the entry below queued. Owner overturned
  the surface/graph split (find the real membranes); seam analysis + data grounding
  ([report](../../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md)) → owner-ratified
  deliverables (S1, S2, G1–G3, G4, U1 — each one small PR); `get-keywords` provenance falsified
  (live-API tool; kept; U1 upstream request + G4 additional bounded tool, bulk-parity gated);
  mechanisms settled R1-unanimous (B = new `./graph-corpus` subpath; NO substrate change —
  per-view `GraphView` construction; factory + unit test deleted at G3); misconception anchors
  ratified (unit+lesson core, thread bounded heavy-tail); R2 conditions all applied
  (anchor-threading prompt rewrites; emission-ownership table; G4 Gate-1 rule) →
  **DECISION-COMPLETE** with proof contract. Delivered + MERGED (2026-06-10): PR #143 (analysis +
  restructure), #144 (R2 + flip + continuity), #145 (owner corrections — S3 live deliverable, no
  unagreed holding states; stale fired-trigger facts fixed), #146 (indefinite-deferral
  vocabulary → trip-list + regression test, shipped in v1.18.0; all Copilot comments adjudicated
  first-hand), #147 (deep handoff/consolidation + loss-scan closures), #148 (upstream
  schema-hash sync). **Next: the IMPLEMENTATION PHASE — pick any unblocked deliverable
  (S1/S2/S3-c0/U1/G1) from the plan, execute its cycles per the proof contract, ship as one
  small PR; re-verify the pinned data facts against the tree at execution start.**
- **PRIOR SESSION (2026-06-09, Brazen Roasting Cinder / claude Opus 4.8, branch
  `assess/evidence_workflows`, PR #142) — A-i/C deferred reviews + graph-tools-plan promotion.**
  The deferred A-i/C specialist reviews ran (5 reviewers via a workflow; every finding adjudicated
  FIRST-HAND — code/types/tests SOUND, no real defects; two over-escalations refuted). Verified
  findings landed + **PUSHED**: `4f15d7df` test(eef) coverage, `747023fd` docs(eef) comment/plan
  accuracy (`eef-evidence.ts` stale "open question" → ADR-193; output-schemas type-tie/count fixes),
  `836d7d85` docs(memory) napkin capture. Estate gap/decision-completeness check done.
  **`graph-tools-value-redesign.plan.md` PROMOTED future/→current/** (owner-decided): stale
  substrate facts corrected (the landed `GraphView` is subgraph-only + edge-type-agnostic — the
  views need an edge-type-selective extension), inbound links repointed, KG README row moved to Live
  Work. It is **NOT yet decision-complete** — the mechanism settle (A/B/D/E + node/edge model + the
  `GraphView` extension) + executable TDD cycles + architecture/assumptions review remain for the
  NEXT SESSION on a NEW branch (see the plan's §Remaining promotion work). The fitness-driven
  curation
  pass was NOT done (owner directed not to act on fitness limits this session).
- **PRIOR SESSION (2026-06-09, Incandescent Smouldering Brazier / claude Opus 4.8, branch
  `assess/evidence_workflows`) — post-D7 evidence-workflow enhancements + the product principle.
  All three commits landed (full gate green each); pushed (PR #142):**
  - **`80dd642d` feat(eef): A-i + C on `get-eef-evidence`.** A self-describing `answerType`
    (`'strand-lookup' | 'context-subset'`) on the evidence envelope (a complete by-id result vs a
    non-exhaustive corpus-curated axis subset), and a `detail: 'headline'` option on
    `evidence-for-move` (the `evidenceForMoveHeadlines` projection in the new
    `graph-corpus-sdk/src/eef-strands/eef-headline-view.ts`). answerType preserves the D4
    inspect/explicit-id overlap; the headline view preserves edges/frontier/provenance.
    Behaviour-tested + **exercised LIVE over MCP HTTP**; types by tsc. **NOT specialist-reviewed**
    — code/type/test experts were NOT invoked (gates + self-review + live proof only).
  - **`20105837` docs(adr): ADR-194 Teacher-as-Expert Product Boundary (Accepted).** The product
    principle — Oak's surfaces inform and may present evidenced options, but never make the
    teacher's pedagogical decision; the teacher is the expert and authority. ADR-191 is its
    server-side engineering corollary. Propagated to the ADR index, ADR-191, VISION, the
    curriculum-tools playbook, and EEF R7. Assessment reports in `.agent/reports/`
    (`eef-evidence-workflow-live-value-assessment-2026-06-09.md`, `…design-directions…`).
  - **`f95a051d` docs(plans): output-schema estate integrated.** The composition approach +
    my EEF reconciliation — `answerType` + the full/headline member union threaded through the
    output-schemas plan's W0-cycle-3 / W2 / §Relationship clauses.
- **NEXT SAFE STEP — reviews + completeness checks, THEN push/PR (owner-directed
  2026-06-09). ✅ COMPLETED 2026-06-09 (Brazen Roasting Cinder; see the top entry —
  reviews ran, findings landed + pushed, completeness check done, graph plan
  promoted).**
  The original next-session checklist was:
  1. **Carry out the deferred reviews** — `code-expert` / `type-expert` / `test-expert` on the
     A-i/C code (`80dd642d`); `docs-adr-expert` coherence pass on the integrated
     `output-schemas-for-mcp-tools.plan.md`.
  2. **Critically assess ALL reviewer feedback first-hand.** Reviewers over-escalate / misdiagnose
     (a parallel agent flagged a type-reviewer over-escalation on a wrong Zod signature this
     session — see auto-memory `project_specialist_agent_design_overhaul`); ground every finding
     against the real code/data before acting (`validate-specialist-findings-before-acting`,
     `first-hand-means-me-not-subagents`). Verdict-not-relay.
  3. Run a **gap analysis**, an **underspecified-items check**, and a **decision-completeness
     check** across the ADR-194 + A-i/C + output-schema estate.
  - (Push `assess/evidence_workflows` + open the PR are this session's final steps; if already
    done, the next session opens with reviews.)
- **Prior arc (D0–D7) DELIVERED + SHIPPED.** The EEF build arc shipped to production 2026-06-08
  (PR #131 → `v1.16.0`); the surface is live by default at `curriculum-mcp-alpha.oaknational.dev`.
  The A-i/C above are post-ship enhancements on a new branch. The
  [`graph-tools-value-redesign`](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md)
  promotion trigger (EEF D6 + D7 green) is fired; its output-schema work is gated behind
  `output-schemas-for-mcp-tools.plan.md`.
- **Acceptance bar carried**: every tool/resource/prompt is real graph-derived logic with
  tests, or it is absent; strict types (no widening on finite-domain `z.enum`); A-i/C are
  information about the result, never a recommendation (ADR-194); source attribution never
  filtered; no `--no-verify`.

> **🤝 EXERCISE RECIPE — verified live 2026-06-08 (Briny Charting Lagoon). The next session
> exercises the running app via the standard MCP tools; this is the grounded path.**
>
> **Start the server (no auth, local):**
> `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev:observe:noauth`
> → listens on **port 3333**, `DANGEROUSLY_DISABLE_AUTH=true`, MCP endpoint
> `http://localhost:3333/mcp`. (Root `pnpm app:mcp` is the WITH-auth variant; `qa:oauth` runs
> the built server with auth.) The EEF flag is unset in dev env → kill-switch → **ON**.
>
> **Call shape** (streamable HTTP, stateless — no initialize handshake needed): POST JSON-RPC
> with header `Accept: application/json, text/event-stream`; the reply is SSE — parse the
> `data:` line (`grep '^data:' | sed 's/^data: //' | jq`).
>
> **The four surfaces (all confirmed working):**
>
> - `tools/list` → `get-eef-evidence` is present (position ~7).
> - `tools/call` `get-eef-evidence` `{function:'inspect-strand', strandId:'eef-tl-feedback'}`
>   → envelope: Feedback +6mo / Very Low / Extensive, `frontier`, full `provenance.source`
>   (name/url/organisation/**original_authors**), caveats.
> - `tools/call` `get-eef-evidence` `{function:'evidence-for-move', phase:'primary'}` → axis
>   query; **no selector → `isError:true`** ("requires at least one selector…").
> - `resources/read` `{uri:'eef://interpretation'}` → `text/markdown` guide.
> - `prompts/get` `adapt-lesson` `{topic, yearGroup}` → workflow messages.
>
> **Stop:** `lsof -ti:3333 | xargs kill`. Strand ids/axes are the corpus finite domains
> (`EEF_STRAND_IDS` / observed phase·keyStage·priority); an unknown key → `isError`.

## Standing Decisions (pointers — the cited homes are authoritative)

- **Deterministic data; the agent is the only reasoner** →
  [ADR-191](../../../../docs/architecture/architectural-decisions/191-deterministic-data-surface-agent-reasons.md).
- **System↔vendor type-boundary / egress membrane** →
  [ADR-193](../../../../docs/architecture/architectural-decisions/193-system-vendor-type-boundary-membrane.md).
  **DEAD — do NOT re-explore** (ADR-193 §Alternatives): carrier fix / index signature /
  preserve-to-`registerTool` / generic-spine.
- **Attribution passes through whole at runtime** (owner-corrected 2026-06-08, Briny Charting
  Lagoon): the corpus `source` — organisation, url, AND the named authors — travels in every
  envelope and on the `eef://interpretation` resource. Authors are attribution data, not PII;
  source URLs are never stripped (free access to sources is a trust requirement). The EEF
  README is the primary attribution surface. Enforced by the `eef-evidence.unit.test.ts`
  pass-through assertion (`provenance.source` deep-equals the corpus source). **The earlier
  "org-level only / omit authors" decision and its `Omit<…,'original_authors'>` filter +
  absence-test are REVERSED — do not reinstate.**
- **Strict no-widening** on finite-domain `z.enum` (graph-corpus-sdk runtime constants;
  `typescript-practice.md` + ADR-153/038/028 examples).

## Participating Agent Identities

Additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; a matching platform/model/agent_name updates `last_session`. Full
session narrative for each is in git history; this table is the durable identity trail.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Thyme wakes Canopy` | `claude` | `Fable 5` | `70655e` | `record-condensation (curation lane: directorship chronicles → compact arc entry, set-membership verified)` | 2026-06-12 | 2026-06-12 |
| `Forge turns Basalt` | `claude-code` | `Fable 5` | `c4b882` | `eef-data-surfacing-gap-research` | 2026-06-12 | 2026-06-12 |
| `Firefly seeks Temper` | `claude` | `Fable 5` | `ce44ae` | `handover-team-director-snagging-lane-routing` | 2026-06-11 | 2026-06-12 |
| `Iridescent Soaring Planet` | `claude-code` | `claude-opus-4-7-1m` | `b38261` | `architecture-restructure-and-handoff` | 2026-04-30 | 2026-04-30 |
| `Fragrant Sheltering Petal` | `claude-code` | `claude-opus-4-7-1m` | `360064` | `type-expert-round` | 2026-04-30 | 2026-04-30 |
| `Vining Whispering Root` | `claude-code` | `claude-opus-4-7-1m` | `696765` | `tracer-matrix-and-promotion-packet` | 2026-04-30 | 2026-05-01 |
| `Gnarled Fruiting Root` | `claude-code` | `claude-opus-4-7-1m` | `e18e2c` | `cross-ref-path-updates-from-thread-restructure-only` | 2026-05-01 | 2026-05-01 |
| `Windward Darting Horizon` | `cursor` | `claude-opus-4.7` | `dd084d` | `eef-tool-rename-eef-prefix-per-adr-157-and-mvp-arc-cross-ref` | 2026-05-07 | 2026-05-07 |
| `Opalescent Shimmering Orbit` | `codex` | `GPT-5` | `019e06` | `pr-102-eef-structural-eval-closeout` | 2026-05-08 | 2026-05-08 |
| `Fragrant Regrowing Root` | `codex` | `GPT-5` | `019e12` | `eef-source-authority-clarification` | 2026-05-10 | 2026-05-10 |
| `Torrid Glowing Flame` | `claude` | `claude-opus-4-7-1m` | `5ab0ec` | `inc-1d-eef-concurrent-tenant-sequencing-pull-forward-author` | 2026-05-21 | 2026-05-21 |
| `Salty Charting Harbour` | `codex` | `GPT-5` | `019e4e` | `standby-team-join-identity-drift-surfaced` | 2026-05-22 | 2026-05-22 |
| `Mistbound Slipping Night` | `claude` | `claude-opus-4-7` | `a1cb64` | `t12-citation-shape-cycle-author-with-stormbound-commit-handoff` | 2026-05-22 | 2026-05-22 |
| `Lunar Illuminating Eclipse` | `claude` | `claude-opus-4-7` | `326ea7` | `ws4-1-corpus-sdk-scaffold-author + commit-incident-victim` | 2026-05-22 | 2026-05-22 |
| `Velvet Veiling Wisp` | `claude` | `claude-opus-4-7` | `b4bb7a` | `consolidation-curation-3-pass + commit-editmsg-incident-victim` | 2026-05-22 | 2026-05-22 |
| `Stormbound Spiralling Breeze` | `claude` | `claude-opus-4-7` | `b8a5c9` | `team-start-then-silent` | 2026-05-22 | 2026-05-22 |
| `Foamy Fathoming Compass` | `claude` | `claude-opus-4-7` | `ecb459` | `ws4-4-graphview-substantive-author + reciprocal-reviewer` | 2026-05-22 | 2026-05-23 |
| `Secret Dimming Shade` | `claude` | `claude-opus-4-7` | `5a6e56` | `pr-108-sonarcloud-clearance + push-blocker-format-cure` | 2026-05-22 | 2026-05-23 |
| `Secret Vanishing Wisp` | `claude` | `claude-opus-4-7` | `981cbe` | `t9-t10-author + reciprocal-reviewer + first-out-closeout-owner` | 2026-05-22 | 2026-05-23 |
| `Sparking Melting Magma` | `claude` | `claude-opus-4-7` | `4cdb53` | `15-commit-round-1-and-2-cycle-author + reciprocal-reviewer` | 2026-05-22 | 2026-05-23 |
| `Stormbound Floating Wing` | `claude` | `claude-opus-4-7` | `52f264` | `team-start-then-9h-silent-then-return-stand-down` | 2026-05-22 | 2026-05-23 |
| `Stormy Surfing Dock` | `claude` | `claude-opus-4-7` | `2a7b65` | `pr-0-plan-freshness-author + pr-115-watcher + adr-184-amendment` | 2026-05-25 | 2026-05-25 |
| `Fiery Kindling Brazier` | `claude` | `claude-opus-4-7` | `9f4026` | `commit-marshal + pr-115-stewardship + merge-landed` | 2026-05-25 | 2026-05-25 |
| `Foamy Lapping Harbour` | `codex` | `GPT-5` | `019e68` | `value-pr-coordination-state-committer; shared-tree-main-merge-verifier` | 2026-05-27 | 2026-05-27 |
| `Galactic Dancing Constellation` | `claude` | `claude-opus-4-7` | `7efeec` | `eef-value-pr-reviewer; whole-graph-design-peer; graph-foundations-divergence-diagnosis` | 2026-05-27 | 2026-05-27 |
| `Woodland Swaying Pollen` | `claude` | `claude-opus-4-7` | `073489` | `goal-1-design-settling-plan-author` | 2026-05-28 | 2026-05-28 |
| `Deep Fathoming Harbour` | `claude` | `claude-opus-4-7` | `cef0b8` | `eef-graph-tooling-rebuild-foundation-author` | 2026-05-28 | 2026-05-28 |
| `Deciduous Climbing Root` | `claude` | `claude-opus-4-8` | `42226f` | `goal-2-d0-implementer` | 2026-05-29 | 2026-05-29 |
| `Wooded Creeping Thicket` | `claude` | `claude-opus-4-8` | `d7d671` | `goal-2-d0-lane-c4-validator-implementer` | 2026-05-29 | 2026-05-29 |
| `Tempestuous Gliding Thermal` | `claude` | `claude-opus-4-8` | `3e5d88` | `goal-2-d0-gateway-review-and-validator-hardening` | 2026-05-29 | 2026-05-29 |
| `Quiet Hiding Hush` | `claude` | `claude-opus-4-8` | `457189` | `goal-2-d0-completion-functional-proof-landing-gate-fix-and-merge-handoff` | 2026-05-29 | 2026-05-29 |
| `Pelagic Sailing Sextant` | `claude` | `claude-opus-4-8` | `606a0e` | `eef-completion-and-consolidation-planning` | 2026-05-29 | 2026-05-29 |
| `Radiant Glimmering Aurora` | `claude` | `claude-opus-4-8` | `c23958` | `eef-finishing-plan-rewrite-under-deeper-critique` | 2026-05-29 | 2026-05-29 |
| `Igneous Flaring Spark` | `claude` | `claude-opus-4-8` | `6e055a` | `eef-impact-led-D0-D7-restructure-under-metacognition` | 2026-05-30 | 2026-05-30 |
| `Evergreen Bending Thicket` | `claude` | `claude-opus-4-8` | `d4da14` | `eef-readiness-review-plan-finalisation-estate-decontamination` | 2026-05-30 | 2026-05-30 |
| `Opalescent Transiting Prism` | `claude` | `claude-opus-4-8` | `73491c` | `eef-d0-execution-validator-deletion-relocation-decontamination-and-intent-audit` | 2026-05-30 | 2026-05-31 |
| `Kilned Crackling Ember` | `codex` | `GPT-5` | `019e7f` | `eef-d1-completion-plan-archive-closeout` | 2026-05-31 | 2026-05-31 |
| `Fruited Regrowing Copse` | `claude` | `claude-opus-4-8` | `abec59` | `eef-value-reframe-plan-report-resync` | 2026-05-31 | 2026-05-31 |
| `Prismatic Shimmering Constellation` | `codex` | `GPT-5` | `019e7e` | `eef-d2-no-escape-hatches-plan-report-principles-repair; eef-d2-plan-repair-review-synthesis` | 2026-05-31 | 2026-05-31 |
| `Deep Drifting Anchor` | `codex` | `GPT-5` | `019e7e` | `eef-predecision-report-repair-review-synthesis` | 2026-05-31 | 2026-05-31 |
| `Estuarine Rolling Harbour` | `codex` | `GPT-5` | `019e7d` | `eef-d1-d3-owner-question-resolution` | 2026-05-31 | 2026-05-31 |
| `Hearthlit Roasting Caldera` | `codex` | `GPT-5` | `019e7d` | `eef-reviewer-synthesis-plan-repair-architecture-brief` | 2026-05-31 | 2026-05-31 |
| `Twilit Threading Satellite` | `claude` | `Opus 4.8` | `435b98` | `eef-plan-positive-recast-d0-complete-no-exceptions-rule` | 2026-06-01 | 2026-06-01 |
| `Shaded Swaying Sapling` | `claude` | `Opus 4.8` | `d37ba7` | `eef-re-review-stub-deletion-decontamination` | 2026-06-01 | 2026-06-01 |
| `Evergreen Budding Copse` | `codex` | `GPT-5` | `019e7f` | `eef-d2-d6-replacement-plan-correction` | 2026-06-01 | 2026-06-01 |
| `Windswept Floating Summit` | `claude` | `Opus 4.8` | `d8560c` | `eef-plan-seam-mapping-grounded-review-corrections` | 2026-06-01 | 2026-06-01 |
| `Lunar Transiting Eclipse` | `claude` | `Opus 4.8` | `9cde59` | `eef-d2-implementation-and-contamination-correction` | 2026-06-01 | 2026-06-01 |
| `Coppery Warming Flame` | `claude` | `Opus 4.8` | `9a5cc3` | `consolidation-plan-currency-and-graph-ingest-decontamination` | 2026-06-01 | 2026-06-01 |
| `Dawnlit Dancing Satellite` | `claude` | `Opus 4.8` | `b91f7b` | `eef-plan-and-d3-review-currency-fixes-and-backout` | 2026-06-01 | 2026-06-01 |
| `Glittering Soaring Meteor` | `claude` | `Opus 4.8` | `9d9b06` | `graph-estate-points-1-2-3-and-adr-173-decontamination` | 2026-06-01 | 2026-06-01 |
| `Flamebright Charring Ember` | `claude` | `Opus 4.8` | `30dd5d` | `eef-adr-graph-plan-review-and-refinement` | 2026-06-02 | 2026-06-02 |
| `Abyssal Flowing Beacon` | `claude` | `Opus 4.8` | `762085` | `mcp-output-schema-audit-rewrite-and-graph-projection-plan` | 2026-06-02 | 2026-06-02 |
| `Silvered Lurking Mask` | `claude` | `Opus 4.8` | `bbb696` | `one-thread-resequencing-ratification-and-estate-corrections` | 2026-06-02 | 2026-06-02 |
| `Stellar Waning Planet` | `claude` | `Opus 4.8` | `64c383` | `mandate-1-deep-contamination-scan` | 2026-06-02 | 2026-06-02 |
| `Opalescent Cascading Planet` | `claude` | `Opus 4.8` | `0340f9` | `graph-estate-consolidation-execution` | 2026-06-02 | 2026-06-02 |
| `Galactic Glowing Prism` | `claude` | `Opus 4.8` | `cd7389` | `jc4-unified-substrate-migration-plan-authoring` | 2026-06-02 | 2026-06-02 |
| `Seaworthy Swimming Sextant` | `claude` | `Opus 4.8` | `a85c18` | `eef-d3-contract-authoring-and-review` | 2026-06-02 | 2026-06-03 |
| `Lacustrine Swimming Beacon` | `claude` | `Opus 4.8` | `687a54` | `eef-d3-review-then-ratify` | 2026-06-03 | 2026-06-03 |
| `Burnished Glowing Spark` | `claude` | `Opus 4.8` | `67b679` | `eef-d4-contract-authoring` | 2026-06-04 | 2026-06-04 |
| `Shadowed Creeping Secret` | `claude` | `Opus 4.8` | `b33dcf` | `eef-d4-whole-plan-review-then-ratify` | 2026-06-04 | 2026-06-04 |
| `Twilit Cascading Supernova` | `claude` | `Opus 4.8` | `bb53a9` | `migration-plan-overhaul` | 2026-06-04 | 2026-06-04 |
| `Windward Gliding Squall` | `claude` | `Opus 4.8` | `ab2bcd` | `eef-d5-execution-plan-authoring-and-review` | 2026-06-04 | 2026-06-04 |
| `Prismatic Twinkling Planet` | `claude` | `Opus 4.8` | `b56c93` | `eef-d5-fresh-dual-review-and-condition-fold-in` | 2026-06-04 | 2026-06-04 |
| `Dim Dimming Threshold` | `claude` | `Opus 4.8` | `192ae9` | `eef-d5-execution` | 2026-06-05 | 2026-06-05 |
| `Masked Creeping Lantern` | `claude` | `Opus 4.8` | `86584c` | `eef-deep-review-resolutions-adr191` | 2026-06-05 | 2026-06-05 |
| `Dim Fading Hush` | `claude` | `Opus 4.8` | `1952e2` | `eef-d6-reflection-architecture-correction-and-handoff` | 2026-06-06 | 2026-06-06 |
| `Dusky Dimming Candle` | `claude` | `Opus 4.8` | `ef59e2` | `author-d6-execution-plan` | 2026-06-06 | 2026-06-06 |
| `Floating Darting Cloud` | `claude` | `Opus 4.8` | `0ef4c7` | `d7-golive-plan-edit` | 2026-06-06 | 2026-06-06 |
| `Zephyrous Kiting Squall` | `claude` | `Opus 4.8` | `e41262` | `d6-readiness-regrounding` | 2026-06-06 | 2026-06-06 |
| `Moonlit Orbiting Moon` | `claude` | `Opus 4.8` | `b6552f` | `d6-execution-reshaped-c0-reverted` | 2026-06-06 | 2026-06-07 |
| `Arboreal Shedding Canopy` | `claude` | `Opus 4.8` | `8d289e` | `d6-reshape-and-phase-e-handoff` | 2026-06-07 | 2026-06-07 |
| `Hidden Prowling Owl` | `claude` | `Opus 4.8` | `bcc138` | `c1-finite-domain-prereq-and-type-widening-doctrine` | 2026-06-07 | 2026-06-07 |
| `Pelagic Charting Rudder` | `claude` | `Opus 4.8` | `39ff77` | `c1-c3-authoring-and-strict-type-flow` | 2026-06-07 | 2026-06-07 |
| `Evergreen Blossoming Copse` | `claude` | `Opus 4.8` | `3479e1` | `adr-193-vendor-boundary-and-egress-membrane` | 2026-06-08 | 2026-06-08 |
| `Luminous Drifting Dawn` | `claude` | `Opus 4.8` | `a143b3` | `c6-tool-gating-fix` | 2026-06-08 | 2026-06-08 |
| `Lanternlit Shrouding Raven` | `claude` | `Opus 4.8` | `7636f9` | `c4-c5-reflection-and-attribution-fix` | 2026-06-08 | 2026-06-08 |
| `Briny Charting Lagoon` | `claude` | `Opus 4.8` | `4dae1b` | `d6-completion-attribution-passthrough-flag-default-on-and-live-exercise` | 2026-06-08 | 2026-06-08 |
| `Incandescent Smouldering Brazier` | `claude` | `Opus 4.8` | `939d21` | `post-d7-answertype-and-headline-view-adr194-product-boundary-and-output-schema-integration` | 2026-06-09 | 2026-06-09 |
| `Brazen Roasting Cinder` | `claude` | `Opus 4.8` | `527005` | `aic-deferred-reviews-and-graph-tools-plan-promotion` | 2026-06-09 | 2026-06-09 |
| `Fragrant Spreading Sapling` | `claude` | `Fable 5` | `47f78a` | `graph-plan-readiness-seam-analysis-and-decision-complete` | 2026-06-09 | 2026-06-10 |
| `Veiled Listening Secret` | `claude` | `Fable 5` | `7c8e8e` | `graph-implementation-team-director` | 2026-06-10 | 2026-06-10 |
| `Airy Wheeling Gale` | `claude` | `Opus 4.8` | `597439` | `graph-implementation-seat-b-track-g-implementer` | 2026-06-10 | 2026-06-10 |
| `Riverine Swimming Sail` | `claude` | `Opus 4.8` | `5cc20f` | `graph-implementation-seat-a-track-s-implementer` | 2026-06-10 | 2026-06-10 |
| `Pearly Snorkelling Dock` | `claude` | `Opus 4.8` | `5e9a5c` | `graph-implementation-seat-a-s2-u1-implementer` | 2026-06-10 | 2026-06-10 |
| `Abyssal Swimming Mast` | `claude` | `Opus 4.8` | `b14f60` | `graph-implementation-seat-b-g1a-fixes-and-g1b-c1-implementer` | 2026-06-10 | 2026-06-10 |
| `Iridescent Glowing Sun` | `claude` | `Opus 4.8` | `53b04f` | `g4-gate1-parity-verdict-and-design-pull-forward` | 2026-06-10 | 2026-06-10 |
| `Luminous Scattering Dawn` | `claude` | `Opus 4.8` | `39d471` | `agent-tools-comms-watch-hang-hardening-implementer` | 2026-06-10 | 2026-06-10 |
| `Umbral Prowling Lantern` | `claude` | `Fable 5` | `9134e5` | `g4a-keywords-description-implementer-iridescent-successor` | 2026-06-10 | 2026-06-10 |
| `Radiant Ascending Eclipse` | `claude` | `Fable 5` | `8cd0b9` | `graph-implementation-seat-b-g1b-c2-implementer` | 2026-06-10 | 2026-06-10 |
| `Solar Soaring Star` | `claude` | `Fable 5` | `7f0c08` | `graph-implementation-director-successor` | 2026-06-10 | 2026-06-10 |
| `Airy Lifting Squall` | `claude` | `Fable 5` | `69dc9c` | `g4-keywords-lane-implementer-umbral-successor` | 2026-06-10 | 2026-06-10 |
| `Celestial Twinkling Orbit` | `claude` | `Fable 5` | `78c851` | `graph-implementation-seat-b-g1b-c2-completion-radiant-successor` | 2026-06-10 | 2026-06-10 |
| `Celestial Glowing Dusk` | `claude` | `Fable 5` | `1e526e` | `graph-implementation-director-third-holder` | 2026-06-10 | 2026-06-10 |
| `Galactic Soaring Nebula` | `claude` | `Fable 5` | `f01540` | `g4-seat-successor-g2-mint-rule-design` | 2026-06-10 | 2026-06-10 |
| `Eclipsed Masking Shade` | `claude` | `Fable 5` | `952c10` | `graph-implementation-seat-b-g1b-finish-twinkling-orbit-successor` | 2026-06-10 | 2026-06-10 |
| `Fruited Blossoming Meadow` | `claude` | `Fable 5` | `4536e0` | `graph-implementation-galactic-successor-standby-g2-lane` | 2026-06-10 | 2026-06-10 |
| `Glassy Plumbing Dock` | `claude` | `Fable 5` | `ca5890` | `graph-implementation-eclipsed-successor-standby-g1b-finish-seat` | 2026-06-10 | 2026-06-10 |
| `Stratospheric Swooping Zephyr` | `claude` | `Fable 5` | `fe53ec` | `graph-implementation-director-fourth-holder` | 2026-06-10 | 2026-06-11 |
| `Sylvan Bending Branch` | `claude` | `fable-5` | `9d91e3` | `graph-implementation-g2-execution-fruited-pdr063-successor` | 2026-06-10 | 2026-06-10 |
| `Tempestuous Rising Gale` | `claude` | `Fable 5` | `60496a` | `graph-implementation-s3-seat-successor-standby` | 2026-06-10 | 2026-06-10 |
| `Ethereal Orbiting Eclipse` | `claude` | `Fable 5` | `f92636` | `graph-implementation-director-fifth-holder` | 2026-06-10 | 2026-06-11 |
| `Tempestuous Darting Gale` | `claude` | `Fable 5` | `6243de` | `graph-implementation-g4b-implementer` | 2026-06-11 | 2026-06-11 |
| `Sylvan Branching Pollen` | `claude` | `Fable 5` | `89f3b3` | `reliability-micro-queue-implementer` | 2026-06-11 | 2026-06-11 |
| `Evergreen Budding Sapling` | `claude` | `Fable 5` | `1e6b10` | `reliability-seat-sylvan-successor` | 2026-06-11 | 2026-06-11 |
| `Seaworthy Surfing Compass` | `claude` | `Fable 5` | `e7dd0b` | `graph-implementation-g4b-tempestuous-darting-successor` | 2026-06-11 | 2026-06-11 |
| `Cindery Forging Volcano` | `claude` | `Fable 5` | `378172` | `graph-implementation-g4b-implementer-third-seat-holder` | 2026-06-11 | 2026-06-11 |
| `Oceanic Flowing Harbour` | `claude` | `Fable 5` | `e05bf4` | `n3-arc-reliability-successor-team-channel-opener + research-appraisal-and-planning` | 2026-06-11 | 2026-06-11 |
| `Seaworthy Fathoming Pier` | `claude` | `Fable 5` | `4a1b92` | `n3-arc-reliability-successor-team` | 2026-06-11 | 2026-06-11 |
| `Hushed Watching Night` | `claude` | `Fable 5` | `999f69` | `seat-z-then-n1-reliability-and-arc-closeout` | 2026-06-11 | 2026-06-11 |
| `Sunlit Waxing Asteroid` | `claude` | `Fable 5` | `14a56a` | `graph-implementation-director-sixth-holder` | 2026-06-11 | 2026-06-11 |
| `Blustery Buffeting Gale` | `claude` | `Fable 5` | `9819b2` | `graph-implementation-g4b-fourth-holder-then-eef-reproof` | 2026-06-11 | 2026-06-11 |
| `Iridescent Threading Constellation` | `claude` | `Fable 5` | `f9454b` | `graph-implementation-director-seventh-holder` | 2026-06-11 | 2026-06-11 |
| `Smouldering Stoking Hearth` | `claude` | `fable-5` | `fddf14` | `position-anchored-w1c1-implementer` | 2026-06-11 | 2026-06-11 |
| `Scorched Kindling Ash` | `claude` | `fable-5` | `0d8138` | `eef-revalidation-pr177-monitor-to-merge` | 2026-06-11 | 2026-06-11 |
| `Prismatic Shimmering Planet` | `claude` | `fable-5` | `65394e` | `pr176-shepherd-then-keyword-stories-then-2b-dedup` | 2026-06-11 | 2026-06-11 |
| `Nebulous Shimmering Nebula` | `claude` | `fable-5` | `3493fb` | `pr178-remainder+w2c1-implementer` | 2026-06-11 | 2026-06-11 |
| `Pearly Snorkelling Compass` | `claude` | `fable-5` | `a8eabc` | `doctrine-curation-lane-tranche-boundary` | 2026-06-11 | 2026-06-11 |
| `Dawnlit Glimmering Orbit` | `cursor` | `Fable 5` | `50c2d1` | `oak-prod-live-mcp-exercise-snagging-and-cursor-visibility-writeup` | 2026-06-11 | 2026-06-11 |
| `Dusky Passing Mist` | `claude` | `Fable 5` | `2c0c4b` | `snagging-execution-token-metric-pr190-eef-dual-shape-then-midcycle-handoff` | 2026-06-11 | 2026-06-11 |
| `Cosmos turns Equinox` | `claude` | `Fable 5` | `1bc763` | `snagging-execution-successor-pickup-per-handoff-record-7fb69812` | 2026-06-11 | 2026-06-12 |

## Cross-Plan and Cross-Thread Links

- **Controlling plan**:
  [`eef-d6-execution.plan.md`](../../../../plans-old-archive/sector-engagement/eef/archive/eef-d6-execution.plan.md) (completed, archived);
  contracts: `eef-d3-mcp-contract.md`, `eef-d4-graph-capability-contract.md`,
  `eef-d5-execution.plan.md` (same `current/` directory).
- **Parent thread**: [`sector-engagement.next-session.md`](sector-engagement.next-session.md).
- **Authoritative ADRs**:
  [ADR-191](../../../../docs/architecture/architectural-decisions/191-deterministic-data-surface-agent-reasons.md)
  (deterministic data),
  [ADR-193](../../../../docs/architecture/architectural-decisions/193-system-vendor-type-boundary-membrane.md)
  (vendor type-boundary / egress membrane).
