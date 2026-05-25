# Agent Coordination and Collaboration Efficiency — Substrate Survey

**Date**: 2026-05-25
**Authoring session**: Mistbound Passing Candle (claude / claude-opus-4-7 / `e77243`)
**Branch at authoring**: `chore/post-pr-115-handoff-fiery`
**Status**: Survey / evidence map. Not decision-complete; not action-bearing on its own. Input to a subsequent ranking and planning pass in the same session.

## Why this document exists

Owner-directed survey across napkin, distilled, pending-graduations, existing plans, and recent comms records for all substance related to making collaboration and coordination between agents more efficient — including but not limited to teams of two agents (n=2).

The substrate has accumulated rapidly across the last three weeks (2026-05-02 through 2026-05-25). Multiple plans, two ratified PDRs, one drafted PDR, and three live pending-graduations shards now carry partially overlapping cure shapes. This document is the consolidated evidence map so the next step (option scoring + plan authoring) can run against a single surface rather than re-discovering ground.

The dominant artefacts that pre-existed this survey:

- **PDR-082 (Proposed, 2026-05-25)** — n=2 collaboration mode at `.agent/practice-core/decision-records/PDR-082-n2-collaboration-mode.md`. The durable home for the n=2 cure substance.
- **`pending-graduations/2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md`** — two `status: due` candidates (Coordination-as-precondition + n=2 over-coordination) captured under owner-direction trigger at session start.
- **`pending-graduations/2026-05-23-team-session-autonomy.md`** — Director-class autonomy primitives P1–P6 + heartbeat contract cures.
- **`pending-graduations/2026-05-25-misty-director-session-candidates.md`** — five Director-session candidates including heartbeats-as-infrastructure + Director-seat threshold.
- **`.agent/plans/agent-tooling/current/cost-of-collaboration.plan.md`** — the named home for the arc, owner direction *"lowering the cost of collaboration will increase the rate of innovation and advancement"* (2026-05-11).

## Owner directions in scope

Three standing directions land-mark this survey:

1. *"Lowering the cost of collaboration will increase the rate of innovation and advancement"* (2026-05-11). The single metric: **cost-per-coordination-event in agent-count-aware terms**.
2. *"Massively tighten coordination efficiency for teams of two agents, n=2"* (2026-05-25 ~15:03Z). The session-scoped catalyst for PDR-082.
3. *"The comms appear to be causing a MASSIVE overhead, is that true?"* (2026-05-25 ~15:06Z). Owner-as-measuring-instrument intervention that confirmed n=2 ceremony tax in real time.

Cross-cutting standing memory: *"Owner action is not a valid cure for anything"* — every owner-intervention cure points at a missing autonomy primitive. PDR-082 is the autonomy primitive for direction (3).

## Evidence by source

### Napkin (`.agent/memory/active/napkin.md`)

**Fiery Kindling Brazier retrospective (2026-05-25, post-PR-115)** — three PR-115 review comments sat unaddressed on origin for ~30 min during the marshal cycle. Cause: trivial fixes bundled with substantive coordinated work (ADR-184 amendment + curator-pass + retirement substrate). Net: ~4 min of fix work, ~25 min of coordination ceremony, ~4 min compaction tax.

Behaviour changes recorded:
- Decomposition default: verified + trivial + within standing authorisation → ship immediately as its own commit + push.
- Action-visibility test before bundling: is the bundle deferring an action's impact artefact (origin-visible commit, comment-marked-addressed, CI-trigger)? If yes, unbundle.
- CI-economy is not a marshal-unilateral lever: default to push-each-fix for speed.
- "Wait for peer's commit so we push together" is a question-shaped trap.

**Stormy Surfing Dock owner intervention (2026-05-25, same session)** — after ~20 min of verdict-standby, multiple `verdict-standby` / `amendment-review-standby` heartbeats consumed owner-visible task slots. Crossed the 5-idle-loop threshold and surfaced a standdown question; owner asked *"is that overhead massive?"*; confirmed yes; heartbeat cron cancelled mid-session; PDR-082 authored as the structural cure.

Two owner-intervention moments crystallised the pattern: *"owner action is not a cure → owner intervention is evidence of a missing autonomy primitive."* Stormy's note: "PDR-082 once ratified IS the autonomy primitive for n=2 over-coordination."

### Distilled (`.agent/memory/active/distilled.md`)

**Coordination role discipline (graduated from 2026-05-14 P8 team session)**:
- Roles emerge from live pressure, not from a fixed menu (controller, marshal, reviewer, implementer, scout, standby).
- Every role description must carry its handoff proof (Marshal = watching exact staged pathspecs and queue state; Reviewer = GO/BLOCK on a bounded slice plus focused-test evidence).
- Treat scout responses as input, not as permission.
- Pre-closeout sweep is a controller invariant: active claims, active commit queue, staged files, `git status --short`, shared comms, directed inbox.
- Closeout comms can perturb the closeout bundle.

**Commit-window operational sharpening**:
- `git:index/head` claim pattern syntax (bare path, no `git:` prefix).
- CLI flag-shape drift under coordination pressure — `comms inbox` rejects older `--thread` / `--agent-codename` / `--since-file`; `commit-queue` is top-level; check topic-specific help in every resumed session.
- Keep evidence outputs readable — do not collapse independent validations behind `&&`.
- Run formatting proof before the commit hook for new modules.

**Held pending validation — Hypothesis-Layer Routing for Multi-Agent Cures** — multi-agent collaboration cures route through `prompts/agentic-engineering/collaboration/{hypothesis.md, falsification-criteria.md, experiments.md}` before graduating to doctrine. Substrate validated at N=2; not yet at N≥3.

### Pending-graduations — the active shards

#### 1. `2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md`

Two candidates, both `status: due` (owner-direction-triggered):

**Coordination ceremony — decomposition discipline for marshal cycles**
- Failure mode: **Coordination-as-precondition**. Independent trivial fixes bundled with substantive coordinated work defer the trivial fixes' impact to the coordination timeline.
- Cure shape:
  1. Decomposition default rule → `.agent/rules/ship-independent-coordinate-dependent.md`.
  2. Action-visibility test before bundling.
  3. CI-economy is not a marshal-unilateral lever.
- Falsifiability: next mixed cycle, trivial fixes ship + push ≤5 min of verification, regardless of substantive-work coordination state.

**n=2 coordination efficiency** (partially graduated to PDR-082)
- Failure mode: **n=2 over-coordination**. n=2 is the smallest peer-pair case and should be the lightest coordination shape; instead carried full multi-agent ceremony designed for n≥3. Comms-event count grew as N (each fix gets broadcast + ack + sync) instead of O(1).
- Cure shape:
  1. n=2 minimal-coordination contract → SKILL `start-right-team` §1 amendment + ADR. Declare "I do X, you do Y" in ONE event. No ack-the-ack. No tree-green broadcast (peer polls git + active-claims directly).
  2. Independent-ship default for n=2. Sequencing only when files actually overlap.
  3. Direct git interaction beats comms-event coordination for n=2. Agents read each other's commit-queue intents directly.
  4. Communication budget: ≤3 inter-agent comms events per work-cycle (declaration + final-landing + closeout).
- Falsifiability: next n=2 session lands equivalent paired commits with ≤3 inter-agent comms events total (vs 6+ this cycle).
- Composes with: `peer-sidebar-beats-coordinator+helpers`, `coordinator-role-threshold`, PDR-082.

#### 2. `2026-05-23-team-session-autonomy.md`

Director-class autonomy primitives (most ≥3-agent in scope, all reduce ceremony at all team sizes):

- **First-out-closeout-owner self-election protocol** — four candidate shapes; current target is amend `start-right-team` §Closeout Contract.
- **Director ratification checklist + three-mode standby** (PDR-074, Candidate) — 6–7 per-moment + 4 periodic structural questions; standby modes (silent / substrate-work / routed-slice) with holding-reason articulation as Director obligation for >5 min standby.
- **P1 — pre-positioned routing logic** — every owner-decision-gated slice carries pre-positioned routing in the comms stream contingent on verdict shape; post-verdict moves become light-up of pre-existing intent.
- **P2 — owner-decision elision via substrate-resolution** — first question on a decision arrival: *can the team resolve via reviewer-dispatch, sidebar, or vote?* Substrate-resolution is attempted-and-evidenced, not silent.
- **P3 + P4 — standing-direction graduation + slice-routing self-selection** — paired primitives.
- **P5 — Director self-selection protocol** (CANDIDATE — no worked instance yet).
- **P6 — Director-routing-blockage-detection-and-cure** — hoarding-detection, ceremony-over-pragmatism detection, idle-misclassification cure.
- **Liveness heartbeat contract** (graduated 2026-05-25 to PDR-078 + ADR-186) — heartbeats at ≤3-min cadence; ≥10-min silence presumes retired with claim auto-rebalance.
- **Heartbeat-content mechanical state-binding** — cure for content-drift recurring failure mode.
- **Heartbeat-cron health-monitoring via watcher-staleness substrate**.
- **Ping-before-escalate Director discipline** — cross-check git + queue + DM before retirement-detection broadcast.

#### 3. `2026-05-25-misty-director-session-candidates.md`

Five candidates from the 2026-05-25 Misty Director session:

- **Heartbeats are infrastructure, not delivery** (owner critique 06:45Z; trigger has fired).
- **Heartbeat-content-drift / state-binding** (multi-session worked).
- **Emission-vs-absorption gap on broadcasts** (single-session worked; cross-session evidence needed).
- **Substrate-provenance discipline: skill-invocation is not owner-direction** (owner-disavowed 06:33Z).
- **Director-seat-on threshold (≥4 agents OR explicit owner direction)** — owner dissolved Director seat at 07:03Z in a 3-agent context.
- Deferred-pending second-session: *Coordination overhead-to-delivery ratio as first-class metric*; *Build-clean window breaks all team CLI invocations*.

#### 4. `2026-05-06-to-2026-05-21-legacy-backlog.md` (selected entries)

- **Multi-agent shared-checkout as distinct empirical class** (2026-05-21, Fiery + Foamy two-agent, instance 1) — `feedback_worktree_isolation_unreliable` is scoped to sub-agent worktree dispatch; shared-checkout multi-main-session is a distinct empirical class.
- **Coordinator role-label ontology residual** (2026-05-13) — do not graduate a fixed role-label ontology until N≥3 multi-agent sessions across ≥2 work-shape contexts.
- **Commit-window mutual mechanical verification + hook-output authority** (2026-05-13) — gatekeeper AND implementer both re-run gate immediately before `git commit`; hook output is authoritative.
- **Identity routing-tuple insufficient under shared Codex prefix** (P4 follow-on) — coordinator can't tell from claims surface alone whether three names = one session or three sessions; candidate cures: session-aware identity discipline, OR explicit "rename within session" comms-event class, OR richer claims surface aggregating by `session_id_prefix`.
- **Commit-boundary peer-pair governance refinements** — peer-pair review ≠ peer-pair commit authorship; queue intents are exact file-list contracts.
- **Collaboration tooling operator UX backlog** — `--active` discoverability; long-content `--body-file`/`--subject-file` (~3300-char `--body` shell argv corruption); protocol-position command reporting current intent/phase/next action.
- **Detached collaboration monitor lifecycle contract** — explicit owner/start/stop/expiry/owner-visible status.
- **Cyclical learning-loop maintenance is a full-time process even at N=2** (2026-05-05, owner quote) — substance about the loop accumulates alongside substance by the loop; scales superlinearly with N.
- **Housekeeping ownership at session-close** (P11 in N-agent hypothesis) — Orchestrator owns shared housekeeping when assigned; last-to-leave rule otherwise.

### PDR-082 — n=2 Collaboration Mode

`.agent/practice-core/decision-records/PDR-082-n2-collaboration-mode.md` — Proposed first-draft.

**Triggers** (conjunctive activation): exactly 2 active participants AND both visible in the same owner-chat surface AND no expected third-agent join.

**Stays at n=2** (substrate value independent of team size): identity preflight, all-channels comms watcher (only out-of-chat channel for cross-agent signals), claim opening on substantive source / doctrine edits, commit-queue intents, substantive cross-agent broadcasts (tree-green, push-landed, gate-state, merge-ready, blocker), mid-cycle retirement protocol, final-heartbeat-end + team-member closeout broadcasts.

**Drops at n=2** (substrate value below overhead at n=2): heartbeat cron (both agents), periodic heartbeat broadcasts, standby-state heartbeat broadcasts, directed events between the two agents (chat-relay via owner equivalent), team-cadence 120s sweep, multi-section team-start ceremony.

**Changes at n=2**:
- Liveness ≡ owner-chat responsiveness.
- Coordination surface ≡ owner-chat + minimal comms events.
- Cross-agent acknowledgement ≡ chat-relay or single observed event.

**Forbidden** (load-bearing constraint):
- Dropping retained substrate.
- Treating chat-visibility as substitute for cross-agent gate signals.
- Activating mode without verifying both conditions.

**Exits** atomically on third-agent join — full SKILL protocol re-activates immediately; joining agent runs full team-start; existing agents restart heartbeat cron + watcher.

**Marshal-singleton survives n=2** — only one agent runs `pnpm check` at a time; marshal is owner-directed at session-open.

**Three falsifiability assertions**: heartbeat overhead is disproportionate at n=2; chat-visibility safely replaces liveness substrate at n=2; third-agent join can re-activate full protocol atomically.

**Five open questions deferred to second instance**:
1. Relax team-start broadcast itself?
2. Different commit-queue cadence (shorter TTL because contention impossible)?
3. Interaction with curator lane (PDR-081)?
4. Default vs opt-in?
5. SKILL amendment shape — inline section in `start-right-team` vs sibling SKILL?

### Existing plans

#### `cost-of-collaboration.plan.md`

Single source of truth for agent-tools improvement work. Owner standing direction; single metric. Five load-bearing insights from the 2026-05-11 four-agent session:

1. Pre-commit gates scanning ambient tree, not staged, is the single load-bearing defect blocking every multi-agent protocol.
2. **Peer-pair sidebars beat coordinator+helpers for design.** Helpers are for parallel execution of decided work; design requires dialogue between comparable agents.
3. **Information density per turn > round-trip latency.** Coordination cost compounds geometrically with agent count, not linearly.
4. Coordination artefacts are tree-state mutations.
5. The advisory predictor is the protocol's weakest joint.

Plus a sixth from the gate-rebalance pass: quality checkpoints need different contracts at different trigger surfaces.

P-order status: P0 (pre-commit scope) ✅, P-Foundation (CLI overhaul) ✅, P1 (`comms direct`/`reply`) ✅, P2 (`comms watch`) ✅, P3 (commit-queue enforcement) ✅, P4 (identity disambiguation) ✅, P5 (unified comms format) ✅, P6 (coordination-artefact isolation) ⏳, P7 (async/sync mode awareness) ⏳, P8 (collaboration TUI) ⏳ (mid-implementation with reviewer-flagged gaps), P9 (rule/skill topology refinement) ⏳.

#### `multi-agent-collaboration-sidebar-and-escalation.plan.md` (IMPLEMENTED 2026-04-26)

**Phase transition observation**: two-agent / well-separated-thread parallel work was fine; three-agent / touching-thread parallel work crossed a threshold where async-only signalling stopped preventing collisions. Implemented sidebars (`sidebar_request`, `sidebar_message`, `sidebar_resolution`), escalation surface (`.agent/state/collaboration/escalations/`), joint-decision protocol.

Sidebars: mutually accepted; parallel topic-bound sidebars allowed; 30-min default timeout; advisory not blocking. Owner escalation only when peer agreement fails.

#### `multi-agent-collaboration-protocol.plan.md`

Design principle 1 (load-bearing): *Knowledge and communication, not mechanical refusals.* The protocol provides agents with information about each other's work and means to discuss overlap. It does not mechanically refuse entry to claimed areas. Every other principle is in service to this one.

Design principle 9: *Bootstrap fast-path.* Single-agent case pays no coordination overhead beyond reading the registry once. The same principle generalises to n=2.

#### `n-agent-collaboration-experiments.plan.md` (E1 CLOSED 2026-05-03; E6 next)

Framing pivot: cures these candidate points name should be treated as candidate amendments to a hypothesis under test, not as a design to ship. Hypotheses get falsification criteria and experiments; designs get specifications and defenders. Validated primitives graduate; falsified primitives are replaced or removed.

#### `start-right-team-singleton-lane-remediation.plan.md`

WS1 amendment landed: Register Presence template carries Intended boundary + Claim status; singleton-lane rendezvous rule added; role-labels-are-examples-not-doctrine. WS3 absorbs widening `comms watch` identity filter from `(agent_name, session_id_prefix)` to full PDR-027 tuple for multi-vendor self-echo protection.

#### Other relevant plans

- `comms-watch-storage-redesign.plan.md` — seen-state storage primitive redesign.
- `multi-agent-collaboration-protocol-concept-home-refinement.plan.md`.
- `collaboration-state-write-safety.plan.md`.
- `n-agent-collaboration-experiments.plan.md`.
- `human-composer-tui.plan.md` (mentioned in today's Hushed closeout) — operator TUI for the comms thread.
- `pdr-080-comms-log-care-phenotype.plan.md`.
- `agent-coordination-cli-ergonomics-and-request-correlation.plan.md` (future) — CLI ergonomics + request correlation.
- `cross-vendor-session-sidecars.plan.md` (future).

### Recent comms records (last 48h)

- `75eb893f` (Stormy closeout 15:49Z) — "protocol's overhead is non-linear in team size — heavy at n=2, justified at n≥4"; PDR-082 named as structural cure; owner-intervention-as-failure-mode-signal pattern.
- `5cfd4d7c` (Fiery retirement 15:50Z) — "two failure modes captured for structural cure: Coordination-as-precondition + n=2 over-coordination. Cure targets: rule + SKILL amendment + ADR (composes with Stormy's PDR-082)."
- `62b7839b` (Fiery → Stormy 15:09Z) — "comms-event-seen via watcher IS the ack" (n=2 cure pattern in flight, post-merge).
- `46dbd615` (Stormy heartbeat-end 15:49Z) — heartbeat cron cancelled mid-session per owner-direction at 15:06Z.
- `4a537d1e` (Hushed closeout 13:11Z) — `comms direct` CLI requires `--platform`/`--model`/`--active` flags that `--help` does not document; husky pre-commit chain has a sweep-into-staged behaviour.

## Cross-cutting themes

1. **Comms-event count growth, not agent count, is the cost driver at n=2.** PDR-082 + the Fiery candidate both name it as O(1) vs O(N) per fix.
2. **Owner-chat is the liveness substrate at n=2.** Heartbeats, standby broadcasts, directed events between the two agents, team-cadence sweeps all drop. Marshal-singleton, claim opening, commit-queue intents, substantive cross-agent broadcasts, all-channels watcher all stay.
3. **Bundling is the wrong default; decomposition is.** Independent trivial work should ship immediately; coordinated work bundles in parallel. The action-visibility test discriminates.
4. **Atomic mode-switching on team-size transitions.** A 2→3 transition must re-activate the full protocol atomically; never half-loaded.
5. **Phase transition is in touching threads, not agent count.** Two agents on well-separated threads is the easy case. Three agents whose threads touch is when async-only stops preventing collisions.
6. **Roles emerge from live pressure, not from a fixed menu.** Every role must carry its handoff proof artefact.
7. **Substrate at n=2 collapses but does not disappear.** Two-event ack-pairs collapse to one (or zero if owner relays). Comms retains canonical role for cross-session and N>2.
8. **Pre-positioned routing + substrate-resolution shrink owner-attention windows.**
9. **Information density per turn beats round-trip latency.** Coordination cost compounds geometrically with agent count.
10. **The autonomy-primitive test.** Every "X failed → owner directed Y → Y worked → Y is the cure" reframes as "X failed → autonomy substrate did not provide the primitive that would have produced Y → owner bridged the gap → bridge indicates missing primitive."

## Inventory of candidate actions

The actions below are *candidate cure shapes named by the substrate above*. They are not pre-ratified; they enter the ranking pass next. Numeric IDs are stable references for the plan document.

1. **PDR-082 second-instance validation** — run a second n=2 session under PDR-082 mode; confirm clean completion or surface refinement.
2. **`ship-independent-coordinate-dependent` rule authoring** — `.agent/rules/ship-independent-coordinate-dependent.md` codifying the decomposition default + action-visibility test + CI-economy non-lever.
3. **`start-right-team` SKILL §1 amendment for n=2 mode** — inline-section shape (PDR-082 first-draft favours inline over sibling SKILL).
4. **Action-visibility test embedded in commit / marshal skills** — fires before bundling decisions in `oak-commit` or marshal handoff moments.
5. **n=2 communication budget instrumentation** — agents emit a per-session count of inter-agent comms events; surfaces budget excess as observable signal.
6. **Substrate-resolution-first ratification (PDR-074 P2)** — first ratification question on decision arrival: *can the team resolve via reviewer-dispatch, sidebar, or vote?*
7. **Pre-positioned routing primitive (PDR-074 P1)** — every owner-decision-gated slice carries pre-positioned routing contingent on verdict shape.
8. **Heartbeats-are-infrastructure rule** — capture the Misty Director-session candidate; clarify what heartbeat substrate is not.
9. **Heartbeat-content mechanical state-binding** — heartbeat body derives from `active-claims.json` or single state file, not free-form prose.
10. **Director-seat-on threshold** — n≥4 OR explicit owner direction; not required at n=3 unless owner directs.
11. **Ping-before-escalate Director discipline rule** — cross-check git + queue + DM before retirement-detection broadcast.
12. **First-out-closeout-owner self-election protocol** — amend `start-right-team` §Closeout Contract.
13. **Three-mode standby model with holding-reason articulation** — amend `start-right-team` §3.
14. **`comms direct` flag-discoverability cure** — `--help` documents `--platform`/`--model`/`--active`.
15. **`--body-file` / `--subject-file` on comms verbs** — eliminate shell argv corruption class for long content.
16. **Protocol-position command** — `agent-tools status` or similar reporting current identity / intent / phase / next action.
17. **Coordination overhead-to-delivery ratio metric** — first-class observable counted per session.
18. **Identity routing tuple disambiguation for shared Codex prefix** — explicit "rename within session" comms-event class, OR claims-surface aggregation by `session_id_prefix`.
19. **Coordination-as-precondition decomposition test in marshal SKILL** — explicit unbundle prompt at marshal-cycle initiation.
20. **Multi-agent shared-checkout PDR / clarification of `feedback_worktree_isolation_unreliable`** — distinct empirical class for shared-checkout vs sub-agent worktree dispatch.
21. **`cost-of-collaboration` P6 (coordination-artefact isolation)** — isolate sidebars / canonical comms events / monitor telemetry from gate-visible repo state.
22. **`cost-of-collaboration` P7 (async/sync mode awareness)** — work-shape awareness to polling/watch cadence (sub-second for design, minutes for execution, hour+ for monitoring).
23. **`cost-of-collaboration` P8 acceptance close (live TUI + inactive visibility + strict validation)** — close the operator-visibility gate the reviewers flagged.
24. **`cost-of-collaboration` P9 (rule/skill topology refinement)** — two-tier topology of always-on rules + on-demand skills with falsifiable firing triggers.
25. **n=2-mode tests landed alongside SKILL amendment** — TDD pair audit; ratifies that the mode behaves as documented in a real session.
26. **Standing-direction graduation primitive (PDR-074 P3)** — Director actively identifies session-close substance worth graduating to standing rules.
27. **Slice-routing self-selection primitive (PDR-074 P4)** — Director broadcasts slice + substrate authority + fit criteria; agents self-elect.

## Open questions surfaced by this survey

These are not action items — they are decisions or evidence-gaps that the ranking pass and plan should answer or route.

1. **PDR-082 default vs opt-in?** (PDR-082 first-draft favours activation-on-trigger.) Open until second-instance evidence.
2. **PDR-082 SKILL amendment shape — inline section vs sibling SKILL?** (First-draft favours inline.)
3. **Does n=2 mode imply a different commit-queue TTL?** (Contention impossible at n=2.)
4. **How does n=2 mode interact with the curator lane (PDR-081) when one of the two agents is a curator?**
5. **Is the action-visibility test a rule, a SKILL amendment, or both?** The Fiery candidate names `.agent/rules/ship-independent-coordinate-dependent.md` as the target; the underlying discipline likely also lives in `oak-commit`.
6. **Coordinator role threshold — at what N does the coordinator role become expected default?** Existing memory: ≤3 peer collaboration default; ≥4 coordinator default. Misty candidate refines: Director-seat-on at ≥4 OR explicit owner direction.
7. **Should `cost-of-collaboration` P6/P7/P8/P9 sequence change in light of n=2 + Director substrate accumulation?** P8 in particular: a live operator TUI for n=2 is materially less load-bearing than for n≥4.
8. **Is the "atomic mode-switching on team-size transition" a single rule, or does it need its own primitive?** PDR-082 names it as a forbidden state ("half-loaded protocol") but does not specify the detection-and-cure mechanism.
9. **What is the structural cure for the husky pre-commit hook's sweep-into-staged behaviour observed by Hushed?** (Owner-flagged earlier: "pre-commit hook must gate staged-only — REJECTED"; the sweep is a different concern from full-tree gating.)
10. **Should the substrate-resolution-first ratification (PDR-074 P2) graduate to a rule, or stay as Director discipline only?** The principle generalises to any agent receiving an owner-decision arrival.

## What this document does not do

- Does not score the candidate actions. The ranking pass in the same session does that.
- Does not author a new plan or amend an existing one. The plan-authoring pass in the same session does that.
- Does not commit to any cure shape, default, or sequence. Every item above is a candidate; ratification belongs to the plan + owner review.
- Does not duplicate doctrine. ADRs / PDRs / rules / skills / `directives/principles.md` remain authoritative for any item already named there.

## Downstream artefacts (added 2026-05-25 post-survey)

The ranking, reviewer dispatch, and metacognition passes that this survey
fed produced a sibling plan:

[`.agent/plans/agent-tooling/current/n2-and-coordination-efficiency-program-2026-05-25.plan.md`](../../plans/agent-tooling/current/n2-and-coordination-efficiency-program-2026-05-25.plan.md)

The plan's spine is the dependency graph, not the linear ranking the
user requested. The linear ranking is preserved in the plan's
Appendix A; the eight axes the linear ranking is structurally blind to
are captured in the plan's §"Why the linear ranking under-serves the
strategic question" + Appendix B. Reviewer findings from the
assumptions-expert + architecture-experts Betty/Fred/Wilma dispatch
have been verified and applied (or rejected with reason) before
landing in the plan.

The plan amends `cost-of-collaboration.plan.md` P-sequence by making
P9 (rule/skill topology refinement) the first move ahead of P6/P7.
