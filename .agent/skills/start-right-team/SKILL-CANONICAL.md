---
name: start-right-team
classification: active
description: Apply repository start-right grounding plus team bootstrapping for multi-agent sessions. Use when a coordinated team is starting, re-grounding, or choosing temporary collaboration responsibilities.
---

# Start Right (Team)

## Mode Selection

This SKILL is mode-aware. Read the section that matches your role; the rest
remains background.

- **sole-contributor**: solo session on a multi-agent-shaped thread. Run
  §"Non-Negotiable Foundation" and §"First Moves" (collapsing §1 peer-wait
  and §1a gate-runner election to a single self-run pass), skip §3
  temporary-responsibility coordination, and close out per §Closeout
  Contract "natural-boundary closeout".
- **team-closeout-owner**: the agent named to own the full session
  handoff. Run every section end-to-end including §Closeout Contract
  natural-boundary closeout AND the consolidator role inside §3.
- **team-member-non-closeout-owner**: participating agent not owning the
  closeout. Run §"Non-Negotiable Foundation" and §"First Moves" in full,
  participate in §3 temporary-responsibility coordination, and close out
  per §Closeout Contract "Team member closeout" (the boundary-scoped
  synthesis, not the full handoff workflow).

## Goal

Run the same shared repository foundation as `start-right-quick`, then add the
smallest team protocol needed for a coordinated multi-agent session.

This skill does not replace `start-right-quick` or `start-right-thorough`.
It layers team bootstrapping on top of the shared start-right requirements.

## Non-Negotiable Foundation

1. Read `.agent/skills/start-right-quick/shared/start-right.md` end to end.
2. Follow that workflow's referenced reading order. Do not replace it with a
   smaller subset for team sessions.
3. For Codex, Gemini, or any platform that does not auto-load canonical rules,
   read every `.agent/rules/*.md` file listed in `RULES_INDEX.md` before
   substantive work.
4. Run the live collaboration checks named by the shared workflow: identity
   preflight, active claims, shared comms, active commit queue, active plans,
   and git status/log.
5. If the task is architectural, high-risk, planning-heavy, cross-workspace, or
   explicitly asks for thorough grounding, apply `start-right-thorough` after
   the shared quick foundation and before team routing.

The controller or first registered agent must not assign implementation work
until each participating agent has either reported this foundation complete or
named the blocker preventing completion.

## Continuation Pointer Contract

When invoked as `start-right-team continue <thread>` or with equivalent
continuation language, treat the opener as a pointer and hypothesis, not as the
source of volatile truth.

1. Resolve the named thread through
   `.agent/memory/operational/threads/<thread-slug>.next-session.md`.
2. Read the continuation record before choosing a team route. It owns the
   current branch, controlling plan, next safe step, live acceptance bar, and
   any thread-specific team expectation.
3. Recompute current facts from live grounding surfaces before acting:
   identity preflight, active claims, shared comms, active commit queue, active
   plans, and git status/log.
4. Treat any team shape in the continuation record as a hint unless it is an
   owner instruction or live coordination has already assigned it. Solo work is
   valid when no team has registered; a team may self-organise only after live
   presence and coordination pressure are clear.
5. Keep volatile facts out of chat openers and permanent skill text. The skill
   owns routing behaviour; the continuation record owns current thread facts.

## Team Bootstrap

After the shared foundation is complete, establish a session-local operating
contract. Keep it lightweight and revisable.

### First Moves (ordered, non-negotiable)

Every participating agent in every team session executes these moves in
order, before any non-planning source edit:

1. **Start the all-channels comms monitor** (see
   [`.agent/rules/comms-all-channels-watcher.md`](../../rules/comms-all-channels-watcher.md)
   — required precondition for incoming visibility; the agent sees every
   event the team emits).
2. **Start the liveness heartbeat cron** (see
   [`.agent/rules/liveness-heartbeat-cron.md`](../../rules/liveness-heartbeat-cron.md)
   — required precondition for outgoing visibility; the team sees every
   active agent's continued presence at ≤4 min cadence, distinguishing
   live agents from retired ones).
3. **Post a team-start report** broadcast (§1 — §1 is the umbrella
   "Register Presence" section that owns the broadcast format AND the
   coordination rules; the broadcast declares identity, foundation
   status, intended boundary, inherited working-tree status, heartbeat
   cron status, and any preferred cycle).
4. **Wait for peer team-starts** to surface, then coordinate cycle /
   boundary assignment via comms (§1 cycle-overlap coordination rule
   and singleton-lane coordination rule).
5. **Verify the inherited working-tree state with ONE elected
   gate-runner** (§1a — required whenever any agent's team-start reports
   a non-clean inherited tree). One agent runs the relevant gates against
   the inherited state and posts a gate-state report to comms; all other
   agents wait for that report before opening source claims. No agent
   starts source work until the gate-state report is observable in
   comms. **This step structurally requires coordination and
   communication to be the precondition for work-start.**
6. **Suggest the user run `/rename`** per the shared start-right rule
   at
   [`start-right-quick/shared/start-right.md` §"Session Title — `/rename` Suggestion"](../start-right-quick/shared/start-right.md).
   The team-shaped intent-clarity moment is **coordination-resolution**
   (immediately after move 4 settles cycle / boundary assignment and
   move 5 reports a green inherited tree, or after the team has
   coordinated a non-green response with the owner), not session-open
   as in solo sessions. The rename must be surfaced BEFORE any
   significant implementation, source claim, or staging operation in
   move 7.
7. **Open the work claim** in `active-claims.json` for the agreed
   boundary only after cycle/boundary coordination resolves, the
   gate-state report is observable, and the rename suggestion has been
   surfaced. **If the claim being picked up carries a
   `handoff_record_path` field**, read the named handoff record under
   `.agent/state/collaboration/handoffs/` end to end BEFORE any source
   edit or comms post — this is a mid-cycle pickup per PDR-063 and the
   record's four named sections (current edit state, in-flight
   reasoning, decisions made, decisions deferred) carry the substance
   the prior agent froze at retirement (ADR-182 §Skill amendments).
   **If a coordinator pre-positioning event is already in the comms
   stream naming this agent as the incoming coordinator** (PDR-064
   Moment 1), the team-start broadcast in move 3 may declare
   intent-to-coordinate, but coordinator authority does not transfer
   until this agent broadcasts a distinct active-acknowledgement event
   (PDR-064 Moment 2) — see §Closeout Contract "Coordinator Handoff
   (Two Moments)".
8. **Proceed with the work** under the team cadence (§5) and
   traceability discipline (§4).

Source-claim opening BEFORE coordination resolves is the recurring
failure mode this order exists to prevent — see the singleton-lane
coordination rule in §1 and the cycle-overlap coordination rule below.
Source-work starting BEFORE the inherited-tree gate-state is verified
is the second failure mode this order exists to prevent — see §1a.
Silent agent retirement going undetected by the team is the third
failure mode this order exists to prevent — see
[`.agent/rules/liveness-heartbeat-cron.md`](../../rules/liveness-heartbeat-cron.md).

### 1. Register Presence

Each agent posts a short team-start report **before any source claim** and
before non-trivial work:

```text
Team start report:
- Identity:
- Foundation: complete / blocked by <path or command>
- Heartbeat cron status: started <cron_id or monitor task_id> / blocked by <reason>
- Inherited working-tree status: clean / non-clean (paths listed)
- Intended boundary: <files / paths / behaviour the agent expects to own>
- Claim status: none yet / pending team coordination / open <claim_id>
- Useful capability:
- Constraint or risk:
- Preferred boundary, if any:
- Gate-verification offer: willing to run inherited-tree gates if elected / observing only
```

`Intended boundary` is a non-binding declaration of *where* the agent expects
to work; `Claim status` reports the live registry state. `Heartbeat cron
status` reports the §0.5 precondition's live state — the cron or monitor
task id makes the heartbeat surface auditable; `blocked by` explains any
gap and the recovery plan. `Inherited working-tree status` is the agent's
observation of `git status` at session open; the team uses these reports
to decide whether §1a gate-verification fires. `Gate-verification offer`
declares willingness to take the elected gate-runner role; the team uses
this to coordinate the election in §1a. Role labels in the sections below
are examples, not doctrine — describe the boundary first and pick a label
that fits.

**Singleton-lane coordination rule** (added 2026-05-20 per singleton-lane
remediation plan §WS1; reframed 2026-05-21 to dialogue-over-competition
vocabulary). When the owner has launched identical `start-right-team`
prompts to multiple agents AND the next safe step on the relevant thread
is a narrow single-owner source slice (a singleton lane), the team-start
report is the coordination surface, not the claim. Concretely:

- An empty `active-claims.json` at session open means *"no team visible
  yet"*, NOT *"safe solo ownership of the singleton slice"*. Other
  identically-prompted agents may be in the same window and have not yet
  reached the registration step.
- A named peer in the owner's prompt can arrive after the first live
  registry and comms checks. Keep the all-channels watcher alive through
  final closeout, treat early solo analysis as provisional, and run a final
  comms reconciliation before claiming completion. If the named peer appears,
  explicitly map their findings against yours as accepted, partially accepted,
  or deferred rather than letting the first private review become the whole
  story.
- Each agent posts presence with `Claim status: none yet / pending team
  coordination` before opening any source claim on the singleton lane.
- An agent may open a source claim on the singleton lane only after one of:
  (a) all participating agents have posted presence and the team has
  coordinated exactly one agent to the source slice (first-broadcast
  establishes context; the agent who posted earliest is the natural owner
  by convention unless the team coordinates otherwise);
  (b) a documented team-routing lease exists (claim with
  `team_routing_required: false`, see WS2); or
  (c) sufficient time has elapsed that the agent reasonably concludes no
  team is present — the silent default, used with care because the failure
  mode is duplicate parallel claims.

Normal solo work and broad parallelisable work (where overlapping claims
are safe because the surfaces don't conflict) are unaffected by this rule;
the coordination contract applies only to singleton-lane work.

**Cycle-overlap coordination rule** (added 2026-05-21 from worked
precedent on the WS2.2 ↔ WS3.2 parallel pair; reframed 2026-05-21 to
dialogue-over-competition vocabulary). When two or more agents declare
overlapping intent on the same cycle / boundary in their team-start
posts, the team coordinates a complementary-boundary split through
dialogue. The substantive shape is **boundary clarification through
communication**, not a contest with winners and losers:

- **First-broadcast-establishes-context**. The agent whose team-start
  has the earliest `created_at` timestamp is the natural owner of the
  cycle by convention. This is a deterministic tie-breaker for when
  dialogue alone would loop, not a victory condition; the substantive
  coordination happens in the dialogue itself. Source authority is the
  comms event's `created_at` field, not any agent's self-reported memory.
- **Agents with overlapping intent adopt complementary boundaries in
  broadcast-arrival order**, picking from the remaining parallel-safe
  alternatives the opener / plan named. Each agent posts a follow-up
  event naming (a) the cycle whose context they now clear for the
  first-broadcaster, (b) the complementary cycle they now intend, and
  (c) the architectural rationale (if any) — framed as collaboration,
  never as personal-preference or competition.
- **No agent opens a source claim on a cycle with unresolved overlapping
  intent** until the team has coordinated complementary boundaries in
  comms. Team-start posts are the coordination surface; the claim is
  the commitment.
- **Equal-strength rationales do not stall the coordination chain** —
  first-broadcast-establishes-context resolves the boundary assignment
  cleanly so the team can proceed; the substantive design conversation
  can continue inside the chosen cycle's reviewer cadence.

Worked instance: in the 2026-05-25/26 n=2 enforcement bundle,
Torrid Firing Spark's Lane B team-start broadcast at
2026-05-25T21:52Z established the cycle context before Feathered
Winging Cliff's A1 broadcast. The agents used that ordering to
settle complementary boundaries through dialogue without owner
mediation.

This rule covers the parallel-pair case (multiple cycles available,
shared interest in who takes which). The singleton-lane coordination
rule above covers the single-owner case (one slice, N agents arriving).
Both reduce to: **team-start broadcast is the coordination surface;
source claims open only after the team has coordinated complementary
boundaries.**

### 1a. Verify Inherited Working-Tree State (one elected gate-runner)

**Added 2026-05-21 from worked precedent**: a three-agent session opened
on a branch carrying 16 inherited modified files from a prior session.
The thread record warned about the files but framed them with the prior
owner direction *"leave it"*. All three agents posted team-start
broadcasts claiming *"Foundation: complete"* without running gates
against the inherited state. The cascade (an upstream API schema bump
that had broken consumer workspaces) was discovered ~30 minutes into
the session when one agent eventually ran `pnpm turbo`. Every later
session failure was downstream of NOT having ground-stated the
inherited tree as a first move. Three agents independently fell into
the same overstated-foundation claim.

**When this step fires**: any time at least one team-start broadcast
reports a non-clean inherited working-tree status. If every team-start
reports a clean tree, this step is trivial (no gate-runner election;
proceed directly to move 5).

**The structural property the step enforces**: only ONE agent runs the
inherited-tree gates. All other agents wait for that agent's
gate-state report to be observable in comms before opening source
claims. Because only one agent runs but the team must know the
outcome, coordination and communication are the structural
precondition for work-start. There is no path where multiple agents
independently start source work on a non-verified inherited tree.

#### Electing the gate-runner

The election happens through comms after team-start broadcasts surface,
typically within the same coordination window as cycle/boundary
assignment:

- Agents who included `Gate-verification offer: willing to run` in
  their team-start are candidates. If exactly one volunteered, they are
  the elected gate-runner.
- If multiple agents volunteered, the team coordinates one of them
  through dialogue (first-broadcast convention applies as a tie-breaker
  if dialogue alone would loop).
- If no agent volunteered AND the inherited tree is non-clean, the
  agent whose team-start has the earliest `created_at` timestamp is the
  default gate-runner (the same convention used for cycle-overlap
  coordination). They may decline in their own follow-up broadcast,
  passing the responsibility to the next agent by broadcast-arrival
  order; the team coordinates a successor through dialogue.

The elected gate-runner posts a brief comms event confirming the
election before running gates. This makes the election observable to
all team members and prevents two agents from independently running the
same gates.

#### Running the gates

The elected gate-runner runs the gates appropriate to the inherited
tree's scope:

- If the dirty files are scoped to specific workspaces (visible from
  `git status` paths), run the per-workspace gates against those
  workspaces (e.g. `pnpm --filter <workspace> type-check`,
  `pnpm --filter <workspace> lint`, `pnpm --filter <workspace> test`).
- If the scope is unclear or spans multiple workspaces, run
  `pnpm check` against the inherited tree.
- The gate-runner does NOT modify the inherited tree during this step.
  The goal is observation of state, not fixes. Fixes (if needed) are
  coordinated through dialogue after the gate-state report is observable.

#### Posting the gate-state report

After running the gates, the gate-runner posts a comms event with the
gate-state report. The report includes:

- **Result**: green / non-green (named gates that failed).
- **Failure surface** (if non-green): full output of each failing
  gate, including affected files and error texts.
- **Diagnosis hypothesis** (if non-green): the gate-runner's best
  reading of what the failures represent (e.g. *"upstream schema bump
  cascaded into consumer workspaces"*, *"stale codegen artefacts"*,
  *"unrelated peer work-in-progress"*).
- **Proposed next step**: surface to owner / coordinate a fix plan /
  proceed (if green).

The report becomes part of the team's coordination evidence. Other
agents read it before opening source claims.

#### Acting on a non-green gate-state

If the gate-state is non-green:

- No agent opens source claims for cycle work until the team has
  coordinated a path forward.
- If the failures are surface-class (a known prior-session residue, a
  pre-staged cycle nearly ready to land), the team may coordinate a
  short fix tranche before resuming cycle work.
- If the failures are cascade-class (e.g. an upstream schema bump that
  has cascaded across multiple workspaces), the team surfaces to the
  owner for direction. The cascade-clear path may need a dedicated
  plan; cycle work pauses until the cascade clears.
- Either path is coordinated through dialogue, not by individual
  agents starting their own remediation in parallel.

#### When the gate-runner cannot complete the step

If the elected gate-runner gets blocked (their environment cannot run
the gates, they get pulled into another priority, etc.), they post a
comms event handing the responsibility to the next agent by
broadcast-arrival order. Other agents continue to wait until a gate-state
report from the new gate-runner is observable.

#### Cure shape

This step structurally cures the failure mode where agents read the
thread record's description of past tree state and conflate it with
current tree state. The thread record is a pointer-and-hypothesis,
not the source of volatile truth (same principle as the §Continuation
Pointer Contract at the top of this SKILL). The gate-state report is
the ground-truth check. One agent runs; everyone reads; coordination
is the precondition for work.

### 2. Name The Coordination Pressure

Before assigning responsibilities, identify the pressure the team is solving:

- source-bundle parallelism;
- review or challenge coverage;
- git, index, commit queue, or claim scarcity;
- next-slice scouting;
- liveness and inbox monitoring;
- owner-facing decision or escalation routing;
- closeout synthesis.

Do not start from a fixed role menu. Start from the pressure, then choose the
temporary responsibilities that match it.

### 3. Choose Temporary Responsibilities

Responsibilities are session-local, bounded, and allowed to change. Prefer
describing the boundary first and the role label second.

```text
Team route:
- Coordination pressure:
- Operating shape:
- Temporary responsibilities:
- Decision default if silent:
- Evidence expected:
- Expiry or next review point:
- Closeout owner:
```

Useful responsibility labels include `controller`, `implementer`, `reviewer`,
`marshal`, `scout`, `standby`, `consolidator`, and `curator`, but they are
examples rather than a required ontology.

The `curator` label names the substrate-care lane defined by PDR-081
(`curator-role-and-substrate-care-lane`). `Knowledge Curator` is the
owner-facing session label for the same responsibility. Curator is
distinct from `consolidator` — consolidator is the session-bounded
closeout-synthesis owner; curator owns the cross-session, lane-shaped
substrate-care work
(routing durable knowledge to permanent homes, draining the
graduations buffer, surfacing home-gaps as structural-cure proposals,
maintaining the per-pass curation log). A session may run a curator
lane in parallel with implementer / reviewer / marshal lanes; the
curator's traceability surface is the per-pass metadata file under
the operational-memory curator-passes directory.

**Coordinator delegates sub-agent launches.** The coordinator role is
to **route** work, not to **execute** it. Sub-agent launches —
Agent-tool invocations of reviewer agents (architecture-expert-fred,
assumptions-expert, code-expert, type-expert, and similar), spec-fetch
agents, exploration agents — are **implementer-class work**. A
coordinator who self-dispatches sub-agents has stepped out of the
coordinator role into an implementer role for the duration of the
dispatch, which is exactly the boundary the coordinator role exists
to protect.

The discipline:

- When work needs doing inside the session — including launching a
  sub-agent for a review pass, a spec fetch, or a focused exploration —
  the coordinator **routes the dispatch to a team member** through a
  directed comms event or a routing broadcast. The named team member
  runs the Agent-tool invocation, absorbs the verdict, and surfaces
  results back through the coordinator's routing surface.
- This applies whether the dispatch is reviewing a slice the
  coordinator already routed, or a fresh-eyes pass the coordinator
  wants to commission.
- The single legitimate exception is when the coordinator is also
  the only team member (a degenerate one-agent "team"). In that
  case the coordinator role collapses into the implementer role and
  the boundary does not apply.
- Slice-coordinators (per PDR-064 §"Partial / Slice-Scoped Coordinator
  Transfer") inherit the same discipline within their slice
  boundary: routing inside the slice is theirs to do; sub-agent
  launches inside the slice are routed to a slice team member.

The structural reason: a coordinator who self-dispatches a sub-agent
is unavailable for routing for the duration of that dispatch, which
silently re-creates the coordinator-less window that PDR-064 names
as the failure mode the role exists to prevent. The cost of
delegating is one routing event; the cost of self-dispatching is a
coordination gap that peers cannot detect from comms alone.

### 4. Work With Traceability

For every meaningful decision, verification, or coordination-visible action,
leave a brief trace in the appropriate current surface:

- comms for live peer coordination;
- claim and commit-queue entries for current ownership and git order;
- decision threads or escalations for structured async decisions;
- the future action-log surface once one exists.

Use concise audit language:

```text
Intent:
Reason:
Action:
Evidence:
Result:
```

Record intent and brief reasoning, not hidden chain-of-thought.

### 5. Maintain The Team Cadence

Once a team session is active, every participating agent must check for new
messages of any type at least once every 120 seconds until they close out or
are explicitly released from the team route. Use a tighter cadence when the
owner or controller sets one.

The message sweep must cover every live surface that can carry session
coordination:

- owner chat for current-turn direction;
- directed inbox / directed comms addressed to the agent;
- shared comms for team-wide updates;
- active claims and active commit queue for ownership or git-order changes;
- relevant conversations, sidebars, joint decisions, and escalations when the
  current route depends on structured async coordination.

Each participating agent must also report progress at least once every 120
seconds. A progress report can be a brief owner-facing update, a shared-comms
entry, or a directed reply, depending on the team route. It should name the
current state, any blocker, and the next action. Silence is only acceptable
after the agent has been explicitly released, closed out, or told to stop
reporting.

### 6. Revise The Route As The Work Changes

Roles can dissolve when their pressure disappears. A scout can become an
implementer only after a new route, claim, and evidence expectation are posted.
A marshal role should end when the shared scarcity it owns is clear.

If multiple viable routes remain, use a bounded proposal:

```text
Proposal:
Options considered:
Default if no reply by <UTC timestamp>:
Who must object:
```

Use rapid voting or consensus only as an experiment when the team explicitly
needs it; otherwise choose the lowest-authority resolver that can decide.

## Closeout Contract

Only one agent owns the full session handoff unless the owner says otherwise.
In team sessions this is normally the controller or the agent explicitly named
as closeout owner.

Every participating agent must close their own team presence explicitly before
leaving the session, even when they did not own the full handoff. At minimum,
they tell the other agents that their session is complete, name whether any
work remains in their boundary, and state the claim disposition.

**Final-heartbeat-end broadcast** (per §0.5 heartbeat contract). When an
agent closes out cleanly, they MUST emit a final heartbeat event with body
naming the session-end state and the disposition of their heartbeat cron
(stopped explicitly, or letting it die with the session). This prevents
the 10-minute retirement rule from firing false-positive on an agent who
closed cleanly but whose heartbeat cron stopped emitting. The final
heartbeat is paired with the team-member closeout broadcast below and
serves as the team's signal that the agent has stood down by intent.
Suggested subject format:

```text
Heartbeat-end: <agent_name> (<session_id_prefix>) — session-end, closeout broadcast follows
```

The default closeout state is **no active claims retained**. Relinquish every
claim the session opened before leaving. Keep a claim active only when there is
a specific handoff reason for a follow-on agent, and make that reason explicit
in the closeout message: which claim remains, what boundary it protects, who or
what session should pick it up, and when it should be released if the follow-on
does not arrive.

When a later agent picks up a session, claim, or boundary that was retained for
handoff, they must notify the other agents before acting. The pickup message
must name the retained claim or boundary, confirm whether they are continuing,
closing, or replacing that claim, and state their next coordination-visible
action.

Non-closeout agents provide a boundary-scoped synthesis instead of running the
full `session-handoff` workflow:

```text
Team member closeout:
- Boundary owned:
- Outcome:
- Evidence:
- Claims / queue / git state:
- Session complete announcement:
- Retained claims, if any, and handoff reason:
- Pickup notification required for follow-on agent:
- Heartbeat-end broadcast emitted: yes <event_id> / no (reason)
- Surprise or changed understanding:
- Blockers or risks:
- Handoff needed:
```

The closeout owner reads those syntheses, current comms, directed messages,
claims, queue state, git status/log, and the relevant plan before updating
canonical continuity surfaces.

### Mid-Cycle Retirement (distinct closeout mode)

Mid-cycle retirement is a distinct closeout mode alongside the
natural-boundary closeout above, governed by
[PDR-063](../../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md)
with substrate phenotype in
[ADR-182](../../../docs/architecture/architectural-decisions/182-mid-cycle-handoff-record-substrate.md).
It fires when an agent must retire before the natural boundary they
were working toward — almost always under context-budget pressure
during rotating-cast operation. Natural-boundary closeouts continue to
use the contract above unchanged.

**Triggers** (whichever fires first):

- **Quantitative**: context usage ≥ 80% of the agent's bounded budget.
- **Post-commit**: immediately after landing any commit, the agent
  re-evaluates remaining budget against the next-cycle floor (TDD
  authoring + reviewer absorption + gate suite) and retires if the
  remaining budget would not cover one more cycle with margin.

The 80% quantitative trigger has priority — an agent at 85% mid-cycle
does not get to push for one more commit.

**The five-step protocol** (PDR-063 §Decision is authoritative; this
SKILL names the protocol shape and points at it):

1. **Sense approaching budget** at one of the triggers above.
2. **Freeze work-in-progress to a structured handoff record** under
   `.agent/state/collaboration/handoffs/` naming the four required
   sections — *current edit state*, *in-flight reasoning*, *decisions
   made*, *decisions deferred*. The record is a first-class artefact,
   content-addressed by `claim_id`, retained until the claim closes.
3. **Extend the active claim** by setting the optional
   `handoff_record_path` field on the active-claims entry pointing at
   the new handoff record. No other schema field changes; existing
   readers ignore the field without breakage.
4. **Hand off via a directed comms-event** carrying `message_kind:
   "mid-cycle-handoff"` per ADR-182 §"Comms-event message_kind value".
   The event body carries the claim identifier, a pointer to the
   handoff record, a ≤200-word human summary, and the retiring agent's
   identity tuple per PDR-027.
5. **Retire** with a final retirement broadcast on the existing
   team-cadence shape, naming the handed-off claim and the receiving
   agent (if known) so the team sees the retirement is not abandonment.

The receiving agent's pickup contract is named in §"First Moves" move 6:
read the handoff record before any source edit. The
`mid-cycle-handoff` `message_kind` is reserved for cycle-claim
handoffs and **may not be used for coordinator role transitions** —
those use the two-moments shape below.

### Coordinator Handoff (Two Moments)

Coordinator role transitions have two distinct moments per
[PDR-064](../../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md);
conflating them creates a coordinator-less window the team cannot
detect.

**Moment 1 — Pre-positioning (information transfer only).** The
outgoing coordinator broadcasts a `narrative` event with the
conventional title *"Coordinator pre-positioning: \<outgoing\> →
\<incoming\>"* carrying the team roster, slice state, outstanding
work, standing notes, and the proposed incoming coordinator (or the
criteria for self-selection if not yet known). Pre-positioning is
information transfer only — the outgoing coordinator retains all
routing authority, all scheduled coordinator-loop ticks, all
reviewer-dispatch authority, and all commit-window mediation
authority.

**Moment 2 — Active-acknowledgement (authority transfer).** Authority
transfers only when the incoming coordinator broadcasts a distinct
active-acknowledgement event with the conventional title *"Coordinator
role acknowledgement: \<incoming\> from \<prior\>"*, referencing the
pre-positioning event via `in_response_to`, naming the prior
coordinator, and declaring the cadence the incoming coordinator will
adopt. The outgoing coordinator continues to hold authority until this
broadcast lands in the comms stream.

**Cron / cadence boundary.** Any coordinator-cadence cron, scheduled
wakeup, or persistent monitor owned by the outgoing coordinator
**continues to run through Moment 1**, **ends at Moment 2**, and
**never goes dark between them** within the same role-authority
window. Cancelling the cadence at Moment 1 is the proximate cause of
the coordinator-less window this rule structurally cures.

**Intersection with PDR-063.** When the outgoing coordinator is
retiring mid-cycle under token pressure, BOTH protocols fire. The
per-claim cycle handoff uses the `mid-cycle-handoff` `message_kind`
(PDR-063 Step 4 / ADR-182); the role-level pre-positioning is a
distinct `narrative` broadcast covering coordinator-role context
(which is broader than any single cycle claim). The two are distinct
events — the handoff record carries cycle-claim substance; the
pre-positioning event carries coordinator-role substance. **Do not
use `mid-cycle-handoff` for coordinator role transitions.**

### Closeout consolidation discipline for failure-mode events

Per ADR-183 §"Skill amendments" closeout discipline, once the
failure-mode capture substrate is live (both ADR-183 tranches landed),
agents at session close read their OWN session's failure-mode
comms-events from `.agent/state/collaboration/comms/` and consolidate
them into napkin / `distilled.md` entries — rather than capturing
fresh at session close. The consolidation surface remains the
absorption destination for failure-mode substance; the comms stream
becomes the first capture vehicle during the session, and closeout
consolidation reads the session's already-captured events forward into
the doctrine pipeline (PDR-014 capture → distil → graduate → enforce).

## Failure Handling

If a team member cannot complete the shared start-right foundation, stop that
agent's assignment and route the blocker through comms. If the controller and a
team member disagree about responsibility boundaries, open a focused sidebar or
decision thread rather than widening source ownership silently.
