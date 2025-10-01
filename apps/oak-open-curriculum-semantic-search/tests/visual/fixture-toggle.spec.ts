import { Buffer } from 'node:buffer';
import AxeBuilderModule from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

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

test.describe('Fixture toggle workflow', () => {
  test('switches between fixtures and live data paths', async ({ page, context }, testInfo) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'on',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/search');

    await expect(page.getByText('Search data: Fixtures')).toBeVisible();
    const fixtureNotice = page.getByText(
      'Showing deterministic fixture results. Switch to live data to inspect production behaviour.',
    );
    await expect(fixtureNotice).toBeVisible();
    await captureScreenshot(page, 'fixture-mode-fixtures', testInfo);
    const fixturesAxe = await captureAccessibility(page, 'fixture-mode-fixtures', testInfo);
    expect.soft(fixturesAxe.violations.length).toBe(0);

    await page.getByTestId('fixture-mode-toggle').click();
    await expect(page.getByText('Search data: Live')).toBeVisible();
    await expect(fixtureNotice).toBeHidden();

    await captureScreenshot(page, 'fixture-mode-live', testInfo);
    const liveAxe = await captureAccessibility(page, 'fixture-mode-live', testInfo);
    expect.soft(liveAxe.violations.length).toBe(0);
    const cookies = await context.cookies();
    const fixtureCookie = cookies.find(({ name }) => name === 'semantic-search-fixtures');
    expect(fixtureCookie?.value).toBe('off');
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

    await page.goto('/search?scope=all');

    await expect(page.getByText('Search data: Fixtures')).toBeVisible();
    await expect(page.getByTestId('structured-search-panel')).toBeVisible();
  });

  test('announces deterministic empty fixtures after a structured search', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'empty',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/search');

    await expect(
      page.getByText(
        'Showing deterministic fixtures without results so you can review empty-state messaging.',
      ),
    ).toBeVisible();

    const structuredPanel = page.getByTestId('structured-search-panel');
    await structuredPanel.getByLabel('Query').fill('fractions');
    await structuredPanel.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText(/0 results for/i)).toBeVisible();
    await expect(
      page.getByText('No results found for this search. Adjust the filters or try another term.'),
    ).toBeVisible();
  });

  test('surfaces outage messaging when error fixtures are active', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'error',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/search');

    const outageNotice = page.getByText(
      'Simulating a search outage. Switch to live data or try again later.',
    );
    await expect(outageNotice).toBeVisible();

    const structuredPanel = page.getByTestId('structured-search-panel');
    await structuredPanel.getByLabel('Query').fill('fractions');
    await structuredPanel.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('Search failed')).toBeVisible();
    await expect(outageNotice).toBeVisible();
  });
});
