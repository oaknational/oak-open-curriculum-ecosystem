import Link from 'next/link';
import type { ReactElement } from 'react';

import { ShowcaseBreadcrumbs } from '../../components/ShowcaseBreadcrumbs';
import { SiteFooter } from '../../components/SiteFooter';

import { CatalogueNote } from './CatalogueNote';
import { TokenReference } from './TokenReference';
import type { Catalogue } from './token-catalogue';
import { groupByCraftArea } from './token-groups';
import { TREE_COUNT, loadCatalogue, loadIdentityDeltas } from './token-source';
import { TOKEN_VARS_HREF } from './token-vars';

import './tokens.css';

/**
 * The token reference: every token the design system publishes, shown as the
 * value it currently has.
 *
 * This is the switchboard's claim made at data level. There, one rendered
 * page takes every identity without its markup changing; here, four hundred
 * values change under a control while the page stays exactly the same page.
 * Each swatch is painted through `var(--the-token)`, so the switch is the
 * cascade doing its job, not a re-render pretending to be one.
 *
 * WHAT IS BUILT AND WHAT IS LIVE. The catalogue is built at BUILD time from
 * the kit's DTCG export and the served identity sheets: names, tiers,
 * families, and which identity re-points what. The VALUES are read at RUN
 * time out of the browser's own computed style. Neither could stand in for
 * the other — a value baked at build time would be a claim about the cascade
 * rather than a reading of it.
 *
 * NO `?brand=` HERE, DELIBERATELY, and this is the one place the page departs
 * from the specimen route it otherwise follows. The specimen is
 * query-addressable: its URL IS its identity, it renders the sheet link
 * server-side, and it carries no control that could disagree. This page's
 * identity is a live control, and the binder serving it owns its own link
 * element by design (`brand-identity-binding.ts`). A server-rendered sheet
 * would be a second link the binder neither owns nor removes, so the first
 * switch away would leave the old identity still winning the cascade. First
 * paint is correct here by a simpler construction: the page opens at the
 * base identity, which is exactly what the control reports.
 *
 * THE SKIP LINK SITS BEFORE THE CANVAS, never inside it: the kit's
 * reading-flow enhancement on `.oak-canvas` sorts an area-less absolutely
 * positioned child to the END of sequential navigation, which is the inverse
 * of a skip link's job (a first-hand finding on the specimen route). It
 * targets a headline inside `main` rather than `main` itself, because a
 * negative tabindex on a direct child of `.oak-canvas` drops that whole
 * subtree out of the tab order under reading-flow.
 */
export const metadata = {
  title: 'Token reference — Oak Open Curriculum Design System',
  description:
    'Every design token the system publishes, shown as the value it currently resolves to, live across identities and themes.',
};

/**
 * The page's own introduction — and the only explanatory prose on it.
 *
 * Everything a reader needs to read the tables is here, at the top: what
 * they are looking at, and what the word the badges use actually means.
 * "Re-pointed" is the page's one piece of jargon, so it is defined where it
 * is first met rather than assumed; a reader who does not know it cannot
 * read the last column, and a definition four hundred rows below the first
 * badge is a definition nobody finds.
 */
function TokensIntro({
  catalogue,
  treeCount,
}: {
  readonly catalogue: Catalogue;
  readonly treeCount: number;
}): ReactElement {
  return (
    <>
      <ShowcaseBreadcrumbs trail={[{ label: 'Showcase', href: '/' }, { label: 'Tokens' }]} />
      <h1 className="oak-heading-3" id="tokens-headline">
        Token reference
      </h1>
      <p className="oak-body-2 tok-lede">
        Every design decision the system publishes, as the value it resolves to right now. Each
        swatch is a real element painted through the token itself, so switching identity or theme
        changes what you see here exactly the way it changes a product page &mdash; through the
        cascade, with no markup and no code in between.
      </p>
      <p className="oak-body-2 tok-lede">
        A token is <strong>re-pointed</strong> when an identity&rsquo;s own stylesheet re-declares
        it, giving it a value of that identity&rsquo;s rather than the one it inherits. The badges
        on each row name the identities that do that.{' '}
        <Link className="oak-link" href="/tokens/colours">
          See every colour under every identity and theme at once
        </Link>
        .
      </p>
      <CatalogueNote catalogue={catalogue} treeCount={treeCount} />
    </>
  );
}

export default function TokensPage(): ReactElement {
  const catalogue = loadCatalogue();

  return (
    <>
      {/* The per-token specimen bindings, linked in the server render so
          every swatch is painted at first paint rather than after one. */}
      <link rel="stylesheet" href={TOKEN_VARS_HREF} />
      <a className="oak-skip-link" href="#tokens-headline">
        Skip to content
      </a>
      <div className="oak-canvas" data-page="tokens">
        <header className="oak-region mast" data-region="masthead">
          <div className="oak-container oak-cluster mast-inner">
            <span className="oak-heading-6 brand-name">Oak Open Curriculum Design System</span>
          </div>
        </header>

        {/* The container rides on `main` itself, exactly as the picker
            route does. An `.oak-container` sitting inside `.oak-main` as a
            bare, region-less grid item does not take its track's width, and
            a page of token tables then pushes the whole document sideways
            at 320px — measured, and the reason this is not a plain
            wrapper. main carries NO tabindex: a negative one on a direct
            child of .oak-canvas drops its whole subtree out of sequential
            focus under reading-flow. */}
        <main id="main" className="oak-main oak-region oak-container tok-page" data-region="main">
          <TokensIntro catalogue={catalogue} treeCount={TREE_COUNT} />
          <TokenReference
            groups={groupByCraftArea(catalogue.tokens)}
            deltas={loadIdentityDeltas()}
            tokenCount={catalogue.tokens.length}
          />
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
