---
name: parallax-frame
description: >-
  Use this skill when the question, construct, boundary, unit of analysis, causal story, stakeholder perspective, scale, or conceptual decomposition may be wrong or contested. It produces protected alternative Frame Cards, a multidimensional scale map, explicit alternatives, Bridge Claims, and Crosswalk Claims. Invoke directly for requests to reframe a problem, expose hidden assumptions, compare decompositions, or test whether a team is solving the wrong problem. Do not use merely to plan evidence collection for a stable frame, reconcile completed evidence, choose an action, or orchestrate a whole inquiry.
metadata:
  owned: "true"
  version: "0.1.0"
  collection: "parallax"
---

# Frame an inquiry

Create several serious ways of seeing the problem without treating them as cosmetic restatements. Seek useful discrimination rather than a fictional universally orthogonal conceptual basis.

Read [references/framing-method.md](references/framing-method.md) when constructing alternative bases, scale graphs, bridge claims, or coverage checks. Copy and adapt [assets/frame-set.yaml](assets/frame-set.yaml) when a durable artifact is useful.

Populate the shared artifact envelope, including exact input revisions, producing skill version, execution context, permissions, stackable identities, assumptions, uncertainty, provenance, validity domain, defeaters, and reopen conditions.

## Invariants

- Preserve `inquiry_id`, `inquiry_revision`, `basis_id`, `scale_region`, `method_pass_id`, and stackable `domain_profiles`.
- Keep each Frame Card internally coherent before comparing frames.
- Distinguish the scale of observation, mechanism, intervention, consequence, and monitoring.
- Express a material cross-scale inference as a Bridge Claim and a material inter-frame translation as a Crosswalk Claim.
- Preserve incomparability, information loss, and asymmetry; do not force all frames into one vocabulary.
- Treat affected-party and rights-bearing perspectives as possible framing constraints, not optional colour.
- Emit learning signals to the embedding Practice; do not store memory or rewrite this skill.

## Workflow

### 1. Admit

Confirm that framing uncertainty is material. If the frame is stable and the need is evidence planning, route to `parallax-design-inquiry`. If the user needs an end-to-end inquiry, route to `parallax`. If only a decision remains, route to `parallax-decide`.

Direct invocation is valid. When no Charter exists, create only a provisional framing context from the request and list missing purpose, authority, affected parties, constraints, or evidence. Never fabricate upstream artifacts.

### 2. Declare scope, identity, and scales

State:

- the focal question, intended impact, current decision or learning need, and explicit non-goals;
- current inquiry and revision identifiers, or clearly marked provisional identifiers;
- relevant domain profiles and who may be affected;
- task-specific scale dimensions and the current scale region;
- what would make alternative framing consequential rather than merely linguistic.

### 3. Generate protected frames

Construct Frame Cards independently before synthesis. Each card must identify:

- `basis_id`, label, question type, constructs, boundaries, entities, relationships, and unit of analysis;
- assumed causal or interpretive structure;
- stakeholder or disciplinary standpoint and values it foregrounds;
- relevant scale regions and time horizons;
- claims made visible, evidence admitted, methods suggested, and actions enabled;
- blind spots, exclusions, risks, and likely failure modes;
- observations that would discriminate this frame from its alternatives.

Include at least one serious counterframe when operating beyond screening. Generate alternatives from different operations where relevant: change the construct, boundary, unit, scale, causal direction, stakeholder standpoint, temporal horizon, or decomposition.

Do not demand literal mathematical orthogonality. Prefer frames with distinct explanatory commitments, evidence implications, intervention implications, or characteristic errors. Record their dependencies.

### 4. Map scales and relationships

Build a multidimensional scale map. For every material transition across scale, create a Bridge Claim containing source and target scale coordinates, direction, aggregation or mechanism, assumptions, evidence, uncertainty, validity domain, information loss, and failure conditions.

For every attempted translation between bases, create a Crosswalk Claim with source and target constructs, mapping direction, transformation, preserved meaning, lost meaning, evidence, and validity limits.

### 5. Challenge

Ask:

- Are the frames genuinely distinct or paraphrases sharing one hidden basis?
- Which affected party, scale, boundary, or causal direction is absent?
- Does any frame define away the outcome or stakeholder that matters?
- Are apparently independent frames anchored in the same source or language?
- Which frame would be hardest for the current team to notice or accept?
- Is a frame unfalsifiable where empirical vulnerability is required, or is it answering a non-empirical question legitimately?
- Could a simpler frame cover the critical functions with less ambiguity?

Steelman frames before criticising them. Do not rank by familiarity or majority vote.

### 6. Validate

Check that every Frame Card is coherent, consequential, provenance-bearing, scale-aware, challengeable, and linked to discriminating observations. Check that material bridge and crosswalk claims are explicit and that declared coverage gaps remain visible.

End with one status: `validated`, `provisional`, `inconclusive`, `insufficient-evidence`, `declined`, `reopened`, or `superseded`.

### 7. Handoff and world-return

Produce a Frame Set, Scale Map, Bridge Claims, Crosswalk Claims, explicit alternatives, coverage gaps, and recommended next capability. For each retained frame, state what later evidence or outcome would strengthen, weaken, split, or retire it.

If several frames warrant inquiry, hand them to `parallax-design-inquiry` as protected branches. If existing evidence can already discriminate them, hand off to `parallax-synthesise`. If framing reveals a changed consequential task, recommend reopening the parent inquiry as a new revision.

### 8. Emit a Practice learning signal

Emit a signal only when framing produced a reusable surprise: a recurrent omitted scale, construct confusion, stakeholder erasure, crosswalk failure, or routing error. Include expected versus observed framing behaviour, affected skill or policy, confidence, recurrence hypothesis, and suggested Practice destination. Do not persist it inside the skill.
