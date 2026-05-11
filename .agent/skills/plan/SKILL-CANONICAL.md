---
name: plan
classification: active
description: Create or promote a plan following the plan architecture.
---

# Create or Promote a Plan

Create a plan aligned with the foundation documents and the plan architecture
defined in [ADR-117](../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md).

## Before Writing

1. **Design gate**: Has the design intent been explored and confirmed
   with the project owner? If the scope is ambiguous or the approach
   has multiple valid paths, run `jc-metacognition` first to explore
   intent, constraints, and trade-offs before committing to a plan
   structure. Do not skip this step for non-trivial work.

   **Verdict-vs-menu discipline** (per
   [`.agent/rules/present-verdicts-not-menus.md`](../../rules/present-verdicts-not-menus.md)):

   - *Unknown-to-agent design intent* — the agent has no strong basis
     for a verdict: surface 2–3 approaches with trade-offs via
     `AskUserQuestion`. One question at a time; this is the case this
     design-gate step is written for.
   - *Agent has analysed and has a verdict* — present the verdict
     with cited evidence. Do not convert completed findings into a
     multiple-choice form. `AskUserQuestion` is for genuine permission
     gates and decisions only the owner can make, not for offloading
     synthesis the agent has already done. The diagnostic is: *could
     the agent rank these options by evidence already in context?* If
     yes, the quiz is evasion.

   Doctrinal anchors: `feedback_no_responsibility_passback` (origin
   2026-05-09), `feedback_answer_verification_questions_directly`
   (origin 2026-04-24), PDR-057 (apply-don't-ask doctrine), PDR-058
   (stop-inventing-optionality).

2. Read the directives:
   - `../../directives/principles.md`
   - `../../directives/testing-strategy.md`
   - `../../directives/schema-first-execution.md`

3. Read the plan templates and components:
   - `../../plans/templates/README.md`

4. If the user has not provided enough detail, ask specific
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
2. **TDD cycles as the unit of landing** — every workstream is a
   sequence of test+product-code PAIRS. Each cycle (Red → Green →
   Refactor) is one landing unit (one commit): the failing test, the
   product code that makes it pass, and any refactor land together.
   Tests must NEVER be committed ahead of the product code that greens
   them; product code must NEVER be committed ahead of the tests that
   prove it. Both lag-shapes violate testing-strategy.md and produce
   skipped or failing tests in the tree. Apply this at every level —
   unit, integration, E2E — and where a higher-level test requires
   several lower-level cycles, sequence those cycles and finish with
   the commit that adds the final piece needed to green the
   higher-level test. Every commit ends with all tests passing.
3. **Atomic, independent cycles for parallel dispatch where the
   work shape allows** — break larger workstreams into cycles that
   are independent of each other so each can be handed to a
   parallel agent without mid-work coordination. Two cycles are
   independent when completing one does not change what the other
   does or how it is verified. In practice each independent cycle
   touches a separate file scope (or overlaps only additively),
   declares its starting state, has executable acceptance criteria
   another agent can verify, and carries a self-contained brief
   with no "ask the original author" dependencies. Where cycles
   genuinely depend on each other (a higher-level test that needs
   lower-level cycles in place; a cycle that consumes an interface
   another cycle introduces), declare the dependency explicitly in
   the cycle description and, optionally, in a `depends_on` YAML
   field on the todo. Cycles with no declared dependency are
   parallel-safe and can be dispatched concurrently; dependent
   cycles are queued behind their prerequisites. Plan authors do
   not invent serial dependencies that the work shape does not
   require — pick the natural decomposition (separate workspaces,
   separate modules, separate features) that the cycles already
   suggest.
4. **Quality gates** after every cycle — reference the
   quality-gates component (`../../plans/templates/components/quality-gates.md`)
5. **Acceptance criteria** for every task — specific, checkable,
   with deterministic validation commands. Acceptance for a TDD cycle
   includes "all tests passing at every level" as a non-negotiable.
6. **Risk assessment** — what could go wrong and how to mitigate
7. **Foundation alignment** — explicit references to principles.md,
   testing-strategy.md, schema-first-execution.md
8. **Non-goals** — what we are explicitly NOT doing (YAGNI)
9. **Learning Loop** — all plans MUST end with running the consolidation workflow
10. **Lifecycle triggers** — plans that touch non-trivial work MUST
    reference `../../plans/templates/components/lifecycle-triggers.md`
    or record why each lifecycle touch point is not applicable

## Promotion Workflow (`future/` -> `current/` -> `active/`)

1. Select a `future/` strategic plan with a clear promotion trigger.
2. Create a new executable plan in `current/` from the appropriate template.
3. Mine strategic intent from `future/` into executable todos, TDD phases,
   acceptance criteria, and deterministic validation commands.
4. Keep a reference from the `current/` plan back to its source strategic brief.
5. Move the executable plan into `active/` only when implementation starts.
6. After completion, mine permanent documentation and archive per ADR-117.

## Document Hierarchy (ADR-117)

Plans are one layer in a multi-document hierarchy. Do not duplicate content across layers:

- **Session prompt** (`../../prompts/`) — operational entry point
- **Strategic plan** (`../../plans/*/future/`) — later intent and sequencing
- **Executable plan** (`../../plans/*/{current,active}/`) — lifecycle-scoped work items
- **Roadmap** (`../../plans/*/roadmap.md`) — strategic milestone sequence

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
