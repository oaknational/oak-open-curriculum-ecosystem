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

import { PAGE_DESCRIPTION } from './components/page-sections.js';
import { renderLandingPageHtml } from './render-landing-page.js';
import { THEME_OPTIONS } from './components/site-chrome.js';

/** React's escaping of text nodes, for comparing against rendered output. */
function htmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}

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

    it('gives the config snippet a role that may legitimately carry a name', () => {
      // A bare <pre> is role `generic`, which ARIA 1.2 forbids naming. The
      // explicit region role is what makes the label legal, so the two must
      // travel together — a label without the role is the prohibited shape.
      expect(html).toContain('role="region"');
      expect(html).toContain('aria-label="JSON configuration snippet"');
      expect(html).not.toMatch(/<pre(?![^>]*role=)[^>]*aria-label/);
    });

    it('makes the scrollable snippet reachable by keyboard', () => {
      // Below ~500px the snippet is a scroll container. Without a tabindex,
      // keyboard users outside Chromium cannot scroll it to read the endpoint.
      expect(html).toMatch(/<pre[^>]*tabindex="0"/);
    });
  });

  describe('share and search metadata', () => {
    it('shows the description as the hero sentence, wrapped around the link', () => {
      // The card's description and the visible sentence are one string: the
      // hero composes it around the terms link rather than restating it. So
      // the invariant is that the composition renders whole and in order —
      // there is no second copy left to drift.
      //
      // An earlier version of this test stripped tags out of the hero with a
      // regex so it could compare two copies. CodeQL flagged that as
      // incomplete sanitisation and was right to: a regex tag-stripper is
      // unsafe wherever it is pointed. Removing the duplication removed the
      // need for it.
      // Searched from the hero onward: the same words are in the <meta>
      // description in the head, so an unscoped search finds those first.
      const heroStart = html.indexOf('data-region="hero"');
      const [before = '', after = ''] = PAGE_DESCRIPTION.split('openly licensed');
      const beforePos = html.indexOf(htmlEscape(before), heroStart);
      const linkPos = html.indexOf('>openly licensed<', heroStart);
      const afterPos = html.indexOf(htmlEscape(after), linkPos);

      expect(heroStart, 'hero section not rendered').toBeGreaterThan(-1);
      expect(beforePos, 'hero opening not rendered').toBeGreaterThan(-1);
      expect(linkPos, 'terms link not rendered').toBeGreaterThan(beforePos);
      expect(afterPos, 'hero remainder not rendered').toBeGreaterThan(linkPos);
    });

    it('gives the card the same description the page displays', () => {
      expect(html).toContain(`name="description" content="${htmlEscape(PAGE_DESCRIPTION)}"`);
    });

    it('gives crawlers absolute URLs derived from the deployment', () => {
      // og:url and og:image are read with no page context, so a relative path
      // is simply dropped and the card renders bare.
      const deployed = renderLandingPageHtml({ vercelHost: 'mcp.example.test' });

      expect(deployed).toContain('property="og:url" content="https://mcp.example.test"');
      expect(deployed).toContain(
        'property="og:image" content="https://mcp.example.test/oak-assets/assets/oak-national-academy-logo-512.png"',
      );
      expect(deployed).toContain('rel="canonical" href="https://mcp.example.test"');
    });

    it('names the page identically in the tab and in a shared link', () => {
      const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];

      expect(title).toBeDefined();
      expect(html).toContain(`property="og:title" content="${title ?? ''}"`);
    });

    it('declares a card the square logo can actually fill', () => {
      // summary, not summary_large_image: the latter crops a 512 square badly.
      expect(html).toContain('name="twitter:card" content="summary"');
      expect(html).toContain('property="og:image:width" content="512"');
      expect(html).toContain('property="og:image:height" content="512"');
    });
  });
});
