---
title: 'External organising and stakeholder surfaces — repository, Linear, Notion, Slack, GitHub, Figma, and evidence systems'
type: report
status: exploration-informed-direction
stage: 'Repository-grounded exploration plus the owner-set audience and surface contract; connector architecture and automation remain undecided.'
date: 2026-07-13
audience: 'Oak engineering, product, design, delivery, and organisational stakeholders considering how OCE intent, execution, evidence, and stakeholder access cross system boundaries'
subject: 'The authority model, current plans, code/configuration, contradictions, gaps, and likely architectural direction for connecting OCE to Linear, Notion, and other organising or stakeholder surfaces'
thread: strategy-and-plan-estate-holistic-review
related:
  - docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md
  - docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md
  - docs/architecture/architectural-decisions/207-dora-delivery-metrics-as-a-structural-property.md
  - .agent/plans/product-development-governance/plan-node-schema.v0.md
  - .agent/plans/product-development-governance/current/planning-estate-rewrite.plan.md
  - .agent/plans/product-development-governance/active/plan-corpus-refounding.plan.md
  - .agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md
  - .agent/plans/product-development-governance/future/external-evidence-integration.plan.md
  - .agent/plans/agentic-engineering-enhancements/future/external-pointer-surface-integration.plan.md
  - .agent/plans/slack-assistants/current/ask-oisin.plan.md
---

# External organising and stakeholder surfaces

> **Status: exploration plus subsequent owner direction.** This report records what the repository
> says, what has actually been implemented, where the artefacts disagree, and what architectural
> model appears to be emerging. The owner has since settled the audience roles of Notion, Linear,
> PostHog, Sentry, the repo, and GitHub. The report still does **not** accept ADR-201, settle a final
> graph-to-Linear mapping, or author connector automation. Section 16 preserves the remaining
> architecture questions rather than treating them as decisions.

> **Disposition recorded 14 July 2026.** The audience contract described here is Accepted in
> [ADR-212](../../docs/architecture/architectural-decisions/212-federated-visibility-authority-and-evidence-boundaries.md).
> ADR-201 remains Proposed, and no automated idea graph, Linear projection, PostHog evidence, or
> cross-system evidence projection had landed at this snapshot. References below to draft PR #339
> preserve the exploration state rather than current delivery status. The
> [TAU collection index](../plans-backlog-2026-07/telemetry-and-understanding/README.md#current-status) is the
> canonical cross-surface status projection for TAU planning readiness, delivery authority, and
> implementation activity.

## Executive synthesis

The repository contains a strong and increasingly coherent architectural model for relating OCE to
external work-management, collaboration, evidence, and stakeholder surfaces. It does **not** yet
contain a functioning integration system.

The decisive model is:

> OCE's durable intent lives in the repository and, ultimately, its idea graph. External systems
> receive projections or own specialised live state; they report evidence back without acquiring
> authority over intent.

That direction is accepted for the intent substrate in
[ADR-200](../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md),
designed into the
[V0 plan-node schema](../plans-v0-sketch-2026-07-21/plan-node-schema.v0.md), and extended —
still only provisionally — by
[ADR-201](../../docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md)
for external evidence.

The central conclusion of this review is that **"connect the repo to Linear, Notion, and stakeholder
surfaces" is too solution-shaped**. The underlying problem is:

> How can each audience see, understand, coordinate, review, or evidence the work in its natural
> environment without creating another competing store of intent?

Once framed that way, the surfaces separate into distinct kinds:

| Kind | Surface | Role established or suggested by the current estate |
| --- | --- | --- |
| Canonical intent | OCE repository and future idea graph | Why, what, constraints, strategy, durable plans, decisions, interpretation, and generated cross-system delivery-performance projections |
| Execution coordination | Linear | Concrete delivery work, ownership, dependencies, sequencing, and execution progress |
| Delivery-performance evidence | ADR-207 generated DORA projection | Cross-system projection over the intent graph plus GitHub, Linear, deployment, and Sentry evidence; not owned by one external surface |
| Change readiness | GitHub pull requests | Diffs, reviews, checks, previews, and evidence for a proposed change |
| Design collaboration | Figma | Design source, interaction intent, design-system artefacts, and design review |
| Principal stakeholder visibility | Notion | Current state, intent, value, roadmap, milestones, status, Oak goal/strategy/OKR alignment, and curated evidence for non-engineering and senior stakeholders |
| Conversational internal access | Ask Oisín in Slack | Low-friction, read-only navigation and questions grounded live in the repo |
| Product usage evidence | PostHog | Observed usage, adoption, journeys, and behaviour once the TAU instrumentation work lands |
| Operational understanding | Sentry and OpenTelemetry | Errors, traces, regressions, operational health, and engineering diagnosis |
| Other specialised evidence | Sonar, Vercel, Elastic | Code-quality, deployment, and search/index facts interpreted against repo-owned intent |
| Potential public orientation | GitHub Projects, generated web views, or another public surface | Public roadmap or partner visibility, if that need becomes real |

The sources converge on this federated division rather than on a network of pairwise
synchronisations. It is not yet fully reconciled or ratified across the plan estate.

The most important tensions are:

1. an older Linear design maps threads to labels and session landings to issues, while the accepted
   V0 plan schema maps plans to Linear Projects and execution state back into the graph;
2. the older Linear design is one-way and best-effort in places, while ADR-201 proposes returning
   evidence, validated write-back, and declared supervision;
3. the repo has graph substrate and plans, but no Linear projector, connector, write-back path, or
   validator implementation;
4. Notion's historical MCP-adapter removal answers an implementation question, not today's
   stakeholder need: the owner has now established Notion as the principal non-engineering and
   senior-stakeholder visibility surface;
5. Ask Oisín remains a valuable conversational access surface, but its own plan exposes unregistered
   strategic and stream values that the plan-corpus refounding is intended to cure;
6. Figma is recognised as a real design-intent surface but has not yet received settled graph-edge
   semantics;
7. the audience roles are now settled at high altitude, while freshness, projection, and evidence
   mechanics remain less mature than the technical authority model.

## 1. Scope, method, and reasoning stance

### 1.1 Scope

This review searched and read the plans, reports, ADRs, directives, configuration, and code-adjacent
surfaces related to:

- Linear;
- Notion and the removed `oak-notion-mcp` workspace;
- GitHub pull requests and GitHub Projects;
- Slack and Ask Oisín;
- Figma;
- Sentry and OpenTelemetry;
- PostHog;
- SonarQube Cloud;
- Vercel;
- Elastic Cloud Serverless;
- the idea-graph, plan graph, and graph substrate that would connect these systems;
- the authority boundary between durable repo intent and external live state.

The review also searched for implementation evidence including `@linear/sdk`, `LINEAR_API_KEY`,
`mcp.linear.app`, `projects_to`, `@notionhq/client`, Slack app paths, and relevant plugin settings.

### 1.2 Reasoning method

This report applies the five outward moves from
[`oak-reason`](../skills/cognition/reason/SKILL-CANONICAL.md):

1. name the kind of problem;
2. frame the problem rather than presuppose a solution;
3. surface the warrant and falsifier;
4. distinguish reversible probes from expensive commitments;
5. stress-test for premature solutions, hidden values, abstraction drift, and local optimisation.

It also applies the inward questions from
[`oak-metacognition`](../skills/cognition/metacognition/SKILL-CANONICAL.md) and the
[metacognition directive](../directives/metacognition.md):

- what shape was inherited;
- whether that shape was ratified from first principles;
- whether it still fits the requested impact;
- what bridge connects action to impact;
- whether smooth, familiar answers such as "sync it to Notion" or "mirror it in Linear" are being
  accepted before their preconditions are checked.

The governing decision lenses are taken in order from
[`principles.md`](../directives/principles.md):

1. choose long-term architectural excellence;
2. strict and complete, everywhere;
3. ask whether it could be simpler without compromising quality or value;
4. ask whether changing the system dissolves the problem;
5. optimise for user value.

### 1.3 The kind of problem

This is not primarily an API-integration problem. It is a **socio-technical authority, projection,
and audience-design problem** across a complex institutional system.

The systems do not merely exchange data. Each surface has a different relationship to:

- authority;
- volatility;
- audience;
- action rights;
- auditability;
- privacy;
- failure;
- interpretation;
- and time.

A Linear issue being `In Progress`, a Figma frame describing an intended interaction, a PostHog
funnel recording behaviour, and an ADR defining architecture are not interchangeable facts. A
candidate integration architecture can be tested by whether it preserves those differences
rather than flattening them into a single generic "sync" concept.

### 1.4 The load-bearing warrant

The principal warrant behind the emerging design is:

> Durable product and engineering intent remains recoverable, versioned, reviewable, and
> structurally traceable in the repository. External systems handle live coordination, specialised
> collaboration, or observation without silently redefining that intent.

This warrant would be weakened if first-hand team use showed that repo-authored plans were not
human-usable, could not support normal product-management collaboration, or routinely lagged the
actual decisions being made elsewhere. The current architecture therefore still needs empirical
validation as a team forms and the external consumers become real.

## 2. Authority and maturity of the material

The relevant artefacts do not all have equal authority. Treating them as a flat corpus would create
false contradictions and revive superseded designs.

### 2.1 Accepted or active authority

#### ADR-200 — intent as a living idea graph

[ADR-200](../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)
is the architectural centre.

It decides that:

- ideas are the fundamental unit of intent;
- the idea graph is the authoritative machine-readable source;
- vision, strategy, streams, threads, and plans are human-navigable projections or curated
  traversals over regions of that graph;
- documents remain co-equal human embodiments rather than generated stubs;
- frontmatter carries the typed connection between prose documents and graph nodes;
- external evidence is separate from the substrate milestone;
- repo intent projects outward and service evidence later returns through a distinct integration
  decision.

ADR-200 places this substrate beneath any specific Linear or stakeholder-surface plan. Later
integration candidates are evaluated for composition with it rather than for establishing a
parallel planning model.

#### The V0 plan-node schema

The
[V0 plan-node schema](../plans-v0-sketch-2026-07-21/plan-node-schema.v0.md)
makes the Linear relationship concrete at the plan layer.

It states that:

- a plan carries durable work intent, not authorship or assignment;
- a plan consumes authority through `serves_strategic_choice` and `derives_from`;
- live execution state is not stored in durable frontmatter;
- live execution state is projected from Linear;
- a plan is approximately a Linear Project, not an epic issue;
- a strategic choice is approximately a Linear Initiative;
- workstreams or cycles map approximately to issues and sub-issues;
- `projects_to` is an outward projection edge from a plan to an external Linear Project;
- Linear never holds an authority edge into intent.

The current design's state decomposition explicitly separates:

- `kind`: whether intent is strategic or executable;
- `gate`: a temporary, expiring external or owner block;
- `disposition`: delivered, superseded, extracted-and-archived, or cancelled;
- execution status: `backlog -> in_progress -> done`, owned by Linear.

This cures the previous collapse of readiness, activity, blocking, and terminal state into one
hand-maintained status label.

#### ADR-207 — delivery metrics as a structural property

[ADR-207](../../docs/architecture/architectural-decisions/207-dora-delivery-metrics-as-a-structural-property.md)
is accepted and treats GitHub, Linear, Sentry, deployments, and the intent graph as joined parts of
a single delivery-measurement structure.

It is explicit that:

- GitHub is the change axis;
- Linear is the intent/execution-status axis;
- Sentry and OpenTelemetry contribute runtime and incident evidence;
- `projects_to`, `realized_by`, and evidence edges make attribution traversable;
- delivery metrics are defined as generated projections rather than hand-maintained dashboards;
- the Linear projection is designed and reserved but not built.

#### Current corpus refounding and planning-estate rewrite

The
[active plan-corpus refounding](../plans-backlog-2026-07/product-development-governance/active/plan-corpus-refounding.plan.md)
and
[current planning-estate rewrite](../plans-backlog-2026-07/product-development-governance/current/planning-estate-rewrite.plan.md)
are the current execution context.

The refounding precedes the full idea-graph build and aims to produce a lossless, strategy-aligned,
graph-ready corpus with:

- registered organising axes;
- mechanically recomputable state;
- explicit conservation proofs;
- destination lanes derived from vision and strategy;
- no ungoverned free-text stream or thread values.

This makes a stable, governed corpus a prerequisite for any external projection; otherwise the
current estate's drift would be encoded into Linear or another service.

### 2.2 Proposed and future architecture

#### ADR-201 — external systems as evidence edges

[ADR-201](../../docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md)
is proposed, not accepted.

Its proposed contract is one detailed general design for external systems:

- direction invariant: repo intent projects outward; services report evidence back;
- external state never becomes an authority edge into intent;
- evidence returns through typed edges such as `evidence`, `validated_by`, and `realized_by`;
- each integration declares a capability mode: `read`, `summarise`, `annotate`, or `mutate`;
- mutations carry an explicit supervision requirement;
- external identifiers and credentials remain out of version control;
- connectors and triggers feed validated write-back into the graph;
- persistence is reserved for evidence that earns it rather than for duplicated computable service
  state.

It is gated on the idea-graph substrate and an owner decision.

#### External-evidence integration plan

The
[future external-evidence integration plan](../plans-backlog-2026-07/product-development-governance/future/external-evidence-integration.plan.md)
turns ADR-201 into four gated workstreams:

1. evidence-edge schema;
2. read-first connectors;
3. triggers and validated write-back;
4. generated DORA and user-value projections.

It includes GitHub, Linear, Sentry/OpenTelemetry, Vercel, Sonar, and PostHog in its architectural
statement. Its detailed connector map, however, lists Vercel, Sentry, Sonar, GitHub, and PostHog but
omits Linear. That appears to be an incomplete decomposition rather than a settled exclusion,
because Linear remains required elsewhere for execution status and throughput.

### 2.3 Imported, subordinate design inputs

The
[product-development-governance collection README](../plans-backlog-2026-07/product-development-governance/README.md)
explicitly classifies the material under `suggestions/` as imported analysis rather than authority.
Those documents independently re-derived much of the accepted model. Their subordinate status
subjects them to verification and disposition rather than wholesale adoption.

The most detailed imported model is
[`service-authority-and-operating-contexts.semantic-model.md`](../plans-backlog-2026-07/product-development-governance/suggestions/service-authority-and-operating-contexts.semantic-model.md).
It states the useful three-way distinction:

```text
Repo documents define durable intent.
Linear coordinates execution.
GitHub PRs aggregate review and readiness for proposed changes.
```

It also gives Figma, Sentry, PostHog, Sonar, Elastic, deployments, and AI agents distinct authority
boundaries and records the risk of turning the repo into a stale second dashboard.

The
[`governed-repo-document-graph.plan.md`](../plans-backlog-2026-07/product-development-governance/suggestions/governed-repo-document-graph.plan.md)
provides useful candidate graph relationships such as `projects_to_linear` and `summarises_linear`,
but its document-graph framing predates the later accepted ADR-200 idea-graph architecture.

The
[`repo-intent-and-service-knowledge-boundaries.proposal.md`](../plans-backlog-2026-07/product-development-governance/suggestions/repo-intent-and-service-knowledge-boundaries.proposal.md)
usefully names the need to preserve service boundaries, stakeholder access, Figma, and a recurring
loss-prevention test. It remains a proposal record.

### 2.4 Historical or materially stale material

The
[future external-pointer-surface plan](../plans-backlog-2026-07/agentic-engineering-enhancements/future/external-pointer-surface-integration.plan.md)
contains valuable reasoning but has been overtaken by later architecture in significant respects.

Its primary mapping is:

- thread -> Linear label;
- landing -> Linear issue;
- repo -> existing Linear project;
- navigation -> one Linear Document;
- emission -> session-handoff event;
- direction -> repo to Linear only.

That design exposes the former thread/session continuity model. It differs from the accepted V0
schema, which centres:

- strategic choice -> Initiative;
- plan -> Project;
- workstream/cycle -> issue or sub-issue;
- external execution state -> returning graph projection.

The older plan still contributes thread labels as possible cross-project classification and finite
landing issues as possible evidence. How those concepts reconcile with the accepted plan-graph
design remains a later mapping decision.

## 3. The emerging authority model

The repository is converging on a layered system:

```text
                    OCE intent graph
                         |
          +--------------+-----------------+
          |              |                 |
   human documents   execution         stakeholder
   in the repo       projection         visibility
          |              |                 |
   vision/strategy     Linear          Notion / Slack
   streams/plans         |             navigation
          |              |
          +------ GitHub changes ---------+
                         |
                  deployed products
                         |
       Sentry / PostHog / Vercel / Sonar / Elastic
                         |
                  returning evidence
                         |
                    intent graph
```

This assigns different kinds of truth rather than claiming every service is or is not a "source of
truth":

| Truth or authority kind | Proper surface |
| --- | --- |
| Normative product and engineering intent | Repo documents and idea graph |
| Live delivery coordination | Linear |
| Proposed code/document change and review | GitHub |
| Design source and design collaboration | Figma |
| Runtime error, trace, and incident facts | Sentry and OpenTelemetry |
| Deployment facts | Vercel or other deployment platforms |
| User behaviour and adoption facts | PostHog |
| Static code-quality facts | Sonar |
| Search and index operational facts | Elastic |
| Principal narrative/status visibility for non-engineering and senior stakeholders | Notion |
| Low-friction conversational access to repo knowledge | Slack / Ask Oisín |

The core design principle is not that the repo contains every fact. It is that the repo contains the
semantic and authority model by which specialised facts are interpreted and connected to durable
intent.

## 4. Linear

### 4.1 Intended role

The repo is consistent at high altitude:

- OCE owns durable intent, strategy, scope, constraints, acceptance, and relationships;
- Linear serves engineers, engineering managers, product managers, and delivery colleagues;
- Linear owns concrete steps, assignment, dependencies, sequencing, cycles, estimates, current
  execution state, and progress visibility;
- Linear supplies execution-state evidence to the ADR-207 generated DORA projection, but does not
  own delivery-performance truth;
- Linear may report state back into the graph;
- Linear does not define the plan, strategic choice, or acceptance contract.

The V0 schema and imported design inputs surface one mapping candidate for evaluation:

```text
strategic choice  ~= Linear Initiative
plan              ~= Linear Project
workstream/cycle  ~= Linear issue or sub-issue
```

The approximation marks a comparison constraint: a mapping that distorts repo graph concepts to
match current vendor primitives would change the authority model.

The current live Linear project is a pathfinder container for this programme. It is evidence that a
project-level delivery surface is useful; it does not establish a universal one-to-one mapping from
plans to Linear Projects.

### 4.2 Semantic comparison: plan -> Project and thread -> label

A plan is goal-bearing and contains executable work. A Linear Project is also goal-bearing and
contains issues. The lifetimes and semantics align.

A thread is a continuity and navigation concept that may span many plans and products. A Linear
label can classify issues across projects, but it cannot carry the full durable scope or acceptance
of a thread. These similarities and differences produce considerations rather than a selected
mapping:

- plan -> Project aligns two goal-bearing containers;
- thread -> label preserves classification across projects;
- landing -> issue could provide a finite evidence record, with its ontology effect unresolved;
- current workstreams, todos, and the session boundary are alternative issue granularities to test.

### 4.3 Existing implementation evidence

The current repository contains no automated Linear projection or reconciliation implementation.
It does contain a live manually maintained Linear project, a tracked pull-request linkage contract,
and plugin enablement for agent-side Linear access. Those surfaces establish manual linkage and
tracked enablement; they do not establish automated projection, reconciliation, or installation and
authentication in a particular contributor environment.

Present:

- the Cursor plugin setting enables `linear` in [`.cursor/settings.json`](../../.cursor/settings.json);
- [`.claude/settings.json`](../../.claude/settings.json) enables
  `linear@claude-plugins-official`, and the contributor README documents its installation and
  authentication boundary;
- [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md) requires a Linear
  relationship, while [`CONTRIBUTING.md`](../../CONTRIBUTING.md) documents the GitHub integration;
- the graph foundation exists in
  [`packages/core/graph-core`](../../packages/core/graph-core/README.md) and
  [`packages/libs/graph-ingest`](../../packages/libs/graph-ingest/README.md);
- the V0 plan schema reserves the `projects_to` edge vocabulary;
- plans and ADRs describe future connectors and projections.

Not found:

- product code importing `@linear/sdk`;
- a `LINEAR_API_KEY` integration outside the old future plan;
- an implemented `mcp.linear.app` configuration;
- an implemented validator schema or runtime projection for `projects_to` beyond that V0
  vocabulary reservation;
- a Linear projector or exporter command;
- a Linear connector under `agent-tools`;
- validated write-back;
- a GitHub workflow performing reconciliation;
- an implemented stale-pointer or projection-integrity validator.

The older plan claims that the Linear MCP plugin was already wired in both Cursor and Claude. The
current tracked settings now demonstrate Linear plugin enablement in both agent environments. They
do not prove that the plugin is installed, authenticated, or live in any particular contributor
session; that remains environment-specific runtime evidence.

### 4.4 Open architectural questions

#### Projection cardinality

The V0 plan schema currently gives `projects_to` cardinality `0..1`. The earlier governed graph
proposal expected many-to-many relationships.

Both shapes are plausible:

- one plan -> one Linear Project is simpler and semantically clean;
- one project may legitimately coordinate several repo plans;
- one large repo plan may require several projects across teams or phases;
- a product increment may cut across multiple plans and projects.

This remains to be settled from actual team and Linear usage rather than by abstract preference.
The first real consumers are a cheap probe; schema strictness depends on that grounding.

#### Stable external identity without PII or secrets

The repo needs a precise distinction among:

- public or safe external object references;
- opaque service IDs;
- organisation identifiers;
- personal identifiers;
- credentials and secrets.

"No PII in version control" is necessary but insufficient as a complete identity contract. A
durably resolvable graph edge requires a safe, stable reference representation plus a local or
service-side resolver.

#### Write mechanism

The old design relies on an agent emitting Linear state during session handoff. That rides an
existing action surface, but it still depends on conversational workflow and agent compliance.

The graph architecture supplies one candidate for evaluation:

- derive the intended external projection from typed plan nodes;
- compute the desired-state delta;
- present supervised mutations;
- apply mutations through one canonical command path;
- validate the resulting external relationship;
- make reconciliation idempotent and rerunnable.

If ratified and proven, this shape would make session handoff a trigger rather than the owner of
Linear semantics. A service-native workflow with explicit repo references remains an alternative
to compare against it.

#### Failure semantics

The old plan permits skipped emissions on MCP timeout and warning-only freshness checks. That is in
tension with current doctrine:

- strict and complete;
- no warning toleration;
- fail fast;
- no silent fallback;
- every issue earns a check.

A later design needs explicit failure behaviour. Plausible questions include:

- does a failed projection block the handoff or queue a durable recovery item?
- where is the uncommitted mutation represented?
- how is idempotency proven?
- how is partial success rolled forward without duplicate projects or issues?
- what evidence proves the external state now matches the graph projection?

#### Ownership of execution status

The V0 model says Linear owns live status. The current plan folder taxonomy still contains
`active/` and `current/`, and the root plans README still describes them as separate execution
lanes. The V0 schema explicitly intends to collapse that distinction once the projection is real.

Until Linear is actually a dependable consumer, removing all repo execution orientation could make
the repo less usable. Architecture and migration sequencing are distinct but coupled decisions: the
target direction is recorded, while the current repo still needs a legible interim execution
surface.

## 5. Notion

### 5.1 Owner-established role and audience

Owner direction on 2026-07-13 establishes Notion as the **principal visibility surface for
non-engineering stakeholders**, especially the most senior stakeholders. The MCP Pathfinder area
already contains roadmap and release-planning material; the missing piece is one coherent,
leadership-altitude account of the project. That account now exists as
[MCP App — Strategy, Intended Impact, and Current Direction] (internal Notion page; link redacted 2026-07-21 by the Notion strategy-page fence — the page remains owner-held).

That account's stated job is to make the following legible without requiring GitHub or Linear
fluency:

- the project's intent and intended value;
- how it supports Oak's goals, strategy, and current OKRs without inventing or restating them;
- current project state and a dated status;
- the delivery roadmap and milestones;
- material dependencies, risks, and decisions;
- what evidence exists now and what evidence is still expected.

### 5.2 Authority, evidence, and freshness contract

Notion is a curated stakeholder narrative, not a second planning authority. It synthesises and
links to the surfaces that own each fact:

| Notion statement | Owning evidence surface |
| --- | --- |
| Intent, value, strategy alignment, scope, and constraints | Repository vision, strategy, plans, and decisions |
| Work, dependencies, ownership, and execution progress | Linear, with GitHub change/readiness evidence where relevant |
| Delivery performance | ADR-207 generated projection over the intent graph plus GitHub, Linear, deployment, and Sentry evidence |
| Product usage, adoption, journeys, and behaviour | PostHog after the TAU instrumentation work lands |
| Errors, traces, regressions, and operational health | Sentry and OpenTelemetry |
| Value and impact | Interpretation across product/operational evidence plus research, evaluation, curriculum evidence, and Oak-owned outcomes |

The status-page contract includes its evidence date, current limits, next refresh condition, and
source links. A manual curated page is the current mechanism because the audience and narrative are
real while automated projections do not yet exist. The same authority boundaries constrain any
later automation intended to reduce freshness risk.

### 5.3 Historical adapter work is a separate question

[ADR-004](../../docs/architecture/architectural-decisions/004-no-direct-notion-sdk-usage.md) records
why the former `oak-notion-mcp` product workspace was removed and preserves an anti-corruption
principle for any future adapter. That implementation history does not answer whether stakeholders
need a Notion communication surface.

The still-valid engineering lesson is to isolate vendor SDKs behind OCE-owned contracts and prevent
Notion vocabulary from leaking into the intent model. Creating and curating a stakeholder page does
not require reinstating the removed product workspace or making Notion an authority over repo
intent.

## 6. GitHub and pull requests

GitHub has a clear role as the proposed-change and readiness aggregation surface.

A pull request naturally aggregates:

- commits and diffs;
- human review;
- AI review;
- quality gates;
- deployment previews;
- plan and strategy references;
- Linear project or issue links;
- Figma design references;
- Sentry or PostHog evidence where relevant;
- release-readiness context.

The imported service-authority model correctly says that GitHub does not own delivery priority or
durable strategy. It owns the proposed change and the evidence needed to decide whether that change
is ready to merge.

The governed-document-graph proposal additionally suggests explicit review lanes for mixed PRs,
including:

- strategy and authority;
- plan-estate governance;
- evidence and report method;
- generated code and schema sync;
- runtime behaviour;
- agent-practice doctrine;
- repo/Linear projection;
- migration and disposition integrity.

The proposal enumerates these lanes, but the review did not find a fully operationalised typed
PR-readiness contract or a repo-wide PR template implementing them.

GitHub is also the change axis in ADR-207. It joins intent to commits and pull requests, then to
deployments and incidents through `realized_by` and evidence relationships. Whether GitHub Projects
adds a distinct audience job beyond that change axis and Linear remains an open consideration.

## 7. Slack and Ask Oisín

### 7.1 The conversational access surface

[Ask Oisín](../plans-backlog-2026-07/slack-assistants/current/ask-oisin.plan.md) is a planned answer to low-friction
conversational access to internal repo knowledge. It complements Notion's principal stakeholder
narrative rather than replacing it.

Its design is deliberately not a new source of truth:

- it serves internal Oak staff;
- it answers questions about OCE, the repo, strategy, planning, and the Practice;
- it reads the live repository through the official remote GitHub MCP;
- it is read-only at the repository boundary;
- it does not vendor or copy the repo corpus;
- Slack renders the conversation, but the repo remains the grounding source.

The planned design aims to make the canonical substrate more accessible without forking it.

### 7.2 Current implementation state

The plan is decision-complete and queued, but the workstreams remain pending. Searches for the
planned `apps/slack/ask-oisin` path find the plan and design record rather than landed app code.

The plan includes:

- shared `ai-gateway` and `slack-assistant` libraries;
- live GitHub MCP attachment;
- a strict PII egress boundary;
- internal installation allow-listing;
- rate limiting and retry de-duplication;
- Sentry observability;
- deployment and live validation;
- documentation and readiness review.

### 7.3 Governance signal exposed by the plan

The Ask Oisín frontmatter currently says:

- `strategic_choice: "n/a — new surface domain"`;
- `serves_stream: "agentic surfaces over Oak's MCPs (new; no parent stream record yet)"`.

The planning-estate rewrite explicitly identifies unregistered `serves_stream` and orphan thread
values as defects. It requires every organising axis to have a registry and reference-integrity
validation.

This does not show that Ask Oisín is strategically wrong. It shows that a real new stakeholder
surface has arrived faster than the current strategy and planning taxonomy can place it. The plan
is therefore useful evidence for the refounding's lane and strategic-choice work.

### 7.4 Broader implication

Ask Oisín is a concrete planned example of a general class:

> stakeholder read models and conversational projections over the canonical graph.

That class could later include:

- Slack assistants;
- generated leadership briefs;
- public project explainers;
- onboarding navigators;
- role-specific status views;
- question-answering interfaces over strategy, plans, and evidence.

The shared architectural requirement is that these surfaces remain grounded, attributable, and
read-oriented unless a separate supervised command capability is explicitly designed.

## 8. Figma

The imported service-authority model gives Figma a coherent role:

- visual design intent;
- interaction flows;
- component variants;
- responsive behaviour expectations;
- design-system artefacts;
- design comments and collaboration state.

It also correctly denies Figma authority over:

- implemented behaviour;
- runtime truth;
- repo strategy;
- code-level accessibility proof;
- release readiness by itself.

The product-development-governance collection README says Figma is a real near-term need as a team
and designer arrive, and stages projection tooling after those consumers exist.

The unresolved issue is that Figma is not simply another evidence service:

- within design work, it may carry normative design intent;
- when implementation begins, it becomes an input and acceptance reference;
- after implementation, previews and tests provide evidence back to design review;
- design comments are live collaboration state;
- some design-system contracts may need a machine-readable canonical form shared with code.

ADR-201's first-cut external-system list does not include Figma, and the external-evidence plan does
not assign it a connector. Whether Figma participates through several distinct edge families rather
than one generic `evidence` relationship remains a later architecture question, for example:

- `designed_by` or `design_source`;
- `implements_design`;
- `reviewed_against`;
- `validated_by` for accessibility or preview evidence;
- a collaboration-state link that is not durable intent.

Those names are illustrative only; the vocabulary remains to be grounded and ratified rather than
invented by this report.

## 9. Operational, quality, analytics, and evidence systems

### 9.1 Sentry and OpenTelemetry

Sentry and OpenTelemetry own runtime error, trace, performance, and incident facts. Sentry is both
an evidence source and a first-class specialist surface through which engineers and operational
stakeholders understand the running product. It does not own product priority or strategy. Its
evidence can:

- identify failures;
- measure change-failure and recovery behaviour;
- attach incidents to product increments;
- inform engineering plans;
- contribute to release and operational decisions.

The observability estate is the most developed external evidence foundation, but the full
intent-to-runtime graph loop is not yet built. A senior-stakeholder Notion summary may curate a
health statement from Sentry; operational diagnosis still belongs in Sentry itself.

### 9.2 PostHog

PostHog's owner-set role is the first-class product-usage surface: observed usage can include
adoption, repeat use, tool/flow use, outcomes, and abandonment where the event contract establishes
those facts safely.

That visibility depends on the instrumentation and question-to-decision work proposed by the draft
TAU programme in [PR #339](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/339).
PR #339 owns the runtime question -> typed signal -> privacy projection -> delivery -> analysis ->
review -> decision -> remeasurement mechanics. This report owns the neighbouring audience and
surface boundary and does not restate TAU's event, identity, dashboard, or interpretation semantics.

PostHog is not a strategy or impact authority. It observes product behaviour. The repo defines the
intended value and decision context, while research, evaluation, curriculum evidence, and Oak-owned
outcome measures remain necessary to establish impact.

### 9.3 Vercel and deployments

Deployment systems own environment and deployment facts. They can supply:

- deployment frequency;
- production transition times;
- failed deployment events;
- preview links;
- environment state.

They do not define product intent or release acceptance by themselves.

### 9.4 Sonar

Sonar supplies static code-quality and vulnerability findings. It is evidence within an engineering
policy boundary, not an independent product or architecture decision maker.

A finding becomes meaningful through repo doctrine and the affected change context. The quality
gate may block a PR because repo policy says it does, not because the service acquires authority over
intent.

### 9.5 Elastic

Elastic owns search/index/query operational state and retrieval evidence. It can support search
quality and system diagnosis, but relevance metrics do not become product success without user and
curriculum context.

### 9.6 The common evidence contract

The proposed common pattern is:

```text
repo intent -> work and product change
external system -> observed fact
observed fact -> typed evidence edge
repo-owned interpretation -> decision, learning, or new intent
```

This differs from copying dashboards into reports by preserving source authority while making
evidence structurally traversable.

## 10. GitHub Projects, public roadmaps, and other public surfaces

The old external-pointer-surface plan considered a GitHub Project and rejected it for the current
internal-visibility need:

- Linear is the chosen internal execution surface;
- commits and PRs already provide GitHub-native change state;
- another project board would duplicate rather than add;
- every extra surface creates sync, drift, and attention costs.

It leaves a clear reopening trigger: a future need for a **public roadmap** visible to external
partners, curriculum organisations, or community contributors.

That remains a legitimate unmet surface. The later decision needs to frame it by audience need
rather than by the availability of GitHub Projects. Candidate public read models could include:

- a generated GitHub Project;
- a generated web roadmap;
- GitHub Discussions;
- a public subset of graph projections;
- milestone and product-increment pages.

The essential constraints would be:

- no private planning or personal execution data;
- clear provenance to public repo intent;
- generated rather than manually mirrored state where possible;
- no accidental commitment language;
- accessibility and comprehensibility for non-engineering audiences.

## 11. Code and configuration inventory

### 11.1 Foundations present

- [`packages/core/graph-core`](../../packages/core/graph-core/README.md): RDF/JS-aligned terms,
  datasets, JSON-LD, canonicalisation, and vocabulary registry.
- [`packages/libs/graph-ingest`](../../packages/libs/graph-ingest/README.md): reusable graph ingestion
  modes and source mapping.
- Plan and idea-graph architecture in ADR-200 and the current rewrite plan.
- Reserved plan-layer `projects_to`, `realized_by`, and `validated_by` edges.
- Cursor plugin enablement for Linear, PostHog, Sentry, Vercel, and other services.
- Claude plugin enablement for `linear@claude-plugins-official`,
  `sentry@claude-plugins-official`, `mcp-server-dev@claude-plugins-official`, and
  `sonarqube@claude-plugins-official`.
- Slack assistant design and executable plan.

### 11.2 Important implementation absent

- no idea-node JSON Schema or idea-graph domain SDK yet;
- no plan projection runtime;
- no Linear client or connector;
- no Linear desired-state calculation;
- no Linear mutation command;
- no Linear reconciliation validator;
- no implemented external-node/evidence-edge validator or runtime schema beyond the edge vocabulary
  reserved by the V0 plan layer;
- no connector/triggers/write-back implementation;
- no DORA graph projection;
- no PostHog-to-`validated_by` implementation;
- no Figma connector or edge contract;
- no automated Notion projection or connector; the owner-set stakeholder role is currently served
  through curated pages;
- no Ask Oisín app code yet;
- no generated public stakeholder surface.

The architecture is therefore intentionally ahead of the implementation. Current-state language
remains future-tense wherever the consuming runtime does not exist.

## 12. Contradictions, drift, and unresolved overlaps

| Tension | Earlier shape | Later shape | Current assessment |
| --- | --- | --- | --- |
| Linear primary mapping | Thread -> label; landing -> issue; one repo project | Strategic choice -> Initiative; plan -> Project; workstream -> issue | Reconcile through real consumers; V0 reserves the relationship but does not settle every cardinality or mapping |
| Data direction | Repo -> Linear only | Intent projects outward; execution/evidence reports back | Older non-goal is overtaken by ADR-201 direction, subject to ratification |
| Trigger ownership | Session handoff emits updates | Graph-derived desired state, connectors, triggers, validated write-back | Trigger choice and semantic ownership remain distinct decisions |
| Failure behaviour | Skip on MCP timeout; warnings initially | Strict, complete, no warning toleration, fail-fast | Old fallback/warning shape is not compatible with current doctrine |
| Cardinality | One existing repo project; thread labels | V0 `projects_to` 0..1 | Requires testing against real team/project structure; many-to-many remains plausible |
| Linear plugin state | Claimed wired in Cursor and Claude | Tracked config enables Linear in both environments | Tracked enablement is confirmed; live installation and authentication remain unproven |
| Graph authority | Governed document graph | Living idea graph with documents as projections | ADR-200 supersedes document-as-fundamental framing |
| External service model | Peer pointer surface | Typed projection and evidence edges | The sources converge on this direction, but ADR-201 and the connector contract remain proposed |
| Figma | Design source in imported semantic model | Omitted from ADR-201 connector map | Needs separate ratification and likely more than one edge family |
| Ask Oisín strategy placement | New unregistered stream; no strategic choice | Registered axes and mandatory traceability | Input to refounding; not proof that the surface is invalid |
| Notion | Former MCP product forcing function | Principal non-engineering and senior-stakeholder visibility surface | Keep stakeholder communication separate from the removed product adapter and from repo authority |
| Execution state in repo | `active/` and `current/` folders | Linear-owned execution status; future folder collapse | Target decided, migration dependent on dependable projection |

## 13. Assessment through the decision lenses

### 13.1 Long-term architectural excellence

The accepted substrate, owner-set audience boundaries, and proposed external-system designs
**converge on** one canonical intent graph with purpose-specific projections, commands, and
evidence connectors rather than a mesh of independent pairwise synchronisations. This is an
inference from the sources, not a claim that ADR-201 or its connector mechanics are accepted.

The convergent candidate treats each external integration as an adapter over OCE-owned contracts.
In that candidate, Linear, Slack, Figma, GitHub, and evidence systems do not force vendor concepts
into the core intent model; this remains an inference to evaluate, not a ratified connector design.

### 13.2 Strict and complete

Every external relationship eventually needs a typed contract covering:

- actor;
- operating context;
- source and target;
- data direction;
- capability mode;
- authority effect;
- supervision;
- safe external identity;
- failure semantics;
- idempotency;
- reconciliation;
- validation;
- persistence or derivation policy;
- privacy and audit behaviour.

The accepted strictness doctrine rules out best-effort copying and "remember to update the other
tool" as terminal states.

### 13.3 Could it be simpler without compromising quality or value?

The simplicity lens distinguishes each surface by a unique audience job:

- Linear earns its place through execution coordination.
- GitHub earns its place through changes and readiness.
- Notion earns its place through principal narrative/status visibility for non-engineering and
  senior stakeholders.
- Slack earns its place through low-friction conversational access.
- Figma earns its place through design collaboration.
- Evidence systems earn their place through specialised observation.
- GitHub Projects does not yet have a documented distinct internal role.

Simplicity does not mean reducing capability. It means avoiding redundant editable authorities.

### 13.4 Would it be simpler if the system changed?

Potentially. The key system-level hypothesis is to stop treating the problem as document and ticket
synchronisation. The current sources suggest evaluating:

- one canonical graph;
- typed projections into operational systems;
- supervised command paths for mutation;
- generated read models for audiences;
- returning evidence edges;
- deterministic and semantic reconciliation at the right boundaries.

This dissolves much of the sync problem rather than managing its symptoms.

### 13.5 Optimise for user value

The owner-set audience map frames every surface by an audience and a decision or task:

- what does a delivery lead need to coordinate?
- what does an engineer need during implementation?
- what does a designer need to author and review?
- what does an Oak stakeholder need to understand?
- what does a partner or contributor need to see?
- what evidence is needed to know the work benefited teachers?
- what can an agent safely read or change in each context?

The repo is highly developed around architecture, graph modelling, and agent operation. The owner
has now settled the high-altitude audience map for Notion, Linear, PostHog, Sentry, GitHub, and the
repo. Per-audience decisions, disclosure, cadence, and language still need to be maintained in the
individual surfaces.

## 14. Current model and candidate future decomposition

The following is an interpretation of the emerging architecture, not a ratified design:

### Layer A — canonical intent

- idea graph;
- human documents as co-equal projections;
- strategy, choices, plans, decisions, acceptance, and interpretation;
- stable identifiers and registered vocabularies.

### Layer B — command and execution projection

- plan -> Linear Project;
- workstream/todo -> issue or sub-issue;
- strategic choice -> Initiative where useful;
- thread labels as cross-project classification where earned;
- supervised, idempotent desired-state reconciliation.

### Layer C — change and readiness

- GitHub commits and PRs;
- typed links to plans and external execution objects;
- review lanes and required checks;
- previews and evidence aggregation.

### Layer D — specialised collaboration

- Figma for design intent and design collaboration;
- Slack for questions and access;
- service-native annotations where the object of work belongs to that service.

### Layer E — specialist observation and understanding

- PostHog for product usage and behaviour after TAU instrumentation;
- Sentry/OpenTelemetry for operational health and engineering diagnosis;
- Sonar, Vercel, and Elastic for their specialised evidence;
- source-owned facts represented by typed external nodes or resolvable references;
- generated summaries and returning evidence.

### Layer F — stakeholder visibility and access

- Notion as the principal non-engineering and senior-stakeholder narrative;
- Ask Oisín;
- generated reports;
- leadership or team views;
- public roadmaps if later required;

The proposed sources converge on a reusable mechanism across Layers B–F that is generic where the
principles require it, with thin OCE-specific configuration and interpretation. Its final boundary
remains to be ratified.

## 15. Principal gaps

### Gap 1 — no single accepted service-boundary ADR

ADR-200 is accepted for the substrate, but ADR-201 remains proposed. The imported service-authority
model is broader than ADR-201 and includes Figma, stakeholder surfaces, and operating contexts. The
repo therefore has a coherent direction but not yet one accepted, complete cross-service authority
contract.

### Gap 2 — Linear design is split across eras

The old pointer-surface plan, V0 schema, ADR-201, ADR-207, and the external-evidence plan each hold a
part of the Linear model. No current artefact reconciles them all.

### Gap 3 — audience roles are settled; operating contracts are incomplete

The owner has settled the principal surface roles, but each surface still needs an explicit
freshness, disclosure, decision, and language contract. "Stakeholders" still spans:

- Oak leadership;
- product and delivery colleagues;
- engineers;
- designers;
- curriculum experts;
- partner organisations;
- public contributors;
- adopters of the Practice;
- external developers;
- auditors or governance reviewers.

Those audiences need different altitudes, disclosure, cadence, interaction, and language. The
Notion page begins the senior/non-engineering contract; it does not resolve every audience.

### Gap 4 — no implementation bridge from graph architecture to service adapters

The repo has generic graph substrate, but the idea graph, plan projection SDK, external-node model,
safe identity resolver, command architecture, and connector framework are not built.

### Gap 5 — no settled Figma semantics

Figma is acknowledged but does not fit neatly into the existing evidence-only framing.

### Gap 6 — Notion needs a durable freshness and provenance practice

The problem statement now exists: senior and non-engineering stakeholders use Notion as their
principal visibility surface. The remaining gap is preventing a curated page from drifting from
repo intent, Linear delivery state, PostHog usage evidence, and Sentry operational evidence while
keeping the narrative legible.

### Gap 7 — PR #339 is an adjacent draft authority, not content for this report to absorb

Draft [PR #339](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/339) proposes TAU
as the runtime question-to-evidence-to-decision programme. The coordinated boundary is:

- this report and PR own audience/surface contracts and organisational visibility;
- TAU owns runtime questions, typed signals, privacy projections, delivery, analysis,
  interpretation/review, decisions, and remeasurement;
- Linear delivery coordination, Notion stakeholder presentation, and future idea-graph evidence
  edges remain neighbouring authorities outside TAU.

PR #339 has confirmed that it consumes this audience boundary while remaining draft pending PR
#341's landing. PR #341 does not reproduce TAU's event, identity, dashboard, or interpretation
semantics.

### Gap 8 — current plans can predate the registered strategy axes they need

Ask Oisín demonstrates the practical consequence: valuable new work can appear before the planning
corpus has a legal strategic or stream value for it. Preserving that signal rather than forcing the
plan into an incorrect existing category is a refounding requirement.

### Gap 9 — execution migration sequencing remains unresolved

One proposed migration removes hand-maintained repo execution state in favour of Linear projection.
The current repo still depends on folder and continuity cues, so dependable transition sequencing is
an unresolved consideration.

## 16. Decision questions and considerations for later owner-governed work

The exploration raised the following questions. They are neither actions authorised by this report
nor conclusions disguised as recommendations.

1. **Which evidence governs the final Linear mapping?** ADR-200 and the V0 vocabulary provide the
   accepted substrate, while the live pathfinder project provides consumer evidence; the older
   pointer-surface plan remains an input whose useful findings may need harvesting.
2. **Which findings from the old Linear plan remain valuable during corpus refounding?** Candidates
   include no-collapse thread visibility, low-noise cadence, the local secret/PII boundary, and the
   distinction between navigation pointers and authority.
3. **Does ADR-201 cover the full service-authority problem?** Ratification or replacement needs to
   account for Figma and stakeholder visibility as well as operational evidence systems.
4. **What freshness and editorial cadence keeps Notion trustworthy?** The audience and role are now
   settled; the remaining decision is how source dates, owners, review cadence, and drift detection
   work without making Notion a second planning authority.
5. **What does Ask Oisín prove about conversational read models?** Its assessment includes its role
   as a member of a broader projection class, not only as a one-off Slack bot.
6. **Which criteria define the simplest strict Linear command and reconciliation path?** Candidate
   criteria include typed plan nodes, idempotency, recovery, and supervised mutation rather than an
   assumption inherited from session workflow.
7. **Does any internal need justify GitHub Projects alongside Linear?** Today GitHub PRs already
   aggregate change readiness; another project board needs a distinct audience task.
8. **Which design-specific relationships does Figma require?** A generic operational-evidence edge
   may not capture design source, implementation, and review authority.
9. **Which migration design preserves current repo orientation until Linear projection is dependable?**
   The target authority and the transition state are separate decisions.
10. **What evidence threshold permits present-tense integration claims?** Configuration toggles,
    manual pages, live service projects, and running connectors prove different things; precise
    descriptions keep those evidence classes separate.

## 17. Falsifiers and uncertainty

This report's model is falsified if first-hand evidence shows any of the following:

- a team cannot coordinate delivery effectively when durable intent remains repo-owned;
- plan -> Linear Project repeatedly fails because real project boundaries are structurally different;
- stakeholders do not use or trust a live repo-grounded Slack surface;
- senior and non-engineering stakeholders do not use or trust the Notion narrative, or require a
  materially different principal visibility surface;
- Figma cannot be connected without making it an authority surface for particular product-design
  contracts;
- strict desired-state reconciliation produces more complexity and lower reliability than a
  service-native workflow with explicit repo references;
- the idea graph fails to become human-usable or becomes a bottleneck for ordinary work;
- public partners require a roadmap before the graph and projection infrastructure is available.

The current synthesis records an observed but unratified convergence:

> Accepted principles and proposed designs converge on a graph-centred
> projection-and-evidence architecture. Whether that architecture is fit, how its services map, and
> whether stakeholders value it remain unresolved questions for owner ratification and real
> consumer evidence.

## 18. Conclusion

The most consequential observed reframing in the source estate is:

> OCE is treated not merely as something "connected to" a collection of external tools. The
> proposed sources converge on governed projections, command paths, evidence channels, and read
> models over a canonical intent system.

If ratified and proven, that candidate would be:

- vendor-independent;
- legible to humans and agents;
- strict about authority;
- capable of serving different audiences without duplicating intent;
- able to close the loop from strategy through delivery to observed value.

Linear is an operational consumer. The accepted plan and idea-graph architecture and the
older pointer-surface plan remain inputs to the later integration decision; the final mapping is not
selected by this report.

Notion is now part of the operating model as the principal non-engineering and senior-stakeholder
visibility surface. Its historical product-adapter role remains retired. The durable challenge is
to keep the stakeholder narrative sourced, dated, and explicit about evidence limits without
turning it into another planning authority.

Ask Oisín remains strategically significant because it is not another store: it is a planned,
read-only conversational lens over the canonical repo. It complements Notion's curated narrative,
even though its own strategy traceability still needs reconciliation.

PostHog and Sentry are also surfaces in their own right, not only feeds for a leadership report.
Draft PR #339 owns their proposed TAU mechanics; this report owns the neighbouring audience and
authority boundary. Product usage, operational health, delivery performance, and actual impact
remain different evidence classes.

The conceptual direction is strong. The estate's present weakness is not a lack of ideas; it is
**unretired conceptual overlap and the distance between accepted architecture and running
integration code**. The current plan-corpus refounding is therefore a genuine prerequisite, not
planning ceremony.

## Source inventory

### Reasoning and governance

- [`oak-reason`](../skills/cognition/reason/SKILL-CANONICAL.md)
- [`oak-metacognition`](../skills/cognition/metacognition/SKILL-CANONICAL.md)
- [Metacognition directive](../directives/metacognition.md)
- [Principles and decision lenses](../directives/principles.md)

### Accepted architecture and current plans

- [ADR-200 — intent as a living idea graph](../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)
- [ADR-207 — DORA delivery metrics as a structural property](../../docs/architecture/architectural-decisions/207-dora-delivery-metrics-as-a-structural-property.md)
- [V0 plan-node schema](../plans-v0-sketch-2026-07-21/plan-node-schema.v0.md)
- [Planning-estate rewrite](../plans-backlog-2026-07/product-development-governance/current/planning-estate-rewrite.plan.md)
- [Plan-corpus refounding](../plans-backlog-2026-07/product-development-governance/active/plan-corpus-refounding.plan.md)
- [Vision, strategy, and plan-estate controlling plan](../plans-backlog-2026-07/product-development-governance/vision-strategy-and-plan-estate.plan.md)
- [Plans root index](../plans/README.md)

### Proposed and future integration architecture

- [ADR-201 — external systems as evidence edges](../../docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md)
- [External-evidence integration plan](../plans-backlog-2026-07/product-development-governance/future/external-evidence-integration.plan.md)
- [External pointer-surface plan](../plans-backlog-2026-07/agentic-engineering-enhancements/future/external-pointer-surface-integration.plan.md)
- [Draft PR #339 — TAU planning](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/339)

### Product-development-governance inputs

- [Collection authority and disposition](../plans-backlog-2026-07/product-development-governance/README.md)
- [Service authority and operating contexts](../plans-backlog-2026-07/product-development-governance/suggestions/service-authority-and-operating-contexts.semantic-model.md)
- [Governed repo document graph plan](../plans-backlog-2026-07/product-development-governance/suggestions/governed-repo-document-graph.plan.md)
- [Repo intent and service knowledge boundaries](../plans-backlog-2026-07/product-development-governance/suggestions/repo-intent-and-service-knowledge-boundaries.proposal.md)

### Stakeholder and service surfaces

- Notion — MCP App strategy, intended impact, and current direction (internal Notion page; link redacted 2026-07-21 by the Notion strategy-page fence)
- [Ask Oisín design](../research/outreach/oisin-oce-navigator-design.md)
- [Slack assistants collection](../plans-backlog-2026-07/slack-assistants/README.md)
- [Ask Oisín plan](../plans-backlog-2026-07/slack-assistants/current/ask-oisin.plan.md)
- [ADR-004 — deprecated Notion adapter decision](../../docs/architecture/architectural-decisions/004-no-direct-notion-sdk-usage.md)

### Code and configuration foundations

- [`graph-core`](../../packages/core/graph-core/README.md)
- [`graph-ingest`](../../packages/libs/graph-ingest/README.md)
- [Cursor settings](../../.cursor/settings.json)
- [Claude settings](../../.claude/settings.json)
