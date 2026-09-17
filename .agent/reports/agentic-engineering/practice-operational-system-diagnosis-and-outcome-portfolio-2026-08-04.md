# The Practice as an Operational System

## Authority transitions, live coordination, execution, evidence, learning, and evolutionary control

**Date:** 4 August 2026  
**Status:** Exploratory synthesis and outcome portfolio. This report proposes questions,
relationships, experiments, and possible directions. It does not ratify Practice doctrine or
author implementation work.  
**Current-source baseline:** repository commit
[`1e0029cfa2327ab3263092a019eefea3a43767ca`](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/1e0029cfa2327ab3263092a019eefea3a43767ca).
Runtime behaviour, private operator overlays, and systems outside the repository were not
exhaustively inspected.  
**Epistemic posture:** current OCE sources are evidence of authored intent and repository state;
mechanistic explanations are theories; future capabilities are proposals with falsifiers.

> **The Practice is already rich in parts. Its largest residual opportunities lie in the
> transitions between them, the lineage that crosses them, and the mechanisms by which one part can
> safely make another unnecessary.**

## Review contract

This report asks what becomes visible when the Practice is considered as a long-lived operational
system whose authorities, obligations, actors, representations, and memories change over time.

Review should test:

1. whether the proposed distinctions are already fully expressed by current Practice contracts;
2. whether they change action in real work episodes;
3. whether additions remove more complexity than they create;
4. whether authority, judgement, and human control remain explicit;
5. whether the proposals remain useful across hosts, repositories, team sizes, and periods with no
   active agent;
6. whether the evaluation programme can cause a justified stop or no-change decision.

## Executive synthesis

The Practice already distinguishes:

- portable doctrine from repository phenotype;
- current state from durable memory;
- authoritative sources from generated views;
- claimed facts from observed signals and mechanical ground truth;
- historical evidence from present operational eligibility;
- local latest-schema substrates from explicitly versioned inter-Practice boundaries;
- agent cognition from legitimate human authority.

The remaining weakness is **operational discontinuity**. A plan, ticket, claim, session, branch,
review, event, outcome, and memory entry can all describe one episode of work while lacking a shared,
mechanically recoverable account of how they relate.

The keystone proposition is a thin Practice-owned lifecycle:

```text
ratified intent or standing rule
    → concrete obligation
    → one or more attempts
    → bounded actor authority
    → durable evidence
    → waiting / correction / cancellation / recovery
    → terminal account
    → audience-specific projections
    → consolidation, retention, and forgetting
```

This is a semantic contract, not a central scheduler or universal state store. Existing files,
GitHub, Linear, local tools, and future services may each carry bounded projections. The Practice
owns the concepts and their authority relationships.

The success criterion is subtractive. The lifecycle should eliminate manual reconstruction,
ambiguous statuses, duplicate state, procedural handoff prose, and defensive checks. A new surface
that creates another synchronisation obligation fails the test.

## 1. Five coupled systems

### 1.1 Semantic authority

This system defines meaning:

- principles and decision lenses;
- Practice Core and PDRs;
- ADRs and host contracts;
- canonical rules, skills, and role definitions;
- schemas, identities, and closed vocabularies;
- ratified plans and inter-Practice wire contracts.

It answers:

> What exists conceptually, what does it mean, who owns it, and which invariants hold?

The Practice is strongest here.

### 1.2 Projection and activation

This system makes semantic authority usable in particular contexts:

- generated views and indexes;
- platform adapters and entry points;
- local READMEs and operational guidance;
- command interfaces and diagnostics;
- GitHub and Linear representations;
- status surfaces, telemetry projections, and stakeholder views.

It answers:

> How does one authoritative concept become usable by a human, agent, host, or service without
> creating a rival source of truth?

This is where drift and duplicated interpretation concentrate.

### 1.3 Operational episodes

This system contains work happening now:

- obligations and attempts;
- sessions, claims, liveness, and handoff;
- waiting, correction, cancellation, and escalation;
- branches, commits, pull requests, reviews, and external effects;
- interruption, recovery, completion, and abandonment.

It answers:

> What concrete work exists, who may act on it, what state is it in, and what happened during each
> attempt?

The Practice has many advanced components but no single connective lifecycle.

### 1.4 Evidence, learning, and evolution

This system changes future behaviour:

- immutable events and durable artefacts;
- validation, tests, review, and observability;
- state-to-memory consolidation;
- friction capture and structural cures;
- decision amendment, migration, retirement, and forgetting;
- evaluation of the mechanisms that perform those functions.

It answers:

> What has been learned, how warranted is it, what should change, and what should cease operating?

### 1.5 Human and environmental purpose

This system keeps internal machinery subordinate to value:

- human direction and accountability;
- product and delivery outcomes;
- accessibility, safety, privacy, and legitimacy;
- total human, agent, compute, and maintenance cost;
- the mission effects that justify continued operation.

It answers:

> Who benefits, who decides, what harm is prevented, and what evidence would change the course?

## 2. The Practice obligation lifecycle

### 2.1 Intent or rule

Intent is the durable reason and authority from which work arises. Examples include a ratified plan,
runbook, owner direction, accepted review finding, or standing responsibility.

Intent is not execution state. The repository can preserve intent while Linear or another bounded
surface carries scheduling and movement.

### 2.2 Obligation

An obligation is one concrete, accountable occurrence of work. It can be completed, cancelled,
superseded, or retained as evidence independently of the rule that created it.

Examples:

- one delivery-plan step;
- one scheduled review;
- one projection contradiction to reconcile;
- one external condition that now requires action;
- one accepted defect to repair.

A recurring rule may create many obligations. Changing the rule must not rewrite the history of
obligations already created.

### 2.3 Attempt

An attempt is one bounded strategy for fulfilling an obligation. It can start, wait, receive
correction, fail, crash, be cancelled, produce partial evidence, or complete.

A later successful attempt does not erase earlier failed attempts. Attempt lineage is necessary for
learning and truthful recovery.

### 2.4 Actor authority

A claim grants a session, agent, team, or process bounded authority over an attempt. It does not prove
that the actor is alive, making progress, or entitled to act forever.

Actor authority needs:

- an explicit attempt identity;
- freshness or lease semantics where required;
- adoption and succession lineage;
- a way to prevent superseded actors from silently publishing current truth;
- closure evidence relating the attempt to the obligation.

The implementation need not use one database or numeric fence. The invariant is that superseded
authority cannot overwrite the present account without being detected.

### 2.5 Evidence and terminal account

Evidence records what happened. A terminal account states the warranted outcome of the obligation,
for example:

- completed;
- completed with a known limitation;
- cancelled and why;
- superseded by another obligation;
- failed after the available attempts were exhausted;
- deliberately not promoted;
- abandoned through an explicit authority decision.

The terminal account links to evidence and then feeds consolidation, retention, and forgetting.

## 3. State vocabulary without one universal state machine

Each domain may expose a smaller local vocabulary, but the system must preserve distinctions among:

- registered;
- available for pickup;
- claimed;
- running;
- waiting on a named condition;
- corrected or redirected;
- cancellation requested;
- cancelled;
- attempt failed;
- actor lost or attempt crashed;
- superseded;
- completed;
- terminally not promoted.

A generic `blocked` or `failed` state hides response obligations. Waiting, unavailability, refusal,
invalid intent, transient operation failure, actor loss, and supersession require different actions.

Shared operational state should use expected-state transitions:

> Move this object from the state I observed to this next state, or report that another actor has
> already changed it.

This turns duplicate resumption and concurrent handoff into explicit contention rather than
last-writer-wins ambiguity.

## 4. Durable waiting

Waiting is a live obligation state that does not require a live agent.

A waiting record should name:

- the condition or evidence that makes reconsideration useful;
- the source that can establish it;
- the earliest or latest review time;
- the authority that may resume the work;
- the context required for resumption;
- the result if the condition expires or cannot be met;
- the identity used to deduplicate competing triggers.

A review trigger reopens a question. It does not silently restore execution authority.

Durable waiting permits sessions and machines to end safely while an obligation remains intact.

## 5. Correction, cancellation, supersession, and replacement

These transitions have different meanings:

- **Correction** changes the information or direction available to the current attempt while
  preserving its lineage.
- **Attempt cancellation** ends one strategy without necessarily ending the obligation.
- **Obligation cancellation** ends the concrete work and retains the reason.
- **Actor supersession** changes who may act on the attempt.
- **Obligation supersession** names a successor obligation.
- **Intent replacement** changes the durable rule governing future obligations.

Owner direction can therefore change current work without rewriting the original plan or pretending
that the attempt followed its initial path unchanged.

## 6. Recovery and truthful partial accounts

After interruption, recovery should reconstruct only what durable evidence warrants:

- steps known complete;
- steps known started but incomplete;
- produced artefacts and external effects;
- last known actor and liveness evidence;
- corrections, cancellations, and authority changes;
- unknown intervals;
- whether automatic recovery is safe;
- what requires human review.

Recovery should preserve uncertainty. A missing session is neither proof that no work occurred nor
proof that the work completed.

Different recovery operations produce different evidence:

1. repeat the same definition and relevant context;
2. apply a corrected current definition to retained inputs;
3. resume from a durable checkpoint;
4. compensate for a partial external effect;
5. create a linked successor attempt;
6. reconcile desired and observed state after uncertainty.

## 7. Reconciliation as a first-class operational pattern

Communication says that something happened. Reconciliation asks whether every operational
projection now agrees with its authority.

A reconciliation-capable surface should answer:

1. What is the authoritative desired state?
2. Which local or external projections may diverge?
3. What signal announces a semantic change?
4. Can consumers process the signal repeatedly without duplicate effect?
5. Can a restarted consumer recompute from source?
6. What detects missed signals or stale projections?
7. Which actor may perform repair?
8. What evidence proves convergence, partial convergence, or bounded failure?

A useful transition follows this shape:

```text
authoritative change
    → persist
    → emit semantic signal
    → mark dependent projection stale
    → recompute or reconcile
    → verify observed convergence
```

A current OCE specimen is the relationship among PDR-094, current collaboration-state conventions,
and the live state README. It provides a bounded case for testing whether one authority change can
cause every operational projection either to converge or fail precisely.

## 8. Required capability and chosen topology

A work item may require:

- specialist knowledge;
- a permission or credential;
- independence from the authoring context;
- a particular repository or external surface;
- deterministic tooling;
- current information;
- a human decision.

Those requirements should not be encoded only as a named agent, role, harness, or team topology.
Topology is the current arrangement that supplies the capabilities.

This distinction supports graceful routing. When a preferred participant is absent, the system can
determine whether another topology satisfies the requirement or whether work must remain waiting.

## 9. Global duty classes

Every recurring repository-wide duty should declare its survival and concurrency model:

- **conflict-free distributed** — any number of actors may perform it;
- **idempotent replicated** — duplicates converge safely;
- **single active owner** — one current lease or leader is required;
- **externally reaped** — disappearance must be detected outside the actor that may fail;
- **human-authorised singleton** — the act is constitutively owner or reviewer authority.

Candidate duties include stale-claim reconciliation, generated-view publication, cleanup,
consolidation prompts, propagation, and cross-surface repair.

The owner must not become a mechanical runtime leader, and a mechanical leader must not acquire owner
authority.

## 10. Validation as an ecology

The Practice has rules, hooks, tests, validators, doctors, review routes, and telemetry. Their value
depends on the diversity and coverage of their evidence, not their count.

For each control, record:

- the harm or invalid state it addresses;
- the scale at which it detects the problem;
- whether it prevents, detects, repairs, or supports learning;
- the evidence source and independence from adjacent controls;
- the severity and response;
- measured runtime and attention cost;
- false positives and escaped failures;
- the condition under which the control can be retired.

Strictness remains absolute. Evidence can change where and how proof is acquired without lowering the
standard.

## 11. Operational compression and agent experience

Mechanical orchestration should move out of the attentional path while evidence becomes richer.

A high-quality agent-facing operation can:

- resolve current identities and valid transitions;
- perform a complete deterministic transaction;
- show concise progress;
- return structured outcome and next valid actions;
- preserve full logs and cause chains;
- refuse ambiguity rather than request implementation-shaped inputs;
- remain stable during ordinary use.

This should reduce procedural instructions, repeated status queries, path and ID manipulation, and
agent-authored summaries of machine results. Reflection remains visible where judgement is the value.

[PDR-111](../../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
provides the governing quality contract.

## 12. Outcome portfolio

### OP-01 — Connect the work-transition grammar

Test one shared question set across plans, obligations, attempts, claims, evidence, and memory. Keep
domain vocabularies distinct.

**Expected subtraction:** repeated lifecycle prose and ambiguous uses of `active`.

### OP-02 — Establish typed causal lineage

Connect existing identifiers from intent through obligation, attempt, change, evidence, outcome, and
learning.

**Expected subtraction:** forensic search and hand-maintained provenance tables.

### OP-03 — Make durable waiting operational

Represent waiting conditions, expiry, authority, and resumption identity independently of sessions.

**Expected subtraction:** long-lived sessions and manual reminders used only for continuity.

### OP-04 — Strengthen actor succession

Bind claims to attempts, add explicit adoption and supersession, and protect current truth from late
stale effects.

**Expected subtraction:** orphan cleanup and speculative liveness messages.

### OP-05 — Make correction and cancellation typed

Preserve original intent and changed path while propagating bounded interruption to child work and
external effects.

### OP-06 — Generalise reconciliation

Apply source, signal, recomputation, and convergence contracts to one live projection family.

**Expected subtraction:** update-everywhere procedures and stale-view workarounds.

### OP-07 — Classify global duties

Name which duties are distributed, idempotent, single-owner, externally reaped, or human-authorised.

### OP-08 — Separate capability from topology

Route work from explicit requirements rather than permanent role or harness names.

### OP-09 — Map the validation ecology

Generate a current inventory of risks, detectors, evidence sources, overlap, cost, and retirement
conditions.

### OP-10 — Compress routine operations

Select one costly agent journey and replace fixed mechanics with an outcome-oriented operation that
emits structured evidence.

### OP-11 — Join operational evidence to TAU

Use provider-neutral semantic signals only where a named question can change a decision. Preserve
purpose, privacy, and human interpretation.

### OP-12 — Complete transitions

Every structural change should enumerate affected projections and the active structures expected to
disappear. Completion means current surfaces agree and obsolete operational paths are absent.

### OP-13 — Build executable Practice scenarios

Create test-only environments for actor loss, duplicate resumption, stale results, waiting across
zero-agent periods, projection drift, and partial capability loss.

### OP-14 — Preserve strategic freedoms

Preserve latest-only local substrates, directional propagation, owner authority, replaceable
implementations, and the ability to retire disproven internal structures.

## 13. Interaction and sequencing

The outcomes are not a flat backlog.

1. **Prove projection convergence first.** Use one current contradiction and complete its transition.
2. **Validate the obligation ontology on evidence.** Reconstruct one completed and one interrupted
   episode before building a substrate.
3. **Enact the minimum live lifecycle.** Add attempt identity, actor succession, waiting, correction,
   and a terminal account for one bounded episode.
4. **Connect evidence through current TAU direction.** Register only signals with a decision path.
5. **Return value through agent experience.** Delete procedures and duplicated status handling.
6. **Prove system behaviour.** Reproduce historical failures in executable scenarios.
7. **Generalise only after recurrence across different contexts.** Keep host implementation local.

Every additive proposal should name a deletion, a decision improvement, or a newly observable failure.

## 14. Evaluation and falsifiers

### Core measures

| Dimension | Candidate evidence |
| --- | --- |
| Truth | time and error rate establishing current authority and provenance |
| Identity | work episodes with one resolvable obligation and complete attempt lineage |
| Authority | ambiguous owner or actor incidents; stale-result acceptance |
| Waiting | obligations surviving zero-agent periods and resuming exactly once |
| Recovery | interrupted work reconstructable without the original session |
| Corrigibility | time from owner correction to bounded effect |
| Reconciliation | duration and frequency of stale projections |
| Efficiency | human and agent attention per trustworthy outcome |
| Simplicity | instructions, fields, checks, and surfaces removed |
| Learning | evidence that changed a decision or produced an explicit no-change result |
| Forgetting | operational detail removed while causal understanding remains |

### Programme falsifiers

Narrow or stop the programme if:

1. the lifecycle duplicates plan or Linear state;
2. identity requires manual propagation at every step;
3. representative work does not fit obligation and attempt semantics;
4. current artefacts already support cheap, reliable causal reconstruction;
5. new state increases ordinary coordination cost without removing existing work;
6. reconciliation solves no observed divergence;
7. human correction becomes slower or less legible;
8. validation changes weaken assurance;
9. executable scenarios require a production orchestration system;
10. no existing procedure, status, index, or gate can be retired after a complete experiment.

## 15. What the Practice should stop doing

The Practice should stop:

- using the same artefact for durable intent, live execution state, attempt history, and learned
  memory;
- treating claim freshness as proof of progress or completion;
- retaining sessions merely to remember waiting work;
- overwriting failed attempts when a later attempt succeeds;
- using downstream projections as the first durable fact of consequential work;
- flattening waiting, unavailability, refusal, failure, crash, cancellation, and supersession;
- adding a new gate before examining whether the sanctioned path is missing or awkward;
- maintaining machine-derivable semantic inventories by hand;
- treating gate count as assurance;
- preserving active structures after their consumers have migrated;
- creating a new communication surface where an existing semantic class is sufficient;
- adding a Practice mechanism without an expected subtraction.

## 16. What the Practice should preserve

Preserve:

- Practice Core ownership above implementation;
- canonical content and thin host projections;
- explicit identity and liveness distinctions;
- repository intent with schedule movement in its appropriate external surface;
- immutable evidence and generated read models;
- strict latest-only local substrate evolution;
- versioned compatibility only at named inter-Practice boundaries;
- provenance before movement or forgetting;
- human direction, interruption, and accountability;
- local agency and distributed collaboration;
- the ability to amend, supersede, retire, and remove.

## 17. Restrained research sequence

1. Repair one projection family and prove complete convergence.
2. Reconstruct two real work episodes without adding metadata.
3. Test the lifecycle vocabulary against the evidence and revise it.
4. Run one live bounded obligation across at least two sessions.
5. Exercise waiting, correction, actor loss, and a late stale result.
6. Produce a terminal account and consolidate its learning.
7. Replace one procedural operation with an evidence-rich facade.
8. Reproduce the failure modes in test-only scenarios.
9. Delete the compensating structures the new capability makes unnecessary.
10. Decide whether any portable decision record is warranted.

## Closing synthesis

The Practice has reached a stage where further fitness depends less on adding isolated organs and
more on circulation, signalling, authority boundaries, recovery, and metabolism between them.

The next evolution is connective tissue:

- intent that authorises concrete obligations;
- obligations that survive actors;
- attempts that remain attributable;
- waiting that survives the absence of active cognition;
- correction and cancellation that preserve history;
- evidence that supports recovery and learning;
- projections that remain current;
- controls that can be evaluated and retired;
- forgetting that removes operational burden while preserving understanding.

Done well, the Practice becomes quieter, more coherent, more recoverable, more corrigible, and less
expensive to inhabit.

## References

- [PDR-027: Threads, Sessions, and Agent Identity](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
- [PDR-035: Agent Work Capabilities Belong to the Practice](../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md)
- [PDR-050: State and Memory Substrate Contracts](../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md)
- [PDR-078: Liveness-Heartbeat Contract](../../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md)
- [PDR-094: Coordination-Event Rotation](../../practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md)
- [PDR-111: Agent Experience Is First-Class](../../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
- [PDR-118: Agent Work-State Model](../../practice-core/decision-records/PDR-118-agent-work-state-model.md)
- [PDR-119: Agent Memory as an Event Graph with Renderers](../../practice-core/decision-records/PDR-119-agent-memory-as-an-event-graph-with-renderers.md)
- [PDR-125: Inter-Practice Collaboration Protocol](../../practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md)
- [PDR-133: Liveness Classes and Platform Declaration](../../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
- [ADR-131: Self-Reinforcing Improvement Loop](../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
- [ADR-150: Continuity Surfaces, Session Handoff, and Surprise Pipeline](../../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
- [ADR-165: Agent Work Practice/Phenotype Boundary](../../../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md)
