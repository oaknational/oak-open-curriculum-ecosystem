---
plan_id: governed-repo-document-graph-semantic-model
title: "Governed Repo Document Graph — Semantic Model"
type: semantic-model
status: active
lifecycle: current
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-20
model_scope: governance-and-structure-only
related:
  - governed-repo-document-graph.plan.md
  - vision-strategy-and-plan-estate.plan.md
  - high-level-plan.md
  - ../memory/operational/threads/strategy-and-plan-estate-holistic-review.next-session.md
  - ../../VISION.md
  - ../../docs/strategy/
source_threads:
  - linear-conceptual-model
  - github-branch-review
  - governed-document-graph-discussion
  - semantic-model-loss-sweep
summary: "Pure semantic model for the repository's governance structure: what durable document types exist, why they exist, what authority each holds, how they relate, and what project-context insights must be preserved in the repo."
---

# Governed Repo Document Graph — Semantic Model

## Purpose

This document records the **semantic and governance model** behind the governed
repo document graph. It focuses on **meaning, structure, authority, and
relationships**, not enforcement mechanics. The sibling plan,
[`governed-repo-document-graph.plan.md`](governed-repo-document-graph.plan.md),
records delivery, tooling, and validation direction. This document records the
ideal model and the contextual insights that must survive outside the originating
ChatGPT project.

The repository should be understandable as a coherent system of meaning even if
chat transcripts and ephemeral project context are unavailable.

## Core thesis

The repository is becoming a **strategy-bearing intent system**, not merely a
codebase with supporting documentation.

```text
Repo = durable intent, strategy, governance, knowledge, evidence, and structure.
Linear = live execution projection: who, when, assignment, cycle, status.
GitHub PRs = bounded change proposals against the repo's intent system.
```

The repo should define **what is needed and why**. Linear should organise **who
does it, when, and how delivery is coordinated**. GitHub PRs should expose **what
kind of authority or structure is being changed and what review questions apply**.

The danger is not complexity. The danger is **untyped complexity**: meaningful
many-to-many relationships hidden in prose, folder placement, or session memory.

## Root model

The controlling informational model is:

```text
Oak's strategy → repo vision → repo strategy → repo planning
```

The arrows are **informational dependence**, not execution order. Downstream
layers need upstream information to be authored correctly, but safe downstream
work can proceed when its informational needs are clear and its provisional
status is explicit.

The model protects against two failures:

1. **False freeze** — no downstream work moves until every upstream layer is
   perfect.
2. **False authority from activity** — because work is happening, agents infer
   that the strategic boundary is settled.

Keep these axes separate:

```text
importance
work volume
dependency direction
informational need
timing
execution priority
```

Do not collapse them into one scalar called priority.

## Repo as governed document graph

The ideal shape is a graph:

```text
Organisation strategy
        ↓ informs
Repo vision
        ↓ constrains
Repo strategy
        ↓ organises
Value streams / products / product increments / threads
        ↓ generate and group
Plans
        ↓ project into
Linear execution objects
        ↑ report back
Evidence, completion, and delivery facts
```

The middle is not a tree. It is a graph of related projections:

- **value streams** express strategic fronts of value;
- **products** express user-facing or reusable value surfaces;
- **product increments** express value gates or release gates;
- **threads** express strategy-organised conceptual groupings;
- **plans** express durable work intent;
- **reports** express dated evidence;
- **decisions** express durable constraints or choices;
- **continuity records** preserve session handoff and orientation;
- **archives** preserve provenance and superseded value.

Many-to-many relationships are expected and should be explicit:

- one plan can support multiple value streams;
- one product increment can require multiple plans;
- one plan can contribute to multiple products;
- one thread can group work across products;
- one strategy choice can be implemented by many plans;
- one report can evidence multiple plans or decisions;
- one Linear project can project several repo plans;
- one repo plan can generate several Linear issues.

## Authority model

Authority is not recency, detail, file length, operational usefulness, or current
execution activity. Each document type has an authority shape.

| Concept | Primary authority |
| --- | --- |
| Vision | Change authority: the intended change and map to how. |
| Strategy | Choice authority: theory of change, choices, non-goals, measures. |
| Controlling plan | Scope authority for a body of governance/work. |
| Plan | Durable work-intent authority. |
| Product | Product-surface authority. |
| Product increment / release gate | Product value-gate authority. |
| Report | Evidence authority: dated findings, proof, and method. |
| ADR / decision record | Decision authority: accepted constraints and trade-offs. |
| Continuity record | Orientation authority: pickup surface pointing to scope authority. |
| Archive record | Provenance authority: value preservation and disposition. |
| Linear issue/project | Execution-state authority. |
| GitHub PR | Change-proposal and review-boundary authority. |

This protects the repo from drift:

- a continuity record can orient, but should not override a controlling plan;
- a report can preserve evidence, but should not become current strategy by
  convenience;
- Linear can record execution state, but should not become the source of repo
  intent;
- a product gate can define release meaning, but should not become the repo's
  whole strategy;
- a plan can define work intent, but should not silently redefine vision or
  strategy.

## Core ontology

### Organisation strategy

The upstream organisational strategy is the context the repo serves. The repo
aligns with and supports it; it does not restate or fulfil all of it. Where local
or private references inform strategy, the repo should express original
derivation without copying, quoting, or exposing restricted source material.

### Repo vision

The vision states the intended change and why it matters. It gives a map to the
how, but does not own detailed delivery state, assignments, implementation order,
or measurement instrumentation.

### Repo strategy

Strategy defines diagnosis, guiding choices, non-goals, measures, and how value
streams work as a system. Strategy has choice-authority and should be cohesive
across and within streams.

### Value stream

A value stream is a strategic front of value. The current repo model has three
co-equal streams:

1. teacher-facing MCP app value;
2. ecosystem engineering tools value;
3. agentic-engineering framework value.

The streams are a system:

```text
agentic framework builds the other two;
engineering tools underpin the app;
the app proves the foundation and reaches teachers;
the framework is itself reusable value.
```

No stream is secondary. Product-specific readiness requirements do not make one
stream more important than the others.

### Product

A product is a user-facing or reusable value surface. Products are not identical
to threads or value streams. A product can serve many value streams, and a value
stream can contain many products or reusable assets.

### Product increment / release gate

A product increment is a product-specific value gate. It may be called a
milestone in older material, but the clearer semantic role is:

```text
product increment = a product's delivery/readiness/value gate
```

This prevents the Curriculum MCP app's release ladder from becoming the whole
repo's strategic spine.

### Thread

A thread is a strategy-organised conceptual grouping of work. It is useful for
navigation, continuity, and maintaining a coherent line of work across sessions.
A thread is not necessarily a product, and a product is not necessarily a thread.

### Strategic index / high-level plan

A strategic index provides cross-collection orientation. It should index and
route; it should not accidentally own execution detail that belongs to
collection-owned plans or controlling plans.

### Plan

A plan defines durable work intent: what is needed, why it is needed, what it
supports, acceptance criteria, dependencies, gates, proof expectations, and
relationships to strategy, products, value streams, and Linear projection.

A plan should not own live assignment/cycle mechanics unless those mechanics are
itself durable repo intent.

### Decision record / ADR / PDR

A decision record captures durable choices, trade-offs, boundaries, and
consequences. It constrains or explains work; it should not become a broad plan.

### Report

A report captures dated evidence, method, findings, and conclusions. It may be
current evidence, a dated snapshot, superseded strategy input, provenance, or a
reusable method. Archived does not mean worthless; it means its authority is
provenance/evidence rather than current strategy.

### Evidence record

An evidence record says what was checked, when, by what method, and with what
result.

### Runbook

A runbook defines an operational procedure. It is not a plan unless it owns
future work.

### Continuity record

A continuity record helps a future session resume correctly. It should point to
authority and should not become authority by recency. Its safest pattern is:

```text
Scope authority lives at <document>.
This record is a pickup surface, not the authority for scope.
```

### Archive record

Archive records preserve completed, superseded, or dated material. They should
retain provenance and disposition: archived, superseded by, extracted into,
re-housed at, or removed with explicit rationale. Archive discipline should
conserve value, not erase ideas.

### Linear projection

A Linear projection represents repo intent in an execution system. Linear owns
execution state, not repo intent.

### GitHub PR

A PR is a change proposal against one or more parts of the repo's authority
graph. Large PRs should declare review lanes so reviewers know which questions
are being asked.

## Relationship semantics

Relationships should be understood by semantic family before being encoded as
fields or schemas.

### Authority relationships

Authority relationships define what informs, constrains, replaces, or governs
what. Examples: `derives_from`, `constrains`, `supersedes`, `superseded_by`,
`scope_authority`.

They answer: what must be known to author this correctly, which document governs
this body of work, and what prior framing has been replaced?

### Traceability relationships

Traceability relationships show why work exists and what value it serves.
Examples: `supports`, `implements`, `belongs_to_value_stream`,
`belongs_to_product`, `belongs_to_product_increment`, `primary_thread`,
`related_threads`.

They answer: which strategic choice does this support, which value streams does
it serve, and which product increment does it help deliver?

### Dependency and gating relationships

Dependency relationships describe what must exist, be decided, or be true before
something can proceed or complete correctly. Examples: `depends_on`, `blocks`,
`gated_by`, `requires_decision`, `requires_external_input`.

### Evidence and provenance relationships

Evidence relationships connect claims to proof and preserve history. Examples:
`evidenced_by`, `reported_by`, `archives`, `preserves`, `extracted_from`,
`re_housed_from`.

### Execution projection relationships

Execution projection relationships connect durable repo intent to delivery tools
without giving those tools conceptual authority. Examples: `projects_to_linear`,
`summarises_linear`, `tracked_by`.

## Relationship shapes

One-to-one relationships are rare. Use them only when the domain really requires
it.

Some relationships need **one primary** edge for navigation and **many related**
edges for semantic truth:

```text
A plan has one primary thread for navigation.
A plan may have many related threads for truth.
```

Strategy and value relationships are many-to-many by default:

```text
A plan may support many strategic choices.
A strategic choice may be implemented by many plans.
A product increment may support many value streams.
A value stream may be served by many products.
A report may evidence many plans.
```

Direction matters:

```text
Oak strategy informs repo vision.
Repo vision constrains repo strategy.
Repo strategy organises plans.
Plans project into Linear.
Linear reports execution facts back.
```

Do not reverse authority because a downstream document is more detailed.

## Ideal information architecture

### Root

Root-level documents carry public or repo-wide orientation:

- `VISION.md` — change statement and top-level map;
- `README.md` — public entry point, capability inventory, and audience routing.

### `docs/strategy/`

Home for the cohesive strategy corpus: diagnosis, Oak-alignment,
streams-as-system map, strategic choices, non-goals, measures, hand-offs, and
accountability boundaries.

### `.agent/plans/`

Home for durable plan intent, controlling plans, high-level indexes, thread
plans, product-increment plans, and future/current/active work.

### `.agent/memory/operational/threads/`

Home for continuity records and next-session pickup surfaces. These orient; they
do not silently become scope authority.

### `.agent/reports/`

Home for dated evidence, surveys, assessments, findings, and validation reports.
Reports should state whether they are current, dated, archived, superseded, or
method/provenance only.

### `docs/architecture/architectural-decisions/`

Home for durable architectural decisions. ADRs constrain later plans and
implementation work.

### `.agent/practice-core/`

Home for portable agentic-engineering practice doctrine and decision records.

### `agent-tools/`

Home for local operational CLI surfaces. Semantically, this is a consumer of the
model, not the owner of the model.

### Graph substrate packages

Home for graph primitives and substrate capabilities. Repo governance can use
graph ideas without making the semantic model dependent on any one transport or
CLI implementation.

## Lifecycle and state semantics

Do not collapse these states:

```text
status
lifecycle
authority state
freshness
evidence state
execution state
```

Examples:

```text
A report can be archived but still authoritative as provenance.
A plan can be future but strategically important.
A strategy can be current but incomplete.
A Linear issue can be closed while the repo plan still needs disposition.
A continuity record can be recent but non-authoritative for scope.
A product increment can be in progress without being the repo's strategic spine.
```

## Repo and Linear boundary

The repo owns durable intent:

- vision;
- strategy;
- value streams;
- products and product increments;
- plan rationale and acceptance;
- decisions;
- evidence and reports;
- archive/disposition;
- semantic relationships;
- durable hand-off records.

Linear owns execution state:

- assignee;
- current issue state;
- cycle;
- estimate;
- due date;
- live task breakdown;
- delivery coordination;
- operational blocking state.

The relationship is asymmetric:

```text
Repo intent projects into Linear.
Linear execution facts can be summarised back into the repo.
Repo intent remains canonical.
```

## GitHub PR review boundary

A PR may change several authority surfaces at once. Large PRs should declare
review lanes.

| Lane | Reviewer question |
| --- | --- |
| Strategy / authority surface | Does this correctly change or express repo direction? |
| Plan-estate governance | Does this preserve structure, traceability, and scope authority? |
| Evidence / report method | Are findings dated, sourced, scoped, and not overclaimed? |
| Generated code / schema sync | Is generated output consistent with upstream source and free of hand drift? |
| Runtime behaviour | Does application behaviour change safely? |
| Agent-practice doctrine | Does this alter portable practice correctly? |
| Linear / execution projection | Does this preserve repo-vs-Linear authority? |
| Migration / disposition | Is value preserved when files move, archive, or supersede? |

## Correct and incorrect structures

### Continuity records

Correct: a continuity record says where to start and points to the controlling
plan for scope.

Incorrect: a continuity record becomes scope authority because it is newer or
easier to read.

### Product increments

Correct: a product increment defines a value gate for a product and links to the
plans and evidence that support it.

Incorrect: a product milestone becomes the top-level strategy for the whole repo.

### Reports

Correct: a report is dated evidence or method. If superseded as strategy, it
remains provenance and may still preserve empirical findings.

Incorrect: a dated report is used as current strategy because it contains rich
synthesis.

### Linear projection

Correct: a repo plan projects to Linear for assignment, cycle, status, and
coordination.

Incorrect: Linear becomes the only place where scope, rationale, and strategic
trace are recorded.

### Folder paths

Correct: folder paths help humans and agents navigate; metadata carries semantic
truth.

Incorrect: a file's folder location is treated as the only lifecycle or
relationship signal.

### Strategy and plans

Correct: plans trace upward to strategy; strategy defines choices and non-goals;
plans do not silently change strategy.

Incorrect: a plan introduces a new strategic direction without registering it as
a strategy change.

## Naming and vocabulary guidance

Prefer:

- `product_increment` or `release_gate` over ambiguous repo-global `milestone`
  when the gate belongs to a specific product;
- `continuity_record` over authority language for next-session documents;
- `evidence/provenance` over current strategy for dated reports;
- `execution projection` over vague sync language for Linear;
- `many-to-many` over forced tree language;
- `informational dependence` over execution order;
- `authority state` over raw status when deciding whether a document governs.

Avoid:

- treating `active`, `current`, `future`, and `important` as equivalent;
- using folder placement as the only source of truth;
- calling product-specific release gates repo strategy;
- letting Linear issue state overwrite repo intent;
- leaving relationship shapes implicit in prose;
- using recency as a proxy for authority;
- archiving without disposition;
- losing ideas because their original container became stale.

## Adversarial loss sweep

If the originating ChatGPT project context were unavailable, these are the main
insights that would be at risk unless preserved in repo records.

1. **Repo/Linear boundary** — the strong version is not "sync everything"; it is
   repo intent projected into Linear execution.
2. **Informational dependence** — vision → strategy → planning defines
   correctness, not a temporal freeze.
3. **Axis separation** — importance, volume, dependency, timing, and priority are
   different axes.
4. **Product gate vs repo strategy** — Curriculum MCP milestones are product
   increments, not the whole repo strategy.
5. **Three streams as a system** — framework builds the other two; tools underpin
   the app; app proves and reaches; framework is itself value.
6. **Threads/products/plans/increments differ** — they are projections over the
   graph, not one hierarchy.
7. **Continuity is not scope authority** — next-session docs orient; controlling
   plans govern.
8. **Archived reports retain value** — they may be superseded as strategy but
   still preserve evidence, method, and empirical findings.
9. **Review lanes** — large PRs need semantic review boundaries, not merely long
   descriptions.
10. **Typed relationships are semantic, not merely tooling** — the graph model is
    the governance structure.
11. **Many-to-many is truth, not mess** — the goal is typed complexity, not false
    simplification.
12. **Folder paths navigate but do not fully govern** — semantic relationships
    must not live only in paths.
13. **State terms differ** — status, lifecycle, freshness, authority, evidence,
    and execution state must not collapse.
14. **Archive discipline is value-preserving** — reorganisation should express
    value more clearly, not discard it.
15. **Private/local strategic inputs need care** — the repo can derive from them
    without copying, quoting, or exposing them.
16. **Semantic model deserves its own home** — otherwise future agents must
    extract meaning from a delivery/enforcement plan.
17. **Governance is not bureaucracy here** — it protects a complex,
    multi-agent, multi-product repo from semantic drift.

## What this document preserves relative to the sibling plan

The sibling plan preserves delivery path, schema/validation direction,
`agent-tools` and graph tooling direction, phased implementation, and migration
notes.

This semantic model preserves ontology, why the model exists, authority
distinctions, many-to-many relationship logic, ideal information architecture,
lifecycle/state distinctions, correct/incorrect examples, GitHub/Linear semantic
boundaries, and the adversarial loss sweep.

Together they should let future agents continue the work without the originating
project context.

## Residual semantic questions

1. Which document types are canonical immediately, and which remain provisional?
2. Does `milestone` survive anywhere, or should product-specific gates all become
   `product_increment` / `release_gate`?
3. What is the canonical distinction between `thread`, `value_stream`, and
   `product` in metadata and indexes?
4. How should externally owned gates be represented when the repo tracks the
   hand-off but does not own resolution?
5. What authority-state vocabulary should apply to reports that are archived but
   still empirically useful?
6. How should local/private organisational strategy references be represented in
   traceability without exposing or copying them?
7. Should review lanes belong only to PR descriptions, or also to repo metadata
   for change proposals?
8. Which document becomes the canonical home for the document-type registry once
   this semantic model is ratified?

## Closing principle

The durable repo record should answer:

```text
What are we trying to change?
What strategy explains how?
What value streams carry that strategy?
What products and increments express value?
What plans define durable work intent?
What evidence supports claims?
What decisions constrain action?
What records preserve continuity and provenance?
What belongs in execution tooling rather than repo intent?
```

If those questions can be answered from repo documents alone, the governance
model is doing its job.
