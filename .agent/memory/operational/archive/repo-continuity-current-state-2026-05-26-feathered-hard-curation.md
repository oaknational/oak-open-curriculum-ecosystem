# Repo Continuity Current State Archive - 2026-05-26 Feathered Hard Curation

Archived verbatim from `.agent/memory/operational/repo-continuity.md` during
Feathered Flying Cloud's hard memory curation pass. The live file now keeps a
compact operational index; this archive preserves the outgoing session-close
prose and detailed historical state.

## Current State

- **MCP analytics Path-to-GA Programme + substance amendments LANDED
  (2026-05-26)**: Stellar Glowing Satellite (claude / claude-opus-4-7 /
  `9a2967`) on `docs/agent-collaboration-enhancements`. One commit
  `09eda6f4` (`feat(plans): add MCP analytics exploration and Path-to-GA
  Programme`, 10 files, +1804/−8). Authored a new thin strategic-index plan
  collection at
  [`.agent/plans/curriculum-mcp-path-to-ga/roadmap.md`](../../plans/curriculum-mcp-path-to-ga/roadmap.md)
  sequencing M1 → M2 → M3 → GA across observability, security-and-privacy,
  sdk-and-mcp-enhancements, compliance, and architecture-and-infrastructure;
  §6 backlog enumerates five owner-direction-gated paperwork items
  (MCP analytics emission plan promotion; privacy gate plan; MCP `2026-07-28`
  upgrade plan; M4/GA milestone definition; Exploration 10 formal ruling
  backfill). Inbound links added at
  [`high-level-plan.md`](../../plans/high-level-plan.md) §"MCP Path-to-GA
  coordination" and [`milestones/README.md`](../../milestones/README.md).
  Committed the previously-untracked exploration
  [`2026-05-26-mcp-analytics-identity-and-event-emission.md`](../../../docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md).
  Five substance amendments landed under exploration §15's narrow deferral
  scope (events-workspace schema catalogue, high-level-observability
  Product-axis row, and `informs:` frontmatter remain untouched):
  what-the-system-emits-today (Product dependency_call gap + Sinks
  identity-envelope per-sink posture + correlation-envelope paragraph + Update
  Log), app observability.md (Correlation envelope fields subsection),
  three-sink brief (Correlation-join contract Decision row + envelope legend),
  cross-system-tracing (Carrier-to-envelope mapping in Implementation Sketch),
  sentry-max-mcp L-3 (cross-refs to exploration §7.5 + §7.2/§7.7). One plan
  deviation: L-7 amendment dropped (L-7 is about release/commit/deploy
  registration, not trace propagation). All pre-commit gates green (turbo
  90/90 full cache hit). Thread record at
  [`mcp-product-analytics`](threads/mcp-product-analytics.next-session.md)
  refreshed with Stellar identity row + landed-outcome summary; thread
  remains paused (sub-plan substance landed but A1–A5 backlog stays
  owner-gated).
- **Collaboration identity remediation Phase 0A + Phase 0B Cycle 1 LANDED
  (2026-05-26)**: Open Streaming Updraft (claude / claude-opus-4-7 / `357948`)
  delivered the doctrinal arc and the foundational schema cycle of the
  [`collaboration-identity-doctrine-enforcement-remediation.plan.md`](../../plans/agent-tooling/current/collaboration-identity-doctrine-enforcement-remediation.plan.md).
  Five commits on `docs/agent-collaboration-enhancements`:
  `76920493` plan v3 (3 reviewers + structural-map integrated; PDR-027
  amendment moved from Phase 2 to Phase 0A per PDR-076a §Decision
  conditional clause; UUID v5 derivation verdict committed; read/write
  schema split locked; `AgentRoutingKey` discriminated union locked),
  `7028b0d6` PDR-027 amendment (Amendment-Log entry + §Identity schema
  table + §Full identity block table + §The additive-identity rule body +
  §Why the identity key supersession note),
  `b0faefab` Phase 0A closeout,
  `3ca77972` metacog cure — owner-directed challenge to the 3-session
  framing produced a structural correction: replaced file-count framing
  with TDD-cycle decomposition (Phase 0B ~4 cycles, Phase 0C ~5 cycles,
  one focused implementer session for both), and
  `c11f698b` Phase 0B Cycle 1 (`UuidV5` branded type with v5 version-
  nibble refine; `collaborationAgentIdSchema` read-side with optional
  `id`; `collaborationAgentIdWriteSchema` write-side with required `id`;
  7 new tests, 671/671 green). Phase 0A + Phase 0B Cycle 1 demonstrated
  the metacog cure in the same session (corrected framing → executed
  inside the corrected framing). **Next safe step**: next session picks
  up Phase 0B Cycles 2–4 (`deriveCollaborationIdentity` returns
  `CollaborationAgentIdWrite` with derived UUID v5;
  `parseAgentId` → `collaborationAgentIdSchema.parse()`; JSON schemas
  accept optional `id` in `agent_id` `$def`), then Phase 0C all 5 cycles
  (`AgentRoutingKey` discriminated union; classifiers + `assertSameAgent`
  prefer id; `--to-id`; legacy-fallback diagnostic). Design fully locked
  in plan body — implementer needs no further deliberation.
- **MCP product analytics design session COMPLETE (2026-05-26)**: Glassy
  Flowing Stern (cursor / composer / `de55d6`) closed a sole-contributor
  exploration lane. Authoritative record:
  [`docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md`](../../docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md).
  Confirmed no host conversation session ID in Oak MCP code; mapped Clerk
  identity, per-sink projection, Stage 1 eight-event catalogue, and M2/M3
  milestone placement. Owner decisions in exploration §1.1; execution plan
  **deferred** until Jim requests promotion. New paused thread:
  [`mcp-product-analytics`](threads/mcp-product-analytics.next-session.md).
  Exploration file remains **untracked** at handoff — owner to commit when
  ready. Consolidation gate for this session: **not due** (no plan closed;
  napkin under rotation threshold; open-questions register below ten); owner
  requested lightweight consolidate-docs pass documented under Deep
  Consolidation Status.
- **Thermal Swooping Wing curation closeout COMPLETE (2026-05-26)**:
  owner approved both remaining live due principle routes, and they
  graduated through `oak-consolidate-docs` into accepted PDR homes:
  [PDR-083](../../practice-core/decision-records/PDR-083-director-pure-direction-only-boundary.md)
  (`Director Pure-Direction-Only Boundary`) and
  [PDR-084](../../practice-core/decision-records/PDR-084-owner-action-is-not-a-cure.md)
  (`Owner Action Is Not a Cure`). Updated the PDR README index,
  [`practice-index.md`](../../practice-index.md), the active
  pending-graduations register, and napkin disposition. The live due
  body in `pending-graduations.md` is now 0 entries; the two graduated
  pointers remain only as short-lived audit history until the next
  processed-register archive pass. Validation: targeted markdownlint
  on touched docs, `git diff --check`, and `pnpm practice:fitness
  --strict-hard` passed; fitness remains SOFT with hard=0 and
  critical=0. Final `pnpm check` passed green at handoff closeout.
  No Thermal active claim exists to close.
  Commit ownership changed during closeout: Starless was first notified
  to include the route approval edits, then owner directed that they
  will commit; a corrective directed event was sent to Starless. Current
  PDR-route bundle is staged in the git index for owner commit.
- **n=2-coordination-efficiency-program COMPLETE (2026-05-26)**: executed by
  Starless Dimming Owl (claude / `781369`) on
  `docs/agent-collaboration-enhancements`. Four commits pushed:
  curator-handoff `d3b1f75d` (landed Thermal Swooping Wing's
  uncommitted curator-pass residue under Starless attribution per
  owner direction), WS0 `3c3e01d3` (three new rules:
  `new-rule-vs-pdr-clause`, `comms-all-channels-watcher`,
  `liveness-heartbeat-cron`; 9 platform forwarders; SKILL §0/§0.5
  thinned to First Moves pointer-only; mode-selection block added at
  SKILL top; RULES_INDEX three-column classification table; 6-test
  validation suite), WS1 `3360dfb0` (NarrativeCommsEvent
  addressed_to/audience widened to CollaborationAgentId tuple;
  classifyNarrative routes by session_id_prefix; legacy migration
  shim with stderr warning; anonymous-detection primary discriminator
  reordered; 5 collision regression tests), WS4 `4f1e6faf` (SKILL
  cross-references: ping-before-escalate.md observer-side symmetry
  clause + two stale §0.5 anchor cures via heartbeat-cron rule
  links). Plan archived to `archive/completed/` in the closeout
  commit. Eight reviewers dispatched across the three workstreams
  (Fred + Betty + docs-adr + assumptions for WS0; code-expert +
  type-expert + test-expert for WS1; docs-adr for WS4); all MUST-FIXes
  applied; deferred SHOULD-FIXes documented in WS1 commit body
  (schema-duplication consolidation; diagnosticWriter DI for legacy
  migration warning). SKILL hit ≤700 absolute target exactly. The
  combined `wc -l` acceptance bar was ruled wrong-proxy by
  assumptions-expert per plan §Risks delegation; corrected
  per-mode load delta documented in WS0 commit body
  (sole-contributor: −157 lines net; team-member: ~+30–50 framing
  overhead on previously-loading content). `pnpm check` green at
  every commit; 213/213 collaboration-state tests pass post-WS1.
  Active claims at retirement: clean (all four session claims
  closed in their respective commits per residue exception).
- **Prismatic closeout (2026-05-25)**: owner-requested `distilled.md`
  processing, session-handoff, and consolidate-docs pass completed in the
  working tree. `distilled.md` is now a curated-learning register with a
  durable graduation audit; settled lessons were moved to the gates skill,
  build-system docs, commit skill, continuity-practice, AGENT evidence-command
  guidance, and agent-tools README. `practice:fitness` and friends now print
  ready-empty, healthy, soft, hard, and critical inventories; the later
  metacognition correction added `fitness_content_role`, so ready-empty applies
  only to drainable buffers, not directives or other reference surfaces.
  ADR-144 records that axis. Targeted tests, type-check, eslint, markdownlint,
  diff checks, and practice-fitness gates passed; full repo-wide check remains
  blocked by active peer-owned hook-policy lint work outside Prismatic's bundle.
- **n=2 enforcement bundle Cycle 1: COMPLETE (2026-05-26T07:30Z)**: executed by
  Feathered Winging Cliff (`57e615`) + Torrid Firing Spark (`5054f8`).
  **8 commits pushed to origin** on `docs/agent-collaboration-enhancements`:
  A1 `97f06e16` (typed-origin heartbeat gate, Feathered), E1 `499518ce`
  (hook-policy 5-module extraction, Torrid), B1 `ecc1e834` (menu-framing
  scoped_blocks, Torrid), B3 `29ebda41` (ping-before-escalate rule, Torrid),
  E2 `4984d771` (barrel-trim knip cure, Torrid), B2 `66e77d73` (CLI
  body-length gate ≤1500 chars on `--body` argv across all four comms verbs,
  Torrid), E3 `69b50937` (zoneGlyph export drop, knip 1→0, Torrid cross-lane
  takeover), and owner consolidation `bfbc39f3` (`docs: memory refinements`, 219
  files including Prismatic's stranded practice-fitness WIP, `.agent/*` drift,
  170-plus session comms events, handoff records, and Q-004). One Torrid
  consistency-fix commit `83c79fa6` (`fix(practice-fitness): per-file detail
  uses inventoryGlyph`) is local-only at retirement, awaiting Feathered/owner push.
  All `pnpm check` rounds green (90/90 turbo); 652/652 tests pass. Knip clean.
  Active claims at retirement: Feathered `c89bcb0c-da42-4b5e-843a-fc2be11d830d`
  remains open (cron-driven heartbeats still firing but main loop appears
  inactive post-resume; diagnostic candidate for graduation); Torrid
  `2f6d1d40-c3f8-4d78-b604-bfd8bebb7157` closing as part of this handoff.
- **Plan body rewritten 2026-05-26 (Feathered, fd951164)**: scoped down to
  three remaining items only — WS0 (rule corpus + SKILL topology
  refinement), WS1 #4 (identity routing-tuple disambiguation by
  session_id_prefix), WS4 (SKILL cross-references for landed rules). Linear
  order; decision-complete; no follow-on session invention. Owner audit
  triggered the rewrite: prior amendment introduced unratified "Cycle 1 /
  Cycle 2" framing (Cycle 2 was three already-existing workstreams with no
  new substance) and accumulated retrospective content already routed to
  other surfaces. New plan at
  [`n2-and-coordination-efficiency-program-2026-05-25.plan.md`](../../plans/agent-tooling/current/n2-and-coordination-efficiency-program-2026-05-25.plan.md)
  (209 lines, down from 700+). Cycle-2 invention mistake captured in
  `.agent/memory/active/napkin.md` and per-user memory
  `feedback_no_unauthorised_scope_invention_in_plans`.
- **Graduation pipeline candidates surfaced by Cycle 1**: pre-pose AskUserQuestion
  viability check (extends `present-verdicts-not-menus.md`); cross-lane structural
  blocking of commits (1st instance, captures for PDR-026 second-instance);
  bundle scope-discovery as normal; PDR-063 worked under bundle load; A1 cure
  validates itself by running; B1 self-fires on plan-body content; first-broadcast-establishes-context
  as deterministic tie-breaker. Routed to `pending-graduations.md` at session
  close.
- **Owner-affirmed discipline 2026-05-26**: *"if there are open decisions then
  you should surface them to me as questions, but only after reflecting on
  them through the LTAE lens"* + *"No open question survives LTAE [in this case].
  That is worth remembering."* — every decision shape LTAE-screened first;
  surface only what survives. Per-decision discipline, not blanket rule. Memory:
  `feedback_pre_pose_option_viability_check`.
- **Deep consolidation status (2026-05-25 Mistbound + Quiet)**: completed this
  handoff. Actions: (1) WS4 first move landed at `3ca71a40` — PDR-078 §5
  substrate-category amendment; (2) WS0 directed verdict landed at `04d5cefa`
  via LTAE applied to the inherited option-set ((b) struck as anti-shape; (a)
  standalone under-engineered; (c)+partial(a) directed); (3) Quiet
  Whispering Veil joined as knowledge-curation lane partner; homed dense
  Mistbound napkin entry to live shard
  [`pending-graduations/2026-05-25-mistbound-inherited-frame-and-hook-signal-candidates.md`](../active/pending-graduations/2026-05-25-mistbound-inherited-frame-and-hook-signal-candidates.md)
  with full substance preserved + 4-item disposition section; napkin replaced
  with disposition pointer; (4) thread record refreshed with this session's
  outcome + Mistbound + Quiet identity rows; (5) fitness routing per owner
  ignore-direction — Quiet's lane; not blocking. Owner-named rule
  integrated: NEVER compress findings reactively (buffer pressure routes to
  rotation/homing, never to finding-trimming).
- **`pnpm check` cleanliness gate (2026-05-25 Mistbound+Quiet)**: GREEN on
  every pre-commit chain across 6 commits (`4b69aab8`, `445bf0e1`, `3ca71a40`,
  `0d2f0dd8`, `93657434`, `04d5cefa`). Advisory orchestrator exit 1 on each
  cataloguing pre-existing SOFT-only fitness; no new violations introduced
  by any commit.
- **Current branch (2026-05-25 closeout)**:
  `docs/agent-collaboration-enhancements`. PR #116 merged into main at
  `7ef357a6` carrying the prior session's handoff substrate. This branch
  carries the WS4/WS0 work landed this session. Six commits pushed to
  `origin/docs/agent-collaboration-enhancements`. Remaining tree at closeout
  reflects Quiet's curation lane (napkin disposition, pending-graduations
  shard, multi-writer collaboration-state) bundled for commit in this
  consolidation pass.
- **WS4 first move landed (2026-05-25 Mistbound, commit `3ca71a40`)**: PDR-078
  amended with §5 "Substrate category: heartbeats are liveness
  infrastructure". Categorically distinguishes heartbeat substrate from
  delivery substrate; two new Forbids; fourth Falsifiability axis; Revision
  history. Worked-instance ratification fires opportunistically in a later
  session (next session that would have fired the failure mode does not).
- **WS0 directed verdict landed (2026-05-25 Mistbound, commit `04d5cefa`)**:
  (c) plus partial (a) — extract `start-right-team` §0 (Comms watcher) and
  §0.5 (Liveness heartbeat) into dedicated rule files via amendment-via-PDR-
  pointer pattern; keep short mode-selection front-matter at top of SKILL.
  Plan body §WS0 §Status changed PENDING-OWNER-VERDICT → DIRECTED 2026-05-25;
  §Blocked-by: nothing. WS0 substantive work cleared to open in a future
  session.
- **N=2 lane separation worked-instance (2026-05-25)**: Owner directed
  "Quiet handles knowledge curation; Mistbound ignores fitness functions"
  to enable substantive lane separation. Quiet self-elected inherited-tree
  gate-runner; ran fitness gates; routed HARD via rotation not compression
  (substance to shard). Mistbound continued plan/PDR lane independently.
  Owner-stated rule NEVER compress findings reactively integrated and
  honoured. Six commits pushed cleanly under separate intents; no
  cross-lane stomp despite multi-writer collaboration-state surfaces.
- **Prior session work (2026-05-25 Mistbound first session)**: Plan
  [`n2-and-coordination-efficiency-program-2026-05-25.plan.md`](../../plans/agent-tooling/current/n2-and-coordination-efficiency-program-2026-05-25.plan.md)
  landed at `4b69aab8` — 11 workstreams, dependency-graph spine
  (owner-ratified option (a)), linear ranking as Appendix A. Sibling to
  `cost-of-collaboration.plan.md`; P9 (rule/skill topology refinement)
  sequenced first ahead of P6/P7. Substrate input:
  [`agent-coordination-efficiency-survey-2026-05-25.md`](../../research/agentic-engineering/agent-coordination-efficiency-survey-2026-05-25.md).
- Previous branch: `main` after PR #115 merge (now folded into history via PR #116 merge `7ef357a6`).
- **PR #115 MERGED 2026-05-25T~15:09Z** at merge commit `9fa3a180` on `origin/main`.
  Two cycle commits landed: `3dd2c317` (Fiery marshal bundle covering Breezy
  curator-pass, PR-115 Copilot review fixes, Hearthlit retirement substrate, and
  coordination drain) and `46d96c88` (Stormy ADR-184 owner-as-author amendment plus
  HC-TUI plan refinement).
  All 6 CI gates green on merge; Copilot's re-flag of the UUID fix was stale auto-bot
  noise (file content verified fixed at HEAD).
- Current local HEAD on the merged branch: `46d96c88`. After fetch, `origin/main` is
  at `9fa3a180`.
- PR #114 merged at `77fcf746` (post-m1-attestation-tidy-up landing). PR #108
  merged earlier at `2462952a`. M1 + M2 milestones both achieved. Owner has
  explicitly pivoted back to graph work (2026-05-25).
- **Hardening-arc consolidation complete 2026-05-25; follow-up hardening
  commits stacked locally through `bec4b6ae`**. The original consolidation
  landed Phases 1+2+4+5+6 of the `harmonic-fluttering-bentley` plan; Phase 3
  (comms-event retention pass) stayed deferred under the standing direction
  below. Follow-ups refreshed live truth, strengthened
  `comms-watch-storage-redesign.plan.md`, backfilled PDR/ADR citations, and
  reflowed hard-width fitness lines.
- **NEW STANDING DIRECTION 2026-05-25 (binding until comms research plan
  completes)**: comms-file retention has been INCREASED (the previous 7-day
  rule no longer applies). **NO comms files are to be moved or deleted** until
  the comms research plan completes. The comms research plan lives on the
  `agent-collaboration-research` thread (currently owner-gated, buffered).
  Affects: all `.agent/state/collaboration/comms/` events; broadest-interpretation
  reading also affects `.agent/state/collaboration/comms-seen/` (the seen-state
  cursor substrate). Concrete consequence: WS3 of the new
  `comms-watch-storage-redesign.plan.md` is BLOCKED on this constraint
  clearing.
- **New plan promoted**:
  [`comms-watch-storage-redesign.plan.md`](../../plans/agent-tooling/current/comms-watch-storage-redesign.plan.md)
  in `agent-tooling/current/` — covers WS2 + WS3 of the comms-watch trilogy
  (WS1 landed at `75e47923` via tidy cycle 9). Strategic substance lifted
  verbatim from archived hardening program §P5.W1. Queued, not active.
- **Plans archived 2026-05-25** to
  [`agentic-engineering-enhancements/archive/completed/`](../../plans/agentic-engineering-enhancements/archive/completed/):
  `post-m1-attestation-tidy-up.plan.md` + `practice-infrastructure-hardening-program.plan.md`.
  Supersession mappings recorded in that directory's README per
  `consolidate-docs` plan-supersession discipline.
- Active claims at the 2026-05-25T14:44Z refresh: Stormy Surfing Dock owns
  agent-tooling plan/ADR files under claim
  `43a21f79-0660-4f3e-9b42-d2d43fd02f93`; Fiery Kindling Brazier owns
  `git:index/head` under claim `bad4d097-c488-4200-9464-58591cef6af1` for a
  marshal cycle that explicitly includes the Breezy curator bundle. Breezy
  Flowing Dock has no active claim. Active commit queue empty.
- Critical and hard fitness pressure is currently drained. Breezy's 2026-05-25
  closeout refresh recorded
  `pnpm practice:fitness:informational` and
  `pnpm practice:fitness --strict-hard` both exiting 0 with `SOFT (19 soft)`.
- Recent active napkin rotations are preserved under
  [`archive/`](../active/archive/). Breezy's 2026-05-25 rotation preserved the
  processed source window at
  [`napkin-2026-05-25-breezy-critical-hard-curation.md`](../active/archive/napkin-2026-05-25-breezy-critical-hard-curation.md)
  and started a fresh active napkin after routing live queue substance.
- Remaining consolidation pressure is tracked by
  [`memory-surface-critical-drain-2026-05-24.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-surface-critical-drain-2026-05-24.plan.md).
  Phase 2 and Phase 3 remain open for active-shard processing and distilled
  home-gap review; Phase 4 validates the hard/critical objective only.
- Unprocessed live queue bodies split out of `pending-graduations.md` now live
  in active shards under
  [`pending-graduations/`](pending-graduations/). These shards are not
  archives; process every entry before removing its live pointer.
- Historical Current State prose removed from this live index is preserved
  verbatim at
  [`repo-continuity-current-state-2026-05-24-shaded-silencing-dusk.md`](archive/repo-continuity-current-state-2026-05-24-shaded-silencing-dusk.md).
- The outgoing pre-Dusky soft-tier live file snapshot is preserved at
  [`repo-continuity-soft-tier-pre-dusky-2026-05-24.md`](archive/repo-continuity-soft-tier-pre-dusky-2026-05-24.md).
- Current working tree is dirty with Breezy's curator/handoff bundle, fresh
  collaboration-state events, and peer Stormy/Hearthlit/Fiery changes. Do not
  sweep peer-owned files into a Breezy commit if one is later requested; the
  live Fiery marshal claim owns the current git index/head window.
- New 2026-05-25 closeout addition (Briny Fathoming Dock `95a27b`, no
  implementation per owner direction):
  [`role-emission-citation-binding.plan.md`](../../plans/agentic-engineering-enhancements/current/role-emission-citation-binding.plan.md)
  landed in `current/` with full 6-reviewer pre-execution pass complete and
  consensus absorbed (path B narrowed v1: Director + Heartbeat-emitter
  required scope; ADR-188 status Proposed; lifecycle kind included;
  wilma's HIGH migration findings absorbed). DECISION-COMPLETE pending
  owner execution direction. Plan-tree discoverability updated in
  `current/README.md`. Session insights captured in napkin pending
  graduation (recursive meta-cure shape; doctrine-by-analogy
  self-instance; reviewer fan-out cost-imbalance lesson; status maturity
  inversion lesson). No owner execution direction yet.
- Thermal Buffeting Plume completed the Knowledge Curator role-substrate
  clarification and hard/critical fitness closeout. The role alias now points
  at the curator-pass lane, PDR-081, the curator-passes README, and
  start-right-team routing; the pass log is under
  [`2026-05-25-thermal-buffeting-plume.md`](curator-passes/2026-05-25-thermal-buffeting-plume.md).
- Breezy Flowing Dock completed the follow-up critical/hard memory curation
  slice. The active napkin is fresh, the main pending-graduations register is
  soft-only with a pointer to the new active shard, and the controlling
  critical-drain plan records the `SOFT (19 soft)` validation. No comms files
  were moved, deleted, or rotated.
