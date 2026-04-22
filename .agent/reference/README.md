# Reference

Curated library tier — owner-vetted, evergreen, deliberately-promoted
material that read-to-learn workflows consult repeatedly.

Governed by
[PDR-032: Reference Tier as Curated Library](../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md).

## What lives here

A document under `reference/` is:

- **Deliberately promoted** — recorded landing event, not a
  by-default disposition for "doesn't fit anywhere else" material.
- **Evergreen** — substance ages slowly; time-bound material
  belongs in `reports/`, `analysis/`, `research/`, or active
  memory, not here.
- **Owner-vetted** — explicit owner acceptance as reference
  material, not just acknowledged-it-exists.

Material that does not meet all three criteria does not belong
here. The default disposition for fresh material is
[`research/`](../research/README.md), not `reference/`.

## How material lands

Promotion follows three steps (per PDR-032 §Lightweight process):

1. **Substantiate.** The candidate's substance must already exist
   somewhere — `research/`, `analysis/`, `reports/`, an outgoing
   exchange under `practice-context/outgoing/`, or in active
   memory. Reference material is **promoted** from another surface,
   not authored directly here.
2. **Justify.** A promotion proposal records why this is reference
   (and not research), why it is evergreen, and where in
   `reference/` it lives (existing or new subdirectory, with
   rationale).
3. **Owner-vet.** Owner explicitly approves promotion. Once
   approved, the document is moved with `git mv` and
   cross-references are updated.

The proposal can travel in a session message, plan body, or commit
message — there is no required format. The owner-vet step is the
gate.

## Subdirectory discipline

Subdirectories are thematic clusters of evergreen material:

- A subdirectory exists when **three or more documents** will share
  it AND the cluster has a stable theme readers will recognise.
- A subdirectory's `README.md` (when present) explains the theme
  and lists documents with one-line summaries — it does not
  duplicate substance.

## Aging gate

Material here is reviewed at least once per holistic-fitness
exploration pass. The review asks: still evergreen? still
owner-vetted? still consulted? A negative answer triggers
de-promotion (move to `research/notes/`, archive, or delete).

## Current contents

The tier was reformed during the `memory-feedback` Session 6
closing arc (2026-04-22). All previous contents were relocated to
[`research/notes/`](../research/notes/README.md) for per-file
disposition under the
[reference-research-notes-rehoming plan](../plans/agentic-engineering-enhancements/archive/completed/reference-research-notes-rehoming.plan.md) (archived 2026-04-22 Session 8 with full execution record).
The first three promotions under PDR-032 (the inaugural
applications of the gate) populate the tier:

| Document | Promoted from | Substantiate / Justify / Owner-vet |
| --- | --- | --- |
| [`design-token-governance-for-self-contained-ui.md`](design-token-governance-for-self-contained-ui.md) | `practice-context/outgoing/` | **Substantiated** in source-side outgoing exchange (originated as a sender-maintained note for a downstream receiver). **Justified as reference, not research**: prescribes a stable governance pattern for design tokens in self-contained UIs (read-to-learn material a UI agent consults when composing a token-aware component); not exploratory synthesis. **Justified as evergreen**: the token-governance pattern is independent of any single component-library version. **Owner-vetted**: 2026-04-22 owner-approved promotion in Session 6 Phase-C Batch 2 disposition. |
| [`starter-templates.md`](starter-templates.md) | `practice-context/outgoing/` | **Substantiated** in source-side outgoing exchange. **Justified as reference, not research**: catalogs reusable starter templates and the meta-pattern for authoring them (read-to-learn material consulted when scaffolding a new project or workspace). **Justified as evergreen**: the template-authoring meta-pattern is stable across template-stack churn (specific stacks may rotate; the meta-pattern persists). **Owner-vetted**: 2026-04-22 owner-approved promotion in Session 6 Phase-C Batch 2 disposition. |
| [`health-probe-and-policy-spine.md`](health-probe-and-policy-spine.md) | `practice-context/outgoing/` | **Substantiated** in source-side outgoing exchange. **Justified as reference, not research**: defines a portable health-probe contract and policy-spine pattern (read-to-learn material consulted when designing operational health surfaces or policy enforcement). **Justified as evergreen**: the contract abstraction is independent of specific runtime stacks. **Owner-vetted**: 2026-04-22 owner-approved promotion in Session 6 Phase-C Batch 2 disposition. |

These promotions are also the **first batch under the aging-gate
discipline**; their next aging review is at the next
holistic-fitness exploration pass.

## Pending PROMOTE-TO-REFERENCE proposals (owner-vet required)

The Session 8 rehoming first-drain pass (2026-04-22) surfaced two
candidates that look like reference material but are not yet
promoted because PDR-032 requires owner-vet and the candidates
sit in single-file thematic groupings that would violate the
tier's clustering discipline if promoted alone. Both files
remain at their failsafe `research/notes/` homes pending owner
decision (no SLA — owner-appetite-triggered):

- **`platform-adapter-formats.md`** — pattern catalog for
  AGENT.md adapter formats across Claude / Cursor / Codex.
  Looks evergreen (cross-platform abstraction; not exploratory).
  Routing tension: would need a 3+ document thematic
  subdirectory (e.g., `reference/platform-parity/`) per PDR-032
  clustering discipline. Current location: see archived
  [rehoming plan execution record](../plans/agentic-engineering-enhancements/archive/completed/reference-research-notes-rehoming.plan.md)
  §Open items for full disposition trace.
- **`boundary-enforcement-with-eslint.md`** — concrete
  enforcement recipe for ADR-019 / PDR-007 / ADR-018 boundary
  rules via ESLint. Looks evergreen (codifies durable boundary
  doctrine into a tooling pattern). Same clustering tension:
  would need a 3+ document thematic subdirectory (e.g.,
  `reference/enforcement-patterns/`).

Resolution shape: either promote alone (and accept the one-file
subdirectory under PDR-032 clustering discipline as a transitional
state with named refill trigger), promote with companion files
authored to satisfy clustering discipline, leave at
`research/notes/` indefinitely, or delete. Owner conversation
required.

## See also

- [PDR-032: Reference Tier as Curated Library](../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md) — governance
- [PDR-007: Practice Core Bounded Package Contract](../practice-core/decision-records/PDR-007-practice-core-bounded-package-contract.md) — `practice-context/outgoing/` contract; outgoing material that needs a durable home may graduate into `reference/` per PDR-032
- [PDR-014: Consolidation and Knowledge-Flow Discipline §Graduation-target routing](../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md) — routing logic that produces `reference/` promotion candidates
- [`research/`](../research/README.md) — default home for fresh material; holding bay for un-promoted candidates and de-promoted formerly-reference material
- [`reports/`](../reports/README.md) — promoted audits and formal syntheses (different lifecycle from `reference/`; reports are owner-promoted formal artefacts, reference is owner-promoted library material)
- [`docs/`](../../docs/) — human-facing project documentation (different audience and lifecycle; reference is for agents and developer-as-reader)
