# Regulation, Extension, and Semantic Projection in the Practice

## Stability across scales, governed capability boundaries, and definitions that serve many operational surfaces

**Date:** 4 August 2026  
**Status:** Exploratory synthesis and outcome portfolio. This report proposes and tests ideas; it
does not ratify doctrine, author implementation work, or replace existing Practice decisions.  
**Relationship:** deepens
[The Practice as an Operational System](./practice-operational-system-diagnosis-and-outcome-portfolio-2026-08-04.md),
especially its outcomes on reconciliation, global duties, enforcement ecology, safe degradation,
extension membranes, causal failure, and decision-bearing observability.  
**Epistemic posture:** current Practice documents are evidence of authored intent and repository
state; system explanations are theories; future capabilities are proposals with falsifiers.

> **The useful unit of control is not always the failing action. Failure may implicate the attempt,
> actor, obligation, recurring generator, host environment, or governing design. A mature Practice
> needs to know when to change causal locus and scale.**

## Review contract

This report asks three coupled questions:

1. How should stabilising responses relate across timescales and system levels?
2. What makes a capability boundary a governed membrane rather than content plus an invocation path?
3. How can one semantic definition support human explanation, agent discovery, validation, and
   several projections while remaining honest about its authority and completeness?

A proposal should progress only when it changes a real response, preserves legitimate authority,
and removes an existing burden.

## Executive synthesis

Three findings carry most of the value.

### 1. Stability is produced by a regulator ecology

The Practice has many feedback mechanisms. They should be understood as an ecology whose members
operate on different controlled objects and timescales:

- correct or retry one operation;
- change one attempt strategy;
- re-ground or replace one actor;
- wait, reshape, supersede, or cancel one obligation;
- suspend the rule that repeatedly generates defective obligations;
- quarantine or repair a host environment;
- amend the architecture or doctrine producing the recurring failure class.

The hard problem is the **scale-shift predicate**: when does evidence cease to warrant another
same-level attempt and instead implicate another causal locus?

### 2. Capability identity is multi-dimensional and temporal

A capability may be known, present, configured, active, healthy, permitted, and trusted in different
combinations. A useful model is a vector:

```text
provenance × exact artefact identity × trust × management authority ×
availability × configuration × activation × capability × permission ×
execution locus × health × revocation × retained evidence
```

These dimensions change at different times and under different authorities. One `enabled` flag is
insufficient for consequential capability.

### 3. Semantic definitions need projection and completeness contracts

A canonical definition can support:

- typed programmatic use;
- agent discovery;
- human and machine catalogues;
- validation;
- several operational projections.

The definition owns only the meaning it declares. It does not prove that an occurrence happened,
that delivery succeeded, that a consumer acted, or that a decision is legitimate. Coverage and
completeness must be visible.

## 1. Regulator ecology

### 1.1 A regulator is a feedback contract

A useful regulator contract asks:

| Property | Question |
| --- | --- |
| **Scope** | Which object is controlled? |
| **Controlled variable** | What condition should remain within bounds? |
| **Sensor** | Which observation indicates deviation, with what reliability? |
| **Actuator** | Which action can change the condition? |
| **Budget** | How much time, cost, attention, risk, or repetition is permitted here? |
| **Reset or decay** | When does earlier evidence cease to count? |
| **Scale shift** | What evidence implicates another locus? |
| **De-escalation** | What proves lower-level operation may safely resume? |
| **Evidence** | What remains for recovery, review, and learning? |
| **Authority** | Who or what may apply the intervention? |
| **Failure posture** | What happens when the regulator fails? |
| **Retirement** | When does this regulator cease to justify itself? |

This is a reasoning and review instrument, not universal frontmatter.

### 1.2 Nested and orthogonal loci

Some loci are nested:

```text
operation → attempt → obligation → recurring generator
```

Others cut across that nesting:

- one actor can fail across several obligations;
- one obligation can fail under several actors;
- one host can affect unrelated generators;
- one governing design can produce similar failures across hosts;
- one capability can be available to one actor and absent from another.

The ecology is therefore a causal lattice, not a simple escalation ladder.

### 1.3 Regulatory loci

| Locus | Characteristic evidence | Possible actuator |
| --- | --- | --- |
| **Operation** | transient error, invalid input, timeout, failed invariant | correct, retry, back off, compensate, cancel step |
| **Attempt** | repeated operation failure, no information gain, strategy mismatch | change strategy, pause, correct, terminate attempt |
| **Actor** | lost liveness, context failure, capability absence, repeated cross-task defect | re-ground, narrow authority, replace, release claim |
| **Obligation** | several actors fail, contradiction, infeasibility, lost value | wait, reshape, supersede, cancel, seek owner decision |
| **Generator** | similar failures across obligations created by one rule or template | suppress, revise, test, retire |
| **Host** | unrelated work fails only in one environment | quarantine, isolate, repair, restart, reroute |
| **Governing design** | recurring failure class across actors, obligations, generators, and hosts | replace mechanism, amend doctrine, alter authority or incentives |

### 1.4 The narrowest effective intervention

The regulator should act at the narrowest locus capable of changing the likely cause. Narrowness
protects unaffected work; effectiveness prevents local repetition becoming denial of the cause.

Examples:

- malformed input warrants local correction;
- actor loss should not invalidate a sound obligation;
- several capable actors reaching the same contradiction implicates the obligation;
- similar failures across obligations from one rule implicate the generator;
- unrelated work failing in one environment implicates the host;
- repeated local workarounds can implicate the governing design.

### 1.5 Generator-level regulation

The generator is the missing middle between one failed obligation and whole-system redesign. It may
be:

- a standing rule;
- a plan template;
- a recurring workflow;
- a scheduler;
- a role instruction;
- a task-selection policy;
- a skill or prompt that repeatedly produces similarly shaped work.

A generator can remain retained and inspectable while being prevented from creating new obligations.
This supports bounded diagnosis and repair without allowing the failure stream to continue.

### 1.6 The scale-shift predicate

Moving control to another locus requires more than a count.

1. **Causal similarity** — failures plausibly share a cause.
2. **Local budget exhaustion** — another same-level attempt is unlikely to recover or change the
   decision.
3. **Effective actuator** — the proposed locus can change a condition the current locus cannot.
4. **Proportionate blast radius** — intervention scope matches evidence strength and consequence.
5. **Evidence preservation** — attempts and uncertainty remain available for review.
6. **Reset condition** — the system knows what could permit safe restoration.
7. **Regulator failure posture** — absence or failure of the regulator has a safe, explicit result.

A low-cost, high-information retry differs from expensive repetition. Budgets should include
attention, risk, side effects, and opportunity cost as well as attempt count.

## 2. Causal localisation and discriminating probes

A visible failure does not identify its cause. The next action may be an experiment designed to
separate plausible explanations.

| Contrast | What it helps distinguish |
| --- | --- |
| Same actor, different obligations | actor-wide failure versus obligation-specific failure |
| Different actors, same obligation | actor failure versus malformed obligation |
| Same generator, different hosts | generator defect versus host defect |
| Different generators, same host | host defect versus generator defect |
| Same obligation after definition correction | definition defect versus environmental failure |
| Same operation after dependency recovery | transient dependency failure versus deterministic defect |

Causal inference distinguishes passive association from intervention
([Pearl, 1995](https://doi.org/10.1093/biomet/82.4.669)). The Practice should use
the cheapest safe observation capable of changing the intervention decision.

Rational metareasoning asks whether further computation is worth its cost
([Hay et al., 2012](https://arxiv.org/abs/1207.5879)). A probe should stop when it
cannot change the decision, its risk exceeds its information value, the relevant authority has
settled the question, or a safer intervention dominates it.

Uncertainty should remain visible through competing hypotheses, supporting and contradicting
evidence, unknowns, useful probes, and the safest interim posture.

## 3. Time, reset, and damping

### 3.1 Reset follows causal change

Failure evidence should neither accumulate forever nor disappear merely because a process restarted.
Reset may follow:

- a materially changed definition;
- a repaired dependency;
- successful bounded executions;
- migration to a new host substrate;
- explicit human review;
- retirement of the old causal class;
- enough time without recurrence where time genuinely changes relevance.

A new actor does not reset evidence about an unchanged obligation or generator.

### 3.2 Hysteresis and stability

Immediate reversal after one contrary observation can create oscillation. Permanent suppression
creates rigidity. Where false activation and false inhibition have asymmetric costs, restoration may
require a different evidence threshold from suspension.

This is a control question to test on real episodes, not a universal numeric policy.

### 3.3 Coupled regulators

Individually valid regulators can destabilise the whole:

- several watchers launch the same repair;
- claims are repeatedly acquired and released at the same cadence;
- review and cure loops oscillate between opposing corrections;
- several projections echo the same event;
- alerts drive duplicate human intervention.

Possible controls include idempotency, leases, coalescing, jitter, one current owner, independent
sensors, and explicit arbitration. The correct control follows the invariant.

## 4. Capability membranes

### 4.1 A capability is more than portable content

Portability answers where substantive capability belongs and how it reaches a host. Operational
governance also needs admission, trust, activation, permission, containment, observation,
revocation, and retirement.

### 4.2 Capability-state vector

| Dimension | Governing question |
| --- | --- |
| **Class** | Guidance, generated adapter, deterministic tool, privileged action, remote service, or executable code? |
| **Provenance** | Who supplied it and where is authoritative substance? |
| **Artefact identity** | Which exact version, digest, commit, or immutable reference is governed? |
| **Trust** | Unknown, reviewed, verified, restricted, quarantined, or revoked? |
| **Management authority** | Which surface may change this dimension? |
| **Availability** | Is it discoverable and reachable in this host? |
| **Configuration** | Are required settings and dependencies present? |
| **Activation** | Is it currently eligible to act? |
| **Capability** | Which operations can it perform? |
| **Permission** | Which resources, credentials, and side effects are allowed? |
| **Execution locus** | Local process, isolated process, remote service, or human? |
| **Health** | Healthy, degraded, unavailable, or repeatedly failing? |
| **Observation** | Which events, costs, failures, and outcomes are visible? |
| **Revocation** | How is eligibility withdrawn from every live projection? |
| **Retention** | Which evidence remains after withdrawal? |

Different capability classes need different subsets and controls.

### 4.3 Trust attaches to exact artefact and capability

A familiar name does not preserve approval after content, permissions, dependencies, endpoints,
execution locus, or side effects change. Review and trust should attach to the exact artefact and the
bounded capability surface approved.

### 4.4 Management authority is singular per dimension

Several authorities may govern different dimensions:

- Practice Core owns portable meaning;
- the repository owns local implementation and activation;
- an operator owns secrets and deployment configuration;
- the owner or reviewer grants constitutive authority;
- a provider reports operational availability.

One dimension should not have two competing writers. Generated adapters and operator overlays should
have explicit ownership boundaries.

### 4.5 Admission and activation are distinct

A capability can be:

- known but unavailable;
- present but unconfigured;
- configured but inactive;
- active but unhealthy;
- trusted for one operation but prohibited from another;
- retained only as historical evidence;
- withdrawn at the source but not yet reconciled on every host.

Presence must not become implicit authority.

### 4.6 Derived capabilities need transformation contracts

When a canonical skill becomes a host adapter, a document becomes an index, or a tool becomes an
agent-discoverable capability, the projection should carry:

- provenance to the source;
- transformation identity;
- inherited and added restrictions;
- host activation state;
- lifecycle coupling;
- independent projection validation;
- evidence that distinguishes source defects from projection defects.

### 4.7 Revocation is convergence

Withdrawal may require:

1. changing authority at the source;
2. preventing new activation;
3. invalidating adapters and discovery entries;
4. draining or cancelling active work;
5. revoking credentials;
6. clearing caches and registrations;
7. recording incomplete host reconciliation;
8. retaining historical evidence with no present eligibility.

Revocation completes when operational surfaces converge.

## 5. Semantic definitions and projection integrity

### 5.1 Projection family

```text
canonical semantic definition
    → typed programmatic contract
    → human catalogue
    → machine catalogue
    → validation
    → agent discovery
    → bounded operational projections
```

Occurrence evidence, delivery state, interpretation, and legitimate decision authority remain
separate.

### 5.2 Definition contract

| Property | Question |
| --- | --- |
| **Authority** | Which meaning and schema does this definition own? |
| **Exclusions** | Which related concepts are outside it? |
| **Coverage** | Which live behaviours or artefacts are represented? |
| **Completeness** | Complete, partial, transitional, advisory, historical, or unknown? |
| **Discovery** | How do humans and agents find it? |
| **Projection** | Which catalogues, types, docs, or adapters are generated or checked? |
| **Producer contract** | How do writers use it? |
| **Consumer contract** | Who reads it and which decision can change? |
| **Drift detection** | How are unregistered uses and unused definitions found? |
| **Evolution** | How does meaning change or retire? |
| **Evidence** | How is an occurrence correlated to the exact definition? |
| **Portability** | Which fields are portable and which are host-specific? |

### 5.3 Completeness is first-class

A catalogue can be internally valid and incomplete. It must not silently become an authoritative
selector or audit surface.

Useful completeness states include:

- complete and checked;
- partial with named domains;
- migrating with a gap detector;
- advisory inventory;
- historical snapshot;
- unknown coverage.

An incomplete selector needs safe broadening, explicit review, or refusal.

### 5.4 Plural semantic planes remain plural

The Practice may share registration and projection infrastructure while keeping separate semantic
families for:

- coordination commands and responses;
- work-state facts;
- audit events;
- product and operational signals;
- logs and traces;
- policy decisions;
- learning and memory events;
- user-facing progress.

They have different authority, privacy, ordering, retention, and consumer needs. The reuse boundary
is infrastructure, not one universal ontology.

### 5.5 Human and machine catalogues are siblings

Human catalogues explain meaning, examples, caveats, and ownership. Machine catalogues expose
structured identities, schemas, versions, status, and links. Both should derive from or validate
against the same semantic definitions.

### 5.6 Membership does not prove value

A definition earns continued operational presence through a producer, consumer, validation purpose,
historical value, or bounded research role. Review should ask:

- Is it used?
- Which decision consumes it?
- Is it duplicated by a more authoritative fact?
- Is its schema stable enough to deserve canonical status?
- Has it become historical rather than operational?
- What can be removed if it is retired?

## 6. Probabilistic cognition inside deterministic effect shells

Agent reasoning remains open-ended. Consequential effects can be bounded through:

- typed capability and permission boundaries;
- expected-state transitions;
- deterministic validation of produced artefacts;
- explicit human approval for constitutive decisions;
- correction, cancellation, and succession semantics;
- durable evidence and external memory;
- bounded delegated agents;
- actuation and reconciliation checks.

The objective is to regulate effect, authority, and evidence without scripting cognition.

## 7. Outcome portfolio

### RSP-01 — Apply regulator contracts to live loops

Use a small set of current loops: stale liveness, repeated review rounds, projection reconciliation,
scheduled consolidation, and a costly validation workflow.

**Falsifier:** the contract reveals no missing decision and changes no response.

### RSP-02 — Add scale-shift predicates

Require causal similarity, exhausted local budget, an effective actuator, proportionate blast
radius, retained evidence, and a reset path.

**Expected subtraction:** unwarranted same-level retry and repeated cure rounds.

### RSP-03 — Represent dormancy precisely

Use an existing or new state only where a retained entity must stop generating effects while
remaining available for diagnosis and repair.

### RSP-04 — Classify global duties

Name concurrency, ownership, succession, external observation, and regulator failure posture.

### RSP-05 — Preserve deterministic effect shells

Keep cognition flexible while operations, authority, evidence, and irreversible effects remain
machine-checked and human-governed.

### RSP-06 — Explore capability-state vectors

Test the vector on one skill, one generated adapter, one privileged connector, and one executable
tool. Keep class differences explicit.

### RSP-07 — Make trust artefact- and capability-specific

Define which content, permission, endpoint, dependency, and execution changes require renewed review.

### RSP-08 — Add revocation reconciliation where residual activation is possible

Prove that discovery, active work, credentials, caches, and projections converge after withdrawal.

### RSP-09 — Add completeness states to semantic catalogues

Expose coverage before a catalogue supports selection, validation, or audit.

### RSP-10 — Share projection infrastructure selectively

Reuse definition, validation, catalogue, and reporting mechanics only after an implementation
inventory demonstrates real repetition.

### RSP-11 — Stop retry without a live warrant

At each retry boundary ask what new evidence the next attempt can produce and which locus can change
the cause.

### RSP-12 — Evaluate coupled regulator interaction

Map one family of loops for timescale, controlled variable, shared actuator, delay, and oscillation.
Stop if the map changes no decision.

## 8. Evaluation

| Concern | Candidate evidence |
| --- | --- |
| Scale selection | failures handled at the lowest effective locus; avoidable retries |
| Reset quality | false suppression and recurrence after premature reset |
| Actor replacement | time and ambiguity recovering work after disappearance |
| Dormancy | future effect prevented while evidence remains available |
| Capability clarity | decision-relevant vector dimensions recoverable without inference |
| Revocation | time and residual activation across hosts |
| Trust precision | review invalidated by materially relevant changes only |
| Catalogue coverage | registered/live gaps and unused entries |
| Projection integrity | drift between definition and human/machine views |
| Decision value | evidence that changed an action or justified no change |
| Subtraction | procedures, lists, and cleanup work removed |

## 9. Falsifiers and kill conditions

Narrow or stop the proposals if:

- causal localisation is no more reliable than current judgement;
- probes cost more or create more risk than direct intervention;
- scale-shift language adds ceremony without changing response;
- dormancy accumulates without review or closure;
- capability vectors flatten important class differences;
- revocation is already immediate and complete;
- catalogues are complete by construction and already state their authority;
- shared infrastructure creates a high-centrality coupling sink;
- deterministic shells hide necessary judgement;
- no current process, representation, or control can be retired.

A regulator should itself be retired or redesigned when its failure class becomes impossible, false
positives dominate, its sensor no longer informs decisions, no consumer uses its evidence, a cheaper
control covers the same risk, or its intervention becomes the main source of instability.

## 10. What the Practice should stop doing

Stop:

- repeating an operation after evidence implicates another locus;
- treating every failure as an actor-performance problem;
- repairing occurrences while leaving a defective generator active;
- treating elapsed time as proof of repair or restoration;
- allowing a capability name to carry inherited trust after material change;
- treating presence as activation or activation as authority;
- removing one source record while live projections continue to act;
- letting catalogue membership imply occurrence, usefulness, completeness, or decision authority;
- adding a universal ontology where separate semantic planes are required;
- retaining a regulator after a structural cure makes it unnecessary;
- building a central controller where shared invariants and idempotency suffice.

## 11. Restrained research sequence

1. Reconstruct several real failures at different suspected loci.
2. Apply the regulator contract and revise it to fit evidence.
3. Test one reversible eligibility transition.
4. Exercise actor loss, generator suppression, host quarantine, and review without automatic
   restoration in test-only scenarios.
5. Audit four capability classes through the full state vector.
6. Revoke one representative capability and prove host convergence.
7. Measure one semantic catalogue's coverage and consumers.
8. Remove the procedures the successful mechanisms replace.
9. Decide the smallest durable home for any recurring result.

## Closing synthesis

The Practice needs regulators that can correct locally, inhibit intelligently, change causal locus,
preserve evidence, restore cautiously, and retire themselves. It needs capability boundaries that
separate provenance, trust, activation, permission, health, and revocation. It needs semantic
definitions that serve many audiences while stating exactly what they own and how complete they are.

The strongest recurring questions are:

> **At what locus does the evidence now place the instability, and which actuator can change its
> cause?**

> **Which exact capability, authority, and host state are active now, and how would eligibility be
> withdrawn everywhere?**

> **What meaning does this definition own, how complete is its coverage, and which decisions
> legitimately depend on it?**

## References

### OCE sources

- [Principles](../../directives/principles.md)
- [PDR-035: Agent Work Capabilities Belong to the Practice](../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md)
- [PDR-050: State and Memory Substrate Contracts](../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md)
- [PDR-078: Liveness-Heartbeat Contract](../../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md)
- [PDR-111: Agent Experience Is First-Class](../../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
- [PDR-118: Agent Work-State Model](../../practice-core/decision-records/PDR-118-agent-work-state-model.md)
- [PDR-119: Agent Memory as an Event Graph with Renderers](../../practice-core/decision-records/PDR-119-agent-memory-as-an-event-graph-with-renderers.md)
- [PDR-133: Liveness Classes and Platform Declaration](../../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
- [ADR-125: Agent Artefact Portability](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- [ADR-165: Agent Work Practice/Phenotype Boundary](../../../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md)
- [Learning Loops and Balancing Feedback](./deep-dive-syntheses/learning-loops-and-balancing-feedback-report.md)
- [Governed Forgetting and Temporally Governed Authority](./governed-forgetting-and-temporally-governed-authority-2026-08-02.md)

### Research

- Ashby, W. R. (1956). [*An Introduction to Cybernetics*](https://pespmc1.vub.ac.be/books/IntroCyb.pdf).
- Conant, R. C., and Ashby, W. R. (1970). [Every good regulator of a system must be a model of that system](https://doi.org/10.1080/00207727008920220).
- Hay, N., Russell, S., Tolpin, D., and Shimony, S. E. (2012). [Selecting computations: theory and applications](https://arxiv.org/abs/1207.5879).
- Holling, C. S. (1973). [Resilience and stability of ecological systems](https://doi.org/10.1146/annurev.es.04.110173.000245).
- March, J. G. (1991). [Exploration and exploitation in organizational learning](https://doi.org/10.1287/orsc.2.1.71).
- Pearl, J. (1995). [Causal diagrams for empirical research](https://doi.org/10.1093/biomet/82.4.669).
