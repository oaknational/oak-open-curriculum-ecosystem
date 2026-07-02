---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure on a file that grows by append each session; 115 clears the
  noise while still flagging genuine over-runs.
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

**Director handoff:** the next Director's single pick-up point — role procedure,
the readiness self-check before claiming authority, current state, and the live
todo list — is [`director-handoff.md`](director-handoff.md).

## Current State

Compact live state only. Finished-session narrative is conserved in its homes
(commits, ADRs, PDRs, patterns, thread records) and in git history, then drained
from here per `continuity-practice.md` §Disposition; only live lanes and live
forward-asks remain.

- **Upstream API alignment (programmes family) — MERGED (#291, 2026-07-01).** WS0/WS1 (regen +
  cached-default), WS2 (semantic schema-drift check), WS4 (programmes discoverability), WS6
  (permanent alignment runbook, PDR-120) are live on `main`. **Live next safe steps** (detail +
  grounded execution facts in the
  [`upstream-api-alignment` thread record](threads/upstream-api-alignment.next-session.md)):
  (1) the **pre-existing RED gate on `main`** — `sdk-codegen`'s pagination-examples test fails on
  upstream spec drift; fix in a fresh session off latest `main`, never by blind-editing the
  expectation; (2) author the `bulk-types-schema-derivation` future plan (does not exist yet);
  (3) the **MCP pagination-header P1** (ADR-shaped; the thread record's item is the owning
  record); (4) the comms-routing CLI fix
  (`agent-tooling/current/coordination-home-cli-path-defaulting.plan.md`) on the primary.
- **Runbook kind** — a repeatable operational procedure is a recognised content kind delivered via
  skills / reference-docs / rule-embedding
  ([PDR-120](../../practice-core/decision-records/PDR-120-runbooks-are-a-content-kind-not-a-surface.md));
  the [Runbook Index](../../../docs/operations/README.md#runbook-index) lists the corpus.
  Continuity-surface drift prevention is briefed in
  [`future/continuity-surface-drift-prevention.plan.md`](../../plans/agentic-engineering-enhancements/future/continuity-surface-drift-prevention.plan.md).
- **Team-tooling arc CLOSED (2026-06-28/29).** The whole owner-approved batch **#269–#286 plus #282**
  (session-metadata CLI) is **MERGED to `main`**; worktrees closed; the comms rotation/archive ran
  (469 heartbeats archived 2026-06-29); the dedicated consolidation landed (Quoll). Director seat rotated
  via clean PDR-064 two-moments handovers across the arc: **Firefly → Merlin → Triton → Kraken → Trawler →
  Falcon** (current); zero owner-visible coordination escalations. Arc-end coordination PR **#268 MERGED**
  (`1b5ce326`). **NEXT (owner-directed, fresh-context): the SYNTHESIS PHASE** — the worktree-per-agent /
  PDR-117 model verdict (do-first item: the live **F-44** freshness≠liveness safety defect in
  `active-agents.ts`), the PDR-117 expansion (seeded in
  `reports/agentic-engineering/director-howto-and-pdr117-gaps-2026-06-29.md`), the do-first efficiency
  matrix, and the rightsizing-plan M1→M2 activation; then the owner-set next team (two co-equal lanes:
  architecture-efficiency + intent-graph). The owner-approved guiding plan is
  [`team-tooling-session-2026-06-28.plan.md`](../../plans/agent-tooling/current/team-tooling-session-2026-06-28.plan.md);
  the live Director pickup is [`director-handoff.md` §CURRENT HANDOFF STATE](director-handoff.md).
- **Claims model + agent-work-state (LIVE, owner-gated).** The corrected claims model — a claim is an
  optional, advisory, AREA-scoped signal (NOT files; presence/liveness/work-state/seat re-home to
  facets) — is live in `agent-collaboration.md` + memory
  `feedback_claim_is_advisory_area_coordination_not_a_god_object`. **Owner-gated, flagged not edited:**
  PDR-118 (claim-as-anchor superseded by launch-in-worktree, OQ2 amendment); the schema `role` field
  (the one genuine claim-as-seat marker, in tension with "claim is not the seat"); the
  `director-handoff.md` succession liveness gate (safety-critical). **Remaining integration (gated on
  OQ5 composed-liveness):** `collaboration-state-conventions.md` (silent that freshness ≠ liveness); the
  code consumers (`active-agents.ts`, the watcher-gate, the TUI).
- **Spawn-flow tool — ready to build (LIVE pickup).** Launch a session in its worktree → the binding is
  *derived* from cwd; the assert-primitive / registry path is dissolved (PDR-118 OQ2). Owner-approved
  plan with a Pitfalls section:
  [`agent-spawn-flow-tool.plan.md`](../../plans/agent-tooling/current/agent-spawn-flow-tool.plan.md). The
  substrate ([`future/knowledge-distribution-substrate.plan.md`](../../plans/agent-tooling/future/knowledge-distribution-substrate.plan.md))
  is recorded-future, not a prerequisite. Next agent: read it + the `feedback_*` memories it names,
  confirm the cwd fact once, build friction-sliced.
- **Strategy / plan-estate rewrite — LIVE primary lane.**
  [ADR-200](../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)
  (intent as a living idea-graph — Accepted) + ADR-201 (Proposed, external-evidence) + the plans
  committed; progression GO. **Next (owner top priority): WS2** — author the idea-node JSON Schema +
  decide id-minting; **WS4 thin-slice-proof is a HARD GATE** before the full harvest (WS6). V0 = the form
  new plans take. Read ADR-200 + the thread record first. The missing **content-structure graph**'s
  decision inventory is [`knowledge-as-graph-two-altitudes-2026-06-23.md`](../../reports/knowledge-as-graph-two-altitudes-2026-06-23.md);
  its design is owned by the incoming engineer's brief + the owner, gated on the single-team
  decision (§Open Owner-Decision Items #7).
- **Sonar AI-profile → zero — LIVE.** Driving `main`'s deliberately-adopted Sonar AI quality-profile
  backlog to zero (fix or genuine-FP only, no suppression). S8707 Phase 1 merged (#242, `3895b3f45`);
  **Phase 2 regex/ReDoS next**, then test-integrity, design-MAJOR, idiom-MINOR. Thread:
  `main-sonar-ai-profile-to-zero`.
- **Large-corpus analysis — the full discovery run EXECUTED (2026-07-02, Perseus wakes Oblivion);
  salvage ws1 is the live pickup.** Map + reduce ran sound (246 genuine candidates); the validate
  stage's Sonnet no-tools regime **failed calibration** — it killed 11/18 known-real baselines the
  run had correctly found (regime change = design change, PDR-122 invariant 6). The 202 Opus +
  31 Sonnet free-tool verdicts are **banked and committed**
  (`data/discovery-run-banked-freetool-verdicts-2026-07-02.json`), so
  **salvage ws1 runs without any re-spend**: recompute quorums from the banked checkpoint, rank
  the remaining kills, produce the discovery report. Live plan:
  [`corpus-analysis-salvage-and-topology-redesign.plan.md`](../../plans/agentic-engineering-enhancements/current/corpus-analysis-salvage-and-topology-redesign.plan.md)
  (+ burn-analysis-2026-07-02 for the economics). The run's doctrine lessons are graduated:
  [PDR-122](../../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md) invariants
  5–6 + economics (2026-07-02 amendment), the `agentic-judgment-conserve-by-default` rule, and the
  `sandbox-constraint-is-a-build-instruction` / `adversarial-pre-spend-verification` patterns.
  Conservation of the v2 discoveries is DONE (the conservation plan's WS-A/WS-B landed 2026-07-02);
  WS-C tooling promotion awaits the agent-tools-architecture WS0. Full pickup: the AEE thread
  record §RUN COMPLETE.
- **CI / security follow-ons (LIVE forward-asks).** From the CI-hardening landings (#236 dep-review
  gate, #239 CI parallelisation): report the #229 Tier-2/3 security-roadmap items; reconcile the
  widget/a11y pre-push ≠ CI parity gap (ADR-121 matrix, from #230); and the Codex #239 follow-ups to
  investigate against the merged code — (P2) `ci.yml` main-run concurrency may drop an intermediate
  main CI run + its Release `workflow_run` (consider a per-SHA group for non-PR runs); (P3) align the
  ADR-121 Playwright cache-key changelog row with the impl. **DATA-SOURCES governance** (owner-gated)
  gates the under-the-hood/explain user-exposure surface.
- **OWNER ROADMAP (2026-06-12, sequenced "not all at once") — the forward agenda:** (1) comms-research
  follow-ons; (2) naming v3 (DECISION-COMPLETE plan; Phase-1 era-pinning cure first — §Next Safe Steps);
  (3) Sentry production-issue protocols/skills; (4) the Sentry logging improvements those surface;
  (5) refine the PostHog plan; (6) integrate the oak-api repo into this ecosystem; (7) EEF
  data-surfacing follow-ons; (8) high-impact graphs latent in the bulk data; (9) apply the graph-tool
  capabilities to the `oak-curriculum-ontology` sibling repo; (10) the user-facing hybrid-search
  experience (gates the 08-experience-surfaces cluster + the `mcp-app-extension-migration` WS3 rebuild);
  (11) keep the plan-discovery surfaces current and retire `plans/notes/`; (12) the path-sweep
  code-class follow-on (TDD cycles, never a sweep sed). **Open action:**
  `docs/graph-team-direction-2026-06-10` carries two unmerged commits (`ae5372e2c`, `c9ff6bb49`);
  merging it is an open owner/Director action (reconcile the napkin/eef-record content on merge).
- **DECISION-COMPLETE plans awaiting execution routing.** Output-schemas for MCP tools (every
  `outputSchema` = `composeEnvelopeSchema(payloadSchema)`; next = execution routing); the MCP test
  estate + observability-sinks plans (§Next Safe Steps); MCP product-analytics (owner-gated on
  legal/privacy). OAK-PROD MCP snagging — next: S0 non-Cursor probe, then S1 to owner.
- **no-throw remediation — RESHAPED, READY (survey-first), PAUSED for the strategy thread.** Controlling
  plan [`no-throw-remediation.plan.md`](../../plans/architecture-and-infrastructure/current/no-throw-remediation.plan.md);
  the ~1000-warning count is an indiscriminate-rule artefact (~6 cause-classes). Investigation-first
  WS0→WS4; 4 conversions landed. Resume from WS0 after the strategy work.
- **Practice↔IDE integration plane** — feasibility report landed; **owner decisions pending** (§Open
  Owner-Decision Items); a HARD deep-docs-read prerequisite before any build.
- **Onboarding-improvement arc** — PR #199 merged; follow-ons open (B2/B3 risk-register seeding; the
  ask-the-repo search decision — B1 awaits owner cost bands, B6 at the M2 gate).
- **Evals pickup — QUEUED, owner-directed**
  ([`skill-evals-pilot-start-right-quick.plan.md`](../../plans/agentic-engineering-enhancements/current/skill-evals-pilot-start-right-quick.plan.md));
  the assurance regime is homed in `principles.md` §Agentic Quality + `validation-strategy.md`.
- **AX first-class** — PDR-111 + the `agent-experience-review-lens` rule landed; the live home is
  [`agent-experience-improvement.plan.md`](../../plans/agent-tooling/current/agent-experience-improvement.plan.md)
  (next: WS-1 CLI-ergonomics conformance guard — §Next Safe Steps; WS-4 is the structural drain-fix).
- **Fitness-system doctrine (agentic lane)** — the Closure & Role-Routing findings record + backbone
  plan landed (`547d889c9`); next is the plan's WS0 (PDR-106 + ADR-144 amendment) and the §11
  comparison. Detail in the `agentic-engineering-enhancements` thread record.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal sources, not long-term
  documentation. Outside owner-directed research windows, process useful substance into
  memory/docs/plans and clear stale state. **Standing residual:** the coordination-tier curator-pass —
  ~1,707 comms events past the 7d window await body-read disposition before the next archive-move RUN,
  fired by retention elapse via `consolidate-docs` step 3a / `oak-curator-pass`.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `upstream-api-alignment` | Realign SDK/MCP (and bulk export) to the evolving upstream Oak API + a repeatable observable process. Programmes-family instance shipped on PR #291 (`merge=CLEAN`, awaiting owner merge); process graduated to a permanent runbook | [record](threads/upstream-api-alignment.next-session.md) | claude / claude-opus-4-8[1m] / Vanilla stirs Spore / implementer — successor to Bonfire turns Basalt; WS2+WS4+WS6 landed, review triage cleared / 2026-07-01 |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Zephyrous Buffeting Falcon / skills-lane-relocated-to-educator-end-users / 2026-06-08 (prior identities: thread record) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | claude-code / claude-fable-5 / Rosemary stirs Bracken / dedicated consolidation — buffers drained, v2 discoveries graduated, PDR-122 amended / 2026-07-02 ← claude-code / claude-fable-5 / Perseus wakes Oblivion / discovery run EXECUTED, validate regime failed calibration, verdicts banked, salvage plan authored / 2026-07-02 (full identity history: thread record) |
| `eslint-no-throw-result-migration` | Migrate every throw to Result (ADR-088); drive the ~1000 warnings to zero; promote the rule. In execution on `docs/planning-and-validation`; cheap WS2 done, residue is design-laden (tier map in record) | [record](threads/eslint-no-throw-result-migration.next-session.md) | claude / Opus 4.8 (1M) / Siren mends Rudder / execution — observability+graph-core+logger landed (`93beffcfe`,`304b68f8d`,`61bdbc3e4`) / 2026-06-19 (prior: Merlin spins Cirrus `1556b9191`; Vanilla weaves Undergrowth, plan-author) |
| `statusline-enhancements` | Claude Code statusline: Oak-mark + session-shape indicators (complete); **primary/worktree location rows + rate-limit gauges with reset countdowns DELIVERED 2026-06-29** (`708cd57fc`); logo lane PAUSED (owner). Future lanes: COLUMNS/LINES responsive layout, research-doc refresh, trace-log observability (deprioritized — root cause upstream). Branch divergence RESOLVED (stale local branches deleted; all on main). Detail: thread record | [record][statusline] | claude-code / Opus 4.8 (1M) / Wyvern mends Draught / delivered location-rows + rate-limit gauges & countdowns / 2026-06-29 (earlier identities: thread record) |
| `agent-naming` | PDR-027 display-name derivation: versioned schema registry, session-hook identity surfaces, wordlist eras (v2 landed; v3 + era-pinning cure queued; v3 plan now cross-linked to the knowledge-distribution-substrate direction) | [record][agent-naming] | claude / Opus 4.8 (1M) / Tuna stirs Fathom / v3-plan deep-dive + substrate-connection cross-link (no source touched) / 2026-06-30 ← claude / Opus 4.8 / Squall hunts Troposphere / thread-open + v3-plan-author / 2026-06-13 (prior identities: thread record) |
| `agent-operability` | Agents operable in their own worktrees: launch-in-worktree as the derived `(identity→worktree→branch)` binding, worktree lifecycle (create/build/draft-PR/cleanup), seat-in-the-brief. Member of the agent-team-operations cluster. **Controlling plan ready to build (owner-approved 2026-06-28); thread record stood up + branch/ground reconciled to post-merge reality (enablers committed on `docs/consolidations`) 2026-07-01.** Ground on `docs/consolidations`; next: cwd-confirmation smoke-test → Phase 1A. | [record][agent-operability] | claude / Opus 4.8 (1M) / Tuna stirs Fathom / thread-record orphan-fix + branch reconcile (no build) / 2026-07-01 |
| `strategy-and-plan-estate-holistic-review` | **REFRAMED 2026-06-22 ([ADR-200](../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)): planning-estate REWRITE on a living idea-graph.** Ideas are the fundamental node; the graph is the machine-readable SSOT (JSON + JSON Schema on `graph-core`); documents are the co-equal human-navigable embodiment via frontmatter edges. The prior survey/Pass framing is SUPERSEDED. ADR-200 + ADR-201 (Proposed) + plans COMMITTED; progression GO. Next: **WS2** idea-node schema + id-minting; **WS4 thin-slice-proof is a hard gate** before the full harvest (WS6). V0 = the form new plans take. Read ADR-200 + the thread record first. | [record](threads/strategy-and-plan-estate-holistic-review.next-session.md) | claude-code / Opus 4.8 (1M) / Perseus lifts Umbra / two-altitude knowledge-as-graph research + ADR-200 realisation-edge & family-entailment amendments / 2026-06-23 ← Pelican stirs Buoy ← Cinder holds Warmth (ADR-200/201 + plans committed) ← Cosmos calls Infinity (survey orchestrator) / Director seat DISSOLVED / 2026-06-21 (prior seats: full table in thread record) |
| `orientation-skills-family` | Teaching-surface family: a portable agentic-AI primer (lead-in) plus the **one** repo-bound orientation lens (`/oak-under-the-hood`) across the PDR-112 portability seam | [record][orientation] | claude-code / Opus 4.8 (1M) / Clover mends Hedgerow / **reframe `/oak-explain`→`/oak-under-the-hood` + MCP pointer projection MERGED via PR #243 (`a0a85f60c`, 2026-06-27); ADR-202 + ADR-205. `oak-under-the-hood.plan.md` DONE→archive; MCP-surfaced discoverability follow-on owned by `current/mcp-tool-taxonomy-and-orientation.plan.md` (decision-incomplete, WS0 not started)** / 2026-06-28 (prior: Zenith lifts Firmament — unification `ca40d98ce`; Swordfish/Seal — reframe build; Skipper tracks Reef, Orbit rides Horizon, Bora lifts Downdraft) |
| `reasoning-grammar` | Structured-reasoning capability: the portable grammar-of-thinking reference + the thin `oak-reason` skill (outward pair to `oak-metacognition`), wired into the metacognition directive, `oak-plan`, and start-right | [record](threads/reasoning-grammar.next-session.md) | claude / Opus 4.8 (1M) / Orbit rides Horizon / **COMPLETE** — landed `3b9836d89`; push pending (owner) / 2026-06-22 |
| `user-search-not-exposed-until-built` | Gate the unbuilt user-search MCP App tools off `tools/list` behind an opt-in flag (default OFF) until the experience ships | [record](threads/user-search-not-exposed-until-built.next-session.md) | claude-code / Opus 4.8 (1M) / Foehn calls Headwind / **COMPLETE** — Cycle 1 `ac0a98c5b`, Cycle 2 `906cca9b3`, plan fixes `ff26bcf69`; push pending (owner) / 2026-06-23 |
| `main-sonar-ai-profile-to-zero` | Drive `main`'s Sonar AI quality-profile backlog (398 issues, 48 rule classes) to **zero** — fix or genuine-FP only, no suppression. Owner-directed: deliberately-adopted profile. Lanes: `tssecurity:S8707` path-injection, regex-safety (`S8786`/`S5843`/`S6035`), test-integrity (`S2699`/`S5914`). Supersedes the retired `main-critical-sonar-remediation` lane | [record][main-sonar-zero] | claude / claude-opus-4-8[1m] / Alder tracks Topsoil / implementer — S8707 Phase 1 MERGED via PR #242 (`3895b3f45`); Phase 2 regex next / 2026-06-27 (prior: Junk tracks Moorings (#223), Thyme lifts Compost, Aspen tracks Root) |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild — D0–D7 delivered & shipped (v1.16.0); D7 proof dropped as overkill (paused 2026-06-19) | [record][eef] | claude / Fable 5 / Thyme wakes Canopy / record-condensation / 2026-06-12 (prior identities, 30+ seats: thread record) |
| `data-sources-governance` | Author `docs/governance/DATA-SOURCES.md` (suitability / last-reviewed / removal criteria) — **owner-gated**: new governance policy, an owner decision, not agent-resolvable; gates the under-the-hood/explain user-exposure surface | [record](threads/data-sources-governance.next-session.md) | claude / Opus 4.8 / Ferret weaves Nightfall / thread-opener-brief-only / 2026-06-25 |
| `school-data-search` | Oak School Data Search service (POC MVP): deep review complete, build-ready (paused 2026-06-19) | [record][school-data-search] | claude / Opus 4.8 / Fiery Sparking Caldera / deep-review-and-refinement / 2026-06-04 (prior identities: thread record) |
| `semantic-search` | Search data foundations: upstream-schema alignment, bulk sourcing, minimal-adaptation arc (paused 2026-06-19) | [record][semantic-search] | claude / Opus 4.8 / Moonlit Waxing Nebula / upstream-realignment-specialist / 2026-06-03 |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work via a deep review of the Oak Curriculum Ontology repo (opened, not started; paused 2026-06-19) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 |
| `connecting-oak-resources` | Oak resource graph substrate for EEF | [record][connecting] | claude / Opus 4.8 / Galactic Glowing Prism / jc4-plan-authoring (kg collection) / 2026-06-02 (prior: Opalescent Cascading Planet, Stellar Waning Planet, Silvered Lurking Mask, all 2026-06-02) |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / Cycle 1 substrate capture / 2026-05-24 |
| `mcp-product-analytics` | MCP product analytics design and Path-to-GA Programme | [record][mcp-analytics] | Stellar Glowing Satellite / claude / claude-opus-4-7 / Programme landed + amendments / 2026-05-26 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 2026-05-10 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | claude-code / Fable 5 / Forge turns Basalt / dfe-data-sdk-seed-authoring / 2026-06-12 (prior: Squally / cursor / 2026-04-30) |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |

## Next Safe Steps

### agent-tools architecture — plan authored; commit + standard deferred (2026-06-29)

`check-encoding` (the new permanent UTF-8/encoding scanner) is **verified-green on its own files**
(`pnpm encoding:check` 0 critical; type-check / lint / 1748 tests / knip / depcruise / prettier clean,
after removing 2 knip-flagged dead exports) and consistent with the `skills:check` precedent
(`pnpm encoding:check`, wired into `pnpm check` + pre-push; canonical `@oaknational/result`).
The deferred architectural excellence is now a strategic brief —
[`agent-tools-architecture-standard.plan.md`](../../plans/agent-tooling/future/agent-tools-architecture-standard.plan.md)
(WS0 the execution-model fork → ADR + enforcement + encoding-engine→`packages/core` + the
where-supported Write/Edit hook + convergence) — with the analysis at
[`reports/agent-tools-encoding-guard-and-architecture-2026-06-29.md`](../../reports/agent-tools-encoding-guard-and-architecture-2026-06-29.md)
and Callisto's handoff at
[`reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md`](../../reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md).
Owner direction 2026-06-29: **working now, excellence later** — the standard is a dedicated future
session (promotion runs the plan's WS0 decision pass first). **HELD (owner-gated):** the encoding
commit + a full `pnpm check` green are blocked by unrelated live WIP — untracked
`agent-tools/src/corpus-analysis/` (a different lane) currently fails whole-tree knip + lint, and
`.husky/pre-commit` runs those whole-tree, so no commit lands until that WIP is green or removed.

### Comms-Corpus Research — RETIRED 2026-06-14

Thread concluded (WS0–WS7, PR #208 merged `a6b14a8a3`); findings homed in **PDR-094** + **ADR-199** + the
`reports/agentic-engineering/` synthesis + keystone M4. Retired record:
[`threads/retired/agent-collaboration-research.next-session.md`](threads/retired/agent-collaboration-research.next-session.md).
**Standing residual** (not a reopened lane): the coordination-tier curator-pass — ~1,707 comms events past
the 7d window await body-read disposition; work-list + recipe in the retired record's §"WS7 Closeout".

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

### Agent Experience (AX) Improvement — WS-3 F-41 LANDED; next highest-impact item

Umbrella plan
[`agent-experience-improvement.plan.md`](../../plans/agent-tooling/current/agent-experience-improvement.plan.md)
(`current/`), evidence
[report](../../reports/agent-experience-cause-class-analysis-2026-06-21.md), doctrine PDR-111.
**WS-3 (F-41 path-safety) is DONE** (`b5408291d`+`c90150ffa`+`4fd640089`): `resolveCoordinationHome`
resolves the **primary checkout** via `git worktree list`, so any worktree seat shares one coordination
home. **Next safe step (owner-chosen 2026-06-22): WS-1 — the CLI-ergonomics conformance guard.** Execute
[`agent-tools-cli-ergonomics.plan.md`](../../plans/agent-tooling/current/agent-tools-cli-ergonomics.plan.md)
from **Phase 0** (the convention-audit + scope-ratification gate) → WS6 (the PDR-055 cl.10 conformance
guard); retires the largest cause-class (~19 frictions, Class A). Subsequent AX items: **WS-4** (the
`frictions-register` drain validator that recomputes integrity against fs/git → **WS-6** disposition
ledger — the systemic spine); **WS-2** (watcher liveness + canonicalisation); **WS-3 B2** (the deferred
F-41 CLI tail).

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

### Agentic-Engineering Curation

0. **LIVE: corpus-analysis salvage ws1** (the discovery run executed 2026-07-02; the validate
   regime failed calibration; verdicts are banked, so salvage runs with zero re-spend) — see the
   §Current State large-corpus entry; full pickup: [`agentic` thread record][agentic] §RUN COMPLETE.
1. The latest dedicated consolidation is 2026-07-02 (Rosemary stirs Bracken): napkin rotated, the
   distilled buffer + the v2 13-pattern work-list fully graduated (conservation plan WS-A/WS-B),
   PDR-122 amended, PDR-123 (design panels) authored, the conserve-by-default rule landed;
   `distilled` + `pending-graduations` + `open-questions` all empty (the long-lived questions
   re-homed into their owning artefacts; recorded keep-open grants voided by the owner —
   grants are live-per-pass, never carried).
2. The relative-link integrity item is accepted as a future validator lane, not
   implemented tooling; promote the plan only on its recorded trigger.
2a. `agent-collaboration.md` is hard-over on lines (377/360) after the injected-asymmetry doctrine
   landed (justified substance; the file was already at 359). The named remediation is its own
   `split_strategy`: create `agent-collaboration-channels.md` and extract the per-channel protocol
   detail — a focused future extraction, not a trim.
3. Comms-event rotation is the retention-gated curator-pass (ADR-199 / PDR-094): archive-move events past
   their class window, gated on absorption + provenance. Analysis is never gated; fitness is routing
   evidence only — never archive, split, shard, or rename unprocessed content to improve scores.

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
3. MCP launch-readiness: ratify the impact-first Stage 1–4 ladder (assessment report §8) →
   promote the launch-readiness-and-milestone-redefinition stub. K1–K3 keystones are ratified
   and absorbed by the strategy corpus.
4. External-facing capability corpus: decide source-of-truth topology and first-tranche scope
   — these gate Direction A `t0` / plugin-package `w0`
   ([`external-facing-capability-distribution.plan.md`](../../plans/user-experience/educator-end-users/current/external-facing-capability-distribution.plan.md)).
5. Native-MCP-auth build-vs-buy: adopt / adopt-partial decision on the
   [spike](../../plans/security-and-privacy/future/native-mcp-sdk-auth-build-vs-buy.md).
6. Upstream/SDK forks: endpoint-style cross-refs in MCP tool descriptions; Q-010 (repair vs
   retire the orphaned `oak-curriculum-sdk` typedoc estate).
7. Curriculum graph estate — single-team proposal: whether to bring the Open Curriculum Ecosystem,
   the Open Curriculum API, the Curriculum Ontology, and Atomic Concepts under one team for ~6 months.
   See [`curriculum-graph-estate-synthesis-2026-06-22.md`](../../reports/curriculum-graph-estate-synthesis-2026-06-22.md);
   an SLT brief is held local (reference-local, not version-controlled).

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
- No machine-local paths anywhere in the repo, ever (PII) — enforced by the
  `validate-no-machine-local-paths` repo-validator + the `machine-local-path`
  write-hook (`.agent/rules/no-machine-local-paths.md`).

[main-sonar-zero]: threads/main-sonar-ai-profile-to-zero.next-session.md
[mcp-analytics]: threads/paused/mcp-product-analytics.next-session.md
[observability]: threads/paused/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/paused/connecting-oak-resources.next-session.md
[oer]: threads/paused/exploring-open-education-resources.next-session.md
[budget]: threads/paused/architectural-budget-system.next-session.md
[cloudflare]: threads/paused/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/paused/sector-engagement.next-session.md
[eef]: threads/paused/eef.next-session.md
[oak-kg-ontology]: threads/paused/oak-kg-ontology-planning-review.next-session.md
[school-data-search]: threads/paused/school-data-search.next-session.md
[semantic-search]: threads/paused/semantic-search.next-session.md
[agentic-mechanisms-discovery]: threads/agentic-mechanisms-discovery.next-session.md
[branch-fitness]: threads/paused/branch-fitness-and-push-cadence.next-session.md
[statusline]: threads/statusline-enhancements.next-session.md
[agent-naming]: threads/agent-naming.next-session.md
[agent-operability]: threads/agent-operability.next-session.md
[orientation]: threads/orientation-skills-family.next-session.md
