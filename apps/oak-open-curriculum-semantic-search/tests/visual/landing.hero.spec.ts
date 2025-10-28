import { expect, test } from '@playwright/test';

const LANDING_URL = '/';

test.describe('Landing page experience', () => {
  test('hero presents direct structured and natural entry points', async ({ page }, testInfo) => {
    await page.goto(LANDING_URL, { waitUntil: 'networkidle' });

    const landing = page.getByTestId('landing-page');

    await expect(
      landing.getByRole('heading', { level: 1, name: /search the oak curriculum your way/i }),
    ).toBeVisible();
    await expect(landing.getByRole('link', { name: /start structured search/i })).toBeVisible();
    await expect(
      landing.getByRole('link', { name: /start natural language search/i }),
    ).toBeVisible();

    const screenshot = await landing.screenshot();
    await testInfo.attach('landing-hero', { body: screenshot, contentType: 'image/png' });
  });

  test('CTA cards behave as full-card links', async ({ page }) => {
    await page.goto(LANDING_URL, { waitUntil: 'networkidle' });

    const landing = page.getByTestId('landing-page');

    await expect(landing.getByRole('link', { name: /^Structured search$/i })).toHaveAttribute(
      'href',
      '/structured_search',
    );
    await expect(landing.getByRole('link', { name: /^Natural language search$/i })).toHaveAttribute(
      'href',
      '/natural_language_search',
    );
  });
});
