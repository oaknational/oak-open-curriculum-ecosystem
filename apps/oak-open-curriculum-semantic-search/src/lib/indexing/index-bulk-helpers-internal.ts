/**
 * Internal helpers for building Elasticsearch bulk operations.
 *
 * KS4 metadata denormalisation is handled by passing a UnitContextMap through
 * to the document creation functions per ADR-080.
 */

import type { SearchSubjectSlug, SearchUnitSummary, KeyStage } from '../../types/oak';
import { isUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { createUnitDocument } from './document-transforms';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import type { UnitContextMap } from './ks4-context-builder';
import type { BulkOperations } from './bulk-operation-types';

/**
 * Processes a unit summary and creates index operations.
 *
 * @param client - The Oak API client
 * @param unit - The unit to process
 * @param subject - The subject slug
 * @param ks - The key stage
 * @param subjectProgrammesUrl - URL for the subject programmes page
 * @param unitContextMap - KS4 metadata context map
 * @param lessonsByUnit - Aggregated lesson data per unit (if available)
 * @returns The unit summary and index operations, or null if unit not found
 */
export async function processUnitSummary(
  client: OakClient,
  unit: { unitSlug: string; unitTitle: string },
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
  lessonsByUnit?: ReadonlyMap<string, readonly string[]>,
): Promise<{ summary: SearchUnitSummary; ops: BulkOperations } | null> {
  const summaryCandidate: unknown = await client.getUnitSummary(unit.unitSlug);

  // Handle 404 - unit exists in listing but has no summary data
  if (summaryCandidate === null) {
    return null;
  }

  if (!isUnitSummary(summaryCandidate)) {
    throw new Error(`Unexpected unit summary response for ${unit.unitSlug}`);
  }

  // After validation, summaryCandidate is now SearchUnitSummary - don't widen!
  const summary = summaryCandidate;
  const ops = [
    {
      index: {
        _index: resolvePrimarySearchIndexName('units'),
        _id: summary.unitSlug,
      },
    },
    createUnitDocument({
      summary,
      subject,
      keyStage: ks,
      subjectProgrammesUrl,
      unitContextMap,
      lessonsByUnit,
    }),
  ];
  return { summary, ops };
}
