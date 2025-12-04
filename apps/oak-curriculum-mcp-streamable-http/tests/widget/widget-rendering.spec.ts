/**
 * Playwright E2E tests for Oak JSON viewer widget rendering.
 *
 * These tests verify the widget correctly renders different tool output types.
 * The widget is real product code, and we test its behaviour:
 * given input data, does it render the expected UI?
 *
 * Key behaviours tested:
 * 1. Help content triggers structured help UI
 * 2. Search data triggers lesson/transcript cards
 * 3. Empty search shows "No results found"
 * 4. Unknown structures fall back to JSON display
 * 5. Empty data shows loading state
 * 6. Widget reacts to async openai:set_globals events
 * 7. Tool name routing selects correct renderer
 *
 * @see ../../src/widget-script.ts - Widget under test
 * @see ../../src/widget-renderer-registry.ts - Tool name routing
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';

import { createWidgetTestServer } from './widget-test-server.js';
import {
  HELP_OUTPUT_FIXTURE,
  SEARCH_OUTPUT_FIXTURE,
  EMPTY_SEARCH_OUTPUT_FIXTURE,
  GENERIC_JSON_OUTPUT_FIXTURE,
  EMPTY_OUTPUT_FIXTURE,
} from './fixtures.js';
import {
  QUIZ_OUTPUT_FIXTURE,
  LESSON_SUMMARY_OUTPUT_FIXTURE,
  KEY_STAGES_OUTPUT_FIXTURE,
  TRANSCRIPT_OUTPUT_FIXTURE,
  CHANGELOG_OUTPUT_FIXTURE,
  RATE_LIMIT_OUTPUT_FIXTURE,
  SEARCH_LESSONS_ARRAY_FIXTURE,
  ONTOLOGY_OUTPUT_FIXTURE,
} from './renderer-fixtures.js';

let serverUrl: string;
let server: Server;

test.beforeAll(() => {
  const app = createWidgetTestServer();
  server = app.listen(0);
  const address = server.address() as AddressInfo;
  serverUrl = `http://localhost:${String(address.port)}`;
});

test.afterAll(() => {
  server.close();
});

/**
 * Options for injecting mock window.openai data.
 */
interface InjectOptions {
  readonly toolName?: string;
  readonly annotationsTitle?: string;
}

/**
 * Injects mock window.openai data before page load.
 *
 * @param page - Playwright page instance
 * @param fixture - Tool output data to inject
 * @param toolNameOrOptions - Tool name string or options object
 */
async function injectToolOutput(
  page: Page,
  fixture: object,
  toolNameOrOptions?: string | InjectOptions,
): Promise<void> {
  const options: InjectOptions =
    typeof toolNameOrOptions === 'string'
      ? { toolName: toolNameOrOptions }
      : (toolNameOrOptions ?? {});

  await page.addInitScript(
    (args: { data: object; toolName?: string; annotationsTitle?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- JC: Browser context injection requires any for window augmentation
      (globalThis as any).openai = {
        toolOutput: args.data,
        toolInput: args.toolName ? { toolName: args.toolName } : undefined,
        toolResponseMetadata: args.toolName
          ? {
              toolName: args.toolName,
              ...(args.annotationsTitle ? { 'annotations/title': args.annotationsTitle } : {}),
            }
          : undefined,
      };
    },
    { data: fixture, toolName: options.toolName, annotationsTitle: options.annotationsTitle },
  );
}

test.describe('Widget rendering behaviour', () => {
  test('renders header with Oak title and AI disclaimer footer', async ({ page }) => {
    await injectToolOutput(page, HELP_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    // Header should show Oak National Academy
    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();

    // Footer should show AI disclaimer
    await expect(page.getByText('AI can make mistakes')).toBeVisible();
  });

  test('renders help UI when data has serverOverview/toolCategories/tips', async ({ page }) => {
    await injectToolOutput(page, HELP_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    // Behaviour 1: Data flows through - fixture content appears in rendered output
    // Content from serverOverview.aboutOak should appear
    await expect(page.getByText(/Oak National Academy is the UK's/)).toBeVisible();
    // Content from tips should appear
    await expect(page.getByText(/Use the search tool/)).toBeVisible();
    // Content from toolCategories should appear
    await expect(page.getByText(/Tools for finding curriculum content/)).toBeVisible();

    // Behaviour 2: Structure is correct - structured sections rendered, not JSON fallback
    await expect(page.locator('pre')).not.toBeVisible();
    // Should render multiple section containers
    const sections = page.locator('.sec');
    await expect(sections.first()).toBeVisible();
    expect(await sections.count()).toBeGreaterThanOrEqual(2);
  });

  test('renders lesson cards when data has lessons array', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    // Widget should detect search shape and render lesson results
    await expect(page.getByText('From lesson similarity')).toBeVisible();
    await expect(page.getByText('Introduction to Photosynthesis')).toBeVisible();
    // Should render links to Oak
    await expect(page.getByRole('link', { name: /View/ }).first()).toBeVisible();
  });

  test('renders transcript snippets when data has transcripts array', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('From transcript search')).toBeVisible();
    await expect(page.getByText(/Plants use sunlight/)).toBeVisible();
  });

  test('shows "No results found" for empty search', async ({ page }) => {
    await injectToolOutput(page, EMPTY_SEARCH_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('No results found')).toBeVisible();
  });

  test('falls back to JSON display for unknown data shapes', async ({ page }) => {
    await injectToolOutput(page, GENERIC_JSON_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    // Widget should render as pre-formatted JSON
    await expect(page.locator('pre')).toBeVisible();
    await expect(page.locator('pre')).toContainText('customField');
  });

  test('shows loading state when toolOutput is empty object', async ({ page }) => {
    await injectToolOutput(page, EMPTY_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Loading...')).toBeVisible();
  });

  test('re-renders when openai:set_globals event fires', async ({ page }) => {
    // Start with empty data
    await injectToolOutput(page, EMPTY_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    // Initially shows loading
    await expect(page.getByText('Loading...')).toBeVisible();

    // Simulate ChatGPT dispatching set_globals with search data
    await page.evaluate((searchData: object) => {
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- Browser context requires any for window.openai access */
      const openai = (globalThis as any).openai;
      if (openai) {
        openai.toolOutput = searchData;
      }
      (globalThis as any).dispatchEvent(
        new CustomEvent('openai:set_globals', {
          detail: { globals: { toolOutput: searchData } },
        }),
      );
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
    }, SEARCH_OUTPUT_FIXTURE);

    // Widget should now show search results
    await expect(page.getByText('From lesson similarity')).toBeVisible();
  });
});

test.describe('Tool name routing', () => {
  test('routes get-lessons-quiz to quiz renderer', async ({ page }) => {
    await injectToolOutput(page, QUIZ_OUTPUT_FIXTURE, 'get-lessons-quiz');
    await page.goto(`${serverUrl}/widget`);

    // Quiz renderer should show quiz sections (text includes badge count)
    await expect(page.getByRole('heading', { name: /Starter Quiz/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Exit Quiz/ })).toBeVisible();
    // Should show question text
    await expect(page.getByText(/Tick the sentence/)).toBeVisible();
    // Should show correct answer with check mark (there are 2, one per quiz)
    await expect(page.getByText(/✓/).first()).toBeVisible();
  });

  test('routes get-lessons-summary to entity summary renderer', async ({ page }) => {
    await injectToolOutput(page, LESSON_SUMMARY_OUTPUT_FIXTURE, 'get-lessons-summary');
    await page.goto(`${serverUrl}/widget`);

    // Entity summary renderer should show lesson details
    await expect(page.getByRole('heading', { name: /Joining using/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Key Learning Points/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Keywords/ })).toBeVisible();
    await expect(page.getByText('joining word', { exact: true })).toBeVisible();
  });

  test('routes get-key-stages to entity list renderer', async ({ page }) => {
    await injectToolOutput(page, KEY_STAGES_OUTPUT_FIXTURE, 'get-key-stages');
    await page.goto(`${serverUrl}/widget`);

    // Entity list renderer should show key stages
    await expect(page.getByText('Key Stage 1')).toBeVisible();
    await expect(page.getByText('Key Stage 2')).toBeVisible();
    await expect(page.getByText('Key Stage 3')).toBeVisible();
    await expect(page.getByText('Key Stage 4')).toBeVisible();
  });

  test('routes get-lessons-transcript to transcript renderer', async ({ page }) => {
    await injectToolOutput(page, TRANSCRIPT_OUTPUT_FIXTURE, 'get-lessons-transcript');
    await page.goto(`${serverUrl}/widget`);

    // Transcript renderer should show transcript text
    await expect(page.getByRole('heading', { name: /Transcript/ })).toBeVisible();
    await expect(page.getByText(/Ms\. Example-Teacher/).first()).toBeVisible();
    // Should have VTT section
    await expect(page.getByRole('heading', { name: /VTT Data/ })).toBeVisible();
  });

  test('routes get-changelog to changelog renderer', async ({ page }) => {
    await injectToolOutput(page, CHANGELOG_OUTPUT_FIXTURE, 'get-changelog');
    await page.goto(`${serverUrl}/widget`);

    // Changelog renderer should show versions
    await expect(page.getByRole('heading', { name: /Changelog/ })).toBeVisible();
    await expect(page.getByText(/v0\.5\.0/)).toBeVisible();
    await expect(page.getByText(/PPTX used for slideDeck/)).toBeVisible();
  });

  test('routes get-rate-limit to rate limit renderer', async ({ page }) => {
    await injectToolOutput(page, RATE_LIMIT_OUTPUT_FIXTURE, 'get-rate-limit');
    await page.goto(`${serverUrl}/widget`);

    // Rate limit renderer should show status (use heading selector to avoid matching header tool name)
    await expect(page.getByRole('heading', { name: 'Rate Limit Status' })).toBeVisible();
    await expect(page.getByText(/Remaining/)).toBeVisible();
    await expect(page.getByText(/85/)).toBeVisible();
  });

  test('routes get-search-lessons array response to search renderer', async ({ page }) => {
    // get-search-lessons returns a flat array, NOT { lessons: [...] }
    // The search renderer must handle this structure
    await injectToolOutput(page, SEARCH_LESSONS_ARRAY_FIXTURE, 'get-search-lessons');
    await page.goto(`${serverUrl}/widget`);

    // Should render lesson titles from the array
    await expect(page.getByText('Introduction to Photosynthesis')).toBeVisible();
    await expect(page.getByText('Plant Cell Structure')).toBeVisible();
  });

  test('displays canonical URL link when canonicalUrl is present', async ({ page }) => {
    await injectToolOutput(page, LESSON_SUMMARY_OUTPUT_FIXTURE, 'get-lessons-summary');
    await page.goto(`${serverUrl}/widget`);

    // Should render a link to the original Oak resource
    const oakLink = page.getByRole('link', { name: /View original Oak resource/ });
    await expect(oakLink).toBeVisible();
    await expect(oakLink).toHaveAttribute(
      'href',
      'https://www.thenational.academy/teachers/lessons/joining-using-and',
    );
  });

  test('displays tool title from annotations/title in header', async ({ page }) => {
    await injectToolOutput(page, LESSON_SUMMARY_OUTPUT_FIXTURE, {
      toolName: 'get-lessons-summary',
      annotationsTitle: 'Lesson Summary',
    });
    await page.goto(`${serverUrl}/widget`);

    // The tool name element should display the human-readable title
    // Note: The header has id="tool-name" and should show "Lesson Summary"
    await expect(page.locator('#tool-name')).toHaveText('Lesson Summary');
  });

  test('routes get-ontology to ontology renderer with curated sections', async ({ page }) => {
    await injectToolOutput(page, ONTOLOGY_OUTPUT_FIXTURE, 'get-ontology');
    await page.goto(`${serverUrl}/widget`);

    // Should render external links
    await expect(page.getByRole('link', { name: /Browse Curriculum/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /View Data Model/ })).toBeVisible();

    // Should render Key Stages section heading
    await expect(page.getByRole('heading', { name: /Key Stages/ })).toBeVisible();
    await expect(page.getByText('Key Stage 1 (ks1)')).toBeVisible();

    // Should render Content Hierarchy section heading
    await expect(page.getByRole('heading', { name: /Content Hierarchy/ })).toBeVisible();

    // Should render Threads section heading
    await expect(page.getByRole('heading', { name: /Threads/ })).toBeVisible();

    // Should render Workflows section heading (uses o.workflows property)
    await expect(page.getByRole('heading', { name: /Workflows/ })).toBeVisible();
    await expect(page.getByText('Find lessons on a topic')).toBeVisible();
  });

  test('ontology renderer links to Oak curriculum page', async ({ page }) => {
    await injectToolOutput(page, ONTOLOGY_OUTPUT_FIXTURE, 'get-ontology');
    await page.goto(`${serverUrl}/widget`);

    const curriculumLink = page.getByRole('link', { name: /Browse Curriculum/ });
    await expect(curriculumLink).toHaveAttribute(
      'href',
      'https://www.thenational.academy/teachers/curriculum',
    );
  });

  test('ontology renderer links to data model documentation', async ({ page }) => {
    await injectToolOutput(page, ONTOLOGY_OUTPUT_FIXTURE, 'get-ontology');
    await page.goto(`${serverUrl}/widget`);

    const dataModelLink = page.getByRole('link', { name: /View Data Model/ });
    await expect(dataModelLink).toHaveAttribute(
      'href',
      'https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams',
    );
  });
});
