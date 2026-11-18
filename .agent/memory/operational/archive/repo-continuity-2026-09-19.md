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
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# Repo Continuity

Repo-level operational index for active thread state. Historical session-close
prose is archived under [`archive/`](archive/) (latest pre-compaction snapshot:
`repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md`).
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

- **This line's direction — owner words 2026-09-05, verbatim.** (1) "I want to explore
  creating a set of skills around not what to teach but how to teach, pedagogy skills,
  and the EEF work seemed like a good place to start." (2) "For now this is specific to
  the Engraph fork." (3) "Splitting out the Oak apps is the top priority in the Oak
  fork, not necessarily in this fork." The shape that landed 2026-09-06: the pedagogy
  product lives in its own repository (`EngraphCode/pedagogy-library`, the first
  ecosystem visitor, checked out under a gitignored `visitors/` directory — runbook
  [`ecosystem-visitor-checkout`](../../plans/runbooks/ecosystem-visitor-checkout.plan.md));
  this tree gains only the org-neutral EEF corpus markdown projection (delivery node
  [`eef-corpus-markdown-projection`](../../plans/delivery/eef-corpus-markdown-projection.plan.md),
  #58 merged 2026-09-07). The extraction's priority is the Oak line's, not this line's.
- **2026-09-02 ~13:xxZ — the 19 August fold LANDED (Finch calls Pinnacle, c91bd4).**
  `coordination/2026-08-19-1651ad` (PR #915) merged into main by merge commit: the
  `toolkit-re-architecture` strategic node is on main (ratified 2026-08-19),
  `workspace-reorganisation-programme` is `superseded` by it, the principles gradient
  amendments, three graduations, the atlas five-change set and the 19 August estate
  records ride with it; the #908 post-merge cure (the tango node consolidated through its
  T1d amendment and re-stamped) rides the same fold at owner word. No Director is
  seated; no successor coordination branch was cut (owner word 2026-09-02). The napkin
  on main is now 3025 lines (the fold's 2026-08-19 blocks unioned with main's
  2026-08-24→09-02 blocks); its rotation is the curator's on `handoff/jim-september`
  (Kiln holds Slag, 1447f4, draft PR #951), which is the primary checkout's branch and the
  home of the split plan and the strategy consolidation at the owner's word. Owner
  objective, verbatim: "merge 915, then provide a plan, then make sure that the repo
  strategy is consistent and cohesive around that plan"; the five owner rulings for the
  split plan are in the estate-coordination thread record §2026-09-02 FOLD LANDED.
- **2026-09-02 ~14:2xZ — #915 MERGED as `777e9131c`; lane MCP-661 open (same seat).** The fold
  is on main (owner-merged 14:05Z on `475a8193d`, four Copilot rounds settled at owner word
  "keep 915 tight"). Kiln merged main into `handoff/jim-september` (`ba7e37d78`). The next
  objective item runs on ONE branch at owner word ("all of that goes into the same branch as
  the delivery plan, to minimise the total number of prs"): `jimcresswell/mcp-661-split-delivery-plan`
  carries these record true-ups, the five review items routed off #915, and the split delivery
  plan node `oak-open-curriculum-mcp-extraction` (serving `toolkit-re-architecture`, born
  sketch, presented for the owner's word). Pickup map: the estate-coordination thread record
  §2026-09-02 FOLD LANDED, last block.
- **MCP APP FIRST MAJOR RELEASE — THE PRIMARY LIVE EFFORT (2026-07-21→).**
  Canonical state lives in the first-major-release strategic plan (the
  owner-authored decisions register) on `main`, the Linear project, and
  [`director-handoff.md`](director-handoff.md) §CURRENT HANDOFF STATE — never
  this file. Unless its own line says otherwise, every other lane below is
  dormant or buffered behind this effort.

- **OPEN-SURFACE ZERO — active owner-PR merge drive (2026-08-11→).** Live
  lane 2026-09-01: the integration landing of the owner's fork line onto
  `main` — **PR #945** (`feat/innovation-kit-updates`, bot-authored, 221
  commits / 324 files), driven by Luna seeks Twilight (5c0ddc); #943 (the
  same content from the fork branch) is closed in its favour after its
  SonarCloud gate went green at `f042d46e0`. Paused 2026-09-01 behind
  **MCP-655** — Claude Code's OAuth sign-in to the MCP app failed on preview
  and production (RFC 9207 issuer mismatch). That fix landed on
  `fix/mcp-oauth-metadata-iss-claim` at `2f14f6f76` (Kiln holds Slag); the
  proof day (2026-09-02) exposed a second, pre-existing defect — mispaired
  Clerk keys in the preview environment — cured by the owner's key
  correction plus a bootstrap key-pairing guard at `7579d4269`; **#946
  merged 2026-09-02 10:42Z as `55f7a457c`**, shipped in release 1.175.3
  (`555fe6587`, 10:47Z; production PRM verified naming Clerk); the Claude
  Code production sign-in proved at 11:07Z after a stale-client rename;
  MCP-655 Done; the node is archived at
  `.agent/plans/archive/mcp-655-oauth-issuer-alignment.plan.md` (#948,
  `995eb0aa6`) and carries that lane's close-out. #945
  resumed 2026-09-02 once the fix was cherry-picked onto its branch
  (`6028ac95c`, owner word "option 2"): the live-service validation through
  the owner's authenticated Claude Code session passed (verdict GO, record
  `uat-reports/2026-09-02-preview.md`); `main` merged in after #944 and
  again after #946 (unions second-read by Kiln holds Slag). **#945 MERGED by
  the owner 2026-09-02 11:04:45Z as `bf8db3a8e`; branch deleted; the
  fork-line landing is complete;** release 1.176.0 (`cbcd76231`) carries it
  and production rows 1.1–1.3 passed at 11:13Z (thread record §Lanes). The
  open-surface-zero remainder is the older slice below; instruments and
  dispositions in the thread record §Lanes.
  Older slice: PRs #745 and
  #746 are merged (`236a8e3437`, `9dbf78328c`); #839/#840 were correctly
  recomposed as atomic replacement #852, **merged 2026-08-11 13:10:40Z
  (`52bfdfb4d`)** — fold correction. Resume that slice at #805, then the
  owner-authored custodial pair #818/#819.
  #841 merged 2026-08-11 06:53Z, owner-merged (corrected at the fold); #816 was
  not added to this author-filtered slice. Exact custody, owner directions and failure learnings live in the
  tracked thread record
  [`threads/open-surface-zero.next-session.md`](threads/open-surface-zero.next-session.md). Deep consolidation
  status: due — the napkin is far past its rotation threshold and the
  2026-09-01 drive captured repeated correction classes (instrument-for-end
  substitution; dependent-PR tail risk); not well-bounded for a drive seat's
  closeout, left for a dedicated consolidation pass.

- **TYPESCRIPT ESTATE CONSOLIDATION REVIEW — PAUSED 2026-09-06 (no fork lane).** Design
  ratified 2026-08-19 on the Oak line; the measurement-foundation tranche's state
  (Revision 2.6, the `typescript-estate-review-019fc3` worktree, the known red
  boundaries) lives in the
  [thread record](threads/paused/typescript-estate-consolidation-review.next-session.md);
  reactivation is owner-directed.
- **RESTATEMENT REMEDIATION and the PLAN-CORPUS / STRATEGY ESTATE — PAUSED 2026-09-06
  (no fork lane).** The gated lane and its plan
  ([`restatement-remediation.plan.md`](../../plans-backlog-2026-07/product-development-governance/active/restatement-remediation.plan.md)),
  the 2026-07-21/22 corpus reshaping (owner-ruled an unratified sketch; ADR-216 the
  doctrine home; decisions register D23) and the superseded-pending-adjudication
  machinery live in the
  [thread record](threads/paused/strategy-and-plan-estate-holistic-review.next-session.md)
  and the decisions register; read them first, this row is a pointer.
- **CRICKET CONSCIENCE-CHECK SUBSTRATE — live, owner-mandated, platform panels.**
  Every active agent invokes its platform panel twice at real cycle boundaries:
  STANCE normal and adversarial. Between owner interactions the cadence is
  event-driven, not a bare timer (owner answer 2026-07-30). Claude exposes
  judgement-low/medium/high plus procedure-xhigh; Codex exposes
  judgement-low/medium plus procedure-xhigh. Cursor's four stable adapters are
  template-only. `$oak-cricket` owns the live roster, invocation contract, and
  on-demand triggers for second opinions, rubber-ducking, and design partnership.
  Historical model-labelled runs remain in the operating record:
  [`cricket-quartet-tally-2026-07-29.md`](../../reports/agentic-engineering/cricket-quartet-tally-2026-07-29.md)
  (pair-era calibration carried as baseline from
  [`cricket-two-pair-tally-2026-07-26.md`](../../reports/agentic-engineering/cricket-two-pair-tally-2026-07-26.md)).
  Rule portability and PDR-127 alignment remain metagovernance candidates.
- **Architectural fitness + mutation testing — decision-ready, reports landed
  (2026-07-15); owner ratification pending.** Report-only validator direction
  (counts are not limits) + the mutation dry-run contract; reports:
  [architectural fitness](../../reports/architectural-fitness-functions-concept-exploration-2026-07-15.md),
  [mutation testing](../../reports/mutation-testing-incremental-rollout-concept-exploration-2026-07-15.md).
- **MCP agent-facing content — PAUSED 2026-09-06 (fork ruling).** The 716-item registry
  (#337/#338; MCP-103 delta-refresh #476) and the owner-gated research execution live
  in the [thread record](threads/paused/mcp-agent-facing-content.next-session.md).
- **Inter-Practice exchange — live next: the WS0+WS4 authoring session**
  (portable protocol PDR in both estates + join-ceremony skill; opener
  written) — the
  [AEE thread record](threads/agentic-engineering-enhancements.next-session.md).
  Standing: the untwinned PDR-063/064/125 truings re-twin at the next exchange
  window; frictions F-120 (`git merge` stale-dist guard-brick) structural cure
  unbuilt. Practice Box dispositioned 2026-07-23 (owner card): three
  integrated files cleared, the research-programme guide re-homed to
  `reference/`, the outbound bundle held (castr-bound items forward at the
  next window; the four design-shape offers queue for the cross-estate
  integration session, owner-scoped). The Practice Box was cleared on
  2026-09-17 at the owner's word; the bundle's carries now live in the AEE
  thread record's "Offered by resonance on 2026-07-08" block.
- **Curriculum Hub — PAUSED 2026-09-06 (no fork lane).** Merged 2026-07-06; the remainder
  (§J deploy, the fidelity-register judgments, follow-ups, the ESLint 10 defect) lives
  in the [thread record](threads/paused/curriculum-hub-demo.next-session.md).
- **Upstream API alignment — PAUSED 2026-09-06 (fork ruling).** The RED-gate note, the
  `bulk-types-schema-derivation` future plan, the MCP pagination-header P1 and the
  MCP-130 cached-schema state live in the
  [thread record](threads/paused/upstream-api-alignment.next-session.md).
- **Team-tooling — live next: the SYNTHESIS PHASE** (worktree-per-agent /
  PDR-117 verdict; do-first the F-44 freshness≠liveness defect in
  `active-agents.ts`). Plan:
  [`team-tooling-session-2026-06-28.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/team-tooling-session-2026-06-28.plan.md).
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
  [`agent-spawn-flow-tool.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-spawn-flow-tool.plan.md). The
  substrate ([`future/knowledge-distribution-substrate.plan.md`](../../plans-backlog-2026-07/agent-tooling/future/knowledge-distribution-substrate.plan.md))
  is recorded-future, not a prerequisite. Next agent: read it + the `feedback_*` memories it names,
  confirm the cwd fact once, build friction-sliced.
- **Sonar AI-profile → zero — dormant-live.** Phases 1–3 + 5A/5B landed; next
  batches doctrine-first (S7763/S7785/S6594/S7786, then Phase 4 design-MAJORs).
  Thread: `main-sonar-ai-profile-to-zero`.
- **Corpus generalisation — paused at the Phase 0 stable point (owner-directed,
  2026-07-06).** Restart = revision queue + atomic landing set on a NEW branch;
  the self-contained restart brief is the AEE thread record §PHASE 0 + the
  [design record](../../reports/agentic-engineering/large-corpus-analysis-tooling/corpus-generalisation-phase0-design-record-2026-07-05.md).
  Standing forensic items ride with it: **(owner attention)** the
  ~1,707-event untracked-tier removal (unexplained; intact in git at
  `255117a43^` — re-materialise before any pass; P0 weighs a tracked
  watermark manifest), and the single-model-voter measurement.
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
- **MCP product analytics — ACTIVE.** The submission-blocking PostHog sink and
  `@posthog/mcp` integration proceed from the ratified MCP-63 plan, landed on
  main via PR #568 (merge `ccd1c410f`, 2026-07-26); implementation runs on a
  dedicated branch/worktree. Focused PR1 is local commit `ae25b10c9`, unpushed
  with no PR, one ahead and nine behind main. PR2 remains dirty and local:
  PostHog adapter, oak-eslint boundary registration, workspace registration,
  and pnpm-generated lock entries only. Its final-wire production-composition
  blocker is cured; no app source has been edited. The owner requires
  PR1-settled → PR2-settled → PR3. Succession from Kite seeks Crosswind to
  Cutter hunts Lagoon is complete; Cutter holds the seven implementation
  claims and Kite retired. The canonical watcher is not treated as cognition;
  the separate full-stream ten-minute foreground monitor remains the awareness
  path until the user stops it. The
  [permanent dated record](../../reports/mcp-63-succession-notification-and-focused-delivery-2026-07-26.md)
  holds the self-contained causal and historical understanding. MCP-173
  separately gates October public-beta enablement; `pnpm-lock.yaml` remains
  pnpm-generated only.
- **Other decision-complete plans awaiting execution routing.** MCP output
  contracts: owned since 2026-08-19 by the `mcp-output-contracts` strategic
  node + `mcp-served-surface-truth` / `mcp-output-contracts-implementation`
  delivery plans (`.agent/plans/`; the single-envelope
  `composeEnvelopeSchema(payloadSchema)` doctrine was falsified against the
  served wire — three envelope shapes; prior plans archived); the MCP
  test estate + observability-sinks plans (§Next Safe Steps). OAK-PROD MCP
  snagging — next: S0 non-Cursor probe, then S1 to owner.
- **no-throw remediation — RESHAPED, READY (survey-first), PAUSED for the strategy thread.** Controlling
  plan [`no-throw-remediation.plan.md`](../../plans-backlog-2026-07/architecture-and-infrastructure/current/no-throw-remediation.plan.md);
  the ~1000-warning count is an indiscriminate-rule artefact (~6 cause-classes). Investigation-first
  WS0→WS4; 4 conversions landed. Resume from WS0 after the strategy work. **Owner ruling
  2026-09-08** on the 1,227 warnings across 16 packages: "Turn the rule off for now, we can't fix it
  without creating incredible churn, so that needs to wait until the Engraph fork is merged back into
  the upstream. However, in any workspace with no current warnings and in any new workspace, leave it
  on as an error." The rule is binary: off where the debt lives, error everywhere else and for every
  new workspace; the migration lane waits for the merge-back. The merge-back is planned for October
  2026 and has no plan node by the owner's word the same day ("do not worry about the October
  re-integration, I have some thoughts, but we do not need a plan yet, and we should not let the
  intention overly influence the decisions we make now"); Oak-line delivery sketches not pending on
  the fork are left as they are until then. The same cards ratified six of 25 delivery sketches
  (consolidation-induction, consolidation-ledger, consolidation-signal,
  director-continuity-surface-redesign, commit-queue-local-ephemera,
  code-quality-binding-per-checkout) and held the other nineteen until October, the Director's
  recommended `codex-app-server-idle-wake` among them: route fresh seats under the ratified set and
  do not re-raise the Codex wake before October.
- **Practice↔IDE integration plane** — feasibility report landed; **owner decisions pending** (§Open
  Owner-Decision Items); a HARD deep-docs-read prerequisite before any build.
- **Onboarding-improvement arc** — PR #199 merged; follow-ons open (B2/B3 risk-register seeding; the
  ask-the-repo search decision — B1 awaits owner cost bands, B6 at the M2 gate). **2026-07-28: the
  dev-facing guide LANDED** — `docs/engineering/working-with-this-repo-for-devs.md` (owner-authored)
  plus discoverability wiring via #603, and the wrap-closes-every-session doctrine re-truing via
  #604 (ADR-150/PDR-011 amended; follow-ons MCP-310/311/312); detail in the
  `orientation-skills-family` and `agentic-engineering-enhancements` thread records.
- **Evals pickup — QUEUED, owner-directed**
  ([`skill-evals-pilot-start-right-quick.plan.md`](../../plans-backlog-2026-07/agentic-engineering-enhancements/current/skill-evals-pilot-start-right-quick.plan.md));
  the assurance regime is homed in `principles.md` §Agentic Quality + `validation-strategy.md`.
- **AX first-class** — PDR-111 + the `agent-experience-review-lens` rule landed; the live home is
  [`agent-experience-improvement.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-experience-improvement.plan.md)
  (next: WS-1 CLI-ergonomics conformance guard — §Next Safe Steps; WS-4 is the structural drain-fix).
- **Fitness-system doctrine (agentic lane)** — the Closure & Role-Routing findings record + backbone
  plan landed (`547d889c9`); next is the plan's WS0 (PDR-106 + ADR-144 amendment) and the §11
  comparison. Detail in the `agentic-engineering-enhancements` thread record.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal sources, not long-term
  documentation. The 2026-07-23 dedicated pass ran the class-tiered
  archive-move (3,618 routine events; provenance + byte-preservation gates
  green) and the stale-claims sweep (23 archived). **Live tooling gap**: 1,346
  coordination-class events await a curator-disposition INPUT CHANNEL in the
  mover (their knowledge is absorbed; the recording mechanism doesn't exist
  yet) — routed with the comms-watch-storage-redesign lane, which also owns
  the rotation-vs-live-watcher cursor-floor mitigation. **Standing residual:**
  the git-history coordination-tier corpus at `255117a43^` (see the corpus
  bullet above) — re-materialise before any pass over it.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `estate-coordination` | The Director lane's thread record (founded 2026-08-13): journal, board, seat chain; `director-handoff.md` keeps the Brief and the live snapshot. Live state, the boundaries since 2026-09-03 (the Engraph fork; lead/support split) and the owner's standing open-PR-count goal live in the record. | [record](threads/estate-coordination.next-session.md) | claude-code / claude-opus-5 then claude-fable-5-1 / Zephyr guards Leeward (281e44) / curator, sole operator until 2026-09-17 15:31Z, then at n = 2 with Dynamo turns Temper (2a4c8a, the Oak integration lane) — #145 landed, the 2026-09-14 branch folded, #147 landed on premises (`0bd321131`), #149 landed (`514bfc06a`), the deep retrospective landed (`940c019a6`), the 2026-09-15 branch folded as #150 (`a07940ac9`), the 2026-09-16 branch as #152 (`cd847a2b3`) and the 2026-09-17 branch as #153 (`SHA:b5b0e70cd`) and its successor as #155 (`SHA:65a929d9a`) inside the owner-directed consolidation, successor `coordination/2026-09-19-65a929` / 2026-09-19 ← claude-code / claude-fable-5-1 / Flounder turns Estuary (c5cc2c) / lead at n=2 with Buzzard lifts Eyrie (326bcb) in support from ~19:3xZ; earlier solo implementer — owner rulings landed (merge-bot config per-checkout; green-and-clean merges without waiting) / 2026-09-03 ← claude-code / claude-fable-5-1 / Chinook seeks Cloud (661556) / lead at n=2 with Vesta rides Solstice (9e26e6), then solo for the wrap / 2026-09-03 |
| `open-surface-zero` | Oldest-first disposition and merging of Jim-owned open PRs; every feedback surface harvested, all checks green, then immediate merge. 2026-09-01: the fork-line integration landing (#943 → rehomed as #945) runs on this thread | [record](threads/open-surface-zero.next-session.md) | claude-code / claude-fable-5 / Luna seeks Twilight (5c0ddc) / driver — #943 Sonar-gate cure landed via the fork, rehomed as #945 at owner word, driving to the bot merge / 2026-09-01 (prior: codex / GPT-5 / Smith holds Temper (019fef) — #745/#746/#852 merged / 2026-08-11) |
| `design-system-integration` | AIP-137: the Claude-Design-exported design system as a first-class integrated system (ADR-213 — repo home + studio seat, bidirectional sync); kit landing, contrast gate, hub migration, studio sync-back. Lane state, owner rulings and the fidelity register live in the record. | [record](threads/design-system-integration.next-session.md) | claude-code / claude-fable-5-1 / Flounder turns Estuary (c5cc2c) / lead seat — PR #41 (MCP-613 records-truth pass) landed SHA:8b2b5ee03; the seven-item records residue is on the thread record §2026-09-05; claim b627b5af closed; the lane's next pickup (T1a-ii, or the residue) opens from a fresh claim / 2026-09-05 (seat chain: thread record) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation — the multi-lane doctrine/consolidation thread; this row is the index pointer only. Lane history, the identity table and the latest lane (the 2026-09-02 napkin-only dedicated consolidation and its step-6a synthesis, Kiln holds Slag) live in the record. | [record][agentic] | claude-code / claude-fable-5-1 / Kiln holds Slag (1447f4) / curator — napkin-only dedicated consolidation and the step-6a synthesis / 2026-09-02 (prior lanes: thread record) |
| `oak-slack-assistants` | Internal agentic Slack assistants over Oak's MCPs (Ask Oisín M1; future Ask Oak). 🟢 DECISION-COMPLETE, plan merged 2026-07-08; next: execute (WS-E1 first). Detail: [logging design record](../../research/outreach/slack-assistant-logging-observability-design.md) + the record. | [record](threads/oak-slack-assistants.next-session.md) | claude-code / claude-fable-5 / Salamander weaves Warmth (`4960fe`) / deep review — decision-complete rework / 2026-07-08 (chain: thread record) |
| `continuity-memory-and-knowledge-flow` | Memory/context substrate (PDR-124 landed; the 2026-07-05 per-user buffer drain complete, plan archived; the second dedicated drain complete 2026-09-14 — 495 Claude buffer entries dispositioned, graduation commit `0e4173b43`, 488 retired, the operator profile seeded). PDR-141 (Accepted, owner-ratified 2026-09-14) moves the operator profile to `~/.practice/profile/`; the seeded profile is ratified. Queued: twelve directive-bound entries (the owner's 2026-09-17 lifecycle decision and two 2026-09-14 rulings among them) in `pending-graduations.md`, for the directive pass in a fresh context; buffer lifecycle continues under `per-user-memory-is-a-buffer` | [record](threads/continuity-memory-and-knowledge-flow.next-session.md) | claude-code / claude-opus-5 then claude-fable-5-1 / Zephyr guards Leeward (281e44) / curator — the dedicated consolidation's second half folded as #153 (`SHA:b5b0e70cd`); its successor folded as #155 (`SHA:65a929d9a`); the directive pass next, in a fresh context on `coordination/2026-09-19-65a929` / 2026-09-19 ← the same seat / curator — second dedicated drain complete / 2026-09-14 |
| `slack-watcher-estate-review` | Owner-commissioned review (2026-08-24) of the Slack Watcher organ — COMPLETE the same day, all six proposals owner-adopted and P1–P5 landed; shepherded 2026-08-25 (OCE PR #17 `c40a4287`, castr PR #53 `e62891ee`); plan archived; report at `.agent/reports/agentic-engineering/slack-watcher-estate-review-2026-08-24.md`. The remaining probe and two recorded deferrals live in the record. | [record](threads/slack-watcher-estate-review.next-session.md) | claude-code (cloud) / claude-fable-5 / Raven stirs Murmur (c4031b) / reviewing + executing seat / 2026-08-24 (prior: Buzzard weaves Airstream 01e90b, plan author) |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools; moved from Active 2026-07-30 (no identity touch since 2026-06-08); reactivation is owner-directed via §Next Safe Steps. | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Zephyrous Buffeting Falcon / skills-lane-relocated-to-educator-end-users / 2026-06-08 (prior identities: thread record) |
| `eslint-no-throw-result-migration` | Migrate every throw to Result (ADR-088) and drive the warnings to zero; RESHAPED survey-first (four conversions landed) and paused for the strategy thread (moved from Active 2026-07-30); the agent-tools warning residue belongs here. | [record](threads/eslint-no-throw-result-migration.next-session.md) | claude / Opus 4.8 (1M) / Siren mends Rudder / execution — observability+graph-core+logger landed (`93beffcfe`,`304b68f8d`,`61bdbc3e4`) / 2026-06-19 (prior: Merlin spins Cirrus `1556b9191`; Vanilla weaves Undergrowth, plan-author) |
| `codex-to-codex-hook-review-experiment` | **PAUSED, PENDING.** Fresh-process hook lane RED on configured latency; a later project-local attempt unreviewed and not working; the working-tree state preserved at `SHA:c4fae0b83` on draft PR #403 (2026-07-16). Detail in the record. | [record](threads/paused/codex-to-codex-hook-review-experiment.next-session.md) | codex / GPT-5 / Lupin herds Bark / closeout owner — full pause handoff, mixed-index state and failed attachment captured / 2026-07-16 ← Zephyr turns Crosswind / terminal handoff / 2026-07-16 |
| `itf-knowledge-graph-spike` | The Inclusive Teaching Framework (Ambition Institute 2026) as a knowledge graph in the graph-corpus design grammar — a candidate data source. Spike COMPLETE, preserved on draft [PR #401](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/401) (HOLD: the owner's TS-promotion gate); knowledge surfaces conserved on main 2026-07-17. | [record](threads/paused/itf-knowledge-graph-spike.next-session.md) | claude-code / claude-fable-5 / Fern spins Taproot / implementer (solo) — spike landed, full preservation set + closeout / 2026-07-07 |
| `eef` | EEF graph-tooling rebuild — D0–D7 delivered & shipped (v1.16.0); D7 proof dropped as overkill (paused 2026-06-19) | [record][eef] | claude / Fable 5 / Thyme wakes Canopy / record-condensation / 2026-06-12 (prior identities, 30+ seats: thread record) |
| `data-sources-governance` | Author `docs/governance/DATA-SOURCES.md` (suitability / last-reviewed / removal criteria) — **owner-gated**: new governance policy, an owner decision, not agent-resolvable; gates the under-the-hood/explain user-exposure surface | [record](threads/data-sources-governance.next-session.md) | claude / Opus 4.8 / Ferret weaves Nightfall / thread-opener-brief-only / 2026-06-25 |
| `school-data-search` | Oak School Data Search service (POC MVP): deep review complete, build-ready (paused 2026-06-19) | [record][school-data-search] | claude / Opus 4.8 / Fiery Sparking Caldera / deep-review-and-refinement / 2026-06-04 (prior identities: thread record) |
| `semantic-search` | Search data foundations plus paused source-portable curriculum-exploration evidence and planning | [record][semantic-search] | codex / GPT-5 / Codex / reusable-curriculum-architecture search synthesis and closeout / 2026-07-15 |
| `oak-kg-ontology-planning-review` | Plan the `oak-kg`/ontology work via a deep review of the Oak Curriculum Ontology repo (opened, not started; paused 2026-06-19) | [record][oak-kg-ontology] | claude / Opus 4.8 / Twilit Cascading Supernova / thread-opener-brief-only / 2026-06-04 |
| `connecting-oak-resources` | Oak resource graph substrate plus queued source-integration workspaces and paused reusable-curriculum-architecture evidence | [record][connecting] | codex / GPT-5 / Leopard tracks Dewdrop / source-integration concept exploration, plan, and closeout / 2026-07-15 |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / Cycle 1 substrate capture / 2026-05-24 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 2026-05-10 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | claude-code / Fable 5 / Forge turns Basalt / dfe-data-sdk-seed-authoring / 2026-06-12 (prior: Squally / cursor / 2026-04-30) |
| `architectural-budget-system` | Cross-scale budgets; proposed report-only directory-concentration validator direction awaits owner ratification | [record][budget] | codex / GPT-5 / Spark seeks Pumice / concept exploration and handoff / 2026-07-15 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |
| `mcp-submission-drive` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. Formerly the Oak line's live priority thread: Oak's MCP app to public beta (publicised 2026-09-06), the Anthropic connector submission of 2026-08-07, landing target MCP-597. Detail in the record. | [record](threads/paused/mcp-submission-drive.next-session.md) | claude / claude-opus-5[1m] / Dormouse turns Footfall (a54547) / director — seated 2026-08-17 LATE evening at owner word, after Skunk stirs Cavern (db8b9b) stood down 17:42Z; resumed 2026-08-18; PR #903/#902 CHANGES_REQUESTED blockers under cure / 2026-08-18 (seat chain: thread record) |
| `workspace-config-isolation` | PAUSED 2026-09-06 — no fork lane; identity row stale. Config-boundary cure lane (the workspace-config package, depcruise boundary rules under three owner rulings, the de-hatch arc, census todos); #836/#865 merged; the de-hatch and census todos are the pickup. | [record](threads/paused/workspace-config-isolation.next-session.md) | claude-code / claude-fable-5 / Wren calls Downdraft (6b29b5) / implementer — #865 closed out, seat closed at owner word / 2026-08-13 |
| `typescript-estate-consolidation-review` | PAUSED 2026-09-06 — no fork lane; identity row stale. Repo-architecture lane whose design was ratified 2026-08-19 on the Oak line (strategic node `toolkit-re-architecture`; the Toolkit Atlas five-change set); execution is not a lane on this line. | [record](threads/paused/typescript-estate-consolidation-review.next-session.md) | claude-code / claude-fable-5 / Poppy lifts Bark (d427b6) / repo-architecture lane — change set + strategic node ratified at owner cards 2026-08-19; claim closed at wrap, fresh pickup next / 2026-08-19 |
| `mcp-product-analytics` | PAUSED 2026-09-06 — fork ruling 2026-09-06: no Oak-surface access. Submission-blocking PostHog sink and MCP analytics integration; October public-beta governance is a separate gate | [record][mcp-analytics] | Cutter hunts Lagoon / codex / GPT-5 / active implementation custody ← Kite seeks Crosswind / handoff complete and retired / 2026-07-26 |
| `first-class-copilot-cli-practice` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. GitHub Copilot CLI as an equal first-class citizen of the Practice (identity, team join, hook policy, projections, comms and lifecycle, live proof); the CLI-only strategic and four delivery nodes owner-ratified; runtime gated on their replacement record. | [record](threads/paused/first-class-copilot-cli-practice.next-session.md) | codex / GPT-5 / Thistle holds Blossom (019f94) / replacement-plan implementer / 2026-07-24 ← copilot / gpt-5.6-sol / Thistle rides Canopy (494337) / design authority and live evidence author / 2026-07-24 |
| `mcp-agent-facing-content` | PAUSED 2026-09-06 — fork ruling 2026-09-06: no Oak-surface access. Audit + classified registry of repo-controlled content reaching MCP consumers (the effective agent prompt); distinct from `data-sources-governance` (DATA sources). Deliverables + lane history: thread record | [record](threads/paused/mcp-agent-facing-content.next-session.md) | codex / GPT-5 / Smelter rides Temper (019f9f) / implementer — MCP-103 phases (b)/(c), PR #582 shepherd / 2026-07-27 (chain: thread record) |
| `upstream-api-alignment` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. Realign SDK/MCP and bulk export to the evolving upstream Oak API by a repeatable observable process; the programmes-family instance on PR #291; the process graduated to a permanent runbook. | [record](threads/paused/upstream-api-alignment.next-session.md) | claude-code / claude-fable-5 / Birch holds Seedling (e48fe2) / implementer — the 2026-08-03 upstream update lane (MCP-462/463/464) / 2026-08-03 (chain: thread record) |
| `statusline-enhancements` | PAUSED 2026-09-06 — no fork lane; identity row stale. Claude Code statusline: Oak-mark, session-shape indicators, location rows and rate-limit gauges DELIVERED (2026-06-29, `708cd57fc`); the logo lane paused by the owner; future lanes and the branch state in the record. | [record][statusline] | claude / claude-fable-5 / Magma mends Sulphur / curator — record hygiene at the 2026-07-23 consolidation / 2026-07-23 ← Wyvern seeks Clinker / footer-PR-badge diagnostic / 2026-07-06 (earlier identities: thread record) |
| `agent-naming` | PAUSED 2026-09-06 — no fork lane; identity row stale. PDR-027 display-name derivation: versioned schema registry, session-hook identity surfaces, wordlist eras (v2 landed; v3 + era-pinning cure queued; v3 plan now cross-linked to the knowledge-distribution-substrate direction) | [record][agent-naming] | claude-code / claude-fable-5 / Moss calls Loam (79b433) / identity-lane implementer — MCP-457 + the MCP-145 visual-disambiguator slices all MERGED, both plans archived, LANE COMPLETE / 2026-08-02 (prior identities: thread record) |
| `agent-operability` | PAUSED 2026-09-06 — no fork lane; identity row stale. Agents operable in their own worktrees (launch-in-worktree as the identity→worktree→branch binding, worktree lifecycle, seat-in-the-brief); controlling plan owner-approved 2026-06-28; next: the cwd-confirmation smoke test, then Phase 1A. | [record][agent-operability] | claude / Opus 4.8 (1M) / Tuna stirs Fathom / thread-record orphan-fix + branch reconcile (no build) / 2026-07-01 |
| `strategy-and-plan-estate-holistic-review` | PAUSED 2026-09-06 — no fork lane; identity row stale. Planning-estate rewrite on a living idea-graph (ADR-200/201) with the plan-corpus REFOUNDING inserted first; gated on the restatement-remediation effort. The arc, Director chain, rulings and pickup state live in the record — read it FIRST. | [record](threads/paused/strategy-and-plan-estate-holistic-review.next-session.md) | claude-code / claude-fable-5 / Petrel calls Aether (d4f4b7) / AIP-126 implementer — full closeout / 2026-07-18 (full seat chain: thread record identity table) |
| `orientation-skills-family` | PAUSED 2026-09-06 — fork ruling 2026-09-06: no Oak-surface access. Teaching-surface family: a portable agentic-AI primer (lead-in) plus the **one** repo-bound orientation lens (`/oak-under-the-hood`) across the PDR-112 portability seam | [record][orientation] | claude-code / claude-fable-5 / Juniper holds Tendril (3dfd3b) / implementer — dev-facing guide arc, PRs #603 + #604 owner-merged / 2026-07-28 ← claude-code / Opus 4.8 (1M) / Clover mends Hedgerow / **reframe `/oak-explain`→`/oak-under-the-hood` + MCP pointer projection MERGED via PR #243 (`a0a85f60c`, 2026-06-27); ADR-202 + ADR-205. `oak-under-the-hood.plan.md` DONE→archive; MCP-surfaced discoverability follow-on owned by `current/mcp-tool-taxonomy-and-orientation.plan.md` (decision-incomplete, WS0 not started)** / 2026-06-28 (prior: Zenith lifts Firmament — unification `ca40d98ce`; Swordfish/Seal — reframe build; Skipper tracks Reef, Orbit rides Horizon, Bora lifts Downdraft) |
| `main-sonar-ai-profile-to-zero` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. Drive `main`'s Sonar AI quality-profile backlog to zero under the owner-ratified disposition bar (fix at source by default); Phases 1–3 + 5A merged, Phase 5B on PR #308; the next batches doctrine-first. Detail in the record. | [record][main-sonar-zero] | claude-code / claude-fable-5 / Katydid seeks Moonbeam / implementer — Phase 5B + the ADR-153 guard arc; PR #308 at the code-owner gate / 2026-07-06; Zenith wakes Perigee (8897eb) / curator — drift-guard follow-on noted in the record / 2026-07-06 (prior: Alder tracks Topsoil #242, Gull tracks Eyrie #246/#249, Junk tracks Moorings #223, Thyme lifts Compost, Aspen tracks Root) |
| `curriculum-hub-demo` | PAUSED 2026-09-06 — no fork lane; identity row stale. Reproduce the Oak Curriculum Hub from the Claude Design canonical export (DoD §A–J); build complete, MERGED 2026-07-06; the live remainder in §Current State and the record. | [record](threads/paused/curriculum-hub-demo.next-session.md) | claude-code / claude-fable-5 / Thyme weaves Hedgerow (762020) / MCP-372 hub-conformance carrier / 2026-07-30 (lane state on the design-system-integration record; prior cast: thread record) |
| `skills-estate-organisation` | PAUSED 2026-09-06 — fork ruling: no Oak-surface access. The standing agentic-skills-and-mechanisms lane; the skills-estate plan (WS0 reflection R1-adopted, rules reclassification ratified and landed); resume from the WS0 working record's last entry. | [record](threads/paused/skills-estate-organisation.next-session.md) | claude-code / claude-fable-5 / Skylark hunts Nimbus (e856d5) / skills-lane implementer — WS0 opened and ruled; #726 merged, #731 generator pair pending / 2026-08-03 |

## Next Safe Steps

### PICKUP for the next session — the dedicated consolidation continues (owner's word 2026-09-16)

The owner's priorities for it, verbatim, 2026-09-17: *"the priorities are drainable buffers to
EMPTY, then memory files to an optimised soft"*; *"Directives and other doctrine documents I am
less concerned about, and they need very careful analysis anyway"*; *"the goal is always to
preserve knowledge, never to move towards numerical targets"*.

Read `threads/continuity-memory-and-knowledge-flow.next-session.md` §"2026-09-16 — the owner's
dedicated consolidation session" first: it says what is written, what remains and in what order.
The board is `threads/estate-coordination.next-session.md` §"2026-09-19 11:30Z — the 2026-09-17
successor folded as #155".

1. the consolidation — IN PROGRESS on `coordination/2026-09-19-65a929`, cut from #155's merge
   (`SHA:65a929d9a`, 2026-09-19 11:30Z). #153 folded on 2026-09-17 (`SHA:b5b0e70cd`) at the
   owner's word, which opened Dynamo turns Temper's Oak integration slot; its successor carried
   the fold's records and folded as #155 a day past its DUE, when the owner's answer arrived.
   The directive pass over the twelve register entries runs in a fresh context on this
   branch (the owner's word, 2026-09-19, after the meter read 51 % of the 1M
   window; the plan and drafts are in the seat's machine-local handoff record), then the
   graduate-then-archive curation of the large memory files;
2. the remaining half of slice 1;
3. the still-owed items: the operator-profile follow-up PR, the owed-items records PR, and the seven
   local defects from the 1.181.3 sync. Two more belong with that work list. First, re-read the
   carried-code findings of #99 (1.179.0, three threads, no file of their own) and #127 (1.181.1,
   `.agent/reports/upstream-sync/upstream-report-draft-1.181.1-sync-2026-09-11.md`) under the
   peer-fork model, and add the true ones to the list; the cross-fork skill records that neither
   set has been re-read. Second, the names that still carry the withdrawn model: the
   `upstream-sync/` report directory and the `automation/upstream-carrier-*` branch prefix. The
   skill now defines "upstream" only as the Oak fork in its role as a sync source, and the 1.181.3
   list's header records that renaming is a separate change, not yet made. The owner's word
   (2026-09-17): rename both in one small lane with a link sweep, after the carrier #154 lands,
   since its machinery lanes and the carrier branch use the current prefix. A second small lane,
   from F-191: register the Opus 5 and Fable 5.1 window sizes in
   `agent-tools/src/session-metadata/window-registry.ts` so `session-metadata` reads this seat's
   context without a stand-in entry;
4. scheduled maintenance: TypeScript strictness to the owner's target set, after the
   jimcresswell.net strictness slices land. The direction was relayed 2026-09-16 by Cauldron herds
   Lustre; its full substance is in the estate-coordination record's §"2026-09-16 ~15:0xZ —
   COMPACTION BOUNDARY" item 5.

Resumed 2026-09-14 ~11:3xZ at the owner's word: PR #144 (the profile's
schema, validator and stable index pointer) merged by the front door as
`4540dec49`; engraph merged into the branch; PDR-141's amendments (the
contract, the `machine` kind, the optional git-synced root; then the sync
decisions 13 to 16) and the start-right and README updates landed. The
profile at `~/.practice/profile/` is the owner's private git repository,
pushed. The 2026-09-12 coordination branch folded to engraph as `7658a723a`
(PR #137, four review rounds, budget raised to three by the owner) and the
successor `coordination/2026-09-14-7658a7` was cut from that head. The
profile sync tool (`pnpm profile:sync pull` and `push`, the check's sync leg)
landed 2026-09-15 as #145 (`0f3168369`) and engraph is merged into the
coordination branch (`08ceb4668`); start-right §3a runs the pull ahead of the
check since `c9abf6ce9`, the first doctrine commit on `coordination/2026-09-15-4786ab`.

Landings of 2026-09-14 evening (the owner asleep from ~21:20Z): #143 merged as
`e474e883e` and #146 (the review-cost gate passes a sync push; the cost-model
defect the owner named when #145 sat settled but BEHIND-BASE with the gate
refusing its base update) as `048f377fa`; engraph folded into
`coordination/2026-09-14-7658a7` at `176291eb2`; the held buffer memory
deleted. #145 was then one push from landing, its cure `318a2ea21` (the IO
unit test out at the owner's word) held for the morning ruling on a rebudget;
it landed 2026-09-15 as `0f3168369` on the owner's raise. The estate-coordination thread record's 2026-09-14
LANDINGS entry carries the five pickups.

### Reliable Atoms workspace class — owner rulings recorded (2026-09-14; left uncommitted, then committed in `f24683337` the same day)

**Owner, 2026-09-17, verbatim:** "Reliable Atoms as a concept will be completely removed, this has
not happened yet, but it will, we have a replacement concept that is far more effective and
useful". Read what follows as the concept's standing record until that removal lands; do not
build on it, and do not name or infer the replacement concept from here.

An owner-directed docs-only session (Kinkajou binds Lair, e17ab4; no commit,
no push, no gates by the owner's word) left the 2026-09-14 rulings on the
working tree of the live coordination branch: the programme node's amendment
and bar element 10, the new delivery node `reliable-atoms-workspace-shape`,
the research note of the same date, ADR-166 §Amendment 2026-09-14, ADR-230's
new interpretation bullet, the foundations bundle's two binding sentences, the
July backlog child plan's supersession note, the paused budget thread record,
and the graph-and-queue node's new dependency. What the resuming seat does
with it: `git status` to see the set, `pnpm check:docs` and
`pnpm repo-validators:check` (the plan-corpus validator has not run on the
new node), then sweep it into the first commit of the estate-coordination
work under the commit skill. Deleting the unregistered
`max-files-per-dir` ESLint rule is the delivery node's first slice, a source
change with gates, not a docs sweep. The paused thread record carries the
full note; no existing core workspace is a reference for the class.

### Plans estate — superseded-node placement to re-true (2026-09-06)

A 2026-09-06 review round moved a superseded delivery node from `delivery/` into
`delivery/archive/` (commit `0058c2654`); the plans index (`.agent/plans/README.md`
§Layout, amended in `7e7dce9fa`) states the opposite placement — a superseded node keeps
its place and names its successor — and the node schema keeps `superseded` and
`archived` as distinct transitions. One of the two surfaces is re-trued at the next
plans-estate pass; until then the index is the stated authority.

### The 2026-09-02 fold landed — next at owner word (2026-09-02)

Status 2026-09-02 ~14:2xZ: step 1 done by Kiln (`ba7e37d78`); step 2 in flight as MCP-661
on `jimcresswell/mcp-661-split-delivery-plan` (the routed #915 review items ride the same
branch at owner word); step 3 follows at the owner's word.

1. Kiln holds Slag merges main into `handoff/jim-september` by semantic merge (the napkin
   is rotated there and appended on main: prove the drain lossless, carry the fold's two
   2026-08-19 tail blocks and the 23-line insertion across; repo-continuity by concept).
   DONE 2026-09-02 ~14:2xZ by merge commit on `handoff/jim-september`: the 156-line delta
   carried verbatim under a dated napkin heading and processed in the following commit;
   the patterns index regenerated over both sides' new pattern files.
2. The split delivery plan, authored at pickup as a self-contained repo artefact serving
   `toolkit-re-architecture`, with the extraction as the product: the MCP app and the
   Oak-leaf workspaces it needs (the search app included, owner ruling 2026-09-02) building
   in `oaknational/oak-open-curriculum-mcp` from registry dependencies alone; packages on the
   public `@oaknational` scope (code MIT, content OGL, Oak branding under Oak's usage
   guidelines); one release version per repo for now; the `oak-under-the-hood` content's
   home left open for the plan's author. The five rulings verbatim: the estate-coordination
   thread record §2026-09-02 FOLD LANDED.
3. Then the strategy and plan corpus made consistent and cohesive around that plan
   (`public-packages-release` re-homed as the node's release-mechanism child; the
   taxonomy-survey sketch archived; the census reframed as the migration map; the tango
   node's remaining stale references trued) — owner word 2026-09-02 ~14:0xZ: on the
   MCP-661 branch (PR #954, Finch calls Pinnacle's lane), not on `handoff/jim-september`.
4. `handoff/jim-september` (PR #951) READY 2026-09-02 ~14:5xZ: the napkin-only
   consolidation, the step-6a synthesis, the main merge with the fold's napkin delta
   processed, and the session's closeout records; all checks green; the owner merges.
   Any post-merge true-up rides #954 (owner word at the wrap). The 90-day Actions export
   (MCP-662) is local-only at owner word — `.agent/reference-local/` on the owner's
   machine, never tracked.

### The operating model (owner-set 2026-07-17) — standing; pickup authority is `director-handoff.md`

The 2026-07-17 cold-pickup queue that lived here is re-owned through the
Director records (its still-live items: the AIP-128/129/130 enforcement
tranche — owner rulings ride the tickets; the compressed v2 cycle,
owner-named critical path — inputs `pr-review-corpus-analysis-2026-07-16.md`
and the F8 report under `.agent/reports/restatement-audit/`; the refounding
restart at its gate; the cricket tally toward the flip). The dedicated
consolidation it queued ran 2026-07-23 (§0a below). The operating-model
paragraph below stays the standing doctrine reference it was.

**The operating model (owner-set 2026-07-17):** the primary checkout lives ON
`coordination/estate-2026-07` with ZERO dirty files; live fleet surfaces
(napkin, continuity, registers, ARC channels) are tracked and committed there;
canary keys stay gitignored (never-in-history); `.agent/state/collaboration/`
runtime incl. `handoffs/*` is gitignored (handoff records are MACHINE-LOCAL).
All PRs target `main`; after every merge, merge `origin/main` back into the
coordination branch and push. Estate roll-ups to main go via SHORT-LIVED
branches cut from the coordination tip (never a PR from the rolling branch —
the merged-PR bot-review treadmill; PR #405 109 threads vs cut-branch #408 at
5), deleted at merge; roll-up trigger is session close or owner word. Ordinary
ticket branches cut from `origin/main` in a worktree (the ticket's
`gitBranchName`), never from the coordination tip. Every push pays the full
pre-push gate (~4–6 min): batch cures, one push per adjudicated round.
Capture-branch hazard: marker-probe captured files against current main before
any merge (stale-capture-wins — see `distilled.md` 2026-07-17).

### Codex-to-Codex hook review — paused; explicit resume required (2026-07-16)

Read the [thread record](threads/paused/codex-to-codex-hook-review-experiment.next-session.md) before
touching the sibling feature worktree. Do not resume automatically. The reviewed reduced bundle and
the later unreviewed three-file hook attempt are separate decisions; config parsing and valid
fail-open output do not prove the nested reviewer ran. On explicit resume, first re-verify both
checkout states and diagnose the content-free `reviewer exit: 1`; only then review the new slice,
start a fresh trusted Codex session, and attempt one controlled `apply_patch`. (Durability trued
2026-07-17: the closeout and working-tree state ARE now preserved — commit `SHA:c4fae0b83` on
draft PR #403; activation remains unproven.)

### Source integration workspaces — ready, sequenced after the P0 audit (2026-07-15)

Evidence: the [`oak-integrations` report family](../../reports/oak-integrations/README.md).
Executable owner: the
[source integration workspaces plan](../../plans-backlog-2026-07/architecture-and-infrastructure/current/oak-source-integration-workspaces.plan.md)
(optional pinned source checkouts for OpenAPI/Castr/Ontology/Database-Tools;
public-root path complete when submodules absent). `ready-for-execution`,
sequenced after the P0 workspace layer-separation audit; the executor runs the
plan's blocking preflight first (source visibility, branch policy, npm scope,
vendor call shapes).

### Reusable curriculum architecture — evidence complete; promotion owner-directed (2026-07-15)

The [three-report family](../../reports/oak-reusable-curriculum-architecture/README.md)
and the future
[planning brief](../../plans-backlog-2026-07/connecting-oak-resources/reusable-curriculum-architecture/future/reusable-curriculum-architecture-planning.plan.md)
are the durable homes. `connecting-oak-resources` + `semantic-search` stay
paused; no implementation authorised — the next action is the brief's
owner-directed promotion trigger only.

### agent-tools architecture — plan authored; commit + standard deferred (2026-06-29)

`check-encoding` (the new permanent UTF-8/encoding scanner) is **verified-green on its own files**
(`pnpm encoding:check` 0 critical; type-check / lint / 1748 tests / knip / depcruise / prettier clean,
after removing 2 knip-flagged dead exports) and consistent with the `skills:check` precedent
(`pnpm encoding:check`, wired into `pnpm check` + pre-push; canonical `@oaknational/result`).
The deferred architectural excellence is now a strategic brief —
[`agent-tools-architecture-standard.plan.md`](../../plans-backlog-2026-07/agent-tooling/future/agent-tools-architecture-standard.plan.md)
(WS0 the execution-model fork → ADR + enforcement + encoding-engine→`packages/core` + the
where-supported Write/Edit hook + convergence) — with the analysis at
[`reports/agent-tools-encoding-guard-and-architecture-2026-06-29.md`](../../reports/agent-tools-encoding-guard-and-architecture-2026-06-29.md)
and Callisto's handoff at
[`reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md`](../../reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md).
Owner direction 2026-06-29: **working now, excellence later** — the standard is a dedicated future
session (promotion runs the plan's WS0 decision pass first). State trued
2026-07-23: the scanner is LANDED and wired (`pnpm encoding:check` in root
scripts; `corpus-analysis/` is committed code, the old WIP hold is gone); the
architectural standard remains the future brief.

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
[`agent-naming-schema-v3.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-naming-schema-v3.plan.md)
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
[`agent-experience-improvement.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-experience-improvement.plan.md)
(`current/`), evidence
[report](../../reports/agent-experience-cause-class-analysis-2026-06-21.md), doctrine PDR-111.
**WS-3 (F-41 path-safety) is DONE** (`b5408291d`+`c90150ffa`+`4fd640089`): `resolveCoordinationHome`
resolves the **primary checkout** via `git worktree list`, so any worktree seat shares one coordination
home. **Next safe step (owner-chosen 2026-06-22): WS-1 — the CLI-ergonomics conformance guard.** Execute
[`agent-tools-cli-ergonomics.plan.md`](../../plans-backlog-2026-07/agent-tooling/current/agent-tools-cli-ergonomics.plan.md)
from **Phase 0** (the convention-audit + scope-ratification gate) → WS6 (the PDR-055 cl.10 conformance
guard); retires the largest cause-class (~19 frictions, Class A). Subsequent AX items: **WS-4** (the
`frictions-register` drain validator that recomputes integrity against fs/git → **WS-6** disposition
ledger — the systemic spine); **WS-2** (watcher liveness + canonicalisation); **WS-3 B2** (the deferred
F-41 CLI tail).

### Agentic Mechanisms Discovery

1. Treat the parent plan
   [`agentic-mechanisms-discovery.plan.md`](../../plans-backlog-2026-07/discovery/future/agentic-mechanisms-discovery.plan.md)
   as the layer map for skills, MCP Server Cards, MCP runtime discovery, A2A,
   registry metadata, and generic AI discovery proposals.
2. Resume executable work from
   [`agent-readiness-discovery-hub.plan.md`](../../plans-backlog-2026-07/discovery/current/agent-readiness-discovery-hub.plan.md),
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
0a. **Deep-consolidation carried work (the only part a next curator needs).** The
   ordinary triggers govern when the next pass fires; there is no inherited debt
   beyond these named items:
   - **Comms-event rotation (`consolidate-docs` step 3a)** ran on the primary
     checkout on 2026-09-07 under the recorded 2026-08-14T06:16:28Z watermark
     and the provenance gate (heartbeats past 48 h by the harness; substantive
     events at or before the watermark by hand). Moves are facts about the
     checkout that ran them (PDR-094): recompute the live and archive counts
     before trusting them elsewhere. The 2026-08-14 → 2026-09-07 window's
     absorption sweep is not yet declared, so no newer watermark exists. Events
     younger than their class window are the live coordination stream and are
     never moved. The curator-disposition input-channel tooling gap rides the
     comms-watch-storage-redesign lane.
   - **`director-handoff.md` live-file curation LANDED 2026-09-08** (the
     Director's 2026-09-07 ruling): the live file keeps the Brief, the fold block
     and a live snapshot; every prior `CURRENT HANDOFF STATE` block is verbatim in
     `.agent/memory/operational/archive/director-handoff-current-handoff-state-2026-09-08.md`,
     so no binding owner word was drained. What remains is a bounded sitting over
     THAT archive: the ~42 numbered owner rulings its blocks mark binding each need
     a homed-or-not check (ruling by ruling against the rule, PDR or skill that
     should carry it); a successor sizes it by checking rulings 1–42 against their
     homes, and the archive stays as the literal record either way.
   - **The tiered-sight / multi-machine PDR candidate** (machine-local vs
     repo-bound state classes; the nothing-load-bearing-on-one-machine invariant;
     the standing pipeline replacing one-off rescue) is a doctrine seed on the
     Director's map, reconciling with PDR-094 / ADR-199 rather than duplicating
     them. Its substance is the comms-corpus discovery report §Tiered sight.
   - **Directive-file graduations** wait on a session with headroom under
     `directive-file-context-budget` (below 30% context); the two settled items and
     their homes are rows in `pending-graduations.md`.

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
4. **Practice Box dispositioned 2026-07-23 (owner card)** — see the
   §Current State inter-Practice bullet for the disposition. Still queued,
   owner-scoped: the dedicated cross-estate integration session for the
   resonance bundle's four design-shape offers (carried since 2026-09-17 in the
   AEE thread record's "Offered by resonance on 2026-07-08" block; proof-ladder claim-typing,
   refusals-list, posture-selection procedure, obligation-family) plus the
   earlier-noted recomputable-plan-state / worker-class / protocol-PDR
   candidates; a further PDR-117 host-indirection tightening landed
   2026-07-23 (the literal path removed from the portable body).

0d. **`~/.claude/plans` (machine-local, per-user) was triaged in full on 2026-08-14**:
   all 26 files then present were read and classified — 18 landed or superseded (homes
   verified at file:line), 7 foreign-estate (left in place; deletion is an owner call),
   1 valuable-unlanded whose two residues landed at `35d9bca74`. The per-file verdicts
   are conserved at the 2026-08-14 ~07:3xZ entry of
   `.agent/memory/active/archive/napkin-2026-09-02.md`. A later pass reads only files
   dated after 2026-08-14.

### Connecting-Oak / PR History

Before resuming paused graph-substrate work, re-check current PR, CI, Sonar,
CodeQL, active claims, commit queue, and git state. Do not rely on historical
issue counts in archived prose.

### MCP Test Estate + Observability Sinks (both DECISION-COMPLETE 2026-06-06)

Both plans are `🟢 DECISION-COMPLETE`, execution owner-scheduled. Neither has a
dedicated thread record yet — the session-level home is the § Current State entry +
this section; create a thread record when execution is scheduled.

1. **Test estate** —
   [`unified-mcp-server-test-harness.plan.md`](../../plans-backlog-2026-07/sdk-and-mcp-enhancements/current/unified-mcp-server-test-harness.plan.md):
   WS0 (built-server smoke harness) + WS3 (network-free e2e rebalance) are
   EEF-independent and executable now; WS1 (= EEF D7) is gated on EEF D6 landing.
   Cross-plan: sequence WS3's live-executor consolidation BEFORE the MCP slice of
   `no-io-test-boundary-and-di-recovery.plan.md` (collision risk, per the plan's
   §Cross-Plan Coordination).
2. **Observability sinks** —
   [`observability-sinks-decoupling.plan.md`](../../plans-backlog-2026-07/observability/current/observability-sinks-decoupling.plan.md):
   C1+C2 (atomic: forcing-function test + standalone OTel `NodeTracerProvider`, adds
   `@opentelemetry/sdk-trace-node` + amends ADR-171) → C2b (build the `SENTRY_MODE`
   bridge in env-resolution + reconcile the sink-enum) → C3 (migrate consumers) → C4
   (renames) → C5 (close). Execution gated on the relevant feature branch(es) merging.

## Open Owner-Decision Items

1. MCP product analytics has no open implementation-shape decision. MCP-63
   proceeds from the ratified plan on PR #568; the remaining owner-held decision
   is October public-beta enablement after MCP-173's evidence is complete.
2. Monorepo workspace topology is held by owner decision (2026-05-09) until after
   the graph MVP implementation tranche, unless the owner reopens it.
3. MCP launch-readiness: ratify the impact-first Stage 1–4 ladder (assessment report §8) →
   promote the launch-readiness-and-milestone-redefinition stub. K1–K3 keystones are ratified
   and absorbed by the strategy corpus.
4. External-facing capability corpus: decide source-of-truth topology and first-tranche scope
   — these gate Direction A `t0` / plugin-package `w0`
   ([`external-facing-capability-distribution.plan.md`](../../plans-backlog-2026-07/user-experience/educator-end-users/current/external-facing-capability-distribution.plan.md)).
5. Native-MCP-auth build-vs-buy: adopt / adopt-partial decision on the
   [spike](../../plans-backlog-2026-07/security-and-privacy/future/native-mcp-sdk-auth-build-vs-buy.md).
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
- Owner word 2026-09-03, in force until 2026-10-06: internal Oak systems are not accessed
  from this checkout ("we should not access any INTERNAL Oak systems, we will still access
  public services such as the curriculum api/downloads etc"). Private Oak GitHub
  repositories are internal systems under that word — a read of `oaknational/oak-skills`
  on 2026-09-05 was recorded as a mistake. The public upstream repository was the one
  permitted Oak repository read under that word until the owner's 2026-09-06 ruling
  (verbatim in `downstream-checkout-never-writes-upstream-surfaces`, which replaced the
  retired pr-target-is-engraph rule on 2026-09-08: "do not access the Oak repo without
  permission"),
  under which a read of the public upstream also needs owner permission first; the
  2026-09-06 ruling governs. The disconnection mechanics stay checkout-local.
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
  write-hook (shapes: `docs/governance/safety-and-security.md`
  §Machine-local paths).

[main-sonar-zero]: threads/paused/main-sonar-ai-profile-to-zero.next-session.md
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
[statusline]: threads/paused/statusline-enhancements.next-session.md
[agent-naming]: threads/paused/agent-naming.next-session.md
[agent-operability]: threads/paused/agent-operability.next-session.md
[orientation]: threads/paused/orientation-skills-family.next-session.md
