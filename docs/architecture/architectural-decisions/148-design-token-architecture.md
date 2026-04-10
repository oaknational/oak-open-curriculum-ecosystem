# ADR-148: Design Token Architecture

**Status**: Accepted
**Date**: 2026-04-02
**Related**: [ADR-041 (Workspace Structure)](041-workspace-structure-option-a.md), [ADR-129 (Domain Specialist Capability Pattern)](129-domain-specialist-capability-pattern.md), [ADR-141 (MCP Apps Standard)](141-mcp-apps-standard-primary.md), [ADR-149 (Frontend Specialist Reviewer Gateway Cluster)](149-frontend-specialist-reviewer-gateway-cluster.md)

## Context

A survey of four related repositories (oak-components, Oak-Web-Application,
oak-ai-lesson-assistant, opal-connection-site) and one starter app
(starter-app-spike) revealed fragmented approaches to design tokens:

- **oak-components**: TypeScript objects, styled-components themes, no
  framework-agnostic path
- **Oak-Web-Application**: Dual theme system (app + oak-components),
  complex and tightly coupled
- **oak-ai-lesson-assistant**: Triple styling stack (Tailwind +
  styled-components + Radix Themes), no centralised governance
- **opal-connection-site**: Clean three-tier CSS custom properties,
  framework-agnostic, accessibility-tested — closest to the target
- **starter-app-spike**: 12-mode generated CSS system, sophisticated but
  coupled to oak-components internals

This repository is building MCP App views that render as self-contained
HTML resources inside host-provided iframes. These views need a
framework-agnostic, lightweight token system that works without runtime
JavaScript dependencies.

## Decision

### Source Format: DTCG JSON

Adopt the W3C Design Tokens Community Group (DTCG) JSON format as the
source format for all design tokens.

The DTCG specification is a pre-W3C-Recommendation community report
(living document). This ADR links to the current draft and accepts that
the format may evolve. No version pin — the format is treated as a
living standard reference.

### Three-Tier Model

Tokens are organised in three tiers with strict referencing rules:

1. **Palette tokens** — raw values (hex colours, pixel sizes, font names)
2. **Semantic tokens** — purpose-driven references to palette tokens
   (`text-primary`, `bg-surface`, `spacing-md`)
3. **Component tokens** — component-specific references to semantic tokens
   (`button-primary-bg`, `card-border-radius`)

Referencing direction: component → semantic → palette. Skipping tiers
(component referencing palette directly) is a violation.

### Output Format: CSS Custom Properties

CSS custom properties are the primary delivery format. This is
framework-agnostic — consumable by React, Astro, static HTML, or any
CSS-capable environment. Optional secondary outputs (TypeScript types,
JSON) may be generated but are not the primary consumption path.

### Workspace Location: `packages/design/`

Token workspaces live in `packages/design/`, a new category in the
workspace structure (ADR-041 amended). Design tokens produce CSS
artefacts, not TypeScript APIs — categorically different from foundation
libs, adapter libs, and SDKs.

Two workspaces:

- **`@oaknational/design-tokens-core`** — framework-agnostic token
  infrastructure: schema, build pipeline, tier enforcement, contrast
  validation
- **`@oaknational/oak-design-tokens`** — Oak-specific token set: palette,
  semantic layer, themes, generated CSS

### Build-Time Contrast Validation

The build pipeline validates all declared colour pairings against WCAG 2.2
AA thresholds (4.5:1 for text, 3:1 for non-text). Violations fail the
build. Pairings are declared in `contrast-pairings.ts` with an explicit
`context: 'text' | 'non-text'` field — a token passing the non-text
threshold may still fail when used as text colour. The `OAK_TOKEN_DEV=1`
environment variable downgrades violations to warnings for local iteration
without disabling the CI gate.

### Token-to-Consumer Delivery

Primary delivery is CSS custom properties bundled into the MCP App HTML
resource via Vite. The widget imports the built CSS from
`@oaknational/oak-design-tokens` — Vite's `vite-plugin-singlefile`
inlines it into `mcp-app.html`. No separate CDN or
`_meta.ui.csp.resourceDomains` entry needed for tokens.

Future consumers (Astro sites, other apps) import the same CSS through
their own build systems.

### oak-components Relationship

Reference-only for value extraction. Oak palette hex codes, typeface
names, and spacing scale values are referenced when authoring
`@oaknational/oak-design-tokens`. The relationship ends after authoring.
No import, no peer dependency, no runtime coupling. None of the consuming
sites will use oak-components as a dependency.

## Rationale

### Why not TypeScript objects (oak-components approach)

TypeScript objects lock tokens to a JavaScript runtime and a specific
component library. MCP App views are self-contained HTML — they need CSS,
not JS imports. Framework-agnostic CSS custom properties work everywhere.

### Why not Tailwind config

Tailwind is a utility-first CSS framework, not a token system. Tokens
should be consumable by any approach — Tailwind, vanilla CSS, CSS-in-JS,
or framework-specific solutions. CSS custom properties are the lowest
common denominator.

### Why not CSS-in-JS

CSS-in-JS adds runtime JavaScript to resolve styles. MCP App views are
static HTML resources — adding a CSS-in-JS runtime increases bundle size
and complexity for no benefit. CSS custom properties resolve at parse time
with zero runtime cost.

### Why DTCG over alternatives

The W3C Design Tokens Community Group format is the emerging industry
standard. Style Dictionary, Figma Tokens, and Tokens Studio all converge
toward DTCG compatibility. Adopting the standard now avoids migration
later. The format is JSON-based, tool-friendly, and well-documented.

### Why a separate package, not in a component library

Tokens are consumed by surfaces that never import React components (Astro
sites, static HTML, MCP App resources). Coupling tokens to a component
library forces those consumers to depend on React. A separate package
with CSS output is the minimal, correct dependency.

## Consequences

### Positive

- MCP App views get a correct, lightweight token foundation from the start
- Any future Oak surface can consume the same tokens without framework
  coupling
- The three-tier model prevents the token sprawl seen in existing repos
- DTCG format aligns with industry direction and tool ecosystem

### Negative

- Two new workspaces to maintain. Mitigation: the harness is generic and
  stable; the token set grows incrementally driven by consumer needs
- DTCG spec may evolve (pre-W3C-Recommendation). Mitigation: the format
  is simple JSON; migration cost is low if the spec changes

### Cross-References

- ADR-041 amended to add `packages/design/` category
- `design-system-reviewer` (ADR-149) enforces token governance
- `docs/governance/design-token-practice.md` provides authoring and build
  pipeline guidance
