import Link from 'next/link';
import type { ReactElement } from 'react';

import { SiteFooter } from '../components/SiteFooter';

/** The demonstration doors — every demo surface is linked from the front
 *  door (owner word 2026-08-18). Copy assembled from ratified sources,
 *  never invented: the switching door from the previous hero's ratified
 *  sentence, the composition door from the kit's page-type-scoping doc
 *  comment, the side-by-side door from that page's own lede, the token
 *  door from the token page's own intro. */
function DemoDoors(): ReactElement {
  return (
    <div className="oak-container doors">
      <article className="oak-card oak-stack door">
        <h2 className="oak-heading-4">One page, side by side</h2>
        <p className="oak-body-2">
          Every frame renders the same specimen page &mdash; only the identity sheet changes. Any
          difference you see is the token contract doing its job.
        </p>
        <Link className="oak-btn door-btn" href="/identity-white-labelling">
          Open the side-by-side demo
        </Link>
      </article>
      <article className="oak-card oak-stack door">
        <h2 className="oak-heading-4">Identity and theme switching</h2>
        <p className="oak-body-2">
          One page of markup, many faces. Switch the identity and the theme live &mdash; the tokens
          carry every change, and the markup never changes.
        </p>
        <Link className="oak-btn door-btn" href="/identity-switchboard">
          Open the switching demo
        </Link>
      </article>
      <article className="oak-card oak-stack door">
        <h2 className="oak-heading-4">One markup, many page structures</h2>
        <p className="oak-body-2">
          The kit ships page-type composition maps. The same regions, the same markup, recomposed
          into different page shapes entirely in CSS.
        </p>
        <Link className="oak-btn door-btn" href="/composition">
          Open the composition demo
        </Link>
      </article>
      <article className="oak-card oak-stack door">
        <h2 className="oak-heading-4">Token reference</h2>
        <p className="oak-body-2">
          Every token the system publishes, shown as the value it has right now &mdash; each swatch
          painted through the token itself, switching with the identity and theme through the
          cascade.
        </p>
        <Link className="oak-btn door-btn" href="/tokens">
          Open the token reference
        </Link>
      </article>
    </div>
  );
}

/**
 * The showcase landing (owner scope, 2026-08-13; doors widened at owner
 * word 2026-08-18): says what the system is and doors the demonstrations
 * — nothing else. The switchboard lives at its own route; the component
 * specimen sheet is purged. Copy is assembled from ratified sources,
 * never invented (per-door sources in the DemoDoors comment). main
 * carries NO tabindex (reading-flow subtree rule).
 */
export default function ShowcasePage(): ReactElement {
  return (
    <div className="oak-canvas" data-page="home">
      <header className="oak-region mast" data-region="masthead">
        <div className="oak-container oak-cluster mast-inner">
          <span className="oak-heading-6 brand-name">Oak Open Curriculum Design System</span>
        </div>
      </header>
      <main className="oak-main oak-region" data-region="main">
        <section className="oak-region" data-region="hero">
          <div className="oak-band hero-band">
            <div className="oak-container hero-inner">
              <h1 className="oak-heading-1">Oak Open Curriculum Design System</h1>
              <p className="oak-body-1">
                A design system that makes anything feel unmistakably Oak &mdash; warm pastels,
                thick black borders, the signature lemon offset-shadow, Lexend. Built to WCAG 2.2
                AA, fully themable, no network dependencies.
              </p>
              <p className="oak-body-1">
                This showcase demonstrates the system doing its job, live.
              </p>
            </div>
          </div>
        </section>
        <section className="oak-region" data-region="featured" aria-label="Demonstrations">
          <DemoDoors />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
