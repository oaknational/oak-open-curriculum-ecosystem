'use client';

/**
 * One family's tokens, as a flowing list of compact rows (name and
 * chips on the first line; the value on its own full-width line).
 *
 * Every specimen is a real element painted through `var(--the-token)`, so a
 * switch of identity or theme repaints the whole page through the cascade
 * with no re-render at all. What React adds is the TEXT of the value, which
 * the cascade cannot render. If this component's live read never arrived,
 * every swatch here would still be correct — only the printed numbers would
 * be stale. That is the right dependency direction for a page whose claim is
 * that presentation is data.
 *
 * TWO COLUMNS ARE THE NORM (owner ruling 2026-08-18): at monitor widths a
 * family's ROWS flow across two columns under a header that spans both.
 * The ROW is the fragmentation unit — a compact card that reads at a phone
 * width, proven by the narrow band — so rows split freely across columns,
 * families never clip, and no TOKEN CONTENT on this page scrolls inside
 * itself (the owner's everything-visible rule; the wide rail's capped
 * nav scroll is the one deliberate, owner-visible exception).
 *
 * LIST SEMANTICS AT EVERY WIDTH, BY DESIGN. No width renders these rows as
 * a table, so the markup does not claim one: each family is a
 * list, each token an item, and the two non-self-evident parts of a row
 * are named by per-row visually-hidden labels ("Value", "Re-pointed by")
 * at every width — there is no header row anywhere to defer to. A
 * headerless grid of hundreds of cells announced as a table would be worse
 * than this linear reading.
 */
import type { ReactElement } from 'react';

import type { IdentitySlug } from '../../components/useIdentity';
import { IdentityDeltaCell, Specimen, TokenName, TokenValue } from './TokenCells';
import { sectionId, type CraftArea } from './craft-areas';
import type { LiveValue, LiveValues } from './live-token-values';
import type { CatalogueToken } from './token-catalogue';

export type IdentityDeltaSets = ReadonlyMap<IdentitySlug, ReadonlySet<string>>;

function TokenRow({
  token,
  live,
  identity,
  deltas,
}: {
  readonly token: CatalogueToken;
  readonly live: LiveValue | undefined;
  readonly identity: IdentitySlug;
  readonly deltas: IdentityDeltaSets;
}): ReactElement {
  const value = live?.value ?? token.declared;
  const expression = live?.expression ?? token.declared;
  const owners = [...deltas]
    .filter(([, properties]) => properties.has(token.name))
    .map(([slug]) => slug);
  // The count rides on the row so the layout can drop the whole re-pointed
  // part for the three hundred tokens no identity touches, instead of
  // spending width on an em dash.
  return (
    <li className="tok-row" data-token={token.name} data-owners={owners.length}>
      <span className="tok-name">
        <TokenName token={token} />
      </span>
      <span className="tok-specimen">
        <Specimen token={token} />
      </span>
      <span className="tok-value">
        <span className="oak-visually-hidden">Value </span>
        <TokenValue token={token} value={value} expression={expression} />
      </span>
      <span className="tok-owners-cell">
        <span className="oak-visually-hidden">Re-pointed by </span>
        <IdentityDeltaCell owners={owners} identity={identity} />
      </span>
    </li>
  );
}

interface TokenRowsProps {
  readonly area: CraftArea;
  readonly family: string;
  readonly tokens: readonly CatalogueToken[];
  readonly values: LiveValues;
  readonly identity: IdentitySlug;
  readonly deltas: IdentityDeltaSets;
}

export function TokenRows({
  area,
  family,
  tokens,
  values,
  identity,
  deltas,
}: TokenRowsProps): ReactElement {
  const headingId = sectionId(area, family);
  return (
    <section className="tok-family">
      <h3 className="oak-heading-6" id={headingId}>
        <span className="oak-code-2-bold">--{family}-*</span>{' '}
        <span className="oak-body-3 tok-count">
          {tokens.length} {tokens.length === 1 ? 'token' : 'tokens'}
        </span>
      </h3>
      {/* list-style: none drops native list semantics in WebKit; the role keeps the contract. */}
      <ul className="tok-rows" role="list" aria-labelledby={headingId}>
        {tokens.map((token) => (
          <TokenRow
            key={token.name}
            token={token}
            live={values.get(token.name)}
            identity={identity}
            deltas={deltas}
          />
        ))}
      </ul>
    </section>
  );
}
