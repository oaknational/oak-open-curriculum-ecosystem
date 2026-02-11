import { z } from 'zod';
import { optionalEnv } from '../../env';
import { getZeroHitRecent, getZeroHitSummary, recordZeroHitEvent } from '../zero-hit-store';
import {
  fetchZeroHitTelemetry,
  persistZeroHitEvent,
  zeroHitPersistenceEnabled,
} from '../zero-hit-persistence';
import type { SearchScope } from '../../../types/oak';

type ZeroHitScope = SearchScope;

/**
 * Zod schema for zero-hit webhook payload.
 * Validates external input at the API boundary.
 */
const WebhookPayloadSchema = z.object({
  scope: z.enum(['lessons', 'units', 'sequences']),
  text: z.string().min(1),
  indexVersion: z.string().min(1),
  filters: z.record(z.string(), z.string()).optional(),
  timestamp: z.number().nonnegative().optional(),
});

type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

export async function handleZeroHitSummary(request: Request): Promise<Response> {
  const envVars = optionalEnv();

  if (!envVars?.SEARCH_API_KEY) {
    return Response.json(buildDisabledTelemetryPayload());
  }

  if (!isAuthorised(request, envVars.SEARCH_API_KEY)) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (zeroHitPersistenceEnabled()) {
    const telemetry = await fetchZeroHitTelemetry({ limit: 50 });
    return Response.json(telemetry);
  }

  const summary = getZeroHitSummary();
  const recent = getZeroHitRecent();
  return Response.json({ summary, recent });
}

export async function handleZeroHitWebhook(request: Request): Promise<Response> {
  const envVars = optionalEnv();

  if (!envVars?.SEARCH_API_KEY) {
    return Response.json({ error: 'Zero-hit telemetry disabled' }, { status: 503 });
  }

  if (!isAuthorised(request, envVars.SEARCH_API_KEY)) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const parsed = parseWebhookPayload(await request.json());
  if (!parsed) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const event = {
    scope: parsed.scope,
    text: parsed.text,
    filters: parsed.filters ?? {},
    indexVersion: parsed.indexVersion,
    timestamp: parsed.timestamp ?? Date.now(),
  };

  recordZeroHitEvent(event);

  if (zeroHitPersistenceEnabled()) {
    await persistZeroHitEvent(event);
  }

  return Response.json({ status: 'accepted' }, { status: 202 });
}

function isAuthorised(request: Request, apiKey: string): boolean {
  const header = request.headers.get('x-search-api-key');
  return typeof header === 'string' && header === apiKey;
}

function buildDisabledTelemetryPayload(): { summary: DisabledSummary; recent: [] } {
  return {
    summary: {
      total: 0,
      byScope: {
        lessons: 0,
        units: 0,
        sequences: 0,
      },
      latestIndexVersion: null,
    },
    recent: [],
  };
}

interface DisabledSummary {
  total: number;
  byScope: Record<ZeroHitScope, number>;
  latestIndexVersion: string | null;
}

/**
 * Parses and validates webhook payload using Zod schema.
 * Returns null if validation fails.
 */
function parseWebhookPayload(value: unknown): WebhookPayload | null {
  const result = WebhookPayloadSchema.safeParse(value);
  if (!result.success) {
    return null;
  }
  return result.data;
}
