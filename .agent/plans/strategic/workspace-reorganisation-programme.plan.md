---
id: workspace-reorganisation-programme
node_type: strategic
name: "Workspace reorganisation programme — one lifecycle per workspace, generated output separated"
overview: "Reorganise the estate from 34 workspaces to the census round-2 target inventory (~66): scopes narrowed to one lifecycle and one capability each, reusable machinery freed from Oak leaves, and generated output never co-resident with hand-written code."
status: superseded
superseded_by: toolkit-re-architecture
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-14
ratified_where: "Owner decision card direct to the lane seat (Nautilus calls Plankton, c6d48b), 2026-08-14 ~15:4xZ, answer verbatim 'Ratify' — card text and answer recorded in this repo's session lineage and mirrored on the survey-lane ARC channel entry of the same hour"
serves: TOOLS-2
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on:
  - plan: workspace-classification-census
    kind: beneficial
owner_gates: []
tickets: []
last_updated: 2026-08-19
---

# Workspace reorganisation programme

## Outcome

Every workspace in the estate owns one capability on one lifecycle, and
its directory tells the truth about both. Concretely, the world this
node reaches: the census round-2 **target inventory**
(`.agent/reports/workspace-classification-census/target-inventory.json`,
owner-confirmed at the 2026-08-14 round-2 card, verbatim "Direction
confirmed") is the live workspace map — roughly 66 workspaces where 34
stand today; the adopted directory taxonomy
(`packages/codegen/`, `packages/generated/`, `packages/search/`,
`packages/mcp/`, `packages/graph/` joining the existing roots, owner
answer verbatim "Adopt as proposed") is real; generated artefacts live
only in `packages/generated/` artifact holders, regenerated wholesale on
their own cadences, never beside hand-written code; and reusable
machinery that round 2 found imprisoned inside Oak leaves (OAuth-for-MCP,
the reusable OpenAPI pipeline, index lifecycle machinery) stands as
generic foundations with Oak knowledge held as configuration.

## The bet

Serving TOOLS-2 (open by default, no lock-in): openly licensed reusable
code is only real when it is separable, and separability is only real
when it is exercised — a workspace whose scope spans several lifecycles
cannot be reused, relicensed, or reasoned about at any one of them. The
owner's back-to-basics questions (2026-08-14, banked verbatim in the
census plan's amendment trail) are this node's method: what
transformations are present, who consumes each result and when, and
would it be simpler split more. We bet that many narrow single-lifecycle
workspaces are cheaper to change than few broad ones — the
cost-of-change gradient (PDR-135) applied at the workspace scale — and
that the `packages/generated/` separation tier ends a whole defect class
(hand-edits to generated files, generated churn hiding source review).

Deliberately not doing: big-bang moves (tranches land as small
reviewable PRs, dependency-safe per the banked sequencing hints);
renames for taste (every move carries its round-2 evidence pointer);
re-opening the licence model (the census maps it; edges surface as
owner questions); moving anything before this node is ratified.

## Success looks like

- The live `pnpm-workspace.yaml` member set matches the target
  inventory, tranche by tranche, each tranche's PR citing the inventory
  rows it lands.
- `packages/generated/` holds every generated artefact the round-2
  inventory names, each with a DO-NOT-EDIT banner and a regeneration
  command; a validator refuses generated files outside the tier.
- The census instrument re-run classifies the new workspaces with
  MORE `generic-foundation` rows and THINNER `oak-leaf` rows than the
  2026-08-14 baseline matrix — the owner's "considerably thinner"
  expectation made measurable.
- Not claimed: that 66 is exact (the challenger marked 9 inventory
  entries unbacked — each is confirmed or dropped at its tranche's
  delivery node, never inherited silently); that external publishing
  decisions (npm names, licence edges) are settled — those are named
  owner questions at their tranches.

## Delivery

Delivery plans serving this node declare
`serves: workspace-reorganisation-programme` — enumerate them by
search, never by a hand-kept list. Per the owner's round-2 altitude
answer ("One programme node"), per-tranche delivery nodes are authored
at pickup by their implementers, sequenced by the banked hints in
`target-inventory.json`; the census's matrix and evidence artefacts are
the ground truth every tranche cites. Milestones live in Linear as
named observable states; this node points at them, never mirrors them.
