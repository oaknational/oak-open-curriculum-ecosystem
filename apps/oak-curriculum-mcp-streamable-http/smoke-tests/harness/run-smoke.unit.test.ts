/**
 * Unit tests for the canonical smoke harness pure surfaces.
 *
 * @remarks
 * Covers the boot-outcome classifier (pure functions) and the mode
 * registry's unknown-mode error path.
 *
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import {
  crashedOutcome,
  envErrorOutcome,
  isListening,
  listeningOutcome,
  timeoutOutcome,
} from './boot-outcome.js';
import { listSmokeModes, resolveSmokeMode } from './modes.js';

describe('boot-outcome classifier', () => {
  it('envErrorOutcome carries the diagnostic message verbatim', () => {
    const outcome = envErrorOutcome('OAK_API_KEY missing');
    expect(outcome).toEqual({ kind: 'env-error', message: 'OAK_API_KEY missing' });
  });

  it('crashedOutcome preserves an Error instance unchanged', () => {
    const cause = new Error('listen EADDRINUSE');
    const outcome = crashedOutcome(cause);
    expect(outcome.kind).toBe('crashed');
    if (outcome.kind === 'crashed') {
      expect(outcome.error).toBe(cause);
    }
  });

  it('crashedOutcome wraps a non-Error throw in a synthesised Error', () => {
    const outcome = crashedOutcome('boom');
    expect(outcome.kind).toBe('crashed');
    if (outcome.kind === 'crashed') {
      expect(outcome.error).toBeInstanceOf(Error);
      expect(outcome.error.message).toContain('boom');
    }
  });

  it('timeoutOutcome carries the elapsed milliseconds', () => {
    const outcome = timeoutOutcome(5000);
    expect(outcome).toEqual({ kind: 'timeout', elapsedMs: 5000 });
  });

  it('listeningOutcome carries the bound base URL and a cleanup callback', () => {
    const cleanup = (): Promise<void> => Promise.resolve();
    const outcome = listeningOutcome('http://127.0.0.1:54321', cleanup);
    expect(outcome.kind).toBe('listening');
    if (outcome.kind === 'listening') {
      expect(outcome.baseUrl).toBe('http://127.0.0.1:54321');
      expect(outcome.cleanup).toBe(cleanup);
    }
  });

  it('isListening narrows the outcome variant', () => {
    const listening = listeningOutcome(
      'http://127.0.0.1:1',
      (): Promise<void> => Promise.resolve(),
    );
    const failed = envErrorOutcome('any');
    expect(isListening(listening)).toBe(true);
    expect(isListening(failed)).toBe(false);
  });
});

describe('mode registry — empty registry behaviour at A1 landing', () => {
  it('listSmokeModes returns the empty list when no modes registered', () => {
    expect(listSmokeModes()).toEqual([]);
  });

  it('resolveSmokeMode throws a fail-fast error for any name when registry is empty', () => {
    expect(() => resolveSmokeMode('does-not-exist')).toThrow(
      /Unknown smoke mode: does-not-exist\. Available modes: \(none registered yet\)/,
    );
  });
});
