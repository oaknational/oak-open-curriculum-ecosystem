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

- **STRATEGY-LAYER DISCUSSION RESOLVED; APPROACH RECONCEIVED TO THE INFORMATIONAL MODEL
  (2026-06-18, Asteroid calls Meridian, solo, `docs/planning-and-validation`).** The Q-002
  strategy-layer discussion the prior session gated **happened and reshaped the approach**. Scope
  authority is the controlling plan
  [`vision-strategy-and-plan-estate.plan.md`](../../plans/vision-strategy-and-plan-estate.plan.md),
  **reconceived 2026-06-18** from a three-phase temporal DAG to a **four-layer informational-
  dependence model** — `Oak's strategy → our vision → our strategy → our planning` (each arrow =
  what must be *known* to author the next layer, **not execution order**) — with **three separate,
  co-equal, first-class bodies of work** (vision / strategy / plan estate). Load-bearing owner
  corrections: **(1)** Oak has its own strategy; our vision **services** it (align, not fulfil) —
  Oak's strategy is the top layer, read inform-only from `.agent/reference-local/` (never
  quoted/linked/copied); stream→goal map: teachers←app, ecosystem←tools **and** the Practice
  framework, **schools = deliberate non-goal**. **(2)** the three streams are a **system** (framework
  builds the two; tools are the app's foundation; app proves the foundation) — strategy must be
  cohesive **across and within**, and all three streams are co-equal. **(3)** the MCP app carries
  additional alpha→beta→production requirements (a property of that stream); **K1–K3 are its
  production-readiness keystones** (the ratified decisions are **preserved**). Strategy gets a new
  home: **`docs/strategy/`**.
  **Next safe step:** author the **strategy corpus (Body 2)** at `docs/strategy/` (diagnosis;
  Oak-alignment as original derivation; streams-as-system map; per-stream choices + won't-do +
  measures; K1–K3 inside the app section; release-readiness as named hand-offs). In parallel, the
  strategy-**independent** estate slice (read every plan, extract permanent docs, archive complete)
  may proceed; the restructure's **new boundaries** wait for Body 2. `value-and-impact.md` and
  `2a-decisions.md` are **archived** (`.agent/plans/archive/`); Body 2 absorbs them from there. Full
  start sequence: [thread record](threads/strategy-and-plan-estate-holistic-review.next-session.md).
  **Deep consolidation status: completed this handoff (2026-06-18, session-completion mode)** —
  session learning homed (PDR-103 + the `scope-from-goal` rule; the best-effort-policy captured to
  pending-graduations as `due`); continuity, thread record, and disposition register current.
  **Branch operational state (NOT owned by this thread, expect on session-open):** (1) the SonarCloud
  "file encoding problems" warning was fixed by a parallel agent — `sonar.sourceEncoding=UTF-8`,
  committed `ee6a389f9`; (2) the upstream OpenAPI spec drift (`/sequences/{slug}`→`{sequence}`)
  **LANDED as `e12587b9d` on PR #213** (Bluebell guards Acorn, n=2, 2026-06-18) — pure idempotent
  rename of the 10 SDK-codegen files; the tree is clean and the `CI=true` workaround is retired. See
  the dedicated SDK spec-sync bullet below.
- **UPSTREAM SDK SPEC-SYNC (sequences param rename) — LANDED (2026-06-18, Bluebell guards Acorn, n=2
  with Wisteria spins Bark; commit `e12587b9d`, PR #213).** Upstream OOC spec `0.7.0-69d2b6c9`→`f7c18ead`
  renamed the `get-sequences` path param `slug`→`sequence` (matching its siblings
  assets/questions/units; eliminates the lone `slug` PathGroupingKey). The 10 SDK-codegen regen files
  were verified first-hand as a pure, idempotent rename (CI-mode regen reproduces them). A
  spec→input-flow guard test + a breaking-change-classification runbook addition landed with it (owner
  invariant: all API-tool input parameters flow automatically from the spec). Strategic follow-on:
  [`upstream-spec-change-automation.plan.md`](../../plans/sdk-and-mcp-enhancements/future/upstream-spec-change-automation.plan.md).
- **Collaboration-doctrine decomposition — strategic brief LANDED (2026-06-17).** Both collaboration
  directives are layer-blenders predating the PDRs that own their substance; the future
  [`collaboration-directive-decomposition.plan.md`](../../plans/agent-tooling/future/collaboration-directive-decomposition.plan.md)
  routes each unit by `new-rule-vs-pdr-clause`. Full detail (incl. the M2 operating-context-mode →
  PDR+rule correction): [`agentic` thread record][agentic] §Collaboration-Doctrine Decomposition Lane.
  **Next:** promote on rightsizing-keystone M2 ratification.
- **Owner-gated vocabulary purge + universal CLI API-surface consistency — LANDED (2026-06-16,
  `5a2d365b8`/`66bd1e218`/`9abd9893f`).** Knowledge-flow `owner-gated` purged; action-authority /
  safety gates (merge / promotion / Sonar / `--no-verify` / limit-raise / Core-edit) KEPT — the
  "Core-edit" gate later disambiguated by
  [PDR-104](../../practice-core/decision-records/PDR-104-best-effort-doctrine-authoring-in-consolidation.md)
  (sub-agent-protection sense kept; owner-pre-approval-of-each-amendment sense relaxed for dedicated
  consolidation). PDR-055 amended to universal CLI consistency;
  [`agent-tools-cli-ergonomics.plan.md`](../../plans/agent-tooling/current/agent-tools-cli-ergonomics.plan.md)
  authored. Detail: [`agentic` thread record][agentic] §Decision-Debt Lane. **Next:** CLI-ergonomics
  WS0 (push + decision-debt drain done).
- **Clerk 2.1.26 auth fix + native-MCP-auth spike — LANDED (2026-06-16, 6 commits
  `0692a0b0d`..`bc4fb761f`).** The 2.1.25 security fix (`getAuth` trusts only a branded `req.auth`)
  broke the e2e auth double; fixed by injecting a fake `getAuth` at the `CreateMcpAuthClerkDeps` seam
  (`f11e2e0ff`), production behaviour unchanged. Bespoke-vs-native MCP-auth captured as a strategic
  spike: [`native-mcp-sdk-auth-build-vs-buy.md`](../../plans/security-and-privacy/future/native-mcp-sdk-auth-build-vs-buy.md)
  (MCP SDK 1.29.0 + `@clerk/mcp-tools` 0.5.0, grounded first-hand). **Next:** spike promotes on owner
  adopt/adopt-partial after the investigation.
- **Fitness report-only + discrete ceilings + dwell-time — LANDED + PUSHED (2026-06-16,
  `8665da651`/`3cb64da91`).** All fitness output never fails a build (validator always exits 0);
  decision-debt uses discrete-ceiling counts + a dwell-time axis (`dwell.ts`). ADR-144 reframed
  gate→signal; PDR-100 Decision 3 reconciled. Also landed: citation-or-silence (`verify-dont-trust`),
  no-mutable-state-in-memory (`per-user-memory-is-a-buffer`), the Second Question in `AGENT.md`.
  **Open:** Q-001 cadence-anchor (open-questions). Detail: [`agentic` thread record][agentic].
- **Fitness-validator scoping + disposition-category grouping — LANDED (2026-06-15, `6ffbc14e0`).**
  The fitness walkers exclude foreign worktrees / repo-root `tmp/` / `.agent/reference-local`; the
  report groups per-file by disposition category. Recorded as PDR-097 + an ADR-144 amendment (source
  of truth `agent-tools/src/practice-fitness/categories.ts`). Follow-on plans:
  [hook-policy TS+schema](../../plans/agent-tooling/future/hook-policy-typescript-and-schema-unification.plan.md)
  and [cSpell gate](../../plans/agent-tooling/future/cspell-quality-gate.plan.md). **Next:** refresh
  the PR for `docs/planning-and-validation`.
- **Strategy & plan-estate holistic survey — durable report LANDED, archived (2026-06-15).**
  Multi-wave whole-estate survey + 6-agent adversarial verification:
  [`reports/archive/plan-estate-survey-2026-06-15/`](../../reports/archive/plan-estate-survey-2026-06-15/README.md).
  Owner corrections: ~40% inward is deliberate (the Practice is a value stream); impact is
  articulated here + measured by Oak; the 2A/2B/2C ordering is **dissolved** (superseded by the
  four-layer model — see the strategy bullet above). **Next:** author the strategy corpus (Body 2)
  at `docs/strategy/`.
- **MCP live-product readiness — framework + assessment + future stub LANDED (2026-06-15); keystones
  K1–K3 owner-RATIFIED 2026-06-17 as the MCP-app stream's production-readiness keystones** (K1 "live"
  = full GA with real teachers + *observed* positive impact; K2 audience = teachers + curriculum
  leaders; K3 scope ⇒ the app's real dependency set must be GA-ready). The other two streams are
  co-equal. Fresh-eyes verdict: the prior M0→M3→GA ladder does NOT stand — replace with the
  impact-first Stage 1–4 ladder (report §8).
  [framework](../../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md) +
  [assessment](../../reports/mcp-app-live-product-readiness-assessment-2026-06-15.md) +
  [stub](../../plans/curriculum-mcp-path-to-ga/future/launch-readiness-and-milestone-redefinition.plan.md).
  **Next:** owner ratifies the ladder → promote the stub.
- **MCP UAT validation runbook — LANDED (2026-06-15, `95ec2708a`).**
  [UAT runbook](../../apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md) +
  [uat-reports](../../apps/oak-curriculum-mcp-streamable-http/docs/uat-reports/README.md) (first prod
  record, GO; EEF dual-shape fix confirmed live in production). **Next:** open a PR for
  `docs/planning-and-validation` (if not already raised).
- **Upstream-spec alignment — PR #200 (2026-06-12, branch `fix/align_with_upstream_api_spec`).** The
  prior upstream OpenAPI alignment (oak-openapi PR 269): schema cache + 30 generated files refreshed;
  the `/keywords:get` correction mechanism retired; the upstream-spec-change runbook landed in the
  [sdk-codegen README](../../../packages/sdks/oak-sdk-codegen/README.md#responding-to-upstream-spec-changes)
  - [build-system.md](../../../docs/engineering/build-system.md#caching). (Continued by the 2026-06-18
  SDK spec-sync `e12587b9d` — see the SDK bullet above.) **Open owner forks:** endpoint-style
  cross-refs in MCP tool descriptions; Q-010 (repair vs retire the orphaned `oak-curriculum-sdk`
  typedoc estate).
- **Onboarding-improvement arc — PR #199 OPEN, merge-once-green (2026-06-12,
  `feat/onboarding-improvement`).** The `/oak-onboard-me` walker + entry-path fixes +
  reviewer-template discipline landed; Track-B dispositions (B4/B5 closed; B1 awaits owner cost
  bands; B2/B3 risk-register draft queued; B6 at the M2 gate). **Next:** owner re-walks
  `/oak-onboard-me` off-branch; B2/B3 register seeding; the ask-the-repo search decision. (The
  comms-corpus research lane this entry once tracked is RETIRED — see §Next Safe Steps; the
  statusline lane lives in the [statusline thread][statusline].)
- **OWNER ROADMAP AFTER THE COMMS RESEARCH (owner direction in-session 2026-06-12, sequenced
  "not all at once"; Director Firefly seeks Temper / `ce44ae` recording).** The comms-corpus research is
  COMPLETE — thread retired 2026-06-14, PR #208 merged to main (rotation homed as
  PDR-094 + ADR-199; findings in `reports/agentic-engineering/` + rightsizing keystone M4).
  The now-live sequence is the owner-named roadmap follow-ons: (1) organise the research's follow-ons; (2) complete naming
  v3 — now a DECISION-COMPLETE plan
  ([`agent-naming-schema-v3.plan.md`](../../plans/agent-tooling/current/agent-naming-schema-v3.plan.md),
  thread [`agent-naming`][agent-naming]; shape C decided per
  [sample sheets + maths](../../reports/agentic-engineering/naming-v3-shape-sample-sheets-2026-06-12.md);
  era-pinning cure is Phase 1 and lands FIRST — Director ruling 10cb3a10); (3) protocols/skills for examining
  production issues in Sentry; (4) organise the Sentry logging improvements those discoveries
  will surface; (5) refine the PostHog plan (home:
  [`mcp-product-analytics` thread](threads/mcp-product-analytics.next-session.md));
  (6) begin planning integration of the oak api repo into this ecosystem repo;
  (7) EEF data unexploited-value: initial gap research landed at
  [`eef-data-surfacing-gap-research-2026-06-12.md`](../../plans/sector-engagement/eef/reference/eef-data-surfacing-gap-research-2026-06-12.md)
  — organise its follow-ons; (8) identify high-impact graphs latent in the bulk data not yet
  extracted; (9) apply the new graph-tool capabilities to the Oak curriculum-ontology repo
  contents (formerly Oak knowledge graphs; sibling checkout `oak-curriculum-ontology`);
  (10) build out React MCP-app capabilities via a user-facing search experience that fully
  shows off hybrid semantic search — update the search-experience intent in the
  [08-experience-surfaces cluster](../../plans/semantic-search/future/08-experience-surfaces-and-extensions/README.md)
  and integrate it into the active
  [`mcp-app-extension-migration.plan.md`](../../plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md)
  WS3 rebuild (this roadmap item is that intent's owner-agreed gate);
  (11) keep the plan discovery surfaces current (`plans/README.md`, `high-level-plan.md`,
  `good-first-issues.md`, `completed-plans.md`) and analyse `plans/notes/` for useful
  substance then retire it. **NAMING v3 SHAPE DECIDED: C (noun + agentive), owner
  2026-06-12** — recorded in the
  [sample-sheets artefact](../../reports/agentic-engineering/naming-v3-shape-sample-sheets-2026-06-12.md);
  sequence stays era-pinning cure → C wordlist curation (full v2 gates, ~120 agentives) → v3
  registry entry. **Comms research dispatch RELEASED by owner (2026-06-12) — its closeout
  gate is MET: the Director session closed 2026-06-12 (PRs #195/#196/#197 merged; final
  handoff + consolidation run).** Correction (verified first-hand 2026-06-12, Thyme wakes
  Canopy): the prior "both prior branches 0-commits-unmerged" claim is FALSE for
  `docs/graph-team-direction-2026-06-10`, which carries TWO unmerged commits
  (`ae5372e2c` plus `c9ff6bb49` — Dawnlit's first-wave snagging evidence: 44 napkin
  lines incl. the Cursor structuredContent captures, 18 eef-record lines, and the
  oak-prod live-exercise verification record). Merging that branch is an open
  owner/Director action; reconcile the napkin/eef-record content on merge.
  (12) The path-sweep code-class follow-on lane: remaining OS-temp-path carriers in code
  (logger runtime defaults, test fixtures, integration temp usage — enumerable via
  `git grep -lF '/tmp/' -- '*.ts' '*.sh'`) plus the CI validator the
  no-machine-local-paths rule names; behaviour changes need their own TDD cycles, never a
  sweep sed. The 2026-06-11/12 handover-team arc itself is COMPLETE: both lanes landed
  (#189–#194), both implementers closed out cleanly; continuity bundles merged as PRs
  #195/#196; the wider-ecosystem options summary merged owner-reviewed as #197.

- **Track-G + the graph implementation arc — COMPLETE AND AT REST (2026-06-11, PRs #142–#186).**
  Authority for the full arc:
  [graph plan](../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md)
  todos + [`eef` record][eef] + [seam analysis](../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md).
  **Live remainder:** the Director-queue agent-tools lanes (register-recorded, incl. the
  `commit-queue` spawn defect — frictions register); the generalisation-plan x5 owner walk; w3-c1 +
  S3 principles at owner direction. Open owner items: principles-prompt attribution validation;
  output-schemas execution routing (entry below).
- **Output-schemas plan — 🟢 DECISION-COMPLETE (owner-ratified 2026-06-09).**
  [`output-schemas-for-mcp-tools.plan.md`](../../plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md):
  every MCP tool `outputSchema` = `composeEnvelopeSchema(payloadSchema)` (EEF tie type-level, never
  `satisfies`-on-value). Its execution gate (graph-tools settle) is met. **Next:** execution routing —
  open Director/owner call. (Cross-cutting: verify load-bearing specialist claims first-hand until the
  specialist-agent overhaul lands.)
- **External-facing capability corpus — merged (PR #140 → v1.16.1).** Corpus map live:
  [`external-facing-capability-distribution.plan.md`](../../plans/user-experience/educator-end-users/current/external-facing-capability-distribution.plan.md).
  **Open owner decisions:** source-of-truth topology (#4) + first-tranche scope (#5); **next:**
  Direction A `t0` / plugin-package `w0` once resolved.
- **EEF build arc (D0–D7) DELIVERED + SHIPPED (v1.16.0, 2026-06-08).** `get-eef-evidence` live by
  default (kill-switch flag; ADR-193 boundary holds); teacher-value proven by release-and-observe.
  Delivered-value:
  [`eef-outcome-evaluation-infrastructure.plan.md`](../../plans/sector-engagement/eef/future/eef-outcome-evaluation-infrastructure.plan.md).
  Full arc: [`eef` record][eef].
- **OAK-PROD MCP snagging — write-up landed, fixes deferred (2026-06-11).** The structuredContent-only
  `get-eef-evidence` success is invisible to the Cursor harness:
  [write-up](../../reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md) +
  [snag register](../../plans/sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md).
  **Next:** run S0 (non-Cursor client probe) per §6, then S1 to owner. First-wave evidence unmerged on
  `docs/graph-team-direction-2026-06-10` (`ae5372e2c`).
- **Agent naming — v2 merged (PR #189); v3 + era-pinning cure now a decision-complete plan
  (2026-06-13).** Durable home: thread [`agent-naming`][agent-naming] +
  [`agent-naming-schema-v3.plan.md`](../../plans/agent-tooling/current/agent-naming-schema-v3.plan.md)
  (DECISION-COMPLETE / QUEUED). **Next:** Phase 1 (WS1 era-pinning cure) — full detail in
  §Next Safe Steps › Agent Naming.
- **DfE data SDK seed + EEF gap-research — landed and merged (2026-06-12, PRs #196/#197).**
  [DfE data SDK seed](../../plans/sector-engagement/future/dfe-data-sdk.plan.md) (thin
  transport-agnostic SDK over DfE EES; complementary to the EEF corpus, owner posture) +
  [Oak×EEF executive briefing](../../plans/sector-engagement/eef/reference/oak-eef-executive-briefing-2026-06-12.md).
  Promotion gate: a named Oak consumer with a ratified value statement. **Next:** owner roadmap
  item 7 (organise the EEF research follow-ons).
- **Claude statusline redesign — RESOLVED and merged (PR #198, 2026-06-12).** Live ctx%
  thresholds green &lt;50 / yellow 50–69 / red ≥70; the tokens segment was deliberately DROPPED
  (Claude Code shows the count natively — do not re-add without that changing). Follow-on:
  [statusline-session-shape-indicators plan](../../plans/agent-tooling/current/statusline-session-shape-indicators.plan.md).
- **Claude Code team-onboarding guide — RESOLVED (2026-06-12).** The generated guide was assessed as
  agent-generated input, mined, and the source deleted; its interaction-design prototype + usage
  evidence folded into the canonical onboarding plan (§Interactive Onboarding Inputs), an `oak-skills`
  row added to `sibling-repos.md`. No open next-step.
- **Statusline session-shape indicators — DONE (2026-06-12, on `feat/statusline-enhancements`).**
  Claims carry an optional `role`; the statusline renders Director demark / team shape / ARC wing from
  two primary-root reads per tick. **Next:** successor pushes + flat PR + post-merge proof. Detail:
  [`agentic` thread record][agentic] §Statusline lane.
- **Current product focus**: `eef` graph-tooling rebuild is the only active product lane. The
  `agentic-engineering-enhancements` activity is a temporary knowledge-curation lane — its live
  WS1→2b→2c→WS2 feedback-mechanism work lives in its thread record, not a product thread.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal
  sources, not long-term documentation. Outside explicit owner-directed research
  windows, process useful substance into memory/docs/plans and clear stale state.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild | [record][eef] | claude / Fable 5 / Thyme wakes Canopy / record-condensation (curation lane) / 2026-06-12, claude-code / Fable 5 / Forge turns Basalt / eef-data-surfacing-gap-research / 2026-06-12, claude / Fable 5 / Cosmos turns Equinox / snagging-execution-successor-pickup (arc landed #190–#193, closed out) / 2026-06-12, cursor / Fable 5 / Dawnlit Glimmering Orbit / oak-prod-snagging-and-cursor-visibility-writeup / 2026-06-11 (first-wave evidence still unmerged on `docs/graph-team-direction-2026-06-10` — see §Current State correction). Full prior-identity history (30+ seats, 2026-06-02 →): the thread record identity table — set-membership verified 2026-06-12 before this dedup |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work, starting with a deep review of the Oak Curriculum Ontology repo (separate concern from the bulk-derived graph redesign) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 — **opened, not started; deep review is a fresh session** |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Zephyrous Buffeting Falcon / skills-lane-relocated-to-educator-end-users / 2026-06-08 (prior: Blustery Lifting Gale skills-taxonomy-and-distribution 2026-06-03, Umbral Whispering Silhouette 2026-06-01) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | claude / Opus 4.8 (1M) / Phobos turns Singularity / collaboration-doctrine-decomposition-plan / 2026-06-17 (prior: Basil tracks Xylem owner-gated-purge 2026-06-16, Lapwing holds Troposphere fitness-report-only 2026-06-16; full prior-identity history: the thread record identity table) |
| `school-data-search` | Oak School Data Search service (POC MVP): briefs → report → plan → gate walk → **deep review complete** → build | [record][school-data-search] | claude / Opus 4.8 / Fiery Sparking Caldera / deep-review-and-refinement / 2026-06-04 (prior: Mossy Whispering Bark 2026-06-04, Furnace Roasting Brazier + Hushed Lurking Mask 2026-06-03) |
| `semantic-search` | Search data foundations: upstream-schema alignment, bulk sourcing, minimal-adaptation arc | [record][semantic-search] | claude / Opus 4.8 / Moonlit Waxing Nebula / upstream-realignment-specialist / 2026-06-03 |
| `statusline-enhancements` | Claude Code statusline: Oak-mark and session-shape indicators LANDED; **live logo swap 2026-06-16** — 5×7 sharpened `braille-sharp` default, 4×6 retained as `braille-sharp-compact`, width-matched separator rule on by default (on `docs/planning-and-validation`, **divergence to reconcile onto `feat/comms-research`**); successor plan **re-grounded session-state-first** 2026-06-15 (`ed563765d`; experimental discovery, no PDR/ADR); statusline lane in two `current/` plans (session-state and logo-modularisation), cross-referenced | [record][statusline] | claude-code / Opus 4.8 / Vole calls Hollow / live-logo-swap-and-plan-harden / 2026-06-16 (prior: Cutter spins Quay 2026-06-15, Orbit stirs Spectrum 2026-06-14) |
| `agent-naming` | PDR-027 display-name derivation: versioned schema registry, session-hook identity surfaces, wordlist eras (v2 landed; v3 + era-pinning cure queued) | [record][agent-naming] | claude / Opus 4.8 / Squall hunts Troposphere / thread-open + v3-plan-author / 2026-06-13 (prior: Moss weaves Blossom v2-landing 2026-06-12, Swift Gliding Zephyr v2-build 2026-06-11) |
| `strategy-and-plan-estate-holistic-review` | Vision/strategy/plan-estate rework (experiment→product), **three co-equal first-class bodies on a four-layer informational model** (Oak strategy → vision → strategy → planning): vision done; strategy-layer discussion **resolved 2026-06-18** and the approach **reconceived**; **next: author the strategy corpus at `docs/strategy/`** (Body 2) with the estate read+extract prep in parallel; restructure's new boundaries informationally gated on the strategy | [record](threads/strategy-and-plan-estate-holistic-review.next-session.md) | claude-code / Opus 4.8 / Baobab lifts Topsoil / surveyor-synthesist / 2026-06-15, claude-code / Opus 4.8 / Ocelot binds Curfew / vision-author / 2026-06-17, claude-code / Opus 4.8 / Tempest spins Spire / controlling-plan author / 2026-06-17, claude-code / Opus 4.8 / Squall spins Stratus / Phase-2A ratification + articulation / 2026-06-17, claude-code / Opus 4.8 / Asteroid calls Meridian / approach-reconception / 2026-06-18 |

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
| `sector-engagement` | External adoption | [record][sector] | claude-code / Fable 5 / Forge turns Basalt / dfe-data-sdk-seed-authoring / 2026-06-12 (prior: Squally / cursor / 2026-04-30) |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |

## Next Safe Steps

### Comms-Corpus Research — RETIRED 2026-06-14

Thread concluded: WS0–WS7 complete, PR #208 merged to main (`a6b14a8a3`). Retired record:
[`threads/agent-collaboration-research.next-session.md`](threads/agent-collaboration-research.next-session.md)
(carries the candidate-themes research substrate + the WS7 closeout conserved findings). Findings
homed in **PDR-094** + **ADR-199**, the `reports/agentic-engineering/` WS2–WS6 synthesis, and the
rightsizing keystone M4; the deep-convergence pass that was deferred here ran as this dedicated
consolidation (2026-06-14). **Standing residual** (not a reopened lane): the coordination-tier
curator-pass — ~1,707 comms events past the 7d window await body-read disposition before the next
archive-move RUN, fired by retention-window elapse via `consolidate-docs` step 3a / `oak-curator-pass`;
the work-list + verification recipe live in the retired record's §"WS7 Closeout — Conserved Findings".

### Agent Naming (v3 + era-pinning cure)

Thread [`agent-naming`][agent-naming]; controlling plan
[`agent-naming-schema-v3.plan.md`](../../plans/agent-tooling/current/agent-naming-schema-v3.plan.md)
(DECISION-COMPLETE / QUEUED, `current/`). v2 merged (PR #189). **Next safe
step**: execute **Phase 1 (WS1, era-pinning cure)** off a fresh branch from
`main` — the P1 single-valued-identity fix (hooks pin the era
`OAK_AGENT_NAMING_SCHEMA_ID`, not the rendered name). It ships independently and
is the owner-ordered prerequisite for v3 activation. Phases 2 (C wordlist
curation, owner taste review BLOCKING) and 3 (v3 registry entry + activation)
follow. Orientation: read the thread record, then the plan, then re-grep the
`OAK_AGENT_IDENTITY_OVERRIDE` consumer set (plan-body first-principles check).

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

### EEF Graph-Tooling Rebuild

The D0–D6 build arc is COMPLETE and SHIPPED (v1.16.0; live by default with a
kill-switch flag) and Track-G executed the graph-tools redesign in full — the
[`eef` record][eef] and the
[EEF rebuild plan](../../plans/sector-engagement/eef/) /
[graph plan](../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md)
todos are the durable authority for the arc's history (D0–D7 chronology,
review outcomes, ADR-191, the contamination-correction arc, commits).

Live remainder:

1. **D7 — the teacher-value round-trip proof** (the master
   `d7-teacher-value-round-trip` todo): delivered-value proof against
   independent ground truth. The EXERCISE RECIPE banner in the
   [`eef` record](threads/eef.next-session.md) carries the server-start
   command and the four working JSON-RPC calls.
2. Graph-estate close: `t6` + the full `t8` remain D7-gated by design (the
   graph-estate items live in the plan todos).
3. The seam-mapping taxonomy + "seams compose, never reconciled" law as a
   reusable plan-template component — registered in
   [`pending-graduations.md`](pending-graduations.md) (2026-06-12).

### Agentic-Engineering Curation

1. The latest dedicated curation pass is 2026-06-12 (Thyme wakes Canopy): napkin
   rotated (archive `napkin-2026-06-12-thyme-curation.md`), distilled graduated
   (five new pattern files), the owner-approved Core amendment queue authored,
   open-questions and pending-graduations drained to live decision-debt.
2. The relative-link integrity item is accepted as a future validator lane, not
   implemented tooling; promote the plan only on its recorded trigger.
3. Comms-event rotation remains paused until the
   [comms-corpus research plan](../../plans/agent-tooling/active/comms-corpus-research-and-rotation-strategy.plan.md)'s
   WS5 proposal is owner-ratified (the plan exists and is execution-ready as of
   2026-06-12; its WS7 (gated on WS5 proposal owner-ratification) is the only legitimate rotation-execution
   surface); fitness is routing evidence only — never archive, split, shard, or
   rename unprocessed content to improve scores. For a later ordinary docs
   continuation, use
   [`codex-docs-consolidation.brief.md`](codex-docs-consolidation.brief.md).

### Connecting-Oak / PR History

Before resuming paused graph-substrate work, re-check current PR, CI, Sonar,
CodeQL, active claims, commit queue, and git state. Do not rely on historical
issue counts in archived prose.

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

1. MCP product analytics execution-plan promotion is deferred. Production PostHog
   capture still needs the legal/privacy gates named in the exploration record.
2. Monorepo workspace topology is held by owner decision (2026-05-09) until after
   the graph MVP implementation tranche, unless the owner reopens it.

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
[branch-fitness]: threads/branch-fitness-and-push-cadence.next-session.md
[statusline]: threads/statusline-enhancements.next-session.md
[agent-naming]: threads/agent-naming.next-session.md
