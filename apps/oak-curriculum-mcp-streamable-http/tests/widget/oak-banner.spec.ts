/**
 * Playwright tests for the Oak brand banner widget.
 *
 * Tests verify structural rendering and WCAG 2.2 AA accessibility in
 * light, dark, and forced-colours modes (three Playwright projects in
 * `playwright.widget.config.ts`). The widget runs standalone via Vite
 * dev server — no MCP server connection required.
 *
 * @remarks
 * The `@a11y` tag allows `test:widget:a11y` to run accessibility checks
 * independently from visual assertions via `--grep @a11y`.
 */
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Oak banner widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/oak-banner.html', { waitUntil: 'networkidle' });
  });

  test('@a11y link exposes the exact accessible name', async ({ page }) => {
    // The wordmark is the link's only visible content; the name comes from
    // one visually hidden text node, so it must compute exactly — a dropped
    // hint or a dropped brand name both fail this (axe's link-name rule
    // would not: it only requires a non-empty name).
    await expect(
      page.getByRole('link', { name: 'Oak National Academy (opens in a new tab)', exact: true }),
    ).toBeVisible();
  });

  test('@a11y wordmark is decorative — hidden from AT, no stray img node', async ({ page }) => {
    await expect(page.locator('.oak-brand-banner__logo')).toHaveAttribute('aria-hidden', 'true');

    // An un-hidden inline SVG inside the link is exposed as a NAMELESS img
    // node in the accessibility tree, and axe does not flag it (svg-img-alt
    // fires only on an explicit role). Role-count is the format-independent
    // proof: aria-hidden removes the node from the tree entirely.
    const link = page.locator('.oak-brand-banner__link');
    await expect(link.getByRole('img')).toHaveCount(0);
  });

  test('@a11y forced-colours emulation is live exactly where the project declares it', async ({
    page,
  }, testInfo) => {
    // A silently ignored emulation option turns the whole forced-colours
    // project into a mislabeled re-run of the dark project (worked failure:
    // Playwright 1.62 dropped the test-level forcedColors key and ignored
    // it without error). This pins the wiring in every project.
    const active = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);

    expect(active).toBe(testInfo.project.name === 'widget-forced-colors');
  });

  test('@a11y wordmark geometry renders in the link ink (currentColor reaches the fill)', async ({
    page,
  }) => {
    // The asset is bare geometry: without `fill: currentColor` it falls
    // back to SVG-initial BLACK — near-invisible on the dark accent panel
    // and totally invisible under forced colours (black on black). Axe's
    // contrast rules exempt logotypes, so this equality is the only
    // automated catch. It runs in all three theme projects.
    const linkColor = await page
      .locator('.oak-brand-banner__link')
      .evaluate((el) => getComputedStyle(el).color);
    const geometryFill = await page
      .locator('.oak-brand-banner__logo path')
      .first()
      .evaluate((el) => getComputedStyle(el).fill);

    expect(geometryFill).toBe(linkColor);
  });

  test('exposes the brand banner as a banner landmark', async ({ page }) => {
    // Playwright's role engine applies the HTML-AAM ancestry rule: a <header>
    // inside <main> is NOT a banner landmark, so this resolves only when the
    // header is a sibling of main. jsdom cannot express this state.
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('renders the experimental-service disclaimer', async ({ page }) => {
    await expect(
      page.getByText(
        'This service is experimental. It uses Oak National Academy content, but AI can make mistakes and output should not be treated as official resources.',
      ),
    ).toBeVisible();
  });

  test('renders the wide wordmark at its intrinsic ratio and a usable size', async ({ page }) => {
    const logo = page.locator('.oak-brand-banner__logo');
    await expect(logo).toBeVisible();

    // The width-driven CSS (token-clamped width, block-size auto) must
    // re-resolve the height from the asset's intrinsic ratio (~9.78:1) —
    // a letterboxed, cropped, or zero-height render all fail this, and
    // nothing else at browser scale distinguishes the wide lockup from
    // the old 0.76:1 acorn.
    const box = await logo.boundingBox();
    expect(box).not.toBeNull();
    expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(3600 / 368.16, 1);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(20);
  });

  test('banner link targets Oak website', async ({ page }) => {
    const link = page.locator('.oak-brand-banner__link');
    await expect(link).toHaveAttribute('href', 'https://www.thenational.academy');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('applies a non-transparent page background', async ({ page }) => {
    const body = page.locator('body');

    // Design tokens set a non-transparent background via CSS custom properties.
    // Playwright's toHaveCSS asserts the computed value.
    await expect(body).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  });

  test('shell keeps the authored token padding with no host insets (MCP-434)', async ({ page }) => {
    // The standalone page receives no host safe-area insets, so the
    // 0px fallback in `.oak-app`'s calc() composition must resolve to
    // exactly the authored token padding. The ChatGPT desktop
    // regression surfaced here as 0 on all four sides: inline inset
    // padding replaced the class rule. The expected value is the token
    // RESOLVED through a probe element, not a hardcoded pixel count,
    // so a deliberate token change never fails this test.
    const expected = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.paddingTop = 'var(--oak-component-page-padding)';
      document.body.append(probe);
      const value = getComputedStyle(probe).paddingTop;
      probe.remove();
      return value;
    });

    const shell = page.locator('[data-testid="oak-mcp-app-shell"]');
    await expect(shell).toHaveCSS('padding-top', expected);
    await expect(shell).toHaveCSS('padding-right', expected);
    await expect(shell).toHaveCSS('padding-bottom', expected);
    await expect(shell).toHaveCSS('padding-left', expected);
  });

  test('shell composes host insets on top of the authored padding (MCP-434)', async ({ page }) => {
    // Both halves of the zero-inset regression and the notch case, in a
    // real cascade: explicit 0px insets (what ChatGPT desktop sends)
    // must leave the authored padding untouched, and a non-zero inset
    // must ADD to it — never replace it. This binds the cross-file
    // contract between the TS side (custom property names emitted by
    // safe-area-insets.ts) and the CSS side (`.oak-app`'s calc()
    // composition); a name drift on either side is swallowed by the
    // 0px fallback and only this computed-value check catches it.
    const shell = page.locator('[data-testid="oak-mcp-app-shell"]');
    const authored = await shell.evaluate((el) => getComputedStyle(el).paddingTop);

    await shell.evaluate((el) => {
      el.style.setProperty('--oak-safe-area-inset-top', '0px');
      el.style.setProperty('--oak-safe-area-inset-right', '0px');
      el.style.setProperty('--oak-safe-area-inset-bottom', '0px');
      el.style.setProperty('--oak-safe-area-inset-left', '0px');
    });
    await expect(shell).toHaveCSS('padding-top', authored);
    await expect(shell).toHaveCSS('padding-bottom', authored);

    await shell.evaluate((el) => {
      el.style.setProperty('--oak-safe-area-inset-top', '44px');
    });
    await expect(shell).toHaveCSS('padding-top', `${Number.parseFloat(authored) + 44}px`);
    await expect(shell).toHaveCSS('padding-bottom', authored);
  });

  test('@a11y passes WCAG accessibility checks', async ({ page }) => {
    // Under forced colours ONLY, axe's color-contrast rule is excluded:
    // axe measures the author palette (via -webkit-text-fill-color, which
    // forced colours does not replace) against the FORCED background —
    // axe-core#3978, an upstream bug — and WCAG 1.4.3 is out of scope in
    // that mode anyway (the user's own guaranteed palette replaces ours).
    // Pixel evidence: the flagged disclaimer paints white-on-black at 21:1.
    // The matchMedia gate fails SAFE — if the emulation ever dies, the rule
    // runs again. Governed by the forced-colours criterion scoping in
    // docs/governance/accessibility-practice.md (ADR-147).
    const forcedColoursActive = await page.evaluate(
      () => matchMedia('(forced-colors: active)').matches,
    );
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .disableRules(forcedColoursActive ? ['color-contrast'] : [])
      .analyze();

    expect(
      results.violations.length,
      `Accessibility violations:\n${JSON.stringify(results.violations, null, 2)}`,
    ).toBe(0);
  });

  test('@a11y the color-contrast exclusion self-retires with its upstream cause', async ({
    page,
  }, testInfo) => {
    // The exclusion above exists only because axe-core#3978 reports a
    // false color-contrast violation under forced colours. This probes
    // the SYMPTOM — axe run with only that rule — so it retires on EITHER
    // upstream fix path: Chromium forcing -webkit-text-fill-color, or axe
    // switching to read `color`. The moment the artefact disappears, the
    // forced-colours expectation fails and its finder DELETES the
    // exclusion. In the author-palette projects the same probe must find
    // nothing (the real palette has proper contrast), so the expected
    // value is project-conditional data on one deterministic assertion
    // path.
    const probe = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    const falsePositivePresent = probe.violations.some((v) => v.id === 'color-contrast');

    const artefactExpected = testInfo.project.name === 'widget-forced-colors';
    expect(
      falsePositivePresent,
      artefactExpected
        ? 'axe-core#3978 artefact is gone — delete the color-contrast exclusion above'
        : `color-contrast violations in an author-palette project:\n${JSON.stringify(probe.violations, null, 2)}`,
    ).toBe(artefactExpected);
  });
});
