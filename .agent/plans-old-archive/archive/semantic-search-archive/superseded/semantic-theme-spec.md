# Semantic Theme Spec – Design Notes

_Last reviewed: 2025-09-26 (post Admin/Docs responsive refactor)_

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
        headerBorder: 'oakGreen',
        borderSubtle: 'grey20',
        textMuted: 'grey60',
        errorText: 'red',
        pageNote: 'oakGreen',
        docsNote: 'oakGreen',
        surfaceEmphasisBg: 'rgba(0, 0, 0, 0.06)',
        surfaceCard: 'white',
        surfaceRaised: 'grey20',
      },
      palette: {
        brandPrimary: oakColorTokens.oakGreen,
        brandPrimaryDark: '#0f381b',
        brandPrimaryDeep: '#144d24',
        brandPrimaryBright: '#35a04c',
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
        headerBorder: 'oakGreen',
        borderSubtle: 'navy',
        textMuted: 'grey30',
        errorText: 'amber50',
        pageNote: 'mint50',
        docsNote: 'mint50',
        surfaceEmphasisBg: 'rgba(255, 255, 255, 0.08)',
        surfaceCard: 'navy110',
        surfaceRaised: 'navy',
      },
      palette: {
        brandPrimary: oakColorTokens.oakGreen,
        brandPrimaryDark: '#82d88a',
        brandPrimaryDeep: '#0b2a16',
        brandPrimaryBright: '#6ed680',
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

- `resolveAppTokens` converts Oak token identifiers into runtime values using `oakAllSpacingTokens`, `oakInnerPaddingTokens`, `oakBorderRadiusTokens`, `oakFontTokens`, etc., and now emits layout-specific variables (container clamp, inline padding, breakpoints) consumed by Search/Admin/Docs responsive grids.
- Unit tests (`theme-factory.unit.test.ts`, `bridge.integration.test.tsx`) assert that CSS variables (`--app-layout-inline-padding-base`, `--app-bp-xxl`, brand palette colors) match the spec.

## Testing strategy

- Unit test the spec (`theme-factory.unit.test.ts`) to ensure:
  - Every `uiColors` map covers all tokens (no missing keys, no extraneous keys).
  - Dark/light modes share the same app token keys.
  - Typography tokens resolve to expected font sizes/weights when passed through `resolveAppTokens`.
- Update `ThemeCssVars` tests to verify CSS variables align with the resolved spec.

## Follow-up tasks

- Extend contrast checks (e.g. via axe or custom assertions) for critical text/background pairs, especially once Search hero colours shift.
- Capture any Oak token gaps (dark-mode icons, alert states) in the theme inventory for upstream discussion.
- Document how downstream apps should consume the exported CSS variables and palette tokens in shared developer docs once the Search responsive refactor lands.
