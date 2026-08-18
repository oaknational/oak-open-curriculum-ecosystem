'use client';

/**
 * Theme INSIDE the picker's frame: the kit's cascade keys on the root
 * `data-theme` attribute, so applying a theme is an attribute write on the
 * framed document — presentation as data, same no-reload story as
 * identity. Identity default is the opening state (DDR-003 dated
 * amendment 2026-08-11): the control names the no-choice state honestly,
 * and the frame shows each identity's own default face — dark for the
 * arcade, light for the base — exactly as a first-time visitor would see
 * it.
 */
import { typeSafeKeys } from '@oaknational/type-helpers';
import { useCallback, useEffect, useState } from 'react';

import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import type { OakThemeSnapshot } from '@oaknational/oak-design-react';

// Owner-facing theme labels (same discipline as IDENTITY_LABELS). Identity
// default leads: it is the no-choice default (DDR-003 dated amendment
// 2026-08-11 — the person's choice wins, and the identity speaks first when
// the person is silent), and the five choices follow. Re-homed from the
// front-page switchboard at its purge (tight scope, 2026-08-13); the picker
// is now the labels' only consumer.
export const THEME_LABELS: Readonly<Record<OakThemeSnapshot, string>> = {
  [IDENTITY_DEFAULT]: 'Identity default',
  system: 'Match device',
  light: 'Light',
  dark: 'Dark',
  'high-contrast': 'High contrast',
  'colour-safe': 'Colour safe',
};

export const THEME_OPTIONS: readonly OakThemeSnapshot[] = typeSafeKeys(THEME_LABELS);

function isPickerTheme(value: string): value is OakThemeSnapshot {
  const names: readonly string[] = THEME_OPTIONS;
  return names.includes(value);
}

/** Apply a picker theme to the framed document's root. Identity default is
 *  the no-attribute state — the framed identity's own polarity governs
 *  (DDR-003 dated amendment 2026-08-11) — with the kit's access
 *  commitment honoured frame-locally: an OS-level request for more
 *  contrast keeps high-contrast until an explicit choice is made in the
 *  control. The picker writes the attribute directly rather than calling
 *  the frame runtime's set()/clear(): its controls are stage-local
 *  presentation data, and a runtime write would persist to the shared
 *  localStorage and leak the demo state into the whole showcase. The
 *  stage-local state governs the framed root for the LIFE of the mount,
 *  not only at mount: external writers exist (the runtime's pre-paint
 *  apply of a stored site-level choice, and its live contrast listener,
 *  which believes no choice exists because the picker never tells it
 *  one does), and the observer below corrects any divergence. Idempotent
 *  by the early return — the DOM queues a mutation record even for a
 *  same-value attribute write, so the divergence guard is what
 *  terminates the observer's correction cycle. */
function applyFrameTheme(root: HTMLElement, theme: OakThemeSnapshot): void {
  const prefersMoreContrast =
    root.ownerDocument.defaultView?.matchMedia('(prefers-contrast: more)').matches === true;
  // The identity-default face still honours an OS contrast request — the
  // automatic route, distinct from an explicit theme.
  const defaultFace = prefersMoreContrast ? 'high-contrast' : undefined;
  const target = theme === IDENTITY_DEFAULT ? defaultFace : theme;
  if (root.dataset['theme'] === target) {
    return;
  }
  if (target === undefined) {
    delete root.dataset['theme'];
  } else {
    root.dataset['theme'] = target;
  }
}

export function useFrameTheme(resolveTarget: () => Document | null): {
  readonly theme: OakThemeSnapshot;
  readonly setTheme: (value: string) => void;
} {
  const [themeState, setThemeState] = useState<OakThemeSnapshot>(IDENTITY_DEFAULT);

  useEffect(() => {
    const root = resolveTarget()?.documentElement;
    if (root === null || root === undefined) {
      return undefined;
    }
    applyFrameTheme(root, themeState);
    // Hold the control's state against the frame's other writers for the
    // life of the mount. attributeFilter avoids churn (the test sentinel
    // rides the same root's dataset); correctness rests on the divergence
    // guard either way.
    const observer = new MutationObserver(() => {
      applyFrameTheme(root, themeState);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      observer.disconnect();
    };
  }, [themeState, resolveTarget]);

  const setTheme = useCallback((value: string): void => {
    if (isPickerTheme(value)) {
      setThemeState(value);
    }
  }, []);

  return { theme: themeState, setTheme };
}
