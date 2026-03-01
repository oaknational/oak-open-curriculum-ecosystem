# 4. Core Infrastructure

The `core` package is the foundation. It has no framework dependency — pure TypeScript and CSS conventions.

## Token schema contract

The core defines the **shape** that every design system must satisfy, without specifying values. This is a TypeScript interface mapping to expected `--ds-*` CSS custom properties.

```typescript
// packages/core/src/schema/token-schema.ts

export interface ColorTokens {
  palette: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    accent: string;
    accentLight: string;
    accentDark: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
    neutral700: string;
    neutral800: string;
    neutral900: string;
    neutral950: string;
    white: string;
    black: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  semantic: {
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string;
    textLink: string;
    textLinkHover: string;
    bgPrimary: string;
    bgSecondary: string;
    bgMuted: string;
    bgInverse: string;
    bgOverlay: string;
    borderDefault: string;
    borderStrong: string;
    borderMuted: string;
    focusRing: string;
    btnPrimaryBg: string;
    btnPrimaryText: string;
    btnPrimaryHoverBg: string;
    btnSecondaryBg: string;
    btnSecondaryText: string;
    btnSecondaryBorder: string;
    btnSecondaryHoverBg: string;
  };
}

export interface TypographyValue {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing: string;
}

export interface TypographyTokens {
  fontFamilyBody: string;
  fontFamilyHeading: string;
  fontFamilyCode: string;
  heading1: TypographyValue;
  heading2: TypographyValue;
  heading3: TypographyValue;
  heading4: TypographyValue;
  heading5: TypographyValue;
  heading6: TypographyValue;
  body1: TypographyValue;
  body2: TypographyValue;
  body3: TypographyValue;
  caption: TypographyValue;
  code: TypographyValue;
}

export interface SpacingTokens {
  0: string; 1: string; 2: string; 3: string;
  4: string; 5: string; 6: string; 8: string;
  10: string; 12: string; 16: string; 20: string; 24: string;
}

export interface BorderTokens {
  radiusNone: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
  widthDefault: string;
  widthThick: string;
}

export interface ShadowTokens {
  none: string; sm: string; md: string;
  lg: string; xl: string; inner: string; focus: string;
}

export interface TransitionTokens {
  durationFast: string;
  durationDefault: string;
  durationSlow: string;
  easingDefault: string;
  easingIn: string;
  easingOut: string;
  easingBounce: string;
}

export interface AnimationTokens {
  fadeIn: string; fadeOut: string;
  slideUp: string; slideDown: string;
  scaleIn: string; spin: string;
}

export interface OpacityTokens {
  muted: string; disabled: string;
  overlay: string; subtle: string;
}

export interface ZIndexTokens {
  base: string; dropdown: string; sticky: string;
  modal: string; popover: string; toast: string; tooltip: string;
}

export interface BreakpointTokens {
  sm: string; md: string; lg: string; xl: string;
}

export interface DesignSystemTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borders: BorderTokens;
  shadows: ShadowTokens;
  transitions: TransitionTokens;
  animations: AnimationTokens;
  opacity: OpacityTokens;
  zIndex: ZIndexTokens;
  breakpoints: BreakpointTokens;
}
```

## Shared variant types

```typescript
// packages/core/src/types/variants.ts

export type ButtonIntent = "primary" | "secondary" | "tertiary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TextVariant = "body1" | "body2" | "body3" | "caption";
export type DialogSize = "sm" | "md" | "lg" | "full";
export type InputState = "default" | "error" | "success";
```

## CSS custom property prefix convention

All design system CSS custom properties use the `--ds-` prefix. This is the contract between recipes (which reference `var(--ds-*)`) and tokens (which define `--ds-*` values):

```css
/* Recipe (design-system-agnostic) */
[data-ds="button"][data-intent="primary"] {
  background: var(--ds-color-btn-primary-bg);
  color: var(--ds-color-btn-primary-text);
}

/* Oak provides */
:root { --ds-color-btn-primary-bg: #287D39; }

/* Zinc provides */
:root { --ds-color-btn-primary-bg: #4F46E5; }
```

Design-system-specific extras are allowed (e.g. Oak can define `--oak-hand-drawn-*` for its brand components) but shared recipes must only use `--ds-*` variables.

## Token validation

A build-time validation step checks that each design system's `tokens.css` satisfies the schema:

```typescript
// packages/core/src/schema/validate-tokens.ts

// Parses a tokens.css file and confirms every --ds-* slot is present.
// Run as part of CI — fails the build if a token is missing.
export function validateTokens(
  tokensCss: string,
  schema: DesignSystemTokens
): ValidationResult;
```

## Test helpers

```typescript
// packages/core/src/test-helpers/render.ts

export function renderWithDesignSystem(
  ui: React.ReactElement,
  designSystem: "oak" | "zinc"
): RenderResult;

export function renderWithAllDesignSystems(
  ui: React.ReactElement
): Record<string, RenderResult>;
```
