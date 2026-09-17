import type { ReactElement } from 'react';

import type { Catalogue } from './token-catalogue';

/**
 * What this catalogue contains, and what it leaves out — at the TOP of the
 * page, where context belongs, rather than as a footnote nobody scrolls
 * four hundred rows to reach.
 *
 * It sits inside a disclosure because it answers a second question. The
 * first — what is this page, and what does "re-pointed" mean — is prose a
 * reader meets on the way in. The scope and provenance of the catalogue is
 * what they come back for once they doubt a number, and putting it behind
 * one summary line keeps it a click away instead of a screenful in front of
 * the tokens.
 *
 * Every figure here is COUNTED at build time from the trees and sheets the
 * page was built from, never written down. A reference page that states its
 * own scope from memory is one upstream change away from lying about
 * itself, and this is the page where that would matter most.
 */
export function CatalogueNote({
  catalogue,
  treeCount,
}: {
  readonly catalogue: Catalogue;
  readonly treeCount: number;
}): ReactElement {
  return (
    <details className="oak-disclosure tok-contract">
      <summary className="oak-body-3">What this catalogue contains</summary>
      <p className="oak-body-3">
        {catalogue.tokens.length} custom properties, flattened from the {treeCount} DTCG token trees
        the design system publishes &mdash; {catalogue.leafCount} declarations in total, because the
        theme faces re-declare the same roles. Each property is listed once, showing the value its
        current theme gives it.
      </p>
      <p className="oak-body-3">
        Icon URL properties (<span className="oak-code-3">--i-*</span> and the{' '}
        <span className="oak-code-3">--ic-*</span> roles) are excluded. They are
        environment-relative asset paths rather than design decisions, so the kit&rsquo;s export
        leaves them out deliberately and this catalogue filters the same shapes to keep that true if
        the export ever changes. Excluded from these trees: {catalogue.excludedIconCount}.
      </p>
      <p className="oak-body-3">
        The re-pointing shown against each token is read from the identity stylesheets themselves,
        at build time, so it states what those sheets actually declare rather than what a list here
        remembers. The base identity carries no override sheet &mdash; it is the kit&rsquo;s own
        tokens.
      </p>
    </details>
  );
}
