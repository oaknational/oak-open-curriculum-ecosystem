'use client';

import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';

import { PageHeader } from './SectionScaffold';
import { standardsFacets, browseStandards } from '@/lib/standards-view';
import type { QualityStandard } from '@/lib/static-quality-standards';

/** Sentinel for the "All rubrics" (no rubric constraint) facet selection. */
const ALL = 'ALL';

/** A rubric-filtered standard row: a line-bordered surface-role pill with an accent hover shadow, deep-linking
 *  to the standard's detail on the /standards page (the same `#qs=` target the Course callouts use). */
const rowLinkClass =
  'flex items-center gap-3 rounded-xl border-2 border-line bg-surface px-4 py-3 text-ink no-underline transition-shadow hover:shadow-accent-brand';

/** One quality-standard row under the selected rubric, linking to its /standards detail. */
function RubricStandardRow({ standard }: { readonly standard: QualityStandard }): ReactElement {
  const badge = standard.code === '' ? standard.id : standard.code;
  const area = standard.areas[0];
  return (
    <Link href={`/standards#qs=${standard.id}`} className={rowLinkClass}>
      <span className="shrink-0 rounded-ctl border border-link px-2 py-0.5 text-[11px] font-bold text-link">
        {badge}
      </span>
      <span className="flex-1 text-[14px] leading-snug">{standard.text}</span>
      {area !== undefined && (
        <span className="shrink-0 rounded-full border border-line-soft px-2.5 py-1 text-[11px] font-bold text-ink-subdued">
          {area}
        </span>
      )}
    </Link>
  );
}

/** A rubric facet toggle: the rubric name and its live count; the count carries an sr-only unit so
 *  a screen reader announces "Pedagogical Rubric, 89 standards", not "Pedagogical Rubric, 89". */
function RubricFacet({
  label,
  count,
  pressed,
  onSelect,
}: {
  readonly label: string;
  readonly count: number;
  readonly pressed: boolean;
  readonly onSelect: () => void;
}): ReactElement {
  const tint = pressed ? 'bg-surface-inverted text-ink-inverted' : 'bg-btn-secondary text-ink';
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={`flex items-center gap-2 rounded-full border-2 border-line px-4 py-1.5 text-[13px] font-bold transition-colors ${tint}`}
    >
      <span>{label}</span>
      <span className={pressed ? 'text-ink-inverted/80' : 'text-ink-subdued'}>
        {count}
        <span className="sr-only"> standards</span>
      </span>
    </button>
  );
}

/**
 * The Rubrics page: a real quality-standard facet view over the three assessment rubrics
 * (`Pedagogical Rubric`, `Technical Rubric`, `Curriculum and Lesson Specification - Annex B`). It
 * lists the 299 rubric-bearing standards, filterable to a single rubric, each row deep-linking to
 * its detail on `/standards`. Real data from the `standards-view` seam — no fabrication, no stub.
 */
export default function RubricsBrowser(): ReactElement {
  const [selected, setSelected] = useState<string>(ALL);

  const rubricFacets = useMemo(() => standardsFacets().rubrics, []);
  const rubricBearing = useMemo(() => browseStandards({}).filter((s) => s.rubrics.length > 0), []);
  const results = useMemo(
    () => (selected === ALL ? rubricBearing : browseStandards({ rubric: selected })),
    [selected, rubricBearing],
  );

  const scope = selected === ALL ? '' : ` in ${selected}`;
  const countLabel = `Showing ${results.length} ${results.length === 1 ? 'standard' : 'standards'}${scope}`;

  return (
    <>
      <PageHeader
        title="Rubrics"
        intro="The assessment rubrics behind the Oak quality standards. Filter the rubric-bearing standards by rubric to see exactly which benchmarks each one covers."
        tint="bg-decorative-2"
      />
      <section aria-label="Rubrics results" className="mx-auto max-w-[1080px] px-6 pb-20 pt-8">
        <nav aria-label="Filter by rubric" className="mb-5 flex flex-wrap gap-2.5">
          <RubricFacet
            label="All rubrics"
            count={rubricBearing.length}
            pressed={selected === ALL}
            onSelect={() => setSelected(ALL)}
          />
          {rubricFacets.map((facet) => (
            <RubricFacet
              key={facet.value}
              label={facet.value}
              count={facet.count}
              pressed={selected === facet.value}
              onSelect={() => setSelected(facet.value)}
            />
          ))}
        </nav>
        <output className="mb-4 block text-[14px] text-ink-subdued">{countLabel}</output>
        <div className="flex flex-col gap-2.5">
          {results.map((standard) => (
            <RubricStandardRow key={standard.id} standard={standard} />
          ))}
        </div>
      </section>
    </>
  );
}
