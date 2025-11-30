# Widget Playwright Tests Plan

**Created**: 2025-11-30  
**Completed**: 2025-11-30  
**Status**: ✅ COMPLETE  
**Focus**: Add Playwright tests for the ChatGPT widget with fixture data

---

## Overview

The Oak JSON viewer widget (`aggregated-tool-widget.ts`) renders tool output in ChatGPT. Currently, the only way to test it is manually in ChatGPT. This plan adds Playwright tests that exercise the widget with fixture data, verifying correct rendering for different tool outputs.

### Goals

1. **Test widget rendering** for all supported output types (help, search, generic JSON)
2. **Verify async event handling** for `openai:set_globals` events
3. **Ensure accessibility** with axe-core checks
4. **Integrate with existing CI** via the `test:ui` script (already wired to `test:all`)

### Non-Goals

- Testing actual ChatGPT integration (that's a manual/smoke test)
- Visual regression testing (could be added later)

---

## Completion Summary

All planned tests implemented plus additional widget UX improvements discovered during testing.

### What Was Implemented

1. **Test infrastructure**: `widget-test-server.ts`, `fixtures.ts`
2. **Rendering tests**: `widget-rendering.spec.ts` with 9 test cases
3. **Accessibility tests**: `widget-accessibility.spec.ts` with axe-core
4. **Config updates**: `playwright.config.ts` projects, `turbo.json` inputs

### Additional Work (Beyond Original Plan)

During testing, accessibility issues were discovered and fixed in the widget itself:

- Added `<title>Oak National Academy</title>` for document title
- Added tool name subtitle from `annotations.title` or `meta.title`
- Adjusted CSS color variables to meet WCAG AA contrast ratios
- Removed `max-height` to prevent internal scrollbars
- Added AI disclaimer footer
- Changed `<header>`/`<footer>` to `<div>` elements (embedded iframe semantics)
- Updated `@playwright/test` to `^1.57.0` to align with `@axe-core/playwright`

### Lessons Learned

1. **Axe-core exclusions for embedded iframes**: Rules like `document-title`, `landmark-one-main`, `region`, and `scrollable-region-focusable` don't apply to embedded widgets
2. **Browser context injection requires `any`**: `page.addInitScript()` runs in browser context where strict TypeScript types don't apply
3. **Playwright version alignment**: Monorepo packages must use consistent `@playwright/test` versions

---

## Current State

### Infrastructure Already in Place

The monorepo already has `test:ui` wired up:

**Root `package.json`**:

```json
"test:ui": "turbo run --continue test:ui",
"test:all": "pnpm test && pnpm test:e2e && pnpm test:e2e:built && pnpm test:ui && pnpm smoke:dev:stub"
```

**HTTP app `package.json`**:

```json
"test:ui": "playwright test"
```

**Playwright config** (`playwright.config.ts`):

```typescript
testDir: './tests/visual',  // Currently only visual tests
webServer: {
  command: 'pnpm dev',
  url: baseURL,
  reuseExistingServer: true,
}
```

### What Needs to Change

1. Expand Playwright config to include widget tests
2. Create test harness that serves widget HTML standalone
3. Create fixtures for different tool outputs
4. Create Playwright tests that inject mock `window.openai` data

---

## Implementation Plan

### Phase 1: Test Infrastructure (~30 mins)

#### 1.1: Create Widget Test Server

**File**: `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-test-server.ts`

Creates a minimal Express server that serves the widget HTML at `/widget` for testing.

```typescript
/**
 * Widget test server for Playwright tests.
 *
 * Serves the Oak JSON viewer widget HTML at /widget endpoint.
 * Used by Playwright tests to exercise widget rendering with mock data.
 */

import express from 'express';
import { AGGREGATED_TOOL_WIDGET_HTML } from '../../src/aggregated-tool-widget.js';

/**
 * Creates an Express app that serves the widget HTML for testing.
 *
 * @returns Express application serving widget at /widget
 */
export function createWidgetTestServer(): express.Application {
  const app = express();

  app.get('/widget', (req, res) => {
    res.type('text/html').send(AGGREGATED_TOOL_WIDGET_HTML);
  });

  return app;
}
```

#### 1.2: Create Fixtures

**File**: `apps/oak-curriculum-mcp-streamable-http/tests/widget/fixtures.ts`

Defines fixture data for different tool output scenarios.

```typescript
/**
 * Fixture data for widget Playwright tests.
 *
 * These fixtures represent different tool output structures
 * that the widget must handle correctly.
 */

/**
 * Help tool output fixture.
 *
 * Represents the structured response from get-help tool.
 */
export const HELP_OUTPUT_FIXTURE = {
  serverOverview: {
    name: 'Oak Curriculum MCP',
    version: '1.0.0',
    description: 'Access Oak National Academy curriculum resources via MCP.',
    authentication: 'OAuth 2.1 with Clerk',
    documentation: 'https://open-api.thenational.academy/docs',
  },
  toolCategories: {
    discovery: {
      description: 'Tools for finding curriculum content by topic or keyword.',
      whenToUse: 'When you need to search for lessons, units, or questions.',
      tools: ['search', 'get-search-lessons', 'get-search-transcripts'],
    },
    browsing: {
      description: 'Tools for exploring curriculum structure systematically.',
      whenToUse: 'When navigating subjects, key stages, units, and programmes.',
      tools: ['get-subjects', 'get-key-stages', 'get-key-stages-subject-units'],
    },
    fetching: {
      description: 'Tools for retrieving specific content by ID.',
      whenToUse: 'When you have a lesson slug and need full details.',
      tools: ['fetch', 'get-lessons-summary', 'get-lessons-transcript'],
    },
  },
  workflows: {
    findLessons: {
      title: 'Find Lessons on a Topic',
      description: 'Search for lessons matching a topic across all subjects.',
      steps: [
        { step: 1, action: 'Use search tool with topic query', tool: 'search' },
        { step: 2, action: 'Review lesson results', tool: null },
        { step: 3, action: 'Fetch full details for selected lesson', tool: 'fetch' },
      ],
    },
    lessonPlanning: {
      title: 'Lesson Planning',
      description: 'Gather materials for planning a lesson.',
      steps: [
        { step: 1, action: 'Search for relevant lessons', tool: 'search' },
        { step: 2, action: 'Get lesson summary for objectives', tool: 'get-lessons-summary' },
        { step: 3, action: 'Get quiz questions for assessment', tool: 'get-lessons-quiz' },
      ],
    },
  },
  tips: [
    'Use the search tool for topic-based queries - it searches both lessons and transcripts.',
    'The fetch tool accepts any Oak URL and returns structured content.',
    'Key stages are: ks1, ks2, ks3, ks4 (lowercase).',
    'Lesson slugs look like: adding-fractions-with-the-same-denominator',
  ],
  idFormats: {
    description: 'ID format reference for the fetch tool.',
    formats: [
      { prefix: 'lesson:', example: 'lesson:adding-fractions', description: 'Lesson by slug' },
      { prefix: 'unit:', example: 'unit:fractions-y4', description: 'Unit by slug' },
    ],
  },
} as const;

/**
 * Search results fixture.
 *
 * Represents the response from search tool with lessons and transcripts.
 */
export const SEARCH_OUTPUT_FIXTURE = {
  status: 200,
  data: {
    q: 'photosynthesis',
    lessonsTotal: 15,
    lessons: [
      {
        lessonTitle: 'Introduction to Photosynthesis',
        subjectTitle: 'Science',
        keyStage: 'KS3',
        slug: 'introduction-to-photosynthesis',
        canonicalUrl: 'https://teachers.thenational.academy/lessons/introduction-to-photosynthesis',
      },
      {
        lessonTitle: 'The Light-Dependent Reactions',
        subjectTitle: 'Biology',
        keyStage: 'KS4',
        slug: 'the-light-dependent-reactions',
        canonicalUrl: 'https://teachers.thenational.academy/lessons/the-light-dependent-reactions',
      },
      {
        lessonTitle: 'Factors Affecting Photosynthesis',
        subjectTitle: 'Science',
        keyStage: 'KS3',
        slug: 'factors-affecting-photosynthesis',
        canonicalUrl:
          'https://teachers.thenational.academy/lessons/factors-affecting-photosynthesis',
      },
    ],
    transcriptsTotal: 4,
    transcripts: [
      {
        lessonTitle: 'Photosynthesis Overview',
        highlightedContent:
          'Plants use sunlight to convert carbon dioxide and water into glucose and oxygen through a process called photosynthesis.',
      },
      {
        lessonTitle: 'Chloroplasts and Chlorophyll',
        highlightedContent:
          'The green pigment chlorophyll, found in chloroplasts, absorbs light energy for photosynthesis.',
      },
    ],
  },
} as const;

/**
 * Empty search results fixture.
 *
 * Represents a search that returned no results.
 */
export const EMPTY_SEARCH_OUTPUT_FIXTURE = {
  status: 200,
  data: {
    q: 'xyznonexistent',
    lessonsTotal: 0,
    lessons: [],
    transcriptsTotal: 0,
    transcripts: [],
  },
} as const;

/**
 * Generic JSON output fixture.
 *
 * Represents an unknown structure that should render as JSON.
 */
export const GENERIC_JSON_OUTPUT_FIXTURE = {
  customField: 'some value',
  nested: {
    data: 123,
    array: ['a', 'b', 'c'],
  },
  timestamp: '2025-11-30T12:00:00Z',
} as const;

/**
 * Empty output fixture.
 *
 * Represents the initial state before data arrives.
 */
export const EMPTY_OUTPUT_FIXTURE = {} as const;
```

---

### Phase 2: Playwright Tests (~1 hour)

#### 2.1: Widget Rendering Tests

**File**: `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts`

```typescript
/**
 * Playwright tests for Oak JSON viewer widget rendering.
 *
 * Tests verify that the widget correctly renders different tool outputs:
 * - Help tool output (structured UI with categories, workflows, tips)
 * - Search results (lesson cards with links)
 * - Generic JSON (fallback pre-formatted display)
 * - Empty state (loading indicator)
 *
 * Tests inject mock window.openai data and verify rendered output.
 *
 * @see aggregated-tool-widget.ts - Widget implementation
 * @see fixtures.ts - Test fixture data
 */

import { expect, test } from '@playwright/test';
import { createWidgetTestServer } from './widget-test-server.js';
import {
  HELP_OUTPUT_FIXTURE,
  SEARCH_OUTPUT_FIXTURE,
  EMPTY_SEARCH_OUTPUT_FIXTURE,
  GENERIC_JSON_OUTPUT_FIXTURE,
  EMPTY_OUTPUT_FIXTURE,
} from './fixtures.js';
import type { AddressInfo } from 'net';
import type { Server } from 'http';

let serverUrl: string;
let server: Server;

test.beforeAll(async () => {
  const app = createWidgetTestServer();
  server = app.listen(0);
  const address = server.address() as AddressInfo;
  serverUrl = `http://localhost:${String(address.port)}`;
});

test.afterAll(async () => {
  server?.close();
});

test.describe('Widget rendering', () => {
  test.describe('Help output', () => {
    test('renders structured help content with all sections', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, HELP_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      // Verify all help sections render
      await expect(page.getByText('Overview')).toBeVisible();
      await expect(page.getByText('Tool Categories')).toBeVisible();
      await expect(page.getByText('Workflows')).toBeVisible();
      await expect(page.getByText('Tips')).toBeVisible();
    });

    test('renders tool categories with tool names', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, HELP_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      // Verify category content
      await expect(page.getByText('discovery')).toBeVisible();
      await expect(page.getByText('browsing')).toBeVisible();
      await expect(page.getByText('fetching')).toBeVisible();

      // Verify tool names appear
      await expect(page.getByText('search')).toBeVisible();
      await expect(page.getByText('get-subjects')).toBeVisible();
    });

    test('renders workflows with titles', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, HELP_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      await expect(page.getByText('Find Lessons on a Topic')).toBeVisible();
      await expect(page.getByText('Lesson Planning')).toBeVisible();
    });

    test('renders tips list', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, HELP_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      await expect(page.getByText(/Use the search tool/)).toBeVisible();
      await expect(page.getByText(/Key stages are/)).toBeVisible();
    });
  });

  test.describe('Search output', () => {
    test('renders lesson cards with metadata', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, SEARCH_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      // Verify lessons section
      await expect(page.getByText('Lessons')).toBeVisible();
      await expect(page.getByText('Introduction to Photosynthesis')).toBeVisible();
      await expect(page.getByText('Science • KS3')).toBeVisible();

      // Verify links
      const viewLinks = page.getByRole('link', { name: /View/ });
      await expect(viewLinks.first()).toBeVisible();
    });

    test('renders transcript snippets', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, SEARCH_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      await expect(page.getByText('Transcripts')).toBeVisible();
      await expect(page.getByText(/Plants use sunlight/)).toBeVisible();
    });

    test('shows badge with result count', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, SEARCH_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      // Badge should show count (3 lessons in fixture)
      await expect(page.locator('.badge').first()).toContainText('3');
    });

    test('shows no results message for empty search', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, EMPTY_SEARCH_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      await expect(page.getByText('No results found')).toBeVisible();
    });
  });

  test.describe('Generic output', () => {
    test('renders unknown structures as JSON', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, GENERIC_JSON_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      // Should render in a <pre> tag as JSON
      await expect(page.locator('pre')).toBeVisible();
      await expect(page.getByText('customField')).toBeVisible();
      await expect(page.getByText('nested')).toBeVisible();
    });
  });

  test.describe('Empty state', () => {
    test('shows loading indicator when toolOutput is empty', async ({ page }) => {
      await page.addInitScript((fixture) => {
        (window as Record<string, unknown>).openai = { toolOutput: fixture };
      }, EMPTY_OUTPUT_FIXTURE);

      await page.goto(`${serverUrl}/widget`);

      await expect(page.getByText('Loading...')).toBeVisible();
    });
  });

  test.describe('Async event handling', () => {
    test('reacts to openai:set_globals events', async ({ page }) => {
      // Start with empty output
      await page.addInitScript(() => {
        (window as Record<string, unknown>).openai = { toolOutput: {} };
      });

      await page.goto(`${serverUrl}/widget`);

      // Initially shows loading
      await expect(page.getByText('Loading...')).toBeVisible();

      // Simulate ChatGPT dispatching set_globals event
      await page.evaluate((fixture) => {
        const openai = (window as Record<string, unknown>).openai as Record<string, unknown>;
        openai.toolOutput = fixture;
        window.dispatchEvent(
          new CustomEvent('openai:set_globals', {
            detail: { globals: { toolOutput: fixture } },
          }),
        );
      }, SEARCH_OUTPUT_FIXTURE);

      // Now should show search results
      await expect(page.getByText('Lessons')).toBeVisible();
      await expect(page.getByText('Introduction to Photosynthesis')).toBeVisible();
    });
  });
});
```

#### 2.2: Accessibility Tests

**File**: `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-accessibility.spec.ts`

```typescript
/**
 * Accessibility tests for Oak JSON viewer widget.
 *
 * Uses axe-core to verify the widget meets WCAG accessibility standards.
 */

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { createWidgetTestServer } from './widget-test-server.js';
import { HELP_OUTPUT_FIXTURE, SEARCH_OUTPUT_FIXTURE } from './fixtures.js';
import type { AddressInfo } from 'net';
import type { Server } from 'http';

let serverUrl: string;
let server: Server;

test.beforeAll(async () => {
  const app = createWidgetTestServer();
  server = app.listen(0);
  const address = server.address() as AddressInfo;
  serverUrl = `http://localhost:${String(address.port)}`;
});

test.afterAll(async () => {
  server?.close();
});

test.describe('Widget accessibility', () => {
  test('help output passes accessibility checks', async ({ page }) => {
    await page.addInitScript((fixture) => {
      (window as Record<string, unknown>).openai = { toolOutput: fixture };
    }, HELP_OUTPUT_FIXTURE);

    await page.goto(`${serverUrl}/widget`);

    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });

  test('search output passes accessibility checks', async ({ page }) => {
    await page.addInitScript((fixture) => {
      (window as Record<string, unknown>).openai = { toolOutput: fixture };
    }, SEARCH_OUTPUT_FIXTURE);

    await page.goto(`${serverUrl}/widget`);

    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });
});
```

---

### Phase 3: Configuration Updates (~15 mins)

#### 3.1: Update Playwright Config

**File**: `apps/oak-curriculum-mcp-streamable-http/playwright.config.ts`

Update to include both visual and widget tests:

```typescript
import { defineConfig, devices } from '@playwright/test';

/* eslint-disable-next-line no-restricted-syntax -- Playwright config file needs env for test configuration */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3333';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list']],
  use: {
    trace: 'on',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'visual',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        baseURL,
      },
      webServer: {
        command: 'pnpm dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
    },
    {
      name: 'widget',
      testDir: './tests/widget',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
      // Widget tests use their own test server, no webServer needed
    },
  ],
});
```

#### 3.2: Update turbo.json (if needed)

The `test:ui` task already exists and should pick up the new tests. Add widget test files to inputs:

In `turbo.json`, update the `test:ui` task inputs:

```json
"test:ui": {
  "outputs": [],
  "cache": true,
  "inputs": [
    "$TURBO_DEFAULT$",
    "src/**/*.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    "tests/**/*.ts",
    "tests/**/*.spec.ts",
    "next.config.ts",
    "playwright.config.ts"
  ]
}
```

---

## File Structure

After implementation:

```
apps/oak-curriculum-mcp-streamable-http/
├── tests/
│   ├── visual/
│   │   └── landing-page.spec.ts        # Existing
│   └── widget/
│       ├── fixtures.ts                  # NEW: Fixture data
│       ├── widget-test-server.ts        # NEW: Test harness
│       ├── widget-rendering.spec.ts     # NEW: Rendering tests
│       └── widget-accessibility.spec.ts # NEW: A11y tests
├── playwright.config.ts                 # MODIFIED: Add widget project
└── ...
```

---

## Execution Order

1. Create `tests/widget/fixtures.ts` with all fixture data
2. Create `tests/widget/widget-test-server.ts` with Express harness
3. Create `tests/widget/widget-rendering.spec.ts` with rendering tests
4. Create `tests/widget/widget-accessibility.spec.ts` with a11y tests
5. Update `playwright.config.ts` to include widget project
6. Update `turbo.json` inputs if needed
7. Run `pnpm test:ui` to verify tests pass
8. Run `pnpm test:all` to verify CI integration

---

## Success Criteria

- [x] `pnpm test:ui` runs both visual and widget tests
- [x] Widget tests verify help content rendering
- [x] Widget tests verify search results rendering
- [x] Widget tests verify JSON fallback rendering
- [x] Widget tests verify empty/loading state
- [x] Widget tests verify async event handling
- [x] Accessibility tests pass for all widget states
- [x] All tests pass in CI (`test:all`)

---

## TDD Approach

Following TDD at the E2E level:

1. **RED**: Write widget tests that describe expected rendering behaviour
2. **GREEN**: The current widget implementation should pass (we just added the async handling)
3. **REFACTOR**: If tests reveal issues, fix the widget and verify tests stay green

---

## Estimated Timeline

| Task                           | Duration |
| ------------------------------ | -------- |
| Phase 1: Test infrastructure   | 30 mins  |
| Phase 2: Playwright tests      | 1 hour   |
| Phase 3: Configuration updates | 15 mins  |
| **Total**                      | ~2 hours |

---

## References

- `.agent/reference-docs/openai-apps-build-ui.md` - OpenAI Apps SDK UI docs
- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` - Widget implementation
- `apps/oak-curriculum-mcp-streamable-http/tests/visual/` - Existing Playwright tests
- `.agent/directives-and-memory/testing-strategy.md` - TDD approach
