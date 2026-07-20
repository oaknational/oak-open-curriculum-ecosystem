'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';

import { ShowcaseResults } from '@/components/curriculum/ShowcaseResults';
import { useCurriculumSearch } from '@/lib/use-curriculum-search';
import type { CurriculumSearchState } from '@/lib/use-curriculum-search';

/** Demo-local example queries (static UI content) that seed the search on a click. */
const EXAMPLE_QUERIES = [
  'comparing fractions',
  'photosynthesis',
  'the water cycle',
  'persuasive writing',
] as const;

/** The live search input with the established magnifier glyph. */
function HeroSearchInput({
  query,
  onQueryChange,
}: {
  readonly query: string;
  readonly onQueryChange: (next: string) => void;
}): ReactElement {
  return (
    <div className="mt-6 flex max-w-[560px] items-center gap-2.5 rounded-full border-[3px] border-line bg-surface px-4 py-2.5 shadow-accent-wide-brand">
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
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search lessons, units and threads…"
        aria-label="Search the Oak curriculum"
        className="w-full border-none bg-transparent text-[16px] font-light leading-none text-ink placeholder:text-ink-subdued"
      />
    </div>
  );
}

/** The amber hero: eyebrow, title, the honest capability line, the live input and example chips. */
function ShowcaseHero({
  query,
  onQueryChange,
}: {
  readonly query: string;
  readonly onQueryChange: (next: string) => void;
}): ReactElement {
  return (
    <div className="border-b-[3px] border-line bg-decorative-6-subtle">
      <div className="mx-auto max-w-[1080px] px-6 pt-12 pb-10">
        <p className="mb-2 text-[13px] leading-none font-bold tracking-[0.05em] uppercase text-ink-subdued">
          Live semantic search
        </p>
        <h1 className="text-[42px] leading-[48px] font-semibold text-balance">
          Search the Oak curriculum
        </h1>
        <p className="mt-3 max-w-[68ch] text-[17px] leading-[27px] font-light">
          Semantic search over the published national curriculum — live from Elasticsearch through
          the Oak search SDK. Results understand meaning, not just keywords, and arrive with
          highlighted matches and per-scope timings.
        </p>
        <HeroSearchInput query={query} onQueryChange={onQueryChange} />
        <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Example searches">
          {EXAMPLE_QUERIES.map((example) => (
            <li key={example}>
              <button
                type="button"
                onClick={() => onQueryChange(example)}
                className="rounded-full border-2 border-line bg-btn-secondary px-3.5 py-[7px] text-[13px] font-bold text-ink transition-shadow hover:shadow-accent-brand"
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * The /curriculum showcase view, pure over its inputs (the DI seam the search views share):
 * hero + live input + example chips over the per-scope results surface.
 */
export function CurriculumShowcaseView({
  query,
  onQueryChange,
  state,
}: {
  readonly query: string;
  readonly onQueryChange: (next: string) => void;
  readonly state: CurriculumSearchState;
}): ReactElement {
  return (
    <>
      <ShowcaseHero query={query} onQueryChange={onQueryChange} />
      <div className="mx-auto max-w-[1080px] px-6 pt-8 pb-20">
        <ShowcaseResults state={state} />
      </div>
    </>
  );
}

/** Binds the query state and the live search to the view (the module's only hook consumer). */
export default function CurriculumShowcase(): ReactElement {
  const [query, setQuery] = useState('');
  const state = useCurriculumSearch(query);
  return <CurriculumShowcaseView query={query} onQueryChange={setQuery} state={state} />;
}
