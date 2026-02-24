# ADR-117: Plan Templates and Reusable Plan Components

**Status**: Accepted
**Date**: 2026-02-22
**Related**: [ADR-114 (Layered Sub-agent Prompt Composition Architecture)](114-layered-sub-agent-prompt-composition-architecture.md)

## Context

Over the course of 39+ completed plans spanning SDK extraction, MCP tool
wiring, OAuth compliance, developer onboarding, and search quality work,
recurring structural patterns emerged organically. Each plan independently
converged on similar shapes: YAML frontmatter for progress tracking, TDD
phase structure (RED/GREEN/REFACTOR), quality gate checkpoints, foundation
document alignment, deterministic validation commands, and risk assessment
tables.

The same building blocks appeared in plan after plan, but were written from
scratch each time. This created three problems:

1. **Inconsistency**: Plans varied in rigour. Some had deterministic
   validation; others relied on prose descriptions. Some tracked todos in
   frontmatter; others used inline checkboxes.
2. **Lost patterns**: Effective structures discovered in one plan (e.g. the
   "adversarial review as closing phase" pattern from Phase 3a) were not
   available as starting points for subsequent plans.
3. **Unclear document hierarchy**: The relationship between session prompts
   (`.agent/prompts/`), executable plans (`.agent/plans/*/active/`), and
   the strategic roadmap was implicit, leading to content duplication and
   contradictory facts across documents.

The repository already had ADR-114 establishing a layered composition
architecture for sub-agent prompts (components → templates → wrappers).
The plan system needed an analogous structure.

## Decision

Adopt a template-and-component architecture for plans in `.agent/plans/templates/`:

### 1. Plan Templates

Full plan scaffolds for common workstream types. A template is a complete
starting point — copy, fill in the bracketed placeholders, and begin.

| Template                            | Use When                                            |
| ----------------------------------- | --------------------------------------------------- |
| `quality-fix-plan-template.md`      | Quality improvement, refactoring, technical debt    |
| `feature-workstream-template.md`    | New feature delivery with TDD phases                |
| `adoption-rollout-plan-template.md` | Policy/process/tooling adoption across workflows    |
| `collection-roadmap-template.md`    | Strategic roadmap with phase-to-active-plan mapping |

### 2. Plan Components

Reusable building blocks that appear across multiple plan types. Components
live in `.agent/plans/templates/components/` and are referenced (not
inlined) by templates.

| Component                      | Purpose                                                     |
| ------------------------------ | ----------------------------------------------------------- |
| `quality-gates.md`             | Standard quality gate sequence and rationale                |
| `tdd-phases.md`                | RED/GREEN/REFACTOR phase structure with acceptance criteria |
| `foundation-alignment.md`      | Foundation document commitment checklist                    |
| `risk-assessment.md`           | Risk/mitigation table structure                             |
| `adversarial-review.md`        | Post-implementation specialist review phase                 |
| `evidence-and-claims.md`       | Claim classification and evidence/verification requirements |
| `documentation-propagation.md` | Required ADR/directive/reference-doc and README propagation |

### 3. Document Hierarchy

Three document types serve distinct purposes and must not duplicate content:

| Document            | Purpose                                                                                     | Location                    | Mutability                                       |
| ------------------- | ------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------ |
| **Session prompt**  | Operational entry point — "where are we now, what to read, what to do"                      | `.agent/prompts/`           | Updated every session                            |
| **Executable plan** | Per-workstream task list with TDD phases, acceptance criteria, and deterministic validation | `.agent/plans/*/active/`    | Updated during execution, archived on completion |
| **Roadmap**         | Strategic milestone sequence — phases, dependencies, completion status                      | `.agent/plans/*/roadmap.md` | Updated at milestone boundaries                  |

**Content flows one way**: facts are authoritative in one document and
referenced (not restated) by the others. Specifically:

- **Metrics and baselines** are authoritative in the ground truth protocol.
  The roadmap and prompt reference them.
- **Adversarial findings and architectural debt** are authoritative in the
  plan that will address them. The prompt references the plan.
- **Milestone completion status** is authoritative in the roadmap. The
  prompt summarises it.

### 4. Plan Lifecycle

```text
active/         → work in progress, frontmatter todos track state
archive/completed/ → completed, read-only historical record
```

When archiving a plan:

1. Move the file to `archive/completed/`.
2. Add an entry to the [completed plans index](/.agent/plans/completed-plans.md)
   (plan name, date, key outcomes, archive link).
3. Update all cross-references to point directly to
   `archive/completed/` — clean break, no stubs, no redirects.
4. Run the consolidation flow to synchronise all documents.

### 5. Frontmatter Todo Tracking

All executable plans use YAML frontmatter with machine-readable todos:

```yaml
---
name: Plan Title
overview: One-line scope description
todos:
  - id: unique-id
    content: 'Human-readable task description'
    status: pending | completed
---
```

This enables tooling to track progress across plans and sessions without
parsing markdown.

## Rationale

### Why templates and components (not a generator)

Templates are plain markdown files — no tooling dependency, no build step,
no abstraction overhead. An agent or developer copies the template, fills
in the blanks, and starts working. Components are referenced for guidance,
not mechanically assembled.

This mirrors the sub-agent prompt approach (ADR-114): the simplest
structure that eliminates duplication without introducing complexity.

### Why document hierarchy matters

The Phase 3a experience demonstrated the cost of duplication: adversarial
review findings (B1-B4, W1-W8) appeared in both the prompt and the plan,
with metrics that contradicted the authoritative ground truth protocol.
Fixing one document without fixing the others created a window of
inconsistency. The hierarchy rule ("facts are authoritative in one place,
referenced elsewhere") prevents this.

### Why YAML frontmatter (not inline checkboxes)

Inline checkboxes (`- [ ]`, `- [x]`) are ambiguous — they can appear
in examples, templates, and checklists without indicating plan progress.
YAML frontmatter is unambiguous, machine-parseable, and separated from
the plan content.

## Consequences

### Positive

- New plans start from a proven structure rather than a blank page.
- Common patterns (quality gates, TDD phases, risk tables) are consistent
  across all plans.
- Document hierarchy prevents content duplication and fact contradiction.
- Plan lifecycle is explicit: active plans are work-in-progress, archived
  plans are historical records.
- Frontmatter todos provide machine-readable progress tracking.

### Trade-offs

- Templates must be maintained as patterns evolve.
- The hierarchy discipline requires agents to check which document is
  authoritative for a given fact before updating it.
- Overly rigid template adherence could constrain plans that genuinely
  need different structure.

## Guardrails

- Prefer template adaptation over starting from scratch.
- Add new components only when the same structure appears in three or more
  plans.
- Keep components as guidance references, not mandatory inclusions.
- Include explicit documentation propagation handling in phase completion
  criteria (update impacted docs or record no-change rationale).
- When facts appear in multiple documents, mark one as authoritative and
  make the others reference it.
- Archive completed plans promptly; `active/` must contain only
  in-progress work — no stubs, no redirects, no compatibility layers.
- Run the consolidation flow (`/jc-consolidate-docs`) after every milestone.

## References

- `.agent/plans/templates/` — templates and components
- `.agent/plans/templates/README.md` — usage instructions
- ADR-114 — analogous pattern for sub-agent prompts
- `.cursor/commands/jc-consolidate-docs.md` — consolidation flow
