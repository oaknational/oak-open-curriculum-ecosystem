/**
 * Unit tests for the canonical smoke harness pure surfaces.
 *
 * @remarks
 * Covers the boot-outcome classifier (pure functions) and the mode
 * registry's unknown-mode error path. Both surfaces are GREEN at
 * landing of ARC A1.
 *
 * The skipped blocks at the bottom are the RED-arc skip register
 * entries for ARC A2 and ARC A3: when those workstreams land the
 * five existing modes (A2: `local-stub`, `local-stub-auth`,
 * `local-live`, `local-live-auth`, `remote`) and the new mode (A3:
 * `local-no-observability`), each `toContain` assertion turns GREEN
 * deterministically and the workstream's atomic commit MUST flip
 * `describe.skip` → `describe` on the matching block. This pattern
 * mirrors the WS1 RED-arc skip register; the napkin's §RED-arc skip
 * register lists the corresponding SKIP-UNTIL-A2 / SKIP-UNTIL-A3
 * markers for header-audit purposes.
 *
 * SKIP-UNTIL-A2 (header audit): A2 atomic-landing-commit must remove
 * the `.skip` from the describe block named "mode registry — A2
 * obligations". SKIP-UNTIL-A3 (header audit): A3 atomic-landing-
 * commit must remove the `.skip` from the describe block named "mode
 * registry — A3 obligation". No edit to test bodies is required —
 * registry changes alone turn the assertions GREEN.
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

// SKIP-UNTIL-A2: ARC A2's atomic-landing-commit flips this `describe.skip`
// to `describe` once `modes.ts` registers the five existing modes. The
// assertions turn GREEN deterministically; no body edit required.
describe.skip('mode registry — A2 obligations', () => {
  it('local-stub mode is registered', () => {
    expect(listSmokeModes()).toContain('local-stub');
  });

  it('local-stub-auth mode is registered', () => {
    expect(listSmokeModes()).toContain('local-stub-auth');
  });

  it('local-live mode is registered', () => {
    expect(listSmokeModes()).toContain('local-live');
  });

  it('local-live-auth mode is registered', () => {
    expect(listSmokeModes()).toContain('local-live-auth');
  });

  it('remote mode is registered', () => {
    expect(listSmokeModes()).toContain('remote');
  });
});

// SKIP-UNTIL-A3: ARC A3's atomic-landing-commit flips this `describe.skip`
// to `describe` once `modes.ts` registers the no-observability mode. The
// assertion turns GREEN deterministically; no body edit required.
describe.skip('mode registry — A3 obligation', () => {
  it('local-no-observability mode is registered', () => {
    expect(listSmokeModes()).toContain('local-no-observability');
  });
});
