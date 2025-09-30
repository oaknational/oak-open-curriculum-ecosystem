import type { StructuredBody, SuggestionItem } from '../structured-search.shared';

export interface BuildSuggestionFollowUpInputArgs {
  base: StructuredBody | null;
  suggestion: SuggestionItem;
}

export function buildSuggestionFollowUpInput({
  base,
  suggestion,
}: BuildSuggestionFollowUpInputArgs): StructuredBody | null {
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
  } satisfies StructuredBody;
}

function resolveText(suggestion: SuggestionItem): string {
  const trimmed = suggestion.label.trim();
  return trimmed.length > 0 ? trimmed : suggestion.label;
}

function resolveSubject(
  base: StructuredBody,
  suggestion: SuggestionItem,
): StructuredBody['subject'] {
  return suggestion.subject ?? base.subject ?? undefined;
}

function resolveKeyStage(
  base: StructuredBody,
  suggestion: SuggestionItem,
): StructuredBody['keyStage'] {
  return suggestion.keyStage ?? base.keyStage ?? undefined;
}

function resolvePhaseSlug(
  base: StructuredBody,
  suggestion: SuggestionItem,
): StructuredBody['phaseSlug'] {
  if (suggestion.scope !== 'sequences') {
    return undefined;
  }
  return suggestion.contexts?.phaseSlug ?? base.phaseSlug ?? undefined;
}
