'use client';

import type { JSX } from 'react';
import { renderSafeHighlight } from './searchResultsHighlight';
import {
  ResultCard,
  ResultHeading,
  ResultHighlightItem,
  ResultHighlightList,
  ResultMetaBadge,
  ResultMetaList,
} from './SearchResults.styles';

function buildMetaEntries(
  subject: string,
  keyStage: string,
): Array<{
  kind: 'subject' | 'key-stage';
  label: string;
  testId: `search-result-meta-${string}`;
}> {
  const entries: Array<{
    kind: 'subject' | 'key-stage';
    label: string;
    testId: `search-result-meta-${string}`;
  }> = [];
  if (subject) {
    entries.push({
      kind: 'subject',
      label: `Subject: ${subject}`,
      testId: 'search-result-meta-subject',
    });
  }
  if (keyStage) {
    entries.push({
      kind: 'key-stage',
      label: `Key stage: ${keyStage}`,
      testId: 'search-result-meta-key-stage',
    });
  }
  return entries;
}

export function ResultItem({
  title,
  subject,
  keyStage,
  highlights,
}: {
  title: string;
  subject: string;
  keyStage: string;
  highlights: string[];
}): JSX.Element {
  const metaEntries = buildMetaEntries(subject, keyStage);

  return (
    <ResultCard as="li">
      <ResultHeading as="h3" $font="heading-6">
        {title}
      </ResultHeading>
      {metaEntries.length > 0 ? (
        <ResultMetaList data-testid="search-result-meta">
          {metaEntries.map((entry) => (
            <ResultMetaBadge key={entry.kind} data-testid={entry.testId}>
              {entry.label}
            </ResultMetaBadge>
          ))}
        </ResultMetaList>
      ) : null}
      {highlights.length > 0 ? (
        <ResultHighlightList>
          {highlights.map((highlight, index) => (
            <ResultHighlightItem key={index} data-testid="search-result-highlight-item">
              {renderSafeHighlight(String(highlight))}
            </ResultHighlightItem>
          ))}
        </ResultHighlightList>
      ) : null}
    </ResultCard>
  );
}

export { ResultsSection, ResultsSummaryContainer, ResultsGrid } from './SearchResults.styles';

export {
  extractTitle,
  extractSubject,
  extractKeyStage,
  extractHighlights,
} from './SearchResults.extractors';

export {
  LessonResultsSchema,
  UnitResultsSchema,
  SequenceResultsSchema,
  parseResultsForScope,
  type SearchResultItem,
  type SearchResultArray,
} from './SearchResults.schemas';
