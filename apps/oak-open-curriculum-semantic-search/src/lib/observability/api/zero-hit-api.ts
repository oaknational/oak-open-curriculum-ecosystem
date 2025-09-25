import { NextResponse, type NextRequest } from 'next/server';
import { optionalEnv } from '../../env';
import { getZeroHitRecent, getZeroHitSummary, recordZeroHitEvent } from '../zero-hit-store';
import {
  fetchZeroHitTelemetry,
  persistZeroHitEvent,
  zeroHitPersistenceEnabled,
} from '../zero-hit-persistence';

type ZeroHitScope = 'lessons' | 'units' | 'sequences';

interface WebhookPayload {
  scope: ZeroHitScope;
  text: string;
  indexVersion: string;
  filters?: Record<string, string>;
  timestamp?: number;
}

export async function handleZeroHitSummary(request: NextRequest): Promise<Response> {
  const envVars = optionalEnv();

  if (!envVars?.SEARCH_API_KEY) {
    return NextResponse.json(buildDisabledTelemetryPayload());
  }

  if (!isAuthorised(request, envVars.SEARCH_API_KEY)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (zeroHitPersistenceEnabled()) {
    const telemetry = await fetchZeroHitTelemetry({ limit: 50 });
    return NextResponse.json(telemetry);
  }

  const summary = getZeroHitSummary();
  const recent = getZeroHitRecent();
  return NextResponse.json({ summary, recent });
}

export async function handleZeroHitWebhook(request: NextRequest): Promise<Response> {
  const envVars = optionalEnv();

  if (!envVars?.SEARCH_API_KEY) {
    return NextResponse.json({ error: 'Zero-hit telemetry disabled' }, { status: 503 });
  }

  if (!isAuthorised(request, envVars.SEARCH_API_KEY)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const parsed = parseWebhookPayload(await request.json());
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
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

  return NextResponse.json({ status: 'accepted' }, { status: 202 });
}

function isAuthorised(request: NextRequest, apiKey: string): boolean {
  const header = request.headers.get('x-search-api-key');
  return typeof header === 'string' && header === apiKey;
}

function buildDisabledTelemetryPayload(): { summary: DisabledSummary; recent: [] } {
  return {
    summary: {
      total: 0,
      byScope: { lessons: 0, units: 0, sequences: 0 },
      latestIndexVersion: null,
    },
    recent: [],
  };
}

interface DisabledSummary {
  total: number;
  byScope: { lessons: number; units: number; sequences: number };
  latestIndexVersion: string | null;
}

interface JsonObject {
  [key: string]: unknown;
}

interface StringMap {
  [key: string]: string;
}

function parseWebhookPayload(value: unknown): WebhookPayload | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const base = extractBaseFields(value);
  if (!base) {
    return null;
  }

  const filters = extractFilters(value.filters);
  if (filters === null) {
    return null;
  }

  const timestamp = extractTimestamp(value.timestamp);
  if (timestamp === null) {
    return null;
  }

  return {
    scope: base.scope,
    text: base.text,
    indexVersion: base.indexVersion,
    filters: filters ?? undefined,
    timestamp: timestamp ?? undefined,
  };
}

function extractBaseFields(
  value: JsonObject,
): { scope: ZeroHitScope; text: string; indexVersion: string } | null {
  const { scope, text, indexVersion } = value;
  if (!isScope(scope) || !isValidString(text) || !isValidString(indexVersion)) {
    return null;
  }
  return { scope, text, indexVersion };
}

function extractFilters(input: unknown): StringMap | undefined | null {
  if (input === undefined) {
    return undefined;
  }
  if (!isJsonObject(input)) {
    return null;
  }
  const result: StringMap = {};
  for (const [key, entry] of Object.entries(input)) {
    if (typeof entry !== 'string') {
      return null;
    }
    result[key] = entry;
  }
  return result;
}

function extractTimestamp(input: unknown): number | undefined | null {
  if (input === undefined) {
    return undefined;
  }
  if (typeof input !== 'number' || !Number.isFinite(input) || input < 0) {
    return null;
  }
  return input;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null;
}

function isScope(value: unknown): value is ZeroHitScope {
  return value === 'lessons' || value === 'units' || value === 'sequences';
}

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}
