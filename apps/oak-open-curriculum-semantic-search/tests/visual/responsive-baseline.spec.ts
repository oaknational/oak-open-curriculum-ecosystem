import { Buffer } from 'node:buffer';
import AxeBuilderModule from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  structuredSearchFixture,
  suggestionFixture,
} from '../../app/ui/__fixtures__/search-structured';
import { NARROW_SEARCH_SCOPES, MULTI_SCOPE } from '../../src/lib/search-scopes';

type Viewport = {
  readonly width: number;
  readonly height: number;
};

const VIEWPORTS: Record<'bpXs' | 'bpMd' | 'bpLg' | 'bpXxl', Viewport> = {
  bpXs: { width: 360, height: 800 },
  bpMd: { width: 800, height: 1_000 },
  bpLg: { width: 1_200, height: 1_000 },
  bpXxl: { width: 2_000, height: 1_200 },
};

async function captureScreenshot(page: Page, name: string, testInfo: TestInfo): Promise<void> {
  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach(`${name}-screenshot`, {
    body: screenshot,
    contentType: 'image/png',
  });
}

async function captureAccessibility(
  page: Page,
  name: string,
  testInfo: TestInfo,
): Promise<AxeResults> {
  const results = await new AxeBuilderModule({ page }).analyze();
  if (results.violations.length > 0) {
    console.warn(
      `axe detected ${results.violations.length} violation(s) for ${name}:`,
      results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => JSON.stringify(node.target)),
      })),
    );
  }
  await testInfo.attach(`${name}-axe`, {
    body: Buffer.from(JSON.stringify(results, null, 2)),
    contentType: 'application/json',
  });
  return results;
}

function countColumnsFromAreas(template: string): number {
  const normalised = template.replace(/'/g, '"');
  const rows = normalised.match(/"([^"\\]|\\.)*"/g);
  if (!rows || rows.length === 0) {
    return 0;
  }

  return rows
    .map(
      (row) =>
        row
          .replaceAll('"', '')
          .trim()
          .split(/\s+/)
          .filter((token) => token.length > 0).length,
    )
    .reduce((max, count) => Math.max(max, count), 0);
}

function countTracks(template: string): number {
  const tokens: string[] = [];
  let buffer = '';
  let depth = 0;

  for (const char of template.trim()) {
    if (char === '(') {
      depth += 1;
    }
    if (char === ')') {
      depth -= 1;
    }

    if (char === ' ' && depth === 0) {
      if (buffer.trim().length > 0) {
        tokens.push(buffer.trim());
      }
      buffer = '';
    } else {
      buffer += char;
    }
  }

  if (buffer.trim().length > 0) {
    tokens.push(buffer.trim());
  }

  return tokens.length;
}

async function mockSearchEndpoints(page: Page): Promise<void> {
  await page.context().addCookies([
    {
      name: 'semantic-search-fixtures',
      value: 'on',
      url: 'http://localhost:3000',
    },
  ]);

  await page.route('**/api/search', async (route) => {
    if (route.request().method() === 'POST') {
      const raw = route.request().postData();
      let parsedBody: Record<string, unknown> | null = null;

      try {
        parsedBody = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
      } catch {
        parsedBody = null;
      }

      const payload = (() => {
        if (parsedBody && parsedBody.scope === MULTI_SCOPE) {
          return {
            scope: MULTI_SCOPE,
            buckets: NARROW_SEARCH_SCOPES.map((scope) => ({
              scope,
              result: structuredSearchFixture,
            })),
            suggestions: suggestionFixture.suggestions,
          };
        }
        return structuredSearchFixture;
      })();

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(payload),
      });
      return;
    }
    await route.continue();
  });

  await page.route('**/api/search/suggest', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(suggestionFixture),
    });
  });
}

async function setThemeMode(page: Page, mode: 'light' | 'dark' | 'system'): Promise<void> {
  await page.context().addCookies([
    {
      name: 'theme-mode',
      value: mode,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}

async function runStructuredSearch(page: Page): Promise<void> {
  const queryInputs = page.getByLabel('Query');
  await queryInputs.first().fill('decimals');
  await page.getByRole('button', { name: 'Search' }).first().click();

  await expect(page.getByTestId('search-results-grid').locator(':scope > li')).toHaveCount(
    structuredSearchFixture.results.length,
  );
}

// Search page regressions ----------------------------------------------------

test.describe('Search page responsive regressions', () => {
  test.describe('bp-xs (360px)', () => {
    test.use({ viewport: VIEWPORTS.bpXs });

    test('Structured controls stack vertically', async ({ page }, testInfo) => {
      await mockSearchEndpoints(page);
      await page.goto('/structured_search');
      await expect(page.getByTestId('search-page')).toBeVisible();
      await runStructuredSearch(page);

      const controls = page.getByLabel('Search controls');
      const template = await controls.evaluate((el) => getComputedStyle(el).gridTemplateAreas);
      const columns = countColumnsFromAreas(template);

      await captureScreenshot(page, 'search-controls-bp-xs', testInfo);
      const axe = await captureAccessibility(page, 'search-controls-bp-xs', testInfo);

      expect.soft(columns).toBeLessThanOrEqual(1);
      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });

  test.describe('bp-md (800px)', () => {
    test.use({ viewport: VIEWPORTS.bpMd });

    test('Structured controls stay single-column and results grid spans two columns', async ({
      page,
    }, testInfo) => {
      await mockSearchEndpoints(page);
      await page.goto('/structured_search');
      await expect(page.getByTestId('search-page')).toBeVisible();
      await runStructuredSearch(page);

      const controls = page.getByLabel('Search controls');
      const controlAreas = await controls.evaluate((el) => getComputedStyle(el).gridTemplateAreas);
      const controlColumns = countColumnsFromAreas(controlAreas);

      const resultsGrid = page.getByTestId('search-results-grid');
      const resultsTemplate = await resultsGrid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns,
      );
      const resultsColumns = countTracks(resultsTemplate);

      await captureScreenshot(page, 'search-controls-bp-md', testInfo);
      const axe = await captureAccessibility(page, 'search-controls-bp-md', testInfo);

      expect.soft(controlColumns).toBe(1);
      expect.soft(resultsColumns).toBe(2);
      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });

  test.describe('bp-lg (1_200px)', () => {
    test.use({ viewport: VIEWPORTS.bpLg });

    test('Hero copy is clamped for readability', async ({ page }, testInfo) => {
      await mockSearchEndpoints(page);
      await page.goto('/structured_search');
      await expect(page.getByTestId('search-hero')).toBeVisible();
      await runStructuredSearch(page);

      const hero = page.getByTestId('search-hero');
      const maxInline = await hero.evaluate((el) =>
        getComputedStyle(el).getPropertyValue('max-inline-size'),
      );

      await captureScreenshot(page, 'search-hero-bp-lg', testInfo);
      const axe = await captureAccessibility(page, 'search-hero-bp-lg', testInfo);

      expect.soft(maxInline).not.toBe('none');
      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });

  test.describe('bp-lg (1_200px) dark mode', () => {
    test.use({ viewport: VIEWPORTS.bpLg });

    test('Hero copy is clamped for readability in dark mode', async ({ page }, testInfo) => {
      await mockSearchEndpoints(page);
      await setThemeMode(page, 'dark');
      await page.goto('/structured_search');
      await expect(page.getByTestId('search-hero')).toBeVisible();
      await runStructuredSearch(page);

      const hero = page.getByTestId('search-hero');
      const html = page.locator('html');

      await expect(html).toHaveAttribute('data-theme', 'dark');
      await expect(hero).toBeVisible();

      await captureScreenshot(page, 'search-hero-bp-lg-dark', testInfo);
      const axe = await captureAccessibility(page, 'search-hero-bp-lg-dark', testInfo);

      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });

  test.describe('Natural language route', () => {
    test.use({ viewport: VIEWPORTS.bpMd });

    test('Hero and skip links emphasise conversational flow', async ({ page }, testInfo) => {
      await page.goto('/natural_language_search');
      await expect(page.getByTestId('search-hero')).toBeVisible();

      const heroHeading = page.getByRole('heading', { level: 1, name: 'Natural language search' });
      await expect(heroHeading).toBeVisible();

      const heroCopy = page.getByText(
        'Describe what you need in plain language so we can derive structured parameters and run hybrid queries.',
      );
      await expect(heroCopy).toBeVisible();

      const skipLinksNav = page.getByRole('navigation', {
        name: 'Skip links',
        includeHidden: true,
      });
      const skipToForm = skipLinksNav.getByRole('link', {
        name: 'Skip to natural language search form',
        includeHidden: true,
      });
      const skipToResults = skipLinksNav.getByRole('link', {
        name: 'Skip to natural language results',
        includeHidden: true,
      });

      await skipToForm.focus();
      await expect(skipToForm).toBeVisible();
      await expect(skipToForm).toHaveAccessibleName('Skip to natural language search form');

      await skipToResults.focus();
      await expect(skipToResults).toBeVisible();
      await expect(skipToResults).toHaveAccessibleName('Skip to natural language results');

      await captureScreenshot(page, 'natural-hero-bp-md', testInfo);
      const axe = await captureAccessibility(page, 'natural-hero-bp-md', testInfo);

      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });

  test.describe('Overflow guard 1100px', () => {
    test.use({ viewport: { width: 1_100, height: 900 } });

    test('Content does not overflow the viewport at 1100px', async ({ page }, testInfo) => {
      await mockSearchEndpoints(page);
      await page.goto('/structured_search');
      await runStructuredSearch(page);

      await captureScreenshot(page, 'search-overflow-1100', testInfo);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect.soft(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });
  });

  test.describe('Overflow guard 1380px', () => {
    test.use({ viewport: { width: 1_380, height: 900 } });

    test('Content does not overflow the viewport at 1380px', async ({ page }, testInfo) => {
      await mockSearchEndpoints(page);
      await page.goto('/structured_search');
      await runStructuredSearch(page);

      await captureScreenshot(page, 'search-overflow-1380', testInfo);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect.soft(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });
  });
});

// Admin page regressions -----------------------------------------------------

test.describe('Admin page responsive regressions', () => {
  test.use({ viewport: VIEWPORTS.bpLg });

  test('Layout clamps within the viewport and clears stale hashes', async ({ page }, testInfo) => {
    await page.goto('/admin#tag/sdk/paths/~1api~1sdk~1search-transcripts/post');
    await expect(page).toHaveURL(/\/admin$/);

    const container = page.getByTestId('admin-page');
    const maxWidth = await container.evaluate((el) => getComputedStyle(el).maxWidth);
    expect.soft(maxWidth.includes('min(100%,')).toBe(true);

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    await captureScreenshot(page, 'admin-layout-bp-lg', testInfo);
    const axe = await captureAccessibility(page, 'admin-layout-bp-lg', testInfo);

    expect.soft(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
  });
});

// Admin page regressions -----------------------------------------------------

test.describe('Admin page responsive regressions', () => {
  test.describe('bp-md (800px)', () => {
    test.use({ viewport: VIEWPORTS.bpMd });

    test('Admin actions grid forms responsive columns', async ({ page }, testInfo) => {
      await page.goto('/admin');
      await expect(page.getByRole('heading', { level: 1, name: 'Admin tools' })).toBeVisible();

      const actionsGrid = page.getByTestId('admin-actions-grid');
      const display = await actionsGrid.evaluate((el) => getComputedStyle(el).display);
      const template = await actionsGrid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
      const columnCount = countTracks(template);

      await captureScreenshot(page, 'admin-main-bp-md', testInfo);
      const axe = await captureAccessibility(page, 'admin-main-bp-md', testInfo);

      expect.soft(display).toBe('grid');
      expect.soft(columnCount).toBeGreaterThanOrEqual(1);
      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });

  test.describe('bp-xxl (2_000px)', () => {
    test.use({ viewport: VIEWPORTS.bpXxl });

    test('Admin main width expands with viewport', async ({ page }, testInfo) => {
      await page.goto('/admin');
      await expect(page.getByRole('heading', { level: 1, name: 'Admin tools' })).toBeVisible();

      const mainWidth = await page
        .locator('main')
        .evaluate((el) => el.getBoundingClientRect().width);

      await captureScreenshot(page, 'admin-main-bp-xxl', testInfo);
      const axe = await captureAccessibility(page, 'admin-main-bp-xxl', testInfo);

      expect.soft(mainWidth).toBeGreaterThanOrEqual(1_200);
      expect.soft(mainWidth).toBeLessThanOrEqual(1_260);
      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });
});

// Docs page regressions ------------------------------------------------------

test.describe('Docs page responsive regressions', () => {
  test.describe('bp-xxl (2_000px)', () => {
    test.use({ viewport: VIEWPORTS.bpXxl });

    test('API docs container remains centred and wide enough', async ({ page }, testInfo) => {
      await page.goto('/api/docs');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Oak Curriculum Search API' }),
      ).toBeVisible();

      const mainWidth = await page
        .locator('main')
        .evaluate((el) => el.getBoundingClientRect().width);

      await captureScreenshot(page, 'docs-main-bp-xxl', testInfo);
      const axe = await captureAccessibility(page, 'docs-main-bp-xxl', testInfo);

      expect.soft(mainWidth).toBeGreaterThanOrEqual(1_200);
      expect.soft(mainWidth).toBeLessThanOrEqual(1_260);
      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });
});

// Status surface regressions -------------------------------------------------

test.describe('Status surface regressions', () => {
  test.describe('bp-xs (360px)', () => {
    test.use({ viewport: VIEWPORTS.bpXs });

    test('Status page renders Oak UI shell', async ({ page }, testInfo) => {
      await page.goto('/status');

      const main = page.getByTestId('status-page');
      await expect(main).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: /Platform status/i })).toBeVisible();

      await captureScreenshot(page, 'status-bp-xs', testInfo);
      const axe = await captureAccessibility(page, 'status-bp-xs', testInfo);

      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });
});
