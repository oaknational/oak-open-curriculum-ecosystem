'use client';

/**
 * Applies the exhibit's ground to the document ROOT: light-dark() inside
 * a custom property resolves against the color-scheme of the element the
 * declaration applies to, so a subtree data-theme cannot flip tokens
 * declared at :root — the kit's own model themes the root, and this
 * exhibit follows it.
 *
 * OWNERSHIP BY CONTEXT (review round 3): the kit runtime's live
 * `prefers-contrast` listener rewrites `data-theme` when it believes no
 * choice exists, so a one-shot write loses the query's ground on the
 * first OS change. Standalone, this component HOLDS the query theme for
 * the route's lifetime through the shared frame-theme guard. FRAMED, it
 * deliberately does nothing: the parent stage installs the hold and
 * drives it live — exactly one holder per document, or two observers
 * would correct each other forever.
 */
import { useEffect } from 'react';

import { holdFrameTheme } from '../../../components/apply-frame-theme';
import type { ExhibitTheme } from './layouts';

export function ExhibitThemeApplier({ theme }: { readonly theme: ExhibitTheme }): null {
  useEffect(() => {
    // Framedness is read directly here, not through useFramed: the hook's
    // server snapshot is `false`, so a hydrated FRAMED document would
    // spend its first client commit with framed=false and this effect
    // would install a transient second holder — the two-observer
    // correction loop the ownership contract above forbids. This
    // component renders nothing, so framedness never drives render; the
    // effect is client-only and the direct read is always the truth.
    if (globalThis.self !== globalThis.top) {
      return undefined;
    }
    return holdFrameTheme(document.documentElement, theme);
  }, [theme]);
  return null;
}
