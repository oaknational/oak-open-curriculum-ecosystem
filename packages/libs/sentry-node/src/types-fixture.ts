import type { LogContext, LogEvent, NormalizedError } from '@oaknational/logger';
import type { SentryContextPayload, SentryUser } from './types-scope.js';

/**
 * Fixture-mode capture types — used when `SENTRY_MODE=fixture` to record
 * SDK interactions in-memory for tests instead of sending them to Sentry.
 *
 * @remarks Separated from the core config-contract module (`types.ts`)
 * to keep that file within the fitness line limit. Import boundary is
 * one-way: these types depend on a few primitives from `types.ts`;
 * `types.ts` does NOT import from this file.
 */

export interface FixtureSentryLogCapture {
  readonly kind: 'log';
  readonly level: LogEvent['level'];
  readonly message: string;
  readonly line: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly environment: string;
  readonly release: string;
}

export interface FixtureSentryExceptionCapture {
  readonly kind: 'exception';
  readonly error: NormalizedError;
  readonly context?: LogContext;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly environment: string;
  readonly release: string;
}

export interface FixtureSentryUserCapture {
  readonly kind: 'set_user';
  readonly user: SentryUser | null;
}

export interface FixtureSentryTagCapture {
  readonly kind: 'set_tag';
  readonly key: string;
  readonly value: string;
}

export interface FixtureSentryContextCapture {
  readonly kind: 'set_context';
  readonly name: string;
  readonly context: SentryContextPayload | null;
}

export type FixtureSentryCapture =
  | FixtureSentryLogCapture
  | FixtureSentryExceptionCapture
  | FixtureSentryUserCapture
  | FixtureSentryTagCapture
  | FixtureSentryContextCapture;

export interface FixtureSentryStore {
  readonly captures: readonly FixtureSentryCapture[];
  push(capture: FixtureSentryCapture): void;
  clear(): void;
}
