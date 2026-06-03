import type { SearchSubjectSlug } from '../types/oak';
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
