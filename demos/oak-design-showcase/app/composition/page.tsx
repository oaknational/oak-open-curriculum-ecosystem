import type { ReactElement } from 'react';

/**
 * The composition demonstration, v2 (owner spec 2026-08-18, replacing
 * the static three-map gallery wholesale): one embedded exhibit of
 * neutral region boxes, a parent layout control spanning four extremes
 * of the layout engine, and a light/dark ground — the same markup under
 * every map, visibly re-arranged by CSS alone. The exhibit and its maps
 * live at /composition/frame.
 */
import { ShowcaseBreadcrumbs } from '../../components/ShowcaseBreadcrumbs';

import { CompositionStage } from './CompositionStage';
import './composition.css';

export default function CompositionPage(): ReactElement {
  return (
    <div className="oak-canvas" data-page="composition-demo">
      <header className="oak-region oak-container comp-head">
        <ShowcaseBreadcrumbs trail={[{ label: 'Showcase', href: '/' }, { label: 'Composition' }]} />
        <div className="oak-cluster comp-head-line">
          <h1 className="oak-heading-6">One markup, many page structures</h1>
          <p className="oak-body-3 comp-lede">
            Eleven region boxes, rendered once, in one order — every arrangement below is a
            composition map re-pointing the kit&rsquo;s own layout engine, with the markup
            byte-identical throughout.
          </p>
        </div>
      </header>
      {/* No tabindex here, ever: a negative tabindex on a direct child of
          .oak-canvas excludes its whole subtree from sequential focus under
          reading-flow: grid-rows (the specimen's documented F01/F02
          keyboard blackout). data-region pins main to the canvas map's
          1fr main row instead of auto-placing into the masthead row. */}
      <main id="main" className="oak-main oak-region oak-container" data-region="main">
        <CompositionStage />
      </main>
    </div>
  );
}
