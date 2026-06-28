/**
 * F-89: `claims open` defaults its `--now` timestamp to the current time when
 * the caller omits it, so an agent need not compute and pass an ISO timestamp
 * for the common case (the F-41-class ergonomics fix applied to the timestamp
 * argument; previously `openClaim` threw via `required(options, 'now')`). These
 * cover the resolution behaviour directly:
 *
 * - an omitted `--now` resolves to the injected clock's timestamp;
 * - an explicit `--now` is honoured verbatim and NEVER consults the clock
 *   (laziness — an explicit value must short-circuit before the clock is read);
 * - `withNowDefault` injects the resolved value while preserving every other
 *   option field.
 *
 * Built through `parseOptions` so the flags are exercised on a real parsed
 * Options value, mirroring the F-85 `claim-active-path` sibling. The clock is an
 * injected counting fake (not a thrower) so the "explicit short-circuits the
 * clock" contract is asserted without an `@oaknational/no-throw-statement`
 * violation.
 */
import { describe, expect, it } from 'vitest';

import { resolveNow, withNowDefault } from '../../src/collaboration-state/claim-now-default';
import { parseOptions } from '../../src/collaboration-state/cli-options';

const FIXED = '2026-01-02T03:04:05.000Z';

function countingNow(): { readonly provider: () => string; readonly calls: () => number } {
  let calls = 0;
  return {
    provider: () => {
      calls += 1;
      return FIXED;
    },
    calls: () => calls,
  };
}

describe('resolveNow (F-89 claims open --now default)', () => {
  it('defaults an omitted --now to the clock timestamp', () => {
    const options = parseOptions(['claims', 'open']);
    const clock = countingNow();
    expect(resolveNow(options, clock.provider)).toBe(FIXED);
    expect(clock.calls()).toBe(1);
  });

  it('honours an explicit --now verbatim without consulting the clock', () => {
    const options = parseOptions(['claims', 'open', '--now', '2025-12-31T23:59:59.000Z']);
    const clock = countingNow();
    expect(resolveNow(options, clock.provider)).toBe('2025-12-31T23:59:59.000Z');
    expect(clock.calls()).toBe(0);
  });
});

describe('withNowDefault', () => {
  it('injects the resolved --now while preserving every other option field', () => {
    const options = parseOptions([
      'claims',
      'open',
      '--thread',
      'agentic-engineering-enhancements',
      '--area-kind',
      'files',
      '--file',
      'a.ts',
      '--tag',
      'heartbeat',
    ]);
    const clock = countingNow();
    const resolved = withNowDefault(options, clock.provider);
    expect(resolved.values.get('now')).toBe(FIXED);
    expect(resolved.values.get('thread')).toBe('agentic-engineering-enhancements');
    expect(resolved.files).toEqual(['a.ts']);
    expect(resolved.tags).toEqual(['heartbeat']);
    expect(resolved.command).toBe('claims');
    expect(resolved.topic).toBe('open');
  });

  it('leaves an explicit --now untouched', () => {
    const options = parseOptions(['claims', 'open', '--now', '2025-06-01T00:00:00.000Z']);
    const clock = countingNow();
    const resolved = withNowDefault(options, clock.provider);
    expect(resolved.values.get('now')).toBe('2025-06-01T00:00:00.000Z');
    expect(clock.calls()).toBe(0);
  });
});
