# Core Proposal: UI Reviewer Roster Guidance

> **Origin**: opal-connection-site, 2026-03-28
> **Source evidence**: static Astro site with accessibility and theme tests
> **Status**: Proposal for Practice Core vocabulary expansion
> **Target file**: `practice-bootstrap.md` §Sub-agents, `practice-lineage.md`
>   §Agent Pattern

## The Gap

The Core defines a minimum reviewer trio: code-reviewer (gateway), test-reviewer
(TDD discipline), type-reviewer (type flow). This is correct and sufficient for
backend projects. For UI-heavy projects, the gateway reviewer has no vocabulary
to triage UI-specific concerns to a specialist.

In this repo the code-reviewer correctly identified a layout defect (CSS grid
class mismatch after content changes) but had no specialist to escalate
accessibility, design-system compliance, or responsive-design concerns to. The
gateway reviewer absorbed those responsibilities implicitly.

## Proposed Addition

Add a note to the reviewer roster guidance in `practice-bootstrap.md`:

> **UI-heavy projects** should consider extending the minimum trio with:
>
> - **accessibility-reviewer**: WCAG compliance, landmark structure, keyboard
>   navigation, screen reader readiness, colour contrast across themes
> - **design-system-reviewer**: token usage consistency, component API
>   correctness, visual regression triage, style containment
>
> These are not required for all projects. The gateway code-reviewer should
> triage to them when the change touches rendered UI, styling, or
> component APIs.

And a corresponding note in `practice-lineage.md` §Agent Pattern:

> For projects that ship user-facing UI, the minimum roster may expand to
> include accessibility and design-system reviewers. The gateway
> code-reviewer decides whether to invoke them based on the nature of the
> change.

## Why This Belongs in the Core

The Core already documents *how* to scale the reviewer roster
(production-reviewer-scaling.md in outgoing). What's missing is a single
sentence acknowledging that UI-specific reviewers are a legitimate category.
Without this, frontend projects either skip specialist review entirely or
reinvent the triage vocabulary each time.

## What Stays Local

The specific review criteria, WCAG level targets, design token inventories, and
component API contracts remain local to each repo's sub-agent templates.
