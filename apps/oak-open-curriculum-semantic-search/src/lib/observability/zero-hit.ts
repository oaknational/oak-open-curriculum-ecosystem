import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { searchLogger } from '../logger';
import { recordZeroHitEvent } from './zero-hit-store';

/**
 * Parameters required to emit a zero-hit telemetry event.
 */
export interface ZeroHitPayload {
  total: number;
  scope: 'lessons' | 'units' | 'sequences';
  text: string;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  phaseSlug?: string;
  indexVersion: string;
  webhookUrl?: string;
  fetchImpl?: typeof fetch;
}

/**
 * Emit structured logs (and optional webhook) when searches return zero hits.
 */
export async function logZeroHit(payload: ZeroHitPayload): Promise<void> {
  if (payload.total !== 0) {
    return;
  }

  const filters = extractFilters(payload);
  const logContext = {
    scope: payload.scope,
    text: payload.text,
    filters,
    indexVersion: payload.indexVersion,
  };

  searchLogger.info('semantic-search.zero-hit', logContext);

  recordZeroHitEvent({
    scope: payload.scope,
    text: payload.text,
    filters,
    indexVersion: payload.indexVersion,
  });

  const url = payload.webhookUrl;
  if (!url || url === 'none') {
    return;
  }

  const fetcher = payload.fetchImpl ?? fetch;
  const body = {
    event: 'semantic-search.zero-hit',
    scope: payload.scope,
    text: payload.text,
    filters,
    indexVersion: payload.indexVersion,
  };

  try {
    await fetcher(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (error: unknown) {
    searchLogger.error('Zero-hit webhook request failed', error, {
      scope: payload.scope,
    });
  }
}

function extractFilters(payload: ZeroHitPayload): Record<string, string> {
  const filters: Record<string, string> = {};
  if (payload.subject) {
    filters.subject = payload.subject;
  }
  if (payload.keyStage) {
    filters.keyStage = payload.keyStage;
  }
  if (payload.phaseSlug) {
    filters.phaseSlug = payload.phaseSlug;
  }
  return filters;
}
