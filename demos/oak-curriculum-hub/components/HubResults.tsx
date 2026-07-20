'use client';

import type { ReactElement } from 'react';
import type { CurriculumSearchState } from '@/lib/use-curriculum-search';
import { searchHub } from '@/lib/hub-search';
import type { SearchResults } from '@/lib/search-types';
import { GroupHeader, Notice, mutedClass, TrainingGroup, StandardsGroup } from './HubLocalGroups';
import { LessonCard, UnitCard, ThreadCard } from './ResultCards';

const groupLabelClass = 'mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-ink-subdued';

function CurriculumBody({ results }: { readonly results: SearchResults }): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {results.lessons.length > 0 && (
        <div>
          <div className={groupLabelClass}>Lessons</div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(330px,100%),1fr))] gap-3">
            {results.lessons.map((h) => (
              <LessonCard key={h.id} hit={h} />
            ))}
          </div>
        </div>
      )}
      {results.units.length > 0 && (
        <div>
          <div className={groupLabelClass}>Units</div>
          <div className="flex flex-col gap-2.5">
            {results.units.map((h) => (
              <UnitCard key={h.id} hit={h} />
            ))}
          </div>
        </div>
      )}
      {results.threads.length > 0 && (
        <div>
          <div className={groupLabelClass}>Learning threads</div>
          <div className="flex flex-wrap gap-2.5">
            {results.threads.map((h) => (
              <ThreadCard key={h.id} hit={h} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** The screen-reader announcement of the hub search state, fed to the single persistent live
 *  region {@link HubLanding} owns (WCAG 2.2 SC 4.1.3). The loading string is deliberately
 *  CONSTANT — identical text re-rendered is not a DOM mutation, so continuous typing produces at
 *  most one "Searching…" announcement; the settled string names the query so each settle is one
 *  honest mutation. Idle announces nothing (empty region, mounted before its first message). */
export function curriculumAnnouncement(state: CurriculumSearchState, query: string): string {
  if (state.status === 'ok') {
    const { lessons, units, threads } = state.results;
    const total = lessons.length + units.length + threads.length;
    return `${total} ${total === 1 ? 'result' : 'results'} for “${query.trim()}” from the Oak curriculum`;
  }
  if (state.status === 'loading') {
    return 'Searching the Oak curriculum';
  }
  if (state.status === 'unconfigured') {
    return 'Oak curriculum search is not configured';
  }
  if (state.status === 'error') {
    return 'Oak curriculum search failed';
  }
  // 'empty' announces the no-results state; 'idle' keeps the mounted region silent.
  return state.status === 'empty' ? 'No matching Oak curriculum results' : '';
}

/** The live "From the Oak curriculum" group — lessons, units and threads via the SDK seam. The
 *  async state is announced by {@link HubLanding}'s persistent live region, not here — a region
 *  mounted mid-lifecycle with content already in place is unreliably announced. Exported for
 *  direct component tests. */
export function CurriculumGroup({
  state,
}: {
  readonly state: CurriculumSearchState;
}): ReactElement {
  return (
    <section>
      <GroupHeader
        title="From the Oak curriculum"
        tint="bg-decorative-1"
        live
        subtitle="Lessons, units and threads from thenational.academy"
      />
      {state.status === 'loading' && <p className={mutedClass}>Searching…</p>}
      {state.status === 'ok' && <CurriculumBody results={state.results} />}
      {state.status === 'empty' && (
        <p className={mutedClass}>No matching lessons, units or threads.</p>
      )}
      {state.status === 'unconfigured' && (
        <Notice
          title="Search backend not configured"
          body="Set ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY in .env to connect live curriculum search."
        />
      )}
      {state.status === 'error' && (
        <Notice
          title="Something went wrong"
          body="The curriculum search request failed. Check the server logs."
        />
      )}
    </section>
  );
}

/** Results header: the visible results-for-query heading plus a clear-search control. Carries NO
 *  live-region semantics — a visible element announcing per keystroke is churn, not status; the
 *  destinations→results toggle is announced by {@link HubLanding}'s persistent region instead
 *  (WCAG 2.2 SC 4.1.3). Focus is deliberately NOT moved. Exported for direct component tests. */
export function ResultsHeader({
  query,
  onClear,
}: {
  readonly query: string;
  readonly onClear: () => void;
}): ReactElement {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <p className="text-[22px] font-semibold leading-tight">
        Results for &ldquo;{query.trim()}&rdquo;
      </p>
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 rounded-full border-2 border-line bg-btn-secondary px-4 py-1.5 text-[13px] font-bold text-ink transition-shadow hover:shadow-accent-brand"
      >
        Clear search
      </button>
    </div>
  );
}

/**
 * The unified hub-wide search results view: the static training-courses and quality-standards
 * groups first (the hub's own specialist content), then the live curriculum group below as
 * the secondary tier (E2 — the primary/secondary hierarchy the flat ordering blurred), all
 * keyed off one query. Pure over its inputs — the curriculum search state arrives as a prop
 * (the same seam {@link CurriculumGroup} models), so the ordering contract is testable
 * without stubbing the hook. Exported for component tests.
 */
export function HubResultsView({
  query,
  onClear,
  curriculum,
}: {
  readonly query: string;
  readonly onClear: () => void;
  readonly curriculum: CurriculumSearchState;
}): ReactElement {
  const { courseHits, stdHits } = searchHub(query);
  return (
    <div className="mx-auto max-w-[1080px] px-6 pt-8 pb-20">
      <ResultsHeader query={query} onClear={onClear} />
      <div className="flex flex-col gap-9">
        <TrainingGroup hits={courseHits} />
        <StandardsGroup hits={stdHits} />
        <CurriculumGroup state={curriculum} />
      </div>
    </div>
  );
}
