'use client';

import type { ReactElement } from 'react';

import { playerPosition } from './course-player';
import { useCoursePlayer } from './CoursePlayerContext';

/**
 * The player's section navigation, export-exact: a hairline above, "← Previous" as a white pill on
 * the left and "Complete & continue →" as a black pill on the right (both lemon-shadowed). No
 * position line here — the export carries position in the content header ("Section n of N", the
 * {@link ModulePosition} piece). Renders nothing pre-hydration: the server-rendered fallback is the
 * full single-scroll document, which needs no paging controls. The demo persists no progress, so
 * "Complete & continue" advances without recording completion (the sidebar progress is a fixed
 * zero-state, reviewed as such). Buttons disable at the sequence ends rather than disappearing, so
 * the control surface is stable for assistive tech.
 */
export function CoursePlayerControls(): ReactElement | null {
  const { activeSectionId, entries, navigate } = useCoursePlayer();
  if (activeSectionId === null) {
    return null;
  }
  const position = playerPosition(activeSectionId, entries);
  if (position === null) {
    return null;
  }
  const { previousId, nextId } = position;
  return (
    <nav
      aria-label="Section navigation"
      className="mt-12 flex items-center justify-between gap-4 border-t border-line-soft pt-7"
    >
      <button
        type="button"
        disabled={previousId === null}
        onClick={() => {
          if (previousId !== null) {
            navigate(previousId);
          }
        }}
        className="rounded-[10px] border-2 border-line bg-btn-secondary px-4 py-2.5 text-[15px] font-bold leading-none shadow-accent-brand disabled:opacity-40 disabled:shadow-none"
      >
        <span aria-hidden="true">← </span>
        {'Previous'}
      </button>
      <button
        type="button"
        disabled={nextId === null}
        onClick={() => {
          if (nextId !== null) {
            navigate(nextId);
          }
        }}
        className="rounded-[10px] border-2 border-line bg-surface-inverted px-5 py-2.5 text-[15px] font-bold leading-none text-ink-inverted shadow-accent-brand disabled:opacity-40 disabled:shadow-none"
      >
        {'Complete & continue'}
        <span aria-hidden="true"> →</span>
      </button>
    </nav>
  );
}
