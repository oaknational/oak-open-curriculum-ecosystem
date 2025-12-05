import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  type Logger,
} from '@oaknational/mcp-logger';

/**
 * Shared semantic search logger instance.
 * Centralising creation avoids multiple logger bindings in Next.js.
 * Uses console for browser compatibility.
 */
const baseLogger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber('INFO'),
  resourceAttributes: buildResourceAttributes({}, 'SemanticSearch', '1.0.0'),
  context: {},
  stdoutSink: { write: (line: string) => console.log(line) }, // Browser console
  fileSink: null,
});

function child(name: string): Logger {
  if (typeof baseLogger.child === 'function') {
    return baseLogger.child({ module: name });
  }
  return baseLogger;
}

/** Primary logger for hybrid search orchestration and telemetry. */
export const searchLogger: Logger = child('HybridSearch');

/** Dedicated logger for suggestion/type-ahead flows. */
export const suggestLogger: Logger = child('Suggestions');

/** Logger for sandbox ingestion drills and harness operations. */
export const sandboxLogger: Logger = child('SandboxHarness');

/** Logger for SDK response caching operations. */
export const cacheLogger: Logger = child('SdkCache');
