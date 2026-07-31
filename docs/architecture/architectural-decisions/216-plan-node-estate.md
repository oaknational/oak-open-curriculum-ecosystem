# ADR-216: The plan-node estate — three node types, born-sketch ratification, Linear-projected delivery state

- **Status:** Accepted (owner-ratified 2026-07-23 at a visible card, one word
  covering PR #482 and this status flip; the word is recorded in the lead
  session and relayed on comms event
  `2026-07-23 "OWNER WORD: #482 ratified"` by the Director. Born Proposed the
  same day, per the born-sketch discipline this ADR describes).
- **Supersedes:** [ADR-117](117-plan-templates-and-components.md) (plan
  templates, lifecycle lanes, the promotion workflow, and the component
  library).
- **Related:** [ADR-200](200-intent-as-a-living-idea-graph.md),
  [ADR-209](209-planning-vocabulary.md),
  [PDR-018](../../../.agent/practice-core/decision-records/PDR-018-planning-discipline.md),
  [PDR-121](../../../.agent/practice-core/decision-records/PDR-121-planning-vocabulary.md).

## Context

ADR-117 organised the planning estate around lifecycle directories —
`future/` (later), `current/` (next), `active/` (now) — with a promotion
workflow moving plans between them, per-collection roadmaps, and a
component library of reusable plan fragments. That model embedded two
assumptions the estate outgrew: that a plan's **delivery state** is a
filesystem fact (which directory it sits in), and that a plan **governs
work by existing** (any file in `active/` reads as authorised).

Both assumptions failed in practice. Delivery state expressed as file
location drifts the moment schedules move, and keeping it true demands
constant file churn that no validator can distinguish from substantive
change. Existence-as-authority let unratified sketch corpora read as
governing plans — the failure the owner named directly: **executed is not
ratified**.

The replacement structure was owner-ratified on 2026-07-22 at the
planning sitting (decisions register, D23) and landed with its validator
and templates in PR #478. This ADR is the doctrine home for that
structure.

## Decision

The planning estate under `.agent/plans/` is a flat corpus of **plan
nodes**, contract-enforced by the
plan-node schema (`.agent/plans/plan-node-schema.md`) and its
validator:

- **Three node types, by directory**: `strategic/` (the outcome and the
  bet — long-lived, few), `delivery/` (one step of a lane — short-lived,
  archived at completion), `runbooks/` (repeatable procedures). There are
  no lifecycle lanes and no promotion workflow: a plan's type never
  changes, and its file never moves while live.
- **Born-sketch ratification**: every plan is `status: sketch` — however
  green its checks — until it carries a complete owner ratification stamp
  (`ratified_by` + `ratified_date` + `ratified_where`, the last a
  traceable pointer to where the owner's word lives). The `status` enum
  (`sketch | ratified | superseded | archived`) carries ratification
  state only; `superseded` requires a named successor.
- **Delivery state is a Linear projection, never a repo field**:
  milestones are named observable states of the product, held in Linear
  with tickets mapped; plans reach delivery state through their ticket
  edge. The sorting test: if it moves when the schedule moves, it lives
  in Linear; if it only moves when the product moves, it lives in the
  repo.
- **`impact_areas`**: every plan declares the product areas it changes,
  drawn from the closed, additive
  registry (`.agent/plans/impact-areas.md`). The repo owns impact
  structure (durable intent); Linear owns delivery grouping.
- **Expiring owner-gates**: every gate names what clears it and carries
  an absolute expiry. The default horizon is strategy-scoped data — the
  governing strategic node sets the tempo for its subtree
  (`gate_expiry_default`), not a schema constant.
- **One template per node type**, each opening with its ratification
  block (`.agent/plans/templates/README.md`). The
  ADR-117 component library is retired with the lane model; the schema
  document is the single contract.
- **Sensitivity by construction**: plans are public-repository artefacts
  carrying mechanism only; anything internal rides the linked Linear
  ticket.

## Relationship to ADR-200 (dated note, 2026-07-23)

ADR-200's living idea-graph — graph-authoritative intent with dual
human/machine embodiment — remains Accepted and is **deferred, not
deleted**. This estate is its thinner successor for the release period:
the plan-node schema keeps the machine-checkable frontmatter edges
(`serves`, `depends_on`, `tickets`, `impact_areas`) that ADR-200's graph
would formalise, so the corpus stays graph-ready without carrying the
graph substrate now. When the idea-graph lands, plan nodes become node
types over it; nothing in this ADR forecloses that.

**Dated note (2026-07-31)**: the deferred authority question is now
settled by [ADR-221](221-estate-knowledge-graph.md) (owner-ratified):
authored files are authoritative, the graph is a derived
per-home-recomputable index, and the idea layer lands as the concept
scheme rather than a graph-authoritative store. This estate's
graph-ready frontmatter is exactly the connection ADR-221 builds on.

## Lane vocabulary (dated note, 2026-07-24)

"Lane" here originally read as a synonym for a delivery plan. The owner-
directed lane definition of 2026-07-24 (PDR-117, dated amendment) gives
the word its boundary criterion: a lane is bounded by its coherence
surface — the files and meanings one mind must hold mutually true as
they change — plus the intent that spans it, and a delivery plan is one
**step** of a lane, never the lane itself. The `delivery/` bullet above
is trued accordingly. This sense is unrelated to ADR-117's retired
lifecycle lanes (`future/`/`current/`/`active/`), which this ADR
already superseded.

## Consequences

- Doctrine, skills, and templates that taught the lane model (the plan
  skill, the ADR-117 template library, PDR-018's lane-placement sections,
  ADR-209's lane realisation) are trued to this model or carry dated
  amendments pointing here; the sweep is recorded on MCP-120 with a
  per-surface disposition ledger.
- The estate validator enforces the schema's contract in CI — the
  schema's §Enforcement section enumerates the refusals — with an empty
  corpus itself a failure, so the estate cannot silently vanish.
- Historical records (dated explorations, prior ADRs' context sections,
  archived plans) keep their original vocabulary: they describe what was
  true when written, and rewriting records is not truing.
