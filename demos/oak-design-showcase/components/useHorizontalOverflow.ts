'use client';

/**
 * Whether an element currently has horizontal overflow to scroll — the
 * fact that decides if a scroll container should be a sequential focus
 * stop. A scrollable region needs focus for keyboard reach (in WebKit an
 * unfocusable scroller is pointer-only, SC 2.1.1), but an UNCONDITIONAL
 * stop turns a long catalogue into a gauntlet: forty stacked-at-narrow
 * families would cost keyboard users forty inert stops to traverse
 * (SC 2.4.3 sanity). Focusability therefore follows the measured state.
 *
 * Both the container and its content are observed: the container resizes
 * with the viewport, while live-value text can widen the content without
 * the container changing size — either movement can flip the answer.
 * Measured on the rendering lifecycle (ResizeObserver), never on a timer.
 * The content is captured ONCE at mount (`firstElementChild`), which is
 * correct for a stable child like a table; a consumer that swaps its
 * first child needs a re-observing variant.
 */
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export function useHorizontalOverflow<T extends HTMLElement>(): {
  readonly ref: RefObject<T | null>;
  readonly overflowing: boolean;
} {
  const ref = useRef<T | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element === null) {
      return undefined;
    }
    const measure = (): void => {
      setOverflowing(element.scrollWidth > element.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const content = element.firstElementChild;
    if (content !== null) {
      observer.observe(content);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, overflowing };
}
