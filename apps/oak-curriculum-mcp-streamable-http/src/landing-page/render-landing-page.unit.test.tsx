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
import { OAK_DS_BASE, SHARE_IMAGE_PATH } from './components/design-system-refs.js';
import { ROUTED_ASSET_BASE } from '../app/static-asset-paths.js';
import { renderLandingPageHtml } from './render-landing-page.js';

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

    it('names the canonical host over the deployment host, so the origin never leaks', () => {
      // The edge-served shape: clients reach the canonical address while the
      // deployment only knows its own Vercel hostname. The baked page must
      // describe the address clients actually use — the same rule the
      // request-path metadata surfaces follow (MCP-351).
      const behindEdge = renderLandingPageHtml({
        vercelHost: 'origin-only.vercel.app',
        canonicalHost: 'mcp.thenational.academy',
      });

      expect(behindEdge).toContain('https://mcp.thenational.academy/mcp');
      expect(behindEdge).toContain('rel="canonical" href="https://mcp.thenational.academy"');
      expect(behindEdge).not.toContain('origin-only.vercel.app');
    });
  });

  describe('asset posture', () => {
    it('loads the design system from the app-served copy', () => {
      // Routed-base-prefixed since MCP-509: the page is served under `/mcp`,
      // and a path-scoped edge forwards only `/mcp*`, so the prefixed form
      // is the one that works wherever the page is served.
      expect(html).toContain(`<link rel="stylesheet" href="${OAK_DS_BASE}/styles.css"/>`);
    });

    it('keeps the page stylesheet after the system stylesheet, unmanaged by React', () => {
      // The cascade order is load-bearing (the page layer composes on top of
      // the system's classes) and holds only because NEITHER link carries
      // React's `precedence` prop — with it, React hoists the stylesheet
      // into its managed precedence group and silently inverts the order.
      const systemPos = html.indexOf(`href="${OAK_DS_BASE}/styles.css"`);
      const pagePos = html.indexOf(`href="${ROUTED_ASSET_BASE}/landing-page.css"`);

      expect(systemPos).toBeGreaterThan(-1);
      expect(pagePos).toBeGreaterThan(systemPos);
      expect(html).not.toContain('data-precedence');
    });

    it('imports no webfont and hotlinks no third-party asset', () => {
      expect(html).not.toContain('fonts.googleapis.com');
      expect(html).not.toContain('fonts.gstatic.com');
      expect(html).not.toContain('res.cloudinary.com');
    });

    it('takes its logo and rule artwork from the design system, routed-base-prefixed', () => {
      // Asserted as whole attribute values, not substrings. Bare-path
      // substrings matched the pre-MCP-509 root-relative markup AND the
      // routed markup identically, so these two assertions sat inside the
      // green-while-broken surface while every other assertion in this file
      // was moved onto the routed base.
      expect(html).toContain(`src="${OAK_DS_BASE}/assets/logo-full-black.svg"`);
      expect(html).toContain(`src="${OAK_DS_BASE}/assets/icons/header-underline.svg"`);
    });
  });

  describe('theme', () => {
    it('declares light explicitly as the default', () => {
      expect(html).toContain('<html lang="en-GB" data-theme="light">');
    });

    it('ships no theme control and no theme-switching script', () => {
      // oak-theme.js auto-applies high-contrast when the OS asks for more
      // contrast. Without a control that strands the visitor on a theme the
      // page never offered and they cannot leave, so machinery and
      // affordance ship together (ADR-217 §5) — and this page ships neither.
      expect(html).not.toContain('id="theme-control"');
      expect(html).not.toContain('Colour theme');
      expect(html).not.toContain('oak-theme.js');
      expect(html).not.toContain('/landing-page.js');
      // Categorical, not enumerated: any script — an inline snippet, a
      // differently-named bundle — is machinery this page must not ship.
      expect(html).not.toContain('<script');
    });
  });

  describe('accessibility structure', () => {
    it('opens with a skip link to a focusable main landmark', () => {
      expect(html).toContain('class="oak-skip-link" href="#main"');
      expect(html).toContain('id="main"');
      // tabindex="-1": WebKit does not move sequential focus to a
      // non-focusable fragment target, so without it the skip link skips
      // nothing in Safari.
      expect(html).toMatch(/<main[^>]*tabindex="-1"/);
    });

    it('names the main landmark by an id that exists', () => {
      // aria-labelledby and the h1 id are a cross-component pair with no
      // shared constant — a rename on either side silently unlabels the
      // landmark, so the pair is asserted here.
      const labelledBy = /<main[^>]*aria-labelledby="([^"]+)"/.exec(html)?.[1];

      expect(labelledBy).toBeDefined();
      expect(html).toContain(`id="${labelledBy ?? ''}"`);
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
    it('composes the hero from exactly two fragments around the terms link', () => {
      // The hero splits the owner's sentence on the link text. A copy edit
      // that removes the phrase (one fragment) or repeats it (three) would
      // silently truncate or distort the rendered sentence — this states
      // the invariant the composition depends on, where a failure names it.
      expect(PAGE_DESCRIPTION.split('openly licensed')).toHaveLength(2);
    });

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
      // Absolute AND routed-base-prefixed: a crawler fetching the card image
      // hits the canonical host from outside, so it needs both halves right.
      expect(deployed).toContain(
        `property="og:image" content="https://mcp.example.test${SHARE_IMAGE_PATH}"`,
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
