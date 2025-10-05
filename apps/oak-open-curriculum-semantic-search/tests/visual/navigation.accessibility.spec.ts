import AxeBuilderModule from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { HEADER_NAV_METADATA } from '../../app/ui/global/Header/useNavItems';

const NAV_METADATA = HEADER_NAV_METADATA;
const NAV_LINKS = NAV_METADATA.primary.map(({ label, href }) => ({ name: label, href }));
const HOME_LINK =
  NAV_METADATA.primary.find((item) => item.id === 'home') ?? NAV_METADATA.primary[0];

test.describe('Primary navigation', () => {
  test('links are accessible and focusable', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Primary' });

    for (const { name, href } of NAV_LINKS) {
      const link = nav.getByRole('link', { name, exact: true });
      await expect(link).toHaveAttribute('href', href);
    }

    const homeLink = nav.getByRole('link', { name: HOME_LINK.label, exact: true });
    await homeLink.focus();
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

    const fixtureToggle = page.getByRole('radiogroup', { name: /fixture mode/i });
    await expect(fixtureToggle).toBeVisible();
    const fixturesOption = fixtureToggle.getByRole('radio', { name: /fixtures \(success\)/i });
    await expect(fixturesOption).toBeChecked();

    const axe = await new AxeBuilderModule({ page }).include('nav[aria-label="Primary"]').analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });
});
