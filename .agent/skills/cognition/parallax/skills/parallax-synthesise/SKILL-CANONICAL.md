---
name: parallax-synthesise
description: >-
  Use this skill when two or more existing claims, evidence streams, method reports, disciplines, scales, or stakeholder interpretations must be reconciled without averaging away disagreement. It maps provenance and dependence, distinguishes contradiction from scope difference, tests Bridge and Crosswalk Claims, searches for defeaters, and produces a Conflict Ledger plus multidimensional Epistemic Profile. Invoke directly when evidence already exists and the question is what it jointly warrants. Do not use primarily to generate frames, design or execute new research, choose an action, or orchestrate the whole inquiry.
metadata:
  owned: "true"
  version: "0.1.0"
  collection: "parallax"
---

# Synthesise a Parallax inquiry

Determine what the available material jointly warrants without treating report count, consensus, or numerical averaging as synthesis. Preserve scope, dependence, disagreement, and incomparability.

Read [references/synthesis-method.md](references/synthesis-method.md) when building the claim-evidence graph, distinguishing conflict types, or constructing an Epistemic Profile. Copy and adapt [assets/synthesis-record.yaml](assets/synthesis-record.yaml) when a durable artifact is useful.

Populate the shared artifact envelope and preserve each input's exact artifact revision, basis, scale, method-pass, domain profiles, assumptions, uncertainty, and provenance. Aggregate identity coverage is a derived view, not a substitute for per-input identity.

## Invariants

- Preserve `inquiry_id`, `inquiry_revision`, `basis_id`, `scale_region`, `method_pass_id`, and stackable `domain_profiles` for every input and synthesized claim.
- Retain original source provenance and distinguish evidence items from reports that interpret them.
- Do not count dependent evidence streams as independent corroboration.
- Test material cross-scale inferences as Bridge Claims and inter-frame translations as Crosswalk Claims.
- Preserve partial agreement, unresolved conflict, scope-bounded conclusions, and genuine incomparability.
- Separate empirical warrant, interpretation, values, constraints, and decision preferences.
- Emit learning signals to the embedding Practice; do not keep memory or rewrite this skill.

## Workflow

### 1. Admit

Confirm that substantive evidence, claims, or method outputs already exist. If the problem is an unstable frame, route to `parallax-frame`. If evidence must still be planned, route to `parallax-design-inquiry`. If the user asks for action selection after synthesis, complete the epistemic work and hand off to `parallax-decide`.

Direct invocation is valid. If the Charter, Frame Set, or Method Plan is missing, reconstruct only the minimum context supported by the inputs. List missing artifacts, preserve raw provenance, and label any inferred identity or scope as provisional.

### 2. Declare scope, identity, and scales

State:

- the synthesis question and what decisions, if any, it is allowed to inform;
- inquiry and revision identifiers;
- input basis, scale-region, method-pass, and domain-profile identities;
- observation, mechanism, intervention, consequence, and monitoring scales represented or absent;
- inclusion criteria, unavailable evidence, and material source-selection limitations.

### 3. Normalise without flattening

For each input, extract:

- claims, observations, methods, populations or systems, time horizons, and provenance;
- warrant offered, assumptions, limitations, uncertainty, and characteristic errors;
- upstream data, instruments, sources, prompts, models, analysts, or institutions shared with other inputs;
- explicit and implicit Bridge or Crosswalk Claims.

Normalise identifiers and structure, not meanings. Keep source wording or constructs available when translation would be lossy.

### 4. Build claim, dependence, and conflict graphs

Connect evidence to claims as supporting, challenging, qualifying, contextualising, or non-discriminating. Map dependence between evidence streams.

Classify apparent disagreement before resolving it:

- direct contradiction under compatible constructs and scope;
- scale, population, context, or time-horizon difference;
- construct or operationalisation mismatch;
- method sensitivity or model dependence;
- value or priority disagreement;
- implementation or measurement failure;
- apparent conflict removed by a justified bridge or crosswalk;
- genuine incomparability.

Maintain a Conflict, Dependence, and Defeater Ledger. Do not infer convergence merely because reports share terminology.

### 5. Synthesize warrant

For each material conclusion:

1. State the narrowest supported claim and its validity domain.
2. Identify supporting, challenging, and missing evidence.
3. Explain method and source dependence.
4. Test its Bridge and Crosswalk Claims.
5. State unresolved alternatives and defeaters.
6. Profile support across relevant dimensions rather than forcing a single confidence score.

Useful profile dimensions include evidential support, robustness across methods, construct validity, causal or mechanistic support, scope, transferability, sensitivity to assumptions, temporal durability, distributional coverage, and decision relevance. Use only dimensions the evidence can support.

### 6. Challenge

Search for:

- corroboration that disappears after dependence is recognised;
- a missing negative result, source, stakeholder, scale, or time period;
- Simpson-like reversals, aggregation errors, proxy shifts, and selection effects;
- conclusions that exceed the observed population, component, context, or horizon;
- an alternative mechanism that fits the same observations;
- absence of evidence misread as evidence of absence;
- consensus created by shared framing or institutional incentives;
- a decision preference leaking into the epistemic profile.

Where stakes justify it, request a separate `parallax-audit`; self-challenge is not independent assurance.

### 7. Validate

Verify bidirectional traceability from each conclusion to evidence and from each material evidence item to its treatment. Check identifiers, provenance, dependence, scope, bridge and crosswalk status, unresolved conflicts, and calibration language. Confirm that value conflicts have not been disguised as factual uncertainty.

End with one status: `validated`, `provisional`, `inconclusive`, `insufficient-evidence`, `declined`, `reopened`, or `superseded`.

### 8. Handoff and world-return

Produce:

- claim-evidence and dependence graphs;
- Conflict, Dependence, and Defeater Ledger;
- scope-bounded synthesis statements;
- multidimensional Epistemic Profile;
- missing evidence and reopening conditions;
- decision-relevant observations and monitoring implications.

When observation rather than action follows, make the return operational: record its owner, cadence, baseline, observation, consequence and monitoring scales, horizons, thresholds, and reopening conditions.

Hand off to `parallax-decide` when action selection is authorised. Hand unresolved discriminating gaps to `parallax-design-inquiry`; reopen framing when constructs or bases cannot support the requested synthesis. State which world observations would strengthen, weaken, split, or supersede each conclusion.

### 9. Emit a Practice learning signal

Emit a signal when synthesis reveals a recurring dependence pattern, bridge failure, construct collision, routing error, characteristic method failure, or unusually effective combination. Include expected versus observed behaviour, inquiry and revision IDs, affected skill or policy, confidence, recurrence hypothesis, pending outcome, and suggested Practice destination. Do not persist memory inside the skill.
