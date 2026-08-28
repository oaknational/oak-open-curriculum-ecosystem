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

- **MCP APP FIRST MAJOR RELEASE — THE PRIMARY LIVE EFFORT (2026-07-21→).**
  Canonical state lives in the first-major-release strategic plan (the
  owner-authored decisions register) on `main`, the Linear project, and
  [`director-handoff.md`](director-handoff.md) §CURRENT HANDOFF STATE — never
  this file. Unless its own line says otherwise, every other lane below is
  dormant or buffered behind this effort.

- **OPEN-SURFACE ZERO — active owner-PR merge drive (2026-08-11→).** PRs
  #745 and #746 are merged (`236a8e3437`, `9dbf78328c`); #839/#840 were
  correctly recomposed as atomic replacement #852, **merged 2026-08-11
  13:10:40Z (`52bfdfb4d`)** — fold correction. Resume at #805, then the
  owner-authored custodial pair #818/#819.
  #841 merged 2026-08-11 06:53Z, owner-merged (corrected at the fold); #816 was
  not added to this author-filtered slice. Exact custody, owner directions and failure learnings live in the
  tracked thread record
  [`threads/open-surface-zero.next-session.md`](threads/open-surface-zero.next-session.md). Deep consolidation
  status: due — a milestone closed and repeated correction patterns were
  captured; the terminal wrap deliberately did not open an unbounded curation pass.

- **TYPESCRIPT ESTATE CONSOLIDATION REVIEW — active, incomplete local
  measurement-foundation tranche (2026-08-02→).** The ratified review includes
  every tracked `.ts`/`.tsx` file, generated carriers, and the curriculum SDK,
  but no census, candidate, top-ten result, or proposal exists. Revision 2.6's
  validated configuration/classification fragment is the strongest approved
  boundary; secure identity is at a known red integration/type boundary,
  atomic publication is not re-proved after its split, and auxiliary Git reads
  are only a pure decision/transition. All implementation and review docs are
  uncommitted in the dedicated `typescript-estate-review-019fc3` worktree by
  owner direction. Read the [thread record](threads/typescript-estate-consolidation-review.next-session.md)
  before touching it. Deep consolidation status: not due — the plan remains
  active, its architectural framing already has permanent homes, and this
  handoff captured the session-scoped execution state.

- **RESTATEMENT REMEDIATION — gated lane; the settling gate for plan-corpus
  refounding.** Guiding plan (owner-approved):
  [`restatement-remediation.plan.md`](../../plans-backlog-2026-07/product-development-governance/active/restatement-remediation.plan.md)
  — pr-lifecycle hardening, the restatement-audit module + T3+U fleet,
  prevention validators; #390/#391 MERGED. Resume states and halts: the
  [thread record](threads/strategy-and-plan-estate-holistic-review.next-session.md).

- **PLAN-CORPUS / STRATEGY ESTATE — reshaped 2026-07-21/22.** The corpus reset
  executed and was owner-ruled an UNRATIFIED SKETCH (executed ≠ ratified);
  ADR-216 plan-node estate is the doctrine home (decisions register D23,
  2026-07-22). The refounding-era machinery (r1/S0/S1, freeze-recut gate) is
  superseded-pending-adjudication at the
  [thread record](threads/strategy-and-plan-estate-holistic-review.next-session.md)
  — read it and the decisions register FIRST; this row is a pointer.
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
- **MCP agent-facing content** — 716-item registry merged (#337/#338; MCP-103
  delta-refresh #476, 2026-07-22); research EXECUTION and the content-workspace
  build stay owner-gated — do not auto-start. Thread:
  [`mcp-agent-facing-content`](threads/mcp-agent-facing-content.next-session.md).
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
  integration session, owner-scoped).
- **Curriculum Hub — live remainder only** (merged 2026-07-06; detail in the
  [thread record](threads/curriculum-hub-demo.next-session.md)): §J
  owner-hosted deploy → fidelity-register judgments (14 findings) →
  follow-ups → retained-claims sweep → owner branch deletions. One system
  defect to graduate: `@oaknational/eslint-plugin-standards`
  configs.react/next crash under ESLint 10.
- **Upstream API alignment — live next** (detail in the
  [thread record](threads/upstream-api-alignment.next-session.md)): stale
  RED-gate note correction; the `bulk-types-schema-derivation` future plan;
  the MCP pagination-header P1 (ADR-shaped). NOTE 2026-07-23: MCP-130 landed
  the cached-schema pin (no build regenerates from the live API), but the
  committed generated types remain drifted against the live schema — the
  deliberate `pnpm sdk-codegen:refresh` against current upstream is
  regenerate-AND-fix work this lane owns at its next touch.
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
  WS0→WS4; 4 conversions landed. Resume from WS0 after the strategy work.
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
| `mcp-submission-drive` | **The estate's live priority thread.** Oak's MCP app to public beta, publicised 2026-09-06; the connector was submitted to Anthropic 2026-08-07 and the acceptance bar is a verified tag from them. Landing target **MCP-597** (re-point + enable production uptime monitor 1593267, prove checks ran). MCP-614's provider COMPARISON is answered — Pingdom takes AC1 at £0, do not re-run it — but MCP-614 itself is still `In Progress` and its blockedBy edge on MCP-597 is TRUE, pending the owner's Pingdom-interval and Sentry-plan answers. Owner availability is the governing constraint: MG away ~22-31 Aug, so anything needing him routes SAME-DAY, never batched | [record](threads/mcp-submission-drive.next-session.md) | claude / claude-opus-5[1m] / Dormouse turns Footfall (a54547) / director — seated 2026-08-17 LATE evening at owner word, after Skunk stirs Cavern (db8b9b) stood down 17:42Z; resumed 2026-08-18; PR #903/#902 CHANGES_REQUESTED blockers under cure / 2026-08-18 (seat chain: thread record) |
| `estate-coordination` | The Director lane's thread record (founded 2026-08-13 by the director-continuity-surface-redesign plan): journal, board, seat chain; director-handoff.md keeps only the role brief + live snapshot. MAKE-SAFE PAUSE at owner word 2026-08-13 — successor adopts claim a2286c53 via the readiness gate | [record](threads/estate-coordination.next-session.md) | claude-code / claude-fable-5 / Smith hunts Obsidian (e98f17) / Director — redesign S1/S2 landed, fold #884, make-safe pause / 2026-08-13 |
| `workspace-config-isolation` | Config-boundary cure lane: @oaknational/workspace-config package, depcruise boundary rules under the three owner rulings, de-hatch arc, census todos. #836/#865 merged; Bucket-1 successor work handed onward; de-hatch + census todos remain the lane's pickup | [record](threads/workspace-config-isolation.next-session.md) | claude-code / claude-fable-5 / Wren calls Downdraft (6b29b5) / implementer — #865 closed out, seat closed at owner word / 2026-08-13 |
| `open-surface-zero` | Oldest-first disposition and merging of Jim-owned open PRs; every feedback surface harvested, all checks green, then immediate merge | [record](threads/open-surface-zero.next-session.md) | codex / GPT-5 / Smith holds Temper (019fef) / executor — #745/#746/#852 merged / 2026-08-11 |
| `typescript-estate-consolidation-review` | Now the repo-architecture lane's thread: the owner's five-point toolkit brief (MCP-619) governs — baseline Atlas delivered 2026-08-17, survey programme cancelled at owner ruling (post-mortem in the survey report home); the original TS-review corpus remains live context for MCP-603 | [record](threads/typescript-estate-consolidation-review.next-session.md) | claude-code / claude-fable-5 / Poppy lifts Bark (d427b6) / repo-architecture lane — #889 merged + #905 cure round closed 2026-08-18; lane resumes at MCP-619 phase 2 per the record's resume order / 2026-08-18 |
| `mcp-product-analytics` | Submission-blocking PostHog sink and MCP analytics integration; October public-beta governance is a separate gate | [record][mcp-analytics] | Cutter hunts Lagoon / codex / GPT-5 / active implementation custody ← Kite seeks Crosswind / handoff complete and retired / 2026-07-26 |
| `first-class-copilot-cli-practice` | Make GitHub Copilot CLI running locally an equal first-class citizen of the canonical Practice: honest identity, deliberate team join, inherited-hook policy enforcement, supported instruction/skill/agent/MCP projections, local comms/lifecycle, and live proof. The CLI-only strategic and four delivery nodes are owner-ratified; runtime remains gated behind their replacement record landing. | [record](threads/first-class-copilot-cli-practice.next-session.md) | codex / GPT-5 / Thistle holds Blossom (019f94) / replacement-plan implementer / 2026-07-24 ← copilot / gpt-5.6-sol / Thistle rides Canopy (494337) / design authority and live evidence author / 2026-07-24 |
| `mcp-agent-facing-content` | Audit + classified registry of repo-controlled content reaching MCP consumers (the effective agent prompt); distinct from `data-sources-governance` (DATA sources). Deliverables + lane history: thread record | [record](threads/mcp-agent-facing-content.next-session.md) | codex / GPT-5 / Smelter rides Temper (019f9f) / implementer — MCP-103 phases (b)/(c), PR #582 shepherd / 2026-07-27 (chain: thread record) |
| `upstream-api-alignment` | Realign SDK/MCP (and bulk export) to the evolving upstream Oak API + a repeatable observable process. Programmes-family instance shipped on PR #291 (`merge=CLEAN`, awaiting owner merge); process graduated to a permanent runbook | [record](threads/upstream-api-alignment.next-session.md) | claude-code / claude-fable-5 / Birch holds Seedling (e48fe2) / implementer — the 2026-08-03 upstream update lane (MCP-462/463/464) / 2026-08-03 (chain: thread record) |
| `design-system-integration` | AIP-137: the Claude-Design-exported design system as a first-class integrated system (ADR-213 — repo home + studio seat, bidirectional sync); kit landing, four-theme contrast gate, hub migration (§6 slices), studio sync-back batch. Live lane state, owner rulings, and the fidelity register live in the thread record and the drive's handoff records. | [record](threads/design-system-integration.next-session.md) | claude-code / claude-fable-5 / Corsair hunts Surf (4d3282) / design-lane successor at owner word — standby, warm pause; activation gated on the ratified completion-plan node / 2026-08-02 (seat chain: thread record) |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation — the multi-lane doctrine/consolidation thread. Lane history lives in the thread record's sections and identity table; this row is the index pointer only (latest lane: the 2026-08-07/08 longitudinal step-6a archive synthesis, Nettle weaves Root 5cfa11 — COMPLETE and owner-approved; report + processed marker 2026-08-07 at `research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-08-07.md`; plan archived; MCP-531 Done). | [record][agentic] | claude-code / fable-5 / Nettle weaves Root (5cfa11) / implementer — longitudinal step-6a synthesis / 2026-08-08 (prior lanes: thread record) |
| `statusline-enhancements` | Claude Code statusline: Oak-mark + session-shape indicators (complete); **primary/worktree location rows + rate-limit gauges with reset countdowns DELIVERED 2026-06-29** (`708cd57fc`); logo lane PAUSED (owner). Future lanes: COLUMNS/LINES responsive layout, research-doc refresh, trace-log observability (deprioritized — root cause upstream). Branch divergence RESOLVED (stale local branches deleted; all on main). Detail: thread record | [record][statusline] | claude / claude-fable-5 / Magma mends Sulphur / curator — record hygiene at the 2026-07-23 consolidation / 2026-07-23 ← Wyvern seeks Clinker / footer-PR-badge diagnostic / 2026-07-06 (earlier identities: thread record) |
| `agent-naming` | PDR-027 display-name derivation: versioned schema registry, session-hook identity surfaces, wordlist eras (v2 landed; v3 + era-pinning cure queued; v3 plan now cross-linked to the knowledge-distribution-substrate direction) | [record][agent-naming] | claude-code / claude-fable-5 / Moss calls Loam (79b433) / identity-lane implementer — MCP-457 + the MCP-145 visual-disambiguator slices all MERGED, both plans archived, LANE COMPLETE / 2026-08-02 (prior identities: thread record) |
| `agent-operability` | Agents operable in their own worktrees: launch-in-worktree as the derived `(identity→worktree→branch)` binding, worktree lifecycle (create/build/draft-PR/cleanup), seat-in-the-brief. Member of the agent-team-operations cluster. **Controlling plan ready to build (owner-approved 2026-06-28); thread record stood up + branch/ground reconciled to post-merge reality (enablers committed on `docs/consolidations`) 2026-07-01.** Ground on `docs/consolidations`; next: cwd-confirmation smoke-test → Phase 1A. | [record][agent-operability] | claude / Opus 4.8 (1M) / Tuna stirs Fathom / thread-record orphan-fix + branch reconcile (no build) / 2026-07-01 |
| `strategy-and-plan-estate-holistic-review` | Planning-estate rewrite on a living idea-graph (ADR-200/201) with the owner-directed plan-corpus REFOUNDING inserted first; currently gated on the restatement-remediation effort (see §Current State). The full r1/S0/S1 arc, Director chain, rulings, and pickup state live in the thread record — read it FIRST; this row is the index pointer only (compacted 2026-07-20, dedicated consolidation: the arc narrative formerly in this cell is conserved in the thread record's dated sections and the napkin archive). | [record](threads/strategy-and-plan-estate-holistic-review.next-session.md) | claude-code / claude-fable-5 / Petrel calls Aether (d4f4b7) / AIP-126 implementer — full closeout / 2026-07-18 (full seat chain: thread record identity table) |
| `oak-slack-assistants` | Internal agentic Slack assistants over Oak's MCPs (Ask Oisín M1; future Ask Oak). 🟢 DECISION-COMPLETE, plan merged 2026-07-08; next: execute (WS-E1 parallel-safe first; WS9+ consumes owner-provisioned resources). Detail: [logging design record](../../research/outreach/slack-assistant-logging-observability-design.md) + thread record | [record](threads/oak-slack-assistants.next-session.md) | claude-code / claude-fable-5 / Salamander weaves Warmth (`4960fe`) / deep review — decision-complete rework / 2026-07-08 (chain: thread record) |
| `orientation-skills-family` | Teaching-surface family: a portable agentic-AI primer (lead-in) plus the **one** repo-bound orientation lens (`/oak-under-the-hood`) across the PDR-112 portability seam | [record][orientation] | claude-code / claude-fable-5 / Juniper holds Tendril (3dfd3b) / implementer — dev-facing guide arc, PRs #603 + #604 owner-merged / 2026-07-28 ← claude-code / Opus 4.8 (1M) / Clover mends Hedgerow / **reframe `/oak-explain`→`/oak-under-the-hood` + MCP pointer projection MERGED via PR #243 (`a0a85f60c`, 2026-06-27); ADR-202 + ADR-205. `oak-under-the-hood.plan.md` DONE→archive; MCP-surfaced discoverability follow-on owned by `current/mcp-tool-taxonomy-and-orientation.plan.md` (decision-incomplete, WS0 not started)** / 2026-06-28 (prior: Zenith lifts Firmament — unification `ca40d98ce`; Swordfish/Seal — reframe build; Skipper tracks Reef, Orbit rides Horizon, Bora lifts Downdraft) |
| `main-sonar-ai-profile-to-zero` | Drive `main`'s Sonar AI quality-profile backlog to **zero** under the owner-ratified disposition bar (fix at source is the default; ACCEPT only on a grounded site-specific tension; FP for true tool errors). Phases 1–3 + 5A MERGED (#242/#246/#249/#254/#255/#257); **Phase 5B on PR #308 (open, shepherding to owner merge)** — idiom residuals fixed, six ADR-153 guard sites rejected-as-incorrect with the ADR citation. Next batches doctrine-first: S7763/S7785/S6594/S7786 then Phase 4 design-MAJORs | [record][main-sonar-zero] | claude-code / claude-fable-5 / Katydid seeks Moonbeam / implementer — Phase 5B + the ADR-153 guard arc; PR #308 at the code-owner gate / 2026-07-06; Zenith wakes Perigee (8897eb) / curator — drift-guard follow-on noted in the record / 2026-07-06 (prior: Alder tracks Topsoil #242, Gull tracks Eyrie #246/#249, Junk tracks Moorings #223, Thyme lifts Compost, Aspen tracks Root) |
| `curriculum-hub-demo` | Reproduce the Oak Curriculum Hub from the Claude Design canonical export (all pages/components, visual-matched, two-search, DoD §A–J). Build complete, MERGED 2026-07-06; live remainder in §Current State + the thread record's Next safe step | [record](threads/curriculum-hub-demo.next-session.md) | claude-code / claude-fable-5 / Thyme weaves Hedgerow (762020) / MCP-372 hub-conformance carrier / 2026-07-30 (lane state on the design-system-integration record; prior cast: thread record) |
| `skills-estate-organisation` | The standing "agentic skills and related agentic mechanisms and levers" lane; first briefed work is the skills-estate plan (WS0 reflection ruled R1-adopted, rules reclassification ratified and landed). Movement structure and log live in the WS0 working record — resume from its last entry | [record](threads/skills-estate-organisation.next-session.md) | claude-code / claude-fable-5 / Skylark hunts Nimbus (e856d5) / skills-lane implementer — WS0 opened and ruled; #726 merged, #731 generator pair pending / 2026-08-03 |
| `continuity-memory-and-knowledge-flow` | Memory/context substrate (PDR-124 landed; the 2026-07-05 per-user buffer drain complete, plan archived). Thread quiescent — no queued next step; buffer lifecycle continues under `per-user-memory-is-a-buffer`; descendants belong to the strategy-and-plan-estate lane | [record](threads/continuity-memory-and-knowledge-flow.next-session.md) | claude / claude-fable-5 / Gull lifts Nimbus / consolidator — dedicated consolidation complete / 2026-08-07 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `agentic-mechanisms-discovery` | Web-based agent discovery mechanisms for Oak data and tools (moved from Active 2026-07-30 dedicated pass: no identity touch since 2026-06-08 across three consolidation flags; reactivation is owner-directed via §Next Safe Steps "Agentic Mechanisms Discovery") | [record][agentic-mechanisms-discovery] | claude / Opus 4.8 / Zephyrous Buffeting Falcon / skills-lane-relocated-to-educator-end-users / 2026-06-08 (prior identities: thread record) |
| `eslint-no-throw-result-migration` | Migrate every throw to Result (ADR-088); drive the ~1000 warnings to zero; promote the rule. RESHAPED (survey-first WS0→WS4, 4 conversions landed) and paused for the strategy thread per §Current State; the 382-warning agent-tools residue observed at #654's gate belongs here (moved from Active 2026-07-30 dedicated pass: no identity touch since 2026-06-19) | [record](threads/eslint-no-throw-result-migration.next-session.md) | claude / Opus 4.8 (1M) / Siren mends Rudder / execution — observability+graph-core+logger landed (`93beffcfe`,`304b68f8d`,`61bdbc3e4`) / 2026-06-19 (prior: Merlin spins Cirrus `1556b9191`; Vanilla weaves Undergrowth, plan-author) |
| `codex-to-codex-hook-review-experiment` | **PAUSED, PENDING.** Fresh-process lane RED on configured latency; disposable two-case PreToolUse mechanics correct; reviewed reduction partly staged but uncommitted. A later project-local hook attempt is unreviewed and not working (nested reviewer exits 1 behind fail-open allow); no current-session attachment, qualification, or activation; the working-tree state was subsequently preserved at `SHA:c4fae0b83` on draft PR #403 (2026-07-16 ~21:52Z preservation pass) | [record](threads/paused/codex-to-codex-hook-review-experiment.next-session.md) | codex / GPT-5 / Lupin herds Bark / closeout owner — full pause handoff, mixed-index state and failed attachment captured / 2026-07-16 ← Zephyr turns Crosswind / terminal handoff / 2026-07-16 |
| `itf-knowledge-graph-spike` | The Inclusive Teaching Framework (Ambition Institute 2026) processed into a knowledge graph in the graph-corpus design grammar — candidate data source. Spike COMPLETE, preserved on draft [PR #401](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/401) (HOLD: owner TS-promotion integration-pass gate — the sanctioned `.mjs` preservation scripts never merge as official code); knowledge surfaces conserved on main 2026-07-17 | [record](threads/paused/itf-knowledge-graph-spike.next-session.md) | claude-code / claude-fable-5 / Fern spins Taproot / implementer (solo) — spike landed, full preservation set + closeout / 2026-07-07 |
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

## Next Safe Steps

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
   - **Comms-event rotation (`consolidate-docs` step 3a) has not been run since
     2026-07-31.** Extraction is complete through the 2026-08-06 pass, so the
     outstanding act is the class-tiered archive-move itself, which must run with
     the watermark and provenance gates fresh — never blind. Events younger than
     their class window are the live coordination stream and are never moved. The
     curator-disposition input-channel tooling gap rides the
     comms-watch-storage-redesign lane.
   - **`director-handoff.md` curation is outstanding and is its own bounded
     sitting** (not a slice of a napkin pass). The file is ~1,430 lines and far
     past critical on every axis, which is a routing signal and never a licence to
     trim it. The work has a specific shape: its durable role doctrine has already
     graduated to PDR-117, so what remains is a stack of superseded `CURRENT
     HANDOFF STATE` blocks whose lane and roster state is explicitly historical but
     which carry ~42 numbered owner rulings marked binding. Each ruling needs a
     homed-or-not check before its block can drain — draining first would lose
     binding owner words, which is why fitness pressure must not drive it. A
     successor can size the work by checking rulings 1–42 against their homes.
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
   outbound bundle's four design-shape offers (proof-ladder claim-typing,
   refusals-list, posture-selection procedure, obligation-family) plus the
   earlier-noted recomputable-plan-state / worker-class / protocol-PDR
   candidates; a further PDR-117 host-indirection tightening landed
   2026-07-23 (the literal path removed from the portable body).

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

[main-sonar-zero]: threads/main-sonar-ai-profile-to-zero.next-session.md
[mcp-analytics]: threads/mcp-product-analytics.next-session.md
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
