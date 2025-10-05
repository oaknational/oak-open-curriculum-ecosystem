import { Buffer } from 'node:buffer';
import AxeBuilderModule from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';
import { expect, test, type BrowserContext, type Page, type TestInfo } from '@playwright/test';
import {
  STRUCTURED_EMPTY_RESULTS_MESSAGE,
  STRUCTURED_FIXTURE_OUTAGE_MESSAGE,
} from '../../app/ui/search/content/structured-search-messages';
import { structuredSearchFixture } from '../../app/ui/search/__fixtures__/search-structured';
import { dismissNextDevOverlay } from './devtools';
import {
  FIXTURE_MODE_COOKIE,
  modeToCookieValue,
  type FixtureMode,
} from '../../app/lib/fixture-mode';

const FIXTURE_SUMMARY_LABEL: Record<FixtureMode, string> = {
  fixtures: 'Using fixtures (success)',
  'fixtures-empty': 'Using fixtures (empty)',
  'fixtures-error': 'Using fixtures (error)',
  live: 'Using live data',
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

async function submitStructuredSearch(page: Page, query = 'fractions'): Promise<void> {
  const queryField = page.getByLabel('Query');
  await expect(queryField).toBeVisible();
  await queryField.first().fill(query);
  const searchButton = page.getByRole('button', { name: 'Search' }).first();
  await searchButton.click();
  await page.waitForLoadState('networkidle');
}

async function seedFixtureCookie(context: BrowserContext, mode: FixtureMode): Promise<void> {
  await context.addCookies([
    {
      name: FIXTURE_MODE_COOKIE,
      value: modeToCookieValue(mode),
      url: 'http://localhost:3000',
    },
  ]);
}

async function expectFixtureModeSummary(page: Page, mode: FixtureMode): Promise<void> {
  await expect(page.getByText(FIXTURE_SUMMARY_LABEL[mode]).first()).toBeVisible();
}

async function selectFixtureMode(
  page: Page,
  context: BrowserContext,
  mode: FixtureMode,
): Promise<void> {
  await page.getByRole('banner').locator(`label[for="search-fixture-mode-${mode}"]`).click();
  await expect
    .poll(async () => {
      const cookies = await context.cookies();
      return cookies.find(({ name }) => name === FIXTURE_MODE_COOKIE)?.value ?? null;
    })
    .toBe(modeToCookieValue(mode));
  await expectFixtureModeSummary(page, mode);
}

test.describe('Fixture toggle workflow', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('switches between fixtures and live data paths', async ({ page, context }, testInfo) => {
    await seedFixtureCookie(context, 'fixtures');
    await page.goto('/structured_search');
    await dismissNextDevOverlay(page);

    await expectFixtureModeSummary(page, 'fixtures');
    const fixtureNotice = page.getByText(/Using fixture scenario: success/i);
    await expect(fixtureNotice).toBeVisible();
    await submitStructuredSearch(page);
    const resultItems = page.getByTestId('search-results-grid').locator(':scope > li');
    await expect(resultItems).toHaveCount(structuredSearchFixture.results.length);
    await captureScreenshot(page, 'fixture-mode-fixtures', testInfo);
    const fixturesAxe = await captureAccessibility(page, 'fixture-mode-fixtures', testInfo);
    expect.soft(fixturesAxe.violations.length).toBe(0);

    await selectFixtureMode(page, context, 'live');
    await expect(fixtureNotice).toBeHidden();

    await captureScreenshot(page, 'fixture-mode-live', testInfo);
    const liveAxe = await captureAccessibility(page, 'fixture-mode-live', testInfo);
    expect.soft(liveAxe.violations.length).toBe(0);
  });

  test('retains multi-scope buckets when fixture mode is enabled via cookie', async ({
    page,
    context,
  }) => {
    await seedFixtureCookie(context, 'fixtures');
    await page.goto('/structured_search?scope=all');
    await dismissNextDevOverlay(page);

    await expectFixtureModeSummary(page, 'fixtures');
    await expect(page.getByTestId('structured-search-panel')).toBeVisible();
  });

  test('announces deterministic empty fixtures after a structured search', async ({
    page,
    context,
  }, testInfo) => {
    await seedFixtureCookie(context, 'fixtures-empty');
    await page.goto('/structured_search');
    await dismissNextDevOverlay(page);

    await expectFixtureModeSummary(page, 'fixtures-empty');

    await expect(page.getByText(/Using fixture scenario: empty dataset/i)).toBeVisible();

    await submitStructuredSearch(page);

    const emptyResults = page.getByTestId('search-results-grid').locator(':scope > li');
    await expect(emptyResults).toHaveCount(0);
    await expect(page.getByText(STRUCTURED_EMPTY_RESULTS_MESSAGE)).toBeVisible();
    await captureScreenshot(page, 'fixture-mode-empty', testInfo);
    const emptyAxe = await captureAccessibility(page, 'fixture-mode-empty', testInfo);
    expect.soft(emptyAxe.violations.length).toBe(0);
  });

  test('surfaces outage messaging when error fixtures are active', async ({
    page,
    context,
  }, testInfo) => {
    await seedFixtureCookie(context, 'fixtures-error');
    await page.goto('/structured_search');
    await dismissNextDevOverlay(page);

    await expectFixtureModeSummary(page, 'fixtures-error');

    const fixtureScenarioNotice = page.getByText(/Using fixture scenario: simulated outage/i);
    await expect(fixtureScenarioNotice).toBeVisible();

    await submitStructuredSearch(page);

    await expect(page.getByText(STRUCTURED_FIXTURE_OUTAGE_MESSAGE)).toBeVisible();
    await captureScreenshot(page, 'fixture-mode-error', testInfo);
    const errorAxe = await captureAccessibility(page, 'fixture-mode-error', testInfo);
    expect.soft(errorAxe.violations.length).toBe(0);
  });

  test('switches admin fixtures via scenario radios', async ({ page, context }, testInfo) => {
    await seedFixtureCookie(context, 'fixtures');
    await page.goto('/admin');
    await dismissNextDevOverlay(page);

    await expectFixtureModeSummary(page, 'fixtures');
    const successNotice = page.getByText(
      'Running deterministic admin fixtures. Switch to live data to perform real operations.',
    );
    await expect(successNotice).toBeVisible();

    await captureScreenshot(page, 'admin-fixtures-success', testInfo);
    const successAxe = await captureAccessibility(page, 'admin-fixtures-success', testInfo);
    expect.soft(successAxe.violations.length).toBe(0);

    await selectFixtureMode(page, context, 'live');
    await expect(successNotice).toBeHidden();

    await captureScreenshot(page, 'admin-fixtures-live', testInfo);
    const liveAxe = await captureAccessibility(page, 'admin-fixtures-live', testInfo);
    expect.soft(liveAxe.violations.length).toBe(0);
  });
});
