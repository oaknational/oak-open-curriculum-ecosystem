/**
 * Playwright E2E tests for Oak widget rendering.
 *
 * After Track 1a, only the search renderer remains. Non-search
 * tools show the neutral shell (Oak logo + heading, hidden footer).
 *
 * Key behaviours tested:
 * 1. Header always shows Oak National Academy
 * 2. Search data triggers lesson cards with scope label and count
 * 3. Empty search shows "No results found"
 * 4. Non-search tools show neutral shell (empty content, hidden footer)
 * 5. Widget reacts to async openai:set_globals events
 *
 * @see ../../src/widget-script.ts - Widget under test
 * @see ../../src/widget-renderer-registry.ts - Tool name routing
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import type { Server } from 'node:http';

import { createWidgetTestServer } from './widget-test-server.js';
import {
  SEARCH_OUTPUT_FIXTURE,
  EMPTY_SEARCH_OUTPUT_FIXTURE,
  GENERIC_JSON_OUTPUT_FIXTURE,
  EMPTY_OUTPUT_FIXTURE,
  SUGGEST_OUTPUT_FIXTURE,
  UNITS_SEARCH_OUTPUT_FIXTURE,
  THREADS_SEARCH_OUTPUT_FIXTURE,
  SEQUENCES_SEARCH_OUTPUT_FIXTURE,
} from './fixtures.js';

let serverUrl: string;
let server: Server;

test.beforeAll(() => {
  const app = createWidgetTestServer();
  server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to get server address — expected AddressInfo');
  }
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
  test('renders header with Oak title', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
  });

  test('renders scoped search results with lesson cards', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Search lessons')).toBeVisible();
    await expect(page.getByText('Introduction to Photosynthesis')).toBeVisible();
    await expect(page.getByRole('link', { name: /View/ }).first()).toBeVisible();
    await expect(page.getByText('15')).toBeVisible();
  });

  test('shows footer for search tool', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('AI can make mistakes')).toBeVisible();
  });

  test('shows "No results found" for empty search', async ({ page }) => {
    await injectToolOutput(page, EMPTY_SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('No results found')).toBeVisible();
  });

  test('shows neutral shell for unknown data shapes (no JSON fallback)', async ({ page }) => {
    await injectToolOutput(page, GENERIC_JSON_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('pre')).not.toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
    await expect(page.locator('.ftr')).not.toBeVisible();
  });

  test('shows neutral shell when toolOutput is empty object (no Loading state)', async ({
    page,
  }) => {
    await injectToolOutput(page, EMPTY_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.getByText('Loading...')).not.toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
    await expect(page.locator('.ftr')).not.toBeVisible();
  });

  test('shows neutral shell for non-search tool (content empty, footer hidden)', async ({
    page,
  }) => {
    await injectToolOutput(page, GENERIC_JSON_OUTPUT_FIXTURE, 'get-lessons-quiz');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
    await expect(page.locator('.ftr')).not.toBeVisible();
  });

  test('re-renders when openai:set_globals event fires', async ({ page }) => {
    await injectToolOutput(page, EMPTY_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.locator('#c')).toHaveText('');

    await page.evaluate((searchData: object) => {
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- Browser context requires any for window.openai access */
      const openai = (globalThis as any).openai;
      if (openai) {
        openai.toolOutput = searchData;
        openai.toolResponseMetadata = { toolName: 'search' };
      }
      (globalThis as any).dispatchEvent(
        new CustomEvent('openai:set_globals', {
          detail: { globals: { toolOutput: searchData } },
        }),
      );
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
    }, SEARCH_OUTPUT_FIXTURE);

    await expect(page.getByText('Search lessons')).toBeVisible();
  });

  test('displays tool title from annotations/title in header', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, {
      toolName: 'search',
      annotationsTitle: 'Search Curriculum',
    });
    await page.goto(`${serverUrl}/widget`);

    await expect(page.locator('#tool-name')).toHaveText('Search Curriculum');
  });

  test('renders suggest results as a list of suggestion items', async ({ page }) => {
    await injectToolOutput(page, SUGGEST_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Suggestions')).toBeVisible();
    await expect(page.getByText('Photosynthesis in Plants')).toBeVisible();
    await expect(page.getByText('Plant Biology Unit')).toBeVisible();
    await expect(page.getByText('Biology Programme')).toBeVisible();
    await expect(page.getByRole('link', { name: /View/ }).first()).toBeVisible();
  });

  test('renders units search results with unit titles', async ({ page }) => {
    await injectToolOutput(page, UNITS_SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Search units')).toBeVisible();
    await expect(page.getByText('Plant Biology')).toBeVisible();
    await expect(page.getByText('Ecosystems and Habitats')).toBeVisible();
  });

  test('renders threads search results with thread titles', async ({ page }) => {
    await injectToolOutput(page, THREADS_SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Search threads')).toBeVisible();
    await expect(page.getByText('Evolution and Inheritance')).toBeVisible();
    await expect(page.getByText('Forces and Motion')).toBeVisible();
  });

  test('renders sequences search results with sequence titles', async ({ page }) => {
    await injectToolOutput(page, SEQUENCES_SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Search sequences')).toBeVisible();
    await expect(page.getByText('Biology KS4')).toBeVisible();
    await expect(page.getByText('Science KS3')).toBeVisible();
  });

  test('shows fallback when renderer throws instead of crashing', async ({ page }) => {
    await page.route(`${serverUrl}/widget`, async (route) => {
      const response = await route.fetch();
      const html = await response.text();
      const patchedHtml = html.replace(
        'function renderSearch(d)',
        'function renderSearch(d) { throw new Error("Renderer crashed"); } function renderSearch_original(d)',
      );
      await route.fulfill({ body: patchedHtml, contentType: 'text/html' });
    });

    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Unable to display results')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
  });
});
