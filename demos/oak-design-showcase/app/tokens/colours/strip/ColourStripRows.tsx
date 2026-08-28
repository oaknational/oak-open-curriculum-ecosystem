'use client';

/**
 * One cell's colours: every colour token in the catalogue, painted by THIS
 * document's cascade and printed as the hex the browser resolved.
 *
 * The same live-value store the reference page uses reads them, and it
 * reads them from THIS document — each frame is its own realm, so each
 * strip reports its own identity and theme without any of them having to
 * know that fourteen siblings exist. Before the read lands, the row shows
 * the value the kit declares, exactly as the reference page does, so a
 * frame is never blank and never fabricates a number.
 */
import { useSyncExternalStore } from 'react';
import type { ReactElement } from 'react';

import { liveTokenValues } from '../../live-token-values';
import type { CatalogueToken } from '../../token-catalogue';
import { asHexColour } from '../colour-matrix';

export function ColourStripRows({
  tokens,
}: {
  readonly tokens: readonly CatalogueToken[];
}): ReactElement {
  const values = useSyncExternalStore(
    liveTokenValues.subscribe,
    liveTokenValues.getSnapshot,
    liveTokenValues.getServerSnapshot,
  );

  return (
    <ul className="strip-rows">
      {tokens.map((token) => {
        const live = values.get(token.name);
        return (
          <li key={token.name} className="strip-row" data-token={token.name}>
            {/* Painted through the token itself; the reader below resolves
                what the browser actually put on screen. */}
            <span className="strip-swatch" data-resolve="background-color" aria-hidden="true" />
            <span className="oak-code-4 strip-name">{token.name}</span>
            <span className="oak-code-4 strip-value">
              {live === undefined ? token.declared : asHexColour(live.value)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
