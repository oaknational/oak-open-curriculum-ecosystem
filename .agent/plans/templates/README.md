# Plan Templates and Components

Reusable building blocks for creating high-quality, foundation-aligned
plans. See [ADR-117](/docs/architecture/architectural-decisions/117-plan-templates-and-components.md)
for the architectural decision and rationale.

## Planning Vocabulary

Definitions and relationships for the terms used across the planning
surface in this repo. The doctrinal anchor is
[PDR-018: Planning Discipline](/.agent/practice-core/decision-records/PDR-018-planning-discipline.md);
the operational entrypoint is the [`/jc-plan` command](/.agent/skills/plan/SKILL-CANONICAL.md).

| Term | Definition | Authoritative source |
|------|------------|----------------------|
| **Thread** | The continuity unit. A multi-session conceptual lane (e.g. `observability-sentry-otel`, `agentic-engineering-enhancements`) carrying identity rows across sessions. Each thread has a `next-session.md` record under `.agent/memory/operational/threads/`. | [PDR-027](/.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md), [`threads/README.md`](/.agent/memory/operational/threads/README.md) |
| **Arc** | A coherent sequence of sessions or plan slices that delivers a single substantial outcome on a thread. An arc may span multiple plans or comprise a single multi-session plan. Less formal than a thread; informally named (e.g. *the validation-and-tdd doctrine arc*, *the EEF graph-and-corpus arc*). | Informal; surfaced in napkin entries and thread-record session summaries |
| **Collection** | A domain grouping of plans (e.g. `agentic-engineering-enhancements/`, `observability/`, `architecture-and-infrastructure/`). Each collection has a `roadmap.md` and `active/` `current/` `future/` subdirectories. | [ADR-117](/docs/architecture/architectural-decisions/117-plan-templates-and-components.md) |
| **Roadmap** | The strategic milestone sequence for a plan collection. Lives at `.agent/plans/<collection>/roadmap.md`. Names phases / milestones and the plans that serve each. | [`collection-roadmap-template.md`](collection-roadmap-template.md) |
| **Plan (executable)** | A plan file in `current/` (queued) or `active/` (in flight). Has YAML frontmatter with machine-readable todos, TDD cycle-pairs as the unit of landing, acceptance criteria, deterministic validation, and quality-gate sequencing. | [`quality-fix-plan-template.md`](quality-fix-plan-template.md), [`feature-workstream-template.md`](feature-workstream-template.md), [`/jc-plan` §Executable Plan Requirements](/.agent/skills/plan/SKILL-CANONICAL.md) |
| **Plan (strategic)** | A plan file in `future/`. Names problem + intent + domain boundaries + dependencies + success signals + risks + promotion triggers. May include reference implementation detail from completed research, but execution decisions finalise only at promotion to `current/`. | [`/jc-plan` §Strategic Plan Requirements](/.agent/skills/plan/SKILL-CANONICAL.md) |
| **Phase** | An ordered sequence of workstreams within a plan. Phases gate quality-gate runs and reviewer dispatch. Some plans use phases (Phase 0, Phase 1, ...); some plans are single-phase with workstreams flat at top level. | [`quality-fix-plan-template.md`](quality-fix-plan-template.md) |
| **Workstream (WS)** | A unit within an executable plan, typically scoped to a single concern that one agent can complete in one session. A workstream decomposes into one or more TDD cycle-pairs. Identified as `WS1`, `WS2`, ... within a plan. | [`feature-workstream-template.md`](feature-workstream-template.md) |
| **Cycle (TDD pair)** | The unit of landing within a workstream: a failing test + the product code that greens it + any refactor, all in one commit. Tests must NEVER be committed ahead of the product code that greens them; product code must NEVER be committed ahead of the tests that prove it. | [`/jc-plan` §Executable Plan Requirements](/.agent/skills/plan/SKILL-CANONICAL.md), [`tdd-phases.md`](components/tdd-phases.md) |

**Lifecycle**: a plan moves through `future/` → `current/` → `active/` → `archive/completed/`. Promotion triggers are named in the `future/` plan; promotion authors a `current/` plan from a template.

**Relationships**:

- A **Thread** has identity (PDR-027 row) and contains one or more **Arcs** over time.
- An **Arc** is a working unit on a thread; arcs span one or more **Plans**.
- A **Collection** groups Plans by domain; its **Roadmap** sequences them.
- A **Plan (executable)** decomposes into **Phases** (optional) and **Workstreams**.
- A **Workstream** decomposes into **Cycles** (TDD pairs).
- The unit of commit landing is the **Cycle** (one commit per cycle, tests + product code together).

**Canonical entrypoints**:

- **Doctrinal**: [PDR-018: Planning Discipline](/.agent/practice-core/decision-records/PDR-018-planning-discipline.md) — end goals, mechanisms, means; ambiguous-verb avoidance; disposition-drift discipline; beneficial-vs-blocking prerequisites; plan-placement-by-ownership.
- **Architectural**: [ADR-117: Plan Templates and Components](/docs/architecture/architectural-decisions/117-plan-templates-and-components.md) — the host architectural decision on plan structure and document hierarchy.
- **Operational**: [`/jc-plan`](/.agent/skills/plan/SKILL-CANONICAL.md) — the agent-facing command for creating or promoting plans, including the design gate that requires `/jc-metacognition` first when scope is ambiguous.
- **Templates and components**: this README.

## Templates

Templates are complete plan scaffolds. Copy one, fill in the bracketed
placeholders, and begin.

| Template | Use When |
|----------|----------|
| [`quality-fix-plan-template.md`](quality-fix-plan-template.md) | Quality improvement, refactoring, technical debt |
| [`feature-workstream-template.md`](feature-workstream-template.md) | New feature delivery with TDD phases (RED/GREEN/REFACTOR) |
| [`adoption-rollout-plan-template.md`](adoption-rollout-plan-template.md) | Policy/process/tooling adoption across existing workflows |
| [`collection-roadmap-template.md`](collection-roadmap-template.md) | Strategic roadmap for a plan collection with phase mapping |
| [`collection-readme-template.md`](collection-readme-template.md) | Collection navigation hub with explicit document-role boundaries |
| [`active-plan-index-template.md`](active-plan-index-template.md) | `active/README.md` index for atomic phase execution plans |
| [`current-plan-index-template.md`](current-plan-index-template.md) | `current/README.md` index for next-up plans (queued, not started) |
| [`future-plan-index-template.md`](future-plan-index-template.md) | `future/README.md` index for later/deferred plans |
| [`active-atomic-implementation-plan-template.md`](active-atomic-implementation-plan-template.md) | Atomic phase execution plan with preflight, deterministic validation, and evidence hooks |

## Components

Components are reusable building blocks referenced by templates.
They live in `components/` and provide guidance for common plan
sections.

| Component | Purpose |
|-----------|---------|
| [`quality-gates.md`](components/quality-gates.md) | Standard quality gate sequence and rationale |
| [`tdd-phases.md`](components/tdd-phases.md) | RED/GREEN/REFACTOR phase structure with acceptance criteria |
| [`foundation-alignment.md`](components/foundation-alignment.md) | Foundation document commitment checklist |
| [`risk-assessment.md`](components/risk-assessment.md) | Risk/mitigation table structure |
| [`adversarial-review.md`](components/adversarial-review.md) | Post-implementation specialist review phase |
| [`evidence-and-claims.md`](components/evidence-and-claims.md) | Claim classification and evidence/verification requirements |
| [`lifecycle-triggers.md`](components/lifecycle-triggers.md) | Session entry, simple-plan/work-shape declaration, collaboration claim registration, handoff closure, and consolidation touch points |
| [`documentation-propagation.md`](components/documentation-propagation.md) | Required ADR/directive/reference-doc and README update propagation |
| [`session-discipline.md`](components/session-discipline.md) | Multi-session execution discipline: template-not-contract count, mid-arc checkpoints, context-budget thresholds, metacognition at session open |
| [`substrate-vs-axis-plans.md`](components/substrate-vs-axis-plans.md) | Multi-axis plan collections: distinguish axis-shipping plans from cross-axis substrate plans; convention for inventory shape and ADR cross-reference |

## Document Hierarchy

Three document types serve distinct purposes. Do not duplicate
content across them.

| Document | Purpose | Location |
|----------|---------|----------|
| **Session prompt** | Operational entry — "where are we now" | `.agent/prompts/` |
| **Executable plan** | Per-workstream task list with TDD phases | `.agent/plans/*/{active,current}/` |
| **Strategic plan** | Later intent with a named promotion trigger | `.agent/plans/*/future/` |
| **Roadmap** | Strategic milestone sequence | `.agent/plans/*/roadmap.md` |

**Content flows one way**: facts are authoritative in one document
and referenced (not restated) by the others. See ADR-117 for details.

## Plan Lifecycle

```text
active/             → NOW: in-progress work only
current/            → NEXT: queued and ready, not yet started
future/             → LATER: deferred strategic work
archive/completed/  → completed, read-only
```

When archiving:

1. Mine completed outcomes into permanent documentation (ADRs,
   directives, READMEs, reference docs).
2. Move the plan file to `archive/completed/`.
3. Add an entry to the [completed plans index](../completed-plans.md)
   (plan name, date, key outcomes, archive link).
4. Update all cross-references to point directly to
   `archive/completed/` — clean break, no stubs.
5. Run `/jc-consolidate-docs`.

## How to Use

### 1. Choose a template

Pick the template closest to your work type. If none fits, start
from the feature workstream template — it is the most general.

### 2. Copy and customise

```bash
cp .agent/plans/templates/feature-workstream-template.md \
   .agent/plans/semantic-search/active/your-plan-name.md
```

Use the lifecycle directory that matches the plan state:

- `active/` — in progress now
- `current/` — next-up, not started
- `future/` — later/deferred strategic intent only; promote to
  `current/` or `active/` before writing executable task detail

Fill in all `[bracketed]` placeholders.

### 3. Reference components

Templates reference components for guidance. Read the relevant
components before writing each section. Do not mechanically
inline them — adapt the guidance to your specific context.

### 4. Follow foundation documents

Before starting and at the start of each phase, read:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

Ask: "Could it be simpler without compromising quality?"

## Adding New Templates or Components

- Add a **template** when a new category of work recurs (three or
  more plans of the same type).
- Add a **component** when the same building block appears across
  three or more plan types.
- Keep most components as guidance references, not mandatory inclusions.
  `lifecycle-triggers.md` is required for non-trivial work unless the
  plan records an explicit not-applicable rationale.
- Update this README when adding templates or components.
