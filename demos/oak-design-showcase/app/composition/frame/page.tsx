/**
 * The composition exhibit (owner spec 2026-08-18): the full canonical
 * region inventory as neutral labelled boxes on a plain ground — nothing
 * on this page is an identity, a colour story, or content; it is REGIONS,
 * so the only thing the eye can read is where the layout engine puts
 * them. Four `data-layout` maps in this route's own stylesheet move the
 * boxes to the engine's extremes with the markup below byte-identical
 * under every one — the parent page drives `data-layout` and
 * `data-theme` (light/dark only) on the canvas in place, and a direct
 * visit reads them from the query for a correct first paint.
 */
import { escapeInlineScript } from '../../../lib/inline-script';

import { ExhibitThemeApplier } from './ExhibitThemeApplier';
import { LAYOUT_DESCRIPTIONS, layoutTitle, resolveLayout, resolveExhibitTheme } from './layouts';

import './frame.css';

const REGIONS = [
  'hero',
  'navigation',
  'featured',
  'facets',
  'results',
  'detail',
  'content',
  'context',
  'resources',
  'support',
  'cta',
] as const;

export default async function CompositionFramePage({
  searchParams,
}: {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const layout = resolveLayout(params['layout']);
  const theme = resolveExhibitTheme(params['theme']);

  return (
    <div className="oak-canvas oak-scope comp-frame" data-layout={layout} data-composition-frame="">
      {/* Pre-paint: the root bootstrap has already painted any persisted or
          OS theme; the exhibit's own ground must win BEFORE first paint (the
          route's first-paint contract). Values come from closed unions — the
          resolvers above — never raw query text. The applier below then owns
          live updates after hydration. */}
      <script
        dangerouslySetInnerHTML={{
          __html: escapeInlineScript(
            `document.documentElement.dataset.theme=${JSON.stringify(theme)};`,
          ),
        }}
      />
      <ExhibitThemeApplier theme={theme} />
      {/* The parent stage keeps BOTH of these text nodes live when it
          switches maps in place (data-composition-title / -description are
          its hooks) — a mutated data-layout without the matching text would
          leave assistive technology hearing the previous arrangement. */}
      <h1 className="oak-visually-hidden" data-composition-title="">
        {layoutTitle(layout)}
      </h1>
      <p className="oak-visually-hidden" data-composition-description="">
        {LAYOUT_DESCRIPTIONS[layout]}
      </p>
      <main className="oak-main oak-region" data-region="main">
        {REGIONS.map((region) => (
          <section
            key={region}
            className="oak-region comp-box"
            data-region={region}
            aria-label={`${region} region`}
          >
            <p className="oak-body-3 comp-box-label">{region}</p>
          </section>
        ))}
      </main>
    </div>
  );
}
