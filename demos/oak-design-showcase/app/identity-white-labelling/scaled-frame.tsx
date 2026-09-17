'use client';

/**
 * A framed specimen scaled to fit its column: the iframe renders at the
 * canonical canvas width (DDR-009's primary comparison cell) and is
 * transform-scaled to the column's live width, so all three columns show
 * the same simulated viewport regardless of screen size.
 *
 * The export's inline resize script, rebuilt on the shared scale-fit hook
 * (useScaledViewport — the picker's stage is its other consumer). On load
 * the frame's document drops any persisted theme attribute so the three
 * columns stay comparable at page default.
 */
import { useCallback, useEffect, useRef } from 'react';
import type { ReactElement, RefObject } from 'react';

import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import type { OakThemeSnapshot } from '@oaknational/oak-design-react';

import { holdFrameTheme } from '../../components/apply-frame-theme';
import { DEFAULT_VIEWPORT_WIDTH } from '../../components/canonical-widths';
import { useScaledViewport } from '../../components/useScaledViewport';

/** Apply AND HOLD the parent-owned theme on a framed document, keyed on
 *  the specimen's identity mark so about:blank does not count as loaded.
 *  At identity default this also DROPS any persisted attribute, keeping
 *  the columns comparable — the original comparability rule, now one case
 *  of the parent's theme governing every frame (owner word 2026-08-18).
 *  The HOLD matters because each framed document runs the kit runtime,
 *  whose live contrast listener rewrites `data-theme` on an OS change; an
 *  apply-only stage would drift from the parent's reported theme the
 *  moment that fires. One live hold per stage: installing releases the
 *  previous one, and a fresh document (every frame load) re-installs. */
function useStageThemeHold(
  iframeRef: RefObject<HTMLIFrameElement | null>,
): (theme: OakThemeSnapshot) => void {
  const releaseRef = useRef<(() => void) | null>(null);
  const hold = useCallback(
    (theme: OakThemeSnapshot): void => {
      releaseRef.current?.();
      releaseRef.current = null;
      const doc = iframeRef.current?.contentDocument;
      if (doc?.querySelector('[data-identity]')) {
        releaseRef.current = holdFrameTheme(doc.documentElement, theme);
      }
    },
    [iframeRef],
  );
  useEffect(
    () => () => {
      releaseRef.current?.();
      releaseRef.current = null;
    },
    [],
  );
  return hold;
}

export function ScaledFrame({
  src,
  title,
  theme = IDENTITY_DEFAULT,
  width = DEFAULT_VIEWPORT_WIDTH,
}: {
  readonly src: string;
  readonly title: string;
  /** Parent-owned, stage-local — never the frame's own runtime store. */
  readonly theme?: OakThemeSnapshot;
  /** The simulated viewport width every column shares. */
  readonly width?: number;
}): ReactElement {
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useScaledViewport(stageRef, iframeRef, width);
  const holdStageTheme = useStageThemeHold(iframeRef);

  // The load event can beat hydration (see the picker's useSpecimenFrame);
  // this effect covers the already-loaded case and re-holds on every
  // parent theme change.
  useEffect(() => {
    holdStageTheme(theme);
  }, [theme, holdStageTheme]);

  return (
    <div ref={stageRef} className="frame">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        onLoad={() => {
          holdStageTheme(theme);
        }}
      />
    </div>
  );
}
