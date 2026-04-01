# Core Proposal: Browser Testing Taxonomy

> **Origin**: opal-connection-site, 2026-03-28
> **Source evidence**: static Astro site with Playwright accessibility gates
> **Status**: Proposal for Practice Core vocabulary expansion
> **Target files**: `practice-lineage.md` §Testing Philosophy, `practice.md`
>   §Quality Gates

## The Gap

The Core's testing taxonomy names two levels: **unit** (pure function, no mocks)
and **integration** (units as code, simple mocks). It also names prohibited
patterns (global state, mock overreach). This vocabulary is sufficient for
backend and library projects but silent on browser-specific proof surfaces.

When the Practice arrives in a UI-first project, agents have no vocabulary for
the proof layers that actually matter. They default to backend-style reasoning
about frontend concerns, or worse, treat accessibility and visual correctness as
optional extras rather than blocking gates.

## Proposed Additions

### Testing Philosophy (practice-lineage.md)

Add after the existing unit/integration definitions:

> **Browser proof surfaces** extend the testing philosophy to UI-first projects:
>
> - **Accessibility audit**: automated WCAG compliance checks (axe-core,
>   Lighthouse, or equivalent) run against rendered pages. These are
>   structural correctness checks analogous to type-checking — they prove
>   the output is valid for all users, not just sighted mouse users.
> - **Visual regression**: pixel-level or perceptual comparison of rendered
>   output against baselines. Proves that style changes do not break
>   unrelated surfaces.
> - **Responsive validation**: proof that layouts behave correctly across
>   viewport sizes. Can be automated (viewport-parameterised tests) or
>   structured manual verification with documented breakpoints.
> - **Theme/mode correctness**: proof that alternate visual modes (dark mode,
>   high contrast, reduced motion) maintain contrast, readability, and
>   interaction correctness.
>
> These are not replacements for unit and integration tests. They are
> additional proof layers for projects whose primary output is rendered UI.
> Apply TDD to logic; apply these surfaces to presentation.

### Quality Gates (practice.md)

Add a 9th gate category after "specialist review":

> 9. **Accessibility audit** (WCAG compliance, landmark structure, contrast
>    ratios). Blocking for any project that ships user-facing HTML.

## Why This Belongs in the Core

Accessibility is not a niche concern — it is as universal as type-checking for
any project that renders UI. The Core already names 8 gate categories; the 9th
closes a vocabulary gap that every frontend project hits. The browser proof
surfaces are analogous to the existing unit/integration distinction — they name
*what kind of proof* to reach for, not *which tool* to use.

## What Stays Local

Specific tooling choices (Playwright vs. Cypress, axe-core vs. Lighthouse),
WCAG level targets (A vs. AA vs. AAA), and viewport breakpoint strategies remain
local decisions documented in each repo's `testing-strategy.md`.
