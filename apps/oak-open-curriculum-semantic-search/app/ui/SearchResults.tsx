'use client';

import type { JSX } from 'react';
import type { MultiScopeBucketView, SearchMeta } from './client/useSearchController';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import {
  ResultsSchema,
  ResultsSection,
  ResultsGrid,
  ResultItem,
  extractTitle,
  extractSubject,
  extractKeyStage,
  extractHighlights,
} from './SearchResults.shared';
import { STRUCTURED_EMPTY_RESULTS_MESSAGE } from './content/structured-search-messages';
import { LESSONS_SCOPE, UNITS_SCOPE } from '../../src/lib/search-scopes';

export function SearchResults({
  mode,
  results,
  meta,
  multiBuckets,
  sectionId,
}: {
  mode: 'idle' | 'single' | 'multi';
  results: unknown[];
  meta?: SearchMeta | null;
  multiBuckets: MultiScopeBucketView[] | null;
  sectionId?: string;
}): JSX.Element | null {
  if (mode === 'idle') {
    return (
      <ResultsSection
        as="section"
        id={sectionId}
        aria-live="polite"
        role="status"
        $mt="space-between-xl"
      >
        <OakTypography as="p" $font="body-3" $color="text-subdued">
          Begin a search to explore structured or natural language results.
        </OakTypography>
      </ResultsSection>
    );
  }

  if (mode === 'multi' && multiBuckets) {
    return <MultiScopeResults sectionId={sectionId} buckets={multiBuckets} />;
  }

  return <SingleScopeResults sectionId={sectionId} results={results} meta={meta} />;
}

export default SearchResults;

function MultiScopeResults({
  sectionId,
  buckets,
}: {
  sectionId?: string;
  buckets: MultiScopeBucketView[];
}): JSX.Element | null {
  const bucketsWithData = buckets.filter((bucket) => bucket.results.length > 0);
  if (bucketsWithData.length === 0) {
    return null;
  }

  return (
    <ResultsSection
      as="section"
      id={sectionId}
      aria-live="polite"
      role="status"
      $mt="space-between-xl"
    >
      {bucketsWithData.map((bucket) => (
        <BucketResults key={bucket.scope} bucket={bucket} />
      ))}
    </ResultsSection>
  );
}

function SingleScopeResults({
  sectionId,
  results,
  meta,
}: {
  sectionId?: string;
  results: unknown[];
  meta?: SearchMeta | null;
}): JSX.Element | null {
  const parsed = ResultsSchema.safeParse(results);
  if (!parsed.success) {
    return null;
  }

  const summary = buildSummary(meta);
  const hasResults = parsed.data.length > 0;

  return (
    <ResultsSection
      as="section"
      id={sectionId}
      aria-live="polite"
      role="status"
      $mt="space-between-xl"
    >
      <SearchSummary summary={summary} />
      {hasResults ? (
        <ResultsGrid $reset>
          {parsed.data.map((rec) => (
            <ResultItem
              key={rec.id}
              title={extractTitle(rec)}
              subject={extractSubject(rec)}
              keyStage={extractKeyStage(rec)}
              highlights={extractHighlights(rec)}
            />
          ))}
        </ResultsGrid>
      ) : (
        <EmptyResultsNotice />
      )}
    </ResultsSection>
  );
}

function BucketResults({ bucket }: { bucket: MultiScopeBucketView }): JSX.Element {
  const parsed = ResultsSchema.safeParse(bucket.results);
  if (!parsed.success) {
    return <BucketSection bucket={bucket} results={[]} />;
  }
  return <BucketSection bucket={bucket} results={parsed.data} />;
}

function BucketSection({
  bucket,
  results,
}: {
  bucket: MultiScopeBucketView;
  results: Array<ReturnType<(typeof ResultsSchema)['parse']>[number]>;
}): JSX.Element {
  const summary = buildSummary(bucket.meta);
  const heading = formatScopeHeading(bucket.scope);

  if (results.length === 0) {
    return (
      <OakBox as="section" $display="flex" $flexDirection="column" $gap="space-between-s">
        <OakTypography as="h2" $font="heading-6">
          {heading}
        </OakTypography>
        <SearchSummary summary={summary} />
        <OakTypography as="p" $font="body-3" $color="text-subdued">
          No results found for this category.
        </OakTypography>
      </OakBox>
    );
  }

  return (
    <OakBox as="section" $display="flex" $flexDirection="column" $gap="space-between-s">
      <OakTypography as="h2" $font="heading-6">
        {heading}
      </OakTypography>
      <SearchSummary summary={summary} />
      <ResultsGrid $reset>
        {results.map((rec) => (
          <ResultItem
            key={rec.id}
            title={extractTitle(rec)}
            subject={extractSubject(rec)}
            keyStage={extractKeyStage(rec)}
            highlights={extractHighlights(rec)}
          />
        ))}
      </ResultsGrid>
    </OakBox>
  );
}

function buildSummary(meta?: SearchMeta | null): {
  primary: string | null;
  secondary: string | null;
} {
  if (!meta) {
    return { primary: null, secondary: null };
  }

  const scopeLabel = formatScopeSentence(meta.scope);
  const primary = `${meta.total} result${meta.total === 1 ? '' : 's'} for ${scopeLabel}`;
  const timedOut = meta.timedOut ? 'Results may be incomplete (timed out).' : null;
  const took = `Took ${meta.took}ms`;
  const secondary = timedOut ? `${took}. ${timedOut}` : took;
  return { primary, secondary };
}

function SearchSummary({
  summary,
}: {
  summary: { primary: string | null; secondary: string | null };
}): JSX.Element | null {
  if (!summary.primary && !summary.secondary) {
    return null;
  }

  return (
    <OakBox $display="flex" $flexDirection="column" $gap="space-between-ssx" $mb="space-between-s">
      {summary.primary ? (
        <OakTypography as="p" $font="body-3" $color="text-subdued">
          {summary.primary}
        </OakTypography>
      ) : null}
      {summary.secondary ? (
        <OakTypography as="p" $font="body-4" $color="text-subdued">
          {summary.secondary}
        </OakTypography>
      ) : null}
    </OakBox>
  );
}

function EmptyResultsNotice(): JSX.Element {
  return (
    <OakTypography as="p" $font="body-3" $color="text-subdued">
      {STRUCTURED_EMPTY_RESULTS_MESSAGE}
    </OakTypography>
  );
}

function formatScopeSentence(scope: SearchMeta['scope']): string {
  if (scope === LESSONS_SCOPE) {
    return 'lessons';
  }
  if (scope === UNITS_SCOPE) {
    return 'units';
  }
  return 'programmes';
}

function formatScopeHeading(scope: SearchMeta['scope']): string {
  if (scope === LESSONS_SCOPE) {
    return 'Lessons';
  }
  if (scope === UNITS_SCOPE) {
    return 'Units';
  }
  return 'Programmes';
}
