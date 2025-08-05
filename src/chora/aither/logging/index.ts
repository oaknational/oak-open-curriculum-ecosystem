/**
 * Logging - The nervous system of the organism
 *
 * Public API for logging functionality
 */

export { createConsoleLogger } from './logger.js';
export { createContextLogger } from './context-logger.js';
export type { Logger, LogLevel } from './logger-interface.js';
export { getLogLevelValue } from './types/levels.js';

// Export formatters for customization
export { createPrettyFormatter } from './formatters/pretty-index.js';
export { createJsonFormatter } from './formatters/json/index.js';

// Export transports for extensibility
export { createConsoleTransport } from './transports/console-index.js';
export { createFileTransport } from './transports/file-index.js';

// Export tracing utilities
export {
  generateRequestId,
  generateSpanId,
  parseTraceparent,
  extractTraceHeaders,
  createTraceContext,
  createSpanContext,
  formatTraceInfo,
  sanitizeTraceContext,
  shouldSample,
  RequestTracer,
  createRequestTracer,
  globalTracer,
} from './tracing/index.js';
export type { TraceContext, RequestTracingOptions } from './tracing/index.js';
