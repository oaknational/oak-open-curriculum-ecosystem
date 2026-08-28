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
import { useCallback, useEffect, useState } from 'react';

import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import type { OakThemeSnapshot } from '@oaknational/oak-design-react';

import { holdFrameTheme } from '../../components/apply-frame-theme';
import { isPickerTheme } from '../../components/theme-vocabulary';

/* The apply-and-hold logic lives in components/apply-frame-theme.ts
   (consolidated at its third consumer): identity default is the
   no-attribute state honouring an OS contrast request; explicit choices
   are held against external writers by the shared guard's observer,
   whose correction cycle terminates on the applier's idempotence guard.
   The stage-local state governs the framed root for the LIFE of the
   mount, not only at mount: external writers exist (the runtime's
   pre-paint apply of a stored site-level choice, and its live contrast
   listener, which believes no choice exists because the picker never
   tells it one does). */

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
    // Hold the control's state against the frame's other writers for the
    // life of the mount (the shared apply-and-hold guard).
    return holdFrameTheme(root, themeState);
  }, [themeState, resolveTarget]);

  const setTheme = useCallback((value: string): void => {
    if (isPickerTheme(value)) {
      setThemeState(value);
    }
  }, []);

  return { theme: themeState, setTheme };
}
