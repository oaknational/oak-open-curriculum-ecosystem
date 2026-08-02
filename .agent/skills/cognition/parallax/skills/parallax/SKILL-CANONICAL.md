---
name: parallax
description: >-
  Use this skill to orchestrate a proportionate, end-to-end inquiry when a consequential task is ambiguous, uncertain, contested, novel, spans multiple scales, or admits materially different frames or methods. It selects screening, core, standard, or deep operation; coordinates framing, inquiry design, protected investigation, synthesis, decision, audit, and world-return learning. Prefer a narrower Parallax sibling for an isolated framing, design, synthesis, decision, audit, or learning task. Do not use for simple factual retrieval, mechanical transformations, or settled low-risk implementation.
metadata:
  owned: "true"
  version: "0.1.0"
  collection: "parallax"
---

# Orchestrate a Parallax inquiry

Treat Parallax as an epistemic control plane, not as a universal ceremony. Preserve plural views long enough to expose meaningful disagreement, then return conclusions to action and observation.

Read [references/orchestration.md](references/orchestration.md) when compiling a multi-branch run, resuming an inquiry, or choosing an entry point. Read [references/domain-profiles.md](references/domain-profiles.md) when selecting or composing investigation, science, software-engineering, or digital-product/service criteria. Copy and adapt [assets/inquiry-charter.yaml](assets/inquiry-charter.yaml) when a durable inquiry artifact is useful.

Populate the artifact envelope rather than leaving placeholders: identify the exact inquiry and artifact revisions, producing skill version, execution mode and independence, input revisions, permissions, identities, assumptions, uncertainty, provenance, validity domain, defeaters, and reopen conditions.

## Invariants

- Preserve `inquiry_id`, `inquiry_revision`, `basis_id`, `scale_region`, `method_pass_id`, and stackable `domain_profiles` on claims and artifacts. Create clearly marked provisional identifiers when starting from incomplete material.
- Treat scale as multidimensional. Distinguish observation, mechanism, intervention, consequence, and monitoring scales where they differ.
- Represent every material cross-scale inference as a **Bridge Claim** with source and target scales, mechanism or transformation, assumptions, evidence, uncertainty, validity domain, and failure conditions.
- Represent every material translation between frames or decompositions as a **Crosswalk Claim**. Permit partial, asymmetric, lossy, or impossible mappings.
- Do not equate parallel model or agent outputs with independent evidence. Record shared prompts, models, sources, anchors, and tools as dependencies.
- Separate empirical support, interpretation, values, constraints, and action commitments.
- Preserve prior revisions. Reopening creates a new revision and does not rewrite causal history.
- Never store durable memory inside this skill. Emit learning signals to the embedding Practice under its memory and governance rules.

## Workflow

### 1. Admit and select depth

Assess uncertainty, stakes, irreversibility, novelty, disagreement, systemic span, evidence availability, and inquiry cost.

- **Decline or route** when a simple answer or narrower sibling is sufficient.
- **Screening**: classify the question, identify the main uncertainty, and recommend the next capability.
- **Core**: establish a Charter, one serious counterframe, relevant scales, alternatives, evidence checks, challenge, an epistemic conclusion, and world-return conditions.
- **Standard**: use multiple protected frames or methods, explicit bridge and crosswalk claims, structured synthesis, decision separation, and monitoring.
- **Deep**: add genuinely independent passes or audit, stakeholder participation, declared coverage criteria, and stronger replication or verification where warranted.

State the selected depth and why its expected value exceeds its cost. Full activation does not require full-depth execution.

### 2. Declare scope, identity, and scales

Create or recover an Inquiry Charter containing:

- purpose, intended impact, decision owner, affected parties, non-goals, constraints, and authority;
- question and claim types: empirical, causal, formal, interpretive, normative, or design;
- current revision and artifact provenance;
- candidate bases or decompositions;
- temporal, system, population, organisational, causal, intervention, consequence, and monitoring scales that matter;
- evidence and action budgets, stopping conditions, defeaters, and reopening conditions.

If upstream artifacts are absent, initialise the smallest honest Charter from available evidence. Mark missing fields and consequences; never invent prior work.

### 3. Compile and perform a bounded run

Compile the current revision into a run DAG from the reusable cyclic capability graph:

1. Invoke `parallax-frame` when constructs, boundaries, alternatives, bases, or scales are unstable.
2. Invoke `parallax-design-inquiry` to derive an evidence and method plan.
3. Route specialised work to domain or execution skills. Keep their outputs as method reports with provenance and dependencies.
4. Invoke `parallax-synthesise` when more than one material claim, method, or evidence stream must be reconciled.
5. Invoke `parallax-decide` only when an action choice is requested or authorised.
6. Escalate to independent audit when stakes, irreversibility, unresolved conflicts, or source dependence justify it.

Allow protected branches to run before sharing conclusions when anchoring would undermine useful diversity. Use exhaustive parallelism only relative to an explicit candidate set and coverage criterion.

If the host cannot invoke a sibling, use emulation only as an explicit degraded mode. Mark the capability node and produced artifact `execution_context.mode: emulated-reduced`, load the sibling's contract when accessible, and check the emulated output against its declared invariants and completion contract. Do not claim native-skill conformance when those checks cannot be completed. An emulated audit is always `same-context-self-review`; it can never satisfy a requirement for independent assurance.

### 4. Challenge the inquiry

Search actively for:

- a plausible frame that changes the answer;
- an omitted scale, stakeholder, or interaction;
- unsupported bridge or crosswalk claims;
- dependent evidence presented as corroboration;
- disconfirming observations and alternative mechanisms;
- proxy, construct, selection, aggregation, and distributional failures;
- a cheaper inquiry or a reversible action that dominates further analysis;
- evidence that the task should be declined, reframed, or reopened.

Do not let the same pass count as independent assurance. Request a separate audit where independence is material.

### 5. Validate and report status

Check artifact identity and provenance, declared coverage, unresolved conflicts, uncertainty calibration, action authority, stopping criteria, and world-return observability.

End with exactly one status: `validated`, `provisional`, `inconclusive`, `insufficient-evidence`, `declined`, `reopened`, or `superseded`. Explain what the status permits and forbids.

### 6. Handoff and return to the world

Produce or update:

- the Inquiry Charter and material frame, evidence, synthesis, and decision artifacts;
- a concise Epistemic Profile rather than a single confidence number where dimensions differ;
- a World-Return Contract specifying intervention or observation, expected outcomes, indicators, time horizons, thresholds, ownership, monitoring scale, defeaters, and reopening rules;
- the next eligible capabilities and their required inputs.

Do not perform an external action unless the user or embedding environment authorises it.

### 7. Emit a Practice learning signal

When a surprise, correction, routing failure, method failure, or reusable success occurred, emit a structured signal containing inquiry and revision IDs, observation, expected-versus-observed difference, affected skill or policy, confidence, recurrence hypothesis, pending outcome, and suggested Practice destination. Do not silently edit skills or memory. Durable improvement requires cross-case distillation, evaluation against a baseline, review, and a versioned canonical update.
