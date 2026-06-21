---
plan_id: repo-intent-graph
title: 'Repo Intent Graph — the agentic-first memory and intent substrate'
type: governance-delivery
status: future
lifecycle: future
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-21
related:
  - ../vision-strategy-and-plan-estate.plan.md
  - ../../../../VISION.md
  - ../../../../docs/strategy/README.md
  - ../../../../docs/strategy/stream-agentic-framework.md
  - ../../../../packages/core/graph-core/README.md
  - ../../../../packages/libs/graph-project/README.md
  - ../../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md
  - ../../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md
  - ../../../practice-core/decision-records/PDR-018-planning-discipline.md
  - ../../../../agent-tools/README.md
design_inputs:
  - ../suggestions/governed-repo-document-graph.semantic-model.md
  - ../suggestions/governed-repo-document-graph.plan.md
  - ../suggestions/service-authority-and-operating-contexts.semantic-model.md
  - ../suggestions/context-preservation-and-intent-map.semantic-model.md
  - ../suggestions/repo-intent-and-service-knowledge-boundaries.proposal.md
  - ../suggestions/project-context-preservation-gap-report.md
---

# Repo Intent Graph — the agentic-first memory and intent substrate

> **Strategic plan (`future/`). Owner-ratified vision (2026-06-21); not yet executable.**
> Execution decisions finalise only at promotion of a stage to `current/`. Do not start
> the build from this file; promote Stage 1 first.

## Problem and intent

The repository is no longer a codebase with supporting docs. It is becoming a
**strategy-bearing memory and intent system** that humans and agents both read and write,
and that connects to external systems (GitHub, Linear, Figma, and the observability/quality
estate). The durable intent — why work matters, what strategy it serves, how quality is
judged, how a change becomes trustworthy — lives in repo documents; external services
evidence and execute, they do not define it.

That system exists in concept but is **unenforced**, and the drift is already real:
a wide, unvalidated set of emergent frontmatter keys against the minimal documented shape (ADR-117 §6 documents only `name`/`overview`/`todos` for executable plans), two
parallel status vocabularies (templates' emoji prose vs an open-ended frontmatter `status:`),
an `isProject` field shipped by templates and defined in no doctrine, no frontmatter schema,
no validator, and a "single sanctioned discovery pointer" (`completed-plans.md`) that is
itself headed *"Deprecated"*. The relationships the estate actually uses (`parent_plan`,
`supersedes`, `serves_strategic_choice`, `thread`, …) are convention-only, with no typed
contract and no enforcement. (Exact conformance counts are unverified and are a job for the
fresh survey — Stage 2 — not a figure to design against.)

This is precisely the failure the repo's own deepest discipline exists to prevent — only in
the memory/intent layer instead of the SDK layer. See **§Schema-first, a second domain**.

## End goal, mechanism, and means

- **End goal.** A future human-agent team can recover what the repo is for, how strategy
  becomes work, what each document owns, where durable intent lives, and how a change is
  judged ready — **from repo records alone**, with no drift between the truth and the
  surfaces that present it. Humans and agents are co-equal first-class participants.
- **Mechanism.** Model the repo's durable intent as a **typed graph** — typed nodes
  (document types), typed directional edges (authority / traceability / dependency /
  evidence / projection), a single schema as source of truth, indexes generated from it,
  validated over the **generic graph substrate** the repo already owns. The schema cannot
  drift from the surfaces because the surfaces are projections of it.
- **Means.** Ratify the graph contract once; build it incrementally, node-type by node-type,
  observe → warn → enforce, starting with the `plan` node-type (which also unlocks the
  plan-estate survey and restructure). See **§Staging**.

## The ratified design (six pillars)

Owner-ratified 2026-06-21 ("all of it"). These are the principles; the **specific taxonomy
is survey-gated** (see §Boundaries). The `suggestions/` documents are the design exploration
that informed these (ChatGPT-synthesis, held as input-to-verify); they converge with the
repo's existing doctrine, which is why the principles are adopted while their concrete
registries are not adopted wholesale.

1. **One schema, generated — indexes are projections, never hand-maintained.** Each document
   type has a strict, validated frontmatter-and-edge schema. README tables, the
   strategic-choice registry, coordinating indexes, and completed-plan discovery become
   surfaces generated from the typed graph, so they cannot drift.
2. **Built on the generic graph substrate, not a bespoke stack.** `graph-core` (transport-
   agnostic RDF/JS primitives, canonicalisation, vocabulary registry) and `graph-project`
   (property-graph projection) are the substrate; the intent graph is another corpus over
   them, alongside the curriculum graph. `agent-tools` is the thin CLI consumer (ADR-179).
   No parallel graph stack; no transport concerns in the substrate.
3. **The authority model is the spine — typed edges, machine-checked.** Authority is a typed,
   directional, validated property (`derives_from`, `supersedes`, `serves_strategic_choice`,
   `projects_to`), not prose convention. Invariants become checks: every active plan traces
   to a strategic choice → vision → Oak goal (or an explicit pending-gate); no archived node
   is a live dependency; no continuity record is citable as scope authority; Linear never
   holds an authority edge into intent.
4. **Humans and agents are co-equal first-class participants (dual legibility).** Folder tree
   navigable by humans (navigation); typed metadata carries truth (governance); a validated
   invariant keeps them from contradicting. A human never has to read YAML to understand
   intent; an agent never has to parse prose to traverse the graph.
5. **Intent survives the conversation (the preservation invariant).** Distil materially
   reframing conversations into durable records (decisions, assumptions, rejected
   alternatives), never transcripts; run a "what is lost if the chat vanishes" scan at
   consolidation/handoff. The highest-risk loss is *why the structure is shaped this way*.
6. **External systems are typed edges to external nodes; the repo stays canonical.** GitHub
   aggregates change-readiness; Linear projects execution; Figma is design source;
   Sentry/Sonar/Elastic/PostHog evidence their domains. Each is a directional edge with a
   capability mode (read/summarise/annotate/mutate), an authority effect, and a supervision
   requirement; direction is the invariant (repo intent projects outward, services report
   back). **No PII in version control, ever** — external IDs live only in gitignored local
   config.

## The contract (ratify the shape up front; refine the taxonomy by survey)

"All of it" means the **whole shape** is ratified before building: the node-type set (names,
purpose, authority), the edge/relationship vocabulary (name, allowed source→target types,
direction, cardinality, authority-or-traceability-or-dependency-or-evidence-or-projection
family), the authority model, and the external-edge vocabulary. The contract is **versioned
and additive** (like the strategic-choice IDs): ratified as v1 from existing doctrine +
convergent suggestions + first principles, then **additively refined** by the Stage-2 survey
when it surfaces a real type or edge the v1 missed. Ratifying the shape up front is what makes
a single-node-type first build non-compromising: node-schema #1 composes into the final graph
rather than being retrofitted.

## The plan standard is node-schema #1

Owner-ratified 2026-06-21. The plan standard is **not** a standalone markdown rubric; it is
the `plan` node-type's schema within this graph — its frontmatter contract (canonical fields,
closed `status` enum, lifecycle, reconciling PDR-018 + ADR-117 + templates + the emergent
reality) plus its typed edges (`serves_strategic_choice` → the strategic-choice registry;
`derives_from` → ADR/strategy; `supersedes`/`superseded_by` → plan; `depends_on` → plan).
Conceiving it this way means it never has to be reconciled with a graph later. It is delivered
by **Stage 1** and consumed by the controlling plan's **Body 3** as its Anchor B (the conformance
standard) and Anchor A (the registry the `serves_strategic_choice` edge resolves against).

### Plan state — orthogonal axes, not one overloaded lane (owner-shaped 2026-06-21)

The `future`/`current`/`active` lanes have confused because they collapse two distinct questions
into one sequence: `future`→`current` is a **readiness** jump (strategic intent → executable),
while `current`→`active` is an **execution-state** jump (queued → in-progress). Node-schema #1
fixes this by modelling state as **orthogonal axes**, each a small closed enum, never one nested
status (the combinatorial trap, and the suggestions' own "do not collapse status / lifecycle /
execution / evidence state"):

- **Kind / readiness** (durable, repo): `strategic` (intent, not yet executable) vs `executable`
  (has TDD cycles). The honest name for `future`↔`current`.
- **Execution status** (live — Linear's, projected, not hand-maintained in the repo): backlog →
  in-progress → done. Where `active` belonged: the repo projecting to a Linear project removes
  the `current`↔`active` confusion and the drift of a hand-edited "in-progress".
- **Terminal disposition** (durable, repo): `done` · `superseded` (replaced, names a successor) ·
  `extracted-and-archived` (partial value mined) · `cancelled` (won't-do, no successor).
- **Hold** (durable, repo, orthogonal): `paused` + reason (`awaiting-feedback`,
  `awaiting-dependency`, `owner-gated`).

**Linear mapping:** a plan maps to a Linear **project** (a goal-bearing body with constituent
issues), not a single epic-issue — strategic choice ≈ Initiative, plan ≈ Project, workstream/cycle
≈ Issue/sub-issue. The repo owns the durable plan and axes; Linear owns live execution status (the
Pillar-6 `projects_to` edge). The mapping is clean because execution-state is not duplicated in the
repo. **Folders** follow "folder navigates, metadata governs": collapse `current`/`active` into one
executable home; keep `archive`. **The exact enum values and the folder collapse are ratified at
Stage 1, grounded by the survey** (which states actually occur) — this records the model, not the
final vocabulary.

## Staging

Build incrementally; the smallest slice first. Each stage promotes to `current/` as an
executable plan when its trigger fires; **stages are not started from this strategic file**.

### Stage 1 — the smallest slice that unlocks the plan-estate work (without compromising the vision)

The minimum that lets the survey and restructure proceed while composing into the full graph:

1. **Ratify the contract (v1, docs).** The node-type registry, edge vocabulary, authority
   model, and external-edge vocabulary — the shape, additively refined later by the survey.
2. **Specify and ratify the `plan` node-schema (node-schema #1)** — the plan standard, as
   above: the strict frontmatter-and-edge contract for the `plan` node-type.
3. **The strategic-choice registry** — the machine-readable canonical registry (the 12
   owner-signed bets `APP/TOOLS/FRAME-1..4` plus optional sub-IDs) that `serves_strategic_choice`
   resolves against; the strategy README's choice table becomes a projection of it.
4. **Observe-mode plan extractor** — a thin extractor over `graph-core`, surfaced through
   `repo-validators`/`agent-tools`, that parses plan frontmatter, builds the plan subgraph,
   and **reports** conformance and traceability drift. Observe-only: it never blocks.

This unlocks the plan work directly: the survey runs the extractor plus a reviewed
qualitative pass; the restructure rewrites plans to node-schema #1 and wires
`serves_strategic_choice`. Everything outside this slice is deferred without loss because the
contract shape is ratified up front.

**Stage 1 explicitly does NOT include:** other node-types' full schemas; warn/enforce
escalation; any external-service projection (Linear/GitHub/Figma) build; graph
visualisations; the meta-schema. Those are later stages and compose onto the ratified shape.

### Stage 2 — survey (consumes Stage 1)

The fresh deep conformance-and-traceability inventory over the estate — its decision-complete
method is the [deep-plan-estate-survey brief](./deep-plan-estate-survey.plan.md): a multi-angle
read (≥3 agents per plan, holistic + specialist), cross-cutting relational passes, and an
adversarial verification gate before any finding is accepted. The observe-mode extractor's output
plus that reviewed multi-agent pass both produce the restructure work-list and **additively refine
the v1 contract** against the real estate. (This is the controlling plan's Body-3 fresh-survey
prerequisite.)

### Stage 3 — restructure (consumes Stage 2)

The controlling plan's Body-3 estate restructure: rewrite survivors to node-schema #1, assign
`serves_strategic_choice`, archive-complete with recorded disposition, derive new boundaries.
Promote the `plan` node-type from observe to warn, then (separate later decision) to enforce.

### Stage 4+ — grow the graph (each gated on a live consumer)

Add node-types one at a time (report, ADR, thread, continuity, archive, strategy, product,
product-increment, …), each observe → warn → enforce. Build external-edge **projection**
only when the consumer is live: Linear/GitHub when the team and its delivery surface form;
Figma when the designer arrives; the observability edges as those surfaces mature. Generated
graph surfaces/visualisations last. The `external-pointer-surface-integration` plan becomes a
concrete instance of the Pillar-6 external-edge model when Linear projection is built.

## Relationship to strategy — this is the FRAME stream, dogfooded and releasable

This system is the **agentic-engineering framework stream's flagship artefact**
([stream-agentic-framework](../../../../docs/strategy/stream-agentic-framework.md)): FRAME-1
(the Practice as a meta-learning loop — intent and learning compound across sessions),
FRAME-2 (openly documented, freely available — the proof is the dogfooding), FRAME-3
(internal reuse — the generic graph substrate serves both the curriculum graph and the intent
graph). Because it is built on the generic, transport-agnostic substrate, it is publicly
releasable as the open exemplar the strategy promises; releasability falls out of the
layering, it is not a separate choice. The bar is therefore the **exemplar standard** — built
so other teams adopt it — not internal sufficiency.

## Schema-first, a second domain

The repo's Cardinal Rule (types flow from one schema, generated, strict, no hand-drift) names
the **upstream OpenAPI spec** as its schema; it is not literally about plans. The owner
confirmed (2026-06-21) that the **same discipline applies here as a second schema domain**:
the document-type schemas are the single source of truth, indexes are generated, validation is
strict. This plan applies the principle by analogy — it does not restate or extend the
Cardinal Rule itself.

## Dependencies and sequencing

- **`graph-core` / `graph-project` graph substrate** — `beneficial`, not `blocking`. They
  already exist; Stage 1's extractor builds on them. Minimum shippable shape without deeper
  substrate work: a thin frontmatter-graph extractor that reads plan frontmatter and reports,
  converging on richer `graph-core` use as the model settles (the suggestion plan's Phase-3
  direction).
- **The signed strategy (the 12 bets)** — `blocking` for the strategic-choice registry
  (Stage 1.3). Already signed off (2026-06-20).
- **The fresh survey** — `blocking` for Stage 3 (restructure boundaries), `beneficial` for
  refining the v1 contract; Stage 2 is itself unlocked by Stage 1.

## Boundaries and non-goals

- **No cathedral before the survey.** Ratify the shape; build node-type by node-type. Do not
  build the full 13-type registry, the meta-schema, or projection tooling up front.
- **Taxonomy is survey-gated.** The node/edge types are derived from the real estate (Stage 2)
  plus first principles; the `suggestions/` lists are candidates to verify, not a list to
  adopt. Convergence with existing doctrine raises confidence in the principles, not authority
  for the specifics.
- **No external-service projection until the consumer is live.** Forward-design the edge
  vocabulary; build projection only when GitHub/Linear/Figma/observability surfaces are real.
- **No PII in version control, ever.** External identifiers live in gitignored local config.
- **Not a replacement for the controlling plan.** This plan owns the graph mechanism; the
  controlling plan governs the vision/strategy/plan-estate thread and the Body-3 restructure
  that consumes Stage 1.
- **No Linear/Sentry/etc. becomes an authority over intent.** Services evidence and execute.

## Strategic acceptance criteria

- **Stage 1 (smallest slice).** The contract v1 is ratified (node-types, edges, authority,
  external-edge vocabulary). The `plan` node-schema exists and is strict and validated. The
  strategic-choice registry exists and the strategy README's choice table is generated from
  it. The observe-mode extractor reports plan conformance + traceability drift deterministically
  and blocks nothing. A plan can be checked against node-schema #1 by command, and the survey
  can consume the extractor's output.
- **Stage 2.** A conformance-and-traceability inventory exists, generated not hand-maintained,
  classifying every plan (keep/rewrite/archive-complete/rehome/new-for-gap) and resolving
  traceability; the v1 contract is refined where the estate proved it incomplete.
- **Stage 3.** Every surviving plan conforms to node-schema #1 and traces to a strategic
  choice; the `plan` node-type is at least at warn enforcement; every removed/moved item
  carries a recorded disposition.
- **Whole.** A future human-agent team answers the preservation questions (§Pillar 5) from
  repo records alone; no generated index drifts from the typed graph.

## Risks

| Risk | Mitigation |
| --- | --- |
| Ratifying a taxonomy that the estate contradicts | Contract is v1 and additive; Stage 2 refines it; do not freeze before the survey |
| Adopting ChatGPT-synthesis design wholesale | Principles adopted (convergent with doctrine); specifics held as input-to-verify and survey-gated |
| Building the cathedral before consumers exist | Staging gates each node-type and each external projection on a live consumer |
| The extractor becomes a parallel graph stack | Build over `graph-core`/`graph-project`; `agent-tools` is the thin consumer (ADR-179) |
| Generated indexes still drift | Indexes are projections of the typed graph; drift is a validator failure, not a manual fix |
| "Don't start" violated by treating this file as executable | Promotion-gated; Stage 1 becomes a `current/` executable plan before any build |

## Promotion trigger (Stage 1 → `current/`)

Promote Stage 1 to an executable `current/` plan when the owner authorises starting the build.
At promotion, finalise: the schema language (Zod, consistent with the repo's schema-first
idiom) and its home; the exact `plan` frontmatter field set and closed `status` enum; the
`repo-validators`/`agent-tools` command surface; and the observe-mode report shape. Author it
with `assumptions-expert` and `docs-adr-expert` readiness review per the plan skill.

## Provenance

The six `suggestions/` documents (listed in `design_inputs`) are the design exploration that
informed this plan — produced in a parallel ChatGPT-project context, merged 2026-06-20, held
at arm's length and read first-hand here. They converge strongly with the repo's existing
doctrine; that convergence raises confidence in the model, it does not make the analysis
authoritative. They are reconciled (absorbed or archived with disposition) when the graph work
begins; until then they remain subordinate input under
[`../suggestions/`](../suggestions/).
