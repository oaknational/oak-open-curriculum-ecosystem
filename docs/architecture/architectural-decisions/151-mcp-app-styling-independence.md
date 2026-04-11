# ADR-151: MCP App Styling Independence from Oak Web Application and Oak Components

**Status**: Accepted
**Date**: 2026-04-03
**Related**: [ADR-141 (MCP Apps Standard)](141-mcp-apps-standard-primary.md), [ADR-148 (Design Token Architecture)](148-design-token-architecture.md), [ADR-147 (Browser Accessibility as Blocking Quality Gate)](147-browser-accessibility-as-blocking-quality-gate.md), [ADR-045 (Hybrid Theming Bridge)](045-hybrid-theming-bridge-for-oak-components.md) (historical; already superseded, further ruled out by this decision)

## Context

The MCP App views (brand banner, interactive search) are the first visual
UI in this repository and will serve as the foundation other teams build
from. Two existing Oak codebases provide styling infrastructure:

- **Oak Web Application** — styled-components with a JavaScript theme
  object, 50+ colour tokens, 21 typography variants, exhaustive spacing
  scale
- **Oak Components** — styled-components design system library with
  `OakBox`, `OakFlex`, `OakGrid`, 90+ UI role tokens, parser functions,
  and polymorphic component patterns

Both are mature, well-typed, and serve their respective applications
well. The question is whether MCP App views should consume either of
these systems.

## Decision

MCP App views consume `@oaknational/oak-design-tokens` CSS custom
properties exclusively. They do not import or depend on Oak Web
Application's theme system or Oak Components' styled-components library.

## Rationale

### MCP Apps are self-contained HTML resources

MCP App views render inside a sandboxed iframe provided by the MCP host
(Claude, VS Code Copilot, etc.). Per ADR-141 and the MCP Apps
specification, the widget is built with `vite-plugin-singlefile` into a
single HTML file with all CSS and JS inlined. There are no external
network requests for styling, fonts, or framework code — the host may
apply strict Content Security Policy, and CI runners have no internet
access.

This is a hard architectural boundary. The widget HTML resource must be
entirely self-contained.

### Oak Web Application: wrong technology, wrong delivery model

Oak Web Application uses styled-components with a JavaScript theme
object propagated through React's `ThemeProvider`. This approach:

1. **Requires a JS runtime to resolve any styling.** The theme object is
   JavaScript. Without the ThemeProvider in scope, no component has
   access to any token value. MCP App views need CSS that works the
   moment the HTML loads — the host renders the iframe before React
   hydrates.

2. **Has no CSS custom property layer.** The token system is entirely
   JS-side. There is no `--oak-color-*` or `--oak-spacing-*` custom
   property surface. The tokens cannot participate in CSS cascade,
   cannot respond to media queries for theme switching, and cannot be
   consumed by non-React contexts.

3. **Cannot handle host theme integration.** The MCP Apps SDK provides
   73 host style variables in a `--color-*` CSS namespace. The widget
   must consume these via CSS custom properties to feel native within
   each host. A JS-only theme system cannot compose with CSS-level host
   variables without a bridge layer — and this repository does not
   create bridge layers (see principles: no compatibility layers, no
   shims, no workarounds).

4. **Couples to a specific version of styled-components.** Adopting it
   would introduce a heavyweight CSS-in-JS dependency into a widget
   that should be as small as possible. The dependency exists solely
   to resolve tokens that could be CSS custom properties.

### Oak Components: right direction, wrong delivery mechanism

Oak Components is closer to what MCP App views need — it has a
comprehensive token system and well-designed components. However:

1. **Same styled-components dependency.** Importing any component brings
   the styled-components runtime into the bundle. For a self-contained
   HTML resource, this is unnecessary weight when CSS custom properties
   achieve the same result with zero runtime cost.

2. **Token consumption requires ThemeProvider.** Every `parseColor()`,
   `parseSpacing()`, and `parseBorderRadius()` call accesses
   `props.theme`. Without the ThemeProvider wrapping the component tree,
   token resolution fails. The MCP App widget has its own lifecycle —
   it initialises via `useApp()` from the MCP Apps SDK, not via Oak's
   ThemeProvider.

3. **No CSS-level dark mode.** Oak Components has a dark theme
   definition but the token architecture is JS-object-based switching.
   MCP App views need CSS-level theme switching that responds to the
   host's theme context (set via `data-theme` attribute from the MCP
   Apps SDK's `applyDocumentTheme()`).

4. **Component surface area far exceeds need.** The MCP App views need
   a banner link and a search combobox. Importing Oak Components to get
   `OakBox` and `OakFlex` brings the entire parser layer, 90+ UI role
   tokens, 29 typography variants, and polymorphic component machinery.
   This violates KISS and YAGNI for two focused views.

### What we build instead

The token architecture defined in [ADR-148](148-design-token-architecture.md)
provides the CSS custom property foundation. This decision is about what
MCP App views do **not** consume — the two existing styling systems — and
why. The ADR-148 architecture is the correct fit because it:

- Works the moment the HTML loads (CSS custom properties resolve without
  JS)
- Composes with MCP host style variables (both are CSS custom properties
  in separate `--oak-*` and `--color-*` namespaces)
- Supports theme switching via `[data-theme]` CSS selectors
- Produces a minimal, self-contained bundle

## Consequences

### Positive

- MCP App views are fully self-contained with no external runtime
  dependencies, meeting the MCP Apps sandboxing and CSP requirements.
- Token values in `@oaknational/oak-design-tokens` are the single source
  of truth for MCP App views. Visual consistency with Oak's brand is
  maintained through token values authored with reference to the Oak
  palette and typeface choices — not through shared components.
- MCP App views serve as the reference implementation for CSS-first
  token consumption within this repository.

### Negative

- MCP App views cannot use `OakBox`, `OakFlex`, `OakGrid`, or any Oak
  Components React components. Views use plain HTML elements styled with
  CSS custom properties.
- MCP App views have no shared component library. Each view builds its
  interactive primitives (buttons, inputs, layout containers) from plain
  HTML elements styled with CSS custom properties. Teams building new
  views must budget for accessible, branded primitive construction.
- Token values in `@oaknational/oak-design-tokens` are authored with
  reference to the Oak palette but are not generated from or locked to
  Oak Components' token definitions. The MCP token set and
  oak-components use different hex values and different spacing models.
  Palette evolution in oak-components requires a manual review cycle to
  determine whether MCP App token values should be updated. The
  `design-system-reviewer` (ADR-149) is responsible for this governance.
- If Oak Components migrates to CSS custom properties in future, MCP App
  views could adopt shared components — but that is a future decision,
  not a compatibility layer to build now.

### Cross-References

- [ADR-148](148-design-token-architecture.md) — defines the token
  architecture that MCP App views consume
- [ADR-149](149-frontend-specialist-reviewer-gateway-cluster.md) —
  `design-system-reviewer` enforces token governance including palette
  alignment
- [ADR-045](045-hybrid-theming-bridge-for-oak-components.md) —
  historical predecessor; attempted to bridge Oak Components theming into
  this repository (superseded independently when the Next.js UI layer
  was removed; further ruled out by this decision on architectural
  grounds)
