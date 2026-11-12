'use client';

/**
 * Children inline at wide, behind a kit disclosure at narrow (owner ruling
 * 2026-08-18: narrow navigation and control rows become a slide-out
 * disclosure instead of scrolling or clipping — everything visible when
 * open, nothing behind a gesture with no affordance when closed).
 *
 * Built on the kit's native `<details class="oak-disclosure">`, so the
 * closed/open contract needs no script of its own and works before
 * hydration: the server renders the NARROW shape (narrow first, wide
 * follows), and a wide viewport dissolves the wrapper at mount, restoring
 * the inline arrangement. A pre-hydration wide visitor has a working
 * native disclosure rather than a broken control — the enhancement is the
 * dissolution, not the behaviour.
 *
 * THE TRADE, priced deliberately: a wide first paint ships the CLOSED
 * disclosure and expands at hydration — a one-time layout shift on
 * desktop loads, and the disclosure form is permanent with JS off.
 * Narrow-first makes the phone's first paint the honest one. (CSS
 * `::details-content` forcing is newly Baseline and not yet safe
 * cross-engine, so the open state rides the prop instead.)
 *
 * Framedness's sibling: viewport width is a client-only fact, so it is
 * read through an external-store subscription (never an effect setState),
 * which keeps the server snapshot honest and the client render
 * cascade-free.
 */
import { useCallback, useState, useSyncExternalStore } from 'react';
import type { FocusEvent, MouseEvent, ReactElement, ReactNode } from 'react';

/** Focus-within, fed by the focus events. Deliberately NEVER read by the
 *  `open` prop — a version that fed `open` directly opened the panel on
 *  the summary's mousedown focus, and the click's own default action
 *  then toggled it straight back closed. It is read only by the
 *  seam-flip latch below, where the fact long predates the resize. */
function useFocusWithin(): {
  readonly focusWithin: boolean;
  readonly onFocus: (event: FocusEvent<HTMLDetailsElement>) => void;
  readonly onBlur: (event: FocusEvent<HTMLDetailsElement>) => void;
} {
  const [focusWithin, setFocusWithin] = useState(false);
  const onFocus = useCallback((event: FocusEvent<HTMLDetailsElement>) => {
    setFocusWithin(event.currentTarget.contains(event.target));
  }, []);
  const onBlur = useCallback((event: FocusEvent<HTMLDetailsElement>) => {
    setFocusWithin(
      event.relatedTarget !== null && event.currentTarget.contains(event.relatedTarget),
    );
  }, []);
  return { focusWithin, onFocus, onBlur };
}

/** LATCH the narrow open state at the wide → narrow flip while focus
 *  sits inside the panel — during the flip RENDER itself (the
 *  documented previous-render adjustment pattern: state, no refs, no
 *  effects), so the commit that would have closed the panel over the
 *  focused control renders it open instead. Focus continuity across
 *  the seam is the contract (review round 1 — 400% zoom and tablet
 *  rotation cross it); an effect-based hold raced the browser's focus
 *  fixup and lost under CI's renderer. */
function useSeamFocusLatch(
  wide: boolean,
  focusWithin: boolean,
  setChosenOpen: (open: boolean) => void,
): void {
  const [previousWide, setPreviousWide] = useState(wide);
  if (previousWide !== wide) {
    setPreviousWide(wide);
    if (!wide && focusWithin) {
      setChosenOpen(true);
    }
  }
}

/** At wide the summary is reachable only by a focus that predates the
 *  dissolution; activating it would natively remove `open` beneath the
 *  forced-open panel (React sees no toggle while wide), so the default
 *  toggle is cancelled until the seam is crossed back. */
function useDissolvedSummaryGuard(wide: boolean): (event: MouseEvent<HTMLElement>) => void {
  return useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (wide) {
        event.preventDefault();
      }
    },
    [wide],
  );
}

function useMediaQueryMatch(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void): (() => void) => {
      const list = globalThis.matchMedia?.(query);
      list?.addEventListener('change', onChange);
      return () => {
        list?.removeEventListener('change', onChange);
      };
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => globalThis.matchMedia?.(query).matches === true,
    () => false,
  );
}

export function NarrowDisclosure({
  summary,
  wideQuery,
  className,
  children,
}: {
  /** The closed state's whole promise — name the contents, not "menu". */
  readonly summary: string;
  /** The media query at which the wrapper dissolves and children render
   *  inline — the same seam the surrounding layout band uses. */
  readonly wideQuery: string;
  readonly className?: string;
  readonly children: ReactNode;
}): ReactElement {
  const wide = useMediaQueryMatch(wideQuery);
  // The user's own narrow open/closed choice, kept OUTSIDE the element so
  // crossing the seam and back restores it.
  const [chosenOpen, setChosenOpen] = useState(false);
  const { focusWithin, onFocus, onBlur } = useFocusWithin();
  useSeamFocusLatch(wide, focusWithin, setChosenOpen);
  const onSummaryClick = useDissolvedSummaryGuard(wide);
  // ONE mounted <details> at every width — never a swap to a fragment.
  // Remounting on the seam destroys focus (measured: a focused control
  // dropped to BODY) and the open state, and the seam is crossed by
  // accessibility paths (400% browser zoom, tablet rotation), not only
  // window dragging. At wide the wrapper DISSOLVES in CSS instead:
  // display: contents hands the children to the surrounding layout and
  // the summary leaves the tree, while the forced open keeps the panel
  // rendered.
  const classes = ['oak-disclosure', className, wide ? 'narrow-disclosure-dissolved' : undefined]
    .filter((name) => name !== undefined)
    .join(' ');
  return (
    <details
      className={classes}
      open={wide ? true : chosenOpen}
      onFocus={onFocus}
      onBlur={onBlur}
      onToggle={(event) => {
        if (!wide) {
          setChosenOpen(event.currentTarget.open);
        }
      }}
    >
      <summary onClick={onSummaryClick}>{summary}</summary>
      {children}
    </details>
  );
}
