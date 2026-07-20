'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';
import { useCurriculumSearch } from '@/lib/use-curriculum-search';
import Destinations from './Destinations';
import { HubResultsView, curriculumAnnouncement } from './HubResults';
import ContentLinks from './ContentLinks';

/** The hero's search box. Search is live-on-type; the button submits a no-op form
 *  so the affordance matches the prototype without a second search mechanism. */
function HubSearchForm({
  query,
  onQueryChange,
}: {
  readonly query: string;
  readonly onQueryChange: (next: string) => void;
}): ReactElement {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex max-w-[620px] items-center gap-2 rounded-full border-2 border-line bg-surface py-2 pl-5 pr-2 shadow-accent-wide-brand"
    >
      <svg
        width="22"
        height="22"
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
        id="hub-search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search courses, standards, rubrics, exemplars…"
        aria-label="Search the hub"
        className="min-w-0 flex-1 scroll-mt-24 border-none bg-transparent text-[16px] font-light leading-none text-ink placeholder:text-ink-subdued"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-surface-inverted px-5 py-2.5 text-[15px] font-bold text-ink-inverted transition-colors hover:bg-surface-inverted-hover"
      >
        Search
      </button>
    </form>
  );
}

/** Lemon hero band: eyebrow, heading, intro, unified search. */
function HubHero({
  query,
  onQueryChange,
}: {
  readonly query: string;
  readonly onQueryChange: (next: string) => void;
}): ReactElement {
  return (
    <section className="border-b-[3px] border-line bg-accent-subtle-brand">
      <div className="mx-auto max-w-[1080px] px-6 py-12">
        <span className="mb-5 inline-block rounded-full bg-surface-inverted px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-ink-inverted">
          Single source of truth
        </span>
        <h1 className="mb-4 max-w-[600px] text-[44px] font-bold leading-[1.05] tracking-[-0.01em]">
          Oak Curriculum and Lesson Creation
        </h1>
        <p className="mb-7 max-w-[560px] text-[17px] leading-relaxed">
          Everything you need to create high-quality lessons at Oak, connected in one place.
          Training, quality standards, rubrics, exemplars and our shared wiki &mdash; so the way we
          work is always clear, current and joined up.
        </p>
        <HubSearchForm query={query} onQueryChange={onQueryChange} />
      </div>
    </section>
  );
}

/**
 * The hub landing: the unified hub-wide search. The hero owns the query; an empty
 * query shows the destination cards, a live query shows the grouped results. The
 * single persistent sr-only live region lives HERE, mounted empty across both
 * branches, so its first announcement is reliable and no visible element churns
 * per keystroke (WCAG 2.2 SC 4.1.3; the ShowcaseResults region is the precedent).
 */
export default function HubLanding(): ReactElement {
  const [query, setQuery] = useState('');
  const curriculum = useCurriculumSearch(query);
  const searching = query.trim() !== '';
  return (
    <>
      <HubHero query={query} onQueryChange={setQuery} />
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {curriculumAnnouncement(curriculum, query)}
      </p>
      {searching ? (
        <HubResultsView query={query} onClear={() => setQuery('')} curriculum={curriculum} />
      ) : (
        <Destinations />
      )}
      <ContentLinks />
    </>
  );
}
