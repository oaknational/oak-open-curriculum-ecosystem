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

Status is **draft** — design-only, survey-gated and owner-gated for execution. The one owner
decision (the effectiveness-arm reviewer) is now settled; see §Resolved decisions.

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

**Inputs.** (a) The Pass-1 **idea-granular** inventory (each plan's ideas classified, with
`file:line` + provenance) — **precondition: the idea-granular `salvage_value` back-fill must be
complete**; in the surveyed data today `salvage_value` is still a string (pre-correction), so this
pass cannot run until the orchestrator's all-plans back-fill lands. (b) The V0
`serves_strategic_choice` typed edges resolving plans/ideas to choices — **these score ~0 in the
estate today**, so the first effectiveness pass is in practice a *wholly authored* capability→plan
mapping (100% infer-and-flag), not edge-resolved; an unresolved serving relationship is itself a
finding. (c) The strategy stream docs — each choice's *how-we-win* mechanism, its stated
*advantage*, and its named release-readiness / measure preconditions (the per-stream hand-off
tables and Measures sections).

**Method (cross-plan, Pass-2) — the capability-coverage method.** Built so an `effective` verdict
CANNOT be rendered by hand-waving: it requires a capability map a reviewer (or the owner) can
challenge. For each strategic choice:

1. Gather every plan/idea that serves it (edge-resolved where edges exist; infer-and-flag the rest).
2. **Decompose the choice into its required capabilities against a FIXED dimension checklist** —
   not free-form. Every how-we-win choice must be decomposed across the dimensions its source doc
   visibly contains: **(i) the way-to-win mechanism**, **(ii) the stated *advantage* and what would
   realize it**, **(iii) the named release-readiness / measure preconditions** (the stream
   hand-off tables + Measures sections). A decomposition that omits a dimension the source doc
   contains is **falsifiable by the source**, not just by reviewer taste — this converts "is this
   the right capability set?" from opinion into a check, and closes the under-decomposition hole
   (a thin capability set yielding trivial coverage).
3. **Map each required capability to serving plan(s)** (infer-and-flag the rest), and **assess each
   covering plan's soundness** from its Pass-1 `content_quality` verdict via this mapping:
   `strong | adequate → sound`; `weak | empty → unsound`; absent verdict → `n/a` (re-read needed).
4. **Score the verdict by coverage × soundness** (rubric below).
5. For `partial` / `ineffective`: name the **uncovered or unsound capability** and **recommend an
   authored new plan** (goal, the capability it delivers, why existing plans do not cover it),
   never a deferred discussion.

**Effectiveness rubric (falsifiable — coverage × soundness).** The verdict enum is
`effective | partial | ineffective` (deliberately NOT reusing `adequate`, which is a
`content_quality` value — see the soundness mapping above):

- **`effective`**: EVERY required-capability dimension is covered by at least one `sound` serving
  plan, AND the choice's stated *advantage* is evidenced (see advantage-evidence below). An
  `effective` verdict that does not list every capability with its sound covering plan + the
  advantage evidence is **invalid**.
- **`partial`**: at least one required capability is uncovered, OR covered only by an `unsound`
  plan, OR the advantage is unevidenced. Partly served; a material gap remains — name the specific
  failing capability.
- **`ineffective`**: no serving plans, or serving plans that deliver no required capability
  (alignment-only / mis-aligned).

**Advantage-evidence — realizable vs posture advantages.** Some advantages are *realizable*
behaviours (e.g. `APP-2` grounding/attribution, `TOOLS-1` schema-first generation, `FRAME-1`
dogfooding) — these require **behavioural / measure / proof-contract** evidence. Others are
*posture* claims (e.g. `TOOLS-2` "public-good posture", `TOOLS-3` "credible convenor", `APP-3`
"aligns with the Optional pillar") with no shipped behaviour that proves them — for these, accept a
**boundary / proof-contract citation** (the ADR or won't-do clause that protects the posture, e.g.
ADR-194 for `APP-3`) as the realization evidence. Without this distinction, posture choices pin to
`partial` forever — a false-negative theater of its own.

Theater is structurally blocked: the verdict is unrenderable without the capability map, so "looks
effective" is not expressible. "Alignment" (a plan points at the choice) never substitutes for
"coverage" (a sound plan delivers a required capability).

**Output (per choice).**

```text
{
  choice_id,                          // e.g. "APP-2"
  required_capabilities: [            // decomposed against dimensions (i)-(iii); the falsifiable backbone
    { capability: <one line>,
      dimension: mechanism | advantage | readiness-measure,
      covered_by: [plan path...] | [],
      covering_plan_soundness: sound | unsound | n/a,   // mapped from Pass-1 content_quality
      status: covered | uncovered | unsound }
  ],
  advantage_kind: realizable | posture,
  advantage_evidence: <behaviour/measure/proof-contract | boundary/proof-contract citation | null>,
  verdict: effective | partial | ineffective,           // derived from the capability map, not asserted
  gaps: [ { capability, recommended_new_plan: <scope sketch> } ],
  evidence: [file:line...]
}
```

**Verdict authority (RESOLVED — owner, 2026-06-21).** The effectiveness arm is proven like the
no-loss arm: a **dedicated independent effectiveness-reviewer session proposes** the per-choice
verdicts WITH the capability-map evidence above, independent of the restructure author (it must not
mark its own effectiveness homework), and **routes them to the owner for ratification**. The owner
ratifies; the session proposes. This session MAY be the same dedicated independent session that
runs the no-loss proof (Spec 2) — one independent prover, two substance workstreams, one report to
the owner — the recommended shape for coherence. **If combined, the two arms keep distinct default
stances within the one session:** no-loss is adversarial (default-to-lost), effectiveness is
constructive (derive-then-cover); neither reflex may bleed into the other (no manufacturing
capability-failures, no softening the no-loss hunt).

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

## Resolved decisions

1. **Effectiveness-arm reviewer (owner, 2026-06-21): a dedicated independent session proposes,
   the owner ratifies** — mirroring the no-loss arm, and may be the same session (one independent
   prover, two substance workstreams, one report to the owner). The restructure author does not
   confirm their own effectiveness. Encoded in Spec 1 §Verdict authority. (Was the one open owner
   question; now settled.)

## Non-goals / boundaries

- This doc does **not** run Pass-2 (the survey orchestrator does), run the no-loss session (a
  dedicated session does), or execute the restructure (owner-gated).
- It does **not** edit the survey instrument — Spec 1 and Spec 3 are routed to the orchestrator
  as input-to-verify; the orchestrator owns the workflow.
