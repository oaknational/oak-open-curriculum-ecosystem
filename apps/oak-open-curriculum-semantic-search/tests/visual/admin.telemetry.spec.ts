import { test, expect } from '@playwright/test';

test.describe('Admin telemetry observability', () => {
  test('surfaces outage guidance and fixture status', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'semantic-search-fixtures',
        value: 'error',
        url: 'http://localhost:3000',
      },
    ]);

    await page.route('**/api/observability/zero-hit**', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'FIXTURE_ERROR',
          message: 'Fixture mode requested an error response for zero-hit telemetry.',
        }),
      });
    });

    await page.goto('/admin');

    const outageAlert = page
      .getByRole('alert')
      .filter({ hasText: /Zero-hit telemetry is temporarily unavailable/i });
    await expect(outageAlert).toContainText('Zero-hit telemetry is temporarily unavailable');

    const statusNotice = page.getByTestId('zero-hit-telemetry-status');
    await expect(statusNotice).toContainText('Deterministic fixtures active');
  });
});
