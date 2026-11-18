import { describe, expect, it } from 'vitest';

import { parsePassRecord } from './pass-record.js';

/** A record in the shape a passing probe writes. */
const record = {
  cliVersion: '0.156.1',
  executablePath: '/opt/codex/releases/0.156.1/bin/codex',
  envelopeDigest: 'a'.repeat(64),
  probeContractVersion: 1,
  passedAt: '2026-09-24T11:00:00Z',
  evidence: ['rule 4: the nonce, no WRITE-OK', 'rule 9: the nonce, no WRITE-OK'],
} as const;

describe('parsePassRecord', () => {
  it('accepts the record a passing probe writes', () => {
    expect(parsePassRecord(record)).toStrictEqual({ ok: true, value: record });
  });

  it.each([null, 'a record', [record], 42])('refuses %j, which is not a record', (value) => {
    expect(parsePassRecord(value)).toStrictEqual({ ok: false, error: { kind: 'invalid' } });
  });

  it('refuses a record whose JSON carries its own __proto__ key', () => {
    const parsed: unknown = JSON.parse(`{"__proto__":{},${JSON.stringify(record).slice(1)}`);
    expect(parsePassRecord(parsed)).toStrictEqual({ ok: false, error: { kind: 'invalid' } });
  });

  it('refuses a record carrying a field the record does not define', () => {
    expect(parsePassRecord({ ...record, pinned: true })).toStrictEqual({
      ok: false,
      error: { kind: 'invalid' },
    });
  });

  it.each(Object.keys(record))('refuses a record without %s', (field) => {
    const partial = Object.fromEntries(Object.entries(record).filter(([key]) => key !== field));
    expect(parsePassRecord(partial)).toStrictEqual({ ok: false, error: { kind: 'invalid' } });
  });

  it.each([
    ['an empty version', { cliVersion: '' }],
    ['an empty path', { executablePath: '' }],
    ['an upper-case digest', { envelopeDigest: 'A'.repeat(64) }],
    ['a short digest', { envelopeDigest: 'a'.repeat(63) }],
    ['a long digest', { envelopeDigest: 'a'.repeat(65) }],
    ['a digest behind a prefix', { envelopeDigest: `x${'a'.repeat(64)}` }],
    ['a non-hex digest', { envelopeDigest: 'g'.repeat(64) }],
    ['a probe contract version of zero', { probeContractVersion: 0 }],
    ['a fractional probe contract version', { probeContractVersion: 1.5 }],
    ['a probe contract version written as text', { probeContractVersion: '1' }],
    ['a time that is not an ISO date-time', { passedAt: 'yesterday' }],
    ['no evidence', { evidence: [] }],
    ['evidence that is not text', { evidence: [7] }],
  ])('refuses %s', (_label, change) => {
    expect(parsePassRecord({ ...record, ...change })).toStrictEqual({
      ok: false,
      error: { kind: 'invalid' },
    });
  });
});
