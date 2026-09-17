/**
 * The side-by-side page: the controlled experiment, every identity at
 * once. Every frame loads the same specimen route — identical markup;
 * only `?brand=` changes which override sheet loads. Any difference on
 * screen is the token contract doing its job.
 *
 * The frames carry no controls of their own; the parent's theme and
 * width controls govern every column at once (owner word 2026-08-18) —
 * that split is the experiment's control variable made literal. Column
 * data derives from the roster — no slug literals; the per-identity
 * blurbs are the shared IDENTITY_BLURBS.
 */
import { ShowcaseBreadcrumbs } from '../../components/ShowcaseBreadcrumbs';

import { SideBySideStage } from './SideBySideStage';
import './side-by-side.css';

export default function IdentityWhiteLabellingPage(): React.JSX.Element {
  return (
    <div className="oak-canvas oak-scope" data-page="side-by-side">
      <header className="oak-region oak-container page-head">
        <ShowcaseBreadcrumbs
          trail={[{ label: 'Showcase', href: '/' }, { label: 'Side by side' }]}
        />
        <h1 className="oak-heading-4 m0">The controlled experiment — one page, every identity</h1>
        <p className="oak-body-1 page-lede">
          Every frame below renders the same specimen route — a full application page: utility bar,
          sticky header with search, subject hero, faceted unit browser, lesson detail, downloads
          table, FAQ, newsletter, multi-column footer. The markup is identical; only{' '}
          <code>?brand=</code> changes which override sheet loads. Any difference you see is the
          token contract doing its job. The theme and width controls govern every column at once.
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
      <main id="main" className="oak-region oak-container" data-region="main">
        <SideBySideStage />
      </main>
    </div>
  );
}
