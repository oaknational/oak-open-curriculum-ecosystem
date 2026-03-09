/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Zero-hit telemetry fixtures derived from SDK-owned schema definitions.
 */

import { z } from 'zod';

export const ZERO_HIT_SCOPES = ['lessons', 'units', 'sequences'] as const;
export const ZeroHitScopeSchema = z.enum(ZERO_HIT_SCOPES);
export type ZeroHitScope = z.infer<typeof ZeroHitScopeSchema>;

export const ZeroHitScopeBreakdownSchema = z
  .object({
    lessons: z.number().int().nonnegative(),
    units: z.number().int().nonnegative(),
    sequences: z.number().int().nonnegative(),
  })
  .strict();
export type ZeroHitScopeBreakdown = z.infer<typeof ZeroHitScopeBreakdownSchema>;

export const ZeroHitSummarySchema = z
  .object({
    total: z.number().int().nonnegative(),
    byScope: ZeroHitScopeBreakdownSchema,
    latestIndexVersion: z.string().min(1).nullable(),
  })
  .strict();
export type ZeroHitSummary = z.infer<typeof ZeroHitSummarySchema>;

export const ZeroHitEventSchema = z
  .object({
    timestamp: z.number().int().nonnegative(),
    scope: ZeroHitScopeSchema,
    query: z.string().min(1),
    filters: z.record(z.string(), z.string()),
    indexVersion: z.string().min(1),
    tookMs: z.number().int().nonnegative().optional(),
    timedOut: z.boolean().optional(),
    requestId: z.string().min(1).optional(),
    sessionId: z.string().min(1).optional(),
  })
  .strict();
export type ZeroHitEvent = z.infer<typeof ZeroHitEventSchema>;

export const ZeroHitTelemetrySchema = z
  .object({
    summary: ZeroHitSummarySchema,
    recent: z.array(ZeroHitEventSchema),
  })
  .strict();
export type ZeroHitTelemetry = z.infer<typeof ZeroHitTelemetrySchema>;

const DEFAULT_TIMESTAMP = Date.UTC(2024, 0, 1, 12, 0, 0);
const DEFAULT_INDEX_VERSION = '2024.01.0';

function assertValid<T>(schema: z.ZodType<T>, value: unknown, label: string): T {
  try {
    return schema.parse(value);
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'Unknown error';
    throw new Error('Invalid zero-hit fixture: ' + label + '. ' + message, { cause: error });
  }
}

function cloneFilters(filters: Record<string, string>): Record<string, string> {
  return { ...filters };
}

/** Create a deterministic zero-hit event fixture with validation. */
export function createZeroHitEvent(overrides: Partial<ZeroHitEvent> = {}): ZeroHitEvent {
  const base: ZeroHitEvent = {
    timestamp: DEFAULT_TIMESTAMP,
    scope: 'lessons',
    query: 'No results for key stage 2 fractions',
    filters: { subject: 'maths', keyStage: 'ks2' },
    indexVersion: DEFAULT_INDEX_VERSION,
    timedOut: false,
  };

  const candidate = {
    ...base,
    ...overrides,
    filters: overrides.filters ? cloneFilters(overrides.filters) : cloneFilters(base.filters),
  } satisfies ZeroHitEvent;

  return assertValid(ZeroHitEventSchema, candidate, 'ZeroHitEvent');
}

/** Summarise zero-hit events by scope with validation. */
export function summariseZeroHitEvents(events: readonly ZeroHitEvent[]): ZeroHitSummary {
  const byScope: ZeroHitScopeBreakdown = { lessons: 0, units: 0, sequences: 0 };

  let latestIndexVersion: string | null = null;
  let latestTimestamp = -Infinity;

  for (const event of events) {
    byScope[event.scope] += 1;
    if (event.timestamp >= latestTimestamp) {
      latestTimestamp = event.timestamp;
      latestIndexVersion = event.indexVersion;
    }
  }

  const summaryCandidate = {
    total: events.length,
    byScope,
    latestIndexVersion,
  } satisfies ZeroHitSummary;

  return assertValid(ZeroHitSummarySchema, summaryCandidate, 'ZeroHitSummary');
}

function createDefaultEvents(): ZeroHitEvent[] {
  return [
    createZeroHitEvent(),
    createZeroHitEvent({
      scope: 'units',
      query: 'No units found for ks3 geology',
      filters: { subject: 'science', keyStage: 'ks3' },
      timestamp: DEFAULT_TIMESTAMP - 60_000,
    }),
    createZeroHitEvent({
      scope: 'sequences',
      query: 'No programmes returned for ks4 statistics',
      filters: { subject: 'maths', keyStage: 'ks4' },
      timestamp: DEFAULT_TIMESTAMP - 120_000,
    }),
  ];
}

/** Create a zero-hit summary fixture with validation and sensible defaults. */
export function createZeroHitSummary(overrides: Partial<ZeroHitSummary> = {}): ZeroHitSummary {
  const baseEvents = createDefaultEvents();
  const base = summariseZeroHitEvents(baseEvents);
  const candidate = {
    ...base,
    ...overrides,
    byScope: overrides.byScope ?? base.byScope,
  } satisfies ZeroHitSummary;
  return assertValid(ZeroHitSummarySchema, candidate, 'ZeroHitSummary');
}

/** Create a complete zero-hit telemetry payload with validation. */
export function createZeroHitTelemetry(overrides: Partial<ZeroHitTelemetry> = {}): ZeroHitTelemetry {
  const recent = overrides.recent
    ? overrides.recent.map((entry) => createZeroHitEvent(entry))
    : createDefaultEvents();
  const summary = overrides.summary ?? summariseZeroHitEvents(recent);

  const candidate = {
    summary,
    recent,
  } satisfies ZeroHitTelemetry;

  return assertValid(ZeroHitTelemetrySchema, candidate, 'ZeroHitTelemetry');
}
