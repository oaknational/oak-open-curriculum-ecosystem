/**
 * Playwright E2E tests for Oak widget rendering.
 *
 * All custom renderers are parked pre-merge — every tool shows the
 * neutral shell (conditional header, empty content, hidden footer).
 * Tests marked "restore post-merge" should be updated when custom
 * renderers are re-enabled.
 *
 * Key behaviours tested:
 * 1. Header visible for HEADER_TOOLS (search, browse-curriculum, explore-topic, fetch)
 * 2. Header hidden when no tool name or tool not in HEADER_TOOLS
 * 3. Content area always empty (no custom rendering)
 * 4. Footer always hidden (no renderer to display it)
 * 5. Widget reacts to async openai:set_globals events
 * 6. Tool title from annotations/title displayed in header
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

  // TODO: Replace `globalThis as any` with a typed OpenAI widget interface.
  // The ChatGPT widget runtime injects `window.openai` with no published type
  // definition. A shared `OpenAIWidgetGlobals` type would eliminate the `any`
  // casts across both widget spec files.
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
  test('renders header with Oak heading for HEADER_TOOLS', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
  });

  test('shows neutral shell for search tool (renderers parked)', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
    await expect(page.locator('.ftr')).not.toBeVisible();
  });

  test('hides footer when renderers are parked', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.locator('.ftr')).not.toBeVisible();
  });

  test('shows neutral shell for empty search (renderers parked)', async ({ page }) => {
    await injectToolOutput(page, EMPTY_SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
  });

  test('shows neutral shell for unknown data shapes (no JSON fallback)', async ({ page }) => {
    await injectToolOutput(page, GENERIC_JSON_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.locator('pre')).not.toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
    await expect(page.locator('.ftr')).not.toBeVisible();
  });

  test('shows neutral shell when toolOutput is empty object (no Loading state)', async ({
    page,
  }) => {
    await injectToolOutput(page, EMPTY_OUTPUT_FIXTURE);
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByText('Loading...')).not.toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
    await expect(page.locator('.ftr')).not.toBeVisible();
  });

  test('hides header for non-HEADER_TOOLS tool', async ({ page }) => {
    await injectToolOutput(page, GENERIC_JSON_OUTPUT_FIXTURE, 'get-lessons-quiz');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.locator('#hdr')).not.toBeVisible();
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

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
  });

  test('displays tool title from annotations/title in header', async ({ page }) => {
    await injectToolOutput(page, SEARCH_OUTPUT_FIXTURE, {
      toolName: 'search',
      annotationsTitle: 'Search Curriculum',
    });
    await page.goto(`${serverUrl}/widget`);

    await expect(page.locator('#tool-name')).toHaveText('Search Curriculum');
  });

  test('shows neutral shell for suggest data (renderers parked)', async ({ page }) => {
    await injectToolOutput(page, SUGGEST_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
  });

  test('shows neutral shell for units data (renderers parked)', async ({ page }) => {
    await injectToolOutput(page, UNITS_SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
  });

  test('shows neutral shell for threads data (renderers parked)', async ({ page }) => {
    await injectToolOutput(page, THREADS_SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
  });

  test('shows neutral shell for sequences data (renderers parked)', async ({ page }) => {
    await injectToolOutput(page, SEQUENCES_SEARCH_OUTPUT_FIXTURE, 'search');
    await page.goto(`${serverUrl}/widget`);

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
  });

  test('neutral shell handles renderer crash gracefully (renderers parked)', async ({ page }) => {
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

    await expect(page.getByRole('heading', { name: 'Oak National Academy' })).toBeVisible();
    await expect(page.locator('#c')).toHaveText('');
  });
});
