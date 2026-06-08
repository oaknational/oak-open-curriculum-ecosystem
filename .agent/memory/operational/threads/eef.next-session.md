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

## Current Continuation

- **Branch**: `feat/graph-tooling-tidyup` — re-derive git first-hand.
- **Controlling plan**:
  [`eef-d6-execution.plan.md`](../../../plans/sector-engagement/eef/current/eef-d6-execution.plan.md).
- **D6 IS COMPLETE** (2026-06-08, Briny Charting Lagoon): **c4** (`eef://interpretation`
  `text/markdown` resource) and **c5** (`adapt-lesson` prompt) authored SDK-side in
  `oak-curriculum-sdk/src/mcp/` (no egress functions — ADR-193 §Scope: a `string` / a
  `PromptMessage[]` do not originate from a strict domain type), co-gated app-side behind
  `OAK_CURRICULUM_MCP_EEF_ENABLED`. The c3 provenance was corrected to pass the full corpus
  `source` through (authors + URLs retained — see Standing Decisions). c1–c3 + c6 tool-gating
  landed earlier. All workspace gates green; the c4 strand index carries each strand's
  `eef_url`.
- **Next safe step: D7** — the teacher-value round trip (free-form lesson context → finite EEF
  tool inputs → research-grounded options, caveats + attribution intact), per the master plan.
- **Acceptance bar carried**: every tool/resource/prompt is real graph-derived logic with
  tests, or it is absent; strict types (no widening on finite-domain `z.enum`); source
  attribution never filtered; no `--no-verify`.

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
| `Briny Charting Lagoon` | `claude` | `Opus 4.8` | `4dae1b` | `d6-c4-c5-completion-and-attribution-passthrough-correction` | 2026-06-08 | 2026-06-08 |

## Cross-Plan and Cross-Thread Links

- **Controlling plan**:
  [`eef-d6-execution.plan.md`](../../../plans/sector-engagement/eef/current/eef-d6-execution.plan.md);
  contracts: `eef-d3-mcp-contract.md`, `eef-d4-graph-capability-contract.md`,
  `eef-d5-execution.plan.md` (same `current/` directory).
- **Parent thread**: [`sector-engagement.next-session.md`](sector-engagement.next-session.md).
- **Authoritative ADRs**:
  [ADR-191](../../../../docs/architecture/architectural-decisions/191-deterministic-data-surface-agent-reasons.md)
  (deterministic data),
  [ADR-193](../../../../docs/architecture/architectural-decisions/193-system-vendor-type-boundary-membrane.md)
  (vendor type-boundary / egress membrane).
