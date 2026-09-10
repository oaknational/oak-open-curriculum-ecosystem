---
id: H002
status: testing
confidence: low
evidence_snapshot: OWA 510ac63; Oak Components 8ff8264; OCE bd878a3
last_updated: 2026-07-19
---

# H002: Layered UI platform

## Claim

**Hypothesis:** Oak's visual and interaction capabilities will have clearer semantics if foundations, accessible behaviour, framework/provider adapters and outcome-specific compositions have explicit dependency boundaries where their authority and lifecycle genuinely differ.

This does not assume that OCE needs a React component library, that these are separate packages, or that all four layers survive premise analysis.

## Why it is plausible

**Observed:** Oak Components exposes components, styles, hooks and test helpers from one root entry ([source](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/index.ts#L1-L4)).

**Observed:** The public component barrel includes general controls and layout alongside OWA-specific product UI ([source](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/index.ts#L1-L14)).

**Observed:** The package is compiled as one ESM file, one CJS file and one declaration entry ([source](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/rollup.config.js#L12-L43)).

## Predictions

If the hypothesis is useful:

1. Tokens can be consumed without React, Next.js or browser-only code.
2. Shared accessible behaviour can be tested without application services or product recipes.
3. Host-specific image, link, font and server/client behaviour enters only where the chosen host requires it.
4. Product recipes can evolve with their owning capability without widening the foundational API.
5. Supported exports, bundle inclusion and server/client compatibility become measurable contracts.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- the required Oak expression and accessible interactions are better represented through native elements, generated styles or another model that makes the proposed UI layers unnecessary;
- public values cannot be assigned to the proposed boundaries without dependencies on higher-level product or host concerns;
- a layered prototype does not clarify runtime, ownership or semantic contracts and instead adds indirection;
- the current root and proposed entries produce the same successful Pages, App server and App client matrix, with no ambiguous client-only import behavior;
- moving representative pupil and teacher compositions behind shared-control contracts still requires private-internal imports or duplicates accessible interaction behaviour;
- apparently shared controls require incompatible semantics across outcomes and should not have one abstraction.

## Most direct discriminating work

1. Build a public-export to OWA-usage matrix and map component names to the underlying visual, semantic and interaction needs.
2. Measure ESM and CJS package output, tree-shaking and a minimal consumer bundle.
3. Challenge whether tokens, primitives, controls, adapters and recipes require a component library or can collapse into generated CSS, native elements and a smaller body of shared behaviour.
4. Test competing designs in representative server, client and host contexts.
5. Record which boundaries remain necessary for semantic authority, accessibility and independent evolution.

## Decision affected

How the Innovation Kit should express Oak's visual language and accessible interaction capabilities, including whether a shared component runtime is needed at all.

## Evidence history

- **2026-07-19:** Proposed from initial source, package and OWA integration mapping.
- **2026-07-19:** Recent paired history shows OWA product changes upgrading Oak Components and product-ticketed work landing in the library. This makes product-recipe and release ownership testable, but does not validate the proposed layers.
- **2026-07-19:** [Component-boundary map](../current-state/component-boundary.md) classified 425 public names and found visible source layers, concentrated primitive use, framework coupling in the root contract and 27 OWA recipe files reaching private internals. The next test keeps one release unit and experiments with export/dependency contracts before considering package separation.
- **2026-07-19:** [Accessibility and assurance map](../current-state/accessibility-and-assurance.md) found distinct package, isolated-component, deployed-page and journey obligations. Whether layer-specific gates find distinct failures remains an invalidator to test.
- **2026-07-19:** [Package runtime experiment](../experiments/oak-components-runtime.md) found a roughly 94 KB gzip floor for isolated token, primitive and control root imports with framework peers external, versus 161 KB for the namespace. Minimal Next Client Component fixtures built; root imports of token data and `OakBox` failed through Server Components. This supports a multi-entry experiment inside one release unit, not a package split or production bundle claim.
- **2026-07-19:** [Production topology](../current-state/production-topology.md) confirms that package publication, Components Storybook and OWA deployment are separate artifacts. Their live coordination is unknown, reinforcing the one-release multi-entry test before adding another independently versioned unit.
