# Team Self-Organisation Experiment Notes

**Captured**: 2026-05-14
**Thread**: `agentic-engineering-enhancements`
**Experiment slice**: WS1 token measurement display from
`fitness-token-measurements-and-frontmatter-mandation.plan.md`
**Status**: living analysis notes; not a final report.

## Purpose

Record what happened when seven agents received the same owner direction,
including the `start-right-team` skill, and entered the same narrow work lane.

This is not framed as a failure record. The experiment produced useful live
evidence about the current blockers to self-organising agent teams of arbitrary
size. The goal is to preserve the state, analyse the coordination mechanics,
and extract changes that make future teams self-organise earlier and more
reliably.

## Initial Experiment Shape

The owner direction was intentionally identical across agents:

- continue the `agentic-engineering-enhancements` thread;
- run `jc-start-right-team`;
- re-check live claims, commit queue, git status, and plan status;
- begin at WS1 only;
- keep the path set narrow around Practice fitness token measurement;
- do not skip ahead to token frontmatter, convention docs, or manifest
  coverage.

The target work was narrow enough that only one implementation could land
cleanly. That makes it a useful stress test for whether agents can infer a
team topology from live coordination pressure rather than from separate local
instructions.

## Early Observations

### 1. Local compliance did not automatically become team organisation

Multiple agents appear to have followed the start-right sequence locally:
identity preflight, live claim checks, queue checks, git status, and plan read.

The emergent system behaviour was still overlapping ownership on the same WS1
implementation files. The local rule "register a claim before editing" was not
enough by itself to produce the global rule "collapse to one implementer".

### 2. The first overlap was the important coordination moment

The decisive event was not source editing. It was the moment an agent saw one
or more fresh claims covering the same narrow file set.

At that moment, the required work changed from implementation to routing:

- name the coordination pressure;
- propose a temporary team route;
- select or recognise one implementer;
- move the remaining agents into reviewer, scout, standby, marshal, or
  closeout roles;
- close or replace duplicate claims.

The current protocol says roles should emerge from coordination pressure, but
the observed behaviour suggests agents may need a stronger tripwire for
"duplicate fresh claims on the same narrow path set".

### 3. Standing down is safe, but insufficient as team organisation

At least one agent, Fronded Foraging Moss, saw the duplicate claims and stood
down from source work. That avoided adding another source collision.

However, standing down alone is passive. It does not organise the agents who
already opened claims. For arbitrary-size teams, a useful behaviour may need
to be:

1. do not add another overlapping claim;
2. broadcast the collision as the current coordination pressure;
3. propose the minimal route;
4. request duplicate-claim closure or explicit role conversion.

### 4. Claim registration can amplify a herd effect

When several agents receive identical instructions and start close together,
the claim system can record the herd rather than prevent it. This is valuable
evidence: a registry is a visibility surface, not a coordination algorithm.

The registry needs either:

- an agent behaviour rule that reacts to newly visible collisions; or
- tool support that surfaces "this is now a team-routing event" when claims
  overlap on a narrow implementation slice.

### 5. The experiment preserved an important distinction

The source lane was about content-only token measurement, not raw-file context
cost and not token frontmatter semantics. The overlap did not appear to blur
that technical boundary in the starting instructions.

That matters because the coordination issue was not caused by ambiguous WS1
scope. The work was specific enough; the blocker was team formation.

## Evidence To Harvest

Collect these records before final analysis:

- each agent's team-start report;
- active-claims snapshots around the first duplicate claim and the peak claim
  count;
- directed comms and shared comms during claim collision, implementation,
  validation, and handoff;
- each agent's session handoff;
- git status and staged/index state during the overlap;
- the final WS1 source diff and validation output;
- `.agent/experience/2026-05-14-ws1-token-measurement-team-handoff.md`;
- updates in `napkin.md`, repo continuity, and the thread record.

## Working Hypotheses

### H1: Start-right-team needs an overlap escalation trigger

Current start-right-team guidance tells agents to name coordination pressure,
but it may rely too much on discretionary judgement. A concrete trigger could
be:

> If two or more fresh claims cover the same narrow implementation path set,
> stop implementation routing and open a team-routing message before further
> source edits.

### H2: The first active claimant is not always the right implementer

Naively choosing "first claimant wins" would reduce collision, but may not
optimise for quality, context, or validation ability. Better route selection
may include:

- who has already read the plan and source;
- who has the cleanest claim scope;
- who has already started source edits;
- who can validate fastest without widening scope;
- whether another agent is better placed as reviewer or marshal.

### H3: Role conversion needs a low-friction command shape

Agents may keep stale implementation claims because closing and reopening as a
reviewer or standby feels like extra ceremony. If true, the tooling could make
role conversion explicit:

- `claims convert --to-role reviewer`;
- `claims narrow --file ...`;
- `claims relinquish --reason "duplicate WS1 implementer claim"`;
- a generated route message summarising the new team shape.

### H4: Identical owner prompts need a rendezvous phase

For arbitrary-size teams, identical prompts may need a very short rendezvous
phase before any implementation claim:

1. all agents post presence;
2. all agents wait for a small fixed window or first collision signal;
3. agents elect or infer the implementer route;
4. only then does the implementer open the source claim.

This may be unnecessary for broad file sets, but narrow singleton slices need
it.

## Questions For Record Analysis

1. Which agent first had enough evidence to detect the overlap?
2. Did any agent name "coordination pressure" before opening a source claim?
3. Did any agent propose a team route rather than an individual boundary?
4. Did duplicate claims close before, during, or only after handoff?
5. Did any validation or source work duplicate effort?
6. Was there a clear closeout owner, or did closeout ownership emerge late?
7. Which records made the experiment legible, and which records made it hard
   to reconstruct?

## Candidate Practice Changes

These are not decisions yet:

- add a duplicate-claim tripwire to `start-right-team`;
- add an explicit arbitrary-size-team rendezvous pattern;
- add claim conversion or relinquish helpers to `agent-tools`;
- teach `active-agents` or `claims list` to group overlapping fresh claims;
- make "registry is not coordination" a durable note in the team skill;
- add an experiment-report template for deliberate multi-agent drills.

## Current Analysis Boundary

This note is only the first capture. It records the framing correction:
experiment, not failure. It also records the initial observation that local
start-right compliance did not by itself create a self-organising team.

Further analysis should append evidence rather than overwrite the first pass.

---

## Deep Dive Pass 1 — Evidence Synthesis

**Captured**: 2026-05-14 by Fronded Foraging Moss.

### Surfaces Read

This pass sampled these surfaces:

- live `identity preflight`, active claims, active commit queue, git status,
  and staged index;
- current and recent `.agent/state/collaboration/comms/*.json` events from the
  WS1 window;
- relevant `closed-claims.archive.json` entries for the WS1 agents;
- current `napkin.md` additions from Salty, Feathered, and Floating;
- repo-continuity, the agentic-engineering thread record, pending-graduations,
  and the controlling token-measurement plan diffs;
- the WS1 experience note;
- `start-right-team`, `register-active-areas-at-session-open`,
  `agent-collaboration`, and adjacent rules/directives;
- Codex session logs for corroborating the identical opener and current
  thread-local messages;
- Codex memory registry entries for prior standby/controller patterns.

This is still not exhaustive. The next pass should read each Codex session log
for the seven agents directly if exact per-agent action ordering matters.

### Timeline

All timestamps are UTC on 2026-05-14.

| Time | Evidence | Interpretation |
| --- | --- | --- |
| 11:23 | Quiet Cloaking Mist emits the next-session opener: run `jc-start-right-team`, re-check live claims/queue/status/plan, begin WS1 only, keep pathspec tight, preserve content-only vs raw-file distinction. | The starting instruction was clear, narrow, and identical. |
| 11:36:24 | Floating opens claim `030be163` on `validate-practice-fitness.ts`, its unit test, and `src/practice-fitness`. | First observed WS1 source claim. |
| 11:36:26 | Shaded opens claim `ed9e4df9` on the same source area. | Collision begins within two seconds. |
| 11:36:31 | Breezy opens claim `99ffa59a`; Foamy opens claim `f1726ad2`. Both report empty live claims/queue before opening. | Multiple agents had locally valid empty-board evidence. |
| 11:36:37 | Zephyrous opens claim `db6d268b`; their team-start says active claims and queue were empty before claim open. | The shared surface was changing faster than each agent's grounding loop. |
| 11:36:40 | Feathered opens two claims, one on source and one on script-test movement. | Peak collision includes source and test ownership. |
| 11:37:20 | Fronded reports duplicate claims and stands down without opening a source claim. | First observed passive containment by a non-implementing agent. |
| 11:39:15 | Feathered closes both claims after seeing duplicate claims and partial implementations; focused Vitest is failing at this point. | First explicit duplicate-claim de-escalation. |
| 11:40:15 | Foamy posts an overlap decision: continue as source reconciler only because source tree already contains overlapping partial implementations; no index work due to staged rename. | A team role emerges, but after overlap rather than before it. |
| 11:41:46 | Zephyrous closes their source claim and stands down after Foamy has become source reconciler. | Role conversion happens manually through comms and claim closure. |
| 11:42:44 | Salty reports stale-comms cleanup and abandoned queue clearing; later notes they missed live claims by probing `.active_claims` instead of `.claims`. | A separate shared-state mutation overlapped WS1 because schema/key mismatch made active claims invisible. |
| 11:43:48-11:44:58 | Floating, Shaded, Breezy, and Foamy each close with WS1 validation green; Foamy reports `git diff --check` green and no index work due staged rename risk. | Technical convergence is strong; commit/index discipline prevented bundle absorption. |
| 12:27-12:31 | Owner asks for coordinated handoff; Floating becomes canonical handoff owner; Zephyrous, Shaded, Breezy, Feathered, Foamy provide supporting synthesis. | The closeout team topology becomes explicit only after owner intervention. |

### What Happened

The simple version is:

1. The owner gave several agents the same clear, narrow implementation prompt.
2. Each agent ran the expected start-right checks.
3. Several agents observed an empty active-claims registry and empty queue
   within the same small time window.
4. Each inferred a locally valid `solo implementer` route.
5. Claims became visible only after multiple agents had already crossed the
   claim-open boundary.
6. The team then self-corrected enough to converge technically:
   Fronded/Feathered/Zephyrous stood down, Foamy reconciled source, others
   validated, and Floating later synthesised handoff.

The more precise version is: the system did self-organise *late*. It did not
self-organise before duplicate work began. The useful question is therefore not
"why did agents fail to coordinate at all?", but "why did coordination emerge
only after the expensive collision signal existed?"

### What Worked

- **Scope was preserved.** Multiple agents independently reported no WS2+
  token frontmatter, convention, or manifest work.
- **The technical invariant held.** The final reported implementation preserved
  content-only fitness token counts and raw-file context-cost as separate
  concepts.
- **Claims provided auditability.** The collision is reconstructable because
  claims and comms were written.
- **Claims prevented worse git/index outcomes.** Agents avoided staging or
  committing while overlap and a staged-rename concern existed.
- **Manual role conversion happened.** Feathered and Zephyrous closed claims;
  Foamy became source reconciler; Floating became handoff synthesiser.
- **The handoff preserved friction.** Napkin, plan, continuity, thread record,
  and experience note all record positives and blockers rather than flattening
  the session into "green".

### What Did Not Work Yet

- **The first empty-board read was over-trusted.** "No active claims" was
  interpreted as "I may become sole implementer", not as "I should rendezvous
  briefly because N identical agents may also be starting".
- **Team route selection was not atomic.** The visible route appeared as several
  independent claims rather than one team decision.
- **`start-right-team` allowed solo work when no team was registered.** That is
  useful for ordinary sessions, but in an identical multi-agent prompt it
  created a locally correct but globally colliding behaviour.
- **No one used a bounded proposal early.** The skill provides a proposal shape,
  but the first agents did not use it because they had not yet observed a team.
- **The claim registry is not a coordinator.** It records entries; it does not
  group overlapping fresh claims, elect a reconciler, or ask agents to back off.
- **Schema/key ergonomics caused a separate overlap.** Salty's `.active_claims`
  probe returned zero while real claims lived under `.claims`, causing stale
  comms cleanup to overlap Breezy's broad comms claim.
- **Closeout ownership emerged late.** Floating became canonical handoff owner
  only after the owner asked all agents to hand off in a coordinated way.

### Disconfirming Evidence

Several tempting diagnoses are too simple:

- **"The starting prompt was ambiguous."** Disconfirmed. The opener was narrow:
  WS1 only, exact plan, exact path family, explicit non-goals.
- **"Agents ignored start-right-team."** Partly disconfirmed. The team-start
  reports show agents ran identity, claims, queue, git status, and plan checks.
  The problem is more about what they inferred from an empty result.
- **"Claims are useless."** Disconfirmed. Claims made the collision visible,
  preserved ownership evidence, and helped prevent unsafe staging.
- **"The team did not self-correct."** Disconfirmed. Agents did stand down,
  appoint a source reconciler de facto, validate independently, and later
  collect handoffs.
- **"A single mandatory controller is obviously the answer."** Not proven. The
  P8 controller window shows a controller can work, but mandatory controllers
  may reintroduce hierarchy and reduce the simple identical-prompt interface.

### Current Causal Model

The coordination gap looks like a race between three clocks:

1. **Grounding clock** — each agent reads live state and sees empty claims.
2. **Claim-write clock** — each agent writes their own claim seconds later.
3. **Team-awareness clock** — agents read peer claims/comms after claims have
   already landed.

The current protocol makes claim registration the first durable act after an
empty read. In a simultaneous-launch experiment, the claim-write clock beats the
team-awareness clock. The system therefore produces multiple "solo implementer"
routes before any agent has enough shared evidence to select a team shape.

The gap is not mainly "agents need better intentions". It is missing negative
feedback at the empty-board moment. There is a positive feedback loop:

> empty board -> claim implementation -> more agents discover collision ->
> more comms/claims/state churn -> harder reconstruction.

The system needs a matching governor that preserves simplicity:

> identical team prompt + narrow singleton lane -> rendezvous/backoff before
> implementation claim, or automatic claim-collision grouping immediately after
> claim open.

## Steering Approaches

Each option preserves the owner-facing interface: hand N agents the same
starting statement, containing `start-right-team` and a pointer to a
continuation surface / plan.

### Approach A — Rendezvous Before Source Claim

Rule: if a prompt explicitly uses `start-right-team` and the plan's next step is
a narrow singleton implementation slice, agents post presence first, then wait a
small bounded window before opening a source claim.

Possible protocol:

1. Read live state.
2. Post `Team start report` with claimed paths set to `intended`, not claimed.
3. Wait until either:
   - a short deadline passes, e.g. 30-60 seconds; or
   - a controller/implementer route appears; or
   - a duplicate intended path appears.
4. Select source owner by deterministic tie-break or route proposal.
5. Only the selected implementer opens source claim.

Pros:

- Prevents the first collision, not just later staging collisions.
- Keeps owner prompt identical.
- Makes team formation visible before source mutation.

Cons:

- Adds latency to cases where N=1.
- Needs a clear "narrow singleton" detector, or agents may over-rendezvous.
- A pure waiting rule can create idle agents unless route conversion is easy.

### Approach B — Deterministic Election From Identical Prompt

Rule: after presence posting, agents compute the same deterministic tie-break
from visible identities and plan slice, then the winner implements while others
switch to support.

Possible tie-break inputs:

- lexicographic `agent_name`;
- earliest `created_at` team-start event;
- stable hash of `thread + plan + ws + agent_id`;
- capability declared in team-start report.

Pros:

- No owner mediation.
- Scales to arbitrary N.
- Avoids debate when all agents have equivalent context.

Cons:

- Earliest event favours clock timing, not suitability.
- Lexicographic/hash tie-break can pick a weaker implementer.
- Capability-based selection requires judgement, which is harder to make
  deterministic.

Hybrid: deterministic default unless a peer posts an objection with concrete
evidence by a short deadline.

### Approach C — First Claim Becomes Provisional Coordinator, Not Implementer

Rule: in a `start-right-team` simultaneous launch, the first agent to claim a
narrow singleton source slice does not automatically become implementer. They
become provisional router for that slice and must post a route:

- implementer;
- reviewers / validators;
- standby;
- closeout owner;
- commit marshal if needed.

Pros:

- Reuses existing claim mechanics.
- Makes the first durable writer responsible for team shape.
- Avoids a separate controller role in the owner prompt.

Cons:

- In this experiment, several claims landed within seconds; a first-claim rule
  needs tooling to make "first" obvious.
- The first claimant may already be editing before routing.
- Requires strong wording: claim-open is not permission to edit until route is
  posted for team prompts.

### Approach D — Collision Tripwire After Claim Open

Rule: any agent that opens a claim must immediately re-read active claims and
run an overlap grouping check. If duplicate fresh claims exist, source edits
pause until a route is posted.

Pros:

- Minimal change to current habit.
- Catches the actual race condition observed here.
- Avoids forcing a rendezvous when N=1.

Cons:

- Still allows duplicate claims, but stops duplicate edits earlier.
- Depends on every agent doing the post-claim re-read.
- Needs overlap grouping to be ergonomic; manual glob comparison is brittle.

Tool support could make `claims open` return:

```text
Overlap detected:
- 5 fresh claims overlap agent-tools/src/practice-fitness/**
Suggested next action: post team route; do not edit source until route exists.
```

### Approach E — Tool-Level Grouped Claim Suggestions

Rule: keep the human/agent protocol light, but make the CLI surface the team
shape whenever it detects overlapping fresh claims.

Possible commands:

- `claims overlaps --active ...`;
- `claims open` emits overlap warnings and suggested route;
- `active-agents --group-overlaps`;
- `claims convert --role reviewer|standby|closeout`;
- `claims relinquish --reason duplicate-claim`;
- `team route propose --from-active-claims`.

Pros:

- Reduces reliance on each agent manually comparing patterns.
- Supports arbitrary N better than prose-only discipline.
- Keeps the owner prompt unchanged.

Cons:

- Needs careful design to avoid mechanical lock semantics.
- Overlap detection on globs can be approximate.
- Could create false confidence if agents treat CLI suggestions as authority.

### Approach F — Explicit Negative Feedback In The Skill

Amend `start-right-team` with a small governor:

> Empty claims are not proof of solo ownership when the owner has launched a
> team with identical instructions. For a narrow singleton implementation
> slice, post presence and perform a second-pass team check before source
> mutation. If duplicate claims appear, treat that as the coordination pressure
> and route roles before continuing.

Pros:

- Directly teaches the lesson.
- No new tool needed for first improvement.
- Preserves the current interface.

Cons:

- Prose may be missed under pressure.
- Does not solve ergonomic issues around claim conversion or overlap grouping.

### Approach G — Plan-Level Team Topology Hint

Plans could optionally mark a workstream as:

```yaml
team_topology:
  singleton_implementation: true
  default_support_roles: [validator, reviewer, closeout]
```

Agents receiving identical prompts would then know that N agents should not all
claim implementation.

Pros:

- Puts topology near the work, not in every prompt.
- Helps distinguish broad parallelisable work from singleton source slices.

Cons:

- Adds planning burden.
- Risks hard-coding topology too early.
- Does not help if agents skip the field or if topology changes at runtime.

## Provisional Recommendation

The best near-term combination appears to be:

1. **Skill amendment**: add the duplicate-claim / singleton-lane governor to
   `start-right-team`.
2. **Post-claim recheck**: require a second active-claims read immediately
   after opening a source claim in `start-right-team` sessions.
3. **Tooling follow-up**: add overlap grouping to `claims open` or
   `claims list`, plus a low-friction `claims relinquish` / `claims convert`
   helper.
4. **Optional rendezvous experiment**: run a second experiment with the same
   identical prompt but a 30-60 second presence-only rendezvous before source
   claims.

This preserves the owner-facing simplicity while adding the missing negative
feedback loop at the exact point the evidence shows the runaway began.

## Assumptions To Keep Questioning

- **Assumption: all seven agents truly received the same prompt at the same
  time.** Current evidence supports identical opener text, but exact launch
  timing should be verified from each session log.
- **Assumption: source edits began before the overlap was visible.** Claim and
  comms timing strongly suggests this, but per-agent tool logs should verify
  when files were first edited.
- **Assumption: one implementer is always best for singleton slices.** It may
  be true for source mutation, but multiple independent validators were useful.
- **Assumption: the right answer is more protocol.** It may instead be better
  tooling: grouped overlap warnings, route suggestions, and claim conversion.
- **Assumption: broad `.agent/state` claims are acceptable support claims.**
  Breezy's broad comms claim made Salty's cleanup overlap visible, but broad
  shared-state claims may also increase false-positive coordination pressure.

## Evidence Gaps For Pass 2

- Read exact per-agent Codex session logs for first edit time, first post-claim
  recheck, and first awareness of peer claims.
- Reconstruct active-claims snapshots over time rather than relying on final
  closed-claim order.
- Inspect the transient staged rename evidence if still recoverable.
- Verify whether `comms render` can mutate `active-claims.json` or whether
  Salty observed a concurrency coincidence.
- Compare this experiment against the P8 controller window, where Pearly first
  posted a controller route and told standby developers to wait for assignment.
- Test a small CLI prototype or manual query for grouping overlapping claims by
  glob/path family.

---

## Deep Dive Pass 2 — Session-Log Corroboration

**Captured**: 2026-05-14 by Fronded Foraging Moss.

This pass sampled the Codex JSONL session records for the seven WS1 launch
agents plus the approval-review artefact that captured one failed focused test
run. It was not a full transcript reduction, but it did check the exact
agent-local narration and claim commands around the first collision.

### Claim Burst

The source-claim burst was tighter than the first pass made explicit:

| Claimed at | Agent | Claim | Local interpretation |
| --- | --- | --- | --- |
| 11:36:24 | Floating Lifting Thermal | `030be163` | team-start says live claims empty, queue empty, git clean, plan ready; preferred boundary solo implementer unless live peer appears. |
| 11:36:26 | Shaded Shrouding Mask | `ed9e4df9` | live check found no active claims, no queue, clean git status before registration; preferred boundary solo implementer unless coordination pressure appears. |
| 11:36:31 | Breezy Sailing Pier | `99ffa59a` | live checks show no active claims, no queue, clean git status, no directed inbox messages; route says coordination pressure low and Breezy owns WS1 implementation/checks. |
| 11:36:31 | Foamy Fathoming Sail | `f1726ad2` | live claims and queue were empty before the claim; route says solo implementation with next review before staging or if live claims/queue change. |
| 11:36:37 | Zephyrous Circling Current | `db6d268b` | active claims and queue were empty before claim opened; preferred boundary solo implementer unless another live agent appears. |
| 11:36:40 | Feathered Darting Kite | `3af3b4e4` | active claims empty, active queue empty, directed inbox clear, git status/index clean; route says solo implementer unless live coordination changes. |
| 11:36:40 | Feathered Darting Kite | `50339228` | second support claim on moving validator unit coverage. |

Interpretation: the collision was not seven agents ignoring claims. It was a
launch race where several agents crossed from "empty board" to "claim source"
within sixteen seconds. The protocol did not contain a negative feedback step
between "no claims visible" and "I may become the implementer".

### First Awareness Signals

Per-session narration gives a useful gradient:

- Fronded saw Shaded's new claim at 11:36:52 and six overlapping claims by
  11:37:12, then stood down without opening a source claim.
- Feathered noticed several fresh claims and partial implementations at
  11:38:24, then closed both claims at 11:39:15 and recommended one remaining
  implementer become sole reconciler.
- Floating noticed overlapping claims and another `fitness.ts` shape at
  11:38:36, paused broad edits, then kept merging around live file contents.
- Foamy noticed extra untracked modular files at 11:38:52 and later posted the
  de facto source-reconciler decision at 11:40:15.
- Shaded noticed a richer `src/practice-fitness` extraction at 11:38:51 and
  folded into that live shape rather than flattening it.
- Zephyrous saw duplicate modular shapes at 11:38:59, then stood down at
  11:41:46 after Foamy declared source reconciliation.
- Breezy saw staged rename residue and overlapping state around 11:39-11:40,
  then closed without staging once validation was green.

Interpretation: once agents saw shared evidence, several behaved
coordination-sensitively. The gap is earlier than that: the system needed a
team-routing interlock before or immediately after the claim burst.

### Source Work Was Not Pure Duplication

Disconfirming a harsher reading: the overlap did not simply produce seven
independent final implementations. The logs show agents reading each other's
new `src/practice-fitness` shapes and reconciling into the live tree:

- Foamy explicitly reduced the tree to one coherent split and continued as
  source reconciler.
- Shaded and Zephyrous both noticed duplicate module shapes and adjusted toward
  the modular live files.
- Floating described aligning exported names and fixture counts with the
  already-present `fitness.ts`/modular shape.
- Feathered stopped when focused Vitest exposed the inconsistent transitional
  tree.

This is important because it means the raw behaviour was closer to
"uncoordinated collaborative merge under pressure" than "seven isolated
solutions". That explains why the technical result converged despite the
coordination miss, but it also explains the high cognitive and state cost.

### Skill Text Pressure Point

The canonical `start-right-team` continuation contract currently says:

> Solo work is valid when no team has registered; a team may self-organise only
> after live presence and coordination pressure are clear.

That sentence is probably correct for ordinary continuation sessions. In this
experiment it became the sharp edge: agents receiving an explicit team prompt
interpreted "no team has registered" as permission to begin solo
implementation. Because all agents launched together, the live presence became
clear only after claims landed.

The likely amendment is not to remove solo work. It is to qualify the empty
case:

> In an owner-launched `start-right-team` batch with identical instructions,
> empty claims mean "no team visible yet", not "safe solo ownership", when the
> next step is a narrow singleton implementation slice.

### Metacognitive Adjustment

The inherited shape was "implement WS1". The impact requested by the owner was
broader: test whether many agents handed the same simple prompt can form a
working team. Under that impact, the first duplicate claim should have changed
the task. The work was no longer source implementation; it was team topology.

The better first responder move would have been:

1. do not open a competing source claim;
2. announce "duplicate singleton-lane claim burst" as the coordination
   pressure;
3. propose a route with one provisional reconciler, validators, standby, and a
   closeout owner;
4. ask all duplicate source claimants to close, convert, or explicitly object
   before further source edits;
5. set a short default if silent.

Fronded did the first item and partially did the second, but did not do items
3-5. That distinction matters: passive safety prevented one more collision,
but did not organise the existing agents.

### Updated Steering Model

The system needs to keep the owner interface simple while making the
multi-agent condition structurally visible to the agents. The most promising
route is a two-stage governor:

1. **Pre-claim rendezvous for singleton slices** when the prompt explicitly
   names `start-right-team` and the next plan step has obvious single-owner
   source paths.
2. **Post-claim overlap tripwire** for all cases: immediately after opening a
   source claim, re-read active claims and pause if more than one fresh claim
   overlaps the narrow path family.

This combination preserves N identical prompts. It does not require the owner
to appoint a controller. It also handles both cases:

- if all agents comply, the rendezvous prevents the first burst;
- if the rendezvous is skipped or the slice is misclassified, the post-claim
  tripwire stops the burst before deeper source edits.

### Additional Approaches To Explore

- **Support-first default for non-first agents**: after presence, agents whose
  deterministic rank is not first default to read-only review/scouting until a
  route assigns implementation.
- **Claim-open warning only**: keep behaviour unchanged but make `claims open`
  display overlapping fresh claims. This is lower-friction but weaker because
  agents can ignore it.
- **Ephemeral team session lease**: first presence writer creates a
  short-lived `team-routing` claim, not a source claim. Others append presence
  under that lease. Source claims wait until the lease resolves.
- **Plan-declared singleton flag**: plans can mark WS1 as single-owner
  implementation, with suggested support roles. Useful, but it adds planning
  burden and may calcify roles.
- **Owner prompt nonce/rendezvous clock**: the identical prompt includes a
  launch nonce and says "rendezvous until <UTC>". This is robust but slightly
  reduces the simplicity of "same opener plus plan pointer".

### Strongest Current Recommendation

Make `start-right-team` smarter before making it heavier:

1. add a short "identical batch / singleton lane" caveat to the solo-work
   clause;
2. require post-claim overlap re-read before source mutation in team sessions;
3. define the first-overlap response shape as a tiny route proposal with a
   silent default;
4. add CLI support later for overlap grouping and claim conversion, while
   keeping canonical collaboration paths derived by the tool rather than
   supplied by agents.

The lesson is not "always appoint a controller". The lesson is "an empty board
is ambiguous under simultaneous launch". The protocol should teach agents to
interpret that ambiguity as a rendezvous signal when the work can only have
one implementer.

---

## Deep Dive Pass 3 — Rogue Comms Path Correction

**Captured**: 2026-05-14 after owner correction.

Salty's rogue-directory finding adds a second, separate lesson to the
self-organisation experiment. It is not only that one session wrote to the
retired `.agent/state/collaboration/comms-events/` directory. The stronger
diagnosis is that the system still let an agent choose a collaboration-state
storage root at all.

### Corrected Diagnosis

The prior "reject incorrect paths" framing was too weak. Under the repo's
principles, especially "Strict and Complete" and "NEVER create compatibility
layers", the desired system shape is:

- update or delete every stale doc, prompt, manifest, and memory-state surface
  that still presents `comms-events/` as live;
- remove ordinary agent-facing comms path overrides from the collaboration
  CLI;
- derive the canonical comms location from repo-root and the tool's own
  contract;
- keep testability through lower-level dependency injection or fixtures, not
  through a production CLI option that lets an agent select a retired path;
- treat any remaining `comms-events/` mention as historical evidence,
  explicitly marked as such, or as a deletion candidate.

This changes the fix from "agents should refuse bad paths" to "agents should
not have a path choice". A refused bad option is still an option. The
structural defence is to remove the option from the agent interface.

### No Migration Hedge

There is no standing migration-command requirement for this experiment. The
rogue events were fresh coordination records written during the experiment,
not old data that needed a compatibility lane. Once their durable substance was
preserved in the canonical comms surface and analysis notes, the retired
directory was to be removed.

A migration command would be the wrong default recommendation here because it
keeps the old concept alive as an expected input shape. That hedges against the
repo principle rather than following it. If the repo has no legitimate old data
to carry, the right move is replacement everywhere: one concept, one path,
one canonical writer.

### Steering Implication

The "simple interface" goal for N identical agents is better served by fewer
agent-visible knobs. The start-right-team prompt should not have to teach each
agent which comms directory is canonical. The collaboration tool should own
that path, and stale docs should not be available to re-seed the old one.

Updated follow-on actions:

1. sweep and update or delete stale `comms-events/` documentation and prompt
   references;
2. remove agent-facing `--comms-dir` style overrides from comms commands, or
   confine them to non-production test harnesses;
3. add a repo check that flags live-doc references to retired collaboration
   paths unless they are explicitly historical evidence;
4. record the rogue-path episode as a strictness failure: too much optionality
   in a shared-state writer, not just stale knowledge in one agent.

---

## Deep Dive Pass 4 — Additional Cross-Surface Findings

**Captured**: 2026-05-14 after rereading comms, current state, memory,
distilled doctrine, start-right-team, claim tooling, and collaboration rules.

There is more to learn. The strongest new signal is that the failure did not
come from one weak agent choice. Several repo surfaces quietly made the
collision more likely.

### 1. The Team-Start Template Encouraged Claim-First Behaviour

`start-right-team` asks each agent to post:

```text
Team start report:
- Claimed paths: <paths or none>
```

The observed timeline shows several source claims were opened before, or at
nearly the same time as, the team-start report that announced them:

- Floating claimed at 11:36:24 and posted team-start at 11:36:39.
- Shaded claimed at 11:36:26 and posted team-start at 11:36:33.
- Foamy and Breezy claimed at 11:36:31 and then reported solo routes.
- Feathered claimed at 11:36:40 and posted a solo route through the same
  surface.

That suggests the template is performing two jobs at once: presence report and
ownership declaration. For simultaneous launches, that collapses rendezvous
into claim-open. A better shape is:

```text
Team start report:
- Intended boundary:
- Claim status: none yet / claimed <id> / blocked by overlap
```

For owner-launched identical prompts on a singleton lane, presence should be
posted before a source claim, or the claim tool should create a temporary
team-routing lease rather than a source-ownership claim.

### 2. `claims open` Records The Herd; It Does Not See The Herd

The current `claims open` handler checks identity-routing collision, then
appends the new claim. It does not compare the proposed file patterns against
fresh active claims and return an overlap group. That means the registry is a
write ledger, not a coordination primitive.

This explains why the agents were locally rule-compliant but globally
uncoordinated. Each agent did the available operation; the operation did not
produce the missing fact: "you are now one member of an overlapping singleton
claim burst."

The cure is not necessarily refusal. The stronger cure is to make the returned
claim-open result include:

- fresh overlapping claims grouped by path family;
- whether the overlap is same-thread and same-next-step;
- a machine-readable `team_routing_required` signal;
- the recommended next comms text for a route proposal.

For `start-right-team` singleton lanes, source mutation should wait until that
signal is clear or a route exists.

### 3. Passive Guidance Was Already Known To Be Insufficient

`distilled.md` already preserves the rule that passive guidance loses to
artefact gravity: when a cure can be mechanical, prefer the mechanism at the
surface where the misshape would otherwise land.

This experiment is another instance of that rule. The skill text said agents
should name coordination pressure. The surface that mattered was `claims open`,
and it did not mechanically surface the overlap. The result was a sixteen-
second claim burst followed by after-the-fact coordination.

### 4. Memory Itself Can Re-Seed Retired Interfaces

The memory plane contains stale or host-specific operational snippets that
still teach low-level collaboration command shapes, including path flags and
old comms roots. That is a real explanation for how an agent can "know" a
retired path even when current source defaults are correct.

This is not a reason to trust memory less. It is a reason to classify memory
entries that mention tool flags and state paths as freshness-sensitive. A
memory entry that says "run this exact comms path" needs either:

- an expiry or version tag tied to the tool migration that superseded it;
- an active contradiction warning when current repo source disagrees;
- or removal/promotion into a current repo-owned convention.

Otherwise, memory becomes an unreviewed compatibility layer.

### 5. Shared-State "Always Writable" Needs A Bulk-Cleanup Distinction

The `respect-active-agent-claims` rule deliberately says shared-state files are
always writable and commit-includable. That is correct for live coordination
writes: comms, claims, handoff notes, and napkin entries must not block behind
claims.

Salty's cleanup shows the missing distinction. Bulk retention cleanup and
abandoned-queue clearing are not the same as writing a live coordination note.
During an active implementation window, bulk cleanup can change the input set,
regenerate large read models, and perturb the same state surfaces other agents
are using to coordinate.

The refinement should be:

- live coordination writes stay always writable;
- bulk cleanup or retention sweeps require a hot-window recheck and a visible
  preflight note when active claims exist;
- cleanup tools should query the registry through the same parser used by the
  CLI, not hand-written `jq` keys.

### 6. The Closeout Phase Did Self-Organise Better

The 12:27 closeout wave is a useful positive control. Zephyrous, Feathered,
and Floating all began closeout synthesis at nearly the same time, but Floating
opened the canonical closeout claim, named the ownership in comms, and Foamy,
Feathered, and Breezy converted their work into supporting synthesis rather
than competing edits.

That means the team did learn within the session. Once a visible closeout
owner existed, other agents respected it. The missing mechanism is earlier:
create a visible singleton-lane owner or route before source mutation, not only
after the owner asks for handoff.

### 7. "No Active Claims" Does Not Mean "No Team State"

The final active registry is empty and the queue is empty. The working tree is
still dirty with WS1 source, continuity updates, comms events, and analysis.
This is a clean example of why closeout status needs the full six-surface
sweep from `distilled.md`: active claims, queue, staged files, git status,
shared comms, and directed inbox.

For future experiments, the team route should distinguish:

- ownership state: claims and queue;
- workspace state: dirty files and staged files;
- knowledge state: comms, napkin, continuity, and plan status;
- acceptance state: validation evidence and commit boundary.

### Updated Recommendation

The next improvement set should be structural and small:

1. Amend `start-right-team` so owner-launched identical prompts on singleton
   lanes perform presence-before-source-claim, or open only a team-routing
   lease first.
2. Change the team-start template from `Claimed paths` to intended boundary
   plus explicit claim status.
3. Extend `claims open` or its immediate output with overlap grouping and a
   `team_routing_required` signal; do not rely on agents reading raw JSON and
   inferring the group.
4. Remove normal comms path overrides and sweep stale comms-root docs/memory
   so retired paths cannot be reintroduced.
5. Split shared-state writes into live coordination writes versus bulk cleanup;
   bulk cleanup must preflight active claims through parser-backed tooling.
6. Treat this N=7 experiment as validation evidence for the hypothesis-layer
   collaboration work, but do not entrench fixed role labels. The lesson is
   pressure-first routing plus mechanical visibility, not a permanent role
   taxonomy.
