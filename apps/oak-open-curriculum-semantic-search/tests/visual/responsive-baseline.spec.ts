import { Buffer } from 'node:buffer';
import AxeBuilderModule from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  structuredSearchFixture,
  suggestionFixture,
  emptySearchFixture,
} from '../../app/ui/__fixtures__/search-structured';

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
  await page.route('**/api/search', async (route) => {
    if (route.request().method() === 'POST') {
      let parsedBody: unknown = null;
      try {
        const raw = route.request().postData();
        parsedBody = raw ? JSON.parse(raw) : null;
      } catch {
        parsedBody = null;
      }

      const payload =
        parsedBody &&
        typeof parsedBody === 'object' &&
        parsedBody !== null &&
        'includeFacets' in parsedBody
          ? structuredSearchFixture
          : emptySearchFixture;

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

    test('Structured and natural panels stack vertically', async ({ page }, testInfo) => {
      await mockSearchEndpoints(page);
      await page.goto('/');
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

    test('Structured panels align side by side and results grid spans two columns', async ({
      page,
    }, testInfo) => {
      await mockSearchEndpoints(page);
      await page.goto('/');
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

      expect.soft(controlColumns).toBe(2);
      expect.soft(resultsColumns).toBe(2);
      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });

  test.describe('bp-lg (1_200px)', () => {
    test.use({ viewport: VIEWPORTS.bpLg });

    test('Hero copy is clamped for readability', async ({ page }, testInfo) => {
      await mockSearchEndpoints(page);
      await page.goto('/');
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
});

// Admin page regressions -----------------------------------------------------

test.describe('Admin page responsive regressions', () => {
  test.describe('bp-md (800px)', () => {
    test.use({ viewport: VIEWPORTS.bpMd });

    test('Admin main layout uses grid columns', async ({ page }, testInfo) => {
      test.fail();
      await page.goto('/admin');
      await expect(page.getByRole('heading', { level: 1, name: 'Admin tools' })).toBeVisible();

      const mainDisplay = await page.locator('main').evaluate((el) => getComputedStyle(el).display);

      await captureScreenshot(page, 'admin-main-bp-md', testInfo);
      const axe = await captureAccessibility(page, 'admin-main-bp-md', testInfo);

      expect.soft(mainDisplay).toBe('grid');
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

// Health surface regressions -------------------------------------------------

test.describe('Health surface regressions', () => {
  test.describe('bp-xs (360px)', () => {
    test.use({ viewport: VIEWPORTS.bpXs });

    test('Health page renders Oak UI shell', async ({ page }, testInfo) => {
      test.fail();
      await page.goto('/healthz');

      const mainCount = await page.locator('main').count();

      await captureScreenshot(page, 'healthz-bp-xs', testInfo);
      const axe = await captureAccessibility(page, 'healthz-bp-xs', testInfo);

      expect.soft(mainCount).toBeGreaterThan(0);
      expect.soft(axe.violations.length, 'axe violations must be resolved').toBe(0);
    });
  });
});
