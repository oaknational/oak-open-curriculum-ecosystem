import type { SearchSubjectSlug } from '../types/oak';
import type { SubjectSequenceEntry } from '../adapters/oak-adapter';
import type { SequenceFacetProcessingMetrics } from './indexing/sequence-facet-index';

/** Emit sequence facet events to callback if provided. */
export function emitSequenceFacetEvents(
  events: readonly SequenceFacetProcessingMetrics[],
  subject: SearchSubjectSlug,
  onEvent:
    | ((details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug }) => void)
    | undefined,
): void {
  if (!onEvent) {
    return;
  }
  for (const event of events) {
    onEvent({ ...event, subject });
  }
}

/** Resolve sequence slug from a subject sequence entry. */
export function resolveSequenceSlugFromEntry(entry: SubjectSequenceEntry): string {
  if (typeof entry === 'string') {
    return entry;
  }
  if (typeof entry === 'object' && entry !== null && 'sequenceSlug' in entry) {
    const slug = entry.sequenceSlug;
    if (typeof slug === 'string') {
      return slug;
    }
  }
  throw new Error(`Cannot resolve sequence slug from entry: ${JSON.stringify(entry)}`);
}
