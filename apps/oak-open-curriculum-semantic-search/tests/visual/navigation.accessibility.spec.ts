import AxeBuilderModule from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const NAV_LINKS: ReadonlyArray<{ name: string; href: string }> = [
  { name: 'Search', href: '/' },
  { name: 'Structured search', href: '/structured_search' },
  { name: 'Natural language search', href: '/natural_language_search' },
  { name: 'Admin', href: '/admin' },
  { name: 'Status', href: '/status' },
  { name: 'Docs', href: '/api/docs' },
];

test.describe('Primary navigation', () => {
  test('links are accessible and focusable', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Primary' });

    for (const { name, href } of NAV_LINKS) {
      const link = nav.getByRole('link', { name, exact: true });
      await expect(link).toHaveAttribute('href', href);
    }

    const searchLink = nav.getByRole('link', { name: 'Search', exact: true });
    await searchLink.focus();
    const focusStyles = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active) {
        return null;
      }
      const style = window.getComputedStyle(active);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });

    expect(focusStyles).not.toBeNull();
    expect(focusStyles?.outlineStyle).not.toBe('none');
    expect(focusStyles?.outlineWidth).not.toBe('0px');

    const axe = await new AxeBuilderModule({ page }).include('nav[aria-label="Primary"]').analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });
});
