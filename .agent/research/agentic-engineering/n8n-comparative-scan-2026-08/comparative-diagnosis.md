---
title: 'Comparative diagnosis — the Practice on its own terms'
type: research-synthesis
status: active
stage: 'Independent OCE diagnosis complete; main source-independent report follows'
date: 2026-08-04
audience: 'Practice maintainers and reviewers'
subject: 'Which systemic capabilities are absent, nascent, fragmented, underpowered, well matched, overdeveloped, misplaced, counterproductive, valuable and distinct, or still unknown'
related:
  - README.md
  - method-and-source-boundary.md
  - tranche-1-structural-observations.md
  - tranche-2-lifecycles-and-coordination.md
  - tranche-3-extension-governance-and-evolution.md
  - ../../../../.agent/practice-core/practice.md
  - ../../../../.agent/directives/principles.md
---

# Comparative diagnosis — the Practice on its own terms

## Purpose and independence

The source-facing tranches supplied questions. This document answers them by inspecting the Practice
independently.

A source observation survives into the diagnosis only when current OCE evidence supports a
Practice-native finding. Similarity is not evidence. The absence of similarity is not evidence of a
defect. Several of the strongest results are findings that the Practice should preserve precisely
because its obligations and freedoms differ from those of a public workflow product.

The diagnosis classes are:

- **absent**;
- **nascent**;
- **fragmented**;
- **underpowered**;
- **well matched**;
- **overdeveloped**;
- **misplaced**;
- **counterproductive**;
- **valuable and distinct**;
- **not yet knowable**.

A capability may carry several classes at different scales. A portable concept can be well matched
while its host tooling is underpowered and one operational projection is counterproductive.

## Executive finding

The Practice is not primarily short of concepts, rules, or governance. It is exceptionally rich in
all three.

It already has mature doctrine for:

- canonical content and thin platform projections;
- Practice memotype and host phenotype;
- state, memory, generated read models, surface contracts, validators, repair, and learning;
- identity, sessions, threads, claims, liveness, handoff, and inter-Practice exchange;
- capture, consolidation, graduation, forgetting, and provenance;
- agent experience and friction as product evidence;
- plan authority versus external execution state;
- local latest-schema replacement versus versioned external wire contracts;
- structural enforcement and adaptive immunity.

The principal weakness is **operational discontinuity**:

> Concepts are often complete at doctrine altitude, represented again in operational guidance,
> schemas, tools, plans, adapters, external systems, and generated views — but the relationships
> that prove those embodiments remain aligned are incomplete, uneven, or dependent on repeated
> agent procedure.

The next useful step is therefore not another broad doctrinal layer. It is to make a smaller set of
cross-scale relationships operationally complete:

1. durable intent and ratified authority;
2. concrete obligation;
3. one or more execution attempts;
4. the currently responsible actor and its bounded claim;
5. durable evidence and current projections;
6. waiting, correction, cancellation, recovery, terminal account, consolidation, and forgetting.

That lifecycle can connect several existing Practice capabilities and retire compensating ceremony.

## Summary diagnosis

| ID | Capability | Portable concept | Host enactment | Principal direction |
| --- | --- | --- | --- | --- |
| D01 | Canonical semantics and checked projections | Well matched | Fragmented / underpowered | Connect, finish, simplify |
| D02 | Enacted truth versus historical decision record | Nascent | Fragmented | Introduce a current-contract projection; preserve history |
| D03 | Durable plan intent versus schedule state | Valuable and distinct | Transitional but strong | Preserve and complete |
| D04 | Rule, occurrence, attempt, actor, and evidence lifecycle | Fragmented | Underpowered | Introduce as a unifying operational contract |
| D05 | Claims, identity, liveness, succession, and stale actors | Advanced | Underpowered at claim lifecycle | Strengthen leases, succession, stale-write protection |
| D06 | Durable waiting and contested resumption | Nascent | Fragmented | Generalise beyond owner gates and handoff prose |
| D07 | Event facts, generated read models, and transport projections | Well matched | Strong but drift-prone | Preserve; add convergence checks |
| D08 | Retention, consolidation, provenance, and forgetting | Valuable and distinct | Strong with projection drift | Preserve; repair operational embodiments |
| D09 | Agent experience and procedural compression | Well matched | Underpowered | Replace fixed ceremony with outcome-oriented facades |
| D10 | Validation and immune-layer ecology | Advanced / partly overdeveloped | Fragmented | Map coverage and independence; retire redundant fences |
| D11 | Executable multi-agent topology simulation | Nascent | Underpowered | Add declarative scenario environments |
| D12 | Practice evidence and TAU semantic core | Strongly planned | Implementation absent | Execute existing direction; do not create a rival system |
| D13 | Capability extension membrane | Fragmented | Fragmented | Unify lifecycle and trust without a universal plugin runtime |
| D14 | Compatibility obligation by seam | Valuable and distinct | Strong | Preserve; make consumers and expiry more discoverable |
| D15 | Contract-change impact detection | Nascent | Fragmented | Attach executable estate diagnosis to major changes |
| D16 | Coordination topology chosen by invariant | Implicit | Fragmented | Make selection explicit; refuse universal centralisation |
| D17 | Correction, interruption, cancellation, and human control | Strong intent | Underpowered operationally | Connect owner direction to typed attempt lifecycle |
| D18 | Communication planes and channel economy | Advanced | Overdeveloped / costly | Simplify around substance and lifecycle classes |
| D19 | Trust and authority for extensions and participants | Nascent | Underpowered | Extend beyond the trusted-agent assumption |
| D20 | Subtraction, retirement, and refusal | Valuable and distinct | Demonstrated but uneven | Preserve and make transition completion observable |
| D21 | n8n as a possible Practice participant | Not a Practice capability | Not yet knowable | Specialised, replaceable participant only; never authority |

## D01 — canonical semantics and checked projections

### Diagnosis

- **Portable concept:** well matched.
- **Host enactment:** fragmented and underpowered.
- **Confidence:** high.

The Practice already states the essential contract more completely than the comparison:

- [PDR-009](../../../../.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md)
  separates canonical artefacts, platform adapters, entry points, and activation triggers.
- [PDR-035](../../../../.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md)
  places agent-work semantics in the Practice while host implementations remain phenotype.
- [PDR-050](../../../../.agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md)
  defines state, memory, generated read models, surface contracts, recomputation, validation,
  repair, and learning.
- [ADR-165](../../../../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md)
  maps the portable/local boundary for this repository.

The problem is not missing doctrine. The local substrate inventory explicitly records incomplete
contract coverage, missing drift checks, absent topology validation, and a future rather than current
repair tool:

- [memory/state substrate contracts](../../../../.agent/memory/executive/memory-state-substrate-contracts.md).

A stronger live example is direct projection drift:

- accepted [PDR-094](../../../../.agent/practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md)
  now requires pass-level absorption evidence, no per-event disposition ledger, and treats the archive
  as optional future-mining substrate rather than a safety hedge;
- [collaboration-state conventions](../../../../.agent/memory/operational/collaboration-state-conventions.md)
  reflect that current contract;
- the live [state README](../../../../.agent/state/README.md) still says rotation is never deletion,
  requires one `manifest.jsonl` row per event, and describes the archive as a retained store.

This is exactly the failure PDR-050 predicts: the authority is correct while an operational teaching
projection remains stale.

### Outcome direction

- **Connect** canonical authority, host contracts, teaching surfaces, schemas, and generated views
  through explicit projection relationships.
- **Finish** the substrate doctor rather than authoring another contract-for-contracts.
- **Generate or validate** mechanically derivable claims in operational READMEs.
- **Preserve** authored explanations where purpose and judgement cannot be generated.
- **Stop** treating a linked document as aligned merely because it names the authority.

### Falsifier

If a complete current checker already proves the state README, local inventory, schemas, commands,
and PDR-094 agree — and the observed contradiction is only a branch or retrieval artefact — this
finding is wrong. The current `main` files support the finding.

## D02 — enacted truth versus historical decision record

### Diagnosis

- **Portable concept:** nascent.
- **Host enactment:** fragmented.
- **Confidence:** medium-high.

Decision records correctly preserve context, amendments, rejected shapes, falsifiers, and
provenance. Several current PDRs have accumulated long status clauses and amendment histories because
those changes matter.

The durable record and the current executable contract are nevertheless different information
products:

- a reviewer needs the whole causal and historical record;
- an operating agent first needs the currently enacted clauses, vocabulary, invariants, and linked
  phenotype obligations;
- a machine needs closed fields and relationships it can validate.

Current PDRs sometimes carry all three in one long document. The repository has generated indexes,
strict manifests, and current-state schemas elsewhere, but no general current-contract projection
for amended Practice decisions was found.

This makes a stale secondary summary harder to detect and increases always-on reading cost. It also
encourages operational files to restate the current contract manually.

### Outcome direction

- **Introduce** a checked enacted-contract projection for heavily amended Practice records.
- **Preserve** the full decision record unchanged as causal and historical authority.
- **Do not** create summary prose that becomes another manually maintained source.
- **Prefer** structured enacted clauses, supersession edges, and current phenotype obligations that
  can be generated or verified.
- **Reduce** duplicated current-state restatements across rules, READMEs, plans, and memory when they
  can point to or project the enacted contract.

### Falsifier

If cold agents can reliably extract the current operative contract from amended records with lower
cost and fewer errors than a separate checked projection, the additional surface would not pay for
it. This should be tested, not assumed.

## D03 — durable plan intent versus schedule state

### Diagnosis

- **Portable concept:** valuable and distinct.
- **Host enactment:** strong but transitional.
- **Confidence:** high.

The planning estate explicitly separates durable product intent from moving execution state:

- [plan-node schema](../../../../.agent/plans/plan-node-schema.md) states that the repository holds
  intent and mechanism while schedule movement belongs to Linear;
- plan `status` is ratification state, not in-progress state;
- strategic, delivery, and runbook nodes have different lifespans and authority;
- owner gates model waiting conditions with an expiry and visible drift;
- [plans root](../../../../.agent/plans-backlog-2026-07/README.md) separates NOW, NEXT, LATER, and
  archive lanes and rejects invisible plans.

This is a stronger answer than preserving execution state in plan files. It should be preserved.

The estate is still in transition. The root path itself is a dated backlog home, the plan-node
schema is marked sketch pending its own ratification, and live plans retain earlier frontmatter and
per-todo state shapes. This is not necessarily a defect: the estate openly records the transition.
It does mean that the final contract is not yet uniformly enacted.

### Outcome direction

- **Preserve** repository intent versus Linear schedule authority.
- **Complete** the plan-estate migration and remove superseded lifecycle/status mechanisms rather
  than bridging them indefinitely.
- **Use** the new operational lifecycle below to connect a ratified plan to concrete work without
  bringing schedule state back into the plan.
- **Stop** using plan movement or todo mutation as the only record of an agent attempt.

### Falsifier

If Linear cannot preserve the evidence, identity, or public/private boundary needed for execution
state, the split needs a revised projection contract rather than blind preservation.

## D04 — rule, occurrence, attempt, actor, and evidence lifecycle

### Diagnosis

- **Portable concept:** fragmented.
- **Host enactment:** underpowered.
- **Confidence:** high.

The Practice already contains most constituent concepts:

- durable plan intent;
- Linear tickets;
- lanes and delivery plans;
- agent sessions and identity;
- claims;
- handoff and adoption;
- communication events;
- branches, commits, PRs, and review evidence;
- state-to-memory consolidation.

They do not yet form one explicit lifecycle.

A claim describes an immutable undertaking held by a session. A delivery plan describes one step of
a lane. A Linear ticket carries moving execution state. A session may attempt work. A PR may contain
the result. The repository does not yet provide a single portable contract that answers:

- which durable obligation these surfaces represent;
- whether a successor session continues the same attempt or begins another;
- how retries and failed attempts remain linked;
- which actor currently holds the right to update the operational truth;
- what evidence constitutes a terminal account;
- when the occurrence is complete even if one attempt failed;
- how the outcome reaches consolidation and forgetting.

### Outcome direction

Introduce a **Practice obligation lifecycle** with five identities:

```text
intent / rule
    → occurrence / obligation
        → attempt
            → current actor claim
            → evidence events
        → terminal account
        → consolidation and retention
```

This is a semantic contract, not a mandate for a central service or one storage technology.

It should connect existing plans, Linear tickets, claims, sessions, branches, PRs, and memory rather
than replace their audience-specific functions.

### Things it should make unnecessary

- manually reconstructing whether two sessions worked on the same obligation;
- rewriting failed work as though only the successful attempt happened;
- treating a claim, branch, ticket, or PR as the universal identity;
- maintaining live sessions merely to retain blocked work;
- duplicate PRs or external actions after uncertain retries;
- narrative-only handoff lineage.

### Falsifier

If a worked multi-session, multi-machine, externally coordinated example can already be followed
unambiguously from ratified intent through every attempt, correction, cancellation, result, and
consolidated lesson using current canonical identities, no new lifecycle is needed. Current evidence
shows the relationships are distributed across several surfaces.

## D05 — claims, identity, liveness, succession, and stale actors

### Diagnosis

- **Portable identity and liveness:** advanced and valuable.
- **Host claim lifecycle:** underpowered.
- **Confidence:** high.

The Practice's identity and liveness work is substantially more sophisticated than the comparative
source:

- [PDR-027](../../../../.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
  distinguishes threads, sessions, seats, identity derivation, forks, overrides, model switches,
  inheritance, and audit;
- [PDR-078](../../../../.agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md)
  defines heartbeat responsibilities and absence semantics;
- [PDR-133](../../../../.agent/practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
  models liveness as a partial order over independently failing classes and rejects over-reading a
  green signal;
- [collaboration conventions](../../../../.agent/memory/operational/collaboration-state-conventions.md)
  make the undertaking immutable and allow explicit adoption.

The remaining weakness is the claim's operational lifecycle:

- active claims are refreshed but session resume does not reclaim them;
- missed closes become stale and are archived later;
- orphan handling is procedural;
- claims identify an undertaking but do not appear to carry a general attempt identity or fencing
  value;
- a superseded actor can still produce GitHub or external effects unless each destination has its own
  stale-result discipline.

### Outcome direction

- **Preserve** the liveness class model and external-certification discipline.
- **Strengthen** claims into bounded actor leases over a named attempt.
- **Add** explicit succession/supersession and stale-result semantics at shared-state and external
  projection boundaries.
- **Connect** liveness decisions to the obligation lifecycle rather than treating liveness as a
  parallel monitoring corpus.
- **Do not** infer completion from claim freshness or liveness.

### Important constraint

Fencing need not mean a database counter. The portable requirement is that a result from an actor
whose authority has been superseded cannot silently become the current account.

## D06 — durable waiting and contested resumption

### Diagnosis

- **Portable concept:** nascent.
- **Host enactment:** fragmented.
- **Confidence:** medium-high.

Waiting exists in several specific forms:

- plan owner gates name a condition and mandatory expiry;
- paused or NEXT plan lanes preserve non-active intent;
- handoffs preserve continuity;
- automations can monitor future conditions;
- conversation and escalation records wait for decisions;
- Linear tickets can be blocked.

There is no general Practice-owned state that says:

> this concrete obligation is alive, no reasoning process need remain active, this named condition
> resumes it, and only one actor may win the resumption transition.

As a result, waiting semantics are distributed among plan prose, external tools, session memory, and
human expectation.

### Outcome direction

- **Generalise** durable waiting as an occurrence state, not a plan status.
- **Name** the resumption condition, expiry or review horizon, and evidence source.
- **Use** expected-state transitions so duplicate triggers cannot create duplicate successor work.
- **Keep** owner gates as the plan-specific projection of the general concept.
- **Reduce** long-lived sessions and continuity prose whose only purpose is to remember that work is
  waiting.

## D07 — event facts, generated read models, and transport projections

### Diagnosis

- **Portable concept:** well matched.
- **Host enactment:** strong but drift-prone.
- **Confidence:** high.

The collaboration substrate already uses immutable event fragments and a generated shared log. State
and memory doctrine explicitly says generated read models derive authority from source fragments plus
the renderer. The inter-Practice protocol separates shared specification, shared schema, and local
code. TAU plans provider-neutral semantic events and sink adapters.

This is a mature semantic-fact/projection shape.

Weaknesses are practical:

- the local inventory records missing drift checks;
- operational READMEs can restate stale rules;
- some events or CLI operations have historically lacked antecedent validation;
- source events, rendered logs, GitHub artefacts, Linear state, and later TAU evidence do not yet
  share one occurrence identity.

### Outcome direction

- **Preserve** immutable fact fragments and generated views.
- **Add** projection convergence and acknowledgement where a downstream surface is operationally
  important.
- **Connect** event facts to obligation and attempt identity.
- **Separate** canonical fact from transport delivery and human rendering.
- **Stop** using a generated or external view as authority when its source relationship cannot be
  proven current.

## D08 — retention, consolidation, provenance, and forgetting

### Diagnosis

- **Portable concept:** valuable and distinct.
- **Host enactment:** strong with projection drift.
- **Confidence:** high.

The Practice has developed a nuanced answer:

- state is truth-of-now;
- memory is truth-across-time;
- consolidation is a transformation, not an archive copy;
- classes have different retention value;
- no raw signal leaves before full extraction or explicit disposition;
- provenance survives rotation;
- the raw source can remain as optional mining substrate but cannot lower the extraction bar;
- an archive must not create a permanent curation obligation;
- generated outputs and historical fragments are different lifecycle classes;
- local substrates support only the latest live schema, while external wire contracts can support a
  version family.

This is more complete than a generic execution-retention policy and should not be replaced.

### Outcome direction

- **Preserve** PDR-094, PDR-050, and the capture→distil→graduate discipline.
- **Repair** stale operational projections immediately through the owning transition, not another
  compatibility layer.
- **Connect** the obligation lifecycle's evidence classes to existing retention classes.
- **Measure** whether raw archives are ever mined; if not, their option value may not justify their
  footprint.
- **Stop** retaining whole transcripts or derived views merely because semantic extraction is
  incomplete.

## D09 — agent experience and procedural compression

### Diagnosis

- **Portable concept:** well matched.
- **Host enactment:** underpowered.
- **Confidence:** high.

[PDR-111](../../../../.agent/practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
correctly treats the substrate as a product for agent users and demands a visible capture→cure drain.
The [frictions register](../../../../.agent/memory/operational/frictions-register.md) provides rich
worked evidence. The cost-of-collaboration plan has already delivered useful structural repairs.

The same evidence shows ongoing procedural exposure:

- command flags and identity inputs have repeatedly required source inspection;
- fixed command sequences and shell hazards remain part of ordinary operation;
- substantive comms require temporary files and precise absolute-path rules;
- build and runtime generation have caused identity drift;
- late-staged or pathspec commit behaviour can invalidate otherwise green ceremony;
- many operational tools expose state-file and transaction mechanics directly.

The Practice understands the problem. The missing step is a systematic distinction between:

- reasoning that must remain visible because judgement is the value;
- deterministic orchestration that should become one outcome-oriented operation;
- complete forensic evidence that should remain available without occupying live attention.

### Outcome direction

- **Create outcome-oriented operational facades** for common agent intents.
- **Emit structured summaries** and preserve full evidence out of the attentional path.
- **Stabilise operational generations** rather than rebuilding tools during ordinary use.
- **Use the obligation lifecycle** to infer IDs, state, and valid transitions instead of asking agents
  to provide them repeatedly.
- **Stop** teaching fixed mechanics through ever-longer instruction when a structural tool can own
  them.
- **Preserve** explicit reflective gates for decisions, uncertainty, proportionality, and owner
  authority.

## D10 — validation and immune-layer ecology

### Diagnosis

- **Portable concept:** advanced and partly overdeveloped.
- **Host enactment:** fragmented.
- **Confidence:** high.

The Practice has many validators, hooks, rules, checks, schemas, smoke tests, E2E tests, CI checks,
review experts, and consolidation routines. `agent-tools/package.json` alone exposes a broad validator
and smoke-test estate. PDR-050 and the memetic immune system supply strong conceptual framing.

The problem is not too much correctness. It is incomplete visibility of the ecology:

- which material risk each detector covers;
- whether two detectors are independent or read the same projection;
- which prevention substrate makes an older warning redundant;
- which checks teach, block, observe, repair, or learn;
- which checks have measured defect-detection value and agent/human cost;
- where a large number of gates creates false confidence over a shared blind spot.

The agent-tools purpose report already asks the right question: what outcome or avoided harm repays
each control?

### Outcome direction

- **Map** validation by risk, system scale, evidence source, independence, severity, and response.
- **Retire** checks whose failure class has become impossible at a lower layer.
- **Combine** checks that duplicate one semantic invariant while preserving different evidence paths
  where independence adds resilience.
- **Measure** friction, false positives, detection yield, and escaped failures.
- **Stop** treating gate count or always-on weight as assurance.
- **Preserve** strict correctness; optimise selection and placement, never the standard.

## D11 — executable multi-agent topology simulation

### Diagnosis

- **Portable concept:** nascent.
- **Host enactment:** underpowered.
- **Confidence:** medium.

The tooling estate has substantial unit, integration, E2E, and smoke coverage. It includes worktree,
registry, watcher, bootstrap, dispatch, version, conformance, and built-command tests. Real multi-agent
sessions have also supplied unusually rich incident evidence.

What was not found is a declarative environment model in which a test requests a Practice topology
and receives controlled actors, state, external surfaces, failure injection, time, and assertions.
Current tests appear to validate mechanisms individually or through bespoke smoke scenarios.

Important topologies include:

- one agent / one checkout;
- several sessions / one coordination home;
- several machines or clones;
- one session acting across two Practice estates;
- GitHub plus Linear projections;
- a missing or stale watcher;
- a live loop behind failed notification;
- a dead actor with a fresh orphan heartbeat;
- duplicate resumption triggers;
- stale actor result after claim adoption;
- external capability unavailable;
- interrupted work reconstructed from evidence;
- source/renderer/schema drift.

### Outcome direction

- **Introduce** declarative Practice scenario environments and capability fixtures.
- **Reuse** the real liveness class taxonomy and surface contracts as assertion vocabulary.
- **Model time and failures deliberately** rather than waiting for live incidents.
- **Preserve** local unit and conformance tests as one scale in the ecology.
- **Do not** build a production orchestrator merely to test the Practice.

### Confidence limitation

The repository search surface may have missed a current unpublished or differently named topology
harness. The finding should be validated before planning implementation.

## D12 — Practice evidence and the TAU semantic core

### Diagnosis

- **Concept and plan:** strong.
- **Implementation:** absent by explicit status.
- **Confidence:** high.

TAU already contains many of the strongest comparative conclusions:

- questions precede signals;
- semantic events are provider-neutral;
- event contracts, allowlists, privacy, catalogues, versioning, adapters, fixtures, and conformance
  are staged explicitly;
- PostHog and Sentry are projections with distinct value;
- delivery is not understanding;
- interpretation, decision, change, and remeasurement complete the loop;
- absence of a warranted question can lead to a not-promoted outcome;
- warehouse work is trigger-bound rather than architecture theatre.

Sources:

- [TAU index](../../../../.agent/plans-backlog-2026-07/telemetry-and-understanding/README.md);
- [TAU delivery plan](../../../../.agent/plans-backlog-2026-07/telemetry-and-understanding/current/tau-delivery.plan.md).

The comparison does not justify a new telemetry architecture. It independently reinforces TAU's
existing direction.

The gap is that TAU is product/runtime focused. The Practice itself also needs a governed
work-episode evidence model for:

- obligation creation and completion;
- attempts, retries, waiting, correction, cancellation, and recovery;
- human attention and intervention;
- coordination cost;
- gate effectiveness;
- learning and retirement outcomes.

These may use the same semantic-event substrate but must not be conflated with product telemetry or
employee performance monitoring.

### Outcome direction

- **Execute** TAU rather than reopening its architecture.
- **Extend the question register**, under explicit information-governance boundaries, to Practice
  operational and learning questions that can change a real decision.
- **Reuse** the provider-neutral event contract.
- **Forbid** covert individual performance inference and any collection without approved purpose.
- **Keep** mission, product, work-episode, and fast operational loops distinct.

## D13 — capability extension membrane

### Diagnosis

- **Portable content/adapters:** strong.
- **Capability lifecycle and trust:** fragmented.
- **Confidence:** medium-high.

The Practice already handles canonical artefacts, platform adapters, entry points, activation
triggers, portability validation, shared schemas, local implementations, and platform capability
limitations.

External and executable capabilities nevertheless span several governance systems:

- canonical skills;
- host-specific skill adapters;
- rules and hooks;
- subagents and reviewers;
- MCP tools and servers;
- connected plugins;
- external coordinators such as GitHub, Linear, Slack, Notion, and potentially n8n;
- local TypeScript agent-tools.

They do not share one lifecycle vocabulary for provenance, declaration, validation, admission,
activation, role authority, current availability, behaviour evidence, suspension, consumer
migration, and retirement.

### Outcome direction

Create a **capability membrane contract**, not a universal plugin runtime:

```text
provenance
    → declaration and identity
    → validation and trust evidence
    → policy admission
    → activation for a context and role
    → bounded authority
    → current availability
    → observation
    → suspension / update / withdrawal
    → consumer migration
    → retirement
```

- **Preserve** canonical-first portability and host phenotype freedom.
- **Separate** provenance, integrity, review, permission, availability, and observed behaviour.
- **Make** authority decisions explicit by Practice, repository, organisation, role, and session.
- **Stop** treating installed, configured, connected, available, authorised, and safe as synonyms.
- **Refuse** one executable extension mechanism with unrestricted reach.

## D14 — compatibility obligation by seam

### Diagnosis

- **Portable concept:** valuable and distinct.
- **Host enactment:** strong.
- **Confidence:** high.

The Practice already makes the crucial distinction:

- local state and memory substrates support only the latest schema and are migrated or replaced;
- the inter-Practice wire supports compatible evolution within a version family and typed refusal
  across major families;
- adapters may preserve host capability differences without changing canonical substance;
- internal disproven designs are not preserved as runtime options.

This is better than a universal backwards-compatibility rule.

### Outcome direction

- **Preserve** this seam-specific doctrine.
- **Add discoverability**: a small compatibility-obligation register can name each seam, consumer,
  version policy, migration path, and removal condition.
- **Use change-impact detection** to migrate concrete consumers rather than keeping generic bridges.
- **Stop** compatibility arguments that name no consumer.
- **Refuse** public-product compatibility burdens where the Practice controls the whole estate.

## D15 — contract-change impact detection

### Diagnosis

- **Portable concept:** nascent.
- **Host enactment:** fragmented.
- **Confidence:** medium-high.

OCE has many specific detectors:

- plan-schema validation and gate drift;
- portability and adapter checks;
- schema drift checks;
- stale script and path checks;
- collaboration-state validation;
- protocol-wire conformance;
- reference direction;
- current-source anchors;
- PDR/ADR review and propagation conventions.

A general pattern is not yet explicit:

> A major contract change ships with an executable query over the living estate that identifies
> each affected consumer, severity, evidence, and required transition.

Without it, impact analysis often depends on text search, agent judgement, and broad compatibility
precautions.

### Outcome direction

- **Attach impact predicates** to major PDR, schema, path, vocabulary, and lifecycle changes.
- **Generate a concrete disposition ledger** for affected live consumers.
- **Keep** human migration explanation and judgement where impact is semantic.
- **Stop** declaring a migration complete because the new contract and its validator exist.
- **Use** impact evidence to justify removal of the old shape.

## D16 — coordination topology chosen by invariant

### Diagnosis

- **Portable concept:** implicit.
- **Host enactment:** fragmented.
- **Confidence:** medium-high.

The Practice uses several topologies:

- local untracked coordination state;
- generated shared views;
- one declared coordination home;
- a Director seat for some team coordination;
- peer agents and direct communication;
- team branches;
- GitHub and Linear as durable external surfaces;
- inter-Practice pointer-to-one-home rather than federated state;
- owner-held authority;
- optional external automation.

These choices have specific rationales, but there is no concise general decision contract that asks
which invariant requires leaderless coordination, one active coordinator, shared durable state,
control/execution separation, or eventual projection.

### Outcome direction

- **Introduce** an invariant-led topology lens covering consistency, liveness, locality, trust,
  latency, recoverability, and failure scope.
- **Preserve** distributed local agency where protocols and shared state suffice.
- **Use one active coordinator** only where a responsibility genuinely requires it.
- **Treat GitHub, Linear, Notion, n8n, and other surfaces as specialised participants or projections**,
  not default owners of Practice truth.
- **Refuse** a universal central nervous system.

## D17 — correction, interruption, cancellation, and human control

### Diagnosis

- **Intent:** strong.
- **Operational enactment:** underpowered.
- **Confidence:** high.

The Practice repeatedly states that:

- human experts lead;
- owner direction beats plan;
- agents remain corrigible;
- handoff and retirement preserve continuity;
- owner gates and escalations exist;
- the agent-tools purpose report names interruption, recovery, judgement, and decision rights as
  central.

These are not yet one operational event model. Owner correction can arrive through conversation,
comms, PR review, or direct instruction; its relation to the current attempt and plan is usually
narrative. Cancellation can mean closing a claim, abandoning a plan, closing a PR, stopping a child,
or changing direction.

### Outcome direction

- **Introduce typed correction, cancellation, supersession, and withdrawal events** in the
  obligation lifecycle.
- **Project owner direction** into the current attempt while preserving the original plan and the
  correction provenance.
- **Propagate cancellation** to child agents and external automation without deleting evidence.
- **Distinguish** correcting an attempt from replacing intent.
- **Measure** time-to-interrupt and state trustworthiness after interruption as AX and human-control
  qualities.

## D18 — communication planes and channel economy

### Diagnosis

- **Portable concept:** advanced.
- **Host enactment:** overdeveloped and costly in places.
- **Confidence:** high.

The Practice has immutable comms events, rendered logs, direct messages, conversations, sidebars,
joint decisions, escalations, claims, commit queues, handoffs, threads, team branches, PRs, Linear,
and several liveness surfaces. A channel register and placement contract attempt to route substance
correctly.

This richness emerged from real failures and is not arbitrary. It also imposes:

- selection cost;
- repeated identity and path mechanics;
- projection and retention complexity;
- many lifecycle-specific instructions;
- risk that one event is copied across surfaces rather than projected from one fact;
- a growing distinction vocabulary agents must understand before communicating.

### Outcome direction

- **Preserve semantic distinctions**, especially decision, escalation, claim, liveness, and durable
  evidence.
- **Simplify authoring** around a smaller semantic event API that routes to appropriate projections.
- **Separate work-local lifecycle events, team coordination, durable decision evidence, and learned
  memory** explicitly.
- **Reduce channels that differ only by storage or ceremony rather than substance.**
- **Test whether the full channel topology lowers total human and agent attention at different team
  sizes.**
- **Stop creating a new surface before showing why an existing semantic class cannot carry the need.**

## D19 — trust and authority for extensions and participants

### Diagnosis

- **Portable concept:** nascent.
- **Host enactment:** underpowered.
- **Confidence:** high.

The current collaboration conventions explicitly assume trusted agents acting in good faith.
Identity, liveness, provenance, and strict schemas do not establish authenticity or least authority.
The agent-tools purpose report correctly identifies this as open negative space.

As the Practice gains external tools, MCP servers, plugins, cross-estate agents, web automation, and
potentially n8n, cooperative trust becomes insufficient.

### Outcome direction

- **Define a threat and authority model** for agents and extensions sharing repositories, credentials,
  external systems, and mutable state.
- **Separate identity from authentication, trust from permission, and installation from runtime
  authority.**
- **Grant capabilities narrowly by role, context, and occurrence.**
- **Make writes attributable and reversible where possible.**
- **Preserve a lightweight trusted-team mode** where warranted; do not force hostile-distributed-system
  ceremony onto every local collaboration.
- **Refuse silent quality or security degradation when a capability is unavailable.**

## D20 — subtraction, retirement, and refusal

### Diagnosis

- **Portable concept:** valuable and distinct.
- **Host enactment:** demonstrated but uneven.
- **Confidence:** high.

The Practice does remove structures when evidence invalidates them:

- a dedicated workstream-awareness surface was implemented, found to cost more than it returned,
  absorbed into thread continuity, and retired;
- the completed-plans index was removed in favour of archive discovery and graph relationships;
- an overly broad liveness clause was retired when its assumptions failed;
- communication formats and old directories have been replaced;
- PDR-094 itself records several corrective evolutions, including removal of an accounting ledger;
- latest-only local substrate schema policy rejects permanent compatibility.

This is a major strength. It demonstrates that rich doctrine need not imply permanent accumulation.

Unevenness appears when a current doctrine change does not complete every operational projection or
when archived/transitional material remains highly discoverable without a current-state discriminator.

### Outcome direction

- **Preserve** falsifiability, supersession, replacement, and explicit refusal.
- **Make transition completeness machine-visible** across every projection.
- **Require an expected deletion/retirement set** when a structural cure lands.
- **Measure whether archives, rules, checks, and surfaces are still read or useful.**
- **Stop** allowing a transition to end at the canonical document while old teaching or operational
  surfaces remain live.

## D21 — n8n as a possible Practice participant

### Diagnosis

- **Capability:** not yet knowable.
- **Confidence:** high that it should not own authority; low about useful concrete roles until a
  Practice need is selected.

Nothing in the comparison supports replacing GitHub, Linear, Practice state, or emergent agent-team
coordination with n8n.

Potential roles exist only where n8n supplies a specialised, failure-tolerant projection or
automation:

- scheduled or condition-triggered actions;
- cross-system delivery and reconciliation;
- human-facing visibility over external processes;
- bounded operational workflows whose canonical intent and evidence remain elsewhere;
- non-critical glue that can disappear without suspending the Practice.

Any role must satisfy:

1. the Practice owns semantic identity and intent;
2. n8n receives the minimum projection needed;
3. delivery status is not canonical truth;
4. retry and idempotency are explicit;
5. failure is observable and recoverable without n8n's private state;
6. no credentials or data exceed the workflow's authority;
7. another implementation can replace the workflow without changing Practice doctrine;
8. the workflow does not become a hidden coordinator for local agent emergence.

### Direction

- **Investigate** only after selecting a real operational pressure.
- **Refuse** central orchestration as an architectural starting point.
- **Prefer** reversible experiments with one bounded integration loop.

## Cross-cutting interpretation

The five comparative lenses map onto the Practice as follows.

### Semantic core — advanced

Practice Core, PDRs, canonical directives, schemas, plan contracts, identity vocabulary, and TAU
questions provide strong semantic authority.

### Projection membrane — incomplete

Adapters, READMEs, generated logs, manifests, plans, Linear, GitHub, Notion, and host tooling project
that authority. Several are strong; convergence and current-contract projection are incomplete.

### Operational ecology — rich but not unified

Claims, liveness, communication, validators, tests, hooks, agents, branches, PRs, Linear, and
consolidation form a rich ecology. The missing obligation lifecycle prevents them from sharing one
work identity and causal account.

### Extension membrane — strong portability, weak common trust lifecycle

Canonical artefacts and host adapters are sophisticated. External executable capabilities and
organisational surfaces lack one shared admission/authority/availability/retirement vocabulary.

### Evolutionary metabolism — advanced but transition completion is uneven

The Practice learns, amends, retires, archives, and forgets. It needs stronger proof that changed
semantic authority has propagated to every live embodiment and that obsolete operational surfaces
are no longer firing.

## Principal conclusion

The most valuable new capability is not another manager, event bus, plugin system, or rule family.
It is a **thin operational connective substrate** that makes existing Practice concepts compose:

```text
ratified intent
    → concrete obligation
    → attempt lineage
    → bounded actor authority
    → durable evidence
    → waiting / correction / cancellation / recovery
    → terminal account
    → audience-specific projections
    → consolidation and forgetting
```

The substrate should be portable in semantics and optional in implementation. It can be represented
through files, a local service, Linear, GitHub, n8n, or another system at different seams, provided
one implementation does not become the owner of the concept.

Its success criterion is subtractive:

> Does it make the Practice easier to operate, reduce reconstruction and coordination cost, improve
> human control, and allow existing instructions, status fields, duplicate indexes, and defensive
> gates to disappear?

If it merely adds another layer to synchronise, the diagnosis has been misapplied.
