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
import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';

import { DEFAULT_VIEWPORT_WIDTH } from '../../components/canonical-widths';
import { useScaledViewport } from '../../components/useScaledViewport';

/** Drop any persisted theme attribute from a framed document so the
 *  columns stay comparable at page default. A module-level function: the
 *  mutation targets the frame's own document, outside React's state. */
function dropPersistedTheme(root: HTMLElement | undefined): void {
  if (root !== undefined) {
    delete root.dataset['theme'];
  }
}

export function ScaledFrame({
  src,
  title,
}: {
  readonly src: string;
  readonly title: string;
}): ReactElement {
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useScaledViewport(stageRef, iframeRef, DEFAULT_VIEWPORT_WIDTH);

  // The load event can beat hydration (see the picker's useSpecimenFrame);
  // this mount-time probe covers the already-loaded case, keyed on the
  // specimen's identity mark so about:blank does not count as loaded —
  // without it a persisted theme survives in every column on a dev server.
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.querySelector('[data-identity]')) {
      dropPersistedTheme(doc.documentElement);
    }
  }, []);

  return (
    <div ref={stageRef} className="frame">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        onLoad={() => {
          dropPersistedTheme(iframeRef.current?.contentDocument?.documentElement);
        }}
      />
    </div>
  );
}
