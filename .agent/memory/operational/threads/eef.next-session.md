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

- **Branch**: `feat/graph-tooling-tidyup` — **clean and pushed** at HEAD `934d5c21`
  (re-derive git first-hand; this supersedes the Lanternlit banner's "2 ahead / UNPUSHED"
  TREE STATE line, which was true only at that session's write-time).
- **Controlling plan**:
  [`eef-d6-execution.plan.md`](../../../plans/sector-engagement/eef/current/eef-d6-execution.plan.md).
- **Next safe step**: complete **D6** — author **c4** (`eef://interpretation` resource) and
  **c5** (`adapt-lesson` prompt) as SDK-side builders with **no egress functions** (ADR-193
  §Scope is conditional; neither content crosses from a strict domain type), co-gate both
  behind `OAK_CURRICULUM_MCP_EEF_ENABLED` in the single `registerHandlers` site, run full
  `pnpm check` GREEN, land ONE commit by explicit pathspec (no `--no-verify`), flip the
  `d6-mcp-composition-eef-surface` todo, then **D7** (teacher-value round trip).
- **Completed prerequisites**: D0–D5 landed; c1–c3 authored + c6 tool-gating committed +
  pushed (`bebca689`); c4/c5 reflection + the attribution/no-PII decision + the
  sparse-curation caveat landed (`7c0eb907`) and handed off (`02f2bd41`).
- **Acceptance bar**: every tool/resource/prompt is real graph-derived logic with tests, or
  it is absent; strict types (no widening on finite-domain `z.enum`); no `--no-verify`.
- The detailed live handoff (the full c4/c5 reasoning, the SDK call-shape references, the
  reviewer set) is the Lanternlit banner immediately below.

> **🤝 HANDOFF — EEF thread (2026-06-08, Lanternlit Shrouding Raven / `7636f9`;
> claude / Opus 4.8). c4/c5 REFLECTION + TWO LANDED REFINEMENTS. The owner-directed
> attribution decision is SETTLED and enforced; the sparse-curation safety caveat now
> travels on the tool surface. Next session COMPLETES D6 (c4 resource + c5 prompt).
> Self-contained; re-derive git first-hand.**
>
> **WHAT LANDED THIS SESSION (commit `7c0eb907` "fix(eef): emit org-level attribution
> only and note sparse axis coverage" — gate-green at commit, 97/97 turbo):**
>
> 1. **Attribution / no-PII (owner-settled this session).** Decision: *do not cite the
>    individual research authors in every response; name them in EEF tool documentation.*
>    The emitted `EefEvidenceProvenance.source` is narrowed to
>    `Omit<CorpusMeta['source'], 'original_authors'>` and constructed as
>    `{ name, url, organisation }` only (strict, no cast) in
>    `graph-corpus-sdk/src/eef-strands/eef-evidence.ts`. The six author names STAY in the
>    corpus `as const` (`eef-toolkit.external-data.ts`) and in the EEF README — they are
>    simply not emitted at runtime. A behaviour-anchored test asserts
>    `'original_authors' in provenance.source === false` (`eef-evidence.unit.test.ts`), so a
>    re-add fails the suite. The c4 resource MUST emit org-level attribution only, to match
>    (it is a runtime response, not "documentation about the tools").
> 2. **Sparse-curation safety caveat moved onto the reliable surface.** Added one sentence
>    to the `get-eef-evidence` description (`aggregated-eef-evidence.ts`): axis filters
>    (`phase`/`keyStage`/`priority`) match only the strands the corpus tags for school
>    context — they focus, they do not bound coverage, and a missing tag is not evidence of
>    inapplicability. This was previously reliable ONLY via the (pull-based,
>    maybe-never-fetched) `eef://interpretation` resource; it now reaches every agent that
>    sees the tool. ADR-191-clean (a coverage fact, not server-side reasoning).
>
> **c4/c5 REFLECTION — THE LOAD-BEARING CONCLUSION (grounded first-hand against the
> precedents + ADR-193; do NOT re-derive):**
>
> - **c4/c5 need NO egress membrane.** ADR-193's egress function is for the ONE crossing
>   where a strict named interface meets the vendor's `Record<string, unknown>` (the tool
>   envelope -> `structuredContent`). ADR-193 §Scope is conditional: a primitive crosses via
>   an egress function only if it *"originates from a strict domain type"*. c4 resource
>   content crosses as `text: string` (markdown); c5 prompt content crosses as
>   `PromptMessage[]` (strings). Neither originates from a strict domain type -> **author NO
>   `*ToReadResourceResult` / `*ToGetPromptResult` egress functions.** Adding them would be
>   doctrine-by-analogy (the failure mode this thread keeps hitting).
> - **c4 does NOT use `graph-resource-factory.ts` / `createGraphResource`** — that factory
>   emits `application/json` and `JSON.stringify`s a data graph. c4 is authored, layered
>   `text/markdown`. The right SDK-call-shape reference for a MARKDOWN resource is
>   `documentation-resources.ts` (`docs://oak/*`) — read it as a vendor-call-shape FACT, not
>   as authority. (`curriculum-model-resource.ts:20-25` already documents the same "do not
>   reuse the JSON factory for a different responsibility" call.)
> - **Existing files are EVIDENCE of the SDK call shape, never AUTHORITY for correctness.**
>   The recent pain was precedent-as-authority. Verify the call shape against working code;
>   derive content/structure from D3 + the corpus.
>
> **c4 — `eef://interpretation` resource (D3 §resource, ratified):** a static `text/markdown`
> builder that projects the corpus `as const` into the three labelled layers (corpus-cited
> methodology/caveats/source/licence/coverage + 30-strand index; agent-side interpretation
> guidance, tagged; graph-structural field names). Input none, output `string`. Homed
> SDK-side (corpus projection is domain logic); registered app-side via the read handler
> returning `{ contents: [{ uri, mimeType: 'text/markdown', text }] }`. Attribution =
> org-level only (per the settled decision above).
>
> **c5 — `adapt-lesson` prompt (D3 §prompt, ratified):** message builder
> `{ topic, yearGroup } -> PromptMessage[]` instantiating the workflow (free-form -> finite
> tool inputs; use Oak material + misconception/prior-knowledge graphs; name the move
> agent-side; call `get-eef-evidence`; preserve caveats/attribution; options not selections).
> `argsSchema` (topic, yearGroup) is MCP prompt-argument validation — OUTSIDE the EEF tool
> input-schema rule (D3/R4). Reference `mcp-prompt-messages.ts` for the `PromptMessage` call
> shape (fact, not authority). Homed SDK-side; registered app-side.
>
> **c6 co-gating (existing site):** both c4/c5 register only when `eefEnabled`, in the single
> `registerHandlers` site (`handlers.ts:144-149`: `registerTools` -> `registerAllResources`
> -> `registerPrompts`), behind `OAK_CURRICULUM_MCP_EEF_ENABLED` (default OFF). The tool
> gating is ALREADY committed + pushed (`bebca689`).
>
> **TREE STATE:** see **Current Continuation** above — branch is clean and pushed at
> `934d5c21`. When you implement c4/c5, stage by EXPLICIT pathspec; NEVER `git add -A`. No
> `--no-verify`.
>
> **NEXT SAFE STEPS (complete D6):**
>
> 1. **c4 resource** + **c5 prompt** (SDK-side builders, NO egress functions) — author
>    test-first per D3.
> 2. Co-gate c4/c5 in the `registerHandlers` site behind the flag.
> 3. Full `pnpm check` GREEN -> ONE commit by explicit pathspec -> D6 complete -> flip the
>    master plan `d6-mcp-composition-eef-surface` todo, then D7 (teacher-value round trip).
>
> **REVIEWERS (D6 plan readiness):** `mcp-expert` (resource/prompt registration
> contract-faithful), `architecture-expert-fred` (SDK-side homing; acyclic runtime dep),
> `type-expert`; adversarial diff review before the green commit. Ground every finding
> first-hand (first-hand = you, not the sub-agent).

## Standing Decisions (pointers — the cited homes are authoritative)

- **Deterministic data; the agent is the only reasoner** →
  [ADR-191](../../../../docs/architecture/architectural-decisions/191-deterministic-data-surface-agent-reasons.md).
- **System↔vendor type-boundary / egress membrane** →
  [ADR-193](../../../../docs/architecture/architectural-decisions/193-system-vendor-type-boundary-membrane.md).
  **DEAD — do NOT re-explore** (ADR-193 §Alternatives): carrier fix / index signature /
  preserve-to-`registerTool` / generic-spine.
- **Attribution: org-level only at runtime**; the six author names live in the corpus
  `as const` + the EEF README only (enforced by the `eef-evidence.unit.test.ts` assertion).
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
