# Governed Context and Causal Participation in the Practice

## Opportunities beyond retrieval, coordination state, and operational eligibility

**Date:** 4 August 2026  
**Status:** Exploratory synthesis and opportunity map. This report proposes questions, contracts,
experiments, and possible directions; it does not ratify Practice doctrine, author implementation
work, or require a particular storage or graph technology.  
**Relationship:** Extends [The Practice as an Operational System](./practice-operational-system-diagnosis-and-outcome-portfolio-2026-08-04.md),
[Regulation, Extension, and Semantic Projection in the Practice](./practice-regulation-extension-and-semantic-projection-2026-08-04.md),
and [The Intelligence of Inhibition](./intelligence-of-inhibition-operational-eligibility-2026-08-04.md).  
**Epistemic posture:** Current OCE documents are evidence of authored intent and present repository
structure. The architecture developed here is a synthesis and research proposition. Standards are
cited as reusable vocabularies or interoperability candidates, not as proof that OCE should adopt
their complete models.

> **The next opportunity is not simply to retrieve better context. It is to govern which retained
> state may participate in present cognition and action, for which actor and purpose, under which
> authority, with what evidence, and until what changes.**

## Executive synthesis

The preceding reports establish that the Practice is already rich in semantic authority, state and
memory contracts, identity, liveness, operational coordination, evidence, forgetting, and
human-led governance. They also identify a missing connective structure among durable intent,
concrete obligations, attempts, actors, evidence, projections, and learning.

This report adds a further proposition:

> **Context construction is itself a consequential transition and should be governed as such.**

An agent does not act on the full repository, the complete event history, or every accessible
memory. It acts on a selected projection: a bounded set of claims, instructions, evidence,
identities, capabilities, permissions, obligations, and current conditions. That projection shapes
what the agent notices, which alternatives it considers, which authority it believes it has, and
what action appears justified.

Therefore, context is not merely a retrieval result. It is a form of **temporary causal
eligibility**.

A document, event, decision, failure, hypothesis, capability, or historical plan may continue to
exist, remain verifiable, retain evidential standing, and remain available to authorised diagnostic
inquiry while being ineligible to:

- enter an ordinary work context;
- define current truth;
- activate a capability;
- justify an action;
- create a new obligation;
- cross a repository or organisational boundary;
- or silently regain authority after expiry, supersession, revocation, or retirement.

The architectural opportunity is to join the Practice's existing strengths into a **governed
causal-participation layer**:

```text
canonical events, claims, decisions, and policies
    → epistemic, authority, and eligibility state
    → purpose- and capability-scoped projection
    → agent or human context
    → bounded decision and action
    → effects and evidence
    → reconciliation
    → learning, revision, inhibition, and forgetting
```

This does not imply one global graph, one universal event bus, or a new sovereign database. It is a
set of portable distinctions and contracts that existing OCE surfaces can express through files,
schemas, GitHub, Linear, generated views, agent tools, or future services.

The strongest opportunities are:

1. Treat context assembly as an authority decision, not similarity retrieval.
2. Represent causal participation separately from existence, belief, access, and retention.
3. Connect plans, obligations, attempts, actors, evidence, and learning through typed lineage.
4. Make agents propose candidate transitions rather than directly rewriting shared truth.
5. Carry policy, provenance, purpose, and revocation through derived projections.
6. Reconcile semantic decisions with every live operational embodiment.
7. Preserve disagreement, uncertainty, absence, and rejected alternatives without allowing them to
   govern by default.
8. Federate through sovereign local authorities and governed bridges rather than universal shared
   state.
9. Use the new layer to remove context-heavy instruction, duplicate inventories, and manual
   reconstruction.

The success criterion is subtractive. If governed context requires agents to maintain another large
ontology, registry, and ceremony without retiring existing complexity, the opportunity has been
misapplied.

## 1. Why context is part of the control system

### 1.1 Retrieval changes action even when it does not change truth

The Practice already distinguishes source authority, generated views, operational state, and durable
memory. [PDR-050](../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md)
states that state is truth-of-now, memory is truth-across-time, and generated read models derive
authority from their sources and renderers. [PDR-119](../../practice-core/decision-records/PDR-119-agent-memory-as-an-event-graph-with-renderers.md)
develops immutable events and deterministic projections for suitable surface classes.

Those distinctions are necessary but not sufficient. A projection can be correctly derived and
still be inappropriate for the current decision.

For example:

- an accurate archived incident may be irrelevant to a low-risk local edit;
- a superseded rule may be essential evidence in a retrospective but harmful in ordinary context;
- a valid team claim may be visible but not prove that the actor remains alive;
- a technically available tool may be unauthorised for the current role or obligation;
- a plausible hypothesis may deserve preservation but not operational influence;
- sensitive evidence may be useful in aggregate while its raw form must not cross a boundary.

The selection of context is therefore an intervention on the decision process. It changes the field
of available reasons and actions.

### 1.2 Similarity is only a candidate generator

Semantic similarity, search ranking, recency, and manual links can identify potentially relevant
material. None alone establishes that the material should participate in the current context.

A governed context decision may need to consider:

- current purpose;
- actor identity and role;
- obligation and attempt identity;
- source and transformation provenance;
- epistemic status and confidence;
- current authority and eligibility;
- sensitivity and permitted disclosure;
- temporal scope and volatility;
- contradiction or supersession;
- expected decision value and possible harm;
- whether a smaller abstraction is sufficient;
- whether the consumer can act safely on what it receives.

This echoes a useful distinction in [NIST SP 800-162](https://csrc.nist.gov/pubs/sp/800/162/final):
authorisation can depend on attributes of the subject, object, operation, and environment rather
than one coarse role. The Practice need not adopt ABAC wholesale to reuse the distinction.

### 1.3 Context has positive and negative powers

Context can enable continuity, orientation, consistent constraints, interruption recovery, reuse of
learning, coordination, and causal reasoning. It can also produce stale-authority intrusion,
inherited framing, leakage across purposes, reactivation of completed intentions, false certainty
from polished summaries, loss of independent exploration, hidden transfer of policy, or more
information than an agent can evaluate proportionately.

A mature Practice should govern both what context makes possible and what it prevents from remaining
possible.

## 2. Eight dimensions that must not collapse

| Dimension | Governing question | Example |
| --- | --- | --- |
| **Existence** | Does the record or state still exist? | A superseded PDR remains in history. |
| **Epistemic status** | What is currently believed or warranted? | A claim is contested or superseded. |
| **Accessibility** | Can this actor retrieve it at all? | A diagnostic reviewer may access an archive. |
| **Disclosure permission** | May it be shown for this purpose and audience? | Raw evidence may not cross a public boundary. |
| **Operational eligibility** | May it influence reasoning or generate work? | An archived plan may not create tasks. |
| **Action authority** | May this actor use it to cause an effect? | A reviewer may recommend but not deploy. |
| **Liveness** | Is the actor or mechanism currently capable of receiving and acting? | A watcher may live while the reasoning loop is absent. |
| **Retention status** | How long and in what form should it remain? | A terminal account may outlive raw stream detail. |

These dimensions interact but should not be encoded as one universal status. A record can be
historical-only, accessible to a diagnostic role, prohibited from operational use, and retained as
protected evidence.

[PDR-133](../../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
already demonstrates why such decompositions matter: liveness is a partial order of independently
failing classes, not a boolean. The same reading discipline should apply to retained state. Evidence
about one dimension licenses no claim about dimensions it did not traverse.

## 3. A Practice-native causal-participation model

The model connects three existing directions:

1. event and provenance graphs;
2. the obligation/attempt/actor/evidence lifecycle;
3. operational eligibility and inhibition.

```mermaid
flowchart LR
    S[Sources and events]
    C[Claims, decisions, policies]
    D[Derived views and models]
    E[Eligibility and authority]
    X[Purpose-scoped context]
    A[Agent or human action]
    W[World effects]
    R[Evidence and reconciliation]
    L[Learning, revision, forgetting]

    S --> C
    C --> D
    C --> E
    D --> E
    E --> X
    X --> A
    A --> W
    W --> R
    R --> L
    L --> C
    L --> E
```

The significant addition is the eligibility and authority layer between retained knowledge and
active context.

A source may participate in the present through relationships such as:

- supports;
- contradicts;
- derived into;
- interpreted as;
- authorises;
- constrains;
- generates;
- activates;
- prohibits;
- supersedes;
- revokes;
- eligible for;
- visible within;
- review when;
- retained as evidence for.

[W3C PROV-DM](https://www.w3.org/TR/prov-dm/) and
[PROV-O](https://www.w3.org/TR/prov-o/) provide interoperable vocabularies for
entities, activities, agents, derivation, attribution, and generation. They do not model the
Practice's full authority and eligibility semantics, but they offer a useful provenance floor.

[ODRL 2.2](https://www.w3.org/TR/odrl-model/) demonstrates a machine-readable model in which
permissions, prohibitions, duties, parties, assets, actions, and constraints remain explicit. Its
value here is not as a universal OCE policy language, but as evidence that rights and obligations can
travel as structured semantics rather than unstructured prose around an asset.

Provenance is necessary but not sufficient. It can explain where a claim came from and how it was
transformed; it cannot establish whether the source remains applicable, use is permitted, the actor
may act, a superseding decision exists, or the context is proportionate.

## 4. Context assembly as a governed transform

A context assembler should be understood as a transform over authoritative sources, not a memory
search endpoint.

```text
candidate retrieval
    → source and provenance validation
    → purpose and actor resolution
    → obligation/attempt scope
    → authority and eligibility evaluation
    → sensitivity and disclosure minimisation
    → contradiction and supersession handling
    → proportionality and context-budget selection
    → rendered context with warnings and provenance
```

Possible results need not be only return or refuse. A projection may:

- return exact content;
- return it with an epistemic warning;
- return a less revealing abstraction;
- return competing claims together;
- request human authority;
- quarantine material from ordinary context;
- defer until a named condition;
- refuse operational use while preserving diagnostic access.

A consequential projection should be able to identify its purpose, consumer, source coverage,
omitted classes, generation time, governing policies, uncertainty, conflicts, expiry, and permitted
use. This does not require retaining every prompt. It requires enough evidence to reconstruct why
consequential context was legitimate.

The Practice's current-contract work identifies a related distinction: a full decision record and
its currently enacted clauses are different products. Agents need a concise current projection;
reviewers need causal history. A good projection links to full evidence while excluding historical
clauses from ordinary activation.

[JSON-LD 1.1](https://www.w3.org/TR/json-ld11/) offers one standards-based representation for
linked data in JSON, and [SHACL](https://www.w3.org/TR/shacl/) offers graph-shape validation. Their
value should be tested against actual OCE requirements rather than inferred from the graph-shaped
problem.

## 5. Candidate transitions rather than direct truth mutation

Agents author documents, events, plans, comments, code, and state. Some writes are observations;
others change authority, eligibility, or future work. Treating them uniformly allows descriptive
material to become governance and operational convenience to rewrite durable truth.

A stronger pattern is:

```text
observation or proposal
    → candidate transition
    → structural validation
    → causal and proportional assessment
    → appropriate authority decision
    → deterministic state transition
    → effectful actuation
    → reconciliation
```

A consequential candidate might identify:

- subject and subject kind;
- observed and proposed state;
- reason and evidence;
- causal hypothesis and alternatives;
- affected projections and consumers;
- authority required;
- reversibility and blast radius;
- review or expiry condition;
- expected actuators;
- verification and rollback.

This is not mandatory frontmatter for every edit. It is a semantic contract for transitions that
alter authority, eligibility, recurrence, or external effects.

The surrounding machinery can remain deterministic: identity resolution, schema validation,
expected-state checks, permission checks, deduplication, propagation, effect verification, and audit.
The core decision may remain judgement-bearing: whether evidence is causally sufficient, an
intervention is proportionate, a generator should be suspended, or an external boundary may receive
a projection.

## 6. Projection, revocation, and reconciliation

A source change does not end its influence if summaries, indexes, adapters, dashboards, copied
instructions, or external projections continue to present the old meaning.

A correction, revocation, or retirement may require each descendant to be regenerated, invalidated,
suppressed, quarantined, restricted to historical use, notified to a consumer, or retained under a
named evidential exception.

Revoking authority at the source is not enough. The system must establish whether:

- a capability remains advertised by an adapter;
- old context remains cached;
- a waiting obligation can still resume;
- an automation retains credentials;
- a derived policy still permits action;
- a stale actor can publish a result;
- a local checkout still activates superseded guidance.

The regulator is complete only after reconciliation establishes that intended inhibition is true in
the operational environment.

Some forgetting requires remembering non-permission. The Practice may need content-minimised records
showing that a capability was revoked, an obligation completed, a decision superseded, a projection
must not be regenerated, or a consumer was notified. Such records must remain proportionate and must
not retain the prohibited substance by another route.

## 7. Protected alternatives, uncertainty, and absence

A system containing only current consensus cannot show how confidence was earned, which alternatives
were rejected, whether contrary evidence was fairly tested, or what would reopen the question. Yet
returning every historical alternative to every agent recreates captivity through context overload.

The useful separation is:

- current operational projection;
- protected evidence and alternatives;
- explicit reopening conditions;
- diagnostic retrieval under the right authority and purpose.

The Practice should also represent meaningful absence:

- we did not measure this;
- the relevant actor was unavailable;
- an event may have been lost;
- this source was intentionally excluded;
- evidence is insufficient to attribute failure;
- an item was removed under a protected process.

Without negative structure, an agent may reconstruct a confident complete story from systematically
incomplete context.

For selected inquiries, context assembly could preserve independent exploration by giving one agent
a current synthesis and another constitutional constraints plus source evidence without inherited
interpretation, then reconciling after independent outputs exist. James March's exploration and
exploitation model remains a useful warning that mutual learning can improve short-run exploitation
while reducing the diversity needed for later adaptation
([March, 1991](https://doi.org/10.1287/orsc.2.1.71)). It does not provide an optimal OCE team
topology.

## 8. Federation through sovereign local authority

The Practice spans repositories, hosts, organisations, agents, people, and external systems. A
universal graph or state service would promise coherence while creating one authority bottleneck,
security boundary, compatibility burden, failure domain, and pressure to flatten local vocabularies
and rights.

[PDR-125](../../practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md)
instead treats Practice estates as independently evolving and uses shared specification, shared wire
schema, and local implementation. That is the stronger foundation.

A bridge between authorities should carry a bounded projection, not replicate the whole source
estate. Its contract should state source authority, receiving principal and purpose, semantic
profile, selected entities and relationships, policy and expiry, provenance, allowed operations,
revocation path, local storage limits, reconciliation, and retention or deletion obligations.

The [Solid Protocol](https://solidproject.org/TR/protocol) is a community specification for
interoperable data pods, identifiers, access control, and linked data. It may offer useful experiments
for repository-external resource authority and application choice. It is not a W3C Recommendation,
and nothing here establishes that it fits OCE's deployment needs.

## 9. Opportunity portfolio

### O1 — Establish a causal-participation vocabulary

**Direction:** connect existing concepts.

Name the relationships by which retained state affects current action: support, derivation,
authority, eligibility, activation, prohibition, supersession, revocation, and reopening.

**Expected return:** cheaper reconstruction, clearer invalidation, and fewer implicit policy
transfers.

**Stop condition:** reject if the vocabulary merely renames existing PDR concepts without improving
a worked transition.

### O2 — Treat context assembly as a governed capability

**Direction:** introduce experimentally.

For one consequential workflow, generate context under explicit purpose, actor, obligation,
eligibility, provenance, and minimisation rules.

**Expected return:** less always-on instruction, fewer stale authorities, better orientation.

**Stop condition:** reject if it requires a central context service or more agent input than the
current process.

### O3 — Join obligation lineage to context and evidence

**Direction:** strengthen.

A projection should know which intent, obligation, attempt, and actor it serves. Consequential output
should link back to the projection and its source evidence.

### O4 — Use candidate transitions for authority-changing writes

**Direction:** strengthen and constrain.

Agents propose changes to eligibility, policy, recurrence, or external effects; deterministic tooling
validates and applies approved transitions.

### O5 — Add projection-convergence and revocation tests

**Direction:** strengthen.

Use the current PDR-094 projection contradiction as a first specimen: change authority, enumerate live
projections, prove convergence, and verify old operational shapes are absent.

### O6 — Introduce protected alternative and absence representations

**Direction:** investigate.

Represent rejected hypotheses, missing evidence, and reopening triggers without placing them in
ordinary current context.

### O7 — Make bridge projections policy-carrying

**Direction:** investigate.

Cross-repository or external projections should carry provenance, purpose, allowed use, expiry, and
revocation semantics.

### O8 — Use context governance to delete ceremony

**Direction:** mandatory accompaniment.

Every adopted capability must identify instructions, indexes, state fields, channel choices, or
manual checks it removes.

## 10. Computational skeleton

The architecture can be expressed compactly:

```text
state + events
schemas + invariants
validators + judgement
authority + purpose
transforms + actuators
reconciliation + learning
```

State says what is currently true, believed, authorised, or eligible; events preserve how it became
so. Schemas make distinctions representable; invariants constrain relationships and transitions.
Machines prove structural, temporal, and authority conditions; agents form causal and proportional
recommendations; humans or constituted authorities decide where legitimacy, values, or consequential
risk are essential. Transforms change represented state; actuators change the operational world.
Reconciliation proves the world matches the intended transition; learning changes future policies,
tools, context assembly, or the regulator itself.

## 11. What should stop if this direction is valid

The Practice should consider stopping:

- treating accessible state as automatically context-eligible;
- treating semantic relevance as sufficient authority;
- copying settled instructions into several surfaces without a projection contract;
- placing full historical explanation in always-on contexts;
- allowing summaries to become orphaned replacements for sources;
- asking agents to infer purpose, role, and authority from file location;
- relying on deletion of one source while descendants continue to influence action;
- treating cross-system delivery success as semantic convergence;
- creating a new channel where a governed projection would suffice;
- preserving bridges after named consumers migrate;
- adding a policy or validator without a retirement condition.

## 12. Risks and anti-patterns

### Universal ontology

Typed relationships can expand into an ontology that models everything and serves nothing. Begin
with decisions and failure specimens.

### Context bureaucracy

Applying a large policy evaluation to every low-risk action would undermine AX. Governance must be
proportional and mostly structural.

### False completeness

A generated context can look authoritative while omitting unmodelled evidence. Projections must state
coverage and known exclusions.

### Policy as hidden code

Machine-readable policy can obscure value choices behind syntax. Human explanation, ownership, and
appeal remain necessary.

### Centralisation through convenience

A context compiler can become de facto authority. It must remain a replaceable projection mechanism
over explicit sources.

### Governance theatre

Metadata can make transitions legible without making them correct. Evaluation must measure recovery,
stale-authority avoidance, human control, and deleted complexity.

### Privacy and security overreach

Provenance and correlation can increase exposure. Evidence collection should be minimised,
purpose-bound, and threat-modelled; absence of a legitimate question should mean absence of
collection.

## 13. Research and evaluation

### Experiment 1 — stale-authority intrusion

Place current and superseded instructions in the same estate. Compare broad retrieval with
eligibility-governed context. Measure stale instruction use, adaptation time, and false suppression of
useful history.

### Experiment 2 — context minimisation

Give agents full history, current summary only, and a governed minimal projection with source access.
Measure outcome quality, orientation cost, review burden, and recovery.

### Experiment 3 — derivative revocation

Create a source decision, summary, adapter instruction, external status, and waiting obligation.
Supersede the source. Measure descendant convergence and resurrection.

### Experiment 4 — protected alternatives

Compare dominant synthesis in every context with an independent source-only first pass plus later
reconciliation. Measure valid novelty, duplication cost, and false dissent.

### Experiment 5 — zero-agent continuity

End all sessions while an obligation waits. Resume from durable state using a governed projection.
Measure reconstruction, duplicate work, and reliance on private session memory.

### Experiment 6 — purpose-bound bridge

Send a minimal projection to another repository or system under a declared purpose and expiry.
Attempt cross-purpose reuse and post-revocation access.

### Experiment 7 — remove-the-layer drill

Delete the experimental context compiler. Verify that semantic authority, evidence, and obligations
remain understandable and another implementation can reconstruct the same projection.

A useful pilot should demonstrate lower context and coordination cost, fewer stale-authority errors,
equal or better outcomes, explicit human decision rights, complete provenance for consequential
output, reliable revocation, portability across at least two agent hosts, and actual deletion of
existing procedure or duplicate representation.

## 14. Restrained sequence

1. Select one current projection contradiction or multi-session obligation.
2. Map the eight dimensions without creating infrastructure.
3. Define the minimum causal-participation edges needed for that specimen.
4. Generate one context projection as a pure, inspectable artefact.
5. Run it with one current agent host and one weaker host.
6. Exercise correction, revocation, waiting, and recovery.
7. Measure AX and review cost.
8. Delete the compensating instructions the experiment genuinely replaces.
9. Decide whether a portable PDR or host ADR is warranted.
10. Stop if the model adds more representational burden than operational value.

## 15. Principal conclusions

1. Context is a temporary causal projection, not a neutral bundle of relevant text.
2. Retained state should not acquire present influence merely because it is accessible.
3. Existence, belief, access, disclosure, eligibility, authority, liveness, and retention must remain
   separable.
4. The Practice already owns most necessary concepts; the opportunity lies in their operational
   composition.
5. Typed lineage should connect sources, views, obligations, attempts, actors, actions, and learning.
6. Agents should propose authority-changing transitions; deterministic shells should validate,
   enact, and reconcile them.
7. Revocation and forgetting are descendant-convergence problems, not one-record updates.
8. Protected evidence, alternatives, uncertainty, and absence can remain available without governing
   ordinary action.
9. Federation should exchange bounded, policy-carrying projections between local authorities, not
   create a universal graph.
10. The architecture earns its place only by making existing context, ceremony, and reconciliation
    work disappear.

The deeper opportunity can be stated compactly:

> **The Practice can become an environment in which retained state participates in present agency
> only through explicit, evidence-bearing, purpose-scoped, revocable relationships—while its history
> remains inspectable and its future remains open.**

## References

### OCE sources

- [PDR-009: Canonical-First Cross-Platform Architecture](../../practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md)
- [PDR-027: Threads, Sessions, and Agent Identity](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
- [PDR-035: Agent Work Capabilities Belong to the Practice](../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md)
- [PDR-050: State and Memory Substrate Contracts](../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md)
- [PDR-094: Coordination-Event Rotation](../../practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md)
- [PDR-111: Agent Experience Is First-Class](../../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
- [PDR-118: Agent Work State Model](../../practice-core/decision-records/PDR-118-agent-work-state-model.md)
- [PDR-119: Agent Memory as an Event Graph with Renderers](../../practice-core/decision-records/PDR-119-agent-memory-as-an-event-graph-with-renderers.md)
- [PDR-125: Inter-Practice Collaboration Protocol](../../practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md)
- [PDR-133: Liveness Classes and Platform Declaration](../../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)

### Standards and research

- [W3C PROV-DM](https://www.w3.org/TR/prov-dm/)
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)
- [W3C ODRL Information Model 2.2](https://www.w3.org/TR/odrl-model/)
- [W3C JSON-LD 1.1](https://www.w3.org/TR/json-ld11/)
- [W3C Shapes Constraint Language](https://www.w3.org/TR/shacl/)
- [NIST SP 800-162: Attribute Based Access Control](https://csrc.nist.gov/pubs/sp/800/162/final)
- [Solid Protocol](https://solidproject.org/TR/protocol)
- [Conant and Ashby, “Every Good Regulator of a System Must Be a Model of That System”](https://doi.org/10.1080/00207727008920220)
- [March, “Exploration and Exploitation in Organizational Learning”](https://doi.org/10.1287/orsc.2.1.71)
