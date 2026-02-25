# Create or Promote a Plan

Create a plan aligned with the foundation documents and the plan architecture
defined in
[ADR-117](/docs/architecture/architectural-decisions/117-plan-templates-and-components.md).

## Before Writing

1. Read the directives:
   - @.agent/directives/rules.md
   - @.agent/directives/testing-strategy.md
   - @.agent/directives/schema-first-execution.md

2. Read the plan templates and components:
   - @.agent/plans/templates/README.md

3. If the user has not provided enough detail, ask specific
   questions. Do not guess scope, intent, or acceptance criteria.

## Choose Lifecycle First

Decide the lane before choosing structure:

| Lane | Purpose | Plan Form |
|------|---------|-----------|
| `active/` | NOW — in-progress execution | **Executable** |
| `current/` | NEXT — queued and ready, not started | **Executable** |
| `future/` | LATER — strategic backlog and intent | **Strategic (not yet executable)** |

## Choose a Template (Executable Plans Only)

Use templates for `current/` and `active/` plans:

| Template | Use When |
|----------|----------|
| `feature-workstream-template.md` | New feature with TDD phases |
| `quality-fix-plan-template.md` | Quality improvement, refactoring, tech debt |

Copy the template and fill all `[bracketed]` placeholders.

## Strategic Plan Requirements (`future/`)

`future/` plans are strategic briefs. They are not executable work plans yet.
They MAY include accurate implementation detail from completed research
(commands, code sketches, sequencing), but that detail is reference context,
not an in-progress execution commitment.

Every strategic plan MUST define:

1. Problem and intent
2. Domain boundaries and non-goals
3. Dependencies and sequencing assumptions
4. Success signals (what would justify promotion)
5. Risks and unknowns
6. Promotion trigger into `current/`
7. If implementation detail is present, a clear note that execution decisions are
   finalised only during promotion to `current/`/`active/`

## Executable Plan Requirements (`current/`, `active/`)

Every executable plan MUST have:

1. **YAML frontmatter** with machine-readable todos (id, content, status)
2. **TDD phase structure** — RED (tests first, must fail), GREEN
   (minimal implementation), REFACTOR (docs, cleanup)
3. **Quality gates** after each phase — reference the
   [quality-gates component](/.agent/plans/templates/components/quality-gates.md)
4. **Acceptance criteria** for every task — specific, checkable,
   with deterministic validation commands
5. **Risk assessment** — what could go wrong and how to mitigate
6. **Foundation alignment** — explicit references to rules.md,
   testing-strategy.md, schema-first-execution.md
7. **Non-goals** — what we are explicitly NOT doing (YAGNI)

## Promotion Workflow (`future/` → `current/` → `active/`)

1. Select a `future/` strategic plan with a clear promotion trigger.
2. Create a new executable plan in `current/` from the appropriate template.
3. Mine strategic intent from `future/` into executable todos, TDD phases,
   acceptance criteria, and deterministic validation commands.
4. Keep a reference from the `current/` plan back to its source strategic brief.
5. Move the executable plan into `active/` only when implementation starts.
6. After completion, mine permanent documentation and archive per ADR-117.

## Document Hierarchy (ADR-117)

Plans are one layer in a multi-document hierarchy. Do not duplicate content across layers:

- **Session prompt** (`.agent/prompts/`) — operational entry point
- **Strategic plan** (`.agent/plans/*/future/`) — later intent and sequencing
- **Executable plan** (`.agent/plans/*/{current,active}/`) — lifecycle-scoped work items
- **Roadmap** (`.agent/plans/*/roadmap.md`) — strategic milestone sequence

Facts are authoritative in one document and referenced by the others. When the
plan contains findings or metrics, state them once and have other documents
link to the authoritative source.

## Plan Location

Place plans in the relevant lifecycle directory:

```bash
.agent/plans/semantic-search/active/your-plan-name.md   # executable, in progress
.agent/plans/semantic-search/current/your-plan-name.md  # executable, queued
.agent/plans/semantic-search/future/your-plan-name.md   # strategic brief, later
```

## First Question

Before every decision in the plan: **could it be simpler
without compromising quality?**
