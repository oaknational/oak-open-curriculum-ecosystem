---
name: parallax-decide
description: >-
  Use this skill when an action, commitment, rollout, experiment, deferral, or stop decision must be made from an existing body of evidence or Epistemic Profile under uncertainty. It separates evidence from values and constraints, compares options including reversible probes and no action, tests robustness and distributional effects, records authority, and creates a Decision Record plus World-Return Contract. Do not use primarily to frame the problem, design or execute evidence collection, synthesize unresolved reports, implement the decision, or orchestrate the whole inquiry.
metadata:
  owned: "true"
  version: "0.1.0"
  collection: "parallax"
---

# Decide under uncertainty

Translate bounded epistemic warrant into an authorised, proportionate commitment without disguising values as facts or treating analysis as permission to act.

Read [references/decision-method.md](references/decision-method.md) when comparing options, testing robustness, or defining a World-Return Contract. Copy and adapt [assets/decision-world-return.yaml](assets/decision-world-return.yaml) when durable artifacts are useful.

Populate the shared artifact envelope, including exact input revisions, producing skill version, execution context, permissions and authority, stackable identities, assumptions, uncertainty, provenance, validity domain, defeaters, and reopen conditions.

## Invariants

- Preserve `inquiry_id`, `inquiry_revision`, `basis_id`, `scale_region`, `method_pass_id`, and stackable `domain_profiles` from evidence through decision and monitoring.
- Keep evidence, interpretations, objectives, values, rights, constraints, preferences, and authority explicitly distinct.
- Include `no action`, `defer`, `collect information`, and `reversible probe` when they are feasible—not only the presented commitment options.
- Represent material extrapolations across observation, intervention, consequence, or monitoring scales as Bridge Claims; represent translations across frames as Crosswalk Claims.
- Treat rights, safety, accessibility, privacy, and unacceptable harms as possible side constraints rather than tradeable scores.
- Preserve dissent and residual uncertainty. Do not manufacture consensus.
- Do not perform external action without explicit authority.
- Emit learning signals to the embedding Practice; do not store memory or silently alter skills.

## Workflow

### 1. Admit

Confirm that the task requires choosing or authorising a course of action. If evidence remains unstructured or materially contradictory, invoke or recommend `parallax-synthesise`. If the decision problem itself is unstable, route to `parallax-frame`. If the user asks for end-to-end inquiry, route to `parallax`.

Direct invocation is valid. If no formal Epistemic Profile exists, reconstruct only a provisional evidence boundary from supplied material and list missing inputs. Do not invent confidence, objectives, constraints, affected parties, or authority. Decline to recommend a consequential commitment when those omissions are material.

### 2. Declare scope, identity, scales, and authority

State:

- decision owner, adviser, implementer, affected parties, and who bears consequences;
- authority to recommend, decide, and act;
- decision deadline, reversibility, path dependence, and cost of delay;
- inquiry and revision identifiers plus inherited basis, scale, method-pass, and domain-profile identities;
- observation, intervention, consequence, and monitoring scales and time horizons;
- objectives, values, non-negotiable constraints, and unresolved value conflicts.

### 3. Define the option set

Describe feasible options at comparable resolution. Include combinations, staged commitments, reversible probes, further inquiry, deferral, and no action where meaningful. For each option, state dependencies, preconditions, opportunity cost, reversibility, and what future options it creates or closes.

Do not let the initial proposal define the option space. Do not preserve impossible options merely for symmetry.

### 4. Connect evidence to consequences

For each option:

- identify the causal or interpretive claims connecting action to outcomes;
- preserve their validity domains and uncertainty;
- create Bridge Claims for movement from observed evidence to intervention and consequence scales;
- create Crosswalk Claims when outcome meanings differ across stakeholder or disciplinary frames;
- distinguish expected outcomes, plausible tails, distributional effects, and unknowns;
- state which evidence is decision-relevant and which is merely descriptive.

Where probabilities or utilities are defensible, use them transparently. Where they are not, use scenario, dominance, regret, robustness, thresholds, or qualitative trade-off analysis without false precision.

### 5. Compare proportionately

Assess:

- expected contribution to intended impact;
- robustness across plausible frames, models, and parameter ranges;
- safety, rights, accessibility, privacy, fairness, and distribution;
- reversibility, optionality, path dependence, and recovery cost;
- evidence value of acting, probing, waiting, or researching;
- implementation feasibility and operational capacity;
- opportunity cost and consequences of no action.

Prefer a robust or reversible option over a fragile optimum when uncertainty and downside justify it. Do not collapse qualitatively different concerns into one score unless the aggregation rule and value judgement are explicit.

### 6. Challenge

Ask:

- Is the preferred option already embedded in the framing, metric, or weighting?
- Which affected party would reject the objectives or trade-offs?
- What low-probability or slow consequence is omitted by the monitoring horizon?
- Is short-term evidence being bridged to long-term impact without warrant?
- Does aggregate benefit hide concentrated harm?
- Are deferral and further research actually lower risk, or merely avoidance?
- Would a reversible probe dominate both commitment and prolonged analysis?
- What evidence or value change would reverse the recommendation?

Request independent audit before high-stakes or difficult-to-reverse commitments when feasible.

### 7. Validate

Check traceability from evidence and values to comparisons and recommendation; authority; side constraints; option completeness; bridge and crosswalk claims; distributional analysis; residual uncertainty; implementation preconditions; rollback; monitoring ownership; and reopening thresholds.

End with one status: `validated`, `provisional`, `inconclusive`, `insufficient-evidence`, `declined`, `reopened`, or `superseded`. A `validated` recommendation is not implementation authority.

### 8. Handoff and world-return

Produce:

- Decision Record with selected option or explicit non-decision;
- evidence, values, constraints, dissent, and rationale kept separate;
- implementation preconditions and authorised next step;
- rollback or recovery plan where applicable;
- World-Return Contract with predicted outcomes, indicators, baselines, owners, observation cadence, scale and horizon, thresholds, harms, defeaters, and reopening rules.

Hand implementation to the relevant execution capability. Hand monitoring results to `parallax-learn` or reopen the inquiry as a new revision when a threshold or defeater occurs.

### 9. Emit a Practice learning signal

Emit a signal when decision formation reveals a recurring option omission, value/evidence conflation, bridge failure, routing error, or useful robustness pattern. Include inquiry and revision IDs, expected versus observed decision behaviour, affected skill or policy, confidence, recurrence hypothesis, pending world outcome, and suggested Practice destination. Do not persist memory or update the skill directly.
