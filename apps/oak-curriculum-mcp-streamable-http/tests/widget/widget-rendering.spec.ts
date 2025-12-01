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
 * Injects mock window.openai data before page load.
 *
 * @param page - Playwright page instance
 * @param fixture - Tool output data to inject
 * @param toolName - Optional tool name for routing
 */
async function injectToolOutput(page: Page, fixture: object, toolName?: string): Promise<void> {
  await page.addInitScript(
    (args: { data: object; toolName?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- JC: Browser context injection requires any for window augmentation
      (globalThis as any).openai = {
        toolOutput: args.data,
        toolInput: args.toolName ? { toolName: args.toolName } : undefined,
        toolResponseMetadata: args.toolName ? { toolName: args.toolName } : undefined,
      };
    },
    { data: fixture, toolName },
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

  test('renders help UI when data has serverOverview/toolCategories/workflows', async ({
    page,
  }) => {
    await injectToolOutput(page, HELP_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    // Widget should detect help shape and render structured sections
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Tool Categories')).toBeVisible();
    await expect(page.getByText('Workflows')).toBeVisible();
    await expect(page.getByText('Tips')).toBeVisible();
  });

  test('renders lesson cards when data has lessons array', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    // Widget should detect search shape and render lesson results
    await expect(page.getByText('Lessons')).toBeVisible();
    await expect(page.getByText('Introduction to Photosynthesis')).toBeVisible();
    // Should render links to Oak
    await expect(page.getByRole('link', { name: /View/ }).first()).toBeVisible();
  });

  test('renders transcript snippets when data has transcripts array', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Transcripts')).toBeVisible();
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
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call -- Browser context requires any for window.openai access */
      const openai = (globalThis as any).openai;
      if (openai) {
        openai.toolOutput = searchData;
      }
      (globalThis as any).dispatchEvent(
        new CustomEvent('openai:set_globals', {
          detail: { globals: { toolOutput: searchData } },
        }),
      );
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
    }, SEARCH_OUTPUT_FIXTURE);

    // Widget should now show search results
    await expect(page.getByText('Lessons')).toBeVisible();
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
});
