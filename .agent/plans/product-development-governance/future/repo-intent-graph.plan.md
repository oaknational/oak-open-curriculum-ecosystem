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

**ARCHITECTURE REFINED (2026-06-22, [ADR-200](../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)).**
ADR-200 is now the authoritative architecture for the intent graph and the planning-estate rewrite:
ideas are the fundamental node, the graph is the living authoritative source of truth, documents are the
co-equal human-navigable embodiment connected by frontmatter edges, and the idea-graph is built as a
domain instance over `graph-core`. Where this plan's "Stage 2 = survey" framing reads as a
survey-and-classify pass, that is **superseded** — Stage 2 is the **idea-harvest** into the graph. Read
ADR-200 first; this plan's vision stands, its survey-stage framing defers to ADR-200. The **canonical
statement of the value** this intent knowledge-graph delivers lives in
[ADR-200 §Value](../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md) —
recorded once there, not restated here.

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

**V0 of node-schema #1 is authored (docs):**
[`plan-node-schema.v0.md`](../plan-node-schema.v0.md) — decision-complete as V0, explicitly
pre-survey. It is the **lens the Stage-2 survey reads the estate against**: a falsifiable,
complete, checkable shape (every field, enum, and edge stated definitely, each tagged with its
refinement-exposure: LOCKED / SURVEY-MAY-ADD / OWNER-RESERVED). The build half of Stage 1.2 (the
Zod schema) is authored at promotion, not by V0. **The sequencing is V0 → survey → V1**: V0 is
the survey's input; the survey (Stage 2) additively refines V0 against the real estate; the
result is ratified as V1 at the close of Stage 2. V0 carries no extractor, registry, or
validator (those are Stage 1.3/1.4, promoted separately).

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
- **Gate** (durable, repo, orthogonal — an *expiring* block, never an open holding state): a
  plan blocked on another plan uses a `depends_on` blocking edge (clears when the target is `done`);
  a plan blocked on an owner/external decision carries a `gate` with `awaiting` + `clears_when` + a
  **mandatory absolute `expires` date**. An expired gate is drift the extractor surfaces for a forced
  decision (renew / resolve / dispose); it never auto-cancels. This satisfies the repo's
  no-indefinite-holding-state doctrine and reuses the claims/queue/heartbeat TTL-staleness idiom.

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
`serves_strategic_choice`, archive-complete with recorded disposition, and **build the
`stream → thread → plan` structure for two co-equal audiences** — a directory hierarchy (human
navigation) plus the frontmatter typed edges (agent navigation). **Threads are a co-equal
intermediate layer defined here**, not deferred: this stage defines the new thread set from the
strategy and introduces the `thread` node-type with its `thread → stream` / `thread → goal` edges
(pulled forward from Stage 5+ — the restructure cannot site plans in threads without them).
It also **closes strategy-coverage gaps with authored new plans** (effectiveness), not merely
aligning the survivors. Promote the `plan` node-type from observe to warn, then (separate later
decision) to enforce.

### Stage 4 — Actuation: the evidence-ingestion layer (turns structure into a system)

The structure built in Stages 1–3 is inert without live evidence. This stage builds the
**actuation layer** specified in [§From structure to system](#from-structure-to-system--the-evidence-ingestion-requirement-the-part-that-makes-it-real):
connectors drawing directly from **Vercel / Sentry (incl. OTEL spans) / Sonar / GitHub / PostHog**,
**triggers** (event-driven and scheduled) that drive **agentic analysis**, and **validated
write-back** of evidence edges and refreshed projections to the graph. This closes every loop
(delivery metrics, the `validated_by` user-value loop, cost/accuracy) and is what makes the
difference between *documenting* intent and *running* an effective agentic-first product-creation
system. **Required and specified; not built yet** — the *how* (connector technology, orchestration,
write-back validation) finalises at promotion to `current/`; it is a strong candidate for its own
executable plan and is arguably the highest-leverage build after Stage 1. Per source: Vercel →
deployment frequency / lead time / FDRT; Sentry → change fail rate / incidents; Sonar → quality /
complexity / duplication; GitHub → the change axis and the `realized_by` join; PostHog → the
`validated_by` user-value signal.

### Stage 5+ — grow the graph (each gated on a live consumer)

Add the remaining node-types one at a time (report, ADR, continuity, archive, strategy, product,
product-increment, …), each observe → warn → enforce. (`plan` lands at Stage 1; **`thread` is
pulled forward to Stage 3** — it is a co-equal structural layer of the restructure, not a later
addition.) Build external-edge **projection**
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

The strategy, intent, and planning system this graph governs is **becoming a significant part of
the core value of the Practice itself** (owner, 2026-06-21) — not internal tooling that supports
the real work, but a substantive part of what the FRAME stream delivers. The same-repo unity that
makes delivery metrics native (see §Delivery-performance metrics) is one face of that value: a
system where intent, work, output, and the evidence that value was delivered all live in one
traversable substrate is itself the artefact other teams would adopt. This reframes the intent
graph from plumbing to product.

## Schema-first, a second domain

The repo's Cardinal Rule (types flow from one schema, generated, strict, no hand-drift) names
the **upstream OpenAPI spec** as its schema; it is not literally about plans. The owner
confirmed (2026-06-21) that the **same discipline applies here as a second schema domain**:
the document-type schemas are the single source of truth, indexes are generated, validation is
strict. This plan applies the principle by analogy — it does not restate or extend the
Cardinal Rule itself.

## Delivery-performance metrics (DORA) — a first-class design consumer

Owner-directed: the DORA software-delivery-performance metrics are considered at **every level**
of this design — node-types, edges, projections, and strategy alignment — for the repo's **two
products: the MCP app, and the Practice / agentic-engineering framework itself** (the FRAME
flagship). The graph is designed so these metrics *fall out as projections*, never a bolted-on
dashboard.

**Why this is native here, not a bolt-on — the same-repo advantage.** Vision, strategy, intent,
planning, work, and output all live in **one versioned, typed substrate**. That is not merely a
convenience. DORA's own metrics-frameworks guidance is that logs-based delivery metrics give
continuously-measured, standardized data at scale *but require sufficient observability into the
development toolchain* — usually the **hardest precondition to meet**, because in a conventional
estate the intent lives in one tool (docs/tickets), the work in another (git), and the output in a
third (deploys/incidents), and the joins must be reconstructed after the fact. Here that
observability is **intrinsic** — and concrete: the repo already integrates the developer toolchain
across all three axes — **GitHub** (the change axis: commits, PRs), **Linear** (the intent /
execution-status axis, via the `projects_to` edge), and **Sentry with OpenTelemetry spans** (the
runtime / incident axis, span-IDs correlating logs to traces). Those external systems are the
typed nodes the `evidence` and `projects_to` edges point at, so every strategic choice, plan,
commit, deployment, and incident is reachable in one graph, and the critical delivery metrics —
including the planned-vs-rework attribution everyone else reconstructs painfully — are a traversal
away. The architectural
claim is therefore stronger than "it's convenient to co-locate": **we are building the system around
value delivery as the organizing axis**, so that surfacing the metrics that prove value is being
delivered is a structural property of the substrate, not a later instrumentation project. This is
the FRAME stream's differentiator made concrete, and the deepest reason the intent graph earns its
keep.

**The five metrics** (DORA 2025, verbatim): *throughput* — lead time for changes (committed →
deployed in production), deployment frequency, failed deployment recovery time; *instability* —
change fail rate (deployments requiring immediate intervention), deployment rework rate (unplanned
deployments resulting from a production incident).

**Two altitudes, both first-class:**

- **The MCP app** — DORA in its literal, validated sense; "production" is the deployed app, and the
  calibrated performance bands apply.
- **The Practice / agentic framework** — DORA-*shaped* metrics over the repo's own delivery (a
  landed, gate-green commit as the unit; intent→landed-change as lead time; the remediation share as
  rework). This is the FRAME stream measuring itself. Borrow the metrics' *shape*, not DORA's
  calibrated bands — applying them to the meta-process is a novel use, not a validated one.

**Where the metrics attach (all levels), reusing the contract — no new primitives:**

- **Node-types** — the reserved `product` and `product-increment` node-types are the
  deployment/release units DORA counts; each `product-increment` is one shipped change.
- **Edges** — `projects_to` (→ Linear) carries live execution status (the throughput state);
  `evidence`-family edges from `product-increment` to external deployment/incident nodes
  (Vercel deploy, Sentry incident) are the raw DORA event sources (Pillar 6 — services report
  back, outward-only).
- **Attribution (the unique contribution)** — the instability metrics need every change classified
  planned-vs-rework. The `plan` node's `serves_strategic_choice` + `kind` + `disposition`, joined to
  commits, give this **natively**: a change tracing to a plan serving a strategic choice is planned;
  an incident-driven fix with no serving plan is rework. This is the classification conventional
  setups reconstruct painfully; here it is a graph traversal — the payoff of knowledge living with
  the code.
- **Projection** — the metrics are a generated read-model (Pillar 1) over the typed graph + evidence
  edges, never hand-maintained; drift is a validator failure.

**The deeper design ambition (design intent, survey/build-gated — not a built claim).** The seven
DORA AI capabilities the 2025 research names — clear & communicated AI stance, healthy data
ecosystems, AI-accessible internal data, strong version control practices, working in small batches,
user-centric focus, quality internal platforms — map closely onto what this planning system already
encodes or builds: the intent graph **is** AI-accessible internal data and a healthy data ecosystem;
TDD-cycle-as-landing **is** working in small batches and strong version control; the directives
**are** the communicated AI stance; agent-tools and the validators **are** the quality internal
platform. So the graph is positioned to instrument not only DORA's *outcome* metrics but the
*capabilities* that drive them (Figure 45's AI-Adoption × capabilities → outcomes), closing DORA's
capabilities→metrics→value loop natively, for both products. We have measured nothing yet; this is
the FRAME stream's measurement story, held as ambition.

**Build gating.** No metric extractor, evidence-edge wiring, or dashboard is built here. Today lead
time / deployment frequency / change fail rate / FDRT are derivable from git, Vercel, and Sentry
(Sentry foundation in progress — ADR-162 Observability-First and
[`what-the-system-emits-today`](../../observability/what-the-system-emits-today.md)); rework-rate and
full intent-attribution need the intent-graph extractor (Stage 1.4) plus the Linear projection (the
`external-pointer-surface-integration` plan). The metric surfaces' home is the observability estate
([`observability-and-quality-metrics.plan.md`](../../architecture-and-infrastructure/future/observability-and-quality-metrics.plan.md),
whose `quality-metrics` todo already names change fail rate). This section makes DORA a design
constraint on the graph; the build is owner-gated and staged.

## Closing the loop — continuous measurement, user value, and the multi-developer transition

Three things the DORA work surfaced converge on **one** structural move: wiring evidence back
into the graph. The intent graph already records intent flowing *down* (choice → plan → work →
output); the loop closes when evidence flows *back up* (output → was-it-correct → was-it-used →
did-it-serve-the-user), as typed edges, so the questions that matter are graph traversals rather
than reconstructions.

### The user-value loop — from a link to a loop

Today the graph instruments intent → strategic-choice (a traceability **link**); user value is
*asserted*, not *returned*. DORA finds user-centric focus is the strongest moderator of AI's
effect on team performance — its absence can actively harm teams — so this is the highest-value
gap. The structural cure (not a doc-patch):

1. each `strategic-choice` carries a **user-value hypothesis** (what user outcome it claims);
2. user-value evidence **returns** as a typed `validated_by` edge (`evidence` family) onto the
   `strategic-choice` / `product-increment` — usage signals, teacher feedback, the EEF evidence
   corpus, Oak-grounded impact;
3. a validator surfaces any choice with delivered increments but **no returned user-value
   evidence** as drift — making the loop's absence visible, exactly as the expiring `gate` makes
   indefinite holding visible.

This completes the **value stream the graph otherwise truncates at delivery** (the VSM idea →
customer flow): the customer-feedback end becomes typed evidence, not an external afterthought.
The *hypothesis content* is owner/strategy-shaped; the *loop structure* is the cure. It also
re-anchors an internal, agent-built substrate to the teacher it ultimately serves — the structural
answer to "how does an internal system stay user-centric."

### Continuous measurement — the gap map and a uniform closure

| Axis | Have today | Gap → closure |
| --- | --- | --- |
| Substrate / Practice health | Fitness four-zone (ADR-144) | — (have it) |
| Per-change quality | Quality gates (point-in-time) | aggregate the trend (gate-failure rate over time) |
| Delivery performance | — | the DORA five — extractor over the graph + GitHub/Linear/Sentry evidence |
| Output accuracy | per-change reviewers | gate-failure + **rework-attribution** trend (rework rate ≈ inverse accuracy) |
| Usefulness / user value | — | the user-value loop above (`validated_by`) |
| Cost per delivered value | seat-cost *awareness* | token/seat telemetry attributed to increments via `realized_by` |
| Capability presence (AICM) | — | graph-derived proxies (batch size, commit cadence, graph coverage, gate health) |

The closure is **uniform**: every one of these is a Pillar-1 generated projection over the typed
graph plus an `evidence`-family edge (deployment, incident, gate-result, cost, user-value). There
is **no separate metrics stack** — the intent graph, fed by returning evidence, *is* the
continuous-measurement substrate. This is what closes the report's "constantly measured for
accuracy, usefulness, and **cost**" gap that value-contingency asserts but does not yet instrument.

### The multi-developer transition (the motivation)

This repo is one-developer-many-agents **today**, but it is transitioning to **many checkouts —
one or two developers at different times, each with many agents, sometimes one agent, sometimes a
developer with minimal agentic support by preference**. That transition is part of the motivation
for this work, and it imposes design constraints the graph must honour, by construction:

- **Author-agnostic.** No node or edge assumes a particular author. A change is attributed through
  edges and external identity, working identically whether made by a developer, many agents, one
  agent, or none. (Attribution across shared toolchain auth is a known hazard — the comms/identity
  stream is the provenance.)
- **The versioned in-repo substrate is the continuity mechanism.** With developers and agents
  arriving and leaving across checkouts, the graph — not any session — carries the shared intent;
  everyone reads the same versioned truth.
- **Graceful degradation across agent density.** Dual legibility (Pillar 4) means a
  minimal-agentic developer is served as well as a heavy-agentic one: humans never read YAML to
  understand intent; agents never parse prose to traverse it.

The transition also **resolves the topology divergence** noted against the DORA research: as the
repo moves toward many-devs-plus-agents, DORA's *team-performance* construct becomes **directly**
applicable rather than a single-owner reinterpretation — and the author-agnostic, returning-evidence
graph is precisely the substrate that lets delivery be measured coherently across a fluid cast.

**Build-gated.** None of this is built here. It is the design intent the contract must serve, so
the later, owner-gated build composes in rather than retrofits. The `validated_by` edge and the
cost/accuracy evidence edges are reserved in node-schema #1's vocabulary
([plan-node-schema.v0.md §5.5](../plan-node-schema.v0.md#55-closing-the-loop--returning-evidence-and-the-multi-developer-transition)).

## From structure to system — the evidence-ingestion requirement (the part that makes it real)

Everything above — the typed graph, the evidence edges, the projections, the closed loop — is
**structure**. A structure is inert. It becomes **a highly effective, agentic-first digital
product-creation system** only when evidence is **drawn directly from the sources, analysed, and
written back** — continuously. This requirement is stated here **explicitly and up front**, even
though the *how* is deliberately not yet decided: naming it is what keeps a very nice strategy and
planning structure honest about the work that turns it into a working system. Without this layer
the design is elegant and inert; with it, every loop above actually closes.

Three capabilities are **required** (the *how* — connector technology, orchestration, analysis
design, write-back validation — is explicitly **NOT decided here**; it is a later, owner-gated
stage and a strong candidate for its own plan, arguably the highest-leverage build after Stage 1):

1. **Tooling / connectors** that draw evidence **directly from the sources**, each feeding specific
   edges and metrics:
   - **Vercel** — deploys → deployment frequency, change lead time, failed deployment recovery;
   - **Sentry** (incl. OpenTelemetry spans) — incidents / errors → change fail rate, FDRT;
   - **Sonar** — code quality, duplication, complexity → quality-trend evidence;
   - **GitHub** — commits / PRs / reviews → the change axis, the `realized_by` join;
   - **PostHog** — product analytics → usage and user behaviour, **the primary signal for the
     `validated_by` user-value loop** (this is where the loop's evidence actually comes from).
2. **Triggers** that cause ingestion **and the subsequent analysis** — event-driven (a deploy
   lands, an incident opens, a PR merges) and/or scheduled. The analysis is **agentic**: an agent
   reads the evidence, computes the metric or attribution, and decides the graph update.
3. **Write-back** — appropriate, **validated** updates to the repo (new evidence edges/nodes,
   refreshed projections, surfaced drift), respecting the graph contract (typed, author-agnostic)
   and the no-PII rule (external IDs in gitignored config only; services report back, never hold
   authority — Pillar 6).

This is the **actuation layer**. The strategy/intent/planning structure plus this ingestion
machinery is what makes the difference between *documenting* intent and *running* an effective
agentic-first product-creation system. It is build-gated like the rest — but it is **the** thing
that makes the system real, and the design should not let the elegance of the static structure
obscure that the live ingestion machinery is the load-bearing, still-to-be-designed work.

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
- **DORA-metric derivation is designed-for, not built here.** The graph is shaped so the metrics
  fall out as projections (see §Delivery-performance metrics); the extractor and dashboard are a
  later, owner-gated build, not Stage 1.
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
