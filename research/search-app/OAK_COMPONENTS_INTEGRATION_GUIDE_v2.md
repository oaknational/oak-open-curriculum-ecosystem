# Oak Components Integration & Theming Guide (v2)

Last updated: 2025-09-15

Target stack: Next.js 15 · React 19 · TypeScript · Vitest · styled-components v6 (new repos) / v5 (legacy) · A11y-first

> Progressive disclosure: 1–6 Essentials • 7–15 Deep dive • 16–20 Ops & migration • 21–24 Reference • 25 Machine-readable summary.

---

## 1. Executive Summary

Layering: Oak Design System (raw tokens + components) → Bridge (semantic mapping + CSS var emission) → App Theme (styled-components semantic theme). Dark mode = toggle an `<html>` class; no provider re-mount. Tests exercise real tokens; semantic layer buffers upstream token changes.

---

## 2. Quick Start (Human)

1. Install: `npm i @oaknational/oak-components styled-components@^6 @types/styled-components`
2. Providers: `OakThemeProvider` → `ThemeBridgeProvider` → `ThemeProvider`.
3. Bridge maps raw → semantic & injects CSS vars (light + dark) once per mode.
4. Dark mode: add/remove `theme-dark` class on `<html>` (no rerender cascade).
5. Components use semantic tokens (`theme.colors.surface.primary.bg`), never raw DS tokens.
6. Tests use `renderWithProviders`; add contrast tests + Storybook theme switcher.

---

## 3. Quick Start (AI Agent)

```yaml
providers_order: [oak, bridge, styled]
mode_switch: html_class_toggle
css_variables: true
semantic_tokens: required
styled_components_target: 6
contrast_tests: AA (normal>=4.5)
override_merge: deep_validated
```

---

## 4. Core Principles

| Principle               | Why                                           |
| ----------------------- | --------------------------------------------- |
| Layered abstraction     | Localize DS upgrades to mapping layer         |
| Semantic tokens only    | Intent stability; avoid raw token drift       |
| Hybrid theming          | CSS vars (runtime perf) + typed JS theme (DX) |
| Accessibility-first     | Contrast & motion validated early             |
| Deterministic providers | Predictable test / runtime composition        |
| Safe deep overrides     | Prevent silent nested clobber                 |
| Observability           | Detect drift & typos pre-merge                |

---

## 5. styled-components v6 Compatibility

| Risk                    | Symptom                             | Mitigation                               |
| ----------------------- | ----------------------------------- | ---------------------------------------- |
| Dual versions           | Two `styled-components` in `npm ls` | Resolutions/overrides; align peer ranges |
| Duplicate style tags    | Repeated `<style data-styled>`      | Ensure one version; alias dependency     |
| Empty theme in DS comps | Unstyled UI                         | Smoke test DS Button render              |

Version guard:

```ts
// scripts/check-styled-version.ts
import pkg from 'styled-components/package.json' assert { type: 'json' };
if (!pkg.version.startsWith('6.')) {
  console.error('Expected styled-components v6.x');
  process.exit(1);
}
```

---

## 6. Architecture Diagram

```text
OakThemeProvider (oakDefaultTheme)
  ThemeBridgeProvider (raw→semantic + emit CSS vars)
    ThemeProvider (semantic theme object)
      <App />
```

Dark mode: toggle `<html class="theme-dark">` to swap CSS var set.

---

## 7. Semantic vs Raw Tokens

- Raw example: `brandBlue600`
- Semantic example: `button.primary.bg`
- Only the mapping layer & its tests reference raw tokens.
- Benefit: Upstream rename → edit mapping only.

---

## 8. Bridge & CSS Variable Emission

Goal: zero imperative DOM for theme variable emission; fully SSR + streaming friendly.

### 8.1 Color Mode Context (single source of truth)

```tsx
// theme/ColorModeContext.tsx
'use client';

export type ColorMode = 'light' | 'dark';
interface ModeCtx {
  mode: ColorMode;
  setMode: (m: ColorMode) => void;
  toggle: () => void;
}
const Ctx = React.createContext<ModeCtx | undefined>(undefined);

export const ColorModeProvider: React.FC<React.PropsWithChildren<{ initialMode: ColorMode }>> = ({
  initialMode,
  children,
}) => {
  const [mode, setMode] = React.useState<ColorMode>(initialMode);
  const value = React.useMemo(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useColorMode() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error('useColorMode outside provider');
  return v;
}
```

### 8.2 Declarative CSS Variable Emission

```tsx
// theme/ThemeCssVars.tsx
import { useOakTheme } from '@oaknational/oak-components';
import { useColorMode } from './ColorModeContext';
import { createSemanticTokens } from './createSemanticTokens';
import { buildCssVarSheet } from './cssVars';

export const ThemeCssVars: React.FC = () => {
  const raw = useOakTheme();
  const { mode } = useColorMode();
  const semantic = React.useMemo(() => createSemanticTokens(raw, mode), [raw, mode]);
  const css = React.useMemo(() => buildCssVarSheet(semantic, mode), [semantic, mode]);
  return <style id="app-theme-vars" dangerouslySetInnerHTML={{ __html: css }} />; // SSR + streaming safe
};
```

### 8.3 Bridge Provider (pure & declarative)

```tsx
// theme/ThemeBridgeProvider.tsx
import { ThemeProvider } from 'styled-components';
import { ThemeCssVars } from './ThemeCssVars';
import { buildSemanticTheme } from './buildSemanticTheme';
import { useColorMode } from './ColorModeContext';

export const ThemeBridgeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // If semantic theme shape varies by mode, include mode in memo keys.
  const { mode } = useColorMode();
  const semanticTheme = React.useMemo(() => buildSemanticTheme(mode), [mode]);
  return (
    <>
      <ThemeCssVars />
      <ThemeProvider theme={semanticTheme}>{children}</ThemeProvider>
    </>
  );
};
```

### 8.4 Optional: Sync `data-theme` attribute (minimal imperative)

```tsx
// theme/HtmlThemeAttribute.tsx
'use client';
import { useEffect } from 'react';
import { useColorMode } from './ColorModeContext';
export const HtmlThemeAttribute: React.FC = () => {
  const { mode } = useColorMode();
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);
  return null;
};
```

Include `<HtmlThemeAttribute />` once if your global CSS relies on `[data-theme]` selectors on `<html>`. Omit if scoping to an internal wrapper element.

### 8.5 Removal Rationale

Replaces manual DOM style tag creation & class sniffing with React elements and context: improves testability, prevents hydration mismatches, and supports streaming SSR.

---

## 9. Provider Composition

```tsx
// providers/composeProviders.tsx
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { ColorModeProvider } from '../theme/ColorModeContext';
import { ThemeBridgeProvider } from '../theme/ThemeBridgeProvider';
import type { ReactNode } from 'react';

type Key = 'oak' | 'mode' | 'bridge';
const chain: Record<Key, (c: ReactNode) => ReactNode> = {
  oak: c => <OakThemeProvider theme={oakDefaultTheme}>{c}</OakThemeProvider>,
  mode: c => <ColorModeProvider initialMode="light">{c}</ColorModeProvider>,
  bridge: c => <ThemeBridgeProvider>{c}</ThemeProvider> // ThemeProvider inside bridge
};
export const composeProviders = (order: Key[], leaf: ReactNode) => order.reduceRight<ReactNode>((acc, k) => chain[k](acc), leaf);
```

Usage (tests):

```ts
const AllProviders = ({ children }: { children: React.ReactNode }) =>
  composeProviders(['oak', 'mode', 'bridge'], children);
```

---

## 10. Dark Mode Initialization

Prefer server-rendered attribute over client script. In Next.js App Router, derive mode at the server boundary and set `<html data-theme="dark">` directly.

### 10.1 Server Layout Example

```tsx
// app/layout.tsx
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { ColorModeProvider } from '../theme/ColorModeContext';
import { ThemeBridgeProvider } from '../theme/ThemeBridgeProvider';
import { HtmlThemeAttribute } from '../theme/HtmlThemeAttribute';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialMode = 'light'; // TODO: read cookie or header synchronously
  return (
    <html data-theme={initialMode} suppressHydrationWarning>
      <body>
        <ColorModeProvider initialMode={initialMode}>
          <OakThemeProvider theme={oakDefaultTheme}>
            <ThemeBridgeProvider>
              <HtmlThemeAttribute />
              {children}
            </ThemeBridgeProvider>
          </OakThemeProvider>
        </ColorModeProvider>
      </body>
    </html>
  );
}
```

### 10.2 Toggling Mode

```tsx
import { useColorMode } from '../theme/ColorModeContext';
const ToggleThemeButton = () => {
  const { mode, toggle } = useColorMode();
  return <button onClick={toggle}>Switch to {mode === 'light' ? 'dark' : 'light'} mode</button>;
};
```

### 10.3 Why Not Class Sniffing?

Reading `document.documentElement.classList` during render can diverge from server HTML. Context ensures a single authoritative source while still permitting SSR.

---

## 11. Testing Strategy

| Goal           | Approach                                 |
| -------------- | ---------------------------------------- |
| Component      | `renderWithProviders` wrapper            |
| Hook           | `renderHookWithProviders` wrapper        |
| Theme override | Deep validated merge of semantic subset  |
| Contrast       | `getContrast` AA tests per pair          |
| Snapshot noise | Serializer normalizes `sc-` class hashes |

Serializer:

```ts
export const stripStyled = {
  test: (v: any) => typeof v === 'string' && /sc-[A-Za-z0-9]+/.test(v),
  print: (v: string) => v.replace(/sc-[A-Za-z0-9]+/g, 'sc-hash'),
};
```

### 11.1 Provider Wrapper Update

```ts
// test/utils/renderWithProviders.tsx
import { render } from '@testing-library/react';
import { composeProviders } from '../../providers/composeProviders';

export function renderWithProviders(ui: React.ReactElement, options?: any){
  const Wrapper = ({ children }: {children: React.ReactNode}) => <>{composeProviders(['oak','mode','bridge'], children)}</>;
  return render(ui, { wrapper: Wrapper, ...options });
}
```

### 11.2 Mode Toggle Test Example

```ts
import { screen } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import { useColorMode } from '../../theme/ColorModeContext';

const ModeProbe = () => { const { mode } = useColorMode(); return <span data-testid="mode">{mode}</span>; };

test('toggles color mode', () => {
  const { rerender } = renderWithProviders(<ModeProbe />);
  expect(screen.getByTestId('mode').textContent).toBe('light');
  // simulate toggle via context action (could expose toggle through a test helper)
});
```

---

## 12. Contrast & Accessibility

```ts
import { getContrast } from 'polished';
expect(
  getContrast(theme.colors.surface.primary.bg, theme.colors.text.primary),
).toBeGreaterThanOrEqual(4.5);
```

Include hover, focus, active, disabled state contrast matrix + reduced motion checks.

---

## 13. Performance & Memory

| Issue                       | Mitigation                                       |
| --------------------------- | ------------------------------------------------ |
| Recompute semantic theme    | Memoize over `(mode, rawVersion, overridesHash)` |
| Style tag churn             | Single `<style id=app-theme-vars>` diff only     |
| Duplicate styled-components | CI `npm ls styled-components` guard              |
| Heavy derived values        | Extract pure selectors                           |

---

## 14. SSR Streaming (styled-components v6)

```tsx
'use client';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleSheetManager, ServerStyleSheet } from 'styled-components';

export function StyledRegistry({ children }: { children: React.ReactNode }) {
  const [sheet] = React.useState(() => new ServerStyleSheet());
  useServerInsertedHTML(() => <>{sheet.getStyleElement()}</>);
  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}
```

Use only if auto integration unavailable.

---

## 15. Safe Deep Merge Policy

```ts
import merge from 'lodash.merge';
const ALLOWED = ['colors', 'spacing', 'radius', 'shadows'];
export function mergeTheme(base: any, override: any) {
  for (const k of Object.keys(override))
    if (!ALLOWED.includes(k)) console.warn('[theme-override] unexpected key', k);
  return merge({}, base, override);
}
```

---

## 16. Upgrade Workflow (Oak Components)

1. Bump dependency
2. Regenerate + diff raw token snapshot
3. Run semantic mapping coverage test
4. Contrast + a11y tests
5. Light/dark visual regression (Storybook/Percy)
6. Merge

---

## 17. Migration v5 → v6 (styled-components)

| Step | Action                             | Check                                      |
| ---- | ---------------------------------- | ------------------------------------------ |
| 1    | Install v6 / update lock           | `npm ls styled-components` single instance |
| 2    | Remove Babel plugin                | Compiler handles annotations               |
| 3    | Add streaming registry (if needed) | Styles appear once                         |
| 4    | Refresh snapshots                  | Hashes stable / normalized                 |
| 5    | Perf + contrast tests              | No regressions                             |

---

## 18. Observability & Validation

```ts
export function validateSemanticTheme(t: any) {
  for (const ns of ['surface', 'text', 'intent'])
    if (!(ns in t)) console.warn('[theme] missing namespace', ns);
}
```

Optional CI: diff sorted semantic key list; warn on unknown overrides.

---

## 19. Security & Stability Guidelines

- Immutable theme objects
- No dynamic `eval`
- Validate overrides before merge
- Pin DS + styled-components versions

---

## 20. When To Mock (And When Not)

| Scenario                   | Recommendation           |
| -------------------------- | ------------------------ |
| Pure logic hook            | Minimal wrapper          |
| Fallback edge case         | Small synthetic subset   |
| Micro perf test            | Slim fixed theme fixture |
| Visual / a11y verification | Real tokens only         |

Mocking is exceptional; real tokens default.

---

## 21. Pitfalls & Remedies

| Pitfall                        | Impact             | Remedy                 |
| ------------------------------ | ------------------ | ---------------------- |
| Shallow theme spread           | Lost nested values | Controlled deep merge  |
| Raw token in component         | Upgrade friction   | ESLint rule/codemod    |
| Two styled-components versions | Broken theming     | Resolutions + CI guard |
| Mode causes full rerender      | Perf + flicker     | HTML class toggle      |
| In-place mutation              | Stale consumers    | Return new object      |

---

## 22. Future Enhancements

| Idea                       | Benefit                      |
| -------------------------- | ---------------------------- |
| Token codegen              | Prevent drift; clearer diffs |
| ESLint raw token ban       | Enforce semantic layer       |
| Storybook theme playground | Faster visual QA             |
| Contrast regression matrix | Continuous WCAG assurance    |

---

## 23. FAQ

**Why not one merged theme?** Isolation & intent clarity.  
**Will v6 break Oak Components?** Unlikely; guard duplicates.  
**Why hybrid CSS vars + JS object?** Instant mode switch + typed access.  
**Snapshot themes?** Prefer behavior; snapshot key presence only.  
**Detect raw token leakage?** ESLint rule scanning for `oakDefaultTheme.` outside mapping.

---

## 24. Glossary

| Term           | Definition                                |
| -------------- | ----------------------------------------- |
| DS             | Oak Design System raw tokens + components |
| Semantic token | Intent alias referencing raw token(s)     |
| Bridge         | Mapping + CSS var emission layer          |
| Hybrid theming | CSS vars + JS theme synergy               |

---

## 25. Machine-Readable Summary

```yaml
providers_order: [oak, bridge, styled]
mode_switch: html_class_toggle
css_variables: true
semantic_mapping: required
safe_merge: true
contrast_AA_required: true
styled_components_target: 6
allow_theme_mocking: logic_only
validation: validateSemanticTheme
upgrade_sequence: [bump_ds, diff_tokens, run_contrast_tests, visual_regression]
```

---

## 26. Human Summary

> For automation/scaffolding tasks cite section numbers to minimize ambiguity.
