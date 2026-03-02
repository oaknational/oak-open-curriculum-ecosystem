# 2. Architectural Decisions

## Decision 1: Design-system-agnostic from day one

Build the component infrastructure independent of any specific design system. Ship two design systems (Oak and Zinc) to prove the abstraction works.

**Rationale:** Oak serves multiple audiences (pupils, teachers, internal tools, partner integrations). Future products may need different visual treatments. A design-system-agnostic core enables reuse across all of these without forking. The second design system (Zinc) exists as a structural proof — if it looks correct, the abstraction is correct.

**Principle:** A component's behaviour should never know what design system it's wearing. Swapping design systems is a CSS import change, not a code change.

## Decision 2: Modern CSS, no CSS-in-JS, no Tailwind

Use CSS custom properties, CSS nesting, `@layer`, `@container`, `color-mix()`, and data attributes.

**Why no CSS-in-JS:** Zero runtime overhead, no hydration complexity, no forced dependency on consumers. CSS is the platform.

**Why no Tailwind:** Tailwind's strengths (rapid prototyping, inline co-location, constraint enforcement) are application-level benefits. At the library level, Tailwind forces a build dependency on every consumer, introduces className merging complexity, and obscures styles in DevTools. Modern CSS natively provides everything needed. See [12-no-tailwind.md](./12-no-tailwind.md) for the full assessment.

## Decision 3: Ark UI (Zag.js) for headless behaviour

Use Ark UI rather than Radix Primitives.

**Rationale:** Ark UI is built on Zag.js — finite state machines that encode ARIA states and keyboard interactions as first-class state transitions. The a11y behaviour is correct by construction, not by careful manual coding. While Radix has more production usage, Ark has a sound architectural approach where a fix to a state machine benefits all framework bindings simultaneously.

**Multi-framework benefit:** Ark UI has bindings for React, Vue, Svelte, and Solid from a single codebase. Although the current target is React + Next.js only, this preserves the option to support other frameworks in the future by reusing the same state machines.

**A11y comparison:**

| | Radix | Ark UI |
|--|-------|--------|
| ARIA coverage | Comprehensive | Comprehensive |
| Approach | Hand-authored per component | State machines enforce correctness |
| Production testing | Very large (shadcn/ui) | Smaller but growing (Chakra v3, Park UI) |
| Edge case coverage | More bug-fix history | Architecturally fewer edge cases |

## Decision 4: Data attributes for semantic variants only

Use `data-intent`, `data-size`, `data-state` on components. Never `data-padding`, `data-gap`, `data-background`.

**Rationale:** Data attributes on semantic components (Button, Dialog, Tabs) are variant selectors — a well-established pattern. A button has 2-3 variant dimensions. This is not a utility system.

Mapping every layout property to a data attribute (padding, margin, gap, direction) would be reinventing Tailwind with worse syntax. The library provides semantic components with constrained variants, not a general-purpose styling system.

**Rule:** If a data attribute maps to a single CSS property (data-padding → padding), it's a utility and doesn't belong. If it maps to a coordinated set of styles (data-intent="primary" → background, color, hover state, focus ring), it's a variant and it belongs.

## Decision 5: Layout is a separate, optional, pure-CSS package

Layout utilities live in their own workspace (`@oaknational/ds-layout`), are pure CSS with no framework dependency, and are completely optional.

**Rationale:** Layout is page-level concern, not a component-level concern. Different applications have different layout needs. The component library should not impose a layout system. But providing well-designed, token-aware layout utilities as an opt-in is helpful for teams that want them.

See [07-layout.md](./07-layout.md) for the full layout package design.

## Decision 6: React + Next.js as the target, flexibility preserved

Build React components using Ark UI's React bindings. Do not build Vue, Svelte, or Solid packages.

**Rationale:** Oak's current applications are React + Next.js. Building for other frameworks without a concrete consumer would be premature. However, the architecture preserves this option:

- Tokens (CSS files) — 100% reusable across frameworks
- Recipes (CSS files) — 100% reusable across frameworks
- Layout (CSS files) — 100% reusable across frameworks
- Headless + composed — rebuild per framework using Ark UI's bindings for that framework

Only the thinnest layers (headless wrappers and composed components) would need rebuilding. The expensive design work (tokens, recipes, accessibility state machines) is shared.
