'use client';

/**
 * The reference's live half: the two controls, and the subscription that
 * keeps the printed values honest.
 *
 * Identity re-skins the page ITSELF here — the binder is called with no
 * target, so the sheet lands in this document rather than a framed one, and
 * the page a reader is looking at is the page being re-skinned. Theme goes
 * through the kit's own runtime store, so the choice persists exactly as it
 * would in a product: this is a whole page, not a stage inside one.
 *
 * The identity and theme state are NOT wired to the value reader. They do
 * not need to be: the reader observes the DOM effects those controls cause —
 * a stylesheet link arriving, a `data-theme` attribute changing — so it is
 * correct for a change made from anywhere, including one this component
 * never saw.
 *
 * The table carries no live region. The status line announces the identity
 * and theme once per change; announcing four hundred changed cells would
 * make the page unusable with a screen reader, which is the failure a live
 * region exists to prevent.
 */
import { useMemo, useSyncExternalStore } from 'react';
import type { ReactElement } from 'react';

import { oakThemeStore } from '@oaknational/oak-design-react';
import type { OakThemeSnapshot } from '@oaknational/oak-design-react';

import { LabelledSelect } from '../../components/LabelledSelect';
import { useIdentity } from '../../components/brand-identity-binding';
import { IDENTITY_LABELS, type IdentitySlug } from '../../components/useIdentity';
import { THEME_LABELS, THEME_OPTIONS } from '../../components/theme-vocabulary';

import { FamilyNav } from './FamilyNav';
import { TokenTable, type IdentityDeltaSets } from './TokenTable';
import { liveTokenValues, type LiveValues } from './live-token-values';
import type { CraftAreaGroup } from './token-groups';

interface IdentityDeltaView {
  readonly identity: IdentitySlug;
  readonly properties: readonly string[];
}

export interface TokenReferenceProps {
  readonly groups: readonly CraftAreaGroup[];
  readonly deltas: readonly IdentityDeltaView[];
  readonly tokenCount: number;
}

function TokenControls({
  identity,
  identities,
  setIdentity,
  theme,
  tokenCount,
}: {
  readonly identity: IdentitySlug;
  readonly identities: readonly IdentitySlug[];
  readonly setIdentity: (value: string) => void;
  readonly theme: OakThemeSnapshot | undefined;
  readonly tokenCount: number;
}): ReactElement {
  return (
    <div className="oak-grid tok-controls">
      <LabelledSelect
        id="tokens-identity-select"
        label="Identity"
        value={identity}
        options={identities}
        labels={IDENTITY_LABELS}
        onChange={setIdentity}
      />
      <LabelledSelect
        id="tokens-theme-select"
        label="Theme"
        value={theme ?? ''}
        options={THEME_OPTIONS}
        labels={THEME_LABELS}
        placeholderLabel="—"
        disabled={theme === undefined}
        onChange={oakThemeStore.setTheme}
      />
      <p aria-live="polite" className="oak-body-3 tok-status">
        Showing {IDENTITY_LABELS[identity]}
        {theme === undefined ? '' : ` · ${THEME_LABELS[theme]}`} · {tokenCount} tokens
      </p>
    </div>
  );
}

/** The tables themselves: craft area, then prefix family. The families of
 *  one area flow into columns where the window is wide enough for two, and
 *  a family never splits across them. */
function TokenSections({
  groups,
  values,
  identity,
  deltas,
}: {
  readonly groups: readonly CraftAreaGroup[];
  readonly values: LiveValues;
  readonly identity: IdentitySlug;
  readonly deltas: IdentityDeltaSets;
}): ReactElement {
  return (
    <div className="tok-sections">
      {groups.map((group) => (
        <section key={group.area} className="tok-area">
          <h2 className="oak-heading-6">{group.title}</h2>
          <p className="oak-body-3 tok-area-note">{group.note}</p>
          <div className="tok-area-families">
            {group.families.map(({ family, tokens }) => (
              <TokenTable
                key={family}
                area={group.area}
                family={family}
                tokens={tokens}
                values={values}
                identity={identity}
                deltas={deltas}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function TokenReference({ groups, deltas, tokenCount }: TokenReferenceProps): ReactElement {
  const { identity, identities, setIdentity } = useIdentity();
  const theme = useSyncExternalStore(
    oakThemeStore.subscribe,
    oakThemeStore.getTheme,
    oakThemeStore.getServerSnapshot,
  );
  const values = useSyncExternalStore(
    liveTokenValues.subscribe,
    liveTokenValues.getSnapshot,
    liveTokenValues.getServerSnapshot,
  );

  const deltaSets = useMemo<IdentityDeltaSets>(
    () => new Map(deltas.map((delta) => [delta.identity, new Set(delta.properties)])),
    [deltas],
  );

  return (
    <div className="tok-layout">
      {/* Controls and the family jump list travel together, because they are
          the same thing: the two ways of moving around four hundred tokens.
          At wide they become a rail that stays put while the tables scroll
          past, which is what turns the empty right-hand margin into reading
          width. At narrow the rail is simply the top of the page. */}
      <div className="tok-rail">
        <TokenControls
          identity={identity}
          identities={identities}
          setIdentity={setIdentity}
          theme={theme}
          tokenCount={tokenCount}
        />
        <FamilyNav groups={groups} />
      </div>

      <TokenSections groups={groups} values={values} identity={identity} deltas={deltaSets} />
    </div>
  );
}
