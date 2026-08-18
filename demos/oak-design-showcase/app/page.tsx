import Link from 'next/link';
import type { ReactElement } from 'react';

import { SiteFooter } from '../components/SiteFooter';

/** The two demonstration doors. Copy assembled from ratified sources —
 *  the switching door from the previous hero's ratified sentence, the
 *  composition door from the kit's page-type-scoping doc comment. */
function DemoDoors(): ReactElement {
  return (
    <div className="oak-container doors">
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
    </div>
  );
}

/**
 * The showcase landing (owner scope, 2026-08-13): says what the system
 * is and doors the two demonstrations — nothing else. The switchboard
 * lives at its own route; the component specimen sheet is purged. Copy
 * is assembled from ratified sources, never invented: the thesis from
 * the kit README, the switching door from the previous hero's ratified
 * sentence, the composition door from the kit's own page-type-scoping
 * doc comment. main carries NO tabindex (reading-flow subtree rule).
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
                This showcase demonstrates the system doing its job, live, in two ways.
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
