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
  + [cSpell gate](../../plans/agent-tooling/future/cspell-quality-gate.plan.md). **Next:** refresh the
  PR for `docs/planning-and-validation`.
- **STRATEGY & PLAN-ESTATE HOLISTIC SURVEY — durable report LANDED (2026-06-15,
  Baobab lifts Topsoil `3be248`).** Multi-wave whole-estate survey (413
  docs; 143+124 agents) + 6-agent adversarial verification → a vision→value→action
  holistic reading. Report + all raw/refined data:
  [`reports/archive/plan-estate-survey-2026-06-15/`](../../reports/archive/plan-estate-survey-2026-06-15/README.md)
  (archived 2026-06-18).
  **Owner corrections (report §14)**: (1) ~40% inward (substrate+Practice) is
  deliberate — the Practice is a value stream in its own right; (2) impact is
  articulated here + measured by Oak, not instrumented in-repo; (3) **SUPERSEDED
  2026-06-18** — the "align-on-impact → gap → execution-spine" (2A/2B/2C) ordering is
  **dissolved**; the strategy is now one cohesive body on the four-layer informational
  model (see the strategy bullet above). **Next safe step**: author the strategy corpus
  (Body 2) at `docs/strategy/`; see
  [thread record](threads/strategy-and-plan-estate-holistic-review.next-session.md).
- **MCP LIVE-PRODUCT READINESS — framework + assessment report + future stub LANDED
  (2026-06-15, Quoll weaves Dreamscape `dec917`).** Read-only strategic session
  (owner-lifted for doc writes; no code, no commit) on "what would it take to make the MCP app
  a live product." Keystones **owner-RATIFIED 2026-06-17** (the 2026-06-15 "agent INPUT, NOT ratified"
  correction is now resolved) as the **MCP-app stream's** keystones: **K1** "live" =
  full GA with real teachers/curriculum-leaders + *observed* positive impact (an
  evidence state — value-proof is a GA precondition, *articulated here and measured by
  Oak, not instrumented in-repo* per §14.2); **K2** primary audience = teachers +
  curriculum leaders ("for now" = post-GA non-commitment); **K3** scope = MCP app in
  ChatGPT/Claude ⇒ the app's **real dependency set** must be GA-ready (whole-estate
  only at portfolio level). K1–K3 are the **app stream's production-readiness keystones**, not
  the strategic centre (reframed 2026-06-18); the other two streams are **co-equal, not deferred
  or lesser** — each reaches its own readiness on its own terms. The
  [2a-decisions brief](../../plans/archive/vision-strategy-and-plan-estate.2a-decisions.md) is an archived, superseded
  input (decisions preserved in the controlling plan; framing corrected).
  Created the
  [launch-readiness framework](../../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md),
  the self-contained
  [assessment report](../../reports/mcp-app-live-product-readiness-assessment-2026-06-15.md)
  (first-hand verification, right/wrong/missing, full milestone re-assessment), and a
  [future stub](../../plans/curriculum-mcp-path-to-ga/future/launch-readiness-and-milestone-redefinition.plan.md)
  (promotion trigger: owner direction to schedule the redraft). **Fresh-eyes verdict: the prior
  M0→M3→GA milestone ladder does NOT stand** — auth-posture-shaped, no value-proof/safeguarding
  gate, not whole-estate; replace with the impact-first Stage 1–4 ladder (report §8). Wired into
  discovery surfaces (plans/README, high-level-plan, roadmap.md, milestones/README flagged
  provisional, reports/README). No active thread owns
  this lane (repo-level + path-to-ga collection); no claim opened; deep consolidation not due.
  **Next safe step**: owner ratifies the impact-first ladder → promote the stub to redraft the
  milestone files + Programme matrix.
- **MCP UAT VALIDATION RUNBOOK — landed (2026-06-15, Sirius binds Spectrum / `0557ef`).**
  Branch `docs/planning-and-validation`, commit `95ec2708a`: elevated
  [UAT validation runbook](../../apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md)
  (whole-server, inventory self-check, response-shape contract, quick smoke pass),
  [`uat-reports/`](../../apps/oak-curriculum-mcp-streamable-http/docs/uat-reports/README.md)
  with first prod record (`2026-06-15-prod.md`, GO), operations + release-runbook links.
  Live oak-prod validation confirmed EEF dual-shape fix is live in production. **Next safe
  step**: open a PR for `docs/planning-and-validation` (if not already raised); optional
  follow-up local curl pass for Sections 1, 9, 11.
- **UPSTREAM-SPEC ALIGNMENT — PR #200 (2026-06-12, Tempest spins Stratosphere `123098`).**
  Branch `fix/align_with_upstream_api_spec` (worktree seat) aligns the repo with the
  upstream OpenAPI description rewrite (oak-openapi PR 269, `0.7.0-69d2b6c9…`): docs-only
  drift verified structurally; schema cache + 30 generated files refreshed; the
  `/keywords:get` correction mechanism retired in full (its removal-condition test fired as
  designed; `param-description-overrides` remains the live exemplar); turbo `sdk-codegen`
  outputs now cover the full write-set (`**/schema-cache/**`); the upstream-spec-change
  runbook landed in the
  [sdk-codegen README](../../../packages/sdks/oak-sdk-codegen/README.md#responding-to-upstream-spec-changes)
  with caching doctrine in
  [build-system.md](../../../docs/engineering/build-system.md#caching). Peers Fern lifts
  Mulch + Monsoon guards Cirrus rebase onto main once merged. **Open owner forks** (PR
  body): endpoint-style cross-refs in MCP tool descriptions (faithful adoption now;
  generator tool-name rewrite is a separable decision) and Q-010 (repair vs retire the
  orphaned `oak-curriculum-sdk` typedoc api-md estate). Register evidence appended:
  collaboration-CLI relative-path hardening now carries the worktree-lockout shape
  (commit-queue write commands cannot address the shared registry from a worktree seat).
  Deep consolidation status: completed this handoff — session-completion mode; the
  session's learning homed via commit `3c8ac0bcb` (runbook, caching doctrine, registers).
- **ONBOARDING-IMPROVEMENT ARC — PR #199 OPEN, merge-once-green owner-directed (2026-06-12,
  Vanilla lifts Chlorophyll `8dca0d`).** The arc landed on `feat/onboarding-improvement`:
  `/oak-onboard-me` walker (conversation-first after live owner falsification; untracked
  schema-versioned personal state in `.agent/state/onboarding/`), entry-path drift fixes,
  reviewer-template verification discipline (onboarding/docs-adr/subagent-architect),
  consolidation freshness duties, VISION/README value framing (implied, never stated —
  pillars memory), Track-B dispositions (B4/B5 closed; B1 awaits owner cost bands; B2/B3
  risk-register draft queued; B6 at the M2 gate), and the conserved 2026-06-12 curation
  pass. **Next safe steps**: owner re-walks `/oak-onboard-me` off-branch; B2/B3 register
  seeding; the ask-the-repo search decision (research attached to PR-session transcript).
  **TWO-MEMBER TEAM UPDATE (2026-06-12, Fern lifts Mulch `66f12b`)**: (a) the comms-corpus
  lane ran as a PLANNING session (owner-reshaped in-session): the
  [research plan](../../plans/agent-tooling/active/comms-corpus-research-and-rotation-strategy.plan.md)
  is now DECISION-COMPLETE + EXECUTION-READY with the owner-amended end-state (WS6
  comprehensive synthesis report; WS7 (gated on WS5 proposal owner-ratification) executes the ratified rotation: contract
  surfaces relocated, `experiments/` preserved — never purged, owner direction — `.agent/state/`
  untracked-by-design, 7-day default retention purge post-absorption); immediate
  `experiments/` preservation landed (gitignore flip + five machine-local records committed);
  the WS1 blind pass was attested uncontaminated by the planning seat. **MERGED to main as
  PR 201 (`5a2ac400b`, 2026-06-12); planning session closed (handoff + consolidation run
  no-commit at owner direction — expect those surface edits uncommitted in the tree).**
  **Successor LIVE: Katydid hunts Roost `a4314f` (claim `8910ee5f`, research lane, corpus
  read-only).** Their team-start (comms `37523113`, failure-mode tagged) discloses WS1
  blind-pass CONTAMINATION: start-right's read-the-thread-record step led them through both
  Candidate Themes sections before the opener's fence could fire — a structural ordering
  collision (the fence lives inside the fenced artefact). **Owner decision pending in their
  session: WS1 shape** — fresh-context delegate cold readers (Katydid's recommendation,
  endorsed by the planning seat in comms `99771de2`) vs re-dispatch WS1 to a fresh session.
  WS2–WS5 are not blindness-dependent and proceed either way. The entry-point fence-banner
  cure on the thread record is routed to Katydid (the record is inside their claim).
  Deep consolidation status: completed this handoff — session-completion mode (the dedicated
  pass ran earlier today, Thyme wakes Canopy; this pass captured and routed the session's
  learning, verified buffers, `pnpm check` green on `5a2ac400b` + closeout edits).
  (b) the statusline lane is UNIFIED and the narrow lane is COMPLETE on `feat/comms-research`
  (Oak-mark logo column + session-shape indicators landed; controlling plan archived). An
  interim session-relative + `observing` resolver and the ansi/indicators/render module split
  landed 2026-06-14 (commit `da8cbd7d6`, Orbit stirs Spectrum). The successor is the
  [session/team-state + statusline-icons plan](../../plans/agent-tooling/current/session-and-team-state-statusline-icons.plan.md)
  (DRAFT, re-grounded session-state-first 2026-06-15: session owns collaboration state, solo is the
  floor, team state is derived; experimental discovery — no PDR/ADR yet; the 2026-06-14 readiness
  verdict predates the re-grounding).
  **Next safe step**: the register plan is unassigned (Clipper rotated out) — a next session
  resolves its readiness Conditions B/C-D, or the branch rides its push/merge. The
  [thread record](threads/statusline-enhancements.next-session.md) is the canonical home and
  now cross-links the Oak-logo + terminal-animation research as lanes of the same thread.
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

- **TRACK-G + the graph implementation team arc — COMPLETE AND AT REST (2026-06-11).** All
  Track-G deliverables merged and owner-signed-off (arc PRs #142–#186 inclusive: readiness
  seam analysis, S1–S3, G1–G4b, U1, the re-proof, multiplicity dedup, `continue-progression`
  prompt, host-DOS safety rule, team-opener generalisation plan, Thermal's consolidation);
  the seventh directorship closed cleanly with no successor (team dissolved). Authority for
  the full arc: the
  [graph plan](../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md)
  todos, the [`eef` record][eef], the
  [seam analysis](../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md), and the
  [session operations + experience report](../../reports/graph-team-session-operations-and-experience-2026-06-10-11.md).
  **Live remainder**: the Director-queue agent-tools lanes (control-byte gate-check, CLI
  relative-path hardening — now carrying the worktree-lockout shape, comms-reply prefix
  resolution, watcher-non-exit fix, comms-store scalability — register-recorded; PLUS the
  `commit-queue -- commit` spawn/capture defect, five instances two agents 2026-06-12,
  signature + Path-B recovery in the napkin); the generalisation plan's x5 owner walk; w3-c1 + S3
  principles + next product tranche at owner direction. Open owner items: principles-prompt
  attribution validation (gates the S3 principles follow-on); bulk-export-lags-live (hold
  as-is, owner 06-11); output-schemas execution routing (gate satisfied — entry below). The
  approved-unauthored Core amendment queue was AUTHORED 2026-06-12 (Thyme wakes Canopy
  dedicated consolidation; Core CHANGELOG carries the pass).
- **OUTPUT-SCHEMAS PLAN — 🟢 DECISION-COMPLETE (owner-ratified 2026-06-09).**
  [`output-schemas-for-mcp-tools.plan.md`](../../plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md):
  every MCP tool's `outputSchema` = `composeEnvelopeSchema(payloadSchema)`, payload Zod
  derived at the one source of truth per provenance; `composeEnvelopeSchema` lives in
  `oak-sdk-codegen`; the EEF tie is type-level, never `satisfies`-on-value. Its named
  execution gate — the graph-tools mechanism settle — has since SETTLED and executed
  (TRACK-G); execution routing is now an open Director/owner call. Cross-cutting: auto-memory
  `project_specialist_agent_design_overhaul` — verify every load-bearing specialist claim
  first-hand until the overhaul lands.
- **EXTERNAL-FACING CAPABILITY CORPUS — merged (PR #140 → v1.16.1).** The
  [`external-facing-capability-distribution.plan.md`](../../plans/user-experience/educator-end-users/current/external-facing-capability-distribution.plan.md)
  corpus map is live (Direction A; plugin-package-creation; app-submission-standards;
  `future/` bundle brief; cross-repo Direction B). **Open owner decisions:** source-of-truth
  topology (#4) and first-tranche capability scope (#5). **Next safe step:** execute Direction
  A `t0` / plugin-package `w0` design gates once the owner resolves #4/#5.
- **EEF build arc (D0–D7) DELIVERED + SHIPPED (v1.16.0, 2026-06-08).** `get-eef-evidence` is
  live by default at `curriculum-mcp-alpha.oaknational.dev` (kill-switch flag, default ON;
  ADR-193 boundary holds). Potential teacher value proven by release-and-observe (owner
  2026-06-08); delivered-value stays with
  [`eef-outcome-evaluation-infrastructure.plan.md`](../../plans/sector-engagement/eef/future/eef-outcome-evaluation-infrastructure.plan.md).
  Full arc: the [`eef` record][eef].
- **OAK-PROD MCP SNAGGING (2026-06-11 evening, Dawnlit Glimmering Orbit `50c2d1`) — write-up
  landed, fixes deferred by owner direction (next agent will not be a Cursor instance).**
  The live oak-prod MCP was exercised end-to-end (graph tools doctrine-clean, no soft stubs);
  the one material finding — the ratified `content: []` + structuredContent-only
  `get-eef-evidence` success is fully invisible to the Cursor agent harness — is pinned with
  proof, replay recipe, and Cursor-specifics in
  [`oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md`](../../reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md);
  the tracker is the
  [snag register](../../plans/sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md)
  (S0 non-Cursor client probe → S1 owner decision; S2–S5 queued). First-wave evidence
  (verification record) is on branch `docs/graph-team-direction-2026-06-10` (`ae5372e2c`).
  **Next safe step**: run S0 per the write-up §6 replay recipe, then put S1 to the owner.
  Deep consolidation status: not due — session captures routed to permanent homes (write-up,
  snag register, thread record); a dedicated consolidation ran earlier today (Thermal).
- **AGENT NAMING — v2 landed; v3 lane now a decision-complete plan (2026-06-13, Squall hunts
  Troposphere `6bbbd2`).** v2 merged (PR #189, `289b3e036`): versioned naming-schema registry,
  v1 era frozen, NVN v2 active, ADR-198, `naming_schema_version` provenance; v2 plan archived
  (PR #194, `9a74eefd1`). The throughline now has a durable home: thread
  [`agent-naming`][agent-naming] + plan
  [`agent-naming-schema-v3.plan.md`](../../plans/agent-tooling/current/agent-naming-schema-v3.plan.md)
  (DECISION-COMPLETE / QUEUED), one plan, three phases. **Next safe step**: execute **Phase 1
  (WS1, era-pinning cure)** — hooks pin `OAK_AGENT_NAMING_SCHEMA_ID` (the era), not the rendered
  name; cures the one-seed-two-names P1 (diagnosis accepted 2026-06-12, comms 75696ec5) and the
  `"override"` provenance mis-record. Phase 1 ships independently and is the owner-ordered
  prerequisite for v3 activation (shape C decided 2026-06-12). Own claim +
  owner-informed-pre-execution per Director conditions (comms 10cb3a10 ruling 3). The merged
  handoff `2a080642-naming-lane-handoff.md` is historical context only — its §4 merge-blockers
  are all resolved.
- **DFE DATA SDK SEED + EEF GAP-RESEARCH — landed and merged (2026-06-12, Forge turns
  Basalt `c4b882`; artefacts merged via PRs #196/#197 at the Director's hand).** Three
  artefacts: the EEF surfacing-gap research report (roadmap item 7 above), the
  [DfE data SDK strategic seed](../../plans/sector-engagement/future/dfe-data-sdk.plan.md),
  and the owner-commissioned
  [Oak×EEF executive briefing](../../plans/sector-engagement/eef/reference/oak-eef-executive-briefing-2026-06-12.md).
  Seed posture: thin transport-agnostic SDK over the DfE Explore Education Statistics
  public API (Beta, anonymous, OpenAPI-documented, OGL v3.0); COMPLEMENTARY to the EEF
  corpus, never a replacement (owner posture 2026-06-12); workspace language
  TypeScript-or-Python is a named promotion-time decision. Promotion gate: a named Oak
  consumer with a ratified value statement. **Next safe step**: owner roadmap item 7
  (organise the EEF research follow-ons — report §8 carries the ten unowned items); the
  seed waits on its promotion gate. Deep consolidation status: DISCHARGED 2026-06-12 — the
  napkin-fitness flag this entry carried was consumed by the dedicated consolidation
  session (Thyme wakes Canopy): napkin rotated with dispositions, distilled graduated,
  registers drained, the approved Core queue authored.
- **CLAUDE STATUSLINE REDESIGN — RESOLVED and merged (2026-06-12; built by Starling wakes
  Wind `b34fdb`, adopted + merged via PR #198 by Director Firefly seeks Temper, 1,020
  agent-tools tests green).** Live thresholds: ctx% green &lt;50 / yellow 50–69 / red ≥70
  (owner-tuned in #198); the tokens segment was deliberately DROPPED (Claude Code shows the
  count natively — do not re-add without that changing). Follow-on work queued in the
  committed
  [statusline-session-shape-indicators plan](../../plans/agent-tooling/current/statusline-session-shape-indicators.plan.md).
- **CLAUDE CODE TEAM ONBOARDING GUIDE — landed, uncommitted (2026-06-12, Altair rides Gloom
  `0920d8`).** One artefact:
  `2026-06-12-claude-code-team-onboarding.report.md` (developer-experience collection;
  since mined and removed — see the resolution below)
  — a paste-into-Claude-Code onboarding guide for teammates new to Claude Code, generated
  from 30-day usage data via /team-onboarding and owner-redirected from repo-root
  `ONBOARDING.md` into the developer-experience plans collection. Owner-shaped content rule:
  stats are descriptive; Team Tips carry ONLY the two session bookends (a start-right skill
  at open, session-handoff at close), stated as deliberately complete — the owner declined
  to prescribe workflow beyond them. Untracked on `feat/onboarding-improvement` (local-only
  branch, no upstream; HEAD `c6754a262` is the owner's onboarding entry-path drift fixes,
  committed mid-session, not by this seat). **Next safe step**: commit the report with this
  branch's onboarding work (owner-owned; handoff makes no git moves). Deep consolidation
  status: due — carried (napkin fitness; the flag is owned by the owner's planned dedicated
  consolidation session); this session adds one napkin block + this entry only.
  Session-close `pnpm check` NOT run — owner directed "update appropriate surfaces then
  stop" at close (doc-only session diff; the gate obligation passes to whoever commits).
  **RESOLVED same day (Vanilla lifts Chlorophyll `8dca0d`)**: at owner direction the report
  was critically assessed as agent-generated input, mined, and NOT committed — the
  interaction-design prototype and caveated usage evidence folded into the canonical
  onboarding plan (§Interactive Onboarding Inputs), an `oak-skills` row added to
  sibling-repos.md (repo, visibility, and plugin directory verified first-hand via the
  GitHub API), then the source file deleted ("no need to preserve the source document").
  The "commit the report" next-step above is closed. Attribution correction: HEAD
  `c6754a262` (onboarding entry-path drift fixes) was committed by this seat at owner
  direction, not by the owner's hand.
- **Statusline session-shape indicators (2026-06-12, Monsoon guards Cirrus `aaa0b7`)**: all
  five plan workstreams EXECUTED on `feat/statusline-enhancements` (worktree
  `.claude/worktrees/statusline-enhancements`, unpushed; commits `ac2901fe1` role field,
  `1ac430378` resolver, `4270ea49d` render + adapter + glyph evidence). Claims now carry an
  optional open-vocabulary `role`; the statusline renders Director demark / team shape /
  ARC wing from two primary-root reads per tick (never the comms corpus).
  **Next safe step**: successor Flame rides Temper pushes, opens a flat PR, monitors to
  merge; the live director-demark proof and plan archival are post-merge by design (the
  primary's schema gains `role` at merge — its validator correctly refuses earlier). Full
  lane state: the `agentic-engineering-enhancements` thread record §Statusline lane.
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
