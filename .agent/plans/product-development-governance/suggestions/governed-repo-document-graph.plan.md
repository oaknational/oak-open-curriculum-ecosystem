---
plan_id: governed-repo-document-graph
title: "Governed Repo Document Graph"
type: governance-delivery
status: future
lifecycle: future
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-20
related:
  - ../vision-strategy-and-plan-estate.plan.md
  - ../../high-level-plan.md
  - ../../../memory/operational/threads/strategy-and-plan-estate-holistic-review.next-session.md
  - ../../../../VISION.md
  - ../../../../docs/strategy/
  - ../../../../agent-tools/README.md
  - ../../../../packages/core/graph-core/README.md
  - ../../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md
  - agent-tooling/future/agent-graphs-workspace-organisation.plan.md
source_threads:
  - linear-conceptual-model
  - github-branch-review
  - governed-document-graph-discussion
summary: "Define and deliver a typed, schema-governed document graph for repo intent, strategy, planning, product increments, evidence, and Linear projection, with deterministic validation through agent-tools."
todos:
  - id: ratify-doc-type-registry
    content: "Define the canonical document types, each type's purpose, authority, allowed content, forbidden content, lifecycle, and schema home."
    status: pending
  - id: ratify-relationship-registry
    content: "Define the typed relationship registry: allowed edge names, source/target document types, cardinality, authority direction, and validation rules."
    status: pending
  - id: define-frontmatter-schemas
    content: "Create strict frontmatter schemas for governed document types, starting with strategy, thread, plan, product increment, report, ADR/decision record, and continuity record."
    status: pending
  - id: add-observe-mode-tooling
    content: "Add agent-tools observe-mode graph extraction and reporting for governed documents without failing CI."
    status: pending
  - id: add-warn-and-enforce-modes
    content: "Promote validators from observe to warn-on-new-drift and then enforce for ratified document classes."
    status: pending
  - id: define-linear-projection
    content: "Define the repo-to-Linear projection contract: repo owns durable intent; Linear owns assignment, timing, cycles, estimates, and live delivery state."
    status: pending
---

# Governed Repo Document Graph

## Purpose

This plan captures the useful outcomes of the Linear conceptual-model work, the
GitHub branch-review work, and the governed-document-graph discussion that
followed. It is intentionally placed as a sibling of the controlling
`vision-strategy-and-plan-estate.plan.md` because it serves the same
`strategy-and-plan-estate-holistic-review` thread but focuses on the repo's
document structure, relationship model, and deterministic enforcement.

The core proposal is that the repository becomes a **governed document graph**:

```text
Every durable item of intent is a typed node.
Every durable relationship is a typed edge.
Every node and edge conforms to a schema.
Every schema relationship is itself governed by a meta-schema.
Every claim of structure is deterministically checked by agent-tools.
Linear receives execution projections from that graph, but does not define it.
```

The first value is the governance model and document structure. Tooling follows
in phases. Do **not** block the conceptual record or file restructuring on full
validator implementation.

## Provenance and confidence

This document is a synthesis of owner direction and ChatGPT project discussion on
2026-06-20. It is **not** a completed first-hand repo survey and is not itself an
implementation proof. Future agents must verify repository state before
executing file moves, schema enforcement, or Linear projection.

Source discussions consolidated here:

1. **Linear Conceptual Model** — clarified the repo/Linear boundary, the
   multi-layer model of vision → strategy → threads → plans → execution, and the
   need to avoid treating product milestones as repo-global strategy.
2. **GitHub Branch Review** — used PR #213 on `docs/planning-and-validation` as
   a real stress test of the model; surfaced the need for review lanes and for
   PR descriptions to declare mixed governance/evidence/tooling/runtime scope.
3. **Governed Document Graph discussion** — added typed document definitions,
   frontmatter schemas, relationship schemas, cardinality rules, deterministic
   validation, visible reports, and phased delivery through `agent-tools`.
4. **Graph/tooling follow-up** — confirmed the repo already has graph substrate
   work and `agent-tools`; the plan should use those directions instead of
   inventing a parallel stack.

## Problem statement

The repo is no longer just a codebase with supporting docs. It is becoming a
strategy-bearing intent system for an open curriculum ecosystem, with three
co-equal value streams and a large plan estate. The current structure contains
valuable intent, evidence, decisions, plans, reports, runbooks, and continuity
records, but the relationships between those documents are still too easy to
express ad hoc.

That creates predictable failure modes:

- strategic intent drifts into plan prose without typed traceability;
- plans link to strategy, reports, products, and Linear in inconsistent shapes;
- product-specific milestones can look like repo-global strategy;
- many-to-many relationships are hidden in prose or folder placement;
- stale or archived documents can remain live dependencies by accident;
- PRs mix strategy, evidence, generated code, tooling, and runtime implications
  without declaring review lanes;
- Linear can become a second, competing source of truth for intent;
- agents can infer structure from local context and create new relationship
  forms without realising they are doing so.

The danger is not complexity. The danger is **untyped complexity**.

## Desired end state

The repo has a canonical, visible, deterministic model of its document graph:

```text
Organisation strategy
        ↓ informs
Repo vision
        ↓ constrains
Repo strategy
        ↓ organises
Threads / value streams / products / product increments
        ↓ generate
Plans
        ↓ project into
Linear execution objects
        ↑ report back
Evidence, completion, and delivery facts
```

The middle is a graph, not a tree. Threads, products, value streams, product
increments, reports, and plans are different projections over related work.
Many-to-many relationships are normal and should be represented explicitly.

## Operating principles

### Repo intent and Linear execution

The repo is the canonical system for durable intent:

- why the work matters;
- what strategy it serves;
- what durable work is needed;
- how plans relate conceptually;
- what evidence, decisions, and acceptance criteria exist;
- what value streams, products, and product increments the work supports.

Linear is the execution projection:

- assignment;
- timing;
- cycles;
- estimates;
- current issue/project status;
- delivery coordination;
- task-level work that does not need to be durable repo intent.

Linear can report state back into the repo, but it must not define the repo's
intent graph.

### Informational dependence is not execution order

The controlling model remains:

```text
Oak's strategy → our vision → our strategy → our planning
```

The arrows mean that downstream layers need upstream information to be authored
correctly. They do not impose a temporal freeze. Work that is safe without final
strategy boundaries may proceed, but it must be marked as such and not infer
authority from activity.

### Many-to-many is expected

Avoid false 1:1 structure. A plan may support multiple value streams. A product
increment may depend on multiple threads. A thread may contribute to multiple
products. A strategy choice may be implemented by multiple plans. A Linear
project may project several repo plans.

The goal is not to simplify the graph. The goal is to make the graph explicit,
typed, and valid.

### Folder paths are navigation, not the complete model

File paths remain important because humans and agents need a navigable repo.
However, folder placement must not be the only source of lifecycle, strategy, or
relationship truth. The canonical relationship model belongs in typed metadata
and validated graph edges.

## Document type model

Each governed document type needs a definition with:

- purpose;
- authority;
- allowed content;
- forbidden content;
- required frontmatter;
- allowed relationship fields;
- lifecycle rules;
- validation rules;
- canonical home or homes.

Initial document types to define:

| Document type | Purpose | Notes |
| --- | --- | --- |
| `vision` | Defines intended change in the world and the map to how. | Should not own delivery status, assignments, or detailed execution. |
| `strategy` | Defines theory of change, guiding choices, non-goals, and measures. | Must trace to vision and, where applicable, Oak strategy alignment. |
| `thread` | Groups strategy-organised work concepts and continuity. | Should orient agents without becoming the scope authority if a controlling plan exists. |
| `strategic_index` | Provides cross-collection orientation. | Should index; should not own execution detail when collection plans own it. |
| `plan` | Defines durable work intent, acceptance, dependencies, and proof. | Repo-owned; may project to Linear. |
| `product` | Defines a user-facing or reusable value surface. | Not every thread is a product. |
| `product_increment` | Defines a product-specific value gate, release gate, or readiness milestone. | Preferred replacement for overloaded repo-global "milestone" language. |
| `report` | Captures dated evidence, findings, method, and conclusions. | May become stale as strategy, but remains provenance. |
| `decision_record` | Captures a durable decision and consequences. | Includes ADRs and Practice decision records where applicable. |
| `runbook` | Defines an operational procedure. | Should not be treated as a plan unless it owns future work. |
| `evidence_record` | Captures validation results or proof artefacts. | May be generated or human-authored. |
| `continuity_record` | Provides session handoff / next-session orientation. | Should point to authority; should not itself become authority by drift. |
| `archive_record` | Preserves completed, superseded, or dated material with disposition. | Must retain provenance and supersession mapping where removed from live use. |

## Frontmatter schema model

Every governed document type should have a strict schema. Common fields will
likely include:

```yaml
id: string
title: string
doc_type: enum
status: enum
lifecycle: enum
last_updated: date
thread: optional string
relationships: object
```

Type-specific fields should be explicit. Example plan shape:

```yaml
plan_id: curriculum-mcp-widget-search-ui
title: "Curriculum MCP Widget Search UI"
doc_type: plan
status: active
lifecycle: current
primary_thread: curriculum-mcp-path-to-ga
related_threads:
  - sdk-and-mcp-enhancements
  - user-experience
value_streams:
  - teacher_mcp_app
  - ecosystem_engineering_tools
products:
  - curriculum_mcp_app
product_increments:
  - m2_public_alpha
supports_strategy:
  - strategy.teacher_mcp_app.reach_teachers_in_existing_ai_workflows
depends_on:
  - plan:mcp-app-host-ux-contract
evidenced_by:
  - report:mcp-app-live-product-readiness-2026-06-15
linear:
  projects:
    - LIN-123
  sync_policy: repo_intent_to_linear_execution
```

The exact syntax is not ratified here. The point to preserve is that the schema
must be strict, typed, and mechanically validated.

## Relationship type model

Relationships are typed graph edges, not arbitrary frontmatter keys or prose
links. Each relationship type needs:

- name;
- allowed source document types;
- allowed target document types;
- direction;
- cardinality;
- whether it is transitive;
- whether it is required for any document classes;
- whether it can target archived documents;
- whether it expresses authority, provenance, dependency, implementation, or
  execution projection.

Initial relationship registry candidates:

| Relationship | Meaning |
| --- | --- |
| `derives_from` | Upstream informational authority. |
| `supports` | Work supports a strategic choice, value stream, or product outcome. |
| `implements` | A plan implements part of a strategy, product increment, or decision. |
| `depends_on` | Work cannot be completed or authored correctly without another item. |
| `blocks` | Reverse dependency used for graph traversal and reports. |
| `evidenced_by` | Claim or plan is supported by a report, validation, or proof artefact. |
| `supersedes` | This item replaces prior material. |
| `superseded_by` | This item is replaced by named successor material. |
| `archives` | This item preserves material in dated/historical form. |
| `primary_thread` | Main conceptual thread for navigation and ownership. |
| `related_threads` | Additional threads touched by the work. |
| `belongs_to_product` | Work belongs to a product surface. |
| `belongs_to_product_increment` | Work belongs to a product release/value gate. |
| `projects_to_linear` | Repo intent projects to Linear execution objects. |
| `summarises_linear` | Repo records delivery facts reported back from Linear. |

## Relationship shape examples

Relationship shapes should be governed centrally. Examples:

```yaml
relationship_types:
  derives_from:
    from:
      - strategy
      - plan
      - product_increment
    to:
      - vision
      - strategy
      - decision_record
    cardinality: many_to_many
    direction: upstream_authority
    transitive: true

  supports:
    from:
      - plan
      - thread
      - product_increment
    to:
      - strategy
      - value_stream
      - strategic_choice
    cardinality: many_to_many
    direction: upward_traceability

  projects_to_linear:
    from:
      - plan
      - product_increment
    to:
      - linear_project
      - linear_issue
    cardinality: many_to_many
    authority: repo_to_linear
```

This is effectively the data-description schema of the relationships between the
document schemas.

## Graph invariants

The validator should eventually check invariants such as:

- every active plan traces to at least one strategic choice or explicit
  strategy-pending gate;
- every strategic choice traces to the repo vision;
- every repo vision element traces to Oak strategy alignment or an explicit
  non-alignment / non-goal decision;
- every product increment belongs to a product;
- product increments may support many value streams;
- every active plan has one primary thread and may have many related threads;
- no archived document is a live dependency unless the relationship type allows
  evidence/provenance targeting;
- removed, moved, or archived plans carry a disposition mapping;
- no relationship type appears unless it is in the relationship registry;
- no frontmatter field appears unless allowed by the document type schema or an
  explicit experimental escape hatch;
- no graph edge points to a missing node;
- no Markdown index claims a live plan that the graph cannot find;
- no Linear project is canonical unless it links back to a repo plan, product, or
  product increment;
- folder-derived lifecycle and frontmatter lifecycle do not contradict each
  other without an explicit migration note.

## GitHub PR review lanes

Large PRs should declare review lanes. PR #213 demonstrated the need: one branch
can legitimately bundle strategy surfaces, archived evidence, plan-estate
governance, SDK/spec-sync changes, UAT/runbooks, and agent-practice changes. That
is reviewable only if the reviewer knows which questions they are answering.

Candidate review lanes:

- strategy / authority surface;
- plan-estate governance;
- evidence archive / report method;
- generated code / schema sync;
- runtime behaviour;
- agent-practice doctrine;
- repo/Linear projection;
- migration / disposition integrity.

The PR description should state the lanes affected and the lanes intentionally
not affected.

## Tooling architecture

The repo already has relevant foundations:

- `agent-tools/` is the local TypeScript CLI workspace for agent operational
  tooling.
- `agent-tools` already has validator-style scripts, schema tooling, and CI
  drift-check patterns.
- `packages/core/graph-core/` provides graph primitives, JSON-LD wrappers,
  canonicalisation, and vocabulary registry.
- ADR-179 records that CLI surfacing for practice-graph or agent-side consumers
  belongs in `agent-tools/`.
- `agent-tooling/future/agent-graphs-workspace-organisation.plan.md` records a
  possible `agent-graphs/practice-graph/` library home with dependency direction:

```text
agent-tools -> agent-graphs/practice-graph -> graph substrate
```

This plan should follow that direction. Do not create a parallel graph/tooling
stack.

Initial tooling can be simple: parse frontmatter, build a graph, emit a visible
report. Deeper graph libraries and workspace dependencies can follow when the
model settles.

Likely command surface:

```bash
pnpm agent-tools repo-graph scan
pnpm agent-tools repo-graph validate
pnpm agent-tools repo-graph report
pnpm agent-tools repo-graph trace --from plan:curriculum-mcp-widget-search-ui --up
pnpm agent-tools repo-graph trace --from strategy:teacher_mcp_app --down
pnpm agent-tools repo-graph explain --node plan:curriculum-mcp-widget-search-ui
pnpm agent-tools repo-graph linear-export --dry-run
```

The CLI must follow existing `agent-tools` norms: complete `--help`, clear enum
values, useful invalid-input messages, deterministic output, and non-zero exits
where validation fails.

## Phased delivery strategy

### Phase 0 — Capture intent

This document is Phase 0. It preserves the model and prevents future sessions
from having to reconstruct the useful concepts from chat context.

### Phase 1 — Ratify governance vocabulary

Define the document type registry, relationship type registry, and initial graph
invariants. This can be docs-only and still has immediate value.

### Phase 2 — Define schemas

Add strict schemas for the first governed document classes. Start with the types
that matter most to the current repo transition:

- strategy;
- thread / continuity record;
- plan;
- product increment / release gate;
- report;
- decision record;
- archive record.

### Phase 3 — Observe-mode extraction

Add a deterministic graph extractor in `agent-tools` that reads governed
frontmatter, reports unknown fields and unknown relationship types, but does not
fail CI.

### Phase 4 — Warn on new drift

Fail or warn only for newly changed governed files, allowing historic drift to be
reported without blocking unrelated work.

### Phase 5 — Enforce ratified classes

Promote validated document classes to enforcement. Start narrow. Avoid enforcing
the entire historical estate in one step.

### Phase 6 — Linear projection

Define and implement repo-to-Linear export/sync rules after the repo graph model
is stable enough. Linear receives execution projections; it does not define the
graph.

### Phase 7 — Visible graph surfaces

Add reports and, if useful, graph visualisations showing:

- documents by type;
- active plans without strategy trace;
- orphaned relationships;
- archived documents still used as live dependencies;
- Linear objects without repo intent anchors;
- product increments and their supporting plans;
- value-stream coverage;
- migration progress by document class.

## Migration strategy

Do not attempt a whole-estate migration before the model is ratified. Use a
progressive approach:

1. define the schema vocabulary;
2. apply it to new or actively edited documents;
3. observe and report historic drift;
4. migrate high-value active plans first;
5. migrate strategy and product-increment surfaces;
6. migrate reports and archives where relationship integrity matters;
7. only then consider broad enforcement.

Every moved, removed, renamed, or archived document must preserve value via a
recorded disposition: re-housed, extracted, superseded, archived, or deleted with
explicit rationale. A removal without a disposition is a defect.

## Non-goals

- Do not make Linear the canonical source of repo intent.
- Do not make folder placement the only source of lifecycle or relationship
  truth.
- Do not require every historical document to be migrated before value is
  delivered.
- Do not create graph substrate code that depends on `agent-tools`.
- Do not leak CLI, MCP, HTTP, or stdio concerns into graph substrate packages.
- Do not flatten many-to-many strategy/product/thread relationships into false
  1:1 mappings.
- Do not make this plan a replacement for `vision-strategy-and-plan-estate.plan.md`.
  This plan is a sibling governance/delivery plan focused on document graph
  structure and enforcement.

## Open questions

1. What is the exact canonical home for the document type registry?
2. What schema language should be authoritative for frontmatter: JSON Schema,
   Zod, TypeScript types, or a generated combination?
3. Should relationship registries live in docs, code, or docs generated from code?
4. How much of the existing graph-core vocabulary should be reused immediately,
   versus starting with a plain repo-frontmatter graph and converging later?
5. What is the minimum set of document types to enforce first?
6. How should Linear IDs be represented before any API sync exists?
7. Should review lanes become part of PR template/frontmatter, a CI check, or an
   `agent-tools` advisory report first?
8. How should the model represent local-only or private reference material that
   informs strategy but must not be quoted, linked, or copied into the repo?

## Acceptance criteria

This plan is complete when:

- the governance model is ratified or amended by the owner;
- initial document types are defined with purpose, authority, and schema homes;
- relationship types are defined with allowed shapes and cardinality;
- the repo/Linear authority boundary is encoded in the model;
- an observe-mode `agent-tools` report can parse governed files and show graph
  drift visibly;
- enforcement can be phased without blocking unrelated repo work;
- future agents can continue this work from repo records without needing the
  original ChatGPT project context.
