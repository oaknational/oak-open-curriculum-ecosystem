'use client';

import type { JSX } from 'react';
import {
  OakBox,
  OakHeading,
  OakSecondaryButton,
  OakTypography,
  OakUL,
} from '@oaknational/oak-components';
import type { SuggestionItem } from './structured-search.shared';

export function SearchSuggestions({
  suggestions,
}: {
  suggestions: SuggestionItem[];
}): JSX.Element | null {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <OakBox
      as="section"
      aria-label="Search suggestions"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-xs"
    >
      <OakHeading tag="h3" $font="heading-6">
        Suggestions
      </OakHeading>
      <OakUL $reset $display="flex" $flexWrap="wrap" $gap="space-between-ssx">
        {suggestions.map((suggestion) => (
          <OakBox as="li" key={`${suggestion.scope}-${suggestion.label}`}>
            <OakSecondaryButton type="button" width="100%" textAlign="left" element="button">
              <OakTypography as="span" $font="body-3-bold">
                {suggestion.label}
              </OakTypography>
              <OakTypography as="span" $display="block" $font="body-4" $color="text-subdued">
                {formatScopeLabel(suggestion.scope)}
              </OakTypography>
            </OakSecondaryButton>
          </OakBox>
        ))}
      </OakUL>
    </OakBox>
  );
}

function formatScopeLabel(scope: SuggestionItem['scope']): string {
  if (scope === 'lessons') {
    return 'Lesson suggestion';
  }
  if (scope === 'units') {
    return 'Unit suggestion';
  }
  return 'Programme suggestion';
}

export default SearchSuggestions;
