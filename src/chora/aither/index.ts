/**
 * Aither (Αἰθήρ) - Divine flows that move through everything
 *
 * Public API for the aither chora, providing:
 * - Logging (nervous system)
 * - Events (hormonal messaging)
 * - Errors (pain/alert system)
 * - Sensitive Data (protective system)
 */

// Re-export public APIs from each subsystem

// Logging exports
export {
  createConsoleLogger,
  createContextLogger,
  getLogLevelValue,
  createPrettyFormatter,
  createJsonFormatter,
  createConsoleTransport,
  createFileTransport,
  // Tracing utilities
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
} from './logging/index.js';
export type { Logger, LogLevel, TraceContext, RequestTracingOptions } from './logging/index.js';

// Events exports
export { createEventBus } from './events/index.js';
export type { EventBus } from '../stroma/contracts/event-bus.js';

// Errors exports
export { classifyNotionError, createMcpError, formatErrorForUser } from './errors/index.js';
export type { ErrorType, ErrorClassification, McpError } from './errors/index.js';

// Sensitive data exports
export { scrubSensitiveData, scrubEmail } from './sensitive-data/index.js';
