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
 * Scaling the live frame also scales its hit targets, so usability has a
 * floor: below INTERACTIVE_SCALE_FLOOR the kit's 44px-minimum controls
 * render under WCAG 2.5.8's 24px target minimum — unusably small, and
 * transform scale is not something browser zoom recovers. Below the floor
 * the frame goes INERT: the preview stays a live picture, and interaction
 * belongs to the full-page link each stage renders beside it at native
 * size. Above the floor the frame is interactive as before.
 */
import { useEffect } from 'react';
import type { RefObject } from 'react';

/** 24px (SC 2.5.8 minimum) over the kit's 44px MINIMUM target size (the
 *  kit's own --size-target is 48px md, so this floor is deliberately the
 *  stricter denominator — the preview goes inert slightly early rather
 *  than slightly late). */
const INTERACTIVE_SCALE_FLOOR = 24 / 44;

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
      iframe.inert = scale < INTERACTIVE_SCALE_FLOOR;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => {
      observer.disconnect();
    };
  }, [stageRef, frameRef, width]);
}
