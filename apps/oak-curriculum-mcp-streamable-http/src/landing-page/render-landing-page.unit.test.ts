import { describe, expect, it } from 'vitest';

import { renderLandingPageHtml } from './render-landing-page.js';

describe('renderLandingPageHtml', () => {
  it('adds the app version meta tag when app version identity is provided', () => {
    const html = renderLandingPageHtml(undefined, '0.0.0-test');

    expect(html).toContain('<meta name="app-version" content="0.0.0-test" />');
  });
});
