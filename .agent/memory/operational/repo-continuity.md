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
`./archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md` (`./archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md`).
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

- **PLAN-CORPUS REFOUNDING r1 — S0 CLOSED; S1 DETERMINISTIC SLICE MERGED; FULL S1 OPEN
  (2026-07-15).** PR #382 (`de3cc54c1`, evidence tip `766f3d5eb`) preserves the compact,
  exact-base regeneration contract for the twice-run freeze/inventory/residue/sweep/P4
  calibration evidence. All 18 checks passed and all three review threads are resolved. This
  is a partial stable point only: the marker-free plant remained invisible while its control
  hit, so the declared-rate reader sample and any narrow fleet/judgement residual remain
  Director-owned before S2 tiling and the divergence report. Schooner guards Whirlpool
  (`82a9df`) retains Director custody; Hedgehog tracks Eventide (`82b36c`) is Fleet
  Captain-in-waiting under owner-directed cold pause. The five ignored bulk outputs remain
  conserved only by local, unpushed commit `42b27e3eb` on
  `feat/plan-corpus-refounding-s1-zodiac`; this is safe from accidental PR inclusion but not a
  remote backup. Next: Director verifies current base/evidence, rules the conservation-copy
  disposition, then resumes the declared reader/fleet residual. Full pickup detail is in the
  [thread record](threads/strategy-and-plan-estate-holistic-review.next-session.md).

- **ARCHITECTURAL FITNESS + MUTATION TESTING — decision-ready concept
  exploration written 2026-07-15; no implementation.** The architectural-
  budget child now records a proposal to replace the unwired, externally
  inventoried `max-files-per-dir` ESLint shape with deterministic report-only
  validator signals whose counts are not limits. Owner ratification and any
  ADR-166 amendment remain pending. The mutation-testing plans now reflect that
  root Stryker scaffolding exists but all 26 inspected workspaces lack a
  `mutate` command; next is an explicit unit/integration dry-run contract, then
  pure-unit, integration-only, and mixed canaries. Reports:
  [architectural fitness](../../reports/architectural-fitness-functions-concept-exploration-2026-07-15.md)
  and
  [mutation testing](../../reports/mutation-testing-incremental-rollout-concept-exploration-2026-07-15.md).
  Both remain documentation-only, uncommitted work in a heavily shared dirty
  tree.

- **MCP agent-facing content — VISIBILITY DELIVERABLE MERGED TO MAIN (PR #337, 2026-07-09, `SHA:5f3c1f472`).**
  A classified registry of all 716 repo-controlled content items that reach an MCP consumer (the effective agent prompt),
  under `.agent/reports/mcp-agent-facing-content-audit/` (registry.json SSOT snapshot, report, rendered-wholes,
  WCAG-AA html, generators). Owner-decided direction (report §7): SSOT content workspace(s) not copies,
  stratified by `impact_tier` (697 high-impact / 19 simple-config) with review+eval protocols for high-impact,
  upstream in-house content (OCA `oak-api` / `oak-skills` / `oak-curriculum-ontology`) HIGHLIGHTED not wrapped,
  design l10n-ready. **Eval/assessment-methodology research PLANNED 2026-07-09** (owner go covered
  planning only): plan landed in the NEW owner-named `effectiveness-and-impact` plan area —
  [`mcp-content-assessment-methodology-research.plan.md`](../../plans/effectiveness-and-impact/current/mcp-content-assessment-methodology-research.plan.md)
  (🟡 PLANNING; readiness reviewers PENDING; M1–M12 families × registry seams; WS0 pre-probes then
  WS-V vertical slice; no pilot). **PR #338 MERGED 2026-07-13 (`SHA:7ef8a8a3a`, Monsoon herds Airstream)** —
  the plan collection, the continuity truing, and the merge-window-stranded `SHA:2af1ce9cb` rescue
  (`SHA:e63f36cda`) are all on `main`; the final Copilot finding (repo-tracked `.mcp.json` claim) was
  verified real and trued at `SHA:9cff508da`. **Remaining: branch-cleanup owner confirm** (per the thread
  record §Landing Target), then everything else is owner-gated. Research EXECUTION and the
  content-workspace build stay owner-gated — **do not auto-start**. Thread:
  [`mcp-agent-facing-content`](threads/mcp-agent-facing-content.next-session.md).
- **PR-lifecycle doctrine arc — COMPLETE (#306, #305, #310, 2026-07-06).** The gitleaks fix (#306,
  `62208200`) and docs closeout (#305, `d14a989a`) merged (Cricket lifts Echo); the doctrine PR (#310,
  `18a2d8c17`, Zodiac herds Spectrum) landed Strand D in full — the foundational "every issue earns a
  check" principle (principles.md §Code Quality + testing-strategy §When a Defect Is Found +
  pr-comments-resolve-and-recheck clause), the pr-lifecycle Phase-7 merge-gate correction
  (merge-button-active-for-a-non-admin; `--admin` forbidden), the dated ADR-168 shell-scope amendment,
  and the new 4-form `source-is-typescript-esm-only` rule. Executed plan:
  [`every-issue-earns-a-check-and-doctrine-tightening.plan.md`](../../plans/agentic-engineering-enhancements/future/every-issue-earns-a-check-and-doctrine-tightening.plan.md)
  (Strand D complete; the archive-move is deferred lifecycle hygiene). **Residuals:** (1) RESOLVED
  as stale — `run-quality-gates` (+ CodeQL + SonarCloud) is ALREADY a required check
  (first-hand `gh api …/rules/branches/main`, 2026-07-06; the "owner action pending" line was a
  twice-relayed dated claim); (2) the Bugbot merge-ready-definition fix landed via follow-up
  PR #312 (MERGED).
- **Inter-Practice window PR #336 — MERGED (`SHA:f74a935a5`, 2026-07-13 12:37Z); post-merge wave
  PR #347 also MERGED (`SHA:a7ca8f8aa`, 2026-07-13 14:39Z, 57 threads dispositioned; Monsoon
  herds Airstream → Aspen stirs Blossom succession); the tail PR #352 also MERGED
  (`SHA:088db6555`, 2026-07-13 15:50Z — 8 tail findings + 8 refinement rounds, 17 threads, 2
  refuted; its own +10-minute tail was CLEAN, closing the arc at 82 threads total).** The cross-estate window's doctrine
  (PDR-125 clause batch, PDR-063 §Retirement
  authority + §Deliberate succession, PDR-064 intersection, the join-ceremony skill + cross-repo
  rule + start-right-team mirrors, ADR-182/211 phenotype notes) survived 28 bot review rounds
  (110 threads, all byte-verified dispositions) plus an owner-commissioned 155-agent Haiku/Sonnet
  diff fleet (66 verdict rows: 12 confirmed / 52 substantively refuted + 1 verifier stub / 1
  fabricated; 15 of the 81 deduped findings carry no verdict — verifier retry deaths). Full
  analysis, fleet-mechanism
  retrospective, and OCE-relevance record:
  [`pr336-fleet-assessment-and-review-treadmill-2026-07-13.md`](../../reports/agentic-engineering/pr336-fleet-assessment-and-review-treadmill-2026-07-13.md)
  (rides the PR). **Standing follow-ups**: the untwinned PDR-063/064/125 truings re-twin at the
  next exchange window (per-item dispositions in the Practice-Core changelog); four critic design
  gaps routed to the AEE thread record; the stale Hedgehog claim `b23a3800` awaits a warden-lane
  sweep.
- **Inter-Practice exchange lane + corpus phase-0 + practice doctrine — MERGED (#304, 2026-07-06).**
  PR #304 landed to `main` (release 1.59.0, `b41ae2233`): the inter-Practice collaboration protocol
  plan + WS1/WS3/WS6, the semantic-merge "confident-and-wrong" doctrine, the corpus phase-0 design
  record, and the ripgrep-guard fix (`c2e2181bd`). Branch archived-clean; `feat/graph-tooling-tidyup`
  archived as tag `archive/graph-tooling-tidyup` (superseded WIP). **Live next:** the owner-requested
  **WS0+WS4 authoring session** (portable protocol PDR in both estates + join-ceremony skill; opener
  written) — see the [`agentic-engineering-enhancements` thread record](threads/agentic-engineering-enhancements.next-session.md).
  Tooling follow-up: **frictions F-120** (the `git merge` stale-dist guard-brick — recurrence-confirmed,
  structural cure not yet built).
- **Curriculum Hub — MERGED TO MAIN 2026-07-06 (`e7e1e1b84`, release 1.60.0).** The full
  reproduction of the Oak Curriculum Hub from the Claude Design canonical export (all pages +
  components, visual-matched, two searches, no stubs) is live on `main` at
  `demos/oak-curriculum-hub`. Standing owner principle (any Claude Design project, forever):
  always visual-match + all pages/components (user-memory `claude-design-always-full-reproduction`).
  **Live remainder** (detail + full program history in the
  [thread record](threads/curriculum-hub-demo.next-session.md), which carries the ten-Director
  chain, cast, and handoff pointers): §J owner-hosted deploy → fidelity-register judgments
  (14 findings; `tool:fidelity` + the `fidelity-review` skill) → post-merge follow-ups →
  retained-claims sweep (Peregrine `cf62bda9`, Limpet `fd0ee59e`, Thyme `16be897b`, Comet
  `35d9c8f2`) → owner branch deletions. One system defect still to graduate (NOT demo-local):
  `@oaknational/eslint-plugin-standards` configs.react/next crash under ESLint 10 (the demo is
  the first React workspace to exercise them; proper fix in `packages/core/oak-eslint`). The
  2026-07-06 dedicated consolidation drained the program's capture debt.
- **Upstream API alignment (programmes family) — MERGED (#291, 2026-07-01).** WS0/WS1 (regen +
  cached-default), WS2 (semantic schema-drift check), WS4 (programmes discoverability), WS6
  (permanent alignment runbook, PDR-120) are live on `main`. **Live next safe steps** (detail +
  grounded execution facts in the
  [`upstream-api-alignment` thread record](threads/upstream-api-alignment.next-session.md)):
  (1) the pagination-examples gate recorded RED on `main` now PASSES on latest `main`
  (verified first-hand 2026-07-06, Katydid) — the RED-gate entry here and in the thread record
  was stale; correct the thread record at its next touch; (2) author the
  `bulk-types-schema-derivation` future plan (does not exist yet);
  (3) the **MCP pagination-header P1** (ADR-shaped; the thread record's item is the owning
  record); (4) the comms-routing CLI fix
  (`agent-tooling/current/coordination-home-cli-path-defaulting.plan.md`) on the primary.
- **Runbook kind** — a repeatable operational procedure is a recognised content kind delivered via
  skills / reference-docs / rule-embedding
  ([PDR-120](../../practice-core/decision-records/PDR-120-runbooks-are-a-content-kind-not-a-surface.md));
  the [Runbook Index](../../../docs/operations/README.md#runbook-index) lists the corpus.
  Continuity-surface drift prevention is briefed in
  [`future/continuity-surface-drift-prevention.plan.md`](../../plans/agentic-engineering-enhancements/future/continuity-surface-drift-prevention.plan.md).
- **Team-tooling arc CLOSED (2026-06-28/29; #269–#286 + #282 + #268 all MERGED).**
  **LIVE NEXT (owner-directed, fresh-context): the SYNTHESIS PHASE** — the worktree-per-agent /
  PDR-117 model verdict (do-first item: the live **F-44** freshness≠liveness safety defect in
  `active-agents.ts`), the PDR-117 expansion (seeded in
  `reports/agentic-engineering/director-howto-and-pdr117-gaps-2026-06-29.md`), the do-first
  efficiency matrix, and the rightsizing-plan M1→M2 activation; then the owner-set next team.
  Guiding plan:
  [`team-tooling-session-2026-06-28.plan.md`](../../plans/agent-tooling/current/team-tooling-session-2026-06-28.plan.md);
  the live Director pickup is [`director-handoff.md` §CURRENT HANDOFF STATE](director-handoff.md);
  arc history (Director chain, comms rotation) lives there and in the plan.
- **Claims model + agent-work-state (LIVE, owner-gated).** The corrected claims model — a claim is an
  optional, advisory, AREA-scoped signal (NOT files; presence/liveness/work-state/seat re-home to
  facets) — is live in `agent-collaboration.md` §Identity vs Liveness (topology-independent area
  identity; absolute-path refusal; claim-is-not-the-seat). **Owner-gated, flagged not edited:**
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
- **Large-corpus analysis — FULL-PROCESSING COMPLETE 2026-07-04** (every workstream executed,
  set-level acceptance verified; whole-drain yield 145 duplicates / 13 enrichments / 3 rejects /
  1 routed — the C230 route became the PDR-018 sequence-first amendment, graduated 2026-07-06).
  Per-batch disposition trails, commits, and graduation homes are recorded in the live plan
  ([`corpus-analysis-salvage-and-topology-redesign.plan.md`](../../plans/agentic-engineering-enhancements/current/corpus-analysis-salvage-and-topology-redesign.plan.md))
  and the AEE thread record §SALVAGE ws1 COMPLETE. **Sole remaining work in the plan:** the
  ws2 topology readiness review (fresh seat; folds into the corpus-generalisation Phase 0).
  Physical archive-moves of the four closed corpus plans stay deferred lifecycle hygiene
  (inbound-link sweep required); comms events alone are owner-routed to a separate plan.
- **Corpus GENERALISATION — Phase 0 executed to a paused stable point (2026-07-05/06,
  owner-directed pause).** The design record
  [`corpus-generalisation-phase0-design-record-2026-07-05.md`](../../reports/agentic-engineering/large-corpus-analysis-tooling/corpus-generalisation-phase0-design-record-2026-07-05.md)
  carries drafted verdicts on the full agenda (incl. the PDR-122 invariant-2 amendment
  RATIFIED-not-yet-landed and D1–D9) with both reviews absorbed in its §Review. **Restart =
  the revision queue + the atomic landing set (PDR-122 amendment + companion-rule touch + plan
  promotion `future/`→`current/` absorbing salvage ws3–ws5 + salvage close) on a NEW BRANCH
  post-merge** (owner-directed 2026-07-06; the owner holds developments to share). Two standing
  forensic items ride with it: (1) **(owner attention)** the archived ~1,707-event comms
  residual is absent from live disk but intact in git at `255117a43^` — removal UNEXPLAINED; a
  live untracked-tier loss-detection gap (re-materialise before any pass; P0 weighs a tracked
  watermark manifest); (2) the single-model-voter measurement (inter-lens phi ≈0.55 → ≈1.4
  effective votes of 3). Research + review evidence and the owner's packages/-layer conviction
  are indexed from the design record and the AEE thread record §CORPUS GENERALISATION / §PHASE 0
  — the self-contained restart brief lives there.
- **Commit-workflow F-112 FIXED (2026-07-03, `b2ae96898`) and ON MAIN** (verified
  `merge-base --is-ancestor` 2026-07-06 — the branch merged via PR #304, so the prior
  "branch unpushed" note here was stale). Queue-workflow commits from Claude Code are
  unblocked; the Cursor-only stream-truncation residual remains documented in the commit
  skill. Completed plan (evidence + pinned mechanism):
  `f-112-commit-workflow-stream-truncation-fix.plan.md` (`../../plans/agent-tooling/archive/completed/f-112-commit-workflow-stream-truncation-fix.plan.md`).
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
  the ~1,707-event residual awaits body-read disposition before the next archive-move RUN, fired by
  retention elapse via `consolidate-docs` step 3a / `oak-curator-pass`. **Substrate correction
  (2026-07-03):** those events are no longer on live disk (removal unexplained — see the
  corpus-generalisation review report, R1); the corpus substrate is the git tree at `255117a43^`
  (5,202 events) — re-materialise before the pass.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `mcp-agent-facing-content` | Audit + classified registry of repo-controlled content that reaches an MCP consumer (the effective agent prompt); make it discoverable/auditable/reviewer-routed; future owner-gated SSOT content workspace(s). Visibility deliverable MERGED (PR #337, `SHA:5f3c1f472`); plan collection + rescue MERGED (PR #338, `SHA:7ef8a8a3a`, 2026-07-13). Distinct from `data-sources-governance` (DATA sources); this is the authored framing/instructions | [record](threads/mcp-agent-facing-content.next-session.md) | claude-code / claude-fable-5 / Monsoon herds Airstream / pr-shepherd — PR #338 merged, threads all resolved / 2026-07-13 ← claude / claude-fable-5 / Beacon hunts Brilliance / analyst+implementer / 2026-07-09 |
| `upstream-api-alignment` | Realign SDK/MCP (and bulk export) to the evolving upstream Oak API + a repeatable observable process. Programmes-family instance shipped on PR #291 (`merge=CLEAN`, awaiting owner merge); process graduated to a permanent runbook | [record](threads/upstream-api-alignment.next-session.md) | claude / claude-opus-4-8[1m] / Vanilla stirs Spore / implementer — successor to Bonfire turns Basalt; WS2+WS4+WS6 landed, review triage cleared / 2026-07-01 |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Zephyrous Buffeting Falcon / skills-lane-relocated-to-educator-end-users / 2026-06-08 (prior identities: thread record) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | claude-code / sonnet-5 / **multi-lane thread.** **LANE 6 (latest) — dedicated consolidation:** Dolphin weaves Reef (ffedcf) / curator — full bottom-up pass over 2026-07-08→14 arc, PDR-127+PDR-128 authored, 5 rules touched, 5 patterns graduated, napkin processed+rotated, both pending-graduations drained, commit `SHA:725749349` / 2026-07-14. **LANE 5 — dedicated consolidation:** Zenith wakes Perigee (8897eb) / curator — buffers drained to zero by decision, graduations PDR-101-quorum-landed, napkin processed+rotated, continuity drained / 2026-07-06. **LANE 4 — PDR-049 collision doctrine:** Hyena spins Lamplight (27cb6f) / PDR-049 §Sequential-identifier collisions authored + PR #313 MERGED; F-111→F-121 worked live; the run-quality-gates-required residual VERIFIED STALE (it IS required — see thread record) / 2026-07-06. **LANE 3 — pr-lifecycle doctrine:** Zodiac herds Spectrum (72dd40) / doctrine PR #310 MERGED (18a2d8c17); merge-window stranding rescued on `docs/pr-lifecycle-merge-ready-review-leg` (follow-up PR #312 MERGED); residuals in the thread record / 2026-07-06. **LANE 1 — inter-Practice exchange:** Wolf rides Vigil / ran the first LIVE BIDIRECTIONAL Practice exchange (oak worktree ↔ resonance coordination home, one session, prefix 25ece9, peer Misty Anchoring Rudder ab49a5, shared owner); authored `agent-tooling/current/inter-practice-collaboration-protocol.plan.md` (4 commits, unpushed, no PR) + delivered a teaching bundle to resonance (committed their side); return bundle received + committed to oak's `.agent/practice-core/incoming/`. **Lane held by Cricket lifts Echo** (2fffa2, separate Fable-5 oak session = Hushed Prowling Lantern on resonance; claim d0e453a3): adopted 2026-07-05, landed WS1 declared-home override (f31faec62), WS3 statusline join-key (4b9683be1), WS6 bundle adoption assessment (cf05fe95a); both owner gates ANSWERED 2026-07-06 (author the PDR in BOTH repos; v1 = the five-item floor + Tier-0/Tier-1 ladder) so the WS0 family is UNBLOCKED — next is the owner-requested WS0+WS4 authoring session (opener written 2026-07-06); exchange claim d0e453a3 CLOSED at handoff with final-heartbeat-end + team-member-closeout, MAR closed 44f0ea2c symmetrically (eefd4ef), watcher + claim-heartbeat torn down. Seat 25ece9 downgraded Fable→Opus at handoff, then final-closed with the loss/metaloss scan (kept its names — name derives from seed not model); durable homes: the plan, `.agent/experience/2026-07-06-first-live-bidirectional-practice-exchange.md`, napkin. **LANE 2 — corpus phase-0 design:** Hedgehog stirs Rime / design record drafted + reviews absorbed to a paused stable point (ba9c88cc9 →); branch pushed + PR to green; restart = revision queue + landing set on a new branch post-merge. Branch feat/corpus_research_enhancements, unpushed, no PR / 2026-07-06 (prior seat: Otter hunts Jetty, tier-E drain; full identity history: thread record) |
| `eslint-no-throw-result-migration` | Migrate every throw to Result (ADR-088); drive the ~1000 warnings to zero; promote the rule. In execution on `docs/planning-and-validation`; cheap WS2 done, residue is design-laden (tier map in record) | [record](threads/eslint-no-throw-result-migration.next-session.md) | claude / Opus 4.8 (1M) / Siren mends Rudder / execution — observability+graph-core+logger landed (`93beffcfe`,`304b68f8d`,`61bdbc3e4`) / 2026-06-19 (prior: Merlin spins Cirrus `1556b9191`; Vanilla weaves Undergrowth, plan-author) |
| `statusline-enhancements` | Claude Code statusline: Oak-mark + session-shape indicators (complete); **primary/worktree location rows + rate-limit gauges with reset countdowns DELIVERED 2026-06-29** (`708cd57fc`); logo lane PAUSED (owner). Future lanes: COLUMNS/LINES responsive layout, research-doc refresh, trace-log observability (deprioritized — root cause upstream). Branch divergence RESOLVED (stale local branches deleted; all on main). Detail: thread record | [record][statusline] | claude-code / Fable 5 / Wyvern seeks Clinker / footer-PR-badge diagnostic — badge is Claude Code chrome, adapter healthy, no code touched / 2026-07-06 (earlier identities: thread record) |
| `agent-naming` | PDR-027 display-name derivation: versioned schema registry, session-hook identity surfaces, wordlist eras (v2 landed; v3 + era-pinning cure queued; v3 plan now cross-linked to the knowledge-distribution-substrate direction) | [record][agent-naming] | claude / Opus 4.8 (1M) / Tuna stirs Fathom / v3-plan deep-dive + substrate-connection cross-link (no source touched) / 2026-06-30 ← claude / Opus 4.8 / Squall hunts Troposphere / thread-open + v3-plan-author / 2026-06-13 (prior identities: thread record) |
| `agent-operability` | Agents operable in their own worktrees: launch-in-worktree as the derived `(identity→worktree→branch)` binding, worktree lifecycle (create/build/draft-PR/cleanup), seat-in-the-brief. Member of the agent-team-operations cluster. **Controlling plan ready to build (owner-approved 2026-06-28); thread record stood up + branch/ground reconciled to post-merge reality (enablers committed on `docs/consolidations`) 2026-07-01.** Ground on `docs/consolidations`; next: cwd-confirmation smoke-test → Phase 1A. | [record][agent-operability] | claude / Opus 4.8 (1M) / Tuna stirs Fathom / thread-record orphan-fix + branch reconcile (no build) / 2026-07-01 |
| `strategy-and-plan-estate-holistic-review` | **REFRAMED 2026-06-22 ([ADR-200](../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)): planning-estate REWRITE on a living idea-graph.** Ideas are the fundamental node; the graph is the machine-readable SSOT (JSON + JSON Schema on `graph-core`); documents are the co-equal human-navigable embodiment via frontmatter edges. The prior survey/Pass framing is SUPERSEDED. ADR-200 + ADR-201 (Proposed) + plans COMMITTED; progression GO. **CORPUS REFOUNDING INSERTED (owner-directed 2026-07-06):** losslessly re-found the plan corpus around intent FIRST (the donor-estate method at oak scale) as the independently valuable intermediate step; controlling protocol plan [`plan-corpus-refounding.plan.md`](../../plans/product-development-governance/active/plan-corpus-refounding.plan.md) (P1–P14; placed judgement; zero-judgement workers; owner-gate register) + design record + dated `planning-estate-rewrite` amendment (`ws-r-corpus-refounding` gates ws6; WS6 substrate = refounded corpus + frozen archive via binding-clause provenance). Cross-estate designed with the resonance exchange seat; donor review sound-with-revisions, zero overturns, absorbed. **R0 COMPLETE (2026-07-08)**: R0a (PR #321) + G1 discharged (PR #322) + R0b plan-state engine (PR #323) + R0c register/ledger/truings/OG-2-table-flip (PR #325, `8385bc41a`) all on main across five runway-handoff seats (Wildfire→Stoat→Leopard→Goshawk→Rigel→Pelican). The owner-gate register is the ONE Director-owned list (OG-2 table half DISCHARGED — r1 audit mode mechanically unblocked; machinery half + OG-3 due before R3, may ride Walk A); the cost ledger is live (`plan-corpus-refounding-cost-ledger.md`, H7-bound). **In flight self-driving: PR #329** (proper S4782/S6661 fixes; supersedes the remediation bot's #326 — close it after #329 merges). **The dedicated consolidation pass EXECUTED 2026-07-08 (Corsair guards Channel — §Next Safe Steps 0a). Main-commit guards landed via PR #332 (Elder, merged `d89d5c379`). PR #333 (Elder closeout + guard follow-ups) MERGED 2026-07-08 (`9a1bb14d6`) — its two review-round findings (ambient-`GUARD_BRANCH` severing; `pre-rebase` main-in-range refusal for the `--update-refs` vector) were fixed at `f73307d22` (Bora holds Turbulence, 42a4cf) and its Codex P2 `pre-rebase` thread replied-to and resolved 2026-07-08; the pickup is discharged. The remaining closeout continuity landed via PR #334 (MERGED 2026-07-08, `5efe61aaa`). r1 STARTED 2026-07-14 (Cedar rides Undergrowth 270379, fresh seat per owner ruling, Director-routed): G2+G3 RULED at the owner sitting (G2.4 → HARD freeze window; moratorium during it; G3.3 registers-OUT — subsequently strengthened by re-homing the six registers out of the plans tree; the freeze rule carries NO register class); the pre-S0 tranche (freeze-tool hardening F-141 + out-subtraction + sitting records) is on PR #370; S0 HELD for the Director's pre-freeze estate review + a freeze-planning sitting.** Pickup = the thread record's 2026-07-14 Cedar section (supersedes the G1-era r1 block through the packet stage). **WS2** idea-node schema + id-minting proceeds in PARALLEL unchanged; **WS4 thin-slice-proof stays a hard gate** before the harvest (WS6). V0 = the form new plans take. Read ADR-200 + the thread record first. **2026-07-14 (Director, Quasar mends Umbra 52b4de): r1 reached the S0 runway** — G2+G3 ruled (HARD hours-scale window; moratorium; deletions-halt; registers OUT → re-homed via PR #375, the freeze rule's register class DELETED); PR #370 MERGED (`SHA:89f65108d`, the S0 machinery with the mechanical hold — the tool refuses S0 until the freeze-planning sitting re-ratifies); **Walk-A structure priors recorded** (three-layer hierarchy in principle, lanes 6–8, ~20 strategic plans, WIP 5 with 2–3 owner-hot; `.agent/plans-refounding/walk-a-structure-priors.md`). Owner runway: dedicated consolidation session → freeze-planning sitting → S0. Successor pre-named: Barnacle calls Spray (6d5d9c), cold standby. **2026-07-14 evening: the runway COMPLETED** — consolidation executed (Dolphin weaves Reef; PDR-127/128, napkin rotated); the sitting RULED (rule RATIFIED, `ratifiedBy` set — record `freeze-planning-sitting-2026-07-14.md`); reconciliation PR #377 MERGED (`SHA:019448a16`); **the S0 HARD WINDOW is OPEN and S0 is staged in the r1 worktree** (branch `feat/plan-corpus-refounding-s0`); **the Director seat TRANSFERRED to Barnacle calls Spray** (PDR-064 Moment 2, 20:42Z, claim `0f4be777` adopted). Next safe step = Barnacle executes S0 per the handoff record §2, then the one remaining orphan-recovery (§4.1) after window CLOSE. **2026-07-15: S0 CLOSED** — Barnacle re-cut the branch off post-#378 main on explicit owner instruction (include the moratorium-window arrival rather than exclude it), froze 681 files, PR #379 merged (`SHA:68d6d232`, release 1.69.1), window CLOSE broadcast. Orphan-recovery landed as PR #380 (**MERGED** 2026-07-15T11:20:45Z owner-merged, `SHA:55a69ceca`; the recovered entry verified in the dated archive with SHA provenance; both proof-gated worktrees — `register-rehoming`, `orphan-recovery` — verified clean/merged and removed at the Schooner pickup). **Fleet Captain role established, first seat RETIRED (owner instruction, unreliable behaviour):** Stoat holds Warren (`2a69a1`) took the S1 remit, then — before any script ran — probed a `refound-*` tool with `-- --help`; the raw tsx scripts have NO help handling, so the probe EXECUTED `refound-sweep` in the PRIMARY checkout, writing an untracked 1.4MB stray artefact (`.agent/plans-refounding/sweep/sweep-hits.v1.jsonl`, verified present, awaits owner disposal — file deletion is exceptional per standing owner ruling, never done unilaterally). Zero commits, zero pushes, zero fleet dispatch; claim `d796d356` closed+archived; the S1 worktree was removed clean (branch deleted at exactly `origin/main`). Full account + the tool-contract gotcha (discover contracts by reading source, never by execution) is in Stoat's own 2026-07-15 napkin entry — read it before re-routing S1 to a successor fleet seat. **S1 is UNSTARTED**, not in flight. **Director seat TRANSFERRED to Schooner guards Whirlpool** (`82a9df`, PDR-064 Moment-2 2026-07-15T12:04:35Z, event `35076b29`, claim `0f4be777` adopted after the readiness gate + pasted mechanical liveness check; the 2026-07-15 handoff record is conserved under `handoffs/` — its PR-#380-open and S1-in-flight claims were superseded within minutes and corrected first-hand at pickup). The stray sweep artefact was ABSENT repo-wide at 12:10Z (assumed owner-disposed; confirmation pending). **Owner rulings 2026-07-15: no more handover branches/PRs (handover artefacts land batched — director-handoff.md step 7); a residue disposition sweep over the primary's 4 stashes + ~50 local branches is commissioned (per-item proof ledger → one batch ruling → execution).** Next safe step = route S1 to a successor fleet seat (the remit stands verbatim) + the disposition sweep. | [record](threads/strategy-and-plan-estate-holistic-review.next-session.md) | claude-code / claude-fable-5 / Schooner guards Whirlpool (82a9df) / Director — Moment-2 12:04:35Z, seat held / 2026-07-15 ← claude-code / claude-fable-5 / Stoat holds Warren (2a69a1) / Fleet Captain — retired (owner instruction, unreliable behaviour); S1 unstarted, returned to Director / 2026-07-15 ← claude-code / claude-fable-5 / Barnacle calls Spray (6d5d9c) / Director — S0 closed (PR #379), orphan-recovery landed (PR #380, merged post-closeout) / 2026-07-15 ← claude / claude-fable-5 / Quasar mends Umbra (52b4de) / Director #1 — ratified rule, open window, seat transfer / 2026-07-14 ← claude / claude-fable-5 / Cedar rides Undergrowth (270379) / r1 implementer — G2+G3 ruled, pre-S0 tranche on PR #370, S0 held / 2026-07-14 ← claude-code / claude-fable-5 / Callisto guards Penumbra (da9f8c) / PR #333+#334 closeout — Codex P2 thread resolved, pickup discharged, PR #334 merged, worktrees + merged branches cleaned / 2026-07-08 ← Bora holds Turbulence / PR #333 review-round fixes landed+pushed (ec20d572c) / 2026-07-08 ← Elder stirs Chlorophyll / pre-r1 seat — main guards + PR #332, r1 assigned on recall / 2026-07-08 ← Pelican calls Spray / R0 successor #5 — R0c merged, R0 complete / 2026-07-08 ← Rigel turns Void / R0b merged / 2026-07-08 ← Goshawk calls Sundog / R0a merged + G1 / 2026-07-07 (prior seats: full table in thread record) |
| `oak-slack-assistants` | Internal-use agentic Slack assistants over Oak's MCPs on isolated libs (`ai-gateway` model layer + `slack-assistant` surface framework): **Ask Oisín** (M1 — project/repo navigator via GitHub MCP, internal POC) + future **Ask Oak** (curriculum content for internal staff, Oak MCP, first-class Clerk-M2M machine identity on our own MCP app). **🟢 DECISION-COMPLETE / READY FOR EXECUTION** (2026-07-08): full claim-register verification (every claim dispositioned — provenance in the thread record), telemetry topology **resolved** (`sentry-nextjs` provider over a shared redaction core extracted from `sentry-node`; barrier owned once), estate workstreams folded in per owner direction (logger portability fix WS-E1; Sentry vendor×runtime decomposition WS-E2). **MERGED to main 2026-07-08 (`c7aa164ec`)**; all 18 review threads dispositioned. Next: execute (WS-E1 parallel-safe immediately; WS0 scaffolds + lays the stratified adapter tier; WS-E2 after WS0); WS9+ consumes owner-provisioned resources (prod + dev Slack apps, Vercel + Gateway BYOK, fine-grained PAT, Upstash Redis). Detail: the [logging design record](../../research/outreach/slack-assistant-logging-observability-design.md) + thread record | [record](threads/oak-slack-assistants.next-session.md) | claude-code / claude-fable-5 / Salamander weaves Warmth (`4960fe`) / deep review — full-claim verification + decision-complete rework / 2026-07-08 ← Kiln wakes Copper (`48382d`) / logging re-exploration + handoff / 2026-07-08 ← Gale guards Eyrie (`33f49e`) / design + plan + 3 review rounds / 2026-07-08 |
| `orientation-skills-family` | Teaching-surface family: a portable agentic-AI primer (lead-in) plus the **one** repo-bound orientation lens (`/oak-under-the-hood`) across the PDR-112 portability seam | [record][orientation] | claude-code / Opus 4.8 (1M) / Clover mends Hedgerow / **reframe `/oak-explain`→`/oak-under-the-hood` + MCP pointer projection MERGED via PR #243 (`a0a85f60c`, 2026-06-27); ADR-202 + ADR-205. `oak-under-the-hood.plan.md` DONE→archive; MCP-surfaced discoverability follow-on owned by `current/mcp-tool-taxonomy-and-orientation.plan.md` (decision-incomplete, WS0 not started)** / 2026-06-28 (prior: Zenith lifts Firmament — unification `ca40d98ce`; Swordfish/Seal — reframe build; Skipper tracks Reef, Orbit rides Horizon, Bora lifts Downdraft) |
| `main-sonar-ai-profile-to-zero` | Drive `main`'s Sonar AI quality-profile backlog to **zero** under the owner-ratified disposition bar (fix at source is the default; ACCEPT only on a grounded site-specific tension; FP for true tool errors). Phases 1–3 + 5A MERGED (#242/#246/#249/#254/#255/#257); **Phase 5B on PR #308 (open, shepherding to owner merge)** — idiom residuals fixed, six ADR-153 guard sites rejected-as-incorrect with the ADR citation. Next batches doctrine-first: S7763/S7785/S6594/S7786 then Phase 4 design-MAJORs | [record][main-sonar-zero] | claude-code / claude-fable-5 / Katydid seeks Moonbeam / implementer — Phase 5B + the ADR-153 guard arc; PR #308 at the code-owner gate / 2026-07-06; Zenith wakes Perigee (8897eb) / curator — drift-guard follow-on noted in the record / 2026-07-06 (prior: Alder tracks Topsoil #242, Gull tracks Eyrie #246/#249, Junk tracks Moorings #223, Thyme lifts Compost, Aspen tracks Root) |
| `curriculum-hub-demo` | Reproduce the ENTIRE Oak Curriculum Hub from the Claude Design canonical export — all pages + all components, visual-matched — + two-search (live ES + local) + 6 destination cards, to the plan **DoD §A–J**. **THE BUILD IS COMPLETE** (origin `1461e5cb4`): every page + component, both searches, six cards, E1–E3, snippet/url security hardening; Framework page dissolved as superseded (canonical export carries no such page). **MERGED TO MAIN 2026-07-06** (`e7e1e1b84`, release 1.60.0; semantic run-in `1731d29e9` — 12 unions per PDR-049, F-111→F-121, run-quality-gates GREEN, 39-agent verified review). Remaining: §J owner-hosted deploy → fidelity-register judgments (14 findings) → post-merge follow-ups → retained-claims sweep + owner branch deletions → dedicated consolidation drain — see the thread record's refreshed Next safe step | [record](threads/curriculum-hub-demo.next-session.md) | claude-code / claude-fable-5 / Hyena spins Lamplight / reviewer+merge-integrator / 2026-07-06 (session closed, no claims retained; DISTINCT from director #9 "Hyena stirs Lamplight" d62788), claude / claude-fable-5 / Hyena stirs Lamplight / director #9 / 2026-07-04 (CLOSED OUT, seat retained; claims retained: Peregrine lifts Cirrus styling `cf62bda9` (session closed, pickup record current), Limpet herds Marsh data `fd0ee59e` (session closed, pickup record current: `handoffs/2026-07-02-curriculum-hub-limpet-data-plane.md`), Thyme guards Dewfall hygiene `16be897b`; Director chain Herring→…→Birch→Comet; full cast + the pause-freeze note in the thread record) |
| `continuity-memory-and-knowledge-flow` | Memory/context substrate: PDR-124 definition-surface economy LANDED (`6b7c496ab`); **Claude per-user buffer drain COMPLETE 2026-07-05 and the plan ARCHIVED** to `archive/completed/claude-memory-buffer-drain.plan.md` (Hedgehog stirs Rime: all strata; Stratum D landed the owner-ratified intent-and-mechanism frame in five commits `7f4988c63`…`7d424cc9d` — owner-signal-interpretation companion, Decision Lenses either/or coda, the design-from-impact-not-the-cowpath rule, the mechanism-without-legible-intent pattern with the eight ADR-200 seed statements, PDR-038 bidirectional amendment, owner-working-style retired, two reconciliation patterns, build_vs_buy homes, ADR-173 §estate-plurality; final census exact, MEMORY.md at zero lines). **Thread quiescent — no queued next step**; buffer lifecycle continues under `per-user-memory-is-a-buffer`; the drain's descendants (ADR-200 intent layer; OQ-10 inversion ADR) belong to the strategy-and-plan-estate lane | [record](threads/continuity-memory-and-knowledge-flow.next-session.md) | claude-code / fable-5 / Hedgehog stirs Rime / curator — drain complete / 2026-07-05 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild — D0–D7 delivered & shipped (v1.16.0); D7 proof dropped as overkill (paused 2026-06-19) | [record][eef] | claude / Fable 5 / Thyme wakes Canopy / record-condensation / 2026-06-12 (prior identities, 30+ seats: thread record) |
| `data-sources-governance` | Author `docs/governance/DATA-SOURCES.md` (suitability / last-reviewed / removal criteria) — **owner-gated**: new governance policy, an owner decision, not agent-resolvable; gates the under-the-hood/explain user-exposure surface | [record](threads/data-sources-governance.next-session.md) | claude / Opus 4.8 / Ferret weaves Nightfall / thread-opener-brief-only / 2026-06-25 |
| `school-data-search` | Oak School Data Search service (POC MVP): deep review complete, build-ready (paused 2026-06-19) | [record][school-data-search] | claude / Opus 4.8 / Fiery Sparking Caldera / deep-review-and-refinement / 2026-06-04 (prior identities: thread record) |
| `semantic-search` | Search data foundations plus paused source-portable curriculum-exploration evidence and planning | [record][semantic-search] | codex / GPT-5 / Codex / reusable-curriculum-architecture search synthesis and closeout / 2026-07-15 |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work via a deep review of the Oak Curriculum Ontology repo (opened, not started; paused 2026-06-19) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 |
| `connecting-oak-resources` | Oak resource graph substrate plus queued source-integration workspaces and paused reusable-curriculum-architecture evidence | [record][connecting] | codex / GPT-5 / Leopard tracks Dewdrop / source-integration concept exploration, plan, and closeout / 2026-07-15 |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / Cycle 1 substrate capture / 2026-05-24 |
| `mcp-product-analytics` | MCP product analytics design and Path-to-GA Programme | [record][mcp-analytics] | Stellar Glowing Satellite / claude / claude-opus-4-7 / Programme landed + amendments / 2026-05-26 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 2026-05-10 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | claude-code / Fable 5 / Forge turns Basalt / dfe-data-sdk-seed-authoring / 2026-06-12 (prior: Squally / cursor / 2026-04-30) |
| `architectural-budget-system` | Cross-scale budgets; proposed report-only directory-concentration validator direction awaits owner ratification | [record][budget] | codex / GPT-5 / Spark seeks Pumice / concept exploration and handoff / 2026-07-15 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |

## Next Safe Steps

### Source integration workspaces — ready, sequenced, and not yet executed (2026-07-15)

The durable concept exploration is the
[`oak-integrations` report family](../../reports/oak-integrations/README.md),
including the dedicated
[Castr source-integration report](../../reports/oak-integrations/castr-source-integration-report-2026-07-15.md).
The executable owner is the
[Oak source integration workspaces plan](../../plans/architecture-and-infrastructure/current/oak-source-integration-workspaces.plan.md).
It specifies optional pinned source checkouts for Oak OpenAPI, Castr, Oak Curriculum Ontology,
and Oak Database-Tools, with stable parent wrappers and a complete public-root path when every
submodule is absent. Castr uses source mode for rapid local co-development and released core plus
generic fetch-companion packages for ordinary public-root use; Oak runtime policy remains owned
here.

The plan is `ready-for-execution` but sequenced after the P0 workspace layer-separation audit.
This session performed no implementation, submodule addition, source-repository branch creation,
package publication, commit, or push. The next authorised executor must first confirm that the
preceding audit is complete, then run the plan's blocking preflight: recheck source visibility and
heads, branch policy, cross-repository permissions, npm scope and package-name authority,
trusted/provenance publishing, and the current vendor call shapes. `git status` remains the
falsifier for the report, plan, and closeout artefacts, which are written in the shared working
tree but uncommitted.

### Reusable curriculum architecture — evidence complete; promotion owner-directed (2026-07-15)

The three-report
[family](../../reports/oak-reusable-curriculum-architecture/README.md) and the
strategic future [planning
brief](../../plans/connecting-oak-resources/reusable-curriculum-architecture/future/reusable-curriculum-architecture-planning.plan.md)
are the durable evidence and planning homes. They cover repository corrections,
cross-estate obligations, source-portable Elastic exploration, MCP and website
consumer boundaries, and the ADR ratification watchlist. The
`connecting-oak-resources` and `semantic-search` records remain paused; no
implementation is authorised. The next safe action is the brief's
owner-directed promotion trigger, not ad hoc code or current-architecture edits.
Session-completion consolidation captured this lane; unrelated incoming
practice exchanges remain owner-gated outside this session.

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
**Standing residual** (not a reopened lane): the coordination-tier curator-pass — the ~1,707-event
residual awaits body-read disposition; work-list + recipe in the retired record's §"WS7 Closeout".
**Substrate correction (2026-07-03):** the events are no longer on live disk (removal unexplained —
corpus-generalisation review R1); re-materialise from the git tree at `255117a43^` before the pass.

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

0. **Full processing DONE 2026-07-04; Phase 0 design PAUSED at a stable point 2026-07-06.
   NEXT: merge the branch PR, then the Phase 0 restart on a NEW BRANCH** (revision queue +
   landing set) — see the §Current State corpus-generalisation entry; the self-contained
   restart brief is the AEE thread record §PHASE 0.
0a. **Deep consolidation status: completed this session (2026-07-14, Dolphin weaves Reef,
   ffedcf, commit `SHA:725749349` on `team/planning_and_visibility`).** Full bottom-up pass
   over the 2026-07-08→14 arc (six sessions through the ten-seat planning-and-visibility
   team): PDR-127 (team-branch coordination protocol) + PDR-128 (review-conversations)
   authored from previously-untracked comms narrative; 4 rules amended + 1 new rule
   (`records-are-technical-not-emotional`); 5 new patterns + 1 sharpened instance; napkin
   fully processed and rotated (`archive/napkin-2026-07-14.md`); both pending-graduations
   items drained; two PR #376 tail Copilot fixes applied; Practice Box light-passed (item 4
   below). All closeout claims verified confirmed by a fresh-context 12-claim adversarial
   check (zero refutations). Prior pass: EXECUTED 2026-07-08 (Corsair guards
   Channel, ecdd12, dedicated pass on main).** That commissioned scope was processed bottom-up: the napkin's
   seven seat-windows (2026-07-06→08, the R0 runway arc; Pelican's post-handoff custody
   entries preserved first at `473f22dcb`) dispositioned item-by-item then rotated (verbatim
   archive `archive/napkin-2026-07-08-corsair-dedicated-consolidation.md`, cmp-proven);
   pending-graduations drained to ZERO by decision (quiet-pipe → verify-dont-trust
   §bare-exit + the action-time plan's recurrence routing; supervised terminal-condition
   watch + compound-read floor → pr-lifecycle Phases 5–8; era-witness + link recompute →
   semantic-merge; remediation-bot item rejected as moot — owner decision, bot OFF);
   PDR-126 authored (gates land strict in one landing; three live warn-first surfaces
   trued); PDR-027 amended (model-switch continuity); three patterns authored; both
   practice-box incoming files integrated and cleared (owner-approved; residuals routed to
   the AEE thread record's WS0 agenda); open-questions confirmed empty; two completed
   threads retired (`reasoning-grammar`, `user-search-not-exposed-until-built`); the batch
   ran the PDR-101 four-seat quorum. **Owner-attention residue from the 7c audit**: two
   Active threads read stale — `agentic-mechanisms-discovery` (last 2026-06-08) and
   `eslint-no-throw-result-migration` (last 2026-06-19). Next deep consolidation fires on
   the ordinary triggers, not on inherited debt. Prior dedicated pass: 2026-07-06 (Zenith
   wakes Perigee) — its record is conserved in that pass's archive and commits.
   Session-completion consolidation ran at the 2026-07-08 slack-assistants closeout
   (Salamander weaves Warmth): two lessons graduated on first instance
   (`patterns/scope-parsimony-is-not-discipline.md`; the pr-lifecycle intent layer),
   F-133 recurrence recorded, one PDR candidate registered; napkin live (not rotated);
   closeout changes uncommitted in this primary checkout (owner direction).
1. The latest dedicated consolidation is 2026-07-02 (Rosemary stirs Bracken): napkin rotated, the
   distilled buffer + the v2 13-pattern work-list fully graduated (conservation plan WS-A/WS-B),
   PDR-122 amended, PDR-123 (design panels) authored, the conserve-by-default rule landed;
   `distilled` + `pending-graduations` + `open-questions` all empty (the long-lived questions
   re-homed into their owning artefacts; recorded keep-open grants voided by the owner —
   grants are live-per-pass, never carried).
2. The relative-link integrity item is accepted as a future validator lane, not
   implemented tooling; promote the plan only on its recorded trigger.
2a. `agent-collaboration.md` is hard-over on lines (380/360) after the injected-asymmetry doctrine
   and the ws1b sidebar-preference clause landed (justified substance; the file was already at
   359). The named remediation is its own `split_strategy`: create
   `agent-collaboration-channels.md` and extract the per-channel protocol detail — a focused
   future extraction, not a trim.
2b. **Post-ws1b hard-fitness remediation lane (2026-07-03).** The ws1b graduations pushed four
   further surfaces marginally past hard — `testing-strategy.md` (459/450 lines),
   `docs/engineering/testing-patterns.md` (232/200), `docs/governance/development-practice.md`
   (286/280), `collaboration-state-conventions.md` (12045/12000 chars) — each from
   correctly-placed substance, never to be trimmed. Structural responses per each file's own
   `split_strategy` at the next natural boundary (testing-patterns' gotcha lists are the natural
   extraction; development-practice's markdown-authoring bullets likewise). Acceptance: the
   substance survives verbatim in a home at least as read-proximate, and the source returns
   within hard. `principles.md` and this file's char pressure pre-date the pass.
3. Comms-event rotation is the retention-gated curator-pass (ADR-199 / PDR-094): archive-move events past
   their class window, gated on absorption + provenance. Analysis is never gated; fitness is routing
   evidence only — never archive, split, shard, or rename unprocessed content to improve scores.
4. **Practice Box light-pass complete (2026-07-14 dedicated consolidation, Dolphin weaves Reef); full
   integration still QUEUED, owner-scoped.** Three resonance exchange bundles received
   2026-07-05/06/08 (`.agent/practice-core/incoming/`), well-formedness-checked, box NOT cleared. Two
   backflow items are castr-bound (forward at the next resonance/castr exchange window, no local
   action). The PDR-117 host-path item is already resolved on `main` (the Consequences section already
   uses the "in this repo it is `<path>`" host-indirection form). **Queued for a dedicated cross-estate
   integration session** (owner-scoped — this bears directly on the live `strategy-and-plan-estate-holistic-review`
   plan-corpus-refounding effort, so route through that thread's Director, not unilaterally): four
   design-core candidates (proof-ladder claim-typing, a refusals-list shape, a posture-selection
   procedure, an obligation-family shape); resonance PDR-129/130-style recomputable plan/team state
   (proof-typed todos, claims joined to plan-todo pointers); a zero-judgement worker-class discipline
   with mandatory verification-of-delegated-work; and a proposed inter-Practice communication protocol
   as a Core PDR family (offered to merge with this estate's own queued
   `inter-practice-collaboration-protocol.plan.md`).

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
8. **Corpus-generalisation Phase 0 scheduling** (posed 2026-07-03): when/what shape — recommended
   soon, fresh-seat, allowed to span multiple sittings (seventeen-question agenda; absorbs salvage
   ws2). The plan's promotion trigger; nothing else blocks on it.
9. **Comms forensics depth + live-event PII posture** (posed 2026-07-03): (a) how much further
   effort on the unexplained untracked-tier removal — recommended accept-and-rely-on-the-watermark-
   cure (data recoverable at `255117a43^`); (b) the 21+ live comms events embedding machine-local
   paths — recommended rely on the mandatory pre-fan-out PII screen rather than mutating immutable
   event records (a redact and/or write-time-guard option was offered).
10. **Estate-wide markdown→graph inversion ADR timing** (posed 2026-07-03): a Proposed ADR
    generalising ADR-200 + PDR-119 (surface-class taxonomy; PDR-122-bound reconciler) —
    recommended a dedicated authoring session soon; alternatives: after Phase 0, or after ADR-200
    WS2/WS4. Evidence: the research report §Further research (markdown→graph subsection). Decision
    input landed 2026-07-05: ADR-173 §"The estate is plural by design" carries the owner-corrected
    graphs-are-a-method doctrine (data-layer SSOT; deliberate plurality above; integration at
    source and surface) that the authoring session must honour.

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
