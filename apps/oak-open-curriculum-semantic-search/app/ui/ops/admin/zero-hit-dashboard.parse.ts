/* eslint-disable @typescript-eslint/no-restricted-types -- REFACTOR */
export interface SummaryScopeBreakdown {
  lessons: number;
  units: number;
  sequences: number;
}

export interface SummarySnapshot {
  total: number;
  byScope: SummaryScopeBreakdown;
  latestIndexVersion: string | null;
}

export interface DashboardEvent {
  timestamp: number;
  scope: 'lessons' | 'units' | 'sequences';
  text: string;
  filters: Record<string, string>;
  indexVersion: string;
}

export interface ZeroHitResponse {
  summary: SummarySnapshot;
  recent: DashboardEvent[];
}

type JsonObject = Record<string, unknown>;

export function parseZeroHitResponse(value: unknown): ZeroHitResponse | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const summary = value.summary;

  const recent = value.recent;
  if (!isSummarySnapshot(summary) || !Array.isArray(recent)) {
    return null;
  }
  const events: DashboardEvent[] = [];
  for (const entry of recent) {
    if (!isDashboardEvent(entry)) {
      return null;
    }
    events.push(entry);
  }
  return { summary, recent: events };
}

function isSummarySnapshot(value: unknown): value is SummarySnapshot {
  if (!isJsonObject(value)) {
    return false;
  }
  return (
    typeof value.total === 'number' &&
    isScopeBreakdown(value.byScope) &&
    isNullableString(value.latestIndexVersion)
  );
}

function isScopeBreakdown(value: unknown): value is SummaryScopeBreakdown {
  if (!isJsonObject(value)) {
    return false;
  }
  return (
    typeof value.lessons === 'number' &&
    typeof value.units === 'number' &&
    typeof value.sequences === 'number'
  );
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isDashboardEvent(value: unknown): value is DashboardEvent {
  if (!isJsonObject(value)) {
    return false;
  }
  return (
    typeof value.timestamp === 'number' &&
    isScope(value.scope) &&
    typeof value.text === 'string' &&
    typeof value.indexVersion === 'string' &&
    isRecordOfStrings(value.filters)
  );
}

function isRecordOfStrings(value: unknown): value is Record<string, string> {
  if (!isJsonObject(value)) {
    return false;
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  return Object.values(value).every((entry) => typeof entry === 'string');
}

function isScope(value: unknown): value is DashboardEvent['scope'] {
  return value === 'lessons' || value === 'units' || value === 'sequences';
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null;
}
