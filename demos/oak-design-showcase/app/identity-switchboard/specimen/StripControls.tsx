'use client';

/**
 * The specimen's own controls (owner word 2026-08-18): the utility strip's
 * decorative audience/help chrome becomes the page's real controls. Identity
 * re-skins THIS document — the binder is called with no target, so the sheet
 * lands in the host document (the same live-page pattern as the token
 * reference). Theme rides the kit's own runtime store and persists exactly
 * as it would in a product.
 *
 * Compact by the same word ("SMALL controls in the top black header"): the
 * radio group's legend and help text stay in the accessibility tree but
 * leave the visual row, and a visually-hidden polite status line announces
 * each change — the W3 mitigations at strip scale. The kit's 44px target
 * floor is contractual and holds here; small means visually quiet, never
 * short targets.
 */
import { useCallback, useSyncExternalStore } from 'react';
import type { ReactElement } from 'react';

import { oakThemeStore } from '@oaknational/oak-design-react';
import type { OakThemeSnapshot } from '@oaknational/oak-design-react';

import { IdentityRadioGroup } from '../../../components/IdentityRadioGroup';
import { LabelledSelect } from '../../../components/LabelledSelect';
import { ShowcaseBreadcrumbs } from '../../../components/ShowcaseBreadcrumbs';
import { useIdentity } from '../../../components/brand-identity-binding';
import { useFramed } from '../../../components/useFramed';
import { IDENTITY_LABELS, type IdentitySlug } from '../../../components/useIdentity';
import { THEME_LABELS, THEME_OPTIONS, isPickerTheme } from '../../../components/theme-vocabulary';
import { useFrameTheme } from '../useFrameTheme';

/** Theme has TWO modes by where the specimen renders (the useFrameTheme
 *  doctrine): as a FULL PAGE the choice rides the kit runtime and persists
 *  like a product; FRAMED inside a stage it stays stage-local (a direct
 *  attribute write) so a demo choice never leaks into the whole showcase's
 *  shared storage. Framedness comes from the shared useFramed fact; this
 *  strip keys two behaviours on it — theme-mode routing here, and the
 *  breadcrumb omission below (framed navigation would otherwise navigate
 *  the STAGE — a switchboard nested inside its own picker). */
const SPECIMEN_TRAIL = [
  { label: 'Showcase', href: '/' },
  { label: 'Switchboard', href: '/identity-switchboard' },
  { label: 'Specimen' },
] as const;

function useStripTheme(framed: boolean): {
  readonly theme: OakThemeSnapshot | undefined;
  readonly setTheme: (value: string) => void;
} {
  // Framed mode delegates to useFrameTheme pointed at the OWN document —
  // that hook carries the stage-local discipline AND the divergence guard
  // holding the choice against the runtime's live contrast listener (the
  // OS-flip cell caught a hand-rolled variant losing exactly that).
  const resolveOwnDocument = useCallback(
    (): Document | null => (framed ? document : null),
    [framed],
  );
  const stageTheme = useFrameTheme(resolveOwnDocument);
  const runtimeTheme = useSyncExternalStore(
    oakThemeStore.subscribe,
    oakThemeStore.getTheme,
    oakThemeStore.getServerSnapshot,
  );
  const setRuntimeTheme = useCallback((value: string): void => {
    if (isPickerTheme(value)) {
      oakThemeStore.setTheme(value);
    }
  }, []);
  return framed
    ? { theme: stageTheme.theme, setTheme: stageTheme.setTheme }
    : { theme: runtimeTheme, setTheme: setRuntimeTheme };
}

export function StripControls({
  initialIdentity,
}: {
  /** The server-rendered brand (`?brand=`): the radios open on the truth,
   *  and the binder adopts the server's sheet so a switch manages it. */
  readonly initialIdentity: IdentitySlug;
}): ReactElement {
  const framed = useFramed();
  const { identity, identities, setIdentity } = useIdentity(undefined, initialIdentity);
  const { theme, setTheme } = useStripTheme(framed);

  return (
    <div className="oak-cluster strip-controls">
      {/* Framed, the specimen is an exhibit, not a page: its links use the
          default `_self` target, so a framed breadcrumb click would load
          the destination INSIDE the stage (a switchboard nested in its own
          picker). Embedded mode therefore carries no page navigation —
          the parent page owns the trail. */}
      {framed ? null : <ShowcaseBreadcrumbs trail={SPECIMEN_TRAIL} />}
      <IdentityRadioGroup
        idPrefix="specimen-strip"
        identity={identity}
        identities={identities}
        labels={IDENTITY_LABELS}
        onChange={setIdentity}
        compact
      />
      <LabelledSelect
        id="specimen-strip-theme"
        label="Theme"
        value={theme ?? ''}
        options={THEME_OPTIONS}
        labels={THEME_LABELS}
        placeholderLabel="—"
        disabled={theme === undefined}
        onChange={setTheme}
      />
      <p aria-live="polite" className="oak-visually-hidden">
        Showing {IDENTITY_LABELS[identity] ?? identity}
        {theme === undefined ? '' : ` · ${THEME_LABELS[theme] ?? theme}`}
      </p>
    </div>
  );
}
