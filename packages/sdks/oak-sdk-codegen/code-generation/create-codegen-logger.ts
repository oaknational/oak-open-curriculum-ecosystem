/**
 * Shared logger factory for code-generation entry points.
 *
 * @remarks
 * Creates a structured logger that writes OpenTelemetry-compliant JSON to stdout,
 * preserving CI log visibility while satisfying the `no-console` quality gate.
 *
 * Entry points call this once; callees accept the logger via parameter (DI).
 *
 * @param toolName - Identifies which generator produced the log line
 * @returns A `Logger` instance writing to stdout
 *
 * @example
 * ```typescript
 * import { createCodegenLogger } from './create-codegen-logger.js';
 *
 * const logger = createCodegenLogger('codegen');
 * logger.info('Generating type artifacts...');
 * ```
 */

import {
  logLevelToSeverityNumber,
  parseLogLevel,
  buildResourceAttributes,
} from '@oaknational/logger';
import { getActiveSpanContextSnapshot } from '@oaknational/observability';
import { UnifiedLogger, createNodeStdoutSink } from '@oaknational/logger/node';
import type { Logger } from '@oaknational/logger';

export function createCodegenLogger(toolName: string): Logger {
  const level = parseLogLevel(process.env['LOG_LEVEL'], 'INFO');
  return new UnifiedLogger({
    minSeverity: logLevelToSeverityNumber(level),
    resourceAttributes: buildResourceAttributes({}, 'sdk-codegen', '0.0.0'),
    context: { tool: toolName },
    sinks: [createNodeStdoutSink()],
    getActiveSpanContext: getActiveSpanContextSnapshot,
  });
}
