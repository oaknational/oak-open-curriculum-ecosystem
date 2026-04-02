---
fitness_line_target: 150
fitness_line_limit: 200
fitness_char_limit: 10000
fitness_line_length: 100
split_strategy: 'Extract authoring examples to a companion file if token-specific guidance grows'
---

# Design Token Practice

This document defines the design token architecture and authoring
practices for this repository. It is the durable reference that
workspace READMEs and reviewer reading requirements link to.

**Architectural decision**:
[ADR-148](../architecture/architectural-decisions/148-design-token-architecture.md)

## Source Format: DTCG JSON

The W3C Design Tokens Community Group (DTCG) JSON format is the
source format. Pre-W3C-Recommendation living document.

Key conventions: `$type` declares the token type, `$value` holds a
resolved value or reference (`{group.name}`), groups are nested
JSON objects defining the token path.

## Three-Tier Model

Tokens use three tiers with strict referencing direction:
component → semantic → palette. Skipping tiers is a violation.

```json
{
  "color": {
    "navy-900": { "$type": "color", "$value": "#1a1a2e" },
    "oak-green": { "$type": "color", "$value": "#287d3c" },
    "white": { "$type": "color", "$value": "#ffffff" }
  },
  "semantic": {
    "text-primary": { "$type": "color", "$value": "{color.navy-900}" },
    "bg-surface": { "$type": "color", "$value": "{color.white}" }
  },
  "button": {
    "primary-bg": { "$type": "color", "$value": "{semantic.bg-surface}" }
  }
}
```

- **Palette** — raw values, named by intrinsic property
- **Semantic** — purpose-driven, reference palette tokens only
- **Component** — component-specific, reference semantic tokens only

## Build Pipeline

DTCG JSON source files → build pipeline → CSS custom properties.

Output example:

```css
:root {
  --color-navy-900: #1a1a2e;
  --color-oak-green: #287d3c;
  --semantic-text-primary: var(--color-navy-900);
  --semantic-bg-surface: #ffffff;
  --button-primary-bg: var(--semantic-bg-surface);
}
```

The build pipeline validates tier referencing rules and generates
contrast ratio reports for colour token pairs.

## Consumption Patterns

### MCP App Views (Primary Consumer)

The widget build (`widget/vite.config.ts`) imports the generated CSS
from `@oaknational/oak-design-tokens`. Vite's `vite-plugin-singlefile`
inlines it into `mcp-app.html`. No CDN or
`_meta.ui.csp.resourceDomains` entry needed.

### Future Consumers

Astro sites, Next.js apps, or static HTML surfaces import the same
generated CSS through their own build systems. The CSS is
framework-agnostic — it works with any CSS-capable environment.

## Theming

Themes override semantic tokens for a given mode. The palette tier
remains constant; the semantic tier maps differently per theme.

```css
[data-theme='dark'] {
  --semantic-text-primary: #e0e0e0;
  --semantic-bg-surface: #1a1a2e;
}
```

Minimum requirement: light and dark themes. High-contrast and
reduced-motion modes are future extensions.

## oak-components Relationship

Reference-only for value extraction during authoring. Oak palette hex
codes, typeface names, and spacing scale values are referenced when
authoring `@oaknational/oak-design-tokens`. The relationship ends
after authoring — no import, no peer dependency, no runtime coupling.

## References

- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [DTCG Format Specification](https://www.designtokens.org/TR/2025.10/format/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
