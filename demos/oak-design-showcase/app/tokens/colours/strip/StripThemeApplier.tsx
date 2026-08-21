'use client';

/**
 * Applies the cell's theme to the document ROOT, following the composition
 * exhibit's applier: `light-dark()` inside a custom property resolves
 * against the colour-scheme of the element the declaration applies to, so a
 * subtree `data-theme` cannot flip tokens declared at `:root`. The kit
 * themes the root, and so does this.
 *
 * The theme is applied through the shared frame-theme guard rather than a
 * one-shot write, so the cell COMPOSES with the runtime's automatic
 * behaviours instead of racing them: the identity-default band honours an
 * OS-level contrast request (the automatic route — under
 * `prefers-contrast: more` the first band shows each identity's
 * high-contrast face, which is what the OS asked of it), and an explicit
 * Light/Dark cell is held against later external writers (the runtime's
 * live contrast listener, a stored site-level choice) for the life of the
 * cell — its label and its rendering cannot drift apart. Nothing here
 * persists: the guard writes the attribute only, never the shared store.
 */
import { useEffect } from 'react';

import { holdFrameTheme } from '../../../../components/apply-frame-theme';

import type { MatrixTheme } from '../colour-matrix';

export function StripThemeApplier({ theme }: { readonly theme: MatrixTheme }): null {
  useEffect(() => holdFrameTheme(document.documentElement, theme), [theme]);
  return null;
}
