---
name: parallax-design-inquiry
description: >-
  Use this skill to turn one or more reasonably stable questions or frames into a proportionate, auditable evidence-and-method plan. Invoke when deciding what observations, analyses, experiments, qualitative work, software probes, or mixed methods would discriminate alternatives; when planning measurement, sampling, triangulation, sequencing, or protected parallel passes; or when evidence cost and value must be balanced. It may route to specialised experimental-design skills. Do not use primarily to reframe an unstable problem, execute the methods, reconcile completed reports, choose an action, or run the whole Parallax lifecycle.
metadata:
  owned: "true"
  version: "0.1.0"
  collection: "parallax"
---

# Design a Parallax inquiry

Design an inquiry that can change what is believed or done. Cover the critical epistemic functions with methods suited to the claim type, scale, constraints, and characteristic errors; do not collect evidence by habit.

Read [references/inquiry-design.md](references/inquiry-design.md) when choosing methods, constructing a coverage and dependence map, or deciding whether specialised experimental design is warranted. Read [references/domain-profiles.md](references/domain-profiles.md) when selecting stackable investigation, science, software-engineering, or digital-product/service criteria and external handoffs. Copy and adapt [assets/evidence-method-plan.yaml](assets/evidence-method-plan.yaml) when a durable plan is useful.

Populate the shared artifact envelope, including exact input revisions, producing skill version, execution context, permissions, stackable identities, assumptions, uncertainty, provenance, validity domain, defeaters, and reopen conditions.

## Invariants

- Preserve `inquiry_id`, `inquiry_revision`, `basis_id`, `scale_region`, `method_pass_id`, and stackable `domain_profiles` in each planned pass.
- Keep protected frame branches distinct until evidence has been collected or an explicit crosswalk is justified.
- Match warrant to question type; empirical falsifiability is not a universal criterion for formal, interpretive, normative, or design claims.
- Treat every material movement across scales as a Bridge Claim and every translation across bases as a Crosswalk Claim.
- Record shared data, sources, instruments, models, prompts, analysts, and assumptions as dependencies.
- Make ethics, rights, feasibility, opportunity cost, and action authority side constraints, not afterthoughts.
- Emit learning signals to the embedding Practice; do not store memory or silently update skills.

## Workflow

### 1. Admit

Confirm that the task is inquiry design rather than execution or synthesis. If constructs, boundaries, alternatives, or scales remain materially unstable, invoke or recommend `parallax-frame` first. If the user needs the complete lifecycle, route to `parallax`.

Direct invocation is valid. When no Charter or Frame Set exists, reconstruct the minimum provisional context from supplied material, list missing inputs, and state how they limit the plan. Do not invent agreement, authority, or prior framing.

### 2. Declare scope, identity, and scales

State:

- the decision or learning purpose, claim types, candidate alternatives, affected parties, and constraints;
- the current inquiry and revision identifiers;
- basis, scale region, method-pass, and domain-profile identities;
- observation, mechanism, intervention, consequence, and monitoring scales;
- evidence budget, decision horizon, desired severity, and stopping criteria.

### 3. Derive consequences and critical functions

For each retained frame or hypothesis:

1. Express the material claims and alternatives.
2. Derive observations or consequences that would discriminate them.
3. Identify critical functions such as construct definition, measurement, description, causal identification, mechanism testing, interpretation, formal consistency, feasibility, ethics, distribution, and outcome monitoring.
4. State what evidence would weaken, split, or retire each claim.

Do not equate a prediction with a single metric. Preserve qualitative, mechanistic, negative, retrodictive, and implementation consequences where relevant.

### 4. Select and compose methods

Choose the smallest method portfolio that covers the critical functions and important failure modes. For each method pass, declare:

- claim, frame, scale, population or system, inputs, procedure, outputs, and provenance;
- warrant supplied and characteristic errors;
- dependencies on other passes;
- resource, ethics, privacy, accessibility, and operational constraints;
- success, failure, abort, and escalation conditions.

Use protected parallel passes when early sharing would create anchoring. Sequence passes when one result legitimately gates or informs another. Prefer a reversible probe when it resolves the material uncertainty more cheaply and safely.

When a controlled experiment is selected, hand its statistical, causal, operational, ethical, and monitoring design to `parallax-design-experiment`. When the experiment is an online controlled product or service experiment, use `parallax-product-experiment`, which composes with the general experimental design. Do not reduce experimental design to a power calculation or treat A/B testing as the default evidence method.

### 5. Design evidence and analysis controls

Specify, as applicable:

- constructs, operationalisations, instruments, sampling and recruitment;
- estimands or evaluation questions, comparison logic, baselines, and counterfactuals;
- data provenance, quality checks, missingness, contamination, and source dependence;
- analysis approaches, uncertainty representation, multiplicity or researcher degrees of freedom;
- preregistration, blinding, holdouts, replication, negative controls, or adversarial checks;
- stakeholder participation, safeguards, distributional analysis, and stop conditions;
- how method reports will retain raw disagreements for synthesis.

### 6. Challenge

Search for:

- a missing critical function or alternative;
- a construct measured only by a convenient proxy;
- an unsupported bridge from sample to population, component to system, or short-term signal to long-term impact;
- dependent methods mistaken for triangulation;
- a design incapable of changing the decision;
- inadequate power, precision, identification, severity, or qualitative saturation;
- foreseeable interference, learning, novelty, selection, instrumentation, or implementation effects;
- ethical, rights, accessibility, privacy, or opportunity-cost failures;
- a cheaper observational or reversible design that dominates the proposal.

### 7. Validate

Check traceability from frames to claims, consequences, methods, planned artifacts, synthesis criteria, and world-return observations. Verify that every important bridge or crosswalk claim is testable or explicitly uncertain; every method has abort and insufficiency behaviour; and planned independence is described honestly.

End with one status: `validated`, `provisional`, `inconclusive`, `insufficient-evidence`, `declined`, `reopened`, or `superseded`.

### 8. Handoff and world-return

Produce an Evidence and Method Plan, coverage/dependence map, execution DAG, evidence-quality criteria, stopping and escalation conditions, and method-report contracts. Hand specialised subdesigns to the appropriate execution or experimental-design skills.

Define how later observations will return: owner, review cadence, baseline, expected signals, observation, consequence and monitoring scales, time horizons, thresholds, decision consequences, defeaters, and reopening rules. Planning ends only when results can be interpreted and routed onward.

### 9. Emit a Practice learning signal

When the design exposes a reusable method-selection success or failure, emit a signal containing inquiry and revision IDs, expected versus observed design need, uncovered critical function, affected skill or routing policy, confidence, recurrence hypothesis, pending outcome, and suggested Practice destination. Do not persist memory inside the skill or modify canonical instructions without evaluation and review.
