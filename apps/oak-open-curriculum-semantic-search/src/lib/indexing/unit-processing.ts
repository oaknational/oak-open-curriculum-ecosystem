/**
 * Unit processing for bulk indexing operations.
 *
 * Handles fetching unit summaries and creating ES bulk operations.
 * All SDK methods return Result<T, SdkFetchError> per ADR-088.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { createUnitDocument } from './document-transforms';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import type { UnitContextMap } from './ks4-context-builder';
import type { BulkOperations } from './bulk-operation-types';
import type { SdkFetchError } from '@oaknational/oak-curriculum-sdk';
import { formatSdkError } from '@oaknational/oak-curriculum-sdk';
import { getIngestionErrorCollector } from './ingestion-error-collector';
import { ingestLogger } from '../logger';

/**
 * Processes a unit summary and creates index operations.
 *
 * Uses Result pattern (ADR-088) for explicit error handling.
 * Recoverable errors (404, 5xx) are logged and skipped.
 * Non-recoverable errors are propagated.
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
  const result = await client.getUnitSummary(unit.unitSlug);

  if (!result.ok) {
    return handleUnitError(result.error, unit.unitSlug, subject, ks);
  }

  const summary = result.value;
  const ops = [
    { index: { _index: resolvePrimarySearchIndexName('units'), _id: summary.unitSlug } },
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

/** Handles unit fetch errors, returning null for recoverable errors. */
function handleUnitError(
  error: SdkFetchError,
  unitSlug: string,
  subject: SearchSubjectSlug,
  ks: KeyStage,
): null {
  const errorCollector = getIngestionErrorCollector();
  const context = { unitSlug, subject, keyStage: ks };
  const errorDetail = formatSdkError(error);

  switch (error.kind) {
    case 'not_found':
      errorCollector.record404(context, 'getUnitSummary');
      ingestLogger.warn(`Unit not_found - skipping`, { ...context, errorDetail });
      return null;

    case 'server_error':
      errorCollector.record500Error(context, 'getUnitSummary');
      ingestLogger.warn(`Unit server_error - skipping`, { ...context, errorDetail });
      return null;

    case 'rate_limited':
      errorCollector.recordError(`Rate limited: ${errorDetail}`, context, 429);
      throw new Error(`Rate limited: ${errorDetail}`);

    case 'network_error':
      errorCollector.recordError(`Network error: ${error.cause.message}`, context);
      throw error.cause;

    case 'validation_error':
      errorCollector.recordError(errorDetail, context);
      throw new Error(errorDetail);

    default: {
      // Exhaustiveness check - should never reach here
      const exhaustive: never = error;
      throw new Error(`Unknown error kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}
