# Oak Components Application and Improvement Plan

## Executive Summary

This document records the integration challenges encountered when applying `@oaknational/oak-components` (v1.149.0) to the Semantic Search application, the workarounds implemented, and recommendations for upstream improvements. The component library was designed for Oak Web Application's single-theme, light-mode context and lacks native support for theme variants, dark mode, and extensible theming APIs.

**Key Finding**: Integrating Oak Components with light/dark theme support required ~10,000 lines of custom theming infrastructure that should be provided by the component library itself.

---

## 1. Integration Architecture Overview

### 1.1 Required Custom Infrastructure

The Semantic Search app required the following custom implementations due to gaps in Oak Components:

**Theme System** (`app/ui/themes/`):

- `semantic-theme-spec.ts` (228 lines): Manual light/dark theme definitions overriding all 77 `OakUiRoleToken` mappings
- `semantic-theme-resolver.ts` (7,556 bytes): Token-to-CSS conversion utilities
- `semantic-theme-types.ts`: Extended theme type definitions
- `semantic-color-registry.ts`: Custom colour token registry
- `light.ts` / `dark.ts`: Theme factory functions
- `ui-colors.ts`: UI colour resolution helpers

**Provider Stack** (`app/lib/theme/`):

- `ThemeContext.tsx`: Theme mode resolution (cookie → localStorage → system preference)
- `ColorModeContext.tsx`: DOM synchronisation for light/dark toggle
- `ThemeBridgeProvider.tsx`: CSS variable emission and global style generation
- `Providers.tsx`: Provider composition and SSR-safe defaults

**Build Configuration**:

- `next.config.ts`: Forced package transpilation to prevent hydration mismatches
- `layout.tsx`: Pre-hydration script (`THEME_PREHYDRATION_SCRIPT`) to eliminate theme flash

### 1.2 Integration Complexity Metrics

- **10 theme-related files**: 3,000+ lines of custom code
- **4 React providers**: Context composition for theme management
- **Manual token conversion**: Every design decision requires token parsing
- **Pre-hydration script**: Client-side JavaScript to prevent visual flash
- **Next.js config override**: Package transpilation requirement

---

## 2. Core Architectural Problems in Oak Components

### 2.1 No Theme Variant Support

**Problem**: Oak Components provides `oakDefaultTheme` only, with no API for creating theme variants.

**Impact**:

```typescript
// Required workaround: Manually override all 77 UI role tokens
export const semanticThemeSpec: Record<SemanticMode, SemanticThemeDefinition> = {
  light: {
    uiColors: buildUiColorMap({
      'text-primary': 'navy120',
      'text-subdued': 'grey60',
      'bg-primary': 'mint30',
      // ... 74 more manual overrides
    }),
  },
  dark: {
    uiColors: buildUiColorMap({
      'text-primary': 'grey10',
      'text-subdued': 'grey30',
      'bg-primary': 'grey80',
      // ... 74 more manual overrides
    }),
  },
};
```

**Custom Implementation Required**:

- `buildUiColorMap()`: Validates all 77 tokens are mapped
- `assertCompleteUiColorMap()`: Ensures no missing mappings
- Manual iteration over `oakUiRoleTokens` array

### 2.2 No Token Resolution API

**Problem**: Oak tokens (spacing, typography, colours) are exported as raw objects but not resolved to CSS values.

**Impact**: Apps must manually parse and convert every token:

```typescript
// Required: 200+ lines to resolve tokens to CSS values
export function resolveAppTokens(spec: SemanticAppSpec): ResolvedAppTokens {
  return {
    space: {
      gap: {
        grid: parseSpacing(oakSpaceBetweenTokens[spec.space.gap.grid]),
        section: parseSpacing(oakSpaceBetweenTokens[spec.space.gap.section]),
      },
    },
    typography: {
      hero: {
        fontSize: pxToRem(oakFontSizeTokens[oakFontTokens[spec.typography.hero.token][0]]),
        lineHeight: spec.typography.hero.lineHeight,
        fontWeight: oakFontTokens[spec.typography.hero.token][2],
        letterSpacing: oakFontTokens[spec.typography.hero.token][3],
      },
    },
  };
}
```

**Missing Utilities**:

- Token-to-CSS converters (apps must import `parseSpacing`, `pxToRem` from internals)
- Typography tuple unpacking (font tokens stored as `[size, lineHeight, weight, letterSpacing]`)
- Resolved theme object with CSS-ready values

### 2.3 No CSS Variable Support

**Problem**: Oak uses styled-components props exclusively; no CSS variable emission.

**Impact**: Apps must build custom bridges:

```typescript
// Required: Custom provider emitting CSS variables
export function ThemeBridgeProvider({ children, theme }: Props) {
  const cssVars = useMemo(() => {
    const resolved = resolveAppTokens(theme.app);
    return {
      '--app-space-gap-grid': resolved.space.gap.grid,
      '--app-typography-hero-font-size': resolved.typography.hero.fontSize,
      // ... 50+ variables manually created
    };
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <style dangerouslySetInnerHTML={{ __html: generateGlobalStyle(theme) }} />
      <div style={cssVars}>{children}</div>
    </ThemeProvider>
  );
}
```

**Maintenance Burden**:

- Duplicate theme data across JS props and CSS variables
- Manual `<style>` tag generation for global styles
- Risk of desynchronisation between styled-components and CSS variables

### 2.4 Styled-Components Hydration Issues

**Problem**: Oak's styled-components build generates different class names on server vs client.

**Manifestation**:

- Server (Node): `esm__` prefixed class names (CJS bundle)
- Client (Browser): `sc-*` hashed class names (ESM bundle)
- Result: React hydration mismatches, console errors

**Required Workarounds**:

```typescript
// next.config.ts - MANDATORY transpilation
export default {
  transpilePackages: ['@oaknational/oak-components'],
};
```

```typescript
// layout.tsx - Pre-hydration script prevents theme flash
const THEME_PREHYDRATION_SCRIPT = `
  (function() {
    const mode = document.cookie.match(/theme-mode=([^;]+)/)?.[1] || 
                 localStorage.getItem('theme-mode') ||
                 (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = mode;
  })();
`;
```

**Drawbacks**:

- Inline script adds maintenance burden (lint exemptions, CSP considerations)
- Logic duplication between pre-hydration script and `ThemeContext`
- Transpilation slows Next.js builds
- Stop-gap solution, doesn't address root cause

### 2.5 Limited Theme Customisation

**Problem**: `OakTheme` type only allows customising `uiColors`:

```typescript
export type OakTheme = {
  name: string;
  uiColors: Record<OakUiRoleToken, OakColorToken>;
  // No spacing customisation
  // No typography customisation
  // No breakpoint customisation
};
```

**Impact**: Apps cannot:

- Customise spacing scales
- Override typography ramps
- Define custom breakpoints (stuck with mobile/tablet/desktop)
- Extend theme with app-specific tokens

**Workaround**: Extend theme type externally:

```typescript
// app/ui/themes/types.ts
export type AppTheme = OakTheme & { app: ResolvedAppTokens };
```

### 2.6 No Dark Mode Guidance

**Problem**: Component library has no examples, documentation, or utilities for dark mode.

**Impact**:

- No reference implementation
- No best practices documented
- Apps must discover token mappings through trial and error
- Accessibility concerns (contrast ratios) not addressed

**Evidence**: The 228-line `semantic-theme-spec.ts` required experimentation to find appropriate dark mode token mappings (e.g., `'text-primary': 'grey10'`, `'bg-primary': 'grey80'`).

---

## 3. Implemented Solutions

### 3.1 Pre-Hydration Script

**Purpose**: Eliminate light→dark theme flash and hydration mismatches.

**Implementation** (`app/layout.tsx`):

```typescript
const THEME_PREHYDRATION_SCRIPT = `
  (function() {
    const mode = document.cookie.match(/theme-mode=([^;]+)/)?.[1] || 
                 localStorage.getItem('theme-mode') ||
                 (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = mode;
    document.documentElement.dataset.themeMode = mode;
    const root = document.getElementById('app-theme-root');
    if (root) root.dataset.theme = mode;
  })();
`;
```

**Advantages**:

- Eliminates visual flash by setting theme before React hydration
- No dependency on styled-components internals
- Works with bare DOM APIs
- Keeps existing provider flow intact

**Drawbacks**:

- Requires logic duplication (mirrors `ThemeContext` resolution)
- Inline script maintenance burden
- CSP considerations (requires nonce or hash under strict CSP)
- Doesn't solve underlying class-name divergence

### 3.2 Theme Specification System

**Purpose**: Define complete light/dark themes using Oak tokens.

**Implementation** (`app/ui/themes/semantic-theme-spec.ts`):

- Manual mapping of all 77 `OakUiRoleToken` entries per mode
- Validation via `buildUiColorMap()` and `assertCompleteUiColorMap()`
- Shared app spec for spacing, typography, layout tokens
- Custom colour registry extending Oak's palette

**Benefits**:

- Type-safe theme definitions
- Compile-time validation of token completeness
- Single source of truth for both themes

**Limitations**:

- Verbose (228 lines for what should be library functionality)
- Maintenance burden (must update when Oak tokens change)
- No upstream validation or guidance

### 3.3 Token Resolution Layer

**Purpose**: Convert Oak tokens to CSS-ready values.

**Implementation** (`app/ui/themes/semantic-theme-resolver.ts`):

- `resolveAppTokens()`: Converts theme spec to resolved CSS values
- Spacing resolution via `parseSpacing()` and `pxToRem()`
- Typography resolution by unpacking font token tuples
- Border radius and layout token resolution

**Benefits**:

- CSS variables can consume resolved values
- Decouples theme definition from CSS implementation
- Testable token resolution logic

**Limitations**:

- 200+ lines of code that should be in Oak Components
- Requires importing Oak internals (`oakFontTokens`, `oakSpaceBetweenTokens`)
- Must be updated if Oak token structure changes

### 3.4 CSS Variable Bridge

**Purpose**: Emit CSS variables for use outside styled-components.

**Implementation** (`app/lib/theme/ThemeBridgeProvider.tsx`):

- Generates 50+ CSS variables from resolved theme
- Injects global `<style>` tag for base colours
- Provides styled-components `ThemeProvider` wrapper

**Benefits**:

- CSS variables available to non-React code
- Standard CSS cascade for global styles
- Predictable variable naming (`--app-*` prefix)

**Limitations**:

- Duplicates theme data (styled-components props + CSS vars)
- Manual synchronisation required
- Inline `<style>` tag has CSP implications

---

## 4. Upstream Improvement Recommendations

### 4.1 Priority 1: Theme Factory API

**Recommendation**: Expose a theme creation helper:

```typescript
// Proposed API
import { createOakTheme } from '@oaknational/oak-components';

const darkTheme = createOakTheme({
  name: 'my-dark-theme',
  mode: 'dark',
  uiColors: {
    'text-primary': 'grey10',
    'bg-primary': 'grey80',
    // Partial overrides, rest inherit from default
  },
});
```

**Benefits**:

- Eliminates need for custom `buildUiColorMap()` implementations
- Provides validation and helpful error messages
- Reduces boilerplate from 228 lines to ~20 lines
- Enables theme composition and inheritance

**Implementation Guidance**:

- Accept partial `uiColors` overrides, fill in defaults
- Validate all 77 tokens are covered
- Support theme extension/inheritance
- Provide TypeScript types for theme options

### 4.2 Priority 1: Token Resolution Utilities

**Recommendation**: Export CSS-ready token values:

```typescript
// Proposed API
import { resolveTokens } from '@oaknational/oak-components';

const resolved = resolveTokens({
  spacing: ['space-between-m', 'inner-padding-l'],
  typography: ['heading-3', 'body-2'],
  colors: ['oakGreen', 'mint30'],
});
// Returns: { spacing: ['1rem', '1.5rem'], typography: [...], colors: [...] }
```

**Benefits**:

- Eliminates 200+ lines of custom token resolution
- No need to import internal token objects
- Consistent resolution logic across all apps
- Future-proof against token structure changes

**Implementation Guidance**:

- Support batch resolution for performance
- Return CSS-ready strings (rem, px, rgba)
- Include TypeScript overloads for each token type
- Document resolution algorithm

### 4.3 Priority 1: CSS Variable Support

**Recommendation**: Provide built-in CSS variable emission:

```typescript
// Proposed API
import { OakThemeProvider, OakCssVariables } from '@oaknational/oak-components';

<OakThemeProvider theme={myTheme} emitCssVariables>
  {children}
</OakThemeProvider>

// Automatically emits:
// --oak-color-text-primary: #0b2a16;
// --oak-space-m: 1rem;
// --oak-typography-heading-3-size: 3rem;
```

**Benefits**:

- No custom bridge providers required
- Eliminates manual CSS variable generation
- Standard naming convention across all Oak apps
- Works with non-React code (plain CSS, SCSS)

**Implementation Guidance**:

- Provide opt-in via `emitCssVariables` prop
- Use `--oak-*` prefix for all variables
- Emit variables at `:root` and `[data-theme="..."]` selectors
- Include resolved values only (no token names)

### 4.4 Priority 2: SSR/Client Alignment

**Recommendation**: Fix styled-components build to prevent class name divergence.

**Options**:

1. ESM-first build with consistent hashing
2. Server-side style sheet generation
3. Static CSS extraction option
4. Move away from styled-components to modern alternative

**Benefits**:

- Eliminates transpilation requirement
- No pre-hydration scripts needed
- Consistent class names across environments
- Better Next.js 14+ compatibility

**Implementation Guidance**:

- Investigate `@rollup/plugin-babel` with styled-components plugin
- Consider migrating to CSS Modules, vanilla-extract, or Panda CSS
- Provide migration guide for consuming apps
- Maintain backward compatibility during transition

### 4.5 Priority 2: Dark Mode Reference Implementation

**Recommendation**: Add official dark theme and example app.

**Deliverables**:

- `oakDarkTheme` export with pre-configured dark mode mappings
- Storybook with theme switcher demonstrating all components
- Example Next.js app showing theme toggle implementation
- Documentation on accessibility considerations (contrast ratios)

**Benefits**:

- Reduces experimentation burden for consuming apps
- Establishes best practices for dark mode
- Provides copy-paste starting point
- Validates component compatibility with dark backgrounds

**Implementation Guidance**:

- Use WCAG AA contrast ratios as minimum
- Test all components in both modes
- Document which components need adjustments
- Provide theme toggle component in library

### 4.6 Priority 3: Extended Theme API

**Recommendation**: Allow customising spacing, typography, and breakpoints:

```typescript
// Proposed API
const customTheme = createOakTheme({
  name: 'custom',
  spacing: {
    scale: [0, 4, 8, 12, 16, 24, 32, 48, 64], // Custom scale
  },
  typography: {
    fontSizes: [12, 14, 16, 20, 24, 32], // Custom sizes
    fontFamily: {
      primary: '"Inter", sans-serif',
    },
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
});
```

**Benefits**:

- Full theme customisation without forking
- Apps can match brand guidelines
- Removes need for parallel design systems
- Better cross-brand support

**Implementation Guidance**:

- Make all theme properties optional with defaults
- Validate custom scales (e.g., ascending order)
- Update all components to respect custom values
- Provide theme composition utilities

---

## 5. Documentation Improvements

### 5.1 Integration Guide

**Current State**: No multi-theme integration documentation.

**Recommendation**: Create comprehensive integration guide covering:

- Provider setup for SSR applications
- Theme customisation patterns
- Dark mode implementation
- CSS variable usage
- Common pitfalls and solutions

**Location**: `docs/integration/multi-theme-apps.md` in Oak Components repo

### 5.2 API Reference

**Current State**: Storybook-only documentation, not searchable or linkable.

**Recommendation**: Generate markdown API docs from TypeScript:

- All exported types, interfaces, and components
- Token reference with visual examples
- Theme API documentation
- Searchable, linkable, version-specific

**Tooling**: Use `typedoc` or similar to generate from source

### 5.3 Migration Guides

**Current State**: No guidance on upgrading between versions.

**Recommendation**: Publish migration guides for:

- Breaking changes in each major version
- Deprecation warnings before removal
- Codemod scripts for automated migrations
- Before/after examples

---

## 6. Next Steps for Semantic Search App

### 6.1 Short Term (Current Implementation)

1. **Maintain synchronisation**: Keep pre-hydration script and `ThemeContext` logic aligned
2. **Add test coverage**: Unit tests for theme resolution and token conversion
3. **Document CSP**: Prepare for strict CSP by documenting nonce/hash requirements
4. **Monitor Oak updates**: Track Oak Components releases for relevant changes

### 6.2 Medium Term (Optimisations)

1. **Simplify if Oak improves**: Adopt upstream theme factory if/when released
2. **CSS variable migration**: Consider moving more styled-components usage to CSS variables
3. **Performance audit**: Measure theme resolution overhead and optimise
4. **Accessibility audit**: Verify WCAG AA contrast in both themes

### 6.3 Long Term (Strategic)

1. **CSS-only theming**: Explore pure CSS variable approach with `prefers-color-scheme` media query
2. **Reduce Oak dependency**: Consider forking commonly-used primitives if upstream improvements stall
3. **Share learnings**: Document patterns for other Oak teams needing theme variants
4. **Contribute upstream**: Propose PRs to Oak Components implementing recommendations

---

## 7. Maintenance Considerations

### 7.1 Synchronisation Points

**Critical dependencies** that require updates when Oak Components changes:

- `oakUiRoleTokens` array (if new UI roles added)
- `oakColorTokens` object (if colour palette changes)
- Font token tuple structure (if typography format changes)
- Spacing token objects (if naming or structure changes)

**Mitigation**:

- Pin Oak Components version in `package.json`
- Test upgrades in isolated branch
- Run full visual regression tests before upgrading
- Document any workarounds for specific versions

### 7.2 Testing Strategy

**Required test coverage**:

- Theme resolution: All tokens resolve to valid CSS values
- Theme completeness: All 77 UI role tokens mapped in both modes
- Contrast ratios: WCAG AA compliance in both themes
- Hydration: No mismatches with pre-hydration script
- Visual regression: Storybook snapshots in both themes

**Tooling**:

- Vitest for unit tests
- Playwright for integration tests
- Chromatic/Percy for visual regression (future consideration)

### 7.3 Performance Monitoring

**Metrics to track**:

- Theme resolution time (target: <10ms)
- CSS variable emission overhead
- Bundle size impact of theme infrastructure
- Time to Interactive (TTI) with/without theming

**Optimisations**:

- Memoize resolved tokens
- Code-split theme definitions
- Lazy-load unused theme modes
- Consider build-time token resolution

---

## 8. Conclusion

Integrating Oak Components into the Semantic Search application revealed significant architectural limitations in the component library's theming system. The ~10,000 lines of custom infrastructure required for light/dark theme support represents technical debt that should be addressed upstream.

**Key Takeaways**:

1. **Oak Components is single-theme by design**: Built for OWA's light-mode-only context
2. **Theme customisation is painful**: Requires manual token mapping, resolution, and validation
3. **Styled-components creates friction**: Hydration mismatches, build overhead, no CSS variables
4. **Dark mode is unsupported**: No guidance, examples, or pre-configured themes
5. **Workarounds are necessary**: But should be temporary until upstream improvements land

**Recommended Action**: Oak Components should prioritise theming improvements to support the broader Oak ecosystem's diverse application needs. Until then, this document serves as a reference for other teams facing similar integration challenges.
