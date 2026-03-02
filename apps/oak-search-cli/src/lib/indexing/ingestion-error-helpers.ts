/**
 * Pure helper functions for ingestion error processing.
 * @see `./ingestion-error-collector.ts` for the collector implementation
 */

import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { IngestionContext, IngestionIssue, IssueSummary } from './ingestion-error-types';

/** HTTP status codes that indicate retryable errors. */
const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);

/**
 * Determine if an HTTP status code indicates a retryable error.
 */
export function isRetryableStatus(status: number | undefined): boolean {
  return status !== undefined && RETRYABLE_STATUS_CODES.has(status);
}

/**
 * Format an ingestion context into a human-readable string for logging.
 */
export function formatContext(context: IngestionContext): string {
  const parts: string[] = [];
  if (context.keyStage) {
    parts.push(`ks=${context.keyStage}`);
  }
  if (context.subject) {
    parts.push(`subject=${context.subject}`);
  }
  if (context.unitSlug) {
    parts.push(`unit=${context.unitSlug}`);
  }
  if (context.lessonSlug) {
    parts.push(`lesson=${context.lessonSlug}`);
  }
  if (context.operation) {
    parts.push(`op=${context.operation}`);
  }
  return parts.join(', ');
}

/** Mutable counters for summary aggregation. */
interface SummaryCounters {
  totalErrors: number;
  totalWarnings: number;
  byHttpStatus: Record<number, number>;
  byOperation: Record<string, number>;
  byKeyStage: Partial<Record<KeyStage, number>>;
  bySubject: Partial<Record<SearchSubjectSlug, number>>;
}

/** Increment a counter in a record keyed by string. */
function incrementStringKeyCounter(record: Record<string, number>, key: string): void {
  record[key] = (record[key] ?? 0) + 1;
}

/** Increment a counter in a record keyed by number. */
function incrementNumberKeyCounter(record: Record<number, number>, key: number): void {
  record[key] = (record[key] ?? 0) + 1;
}

/** Update counters for a single issue. */
function updateCounters(counters: SummaryCounters, issue: IngestionIssue): void {
  if (issue.severity === 'error') {
    counters.totalErrors++;
  } else {
    counters.totalWarnings++;
  }

  if (issue.httpStatus !== undefined) {
    incrementNumberKeyCounter(counters.byHttpStatus, issue.httpStatus);
  }
  if (issue.context.operation) {
    incrementStringKeyCounter(counters.byOperation, issue.context.operation);
  }
  if (issue.context.keyStage) {
    const ks = issue.context.keyStage;
    counters.byKeyStage[ks] = (counters.byKeyStage[ks] ?? 0) + 1;
  }
  if (issue.context.subject) {
    const subj = issue.context.subject;
    counters.bySubject[subj] = (counters.bySubject[subj] ?? 0) + 1;
  }
}

/**
 * Calculate a summary of issues, aggregating counts by various dimensions.
 */
export function calculateSummary(issues: readonly IngestionIssue[]): IssueSummary {
  const counters: SummaryCounters = {
    totalErrors: 0,
    totalWarnings: 0,
    byHttpStatus: {},
    byOperation: {},
    byKeyStage: {},
    bySubject: {},
  };

  for (const issue of issues) {
    updateCounters(counters, issue);
  }

  return { ...counters, issues };
}
