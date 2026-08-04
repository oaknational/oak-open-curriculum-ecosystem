---
title: 'From conceptual richness to operational coherence'
type: report
status: proposed
stage: 'Research synthesis for review; not implementation authority'
date: 2026-08-04
audience: 'Practice maintainers, agent-tooling maintainers, architects, and human directors of agent work'
subject: 'How the Practice can connect intent, obligation, execution, evidence, projection, learning, and forgetting while reducing coordination cost'
related:
  - ../../../practice-core/practice.md
  - ../../../directives/principles.md
  - ../../../practice-core/decision-records/PDR-024-vital-integration-surfaces.md
  - ../../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md
  - ../../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md
  - ../../../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md
  - outcome-portfolio.md
  - interaction-and-transition-map.md
  - evaluation-and-falsifiers.md
  - ../../../research/agentic-engineering/n8n-comparative-scan-2026-08/README.md
---

# From conceptual richness to operational coherence

## Executive summary

The Practice is conceptually rich. Its strongest areas are not small:

- portable philosophy and governance;
- canonical content and thin host projections;
- memotype/phenotype separation;
- agent identity, liveness, communication, claims, and handoff;
- state, memory, generated read models, validation, repair, and consolidation;
- provenance, retention, forgetting, and falsifiability;
- agent experience and structural-friction learning;
- plan authority separated from schedule movement;
- strict local replacement alongside deliberately versioned external contracts.

The central problem is therefore not a lack of doctrine. It is **operational discontinuity**.

A concept may be complete in Practice Core, interpreted in a host ADR, restated in a README, encoded
in a schema, exposed by a CLI, projected into GitHub or Linear, and learned through memory. The
relationships that prove those embodiments remain aligned are uneven. Some are generated and
checked. Others depend on repeated agent procedure or manual restatement. As the estate grows, the
cost moves from defining the right concepts to preserving one coherent current world across all of
their projections.

The keystone proposal is a thin **Practice obligation lifecycle** connecting existing surfaces:

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

This is not a proposal for a central orchestrator, workflow product, or one new database. The
lifecycle is portable semantic infrastructure. A host may realise parts of it through files, agent
state, Linear, GitHub, local tools, or an external automation surface. No implementation becomes the
owner of the concept.

Its success must be subtractive. It should make the Practice easier to operate and permit current
instructions, status fields, duplicate indexes, manual reconstruction, and defensive gates to
disappear. If it adds another state system that agents must synchronise, it has failed.

## Report status and scope

This report presents research findings and proposals for review. It is not a ratified Practice
decision, implementation plan, or instruction to build every capability described here.

It examines the Practice as a system across:

- semantic and architectural scale;
- individual agents, teams, repositories, and multiple Practice estates;
- operational, temporal, epistemic, social, governance, and evolutionary dimensions;
- human-facing and agent-facing experience;
- internal substrates and external organising or evidence surfaces.

The report is source-independent. Its propositions are expressed in Practice vocabulary and can be
evaluated from OCE evidence alone. The comparative research and provenance trail live separately in
the [research companion](../../../research/agentic-engineering/n8n-comparative-scan-2026-08/README.md).

## 1. The Practice as five coupled systems

The Practice is easier to understand when separated into five systems that must remain coupled
without collapsing into one surface.

### 1.1 Semantic authority

This is the system of meaning:

- principles and decision lenses;
- Practice Core and PDRs;
- canonical rules, skills, commands, and role contracts;
- plan and state schemas;
- stable identities and vocabularies;
- explicit external contract versions.

It answers:

> What concepts exist, what do they mean, who owns them, and which invariants hold?

The Practice is strongest here.

### 1.2 Projection and activation

This system makes semantic authority usable in particular contexts:

- host ADRs and local contracts;
- platform adapters and entry points;
- generated read models and indexes;
- schemas and catalogues;
- CLI diagnostics and status surfaces;
- GitHub, Linear, Notion, and specialist evidence projections;
- rules and hooks that activate canonical content.

It answers:

> How does one authoritative concept appear to a human, agent, runtime, host, or external surface
> without creating a rival source of truth?

This is where current drift and duplication concentrate.

### 1.3 Operational episodes

This is the system of work happening now:

- obligations, attempts, and agent sessions;
- claims, liveness, waiting, and handoff;
- communication, correction, cancellation, and escalation;
- branches, commits, PRs, tickets, and review;
- external calls and automation;
- interruption, recovery, and completion.

It answers:

> What concrete work exists, who may act on it now, what state is it in, and what happened during
> each attempt?

The Practice has many advanced components here but lacks one unifying lifecycle.

### 1.4 Evidence, learning, and evolution

This system turns action into changed future behaviour:

- immutable events and durable artefacts;
- state-to-memory consolidation;
- friction capture and structural cures;
- telemetry, analysis, interpretation, and remeasurement;
- PDR/ADR evolution;
- migration, supersession, retirement, and forgetting;
- tests, validators, immune layers, and scenario evidence.

It answers:

> What has been learned, how warranted is it, what should change, and what should cease to remain
> active?

The Practice is strong in doctrine and evidence capture; transition completion is less consistent.

### 1.5 Human and environmental purpose

This system keeps all internal machinery subordinate to value:

- human direction, judgement, interruption, and accountability;
- product and delivery effects;
- adoption and accessibility;
- total human, agent, compute, and maintenance cost;
- teacher, ecosystem, and pupil outcomes;
- privacy, safeguarding, legitimacy, and supplier constraints.

It answers:

> What useful effect justifies the capability, who benefits, who decides, and what evidence could
> cause us to change or remove it?

The [agent-tools purpose report](../agent-tools-purpose-and-negative-space-concept-exploration-2026-08-01.md)
already establishes this boundary. The findings here connect that purpose to the operational
substrate.

## 2. The principal diagnosis: operational discontinuity

The Practice often has all the right nouns but incomplete verbs between them.

It has:

- a plan and a ticket;
- a ticket and a session;
- a session and a claim;
- a claim and a branch;
- a branch and a PR;
- a PR and evidence;
- evidence and memory.

Yet it can still be difficult to answer, mechanically and unambiguously:

- Which concrete obligation did this session attempt?
- Is this a retry, continuation, successor, correction, or unrelated new work?
- Does the current agent still have authority to publish the result?
- Is the obligation waiting, abandoned, blocked, failed, cancelled, or merely between actors?
- Did a later successful attempt overwrite the fact that an earlier attempt failed?
- Which version of the plan or doctrine authorised the action?
- Did every audience-specific projection converge after the canonical concept changed?
- Which evidence is required for a terminal account?
- Which evidence should survive consolidation, and which should be forgotten?

Where those relationships are absent, the Practice compensates with:

- richer handoff prose;
- more channel-selection guidance;
- repeated startup and closeout ritual;
- stale-state auditing;
- additional status fields and indexes;
- manual cross-surface reconciliation;
- gates that detect symptoms after the fact;
- long operational documents explaining mechanics to every new agent.

These compensations are rational responses to real failures. They should not be mistaken for the
simplest final form.

## 3. Keystone capability: the Practice obligation lifecycle

### 3.1 Why “obligation”

A plan is durable intent. A Linear ticket is a scheduling and coordination projection. A claim is a
session's undertaking. A branch contains changes. A PR proposes an integration. None alone means:

> This specific piece of work exists as an accountable obligation and has this complete execution
> history.

“Obligation” is intentionally broader than task. It can arise from:

- a ratified delivery plan;
- a standing runbook rule;
- an owner instruction;
- an accepted review finding;
- a recurring operational responsibility;
- a detected failure requiring repair;
- an external condition becoming true.

It is concrete enough to complete, cancel, supersede, or retain as evidence.

### 3.2 Five identities

Each layer needs a stable identity and explicit lineage.

#### Intent or rule

The durable reason and authority from which work arises.

Examples:

- strategic or delivery plan;
- PDR/ADR obligation;
- runbook;
- owner-ratified direction;
- accepted issue or review decision.

#### Occurrence or obligation

One concrete work obligation created or authorised by that intent.

Examples:

- this delivery step;
- this scheduled review;
- this specific broken projection to repair;
- this one external change to reconcile.

#### Attempt

One bounded effort to fulfil the obligation.

An attempt can:

- start;
- wait;
- receive correction;
- be handed to a successor actor;
- fail;
- crash;
- be cancelled;
- produce partial evidence;
- complete.

A later attempt does not erase the earlier one.

#### Actor authority

The session, agent, team, or process currently permitted to mutate the attempt's operational state
or publish its result.

Authority is bounded and can be superseded. Liveness is evidence about the actor, not proof of
completion or permanent ownership.

#### Evidence and terminal account

Events and artefacts record what happened. A terminal account states the warranted outcome of the
obligation:

- completed;
- completed with known limitation;
- cancelled and why;
- superseded by another obligation;
- failed after attempts exhausted;
- abandoned through an explicit decision;
- not promoted after evidence review.

The terminal account then feeds consolidation and retention.

### 3.3 State vocabulary

A portable state vocabulary should distinguish at least:

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

This is not a demand for one giant enum across every surface. Each projection can expose a smaller
view. The semantic distinctions must nevertheless remain available so a projection does not merge
causally different conditions into “blocked” or “failed”.

### 3.4 Expected-state transitions

Shared operational truth should change conditionally:

> move this obligation from the state I observed to this next state, or tell me another actor has
> already changed it.

This prevents duplicate resumption, duplicate successor work, and last-writer-wins coordination.
A race can be an expected contention result rather than a generic error.

### 3.5 Waiting without a live session

Waiting is a live obligation state, not inactivity.

A waiting record should name:

- the condition or evidence that resumes it;
- the earliest or latest review time where applicable;
- who or what may trigger resumption;
- what happens when the condition expires;
- which context must be restored;
- how duplicate triggers are deduplicated.

This allows sessions and processes to end while the obligation remains intact.

### 3.6 Correction, cancellation, and supersession

These must remain distinct.

- **Correction** changes information or direction available to the current attempt while preserving
  its lineage.
- **Cancellation** ends an attempt or occurrence and records the reason.
- **Supersession** replaces an obligation or authority with another named successor.
- **Intent replacement** changes the durable rule or plan from which future obligations arise.

Owner direction can then become operationally visible without rewriting the original plan or
pretending the attempt followed its initial path unchanged.

### 3.7 Recovery and truthful partial accounts

After an interrupted session, the Practice should reconstruct only what durable evidence warrants:

- steps known complete;
- steps known started but not completed;
- produced artefacts;
- last known actor and liveness evidence;
- corrections and cancellations received;
- unknown intervals;
- whether safe automatic recovery exists;
- what requires human review.

Recovery should not manufacture a coherent success narrative from incomplete evidence.

## 4. Current-contract projections

The full decision record and the enacted contract serve different readers.

The Practice should preserve:

- original context;
- rejected alternatives;
- amendment history;
- owner rulings;
- falsifiers;
- provenance.

It should also make current enacted truth cheaply discoverable and mechanically checkable.

For heavily amended or operationally projected records, a current-contract projection could expose:

- currently active clauses;
- current vocabulary and closed values;
- superseded clauses and their successors;
- host adoption obligations;
- linked schemas and validators;
- known implementation gaps;
- last proof that projections agree.

This must be generated from or checked against the decision record. A manually authored summary would
recreate the same drift problem.

The immediate evidence is not hypothetical: current retention doctrine and the live state README
present different operational contracts. The correct response is to complete the projection and
transition relationship, not add another explanatory note.

## 5. Projection convergence

A semantic change is not complete merely because the canonical document is correct.

Every load-bearing projection should declare:

- its canonical source;
- whether it is generated, validated, or manually interpreted;
- its writer or renderer;
- the check that proves alignment;
- the consumers that depend on it;
- its transition or removal condition after the source changes.

Examples include:

- platform adapters;
- operational READMEs;
- generated logs and indexes;
- schemas and fixtures;
- CLI help and diagnostics;
- statusline and TUI views;
- GitHub and Linear projections;
- telemetry catalogues;
- external automation.

The Practice already defines this discipline for state and memory surfaces. The improvement is to
apply it consistently across all semantic projections and finish the tooling that PDR-050 anticipates.

## 6. Claims as bounded actor leases

The Practice's identity and liveness models should be preserved. They are sophisticated, explicit,
and grounded in real multi-agent failure modes.

Claims need a narrower operational strengthening.

A claim should mean:

> this actor currently has authority to attempt this obligation under this undertaking and attempt
> identity, subject to this freshness or succession contract.

It should not mean:

- the actor is definitely alive;
- the attempt is making progress;
- the work is complete;
- a late result remains authoritative after adoption or succession;
- the actor owns the durable intent.

Portable requirements include:

- explicit attempt identity;
- freshness or lease semantics;
- adoption/succession lineage;
- stale or orphan handling;
- a way to reject or mark results from superseded actors;
- closure evidence and terminal relation to the obligation.

The implementation need not use a database lease or numeric fence. The invariant is that superseded
authority cannot silently overwrite current shared truth.

## 7. Coordination topology follows the invariant

No one coordination topology is correct for the whole Practice.

Use **leaderless shared-state coordination** where:

- actors are equivalent;
- atomic claims and idempotency provide safety;
- any capable actor may reclaim work;
- no unique external registration must be owned.

Use **one active coordinator** where:

- a precise timer, registration, or exclusive external session requires one actor;
- authority can transfer without making that actor the permanent source of truth.

Use **control/execution separation** where:

- planning, scheduling, or policy differs materially from resource-intensive execution;
- workers can disappear while obligations remain durable.

Use **projection and eventual convergence** where:

- different audiences need different tools;
- no projection may own the underlying meaning.

Use **human-held authority** where:

- legitimacy, risk acceptance, product scope, or value judgement is constitutively human.

This lens prevents two opposite mistakes:

- centralising emergent collaboration because a coordinator is convenient;
- insisting on decentralisation where one active owner is required for correctness.

## 8. Capability extension as a membrane

The Practice already separates canonical capability from host implementation. It now needs a common
lifecycle for capabilities entering and leaving an operational estate.

The membrane should cover:

```text
provenance
    → declaration and stable identity
    → structural validation
    → trust evidence
    → policy admission
    → activation for a context and role
    → bounded runtime authority
    → current availability
    → evidence and review
    → update / suspension / withdrawal
    → consumer migration
    → retirement
```

This applies differently to:

- skills and rules;
- hooks and commands;
- subagents and reviewers;
- MCP tools and servers;
- connected plugins;
- external organising surfaces;
- local operational tooling;
- automation workflows.

The shared contract does **not** imply one universal plugin runtime. Different capability families
have different trust, lifecycle, and execution requirements.

Important distinctions:

- known provenance is not permission;
- integrity is not review;
- review is not runtime safety;
- installed is not active;
- active is not currently available;
- available is not authorised for every role;
- a capability can be suspended without deleting its historical evidence;
- an implementation can be replaced without changing the portable capability.

## 9. Validation as an ecology

The Practice's checks should be modelled as an ecology of detectors rather than a growing list of
gates.

For each control, record:

- material harm or invalid state it addresses;
- scale at which it detects the problem;
- evidence source;
- whether it prevents, detects, mitigates, repairs, or learns;
- severity and response;
- independence from adjacent detectors;
- false-positive and false-negative evidence;
- human and agent attention cost;
- removal condition if a lower-level invariant makes it redundant.

This permits several useful outcomes:

- retain independent detectors where diversity provides resilience;
- merge repeated checks over one semantic invariant;
- move prevention closer to the write boundary;
- remove read-side or procedural guards after invalid state becomes unrepresentable;
- select expensive checks through a complete impact model without lowering correctness;
- identify blind spots hidden by a large gate count.

Strictness remains absolute. The placement and repetition of proof are what become evidence-led.

## 10. Executable Practice environments

The Practice has rich real-world incident evidence and substantial tests. It would benefit from
repeatable scenario environments modelling the system, not only individual tools.

A scenario should declare capabilities and topology, for example:

- number and type of agents;
- sessions, checkouts, coordination homes, and Practice estates;
- available platform capabilities;
- GitHub/Linear/external projections;
- controlled time;
- actor crash or disappearance;
- stale, malformed, delayed, or duplicated events;
- correction, cancellation, and competing resumption;
- projection drift;
- partial capability loss;
- consolidation and retention conditions.

The harness then supplies controlled actors, state, and assertions through domain vocabulary.

This would allow the Practice to test:

- that one dead actor does not erase an obligation;
- that a stale actor cannot publish the current result;
- that duplicate triggers create one successor attempt;
- that a waiting obligation survives process loss;
- that a green lower liveness class is never over-read as higher-class health;
- that a changed PDR makes every live projection fail or update predictably;
- that knowledge reaches durable memory before raw state leaves the active tier.

## 11. Evidence and TAU

The current TAU direction should be executed, not reopened.

Its selected loop is sound:

```text
question
    → governed semantic signal
    → delivery
    → analysis
    → interpretation
    → human review
    → decision
    → change
    → remeasurement
```

The Practice should reuse that semantic and provider-neutral discipline for its own operational and
learning questions while preserving strict boundaries:

- runtime evidence is not employee performance evidence;
- product use is not mission impact;
- fast safety evidence is not slow strategic evidence;
- absence of an event is not automatically absence of a problem;
- a dashboard is not understanding;
- a vendor sink is not the event ontology;
- collection requires an approved question, decision owner, privacy boundary, and permitted use.

Candidate Practice questions include:

- Which coordination capabilities reduce total attention per trustworthy outcome?
- Where do obligations become orphaned or duplicated?
- Which gates catch material defects and which mostly create friction?
- How often can interrupted work be reconstructed without human archaeology?
- Which captured lessons actually prevent recurrence?
- Which rules, surfaces, or adapters are no longer used?
- How quickly can a human correct or stop consequential agent work?

The event substrate may be shared. The decisions and information-governance contracts remain
separate.

## 12. What the Practice should introduce

The report proposes investigation or introduction of:

1. a portable obligation/attempt/evidence lifecycle;
2. current-contract projections for heavily amended operational doctrine;
3. projection convergence contracts across all load-bearing embodiments;
4. durable generic waiting and expected-state resumption;
5. actor succession and stale-result protection;
6. typed correction, cancellation, supersession, and withdrawal;
7. a common capability membrane contract;
8. executable multi-agent topology scenarios;
9. decision-linked impact detectors for major contract changes;
10. a mapped validation ecology;
11. work-episode questions and signals inside the governed TAU approach;
12. a compatibility-obligation register by seam and consumer.

These are not twelve independent systems. Most should be projections or applications of the first
three.

## 13. What the Practice should strengthen or connect

Strengthen:

- claim lifecycle without expanding the already-rich liveness ontology;
- substrate doctor and projection-integrity tooling;
- adapter integrity and current capability availability;
- owner correction and interruption semantics;
- causal failure vocabulary across tools and external surfaces;
- transition completion after doctrine changes;
- links between operational evidence and consolidation;
- evidence of total coordination and review cost.

Connect:

- plan intent to obligation identity;
- Linear execution state to the same obligation without mirroring schedule into the repo;
- session and claim identity to attempt identity;
- branches and PRs to attempts and terminal evidence;
- communication events to work-local, team, decision, and memory planes;
- TAU events to real decisions and remeasurement;
- failure recurrence to change at the correct enclosing scale;
- capability admission to runtime authority and eventual retirement.

## 14. What the Practice should reduce or stop

### Stop adding doctrine where enactment is the gap

A new PDR should not compensate for an unfinished validator, stale projection, missing transaction,
or absent operational facade.

### Stop using one artefact for several timescales

Durable intent, live execution state, attempt history, and learned memory should not share one status
field or editable document.

### Stop treating a claim as liveness or completion

A claim is bounded authority over an attempt. Freshness is one signal. Completion requires evidence.

### Stop retaining sessions merely to preserve waiting work

Persist the obligation and its resumption condition instead.

### Stop manually maintaining semantic inventories

Generate or check adapter maps, surface inventories, event catalogues, enacted clauses, and
compatibility consumers where the relationship is mechanical.

### Stop allowing projections to become rival truth

GitHub, Linear, Notion, dashboards, rendered logs, and automation tools serve audiences. Their
status must not redefine canonical intent or evidence.

### Stop flattening causal states

Unavailable, waiting, blocked, invalid, refused, failed, crashed, cancelled, superseded, and not
promoted require different responses.

### Stop adding fences before examining the sanctioned path

Repeated misuse may indicate awkward or absent substrate rather than weak instruction.

### Stop equating strictness with indiscriminate repetition

Correctness stays absolute. Test and validation selection can still be complete, impact-aware, and
evidence-led.

### Stop preserving internal history as executable compatibility

Name the external consumer or migrate and remove the old shape.

### Stop creating a new channel for a new conversation

First determine whether the substance is a work event, coordination event, decision, escalation,
evidence artefact, or learned memory that an existing semantic class can carry.

### Stop allowing successful retries to erase failed attempts

Learning depends on the complete attempt lineage.

## 15. What the Practice should preserve

Preserve and reinforce:

- Practice Core ownership above implementation;
- canonical content and thin adapters;
- explicit host phenotype boundaries;
- repository intent versus Linear schedule state;
- identity and liveness as independent, non-overread signals;
- immutable evidence and generated read models;
- strict latest-only local substrate evolution;
- version-family tolerance only on named external wires;
- replacement of disproven internal shapes;
- provenance before movement or forgetting;
- full extraction before raw signal leaves the active tier;
- falsifiability, amendment, supersession, and explicit not-promoted outcomes;
- agent experience as a first-class product quality;
- human judgement, direction, interruption, and accountability;
- decentralised local agency;
- the demonstrated willingness to retire surfaces that cost more than they return.

## 16. What the Practice should consciously refuse

Refuse:

- one central orchestration service as owner of Practice truth;
- a universal plugin mechanism with unrestricted authority;
- public-product compatibility obligations where no equivalent consumer exists;
- fail-open behaviour for safety, doctrine, or evidence-integrity gates;
- insecure compatibility modes as graceful degradation;
- feature flags as permanent architectural alternatives;
- telemetry-vendor vocabulary as the semantic event model;
- generated catalogues as substitutes for interpretation and judgement;
- hostile-distributed-system ceremony for every small trusted local collaboration;
- silent lower-quality substitutes when a required capability is unavailable;
- operational complexity whose only justification is managing complexity introduced by the
  Practice itself.

## 17. Consequences across scale

| Scale | Likely consequence |
| --- | --- |
| **Vocabulary** | One stable distinction among intent, obligation, attempt, actor, event, projection, and terminal account. |
| **Rule and skill** | Fewer mechanics in prose; clearer activation of reflective reasoning versus deterministic operation. |
| **Individual agent** | Outcome-oriented commands; less manual ID/path/state reconstruction; clear waiting and interruption. |
| **Team** | Shared obligation identity, explicit succession, fewer duplicate effects, smaller communication burden. |
| **Repository** | Checked projections, current-contract views, completed substrate doctor, impact detectors. |
| **Practice Core** | Portable lifecycle and capability-membrane contracts, not host implementation. |
| **Multi-repository Practice** | Semantic IDs and versioned wires remain portable while each estate keeps local phenotype. |
| **Organisation** | Linear, GitHub, Notion, telemetry, and automation remain audience-specific projections with explicit authority. |
| **Human governance** | Correction, cancellation, evidence limits, and decision rights become operationally visible. |
| **Evolution** | Changed concepts propagate completely; attempts and failures inform the right enclosing scale; obsolete structures retire. |

## 18. What this report does not propose

It does not propose:

- copying another system's architecture;
- implementing a workflow engine;
- putting every Practice action into n8n or any other coordinator;
- replacing GitHub, Linear, or the existing collaboration substrate;
- centralising agent teams;
- adding a new durable store before the semantic contract is tested;
- weakening strictness, tests, provenance, or review;
- retaining more raw telemetry by default;
- tracking individual worker performance;
- converting every PDR into a schema;
- building every outcome in one programme.

The first implementation experiment, if the findings are accepted, should be the smallest real work
slice that exercises the lifecycle and deletes compensating complexity.

## 19. Closing synthesis

The Practice has reached a stage common to mature living systems: its individual organs are highly
developed, but further fitness depends increasingly on circulation, signalling, boundaries, and
metabolism between them.

The next evolution is not a larger brain. It is better connective tissue:

- authority that propagates without duplication;
- obligations that survive actors;
- attempts that remain attributable;
- waiting that does not require a live mind;
- correction and cancellation that preserve history;
- evidence that supports recovery and learning;
- projections that remain current;
- extensions that enter and leave through a governed membrane;
- validation that behaves as an ecology;
- forgetting that removes operational burden without erasing understanding.

Done well, this will not make the Practice visibly larger. It will make it quieter, more coherent,
more recoverable, more corrigible, and less expensive to inhabit.
