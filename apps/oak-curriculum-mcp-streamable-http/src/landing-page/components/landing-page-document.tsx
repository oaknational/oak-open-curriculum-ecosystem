/**
 * The complete landing-page document.
 *
 * @remarks
 * Renders the whole `<html>` element so the head, the pre-paint theme
 * script, and the body are one tree with one set of invariants rather than a
 * template string spliced around a component.
 *
 * The theme posture: the page declares `data-theme="light"` and ships the
 * design system's theme script ONLY alongside the theme control. The script
 * is the control's machinery — it also auto-applies `high-contrast` when the
 * visitor's OS asks for more contrast, which without a control leaves them on
 * a theme the page never offered and they cannot leave. Machinery and
 * affordance therefore ship together: no control, no switching, and the page
 * is the ratified light design for everyone.
 *
 * Two ordering constraints in the head are load-bearing when the script IS
 * present:
 *
 * - `oak-theme.js` is synchronous, before the stylesheets, so a stored theme
 *   is on `<html>` before first paint (no flash of the wrong theme).
 * - `landing-page.css` follows `styles.css`, because the page layer
 *   composes on top of the system's classes.
 *
 * @packageDocumentation
 */

import type { JSX } from 'react';

import { OAK_DS_BASE, OAK_MINT } from './design-system-refs.js';
import { ConnectSection, DocumentationCard, PageHero } from './page-sections.js';
import { ResourcesSection } from './resources-section.js';
import { SiteFooter, SiteMasthead } from './site-chrome.js';
import { ToolsSection } from './tools-section.js';

export interface LandingPageDocumentProps {
  /** Deployment host used to derive the MCP endpoint URL. */
  readonly vercelHost?: string;
  /** App build identity, surfaced as metadata when the runtime knows it. */
  readonly appVersion?: string;
  /** Renders the masthead theme control when true (default false). */
  readonly themeSelectorEnabled?: boolean;
}

export function LandingPageDocument({
  vercelHost,
  appVersion,
  themeSelectorEnabled = false,
}: LandingPageDocumentProps): JSX.Element {
  return (
    // Explicit rather than relying on the stylesheet's default: an explicit
    // choice also beats a polarity-flipped brand default, so the page is
    // light under any brand layer a consumer adds later.
    <html lang="en-GB" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Oak Curriculum MCP (HTTP)</title>
        {/* `--oak-mint`, the hero band's fill. A <meta> cannot take var(), so
            this is the one literal on the page — but its provenance is not
            guesswork: it is the design system's `colour.mint` DTCG token, and
            a test holds the two equal so the value cannot drift silently.
            Single-valued because only the light theme ships; a theme-aware
            pair would need `media` variants, which is work for the change that
            makes the other themes reachable. */}
        <meta name="theme-color" content={OAK_MINT} />
        {appVersion !== undefined && <meta name="app-version" content={appVersion} />}
        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        {themeSelectorEnabled && <script src={`${OAK_DS_BASE}/oak-theme.js`} />}
        <link rel="stylesheet" href={`${OAK_DS_BASE}/styles.css`} />
        <link rel="stylesheet" href="/landing-page.css" />
        {themeSelectorEnabled && <script src="/landing-page.js" defer />}
      </head>
      <body className="oak-scope">
        <div className="oak-canvas" data-page="home">
          <SiteMasthead themeSelectorEnabled={themeSelectorEnabled} />
          <main data-region="main" className="oak-main" id="main" aria-labelledby="title">
            <PageHero />
            <section data-region="content">
              <div className="oak-band band-lemon">
                <div className="oak-container">
                  <ConnectSection vercelHost={vercelHost} />
                </div>
              </div>
              <div className="oak-container oak-stack">
                <ResourcesSection />
                <ToolsSection />
                <DocumentationCard />
              </div>
            </section>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
