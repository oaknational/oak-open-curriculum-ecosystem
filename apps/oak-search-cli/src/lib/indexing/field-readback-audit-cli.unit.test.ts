import { describe, expect, it } from 'vitest';
import { parseCliArgs } from '../../../operations/ingestion/field-readback-audit-cli.js';

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
});
