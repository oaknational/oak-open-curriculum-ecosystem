# Oak Components Integration & Theming Guide

This document explains how to consume and extend `@oaknational/oak-components` in applications outside the Oak Web Application (OWA). It captures the additional work required to support light/dark theming in the Semantic Search app and should be treated as the canonical reference when wiring the Oak styling into other runtimes.

## 1. Core packages

- **`@oaknational/oak-components`** exposes the React components, token definitions, and Styled Components helpers.
- **`@oaknational/oak-components/dist/types.d.ts`** defines `OakTheme`, token unions, and utility types.
- **Our app-specific layer** provides:
  - `semanticThemeSpec` (`app/ui/themes/semantic-theme-spec.ts`)
  - `resolveAppTokens` (`app/ui/themes/semantic-theme-resolver.ts`)
  - `ThemeBridgeProvider` (`app/lib/theme/ThemeBridgeProvider.tsx`)
  - `ThemeContext` (`app/lib/theme/ThemeContext.tsx`)

## 2. Global styles

`OakGlobalStyle` (shipped with the component library) only installs resets. It **does not** set foreground/background colours or reference the current theme. Apps must:

1. Mount `OakGlobalStyle` once (we do this inside `ThemeContext`).
2. Emit a deterministic `<style id="app-theme-global">` from the bridge that paints `html`, `body`, and `#app-theme-root` using the resolved semantic theme (our light mode now sets `bg-primary` to the mint30 token so the base canvas picks up Oak’s pale green wash):
   - `html, body { background-color: theme.uiColors['bg-primary']; color: theme.uiColors['text-primary']; }`
   - Link, label, and helper text colours derived from the semantic tokens (e.g. `text-link-*`, `text-subdued`).

We expose CSS variables through `ThemeBridgeProvider` (`--app-*`) and generate the global stylesheet manually so ordering is deterministic during SSR and hydration. This differs from OWA, which assumes a single light theme and relies on the browser defaults.

## 3. Creating the theme

1. Define a spec using Oak tokens (`OakUiRoleToken`, `OakColorToken`, spacing, radii, typography) for both light and dark modes.
2. Use helpers similar to `buildUiColorMap`/`resolveAppTokens` to:
   - Validate full `OakUiRoleToken` coverage.
   - Convert spacing/radius/typography tokens into CSS-ready values (rem/px/unitless).
3. Lean on `oakGreen` for keystone brand accents—primary buttons, active links, borders, and header edges all share the token so downstream surfaces remain consistent in both modes. Our semantic layer also introduces `brandPrimaryDeep`/`brandPrimaryBright` entries so darker hero borders and lighter highlights stay within the Oak palette without inventing ad-hoc hex codes.
4. Expose a `createLightTheme`/`createDarkTheme` function that returns an `OakTheme` extended with app-specific tokens.
5. Mount `OakThemeProvider` (from Oak components) with the resolved theme so every component can read tokenised values.

## 4. Applying tokens in UI code

Oak components expect everything to flow from tokens. Do **not** hard-code colours, borders, or spacing:

- Use `$color`, `$background`, `$borderColor`, `$gap`, `$pa`, etc. on `OakBox`, `OakFlex`, `OakTypography`, etc.
- For headings/labels/helper copy, pass `$font` to ensure the Oak typography ramp is used.
- For custom wrappers (headers, forms, modals), explicitly set tokens instead of relying on inheritance.
- If a new colour/space token is absolutely required, add it to the semantic spec and derive the TypeScript type from the constant so tests fail when the contract changes.
- Layout CSS variables emitted by the bridge (`--app-layout-container-max-width`, `--app-layout-control-column-min-width`, `--app-layout-secondary-column-min-width`) keep responsive grids consistent; prefer them over hard-coded `minmax` values when composing custom wrappers.

## 5. Dark mode support

To support dark mode, the following must happen in tandem:

1. Resolve the preferred mode (`ThemeContext` uses cookie → localStorage → system preference) and memoise the corresponding theme.
2. Ensure the DOM carries `data-theme` attributes on `html`/`body`/`#app-theme-root` before hydration (see `THEME_PREHYDRATION_SCRIPT`).
3. Emit CSS variables for any app-level tokens (spacing, typography metrics, emphasis overlays).
4. Apply global foreground/background colours as described earlier so nested components inherit correctly.
5. Verify via Playwright (or DevTools) that:
   - `main`, `section`, headings, and nav links use the expected `uiColors` in both modes.
   - Buttons, inputs, and borders match the tokens defined in `semanticThemeSpec`.

## 6. Extending Oak Components

When Oak lacks a token or component variant:

- Prefer composing existing primitives (e.g. `OakBox` + typography props) before creating bespoke elements.
- If a new token is unavoidable, document the rationale in `.agent/plans/semantic-search/semantic-theme-inventory.md` and update `semanticThemeSpec` accordingly.
- Keep app overrides in one place (the spec/bridge) so future upstream updates can be diffed easily.

## 7. Checklist for new surfaces

1. Wrap the page/feature in an `OakBox` with `$background`/`$color` tokens.
2. Use Oak typography tokens for headings, body text, and helper copy.
3. Ensure any Oak forms/buttons have adequate contrast in both modes (WCAG AA minimum).
4. Add unit tests (or Playwright checks) that fail if the contract changes unexpectedly.
5. Update this doc when new patterns emerge.

Following this approach keeps downstream apps aligned with Oak Components while allowing flexible theming beyond the assumptions baked into OWA.
