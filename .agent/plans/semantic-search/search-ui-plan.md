# Search UI: Frontend Implementation Plan

Last updated: 2025-11-11

## Executive Summary

This plan details the semantic search frontend implementation: React components, design system integration, theme management, fixture testing, and accessibility compliance. The UI is built with Next.js 15 App Router, Oak Components design system, and Styled Components.

**Goal**: Create a robust, accessible, beautiful search interface that works seamlessly across devices and supports comprehensive testing via fixture mode.

**Duration**: Concurrent with backend work, ~6-8 weeks across implementation phases.

## Table of Contents

1. [Current UI State](#current-ui-state)
2. [Design System and Theme](#design-system-and-theme)
3. [Component Architecture](#component-architecture)
4. [Fixture Testing Strategy](#fixture-testing-strategy)
5. [Responsive Layout](#responsive-layout)
6. [Accessibility Requirements](#accessibility-requirements)
7. [Playwright E2E Tests](#playwright-e2e-tests)
8. [Client State Management](#client-state-management)
9. [Performance and Optimization](#performance-and-optimization)

---

## Current UI State

### What Works Today

**Pages**:

- `/` - Search landing page with structured and natural language forms
- `/structured_search` - Dedicated structured search interface
- `/natural_language_search` - Natural language search with intent parsing
- `/admin` - Admin dashboard for ingestion, telemetry, zero-hit monitoring
- `/api/docs` - OpenAPI documentation via Redoc

**Components**:

- `SearchResults` - Unified result display for lessons, units, sequences
- `SearchFilters` - Subject, key stage, year, category facets
- `SearchSuggestions` - Type-ahead completion (placeholder)
- `Header` - Navigation with Oak branding
- `Footer` - Oak standard footer

**Features**:

- Hybrid search (structured + natural language)
- Faceted filtering
- Multi-scope search (lessons, units, sequences, all)
- Fixture mode toggle for testing
- Light/dark theme support

### Known Gaps

1. **Missing ontology UI**:
   - No thread filtering UI
   - No programme factor filters (tier, exam board)
   - No unit type classification display
   - No content guidance structured view
   - No lesson component availability filters

2. **Incomplete responsive behavior**:
   - Layout issues at mobile breakpoints (360px-480px)
   - Form panels don't stack properly on small screens
   - Result cards clip at some breakpoints

3. **Theme infrastructure debt**:
   - ~1,200 LOC of bespoke theme code
   - Manual token resolution
   - CSS variable bridge for non-React styling
   - Pre-hydration script for theme persistence

4. **Limited Playwright coverage**:
   - No responsive baseline captures
   - Missing accessibility regression tests
   - Fixture toggle not comprehensively tested

---

## Design System and Theme

### Oak Components Integration

The search UI uses `@oaknational/oak-components` (v1.149.0+) as the design foundation.

**Core components used**:

- `OakThemeProvider` - Theme context
- `OakTypography` - Text elements
- `OakButton`, `OakIconButton` - Interactive elements
- `OakInput`, `OakSelect` - Form controls
- `OakCard` - Result cards
- `OakAlert` - Notifications
- `OakGrid`, `OakFlex` - Layout primitives

### Theme Architecture

**Current implementation** (~1,200 LOC across 10 files):

```text
app/lib/theme/
├── ColorModeContext.tsx           # Light/dark mode state
├── ThemeContext.tsx                # Theme provider wrapper
├── HtmlThemeAttribute.tsx          # Pre-hydration theme attribute
├── ThemeBridgeProvider.tsx         # Styled Components + Oak bridge
├── ThemeCssVars.tsx                # CSS variable emission
├── ThemeGlobalStyle.tsx            # Global styles
└── semantic-theme/
    ├── semantic-theme-spec.ts      # Extended theme definition (~230 LOC)
    ├── semantic-theme-resolver.ts  # Token resolution (~240 LOC)
    └── semantic-theme.ts            # Theme export
```

**Why this complexity?**:

Oak Components provides base theming but lacks:

1. **Dark mode** - No official dark theme, manual override required
2. **CSS variables** - Components accept theme props but don't emit CSS vars
3. **Extended surface** - Limited to `uiColors`, no custom spacing/typography
4. **Theme variants** - No factory API, must manually create variants

**Our extensions**:

- Custom light/dark color palettes (~24 UI role tokens each)
- Token resolution utilities (spacing, typography, colors → CSS values)
- CSS variable bridge for global styling
- Extended theme surface (custom spacing, layout tokens)

### Theme Tokens

**Color Modes**:

- Light mode: Default Oak palette with custom overrides
- Dark mode: High-contrast dark palette meeting WCAG AA

**Spacing Scale** (from Oak + custom):

- `space-between-xs` → `space-between-xxxl` (8px → 128px)
- Custom layout tokens: `containerMaxWidth`, `inlinePadding`, `gap.*`

**Typography Scale** (Lexend typeface):

- Headings: `h1` (48-56px) → `h6` (16px)
- Body: 18px desktop, 16px mobile
- UI text: 14-16px
- Line heights: 1.1-1.2 (headings), 1.5-1.6 (body)

**Breakpoints**:

```typescript
const breakpoints = {
  xs: '0px', // Phones ≤ 479px
  sm: '480px', // Large phones
  md: '768px', // Tablets
  lg: '1024px', // Small desktops
  xl: '1360px', // Standard desktops
  xxl: '1760px', // Ultrawide
};
```

### Theme Implementation Plan

**Phase 1: Maintain current theme** (during backend migration)

- Keep existing theme infrastructure working
- No breaking changes to theme API
- Document theme debt for future refactor

**Phase 2: Simplify theme** (future, after backend complete)

- Reduce LOC by adopting Oak Components improvements (if available)
- Consider CSS-only solution using CSS variables
- Explore pre-built dark theme if Oak provides

**Phase 3: Consolidate** (future)

- Minimize custom theme code
- Align with Oak Components best practices
- Remove workarounds as Oak improves

---

## Component Architecture

### Page Components

#### Search Pages

**`app/page.tsx`** - Landing page

- Hero section with intro copy
- Structured + Natural language forms side-by-side (desktop)
- Stacked on mobile
- Direct search submission

**`app/structured_search/page.tsx`** - Structured search

- Filter panel (subject, key stage, year, category, **thread**, **tier**, **exam board**)
- Scope selector (lessons, units, sequences, **threads**, all)
- Query input
- Results display with facets

**`app/natural_language_search/page.tsx`** - Natural language

- Free-text query input
- Intent parsing with OpenAI
- Automatic conversion to structured search
- Results display

#### Admin Pages

**`app/admin/page.tsx`** - Admin dashboard

- Ingestion controls (index, rebuild)
- Status monitoring
- Zero-hit telemetry dashboard
- Quick actions

### Shared Components

#### `app/ui/search/components/SearchResults.shared.tsx`

**Purpose**: Unified result display across scopes.

**Props**:

```typescript
interface SearchResultsProps {
  scope: SearchScope;
  results: SearchResult[];
  total: number;
  facets?: SearchFacets;
  suggestions?: SuggestionItem[];
  meta?: SearchMeta;
}
```

**Features**:

- Scope-specific card rendering (lessons, units, sequences, **threads**)
- Faceted navigation sidebar
- Pagination
- Empty states
- Error states

**Ontology Integration** (NEW):

- Display thread badges on units/lessons
- Show programme factors (tier, exam board) on KS4 content
- Unit type indicators (simple, variant, optionality)
- Content guidance categories
- Component availability icons

#### `app/ui/search/components/SearchFilters.tsx`

**Purpose**: Faceted filtering UI.

**Filters**:

- **Existing**: Subject, key stage, year, category
- **NEW**: Thread, tier, exam board, exam subject, pathway
- **NEW**: Unit type, supervision level, component availability

**Implementation**:

```typescript
interface SearchFiltersProps {
  facets: SearchFacets;
  activeFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  subject?: string;
  key_stage?: string;
  year?: string;
  category?: string;
  // NEW
  thread?: string;
  tier?: 'foundation' | 'higher';
  exam_board?: string;
  unit_type?: 'simple' | 'variant' | 'optionality';
  supervision_level?: 1 | 2 | 3 | 4;
  components?: {
    video?: boolean;
    worksheet?: boolean;
    quiz?: boolean;
  };
}
```

**UI Pattern**:

- Collapsible filter sections
- Checkbox groups for multi-select
- Radio buttons for single-select
- Count badges showing result counts

#### `app/ui/search/components/SearchSuggestions.tsx`

**Purpose**: Type-ahead completion.

**Features**:

- Debounced input
- Suggestion list with context
- Keyboard navigation
- Highlighting of matched text
- Facet-aware suggestions

**Scope Support**:

- Suggestions for lessons, units, sequences, **threads**

#### `app/ui/global/Fixture/FixtureModeToggle.tsx`

**Purpose**: Toggle between live data and fixtures.

**Modes**:

- `live` - Real API calls
- `fixtures` - Success fixtures with full results
- `fixtures-empty` - Empty result sets
- `fixtures-error` - Error scenarios

**Persistence**: Cookie-based, survives page reloads.

**Visibility**: Controlled by environment variable, always visible in development.

### Component Patterns

**State Management**:

- URL-driven search state (query params synced)
- React Context for theme
- Local state for UI interactions

**Data Fetching**:

- Server actions for initial data
- Client-side fetch for subsequent searches
- Optimistic updates for better UX

**Error Handling**:

- Try-catch with fallback UI
- Toast notifications for non-critical errors
- Full-page error states for critical failures

**Loading States**:

- Skeleton screens for result cards
- Inline spinners for filters
- Suspense boundaries for async components

---

## Fixture Testing Strategy

### Fixture Modes

The UI supports four fixture modes for comprehensive testing:

1. **Live Mode** (`'live'`)
   - Real API calls to backend
   - Actual Elasticsearch queries
   - Production-like behavior

2. **Fixtures (Success)** (`'fixtures'`)
   - Deterministic mock data
   - Full result sets with variety
   - All facets populated
   - All scopes covered

3. **Fixtures (Empty)** (`'fixtures-empty'`)
   - Empty result sets
   - Zero-state UI testing
   - Empty facets
   - Tests fallback messaging

4. **Fixtures (Error)** (`'fixtures-error'`)
   - Simulated API errors
   - 500 status codes
   - Error boundary testing
   - Retry flow validation

### Fixture Implementation

**Cookie Control**:

```typescript
const FIXTURE_MODE_COOKIE = 'semantic-search-fixtures';

type FixtureMode = 'live' | 'fixtures' | 'fixtures-empty' | 'fixtures-error';

function setFixtureMode(mode: FixtureMode): void {
  cookies().set(FIXTURE_MODE_COOKIE, mode);
}
```

**API Route Handling**:

```typescript
export async function POST(request: Request) {
  const fixtureMode = getFixtureMode(request);

  if (fixtureMode === 'fixtures') {
    return Response.json(successFixture);
  }
  if (fixtureMode === 'fixtures-empty') {
    return Response.json(emptyFixture);
  }
  if (fixtureMode === 'fixtures-error') {
    return Response.json(errorFixture, { status: 500 });
  }

  // Live mode - actual search
  return performSearch(request);
}
```

**Fixture Builders**:

```text
app/ui/search-fixtures/builders/
├── single-scope.ts         # Lessons, units, or sequences
├── multi-scope.ts          # All scopes combined
├── empty.ts                # Empty results
├── timed-out.ts            # Timeout scenarios
└── __tests__/
    ├── single-scope.unit.test.ts
    ├── multi-scope.unit.test.ts
    └── empty.unit.test.ts
```

**Fixture Data**:

- Realistic lesson/unit/sequence data
- Proper facet structures
- Valid programme slugs with factors
- Thread metadata
- Component availability flags

### Fixture Coverage Matrix

| Scenario                    | Live | Fixtures | Empty | Error | Notes                   |
| --------------------------- | ---- | -------- | ----- | ----- | ----------------------- |
| Structured search (lessons) | ✅   | ✅       | ✅    | ✅    | All scopes covered      |
| Natural language search     | ✅   | ✅       | ✅    | ✅    | Intent parsing stubbed  |
| Multi-scope search          | ✅   | ✅       | ✅    | ✅    | All buckets present     |
| Thread search               | 🔲   | 🔲       | 🔲    | 🔲    | NEW - needs fixtures    |
| Faceted filtering           | ✅   | ✅       | ✅    | ✅    | All filter combinations |
| Suggestions                 | ✅   | ✅       | ✅    | ✅    | Type-ahead with context |
| Programme factor filters    | 🔲   | 🔲       | 🔲    | 🔲    | NEW - needs fixtures    |
| Component filters           | 🔲   | 🔲       | 🔲    | 🔲    | NEW - needs fixtures    |

Legend: ✅ Implemented, 🔲 Needs implementation

### Testing with Fixtures

**Unit Tests**:

```typescript
describe('SearchResults component', () => {
  it('should render success fixture results', () => {
    const fixture = buildSuccessFixture({ scope: 'lessons' });
    render(<SearchResults {...fixture} />);
    expect(screen.getByText(fixture.results[0].title)).toBeInTheDocument();
  });

  it('should render empty state with empty fixture', () => {
    const fixture = buildEmptyFixture({ scope: 'lessons' });
    render(<SearchResults {...fixture} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });
});
```

**Integration Tests**:

```typescript
describe('Search API with fixtures', () => {
  it('should return fixture data when cookie set', async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { Cookie: 'semantic-search-fixtures=fixtures' },
      body: JSON.stringify({ text: 'test', scope: 'lessons' }),
    });

    const data = await response.json();
    expect(data.results).toHaveLength(10);
  });
});
```

**Playwright E2E**:

```typescript
test('should use fixtures when cookie set', async ({ page }) => {
  await page.context().addCookies([
    {
      name: 'semantic-search-fixtures',
      value: 'fixtures',
      domain: 'localhost',
      path: '/',
    },
  ]);

  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'photosynthesis');
  await page.click('[data-testid="search-button"]');

  await expect(page.getByTestId('result-card')).toHaveCount(10);
});
```

---

## Responsive Layout

### Breakpoint Strategy

Following Oak Components breakpoint tokens:

```typescript
const breakpoints = {
  xs: '0px', // 0-479px: Phones
  sm: '480px', // 480-767px: Large phones, small tablets
  md: '768px', // 768-1023px: Tablets landscape
  lg: '1024px', // 1024-1359px: Small desktops
  xl: '1360px', // 1360-1759px: Standard desktops
  xxl: '1760px', // 1760px+: Ultrawide monitors
};
```

### Layout Patterns by Breakpoint

#### `bp-xs` (0-479px) - Mobile First

**Search Forms**:

- Stack structured + natural language panels vertically
- Full-width inputs
- Collapsible filter sections
- Fixed "Search" button at bottom

**Results**:

- Single-column list
- Cards stack with full width
- Compact card design
- Infinite scroll (lazy load)

**Facets**:

- Off-canvas drawer (slide from right)
- Overlay with backdrop
- Sticky "Apply Filters" button

#### `bp-md` (768-1023px) - Tablets

**Search Forms**:

- Two-column grid: structured | natural
- Grid: `minmax(0, 1.25fr) minmax(0, 1fr)`

**Results**:

- Two-column grid for cards
- Grid: `repeat(2, minmax(0, 1fr))`

**Facets**:

- Sidebar visible
- Collapsible sections

#### `bp-lg` (1024-1359px) - Desktops

**Search Forms**:

- Maintain two-column grid
- Wider inputs

**Results**:

- Three-column grid option
- Grid: `repeat(auto-fill, minmax(18rem, 1fr))`

**Facets**:

- Fixed sidebar
- Always visible

#### `bp-xxl` (1760px+) - Ultrawide

**Layout Constraint**:

- Max width: `clamp(20rem, 92vw, 78rem)` (1248px)
- Centered with `margin-inline: auto`
- Prevents excessive line lengths

**Results**:

- Three-column grid (capped)
- Additional whitespace in gutters

### Responsive Components

**Container Component**:

```typescript
const Container = styled.div`
  margin-inline: auto;
  max-inline-size: var(--app-layout-container-max-width);
  padding-inline: clamp(
    var(--app-layout-inline-padding-base),
    4vw,
    var(--app-layout-inline-padding-wide)
  );
`;
```

**Responsive Grid**:

```typescript
const ResultsGrid = styled.div`
  display: grid;
  gap: var(--app-gap-cluster);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  }
`;
```

### Layout Validation

**Playwright Visual Regression**:

- Capture screenshots at each breakpoint (360px, 800px, 1200px, 2000px)
- Baseline images in `tests/visual/`
- Assert no layout overflow or clipping

**Responsive Tests**:

```typescript
const viewports = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 800, height: 1000 },
  { name: 'desktop', width: 1200, height: 1000 },
  { name: 'ultrawide', width: 2000, height: 1200 },
];

for (const viewport of viewports) {
  test(`Layout works at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    // Assert no horizontal scroll
    const hasOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBe(false);

    // Capture screenshot
    await page.screenshot({ path: `tests/visual/search-${viewport.name}.png` });
  });
}
```

---

## Accessibility Requirements

Following Oak's accessibility standards and WCAG 2.1 Level AA.

### Core Requirements

1. **Semantic HTML**
   - Use proper heading hierarchy (`h1` → `h6`)
   - `<main>`, `<nav>`, `<article>` landmarks
   - Form labels associated with inputs

2. **Keyboard Navigation**
   - All interactive elements focusable via Tab
   - Focus indicators visible (outline + background change)
   - Skip links for navigation bypass
   - Esc key closes modals/drawers

3. **Screen Reader Support**
   - ARIA labels for interactive elements
   - `aria-live` regions for dynamic content
   - `aria-expanded` for collapsible sections
   - `role="search"` for search forms

4. **Color and Contrast**
   - Text contrast ≥ 4.5:1 (normal text)
   - UI component contrast ≥ 3:1
   - Don't rely on color alone for meaning
   - Tested in both light and dark modes

5. **Typography and Spacing**
   - Large, legible fonts (≥16px body, ≥18px preferred)
   - Line height ≥ 1.5 for body text
   - Adequate spacing between interactive elements (≥44px touch targets)

### Component Accessibility

**Search Form**:

```typescript
<form role="search" aria-label="Search Oak Curriculum">
  <label htmlFor="search-input">
    Search lessons, units, and resources
  </label>
  <input
    id="search-input"
    type="search"
    aria-describedby="search-help"
    aria-invalid={hasError}
  />
  <div id="search-help">
    Enter keywords or questions about curriculum content
  </div>
  {error && (
    <div role="alert" aria-live="polite">
      {error.message}
    </div>
  )}
</form>
```

**Results Announcement**:

```typescript
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {`Found ${total} results for "${query}"`}
</div>
```

**Filter Panel**:

```typescript
<section aria-label="Filter results">
  <button
    aria-expanded={isExpanded}
    aria-controls="filter-panel"
    onClick={toggleFilters}
  >
    Filters {activeCount > 0 && `(${activeCount} active)`}
  </button>
  <div id="filter-panel" hidden={!isExpanded}>
    {/* Filter controls */}
  </div>
</section>
```

### Accessibility Testing

**Automated Tests** (axe-core via Playwright):

```typescript
test('Search page has no accessibility violations', async ({ page }) => {
  await page.goto('/');

  // Inject and run axe-core for accessibility testing
  const results = await page.evaluate(async () => {
    // axe-core is injected via test setup, returns AxeResults
    const axe = await import('axe-core');
    return axe.run();
  });

  expect(results.violations).toHaveLength(0);
});
```

**Manual Checks**:

- [ ] Navigate entire app with keyboard only
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify focus indicators visible
- [ ] Check color contrast in both themes
- [ ] Test with browser zoom (200%+)
- [ ] Verify touch targets ≥44px on mobile

**Accessibility Audit Cadence**:

- Run axe on every page before merging
- Manual screen reader test for new features
- Full audit before each major release

---

## Playwright E2E Tests

### Test Structure

```text
apps/oak-open-curriculum-semantic-search/tests/
├── e2e/
│   ├── search-structured.spec.ts
│   ├── search-natural-language.spec.ts
│   ├── search-multi-scope.spec.ts
│   ├── search-threads.spec.ts           # NEW
│   ├── search-filters.spec.ts
│   ├── suggestions.spec.ts
│   ├── fixture-mode.spec.ts
│   ├── responsive-layout.spec.ts
│   └── accessibility.spec.ts
├── visual/
│   ├── responsive-baseline.spec.ts
│   └── theme-comparison.spec.ts
└── fixtures/
    └── search-fixtures.ts
```

### Core Test Scenarios

#### Structured Search Flow

```typescript
test('should perform structured search for lessons', async ({ page }) => {
  await page.goto('/structured_search');

  // Fill search form
  await page.selectOption('[data-testid="scope-select"]', 'lessons');
  await page.selectOption('[data-testid="subject-filter"]', 'maths');
  await page.selectOption('[data-testid="key-stage-filter"]', 'ks2');
  await page.fill('[data-testid="search-input"]', 'fractions');

  // Submit
  await page.click('[data-testid="search-button"]');

  // Assert results
  await expect(page.getByTestId('result-card')).toHaveCount(greaterThan(0));
  await expect(page.getByText(/found \d+ results/i)).toBeVisible();

  // Check facets populated
  await expect(page.getByTestId('facet-section')).toBeVisible();
});
```

#### Natural Language Search

```typescript
test('should parse natural language query and show results', async ({ page }) => {
  await page.goto('/natural_language_search');

  await page.fill('[data-testid="nl-input"]', 'Year 5 multiplication lessons');
  await page.click('[data-testid="nl-search-button"]');

  // Wait for parsing
  await page.waitForSelector('[data-testid="parsed-intent"]');

  // Should auto-fill structured form
  await expect(page.getByTestId('scope-select')).toHaveValue('lessons');
  await expect(page.getByTestId('year-filter')).toHaveValue('5');

  // Results displayed
  await expect(page.getByTestId('result-card')).toHaveCount(greaterThan(0));
});
```

#### Thread Search (NEW)

```typescript
test('should search threads and show progression', async ({ page }) => {
  await page.goto('/structured_search');

  await page.selectOption('[data-testid="scope-select"]', 'threads');
  await page.fill('[data-testid="search-input"]', 'geometry');
  await page.click('[data-testid="search-button"]');

  // Assert thread results
  const threadCard = page.getByTestId('thread-result-card').first();
  await expect(threadCard).toBeVisible();

  // Check thread metadata
  await expect(threadCard.getByText(/\d+ units/i)).toBeVisible();
  await expect(threadCard.getByText(/years? \d+-\d+/i)).toBeVisible();

  // Click to view progression
  await threadCard.click();
  await expect(page).toHaveURL(/\/threads\/.+/);
});
```

#### Programme Factor Filtering (NEW)

```typescript
test('should filter by tier and exam board', async ({ page }) => {
  await page.goto('/structured_search');

  await page.selectOption('[data-testid="scope-select"]', 'lessons');
  await page.selectOption('[data-testid="subject-filter"]', 'biology');
  await page.selectOption('[data-testid="key-stage-filter"]', 'ks4');
  await page.selectOption('[data-testid="tier-filter"]', 'foundation');
  await page.selectOption('[data-testid="exam-board-filter"]', 'aqa');

  await page.fill('[data-testid="search-input"]', 'cell structure');
  await page.click('[data-testid="search-button"]');

  // Assert filtered results
  const results = page.getByTestId('result-card');
  await expect(results).toHaveCount(greaterThan(0));

  // Verify tier badge present
  await expect(results.first().getByText(/foundation/i)).toBeVisible();
});
```

#### Fixture Mode Toggle

```typescript
test('should toggle fixture mode and persist via cookie', async ({ page, context }) => {
  await page.goto('/');

  // Toggle to fixtures
  await page.selectOption('[data-testid="fixture-toggle"]', 'fixtures');

  // Check cookie set
  const cookies = await context.cookies();
  const fixtureCookie = cookies.find((c) => c.name === 'semantic-search-fixtures');
  expect(fixtureCookie?.value).toBe('fixtures');

  // Perform search
  await page.fill('[data-testid="search-input"]', 'test');
  await page.click('[data-testid="search-button"]');

  // Should get fixture results
  await expect(page.getByTestId('result-card')).toHaveCount(10);

  // Reload page, cookie should persist
  await page.reload();
  expect(await page.selectOption('[data-testid="fixture-toggle"]')).toBe('fixtures');
});
```

#### Responsive Layout

```typescript
const viewports = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 800, height: 1000 },
  { name: 'desktop', width: 1200, height: 1000 },
];

for (const viewport of viewports) {
  test(`Layout should work at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    // Forms visible
    await expect(page.getByRole('search')).toBeVisible();

    // No horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBe(false);

    // Screenshot
    await page.screenshot({ path: `tests/visual/layout-${viewport.name}.png` });
  });
}
```

#### Accessibility

```typescript
test('Search page should have no axe violations', async ({ page }) => {
  await page.goto('/');

  // Inject axe
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js',
  });

  // Run axe-core accessibility check
  const results = await page.evaluate(async () => {
    const axe = await import('axe-core');
    return axe.run();
  });

  // Assert no violations
  expect(results.violations).toHaveLength(0);
});

test('Should support keyboard navigation', async ({ page }) => {
  await page.goto('/');

  // Tab through form
  await page.keyboard.press('Tab'); // Focus on first input
  await page.keyboard.type('photosynthesis');

  await page.keyboard.press('Tab'); // Focus on scope select
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab'); // Focus on search button
  await page.keyboard.press('Enter');

  // Results should appear
  await expect(page.getByTestId('result-card')).toHaveCount(greaterThan(0));
});
```

### Test Organization

**Unit tests**: Component-level, fast, no dependencies
**Integration tests**: API routes + components, mocked dependencies
**E2E tests**: Full flows, real browser, fixture or live mode

**Run Commands**:

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests (requires dev server running)
pnpm test:e2e

# E2E with UI
pnpm test:e2e --ui

# Specific test file
pnpm test:e2e tests/e2e/search-threads.spec.ts
```

---

## Client State Management

### State Architecture

**URL-Driven State** (primary):

- Search query, filters, scope, page number → URL search params
- Browser back/forward works correctly
- Shareable URLs

**React Context** (global):

- Theme (light/dark)
- Fixture mode
- User preferences

**Component State** (local):

- Form inputs (temporary, pre-submit)
- UI interactions (drawer open/closed, dropdown expanded)
- Loading/error states

### Search State Flow

```typescript
interface SearchState {
  query: string;
  scope: SearchScope;
  filters: {
    subject?: string;
    key_stage?: string;
    year?: string;
    category?: string;
    thread?: string;
    tier?: 'foundation' | 'higher';
    exam_board?: string;
    unit_type?: 'simple' | 'variant' | 'optionality';
    supervision_level?: 1 | 2 | 3 | 4;
    components?: string[];
  };
  page: number;
}

function useSearchState(): [SearchState, (updates: Partial<SearchState>) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const state = parseSearchParams(searchParams);

  const setState = (updates: Partial<SearchState>) => {
    const newState = { ...state, ...updates };
    const params = serializeSearchState(newState);
    router.push(`?${params.toString()}`);
  };

  return [state, setState];
}
```

### Search Controller Hook

```typescript
function useSearchController() {
  const [state, setState] = useSearchState();
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify(state),
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    state,
    setState,
    results,
    loading,
    error,
    search,
  };
}
```

### Optimistic Updates

For fast UX, update UI immediately then sync with server:

```typescript
const updateFilter = (key: string, value: string) => {
  // Optimistic update
  setState({ filters: { ...state.filters, [key]: value } });

  // Server sync (automatic via URL change)
  // Results fetched via useEffect watching state
};
```

---

## Performance and Optimization

### Bundle Size

**Current**: ~800KB initial bundle (unoptimized)

**Optimization Targets**:

- Code splitting by route
- Lazy load Oak Components
- Tree-shake unused utilities
- **Target**: <300KB initial, <100KB per route

**Techniques**:

```typescript
// Route-based code splitting
const AdminPage = lazy(() => import('./admin/page'));

// Component lazy loading
const HeavyChart = lazy(() => import('./HeavyChart'));

// Conditional imports
if (isDevelopment) {
  await import('./devtools');
}
```

### Rendering Strategy

**Static** (pre-rendered at build):

- Landing page
- Documentation pages
- About/help pages

**Dynamic** (server-rendered on request):

- Search results
- Admin dashboard
- User-specific pages

**Client** (rendered in browser):

- Interactive filters
- Suggestions dropdown
- Theme toggle

### Caching Strategy

**API Response Caching** (Next.js Data Cache):

- Cache search results by query hash
- Invalidate on index version bump
- TTL: 1 hour for search, 5 minutes for suggestions

**Component Memoization**:

```typescript
const MemoizedResultCard = memo(ResultCard, (prev, next) => {
  return prev.result.slug === next.result.slug;
});

const SearchResults = ({ results }) => {
  const memoizedResults = useMemo(() => {
    return results.map(r => <MemoizedResultCard key={r.slug} result={r} />);
  }, [results]);

  return <>{memoizedResults}</>;
};
```

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src={lesson.thumbnailUrl}
  alt={lesson.title}
  width={300}
  height={200}
  loading="lazy"
/>
```

### Performance Monitoring

**Web Vitals**:

- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

**Monitoring**:

```typescript
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);

  // Send to analytics
  if (metric.name === 'LCP') {
    // Track LCP
  }
}
```

---

---

## Observability and Error Tracking

### Overview

The search UI requires error tracking and performance monitoring for production readiness, complementing backend observability with client-side insights.

**Related Plans:**

- [Logger Sentry & OpenTelemetry Integration Plan](../../observability/logger-sentry-otel-integration-plan.md) - Comprehensive plan for integrating Sentry and OTel
- Backend observability strategy is documented in the main implementation plan

### Current Observability

**Client-Side Logging**:

- Console errors in development
- No structured error tracking
- No performance monitoring

**User Feedback**:

- Error boundaries catch rendering errors
- Toast notifications for API errors
- No systematic error reporting

### Sentry Integration

**Implementation Status**: 🚧 Planned - see [Logger Sentry & OpenTelemetry Integration Plan](../../observability/logger-sentry-otel-integration-plan.md)

**Scope**: Client-side error tracking, performance monitoring, user session replay, and interaction tracking.

**Integration Approach**:

Once the logger integration is complete, Sentry will be initialized through `@oaknational/mcp-logger/nextjs`:

```typescript
// app/layout.tsx (root layout, client-side)
'use client';
import { useEffect } from 'react';
import { initSentryNextjsClient, buildSentryOptionsFromEnv } from '@oaknational/mcp-logger/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Sentry on client mount
    const options = buildSentryOptionsFromEnv({
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      NEXT_PUBLIC_SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
      NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
      NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
      NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
    });

    if (options) {
      initSentryNextjsClient(options);
    }
  }, []);

  return <html>{children}</html>;
}
```

**Alternative** (until logger integration is complete):

```typescript
// app/lib/sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

export function initClientSentry() {
  if (typeof window === 'undefined') return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn('Sentry DSN not configured');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),

    // Capture user interactions
    integrations: [
      Sentry.browserTracingIntegration({
        tracePropagationTargets: ['localhost', /^https:\/\/.*\.thenational\.academy/],
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: true,
        replaysSessionSampleRate: parseFloat(
          process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0.1',
        ),
        replaysOnErrorSampleRate: parseFloat(
          process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '1.0',
        ),
      }),
    ],

    // Ignore known errors
    ignoreErrors: ['ResizeObserver loop limit exceeded', 'Non-Error promise rejection'],
  });
}
```

#### Error Boundaries

```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class SearchErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### User Interaction Tracking

```typescript
function trackSearchInteraction(interaction: string, metadata?: object) {
  Sentry.addBreadcrumb({
    category: 'search',
    message: interaction,
    data: metadata,
    level: 'info'
  });
}

// Usage
function SearchForm() {
  const handleSearch = () => {
    trackSearchInteraction('search_submitted', {
      scope: state.scope,
      filters_active: Object.keys(state.filters).length,
      query_length: state.query.length
    });

    performSearch();
  };

  return (/* ... */);
}
```

#### Performance Monitoring

```typescript
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function useSearchPerformance(searchId: string) {
  useEffect(() => {
    const span = Sentry.startInactiveSpan({
      op: 'search.user_flow',
      name: 'Search Results Loading',
    });

    return () => {
      span.end();
    };
  }, [searchId]);
}

// Core Web Vitals
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'web-vital') {
    Sentry.setMeasurement(
      `web-vital.${metric.name}`,
      metric.value,
      metric.name === 'CLS' ? 'none' : 'millisecond',
    );
  }
}
```

### Client-Side Error Handling

**Error Categories**:

1. **Network errors** - API request failures
2. **Render errors** - Component crashes
3. **Validation errors** - Form input errors
4. **State errors** - Invalid state transitions

**Error Handling Pattern**:

```typescript
async function handleSearch() {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify(searchState),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    setResults(data);
  } catch (error) {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: {
        component: 'SearchForm',
        action: 'search',
      },
      extra: {
        searchState,
      },
    });

    // User-friendly message
    setError({
      message: 'Unable to complete search. Please try again.',
      retry: () => handleSearch(),
    });
  } finally {
    setLoading(false);
  }
}
```

### Performance Targets

**Core Web Vitals**:

- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

**Custom Metrics**:

- Time to first result: <1s
- Search input responsiveness: <50ms
- Filter application: <200ms
- Theme switch: <100ms

### User Feedback Collection

**Feedback Button** (optional):

```typescript
function FeedbackWidget() {
  const sendFeedback = () => {
    const eventId = Sentry.captureMessage('User Feedback', {
      level: 'info',
      tags: { type: 'user_feedback' }
    });

    Sentry.showReportDialog({
      eventId,
      title: 'Help us improve search',
      subtitle: 'Tell us about your experience',
      labelName: 'Your Name',
      labelEmail: 'Email',
      labelComments: 'What went wrong?'
    });
  };

  return (
    <button onClick={sendFeedback}>
      Report an issue
    </button>
  );
}
```

### Testing Observability

**Unit Tests**:

```typescript
describe('Error tracking', () => {
  it('should capture search errors', () => {
    const captureSpy = vi.spyOn(Sentry, 'captureException');

    render(<SearchForm />);
    // Trigger error
    fireEvent.click(screen.getByRole('button'));

    expect(captureSpy).toHaveBeenCalled();
  });
});
```

**Integration Tests**:

```typescript
describe('Error boundary', () => {
  it('should catch rendering errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <SearchErrorBoundary fallback={<div>Error caught</div>}>
        <ThrowError />
      </SearchErrorBoundary>
    );

    expect(screen.getByText('Error caught')).toBeInTheDocument();
  });
});
```

### Privacy Considerations

**Data Scrubbing**:

- Remove PII from error reports
- Mask sensitive query content
- Anonymize user identifiers

**Configuration**:

```typescript
Sentry.init({
  beforeSend(event, hint) {
    // Remove sensitive data
    if (event.request?.data) {
      event.request.data = scrubSensitiveData(event.request.data);
    }
    return event;
  },
});
```

---

## Implementation Phases

### Phase 1: Maintain Current UI (During Backend Migration)

**Duration**: Concurrent with backend Phase 1 (2-3 weeks)

**Tasks**:

- No breaking UI changes
- Fix critical responsive issues
- Improve accessibility baseline
- Add unit tests for components

**Deliverables**:

- Responsive layout fixes
- Accessibility audit and fixes
- Component unit tests

### Phase 2: Ontology UI Integration

**Duration**: Concurrent with backend Phase 2-3 (3-4 weeks)

**Tasks**:

- Add thread filtering UI
- Add programme factor filters
- Display unit type classification
- Show structured content guidance
- Add component availability filters
- Create thread search results view

**Deliverables**:

- Thread filtering functional
- Programme factor filters working
- Enhanced result cards with ontology metadata
- Playwright tests for new features

### Phase 3: Polish and Optimization

**Duration**: 1-2 weeks (after backend complete)

**Tasks**:

- Performance optimization
- Bundle size reduction
- Complete Playwright coverage
- Visual regression baseline
- Theme simplification exploration

**Deliverables**:

- <300KB initial bundle
- 100% Playwright coverage
- Visual regression tests
- Performance monitoring

---

## Document History

- 2025-11-11: Created comprehensive UI implementation plan
- 2025-11-11: Consolidated theme, testing, responsive layout guidance
- 2025-11-11: Integrated ontology UI requirements
- 2025-11-11: Added complete Playwright test strategy
