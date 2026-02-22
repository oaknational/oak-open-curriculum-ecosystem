# Create a Plan

Create an executable plan aligned with the foundation documents
and the plan architecture defined in
[ADR-117](/docs/architecture/architectural-decisions/117-plan-templates-and-components.md).

## Before Writing

1. Read the foundation documents:
   - @.agent/directives/rules.md
   - @.agent/directives/testing-strategy.md
   - @.agent/directives/schema-first-execution.md

2. Read the plan templates and components:
   - @.agent/plans/templates/README.md

3. If the user has not provided enough detail, ask specific
   questions. Do not guess scope, intent, or acceptance criteria.

## Choose a Template

Pick the template closest to the work:

| Template | Use When |
|----------|----------|
| `feature-workstream-template.md` | New feature with TDD phases |
| `quality-fix-plan-template.md` | Quality improvement, refactoring, tech debt |
| `closeout-stub-template.md` | Archiving a completed plan |

Copy the template to the appropriate `active/` directory and
fill in all `[bracketed]` placeholders.

## Plan Requirements

Every plan MUST have:

1. **YAML frontmatter** with machine-readable todos (id, content, status)
2. **TDD phase structure** — RED (tests first, must fail), GREEN
   (minimal implementation), REFACTOR (docs, cleanup)
3. **Quality gates** after each phase — reference the
   [quality-gates component](/plans/templates/components/quality-gates.md)
4. **Acceptance criteria** for every task — specific, checkable,
   with deterministic validation commands
5. **Risk assessment** — what could go wrong and how to mitigate
6. **Foundation alignment** — explicit references to rules.md,
   testing-strategy.md, schema-first-execution.md
7. **Non-goals** — what we are explicitly NOT doing (YAGNI)

## Document Hierarchy (ADR-117)

Plans are one layer in a three-document hierarchy. Do not
duplicate content across layers:

- **Session prompt** (`.agent/prompts/`) — operational entry point
- **Executable plan** (`.agent/plans/*/active/`) — this is what you are creating
- **Roadmap** (`.agent/plans/*/roadmap.md`) — strategic milestone sequence

Facts are authoritative in one document and referenced by the
others. When the plan contains findings or metrics, state them
once and have other documents link to the plan.

## Plan Location

Place plans in the relevant `active/` directory:

```bash
.agent/plans/semantic-search/active/your-plan-name.md
```

## First Question

Before every decision in the plan: **could it be simpler
without compromising quality?**
