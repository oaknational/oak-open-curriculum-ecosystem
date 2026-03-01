# Design-System-Agnostic Component Library — Report

**Date:** 2026-03-01
**Status:** Proposal
**Author:** Jim (with AI analysis)

---

## Executive Summary

This report proposes a **design-system-agnostic component library** built as a monorepo, where headless behaviour is completely separated from visual design, and multiple design systems can plug into the same component infrastructure.

To prove the abstraction works from day one, the library ships with **two complete design systems**:

1. **Oak** — Oak National Academy's existing brand: warm greens, Lexend typography, rounded corners, playful hand-drawn elements
2. **Zinc** — A contrasting proof-of-concept: cool slate/indigo palette, Inter typography, sharp geometry, minimal shadows, tighter spacing

If a component only looks right with Oak tokens, the abstraction has failed. The Zinc design system exists to keep the architecture honest.

Technology: **Ark UI (Zag.js)** for headless behaviour, **modern CSS** (custom properties, nesting, `@layer`, `@container`, `color-mix()`) for styling, **data-attribute scoping** for component recipes, **pure CSS layout utilities** as an optional package. No Tailwind. No CSS-in-JS runtime. No styled-components.

The target framework is **React + Next.js**, but the architecture preserves multi-framework flexibility by keeping tokens, recipes, and layout as framework-agnostic CSS. Only the headless and composed layers are React-specific.

---

## Report Sections

| # | Document | Summary |
|---|----------|---------|
| 1 | [Current State Analysis](./01-current-state.md) | What oak-components is today, how it's consumed, and its problems |
| 2 | [Architectural Decisions](./02-decisions.md) | The six key decisions and their rationale |
| 3 | [Monorepo Structure](./03-monorepo.md) | Package layout, dependency graph, published packages |
| 4 | [Core Infrastructure](./04-core.md) | Token schema contract, shared types, CSS prefix convention, test helpers |
| 5 | [Headless Components](./05-headless.md) | Ark UI integration, what the headless layer provides and doesn't |
| 6 | [Recipes and Styling](./06-recipes.md) | Data-attribute scoping, `@layer`, recipe examples, why not CSS Modules |
| 7 | [Layout Package](./07-layout.md) | Optional pure-CSS layout utilities, the "Every Layout" approach |
| 8 | [Design System — Oak](./08-oak.md) | Oak token values, character, brand-specific components |
| 9 | [Design System — Zinc](./09-zinc.md) | Zinc token values, character, brand-specific components |
| 10 | [Component Scope](./10-components.md) | What's built, what's not, tier breakdown |
| 11 | [Accessibility](./11-accessibility.md) | Ark UI a11y, cross-system requirements, testing strategy |
| 12 | [Why Not Tailwind](./12-no-tailwind.md) | Assessment and rationale |
| 13 | [Effort Estimate and Plan](./13-plan.md) | Phased timeline, task breakdown |
| 14 | [Migration Strategy](./14-migration.md) | Side-by-side approach, API translation, effort estimate |
| 15 | [Risks and Open Questions](./15-risks.md) | Risk register, mitigations, open decisions |
| 16 | [Appendices](./16-appendices.md) | Token comparison, reference architectures, CSS browser support |

---

## Key Decisions Summary

1. **Design-system-agnostic from day one** — two design systems (Oak + Zinc) prove the abstraction
2. **Modern CSS, no CSS-in-JS, no Tailwind** — CSS custom properties, nesting, `@layer`, `@container`
3. **Ark UI (Zag.js) for headless behaviour** — state-machine-based a11y, multi-framework foundation
4. **Data attributes for semantic variants only** — `data-intent`, `data-size`, `data-state`; never `data-padding` or `data-gap`
5. **No general-purpose layout primitives in the component library** — layout is a separate, optional, pure-CSS package
6. **React + Next.js as the target** — but tokens, recipes, and layout are framework-agnostic CSS
