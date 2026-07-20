'use client';

import { useId } from 'react';
import type { ReactElement, RefObject } from 'react';
import type { AreaRailItem, StandardsBrowseState, StandardsView } from '@/lib/standards-view-model';
import { StandardDetail } from './standards/StandardDetail';
import { StandardsResults } from './standards/StandardsResults';
import { useStandardsBrowser } from './standards/useStandardsBrowser';

/**
 * The Oak Quality Standards browser (`/standards`), reproducing `Oak Standards.dc.html`: a
 * guidance-area filter rail with context-sensitive counts, type/rubric filter chips, free-text
 * search, a paginated result list over the 685 real standards, and `#qs=…` deep-link focus mode
 * (the target of the training-course quality-standard callouts). All branching lives in the pure
 * {@link buildStandardsView}; this component owns interaction state and composition only.
 */

function SearchField({
  value,
  onChange,
}: {
  readonly value: string;
  readonly onChange: (next: string) => void;
}): ReactElement {
  const id = useId();
  return (
    <div className="flex max-w-[560px] items-center gap-2.5 rounded-full border-[3px] border-line bg-surface px-4 py-2.5 shadow-accent-wide-brand">
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="shrink-0 text-ink-subdued"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <label htmlFor={id} className="sr-only">
        Search quality standards
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search standards…"
        className="w-full border-none bg-transparent text-[17px] text-ink"
      />
    </div>
  );
}

function PageHead({
  query,
  onSearch,
}: {
  readonly query: string;
  readonly onSearch: (next: string) => void;
}): ReactElement {
  return (
    <header className="border-b-[3px] border-line bg-decorative-3-subtle">
      <div className="mx-auto max-w-[1320px] px-7 pb-[30px] pt-[34px]">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-ink-subdued">
          Single source of truth
        </p>
        <h1 className="mb-3 text-[42px] font-semibold leading-[48px] text-balance">
          Quality standards
        </h1>
        <p className="mb-[22px] max-w-[72ch] text-[19px] leading-[28px] text-ink">
          The benchmarks every Oak lesson is held to. Browse and filter by guidance area, rubric and
          resource — each standard shows exactly where it applies. Links from training courses bring
          you straight here.
        </p>
        <SearchField value={query} onChange={onSearch} />
      </div>
    </header>
  );
}

function AreaRail({
  items,
  onPick,
}: {
  readonly items: readonly AreaRailItem[];
  readonly onPick: (value: string) => void;
}): ReactElement {
  return (
    <nav aria-label="Filter by guidance area" className="flex flex-col gap-0.5">
      <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.05em] text-ink-subdued">
        Guidance area
      </p>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={item.active}
          onClick={() => onPick(item.value)}
          className={`flex items-center gap-2 rounded-card px-3 py-2.5 text-left text-[14px] leading-[18px] ${
            item.active
              ? 'bg-surface-inverted font-bold text-ink-inverted'
              : 'text-ink hover:bg-surface-subtle'
          }`}
        >
          <span className="flex-1">{item.label}</span>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
              item.active ? 'bg-surface/20 text-ink-inverted' : 'bg-surface-subtle text-ink-subdued'
            }`}
          >
            {item.count}
          </span>
        </button>
      ))}
    </nav>
  );
}

/** The browse layout: the guidance-area rail beside the paginated results column. */
function BrowseView({
  view,
  regionRef,
  onFilter,
  onReset,
  onShowMore,
  onShowAll,
  onOpen,
}: {
  readonly view: StandardsView;
  readonly regionRef: RefObject<HTMLElement | null>;
  readonly onFilter: (patch: Partial<StandardsBrowseState>) => void;
  readonly onReset: () => void;
  readonly onShowMore: () => void;
  readonly onShowAll: () => void;
  readonly onOpen: (id: string) => void;
}): ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-0 md:flex-row">
      {/* The rail stacks above the results below md: (290px beside results reflow-fails at 320). */}
      <aside className="self-stretch border-b-2 border-line-soft px-5 pb-6 pt-[26px] md:shrink-0 md:basis-[290px] md:border-b-0 md:border-r-2 md:pb-[60px]">
        <AreaRail items={view.rail} onPick={(area) => onFilter({ area })} />
      </aside>
      {/* A labelled region (not a second <main>: layout.tsx already owns the main landmark); it is
          the programmatic focus target when a deep-link, pagination or detail-close changes it. */}
      <section
        ref={regionRef}
        tabIndex={-1}
        aria-label="Quality standards results"
        className="min-w-0 flex-1 px-7 pb-20 pt-[26px] outline-none"
      >
        <StandardsResults
          view={view}
          onPickType={(type) => onFilter({ type })}
          onPickRubric={(rubric) => onFilter({ rubric })}
          onReset={onReset}
          onShowMore={onShowMore}
          onShowAll={onShowAll}
          onOpen={onOpen}
        />
      </section>
    </div>
  );
}

export default function StandardsBrowser(): ReactElement {
  const model = useStandardsBrowser();
  return (
    <>
      <PageHead query={model.query} onSearch={model.search} />
      {model.view.detail === null ? (
        <BrowseView
          view={model.view}
          regionRef={model.regionRef}
          onFilter={model.filterTo}
          onReset={model.reset}
          onShowMore={model.showMore}
          onShowAll={model.showAll}
          onOpen={model.open}
        />
      ) : (
        <StandardDetail
          detail={model.view.detail}
          rootRef={model.detailRef}
          onBack={model.back}
          onOpenRelated={model.open}
        />
      )}
    </>
  );
}
