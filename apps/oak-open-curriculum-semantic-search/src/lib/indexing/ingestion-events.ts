/**
 * Ingestion event types and formatting functions for comprehensive logging.
 * @packageDocumentation
 */

/** Valid phases in the ingestion process. */
export type IngestionPhase = 'units' | 'lessons' | 'rollups' | 'threads';

/** Reasons why a lesson may be skipped during ingestion. */
export type LessonSkipReason =
  | 'summary_404'
  | 'summary_invalid'
  | 'transcript_error'
  | 'validation_error'
  | 'unknown';

/** Reasons why a unit may be skipped during ingestion. */
export type UnitSkipReason = 'summary_unavailable' | 'fetch_error';

/** All possible ingestion event types. */
export type IngestionEventType =
  | 'PHASE_START'
  | 'PHASE_END'
  | 'PROGRESS'
  | 'LESSON_SKIPPED'
  | 'LESSON_FAILED'
  | 'UNIT_SKIPPED'
  | 'UNIT_FAILED'
  | 'INGESTION_COMPLETE'
  | 'SUMMARY';

/** Ingestion event structure with type, optional phase, and key-value context. */
export interface IngestionEvent {
  readonly type: IngestionEventType;
  readonly phase?: IngestionPhase;
  readonly context: Readonly<Record<string, string | number | boolean>>;
}

/** Formats duration in milliseconds to human-readable string (e.g., "45.2s"). */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = seconds / 60;
  return `${minutes.toFixed(1)}m`;
}

/** Formats context key-value pairs (e.g., "subject=maths keyStage=ks4"). */
function formatContext(context: Readonly<Record<string, string | number | boolean>>): string {
  // Context is intentionally a generic record for logging flexibility - keys are not statically known
  // eslint-disable-next-line no-restricted-properties -- Record<string, T> cannot use typeSafeEntries
  return Object.entries(context)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(' ');
}

/** Formats an ingestion event into a log-friendly string. */
export function formatIngestionEvent(event: IngestionEvent): string {
  const parts: string[] = [event.type];

  if (event.phase !== undefined) {
    parts.push(`: ${event.phase}`);
  }

  const contextStr = formatContext(event.context);
  if (contextStr.length > 0) {
    parts.push(' | ', contextStr);
  }

  return parts.join('');
}

/** Creates a PHASE_START event for the given phase. */
export function createPhaseStartEvent(
  phase: IngestionPhase,
  context: Readonly<Record<string, string | number | boolean>>,
): IngestionEvent {
  return {
    type: 'PHASE_START',
    phase,
    context,
  };
}

/** Creates a PHASE_END event with results for the given phase. */
export function createPhaseEndEvent(
  phase: IngestionPhase,
  context: Readonly<{
    subject?: string;
    keyStage?: string;
    indexed: number;
    skipped: number;
    durationMs: number;
  }>,
): IngestionEvent {
  const { durationMs, ...rest } = context;
  return {
    type: 'PHASE_END',
    phase,
    context: {
      ...rest,
      duration: formatDuration(durationMs),
    },
  };
}

/** Creates a PROGRESS event with current/total counts. */
export function createProgressEvent(
  phase: IngestionPhase,
  context: Readonly<{
    current: number;
    total: number;
    unitSlug?: string;
  }>,
): IngestionEvent {
  const { current, total, unitSlug } = context;
  const percentage = ((current / total) * 100).toFixed(1);
  const progressContext: Record<string, string | number | boolean> = {
    progress: `${current}/${total} (${percentage}%)`,
  };
  if (unitSlug !== undefined) {
    progressContext.unit = unitSlug;
  }
  return {
    type: 'PROGRESS',
    phase,
    context: progressContext,
  };
}

/** Creates a LESSON_SKIPPED event with full context. */
export function createLessonSkippedEvent(
  context: Readonly<{
    lessonSlug: string;
    unitSlug: string;
    reason: LessonSkipReason;
    httpStatus?: number;
  }>,
): IngestionEvent {
  const eventContext: Record<string, string | number | boolean> = {
    lessonSlug: context.lessonSlug,
    unitSlug: context.unitSlug,
    reason: context.reason,
  };
  if (context.httpStatus !== undefined) {
    eventContext.httpStatus = context.httpStatus;
  }
  return {
    type: 'LESSON_SKIPPED',
    context: eventContext,
  };
}

/** Creates a UNIT_SKIPPED event with full context. */
export function createUnitSkippedEvent(
  context: Readonly<{
    unitSlug: string;
    subject: string;
    keyStage: string;
    reason: UnitSkipReason;
  }>,
): IngestionEvent {
  return {
    type: 'UNIT_SKIPPED',
    context: {
      unitSlug: context.unitSlug,
      subject: context.subject,
      keyStage: context.keyStage,
      reason: context.reason,
    },
  };
}

/** Creates an INGESTION_COMPLETE event with duration. */
export function createIngestionCompleteEvent(
  context: Readonly<{
    durationMs: number;
  }>,
): IngestionEvent {
  return {
    type: 'INGESTION_COMPLETE',
    context: {
      duration: formatDuration(context.durationMs),
    },
  };
}

/** Creates a SUMMARY event with counts by category. */
export function createSummaryEvent(
  context: Readonly<{
    category: string;
    indexed: number;
    skipped: number;
  }>,
): IngestionEvent {
  return {
    type: 'SUMMARY',
    context: {
      category: context.category,
      indexed: context.indexed,
      skipped: context.skipped,
    },
  };
}
