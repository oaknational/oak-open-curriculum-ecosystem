# Framing method reference

Use this reference to construct differentiated frames and explicit scale relationships.

## Frame-generation operations

Generate candidates by changing one or more of:

- construct or operational definition;
- system boundary or excluded environment;
- unit of analysis or aggregation;
- causal direction, mechanism, or counterfactual;
- stakeholder, rights-holder, practitioner, or disciplinary standpoint;
- temporal horizon, cadence, or lag structure;
- spatial, population, organisational, technical, or causal scale;
- decomposition into entities, processes, states, flows, incentives, experiences, or constraints;
- question type: empirical, causal, formal, interpretive, normative, or design.

Protect the candidates from premature convergence, then compare them using their consequences rather than their vocabulary.

## Basis-by-scale map

```mermaid
flowchart LR
    Q[Focal concern] --> B1[Basis A: entities and components]
    Q --> B2[Basis B: processes and flows]
    Q --> B3[Basis C: user experience and meaning]
    Q --> B4[Basis D: incentives, power and institutions]

    B1 --> S11[Local technical scale]
    B1 --> S12[Whole-system scale]
    B2 --> S21[Interaction cadence]
    B2 --> S22[Long causal horizon]
    B3 --> S31[Individual experience]
    B3 --> S32[Population distribution]
    B4 --> S41[Team or organisation]
    B4 --> S42[Ecosystem or policy]

    S11 -. Bridge Claim .-> S12
    S21 -. Bridge Claim .-> S22
    S31 -. Bridge Claim .-> S32
    S41 -. Bridge Claim .-> S42
    B1 -. Crosswalk Claim .-> B2
    B2 -. reverse mapping .-> B1
    B2 -. partial crosswalk .-> B3
    B3 -. partial reverse .-> B2
    B3 -. lossy crosswalk .-> B4
```

This diagram is illustrative, not a universal basis. Select task-relevant dimensions and keep the executed set sparse.

## Discrimination test

A candidate earns separate-frame status when at least one of these differs materially:

- what counts as the phenomenon;
- what evidence is relevant;
- what mechanism or interpretation is plausible;
- what intervention follows;
- who benefits, bears risk, or has standing;
- what characteristic error it invites;
- what observation would change its credibility.

If none differ, merge it as a variant rather than inflate the frame count.

## Bridge Claim minimum

```yaml
bridge_id: ""
source_scale: {}
target_scale: {}
direction: ""
relationship: aggregation | mechanism | feedback | extrapolation | translation
assumptions: []
supporting_evidence: []
challenging_evidence: []
uncertainty: ""
information_loss: ""
validity_domain: ""
failure_conditions: []
```

## Crosswalk Claim minimum

```yaml
crosswalk_id: ""
source_basis_id: ""
target_basis_id: ""
direction: one-way | two-way
mapping: []
preserved_meaning: []
lost_or_changed_meaning: []
evidence: []
validity_limits: []
mapping_status: exact | approximate | partial | asymmetric | unavailable
```
