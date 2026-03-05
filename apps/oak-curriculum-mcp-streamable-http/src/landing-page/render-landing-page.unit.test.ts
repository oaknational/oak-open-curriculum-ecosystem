/**
 * Unit tests for the landing page renderer.
 *
 * Verifies key documentation links that should be present in the static HTML.
 */

import { describe, expect, it } from 'vitest';

import { renderLandingPageHtml } from './render-landing-page.js';

describe('renderLandingPageHtml', () => {
  it('includes a link to the workspace code on GitHub', () => {
    const html = renderLandingPageHtml();

    expect(html).toContain('Code on GitHub');
    expect(html).toContain(
      'https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/main/apps/oak-curriculum-mcp-streamable-http',
    );
  });
});
