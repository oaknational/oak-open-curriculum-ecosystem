/**
 * Unit tests for widget HTML startup validation.
 *
 * The validation function uses `existsSync` (side effect), so we inject
 * the check function as a parameter per ADR-078.
 */

import { describe, it, expect } from 'vitest';
import { validateWidgetHtmlExists } from './validate-widget-html.js';

describe('validateWidgetHtmlExists', () => {
  const fileMissing = (): boolean => false;
  const filePresent = (): boolean => true;

  it('throws with path and build guidance when the widget HTML file is missing', () => {
    const testPath = '/some/dist/oak-banner.html';

    expect(() => {
      validateWidgetHtmlExists(testPath, fileMissing);
    }).toThrow(/widget HTML.*not found/i);

    expect(() => {
      validateWidgetHtmlExists(testPath, fileMissing);
    }).toThrow(testPath);

    expect(() => {
      validateWidgetHtmlExists(testPath, fileMissing);
    }).toThrow(/pnpm build/);
  });

  it('does not throw when the widget HTML file exists', () => {
    expect(() => {
      validateWidgetHtmlExists('/exists/oak-banner.html', filePresent);
    }).not.toThrow();
  });
});
