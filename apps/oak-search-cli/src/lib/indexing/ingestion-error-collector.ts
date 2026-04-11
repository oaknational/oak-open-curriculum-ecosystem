/**
 * Collects and reports errors/warnings during curriculum data ingestion.
 *
 * @see `./ingestion-error-types.ts` for type definitions
 * @see `./ingestion-error-helpers.ts` for pure helper functions
 */

import type { Logger } from '@oaknational/logger';
import type {
  IngestionContext,
  IngestionErrorCollector,
  IngestionIssue,
  IssueSeverity,
  IssueSummary,
} from './ingestion-error-types';
import { calculateSummary, formatContext, isRetryableStatus } from './ingestion-error-helpers';

/** Create a new issue record. */
function createIssue(
  severity: IssueSeverity,
  message: string,
  context: IngestionContext,
  httpStatus?: number,
): IngestionIssue {
  return {
    severity,
    message,
    context,
    httpStatus,
    timestamp: new Date(),
    retryable: isRetryableStatus(httpStatus),
  };
}

/** Log issue summary to logger. */
function logIssueSummary(
  logger: Logger,
  summary: IssueSummary,
  issues: readonly IngestionIssue[],
): void {
  logger.info('Ingestion Issue Summary', {
    totalErrors: summary.totalErrors,
    totalWarnings: summary.totalWarnings,
    byHttpStatus: summary.byHttpStatus,
    byOperation: summary.byOperation,
  });

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

/** Record a 404 error. */
function internalRecord404(
  context: IngestionContext,
  issues: IngestionIssue[],
  endpoint: string,
): void {
  issues.push(
    createIssue(
      'warning',
      `Resource not found: ${endpoint}`,
      { ...context, operation: endpoint },
      404,
    ),
  );
}

/** Record a 500 error. */
function internalRecord500Error(
  context: IngestionContext,
  issues: IngestionIssue[],
  endpoint: string,
): void {
  issues.push(
    createIssue(
      'warning',
      `Upstream API returned 500 for ${endpoint} - continuing with empty data`,
      { ...context, operation: endpoint },
      500,
    ),
  );
}

/**
 * Create an ingestion error collector.
 */
function createIngestionErrorCollector(): IngestionErrorCollector {
  const issues: IngestionIssue[] = [];

  return {
    recordError: (message: string, context: IngestionContext, httpStatus?: number): void => {
      issues.push(createIssue('error', message, context, httpStatus));
    },
    recordWarning: (message: string, context: IngestionContext, httpStatus?: number): void => {
      issues.push(createIssue('warning', message, context, httpStatus));
    },

    record500Error: (context: IngestionContext, endpoint: string): void =>
      internalRecord500Error(context, issues, endpoint),
    record404: (context: IngestionContext, endpoint: string): void =>
      internalRecord404(context, issues, endpoint),
    getIssues: () => issues,
    getSummary: () => calculateSummary(issues),
    hasErrors: () => issues.some((issue) => issue.severity === 'error'),
    hasIssues: () => issues.length > 0,

    logSummary(logger: Logger): void {
      if (issues.length === 0) {
        logger.info('Ingestion completed with no issues');
        return;
      }
      logIssueSummary(logger, calculateSummary(issues), issues);
    },

    clear(): void {
      issues.length = 0;
    },
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
