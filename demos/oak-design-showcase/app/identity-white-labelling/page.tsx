/**
 * The side-by-side page: the controlled experiment, all three identities
 * at once. Every frame loads the same specimen route — identical markup;
 * only `?brand=` changes which override sheet loads. Any difference on
 * screen is the token contract doing its job.
 *
 * Page chrome is ours (the owner's ruling frees it from the export); the
 * per-brand descriptions carry the export's words, which describe the
 * brands truly. Column data derives from the roster — no slug literals.
 */
import {
  BASE_IDENTITY,
  IDENTITIES,
  IDENTITY_LABELS,
  type IdentitySlug,
} from '../../components/useIdentity';
import { targetFragmentsFor, type TargetIdentity } from '../../lib/identities';

import { ScaledFrame } from './scaled-frame';
import './side-by-side.css';

/* Descriptions key by TARGET fragment, per the identity-naming ratchet:
 * a new tracked file never writes the outgoing slug, so the slug-to-
 * fragment mapping derives through lib/identities (pending slug found by
 * exclusion, unwrapped at module init so a drifted roster fails the
 * import — the zod-at-module-init precedent). */
const DESCRIPTIONS: Readonly<Record<TargetIdentity, string>> = {
  oak: "No override — the baseline contract, in Oak's own tokens.",
  pds: 'GDS visual design: black masthead + blue bar, 48px bold titles, action-green buttons with the hard bottom edge, blue underlined links, grey panels, 960px two-thirds/one-third grid — same markup.',
  emc2: 'Dark-first toy shelf, centred key items, diagonal gradients, angled bevelled shadows — same markup.',
};

/* Total fallback (never a throw): a drifted roster renders identity columns
 * with empty descriptions — visibly degraded, never a crashed page. The
 * roster-drift boundary itself fails loud where it lives:
 * lib/identities.ts and its unit tests. */
const fragmentsResult = targetFragmentsFor(IDENTITIES);
const FRAGMENTS: Readonly<Partial<Record<string, TargetIdentity>>> = fragmentsResult.ok
  ? fragmentsResult.value
  : {};

function descriptionFor(identity: IdentitySlug): string {
  const fragment = FRAGMENTS[identity];
  return fragment === undefined ? '' : DESCRIPTIONS[fragment];
}

function IdentityColumn({ identity }: { readonly identity: IdentitySlug }): React.JSX.Element {
  const query = identity === BASE_IDENTITY ? '' : `?brand=${identity}`;
  const href = `/identity-switchboard/specimen${query}`;
  return (
    <section className="col">
      <h2 className="oak-heading-5 col-title">
        {IDENTITY_LABELS[identity]}{' '}
        <code className="col-code">{query === '' ? 'baseline' : query}</code>
      </h2>
      <p className="oak-body-3 col-desc">{descriptionFor(identity)}</p>
      <ScaledFrame src={href} title={`Specimen — ${IDENTITY_LABELS[identity]}`} />
      <a className="oak-link oak-body-2" href={href} target="_blank" rel="noreferrer">
        Open full page ↗
      </a>
    </section>
  );
}

export default function IdentityWhiteLabellingPage(): React.JSX.Element {
  return (
    <div className="oak-canvas oak-scope" data-page="side-by-side">
      <header className="oak-region oak-container page-head">
        <h1 className="oak-heading-4 m0">The controlled experiment — one page, three brands</h1>
        <p className="oak-body-1 page-lede">
          Every frame below renders the same specimen route — a full application page: utility bar,
          sticky header with search, subject hero, faceted unit browser, lesson detail, downloads
          table, FAQ, newsletter, multi-column footer. The markup is identical; only{' '}
          <code>?brand=</code> changes which override sheet loads. Any difference you see is the
          token contract doing its job.
        </p>
        <nav className="oak-cluster oak-cluster--l page-nav" aria-label="Demo pages">
          <a className="oak-link oak-body-2" href="/identity-switchboard">
            Identity switchboard (one copy, live controls) →
          </a>
        </nav>
      </header>
      {/* No tabindex here, ever: a negative tabindex on a direct child of
          .oak-canvas excludes its whole subtree from sequential focus under
          reading-flow: grid-rows (the specimen's documented F01/F02
          keyboard blackout). data-region pins main to the canvas map's
          1fr main row instead of auto-placing into the masthead row. */}
      <main id="main" className="oak-region oak-container cols" data-region="main">
        {IDENTITIES.map((identity) => (
          <IdentityColumn key={identity} identity={identity} />
        ))}
      </main>
    </div>
  );
}
