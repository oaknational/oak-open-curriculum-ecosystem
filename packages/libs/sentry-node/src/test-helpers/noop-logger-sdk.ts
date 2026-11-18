import type { SentryNodeSdk } from '../types.js';

function noop(): void {
  /* The seam records nothing: these tests make no claim about logging. */
}

/**
 * A logger SDK seam that accepts every level and records nothing, for tests
 * whose claim is about the runtime's routing, scope or flush behaviour and
 * not about what reaches the logger.
 */
export const NOOP_LOGGER_SDK: SentryNodeSdk['logger'] = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  fatal: noop,
};
