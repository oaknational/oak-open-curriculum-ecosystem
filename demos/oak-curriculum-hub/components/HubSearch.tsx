import type { ReactElement } from 'react';

/**
 * Presentational hub-search affordance (the live search is the hero SearchHub).
 * Shared by the inline header row (`md:` up) and the small-viewport disclosure
 * panel; the parent constrains the width. `label` distinguishes the two
 * landmark instances (axe landmark-unique — only one is ever CSS-exposed, but
 * distinct names cost nothing and read better in a rotor either way).
 */
export function HubSearch({ label = 'Hub search' }: { readonly label?: string }): ReactElement {
  return (
    <div
      role="search"
      aria-label={label}
      className="flex items-center gap-2 rounded-full border-2 border-line bg-surface px-3.5 py-[7px]"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="shrink-0 text-ink-subdued"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="search"
        placeholder="Search the hub"
        aria-label="Search the hub"
        className="w-full border-none bg-transparent text-[15px] font-light leading-none text-ink placeholder:text-ink-subdued"
      />
    </div>
  );
}
