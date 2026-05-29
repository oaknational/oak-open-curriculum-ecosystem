import { describe, expect, it } from 'vitest';

import { renderLandingPageHtml } from './render-landing-page.js';
import { EEF_PROMPT_NAME, EEF_TOOL_NAME } from '../eef-surface.js';

describe('renderLandingPageHtml', () => {
  it('adds the app version meta tag when app version identity is provided', () => {
    const html = renderLandingPageHtml(undefined, '0.0.0-test');

    expect(html).toContain('<meta name="app-version" content="0.0.0-test" />');
  });

  it('omits both EEF surfaces from the page when the flag is off', () => {
    const html = renderLandingPageHtml(undefined, undefined, false);

    expect(html).not.toContain(EEF_TOOL_NAME);
    expect(html).not.toContain(EEF_PROMPT_NAME);
  });

  it('advertises both EEF surfaces on the page when the flag is on', () => {
    const html = renderLandingPageHtml(undefined, undefined, true);

    expect(html).toContain(EEF_TOOL_NAME);
    expect(html).toContain(EEF_PROMPT_NAME);
  });
});
