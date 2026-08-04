---
title: 'Practice systemic capability outcome portfolio'
type: report-companion
status: proposed
date: 2026-08-04
audience: 'Reviewers deciding which findings to preserve, investigate, reject, or turn into plans'
subject: 'A dependency-aware portfolio of additive, connective, subtractive, preservative, and refusal outcomes'
related:
  - README.md
  - interaction-and-transition-map.md
  - evaluation-and-falsifiers.md
---

# Outcome portfolio

## How to use this portfolio

The outcomes below are not a backlog. They are candidate changes to the topology of the Practice.
Several are useful only if they remove or simplify existing mechanisms. Some should be trialled
through one worked slice; others are preservation or refusal decisions rather than implementation.

Each outcome records:

- **direction** — introduce, strengthen, connect, relocate, simplify, constrain, reduce, stop,
  preserve, refuse, or investigate;
- **problem pressure**;
- **proposed change**;
- **dependencies**;
- **subtractive return**;
- **risk**;
- **evidence gate**.

## Portfolio summary

| Outcome | Direction | Leverage | Reversibility | Principal dependency |
| --- | --- | --- | --- | --- |
| O01 Current-contract and projection convergence | Strengthen / connect | Keystone | High | Existing PDR-050 contracts |
| O02 Practice obligation lifecycle | Introduce / connect | Keystone | Medium | Owner acceptance of ontology |
| O03 Attempt authority, succession, and stale-result protection | Strengthen | High | Medium | O02 |
| O04 Durable waiting and contested resumption | Introduce / connect | High | Medium | O02, O03 |
| O05 Correction, cancellation, and supersession | Strengthen / connect | High | Medium | O02 |
| O06 Semantic evidence identity and TAU projection | Connect | High | High | O02, TAU execution |
| O07 Outcome-oriented agent operations | Simplify / reduce | High | High | O01, O02 |
| O08 Validation ecology map and retirement discipline | Simplify / reduce / preserve | High | High | O01 |
| O09 Executable Practice topology scenarios | Introduce | High | High | O02–O06 vocabulary |
| O10 Capability extension membrane | Introduce / connect / constrain | Medium-high | High | PDR-009/035/125 |
| O11 Contract-impact detection and compatibility obligations | Strengthen / introduce | High | High | O01 |
| O12 Retention and forgetting joined to obligation evidence | Connect / preserve | Medium-high | High | O02, existing PDR-094 |
| O13 Communication-plane simplification | Simplify / reduce | High | Medium | O02, O06, O07 |
| O14 Participant and extension trust/authority model | Introduce / constrain | Medium-high | High | O10 |
| O15 Invariant-led coordination topology lens | Introduce / preserve / refuse | Medium-high | High | O02 |
| O16 Bounded external-automation experiment | Investigate | Low until need selected | High | O02, O06, O10, O15 |
| O17 Transition-completion and retirement proof | Strengthen / stop | High | High | O01, O11 |

## O01 — current-contract and projection convergence

### Direction

**Strengthen, connect, simplify.**

### Pressure

Canonical doctrine can change while operational READMEs, adapters, schemas, commands, indexes, or
external projections retain an older contract. A link to authority does not prove conformance.

### Proposed change

Complete the general surface contract already established by PDR-050:

- each load-bearing projection declares its semantic authority;
- mechanically derivable content is generated or checked;
- manually interpreted content records its review relationship;
- validators check both source→projection coverage and projection→source validity;
- transitions name the old projections expected to disappear;
- a substrate doctor reports and, where safe, repairs drift.

For heavily amended operational doctrine, trial a machine-checked **current enacted contract** view
that preserves the full decision record separately.

### Dependencies

- none conceptually; the doctrine already exists;
- a worked projection family should be selected before general tooling.

### Subtractive return

- remove stale restatements;
- reduce repeated current-state summaries;
- retire manual adapter inventories;
- reduce cold-agent archaeology;
- delete gates that only detect a projection PDR-050 can make deterministic.

### Risk

Creating another manually authored summary or central registry would worsen the problem.

### Evidence gate

Demonstrate on the coordination-event retention contract that one change to canonical authority
causes every live projection either to update or fail with a precise diagnostic.

## O02 — Practice obligation lifecycle

### Direction

**Introduce and connect.**

### Pressure

Plans, Linear tickets, claims, sessions, branches, PRs, and memory represent different aspects of
work but do not share one explicit identity and lifecycle.

### Proposed change

Ratify a portable semantic contract for:

- intent or rule;
- occurrence or obligation;
- attempt;
- current actor authority;
- evidence and terminal account.

The contract should specify identity, lineage, allowed state transitions, waiting, correction,
cancellation, recovery, completion, consolidation, and retention. Host implementation remains
optional and may project through existing systems.

### Dependencies

- owner acceptance that “obligation” fills a real missing layer rather than renaming plans or tickets;
- inventory of current identities and transitions.

### Subtractive return

- remove duplicate execution status from repo documents;
- reduce narrative-only handoff lineage;
- eliminate manual reconstruction across sessions and PRs;
- prevent duplicate external effects;
- make several communication and state surfaces projections of one lifecycle rather than separate
  truths.

### Risk

A new operational database or universal manager could become more expensive than the ambiguity it
solves. Semantics must precede implementation.

### Evidence gate

Model one real multi-session delivery occurrence retrospectively. The lifecycle must explain every
attempt and surface more clearly than current artefacts without losing information.

## O03 — attempt authority, succession, and stale-result protection

### Direction

**Strengthen and connect.**

### Pressure

Claims express undertakings and liveness but do not fully govern a successor actor's authority over
one attempt or prevent late stale effects across all projections.

### Proposed change

Treat a claim as bounded authority over a named attempt:

- claim freshness or lease;
- explicit adoption and succession;
- current authority identity;
- heartbeat and progress remain separate evidence;
- stale actors cannot silently publish a current terminal result;
- late evidence is retained but marked against superseded authority;
- closure names the attempt and obligation outcome.

### Dependencies

- O02 identity model;
- destination-specific analysis for GitHub, Linear, state files, and external tools.

### Subtractive return

- reduce orphan cleanup;
- reduce duplicate agent pickup;
- remove repeated “is the other agent still working?” communication;
- eliminate some stale-claim policing prose.

### Risk

Over-engineering trusted local collaboration with consensus machinery. The portable invariant is
supersession safety, not one technical fencing mechanism.

### Evidence gate

Simulate a dead actor, claim adoption, and a late result from the original actor. Current truth must
remain correct while the late evidence stays attributable.

## O04 — durable waiting and contested resumption

### Direction

**Introduce and connect.**

### Pressure

Blocked or deferred work is spread across plan gates, session continuity, external tickets,
escalations, automations, and prose. Waiting can require a live session or human memory.

### Proposed change

A waiting obligation records:

- named resumption condition;
- responsible evidence source;
- earliest/latest review or expiry;
- context needed to resume;
- actor or mechanism allowed to trigger;
- expected-state transition and idempotency identity;
- outcome when the condition cannot be satisfied.

### Dependencies

- O02 and O03;
- integration with existing plan owner gates and external condition watches.

### Subtractive return

- end sessions safely while work waits;
- reduce paused-state prose;
- prevent duplicate continuation after several triggers;
- reduce manually scheduled reminders.

### Risk

Turning every deferred idea into a live obligation. Registration should require real authority and a
resumption contract.

### Evidence gate

A human-review or external-dependency occurrence must survive session and machine termination and be
resumed exactly once with sufficient context.

## O05 — correction, cancellation, and supersession

### Direction

**Strengthen and connect.**

### Pressure

Human direction, plan change, claim closure, child-agent interruption, PR closure, and abandonment
can express related but causally different events. Narrative correction does not always reach every
runtime or projection.

### Proposed change

Define typed lifecycle events:

- correction;
- attempt cancellation;
- obligation cancellation;
- actor supersession;
- obligation supersession;
- governing-intent replacement;
- not-promoted terminal disposition.

Each carries reason, authority, affected identity, propagation obligations, and evidence-retention
policy.

### Dependencies

- O02;
- human decision-rights contract from existing Practice purpose work.

### Subtractive return

- reduce restart-from-scratch after ordinary steering;
- stop deleting evidence as cancellation;
- clarify which downstream work should stop;
- simplify owner-direction reconciliation.

### Risk

Event taxonomy could become ceremony if ordinary conversational direction always requires manual
metadata. Outcome-oriented tools should infer context where safe.

### Evidence gate

A long-running child-agent occurrence receives owner correction, later cancellation, and child
cleanup. Reviewers can reconstruct both the original plan and changed path without ambiguity.

## O06 — semantic evidence identity and TAU projection

### Direction

**Connect and preserve.**

### Pressure

Operational facts appear in collaboration state, GitHub, Linear, logs, telemetry, and memory. They
do not yet share one Practice-owned occurrence and attempt identity.

### Proposed change

- define provider-neutral Practice work-episode event semantics;
- attach obligation/attempt identity where warranted;
- separate fact, delivery acknowledgement, audit, trace, metric, product telemetry, and human
  notification;
- add Practice operational questions only through TAU's question→decision contract;
- preserve privacy and prohibit covert performance monitoring;
- include absence/control states: waiting, unavailable, skipped, superseded, forgotten.

### Dependencies

- O02;
- Stage 0/1 TAU authority and semantic-event work;
- information-governance review.

### Subtractive return

- reduce pairwise direct synchronisations;
- reduce duplicated event vocabularies;
- simplify correlation during recovery and review;
- remove vendor-specific field definitions from canonical doctrine.

### Risk

Collecting data because the substrate can, or conflating agent-operation evidence with worker
assessment.

### Evidence gate

One registered operational question must cause a decision or explicit no-change outcome and be
remeasured. Otherwise the event is not promoted.

## O07 — outcome-oriented agent operations

### Direction

**Simplify, reduce, strengthen.**

### Pressure

Agents repeatedly manipulate IDs, paths, flags, temporary files, build generations, and transaction
mechanics for common intents. The evidence is comprehensive but attention remains on orchestration.

### Proposed change

For recurring deterministic intents, provide one operation that:

- resolves current identities and valid state;
- performs the complete transaction;
- produces concise progress;
- returns structured outcome and next valid actions;
- preserves full logs and evidence;
- refuses ambiguity rather than asking for implementation-shaped inputs;
- runs a stable authorised build rather than rebuilding itself during use.

Examples for later selection might include:

- start or resume an obligation;
- wait on a condition;
- correct/cancel/handoff an attempt;
- publish a completion account;
- reconcile projections;
- close and consolidate a team episode.

### Dependencies

- O01 and O02;
- AX cause-class evidence.

### Subtractive return

- delete fixed procedural instructions;
- remove ordinary exposure of state paths and IDs;
- reduce CLI aliases and help repairs;
- lower context and coordination cost.

### Risk

Hiding decisions that agents should reason about. The facade must compress mechanics, never judgement.

### Evidence gate

Compare total successful first-use rate, human/agent attention, recovery evidence, and error classes
against the current procedure.

## O08 — validation ecology map and retirement discipline

### Direction

**Simplify, reduce, preserve.**

### Pressure

The Practice has many high-quality controls but no complete view of which risks, evidence sources,
and failure modes they cover independently.

### Proposed change

Generate an inventory of controls with:

- semantic invariant or harm;
- scale;
- prevention/detection/mitigation/repair/learning role;
- evidence source;
- severity;
- overlap and independence;
- measured runtime and attention cost;
- recent detection yield;
- removal condition.

Use it to identify blind spots, duplicated fences, and missing scenario-level proof.

### Dependencies

- O01 for generated inventory;
- existing repo-check profiling and AX data.

### Subtractive return

- retire redundant checks;
- move prevention to lower layers;
- reduce always-on context and repeated execution;
- preserve independent detectors where diversity adds real resilience.

### Risk

Optimising for speed and weakening quality. Correctness is not traded; only proof placement and
duplication are evaluated.

### Evidence gate

Every removed or moved control must retain an explicit assurance home and pass adversarial examples
of the original failure class.

## O09 — executable Practice topology scenarios

### Direction

**Introduce.**

### Pressure

Many Practice properties emerge only across several actors, checkouts, surfaces, failures, and times.
Current tests and real incidents do not supply a reusable declarative topology model.

### Proposed change

Build a test-only scenario harness that declares:

- agents/sessions/roles;
- state and coordination topology;
- platform capabilities;
- external projections;
- virtual time;
- failures, delays, duplicates, and malformed data;
- expected semantic outcomes.

Begin with one obligation lifecycle scenario rather than a general simulator.

### Dependencies

- O02–O06 vocabulary;
- validation that no equivalent harness already exists.

### Subtractive return

- reduce reliance on live incidents;
- replace some bespoke smoke scripts;
- prevent doctrine growth from untested hypotheticals;
- make liveness and recovery contracts executable.

### Risk

Building a parallel production system or an unrealistically clean simulation.

### Evidence gate

The harness must reproduce at least one historical multi-agent failure and prove the structural cure
would have prevented or contained it.

## O10 — capability extension membrane

### Direction

**Introduce, connect, constrain.**

### Pressure

Skills, adapters, hooks, subagents, MCP tools, plugins, local tools, and external coordinators have
different local governance but no shared lifecycle vocabulary.

### Proposed change

Ratify a portable membrane contract for:

- provenance and stable identity;
- declaration and structural validation;
- trust evidence;
- policy admission;
- activation by context and role;
- bounded authority;
- current availability;
- behaviour observation;
- suspension, update, and withdrawal;
- consumer migration and retirement.

Each capability family keeps its own implementation.

### Dependencies

- PDR-009, PDR-035, PDR-125;
- O14 for trust/authority.

### Subtractive return

- reduce platform-specific capability prose;
- eliminate silent adapter shadowing;
- make unavailable capability routing explicit;
- simplify retirement and consumer migration.

### Risk

A universal registry or plugin runtime could centralise and overgeneralise unlike capabilities.

### Evidence gate

Apply the contract to one canonical skill, one MCP server, and one external organising surface. It
must clarify all three without forcing identical implementation.

## O11 — contract-impact detection and compatibility obligations

### Direction

**Strengthen and introduce.**

### Pressure

A new contract and validator do not prove that every live consumer has migrated. Generic
compatibility language retains old shapes without naming who needs them.

### Proposed change

For major changes:

- define machine-detectable impact predicates where possible;
- enumerate affected live artefacts;
- classify severity and migration requirement;
- record per-consumer disposition;
- name external compatibility obligations, version policy, and expiry/removal condition;
- prevent old paths from remaining after all consumers migrate.

### Dependencies

- O01;
- plan and decision metadata capable of naming change identity.

### Subtractive return

- remove broad compatibility layers;
- reduce manual searches and migration uncertainty;
- make transition completion and deletion sets explicit.

### Risk

Impact detectors can miss semantic dependencies and create false confidence. Human review remains
required for meaning-changing transitions.

### Evidence gate

Use one historical schema or path migration to compare detector output with the known affected
estate.

## O12 — retention and forgetting joined to obligation evidence

### Direction

**Connect and preserve.**

### Pressure

The Practice has strong retention doctrine, but attempt and obligation evidence are not yet one
explicit class family.

### Proposed change

Define retention by future value:

- ephemeral stream;
- current operational state;
- durable event fact;
- attempt evidence;
- terminal account;
- learned memory;
- generated projection;
- raw archive with optional mining value.

Connect each to PDR-094 extraction, provenance, and archive rules.

### Dependencies

- O02 and O06;
- existing consolidation skill.

### Subtractive return

- reduce full transcripts and duplicate summaries;
- delete generated views and operational detail when derivable or no longer useful;
- retain compact causal evidence.

### Risk

Premature deletion before the new semantic extraction is proven complete.

### Evidence gate

For one completed team episode, demonstrate that the retained compact account supports review,
recovery, and learning before source detail leaves the active tier.

## O13 — communication-plane simplification

### Direction

**Simplify and reduce.**

### Pressure

The channel estate preserves important distinctions but imposes high selection, identity,
transaction, projection, and context cost.

### Proposed change

Organise communications around four semantic planes:

1. work-local lifecycle events;
2. team-wide current coordination;
3. durable decisions and review evidence;
4. consolidated learning and memory.

Existing channels become projections or specialist subtypes. Authoring tools infer storage and
routing from substance and current context.

### Dependencies

- O02, O06, O07;
- empirical channel-use and cost evidence.

### Subtractive return

- remove channels differentiated only by mechanics;
- reduce repeated route-selection guidance;
- lower duplicate copying;
- simplify consolidation.

### Risk

Erasing valuable social or urgency distinctions. Simplification must preserve recipient, urgency,
confidentiality, and decision authority where they matter.

### Evidence gate

A representative multi-agent session must use fewer explicit channel decisions while retaining or
improving awareness, response time, and durable evidence.

## O14 — participant and extension trust/authority model

### Direction

**Introduce and constrain.**

### Pressure

Current collaboration assumes trusted agents. External tools and broader Practice adoption introduce
misconfiguration, compromised participants, excessive credentials, and ambiguous authority.

### Proposed change

Define:

- authentication and provenance;
- trusted-team versus external-participant modes;
- least authority by role and occurrence;
- credential and secret boundaries;
- permitted state and external effects;
- review and approval requirements;
- containment and revocation;
- audit and incident evidence;
- privacy and safeguarding limits.

### Dependencies

- O10;
- security/privacy authority.

### Subtractive return

- reduce ad hoc allowlists and one-off warnings;
- clarify when trusted local simplicity is justified;
- prevent defensive ceremony from spreading to every collaboration.

### Risk

Importing hostile-system overhead into small cooperative teams.

### Evidence gate

Threat-model three modes: one trusted local team, one cross-estate peer session, and one external
automation capability. Controls must differ proportionately.

## O15 — invariant-led coordination topology lens

### Direction

**Introduce, preserve, refuse.**

### Pressure

The Practice uses local state, one coordination home, Director roles, external organising surfaces,
and peer collaboration, but topology choices are not expressed through one reusable question set.

### Proposed change

Before choosing a coordinator or state location, evaluate:

- consistency required;
- acceptable latency and staleness;
- actor equivalence;
- unique external registration or timer ownership;
- trust boundary;
- failure scope;
- recovery and reassignment;
- locality and data custody;
- authoritative versus projected state;
- whether human decision rights are constitutive.

### Dependencies

- O02 gives the coordinated object;
- existing proportionality and concept-exploration skills.

### Subtractive return

- avoid unnecessary central coordinators;
- avoid accidental distributed complexity;
- prevent GitHub, Linear, or an automation service from becoming authority by convenience.

### Risk

Another abstract lens with no operational traction. It should be a small extension to existing
concept exploration, not a large doctrine.

### Evidence gate

Apply it retrospectively to coordination home, team branch, waiting owner, and one proposed external
automation. It should explain why their topologies differ.

## O16 — bounded external-automation experiment

### Direction

**Investigate only.**

### Pressure

External workflow automation may reduce manual cross-system delivery or scheduled/conditional work,
but it can also create hidden authority and another state system.

### Proposed change

After a real pressure is selected, trial one workflow where:

- canonical intent and identity remain Practice-owned;
- the automation receives a minimum projection;
- its output is idempotent and attributable;
- failure and delivery state are observable;
- the obligation survives automation loss;
- no unique knowledge remains only in the workflow;
- replacement requires no doctrine change;
- total attention and maintenance cost are measured.

### Dependencies

- O02, O06, O10, O15;
- one selected operational need.

### Subtractive return

Unknown until a use case exists. No experiment should proceed merely to exercise the tool.

### Risk

A convenient workflow becomes an undeclared central coordinator or stores irreplaceable state.

### Evidence gate

The experiment must eliminate a measured recurring coordination cost and pass a complete
remove-the-automation drill.

## O17 — transition-completion and retirement proof

### Direction

**Strengthen and stop.**

### Pressure

The Practice can settle the correct new doctrine while old operational projections, adapters,
instructions, or checks continue to fire.

### Proposed change

Every structural transition declares:

- new authority;
- affected projections and consumers;
- migration or regeneration action;
- expected deletion/retirement set;
- compatibility obligations, if any;
- conformance and absence checks;
- date or evidence condition for closure;
- post-transition consolidation.

A transition is incomplete until the old active shape is absent, not merely deprecated.

### Dependencies

- O01 and O11.

### Subtractive return

- remove stale documentation and adapters;
- reduce contradictory guidance;
- prevent transitional plans and gates becoming permanent;
- keep the Practice from accumulating its own history as live complexity.

### Risk

Deleting evidence rather than executable residue. Historical records and causal evidence remain;
active behaviour and current projections change.

### Evidence gate

Apply to the coordination-event retention contradiction. Closure requires canonical authority,
operational guidance, validators, paths, and generated surfaces to agree, with historical amendment
evidence still preserved.

## Portfolio-level interaction rules

1. **O02 is semantic, not a build programme.** It should be ratified only after one retrospective and
   one live worked example.
2. **O01 and O17 precede broad additions.** New concepts should not be introduced into a projection
   estate that cannot yet prove convergence.
3. **O07 and O13 are expected returns, not optional polish.** The programme fails if new semantics do
   not reduce agent mechanics and channel burden.
4. **O09 is the proof environment.** It prevents hypothetical failure modes from expanding doctrine
   without executable evidence.
5. **O06 must ride through TAU.** Do not establish a rival telemetry ontology.
6. **O10 does not authorise O14 controls by default.** Trust and authority remain proportionate to the
   participant class.
7. **O16 is deliberately last and optional.** External automation is a consumer of the contracts,
   not their source.
8. **Every additive outcome names deletions.** A capability with no expected simplification requires
   stronger justification.
