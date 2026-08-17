import Link from 'next/link';
import type { ReactElement } from 'react';

/**
 * The composition demonstration (owner scope, 2026-08-13): page
 * structure maximally configurable via CSS with the markup unchanged.
 * The kit ships page-type composition maps under [data-page] — grid
 * area assignments only, no markup knowledge. This page renders the
 * IDENTICAL region markup once per shipped map (unit, home, proof);
 * every structural difference on screen is the map alone. Regions a
 * map does not name fall to the grid's implicit rows — that is part
 * of the contract, shown rather than hidden.
 */

const SHIPPED_MAPS = ['unit', 'home', 'proof'] as const;

/** The union of region names across the shipped maps — one fragment,
 *  rendered identically under every map. */
const REGIONS = [
  'hero',
  'featured',
  'facets',
  'results',
  'content',
  'detail',
  'resources',
  'support',
  'context',
  'cta',
] as const;

function RegionStubs(): ReactElement {
  return (
    <>
      {REGIONS.map((region) => (
        <section
          key={region}
          className={`oak-region comp-stub comp-stub--${region}`}
          data-region={region}
          aria-label={`${region} region`}
        >
          <span className="oak-body-3 comp-stub-label">{region}</span>
        </section>
      ))}
    </>
  );
}

export default function CompositionPage(): ReactElement {
  return (
    <div className="oak-canvas" data-page="home">
      <header className="oak-region mast" data-region="masthead">
        <div className="oak-container oak-cluster mast-inner">
          <span className="oak-heading-6 brand-name">Oak Open Curriculum Design System</span>
        </div>
      </header>
      <main className="oak-main oak-region" data-region="main">
        <section className="oak-region" data-region="hero">
          <div className="oak-container hero-inner">
            <h1 className="oak-heading-2">One markup, many page structures</h1>
            <p className="oak-body-1">
              Each block below renders the identical markup &mdash; the same regions in the same
              order. Only the <code>data-page</code> attribute differs, selecting one of the
              kit&rsquo;s shipped composition maps. Every structural difference you see is CSS.
            </p>
          </div>
        </section>
        <section className="oak-region" data-region="content">
          <div className="oak-container oak-stack oak-stack--l">
            {SHIPPED_MAPS.map((map) => (
              <article key={map} className="comp-exhibit oak-stack">
                <h2 className="oak-heading-5">
                  <code>data-page=&quot;{map}&quot;</code>
                </h2>
                <div className="comp-stage">
                  <div className="oak-canvas" data-page={map}>
                    <div className="oak-main oak-region comp-main" data-region="main">
                      <RegionStubs />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="oak-region foot" data-region="footer">
        <div className="oak-container foot-inner">
          <p className="oak-body-3">
            <Link className="oak-link" href="/">
              Back to the showcase
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
