---
name: Multi-Agent Collaboration Protocol
overview: >
  Install the structural infrastructure for multiple agents working on the
  same repo without clashing. Anchored in directive renaming
  (collaboration → user-collaboration) and a new agent-collaboration
  directive. Sequenced incrementally so the smallest, highest-leverage
  pieces land first and real usage informs the design of later pieces.
todos:
  - id: ws0-directive-anchor
    content: WS0 — Rename collaboration → user-collaboration; create agent-collaboration directive; install the two foundational behavioural rules; sweep cross-references; install follow-agent-collaboration-practice rule.
    status: completed
    landed_at: 63c66c88
    landed_on: 2026-04-25
  - id: ws1-state-claims
    content: WS1 — Create .agent/state/ directory + collaboration claims registry with versioned JSON schema; add register-active-areas-at-session-open rule; document TTL/heartbeat/salvage lifecycle.
    status: completed
    landed_on: 2026-04-25
  - id: ws2-collaboration-memory
    content: WS2 — Create .agent/memory/collaboration/ memory class for durable collaboration lessons; graduate the parallel-track-pre-commit-gate-coupling pattern from the napkin as the founding entry.
    status: completed
    landed_on: 2026-04-25
  - id: ws3a-decision-thread-and-claim-history
    content: WS3A — Address evidence provision, protocol observability, durable claim-closure history, and a lightweight conversation / decision-thread surface.
    status: completed
    split_plan: multi-agent-collaboration-decision-thread-and-claim-history.plan.md
    split_on: 2026-04-26
    completed_on: 2026-04-26
    archived_plan: ../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md
    split_reason: >
      Owner-directed WS5 evidence harvest found that the evidence
      threshold appears met, but full sidebar implementation is not the
      right next automatic step. Execute the evidence/claim-history/
      decision-thread slice first.
  - id: ws3b-sidebar-and-escalation
    content: WS3B — Implement sidebar, timeout, and owner-escalation design as a separate sibling plan.
    status: completed
    split_plan: multi-agent-collaboration-sidebar-and-escalation.plan.md
    split_on: 2026-04-26
    completed_on: 2026-04-26
    completion_note: >
      Three-agent phase-transition evidence and owner direction satisfied
      the promotion gate on 2026-04-26. Implementation installed
      sidebar entries, escalation case files, workflow reporting, and
      joint-decision integration.
  - id: ws4-operational-integration
    content: WS4 — Wire session-open registration into start-right-quick / start-right-thorough; wire session-close cleanup into session-handoff; wire stale-claim garbage collection into consolidate-docs.
    status: completed
    completed_on: 2026-04-26
    completion_note: >
      Owner-approved narrow WS4A lifecycle integration pass completed:
      start-right now surfaces active claims plus WS3A decision threads;
      session-handoff now closes own claims and decision-thread
      participation; plan templates include lifecycle triggers and the
      simple-plan work-shape tier; Practice Core / ADR surfaces recognise
      collaboration state as first-class. WS3B later implemented
      sidebars, escalation, and joint-decision integration; hook-based
      reminders remain deferred.
  - id: ws5-observation-and-refine
    content: WS5 — Observe at least three real parallel sessions; capture lessons into .agent/memory/collaboration/; refine schema or directive based on real usage. Refinement amendments land as separate commits, not WS5 itself.
    status: paused-post-ws4a-observation-harvest
    paused_at: 2026-04-25
    pause_reason: >
      The original owner-directed WS5 evidence inspection completed on
      2026-04-26 and split WS3 into completed WS3A plus then-paused WS3B.
      WS4A was separately owner-authorised and completed the same day.
      Remaining WS5 scope is the post-WS4A observation / seed harvest:
      observe real sessions using the lifecycle-integrated protocol,
      then route any refinement as separate work.
---

# Multi-Agent Collaboration Protocol

## Status: WS4A + Commit-Window Refinement Complete; WS3B Implemented (2026-04-26)

WS0 (`63c66c88`), WS1 (`a5d33519`), and WS2 (`293742cd`) have landed.
WS3 has been split under owner direction after the WS5 evidence harvest:

- **WS3A** (complete, archived):
  [`multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
  owns evidence provision, protocol observability, durable claim-closure
  history, and a lightweight conversation / decision-thread surface.
  All WS3A slices closed on 2026-04-26 and the completed split plan now
  lives in
  [`../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md).
- **WS3B**:
  [`multi-agent-collaboration-sidebar-and-escalation.plan.md`](multi-agent-collaboration-sidebar-and-escalation.plan.md)
  implements sidebar, timeout, and owner-escalation design as a sibling
  plan. Its implementation also carried the owner-approved joint-agent
  decision protocol into the conversation schema and lifecycle workflows.

WS4 resumed under owner direction as a narrow lifecycle-integration pass
after WS3A completed. That pass is complete: start-right, session-handoff,
plan templates, Practice Core, and ADR-facing surfaces made WS0-WS3A
collaboration state part of the ordinary lifecycle. WS3B is now a later
completed implementation pass.

The 2026-04-26 owner-directed commit-window refinement is complete:
`git:index/head` is now a short-lived active-claim area before staging or
committing, and the commit skill closes the claim on success, failure, or
abort. The 2026-04-27 `2ccefad4` turn-race then showed that visibility is not
ordering. Queue-first follow-up completed in
[`intent-to-commit-queue.execution.plan.md`](../archive/completed/intent-to-commit-queue.execution.plan.md):
schema v1.3.0 adds an ordered advisory `commit_queue`, and the local
helper verifies staged file equality, staged fingerprint, and commit subject
before a commit is allowed to make history durable. The durable governance home
is now
[PDR-029 Family A Class A.3](../../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md);
`session_counter` remains future-only unless a real primitive lands in a later
owner-directed pass.

The collaboration substrate is cross-vendor by design. Its authoritative
surfaces are local portable Practice markdown, JSON state, rules, commands,
skills, and schemas readable by Claude Code, Codex, Cursor, and other capable
agents. Platform-specific wrappers may improve ergonomics, but they are
adapters around the portable substrate, not the collaboration authority. PDR-035
and ADR-165 now name the concept/phenotype split for this boundary.

WS5 remains **paused on owner direction**. The evidence surface has moved on
since the original 2026-04-25 pause: later shared-communication-log entries
record at least three real coordination events using the WS0 + WS1 surfaces,
including the Fresh Prince / Keen Dahl register-and-log exchange on
2026-04-25.

**Resumption gate**: at least three real parallel-session coordination
events using the WS0 + WS1 surfaces (shared communication log +
active-claims registry + register-active-areas tripwire). The gate was then
satisfied by the 2026-04-26 three-agent phase-transition evidence and owner
direction. It does not auto-implement WS3B or resume WS5.
Owner direction split WS3A out first, authorised the WS4A lifecycle
integration pass, and then supplied enough evidence for WS3B promotion.

**While paused, evidence accumulates passively** — every session on this
repo that uses the WS0/WS1 surfaces produces evidence. No active session
is needed to "wait."

**2026-04-27 WS5 evidence update**: Pelagic Washing Sail left Vining
Bending Root a targeted shared-log note about vocabulary-transition
TTL/examples. A later heartbeat found Vining had posted a waypoint and
acknowledged Pelagic's gate fixes, but had not visibly picked up that
targeted note. Treat this as evidence that the shared log is a durable
broadcast/discovery surface, not a delivery or acknowledgement protocol;
directed obligations belong in sidebars, decision threads,
acknowledgements, or queue mechanics.

**What resumes the plan**: owner direction after inspecting the evidence
threshold (3+ shared-communication-log entries OR claims OR documented
coordination decisions referencing each other). The gate fired and WS3B
implemented sidebars, escalation, and joint decisions. Future inspections
now feed WS5 harvest and refinement, not WS3B promotion.

**What remains pending under the gate**:

- WS3B — implemented; first real sidebar/joint-decision events still feed
  WS5 seed harvest.
- WS4A — lifecycle integration complete; any future hook reminder or
  dashboard expansion remains evidence-gated follow-up, not active scope.
- WS5 — the evidence-harvest workstream itself

If owner direction redirects effort to a different surface mid-pause, the
plan stays paused indefinitely; the resumption gate does not auto-fire.

## Context

Three observed instances of parallel-track gate clashes in roughly forty-eight
hours (Frodo on `validate-portability.mjs` 2026-04-24; Pippin's auto-staging
hooks 2026-04-24; Jazzy on `local-stub-env.unit.test.ts` 2026-04-25). Pattern
shape: full-repo pre-commit gates (prettier, knip, depcruise, type-check,
lint) couple commits across parallel agent sessions; one agent's WIP — most
acutely Phase 1 RED tests with deliberately-unresolved imports — breaks gates
against another agent's pristine staged work. The reactive discipline
("surface, don't fix or bypass, route to owner") is now well-recorded but
does not prevent recurrence.

The existing `.agent/directives/collaboration.md` is implicitly user-only:
every paragraph addresses agent↔owner working model, scope, feedback, and
onboarding. There is no settled protocol for agent↔agent communication, area
ownership, or conflict resolution. The proposal is to install one.

## Goals

1. Parallel agents on the same repo can work without clashing as the
   routine case, by *seeing* what each other is doing and *talking* about
   overlap when it matters. The protocol does not enforce; it informs.
2. Each landed slice is architecturally complete for what it covers; no
   intermediate state requires a later workstream to reach minimum
   correctness.
3. Each landed slice ships with both **mechanical acceptance** (verifiable
   at commit time) and an **operational seed** (a named question to be
   answered by observation in subsequent sessions). WS5 reframes from a
   one-time observation phase into a consolidation harvest of the seeds.
4. Real usage informs the decision-thread surface before it is
   crystallised, and later sidebar mechanics remain evidence-gated.
   The schemas at WS1/WS3A are starting points informed by observed
   usage of WS0's shared communication log. WS5's seeds drive
   refinement amendments as separate commits.
5. The directive rename + new directive + shared communication log lands as the
   foundation; every subsequent piece extends without rewriting prior
   slices.

## Design Principles (constrain all workstreams)

1. **Knowledge and communication, not mechanical refusals**. The protocol
   provides agents with *information* about each other's work and *means
   to discuss* overlap. It does not mechanically refuse entry to claimed
   areas. Mechanical refusals would be routed around at the cost of
   architectural excellence — agents would find ways to bypass the gate,
   producing a worse outcome than honest agent judgement informed by
   shared knowledge. This is the central design commitment, settled by
   owner direction 2026-04-25 in discussion of WS0/WS1 operational
   claims. **Every other principle in this list is in service to this
   one.**
2. **Platform independence is a core value and operating constraint**.
   The collaboration system must be able to operate fully from local portable
   Practice markdown, JSON, rules, commands, skills, hooks, and other surfaces
   that any capable agent system can read and write.
   Platform-native agent-team features may help build, inspect, or stress
   test this system, and platform-specific tools may feed lessons back into
   the local surfaces, but they are optional accelerants. They must never
   become operational dependencies, fallbacks, or replacements for the
   Practice protocol. Where a coordination behaviour can be platform agnostic,
   make it platform agnostic; use platform-specific affordances only behind
   adapters or as non-authoritative aids.
3. **Existing `collaboration.md` is implicitly user-only**. Renaming to
   `user-collaboration.md` and adding a sibling `agent-collaboration.md`
   names what is already implicit and creates symmetric room for the
   agent↔agent half. Every cross-reference to `collaboration.md` must be
   swept; the rename is a topology shift, not a relabel.
4. **Live coordination state is not durable memory**. Claims,
   decision threads, optional sidebar slots, heartbeats, and
   TTL-managed entries belong in
   `.agent/state/collaboration/` — JSON, ephemeral, signal-like
   (information about what is happening now). Cross-session lessons
   about agent-to-agent patterns belong in `.agent/memory/collaboration/`
   — markdown, durable, like other memory. These are separate from the
   start; collapsing them now means refactoring later when the lifecycle
   requirements diverge. Note the deliberate language shift from earlier
   drafts: state is *signal-like*, not *lock-like*. Locks would be
   enforcement; signals are information.
5. **Identity is already solved; liveness signals are the new piece**.
   PDR-027 covers identity additively across sessions. Liveness ("when
   was this agent last active here?") becomes a *freshness signal* on
   claims, not a lock-expiry mechanism. Stale claims are noise to be
   audited at consolidation, not blockers that strand other agents.
6. **Five primary communication channels plus owner questions exist; they
   have different shapes**. A file-backed owner-escalation surface is
   deferred to WS3B and exists only if that sibling plan promotes:
   - **Thread record `next-session.md`**: durable async (already in
     use). Narrative, per-thread, multi-session continuity.
   - **Shared communication log `state/collaboration/shared-comms-log.md`** (new at WS0): a
     schema-less append-only markdown surface. Discoverability primitive
     — agents leave notes for whoever reads next. Eventually consistent;
     not a synchronisation surface. Persists alongside structured
     surfaces in later WS as the free-form discussion log.
   - **Conversation / decision-thread file** (new at WS3A):
     structured per-topic file for live async exchange between agents
     on overlap topics that need more structure than the shared
     communication log.
   - **Sidebar** (deferred to WS3B): short-lived focused exchange, by
     mutual agreement, if decision-thread evidence proves async
     exchange is too slow. Not a blocking gate — agents may decline a
     sidebar request.
   - **Reviewer dispatch**: fork-blocking-rejoin within ONE agent's
     session (already in use; not part of this protocol but named in
     the directive so agents pick the right channel).
   - **Owner question via AskUserQuestion**: hard-blocking sync to
     human (already in use).
   The `agent-collaboration` directive names all channels and gives
   when-to-use-which guidance.
7. **Build-breakage rule cites, does not restate, the gate-recovery
   principle**. The active `gate-recovery-cadence.plan.md` names the
   non-negotiable: "build/type/lint/static-analysis must stay green even
   during TDD; RED is allowed only as intentional failing behavioural
   tests, not as missing imports, broken types, lint warnings, or build
   failures." The new behavioural rule cites that principle to prevent
   drift between the two surfaces. WS0 acceptance includes a
   bidirectional cross-reference validated at consolidate-docs (Wilma
   MINOR-10).
8. **Schema evolution is a day-one concern**. JSON schemas carry an
   explicit `schema_version` field from the first commit, and an
   explicit compatibility model: **additive-only schema evolution
   within a major version**. Agents read forward (a v1.0 agent reading
   a v1.1 file ignores fields it doesn't recognise; preserves them on
   write-back). Major-version mismatch causes the agent to bail out
   with an error pointing at the protocol upgrade. The model is named
   in the schema's `$comment` field and in `agent-collaboration.md`.
   (Wilma MAJOR-4.)
9. **Bootstrap fast-path**. Single-agent case (no other agents present
   in the registry) pays no coordination overhead beyond reading the
   registry once. The directive names a fast-path so solo sessions
   don't waste cycles on empty-registry coordination.
10. **Discoverability is structural**. "Don't operate in another agent's
   area without letting them know first" requires both a discovery
   surface and a registration discipline — without them, the rule is
   undiscoverable. The parallel is `register-identity-on-thread-join.md`:
   convert the convention from passive prose into an active session-open
   tripwire. The tripwire fires "do not proceed until you have consulted
   the surface and decided how to coordinate" — *not* "do not proceed
   if you find a claim." The substance of the decision is agent
   judgement.
11. **Sub-agent dispatch ≠ peer collaboration**. Reviewer sub-agents
    (docs-adr-reviewer, etc.) are fork-blocking-rejoin within ONE
    agent's session. Peer collaboration is asynchronous between
    independent sessions. The directive names the distinction so
    agents pick the right channel.
12. **Owner is the final tiebreaker, surfaced explicitly**. When peer
    discussion does not converge, escalation to owner is the explicit
    last move via a *named surface* (not a passive note in a
    decision-thread file hoping the owner reads it). WS3B names the
    escalation surface concretely if promoted. (Wilma MINOR-9.)
13. **Threat model: trusted agents only**. The protocol assumes agents
    follow the doctrine in good faith. Misbehaving agents (claiming
    excessive scope, never releasing claims, fabricating entries) are
    out of scope; the owner is responsible for detecting and resolving
    these cases at consolidation. If hostile-agent threat models become
    relevant, that is a future PDR; this plan does not preempt it.
    (Wilma MINOR-11, MINOR-12.)

## Non-Goals (Explicit)

- **No mechanical refusals**. Reading another agent's claim does not force
  refusal; it informs judgement. Rules fire as tripwires that demand
  *consultation and decision*, not *refusal*. This is the central design
  commitment per Design Principle 1 — restated here so the line is unmissable.
- **No retroactive rewriting of existing thread records, plans, or ADRs**.
  The collaboration protocol applies to new work; existing surfaces are
  swept only for the rename (WS0) and only for cross-reference correctness.
- **No new agent-management tooling at protocol-install time**. Agents read
  and write markdown + JSON files directly; no orchestrator, daemon, or
  per-platform binary. The pattern follows ADR-150's
  capture→distil→graduate→enforce pipeline: files first, code only when
  files prove the design. (See Follow-up Work for evidence-gated hooks.)
- **No platform-native agent-team dependency**. Platform-specific team or
  collaboration features may help build or test the protocol, but the
  protocol itself must remain operable from local portable Practice surfaces.
- **No threat model beyond trusted agents**. The protocol assumes agents
  follow the doctrine in good faith. Misbehaving agents are out of scope.
- **All agents work on the same branch**. Isolation is conventional
  (claims as signals, decision threads, and later sidebars only if
  promoted), and that is the only model under consideration in this plan.

## Workstreams

### WS0 — Directive Anchor + Shared Communication System (Foundation)

**Goal**: install the directive structure as the foundation, plus the
smallest possible communication primitive — an empty markdown log with no
schema other than "use this." Every later workstream references the new
`agent-collaboration.md` and the shared communication log; landing them
first means later WS extend without rewriting.

**Why the shared communication log lands at WS0, not WS1**: the
foundational behavioural rule *"don't operate in another agent's area
without letting them know first"* needs somewhere for the message to land.
Without a communication surface, the rule is unenforceable in any meaningful
sense — there is no "letting them know." The shared communication log is
the basic shared communication system: a markdown file in
`.agent/state/collaboration/` that any agent can append to. No schema, no
TTL, no structure beyond chronological appending. WS5 observation tells us
what structure agents actually use; WS1 and WS3A then crystallise the
schemas from observed usage rather than from first principles. This is
files-first / schema-later in its strictest form.

#### Tasks

1. **Rename the directive file** in a single atomic commit:
   `git mv .agent/directives/collaboration.md .agent/directives/user-collaboration.md`.
   No content change in this step — the rename precedes the rewrite to
   preserve `git log --follow` history.
2. **Sweep cross-references** to `collaboration.md` across the repo. Known
   surfaces (verified by grep at planning time):
   - `.agent/directives/AGENT.md` (Essential Links section)
   - `.agent/practice-index.md`
   - `.agent/experience/README.md`
   - `.agent/experience/2025-08-13-zod-validation-journey.md`
   - `.agent/research/agentic-engineering/reviewer-systems-and-discoverability/reviewer-system-and-review-operations.md`
   - `.agent/memory/active/napkin.md` (recent entries citing the
     directive)
   - `.agent/memory/active/distilled.md`
   - `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
   - `.agent/plans/archive/completed/collaboration.md`
   - `.agent/plans/agentic-engineering-enhancements/README.md`
   - `.agent/plans/agentic-engineering-enhancements/roadmap.md`
   - `.agent/plans/agentic-engineering-enhancements/evidence/2026-04-24-agent-entrypoint-content-homing-phase0-run-001.evidence.md`
   - `.agent/plans/agentic-engineering-enhancements/current/practice-and-process-structural-improvements.plan.md`
   - `.agent/rules/follow-collaboration-practice.md`

   Use a fresh `rg "collaboration\.md"` at execution time to catch any
   surfaces added since planning. Each updated reference becomes
   `user-collaboration.md` if the citation is about user-collaboration
   substance (the default — the existing directive is wholly
   user-collaboration); a small subset may need re-pointing to
   `agent-collaboration.md` if the citation is about peer protocols.
3. **Create the new `agent-collaboration.md` directive** with the
   following minimum contents (the file extends in WS1, WS3 — but lands
   complete for what it covers in WS0):

   - **Operational claim of WS0**: discoverability for sequential
     agents. Stated explicitly in the directive: "WS0 establishes the
     vocabulary and a discovery surface. It does not by itself prevent
     parallel-agent clashes; that is WS1's claim, building on this
     foundation."
   - **Knowledge and communication, not enforcement**: the directive
     names this commitment up front. "The protocol does not refuse
     entry to claimed areas. It surfaces what other agents are doing
     and provides means to discuss when overlap matters. Agents use
     judgement, informed by the surface, to coordinate."
   - **Working model**: dialogue between peers, not authority hierarchy.
     Constructive challenge, owner as final tiebreaker, scope discipline
     across agent boundaries (don't operate in another agent's area
     without consulting the surface and deciding how to coordinate;
     don't break the build unless you'll fix it soon — citing the
     gate-recovery-cadence principle verbatim).
   - **Communication channels and when to use each** (the channels named
     in the Design Principles): thread record, shared communication log,
     conversation / decision-thread file (forward reference to WS3A),
     sidebar (forward reference to gate-satisfied WS3B), reviewer
     dispatch, owner question.
   - **Identity vs liveness** distinction with forward references to
     PDR-027 (identity) and WS1 (liveness/claims).
   - **Bootstrap fast-path**: single-agent case skips claim-checking;
     full forward reference to WS1.
   - **Sub-agent dispatch is not peer collaboration**: explicit rule
     that reviewer sub-agents are inside one agent's session and do not
     count as peer collaboration.
   - **Conversations are first-class learning-loop inputs**: the shared
     communication log and (later) structured claims, decision-thread
     files, and any promoted sidebar transcripts are durable evidence
     alongside the napkin. Lessons captured from decision threads land
     as napkin observations
     just like any other lesson; refinement amendments to the protocol
     cite both napkin entries and conversation entries as evidence.
     This is the wiring explicitly named so future agents do not have
     to discover it.
   - The two foundational behavioural rules stated as load-bearing
     principles (the rule files themselves are created in this WS):

     a. *Don't break the build unless you're going to fix it soon* —
        cites `.agent/plans/observability/active/gate-recovery-cadence.plan.md`
        Section "Recovery Sequence" point 2 verbatim. WS0 acceptance
        validates a bidirectional cross-reference (rule ↔ plan) at
        consolidate-docs (Wilma MINOR-10).
     b. *Don't operate in another agent's area without consulting the
        surface and deciding how to coordinate* — defines "area"
        provisionally as: "any file path, plan, ADR, or workspace
        currently named in another agent's recent shared-communication-log entry or
        (from WS1) active claim entry." The rule fires as a tripwire:
        "do not proceed until you have consulted the surface and
        decided how to coordinate." It does NOT fire as: "refuse if a
        claim exists." Mechanical refusal is explicitly out of scope
        per Design Principle 1.

4. **Create the new follow-rule** at
   `.agent/rules/follow-agent-collaboration-practice.md`. Sibling to the
   existing `follow-collaboration-practice.md`. Pattern: thin pointer to
   the directive, in the same shape as the existing rule.
5. **Update the existing `follow-collaboration-practice.md`** to point at
   `user-collaboration.md` (one-line edit; rule body unchanged).
6. **Create the two foundational rule files**:
   - `.agent/rules/dont-break-build-without-fix-plan.md` — atomic
     enforceable rule citing gate-recovery-cadence's principle as the
     authority.
   - `.agent/rules/respect-active-agent-claims.md` — atomic enforceable
     rule with forward reference to WS1 for the claims mechanism.
7. **Update `.agent/directives/AGENT.md`** to reference both new
   directives (`user-collaboration.md` and `agent-collaboration.md`) in
   the Essential Links section. The grounding flow at session-open must
   surface both.
8. **New executive memory entry**:
   `.agent/memory/executive/agent-collaboration-channels.md` — a one-page
   reference card naming the communication channels and the
   when-to-use-which decision tree. Executive entries are short, durable,
   index-card-shaped (per existing convention with `invoke-code-reviewers.md`).
9. **Bootstrap the `.agent/state/` directory** with a `README.md` that
   names the state-vs-memory distinction (state: live, ephemeral,
   signal-like, truth-of-now; memory: durable, lessons-learned,
   truth-across-time). This is the same directory WS1 will populate
   with structured claims; landing the directory and its README in WS0
   means WS1 doesn't have to re-explain the boundary.
10. **Create the shared communication surface** at
    `.agent/state/collaboration/shared-comms-log.md`. Initial contents:

    ```markdown
    # Agent-to-Agent Shared Communication Log

    Append-only chronological log. **This is a discovery surface, not
    a synchronisation surface.** Two agents writing simultaneously
    will produce eventually-consistent interleaved entries; that is by
    design and is fine for discovery (later readers benefit from
    earlier writers' notes).

    Use this surface to leave notes for whoever reads next: what
    you're working on, what's in flight, what others should know
    before touching your area. No schema. The only discipline is
    chronological appending and signing your entry with your agent
    identity.

    Future workstreams add structured surfaces alongside this one:
    WS1 introduces a claims registry for active-area signalling; WS3A
    introduces decision-thread files for structured communication; WS3B
    may later introduce sidebars if evidence proves the need. This log
    persists alongside them as the free-form discussion surface.

    Schema candidates from real usage will inform WS1 and WS3A.

    ---

    <!-- Append entries below this line. Newest at the bottom. -->
    ```

    The file is intentionally schema-less. The only discipline is
    chronological appending — no rotation, no archive, no JSON. The
    point is that *any* agent can read it and *any* agent can write to
    it, before any structure has been agreed. (Wilma MAJOR-3 is
    resolved by this reframing — the shared communication log's role is
    discovery and basic communication, not synchronisation;
    eventually-consistent appends are fine.)

11. **Create the rule** at `.agent/rules/use-agent-comms-log.md` —
    atomic two-line content: "Before starting work on any non-trivial
    edit, append a timestamped entry to `.agent/state/collaboration/shared-comms-log.md`
    naming what you intend to touch and signing with your agent
    identity. Read recent entries first to discover what other agents
    have been working on." Loaded by all platform adapters per
    ADR-125. The rule's minimalism is the point: it gives the shared
    communication system a load-bearing target without prematurely
    structuring it.

12. **Update `.agent/rules/respect-active-agent-claims.md`** (created
    in task 6) to reference the shared communication log as the current
    discovery-and-signalling surface, with forward reference to WS1's
    structured claims for the future. The rule's enforcement force is
    "do not proceed until you have consulted the surface and decided
    how to coordinate" — explicitly NOT "refuse if you find a claim."

13. **Verify platform-adapter rule-loading infrastructure** before WS0
    lands (Wilma MAJOR-7). Confirm: (a) what "loaded by all platform
    adapters" means in the actual codebase for the existing
    `register-identity-on-thread-join.md` rule, (b) whether the
    technique is mirror, symlink, or include, (c) whether the WS0
    rules can use the same technique, (d) whether platform-adapter
    consistency is validated at consolidate-docs. If the infrastructure
    is not in place, add a sub-task to WS0 to land it; do not assume
    it exists.

#### Mechanical Acceptance (verifiable at commit time)

- `rg "collaboration\.md"` returns no stale references after the sweep.
- `rg "user-collaboration\.md"` and `rg "agent-collaboration\.md"` return
  the expected reference set.
- The new `agent-collaboration.md` directive passes `practice:vocabulary`
  and `practice:fitness:informational` (informational only — directive is
  new, fitness is establishing baseline).
- The follow-rules at `.agent/rules/follow-{user,agent}-collaboration-practice.md`
  are both two-line pointers (consistent with existing pattern).
- The three new behavioural rules at
  `.agent/rules/dont-break-build-without-fix-plan.md`,
  `.agent/rules/respect-active-agent-claims.md`, and
  `.agent/rules/use-agent-comms-log.md` are atomic, cite their
  authority (or in the shared communication log's case, are deliberately
  unstructured), and are loaded by all platform adapters via the same
  technique used for the existing `register-identity-on-thread-join.md`
  rule (verified during task 13 platform-adapter audit).
- `.agent/state/` directory exists with a README naming the
  state-vs-memory distinction.
- `.agent/state/collaboration/shared-comms-log.md` exists with the schema-less
  introduction text. The file is empty of communication entries.
- A pilot exercise: as part of WS0 landing, the executing agent appends
  one timestamped entry to the log announcing WS0's landing. This proves
  the surface is writable and discoverable, and establishes the
  log-entry convention by example rather than by spec.
- **Bidirectional cross-reference validated**: `dont-break-build-without-fix-plan.md`
  cites `gate-recovery-cadence.plan.md`; `gate-recovery-cadence.plan.md`
  cites the new rule. `consolidate-docs.md` is updated to validate
  this bidirectional reference at consolidation time (Wilma MINOR-10).
- **All pre-commit gates pass on the WS0 atomic commit**: `pnpm lint`,
  `pnpm markdownlint-check:root`, `pnpm prettier --check`, `pnpm knip`,
  `pnpm depcruise`, `pnpm portability:check`, `pnpm subagents:check`.
  If any gate fails, the issue is fixed without reordering or
  re-sweeping references, and the commit re-attempted atomically.
  Gate-failure is not "documented and routed to follow-up" — it is
  resolved before WS0 lands. (Wilma BLOCKING-2.)
- **Single atomic commit** for the directive rename + sweep + new
  directive + new rules + AGENT.md update + executive memory entry +
  state directory + shared communication log. No partial-state intermediate.

#### Operational Seed (validated by observation in next 3 sessions)

- **Seed question**: *Can a sequential agent at session-open discover
  what other agents have recently been working on, by reading the
  shared communication log under the new rule?*
- **Validation**: across the next 3 sessions touching this repo, at
  least one agent appends an entry to the shared communication log naming their
  intended work (per the `use-agent-comms-log` rule), and at least one
  subsequent session demonstrably reads prior entries (evidenced by a
  napkin observation, a thread-record entry, or an in-session
  reference to what a prior agent did).
- **Failure mode to watch**: agents read the rule but do not append
  entries (rule discoverable but not followed). If observed, that is
  evidence-gating-trigger (i) for hook-based reminders per Follow-up
  Work.
- **Capture**: napkin observations, per the standard learning-loop
  capture surface.

#### Bootstrap Coordination (Wilma BLOCKING-1, relaxed under advisory model)

WS0 is non-self-bootstrapping by definition — the shared communication log it creates
is the first place an agent could check for "is anyone else working on
this." Mitigation: at WS0 land time, the executing agent uses existing
surfaces to verify no other active work:

1. `git log --oneline | head -20` — recent commit activity
2. `repo-continuity.md § Active threads` — declared active threads
3. Recent `next-session.md` records for in-flight markers
4. Owner via existing chat — direct verification

If two agents nonetheless attempt WS0 simultaneously, the worst case
is a git merge conflict on the directive rename. That is a normal git
event, not a protocol failure; the second agent rebases or coordinates
with the owner. The protocol's *function* does not depend on WS0
landing under enforced isolation.

#### Reviewer Routing (mandatory)

- `docs-adr-reviewer` — pre-landing review of the new
  `agent-collaboration.md` directive content and the cross-reference
  sweep completeness. Same discipline as ADR-163 §3.0 pre-landing gates.
- `assumptions-reviewer` — pre-landing review of the new directive's
  behavioural-rule framing (proportionality of the two foundational
  rules; whether the gate-recovery-cadence citation is the right
  authority surface).

### WS1 — Promote Shared Signals To Structured Claims (Minimum Viable Coordination)

**Goal**: promote WS0's schema-less shared communication log into a structured claims
registry that converts "don't operate in another agent's area without
letting them know first" from a discoverable rule into an enforceable
session-open tripwire. The schema is informed by whatever usage emerged
between WS0 and WS1 — if agents have been writing entries into
`log.md` since WS0 landed, those entries are the *primary input* to the
schema design, ahead of first-principles design choices.

**Pre-WS1 input**: read every entry written to
`.agent/state/collaboration/shared-comms-log.md` since WS0 landed. Extract the
recurring fields agents actually used. The schema below is a starting
point reflecting plausible fields; replace any field with what real
usage shows agents need, and remove fields that no entry needed.

#### Tasks

1. **The `.agent/state/` directory and its README already exist** (WS0).
   Confirm the README's state-vs-memory distinction is still accurate;
   amend if real usage between WS0 and WS1 has surfaced refinements.
2. **Create `.agent/state/collaboration/active-claims.json`** with an
   accompanying `active-claims.schema.json`. Starting schema (single
   level, no exclusivity gradient — owner-settled 2026-04-25 in
   discussion of advisory model):

   ```json
   {
     "schema_version": "1.0.0",
     "$comment_compatibility": "Additive-only schema evolution within a major version. v1.x agents reading v1.y files (y > x) ignore unrecognised fields and preserve them on write-back. Major-version mismatch causes the agent to bail out with an error pointing at the protocol upgrade.",
     "claims": [
       {
         "claim_id": "string (uuid)",
         "agent_id": {
           "agent_name": "string",
           "platform": "string",
           "model": "string",
           "session_id_prefix": "string"
         },
         "thread": "string (thread slug)",
         "areas": [
           {
             "kind": "files|workspace|plan|adr",
             "patterns": ["string"]
           }
         ],
         "claimed_at": "string (ISO 8601)",
         "freshness_seconds": "number (default 14400 — 4 hours; how long this claim should be considered current before consolidate-docs treats it as stale)",
         "heartbeat_at": "string (ISO 8601, optional)",
         "sidebar_open": "boolean (default false; WS3B sidebar state if promoted)",
         "intent": "string (short free-form description of what the agent intends — e.g. 'atomic 15-item ADR-163 amendment'; helps other agents decide how to coordinate)",
         "notes": "string (optional, free-form)"
       }
     ]
   }
   ```

   **Claims are signals, not locks.** A single level — there is no
   `exclusive` vs `advisory` field. All claims are advisory by design;
   strength of signal is communicated via the `intent` field's prose
   ("atomic refactor in progress, please coordinate" vs "routine edits,
   ping me if you also touch this"). WS5 evidence may motivate a
   strength gradient as a refinement amendment; the starting point is
   single-level to avoid premature classification. (Reframed per owner
   direction 2026-04-25; resolves Wilma MAJOR-5 dissolution and
   MINOR-13 cross-thread visibility-as-feature.)

   **Lifecycle (no mechanical expiry blocking)**:
   - `claimed_at` is when the claim was registered.
   - `freshness_seconds` indicates how long the claim should be treated
     as current. After this, the claim is *stale*, not *expired* — it
     becomes noise to be audited at consolidation, not a blocker.
   - `heartbeat_at` is updated by the agent during long sessions to
     keep a claim fresh. Optional; absence just means the claim is as
     fresh as `claimed_at`.
   - At session-close, the agent removes its own claim entries (or
     marks them closed). If the agent forgets or crashes, the claim
     becomes stale at `claimed_at + freshness_seconds`; consolidate-docs
     archives stale claims to `closed-claims.archive.json` and removes
     them from the active registry. (Wilma MAJOR-6 — archived, not
     deleted; decision-thread files and napkin observations can
     reference archived claims permanently.)

3. **Create the rule** at
   `.agent/rules/register-active-areas-at-session-open.md` — sibling to
   the existing `register-identity-on-thread-join.md`. The rule fires
   as a tripwire: "Before any edit in this session, list the areas you
   intend to touch. For each, scan `active-claims.json` for overlapping
   claims. If overlap, consult the shared communication log and
   decision-thread files for context, decide how to coordinate (proceed
   with caution, ping the other agent via the shared communication log,
   open a decision thread, ask the owner, or later open a sidebar if
   WS3B has promoted), and document your decision. Whether or not you
   find an overlap, register your own claim entry. **Do not proceed
   until you have consulted and decided** — but the substance of the
   decision is yours; the rule does not refuse entry to claimed areas."
   Mechanical
   refusal is explicitly named as out of scope per Design Principle 1.
4. **Update `agent-collaboration.md`** to fill in the WS1 forward
   references: claim mechanism (signals not locks), single-level
   starting schema, freshness/staleness semantics, archival path for
   stale claims (consolidate-docs → `closed-claims.archive.json`).
   Document which schema fields came from observed `log.md` entries
   between WS0 and WS1, and which came from first-principles design
   (Wilma MINOR-14: schema-from-schema-less-observations transparency).
5. **Update `start-right-quick.md` and `start-right-thorough.md`** to
   include the active-claims read at session-open as a numbered step.
   The skill files are the right place for the procedural sequence; the
   rule is the load-bearing tripwire that those skills implement. Add
   the bootstrap fast-path: if `active-claims.json` has no entries
   other than the current agent's own, log "no other agents present"
   to the shared communication log and proceed without further coordination overhead.
6. **Update `consolidate-docs.md`** to add a stale-claim audit step:
   any claim where `claimed_at + freshness_seconds < now()` is
   archived to `.agent/state/collaboration/closed-claims.archive.json`
   and removed from `active-claims.json`. Owner notification if the
   claim's agent has not registered a subsequent thread-record entry —
   possible crash, but informational only; no agent is stranded by
   the staleness.
7. **Bootstrap fast-path implementation**: if `active-claims.json` has
   no entries other than the current agent's own, the agent skips
   per-claim coordination overhead. The fast-path is documented in the
   `agent-collaboration.md` directive and implemented in the
   start-right-quick skill (early return).
8. **Create the operational entry**:
   `.agent/memory/operational/collaboration-state-conventions.md` —
   short guide naming where state lives, lifecycle, and the
   trusted-agents threat model. Operational entries describe how the
   system runs, not what it's learned.
9. **Preserve the shared communication log**: `.agent/state/collaboration/shared-comms-log.md`
   continues to exist alongside the new structured claims file. The
   log becomes the surface for free-form messages that don't fit the
   claim schema — discussion, questions, observations, things that
   aren't claims-of-area. Update `.agent/rules/use-agent-comms-log.md`
   to distinguish the two: claims-of-area in `active-claims.json`,
   free-form discussion and discovery in `log.md`. Per ADR-150's
   capture→distil→graduate→enforce, the shared communication log is not
   replaced when the structured surface lands; both surfaces coexist with
   named purposes.

#### Mechanical Acceptance (verifiable at commit time)

- `.agent/state/collaboration/active-claims.json` exists with valid
  schema and an empty `claims` array.
- `.agent/state/collaboration/active-claims.schema.json` is the JSON
  schema authority and includes the `$comment_compatibility` block
  naming the additive-only major-version compatibility model
  (Wilma MAJOR-4).
- `.agent/state/collaboration/closed-claims.archive.json` exists with
  empty `claims` array; consolidate-docs writes archived stale claims
  here (Wilma MAJOR-6).
- A new agent at session-open who reads start-right-quick performs the
  claim check and (per the rule) does not proceed until they have
  consulted and decided how to coordinate; a single-agent case
  fast-paths without overhead.
- The new rule file is loaded by all platform adapters via the
  technique audited at WS0 task 13.
- `consolidate-docs.md` has a documented stale-claim audit step that
  archives, not deletes, expired claims.
- The directive's WS1 section documents which schema fields came from
  observed shared-communication-log usage and which from first-principles design.
- All pre-commit gates pass on the WS1 atomic commit.

#### Operational Seed (validated by observation in next 3 sessions)

- **Seed question**: *Can simultaneous (or near-simultaneous) agents
  detect each other's claims via the registry, and use that detection
  to inform coordination decisions — without the protocol mechanically
  refusing entry?*
- **Validation**: across the next 3 sessions involving overlapping
  agent activity (defined as two or more agents on the same branch with
  overlapping working trees), at least one claim is registered, at
  least one subsequent agent reads the registry and finds the claim,
  and the coordination decision (proceed / ping / decision thread /
  ask owner / promoted sidebar) is documented in the shared
  communication log or napkin.
- **Failure mode to watch**: agents register claims but other agents
  do not consult them; or agents detect claims and mechanically refuse
  entry rather than coordinating with judgement. Either signals the
  rule's framing needs revision.
- **Capture**: napkin observations (standard learning-loop capture).

#### Reviewer Routing

- `architecture-reviewer-fred` — pre-landing review of the
  state-vs-memory boundary discipline. Boundary correctness is the
  central concern of WS1 and Fred's specialty.
- `config-reviewer` — review of the JSON schema for the additive-only
  versioning model and integration with any validation tooling.
- `assumptions-reviewer` — confirm that the single-level claim model
  (no exclusivity gradient) holds under the advisory framing; surface
  any scenario where strength differentiation would be required at
  WS1 land time rather than as a WS5-driven refinement.

### WS2 — Collaboration Memory Class

**Goal**: install the durable lessons surface for cross-session
collaboration patterns, distinct from active code/architecture patterns.
The graduating pattern (`parallel-track-pre-commit-gate-coupling`) is the
founding entry — the pattern that motivated this entire plan.

#### Tasks

1. **Create `.agent/memory/collaboration/` directory** with `README.md`
   explaining: lessons learned about agent-to-agent collaboration
   patterns, distinct from `.agent/memory/active/patterns/` (which holds
   code/architecture/process patterns). Same lifecycle as other memory
   surfaces: capture in napkin, distil, graduate to permanent file when
   the pattern earns it.
2. **Graduate the founding pattern**:
   `.agent/memory/collaboration/parallel-track-pre-commit-gate-coupling.md`.
   Three recorded instances (Frodo prettier 2026-04-24; Pippin
   auto-staging 2026-04-24; Jazzy knip 2026-04-25). The pattern names:
   - the failure shape (full-repo gates couple parallel work)
   - the discipline (surface, don't fix or bypass, route to owner)
   - the routing question for owner (wait for parallel landing vs.
     fresh `--no-verify` authorisation)
   - the structural fix (this entire plan)
3. **Update the napkin's pending-graduations register** to mark the
   pattern as graduated; preserve the original instance entries in
   the napkin verbatim per ADR-053-style precedent.
4. **Index the new memory class** in `.agent/memory/active/patterns/README.md`
   (or whichever README orchestrates the pattern surfaces) so the new
   class is discoverable from the existing pattern entry-point.
5. **Update `agent-collaboration.md`** to cite the founding pattern as
   the load-bearing motivating example (concrete grounding for the
   abstract directive).

#### Mechanical Acceptance (verifiable at commit time)

- The pattern file documents all three instances with date + agent +
  gate type + resolution.
- The pattern file's "Discipline" section is the canonical statement of
  the parallel-track surface-and-route discipline.
- A search for the pattern from the existing
  `.agent/memory/active/patterns/` index surfaces the new collaboration
  patterns directory.

#### Operational Seed (validated by observation in next 30 days)

- **Seed question**: *Does the graduated `parallel-track-pre-commit-gate-coupling`
  pattern serve as guidance when a future agent encounters a comparable
  scenario?*
- **Validation**: in the 30 days after WS2 lands, at least one agent
  encountering a parallel-track-coupling situation cites the pattern
  (in their napkin entry, in a decision-thread entry, or in a plan
  body referencing the pattern as authority).
- **Failure mode to watch**: clashes recur but the pattern is never
  cited (pattern-discoverable but not used). If observed, the pattern
  needs better placement in the discovery flow.
- **Capture**: napkin observations.

#### Reviewer Routing

- `docs-adr-reviewer` — review the pattern file's evidence chain (three
  instances, their cross-references) and its placement.

### WS3 Split — Decision Threads First, Sidebar Later

The original WS3 bundled a lightweight async conversation surface with
the heavier sidebar, timeout, and owner-escalation mechanism. The
owner-directed WS5 evidence harvest showed that the evidence threshold
for inspection is met, but the full sidebar mechanism is not the right
next automatic implementation.

Authoritative split plans:

- [`multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
  owns completed WS3A: evidence provision, protocol observability, durable
  claim-closure history, and a lightweight conversation /
  decision-thread surface.
- [`multi-agent-collaboration-sidebar-and-escalation.plan.md`](multi-agent-collaboration-sidebar-and-escalation.plan.md)
  owns WS3B: sidebar request/message/resolution, timeout discipline,
  and explicit owner escalation. Its promotion gate is satisfied; execution
  remains a separate implementation pass.

#### WS3A Operational Seed

- **Seed question**: *Do lightweight decision threads give agents enough
  structured surface to reach and cite overlap decisions without needing
  a synchronous sidebar?*
- **Validation**: at least one real decision thread reaches `resolution`
  with evidence references, or the absence of decision-thread demand is
  recorded as a proportionality finding.
- **Failure mode to watch**: agents continue to rely on free-text log
  archaeology for claim closures, or decision threads duplicate thread
  records instead of staying narrow.
- **Capture**: decision-thread files, claim-history entries, napkin
  observations, and consolidation summaries.

#### WS3B Operational Seed

- **Seed question**: *If promoted, does a real sidebar reach
  `sidebar_resolution` without becoming a blocking gate or default
  owner-escalation path?*
- **Validation**: owner direction or decision-thread evidence promotes
  WS3B; at least one sidebar event is then transcribed and reviewed in
  WS5.
- **Failure mode to watch**: sidebars open and never close, agents use
  sidebars as permission gates, or owner escalation becomes the first
  move.
- **Capture**: sidebar transcript entries, escalation files, napkin
  observations, and consolidation summaries.

#### Reviewer Routing

- `assumptions-reviewer` — proportionality of decision-thread-first
  sequencing and any later sidebar promotion.
- `docs-adr-reviewer` — review the conversation / decision-thread schema,
  claim-history durability, and thread-record distinction.
- `architecture-reviewer-wilma` — if WS3B promotes, review sidebar
  timeout, parallel-sidebar, and owner-escalation failure modes.

### WS4A — Lifecycle Integration (Completed 2026-04-26)

**Goal**: wire the protocol into existing operational workflows so new
agents pick it up automatically at session-open and agents at
session-close leave the state clean. Owner-settled 2026-04-25: this
integration is operationally required, not optional.

The completed WS4A pass made WS0-WS3A state visible in the ordinary
lifecycle without promoting WS3B. It intentionally did not add sidebars,
timeouts, owner-escalation directories, hook reminders, or a persistent
dashboard. Those remain evidence-gated follow-up work.

#### Landed Tasks

1. **Start-right surfaces** now read active claims, the shared log,
   decision-thread files, thread-relevant closure history, and the
   work-shape / simple-plan declaration before edits.
2. **Session handoff** now closes own active claims into the closure
   archive with explicit metadata and scans relevant open decision
   threads for handoff or resolution updates.
3. **Consolidation** now audits active/stale claims, recent closures,
   decision-thread snapshots, unresolved decision requests, evidence
   bundles, schemas, and the bidirectional rule-plan citation pair.
4. **Plan command and templates** now include lifecycle triggers and the
   tiered simple-plan requirement.
5. **Practice propagation surfaces** now describe collaboration state,
   claims, shared logs, closure history, and decision threads as
   first-class Practice mechanisms rather than local-only details.
6. **Continuity visibility** uses the structured state plus
   `consolidate-docs` audit output as the first move. `repo-continuity.md`
   stays compact unless real usage shows that a dashboard is the next
   safest surface.

#### Current Validation Evidence

- JSON parse and Ajv schema validation passed for active claims, closed
  claims, and decision-thread files.
- Targeted markdownlint, `git diff --check`,
  `pnpm practice:fitness:strict-hard`,
  `pnpm practice:fitness:informational`, `pnpm portability:check`, and
  `pnpm practice:vocabulary` passed during the WS4A implementation
  session.
- Full commit-time gates remain a commit-close responsibility for this
  uncommitted bundle; the plan does not claim a WS4A atomic commit.
- Sub-agent review is the preferred evidence path for substantive
  lifecycle / Practice updates. It is not always blocking, but skipped
  reviewer coverage must be recorded explicitly rather than treated as
  normal.

#### Operational Seed (validated by observation in next 3 sessions)

- **Seed question**: *Do agents at session-open on each platform
  (Claude, Cursor, Codex) automatically engage with the protocol —
  registering claims, reading prior agents' state — without manual
  intervention or rule re-discovery?*
- **Validation**: across the next 3 sessions touching this repo and
  spanning at least 2 different platforms, every session shows
  evidence of automatic engagement (claim entry written at start,
  prior claims read, shared-communication-log entry made).
- **Failure mode to watch**: a platform's rule-loading mechanism
  doesn't fire the new tripwire; agents on that platform remain
  unaware of the protocol. This is the named evidence-gating-trigger
  for hook-based reminders per Follow-up Work.
- **Capture**: napkin observations.

#### Reviewer Routing

- `docs-adr-reviewer` — preferred closeout review for coherence across
  updated workflow, Practice, ADR, and plan surfaces.
- `assumptions-reviewer` — preferred closeout review for proportionality:
  confirm lifecycle integration remains narrow, WS3B is still gated, and
  dashboard / hook automation has not slipped in by implication.
- `architecture-reviewer-fred` — boundary verification on the
  platform-adapter rule-loading mechanism if later WS5 evidence
  reveals any platform-specific complexity.

### WS5 — Consolidation Harvest

**Goal**: harvest the per-WS operational seeds collectively; evaluate
whether the protocol is reducing parallel-track clashes; surface
refinement candidates as separate commits. WS5 is **not** a
late-binding observation phase that designs schemas — schemas are
designed at WS1/WS3A land time, informed by WS0's
shared-communication-log usage. WS3B schema work is conditional on
later promotion evidence. WS5's role is to *evaluate* the seeds each
prior WS planted and the protocol's overall fitness.

**Capture surface**: the **napkin**, like every other learning-loop
input in this repo. Observations about claim usage, decision-thread
friction, sidebar timing if WS3B promotes, schema fields, and protocol
friction live as `### Observation` and `### Surprise` entries in the
napkin under the agent-and-date heading that captured them. There is
no parallel observations file — the
napkin already handles structured per-session observations, and
introducing a sibling surface would create wiring without benefit.

**Conversations are first-class learning-loop inputs alongside the
napkin**. The shared communication log at `.agent/state/collaboration/shared-comms-log.md`,
structured claims in `active-claims.json`, decision-thread files, and
any promoted sidebar transcripts are themselves durable evidence. When
a refinement is drafted, it cites entries from those surfaces directly,
the same way a refinement cites a napkin observation. The
`agent-collaboration.md` directive names this explicitly so future
agents know the decision-thread and claim-history surfaces are
learning-loop inputs, not just operational coordination.

**Aggregate question across all seeds**: *Has the rate of parallel-track
gate clashes decreased post-protocol?* Evidence is the absence of
clash-class instances in napkin entries (compared to the three observed
in 2026-04-24/25 pre-protocol).

#### Tasks

1. **Continuous capture from WS0 onwards**: agents writing to
   `.agent/state/collaboration/shared-comms-log.md`, and from WS1
   onwards `active-claims.json`, are themselves WS5 input. Every
   entry is observed for what fields it uses, what feels awkward,
   what's missing. WS1, WS3A, and any promoted WS3B schema decisions
   cite the shared-communication-log entries that informed them.
2. **Harvest each WS's operational seed**:
   - WS0 seed (sequential discoverability): did agents append entries
     to the shared communication log; did subsequent agents read them?
   - WS1 seed (simultaneous claim detection without enforcement): did
     overlapping-area agents detect each other and coordinate via
     judgement?
   - WS2 seed (pattern citation): was the
     `parallel-track-pre-commit-gate-coupling` pattern cited by an
     agent encountering a comparable scenario?
   - WS3A seed (decision-thread resolution): did a lightweight
     decision thread give agents enough structure to reach and cite an
     overlap decision?
   - WS3B seed (conditional sidebar resolution): if promoted, did at
     least one sidebar reach `sidebar_resolution`?
   - WS4A seed (cross-platform automatic engagement): did agents on
     all three platforms automatically engage with the protocol?
   - Aggregate seed: clash rate trend.
3. **Run for at least three real parallel sessions post-WS4A** (defined
   as: two or more agents working on the same branch with overlapping
   working trees, where at least one has registered a claim).
4. **Capture observations in the napkin** session-by-session: what
   worked, what didn't, what schema fields were never used, what
   fields proved missing, where decision-thread structure was too heavy
   or too light, where the sidebar timeout was too short or too long if
   WS3B promotes, and where the bootstrap fast-path mis-fired. Use the
   standard `### Observation` / `### Surprise` napkin sections.
5. **Decision-thread evidence is sufficient for WS3A harvest**. If no
   real blocker surfaces a sidebar need after WS3A, record that as a
   proportionality finding. WS5 can complete without a sidebar event
   unless WS3B has been explicitly promoted.
6. **If WS3B promotes, at least one full sidebar event** must be
   observed and its transcript reviewed before closing the WS3B seed.
   If no real blocker surfaces a sidebar in three sessions after WS3B
   promotion, the sidebar protocol may be over-designed; record this in
   the napkin as a refinement trigger and complete the sidebar seed with
   that observation as evidence (Wilma MINOR-13 — bounded completion,
   not unbounded poll).
7. **Refinement amendments land as separate commits**, not as part of
   WS5. WS5 produces the evidence (in the napkin and in the
   decision-thread and claim-history surfaces themselves); the
   amendments are subsequent
   commits with their own reviewer routing. This keeps the WS5
   completion criterion observation-based, not implementation-based.
8. **Evaluate hook-trigger conditions**: if WS5 evidence shows agents
   are not consistently using the discovery and communication surfaces
   despite the rules being loaded — i.e., the rules are discoverable
   but not followed — that is the named evidence trigger for the
   hook-based reminders described in Follow-up Work. WS5 surfaces this
   trigger; the hook-installation work itself is a separate
   evidence-gated plan, not part of this one.

#### Acceptance Criteria

- All applicable per-WS seeds harvested with explicit findings (each named
  with "validated" / "partially validated" / "not validated"
  classifications and the napkin entries that support each). WS3B is
  conditional and records "not promoted / no sidebar evidence required"
  when it has not been promoted.
- Three parallel sessions logged with napkin observations.
- At least one decision-thread finding recorded, either from a real
  decision thread or from evidence that the surface was not needed in
  the observation window.
- Sidebar findings are conditional: if WS3B has not promoted, record
  "not promoted / no sidebar evidence required" rather than forcing a
  sidebar event.
- At least one refinement candidate identified — even if the
  refinement is "no change needed" (which is itself useful evidence).
  Candidates surface from napkin observations and from the
  decision-thread and claim-history surfaces themselves; both are
  valid evidence.
- Hook-trigger evaluation completed and recorded.

#### Reviewer Routing

- `docs-adr-reviewer` — review the napkin's seed-harvest entries for
  evidentiary rigour before any subsequent amendment commit.
- `assumptions-reviewer` — when refinement amendments are drafted,
  review their proportionality before they land.

## Critical Files

### New files (created by this plan)

- `.agent/directives/agent-collaboration.md` — the new sibling directive (WS0; extended WS1, WS3A, and WS3B if promoted)
- `.agent/rules/follow-agent-collaboration-practice.md` — sibling to existing follow-rule (WS0)
- `.agent/rules/dont-break-build-without-fix-plan.md` — atomic rule citing gate-recovery-cadence (WS0)
- `.agent/rules/respect-active-agent-claims.md` — atomic rule with WS1/WS3A forward refs and commit-window awareness (WS0; extended WS3A and WS3B if promoted)
- `.agent/rules/use-agent-comms-log.md` — atomic rule pointing at the shared communication log (WS0; extended WS1)
- `.agent/rules/register-active-areas-at-session-open.md` — atomic rule, parallel to register-identity-on-thread-join, including `git:index/head` commit-window claims (WS1 + commit-window refinement)
- `.agent/state/README.md` — explains state-vs-memory distinction (WS0)
- `.agent/state/collaboration/shared-comms-log.md` — schema-less shared communication log (WS0; preserved alongside structured surfaces in WS1, WS3A, and WS3B if promoted)
- `.agent/state/collaboration/active-claims.json` — structured claims registry, schema informed by observed shared-communication-log usage; v1.2.0 carries short-lived git transaction claims and v1.3.0 adds the advisory `commit_queue` (WS1 + commit-window + queue refinements)
- `.agent/state/collaboration/active-claims.schema.json` — JSON schema for claims, including `areas.kind: "git"` in v1.2.0 and `commit_queue` in v1.3.0 (WS1 + commit-window + queue refinements)
- `.agent/state/collaboration/conversations/` — directory of per-topic decision-thread files (WS3A; extended by WS3B if promoted)
- `.agent/state/collaboration/conversation.schema.json` — JSON schema for decision threads (WS3A; extended by WS3B if promoted)
- `.agent/memory/collaboration/README.md` — explains the new memory class (WS2)
- `.agent/memory/collaboration/parallel-track-pre-commit-gate-coupling.md` — founding pattern (WS2)
- `.agent/memory/executive/agent-collaboration-channels.md` — communication-channel reference card (WS0)
- `.agent/memory/operational/collaboration-state-conventions.md` — operational guide (WS1)

### Renamed files

- `.agent/directives/collaboration.md` → `.agent/directives/user-collaboration.md` (WS0)

### Updated files (cross-reference sweep)

- `.agent/directives/AGENT.md` (WS0; WS4A)
- `.agent/practice-index.md` (WS0)
- `.agent/experience/README.md` (WS0)
- `.agent/research/.../reviewer-system-and-review-operations.md` (WS0)
- `.agent/memory/active/napkin.md`, `distilled.md` (WS0; WS5)
- `.agent/memory/operational/repo-continuity.md` (WS0; WS4A)
- `.agent/plans/agentic-engineering-enhancements/README.md`, `roadmap.md` (WS0)
- `.agent/plans/agentic-engineering-enhancements/current/practice-and-process-structural-improvements.plan.md` (WS0)
- `.agent/plans/observability/active/gate-recovery-cadence.plan.md` (WS0 — bidirectional reference between gate-recovery and the new rule)
- `.agent/rules/follow-collaboration-practice.md` (WS0 — re-pointed to user-collaboration.md)
- `.agent/skills/commit/SKILL.md` and commit skill adapters (commit-window refinement)
- `.agent/skills/start-right-quick/`, `start-right-thorough/`, `session-handoff/` and platform adapters (WS4A)
- `.agent/commands/consolidate-docs.md` (WS1; WS3A; WS3B if promoted; WS4A)
- `.agent/memory/executive/invoke-code-reviewers.md` (WS4A)

## Verification

### Per-WS verification

Each WS has its own acceptance criteria above. Run focused gates after
each WS:

```bash
pnpm portability:check
pnpm subagents:check
pnpm practice:vocabulary
pnpm practice:fitness:informational
pnpm markdownlint:root
```

### End-to-end verification (after WS4A)

A fresh-start agent on this repo, following only the updated
start-right-quick, must:

1. Detect there are no other active claims (or detect existing claims).
2. Register their own claim before any edit.
3. Complete a unit of work.
4. At session-close, leave a clean claim state (closed or removed).

Local lifecycle readiness was targeted-validated during WS4A. Real
cross-platform automatic engagement is verified by the WS5 pilot sessions.

### Real-usage verification (WS5)

Three parallel sessions observed with explicit WS3A decision-thread /
claim-history findings. Sidebar evidence is conditional on WS3B being
promoted; absence of sidebar demand is itself valid proportionality
evidence. The plan's design assumptions are validated or refuted by
this evidence; refinement amendments follow.

## Sequencing Discipline

**WS0 is non-negotiable as the foundation**. Every later WS references
the directive structure landed in WS0. WS0 is also the smallest
high-leverage piece — if no other WS lands, WS0 alone gives agents the
named distinction between user and agent collaboration plus the two
foundational behavioural rules.

**WS1 is the smallest piece that makes WS0's discoverability claim
sharper into structured signalling**. WS0 establishes the discovery
surface and rule; WS1 promotes it into a structured registry that
makes overlap detection more precise. Neither WS0 nor WS1 mechanically
refuses entry — see Design Principle 1 for why.

**WS2 lands at any point after WS0** — it is independent of WS1, WS3A,
WS3B, and WS4A and graduates a pre-existing pattern. Sequenced second
only because it provides motivating evidence for later coordination
surface design choices.

**WS3A depends on WS1**. Decision threads reference claims and claim
closure history. The split WS3A slice is complete in local
documentation/state: claim-history, decision-thread, observability, and
handoff surfaces have landed.

**WS3B depends on WS3A evidence and owner direction**. That promotion gate is
now satisfied by the 2026-04-26 phase-transition evidence. Sidebars still open
against decision-thread topics and claims only when the tighter exchange is
needed, and implementation remains a separate pass.

**WS4A wired existing operational surfaces** to use WS1 + WS3A
machinery. It is operationally required for the protocol to be reliably
automatic across all platforms. Owner-settled 2026-04-25: lifecycle
integration is jointly required with WS1 for the protocol to function
operationally. The workflow surfaces (start-right-quick,
start-right-thorough, session-handoff, consolidate-docs, plan templates,
and Practice propagation surfaces) now make the protocol discoverable in
normal work. Real cross-platform engagement remains a WS5 observation
question.

**WS5 is observation-based and gates further refinement work**, not
this plan's completion. The plan completes when WS0, WS1, WS2, WS3A,
and WS4A land; WS3B is conditional on promotion evidence. WS5 produces
evidence that may motivate amendments to WS1, WS3A, or promoted WS3B
schemas, but those amendments are separate commits with their own gates.

## Risk Register

| Risk | Mitigation |
|---|---|
| Rename sweep misses a reference and breaks discoverability | `rg "collaboration\.md"` at execution time; reviewer dispatch on the cross-reference set; one atomic commit so no partial-state intermediate. |
| State-vs-memory confusion at adoption time | Explicit READMEs in both `.agent/state/` and `.agent/memory/collaboration/` naming the distinction; reviewer dispatch by `architecture-reviewer-fred` on boundary discipline. |
| Schema crystallises wrong fields, requires v2 retrofit | `schema_version` field from day one with additive-only major-version compatibility model named in schema and directive; WS5 observation checks "what fields were never used / what was missing"; refinement amendments are normal lifecycle. (Wilma MAJOR-4 absorbed.) |
| Claims become a graveyard (stale entries cluttering the registry) | Under advisory model, stale claims are noise not blockers — no agent is stranded by them. Consolidate-docs archives stale claims to `closed-claims.archive.json`; pilot run proves archival end-to-end before WS2 starts. (Wilma MAJOR-5, MAJOR-6 absorbed.) |
| Shared communication log read after parallel writes shows interleaving | Shared communication log is a *discovery* surface, not synchronisation. Eventually-consistent appends are fine for sequential agents reading later. (Wilma MAJOR-3 absorbed via reframing.) |
| Sidebar timeout too short / too long for real use | Timeout values remain in WS3B until promotion evidence justifies them; WS5 seed harvest calibrates any promoted defaults. |
| Bootstrap fast-path mis-fires (single agent pays full overhead) | Fast-path implementation in start-right-quick early-return; verified in WS1 pilot exercise. |
| Owner-as-tiebreaker pathway used as the default escalation | Explicit doctrine in directive: peer agreement is the default; owner is the *last* move when agreement fails. WS3B's escalation surface (`escalations/`) makes prematurity visible if promoted. WS5 seed harvest flags overuse. |
| Protocol overhead exceeds clash-avoidance benefit (agents route around) | WS5 seed harvest specifically checks whether agents follow the protocol; if not, that triggers hook-based reminders (Follow-up Work) — not a "protocol is fine" rationalisation. |
| Agents read the rule but never use the surface | WS0 and WS4A seeds explicitly observe surface usage. Sustained non-use is the named trigger for hook-based reminders. |
| Existing thread records and the new decision-thread files diverge / duplicate | WS3A defines the relationship: thread records are durable narrative; decision threads are operational coordination. Reviewer dispatch on this distinction. |
| Pre-commit gate fails on a WS commit | Each committed WS must resolve gate failures before commit close; uncommitted bundles record targeted validation separately and do not claim final commit-gate evidence. (Wilma BLOCKING-2 absorbed.) |
| Platform-adapter rule-loading varies across Claude/Cursor/Codex | WS4A made the canonical workflow surfaces explicit and `pnpm portability:check` passed; WS5 watches real platform engagement and routes any platform-specific complexity to follow-up. (Wilma MAJOR-7 absorbed.) |
| Two agents attempt WS0 simultaneously | Worst case is git merge conflict on rename; second agent rebases or coordinates with owner via existing channels. The protocol's *function* does not depend on enforced isolation at WS0 land. (Wilma BLOCKING-1 absorbed under advisory model.) |
| Bidirectional citation chain (rule ↔ gate-recovery-cadence) drifts silently | WS0 acceptance adds consolidate-docs validation step; WS4A wires the validation into the audit cycle. (Wilma MINOR-10 absorbed.) |
| Platform-native agent-team features become an implicit dependency | Design Principle 2 forbids this. Platform-specific tools may help build or inspect the local phenotype, but operation must remain markdown/JSON/rules/commands/skills/hooks first and portable across agent systems. |
| Misbehaving agent claims excessive scope or never closes claims | Trusted-agents threat model named explicitly in Design Principle 13. Owner detects and resolves at consolidation. Hostile-agent threat model is a future PDR, out of scope. (Wilma MINOR-11, MINOR-12 absorbed.) |

## Wilma's Adversarial Review — Findings Absorbed

The plan was reviewed by `architecture-reviewer-wilma` 2026-04-25 against
2 BLOCKING, 7 MAJOR, 7 MINOR, and 4 POSITIVE findings. Disposition table
(maintained as the audit trail for the review cycle):

| Wilma finding | Severity | Disposition |
|---|---|---|
| 1. WS0 bootstrap chicken-and-egg | BLOCKING | **Relaxed by advisory framing** — two simultaneous WS0 commits produce a merge conflict, not protocol failure. WS0 mechanical acceptance documents owner-mediated coordination via existing surfaces. |
| 2. WS0 atomic-commit pre-commit gates | BLOCKING | **Absorbed** — every WS's mechanical acceptance now includes "all pre-commit gates pass on first attempt" as a first-class criterion. |
| 3. Former embryo log not safe as synchronisation | MAJOR | **Resolved by reframing** — the shared communication log is a *discovery and basic communication* surface, not synchronisation. Plan body now explicitly distinguishes; rule wording updated. |
| 4. JSON schema versioning compatibility | MAJOR | **Absorbed** — schema includes `$comment_compatibility` block naming additive-only major-version model; directive documents it. |
| 5. TTL salvage path vague | MAJOR | **Resolved by reframing** — under advisory model, stale claims are noise not blockers. No agent is stranded; archival not deletion. |
| 6. State-vs-memory dangling references | MAJOR | **Absorbed** — stale claims archive to `closed-claims.archive.json`; WS3A adds durable claim-closure history and decision-thread references to archived claims. |
| 7. Platform-adapter mirroring unspecified | MAJOR | **Absorbed** — WS4A made the canonical workflow surfaces explicit; WS5 observes real cross-platform engagement and routes adapter complexity only if evidence appears. |
| 8. Sidebar request deadlock | MINOR | **Routed to WS3B** — parallel sidebars allowed if promoted; no single-pair single-sidebar enforcement. |
| 9. Sidebar timeout owner-escalation pathway | MINOR | **Routed to WS3B** — explicit `.agent/state/collaboration/escalations/` directory if promoted, polled at consolidate-docs and surfaced in `repo-continuity.md`. |
| 10. Directive-rule-plan circular authority drift | MINOR | **Absorbed** — bidirectional cross-reference validated at consolidate-docs (WS0 + WS4). |
| 11. Threat model not named | MINOR | **Absorbed** — Design Principle 13 names trusted-agents threat model explicitly. |
| 12. Conversation file integrity | MINOR | **Absorbed** — same trusted-agents threat model; hostile-agent integrity is future PDR. |
| 13. WS5 observation criterion loose | MINOR | **Absorbed** — WS5 acceptance bounded: "three sessions logged, with explicit findings; no-sidebar is itself valid evidence; hook-trigger evaluation completed." |
| 14. Schema informed by schema-less observations | MINOR | **Absorbed** — WS1 task 4 explicitly documents which fields came from observed shared-communication-log usage and which from first-principles design. |
| Positive: workstream sequencing sound | POSITIVE | Acknowledged. |
| Positive: state-vs-memory boundary clear | POSITIVE | Acknowledged. |
| Positive: identity schema reuse from PDR-027 | POSITIVE | Acknowledged. |
| Positive: tripwire pattern mirrors register-identity | POSITIVE | Acknowledged; reinforced by Foundation Alignment section. |

## Foundation Alignment

This plan extends:

- **PDR-026** (Per-Session Landing Commitment) — claims are the
  per-session granularity for area-of-work commitment.
- **PDR-027** (Threads, Sessions, and Agent Identity) — identity rows
  in claims reuse the schema already in thread records.
- **PDR-029** (Perturbation-Mechanism Bundle) — Family-A Class-A.2
  tripwire pattern: `register-active-areas-at-session-open.md` is the
  parallel of `register-identity-on-thread-join.md`.
- **PDR-011** (Continuity Surfaces and Surprise Pipeline) — the
  collaboration memory class is a new continuity surface; the
  `parallel-track-pre-commit-gate-coupling` pattern goes through the
  existing capture→distil→graduate→enforce pipeline.
- **ADR-150** (capture→distil→graduate→enforce) — files first; code
  only when files prove the design. No orchestrator daemon, no
  per-platform binary.
- **ADR-125** (three-layer artefact model) — canonical content in
  `.agent/`; thin platform adapters; platform entrypoints.
- **`gate-recovery-cadence.plan.md`** (active in observability thread)
  — the build-breakage rule cites this plan's principle as the
  authority surface, preventing drift between the two surfaces.

## Documentation Propagation

| Surface | Update | Workstream |
|---|---|---|
| `AGENT.md` Essential Links | Add user-collaboration + agent-collaboration | WS0 |
| `AGENT.md` Memory and Continuity | Add `.agent/state/` + `.agent/memory/collaboration/` | WS1, WS2 |
| `practice-index.md` | Update collaboration link target | WS0 |
| `repo-continuity.md` § Active threads | Keep compact; rely on structured state plus `consolidate-docs` audit output unless real dashboard need appears | WS4A |
| Plan templates / Practice Core / ADR-facing docs | Add lifecycle triggers and first-class collaboration-state narrative | WS4A |
| `consolidate-docs.md` | Add stale-claim and decision-thread audits | WS1, WS3A |
| Platform adapters (`.claude/rules/`, `.cursor/rules/`, `.agents/rules/`) | Mirror new rule files | WS0, WS1 |
| Pattern index | Add collaboration patterns directory | WS2 |

## Follow-up Work (deferred — out of scope for this plan)

- **Hook-based reminders to inject the protocol into agent attention**.
  If WS5 evidence shows agents read the rules but do not consistently
  use the discovery and communication surfaces — i.e., the rules are
  discoverable but not followed — hook-based reminders may be installed
  to prompt the agent at the right moment ("you are about to edit a
  file in another agent's claim area; have you consulted the surface?").
  **Critically: hooks would be reminders, not enforcement.** They
  prompt; they do not refuse. This preserves the architectural-excellence
  frame of Design Principle 1: knowledge and communication, not
  mechanical refusals. Evidence-gating triggers are named per-WS in the
  operational seeds. Hook design is a separate plan if and when the
  evidence supports it.
- Per-platform tooling that reads `active-claims.json` and surfaces
  conflicts at edit time (currently agents read the file at session-open;
  edit-time surfacing is a richer experience). Same evidence-gating as
  hook reminders — defer until WS5 evidence shows session-open-only
  surfacing insufficient.
- Cross-repo collaboration (agents on different repos coordinating).
  This plan covers single-repo only; cross-repo is a future PDR.
- Hostile-agent threat model. This plan assumes trusted agents
  (Design Principle 13); a hostile-agent threat model — claim
  integrity, signed entries, tamper detection — is a future PDR if
  the trust assumption breaks down.

## Consolidation

After WS5 completes, run `/jc-consolidate-docs` over the new surfaces:

- Verify all forward references in `agent-collaboration.md` are filled.
- Verify the napkin's pending-graduations register is current.
- Verify the WS5 observation log has been read, lessons extracted, and
  refinement candidates surfaced to owner.
- Run `practice:fitness:informational` over the new directive and
  rules; address any soft-zone or hard-zone alerts before closing the
  plan.

## Dependencies

- **`gate-recovery-cadence.plan.md`** (active in `observability/active/`)
  must remain coherent with WS0's behavioural-rule citation. Bidirectional
  cross-reference at WS0 acceptance.
- **PDR-027** thread+identity schema is reused in claim entries; no new
  PDR required for WS1.
- **No new ADR** — this is a directive + rule + state-class addition,
  governed by existing ADR-125 (three-layer artefact model). If the
  collaboration layer's structural shape proves load-bearing for
  cross-repo or cross-team work in WS5, an ADR may be drafted then.

## Owner Direction (recorded 2026-04-25)

1. **Directive renaming + new directive creation as the anchor point**
   for this work. WS0 is non-negotiable as the foundation.
2. **Incremental implementation, smallest parts first**, with refinement
   informed by real usage (WS5).
3. **Long-term architectural correctness over short-term expediency**:
   each landed slice is architecturally complete for what it covers; no
   slice is fragmented to dodge harder pieces.
4. **Don't negotiate to avoid work**: if a piece is hard but
   architecturally necessary, it lands in this plan, not a "future
   work" footnote.
5. **Even the foundational stage WS0 installs a communication primitive**
   (an empty markdown log with no schema other than "use this"). Schemas
   come after observed usage, not before. This is files-first,
   schema-later in its strictest form.
6. **Knowledge and communication, not mechanical refusals**. The
   protocol provides agents with information about each other's work
   and means to discuss overlap. It does not mechanically refuse entry
   to claimed areas. Mechanical refusals would be routed around at the
   cost of architectural excellence — agents would find ways to bypass
   the gate, producing a worse outcome than honest agent judgement
   informed by shared knowledge. This principle is the central design
   commitment and constrains every workstream. (Settled 2026-04-25 in
   discussion of WS0/WS1 operational claims.)
7. **Platform independence as core value and intent**. Where a
   coordination behaviour can be platform agnostic, it should be. The
   protocol may use platform-specific tools to help build, inspect, and
   stress test the system, but those tools must never become the system
   or a required fallback. The local markdown/JSON/rules/commands/
   skills/hooks surfaces must be sufficient to operate fully. Settled
   2026-04-26.
8. **Operational seeds in every workstream**. Each WS lands with both
   mechanical acceptance (commit-time verifiable) and an operational
   seed (a named question to be answered by observation in subsequent
   sessions). WS5 reframes from a one-time observation phase into a
   consolidation harvest of all per-WS seeds.
9. **WS4A is jointly required with WS1** for the protocol to function
   operationally. Tripwire-loaded rules fire automatically on platforms
   that load them at session-open, but the workflow surfaces need
   explicit integration so the protocol is reliably automatic across
   all platforms. Settled 2026-04-25.
10. **Hooks are deferred and evidence-gated**. If rules and guidance
   prove insufficient to keep agents using the discovery and
   communication surfaces, hook-based reminders may be installed.
   Critically: hooks would be reminders, not enforcement. They prompt;
   they do not refuse. The evidence trigger is named in WS5 and the
   per-WS seeds. Settled 2026-04-25.
11. **No worktrees in any form**. Collaboration is on a shared working
    tree; isolation is conventional via claims, conversation, and
    sidebars.
