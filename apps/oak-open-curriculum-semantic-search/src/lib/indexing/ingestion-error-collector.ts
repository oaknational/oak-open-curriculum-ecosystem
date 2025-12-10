/**
 * @module ingestion-error-collector
 * @description Collects and reports errors/warnings during curriculum data ingestion.
 * Provides structured error tracking with context about what was being processed.
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

/** HTTP status codes that indicate retryable errors. */
const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);

/** Determine if an HTTP status code indicates a retryable error. */
function isRetryableStatus(status: number | undefined): boolean {
  return status !== undefined && RETRYABLE_STATUS_CODES.has(status);
}

/** Format context for logging. */
function formatContext(context: IngestionContext): string {
  const parts: string[] = [];
  if (context.keyStage) parts.push(`ks=${context.keyStage}`);
  if (context.subject) parts.push(`subject=${context.subject}`);
  if (context.unitSlug) parts.push(`unit=${context.unitSlug}`);
  if (context.lessonSlug) parts.push(`lesson=${context.lessonSlug}`);
  if (context.operation) parts.push(`op=${context.operation}`);
  return parts.join(', ');
}

/** Create an ingestion error collector. */
export function createIngestionErrorCollector(): IngestionErrorCollector {
  const issues: IngestionIssue[] = [];

  function recordIssue(
    severity: IssueSeverity,
    message: string,
    context: IngestionContext,
    httpStatus?: number,
  ): void {
    issues.push({
      severity,
      message,
      context,
      httpStatus,
      timestamp: new Date(),
      retryable: isRetryableStatus(httpStatus),
    });
  }

  function recordError(message: string, context: IngestionContext, httpStatus?: number): void {
    recordIssue('error', message, context, httpStatus);
  }

  function recordWarning(message: string, context: IngestionContext, httpStatus?: number): void {
    recordIssue('warning', message, context, httpStatus);
  }

  function record500Error(context: IngestionContext, endpoint: string): void {
    recordWarning(
      `Upstream API returned 500 for ${endpoint} - continuing with empty data`,
      { ...context, operation: endpoint },
      500,
    );
  }

  function record404(context: IngestionContext, endpoint: string): void {
    // 404s are expected and not really issues, but we track them for completeness
    recordIssue(
      'warning',
      `Resource not found: ${endpoint}`,
      { ...context, operation: endpoint },
      404,
    );
  }

  function getIssues(): readonly IngestionIssue[] {
    return issues;
  }

  function getSummary(): IssueSummary {
    const byHttpStatus: Record<number, number> = {};
    const byOperation: Record<string, number> = {};
    const byKeyStage: Record<string, number> = {};
    const bySubject: Record<string, number> = {};
    let totalErrors = 0;
    let totalWarnings = 0;

    for (const issue of issues) {
      if (issue.severity === 'error') {
        totalErrors++;
      } else {
        totalWarnings++;
      }

      if (issue.httpStatus !== undefined) {
        byHttpStatus[issue.httpStatus] = (byHttpStatus[issue.httpStatus] ?? 0) + 1;
      }

      if (issue.context.operation) {
        byOperation[issue.context.operation] = (byOperation[issue.context.operation] ?? 0) + 1;
      }

      if (issue.context.keyStage) {
        byKeyStage[issue.context.keyStage] = (byKeyStage[issue.context.keyStage] ?? 0) + 1;
      }

      if (issue.context.subject) {
        bySubject[issue.context.subject] = (bySubject[issue.context.subject] ?? 0) + 1;
      }
    }

    return {
      totalErrors,
      totalWarnings,
      byHttpStatus,
      byOperation,
      byKeyStage,
      bySubject,
      issues,
    };
  }

  function hasErrors(): boolean {
    return issues.some((issue) => issue.severity === 'error');
  }

  function hasIssues(): boolean {
    return issues.length > 0;
  }

  function logSummary(logger: Logger): void {
    const summary = getSummary();

    if (!hasIssues()) {
      logger.info('Ingestion completed with no issues');
      return;
    }

    // Log summary header
    logger.info('Ingestion Issue Summary', {
      totalErrors: summary.totalErrors,
      totalWarnings: summary.totalWarnings,
      byHttpStatus: summary.byHttpStatus,
      byOperation: summary.byOperation,
    });

    // Log each error (not warnings, to avoid noise)
    const errors = issues.filter((i) => i.severity === 'error');
    if (errors.length > 0) {
      logger.error('Ingestion Errors', {
        count: errors.length,
        errors: errors.map((e) => ({
          message: e.message,
          context: formatContext(e.context),
          httpStatus: e.httpStatus,
        })),
      });
    }

    // Log 500 errors specifically (they're warnings but important)
    const http500s = issues.filter((i) => i.httpStatus === 500);
    if (http500s.length > 0) {
      logger.warn('Upstream 500 Errors (handled gracefully)', {
        count: http500s.length,
        resources: http500s.map((e) => ({
          lesson: e.context.lessonSlug,
          unit: e.context.unitSlug,
          operation: e.context.operation,
        })),
      });
    }
  }

  function clear(): void {
    issues.length = 0;
  }

  return {
    recordError,
    recordWarning,
    record500Error,
    record404,
    getIssues,
    getSummary,
    hasErrors,
    hasIssues,
    logSummary,
    clear,
  };
}

/** Global error collector instance for the current ingestion run. */
let globalCollector: IngestionErrorCollector | null = null;

/** Get or create the global error collector. */
export function getIngestionErrorCollector(): IngestionErrorCollector {
  if (!globalCollector) {
    globalCollector = createIngestionErrorCollector();
  }
  return globalCollector;
}

/** Reset the global error collector (call at start of new ingestion). */
export function resetIngestionErrorCollector(): void {
  if (globalCollector) {
    globalCollector.clear();
  }
  globalCollector = createIngestionErrorCollector();
}
