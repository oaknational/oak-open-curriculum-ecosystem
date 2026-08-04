---
title: 'Tranche 2 — lifecycles, durable state, and distributed coordination'
type: research
status: active
stage: 'Lifecycle and coordination analysis complete; Practice diagnosis remains provisional'
date: 2026-08-04
audience: 'Practice maintainers and reviewers'
subject: 'How mature workflow and agent systems distinguish intent, occurrence, attempt, actor, state, communication, evidence, recovery, and forgetting'
related:
  - README.md
  - method-and-source-boundary.md
  - tranche-1-structural-observations.md
---

# Tranche 2 — lifecycles and coordination

> **Interpretation status:** this tranche records source-facing comparative evidence and derives
> questions for independent inspection of the Practice. It does not propose n8n implementation or
> terminology as the Practice architecture.

## Executive synthesis

The strongest result of the lifecycle scan is an ontology of distinctions that recur across
workflow execution, durable scheduling, queue processing, isolated task running, event delivery,
and agent work:

1. **intent or rule** — the durable definition of what should happen;
2. **occurrence** — one concrete obligation arising from that definition;
3. **attempt** — one bounded effort to fulfil the occurrence;
4. **actor or process** — the currently responsible runtime participant;
5. **evidence** — the durable facts through which progress, completion, interruption, and recovery
   can be understood.

These are connected but not interchangeable. The source repeatedly protects the distinctions with:

- immutable or explicitly selected versions;
- stable identities;
- expected-state transitions;
- claims and leases;
- fencing against stale actors;
- deduplication keys;
- causal status vocabularies;
- durable event records;
- acknowledgements and retry;
- cancellation and correction;
- replay and reconstruction;
- bounded retention and deletion.

The likely Practice value is not "build a scheduler". It is to ask whether plans, claims, sessions,
agents, tasks, PRs, communications, memory, and external projections currently preserve the same
necessary distinctions — and what existing complexity could disappear if they did.

## 1. The durable definition is not the active definition

### Observation

A workflow has a mutable working representation, a history of versions, and an explicitly selected
active version. Publication history records activation and deactivation events independently of the
current working document. Executions retain the version identity and a snapshot of what actually
ran.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/db/src/entities/workflow-entity.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/db/src/entities/workflow-history.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/db/src/entities/workflow-publish-history.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/db/src/entities/execution-entity.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/executions/execution-persistence.ts>

### Interpretation

Several times coexist:

- the definition currently being edited;
- the definition currently authorised to act;
- historical definitions;
- the definition that a past occurrence actually used;
- the event by which authority moved from one definition to another.

A current document alone cannot explain past behaviour. A version history alone does not say which
version was authorised. An activation flag alone does not preserve the semantic identity of what was
activated.

### Practice questions

The Practice has vision, strategy, threads, plans, decisions, live state, claims, PRs, and memory.
The diagnosis should ask:

- Which artefact is editable intent, which is approved intent, and which is executing intent?
- Does a session or claim identify the exact plan or doctrine version under which it began?
- Can a later change to a plan make a historical action appear unjustified or unexplained?
- Are activation and deactivation explicit events, or inferred from the current location or status of
  a document?
- Does evidence attach to the intent that governed the work, rather than whatever the document says
  now?

### Candidate directions to test

- **introduce or strengthen** explicit authority transitions between drafted, accepted, active, and
  retired intent;
- **connect** execution evidence to the exact intent/version that authorised it;
- **stop** using current document state as the sole explanation of historical work;
- **preserve** prose and version control as evidence while making authority legible to machines.

## 2. A rule and one occurrence of the rule are different entities

### Observation

The durable scheduler explicitly separates a recurring or one-off rule from each concrete scheduled
occurrence produced by it. The rule owns recurrence and future materialisation; the occurrence owns
claim, execution, retry, failure, cancellation, staleness, and retention.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>

### Interpretation

A rule answers:

> What obligation should recur, and how are future obligations derived?

An occurrence answers:

> What specific obligation exists at this identity and time, and what happened to it?

Without this separation:

- changing a rule can corrupt the meaning of already-created work;
- retries can be confused with new obligations;
- cancellation can remove the general rule when only one occurrence should stop;
- completion of one occurrence can be mistaken for completion of the recurring responsibility;
- history becomes a sequence of overwritten states rather than attributable events.

### Practice questions

This is directly relevant to recurring agent and organisational work:

- Is a plan the rule, one agent task, or both?
- Is a Linear issue an enduring responsibility or one delivery occurrence?
- Is a session continuation a new occurrence, a retry, or the same attempt resumed?
- Does a standing rule generate auditable obligations, or does it merely remain prose until someone
  remembers it?
- Can one occurrence be skipped or cancelled without silently changing the governing intent?

### Candidate directions to test

- **introduce** an explicit rule/occurrence distinction for recurring Practice obligations;
- **relocate** execution status from durable intent documents into occurrence state;
- **reduce** plans that mix policy, recurrence, one attempt, and historical outcome;
- **preserve** the ability to change a durable rule without rewriting historical occurrences.

## 3. An occurrence can have several attempts without losing its identity

### Observation

A concrete scheduled task may be claimed, fail, return to pending, be retried after backoff, be
recovered after an actor crash, and eventually succeed or exhaust its attempts. The occurrence keeps
its identity throughout. Queue executions likewise distinguish an execution identity from the queue
job and worker currently processing it. Workflow executions can retain links to a prior failed
execution and a later successful retry.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.types.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/db/src/entities/execution-entity.ts>

### Interpretation

Attempt identity and obligation identity answer different questions:

- **Occurrence:** What must be achieved?
- **Attempt:** Which bounded effort tried to achieve it?

If a failed attempt and the obligation are the same object, retry either destroys failure evidence or
creates an apparently unrelated new task. If every resumed session is called the same attempt,
responsibility, resource use, and causal history become ambiguous.

### Practice questions

- Do parent and child agent sessions identify one obligation and multiple attempts?
- Does a handoff continue the same attempt or create a successor attempt?
- Can the Practice distinguish "not done", "attempt failed", "actor vanished", "waiting", and
  "obligation withdrawn"?
- Do PR revisions, CI reruns, and review rounds remain attributable to one change occurrence?
- Can failure learning be retained without declaring the governing plan failed or obsolete?

### Candidate directions to test

- **introduce or strengthen** occurrence and attempt identities across agent work;
- **connect** retries and successor sessions through explicit lineage;
- **stop** overwriting failed attempts with a final success narrative;
- **reduce** duplicate tasks created solely because an earlier actor disappeared.

## 4. Ownership is a lease, not proof of completion

### Observation

Distributed scheduler tasks are atomically claimed for a limited period. The claim identifies the
server currently responsible, but a lease expiry permits recovery. Every claim advances a fencing
value so a stale actor cannot overwrite the result of a newer attempt. The durable occurrence,
rather than the process, remains authoritative.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>

### Interpretation

A claim means:

> This actor currently has the right to attempt this work until the claim expires or is released.

It does not mean:

- the actor is alive;
- the actor is still making progress;
- the work is complete;
- a late result from that actor remains authoritative forever.

Fencing matters because time alone cannot stop an old actor from returning. A successor claim must
make stale writes structurally unable to redefine shared truth.

### Practice questions

OCE already has agent claims and identity machinery. The diagnosis should examine whether claims are
complete operational leases:

- Do claims expire or require heartbeats?
- Can work be reclaimed safely after machine or session loss?
- Can a superseded agent still write a result that appears current?
- Is a late PR, comment, memory update, or Linear transition rejected or marked stale after ownership
  moved?
- Does the shared occurrence outlive any individual agent process?
- Is there a difference between claimed, making progress, blocked, waiting, and abandoned?

### Candidate directions to test

- **strengthen** claims with lease, heartbeat, succession, and stale-write semantics;
- **connect** agent identity to occurrence and attempt identity;
- **introduce** a fencing or supersession concept at shared-state boundaries;
- **stop** treating the presence of a claim file or branch as evidence that work remains alive;
- **preserve** decentralised execution by placing correctness in shared state rather than one
  immortal coordinator.

## 5. Different invariants justify different coordination topologies

### Observation

The source does not use one universal coordination model.

- The durable scheduler is leaderless: every eligible server runs the same loops and coordinates
  through shared durable state.
- Waiting execution timers are owned by the current leader, but the durable waiting record remains
  in storage and can be rediscovered after leadership changes.
- Active workflow registration responds to leadership takeover and stepdown.
- Queue work separates main/control processes and worker processes.
- Agent event delivery can use in-process delivery or distributed pub/sub depending on deployment.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/wait-tracker.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/active-workflow-manager.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/instance-ai/docs/architecture.md>

### Interpretation

The coordination topology follows the invariant:

- leaderless claiming where any participant can safely perform equivalent work;
- single active ownership where external registration or precise timers require one actor;
- control/execution separation where resource roles differ;
- local delivery where one process is sufficient, distributed pub/sub where continuity crosses
  processes.

"Centralised" and "distributed" are not philosophies to apply globally. They are possible answers
to a specific consistency, liveness, locality, and failure question.

### Practice questions

- Which Practice responsibilities genuinely require one coordinator?
- Which could be leaderless if shared state contained enough identity and fencing?
- Which responsibilities need only one active actor but no permanent central authority?
- Where has GitHub or Linear become a coordinator when it should only hold state or evidence?
- Where is coordination logic centralised because local actors lack a sufficient protocol?
- Does n8n as a prospective Practice surface add a useful topology, or merely another central actor?

### Candidate directions to test

- **introduce** an invariant-led coordination topology decision lens;
- **reduce** universal assumptions that all cross-agent work needs one orchestrator;
- **preserve** local team emergence where shared protocols provide safety;
- **refuse** importing n8n as the central nervous system of the Practice;
- **investigate** n8n as one specialised participant or projection surface where its failure does not
  suspend the Practice.

## 6. "Waiting" is a first-class live state

### Observation

Execution status distinguishes waiting from new, running, failure, crash, cancellation, and terminal
success. Waiting executions remain durable, are deliberately excluded from crash recovery, can be
rediscovered, and resume only through an expected-state claim that prevents duplicate resumption.
Parent executions can remain waiting on child results. A waiting child is not treated as completed.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/workflow/src/execution-status.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/wait-tracker.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/active-executions.ts>

### Interpretation

Waiting means:

- the obligation is alive;
- no actor may currently be executing it;
- a named condition or time controls resumption;
- durable state is sufficient to resume later;
- absence of activity is not evidence of failure or abandonment.

A system without waiting as a distinct state often keeps an agent process alive unnecessarily,
marks blocked work as in progress, or loses the resumption condition in prose.

### Practice questions

- Can work wait for human review, external evidence, another agent, a future date, or a dependency
  without retaining a live session?
- Is the resumption condition represented structurally?
- Can multiple triggering events race to resume the same work?
- Does an absent active agent cause waiting work to look abandoned?
- Are blocked, paused, awaiting input, deferred, and abandoned currently flattened into one status?

### Candidate directions to test

- **introduce or strengthen** durable waiting obligations with explicit resumption conditions;
- **reduce** long-lived sessions used only to retain context;
- **connect** waiting state to reminders, condition watches, reviews, and external evidence;
- **stop** calling all non-active work "in progress";
- **preserve** waiting through process and machine changes.

## 7. Resumption is a contested state transition

### Observation

A stored execution resumes only if its status still matches the caller's expected status. If another
process already claimed the transition, the second receives an explicit duplicate-resumption result.
Parent/child completion can trigger several concurrent resume attempts, and that race is treated as
an expected condition rather than a generic failure.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/active-executions.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/wait-tracker.ts>

### Interpretation

The correctness question is not:

> Did this caller ask to resume?

It is:

> Did this caller atomically move the occurrence from the state it observed into the next state?

This is optimistic concurrency expressed in domain language. Duplicate action is not necessarily an
error; it can be evidence that another legitimate actor won the race.

### Practice questions

- Are plan, claim, issue, PR, and memory updates conditional on the state the actor actually read?
- Can two agents independently complete the same prerequisite and both launch successor work?
- Are duplicate transitions idempotent, rejected, or silently duplicated?
- Does the Practice distinguish contention from invalid state and implementation defect?

### Candidate directions to test

- **introduce** expected-state transitions on shared operational state;
- **strengthen** idempotency for common races;
- **stop** using unconditional last-writer-wins updates for coordination truth;
- **connect** contention evidence to diagnostics rather than treating it as noise.

## 8. Cancellation propagates across layers but remains semantically distinct

### Observation

Cancellation is represented as a terminal execution status and a causal error. Stopping an active
queue job sends an abort signal to the worker; stopping an inactive queued job removes it. Cancelling
an execution emits a domain event, rejects response obligations, propagates to task runners, and
removes or cancels the current process-specific state according to whether the execution is waiting
or running. Scheduler cancellation can also arise because the governing rule changed or was removed.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/workflow/src/execution-status.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/active-executions.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/task-runners/task-runner-module.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>

### Interpretation

Cancellation is not one mechanism. It is one semantic decision projected into:

- occurrence state;
- queue state;
- current process interruption;
- downstream task interruption;
- response settlement;
- event evidence;
- cleanup.

The reason matters. User cancellation, system shutdown, rule withdrawal, supersession, and timeout
may have the same terminal shape but different learning and retry implications.

### Practice questions

- Can a user stop one agent attempt without deleting the plan?
- Can the owner withdraw an occurrence while retaining why it was created?
- Does cancellation propagate to child agents and external automation?
- Is shutdown cancellation distinguishable from strategic abandonment or defect?
- Can agents cancel obsolete successor work when upstream intent changes?

### Candidate directions to test

- **strengthen** cancellation as a typed cross-surface semantic event;
- **connect** cancellation reason to retention, retry, and learning;
- **introduce** propagation contracts for child agents and external coordinators;
- **stop** equating deletion with cancellation;
- **preserve** cancelled evidence long enough to understand system behaviour.

## 9. Correction is not cancellation followed by restart

### Observation

The agent runtime supports correction of bounded background work while it is running. Correction is
queued to the relevant background task, while cancellation remains a separate action. Planned tasks
and foreground orchestration retain their identities.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/instance-ai/docs/architecture.md>

### Interpretation

Correction means:

> Preserve the obligation and attempt lineage, but change the information or direction available to
> the current actor.

Cancellation means:

> End the current attempt or occurrence.

Collapsing these loses either continuity or owner control. Restarting from scratch after every steer
also turns ordinary collaboration into repeated failure.

### Practice questions

- Can owner or peer direction amend current agent work without creating an unrelated new task?
- Is the correction attributable and visible to later reviewers?
- Can a correction invalidate already-produced intermediate evidence?
- Does "owner direction beats plan" have an operational projection beyond prose?

### Candidate directions to test

- **introduce or strengthen** typed correction/steering events for long-running agent work;
- **connect** owner direction to plan and attempt history;
- **stop** treating all mid-flight change as plan failure;
- **preserve** the distinction between correction, cancellation, supersession, and replacement.

## 10. Failure, crash, and unavailability have different causal shapes

### Observation

The source distinguishes:

- domain or user error;
- expected operational failure;
- implementation defect;
- task handler failure;
- process crash;
- lost heartbeat;
- runner disconnection;
- runner unavailability due to missing requirements;
- restart loops judged unrecoverable by the current process;
- queue infrastructure failures that may be retried externally or require process exit.

The execution status model separates error from crash. A task-runner disconnect analyser converts
runtime reasons into more useful user-facing errors. Missing support for one runner language can
leave the overall service available while making that capability explicitly unavailable.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/AGENTS.md#error-handling>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/task-runners/task-broker/task-broker-types.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/task-runners/default-task-runner-disconnect-analyzer.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/task-runners/task-runner-module.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.service.ts>

### Interpretation

Failure classification drives response:

- retry the same attempt;
- create a new attempt;
- wait for a dependency;
- reclaim from a dead actor;
- disable one capability;
- deactivate the governing rule after repeated systemic crashes;
- exit and let a higher-level process manager restore the service;
- require human correction;
- mark a defect for engineering repair.

A single `failed` state cannot carry these obligations.

### Practice questions

- Does the Practice distinguish an agent refusing invalid work, losing tool access, exhausting
  context, crashing, violating doctrine, discovering a false premise, or being superseded?
- Which conditions should retry automatically, escalate, wait, stop recurrence, or change doctrine?
- Can one host capability be unavailable without degrading every agent path?
- Are repeated crashes of one recurring workflow recognised as a system-level signal?

### Candidate directions to test

- **introduce or strengthen** causal failure classes with required responses;
- **connect** repeated operational failures to rule or capability-level damping;
- **reduce** generic "blocked" or "failed" statuses;
- **stop** retrying epistemic or owner-decision failures as though they were transient infrastructure;
- **preserve** full cause chains across agent and external surfaces.

## 11. Recovery reconstructs the most truthful partial account available

### Observation

A durable event log can identify unfinished executions after restart. Recovery may:

- resend unacknowledged events;
- mark unfinished work as crashed when detailed recovery is unsafe or has already failed;
- reconstruct known node progress from start and finish events;
- record the last attributable point of execution;
- run normal completion hooks over the recovered terminal account;
- notify connected users;
- optionally damp repeated crashes by deactivating the recurring workflow.

The recovery logic does not report a crashed node as successful merely because some earlier nodes
completed. If recovery itself repeatedly fails, it chooses a simpler truthful terminal state instead
of looping indefinitely.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/eventbus/message-event-bus/message-event-bus.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/executions/execution-recovery.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/workflow/src/execution-status.ts>

### Interpretation

Recovery is epistemic as well as operational. It answers:

- Which facts survived?
- What can be inferred safely?
- What remains unknown?
- What terminal account is warranted?
- Which normal downstream learning or notification must still occur?

The objective is not to manufacture continuity. It is to preserve the most accurate account and
recover the obligation where safe.

### Practice questions

- After a lost agent session, can the Practice reconstruct completed, begun, and unknown steps from
  durable evidence?
- Does session handoff overstate completion because only the final prose summary survives?
- Can recovery explicitly record uncertainty and a crash boundary?
- Do recovered outcomes pass through the normal consolidation, review, and learning paths?
- Is there a bounded fallback when detailed recovery repeatedly fails?

### Candidate directions to test

- **introduce** evidence-based interrupted-work reconstruction;
- **strengthen** durable step or milestone events for expensive long-running work;
- **stop** treating a missing session as either no work or completed work;
- **connect** crash recovery to normal learning and review;
- **preserve** unknowns rather than smoothing them into a coherent narrative.

## 12. Write-ahead evidence permits acknowledgement, replay, and recovery

### Observation

One event subsystem writes a message to a durable local log before sending it to external
destinations. It then emits the fact to internal metrics and external consumers, records delivery
acknowledgement, retries unsent messages, and scans unfinished event sequences at startup. Process
roles receive distinct log locations. Absence of any external destination is itself settled so the
log does not grow forever.

A separate typed internal event service acts as a semantic fact stream from which telemetry and
other relays derive destination-specific interpretations.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/eventbus/message-event-bus/message-event-bus.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/events/event.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/events/relays/telemetry.event-relay.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/telemetry/README.md>

### Interpretation

There are at least three different event concerns:

1. **domain fact** — what happened;
2. **delivery obligation** — which consumer must receive it;
3. **interpretation or projection** — how a telemetry, log, metric, UI, or audit consumer represents
   it.

Writing the fact before delivery creates the option to retry, replay, diagnose gaps, and reconstruct
unfinished work. Acknowledgement belongs to a destination obligation, not to the truth of the fact.

### Practice questions

- Are important agent and team events durable before GitHub, Linear, Slack, n8n, or telemetry sinks
  receive them?
- Can delivery fail without losing the event?
- Is external-surface status confused with canonical truth?
- Can the Practice know that a projection is stale or undelivered?
- Which high-volume events need only ephemeral transport, and which become durable evidence?

### Candidate directions to test

- **introduce or strengthen** a transport-independent Practice event vocabulary;
- **separate** event fact, projection, and acknowledgement;
- **connect** durable events to recovery and TAU;
- **reduce** pairwise direct synchronisations that have no replay or delivery state;
- **refuse** an event bus as a new competing source of durable intent.

## 13. High-volume stream data and durable facts deserve different retention

### Observation

Agent event delivery distinguishes compact durable step-level facts from high-volume token deltas
that remain memory-only. Execution configuration separates operational reads from display limits,
allows different save policies for successful, failed, progress, and manual executions, and applies
soft deletion before hard deletion. Queue transport retention is independently configurable. The
durable scheduler retains terminal occurrence states for bounded windows and can retain success and
failure differently.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/instance-ai/docs/architecture.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/config/src/configs/executions.config.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>

### Interpretation

Retention follows future value and operational obligation, not one global "keep logs" rule:

- ephemeral presentation stream;
- durable replay event;
- current operational state;
- terminal execution evidence;
- forensic failure evidence;
- user-facing build history;
- transport residue;
- data eligible for compaction or deletion.

Soft deletion creates a review or recovery interval before irreversible removal. Display limits do
not remove the data required to retry or recover.

### Practice questions

- Which agent messages are transient stream data, which are durable facts, and which should become
  consolidated memory?
- Is the entire transcript retained because no semantic event layer exists?
- Can large evidence remain operationally available without flooding human or agent context?
- Do successful and failed attempts deserve the same retention?
- Is deletion staged, attributable, and tested?
- Can indexes and summaries disappear while canonical evidence remains?

### Candidate directions to test

- **introduce** explicit retention classes for Practice state, events, evidence, and memory;
- **reduce** full-transcript durability where compact facts and retained source artefacts suffice;
- **connect** soft deletion, consolidation, and forgetting;
- **preserve** operational data independently of display and context limits;
- **stop** assuming version control alone supplies an appropriate lifecycle for every state class.

## 14. Identity and idempotency protect effects, not only records

### Observation

Scheduled occurrences derive unique identity from the governing rule and concrete instant.
Execution insertion can carry a caller-supplied deduplication identity. The database enforces
uniqueness so redelivery cannot normally cause the same logical effect twice. Recovery explicitly
acknowledges the remaining imprecision when durable state cannot distinguish "recorded but never
dispatched" from "dispatched but not yet started".

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/db/src/entities/execution-entity.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/executions/execution-persistence.ts>

### Interpretation

Idempotency is a semantic claim:

> These several delivery or execution attempts represent one logical effect.

It requires an identity chosen above the transport. Queue job IDs, process IDs, session IDs, and PR
numbers may all be different while the intended effect is one.

The source also models uncertainty honestly: when state lacks one discriminating transition, the
system documents the possible duplicate rather than claiming exactly-once certainty.

### Practice questions

- What identifies one logical Practice effect across agent sessions, retries, machines, GitHub, and
  Linear?
- Can the same owner instruction or plan occurrence create duplicate PRs or conflicting memory?
- Do external projections use transport IDs as though they were semantic identity?
- Where does the current state model lack a transition needed to distinguish lost work from delayed
  work?

### Candidate directions to test

- **introduce or strengthen** semantic idempotency keys for consequential cross-surface effects;
- **connect** external IDs to one Practice-owned occurrence identity;
- **stop** claiming exactly-once behaviour where the evidence supports only at-least-once;
- **preserve** explicit statements of known imprecision.

## 15. Work is recorded before it is entrusted to an actor

### Observation

The scheduler's central principle is to persist upcoming work before attempting it. New executions
are likewise created durably before being marked running or sent through an execution path. A queued
execution can exist before a worker starts it, and `startedAt` is distinct from `createdAt`.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/db/src/entities/execution-entity.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/active-executions.ts>

### Interpretation

The system first establishes:

> This obligation exists.

Only then:

> This actor has started attempting it.

That ordering makes queue delay, actor loss, recovery, and no-start failures visible. If the first
durable fact is "actor says it started", work can disappear with the actor.

### Practice questions

- Is delegated agent work durably registered before a child session starts?
- Can the Practice distinguish requested, accepted, queued, started, and completed?
- If process creation fails, does the obligation remain visible?
- Are branches or child-session IDs created before the parent records why they exist?

### Candidate directions to test

- **introduce or strengthen** durable obligation registration before delegation;
- **separate** queued from started;
- **reduce** operational memory whose only purpose is reconstructing unregistered work;
- **preserve** the ability for any capable actor to reclaim a recorded obligation.

## 16. Partial capability loss need not become total system failure

### Observation

Task running can be internal or externally orchestrated behind the same broker/requester boundary.
The system validates external-runner authentication, bounds concurrency and several timeout stages,
uses heartbeat failure to abort work, diagnoses disconnection causes, and can mark one language
runner unavailable while allowing the wider service to start. An unrecoverable restart loop is
escalated to the process manager rather than retried indefinitely inside the same failing process.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/config/src/configs/runners.config.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/task-runners/task-runner-module.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/task-runners/task-broker/task-broker-types.ts>

### Interpretation

Capability availability is a first-class runtime fact. The system distinguishes:

- host available, capability available;
- host available, one capability unavailable;
- task waiting for capacity;
- task accepted but actor unresponsive;
- actor disconnected;
- actor caught in a restart loop;
- external mode misconfigured.

Bounded waits prevent missing capability from becoming invisible permanent suspension.

### Practice questions

- Can agents discover that one tool, harness feature, external connector, or subagent type is
  unavailable before attempting dependent work?
- Does graceful degradation preserve correctness or silently lower standards?
- Are capability waits bounded and attributable?
- Can a failing adapter be isolated without disabling the portable capability?
- Which failures belong to a higher-level host or process manager?

### Candidate directions to test

- **introduce** runtime capability availability and bounded-request semantics;
- **strengthen** preflight and routing around harness/tool differences;
- **stop** interpreting missing capability as permission to produce a lower-quality substitute;
- **preserve** the distinction between unavailable implementation and invalid capability;
- **refuse** insecure compatibility modes as a normal Practice degradation path.

## 17. Recovery and damping operate at several scales

### Observation

The source contains responses at several scales:

- retry one operation after transient failure;
- retry one occurrence with backoff;
- recover a task after actor lease expiry;
- reconstruct an execution from durable events;
- mark an execution crashed when reconstruction is unsafe;
- deactivate a recurring workflow after a configurable sequence of crashes;
- exit a process after an unrecoverable runner restart loop so an external process manager can act.

Evidence:

- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/wait-tracker.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/@n8n/scheduler/README.md>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/eventbus/message-event-bus/message-event-bus.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/executions/execution-recovery.service.ts>
- <https://github.com/n8n-io/n8n/blob/master/packages/cli/src/task-runners/task-runner-module.ts>

### Interpretation

A repeated lower-scale failure becomes evidence about the enclosing scale. The response moves
outward when retrying the same thing can no longer improve the outcome.

This resembles biological and control-system damping:

- local correction preserves throughput;
- repeated local instability suppresses the generator;
- failure of one process hands responsibility to a higher-level regulator;
- retained evidence allows later learning rather than mere restart.

### Practice questions

- When does a failed agent attempt trigger another attempt, a different agent, a changed plan, a
  disabled workflow, or a doctrine review?
- Are retry budgets explicit at each scale?
- Can repeated gate failures identify a wrong plan or missing capability rather than bad local work?
- Does the Practice damp runaway coordination, recursive delegation, repeated PR repair, or
  endlessly resumed research?

### Candidate directions to test

- **introduce or strengthen** escalation and damping thresholds across attempt, occurrence, plan,
  capability, and Practice scales;
- **connect** repeated failure evidence to metacognition and strategy;
- **stop** unbounded same-level retry;
- **preserve** local autonomy until evidence warrants movement to a higher scale.

## 18. A candidate Practice-native lifecycle model

The following abstraction is derived from the comparative analysis, not copied from source
implementation. It is a hypothesis to test against OCE.

```text
Intent / rule
    └─ produces or authorises → Occurrence / obligation
         └─ attempted by → Attempt
              └─ currently held by → Actor lease
              └─ emits → Evidence events
              └─ may → wait / be corrected / be cancelled / fail / crash / succeed
         └─ may produce → successor attempt
         └─ reaches → terminal account
         └─ consolidates into → learning and memory
         └─ ages through → retention / compaction / forgetting
```

### Required invariants to investigate

- one durable identity for each layer;
- explicit lineage between layers;
- authority transitions conditional on observed state;
- no actor claim treated as permanent ownership;
- stale actors unable to redefine current truth;
- waiting durable without a live process;
- cancellation, correction, failure, crash, and success distinct;
- facts durable before unreliable projection;
- evidence sufficient for bounded recovery;
- retention based on future value and obligation;
- repeated failure capable of changing the enclosing rule or system.

## 19. Candidate improvements and cessations from tranche 2

### Potential additions or strengthenings

1. A Practice-wide distinction among rule, occurrence, attempt, actor, and evidence.
2. Durable registration before delegation.
3. Claim leases, heartbeats, succession, and stale-write protection.
4. First-class waiting and resumption conditions.
5. Expected-state transitions and semantic idempotency.
6. Typed correction and cancellation propagation.
7. Causal failure taxonomy with required recovery responses.
8. Write-ahead evidence for consequential cross-surface events.
9. Retention classes linked to consolidation and forgetting.
10. Multi-scale retry budgets and damping.
11. Invariant-led choices among leaderless, elected, and control/execution coordination.

### Potential reductions or stops

1. Stop using the same artefact as durable intent, live execution state, and historical evidence.
2. Stop equating an agent claim with liveness or completion.
3. Stop keeping sessions alive merely to preserve waiting work.
4. Stop treating duplicate transition races as generic failures.
5. Stop deleting work as the mechanism of cancellation.
6. Stop flattening crash, error, blockage, unavailability, refusal, and invalid premise.
7. Stop overwriting failed attempts when a later attempt succeeds.
8. Stop relying on downstream surfaces as the first durable record of a Practice event.
9. Stop retaining full streams when compact durable facts and source artefacts preserve the needed
   evidence.
10. Stop retrying at one scale after the evidence indicts the enclosing scale.

## 20. Important contrasts and refusals

The comparison also clarifies what should not transfer automatically.

### Compatibility and rollback surfaces

The scheduler is introduced behind a runtime flag with a rollback to the previous implementation,
and execution message formats retain compatibility versions. These choices are understandable for a
public product with persisted workflows and rolling deployments. They conflict with the Practice's
internal replacement doctrine unless an equivalent external contract obligation is demonstrated.

The Practice should distinguish:

- **stable external contracts**, which may warrant versioned transitions;
- **disproven internal architecture**, which should still be replaced rather than kept selectable.

### Fail-open optimisation

Test retry filtering falls back to full execution when its coordinator is unavailable. That is
appropriate because the optimiser changes cost, not correctness. The same shape must not be applied
to safety, doctrine, or evidence-integrity gates.

### Central control plane

Main/worker separation solves product-runtime obligations. It is not evidence that the Practice
needs one central agent or n8n instance to govern collaboration.

### Indefinite retention

The source has extensive execution history because users need to inspect product behaviour. The
Practice should retain only evidence with justified future value, not imitate product execution
history wholesale.

### Runtime insecurity for compatibility

A configurable insecure task-runner mode exists for compatibility with modules relying on unsafe
features. The Practice should treat this as a contextual product burden, not a candidate graceful
degradation pattern.

## 21. Questions carried into tranche 3

1. How are extension capabilities named, registered, validated, discovered, versioned, and removed?
2. Which membranes contain untrusted or community-provided code and credentials?
3. How do public compatibility obligations reshape internal architecture?
4. How are breaking changes represented as executable rules rather than release prose alone?
5. Which architectural checks use baselines, and how are baselines prevented from becoming permanent
   amnesty?
6. How do telemetry, operational observability, audit evidence, and product learning differ?
7. How do source, documentation, generated catalogues, tests, and contribution workflows keep an
   extension ecosystem coherent?
8. What does n8n preserve because of customers and public artefacts that the Practice remains free to
   forget?
