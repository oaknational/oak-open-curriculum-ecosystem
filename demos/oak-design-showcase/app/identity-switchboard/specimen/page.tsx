/**
 * The white-label specimen: one composition, re-skinned by a query parameter.
 *
 * Identity is QUERY-ADDRESSABLE and applied SERVER-SIDE. The route reads
 * `?brand=`, narrows it through the closed `IDENTITIES` list, and renders the
 * brand stylesheet link into the document React hoists to `<head>`. The sheet
 * is therefore present in the initial HTML, so the brand is correct at first
 * paint by construction — there is no flash to suppress rather than a flash
 * suppressed by script. That also mirrors how the kit says production applies
 * identity (`consuming-nextjs.md` §5: one static sheet per tenant, no client
 * logic), which matters for a page whose whole claim is that presentation is
 * data.
 *
 * Slugs are never re-typed here: every identity name derives from the imported
 * constant, which is what keeps the identity-naming ratchet at zero delta in a
 * new file while a rename is in flight.
 *
 * The full ten-region inventory is composed here (utility, masthead, hero,
 * facets, results, detail, resources, support, cta, footer). Each region is
 * a pure presentational function over design-system classes; the app-local
 * class names carry layout only, in `specimen.css`, tokens-only.
 */
import { BASE_IDENTITY, resolveIdentity, type IdentitySlug } from '../../../components/useIdentity';

import { DetailRegion } from './detail';
import { FacetsRegion } from './facets';
import { StripControls } from './StripControls';
import { FooterRegion } from './footer';
import { HeroRegion } from './hero';
import { ResourcesRegion } from './resources';
import { ResultsRegion } from './results';
import { CtaRegion, SupportRegion } from './support';
import './specimen.css';

/** The strip carries the page's REAL controls (owner word 2026-08-18): the
 *  earlier decorative audience switcher and help-centre link never did
 *  anything, so their space now holds small identity radios and the theme
 *  select — a deliberate divergence from the export reference, carried in
 *  the fidelity register. */
function UtilityRegion({ identity }: { readonly identity: IdentitySlug }): React.JSX.Element {
  return (
    <div className="oak-region util" data-region="utility">
      <div className="oak-container oak-cluster oak-cluster--s util-inner">
        <StripControls initialIdentity={identity} />
      </div>
    </div>
  );
}

function SiteNav(): React.JSX.Element {
  // The auto margin lives on the flex CHILD (the nav element), not the list
  // inside it — that is what gathers nav + search + sign-in right.
  return (
    <nav aria-label="Main" className="site-nav">
      <ul className="oak-cluster oak-cluster--s nav-list">
        <li>
          <a className="oak-link oak-body-2" href="#browse">
            Subjects
          </a>
        </li>
        <li>
          <a className="oak-link oak-body-2" href="#browse">
            Units
          </a>
        </li>
        <li>
          <a className="oak-link oak-body-2" href="#lesson">
            Lessons
          </a>
        </li>
        <li>
          <a className="oak-link oak-body-2" href="#resources">
            Guidance
          </a>
        </li>
        <li>
          <a className="oak-link oak-body-2" href="#support">
            Support
          </a>
        </li>
      </ul>
    </nav>
  );
}

function MastheadRegion(): React.JSX.Element {
  return (
    <header className="oak-region mast" data-region="masthead">
      <div className="oak-container oak-cluster mast-inner">
        <span className="oak-heading-6 brand-name">The learning service</span>
        <SiteNav />
        <search className="oak-cluster oak-cluster--s site-search">
          <label className="oak-visually-hidden" htmlFor="site-q">
            Search
          </label>
          <input className="oak-input" id="site-q" type="search" placeholder="Search lessons…" />
          <button className="oak-btn oak-btn--sm oak-btn--secondary" type="button">
            <span className="oak-icon--mask ic-search icon-s" aria-hidden="true" />
            {'Search'}
          </button>
        </search>
        <button className="oak-btn oak-btn--sm" type="button">
          Sign in
        </button>
      </div>
    </header>
  );
}

/** The server-rendered brand sheet. data-oak-brand marks it for
 *  client-side ADOPTION: the strip's binder takes ownership at mount so a
 *  later switch manages this link instead of stranding it beneath every
 *  hook-created sheet. The applied marker rides from the server because
 *  this sheet IS the applied identity at first paint — observers key on
 *  it. */
function ServerBrandSheet({
  identity,
}: {
  readonly identity: IdentitySlug;
}): React.JSX.Element | null {
  if (identity === BASE_IDENTITY) {
    return null;
  }
  return (
    <link
      rel="stylesheet"
      data-oak-brand={identity}
      data-oak-brand-applied=""
      href={`/brands/${identity}/brand.css`}
    />
  );
}

export default async function SpecimenPage({
  searchParams,
}: {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const identity = resolveIdentity(params['brand']);
  // Exhibit mode (`?controls=none`): the side-by-side page frames this route
  // three-up with the PARENT owning theme and width, so the strip's own
  // controls would be noise repeated per frame (owner word 2026-08-18).
  const showControls = params['controls'] !== 'none';

  return (
    <>
      <ServerBrandSheet identity={identity} />
      {/* The skip link sits BEFORE the canvas, not inside it: the kit's
          reading-flow: grid-rows enhancement on .oak-canvas sorts an
          absolutely-positioned, area-less child to the END of sequential
          navigation — the exact inverse of a skip link's job (found by this
          route's red keyboard cell; trunk cure routed to the DS slice as a
          reading-order pin on .oak-skip-link). */}
      <a className="oak-skip-link" href="#specimen-headline">
        Skip to content
      </a>
      {/* oak-scope arms the kit's element-level typography; data-page="unit"
          selects the page-type map whose named areas ARE this specimen's
          region inventory (hero/facets/results/detail/resources/support/cta)
          — without it, main has no grid. main carries NO tabindex: a
          negative tabindex on a reading-flow item (main is a direct child
          of .oak-canvas) excludes its whole subtree from sequential focus
          under the agreed CSSWG/WHATNOT scoping model — the F01/F02
          keyboard blackout. The skip link therefore targets the hero
          headline (inside a region, reading-flow-safe), per WCAG G1:
          focus must LAND, and never at the cost of the Tab order. Never
          put a negative tabindex on a direct child of .oak-canvas or
          .oak-main. */}
      {/* data-controls lets CSS zero the mast's strip-height sticky offset
          when no strip renders (round 3 — the side-by-side frames). */}
      <div
        className="oak-canvas oak-scope"
        data-page="unit"
        data-identity={identity}
        data-controls={showControls ? undefined : 'none'}
      >
        {showControls ? <UtilityRegion identity={identity} /> : null}
        <SpecimenBody />
      </div>
    </>
  );
}

function SpecimenBody(): React.JSX.Element {
  return (
    <>
      <MastheadRegion />
      <main id="main" className="oak-main oak-region" data-region="main">
        <HeroRegion />
        <FacetsRegion />
        <ResultsRegion />
        <DetailRegion />
        <ResourcesRegion />
        <SupportRegion />
        <CtaRegion />
      </main>
      <FooterRegion />
    </>
  );
}
