import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { searchLogger } from '../logger';
import { recordZeroHitEvent } from './zero-hit-store';
import { persistZeroHitEvent, zeroHitPersistenceEnabled } from './zero-hit-persistence';
import type { ZeroHitEvent } from './zero-hit-store';

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
  took?: number;
  timedOut?: boolean;
  requestId?: string;
  sessionId?: string;
}

/**
 * Emit structured logs (and optional webhook) when searches return zero hits.
 */
export async function logZeroHit(payload: ZeroHitPayload): Promise<void> {
  if (payload.total !== 0) {
    return;
  }

  const filters = extractFilters(payload);
  const timestamp = Date.now();
  const logContext = {
    scope: payload.scope,
    text: payload.text,
    filters,
    indexVersion: payload.indexVersion,
  };

  searchLogger.info('semantic-search.zero-hit', logContext);

  const event = buildZeroHitEvent(payload, filters, timestamp);
  recordZeroHitEvent(event);
  await persistZeroHitIfEnabled(event);
  await dispatchZeroHitWebhook(payload, filters);
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

function buildZeroHitEvent(
  payload: ZeroHitPayload,
  filters: Record<string, string>,
  timestamp: number,
): ZeroHitEvent {
  return {
    scope: payload.scope,
    text: payload.text,
    filters,
    indexVersion: payload.indexVersion,
    tookMs: payload.took,
    timedOut: payload.timedOut,
    requestId: payload.requestId,
    sessionId: payload.sessionId,
    timestamp,
  };
}

async function persistZeroHitIfEnabled(event: ZeroHitEvent): Promise<void> {
  if (!zeroHitPersistenceEnabled()) {
    return;
  }
  await persistZeroHitEvent(event);
}

async function dispatchZeroHitWebhook(
  payload: ZeroHitPayload,
  filters: Record<string, string>,
): Promise<void> {
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
    tookMs: payload.took,
    timedOut: payload.timedOut,
    requestId: payload.requestId,
    sessionId: payload.sessionId,
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
