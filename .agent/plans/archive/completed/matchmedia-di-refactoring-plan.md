# matchMedia Dependency Injection Refactoring Plan

**Status**: 🔴 CRITICAL - BLOCKING  
**Priority**: Highest - Blocks test isolation fix  
**Estimated Effort**: 3-4 hours  
**Created**: 2025-12-21  
**Blocking**: [test-isolation-architecture-fix.md](../quality-and-maintainability/test-isolation-architecture-fix.md)

---

## Problem Statement

Tests mutate `window.matchMedia` globally, causing test failures when process isolation is removed. This violates testing-strategy.md line 25: "Tests MUST NOT manipulate shared global state".

### Current Violation

```typescript
// mock-match-media.ts
export function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => createMediaQueryList({ matches, query })),
  });
}

// SearchPageClient.test-helpers.tsx
export function resetSearchPageTestState(): void {
  mockMatchMedia(true);  // ← GLOBAL STATE MUTATION
  // ...
}
```

This is equivalent to `vi.stubGlobal('matchMedia', ...)` which we eliminated in Phase 2 of the global state elimination plan.

### Root Cause

Product code directly accesses `window.matchMedia` with no abstraction:

```typescript
// SearchSecondary.tsx - useBreakpointMatch hook
const media = window.matchMedia(query);

// theme-utils.ts
window.matchMedia('(prefers-color-scheme: dark)').matches
```

No dependency injection, no way to pass test implementations.

---

## Goal

Refactor product code to accept matchMedia as an injected dependency, enabling tests to pass mock implementations without mutating global state.

---

## Solution Architecture

### Pattern: Context Provider with Injected Media Query API

Create a MediaQueryProvider that wraps the browser API and can be mocked in tests:

```typescript
// 1. Define the interface
interface MediaQueryAPI {
  matchMedia(query: string): MediaQueryList;
}

// 2. Create context
const MediaQueryContext = React.createContext<MediaQueryAPI | null>(null);

// 3. Provider uses real browser API
export function MediaQueryProvider({ children }: { children: ReactNode }) {
  const api: MediaQueryAPI = useMemo(() => ({
    matchMedia: (query: string) => window.matchMedia(query),
  }), []);
  
  return <MediaQueryContext.Provider value={api}>{children}</MediaQueryContext.Provider>;
}

// 4. Hook to access API
export function useMediaQuery() {
  const context = useContext(MediaQueryContext);
  if (!context) {
    throw new Error('useMediaQuery must be used within MediaQueryProvider');
  }
  return context;
}

// 5. Product code uses hook
function useBreakpointMatch(name: BreakpointName): boolean {
  const { matchMedia } = useMediaQuery();
  const media = matchMedia(query);
  // ... rest of logic
}
```

In tests:

```typescript
function renderWithMockMedia(matches: boolean) {
  const mockAPI: MediaQueryAPI = {
    matchMedia: vi.fn(() => createMediaQueryList({ matches, query: '' })),
  };
  
  render(
    <MediaQueryContext.Provider value={mockAPI}>
      <Component />
    </MediaQueryContext.Provider>
  );
}
```

---

## Implementation Steps

### Phase 1: Create Media Query Abstraction (30 mins)

#### Task 1.1: Create MediaQueryContext

**File**: `apps/oak-search-cli/app/lib/media-query/MediaQueryContext.tsx`

```typescript
import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface MediaQueryAPI {
  matchMedia(query: string): MediaQueryList;
}

const MediaQueryContext = createContext<MediaQueryAPI | null>(null);

export function MediaQueryProvider({ children }: { children: ReactNode }): JSX.Element {
  const api: MediaQueryAPI = useMemo(() => ({
    matchMedia: (query: string) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        // SSR fallback - return mock that always returns false
        return {
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => true,
        } as MediaQueryList;
      }
      return window.matchMedia(query);
    },
  }), []);

  return <MediaQueryContext.Provider value={api}>{children}</MediaQueryContext.Provider>;
}

export function useMediaQuery(): MediaQueryAPI {
  const context = useContext(MediaQueryContext);
  if (!context) {
    throw new Error('useMediaQuery must be used within MediaQueryProvider');
  }
  return context;
}
```

**Tests**: Create `MediaQueryContext.unit.test.tsx` - test the provider returns working API.

### Phase 2: Refactor Product Code (90 mins)

#### Task 2.1: Update SearchSecondary.tsx

**File**: `apps/oak-search-cli/app/ui/search/layout/SearchSecondary.tsx`

Replace direct `window.matchMedia` usage:

```typescript
function useBreakpointMatch(name: BreakpointName): boolean {
  const theme = useTheme();
  const { matchMedia } = useMediaQuery(); // ← Injected dependency

  const computeMatch = useCallback(() => {
    const query = `(min-width: ${resolveBreakpoint(theme, name)})`;
    return matchMedia(query).matches; // ← Use injected API
  }, [theme, name, matchMedia]);

  // ... rest unchanged
}
```

#### Task 2.2: Update theme-utils.ts

**File**: `apps/oak-search-cli/app/lib/theme/theme-utils.ts`

These are pure functions, not React hooks. Add matchMedia as parameter:

```typescript
export function getSystemPrefersDark(
  matchMedia: (query: string) => MediaQueryList = window.matchMedia.bind(window)
): boolean {
  try {
    return matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function subscribeToSystemPrefersDark(
  onChange: (prefersDark: boolean) => void,
  matchMedia: (query: string) => MediaQueryList = window.matchMedia.bind(window)
): () => void {
  try {
    const mql = matchMedia('(prefers-color-scheme: dark)');
    // ... rest unchanged
  } catch {
    return () => undefined;
  }
}

export function getContrastPreference(
  matchMedia: (query: string) => MediaQueryList = window.matchMedia.bind(window)
): ContrastPreference {
  try {
    if (matchMedia('(prefers-contrast: more)').matches) {
      return 'high';
    }
    // ... rest unchanged
  } catch {
    return 'no-preference';
  }
}
```

#### Task 2.3: Update ThemeContext

**File**: `apps/oak-search-cli/app/lib/theme/ThemeContext.tsx`

Update to use injected matchMedia:

```typescript
import { useMediaQuery } from '../media-query/MediaQueryContext';

export function ThemeProvider({ initialMode, children }: ThemeProviderProps): JSX.Element {
  const { matchMedia } = useMediaQuery();
  
  useEffect(() => {
    const unsubscribe = subscribeToSystemPrefersDark(
      (prefersDark) => {
        setResolved(prefersDark ? 'dark' : 'light');
      },
      matchMedia // ← Pass injected API
    );
    return unsubscribe;
  }, [matchMedia]);
  
  // ... rest unchanged
}
```

#### Task 2.4: Update app layout

**File**: `apps/oak-search-cli/app/layout.tsx`

Wrap app with MediaQueryProvider:

```typescript
import { MediaQueryProvider } from './lib/media-query/MediaQueryContext';

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <MediaQueryProvider>
          {/* ... existing providers */}
          {children}
        </MediaQueryProvider>
      </body>
    </html>
  );
}
```

### Phase 3: Refactor Tests (60 mins)

#### Task 3.1: Create test helper

**File**: `apps/oak-search-cli/app/lib/media-query/MediaQueryContext.test-helpers.tsx`

```typescript
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import type { ReactNode } from 'react';
import { MediaQueryContext, type MediaQueryAPI } from './MediaQueryContext';

export function createMockMediaQueryAPI(matches: boolean): MediaQueryAPI {
  return {
    matchMedia: vi.fn((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    })) as unknown as MediaQueryList,
  };
}

export function renderWithMediaQuery(
  ui: ReactNode,
  { matches = false }: { matches?: boolean } = {}
) {
  const mockAPI = createMockMediaQueryAPI(matches);
  
  return {
    ...render(
      <MediaQueryContext.Provider value={mockAPI}>
        {ui}
      </MediaQueryContext.Provider>
    ),
    mockAPI,
  };
}
```

#### Task 3.2: Update SearchPageClient.test-helpers

**File**: `apps/oak-search-cli/app/ui/search/SearchPageClient.test-helpers.tsx`

Replace `mockMatchMedia` with provider:

```typescript
import { MediaQueryProvider } from '../../lib/media-query/MediaQueryContext';
import { createMockMediaQueryAPI } from '../../lib/media-query/MediaQueryContext.test-helpers';

export function renderWithTheme(
  action: StructuredSearchAction,
  options: {
    theme?: AppTheme;
    initialFixtureMode?: FixtureMode;
    showFixtureToggle?: boolean;
    variant?: 'default' | 'structured' | 'natural';
    mediaMatches?: boolean; // ← New option
  } = {},
): AppTheme {
  const theme = isAppTheme(options.theme) ? options.theme : createLightTheme();
  const mockMediaAPI = createMockMediaQueryAPI(options.mediaMatches ?? true);

  render(
    <MediaQueryContext.Provider value={mockMediaAPI}>
      <StyledThemeProvider theme={theme}>
        <FixtureModeProvider initialMode={initialFixtureMode}>
          <SearchPageClient
            searchStructured={action}
            initialFixtureMode={initialFixtureMode}
            showFixtureToggle={showFixtureToggle}
            variant={variant}
          />
        </FixtureModeProvider>
      </StyledThemeProvider>
    </MediaQueryContext.Provider>
  );
  return theme;
}

export function resetSearchPageTestState(): void {
  // Remove mockMatchMedia(true) call
  structuredPropsRef.current = null;
  facetPropsRef.current = null;
  refreshMock.mockReset();
  setFixtureModeMock.mockReset();
  setFixtureModeMock.mockResolvedValue(undefined);
}
```

#### Task 3.3: Update ThemeSystemPreference test

**File**: `apps/oak-search-cli/app/lib/theme/ThemeSystemPreference.integration.test.tsx`

Pass matchMedia as parameter to mocked functions:

```typescript
vi.mock('./theme-utils', async () => {
  const actual = await vi.importActual('./theme-utils');
  return {
    ...actual,
    getSystemPrefersDark: () => false,
    subscribeToSystemPrefersDark: (
      onChange: (pref: boolean) => void,
      matchMedia?: (query: string) => MediaQueryList
    ) => {
      // Mock implementation respects injected matchMedia parameter
      setTimeout(() => {
        try {
          onChange(true);
        } catch {
          // ignore
        }
      }, 0);
      return () => undefined;
    },
  };
});
```

#### Task 3.4: Delete mock-match-media files

**Files to delete**:

- `apps/oak-search-cli/app/ui/search/mock-match-media.ts`
- `apps/oak-search-cli/app/ui/search/mock-match-media-registries.ts`

These are no longer needed.

### Phase 4: Verification (30 mins)

#### Task 4.1: Run tests individually

```bash
cd apps/oak-search-cli
pnpm vitest run app/lib/theme/ThemeSystemPreference.integration.test.tsx
pnpm vitest run app/ui/search/layout/SearchPageLayout.error.unit.test.tsx
```

Both must pass (exit code 0).

#### Task 4.2: Run full test suite

```bash
cd apps/oak-search-cli
pnpm test
```

Must show: All tests pass, exit code 0.

#### Task 4.3: Verify no global mutations remain

```bash
cd apps/oak-search-cli
rg "Object\.defineProperty\(window" --glob "*.test.ts*"
rg "mockMatchMedia" --glob "*.test.ts*"
```

Expected: No matches (or only in deleted/archive files).

### Phase 5: Quality Gates (30 mins)

Run all quality gates from repo root:

```bash
cd ./
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

All must pass (exit code 0).

---

## Success Criteria

- ✅ No `window.matchMedia` mutations in any test files
- ✅ No `Object.defineProperty(window, ...)` in test files
- ✅ All product code uses injected `matchMedia` dependency
- ✅ All tests pass without process isolation (`isolate: false`)
- ✅ Test isolation fix can proceed (unblocked)
- ✅ All quality gates pass

---

## Foundation Documents

Before implementing, re-read:

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`

Key principle: Tests MUST NOT manipulate global state. Product code must accept dependencies as parameters.

---

## Related Documents

- **Blocked by this**: [test-isolation-architecture-fix.md](../semantic-search/test-isolation-architecture-fix.md)
- **Part of**: [global-state-elimination-and-testing-discipline-plan.md](../quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md)
- **Testing Strategy**: `.agent/directives/testing-strategy.md` (line 25, 37)
- **ADR**: Should create ADR documenting this pattern for future media query usage

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SSR breakage | Low | High | MediaQueryProvider includes SSR fallback |
| Context not provided | Low | Medium | Hook throws descriptive error |
| Test coverage gaps | Medium | Low | Run full test suite after each phase |
| Breaking existing functionality | Low | High | Incremental refactoring, tests verify behaviour |

---

## Notes

This refactoring establishes a pattern for handling browser APIs in React:

1. Define interface for the API
2. Create context provider that wraps real browser API
3. Create hook to access the API
4. Product code uses hook
5. Tests inject mock implementation via provider

This pattern should be documented in an ADR and applied to other browser APIs (localStorage, fetch, etc.) in future work.
