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

## Source Format: DTCG JSON (transitioning per ADR-213)

The W3C Design Tokens Community Group (DTCG) JSON format is the
source format for the hand-authored trees in `oak-design-tokens`.
Pre-W3C-Recommendation living document.

[ADR-213](../architecture/architectural-decisions/213-design-system-integration-and-component-architecture.md)
supersedes this direction in part (Accepted 2026-07-20; the
supersession is now in force): the decided end state is that the
integrated design system's CSS is the token source of truth and DTCG
JSON is a generated projection of it. Until ADR-213's Stage B atomic switch
lands (deleting the hand-authored trees and re-pointing generation at
the design system's export), the DTCG trees described here remain the
live mechanism.

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

The build pipeline validates tier referencing rules, runs WCAG
contrast validation, and generates CSS custom properties. A
failing contrast check blocks the build.

## Contrast Validation

The build pipeline checks all declared colour pairings against
WCAG 2.2 AA thresholds. The system has three components:

1. **Pure functions** (`design-tokens-core`): `hexToSrgb`,
   `srgbToRelativeLuminance`, `contrastRatio`, `checkWcagAA`,
   `checkNonTextContrast`, `resolveTokenTreeToHex`,
   `validateContrastPairings`
2. **Pairing manifest** (`oak-design-tokens/src/tokens/contrast-pairings.ts`):
   human-authored declaration of which fg/bg pairs to check, including
   triads for layered elements (e.g. button text on button on page)
3. **Report** (`oak-design-tokens/dist/contrast-report.json`):
   machine-generated with computed ratios per theme

### Thresholds

- **Text (SC 1.4.3)**: 4.5:1 normal, 3:1 large
- **Non-text (SC 1.4.11)**: 3:1 for UI components

### Adding New Pairings

When introducing new colour tokens, add entries to
`contrast-pairings.ts`. The build validates both themes
automatically. For layered elements (e.g. button text on button
surface on page), use the triadic model — all three pairwise
ratios must independently pass.

## Consumption Patterns

### MCP App Views (Primary Consumer)

The widget build (`widget/vite.config.ts`) imports the generated CSS
from `@oaknational/oak-design-tokens`. Vite's `vite-plugin-singlefile`
inlines it into `oak-banner.html`. The design token CSS itself needs
no CDN, but the widget's Google Fonts `@import` (for Lexend) requires
`_meta.ui.csp.resourceDomains` declaring `fonts.googleapis.com` and
`fonts.gstatic.com` on the MCP resource registration.

### Future Consumers

Astro sites, Next.js apps, or static HTML surfaces import the same
generated CSS through their own build systems. The CSS is
framework-agnostic — it works with any CSS-capable environment.

## Theming

Themes override semantic tokens for a given mode. The palette tier
remains constant; the semantic tier maps differently per theme.

**Never express elevation or interaction-state light in absolute colours
inside the themed system** (owner-ratified, 2026-07-25, EMC2 button-states
arc). A hover/press calibration hardcoding raw white/black mixes or a
fixed shadow hex bypasses the theme tier and breaks exactly where themes
diverge: the first EMC2 calibration was perfect in dark, washed out in
light, and produced a magenta shadow with unanchored motion in
high-contrast. Tokenize the state faces and shadows and let **each theme
re-declare its light regime**: physics (translate/scale) may be universal,
but "lighter on hover" is theme-spoken — dark lights with white, light
lifts with the brand's own hue (chroma-preserving, never raw white on a
dark face) and presses by removing gloss (removing light IS darkening at
pigment floor), high-contrast keeps a subtle crisp ink shadow at reduced
scale. Interaction-state design is un-reviewable in static screenshots —
build a live hover/press lab for state rulings.

Dark mode uses a dual-selector approach in generated CSS:

1. `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { ... } }`
   — CSS-only OS preference detection, no JavaScript required
2. `[data-theme='dark'] { ... }` — explicit override via
   `applyDocumentTheme()` from the MCP Apps SDK host context

The `:not([data-theme='light'])` specificity trick lets an explicit
light override win over an OS dark preference. Never set `data-theme`
eagerly on page load — let the CSS media query govern by default.

The hand-authored `oak-design-tokens` pipeline gates light and dark
themes at the WCAG AA floor. Since the design-system integration's PR3
cycle 3, a second gate over the imported design-system dtcg export
validates all four themes (light, dark, high-contrast, colour-safe) —
high-contrast at AAA thresholds, the rest at the AA floor (ADR-213 §2,
2026-07-20). This dual-gate window is deliberate: both gates run during
the staged token-source convergence. It collapses at ADR-213 Stage B,
when the hand-authored trees and their gate are deleted and generation
re-points onto the design system as the single token source.

Throughout that window the authority relationship is fixed: the design
system (`packages/design/oak-design-system`, ADR-213) is the design source
of truth, and the hand-authored `oak-design-tokens` tree is legacy delivery
plumbing awaiting Stage B — its semantic mappings and contrast pairings are
not design authority. A design question is answered from the design system
and the owner's rendered approval, never from what the old package happens
to encode; where the two conflict the old code is the thing to replace or
route to the Stage B lane, never a constraint to design within. Presenting
legacy-package state as "ratified" or "audited" inverts that relationship
(owner, 2026-07-28: "We replace old code with new code, we don't silently
defer to it"). And describe what a render shows by looking at the render —
a screenshot, a browser — never by narrating token names and hex values.

## oak-components Relationship

Reference-only for value extraction during authoring. Oak palette hex
codes, typeface names, and spacing scale values are referenced when
authoring `@oaknational/oak-design-tokens`. The relationship ends
after authoring — no import, no peer dependency, no runtime coupling.

## References

- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [DTCG Format Specification](https://www.designtokens.org/TR/2025.10/format/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
