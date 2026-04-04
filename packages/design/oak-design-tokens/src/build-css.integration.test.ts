import type { Result } from '@oaknational/result';
import type { ContrastReport, ContrastValidationError } from '@oaknational/design-tokens-core';
import { describe, expect, it } from 'vitest';
import { buildContrastReports, buildOakDesignTokensCss } from './build-css.js';

/** Assert the contrast build result is Ok and return the reports. */
function assertOkReports(
  result: Result<readonly ContrastReport[], ContrastValidationError>,
): readonly ContrastReport[] {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error(`Expected Ok, got Err: ${JSON.stringify(result.error)}`);
  }

  return result.value;
}

describe('buildOakDesignTokensCss', () => {
  it('emits light and dark theme selectors', () => {
    const css = buildOakDesignTokensCss();

    expect(css).toContain(':root {');
    expect(css).toContain("[data-theme='dark'] {");
  });

  it('keeps palette variables out of the dark theme override block', () => {
    const css = buildOakDesignTokensCss();
    const darkBlock = css.split("[data-theme='dark'] {")[1] ?? '';

    expect(darkBlock).toContain('--oak-semantic-surface-page:');
    expect(darkBlock).not.toContain('--oak-color-');
  });
});

describe('buildContrastReports', () => {
  it('returns reports for both light and dark themes', () => {
    const reports = assertOkReports(buildContrastReports());

    expect(reports).toHaveLength(2);
    expect(reports[0].theme).toBe('light');
    expect(reports[1].theme).toBe('dark');
  });

  it('produces entries for every pairing in the manifest', () => {
    const reports = assertOkReports(buildContrastReports());

    for (const report of reports) {
      expect(report.summary.total).toBeGreaterThan(0);
      expect(report.results.length).toBe(report.summary.total);
    }
  });

  it('includes resolved hex values in every entry', () => {
    const reports = assertOkReports(buildContrastReports());

    for (const report of reports) {
      expect(report.results.length).toBeGreaterThan(0);

      for (const entry of report.results) {
        expect(entry.foregroundHex).toMatch(/^#[0-9a-f]{6}$/iu);
        expect(entry.backgroundHex).toMatch(/^#[0-9a-f]{6}$/iu);
        expect(entry.ratio).toBeGreaterThan(0);
      }
    }
  });

  it('passes focus ring contrast in light theme at 3:1 or above', () => {
    const reports = assertOkReports(buildContrastReports());
    const lightReport = reports[0];

    expect(lightReport).toBeDefined();

    const focusRingOnPage = lightReport.results.find(
      (entry) =>
        entry.foreground === 'semantic.focus-ring' && entry.background === 'semantic.surface-page',
    );

    if (focusRingOnPage === undefined) {
      throw new Error('focus-ring on surface-page pairing not found in light report');
    }

    expect(focusRingOnPage.pass).toBe(true);
    expect(focusRingOnPage.ratio).toBeGreaterThanOrEqual(3);
  });

  it('passes error contrast in dark theme at 4.5:1 or above', () => {
    const reports = assertOkReports(buildContrastReports());
    const darkReport = reports[1];

    expect(darkReport).toBeDefined();

    const errorOnDarkPage = darkReport.results.find(
      (entry) =>
        entry.foreground === 'semantic.error' && entry.background === 'semantic.surface-page',
    );

    if (errorOnDarkPage === undefined) {
      throw new Error('error on surface-page pairing not found in dark report');
    }

    expect(errorOnDarkPage.pass).toBe(true);
    expect(errorOnDarkPage.ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('passes every declared pairing in both themes', () => {
    const reports = assertOkReports(buildContrastReports());

    for (const report of reports) {
      for (const entry of report.results) {
        expect(
          entry.pass,
          `[${report.theme}] ${entry.foreground} on ${entry.background}: ${String(entry.ratio)}:1 (need ${String(entry.requiredRatio)}:1)`,
        ).toBe(true);
      }
    }
  });
});
