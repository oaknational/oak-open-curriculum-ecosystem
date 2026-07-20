'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactElement, RefObject } from 'react';

import { HubNavLink } from '@/components/HubNavLink';
import type { HubNavItem } from '@/components/HubNavLink';
import { HubSearch } from '@/components/HubSearch';

const menuLinkClass =
  'block rounded-card px-[13px] py-[11px] text-[15px] font-semibold leading-none text-ink no-underline transition-colors hover:bg-surface-subtle';

/** The open disclosure panel: stacked section links plus the hub search. */
function MenuPanel({
  id,
  items,
  onChoose,
}: {
  readonly id: string;
  readonly items: readonly HubNavItem[];
  readonly onChoose: () => void;
}): ReactElement {
  return (
    <nav
      id={id}
      aria-label="Hub sections menu"
      className="shadow-neutral-brand absolute inset-x-0 top-full flex flex-col gap-1 border-b-[3px] border-line bg-surface p-4"
    >
      {items.map((item) => (
        <HubNavLink key={item.label} item={item} className={menuLinkClass} onChoose={onChoose} />
      ))}
      <div className="mt-2">
        <HubSearch label="Hub search (menu)" />
      </div>
    </nav>
  );
}

/**
 * Widget-level dismissal for an open disclosure (APG disclosure-navigation),
 * attached as native listeners on the root WHILE OPEN rather than as JSX
 * interaction props — the wrapper is not an interactive element, and
 * interaction props on it would misdeclare its contract (Sonar S6848).
 * Escape closes and returns focus to the toggle; focus leaving the disclosure
 * closes WITHOUT pulling focus back — the user is already moving on.
 */
function useDisclosureDismissal(
  rootRef: RefObject<HTMLDivElement | null>,
  toggleRef: RefObject<HTMLButtonElement | null>,
  open: boolean,
  close: () => void,
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!open || root === null) {
      return undefined;
    }
    const onKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close();
        toggleRef.current?.focus();
      }
    };
    const onFocusOut = (event: globalThis.FocusEvent): void => {
      const next = event.relatedTarget;
      if (!(next instanceof Node && root.contains(next))) {
        close();
      }
    };
    root.addEventListener('keydown', onKeyDown);
    root.addEventListener('focusout', onFocusOut);
    return () => {
      root.removeEventListener('keydown', onKeyDown);
      root.removeEventListener('focusout', onFocusOut);
    };
  }, [open, close, rootRef, toggleRef]);
}

/**
 * Small-viewport hub navigation (`md:hidden`; the inline nav and search hide
 * below `md:`): a disclosure button toggling a full-width panel with the
 * section links and the hub search. A disclosure, not a modal — no focus trap;
 * Escape closes and returns focus to the toggle; choosing a link closes (the
 * APG disclosure-navigation shape). Cures the SC 1.4.10 reflow failure of the
 * inline nav at 320px.
 */
export function MobileHubNav({ items }: { readonly items: readonly HubNavItem[] }): ReactElement {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => {
    setOpen(false);
  }, []);
  useDisclosureDismissal(rootRef, toggleRef, open, close);
  return (
    <div ref={rootRef} className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Hub sections"
        className="flex h-10 w-10 items-center justify-center rounded-card border-2 border-line bg-btn-secondary text-ink"
        onClick={() => setOpen((current) => !current)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && <MenuPanel id={panelId} items={items} onChoose={() => setOpen(false)} />}
    </div>
  );
}
