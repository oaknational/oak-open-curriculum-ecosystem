/**
 * Whole-document invariants for the rendered landing page.
 *
 * The section-level behaviour is proven beside each component; this suite
 * covers what only the assembled document can show — the document shell, the
 * derivation invariants that must survive the design (host-derived endpoint,
 * served-surface filter), and the asset/font posture the page is required to
 * hold.
 */
import { describe, expect, it } from 'vitest';

import { renderLandingPageHtml } from './render-landing-page.js';
import { THEME_OPTIONS } from './components/site-chrome.js';

describe('renderLandingPageHtml', () => {
  const html = renderLandingPageHtml();

  it('emits a complete HTML document', () => {
    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('<html lang="en-GB"');
    expect(html.trimEnd().endsWith('</html>')).toBe(true);
  });

  it('adds the app version meta tag when app version identity is provided', () => {
    expect(renderLandingPageHtml({ appVersion: '0.0.0-test' })).toContain(
      '<meta name="app-version" content="0.0.0-test"/>',
    );
  });

  it('omits the app version meta tag when the runtime does not know it', () => {
    expect(html).not.toContain('name="app-version"');
  });

  describe('derivation invariants (never authored as static copy)', () => {
    it('derives the endpoint from the deployment host', () => {
      expect(renderLandingPageHtml({ vercelHost: 'example.vercel.app' })).toContain(
        'https://example.vercel.app/mcp',
      );
    });

    it('falls back to localhost when no host is known', () => {
      expect(html).toContain('http://localhost:3333/mcp');
    });

    it('never carries a hard-coded deployment hostname', () => {
      expect(html).not.toContain('curriculum-mcp-alpha');
    });
  });

  describe('asset posture', () => {
    it('loads the design system from the app-served copy', () => {
      expect(html).toContain('<link rel="stylesheet" href="/oak-ds/styles.css"/>');
    });

    it('applies the stored theme before first paint when the control ships', () => {
      // Synchronous (no `defer`/`async`) and ahead of the stylesheets, or the
      // page paints in the wrong theme before correcting itself.
      const withControl = renderLandingPageHtml({ themeSelectorEnabled: true });
      const themeScript = withControl.indexOf('<script src="/oak-ds/oak-theme.js"></script>');
      const stylesheet = withControl.indexOf('/oak-ds/styles.css');
      expect(themeScript).toBeGreaterThan(-1);
      expect(themeScript).toBeLessThan(stylesheet);
    });

    it('imports no webfont and hotlinks no third-party asset', () => {
      expect(html).not.toContain('fonts.googleapis.com');
      expect(html).not.toContain('fonts.gstatic.com');
      expect(html).not.toContain('res.cloudinary.com');
    });

    it('takes its logo and rule artwork from the design system', () => {
      expect(html).toContain('/oak-ds/assets/logo-full-black.svg');
      expect(html).toContain('/oak-ds/assets/icons/header-underline.svg');
    });
  });

  describe('theme', () => {
    const withControl = renderLandingPageHtml({ themeSelectorEnabled: true });

    it('declares light explicitly as the default', () => {
      expect(html).toContain('<html lang="en-GB" data-theme="light">');
    });

    it('hides the control by default', () => {
      expect(html).not.toContain('id="theme-control"');
      expect(html).not.toContain('Colour theme');
    });

    it('ships no theme-switching script when there is no control', () => {
      // oak-theme.js auto-applies high-contrast when the OS asks for more
      // contrast. Without a control that strands the visitor on a theme the
      // page never offered and they cannot leave, so machinery and
      // affordance ship together — or not at all.
      expect(html).not.toContain('oak-theme.js');
      expect(html).not.toContain('/landing-page.js');
    });

    it('ships both scripts when the deployment enables the control', () => {
      expect(withControl).toContain('id="theme-control"');
      expect(withControl).toContain('oak-theme.js');
      expect(withControl).toContain('/landing-page.js');
    });

    it('offers every theme the design system ships, including colour-safe', () => {
      for (const theme of THEME_OPTIONS) {
        expect(withControl, theme.value).toContain(`value="${theme.value}"`);
      }
      expect(withControl).toContain('value="colour-safe"');
    });
  });

  describe('accessibility structure', () => {
    it('opens with a skip link to the main landmark', () => {
      expect(html).toContain('class="oak-skip-link" href="#main"');
      expect(html).toContain('id="main"');
    });

    it('names both masthead navigation landmarks distinctly', () => {
      expect(html).toContain('aria-label="Oak site areas"');
      expect(html).toContain('aria-label="Site"');
    });

    it('does not mark an off-page link as the current page', () => {
      // The Teachers tab goes to a different site; aria-current="page" there
      // tells assistive tech the visitor is already on it.
      expect(html).not.toContain('aria-current="page" href="https://www.thenational.academy');
    });

    it('names the config snippet with a caption rather than a prohibited label', () => {
      expect(html).toContain('<figcaption class="oak-visually-hidden">');
      expect(html).not.toContain('<pre aria-label');
    });
  });
});
