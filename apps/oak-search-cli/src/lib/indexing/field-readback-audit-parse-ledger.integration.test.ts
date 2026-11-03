import { describe, expect, it } from 'vitest';
import { createLedgerParser } from '../../../operations/ingestion/field-readback-audit-lib.js';
import { createInMemoryFileReader } from '../../test-helpers/in-memory-file-reader.js';

const LEDGER_PATH = 'ledgers/field-gap-ledger.json';

/** Parses the ledger at the fixed path from the given in-memory files. */
function parseLedgerFrom(files: Readonly<Record<string, string>>) {
  return createLedgerParser(createInMemoryFileReader(files))(LEDGER_PATH);
}

describe('createLedgerParser', () => {
  it('parses a valid ledger file', async () => {
    const ledger = await parseLedgerFrom({
      [LEDGER_PATH]: JSON.stringify({
        statuses: ['unknown', 'must_be_populated'],
        fields: [
          {
            indexFamily: 'lessons',
            fieldName: 'thread_slugs',
            stage: 'ingest_dispatch_readback',
            status: 'must_be_populated',
            findingRefs: ['F1'],
          },
        ],
      }),
    });

    expect(ledger.statuses).toContain('must_be_populated');
    expect(ledger.fields).toHaveLength(1);
  });

  it('fails naming the path when the ledger file cannot be read', async () => {
    await expect(parseLedgerFrom({})).rejects.toThrow(`Failed to read ledger file: ${LEDGER_PATH}`);
  });

  it('fails naming the path when the ledger file is not JSON', async () => {
    await expect(parseLedgerFrom({ [LEDGER_PATH]: '{invalid-json' })).rejects.toThrow(
      `Ledger file contains invalid JSON: ${LEDGER_PATH}`,
    );
  });

  it('fails naming the path when the JSON shape is invalid', async () => {
    await expect(
      parseLedgerFrom({ [LEDGER_PATH]: JSON.stringify({ statuses: [] }) }),
    ).rejects.toThrow(`Invalid ledger JSON shape: ${LEDGER_PATH}`);
  });
});
