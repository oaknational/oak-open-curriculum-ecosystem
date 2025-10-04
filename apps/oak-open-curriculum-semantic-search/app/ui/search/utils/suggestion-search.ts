import type {
  SearchStructuredRequest,
  SearchSuggestionItem,
} from '@oaknational/oak-curriculum-sdk';

export interface BuildSuggestionFollowUpInputArgs {
  base: SearchStructuredRequest | null;
  suggestion: SearchSuggestionItem;
}

export function buildSuggestionFollowUpInput({
  base,
  suggestion,
}: BuildSuggestionFollowUpInputArgs): SearchStructuredRequest | null {
  if (!base) {
    return null;
  }

  return {
    ...base,
    scope: suggestion.scope,
    text: resolveText(suggestion),
    includeFacets: base.includeFacets ?? true,
    subject: resolveSubject(base, suggestion),
    keyStage: resolveKeyStage(base, suggestion),
    phaseSlug: resolvePhaseSlug(base, suggestion),
  } satisfies SearchStructuredRequest;
}

function resolveText(suggestion: SearchSuggestionItem): string {
  const trimmed = suggestion.label.trim();
  return trimmed.length > 0 ? trimmed : suggestion.label;
}

function resolveSubject(
  base: SearchStructuredRequest,
  suggestion: SearchSuggestionItem,
): SearchStructuredRequest['subject'] {
  return suggestion.subject ?? base.subject ?? undefined;
}

function resolveKeyStage(
  base: SearchStructuredRequest,
  suggestion: SearchSuggestionItem,
): SearchStructuredRequest['keyStage'] {
  return suggestion.keyStage ?? base.keyStage ?? undefined;
}

function resolvePhaseSlug(
  base: SearchStructuredRequest,
  suggestion: SearchSuggestionItem,
): SearchStructuredRequest['phaseSlug'] {
  if (suggestion.scope !== 'sequences') {
    return undefined;
  }
  return suggestion.contexts?.phaseSlug ?? base.phaseSlug ?? undefined;
}
