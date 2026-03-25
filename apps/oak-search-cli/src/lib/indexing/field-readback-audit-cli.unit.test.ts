import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FIELD_READBACK_LEDGER_PATH,
  parseCliArgs,
  resolveLedgerPath,
} from '../../../operations/ingestion/field-readback-audit-cli.js';

describe('field readback audit CLI parsing', () => {
  it('parses --target-version for staged-index audits', () => {
    const args = parseCliArgs([
      '--ledger',
      'ledger.json',
      '--attempts',
      '3',
      '--interval-ms',
      '250',
      '--target-version',
      'v2026-03-21-143022',
      '--emit-json',
    ]);

    expect(args).toEqual({
      ledgerPath: 'ledger.json',
      attempts: 3,
      intervalMs: 250,
      targetVersion: 'v2026-03-21-143022',
      emitJson: true,
    });
  });

  it('rejects an empty --target-version value', () => {
    expect(() => parseCliArgs(['--ledger', 'ledger.json', '--target-version', ''])).toThrow(
      '--target-version must be a non-empty string',
    );
  });

  it('rejects a missing --target-version value', () => {
    expect(() => parseCliArgs(['--ledger', 'ledger.json', '--target-version'])).toThrow(
      'Missing value for --target-version',
    );
  });

  it('uses the default repo-root-relative ledger path when --ledger is omitted', () => {
    expect(parseCliArgs([]).ledgerPath).toBe(DEFAULT_FIELD_READBACK_LEDGER_PATH);
  });

  it('resolves a relative ledger path from the repo root', () => {
    expect(resolveLedgerPath('.agent/field-gap-ledger.json', '/repo/root')).toBe(
      '/repo/root/.agent/field-gap-ledger.json',
    );
  });

  it('leaves an absolute ledger path unchanged', () => {
    expect(resolveLedgerPath('/tmp/field-gap-ledger.json', '/repo/root')).toBe(
      '/tmp/field-gap-ledger.json',
    );
  });

  it('fails fast when a relative ledger path cannot be anchored to the repo root', () => {
    expect(() => resolveLedgerPath('.agent/field-gap-ledger.json', undefined)).toThrow(
      'Cannot resolve relative ledger path without a repo root',
    );
  });
});
