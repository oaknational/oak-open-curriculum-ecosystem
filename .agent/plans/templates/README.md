# Plan Templates and Components

Reusable building blocks for creating high-quality, foundation-aligned
plans. See [ADR-117](/docs/architecture/architectural-decisions/117-plan-templates-and-components.md)
for the architectural decision and rationale.

## Templates

Templates are complete plan scaffolds. Copy one, fill in the bracketed
placeholders, and begin.

| Template | Use When |
|----------|----------|
| [`quality-fix-plan-template.md`](quality-fix-plan-template.md) | Quality improvement, refactoring, technical debt |
| [`feature-workstream-template.md`](feature-workstream-template.md) | New feature delivery with TDD phases (RED/GREEN/REFACTOR) |

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

## Document Hierarchy

Three document types serve distinct purposes. Do not duplicate
content across them.

| Document | Purpose | Location |
|----------|---------|----------|
| **Session prompt** | Operational entry — "where are we now" | `.agent/prompts/` |
| **Executable plan** | Per-workstream task list with TDD phases | `.agent/plans/*/active/` |
| **Roadmap** | Strategic milestone sequence | `.agent/plans/*/roadmap.md` |

**Content flows one way**: facts are authoritative in one document
and referenced (not restated) by the others. See ADR-117 for details.

## Plan Lifecycle

```text
active/             → work in progress
archive/completed/  → completed, read-only
```

When archiving:

1. Move the plan file to `archive/completed/`.
2. Add an entry to the [completed plans index](../completed-plans.md)
   (plan name, date, key outcomes, archive link).
3. Update all cross-references to point directly to
   `archive/completed/` — clean break, no stubs.
4. Run `/jc-consolidate-docs`.

## How to Use

### 1. Choose a template

Pick the template closest to your work type. If none fits, start
from the feature workstream template — it is the most general.

### 2. Copy and customise

```bash
cp .agent/plans/templates/feature-workstream-template.md \
   .agent/plans/semantic-search/active/your-plan-name.md
```

Fill in all `[bracketed]` placeholders.

### 3. Reference components

Templates reference components for guidance. Read the relevant
components before writing each section. Do not mechanically
inline them — adapt the guidance to your specific context.

### 4. Follow foundation documents

Before starting and at the start of each phase, read:

1. `.agent/directives/rules.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

Ask: "Could it be simpler without compromising quality?"

## Adding New Templates or Components

- Add a **template** when a new category of work recurs (three or
  more plans of the same type).
- Add a **component** when the same building block appears across
  three or more plan types.
- Keep components as guidance references, not mandatory inclusions.
- Update this README when adding templates or components.
