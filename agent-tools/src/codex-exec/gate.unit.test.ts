import { describe, expect, it } from 'vitest';

import {
  admitRecord,
  matchBinding,
  PASS_RECORD_MAX_AGE_MS,
  type PassRecordRejection,
} from './gate.js';
import type { Binding, PassRecord } from './pass-record.js';

const record: PassRecord = {
  cliVersion: '0.156.1',
  executablePath: '/opt/codex/releases/0.156.1/bin/codex',
  envelopeDigest: 'a'.repeat(64),
  probeContractVersion: 1,
  passedAt: '2026-09-24T11:00:00Z',
  evidence: ['rule 9: the nonce, no WRITE-OK'],
};

/** A moment inside the record's age limit. */
const now = new Date('2026-09-25T09:00:00Z');

/** The time the record above was passed, in milliseconds. */
const passedAtMs = Date.parse(record.passedAt);

/** The binding the record above was written for. */
const binding: Binding = {
  cliVersion: record.cliVersion,
  executablePath: record.executablePath,
  envelopeDigest: record.envelopeDigest,
  probeContractVersion: record.probeContractVersion,
};

describe('admitRecord', () => {
  it('admits a record that is present and well formed', () => {
    expect(admitRecord({ kind: 'present', value: record }, now)).toStrictEqual({
      ok: true,
      value: record,
    });
  });

  it('admits a record at the last moment of its age limit', () => {
    const limit = new Date(passedAtMs + PASS_RECORD_MAX_AGE_MS);
    expect(admitRecord({ kind: 'present', value: record }, limit)).toStrictEqual({
      ok: true,
      value: record,
    });
  });

  it('refuses a record past its age limit, so the seat is told to probe again', () => {
    const past = new Date(passedAtMs + PASS_RECORD_MAX_AGE_MS + 1);
    expect(admitRecord({ kind: 'present', value: record }, past)).toStrictEqual({
      ok: false,
      error: { kind: 'pass-record-expired' },
    });
  });

  it('admits a record passed at this very moment', () => {
    expect(admitRecord({ kind: 'present', value: record }, new Date(passedAtMs))).toStrictEqual({
      ok: true,
      value: record,
    });
  });

  it('refuses a record whose age cannot be measured against an invalid clock', () => {
    expect(admitRecord({ kind: 'present', value: record }, new Date(Number.NaN))).toStrictEqual({
      ok: false,
      error: { kind: 'pass-record-age-unmeasured' },
    });
  });

  it('refuses a record dated after now', () => {
    const before = new Date(passedAtMs - 1);
    expect(admitRecord({ kind: 'present', value: record }, before)).toStrictEqual({
      ok: false,
      error: { kind: 'pass-record-from-the-future' },
    });
  });

  it('refuses when no record exists, so the seat is told to probe', () => {
    expect(admitRecord({ kind: 'absent' }, now)).toStrictEqual({
      ok: false,
      error: { kind: 'no-pass-record' },
    });
  });

  it.each([
    'not-a-regular-file',
    'not-owned-by-user',
    'writable-by-others',
    'over-size-cap',
    'not-json',
    'unreadable',
  ] satisfies readonly PassRecordRejection[])(
    'refuses a record file the edge would not read (%s), and says why in its own terms',
    (reason) => {
      expect(admitRecord({ kind: 'rejected', reason }, now)).toStrictEqual({
        ok: false,
        error: { kind: 'pass-record-rejected', reason },
      });
    },
  );

  it('refuses a record that is not a pass record', () => {
    expect(
      admitRecord({ kind: 'present', value: { ...record, envelopeDigest: 'x' } }, now),
    ).toStrictEqual({
      ok: false,
      error: { kind: 'invalid-pass-record' },
    });
  });
});

describe('matchBinding', () => {
  it('opens when the version, the path, the envelope and the probe contract all match the record', () => {
    expect(matchBinding(record, binding)).toStrictEqual({ ok: true, value: undefined });
  });

  it('opens on a record passed at another time with other evidence, neither part of the binding', () => {
    const later: PassRecord = {
      ...record,
      passedAt: '2026-09-25T09:00:00Z',
      evidence: ['another probe run'],
    };
    expect(matchBinding(later, binding)).toStrictEqual({ ok: true, value: undefined });
  });

  it.each([
    ['a CLI update', { cliVersion: '0.157.0' }, ['cliVersion']],
    ['a different codex binary', { executablePath: '/usr/local/bin/codex' }, ['executablePath']],
    ['an envelope change', { envelopeDigest: 'b'.repeat(64) }, ['envelopeDigest']],
    [
      'a change to the probe that judges a binding',
      { probeContractVersion: 2 },
      ['probeContractVersion'],
    ],
    [
      'a CLI update that also moved the binary',
      { cliVersion: '0.157.0', executablePath: '/opt/codex/releases/0.157.0/bin/codex' },
      ['cliVersion', 'executablePath'],
    ],
  ] as const)('refuses after %s, naming each field that differs', (_label, change, fields) => {
    expect(matchBinding(record, { ...binding, ...change })).toStrictEqual({
      ok: false,
      error: { kind: 'binding-mismatch', fields },
    });
  });
});
