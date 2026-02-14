/**
 * Type definitions for ingestion error collection and reporting.
 * @see `./ingestion-error-collector.ts` for the collector implementation
 */

import type { Logger } from '@oaknational/mcp-logger';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';

/** Context about what was being processed when an error occurred. */
export interface IngestionContext {
  readonly keyStage?: KeyStage;
  readonly subject?: SearchSubjectSlug;
  readonly unitSlug?: string;
  readonly lessonSlug?: string;
  readonly operation?: string;
}

/** Severity level for ingestion issues. */
export type IssueSeverity = 'error' | 'warning';

/** A single recorded issue during ingestion. */
export interface IngestionIssue {
  readonly severity: IssueSeverity;
  readonly message: string;
  readonly context: IngestionContext;
  readonly httpStatus?: number;
  readonly timestamp: Date;
  readonly retryable: boolean;
}

/** Summary of issues by category. */
export interface IssueSummary {
  readonly totalErrors: number;
  readonly totalWarnings: number;
  readonly byHttpStatus: Record<number, number>;
  readonly byOperation: Record<string, number>;
  readonly byKeyStage: Record<string, number>;
  readonly bySubject: Record<string, number>;
  readonly issues: readonly IngestionIssue[];
}

/** Collector for ingestion errors and warnings. */
export interface IngestionErrorCollector {
  /** Record an error that occurred during ingestion. */
  recordError(message: string, context: IngestionContext, httpStatus?: number): void;

  /** Record a warning (non-fatal issue) during ingestion. */
  recordWarning(message: string, context: IngestionContext, httpStatus?: number): void;

  /** Record a 500 error that was handled gracefully. */
  record500Error(context: IngestionContext, endpoint: string): void;

  /** Record a 404 that was handled gracefully (for tracking). */
  record404(context: IngestionContext, endpoint: string): void;

  /** Get all recorded issues. */
  getIssues(): readonly IngestionIssue[];

  /** Get summary of all issues. */
  getSummary(): IssueSummary;

  /** Check if there were any errors (not warnings). */
  hasErrors(): boolean;

  /** Check if there were any issues at all. */
  hasIssues(): boolean;

  /** Log all issues to the provided logger. */
  logSummary(logger: Logger): void;

  /** Clear all recorded issues. */
  clear(): void;
}
