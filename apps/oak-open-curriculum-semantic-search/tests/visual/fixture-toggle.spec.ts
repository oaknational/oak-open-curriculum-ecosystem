import { Buffer } from 'node:buffer';
import AxeBuilderModule from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  STRUCTURED_EMPTY_RESULTS_MESSAGE,
  STRUCTURED_FIXTURE_OUTAGE_MESSAGE,
} from '../../app/ui/search/content/structured-search-messages';
import { structuredSearchFixture } from '../../app/ui/search/__fixtures__/search-structured';

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

async function submitStructuredSearch(page: Page, query = 'fractions'): Promise<void> {
  const queryField = page.getByLabel('Query');
  await expect(queryField).toBeVisible();
  await queryField.first().fill(query);
  await page.getByRole('button', { name: 'Search' }).first().click();
}

test.describe('Fixture toggle workflow', () => {
  test('switches between fixtures and live data paths', async ({ page, context }, testInfo) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'on',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/structured_search');

    await expect(page.getByText('Using fixtures (success)')).toBeVisible();
    const fixtureNotice = page.getByText(
      'Showing deterministic fixture results. Switch to live data to inspect production behaviour.',
    );
    await expect(fixtureNotice).toBeVisible();
    await submitStructuredSearch(page);
    const resultItems = page.getByTestId('search-results-grid').locator(':scope > li');
    await expect(resultItems).toHaveCount(structuredSearchFixture.results.length);
    await captureScreenshot(page, 'fixture-mode-fixtures', testInfo);
    const fixturesAxe = await captureAccessibility(page, 'fixture-mode-fixtures', testInfo);
    expect.soft(fixturesAxe.violations.length).toBe(0);

    await page.locator('label[for="search-fixture-mode-live"]').click();
    await expect(page.getByText('Using live data')).toBeVisible();
    await expect(fixtureNotice).toBeHidden();

    await captureScreenshot(page, 'fixture-mode-live', testInfo);
    const liveAxe = await captureAccessibility(page, 'fixture-mode-live', testInfo);
    expect.soft(liveAxe.violations.length).toBe(0);
    await expect
      .poll(async () => {
        const cookies = await context.cookies();
        return cookies.find(({ name }) => name === 'semantic-search-fixtures')?.value;
      })
      .toBe('off');
  });

  test('retains multi-scope buckets when fixture mode is enabled via cookie', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'on',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/structured_search?scope=all');

    await expect(page.getByText('Using fixtures (success)')).toBeVisible();
    await expect(page.getByTestId('structured-search-panel')).toBeVisible();
  });

  test('announces deterministic empty fixtures after a structured search', async ({
    page,
    context,
  }, testInfo) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'empty',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/structured_search');

    await expect(
      page.getByText(
        'Showing deterministic fixtures without results so you can review empty-state messaging.',
      ),
    ).toBeVisible();

    await submitStructuredSearch(page);

    await expect(page.getByText(/0 results for/i)).toBeVisible();
    await expect(page.getByText(STRUCTURED_EMPTY_RESULTS_MESSAGE)).toBeVisible();
    await captureScreenshot(page, 'fixture-mode-empty', testInfo);
    const emptyAxe = await captureAccessibility(page, 'fixture-mode-empty', testInfo);
    expect.soft(emptyAxe.violations.length).toBe(0);
  });

  test('surfaces outage messaging when error fixtures are active', async ({
    page,
    context,
  }, testInfo) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'error',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/structured_search');

    const outageNotice = page.getByText(STRUCTURED_FIXTURE_OUTAGE_MESSAGE);
    await expect(outageNotice).toBeVisible();

    await submitStructuredSearch(page);

    await expect(page.getByText(STRUCTURED_FIXTURE_OUTAGE_MESSAGE)).toBeVisible();
    await expect(outageNotice).toBeVisible();
    await captureScreenshot(page, 'fixture-mode-error', testInfo);
    const errorAxe = await captureAccessibility(page, 'fixture-mode-error', testInfo);
    expect.soft(errorAxe.violations.length).toBe(0);
  });

  test('switches admin fixtures via scenario radios', async ({ page, context }, testInfo) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'on',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/admin');

    await expect(page.getByRole('radiogroup', { name: 'Admin data' })).toBeVisible();
    await expect(page.getByText('Using fixtures (success)')).toBeVisible();
    const successNotice = page.getByText(
      'Running deterministic admin fixtures. Switch to live data to perform real operations.',
    );
    await expect(successNotice).toBeVisible();

    await captureScreenshot(page, 'admin-fixtures-success', testInfo);
    const successAxe = await captureAccessibility(page, 'admin-fixtures-success', testInfo);
    expect.soft(successAxe.violations.length).toBe(0);

    await page.locator('label[for="search-fixture-mode-live"]').click();
    await expect(page.getByText('Using live data')).toBeVisible();
    await expect(successNotice).toBeHidden();

    await captureScreenshot(page, 'admin-fixtures-live', testInfo);
    const liveAxe = await captureAccessibility(page, 'admin-fixtures-live', testInfo);
    expect.soft(liveAxe.violations.length).toBe(0);

    await expect
      .poll(async () => {
        const cookies = await context.cookies();
        return cookies.find(({ name }) => name === 'semantic-search-fixtures')?.value;
      })
      .toBe('off');
  });
});
