import type { Logger } from '@oaknational/logger';

const noop = (): void => undefined;

/**
 * Creates a logger that intentionally discards all events.
 *
 * @remarks
 * Universal tool execution uses this only as a compatibility fallback when a
 * caller does not inject a real logger yet. Repo-owned runtime wiring is
 * expected to pass a concrete logger so exported async capabilities still emit
 * structured events per ADR-162.
 */
export function createNoopLogger(): Logger {
  return {
    trace: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop,
    isLevelEnabled: () => false,
  };
}
