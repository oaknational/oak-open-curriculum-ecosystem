---
name: plan
classification: active
description: Create or promote a plan following the plan architecture.
---

# Create or Promote a Plan

Create a plan aligned with the foundation documents, the planning
discipline in
[PDR-018](../../practice-core/decision-records/PDR-018-planning-discipline.md),
and the plan architecture defined in
[ADR-117](../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md).

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

4. Resolve discoverable unknowns before asking the owner. Search the
   repo, relevant plans, ADRs/PDRs, vendor docs or CLIs, and existing
   code first. Ask specific questions only for owner-only decisions or
   genuinely undiscoverable intent. Do not guess scope, intent, or
   acceptance criteria.

## Choose Lifecycle First

Decide the lane before choosing structure:

| Lane | Purpose | Plan Form |
|------|---------|-----------|
| `active/` | NOW — in-progress execution | **Executable** |
| `current/` | NEXT — queued and ready, not started | **Executable** |
| `future/` | LATER — strategic backlog and intent | **Strategic (not yet executable)** |

## Choose a Template From the Live Inventory

Use
[`../../plans/templates/README.md`](../../plans/templates/README.md)
and the template directory as the live inventory. Do not copy template
lists into this skill; the README and directory are the source of truth
for available scaffolds, their lifecycle lanes, and their component
references.

Copy the closest template, then remove template residue before marking
the plan ready: fill all `[bracketed]` placeholders, replace example
todo ids, delete or complete optional sections, fix copied relative
links, and remove sample paths or commands that are not true for the
plan.

Run a self-check before promotion or readiness:

```bash
rg -n "TBD|TODO|your-plan-name|semantic-search/active" \
  .agent/plans/<collection>/<lane>/<plan>.md
rg -n --pcre2 \
  "(?<![!\\]])\\[(?![ xX]\\])(?!(?:[^]\\n]+)\\]\\([^)]*\\))(?!(?:[^]\\n]+)\\]\\[[^]\\n]*\\])[^]\\n]+\\]" \
  .agent/plans/<collection>/<lane>/<plan>.md
rg -n "git add .*git com[m]it" .agent/plans/<collection>/<lane>/<plan>.md
```

Expected: no unresolved placeholders, sample-only paths, or copied
commit recipes remain. Review any bracket hits manually; only real markdown
links, checked boxes, or intentionally literal bracket syntax may remain.

## Requirements for All Non-Trivial Plans

Every non-trivial plan, strategic or executable, MUST define:

1. **End goal** — the user-impact outcome sought.
2. **Mechanism** — why the named means produce that outcome.
3. **Means** — the work items or strategic moves.
4. **Explicit acceptance criteria** — strategic plans use
   outcome-level acceptance criteria; executable plans use task or
   cycle-level criteria. Acceptance criteria must measure outcomes, not
   activity alone.
5. **Prerequisite classification** — every prerequisite is either
   `blocking` or `beneficial`. For each `beneficial` prerequisite, state
   the minimum shippable shape without it.
6. **Non-goals** — what the plan explicitly will not do.

## Strategic Plan Requirements (`future/`)

`future/` plans are strategic briefs. They are not executable work plans yet.
They MAY include accurate implementation detail from completed research
(commands, code sketches, sequencing), but that detail is reference context,
not an in-progress execution commitment.

Every strategic plan MUST define:

1. Problem and intent
2. End goal, mechanism, and means
3. Domain boundaries and non-goals
4. Dependencies and sequencing assumptions, with `blocking` /
   `beneficial` classification
5. Strategic acceptance criteria and success signals
6. Risks and unknowns
7. Promotion trigger into `current/`
8. If implementation detail is present, a clear note that execution
   decisions are finalised only during promotion to `current/`/`active/`

## Executable Plan Requirements (`current/`, `active/`)

Every executable plan MUST have:

1. **YAML frontmatter** with machine-readable todos (id, content, status)
   for every execution-relevant task or cycle.
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
3. **Parallelisable plan hygiene** — always look for the independent
   decomposition before accepting a serial plan. Break larger workstreams
   into atomic cycles that can run independently when the work shape allows.
   Two cycles are independent when completing one does not change what the
   other does or how it is verified. In practice each independent cycle
   touches a separate file scope, or overlaps only additively, declares its
   starting state, names files or areas it must not touch, has executable
   acceptance criteria another agent can verify, and includes deterministic
   validation commands.

   If cycles genuinely depend on each other, declare the dependency in the
   cycle description and, where the plan may be machine-dispatched, in a
   `depends_on` YAML field on the todo. Dependent cycles are queued behind
   their prerequisites. Do not invent serial dependencies that the work shape
   does not require; choose the natural decomposition that already exists in
   the system, such as separate workspaces, modules, generated surfaces, or
   user-facing behaviours.

   When a cycle is actually delegated to another agent, the cycle itself is
   the delegation brief. It must already contain the goal, owned surface,
   non-goals, required evidence, acceptance signal, reintegration owner, and
   stop-or-escalate rule. If those details cannot be stated concisely, the
   plan is under-scoped rather than "not parallelisable".
4. **Quality gates** — reference
   `../../plans/templates/components/quality-gates.md`. Each cycle has
   focused deterministic validation plus the relevant local gates; phase
   and final validation use the canonical aggregate gate named there.
5. **Acceptance criteria** for every task — specific, checkable,
   outcome-based, and paired with deterministic validation commands.
   Acceptance for a TDD cycle includes "all tests passing at every
   level" as a non-negotiable.
6. **Proof contract for completion claims** — every product-bearing
   task or workstream must name addressable acceptance ids, the proof
   level for each id (`unit`, `integration`, `e2e`, `value-proxy`, or
   `non-code`), and the command or observation that proves it. Plans
   that intend to use `complete`, `DECISION-COMPLETE`, `READY FOR
   EXECUTION`, milestone-complete, or workstream-complete language must
   state how that verdict will be validated. A landed slice, session
   close, claim close, or useful snapshot is not completion unless all
   acceptance ids for the parent scope are proven. For TDD claims, the
   proof contract must distinguish test-first evidence from retrospective
   test coverage: tests added after product code may be useful, but they
   are not TDD evidence for that product code.
7. **Risk assessment** — what could go wrong and how to mitigate
8. **Foundation alignment** — explicit references to principles.md,
   testing-strategy.md, schema-first-execution.md
9. **Non-goals** — what we are explicitly NOT doing (YAGNI)
10. **Plan-body first-principles check** — state where the
   `../../rules/plan-body-first-principles-check.md` shape,
   landing-path, and vendor-literal clauses fire before executing
   plan-prescribed tests, implementation, or doctrine.
11. **Readiness reviewers** — before a plan is marked
    `DECISION-COMPLETE`, `READY FOR EXECUTION`, or equivalent, invoke
    required reviewers by substance: `assumptions-expert` for
    plan-readiness/proportionality, docs/onboarding reviewers for
    significant Practice or documentation changes, and technical
    specialists where the work shape requires them.
12. **Learning Loop** — executable plan completion, milestone closure,
    strategic promotion, and archival MUST run or explicitly reference
    the consolidation workflow.
13. **Lifecycle triggers** — plans that touch non-trivial work MUST
    reference `../../plans/templates/components/lifecycle-triggers.md`
    or record why each lifecycle touch point is not applicable

## Promotion Workflow (`future/` -> `current/` -> `active/`)

1. Select a `future/` strategic plan with a clear promotion trigger.
   Record the evidence that the trigger has fired, the readiness
   verdict, and any assumptions carried forward.
2. Create a new executable plan in `current/` from the appropriate template.
3. Mine strategic intent from `future/` into executable todos, TDD cycles,
   acceptance criteria, prerequisite classification, and deterministic
   validation commands.
4. Keep a reference from the `current/` plan back to its source strategic brief.
5. Move the executable plan into `active/` only when implementation starts.
6. After completion, mine permanent documentation and archive per ADR-117.

## Document Hierarchy (ADR-117)

Plans are one layer in a multi-document hierarchy. Do not duplicate
content across layers:

- **Session prompt** (`../../prompts/`) — operational entry point
- **Strategic plan** (`../../plans/*/future/`) — later intent and sequencing
- **Executable plan** (`../../plans/*/{current,active}/`) — lifecycle-scoped work items
- **Roadmap** (`../../plans/*/roadmap.md`) — strategic milestone sequence

Facts are authoritative in one document and referenced by the others. When the
plan contains findings or metrics, state them once and have other documents
link to the authoritative source.

## Plan Location

Place plans in the lifecycle directory owned by the plan's collection
and actionability. Use `.agent/plans/<collection>/...` as the shape:

```bash
.agent/plans/<collection>/active/your-plan-name.md   # executable, in progress
.agent/plans/<collection>/current/your-plan-name.md  # executable, queued
.agent/plans/<collection>/future/your-plan-name.md   # strategic brief, later
```

## First Question

Before every decision in the plan: **could it be simpler
without compromising quality?**
