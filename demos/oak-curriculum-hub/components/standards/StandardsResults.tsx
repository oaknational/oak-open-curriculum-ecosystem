import Link from 'next/link';
import type { ReactElement } from 'react';
import type { FilterChip, StandardsView } from '@/lib/standards-view-model';
import { StandardCard } from './StandardCard';

/**
 * The results column of the `/standards` browser: the deep-link focus banner, the result toolbar,
 * the type/rubric filter chips, the paginated card list (or the empty state), and the pagination
 * controls. Presentational — every branch is decided by the {@link StandardsView} it is given.
 */

function ChipRow({
  label,
  chips,
  onPick,
}: {
  readonly label: string;
  readonly chips: readonly FilterChip[];
  readonly onPick: (value: string) => void;
}): ReactElement {
  return (
    // Native form-control grouping: the chips are aria-pressed buttons, so
    // fieldset/legend is the native structure (Sonar S6819). The legend names
    // the group for AT; the aria-hidden span carries the visible label inside
    // the flex row (a floated legend cannot join flex layout).
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="sr-only">{label}</legend>
      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden="true"
          className="mr-0.5 text-[12px] font-bold uppercase tracking-[0.04em] text-ink-subdued"
        >
          {label}
        </span>
        {chips.map((chip) => (
          <button
            key={chip.value}
            type="button"
            aria-pressed={chip.active}
            onClick={() => onPick(chip.value)}
            className={`rounded-full border-2 border-line px-3.5 py-2 text-[13px] font-bold ${
              chip.active
                ? 'bg-surface-inverted text-ink-inverted'
                : 'bg-btn-secondary text-ink hover:shadow-accent-brand'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function FocusBanner({ onBrowseAll }: { readonly onBrowseAll: () => void }): ReactElement {
  return (
    <div className="mb-[18px] flex flex-wrap items-center gap-3.5 rounded-large border-2 border-line bg-info-subtle px-[18px] py-3.5">
      <span className="flex-1 text-[15px] font-semibold leading-[21px] text-ink">
        You followed a link from a training course. Showing the linked quality standard(s) below.
      </span>
      <Link
        href="/course"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-btn-primary bg-btn-primary px-4 py-2.5 text-[13px] font-bold text-btn-primary-ink"
      >
        <span aria-hidden="true">←</span> Return to training
      </Link>
      <button
        type="button"
        onClick={() => onBrowseAll()}
        className="shrink-0 rounded-full border-2 border-link bg-btn-secondary px-4 py-2 text-[13px] font-bold text-link"
      >
        Browse all standards
      </button>
    </div>
  );
}

function NoResults({ onReset }: { readonly onReset: () => void }): ReactElement {
  return (
    <div className="rounded-large border-2 border-dashed border-line-soft bg-white p-11 text-center">
      <p className="mb-1.5 text-[20px] font-semibold leading-[26px]">
        No standards match your filters
      </p>
      <p className="mb-4 text-[16px] leading-[24px] text-ink-subdued">
        Try clearing a filter or searching for a different term.
      </p>
      <button
        type="button"
        onClick={() => onReset()}
        className="rounded-full border-2 border-line bg-surface-inverted px-4 py-2.5 text-[14px] font-bold text-ink-inverted"
      >
        Reset filters
      </button>
    </div>
  );
}

/** Focus banner (deep-link mode), the result-count toolbar, and the type/rubric filter chips. */
function ResultsHeader({
  view,
  onPickType,
  onPickRubric,
  onReset,
}: {
  readonly view: StandardsView;
  readonly onPickType: (value: string) => void;
  readonly onPickRubric: (value: string) => void;
  readonly onReset: () => void;
}): ReactElement {
  return (
    <>
      {view.focusMode && <FocusBanner onBrowseAll={onReset} />}
      <div className="mb-2 flex flex-wrap items-center gap-4">
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-[16px] font-semibold"
        >
          {view.resultLabel}
        </p>
        {view.hasFilters && (
          <button
            type="button"
            onClick={() => onReset()}
            className="rounded-full border-2 border-line bg-btn-secondary px-3.5 py-1.5 text-[13px] font-semibold shadow-accent-brand"
          >
            Reset filters
          </button>
        )}
      </div>
      {!view.focusMode && (
        <div className="my-[22px] flex flex-col gap-3.5 border-t border-line-soft pt-[22px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 sm:border-t-0 sm:pt-0">
          <ChipRow label="Type" chips={view.typeChips} onPick={onPickType} />
          <ChipRow label="Rubric" chips={view.rubricChips} onPick={onPickRubric} />
        </div>
      )}
    </>
  );
}

/** The "show more" / "show all" pagination controls; renders nothing once the list is complete. */
function Pagination({
  view,
  onShowMore,
  onShowAll,
}: {
  readonly view: StandardsView;
  readonly onShowMore: () => void;
  readonly onShowAll: () => void;
}): ReactElement | null {
  if (!view.hasMore) {
    return null;
  }
  return (
    <div className="mt-[22px] flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onShowMore()}
        className="rounded-full border-2 border-line bg-surface-inverted px-[22px] py-3 text-[15px] font-bold text-ink-inverted shadow-accent-brand"
      >
        Show {view.nextStep} more
      </button>
      <button
        type="button"
        onClick={() => onShowAll()}
        className="rounded-full border-2 border-line bg-btn-secondary px-[22px] py-3 text-[15px] font-bold text-ink"
      >
        Show all {view.showAllCount}
      </button>
    </div>
  );
}

export function StandardsResults({
  view,
  onPickType,
  onPickRubric,
  onReset,
  onShowMore,
  onShowAll,
  onOpen,
}: {
  readonly view: StandardsView;
  readonly onPickType: (value: string) => void;
  readonly onPickRubric: (value: string) => void;
  readonly onReset: () => void;
  readonly onShowMore: () => void;
  readonly onShowAll: () => void;
  readonly onOpen: (id: string) => void;
}): ReactElement {
  return (
    <>
      <ResultsHeader
        view={view}
        onPickType={onPickType}
        onPickRubric={onPickRubric}
        onReset={onReset}
      />
      {view.noResults ? (
        <NoResults onReset={onReset} />
      ) : (
        <ul className="flex list-none flex-col gap-3.5 p-0">
          {view.results.map((card) => (
            <li key={card.id}>
              <StandardCard card={card} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      )}
      <Pagination view={view} onShowMore={onShowMore} onShowAll={onShowAll} />
    </>
  );
}
