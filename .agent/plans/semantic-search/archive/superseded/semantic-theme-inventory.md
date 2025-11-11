# Semantic Theme Inventory (Phase 1)

_Last reviewed: 2025-09-26 (post Admin/Docs responsive refactor)_

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

## Current implementation notes

- Light/dark `semanticThemeSpec` entries now provide full `OakUiRoleToken` coverage via `buildUiColorMap`, overriding only the tokens that diverge from `oakDefaultTheme` (links, emphasis backgrounds, neutrals).
- `sharedAppSpec` captures app-specific layout guidance: container clamp `clamp(20rem, 92vw, 78rem)`, control/secondary column minimums (`20rem`/`18rem`), inline padding aliases (`space-between-l`/`space-between-xl`), and the `bp-xs` → `bp-xxl` breakpoint ramp.
- App typography draws directly from Oak font tokens (Lexend/Work Sans) with an explicit italic quote entry; spacing/radii resolve through Oak spacing ramps in the theme resolver.
- Theme bridge exposes CSS variables such as `--app-layout-inline-padding-base`, `--app-bp-xxl`, `--app-color-brand-primary`, and the responsive refactor now consumes those tokens for Admin, Docs, and dashboard components.
- Browser theme colours use the semantic `bg-primary` tokens (guarded by `layout.meta.unit.test.ts`) so OS chrome tracks the palette changes automatically.

## Outstanding tasks & watchpoints

1. Continue auditing Search/Health components to ensure they consume the exported CSS variables instead of bespoke pixel values.
2. Track any Oak token gaps encountered during dark-mode refinement (e.g. icon accents) and feed them into the inventory for potential upstream requests.
3. Consider extending automated checks to compare semantic palette values against Oak contrast guidance once Health UI surfaces land.
