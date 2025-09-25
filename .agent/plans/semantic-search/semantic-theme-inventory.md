# Semantic Theme Inventory (Phase 1)

## Oak Components exports

- `oakDefaultTheme`: baseline `OakTheme` object containing 71 `uiColors` role tokens.
- `oakUiRoleTokens`: ordered tuple of the 71 UI roles consumed by Oak components (text, background, icon, border, code roles).
- `oakColorTokens`: base palette (50 named colour tokens, including greys, brand colours, accent palettes, transparency helpers).
- `oakFontSizeTokens`: scalar map (`font-size-1` → `font-size-10`, numeric px values).
- `oakFontTokens`: typography presets (headings, body, code, list styles) expressed as `[fontSizeToken, fontSizePx, weight, letterSpacing]`.
- `oakAllSpacingTokens`: primary spacing ramp (`all-spacing-0` → `all-spacing-24`, numeric px values from 0 to 1280).
- `oakSpaceBetweenTokens`: semantic spacing aliases referencing the core ramp (e.g. `space-between-s` → `all-spacing-4`).
- `oakInnerPaddingTokens`: padding aliases referencing the core ramp (e.g. `inner-padding-l` → `all-spacing-5`).
- `oakBorderRadiusTokens`: radius ramp (`border-radius-square` → `border-radius-circle`).

## Key type definitions (`dist/types.d.ts`)

- `type OakTheme = { name: string; uiColors: Record<OakUiRoleToken, OakColorToken | null | undefined>; }`
- `type OakUiRoleToken = (typeof oakUiRoleTokensConst)[number]`
- `type OakColorToken = keyof typeof oakColorTokens`
- `type OakFontToken = keyof typeof oakFontTokens`
- Spacing props accept responsive arrays (`ResponsiveValues<T>`); Oak components expect token names, not raw CSS units.

## Storybook references

Use https://components.thenational.academy/?path=/docs/introduction--docs as the hub:

- _Design Tokens → Colour_: lists UI role tokens mapped to palette values.
- _Design Tokens → Typography_: documents Lexend ramp and body/caption presets.
- _Design Tokens → Spacing_: shows `all-spacing-*`, `space-between-*`, and `inner-padding-*` usage patterns.
- _Design Tokens → Borders_: covers radius tokens and border utilities.

## Immediate observations

- Current semantic themes should cease inventing bespoke spacing/typography scales; reuse the Oak ramps and expose helpers that translate token names to CSS values for custom surfaces.
- The light theme can default to `oakDefaultTheme.uiColors` and override a minimal subset (links, emphasis backgrounds). The dark theme requires a full map (no `Partial`) but should continue to speak in Oak colour tokens wherever possible.
- Additional app-specific tokens (e.g. `app.colors.headerBorder`) should either:
  1. Alias an Oak colour token; or
  2. Live in a constant spec with a derived type/guard, clearly documenting why an Oak token is insufficient.
- Typography enhancements from the Phase 1 backlog should be expressed via `OakFontToken`s (e.g. `heading-2`, `body-4`) and font family constants drawn from the Oak typography guidance (Lexend primary, Work Sans secondary).
- Spacing variables emitted through `ThemeCssVars` should map Oak token identifiers to rem values so layout components can continue using token names.

## Next steps

1. Model `semanticThemeSpec` with explicit `uiColors` maps for light/dark (full `OakUiRoleToken` coverage) and an app-specific section referencing Oak spacing/typography tokens.
2. Provide derived types (e.g. `type SemanticMode = keyof typeof semanticThemeSpec`) and guards to ensure tests can flag drift.
3. Update `ThemeBridgeProvider` helpers to translate Oak token names into CSS variables, keeping the mapping in lockstep with the spec.
