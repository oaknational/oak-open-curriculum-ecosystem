# Semantic Theme Spec – Design Notes

## Goals

- Provide a single `semanticThemeSpec` constant that describes both modes (`light`, `dark`).
- Enforce full `OakUiRoleToken` coverage without using `Partial`; highlight which entries differ from `oakDefaultTheme`.
- Represent app-specific tokens (spacing, radii, typography, layout, custom colours) in terms of Oak token identifiers or well-defined literal values.
- Derive TypeScript types and runtime guards directly from the spec so tests detect drift immediately.
- Feed the existing Theme Bridge from this spec, translating token identifiers into concrete CSS variables in one place.

## Implemented structure

```ts
const semanticThemeSpec = {
  light: {
    name: 'oak-semantic-light',
    uiColors: buildUiColorMap({
      'text-primary': 'navy120',
      'text-subdued': 'grey60',
      /* … truncated for brevity … */
    }),
    app: {
      ...sharedAppSpec,
      colors: {
        headerBorder: 'grey30',
        borderSubtle: 'grey20',
        textMuted: 'grey60',
        errorText: 'red',
        pageNote: 'navy120',
        docsNote: 'navy110',
        surfaceEmphasisBg: 'rgba(0, 0, 0, 0.06)',
      },
    },
  },
  dark: {
    name: 'oak-semantic-dark',
    uiColors: buildUiColorMap({
      'text-primary': 'white',
      'text-subdued': 'grey30',
      /* … */
    }),
    app: {
      ...sharedAppSpec,
      colors: {
        headerBorder: 'navy110',
        borderSubtle: 'navy',
        textMuted: 'grey30',
        errorText: 'amber50',
        pageNote: 'white',
        docsNote: 'grey20',
        surfaceEmphasisBg: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
} as const satisfies Record<SemanticMode, SemanticThemeDefinition>;
```

### Notes

- `uiColors` maps should be declared as `const` objects and validated via Vitest to ensure they enumerate all 71 tokens. For readability, we will group overrides (text, background, icon, border, code) and spread the Oak defaults where identical.
- App `colors` may still require literal CSS values (e.g. emphasis overlays). For those, capture rationale in comments and consider deriving a type guard to ensure both modes specify the same keys.
- Keep typography references in Oak token space wherever the component library provides tokens; only fall back to raw descriptors for values Oak does not expose (e.g. italic quotes).

## Derived types & helpers

```ts
type SemanticMode = keyof typeof semanticThemeSpec; // 'light' | 'dark'

interface SemanticThemeDefinition {
  readonly name: string;
  readonly uiColors: Record<OakUiRoleToken, OakColorToken>;
  readonly app: AppSemanticSpec;
}

const semanticThemeSpec = { ... } satisfies Record<'light' | 'dark', SemanticThemeDefinition>;

function createTheme(mode: SemanticMode): AppTheme {
  const spec = semanticThemeSpec[mode];
  return {
    name: spec.name,
    uiColors: buildUiColorMap(spec.uiColors),
    app: resolveAppTokens(spec.app),
  };
}
```

- `resolveAppTokens` converts Oak token identifiers into runtime values using `oakAllSpacingTokens`, `oakInnerPaddingTokens`, `oakBorderRadiusTokens`, `oakFontTokens`, etc.
- Expose a runtime helper for tests: `assertHasAllUiRoleTokens(spec.uiColors)`.

## Testing strategy

- Unit test the spec (`theme-factory.unit.test.ts`) to ensure:
  - Every `uiColors` map covers all tokens (no missing keys, no extraneous keys).
  - Dark/light modes share the same app token keys.
  - Typography tokens resolve to expected font sizes/weights when passed through `resolveAppTokens`.
- Update `ThemeCssVars` tests to verify CSS variables align with the resolved spec.

## Follow-up tasks

- Incorporate contrast checks (e.g. using WCAG formulas) for key text/background pairs in dark mode.
- Document any remaining Oak gaps (e.g. missing tonal variants) in `.agent/plans/semantic-search/semantic-theme-inventory.md` for potential upstream requests.
- Extend the theme bridge/global styles so that `bg-primary`/`text-primary` automatically apply to `html`, `body`, and layout wrappers—current Oak global reset does not reference theme tokens.
- Capture guidance for downstream apps on consuming the spec (global styles, OakBox props, CSS variable usage) in project docs.
