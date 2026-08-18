'use client';

/**
 * Scale-fit a simulated viewport inside a stage rectangle: the iframe lays
 * out at `width` CSS px — so the media queries and grids inside it respond
 * to that width truthfully — and is transform-scaled to the stage's live
 * box. Extracted at its second consumer (the side-by-side's ScaledFrame,
 * then the picker's stage).
 *
 * The hook is the single source of the frame's simulated size: it sizes
 * the iframe AND scales it, so the number cannot drift between a
 * stylesheet and a constant. Scale is capped at 1 — a simulated viewport
 * narrower than the stage previews at true size, centred, never
 * magnified — and the simulated height derives from the stage's measured
 * box (stage height ÷ scale), so the scaled frame fills the stage exactly
 * whatever the stage's aspect. A ResizeObserver drives re-fit (no window
 * listeners to leak).
 *
 * Scaling the live frame also scales its hit targets: below scale 44/48
 * the kit's 48px controls render under the 44px minimum — an accepted
 * cost for these preview stages, and full-size interaction is always one
 * link away via each exhibit's open-as-full-page link.
 */
import { useEffect } from 'react';
import type { RefObject } from 'react';

export function useScaledViewport(
  stageRef: RefObject<HTMLElement | null>,
  frameRef: RefObject<HTMLIFrameElement | null>,
  width: number,
): void {
  useEffect(() => {
    const stage = stageRef.current;
    const iframe = frameRef.current;
    if (stage === null || iframe === null) {
      return undefined;
    }
    const fit = (): void => {
      const scale = Math.min(1, stage.clientWidth / width);
      iframe.style.width = `${width}px`;
      iframe.style.height = `${stage.clientHeight / scale}px`;
      iframe.style.transform = `scale(${scale})`;
      iframe.style.marginInlineStart = `${Math.max(0, (stage.clientWidth - width * scale) / 2)}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => {
      observer.disconnect();
    };
  }, [stageRef, frameRef, width]);
}
