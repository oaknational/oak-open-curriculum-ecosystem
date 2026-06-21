---
title: 'Restructure substance specs — Pass-2 effectiveness, no-loss proof, trichotomy→disposition'
type: spec
status: draft
last_updated: 2026-06-21
derives_from:
  - .agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md
  - .agent/plans/product-development-governance/plan-node-schema.v0.md
governed_by:
  - .agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md
---

# Restructure substance specs

The three substance-side specs the owner-ratified re-aim (`14877e8d0`, `61489ce7e`)
requires, drafted from the controlling-plan **Body 3** and **V0 §9**. They exist to keep
the survey-and-restructure on **substance, not theater** — the corpus must *effectively
implement* the strategy, the bad must be gone, the speculative isolated, and **no useful
information, structure, or relationship lost — provably**.

**The seam (owner-confirmed).** The **survey identifies** ideas read-only (its idea-level
inventory); the **consolidation extracts / sorts / re-composes** (it owns the mutation). These
specs are authored on the consolidation / V1-fold side (this lane) and consumed as follows:

- **Spec 1 (effectiveness/adequacy)** is a **Pass-2 survey output** — the orchestrator folds it
  into the survey workflow as the cross-plan pass; it is **input-to-verify** for the orchestrator.
- **Spec 2 (no-loss proof)** is a **dedicated, independent parallel session** — not a survey pass
  and not a restructure step.
- **Spec 3 (trichotomy → disposition defaults)** governs both the survey's classification output
  and the restructure's dispositions.

Status is **draft** — design-only, survey-gated and owner-gated for execution. One owner
decision is open (the effectiveness-arm reviewer); see §Open Questions.

## Spec 1 — Per-choice effectiveness / adequacy (Pass-2)

**Purpose.** Move past the form question ("does a serving plan exist for this choice?") to the
substance question: **are the serving plans, taken together, adequate to *achieve* the
strategic choice — and where are the real gaps?** Per the owner, gaps are closed with
**authored new plans**, not deferred as discussions. Effective, **not merely aligned**:
alignment (a plan points at the choice) is necessary but not sufficient; adequacy (the plans
will achieve the choice's stated way-to-win and its advantage) is the bar.

**Unit of assessment.** The **strategic choice**, not the plan. The current choice set is the
12 per-stream how-we-win choices, owner-signed-off 2026-06-20:
`APP-1..4` ([stream-mcp-app](../../../docs/strategy/stream-mcp-app.md)),
`TOOLS-1..4` ([stream-engineering-tools](../../../docs/strategy/stream-engineering-tools.md)),
`FRAME-1..4` ([stream-agentic-framework](../../../docs/strategy/stream-agentic-framework.md)).
Resolve the choice set from the live stream docs at run time, never from this list — it can drift.
Once the machine-readable strategic-choice registry is built (at Body-3 execution), it becomes the
run-time source of truth and the stream-doc table is its projection.

**Inputs.** (a) The Pass-1 idea-level inventory (each plan's ideas classified, with
`file:line` + provenance); (b) the V0 `serves_strategic_choice` typed edges resolving
plans/ideas to choices (where absent, infer-and-flag — an unresolved serving relationship is
itself a finding); (c) the strategy stream docs (each choice's *how-we-win* statement and its
stated *advantage* — the achievement bar).

**Method (cross-plan, Pass-2).** For each strategic choice:

1. Gather every plan/idea that serves it (edge-resolved; infer-and-flag the rest).
2. Judge **adequacy** against the choice's how-we-win intent and advantage: do the serving
   plans, taken together, plausibly *achieve* it?
3. Classify adequacy: `adequate | partial | absent`.
4. For `partial` / `absent`: name the **gap** concretely and **recommend an authored new plan**
   (a scope sketch — goal, the choice it would serve, why existing plans do not cover it),
   never a deferred discussion.

**Output (per choice).**

```text
{
  choice_id,                 // e.g. "APP-2"
  serving_plans: [path...],  // edge-resolved + inferred-and-flagged
  adequacy: adequate | partial | absent,
  gap: <one-line description | null>,
  recommended_new_plan: <scope sketch | null>,
  evidence: [file:line...]
}
```

**Adequacy rubric is a Pass-2-time deliverable.** The thresholds that separate `partial` from
`absent`, and how "the choice's *advantage* is achieved" is evidenced, are refined at Pass-2 run
time against the live choices — not assumed solved here. This spec fixes the unit, inputs,
method shape, and output contract; the rubric detail firms up when Pass-2 fires.

**Verdict authority.** The per-choice effectiveness verdict is the **effectiveness arm** of the
substance gate (Acceptance), reviewer-confirmed with evidence. **The reviewer is unassigned —
see §Open Questions.** The verdict is `evidence-confirmed`, not the survey agent's
self-assessment.

## Spec 2 — No-loss proof (dedicated independent parallel session)

**Purpose.** Prove — **independently and adversarially** — that the restructure lost no useful
**information, structure, or relationship**. Per owner ratification (`61489ce7e`): a **dedicated
primary agent runs a full parallel session**, concurrent with the restructure, **owning no
restructure edits itself**, and **reports back to the owner**. It is not the restructuring agent
marking its own homework.

**Scope — the whole estate, three axes** (broader than ideas):

1. **Information** — every removed / archived / extracted / isolated idea's `salvage_value` is
   conserved in a **named live home**.
2. **Structure** — the estate's structure is **preserved, or deliberately changed and
   recorded** (no silent structural loss).
3. **Relationships** — the typed inter-plan / inter-idea edges (`serves_strategic_choice`,
   `derives_from`, `depends_on`, `supersedes`/`superseded_by`, `thread`, `projects_to`, …) are
   **preserved, or deliberately changed and recorded**.

**Method.**

1. Take a **pre-restructure baseline of what exists *today***: the idea inventory, the
   **relationships as currently expressed** (the typed edges that already exist *plus* the
   relationships inferable from prose — cross-references, supersession notes, `derives_from` /
   `depends_on` / `related`), and a structure snapshot of the estate. The baseline is **today's
   relationship set however it is expressed**, not a populated V0 edge graph: most typed edges
   (e.g. `serves_strategic_choice`) score ~0 today and are *authored by the restructure itself*.
2. After the restructure (or per pass), **diff against the baseline**.
3. For every delta, verify a **recorded disposition** accounts for it AND the salvage reached a
   **named live home** (information), or the structural/relationship change is recorded as
   deliberate. **Edges newly authored by the restructure are additions, not deltas to account
   for** — the audit checks that relationships *present today* are preserved-or-recorded-as-changed,
   never that none were added. This keeps the real signal (a genuinely *lost* relationship) from
   drowning in expected new-edge noise.
4. **Adversarial stance:** actively hunt for a lost idea, edge, or structural relationship;
   **default to "lost" until proven conserved**. The dispositions recorded by the restructure are
   *claims to verify*, never trusted as-is.

**Independence & reporting.** Separate session / primary agent; no restructure edits; produces a
**no-loss audit report to the owner** with an explicit **GO / NO-GO** on the no-loss arm, listing
any **unaccounted loss** (each is an acceptance-blocking defect).

**Relationship to the disposition mechanism (Spec 3).** Spec 3 says *what* disposition each
removed/moved idea carries and *where* it is recorded; Spec 2 is the **independent verification**
that those dispositions are true and complete. The two are claim and audit.

## Spec 3 — Trichotomy → disposition encoding-defaults

**The trichotomy and its fixed homes** (owner, 2026-06-21). Curation sorts **ideas**, not plans:

| Class | Home | Restructure-idea disposition (controlling-plan Body 3) |
| --- | --- | --- |
| **good** | kept and remixed into the re-composed corpus | `re-housed` (idea → new lane/plan), `extracted` (idea → named live plan/doc), `superseded` (idea's plan → named successor) |
| **bad** | removed from the live estate | `archived` (archive-with-disposition; out of `.agent/plans/`'s live tree; recoverable record; never relabelled or rehomed within the estate). Hard-delete reserved for zero-value duplicates and empty shells |
| **speculative** | isolated *outside* the planning estate | `isolated` (moved to the speculative home, proposed `.agent/speculative/`, distinct from `future/`, which holds real strategic-but-not-yet-executable plans) |

**Rules.**

- **Restructure-idea-disposition vocabulary** (controlling-plan **Body 3**): `re-housed |
  extracted | superseded | isolated | archived`. This is **distinct from the V0 `plan`-node
  terminal `disposition` enum** (`done | superseded | extracted-and-archived | cancelled`) — a
  different construct at a different graph level (the *idea's* curation outcome vs the *plan
  node's* terminal state); only `superseded` is common to both. Every removed / re-homed /
  isolated idea carries **exactly one** restructure-idea-disposition; a removal without a recorded
  one is a **defect** (Spec 2 catches it).
- **Idea-disposition → plan-node terminal-disposition is a mapping, not an identity.** When an
  idea's disposition implies its *source plan* is fully consumed, the source plan's V0 terminal
  `disposition` follows — e.g. a plan whose ideas are all `extracted` / `archived` → V0
  `extracted-and-archived` or `cancelled`; a plan wholly replaced → V0 `superseded`. The two
  vocabularies stay deliberately separate; never conflate them.
- **Recording:** the disposition is a **supersession mapping** on the archived artefact or in the
  receiving archive's README — the consolidation discipline, **never a standalone ledger**.
- **Embedded speculative sections** of an otherwise-good plan are **extracted to the speculative
  home, never silently dropped** — so a `good`/`mixed` plan never loses an embedded speculative
  idea.
- **Knowledge-preservation is absolute:** a reviewer confirms value-capture **before** any
  removal of a non-trivial idea; the no-loss proof (Spec 2) then verifies every good and
  speculative idea reached a named live home.

## Open Questions

1. **The effectiveness-arm reviewer is unassigned** (owner assigned only the no-loss arm — the
   dedicated parallel session of Spec 2). Who confirms the per-choice effectiveness verdict
   (Spec 1) is undecided. This is an **owner question** (it touches authority over whether the
   strategy is *effectively implemented*, and the strategy measures stay with the owner / Oak).
   It is **not urgent** — the effectiveness review fires at Pass-2 / restructure-acceptance time,
   many windows out. Carried for the owner; do not self-resolve.

## Non-goals / boundaries

- This doc does **not** run Pass-2 (the survey orchestrator does), run the no-loss session (a
  dedicated session does), or execute the restructure (owner-gated).
- It does **not** edit the survey instrument — Spec 1 and Spec 3 are routed to the orchestrator
  as input-to-verify; the orchestrator owns the workflow.
