import { isErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { formatCoordinationSuccessorName } from './successor-name.js';

/**
 * Behaviour of the pure successor-name formatter: the name combines the
 * current UTC date with the FIRST SIX hex characters of a FULL commit sha.
 * The suffix is deliberate lineage policy — a different tip almost always mints a
 * different name — so an abbreviated or malformed sha is rejected, never
 * silently reformatted.
 */

const FOLD_TIP_SHA = `ca6b0f${'d'.repeat(34)}`;

describe('formatCoordinationSuccessorName', () => {
  it('combines the UTC date with the first six characters of the full sha', () => {
    const result = formatCoordinationSuccessorName({
      fullSha: FOLD_TIP_SHA,
      now: new Date('2026-08-13T09:15:00Z'),
    });

    expect(result).toStrictEqual({ ok: true, value: 'coordination/2026-08-13-ca6b0f' });
  });

  it('takes exactly six suffix characters from the full sha', () => {
    const result = formatCoordinationSuccessorName({
      fullSha: '7b3df0'.repeat(2) + 'a'.repeat(28),
      now: new Date('2026-08-11T12:00:00Z'),
    });

    expect(result).toStrictEqual({ ok: true, value: 'coordination/2026-08-11-7b3df0' });
  });

  it('dates the name from UTC in the final moment of the UTC day', () => {
    const result = formatCoordinationSuccessorName({
      fullSha: FOLD_TIP_SHA,
      now: new Date('2026-08-13T23:59:59.999Z'),
    });

    expect(result).toStrictEqual({ ok: true, value: 'coordination/2026-08-13-ca6b0f' });
  });

  it('rejects an abbreviated sha — the suffix derives only from a full 40-hex sha', () => {
    const result = formatCoordinationSuccessorName({
      fullSha: 'ca6b0f',
      now: new Date('2026-08-13T09:15:00Z'),
    });

    expect(isErr(result)).toBe(true);
    expect(isErr(result) ? result.error.message : '').toContain('40-hex');
  });

  it('rejects non-hex sha text', () => {
    const result = formatCoordinationSuccessorName({
      fullSha: 'g'.repeat(40),
      now: new Date('2026-08-13T09:15:00Z'),
    });

    expect(isErr(result)).toBe(true);
  });

  it('rejects an invalid clock reading instead of printing an Invalid Date name', () => {
    const result = formatCoordinationSuccessorName({
      fullSha: FOLD_TIP_SHA,
      now: new Date('not a date'),
    });

    expect(isErr(result)).toBe(true);
  });
});
